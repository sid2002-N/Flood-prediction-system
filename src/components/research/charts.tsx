/**
 * KAYAL — SVG chart kit.
 * Hand-drawn editorial charts: hairline grids, mono axis labels,
 * no drop shadows, no rounded corners. Every chart ships with a
 * provenance line underneath.
 */
import {
  monsoon2018,
  sarExtent,
  lulc,
  coverage,
  coverageColors,
  type CoverageRow,
} from "@/lib/content/series";
import { cn } from "@/lib/utils";

const MONO = "var(--font-plex-mono), ui-monospace, monospace";

function ChartFrame({
  children,
  title,
  provenance,
  tag,
  className,
  scroll,
}: {
  children: React.ReactNode;
  title: string;
  provenance?: string;
  tag?: string;
  className?: string;
  scroll?: boolean;
}) {
  return (
    <figure className={cn("border border-paper-line bg-card", className)}>
      <div className="flex items-center justify-between border-b border-paper-line bg-paper-2/60 px-4 py-2.5">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">
          {title}
        </span>
        {tag && (
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] border border-flood text-flood px-1.5 py-0.5">
            {tag}
          </span>
        )}
      </div>
      <div className={cn("p-4", scroll && "overflow-x-auto slim-scroll")}>{children}</div>
      {provenance && (
        <figcaption className="border-t border-paper-line bg-paper-2/40 px-4 py-2 font-mono text-[9px] leading-relaxed tracking-[0.03em] text-ink-soft">
          {provenance}
        </figcaption>
      )}
    </figure>
  );
}

/* ===================== Monsoon 2018 — rain + discharge ===================== */

export function MonsoonChart({ provenance }: { provenance: string }) {
  const W = 1000;
  const H = 380;
  const L = 48;
  const R = 60;
  const T = 34;
  const B = 42;
  const iw = W - L - R;
  const ih = H - T - B;
  const n = monsoon2018.length;
  const dw = iw / n;
  const rainMax = 140;
  const qMax = 18;

  const x = (i: number) => L + i * dw;
  const yR = (v: number) => T + (1 - v / rainMax) * ih;
  const yQ = (v: number) => T + (1 - v / qMax) * ih;

  const qPath = monsoon2018
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i) + dw / 2} ${yQ(d.discharge)}`)
    .join(" ");

  const peakRainI = 75; // 2018-08-15
  const peakQI = 76; // 2018-08-16
  const evStart = 68; // Aug 8
  const evEnd = 78; // Aug 18 exclusive

  const months = [
    { label: "JUNE", i: 0 },
    { label: "JULY", i: 30 },
    { label: "AUGUST", i: 61 },
    { label: "SEPTEMBER", i: 92 },
  ];

  return (
    <ChartFrame
      title="Monsoon 2018 — daily rainfall vs river discharge"
      tag="reconstructed"
      provenance={provenance}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img"
        aria-label="Daily rainfall bars with river discharge line for the 2018 monsoon, peaking 15 and 16 August">
        {/* event window */}
        <rect x={x(evStart)} y={T} width={(evEnd - evStart) * dw} height={ih} fill="#b4530a" opacity="0.07" />
        <text x={x(evStart) + 4} y={T + 12} className="font-mono" fontSize="8.5" fill="#b4530a" letterSpacing="0.12em">
          PEAK EVENT WINDOW · AUG 8–17
        </text>
        {/* month gridlines */}
        {months.map((m) => (
          <g key={m.label}>
            <line x1={x(m.i)} y1={T} x2={x(m.i)} y2={T + ih} stroke="#d9d2c0" strokeWidth="1" />
            <text x={x(m.i) + 5} y={H - 22} className="font-mono" fontSize="9" fill="#5f584a" letterSpacing="0.14em">
              {m.label}
            </text>
          </g>
        ))}
        {/* y grid — rain */}
        {[0, 35, 70, 105, 140].map((v) => (
          <g key={`r${v}`}>
            <line x1={L} y1={yR(v)} x2={W - R} y2={yR(v)} stroke="#eae5d8" strokeWidth="1" />
            <text x={L - 6} y={yR(v) + 3} textAnchor="end" className="font-mono" fontSize="9" fill="#5f584a">
              {v}
            </text>
          </g>
        ))}
        {/* y grid — discharge */}
        {[0, 6, 12, 18].map((v) => (
          <text key={`q${v}`} x={W - R + 8} y={yQ(v) + 3} className="font-mono" fontSize="9" fill="#b4530a">
            {v}
          </text>
        ))}
        {/* x baseline */}
        <line x1={L} y1={T + ih} x2={W - R} y2={T + ih} stroke="#1b1915" strokeWidth="1" />
        {/* rain bars */}
        {monsoon2018.map((d, i) => {
          const h = (d.rain / rainMax) * ih;
          if (h <= 0.01) return null;
          const isPeak = i === peakRainI;
          return (
            <rect
              key={d.date}
              x={x(i) + dw * 0.19}
              y={yR(d.rain)}
              width={dw * 0.62}
              height={h}
              fill={isPeak ? "#b4530a" : "#0e6b68"}
              opacity={isPeak ? 1 : 0.68}
            />
          );
        })}
        {/* discharge line */}
        <path d={qPath} fill="none" stroke="#1b1915" strokeWidth="1.8" />
        {/* annotations */}
        <circle cx={x(peakQI) + dw / 2} cy={yQ(monsoon2018[peakQI].discharge)} r="3.4" fill="#b4530a" stroke="#f6f3ec" strokeWidth="1.4" />
        <text x={x(peakQI) + dw / 2 - 8} y={yQ(monsoon2018[peakQI].discharge) - 10} textAnchor="end" className="font-mono" fontSize="9.5" fontWeight="600" fill="#b4530a">
          17.11 · 16 AUG
        </text>
        <text x={x(peakRainI) + dw / 2 + 4} y={yR(126.4) - 6} className="font-mono" fontSize="9.5" fontWeight="600" fill="#b4530a">
          126.4 mm · 15 AUG
        </text>
        {/* axis titles */}
        <text x={L - 6} y={T - 12} textAnchor="start" className="font-mono" fontSize="8.5" fill="#0e6b68" letterSpacing="0.16em">
          RAIN — mm
        </text>
        <text x={W - R + 8} y={T - 12} className="font-mono" fontSize="8.5" fill="#b4530a" letterSpacing="0.16em">
          DISCHARGE — file units
        </text>
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 px-1">
        <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft">
          <span className="inline-block size-2.5 bg-water/70" /> daily rainfall
        </span>
        <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft">
          <span className="inline-block h-[2px] w-4 bg-ink" /> river discharge
        </span>
        <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft">
          <span className="inline-block size-2.5 bg-flood/15" /> peak event window
        </span>
      </div>
    </ChartFrame>
  );
}

/* ===================== SAR water extent ===================== */

export function SarChart({ provenance }: { provenance: string }) {
  const pts = [...sarExtent].sort((a, b) => a.x - b.x);
  const W = 1000;
  const H = 300;
  const L = 52;
  const R = 20;
  const T = 26;
  const B = 40;
  const iw = W - L - R;
  const ih = H - T - B;
  const x0 = 2015.35;
  const x1 = 2026.75;
  const yMin = 48000;
  const yMax = 64000;
  const X = (v: number) => L + ((v - x0) / (x1 - x0)) * iw;
  const Y = (v: number) => T + (1 - (v - yMin) / (yMax - yMin)) * ih;

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${X(p.x)} ${Y(p.ha)}`).join(" ");
  const area = `${line} L ${X(pts[pts.length - 1].x)} ${T + ih} L ${X(pts[0].x)} ${T + ih} Z`;
  const flood = pts.find((p) => p.year === 2018 && Math.abs(p.x - 2018.583) < 0.01) ?? pts.reduce((a, b) => (b.ha > a.ha ? b : a));

  const yearTicks = [2016, 2018, 2020, 2022, 2024, 2026];

  return (
    <ChartFrame
      title="Sentinel-1 SAR — open-water extent, monthly means"
      tag="reconstructed"
      provenance={provenance}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img"
        aria-label="SAR water extent from July 2015 to July 2026 with the August 2018 flood highlighted">
        {[50000, 55000, 60000, 64000].map((v) => (
          <g key={v}>
            <line x1={L} y1={Y(v)} x2={W - R} y2={Y(v)} stroke="#eae5d8" strokeWidth="1" />
            <text x={L - 8} y={Y(v) + 3} textAnchor="end" className="font-mono" fontSize="9" fill="#5f584a">
              {v / 1000}k
            </text>
          </g>
        ))}
        {yearTicks.map((yr) => (
          <g key={yr}>
            <line x1={X(yr)} y1={T} x2={X(yr)} y2={T + ih} stroke="#eae5d8" strokeWidth="1" />
            <text x={X(yr)} y={H - 18} textAnchor="middle" className="font-mono" fontSize="9" fill="#5f584a">
              {yr}
            </text>
          </g>
        ))}
        <line x1={L} y1={T + ih} x2={W - R} y2={T + ih} stroke="#1b1915" strokeWidth="1" />
        <path d={area} fill="#0e6b68" opacity="0.09" />
        <path d={line} fill="none" stroke="#0e6b68" strokeWidth="1.8" />
        <circle cx={X(flood.x)} cy={Y(flood.ha)} r="4" fill="#b4530a" stroke="#f6f3ec" strokeWidth="1.5" />
        <line x1={X(flood.x)} y1={Y(flood.ha) - 8} x2={X(flood.x)} y2={T + 8} stroke="#b4530a" strokeWidth="1" strokeDasharray="3 3" />
        <text x={X(flood.x) - 8} y={T + 14} textAnchor="end" className="font-mono" fontSize="9.5" fontWeight="600" fill="#b4530a">
          ≈62.3k ha · AUG 2018
        </text>
        <text x={L} y={T - 10} className="font-mono" fontSize="8.5" fill="#0e6b68" letterSpacing="0.16em">
          WATER EXTENT — hectares
        </text>
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 px-1">
        <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft">
          <span className="inline-block h-[2px] w-4 bg-water" /> monthly mean extent
        </span>
        <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft">
          <span className="inline-block size-2.5 rounded-full bg-flood" /> 2018 flood
        </span>
        <span className="font-mono text-[9px] text-ink-soft/80">
          note — flood extent barely separates from ordinary monsoon (55–60k ha)
        </span>
      </div>
    </ChartFrame>
  );
}

/* ===================== LULC bars ===================== */

export function LulcBars({ provenance }: { provenance: string }) {
  const max = 69.8;
  return (
    <ChartFrame
      title="Land use / land cover — Bhuvan 2015–16 (1:50K)"
      provenance={provenance}
    >
      <div className="space-y-4 pt-1">
        {lulc.filter(c => c.pct > 0).map((c) => (
          <div key={c.name} className="grid grid-cols-[130px_1fr_88px] items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">{c.name}</span>
            <div className="h-[18px] bg-paper-2 border border-paper-line">
              <div
                className="h-full"
                style={{ width: `${(c.pct / max) * 100}%`, backgroundColor: c.color, opacity: 0.88 }}
              />
            </div>
            <span className="font-mono text-[10.5px] tab-nums text-ink">
              {c.km2.toFixed(1)} km² · {c.pct}%
            </span>
          </div>
        ))}
        <div className="grid grid-cols-[130px_1fr_88px] items-center gap-3 border-t border-dashed border-paper-line pt-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">Forest</span>
          <div className="h-[18px] border border-dashed border-paper-line" />
          <span className="font-mono text-[10.5px] tab-nums text-ink-soft">0.0 km² · 0%</span>
        </div>
      </div>
      <p className="mt-4 border-l-2 border-flood pl-3 font-mono text-[9.5px] leading-relaxed text-ink-soft">
        Shares total &gt;100% — classes overlap by construction (water bodies counted inside
        wetlands, urban inside built-up). Rendered as separate bars, never as a pie.
      </p>
    </ChartFrame>
  );
}

/* ===================== Coverage Gantt ===================== */

export function CoverageGantt({
  provenance,
  rows,
  legend,
}: {
  provenance: string;
  rows: CoverageRow[];
  legend: { cat: keyof typeof coverageColors; label: string }[];
}) {
  const W = 1000;
  const rowH = 26;
  const T = 42;
  const L = 336;
  const R = 14;
  const H = T + rows.length * rowH + 14;
  const x0 = 1900;
  const x1 = 2030;
  const iw = W - L - R;
  const X = (yr: number) => L + ((yr - x0) / (x1 - x0)) * iw;

  const decades = [1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2030];

  return (
    <ChartFrame
      title="Data coverage timeline — what reaches how far back"
      provenance={provenance}
      scroll
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[760px]" style={{ fontFamily: MONO }} role="img"
        aria-label="Gantt chart of dataset temporal coverage from 1900 to 2030">
        {/* decade grid */}
        {decades.map((yr) => (
          <g key={yr}>
            <line x1={X(yr)} y1={T - 6} x2={X(yr)} y2={H - 14} stroke="#eae5d8" strokeWidth="1" />
            <text x={X(yr)} y={T - 14} textAnchor="middle" fontSize="8.5" fill="#5f584a" letterSpacing="0.08em">
              {`'${String(yr).slice(2)}`}
            </text>
          </g>
        ))}
        {/* 2018 marker */}
        <line x1={X(2018)} y1={T - 6} x2={X(2018)} y2={H - 14} stroke="#b4530a" strokeWidth="1.2" strokeDasharray="4 3" />
        <text x={X(2018)} y={T - 26} textAnchor="middle" fontSize="8.5" fill="#b4530a" letterSpacing="0.12em" fontWeight="600">
          2018 FLOOD
        </text>
        {/* rows */}
        {rows.map((r, i) => {
          const y = T + i * rowH + rowH / 2;
          const color = coverageColors[r.cat];
          const isPoint = r.point;
          return (
            <g key={r.label}>
              <text x={8} y={y + 3.5} fontSize="10" fill="#1b1915">
                {r.label.length > 52 ? r.label.slice(0, 51) + "…" : r.label}
              </text>
              {r.note && (
                <text x={8} y={y + 14} fontSize="8" fill="#a89f8c" letterSpacing="0.06em">
                  {r.note}
                </text>
              )}
              {isPoint ? (
                <rect
                  x={X(r.from) - 5}
                  y={y - 5}
                  width={10}
                  height={10}
                  fill={color}
                  stroke="#f6f3ec"
                  strokeWidth="1.2"
                />
              ) : (
                <rect x={X(r.from)} y={y - 6} width={Math.max(X(r.to) - X(r.from), 4)} height={12} fill={color} opacity="0.9" />
              )}
            </g>
          );
        })}
        <line x1={L} y1={H - 14} x2={W - R} y2={H - 14} stroke="#1b1915" strokeWidth="1" />
      </svg>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 px-1">
        {legend.map((l) => (
          <span key={l.cat} className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
            <span className="inline-block size-2.5" style={{ backgroundColor: coverageColors[l.cat] }} />
            {l.label}
          </span>
        ))}
        <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
          <span className="inline-block size-2.5 border border-paper-line bg-paper-2" /> single snapshot
        </span>
      </div>
    </ChartFrame>
  );
}
