"use client";

import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon asset issue in Next.js/Webpack
const fixLeafletIcon = () => {
  // @ts-expect-error - Leaflet private method _getIconUrl is not defined in public types
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

interface MapPoint {
  name: string;
  nameEn: string;
  lat: number;
  lng: number;
  category: "apartment" | "food" | "cafe" | "subway";
  descEs: string;
  descEn: string;
}

const points: MapPoint[] = [
  {
    name: "Córdoba 5579",
    nameEn: "Cordoba 5579",
    lat: -34.587644,
    lng: -58.439803,
    category: "apartment",
    descEs: "Tu departamento de diseño en Palermo Hollywood.",
    descEn: "Your design apartment in Palermo Hollywood."
  },
  {
    name: "Las Cabras (Parrilla)",
    nameEn: "Las Cabras (Steakhouse)",
    lat: -34.581562,
    lng: -58.435882,
    category: "food",
    descEs: "Parrilla tradicional argentina a solo 2 cuadras.",
    descEn: "Traditional Argentine steakhouse just 2 blocks away."
  },
  {
    name: "Cuervo Café",
    nameEn: "Cuervo Cafe",
    lat: -34.5828,
    lng: -58.4399,
    category: "cafe",
    descEs: "Café de especialidad premium y pastelería de autor.",
    descEn: "Premium specialty coffee and artisan pastry."
  },
  {
    name: "Vive Café",
    nameEn: "Vive Cafe",
    lat: -34.5835,
    lng: -58.4385,
    category: "cafe",
    descEs: "Café con impronta colombiana, excelente pastelería.",
    descEn: "Colombian-style coffee with excellent pastries."
  },
  {
    name: "Subte Línea B (Dorrego)",
    nameEn: "Subway Line B (Dorrego)",
    lat: -34.5866,
    lng: -58.4485,
    category: "subway",
    descEs: "Estación de subte más cercana para moverte por la ciudad.",
    descEn: "Nearest subway station for city transportation."
  }
];

interface InteractiveMapProps {
  lang: "es" | "en";
  darkMode: boolean;
}

export default function InteractiveMap({ lang, darkMode }: InteractiveMapProps) {
  useEffect(() => {
    fixLeafletIcon();

    const mapContainer = document.getElementById("leaflet-map");
    if (!mapContainer) return;

    // Center map on Córdoba 5579
    const center: [number, number] = [-34.586, -58.441];
    const map = L.map("leaflet-map", {
      center,
      zoom: 15,
      scrollWheelZoom: false
    });

    // Elegant grayscale map tiles for a premium look
    const tileLayerUrl = darkMode
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    L.tileLayer(tileLayerUrl, {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
    }).addTo(map);

    // Custom icons
    const createCustomIcon = (color: string, isBig: boolean = false) => {
      const size = isBig ? 32 : 24;
      return L.divIcon({
        className: "custom-leaflet-icon",
        html: `<div style="
          background-color: ${color}; 
          width: ${size}px; 
          height: ${size}px; 
          border-radius: 50%; 
          border: 2px solid #white; 
          box-shadow: 0 2px 5px rgba(0,0,0,0.3); 
          display: flex; 
          align-items: center; 
          justify-content: center;
          color: white; 
          font-size: ${isBig ? '14px' : '10px'};
          font-weight: bold;
        ">${isBig ? '📍' : '⭐'}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });
    };

    // Draw markers
    points.forEach((point) => {
      let color = "#5F6F52"; // default brand olive
      let isBig = false;

      if (point.category === "apartment") {
        color = "#ff5e7e"; // Pinkish highlight for the apartment
        isBig = true;
      } else if (point.category === "food") {
        color = "#B06161";
      } else if (point.category === "subway") {
        color = "#387ADF";
      } else if (point.category === "cafe") {
        color = "#A9B388";
      }

      const marker = L.marker([point.lat, point.lng], {
        icon: createCustomIcon(color, isBig)
      }).addTo(map);

      const title = lang === "es" ? point.name : point.nameEn;
      const desc = lang === "es" ? point.descEs : point.descEn;

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 11px; padding: 2px; color: #1C1E1B;">
          <h4 style="margin: 0 0 4px 0; font-weight: bold; font-size: 12px; color: ${color};">${title}</h4>
          <p style="margin: 0; line-height: 1.3;">${desc}</p>
        </div>
      `);
    });

    return () => {
      map.remove();
    };
  }, [lang, darkMode]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#EFEBE4] dark:border-[#353A33] shadow-sm">
      <div id="leaflet-map" className="w-full h-[280px]" />
    </div>
  );
}
