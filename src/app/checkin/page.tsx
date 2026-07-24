"use client";

import React, { useState } from "react";
import { Key, Wifi, Copy, Check, ShieldAlert, Clock, ArrowLeft, Phone, Moon, Sun, Download, FileText } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import wifiQr from "../../../public/wifi-qr.png";
import airbnbDetails from "../../data/airbnb-details.json";
import StreetParkingGuide from "../../components/StreetParkingGuide";
import SofaBedVideoGuide from "../../components/SofaBedVideoGuide";
import lockbox1 from "../../../public/img/lockbox1.jpg";
import lockbox2 from "../../../public/img/lockbox2.jpg";
import portero from "../../../public/img/portero.jpg";

// Dynamically import NeighbourhoodMap to avoid SSR errors
const NeighbourhoodMap = dynamic(() => import("../../components/NeighbourhoodMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] w-full bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-2xl flex items-center justify-center text-xs text-neutral-400 dark:text-neutral-500">
      Cargando Mapa...
    </div>
  )
});

export default function CheckInPortal() {
  const { t, language: lang, setLanguage } = useLanguage();
  const { darkMode, toggleTheme } = useTheme();
  const [copied, setCopied] = useState(false);
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



  const handleCopyPassword = () => {
    navigator.clipboard.writeText(wifiPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div className={`min-h-screen font-sans antialiased pb-12 transition-colors duration-300 ${
      darkMode ? "bg-[#141613] text-neutral-200" : "bg-[#FAF9F7] text-neutral-800"
    }`}>
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FAF9F7]/80 dark:bg-[#141613]/80 border-b border-[#EFEBE4] dark:border-[#2C302A] transition-all">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t.chk_back}</span>
          </Link>

          {/* Language and Theme Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title={t.themeToggle}
              className="p-1.5 rounded-xl bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-1.5 bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] p-1 rounded-xl">
              <button
                onClick={() => setLanguage("es")}
                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                  lang === "es"
                    ? "bg-[#5F6F52] text-white shadow-sm"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                  lang === "en"
                    ? "bg-[#5F6F52] text-white shadow-sm"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content header */}
      <div className="text-center space-y-4 mt-10 mb-6 px-4">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white leading-tight">
          {t.chk_title}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed max-w-lg mx-auto">
          {t.chk_subtitle}
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-10 space-y-8">
        {/* PDF Manual Download Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className={`border rounded-3xl p-5 shadow-sm transition-colors duration-300 ${
            darkMode ? "bg-[#1E211D] border-[#2C302A]" : "bg-white border-[#EFEBE4]"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#5F6F52]/10 border border-[#5F6F52]/20 text-[#5F6F52] dark:text-[#889B73] flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {lang === "en" ? "Official Print Manual (PDF)" : "Manual Completo de la Casa (PDF)"}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {lang === "en" 
                    ? "15-page editorial guest guide ready to print or save offline." 
                    : "Guía editorial de 15 páginas lista para imprimir o consultar offline."}
                </p>
              </div>
            </div>

            <a
              href="/cordoba5579/manual_cordoba5579.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="manual_cordoba5579.pdf"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#5F6F52] hover:bg-[#4F5D43] dark:bg-[#889B73] dark:hover:bg-[#778A62] text-white font-bold rounded-2xl text-xs shadow-md hover:shadow-lg transition-all active:scale-95 flex-shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{lang === "en" ? "Download PDF Manual" : "Descargar Manual PDF"}</span>
            </a>
          </div>
        </motion.div>

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
            <h2 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100">{t.chk_welcomeTitle}</h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {t.chk_welcomeText}
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
            <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">{t.chk_wifiTitle}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SSID */}
            <div className={`border rounded-2xl p-3.5 space-y-1 flex flex-col justify-center transition-colors duration-300 ${
              darkMode ? "bg-[#141613] border-[#2C302A]" : "bg-[#FAF9F7] border-[#EFEBE4]"
            }`}>
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase">{t.chk_wifiRed}</span>
              <p className="font-mono text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200">Cordoba5579_Guest</p>
            </div>
            
            {/* Password */}
            <div className={`border rounded-2xl p-3.5 flex flex-col justify-between gap-3 transition-colors duration-300 ${
              darkMode ? "bg-[#141613] border-[#2C302A]" : "bg-[#FAF9F7] border-[#EFEBE4]"
            }`}>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase">{t.chk_wifiPass}</span>
                <p className="font-mono text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200">{wifiPassword}</p>
              </div>
              <button
                onClick={handleCopyPassword}
                className="bg-white dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 hover:bg-neutral-50 text-[#5F6F52] border border-[#EFEBE4] dark:border-[#2C302A] py-1.5 px-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 text-xs font-semibold w-full"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">{t.chk_wifiCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-[10px]">{t.chk_wifiCopy}</span>
                  </>
                )}
              </button>
            </div>

            {/* QR Auto-Connect Container */}
            <div className={`border rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 transition-colors duration-300 ${
              darkMode ? "bg-[#141613] border-[#2C302A]" : "bg-[#FAF9F7] border-[#EFEBE4]"
            }`}>
              <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase text-center">{t.qrEscanear}</span>
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
            {t.chk_wifiNote}
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
            <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">{t.chk_manualTitle}</h3>
          </div>

          {/* Video Placeholder Card (Lazy Loading) */}
          <div className="w-full">
            {videoPlaying ? (
              <div className="bg-neutral-950 rounded-2xl overflow-hidden aspect-video border border-neutral-800 shadow-lg">
                <video
                  className="w-full h-full object-cover bg-black"
                  src="/cordoba5579/video/guia.mp4"
                  controls
                  autoPlay
                  playsInline
                />
              </div>
            ) : (
              <div 
                onClick={() => setVideoPlaying(true)}
                className="bg-neutral-950 rounded-2xl overflow-hidden aspect-video relative flex flex-col justify-end p-4 border border-neutral-800 group shadow-inner cursor-pointer bg-cover bg-center"
                style={{ backgroundImage: `url('/cordoba5579/video/guia-poster.jpg')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/40 to-transparent flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#5F6F52]/95 hover:bg-[#5F6F52] text-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 group-hover:scale-105">
                    <span className="text-2xl ml-1">▶</span>
                  </div>
                </div>
                <div className="z-10 text-white space-y-0.5 pointer-events-none">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">{t.chk_videoLabel}</span>
                  <h5 className="font-bold text-xs sm:text-sm">{t.chk_videoTitle}</h5>
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
                  <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">{t.chk_step1Title}</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {t.chk_step1Desc}
                  </p>
                </div>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=-34.587644,-58.439803"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#5F6F52] dark:text-emerald-400 hover:text-[#4F5D43] bg-[#FAF9F7] dark:bg-neutral-800 border border-[#EFEBE4] dark:border-[#2C302A] px-3 py-1.5 rounded-xl transition-all shadow-sm active:scale-95"
                >
                  📍 {t.chk_mapOpenBtn}
                </a>

                {/* Embedded Interactive Map */}
                <div className="mt-2">
                  <NeighbourhoodMap lang={lang} compact={true} />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#5F6F52] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-4 flex-grow">
                <div className="space-y-3">
                  <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">{t.chk_step2Title}</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {t.chk_step2Desc}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="relative aspect-[9/16] rounded-xl overflow-hidden border border-[#EFEBE4] dark:border-[#2C302A] shadow-sm">
                      <Image src={lockbox1} alt="Ubicación de la caja" fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                    </div>
                    <div className="relative aspect-[9/16] rounded-xl overflow-hidden border border-[#EFEBE4] dark:border-[#2C302A] shadow-sm">
                      <Image src={lockbox2} alt="Caja de seguridad negra" fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                    </div>
                  </div>
                </div>

                {/* Lockbox Interactive Widget Container */}
                <div className={`border rounded-2xl p-4 space-y-4 max-w-[280px] mx-auto transition-colors duration-300 ${
                  darkMode ? "bg-[#141613] border-[#2C302A]" : "bg-[#FAF9F7] border-[#EFEBE4]"
                }`}>
                  <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider text-center">
                    {t.chk_lockboxSimulatorTitle}
                  </p>

                  {/* Test Code Box */}
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-2.5 text-center space-y-1">
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                      {t.lockboxTestCode}
                    </span>
                    <span className="text-[9px] text-amber-700 dark:text-amber-500 leading-tight block">
                      {t.lockboxTestDesc}
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
                    {t.chk_lockboxInstruction}
                  </p>

                  <div className={`text-[10px] font-bold text-center py-1.5 rounded-xl border transition-all ${
                    isLockboxOpen 
                      ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50" 
                      : "bg-[#FAF9F7] dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border-[#EFEBE4] dark:border-[#2C302A]"
                  }`}>
                    {isLockboxOpen ? t.chk_lockboxUnlocked : t.chk_lockboxLocked}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#5F6F52] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-3 flex-grow">
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">{t.chk_step3Title}</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {t.chk_step3Desc}
                </p>
                <div className="relative w-[180px] aspect-square rounded-xl overflow-hidden border border-[#EFEBE4] dark:border-[#2C302A] shadow-sm">
                  <Image src={portero} alt="Lector de acceso magnético" fill className="object-cover" sizes="180px" />
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#5F6F52] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                4
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">{t.chk_step4Title}</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {t.chk_step4Desc}
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
            <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">{t.chk_rulesTitle}</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-600 dark:text-neutral-400">
            <div className={`flex items-start gap-2 p-3 rounded-xl border transition-colors duration-300 ${
              darkMode ? "bg-[#141613] border-[#2C302A]/50" : "bg-[#FAF9F7] border-[#EFEBE4]/50"
            }`}>
              <span className="text-lg">🚭</span>
              <p><strong>{t.chk_ruleSmoke}</strong> {t.chk_ruleSmokeText}</p>
            </div>
            <div className={`flex items-start gap-2 p-3 rounded-xl border transition-colors duration-300 ${
              darkMode ? "bg-[#141613] border-[#2C302A]/50" : "bg-[#FAF9F7] border-[#EFEBE4]/50"
            }`}>
              <span className="text-lg">🚫🐾</span>
              <p><strong>{t.chk_rulePets}</strong> {t.chk_rulePetsText}</p>
            </div>
            <div className={`flex items-start gap-2 p-3 rounded-xl border transition-colors duration-300 ${
              darkMode ? "bg-[#141613] border-[#2C302A]/50" : "bg-[#FAF9F7] border-[#EFEBE4]/50"
            }`}>
              <span className="text-lg">🤫</span>
              <p><strong>{t.chk_ruleSilence}</strong> {t.chk_ruleSilenceText}</p>
            </div>
            <div className={`flex items-start gap-2 p-3 rounded-xl border transition-colors duration-300 ${
              darkMode ? "bg-[#141613] border-[#2C302A]/50" : "bg-[#FAF9F7] border-[#EFEBE4]/50"
            }`}>
              <span className="text-lg">🏊</span>
              <p><strong>{t.chk_rulePool}</strong> {t.chk_rulePoolText}</p>
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
            <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">{t.chk_checkoutTitle}</h3>
          </div>
          
          <div className="space-y-3.5 text-xs text-neutral-600 dark:text-neutral-400">
            <p>{t.chk_checkoutIntro}</p>
            <ol className="space-y-2.5 list-decimal list-inside">
              <li>{t.chk_checkout1}</li>
              <li>{t.chk_checkout2}</li>
              <li>{t.chk_checkout3}</li>
            </ol>
            
            <div className={`mt-5 p-4 rounded-2xl border transition-colors duration-300 flex flex-col sm:flex-row items-center gap-5 ${
              darkMode ? "bg-[#141613] border-[#2C302A]" : "bg-[#FAF9F7] border-[#EFEBE4]"
            }`}>
              <div className="flex-1 space-y-3 w-full text-center sm:text-left">
                <p className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">Aviso de Salida Rápida</p>
                <p className="text-[11px] leading-relaxed">Si lo prefiere, presione el botón para enviar un mensaje automático por WhatsApp a Jorge confirmando que ha completado su check-out.</p>
                <a 
                  href="https://wa.me/5491145379500?text=Hola%20Jorge.%20Ya%20hicimos%20el%20check-out%20en%20C%C3%B3rdoba%205579.%20Las%20llaves%20est%C3%A1n%20en%20el%20buz%C3%B3n."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#5F6F52] hover:bg-[#4F5D43] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 w-full sm:w-auto"
                >
                  <Phone className="w-4 h-4" />
                  Avisar por WhatsApp
                </a>
              </div>
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">O Escanee</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&color=5F6F52&data=https%3A%2F%2Fwa.me%2F5491145379500%3Ftext%3DHola%2520Jorge.%2520Ya%2520hicimos%2520el%2520check-out%2520en%2520C%25C3%25B3rdoba%25205579.%2520Las%2520llaves%2520est%25C3%25A1n%2520en%2520el%2520buz%25C3%25B3n."
                  alt="QR WhatsApp Check-out"
                  className="w-20 h-20 bg-white p-1 rounded-lg border border-[#EFEBE4] dark:border-neutral-700"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sofa Bed Video Guide */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <SofaBedVideoGuide />
        </motion.div>

        {/* Street Parking Guide */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
        >
          <StreetParkingGuide />
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
            <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">{t.chk_emergencyTitle}</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <a href="tel:911" className="flex items-center justify-between p-3 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl transition-all group">
              <div className="space-y-0.5">
                <p className="font-bold text-red-700 dark:text-red-400">911</p>
                <p className="text-neutral-500 dark:text-neutral-450 text-[10px]">{t.chk_emergency911Desc}</p>
              </div>
              <Phone className="w-3.5 h-3.5 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
            </a>

            <a href="tel:107" className="flex items-center justify-between p-3 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl transition-all group">
              <div className="space-y-0.5">
                <p className="font-bold text-red-700 dark:text-red-400">107</p>
                <p className="text-neutral-500 dark:text-neutral-450 text-[10px]">{t.chk_emergency107Desc}</p>
              </div>
              <Phone className="w-3.5 h-3.5 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
            </a>

            <a href="tel:100" className="flex items-center justify-between p-3 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl transition-all group">
              <div className="space-y-0.5">
                <p className="font-bold text-red-700 dark:text-red-400">100</p>
                <p className="text-neutral-500 dark:text-neutral-450 text-[10px]">{t.chk_emergency100Desc}</p>
              </div>
              <Phone className="w-3.5 h-3.5 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
            </a>

            <a href="tel:103" className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100/70 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-[#EFEBE4] dark:border-[#2C302A] rounded-xl transition-all group">
              <div className="space-y-0.5">
                <p className="font-bold text-neutral-700 dark:text-neutral-300">103</p>
                <p className="text-neutral-500 dark:text-neutral-450 text-[10px]">{t.chk_emergency103Desc}</p>
              </div>
              <Phone className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 group-hover:scale-110 transition-transform" />
            </a>

            <a href="tel:+5491145379500" className="sm:col-span-2 flex items-center justify-between p-3.5 bg-[#FAF9F7] hover:bg-[#F5F2EB] dark:bg-neutral-850 dark:hover:bg-neutral-800 border border-[#EFEBE4] dark:border-[#2C302A] rounded-xl transition-all group">
              <div className="space-y-0.5">
                <p className="font-bold text-neutral-800 dark:text-neutral-200">{t.hostJorge}</p>
                <p className="text-[#5F6F52] dark:text-[#889B73] font-semibold text-[10px]">{t.chk_emergencyHostDesc}</p>
              </div>
              <Phone className="w-4 h-4 text-[#5F6F52] dark:text-[#889B73] group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
