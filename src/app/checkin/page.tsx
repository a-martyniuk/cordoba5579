"use client";

import React, { useState, useEffect } from "react";
import { Key, Wifi, Copy, Check, ShieldAlert, Clock, ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function CheckInPortal() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [copied, setCopied] = useState(false);
  const wifiPassword = "hola.cordoba";

  // Sync language with localStorage so it carries over from the landing page
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("language") as "es" | "en";
      if (savedLang === "es" || savedLang === "en") {
        setLang(savedLang);
      }
    }
  }, []);

  const handleLanguageChange = (newLang: "es" | "en") => {
    setLang(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLang);
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
      supportBtn: "Contactar Soporte (Jorge - WhatsApp)",
      supportMsg: "Hola Jorge! Estoy ingresando al departamento..."
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
      supportBtn: "Contact Support (Jorge - WhatsApp)",
      supportMsg: "Hi Jorge! I am checking into the apartment..."
    }
  }[lang];

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-800 font-sans antialiased pb-12">
      {/* Top Banner */}
      <div className="bg-[#5F6F52] text-white py-8 px-4 text-center relative shadow-md">
        <Link 
          href="/" 
          className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-white/90 hover:text-white font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{t.back}</span>
        </Link>
        
        {/* Language selector toggle */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center bg-white/10 rounded-lg p-0.5 border border-white/20 text-[10px] font-bold">
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

        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-xs sm:text-sm text-emerald-100 mt-1 font-medium">{t.subtitle}</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
        {/* Welcome Card */}
        <div className="bg-white border border-[#EFEBE4] rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#5F6F52]">
            <span className="text-xl">👋</span>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-neutral-900">{t.welcomeTitle}</h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {t.welcomeText}
          </p>
        </div>

        {/* WiFi Card */}
        <div className="bg-white border border-[#EFEBE4] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-[#5F6F52] pb-3 border-b border-[#F5F2EB]">
            <Wifi className="w-5 h-5" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900">{t.wifiTitle}</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#FAF9F7] border border-[#EFEBE4] rounded-2xl p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase">{t.wifiRed}</span>
              <p className="font-mono text-xs sm:text-sm font-bold text-neutral-800">Cordoba5579_5G</p>
            </div>
            
            <div className="bg-[#FAF9F7] border border-[#EFEBE4] rounded-2xl p-3.5 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">{t.wifiPass}</span>
                <p className="font-mono text-xs sm:text-sm font-bold text-neutral-800">{wifiPassword}</p>
              </div>
              <button
                onClick={handleCopyPassword}
                className="bg-white hover:bg-neutral-50 text-[#5F6F52] border border-[#EFEBE4] p-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95 text-xs font-semibold"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600 text-[10px]">{t.wifiCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-[10px]">{t.wifiCopy}</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="text-[11px] text-neutral-400 text-center leading-relaxed">
            {t.wifiNote}
          </p>
        </div>

        {/* Step-by-Step Entry Manual */}
        <div className="bg-white border border-[#EFEBE4] rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 text-[#5F6F52] pb-3 border-b border-[#F5F2EB]">
            <Key className="w-5 h-5" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900">{t.manualTitle}</h3>
          </div>

          {/* Video Placeholder Card */}
          <div className="bg-neutral-950 rounded-2xl overflow-hidden aspect-video relative flex flex-col justify-end p-4 border border-neutral-800 group shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/40 to-transparent flex items-center justify-center">
              <div className="w-16 h-16 bg-[#5F6F52]/90 hover:bg-[#5F6F52] text-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer">
                <span className="text-2xl ml-1">▶</span>
              </div>
            </div>
            <div className="z-10 text-white space-y-0.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">{t.videoLabel}</span>
              <h5 className="font-bold text-xs sm:text-sm">{t.videoTitle}</h5>
            </div>
          </div>

          {/* Steps list */}
          <div className="space-y-5">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#5F6F52] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900">{t.step1Title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {t.step1Desc}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#5F6F52] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900">{t.step2Title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {t.step2Desc}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#5F6F52] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900">{t.step3Title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
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
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900">{t.step4Title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {t.step4Desc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* House Rules & Norms */}
        <div className="bg-white border border-[#EFEBE4] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-[#5F6F52] pb-3 border-b border-[#F5F2EB]">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900">{t.rulesTitle}</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-600">
            <div className="flex items-start gap-2 bg-[#FAF9F7] p-3 rounded-xl border border-[#EFEBE4]/50">
              <span className="text-lg">🚭</span>
              <p><strong>{t.ruleSmoke}</strong> {t.ruleSmokeText}</p>
            </div>
            <div className="flex items-start gap-2 bg-[#FAF9F7] p-3 rounded-xl border border-[#EFEBE4]/50">
              <span className="text-lg">🚫🐾</span>
              <p><strong>{t.rulePets}</strong> {t.rulePetsText}</p>
            </div>
            <div className="flex items-start gap-2 bg-[#FAF9F7] p-3 rounded-xl border border-[#EFEBE4]/50">
              <span className="text-lg">🤫</span>
              <p><strong>{t.ruleSilence}</strong> {t.ruleSilenceText}</p>
            </div>
            <div className="flex items-start gap-2 bg-[#FAF9F7] p-3 rounded-xl border border-[#EFEBE4]/50">
              <span className="text-lg">🏊</span>
              <p><strong>{t.rulePool}</strong> {t.rulePoolText}</p>
            </div>
          </div>
        </div>

        {/* Check-Out Instructions */}
        <div className="bg-white border border-[#EFEBE4] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-[#5F6F52] pb-3 border-b border-[#F5F2EB]">
            <Clock className="w-5 h-5" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900">{t.checkoutTitle}</h3>
          </div>
          
          <div className="space-y-3.5 text-xs text-neutral-600">
            <p>{t.checkoutIntro}</p>
            <ol className="space-y-2.5 list-decimal list-inside">
              <li>{t.checkout1}</li>
              <li>{t.checkout2}</li>
              <li>{t.checkout3}</li>
            </ol>
          </div>
        </div>

        {/* Contact Support */}
        <a
          href={`https://wa.me/5491145379500?text=${encodeURIComponent(t.supportMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#5F6F52] hover:bg-[#4F5D43] text-white py-4 px-6 rounded-2xl font-semibold shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>{t.supportBtn}</span>
        </a>
      </div>
    </div>
  );
}
