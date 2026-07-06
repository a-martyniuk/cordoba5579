"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Wine, Sparkles, ArrowLeft, Info, Moon, Sun } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { parseCSV } from "../../utils/csvParser";
import airbnbDetails from "../../data/airbnb-details.json";

interface CavaItem {
  categoria?: string;
  nombre?: string;
  descripcion?: string;
  origen?: string;
  cantidad?: number | string;
  precio_usd?: number | string;
}

export default function CavaPage() {
  const { t: currentT, language, setLanguage } = useLanguage();
  const { darkMode, toggleTheme } = useTheme();
  const [cavaItems, setCavaItems] = useState<CavaItem[]>(airbnbDetails.cava || []);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  useEffect(() => {
    async function loadLiveCava() {
      try {
        const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlUx7LNTseRM1DhoYGmw-9ZfuWpobnDFF5pLt4AuIdMiLLVEqVN_54OTZm0YbMUTp3-iHsk6Dbx4YP/pub?gid=286973474&output=csv";
        const response = await fetch(csvUrl, { cache: "no-store" });
        if (!response.ok) throw new Error("Network response was not ok");
        const csvText = await response.text();
        const parsedData = parseCSV(csvText);
        
        if (parsedData.length > 1) {
          const headers = parsedData[0].map(h => h.trim().toLowerCase());
          
          const items: CavaItem[] = parsedData.slice(1).map((row) => {
            const getVal = (colName: string, fallback: string = ""): string => {
              const idx = headers.indexOf(colName);
              return idx !== -1 && row[idx] !== undefined ? row[idx].trim() : fallback;
            };
            
            const qtyStr = getVal("cantidad");
            const priceStr = getVal("precio_usd");
            
            return {
              categoria: getVal("categoria"),
              nombre: getVal("nombre"),
              descripcion: getVal("descripcion"),
              cantidad: parseInt(qtyStr, 10) || qtyStr || 0,
              precio_usd: parseFloat(priceStr) || priceStr || 0,
              origen: getVal("origen")
            };
          });
          
          setCavaItems(items);
          setIsLive(true);
        }
      } catch (error) {
        console.error("Error loading live Cava menu, using fallback data:", error);
      }
    }
    
    loadLiveCava();
  }, []);

  // Group items by category
  const categories: { [key: string]: { title: string; icon: string; items: CavaItem[] } } = {
    tinto: { title: currentT.cavaCatRed, icon: "🍷", items: [] },
    blanco: { title: currentT.cavaCatWhite, icon: "🥂", items: [] },
    burbujas: { title: currentT.cavaCatSparkling, icon: "🍾", items: [] },
    clasico: { title: currentT.cavaCatCombo, icon: "🥃", items: [] },
    otros: { title: "Otros", icon: "🍺", items: [] }
  };

  cavaItems.forEach((item: CavaItem) => {
    const cat = (item.categoria || "").toLowerCase().trim();
    if (cat === "tinto") {
      categories.tinto.items.push(item);
    } else if (cat === "blanco") {
      categories.blanco.items.push(item);
    } else if (cat === "burbujas") {
      categories.burbujas.items.push(item);
    } else if (cat === "clasico") {
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
            <span>{currentT.cava_backBtn}</span>
          </Link>

          {/* Language and Theme Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title={currentT.themeToggle}
              className="p-1.5 rounded-xl bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-1.5 bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] p-1 rounded-xl">
              <button
                onClick={() => setLanguage("es")}
                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                  language === "es"
                    ? "bg-[#5F6F52] text-white shadow-sm"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLanguage("en")}
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
        </div>
      </header>

      {/* Main Menu content */}
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-10">
        
        {/* Header Hero */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 bg-[#5F6F52]/10 dark:bg-[#889B73]/10 text-[#5F6F52] dark:text-[#889B73] px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
              <Wine className="w-3.5 h-3.5" />
              <span>{currentT.cava_headerTag}</span>
            </div>
            {isLive && (
              <div className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 px-2.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Google Sheets En Vivo</span>
              </div>
            )}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white leading-tight pt-1">
            {currentT.cava_pageTitle}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed max-w-lg mx-auto">
            {currentT.cava_pageSubtitle}
          </p>
        </div>

        {/* How it works info card */}
        <div className="bg-emerald-50/40 dark:bg-emerald-950/5 border border-emerald-100 dark:border-emerald-950/20 rounded-3xl p-5 md:p-6 space-y-2.5 shadow-sm transition-all font-sans">
          <h3 className="font-bold text-sm text-emerald-800 dark:text-emerald-450 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700 dark:text-emerald-450" />
            <span>{currentT.cava_howItWorksTitle}</span>
          </h3>
          <p className="text-xs sm:text-sm text-emerald-700/90 dark:text-emerald-400/90 leading-relaxed font-light">
            {currentT.cava_howItWorksText}
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
                    {cat.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cat.items.map((item, idx) => {
                    const name = item.nombre || item.categoria || "";
                    const desc = item.descripcion || "";
                    const origen = item.origen || "";
                    const price = typeof item.precio_usd === "number"
                      ? item.precio_usd.toFixed(2)
                      : item.precio_usd || "0";
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
                            {origen && (
                              <span className="inline-block text-[10px] font-semibold tracking-wider uppercase text-[#5F6F52] dark:text-[#889B73] bg-[#5F6F52]/10 dark:bg-[#889B73]/10 px-2 py-0.5 rounded-full">
                                {origen}
                              </span>
                            )}
                            {desc && (
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light pt-0.5">
                                {desc}
                              </p>
                            )}
                          </div>
                          
                          {/* Stock Pill */}
                          <div className="flex items-center gap-1 text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                            <span>{currentT.cava_quantityLabel}</span>
                            <span className="font-bold text-neutral-600 dark:text-neutral-350 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                              {stock}
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex flex-col justify-center items-end flex-shrink-0">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                            {currentT.cava_priceLabel}
                          </span>
                          <span className="text-xl font-serif font-bold text-[#5F6F52] dark:text-[#889B73]">
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
              {currentT.cava_noItems}
            </div>
          )}
        </div>

        {/* Payment & Consumption Card */}
        <div className="bg-white dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] rounded-3xl p-6 md:p-8 space-y-6 shadow-sm transition-colors duration-300">
          <h4 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#5F6F52] dark:text-[#889B73]" />
            {currentT.cava_payment_title}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                  {currentT.cava_access_title}
                </h5>
                <p>
                  {currentT.cava_access_desc}
                </p>
              </div>
              <div>
                <h5 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                  {currentT.cava_refill_title}
                </h5>
                <p>
                  {currentT.cava_refill_desc}
                </p>
              </div>
            </div>
            
            <div className="bg-[#FAF9F7] dark:bg-[#141613] border border-[#EFEBE4] dark:border-[#2C302A] rounded-2xl p-5 space-y-3 shadow-sm">
              <h5 className="font-semibold text-neutral-850 dark:text-neutral-150 flex items-center gap-1.5 border-b border-[#EFEBE4]/60 dark:border-[#2C302A]/60 pb-2 mb-2">
                <span className="text-base">🏦</span>
                <span>Banco Santander</span>
              </h5>
              
              <div className="space-y-2.5 font-sans">
                <div className="flex justify-between items-center gap-2">
                  <div>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">Titular</span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">Martyniuk Jorge Orlando</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center gap-2">
                  <div>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">DNI</span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">13.671.433</span>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-2">
                  <div>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                      {language === "es" ? "Cuenta en Pesos / Dólares" : "Account in Pesos / USD"}
                    </span>
                    <span className="font-mono text-neutral-850 dark:text-neutral-250">533-005211/7</span>
                  </div>
                </div>

                <div className="border-t border-[#EFEBE4]/50 dark:border-[#2C302A]/50 pt-2 flex justify-between items-center gap-2">
                  <div className="flex-grow">
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">Alias</span>
                    <span className="font-mono text-neutral-850 dark:text-neutral-250 font-semibold select-all">ARENA.DIESEL.CUENCA</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard("ARENA.DIESEL.CUENCA", "alias")}
                    className="text-[10px] font-bold text-[#5F6F52] dark:text-[#889B73] hover:underline flex-shrink-0"
                  >
                    {copiedKey === "alias" ? currentT.cava_copied_msg : currentT.cava_copy_btn}
                  </button>
                </div>

                <div className="flex justify-between items-center gap-2">
                  <div className="flex-grow">
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">CBU</span>
                    <span className="font-mono text-xs text-neutral-850 dark:text-neutral-250 break-all select-all">0720533088000000521172</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard("0720533088000000521172", "cbu")}
                    className="text-[10px] font-bold text-[#5F6F52] dark:text-[#889B73] hover:underline flex-shrink-0"
                  >
                    {copiedKey === "cbu" ? currentT.cava_copied_msg : currentT.cava_copy_btn}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wine cellar guidelines block */}
        <div className="bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] rounded-3xl p-6 md:p-8 space-y-4 shadow-sm transition-colors duration-300">
          <h4 className="font-serif text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#5F6F52]" />
            {currentT.cava_cavaRulesTitle}
          </h4>
          <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400 font-light font-sans">
            {currentT.cava_rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#5F6F52] font-bold mt-0.5">✓</span>
                <p>{rule}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer footer */}
        <div className="text-center text-[10px] text-neutral-400 dark:text-neutral-500 font-medium pt-4 border-t border-[#EFEBE4] dark:border-[#2C302A]">
          {currentT.cava_disclaimer}
        </div>
      </main>
    </div>
  );
}
