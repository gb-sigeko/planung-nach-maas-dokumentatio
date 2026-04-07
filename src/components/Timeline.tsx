"use client";

import { useState } from "react";
import { Phase } from "@/lib/data";

interface TimelineProps {
  phases: Phase[];
}

const phaseColors: Record<number, string> = {
  1: "#6366f1",
  2: "#f59e0b",
  3: "#ef4444",
  4: "#dc2626",
  5: "#f97316",
  6: "#dc2626",
  7: "#8b5cf6",
  8: "#64748b",
};

const phaseIcons: Record<number, string> = {
  1: "🎭",
  2: "🏗️",
  3: "🧱",
  4: "💧",
  5: "🔌",
  6: "💸",
  7: "⚖️",
  8: "🔧",
};

function EvidenceLink({ filename }: { filename: string }) {
  const ext = filename.split(".").pop()?.toLowerCase();
  const icon =
    ext === "pdf" ? "📄" : ext === "jpg" || ext === "png" ? "🖼️" : "📝";
  const href = `/evidence/${filename}`;

  return (
    <a
      href={href}
      className="evidence-badge"
      target="_blank"
      rel="noopener noreferrer"
      title={`Beweismittel: ${filename}`}
    >
      <span>{icon}</span>
      <span>{filename}</span>
      <span style={{ color: "#9ca3af", fontSize: "0.65rem" }}>↗</span>
    </a>
  );
}

export function Timeline({ phases }: TimelineProps) {
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(
    new Set([1])
  );

  const togglePhase = (phaseId: number) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) {
        next.delete(phaseId);
      } else {
        next.add(phaseId);
      }
      return next;
    });
  };

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="hidden md:block timeline-line" />

      <div className="space-y-6">
        {phases.map((phase) => {
          const isExpanded = expandedPhases.has(phase.id);
          const color = phaseColors[phase.id] ?? "#ef4444";
          const icon = phaseIcons[phase.id] ?? "📌";

          return (
            <div key={phase.id} className="relative md:pl-14">
              {/* Timeline dot (desktop) */}
              <div
                className="hidden md:flex absolute left-[1.15rem] top-5 w-4 h-4 rounded-full items-center justify-center"
                style={{
                  background: color,
                  boxShadow: `0 0 0 3px rgba(17,24,39,1), 0 0 12px ${color}80`,
                  zIndex: 10,
                }}
              />

              {/* Phase card */}
              <div
                className="glass-card overflow-hidden"
                style={{
                  borderColor: isExpanded
                    ? `${color}50`
                    : "rgba(55,65,81,0.8)",
                  boxShadow: isExpanded
                    ? `0 4px 24px ${color}20, 0 0 0 1px ${color}30`
                    : "none",
                }}
              >
                {/* Phase header - clickable */}
                <button
                  onClick={() => togglePhase(phase.id)}
                  className="w-full flex items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-white/5"
                  aria-expanded={isExpanded}
                >
                  {/* Icon + number */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{
                        background: `${color}20`,
                        border: `1px solid ${color}40`,
                      }}
                    >
                      {icon}
                    </div>
                    <div
                      className="hidden sm:block text-xs font-bold tabular-nums px-2 py-0.5 rounded"
                      style={{
                        background: `${color}20`,
                        color,
                        border: `1px solid ${color}40`,
                      }}
                    >
                      Phase {phase.id}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-base font-bold leading-tight"
                      style={{ color: "#f9fafb" }}
                    >
                      {phase.name}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
                      {phase.chapters.length} Kapitel ·{" "}
                      {phase.chapters.reduce(
                        (s, c) => s + c.evidence.length,
                        0
                      )}{" "}
                      Beweismittel
                    </p>
                  </div>

                  {/* Chevron */}
                  <div
                    className="flex-shrink-0 text-lg transition-transform duration-300"
                    style={{
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      color: "#6b7280",
                    }}
                  >
                    ▾
                  </div>
                </button>

                {/* Chapters */}
                {isExpanded && (
                  <div
                    className="border-t"
                    style={{ borderColor: `${color}30` }}
                  >
                    {phase.chapters.map((chapter, idx) => (
                      <div
                        key={chapter.id}
                        className="px-6 py-5 border-b last:border-b-0"
                        style={{ borderColor: "rgba(55,65,81,0.4)" }}
                      >
                        {/* Chapter header */}
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                            style={{
                              background: `${color}20`,
                              border: `1px solid ${color}40`,
                              color,
                            }}
                          >
                            {idx + 1}
                          </div>
                          <h4 className="font-bold text-sm leading-snug" style={{ color: "#e5e7eb" }}>
                            {chapter.title}
                          </h4>
                        </div>

                        {/* Content */}
                        <p
                          className="text-sm leading-relaxed mb-4 pl-9"
                          style={{ color: "#9ca3af" }}
                        >
                          {chapter.content}
                        </p>

                        {/* Evidence */}
                        {chapter.evidence.length > 0 && (
                          <div className="pl-9">
                            <p
                              className="text-xs font-semibold uppercase tracking-wider mb-2"
                              style={{ color: "#6b7280" }}
                            >
                              Beweismittel:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {chapter.evidence.map((file) => (
                                <EvidenceLink key={file} filename={file} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
