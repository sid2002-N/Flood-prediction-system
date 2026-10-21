import { runDemo, scenarios, type ScenarioId } from "../src/lib/model-runner";

const intensities = [0.5, 1.0, 1.5, 2.0];
for (const s of Object.keys(scenarios) as ScenarioId[]) {
  for (const i of intensities) {
    const r = runDemo({ scenario: s, intensity: i, horizon: 14 });
    console.log(
      `${s.padEnd(9)} x${i.toFixed(1)} → peak ${r.stats.peak.toFixed(2).padStart(6)} on ${r.stats.peakDay.padEnd(5)} above:${r.stats.daysAbove}d risk=${r.stats.risk}`
    );
  }
}
const r = runDemo({ scenario: "event2018", intensity: 1, horizon: 30 });
console.log("event2018 x1.0 h=30 series length:", r.series.length, "prelude+horizon ok:", r.series.filter(p=>p.isForecast).length === 30);
console.log("labels:", r.series.slice(0, 12).map(p => p.label).join(","), "…", r.series.slice(-3).map(p=>p.label).join(","));
