"use client";

/**
 * Kuttanad Flood Prediction System — Briefing view.
 * A real ten-slide research presentation: varied compositions,
 * keyboard navigation (arrows, Home/End, Space), slide counter,
 * progress rule, and an explicit exit back to the dossier.
 */
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Eyebrow, Tag } from "@/components/research/furniture";
import { monsoon2018 } from "@/lib/content/series";
import { auditFlags, auditGroups } from "@/lib/content/inventory";
import { modelConfig } from "@/lib/model-config";
import { sourceRegistry, site } from "@/lib/content/site";
import type { ViewKey } from "@/components/site-shell";
import { cn } from "@/lib/utils";

/* ------------------------------ slide primitives ------------------------------ */

function StatGrid({ items }: { items: [string, string][] }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map(([v, l]) => (
        <div key={l} className="rounded-lg border border-night-line bg-night-2 px-5 py-4">
          <div className="text-[22px] font-semibold leading-none tab-nums tracking-[-0.01em] text-paper md:text-[26px]">
            {v}
          </div>
          <div className="mt-2 text-[12px] font-semibold text-water-bright">
            {l}
          </div>
        </div>
      ))}
    </div>
  );
}

function SlideTitle({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <>
      <Eyebrow tone="paper">{kicker}</Eyebrow>
      <h2 className="mt-5 max-w-3xl font-serif text-[28px] leading-[1.14] font-semibold tracking-tight text-paper md:text-[40px]">
        {children}
      </h2>
    </>
  );
}

/* --------------------------- slide 03 — sparkline --------------------------- */

function EventSparkline() {
  const W = 640;
  const H = 170;
  const L = 10;
  const R = 14;
  const T = 14;
  const B = 26;
  const iw = W - L - R;
  const ih = H - T - B;
  const n = monsoon2018.length;
  const dw = iw / n;
  const qMax = 18;
  const X = (i: number) => L + i * dw + dw / 2;
  const Y = (v: number) => T + (1 - v / qMax) * ih;
  const path = monsoon2018
    .map((d, i) => `${i === 0 ? "M" : "L"} ${X(i)} ${Y(d.discharge)}`)
    .join(" ");
  const peakI = 76; // 2018-08-16
  const months = [
    { label: "JUN", i: 0 },
    { label: "JUL", i: 30 },
    { label: "AUG", i: 61 },
    { label: "SEP", i: 92 },
  ];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Reconstructed discharge hydrograph, June to September 2018, peaking at 17.11 on 16 August"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <rect x={L + 68 * dw} y={T} width={10 * dw} height={ih} fill="#ff9f0a" opacity="0.08" />
      {months.map((m) => (
        <g key={m.label}>
          <line x1={L + m.i * dw} y1={T} x2={L + m.i * dw} y2={T + ih} stroke="#3a3a3f" strokeWidth="1" />
          <text x={L + m.i * dw + 6} y={H - 10} fontSize="8.5" fill="#98989d" letterSpacing="0.12em">
            {m.label}
          </text>
        </g>
      ))}
      <line x1={L} y1={T + ih} x2={W - R} y2={T + ih} stroke="#48484d" strokeWidth="1" />
      <path d={path} fill="none" stroke="#22d3ee" strokeWidth="1.6" />
      <circle cx={X(peakI)} cy={Y(17.11)} r="3.5" fill="#ff9f0a" stroke="#1d1d1f" strokeWidth="1.4" />
      <text x={X(peakI) - 8} y={Y(17.11) - 8} textAnchor="end" fontSize="10" fontWeight="600" fill="#ff9f0a">
        17.11 · 16 AUG
      </text>
      <text x={L + 68 * dw + 4} y={T + 10} fontSize="8" fill="#ff9f0a" letterSpacing="0.12em">
        EVENT WINDOW · AUG 8–17
      </text>
    </svg>
  );
}

/* ------------------------------- slide bodies ------------------------------- */

const SLIDES: { id: string; body: React.ReactNode }[] = [
  {
    id: "question",
    body: (
      <div className="flex h-full flex-col justify-center">
        <Eyebrow tone="paper">
          slide 01 · research question · {site.period}
        </Eyebrow>
        <h1 className="mt-7 max-w-4xl font-serif text-[36px] leading-[1.06] font-semibold tracking-tight text-paper md:text-[58px]">
          Can Kuttanad's floods be forecast far enough{" "}
          <em className="italic font-normal text-water-bright">ahead to act?</em>
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-7 text-paper-dim md:text-[16px]">
          An LSTM early-warning study for the below-sea-level paddy lands of
          Kuttanad, Alappuzha — where four rivers, a tide and 69.8% farmland
          meet. The question is not whether floods happen; it is whether the
          sequence of rain that precedes them can be read in time.
        </p>
        <div className="mt-7 flex flex-wrap gap-2">
          <Tag className="bg-white/[0.06] text-water-bright">complex hydrology</Tag>
          <Tag className="bg-white/[0.04] text-paper-dim">vulnerable land use</Tag>
          <Tag className="bg-white/[0.04] text-paper-dim">early-warning need</Tag>
        </div>
        <p className="mt-8 text-[12.5px] font-medium text-paper-dim/70">
          {site.brand} · {site.location} · {site.coords}
        </p>
      </div>
    ),
  },
  {
    id: "landscape",
    body: (
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <SlideTitle kicker="slide 02 · the landscape">
            A basin of 1,171 km², elongated and tilted into the sea.
          </SlideTitle>
          <p className="mt-6 max-w-xl text-[14.5px] leading-7 text-paper-dim">
            Four rivers — Pamba, Manimala, Achankovil, Meenachil — drain into
            this bowl where 69.8% of the land is farmland. The kayal fields are
            tilled below sea level behind earthen bunds, with pumped drainage
            holding back both river and tide. Every monsoon tests the geometry.
          </p>
          <p className="mt-4 max-w-xl text-[13.5px] leading-6 text-paper-dim/80">
            Sources — basin characteristics table (read in full); Bhuvan LULC 2015–16,
            1:50K. Morphometry from the delineated SRTM-based basin model.
          </p>
        </div>
        <div className="border border-night-line">
          {[
            ["BASIN AREA", "1,171.18 km²"],
            ["MAINSTREAM LENGTH", "62.75 km"],
            ["MEAN ELEVATION", "4.92 m"],
            ["ROBUST MINIMUM", "−2.97 m — below sea level"],
            ["ELONGATION RATIO", "0.615 — runoff concentrates"],
            ["MAX STREAM ORDER", "4 · 287 sub-basins"],
            ["AGRICULTURE SHARE", "69.8% of the basin"],
            ["LOCAL RAIN GAUGES", "6 — NWIC stations"],
          ].map(([k, v], i) => (
            <div
              key={k}
              className={`grid grid-cols-[190px_1fr] gap-3 px-4 py-2.5 ${
                i !== 7 ? "border-b border-night-line" : ""
              }`}
            >
              <span className="text-[12px] font-semibold text-paper-dim">{k}</span>
              <span className="font-mono text-[12px] tab-nums text-paper">{v}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "event",
    body: (
      <div>
        <SlideTitle kicker="slide 03 · the reference event">
          1,398.9 mm of rain in one month. The flood that wrote the brief.
        </SlideTitle>
        <div className="mt-6 border border-night-line bg-night-2 p-4">
          <EventSparkline />
          <p className="mt-2 text-[12px] leading-5 text-paper-dim/70">
            reconstructed discharge hydrograph — peaks exact (17.11 file units, 16 Aug), daily shape illustrative
          </p>
        </div>
        <div className="mt-5">
          <StatGrid
            items={[
              ["4,473 mm", "2018 state rainfall"],
              ["126.4 mm", "daily peak — 15 aug"],
              ["17.11", "discharge peak — 16 aug"],
              ["43", "alappuzha fatalities"],
            ]}
          />
        </div>
        <p className="mt-5 max-w-2xl text-[13.5px] leading-6 text-paper-dim">
          The river rose from ≈5 to 17.11 in a fortnight. District records:
          2,126 relief camps and 2,075 damaged houses in Alappuzha alone.
          Early warning here is not academic.
        </p>
      </div>
    ),
  },
  {
    id: "archive",
    body: (
      <div>
        <SlideTitle kicker="slide 04 · the data archive">
          Everything the agencies measure, collected into one archive.
        </SlideTitle>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["01 · flood history", "1901–2018 labels"],
            ["02 · river hydrology", "discharge 1950–2026"],
            ["03 · rainfall & weather", "21,915 ML-ready rows"],
            ["04 · satellite", "SAR 2015–2026"],
            ["05 · terrain", "SRTM · 4,000 grid cells"],
            ["06 · land use", "Bhuvan 2015–16"],
            ["07 · reservoirs", "16 KSEB dams"],
            ["08 · literature", "10–500-yr return layers"],
          ].map(([t, d]) => (
            <div key={t} className="border border-night-line bg-night px-4 py-3.5">
              <div className="text-[13px] font-semibold text-water-bright">
                {t}
              </div>
              <div className="mt-1.5 font-mono text-[10.5px] text-paper-dim">{d}</div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[13px] leading-6 text-paper-dim">
          8 categories · 22 source folders · 1901–2026 span · CSV / XLS / GeoTIFF /
          GeoPackage · every file carries an audit state — read, preview, or catalogued.
        </p>
      </div>
    ),
  },
  {
    id: "quality",
    body: (
      <div>
        <SlideTitle kicker="slide 05 · data-quality findings">
          Eleven defects, published in the open — grouped by impact.
        </SlideTitle>
        <div className="mt-7 grid gap-px border border-night-line bg-night-line sm:grid-cols-2">
          {auditGroups.map((g) => {
            const flags = auditFlags.filter((f) => f.impact === g.id);
            return (
              <div key={g.id} className="bg-night p-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif text-[16px] font-semibold text-paper">{g.label}</h3>
                  <span
                    className={cn(
                      "font-mono text-[11px] font-semibold tab-nums",
                      g.id === "target" ? "text-[#ff453a]" : "text-[#ff9f0a]"
                    )}
                  >
                    ×{flags.length}
                  </span>
                </div>
                <p className="mt-2 text-[12.5px] leading-6 text-paper-dim">{g.blurb}</p>
                <p className="mt-3 border-t border-night-line pt-2.5 text-[12px] leading-5 text-paper-dim/70">
                  flags {flags.map((f) => f.no).join(" · ")} — full register in the data view
                </p>
              </div>
            );
          })}
        </div>
        <p className="mt-5 max-w-2xl text-[13.5px] leading-6 text-paper-dim">
          An archive earns trust by publishing its defects. Every flag names the
          dataset it affects and the corrective action required before that data
          enters training.
        </p>
      </div>
    ),
  },
  {
    id: "features",
    body: (
      <div>
        <SlideTitle kicker="slide 06 · feature engineering">
          From agency archives to a sequence a network can read.
        </SlideTitle>
        <div className="mt-7 flex flex-wrap items-center gap-2">
          {[
            "temperature · rain · wind · radiation · ET₀",
            "humidity · pressure · dew point",
            "calendar — month, day-of-year",
            "rainfall lags 1 / 3 / 7 d",
            "rolling sums 3 / 7 / 30 d",
          ].map((f) => (
            <Tag key={f} className="bg-white/[0.04] text-paper-dim">
              {f}
            </Tag>
          ))}
          <span className="font-mono text-[13px] text-water-bright">→</span>
          <Tag className="bg-water-bright/15 text-water-bright">
            one row per day — 21,915 rows
          </Tag>
        </div>
        <div className="mt-6 border border-night-line bg-night-2 p-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 font-mono text-[10.5px] text-paper-dim">
            <span className="text-[13px] font-semibold text-water-bright">The window —</span>
            <span className="flex items-center gap-1.5">
              {Array.from({ length: 30 }).map((_, k) => (
                <span
                  key={k}
                  className="h-4 w-[7px] border"
                  style={{
                    background: k < 29 ? "#2c2c2e" : "#22d3ee",
                    borderColor: k < 29 ? "#3a3a3f" : "#22d3ee",
                  }}
                />
              ))}
            </span>
            <span>t−29 … t</span>
            <span className="text-water-bright">→</span>
            <span>
              LSTM reads <span className="text-paper">30 days × 14 features</span>
            </span>
            <span className="text-water-bright">→</span>
            <span>
              target — <span className="text-[#ff9f0a]">discharge t+1 … t+H</span>
            </span>
          </div>
          <p className="mt-4 text-[12.5px] leading-6 text-paper-dim">
            The open defect: the table carries no flood or discharge label yet,
            and NASA POWER fields are empty for 1961–1980 (33.3% of rows).
            Labelled targets must be joined before training can be reproduced
            end to end.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "model",
    body: (
      <div>
        <SlideTitle kicker="slide 07 · the model">
          A stacked LSTM reading thirty days of weather.
        </SlideTitle>
        <div className="mt-7 flex flex-wrap items-stretch gap-2">
          {[
            { t: "input window", s: "30 d × 14 features", tone: "outline" },
            { t: "lstm layer 1", s: "128 units · return sequences", tone: "water" },
            { t: "lstm layer 2", s: "64 units · last state", tone: "water" },
            { t: "dense head", s: "relu 32 → linear", tone: "outline" },
            { t: "threshold step", s: "flood ≥ 12 · severe ≥ 15", tone: "amber" },
          ].map((b, i) => (
            <div key={b.t} className="flex items-center gap-2">
              <div
                className={cn(
                  "rounded-lg border px-3.5 py-3",
                  b.tone === "water" && "border-water-bright/40 bg-water-bright/10",
                  b.tone === "outline" && "border-night-line bg-night-2",
                  b.tone === "amber" && "border-dashed border-[#ff9f0a]/60"
                )}
              >
                <div
                  className={cn(
                    "text-[12px] font-semibold",
                    b.tone === "water" ? "text-water-bright" : b.tone === "amber" ? "text-[#ff9f0a]" : "text-paper"
                  )}
                >
                  {b.t}
                </div>
                <div className="mt-1 font-mono text-[10px] text-paper-dim">{b.s}</div>
              </div>
              {i < 4 && <span className="font-mono text-[12px] text-water-bright">→</span>}
            </div>
          ))}
        </div>
        <div className="mt-6">
          <StatGrid
            items={[
              [modelConfig.inputWindow, "input window"],
              [modelConfig.horizons.map((h) => `${h}`).join(" · ") + " d", "forecast horizons"],
              [String(modelConfig.floodThreshold), "flood threshold"],
              ["v1.0", "trained · pending hookup"],
            ]}
          />
        </div>
        <p className="mt-5 max-w-2xl text-[13px] leading-6 text-paper-dim">
          The model predicts river discharge — not flood depth and not
          probability. The warning class is a separate threshold step drawn
          dashed here because it runs after the network, not inside it.
        </p>
      </div>
    ),
  },
  {
    id: "implementation",
    body: (
      <div>
        <SlideTitle kicker="slide 08 · the current implementation">
          Reviewers don't read about the model. They run it.
        </SlideTitle>
        <div className="mt-7 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            {[
              ["inference console", "built — deterministic DEMO profile running now", "#ff9f0a"],
              ["python service hookup", "documented — contract + FastAPI example ready", "text-paper-dim"],
              ["onnx in-browser", "proposal — needs an ONNX export of the checkpoint", "text-paper-dim"],
              ["live weights", "pending release clearance — one config line to switch", "text-paper-dim"],
            ].map(([k, v, tone]) => (
              <div key={k} className="flex items-start gap-3 border border-night-line bg-night px-4 py-3">
                <span className="mt-1 size-1.5 shrink-0" style={{ backgroundColor: tone }} />
                <div>
                  <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-paper">
                    {k}
                  </span>
                  <span className="mt-0.5 block text-[12.5px] leading-6 text-paper-dim">{v}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="border border-night-line bg-night-2 p-5 font-mono text-[10.5px] leading-7 text-paper-dim">
            <div className="text-water-bright">console — session recipe</div>
            <div>01 · scenario — 2018-like event</div>
            <div>02 · intensity — ×1.0 (the audited event)</div>
            <div>03 · horizon — 30 days</div>
            <div className="text-[#ff9f0a]">04 · read — peak 17.11 on D+16</div>
            <div className="text-[#ff9f0a]">05 · class — severe · 7 d above stage</div>
            <div className="mt-2 text-paper-dim/60">
              the demo reproduces the recorded 2018 peak exactly — and says so
              on every run
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "validation",
    body: (
      <div>
        <SlideTitle kicker="slide 09 · the validation gap">
          What evidence is still required before any skill is claimed.
        </SlideTitle>
        <div className="mt-7 grid gap-px border border-night-line bg-night-line sm:grid-cols-2">
          {[
            [
              "unified labelled table",
              "no merged daily table with a Kuttanad flood target exists yet — labels must come from discharge thresholds, IndoFloods events, or summed SAR extent",
            ],
            [
              "2018 backtest",
              "the reference event is held out for validation; the console's reproduction of its peak is a calibration, not a forecast skill test",
            ],
            [
              "return-period benchmark",
              "10–500-yr exceedance rasters (± climate change) provide the independent benchmark for LSTM exceedance estimates",
            ],
            [
              "published metrics",
              "NSE, MAE and peak error stay blank on the model card until the live weights are connected — no performance claims are made in this dossier",
            ],
          ].map(([k, v]) => (
            <div key={k} className="bg-night p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] font-semibold text-paper">
                  {k}
                </span>
                <span className="rounded-full bg-[#ff9f0a]/15 px-2.5 py-0.5 text-[11.5px] font-medium text-[#ff9f0a]">
                  pending
                </span>
              </div>
              <p className="mt-2.5 text-[12.5px] leading-6 text-paper-dim">{v}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-2xl text-[13.5px] leading-6 text-paper-dim">
          Until these four close, the honest summary is: a trained model exists,
          a working integration exists, and no validated predictive skill has
          been demonstrated. That is the gap the next phase is designed to close.
        </p>
      </div>
    ),
  },
  {
    id: "next",
    body: (
      <div className="flex h-full flex-col justify-center">
        <Eyebrow tone="paper">slide 10 · next steps</Eyebrow>
        <h2 className="mt-6 max-w-3xl font-serif text-[30px] leading-[1.1] font-semibold tracking-tight text-paper md:text-[44px]">
          Next: one labelled table, connected weights, a validated forecast.
        </h2>
        <div className="mt-7 max-w-3xl space-y-2.5">
          {[
            ["01", "decide the flood-label derivation — thresholds, IndoFloods, or SAR-paired"],
            ["02", "connect the weights — set the inference endpoint; DEMO becomes LIVE"],
            ["03", "fill the NASA POWER 1961–1980 void in the weather table"],
            ["04", "backtest on 2018 and benchmark against the return-period rasters"],
            ["05", "publish NSE, MAE and peak error on the model card — then judge the model"],
          ].map(([n, t]) => (
            <div key={n} className="flex items-baseline gap-4 border-b border-night-line pb-2.5">
              <span className="font-mono text-[10.5px] font-semibold text-water-bright">{n}</span>
              <span className="text-[13.5px] leading-6 text-paper-dim">{t}</span>
            </div>
          ))}
        </div>
        <p className="mt-10 text-[12px] font-medium text-paper-dim">
          Sources — {sourceRegistry.map((s) => s.name).join(" · ")}
        </p>
        <p className="mt-3 font-mono text-[9px] tracking-[0.08em] text-paper-dim/50">
          {site.brand} · {site.location} · {site.coords} · end of briefing
        </p>
      </div>
    ),
  },
];

/* ------------------------------- deck shell ------------------------------- */

export function BriefingView({
  navigate,
  active = true,
}: {
  navigate: (v: ViewKey) => void;
  active?: boolean;
}) {
  const [idx, setIdx] = useState(0);
  const total = SLIDES.length;

  const go = useCallback(
    (dir: 1 | -1) => setIdx((i) => Math.min(total - 1, Math.max(0, i + dir))),
    [total]
  );

  useEffect(() => {
    // views are permanently mounted — only respond to keys while visible
    if (!active) return;
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable)
      )
        return;
      if (e.key === "ArrowRight" || (e.key === " " && t?.tagName !== "BUTTON")) {
        if (e.key === " ") e.preventDefault();
        go(1);
      }
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Home") {
        e.preventDefault();
        setIdx(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        setIdx(total - 1);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [go, total, active]);

  return (
    <div className="grid-night flex flex-col bg-night text-paper">
      {/* progress rule */}
      <div className="h-[3px] w-full bg-night-line" aria-hidden>
        <div
          className="h-full bg-water-bright transition-all duration-300"
          style={{ width: `${((idx + 1) / total) * 100}%` }}
        />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-6xl flex-col px-5 md:px-8">
        {/* slide */}
        <div className="relative flex-1 py-12 md:py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="min-h-[420px]"
            >
              {SLIDES[idx].body}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* controls */}
        <div className="flex flex-wrap items-center justify-between gap-y-3 border-t border-night-line py-4">
          <button
            onClick={() => (idx === 0 ? navigate("overview") : go(-1))}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-night-line px-4 py-2.5 text-[13px] font-medium text-paper-dim transition-colors hover:border-paper-dim hover:text-paper"
            aria-label={idx === 0 ? "Back to dossier" : "Previous slide"}
          >
            <ChevronLeft className="size-4" />
            {idx === 0 ? "Back to dossier" : "Prev"}
          </button>
          <div className="hidden items-center gap-1.5 sm:flex">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === idx ? "true" : undefined}
                className={cn(
                  "h-1.5 w-1.5 transition-colors",
                  i === idx
                    ? "bg-water-bright"
                    : i < idx
                      ? "bg-paper-dim/60"
                      : "bg-night-line hover:bg-paper-dim/40"
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span
              className="text-[13px] font-medium tab-nums text-paper-dim"
              aria-live="polite"
            >
              {String(idx + 1).padStart(2, "0")} / {total}
            </span>
            <button
              onClick={() => navigate("overview")}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-night-line px-3 py-2.5 text-[13px] font-medium text-paper-dim transition-colors hover:border-severe hover:text-severe"
              aria-label="Exit briefing, return to dossier"
            >
              <X className="size-4" />
              <span className="hidden sm:inline">Exit</span>
            </button>
            <button
              onClick={() => go(1)}
              disabled={idx === total - 1}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-water-bright px-4 py-2.5 text-[13px] font-semibold text-night transition-opacity hover:opacity-90 disabled:opacity-30"
              aria-label="Next slide"
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
