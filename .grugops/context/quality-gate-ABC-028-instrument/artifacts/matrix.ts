/**
 * The kill matrix, per mutant x per length, and the instrument's documented failure modes.
 * A criterion says "Given ANY of A1's ten lengths", so a kill at one length is not the answer.
 */
import type { GameHistory } from "../src/history.ts";
import type { Move } from "../src/moves.ts";
import { buildLengthCases } from "./fixtures.ts";
import { watchHistory } from "./graph-watch.ts";

import { renderHistory as WCLEAN } from "./mutants/WCLEAN/history-pane.ts";
import { renderHistory as WFENMID } from "./mutants/WFENMID/history-pane.ts";
import { renderHistory as WPOSMID } from "./mutants/WPOSMID/history-pane.ts";
import { renderHistory as WBOARDMID } from "./mutants/WBOARDMID/history-pane.ts";
import { renderHistory as WBOARDSET } from "./mutants/WBOARDSET/history-pane.ts";
import { renderHistory as WBOARDBUF } from "./mutants/WBOARDBUF/history-pane.ts";
import { renderHistory as WBOARDBLIND } from "./mutants/WBOARDBLIND/history-pane.ts";
import { renderHistory as WMOVESWAP } from "./mutants/WMOVESWAP/history-pane.ts";
import { renderHistory as WSPLICE } from "./mutants/WSPLICE/history-pane.ts";

type Pane = (history: GameHistory) => string[];
const PANES: readonly (readonly [string, Pane])[] = [
  ["WCLEAN", WCLEAN],
  ["WFENMID", WFENMID],
  ["WPOSMID", WPOSMID],
  ["WBOARDMID", WBOARDMID],
  ["WBOARDSET", WBOARDSET],
  ["WBOARDBUF", WBOARDBUF],
  ["WBOARDBLIND", WBOARDBLIND],
  ["WMOVESWAP", WMOVESWAP],
  ["WSPLICE", WSPLICE],
];

const LENGTHS = buildLengthCases().map(([plies]) => plies);
console.log(`=== KILL MATRIX — rows are builds, columns are A1's ten lengths ===`);
console.log(`  ${"".padEnd(11)}${LENGTHS.map((p) => String(p).padStart(6)).join("")}`);

for (const [name, pane] of PANES) {
  const cells: string[] = [];
  for (const [, history] of buildLengthCases()) {
    const watch = watchHistory(history);
    let threw = false;
    try {
      pane(watch.view);
    } catch {
      threw = true;
    }
    watch.finish();
    const kinds = new Set(watch.violations.map((v) => v.detector));
    const symbol =
      watch.violations.length === 0
        ? threw
          ? "THROW"
          : watch.samples > 0
            ? "clean"
            : "BLIND"
        : `${kinds.has("write-trap") ? "W" : ""}${kinds.has("board-digest") ? "D" : ""}`;
    cells.push(symbol.padStart(6));
  }
  console.log(`  ${name.padEnd(11)}${cells.join("")}`);
}
console.log("  legend: W = killed by the write trap, D = killed by the board digest, WD = both,");
console.log("          clean = no violation and the instrument LOOKED (samples > 0), BLIND = never looked");

// ------------------------------------------------------------------ arming counter per length
console.log("\n=== ARMING COUNTER on the DELIVERED pane — samples per length (must be > 0) ===");
const counts: string[] = [];
for (const [plies, history] of buildLengthCases()) {
  const watch = watchHistory(history);
  WCLEAN(watch.view);
  watch.finish();
  counts.push(`${plies}:${watch.samples}`);
}
console.log(`  ${counts.join("  ")}`);

// ------------------------------------------------------------- documented failure modes
console.log("\n=== DOCUMENTED FAILURE MODES of the proxied view (the honest limits) ===");
const probe = (label: string, thunk: (view: GameHistory) => void): void => {
  // A FRESH fixture per probe: two of these probes mutate the board and do not restore it, and a
  // shared fixture makes the next probe's baseline the previous probe's damage. (Found by this
  // harness reporting `fill(0)` clean on a board an earlier probe had already zeroed.)
  const control = buildLengthCases().find(([plies]) => plies === 20)?.[1] as GameHistory;
  const watch = watchHistory(control);
  let outcome = "no throw";
  try {
    thunk(watch.view);
  } catch (error) {
    outcome = `THROWS ${(error as Error).constructor.name}: ${(error as Error).message}`;
  }
  watch.finish();
  console.log(
    `  ${label.padEnd(42)} ${outcome}\n${" ".repeat(46)}violations=${watch.violations.length}` +
      ` [${[...new Set(watch.violations.map((v) => v.detector))].join(",") || "-"}]`,
  );
};

probe("read view.position.board[0]", (view) => void view.position.board[0]);
probe("read view.position.board.length", (view) => void view.position.board.length);
probe("iterate view.position.board", (view) => {
  for (const byte of view.position.board) void byte;
});
probe("view.position.board.set(other) — mutation", (view) => {
  view.position.board.set(new Uint8Array(128));
});
probe("view.position.board.fill(0) — mutation", (view) => {
  view.position.board.fill(0);
});
probe("toFen(view.position) — a real consumer", (view) => {
  void view.position;
});
probe("view.moves.length / view.moves[0] reads", (view) => {
  void view.moves.length;
  void (view.moves[0] as Move).from;
});
probe("view.moves.slice(0, 2) — a non-mutating method", (view) => void view.moves.slice(0, 2));
probe("Object.freeze(view.moves) — A9's instrument on top", (view) => {
  Object.freeze(view.moves);
});
