/**
 * API Route: /api/assets/[...path]
 * Serviert Dateien direkt aus dem HiDrive-Sync-Ordner
 */
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// HiDrive-Root (anpassen falls nötig)
const HIDRIVE_ROOT = path.resolve(process.cwd(), "../../../../");

const MIME_MAP: Record<string, string> = {
  ".pdf":  "application/pdf",
  ".doc":  "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".odf":  "application/vnd.oasis.opendocument.text",
  ".odt":  "application/vnd.oasis.opendocument.text",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".csv":  "text/csv",
  ".txt":  "text/plain",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png":  "image/png",
  ".heic": "image/heic",
  ".webp": "image/webp",
  ".gif":  "image/gif",
  ".mp4":  "video/mp4",
  ".mov":  "video/quicktime",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const relativePath = pathSegments.join("/");
  
  // Security: keine path traversal
  const resolved = path.resolve(HIDRIVE_ROOT, relativePath);
  if (!resolved.startsWith(HIDRIVE_ROOT)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(resolved)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const ext = path.extname(resolved).toLowerCase();
  const mimeType = MIME_MAP[ext] ?? "application/octet-stream";
  const stat = fs.statSync(resolved);
  const buffer = fs.readFileSync(resolved);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": mimeType,
      "Content-Length": stat.size.toString(),
      "Content-Disposition": `inline; filename="${path.basename(resolved)}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
