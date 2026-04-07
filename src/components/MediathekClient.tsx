"use client";

import { useState, useEffect, useMemo } from "react";
import { AssetFile, MetadataStore, fetchMetadata, formatBytes, formatDate } from "@/lib/assets";

// ─── ICON MAP ────────────────────────────────────────────────────────────────
function CategoryIcon({ category }: { category: string }) {
  const icons: Record<string, string> = {
    bild: "🖼️",
    dokument: "📄",
    tabelle: "📊",
    nachricht: "💬",
    video: "🎬",
    sonstiges: "📎",
  };
  return <span className="text-xl">{icons[category] ?? "📎"}</span>;
}

// ─── LIGHTBOX / VIEWER ───────────────────────────────────────────────────────
function AssetViewer({
  file,
  onClose,
}: {
  file: AssetFile;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="mediathek-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Vorschau: ${file.filename}`}
    >
      <div
        className="mediathek-lightbox"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mediathek-lightbox-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <CategoryIcon category={file.category} />
            <span style={{ fontWeight: 700, color: "#f9fafb", fontSize: "1rem" }}>
              {file.filename}
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <a
              href={file.publicUrl}
              download={file.filename}
              className="mediathek-btn mediathek-btn-primary"
              onClick={(e) => e.stopPropagation()}
            >
              ⬇ Download
            </a>
            <button
              className="mediathek-btn mediathek-btn-ghost"
              onClick={onClose}
              aria-label="Schließen"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mediathek-lightbox-body">
          {file.category === "bild" && (
            <img
              src={file.publicUrl}
              alt={file.filename}
              style={{
                maxWidth: "100%",
                maxHeight: "60vh",
                objectFit: "contain",
                borderRadius: "8px",
                display: "block",
                margin: "0 auto",
              }}
            />
          )}
          {file.category === "dokument" && file.mimeType === "application/pdf" && (
            <iframe
              src={`${file.publicUrl}#toolbar=1`}
              title={file.filename}
              style={{
                width: "100%",
                height: "60vh",
                border: "none",
                borderRadius: "8px",
                background: "#fff",
              }}
            />
          )}
          {(file.category === "nachricht" || file.mimeType === "text/plain") && (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: "#d1d5db",
                fontSize: "0.85rem",
                lineHeight: 1.7,
                maxHeight: "50vh",
                overflowY: "auto",
                padding: "16px",
                background: "rgba(0,0,0,.3)",
                borderRadius: "8px",
              }}
            >
              {file.textPreview || "[Kein Vorschau-Text verfügbar]"}
            </pre>
          )}
          {!["bild", "dokument", "nachricht"].includes(file.category) &&
            file.mimeType !== "text/plain" && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280" }}>
                <span style={{ fontSize: "4rem" }}>📎</span>
                <p style={{ marginTop: "12px" }}>
                  Keine inline-Vorschau für {file.mimeType}.
                </p>
                <a
                  href={file.publicUrl}
                  download={file.filename}
                  className="mediathek-btn mediathek-btn-primary"
                  style={{ marginTop: "16px", display: "inline-block" }}
                >
                  ⬇ Datei herunterladen
                </a>
              </div>
            )}
        </div>

        {/* Meta info */}
        <div className="mediathek-lightbox-meta">
          <div className="mediathek-meta-grid">
            <div>
              <span className="mediathek-meta-label">Typ</span>
              <span className="mediathek-meta-value">{file.mimeType}</span>
            </div>
            <div>
              <span className="mediathek-meta-label">Größe</span>
              <span className="mediathek-meta-value">{formatBytes(file.size)}</span>
            </div>
            <div>
              <span className="mediathek-meta-label">Erstellt</span>
              <span className="mediathek-meta-value">{formatDate(file.createdAt)}</span>
            </div>
            <div>
              <span className="mediathek-meta-label">Geändert</span>
              <span className="mediathek-meta-value">{formatDate(file.modifiedAt)}</span>
            </div>
          </div>
          {file.autoTags.length > 0 && (
            <div style={{ marginTop: "12px" }}>
              <span className="mediathek-meta-label" style={{ display: "block", marginBottom: "6px" }}>
                Tags
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {file.autoTags.map((t) => (
                  <span key={t} className="mediathek-tag">{t}</span>
                ))}
              </div>
            </div>
          )}
          {file.linkedChapters.length > 0 && (
            <div style={{ marginTop: "12px" }}>
              <span className="mediathek-meta-label" style={{ display: "block", marginBottom: "6px" }}>
                Verknüpfte Kapitel
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {file.linkedChapters.map((ch) => (
                  <span key={ch.id} style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
                    <strong style={{ color: "#e5e7eb" }}>Kap. {ch.id}:</strong> {ch.title}{" "}
                    <span style={{ color: "#6b7280" }}>({ch.phase})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
          {file.textPreview && file.category !== "nachricht" && (
            <div style={{ marginTop: "12px" }}>
              <span className="mediathek-meta-label" style={{ display: "block", marginBottom: "6px" }}>
                Inhalts-Vorschau
              </span>
              <p style={{ color: "#9ca3af", fontSize: "0.8rem", lineHeight: 1.6 }}>
                {file.textPreview.slice(0, 200)}
                {file.textPreview.length > 200 ? "…" : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── GALLERY CARD ────────────────────────────────────────────────────────────
function AssetCard({ file, onClick }: { file: AssetFile; onClick: () => void }) {
  return (
    <div
      className="mediathek-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`${file.filename} öffnen`}
    >
      {/* Preview Area */}
      <div className="mediathek-card-preview">
        {file.category === "bild" ? (
          <img
            src={file.publicUrl}
            alt={file.filename}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div className="mediathek-card-icon">
            <CategoryIcon category={file.category} />
          </div>
        )}
        <div className="mediathek-card-category-badge">
          {file.category.toUpperCase()}
        </div>
      </div>

      {/* Info */}
      <div className="mediathek-card-info">
        <p className="mediathek-card-title" title={file.filename}>
          {file.filename}
        </p>
        <p className="mediathek-card-meta">
          {formatDate(file.createdAt)} · {formatBytes(file.size)}
        </p>
        {file.autoTags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
            {file.autoTags.slice(0, 3).map((t) => (
              <span key={t} className="mediathek-tag mediathek-tag-sm">{t}</span>
            ))}
            {file.autoTags.length > 3 && (
              <span className="mediathek-tag mediathek-tag-sm">+{file.autoTags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STAT BAR ────────────────────────────────────────────────────────────────
function StatBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{ marginBottom: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>{label}</span>
        <span style={{ color: "#e5e7eb", fontSize: "0.8rem", fontWeight: 600 }}>{count}</span>
      </div>
      <div style={{ height: "4px", background: "rgba(55,65,81,.6)", borderRadius: "2px" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "2px", transition: "width .6s ease" }} />
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function MediathekClient() {
  const [store, setStore] = useState<MetadataStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<AssetFile | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("alle");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date");

  useEffect(() => {
    fetchMetadata().then((data) => {
      setStore(data);
      setLoading(false);
    });
  }, []);

  // Reload button
  const handleReload = async () => {
    setLoading(true);
    const data = await fetchMetadata();
    setStore(data);
    setLoading(false);
  };

  // Collect all tags
  const allTags = useMemo(() => {
    if (!store) return [];
    const tagSet = new Set<string>();
    store.files.forEach((f) => f.autoTags.forEach((t) => tagSet.add(t)));
    return [...tagSet].sort();
  }, [store]);

  // Filtered + sorted files
  const filteredFiles = useMemo(() => {
    if (!store) return [];
    let files = store.files;

    if (activeCategory !== "alle") {
      files = files.filter((f) => f.category === activeCategory);
    }
    if (activeTag) {
      files = files.filter((f) => f.autoTags.includes(activeTag));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      files = files.filter(
        (f) =>
          f.filename.toLowerCase().includes(q) ||
          f.textPreview.toLowerCase().includes(q) ||
          f.autoTags.some((t) => t.toLowerCase().includes(q)) ||
          f.linkedChapters.some((ch) => ch.title.toLowerCase().includes(q))
      );
    }

    return [...files].sort((a, b) => {
      if (sortBy === "date") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "name") return a.filename.localeCompare(b.filename);
      if (sortBy === "size") return b.size - a.size;
      return 0;
    });
  }, [store, activeCategory, activeTag, searchQuery, sortBy]);

  const CATEGORIES = [
    { key: "alle", label: "Alle", color: "#6366f1" },
    { key: "bild", label: "Bilder 🖼️", color: "#10b981" },
    { key: "dokument", label: "Dokumente 📄", color: "#f59e0b" },
    { key: "tabelle", label: "Tabellen 📊", color: "#3b82f6" },
    { key: "nachricht", label: "Nachrichten 💬", color: "#8b5cf6" },
    { key: "video", label: "Videos 🎬", color: "#ef4444" },
  ];

  const CAT_COLORS: Record<string, string> = {
    bild: "#10b981", dokument: "#f59e0b", tabelle: "#3b82f6",
    nachricht: "#8b5cf6", video: "#ef4444", sonstiges: "#6b7280",
  };

  return (
    <div className="mediathek-root">
      {/* ── SIDEBAR ── */}
      <aside className="mediathek-sidebar">
        <div className="mediathek-sidebar-header">
          <span style={{ fontSize: "1.5rem" }}>📚</span>
          <h2 style={{ color: "#f9fafb", fontWeight: 800, fontSize: "1.1rem" }}>Mediathek</h2>
        </div>

        {store && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ color: "#6b7280", fontSize: "0.75rem", marginBottom: "12px", textTransform: "uppercase", letterSpacing: ".05em" }}>
              Dateien gesamt
            </p>
            <p style={{ color: "#f9fafb", fontSize: "2rem", fontWeight: 900, lineHeight: 1 }}>
              {store.totalFiles}
            </p>
            {store.generatedAt && (
              <p style={{ color: "#4b5563", fontSize: "0.7rem", marginTop: "4px" }}>
                Indiziert: {formatDate(store.generatedAt)}
              </p>
            )}
            <div style={{ marginTop: "16px" }}>
              {Object.entries(store.byCategory).map(([cat, count]) => (
                <StatBar
                  key={cat}
                  label={cat}
                  count={count}
                  total={store.totalFiles}
                  color={CAT_COLORS[cat] ?? "#6b7280"}
                />
              ))}
            </div>
          </div>
        )}

        <p style={{ color: "#6b7280", fontSize: "0.75rem", marginBottom: "8px", textTransform: "uppercase", letterSpacing: ".05em" }}>
          Kategorie
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "20px" }}>
          {CATEGORIES.map((cat) => {
            const count = cat.key === "alle" ? store?.totalFiles ?? 0 : store?.byCategory?.[cat.key] ?? 0;
            if (count === 0 && cat.key !== "alle") return null;
            return (
              <button
                key={cat.key}
                className={`mediathek-filter-btn ${activeCategory === cat.key ? "active" : ""}`}
                style={activeCategory === cat.key ? { borderColor: cat.color, color: cat.color } : {}}
                onClick={() => { setActiveCategory(cat.key); setActiveTag(null); }}
              >
                <span>{cat.label}</span>
                <span className="mediathek-filter-count">{count}</span>
              </button>
            );
          })}
        </div>

        {allTags.length > 0 && (
          <>
            <p style={{ color: "#6b7280", fontSize: "0.75rem", marginBottom: "8px", textTransform: "uppercase", letterSpacing: ".05em" }}>
              Tags
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`mediathek-tag-btn ${activeTag === tag ? "active" : ""}`}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </>
        )}

        <div style={{ marginTop: "20px" }}>
          <button
            className="mediathek-btn mediathek-btn-ghost"
            style={{ width: "100%", fontSize: "0.8rem" }}
            onClick={handleReload}
          >
            🔄 Neu laden
          </button>
        </div>

        {store?.error && (
          <div className="mediathek-error-box" style={{ marginTop: "16px" }}>
            <strong>⚠ Hinweis:</strong><br />
            {store.error}
          </div>
        )}
      </aside>

      {/* ── MAIN ── */}
      <main className="mediathek-main">
        {/* Toolbar */}
        <div className="mediathek-toolbar">
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6b7280" }}>🔍</span>
            <input
              id="mediathek-search"
              type="search"
              placeholder="Dateiname, Inhalt, Tag oder Kapitel suchen …"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mediathek-search"
              aria-label="Mediathek durchsuchen"
            />
          </div>
          <select
            id="mediathek-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "name" | "size")}
            className="mediathek-select"
            aria-label="Sortierung"
          >
            <option value="date">📅 Datum</option>
            <option value="name">🔤 Name</option>
            <option value="size">📦 Größe</option>
          </select>
          <span style={{ color: "#6b7280", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
            {filteredFiles.length} Datei{filteredFiles.length !== 1 ? "en" : ""}
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="mediathek-loading">
            <div className="mediathek-spinner" />
            <p>Mediathek wird geladen …</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="mediathek-empty">
            <span style={{ fontSize: "3rem" }}>📂</span>
            <p style={{ color: "#9ca3af", marginTop: "12px" }}>
              {store?.totalFiles === 0
                ? "Noch keine Dateien indiziert. Führe scripts/index-assets.mjs aus."
                : "Keine Dateien für diesen Filter gefunden."}
            </p>
          </div>
        ) : (
          <div className="mediathek-grid">
            {filteredFiles.map((file) => (
              <AssetCard
                key={file.id}
                file={file}
                onClick={() => setSelectedFile(file)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Lightbox */}
      {selectedFile && (
        <AssetViewer file={selectedFile} onClose={() => setSelectedFile(null)} />
      )}
    </div>
  );
}
