"use client";

import React, { useState, useEffect } from "react";
import { 
  Wifi, 
  Tv, 
  Coffee, 
  Wind, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  Clock, 
  AlertTriangle,
  Menu,
  X,
  Star,
  Flame,
  Wine,
  Users,
  UserCheck,
  ChevronDown
} from "lucide-react";
import Gallery from "../components/Gallery";
import CalendarWidget from "../components/CalendarWidget";
import InventoryList from "../components/InventoryList";
import NeighbourhoodMap from "../components/NeighbourhoodMap";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<"es" | "en">("es");
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "ai" | "user"; text: string }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Sync language selection with localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("language") as "es" | "en";
      if (savedLang === "es" || savedLang === "en") {
        setLanguage(savedLang);
      }
    }
  }, []);

  const handleLanguageChange = (newLang: "es" | "en") => {
    setLanguage(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLang);
    }
  };

  const t = {
    es: {
      navDept: "EL DEPARTAMENTO",
      navAmen: "AMENIDADES",
      navInve: "INVENTARIO",
      navBarr: "EL BARRIO",
      navNorm: "NORMAS",
      navFaq: "PREGUNTAS",
      btnReserve: "RESERVAR AHORA",
      tagNew: "A Estrenar",
      tagLocation: "Palermo Hollywood, CABA",
      tagArena: "A 5 min. del Movistar Arena",
      heroTitle: "Estadía de Diseño con Rooftop y Piscina en Av. Córdoba",
      heroDesc: "Un oasis urbano de diseño contemporáneo y confort absoluto en la zona más vibrante de Buenos Aires. Totalmente equipado y pensado para nómadas digitales y viajeros exigentes.",
      badgeAirbnb: "en Airbnb",
      badgeGuests: "huéspedes alojados",
      badgeVerified: "Anfitrión verificado (Superhost)",
      hostHeader: "Departamento entero · Anfitrión: Jorge Orlando",
      hostDetails: "2 a 4 huéspedes · 1 dormitorio · 1 cama Queen + 1 sofá cama · 1 baño completo · 1 toilette",
      whyTitle: "Por qué elegir Córdoba 5579",
      whyLocTitle: "Ubicación Privilegiada",
      whyLocText: "Situado en el corazón de Palermo Hollywood, rodeado de locales gastronómicos, bares de especialidad y transporte público. A solo 15 minutos a pie del Movistar Arena.",
      whyCheckTitle: "Check-In Autónomo",
      whyCheckText: "Ingresa a la propiedad de forma independiente mediante cerradura de combinación y caja de llaves. Flexibilidad total para tu llegada.",
      whyWineTitle: "Cava de Vinos Privada",
      whyWineText: "Disfruta de una selección premium de vinos Malbec, Syrah, Torrontés y Champagne en el bar con costo extra. Solo reportas tu consumo al finalizar.",
      whyHostTitle: "Anfitrión Superhost",
      whyHostText: "Atención atenta, rápida y hospitalaria. Jorge se compromete a garantizar una estadía de 5 estrellas y ayudarte en todo momento durante tu viaje.",
      aboutTitle: "Acerca de este alojamiento",
      aboutP1: "Bienvenidos al corazón de Palermo, el barrio más vibrante y dinámico de Buenos Aires. Este moderno departamento a estrenar ha sido diseñado meticulosamente combinando estilo contemporáneo y confort funcional para que te sientas como en casa, ya sea que viajes por ocio, relax o negocios.",
      aboutP2: "El espacio cuenta con un amplio living comedor con un Smart TV de 55 pulgadas, rincón bar de tragos y cristalería fina, y un dormitorio de relax con cama Queen de sábanas importadas de puro algodón egipcio de 600 hilos. La cocina se encuentra equipada con electrodomésticos de última generación (incluyendo freidora sin aceite/horno de convección, licuadora de vaso de vidrio, y cafetera con espumador de leche).",
      aboutP3: "Durante tu estadía, tendrás acceso completo a las espectaculares instalaciones del edificio: una relajante piscina exterior en la terraza con solárium y duchas, parrilla (sujeta a reserva) y sala de eventos con vistas panorámicas increíbles del horizonte de la ciudad.",
      amenitiesTitle: "Lo que ofrece este lugar",
      amenityWifi: "Wi-Fi de Alta Velocidad (100 Mbps)",
      amenityAc: "Aire Acondicionado Split (Frío/Calor)",
      amenityTv: "Smart TV 55\" (Living) + Smart TV 42\" (Habitación)",
      amenityKitchen: "Cocina completa con Cafetera de especialidad",
      amenityPool: "Piscina exterior, Solárium y Parrilla en terraza",
      amenitySecurity: "Seguridad por cámaras en espacios comunes y Caja fuerte",
      reviewsTitle: "Reseñas de Huéspedes",
      reviewsAvg: "promedio (82 reseñas)",
      review1Text: "\"El departamento es un sueño. Impecable, decorado con un gusto exquisito y súper funcional para trabajar remoto. La pileta y la vista del rooftop son espectaculares. ¡Volvería sin dudarlo!\"",
      review1Author: "María Alejandra G.",
      review1Date: "Marzo 2026 · Huésped Verificado",
      review2Text: "\"Jorge is an incredible host. The digital check-in guide was so clear, and the wine selection in the bar was a lovely touch. The location is perfect, close to everything in Palermo.\"",
      review2Author: "John S.",
      review2Date: "Febrero 2026 · Huésped Verificado",
      review3Text: "\"Ubicación insuperable para ir al Movistar Arena. Muy seguro el edificio, check-in autónomo súper rápido y las sábanas de algodón egipcio son de otro mundo. Sin dudas de los mejores lugares en Palermo.\"",
      review3Author: "Francisco R.",
      review3Date: "Enero 2026 · Huésped Verificado",
      guideTitle: "Guía Gastronómica del Anfitrión",
      guideSubtitle: "Palermo Hollywood está lleno de opciones, pero estas son las recomendaciones personales de Jorge para comer y trabajar como un local.",
      guideBreakfast: "Café y Desayuno",
      guideBreakfastSub: "Mis 5 favoritos a pie:",
      guideB1: "Cuervo Café (Fitz Roy y Paraguay) - El mejor espresso y pastelería a 3 min.",
      guideB2: "Atelier Fuerza - Famoso por su panadería de masa madre y facturas tradicionales.",
      guideB3: "La Kitchen - Exquisitos scons y tartas en un ambiente súper relajante.",
      guideB4: "Ninina (Holmberg) - Brunch muy completo y excelente pastelería artesanal.",
      guideB5: "Soria Café - Mesas al aire libre, ideal para un roll de canela matutino.",
      guideParrilla: "La Mejor Parrilla",
      guideParrillaSub: "Don Julio y alternativas:",
      guideP1: "Don Julio (Guatemala y Gurruchaga) - Elegida entre las mejores del mundo. Reservar con meses de anticipación.",
      guideP2: "La Cabrera - Excelente ojo de bife y sus famosas cazuelitas frías y calientes.",
      guideP3: "Las Cabras (Fitz Roy) - Más informal, porciones abundantes y excelente relación precio-calidad a 2 min.",
      guideP4: "Parrilla El Secretito - Un secreto de bodegón de barrio con porciones enormes.",
      guideWork: "Trabajo Remoto",
      guideWorkSub: "WiFi rápido y enchufes:",
      guideW1: "Café Registrado (Costa Rica) - Tuestan su propio café, tiene enchufes individuales y gran conexión.",
      guideW2: "Libros del Pasaje - Café literario hermoso para leer o trabajar en un patio interno.",
      guideW3: "Usina Cafetera - Mesas de trabajo cómodas, café de filtro y brunch.",
      guideW4: "Coffee Town - Rincón tranquilo con gran variedad de granos de especialidad.",
      rulesHeader: "Normas de Convivencia",
      rulesCheck: "Check-In: A partir de las 15:00 hs. / Check-Out: Hasta las 11:00 hs.",
      rulesSmoke: "Prohibido fumar dentro del departamento y en pasillos comunes.",
      rulesPets: "No se admiten mascotas de ningún tipo en el departamento.",
      rulesParties: "Prohibido realizar fiestas, eventos o ruidos molestos.",
      rulesGuests: "No se permite el acceso a invitados a la piscina o terraza del edificio.",
      rulesShower: "Obligatorio ducharse antes de ingresar a la piscina de la terraza.",
      faqHeader: "Preguntas Frecuentes (FAQ)",
      faq1Q: "¿A qué hora es el check-in y el check-out?",
      faq1A: "El check-in es a partir de las 15:00 hs y el check-out es hasta las 11:00 hs. Esto nos permite limpiar e higienizar a fondo el departamento entre reservas para garantizar una experiencia de descanso cinco estrellas.",
      faq2Q: "¿Cómo funciona el check-in autónomo?",
      faq2A: "Es muy sencillo. Antes de tu llegada te enviaremos el código de seguridad para retirar las llaves de una caja de seguridad (lockbox) en la entrada exterior del edificio. Podés consultar las fotos e instrucciones detalladas en /checkin.",
      faq3Q: "¿El departamento cuenta con cochera o estacionamiento?",
      faq3A: "No disponemos de cochera propia en el edificio, pero a solo unos metros sobre Av. Córdoba y Fitz Roy hay varios estacionamientos comerciales techados con tarifas por hora o estadía las 24 hs.",
      faq4Q: "¿Se admiten visitas adicionales o eventos?",
      faq4A: "Para preservar la tranquilidad de los vecinos, están prohibidas las fiestas y eventos ruidos molestos. Las visitas adicionales deben registrarse o comunicarse previamente con el anfitrión.",
      faq5Q: "¿Cómo se organiza el acceso a la piscina y la parrilla?",
      faq5A: "La piscina exterior de la terraza está disponible de 9:00 a 20:00 hs de manera libre. Para usar la parrilla de la terraza, te pedimos que la reserves con antelación enviándole un mensaje rápido por WhatsApp a Jorge.",
      bookingDirectTitle: "¿Por qué reservar directo?",
      bookingDirectText: "Reservando a través de nuestro sitio oficial vía WhatsApp ahorras hasta un 15% en tarifas de servicio e impuestos que cobran plataformas externas como Airbnb o Booking.com.",
      footerTitle: "Alquiler Temporal de Diseño · Palermo Hollywood, Buenos Aires",
      footerRights: "Todos los derechos reservados.",
      footerProject: "Un proyecto alojado dentro de",
      chatConcierge: "Preguntale al Concierge",
      chatSubtitle: "En línea · Respuesta instantánea",
      chatPlaceholder: "Escribe tu consulta...",
      chatSend: "Enviar",
      chatGreeting: "¡Hola! Soy tu Concierge Virtual de Córdoba 5579. ¿En qué te puedo ayudar hoy?"
    },
    en: {
      navDept: "THE APARTMENT",
      navAmen: "AMENITIES",
      navInve: "INVENTORY",
      navBarr: "THE NEIGHBORHOOD",
      navNorm: "RULES",
      navFaq: "FAQ",
      btnReserve: "BOOK NOW",
      tagNew: "Brand New",
      tagLocation: "Palermo Hollywood, BA",
      tagArena: "5 min from Movistar Arena",
      heroTitle: "Designer Apartment with Rooftop and Pool on Av. Córdoba",
      heroDesc: "An urban oasis of contemporary design and absolute comfort in the most vibrant area of Buenos Aires. Fully equipped and tailored for digital nomads and demanding travelers.",
      badgeAirbnb: "on Airbnb",
      badgeGuests: "guests hosted",
      badgeVerified: "Verified Host (Superhost)",
      hostHeader: "Entire Apartment · Host: Jorge Orlando",
      hostDetails: "2 to 4 guests · 1 bedroom · 1 Queen bed + 1 sofa bed · 1 full bathroom · 1 half bath",
      whyTitle: "Why Choose Cordoba 5579",
      whyLocTitle: "Prime Location",
      whyLocText: "Located in the heart of Palermo Hollywood, surrounded by restaurants, specialty coffee shops, and public transit. Only a 15-minute walk to the Movistar Arena.",
      whyCheckTitle: "Self-Check-In",
      whyCheckText: "Enter the property independently using a combination lockbox. Total check-in flexibility for your arrival.",
      whyWineTitle: "Private Wine Cellar",
      whyWineText: "Enjoy a premium selection of Malbec, Syrah, Torrontés, and Champagne at the bar for an extra fee. Just report your consumption at checkout.",
      whyHostTitle: "Superhost Support",
      whyHostText: "Attentive, fast, and hospitable support. Jorge is committed to ensuring a 5-star stay and assisting you throughout your trip.",
      aboutTitle: "About this accommodation",
      aboutP1: "Welcome to the heart of Palermo, the most vibrant and dynamic neighborhood in Buenos Aires. This brand-new designer apartment has been meticulously planned to combine contemporary style and functional comfort, making you feel right at home.",
      aboutP2: "The space features a spacious living room with a 55-inch Smart TV, a cocktail bar corner with fine glassware, and a relaxing bedroom with a Queen bed and imported 600-thread-count Egyptian cotton sheets. The kitchen is fully equipped with state-of-the-art appliances (including an air fryer, glass blender, and a coffee machine with a milk frother).",
      aboutP3: "During your stay, you will have full access to the building's spectacular rooftop amenities: a relaxing outdoor pool with a solarium and showers, a grill (subject to booking), and a lounge room with amazing panoramic views of the city skyline.",
      amenitiesTitle: "What this place offers",
      amenityWifi: "High-Speed Wi-Fi (100 Mbps)",
      amenityAc: "Split Air Conditioning (Cold/Heat)",
      amenityTv: "Smart TV 55\" (Living) + Smart TV 42\" (Bedroom)",
      amenityKitchen: "Full kitchen with Specialty Coffee Machine",
      amenityPool: "Outdoor Pool, Solarium and Rooftop Grill",
      amenitySecurity: "Security Cameras in common areas & Safety Box",
      reviewsTitle: "Guest Reviews",
      reviewsAvg: "average (82 reviews)",
      review1Text: "\"The apartment is a dream. Spotless, decorated with exquisite taste, and super functional for remote work. The pool and rooftop views are spectacular. I would return without hesitation!\"",
      review1Author: "María Alejandra G.",
      review1Date: "March 2026 · Verified Guest",
      review2Text: "\"Jorge is an incredible host. The digital check-in guide was so clear, and the wine selection in the bar was a lovely touch. The location is perfect, close to everything in Palermo.\"",
      review2Author: "John S.",
      review2Date: "February 2026 · Verified Guest",
      review3Text: "\"Unbeatable location for going to the Movistar Arena. The building is very secure, self-check-in was super fast, and the Egyptian cotton sheets are out of this world. Definitely one of the best places in Palermo.\"",
      review3Author: "Francisco R.",
      review3Date: "January 2026 · Verified Guest",
      guideTitle: "Host's Curated Food Guide",
      guideSubtitle: "Palermo Hollywood is filled with options, but these are Jorge's personal recommendations to eat and work like a local.",
      guideBreakfast: "Coffee & Breakfast",
      guideBreakfastSub: "My top 5 within walking distance:",
      guideB1: "Cuervo Café (Fitz Roy & Paraguay) - Best espresso and pastries, 3 min away.",
      guideB2: "Atelier Fuerza - Famous for sourdough bakery and traditional Argentine pastries.",
      guideB3: "La Kitchen - Delicious scones and tarts in a super relaxing backyard vibe.",
      guideB4: "Ninina (Holmberg) - Rich brunch options and excellent artisanal cakes.",
      guideB5: "Soria Café - Cozy outdoor seating, perfect for a morning cinnamon roll.",
      guideParrilla: "The Best Steakhouse",
      guideParrillaSub: "Don Julio & local alternatives:",
      guideP1: "Don Julio (Guatemala & Gurruchaga) - Voted among the best in the world. Book months in advance.",
      guideP2: "La Cabrera - Excellent ribeye steak and their famous complimentary side dishes.",
      guideP3: "Las Cabras (Fitz Roy) - More informal, huge portions, and great value, 2 min away.",
      guideP4: "Parrilla El Secretito - A hidden neighborhood steakhouse with massive portions.",
      guideWork: "Remote Work Cafe",
      guideWorkSub: "Fast WiFi & outlets:",
      guideW1: "Café Registrado (Costa Rica) - Coffee roasters, individual outlets, and great connection.",
      guideW2: "Libros del Pasaje - Beautiful bookshop café to read or work in a covered patio.",
      guideW3: "Usina Cafetera - Comfortable work tables, drip coffee, and great brunch.",
      guideW4: "Coffee Town - Quiet spot with a wide variety of specialty coffee beans.",
      rulesHeader: "House Rules",
      rulesCheck: "Check-In: From 3:00 PM onwards / Check-Out: By 11:00 AM.",
      rulesSmoke: "No smoking inside the apartment or in building common areas.",
      rulesInt: "No pets of any kind are allowed in the apartment.",
      rulesParties: "No parties, events, or loud noises are allowed.",
      rulesGuests: "Unregistered visitors are not allowed to use the pool or rooftop.",
      rulesShower: "Showering before entering the rooftop pool is mandatory.",
      faqHeader: "Frequently Asked Questions (FAQ)",
      faq1Q: "What time is check-in and check-out?",
      faq1A: "Check-in starts at 3:00 PM and check-out is by 11:00 AM. This gives us enough time to thoroughly clean and sanitize the apartment to ensure a five-star experience.",
      faq2Q: "How does the self-check-in work?",
      faq2A: "It's simple. Before arrival, we will send you the security code to retrieve the keys from a lockbox located at the building's outer entrance. You can find detailed steps and photos in the check-in portal at /checkin.",
      faq3Q: "Does the apartment have a parking space?",
      faq3A: "We do not have a private parking space in the building, but there are several 24/7 commercial parking garages just a few meters away on Av. Cordoba and Fitz Roy.",
      faq4Q: "Are additional visitors or events allowed?",
      faq4A: "To preserve neighbors' quiet rest, parties and loud events are strictly prohibited. Extra visitors must be registered or authorized in advance by the host.",
      faq5Q: "How do I coordinate rooftop pool and grill access?",
      faq5A: "The rooftop pool is free to use from 9:00 AM to 8:00 PM. To use the grill (9th floor rooftop), please send a quick WhatsApp message to Jorge in advance to reserve the space.",
      bookingDirectTitle: "Why book direct?",
      bookingDirectText: "Booking directly through our official WhatsApp saves you up to 15% in platform service fees and taxes charged by sites like Airbnb or Booking.com.",
      footerTitle: "Designer Vacation Rental · Palermo Hollywood, Buenos Aires",
      footerRights: "All rights reserved.",
      footerProject: "A project hosted inside",
      chatConcierge: "Ask the Concierge",
      chatSubtitle: "Online · Instant reply",
      chatPlaceholder: "Type your question...",
      chatSend: "Send",
      chatGreeting: "Hi! I am your Cordoba 5579 Virtual Concierge. How can I help you today?"
    }
  }[language];

  // Initialize greeting message based on language preference
  useEffect(() => {
    setMessages([
      { sender: "ai", text: language === "es" ? "¡Hola! Soy tu Concierge Virtual de Córdoba 5579. ¿En qué te puedo ayudar hoy?" : "Hi! I am your Cordoba 5579 Virtual Concierge. How can I help you today?" }
    ]);
  }, [language]);

  const getConciergeResponse = (query: string): string => {
    const q = query.toLowerCase();
    const isEn = language === "en";

    if (q.includes("desayun") || q.includes("desayuno") || q.includes("cafe") || q.includes("café") || q.includes("comer") || q.includes("gastronom") || q.includes("breakfast") || q.includes("eat") || q.includes("food") || q.includes("restaurant")) {
      return isEn
        ? "For breakfast, I highly recommend 'Cuervo Café' (at Fitz Roy & Paraguay, just 3 blocks away). They have amazing specialty coffee and sourdough pastries. For a sweet afternoon treat, 'La Kitchen' is another local gem."
        : "Para desayunar te súper recomiendo 'Cuervo Café' (en Fitz Roy y Paraguay, a solo 3 cuadras). Tienen café de especialidad increíble y medialunas de masa madre. Si querés algo dulce para la tarde, 'La Kitchen' es otra joya local.";
    }
    if (q.includes("ezeiza") || q.includes("aeropuerto") || q.includes("llegar") || q.includes("aeroparque") || q.includes("airport") || q.includes("tax") || q.includes("uber") || q.includes("cabify")) {
      return isEn
        ? "To go to Ezeiza Airport, you can take an official taxi or use Uber/Cabify (takes 45-60 min depending on traffic). Alternatively, you can book a Tienda León bus from Retiro. For Aeroparque Airport, a taxi takes just 15 minutes."
        : "Para ir a Ezeiza podés tomar un taxi oficial o Uber/Cabify (tarda unos 45-60 min dependiendo del tráfico). Como alternativa económica, podés tomar el bus Tienda León desde Retiro. Para Aeroparque, un taxi te lleva en 15 minutos.";
    }
    if (q.includes("sube") || q.includes("tarjeta") || q.includes("colectivo") || q.includes("transporte") || q.includes("subway") || q.includes("bus") || q.includes("metro")) {
      return isEn
        ? "You can purchase and charge a SUBE transit card at the Open 25 Kiosk (Av. Cordoba & Fitz Roy, just around the corner) or at the Palermo Subway Station ticket counter (Line D, Av. Santa Fe & Juan B. Justo)."
        : "Podés comprar y cargar la tarjeta SUBE en el Kiosco Open 25 (en Av. Córdoba y Fitz Roy, a la vuelta del depto) o en la boletería de la estación Palermo de la Línea D de subte (Av. Santa Fe y Juan B. Justo).";
    }
    if (q.includes("parrilla") || q.includes("terraza") || q.includes("rooftop") || q.includes("piscina") || q.includes("pileta") || q.includes("pool") || q.includes("grill") || q.includes("bbq")) {
      return isEn
        ? "The pool and grill are on the building's rooftop (9th floor). To use the grill, please coordinate with Jorge via WhatsApp in advance to book your slot. The pool is open freely to guests from 9:00 AM to 8:00 PM."
        : "La parrilla y la piscina están en el rooftop del edificio (piso 9). Para usar la parrilla, recordá avisarle a Jorge por WhatsApp con anticipación para reservarla. La pileta está disponible para huéspedes de 9:00 a 20:00 hs.";
    }
    if (q.includes("wifi") || q.includes("wi-fi") || q.includes("internet") || q.includes("clave") || q.includes("contraseña") || q.includes("password") || q.includes("network")) {
      return isEn
        ? "The apartment features high-speed Wi-Fi (100 Mbps). The network name is 'Cordoba5579_5G' and the password is 'hola.cordoba'. You can also scan the QR code located on the framed signs inside the property."
        : "El departamento cuenta con WiFi de alta velocidad (100 Mbps). La red es 'Cordoba5579_5G' y la contraseña es 'hola.cordoba'. Encontrarás un código QR y las credenciales en los carteles físicos enmarcados dentro de la propiedad.";
    }
    if (q.includes("check-in") || q.includes("checkin") || q.includes("ingres") || q.includes("llave") || q.includes("entrar") || q.includes("lockbox") || q.includes("code") || q.includes("codigo") || q.includes("código")) {
      return isEn
        ? "Self-check-in is available starting at 3:00 PM. Keys are fetched from a secure lockbox at the building's outer entrance. You can find step-by-step instructions, outer gate magnetic tag guides, and photos in the portal at /checkin."
        : "El check-in es autónomo a partir de las 15:00 hs. Las llaves se retiran de una caja de seguridad (lockbox) en la entrada exterior del edificio. Podés ver el manual paso a paso, fotos y cómo usar el llavero magnético en /checkin.";
    }
    if (q.includes("check-out") || q.includes("checkout") || q.includes("salida") || q.includes("llaves") || q.includes("leave")) {
      return isEn
        ? "Check-out time is by 11:00 AM. Please turn off all air conditioners and lights, return the keys to the same security lockbox at the outer entrance (scrambling the code wheels), and send a WhatsApp message to Jorge."
        : "El check-out es hasta las 11:00 hs. Te pedimos que apagues los aires acondicionados, dejes las llaves en la misma caja de seguridad (lockbox) de la entrada exterior y le avises a Jorge por WhatsApp cuando te retires.";
    }
    if (q.includes("cava") || q.includes("vino") || q.includes("bar") || q.includes("bebida") || q.includes("wine") || q.includes("drink")) {
      return isEn
        ? "The apartment offers a private selection of premium wines (Malbec, Syrah, Torrontés) and Champagne at the bar for an extra cost. Simply enjoy them and report your consumption to Jorge at checkout. Prices are listed at the bar."
        : "El depto tiene una cava de vinos premium (Malbec, Syrah, Torrontés) y Champagne. Podés consumirlos libremente y simplemente le reportás tu consumo a Jorge al finalizar tu estadía. Los precios están detallados en el bar.";
    }
    return isEn
      ? "Good question! I don't have that specific answer in my quick local guide. You can ask Jorge directly by clicking 'Book via WhatsApp' and he will respond right away!"
      : "¡Buena pregunta! No tengo esa respuesta exacta registrada en mi guía rápida, pero podés consultarle directamente a Jorge haciendo clic en 'Reservar por WhatsApp'. ¡Te responderá enseguida!";
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { sender: "user", text }]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response typing delay
    setTimeout(() => {
      const response = getConciergeResponse(text);
      setMessages(prev => [...prev, { sender: "ai", text: response }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleFaqToggle = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Optional: Replace this with your public Google Sheets CSV URL when ready
  const googleSheetInventoryUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlUx7LNTseRM1DhoYGmw-9ZfuWpobnDFF5pLt4AuIdMiLLVEqVN_54OTZm0YbMUTp3-iHsk6Dbx4YP/pub?output=csv"; 
  
  // Optional: Replace this with your public Google Sheets CSV URL for map points
  const googleSheetPlacesUrl = ""; 

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-neutral-800 bg-[#FAF9F7]">
      {/* Translucent Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#FAF9F7]/80 border-b border-[#EFEBE4] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="#" className="font-serif text-lg md:text-xl font-bold tracking-widest text-neutral-900">
                CÓRDOBA 5579
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-xs font-semibold tracking-wider text-neutral-600">
              <a href="#detalles" className="hover:text-neutral-900 transition-colors">{t.navDept}</a>
              <a href="#amenidades" className="hover:text-neutral-900 transition-colors">{t.navAmen}</a>
              <a href="#resenas" className="hover:text-neutral-900 transition-colors">{t.reviewsTitle.toUpperCase()}</a>
              <a href="#inventario" className="hover:text-neutral-900 transition-colors">{t.navInve}</a>
              <a href="#barrio" className="hover:text-neutral-900 transition-colors">{t.navBarr}</a>
              <a href="#reglas" className="hover:text-neutral-900 transition-colors">{t.navNorm}</a>
              <a href="#faq" className="hover:text-neutral-900 transition-colors">{t.navFaq}</a>
            </div>

            {/* Language Switcher and CTA Button */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center bg-neutral-200/50 rounded-lg p-0.5 border border-[#EFEBE4] text-[10px] font-bold">
                <button
                  onClick={() => handleLanguageChange("es")}
                  className={`px-2 py-0.5 rounded transition-all ${language === "es" ? "bg-white text-[#5F6F52] shadow-sm" : "text-neutral-500 hover:text-neutral-900"}`}
                >
                  ES
                </button>
                <button
                  onClick={() => handleLanguageChange("en")}
                  className={`px-2 py-0.5 rounded transition-all ${language === "en" ? "bg-white text-[#5F6F52] shadow-sm" : "text-neutral-500 hover:text-neutral-900"}`}
                >
                  EN
                </button>
              </div>

              <a 
                href="#reserva" 
                className="bg-[#5F6F52] hover:bg-[#4F5D43] text-white text-xs font-semibold tracking-wider px-5 py-3 rounded-xl transition-all shadow-sm shadow-neutral-100"
              >
                {t.btnReserve}
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
              {/* Language switcher for mobile */}
              <div className="flex items-center bg-neutral-200/50 rounded-lg p-0.5 border border-[#EFEBE4] text-[10px] font-bold">
                <button
                  onClick={() => handleLanguageChange("es")}
                  className={`px-2 py-0.5 rounded transition-all ${language === "es" ? "bg-white text-[#5F6F52] shadow-sm" : "text-neutral-500"}`}
                >
                  ES
                </button>
                <button
                  onClick={() => handleLanguageChange("en")}
                  className={`px-2 py-0.5 rounded transition-all ${language === "en" ? "bg-white text-[#5F6F52] shadow-sm" : "text-neutral-500"}`}
                >
                  EN
                </button>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-neutral-600 hover:text-neutral-955 p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF9F7] border-b border-[#EFEBE4] px-4 pt-2 pb-6 space-y-4 text-sm font-medium">
            <a 
              href="#detalles" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-600 hover:text-neutral-900"
            >
              {t.navDept}
            </a>
            <a 
              href="#amenidades" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-600 hover:text-neutral-900"
            >
              {t.navAmen}
            </a>
            <a 
              href="#resenas" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-600 hover:text-neutral-900"
            >
              {t.reviewsTitle}
            </a>
            <a 
              href="#inventario" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-600 hover:text-neutral-900"
            >
              {t.navInve}
            </a>
            <a 
              href="#barrio" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-600 hover:text-neutral-900"
            >
              {t.navBarr}
            </a>
            <a 
              href="#reglas" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-600 hover:text-neutral-900"
            >
              {t.navNorm}
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-600 hover:text-neutral-900"
            >
              {t.navFaq}
            </a>
            <a
              href="#reserva"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center bg-[#5F6F52] text-white py-3 rounded-xl font-semibold"
            >
              {t.btnReserve}
            </a>
          </div>
        )}
      </nav>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-12">
        
        {/* Header Title Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#5F6F52]">
            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{t.tagNew}</span>
            </span>
            <span>·</span>
            <span>{t.tagLocation}</span>
            <span>·</span>
            <span>{t.tagArena}</span>
          </div>
          
          <h1 className="font-serif text-3xl md:text-4.5xl text-neutral-955 font-bold tracking-tight leading-tight">
            {t.heroTitle}
          </h1>
          
          <p className="text-neutral-500 text-sm md:text-base max-w-3xl">
            {t.heroDesc}
          </p>

          {/* Trust Badges Row */}
          <div className="flex flex-wrap gap-3 pt-1 text-xs font-semibold text-neutral-700">
            <div className="flex items-center gap-2 bg-white border border-[#EFEBE4] px-4 py-2.5 rounded-2xl shadow-sm">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span><strong>4.9⭐</strong> {t.badgeAirbnb}</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-[#EFEBE4] px-4 py-2.5 rounded-2xl shadow-sm">
              <Users className="w-4 h-4 text-[#5F6F52]" />
              <span><strong>120+</strong> {t.badgeGuests}</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-[#EFEBE4] px-4 py-2.5 rounded-2xl shadow-sm">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <span>{t.badgeVerified}</span>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <section>
          <Gallery />
        </section>

        {/* 2-Column Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start" id="detalles">
          
          {/* Left Column: Description & Info (8/12 width) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Overview / Host Details */}
            <div className="border-b border-[#EFEBE4] pb-6 flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="font-serif text-xl md:text-2xl text-neutral-900 font-semibold">
                  {t.hostHeader}
                </h2>
                <p className="text-neutral-500 text-sm">
                  {t.hostDetails}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#5F6F52] text-white flex items-center justify-center rounded-full text-base font-bold font-serif shadow-sm flex-shrink-0">
                JO
              </div>
            </div>

            {/* Highlights Section ("Por qué elegirnos") */}
            <div className="space-y-6 border-b border-[#EFEBE4] pb-8">
              <h3 className="font-serif text-xl md:text-2xl text-neutral-900 font-semibold">{t.whyTitle}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-neutral-100 rounded-2xl flex-shrink-0 h-fit">
                    <Compass className="w-5 h-5 text-neutral-700" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-neutral-900">{t.whyLocTitle}</h4>
                    <p className="text-neutral-500 text-xs leading-relaxed">
                      {t.whyLocText}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-neutral-100 rounded-2xl flex-shrink-0 h-fit">
                    <Clock className="w-5 h-5 text-neutral-700" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-neutral-900">{t.whyCheckTitle}</h4>
                    <p className="text-neutral-500 text-xs leading-relaxed">
                      {t.whyCheckText}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-neutral-100 rounded-2xl flex-shrink-0 h-fit">
                    <Wine className="w-5 h-5 text-[#5F6F52]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-neutral-900">{t.whyWineTitle}</h4>
                    <p className="text-neutral-500 text-xs leading-relaxed">
                      {t.whyWineText}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-emerald-50 rounded-2xl flex-shrink-0 h-fit">
                    <UserCheck className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-neutral-900">{t.whyHostTitle}</h4>
                    <p className="text-neutral-500 text-xs leading-relaxed">
                      {t.whyHostText}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Copy */}
            <div className="space-y-4 border-b border-[#EFEBE4] pb-8">
              <h3 className="font-serif text-xl md:text-2xl text-neutral-900 font-semibold">{t.aboutTitle}</h3>
              <div className="text-neutral-600 text-sm leading-relaxed space-y-4 font-sans">
                <p>{t.aboutP1}</p>
                <p>{t.aboutP2}</p>
                <p>{t.aboutP3}</p>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-6 border-b border-[#EFEBE4] pb-8" id="amenidades">
              <h3 className="font-serif text-xl md:text-2xl text-neutral-900 font-semibold">{t.amenitiesTitle}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm text-neutral-700">
                  <Wifi className="w-5 h-5 text-neutral-500" />
                  <span>{t.amenityWifi}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-700">
                  <Wind className="w-5 h-5 text-neutral-500" />
                  <span>{t.amenityAc}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-700">
                  <Tv className="w-5 h-5 text-neutral-500" />
                  <span>{t.amenityTv}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-700">
                  <Coffee className="w-5 h-5 text-neutral-500" />
                  <span>{t.amenityKitchen}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-700">
                  <Flame className="w-5 h-5 text-neutral-500" />
                  <span>{t.amenityPool}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-700">
                  <ShieldCheck className="w-5 h-5 text-[#5F6F52]" />
                  <span>{t.amenitySecurity}</span>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6 border-b border-[#EFEBE4] pb-8" id="resenas">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl md:text-2xl text-neutral-900 font-semibold">{t.reviewsTitle}</h3>
                <span className="text-xs text-neutral-500 font-semibold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span><strong>4.9⭐</strong> {t.reviewsAvg}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Review 1 */}
                <div className="bg-white border border-[#EFEBE4] rounded-2xl p-5 shadow-sm space-y-3.5 flex flex-col justify-between transition-all hover:shadow-md duration-200">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-500" />
                      ))}
                    </div>
                    <p className="text-neutral-600 text-xs leading-relaxed italic">
                      {t.review1Text}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-2.5 border-t border-neutral-100 mt-2">
                    <div className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-xs text-neutral-700">
                      MA
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-neutral-900">{t.review1Author}</h5>
                      <p className="text-[10px] text-neutral-400">{t.review1Date}</p>
                    </div>
                  </div>
                </div>

                {/* Review 2 */}
                <div className="bg-white border border-[#EFEBE4] rounded-2xl p-5 shadow-sm space-y-3.5 flex flex-col justify-between transition-all hover:shadow-md duration-200">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-500" />
                      ))}
                    </div>
                    <p className="text-neutral-600 text-xs leading-relaxed italic">
                      {t.review2Text}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-2.5 border-t border-neutral-100 mt-2">
                    <div className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-xs text-neutral-700">
                      JS
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-neutral-900">{t.review2Author}</h5>
                      <p className="text-[10px] text-neutral-400">{t.review2Date}</p>
                    </div>
                  </div>
                </div>

                {/* Review 3 */}
                <div className="bg-white border border-[#EFEBE4] rounded-2xl p-5 shadow-sm space-y-3.5 flex flex-col justify-between transition-all hover:shadow-md duration-200">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-500" />
                      ))}
                    </div>
                    <p className="text-neutral-600 text-xs leading-relaxed italic">
                      {t.review3Text}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-2.5 border-t border-neutral-100 mt-2">
                    <div className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-xs text-neutral-700">
                      FR
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-neutral-900">{t.review3Author}</h5>
                      <p className="text-[10px] text-neutral-400">{t.review3Date}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Inventory Section */}
            <div id="inventario">
              <InventoryList sheetUrl={googleSheetInventoryUrl} lang={language} />
            </div>

            {/* Neighbourhood Map Section */}
            <div id="barrio" className="space-y-6">
              <NeighbourhoodMap sheetUrl={googleSheetPlacesUrl} />
              
              {/* Guía Gastronómica Curada */}
              <div className="bg-white border border-[#EFEBE4] rounded-3xl p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="font-serif text-xl md:text-2xl text-neutral-900 font-semibold flex items-center gap-2">
                    <span>🍳 {t.guideTitle}</span>
                  </h3>
                  <p className="text-neutral-500 text-sm mt-1">
                    {t.guideSubtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Breakfast/Brunch */}
                  <div className="bg-[#FAF9F7] border border-[#EFEBE4] rounded-2xl p-5 space-y-3 flex flex-col">
                    <div className="flex items-center gap-2 text-[#5F6F52] pb-2 border-b border-[#EFEBE4]/60">
                      <span className="text-lg">☕</span>
                      <h4 className="font-bold text-sm text-neutral-900">{t.guideBreakfast}</h4>
                    </div>
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mt-1">{t.guideBreakfastSub}</p>
                    <ul className="text-xs text-neutral-600 space-y-2 list-disc list-inside flex-grow">
                      <li>{t.guideB1}</li>
                      <li>{t.guideB2}</li>
                      <li>{t.guideB3}</li>
                      <li>{t.guideB4}</li>
                      <li>{t.guideB5}</li>
                    </ul>
                  </div>

                  {/* Best Parrilla */}
                  <div className="bg-[#FAF9F7] border border-[#EFEBE4] rounded-2xl p-5 space-y-3 flex flex-col">
                    <div className="flex items-center gap-2 text-[#5F6F52] pb-2 border-b border-[#EFEBE4]/60">
                      <span className="text-lg">🥩</span>
                      <h4 className="font-bold text-sm text-neutral-900">{t.guideParrilla}</h4>
                    </div>
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mt-1">{t.guideParrillaSub}</p>
                    <ul className="text-xs text-neutral-600 space-y-2 list-disc list-inside flex-grow">
                      <li>{t.guideP1}</li>
                      <li>{t.guideP2}</li>
                      <li>{t.guideP3}</li>
                      <li>{t.guideP4}</li>
                    </ul>
                  </div>

                  {/* Remote Work Cafe */}
                  <div className="bg-[#FAF9F7] border border-[#EFEBE4] rounded-2xl p-5 space-y-3 flex flex-col">
                    <div className="flex items-center gap-2 text-[#5F6F52] pb-2 border-b border-[#EFEBE4]/60">
                      <span className="text-lg">💻</span>
                      <h4 className="font-bold text-sm text-neutral-900">{t.guideWork}</h4>
                    </div>
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mt-1">{t.guideWorkSub}</p>
                    <ul className="text-xs text-neutral-600 space-y-2 list-disc list-inside flex-grow">
                      <li>{t.guideW1}</li>
                      <li>{t.guideW2}</li>
                      <li>{t.guideW3}</li>
                      <li>{t.guideW4}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* House Rules / Norms */}
            <div className="space-y-6 bg-amber-50/15 border border-[#EFEBE4] rounded-3xl p-6 md:p-8" id="reglas">
              <h3 className="font-serif text-xl md:text-2xl text-neutral-900 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>{t.rulesHeader}</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs md:text-sm text-neutral-600 font-sans">
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#5F6F52] rounded-full mt-2 flex-shrink-0" />
                  <p>{t.rulesCheck}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#5F6F52] rounded-full mt-2 flex-shrink-0" />
                  <p>{t.rulesSmoke}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#5F6F52] rounded-full mt-2 flex-shrink-0" />
                  <p>{t.rulesInt}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#5F6F52] rounded-full mt-2 flex-shrink-0" />
                  <p>{t.rulesParties}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#5F6F52] rounded-full mt-2 flex-shrink-0" />
                  <p>{t.rulesGuests}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#5F6F52] rounded-full mt-2 flex-shrink-0" />
                  <p>{t.rulesShower}</p>
                </div>
              </div>
            </div>

            {/* Accordion FAQ Section */}
            <div className="space-y-6 bg-white border border-[#EFEBE4] rounded-3xl p-6 md:p-8" id="faq">
              <h3 className="font-serif text-xl md:text-2xl text-neutral-900 font-semibold">
                {t.faqHeader}
              </h3>
              
              <div className="divide-y divide-[#EFEBE4] border-t border-b border-[#EFEBE4] font-sans">
                {[
                  { q: t.faq1Q, a: t.faq1A },
                  { q: t.faq2Q, a: t.faq2A },
                  { q: t.faq3Q, a: t.faq3A },
                  { q: t.faq4Q, a: t.faq4A },
                  { q: t.faq5Q, a: t.faq5A }
                ].map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="py-4">
                      <button
                        onClick={() => handleFaqToggle(idx)}
                        className="w-full flex items-center justify-between text-left gap-4 group"
                      >
                        <span className="font-semibold text-xs sm:text-sm text-neutral-800 group-hover:text-neutral-950 transition-colors">
                          {item.q}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-all duration-300 flex-shrink-0 ${
                          isOpen ? "transform rotate-180 text-[#5F6F52]" : ""
                        }`} />
                      </button>
                      
                      {isOpen && (
                        <p className="text-xs text-neutral-500 mt-2.5 leading-relaxed pl-1 animate-fadeIn">
                          {item.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Booking Widget (4/12 width) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6" id="reserva">
            <CalendarWidget lang={language} />
            
            {/* Direct Booking Saving Card */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-5 text-xs text-emerald-800 space-y-2 font-sans">
              <p className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>{t.bookingDirectTitle}</span>
              </p>
              <p className="leading-relaxed">
                {t.bookingDirectText}
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-950 text-white mt-16 py-12 border-t border-neutral-900 font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-1">
            <h4 className="font-serif text-base font-bold tracking-widest">CÓRDOBA 5579</h4>
            <p className="text-neutral-500 text-xs">{t.footerTitle}</p>
          </div>
          
          <div className="text-xs text-neutral-500 text-center md:text-right space-y-1.5">
            <p>© {new Date().getFullYear()} Córdoba 5579. {t.footerRights}</p>
            <p>
              {t.footerProject}{" "}
              <a href="https://www.alexismartyniuk.com.ar" className="text-neutral-400 hover:text-white transition-colors underline underline-offset-2">
                alexismartyniuk.com.ar
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* AI Concierge Chatbot Widget */}
      <div className="fixed bottom-6 right-6 z-50 font-sans">
        {/* Chat Toggle Button */}
        <button
          onClick={() => setConciergeOpen(!conciergeOpen)}
          className="bg-[#5F6F52] hover:bg-[#4F5D43] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group active:scale-95"
        >
          <span className="text-xl">🤖</span>
          <span className="text-xs font-bold tracking-wider max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap">
            {t.chatConcierge}
          </span>
        </button>

        {/* Chat Window Panel */}
        {conciergeOpen && (
          <div className="absolute bottom-16 right-0 w-[330px] sm:w-[380px] h-[450px] bg-white border border-[#EFEBE4] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="bg-[#5F6F52] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🤖</span>
                <div>
                  <h4 className="font-serif font-bold text-sm">Concierge IA</h4>
                  <p className="text-[10px] text-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                    <span>{t.chatSubtitle}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setConciergeOpen(false)}
                className="text-white/80 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-[#FAF9F7]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                    msg.sender === "user" 
                      ? "bg-[#5F6F52] text-white rounded-tr-none" 
                      : "bg-white text-neutral-800 border border-[#EFEBE4] rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#EFEBE4] rounded-2xl rounded-tl-none p-3 text-xs text-neutral-400 flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}
            </div>

            {/* Predefined FAQs */}
            <div className="p-3 bg-white border-t border-b border-[#EFEBE4] flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto">
              <button 
                onClick={() => handleSendMessage(language === "es" ? "¿Dónde desayunar cerca?" : "Where to eat breakfast nearby?")}
                className="text-[10px] bg-[#FAF9F7] hover:bg-[#EFEBE4] text-neutral-600 border border-[#EFEBE4] px-2 py-1 rounded-full transition-all"
              >
                ☕ {language === "es" ? "Desayunar cerca" : "Breakfast nearby"}
              </button>
              <button 
                onClick={() => handleSendMessage(language === "es" ? "¿Cómo llegar a Ezeiza?" : "How to get to Ezeiza airport?")}
                className="text-[10px] bg-[#FAF9F7] hover:bg-[#EFEBE4] text-neutral-600 border border-[#EFEBE4] px-2 py-1 rounded-full transition-all"
              >
                ✈️ {language === "es" ? "Llegar a Ezeiza" : "Get to Ezeiza"}
              </button>
              <button 
                onClick={() => handleSendMessage(language === "es" ? "¿Dónde comprar una SUBE?" : "Where to buy a SUBE card?")}
                className="text-[10px] bg-[#FAF9F7] hover:bg-[#EFEBE4] text-neutral-600 border border-[#EFEBE4] px-2 py-1 rounded-full transition-all"
              >
                💳 {language === "es" ? "Comprar SUBE" : "Buy SUBE"}
              </button>
              <button 
                onClick={() => handleSendMessage(language === "es" ? "¿Cómo usar la parrilla?" : "How to use the grill?")}
                className="text-[10px] bg-[#FAF9F7] hover:bg-[#EFEBE4] text-neutral-600 border border-[#EFEBE4] px-2 py-1 rounded-full transition-all"
              >
                🥩 {language === "es" ? "Usar parrilla" : "Use grill"}
              </button>
              <button 
                onClick={() => handleSendMessage(language === "es" ? "¿Cuál es la contraseña del WiFi?" : "What is the WiFi password?")}
                className="text-[10px] bg-[#FAF9F7] hover:bg-[#EFEBE4] text-neutral-600 border border-[#EFEBE4] px-2 py-1 rounded-full transition-all"
              >
                📶 {language === "es" ? "Clave WiFi" : "WiFi Password"}
              </button>
            </div>

            {/* Custom Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-3 bg-white flex gap-2"
            >
              <input
                type="text"
                placeholder={t.chatPlaceholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow bg-[#FAF9F7] border border-[#EFEBE4] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
              />
              <button
                type="submit"
                className="bg-[#5F6F52] hover:bg-[#4F5D43] text-white px-3 py-2 rounded-xl text-xs font-bold transition-all"
              >
                {t.chatSend}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
