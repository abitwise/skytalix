// QE ABC-125 mutant runner. Run from the worktree root: node .grugops/context/qe-ABC-125/probe/mutants.mjs
// Plants each mutant in src/virtual-clock.ts, runs src/engine.test.ts (whole file, then the new row
// alone via -t), records exit code + failing row names, restores with `git checkout`. src/ is clean after.
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";

const VC = "src/virtual-clock.ts";
const ROW = "keeps each clock's own step";
const pristine = readFileSync(VC, "utf8");
const body = "  let reading = 0;\n  return () => {\n    const current = reading;\n    reading += stepMs;\n    return current;\n  };";
const head = "export function virtualClock";
const rep = (s, a, b) => { if (!s.includes(a)) throw new Error(`anchor missing: ${a}`); return s.replace(a, b); };

const mutants = [
  ["NONE-pristine", (s) => s],
  // build's M5, re-planted by QE: step in module state, LAST factory call wins
  ["M5-last-call-step-wins", (s) => rep(rep(s, body, "  sharedStep = stepMs;\n" + body.replace("reading += stepMs", "reading += sharedStep")), head, "let sharedStep = 1;\n" + head)],
  // the opposite the build left UNKNOWN: FIRST factory call's step wins (module lifetime)
  ["M5b-first-call-step-wins", (s) => rep(rep(s, body, "  sharedStep ??= stepMs;\n" + body.replace("reading += stepMs", "reading += sharedStep")), head, "let sharedStep: number | undefined;\n" + head)],
  // QE own: one module-level reading counter, per-clock step
  ["Q1-shared-reading-per-clock-step", (s) => rep(rep(s, body, body.replace("  let reading = 0;\n", "")), head, "let reading = 0;\n" + head)],
  // QE own: shared reading, reset by every factory call (a "fresh" clock that still shares)
  ["Q2-shared-reading-reset-per-factory", (s) => rep(rep(s, body, "  reading = 0;\n" + body.replace("  let reading = 0;\n", "")), head, "let reading = 0;\n" + head)],
  // QE own: step captured lazily at a clock's FIRST READ from module state (latest factory step)
  ["Q3-step-captured-at-first-read", (s) => rep(rep(s, body, "  sharedStep = stepMs;\n  let reading = 0;\n  let mine: number | undefined;\n  return () => {\n    mine ??= sharedStep;\n    const current = reading;\n    reading += mine;\n    return current;\n  };"), head, "let sharedStep = 1;\n" + head)],
];

const run = (extra) => {
  const r = spawnSync("npx", ["vitest", "run", "src/engine.test.ts", "--reporter=verbose", ...extra], { encoding: "utf8" });
  const out = (r.stdout ?? "") + (r.stderr ?? "");
  const failed = [...out.matchAll(/^\s*[×✗]\s+(.+?)(?:\s+\d+ms)?$/gm)].map((m) => m[1].trim());
  const tests = (out.match(/Tests\s+(.+)/) ?? [])[1]?.trim();
  const recv = (out.match(/Received[\s\S]{0,200}?\]/) ?? [])[0]?.replace(/\s+/g, " ");
  return { exit: r.status, tests, failed: [...new Set(failed)], received: recv };
};

const rows = [];
try {
  for (const [id, t] of mutants) {
    writeFileSync(VC, t(pristine));
    const whole = run([]);
    const alone = run(["-t", ROW]);
    rows.push({ id, whole, alone });
    console.log(JSON.stringify({ id, whole, alone }));
  }
} finally {
  execFileSync("git", ["checkout", "--", VC]);
  console.log("src status after:", JSON.stringify(execFileSync("git", ["status", "--porcelain", "--", "src"], { encoding: "utf8" })));
}
