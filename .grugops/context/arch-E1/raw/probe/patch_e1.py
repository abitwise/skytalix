# arch-E1: scratch probe patch on `git archive <main a2b593d5> src package.json` (src tree 58fa3eb4, futility in force).
# Adds E1's two folded value changes behind a probe config (E1CFG.on = 0 is main, node for node):
#   - the king's endgame half: 40 - 15 * m, m = Manhattan distance to the nearest of d4, e4, d5, e5 (ABC-205's rule,
#     ADR-0031 addendum, accepted not shipped); the middlegame half is today's KING_TABLE;
#   - passed pawns' endgame half: 2 x today's PASSED_PAWN_BONUS (so the endgame passed sum is 2 x the memo's part);
#   - every other term: endgame half = middlegame half (wired, no value change).
# Phase: N 1, B 1, R 2, Q 4 over both sides, clamped to 24; blend weight w = clamp(phase - phEg, 0, phMg - phEg),
# D = phMg - phEg; score = mg + trunc(delta * (D - w) / D), delta = eg - mg over the terms whose halves differ. This
# equals trunc((mg * w + eg * (D - w)) / D) bit for bit (mg is an integer), and trunc is odd, so the mirror stays exact.
# Counters (E1CFG.count): evaluate calls, pieces and pawns walked, squares reached by mobility, for the per-node work
# proxy. No timing anywhere.
import sys
root = sys.argv[1]
def sub(path, old, new, count=1):
    s = open(path).read()
    n = s.count(old)
    if n != count:
        raise SystemExit(f"{path}: expected {count} of {old[:60]!r}, found {n}")
    open(path, "w").write(s.replace(old, new))

ev = root + "/src/evaluate.ts"

sub(ev, "/** Indexed by `pieceType`, exactly like PIECE_VALUE. Index 0 is EMPTY and is never read. */",
"""/** SCRATCH PROBE ONLY (arch-E1). on = 0 is main, node for node. */
export const E1CFG = { on: 0, phMg: 24, phEg: 0, count: 0, calls: 0, pieces: 0, pawns: 0, reach: 0 };
const PHASE_W: readonly number[] = [0, 0, 1, 1, 2, 4, 0];
/** King endgame half minus middlegame half, rank-8-first like the tables. */
const KING_EG_DELTA = new Int32Array(64);
for (let i = 0; i < 64; i++) {
  const r = 7 - (i >> 3);
  const f = i & 7;
  const df = f < 3 ? 3 - f : f > 4 ? f - 4 : 0;
  const dr = r < 3 ? 3 - r : r > 4 ? r - 4 : 0;
  KING_EG_DELTA[i] = 40 - 15 * (df + dr) - (KING_TABLE[i] as number);
}
export const KING_EG_DELTA_FOR_PROBE = KING_EG_DELTA;

/** Indexed by `pieceType`, exactly like PIECE_VALUE. Index 0 is EMPTY and is never read. */""")

sub(ev, """  let pawnSlotWord = 0;

  for (let rank = 7; rank >= 0; rank--) {""",
"""  let pawnSlotWord = 0;
  let phase = 0;
  let egDelta = 0;
  const e1 = E1CFG.on;
  if (E1CFG.count) E1CFG.calls++;

  for (let rank = 7; rank >= 0; rank--) {""")

sub(ev, """      score += black ? -value : value;
""",
"""      score += black ? -value : value;
      if (E1CFG.count) {
        E1CFG.pieces++;
        if (type === PAWN) E1CFG.pawns++;
      }
      if (e1) {
        if (type === KING) {
          const d = KING_EG_DELTA[tableIndex] as number;
          egDelta += black ? -d : d;
        } else phase += PHASE_W[type] as number;
      }
""")

# Counter only (added after batch A, where this sub was missing and reachPerCall read 0; no value is touched).
sub(ev, """      const reached = squaresReached(board, square, piece);
""", """      const reached = squaresReached(board, square, piece);
      if (E1CFG.count) E1CFG.reach += reached;
""")

sub(ev, """  return score + (structure + passedPart) + kingSafety + mobilityScore;
}""",
"""  const total = score + (structure + passedPart) + kingSafety + mobilityScore;
  if (!e1) return total;
  egDelta += passedPart;
  const D = E1CFG.phMg - E1CFG.phEg;
  let w = (phase > 24 ? 24 : phase) - E1CFG.phEg;
  if (w < 0) w = 0;
  if (w > D) w = D;
  return total + Math.trunc((egDelta * (D - w)) / D);
}""")
print("patched", ev)
