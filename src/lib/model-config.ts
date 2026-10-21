/**
 * Kuttanad Flood Prediction System — model card & inference configuration.
 *
 * ── HOW TO CONNECT THE TRAINED LSTM ──────────────────────────────
 * This site ships with a deterministic DEMO inference profile so the
 * console is fully interactive for reviewers. When your trained
 * weights are ready, pick one of two integration paths:
 *
 *   A) PYTHON SERVICE  (recommended)
 *      Serve your Keras/PyTorch model behind any HTTP endpoint that
 *      accepts the payload below and answers with the response shape.
 *      Then set `inferenceEndpoint` below to that URL.
 *        - same-machine mini-service:  "/infer?XTransformPort=8000"
 *        - remote deployment:          "https://your-host/infer"
 *
 *      POST payload:
 *        { "scenario": "event2018", "intensity": 1.0, "horizon": 14 }
 *
 *      Expected 200 response:
 *        {
 *          "series": [
 *            { "day": 0, "label": "D+1", "rain": 12.0,
 *              "discharge": 5.2, "lower": 4.6, "upper": 5.8 }, ...
 *          ],
 *          "thresholds": { "flood": 12.0, "severe": 15.0 }
 *        }
 *
 *   B) ONNX IN-BROWSER
 *      Convert the model to ONNX, add onnxruntime-web, and replace
 *      `runDemo` inside src/lib/model-runner.ts with your session call.
 *
 * While `inferenceEndpoint` is null the console runs in DEMO mode and
 * every output is watermarked accordingly.
 * ──────────────────────────────────────────────────────────────────
 */

export const modelConfig = {
  codename: "Kuttanad-LSTM",
  version: "v1.0",
  status: "trained — deployment pending" as const,
  target: "River discharge (daily)",
  task: "Sequence regression + threshold classification",
  inputWindow: "30 days",
  horizons: [7, 14, 30] as number[],
  floodThreshold: 12.0, // file units — ≈70% of the 2018 peak (17.11)
  severeThreshold: 15.0,
  architecture: "Stacked LSTM → Dense head",
  trainingWindow: "1961–2020 features · 1950–2025 discharge",
  normalization: "z-score per feature (training split)",
  validation: "held-out event windows (incl. Aug 2018)",
  // ↓↓↓ EDIT THESE AFTER CONNECTING THE REAL WEIGHTS ↓↓↓
  metrics: {
    nse: null as number | null, // Nash–Sutcliffe efficiency
    mae: null as number | null, // mean absolute error, file units
    peakErrorPct: null as number | null, // error at flood peak
  },
  // Set to your inference endpoint to switch the console from
  // DEMO mode to LIVE mode. See the header of this file.
  inferenceEndpoint: null as string | null,
};

export const modelFeatures = [
  { group: "Open-Meteo", items: ["temperature", "precipitation", "wind speed", "shortwave radiation", "ET₀"] },
  { group: "NASA POWER", items: ["relative humidity", "surface pressure", "dew point"] },
  { group: "Engineered", items: ["calendar (month, day-of-year)", "rainfall lag 1/3/7 d", "rolling sum 3/7/30 d"] },
  { group: "Target side", items: ["antecedent discharge", "flood threshold classifier"] },
];

export const integrationPaths = [
  {
    id: "service",
    title: "Path A — Python inference service",
    summary:
      "Keep the weights in Python. Serve them behind a small FastAPI wrapper; point inferenceEndpoint at it and the console switches from DEMO to LIVE automatically.",
    files: "src/lib/model-config.ts → inferenceEndpoint",
  },
  {
    id: "onnx",
    title: "Path B — ONNX in the browser",
    summary:
      "Convert the trained model to ONNX and run it client-side with onnxruntime-web, removing the need for any server. Swap runDemo() in src/lib/model-runner.ts.",
    files: "src/lib/model-runner.ts → runDemo()",
  },
  {
    id: "demo",
    title: "Path C — demo mode for review",
    summary:
      "Until the weights are cleared for public release, the console keeps running its deterministic hydrologic-response profile so reviewers can exercise the full interface.",
    files: "no changes required",
  },
];
