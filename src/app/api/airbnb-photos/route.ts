import { NextResponse } from "next/server";

const LISTING_ID = "1716762976739155303";
const AIRBNB_URL = `https://www.airbnb.com.ar/rooms/${LISTING_ID}`;

// Fallback: known images extracted from the listing (refreshed as needed)
const FALLBACK_PHOTOS = [
  {
    url: `https://a0.muscache.com/im/pictures/hosting/Hosting-${LISTING_ID}/original/f9a4d034-ac6a-42d0-9dd6-76782f465062.jpeg`,
    title: "Living / Sala Principal",
    desc: "Espacio amplio con iluminación natural, TV y rincón bar.",
  },
  {
    url: `https://a0.muscache.com/im/pictures/hosting/Hosting-${LISTING_ID}/original/c3625b05-7402-4130-b23d-a04255713283.jpeg`,
    title: "Dormitorio Principal",
    desc: "Cama Queen size con sábanas premium y Smart TV.",
  },
  {
    url: `https://a0.muscache.com/im/pictures/hosting/Hosting-${LISTING_ID}/original/ee01c89b-03b9-40c4-b537-050dd8da4ecd.jpeg`,
    title: "Cocina Equipada",
    desc: "Cocina completa con electrodomésticos Samsung y Tramontina.",
  },
  {
    url: `https://a0.muscache.com/im/pictures/hosting/Hosting-${LISTING_ID}/original/a82588fa-001a-4c6b-a40d-68c1e80b351b.jpeg`,
    title: "Piscina / Solárium",
    desc: "Terraza compartida con piscina exterior y áreas de relax.",
  },
  {
    url: `https://a0.muscache.com/im/pictures/hosting/Hosting-${LISTING_ID}/original/78831bbc-6b5a-42e4-8d73-d0be59b7b123.jpeg`,
    title: "Vista General",
    desc: "Departamento luminoso en Palermo Hollywood, Buenos Aires.",
  },
];

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const res = await fetch(AIRBNB_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`Airbnb responded ${res.status}`);

    const html = await res.text();

    // Extract all unique listing photo URLs using regex
    const photoRegex = new RegExp(
      `https://a0\\.muscache\\.com/im/pictures/hosting/Hosting-${LISTING_ID}/original/([a-f0-9\\-]+)\\.jpeg`,
      "g"
    );

    const seen = new Set<string>();
    const photos: typeof FALLBACK_PHOTOS = [];
    const fallbackTitles = FALLBACK_PHOTOS.map((p) => ({
      title: p.title,
      desc: p.desc,
    }));

    let match;
    while ((match = photoRegex.exec(html)) !== null) {
      const url = match[0];
      // Strip any query params (they appear duplicated with different sizes)
      const cleanUrl = url.split("?")[0];
      if (!seen.has(cleanUrl)) {
        seen.add(cleanUrl);
        const idx = photos.length;
        photos.push({
          url: cleanUrl,
          title: fallbackTitles[idx]?.title ?? `Foto ${idx + 1}`,
          desc: fallbackTitles[idx]?.desc ?? "Córdoba 5579 — Palermo Hollywood",
        });
      }
    }

    if (photos.length < 3) {
      // Not enough photos parsed, use fallback
      return NextResponse.json(
        { photos: FALLBACK_PHOTOS, source: "fallback" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { photos, source: "airbnb" },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { photos: FALLBACK_PHOTOS, source: "fallback" },
      { status: 200 }
    );
  }
}
