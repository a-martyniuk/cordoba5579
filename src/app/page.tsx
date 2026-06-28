"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  Sparkles, 
  Compass, 
  Clock, 
  AlertTriangle,
  Menu,
  X,
  Star,
  Wine,
  Users,
  UserCheck,
  ChevronDown,
  ExternalLink,
  ClipboardList,
  AlertCircle,
  MessageCircle
} from "lucide-react";
import Link from "next/link";
import Gallery from "../components/Gallery";
import CalendarWidget from "../components/CalendarWidget";
import NeighbourhoodMap from "../components/NeighbourhoodMap";
import InstallPrompt from "../components/InstallPrompt";
import { cordoba5579Knowledge } from "../data/conciergeKnowledge";
import airbnbDetails from "../data/airbnb-details.json";

// ─── Scroll Reveal Wrapper ──────────────────────────────────────────────────
function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface FoodPlace {
  name: string;
  rating: string;
  reviews: string;
  address: string;
  mapsUrl: string;
  hours: string;
  tipEs: string;
  tipEn: string;
}

interface FoodCategory {
  titleEs: string;
  titleEn: string;
  icon: string;
  subtitleEs: string;
  subtitleEn: string;
  items: FoodPlace[];
}

const foodGuideData: FoodCategory[] = [
  {
    titleEs: "Café de Especialidad y Brunch",
    titleEn: "Specialty Coffee & Brunch",
    icon: "☕",
    subtitleEs: "Favoritos a pie:",
    subtitleEn: "Favorites within walking distance:",
    items: [
      {
        name: "Cuervo Café",
        rating: "4.5",
        reviews: "1.6k+",
        address: "Costa Rica 5801",
        mapsUrl: "https://maps.google.com/?q=Cuervo+Cafe+Costa+Rica+5801",
        hours: "Todos los días 08:00 - 20:00",
        tipEs: "El mejor espresso de Palermo y medialunas de masa madre excelentes. A 3 min.",
        tipEn: "Best espresso in Palermo and excellent sourdough medialunas. 3 min away."
      },
      {
        name: "Vive Café",
        rating: "4.6",
        reviews: "1.3k+",
        address: "Costa Rica 5722",
        mapsUrl: "https://maps.google.com/?q=Vive+Cafe+Costa+Rica+5722",
        hours: "Mar a Dom 09:00 - 20:00",
        tipEs: "Auténtico café colombiano de especialidad y deliciosas almojábanas calientes.",
        tipEn: "Authentic specialty Colombian coffee and delicious warm almojábanas."
      },
      {
        name: "Café Registrado",
        rating: "4.4",
        reviews: "1.9k+",
        address: "Costa Rica 5901",
        mapsUrl: "https://maps.google.com/?q=Cafe+Registrado+Costa+Rica+5901",
        hours: "Todos los días 08:00 - 21:00",
        tipEs: "Tuestan sus propios granos. Ideal para trabajar remoto (buen WiFi y enchufes).",
        tipEn: "They roast their own beans. Great for remote work (good WiFi and outlets)."
      },
      {
        name: "Atelier Fuerza F5",
        rating: "4.2",
        reviews: "900+",
        address: "Honduras 5650",
        mapsUrl: "https://maps.google.com/?q=Atelier+Fuerza+F5+Honduras+5650",
        hours: "Todos los días 08:00 - 19:00",
        tipEs: "Panadería orgánica y facturas de manteca gigantes e increíbles.",
        tipEn: "Organic sourdough bakery and giant, incredible butter medialunas."
      }
    ]
  },
  {
    titleEs: "Parrillas y Bodegones",
    titleEn: "Steakhouses & Bodegons",
    icon: "🥩",
    subtitleEs: "La tradición local:",
    subtitleEn: "Local tradition:",
    items: [
      {
        name: "Don Julio Parrilla",
        rating: "4.6",
        reviews: "23k+",
        address: "Guatemala 4699",
        mapsUrl: "https://maps.google.com/?q=Don+Julio+Parrilla+Guatemala+4699",
        hours: "Todos los días 11:30 - 16:00, 19:00 - 01:00",
        tipEs: "Elegida entre las mejores parrillas del mundo. Reservar con meses de anticipación.",
        tipEn: "Ranked among the best steakhouses in the world. Book months in advance."
      },
      {
        name: "La Cabrera",
        rating: "4.4",
        reviews: "15k+",
        address: "José A. Cabrera 5127",
        mapsUrl: "https://maps.google.com/?q=La+Cabrera+Cabrera+5127",
        hours: "Todos los días 12:00 - 16:00, 18:30 - 23:30",
        tipEs: "Excelente ojo de bife y sus famosas cazuelitas calientes de acompañamiento.",
        tipEn: "Excellent ribeye steak and their famous complimentary hot side dishes."
      },
      {
        name: "El Preferido de Palermo",
        rating: "4.5",
        reviews: "7.5k+",
        address: "Jorge Luis Borges 2108",
        mapsUrl: "https://maps.google.com/?q=El+Preferido+de+Palermo+Borges+2108",
        hours: "Todos los días 11:30 - 16:00, 19:00 - 01:00",
        tipEs: "Bodegón histórico porteño renovado. Excelentes milanesas y embutidos caseros.",
        tipEn: "Renovated historic Buenos Aires bodegón. Superb milanesas and charcuterie."
      },
      {
        name: "Las Cabras",
        rating: "4.3",
        reviews: "20k+",
        address: "Fitz Roy 1795",
        mapsUrl: "https://maps.google.com/?q=Las+Cabras+Parrilla+Fitz+Roy+1795",
        hours: "Todos los días 12:00 - 01:00",
        tipEs: "A solo 2 cuadras del departamento. Abundante, informal y muy económica.",
        tipEn: "Just 2 blocks away. Generous portions, informal vibe, very budget-friendly."
      }
    ]
  },
  {
    titleEs: "Bares y Coctelería",
    titleEn: "Bars & Cocktail Lounges",
    icon: "🍹",
    subtitleEs: "Speakeasies y autor:",
    subtitleEn: "Speakeasies & signature:",
    items: [
      {
        name: "Uptown",
        rating: "4.2",
        reviews: "9.6k+",
        address: "Arévalo 2030",
        mapsUrl: "https://maps.google.com/?q=Uptown+Bar+Arevalo+2030",
        hours: "Mar a Sáb 20:00 - 03:00",
        tipEs: "Se ingresa por una réplica de estación de subte de Nueva York. Gran coctelería.",
        tipEn: "Enter through a replica NYC subway station. Outstanding cocktails and vibe."
      },
      {
        name: "Boticario",
        rating: "4.4",
        reviews: "4.8k+",
        address: "Honduras 5207",
        mapsUrl: "https://maps.google.com/?q=Boticario+Bar+Honduras+5207",
        hours: "Mar a Dom 19:00 - 02:00",
        tipEs: "Ambientado como una antigua farmacia/botica, con tragos de autor y hermoso patio.",
        tipEn: "Themed as an old pharmacy, serving signature drinks in a beautiful patio."
      },
      {
        name: "Verne Club",
        rating: "4.4",
        reviews: "3k+",
        address: "Av. Medrano 1475",
        mapsUrl: "https://maps.google.com/?q=Verne+Club+Medrano+1475",
        hours: "Todos los días 19:00 - 02:00",
        tipEs: "Inspirado en Julio Verne. Coctelería clásica y jazz en un ambiente de época.",
        tipEn: "Jules Verne inspired. Award-winning classic cocktails and jazz in a cozy vibe."
      }
    ]
  },
  {
    titleEs: "Pizzerías y Heladerías",
    titleEn: "Pizza & Ice Cream",
    icon: "🍕",
    subtitleEs: "Golosinas y masa fina:",
    subtitleEn: "Sweet treats & thin crust:",
    items: [
      {
        name: "Siamo nel Forno",
        rating: "4.4",
        reviews: "2.6k+",
        address: "Costa Rica 5886",
        mapsUrl: "https://maps.google.com/?q=Siamo+nel+Forno+Costa+Rica+5886",
        hours: "Mar a Dom 20:00 - 24:00",
        tipEs: "Auténtica pizza napolitana con certificación oficial, cocinada en horno de leña.",
        tipEn: "Authentic certified Neapolitan pizza, wood-fired with fresh ingredients."
      },
      {
        name: "Rapanui",
        rating: "4.7",
        reviews: "15k+",
        address: "El Salvador 4702",
        mapsUrl: "https://maps.google.com/?q=Rapanui+El+Salvador+4702",
        hours: "Todos los días 10:00 - 01:00",
        tipEs: "Los helados artesanales más famosos del sur. Probá las frambuesas bañadas Franui.",
        tipEn: "Famous artisanal gelato from Bariloche. Try the Franui chocolate raspberries."
      },
      {
        name: "Lucciano's",
        rating: "4.6",
        reviews: "3.8k+",
        address: "Honduras 4881",
        mapsUrl: "https://maps.google.com/?q=Luccianos+Honduras+4881",
        hours: "Todos los días 11:00 - 01:00",
        tipEs: "Helados italianos premium y una divertida variedad de paletas de diseño.",
        tipEn: "Premium Italian-style gelato and a fun selection of designer popsicles."
      }
    ]
  }
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<"es" | "en">("es");
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "ai" | "user"; text: string }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [darkMode, setDarkMode] = useState(false);

  // Sync language selection with localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("language") as "es" | "en";
      if (savedLang === "es" || savedLang === "en") {
        setLanguage(savedLang);
      }

      const savedDark = document.documentElement.classList.contains("dark");
      setDarkMode(savedDark);
    }
  }, []);

  const groupedAmenities = React.useMemo(() => {
    const amenities = airbnbDetails.amenities || [];
    const categories = {
      kitchen: { titleEs: "Cocina y Vajilla", titleEn: "Kitchen & Dining", icon: "🍳", items: [] as string[] },
      bedroom: { titleEs: "Dormitorio y Blancos", titleEn: "Bedroom & Linens", icon: "🛏️", items: [] as string[] },
      bathroom: { titleEs: "Baño y Cuidado Personal", titleEn: "Bathroom & Toiletries", icon: "🚿", items: [] as string[] },
      connectivity: { titleEs: "Conectividad y Climatización", titleEn: "Connectivity & Climate", icon: "🔌", items: [] as string[] },
      safety: { titleEs: "Seguridad y Prevención", titleEn: "Safety & Security", icon: "🛡️", items: [] as string[] },
      rooftop: { titleEs: "Terraza, Accesibilidad y Servicios", titleEn: "Rooftop & Accessibility", icon: "🌇", items: [] as string[] },
    };

    amenities.forEach((item) => {
      const lower = item.toLowerCase();
      if (lower.includes("cocina") || lower.includes("heladera") || lower.includes("microondas") || lower.includes("vajilla") || lower.includes("horno") || lower.includes("cafetera") || lower.includes("licuadora") || lower.includes("arrocera") || lower.includes("comedor") || lower.includes("pava") || lower.includes("copas") || lower.includes("congelador") || lower.includes("utensilios")) {
        categories.kitchen.items.push(item);
      } else if (lower.includes("cama") || lower.includes("almohada") || lower.includes("manta") || lower.includes("cortina") || lower.includes("persiana") || lower.includes("ropa") || lower.includes("perchas") || lower.includes("lavarropas") || lower.includes("secarropas") || lower.includes("plancha") || lower.includes("ténder") || lower.includes("placard") || lower.includes("armario") || lower.includes("guardar")) {
        categories.bedroom.items.push(item);
      } else if (lower.includes("pelo") || lower.includes("shampoo") || lower.includes("acondicionador") || lower.includes("jabón") || lower.includes("bidé") || lower.includes("bidet") || lower.includes("ducha") || lower.includes("agua caliente") || lower.includes("gel")) {
        categories.bathroom.items.push(item);
      } else if (lower.includes("wifi") || lower.includes("ethernet") || lower.includes("televisor") || lower.includes("tv") || lower.includes("ac:") || lower.includes("calefacción") || lower.includes("split")) {
        categories.connectivity.items.push(item);
      } else if (lower.includes("cámara") || lower.includes("humo") || lower.includes("monóxido") || lower.includes("matafuego") || lower.includes("auxilios") || lower.includes("seguridad") || lower.includes("caja fuerte")) {
        categories.safety.items.push(item);
      } else {
        categories.rooftop.items.push(item);
      }
    });

    return Object.values(categories).filter(c => c.items.length > 0);
  }, []);

  const handleLanguageChange = (newLang: "es" | "en") => {
    setLanguage(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLang);
    }
  };

  const handleThemeChange = (isDark: boolean) => {
    setDarkMode(isDark);
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", String(isDark));
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const t = {
    es: {
      navDept: "EL DEPARTAMENTO",
      navAmen: "AMENIDADES",
      navInve: "INVENTARIO",
      inventoryCtaTitle: "Equipamiento e Inventario Completo",
      inventoryCtaDesc: "Consulta el listado detallado de vajilla, electrodomésticos, blanquería, elementos de seguridad y comodidades que encontrarás en el departamento para planificar tu estadía sin sorpresas.",
      inventoryCtaBtn: "Ver Inventario Completo ↗",
      navBarr: "EL BARRIO",
      navNorm: "NORMAS",
      navFaq: "PREGUNTAS",
      btnReserve: "RESERVAR AHORA",
      tagNew: "A Estrenar",
      tagLocation: "Palermo Hollywood, CABA",
      tagArena: "A 5 min. del Movistar Arena",
      heroTitle: airbnbDetails.title || "Estadía de Diseño con Rooftop y Piscina en Av. Córdoba",
      heroDesc: airbnbDetails.description || "Un oasis urbano de diseño contemporáneo y confort absoluto en la zona más vibrante de Buenos Aires. Totalmente equipado y pensado para nómadas digitales y viajeros exigentes.",
      badgeAirbnb: `★ ${airbnbDetails.rating.toFixed(2)} (${airbnbDetails.reviewsCount} evaluaciones)`,
      badgeGuests: "Capacidad: 2 a 4 huéspedes",
      badgeVerified: "Anfitrión verificado",
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
      reviewsNewTitle: "Sincronización de Reseñas en Proceso",
      reviewsNewDesc: "Este espectacular departamento de diseño es completamente nuevo en el mercado. Muy pronto podrás ver aquí las reseñas reales sincronizadas directamente desde nuestra publicación oficial de Airbnb cuando esté vinculada.",
      reviewsConfidenceTitle: "Reserva con Confianza",
      reviewsConfidenceText: "Jorge Orlando (tu anfitrión) cuenta con una amplia trayectoria y excelentes valoraciones en hospitalidad en Buenos Aires. Está 100% comprometido en brindarte una estadía impecable.",
      reviewsFirstGuest: "Sé uno de los primeros en dejar tu reseña y calificar tu experiencia.",
      guideTitle: "Guía Gastronómica del Anfitrión",
      guideSubtitle: "Palermo Hollywood está lleno de opciones, pero estas son las recomendaciones personales de Jorge para comer y trabajar como un local.",
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
      faq6Q: "¿Qué costo y qué vinos tiene el rincón bar del departamento?",
      faq6A: "El rincón bar cuenta con un stock de coste extra que incluye vinos tintos (Malbec, Syrah, Cabernet Sauvignon), blancos (Torrontés, dulce natural) y botellas de espumante y Fernet Branca. Los precios detallados están indicados en el bar y simplemente reportas tu consumo a Jorge al salir.",
      faq7Q: "¿El edificio cuenta con ascensor y accesibilidad para silla de ruedas?",
faq7A: "Sí, el ingreso desde la vereda hasta el lobby es completamente libre de escalones. Además, el edificio cuenta con un ascensor amplio y moderno (132 cm de profundidad y puerta de 81 cm de ancho mínimo) que llega directo al piso 1 de la unidad 101.",
      faq8Q: "¿Hay servicio de lavadero o laundry disponible?",
      faq8A: "Sí, todos los huéspedes tienen acceso sin costo adicional al laundry de uso común en el edificio, equipado con lavarropas y secadoras. Además, el departamento cuenta con ténder para colgar la ropa.",
      bookingDirectTitle: "¿Por qué reservar directo?",
      bookingDirectText: "Reservando a través de nuestro sitio oficial vía WhatsApp ahorras hasta un 15% en tarifas de servicio e impuestos que cobran plataformas externas como Airbnb o Booking.com.",
      footerTitle: "Alquiler Temporal de Diseño · Palermo Hollywood, Buenos Aires",
      footerRights: "Todos los derechos reservados.",
      footerProject: "Un proyecto alojado dentro de",
      minibarTitle: "Cava de Vinos y Minibar (Costo Extra)",
      minibarSubtitle: "Disfruta de etiquetas seleccionadas directamente en la comodidad del departamento. Reportas el consumo al finalizar.",
      minibarFootnote: "El cobro se coordinará al finalizar la estadía junto con el check-out.",
      minibarItemRed: "Vino Tinto Malbec / Syrah",
      minibarDescRed: "Selección de bodegas mendocinas premium.",
      minibarItemWhite: "Vino Blanco Torrontés",
      minibarDescWhite: "Fresco y aromático de altura, ideal para maridar.",
      minibarItemChampagne: "Champagne / Espumante",
      minibarDescChampagne: "Extra Brut para ocasiones especiales.",
      minibarItemFernet: "Fernet Branca + Coca-Cola",
      minibarDescFernet: "La bebida clásica local para armar.",
      chatGreetingMorning: "¡Buen día! ☀️ Soy tu Concierge Virtual de Córdoba 5579. ¿Querés saber dónde desayunar cerca ahora mismo?",
      chatGreetingAfternoon: "¡Buenas tardes! ☕ Soy tu Concierge Virtual de Córdoba 5579. ¿Querés saber sobre el check-in, la pileta o dónde almorzar/merendar?",
      chatGreetingNight: "¡Buenas noches! 🌙 Soy tu Concierge Virtual de Córdoba 5579. ¿Buscás recomendaciones para cenar cerca o pedir delivery?",
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
      inventoryCtaTitle: "Complete Equipment & Inventory",
      inventoryCtaDesc: "Browse the detailed list of dinnerware, appliances, linens, safety features, and amenities available in the apartment to plan your stay with peace of mind.",
      inventoryCtaBtn: "View Full Inventory ↗",
      navBarr: "THE NEIGHBORHOOD",
      navNorm: "RULES",
      navFaq: "FAQ",
      btnReserve: "BOOK NOW",
      tagNew: "Brand New",
      tagLocation: "Palermo Hollywood, BA",
      tagArena: "5 min from Movistar Arena",
      heroTitle: airbnbDetails.title || "Designer Apartment with Rooftop and Pool on Av. Córdoba",
      heroDesc: airbnbDetails.description || "An urban oasis of contemporary design and absolute comfort in the most vibrant area of Buenos Aires. Fully equipped and tailored for digital nomads and demanding travelers.",
      badgeAirbnb: `★ ${airbnbDetails.rating.toFixed(2)} (${airbnbDetails.reviewsCount} reviews)`,
      badgeGuests: "Capacity: 2 to 4 guests",
      badgeVerified: "Verified Host",
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
      reviewsNewTitle: "Reviews Sync in Progress",
      reviewsNewDesc: "This spectacular designer apartment is brand new to the market. Real reviews synced directly from our official Airbnb listing will be available here as soon as we link it.",
      reviewsConfidenceTitle: "Book with Confidence",
      reviewsConfidenceText: "Jorge Orlando (your host) has a proven track record of providing top-tier hospitality in Buenos Aires. 100% committed to offering you an impeccable stay and 24/7 support.",
      reviewsFirstGuest: "Be one of the first guests to leave a review and share your experience.",
      guideTitle: "Host's Curated Food Guide",
      guideSubtitle: "Palermo Hollywood is filled with options, but these are Jorge's personal recommendations to eat and work like a local.",
      rulesHeader: "House Rules",
      rulesCheck: "Check-In: From 3:00 PM onwards / Check-Out: By 11:00 AM.",
      rulesSmoke: "No smoking inside the apartment or in building common areas.",
      rulesPets: "No pets of any kind are allowed in the apartment.",
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
      faq6Q: "What are the wine cellar options and costs in the apartment?",
      faq6A: "The cocktail bar features an extra-cost selection of red wines (Malbec, Syrah, Cabernet Sauvignon), white wines (Torrontés, naturally sweet), Champagne, and Fernet Branca. Detailed prices are listed at the bar; simply report consumption to Jorge at checkout.",
      faq7Q: "Is the building wheelchair accessible and does it have an elevator?",
      faq7A: "Yes, entrance from the sidewalk to the lobby is completely step-free. The building features a spacious, modern elevator (132 cm deep, 81 cm door width) going directly to the 1st floor where Depto 101 is located.",
      faq8Q: "Is there a laundry service available?",
      faq8A: "Yes, guests enjoy free access to the building's shared laundry room with washers and dryers. A drying rack is also provided inside the apartment.",
      bookingDirectTitle: "Why book direct?",
      bookingDirectText: "Booking directly through our official WhatsApp saves you up to 15% in platform service fees and taxes charged by sites like Airbnb or Booking.com.",
      footerTitle: "Designer Vacation Rental · Palermo Hollywood, Buenos Aires",
      footerRights: "All rights reserved.",
      footerProject: "A project hosted inside",
      minibarTitle: "Wine Cellar & Minibar (Extra Cost)",
      minibarSubtitle: "Enjoy premium selected labels in the comfort of the apartment. Simply report consumption at checkout.",
      minibarFootnote: "Charges will be coordinated during check-out.",
      minibarItemRed: "Malbec / Syrah Red Wine",
      minibarDescRed: "Premium selection from Mendoza wineries.",
      minibarItemWhite: "Torrontés White Wine",
      minibarDescWhite: "Fresh and aromatic high-altitude wine.",
      minibarItemChampagne: "Champagne / Sparkling Wine",
      minibarDescChampagne: "Extra Brut for special celebrations.",
      minibarItemFernet: "Fernet Branca + Coca-Cola",
      minibarDescFernet: "The classic Argentinian mix to prepare yourself.",
      chatGreetingMorning: "Good morning! ☀️ I am your Cordoba 5579 Virtual Concierge. Would you like to know where to eat breakfast nearby right now?",
      chatGreetingAfternoon: "Good afternoon! ☕ I am your Cordoba 5579 Virtual Concierge. Can I help you with check-in, pool rules, or lunch spots?",
      chatGreetingNight: "Good evening! 🌙 I am your Cordoba 5579 Virtual Concierge. Looking for dinner recommendations or food delivery?",
      chatConcierge: "Ask the Concierge",
      chatSubtitle: "Online · Instant reply",
      chatPlaceholder: "Type your question...",
      chatSend: "Send",
      chatGreeting: "Hi! I am your Cordoba 5579 Virtual Concierge. How can I help you today?"
    }
  }[language];

  // Initialize greeting message based on language preference & time of day in Buenos Aires (GMT-3)
  useEffect(() => {
    const getGreeting = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          hour12: false,
          timeZone: "America/Argentina/Buenos_Aires",
        });
        const hour = parseInt(formatter.format(now), 10);
        
        if (hour >= 6 && hour < 12) {
          return t.chatGreetingMorning;
        } else if (hour >= 12 && hour < 19) {
          return t.chatGreetingAfternoon;
        } else {
          return t.chatGreetingNight;
        }
      } catch {
        return t.chatGreeting;
      }
    };

    setMessages([
      { sender: "ai", text: getGreeting() }
    ]);
  }, [language, t.chatGreetingMorning, t.chatGreetingAfternoon, t.chatGreetingNight, t.chatGreeting]);

  const getConciergeResponse = (query: string): string => {
    const q = query.toLowerCase();
    const isEn = language === "en";

    // Special Dynamic Case: Local Time & GMT-3
    if (q.includes("hora") || q.includes("time") || q.includes("gmt") || q.includes("horario")) {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", timeZone: "America/Argentina/Buenos_Aires" };
      const localTime = now.toLocaleTimeString(isEn ? "en-US" : "es-AR", options);
      return isEn
        ? `The current local time in Buenos Aires (GMT-3) is ${localTime}. Please keep this in mind when checking local store hours!`
        : `La hora local actual en Buenos Aires (GMT-3) es ${localTime}. Tenela en cuenta para los horarios de los locales de la zona.`;
    }

    // Traverse Modularized Knowledge Rules
    for (const category in cordoba5579Knowledge) {
      const rule = cordoba5579Knowledge[category];
      const matches = rule.keys.some(key => q.includes(key));
      if (matches) {
        return isEn ? rule.en : rule.es;
      }
    }

    // Fallback response
    return isEn
      ? "Good question! I don't have that specific detail in my guide. You can ask Jorge directly by clicking 'Book via WhatsApp' and he will help you right away!"
      : "¡Buena pregunta! No tengo esa respuesta exacta registrada en mi guía del departamento, pero podés consultarle directamente a Jorge haciendo clic en 'Reservar por WhatsApp'. ¡Te responderá enseguida!";
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { sender: "user", text }]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Try Gemini AI first
      const res = await fetch("/cordoba5579/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, language }),
      });
      const data = await res.json();
      if (data.reply && !data.fallback) {
        setMessages(prev => [...prev, { sender: "ai", text: data.reply }]);
        setIsTyping(false);
        return;
      }
    } catch {
      // Gemini unavailable — fall through to local knowledge base
    }

    // Local knowledge base fallback
    setTimeout(() => {
      const response = getConciergeResponse(text);
      setMessages(prev => [...prev, { sender: "ai", text: response }]);
      setIsTyping(false);
    }, 600);
  };

  const handleFaqToggle = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };


  // Optional: Replace this with your public Google Sheets CSV URL for map points
  const googleSheetPlacesUrl = ""; 

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-neutral-800 dark:text-neutral-200 bg-[#FAF9F7] dark:bg-[#141613] transition-colors duration-300">
      {/* Translucent Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#FAF9F7]/80 dark:bg-[#141613]/80 border-b border-[#EFEBE4] dark:border-[#2C302A] transition-all">
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
              <Link href="/inventario" className="hover:text-neutral-900 transition-colors">{t.navInve}</Link>
              <a href="#barrio" className="hover:text-neutral-900 transition-colors">{t.navBarr}</a>
              <a href="#reglas" className="hover:text-neutral-900 transition-colors">{t.navNorm}</a>
              <a href="#faq" className="hover:text-neutral-900 transition-colors">{t.navFaq}</a>
            </div>

            {/* Language Switcher and CTA Button */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => handleThemeChange(!darkMode)}
                className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-[#EFEBE4] dark:border-[#2C302A] text-neutral-600 dark:text-neutral-300 transition-all text-xs flex items-center justify-center shadow-sm"
                title={language === "es" ? "Cambiar Tema" : "Toggle Theme"}
              >
                {darkMode ? "☀️" : "🌙"}
              </button>

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
              <button
                onClick={() => handleThemeChange(!darkMode)}
                className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-[#EFEBE4] dark:border-[#2C302A] text-neutral-600 dark:text-neutral-300 transition-all text-xs flex items-center justify-center shadow-sm"
                title={language === "es" ? "Cambiar Tema" : "Toggle Theme"}
              >
                {darkMode ? "☀️" : "🌙"}
              </button>

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
                className="text-neutral-600 hover:text-neutral-900 p-2"
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
            <Link 
              href="/inventario" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-600 hover:text-neutral-900"
            >
              {t.navInve}
            </Link>
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

      {/* WhatsApp Floating CTA */}
      <a
        href="https://wa.me/5491145379500?text=Hola%20Jorge%2C%20me%20interesa%20el%20departamento%20C%C3%B3rdoba%205579."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-[9980] flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5a] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="hidden sm:block">WhatsApp</span>
      </a>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-12">
        
        {/* Header Title Section */}
        <ScrollReveal>
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
            
            <h1 className="font-serif text-3xl md:text-4.5xl text-neutral-900 font-bold tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            
            <p className="text-neutral-500 text-sm md:text-base max-w-3xl">
              {t.heroDesc}
            </p>

            {/* Trust Badges Row */}
            <div className="flex flex-wrap gap-3 pt-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              <div className="flex items-center gap-2 bg-white dark:bg-[#252824] border border-[#EFEBE4] dark:border-[#353A33] px-4 py-2.5 rounded-2xl shadow-sm transition-colors duration-300">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{t.badgeAirbnb}</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-[#252824] border border-[#EFEBE4] dark:border-[#353A33] px-4 py-2.5 rounded-2xl shadow-sm transition-colors duration-300">
                <Users className="w-4 h-4 text-[#5F6F52] dark:text-[#889B73]" />
                <span>{t.badgeGuests}</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-[#252824] border border-[#EFEBE4] dark:border-[#353A33] px-4 py-2.5 rounded-2xl shadow-sm transition-colors duration-300">
                <UserCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-500" />
                <span>{t.badgeVerified}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Gallery Grid */}
        <ScrollReveal delay={0.1}>
          <section>
            <Gallery />
          </section>
        </ScrollReveal>

        {/* 2-Column Details Layout */}
        <ScrollReveal delay={0.05}>
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
                {airbnbDetails.description ? (
                  airbnbDetails.description.split("\n").filter(p => p.trim()).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))
                ) : (
                  <>
                    <p>{t.aboutP1}</p>
                    <p>{t.aboutP2}</p>
                    <p>{t.aboutP3}</p>
                  </>
                )}
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-8 border-b border-[#EFEBE4] pb-10" id="amenidades">
              <h3 className="font-serif text-2xl text-neutral-900 font-semibold">{t.amenitiesTitle}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
                {groupedAmenities.map((cat, idx) => (
                  <div key={idx} className="space-y-4">
                    <h4 className="font-serif text-sm font-bold tracking-wider text-neutral-500 uppercase flex items-center gap-2">
                      <span className="text-base">{cat.icon}</span>
                      {language === "es" ? cat.titleEs : cat.titleEn}
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
                      {cat.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 bg-[#FAF9F7] dark:bg-[#1E211D] px-3.5 py-2 rounded-xl border border-[#EFEBE4] dark:border-[#2C302A]">
                          <span className="text-[#5F6F52] font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6 border-b border-[#EFEBE4] pb-8" id="resenas">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl md:text-2xl text-neutral-900 font-semibold">{t.reviewsTitle}</h3>
                <span className="text-xs text-neutral-500 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span>
                    {airbnbDetails.rating && airbnbDetails.reviewsCount > 0 ? (
                      language === "es" ? "Sincronizado con Airbnb" : "Synced with Airbnb"
                    ) : (
                      language === "es" ? "Opiniones reales próximamente" : "Real reviews coming soon"
                    )}
                  </span>
                </span>
              </div>

              <div className="bg-white dark:bg-[#252824] border border-[#EFEBE4] dark:border-[#353A33] rounded-3xl p-6 md:p-8 shadow-sm space-y-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-300">
                <div className="space-y-3 max-w-xl">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-md">
                      {airbnbDetails.rating && airbnbDetails.reviewsCount > 0 
                        ? (language === "es" ? `★ ${airbnbDetails.rating.toFixed(1)} Excelente` : `★ ${airbnbDetails.rating.toFixed(1)} Excellent`)
                        : (language === "es" ? "✨ ¡Lanzamiento a Estrenar!" : "✨ Brand New Launch!")}
                    </span>
                  </div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
                    {airbnbDetails.rating && airbnbDetails.reviewsCount > 0 
                      ? (language === "es" ? `Calificaciones de Huéspedes en Airbnb` : `Guest Ratings on Airbnb`)
                      : t.reviewsNewTitle}
                  </h4>
                  <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed">
                    {airbnbDetails.rating && airbnbDetails.reviewsCount > 0 
                      ? (language === "es" 
                          ? `Este alojamiento cuenta con una puntuación perfecta de ${airbnbDetails.rating.toFixed(1)} estrellas en base a ${airbnbDetails.reviewsCount} evaluaciones reales de la comunidad de Airbnb.`
                          : `This accommodation has a perfect score of ${airbnbDetails.rating.toFixed(1)} stars based on ${airbnbDetails.reviewsCount} real reviews from the Airbnb community.`)
                      : t.reviewsNewDesc}
                  </p>
                  <p className="text-[#5F6F52] dark:text-[#889B73] text-xs font-semibold">
                    ⭐ {airbnbDetails.rating && airbnbDetails.reviewsCount > 0 
                      ? (language === "es" ? `Sincronizado automáticamente desde Airbnb.` : `Synced automatically from Airbnb.`)
                      : t.reviewsFirstGuest}
                  </p>
                </div>

                <div className="bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] p-5 rounded-2xl md:max-w-xs space-y-2 flex-shrink-0 transition-colors duration-300">
                  <h5 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-200 flex items-center gap-1.5">
                    🛡️ {t.reviewsConfidenceTitle}
                  </h5>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed">
                    {t.reviewsConfidenceText}
                  </p>
                </div>
              </div>
            </div>

            {/* Dynamic Inventory Section Link Card */}
            <div id="inventario" className="bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm transition-colors duration-300">
              <div className="p-4 bg-white dark:bg-[#141613] border border-[#EFEBE4] dark:border-[#2C302A] text-[#5F6F52] dark:text-[#889B73] rounded-2xl shadow-sm flex-shrink-0 transition-colors duration-300">
                <ClipboardList className="w-8 h-8" />
              </div>
              <div className="space-y-2 text-center sm:text-left flex-grow">
                <h4 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
                  {t.inventoryCtaTitle}
                </h4>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  {t.inventoryCtaDesc}
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link 
                  href="/inventario"
                  className="inline-flex items-center justify-center bg-[#5F6F52] hover:bg-[#4F5D43] text-white text-xs font-semibold tracking-wider px-5 py-3 rounded-xl transition-all shadow-sm"
                >
                  {t.inventoryCtaBtn}
                </Link>
              </div>
            </div>

            {/* Minibar & Wine Cellar Premium visual catalog */}
            <div className="bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] rounded-3xl p-6 md:p-8 space-y-6 shadow-sm transition-colors duration-300">
              <div className="flex items-center gap-3 border-b border-[#EFEBE4] dark:border-[#2C302A] pb-4">
                <div className="p-2.5 bg-[#5F6F52] text-white rounded-xl">
                  <Wine className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
                    {t.minibarTitle}
                  </h4>
                  <p className="text-neutral-500 dark:text-neutral-450 text-xs">
                    {t.minibarSubtitle}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Red Wine */}
                <div className="bg-white dark:bg-[#141613] border border-[#EFEBE4] dark:border-[#2C302A] p-4 rounded-2xl flex justify-between gap-3 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="space-y-1">
                    <span className="text-[10px] bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 font-bold px-2 py-0.5 rounded">Tinto / Red</span>
                    <h5 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-200 pt-1">{t.minibarItemRed}</h5>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-405">{t.minibarDescRed}</p>
                  </div>
                  <div className="text-right flex flex-col justify-between items-end flex-shrink-0">
                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-200">USD 15</span>
                  </div>
                </div>

                {/* White Wine */}
                <div className="bg-white dark:bg-[#141613] border border-[#EFEBE4] dark:border-[#2C302A] p-4 rounded-2xl flex justify-between gap-3 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="space-y-1">
                    <span className="text-[10px] bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 font-bold px-2 py-0.5 rounded">Blanco / White</span>
                    <h5 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-200 pt-1">{t.minibarItemWhite}</h5>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-405">{t.minibarDescWhite}</p>
                  </div>
                  <div className="text-right flex flex-col justify-between items-end flex-shrink-0">
                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-200">USD 12</span>
                  </div>
                </div>

                {/* Sparkling */}
                <div className="bg-white dark:bg-[#141613] border border-[#EFEBE4] dark:border-[#2C302A] p-4 rounded-2xl flex justify-between gap-3 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="space-y-1">
                    <span className="text-[10px] bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 font-bold px-2 py-0.5 rounded">Burbujas / Sparkling</span>
                    <h5 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-200 pt-1">{t.minibarItemChampagne}</h5>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-405">{t.minibarDescChampagne}</p>
                  </div>
                  <div className="text-right flex flex-col justify-between items-end flex-shrink-0">
                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-200">USD 20</span>
                  </div>
                </div>

                {/* Local Classic */}
                <div className="bg-white dark:bg-[#141613] border border-[#EFEBE4] dark:border-[#2C302A] p-4 rounded-2xl flex justify-between gap-3 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="space-y-1">
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 font-bold px-2 py-0.5 rounded">Combo Local</span>
                    <h5 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-200 pt-1">{t.minibarItemFernet}</h5>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-405">{t.minibarDescFernet}</p>
                  </div>
                  <div className="text-right flex flex-col justify-between items-end flex-shrink-0">
                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-200">USD 18</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5 justify-center bg-white dark:bg-[#141613] border border-[#EFEBE4] dark:border-[#2C302A] py-2.5 rounded-xl font-medium transition-colors duration-300">
                <AlertCircle className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                <span>{t.minibarFootnote}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget (4/12 width) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6" id="reserva">
            <CalendarWidget lang={language} airbnbUrl="https://www.airbnb.com.ar/rooms/1716762976739155303" />
            
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
        </ScrollReveal>

        {/* Neighbourhood Map Section (Full Width 12/12) */}
        <ScrollReveal delay={0.05}>
        <div id="barrio" className="space-y-6">
          <NeighbourhoodMap sheetUrl={googleSheetPlacesUrl} lang={language} />
          
          {/* Guía Gastronómica Curada */}
          <div className="bg-white dark:bg-[#252824] border border-[#EFEBE4] dark:border-[#353A33] rounded-3xl p-6 md:p-8 space-y-6 transition-colors duration-300">
            <div>
              <h3 className="font-serif text-xl md:text-2xl text-neutral-900 dark:text-neutral-100 font-semibold flex items-center gap-2">
                <span>🍳 {t.guideTitle}</span>
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                {t.guideSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {foodGuideData.map((cat, catIdx) => (
                <div key={catIdx} className="bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] rounded-2xl p-4 space-y-4 flex flex-col justify-between transition-colors duration-300">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[#5F6F52] dark:text-[#889B73] pb-2 border-b border-[#EFEBE4]/60 dark:border-[#2C302A]/60">
                      <span className="text-lg">{cat.icon}</span>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                        {language === "es" ? cat.titleEs : cat.titleEn}
                      </h4>
                    </div>
                    <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider pt-1">
                      {language === "es" ? cat.subtitleEs : cat.subtitleEn}
                    </p>
                  </div>

                  <div className="space-y-3 flex-grow mt-2">
                    {cat.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="bg-white dark:bg-[#141613] border border-[#EFEBE4] dark:border-[#2C302A] p-3 rounded-xl shadow-sm hover:shadow-md transition-all space-y-1.5 flex flex-col justify-between duration-300">
                        <div>
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="font-bold text-[12px] text-neutral-900 dark:text-neutral-100 leading-tight">
                              {item.name}
                            </span>
                            <a 
                              href={item.mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#5F6F52] dark:text-[#889B73] hover:text-[#4F5D43] dark:hover:text-[#6E7F5E] flex-shrink-0"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded">
                              ⭐ {item.rating} ({item.reviews} en Google)
                            </span>
                            <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-semibold">
                              📍 {item.address}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium mt-1 leading-normal">
                            {language === "es" ? item.tipEs : item.tipEn}
                          </p>
                        </div>
                        <div className="pt-1.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-1 text-[9px] text-neutral-400 dark:text-neutral-500 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                          <span>{item.hours}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </ScrollReveal>

        {/* House Rules / Norms (Full Width 12/12) */}
        <ScrollReveal delay={0.05}>
        <div className="space-y-6 bg-amber-50/15 dark:bg-amber-950/5 border border-[#EFEBE4] dark:border-[#353A33] rounded-3xl p-6 md:p-8 transition-colors duration-300" id="reglas">
          <h3 className="font-serif text-xl md:text-2xl text-neutral-900 dark:text-neutral-100 font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>{t.rulesHeader}</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs md:text-sm text-neutral-600 dark:text-neutral-350 font-sans">
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
              <p>{t.rulesPets}</p>
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
        </ScrollReveal>

        {/* Accordion FAQ Section (Full Width 12/12) */}
        <ScrollReveal delay={0.05}>
        <div className="space-y-6 bg-white dark:bg-[#252824] border border-[#EFEBE4] dark:border-[#353A33] rounded-3xl p-6 md:p-8 transition-colors duration-300" id="faq">
          <h3 className="font-serif text-xl md:text-2xl text-neutral-900 dark:text-neutral-100 font-semibold">
            {t.faqHeader}
          </h3>
          
          <div className="divide-y divide-[#EFEBE4] dark:divide-[#353A33] border-t border-b border-[#EFEBE4] dark:border-[#353A33] font-sans">
            {[
              { q: t.faq1Q, a: t.faq1A },
              { q: t.faq2Q, a: t.faq2A },
              { q: t.faq3Q, a: t.faq3A },
              { q: t.faq4Q, a: t.faq4A },
              { q: t.faq5Q, a: t.faq5A },
              { q: t.faq6Q, a: t.faq6A },
              { q: t.faq7Q, a: t.faq7A },
              { q: t.faq8Q, a: t.faq8A }
            ].map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => handleFaqToggle(idx)}
                    className="w-full flex items-center justify-between text-left gap-4 group"
                  >
                    <span className="font-semibold text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
                      {item.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-all duration-300 flex-shrink-0 ${
                      isOpen ? "transform rotate-180 text-[#5F6F52]" : ""
                    }`} />
                  </button>
                  
                  {/* Fluid transition container for answer */}
                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100 mt-2.5" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed pl-1">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </ScrollReveal>
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
          <div className="absolute bottom-16 right-0 w-[330px] sm:w-[380px] h-[450px] bg-white dark:bg-[#252824] border border-[#EFEBE4] dark:border-[#353A33] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn transition-colors duration-300">
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
            <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-[#FAF9F7] dark:bg-[#1E211D] transition-colors duration-300">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                    msg.sender === "user" 
                      ? "bg-[#5F6F52] text-white rounded-tr-none" 
                      : "bg-white dark:bg-[#141613] text-neutral-800 dark:text-neutral-200 border border-[#EFEBE4] dark:border-[#2C302A] rounded-tl-none transition-colors duration-300"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-[#141613] border border-[#EFEBE4] dark:border-[#2C302A] rounded-2xl rounded-tl-none p-3 text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1 shadow-sm transition-colors duration-300">
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}
            </div>

            {/* Predefined FAQs with dynamic sorting/filtering based on Buenos Aires time of day */}
            <div className="p-3 bg-white dark:bg-[#252824] border-t border-b border-[#EFEBE4] dark:border-[#353A33] flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto transition-colors duration-300">
              {(() => {
                const getDynamicButtons = () => {
                  try {
                    const now = new Date();
                    const formatter = new Intl.DateTimeFormat("en-US", {
                      hour: "numeric",
                      hour12: false,
                      timeZone: "America/Argentina/Buenos_Aires",
                    });
                    const hour = parseInt(formatter.format(now), 10);
                    
                    const isMorning = hour >= 6 && hour < 12;
                    const isAfternoon = hour >= 12 && hour < 19;

                    if (isMorning) {
                      return [
                        { icon: "☕", es: "¿Dónde desayunar cerca?", en: "Where to eat breakfast nearby?", labelEs: "Desayunar cerca", labelEn: "Breakfast nearby" },
                        { icon: "📶", es: "¿Cuál es la contraseña del WiFi?", en: "What is the WiFi password?", labelEs: "Clave WiFi", labelEn: "WiFi Password" },
                        { icon: "💳", es: "¿Dónde comprar una SUBE?", en: "Where to buy a SUBE card?", labelEs: "Comprar SUBE", labelEn: "Buy SUBE" },
                        { icon: "✈️", es: "¿Cómo llegar a Ezeiza?", en: "How to get to Ezeiza airport?", labelEs: "Llegar a Ezeiza", labelEn: "Get to Ezeiza" }
                      ];
                    } else if (isAfternoon) {
                      return [
                        { icon: "🔑", es: "¿Cómo es el check-in?", en: "How to do check-in?", labelEs: "Cómo hacer Check-in", labelEn: "Check-in guide" },
                        { icon: "🏊", es: "¿Se puede usar la pileta?", en: "Can we use the pool?", labelEs: "Usar pileta", labelEn: "Pool access" },
                        { icon: "🥩", es: "¿Cómo usar la parrilla?", en: "How to use the grill?", labelEs: "Usar parrilla", labelEn: "Use grill" },
                        { icon: "📶", es: "¿Cuál es la contraseña del WiFi?", en: "What is the WiFi password?", labelEs: "Clave WiFi", labelEn: "WiFi Password" }
                      ];
                    } else {
                      return [
                        { icon: "🍷", es: "¿Qué vinos tiene el bar y qué costo?", en: "What wines does the bar have and what cost?", labelEs: "Carta del Minibar", labelEn: "Minibar menu" },
                        { icon: "🍽️", es: "¿Dónde cenar cerca?", en: "Where to have dinner nearby?", labelEs: "Cenar cerca", labelEn: "Dinner nearby" },
                        { icon: "📶", es: "¿Cuál es la contraseña del WiFi?", en: "What is the WiFi password?", labelEs: "Clave WiFi", labelEn: "WiFi Password" },
                        { icon: "🥩", es: "¿Cómo usar la parrilla?", en: "How to use the grill?", labelEs: "Usar parrilla", labelEn: "Use grill" }
                      ];
                    }
                  } catch {
                    return [
                      { icon: "☕", es: "¿Dónde desayunar cerca?", en: "Where to eat breakfast nearby?", labelEs: "Desayunar cerca", labelEn: "Breakfast nearby" },
                      { icon: "✈️", es: "¿Cómo llegar a Ezeiza?", en: "How to get to Ezeiza airport?", labelEs: "Llegar a Ezeiza", labelEn: "Get to Ezeiza" },
                      { icon: "📶", es: "¿Cuál es la contraseña del WiFi?", en: "What is the WiFi password?", labelEs: "Clave WiFi", labelEn: "WiFi Password" }
                    ];
                  }
                };

                return getDynamicButtons().map((btn, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSendMessage(language === "es" ? btn.es : btn.en)}
                    className="text-[10px] bg-[#FAF9F7] dark:bg-[#1E211D] hover:bg-[#EFEBE4] dark:hover:bg-[#2C302A] text-neutral-600 dark:text-neutral-300 border border-[#EFEBE4] dark:border-[#2C302A] px-2 py-1 rounded-full transition-all flex items-center gap-1"
                  >
                    <span>{btn.icon}</span>
                    <span>{language === "es" ? btn.labelEs : btn.labelEn}</span>
                  </button>
                ));
              })()}
            </div>

            {/* Custom Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-3 bg-white dark:bg-[#252824] flex gap-2 transition-colors duration-300"
            >
              <input
                type="text"
                placeholder={t.chatPlaceholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#353A33] text-neutral-900 dark:text-neutral-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors duration-300"
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

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
}
