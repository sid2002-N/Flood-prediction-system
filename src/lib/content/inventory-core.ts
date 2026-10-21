/**
 * Kuttanad Flood Prediction System — data inventory content (types + categories 01–04).
 *
 * Everything here reflects the audited state of the collected archive:
 * what exists, where it came from, how far it reaches, and what is
 * still wrong with it. Audit states are honest:
 *   read       — file opened and reviewed in full
 *   preview    — first rows inspected
 *   catalogued — described from file names / folder structure only
 */

export type AuditState = "read" | "preview" | "catalogued";

export interface Dataset {
  name: string;
  coverage: string;
  resolution: string;
  format: string;
  audit: AuditState;
  notes: string[];
  flags?: string[];
}

export interface Category {
  id: string;
  no: string;
  title: string;
  sources: string;
  summary: string;
  highlights: { value: string; label: string }[];
  datasets: Dataset[];
}

export const categoriesA: Category[] = [
  {
    id: "flood-history",
    no: "01",
    title: "Flood History & Labels",
    sources: "Kerala state records · IndoFloods · project rainfall tables",
    summary:
      "The labelled flood record — the ground truth that defines what counts as a flood for the model. It combines a 118-year state-level rainfall series with an explicit YES/NO flood flag, the district-by-district impact record of the 2018 event, and the all-India IndoFloods catalogue with roughly 140 catchment attributes per gauge. The 2018 row of the state series alone justifies the study: 4,473 mm of rain in one year, 1,398.9 mm of it in August. None of these are Kuttanad-specific on their own, which is exactly why the model needs a local target series to anchor on.",
    highlights: [
      { value: "1901–2018", label: "labelled state rainfall record" },
      { value: "4,473 mm", label: "2018 annual rainfall" },
      { value: "43", label: "Alappuzha fatalities, 2018" },
      { value: "~140", label: "catchment attrs per gauge (IndoFloods)" },
    ],
    datasets: [
      {
        name: "kerala.csv — rainfall + flood flag",
        coverage: "1901–2018",
        resolution: "monthly + annual",
        format: "CSV",
        audit: "read",
        notes: [
          "Monthly and annual rainfall (mm) with a YES/NO flood column per year.",
          "2018 row: 4,473 mm annual; 1,398.9 mm in August alone — 31% of the year in one month.",
          "State-level, not Kuttanad-specific; used as long-range context, not as a training target.",
        ],
      },
      {
        name: "District-wise 2018 flood impact",
        coverage: "2018 event",
        resolution: "14 districts",
        format: "table",
        audit: "read",
        notes: [
          "Fatalities, relief camps, actual vs normal rainfall, landslides, damaged houses per district.",
          "Alappuzha: 43 fatalities · 2,126 camps · 608.2 mm vs 343.1 mm normal · 2,075 houses damaged.",
        ],
        flags: [
          "Rainfall period not stated in the file — confirm before citing totals.",
          "District fatalities sum to 339; verify against the official source.",
        ],
      },
      {
        name: "IndoFloods — flood events",
        coverage: "all-India, multi-decadal",
        resolution: "per gauge event",
        format: "CSV",
        audit: "preview",
        notes: [
          "Start/end dates, peak level, duration, time-to-peak and a severity class (Flood / Severe Flood) per event.",
          "Must be filtered to Kerala gauges before it can label the Kuttanad series.",
        ],
      },
      {
        name: "IndoFloods — catchment attributes",
        coverage: "all-India",
        resolution: "per gauge",
        format: "CSV",
        audit: "preview",
        notes: [
          "≈140 attributes per gauge: geomorphology, climate, land cover, soil, GDP and HDI.",
          "Candidate source of basin covariates for regionalisation experiments.",
        ],
      },
      {
        name: "rainfall_with_correct_flood_labels.csv",
        coverage: "80 MB — unopened",
        resolution: "—",
        format: "CSV",
        audit: "catalogued",
        notes: [
          "Name implies a rainfall series with corrected flood labels.",
          "Largest single unopened file in the archive; audit before use.",
        ],
      },
    ],
  },
  {
    id: "hydrology",
    no: "02",
    title: "River Hydrology",
    sources: "CWC · KSW · KSWA · NWDP · NWIC · Kerala WRIS",
    summary:
      "The gauge record of the west-flowing rivers from Tadri to Kanyakumari, including the Pamba system that drains into Kuttanad's backwaters. Daily discharge reaches back to 1950 — a 75-year instrumental record — and hourly water levels exist in both manual and telemetry streams back to 1991. Six NWIC rain gauges sit inside or beside Kuttanad itself: Ambalapuzha, Venmony, Cherthala, Arookutty, Mancompu and Kollakadavu. File naming tracks processing stage (raw / manual cleaning / cleaned), so the same series often exists in three copies — the cleaned variant is the one to train on.",
    highlights: [
      { value: "1950–2026", label: "daily discharge span" },
      { value: "since 1991", label: "hourly water levels" },
      { value: "6", label: "local NWIC rain gauges" },
      { value: "3", label: "processing stages per series" },
    ],
    datasets: [
      {
        name: "CWC daily river discharge",
        coverage: "1950–2025 (2026 partial)",
        resolution: "daily",
        format: "CSV · 22 MB + 36 MB",
        audit: "catalogued",
        notes: [
          "Two epochs: 1950–2000 (22 MB) and 2001–2025 (36 MB), plus a partial 2026 file that does contain data.",
          "The backbone instrumental record for the model's target variable.",
        ],
      },
      {
        name: "Velocity + discharge series",
        coverage: "2021–2025",
        resolution: "daily",
        format: "CSV",
        audit: "catalogued",
        notes: ["Paired velocity and discharge measurements from the telemetry era."],
      },
      {
        name: "River water level — hourly",
        coverage: "since 1991",
        resolution: "hourly · manual + telemetry",
        format: "CSV",
        audit: "catalogued",
        notes: [
          "West-flowing rivers, Tadri to Kanyakumari.",
          "Dedicated Pamba-specific files — the river most relevant to Kuttanad.",
        ],
        flags: [
          "Many water-level files belong to the Cauvery basin, not Kuttanad — prune before modelling.",
        ],
      },
      {
        name: "NWIC local rain gauges",
        coverage: "recent years",
        resolution: "per-gauge Excel",
        format: "XLS · 6 stations",
        audit: "catalogued",
        notes: [
          "Ambalapuzha, Venmony, Cherthala, Arookutty, Mancompu, Kollakadavu — all inside or adjacent to Kuttanad.",
          "The most locally representative rainfall available.",
        ],
      },
      {
        name: "Kerala WRIS per-date rainfall",
        coverage: "2016–2017",
        resolution: "per-date tables",
        format: "XLS",
        audit: "catalogued",
        notes: [
          "Small monthly and dated folders; appears aligned to satellite pass dates.",
          "Candidate cross-check for the SAR time series.",
        ],
      },
      {
        name: "Ancillary meteorological series",
        coverage: "multi-decadal",
        resolution: "varies",
        format: "CSV",
        audit: "catalogued",
        notes: [
          "Temperature, pressure, humidity and wind from the same agency sources.",
        ],
      },
    ],
  },
  {
    id: "weather",
    no: "03",
    title: "Rainfall & Weather",
    sources: "Open-Meteo · NASA POWER · IMD Pune · CWC",
    summary:
      "The model's feature base. The centrepiece is a purpose-built ML-ready weather table: 21,915 daily rows for the point 9.5°N, 76.5°E, joining Open-Meteo reanalysis variables (temperature, rain, wind, radiation, ET₀) with NASA POWER variables (humidity, pressure, dew point), then adding calendar features, 1/3/7-day rainfall lags and 3/7/30-day rolling sums — the sequence features the LSTM consumes. A separate 2018 monsoon file pairs daily rainfall with river discharge for the event itself, peaking at 126.4 mm of rain on 15 August and a discharge of 17.11 (file units) the day after.",
    highlights: [
      { value: "21,915", label: "daily rows, ML-ready" },
      { value: "1961–2020", label: "60-year feature span" },
      { value: "33.3%", label: "NASA columns missing 1961–80" },
      { value: "1/3/7 · 3/7/30", label: "lag & rolling features" },
    ],
    datasets: [
      {
        name: "kuttanad_NW3_weather_ML_ready_1961_2020.csv",
        coverage: "1961–2020",
        resolution: "daily · point 9.5°N 76.5°E",
        format: "CSV · 21,915 rows",
        audit: "preview",
        notes: [
          "Open-Meteo: temperature, precipitation, wind, shortwave radiation, ET₀.",
          "NASA POWER: relative humidity, surface pressure, dew point.",
          "Engineered: calendar features; rainfall lags (1, 3, 7 days); rolling sums (3, 7, 30 days).",
        ],
        flags: [
          "NASA POWER columns empty for 1961–1980 — 33.3% missing overall.",
          "No flood or discharge label column yet — labels must be joined from elsewhere.",
        ],
      },
      {
        name: "kuttanad_data.csv — 2018 monsoon",
        coverage: "1 Jun – 30 Sep 2018",
        resolution: "daily",
        format: "CSV",
        audit: "read",
        notes: [
          "Daily precipitation + river discharge for the event window.",
          "Rainfall peaks at 126.4 mm on 15 Aug; discharge peaks at 17.11 on 16 Aug, up from ≈5 in early August.",
          "The cleanest small training/validation pair in the archive.",
        ],
        flags: ["Discharge units are not stated in the file — confirm before publishing."],
      },
      {
        name: "Missing-values report",
        coverage: "weather table",
        resolution: "per-column audit",
        format: "table",
        audit: "read",
        notes: [
          "Documents the gaps across the ML-ready weather table, including the 1961–1980 NASA POWER void.",
        ],
      },
      {
        name: "IMD Pune gridded rainfall",
        coverage: "folder — unopened",
        resolution: "gridded",
        format: "folder",
        audit: "catalogued",
        notes: ["Standard all-India gridded product; would enable spatial interpolation."],
      },
      {
        name: "CWC rainfall series",
        coverage: "1961–2025",
        resolution: "manual daily · hourly 1991–2020 · telemetry 2021–25",
        format: "CSV",
        audit: "catalogued",
        notes: ["Three instrument eras with overlapping coverage; cross-validate against NWIC gauges."],
      },
      {
        name: "Open-Meteo — second point",
        coverage: "reanalysis",
        resolution: "point 9.03°N 75.99°E",
        format: "CSV",
        audit: "catalogued",
        notes: ["A nearby-point export kept for comparison."],
        flags: ["The point (9.03°N, 75.99°E) appears to be offshore — verify before use."],
      },
    ],
  },
  {
    id: "satellite",
    no: "04",
    title: "Satellite Observations",
    sources: "ESA Copernicus — Sentinel-1 & Sentinel-2",
    summary:
      "Spaceborne evidence of water where it should not be. The Sentinel-1 SAR water-extent series runs from July 2015 to July 2026 at roughly 12-day revisits, measured in hectares of open water. Many passes arrive as two image slices that must be summed before comparison — after summing, a typical monsoon date shows 55–60 thousand hectares, and the 2018 flood days reach about 62 thousand. That narrow separation between flood and ordinary monsoon is itself a finding: extent alone is a weak label. Sentinel-2 contributes NDVI and MNDWI indices from January 2016, with cloud-masked gaps, plus per-scene VV/VH GeoTIFFs and per-grid mean tables for the key flood dates.",
    highlights: [
      { value: "2015–2026", label: "SAR water-extent record" },
      { value: "≈12 d", label: "Sentinel-1 revisit" },
      { value: "62k ha", label: "2018 flood extent (vs 55–60k typical)" },
      { value: "VV + VH", label: "polarisation archive" },
    ],
    datasets: [
      {
        name: "SAR water extent — Sentinel-1",
        coverage: "Jul 2015 – Jul 2026",
        resolution: "≈12-day",
        format: "CSV",
        audit: "read",
        notes: [
          "Open-water extent in hectares per pass.",
          "Typical monsoon extent 55–60k ha; 2018 flood days ≈62k ha.",
        ],
        flags: [
          "Many dates have two rows — two image slices of the same pass; sum them (≈55,000 ha combined).",
          "Flood vs ordinary separation is weak on extent alone — do not use as the only label.",
        ],
      },
      {
        name: "NDVI / MNDWI series — Sentinel-2",
        coverage: "since Jan 2016",
        resolution: "time series",
        format: "CSV",
        audit: "preview",
        notes: [
          "Vegetation and water indices with gaps where cloud masked the scene.",
          "Sample ranges: NDVI 0.35–0.68; MNDWI −0.43 to −0.03.",
        ],
      },
      {
        name: "Flood-extent & index composites",
        coverage: "Kuttanad footprint",
        resolution: "raster",
        format: "GeoTIFF · ≈110 MB each",
        audit: "catalogued",
        notes: [
          "Kuttanad_Flood_Extent_SAR.tif plus NDVI/MNDWI composites.",
        ],
      },
      {
        name: "Sentinel-1 scene archive",
        coverage: "2016 · 2017 · 2018 (27 Aug)",
        resolution: "VV + VH",
        format: "GeoTIFF · ≈145 MB + CSV + GPKG",
        audit: "catalogued",
        notes: [
          "2016: March, July, September and further passes; 2017: 9 July, 8 August; 2018: 27 August.",
          "Each pass ships as a clipped GeoTIFF, per-grid mean CSVs and GeoPackages.",
        ],
      },
    ],
  },
];
