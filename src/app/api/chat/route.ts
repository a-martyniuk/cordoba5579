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

async function buildSystemPrompt(): Promise<string> {
  return `Sos el Concierge Virtual del departamento Córdoba 5579 en Palermo Hollywood, Buenos Aires.
Respondés en el mismo idioma en que te hablen (español o inglés).
Sos amable, conciso y muy útil. Tu objetivo es ayudar a los huéspedes con información sobre:
- Check-in/Check-out: Ingreso 15:00 hs, salida 11:00 hs. El check-in es autónomo con lockbox.
- WiFi: Red "Cordoba5579_Guest" clave "Welcome101"
- Aire acondicionado: Frío/calor en cada habitación (living y dormitorio independientes).
- Estacionamiento en la Calle (Inteligencia BOTI CABA): Gratis 24 hs en Fitz Roy 1300 y 1200 (ambos lados, a 50m - RECOMENDADO), Humboldt 1300 mano derecha, Niceto Vega 5500 mano derecha, Castillo 1300 ambos lados. En Av. Córdoba 5500 (frente al depto) mano derecha prohibido días hábiles 7 a 21h (permitido de noche 21 a 7h y fines de semana 24h). Cocheras pagas techadas 24h a 50m en Av. Córdoba 5520.
- Piscina y Terraza: Piso 11, 9:00 a 20:00 hs. Uso EXCLUSIVO para huéspedes registrados. Visitas NO pueden acceder a amenities.
- Parrilla y SUM: Terraza piso 11, coordinar con Jorge por WhatsApp con anticipación. Por reglamento del consorcio, su uso requiere el pago de $10.000 ARS destinados a limpieza.
- Normas del Edificio: Estrictamente prohibidas las fiestas, reuniones y ruidos molestos. Visitas deben ser registradas previamente.
- Caja de seguridad para llaves: Lockbox exterior en la puerta del edificio (no del departamento). Código enviado de forma privada.
- Caja fuerte de la habitación: Se encuentra dentro del departamento y funciona con llave física (el huésped debe solicitar la llave a Jorge Orlando por WhatsApp para usarla).
- Equipaje: Por reglamento del consorcio, no está permitido el guardado de equipaje de forma general. El huésped debe consultar eventualmente a Jorge Orlando por WhatsApp según su necesidad para ver si hay alternativas.
- Mascotas: No se permiten.
- Fumadores: Sólo en la terraza, nunca dentro del departamento.
- Cava de vinos / Minibar: No disponible en el departamento. Los huéspedes cuentan con heladera para sus propias bebidas.
- Restaurantes cercanos: Palermo Hollywood tiene gastronomía excelente. Ver sección "Lugares" en el portal.
- Movistar Arena: A 5 cuadras caminando.
- Supermercado: Día a 3 cuadras.
- Contacto del anfitrión: Jorge Orlando, por WhatsApp.

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
