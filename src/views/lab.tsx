"use client";

/**
 * Kuttanad Flood Prediction System — Model Lab view.
 * Model card, architecture, the live inference console, and the
 * documented integration points where the trained weights plug in.
 */
import { SectionHeading, Eyebrow, Tag } from "@/components/research/furniture";
import { ArchDiagram, CodeBlock } from "@/components/research/diagrams";
import { InferenceConsole } from "@/components/research/console";
import { modelConfig, modelFeatures, integrationPaths } from "@/lib/model-config";
import { Cable, CircleDot, FileCog } from "lucide-react";

const MODEL_CARD: [string, string, string?][] = [
  ["codename", `${modelConfig.codename} ${modelConfig.version}`],
  ["status", modelConfig.status],
  ["target variable", modelConfig.target],
  ["task", modelConfig.task],
  ["input window", modelConfig.inputWindow],
  ["forecast horizons", modelConfig.horizons.map((h) => `${h} d`).join(" · ")],
  ["architecture", modelConfig.architecture],
  ["training window", modelConfig.trainingWindow],
  ["normalization", modelConfig.normalization],
  ["validation", modelConfig.validation],
  ["flood threshold", `${modelConfig.floodThreshold} file units — ≈70% of the audited 2018 peak`],
  ["severe threshold", `${modelConfig.severeThreshold} file units`],
];

export function LabView() {
  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-14 md:py-20">
      {/* header */}
      <div className="mb-10">
        <div className="flex items-baseline gap-3 border-t border-paper-line pt-3">
          <span className="font-mono text-[11px] font-semibold text-water">07</span>
          <Eyebrow>the model — trained, and awaiting deployment</Eyebrow>
        </div>
        <h1 className="mt-5 font-serif text-4xl md:text-[52px] leading-[1.05] font-semibold tracking-tight">
          The Model Lab
        </h1>
        <p className="mt-5 max-w-3xl text-[15px] leading-7 text-ink-soft">
          The LSTM is trained — version 1.0 of the forecaster exists. This lab
          is its public face: a model card documenting the spec, the
          architecture as built, and a fully working inference console. The
          console runs a clearly-labelled deterministic profile until the
          trained weights are connected; the moment they are, every output
          below switches to live predictions with no redesign.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Tag tone="water">lstm v1.0 · trained</Tag>
          <Tag tone="flood">weights — pending hookup</Tag>
          <Tag tone="outline">console — live now</Tag>
        </div>
      </div>

      {/* model card + features */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <Eyebrow>model card</Eyebrow>
          <dl className="mt-4 border border-paper-line bg-card">
            {MODEL_CARD.map(([k, v, sub], i) => (
              <div
                key={k}
                className={`grid grid-cols-[140px_1fr] gap-4 px-4 py-3 ${
                  i !== MODEL_CARD.length - 1 ? "border-b border-paper-line/70" : ""
                }`}
              >
                <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-soft pt-0.5">
                  {k}
                </dt>
                <dd className="text-[13px] font-medium leading-6 text-ink">
                  {v}
                  {sub && <span className="block text-ink-soft">{sub}</span>}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 border border-dashed border-paper-line bg-paper-2/40 px-4 py-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-soft">
              metrics — published after integration
            </p>
            <div className="mt-2 grid grid-cols-3 gap-px bg-paper-line border border-paper-line">
              {[
                ["NSE", modelConfig.metrics.nse],
                ["MAE", modelConfig.metrics.mae],
                ["peak err %", modelConfig.metrics.peakErrorPct],
              ].map(([k, v]) => (
                <div key={k as string} className="bg-paper px-3 py-2.5 text-center">
                  <div className="font-mono text-[15px] font-semibold tab-nums text-ink-soft">
                    {v == null ? "—" : v}
                  </div>
                  <div className="mt-0.5 font-mono text-[8.5px] uppercase tracking-[0.14em] text-ink-soft/70">
                    {k}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 font-mono text-[9px] leading-relaxed text-ink-soft">
              set modelConfig.metrics in src/lib/model-config.ts once the live
              weights are connected — these three cells fill in automatically.
            </p>
          </div>
        </div>

        <div>
          <Eyebrow>input features</Eyebrow>
          <div className="mt-4 space-y-4">
            {modelFeatures.map((g) => (
              <div key={g.group} className="border border-paper-line bg-card">
                <div className="border-b border-paper-line bg-paper-2/60 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">
                  {g.group}
                </div>
                <div className="flex flex-wrap gap-1.5 p-3.5">
                  {g.items.map((it) => (
                    <Tag key={it} tone="outline">{it}</Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 border-l-2 border-water pl-3 text-[12.5px] leading-6 text-ink-soft">
            The 21,915-row ML-ready weather table supplies the base features;
            lags and rolling sums were engineered into it during preprocessing.
            Confirm the exact feature list of the trained checkpoint and edit
            the model card accordingly.
          </p>
        </div>
      </div>

      {/* architecture */}
      <div className="mt-14">
        <SectionHeading
          no="08"
          kicker="architecture"
          title="The forecaster, as specified."
          lede="A sequence-to-sequence regressor: thirty days of weather and antecedent discharge in, a discharge trajectory out, and a threshold classifier that turns the trajectory into a flood-risk call."
        />
        <ArchDiagram provenance="Block spec as configured for v1.0 — layer sizes and thresholds are editable in src/lib/model-config.ts to match the trained checkpoint exactly." />
      </div>

      {/* console */}
      <div className="mt-14">
        <SectionHeading
          no="09"
          kicker="live console"
          title="Run a forecast."
          lede="Pick a rainfall scenario, scale its intensity, choose the horizon — and read the predicted discharge against the flood and severe thresholds. Reviewers can reproduce any run: in demo mode the output is deterministic."
        />
        <InferenceConsole />
      </div>

      {/* integration */}
      <div className="mt-14">
        <SectionHeading
          no="10"
          kicker="integration — make room for the real weights"
          title="Three ways to plug in the trained LSTM."
          lede="The console is deliberately adapter-shaped. None of what you see depends on the demo profile — swap in the real weights through any of these paths and the interface, thresholds and risk logic carry over untouched."
        />
        <div className="grid gap-px border border-paper-line bg-paper-line md:grid-cols-3">
          {integrationPaths.map((p, i) => (
            <div key={p.id} className="bg-paper p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-soft">
                  path {String.fromCharCode(65 + i)}
                </span>
                {i === 0 ? (
                  <Cable className="size-3.5 text-water" />
                ) : i === 1 ? (
                  <CircleDot className="size-3.5 text-water" />
                ) : (
                  <FileCog className="size-3.5 text-water" />
                )}
              </div>
              <h3 className="mt-2.5 font-serif text-[16.5px] font-semibold leading-snug text-ink">
                {p.title}
              </h3>
              <p className="mt-2 text-[12.5px] leading-6 text-ink-soft">{p.summary}</p>
              <p className="mt-3 font-mono text-[9px] tracking-[0.06em] text-water">
                {p.files}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <CodeBlock
            file="contract — POST payload / response"
            lang="json"
            code={`// what the console sends
{
  "scenario": "event2018",   // calm | normal | event2018 | extreme
  "intensity": 1.0,          // 0.5 - 2.0
  "horizon": 14              // 7 | 14 | 30 days
}

// what the adapter expects back (HTTP 200)
{
  "series": [
    { "day": 0, "label": "D+1", "rain": 12.0,
      "discharge": 5.2, "lower": 4.6, "upper": 5.8 }
  ],
  "thresholds": { "flood": 12.0, "severe": 15.0 }
}`}
          />
          <CodeBlock
            file="example — FastAPI wrapper around the Keras checkpoint"
            lang="python"
            code={`from fastapi import FastAPI
from tensorflow.keras.models import load_model

app = FastAPI()
model = load_model("kuttanad_lstm_v1.h5")   # your trained weights

@app.post("/infer")
def infer(req: dict):
    # rebuild the 30-day input window from the scenario
    X = build_window(req["scenario"], req["intensity"])  # (1, 30, F)
    y = model.predict(X, verbose=0).tolist()[0]          # H days ahead
    return {
        "series": postprocess(y, req["horizon"]),
        "thresholds": {"flood": 12.0, "severe": 15.0},
    }`}
          />
          <CodeBlock
            file="src/lib/model-config.ts — the one-line switch"
            lang="typescript"
            code={`// A) same-machine mini-service (e.g. port 8000):
inferenceEndpoint: "/infer?XTransformPort=8000",

// B) remote deployment:
inferenceEndpoint: "https://your-host.example/infer",

// C) current state — demo profile:
inferenceEndpoint: null,`}
          />
          <div className="border border-paper-line bg-card p-5">
            <Eyebrow>what switches when weights go live</Eyebrow>
            <ul className="mt-4 space-y-3">
              {[
                ["DEMO WEIGHTS badge", "becomes LIVE WEIGHTS — teal"],
                ["provenance line", "cites the configured endpoint"],
                ["deterministic note", "removed — outputs are the model's own"],
                ["metrics cells", "populate from modelConfig.metrics"],
                ["everything else", "unchanged — thresholds, risk classes, UI"],
              ].map(([a, b]) => (
                <li key={a} className="flex flex-wrap items-baseline gap-x-2 text-[13px] leading-6">
                  <span className="font-mono text-[11px] font-medium text-ink">{a}</span>
                  <span className="text-paper-dim">→</span>
                  <span className="text-ink-soft">{b}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-l-2 border-flood pl-3 text-[12px] leading-6 text-ink-soft">
              The provenance line under every console run states plainly which
              mode produced the numbers. Reviewers should never have to guess
              whether they are looking at the model or the placeholder.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
