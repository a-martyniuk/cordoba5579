/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Compass, Landmark } from "lucide-react";

interface PlaceOfInterest {
  name: string;
  type: "stay" | "subway" | "arena" | "food";
  distance: string;
  desc: string;
  lat: number;
  lng: number;
}

const places: PlaceOfInterest[] = [
  {
    name: "Av. Córdoba 5579 (El Departamento)",
    type: "stay",
    distance: "Ubicación",
    desc: "Moderno departamento a estrenar, ubicado estratégicamente en Palermo Hollywood.",
    lat: -34.587546,
    lng: -58.439668
  },
  {
    name: "Movistar Arena",
    type: "arena",
    distance: "5 min. en auto / 15 min. a pie",
    desc: "El centro de espectáculos más importante de CABA, ideal si vienes a ver un show.",
    lat: -34.5932,
    lng: -58.4485
  },
  {
    name: "Subte Línea D (Estación Ministro Carranza)",
    type: "subway",
    distance: "8 min. a pie",
    desc: "Conexión directa con Plaza de Mayo, el Obelisco, Recoleta y la red general de CABA.",
    lat: -34.5762,
    lng: -58.4378
  },
  {
    name: "Polo Gastronómico Palermo Hollywood",
    type: "food",
    distance: "3 min. a pie",
    desc: "Los mejores bares, cafeterías de especialidad y restaurantes de autor a metros de distancia.",
    lat: -34.5835,
    lng: -58.4325
  }
];

export default function NeighbourhoodMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [activePlace, setActivePlace] = useState<number>(0);
  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);

  // Dynamic Leaflet Script loader
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if Leaflet is already loaded
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    // Load CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      // Clean up script/link could be done, but keeping it is fine for single-page performance
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Destroy existing map instance to prevent duplicate binding errors
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Initialize map
    const defaultCenter = [places[0].lat, places[0].lng];
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 14,
      scrollWheelZoom: false
    });

    mapInstanceRef.current = map;

    // Custom Styled Tiles (Warm Minimalist Theme - CartoDB Positron)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20
    }).addTo(map);

    // Define custom marker colors/styles using standard Leaflet icons or HTML divIcons
    places.forEach((place, index) => {
      const isStay = place.type === "stay";
      
      const customHtml = `
        <div style="
          background-color: ${isStay ? '#5F6F52' : '#1C1B19'}; 
          color: white; 
          width: 32px; 
          height: 32px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 4px 10px rgba(0,0,0,0.15); 
          border: 2.5px solid white;
          transform: translate(-6px, -6px);
          transition: all 0.2s;
        " class="map-marker-hover">
          ${isStay 
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>'
          }
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: "custom-leaflet-icon",
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon }).addTo(map);
      
      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <h4 style="margin: 0 0 4px 0; font-weight: 700; color: #1C1B19; font-size: 13px;">${place.name}</h4>
          <p style="margin: 0; color: #5F6F52; font-size: 11px; font-weight: 600;">${place.distance}</p>
        </div>
      `);

      marker.on("click", () => {
        setActivePlace(index);
      });
    });

  }, [leafletLoaded]);

  // Center map on selected place
  const handlePlaceSelect = (index: number) => {
    setActivePlace(index);
    if (mapInstanceRef.current) {
      const place = places[index];
      mapInstanceRef.current.setView([place.lat, place.lng], 15, {
        animate: true,
        duration: 1
      });
      // Optionally open popup
    }
  };

  const getPlaceIcon = (type: string) => {
    switch (type) {
      case "stay": return <MapPin className="w-5 h-5 text-[#5F6F52]" />;
      case "subway": return <Navigation className="w-5 h-5 text-neutral-600" />;
      case "arena": return <Landmark className="w-5 h-5 text-neutral-600" />;
      default: return <Compass className="w-5 h-5 text-neutral-600" />;
    }
  };

  return (
    <div className="bg-white border border-[#EFEBE4] rounded-3xl p-6 md:p-8 space-y-6">
      <div>
        <h3 className="font-serif text-2xl text-neutral-900 font-semibold">El Barrio: Palermo Hollywood</h3>
        <p className="text-neutral-500 text-sm mt-1">
          Av. Córdoba 5579. Un punto estratégico conectado con la mejor oferta gastronómica y de entretenimiento de la ciudad.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Place selector */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            {places.map((place, idx) => (
              <button
                key={idx}
                onClick={() => handlePlaceSelect(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex gap-4 ${
                  activePlace === idx
                    ? "bg-[#FAF9F7] border-[#5F6F52] ring-1 ring-[#5F6F52] shadow-sm"
                    : "bg-white border-[#EFEBE4] hover:bg-neutral-50"
                }`}
              >
                <div className={`p-2.5 rounded-full ${activePlace === idx ? "bg-white text-[#5F6F52]" : "bg-neutral-100 text-neutral-600"} flex-shrink-0`}>
                  {getPlaceIcon(place.type)}
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-neutral-900 leading-snug">{place.name}</p>
                  <p className="text-[#5F6F52] font-semibold text-xs">{place.distance}</p>
                  {activePlace === idx && (
                    <p className="text-neutral-500 text-xs leading-relaxed mt-1">{place.desc}</p>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="bg-[#FAF9F7] border border-[#EFEBE4] rounded-2xl p-4 text-xs text-neutral-500 leading-relaxed">
            <strong>¿Cómo llegar?</strong> A pasos de la Av. Santa Fe y Av. Juan B. Justo. Múltiples líneas de colectivo (Metrobús) y la línea D de subte a minutos de distancia para moverte cómodamente por Buenos Aires.
          </div>
        </div>

        {/* Right Column: Leaflet Map Container */}
        <div className="lg:col-span-7 h-[300px] lg:h-auto min-h-[350px] rounded-2xl border border-[#EFEBE4] overflow-hidden relative shadow-inner">
          {!leafletLoaded && (
            <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center text-sm text-neutral-500">
              <div className="text-center space-y-2">
                <div className="w-6 h-6 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p>Cargando mapa interactivo...</p>
              </div>
            </div>
          )}
          <div ref={mapContainerRef} className="w-full h-full z-10" />
        </div>
      </div>
    </div>
  );
}
