/**
 * PROBE (ruling-abc121-g6): `pvsNoResearch` (PVS's null-window fail-high never re-searched, in both
 * recursions; the exact edit of ticket-to-pr-ABC-121/probe/mutants.mjs) against the rows the build
 * hop's harness did NOT run on it: the whole `SEARCH_DEEP` `search.pvs-lmr.test.ts` (the
 * decision-8 PVS identity row over the 190, the mate floor over the 287, the drift) and
 * `search.test.ts` (`ABC-077` `A1`, both lanes). Scratch tree outside the repository.
 *
 * Usage: node pvs-nr.mjs <scratch-dir> <repo-root>
 */
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [scratch, repo] = process.argv.slice(2);
const S_PVS = "  if (score > alpha && score < beta) {\n    score =\n      0 -\n      negamax(position, depth - 1, 0 - beta";
const E_PVS = "  if (score > alpha && score < beta) {\n    score = 0 - negamax(position, remaining - 1, 0 - beta";
const EDITS = [
  ["src/search.ts", S_PVS, S_PVS.replace("if (score > alpha", "if (false && score > alpha")],
  ["src/engine.ts", E_PVS, E_PVS.replace("if (score > alpha", "if (false && score > alpha")],
];

// The clean tree is the build hop's own green run (`…82816ae6` item 3); only the mutant runs here.
for (const variant of ["pvsNoResearch"]) {
  const dir = join(scratch, `pvsnr-${variant}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  for (const f of ["src", "package.json", "tsconfig.json", "vitest.config.ts", "tools"]) {
    cpSync(join(repo, f), join(dir, f), { recursive: true });
  }
  symlinkSync(realpathSync(join(repo, "node_modules")), join(dir, "node_modules"));
  if (variant !== "clean") {
    for (const [f, from, to] of EDITS) {
      const file = join(dir, f);
      const text = readFileSync(file, "utf8");
      const n = text.split(from).length - 1;
      if (n !== 1) throw new Error(`${f}: pattern matched ${n} times`);
      writeFileSync(file, text.replace(from, to));
    }
  }
  const out = join(dir, "deep.json");
  const t = Date.now();
  spawnSync(
    "npx",
    ["vitest", "run", "--reporter=json", `--outputFile=${out}`, "src/search.pvs-lmr.test.ts", "src/search.test.ts", "-t", "PVS identity|mate floor|drift|A1 "],
    { cwd: dir, encoding: "utf8", env: { ...process.env, SEARCH_DEEP: "1" }, maxBuffer: 256 * 1024 * 1024 },
  );
  const r = JSON.parse(readFileSync(out, "utf8"));
  const rows = r.testResults.flatMap((f) =>
    f.assertionResults.map((a) => ({ file: f.name.split("/src/")[1], title: a.fullName, status: a.status })),
  );
  const failed = rows.filter((x) => x.status === "failed").map((x) => `${x.file} :: ${x.title}`);
  const watched = rows
    .filter((x) => /PVS identity|mate floor|drift|A1 /.test(x.title))
    .map((x) => `${x.status.padEnd(7)} ${x.file} :: ${x.title}`);
  console.log(JSON.stringify({ variant, s: Math.round((Date.now() - t) / 1000), total: rows.length, failed, watched }, null, 1));
}
