/**
 * Kuttanad Flood Prediction System — inference runner.
 *
 * Pluggable adapter in front of the forecasting console. Resolves to
 * the LIVE endpoint when modelConfig.inferenceEndpoint is set and
 * reachable; otherwise falls back to a deterministic DEMO profile —
 * a linear-reservoir rainfall–runoff response, calibrated against
 * the audited 2018 event (peak discharge 17.11 the day after 126.4 mm
 * of rain, from a base of ≈5 file units).
 *
 * The demo is NOT the trained LSTM. It exists so the reviewer-facing
 * interface, thresholds and risk classification can be exercised end
 * to end while the real weights await integration.
 */
import { modelConfig } from "./model-config";

/* ------------------------------- types ------------------------------- */

export type ScenarioId = "calm" | "normal" | "event2018" | "extreme";
export type RiskKey = "low" | "elevated" | "flood" | "severe";

export interface InferenceRequest {
  scenario: ScenarioId;
  intensity: number; // 0.5 – 2.0
  horizon: number; // days: 7 | 14 | 30
}

export interface ForecastPoint {
  day: number; // 0-based within the simulated window (prelude + horizon)
  label: string; // "O−3" observed prelude, "D+1" forecast day
  rain: number;
  discharge: number;
  lower: number;
  upper: number;
  isForecast: boolean;
}

export interface PredictionResult {
  mode: "demo" | "live";
  provenance: string;
  horizon: number;
  scenario: ScenarioId;
  intensity: number;
  thresholds: { flood: number; severe: number };
  series: ForecastPoint[];
  stats: {
    peak: number;
    peakDay: string;
    daysAbove: number;
    risk: RiskKey;
  };
}

/* ----------------------------- scenarios ----------------------------- */

export const scenarios: Record<
  ScenarioId,
  { label: string; blurb: string; profile: number[] }
> = {
  calm: {
    label: "Calm monsoon",
    blurb: "Drizzle and scattered light showers — a benign season.",
    profile: [
      4, 2, 6, 3, 8, 5, 2, 9, 4, 6, 3, 2, 7, 5, 3, 8, 4, 2, 6, 3, 9, 5, 2, 7,
      4, 3, 6, 2, 8, 3,
    ],
  },
  normal: {
    label: "Normal monsoon",
    blurb: "Typical monsoon pulses — wet, but within the ordinary envelope.",
    profile: [
      16, 24, 31, 22, 12, 28, 38, 32, 18, 8, 21, 35, 42, 26, 14, 10, 22, 33,
      36, 20, 12, 18, 29, 24, 15, 8, 20, 30, 22, 11,
    ],
  },
  event2018: {
    label: "2018-like event",
    blurb: "The audited August 2018 sequence: quiet opening, catastrophic burst.",
    profile: [
      12, 16, 20, 26, 22, 16, 14, 26, 40, 56, 72, 88, 102, 116, 126.4, 44, 26,
      32, 20, 16, 13, 10, 12, 16, 20, 16, 12, 9, 7, 5,
    ],
  },
  extreme: {
    label: "Design extreme",
    blurb: "A sustained design storm beyond anything in the observed record.",
    profile: [
      30, 45, 60, 75, 90, 105, 120, 135, 150, 160, 140, 120, 110, 130, 145,
      125, 105, 95, 115, 100, 85, 70, 60, 80, 65, 55, 45, 35, 25, 15,
    ],
  },
};

/* --------------------------- deterministic PRNG --------------------------- */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFrom(...nums: number[]): number {
  let h = 2166136261;
  for (const n of nums) {
    h ^= Math.round(n * 100);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* ------------------------------ demo core ------------------------------ */

const K = 0.845; // recession coefficient (calibrated to the 2018 event)
const C = 0.052; // rainfall-to-discharge gain
const BASE = 0.3; // baseflow increment
const PRELUDE = 10; // observed warm-up days shown before the forecast window

const PRELUDE_RAIN = [8, 12, 16, 10, 6, 14, 18, 12, 8, 5];

/**
 * Raw linear-reservoir simulation. Returns per-day rain and discharge
 * (unscaled) across the prelude + horizon window.
 */
function simulateRaw(
  profile: number[],
  intensity: number,
  horizon: number,
  seed: number
): { rain: number[]; q: number[] } {
  const rnd = mulberry32(seed);
  const n = PRELUDE + horizon;
  const rain: number[] = [];
  for (let i = 0; i < n; i++) {
    const base = i < PRELUDE ? PRELUDE_RAIN[i] : profile[(i - PRELUDE) % profile.length];
    const jitter = 1 + (rnd() - 0.5) * 0.08;
    const v =
      i < PRELUDE ? base * jitter : Math.round(base * intensity * jitter * 10) / 10;
    rain.push(v);
  }
  const q: number[] = [];
  let cur = 2.2;
  for (let i = 0; i < n; i++) {
    if (i > 0) cur = cur * K + C * rain[i - 1] + BASE;
    q.push(cur);
  }
  return { rain, q };
}

/**
 * The demo is pinned to the audited record: the 2018 event profile at
 * intensity 1.0 must reproduce its recorded peak discharge of 17.11.
 */
let cachedScale: number | null = null;
function demoScale(): number {
  if (cachedScale === null) {
    const seed = seedFrom("event2018".length * 17, 1, 30);
    const { q } = simulateRaw(scenarios.event2018.profile, 1, 30, seed);
    cachedScale = 17.11 / Math.max(...q);
  }
  return cachedScale;
}

export function runDemo(req: InferenceRequest): PredictionResult {
  const { scenario, intensity, horizon } = req;
  const spec = scenarios[scenario];
  const { flood, severe } = {
    flood: modelConfig.floodThreshold,
    severe: modelConfig.severeThreshold,
  };

  const seed = seedFrom(scenario.length * 17, intensity, horizon);
  const { rain, q } = simulateRaw(spec.profile, intensity, horizon, seed);
  const scale = demoScale();
  const n = rain.length;

  const series: ForecastPoint[] = [];
  for (let i = 0; i < n; i++) {
    const qs = q[i] * scale;
    const spread = 0.4 + 0.045 * i + 0.055 * qs; // uncertainty widens with horizon
    series.push({
      day: i,
      label: i < PRELUDE ? `O−${PRELUDE - i}` : `D+${i - PRELUDE + 1}`,
      rain: Math.round(rain[i] * 10) / 10,
      discharge: Math.round(qs * 100) / 100,
      lower: Math.round(Math.max(0, qs - spread) * 100) / 100,
      upper: Math.round((qs + spread) * 100) / 100,
      isForecast: i >= PRELUDE,
    });
  }

  const forecast = series.filter((p) => p.isForecast);
  let peak = 0;
  let peakDay = "—";
  for (const p of forecast) {
    if (p.discharge > peak) {
      peak = p.discharge;
      peakDay = p.label;
    }
  }
  const daysAbove = forecast.filter((p) => p.discharge >= flood).length;

  let risk: RiskKey;
  if (peak >= severe) risk = "severe";
  else if (peak >= flood) risk = "flood";
  else if (peak >= flood * (2 / 3)) risk = "elevated";
  else risk = "low";

  return {
    mode: "demo",
    provenance:
      "DEMO INFERENCE — deterministic linear-reservoir rainfall–runoff response calibrated to the audited 2018 event (peak 17.11 on 16 Aug, base ≈5). Not the trained LSTM.",
    horizon,
    scenario,
    intensity,
    thresholds: { flood, severe },
    series,
    stats: { peak, peakDay, daysAbove, risk },
  };
}

/* --------------------------- live adapter --------------------------- */

interface LiveEnvelope {
  series?: {
    day?: number;
    label?: string;
    rain?: number;
    discharge?: number;
    lower?: number;
    upper?: number;
  }[];
  thresholds?: { flood?: number; severe?: number };
}

async function runLive(req: InferenceRequest, endpoint: string): Promise<PredictionResult | null> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenario: req.scenario,
        intensity: req.intensity,
        horizon: req.horizon,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as LiveEnvelope;
    if (!data.series?.length) return null;
    const flood = data.thresholds?.flood ?? modelConfig.floodThreshold;
    const severe = data.thresholds?.severe ?? modelConfig.severeThreshold;
    const series: ForecastPoint[] = data.series.map((p, i) => ({
      day: p.day ?? i,
      label: p.label ?? `D+${i + 1}`,
      rain: p.rain ?? 0,
      discharge: p.discharge ?? 0,
      lower: p.lower ?? p.discharge ?? 0,
      upper: p.upper ?? p.discharge ?? 0,
      isForecast: true,
    }));
    let peak = 0;
    let peakDay = "—";
    let daysAbove = 0;
    for (const p of series) {
      if (p.discharge > peak) {
        peak = p.discharge;
        peakDay = p.label;
      }
      if (p.discharge >= flood) daysAbove++;
    }
    const risk: RiskKey =
      peak >= severe ? "severe" : peak >= flood ? "flood" : peak >= flood * (2 / 3) ? "elevated" : "low";
    return {
      mode: "live",
      provenance: `LIVE INFERENCE — ${modelConfig.codename} ${modelConfig.version} served from the configured endpoint.`,
      horizon: req.horizon,
      scenario: req.scenario,
      intensity: req.intensity,
      thresholds: { flood, severe },
      series,
      stats: { peak, peakDay, daysAbove, risk },
    };
  } catch {
    return null;
  }
}

export async function runInference(req: InferenceRequest): Promise<PredictionResult> {
  const endpoint = modelConfig.inferenceEndpoint;
  if (endpoint) {
    const live = await runLive(req, endpoint);
    if (live) return live;
  }
  return runDemo(req);
}

export const riskCopy: Record<RiskKey, { label: string; note: string }> = {
  low: { label: "LOW", note: "peak stays well below flood stage" },
  elevated: { label: "ELEVATED", note: "peak approaches flood stage — monitor" },
  flood: { label: "FLOOD WARNING", note: "peak crosses flood stage threshold" },
  severe: { label: "SEVERE", note: "peak exceeds the severe threshold" },
};
