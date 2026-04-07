import { contentData, financialData } from "@/lib/data";
import dynamicIndexRaw from "@/lib/dynamic_index.json";
import { Sidebar } from "@/components/Sidebar";
import { FeedEntry } from "@/components/FeedEntry";

export default function Home() {
  const dynamicIndex = dynamicIndexRaw as any;

  return (
    <div className="bg-gray-950 min-h-screen font-sans text-gray-200">
      {/* HEADER HERO */}
      <header className="relative py-24 px-6 lg:px-8 border-b border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-[url('https://placehold.co/1920x400/000000/111111?text=+')] opacity-20 bg-cover bg-center"></div>
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="mb-6 px-4 py-1.5 rounded-full border border-red-900/50 bg-red-900/20 text-red-500 text-sm font-semibold tracking-widest uppercase">
            Investigatives Bau-Logbuch
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500 mb-6 tracking-tight leading-tight">
            Planung nach Maas
            <br />
            <span className="text-red-500">Das Versagen in Akten</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">
            Ein dynamisch indizierter Einblick in das eklatante Planungsversagen des Büros Maas (Nauort). 
            Basierend auf {dynamicIndex?.stats?.totalFiles || 0} eingescannten Beweismitteln, Live-Dokumenten und Fakten.
          </p>
        </div>
      </header>

      {/* DISCLAIMER / WARNING */}
      <div className="bg-amber-900/20 border-b border-amber-900/40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-start gap-4">
          <span className="text-amber-500 mt-0.5">⚠️</span>
          <p className="text-amber-400/90 text-sm leading-relaxed">
            <strong>Hinweis:</strong> Alle Einträge in diesem Feed sind mit direkt gescannten Dokumenten (PDF, JPG) 
            aus dem Cloud-Speicher hinterlegt. Die Metadaten werden live aktualisiert. Reines Informationsinteresse.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-12 relative">
        
        {/* SIDEBAR (Sticky Nav & Stats) */}
        <Sidebar 
          phases={contentData.phases} 
          stats={dynamicIndex?.stats} 
          totalDamage={financialData.totalDamage} 
        />

        {/* FEED / BLOG CONTENT */}
        <div className="flex-1 max-w-3xl min-w-0">
          {contentData.phases.map((phase) => (
            <div key={phase.id} className="mb-8">
              {/* Phase Header for context */}
              {/* 
              <div className="mb-10 pb-4 border-b border-gray-800">
                <h2 className="text-3xl font-black text-white">{phase.name}</h2>
              </div>
              */}

              {phase.chapters.map((chapter) => {
                // Find dynamic index files corresponding to this chapter
                const matchedFiles = dynamicIndex?.files?.filter((f: any) => 
                  f.matchedChapterIds?.includes(chapter.id)
                ) || [];

                return (
                  <FeedEntry 
                    key={chapter.id} 
                    chapter={chapter} 
                    phaseId={phase.id} 
                    files={matchedFiles} 
                  />
                );
              })}
            </div>
          ))}

          {/* End of Feed Signal */}
          <div className="py-12 flex flex-col items-center justify-center border-t border-gray-800 text-gray-500">
            <span className="text-3xl mb-4">📜</span>
            <p className="font-medium">Ende der Akte</p>
            <p className="text-sm mt-2">Weitere Dokumente werden automatisch synchronisiert.</p>
          </div>
        </div>
      </main>

      {/* SEO / FOOTER */}
      <footer className="border-t border-gray-900 bg-gray-950 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
          <p className="text-gray-500 mb-6">
            Such-Tags: Erfahrungen Planung nach Maas, Maas Bendorf Kritik, Frederic Maas Nauort, Baumängel
          </p>
          <div className="text-sm text-gray-600">
            © 2026 Bühlervilla Dokumentation · Cloud-Indexing System V2
          </div>
        </div>
      </footer>
    </div>
  );
}
