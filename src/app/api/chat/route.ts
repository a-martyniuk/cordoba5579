import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { parseCSV } from "../../../utils/csvParser";
import airbnbDetails from "../../../data/airbnb-details.json";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";

interface CavaItem {
  categoria?: string;
  nombre?: string;
  descripcion?: string;
  cantidad?: number | string;
  precio_usd?: number | string;
  origen?: string;
}

// Fetch live Cava items from the published Google Sheets URL
async function fetchLiveCava(): Promise<CavaItem[]> {
  try {
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlUx7LNTseRM1DhoYGmw-9ZfuWpobnDFF5pLt4AuIdMiLLVEqVN_54OTZm0YbMUTp3-iHsk6Dbx4YP/pub?gid=286973474&output=csv";
    
    // 1.2s timeout to ensure the API route remains responsive
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1200);
    
    const response = await fetch(csvUrl, { 
      signal: controller.signal,
      next: { revalidate: 60 } // Cache for 1 minute
    });
    
    clearTimeout(id);
    
    if (!response.ok) throw new Error("Sheets fetch failed");
    const csvText = await response.text();
    const parsedData = parseCSV(csvText);
    
    if (parsedData.length > 1) {
      const headers = parsedData[0].map(h => h.trim().toLowerCase());
      return parsedData.slice(1).map((row) => {
        const getVal = (colName: string, fallback: string = ""): string => {
          const idx = headers.indexOf(colName);
          return idx !== -1 && row[idx] !== undefined ? row[idx].trim() : fallback;
        };
        const qtyStr = getVal("cantidad");
        const priceStr = getVal("precio_usd");
        return {
          categoria: getVal("categoria"),
          nombre: getVal("nombre"),
          descripcion: getVal("descripcion"),
          cantidad: parseInt(qtyStr, 10) || qtyStr || 0,
          precio_usd: parseFloat(priceStr) || priceStr || 0,
          origen: getVal("origen")
        };
      });
    }
  } catch (error) {
    console.warn("Could not fetch live Cava for chat prompt, using fallback:", error);
  }
  return airbnbDetails.cava || [];
}

// Dynamically build the cava section from live inventory data so prices
// always reflect the actual Google Sheet or airbnb-details.json.
async function buildCavaSection(): Promise<string> {
  const items = await fetchLiveCava();

  if (items.length === 0) {
    return "- Cava & Minibar: Servicio disponible con costo adicional. Consultar a Jorge Orlando por WhatsApp.";
  }

  const lines = items.map((item) => {
    const nombre = item.nombre || "(sin nombre)";
    const origen = item.origen ? ` (${item.origen})` : "";
    const cantidad = item.cantidad !== undefined ? `, stock: ${item.cantidad} u.` : "";
    const precio =
      item.precio_usd !== undefined
        ? `, USD ${Number(item.precio_usd).toFixed(2)} c/u`
        : "";
    return `  • ${nombre}${origen}${cantidad}${precio}`;
  });

  return `- Cava & Minibar (COSTO ADICIONAL — pago a Jorge Orlando vía WhatsApp, transferencia al Banco Santander):
${lines.join("\n")}
  Carta completa y QR en: https://www.alexismartyniuk.com.ar/cordoba5579/cava`;
}

async function buildSystemPrompt(): Promise<string> {
  const cavaSection = await buildCavaSection();
  return `Sos el Concierge Virtual del departamento Córdoba 5579 en Palermo Hollywood, Buenos Aires.
Respondés en el mismo idioma en que te hablen (español o inglés).
Sos amable, conciso y muy útil. Tu objetivo es ayudar a los huéspedes con información sobre:
- Check-in/Check-out: Ingreso 15:00 hs, salida 11:00 hs. El check-in es autónomo con lockbox.
- WiFi: Red "Cordoba5579_Guest" clave "Welcome101"
- Aire acondicionado: Frío/calor en cada habitación (living y dormitorio independientes).
- Estacionamiento: No disponible en el edificio. Garage pago a 2 cuadras.
- Piscina y Terraza: Piso 11, 9:00 a 20:00 hs. Uso EXCLUSIVO para huéspedes registrados. Visitas NO pueden acceder a amenities.
- Parrilla: Terraza piso 11, coordinar con Jorge por WhatsApp con anticipación.
- Normas del Edificio: Estrictamente prohibidas las fiestas, reuniones y ruidos molestos. Visitas deben ser registradas previamente.
- Caja de seguridad: Lockbox exterior en la puerta del edificio (no del departamento). Código enviado de forma privada.
- Mascotas: No se permiten.
- Fumadores: Sólo en la terraza, nunca dentro del departamento.
${cavaSection}
- Restaurantes cercanos: Palermo Hollywood tiene gastronomía excelente. Ver sección "Lugares" en el portal.
- Movistar Arena: A 5 cuadras caminando.
- Supermercado: Día a 3 cuadras.
- Contacto del anfitrión: Jorge Orlando, por WhatsApp.

IMPORTANTE: Cuando el huésped pregunte por vinos, precios o la cava, siempre citá los valores exactos de la lista de arriba. Si pregunta por un producto específico, buscalo y respondé con nombre, origen y precio exacto.
Si no sabés algo, recomendá contactar a Jorge directamente por WhatsApp.
Máximo 3 oraciones por respuesta. Sé concreto.`;
}

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "No API key configured", fallback: true },
        { status: 200 }
      );
    }

    const { message, language } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    const fullPrompt = `Idioma preferido del usuario: ${language === "en" ? "inglés" : "español"}\n\nPregunta del huésped: ${message}`;
    const systemPrompt = await buildSystemPrompt();

    const result = streamText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      prompt: fullPrompt,
    });

    return result.toTextStreamResponse();
  } catch (err) {
    console.error("Gemini API error:", err);
    return NextResponse.json(
      { error: "Gemini error", fallback: true },
      { status: 200 }
    );
  }
}
