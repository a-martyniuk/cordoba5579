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
      
      const isKitchen = lower.match(/(cocina|heladera|microondas|vajilla|horno|cafetera|licuadora|arrocera|comedor|pava|copas|congelador|utensilios|ollas|sartenes|platos|bowls|kitchen|refrigerator|fridge|microwave|dishes|silverware|oven|coffee|espresso|blender|rice|dining|kettle|wine glasses|freezer|utensils|pots|pans|plates|stove|toaster|baking)/);
      const isBedroom = lower.match(/(cama|almohada|manta|cortina|persiana|ropa|perchas|lavarropas|secarropas|plancha|ténder|placard|armario|guardar|hilos|algodón|bed|pillow|blanket|curtain|blind|clothing|hanger|washer|dryer|iron|drying rack|closet|wardrobe|store|thread|cotton|linen|sheet|darkening)/);
      const isBathroom = lower.match(/(pelo|shampoo|acondicionador|jabón|bidé|bidet|ducha|agua caliente|gel|secador|hair|conditioner|soap|shower|hot water|body|toilet)/);
      const isConnectivity = lower.match(/(wifi|ethernet|televisor|tv|ac:|calefacción|split|televisor hd|pulgadas|air conditioning|heating|hdtv|inch|internet|ac -)/);
      const isSafety = lower.match(/(cámara|humo|monóxido|matafuego|auxilios|seguridad|caja fuerte|alarma|extintor|camera|smoke|carbon monoxide|fire extinguisher|first aid|security|safe|alarm)/);

      if (isKitchen) {
        categories.kitchen.items.push(item);
      } else if (isBedroom) {
        categories.bedroom.items.push(item);
      } else if (isBathroom) {
        categories.bathroom.items.push(item);
      } else if (isConnectivity) {
        categories.connectivity.items.push(item);
      } else if (isSafety) {
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
                <li key={i} className="flex items-start gap-3 bg-white/50 dark:bg-[#1E211D]/50 hover:bg-white dark:hover:bg-[#252824] px-4 py-3 rounded-2xl border border-[#EFEBE4] dark:border-[#2C302A] shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm">
                  <span className="text-[#5F6F52] dark:text-[#889B73] font-bold mt-0.5">✓</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{item.title}</span>
                    {item.subtitle && (
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-light leading-normal">{item.subtitle}</span>
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
