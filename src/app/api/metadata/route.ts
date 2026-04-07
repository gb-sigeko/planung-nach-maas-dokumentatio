/**
 * API Route: /api/metadata
 * Liefert die generierte metadata.json zurück
 */
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const META_PATH = path.resolve(process.cwd(), "public/metadata.json");

export async function GET() {
  try {
    if (!fs.existsSync(META_PATH)) {
      return NextResponse.json(
        {
          error: "metadata.json nicht gefunden. Bitte index-assets.mjs ausführen.",
          generatedAt: null,
          totalFiles: 0,
          files: [],
        },
        { status: 200 }
      );
    }

    const raw = fs.readFileSync(META_PATH, "utf8");
    const data = JSON.parse(raw);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: String(err), files: [] },
      { status: 500 }
    );
  }
}
