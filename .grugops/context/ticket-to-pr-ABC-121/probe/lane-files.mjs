// ABC-121: per-FILE attribution of the N8-LANE charge. Runs the touched files alone in arm A
// (9823c27) and arm B (15c6eb0) of the lane121 harness, ROUNDS interleaved rounds, and reports the
// median CPU (user+sys, /usr/bin/time) per file per arm and the median of vitest's per-file
// test-time. One fresh process per run. Lives outside the repository.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";

const S = "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/cc8144c4-cb23-42b5-90b8-44bcbd8a2345/scratchpad/lane121";
const ROUNDS = Number(process.env.ROUNDS ?? 5);
const FILES = ["search.pvs-lmr", "search", "search.ordering", "transposition", "quiescence", "engine"].map((f) => `src/${f}.test.ts`);
const med = (xs) => { const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const cpu = {};
const test = {};
for (let round = 0; round < ROUNDS; round++) {
  for (const file of FILES) {
    for (const arm of round % 2 ? ["B", "A"] : ["A", "B"]) {
      if (!existsSync(`${S}/${arm}/${file}`)) continue;
      const out = `${S}/${arm}/r.json`;
      rmSync(out, { force: true });
      const r = spawnSync("/usr/bin/time", ["-p", "npx", "vitest", "run", "--reporter=json", `--outputFile=${out}`, file], { cwd: `${S}/${arm}`, encoding: "utf8" });
      const pick = (k) => Number((r.stderr.match(new RegExp(`^${k}\\s+([0-9.]+)`, "m")) ?? [])[1]);
      const j = JSON.parse(readFileSync(out, "utf8"));
      const key = `${file}|${arm}`;
      (cpu[key] ??= []).push(pick("user") + pick("sys"));
      (test[key] ??= []).push(j.testResults[0].endTime - j.testResults[0].startTime);
    }
  }
}
for (const file of FILES) {
  const a = `${file}|A`, b = `${file}|B`;
  console.log(`${file}: CPU A ${med(cpu[a]).toFixed(2)} s${cpu[b] ? `, B ${med(cpu[b]).toFixed(2)} s, A-B ${(med(cpu[a]) - med(cpu[b])).toFixed(2)} s` : " (new file)"}; test-time A ${Math.round(med(test[a]))} ms${test[b] ? `, B ${Math.round(med(test[b]))} ms` : ""}`);
}
