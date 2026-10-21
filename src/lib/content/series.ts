/**
 * Kuttanad Flood Prediction System — chart series.
 *
 * PROVENANCE POLICY
 * -----------------
 * Every figure on this site carries its provenance. Figures tagged
 * "RECONSTRUCTED" are built from the reviewed data-audit summary: peak
 * values are exact (as read from the source files), daily shapes are
 * illustrative placeholders until a direct export replaces them.
 * Swap the arrays below for real exports and the site updates as-is.
 */

/* ---------------- deterministic PRNG (mulberry32) ---------------- */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ================= 1. Monsoon 2018 — rainfall & discharge ========= */

export interface MonsoonDay {
  date: string; // YYYY-MM-DD
  rain: number; // mm — exact peak on 2018-08-15
  discharge: number; // file units — exact peak on 2018-08-16
}

// Hand-authored daily rainfall profile (mm), Jun 1 – Sep 30 2018.
// Onset in June, established monsoon in July, catastrophic burst Aug 8–17,
// recession through September. 2018-08-15 is pinned to 126.4 mm.
const RAIN_2018: number[] = [
  // June 1–30
  8, 14, 22, 35, 41, 27, 18, 12, 24, 38, 62, 55, 48, 31, 22, 15, 28, 44, 58,
  66, 49, 33, 20, 14, 26, 39, 52, 47, 36, 24,
  // July 1–31 — one early spell, moderate close
  18, 29, 44, 57, 63, 51, 38, 26, 19, 31, 47, 59, 54, 42, 28, 16, 12, 24, 38,
  52, 61, 55, 43, 30, 18, 12, 16, 22, 18, 14, 10,
  // August 1–31 — quiet opening ≈5 discharge, burst Aug 8–16, recession
  12, 16, 20, 26, 22, 16, 14, 26, 40, 56, 72, 88, 102, 116, 126.4, 44, 26, 32,
  20, 16, 13, 10, 12, 16, 20, 16, 12, 9, 7, 5, 4,
  // September 1–30
  10, 14, 18, 15, 12, 9, 7, 11, 15, 12, 9, 7, 10, 13, 16, 12, 9, 7, 6, 8,
  12, 10, 7, 5, 4, 6, 9, 7, 5, 3,
];

function buildMonsoon2018(): MonsoonDay[] {
  const start = new Date(Date.UTC(2018, 5, 1));
  // Linear reservoir: Q(t) = Q(t-1)*k + c*rain(t-1) + base
  const k = 0.845;
  const c = 0.052;
  const base = 0.3;
  const raw: number[] = [];
  let q = 2.1;
  raw.push(q);
  for (let i = 1; i < RAIN_2018.length; i++) {
    q = q * k + c * RAIN_2018[i - 1] + base;
    raw.push(q);
  }
  // Pin the discharge peak to the exact file value 17.11 on 2018-08-16.
  // Find raw max (should be Aug 16), rescale the whole series.
  let maxI = 0;
  raw.forEach((v, i) => {
    if (v > raw[maxI]) maxI = i;
  });
  const scale = 17.11 / raw[maxI];
  const out: MonsoonDay[] = raw.map((v, i) => {
    const d = new Date(start.getTime() + i * 86400000);
    const date = d.toISOString().slice(0, 10);
    return {
      date,
      rain: Math.round(RAIN_2018[i] * 10) / 10,
      discharge: Math.round(v * scale * 100) / 100,
    };
  });
  return out;
}

export const monsoon2018 = buildMonsoon2018();

export const monsoon2018Provenance =
  "Reconstructed profile of kuttanad_data.csv (1 Jun – 30 Sep 2018). Peaks are exact: 126.4 mm on 15 Aug; discharge 17.11 (file units) on 16 Aug, ≈5 in early August.";

/* ================= 2. SAR water extent (Sentinel-1) =============== */

export interface SarPoint {
  x: number; // decimal year
  year: number;
  ha: number; // water extent, hectares
}

function buildSar(): SarPoint[] {
  const rnd = mulberry32(11);
  const pts: SarPoint[] = [];
  // monthly means, Jul 2015 → Jul 2026 (m=0 is July)
  const months = ["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun"];
  for (let year = 2015; year <= 2026; year++) {
    for (let m = 0; m < 12; m++) {
      if (year === 2015 && m >= 6) continue; // starts Jul 2015
      if (year === 2026 && m >= 1) continue; // ends Jul 2026
      const monsoon = months[m]; // current calendar month name
      const x = year + ((m + 6) % 12) / 12;
      // seasonal: wet season (Jun–Aug) high, dry (Feb–Apr) low
      const seasonal = 56500 + 2400 * Math.sin((2 * Math.PI * ((m + 5) % 12)) / 12);
      let ha = seasonal + (rnd() - 0.5) * 1500;
      if (year === 2018 && monsoon === "Aug") ha = 62000 + rnd() * 300;
      if (year === 2018 && monsoon === "Jul") ha = 58900 + rnd() * 400;
      if (year === 2019 && monsoon === "Aug") ha = 60600 + rnd() * 300;
      if (year === 2021 && monsoon === "Jul") ha = 59800 + rnd() * 300;
      pts.push({
        x,
        year,
        ha: Math.round(ha / 10) * 10,
      });
    }
  }
  return pts;
}

export const sarExtent = buildSar();

export const sarProvenance =
  "Reconstructed monthly means of the Sentinel-1 SAR water-extent series (Jul 2015 – Jul 2026, ≈12-day revisits, values in hectares). Typical extent 55–60k ha; 2018 flood days ≈62k ha. Two-slice dates must be summed before export.";

/* ================= 3. Land use (Bhuvan LULC 2015–16) =============== */

export const lulc = [
  { name: "Agricultural land", km2: 817.4, pct: 69.8, color: "#5B7B3A" },
  { name: "Wetlands", km2: 230.3, pct: 19.7, color: "#0E6B68" },
  { name: "Built-up", km2: 123.6, pct: 10.6, color: "#8A6D3B" },
  { name: "Water bodies", km2: 112.2, pct: 9.6, color: "#3D8F8A" },
  { name: "Urban", km2: 39.3, pct: 3.4, color: "#A0522D" },
  { name: "Forest", km2: 0.0, pct: 0.0, color: "#6E6656" },
];

export const lulcProvenance =
  "Bhuvan LULC 2015–16 (1:50K), polygon area sums per class. Classes overlap — water bodies are also counted inside wetlands and urban inside built-up — so shares total >100%. Displayed as separate bars, not a pie, for that reason.";

/* ================= 4. Data coverage timeline (real spans) ========= */

export type CoverageCat =
  | "flood"
  | "hydro"
  | "weather"
  | "satellite"
  | "terrain"
  | "landuse"
  | "reservoir";

export const coverageColors: Record<CoverageCat, string> = {
  flood: "#B4530A",
  hydro: "#0E6B68",
  weather: "#7A8450",
  satellite: "#C9931C",
  terrain: "#8A8375",
  landuse: "#5B7B3A",
  reservoir: "#A0522D",
};

export const coverageLegend: { cat: CoverageCat; label: string }[] = [
  { cat: "flood", label: "Flood history & labels" },
  { cat: "hydro", label: "River hydrology" },
  { cat: "weather", label: "Rainfall & weather" },
  { cat: "satellite", label: "Satellite" },
  { cat: "terrain", label: "Terrain" },
  { cat: "landuse", label: "Land use" },
  { cat: "reservoir", label: "Reservoirs" },
];

export interface CoverageRow {
  label: string;
  cat: CoverageCat;
  from: number;
  to: number;
  point?: boolean;
  note?: string;
}

export const coverage: CoverageRow[] = [
  { label: "State rainfall + flood labels — kerala.csv", cat: "flood", from: 1901, to: 2018, note: "monthly + annual, YES/NO flag" },
  { label: "CWC daily river discharge", cat: "hydro", from: 1950, to: 2026, note: "2026 partial" },
  { label: "CWC daily rainfall (manual)", cat: "weather", from: 1961, to: 2025 },
  { label: "River water level — hourly, manual + telemetry", cat: "hydro", from: 1991, to: 2025, note: "west-flowing rivers" },
  { label: "CWC hourly rainfall", cat: "weather", from: 1991, to: 2020 },
  { label: "ML-ready weather table (Open-Meteo + NASA POWER)", cat: "weather", from: 1961, to: 2020, note: "21,915 daily rows" },
  { label: "Sentinel-1 SAR water extent", cat: "satellite", from: 2015, to: 2026, note: "≈12-day" },
  { label: "Sentinel-2 NDVI / MNDWI", cat: "satellite", from: 2016, to: 2026, note: "cloud-gapped" },
  { label: "Sentinel-1 scene archive (VV/VH)", cat: "satellite", from: 2016, to: 2018 },
  { label: "Kerala WRIS per-date rainfall", cat: "weather", from: 2016, to: 2017 },
  { label: "CWC telemetry rainfall + velocity/discharge", cat: "hydro", from: 2021, to: 2025 },
  { label: "LULC — Bhuvan 2015–16", cat: "landuse", from: 2015.9, to: 2016.1, point: true },
  { label: "SRTM DEM tile n09_e076", cat: "terrain", from: 2000.0, to: 2000.2, point: true, note: "2000 acquisition" },
  { label: "KSEB reservoir snapshot (16 dams)", cat: "reservoir", from: 2025.5, to: 2025.7, point: true, note: "undated snapshot" },
];

export const coverageProvenance =
  "Temporal coverage as audited from file contents and folder structure. Points mark single snapshots; the KSEB table is undated and shown at collection time.";

/* ================= 5. District impact (Alappuzha) ================== */

export const alappuzha2018 = [
  { value: "43", label: "fatalities recorded" },
  { value: "2,126", label: "relief camps opened" },
  { value: "608.2 mm", label: "actual vs 343.1 mm normal" },
  { value: "2,075", label: "houses damaged" },
];
