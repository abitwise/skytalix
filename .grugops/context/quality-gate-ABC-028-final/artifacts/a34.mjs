// A3 and A4 re-broken ON THIS TIP. My earlier gate measured them on a tree that has since moved
// twice; a superseded verdict is not evidence. Each build is the delivered pane plus exactly ONE
// anchored edit, the anchor asserted unique, and output-identity checked before the suite verdict.
import { execFileSync } from "node:child_process";
import { copyFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { buildLane } from "./mk.mjs";
const HERE = dirname(new URL(import.meta.url).pathname);

const BUILDS = {
  // A3's build: the leading half-row correction applied at EVEN ply counts only.
  "WLEAD-ODD": (source, replaceOnce) =>
    replaceOnce(
      source,
      "  const leadingHalfRow = blackToMoveAtAnchor ? 1 : 0;",
      "  const leadingHalfRow = blackToMoveAtAnchor && plies % 2 === 0 ? 1 : 0;",
      "leadingHalfRow",
    ),
  // A4's calibration build: a scalar on the CALLER's position written mid-render and restored
  // before the render returns.
  WPOSMID: (source, replaceOnce) =>
    replaceOnce(
      source,
      "  const firstVisible = firstVisiblePly(moves.length, position.blackToMove);",
      [
        "  const firstVisible = firstVisiblePly(moves.length, position.blackToMove);",
        "  const __wasFullmove = history.position.fullmoveNumber;",
        "  history.position.fullmoveNumber = 0;",
        "  history.position.fullmoveNumber = __wasFullmove;",
      ].join("\n"),
      "firstVisible",
    ),
  // RISK-ABC028-01a's accepted survivor: a buffer-level write reverted with NO intervening access.
  WBOARDBLIND: (source, replaceOnce) =>
    replaceOnce(
      source,
      "  const firstVisible = firstVisiblePly(moves.length, position.blackToMove);",
      [
        "  const firstVisible = firstVisiblePly(moves.length, position.blackToMove);",
        "  const __alias = new Uint8Array(history.position.board.buffer);",
        "  const __wasByte = __alias[0] as number;",
        "  __alias[0] = 99;",
        "  __alias[0] = __wasByte;",
      ].join("\n"),
      "firstVisible (blind)",
    ),
};

for (const [name, edit] of Object.entries(BUILDS)) {
  const lane = buildLane(name, { editPane: edit });
  copyFileSync(join(HERE, "identity.ts"), join(lane, "__identity.ts"));
  let identity;
  try {
    identity = execFileSync("node", ["__identity.ts"], { cwd: lane, encoding: "utf8" }).trim();
  } catch (error) {
    identity = `THREW: ${String(error.stderr ?? "").split("\n")[0]}`;
  }
  let typecheck = 0;
  try {
    execFileSync("npx", ["tsc", "--noEmit"], { cwd: lane, stdio: "pipe" });
  } catch (error) {
    typecheck = error.status;
  }
  const report = join(lane, "__report.json");
  try {
    execFileSync("npx", ["vitest", "run", "--reporter=json", `--outputFile=${report}`], {
      cwd: lane, stdio: "pipe",
    });
  } catch { /* red is the point */ }
  const json = JSON.parse(readFileSync(report, "utf8"));
  const failed = json.testResults.flatMap((f) => f.assertionResults).filter((t) => t.status === "failed");
  console.log(`--- ${name}`);
  console.log(`    identity  ${identity}`);
  console.log(`    typecheck exit ${typecheck}`);
  console.log(`    full      ${failed.length} failed / ${json.numTotalTests} on ${json.testResults.length} files`);
  for (const test of failed) console.log(`      KILL  ${test.ancestorTitles.join(" > ")} > ${test.title}`);
}
