"use client";

/**
 * KAYAL — Briefing view.
 * A ten-slide research briefing: dark room, big statements,
 * keyboard navigation, progress rule.
 */
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Eyebrow, Tag } from "@/components/research/furniture";
import { coverage, coverageColors, coverageLegend } from "@/lib/content/series";
import { phases } from "@/lib/content/status";
import { sourceRegistry, site } from "@/lib/content/site";
import type { ViewKey } from "@/components/site-shell";
import { cn } from "@/lib/utils";

/* ------------------------------ slide bodies ------------------------------ */

function StatGrid({ items, cols = 3 }: { items: [string, string][]; cols?: number }) {
  return (
    <div className={cn("grid gap-px bg-night-line border border-night-line", cols === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4", cols === 3 && "lg:grid-cols-3")}>
      {items.map(([v, l]) => (
        <div key={l} className="bg-night px-5 py-4">
          <div className="font-serif text-[24px] md:text-[30px] font-semibold leading-none tab-nums text-paper">{v}</div>
          <div className="mt-2 font-mono text-[8.5px] uppercase tracking-[0.14em] text-water-bright">{l}</div>
        </div>
      ))}
    </div>
  );
}

function SlideTitle({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <>
      <Eyebrow tone="paper">{kicker}</Eyebrow>
      <h2 className="mt-5 font-serif text-[30px] md:text-[44px] leading-[1.12] font-semibold tracking-tight text-paper max-w-3xl">
        {children}
      </h2>
    </>
  );
}

const SLIDES: { id: string; body: React.ReactNode }[] = [
  {
    id: "cover",
    body: (
      <div className="flex h-full flex-col justify-center">
        <Eyebrow tone="paper">a research briefing · ten slides · {site.period}</Eyebrow>
        <h1 className="mt-8 font-serif text-[40px] md:text-[68px] leading-[1.03] font-semibold tracking-tight text-paper">
          Forecasting the floods of a land{" "}
          <em className="italic font-normal text-water-bright">below the sea.</em>
        </h1>
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-paper-dim">
          {site.brand} · Kuttanad Flood Research · {site.location} · {site.coords}
        </p>
        <p className="mt-3 font-mono text-[10px] tracking-[0.08em] text-paper-dim/60">
          navigate with arrow keys — or the controls below
        </p>
      </div>
    ),
  },
  {
    id: "region",
    body: (
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <SlideTitle kicker="slide 02 · the region">
            A basin of 1,171 km², elongated and tilted into the sea.
          </SlideTitle>
          <p className="mt-6 max-w-xl text-[14px] leading-7 text-paper-dim">
            Mean elevation 4.92 m; robust minimum −2.97 m. Four rivers — Pamba,
            Manimala, Achankovil, Meenachil — drain into this bowl where 69.8%
            of the land is farmland. The kayal fields are tilled below sea
            level behind bunds, and every monsoon tests them.
          </p>
        </div>
        <StatGrid cols={2} items={[
          ["1,171.18 km²", "basin area"],
          ["−2.97 m", "min elevation"],
          ["69.8%", "agriculture"],
          ["0.615", "elongation ratio"],
        ]} />
      </div>
    ),
  },
  {
    id: "2018",
    body: (
      <div>
        <SlideTitle kicker="slide 03 · august 2018">
          1,398.9 mm of rain in one month. The flood that wrote the brief.
        </SlideTitle>
        <div className="mt-8">
          <StatGrid items={[
            ["4,473 mm", "2018 state rainfall"],
            ["126.4 mm", "daily peak — 15 aug"],
            ["17.11", "discharge peak — 16 aug"],
            ["43", "alappuzha fatalities"],
          ]} />
        </div>
        <p className="mt-6 max-w-2xl text-[13.5px] leading-6 text-paper-dim">
          In the Kuttanad event file the river rose from ≈5 to 17.11 in a
          fortnight. District records: 2,126 relief camps and 2,075 damaged
          houses in Alappuzha alone. Early warning here is not academic.
        </p>
      </div>
    ),
  },
  {
    id: "data",
    body: (
      <div>
        <SlideTitle kicker="slide 04 · the data foundation">
          Everything the agencies measure, collected into one archive.
        </SlideTitle>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
              <div className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-water-bright">{t}</div>
              <div className="mt-1.5 font-mono text-[10px] text-paper-dim">{d}</div>
            </div>
          ))}
        </div>
        <p className="mt-6 font-mono text-[10px] tracking-[0.06em] text-paper-dim">
          8 categories · 22 source folders · 1901–2026 span · CSV / XLS / GeoTIFF / GeoPackage
        </p>
      </div>
    ),
  },
  {
    id: "coverage",
    body: (
      <div>
        <SlideTitle kicker="slide 05 · coverage">
          The record reaches back a century — in patches.
        </SlideTitle>
        <div className="mt-8 space-y-2">
          {coverage.slice(0, 8).map((r) => (
            <div key={r.label} className="grid grid-cols-[260px_1fr] items-center gap-4">
              <span className="truncate font-mono text-[9.5px] text-paper-dim">{r.label}</span>
              <div className="h-2 bg-night-2 border border-night-line">
                <div
                  className="h-full"
                  style={{
                    marginLeft: `${((r.from - 1900) / 130) * 100}%`,
                    width: `${Math.max(((r.to - r.from) / 130) * 100, 1.2)}%`,
                    backgroundColor: coverageColors[r.cat],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {coverageLegend.slice(0, 4).map((l) => (
            <span key={l.cat} className="flex items-center gap-1.5 font-mono text-[8.5px] uppercase tracking-[0.1em] text-paper-dim">
              <span className="size-2" style={{ backgroundColor: coverageColors[l.cat] }} />
              {l.label}
            </span>
          ))}
          <span className="font-mono text-[8.5px] text-paper-dim/60">full timeline in the data inventory →</span>
        </div>
      </div>
    ),
  },
  {
    id: "audit",
    body: (
      <div>
        <SlideTitle kicker="slide 06 · the honest audit">
          Eleven flags, published in the open.
        </SlideTitle>
        <div className="mt-8 grid gap-px border border-night-line bg-night-line sm:grid-cols-3">
          {[
            ["missing piece × 2", "no unified flood-labelled table yet; weather table lacks a target", "text-[#d15a4c] border-[#d15a4c]"],
            ["caution × 5", "header-only 2026–30 files · Cauvery contamination · triple copies · terrain artifacts · undated KSEB snapshot", "text-[#e8b44a] border-[#e8b44a]"],
            ["note × 4", "SAR slices must be summed · LULC overlaps >100% · district totals need citation · offshore weather point", "text-paper-dim border-paper-dim"],
          ].map(([t, d, cls]) => (
            <div key={t} className="bg-night p-5">
              <span className={`font-mono text-[10px] font-semibold uppercase tracking-[0.14em] border-b pb-1 ${cls}`}>{t}</span>
              <p className="mt-3 text-[12.5px] leading-6 text-paper-dim">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-2xl text-[13.5px] leading-6 text-paper-dim">
          An archive earns trust by publishing its defects. Every flag carries
          the action required before the affected data enters training.
        </p>
      </div>
    ),
  },
  {
    id: "model",
    body: (
      <div>
        <SlideTitle kicker="slide 07 · the model">
          An LSTM, trained to read thirty days of weather.
        </SlideTitle>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {["rain + lags 1/3/7 d", "rolling 3/7/30 d", "temp · wind · ET₀", "humidity · pressure", "antecedent discharge"]
            .map((f) => (
              <Tag key={f} className="border-night-line text-paper-dim">{f}</Tag>
            ))}
          <span className="font-mono text-[12px] text-water-bright">→</span>
          <Tag className="border-water-bright bg-water-bright/10 text-water-bright">discharge trajectory</Tag>
          <span className="font-mono text-[12px] text-water-bright">→</span>
          <Tag className="border-[#e8b44a] text-[#e8b44a]">flood-risk class</Tag>
        </div>
        <div className="mt-8">
          <StatGrid items={[
            ["30 d", "input window"],
            ["7–30 d", "forecast horizons"],
            ["12.0", "flood threshold"],
            ["v1.0", "trained · pending hookup"],
          ]} />
        </div>
      </div>
    ),
  },
  {
    id: "console",
    body: (
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <SlideTitle kicker="slide 08 · the console">
            Reviewers don't read about the model. They run it.
          </SlideTitle>
          <p className="mt-6 max-w-xl text-[14px] leading-7 text-paper-dim">
            The Model Lab ships a working inference console: choose a rainfall
            scenario, scale intensity, pick a horizon — and read the predicted
            discharge against flood and severe thresholds. It runs a
            deterministic profile today, and switches to live weights through
            one config line the day the checkpoint is cleared.
          </p>
        </div>
        <div className="border border-night-line bg-night-2 p-5 font-mono text-[10.5px] leading-7 text-paper-dim">
          <div className="text-water-bright">console — session recipe</div>
          <div>01 · scenario — 2018-like event</div>
          <div>02 · intensity — ×1.0 (the audited event)</div>
          <div>03 · horizon — 30 days</div>
          <div className="text-[#e8b44a]">04 · read — peak 17.11 on D+16</div>
          <div className="text-[#e8b44a]">05 · class — severe · 7 d above stage</div>
          <div className="mt-2 text-paper-dim/60">the demo reproduces the recorded 2018 peak exactly</div>
        </div>
      </div>
    ),
  },
  {
    id: "status",
    body: (
      <div>
        <SlideTitle kicker="slide 09 · status">
          Four phases done. One in flight. The frontier is visible.
        </SlideTitle>
        <div className="mt-8 space-y-2.5">
          {phases.map((p) => (
            <div key={p.no} className="flex items-center gap-4 border-b border-night-line pb-2.5">
              <span className="font-mono text-[10px] text-paper-dim/70 w-8">{p.no}</span>
              <span className="w-40 font-mono text-[11px] font-medium text-paper">{p.title}</span>
              <span className="flex-1 hidden md:block font-mono text-[9.5px] text-paper-dim truncate">{p.summary}</span>
              <span
                className={cn(
                  "font-mono text-[9px] uppercase tracking-[0.14em] px-2 py-0.5 border",
                  p.status === "complete" && "border-water-bright text-water-bright",
                  p.status === "active" && "border-[#e8b44a] text-[#e8b44a]",
                  p.status === "next" && "border-paper text-paper",
                  p.status === "planned" && "border-paper-dim text-paper-dim"
                )}
              >
                {p.status === "active" ? "in progress" : p.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "close",
    body: (
      <div className="flex h-full flex-col justify-center">
        <Eyebrow tone="paper">slide 10 · next</Eyebrow>
        <h2 className="mt-6 font-serif text-[32px] md:text-[48px] leading-[1.1] font-semibold tracking-tight text-paper max-w-3xl">
          Next: one labelled table, connected weights, a validated forecast.
        </h2>
        <div className="mt-8 flex flex-wrap gap-2">
          {["unified flood labels", "NASA 1961–80 gap fill", "live LSTM hookup", "2018 backtest", "10–500-yr benchmark", "real-time feed"].map((s) => (
            <Tag key={s} className="border-night-line text-paper-dim">{s}</Tag>
          ))}
        </div>
        <p className="mt-10 font-mono text-[9px] uppercase tracking-[0.16em] text-paper-dim">
          sources — {sourceRegistry.map((s) => s.name).join(" · ")}
        </p>
        <p className="mt-3 font-mono text-[9px] tracking-[0.08em] text-paper-dim/50">
          {site.brand} · {site.brandLong} · {site.location} · {site.coords} · end of briefing
        </p>
      </div>
    ),
  },
];

/* ------------------------------- deck shell ------------------------------- */

export function BriefingView({ navigate }: { navigate: (v: ViewKey) => void }) {
  const [idx, setIdx] = useState(0);
  const total = SLIDES.length;

  const go = useCallback(
    (dir: 1 | -1) => setIdx((i) => Math.min(total - 1, Math.max(0, i + dir))),
    [total]
  );

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [go]);

  return (
    <div className="grid-night flex flex-col bg-night text-paper">
      {/* progress rule */}
      <div className="h-[3px] w-full bg-night-line">
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
        <div className="flex items-center justify-between border-t border-night-line py-4">
          <button
            onClick={() => (idx === 0 ? navigate("overview") : go(-1))}
            className="inline-flex min-h-[44px] items-center gap-2 border border-night-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-paper-dim transition-colors hover:border-paper-dim hover:text-paper"
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-4" />
            {idx === 0 ? "back to dossier" : "prev"}
          </button>
          <div className="flex items-center gap-1.5">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-1.5 w-1.5 transition-colors",
                  i === idx ? "bg-water-bright" : i < idx ? "bg-paper-dim/60" : "bg-night-line hover:bg-paper-dim/40"
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tab-nums tracking-[0.2em] text-paper-dim">
              {String(idx + 1).padStart(2, "0")} / {total}
            </span>
            <button
              onClick={() => go(1)}
              disabled={idx === total - 1}
              className="inline-flex min-h-[44px] items-center gap-2 border border-water-bright px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-water-bright transition-colors hover:bg-water-bright hover:text-night disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-water-bright"
              aria-label="Next slide"
            >
              next
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
