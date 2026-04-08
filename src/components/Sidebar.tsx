"use client";

import { Phase } from "@/lib/data";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface SidebarProps {
  phases: Phase[];
  stats: {
    totalFiles: number;
    totalImages: number;
    totalDocuments: number;
  };
  totalDamage: number;
}

export function Sidebar({ phases, stats, totalDamage }: SidebarProps) {
  const [activePhase, setActivePhase] = useState<number>(1);

  // Intersection Observer for highlighting active phase
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.split("-")[1];
            for (const phase of phases) {
              if (phase.chapters.some((c) => c.id.toString() === id)) {
                setActivePhase(phase.id);
                break;
              }
            }
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    phases.forEach((phase) => {
      phase.chapters.forEach((chapter) => {
        const el = document.getElementById(`chapter-${chapter.id}`);
        if (el) observer.observe(el);
      });
    });

    return () => observer.disconnect();
  }, [phases]);

  return (
    <aside className="lg:w-[320px] shrink-0 space-y-8 h-fit lg:sticky lg:top-8 mt-12 lg:mt-0">
      
      {/* Search Widget */}
      <div className="bg-white p-8 shadow-sm">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-800 mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-[#008b8b]">
          Suche
        </h3>
        <div className="flex">
          <input 
            type="text" 
            placeholder="Suchen..." 
            className="w-full bg-gray-50 border-none p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#008b8b]"
          />
          <button className="bg-[#5c727a] text-white p-3 hover:bg-[#008b8b] transition-colors flex items-center justify-center">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Cloud-Index Status Widget */}
      <div className="bg-white p-8 shadow-sm">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-800 mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-[#008b8b]">
          System Status
        </h3>
        <div className="space-y-4 text-sm text-gray-600">
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span>Synchronisierte Dateien</span>
            <span className="font-bold text-gray-800">{stats?.totalFiles || 0}</span>
          </div>
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span>Bilder & Scans</span>
            <span className="font-bold text-gray-800">{stats?.totalImages || 0}</span>
          </div>
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span>PDFs & Akten</span>
            <span className="font-bold text-gray-800">{stats?.totalDocuments || 0}</span>
          </div>
        </div>
      </div>

      {/* Live Costs Widget */}
      <div className="bg-white p-8 shadow-sm border-t-4 border-[#008b8b]">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-800 mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-[#008b8b]">
          Baukosten-Analyse
        </h3>
        <p className="text-xs text-[#999999] mb-2">Gesamtschaden lt. Gutachten</p>
        <div className="text-3xl font-light tracking-tighter text-[#008b8b]">
          {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(totalDamage)}
        </div>
      </div>

      {/* Timeline Widget */}
      <div className="bg-white p-8 shadow-sm">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-800 mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-[#008b8b]">
          Bauphasen
        </h3>
        <ul className="space-y-0">
          {phases.map((phase) => {
            const isActive = activePhase === phase.id;
            return (
              <li key={phase.id} className="border-b border-gray-50 last:border-0 relative">
                <button
                  onClick={() => {
                    const firstChapterId = phase.chapters[0]?.id;
                    const el = document.getElementById(`chapter-${firstChapterId}`);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className={`w-full text-left py-3 text-sm transition-colors flex items-center group ${
                    isActive ? "text-[#008b8b] font-bold" : "text-gray-600 hover:text-[#008b8b]"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full mr-3 ${isActive ? 'bg-[#008b8b]' : 'bg-transparent group-hover:bg-gray-200'}`}></span>
                  {phase.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

    </aside>
  );
}
