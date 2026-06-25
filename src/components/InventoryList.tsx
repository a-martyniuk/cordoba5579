"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Sparkles, Coffee, Utensils, Bed, Wine, HelpCircle, AlertCircle, RefreshCw } from "lucide-react";
import { fetchInventory, InventoryItem } from "../utils/csvParser";

interface InventoryListProps {
  sheetUrl?: string;
}

export default function InventoryList({ sheetUrl }: InventoryListProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const loadInventory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchInventory(sheetUrl);
      setItems(data);
    } catch (err) {
      console.error("Failed to load inventory:", err);
    } finally {
      setLoading(false);
    }
  }, [sheetUrl]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const handleRefresh = async () => {
    setIsSyncing(true);
    await loadInventory();
    setTimeout(() => setIsSyncing(false), 800);
  };


  // Get unique categories
  const categories = ["Todos", ...Array.from(new Set(items.map((item) => item.category)))];

  // Helper to assign icons to categories
  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("vajilla") || cat.includes("cocina")) return <Utensils className="w-4 h-4" />;
    if (cat.includes("electro")) return <Coffee className="w-4 h-4" />;
    if (cat.includes("blanco") || cat.includes("cama") || cat.includes("ropa")) return <Bed className="w-4 h-4" />;
    if (cat.includes("vino") || cat.includes("bar") || cat.includes("cava")) return <Wine className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.detail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "Todos" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#FAF9F7] border border-[#EFEBE4] rounded-3xl p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl text-neutral-900 font-semibold flex items-center gap-2">
            <span>Inventario del Departamento</span>
            {sheetUrl && (
              <span className="text-[10px] bg-neutral-200/60 text-neutral-600 px-2 py-0.5 rounded-full font-sans tracking-wide">
                Enlace Google Sheets
              </span>
            )}
          </h3>
          <p className="text-neutral-500 text-sm mt-1">
            Explora el equipamiento completo de alta calidad a tu disposición para una estadía perfecta.
          </p>
        </div>
        
        {/* Sync Button */}
        <button
          onClick={handleRefresh}
          disabled={loading || isSyncing}
          className="self-start sm:self-center flex items-center gap-2 text-xs font-semibold text-[#5F6F52] hover:bg-[#EFEBE4] px-3.5 py-2 rounded-full border border-[#EFEBE4] bg-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Sincronizando..." : "Actualizar"}
        </button>
      </div>

      {/* Search and Categories bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar utensilios, sábanas, electrodomésticos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#EFEBE4] rounded-2xl py-3.5 pl-11 pr-4 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all shadow-sm"
          />
        </div>

        {/* Categories Grid/Wrap */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-full border transition-all whitespace-nowrap ${
                activeCategory === category
                  ? "bg-[#5F6F52] text-white border-[#5F6F52] font-medium shadow-sm"
                  : "bg-white text-neutral-600 border-[#EFEBE4] hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              {category !== "Todos" && getCategoryIcon(category)}
              <span>{category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of items */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#5F6F52] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-neutral-500 text-sm">Cargando inventario en tiempo real...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white border border-[#EFEBE4] rounded-2xl py-12 px-4 text-center space-y-2">
          <HelpCircle className="w-8 h-8 text-neutral-300 mx-auto" />
          <p className="font-medium text-neutral-800">No encontramos resultados</p>
          <p className="text-neutral-500 text-xs">Prueba buscando otros términos o cambia la categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, idx) => {
            const isWine = item.category.toLowerCase().includes("vino") || item.category.toLowerCase().includes("cava");
            return (
              <div
                key={idx}
                className={`bg-white border border-[#EFEBE4] rounded-2xl p-4.5 transition-all hover:shadow-md duration-200 flex flex-col justify-between ${
                  isWine ? "ring-1 ring-amber-100 bg-amber-50/10 border-amber-200" : ""
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-sm text-neutral-950 font-sans tracking-tight">
                      {item.item}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0 ${
                        isWine
                          ? "bg-amber-100 text-amber-800"
                          : "bg-[#EFEBE4] text-neutral-700"
                      }`}
                    >
                      x{item.quantity}
                    </span>
                  </div>
                  {item.detail && (
                    <p className="text-neutral-500 text-xs mt-2 leading-relaxed">
                      {item.detail}
                    </p>
                  )}
                </div>
                
                {/* Extra tag for wine cellar items */}
                {isWine && (
                  <div className="mt-3.5 pt-2 border-t border-amber-100 flex items-center gap-1.5 text-[10px] font-semibold text-amber-700">
                    <AlertCircle className="w-3 h-3" />
                    <span>Costo adicional (consumo a reportar)</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-white border border-[#EFEBE4] rounded-2xl p-4 flex gap-3.5 items-start">
        <Sparkles className="w-5 h-5 text-[#5F6F52] flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-neutral-800">Calidad Garantizada</p>
          <p className="text-neutral-500 leading-relaxed">
            Todas las ollas son de la línea Tramontina de excelente calidad, la vajilla es Carol de alta resistencia, y las sábanas son de puro algodón Egipcio de 600 hilos para garantizar una experiencia de descanso cinco estrellas.
          </p>
        </div>
      </div>
    </div>
  );
}
