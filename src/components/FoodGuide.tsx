import React from "react";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface FoodPlace {
  name: string;
  rating: string;
  reviews: string;
  address: string;
  mapsUrl: string;
  hours: string;
  tipEs: string;
  tipEn: string;
}

interface FoodCategory {
  titleEs: string;
  titleEn: string;
  icon: string;
  subtitleEs: string;
  subtitleEn: string;
  items: FoodPlace[];
}

export const foodGuideData: FoodCategory[] = [
  {
    titleEs: "Café de Especialidad y Brunch",
    titleEn: "Specialty Coffee & Brunch",
    icon: "☕",
    subtitleEs: "Favoritos a pie:",
    subtitleEn: "Favorites within walking distance:",
    items: [
      {
        name: "Cuervo Café",
        rating: "4.5",
        reviews: "1.6k+",
        address: "Costa Rica 5801",
        mapsUrl: "https://maps.google.com/?q=Cuervo+Cafe+Costa+Rica+5801",
        hours: "Todos los días 08:00 - 20:00",
        tipEs: "El mejor espresso de Palermo y medialunas de masa madre excelentes. A 3 min.",
        tipEn: "Best espresso in Palermo and excellent sourdough medialunas. 3 min away."
      },
      {
        name: "Vive Café",
        rating: "4.6",
        reviews: "1.3k+",
        address: "Costa Rica 5722",
        mapsUrl: "https://maps.google.com/?q=Vive+Cafe+Costa+Rica+5722",
        hours: "Mar a Dom 09:00 - 20:00",
        tipEs: "Auténtico café colombiano de especialidad y deliciosas almojábanas calientes.",
        tipEn: "Authentic specialty Colombian coffee and delicious warm almojábanas."
      },
      {
        name: "Café Registrado",
        rating: "4.4",
        reviews: "1.9k+",
        address: "Costa Rica 5901",
        mapsUrl: "https://maps.google.com/?q=Cafe+Registrado+Costa+Rica+5901",
        hours: "Todos los días 08:00 - 21:00",
        tipEs: "Tuestan sus propios granos. Ideal para trabajar remoto (buen WiFi y enchufes).",
        tipEn: "They roast their own beans. Great for remote work (good WiFi and outlets)."
      },
      {
        name: "Atelier Fuerza F5",
        rating: "4.2",
        reviews: "900+",
        address: "Honduras 5650",
        mapsUrl: "https://maps.google.com/?q=Atelier+Fuerza+F5+Honduras+5650",
        hours: "Todos los días 08:00 - 19:00",
        tipEs: "Panadería orgánica y facturas de manteca gigantes e increíbles.",
        tipEn: "Organic sourdough bakery and giant, incredible butter medialunas."
      }
    ]
  },
  {
    titleEs: "Parrillas y Bodegones",
    titleEn: "Steakhouses & Bodegons",
    icon: "🥩",
    subtitleEs: "La tradición local:",
    subtitleEn: "Local tradition:",
    items: [
      {
        name: "Don Julio Parrilla",
        rating: "4.6",
        reviews: "23k+",
        address: "Guatemala 4699",
        mapsUrl: "https://maps.google.com/?q=Don+Julio+Parrilla+Guatemala+4699",
        hours: "Todos los días 11:30 - 16:00, 19:00 - 01:00",
        tipEs: "Elegida entre las mejores parrillas del mundo. Reservar con meses de anticipación.",
        tipEn: "Ranked among the best steakhouses in the world. Book months in advance."
      },
      {
        name: "La Cabrera",
        rating: "4.4",
        reviews: "15k+",
        address: "José A. Cabrera 5127",
        mapsUrl: "https://maps.google.com/?q=La+Cabrera+Cabrera+5127",
        hours: "Todos los días 12:00 - 16:00, 18:30 - 23:30",
        tipEs: "Excelente ojo de bife y sus famosas cazuelitas calientes de acompañamiento.",
        tipEn: "Excellent ribeye steak and their famous complimentary hot side dishes."
      },
      {
        name: "El Preferido de Palermo",
        rating: "4.5",
        reviews: "7.5k+",
        address: "Jorge Luis Borges 2108",
        mapsUrl: "https://maps.google.com/?q=El+Preferido+de+Palermo+Borges+2108",
        hours: "Todos los días 11:30 - 16:00, 19:00 - 01:00",
        tipEs: "Bodegón histórico porteño renovado. Excelentes milanesas y embutidos caseros.",
        tipEn: "Renovated historic Buenos Aires bodegón. Superb milanesas and charcuterie."
      },
      {
        name: "Las Cabras",
        rating: "4.3",
        reviews: "20k+",
        address: "Fitz Roy 1795",
        mapsUrl: "https://maps.google.com/?q=Las+Cabras+Parrilla+Fitz+Roy+1795",
        hours: "Todos los días 12:00 - 01:00",
        tipEs: "A solo 2 cuadras del departamento. Abundante, informal y muy económica.",
        tipEn: "Just 2 blocks away. Generous portions, informal vibe, very budget-friendly."
      }
    ]
  },
  {
    titleEs: "Bares y Coctelería",
    titleEn: "Bars & Cocktail Lounges",
    icon: "🍹",
    subtitleEs: "Speakeasies y autor:",
    subtitleEn: "Speakeasies & signature:",
    items: [
      {
        name: "Uptown",
        rating: "4.2",
        reviews: "9.6k+",
        address: "Arévalo 2030",
        mapsUrl: "https://maps.google.com/?q=Uptown+Bar+Arevalo+2030",
        hours: "Mar a Sáb 20:00 - 03:00",
        tipEs: "Se ingresa por una réplica de estación de subte de Nueva York. Gran coctelería.",
        tipEn: "Enter through a replica NYC subway station. Outstanding cocktails and vibe."
      },
      {
        name: "Boticario",
        rating: "4.4",
        reviews: "4.8k+",
        address: "Honduras 5207",
        mapsUrl: "https://maps.google.com/?q=Boticario+Bar+Honduras+5207",
        hours: "Mar a Dom 19:00 - 02:00",
        tipEs: "Ambientado como una antigua farmacia/botica, con tragos de autor y hermoso patio.",
        tipEn: "Themed as an old pharmacy, serving signature drinks in a beautiful patio."
      },
      {
        name: "Verne Club",
        rating: "4.4",
        reviews: "3k+",
        address: "Av. Medrano 1475",
        mapsUrl: "https://maps.google.com/?q=Verne+Club+Medrano+1475",
        hours: "Todos los días 19:00 - 02:00",
        tipEs: "Inspirado en Julio Verne. Coctelería clásica y jazz en un ambiente de época.",
        tipEn: "Jules Verne inspired. Award-winning classic cocktails and jazz in a cozy vibe."
      }
    ]
  },
  {
    titleEs: "Pizzerías y Heladerías",
    titleEn: "Pizza & Ice Cream",
    icon: "🍕",
    subtitleEs: "Golosinas y masa fina:",
    subtitleEn: "Sweet treats & thin crust:",
    items: [
      {
        name: "Siamo nel Forno",
        rating: "4.4",
        reviews: "2.6k+",
        address: "Costa Rica 5886",
        mapsUrl: "https://maps.google.com/?q=Siamo+nel+Forno+Costa+Rica+5886",
        hours: "Mar a Dom 20:00 - 24:00",
        tipEs: "Auténtica pizza napolitana con certificación oficial, cocinada en horno de leña.",
        tipEn: "Authentic certified Neapolitan pizza, wood-fired with fresh ingredients."
      },
      {
        name: "Rapanui",
        rating: "4.7",
        reviews: "15k+",
        address: "El Salvador 4702",
        mapsUrl: "https://maps.google.com/?q=Rapanui+El+Salvador+4702",
        hours: "Todos los días 10:00 - 01:00",
        tipEs: "Los helados artesanales más famosos del sur. Probá las frambuesas bañadas Franui.",
        tipEn: "Famous artisanal gelato from Bariloche. Try the Franui chocolate raspberries."
      },
      {
        name: "Lucciano's",
        rating: "4.6",
        reviews: "3.8k+",
        address: "Honduras 4881",
        mapsUrl: "https://maps.google.com/?q=Luccianos+Honduras+4881",
        hours: "Todos los días 11:00 - 01:00",
        tipEs: "Helados italianos premium y una divertida variedad de paletas de diseño.",
        tipEn: "Premium Italian-style gelato and a fun selection of designer popsicles."
      }
    ]
  }
];

export default function FoodGuide() {
  const { t, language } = useLanguage();

  return (
    <div className="bg-white dark:bg-[#252824] border border-[#EFEBE4] dark:border-[#353A33] rounded-3xl p-6 md:p-8 space-y-6 transition-colors duration-300">
      <div>
        <h3 className="font-serif text-xl md:text-2xl text-neutral-900 dark:text-neutral-100 font-semibold flex items-center gap-2">
          <span>🍳 {t.guideTitle}</span>
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
          {t.guideSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {foodGuideData.map((cat, catIdx) => (
          <div key={catIdx} className="bg-[#FAF9F7] dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] rounded-2xl p-4 space-y-4 flex flex-col justify-between transition-colors duration-300">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#5F6F52] dark:text-[#889B73] pb-2 border-b border-[#EFEBE4]/60 dark:border-[#2C302A]/60">
                <span className="text-lg">{cat.icon}</span>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  {language === "es" ? cat.titleEs : cat.titleEn}
                </h4>
              </div>
              <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider pt-1">
                {language === "es" ? cat.subtitleEs : cat.subtitleEn}
              </p>
            </div>

            <div className="space-y-3 flex-grow mt-2">
              {cat.items.map((item, itemIdx) => (
                <div key={itemIdx} className="bg-white dark:bg-[#141613] border border-[#EFEBE4] dark:border-[#2C302A] p-3 rounded-xl shadow-sm hover:shadow-md transition-all space-y-1.5 flex flex-col justify-between duration-300">
                  <div>
                    <div className="flex items-start justify-between gap-1.5">
                      <span className="font-bold text-[12px] text-neutral-900 dark:text-neutral-100 leading-tight">
                        {item.name}
                      </span>
                      <a 
                        href={item.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#5F6F52] dark:text-[#889B73] hover:text-[#4F5D43] dark:hover:text-[#6E7F5E] flex-shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded">
                        ⭐ {item.rating} ({item.reviews} en Google)
                      </span>
                      <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-semibold">
                        📍 {item.address}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium mt-1 leading-normal">
                      {language === "es" ? item.tipEs : item.tipEn}
                    </p>
                  </div>
                  <div className="pt-1.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-1 text-[9px] text-neutral-400 dark:text-neutral-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    <span>{item.hours}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
