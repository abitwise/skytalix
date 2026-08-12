// lane.mjs — the pinned mutant lane for `quality-gate-ABC-028-regate`.
//
// Written from scratch against the MERGED tip `0ee148e`. It pins ALL THREE pane files HARD,
// because this hop edits none of them permanently: a lane may only be measured against the tree
// it was pinned to, and a rig that fails OPEN is not a pin. Every edit is anchored and its anchor
// is asserted UNIQUE before it is applied — an edit that matches twice is a different edit.
//
// It writes nothing into the repository: it operates on a detached scratch git worktree whose
// path arrives in WT, and it restores every file it touched from an in-memory pristine copy in a
// `finally`, then re-verifies the pins.
//
// Usage:  WT=<worktree> node lane.mjs            (self-test: pins + null control only)
//         imported: `runBuild(name, edits)`      (one measured build)

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

export const WT = process.env.WT;
if (!WT) throw new Error("WT (the scratch worktree path) is required");

export const PINS = {
  "src/history-pane.ts": "c4653c4c263c4c417ea34969164ccd86",
  "src/history-pane.test.ts": "1b23df27a9a67ef0ed359dd33456ee1b",
  "src/history-pane.nfr.test.ts": "16bf2f50c93e2e896b5406cbfa772b8b",
};

const md5 = (s) => createHash("md5").update(s).digest("hex");
const read = (rel) => readFileSync(join(WT, rel), "utf8");
const write = (rel, s) => writeFileSync(join(WT, rel), s);

export function assertPins() {
  for (const [rel, want] of Object.entries(PINS)) {
    const got = md5(read(rel));
    if (got !== want) throw new Error(`PIN MISMATCH ${rel}: ${got} != ${want} — REFUSING to measure`);
  }
}

/** Apply one anchored edit. The anchor MUST occur exactly once, or the edit is refused. */
function applyEdit(source, { find, replace }) {
  const hits = source.split(find).length - 1;
  if (hits !== 1) throw new Error(`ANCHOR NOT UNIQUE (${hits} hits) — REFUSING: ${find.slice(0, 70)}`);
  return source.replace(find, replace);
}

/**
 * Run the WHOLE suite against `edits`. Returns the parsed counts and the names of every failing
 * test, so a build's kills are read off the run rather than inferred from a total.
 */
export function runBuild(name, edits, { only } = {}) {
  assertPins();
  const pristine = new Map();
  for (const e of edits) if (!pristine.has(e.file)) pristine.set(e.file, read(e.file));
  try {
    const staged = new Map();
    for (const e of edits) staged.set(e.file, applyEdit(staged.get(e.file) ?? pristine.get(e.file), e));
    for (const [rel, s] of staged) write(rel, s);

    const args = ["vitest", "run", "--reporter=json"];
    if (only) args.push(only);
    let out = "";
    try {
      out = execFileSync("npx", args, { cwd: WT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 28 });
    } catch (err) {
      out = err.stdout ?? ""; // a red suite exits non-zero; the JSON is still on stdout
    }
    const json = JSON.parse(out.slice(out.indexOf("{")));
    const failures = [];
    for (const f of json.testResults ?? []) {
      for (const a of f.assertionResults ?? []) {
        if (a.status === "failed") failures.push(`${f.name.split("/").pop()} :: ${a.title}`);
      }
    }
    return {
      name,
      total: json.numTotalTests,
      passed: json.numPassedTests,
      failed: json.numFailedTests,
      pending: json.numPendingTests + json.numTodoTests,
      files: (json.testResults ?? []).length,
      failures,
    };
  } finally {
    for (const [rel, s] of pristine) write(rel, s);
    assertPins(); // the restore is VERIFIED, not assumed
  }
}

export function report(r) {
  const lane = r.name.padEnd(26);
  console.log(`${lane} ${String(r.failed).padStart(2)} failed / ${r.total} on ${r.files} files  (skip ${r.pending})`);
  for (const f of r.failures) console.log(`      FAIL  ${f}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  assertPins();
  console.log("PINS OK — all three pane files match the merged tip 0ee148e");
  report(runBuild("NULL CONTROL (no mutant)", [
    { file: "src/history-pane.ts", find: "const BLANK_ROW =", replace: "const BLANK_ROW =" },
  ]));
}
