/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { fallbackPlaces, PlaceOfInterest } from "../data/places";

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
  Compass,
  ShoppingCart,
  Phone,
  Mail,
  Clock,
  Globe,
  Plane,
  Ship
} from "lucide-react";
import { parseCSV } from "../utils/csvParser";
import proj4 from "proj4";

// Configure EPSG:9498 / POSGAR 2007 CABA 2019 local grid
proj4.defs("EPSG:9498", "+proj=tmerc +lat_0=-34.6292666666667 +lon_0=-58.4633083333333 +k=1 +x_0=20000 +y_0=70000 +ellps=WGS84 +units=m +no_defs");

// Configure older CABA local grid (used in EPOK and older maps)
proj4.defs("CABA_LOCAL", "+proj=tmerc +lat_0=-34.6292666666667 +lon_0=-58.4633083333333 +k=1 +x_0=100000 +y_0=100000 +ellps=intl +units=m +no_defs");

function convertProjectedToWGS84(x: number, y: number): { lat: number; lng: number } {
  // If either coordinate is around 100000 (old grid range), use CABA_LOCAL
  const isOldGrid = (val: number) => val > 75000 && val < 130000;
  if (isOldGrid(x) || isOldGrid(y)) {
    let x_coord = x;
    let y_coord = y;
    if (y > 75000 && y < 130000 && x < 75000) {
      // Swapped
      x_coord = y;
      y_coord = x;
    }
    const [lon, lat] = proj4("CABA_LOCAL", "WGS84", [x_coord, y_coord]);
    return { lat, lng: lon };
  } else {
    // New EPSG:9498 grid
    let x_coord = x;
    let y_coord = y;
    if (x > 50000 && y < 50000) {
      // Swapped
      x_coord = y;
      y_coord = x;
    }
    const [lon, lat] = proj4("EPSG:9498", "WGS84", [x_coord, y_coord]);
    return { lat, lng: lon };
  }
}

// Helper to parse coordinate strings (e.g. "[26549.56, 69922.54]" or "-58.43, -34.58")
function parseCoordinatesString(str: string): { lat: number; lng: number } | null {
  if (!str) return null;
  // Remove brackets, parentheses and split by comma or space
  const cleanStr = str.replace(/[\[\]\(\)]/g, "").trim();
  const parts = cleanStr.split(/[\s,]+/);
  if (parts.length >= 2) {
    const val1 = parseFloat(parts[0]);
    const val2 = parseFloat(parts[1]);
    if (!isNaN(val1) && !isNaN(val2)) {
      const isLocalGrid = (val: number) => val > 5000 && val < 150000;
      if (isLocalGrid(val1) || isLocalGrid(val2)) {
        try {
          return convertProjectedToWGS84(val1, val2);
        } catch (e) {
          console.error("Error converting coordinates string:", e);
          return null;
        }
      } else {
        // Standard WGS84: identify which is lat (around -34.6) and which is lon (around -58.4)
        let lat = val2;
        let lng = val1;
        if (val1 < -30 && val1 > -40) {
          lat = val1;
          lng = val2;
        }
        return { lat, lng };
      }
    }
  }
  return null;
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

// Haversine formula: returns distance in meters between two WGS84 coordinates
function haversineDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Merge static POIs and dynamic/fetched POIs, prioritizing static ones (which might have curated coordinates/descriptions)


// Detect subway line from station name (e.g. "Linea A", "Línea D", etc.)

function detectSubwayLine(name: string): string | undefined {
  const upper = name.toUpperCase();
  if (upper.includes("LINEA A") || upper.includes("LÍNEA A") || upper.includes("LíNEA A")) return "A";
  if (upper.includes("LINEA B") || upper.includes("LÍNEA B")) return "B";
  if (upper.includes("LINEA C") || upper.includes("LÍNEA C")) return "C";
  if (upper.includes("LINEA D") || upper.includes("LÍNEA D")) return "D";
  if (upper.includes("LINEA E") || upper.includes("LÍNEA E")) return "E";
  if (upper.includes("LINEA H") || upper.includes("LÍNEA H")) return "H";
  return undefined;
}

// Get official SBASE color for each subway line
function getSubwayLineColor(line: string | undefined): string {
  switch (line) {
    case "A": return "#18A7E8"; // Light Blue
    case "B": return "#E4002B"; // Red
    case "C": return "#0072BB"; // Royal Blue
    case "D": return "#008000"; // Green
    case "E": return "#7A0080"; // Purple
    case "H": return "#F5A800"; // Yellow/Gold
    default:  return "#2D9CDB"; // Default blue for unknown
  }
}



const categories = [
  { id: "all", name: "Todos", icon: "✨" },
  { id: "parking", name: "Estacionamiento", icon: "🅿️" },
  { id: "subway", name: "Subtes", icon: "🚇" },
  { id: "metrobus", name: "Metrobús", icon: "🚌" },
  { id: "shopping", name: "Shoppings", icon: "🛍️" },
  { id: "supermarket", name: "Supermercados", icon: "🛒" },
  { id: "food", name: "Gastronomía", icon: "🍽️" },
  { id: "hospital", name: "Hospitales", icon: "🏥" },
  { id: "security", name: "Seguridad", icon: "👮" },
  { id: "park", name: "Parques", icon: "🌳" },
  { id: "museum", name: "Museos", icon: "🏛️" },
  { id: "theater", name: "Teatros", icon: "🎭" },
  { id: "tourist", name: "Turismo", icon: "📍" }
];

const datasetUrls: Record<string, { name: string; url: string }> = {
  subway: { name: "Red de Subtes", url: "https://data.buenosaires.gob.ar/dataset/subte" },
  metrobus: { name: "Corredores de Metrobús", url: "https://data.buenosaires.gob.ar/dataset/metrobus" },
  shopping: { name: "Centros Comerciales", url: "https://data.buenosaires.gob.ar/dataset/centro-comercial" },
  supermarket: { name: "Supermercados y Autoservicios", url: "https://data.buenosaires.gob.ar/dataset/supermercados" },
  hospital: { name: "Hospitales Públicos", url: "https://data.buenosaires.gob.ar/dataset/hospitales" },
  security: { name: "Seguridad y Policía", url: "https://data.buenosaires.gob.ar/dataset/comisarias" },
  park: { name: "Espacios Verdes y Plazas", url: "https://data.buenosaires.gob.ar/dataset/espacios-verdes" },
  museum: { name: "Museos de la Ciudad", url: "https://data.buenosaires.gob.ar/dataset/museos" },
  theater: { name: "Salas de Teatro", url: "https://data.buenosaires.gob.ar/dataset/teatros" },
  tourist: { name: "Atractivos Turísticos", url: "https://data.buenosaires.gob.ar/dataset/atractivos-turisticos" }
};

const getCategoryColor = (type: string, subLine?: string, isFireStation?: boolean): string => {
  switch (type) {
    case "stay": return "#5F6F52"; // Olive Green
    case "parking": return "#0056B3"; // Deep Blue
    case "subway": return getSubwayLineColor(subLine); // Oficial SBASE line color
    case "metrobus": return "#F2C94C"; // Amber Yellow
    case "shopping": return "#9B51E0"; // Purple
    case "supermarket": return "#3F51B5"; // Indigo Blue
    case "food": return "#EB5757"; // Coral Red
    case "hospital": return "#27AE60"; // Soft Green
    case "security": return isFireStation ? "#E55A1C" : "#2F80ED"; // Orange for fire stations, Blue for police
    case "park": return "#219653"; // Dark Green
    case "museum": return "#828282"; // Slate Gray
    case "theater": return "#F2994A"; // Warm Orange
    case "tourist": return "#D4A373"; // Bronze Terracota
    default: return "#1C1B19"; // Charcoal Dark
  }
};

const getFireStationHtmlIcon = (): string => {
  // Flame icon for fire stations
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;
};

const getSubwayLineLabel = (subLine?: string): string => {
  if (!subLine) return "";
  return `<span style="font-size: 10px; font-weight: 900; line-height: 1;">${subLine}</span>`;
};

const getTransportType = (name: string): "plane" | "train" | "bus" | "ship" | null => {
  const lower = name.toLowerCase();
  if (lower.includes("aeroparque") || lower.includes("aeropuerto") || lower.includes("ezeiza")) {
    return "plane";
  }
  if (lower.includes("buquebus") || lower.includes("colonia express")) {
    return "ship";
  }
  if (lower.includes("retiro") || lower.includes("constitución") || lower.includes("constitucion") || lower.includes("once") || lower.includes("lacroze")) {
    if (lower.includes("ómnibus") || lower.includes("omnibus") || lower.includes("bus")) {
      return "bus";
    }
    return "train";
  }
  if (lower.includes("dellepiane") || lower.includes("ómnibus") || lower.includes("omnibus")) {
    return "bus";
  }
  return null;
};

const getCategoryHtmlIcon = (type: string, subLine?: string, isFireStation?: boolean, name?: string): string => {
  if (type === "security" && isFireStation) return getFireStationHtmlIcon();
  if (type === "subway" && subLine) return getSubwayLineLabel(subLine);
  
  if (type === "tourist" && name) {
    const transportType = getTransportType(name);
    if (transportType === "plane") {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.9-.2-1.8.3-2 1.2-.2.9.3 1.8 1.2 2l8 1.8-3.5 3.5-3.7-1.2c-.4-.1-.8.1-1 .4L3 16.5l3.5 1 1 3.5 2.1-1.3c.3-.2.5-.6.4-1l-1.2-3.7 3.5-3.5 1.8 8c.2.9 1.1 1.4 2 1.2.9-.2 1.4-1.1 1.2-2Z"/></svg>`;
    }
    if (transportType === "train") {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m16 19 2 3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg>`;
    }
    if (transportType === "bus") {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="16" x="3" y="4" rx="2" ry="2"/><path d="M7 10h4v4H7zm6 0h4v4h-4zM6 20h12"/></svg>`;
    }
    if (transportType === "ship") {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21h20"/><path d="M19.3 14.8C21.1 13.5 22 11.7 22 9.8c0-3.8-3.1-6.8-7-6.8a6.9 6.9 0 0 0-5 2.2A6.9 6.9 0 0 0 5 3C1.1 3 0 6 0 9.8c0 2 1 3.7 2.7 5.1L5 19h14l.3-4.2Z"/></svg>`;
    }
  }

  switch (type) {
    case "stay":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
    case "subway":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m16 19 2 3"/></svg>`;
    case "metrobus":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="16" x="3" y="4" rx="2" ry="2"/><path d="M7 10h4v4H7zm6 0h4v4h-4zM6 20h12"/></svg>`;
    case "shopping":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
    case "supermarket":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`;
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
    case "tourist":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`;
  }
};

interface NeighbourhoodMapProps {
  sheetUrl?: string;
  lang?: "es" | "en";
  compact?: boolean;
}

export default function NeighbourhoodMap({ sheetUrl, lang = "es", compact = false }: NeighbourhoodMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const routePolylineRef = useRef<any>(null);
  
  const [basePlaces, setBasePlaces] = useState<PlaceOfInterest[]>(fallbackPlaces);
  const [placesList, setPlacesList] = useState<PlaceOfInterest[]>(fallbackPlaces);
  const [activePlace, setActivePlace] = useState<number>(0);
  const activePlaceRef = useRef<number>(0);
  useEffect(() => {
    activePlaceRef.current = activePlace;
  }, [activePlace]);
  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [activeRoute, setActiveRoute] = useState<[number, number][] | null>(null);
  const [activeRouteInfo, setActiveRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const [localTime, setLocalTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const timeString = now.toLocaleTimeString("es-AR", {
          timeZone: "America/Argentina/Buenos_Aires",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
        setLocalTime(timeString);
      } catch (e) {
        console.error("Error formatting local time:", e);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const t = {
    es: {
      title: "Ubicaciones y Puntos de Interés",
      subtitle: "Explora la conectividad, cultura, salud, compras y recreación de la ciudad. Soporta coordenadas de toda la Ciudad de Buenos Aires.",
      filterLabel: "Filtrar por Categoría:",
      officialSource: "Fuente oficial BA Data:",
      routeSuggested: "Ruta sugerida desde el depto:",
      howToGet: "A pasos de la Av. Santa Fe y Av. Juan B. Justo. Múltiples líneas de colectivo (Metrobús) y la línea D de subte a minutos de distancia para moverte cómodamente por Buenos Aires.",
      loading: "Cargando mapa interactivo...",
      dataSource: "Datos obtenidos de",
      portalName: "Portal de Datos Abiertos de la Ciudad de Buenos Aires (BA Data)",
      dataDesc: "• Coordenadas oficiales de seguridad, cultura, compras y transporte.",
      timeLabel: "Hora en Bs. As.:",
      subwayNet: "Red de Subterráneos CABA",
      secTitle: "Fuerzas de Seguridad",
      secPolice: "Comisarías",
      secFire: "Bomberos",
      visitWeb: "Visitar Sitio Web",
      dirLabel: "Dir:",
      telLabel: "Tel:",
      hoursLabel: "Horario:",
      webLabel: "Web:",
      visitWebLink: "Ver web ↗",
      fireLabel: "🔥 Bomberos"
    },
    en: {
      title: "Locations & Points of Interest",
      subtitle: "Explore the city's connectivity, culture, health, shopping, and recreation. Supports coordinates for all of Buenos Aires.",
      filterLabel: "Filter by Category:",
      officialSource: "Official BA Data Source:",
      routeSuggested: "Suggested route from the apt:",
      howToGet: "Steps away from Av. Santa Fe & Av. Juan B. Justo. Multiple bus lines (Metrobus) and Subway Line D are minutes away to travel comfortably around Buenos Aires.",
      loading: "Loading interactive map...",
      dataSource: "Data retrieved from",
      portalName: "Buenos Aires Open Data Portal (BA Data)",
      dataDesc: "• Official security, culture, shopping, and transit coordinates.",
      timeLabel: "Time in Bs. As.:",
      subwayNet: "Buenos Aires Subway Network",
      secTitle: "Security Forces",
      secPolice: "Police Stations",
      secFire: "Fire Stations",
      visitWeb: "Visit Website",
      dirLabel: "Addr:",
      telLabel: "Phone:",
      hoursLabel: "Hours:",
      webLabel: "Web:",
      visitWebLink: "View website ↗",
      fireLabel: "🔥 Fire Dept"
    }
  }[lang];

  const categoryNames: Record<string, { es: string; en: string }> = {
    all: { es: "Todos", en: "All" },
    subway: { es: "Subtes", en: "Subway" },
    metrobus: { es: "Metrobús", en: "Metrobus" },
    shopping: { es: "Shoppings", en: "Shopping Malls" },
    supermarket: { es: "Supermercados", en: "Supermarkets" },
    food: { es: "Gastronomía", en: "Gastronomy" },
    hospital: { es: "Hospitales", en: "Hospitals" },
    security: { es: "Seguridad", en: "Security" },
    park: { es: "Parques", en: "Parks" },
    museum: { es: "Museos", en: "Museums" },
    theater: { es: "Teatros", en: "Theaters" },
    tourist: { es: "Turismo", en: "Tourism" }
  };



  // Load places dynamically if sheetUrl is provided
  useEffect(() => {
    if (!sheetUrl) {
      setBasePlaces(fallbackPlaces);
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
          setBasePlaces(fallbackPlaces);
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
        const coordIdx = headers.findIndex(h => h.includes("coord") || h.includes("geom") || h.includes("pos") || h.includes("geo"));
        const phoneIdx = headers.findIndex(h => h.includes("tel") || h.includes("pho") || h.includes("llam") || h.includes("cont"));
        const emailIdx = headers.findIndex(h => h.includes("mail") || h.includes("corr"));
        const webIdx = headers.findIndex(h => h.includes("web") || h.includes("pag") || h.includes("sitio"));
        const hoursIdx = headers.findIndex(h => h.includes("hor") || h.includes("open") || h.includes("atenc"));

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
          const coordinatesStr = coordIdx !== -1 && coordIdx < row.length ? row[coordIdx].trim() : "";
          const phone = phoneIdx !== -1 && phoneIdx < row.length ? row[phoneIdx].trim() : "";
          const email = emailIdx !== -1 && emailIdx < row.length ? row[emailIdx].trim() : "";
          const web = webIdx !== -1 && webIdx < row.length ? row[webIdx].trim() : "";
          const hours = hoursIdx !== -1 && hoursIdx < row.length ? row[hoursIdx].trim() : "";

          // 1. Prioritize combined coordinates string (GeoJSON output) if individual ones are missing
          if ((isNaN(lat) || isNaN(lng)) && coordinatesStr) {
            const parsedCoords = parseCoordinatesString(coordinatesStr);
            if (parsedCoords) {
              lat = parsedCoords.lat;
              lng = parsedCoords.lng;
            }
          }

          // 2. Process individual coordinates (check if they are EPSG:9498 or WGS84)
          if (!isNaN(lat) && !isNaN(lng)) {
            const isLocalGrid = (val: number) => val > 5000 && val < 150000;
            if (isLocalGrid(lat) || isLocalGrid(lng)) {
              try {
                const wgs84 = convertProjectedToWGS84(lng, lat);
                lat = wgs84.lat;
                lng = wgs84.lng;
              } catch (e) {
                console.error("Error converting coordinates:", e);
              }
            }
            
            const subLine = category === "subway" ? detectSubwayLine(name) : undefined;
            const isFireStation = category === "security" && (name.toLowerCase().includes("bombero") || desc.toLowerCase().includes("bombero"));
            
            return { name, type: category, distance, desc, lat, lng, phone, email, web, hours, address, subLine, isFireStation } as PlaceOfInterest;
          }

          // 3. Fallback to geocoding if coordinates are completely missing
          if (address) {
            try {
              const coords = await geocodeAddress(address);
              if (coords) {
                const subLine = category === "subway" ? detectSubwayLine(name) : undefined;
                const isFireStation = category === "security" && (name.toLowerCase().includes("bombero") || desc.toLowerCase().includes("bombero"));
                return { name, type: category, distance, desc, lat: coords.lat, lng: coords.lng, phone, email, web, hours, address, subLine, isFireStation } as PlaceOfInterest;
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
          setBasePlaces(parsedPlaces);
          setPlacesList(parsedPlaces);
        } else {
          setBasePlaces(fallbackPlaces);
          setPlacesList(fallbackPlaces);
        }
      } catch (error) {
        console.error("Error loading remote map points, using local fallback:", error);
        setBasePlaces(fallbackPlaces);
        setPlacesList(fallbackPlaces);
      }
    }

    loadPlaces(sheetUrl);
  }, [sheetUrl]);

  // Observe Dark Mode changes on document.documentElement
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const checkDark = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    checkDark();
    
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
    
    return () => observer.disconnect();
  }, []);

  // Update placesList based on selectedCategory using local database
  useEffect(() => {
    const stay = basePlaces.find(p => p.type === "stay") || fallbackPlaces[0];
    
    if (selectedCategory === "all") {
      setPlacesList(basePlaces);
    } else {
      let filtered = basePlaces.filter(p => p.type === selectedCategory);
      
      // Special rule: supermarkets are filtered to 2000m range
      if (selectedCategory === "supermarket") {
        filtered = filtered.filter(p => haversineDistanceMeters(stay.lat, stay.lng, p.lat, p.lng) <= 2000);
      }
      
      // Calculate missing distances for consistency
      const formatted = filtered.map(p => {
        if (p.distance && p.distance !== "Calculando...") return p;
        const d = Math.round(haversineDistanceMeters(stay.lat, stay.lng, p.lat, p.lng));
        return {
          ...p,
          distance: d < 1000 ? `${d} m a pie` : `${(d / 1000).toFixed(1)} km`
        };
      });
      
      // Sort by distance ascending
      formatted.sort((a, b) => {
        const distA = haversineDistanceMeters(stay.lat, stay.lng, a.lat, a.lng);
        const distB = haversineDistanceMeters(stay.lat, stay.lng, b.lat, b.lng);
        return distA - distB;
      });
      
      setPlacesList([stay, ...formatted]);
    }
    
    // Clear active route when switching categories
    setActiveRoute(null);
    setActiveRouteInfo(null);
  }, [selectedCategory, basePlaces]);


  // Fetch route geometry and distance/duration info using OSRM
  const fetchRoute = async (origin: { lat: number; lng: number }, dest: { lat: number; lng: number }) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.routes && json.routes.length > 0) {
          const route = json.routes[0];
          const coords = route.geometry.coordinates.map((c: any) => [c[1], c[0]] as [number, number]);
          setActiveRoute(coords);
          
          const meters = route.distance;
          
          // Walking duration calculation (approx 80m/min)
          const walkingMin = Math.round(meters / 80);
          // Driving duration calculation (approx 250m/min in CABA)
          const drivingMin = Math.max(1, Math.round(meters / 250));
          
          let distText = "";
          if (meters < 1000) {
            distText = `${Math.round(meters)} m`;
          } else {
            distText = `${(meters / 1000).toFixed(1)} km`;
          }
          
          const durationText = `${walkingMin} min. a pie / ${drivingMin} min. en auto (${distText})`;
          setActiveRouteInfo({
            distance: distText,
            duration: durationText
          });
          // Dynamically update active route info only, no placesList mutation to avoid map resets
        }
      }
    } catch (e) {
      console.error("Error fetching OSRM route:", e);
      setActiveRoute(null);
      setActiveRouteInfo(null);
    }
  };

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

    const initialUrl = isDarkMode
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    const tileLayer = L.tileLayer(initialUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;
    setMapReady(prev => !prev);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leafletLoaded, placesList]);

  // Manage Dark Mode Leaflet Tiles
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;
    
    const newUrl = isDarkMode
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
      
    tileLayerRef.current.setUrl(newUrl);
  }, [isDarkMode, mapReady]);

  // Manage Route Polyline on map dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const L = (window as any).L;
    if (!L) return;

    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    if (activeRoute && activeRoute.length > 0) {
      const polyline = L.polyline(activeRoute, {
        color: "#5F6F52", // Olive Green to match the stay theme
        weight: 5,
        opacity: 0.85,
        lineCap: "round",
        lineJoin: "round"
      }).addTo(map);

      routePolylineRef.current = polyline;

      // Keep map centered on active place rather than zooming out to fit the whole route (user request)
      // const bounds = L.latLngBounds(activeRoute);
      // map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [activeRoute, mapReady]);



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
      const isStay = place.type === "stay";
      const markerColor = getCategoryColor(place.type, place.subLine, place.isFireStation);
      const markerHtmlIcon = getCategoryHtmlIcon(place.type, place.subLine, place.isFireStation, place.name);

      const markerSize = isStay ? 38 : 32;
      const anchorVal = markerSize / 2;
      const translateOffset = isStay ? -9 : -6;

      const customHtml = `
        <div style="
          background-color: ${markerColor}; 
          color: white; 
          width: ${markerSize}px; 
          height: ${markerSize}px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: ${isStay ? "0 4px 14px rgba(95, 111, 82, 0.45)" : "0 4px 10px rgba(0,0,0,0.15)"}; 
          border: 2.5px solid white;
          transform: translate(${translateOffset}px, ${translateOffset}px);
          transition: all 0.2s;
        " class="${isStay ? "stay-marker" : "map-marker-hover"}">
          ${markerHtmlIcon}
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: isStay ? "custom-leaflet-icon-stay" : "custom-leaflet-icon",
        iconSize: [markerSize, markerSize],
        iconAnchor: [anchorVal, anchorVal]
      });

      const marker = L.marker([place.lat, place.lng], { 
        icon: customIcon,
        zIndexOffset: isStay ? 10000 : 0 
      });

      // Structured Popup HTML
      const dirLabel = lang === "es" ? "Dir:" : "Addr:";
      const telLabel = lang === "es" ? "Tel:" : "Phone:";
      const hoursLabel = lang === "es" ? "Horario:" : "Hours:";
      const webBtnLabel = lang === "es" ? "Ver web ↗" : "View web ↗";

      let popupHtml = `
        <div style="font-family: sans-serif; padding: 4px; max-width: 220px; line-height: 1.4;">
          <h4 style="margin: 0 0 4px 0; font-weight: 700; color: #1C1B19; font-size: 13px;">${place.name}</h4>
          <p style="margin: 0 0 6px 0; color: #5F6F52; font-size: 11px; font-weight: 600;">${place.distance}</p>
          <p style="margin: 0 0 6px 0; color: #555; font-size: 11px; line-height: 1.3;">${place.desc}</p>
      `;

      if (place.address) {
        popupHtml += `<p style="margin: 0 0 4px 0; color: #777; font-size: 10px;"><b>${dirLabel}</b> ${place.address}</p>`;
      }
      if (place.phone) {
        popupHtml += `<p style="margin: 0 0 4px 0; color: #777; font-size: 10px;"><b>${telLabel}</b> <a href="tel:${place.phone}" style="color: #5F6F52; text-decoration: none; font-weight: 600;">${place.phone}</a></p>`;
      }
      if (place.hours) {
        popupHtml += `<p style="margin: 0 0 4px 0; color: #777; font-size: 10px;"><b>${hoursLabel}</b> ${place.hours}</p>`;
      }
      if (place.web) {
        const href = place.web.startsWith("http") ? place.web : `https://${place.web}`;
        popupHtml += `<p style="margin: 0; color: #777; font-size: 10px;"><b>Web:</b> <a href="${href}" target="_blank" style="color: #5F6F52; font-weight: bold; text-decoration: underline;">${webBtnLabel}</a></p>`;
      }

      popupHtml += `</div>`;

      marker.bindPopup(popupHtml);

      marker.on("click", () => {
        const originalIndex = placesList.findIndex(p => p.name === place.name);
        if (originalIndex !== -1) {
          handlePlaceSelect(originalIndex);
        }
      });

      marker.on("mouseover", () => {
        marker.openPopup();
      });

      marker.on("mouseout", () => {
        const originalIndex = placesList.findIndex(p => p.name === place.name);
        if (activePlaceRef.current !== originalIndex) {
          marker.closePopup();
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
    } else {
      // Center on the stay (Airbnb) location by default to show Palermo Hollywood around it
      const stay = placesList.find(p => p.type === "stay") || fallbackPlaces[0];
      map.setView([stay.lat, stay.lng], 15);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, selectedCategory, placesList]);



  // Center map on selected place
  const handlePlaceSelect = (originalIndex: number) => {
    setActivePlace(originalIndex);
    const place = placesList[originalIndex];
    if (mapInstanceRef.current && place) {
      mapInstanceRef.current.setView([place.lat, place.lng], 16, {
        animate: true,
        duration: 0.8
      });
      
      // Dynamic routing to active place (if not the stay location itself)
      if (place.type !== "stay") {
        const stay = placesList.find(p => p.type === "stay") || fallbackPlaces[0];
        fetchRoute({ lat: stay.lat, lng: stay.lng }, { lat: place.lat, lng: place.lng });
      } else {
        setActiveRoute(null);
        setActiveRouteInfo(null);
      }
      
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

  const getPlaceIcon = (type: string, name?: string) => {
    if (type === "tourist" && name) {
      const transportType = getTransportType(name);
      if (transportType === "plane") {
        return <Plane className="w-5 h-5 text-neutral-600" />;
      }
      if (transportType === "train") {
        return <Train className="w-5 h-5 text-neutral-600" />;
      }
      if (transportType === "bus") {
        return <Bus className="w-5 h-5 text-neutral-600" />;
      }
      if (transportType === "ship") {
        return <Ship className="w-5 h-5 text-neutral-600" />;
      }
    }

    switch (type) {
      case "stay": return <MapPin className="w-5 h-5 text-[#5F6F52]" />;
      case "subway": return <Train className="w-5 h-5 text-neutral-600" />;
      case "metrobus": return <Bus className="w-5 h-5 text-neutral-600" />;
      case "shopping": return <ShoppingBag className="w-5 h-5 text-neutral-600" />;
      case "supermarket": return <ShoppingCart className="w-5 h-5 text-neutral-600" />;
      case "food": return <Utensils className="w-5 h-5 text-neutral-600" />;
      case "hospital": return <Activity className="w-5 h-5 text-neutral-600" />;
      case "security": return <Shield className="w-5 h-5 text-neutral-600" />;
      case "park": return <Trees className="w-5 h-5 text-neutral-600" />;
      case "museum": return <Landmark className="w-5 h-5 text-neutral-600" />;
      case "theater": return <Ticket className="w-5 h-5 text-neutral-600" />;
      case "tourist": return <Compass className="w-5 h-5 text-neutral-600" />;
      default: return <Compass className="w-5 h-5 text-neutral-600" />;
    }
  };

  // Filtered places displayed in the left panel
  const filteredPlacesForList = placesList.filter(place => {
    if (place.type === "stay") return true;
    if (selectedCategory === "all") return true;
    return place.type === selectedCategory;
  });

  if (compact) {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden border border-[#EFEBE4] dark:border-[#2C302A] h-[280px] shadow-sm transition-colors duration-300">
        {!leafletLoaded && (
          <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
            <div className="text-center space-y-2">
              <div className="w-6 h-6 border-2 border-neutral-400 dark:border-neutral-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p>{t.loading}</p>
            </div>
          </div>
        )}
        <div ref={mapContainerRef} className="w-full h-full z-10" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#252824] border border-[#EFEBE4] dark:border-[#353A33] rounded-3xl p-6 md:p-8 space-y-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100 font-semibold">{t.title}</h3>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">{t.subtitle}</p>
        </div>
        {localTime && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] rounded-full text-xs font-semibold text-neutral-700 dark:text-neutral-300 shadow-sm self-start sm:self-center flex-shrink-0 animate-fadeIn transition-colors duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>
              {t.timeLabel} <strong className="text-neutral-900 dark:text-neutral-100">{localTime}</strong> <span className="text-neutral-400 dark:text-neutral-500 text-[10px] font-black">GMT-3</span>
            </span>
          </div>
        )}
      </div>

      {/* Categorías de Puntos de Interés */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">{t.filterLabel}</span>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const categoryColor = cat.id === "all" ? "#1C1B19" : getCategoryColor(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-[11px] font-semibold whitespace-nowrap transition-all duration-200 ${
                  isSelected 
                    ? "text-white" 
                    : "bg-white dark:bg-[#141613] border-[#EFEBE4] dark:border-[#2C302A] text-[#4A4A4A] dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#1E211D]"
                }`}
                style={isSelected ? {
                  backgroundColor: categoryColor,
                  borderColor: categoryColor,
                } : undefined}
              >
                <span>{cat.icon}</span>
                <span>{categoryNames[cat.id]?.[lang] || cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Place selector (order-2 on mobile, order-1 on large screens) */}
        <div className="order-2 lg:order-1 lg:col-span-5 flex flex-col justify-between space-y-4">
          {selectedCategory !== "all" && datasetUrls[selectedCategory] && (
            <div className="bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] rounded-2xl p-3.5 text-xs text-neutral-600 dark:text-neutral-350 flex items-center justify-between shadow-sm transition-colors duration-300">
              <span className="font-semibold text-neutral-500 dark:text-neutral-400">{t.officialSource}</span>
              <a
                href={datasetUrls[selectedCategory].url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5F6F52] dark:text-[#889B73] hover:underline font-bold flex items-center gap-1"
              >
                <span>{datasetUrls[selectedCategory].name}</span>
                <span>↗</span>
              </a>
            </div>
          )}

          {/* Subway Line Color Legend */}
          {selectedCategory === "subway" && (
            <div className="bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] rounded-2xl p-3 text-xs transition-colors duration-300">
              <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">{t.subwayNet}</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { line: "A", color: "#18A7E8", label: lang === "es" ? "Línea A" : "Line A" },
                  { line: "B", color: "#E4002B", label: lang === "es" ? "Línea B" : "Line B" },
                  { line: "C", color: "#0072BB", label: lang === "es" ? "Línea C" : "Line C" },
                  { line: "D", color: "#008000", label: lang === "es" ? "Línea D" : "Line D" },
                  { line: "E", color: "#7A0080", label: lang === "es" ? "Línea E" : "Line E" },
                  { line: "H", color: "#F5A800", label: lang === "es" ? "Línea H" : "Line H" },
                ].map(({ line, color, label }) => (
                  <div key={line} className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: color + "20", border: `1px solid ${color}40` }}>
                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-white font-black text-[9px]" style={{ backgroundColor: color }}>
                      {line}
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Type Legend */}
          {selectedCategory === "security" && (
            <div className="bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] rounded-2xl p-3 text-xs transition-colors duration-300">
              <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">{t.secTitle}</p>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#2F80ED]/10 border border-[#2F80ED]/30">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#2F80ED]"></div>
                  <span className="text-[10px] font-semibold text-[#2F80ED]">{t.secPolice}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#E55A1C]/10 border border-[#E55A1C]/30">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#E55A1C]"></div>
                  <span className="text-[10px] font-semibold text-[#E55A1C]">{t.secFire}</span>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-2.5 max-h-[250px] lg:max-h-[440px] overflow-y-auto pr-1">
            {filteredPlacesForList.map((place, idx) => {
              const originalIndex = placesList.findIndex(p => p.name === place.name);
              const isActive = activePlace === originalIndex;
              
              return (
                <button
                  key={idx}
                  onClick={() => handlePlaceSelect(originalIndex)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex gap-4 items-start ${
                    isActive
                      ? "bg-[#FAF9F7] dark:bg-[#1E211D] border-[#5F6F52] dark:border-[#889B73] ring-1 ring-[#5F6F52] dark:ring-[#889B73] shadow-sm"
                      : "bg-white dark:bg-[#141613] border-[#EFEBE4] dark:border-[#2C302A] hover:bg-neutral-50 dark:hover:bg-[#1E211D]"
                  }`}
                >
                  <div className={`p-2.5 rounded-full ${isActive ? "bg-white dark:bg-[#252824] text-[#5F6F52] dark:text-[#889B73]" : "bg-neutral-100 dark:bg-[#1E211D] text-neutral-600 dark:text-neutral-400"} flex-shrink-0 mt-0.5 transition-colors duration-300`}>
                    {getPlaceIcon(place.type, place.name)}
                  </div>
                  <div className="space-y-1 w-full min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 leading-snug break-words">{place.name}</p>
                      {place.subLine && (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white font-black text-[9px] flex-shrink-0"
                          style={{ backgroundColor: (() => { const c: Record<string,string> = {A:"#18A7E8",B:"#E4002B",C:"#0072BB",D:"#008000",E:"#7A0080",H:"#F5A800"}; return c[place.subLine!] || "#2D9CDB"; })() }}>
                          {place.subLine}
                        </span>
                      )}
                      {place.isFireStation && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: "#E55A1C" }}>
                          {t.fireLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-[#5F6F52] dark:text-[#889B73] font-semibold text-xs">{place.distance}</p>
                    
                    {/* Expanded details when active */}
                    {isActive && (
                      <div className="mt-3 space-y-2.5 pt-2.5 border-t border-[#F0EBE0] dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-355 w-full animate-fadeIn">
                        {/* Route duration detailed badge */}
                        {activeRouteInfo && place.type !== "stay" && (
                          <div className="bg-[#FAF9F7] dark:bg-[#252824] border border-[#5F6F52]/10 dark:border-[#889B73]/10 rounded-xl p-2.5 flex items-start gap-2 text-neutral-700 dark:text-neutral-300 shadow-sm transition-colors duration-300">
                            <span className="text-sm">📍</span>
                            <div>
                              <p className="font-bold text-[9px] uppercase tracking-wider text-[#5F6F52] dark:text-[#889B73]">{t.routeSuggested}</p>
                              <p className="text-[11px] text-neutral-800 dark:text-neutral-200 mt-0.5 leading-snug">{activeRouteInfo.duration}</p>
                            </div>
                          </div>
                        )}

                        <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed break-words">{place.desc}</p>
                        
                        {place.address && (
                          <div className="flex gap-1.5 items-start mt-1">
                            <span className="font-bold text-neutral-500 dark:text-neutral-400 flex-shrink-0">{t.dirLabel}</span>
                            <span className="text-neutral-600 dark:text-neutral-300 break-words">{place.address}</span>
                          </div>
                        )}
                        
                        {place.phone && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <Phone className="w-3.5 h-3.5 text-neutral-400" />
                            <a href={`tel:${place.phone}`} className="text-[#5F6F52] dark:text-[#889B73] hover:underline font-semibold">{place.phone}</a>
                          </div>
                        )}
                        
                        {place.email && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <Mail className="w-3.5 h-3.5 text-neutral-400" />
                            <a href={`mailto:${place.email}`} className="text-[#5F6F52] dark:text-[#889B73] hover:underline break-all">{place.email}</a>
                          </div>
                        )}

                        {place.hours && (
                          <div className="flex gap-1.5 items-start mt-1">
                            <Clock className="w-3.5 h-3.5 text-neutral-400 mt-0.5" />
                            <span className="text-neutral-600 dark:text-neutral-300 break-words">{place.hours}</span>
                          </div>
                        )}

                        {place.web && (
                          <div className="flex items-center gap-1.5 mt-1 pt-1">
                            <Globe className="w-3.5 h-3.5 text-neutral-400" />
                            <a 
                              href={place.web.startsWith("http") ? place.web : `https://${place.web}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-[#5F6F52] dark:text-[#889B73] hover:underline font-semibold flex items-center gap-0.5"
                            >
                              <span>{t.visitWeb}</span>
                              <span>↗</span>
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] rounded-2xl p-4 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed transition-colors duration-300">
            <strong>{lang === "es" ? "¿Cómo llegar?" : "How to get there?"}</strong> {t.howToGet}
          </div>
        </div>

        {/* Right Column: Leaflet Map Container (order-1 on mobile, order-2 on large screens) */}
        <div className="order-1 lg:order-2 lg:col-span-7 h-[300px] lg:h-auto min-h-[420px] rounded-2xl border border-[#EFEBE4] dark:border-[#2C302A] overflow-hidden relative shadow-inner transition-colors duration-300">
          {!leafletLoaded && (
            <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
              <div className="text-center space-y-2">
                <div className="w-6 h-6 border-2 border-neutral-400 dark:border-neutral-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p>{t.loading}</p>
              </div>
            </div>
          )}
          <div ref={mapContainerRef} className="w-full h-full z-10" />
        </div>
      </div>

      <div className="text-[10px] text-neutral-400 dark:text-neutral-500 flex flex-wrap items-center gap-1 mt-4 border-t border-[#F5F2EB] dark:border-neutral-800 pt-4 transition-colors duration-300">
        <span>🌐 {t.dataSource}</span>
        <a 
          href="https://data.buenosaires.gob.ar/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline hover:text-neutral-600 dark:hover:text-neutral-400 font-semibold"
        >
          {t.portalName}
        </a>
        <span>{t.dataDesc}</span>
      </div>
    </div>
  );
}
