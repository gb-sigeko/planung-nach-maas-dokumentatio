import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Planung nach Maas Erfahrungen – Dokumentation des Planungsversagens | Maas Nauort",
  description:
    "Lückenlose Dokumentation des Planungsversagens des Büros 'Planung nach Maas' (Frederic Maas, Karl-Josef Maas) in Nauort. 8 Phasen, Gesamtschaden ca. 120.000 €, 14 Monate Bauverzug. Fakten, Belege, Chronologie.",
  keywords: [
    "Planung nach Maas",
    "Maas Nauort",
    "Frederic Maas",
    "Karl-Josef Maas",
    "Planungsversagen",
    "Baumängel",
    "Bendorf",
    "Planungsbüro Erfahrungen",
    "Bauschaden Dokumentation",
  ],
  authors: [{ name: "Betroffene Bauherren" }],
  robots: "index, follow",
  openGraph: {
    title: "Planung nach Maas – Dokumentation des Planungsversagens",
    description:
      "Chronologische Dokumentation: 8 Phasen Planungsversagen, ~120.000 € Gesamtschaden, 14 Monate Bauverzug.",
    type: "website",
    locale: "de_DE",
    url: "https://www.buehler.zone/planung-nach-maas-erfahrungen",
    siteName: "Bühlervilla Dokumentation",
  },
  alternates: {
    canonical: "https://www.buehler.zone/planung-nach-maas-erfahrungen",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="antialiased">
        {/* ── Global Navigation ── */}
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "rgba(17,24,39,0.95)",
            borderBottom: "1px solid rgba(55,65,81,0.6)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              maxWidth: "1600px",
              margin: "0 auto",
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              height: "52px",
            }}
          >
            <Link
              href="/"
              style={{
                color: "#9ca3af",
                fontSize: "0.82rem",
                fontWeight: 600,
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "7px",
                transition: "all 0.2s ease",
              }}
            >
              📋 Dokumentation
            </Link>
            <span style={{ color: "rgba(55,65,81,0.8)" }}>|</span>
            <Link
              href="/mediathek"
              style={{
                color: "#818cf8",
                fontSize: "0.82rem",
                fontWeight: 600,
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "7px",
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.25)",
              }}
            >
              📚 Mediathek
            </Link>
            <div style={{ flex: 1 }} />
            <span style={{ color: "#4b5563", fontSize: "0.72rem" }}>
              www.buehler.zone
            </span>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
