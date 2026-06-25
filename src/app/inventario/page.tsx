"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import InventoryList from "../../components/InventoryList";

export default function InventarioPage() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const googleSheetInventoryUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlUx7LNTseRM1DhoYGmw-9ZfuWpobnDFF5pLt4AuIdMiLLVEqVN_54OTZm0YbMUTp3-iHsk6Dbx4YP/pub?output=csv";

  // Sync language with localStorage
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

  const t = {
    es: {
      back: "Volver al Inicio",
      title: "Córdoba 5579",
      subtitle: "Equipamiento e Inventario Detallado"
    },
    en: {
      back: "Back to Home",
      title: "Cordoba 5579",
      subtitle: "Detailed Equipment & Inventory"
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        <InventoryList sheetUrl={googleSheetInventoryUrl} lang={lang} />
      </div>
    </div>
  );
}
