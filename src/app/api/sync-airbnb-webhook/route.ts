import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Allow CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Define target file path
    const dataDir = path.join(process.cwd(), "src", "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const targetFile = path.join(dataDir, "airbnb-details.json");
    
    // Save details to JSON
    fs.writeFileSync(targetFile, JSON.stringify(data, null, 2), "utf8");
    
    return NextResponse.json(
      { success: true, message: "Airbnb data synchronized successfully" },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: msg },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
