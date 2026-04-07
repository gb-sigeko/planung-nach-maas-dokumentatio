import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
