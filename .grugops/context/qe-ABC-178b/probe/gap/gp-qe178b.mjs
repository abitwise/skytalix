// qe-ABC-178b: gp-qe178.mjs (d781e5e5, sha256 12c0b8db…) plus QP1d/QP1e. qe-ABC-177 gap probes (NOT the frozen A6 list; not used for parity). Usage: node gp.mjs <tree> <label> <file|lane> [ids]
import { readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
const [tree, label, mode, ids] = process.argv.slice(2);
const only = ids?.split(",");
const E = "src/engine.ts", U = "src/uci-session.ts";
const P = [
  { id: "QP0", what: "control (no change)", file: E, from: null },
  { id: "QP1", what: "fold attack: `held` hoisted to module scope (cross-session state)", file: U,
    edits: [["  let held: string | null = null;\n", ""], ["export function createUciSession(", "let held: string | null = null;\nexport function createUciSession("]] },
  { id: "QP2", what: "mid-iteration time abort disarmed (countNode still reads the clock, never aborts on time)", file: E,
    edits: [["if (budget.now() >= budget.deadline || budget.nodes >= budget.maxNodes) throw ABORTED;", "if (budget.now() >= Number.POSITIVE_INFINITY || budget.nodes >= budget.maxNodes) throw ABORTED;"]] },
  { id: "QP3", what: "loop-top deadline test removed (clock still read; only mid-iteration aborts stop the search)", file: E,
    edits: [["    now() < budget.deadline &&\n", "    (now(), true) &&\n"]] },
  { id: "QP4", what: "U8: transposition table not cleared per chooseMove (state leaks across searches and sessions)", file: E,
    edits: [["\n  clearTable();\n", "\n  // clearTable();\n"]] },
  { id: "QP4b", what: "U8: transposition table never cleared after its first allocation (entries leak across searches and sessions)", file: "src/transposition.ts",
    edits: [["  }\n  words.fill(0);\n}", "  }\n}"]] },
  { id: "QP5", what: "U7 blind band: level-5 budget cut 3000 -> 2500 (G inside one step-1000 interval)", file: "src/levels.ts",
    edits: [["5: Object.freeze({ budgetMs: 3_000, blunderRate: 0 }),", "5: Object.freeze({ budgetMs: 2_500, blunderRate: 0 }),"]] },
  { id: "QP6", what: "U7 own path: a dropped depth/nodes/mate token with no time token shortens G to 2500 ms", file: U,
    edits: [["        warn(\`go \${keyword} needs an integer >= 1, got \${text ?? \"nothing\"}; ignored\`);\n", "        warn(\`go \${keyword} needs an integer >= 1, got \${text ?? \"nothing\"}; ignored\`);\n        clock.dropped = 1;\n"],
            ["  let budget: number = HARD_CEILING_MS;\n", "  let budget: number = clock.dropped && clock.wtime === undefined && clock.btime === undefined && clock.movetime === undefined ? 2_500 : HARD_CEILING_MS;\n"]] },
  { id: "QP1a", what: "qe-ABC-178 variant: a hold leaks across sessions only through ponderhit (module-scope copy, cleared on a real release)", file: U,
    edits: [["export function createUciSession(", "let leaked: string | null = null;\nexport function createUciSession("],
            ["    held = null;\n    write(line);\n", "    held = null;\n    leaked = null;\n    write(line);\n"],
            ["    if (request.hold) held = answer;\n", "    if (request.hold) { held = answer; leaked = answer; }\n"],
            ["        case \"stop\":\n        case \"ponderhit\":\n          release();\n          break;\n", "        case \"stop\":\n          release();\n          break;\n        case \"ponderhit\":\n          if (held === null && leaked !== null) { write(leaked); leaked = null; }\n          release();\n          break;\n"]] },
  { id: "QP1b", what: "qe-ABC-178 variant: a hold leaks across sessions only after a session's second go infinite/ponder hold", file: U,
    edits: [["export function createUciSession(", "let leaked: string | null = null;\nexport function createUciSession("],
            ["  let held: string | null = null;\n", "  let held: string | null = null;\n  let holds = 0;\n"],
            ["    held = null;\n    write(line);\n", "    held = null;\n    leaked = null;\n    write(line);\n"],
            ["    if (request.hold) held = answer;\n", "    if (request.hold) { held = answer; holds += 1; if (holds >= 2) leaked = answer; }\n"],
            ["        case \"stop\":\n        case \"ponderhit\":\n          release();\n          break;\n", "        case \"stop\":\n        case \"ponderhit\":\n          if (held === null && leaked !== null) { write(leaked); leaked = null; }\n          release();\n          break;\n"]] },
  { id: "QP1c", what: "qe-ABC-178 variant: a fresh session's stop/ponderhit releases the other session's hold into the HOLDER's stream", file: U,
    edits: [["export function createUciSession(", "let lastRelease: (() => void) | null = null;\nexport function createUciSession("],
            ["    if (request.hold) held = answer;\n", "    if (request.hold) { held = answer; lastRelease = release; }\n"],
            ["        case \"stop\":\n        case \"ponderhit\":\n          release();\n          break;\n", "        case \"stop\":\n        case \"ponderhit\":\n          if (held === null && lastRelease !== null) { const other = lastRelease; lastRelease = null; other(); }\n          release();\n          break;\n"]] },
  { id: "QP1d", what: "qe-ABC-178b variant: a fresh session's position/go/ucinewgame (not stop/ponderhit) releases the other session's hold into the HOLDER's stream", file: U,
    edits: [["export function createUciSession(", "let lastRelease: (() => void) | null = null;\nexport function createUciSession("],
            ["    if (request.hold) held = answer;\n", "    if (request.hold) { held = answer; lastRelease = release; }\n"],
            ["    write(line);\n  };\n\n  const go = (tokens: readonly string[]): void => {\n", "    write(line);\n  };\n  const crossRelease = (): void => { if (held === null && lastRelease !== null) { const other = lastRelease; lastRelease = null; other(); } };\n\n  const go = (tokens: readonly string[]): void => {\n"],
            ["    release();\n    const request = parseGo(", "    crossRelease();\n    release();\n    const request = parseGo("],
            ["        case \"ucinewgame\":\n          release();\n", "        case \"ucinewgame\":\n          crossRelease();\n          release();\n"],
            ["        case \"position\": {\n          release();\n", "        case \"position\": {\n          crossRelease();\n          release();\n"]] },
  { id: "QP1e", what: "qe-ABC-178b variant: constructing a fresh session releases the other session's hold into the HOLDER's stream (no keyword)", file: U,
    edits: [["export function createUciSession(", "let lastRelease: (() => void) | null = null;\nexport function createUciSession("],
            ["    if (request.hold) held = answer;\n", "    if (request.hold) { held = answer; lastRelease = release; }\n"],
            ["    write(line);\n  };\n\n  const go = (tokens: readonly string[]): void => {\n", "    write(line);\n  };\n  if (lastRelease !== null) { const other = lastRelease; lastRelease = null; other(); }\n\n  const go = (tokens: readonly string[]): void => {\n"]] },
];
const out = `${process.cwd()}/gp-${label}-${mode}.jsonl`;
function run(id) {
  const json = `${tree}/.test-results/last-run.json`;
  rmSync(json, { force: true });
  const t0 = Date.now();
  const r = mode === "lane"
    ? spawnSync("npm", ["test"], { cwd: tree, encoding: "utf8", maxBuffer: 64 << 20 })
    : spawnSync(process.execPath, ["tools/grugops/run-bounded.js", "120000", process.execPath, "node_modules/vitest/vitest.mjs", "run", "src/uci-session.test.ts", "--reporter=json", `--outputFile=${json}`],
        { cwd: tree, encoding: "utf8", maxBuffer: 64 << 20, env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=400" } });
  const res = { id, exit: r.status, s: ((Date.now() - t0) / 1000).toFixed(1), total: null, failed: [] };
  if (existsSync(json)) {
    const j = JSON.parse(readFileSync(json, "utf8"));
    res.total = j.numTotalTests; res.passed = j.numPassedTests; res.skipped = (j.numPendingTests ?? 0) + (j.numTodoTests ?? 0);
    for (const f of j.testResults) for (const a of f.assertionResults) if (a.status === "failed") res.failed.push(`${f.name.replace(/^.*\/src\//, "src/")} :: ${a.fullName}`);
    for (const f of j.testResults) if (f.status === "failed" && f.assertionResults.every((a) => a.status !== "failed")) res.failed.push(`${f.name} :: SUITE ${String(f.message).slice(0, 120)}`);
  } else res.note = "no JSON (bound crossed or crash)";
  return res;
}
for (const p of P) {
  if (only && !only.includes(p.id)) continue;
  const path = `${tree}/${p.file}`; const pristine = readFileSync(path, "utf8");
  let m = pristine;
  for (const [a, b] of p.edits ?? []) { if (m.split(a).length !== 2) { console.log(p.id, "ANCHOR COUNT", m.split(a).length - 1); process.exit(4); } m = m.replace(a, () => b); }
  writeFileSync(path, m);
  let res; try { res = run(p.id); } finally { writeFileSync(path, pristine); }
  if (readFileSync(path, "utf8") !== pristine) { console.log("RESTORE FAILED", p.id); process.exit(3); }
  res.what = p.what;
  writeFileSync(out, JSON.stringify(res) + "\n", { flag: "a" });
  console.log(`${p.id} exit=${res.exit} ${res.s}s total=${res.total} failed=${res.failed.length} ${res.note ?? ""}`);
  for (const f of res.failed) console.log("   ", f);
}
