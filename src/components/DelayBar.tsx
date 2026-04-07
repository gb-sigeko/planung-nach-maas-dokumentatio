"use client";

import { useEffect, useRef, useState } from "react";

interface DelayBarProps {
  delayMonths: number;
  totalPlannedMonths?: number;
}

export function DelayBar({
  delayMonths,
  totalPlannedMonths = 18,
}: DelayBarProps) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const plannedPercent = (totalPlannedMonths / (totalPlannedMonths + delayMonths)) * 100;
  const delayPercent = (delayMonths / (totalPlannedMonths + delayMonths)) * 100;

  const months = Array.from({ length: totalPlannedMonths + delayMonths }, (_, i) => i + 1);

  return (
    <div ref={ref} className="glass-card p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="section-badge mb-2">
            <span>⏱</span>
            <span>Verzugs-Analyse</span>
          </div>
          <h3 className="text-xl font-bold" style={{ color: "#f9fafb" }}>
            14 Monate Bauzeitverzögerung
          </h3>
          <p className="text-sm mt-1" style={{ color: "#9ca3af" }}>
            Durch Planungsversagen ablaufende tilgungsfreie Zeit
          </p>
        </div>
        <div className="text-right">
          <div
            className="text-3xl font-black"
            style={{ color: "#ef4444" }}
          >
            +{delayMonths}
          </div>
          <div className="text-xs" style={{ color: "#9ca3af" }}>
            Monate Verzug
          </div>
        </div>
      </div>

      {/* Month grid */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {months.map((month) => {
          const isPlanned = month <= totalPlannedMonths;
          return (
            <div
              key={month}
              className="relative group"
              title={
                isPlanned
                  ? `Geplanter Monat ${month}`
                  : `Verzugsmonat ${month - totalPlannedMonths}`
              }
            >
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 cursor-default"
                style={{
                  background: isPlanned
                    ? "rgba(16,185,129,0.2)"
                    : "rgba(220,38,38,0.3)",
                  border: `1px solid ${isPlanned ? "rgba(16,185,129,0.4)" : "rgba(220,38,38,0.5)"}`,
                  color: isPlanned ? "#6ee7b7" : "#fca5a5",
                  opacity: animated ? 1 : 0,
                  transform: animated ? "scale(1)" : "scale(0.5)",
                  transition: `all 0.3s ease ${month * 30}ms`,
                }}
              >
                {month}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="h-6 rounded-full overflow-hidden flex" style={{ background: "rgba(55,65,81,0.5)" }}>
          {/* Planned */}
          <div
            className="h-full flex items-center justify-center text-xs font-bold"
            style={{
              width: animated ? `${plannedPercent}%` : "0%",
              background: "linear-gradient(90deg, #059669, #10b981)",
              transition: "width 1.5s ease-out 0.5s",
              color: "#fff",
              minWidth: animated ? "80px" : "0",
            }}
          >
            {animated && `${totalPlannedMonths} Monate geplant`}
          </div>
          {/* Delay */}
          <div
            className="h-full flex items-center justify-center text-xs font-bold"
            style={{
              width: animated ? `${delayPercent}%` : "0%",
              background: "linear-gradient(90deg, #dc2626, #ef4444)",
              transition: "width 1.5s ease-out 0.8s",
              color: "#fff",
            }}
          >
            {animated && `+${delayMonths}`}
          </div>
        </div>

        <div className="flex justify-between text-xs" style={{ color: "#6b7280" }}>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#10b981" }} />
            Geplante Bauzeit ({totalPlannedMonths} Mon.)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#ef4444" }} />
            Verzug durch PNM ({delayMonths} Mon.)
          </span>
        </div>
      </div>

      {/* Financial impact */}
      <div
        className="mt-4 p-4 rounded-lg"
        style={{
          background: "rgba(220,38,38,0.08)",
          border: "1px solid rgba(220,38,38,0.2)",
        }}
      >
        <p className="text-sm" style={{ color: "#fca5a5" }}>
          <strong>Finanzieller Impact:</strong> Durch den Ablauf der
          tilgungsfreien Bankzeit entstanden{" "}
          <strong>14 Monate Doppelbelastung</strong> aus laufender Miete und
          voller Kreditrate — ein direkter Verzugsschaden von{" "}
          <strong>ca. 27.400 €</strong>.
        </p>
      </div>
    </div>
  );
}
