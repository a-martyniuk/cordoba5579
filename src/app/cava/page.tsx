"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Wine, Sparkles, ArrowLeft, Info } from "lucide-react";
import airbnbDetails from "../../data/airbnb-details.json";

interface CavaItem {
  categoria?: string;
  nombre?: string;
  descripcion?: string;
  cantidad?: number | string;
  precio_usd?: number | string;
}

export default function CavaPage() {
  const [language, setLanguage] = useState<"es" | "en">("es");

  // Sync language selection and theme with localStorage
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

  const cavaItems = airbnbDetails.cava || [];

  const t = {
    es: {
      pageTitle: "Cava de Vinos & Minibar",
      pageSubtitle: "Selección premium para disfrutar durante tu estadía en Córdoba 5579.",
      backBtn: "Volver al Inicio",
      headerTag: "Cava & Minibar (Costo Adicional)",
      howItWorksTitle: "¿Cómo funciona?",
      howItWorksText: "Disfrutá libremente de los vinos y bebidas disponibles. Al momento de tu check-out, simplemente informale a Jorge qué consumiste para coordinar el cobro.",
      disclaimer: "Los precios están expresados en dólares estadounidenses (USD). Se abonan al finalizar la estadía.",
      quantityLabel: "Disponibles en unidad: ",
      priceLabel: "Precio",
      noItems: "No hay productos configurados en la cava actualmente.",
      rules: [
        "Cristalería fina disponible en el rincón bar del living.",
        "Por favor, mantén refrigerados los blancos y burbujas antes de consumir.",
        "Consumo exclusivo para mayores de 18 años."
      ],
      cavaRulesTitle: "Normas de la Cava",
    },
    en: {
      pageTitle: "Wine Cellar & Minibar",
      pageSubtitle: "Premium selection to enjoy during your stay at Córdoba 5579.",
      backBtn: "Back to Home",
      headerTag: "Wine Cellar & Minibar (Extra Cost)",
      howItWorksTitle: "How it works?",
      howItWorksText: "Enjoy the available wines and drinks freely. At checkout, simply let Jorge know what you consumed to coordinate payment.",
      disclaimer: "Prices are in US Dollars (USD). Paid upon checkout.",
      quantityLabel: "Available in unit: ",
      priceLabel: "Price",
      noItems: "There are currently no products configured in the cellar.",
      rules: [
        "Fine glassware is available at the bar corner in the living room.",
        "Please keep white wines and sparkling drinks chilled before consuming.",
        "Consumption exclusive for guests aged 18 and older."
      ],
      cavaRulesTitle: "Wine Cellar Rules",
    }
  };

  const currentT = t[language];

  // Group items by category
  const categories: { [key: string]: { titleEs: string; titleEn: string; icon: string; items: CavaItem[] } } = {
    tinto: { titleEs: "Vino Tinto", titleEn: "Red Wine", icon: "🍷", items: [] },
    blanco: { titleEs: "Vino Blanco", titleEn: "White Wine", icon: "🥂", items: [] },
    burbujas: { titleEs: "Burbujas & Espumantes", titleEn: "Sparkling & Champagne", icon: "🍾", items: [] },
    clasico: { titleEs: "Tragos & Clásicos", titleEn: "Drinks & Classics", icon: "🥃", items: [] },
    otros: { titleEs: "Otros", titleEn: "Others", icon: "🍺", items: [] }
  };

  cavaItems.forEach((item: CavaItem) => {
    const name = item.categoria || item.nombre || "";
    const lower = name.toLowerCase();
    
    if (lower.includes("tinto") || lower.includes("red")) {
      categories.tinto.items.push(item);
    } else if (lower.includes("blanco") || lower.includes("white") || lower.includes("torrontes") || lower.includes("torrontés")) {
      categories.blanco.items.push(item);
    } else if (lower.includes("champagne") || lower.includes("espumante") || lower.includes("sparkling") || lower.includes("demi sec") || lower.includes("burbuja")) {
      categories.burbujas.items.push(item);
    } else if (lower.includes("fernet") || lower.includes("coca") || lower.includes("classic") || lower.includes("trago")) {
      categories.clasico.items.push(item);
    } else {
      categories.otros.items.push(item);
    }
  });

  const activeCategories = Object.entries(categories).filter(([, cat]) => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-[#FAF9F7] dark:bg-[#141613] text-neutral-800 dark:text-neutral-200 transition-colors duration-300">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FAF9F7]/80 dark:bg-[#141613]/80 border-b border-[#EFEBE4] dark:border-[#2C302A] transition-all">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentT.backBtn}</span>
          </Link>

          {/* Language Switcher */}
          <div className="flex items-center gap-1.5 bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] p-1 rounded-xl">
            <button
              onClick={() => handleLanguageChange("es")}
              className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                language === "es"
                  ? "bg-[#5F6F52] text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
              }`}
            >
              ES
            </button>
            <button
              onClick={() => handleLanguageChange("en")}
              className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                language === "en"
                  ? "bg-[#5F6F52] text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* Main Menu content */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        
        {/* Header Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#5F6F52]/10 dark:bg-[#889B73]/10 text-[#5F6F52] dark:text-[#889B73] px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
            <Wine className="w-3.5 h-3.5" />
            <span>{currentT.headerTag}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white leading-tight pt-1">
            {currentT.pageTitle}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed max-w-lg mx-auto">
            {currentT.pageSubtitle}
          </p>
        </div>

        {/* How it works info card */}
        <div className="bg-emerald-50/40 dark:bg-emerald-950/5 border border-emerald-100 dark:border-emerald-950/20 rounded-3xl p-5 md:p-6 space-y-2.5 shadow-sm transition-all font-sans">
          <h3 className="font-bold text-sm text-emerald-800 dark:text-emerald-450 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700 dark:text-emerald-450" />
            <span>{currentT.howItWorksTitle}</span>
          </h3>
          <p className="text-xs sm:text-sm text-emerald-700/90 dark:text-emerald-400/90 leading-relaxed font-light">
            {currentT.howItWorksText}
          </p>
        </div>

        {/* Wine Catalog Grouped */}
        <div className="space-y-8">
          {activeCategories.length > 0 ? (
            activeCategories.map(([key, cat]) => (
              <div key={key} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-[#EFEBE4] dark:border-[#2C302A] pb-2">
                  <span className="text-xl">{cat.icon}</span>
                  <h2 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    {language === "es" ? cat.titleEs : cat.titleEn}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cat.items.map((item, idx) => {
                    const name = item.categoria || item.nombre || "";
                    const desc = item.descripcion || "";
                    const price = item.precio_usd || 0;
                    const stock = item.cantidad || 0;

                    return (
                      <div 
                        key={idx} 
                        className="bg-white dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] p-5 rounded-2xl flex justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="space-y-2 flex flex-col justify-between flex-grow">
                          <div className="space-y-1">
                            <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 leading-tight">
                              {name}
                            </h3>
                            {desc && (
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                                {desc}
                              </p>
                            )}
                          </div>
                          
                          {/* Stock Pill */}
                          <div className="flex items-center gap-1 text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                            <span>{currentT.quantityLabel}</span>
                            <span className="font-bold text-neutral-600 dark:text-neutral-350 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                              {stock}
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex flex-col justify-center items-end flex-shrink-0">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                            {currentT.priceLabel}
                          </span>
                          <span className="text-lg font-serif font-bold text-[#5F6F52] dark:text-[#889B73]">
                            USD {price}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-sm text-neutral-400">
              {currentT.noItems}
            </div>
          )}
        </div>

        {/* Wine cellar guidelines block */}
        <div className="bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] rounded-3xl p-6 md:p-8 space-y-4 shadow-sm transition-colors duration-300">
          <h4 className="font-serif text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#5F6F52]" />
            {currentT.cavaRulesTitle}
          </h4>
          <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400 font-light font-sans">
            {currentT.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#5F6F52] font-bold mt-0.5">✓</span>
                <p>{rule}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer footer */}
        <div className="text-center text-[10px] text-neutral-400 dark:text-neutral-500 font-medium pt-4 border-t border-[#EFEBE4] dark:border-[#2C302A]">
          {currentT.disclaimer}
        </div>
      </main>
    </div>
  );
}
