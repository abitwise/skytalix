// qe-ABC-177: power + foreign-process log, one pmset and one ps per 30 s, for `secs` seconds. Exits early on the first AC sample when argv[4] = "stop-on-ac".
import { execSync } from "node:child_process"; import { appendFileSync, writeFileSync } from "node:fs"; import os from "node:os";
const [OUT, secs = "1500", mode = ""] = process.argv.slice(2); const t0 = Date.now();
const RX = /vitest|oeselg-labs\/platform|uat-harness|grugops-examples\/wt-|\.grugops\/context\/[^ ]*\/probe\//;
writeFileSync(OUT, "utc\tpower\tload1\tuser_procs\tforeign\n");
const tick = () => {
  const pw = execSync("pmset -g batt", { encoding: "utf8" }).match(/'([^']+)'/)?.[1] ?? "unknown";
  const ps = execSync("ps -axo uid=,command=", { encoding: "utf8" }).trim().split("\n");
  const uid = String(process.getuid()); const mine = ps.filter((l) => l.trim().split(/\s+/)[0] === uid).length;
  const f = ps.filter((l) => RX.test(l) && !l.includes("qe-ABC-177/probe/powerlog.mjs") && !l.includes("ps -axo")).length;
  appendFileSync(OUT, `${new Date().toISOString()}\t${pw}\t${os.loadavg()[0].toFixed(2)}\t${mine}\t${f}\n`);
  if ((mode === "stop-on-ac" && pw === "AC Power") || Date.now() - t0 >= Number(secs) * 1000) process.exit(0);
};
tick(); setInterval(tick, 30000);
