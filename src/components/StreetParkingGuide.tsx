"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Car, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Info, 
  ShieldCheck, 
  Copy, 
  Check, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  MessageCircle,
  ExternalLink
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export interface StreetParkingRule {
  id: string;
  street: string;
  height: string;
  sideEs: string;
  sideEn: string;
  status: "allowed_24h" | "time_restricted" | "prohibited_24h";
  hoursEs: string;
  hoursEn: string;
  distanceEs: string;
  distanceEn: string;
  tipEs?: string;
  tipEn?: string;
  isRecommended?: boolean;
}

export const streetParkingData: StreetParkingRule[] = [
  {
    id: "fitzroy-1300",
    street: "Fitz Roy",
    height: "1301 - 1400",
    sideEs: "Ambos lados",
    sideEn: "Both sides",
    status: "allowed_24h",
    hoursEs: "Las 24 h del día",
    hoursEn: "24 hours a day",
    distanceEs: "a 50 m (1 min a pie)",
    distanceEn: "50 m away (1 min walk)",
    tipEs: "⭐️ Opción principal recomendada: calle súper segura a media cuadra del depto.",
    tipEn: "⭐️ Top recommended option: very safe street half a block from the apartment.",
    isRecommended: true,
  },
  {
    id: "fitzroy-1200",
    street: "Fitz Roy",
    height: "1201 - 1300",
    sideEs: "Ambos lados",
    sideEn: "Both sides",
    status: "allowed_24h",
    hoursEs: "Las 24 h del día",
    hoursEn: "24 hours a day",
    distanceEs: "a 150 m (2 min a pie)",
    distanceEn: "150 m away (2 min walk)",
    tipEs: "Excelente alternativa si la primera cuadra está llena.",
    tipEn: "Great alternative if the first block is full.",
  },
  {
    id: "humboldt-1300-right",
    street: "Humboldt",
    height: "1301 - 1400",
    sideEs: "Lado Derecho",
    sideEn: "Right Side",
    status: "allowed_24h",
    hoursEs: "Las 24 h del día",
    hoursEn: "24 hours a day",
    distanceEs: "a 100 m (2 min a pie)",
    distanceEn: "100 m away (2 min walk)",
    tipEs: "Estacionar únicamente sobre la mano derecha.",
    tipEn: "Park strictly on the right hand side.",
  },
  {
    id: "humboldt-1200-right",
    street: "Humboldt",
    height: "1201 - 1300",
    sideEs: "Lado Derecho",
    sideEn: "Right Side",
    status: "allowed_24h",
    hoursEs: "Las 24 h del día",
    hoursEn: "24 hours a day",
    distanceEs: "a 200 m (3 min a pie)",
    distanceEn: "200 m away (3 min walk)",
    tipEs: "Permitido 24 hs únicamente mano derecha.",
    tipEn: "Allowed 24h right hand side only.",
  },
  {
    id: "niceto-vega-5500",
    street: "Av. Niceto Vega",
    height: "5513 - 5600",
    sideEs: "Lado Derecho",
    sideEn: "Right Side",
    status: "allowed_24h",
    hoursEs: "Las 24 h del día",
    hoursEn: "24 hours a day",
    distanceEs: "a 150 m (2 min a pie)",
    distanceEn: "150 m away (2 min walk)",
    tipEs: "Avenida habilitada mano derecha 24 hs.",
    tipEn: "Avenue allowed right side 24h.",
  },
  {
    id: "castillo-1300",
    street: "Castillo",
    height: "1301 - 1400",
    sideEs: "Ambos lados",
    sideEn: "Both sides",
    status: "allowed_24h",
    hoursEs: "Las 24 h del día",
    hoursEn: "24 hours a day",
    distanceEs: "a 200 m (3 min a pie)",
    distanceEn: "200 m away (3 min walk)",
    tipEs: "Calle residencial muy tranquila detrás del depto.",
    tipEn: "Very quiet residential street behind the apartment.",
  },
  {
    id: "cordoba-5500-right",
    street: "Av. Córdoba (Frente Depto)",
    height: "5501 - 5600",
    sideEs: "Lado Derecho",
    sideEn: "Right Side",
    status: "time_restricted",
    hoursEs: "Prohibido Días Hábiles 7 a 21 hs / Permitido Noche (21 a 7 hs), Fines de semana y Feriados 24 hs",
    hoursEn: "Prohibited Weekdays 7 AM - 9 PM / Allowed Nights (9 PM - 7 AM), Weekends & Holidays 24h",
    distanceEs: "En la puerta del edificio",
    distanceEn: "In front of the building",
    tipEs: "⚠️ Atención: De día laborable te pueden multar. Úsalo solo para descargar valijas o de noche.",
    tipEn: "⚠️ Warning: Fines apply during weekday business hours. Use for unloading or overnight only.",
  },
  {
    id: "cordoba-5500-left",
    street: "Av. Córdoba (Mano Izquierda)",
    height: "5405 - 5700",
    sideEs: "Lado Izquierdo",
    sideEn: "Left Side",
    status: "prohibited_24h",
    hoursEs: "PROHIBIDO las 24 hs del día",
    hoursEn: "PROHIBITED 24 hours a day",
    distanceEs: "Frente al edificio",
    distanceEn: "In front of building",
    tipEs: "⛔ No estacionar nunca. Grúa y acarreo frecuente.",
    tipEn: "⛔ Never park here. Tow truck active.",
  },
  {
    id: "humboldt-left",
    street: "Humboldt (Mano Izquierda)",
    height: "1201 - 1400",
    sideEs: "Lado Izquierdo",
    sideEn: "Left Side",
    status: "prohibited_24h",
    hoursEs: "PROHIBIDO las 24 hs del día",
    hoursEn: "PROHIBITED 24 hours a day",
    distanceEs: "a 100 m",
    distanceEn: "100 m away",
    tipEs: "⛔ Solo está permitido sobre la mano derecha.",
    tipEn: "⛔ Only right side is allowed.",
  }
];

export default function StreetParkingGuide() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [activeFilter, setActiveFilter] = useState<"all" | "allowed_24h" | "time_restricted" | "prohibited_24h">("all");
  const [copied, setCopied] = useState(false);
  const [showGeneralRules, setShowGeneralRules] = useState(false);

  const filteredRules = streetParkingData.filter(rule => {
    if (activeFilter === "all") return true;
    return rule.status === activeFilter;
  });

  const handleCopySummary = () => {
    const summaryText = isEn
      ? `🚗 STREET PARKING GUIDE - CORDOBA 5579 (Official BOTI CABA Data)\n\n` +
        `✅ RECOMMENDED FREE 24H STREET PARKING:\n` +
        `• Fitz Roy St (1301-1400) - 50m away - Both sides (24h free)\n` +
        `• Fitz Roy St (1201-1300) - 150m away - Both sides (24h free)\n` +
        `• Humboldt St (1301-1400) - 100m away - RIGHT SIDE ONLY (24h free)\n` +
        `• Niceto Vega Ave (5513-5600) - 150m away - RIGHT SIDE ONLY (24h free)\n` +
        `• Castillo St (1301-1400) - 200m away - Both sides (24h free)\n\n` +
        `⚠️ RESTRICTED / NIGHT ONLY:\n` +
        `• Av. Córdoba 5500 (In front of depto) - RIGHT SIDE ONLY permitted overnight (9 PM to 7 AM) & weekends 24h. Prohibited Mon-Fri 7 AM to 9 PM.\n\n` +
        `⛔ NEVER PARK:\n` +
        `• Av. Córdoba LEFT SIDE (24h prohibited)\n` +
        `• Humboldt St LEFT SIDE (24h prohibited)\n\n` +
        `💡 Covered 24/7 Paid Garage: Av. Córdoba 5520 (just 50m away).`
      : `🚗 GUÍA DE ESTACIONAMIENTO EN LA CALLE - CÓRDOBA 5579 (Datos Oficiales BOTI CABA)\n\n` +
        `✅ DONDE ESTACIONAR GRATIS LAS 24 HS:\n` +
        `• Fitz Roy (del 1301 al 1400) - A 50m - Ambos lados (24 hs libre)\n` +
        `• Fitz Roy (del 1201 al 1300) - A 150m - Ambos lados (24 hs libre)\n` +
        `• Humboldt (del 1301 al 1400) - A 100m - LADO DERECHO ÚNICAMENTE (24 hs libre)\n` +
        `• Av. Niceto Vega (del 5513 al 5600) - A 150m - LADO DERECHO ÚNICAMENTE (24 hs libre)\n` +
        `• Castillo (del 1301 al 1400) - A 200m - Ambos lados (24 hs libre)\n\n` +
        `⚠️ PERMITIDO SOLO DE NOCHE Y FINES DE SEMANA:\n` +
        `• Av. Córdoba 5500 (Frente al depto) - LADO DERECHO permitido de noche (21 a 07 hs) y Fines de Semana / Feriados las 24 hs. Prohibido días hábiles de 7 a 21 hs.\n\n` +
        `⛔ PROHIBIDO 24 HS (GRÚA ACARREO):\n` +
        `• Av. Córdoba LADO IZQUIERDO (Prohibido 24 hs)\n` +
        `• Humboldt LADO IZQUIERDO (Prohibido 24 hs)\n\n` +
        `💡 Cochera Comercial Techada 24hs: Av. Córdoba 5520 (a solo 50m).`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div id="estacionamiento-calle" className="bg-[#FAF9F7] dark:bg-[#1C1F1B] border border-[#EFEBE4] dark:border-[#2C302A] rounded-3xl p-5 md:p-8 space-y-6 shadow-sm transition-colors duration-300">
      {/* Header with BOTI CABA badge */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#EFEBE4] dark:border-[#2C302A] pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isEn ? "Verified BOTI CABA Transit Code Data" : "Verificado Inteligencia BOTI CABA"}</span>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <Car className="w-7 h-7 text-[#5F6F52] dark:text-[#889B73]" />
            <span>{isEn ? "On-Street Parking Guide" : "Guía de Estacionamiento en la Calle"}</span>
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {isEn
              ? "Know exactly where you can park for free 24/7 on the streets surrounding Córdoba 5579 without risks."
              : "Conocé exactamente en qué calles podés estacionar gratis las 24 hs alrededor de Córdoba 5579 sin multas."}
          </p>
        </div>

        {/* Quick Copy Button */}
        <button
          onClick={handleCopySummary}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-[#252824] hover:bg-neutral-100 dark:hover:bg-[#2F342E] text-neutral-800 dark:text-neutral-200 border border-[#EFEBE4] dark:border-[#353A33] rounded-xl text-xs font-bold shadow-sm transition-all self-start md:self-auto flex-shrink-0"
          title={isEn ? "Copy text summary for WhatsApp/Airbnb message" : "Copiar resumen de texto para mensaje de WhatsApp/Airbnb"}
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-[#5F6F52] dark:text-[#889B73]" />}
          <span>{copied ? (isEn ? "Copied to Clipboard!" : "¡Copiado al Portapapeles!") : (isEn ? "Copy Summary for WhatsApp" : "Copiar Resumen WhatsApp")}</span>
        </button>
      </div>

      {/* Recommended Highlights Box */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/25 rounded-2xl p-4 md:p-5 relative overflow-hidden">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-neutral-900 dark:text-white">
                {isEn ? "Top Recommendation for Guests" : "Recomendación Principal para Huéspedes"}
              </span>
              <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                {isEn ? "Best Spot" : "Lugar Ideal"}
              </span>
            </div>
            <p className="text-xs md:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {isEn ? (
                <>
                  Park on <strong>Fitz Roy St (block 1301-1400)</strong>, just <strong>50 meters away</strong> (half a block). Free 24/7 parking is permitted on <strong>both sides of the street</strong>. Very safe, well-lit street!
                </>
              ) : (
                <>
                  Estacioná sobre <strong>calle Fitz Roy (altura 1301 - 1400)</strong>, a solo <strong>50 metros</strong> (media cuadra del departamento). Está permitido estacionar gratis las 24 hs en <strong>ambos lados de la calle</strong>. ¡Es la zona más cómoda, iluminada y segura!
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* BOTI WhatsApp Verification Card */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 md:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm md:text-base text-neutral-900 dark:text-white flex items-center gap-2">
                <span>{isEn ? "Real-Time BOTI WhatsApp Verification (CABA)" : "Verificación en Tiempo Real por WhatsApp con BOTI (CABA)"}</span>
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {isEn ? "Official City of Buenos Aires Chatbot (+54 9 11 5050-0147)" : "Bot oficial de la Ciudad de Buenos Aires (+54 9 11 5050-0147)"}
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/5491150500147"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl text-xs shadow-sm transition-all self-start sm:self-auto flex-shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{isEn ? "Ask Boti on WhatsApp" : "Consultar a BOTI por WhatsApp"}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="pt-2 border-t border-emerald-500/20 text-xs text-neutral-700 dark:text-neutral-300 space-y-1.5">
          <p className="font-semibold text-neutral-900 dark:text-white">
            {isEn ? "How to check any street block:" : "¿Cómo consultar una dirección específica?"}
          </p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {isEn ? (
              <>
                <li>Send a WhatsApp message to <strong>+54 9 11 5050-0147</strong> or click the button above.</li>
                <li>Type the exact address, for example: <em>&quot;Estacionamiento en Fitz Roy 1350&quot;</em> or <em>&quot;¿Puedo estacionar en Av. Córdoba 5550?&quot;</em>.</li>
                <li>The official City bot will reply immediately confirming if parking is allowed on that exact block!</li>
              </>
            ) : (
              <>
                <li>Enviá un mensaje a BOTI al <strong>+54 9 11 5050-0147</strong> (o hace clic en el botón superior).</li>
                <li>Escribile la dirección exacta, por ejemplo: <em>&quot;Estacionamiento en Fitz Roy 1350&quot;</em> o <em>&quot;¿Puedo estacionar en Av. Córdoba 5550?&quot;</em>.</li>
                <li>BOTI te responderá de forma automática e inmediata confirmando la norma oficial vigente para esa cuadra.</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { id: "all", labelEs: "Todas las Calles", labelEn: "All Streets", badge: "9" },
            { id: "allowed_24h", labelEs: "🟢 Permitido 24 hs", labelEn: "🟢 Free 24h", badge: "6" },
            { id: "time_restricted", labelEs: "⚠️ Con Horario", labelEn: "⚠️ Time Restricted", badge: "1" },
            { id: "prohibited_24h", labelEs: "🔴 Prohibido 24 hs", labelEn: "🔴 Prohibited 24h", badge: "2" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? "bg-[#5F6F52] text-white shadow-sm"
                  : "bg-white dark:bg-[#252824] text-neutral-700 dark:text-neutral-300 border border-[#EFEBE4] dark:border-[#353A33] hover:bg-neutral-100 dark:hover:bg-[#2F342E]"
              }`}
            >
              <span>{isEn ? tab.labelEn : tab.labelEs}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeFilter === tab.id ? "bg-white/20 text-white" : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
              }`}>
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowGeneralRules(!showGeneralRules)}
          className="text-xs font-bold text-[#5F6F52] dark:text-[#889B73] hover:underline flex items-center gap-1"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{isEn ? "General CABA Rules" : "Reglas Generales de CABA"}</span>
          {showGeneralRules ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Accordion: General CABA Rules */}
      <AnimatePresence>
        {showGeneralRules && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-[#252824] border border-[#EFEBE4] dark:border-[#353A33] rounded-2xl p-4 text-xs space-y-3">
              <h4 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-[#5F6F52] dark:text-[#889B73]" />
                <span>{isEn ? "Official CABA Transit Code Rules Summary" : "Resumen del Código de Tránsito de la Ciudad de Buenos Aires"}</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-neutral-600 dark:text-neutral-300">
                <div className="p-3 rounded-xl bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] space-y-1">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isEn ? "Streets (Calles)" : "Calles Comunes"}</span>
                  </div>
                  <p>{isEn ? "Parking allowed on both sides, 24h a day (unless a prohibition sign is present)." : "Podés estacionar de ambos lados las 24 hs del día (salvo que exista cartel de prohibido)."}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] space-y-1">
                  <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{isEn ? "Avenues (Avenidas)" : "Avenidas"}</span>
                  </div>
                  <p>{isEn ? "Weekdays: Right side allowed ONLY overnight (9 PM to 7 AM). Prohibited 7 AM to 9 PM. Weekends 24h free." : "Mano derecha: Prohibido días hábiles de 7 a 21 h. Permitido de 21 a 7 h y fines de semana/feriados 24 hs."}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] space-y-1">
                  <div className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    <span>{isEn ? "Always Prohibited" : "Siempre Prohibido"}</span>
                  </div>
                  <p>{isEn ? "Narrow alleys, bus/taxi stops, school & hospital fronts, disability ramps, private driveways." : "Pasajes angostos, paradas de colectivo/taxi, escuelas, hospitales, rampas y garajes privados."}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Street Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRules.map(rule => {
          const is24h = rule.status === "allowed_24h";
          const isRestricted = rule.status === "time_restricted";
          const isProhibited = rule.status === "prohibited_24h";

          return (
            <motion.div
              key={rule.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`relative bg-white dark:bg-[#252824] border rounded-2xl p-4 space-y-3 shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${
                rule.isRecommended 
                  ? "border-emerald-500/50 ring-2 ring-emerald-500/20" 
                  : is24h
                  ? "border-emerald-500/30"
                  : isRestricted
                  ? "border-amber-500/40"
                  : "border-rose-500/30 opacity-80 hover:opacity-100"
              }`}
            >
              {/* Badge & Distance */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                    is24h
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                      : isRestricted
                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                      : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30"
                  }`}>
                    {is24h && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                    {isRestricted && <Clock className="w-3 h-3 text-amber-500" />}
                    {isProhibited && <XCircle className="w-3 h-3 text-rose-500" />}
                    <span>
                      {is24h 
                        ? (isEn ? "Permitted 24h" : "Permitido 24 hs") 
                        : isRestricted 
                        ? (isEn ? "Time Restricted" : "Con Horario") 
                        : (isEn ? "Prohibited 24h" : "Prohibido 24 hs")}
                    </span>
                  </span>

                  <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#5F6F52]" />
                    <span>{isEn ? rule.distanceEn : rule.distanceEs}</span>
                  </span>
                </div>

                {/* Title & Height */}
                <div>
                  <h4 className="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <span>{rule.street}</span>
                  </h4>
                  <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    {isEn ? `Block ${rule.height}` : `Altura ${rule.height}`} • <span className="text-[#5F6F52] dark:text-[#889B73] font-bold">{isEn ? rule.sideEn : rule.sideEs}</span>
                  </p>
                </div>
              </div>

              {/* Hours & Tip */}
              <div className="space-y-2 pt-2 border-t border-[#EFEBE4] dark:border-[#353A33] text-xs">
                <div className="flex items-start gap-1.5 text-neutral-700 dark:text-neutral-300 font-medium">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0 mt-0.5" />
                  <span>{isEn ? rule.hoursEn : rule.hoursEs}</span>
                </div>

                {(rule.tipEs || rule.tipEn) && (
                  <p className={`p-2 rounded-xl text-[11px] leading-snug font-medium ${
                    rule.isRecommended
                      ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold"
                      : isProhibited
                      ? "bg-rose-500/10 text-rose-800 dark:text-rose-300"
                      : "bg-neutral-100 dark:bg-[#1E211D] text-neutral-600 dark:text-neutral-300"
                  }`}>
                    {isEn ? rule.tipEn : rule.tipEs}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer notice / Link to Paid Garages */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#EFEBE4] dark:border-[#2C302A] text-xs text-neutral-500 dark:text-neutral-400">
        <p className="flex items-center gap-1.5 text-center sm:text-left">
          <Info className="w-4 h-4 text-[#5F6F52] flex-shrink-0" />
          <span>
            {isEn
              ? "Prefer a covered private garage with 24/7 security? We have options just 50m away on Av. Córdoba 5520."
              : "¿Preferís dejarlo en una cochera privada techada con seguridad 24 hs? Disponés de opciones a solo 50m sobre Av. Córdoba 5520."}
          </span>
        </p>

        <a
          href="#barrio"
          className="inline-flex items-center gap-1 font-bold text-[#5F6F52] dark:text-[#889B73] hover:underline flex-shrink-0"
        >
          <span>{isEn ? "View Garages on Map" : "Ver Cocheras en el Mapa"}</span>
          <span>↓</span>
        </a>
      </div>
    </div>
  );
}
