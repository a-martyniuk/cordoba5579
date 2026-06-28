"use client";

import React, { useState, useEffect } from "react";
import { Key, Wifi, Copy, Check, ShieldAlert, Clock, ArrowLeft, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import wifiQr from "../../../public/wifi-qr.png";
import airbnbDetails from "../../data/airbnb-details.json";

// Dynamically import InteractiveMap to avoid SSR errors
const InteractiveMap = dynamic(() => import("../../components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] w-full bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-2xl flex items-center justify-center text-xs text-neutral-400 dark:text-neutral-500">
      Cargando Mapa...
    </div>
  )
});

export default function CheckInPortal() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const wifiPassword = "Welcome101";

  // Lockbox combination wheels states (4 digits)
  const [digit1, setDigit1] = useState(0);
  const [digit2, setDigit2] = useState(0);
  const [digit3, setDigit3] = useState(0);
  const [digit4, setDigit4] = useState(0);
  const [isLatchDown, setIsLatchDown] = useState(false);
  const [isLockboxOpen, setIsLockboxOpen] = useState(false);

  const correctCode = airbnbDetails.lockboxCode || "1579";

  // Sync state with localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("language") as "es" | "en";
      if (savedLang) setLang(savedLang);

      const savedDark = document.documentElement.classList.contains("dark");
      setDarkMode(savedDark);
    }
  }, []);

  const handleLanguageChange = (newLang: "es" | "en") => {
    setLang(newLang);
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

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(wifiPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const t = {
    es: {
      back: "Volver",
      title: "Córdoba 5579",
      subtitle: "Portal de Check-In Digital y Manual del Huésped",
      welcomeTitle: "¡Te damos la bienvenida!",
      welcomeText: "Hemos preparado esta guía personalizada para que tu ingreso sea autónomo, rápido y sin fricciones. Si tenés cualquier consulta, podés contactar a Jorge directamente por WhatsApp.",
      wifiTitle: "Conexión a Wi-Fi",
      wifiRed: "Red (SSID)",
      wifiPass: "Contraseña",
      wifiCopy: "Copiar",
      wifiCopied: "Copiado",
      wifiNote: "Las credenciales detalladas de conexión y el código QR de configuración rápida también se encuentran impresos en carteles enmarcados dentro del departamento.",
      manualTitle: "Manual de Ingreso Autónomo",
      videoLabel: "Video Guía",
      videoTitle: "Cómo ingresar al edificio y retirar las llaves",
      step1Title: "1. Llegada al Edificio",
      step1Desc: "Dirigite a la entrada principal en Av. Córdoba 5579. El ingreso cuenta con excelente iluminación y cámaras de seguridad las 24 hs.",
      step2Title: "2. Retiro de Llaves (Lockbox)",
      step2Desc: "A la derecha de la puerta de entrada exterior verás las cajas metálicas de seguridad. Ubicá la rotulada como \"Depto 101\". Ingresá el código de combinación que te indicamos previamente por mensaje de confirmación, deslizá la traba hacia abajo y retirá el juego de llaves.",
      step3Title: "3. Llavero Magnético en Entrada Exterior",
      step3Desc: "Aproximá el llavero magnético circular (azul o negro) al lector electromagnético del ingreso exterior para abrir la puerta de vidrio del hall. Dirigite a los ascensores o escaleras y subí al piso 1.",
      step4Title: "4. Acceso al Departamento 101",
      step4Desc: "El departamento es el 101 (piso 1). Introduce la llave física en la cerradura, girala dos vueltas a la izquierda ¡y bienvenido a tu departamento de diseño!",
      rulesTitle: "Normas Clave de Convivencia",
      ruleSmoke: "Prohibido fumar:",
      ruleSmokeText: "Multa estricta por fumar dentro del departamento o pasillos del edificio.",
      rulePets: "Sin mascotas:",
      rulePetsText: "No se admite el ingreso de mascotas en la propiedad en ningún caso.",
      ruleSilence: "Horas de silencio:",
      ruleSilenceText: "De 22:00 a 08:00 hs. Respetar el descanso de los vecinos del edificio.",
      rulePool: "Piscina en terraza:",
      rulePoolText: "Piso 9. Exclusivo huéspedes, ducha obligatoria previa. Cierre 20 hs.",
      checkoutTitle: "Instrucciones de Check-Out",
      checkoutIntro: "El horario límite de check-out es a las 11:00 hs. Te solicitamos:",
      checkout1: "Apagar luces y aires: Asegurate de apagar todos los aires acondicionados y luces.",
      checkout2: "Guardar llaves: Cerrá la puerta del departamento tirando firmemente y colocá las llaves de regreso en la misma caja de seguridad (lockbox) del ingreso exterior, desordenando la combinación al cerrarla.",
      checkout3: "Avisar por WhatsApp: Enviale un mensaje rápido a Jorge confirmando tu salida. ¡Buen viaje de regreso!",
      lockboxSimulatorTitle: "Simulador de Lockbox Interactivo",
      lockboxInstruction: `Desliza para elegir los números. Prueba la combinación demo '${correctCode}' y desliza la traba negra lateral hacia abajo. El código real del departamento te llegará por mensaje privado.`,
      lockboxLocked: `🔒 Cerrado - Prueba la clave demo '${correctCode}'`,
      lockboxUnlocked: "🔓 ¡Abierto! Retira tus llaves de prueba.",
      emergencyTitle: "Teléfonos de Emergencia",
      emergency911Desc: "Policía y Emergencias Generales",
      emergency107Desc: "SAME (Urgencias Médicas)",
      emergency100Desc: "Bomberos",
      emergency103Desc: "Defensa Civil",
      emergencyHostDesc: "Jorge (Anfitrión - Urgencias Depto)",
      mapOpenBtn: "Abrir Ubicación en Mapas ↗"
    },
    en: {
      back: "Back",
      title: "Cordoba 5579",
      subtitle: "Digital Check-In Portal & Guest Manual",
      welcomeTitle: "Welcome!",
      welcomeText: "We have prepared this personalized guide for a self-guided, quick, and smooth check-in. If you have any questions, you can contact Jorge directly via WhatsApp.",
      wifiTitle: "Wi-Fi Connection",
      wifiRed: "Network (SSID)",
      wifiPass: "Password",
      wifiCopy: "Copy",
      wifiCopied: "Copied",
      wifiNote: "Detailed connection credentials and a quick setup QR code are also printed on framed signs inside the apartment.",
      manualTitle: "Self-Check-In Manual",
      videoLabel: "Video Guide",
      videoTitle: "How to enter the building and retrieve the keys",
      step1Title: "1. Arrival at the Building",
      step1Desc: "Go to the main entrance at Av. Cordoba 5579. The entrance is well-lit and secured with security cameras 24/7.",
      step2Title: "2. Retrieve Keys (Lockbox)",
      step2Desc: "To the right of the outer entrance door, you will see the metal security lockboxes. Find the one labeled \"Depto 101\". Enter the combination code sent to you previously via confirmation message, slide the latch down, and retrieve the set of keys.",
      step3Title: "3. Magnetic Tag at Outer Entrance",
      step3Desc: "Hold the circular magnetic key tag (blue or black) close to the electromagnetic reader at the outer entrance to unlock the glass lobby door. Go to the elevators or stairs and go up to the 1st floor.",
      step4Title: "4. Access Apartment 101",
      step4Desc: "The apartment is 101 (1st floor). Insert the physical key into the lock, turn it twice to the left, and welcome to your design apartment!",
      rulesTitle: "Key House Rules",
      ruleSmoke: "No smoking:",
      ruleSmokeText: "Strict fee for smoking inside the apartment or building hallways.",
      rulePets: "No pets:",
      rulePetsText: "Pets are not allowed on the property under any circumstances.",
      ruleSilence: "Quiet hours:",
      ruleSilenceText: "From 10:00 PM to 8:00 AM. Please respect the rest of the neighbors.",
      rulePool: "Rooftop Pool:",
      rulePoolText: "9th floor. Guests only, shower required before entering. Closes at 8 PM.",
      checkoutTitle: "Check-Out Instructions",
      checkoutIntro: "Check-out time is strictly by 11:00 AM. We kindly request that you:",
      checkout1: "Turn off lights and AC: Make sure all air conditioning units and lights are turned off.",
      checkout2: "Return keys: Close the apartment door firmly behind you and return the keys to the same security lockbox at the outer entrance, scrambling the code wheels after closing it.",
      checkout3: "Notify via WhatsApp: Send a quick message to Jorge confirming your departure. Have a safe trip back!",
      lockboxSimulatorTitle: "Interactive Lockbox Simulator",
      lockboxInstruction: `Scroll to choose numbers. Try the demo combination '${correctCode}' and slide the black latch downwards. The real code will be sent privately.`,
      lockboxLocked: `🔒 Locked - Try demo code '${correctCode}'`,
      lockboxUnlocked: "🔓 Opened! Retrieve your test keys.",
      emergencyTitle: "Emergency Contacts",
      emergency911Desc: "Police & General Emergencies",
      emergency107Desc: "SAME (Medical Emergencies)",
      emergency100Desc: "Fire Department",
      emergency103Desc: "Civil Defense",
      emergencyHostDesc: "Jorge (Host - Apartment Urgencies)",
      mapOpenBtn: "Open Location in Maps ↗"
    }
  }[lang];

  return (
    <div className={`min-h-screen font-sans antialiased pb-12 transition-colors duration-300 ${
      darkMode ? "bg-[#141613] text-neutral-200" : "bg-[#FAF9F7] text-neutral-800"
    }`}>
      {/* Top Banner */}
      <div className="bg-[#5F6F52] text-white py-8 px-4 text-center relative shadow-md">
        <Link 
          href="/" 
          className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-white/90 hover:text-white font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{t.back}</span>
        </Link>
        
        {/* Language & Theme selector toggle */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2.5">
          {/* Theme Toggle */}
          <button
            onClick={() => handleThemeChange(!darkMode)}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white/90 hover:text-white transition-all text-xs flex items-center justify-center shadow-sm"
            title={lang === "es" ? "Cambiar Tema" : "Toggle Theme"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* Language Toggle */}
          <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/20 text-[10px] font-bold">
            <button
              onClick={() => handleLanguageChange("es")}
              className={`px-2.5 py-1 rounded transition-all ${lang === "es" ? "bg-white text-[#5F6F52]" : "text-white/80 hover:text-white"}`}
            >
              ES
            </button>
            <button
              onClick={() => handleLanguageChange("en")}
              className={`px-2.5 py-1 rounded transition-all ${lang === "en" ? "bg-white text-[#5F6F52]" : "text-white/80 hover:text-white"}`}
            >
              EN
            </button>
          </div>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-xs sm:text-sm text-emerald-100 mt-1 font-medium">{t.subtitle}</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
        {/* Welcome Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`border rounded-3xl p-6 shadow-sm space-y-3 transition-colors duration-300 ${
            darkMode ? "bg-[#1E211D] border-[#2C302A]" : "bg-white border-[#EFEBE4]"
          }`}
        >
          <div className="flex items-center gap-2 text-[#5F6F52] dark:text-[#889B73]">
            <span className="text-xl">👋</span>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100">{t.welcomeTitle}</h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {t.welcomeText}
          </p>
        </motion.div>

        {/* WiFi Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`border rounded-3xl p-6 shadow-sm space-y-4 transition-colors duration-300 ${
            darkMode ? "bg-[#1E211D] border-[#2C302A]" : "bg-white border-[#EFEBE4]"
          }`}
        >
          <div className="flex items-center gap-2.5 text-[#5F6F52] dark:text-[#889B73] pb-3 border-b border-[#F5F2EB] dark:border-[#2C302A]">
            <Wifi className="w-5 h-5" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">{t.wifiTitle}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SSID */}
            <div className={`border rounded-2xl p-3.5 space-y-1 flex flex-col justify-center transition-colors duration-300 ${
              darkMode ? "bg-[#141613] border-[#2C302A]" : "bg-[#FAF9F7] border-[#EFEBE4]"
            }`}>
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase">{t.wifiRed}</span>
              <p className="font-mono text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200">Cordoba5579_Guest</p>
            </div>
            
            {/* Password */}
            <div className={`border rounded-2xl p-3.5 flex flex-col justify-between gap-3 transition-colors duration-300 ${
              darkMode ? "bg-[#141613] border-[#2C302A]" : "bg-[#FAF9F7] border-[#EFEBE4]"
            }`}>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase">{t.wifiPass}</span>
                <p className="font-mono text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200">{wifiPassword}</p>
              </div>
              <button
                onClick={handleCopyPassword}
                className="bg-white dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 hover:bg-neutral-50 text-[#5F6F52] border border-[#EFEBE4] dark:border-[#2C302A] py-1.5 px-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 text-xs font-semibold w-full"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">{t.wifiCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-[10px]">{t.wifiCopy}</span>
                  </>
                )}
              </button>
            </div>

            {/* QR Auto-Connect Container */}
            <div className={`border rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 transition-colors duration-300 ${
              darkMode ? "bg-[#141613] border-[#2C302A]" : "bg-[#FAF9F7] border-[#EFEBE4]"
            }`}>
              <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase text-center">{lang === "es" ? "Escanear para conectar" : "Scan to connect"}</span>
              {/* Actual high-quality QR code image */}
              <Image 
                src={wifiQr} 
                alt="Wi-Fi QR Code" 
                width={96}
                height={96}
                className="bg-white p-1 rounded border border-[#EFEBE4] dark:border-neutral-700" 
              />
            </div>
          </div>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 text-center leading-relaxed">
            {t.wifiNote}
          </p>
        </motion.div>

        {/* Step-by-Step Entry Manual */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={`border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
            darkMode ? "bg-[#1E211D] border-[#2C302A]" : "bg-white border-[#EFEBE4]"
          }`}
        >
          <div className="flex items-center gap-2.5 text-[#5F6F52] dark:text-[#889B73] pb-3 border-b border-[#F5F2EB] dark:border-[#2C302A]">
            <Key className="w-5 h-5" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">{t.manualTitle}</h3>
          </div>

          {/* Video Placeholder Card (Lazy Loading) */}
          <div className="w-full">
            {videoPlaying ? (
              <div className="bg-neutral-950 rounded-2xl overflow-hidden aspect-video border border-neutral-800 shadow-lg">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Video Guide"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div 
                onClick={() => setVideoPlaying(true)}
                className="bg-neutral-950 rounded-2xl overflow-hidden aspect-video relative flex flex-col justify-end p-4 border border-neutral-800 group shadow-inner cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/40 to-transparent flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#5F6F52]/95 hover:bg-[#5F6F52] text-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 group-hover:scale-105">
                    <span className="text-2xl ml-1">▶</span>
                  </div>
                </div>
                <div className="z-10 text-white space-y-0.5 pointer-events-none">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">{t.videoLabel}</span>
                  <h5 className="font-bold text-xs sm:text-sm">{t.videoTitle}</h5>
                </div>
              </div>
            )}
          </div>

          {/* Steps list */}
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#5F6F52] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-3 flex-grow">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">{t.step1Title}</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {t.step1Desc}
                  </p>
                </div>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=-34.587644,-58.439803"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#5F6F52] dark:text-emerald-400 hover:text-[#4F5D43] bg-[#FAF9F7] dark:bg-neutral-800 border border-[#EFEBE4] dark:border-[#2C302A] px-3 py-1.5 rounded-xl transition-all shadow-sm active:scale-95"
                >
                  📍 {t.mapOpenBtn}
                </a>

                {/* Embedded Interactive Map */}
                <div className="mt-2">
                  <InteractiveMap lang={lang} darkMode={darkMode} />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#5F6F52] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-4 flex-grow">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">{t.step2Title}</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {t.step2Desc}
                  </p>
                </div>

                {/* Lockbox Interactive Widget Container */}
                <div className={`border rounded-2xl p-4 space-y-4 max-w-[280px] mx-auto transition-colors duration-300 ${
                  darkMode ? "bg-[#141613] border-[#2C302A]" : "bg-[#FAF9F7] border-[#EFEBE4]"
                }`}>
                  <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider text-center">
                    {t.lockboxSimulatorTitle}
                  </p>

                  {/* Test Code Box */}
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-2.5 text-center space-y-1">
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                      {lang === "es" ? `🔑 CÓDIGO DE PRUEBA: ${correctCode}` : `🔑 TEST CODE: ${correctCode}`}
                    </span>
                    <span className="text-[9px] text-amber-700 dark:text-amber-500 leading-tight block">
                      {lang === "es" 
                        ? "(El código real de ingreso se transmitirá por mensaje personal)" 
                        : "(The real access code will be sent via personal message)"}
                    </span>
                  </div>

                  {/* The Physical Lockbox Graphic */}
                  <div className="w-[180px] bg-[#C8C5BE] border-4 border-[#3D3A35] rounded-3xl p-4 mx-auto shadow-md flex flex-col items-center relative">
                    <div className="bg-[#2D2A26] w-full rounded-xl p-3 flex flex-col items-center space-y-3 shadow-inner">
                      
                      {/* Combination dials and latch panel */}
                      <div className="flex items-center justify-between w-full bg-[#4A4742] p-2.5 rounded-lg border border-[#3A3732] gap-1.5">
                        
                        {/* Latch trigger button */}
                        <button
                          type="button"
                          onClick={() => {
                            const enteredCode = `${digit1}${digit2}${digit3}${digit4}`;
                            const isCorrect = enteredCode === correctCode;
                            setIsLatchDown(!isLatchDown);
                            if (isCorrect) {
                              setIsLockboxOpen(!isLatchDown);
                            } else {
                              setIsLockboxOpen(false);
                            }
                          }}
                          className={`w-9 h-12 rounded bg-[#1C1A18] border border-neutral-700 flex flex-col justify-start p-0.5 active:bg-neutral-900 transition-all ${
                            isLatchDown ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div className="w-full h-5 bg-neutral-600 rounded-sm shadow-md border-t border-neutral-500 flex items-center justify-center text-[9px] text-neutral-200 font-bold select-none">
                            ▼
                          </div>
                        </button>

                        {/* Digits wheels */}
                        <div className="flex gap-1">
                          {[
                            { value: digit1, set: setDigit1 },
                            { value: digit2, set: setDigit2 },
                            { value: digit3, set: setDigit3 },
                            { value: digit4, set: setDigit4 }
                          ].map((wheel, wIdx) => (
                            <div key={wIdx} className="flex flex-col items-center w-5 bg-neutral-950 rounded border border-neutral-700 select-none">
                              {/* Arrow Up button */}
                              <button 
                                type="button"
                                onClick={() => {
                                  wheel.set((wheel.value + 1) % 10);
                                  setIsLatchDown(false);
                                  setIsLockboxOpen(false);
                                }}
                                className="text-[8px] text-neutral-400 hover:text-white leading-none p-0.5 w-full flex justify-center active:scale-110 font-bold"
                              >
                                ▲
                              </button>
                              
                              <span className="text-[11px] font-mono font-bold text-white text-center py-0.5 bg-neutral-900 w-full border-t border-b border-neutral-850">
                                {wheel.value}
                              </span>
                              
                              {/* Arrow Down button */}
                              <button 
                                type="button"
                                onClick={() => {
                                  wheel.set((wheel.value + 9) % 10);
                                  setIsLatchDown(false);
                                  setIsLockboxOpen(false);
                                }}
                                className="text-[8px] text-neutral-400 hover:text-white leading-none p-0.5 w-full flex justify-center active:scale-110 font-bold"
                              >
                                ▼
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Front key compartment lid */}
                    <div 
                      className={`w-[90%] bg-neutral-300 border-2 border-neutral-400 rounded-b-xl rounded-t-sm h-14 mt-2 flex items-center justify-center transition-all duration-500 origin-bottom shadow-inner ${
                        isLockboxOpen ? "transform rotateX-185 bg-neutral-200 border-neutral-300 opacity-60 pointer-events-none translate-y-2" : ""
                      }`}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {isLockboxOpen ? (
                        <motion.span 
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="text-xl font-bold"
                        >
                          🔑
                        </motion.span>
                      ) : (
                        <div className="w-8 h-2 bg-neutral-400 rounded-full border border-neutral-500/50" />
                      )}
                    </div>
                  </div>

                  <p className={`text-[10px] leading-normal text-center border p-2 rounded-xl transition-colors duration-300 ${
                    darkMode ? "bg-[#1E211D] border-[#2C302A] text-neutral-400" : "bg-white border-[#EFEBE4] text-neutral-500"
                  }`}>
                    {t.lockboxInstruction}
                  </p>

                  <div className={`text-[10px] font-bold text-center py-1.5 rounded-xl border transition-all ${
                    isLockboxOpen 
                      ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50" 
                      : "bg-[#FAF9F7] dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border-[#EFEBE4] dark:border-[#2C302A]"
                  }`}>
                    {isLockboxOpen ? t.lockboxUnlocked : t.lockboxLocked}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#5F6F52] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">{t.step3Title}</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {t.step3Desc}
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#5F6F52] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                4
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">{t.step4Title}</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {t.step4Desc}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* House Rules & Norms */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className={`border rounded-3xl p-6 shadow-sm space-y-4 transition-colors duration-300 ${
            darkMode ? "bg-[#1E211D] border-[#2C302A]" : "bg-white border-[#EFEBE4]"
          }`}
        >
          <div className="flex items-center gap-2.5 text-[#5F6F52] dark:text-[#889B73] pb-3 border-b border-[#F5F2EB] dark:border-[#2C302A]">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">{t.rulesTitle}</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-600 dark:text-neutral-400">
            <div className={`flex items-start gap-2 p-3 rounded-xl border transition-colors duration-300 ${
              darkMode ? "bg-[#141613] border-[#2C302A]/50" : "bg-[#FAF9F7] border-[#EFEBE4]/50"
            }`}>
              <span className="text-lg">🚭</span>
              <p><strong>{t.ruleSmoke}</strong> {t.ruleSmokeText}</p>
            </div>
            <div className={`flex items-start gap-2 p-3 rounded-xl border transition-colors duration-300 ${
              darkMode ? "bg-[#141613] border-[#2C302A]/50" : "bg-[#FAF9F7] border-[#EFEBE4]/50"
            }`}>
              <span className="text-lg">🚫🐾</span>
              <p><strong>{t.rulePets}</strong> {t.rulePetsText}</p>
            </div>
            <div className={`flex items-start gap-2 p-3 rounded-xl border transition-colors duration-300 ${
              darkMode ? "bg-[#141613] border-[#2C302A]/50" : "bg-[#FAF9F7] border-[#EFEBE4]/50"
            }`}>
              <span className="text-lg">🤫</span>
              <p><strong>{t.ruleSilence}</strong> {t.ruleSilenceText}</p>
            </div>
            <div className={`flex items-start gap-2 p-3 rounded-xl border transition-colors duration-300 ${
              darkMode ? "bg-[#141613] border-[#2C302A]/50" : "bg-[#FAF9F7] border-[#EFEBE4]/50"
            }`}>
              <span className="text-lg">🏊</span>
              <p><strong>{t.rulePool}</strong> {t.rulePoolText}</p>
            </div>
          </div>
        </motion.div>

        {/* Check-Out Instructions */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className={`border rounded-3xl p-6 shadow-sm space-y-4 transition-colors duration-300 ${
            darkMode ? "bg-[#1E211D] border-[#2C302A]" : "bg-white border-[#EFEBE4]"
          }`}
        >
          <div className="flex items-center gap-2.5 text-[#5F6F52] dark:text-[#889B73] pb-3 border-b border-[#F5F2EB] dark:border-[#2C302A]">
            <Clock className="w-5 h-5" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">{t.checkoutTitle}</h3>
          </div>
          
          <div className="space-y-3.5 text-xs text-neutral-600 dark:text-neutral-400">
            <p>{t.checkoutIntro}</p>
            <ol className="space-y-2.5 list-decimal list-inside">
              <li>{t.checkout1}</li>
              <li>{t.checkout2}</li>
              <li>{t.checkout3}</li>
            </ol>
          </div>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className={`border rounded-3xl p-6 shadow-sm space-y-4 transition-colors duration-300 ${
            darkMode ? "bg-[#1E211D] border-[#2C302A]" : "bg-white border-[#EFEBE4]"
          }`}
        >
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400 pb-3 border-b border-[#F5F2EB] dark:border-[#2C302A]">
            <Phone className="w-5 h-5" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">{t.emergencyTitle}</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <a href="tel:911" className="flex items-center justify-between p-3 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl transition-all group">
              <div className="space-y-0.5">
                <p className="font-bold text-red-700 dark:text-red-400">911</p>
                <p className="text-neutral-500 dark:text-neutral-450 text-[10px]">{t.emergency911Desc}</p>
              </div>
              <Phone className="w-3.5 h-3.5 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
            </a>

            <a href="tel:107" className="flex items-center justify-between p-3 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl transition-all group">
              <div className="space-y-0.5">
                <p className="font-bold text-red-700 dark:text-red-400">107</p>
                <p className="text-neutral-500 dark:text-neutral-450 text-[10px]">{t.emergency107Desc}</p>
              </div>
              <Phone className="w-3.5 h-3.5 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
            </a>

            <a href="tel:100" className="flex items-center justify-between p-3 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl transition-all group">
              <div className="space-y-0.5">
                <p className="font-bold text-red-700 dark:text-red-400">100</p>
                <p className="text-neutral-500 dark:text-neutral-450 text-[10px]">{t.emergency100Desc}</p>
              </div>
              <Phone className="w-3.5 h-3.5 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
            </a>

            <a href="tel:103" className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100/70 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-[#EFEBE4] dark:border-[#2C302A] rounded-xl transition-all group">
              <div className="space-y-0.5">
                <p className="font-bold text-neutral-700 dark:text-neutral-300">103</p>
                <p className="text-neutral-500 dark:text-neutral-450 text-[10px]">{t.emergency103Desc}</p>
              </div>
              <Phone className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 group-hover:scale-110 transition-transform" />
            </a>

            <a href="tel:+5491145379500" className="sm:col-span-2 flex items-center justify-between p-3.5 bg-[#FAF9F7] hover:bg-[#F5F2EB] dark:bg-neutral-850 dark:hover:bg-neutral-800 border border-[#EFEBE4] dark:border-[#2C302A] rounded-xl transition-all group">
              <div className="space-y-0.5">
                <p className="font-bold text-neutral-800 dark:text-neutral-200">Jorge (Anfitrión / Host)</p>
                <p className="text-[#5F6F52] dark:text-[#889B73] font-semibold text-[10px]">{t.emergencyHostDesc}</p>
              </div>
              <Phone className="w-4 h-4 text-[#5F6F52] dark:text-[#889B73] group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
