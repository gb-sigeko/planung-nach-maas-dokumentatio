/**
 * ============================================================
 * FULL-ASSET INDEXER – Abteistr. 85 / Maas-Protokoll
 * ============================================================
 * Scannt alle Dateien im lokalen HiDrive-Sync-Ordner,
 * extrahiert Metadaten & Text-Previews und ordnet jede Datei
 * automatisch den Kapiteln des Maas-Protokolls zu.
 *
 * Aufruf:  node scripts/index-assets.mjs
 * ============================================================
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------
// KONFIGURATION – Pfad zum lokalen HiDrive-Sync-Ordner anpassen
// ---------------------------------------------------------------
const HIDRIVE_ROOT = path.resolve(
  __dirname,
  "../../../../"  // c:\Users\Computer\HiDrive\users\gerhardb01\
);

// Ordner, die gescannt werden sollen (relativ zu HIDRIVE_ROOT)
const SCAN_DIRS = [
  ".",  // ganzes Sync-Verzeichnis
];

// Output-Pfad für metadata.json
const OUTPUT_FILE = path.resolve(__dirname, "../public/metadata.json");

// ---------------------------------------------------------------
// MIME-TYPES
// ---------------------------------------------------------------
const MIME_MAP = {
  ".pdf":  "application/pdf",
  ".doc":  "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".odf":  "application/vnd.oasis.opendocument.text",
  ".odt":  "application/vnd.oasis.opendocument.text",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xls":  "application/vnd.ms-excel",
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

const SUPPORTED_EXTENSIONS = new Set(Object.keys(MIME_MAP));

// ---------------------------------------------------------------
// AUTO-TAGGING: Schlagwort → Kapitel-IDs des Maas-Protokolls
// ---------------------------------------------------------------
const TAG_RULES = [
  // Wasserschaden
  { keywords: ["wasser", "schaden", "trocknung", "bitumen", "abdichtung", "wassereintr", "leckage"], chapters: [6], tags: ["Wasserschaden"] },
  // Statik & Rohbau
  { keywords: ["statik", "rohbau", "ringanker", "beton", "schalung", "bewehru", "fundament", "keller"], chapters: [1, 7, 18], tags: ["Statik", "Rohbau"] },
  // Raumhöhe
  { keywords: ["raumhöhe", "2,26", "226", "2.26", "höhe", "decke", "aufenthalts"], chapters: [1], tags: ["Raumhöhe"] },
  // Baustopp
  { keywords: ["baustopp", "kreisverwaltung", "behörde", "genehmigung", "bauamt"], chapters: [18, 37], tags: ["Baustopp", "Behörde"] },
  // Hofbauer / Sanierung 2026
  { keywords: ["hofbauer", "lehmputz", "putz", "sanierung", "2026", "kernsanierung"], chapters: [44], tags: ["Hofbauer", "Sanierung_2026"] },
  // Bank / Finanzen
  { keywords: ["bank", "kredit", "darlehen", "tilgung", "finanzierung", "nkv", "nachfinanzierung", "zinsen"], chapters: [29, 30], tags: ["Bank", "Finanzen"] },
  // Elektro
  { keywords: ["elektro", "strom", "evn", "evus", "dachständer", "installation", "schaltplan", "kabel"], chapters: [7, 28], tags: ["Elektro"] },
  // Qualifikation / Versicherung
  { keywords: ["qualifikation", "bauvorlageberechtigung", "lbo", "kern", "strohmann", "unterschrift", "stempel"], chapters: [39], tags: ["Qualifikation", "Baurecht"] },
  { keywords: ["versicherung", "haftpflicht", "berufshaftpflicht", "haftung"], chapters: [40], tags: ["Versicherung"] },
  // Sanitär / WC
  { keywords: ["sanitär", "abfluss", "wc", "toilet", "rohr", "schlitz", "durchbruch", "gäste"], chapters: [4], tags: ["Sanitär"] },
  // Gutachter
  { keywords: ["gutachten", "gutachter", "petschenka", "sachverständig", "seuferle"], chapters: [6, 42], tags: ["Gutachten"] },
  // Mediation / Rechtsanwalt
  { keywords: ["mediation", "nitschke", "rechtsanwalt", "ra ", "anwalt", "klage", "schreiben"], chapters: [42, 43], tags: ["Mediation", "Rechtsanwalt"] },
  // Verträge / Aufhebung
  { keywords: ["aufhebung", "kündigung", "vertrag", "trennung", "pnm"], chapters: [43], tags: ["Aufhebungsvertrag"] },
  // Beweissicherung
  { keywords: ["beweis", "nachbar", "riss", "dokumentation", "foto", "protokoll"], chapters: [37], tags: ["Beweissicherung"] },
  // Verzug / Zeitplan
  { keywords: ["verzug", "verzögerung", "zeitplan", "bauzeit", "terminplan", "frist"], chapters: [29], tags: ["Bauzeitverzug"] },
  // Kosten / Nachtrag
  { keywords: ["kosten", "rechnung", "nachtrag", "angebot", "abrechnung", "honorar", "baukosten"], chapters: [30], tags: ["Kostenanalyse"] },
  // Zimm / Dach
  { keywords: ["zimmerer", "dach", "dachstuhl", "sparren", "pfette", "holz"], chapters: [1, 18], tags: ["Rohbau", "Zimmerei"] },
];

// ---------------------------------------------------------------
// KAPITEL-LOOKUP (aus content_master.json)
// ---------------------------------------------------------------
const CONTENT_MASTER_PATH = path.resolve(__dirname, "../../content_master.json");
let chapterLookup = {};
try {
  const cm = JSON.parse(fs.readFileSync(CONTENT_MASTER_PATH, "utf8"));
  for (const phase of cm.phases) {
    for (const ch of phase.chapters) {
      chapterLookup[ch.id] = { title: ch.title, phase: phase.name };
    }
  }
} catch (_) {
  console.warn("⚠ content_master.json nicht gefunden – Kapitel-Lookup leer.");
}

// ---------------------------------------------------------------
// UTILITY: Text-Preview (max 300 Zeichen)
// ---------------------------------------------------------------
function makePreview(text, maxChars = 300) {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim().slice(0, maxChars);
}

// ---------------------------------------------------------------
// UTILITY: Stabile Cloud-ID aus Pfad + Größe + mtime
// ---------------------------------------------------------------
function makeFileId(filePath, stat) {
  return crypto
    .createHash("sha1")
    .update(`${filePath}|${stat.size}|${stat.mtimeMs}`)
    .digest("hex")
    .slice(0, 12);
}

// ---------------------------------------------------------------
// AUTO-TAGGER
// ---------------------------------------------------------------
function autoTag(filename, textPreview) {
  const searchText = (filename + " " + textPreview).toLowerCase();
  const matchedChapters = new Set();
  const matchedTags = new Set();

  for (const rule of TAG_RULES) {
    if (rule.keywords.some((kw) => searchText.includes(kw))) {
      rule.chapters.forEach((c) => matchedChapters.add(c));
      rule.tags.forEach((t) => matchedTags.add(t));
    }
  }

  return {
    chapters: [...matchedChapters].map((id) => ({
      id,
      title: chapterLookup[id]?.title ?? `Kapitel ${id}`,
      phase: chapterLookup[id]?.phase ?? "",
    })),
    tags: [...matchedTags],
  };
}

// ---------------------------------------------------------------
// TEXT EXTRACTION (sync, lightweight – kein OCR-Dienst nötig)
// ---------------------------------------------------------------
async function extractTextPreview(filePath, ext) {
  try {
    if (ext === ".txt" || ext === ".csv") {
      const raw = fs.readFileSync(filePath, "utf8");
      return makePreview(raw);
    }
    if (ext === ".pdf") {
      // lazy-import, schlägt fehl wenn paket fehlt
      try {
        const { default: pdfParse } = await import("pdf-parse/lib/pdf-parse.js");
        const buf = fs.readFileSync(filePath);
        const data = await pdfParse(buf);
        return makePreview(data.text);
      } catch {
        return "[PDF: Text-Extraktion fehlgeschlagen – pdf-parse nicht verfügbar]";
      }
    }
    if (ext === ".docx") {
      try {
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ path: filePath });
        return makePreview(result.value);
      } catch {
        return "[DOCX: Text-Extraktion fehlgeschlagen]";
      }
    }
    if ([".jpg", ".jpeg", ".png", ".heic", ".webp"].includes(ext)) {
      return "[Bild – OCR nicht lokal verfügbar. Vorschau über Next.js API.]";
    }
    return "[Kein Text-Extract für diesen Dateityp]";
  } catch (err) {
    return `[Fehler: ${err.message}]`;
  }
}

// ---------------------------------------------------------------
// REKURSIVER DATEI-SCANNER
// ---------------------------------------------------------------
async function scanDir(dirPath, baseRoot) {
  const results = [];
  let entries;
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    // Versteckte Ordner und node_modules überspringen
    if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === ".next") {
      continue;
    }

    if (entry.isDirectory()) {
      const sub = await scanDir(fullPath, baseRoot);
      results.push(...sub);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!SUPPORTED_EXTENSIONS.has(ext)) continue;

      const stat = fs.statSync(fullPath);
      const relativePath = path.relative(baseRoot, fullPath).replace(/\\/g, "/");
      const mimeType = MIME_MAP[ext] ?? "application/octet-stream";

      process.stdout.write(`  📄 ${relativePath} ...`);

      const textPreview = await extractTextPreview(fullPath, ext);
      const { chapters, tags } = autoTag(entry.name, textPreview);

      // Bestimme Kategorie
      let category = "sonstiges";
      if ([".jpg", ".jpeg", ".png", ".heic", ".webp", ".gif"].includes(ext)) category = "bild";
      else if (ext === ".pdf") category = "dokument";
      else if ([".doc", ".docx", ".odf", ".odt"].includes(ext)) category = "dokument";
      else if ([".xlsx", ".xls", ".csv"].includes(ext)) category = "tabelle";
      else if (ext === ".txt") category = "nachricht";
      else if ([".mp4", ".mov"].includes(ext)) category = "video";

      const fileEntry = {
        id: makeFileId(relativePath, stat),
        filename: entry.name,
        relativePath,
        mimeType,
        category,
        size: stat.size,
        createdAt: stat.birthtime.toISOString(),
        modifiedAt: stat.mtime.toISOString(),
        textPreview,
        autoTags: tags,
        linkedChapters: chapters,
        // Platzhalterpfad für spätere Public-URL
        publicUrl: `/api/assets/${encodeURIComponent(relativePath)}`,
      };

      results.push(fileEntry);
      console.log(` ✓ [${category}] ${tags.join(", ") || "ungetaggt"}`);
    }
  }
  return results;
}

// ---------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------
(async () => {
  console.log("🔍 Starte Asset-Indexierung ...");
  console.log(`   Root: ${HIDRIVE_ROOT}`);
  console.log(`   Output: ${OUTPUT_FILE}\n`);

  const allFiles = [];

  for (const scanDir_ of SCAN_DIRS) {
    const absDir = path.resolve(HIDRIVE_ROOT, scanDir_);
    if (!fs.existsSync(absDir)) {
      console.warn(`⚠ Verzeichnis nicht gefunden: ${absDir}`);
      continue;
    }
    const files = await scanDir(absDir, HIDRIVE_ROOT);
    allFiles.push(...files);
  }

  const metadata = {
    generatedAt: new Date().toISOString(),
    totalFiles: allFiles.length,
    byCategory: allFiles.reduce((acc, f) => {
      acc[f.category] = (acc[f.category] ?? 0) + 1;
      return acc;
    }, {}),
    files: allFiles,
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(metadata, null, 2), "utf8");

  console.log(`\n✅ Fertig! ${allFiles.length} Dateien indiziert.`);
  console.log(`📁 Gespeichert: ${OUTPUT_FILE}`);
  console.log("\nKategorien:");
  for (const [cat, count] of Object.entries(metadata.byCategory)) {
    console.log(`  ${cat}: ${count}`);
  }
})();
