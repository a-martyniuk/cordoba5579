import React, { useState } from "react";
import { ChevronDown, Phone } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function FAQSection() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleFaqToggle = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="space-y-12">
      {/* Accordion FAQ Section */}
      <div className="space-y-6 bg-white dark:bg-[#252824] border border-[#EFEBE4] dark:border-[#353A33] rounded-3xl p-6 md:p-8 transition-colors duration-300" id="faq">
        <h3 className="font-serif text-xl md:text-2xl text-neutral-900 dark:text-neutral-100 font-semibold">
          {t.faqHeader}
        </h3>
        
        <div className="divide-y divide-[#EFEBE4] dark:divide-[#353A33] border-t border-b border-[#EFEBE4] dark:border-[#353A33] font-sans">
          {[
            { q: t.faq1Q, a: t.faq1A },
            { q: t.faq2Q, a: t.faq2A },
            { q: t.faq3Q, a: t.faq3A },
            { q: t.faq4Q, a: t.faq4A },
            { q: t.faq5Q, a: t.faq5A },
            { q: t.faq6Q, a: t.faq6A },
            { q: t.faq7Q, a: t.faq7A },
            { q: t.faq8Q, a: t.faq8A },
            { q: t.faq9Q, a: t.faq9A },
            { q: t.faq10Q, a: t.faq10A },
            { q: t.faq11Q, a: t.faq11A }
          ].map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => handleFaqToggle(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                >
                  <span className="font-semibold text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
                    {item.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-all duration-300 flex-shrink-0 ${
                    isOpen ? "transform rotate-180 text-[#5F6F52]" : ""
                  }`} />
                </button>
                
                {/* Fluid transition container for answer */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 mt-2.5" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed pl-1">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Contacts Section */}
      <div className="bg-white dark:bg-[#252824] border border-[#EFEBE4] dark:border-[#353A33] rounded-3xl p-6 md:p-8 transition-colors duration-300 shadow-sm" id="emergencias">
        <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400 pb-4 border-b border-[#F5F2EB] dark:border-[#2C302A] mb-4">
          <Phone className="w-5 h-5 md:w-6 md:h-6" />
          <h3 className="font-serif text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100">{t.emergencyTitle}</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm font-sans">
          <a href="tel:911" className="flex items-center justify-between p-4 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl transition-all group">
            <div className="space-y-0.5">
              <p className="font-bold text-red-700 dark:text-red-400 text-lg">911</p>
              <p className="text-neutral-500 dark:text-neutral-450 text-xs">{t.emergency911Desc}</p>
            </div>
          </a>
          <a href="tel:107" className="flex items-center justify-between p-4 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl transition-all group">
            <div className="space-y-0.5">
              <p className="font-bold text-red-700 dark:text-red-400 text-lg">107</p>
              <p className="text-neutral-500 dark:text-neutral-450 text-xs">{t.emergency107Desc}</p>
            </div>
          </a>
          <a href="tel:100" className="flex items-center justify-between p-4 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl transition-all group">
            <div className="space-y-0.5">
              <p className="font-bold text-red-700 dark:text-red-400 text-lg">100</p>
              <p className="text-neutral-500 dark:text-neutral-450 text-xs">{t.emergency100Desc}</p>
            </div>
          </a>
          <a href="tel:103" className="flex items-center justify-between p-4 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl transition-all group">
            <div className="space-y-0.5">
              <p className="font-bold text-red-700 dark:text-red-400 text-lg">103</p>
              <p className="text-neutral-500 dark:text-neutral-450 text-xs">{t.emergency103Desc}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
