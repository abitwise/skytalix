// Wait for a clear host before A4: 0 foreign vitest, 0 cutechess-cli, load1 <= 2.0, Tctl <= 60; poll 15 s; cap 45 min.
// Prints CLEAR or SHARED. usage: node clear.mjs <logFile>
import { appendFileSync } from "node:fs";
import { alive, cutechessCount, load1, sleepSync, tctl, vitestPids } from "./host.mjs";
const file = process.argv[2]; const t0 = Date.now(); const lg = (s) => appendFileSync(file, `${new Date().toISOString()} ${s}\n`);
while (Date.now() - t0 < 45 * 60_000) {
  const v = vitestPids();
  if (v.length) { lg(`foreign vitest ${v.join(",")}: waiting by kill -0`); for (const p of v) while (alive(p) && Date.now() - t0 < 45 * 60_000) sleepSync(5_000); continue; }
  const l = load1(), c = cutechessCount(), t = tctl();
  if (c === 0 && l <= 2.0 && t <= 60) { lg(`CLEAR load1=${l.toFixed(2)} tctl=${t.toFixed(1)} waited=${((Date.now() - t0) / 1000).toFixed(0)}s`); console.log("CLEAR"); process.exit(0); }
  lg(`wait load1=${l.toFixed(2)} cutechess=${c} tctl=${t.toFixed(1)}`); sleepSync(15_000);
}
lg("cap 45 min reached: SHARED"); console.log("SHARED");
