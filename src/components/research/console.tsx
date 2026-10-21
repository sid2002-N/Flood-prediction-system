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
  low: "border border-water-bright/25 bg-water-bright/10 text-water-bright",
  elevated: "border border-[#ff9f0a]/30 bg-[#ff9f0a]/10 text-[#ff9f0a]",
  flood: "border border-[#ff9f0a]/40 bg-[#ff9f0a]/15 text-[#ff9f0a]",
  severe: "border border-[#ff453a]/40 bg-[#ff453a]/15 text-[#ff453a]",
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
        <rect x={L} y={T} width={forecastStartX - L} height={ih} fill="#f5f5f7" opacity="0.03" />
        <rect x={forecastStartX} y={T} width={W - R - forecastStartX} height={ih} fill="#22d3ee" opacity="0.05" />
        <line x1={forecastStartX} y1={T} x2={forecastStartX} y2={T + ih} stroke="#22d3ee" strokeWidth="1" strokeDasharray="2 3" />
        <text x={L + 6} y={T + 14} fontSize="10" className="font-sans" fontWeight="600" fill="#98989d">
          Observed
        </text>
        <text x={forecastStartX + 6} y={T + 14} fontSize="10" className="font-sans" fontWeight="600" fill="#22d3ee">
          Forecast · {result.horizon} days
        </text>

        {/* thresholds */}
        {[result.thresholds.flood, result.thresholds.severe].map((v, k) => (
          <g key={v}>
            <line x1={L} y1={YQ(v)} x2={W - R} y2={YQ(v)} stroke={k === 0 ? "#ff9f0a" : "#ff453a"} strokeWidth="1" strokeDasharray="5 4" opacity="0.75" />
            <text x={W - R + 6} y={YQ(v) + 3} fontSize="9" fill={k === 0 ? "#ff9f0a" : "#ff453a"} className="font-mono">
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
              fill={p.isForecast ? "#22d3ee" : "#22d3ee"}
              opacity={p.isForecast ? 0.4 : 0.16}
              rx="1"
            />
          );
        })}

        {/* uncertainty band */}
        <path d={band} fill="#ff9f0a" opacity="0.1" />

        {/* discharge */}
        <path d={linePath} fill="none" stroke="#98989d" strokeWidth="1.2" strokeDasharray="1 0" opacity="0.55" />
        <path
          d={forecast.map((p, j) => `${j === 0 ? "M" : "L"} ${X(forecastStartIdx + j)} ${YQ(p.discharge)}`).join(" ")}
          fill="none"
          stroke="#ff9f0a"
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* peak marker */}
        {peakIdx >= 0 && (
          <g>
            <circle cx={X(peakIdx)} cy={YQ(result.series[peakIdx].discharge)} r="4" fill="#ff9f0a" stroke="#1d1d1f" strokeWidth="1.5" />
            <text x={X(peakIdx)} y={YQ(result.series[peakIdx].discharge) - 10} textAnchor="middle" fontSize="10.5" fontWeight="600" className="font-sans" fill="#ff9f0a">
              {result.stats.peak.toFixed(1)} · {result.stats.peakDay}
            </text>
          </g>
        )}

        {/* baseline + axis */}
        <line x1={L} y1={T + ih} x2={W - R} y2={T + ih} stroke="#48484d" strokeWidth="1" />
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const v = qMax * (1 - f);
          const y = T + f * ih;
          return (
            <g key={f}>
              <line x1={L} y1={y} x2={W - R} y2={y} stroke="#3a3a3f" strokeWidth="1" opacity="0.6" />
              <text x={L - 8} y={y + 3} textAnchor="end" fontSize="9" fill="#98989d" className="font-mono">
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
            <text key={i} x={X(i)} y={H - 14} textAnchor="middle" fontSize="8" fill="#98989d" className="font-mono">
              {p.label}
            </text>
          );
        })}
        <text x={L - 8} y={T - 12} fontSize="10" className="font-sans" fontWeight="600" fill="#22d3ee">
          Scenario rain
        </text>
        <text x={L - 8} y={T - 26} fontSize="10" className="font-sans" fontWeight="600" fill="#ff9f0a">
          Predicted discharge · file units
        </text>

        {/* hover crosshair */}
        {hover != null && (
          <line x1={X(hover)} y1={T} x2={X(hover)} y2={T + ih} stroke="#f5f5f7" strokeWidth="0.8" opacity="0.4" />
        )}
      </svg>

      {hp && (
        <div
          className="apple-shadow-lg pointer-events-none absolute z-10 rounded-lg border border-white/10 bg-night-2 px-3 py-2 font-mono text-[11px] leading-relaxed text-paper"
          style={{
            left: `${(X(hover!) / W) * 100}%`,
            top: 10,
            transform: X(hover!) > W * 0.6 ? "translateX(-115%)" : "translateX(15px)",
          }}
        >
          <div className="text-water-bright">{hp.label} {hp.isForecast ? "· forecast" : "· observed"}</div>
          <div>rain · {hp.rain.toFixed(1)} mm</div>
          <div className="text-[#ff9f0a]">discharge · {hp.discharge.toFixed(2)}</div>
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
    <div className="apple-shadow-lg overflow-hidden rounded-2xl border border-night-line bg-night text-paper">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-night-line bg-night-2 px-4 py-3">
        <span className="text-[15px] font-semibold tracking-[-0.01em] text-paper">
          Inference console — {modelConfig.codename} {modelConfig.version}
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[12px] font-medium",
            result?.mode === "live"
              ? "bg-water-bright/15 text-water-bright"
              : "bg-[#ff9f0a]/15 text-[#ff9f0a]"
          )}
        >
          {result?.mode === "live" ? "Live — model-backed" : "Demo — deterministic profile"}
        </span>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr]">
        {/* controls */}
        <div className="border-b border-night-line p-5 lg:border-b-0 lg:border-r">
          <p className="text-[13px] font-semibold text-paper-dim">
            01 · Rainfall scenario
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
            {(Object.keys(scenarios) as ScenarioId[]).map((id) => (
              <button
                key={id}
                onClick={() => pick(id)}
                aria-pressed={scenario === id}
                className={cn(
                  "min-h-[44px] rounded-lg border px-3 py-2.5 text-left transition-colors",
                  scenario === id
                    ? "border-water-bright/60 bg-water-bright/10"
                    : "border-night-line bg-night-2 hover:border-paper-dim/40"
                )}
              >
                <span
                  className={cn(
                    "block text-[13px] font-semibold",
                    scenario === id ? "text-water-bright" : "text-paper"
                  )}
                >
                  {scenarios[id].label}
                </span>
                <span className="mt-0.5 block text-[12px] leading-snug text-paper-dim">
                  {scenarios[id].blurb}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-6 text-[13px] font-semibold text-paper-dim">
            02 · Intensity ×{intensity.toFixed(1)}
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
            <div className="mt-1 flex justify-between text-[12px] font-medium tab-nums text-paper-dim">
              <span>×0.5</span>
              <span>×1.0 — audited event</span>
              <span>×2.0</span>
            </div>
          </div>

          <p className="mt-6 text-[13px] font-semibold text-paper-dim">
            03 · Horizon
          </p>
          <div className="mt-3 flex rounded-lg border border-night-line bg-night-2 p-0.5">
            {modelConfig.horizons.map((h) => (
              <button
                key={h}
                onClick={() => pickHorizon(h)}
                aria-pressed={horizon === h}
                className={cn(
                  "flex-1 rounded-md py-2 text-[13px] font-medium tab-nums transition-colors",
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
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-water-bright px-4 py-3 text-[14px] font-semibold text-night transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {running ? (
              <RefreshCw className="size-3.5 animate-spin" />
            ) : (
              <Play className="size-3.5" />
            )}
            {running ? "Computing…" : "Run forecast"}
          </button>
          <p className="mt-3 text-[12.5px] leading-5 text-paper-dim">
            Deterministic in demo mode — identical inputs reproduce identical
            outputs, so reviewers can check any number twice. This is not the
            trained LSTM; the badge and provenance line switch to LIVE the
            moment a model-backed endpoint answers.
          </p>
        </div>

        {/* output */}
        <div className="relative p-5">
          {/* watermark */}
          {result?.mode !== "live" && (
            <span className="pointer-events-none absolute right-6 top-4 z-10 select-none rounded-full bg-[#ff9f0a]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ff9f0a]">
              demo inference
            </span>
          )}
          {running && !result && (
            <div className="flex h-[380px] items-center justify-center">
              <p className="text-[13px] font-medium text-paper-dim animate-pulse">
                Computing sequence…
              </p>
            </div>
          )}
          {running && result && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-night/70">
              <p className="rounded-full border border-white/10 bg-night-2 px-4 py-2 text-[13px] font-medium text-water-bright animate-pulse">
                Recomputing
              </p>
            </div>
          )}
          {result && (
            <>
              {/* risk readout */}
              <div className="mb-5 flex flex-wrap items-center gap-4">
                <span
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[14px] font-semibold",
                    RISK_STYLE[result.stats.risk]
                  )}
                >
                  {riskCopy[result.stats.risk].label}
                </span>
                <span className="text-[13px] text-paper-dim">
                  {riskCopy[result.stats.risk].note}
                </span>
              </div>

              {/* stats */}
              <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { v: result.stats.peak.toFixed(2), l: "peak discharge" },
                  { v: result.stats.peakDay, l: "day of peak" },
                  { v: `${result.stats.daysAbove} d`, l: `above flood stage (${result.thresholds.flood})` },
                  { v: `${result.horizon} d`, l: "horizon" },
                ].map((s) => (
                  <div key={s.l} className="rounded-lg border border-night-line bg-night-2 px-3 py-3">
                    <div className="text-[17px] font-semibold tab-nums text-paper">{s.v}</div>
                    <div className="mt-1 text-[12px] text-paper-dim">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>

              <ForecastChart result={result} />

              <p className="mt-4 border-l-2 border-water-bright pl-3 text-[12.5px] leading-6 text-paper-dim">
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
