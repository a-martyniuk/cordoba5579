import React from "react";
import { useLanguage } from "../context/LanguageContext";
import airbnbDetails from "../data/airbnb-details.json";

export default function AmenitiesGrid() {
  const { t, language } = useLanguage();

  const groupedAmenities = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const details = (airbnbDetails as any)[language] || (airbnbDetails as any).es || {};
    const amenities = details.amenities || [];
    const categories = {
      kitchen: { titleEs: "Cocina y Vajilla", titleEn: "Kitchen & Dining", icon: "🍳", items: [] as { title: string; subtitle: string }[] },
      bedroom: { titleEs: "Dormitorio y Blancos", titleEn: "Bedroom & Linens", icon: "🛏️", items: [] as { title: string; subtitle: string }[] },
      bathroom: { titleEs: "Baño y Cuidado Personal", titleEn: "Bathroom & Toiletries", icon: "🚿", items: [] as { title: string; subtitle: string }[] },
      connectivity: { titleEs: "Conectividad y Climatización", titleEn: "Connectivity & Climate", icon: "🔌", items: [] as { title: string; subtitle: string }[] },
      safety: { titleEs: "Seguridad y Prevención", titleEn: "Safety & Security", icon: "🛡️", items: [] as { title: string; subtitle: string }[] },
      rooftop: { titleEs: "Terraza, Accesibilidad y Servicios", titleEn: "Rooftop & Accessibility", icon: "🌇", items: [] as { title: string; subtitle: string }[] },
    };
    amenities.forEach((item: { title: string; subtitle: string; category?: unknown }) => {
      const lower = ((item.title || "") + " " + (item.subtitle || "")).toLowerCase();
      if (lower.includes("cocina") || lower.includes("heladera") || lower.includes("microondas") || lower.includes("vajilla") || lower.includes("horno") || lower.includes("cafetera") || lower.includes("licuadora") || lower.includes("arrocera") || lower.includes("comedor") || lower.includes("pava") || lower.includes("copas") || lower.includes("congelador") || lower.includes("utensilios") || lower.includes("ollas") || lower.includes("sartenes") || lower.includes("platos") || lower.includes("bowls")) {
        categories.kitchen.items.push(item);
      } else if (lower.includes("cama") || lower.includes("almohada") || lower.includes("manta") || lower.includes("cortina") || lower.includes("persiana") || lower.includes("ropa") || lower.includes("perchas") || lower.includes("lavarropas") || lower.includes("secarropas") || lower.includes("plancha") || lower.includes("ténder") || lower.includes("placard") || lower.includes("armario") || lower.includes("guardar") || lower.includes("hilos") || lower.includes("algodón")) {
        categories.bedroom.items.push(item);
      } else if (lower.includes("pelo") || lower.includes("shampoo") || lower.includes("acondicionador") || lower.includes("jabón") || lower.includes("bidé") || lower.includes("bidet") || lower.includes("ducha") || lower.includes("agua caliente") || lower.includes("gel") || lower.includes("secador")) {
        categories.bathroom.items.push(item);
      } else if (lower.includes("wifi") || lower.includes("ethernet") || lower.includes("televisor") || lower.includes("tv") || lower.includes("ac:") || lower.includes("calefacción") || lower.includes("split") || lower.includes("televisor hd") || lower.includes("pulgadas")) {
        categories.connectivity.items.push(item);
      } else if (lower.includes("cámara") || lower.includes("humo") || lower.includes("monóxido") || lower.includes("matafuego") || lower.includes("auxilios") || lower.includes("seguridad") || lower.includes("caja fuerte") || lower.includes("alarma") || lower.includes("extintor")) {
        categories.safety.items.push(item);
      } else {
        categories.rooftop.items.push(item);
      }
    });

    return Object.values(categories).filter(c => c.items.length > 0);
  }, [language]);

  return (
    <div className="space-y-8 border-b border-[#EFEBE4] pb-10" id="amenidades">
      <h3 className="font-serif text-2xl text-neutral-900 font-semibold">{t.amenitiesTitle}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
        {groupedAmenities.map((cat, idx) => (
          <div key={idx} className="space-y-4">
            <h4 className="font-serif text-sm font-bold tracking-wider text-neutral-500 uppercase flex items-center gap-2">
              <span className="text-base">{cat.icon}</span>
              {language === "es" ? cat.titleEs : cat.titleEn}
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-neutral-700 dark:text-neutral-350">
              {cat.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 bg-[#FAF9F7] dark:bg-[#1E211D] px-3.5 py-2.5 rounded-xl border border-[#EFEBE4] dark:border-[#2C302A]">
                  <span className="text-[#5F6F52] font-bold mt-0.5">✓</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{item.title}</span>
                    {item.subtitle && (
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 font-light leading-normal">{item.subtitle}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
