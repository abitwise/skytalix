// QE A3 discriminator: delete each A1 row, narrow each A2 row to "- 0 1"; run the hardening file alone, fresh process each.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
const [tree, outDir] = process.argv.slice(2);
const F = join(tree, "src/moves.castling.hardening.test.ts");
const pristine = readFileSync(F, "utf8");
const A1 = [...pristine.matchAll(/^  \["[KQkq]", "[a-h][18]", "(?:own|enemy)", .*\],\n/gm)].map((m) => m[0]);
const A2 = [
  ['["clocks", "4k3/8/8/8/8/8/8/R3K2R w - - 5 9", 24]', '["clocks", "4k3/8/8/8/8/8/8/R3K2R w - - 0 1", 24]'],
  ['["clocks", "r3k2r/8/8/8/8/8/8/4K3 b - - 5 9", 24]', '["clocks", "r3k2r/8/8/8/8/8/8/4K3 b - - 0 1", 24]'],
  ['["ep", "4k3/8/8/2p5/8/8/8/R3K2R w - c6 0 12", 24]', '["ep", "4k3/8/8/2p5/8/8/8/R3K2R w - - 0 1", 24]'],
  ['["ep", "r3k2r/8/8/8/2P5/8/8/4K3 b - c3 0 12", 24]', '["ep", "r3k2r/8/8/8/2P5/8/8/4K3 b - - 0 1", 24]'],
];
const muts = [...A1.map((r, i) => [`del-A1-${i}`, r, ""]), ...A2.map(([a, b], i) => [`narrow-A2-${i}`, a, b])];
const env = { ...process.env };
for (const k of Object.keys(env)) if (k.endsWith("_DEEP")) delete env[k];
console.log(`A1 rows found: ${A1.length}`);
for (const [id, a, b] of [["PRISTINE", null, null], ...muts]) {
  let src = pristine;
  if (a !== null) {
    const n = src.split(a).length - 1;
    if (n !== 1) { console.log(`${id} HARNESS-ERROR anchor x${n}`); continue; }
    src = src.replace(a, () => b);
  }
  writeFileSync(F, src);
  const out = join(outDir, `a3-${id}.json`);
  if (existsSync(out)) rmSync(out);
  spawnSync("node_modules/.bin/vitest", ["run", "src/moves.castling.hardening.test.ts", "--reporter=json", `--outputFile=${out}`], { cwd: tree, env, encoding: "utf8" });
  writeFileSync(F, pristine);
  const j = JSON.parse(readFileSync(out, "utf8"));
  const failing = j.testResults.flatMap((f) => f.assertionResults.filter((t) => t.status === "failed").map((t) => t.fullName));
  const a3 = failing.filter((n) => n.includes("ABC-024 A3"));
  console.log(`${id} total=${j.numTotalTests} failed=${failing.length} A3-red=${a3.length} ${a3.map((n) => n.slice(0, 70)).join(" | ")} ${a !== null ? "row=" + a.trim().slice(0, 50) : ""}`);
}
console.log(readFileSync(F, "utf8") === pristine ? "restored" : "RESTORE FAILED");
