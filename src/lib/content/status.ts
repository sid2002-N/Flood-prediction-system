/**
 * Kuttanad Flood Prediction System — project status content.
 * Phases, open questions and next steps, as the work actually stands.
 */

export type PhaseStatus = "complete" | "active" | "blocked" | "next" | "planned";

export interface Phase {
  no: string;
  title: string;
  status: PhaseStatus;
  when: string;
  summary: string;
  points: string[];
  evidence?: string;
  blocks?: string;
  depends?: string;
}

export const phases: Phase[] = [
  {
    no: "01",
    title: "Data collection",
    status: "complete",
    when: "phase i",
    summary:
      "Assembling the archive from every agency that measures water in and around Kuttanad.",
    points: [
      "8 categories across 22 source folders — CWC, KSW, KSWA, NWDP, NWIC, Kerala WRIS, KSEB, IMD, ESA, Bhuvan.",
      "Records spanning 1901–2026: rainfall, discharge, water level, SAR, terrain, land use, reservoirs.",
      "Reference collection: peer-reviewed papers, official reports and return-probability rasters.",
    ],
    evidence: "40+ datasets catalogued with coverage and audit state — see the data inventory",
  },
  {
    no: "02",
    title: "Data audit & preprocessing",
    status: "complete",
    when: "phase ii",
    summary:
      "Opening, cataloguing and cleaning — including an honest inventory of what is broken.",
    points: [
      "Every file classified: read in full, previewed, or catalogued from structure.",
      "Cleaning pipeline with raw / manual-cleaned / cleaned stages tracked in file names.",
      "11 data-quality flags documented, from Cauvery contamination to header-only files.",
    ],
    evidence: "the audit register — every flag filed with an action",
  },
  {
    no: "03",
    title: "Feature engineering",
    status: "complete",
    when: "phase ii",
    summary: "Turning raw archives into sequence-learning inputs.",
    points: [
      "ML-ready weather table: 21,915 daily rows joining Open-Meteo and NASA POWER.",
      "Rainfall lags (1/3/7 days) and rolling sums (3/7/30 days) computed per calendar features.",
      "500 m terrain grid with land-use percentages joined per cell.",
    ],
    evidence: "21,915-row ML-ready table — lags and rolling sums per row",
  },
  {
    no: "04",
    title: "LSTM model development",
    status: "complete",
    when: "phase iii",
    summary: "The model is trained — version 1.0 of the flood forecaster exists.",
    points: [
      "Kuttanad-LSTM v1.0 trained on the collected sequences.",
      "Checkpoint retained pending release clearance for hookup into this site.",
      "Performance metrics reserved until the live weights are connected — no claims published.",
    ],
    evidence: "model card and architecture spec — model lab",
  },
  {
    no: "05",
    title: "Model integration & deployment",
    status: "active",
    when: "phase iv — in progress",
    summary:
      "This website: the forecasting console, the model card and the reviewer-facing presentation.",
    points: [
      "Inference console built with a pluggable adapter — deterministic demo profile running now.",
      "Integration points documented for a Python inference service or an ONNX build.",
      "Replace demo outputs with live LSTM predictions once weights are cleared for release.",
    ],
    evidence: "the console runs end-to-end today — model lab",
    blocks: "live validation — every console output stays DEMO until the weights connect",
  },
  {
    no: "06",
    title: "Unified labelled training set",
    status: "next",
    when: "phase v",
    summary:
      "The critical next step: one merged daily table with a Kuttanad flood target.",
    points: [
      "Labels from discharge thresholds, IndoFloods events and/or summed SAR flood extent.",
      "Fill or impute the 1961–1980 NASA POWER void in the weather table.",
      "Prune Cauvery-basin files and header-only years from the training pool.",
    ],
    depends: "phase 05 hookup + the label-derivation decision (open question 03)",
    blocks: "every validation metric — no labels, no backtest",
  },
  {
    no: "07",
    title: "Validation & real-time pipeline",
    status: "planned",
    when: "phase vi",
    summary: "From a trained model to an operational early-warning capability.",
    points: [
      "Backtest against the 2018 event and the return-probability rasters.",
      "Benchmark LSTM exceedance estimates against 10–500-year return periods.",
      "Move toward scheduled retraining and a live forecasting feed.",
    ],
    depends: "phases 05 + 06 — connected weights and labelled data",
    blocks: "operational use — the system cannot support real warnings until validated",
  },
];

export const openQuestions = [
  {
    q: "What exactly does the LSTM predict?",
    a: "The model card currently assumes river discharge as the target. If v1.0 predicts water level or flood probability instead, update the target field in src/lib/model-config.ts and the console relabels itself.",
  },
  {
    q: "What are the discharge units?",
    a: "The 2018 event file peaks at 17.11 with no stated unit. Confirming this (m³/s? gauge stage?) determines the flood threshold calibration.",
  },
  {
    q: "How will flood labels be derived?",
    a: "Three candidate label sources exist: discharge thresholds, IndoFloods events, and SAR flood extent. The unified training table needs one chosen and justified.",
  },
  {
    q: "Is the KSEB snapshot usable?",
    a: "It is undated and mixes feet with metres — two small fixes unlock a valuable upstream-control feature set.",
  },
  {
    q: "Which SAR label is trustworthy?",
    a: "Flood extent (≈62k ha) barely separates from ordinary monsoon (55–60k ha). Extent alone is a weak label; pairing with discharge is the working plan.",
  },
];
