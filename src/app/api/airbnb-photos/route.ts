import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LISTING_ID = "1716762976739155303";

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

export async function GET() {
  try {
    const jsonPath = path.join(process.cwd(), "src", "data", "airbnb-details.json");
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json(
        { photos: FALLBACK_PHOTOS, source: "fallback" },
        { status: 200 }
      );
    }
    
    const rawData = fs.readFileSync(jsonPath, "utf8");
    const data = JSON.parse(rawData);
    const photosList = data.photos || [];
    
    if (photosList.length < 3) {
      return NextResponse.json(
        { photos: FALLBACK_PHOTOS, source: "fallback" },
        { status: 200 }
      );
    }
    
    const photos = photosList.map((url: string, idx: number) => {
      const fallback = FALLBACK_PHOTOS[idx] || {
        title: `Foto ${idx + 1}`,
        desc: "Córdoba 5579 — Palermo Hollywood",
      };
      return {
        url,
        title: fallback.title,
        desc: fallback.desc,
      };
    });
    
    return NextResponse.json(
      { photos, source: "local-details" },
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
