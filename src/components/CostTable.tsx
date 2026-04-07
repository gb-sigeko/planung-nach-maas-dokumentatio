"use client";

interface CostItem {
  position: string;
  sollKosten: number;
  istKosten: number;
  differenz: number;
  note: string;
}

interface CostTableProps {
  data: CostItem[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

export function CostTable({ data }: CostTableProps) {
  const totalSoll = data.reduce((s, r) => s + r.sollKosten, 0);
  const totalIst = data.reduce((s, r) => s + r.istKosten, 0);
  const totalDiff = data.reduce((s, r) => s + r.differenz, 0);

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(55,65,81,0.8)" }}>
        <div className="section-badge mb-2">
          <span>📊</span>
          <span>Soll-Ist-Vergleich</span>
        </div>
        <h3 className="text-xl font-bold" style={{ color: "#f9fafb" }}>
          Kosten-Explosion durch Planungsversagen
        </h3>
        <p className="text-sm mt-1" style={{ color: "#9ca3af" }}>
          Vertraglich vereinbarte Kosten vs. tatsächlich angefallene Kosten
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "rgba(37,44,56,0.8)" }}>
              <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: "#6b7280" }}>
                Position
              </th>
              <th className="text-right py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: "#6b7280" }}>
                Soll-Kosten
              </th>
              <th className="text-right py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: "#6b7280" }}>
                Ist-Kosten
              </th>
              <th className="text-right py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: "#6b7280" }}>
                Differenz
              </th>
              <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider hidden md:table-cell" style={{ color: "#6b7280" }}>
                Ursache
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                className="border-t transition-colors hover:bg-white/5"
                style={{ borderColor: "rgba(55,65,81,0.5)" }}
              >
                <td className="py-3.5 px-4 font-medium" style={{ color: "#f9fafb" }}>
                  {row.position}
                </td>
                <td className="py-3.5 px-4 text-right font-mono" style={{ color: "#6ee7b7" }}>
                  {row.sollKosten === 0 ? (
                    <span style={{ color: "#4b5563" }}>—</span>
                  ) : (
                    fmt(row.sollKosten)
                  )}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-semibold" style={{ color: "#f9fafb" }}>
                  {fmt(row.istKosten)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold">
                  {row.differenz > 0 ? (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs"
                      style={{
                        background: "rgba(220,38,38,0.15)",
                        color: "#f87171",
                      }}
                    >
                      +{fmt(row.differenz)}
                    </span>
                  ) : (
                    <span style={{ color: "#4b5563" }}>—</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-xs hidden md:table-cell" style={{ color: "#9ca3af" }}>
                  {row.note}
                </td>
              </tr>
            ))}
          </tbody>
          {/* Totals */}
          <tfoot>
            <tr
              style={{
                background: "rgba(220,38,38,0.08)",
                borderTop: "2px solid rgba(220,38,38,0.3)",
              }}
            >
              <td className="py-4 px-4 font-bold text-sm" style={{ color: "#f9fafb" }}>
                GESAMT
              </td>
              <td className="py-4 px-4 text-right font-mono font-bold" style={{ color: "#6ee7b7" }}>
                {fmt(totalSoll)}
              </td>
              <td className="py-4 px-4 text-right font-mono font-bold" style={{ color: "#f9fafb" }}>
                {fmt(totalIst)}
              </td>
              <td className="py-4 px-4 text-right font-mono font-black text-base" style={{ color: "#ef4444" }}>
                +{fmt(totalDiff)}
              </td>
              <td className="hidden md:table-cell" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
