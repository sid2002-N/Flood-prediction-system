"use client";

/**
 * Kuttanad Flood Prediction System — inference console.
 * Reviewer-facing forecasting interface. Runs the pluggable adapter
 * in src/lib/model-runner.ts — DEMO profile now, LIVE weights the
 * moment modelConfig.inferenceEndpoint is set.
 */
import { useCallback, useRef, useState } from "react";
import {
  runInference,
  runDemo,
  riskCopy,
  scenarios,
  type PredictionResult,
  type ScenarioId,
} from "@/lib/model-runner";
import { modelConfig } from "@/lib/model-config";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Play, RefreshCw } from "lucide-react";

const RISK_STYLE: Record<string, string> = {
  low: "border-water-bright text-water-bright",
  elevated: "border-[#e8b44a] text-[#e8b44a]",
  flood: "border-[#e8b44a] bg-[#e8b44a]/10 text-[#e8b44a]",
  severe: "border-[#d15a4c] bg-[#d15a4c]/15 text-[#d15a4c]",
};

/* ------------------------------ forecast chart ------------------------------ */

function ForecastChart({ result }: { result: PredictionResult }) {
  const W = 1000;
  const H = 340;
  const L = 52;
  const R = 58;
  const T = 34;
  const B = 36;
  const iw = W - L - R;
  const ih = H - T - B;
  const n = result.series.length;
  const dw = iw / n;

  const qMax = Math.max(result.thresholds.severe, ...result.series.map((p) => p.upper)) * 1.12;
  const rainMax = Math.max(...result.series.map((p) => p.rain)) * 1.15 || 1;

  const X = (i: number) => L + i * dw + dw / 2;
  const YQ = (v: number) => T + (1 - v / qMax) * ih;
  const YR = (v: number) => T + ih - (v / rainMax) * ih * 0.42; // rain in lower band

  const prelude = result.series.filter((p) => !p.isForecast);
  const forecast = result.series.filter((p) => p.isForecast);
  const preludeStartIdx = 0;
  const forecastStartIdx = prelude.length;

  const linePath = result.series
    .map((p, i) => `${i === 0 ? "M" : "L"} ${X(i)} ${YQ(p.discharge)}`)
    .join(" ");
  const forecastStartX = L + forecastStartIdx * dw;
  const band =
    result.series.map((p, i) => `${i === 0 ? "M" : "L"} ${X(i)} ${YQ(p.upper)}`).join(" ") +
    " " +
    [...result.series]
      .reverse()
      .map((p, i) => `L ${X(n - 1 - i)} ${YQ(p.lower)}`)
      .join(" ") +
    " Z";

  const peakIdx = result.series.findIndex(
    (p) => p.label === result.stats.peakDay
  );

  const [hover, setHover] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.floor((px - L) / dw);
    if (i >= 0 && i < n) setHover(i);
    else setHover(null);
  };

  const hp = hover != null ? result.series[hover] : null;

  return (
    <div ref={wrapRef} className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label="Forecast chart: scenario rainfall and predicted discharge with flood thresholds"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {/* region shading */}
        <rect x={L} y={T} width={forecastStartX - L} height={ih} fill="#f0ebdd" opacity="0.03" />
        <rect x={forecastStartX} y={T} width={W - R - forecastStartX} height={ih} fill="#38b2a9" opacity="0.045" />
        <line x1={forecastStartX} y1={T} x2={forecastStartX} y2={T + ih} stroke="#38b2a9" strokeWidth="1" strokeDasharray="2 3" />
        <text x={L + 6} y={T + 14} fontSize="8.5" fill="#a89f8c" letterSpacing="0.18em" style={{ fontFamily: "var(--font-plex-mono)" }}>
          OBSERVED
        </text>
        <text x={forecastStartX + 6} y={T + 14} fontSize="8.5" fill="#38b2a9" letterSpacing="0.18em" style={{ fontFamily: "var(--font-plex-mono)" }}>
          FORECAST — {result.horizon} DAYS
        </text>

        {/* thresholds */}
        {[result.thresholds.flood, result.thresholds.severe].map((v, k) => (
          <g key={v}>
            <line x1={L} y1={YQ(v)} x2={W - R} y2={YQ(v)} stroke={k === 0 ? "#e8b44a" : "#d15a4c"} strokeWidth="1" strokeDasharray="5 4" opacity="0.75" />
            <text x={W - R + 6} y={YQ(v) + 3} fontSize="9" fill={k === 0 ? "#e8b44a" : "#d15a4c"} style={{ fontFamily: "var(--font-plex-mono)" }}>
              {v.toFixed(0)}
            </text>
          </g>
        ))}

        {/* rain bars */}
        {result.series.map((p, i) => {
          const h = (p.rain / rainMax) * ih * 0.42;
          if (h < 0.5) return null;
          return (
            <rect
              key={i}
              x={X(i) - dw * 0.3}
              y={T + ih - h}
              width={dw * 0.6}
              height={h}
              fill={p.isForecast ? "#38b2a9" : "#38b2a9"}
              opacity={p.isForecast ? 0.4 : 0.16}
            />
          );
        })}

        {/* uncertainty band */}
        <path d={band} fill="#e8b44a" opacity="0.1" />

        {/* discharge */}
        <path d={linePath} fill="none" stroke="#a89f8c" strokeWidth="1.2" strokeDasharray="1 0" opacity="0.55" />
        <path
          d={forecast.map((p, j) => `${j === 0 ? "M" : "L"} ${X(forecastStartIdx + j)} ${YQ(p.discharge)}`).join(" ")}
          fill="none"
          stroke="#e8b44a"
          strokeWidth="2.4"
        />

        {/* peak marker */}
        {peakIdx >= 0 && (
          <g>
            <circle cx={X(peakIdx)} cy={YQ(result.series[peakIdx].discharge)} r="4" fill="#e8b44a" stroke="#12100c" strokeWidth="1.5" />
            <text x={X(peakIdx)} y={YQ(result.series[peakIdx].discharge) - 10} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#e8b44a" style={{ fontFamily: "var(--font-plex-mono)" }}>
              {result.stats.peak.toFixed(1)} · {result.stats.peakDay}
            </text>
          </g>
        )}

        {/* baseline + axis */}
        <line x1={L} y1={T + ih} x2={W - R} y2={T + ih} stroke="#3a3427" strokeWidth="1" />
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const v = qMax * (1 - f);
          const y = T + f * ih;
          return (
            <g key={f}>
              <line x1={L} y1={y} x2={W - R} y2={y} stroke="#302b21" strokeWidth="1" opacity="0.6" />
              <text x={L - 8} y={y + 3} textAnchor="end" fontSize="9" fill="#a89f8c" style={{ fontFamily: "var(--font-plex-mono)" }}>
                {v.toFixed(0)}
              </text>
            </g>
          );
        })}
        {/* x labels every ~5 days */}
        {result.series.map((p, i) => {
          const every = n > 30 ? 5 : n > 20 ? 4 : 3;
          if (i % every !== 0 && i !== n - 1) return null;
          return (
            <text key={i} x={X(i)} y={H - 14} textAnchor="middle" fontSize="8" fill="#a89f8c" style={{ fontFamily: "var(--font-plex-mono)" }}>
              {p.label}
            </text>
          );
        })}
        <text x={L - 8} y={T - 12} fontSize="8.5" fill="#38b2a9" letterSpacing="0.16em" style={{ fontFamily: "var(--font-plex-mono)" }}>
          SCENARIO RAIN
        </text>
        <text x={L - 8} y={T - 24} fontSize="8.5" fill="#e8b44a" letterSpacing="0.16em" style={{ fontFamily: "var(--font-plex-mono)" }}>
          PREDICTED DISCHARGE — file units
        </text>

        {/* hover crosshair */}
        {hover != null && (
          <line x1={X(hover)} y1={T} x2={X(hover)} y2={T + ih} stroke="#f0ebdd" strokeWidth="0.8" opacity="0.4" />
        )}
      </svg>

      {hp && (
        <div
          className="pointer-events-none absolute z-10 border border-night-line bg-night px-3 py-2 font-mono text-[10px] leading-relaxed text-paper shadow-lg"
          style={{
            left: `${(X(hover!) / W) * 100}%`,
            top: 10,
            transform: X(hover!) > W * 0.6 ? "translateX(-115%)" : "translateX(15px)",
          }}
        >
          <div className="text-water-bright">{hp.label} {hp.isForecast ? "· forecast" : "· observed"}</div>
          <div>rain · {hp.rain.toFixed(1)} mm</div>
          <div className="text-[#e8b44a]">discharge · {hp.discharge.toFixed(2)}</div>
          <div className="text-paper-dim">band · [{hp.lower.toFixed(1)}, {hp.upper.toFixed(1)}]</div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ the console ------------------------------ */

export function InferenceConsole() {
  const [scenario, setScenario] = useState<ScenarioId>("event2018");
  const [intensity, setIntensity] = useState(1.0);
  const [horizon, setHorizon] = useState(14);
  const [running, setRunning] = useState(false);
  // Initial output is rendered synchronously from the deterministic demo
  // profile — no mount effect, no loading flash for reviewers.
  const [result, setResult] = useState<PredictionResult>(() =>
    runDemo({ scenario: "event2018", intensity: 1.0, horizon: 14 })
  );

  const run = useCallback(
    async (s: ScenarioId, i: number, h: number) => {
      setRunning(true);
      const [r] = await Promise.all([
        runInference({ scenario: s, intensity: i, horizon: h }),
        new Promise((res) => setTimeout(res, 420)),
      ]);
      setResult(r);
      setRunning(false);
    },
    []
  );

  const pick = (s: ScenarioId) => {
    setScenario(s);
    run(s, intensity, horizon);
  };
  const pickHorizon = (h: number) => {
    setHorizon(h);
    run(scenario, intensity, h);
  };

  const spec = scenarios[scenario];

  return (
    <div className="border border-night-line bg-night text-paper">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-night-line bg-night-2 px-4 py-2.5">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-paper">
          Inference console — {modelConfig.codename} {modelConfig.version}
        </span>
        <span
          className={cn(
            "font-mono text-[9px] uppercase tracking-[0.16em] px-2 py-1 border",
            result?.mode === "live"
              ? "border-water-bright text-water-bright"
              : "border-[#e8b44a]/60 text-[#e8b44a]"
          )}
        >
          {result?.mode === "live" ? "live — model-backed" : "demo — deterministic profile"}
        </span>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr]">
        {/* controls */}
        <div className="border-b border-night-line p-5 lg:border-b-0 lg:border-r">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper-dim">
            01 — rainfall scenario
          </p>
          <div className="mt-3 grid grid-cols-2 lg:grid-cols-1 gap-2">
            {(Object.keys(scenarios) as ScenarioId[]).map((id) => (
              <button
                key={id}
                onClick={() => pick(id)}
                aria-pressed={scenario === id}
                className={cn(
                  "border px-3 py-2.5 text-left transition-colors min-h-[44px]",
                  scenario === id
                    ? "border-water-bright bg-water-bright/10"
                    : "border-night-line bg-night-2 hover:border-paper-dim/50"
                )}
              >
                <span
                  className={cn(
                    "block font-mono text-[10px] font-semibold uppercase tracking-[0.12em]",
                    scenario === id ? "text-water-bright" : "text-paper"
                  )}
                >
                  {scenarios[id].label}
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-paper-dim">
                  {scenarios[id].blurb}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.2em] text-paper-dim">
            02 — intensity ×{intensity.toFixed(1)}
          </p>
          <div className="mt-4 px-1">
            <Slider
              value={[intensity]}
              min={0.5}
              max={2}
              step={0.1}
              onValueChange={(v) => setIntensity(v[0])}
              onValueCommit={(v) => run(scenario, v[0], horizon)}
              aria-label="Scenario intensity"
              className="cursor-pointer"
            />
            <div className="mt-1 flex justify-between font-mono text-[9px] text-paper-dim">
              <span>×0.5</span>
              <span>×1.0 — audited event</span>
              <span>×2.0</span>
            </div>
          </div>

          <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.2em] text-paper-dim">
            03 — horizon
          </p>
          <div className="mt-3 flex border border-night-line">
            {modelConfig.horizons.map((h) => (
              <button
                key={h}
                onClick={() => pickHorizon(h)}
                aria-pressed={horizon === h}
                className={cn(
                  "flex-1 py-2.5 font-mono text-[11px] font-medium transition-colors",
                  horizon === h
                    ? "bg-paper text-night"
                    : "text-paper-dim hover:text-paper"
                )}
              >
                {h} d
              </button>
            ))}
          </div>

          <button
            onClick={() => run(scenario, intensity, horizon)}
            disabled={running}
            className="mt-6 flex w-full items-center justify-center gap-2 border border-water-bright bg-water-bright px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-night transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {running ? (
              <RefreshCw className="size-3.5 animate-spin" />
            ) : (
              <Play className="size-3.5" />
            )}
            {running ? "computing" : "run forecast"}
          </button>
          <p className="mt-3 text-[12px] leading-5 text-paper-dim">
            deterministic in demo mode — identical inputs reproduce identical
            outputs, so reviewers can check any number twice. This is not the
            trained LSTM; the badge and provenance line switch to LIVE the
            moment a model-backed endpoint answers.
          </p>
        </div>

        {/* output */}
        <div className="relative p-5">
          {/* watermark */}
          {result?.mode !== "live" && (
            <span className="pointer-events-none absolute right-6 top-4 z-10 select-none font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim/50">
              demo inference
            </span>
          )}
          {running && !result && (
            <div className="flex h-[380px] items-center justify-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper-dim animate-pulse">
                computing sequence…
              </p>
            </div>
          )}
          {running && result && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-night/70">
              <p className="border border-night-line bg-night-2 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-water-bright animate-pulse">
                recomputing
              </p>
            </div>
          )}
          {result && (
            <>
              {/* risk readout */}
              <div className="mb-5 flex flex-wrap items-center gap-4">
                <span
                  className={cn(
                    "border px-3 py-2 font-mono text-[13px] font-bold uppercase tracking-[0.2em]",
                    RISK_STYLE[result.stats.risk]
                  )}
                >
                  {riskCopy[result.stats.risk].label}
                </span>
                <span className="font-mono text-[10px] text-paper-dim">
                  {riskCopy[result.stats.risk].note}
                </span>
              </div>

              {/* stats */}
              <div className="mb-5 grid grid-cols-2 gap-px border border-night-line bg-night-line sm:grid-cols-4">
                {[
                  { v: result.stats.peak.toFixed(2), l: "peak discharge" },
                  { v: result.stats.peakDay, l: "day of peak" },
                  { v: `${result.stats.daysAbove} d`, l: `above flood stage (${result.thresholds.flood})` },
                  { v: `${result.horizon} d`, l: "horizon" },
                ].map((s) => (
                  <div key={s.l} className="bg-night px-3 py-3">
                    <div className="font-mono text-[16px] font-semibold tab-nums text-paper">{s.v}</div>
                    <div className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.12em] text-paper-dim">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>

              <ForecastChart result={result} />

              <p className="mt-4 border-l-2 border-water-bright pl-3 text-[12px] leading-6 text-paper-dim">
                {result.provenance} Scenario: {spec.label} · intensity ×
                {result.intensity.toFixed(1)} · horizon {result.horizon} days.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
