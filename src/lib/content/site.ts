/**
 * KAYAL — site-level content.
 * Brand, coordinates, hero statistics and source registry.
 */

export const site = {
  brand: "KAYAL",
  brandLong: "Kuttanad Flood Research",
  tagline: "LSTM early-warning study",
  location: "Alappuzha · Kerala · India",
  coords: "9.5°N 76.5°E",
  period: "2015 — 2026",
  siteNote:
    "A single-page research dossier: data inventory, flood-event analysis, a live forecasting console and the current project status.",
};

export const heroStats: { value: string; label: string; note: string }[] = [
  { value: "1,171.18", label: "km² basin area", note: "delineated study basin" },
  { value: "−2.97 m", label: "robust min. elevation", note: "land below sea level" },
  { value: "4,473 mm", label: "2018 state rainfall", note: "kerala.csv, annual total" },
  { value: "21,915", label: "daily weather rows", note: "ML-ready table, 1961–2020" },
  { value: "1950–2026", label: "discharge record", note: "CWC daily gauge series" },
  { value: "8 / 22", label: "categories / folders", note: "data inventory scope" },
];

export const sourceRegistry = [
  { name: "CWC", full: "Central Water Commission" },
  { name: "IMD Pune", full: "India Meteorological Dept. — gridded rainfall" },
  { name: "KSEB", full: "Kerala State Electricity Board — reservoirs" },
  { name: "ESA Sentinel-1/2", full: "SAR & multispectral imagery" },
  { name: "USGS SRTM", full: "Shuttle Radar Topography Mission DEM" },
  { name: "Bhuvan (ISRO)", full: "Land use / land cover, 1:50K" },
  { name: "NWIC", full: "National Water Informatics Centre" },
  { name: "Kerala WRIS", full: "Water Resources Information System" },
  { name: "NASA POWER", full: "meteorology & solar energy" },
  { name: "Open-Meteo", full: "historical reanalysis weather" },
];

export const figuresNote =
  "Figures tagged RECONSTRUCTED are drawn from reviewed file summaries — peak values are exact, daily shapes are illustrative until a direct export replaces them.";
