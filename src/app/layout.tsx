import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
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
  description: "Disfruta de una estadía exclusiva en este departamento de diseño a estrenar. Con piscina en terraza, solárium, cava de vinos y a pasos de los mejores restaurantes y el Movistar Arena.",
  keywords: ["alquiler temporal", "buenos aires", "palermo hollywood", "movistar arena", "airbnb buenos aires", "departamento premium"],
  authors: [{ name: "Jorge Orlando" }],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" }
    ]
  },
  openGraph: {
    title: "Córdoba 5579 | Alquiler Temporal Premium en Palermo Hollywood",
    description: "Departamento a estrenar con amenities de lujo, piscina, solárium y ubicación estratégica.",
    url: "https://www.alexismartyniuk.com.ar/cordoba5579",
    siteName: "Córdoba 5579",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Córdoba 5579 | Alquiler Temporal Premium",
    description: "Amenities de lujo y ubicación privilegiada en Palermo Hollywood.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#5F6F52" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('darkMode') === 'true') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(reg) {
                      console.log('PWA ServiceWorker registered:', reg.scope);
                    },
                    function(err) {
                      console.log('PWA ServiceWorker failed:', err);
                    }
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
        {children}
      </body>
    </html>
  );
}

