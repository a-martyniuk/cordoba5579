"use client";

import React, { useState } from "react";
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
  UserCheck
} from "lucide-react";
import Gallery from "../components/Gallery";
import CalendarWidget from "../components/CalendarWidget";
import InventoryList from "../components/InventoryList";
import NeighbourhoodMap from "../components/NeighbourhoodMap";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "ai" | "user"; text: string }>>([
    { sender: "ai", text: "¡Hola! Soy tu Concierge Virtual de Córdoba 5579. ¿En qué te puedo ayudar hoy?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const getConciergeResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("desayun") || q.includes("desayuno") || q.includes("cafe") || q.includes("café") || q.includes("comer") || q.includes("gastronom")) {
      return "Para desayunar te súper recomiendo 'Cuervo Café' (en Fitz Roy y Paraguay, a solo 3 cuadras). Tienen café de especialidad increíble y medialunas de masa madre. Si querés algo dulce para la tarde, 'La Kitchen' es otra joya local.";
    }
    if (q.includes("ezeiza") || q.includes("aeropuerto") || q.includes("llegar") || q.includes("aeroparque")) {
      return "Para ir a Ezeiza podés tomar un taxi oficial o Uber/Cabify (tarda unos 45-60 min dependiendo del tráfico). Como alternativa económica, podés tomar el bus Tienda León desde Retiro. Para Aeroparque, un taxi te lleva en 15 minutos.";
    }
    if (q.includes("sube") || q.includes("tarjeta") || q.includes("colectivo") || q.includes("transporte")) {
      return "Podés comprar y cargar la tarjeta SUBE en el Kiosco Open 25 (en Av. Córdoba y Fitz Roy, a la vuelta del depto) o en la boletería de la estación Palermo de la Línea D de subte (Av. Santa Fe y Juan B. Justo).";
    }
    if (q.includes("parrilla") || q.includes("terraza") || q.includes("rooftop") || q.includes("piscina") || q.includes("pileta")) {
      return "La parrilla y la piscina están en el rooftop del edificio (piso 9). Para usar la parrilla, recordá avisarle a Jorge por WhatsApp con anticipación para reservarla. La pileta está disponible para huéspedes de 9:00 a 20:00 hs.";
    }
    if (q.includes("wifi") || q.includes("wi-fi") || q.includes("internet") || q.includes("clave") || q.includes("contraseña")) {
      return "El departamento cuenta con WiFi de alta velocidad (100 Mbps). La red es 'Cordoba5579_5G' y la contraseña es 'hola.cordoba'. Encontrarás un código QR en el depto para escanear y conectarte automáticamente.";
    }
    if (q.includes("check-in") || q.includes("checkin") || q.includes("ingres") || q.includes("llave") || q.includes("entrar")) {
      return "El check-in es autónomo a partir de las 15:00 hs. Las llaves se retiran de una caja de seguridad (lockbox) en la entrada del edificio. Podés ver el manual paso a paso con el código de acceso ingresando en la URL /checkin.";
    }
    if (q.includes("check-out") || q.includes("checkout") || q.includes("salida") || q.includes("llaves")) {
      return "El check-out es hasta las 11:00 hs. Te pedimos que apagues los aires acondicionados, dejes las llaves en la misma caja de seguridad (lockbox) de la entrada y le avises a Jorge por WhatsApp cuando te retires.";
    }
    if (q.includes("cava") || q.includes("vino") || q.includes("bar") || q.includes("bebida")) {
      return "El depto tiene una cava de vinos premium (Malbec, Syrah, Torrontés) y Champagne. Podés consumirlos libremente y simplemente le reportás tu consumo a Jorge al finalizar tu estadía. Los precios están detallados en el bar.";
    }
    return "¡Buena pregunta! No tengo esa respuesta exacta registrada en mi guía rápida, pero podés consultarle directamente a Jorge haciendo clic en 'Reservar por WhatsApp'. ¡Te responderá enseguida!";
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
            <div className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-wider text-neutral-600">
              <a href="#detalles" className="hover:text-neutral-900 transition-colors">EL DEPARTAMENTO</a>
              <a href="#amenidades" className="hover:text-neutral-900 transition-colors">AMENIDADES</a>
              <a href="#inventario" className="hover:text-neutral-900 transition-colors">INVENTARIO</a>
              <a href="#barrio" className="hover:text-neutral-900 transition-colors">EL BARRIO</a>
              <a href="#reglas" className="hover:text-neutral-900 transition-colors">NORMAS</a>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <a 
                href="#reserva" 
                className="bg-[#5F6F52] hover:bg-[#4F5D43] text-white text-xs font-semibold tracking-wider px-5 py-3 rounded-xl transition-all shadow-sm shadow-neutral-100"
              >
                RESERVAR AHORA
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-neutral-600 hover:text-neutral-950 p-2"
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
              El Departamento
            </a>
            <a 
              href="#amenidades" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-600 hover:text-neutral-900"
            >
              Amenidades
            </a>
            <a 
              href="#inventario" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-600 hover:text-neutral-900"
            >
              Inventario
            </a>
            <a 
              href="#barrio" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-600 hover:text-neutral-900"
            >
              El Barrio
            </a>
            <a 
              href="#reglas" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-600 hover:text-neutral-900"
            >
              Normas de la Casa
            </a>
            <a
              href="#reserva"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center bg-[#5F6F52] text-white py-3 rounded-xl font-semibold"
            >
              Reservar Ahora
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
              <span>A Estrenar</span>
            </span>
            <span>·</span>
            <span>Palermo Hollywood, CABA</span>
            <span>·</span>
            <span>A 5 min. del Movistar Arena</span>
          </div>
          
          <h1 className="font-serif text-3xl md:text-4.5xl text-neutral-950 font-bold tracking-tight leading-tight">
            Estadía de Diseño con Rooftop y Piscina en Av. Córdoba
          </h1>
          
          <p className="text-neutral-500 text-sm md:text-base max-w-3xl">
            Un oasis urbano de diseño contemporáneo y confort absoluto en la zona más vibrante de Buenos Aires. Totalmente equipado y pensado para nómadas digitales y viajeros exigentes.
          </p>

          {/* Trust Badges Row */}
          <div className="flex flex-wrap gap-3 pt-1 text-xs font-semibold text-neutral-700">
            <div className="flex items-center gap-2 bg-white border border-[#EFEBE4] px-4 py-2.5 rounded-2xl shadow-sm">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span><strong>4.9⭐</strong> en Airbnb</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-[#EFEBE4] px-4 py-2.5 rounded-2xl shadow-sm">
              <Users className="w-4 h-4 text-[#5F6F52]" />
              <span><strong>120+</strong> huéspedes alojados</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-[#EFEBE4] px-4 py-2.5 rounded-2xl shadow-sm">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <span>Anfitrión verificado (Superhost)</span>
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
                  Departamento entero · Anfitrión: Jorge Orlando
                </h2>
                <p className="text-neutral-500 text-sm">
                  2 a 4 huéspedes · 1 dormitorio · 1 cama Queen + 1 sofá cama · 1 baño completo · 1 toilette
                </p>
              </div>
              <div className="w-12 h-12 bg-[#5F6F52] text-white flex items-center justify-center rounded-full text-base font-bold font-serif shadow-sm flex-shrink-0">
                JO
              </div>
            </div>

            {/* Highlights Section ("Por qué elegirnos") */}
            <div className="space-y-6 border-b border-[#EFEBE4] pb-8">
              <h3 className="font-serif text-xl md:text-2xl text-neutral-900 font-semibold">Por qué elegir Córdoba 5579</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-neutral-100 rounded-2xl flex-shrink-0 h-fit">
                    <Compass className="w-5 h-5 text-neutral-700" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-neutral-900">Ubicación Privilegiada</h4>
                    <p className="text-neutral-500 text-xs leading-relaxed">
                      Situado en el corazón de Palermo Hollywood, rodeado de locales gastronómicos, bares de especialidad y transporte público. A solo 15 minutos a pie de los recitales y eventos en el famoso estadio Movistar Arena.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-neutral-100 rounded-2xl flex-shrink-0 h-fit">
                    <Clock className="w-5 h-5 text-neutral-700" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-neutral-900">Check-in Autónomo</h4>
                    <p className="text-neutral-500 text-xs leading-relaxed">
                      Ingresa a la propiedad de forma independiente mediante cerradura de combinación y caja de llaves. Flexibilidad total para tu llegada.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-neutral-100 rounded-2xl flex-shrink-0 h-fit">
                    <Wine className="w-5 h-5 text-[#5F6F52]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-neutral-900">Cava de Vinos Privada</h4>
                    <p className="text-neutral-500 text-xs leading-relaxed">
                      Disfruta de una selección premium de vinos Malbec, Syrah, Torrontés y Champagne disponibles en el bar con costo extra. Solo reportas tu consumo al finalizar.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-emerald-50 rounded-2xl flex-shrink-0 h-fit">
                    <UserCheck className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-neutral-900">Anfitrión Superhost</h4>
                    <p className="text-neutral-500 text-xs leading-relaxed">
                      Atención atenta, rápida y hospitalaria. Jorge se compromete a garantizar una estadía de 5 estrellas y ayudarte en todo momento durante tu viaje.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Copy */}
            <div className="space-y-4 border-b border-[#EFEBE4] pb-8">
              <h3 className="font-serif text-xl md:text-2xl text-neutral-900 font-semibold">Acerca de este alojamiento</h3>
              <div className="text-neutral-600 text-sm leading-relaxed space-y-4">
                <p>
                  Bienvenidos al corazón de Palermo, el barrio más vibrante y dinámico de Buenos Aires. Este moderno departamento a estrenar ha sido diseñado meticulosamente combinando estilo contemporáneo y confort funcional para que te sientas como en casa, ya sea que viajes por ocio, relax o negocios.
                </p>
                <p>
                  El espacio cuenta con un amplio living comedor con un Smart TV de 55 pulgadas, rincón bar de tragos y cristalería fina, y un dormitorio de relax con cama Queen de sábanas importadas de puro algodón egipcio de 600 hilos. La cocina se encuentra equipada con electrodomésticos de última generación (incluyendo freidora sin aceite/horno de convección, licuadora de vaso de vidrio, y cafetera con espumador de leche).
                </p>
                <p>
                  Durante tu estadía, tendrás acceso completo a las espectaculares instalaciones del edificio: una relajante piscina exterior en la terraza con solárium y duchas, parrilla (sujeta a reserva) y sala de eventos con vistas panorámicas increíbles del horizonte de la ciudad.
                </p>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-6 border-b border-[#EFEBE4] pb-8" id="amenidades">
              <h3 className="font-serif text-xl md:text-2xl text-neutral-900 font-semibold">Lo que ofrece este lugar</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm text-neutral-700">
                  <Wifi className="w-5 h-5 text-neutral-500" />
                  <span>Wi-Fi de Alta Velocidad (100 Mbps)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-700">
                  <Wind className="w-5 h-5 text-neutral-500" />
                  <span>Aire Acondicionado Split (Frío/Calor)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-700">
                  <Tv className="w-5 h-5 text-neutral-500" />
                  <span>Smart TV 55&quot; (Living) + Smart TV 42&quot; (Habitación)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-700">
                  <Coffee className="w-5 h-5 text-neutral-500" />
                  <span>Cocina completa con Cafetera de especialidad</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-700">
                  <Flame className="w-5 h-5 text-neutral-500" />
                  <span>Piscina exterior, Solárium y Parrilla en terraza</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-700">
                  <ShieldCheck className="w-5 h-5 text-[#5F6F52]" />
                  <span>Seguridad por cámaras en espacios comunes y Caja fuerte</span>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6 border-b border-[#EFEBE4] pb-8" id="resenas">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl md:text-2xl text-neutral-900 font-semibold">Reseñas de Huéspedes</h3>
                <span className="text-xs text-neutral-500 font-semibold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span><strong>4.9⭐</strong> promedio (82 reseñas)</span>
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
                      &quot;El departamento es un sueño. Impecable, decorado con un gusto exquisito y súper funcional para trabajar remoto. La pileta y la vista del rooftop son espectaculares. ¡Volvería sin dudarlo!&quot;
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-2.5 border-t border-neutral-100 mt-2">
                    <div className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-xs text-neutral-700">
                      MA
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-neutral-900">María Alejandra G.</h5>
                      <p className="text-[10px] text-neutral-400">Marzo 2026 · Huésped Verificado</p>
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
                      &quot;Jorge is an incredible host. The digital check-in guide was so clear, and the wine selection in the bar was a lovely touch. The location is perfect, close to everything in Palermo.&quot;
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-2.5 border-t border-neutral-100 mt-2">
                    <div className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-xs text-neutral-700">
                      JS
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-neutral-900">John S.</h5>
                      <p className="text-[10px] text-neutral-400">Febrero 2026 · Huésped Verificado</p>
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
                      &quot;Ubicación insuperable para ir al Movistar Arena. Muy seguro el edificio, check-in autónomo súper rápido y las sábanas de algodón egipcio son de otro mundo. Sin dudas de los mejores lugares en Palermo.&quot;
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-2.5 border-t border-neutral-100 mt-2">
                    <div className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-xs text-neutral-700">
                      FR
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-neutral-900">Francisco R.</h5>
                      <p className="text-[10px] text-neutral-400">Enero 2026 · Huésped Verificado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Inventory Section */}
            <div id="inventario">
              <InventoryList sheetUrl={googleSheetInventoryUrl} />
            </div>

            {/* Neighbourhood Map Section */}
            <div id="barrio" className="space-y-6">
              <NeighbourhoodMap sheetUrl={googleSheetPlacesUrl} />
              
              {/* Guía Gastronómica Curada */}
              <div className="bg-white border border-[#EFEBE4] rounded-3xl p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="font-serif text-xl md:text-2xl text-neutral-900 font-semibold flex items-center gap-2">
                    <span>🍳 Guía Gastronómica del Anfitrión</span>
                  </h3>
                  <p className="text-neutral-500 text-sm mt-1">
                    Palermo Hollywood está lleno de opciones, pero estas son las recomendaciones personales de Jorge para comer y trabajar como un local.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Breakfast/Brunch */}
                  <div className="bg-[#FAF9F7] border border-[#EFEBE4] rounded-2xl p-5 space-y-3 flex flex-col">
                    <div className="flex items-center gap-2 text-[#5F6F52] pb-2 border-b border-[#EFEBE4]/60">
                      <span className="text-lg">☕</span>
                      <h4 className="font-bold text-sm text-neutral-900">Café y Desayuno</h4>
                    </div>
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mt-1">Mis 5 favoritos a pie:</p>
                    <ul className="text-xs text-neutral-600 space-y-2 list-disc list-inside flex-grow">
                      <li><strong>Cuervo Café</strong> (Fitz Roy y Paraguay) - El mejor espresso y pastelería a 3 min.</li>
                      <li><strong>Atelier Fuerza</strong> - Famoso por su panadería de masa madre y facturas tradicionales.</li>
                      <li><strong>La Kitchen</strong> - Exquisitos scons y tartas en un ambiente súper relajante.</li>
                      <li><strong>Ninina</strong> (Holmberg) - Brunch muy completo y excelente pastelería artesanal.</li>
                      <li><strong>Soria Café</strong> - Mesas al aire libre, ideal para un roll de canela matutino.</li>
                    </ul>
                  </div>

                  {/* Best Parrilla */}
                  <div className="bg-[#FAF9F7] border border-[#EFEBE4] rounded-2xl p-5 space-y-3 flex flex-col">
                    <div className="flex items-center gap-2 text-[#5F6F52] pb-2 border-b border-[#EFEBE4]/60">
                      <span className="text-lg">🥩</span>
                      <h4 className="font-bold text-sm text-neutral-900">La Mejor Parrilla</h4>
                    </div>
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mt-1">Don Julio y alternativas:</p>
                    <ul className="text-xs text-neutral-600 space-y-2 list-disc list-inside flex-grow">
                      <li><strong>Don Julio</strong> (Guatemala y Gurruchaga) - Elegida entre las mejores del mundo. Reservar con meses de anticipación.</li>
                      <li><strong>La Cabrera</strong> - Excelente ojo de bife y sus famosas cazuelitas frías y calientes.</li>
                      <li><strong>Las Cabras</strong> (Fitz Roy) - Más informal, porciones abundantes y excelente relación precio-calidad a 2 min.</li>
                      <li><strong>Parrilla El Secretito</strong> - Un secreto de bodegón de barrio con porciones enormes.</li>
                    </ul>
                  </div>

                  {/* Remote Work Cafe */}
                  <div className="bg-[#FAF9F7] border border-[#EFEBE4] rounded-2xl p-5 space-y-3 flex flex-col">
                    <div className="flex items-center gap-2 text-[#5F6F52] pb-2 border-b border-[#EFEBE4]/60">
                      <span className="text-lg">💻</span>
                      <h4 className="font-bold text-sm text-neutral-900">Trabajo Remoto</h4>
                    </div>
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mt-1">WiFi rápido y enchufes:</p>
                    <ul className="text-xs text-neutral-600 space-y-2 list-disc list-inside flex-grow">
                      <li><strong>Café Registrado</strong> (Costa Rica) - Tuestan su propio café, tiene enchufes individuales y gran conexión.</li>
                      <li><strong>Libros del Pasaje</strong> - Café literario hermoso para leer o trabajar en un patio interno.</li>
                      <li><strong>Usina Cafetera</strong> - Mesas de trabajo cómodas, café de filtro y brunch.</li>
                      <li><strong>Coffee Town</strong> - Rincón tranquilo con gran variedad de granos de especialidad.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* House Rules / Norms */}
            <div className="space-y-6 bg-amber-50/15 border border-[#EFEBE4] rounded-3xl p-6 md:p-8" id="reglas">
              <h3 className="font-serif text-xl md:text-2xl text-neutral-900 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Normas de Convivencia</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs md:text-sm text-neutral-600">
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#5F6F52] rounded-full mt-2 flex-shrink-0" />
                  <p><strong>Check-In:</strong> A partir de las 15:00 hs. / <strong>Check-Out:</strong> Hasta las 11:00 hs.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#5F6F52] rounded-full mt-2 flex-shrink-0" />
                  <p>Prohibido fumar dentro del departamento y en pasillos comunes.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#5F6F52] rounded-full mt-2 flex-shrink-0" />
                  <p>No se admiten mascotas de ningún tipo en el departamento.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#5F6F52] rounded-full mt-2 flex-shrink-0" />
                  <p>Prohibido realizar fiestas, eventos o ruidos molestos.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#5F6F52] rounded-full mt-2 flex-shrink-0" />
                  <p>No se permite el acceso a invitados a la piscina o terraza del edificio.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#5F6F52] rounded-full mt-2 flex-shrink-0" />
                  <p>Obligatorio ducharse antes de ingresar a la piscina de la terraza.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Booking Widget (4/12 width) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6" id="reserva">
            <CalendarWidget />
            
            {/* Direct Booking Saving Card */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-5 text-xs text-emerald-800 space-y-2">
              <p className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>¿Por qué reservar directo?</span>
              </p>
              <p className="leading-relaxed">
                Reservando a través de nuestro sitio oficial vía WhatsApp ahorras hasta un 15% en tarifas de servicio e impuestos que cobran plataformas externas como Airbnb o Booking.com.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-950 text-white mt-16 py-12 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-1">
            <h4 className="font-serif text-base font-bold tracking-widest">CÓRDOBA 5579</h4>
            <p className="text-neutral-500 text-xs">Alquiler Temporal de Diseño · Palermo Hollywood, Buenos Aires</p>
          </div>
          
          <div className="text-xs text-neutral-500 text-center md:text-right space-y-1.5">
            <p>© {new Date().getFullYear()} Córdoba 5579. Todos los derechos reservados.</p>
            <p>
              Un proyecto alojado dentro de{" "}
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
            Preguntale al Concierge
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
                    <span>En línea · Respuesta instantánea</span>
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
                onClick={() => handleSendMessage("¿Dónde desayunar cerca?")}
                className="text-[10px] bg-[#FAF9F7] hover:bg-[#EFEBE4] text-neutral-600 border border-[#EFEBE4] px-2 py-1 rounded-full transition-all"
              >
                ☕ Desayunar cerca
              </button>
              <button 
                onClick={() => handleSendMessage("¿Cómo llegar a Ezeiza?")}
                className="text-[10px] bg-[#FAF9F7] hover:bg-[#EFEBE4] text-neutral-600 border border-[#EFEBE4] px-2 py-1 rounded-full transition-all"
              >
                ✈️ Llegar a Ezeiza
              </button>
              <button 
                onClick={() => handleSendMessage("¿Dónde comprar una SUBE?")}
                className="text-[10px] bg-[#FAF9F7] hover:bg-[#EFEBE4] text-neutral-600 border border-[#EFEBE4] px-2 py-1 rounded-full transition-all"
              >
                💳 Comprar SUBE
              </button>
              <button 
                onClick={() => handleSendMessage("¿Cómo usar la parrilla?")}
                className="text-[10px] bg-[#FAF9F7] hover:bg-[#EFEBE4] text-neutral-600 border border-[#EFEBE4] px-2 py-1 rounded-full transition-all"
              >
                🥩 Usar parrilla
              </button>
              <button 
                onClick={() => handleSendMessage("¿Cuál es la contraseña del WiFi?")}
                className="text-[10px] bg-[#FAF9F7] hover:bg-[#EFEBE4] text-neutral-600 border border-[#EFEBE4] px-2 py-1 rounded-full transition-all"
              >
                📶 Clave WiFi
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
                placeholder="Escribe tu consulta..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow bg-[#FAF9F7] border border-[#EFEBE4] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
              />
              <button
                type="submit"
                className="bg-[#5F6F52] hover:bg-[#4F5D43] text-white px-3 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Enviar
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

