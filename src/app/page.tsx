import { contentData, financialData } from "@/lib/data";
import { DamageTicker } from "@/components/DamageTicker";
import { DelayBar } from "@/components/DelayBar";
import { CostTable } from "@/components/CostTable";
import { Timeline } from "@/components/Timeline";

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-bg)" }}
    >
      {/* ===== HEADER / HERO ===== */}
      <header
        className="relative overflow-hidden border-b"
        style={{ borderColor: "rgba(220,38,38,0.2)" }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(220,38,38,0.12) 0%, transparent 60%)",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {/* Warning badge */}
          <div className="section-badge mb-6">
            <span>🔍</span>
            <span>Investigative Dokumentation · öffentliches Interesse</span>
          </div>

          {/* Main title */}
          <h1
            className="text-3xl sm:text-5xl font-black leading-tight tracking-tight mb-4"
            style={{
              background:
                "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 50%, #9ca3af 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Planung nach Maas –<br />
            <span style={{ WebkitTextFillColor: "#ef4444" }}>
              Erfahrungen & Dokumentation
            </span>
          </h1>

          <p className="text-lg sm:text-xl max-w-3xl mb-6" style={{ color: "#9ca3af" }}>
            Vollständige, chronologische Dokumentation des Planungsversagens des
            Büros{" "}
            <strong style={{ color: "#e5e7eb" }}>„Planung nach Maas"</strong>{" "}
            (Frederic Maas / Karl-Josef Maas, Nauort) – beruhend auf
            eigens gesicherten Beweismitteln.
          </p>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Nauort / Rheinland-Pfalz", icon: "📍" },
              { label: "8 dokumentierte Schadensphasen", icon: "📋" },
              { label: "Gesamtschaden ~120.000 €", icon: "💰" },
              { label: "Letzte Aktualisierung: April 2026", icon: "📅" },
            ].map((chip) => (
              <span
                key={chip.label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                style={{
                  background: "rgba(37,44,56,0.8)",
                  border: "1px solid rgba(55,65,81,0.8)",
                  color: "#9ca3af",
                }}
              >
                {chip.icon} {chip.label}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ===== DISCLAIMER ===== */}
      <div
        className="border-b py-4 px-4"
        style={{
          background: "rgba(245,158,11,0.05)",
          borderColor: "rgba(245,158,11,0.2)",
        }}
      >
        <div className="max-w-5xl mx-auto flex items-start gap-3 text-sm">
          <span className="text-lg flex-shrink-0">⚠️</span>
          <p style={{ color: "#d97706" }}>
            <strong>Hinweis:</strong> Diese Seite dokumentiert ausschließlich
            belegbare, eigene Erfahrungen des Bauherrn. Alle Aussagen basieren
            auf gesicherten Beweismitteln (Gutachten, Verträge, Korrespondenz).
            Diese Dokumentation dient dem öffentlichen Informationsinteresse und
            der Verbraucherschutz-Aufklärung.
          </p>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* --- Damage Ticker --- */}
        <section id="schadensumme" aria-label="Gesamtschadenssumme">
          <DamageTicker targetAmount={financialData.totalDamage} />
        </section>

        {/* --- Special Components Grid --- */}
        <section id="finanzielle-analyse" aria-label="Finanzielle Analyse">
          <h2
            className="text-2xl font-bold mb-8"
            style={{ color: "#f9fafb" }}
          >
            Finanzielle Analyse
          </h2>
          <div className="space-y-8">
            {/* Delay Bar */}
            <DelayBar delayMonths={financialData.delayMonths} />

            {/* Cost Table */}
            <CostTable data={financialData.costComparison} />
          </div>
        </section>

        {/* --- Timeline --- */}
        <section id="chronologie" aria-label="Chronologische Dokumentation">
          <div className="mb-8">
            <div className="section-badge mb-3">
              <span>📅</span>
              <span>Chronologie</span>
            </div>
            <h2 className="text-2xl font-bold" style={{ color: "#f9fafb" }}>
              Die 8 Schadensphasen
            </h2>
            <p className="mt-2 text-sm" style={{ color: "#6b7280" }}>
              Klicken Sie auf eine Phase, um Details und Beweismittel zu sehen.
            </p>
          </div>
          <Timeline phases={contentData.phases} />
        </section>

        {/* --- Keywords for SEO (structured, not hidden) --- */}
        <section
          id="stichworte"
          className="rounded-xl p-6"
          style={{
            background: "rgba(31,41,55,0.5)",
            border: "1px solid rgba(55,65,81,0.6)",
          }}
        >
          <h2 className="text-lg font-bold mb-3" style={{ color: "#f9fafb" }}>
            Über diese Dokumentation
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
            Diese Seite richtet sich an Personen, die Informationen zu{" "}
            <strong style={{ color: "#e5e7eb" }}>Planung nach Maas</strong>,{" "}
            <strong style={{ color: "#e5e7eb" }}>Maas Nauort</strong>,{" "}
            <strong style={{ color: "#e5e7eb" }}>Frederic Maas</strong> oder{" "}
            <strong style={{ color: "#e5e7eb" }}>Karl-Josef Maas</strong> aus
            Nauort suchen. Alle dokumentierten Schäden umfassen Baumängel,
            Planungsfehler, Bauverzögerungen und finanzielle Schäden in der
            Region Bendorf / Rheinland-Pfalz. Die Dokumentation ist vollständig
            und mit Originalbelegen untermauert.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {contentData.project_metadata.target_keywords.map((kw) => (
              <span
                key={kw}
                className="px-2 py-0.5 rounded text-xs"
                style={{
                  background: "rgba(55,65,81,0.8)",
                  color: "#9ca3af",
                  border: "1px solid rgba(75,85,99,0.5)",
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer
        className="border-t mt-16 py-10"
        style={{ borderColor: "rgba(55,65,81,0.6)" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm" style={{ color: "#6b7280" }}>
            © 2026 · Bühlervilla Dokumentation ·{" "}
            <a
              href="https://www.buehler.zone"
              className="hover:underline"
              style={{ color: "#9ca3af" }}
            >
              www.buehler.zone
            </a>
          </p>
          <p className="text-xs mt-2" style={{ color: "#4b5563" }}>
            Diese Dokumentation basiert auf eigenen Erfahrungen und gesicherten
            Beweismitteln. Alle Angaben ohne Gewähr auf Vollständigkeit.
          </p>
        </div>
      </footer>
    </div>
  );
}
