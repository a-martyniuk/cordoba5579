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
  Compass,
  ShoppingCart,
  Phone,
  Mail,
  Clock,
  Globe
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

// LocalStorage caching helpers for EPOK queries
const CACHE_KEY_PREFIX = "epok_pois_";
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

function getCachedPOIs(key: string): PlaceOfInterest[] | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(CACHE_KEY_PREFIX + key);
    if (!cached) return null;
    const { timestamp, data } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
      return data;
    }
  } catch (e) {
    console.error("Error reading cache:", e);
  }
  return null;
}

function setCachedPOIs(key: string, data: PlaceOfInterest[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify({
      timestamp: Date.now(),
      data
    }));
  } catch (e) {
    console.error("Error setting cache:", e);
  }
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

// Fetch a single page of EPOK POIs (max 50 per page)
async function fetchEpokPOIsPage(categoria: string, searchText: string, start: number = 0): Promise<{ results: PlaceOfInterest[]; total: number }> {
  try {
    const searchUrl = `https://epok.buenosaires.gob.ar/buscar/?texto=${encodeURIComponent(searchText)}&categoria=${categoria}&start=${start}`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) throw new Error(`Search failed for ${categoria}`);
    const searchJson = await searchRes.json();
    
    const instances = searchJson.instancias || [];
    const total = searchJson.totalInstancias || instances.length;
    
    const detailPromises = instances.map(async (inst: any) => {
      try {
        const detailUrl = `https://epok.buenosaires.gob.ar/getObjectContent/?id=${inst.id}`;
        const detailRes = await fetch(detailUrl);
        if (!detailRes.ok) return null;
        const detailJson = await detailRes.json();
        
        // Extract centroid coordinates from WKT: e.g. "POINT (108260.56 103031.93)"
        const centroid = detailJson.ubicacion?.centroide;
        if (!centroid) return null;
        const match = centroid.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
        if (!match) return null;
        
        const x = parseFloat(match[1]);
        const y = parseFloat(match[2]);
        if (isNaN(x) || isNaN(y)) return null;
        
        const coords = convertProjectedToWGS84(x, y);
        
        const contenido = detailJson.contenido || [];
        const getVal = (id: string) => {
          const item = contenido.find((c: any) => c.nombreId === id);
          return item ? item.valor : undefined;
        };
        
        const address = detailJson.direccionNormalizada || getVal("direccion") || "";
        const phone = getVal("telefonos") || getVal("telefono") || "";
        const email = getVal("email") || getVal("correo") || getVal("mail") || "";
        const web = getVal("web") || getVal("sitio_web") || getVal("pag_web") || "";
        
        // Map CABA category normalizations to our app's POI types
        let type: PlaceOfInterest["type"] = "hospital";
        if (categoria === "comisarias") type = "security";
        else if (categoria === "cuarteles_de_bomberos") type = "security";
        else if (categoria === "estaciones_de_subte") type = "subway";
        else if (categoria === "estaciones_de_metrobus") type = "metrobus";
        else if (categoria === "centros_comerciales") type = "shopping";
        else if (categoria === "gastronomia") type = "food";
        else if (categoria === "lugar_emblematico") type = "tourist";
        
        // Detect subway line from name for color coding
        const subLine = categoria === "estaciones_de_subte" 
          ? detectSubwayLine(inst.nombre) 
          : undefined;
        
        const isFireStation = categoria === "cuarteles_de_bomberos";
        
        return {
          name: inst.nombre,
          type,
          distance: "Calculando...",
          desc: inst.clase || detailJson.clase || "",
          lat: coords.lat,
          lng: coords.lng,
          phone,
          email,
          web,
          address,
          hours: "Guardia 24 horas",
          subLine,
          isFireStation
        } as PlaceOfInterest;
      } catch (err) {
        console.error("Error fetching EPOK object content:", err);
        return null;
      }
    });
    
    const results = (await Promise.all(detailPromises)).filter((p): p is PlaceOfInterest => p !== null);
    return { results, total };
  } catch (e) {
    console.error("Error fetching from EPOK API:", e);
    return { results: [], total: 0 };
  }
}

// Fetch ALL POIs from EPOK using pagination (loops until all results are retrieved)
async function fetchAllEpokPOIs(categoria: string, searchText: string, maxResults: number = 300): Promise<PlaceOfInterest[]> {
  const allResults: PlaceOfInterest[] = [];
  let start = 0;
  const pageSize = 50;
  let total = Infinity;
  
  while (start < total && allResults.length < maxResults) {
    const { results, total: pageTotal } = await fetchEpokPOIsPage(categoria, searchText, start);
    total = pageTotal;
    allResults.push(...results);
    
    if (results.length === 0) break; // No more results
    start += pageSize;
    
    // Safety: never exceed maxResults
    if (allResults.length >= maxResults) break;
  }
  
  return allResults;
}


interface PlaceOfInterest {
  name: string;
  type: "stay" | "subway" | "metrobus" | "shopping" | "supermarket" | "food" | "hospital" | "security" | "park" | "museum" | "theater" | "tourist";
  distance: string;
  desc: string;
  lat: number;
  lng: number;
  phone?: string;
  email?: string;
  web?: string;
  hours?: string;
  address?: string;
  subLine?: string; // Subway line identifier: "A", "B", "C", "D", "E", "H"
  isFireStation?: boolean; // Distinguish bomberos from comisarias
}

const fallbackPlaces: PlaceOfInterest[] = [
  {
    name: "Av. Córdoba 5579 (El Departamento)",
    type: "stay",
    distance: "Ubicación",
    desc: "Moderno departamento a estrenar, ubicado estratégicamente en Palermo Hollywood.",
    lat: -34.587546,
    lng: -58.439668,
    phone: "+54 9 11 4537-9500",
    hours: "24 hs",
    address: "Av. Córdoba 5579, Palermo Hollywood"
  },
  {
    name: "Carrefour Market (Av. Córdoba 5600)",
    type: "supermarket",
    distance: "1 min. a pie",
    desc: "Supermercado express a la vuelta del departamento, ideal para compras rápidas cotidianas.",
    lat: -34.5879,
    lng: -58.4390,
    hours: "Lunes a Sábados 08:00–21:30, Domingos cerrado",
    address: "Av. Córdoba 5625, Palermo"
  },
  {
    name: "Jumbo Palermo",
    type: "supermarket",
    distance: "9 min. a pie",
    desc: "Gran supermercado hipermercado con amplia variedad de comestibles, bebidas y bazar en el centro comercial Portal Palermo.",
    lat: -34.5779,
    lng: -58.4285,
    phone: "0810-999-5862",
    hours: "Lunes a Sábados 08:30–22:00, Domingos 09:00–22:00",
    address: "Av. Int. Bullrich 345, Palermo"
  },
  {
    name: "Jardín Japonés",
    type: "tourist",
    distance: "8 min. en auto / 25 min. a pie",
    desc: "Hermoso y tranquilo jardín zen administrado por la Fundación Cultural Argentino Japonesa, con restaurante y vivero.",
    lat: -34.5750,
    lng: -58.4098,
    phone: "011 4804-9141",
    web: "www.jardinjapones.org.ar",
    hours: "Todos los días 10:00–18:45",
    address: "Av. Casares 3450, Palermo"
  },
  {
    name: "Planetario Galileo Galilei",
    type: "tourist",
    distance: "9 min. en auto",
    desc: "El principal centro de divulgación de astronomía de la ciudad, con proyecciones domo de alta resolución y parque arbolado.",
    lat: -34.5696,
    lng: -58.4116,
    phone: "011 4771-6629",
    web: "planetario.buenosaires.gob.ar",
    hours: "Martes a Domingos 09:00–19:30, Lunes cerrado",
    address: "Av. Sarmiento y Belisario Roldán, Palermo"
  },
  {
    name: "Estación Ministro Carranza (Línea D)",
    type: "subway",
    distance: "8 min. a pie",
    desc: "Línea directa al Obelisco, Plaza de Mayo y combinaciones con toda la red de subtes.",
    lat: -34.5754,
    lng: -58.4349,
    address: "Av. Santa Fe y Av. Dorrego, Palermo"
  },
  {
    name: "Estación Palermo (Línea D)",
    type: "subway",
    distance: "10 min. a pie",
    desc: "Ubicada en Av. Santa Fe y Av. Juan B. Justo, junto al centro comercial Distrito Arcos.",
    lat: -34.5815,
    lng: -58.4285,
    address: "Av. Santa Fe y Av. Juan B. Justo, Palermo"
  },
  {
    name: "Metrobús Juan B. Justo - Estación Córdoba",
    type: "metrobus",
    distance: "2 min. a pie",
    desc: "Carril exclusivo de colectivos (líneas 34, 166) cruzando de este a oeste de la ciudad.",
    lat: -34.5872,
    lng: -58.4411,
    address: "Av. Juan B. Justo y Av. Córdoba, Palermo"
  },
  {
    name: "Distrito Arcos Outlet Premium",
    type: "shopping",
    distance: "10 min. a pie",
    desc: "Centro comercial a cielo abierto de primeras marcas, cafeterías gourmet y locales de diseño.",
    lat: -34.5815,
    lng: -58.4285,
    web: "www.distritoarcos.com",
    hours: "Todos los días 10:00–21:00",
    address: "Paraguay 4979, Palermo"
  },
  {
    name: "Don Julio Parrilla",
    type: "food",
    distance: "12 min. a pie",
    desc: "Galardonada como una de las mejores parrillas del mundo. Carnes de pastura maduradas y excelente cava.",
    lat: -34.5863,
    lng: -58.4243,
    phone: "011 4833-0363",
    web: "www.parrilladonjulio.com",
    hours: "Todos los días 11:30–16:00, 19:00–01:00",
    address: "Guatemala 4699, Palermo"
  },
  {
    name: "La Mar Cebichería",
    type: "food",
    distance: "7 min. a pie",
    desc: "Prestigioso restaurante de cocina peruana y pescados frescos, ideal para cenar en su hermoso patio.",
    lat: -34.5786,
    lng: -58.4385,
    phone: "011 4776-5543",
    web: "www.lamarcebicheria.com.ar",
    hours: "Lunes a Domingos 12:00–16:00, 19:00–00:00",
    address: "Arévalo 2024, Palermo"
  },
  {
    name: "Sanatorio de Los Arcos",
    type: "hospital",
    distance: "6 min. en auto / 12 min. a pie",
    desc: "Prestigioso sanatorio privado de alta complejidad con servicio de guardia de urgencias las 24 horas.",
    lat: -34.58102,
    lng: -58.42995,
    phone: "011 4779-1000",
    hours: "Guardia 24 horas",
    address: "Av. Juan B. Justo 909, Palermo"
  },
  {
    name: "Hospital de Agudos Dr. J. A. Fernández",
    type: "hospital",
    distance: "10 min. en auto",
    desc: "Hospital público general de alta complejidad de la Ciudad de Buenos Aires con guardia de urgencias.",
    lat: -34.5806,
    lng: -58.4069,
    phone: "011 4808-2600",
    hours: "Guardia 24 horas",
    address: "Cerviño 3356, Palermo"
  },
  {
    name: "Comisaría Vecinal 14B - Policía de la Ciudad",
    type: "security",
    distance: "10 min. a pie",
    desc: "Seccional oficial de policía de la Ciudad, garantizando presencia de seguridad y asistencia en la zona.",
    lat: -34.57329,
    lng: -58.43905,
    phone: "011 4771-4444",
    email: "comisaria14b@policiadelaciudad.gob.ar",
    hours: "Abierto 24 horas",
    address: "Av. Dorrego 1898, Palermo"
  },
  {
    name: "Destacamento de Bomberos Palermo",
    type: "security",
    distance: "10 min. a pie / 4 min. en auto",
    desc: "Cuartel oficial de Bomberos de la Ciudad de Buenos Aires.",
    lat: -34.5775,
    lng: -58.4356,
    phone: "100 (Emergencias)",
    hours: "Abierto 24 horas",
    address: "Guatemala 5966, Palermo"
  },
  {
    name: "Plaza Cortázar (Plaza Serrano)",
    type: "park",
    distance: "12 min. a pie",
    desc: "El corazón de Palermo Soho, famoso por su feria artesanal de diseño y una vibrante oferta de bares.",
    lat: -34.5887,
    lng: -58.4301,
    address: "Honduras y Serrano, Palermo"
  },
  {
    name: "Centro Cultural de la Ciencia (C3)",
    type: "museum",
    distance: "8 min. a pie",
    desc: "Museo científico interactivo con talleres y exhibiciones modernas, ideal para visitar.",
    lat: -34.582566,
    lng: -58.429118,
    phone: "011 4899-7300",
    web: "ccscience.gob.ar",
    hours: "Viernes a Domingos 13:00–19:30",
    address: "Godoy Cruz 2270, Palermo"
  },
  {
    name: "MALBA (Museo de Arte Latinoamericano)",
    type: "museum",
    distance: "8 min. en auto",
    desc: "Excepcional colección de arte latinoamericano moderno y contemporáneo en un edificio icónico.",
    lat: -34.5772,
    lng: -58.4042,
    phone: "011 4808-6500",
    web: "www.malba.org.ar",
    hours: "Jueves a Lunes 12:00–20:00, Miércoles 11:00–20:00, Martes cerrado",
    address: "Av. Figueroa Alcorta 3415, Palermo"
  },
  {
    name: "Teatro Regio",
    type: "theater",
    distance: "7 min. a pie",
    desc: "Pertenece al Complejo Teatral de Buenos Aires, ofreciendo obras dramáticas con grandes elencos locales.",
    lat: -34.584361,
    lng: -58.445889,
    phone: "011 4772-3350",
    web: "complejoteatral.gob.ar",
    hours: "Según funciones programadas",
    address: "Av. Córdoba 6056, Colegiales"
  },
  {
    name: "Casa Rosada (Sede del Gobierno)",
    type: "tourist",
    distance: "15 min. en auto",
    desc: "Sede del Poder Ejecutivo de la República Argentina y monumento histórico nacional.",
    lat: -34.608056,
    lng: -58.370278,
    web: "presidencia.gob.ar",
    address: "Balcarce 50, Monserrat"
  },
  {
    name: "Obelisco de Buenos Aires",
    type: "tourist",
    distance: "12 min. en auto",
    desc: "El monumento icónico de la Ciudad de Buenos Aires y centro de festejos populares.",
    lat: -34.603722,
    lng: -58.381589,
    address: "Av. 9 de Julio y Av. Corrientes, San Nicolás"
  },
  {
    name: "Teatro Colón",
    type: "theater",
    distance: "12 min. en auto",
    desc: "Uno de los teatros de ópera más importantes del mundo por su acústica y arquitectura.",
    lat: -34.601111,
    lng: -58.383056,
    phone: "011 4378-7100",
    web: "teatrocolon.org.ar",
    address: "Cerrito 628, San Nicolás"
  },
  {
    name: "Carrefour San Telmo",
    type: "supermarket",
    distance: "15 min. en auto",
    desc: "Supermercado Carrefour en el histórico barrio de San Telmo.",
    lat: -34.6203,
    lng: -58.3735,
    hours: "Lunes a Sábados 08:00–21:30",
    address: "Av. San Juan 960, San Telmo"
  },
  {
    name: "Cementerio de la Recoleta",
    type: "tourist",
    distance: "10 min. en auto",
    desc: "Famoso cementerio que alberga las bóvedas de importantes personalidades de la historia argentina.",
    lat: -34.5875,
    lng: -58.3930,
    hours: "Todos los días 08:00-18:00",
    address: "Junín 1760, Recoleta"
  },
  {
    name: "Abasto Shopping",
    type: "shopping",
    distance: "8 min. en auto",
    desc: "Uno de los centros comerciales más grandes de la ciudad, en el antiguo mercado de Abasto.",
    lat: -34.6033,
    lng: -58.4109,
    web: "abastoshopping.com.ar",
    hours: "Todos los días 10:00-22:00",
    address: "Av. Corrientes 3247, Balvanera"
  },
  {
    name: "Coto Abasto",
    type: "supermarket",
    distance: "8 min. en auto",
    desc: "Gran supermercado Coto con estacionamiento, ubicado frente al Abasto Shopping.",
    lat: -34.6025,
    lng: -58.4115,
    phone: "011 4866-2244",
    hours: "Lunes a Sábados 08:30–22:00",
    address: "Anchorena 901, Balvanera"
  },
  {
    name: "Caminito (La Boca)",
    type: "tourist",
    distance: "20 min. en auto",
    desc: "Calle museo peatonal de gran valor cultural y turístico, famoso por sus conventillos de colores.",
    lat: -34.639444,
    lng: -58.362778,
    address: "Av. Pedro de Mendoza, La Boca"
  },
  {
    name: "Hospital de Pediatría Dr. J. Garrahan",
    type: "hospital",
    distance: "18 min. en auto",
    desc: "Principal hospital nacional de pediatría de alta complejidad médica.",
    lat: -34.6318,
    lng: -58.3894,
    phone: "4941-8772",
    web: "garrahan.gov.ar",
    hours: "Guardia 24 horas",
    address: "Combate de los Pozos 1881, Parque Patricios"
  },
  {
    name: "Las Violetas (Café Histórico)",
    type: "food",
    distance: "14 min. en auto",
    desc: "Confitería y restaurante inaugurado en 1884, declarado lugar de interés cultural de la ciudad.",
    lat: -34.617222,
    lng: -58.4225,
    phone: "011 4958-7387",
    hours: "Todos los días 06:00-01:00",
    address: "Av. Rivadavia 3899, Almagro"
  },
  {
    name: "Parque Centenario",
    type: "park",
    distance: "10 min. en auto",
    desc: "Gran espacio verde público con lago artificial, ferias de libros y anfiteatro.",
    lat: -34.6075,
    lng: -58.4358,
    address: "Av. Díaz Vélez y Leopoldo Marechal, Caballito"
  },
  {
    name: "Jumbo Caballito",
    type: "supermarket",
    distance: "12 min. en auto",
    desc: "Hipermercado Jumbo ubicado en el centro geográfico de la ciudad.",
    lat: -34.6186,
    lng: -58.4358,
    phone: "0810-999-5862",
    hours: "Lunes a Sábados 08:30–22:00, Domingos 09:00–22:00",
    address: "Av. Rivadavia 5100, Caballito"
  },
  {
    name: "Vea Flores",
    type: "supermarket",
    distance: "15 min. en auto",
    desc: "Supermercado Vea ofreciendo productos frescos y de almacén en Flores.",
    lat: -34.6302,
    lng: -58.4633,
    hours: "Lunes a Sábados 08:30–21:30",
    address: "Av. Rivadavia 6500, Flores"
  },
  {
    name: "Parque de la Ciudad",
    type: "park",
    distance: "22 min. en auto",
    desc: "Inmenso parque público recreativo con senderos y la icónica Torre Espacial.",
    lat: -34.6750,
    lng: -58.4550,
    hours: "Sábados y Domingos 10:00-18:00",
    address: "Av. Roca y Av. Escalada, Villa Soldati"
  },
  {
    name: "Feria de Mataderos",
    type: "tourist",
    distance: "25 min. en auto",
    desc: "Feria de tradiciones populares argentinas con destrezas gauchas, comidas típicas y artesanías.",
    lat: -34.6561,
    lng: -58.5028,
    web: "feriademataderos.gob.ar",
    hours: "Domingos 11:00-19:00",
    address: "Av. Lisandro de la Torre, Mataderos"
  },
  {
    name: "Devoto Shopping",
    type: "shopping",
    distance: "20 min. en auto",
    desc: "Centro comercial con salas de cine, patio de comidas y locales de primeras marcas en Villa Devoto.",
    lat: -34.6015,
    lng: -58.5125,
    web: "devotoshopping.com.ar",
    hours: "Todos los días 10:00-22:00",
    address: "Quevedo 3365, Villa Devoto"
  },
  {
    name: "Carrefour Villa Urquiza",
    type: "supermarket",
    distance: "18 min. en auto",
    desc: "Hipermercado Carrefour con amplio sector de bazar, electrodomésticos y alimentos.",
    lat: -34.5721,
    lng: -58.4879,
    hours: "Lunes a Sábados 08:00–22:00",
    address: "Av. Constituyentes 4850, Villa Urquiza"
  },
  {
    name: "Coto Belgrano",
    type: "supermarket",
    distance: "10 min. en auto",
    desc: "Gran sucursal Coto de tres niveles con gran variedad de productos en Belgrano.",
    lat: -34.5615,
    lng: -58.4562,
    phone: "011 4788-3400",
    hours: "Lunes a Sábados 08:30–22:00",
    address: "Av. Cabildo 2230, Belgrano"
  },
  {
    name: "Cementerio de la Chacarita",
    type: "tourist",
    distance: "10 min. en auto",
    desc: "El cementerio más grande de la Ciudad de Buenos Aires, con importantes mausoleos históricos.",
    lat: -34.5900,
    lng: -58.4550,
    hours: "Todos los días 08:00-17:00",
    address: "Av. Guzmán 680, Chacarita"
  }
];

const categories = [
  { id: "all", name: "Todos", icon: "✨" },
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

const getCategoryHtmlIcon = (type: string, subLine?: string, isFireStation?: boolean): string => {
  if (type === "security" && isFireStation) return getFireStationHtmlIcon();
  if (type === "subway" && subLine) return getSubwayLineLabel(subLine);
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
}

export default function NeighbourhoodMap({ sheetUrl }: NeighbourhoodMapProps) {
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
  const [loadingPOIs, setLoadingPOIs] = useState<boolean>(false);
  const [activeRoute, setActiveRoute] = useState<[number, number][] | null>(null);
  const [activeRouteInfo, setActiveRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // USIG Interactive Layer States
  const [showEcobici, setShowEcobici] = useState<boolean>(false);
  const [showSube, setShowSube] = useState<boolean>(false);
  const [shouldDrawLocalLayers, setShouldDrawLocalLayers] = useState<boolean>(true);

  // Layer refs to add/remove Leaflet elements dynamically
  const ecobiciLayerRef = useRef<any>(null);
  const subeLayerRef = useRef<any>(null);

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
            return { name, type: category, distance, desc, lat, lng, phone, email, web, hours, address } as PlaceOfInterest;
          }

          // 3. Fallback to geocoding if coordinates are completely missing
          if (address) {
            try {
              const coords = await geocodeAddress(address);
              if (coords) {
                return { name, type: category, distance, desc, lat: coords.lat, lng: coords.lng, phone, email, web, hours, address } as PlaceOfInterest;
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

  // Dynamic CABA EPOK API loading for all supported categories
  useEffect(() => {
    const stay = basePlaces.find(p => p.type === "stay") || fallbackPlaces[0];
    const dynamicCategories = ["hospital", "security", "subway", "metrobus", "shopping", "food", "tourist"];
    
    if (dynamicCategories.includes(selectedCategory)) {
      const cached = getCachedPOIs(selectedCategory);
      if (cached) {
        setPlacesList([stay, ...cached]);
        return;
      }
      
      async function loadDynamicPOIs() {
        setLoadingPOIs(true);
        
        try {
          let pois: PlaceOfInterest[] = [];
          
          switch (selectedCategory) {
            case "hospital": {
              // Fetch both general and specialized hospitals across all CABA
              const [general, specialized, maternity] = await Promise.all([
                fetchAllEpokPOIs("hospitales_generales_de_agudos", "hospital"),
                fetchAllEpokPOIs("hospitales_especializados", "hospital"),
                fetchAllEpokPOIs("maternidades", "maternidad")
              ]);
              // Deduplicate by name
              const seen = new Set<string>();
              for (const p of [...general, ...specialized, ...maternity]) {
                if (!seen.has(p.name)) { seen.add(p.name); pois.push(p); }
              }
              break;
            }
            case "security": {
              // Fetch both police (comisarías) and fire stations (bomberos)
              const [comisarias, bomberos] = await Promise.all([
                fetchAllEpokPOIs("comisarias", "comisaria"),
                fetchAllEpokPOIs("cuarteles_de_bomberos", "bomberos")
              ]);
              pois = [...comisarias, ...bomberos];
              break;
            }
            case "subway": {
              // Fetch all subway lines A-H using their line-specific keywords for better coverage
              const lineKeywords = [
                { keyword: "linea a" },
                { keyword: "linea b" },
                { keyword: "linea c" },
                { keyword: "linea d" },
                { keyword: "linea e" },
                { keyword: "linea h" }
              ];
              const lineResults = await Promise.all(
                lineKeywords.map(({ keyword }) =>
                  fetchAllEpokPOIs("estaciones_de_subte", keyword)
                )
              );
              // Merge and deduplicate
              const seen = new Set<string>();
              for (const lineStations of lineResults) {
                for (const station of lineStations) {
                  if (!seen.has(station.name)) {
                    seen.add(station.name);
                    // If subLine not detected from name, try to detect from the keyword used
                    if (!station.subLine) {
                      const idx = lineResults.indexOf(lineStations);
                      const lineLetters = ["A", "B", "C", "D", "E", "H"];
                      station.subLine = lineLetters[idx];
                    }
                    pois.push(station);
                  }
                }
              }
              break;
            }
            case "metrobus":
              pois = await fetchAllEpokPOIs("estaciones_de_metrobus", "estacion");
              break;
            case "shopping":
              pois = await fetchAllEpokPOIs("centros_comerciales", "shopping");
              break;
            case "food":
              pois = await fetchAllEpokPOIs("gastronomia", "restaurante");
              break;
            case "tourist":
              pois = await fetchAllEpokPOIs("lugar_emblematico", "museo");
              break;
            default:
              break;
          }
          
          if (pois && pois.length > 0) {
            setCachedPOIs(selectedCategory, pois);
            setPlacesList([stay, ...pois]);
          } else {
            // Fallback to static basePlaces for this category
            const staticFiltered = basePlaces.filter(p => p.type === selectedCategory);
            setPlacesList([stay, ...staticFiltered]);
          }
        } catch (err) {
          console.error("Error loading dynamic POIs:", err);
          const staticFiltered = basePlaces.filter(p => p.type === selectedCategory);
          setPlacesList([stay, ...staticFiltered]);
        }
        
        setLoadingPOIs(false);
      }
      loadDynamicPOIs();
    } else {
      setPlacesList(basePlaces);
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
          
          // Dynamically update the distance in state list for the selected POI
          setPlacesList(prev => prev.map(p => {
            if (p.lat === dest.lat && p.lng === dest.lng) {
              return { ...p, distance: durationText };
            }
            return p;
          }));
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

      // Adjust boundaries to fit the route
      const bounds = L.latLngBounds(activeRoute);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [activeRoute, mapReady]);

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
      const markerColor = getCategoryColor(place.type, place.subLine, place.isFireStation);
      const markerHtmlIcon = getCategoryHtmlIcon(place.type, place.subLine, place.isFireStation);

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

      // Structured Popup HTML
      let popupHtml = `
        <div style="font-family: sans-serif; padding: 4px; max-width: 220px; line-height: 1.4;">
          <h4 style="margin: 0 0 4px 0; font-weight: 700; color: #1C1B19; font-size: 13px;">${place.name}</h4>
          <p style="margin: 0 0 6px 0; color: #5F6F52; font-size: 11px; font-weight: 600;">${place.distance}</p>
          <p style="margin: 0 0 6px 0; color: #555; font-size: 11px; line-height: 1.3;">${place.desc}</p>
      `;

      if (place.address) {
        popupHtml += `<p style="margin: 0 0 4px 0; color: #777; font-size: 10px;"><b>Dir:</b> ${place.address}</p>`;
      }
      if (place.phone) {
        popupHtml += `<p style="margin: 0 0 4px 0; color: #777; font-size: 10px;"><b>Tel:</b> <a href="tel:${place.phone}" style="color: #5F6F52; text-decoration: none; font-weight: 600;">${place.phone}</a></p>`;
      }
      if (place.hours) {
        popupHtml += `<p style="margin: 0 0 4px 0; color: #777; font-size: 10px;"><b>Horario:</b> ${place.hours}</p>`;
      }
      if (place.web) {
        const href = place.web.startsWith("http") ? place.web : `https://${place.web}`;
        popupHtml += `<p style="margin: 0; color: #777; font-size: 10px;"><b>Web:</b> <a href="${href}" target="_blank" style="color: #5F6F52; font-weight: bold; text-decoration: underline;">Ver web ↗</a></p>`;
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
    } else if (selectedCategory === "all" && placesList.length > 1) {
      const bounds = L.latLngBounds(placesList.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    } else if (placesList.length > 0) {
      map.setView([placesList[0].lat, placesList[0].lng], 15);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, selectedCategory, placesList]);

  // Manage USIG dynamic layers when state changes (Ecobici and SUBE)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const L = (window as any).L;
    if (!L) return;

    // 1. Manage Ecobici Markers
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
        m.on("mouseover", () => m.openPopup());
        m.on("mouseout", () => m.closePopup());
        return m;
      });
      
      const group = L.layerGroup(markers);
      group.addTo(map);
      ecobiciLayerRef.current = group;
    }

    // 2. Manage SUBE / Transporte Markers
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
        m.on("mouseover", () => m.openPopup());
        m.on("mouseout", () => m.closePopup());
        return m;
      });
      
      const group = L.layerGroup(markers);
      group.addTo(map);
      subeLayerRef.current = group;
    }
  }, [showEcobici, showSube, mapReady, placesList, shouldDrawLocalLayers]);

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

  const getPlaceIcon = (type: string) => {
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

  return (
    <div className="bg-white border border-[#EFEBE4] rounded-3xl p-6 md:p-8 space-y-6">
      <div>
        <h3 className="font-serif text-2xl text-neutral-900 font-semibold">Ubicaciones y Puntos de Interés</h3>
        <p className="text-neutral-500 text-sm mt-1">
          Explora la conectividad, cultura, salud, compras y recreación de la ciudad. Soporta coordenadas precisas de toda la Ciudad de Buenos Aires.
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
        {!shouldDrawLocalLayers && (showEcobici || showSube) && (
          <div className="text-xs text-amber-600 bg-amber-50/50 border border-amber-200/50 rounded-xl p-3 flex items-center gap-2 animate-pulse">
            <span>⚠️</span>
            <span>Las capas de Ecobici son locales de Palermo. Mueve o acerca el mapa al departamento para visualizarlas.</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Place selector (order-2 on mobile, order-1 on large screens) */}
        <div className="order-2 lg:order-1 lg:col-span-5 flex flex-col justify-between space-y-4">
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

          {/* Subway Line Color Legend */}
          {selectedCategory === "subway" && (
            <div className="bg-[#FAF9F7] border border-[#EFEBE4] rounded-2xl p-3 text-xs">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Red de Subterráneos CABA</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { line: "A", color: "#18A7E8", label: "Línea A" },
                  { line: "B", color: "#E4002B", label: "Línea B" },
                  { line: "C", color: "#0072BB", label: "Línea C" },
                  { line: "D", color: "#008000", label: "Línea D" },
                  { line: "E", color: "#7A0080", label: "Línea E" },
                  { line: "H", color: "#F5A800", label: "Línea H" },
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
            <div className="bg-[#FAF9F7] border border-[#EFEBE4] rounded-2xl p-3 text-xs">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Fuerzas de Seguridad</p>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#2F80ED]/10 border border-[#2F80ED]/30">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#2F80ED]"></div>
                  <span className="text-[10px] font-semibold text-[#2F80ED]">Comisarías</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#E55A1C]/10 border border-[#E55A1C]/30">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#E55A1C]"></div>
                  <span className="text-[10px] font-semibold text-[#E55A1C]">Bomberos</span>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-2.5 max-h-[250px] lg:max-h-[440px] overflow-y-auto pr-1">
            {loadingPOIs ? (
              <div className="space-y-2.5">
                {/* Keep stay location pinned at the top even while loading */}
                {filteredPlacesForList.filter(p => p.type === "stay").map((place, idx) => {
                  const originalIndex = placesList.findIndex(p => p.name === place.name);
                  const isActive = activePlace === originalIndex;
                  return (
                    <button
                      key={`loading-stay-${idx}`}
                      onClick={() => handlePlaceSelect(originalIndex)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex gap-4 items-start ${
                        isActive
                          ? "bg-[#FAF9F7] border-[#5F6F52] ring-1 ring-[#5F6F52] shadow-sm"
                          : "bg-white border-[#EFEBE4] hover:bg-neutral-50"
                      }`}
                    >
                      <div className={`p-2.5 rounded-full ${isActive ? "bg-white text-[#5F6F52]" : "bg-neutral-100 text-neutral-600"} flex-shrink-0 mt-0.5`}>
                        {getPlaceIcon(place.type)}
                      </div>
                      <div className="space-y-1 w-full min-w-0">
                        <p className="font-semibold text-sm text-neutral-900 leading-snug break-words">{place.name}</p>
                        <p className="text-[#5F6F52] font-semibold text-xs">{place.distance}</p>
                        {isActive && (
                          <div className="mt-3 space-y-2.5 pt-2.5 border-t border-[#F0EBE0] text-xs text-neutral-600 w-full animate-fadeIn">
                            <p className="text-neutral-500 leading-relaxed break-words">{place.desc}</p>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
                {/* Premium Loading Spinner Block */}
                <div className="flex flex-col items-center justify-center py-10 px-4 space-y-3 bg-[#FAF9F7]/50 rounded-2xl border border-dashed border-[#EFEBE4] animate-pulse">
                  <div className="w-7 h-7 border-2 border-[#5F6F52] border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-center space-y-1">
                    <p className="text-xs font-semibold text-neutral-700">
                      {selectedCategory === "hospital" && "Buscando hospitales de toda CABA..."}
                      {selectedCategory === "security" && "Buscando comisarías y bomberos..."}
                      {selectedCategory === "subway" && "Cargando todas las líneas de subte..."}
                      {selectedCategory === "metrobus" && "Cargando estaciones de Metrobús..."}
                      {selectedCategory === "shopping" && "Buscando centros comerciales..."}
                      {selectedCategory === "food" && "Buscando gastronomía..."}
                      {selectedCategory === "tourist" && "Buscando lugares emblemáticos..."}
                    </p>
                    <p className="text-[10px] text-neutral-500">Consultando API EPOK (GCBA) — puede tardar unos segundos</p>
                  </div>
                </div>
              </div>
            ) : (
              filteredPlacesForList.map((place, idx) => {
                const originalIndex = placesList.findIndex(p => p.name === place.name);
                const isActive = activePlace === originalIndex;
                
                return (
                  <button
                    key={idx}
                    onClick={() => handlePlaceSelect(originalIndex)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex gap-4 items-start ${
                      isActive
                        ? "bg-[#FAF9F7] border-[#5F6F52] ring-1 ring-[#5F6F52] shadow-sm"
                        : "bg-white border-[#EFEBE4] hover:bg-neutral-50"
                    }`}
                  >
                    <div className={`p-2.5 rounded-full ${isActive ? "bg-white text-[#5F6F52]" : "bg-neutral-100 text-neutral-600"} flex-shrink-0 mt-0.5`}>
                      {getPlaceIcon(place.type)}
                    </div>
                    <div className="space-y-1 w-full min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-semibold text-sm text-neutral-900 leading-snug break-words">{place.name}</p>
                        {place.subLine && (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white font-black text-[9px] flex-shrink-0"
                            style={{ backgroundColor: (() => { const c: Record<string,string> = {A:"#18A7E8",B:"#E4002B",C:"#0072BB",D:"#008000",E:"#7A0080",H:"#F5A800"}; return c[place.subLine!] || "#2D9CDB"; })() }}>
                            {place.subLine}
                          </span>
                        )}
                        {place.isFireStation && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white flex-shrink-0"
                            style={{ backgroundColor: "#E55A1C" }}>
                            🔥 Bomberos
                          </span>
                        )}
                      </div>
                      <p className="text-[#5F6F52] font-semibold text-xs">{place.distance}</p>
                      
                      {/* Expanded details when active */}
                      {isActive && (
                        <div className="mt-3 space-y-2.5 pt-2.5 border-t border-[#F0EBE0] text-xs text-neutral-600 w-full animate-fadeIn">
                          {/* Route duration detailed badge */}
                          {activeRouteInfo && place.type !== "stay" && (
                            <div className="bg-[#FAF9F7] border border-[#5F6F52]/10 rounded-xl p-2.5 flex items-start gap-2 text-neutral-700 shadow-sm">
                              <span className="text-sm">📍</span>
                              <div>
                                <p className="font-bold text-[9px] uppercase tracking-wider text-[#5F6F52]">Ruta sugerida desde el depto:</p>
                                <p className="text-[11px] text-neutral-800 mt-0.5 leading-snug">{activeRouteInfo.duration}</p>
                              </div>
                            </div>
                          )}

                          <p className="text-neutral-500 leading-relaxed break-words">{place.desc}</p>
                          
                          {place.address && (
                            <div className="flex gap-1.5 items-start mt-1">
                              <span className="font-bold text-neutral-500 flex-shrink-0">Dir:</span>
                              <span className="text-neutral-600 break-words">{place.address}</span>
                            </div>
                          )}
                          
                          {place.phone && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <Phone className="w-3.5 h-3.5 text-neutral-400" />
                              <a href={`tel:${place.phone}`} className="text-[#5F6F52] hover:underline font-semibold">{place.phone}</a>
                            </div>
                          )}
                          
                          {place.email && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <Mail className="w-3.5 h-3.5 text-neutral-400" />
                              <a href={`mailto:${place.email}`} className="text-[#5F6F52] hover:underline break-all">{place.email}</a>
                            </div>
                          )}

                          {place.hours && (
                            <div className="flex gap-1.5 items-start mt-1">
                              <Clock className="w-3.5 h-3.5 text-neutral-400 mt-0.5" />
                              <span className="text-neutral-600 break-words">{place.hours}</span>
                            </div>
                          )}

                          {place.web && (
                            <div className="flex items-center gap-1.5 mt-1 pt-1">
                              <Globe className="w-3.5 h-3.5 text-neutral-400" />
                              <a 
                                href={place.web.startsWith("http") ? place.web : `https://${place.web}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-[#5F6F52] hover:underline font-semibold flex items-center gap-0.5"
                              >
                                <span>Visitar Sitio Web</span>
                                <span>↗</span>
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="bg-[#FAF9F7] border border-[#EFEBE4] rounded-2xl p-4 text-xs text-neutral-500 leading-relaxed">
            <strong>¿Cómo llegar?</strong> A pasos de la Av. Santa Fe y Av. Juan B. Justo. Múltiples líneas de colectivo (Metrobús) y la línea D de subte a minutos de distancia para moverte cómodamente por Buenos Aires.
          </div>
        </div>

        {/* Right Column: Leaflet Map Container (order-1 on mobile, order-2 on large screens) */}
        <div className="order-1 lg:order-2 lg:col-span-7 h-[300px] lg:h-auto min-h-[420px] rounded-2xl border border-[#EFEBE4] overflow-hidden relative shadow-inner">
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
        <span>• Ecobici, carga SUBE y coordenadas oficiales de seguridad, cultura, compras y transporte.</span>
      </div>
    </div>
  );
}
