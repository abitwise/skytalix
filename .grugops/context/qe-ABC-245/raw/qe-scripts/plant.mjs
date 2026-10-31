// qe-ABC-245 PLANTS (adapted from qe-ABC-242 plant.mjs; frozen in PREREG.txt before any head run). Each plant is ONE
// exact string edit of src/levels.ts asserted to occur exactly once (or QB: a whole-file swap for the real base file),
// applied to a SCRATCH tree P = hard-link copy of the head tree H with src/ replaced by a REAL copy (the only directory a
// plant writes). Each plant runs the WHOLE default lane plus qe-ABC-242's scratch file qe-extra.test.ts (X1-X4, copied
// into P/src, never into the repository), vitest via node (never npx / npm exec), json reporter,
// NODE_OPTIONS=--max-old-space-size=128. Restores levels.ts after every plant and in a finally.
// usage: node plant.mjs <H> <baseLevels.ts file (4387d4e8)> <P scratch dir> <outDir> [ids=all]
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, cpSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const [H, baseLevelsFile, P, out, idsArg] = process.argv.slice(2);
const here = dirname(fileURLToPath(import.meta.url));
rmSync(P, { recursive: true, force: true });
execFileSync("cp", ["-al", H, P]);
rmSync(join(P, "src"), { recursive: true, force: true });
cpSync(join(H, "src"), join(P, "src"), { recursive: true });
rmSync(join(P, ".test-results"), { recursive: true, force: true });
copyFileSync(join(here, "qe-extra.test.ts"), join(P, "src/qe-extra.test.ts"));
const prodPath = join(P, "src/levels.ts");
const orig = readFileSync(prodPath, "utf8");
const BASE_LEVELS = readFileSync(baseLevelsFile, "utf8");
const CAP = "const PRIOR_KEYS_WINDOW = 100;";
const one = (from, to) => (s) => {
  const parts = s.split(from);
  if (parts.length !== 2) throw new Error(`plant string occurs ${parts.length - 1} times: ${JSON.stringify(from)}`);
  return parts.join(to);
};
const PLANTS = {
  none: (s) => s, // cap 100, as committed
  Q6: one(CAP, "const PRIOR_KEYS_WINDOW = 8;"), // qe-ABC-242 Q6
  Q8: one(CAP, "const PRIOR_KEYS_WINDOW = 50;"), // qe-ABC-242 Q8
  QB: () => BASE_LEVELS, // ABC-242's base 4387d4e8 real src/levels.ts under head's tests (ticket A3)
  Q97: one(CAP, "const PRIOR_KEYS_WINDOW = 97;"), // informative: SE-245-a's "every cap below 98" edge
  Q98: one(CAP, "const PRIOR_KEYS_WINDOW = 98;"), // informative: the first cap the row cannot see
};
const ids = idsArg ? idsArg.split(",") : Object.keys(PLANTS);
const summary = [];
try {
  for (const id of ids) {
    const mutated = PLANTS[id](orig);
    if (id !== "none" && mutated === orig) throw new Error(`${id} did not change levels.ts`);
    writeFileSync(prodPath, mutated);
    const json = join(out, `plant-${id}.json`);
    rmSync(json, { force: true });
    const t0 = Date.now();
    const r = spawnSync(process.execPath, [join(P, "node_modules/vitest/vitest.mjs"), "run", "--reporter=json", `--outputFile.json=${json}`], {
      cwd: P, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=128" },
    });
    const j = JSON.parse(readFileSync(json, "utf8"));
    const red = [];
    for (const f of j.testResults) for (const a of f.assertionResults) if (a.status === "failed") red.push(`${f.name.split("/src/")[1] ?? f.name} :: ${a.fullName}`);
    const line = `${id} rc=${r.status} total=${j.numTotalTests} passed=${j.numPassedTests} failed=${j.numFailedTests} skipped=${j.numPendingTests + j.numTodoTests} wall=${((Date.now() - t0) / 1000).toFixed(1)}s`;
    writeFileSync(join(out, `plant-${id}.red.txt`), `${line}\n${red.map((x) => `  RED ${x}`).join("\n")}\n`);
    summary.push(`${line}\n${red.map((x) => `  RED ${x}`).join("\n")}`);
    console.log(summary.at(-1));
  }
} finally {
  writeFileSync(prodPath, orig);
}
writeFileSync(join(out, `plants-summary-${ids.join("_")}.txt`), summary.join("\n") + "\n");
