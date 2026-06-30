"use client";

import React from "react";
import { Star, Users, UserCheck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#5F6F52] tracking-wide">
        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{t.tagNew}</span>
        </span>
        <span>·</span>
        <span className="dark:text-neutral-400">{t.tagLocation}</span>
        <span>·</span>
        <span className="dark:text-neutral-400">{t.tagArena}</span>
      </div>
      
      <h1 className="font-serif text-3xl md:text-5xl text-neutral-900 dark:text-white font-bold tracking-normal leading-[1.15]">
        {t.heroTitle}
      </h1>
      
      <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base max-w-3xl leading-relaxed">
        {t.heroDesc}
      </p>

      {/* Trust Badges Row */}
      <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
        <div className="flex items-center gap-2 bg-white/80 dark:bg-[#252824]/80 backdrop-blur-sm border border-[#EFEBE4] dark:border-[#353A33] px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>{t.badgeAirbnb}</span>
        </div>
        <div className="flex items-center gap-2 bg-white/80 dark:bg-[#252824]/80 backdrop-blur-sm border border-[#EFEBE4] dark:border-[#353A33] px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <Users className="w-4 h-4 text-[#5F6F52] dark:text-[#889B73]" />
          <span>{t.badgeGuests}</span>
        </div>
        <div className="flex items-center gap-2 bg-white/80 dark:bg-[#252824]/80 backdrop-blur-sm border border-[#EFEBE4] dark:border-[#353A33] px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <UserCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-500" />
          <span>{t.badgeVerified}</span>
        </div>
      </div>
    </div>
  );
}
