"use client";

import React, { useState } from "react";
import { Play, Sparkles, CheckCircle2, Info, Moon } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function SofaBedVideoGuide() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div id="sillon-cama-guia" className="bg-[#FAF9F7] dark:bg-[#1C1F1B] border border-[#EFEBE4] dark:border-[#2C302A] rounded-3xl p-5 md:p-8 space-y-6 shadow-sm transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#EFEBE4] dark:border-[#2C302A] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#5F6F52]/10 border border-[#5F6F52]/20 text-[#5F6F52] dark:text-[#889B73] rounded-full text-xs font-bold">
            <Moon className="w-3.5 h-3.5" />
            <span>{isEn ? "Living Room Comfort" : "Confort en el Living"}</span>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>{isEn ? "Sofa Bed Setup Video Guide" : "Guía en Video: Armado del Sillón Cama"}</span>
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {isEn
              ? "Watch the quick video tutorial to convert the living room sofa into a comfortable bed."
              : "Mirá el instructivo rápido en video para desplegar y armar la cama del living de forma sencilla."}
          </p>
        </div>
      </div>

      {/* Video Container */}
      <div className="w-full relative">
        {isPlaying ? (
          <div className="bg-neutral-950 rounded-2xl overflow-hidden aspect-video border border-neutral-800 shadow-xl">
            <video
              className="w-full h-full object-contain bg-black"
              src="/cordoba5579/video/guia.mp4"
              controls
              autoPlay
              playsInline
            />
          </div>
        ) : (
          <div 
            onClick={() => setIsPlaying(true)}
            className="bg-neutral-950 rounded-2xl overflow-hidden aspect-video relative flex flex-col justify-end p-5 border border-neutral-800 group shadow-lg cursor-pointer bg-cover bg-center transition-all hover:border-[#5F6F52]/60"
            style={{ backgroundImage: `url('/cordoba5579/video/sillon-cama-poster.jpg')` }}
          >
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#5F6F52]/95 hover:bg-[#5F6F52] text-white rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 group-hover:scale-110">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
              </div>
            </div>

            {/* Video Label Footer */}
            <div className="z-10 text-white space-y-1 pointer-events-none">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-neutral-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  <Sparkles className="w-3 h-3" />
                  <span>{isEn ? "Video Tutorial (30s)" : "Tutorial en Video (30s)"}</span>
                </span>
                {isEn && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-neutral-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-300/30">
                    <span>ENGLISH STEPS BELOW</span>
                  </span>
                )}
              </div>
              <h4 className="font-serif font-bold text-base sm:text-xl text-white drop-shadow-md">
                {isEn ? "How to open and fold the sofa bed" : "Cómo desplegar y armar el sillón cama"}
              </h4>
            </div>
          </div>
        )}
      </div>

      {/* Step Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#252824] border border-[#EFEBE4] dark:border-[#353A33] space-y-1 shadow-sm">
          <div className="flex items-center gap-1.5 font-bold text-[#5F6F52] dark:text-[#889B73]">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isEn ? "1. Remove Cover" : "1. Retirar Cobertor"}</span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 leading-snug">
            {isEn ? "Remove the protective sofa cover." : "Retirá el cobertor protector del sillón."}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#252824] border border-[#EFEBE4] dark:border-[#353A33] space-y-1 shadow-sm">
          <div className="flex items-center gap-1.5 font-bold text-[#5F6F52] dark:text-[#889B73]">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isEn ? "2. Pull Strap" : "2. Tirar de la Tira"}</span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 leading-snug">
            {isEn ? "Pull the central strap on the seat to extract the main block (forming an inverted V)." : "Tomá la tira central del asiento y tirá para extraer el bloque completo (formará una V invertida)."}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#252824] border border-[#EFEBE4] dark:border-[#353A33] space-y-1 shadow-sm">
          <div className="flex items-center gap-1.5 font-bold text-[#5F6F52] dark:text-[#889B73]">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isEn ? "3. Extend Block" : "3. Extender Bloque"}</span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 leading-snug">
            {isEn ? "Extend the block into a flat horizontal position, parallel to the floor." : "Extendé el bloque hasta dejarlo en posición horizontal, paralelo al piso."}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#252824] border border-[#EFEBE4] dark:border-[#353A33] space-y-1 shadow-sm">
          <div className="flex items-center gap-1.5 font-bold text-[#5F6F52] dark:text-[#889B73]">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isEn ? "4. Unfold Legs" : "4. Desplegar Patas"}</span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 leading-snug">
            {isEn ? "Unfold the support legs until fully extended and firm on the ground." : "Desplegá las patas de apoyo hasta que queden abiertas y firmes sobre el suelo."}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#252824] border border-[#EFEBE4] dark:border-[#353A33] space-y-1 shadow-sm">
          <div className="flex items-center gap-1.5 font-bold text-[#5F6F52] dark:text-[#889B73]">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isEn ? "5. Unfold Mattress" : "5. Hoja de Colchón"}</span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 leading-snug">
            {isEn ? "Unfold the mattress layer tucked inside the backrest to complete the bed." : "Desplegá la hoja del colchón embutida en el respaldo hasta completar la superficie."}
          </p>
        </div>
      </div>

      {/* Helpful Tip Notice */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>{isEn ? "Tip for closing:" : "Consejo para cerrar:"}</strong>{" "}
          {isEn
            ? "When folding the sofa back, lift from the front frame without forcing the mechanism. Ensure no sheets get trapped in the hinges."
            : "Al volver a plegar el sillón, levantá desde el frente de la estructura sin forzar la bisagra y verificá que las sábanas no queden enganchadas."}
        </p>
      </div>
    </div>
  );
}
