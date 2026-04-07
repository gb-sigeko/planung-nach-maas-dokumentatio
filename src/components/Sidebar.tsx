"use client";

import { Phase } from "@/lib/data";
import { useEffect, useState } from "react";
import { Database, FileImage, FileText } from "lucide-react";

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
            // Find which phase this chapter belongs to
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
    <aside className="sticky top-24 hidden lg:block w-72 space-y-8">
      {/* Evidence Counter */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Database className="text-red-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">
            Cloud-Index Status
          </h3>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Gesamtdateien</span>
            <span className="font-mono text-white bg-gray-800 px-2 py-1 rounded text-sm">
              {stats.totalFiles}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm flex items-center gap-2">
              <FileImage size={14} /> Fotos/Scans
            </span>
            <span className="font-mono text-white bg-gray-800 px-2 py-1 rounded text-sm">
              {stats.totalImages}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm flex items-center gap-2">
              <FileText size={14} /> Dokumente
            </span>
            <span className="font-mono text-white bg-gray-800 px-2 py-1 rounded text-sm">
              {stats.totalDocuments}
            </span>
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-gray-800">
          <p className="text-xs text-green-500 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live-Sync aktiv
          </p>
        </div>
      </div>

      {/* Live Costs */}
      <div className="bg-gradient-to-br from-red-900/20 to-gray-900 border border-red-900/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-red-400 mb-2">
          Live-Schadenssumme
        </h3>
        <p className="text-xs text-gray-400 mb-3">Extrahierte Werte aus Kostentabellen</p>
        <div className="text-3xl font-black text-white font-mono tracking-tight">
          {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(totalDamage)}
        </div>
      </div>

      {/* Timeline Nav */}
      <nav className="pl-2 border-l-2 border-gray-800/80 space-y-6">
        {phases.map((phase) => {
          const isActive = activePhase === phase.id;
          return (
            <div key={phase.id} className="relative">
              {/* Dot */}
              <div
                className={`absolute -left-[1.35rem] top-1 w-3 h-3 rounded-full border-2 border-gray-950 transition-colors duration-300 ${
                  isActive ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]" : "bg-gray-700"
                }`}
              />
              <button
                onClick={() => {
                  const firstChapterId = phase.chapters[0]?.id;
                  const el = document.getElementById(`chapter-${firstChapterId}`);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className={`text-left block text-sm transition-colors cursor-pointer w-full group ${
                  isActive ? "text-gray-100 font-bold" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {phase.name}
                <span className="block text-xs mt-1 text-gray-600 group-hover:text-gray-400">
                  {phase.chapters.length} Kapitel
                </span>
              </button>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
