import { google } from "googleapis";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];

const FOLDER_ID = process.env.DRIVE_FOLDER_ID;
const CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// Keywords for smart matching files to chapters
const chapterKeywords: Record<number, string[]> = {
  39: ["bauantrag", "stempel", "kern", "whatsapp", "lüge", "haustür"],
  40: ["versicherung", "haftpflicht", "anfrage", "vakuum"],
  7:  ["strom", "dachständer", "evu", "notstrom"],
  37: ["beweissicherung", "nitschke", "riss", "nachbar"],
  1:  ["raumhöhe", "2,26", "zimmerer", "altmann", "240"],
  18: ["baustopp", "kreisverwaltung", "selbstprovoziert"],
  6:  ["fahrlässigkeit", "bitumen", "wassereintritt", "petschenka", "trocknung"],
  4:  ["gästewc", "abfluss", "stemmarbeiten"],
  28: ["elektro", "installationsplanung", "elektriker", "vakuum"],
  29: ["tilgung", "verzugsschaden", "monate", "doppelbelastung"],
  30: ["kostenexplosion", "nachfinanzierung", "ringanker", "entwässerung"],
  42: ["mediation", "nitschke", "seuferle", "protokoll"],
  43: ["aufhebungsvertrag", "trennung"],
  44: ["sanierung", "hofbauer", "lehmputz", "spätfolgen"],
};

async function getDriveService() {
  if (!CREDENTIALS_PATH || !fs.existsSync(CREDENTIALS_PATH)) {
    console.warn("⚠️  GOOGLE_APPLICATION_CREDENTIALS not found. Running in mock mode.");
    return null;
  }
  if (!FOLDER_ID) {
    console.warn("⚠️  DRIVE_FOLDER_ID not set. Running in mock mode.");
    return null;
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES,
  });
  return google.drive({ version: "v3", auth });
}

export interface IndexedFile {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  createdTime?: string;
  matchedChapterIds: number[];
  webViewLink?: string;
  thumbnailLink?: string;
}

export interface DynamicIndex {
  lastUpdated: string;
  files: IndexedFile[];
  stats: {
    totalFiles: number;
    totalImages: number;
    totalDocuments: number;
  };
}

// Simple smart-match based on filename
function matchChapters(filename: string): number[] {
  const name = filename.toLowerCase();
  const matched = new Set<number>();
  
  for (const [chapterIdStr, keywords] of Object.entries(chapterKeywords)) {
    for (const kw of keywords) {
      if (name.includes(kw.toLowerCase())) {
        matched.add(parseInt(chapterIdStr, 10));
      }
    }
  }
  return Array.from(matched);
}

async function runIndexer() {
  console.log("🚀 Starting Dynamic Cloud Auto-Indexer...");
  const drive = await getDriveService();

  let filesList: any[] = [];
  
  if (drive) {
    console.log(`Scanning Google Drive folder: ${FOLDER_ID}`);
    try {
      const res = await drive.files.list({
        q: `'${FOLDER_ID}' in parents and trashed = false`,
        fields: "files(id, name, mimeType, size, createdTime, webViewLink, thumbnailLink)",
      });
      filesList = res.data.files || [];
      console.log(`Found ${filesList.length} files in Drive.`);
    } catch (err: any) {
      console.error("Error fetching files from Google Drive:", err.message);
      console.log("Falling back to local fallback data.");
    }
  }

  if (filesList.length === 0) {
    console.log("No files retrieved from Drive. Using mock local index for demonstration.");
    // Provide some mock files matching the original setup
    filesList = [
      { id: "mock1", name: "Bauantrag_Stempel_Kern.pdf", mimeType: "application/pdf" },
      { id: "mock2", name: "Gutachten_Petschenka.pdf", mimeType: "application/pdf" },
      { id: "mock3", name: "Foto_Stemmarbeiten_Nachrüstung.jpg", mimeType: "image/jpeg" },
      { id: "mock4", name: "Aufhebungsvertrag_Unterzeichnet.pdf", mimeType: "application/pdf" },
    ];
  }

  const indexedFiles: IndexedFile[] = filesList.map((f) => ({
    id: f.id!,
    name: f.name!,
    mimeType: f.mimeType!,
    size: f.size ? parseInt(f.size) : undefined,
    createdTime: f.createdTime,
    webViewLink: f.webViewLink,
    thumbnailLink: f.thumbnailLink,
    matchedChapterIds: matchChapters(f.name!),
  }));

  const stats = {
    totalFiles: indexedFiles.length,
    totalImages: indexedFiles.filter(f => f.mimeType.startsWith('image/')).length,
    totalDocuments: indexedFiles.filter(f => f.mimeType.includes('pdf') || f.mimeType.includes('word')).length,
  };

  const dynamicIndex: DynamicIndex = {
    lastUpdated: new Date().toISOString(),
    files: indexedFiles,
    stats,
  };

  const outputPath = path.join(__dirname, "..", "src", "lib", "dynamic_index.json");
  fs.writeFileSync(outputPath, JSON.stringify(dynamicIndex, null, 2));

  console.log(`✅ Index successful! Saved to ${outputPath}`);
  console.log(`📊 Stats: ${stats.totalFiles} files (${stats.totalImages} images, ${stats.totalDocuments} docs)`);
}

runIndexer().catch(console.error);
