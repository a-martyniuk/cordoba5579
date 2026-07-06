import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import airbnbDetails from "../../../data/airbnb-details.json";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";

// Dynamically build the cava section from live inventory data so prices
// always reflect the actual airbnb-details.json — no hardcoding needed.
function buildCavaSection(): string {
  const items = (airbnbDetails.cava ?? []) as Array<{
    nombre?: string;
    origen?: string;
    cantidad?: number | string;
    precio_usd?: number | string;
  }>;

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

function buildSystemPrompt(): string {
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
${buildCavaSection()}
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

    const result = streamText({
      model: google("gemini-1.5-flash"),
      system: buildSystemPrompt(),
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
