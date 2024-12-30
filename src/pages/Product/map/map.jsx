import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import { Style, Icon } from "ol/style";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import Cookies from "js-cookie";

const attributions =
  '<a href="https://petapedia.github.io/" target="_blank">&copy; PetaPedia Indonesia</a>';
const fallbackPlace = [107.57634352477324, -6.87436891415509];

const MapComponent = () => {
  const mapRef = useRef(null);
  const [userCoordinates, setUserCoordinates] = useState(null);

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
          () => {
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
        if (!token) return;

        const response = await fetch("http://localhost:8080/all/peternak", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

      addMarker(fromLonLat(userCoordinates));

      fetchAllPeternak();

      return () => map.setTarget(null);
    }
  }, [userCoordinates]);

  const addMarker = (coordinate) => {
    const marker = new Feature({
      geometry: new Point(coordinate),
    });
    markerSource.addFeature(marker);
    return marker;
  };

  const addPeternakMarkers = (peternakData) => {
    peternakData.forEach(() => {
      const randomCoordinate = [
        107.57634352477324 + Math.random() * 0.01,
        -6.87436891415509 + Math.random() * 0.01,
      ];
      addMarker(fromLonLat(randomCoordinate));
    });
  };

  return (
    <div id="listing-map" style={{ position: "relative" }}>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "500px", borderRadius: "20px", overflow: "hidden" }}
      ></div>
    </div>
  );
};

export default MapComponent;
