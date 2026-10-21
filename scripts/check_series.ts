import { monsoon2018 } from "../src/lib/content/series";

const at = (d: string) => monsoon2018.find((r) => r.date === d);
const peak = monsoon2018.reduce((a, b) => (b.discharge > a.discharge ? b : a));
console.log("peak discharge:", peak.discharge, "on", peak.date, "(expect 17.11 on 2018-08-16)");
console.log("rain peak:", at("2018-08-15")?.rain, "(expect 126.4)");
console.log("early Aug (08-03):", at("2018-08-03")?.discharge, "≈ 5 ?");
console.log("mid Jul (07-15):", at("2018-07-15")?.discharge);
console.log("1 Sep:", at("2018-09-01")?.discharge);
console.log("rows:", monsoon2018.length, "(expect 122)");
console.log("first:", monsoon2018[0].date, "last:", monsoon2018[121].date);
