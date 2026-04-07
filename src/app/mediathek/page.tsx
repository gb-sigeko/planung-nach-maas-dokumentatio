import type { Metadata } from "next";
import MediathekClient from "@/components/MediathekClient";

export const metadata: Metadata = {
  title: "Mediathek – Beweismittel Abteistr. 85 | Maas-Protokoll",
  description:
    "Vollständige Mediathek aller Beweismittel: Fotos, Gutachten, Verträge und Nachrichten zur Dokumentation des Planungsversagens von Planung nach Maas (PNM).",
  keywords: [
    "Beweismittel",
    "Planung nach Maas",
    "Maas Nauort",
    "Baumängel",
    "Dokumentation",
    "Fotos",
    "Gutachten",
  ],
};

export default function MediathekPage() {
  return (
    <>
      {/* ──── Page Header ──── */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,.15) 0%, rgba(139,92,246,.08) 100%)",
          borderBottom: "1px solid rgba(99,102,241,.2)",
          padding: "32px 32px 24px",
        }}
      >
        <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span
              style={{
                background: "rgba(99,102,241,.2)",
                color: "#818cf8",
                border: "1px solid rgba(99,102,241,.3)",
                borderRadius: "20px",
                padding: "4px 12px",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: ".05em",
              }}
            >
              📚 MEDIATHEK
            </span>
            <span style={{ color: "#4b5563", fontSize: "0.8rem" }}>
              Automatisch indiziert · Verknüpft mit dem Maas-Protokoll
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
              fontWeight: 900,
              background: "linear-gradient(135deg, #f9fafb 0%, #818cf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Beweismittel-Mediathek
          </h1>
          <p style={{ color: "#9ca3af", marginTop: "8px", fontSize: "0.95rem", maxWidth: "700px" }}>
            Alle Beweisdokumente, Fotos und Gutachten zur Dokumentation{" "}
            <strong style={{ color: "#e5e7eb" }}>Abteistr. 85</strong> – automatisch kategorisiert,
            beschlagwortet und den Kapiteln des Maas-Protokolls zugeordnet.
          </p>
        </div>
      </div>

      {/* ──── Mediathek Client ──── */}
      <MediathekClient />
    </>
  );
}
