/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Compass, Landmark, HeartPulse, Shield, ShoppingCart, Camera } from "lucide-react";

interface PlaceOfInterest {
  name: string;
  type: "stay" | "subway" | "arena" | "food" | "hospital" | "security" | "shopping" | "tourism";
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
  },
  {
    name: "Sanatorio de Los Arcos (Hospital)",
    type: "hospital",
    distance: "10 min. a pie / 4 min. en auto",
    desc: "Prestigioso centro médico privado de alta complejidad y urgencias 24 hs, brindando tranquilidad.",
    lat: -34.5807,
    lng: -58.4298
  },
  {
    name: "Comisaría Vecinal 14B (Seguridad)",
    type: "security",
    distance: "12 min. a pie / 5 min. en auto",
    desc: "Dependencia de la Policía de la Ciudad, garantizando presencia de seguridad y asistencia en la zona.",
    lat: -34.5768,
    lng: -58.4357
  },
  {
    name: "Plaza Serrano / Soho (Paseo)",
    type: "tourism",
    distance: "10 min. a pie",
    desc: "Epicentro comercial y gastronómico del diseño en Palermo, con cafés al aire libre y ferias de arte.",
    lat: -34.5885,
    lng: -58.4302
  },
  {
    name: "Jumbo Palermo (Hipermercado)",
    type: "shopping",
    distance: "15 min. a pie / 5 min. en auto",
    desc: "Gran hipermercado para abastecerse de alimentos y compras mayores durante estadías largas.",
    lat: -34.5768,
    lng: -58.4276
  },
  {
    name: "Mercado de Pulgas (Paseo Cultural)",
    type: "tourism",
    distance: "4 blocks (5 min. a pie)",
    desc: "Hito cultural emblemático de Palermo Hollywood donde se venden antigüedades, arte y muebles de diseño.",
    lat: -34.5786,
    lng: -58.4425
  },
  {
    name: "Centro Cultural de la Ciencia - C3 (Museo)",
    type: "tourism",
    distance: "7 min. a pie",
    desc: "Moderno espacio de divulgación científica con muestras interactivas gratuitas, ideal para visitar.",
    lat: -34.5828,
    lng: -58.4285
  },
  {
    name: "Farmacia 24 hs - Farmacity (Salud)",
    type: "hospital",
    distance: "8 min. a pie / 3 min. en auto",
    desc: "Farmacia y tienda de conveniencia abierta las 24 horas para medicamentos de urgencia.",
    lat: -34.5795,
    lng: -58.4355
  },
  {
    name: "Cajeros Automáticos Link / Banelco",
    type: "shopping",
    distance: "8 min. a pie",
    desc: "Cajeros automáticos y sucursales bancarias (Santander / Galicia) en la Av. Santa Fe para retirar efectivo.",
    lat: -34.5785,
    lng: -58.4345
  }
];

export default function NeighbourhoodMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [activePlace, setActivePlace] = useState<number>(0);
  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);

  // USIG Interactive Layer States
  const [showBicisendas, setShowBicisendas] = useState<boolean>(false);
  const [showEcobici, setShowEcobici] = useState<boolean>(false);
  const [showSube, setShowSube] = useState<boolean>(false);

  // Layer refs to add/remove Leaflet elements dynamically
  const bicisendasLayerRef = useRef<any>(null);
  const ecobiciLayerRef = useRef<any>(null);
  const subeLayerRef = useRef<any>(null);

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

  // Manage USIG dynamic layers when state changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const L = (window as any).L;
    if (!L) return;

    // 1. Manage Bicisendas (Polylines)
    if (bicisendasLayerRef.current) {
      map.removeLayer(bicisendasLayerRef.current);
      bicisendasLayerRef.current = null;
    }
    if (showBicisendas) {
      const fitzRoyCoords = [
        [-34.587546, -58.439668],
        [-34.5847, -58.4350],
        [-34.5818, -58.4300]
      ];
      const gorritiCoords = [
        [-34.5818, -58.4370],
        [-34.5855, -58.4330],
        [-34.5895, -58.4290]
      ];
      const humboldtCoords = [
        [-34.5895, -58.4370],
        [-34.5865, -58.4320],
        [-34.5835, -58.4270]
      ];
      
      const fitzRoyPoly = L.polyline(fitzRoyCoords, { color: "#5F6F52", weight: 4.5, opacity: 0.8 });
      const gorritiPoly = L.polyline(gorritiCoords, { color: "#5F6F52", weight: 4.5, opacity: 0.8 });
      const humboldtPoly = L.polyline(humboldtCoords, { color: "#5F6F52", weight: 4.5, opacity: 0.8 });
      
      const group = L.layerGroup([fitzRoyPoly, gorritiPoly, humboldtPoly]);
      group.addTo(map);
      bicisendasLayerRef.current = group;
    }

    // 2. Manage Ecobici Markers
    if (ecobiciLayerRef.current) {
      map.removeLayer(ecobiciLayerRef.current);
      ecobiciLayerRef.current = null;
    }
    if (showEcobici) {
      const ecobiciPoints = [
        { name: "Estación Ecobici 144 - Fitz Roy y Paraguay", lat: -34.5818, lng: -58.4315, dist: "5 min. a pie" },
        { name: "Estación Ecobici 112 - Distrito Arcos", lat: -34.5805, lng: -58.4295, dist: "6 min. a pie" },
        { name: "Estación Ecobici 219 - Honduras y Bonpland", lat: -34.5855, lng: -58.4345, dist: "4 min. a pie" }
      ];
      
      const markers = ecobiciPoints.map(pt => {
        const customHtml = `
          <div style="
            background-color: #E2725B; 
            color: white; 
            width: 26px; 
            height: 26px; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            border: 2px solid white; 
            box-shadow: 0 3px 6px rgba(0,0,0,0.16);
            transform: translate(-3px, -3px);
          " class="map-marker-hover">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14H9.5L12 10.5h3.5L18 14H15"/></svg>
          </div>
        `;
        const icon = L.divIcon({
          html: customHtml,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
          className: "custom-ecobici-icon"
        });
        const m = L.marker([pt.lat, pt.lng], { icon });
        m.bindPopup(`<b>${pt.name}</b><br/>${pt.dist}`);
        return m;
      });
      
      const group = L.layerGroup(markers);
      group.addTo(map);
      ecobiciLayerRef.current = group;
    }

    // 3. Manage SUBE / Transporte Markers
    if (subeLayerRef.current) {
      map.removeLayer(subeLayerRef.current);
      subeLayerRef.current = null;
    }
    if (showSube) {
      const subePoints = [
        { name: "Carga SUBE - Kiosco Córdoba y Fitz Roy", lat: -34.5872, lng: -58.4393, info: "Carga 24 hs · 1 min a pie" },
        { name: "Carga SUBE - Locutorio Carranza", lat: -34.5765, lng: -58.4375, info: "Carga SUBE · 8 min a pie" },
        { name: "Parada Metrobús J.B. Justo (Paraguay)", lat: -34.5801, lng: -58.4290, info: "Líneas 34, 166 · 6 min a pie" }
      ];
      
      const markers = subePoints.map(pt => {
        const customHtml = `
          <div style="
            background-color: #2F80ED; 
            color: white; 
            width: 26px; 
            height: 26px; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            border: 2px solid white; 
            box-shadow: 0 3px 6px rgba(0,0,0,0.16);
            transform: translate(-3px, -3px);
          " class="map-marker-hover">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          </div>
        `;
        const icon = L.divIcon({
          html: customHtml,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
          className: "custom-sube-icon"
        });
        const m = L.marker([pt.lat, pt.lng], { icon });
        m.bindPopup(`<b>${pt.name}</b><br/>${pt.info}`);
        return m;
      });
      
      const group = L.layerGroup(markers);
      group.addTo(map);
      subeLayerRef.current = group;
    }
  }, [showBicisendas, showEcobici, showSube, leafletLoaded]);

  // Center map on selected place
  const handlePlaceSelect = (index: number) => {
    setActivePlace(index);
    if (mapInstanceRef.current) {
      const place = places[index];
      mapInstanceRef.current.setView([place.lat, place.lng], 15, {
        animate: true,
        duration: 1
      });
    }
  };

  const getPlaceIcon = (type: string) => {
    switch (type) {
      case "stay": return <MapPin className="w-5 h-5 text-[#5F6F52]" />;
      case "subway": return <Navigation className="w-5 h-5 text-neutral-600" />;
      case "arena": return <Landmark className="w-5 h-5 text-neutral-600" />;
      case "hospital": return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case "security": return <Shield className="w-5 h-5 text-blue-600" />;
      case "shopping": return <ShoppingCart className="w-5 h-5 text-amber-600" />;
      case "tourism": return <Camera className="w-5 h-5 text-indigo-600" />;
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

      {/* USIG-inspired interactive layers */}
      <div className="flex flex-wrap items-center gap-2.5 pb-2">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mr-2">Capas de Interés CABA:</span>
        <button
          onClick={() => setShowBicisendas(!showBicisendas)}
          className={`text-xs px-3.5 py-2 rounded-full border transition-all flex items-center gap-1.5 ${
            showBicisendas 
              ? "bg-[#5F6F52] text-white border-[#5F6F52] font-semibold"
              : "bg-white text-neutral-600 border-[#EFEBE4] hover:bg-neutral-50"
          }`}
        >
          <span>🚲</span>
          <span>Ver Bicisendas</span>
        </button>
        <button
          onClick={() => setShowEcobici(!showEcobici)}
          className={`text-xs px-3.5 py-2 rounded-full border transition-all flex items-center gap-1.5 ${
            showEcobici 
              ? "bg-[#E2725B] text-white border-[#E2725B] font-semibold"
              : "bg-white text-neutral-600 border-[#EFEBE4] hover:bg-neutral-50"
          }`}
        >
          <span>🚴</span>
          <span>Estaciones Ecobici</span>
        </button>
        <button
          onClick={() => setShowSube(!showSube)}
          className={`text-xs px-3.5 py-2 rounded-full border transition-all flex items-center gap-1.5 ${
            showSube 
              ? "bg-[#2F80ED] text-white border-[#2F80ED] font-semibold"
              : "bg-white text-neutral-600 border-[#EFEBE4] hover:bg-neutral-50"
          }`}
        >
          <span>💳</span>
          <span>Carga SUBE y Metrobús</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Place selector */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
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
        <div className="lg:col-span-7 h-[300px] lg:h-auto min-h-[420px] rounded-2xl border border-[#EFEBE4] overflow-hidden relative shadow-inner">
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
