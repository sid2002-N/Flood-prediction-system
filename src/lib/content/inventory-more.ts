/**
 * Kuttanad Flood Prediction System — data inventory content (categories 05–08 + audit flags).
 */
import type { Category } from "./inventory-core";

export const categoriesB: Category[] = [
  {
    id: "terrain",
    no: "05",
    title: "Terrain, Basin & River Network",
    sources: "USGS SRTM · project GIS processing",
    summary:
      "The physical stage on which the flooding happens. The delineated basin covers 1,171.18 km² with a mainstream length of 62.75 km, a maximum Strahler order of 4 and an elongation ratio of 0.615 — a stretched basin that concentrates rather than buffers runoff. The vertical story is the defining one: mean elevation is just 4.92 m and the robust minimum is −2.97 m, confirming the below-sea-level character of the kayal lands. The terrain stack is built from the SRTM 1-arc-second tile n09_e076, then filled and depressionless in UTM 43N, with the full derived family — slope, aspect, curvature, flow direction, flow accumulation, TWI and SPI — sampled both as rasters and as ~4,000-cell 500 m grid tables carrying land-use percentages per cell. 287 sub-basins and the India-wide boundary layers complete the set.",
    highlights: [
      { value: "1,171.18 km²", label: "basin area" },
      { value: "−2.97 m", label: "robust minimum elevation" },
      { value: "≈4,000", label: "500 m grid cells" },
      { value: "287", label: "sub-basins delineated" },
    ],
    datasets: [
      {
        name: "Basin characteristics",
        coverage: "study basin",
        resolution: "morphometric summary",
        format: "table",
        audit: "read",
        notes: [
          "Area 1,171.18 km²; length 62.75 km; maximum stream order 4; elongation ratio 0.615.",
          "Mean elevation 4.92 m; robust minimum elevation −2.97 m — the below-sea-level signature.",
        ],
        flags: [
          "Total stream length (11,586 km) disagrees with the order-summed total (≈4,348 km) — drainage density (9.89) is questionable.",
        ],
      },
      {
        name: "SRTM DEM stack",
        coverage: "SRTM acquisition (2000)",
        resolution: "1 arc-second",
        format: "GeoTIFF · tile n09_e076",
        audit: "catalogued",
        notes: [
          "Raw tile plus filled and depressionless variants, reprojected to UTM 43N.",
        ],
      },
      {
        name: "Derived terrain layers",
        coverage: "basin footprint",
        resolution: "raster + point samples",
        format: "GeoTIFF · GeoPackage 100–180 MB · CSV 55 MB",
        audit: "catalogued",
        notes: [
          "Slope, aspect, curvature, flow direction, flow accumulation, TWI and SPI.",
          "Point-sampled GeoPackages for join-ready analysis.",
        ],
        flags: [
          "Slope values near 90° in a basin averaging 4.9 m elevation look like artifacts.",
          "TWI contains a nodata value of −3.4×10³⁸ — mask before statistics.",
        ],
      },
      {
        name: "500 m grid table",
        coverage: "basin",
        resolution: "≈4,000+ cells",
        format: "CSV",
        audit: "preview",
        notes: [
          "Per cell: elevation, slope, aspect, curvature, flow accumulation, TWI, SPI.",
          "Land-use percentages per cell: agriculture, water, built-up, wetland.",
        ],
      },
      {
        name: "Sub-basins & river network",
        coverage: "basin + India-wide",
        resolution: "vectors",
        format: "GeoPackage · 71 MB per-point file · rasters",
        audit: "catalogued",
        notes: [
          "287 sub-basins; Strahler order and stream rasters.",
          "India-wide sub-basin and watershed boundary layers for regional context.",
        ],
      },
    ],
  },
  {
    id: "landuse",
    no: "06",
    title: "Land Use / Land Cover",
    sources: "Bhuvan (ISRO) — 2015–16, 1:50K",
    summary:
      "What the flood water stands to ruin. Agriculture dominates the basin at 817.4 km² — 69.8% of the area — with wetlands at 230.3 km² (19.7%) and built-up land at 123.6 km² (10.6%). Water bodies occupy 112.2 km² (9.6%) and urban cover 39.3 km² (3.4%); forest is effectively zero. These classes overlap by construction — water bodies are also counted inside wetlands, and urban inside built-up — so the shares total more than 100%. The figures are therefore presented as separate bars rather than a pie chart, and the by-code file keeps polygon counts per class for verification.",
    highlights: [
      { value: "69.8%", label: "agricultural land share" },
      { value: "817.4 km²", label: "cropland at risk" },
      { value: "19.7%", label: "wetlands" },
      { value: "0", label: "forest cover" },
    ],
    datasets: [
      {
        name: "Bhuvan LULC 2015–16 — class areas",
        coverage: "snapshot 2015–16",
        resolution: "1:50,000",
        format: "table",
        audit: "read",
        notes: [
          "Agriculture 817.4 km² (69.8%) · wetlands 230.3 (19.7%) · built-up 123.6 (10.6%).",
          "Water bodies 112.2 (9.6%) · urban 39.3 (3.4%) · forest 0.",
        ],
        flags: [
          "Classes overlap (water inside wetlands, urban inside built-up) — shares total >100%; never render as one pie.",
        ],
      },
      {
        name: "Bhuvan LULC — polygon counts by code",
        coverage: "snapshot 2015–16",
        resolution: "per class code",
        format: "table",
        audit: "read",
        notes: ["Polygon counts per classification code for area verification."],
      },
    ],
  },
  {
    id: "reservoirs",
    no: "07",
    title: "Reservoirs",
    sources: "KSEB · irrigation department",
    summary:
      "What is held back upstream decides what arrives downstream. The KSEB daily snapshot covers 16 dams — including Idukki, the state's largest, at 59.4% of live storage, plus Idamalayar, Kakki and Pamba — each with level, live storage, inflow, rainfall and blue/orange/red alert thresholds. The Pamba and Kakki reservoirs sit on the rivers that drain toward Kuttanad, so their release decisions materially shape local flood risk. A set of 20 irrigation-reservoir CSVs and a combined file extend the picture to the smaller impoundments.",
    highlights: [
      { value: "16", label: "KSEB dams monitored" },
      { value: "59.4%", label: "Idukki live storage at snapshot" },
      { value: "3", label: "alert levels per dam" },
      { value: "20 + 1", label: "irrigation CSVs + combined" },
    ],
    datasets: [
      {
        name: "KSEB daily reservoir snapshot",
        coverage: "single day — undated",
        resolution: "16 dams",
        format: "table",
        audit: "read",
        notes: [
          "Level, live storage, inflow, rainfall per dam.",
          "Idukki 59.4% of live storage; also Idamalayar, Kakki, Pamba.",
          "Blue / orange / red alert level thresholds per dam.",
        ],
        flags: [
          "Snapshot has no date column — locate the capture date before time-series use.",
          "Mixes feet and metres across columns — normalise units first.",
        ],
      },
      {
        name: "Irrigation reservoirs",
        coverage: "20 reservoirs",
        resolution: "per-reservoir CSV",
        format: "CSV · 20 + combined",
        audit: "catalogued",
        notes: ["Individual files plus a combined table; not yet opened."],
      },
    ],
  },
  {
    id: "literature",
    no: "08",
    title: "Literature, Reports & Reference Layers",
    sources: "peer-reviewed papers · CWC · Govt. of Kerala · hazard rasters",
    summary:
      "The knowledge scaffold around the data: peer-reviewed studies including work on the 2018 Kerala floods, the official CWC report on the event, the state's memorandum to centre, a 2022 flood-probability report and two Alappuzha district hazard assessments — one on historic data, one on RCP 8.5 projections. The return-probability rasters put numbers on the tail risk: 10, 25, 50, 100, 200 and 500-year return periods, each with and without climate change, giving the project an independent benchmark to compare LSTM exceedance estimates against. Field photography from 2018 provides the human reference for what the numbers mean.",
    highlights: [
      { value: "6", label: "return periods (10–500 yr)" },
      { value: "±CC", label: "with / without climate change" },
      { value: "4", label: "papers in the collection" },
      { value: "5+", label: "official reports" },
    ],
    datasets: [
      {
        name: "Peer-reviewed papers",
        coverage: "—",
        resolution: "PDF",
        format: "4 papers",
        audit: "catalogued",
        notes: [
          "An Elsevier article, a PLOS ONE paper, a conference paper and a dedicated 2018 Kerala flood study.",
        ],
      },
      {
        name: "Official reports",
        coverage: "2018–2022",
        resolution: "PDF",
        format: "reports",
        audit: "catalogued",
        notes: [
          "CWC Report on Kerala Floods; Kerala Memorandum on the 2018 floods.",
          "Flood Probability Report 2022.",
          "Two Alappuzha district flood-hazard PDFs — historic data and RCP 8.5.",
        ],
      },
      {
        name: "Return-probability rasters",
        coverage: "Alappuzha district",
        resolution: "raster",
        format: "4 ZIPs",
        audit: "catalogued",
        notes: [
          "Return periods: 10, 25, 50, 100, 200, 500 years.",
          "Each scenario with and without climate change.",
        ],
      },
      {
        name: "Field photography & saved analyses",
        coverage: "2018–2022",
        resolution: "—",
        format: "images · web archive",
        audit: "catalogued",
        notes: [
          "Before/after flood photographs from 2018.",
          "A saved web page analysing floods for 2018–2022.",
        ],
      },
    ],
  },
];

/* ------------------------- data audit flags ------------------------- */

export type FlagSeverity = "gap" | "caution" | "note";
export type FlagImpact = "target" | "spatial" | "integrity" | "hygiene";
export type FlagStatus = "open" | "mitigated";

export interface AuditFlag {
  no: string;
  severity: FlagSeverity;
  impact: FlagImpact;
  status: FlagStatus;
  affects: string;
  title: string;
  detail: string;
  action: string;
}

/** Impact groups — what each defect class does to model development. */
export const auditGroups: { id: FlagImpact; label: string; blurb: string }[] = [
  {
    id: "target",
    label: "Target & labels",
    blurb: "Blocks the unified training table — the model cannot be trained or validated until a flood target is defined.",
  },
  {
    id: "spatial",
    label: "Spatial integrity",
    blurb: "Records that belong to the wrong basin or the wrong place — pruning errors that would silently poison basin-specific results.",
  },
  {
    id: "integrity",
    label: "Units, artifacts & provenance",
    blurb: "Values that cannot be trusted at face value: mixed units, processing artifacts, undated snapshots and uncited totals.",
  },
  {
    id: "hygiene",
    label: "Archive hygiene",
    blurb: "Duplicates, empty files and overlapping classes — not wrong, but they inflate and confuse the archive until handled by convention.",
  },
];

export const auditFlags: AuditFlag[] = [
  {
    no: "01",
    severity: "gap",
    impact: "target",
    status: "open",
    affects: "all inputs → the unified training pool",
    title: "No unified labelled training table yet",
    detail:
      "Weather, discharge, water level, SAR and terrain all exist as separate, strong inputs — but no single merged daily table with a Kuttanad flood target has been assembled.",
    action:
      "Join labels from discharge thresholds, IndoFloods events or SAR flood extent; this is the project's next critical step.",
  },
  {
    no: "02",
    severity: "gap",
    impact: "target",
    status: "open",
    affects: "kuttanad_NW3_weather_ML_ready_1961_2020.csv",
    title: "Weather table has no target label",
    detail:
      "The ML-ready weather table carries no flood or discharge column, and its NASA POWER fields are empty for 1961–1980 — 33.3% missing overall.",
    action: "Fill the NASA void by re-export or imputation, then join the target series.",
  },
  {
    no: "07",
    severity: "note",
    impact: "target",
    status: "open",
    affects: "SAR water-extent series (Sentinel-1)",
    title: "SAR slices must be summed",
    detail:
      "Many dates carry two rows — two image slices of one pass. After summing, typical extent is ≈55k ha, but 2018 flood days reach only ≈62k ha against 55–60k on ordinary monsoon dates.",
    action: "Sum slices on export; treat extent as a weak label on its own.",
  },
  {
    no: "04",
    severity: "caution",
    impact: "spatial",
    status: "open",
    affects: "hourly water-level series",
    title: "Cauvery-basin contamination",
    detail:
      "Many water-level files in the archive belong to the Cauvery basin, not to Kuttanad's west-flowing rivers.",
    action: "Filter by station metadata before any basin-specific analysis.",
  },
  {
    no: "11",
    severity: "note",
    impact: "spatial",
    status: "open",
    affects: "Open-Meteo second-point export",
    title: "Offshore Open-Meteo point",
    detail: "One Open-Meteo export uses (9.03°N, 75.99°E), which falls offshore of the coast.",
    action: "Verify the point or re-export from a land coordinate.",
  },
  {
    no: "06",
    severity: "caution",
    impact: "integrity",
    status: "open",
    affects: "derived terrain layers (slope · TWI · drainage density)",
    title: "Terrain artifacts",
    detail:
      "Slope values near 90° in a basin averaging 4.9 m elevation, a TWI nodata value of −3.4×10³⁸, and a drainage density (9.89) derived from inconsistent stream-length totals (11,586 km vs ≈4,348 km).",
    action: "Re-derive slope from the depressionless DEM; mask nodata; recompute drainage density.",
  },
  {
    no: "09",
    severity: "caution",
    impact: "integrity",
    status: "open",
    affects: "KSEB 16-dam reservoir snapshot",
    title: "KSEB snapshot lacks a date and mixes units",
    detail:
      "The 16-dam KSEB table has no capture date and mixes feet and metres across columns.",
    action: "Date the snapshot from context; normalise units before use.",
  },
  {
    no: "10",
    severity: "note",
    impact: "integrity",
    status: "open",
    affects: "district-wise 2018 impact table",
    title: "District impact table needs its source cited",
    detail:
      "The file does not state the period its rainfall columns cover, and district fatalities sum to 339.",
    action: "Cite the official source before publishing any district totals.",
  },
  {
    no: "03",
    severity: "caution",
    impact: "hygiene",
    status: "open",
    affects: "Kerala-wide 2026–2030 files",
    title: "Header-only 2026–2030 files",
    detail:
      "Kerala-wide files for 2026–2030 are only 230–290 bytes — effectively header-only. The CWC 2026 files, by contrast, do contain data.",
    action: "Exclude the empty years; retain CWC 2026.",
  },
  {
    no: "05",
    severity: "caution",
    impact: "hygiene",
    status: "open",
    affects: "most gauge series (raw / manual-cleaned / cleaned)",
    title: "Triple copies inflate the archive",
    detail:
      "Most series exist as raw, manual-cleaned and cleaned copies; the Google Sheet version (3.9 MB) is a partial export of a much larger CSV (35.8 MB).",
    action: "Train from the cleaned CSV; treat the Sheet as a view, not a source.",
  },
  {
    no: "08",
    severity: "note",
    impact: "hygiene",
    status: "mitigated",
    affects: "Bhuvan LULC 2015–16 class areas",
    title: "Land-use classes overlap",
    detail:
      "Water bodies are also counted inside wetlands and urban inside built-up, so shares total over 100%.",
    action: "Never show LULC as a single pie; use per-class bars with this footnote.",
  },
];
