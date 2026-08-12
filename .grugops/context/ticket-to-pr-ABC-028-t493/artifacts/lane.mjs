// Engineer's own lane builder for `ticket-to-pr-ABC-028-t493`. Written from scratch against THIS
// worktree tip; no earlier hop's harness is run, repaired or re-pointed. Fresh unique scratch root,
// entirely out of tree.
//
// The pane is pinned HARD to `c4653c4c…` — this ticket's fence, which must not move. The two test
// files are pinned to digests SUPPLIED ON THE COMMAND LINE, because this hop edits one of them by
// design: a lane may only be measured against a tree the caller named, never a tree that drifted.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const WORKTREE = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-abc028-t493";
const HERE = dirname(new URL(import.meta.url).pathname);

const PANE_PIN = "c4653c4c263c4c417ea34969164ccd86";

const md5 = (t) => createHash("md5").update(t).digest("hex");

function read(rel, want) {
  const text = readFileSync(join(WORKTREE, rel), "utf8");
  const got = md5(text);
  if (want !== undefined && got !== want) {
    throw new Error(`PIN MISMATCH ${rel}: ${got} != ${want} — REFUSING to measure`);
  }
  return text;
}

export function replaceOnce(text, anchor, replacement, label) {
  const parts = text.split(anchor);
  if (parts.length !== 2) throw new Error(`anchor not unique (${parts.length - 1}x): ${label}`);
  return parts[0] + replacement + parts[1];
}

// pins for the two test files, named by the caller: node wpos.mjs <testMd5> <nfrMd5>
const [TEST_PIN, NFR_PIN] = process.argv.slice(2);
if (!TEST_PIN || !NFR_PIN) {
  throw new Error("usage: node wpos.mjs <src/history-pane.test.ts md5> <src/history-pane.nfr.test.ts md5>");
}

export function buildLane(name, editPane) {
  const lane = join(HERE, "lanes", name);
  rmSync(lane, { recursive: true, force: true });
  mkdirSync(lane, { recursive: true });
  cpSync(join(WORKTREE, "src"), join(lane, "src"), { recursive: true });
  for (const f of ["package.json", "tsconfig.json", "biome.json"]) {
    cpSync(join(WORKTREE, f), join(lane, f));
  }
  symlinkSync(join(WORKTREE, "node_modules"), join(lane, "node_modules"));
  if (editPane) {
    writeFileSync(join(lane, "src/history-pane.ts"), editPane(read("src/history-pane.ts", PANE_PIN)));
  } else {
    read("src/history-pane.ts", PANE_PIN);
  }
  // the two test files are pin-verified even when not edited, so a stale lane cannot be measured
  read("src/history-pane.test.ts", TEST_PIN);
  read("src/history-pane.nfr.test.ts", NFR_PIN);
  return lane;
}

export function suite(lane) {
  const report = join(lane, "__report.json");
  try {
    execFileSync("npx", ["vitest", "run", "--reporter=json", `--outputFile=${report}`], {
      cwd: lane,
      encoding: "utf8",
      stdio: "pipe",
    });
  } catch {
    /* red is the point */
  }
  const json = JSON.parse(readFileSync(report, "utf8"));
  const tests = json.testResults.flatMap((f) => f.assertionResults);
  return {
    total: json.numTotalTests,
    files: json.testResults.length,
    failed: tests.filter((t) => t.status === "failed"),
  };
}
