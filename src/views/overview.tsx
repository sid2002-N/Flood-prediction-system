"use client";

/**
 * Kuttanad Flood Prediction System — Overview view.
 * Hero, the problem, the 2018 event, the method, and a status digest.
 */
import { SectionHeading, Eyebrow, Stat, Figure, Tag } from "@/components/research/furniture";
import { ApproachPipeline } from "@/components/research/diagrams";
import { MonsoonChart, LulcBars } from "@/components/research/charts";
import { heroStats, site, sourceRegistry, figuresNote } from "@/lib/content/site";
import {
  monsoon2018Provenance,
  alappuzha2018,
  lulcProvenance,
} from "@/lib/content/series";
import type { ViewKey } from "@/components/site-shell";
import { ArrowRight, FileWarning, Database, FlaskConical } from "lucide-react";

export function OverviewView({ navigate }: { navigate: (v: ViewKey) => void }) {
  return (
    <div>
      {/* ================================ HERO ================================ */}
      <section className="grid-night bg-night text-paper">
        <div className="mx-auto max-w-6xl px-5 md:px-8 pt-14 md:pt-20 pb-0">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div className="pb-14 md:pb-20">
              <Eyebrow tone="paper">
                research dossier · {site.location} · {site.coords}
              </Eyebrow>
              <h1 className="mt-6 font-serif text-[42px] leading-[1.04] font-semibold tracking-tight md:text-[64px]">
                Forecasting the floods of a land{" "}
                <em className="italic font-normal text-water-bright">below the sea.</em>
              </h1>
              <p className="mt-6 max-w-xl text-[15px] leading-7 text-paper-dim">
                The Kuttanad Flood Prediction System is an LSTM-based
                flood-forecasting study of the kayal paddy lands of Alappuzha,
                Kerala — farmland that lies below sea level, where the monsoon
                decides the harvest. This dossier documents every dataset
                collected so far, the August 2018 flood that motivates the work,
                the trained forecasting model, and exactly where the project
                stands.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("data")}
                  className="group inline-flex min-h-[44px] items-center gap-2 border border-paper bg-paper px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-night transition-colors hover:bg-water-bright hover:border-water-bright"
                >
                  <Database className="size-3.5" />
                  open the data inventory
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={() => navigate("model")}
                  className="group inline-flex min-h-[44px] items-center gap-2 border border-night-line bg-transparent px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-paper transition-colors hover:border-paper-dim"
                >
                  <FlaskConical className="size-3.5 text-water-bright" />
                  run the model console
                </button>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
                <Tag className="border-water-bright/60 text-water-bright">lstm v1.0 · trained</Tag>
                <Tag className="border-night-line text-paper-dim">deployment — in progress</Tag>
                <span className="font-mono text-[9px] tracking-[0.1em] text-paper-dim/70">
                  {site.period}
                </span>
              </div>
            </div>

            <div className="relative pb-10 lg:pb-0">
              <Figure
                src="/images/hero-aerial.jpg"
                alt="Aerial view of canals between rice paddies and houses in Kuttanad, Kerala"
                figNo="00"
                caption="Kuttanad kayal lands — canals cut between paddy fields and homesteads"
                provenance="photograph · web image search · for illustration"
                dark
                className="lg:translate-y-6"
              />
              <div className="absolute left-3 top-3 border border-night-line bg-night/85 px-2.5 py-1.5 font-mono text-[9px] tracking-[0.14em] text-water-bright backdrop-blur-sm">
                9.5°N 76.5°E · ALAPPUZHA
              </div>
            </div>
          </div>
        </div>

        {/* stat strip */}
        <div className="border-t border-night-line">
          <div className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-night-line px-0 lg:px-0">
            {heroStats.map((s) => (
              <div key={s.label} className="bg-night">
                <Stat value={s.value} label={s.label} note={s.note} dark />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ 01 — THE PROBLEM ============================ */}
      <section className="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24">
        <SectionHeading
          no="01"
          kicker="the problem"
          title="A basin that floods by design."
          lede="Kuttanad is hydrology's hard mode: a stretched, near-sea-level basin where four rivers meet the tide, ringed by bunds that hold water out — until they can't."
        />
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
          <div className="space-y-5 text-[15px] leading-7 text-ink-soft">
            <p>
              The delineated study basin covers <strong className="font-semibold text-ink">1,171.18 km²</strong> with a
              mainstream length of 62.75 km and an elongation ratio of 0.615 — a stretched
              shape that concentrates runoff rather than buffering it. The vertical
              story is more extreme still: mean elevation is just{" "}
              <strong className="font-semibold text-ink">4.92 m</strong>, and the robust minimum sits at{" "}
              <strong className="font-semibold text-ink">−2.97 m</strong> — the mathematical
              signature of land lying below sea level. The Pamba, Manimala,
              Achankovil and Meenachil rivers drain into this bowl, and every
              monsoon they arrive together.
            </p>
            <p>
              What makes the region matter is what the water stands to ruin.
              Bhuvan's land-cover census puts{" "}
              <strong className="font-semibold text-ink">69.8% of the basin under agriculture</strong>{" "}
              (817.4 km²) and another 19.7% under wetlands. The kayal paddy
              fields are farmed below sea level, protected by earthen bunds and
              pumped drainage; a flood here is not an inconvenience but a total
              loss of season, soil and settlement. Six local NWIC rain gauges —
              Ambalapuzha, Venmony, Cherthala, Arookutty, Mancompu, Kollakadavu —
              sit inside or beside the study area, evidence of how closely this
              water is already watched.
            </p>
            <p>
              The 2018 monsoon settled any doubt about the stakes. The state
              recorded 4,473 mm of rain that year, and the impact tables show
              what that meant on the ground — the study exists to give this
              landscape a forecast it currently does not have.
            </p>
          </div>
          <div>
            <Figure
              src="/images/paddy-flooded.jpg"
              alt="Flooded rice paddies reflecting palm trees in Kerala"
              figNo="01"
              caption="Paddy under water — the kayal fields' ordinary risk"
              provenance="photograph · web image search · for illustration"
            />
            <dl className="mt-6 border border-paper-line bg-paper-2/50 divide-y divide-paper-line">
              {[
                ["BASIN AREA", "1,171.18 km²"],
                ["MEAN ELEVATION", "4.92 m"],
                ["ROBUST MINIMUM", "−2.97 m"],
                ["ELONGATION RATIO", "0.615 — concentrated runoff"],
                ["AGRICULTURE", "69.8% of basin"],
                ["LOCAL GAUGES", "6 · NWIC"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between px-4 py-2.5">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-soft">{k}</dt>
                  <dd className="font-mono text-[11px] font-medium tab-nums text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ============================ 02 — 2018 EVENT ============================ */}
      <section className="border-y border-paper-line bg-paper-2/40">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24">
          <SectionHeading
            no="02"
            kicker="the 2018 event"
            title="August 2018 — the flood that wrote this project's brief."
            lede="One month delivered 31% of an extreme year. The Kuttanad event file records the daily exchange between rain and river — and the district impact tables record what it cost."
          />
          <div className="mb-8 grid grid-cols-2 gap-px border border-paper-line bg-paper-line lg:grid-cols-4">
            {alappuzha2018.map((s) => (
              <div key={s.label} className="bg-paper px-4 py-4">
                <div className="font-serif text-[26px] font-semibold leading-none tab-nums text-ink">
                  {s.value}
                </div>
                <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-water">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="mb-8 max-w-3xl border-l-2 border-flood pl-4 text-[13.5px] leading-6 text-ink-soft">
            Alappuzha district, from the district-wise 2018 impact table — rainfall
            actual 608.2 mm against a 343.1 mm normal. The table covers 14
            districts; district fatalities sum to 339, so the source should be
            cited before any total is republished.
          </p>
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <MonsoonChart provenance={monsoon2018Provenance} />
            <div className="space-y-8">
              <Figure
                src="/images/flood-village.jpg"
                alt="Aerial view of a village flooded by muddy brown water in Kerala, 2018"
                figNo="02"
                caption="August 2018 — villages under brown water"
                provenance="photograph · web image search · 2018 Kerala floods"
              />
              <LulcBars provenance={lulcProvenance} />
            </div>
          </div>
          <p className="mt-6 font-mono text-[9px] leading-relaxed tracking-[0.04em] text-ink-soft/80">
            {figuresNote}
          </p>
        </div>
      </section>

      {/* ============================ 03 — METHOD ============================ */}
      <section className="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24">
        <SectionHeading
          no="03"
          kicker="method"
          title="From agency archives to a sequence model."
          lede="The work so far is a deliberate chain: collect everything the agencies already measure, audit it honestly, engineer the sequences a model can read, and train. What remains is the labelled table that ties it together."
        />
        <ApproachPipeline />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Database,
              t: "Everything, catalogued",
              d: "40+ datasets across 8 categories and 22 folders, each filed as read, previewed or catalogued — with its coverage, format and flaws on record.",
            },
            {
              icon: FileWarning,
              t: "Flaws, on the record",
              d: "Eleven audit flags — from Cauvery-basin contamination to header-only future files — are documented in the open, not buried.",
            },
            {
              icon: FlaskConical,
              t: "Labels are the frontier",
              d: "The one missing piece is a unified flood label. Three candidate sources exist: discharge thresholds, IndoFloods events, and summed SAR flood extent.",
            },
          ].map((c) => (
            <div key={c.t} className="border border-paper-line bg-card p-5">
              <c.icon className="size-4 text-water" />
              <h3 className="mt-3 font-serif text-[17px] font-semibold text-ink">{c.t}</h3>
              <p className="mt-2 text-[13.5px] leading-6 text-ink-soft">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ 04 — STATUS DIGEST ============================ */}
      <section className="border-t border-paper-line bg-night text-paper">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-20">
          <div className="flex items-baseline gap-3 border-t border-night-line pt-3">
            <span className="font-mono text-[11px] font-semibold text-water-bright">04</span>
            <Eyebrow tone="paper">status digest</Eyebrow>
          </div>
          <div className="mt-8 grid gap-px bg-night-line border border-night-line md:grid-cols-3">
            {[
              {
                k: "done",
                t: "Complete",
                items: [
                  "Data collection — 8 categories, 1901–2026 span",
                  "Audit & preprocessing — cleaned copies, 11 flags",
                  "Feature engineering — 21,915-row ML weather table",
                  "LSTM v1.0 trained",
                ],
              },
              {
                k: "active",
                t: "In progress",
                items: [
                  "This dossier & forecasting console — live now",
                  "Pluggable inference adapter — demo weights running",
                  "Model weights hookup — awaiting release clearance",
                ],
              },
              {
                k: "next",
                t: "Next",
                items: [
                  "Unified labelled training table — labels from thresholds / IndoFloods / SAR",
                  "NASA POWER 1961–80 gap fill",
                  "Validation vs 10–500-yr return periods · real-time feed",
                ],
              },
            ].map((col) => (
              <div key={col.k} className="bg-night p-6">
                <div className="flex items-center gap-2">
                  <span
                    className={
                      col.k === "active"
                        ? "size-1.5 rounded-full bg-flood animate-pulse"
                        : col.k === "done"
                          ? "size-1.5 rounded-full bg-water-bright"
                          : "size-1.5 rounded-full border border-paper-dim"
                    }
                  />
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper">{col.t}</h3>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {col.items.map((it) => (
                    <li key={it} className="flex gap-2.5 text-[13px] leading-6 text-paper-dim">
                      <span className="mt-[9px] h-px w-3 shrink-0 bg-paper-dim/50" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("status")}
              className="group inline-flex min-h-[44px] items-center gap-2 border border-night-line px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-paper transition-colors hover:border-paper-dim"
            >
              full project status
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => navigate("briefing")}
              className="group inline-flex min-h-[44px] items-center gap-2 border border-water-bright/70 px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-water-bright transition-colors hover:bg-water-bright hover:text-night"
            >
              10-slide research briefing
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================ SOURCES ============================ */}
      <section className="mx-auto max-w-6xl px-5 md:px-8 py-12">
        <Eyebrow>data partners & sources</Eyebrow>
        <div className="mt-5 grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-5">
          {sourceRegistry.map((s) => (
            <div key={s.name} className="border-l border-paper-line pl-3">
              <div className="font-mono text-[11px] font-medium text-ink">{s.name}</div>
              <div className="font-mono text-[9px] leading-relaxed text-ink-soft">{s.full}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
