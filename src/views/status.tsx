"use client";

/**
 * Kuttanad Flood Prediction System — Status view.
 * Position strip, phase ledger with evidence and blocking
 * dependencies, the open-questions register, and deliverables.
 */
import { SectionHeading, Eyebrow, Stat, StatusPill } from "@/components/research/furniture";
import { phases, openQuestions } from "@/lib/content/status";
import type { ViewKey } from "@/components/site-shell";
import { ArrowRight, CircleHelp, FileCheck2 } from "lucide-react";

const REGISTER: { k: string; v: string; view?: ViewKey }[] = [
  {
    k: "collected archive",
    v: "8 categories · 22 folders · 1901–2026 · 40+ datasets",
    view: "data",
  },
  {
    k: "audit ledger",
    v: "11 flags filed — every defect documented with an action",
    view: "data",
  },
  {
    k: "ML-ready weather table",
    v: "21,915 daily rows · lags · rolling sums · 1961–2020",
    view: "data",
  },
  {
    k: "trained model",
    v: "Kuttanad-LSTM v1.0 — awaiting weights hookup",
    view: "model",
  },
  {
    k: "this dossier",
    v: "inventory · event analysis · console · briefing — live",
    view: "overview",
  },
  {
    k: "research briefing",
    v: "10 slides — keyboard-navigable, embedded in the site",
    view: "briefing",
  },
];

export function StatusView({ navigate }: { navigate: (v: ViewKey) => void }) {
  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-14 md:py-20">
      {/* ------------------------------ 12 — header ------------------------------ */}
      <div className="mb-10">
        <div className="flex items-baseline gap-3 border-t border-paper-line pt-3">
          <span className="font-mono text-[11px] font-semibold text-water">12</span>
          <Eyebrow>project status — where the work stands</Eyebrow>
        </div>
        <h1 className="mt-5 font-serif text-4xl md:text-[52px] leading-[1.05] font-semibold tracking-tight">
          The Ledger
        </h1>
        <p className="mt-5 max-w-3xl text-[16px] leading-8 text-ink-soft">
          A project tells the truth in its phase book. Four phases are complete,
          integration is in progress, and the path to a labelled training table
          — the one artifact the model still needs — is fully specified. Below:
          the position at a glance, the phase ledger with evidence and blocking
          dependencies, the decisions still open, and the register of what
          already exists.
        </p>
      </div>

      {/* position strip */}
      <div className="mb-14 grid grid-cols-2 gap-px border border-paper-line bg-paper-line sm:grid-cols-3 lg:grid-cols-6">
        {[
          { value: "4 / 7", label: "phases complete", note: "collection → training" },
          { value: "1", label: "phase active", note: "integration — this site" },
          { value: "21,915", label: "daily rows ML-ready", note: "1961–2020" },
          { value: "1901–2026", label: "archive span", note: "118 years of record" },
          { value: "v1.0", label: "LSTM trained", note: "weights pending hookup" },
          { value: "5", label: "open decisions", note: "each one named below" },
        ].map((s) => (
          <div key={s.label} className="bg-paper">
            <Stat value={s.value} label={s.label} note={s.note} />
          </div>
        ))}
      </div>

      {/* phase ledger */}
      <ol className="relative ml-2 space-y-12 border-l border-paper-line">
        {phases.map((p) => (
          <li key={p.no} className="relative pl-8">
            <span
              className={`absolute -left-[7px] top-1.5 size-3 border-2 ${
                p.status === "complete"
                  ? "bg-water border-water"
                  : p.status === "active"
                    ? "bg-flood border-flood animate-pulse"
                    : p.status === "blocked"
                      ? "bg-severe border-severe"
                      : p.status === "next"
                        ? "bg-paper border-ink-soft"
                        : "bg-paper border-paper-line"
              }`}
            />
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[13px] font-semibold tracking-[0] text-ink-soft">
                Phase {p.no}
              </span>
              <StatusPill state={p.status} />
              <span className="text-[12px] font-medium text-ink-soft">
                {p.when}
              </span>
            </div>
            <h2 className="mt-2 text-[23px] font-semibold tracking-[-0.01em] text-ink">{p.title}</h2>
            <p className="mt-1.5 max-w-2xl text-[14.5px] leading-7 text-ink-soft">{p.summary}</p>
            <ul className="mt-3 max-w-2xl space-y-2">
              {p.points.map((pt) => (
                <li key={pt} className="flex gap-3 text-[13.5px] leading-6 text-ink-soft">
                  <span className="mt-[10px] h-px w-3.5 shrink-0 bg-paper-dim" />
                  {pt}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex max-w-2xl flex-col gap-1.5">
              {p.evidence && (
                <p className="flex gap-2 text-[12.5px] leading-6">
                  <span className="text-[12px] font-semibold text-water shrink-0 pt-0.5">
                    Evidence ·
                  </span>
                  <span className="text-ink-soft">{p.evidence}</span>
                </p>
              )}
              {p.depends && (
                <p className="flex gap-2 text-[12.5px] leading-6">
                  <span className="text-[12px] font-semibold text-ink-soft shrink-0 pt-0.5">
                    Depends on ·
                  </span>
                  <span className="text-ink-soft">{p.depends}</span>
                </p>
              )}
              {p.blocks && (
                <p className="flex gap-2 text-[12.5px] leading-6">
                  <span className="text-[12px] font-semibold text-flood-deep shrink-0 pt-0.5">
                    Blocks ·
                  </span>
                  <span className="text-flood-deep">{p.blocks}</span>
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      {/* ------------------------------ 13 — open questions ------------------------------ */}
      <div className="mt-20">
        <SectionHeading
          no="13"
          kicker="open questions"
          title="What we still have to decide."
          lede="Every open question is a decision that materially affects the validity of the forecast — the prediction target, the units, the labels, the completeness of the weather record, and the reliability of event labels. None of them is a surprise; each has a named resolution path."
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
              <p className="text-[14px] leading-7 text-ink-soft">{o.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------ 14 — deliverables ------------------------------ */}
      <div className="mt-20">
        <SectionHeading
          no="14"
          kicker="deliverable register"
          title="What already exists."
          lede="Every artifact this project has produced, linked to where it can be inspected. Nothing is listed that cannot be opened and reviewed."
        />
        <dl className="border border-paper-line bg-card">
          {REGISTER.map((r, i) => (
            <div
              key={r.k}
              className={`grid items-center gap-3 px-5 py-4 md:grid-cols-[240px_1fr_44px] ${
                i !== REGISTER.length - 1 ? "border-b border-paper-line/70" : ""
              }`}
            >
              <dt className="pt-0.5 text-[12.5px] font-semibold text-ink-soft">
                {r.k}
              </dt>
              <dd className="text-[13.5px] font-medium leading-6 text-ink">{r.v}</dd>
              <dd>
                {r.view && (
                  <button
                    onClick={() => navigate(r.view!)}
                    aria-label={`Open ${r.k}`}
                    className="inline-flex size-9 items-center justify-center border border-paper-line text-ink-soft transition-colors hover:border-water hover:text-water"
                  >
                    <FileCheck2 className="size-3.5" />
                  </button>
                )}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => navigate("model")}
            className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[14px] font-semibold text-paper transition-colors hover:bg-water"
          >
            Go to the model console
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={() => navigate("data")}
            className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-black/15 px-5 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:border-ink"
          >
            Review the data inventory
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
