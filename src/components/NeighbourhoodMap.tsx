/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { 
  MapPin, 
  Train, 
  Bus, 
  ShoppingBag, 
  Utensils, 
  Activity, 
  Shield, 
  Trees, 
  Landmark, 
  Ticket, 
  Compass 
} from "lucide-react";
import { parseCSV } from "../utils/csvParser";
import proj4 from "proj4";

// Configure EPSG:9498 / EPSG:9497 (CABA 2019 / POSGAR 2007) local projected coordinate system
proj4.defs("EPSG:9498", "+proj=tmerc +lat_0=-34.6292666666667 +lon_0=-58.4633083333333 +k=1 +x_0=20000 +y_0=70000 +ellps=WGS84 +units=m +no_defs");

function convertEPSG9498ToWGS84(x: number, y: number): { lat: number; lng: number } {
  // proj4 returns [longitude, latitude]
  const [lon, lat] = proj4("EPSG:9498", "WGS84", [x, y]);
  return { lat, lng: lon };
}

// Client-side CABA geocoder
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  // 1. Try Argentina National GeoRef API (HTTPS, CORS-enabled, highly reliable)
  try {
    let queryAddr = address;
    if (!address.toLowerCase().includes("buenos aires") && !address.toLowerCase().includes("caba")) {
      queryAddr = `${address}, CABA`;
    }
    const url = `https://apis.datos.gob.ar/georef/api/direcciones?direccion=${encodeURIComponent(queryAddr)}&provincia=caba`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (json.direcciones && json.direcciones.length > 0) {
        const loc = json.direcciones[0].ubicacion;
        if (loc && typeof loc.lat === "number" && typeof loc.lon === "number") {
          return { lat: loc.lat, lng: loc.lon };
        }
      }
    }
  } catch (e) {
    console.error("GeoRef geocoding failed, trying fallback:", e);
  }

  // 2. Try USIG Normalizer API (CABA local geocoder, HTTP/HTTPS)
  try {
    const url = `https://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=${encodeURIComponent(address)}&geocodificar=TRUE&srid=4326`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (json.direccionesNormalizadas && json.direccionesNormalizadas.length > 0) {
        const coords = json.direccionesNormalizadas[0].coordenadas;
        if (coords) {
          const x = parseFloat(coords.x);
          const y = parseFloat(coords.y);
          if (!isNaN(x) && !isNaN(y)) {
            return { lat: y, lng: x };
          }
        }
      }
    }
  } catch (e) {
    console.error("USIG normalizer geocoding failed:", e);
  }

  return null;
}

interface PlaceOfInterest {
  name: string;
  type: "stay" | "subway" | "metrobus" | "shopping" | "food" | "hospital" | "security" | "park" | "museum" | "theater";
  distance: string;
  desc: string;
  lat: number;
  lng: number;
}

const fallbackPlaces: PlaceOfInterest[] = [
  {
    name: "Av. Córdoba 5579 (El Departamento)",
    type: "stay",
    distance: "Ubicación",
    desc: "Moderno departamento a estrenar, ubicado estratégicamente en Palermo Hollywood.",
    lat: -34.587546,
    lng: -58.439668
  },
  {
    name: "Estación Ministro Carranza (Línea D)",
    type: "subway",
    distance: "8 min. a pie",
    desc: "Línea directa al Obelisco, Plaza de Mayo y combinaciones con toda la red de subtes.",
    lat: -34.5754,
    lng: -58.4349
  },
  {
    name: "Estación Palermo (Línea D)",
    type: "subway",
    distance: "10 min. a pie",
    desc: "Ubicada en Av. Santa Fe y Av. Juan B. Justo, junto al centro comercial Distrito Arcos.",
    lat: -34.5815,
    lng: -58.4285
  },
  {
    name: "Metrobús Juan B. Justo - Estación Córdoba",
    type: "metrobus",
    distance: "2 min. a pie",
    desc: "Carril exclusivo de colectivos (líneas 34, 166) cruzando de este a oeste de la ciudad.",
    lat: -34.5872,
    lng: -58.4411
  },
  {
    name: "Metrobús Santa Fe - Estación Carranza",
    type: "metrobus",
    distance: "8 min. a pie",
    desc: "Conexión con múltiples líneas que te llevan directo a Plaza Italia, Recoleta y Microcentro.",
    lat: -34.5768,
    lng: -58.4357
  },
  {
    name: "Distrito Arcos Outlet Premium",
    type: "shopping",
    distance: "10 min. a pie",
    desc: "Centro comercial a cielo abierto de primeras marcas, cafeterías gourmet y locales de diseño.",
    lat: -34.5815,
    lng: -58.4285
  },
  {
    name: "Don Julio Parrilla",
    type: "food",
    distance: "12 min. a pie",
    desc: "Galardonada como una de las mejores parrillas del mundo. Carnes de pastura maduradas y excelente cava.",
    lat: -34.5863,
    lng: -58.4243
  },
  {
    name: "La Mar Cebichería",
    type: "food",
    distance: "7 min. a pie",
    desc: "Prestigioso restaurante de cocina peruana y pescados frescos, ideal para cenar en su hermoso patio.",
    lat: -34.5786,
    lng: -58.4385
  },
  {
    name: "Sanatorio de Los Arcos",
    type: "hospital",
    distance: "6 min. en auto / 12 min. a pie",
    desc: "Prestigioso sanatorio privado de alta complejidad con servicio de guardia de urgencias las 24 horas.",
    lat: -34.58102,
    lng: -58.42995
  },
  {
    name: "Hospital de Agudos Dr. J. A. Fernández",
    type: "hospital",
    distance: "10 min. en auto",
    desc: "Hospital público general de alta complejidad de la Ciudad de Buenos Aires con guardia de urgencias.",
    lat: -34.5806,
    lng: -58.4069
  },
  {
    name: "Comisaría Vecinal 14B - Policía de la Ciudad",
    type: "security",
    distance: "10 min. a pie",
    desc: "Seccional oficial de policía de la Ciudad, garantizando presencia de seguridad y asistencia en la zona.",
    lat: -34.57329,
    lng: -58.43905
  },
  {
    name: "Destacamento de Bomberos Palermo",
    type: "security",
    distance: "10 min. a pie / 4 min. en auto",
    desc: "Cuartel oficial de Bomberos de la Ciudad de Buenos Aires en Guatemala 5966.",
    lat: -34.5775,
    lng: -58.4356
  },
  {
    name: "Plaza Mafalda (Colegiales)",
    type: "park",
    distance: "10 min. a pie",
    desc: "Hermosa plaza arbolada con juegos infantiles y obras dedicadas a Mafalda, ideal para caminar o descansar.",
    lat: -34.5775,
    lng: -58.4465
  },
  {
    name: "Plaza Cortázar (Plaza Serrano)",
    type: "park",
    distance: "12 min. a pie",
    desc: "El corazón de Palermo Soho, famoso por su feria artesanal de diseño y una vibrante oferta de bares.",
    lat: -34.5887,
    lng: -58.4301
  },
  {
    name: "Centro Cultural de la Ciencia (C3)",
    type: "museum",
    distance: "8 min. a pie",
    desc: "Museo científico interactivo con talleres y exhibiciones modernas, ideal para visitar.",
    lat: -34.582566,
    lng: -58.429118
  },
  {
    name: "MALBA (Museo de Arte Latinoamericano)",
    type: "museum",
    distance: "8 min. en auto",
    desc: "Excepcional colección de arte latinoamericano moderno y contemporáneo en un edificio icónico.",
    lat: -34.5772,
    lng: -58.4042
  },
  {
    name: "Teatro Regio",
    type: "theater",
    distance: "7 min. a pie",
    desc: "Pertenece al Complejo Teatral de Buenos Aires, ofreciendo obras dramáticas con grandes elencos locales.",
    lat: -34.584361,
    lng: -58.445889
  },
  {
    name: "Teatro Vorterix",
    type: "theater",
    distance: "15 min. a pie",
    desc: "Gran espacio de espectáculos, recitales de rock nacional e internacional, y transmisiones de streaming.",
    lat: -34.5719,
    lng: -58.4449
  }
];

const categories = [
  { id: "all", name: "Todos", icon: "✨" },
  { id: "subway", name: "Subtes", icon: "🚇" },
  { id: "metrobus", name: "Metrobús", icon: "🚌" },
  { id: "shopping", name: "Shoppings", icon: "🛍️" },
  { id: "food", name: "Gastronomía", icon: "🍽️" },
  { id: "hospital", name: "Hospitales", icon: "🏥" },
  { id: "security", name: "Comisarías", icon: "👮" },
  { id: "park", name: "Parques", icon: "🌳" },
  { id: "museum", name: "Museos", icon: "🏛️" },
  { id: "theater", name: "Teatros", icon: "🎭" }
];

const datasetUrls: Record<string, { name: string; url: string }> = {
  subway: { name: "Red de Subtes", url: "https://data.buenosaires.gob.ar/dataset/subte" },
  metrobus: { name: "Corredores de Metrobús", url: "https://data.buenosaires.gob.ar/dataset/metrobus" },
  shopping: { name: "Centros Comerciales", url: "https://data.buenosaires.gob.ar/dataset/centro-comercial" },
  hospital: { name: "Hospitales Públicos", url: "https://data.buenosaires.gob.ar/dataset/hospitales" },
  security: { name: "Seguridad y Policía", url: "https://data.buenosaires.gob.ar/dataset/comisarias" },
  park: { name: "Espacios Verdes y Plazas", url: "https://data.buenosaires.gob.ar/dataset/espacios-verdes" },
  museum: { name: "Museos de la Ciudad", url: "https://data.buenosaires.gob.ar/dataset/museos" },
  theater: { name: "Salas de Teatro", url: "https://data.buenosaires.gob.ar/dataset/teatros" }
};

const getCategoryColor = (type: string): string => {
  switch (type) {
    case "stay": return "#5F6F52"; // Olive Green
    case "subway": return "#2D9CDB"; // Light Blue
    case "metrobus": return "#F2C94C"; // Amber Yellow
    case "shopping": return "#9B51E0"; // Purple
    case "food": return "#EB5757"; // Coral Red
    case "hospital": return "#27AE60"; // Soft Green
    case "security": return "#2F80ED"; // Royal Blue
    case "park": return "#219653"; // Dark Green
    case "museum": return "#828282"; // Slate Gray
    case "theater": return "#F2994A"; // Warm Orange
    default: return "#1C1B19"; // Charcoal Dark
  }
};

const getCategoryHtmlIcon = (type: string): string => {
  switch (type) {
    case "stay":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
    case "subway":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m16 19 2 3"/></svg>`;
    case "metrobus":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="16" x="3" y="4" rx="2" ry="2"/><path d="M7 10h4v4H7zm6 0h4v4h-4zM6 20h12"/></svg>`;
    case "shopping":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
    case "food":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`;
    case "hospital":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>`;
    case "security":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    case "park":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-8a5 5 0 0 0-5-5h-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h2"/><path d="M4 21v-6a5 5 0 0 1 5-5h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H8"/><path d="M12 21V9a4 4 0 0 1 4-4h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2"/></svg>`;
    case "museum":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="21" y2="14"/><line x1="14" x2="14" y1="21" y2="14"/><line x1="10" x2="10" y1="21" y2="14"/><line x1="6" x2="6" y1="21" y2="14"/><path d="M3 21h18"/><path d="M3 10h18"/><path d="M3 7l9-4 9 4M4 10h16v4H4z"/></svg>`;
    case "theater":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M9 5v14"/><path d="M15 5v14"/><path d="M9 10h6"/><path d="M9 14h6"/></svg>`;
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`;
  }
};

interface NeighbourhoodMapProps {
  sheetUrl?: string;
}

export default function NeighbourhoodMap({ sheetUrl }: NeighbourhoodMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  
  const [placesList, setPlacesList] = useState<PlaceOfInterest[]>(fallbackPlaces);
  const [activePlace, setActivePlace] = useState<number>(0);
  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // USIG Interactive Layer States
  const [showBicisendas, setShowBicisendas] = useState<boolean>(false);
  const [showEcobici, setShowEcobici] = useState<boolean>(false);
  const [showSube, setShowSube] = useState<boolean>(false);
  const [shouldDrawLocalLayers, setShouldDrawLocalLayers] = useState<boolean>(true);

  // Layer refs to add/remove Leaflet elements dynamically
  const bicisendasLayerRef = useRef<any>(null);
  const ecobiciLayerRef = useRef<any>(null);
  const subeLayerRef = useRef<any>(null);

  // Load places dynamically if sheetUrl is provided
  useEffect(() => {
    if (!sheetUrl) {
      setPlacesList(fallbackPlaces);
      return;
    }

    async function loadPlaces(targetUrl: string) {
      try {
        const response = await fetch(targetUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch sheet content: ${response.statusText}`);
        }
        const csvText = await response.text();
        const parsedData = parseCSV(csvText);

        if (parsedData.length <= 1) {
          setPlacesList(fallbackPlaces);
          return;
        }

        const headers = parsedData[0].map(h => h.trim().toLowerCase());
        const nameIdx = headers.findIndex(h => h.includes("nom") || h.includes("name"));
        const categoryIdx = headers.findIndex(h => h.includes("cat"));
        const distIdx = headers.findIndex(h => h.includes("dist"));
        const detailIdx = headers.findIndex(h => h.includes("det") || h.includes("desc"));
        const latIdx = headers.findIndex(h => h.includes("lat") || h.includes("y_coord") || h.includes("coor_y"));
        const lngIdx = headers.findIndex(h => h.includes("lng") || h.includes("lon") || h.includes("long") || h.includes("x_coord") || h.includes("coor_x"));
        const addressIdx = headers.findIndex(h => h.includes("dir") || h.includes("add") || h.includes("calle") || h.includes("ubic"));

        const parsePromises = parsedData.slice(1).map(async (row) => {
          if (!row || row.length === 0) return null;
          
          const name = nameIdx !== -1 && nameIdx < row.length ? row[nameIdx].trim() : "";
          if (!name) return null;

          const category = categoryIdx !== -1 && categoryIdx < row.length ? (row[categoryIdx] as any) : "stay";
          const distance = distIdx !== -1 && distIdx < row.length ? row[distIdx].trim() : "";
          const desc = detailIdx !== -1 && detailIdx < row.length ? row[detailIdx].trim() : "";
          let lat = latIdx !== -1 && latIdx < row.length ? parseFloat(row[latIdx]) : NaN;
          let lng = lngIdx !== -1 && lngIdx < row.length ? parseFloat(row[lngIdx]) : NaN;
          const address = addressIdx !== -1 && addressIdx < row.length ? row[addressIdx].trim() : "";

          // 1. If coordinates are present, check if they are EPSG:9498 or WGS84
          if (!isNaN(lat) && !isNaN(lng)) {
            const isLocalGrid = (val: number) => val > 5000 && val < 150000;
            if (isLocalGrid(lat) || isLocalGrid(lng)) {
              let x = lng;
              let y = lat;
              // Swapped case detection based on standard CABA grid ranges
              // X range is ~10000 to ~45000, Y range is ~55000 to ~85000
              if (lat > 5000 && lat < 50000) {
                x = lat;
                y = lng;
              }
              try {
                const wgs84 = convertEPSG9498ToWGS84(x, y);
                lat = wgs84.lat;
                lng = wgs84.lng;
              } catch (e) {
                console.error("Error converting EPSG:9498 coordinates:", e);
              }
            }
            return { name, type: category, distance, desc, lat, lng };
          }

          // 2. If coordinates are missing, attempt to geocode using the address
          if (address) {
            try {
              const coords = await geocodeAddress(address);
              if (coords) {
                return { name, type: category, distance, desc, lat: coords.lat, lng: coords.lng };
              }
            } catch (err) {
              console.error(`Error geocoding address "${address}":`, err);
            }
          }

          return null;
        });

        const parsedPlaces = (await Promise.all(parsePromises)).filter((p): p is PlaceOfInterest => p !== null);

        // Fail-safe: Ensure there is always a 'stay' point representing the Airbnb location.
        const hasStay = parsedPlaces.some(p => p.type === "stay");
        if (!hasStay) {
          parsedPlaces.unshift(fallbackPlaces[0]);
        }

        if (parsedPlaces.length > 0) {
          setPlacesList(parsedPlaces);
        } else {
          setPlacesList(fallbackPlaces);
        }
      } catch (error) {
        console.error("Error loading remote map points, using local fallback:", error);
        setPlacesList(fallbackPlaces);
      }
    }

    loadPlaces(sheetUrl);
  }, [sheetUrl]);

  // Dynamic Leaflet Script loader
  useEffect(() => {
    if (typeof window === "undefined") return;

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
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Center on the stay point
    const defaultCenter = [placesList[0]?.lat || -34.587546, placesList[0]?.lng || -58.439668];
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 14,
      scrollWheelZoom: false
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20
    }).addTo(map);

    mapInstanceRef.current = map;
    setMapReady(prev => !prev);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded, placesList]);

  // Listener to toggle the visibility of Palermo-specific layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    
    const updateVisibility = () => {
      const currentZoom = map.getZoom();
      const currentBounds = map.getBounds();
      const stayLat = placesList[0]?.lat || -34.587546;
      const stayLng = placesList[0]?.lng || -58.439668;
      const L = (window as any).L;
      if (L) {
        const stayLatLng = L.latLng(stayLat, stayLng);
        const isPalermoVisible = currentBounds.contains(stayLatLng);
        setShouldDrawLocalLayers(currentZoom >= 12 && isPalermoVisible);
      }
    };

    map.on("moveend", updateVisibility);
    map.on("zoomend", updateVisibility);
    
    // Initial check
    updateVisibility();

    return () => {
      map.off("moveend", updateVisibility);
      map.off("zoomend", updateVisibility);
    };
  }, [mapReady, placesList]);

  // Manage Markers reactively based on Category Filters
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const L = (window as any).L;
    if (!L) return;

    if (markersLayerRef.current) {
      map.removeLayer(markersLayerRef.current);
      markersLayerRef.current = null;
    }

    const group = L.layerGroup();
    
    // Filter places: always show stay, otherwise match category
    const filtered = placesList.filter(
      place => place.type === "stay" || selectedCategory === "all" || place.type === selectedCategory
    );

    filtered.forEach((place) => {
      const markerColor = getCategoryColor(place.type);
      const markerHtmlIcon = getCategoryHtmlIcon(place.type);

      const customHtml = `
        <div style="
          background-color: ${markerColor}; 
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
          ${markerHtmlIcon}
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: "custom-leaflet-icon",
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon });

      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; max-width: 200px;">
          <h4 style="margin: 0 0 4px 0; font-weight: 700; color: #1C1B19; font-size: 13px;">${place.name}</h4>
          <p style="margin: 0 0 4px 0; color: #5F6F52; font-size: 11px; font-weight: 600;">${place.distance}</p>
          <p style="margin: 0; color: #666; font-size: 11px; line-height: 1.3;">${place.desc}</p>
        </div>
      `);

      marker.on("click", () => {
        const originalIndex = placesList.findIndex(p => p.name === place.name);
        if (originalIndex !== -1) {
          setActivePlace(originalIndex);
        }
      });

      group.addLayer(marker);
    });

    group.addTo(map);
    markersLayerRef.current = group;

    // View boundaries adjustment
    if (selectedCategory !== "all" && filtered.length > 1) {
      const bounds = L.latLngBounds(filtered.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    } else if (selectedCategory === "all" && placesList.length > 1) {
      const bounds = L.latLngBounds(placesList.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    } else if (placesList.length > 0) {
      map.setView([placesList[0].lat, placesList[0].lng], 15);
    }
  }, [mapReady, selectedCategory, placesList]);

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
    if (showBicisendas && shouldDrawLocalLayers) {
      // Anchored relative to default stay point for reference in neighborhood
      const stayLat = placesList[0]?.lat || -34.587546;
      const stayLng = placesList[0]?.lng || -58.439668;
      
      const fitzRoyCoords = [
        [stayLat, stayLng],
        [stayLat + 0.0028, stayLng + 0.0046],
        [stayLat + 0.0057, stayLng + 0.0096]
      ];
      const gorritiCoords = [
        [stayLat + 0.0057, stayLng + 0.0026],
        [stayLat + 0.0020, stayLng + 0.0066],
        [stayLat - 0.0020, stayLng + 0.0106]
      ];
      const humboldtCoords = [
        [stayLat - 0.0020, stayLng + 0.0026],
        [stayLat + 0.0010, stayLng + 0.0076],
        [stayLat + 0.0040, stayLng + 0.0126]
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
    if (showEcobici && shouldDrawLocalLayers) {
      const stayLat = placesList[0]?.lat || -34.587546;
      const stayLng = placesList[0]?.lng || -58.439668;

      const ecobiciPoints = [
        { name: "Estación Ecobici 144 - Fitz Roy y Paraguay", lat: stayLat + 0.0057, lng: stayLng + 0.0081, dist: "5 min. a pie" },
        { name: "Estación Ecobici 112 - Distrito Arcos", lat: stayLat + 0.0070, lng: stayLng + 0.0101, dist: "6 min. a pie" },
        { name: "Estación Ecobici 219 - Honduras y Bonpland", lat: stayLat + 0.0020, lng: stayLng + 0.0051, dist: "4 min. a pie" }
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
    if (showSube && shouldDrawLocalLayers) {
      const stayLat = placesList[0]?.lat || -34.587546;
      const stayLng = placesList[0]?.lng || -58.439668;

      const subePoints = [
        { name: "Carga SUBE - Kiosco Córdoba y Fitz Roy", lat: stayLat + 0.0003, lng: stayLng + 0.0003, info: "Carga 24 hs · 1 min a pie" },
        { name: "Carga SUBE - Locutorio Carranza", lat: stayLat + 0.0110, lng: stayLng + 0.0021, info: "Carga SUBE · 8 min a pie" },
        { name: "Parada Metrobús J.B. Justo (Paraguay)", lat: stayLat + 0.0074, lng: stayLng + 0.0106, info: "Líneas 34, 166 · 6 min a pie" }
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
  }, [showBicisendas, showEcobici, showSube, mapReady, placesList, shouldDrawLocalLayers]);

  // Center map on selected place
  const handlePlaceSelect = (originalIndex: number) => {
    setActivePlace(originalIndex);
    const place = placesList[originalIndex];
    if (mapInstanceRef.current && place) {
      mapInstanceRef.current.setView([place.lat, place.lng], 16, {
        animate: true,
        duration: 0.8
      });
      
      // Attempt to open popup of active marker
      mapInstanceRef.current.eachLayer((layer: any) => {
        if (layer.getLatLng && layer.getPopup) {
          const latLng = layer.getLatLng();
          if (Math.abs(latLng.lat - place.lat) < 0.0001 && Math.abs(latLng.lng - place.lng) < 0.0001) {
            layer.openPopup();
          }
        }
      });
    }
  };

  const getPlaceIcon = (type: string) => {
    switch (type) {
      case "stay": return <MapPin className="w-5 h-5 text-[#5F6F52]" />;
      case "subway": return <Train className="w-5 h-5 text-neutral-600" />;
      case "metrobus": return <Bus className="w-5 h-5 text-neutral-600" />;
      case "shopping": return <ShoppingBag className="w-5 h-5 text-neutral-600" />;
      case "food": return <Utensils className="w-5 h-5 text-neutral-600" />;
      case "hospital": return <Activity className="w-5 h-5 text-neutral-600" />;
      case "security": return <Shield className="w-5 h-5 text-neutral-600" />;
      case "park": return <Trees className="w-5 h-5 text-neutral-600" />;
      case "museum": return <Landmark className="w-5 h-5 text-neutral-600" />;
      case "theater": return <Ticket className="w-5 h-5 text-neutral-600" />;
      default: return <Compass className="w-5 h-5 text-neutral-600" />;
    }
  };

  // Filtered places displayed in the left panel
  const filteredPlacesForList = placesList.filter(place => {
    if (place.type === "stay") return true;
    if (selectedCategory === "all") return true;
    return place.type === selectedCategory;
  });

  return (
    <div className="bg-white border border-[#EFEBE4] rounded-3xl p-6 md:p-8 space-y-6">
      <div>
        <h3 className="font-serif text-2xl text-neutral-900 font-semibold">Ubicaciones y Puntos de Interés</h3>
        <p className="text-neutral-500 text-sm mt-1">
          Explora la conectividad, cultura, salud y recreación de la ciudad. Soporta coordenadas precisas de toda la Ciudad de Buenos Aires.
        </p>
      </div>

      {/* Categorías de Puntos de Interés */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Filtrar por Categoría:</span>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-6 px-6 md:mx-0 md:px-0">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const categoryColor = cat.id === "all" ? "#1C1B19" : getCategoryColor(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold whitespace-nowrap transition-all duration-200"
                style={{
                  backgroundColor: isSelected ? categoryColor : "#FFFFFF",
                  borderColor: isSelected ? categoryColor : "#EFEBE4",
                  color: isSelected ? "#FFFFFF" : "#4A4A4A"
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* USIG-inspired interactive layers */}
      <div className="flex flex-col gap-3 pb-2 border-b border-[#F5F2EB]">
        <div className="flex flex-wrap items-center gap-2.5">
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

        {/* Warning notice if Palermo layers are toggled but Palermo is not visible */}
        {!shouldDrawLocalLayers && (showBicisendas || showEcobici || showSube) && (
          <div className="text-xs text-amber-600 bg-amber-50/50 border border-amber-200/50 rounded-xl p-3 flex items-center gap-2 animate-pulse">
            <span>⚠️</span>
            <span>Las capas de ciclovías y Ecobici son locales de Palermo. Mueve o acerca el mapa al departamento para visualizarlas.</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Place selector */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {selectedCategory !== "all" && datasetUrls[selectedCategory] && (
            <div className="bg-[#FAF9F7] border border-[#EFEBE4] rounded-2xl p-3.5 text-xs text-neutral-600 flex items-center justify-between shadow-sm">
              <span className="font-semibold text-neutral-500">Fuente oficial BA Data:</span>
              <a
                href={datasetUrls[selectedCategory].url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5F6F52] hover:underline font-bold flex items-center gap-1"
              >
                <span>{datasetUrls[selectedCategory].name}</span>
                <span>↗</span>
              </a>
            </div>
          )}
          <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
            {filteredPlacesForList.map((place, idx) => {
              const originalIndex = placesList.findIndex(p => p.name === place.name);
              const isActive = activePlace === originalIndex;
              
              return (
                <button
                  key={idx}
                  onClick={() => handlePlaceSelect(originalIndex)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex gap-4 ${
                    isActive
                      ? "bg-[#FAF9F7] border-[#5F6F52] ring-1 ring-[#5F6F52] shadow-sm"
                      : "bg-white border-[#EFEBE4] hover:bg-neutral-50"
                  }`}
                >
                  <div className={`p-2.5 rounded-full ${isActive ? "bg-white text-[#5F6F52]" : "bg-neutral-100 text-neutral-600"} flex-shrink-0`}>
                    {getPlaceIcon(place.type)}
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-neutral-900 leading-snug">{place.name}</p>
                    <p className="text-[#5F6F52] font-semibold text-xs">{place.distance}</p>
                    {isActive && (
                      <p className="text-neutral-500 text-xs leading-relaxed mt-1">{place.desc}</p>
                    )}
                  </div>
                </button>
              );
            })}
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

      <div className="text-[10px] text-neutral-400 flex flex-wrap items-center gap-1 mt-4 border-t border-[#F5F2EB] pt-4">
        <span>🌐 Datos obtenidos de</span>
        <a 
          href="https://data.buenosaires.gob.ar/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline hover:text-neutral-600 font-semibold"
        >
          Portal de Datos Abiertos de la Ciudad de Buenos Aires (BA Data)
        </a>
        <span>• Ciclovías, Ecobici y coordenadas oficiales de seguridad, cultura y transporte.</span>
      </div>
    </div>
  );
}
