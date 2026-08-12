// BA/PM's own lane builder for `refinement-ABC-028-shape`. Written from scratch against the
// worktree tip; no earlier hop's harness is run, repaired or re-pointed. Fresh unique root.
// Pinned by md5 to THIS tip — a mismatch REFUSES to measure rather than measuring a stale tree.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const WORKTREE = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-abc028-shape";
const HERE = dirname(new URL(import.meta.url).pathname);

const PINS = {
  "src/history-pane.ts": "c4653c4c263c4c417ea34969164ccd86",
  "src/history-pane.test.ts": "9533f05038780def980bf5a86707cdbd",
  "src/history-pane.nfr.test.ts": "16bf2f50c93e2e896b5406cbfa772b8b",
};

const md5 = (t) => createHash("md5").update(t).digest("hex");

function read(rel) {
  const text = readFileSync(join(WORKTREE, rel), "utf8");
  const want = PINS[rel];
  if (want !== undefined && md5(text) !== want) {
    throw new Error(`PIN MISMATCH ${rel}: ${md5(text)} != ${want} — REFUSING to measure`);
  }
  return text;
}

function replaceOnce(text, anchor, replacement, label) {
  const parts = text.split(anchor);
  if (parts.length !== 2) throw new Error(`anchor not unique (${parts.length - 1}x): ${label}`);
  return parts[0] + replacement + parts[1];
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
    writeFileSync(join(lane, "src/history-pane.ts"), editPane(read("src/history-pane.ts")));
  }
  // the two test files are pin-verified even when not edited, so the lane cannot be a stale tree
  read("src/history-pane.test.ts");
  read("src/history-pane.nfr.test.ts");
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

export { replaceOnce };
