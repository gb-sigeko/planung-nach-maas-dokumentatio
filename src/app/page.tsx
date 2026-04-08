import { contentData, financialData } from "@/lib/data";
import dynamicIndexRaw from "@/lib/dynamic_index.json";
import { Sidebar } from "@/components/Sidebar";
import { FeedEntry } from "@/components/FeedEntry";

export default function Home() {
  const dynamicIndex = dynamicIndexRaw as any;

  return (
    <div className="font-sans">
      
      {/* HEADER HERO */}
      <header className="bg-white border-b border-gray-200 py-20 px-4 text-center shadow-sm relative z-10">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#008b8b] mb-4">
            Investigatives Bautagebuch
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#333333] uppercase tracking-tighter mb-8 leading-tight">
            Planung nach <span className="text-[#008b8b]">Maas</span>
          </h1>
          <div className="w-16 h-0.5 bg-[#008b8b] mx-auto mb-8"></div>
          <p className="text-lg text-[#5c727a] max-w-2xl mx-auto leading-relaxed">
            Eine lückenlose Dokumentation des Baudebakels der Bühlervilla. 
            Basierend auf echten gescannten Akten und Gutachten.
          </p>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-[1140px] mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* FEED / BLOG CONTENT (2/3 width) */}
          <div className="lg:w-2/3 shrink-0">
            {contentData.phases.map((phase) => (
              <div key={phase.id}>
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

            {/* Pagination / End of Feed */}
            <div className="bg-white p-8 shadow-sm flex items-center justify-center text-center mt-12 mb-8">
              <p className="text-sm uppercase tracking-widest text-[#999999]">
                Ende der Dokumentation
              </p>
            </div>
          </div>

          {/* SIDEBAR (1/3 width) */}
          <Sidebar 
            phases={contentData.phases} 
            stats={dynamicIndex?.stats} 
            totalDamage={financialData.totalDamage} 
          />
          
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#333333] py-16 px-4">
        <div className="max-w-[1140px] mx-auto text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#999999] mb-4">
            Bühlervilla Dokumentation
          </p>
          <div className="w-8 h-0.5 bg-[#5c727a] mx-auto mb-6"></div>
          <p className="text-[#999999] text-xs max-w-md mx-auto leading-relaxed">
            Such-Keywords: Erfahrungen Planung nach Maas, Baupfusch Bendorf, Frederic Maas Nauort, Architektur Kritik.
            <br className="mb-2" />
            © {new Date().getFullYear()} Alle Rechte vorbehalten. Dokumentation aus öffentlichem Interesse.
          </p>
        </div>
      </footer>
      
    </div>
  );
}
