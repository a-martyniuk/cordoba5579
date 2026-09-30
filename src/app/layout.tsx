import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "../context/LanguageContext";
import { ThemeProvider } from "../context/ThemeContext";
import "./globals.css";
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Córdoba 5579 | Alquiler Temporal Premium en Palermo Hollywood, CABA",
  description:
    "Disfruta de una estadía exclusiva en este departamento de diseño a estrenar. Con piscina en terraza, solárium, Smart TV, WiFi de alta velocidad y a pasos de los mejores restaurantes y el Movistar Arena.",
  keywords: [
    "alquiler temporal",
    "buenos aires",
    "palermo hollywood",
    "movistar arena",
    "airbnb buenos aires",
    "departamento premium",
  ],
  authors: [{ name: "Jorge Orlando" }],
  icons: {
    icon: [{ url: "/cordoba5579/favicon.svg?v=4", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Córdoba 5579 | Alquiler Temporal Premium en Palermo Hollywood",
    description:
      "Departamento a estrenar con amenities de lujo, piscina, solárium y ubicación estratégica.",
    url: "https://www.alexismartyniuk.com.ar/cordoba5579",
    siteName: "Córdoba 5579",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Córdoba 5579 | Alquiler Temporal Premium",
    description: "Amenities de lujo y ubicación privilegiada en Palermo Hollywood.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Apartment",
  name: "Córdoba 5579 — Palermo Hollywood",
  description:
    "Departamento de diseño a estrenar en Palermo Hollywood, Buenos Aires. Piscina en terraza, solárium, Smart TV, WiFi de alta velocidad y a pasos del Movistar Arena.",
  url: "https://www.alexismartyniuk.com.ar/cordoba5579",
  image:
    "https://a0.muscache.com/im/pictures/hosting/Hosting-1716762976739155303/original/f9a4d034-ac6a-42d0-9dd6-76782f465062.jpeg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Córdoba 5579",
    addressLocality: "Palermo Hollywood",
    addressRegion: "Buenos Aires",
    addressCountry: "AR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -34.5886,
    longitude: -58.4332,
  },
  numberOfRooms: 1,
  floorSize: {
    "@type": "QuantitativeValue",
    value: 45,
    unitCode: "MTK",
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "WiFi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Piscina", value: true },
    { "@type": "LocationFeatureSpecification", name: "Aire acondicionado", value: true },
    { "@type": "LocationFeatureSpecification", name: "Smart TV", value: true },
    { "@type": "LocationFeatureSpecification", name: "Cocina equipada", value: true },
  ],
  telephone: "+5491145379500",
  priceRange: "USD 45-80 / noche",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="icon" href="/cordoba5579/favicon.svg?v=4" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/cordoba5579/favicon.svg?v=4" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#5F6F52" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Dark mode: respect OS preference when no saved preference exists */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('darkMode');
                if (saved === 'true' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />

        {/* PWA Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(reg) { console.log('PWA ServiceWorker registered:', reg.scope); },
                    function(err) { console.log('PWA ServiceWorker failed:', err); }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${plusJakarta.variable} font-sans antialiased bg-[#FAF9F7] text-neutral-900`}
      >
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <Analytics />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
