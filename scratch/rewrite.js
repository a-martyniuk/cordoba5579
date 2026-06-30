import fs from "fs";

let content = fs.readFileSync("src/app/page.tsx", "utf-8");

// 1. Add imports
content = content.replace(
  'import airbnbDetails from "../data/airbnb-details.json";',
  `import airbnbDetails from "../data/airbnb-details.json";
import { useLanguage } from "../context/LanguageContext";
import HeroSection from "../components/HeroSection";
import AmenitiesGrid from "../components/AmenitiesGrid";
import FoodGuide from "../components/FoodGuide";
import FAQSection from "../components/FAQSection";`
);

// 2. Remove language state
content = content.replace(
  'const [language, setLanguage] = useState<"es" | "en">("es");\n',
  ''
);

// 3. Remove inline dictionary and replace with useLanguage
const tStart = content.indexOf('  const t = {');
const tEnd = content.indexOf('}[language];', tStart) + '}[language];'.length;
content = content.slice(0, tStart) + '  const { t, language, setLanguage } = useLanguage();\n\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any\n  const currentDetails = (airbnbDetails as any)[language] || (airbnbDetails as any).es || {};' + content.slice(tEnd);

// Also remove `const currentDetails = airbnbDetails[language] || airbnbDetails.es || {};` that was already there
content = content.replace(
  '  const currentDetails = airbnbDetails[language] || airbnbDetails.es || {};\n',
  ''
);

// 4. Remove foodGuideData
const fgStart = content.indexOf('interface FoodPlace {');
const fgEnd = content.indexOf('];\n\nexport default function Home() {', fgStart);
content = content.slice(0, fgStart) + content.slice(fgEnd + '];\n\n'.length);

// 5. Remove groupedAmenities
const gaStart = content.indexOf('  const groupedAmenities = React.useMemo(() => {');
const gaEnd = content.indexOf('  }, [language]);\n\n', gaStart) + '  }, [language]);\n\n'.length;
content = content.slice(0, gaStart) + content.slice(gaEnd);

// 6. Remove handleLanguageChange
const hlcStart = content.indexOf('  const handleLanguageChange = (newLang: "es" | "en") => {');
const hlcEnd = content.indexOf('  };\n\n', hlcStart) + '  };\n\n'.length;
content = content.slice(0, hlcStart) + content.slice(hlcEnd);

// 7. Replace Language handlers in Mobile menu and regular menu
content = content.replaceAll('handleLanguageChange("es")', 'setLanguage("es")');
content = content.replaceAll('handleLanguageChange("en")', 'setLanguage("en")');

// 8. Replace Hero Section
const heroStart = content.indexOf('<div className="space-y-6">');
const heroEnd = content.indexOf('{/* Gallery Grid */}');
content = content.slice(0, heroStart) + '<HeroSection />\n        </ScrollReveal>\n\n        ' + content.slice(heroEnd);

// 9. Replace Amenities Grid
const amenStart = content.indexOf('<div className="space-y-8 border-b border-[#EFEBE4] pb-10" id="amenidades">');
const amenEnd = content.indexOf('{/* Reviews Section */}');
content = content.slice(0, amenStart) + '<AmenitiesGrid />\n\n            ' + content.slice(amenEnd);

// 10. Replace FoodGuide
const foodStart = content.indexOf('{/* Guía Gastronómica Curada */}');
const foodEnd = content.indexOf('{/* House Rules / Norms (Full Width 12/12) */}');
content = content.slice(0, foodStart) + '<FoodGuide />\n          </div>\n        </div>\n        </ScrollReveal>\n\n        ' + content.slice(foodEnd);

// 11. Replace FAQ and Emergency
const faqStart = content.indexOf('{/* Accordion FAQ Section (Full Width 12/12) */}');
const faqEnd = content.indexOf('</main>');
content = content.slice(0, faqStart) + '<FAQSection />\n\n      ' + content.slice(faqEnd);

fs.writeFileSync("src/app/page.tsx", content);
console.log("Refactoring complete");
