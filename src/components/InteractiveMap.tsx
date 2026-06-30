"use client";

import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

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

// Custom icons generator
const createCustomIcon = (color: string, isBig: boolean = false) => {
  const size = isBig ? 32 : 24;
  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `<div style="
      background-color: ${color}; 
      width: ${size}px; 
      height: ${size}px; 
      border-radius: 50%; 
      border: 2px solid white; 
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

export default function InteractiveMap({ lang, darkMode }: InteractiveMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fixLeafletIcon();
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#EFEBE4] dark:border-[#353A33] shadow-sm bg-neutral-100 dark:bg-neutral-800 h-[280px] animate-pulse" />
  );

  const center: [number, number] = [-34.586, -58.441];

  // Elegant grayscale map tiles for a premium look
  const tileLayerUrl = darkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#EFEBE4] dark:border-[#353A33] shadow-sm h-[280px]">
      <MapContainer 
        center={center} 
        zoom={15} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url={tileLayerUrl}
        />
        {points.map((point, index) => {
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

          const title = lang === "es" ? point.name : point.nameEn;
          const desc = lang === "es" ? point.descEs : point.descEn;

          return (
            <Marker 
              key={index}
              position={[point.lat, point.lng]}
              icon={createCustomIcon(color, isBig)}
            >
              <Popup>
                <div style={{ fontFamily: 'sans-serif', fontSize: '11px', padding: '2px', color: '#1C1E1B' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '12px', color }}>{title}</h4>
                  <p style={{ margin: 0, lineHeight: '1.3' }}>{desc}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
