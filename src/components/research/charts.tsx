"use client";

/**
 * Kuttanad Flood Prediction System — SVG chart kit.
 * Hand-drawn editorial charts: hairline grids, mono axis labels,
 * no drop shadows, no rounded corners. Every chart ships with a
 * provenance line underneath.
 */
import { useState } from "react";
import {
  monsoon2018,
  sarExtent,
  lulc,
  coverage,
  coverageColors,
  type CoverageRow,
} from "@/lib/content/series";
import { cn } from "@/lib/utils";

function ChartFrame({
  children,
  title,
  provenance,
  tag,
  figNo,
  className,
  scroll,
}: {
  children: React.ReactNode;
  title: string;
  provenance?: string;
  tag?: string;
  figNo?: string;
  className?: string;
  scroll?: boolean;
}) {
  return (
    <figure className={cn("apple-shadow rounded-xl border border-black/[0.08] bg-paper", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4">
        <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
          {figNo && <span className="text-water">Fig. {figNo} — </span>}
          {title}
        </span>
        {tag && (
          <span className="rounded-full bg-flood/10 px-2.5 py-1 text-[12px] font-medium text-flood">
            {tag}
          </span>
        )}
      </div>
      <div className={cn("p-4", scroll && "overflow-x-auto slim-scroll")}>{children}</div>
      {provenance && (
        <figcaption className="border-t border-black/[0.06] px-4 py-2.5 text-[12.5px] leading-5 text-ink-soft">
          <span className="font-medium text-ink-soft/70">Provenance — </span>
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
    { label: "June", i: 0 },
    { label: "July", i: 30 },
    { label: "August", i: 61 },
    { label: "September", i: 92 },
  ];

  const [hover, setHover] = useState<number | null>(null);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.floor((px - L) / dw);
    if (i >= 0 && i < n) setHover(i);
    else setHover(null);
  };
  const hp = hover != null ? monsoon2018[hover] : null;

  return (
    <ChartFrame
      title="Monsoon 2018 — daily rainfall vs river discharge"
      tag="reconstructed"
      figNo="03"
      provenance={provenance}
    >
      <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img"
        aria-label="Daily rainfall bars with river discharge line for the 2018 monsoon, peaking 15 and 16 August"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}>
        {/* event window */}
        <rect x={x(evStart)} y={T} width={(evEnd - evStart) * dw} height={ih} fill="#c2410c" opacity="0.07" />
        <text x={x(evStart) + 4} y={T + 12} className="font-sans" fontSize="9.5" fontWeight="600" fill="#c2410c" letterSpacing="0.02em">
          Peak event · Aug 8–17
        </text>
        {/* month gridlines */}
        {months.map((m) => (
          <g key={m.label}>
            <line x1={x(m.i)} y1={T} x2={x(m.i)} y2={T + ih} stroke="#d2d2d7" strokeWidth="1" />
            <text x={x(m.i) + 5} y={H - 22} className="font-sans" fontSize="10" fill="#6e6e73">
              {m.label}
            </text>
          </g>
        ))}
        {/* y grid — rain */}
        {[0, 35, 70, 105, 140].map((v) => (
          <g key={`r${v}`}>
            <line x1={L} y1={yR(v)} x2={W - R} y2={yR(v)} stroke="#ececf0" strokeWidth="1" />
            <text x={L - 6} y={yR(v) + 3} textAnchor="end" className="font-mono" fontSize="9" fill="#6e6e73">
              {v}
            </text>
          </g>
        ))}
        {/* y grid — discharge */}
        {[0, 6, 12, 18].map((v) => (
          <text key={`q${v}`} x={W - R + 8} y={yQ(v) + 3} className="font-mono" fontSize="9" fill="#c2410c">
            {v}
          </text>
        ))}
        {/* x baseline */}
        <line x1={L} y1={T + ih} x2={W - R} y2={T + ih} stroke="#1d1d1f" strokeWidth="1" />
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
              fill={isPeak ? "#c2410c" : "#0e7490"}
              opacity={isPeak ? 1 : 0.68}
              rx="1"
            />
          );
        })}
        {/* discharge line */}
        <path d={qPath} fill="none" stroke="#1d1d1f" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
        {/* annotations */}
        <circle cx={x(peakQI) + dw / 2} cy={yQ(monsoon2018[peakQI].discharge)} r="3.4" fill="#c2410c" stroke="#ffffff" strokeWidth="1.4" />
        <text x={x(peakQI) + dw / 2 - 8} y={yQ(monsoon2018[peakQI].discharge) - 10} textAnchor="end" className="font-sans" fontSize="10.5" fontWeight="600" fill="#c2410c">
          17.11 · Aug 16
        </text>
        <text x={x(peakRainI) + dw / 2 + 4} y={yR(126.4) - 6} className="font-sans" fontSize="10.5" fontWeight="600" fill="#c2410c">
          126.4 mm · Aug 15
        </text>
        {/* axis titles */}
        <text x={L - 6} y={T - 12} textAnchor="start" className="font-sans" fontSize="10" fontWeight="600" fill="#0e7490" letterSpacing="0.01em">
          Rain · mm
        </text>
        <text x={W - R + 8} y={T - 12} className="font-sans" fontSize="10" fontWeight="600" fill="#c2410c" letterSpacing="0.01em">
          Discharge · file units
        </text>
        {/* hover crosshair */}
        {hover != null && (
          <line x1={x(hover) + dw / 2} y1={T} x2={x(hover) + dw / 2} y2={T + ih} stroke="#6e6e73" strokeWidth="0.8" opacity="0.6" />
        )}
      </svg>
      {hp && (
        <div
          className="apple-shadow pointer-events-none absolute z-10 rounded-lg border border-black/[0.08] bg-paper px-3 py-2 font-mono text-[11px] leading-relaxed text-ink"
          style={{
            left: `${((x(hover!) + dw / 2) / W) * 100}%`,
            top: 8,
            transform: x(hover!) > W * 0.6 ? "translateX(-115%)" : "translateX(15px)",
          }}
        >
          <div className="text-water font-semibold">{hp.date}</div>
          <div>rain · {hp.rain.toFixed(1)} mm</div>
          <div className="text-flood-deep">discharge · {hp.discharge.toFixed(2)}</div>
        </div>
      )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 px-1">
        <span className="flex items-center gap-2 text-[12px] text-ink-soft">
          <span className="inline-block size-2.5 rounded-[3px] bg-water/70" /> daily rainfall (mm)
        </span>
        <span className="flex items-center gap-2 text-[12px] text-ink-soft">
          <span className="inline-block h-[2px] w-4 bg-ink" /> river discharge (file units)
        </span>
        <span className="flex items-center gap-2 text-[12px] text-ink-soft">
          <span className="inline-block size-2.5 rounded-[3px] bg-flood/15" /> peak event window
        </span>
        <span className="text-[11px] text-ink-soft/70">hover the chart to inspect daily values</span>
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
      figNo="07"
      provenance={provenance}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img"
        aria-label="SAR water extent from July 2015 to July 2026 with the August 2018 flood highlighted">
        {[50000, 55000, 60000, 64000].map((v) => (
          <g key={v}>
            <line x1={L} y1={Y(v)} x2={W - R} y2={Y(v)} stroke="#ececf0" strokeWidth="1" />
            <text x={L - 8} y={Y(v) + 3} textAnchor="end" className="font-mono" fontSize="9" fill="#6e6e73">
              {v / 1000}k
            </text>
          </g>
        ))}
        {yearTicks.map((yr) => (
          <g key={yr}>
            <line x1={X(yr)} y1={T} x2={X(yr)} y2={T + ih} stroke="#ececf0" strokeWidth="1" />
            <text x={X(yr)} y={H - 18} textAnchor="middle" className="font-mono" fontSize="9" fill="#6e6e73">
              {yr}
            </text>
          </g>
        ))}
        <line x1={L} y1={T + ih} x2={W - R} y2={T + ih} stroke="#1d1d1f" strokeWidth="1" />
        <path d={area} fill="#0e7490" opacity="0.09" />
        <path d={line} fill="none" stroke="#0e7490" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={X(flood.x)} cy={Y(flood.ha)} r="4" fill="#c2410c" stroke="#ffffff" strokeWidth="1.5" />
        <line x1={X(flood.x)} y1={Y(flood.ha) - 8} x2={X(flood.x)} y2={T + 8} stroke="#c2410c" strokeWidth="1" strokeDasharray="3 3" />
        <text x={X(flood.x) - 8} y={T + 14} textAnchor="end" className="font-sans" fontSize="10.5" fontWeight="600" fill="#c2410c">
          ≈62.3k ha · Aug 2018
        </text>
        <text x={L} y={T - 10} className="font-sans" fontSize="10" fontWeight="600" fill="#0e7490" letterSpacing="0.01em">
          Water extent · hectares
        </text>
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 px-1">
        <span className="flex items-center gap-2 text-[12px] text-ink-soft">
          <span className="inline-block h-[2px] w-4 bg-water" /> monthly mean extent (ha)
        </span>
        <span className="flex items-center gap-2 text-[12px] text-ink-soft">
          <span className="inline-block size-2.5 rounded-full bg-flood" /> 2018 flood
        </span>
        <span className="text-[12px] text-ink-soft">
          Note — flood extent barely separates from ordinary monsoon (55–60k ha)
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
      figNo="05"
      provenance={provenance}
    >
      <div className="space-y-4 pt-1">
        {lulc.filter(c => c.pct > 0).map((c) => (
          <div key={c.name} className="grid grid-cols-[130px_1fr_88px] items-center gap-3">
            <span className="text-[12px] text-ink-soft">{c.name}</span>
            <div className="h-[18px] overflow-hidden rounded-md bg-paper-2 border border-black/[0.06]">
              <div
                className="h-full rounded-[3px]"
                style={{ width: `${(c.pct / max) * 100}%`, backgroundColor: c.color, opacity: 0.88 }}
              />
            </div>
            <span className="font-mono text-[11px] tab-nums text-ink">
              {c.km2.toFixed(1)} km² · {c.pct}%
            </span>
          </div>
        ))}
        <div className="grid grid-cols-[130px_1fr_88px] items-center gap-3 border-t border-dashed border-paper-line pt-3">
          <span className="text-[12px] text-ink-soft">Forest</span>
          <div className="h-[18px] border border-dashed border-paper-line rounded-md" />
          <span className="font-mono text-[11px] tab-nums text-ink-soft">0.0 km² · 0%</span>
        </div>
      </div>
      <p className="mt-4 border-l-2 border-flood pl-3 text-[13px] leading-5 text-ink-soft">
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
      figNo="06"
      provenance={provenance}
      scroll
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[760px]" role="img"
        aria-label="Gantt chart of dataset temporal coverage from 1900 to 2030">
        {/* decade grid */}
        {decades.map((yr) => (
          <g key={yr}>
            <line x1={X(yr)} y1={T - 6} x2={X(yr)} y2={H - 14} stroke="#ececf0" strokeWidth="1" />
            <text x={X(yr)} y={T - 14} textAnchor="middle" fontSize="9" className="font-mono" fill="#6e6e73">
              {`'${String(yr).slice(2)}`}
            </text>
          </g>
        ))}
        {/* 2018 marker */}
        <line x1={X(2018)} y1={T - 6} x2={X(2018)} y2={H - 14} stroke="#c2410c" strokeWidth="1.2" strokeDasharray="4 3" />
        <text x={X(2018)} y={T - 26} textAnchor="middle" fontSize="10" className="font-sans" fontWeight="600" fill="#c2410c">
          2018 flood
        </text>
        {/* rows */}
        {rows.map((r, i) => {
          const y = T + i * rowH + rowH / 2;
          const color = coverageColors[r.cat];
          const isPoint = r.point;
          return (
            <g key={r.label}>
              <text x={8} y={y + 3.5} fontSize="11" className="font-sans" fill="#1d1d1f">
                {r.label.length > 52 ? r.label.slice(0, 51) + "…" : r.label}
              </text>
              {r.note && (
                <text x={8} y={y + 15} fontSize="9" className="font-sans" fill="#86868b">
                  {r.note}
                </text>
              )}
              {isPoint ? (
                <rect
                  x={X(r.from) - 5}
                  y={y - 5}
                  width={10}
                  height={10}
                  rx="2"
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="1.2"
                />
              ) : (
                <rect x={X(r.from)} y={y - 6} width={Math.max(X(r.to) - X(r.from), 4)} height={12} rx="3" fill={color} opacity="0.9" />
              )}
            </g>
          );
        })}
        <line x1={L} y1={H - 14} x2={W - R} y2={H - 14} stroke="#1d1d1f" strokeWidth="1" />
      </svg>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 px-1">
        {legend.map((l) => (
          <span key={l.cat} className="flex items-center gap-2 text-[12px] text-ink-soft">
            <span className="inline-block size-2.5 rounded-[3px]" style={{ backgroundColor: coverageColors[l.cat] }} />
            {l.label}
          </span>
        ))}
        <span className="flex items-center gap-2 text-[12px] text-ink-soft">
          <span className="inline-block size-2.5 rounded-[3px] border border-paper-line bg-paper-2" /> single snapshot
        </span>
      </div>
    </ChartFrame>
  );
}
