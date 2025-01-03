import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import { Style, Icon, Stroke } from "ol/style";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import Overlay from "ol/Overlay";
import Cookies from "js-cookie";

const attributions =
  '<a href="https://petapedia.github.io/" target="_blank">&copy; PetaPedia Indonesia</a>';
const fallbackPlace = [107.57634352477324, -6.87436891415509];

const MapComponent = () => {
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [popupContent, setPopupContent] = useState({});
  const [endCoordinates, setEndCoordinates] = useState(null);

  const markerSource = new VectorSource();

  const basemap = new TileLayer({
    source: new OSM({ attributions }),
  });

  const markerLayer = new VectorLayer({
    source: markerSource,
    style: new Style({
      image: new Icon({
        src:
          "data:image/svg+xml;charset=utf-8," +
          encodeURIComponent(`  
        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"0 0 24 24\">
          <path fill=\"blue\" d=\"M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 10.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z\"/>
        </svg>`),
        scale: 0.8,
        anchor: [0.5, 1],
      }),
    }),
  });

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserCoordinates([longitude, latitude]);
          },
          (error) => {
            console.error("Error getting location:", error);
            setUserCoordinates(fallbackPlace);
          }
        );
      } else {
        setUserCoordinates(fallbackPlace);
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    const fetchAllPeternak = async () => {
      try {
        const token = Cookies.get("login");

        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await fetch("http://localhost:8080/all/peternak", {
          headers,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch peternak data");
        }
        const data = await response.json();
        addPeternakMarkers(data.data);
      } catch (error) {
        console.error("Error fetching peternak data:", error);
      }
    };

    if (userCoordinates) {
      const map = new Map({
        target: mapRef.current,
        layers: [basemap, markerLayer],
        view: new View({
          center: fromLonLat(userCoordinates),
          zoom: 16,
        }),
      });

      const popup = new Overlay({
        element: popupRef.current,
        positioning: "bottom-center",
        stopEvent: false,
        offset: [0, -10],
      });

      map.addOverlay(popup);
      setMapInstance(map);

      const userMarker = addUserMarker(fromLonLat(userCoordinates));

      map.on("singleclick", async (event) => {
        const clickedFeature = map.forEachFeatureAtPixel(
          event.pixel,
          (feature) => feature
        );

        if (clickedFeature) {
          const coordinates = toLonLat(
            clickedFeature.getGeometry().getCoordinates()
          );
          setEndCoordinates(coordinates);

          // Query OSRM API for route
          const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${userCoordinates[0]},${userCoordinates[1]};${coordinates[0]},${coordinates[1]}?overview=full&geometries=geojson`;

          try {
            const response = await fetch(osrmUrl);
            const data = await response.json();

            if (!data.routes || data.routes.length === 0) {
              console.error("No route found.");
              return;
            }

            const route = data.routes[0];
            const distance = route.distance / 1000; // in km
            const duration = route.duration / 60; // in minutes

            setPopupContent((prev) => ({
              ...prev,
              description: `Jarak: ${distance.toFixed(
                2
              )} km, Waktu Tempuh: ${duration.toFixed(2)} menit`,
            }));

            addRouteToMap(route.geometry.coordinates);
          } catch (error) {
            console.error("Error fetching route:", error);
          }
        }
      });

      map.on("pointermove", (event) => {
        const hoveredFeature = map.forEachFeatureAtPixel(
          event.pixel,
          (feature) => feature
        );

        if (hoveredFeature) {
          // Periksa apakah fitur adalah marker (bukan garis jalur)
          const { geometry } = hoveredFeature.getProperties();
          if (geometry && geometry.getType() === "Point") {
            const { nama, description, image_farm } =
              hoveredFeature.getProperties();
            setPopupContent({ nama, description, image_farm });
            popup.setPosition(hoveredFeature.getGeometry().getCoordinates());
          } else {
            // Sembunyikan popup jika bukan marker
            setPopupContent({});
            popup.setPosition(undefined);
          }
        } else {
          // Sembunyikan popup jika tidak ada fitur
          setPopupContent({});
          popup.setPosition(undefined);
        }
      });

      fetchAllPeternak();

      return () => map.setTarget(null);
    }
  }, [userCoordinates]);

  useEffect(() => {
    if (userCoordinates) {
      mapInstance?.on("singleclick", async (event) => {
        const clickedFeature = mapInstance.forEachFeatureAtPixel(
          event.pixel,
          (feature) => feature
        );

        if (clickedFeature) {
          const peternakCoordinates = toLonLat(
            clickedFeature.getGeometry().getCoordinates()
          );
          setEndCoordinates(peternakCoordinates);

          // Query OSRM API for route
          const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${userCoordinates[0]},${userCoordinates[1]};${peternakCoordinates[0]},${peternakCoordinates[1]}?overview=full&geometries=geojson`;

          try {
            const response = await fetch(osrmUrl);
            const data = await response.json();

            if (!data.routes || data.routes.length === 0) {
              console.error("No route found.");
              return;
            }

            const route = data.routes[0];
            const distance = route.distance / 1000; // Convert to km
            const duration = route.duration / 60; // Convert to minutes

            console.log(`Jarak: ${distance.toFixed(2)} km`);
            console.log(`Waktu Tempuh: ${duration.toFixed(2)} menit`);

            // Add route to map
            addRouteToMap(route.geometry.coordinates);
          } catch (error) {
            console.error("Error fetching route:", error);
          }
        }
      });
    }
  }, [userCoordinates, mapInstance]);

  const addUserMarker = (coordinate) => {
    const userMarker = new Feature({
      geometry: new Point(coordinate),
      nama: "Your Location",
    });
    userMarker.setStyle(
      new Style({
        image: new Icon({
          src:
            "data:image/svg+xml;charset=utf-8," +
            encodeURIComponent(`
            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"0 0 24 24\">
              <path fill=\"green\" d=\"M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 10.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z\"/>
            </svg>`),
          scale: 0.8,
          anchor: [0.5, 1],
        }),
      })
    );
    markerSource.addFeature(userMarker);
    return userMarker;
  };

  const addPeternakMarkers = (peternakData) => {
    peternakData.forEach((peternak) => {
      const { nama, description, image_farm, latitude, longitude } = peternak;
      const coordinate = fromLonLat([
        parseFloat(latitude),
        parseFloat(longitude),
      ]);
      addMarker(coordinate, { nama, description, image_farm });
    });
  };

  const addMarker = (coordinate, properties) => {
    const marker = new Feature({
      geometry: new Point(coordinate),
      ...properties,
    });
    markerSource.addFeature(marker);
    return marker;
  };

  const addRouteToMap = (coordinates) => {
    if (!mapInstance) {
      console.error("Map instance is not initialized.");
      return;
    }
    // Clear existing route layers if necessary
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: "green", // Customize color as needed
          width: 4,
        }),
      }),
    });
    mapInstance.addLayer(vectorLayer);

    // Create a LineString feature for the route
    const routeFeature = new Feature({
      geometry: new LineString(coordinates.map((coord) => fromLonLat(coord))),
    });

    // Add the LineString feature to the vector source
    vectorSource.addFeature(routeFeature);

    // Adjust the map view to fit the new route
    mapInstance
      .getView()
      .fit(vectorSource.getExtent(), { padding: [50, 50, 50, 50] });
  };

  return (
    <div id="listing-map" style={{ position: "relative" }}>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "500px",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      ></div>
      <div
        ref={popupRef}
        style={{
          position: "absolute",
          background: "white",
          padding: "8px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          whiteSpace: "normal",
          transform: "translate(-50%, -100%)",
          pointerEvents: "none",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
          width: "200px",
        }}
      >
        {popupContent.nama && (
          <div>
            <h5 style={{ margin: "8px 0", textAlign: "center" }}>
              {popupContent.nama}
            </h5>
            {popupContent.image_farm && (
              <img
                src={popupContent.image_farm}
                alt={popupContent.nama}
                style={{
                  width: "100%",
                  height: "100px",
                  borderRadius: "10px",
                  marginBottom: "8px",
                }}
              />
            )}
            <p style={{ margin: 0, textAlign: "justify", fontSize: "12px" }}>
              {popupContent.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
