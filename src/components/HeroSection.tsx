"use client";

import React from "react";
import { Star, Users, UserCheck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto py-10">
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-[#5F6F52] dark:text-[#889B73] tracking-wide">
        <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm border border-emerald-100 dark:border-emerald-800/50">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{t.tagNew}</span>
        </span>
        <span className="dark:text-neutral-300 opacity-80">•</span>
        <span className="dark:text-neutral-300">{t.tagLocation}</span>
        <span className="dark:text-neutral-300 opacity-80">•</span>
        <span className="dark:text-neutral-300">{t.tagArena}</span>
      </div>
      
      <h1 className="font-serif text-4xl md:text-6xl text-neutral-900 dark:text-white font-extrabold tracking-tight leading-[1.15]">
        {t.heroTitle}
      </h1>
      
      <p className="text-neutral-600 dark:text-neutral-300 text-sm md:text-lg max-w-3xl leading-relaxed font-light">
        {t.heroDesc}
      </p>

      {/* Trust Badges Row */}
      <div className="flex flex-wrap justify-center gap-4 pt-4 text-xs font-semibold text-neutral-700 dark:text-neutral-200">
        <div className="flex items-center gap-2 bg-white/90 dark:bg-[#1E211D]/90 backdrop-blur-md border border-[#EFEBE4] dark:border-[#2C302A] px-5 py-3 rounded-2xl shadow-sm hover:shadow-md hover:bg-white dark:hover:bg-[#252824] hover:-translate-y-0.5 transition-all duration-300">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>{t.badgeAirbnb}</span>
        </div>
        <div className="flex items-center gap-2 bg-white/90 dark:bg-[#1E211D]/90 backdrop-blur-md border border-[#EFEBE4] dark:border-[#2C302A] px-5 py-3 rounded-2xl shadow-sm hover:shadow-md hover:bg-white dark:hover:bg-[#252824] hover:-translate-y-0.5 transition-all duration-300">
          <Users className="w-4 h-4 text-[#5F6F52] dark:text-[#889B73]" />
          <span>{t.badgeGuests}</span>
        </div>
        <div className="flex items-center gap-2 bg-white/90 dark:bg-[#1E211D]/90 backdrop-blur-md border border-[#EFEBE4] dark:border-[#2C302A] px-5 py-3 rounded-2xl shadow-sm hover:shadow-md hover:bg-white dark:hover:bg-[#252824] hover:-translate-y-0.5 transition-all duration-300">
          <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t.badgeVerified}</span>
        </div>
      </div>
    </div>
  );
}
