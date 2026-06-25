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
  Wine
} from "lucide-react";
import Gallery from "../components/Gallery";
import CalendarWidget from "../components/CalendarWidget";
import InventoryList from "../components/InventoryList";
import NeighbourhoodMap from "../components/NeighbourhoodMap";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Optional: Replace this with your public Google Sheets CSV URL when ready
  const googleSheetInventoryUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlUx7LNTseRM1DhoYGmw-9ZfuWpobnDFF5pLt4AuIdMiLLVEqVN_54OTZm0YbMUTp3-iHsk6Dbx4YP/pub?output=csv"; 

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
        <div className="space-y-3">
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

            {/* Highlights Section */}
            <div className="space-y-6 border-b border-[#EFEBE4] pb-8">
              <div className="flex gap-4">
                <div className="p-3 bg-neutral-100 rounded-2xl flex-shrink-0 h-fit">
                  <Compass className="w-6 h-6 text-neutral-700" />
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
                  <Clock className="w-6 h-6 text-neutral-700" />
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
                  <Wine className="w-6 h-6 text-[#5F6F52]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-neutral-900">Cava de Vinos Privada</h4>
                  <p className="text-neutral-500 text-xs leading-relaxed">
                    Disfruta de una selección premium de vinos Malbec, Syrah, Torrontés y Champagne disponibles en el bar con costo extra. Solo reportas tu consumo al finalizar.
                  </p>
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

            {/* Dynamic Inventory Section */}
            <div id="inventario">
              <InventoryList sheetUrl={googleSheetInventoryUrl} />
            </div>

            {/* Neighbourhood Map Section */}
            <div id="barrio">
              <NeighbourhoodMap />
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
    </div>
  );
}

