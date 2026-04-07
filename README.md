# Planung nach Maas – Erfahrungen & Dokumentation

**URL:** `https://www.buehler.zone/planung-nach-maas-erfahrungen`

Investigative Dokumentationswebsite über das Planungsversagen des Büros
„Planung nach Maas" (Frederic Maas / Karl-Josef Maas, Nauort).

---

## 🚀 Lokale Entwicklung

```bash
cd planung-nach-maas-erfahrungen
npm install
npm run dev
```

Die Seite ist dann unter [http://localhost:3000](http://localhost:3000) erreichbar.

---

## 📁 Beweismittel hochladen (PDFs, Bilder)

1. Legen Sie Ihre Beweis-Dateien in den Ordner **`public/evidence/`** ab.
2. Der Dateiname muss **exakt** mit dem in der `content_master.json` genannten Namen übereinstimmen (inkl. Groß-/Kleinschreibung).
3. Die Website verlinkt alle Beweismittel automatisch unter `/evidence/<Dateiname>`.

**Beispiel:** Die Datei `Gutachten_Petschenka.pdf` → in `public/evidence/Gutachten_Petschenka.pdf` ablegen.

### Aktuelle Beweismittel-Liste

| Dateiname | Phase | Status |
|-----------|-------|--------|
| `Bauantrag_Stempel_Kern.pdf` | Phase 1 | ⏳ Ausstehend |
| `WhatsApp_Maas_Gründungsausrede.txt` | Phase 1 | ⏳ Ausstehend |
| `Mail_Anfrage_Haftpflicht.pdf` | Phase 1 | ⏳ Ausstehend |
| `Rechnung_Rohbau_Notstrom.pdf` | Phase 2 | ⏳ Ausstehend |
| `Terminprotokoll_EVU.pdf` | Phase 2 | ⏳ Ausstehend |
| `Mail_RA_Nitschke_Warnung.pdf` | Phase 2 | ⏳ Ausstehend |
| `Ausführungsplan_Altmann_226.pdf` | Phase 3 | ⏳ Ausstehend |
| `Chat_Zimmerer_Aussage.pdf` | Phase 3 | ⏳ Ausstehend |
| `Schreiben_Kreisverwaltung_Baustopp.pdf` | Phase 3 | ⏳ Ausstehend |
| `Gutachten_Petschenka.pdf` | Phase 4 | ⏳ Ausstehend |
| `Rechnung_Trocknung_AD.pdf` | Phase 4 | ⏳ Ausstehend |
| `Foto_Stemmarbeiten_Nachrüstung.jpg` | Phase 5 | ⏳ Ausstehend |
| `Mail_Elektriker_Planungsnot.pdf` | Phase 5 | ⏳ Ausstehend |
| `Bank_Mitteilung_Tilgungsbeginn.pdf` | Phase 6 | ⏳ Ausstehend |
| `Nachfinanzierungsantrag_Bank.pdf` | Phase 6 | ⏳ Ausstehend |
| `Protokoll_Mediation.pdf` | Phase 7 | ⏳ Ausstehend |
| `Aufhebungsvertrag_Unterzeichnet.pdf` | Phase 7 | ⏳ Ausstehend |
| `Rechnung_Hofbauer_2026.pdf` | Phase 8 | ⏳ Ausstehend |

---

## 🌐 Deployment (Vercel – empfohlen)

```bash
npm install -g vercel
vercel --cwd planung-nach-maas-erfahrungen
```

Oder über das [Vercel Dashboard](https://vercel.com) → "Import Git Repository" →
dieses Repository auswählen → Root Directory auf `planung-nach-maas-erfahrungen` setzen.

### Base Path (wichtig!)

Um die Seite unter `www.buehler.zone/planung-nach-maas-erfahrungen` zu
betreiben, muss in `next.config.ts` der `basePath` gesetzt sein:

```ts
basePath: '/planung-nach-maas-erfahrungen'
```

Dieser ist bereits vorkonfiguriert.

---

## 🔍 SEO-Keywords

- Planung nach Maas
- Maas Nauort
- Frederic Maas
- Karl-Josef Maas
- Bendorf
- Baumängel / Planungsfehler

---

## 📝 Inhalt aktualisieren

Alle Inhalte kommen aus `src/lib/data.ts` (ursprünglich `content_master.json`).
Fügen Sie neue Kapitel oder Phasen dort ein, und die Website aktualisiert sich automatisch.

---

> ⚠️ **Rechtlicher Hinweis:** Diese Dokumentation basiert auf eigenen Erfahrungen
> und gesicherten Beweismitteln. Alle Aussagen dienen dem öffentlichen
> Informationsinteresse und dem Verbraucherschutz.
