import { NextResponse } from "next/server";

const ICAL_URL = process.env.AIRBNB_ICAL_URL ?? "";

// Cache parsed dates in memory for this serverless instance lifetime
let cachedDates: string[] = [];
let lastFetch = 0;
const CACHE_MS = 60 * 60 * 1000; // 1 hour

export const revalidate = 3600;

function parseICalDates(ical: string): string[] {
  const blocked: string[] = [];
  const lines = ical.split(/\r?\n/);
  let inEvent = false;
  let dtStart = "";
  let dtEnd = "";

  for (const line of lines) {
    if (line.startsWith("BEGIN:VEVENT")) {
      inEvent = true;
      dtStart = "";
      dtEnd = "";
    } else if (line.startsWith("END:VEVENT") && inEvent) {
      // Fill all dates between dtStart and dtEnd
      if (dtStart && dtEnd) {
        const start = new Date(
          `${dtStart.slice(0, 4)}-${dtStart.slice(4, 6)}-${dtStart.slice(6, 8)}`
        );
        const end = new Date(
          `${dtEnd.slice(0, 4)}-${dtEnd.slice(4, 6)}-${dtEnd.slice(6, 8)}`
        );
        const current = new Date(start);
        while (current < end) {
          blocked.push(current.toISOString().split("T")[0]);
          current.setDate(current.getDate() + 1);
        }
      }
      inEvent = false;
    } else if (inEvent) {
      if (line.startsWith("DTSTART;VALUE=DATE:") || line.startsWith("DTSTART:")) {
        dtStart = line.split(":").pop()?.replace(/T.*/,"") ?? "";
      } else if (line.startsWith("DTEND;VALUE=DATE:") || line.startsWith("DTEND:")) {
        dtEnd = line.split(":").pop()?.replace(/T.*/,"") ?? "";
      }
    }
  }
  return [...new Set(blocked)];
}

export async function GET() {
  if (!ICAL_URL) {
    return NextResponse.json({ blockedDates: [], error: "No iCal URL configured" });
  }

  const now = Date.now();
  if (cachedDates.length > 0 && now - lastFetch < CACHE_MS) {
    return NextResponse.json({ blockedDates: cachedDates, source: "cache" });
  }

  try {
    const res = await fetch(ICAL_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`iCal fetch failed: ${res.status}`);
    const ical = await res.text();
    const dates = parseICalDates(ical);
    cachedDates = dates;
    lastFetch = now;
    return NextResponse.json(
      { blockedDates: dates, source: "airbnb" },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { blockedDates: cachedDates, error: msg },
      { status: 200 }
    );
  }
}
