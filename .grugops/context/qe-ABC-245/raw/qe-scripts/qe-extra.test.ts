// qe-ABC-242 QE EXTRA rows (scratch only: copied into the plant tree's src/ by plant.mjs; never into the repository).
// They read bounds the lane cannot see, with SYNTHETIC key lists that no production caller hands in (every caller
// trims to <= 100 keys, `trimPriorKeys`). Informative: a plant they kill is a lane survivor, and the X rows say why.
// Root: QE's probe position with its halfmove clock set to 120, so the child d8e8 has clock 121 and every K offset
// down to -121 is inside the clock. K (the children's list) = prior (129 keys) + the root's key: |K| = 130.
import { describe, expect, it } from "vitest";
import { makeMove, unmakeMove } from "./apply.ts";
import { parseFen } from "./fen.ts";
import { repetitionKey } from "./gameend.ts";
import { legalMoves } from "./legal.ts";
import { createLevel, type Level, LEVELS } from "./levels.ts";
import { squareName } from "./position.ts";
import { virtualClock } from "./virtual-clock.ts";
import { zobristKey } from "./zobrist.ts";

const ROOT = "3k4/8/8/8/8/8/8/1Q2K3 b - - 120 80";
const forced: Level = { budgetMs: LEVELS[1].budgetMs, blunderRate: 1 };
const label = (m: { from: number; to: number }) => `${squareName(m.from)}${squareName(m.to)}`;

function childKey(): bigint {
  const p = parseFen(ROOT);
  const mv = legalMoves(p).find((m) => label(m) === "d8e8");
  if (mv === undefined) throw new Error("d8e8 not legal");
  const undo = makeMove(p, mv);
  const k = repetitionKey(p, zobristKey(p));
  unmakeMove(p, mv, undo);
  return k;
}

/** 129 synthetic prior keys (small integers never equal a 64-bit zobrist key), with the child's key at K offsets `at`. */
function priorWith(at: readonly number[]): bigint[] {
  const prior = Array.from({ length: 129 }, (_, i) => BigInt(i + 1));
  const k = childKey();
  for (const e of at) prior[130 + e] = k; // K = [...prior, rootKey]; K[130 + e] is prior[130 + e] for e <= -2
  return prior;
}

function d8e8Score(at: readonly number[]): number | undefined {
  const r = createLevel(forced, { seed: 1, now: virtualClock(10) })(parseFen(ROOT), priorWith(at));
  return r?.scored?.find((s) => label(s.move) === "d8e8")?.score;
}

describe("qe-ABC-242 extra — bounds the lane cannot see (synthetic lists)", () => {
  it("X1 cap: two matches only beyond -100 (at -102, -104) are never counted", () => {
    expect(d8e8Score([-102, -104])).not.toBe(0);
  });
  it("X2 cap edge: matches at -98 and -100 are both counted (third occurrence, 0)", () => {
    expect(d8e8Score([-98, -100])).toBe(0);
  });
  it("X3 straddle: one match inside (-100), one beyond (-102) is a second occurrence, not 0", () => {
    expect(d8e8Score([-100, -102])).not.toBe(0);
  });
  it("X4 walk start: a key at -2 is never read (with -4, one match: not 0); not game-reachable", () => {
    expect(d8e8Score([-2, -4])).not.toBe(0);
  });
});
