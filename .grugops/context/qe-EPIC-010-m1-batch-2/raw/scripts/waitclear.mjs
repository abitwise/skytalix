// wait-clear (PREREG): foreign vitest / cutechess-cli pids gone (kill -0), then Tctl < 55 and load1 < 1.5 on 3 checks 20 s apart.
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, appendFileSync } from "node:fs";
import { loadavg } from "node:os";
const logf = process.argv[2];
const log = (m) => appendFileSync(logf, `${new Date().toISOString().replace(/\.\d+Z$/, "Z")} ${m}\n`);
let hw; for (const h of readdirSync("/sys/class/hwmon")) if (readFileSync(`/sys/class/hwmon/${h}/name`, "utf8").trim() === "k10temp") hw = h;
const t = () => Number(readFileSync(`/sys/class/hwmon/${hw}/temp1_input`, "utf8")) / 1000;
const ps = execFileSync("ps", ["-eo", "pid=,comm=,args="], { encoding: "utf8" }).split("\n").filter(Boolean);
const snap = ps.filter((l) => /[/]vitest/.test(l) || /^\s*\d+\s+cutechess/.test(l)).map((l) => Number(l.trim().split(/\s+/)[0]));
log(`snapshot foreign vitest/cutechess pids: [${snap.join(",")}]`);
const alive = (p) => { try { process.kill(p, 0); return true; } catch { return false; } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
while (snap.some(alive)) await sleep(10_000);
log("snapshot pids gone");
let ok = 0;
while (ok < 3) {
  const tc = t(), l1 = loadavg()[0];
  const pass = tc < 55 && l1 < 1.5;
  ok = pass ? ok + 1 : 0;
  log(`precheck tctl=${tc.toFixed(1)} load1=${l1.toFixed(2)} ${pass ? "ok" : "not yet"} (${ok}/3)`);
  if (ok < 3) await sleep(20_000);
}
log("CLEAR");
