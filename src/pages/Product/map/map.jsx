import React, { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import { fromLonLat } from "ol/proj";
import { Style, Icon } from "ol/style";
import OSM from "ol/source/OSM";

const MapComponent = () => {
  const mapRef = useRef(null); // Referensi untuk elemen DOM peta

  useEffect(() => {
    // Koordinat tempat (longitude, latitude)
    const place = [107.57634352477324, -6.87436891415509];

    // Peta dasar menggunakan OpenStreetMap
    const basemap = new TileLayer({
      source: new OSM({
        attributions:
          '<a href="https://petapedia.github.io/" target="_blank">&copy; PetaPedia Indonesia</a>',
      }),
    });

    // Sumber data untuk marker
    const markerSource = new VectorSource();

    // Layer untuk marker
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

    // Tambahkan marker ke lokasi
    const marker = new Feature({
      geometry: new Point(fromLonLat(place)),
    });
    markerSource.addFeature(marker);

    // Inisialisasi peta
    const map = new Map({
      target: mapRef.current,
      layers: [basemap, markerLayer],
      view: new View({
        center: fromLonLat(place),
        zoom: 16,
      }),
    });

    // Cleanup saat komponen dilepas
    return () => {
      map.setTarget(null);
    };
  }, []);

  return (
    <div>
      {/* Elemen DOM untuk peta */}
      <div
        id="listing-map"
        ref={mapRef}
        style={{ width: "100%", height: "500px" }}
      ></div>
    </div>
  );
};

export default MapComponent;
