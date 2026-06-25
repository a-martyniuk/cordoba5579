"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Grid, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageItem {
  url: string;
  title: string;
  desc: string;
}

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images: ImageItem[] = [
    {
      url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&h=800&q=80",
      title: "Living Room Principal",
      desc: "Espacio moderno con TV de 55 pulgadas, sillón cómodo y rincón bar."
    },
    {
      url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&h=600&q=80",
      title: "Dormitorio Principal",
      desc: "Cama Queen size con sábanas de hilo egipcio de 600 hilos y Smart TV."
    },
    {
      url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&h=600&q=80",
      title: "Cocina y Barra",
      desc: "Cocina completamente equipada con electrodomésticos Samsung y Tramontina."
    },
    {
      url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&h=600&q=80",
      title: "Piscina y Solárium",
      desc: "Terraza compartida con piscina exterior, duchas y áreas de relax."
    },
    {
      url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&h=600&q=80",
      title: "Cava de Vinos Premium",
      desc: "Dotación opcional de Malbec, Syrah, Torrontés y Champagne."
    }
  ];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % images.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="space-y-4">
      {/* Grid Layout (Airbnb Style) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 h-[300px] sm:h-[400px] md:h-[480px] rounded-3xl overflow-hidden relative">
        {/* Main large image (Left) */}
        <div 
          onClick={() => setLightboxIndex(0)}
          className="col-span-1 md:col-span-6 h-full relative cursor-pointer overflow-hidden group"
        >
          <img
            src={images[0].url}
            alt={images[0].title}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-all" />
          <div className="absolute bottom-6 left-6 text-white z-10 drop-shadow-sm">
            <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full font-semibold">
              Prototipo
            </span>
            <h4 className="text-xl font-serif font-bold mt-2">{images[0].title}</h4>
            <p className="text-white/80 text-xs mt-1">{images[0].desc}</p>
          </div>
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-4 h-4 text-neutral-800" />
          </div>
        </div>

        {/* Smaller images (Right) */}
        <div className="hidden md:grid col-span-6 grid-cols-2 gap-3 h-full">
          {images.slice(1, 5).map((img, idx) => (
            <div
              key={idx}
              onClick={() => setLightboxIndex(idx + 1)}
              className="h-full relative cursor-pointer overflow-hidden group"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all" />
              <div className="absolute bottom-4 left-4 text-white z-10 drop-shadow-sm">
                <h4 className="text-sm font-semibold">{img.title}</h4>
              </div>
              <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5 text-neutral-800" />
              </div>
            </div>
          ))}
        </div>

        {/* View all photos button */}
        <button
          onClick={() => setLightboxIndex(0)}
          className="absolute bottom-5 right-5 bg-white hover:bg-neutral-50 text-neutral-800 font-semibold px-4 py-2.5 rounded-xl border border-neutral-200 text-xs shadow-md flex items-center gap-2 z-10 transition-all active:scale-95"
        >
          <Grid className="w-4 h-4" />
          <span>Ver todas las fotos</span>
        </button>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 bg-black/95 z-[9999] flex flex-col items-center justify-between p-4 md:p-8"
          >
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between text-white max-w-6xl z-10">
              <span className="text-sm font-semibold tracking-wider">
                {lightboxIndex + 1} / {images.length}
              </span>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Area */}
            <div className="w-full max-w-4xl flex items-center justify-between gap-4 z-10 my-auto">
              <button
                onClick={handlePrev}
                className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-white transition-colors active:scale-95 flex-shrink-0"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="w-full max-h-[70vh] flex items-center justify-center relative rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={images[lightboxIndex].url}
                  alt={images[lightboxIndex].title}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              </motion.div>

              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-white transition-colors active:scale-95 flex-shrink-0"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Info Bar */}
            <div className="w-full max-w-3xl text-center text-white space-y-1.5 z-10 mb-4">
              <h4 className="text-lg font-serif font-bold">{images[lightboxIndex].title}</h4>
              <p className="text-white/70 text-sm leading-relaxed max-w-xl mx-auto">
                {images[lightboxIndex].desc}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
