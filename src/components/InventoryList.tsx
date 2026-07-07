"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Sparkles, Coffee, Utensils, Bed, Wine, HelpCircle, AlertCircle, RefreshCw } from "lucide-react";
import { fetchInventory, InventoryItem } from "../utils/csvParser";

interface InventoryListProps {
  sheetUrl?: string;
  lang?: "es" | "en";
}

export default function InventoryList({ sheetUrl, lang = "es" }: InventoryListProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const t = {
    es: {
      title: "Inventario del Departamento",
      sheetLink: "Enlace Google Sheets",
      subtitle: "Explora el equipamiento completo de alta calidad a tu disposición para una estadía perfecta.",
      updateBtn: "Actualizar",
      syncingBtn: "Sincronizando...",
      searchPlaceholder: "Buscar utensilios, sábanas, electrodomésticos...",
      catAll: "Todos",
      catVajilla: "Vajilla y Cocina",
      catElectro: "Electrodomésticos",
      catBlancos: "Blancos y Ropa de Cama",
      catWine: "Cava y Bar",
      wineCostNote: "Costo adicional (consumo a reportar)",
      guaranteeTitle: "Calidad Garantizada",
      guaranteeText: "Todas las ollas son de la línea Tramontina de excelente calidad, la vajilla es Carol de alta resistencia, y las sábanas son de puro algodón Egipcio de 600 hilos para garantizar una experiencia de descanso cinco estrellas.",
      emptyTitle: "No encontramos resultados",
      emptySubtitle: "Prueba buscando otros términos o cambia la categoría.",
      loadingText: "Cargando inventario en tiempo real...",
      categoriesMap: {
        "Todos": "Todos",
        "Vajilla y Cocina": "Vajilla y Cocina",
        "Electrodomésticos": "Electrodomésticos",
        "Blancos y Ropa de Cama": "Blancos y Ropa de Cama",
        "Cava y Bar": "Cava y Bar"
      } as Record<string, string>
    },
    en: {
      title: "Apartment Inventory",
      sheetLink: "Google Sheets Link",
      subtitle: "Explore the high-quality equipment at your disposal for a perfect stay.",
      updateBtn: "Update",
      syncingBtn: "Syncing...",
      searchPlaceholder: "Search utensils, sheets, appliances...",
      catAll: "All",
      catVajilla: "Tableware & Kitchen",
      catElectro: "Appliances",
      catBlancos: "Linens & Bedding",
      catWine: "Wine Cellar & Bar",
      wineCostNote: "Additional cost (please report consumption)",
      guaranteeTitle: "Guaranteed Quality",
      guaranteeText: "All cookware is from the Tramontina line of excellent quality, the dinnerware is Carol high-resistance, and the sheets are pure 600-thread-count Egyptian cotton to guarantee a five-star resting experience.",
      emptyTitle: "No results found",
      emptySubtitle: "Try searching other terms or change the category.",
      loadingText: "Loading real-time inventory...",
      categoriesMap: {
        "Todos": "All",
        "Vajilla y Cocina": "Tableware & Kitchen",
        "Electrodomésticos": "Appliances",
        "Blancos y Ropa de Cama": "Linens & Bedding",
        "Cava y Bar": "Wine Cellar & Bar"
      } as Record<string, string>
    }
  }[lang];

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

  // Get unique categories from items (excluding Cava y Bar)
  const rawCategories = Array.from(new Set(items.map((item) => item.category)))
    .filter(cat => !(cat.toLowerCase().includes("vino") || cat.toLowerCase().includes("cava") || cat.toLowerCase().includes("wine") || cat.toLowerCase().includes("bar")));
  const categories = ["Todos", ...rawCategories];

  // Helper to translate category names dynamically in UI
  const getCategoryLabel = (category: string) => {
    return t.categoriesMap[category] || category;
  };

  // Helper to assign icons to categories
  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("vajilla") || cat.includes("cocina") || cat.includes("table")) return <Utensils className="w-4 h-4" />;
    if (cat.includes("electro") || cat.includes("applian")) return <Coffee className="w-4 h-4" />;
    if (cat.includes("blanco") || cat.includes("cama") || cat.includes("ropa") || cat.includes("linen")) return <Bed className="w-4 h-4" />;
    if (cat.includes("vino") || cat.includes("bar") || cat.includes("cava") || cat.includes("wine")) return <Wine className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  // Normalization helper for smart text filtering (removes accents, converts to lowercase, handles basic plurals)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents/diacritics
      .replace(/s\b/g, "")             // Strip final 's' to approximate singular (platos -> plato, sheets -> sheet)
      .replace(/es\b/g, "")            // Strip final 'es' (copas/copaes/tazas -> tazas -> taza)
      .trim();
  };

  // Filter items using smart normalized matching and excluding Minibar/Wine Cellar items to prevent duplicate visualization
  const filteredItems = items.filter((item) => {
    const isWine = item.category.toLowerCase().includes("vino") || item.category.toLowerCase().includes("cava") || item.category.toLowerCase().includes("wine") || item.category.toLowerCase().includes("bar");
    if (isWine) return false;

    if (!searchTerm.trim()) {
      const matchesCategory = activeCategory === "Todos" || item.category === activeCategory;
      return matchesCategory;
    }

    const normalizedQuery = normalizeText(searchTerm);
    const normalizedItemName = normalizeText(item.item);
    const normalizedItemDetail = normalizeText(item.detail);

    // Split search terms to allow matching parts in different orders
    const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
    const matchesSearch = queryWords.every(
      (word) => normalizedItemName.includes(word) || normalizedItemDetail.includes(word)
    );

    const matchesCategory = activeCategory === "Todos" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#FAF9F7] border border-[#EFEBE4] rounded-3xl p-6 md:p-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl text-neutral-900 font-semibold flex items-center gap-2">
            <span>{t.title}</span>
            {sheetUrl && (
              <span className="text-[10px] bg-neutral-200/60 text-neutral-600 px-2 py-0.5 rounded-full font-sans tracking-wide">
                {t.sheetLink}
              </span>
            )}
          </h3>
          <p className="text-neutral-500 text-sm mt-1">
            {t.subtitle}
          </p>
        </div>
        
        {/* Sync Button */}
        <button
          onClick={handleRefresh}
          disabled={loading || isSyncing}
          className="self-start sm:self-center flex items-center gap-2 text-xs font-semibold text-[#5F6F52] hover:bg-[#EFEBE4] px-3.5 py-2 rounded-full border border-[#EFEBE4] bg-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? t.syncingBtn : t.updateBtn}
        </button>
      </div>

      {/* Search and Categories bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
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
              <span>{getCategoryLabel(category)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of items */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#5F6F52] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-neutral-500 text-sm">{t.loadingText}</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white border border-[#EFEBE4] rounded-2xl py-12 px-4 text-center space-y-2">
          <HelpCircle className="w-8 h-8 text-neutral-300 mx-auto" />
          <p className="font-medium text-neutral-800">{t.emptyTitle}</p>
          <p className="text-neutral-500 text-xs">{t.emptySubtitle}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, idx) => {
            const isWine = item.category.toLowerCase().includes("vino") || item.category.toLowerCase().includes("cava") || item.category.toLowerCase().includes("wine");
            return (
              <div
                key={idx}
                className={`bg-white border border-[#EFEBE4] rounded-2xl p-5 transition-all hover:shadow-md duration-200 flex flex-col justify-between ${
                  isWine ? "ring-1 ring-amber-100 bg-amber-50/10 border-amber-200" : ""
                }`}
              >
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-sm text-neutral-950 font-sans tracking-tight break-words">
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
                    <p className="text-neutral-500 text-xs mt-2 leading-relaxed break-words">
                      {item.detail}
                    </p>
                  )}
                </div>
                
                {/* Reporting action via WhatsApp */}
                <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-center">
                  <a
                    href={`https://wa.me/5491145379500?text=${encodeURIComponent(
                      lang === "es"
                        ? `Hola Jorge! Quería reportar un inconveniente (rotura/faltante) con el siguiente ítem del inventario: ${item.item} (x${item.quantity})`
                        : `Hi Jorge! I'd like to report an issue (damage/missing) with the following inventory item: ${item.item} (x${item.quantity})`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-800 text-xs font-semibold transition-all duration-200"
                  >
                    <svg className="w-3.5 h-3.5 fill-current text-[#25D366] flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.57 2.025 14.091.995 11.46.995c-5.437 0-9.862 4.37-9.866 9.8-.001 1.777.472 3.51 1.372 5.061l-.972 3.555 3.654-.958zm12.39-7.14c-.324-.162-1.92-.949-2.218-1.055-.298-.108-.515-.162-.73.163-.217.324-.838 1.056-1.029 1.27-.19.217-.38.244-.704.082-1.037-.518-1.806-.948-2.51-2.155-.572-.982-.376-1.514-.175-1.936.14-.298.324-.543.486-.73.162-.19.216-.324.324-.541.109-.217.054-.407-.027-.57-.081-.162-.73-1.761-.999-2.413-.263-.629-.529-.543-.728-.553l-.622-.008c-.217 0-.568.082-.865.407-.297.325-1.134 1.11-1.134 2.71 0 1.6 1.162 3.143 1.324 3.359.162.217 2.28 3.48 5.523 4.881.771.332 1.374.53 1.842.678.775.247 1.48.212 2.038.129.621-.093 1.92-.785 2.19-1.542.27-.756.27-1.406.19-1.542-.082-.136-.297-.217-.621-.38z"/>
                    </svg>
                    <span>{lang === "es" ? "Reportar rotura o faltante" : "Report damage or missing"}</span>
                  </a>
                </div>
                
                {/* Extra tag for wine cellar items */}
                {isWine && (
                  <div className="mt-3.5 pt-2 border-t border-amber-100 flex items-center gap-1.5 text-[10px] font-semibold text-amber-700">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{t.wineCostNote}</span>
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
          <p className="font-semibold text-neutral-800">{t.guaranteeTitle}</p>
          <p className="text-neutral-500 leading-relaxed">
            {t.guaranteeText}
          </p>
        </div>
      </div>
    </div>
  );
}
