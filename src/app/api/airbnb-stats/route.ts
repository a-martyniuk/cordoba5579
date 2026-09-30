import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch("https://www.airbnb.com.ar/rooms/1716762976739155303", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Airbnb HTTP status ${res.status}`);
    }

    const html = await res.text();
    const ratingMatch = html.match(/"starRating"\s*:\s*([0-9\.]+)/) || html.match(/"rating"\s*:\s*([0-9\.]+)/);
    const reviewsMatch = html.match(/"reviewCount"\s*:\s*(\d+)/) || html.match(/"visibleReviewCount"\s*:\s*(\d+)/);

    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 5.0;
    const reviewsCount = reviewsMatch ? parseInt(reviewsMatch[1], 10) : 4;

    return NextResponse.json(
      { rating, reviewsCount, source: "live-airbnb" },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { rating: 5.0, reviewsCount: 4, source: "fallback" },
      { status: 200 }
    );
  }
}
