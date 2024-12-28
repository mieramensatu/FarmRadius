import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import { Style, Icon } from "ol/style";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import Swal from "sweetalert2";

const attributions =
  '<a href="https://petapedia.github.io/" target="_blank">&copy; PetaPedia Indonesia</a>';
const fallbackPlace = [107.57634352477324, -6.87436891415509];

const MapComponent = () => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [clickedCoordinates, setClickedCoordinates] = useState(null);
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [placeName, setPlaceName] = useState(""); // State untuk nama tempat

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
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
          <path fill="red" d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 10.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>`),
        scale: 1,
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
            Swal.fire({
              title: "GPS Error",
              text: "Failed to get your location. Using fallback location.",
              icon: "warning",
            });
            setUserCoordinates(fallbackPlace);
          }
        );
      } else {
        Swal.fire({
          title: "Unsupported",
          text: "Your browser does not support GPS.",
          icon: "error",
        });
        setUserCoordinates(fallbackPlace);
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    if (userCoordinates) {
      const map = new Map({
        target: mapRef.current,
        layers: [basemap, markerLayer],
        view: new View({
          center: fromLonLat(userCoordinates),
          zoom: 16,
        }),
      });

      setMapInstance(map);

      addMarker(fromLonLat(userCoordinates));

      // Event click pada map
      map.on("singleclick", (event) => {
        const coordinates = toLonLat(event.coordinate);
        setClickedCoordinates(coordinates);
        addMarker(event.coordinate);
        fetchPlaceName(coordinates); // Panggil fungsi reverse geocoding
      });

      return () => map.setTarget(null);
    }
  }, [userCoordinates]);

  // Fungsi untuk menambahkan marker
  const addMarker = (coordinate) => {
    const marker = new Feature({
      geometry: new Point(coordinate),
    });

    markerSource.clear();
    markerSource.addFeature(marker);
  };

  // Fungsi untuk mendapatkan nama tempat dari OpenStreetMap Nominatim API
  const fetchPlaceName = async (coordinates) => {
    const [longitude, latitude] = coordinates;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();

      if (data && data.display_name) {
        const place = data.display_name;
        setPlaceName(place);

        Swal.fire({
          title: "Place Info",
          text: `You clicked on: ${place}`,
          icon: "info",
        });
      } else {
        setPlaceName("Unknown Place");
        Swal.fire({
          title: "Place Info",
          text: "Could not find a name for this location.",
          icon: "warning",
        });
      }
    } catch (error) {
      console.error("Error fetching place name:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch place name.",
        icon: "error",
      });
    }
  };

  return (
    <div id="listing-map">
      <div
        ref={mapRef}
        style={{ width: "100%", height: "500px", borderRadius: "20px", overflow: "hidden" }}
      ></div>
      <div style={{ marginTop: "10px" }}>
        {clickedCoordinates && (
          <p>
            Clicked Coordinates: {clickedCoordinates[0].toFixed(6)},{" "}
            {clickedCoordinates[1].toFixed(6)}
          </p>
        )}
        {placeName && <p>Place Name: {placeName}</p>}
      </div>
    </div>
  );
};

export default MapComponent;
