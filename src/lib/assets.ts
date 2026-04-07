export interface AssetFile {
  id: string;
  filename: string;
  relativePath: string;
  mimeType: string;
  category: "bild" | "dokument" | "tabelle" | "nachricht" | "video" | "sonstiges";
  size: number;
  createdAt: string;
  modifiedAt: string;
  textPreview: string;
  autoTags: string[];
  linkedChapters: Array<{
    id: number;
    title: string;
    phase: string;
  }>;
  publicUrl: string;
}

export interface MetadataStore {
  generatedAt: string | null;
  totalFiles: number;
  byCategory: Record<string, number>;
  files: AssetFile[];
  error?: string;
}

export async function fetchMetadata(): Promise<MetadataStore> {
  try {
    const res = await fetch("/api/metadata", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return {
      generatedAt: null,
      totalFiles: 0,
      byCategory: {},
      files: [],
      error: "Fetch fehlgeschlagen",
    };
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function formatDate(iso: string): string {
  if (!iso) return "–";
  return new Date(iso).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
