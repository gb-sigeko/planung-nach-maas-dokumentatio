export interface Chapter {
  id: number;
  title: string;
  content: string;
  evidence: string[];
}

export interface Phase {
  id: number;
  name: string;
  chapters: Chapter[];
}

export interface ProjectMetadata {
  title: string;
  domain: string;
  slug: string;
  target_keywords: string[];
}

export interface ContentData {
  project_metadata: ProjectMetadata;
  phases: Phase[];
}

export const contentData: ContentData = {
  project_metadata: {
    title: "Dokumentation Planungsversagen Maas",
    domain: "www.buehler.zone",
    slug: "planung-nach-maas-erfahrungen",
    target_keywords: [
      "Planung nach Maas",
      "Maas Nauort",
      "Frederic Maas",
      "Karl-Josef Maas",
      "Bendorf",
      "Baumängel",
    ],
  },
  phases: [
    {
      id: 1,
      name: "Phase 1: Anbahnung & Täuschung",
      chapters: [
        {
          id: 39,
          title: "Die Qualifikations-Lüge",
          content:
            "Nachweis der fehlenden Bauvorlageberechtigung nach LBO RLP. Nutzung eines Stroh-Ingenieurs (Klaus Kern) zur Unterschrift des Bauantrags an der Haustür ohne fachliche Prüfung.",
          evidence: [
            "Bauantrag_Stempel_Kern.pdf",
            "WhatsApp_Maas_Gründungsausrede.txt",
          ],
        },
        {
          id: 40,
          title: "Das Versicherungs-Vakuum",
          content:
            "Kein Nachweis einer Berufshaftpflichtversicherung. Risiko der privaten Haftung bei Schäden über 40.000 EUR.",
          evidence: ["Mail_Anfrage_Haftpflicht.pdf"],
        },
      ],
    },
    {
      id: 2,
      name: "Phase 2: Baubeginn & Infrastruktur",
      chapters: [
        {
          id: 7,
          title: "Stromeinspeisung I - Der vergessene Dachständer",
          content:
            "Vollständiges Übersehen der Stromversorgung für 3 bewohnte Wohnungen. Baustopp bei Abbruchbeginn zur Notumlegung.",
          evidence: ["Rechnung_Rohbau_Notstrom.pdf", "Terminprotokoll_EVU.pdf"],
        },
        {
          id: 37,
          title: "Versäumte Beweissicherung",
          content:
            "Keine Dokumentation der Nachbarbebauung vor Abbruch. Hohes Haftungsrisiko bei behaupteten Rissen durch Nachbarn.",
          evidence: ["Mail_RA_Nitschke_Warnung.pdf"],
        },
      ],
    },
    {
      id: 3,
      name: "Phase 3: Rohbau-Desaster",
      chapters: [
        {
          id: 1,
          title: "Die 2,26m Raumhöhe-Falle",
          content:
            "Planung von Aufenthaltsräumen unter dem gesetzlichen Minimum von 2,40m. Vorsätzliche Täuschung des Zimmerers ('mit BH abgesprochen').",
          evidence: [
            "Ausführungsplan_Altmann_226.pdf",
            "Chat_Zimmerer_Aussage.pdf",
          ],
        },
        {
          id: 18,
          title: "Der selbstprovozierte Baustopp",
          content:
            "Eigenmächtige Meldung des Fehlers an die Kreisverwaltung ohne Rücksprache mit BH, was zu monatelangem Stillstand führte.",
          evidence: ["Schreiben_Kreisverwaltung_Baustopp.pdf"],
        },
      ],
    },
    {
      id: 4,
      name: "Phase 4: Die Wasserschaden-Katastrophe",
      chapters: [
        {
          id: 6,
          title: "Grobe Fahrlässigkeit am 01.07.2023",
          content:
            "Einsatz von Verputzern zur Notabdichtung mit privatem Bitumenbrenner des Planers Maas. Wassereintritt in 1. OG.",
          evidence: ["Gutachten_Petschenka.pdf", "Rechnung_Trocknung_AD.pdf"],
        },
      ],
    },
    {
      id: 5,
      name: "Phase 5: Planungs-Vakuum & Haustechnik",
      chapters: [
        {
          id: 4,
          title: "Gäste-WC ohne Abfluss",
          content:
            "Fehlende Schlitz- und Durchbruchsplanung. WC wurde eingezeichnet, aber physischer Abflussweg vergessen.",
          evidence: ["Foto_Stemmarbeiten_Nachrüstung.jpg"],
        },
        {
          id: 28,
          title: "Das Elektro-Vakuum",
          content:
            "Keine Installationsplanung. Abstimmung musste laienhaft auf der Baustelle zwischen BH und Elektriker erfolgen.",
          evidence: ["Mail_Elektriker_Planungsnot.pdf"],
        },
      ],
    },
    {
      id: 6,
      name: "Phase 6: Finanzieller Ruin",
      chapters: [
        {
          id: 29,
          title: "Die Tilgungs-Falle (Verzugsschaden)",
          content:
            "14 Monate Bauzeitverzögerung führen zum Ablauf der tilgungsfreien Zeit. Doppelbelastung durch Miete und Kreditrate.",
          evidence: ["Bank_Mitteilung_Tilgungsbeginn.pdf"],
        },
        {
          id: 30,
          title: "Die Kosten-Explosion (Soll/Ist)",
          content:
            "Massive Überschreitung der Kalkulation durch vergessene Standardpositionen (Ringanker, Entwässerung).",
          evidence: ["Nachfinanzierungsantrag_Bank.pdf"],
        },
      ],
    },
    {
      id: 7,
      name: "Phase 7: Mediation & Trennung",
      chapters: [
        {
          id: 42,
          title: "Gescheiterte Mediation",
          content:
            "Fruchtloser Versuch der Mängelklärung mit RA Nitschke und Gutachter Seuferle im Jahr 2024.",
          evidence: ["Protokoll_Mediation.pdf"],
        },
        {
          id: 43,
          title: "Aufhebungsvertrag Feb 2024",
          content:
            "Endgültige Trennung vom Büro PNM nach totalem Vertrauensbruch.",
          evidence: ["Aufhebungsvertrag_Unterzeichnet.pdf"],
        },
      ],
    },
    {
      id: 8,
      name: "Phase 8: Das Erbe 2026",
      chapters: [
        {
          id: 44,
          title: "Sanierung Hofbauer 2026",
          content:
            "Spätfolgen des Wasserschadens machen eine Kernsanierung des Lehmputzes für über 32.000 EUR nötig.",
          evidence: ["Rechnung_Hofbauer_2026.pdf"],
        },
      ],
    },
  ],
};

// Financial data for special components
export const financialData = {
  totalDamage: 120000,
  delayMonths: 14,
  costComparison: [
    {
      position: "Gesamtplanung & Architektur",
      sollKosten: 18000,
      istKosten: 18000,
      differenz: 0,
      note: "Honorar bezahlt, Leistung nicht erbracht",
    },
    {
      position: "Rohbau (inkl. Ringanker)",
      sollKosten: 45000,
      istKosten: 61500,
      differenz: 16500,
      note: "Ringanker in Planung vergessen",
    },
    {
      position: "Entwässerung & Sanitär",
      sollKosten: 8000,
      istKosten: 14200,
      differenz: 6200,
      note: "Abflüsse nicht geplant (Gäste-WC)",
    },
    {
      position: "Elektroinstallation",
      sollKosten: 12000,
      istKosten: 15800,
      differenz: 3800,
      note: "Keine Installationsplanung vorhanden",
    },
    {
      position: "Wasserschaden & Trocknung",
      sollKosten: 0,
      istKosten: 22000,
      differenz: 22000,
      note: "Grobe Fahrlässigkeit 01.07.2023",
    },
    {
      position: "Verzugsschaden (14 Monate)",
      sollKosten: 0,
      istKosten: 27400,
      differenz: 27400,
      note: "Doppelte Miete + Kreditrate",
    },
    {
      position: "Sanierung Lehmputz (2026)",
      sollKosten: 0,
      istKosten: 32000,
      differenz: 32000,
      note: "Spätfolge Wasserschaden",
    },
  ],
};
