"use client";

import { useEffect, useState } from "react";

interface DamageTickerProps {
  targetAmount: number;
}

export function DamageTicker({ targetAmount }: DamageTickerProps) {
  const [displayAmount, setDisplayAmount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const duration = 2500;
    const steps = 80;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += targetAmount / steps;
      if (current >= targetAmount) {
        setDisplayAmount(targetAmount);
        clearInterval(timer);
      } else {
        setDisplayAmount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetAmount]);

  const formatted = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(displayAmount);

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-1"
      style={{
        background:
          "linear-gradient(135deg, rgba(220,38,38,0.3) 0%, rgba(127,29,29,0.2) 100%)",
        animation: "pulseGlow 3s ease-in-out infinite",
      }}
    >
      <div
        className="rounded-xl px-8 py-8 text-center"
        style={{ background: "rgba(17,24,39,0.95)" }}
      >
        {/* Label */}
        <div className="section-badge mb-4 mx-auto w-fit">
          <span>⚠</span>
          <span>Dokumentierter Gesamtschaden</span>
        </div>

        {/* Amount */}
        <div
          className="font-black tracking-tight leading-none"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 5rem)",
            color: "#ef4444",
            textShadow: "0 0 40px rgba(239,68,68,0.4)",
            animation: isVisible ? "countUp 0.5s ease-out forwards" : "none",
          }}
        >
          {formatted}
        </div>

        {/* Subtitle */}
        <p className="mt-3 text-sm" style={{ color: "#9ca3af" }}>
          Durch nachweisliches Planungsversagen des Büros{" "}
          <span style={{ color: "#f87171", fontWeight: 600 }}>
            „Planung nach Maas"
          </span>{" "}
          (Frederic Maas / Karl-Josef Maas, Nauort)
        </p>

        {/* Breakdown pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {[
            { label: "8 Schadensphasen", icon: "📋" },
            { label: "14 Mon. Bauverzug", icon: "⏱" },
            { label: "Grobe Fahrlässigkeit", icon: "⚖" },
          ].map((item) => (
            <span
              key={item.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: "rgba(220,38,38,0.12)",
                border: "1px solid rgba(220,38,38,0.3)",
                color: "#fca5a5",
              }}
            >
              {item.icon} {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
