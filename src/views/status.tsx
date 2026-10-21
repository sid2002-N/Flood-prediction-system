"use client";

/**
 * KAYAL — Status view.
 * Phase ledger, open questions, and the deliverable register.
 */
import { SectionHeading, Eyebrow, StatusPill } from "@/components/research/furniture";
import { phases, openQuestions } from "@/lib/content/status";
import type { ViewKey } from "@/components/site-shell";
import { ArrowRight, CircleHelp } from "lucide-react";

const REGISTER = [
  ["collected archive", "8 categories · 22 folders · 1901–2026 · 40+ datasets"],
  ["audit ledger", "11 flags filed — every defect documented with an action"],
  ["ML-ready weather table", "21,915 daily rows · lags · rolling sums · 1961–2020"],
  ["trained model", "KAYAL-LSTM v1.0 — awaiting weights hookup"],
  ["this dossier", "inventory · event analysis · console · briefing — live"],
];

export function StatusView({ navigate }: { navigate: (v: ViewKey) => void }) {
  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-14 md:py-20">
      <div className="mb-12">
        <div className="flex items-baseline gap-3 border-t border-paper-line pt-3">
          <span className="font-mono text-[11px] font-semibold text-water">11</span>
          <Eyebrow>project status — where the work stands</Eyebrow>
        </div>
        <h1 className="mt-5 font-serif text-4xl md:text-[52px] leading-[1.05] font-semibold tracking-tight">
          The Ledger
        </h1>
        <p className="mt-5 max-w-3xl text-[15px] leading-7 text-ink-soft">
          A project tells the truth in its phase book. Four phases are
          complete, integration is in progress, and the path to a labelled
          training table — the one artifact the model still needs — is fully
          specified. Below: the phase ledger, the questions still open, and
          the register of what already exists.
        </p>
      </div>

      {/* phase ledger */}
      <ol className="relative border-l border-paper-line ml-2 space-y-10">
        {phases.map((p) => (
          <li key={p.no} className="relative pl-8">
            <span
              className={`absolute -left-[7px] top-1.5 size-3 border-2 ${
                p.status === "complete"
                  ? "bg-water border-water"
                  : p.status === "active"
                    ? "bg-flood border-flood animate-pulse"
                    : p.status === "next"
                      ? "bg-paper border-ink-soft"
                      : "bg-paper border-paper-line"
              }`}
            />
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[10px] font-semibold tracking-[0.16em] text-ink-soft">
                PHASE {p.no}
              </span>
              <StatusPill state={p.status === "active" ? "active" : p.status} />
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper-dim">
                {p.when}
              </span>
            </div>
            <h2 className="mt-2 font-serif text-[22px] font-semibold text-ink">{p.title}</h2>
            <p className="mt-1.5 max-w-2xl text-[14px] leading-6 text-ink-soft">{p.summary}</p>
            <ul className="mt-3 max-w-2xl space-y-2">
              {p.points.map((pt) => (
                <li key={pt} className="flex gap-3 text-[13px] leading-6 text-ink-soft">
                  <span className="mt-[10px] h-px w-3.5 shrink-0 bg-paper-dim" />
                  {pt}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      {/* open questions */}
      <div className="mt-16">
        <SectionHeading
          no="12"
          kicker="open questions"
          title="What we still have to decide."
          lede="Every open question is a decision with a named owner: the data side. Each one blocks or shapes the unified training table — none of them is a surprise."
        />
        <div className="border border-paper-line bg-card divide-y divide-paper-line">
          {openQuestions.map((o) => (
            <div key={o.q} className="grid gap-2 p-5 md:grid-cols-[300px_1fr] md:gap-6">
              <div className="flex items-start gap-2.5">
                <CircleHelp className="mt-0.5 size-4 shrink-0 text-flood" />
                <h3 className="font-serif text-[16.5px] font-semibold leading-snug text-ink">
                  {o.q}
                </h3>
              </div>
              <p className="text-[13.5px] leading-6 text-ink-soft">{o.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* deliverable register */}
      <div className="mt-16">
        <SectionHeading
          no="13"
          kicker="deliverable register"
          title="What already exists."
        />
        <dl className="border border-paper-line bg-card">
          {REGISTER.map(([k, v], i) => (
            <div
              key={k}
              className={`grid gap-3 px-5 py-4 md:grid-cols-[240px_1fr] ${
                i !== REGISTER.length - 1 ? "border-b border-paper-line/70" : ""
              }`}
            >
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft pt-0.5">
                {k}
              </dt>
              <dd className="text-[13.5px] font-medium leading-6 text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => navigate("model")}
            className="group inline-flex min-h-[44px] items-center gap-2 border border-ink bg-ink px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-paper transition-colors hover:bg-water"
          >
            go to the model console
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={() => navigate("data")}
            className="group inline-flex min-h-[44px] items-center gap-2 border border-paper-line px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink"
          >
            review the data inventory
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
