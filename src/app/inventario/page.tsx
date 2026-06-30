"use client";

import React from "react";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import Link from "next/link";
import InventoryList from "../../components/InventoryList";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

export default function InventarioPage() {
  const { t, language: lang, setLanguage: handleLanguageChange } = useLanguage();
  const { darkMode, toggleTheme } = useTheme();
  const googleSheetInventoryUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlUx7LNTseRM1DhoYGmw-9ZfuWpobnDFF5pLt4AuIdMiLLVEqVN_54OTZm0YbMUTp3-iHsk6Dbx4YP/pub?output=csv";

  return (
    <div className="min-h-screen bg-[#FAF9F7] dark:bg-[#141613] text-neutral-800 dark:text-neutral-200 font-sans antialiased pb-12 transition-colors duration-300">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FAF9F7]/80 dark:bg-[#141613]/80 border-b border-[#EFEBE4] dark:border-[#2C302A] transition-all">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t.inv_back}</span>
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
                onClick={() => handleLanguageChange("es")}
                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                  lang === "es"
                    ? "bg-[#5F6F52] text-white shadow-sm"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => handleLanguageChange("en")}
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
      <div className="text-center space-y-2 mt-10 mb-8 px-4">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white leading-tight">
          {t.inv_title}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed max-w-lg mx-auto">
          {t.inv_subtitle}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        <InventoryList sheetUrl={googleSheetInventoryUrl} lang={lang} />
      </div>
    </div>
  );
}
