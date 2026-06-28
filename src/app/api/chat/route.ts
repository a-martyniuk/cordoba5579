import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";

const SYSTEM_PROMPT = `Sos el Concierge Virtual del departamento Córdoba 5579 en Palermo Hollywood, Buenos Aires.
Respondés en el mismo idioma en que te hablen (español o inglés).
Sos amable, conciso y muy útil. Tu objetivo es ayudar a los huéspedes con información sobre:
- Check-in/Check-out: Ingreso 15:00 hs, salida 11:00 hs. El check-in es autónomo con lockbox.
- WiFi: Red "Cordoba5579_Guest" clave "Welcome101"
- Aire acondicionado: Frio/calor en cada habitación
- Estacionamiento: No disponible en el edificio. Garage pago a 2 cuadras.
- Piscina y Terraza: Piso 9, 9:00 a 20:00 hs libre. Uso EXCLUSIVO para huéspedes registrados. Las visitas no tienen permitido el uso de amenities según el Reglamento.
- Parrilla: Terraza piso 9, coordinar con Jorge por WhatsApp con anticipación.
- Normas del Edificio: Estrictamente prohibidas las fiestas, reuniones y ruidos molestos. Las visitas deben ser registradas previamente con el anfitrión.
- Caja de seguridad: Lockbox exterior en la puerta del edificio (no del departamento).
- Mascotas: No se permiten.
- Fumadores: Sólo en la terraza, nunca dentro del departamento.
- Bar/Minibar: Cava de vinos premium disponible. Malbec, Syrah, Torrontés, Champagne.
- Restaurantes cercanos: Zona repleta de opciones. Palermo Hollywood tiene gastronomía excelente.
- Movistar Arena: A 5 cuadras caminando.
- Supermercado: Día a 3 cuadras.
- Contacto del anfitrión: Jorge Orlando, por WhatsApp.

Si no sabés algo específico, recomendás contactar a Jorge directamente por WhatsApp.
Máximo 3 oraciones por respuesta. Sé concreto.`;

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

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const fullPrompt = `${SYSTEM_PROMPT}\n\nIdioma preferido del usuario: ${language === "en" ? "inglés" : "español"}\n\nPregunta del huésped: ${message}`;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("Gemini API error:", err);
    return NextResponse.json(
      { error: "Gemini error", fallback: true },
      { status: 200 }
    );
  }
}
