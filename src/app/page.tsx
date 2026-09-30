"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  Compass, 
  Clock, 
  AlertTriangle,
  Menu,
  X,
  Utensils,
  UserCheck,
  ClipboardList,
  MessageCircle,
  Phone
} from "lucide-react";
import Link from "next/link";
import airbnbDetails from "../data/airbnb-details.json";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import HeroSection from "../components/HeroSection";
import AmenitiesGrid from "../components/AmenitiesGrid";
import FoodGuide from "../components/FoodGuide";
import FAQSection from "../components/FAQSection";
import Gallery from "../components/Gallery";
import CalendarWidget from "../components/CalendarWidget";
import NeighbourhoodMap from "../components/NeighbourhoodMap";
import StreetParkingGuide from "../components/StreetParkingGuide";
import SofaBedVideoGuide from "../components/SofaBedVideoGuide";
import InstallPrompt from "../components/InstallPrompt";
import { cordoba5579Knowledge } from "../data/conciergeKnowledge";

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

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "ai" | "user"; text: string }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [liveRating, setLiveRating] = useState<number>(airbnbDetails.rating || 5.0);
  const [liveReviewsCount, setLiveReviewsCount] = useState<number>(airbnbDetails.reviewsCount || 4);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/cordoba5579/api/airbnb-stats");
        if (res.ok) {
          const data = await res.json();
          if (data.rating) setLiveRating(data.rating);
          if (data.reviewsCount) setLiveReviewsCount(data.reviewsCount);
        }
      } catch {
        // Fallback
      }
    }
    fetchStats();
  }, []);

  const { t, language, setLanguage } = useLanguage();
  const { darkMode, toggleTheme } = useTheme();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentDetails = (airbnbDetails as any)[language] || (airbnbDetails as any).es || {};
  const hostsList = (currentDetails.hosts || []) as { name: string; role: string; profilePictureUrl?: string; isSuperhost?: boolean }[];
  const hostNames = hostsList.map((h) => h.name).join(" & ");



  const dynamicHostHeader = hostNames 
    ? (language === "es" 
        ? `Departamento entero · Anfitrión${hostsList.length > 1 ? "es" : ""}: ${hostNames}` 
        : `Entire Apartment · Host${hostsList.length > 1 ? "s" : ""}: ${hostNames}`)
    : t.hostHeader;

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rule = (cordoba5579Knowledge as any)[category];
      const matches = rule.keys.some((key: string) => q.includes(key));
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
      const res = await fetch("/cordoba5579/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, language }),
      });

      // Check if it's a JSON fallback response
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.fallback) {
          throw new Error("Gemini fallback");
        } else if (data.reply) {
          setMessages(prev => [...prev, { sender: "ai", text: data.reply }]);
          setIsTyping(false);
          return;
        }
      }

      if (!res.ok) throw new Error("API error");

      // Handle successful stream
      setIsTyping(false);
      
      // Initialize an empty AI message to be appended to
      setMessages(prev => [...prev, { sender: "ai", text: "" }]);
      
      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let streamedText = "";

      if (reader) {
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            streamedText += chunk;
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1].text = streamedText;
              return updated;
            });
          }
        }
      }
      return;
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

 

  // Optional: Replace this with your public Google Sheets CSV URL for map points
  const googleSheetPlacesUrl = ""; 

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-neutral-800 dark:text-neutral-200 bg-gradient-to-b from-[#F0EBE1] to-[#FAF9F7] dark:from-[#1A1D19] dark:to-[#141613] transition-colors duration-300">
      {/* Translucent Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#FAF9F7]/65 dark:bg-[#141613]/65 border-b border-[#EFEBE4]/50 dark:border-[#2C302A]/50 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 mr-6 lg:mr-10">
              <a href="#" className="font-serif text-lg md:text-xl font-bold tracking-widest text-neutral-900 dark:text-white whitespace-nowrap">
                CÓRDOBA 5579
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-5 xl:space-x-8 text-[11px] xl:text-xs font-semibold tracking-wider text-neutral-600 dark:text-neutral-300">
              <a href="#detalles" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap">{t.navDept}</a>
              <a href="#amenidades" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap">{t.navAmen}</a>
              <Link href="/inventario" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap">{t.navInve}</Link>
              <a href="#resenas" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap">{t.reviewsTitle.toUpperCase()}</a>
              <a href="#barrio" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap">{t.navBarr}</a>
              <a href="#reglas" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap">{t.navNorm}</a>
              <a href="#faq" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap">{t.navFaq}</a>
            </div>

            {/* Language Switcher and CTA Button */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-[#EFEBE4] dark:border-[#2C302A] text-neutral-600 dark:text-neutral-300 transition-all text-xs flex items-center justify-center shadow-sm"
                title={t.themeToggle}
              >
                {darkMode ? "☀️" : "🌙"}
              </button>

              <div className="flex items-center bg-neutral-200/50 rounded-lg p-0.5 border border-[#EFEBE4] text-[10px] font-bold">
                <button
                  onClick={() => setLanguage("es")}
                  className={`px-2 py-0.5 rounded transition-all ${language === "es" ? "bg-white text-[#5F6F52] shadow-sm" : "text-neutral-500 hover:text-neutral-900"}`}
                >
                  ES
                </button>
                <button
                  onClick={() => setLanguage("en")}
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
            <div className="lg:hidden flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-[#EFEBE4] dark:border-[#2C302A] text-neutral-600 dark:text-neutral-300 transition-all text-xs flex items-center justify-center shadow-sm"
                title={t.themeToggle}
              >
                {darkMode ? "☀️" : "🌙"}
              </button>

              {/* Language switcher for mobile */}
              <div className="flex items-center bg-neutral-200/50 rounded-lg p-0.5 border border-[#EFEBE4] text-[10px] font-bold">
                <button
                  onClick={() => setLanguage("es")}
                  className={`px-2 py-0.5 rounded transition-all ${language === "es" ? "bg-white text-[#5F6F52] shadow-sm" : "text-neutral-500"}`}
                >
                  ES
                </button>
                <button
                  onClick={() => setLanguage("en")}
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
            <Link 
              href="/inventario" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-600 hover:text-neutral-900"
            >
              {t.navInve}
            </Link>
            <a 
              href="#resenas" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-neutral-600 hover:text-neutral-900"
            >
              {t.reviewsTitle}
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
          <HeroSection />
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
             <div className="border-b border-[#EFEBE4] dark:border-[#2C302A] pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="space-y-2">
                 <h2 className="font-serif text-2xl md:text-3xl text-neutral-900 dark:text-white font-bold">
                   {dynamicHostHeader}
                 </h2>
                 <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
                   {t.hostDetails}
                 </p>
               </div>
               <div className="flex items-center -space-x-3 flex-shrink-0">
                 {hostsList.length > 0 ? (
                   hostsList.map((host, idx) => (
                     host.profilePictureUrl ? (
                       // eslint-disable-next-line @next/next/no-img-element
                       <img 
                         key={idx}
                         src={host.profilePictureUrl} 
                         alt={host.name}
                         className="w-12 h-12 rounded-full border-2 border-white dark:border-[#141613] object-cover shadow-sm"
                         title={`${host.name} (${host.role})`}
                       />
                     ) : (
                       <div 
                         key={idx}
                         className="w-12 h-12 bg-[#5F6F52] text-white flex items-center justify-center rounded-full text-sm font-bold font-serif border-2 border-white dark:border-[#141613] shadow-sm"
                         title={`${host.name} (${host.role})`}
                       >
                         {host.name.substring(0, 2).toUpperCase()}
                       </div>
                     )
                   ))
                 ) : (
                   <div className="w-12 h-12 bg-[#5F6F52] text-white flex items-center justify-center rounded-full text-base font-bold font-serif shadow-sm">
                     JO
                   </div>
                 )}
               </div>
             </div>

             {/* Highlights Section ("Por qué elegirnos") */}
             <div className="space-y-8 border-b border-[#EFEBE4] dark:border-[#2C302A] pb-10">
               <h3 className="font-serif text-2xl md:text-3xl text-neutral-900 dark:text-white font-bold">{t.whyTitle}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex gap-4 p-4 -m-4 rounded-3xl hover:bg-white dark:hover:bg-[#252824] hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-black/20 transition-all duration-300 group">
                  <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex-shrink-0 h-fit group-hover:scale-110 transition-transform duration-300">
                    <Compass className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">{t.whyLocTitle}</h4>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed">
                      {t.whyLocText}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 -m-4 rounded-3xl hover:bg-white dark:hover:bg-[#252824] hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-black/20 transition-all duration-300 group">
                  <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex-shrink-0 h-fit group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">{t.whyCheckTitle}</h4>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed">
                      {t.whyCheckText}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 -m-4 rounded-3xl hover:bg-white dark:hover:bg-[#252824] hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-black/20 transition-all duration-300 group">
                  <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex-shrink-0 h-fit group-hover:scale-110 transition-transform duration-300">
                    <Utensils className="w-5 h-5 text-[#5F6F52] dark:text-[#889B73]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">{t.whyWineTitle}</h4>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed">
                      {t.whyWineText}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 -m-4 rounded-3xl hover:bg-white dark:hover:bg-[#252824] hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-black/20 transition-all duration-300 group">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex-shrink-0 h-fit group-hover:scale-110 transition-transform duration-300">
                    <UserCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">{t.whyHostTitle}</h4>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed">
                      {t.whyHostText}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Copy */}
            <div className="space-y-6 border-b border-[#EFEBE4] dark:border-[#2C302A] pb-10">
              <h3 className="font-serif text-2xl md:text-3xl text-neutral-900 dark:text-white font-bold">{t.aboutTitle}</h3>
              <div className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed space-y-4 font-sans">
                {/* Only render summary description if detailed space information is not available */}
                {!currentDetails.space && (
                  currentDetails.description ? (
                    currentDetails.description.split("\n").filter((p: string) => p.trim()).map((p: string, i: number) => (
                      <p key={i}>{p}</p>
                    ))
                  ) : (
                    <>
                      <p>{t.aboutP1}</p>
                      <p>{t.aboutP2}</p>
                      <p>{t.aboutP3}</p>
                    </>
                  )
                )}
                
                {/* Space / El alojamiento details */}
                {currentDetails.space && (
                  <div className="space-y-3">
                    <h4 className="font-serif text-base text-neutral-800 dark:text-neutral-200 font-semibold">
                      {t.sectAlojamiento}
                    </h4>
                    {currentDetails.space.split("\n").filter((p: string) => p.trim()).map((p: string, i: number) => (
                      <p key={i} className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">{p}</p>
                    ))}
                  </div>
                )}

                {/* Guest Access / Acceso de los huéspedes */}
                {currentDetails.access && (
                  <div className="pt-5 mt-5 border-t border-[#EFEBE4] dark:border-[#2C302A] space-y-3">
                    <h4 className="font-serif text-base text-neutral-800 dark:text-neutral-200 font-semibold">
                      {t.sectAcceso}
                    </h4>
                    {currentDetails.access.split("\n").filter((p: string) => p.trim()).map((p: string, i: number) => (
                      <p key={i} className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">{p}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-8 border-b border-[#EFEBE4] dark:border-[#2C302A] pb-10" id="amenidades">
              <h3 className="font-serif text-2xl md:text-3xl text-neutral-900 dark:text-white font-bold">{t.amenitiesTitle}</h3>
              
              <AmenitiesGrid />
            </div>

            {/* Reviews Section */}
            <div className="space-y-6 border-b border-[#EFEBE4] pb-8" id="resenas">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl md:text-2xl text-neutral-900 font-semibold">{t.reviewsTitle}</h3>
                <span className="text-xs text-neutral-500 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span>
                    {liveRating && liveReviewsCount > 0 ? t.reviewSynced : t.reviewComingSoon}
                  </span>
                </span>
              </div>

              <div className="bg-white dark:bg-[#252824] border border-[#EFEBE4] dark:border-[#353A33] rounded-3xl p-6 md:p-8 shadow-sm space-y-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-300">
                <div className="space-y-3 max-w-xl">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-md">
                      {liveRating && liveReviewsCount > 0 
                        ? `★ ${liveRating.toFixed(1)} ${t.reviewExcellent}`
                        : t.reviewNew}
                    </span>
                  </div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
                    {liveRating && liveReviewsCount > 0 
                      ? t.reviewGuestRatings
                      : t.reviewsNewTitle}
                  </h4>
                  <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed">
                    {liveRating && liveReviewsCount > 0 
                      ? (language === "es" 
                          ? `Este alojamiento cuenta con una puntuación perfecta de ${liveRating.toFixed(1)} estrellas en base a ${liveReviewsCount} evaluaciones reales de la comunidad de Airbnb.`
                          : `This accommodation has a perfect score of ${liveRating.toFixed(1)} stars based on ${liveReviewsCount} real reviews from the Airbnb community.`)
                      : t.reviewsNewDesc}
                  </p>
                  <p className="text-[#5F6F52] dark:text-[#889B73] text-xs font-semibold">
                    ⭐ {liveRating && liveReviewsCount > 0 
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

              {/* Individual Review Cards */}
              {"reviews" in airbnbDetails && Array.isArray((airbnbDetails as { reviews: Array<{ author: string; date: string; rating: number; comment: string }> }).reviews) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {(airbnbDetails as { reviews: Array<{ author: string; date: string; rating: number; comment: string }> }).reviews.map((rev, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#252824] border border-[#EFEBE4] dark:border-[#353A33] rounded-2xl p-5 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#5F6F52] text-white flex items-center justify-center font-bold text-xs">
                            {rev.author.substring(0, 1)}
                          </div>
                          <div>
                            <h5 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">{rev.author}</h5>
                            <p className="text-[10px] text-neutral-400">{rev.date}</p>
                          </div>
                        </div>
                        <div className="flex text-amber-400 text-xs">
                          {"★".repeat(rev.rating)}
                        </div>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 italic leading-relaxed">
                        &quot;{rev.comment}&quot;
                      </p>
                    </div>
                  ))}
                </div>
              )}
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

            {/* Sofa Bed Video Guide */}
            <SofaBedVideoGuide />
          </div>

          {/* Right Column: Sticky Booking Widget (4/12 width) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6" id="reserva">
            <CalendarWidget lang={language} airbnbUrl="https://www.airbnb.com.ar/rooms/1716762976739155303" />
          </div>

        </div>
        </ScrollReveal>

        {/* Neighbourhood Map & Street Parking Section (Full Width 12/12) */}
        <ScrollReveal delay={0.05}>
        <div id="barrio" className="space-y-6">
          <NeighbourhoodMap sheetUrl={googleSheetPlacesUrl} lang={language} />
          
          <ScrollReveal delay={0.05}>
            <StreetParkingGuide />
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <FoodGuide />
          </ScrollReveal>
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
            {currentDetails.notes ? (
              currentDetails.notes.split("\n").filter((p: string) => p.trim()).map((p: string, i: number) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#5F6F52] rounded-full mt-2 flex-shrink-0" />
                  <p>{p}</p>
                </div>
              ))
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
        </ScrollReveal>

        {/* Accordion FAQ Section (Full Width 12/12) */}
        <ScrollReveal delay={0.05}>
          <FAQSection />
        </ScrollReveal>

        {/* Emergency Contacts Section */}
        <ScrollReveal delay={0.05}>
          <div className="bg-white dark:bg-[#252824] border border-[#EFEBE4] dark:border-[#353A33] rounded-3xl p-6 md:p-8 transition-colors duration-300 shadow-sm" id="emergencias">
            <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400 pb-4 border-b border-[#F5F2EB] dark:border-[#2C302A] mb-4">
              <Phone className="w-5 h-5 md:w-6 md:h-6" />
              <h3 className="font-serif text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100">{t.emergencyTitle}</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm font-sans">
              <a href="tel:911" className="flex items-center justify-between p-4 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl transition-all group">
                <div className="space-y-0.5">
                  <p className="font-bold text-red-700 dark:text-red-400 text-lg">911</p>
                  <p className="text-neutral-500 dark:text-neutral-450 text-xs">{t.emergency911Desc}</p>
                </div>
                <Phone className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform flex-shrink-0" />
              </a>

              <a href="tel:107" className="flex items-center justify-between p-4 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl transition-all group">
                <div className="space-y-0.5">
                  <p className="font-bold text-red-700 dark:text-red-400 text-lg">107</p>
                  <p className="text-neutral-500 dark:text-neutral-450 text-xs">{t.emergency107Desc}</p>
                </div>
                <Phone className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform flex-shrink-0" />
              </a>

              <a href="tel:100" className="flex items-center justify-between p-4 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl transition-all group">
                <div className="space-y-0.5">
                  <p className="font-bold text-red-700 dark:text-red-400 text-lg">100</p>
                  <p className="text-neutral-500 dark:text-neutral-450 text-xs">{t.emergency100Desc}</p>
                </div>
                <Phone className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform flex-shrink-0" />
              </a>

              <a href="tel:103" className="flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100/70 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-[#EFEBE4] dark:border-[#2C302A] rounded-2xl transition-all group">
                <div className="space-y-0.5">
                  <p className="font-bold text-neutral-700 dark:text-neutral-300 text-lg">103</p>
                  <p className="text-neutral-500 dark:text-neutral-450 text-xs">{t.emergency103Desc}</p>
                </div>
                <Phone className="w-4 h-4 text-neutral-500 dark:text-neutral-400 group-hover:scale-110 transition-transform flex-shrink-0" />
              </a>
            </div>
            
            <div className="mt-4">
              <a href="tel:+5491145379500" className="flex items-center justify-between p-4 bg-[#FAF9F7] hover:bg-[#F5F2EB] dark:bg-neutral-850 dark:hover:bg-neutral-800 border border-[#EFEBE4] dark:border-[#2C302A] rounded-2xl transition-all group">
                <div className="space-y-0.5">
                  <p className="font-bold text-neutral-800 dark:text-neutral-200">Jorge (Anfitrión / Host)</p>
                  <p className="text-[#5F6F52] dark:text-[#889B73] font-semibold text-xs">{t.emergencyHostDesc}</p>
                </div>
                <Phone className="w-5 h-5 text-[#5F6F52] dark:text-[#889B73] group-hover:scale-110 transition-transform flex-shrink-0" />
              </a>
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
          <div className="absolute bottom-16 right-0 w-[330px] sm:w-[380px] h-[450px] bg-white/95 dark:bg-[#1E211D]/95 backdrop-blur-xl border border-[#EFEBE4] dark:border-[#353A33] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn transition-colors duration-300">
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
                      ? "bg-[#5F6F52] text-white rounded-tr-none shadow-md" 
                      : "bg-white/90 dark:bg-[#141613]/80 backdrop-blur-md text-neutral-800 dark:text-neutral-200 border border-[#EFEBE4] dark:border-[#2C302A] rounded-tl-none transition-colors duration-300"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/90 dark:bg-[#141613]/80 backdrop-blur-md border border-[#EFEBE4] dark:border-[#2C302A] rounded-2xl rounded-tl-none p-3 text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1 shadow-sm transition-colors duration-300">
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}
            </div>

            {/* Predefined FAQs with dynamic sorting/filtering based on Buenos Aires time of day */}
            <div className="p-3 bg-white/50 dark:bg-[#252824]/50 border-t border-b border-[#EFEBE4] dark:border-[#353A33] flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto transition-colors duration-300 backdrop-blur-md">
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
                        { icon: "🍕", es: "¿Dónde pedir delivery?", en: "Where to order delivery?", labelEs: "Pedir Delivery", labelEn: "Order Delivery" },
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
              className="p-3 bg-white/80 dark:bg-[#1E211D]/80 flex gap-2 transition-colors duration-300 backdrop-blur-md"
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
