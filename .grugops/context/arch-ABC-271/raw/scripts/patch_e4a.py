# SCRATCH PROBE (arch-ABC-271): patches a `git archive` copy of main's src/ with E4a's three passer terms.
# Usage: python3 patch_e4a.py <copy root>. Exact-string edits; each must match once or the script stops.
# Forms are chosen at run time by the probe-only `setE4aForm(kd, fp, un)` (module state, probe only; the
# build uses a switch and doors instead). All forms off = main, value for value (I1 checks it).
import sys, pathlib

root = pathlib.Path(sys.argv[1])
ev = root / "src/evaluate.ts"
pp = root / "src/evaluate-params.ts"

def sub(text, old, new):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"match count {n} for: {old[:70]!r}")
    return text.replace(old, new)

# ---- the parameter table: the rule values (mg halves 0) ----
p = pp.read_text()
p += '''
/**
 * E4a (`ABC-271`, arch-ABC-271 probe): passed pawns read the kings and the path. Endgame halves only;
 * every middlegame half is 0, so phase 24 is E1 exactly. Indexed by the passer's OWN rank (1..6).
 * KING_ENEMY: per step of the enemy king's Chebyshev distance to the queening square, capped at 5:
 *   `PASSED.eg[R] / 10`. KING_OWN: per step of the own king's distance, subtracted: `floor(PASSED.eg[R] / 20)`.
 * FREE: every square ahead of the passer empty: `PASSED.eg[R] / 2`.
 * UNSTOPPABLE: phase 0, free path, defending king outside the square (side to move counted), once per side:
 *   `Q − (P + PASSED.eg[6] + FREE.eg[6] + 5 × KING_ENEMY.eg[6])` = 900 − (100 + 200 + 100 + 100) = 400.
 */
export const PASSED_KING_ENEMY: MgEg<readonly number[]> = {
  mg: [0, 0, 0, 0, 0, 0, 0, 0],
  eg: [0, 1, 2, 4, 7, 12, 20, 0],
};
export const PASSED_KING_OWN: MgEg<readonly number[]> = {
  mg: [0, 0, 0, 0, 0, 0, 0, 0],
  eg: [0, 0, 1, 2, 3, 6, 10, 0],
};
export const PASSED_FREE: MgEg<readonly number[]> = {
  mg: [0, 0, 0, 0, 0, 0, 0, 0],
  eg: [0, 5, 10, 20, 35, 60, 100, 0],
};
export const PASSED_UNSTOPPABLE: MgEg<number> = { mg: 0, eg: 400 };
'''
pp.write_text(p)

t = ev.read_text()

# ---- E4a arrays + probe-only form setter ----
t = sub(t, "/** Mobility, outside the packed sum: weight mg, weight eg, cap mg, cap eg. */\n",
"""/** E4a (probe): endgame halves only, by own rank; zero unless the probe form turns a term on. */
const KING_ENEMY_EG = new Int32Array(8);
const KING_OWN_EG = new Int32Array(8);
const FREE_EG = new Int32Array(8);
let UNSTOPPABLE_EG = 0;
let e4aForm: [boolean, boolean, boolean] = [false, false, false];
function loadE4a(parameters: EvaluationParameters): void {
  const [kd, fp, un] = e4aForm;
  for (let r = 0; r < 8; r++) {
    KING_ENEMY_EG[r] = kd ? (parameters.PASSED_KING_ENEMY.eg[r] as number) : 0;
    KING_OWN_EG[r] = kd ? (parameters.PASSED_KING_OWN.eg[r] as number) : 0;
    FREE_EG[r] = fp ? (parameters.PASSED_FREE.eg[r] as number) : 0;
  }
  UNSTOPPABLE_EG = un ? parameters.PASSED_UNSTOPPABLE.eg : 0;
}
/** PROBE ONLY: which E4a terms are on (king distance, free path, unstoppable). */
export function setE4aForm(kd: boolean, fp: boolean, un: boolean): void {
  e4aForm = [kd, fp, un];
  loadE4a(PARAMETERS);
}
/** Mobility, outside the packed sum: weight mg, weight eg, cap mg, cap eg. */
""")
t = sub(t, "  MOBILITY_TERMS[3] = parameters.MOBILITY_CAP.eg;\n}\n",
           "  MOBILITY_TERMS[3] = parameters.MOBILITY_CAP.eg;\n  loadE4a(parameters);\n}\n")

# ---- pawnStructure records the frontmost passer per file per side (3 bits a file: board rank, 0 none) ----
t = sub(t, "let passedPart = 0;\n", "let passedPart = 0;\nlet whitePassersPart = 0;\nlet blackPassersPart = 0;\n")
t = sub(t, "  let passed = 0;\n\n  for (let rank = 1; rank <= 6; rank++) {\n    for (let file = 0; file < 8; file++) {\n      const piece = board[rank * 16 + file];\n      const bit = 1 << file;",
           "  let passed = 0;\n  let whitePassers = 0;\n  let blackPassers = 0;\n\n  for (let rank = 1; rank <= 6; rank++) {\n    for (let file = 0; file < 8; file++) {\n      const piece = board[rank * 16 + file];\n      const bit = 1 << file;")
t = sub(t, "        if (isPassedPawn(board, square)) passed += PACKED_PASSED[rank] as number;\n",
           "        if (isPassedPawn(board, square)) {\n          passed += PACKED_PASSED[rank] as number;\n          whitePassers = (whitePassers & ~(7 << (3 * file))) | (rank << (3 * file));\n        }\n")
t = sub(t, "        if (isPassedPawn(board, square)) passed -= PACKED_PASSED[7 - rank] as number;\n",
           "        if (isPassedPawn(board, square)) {\n          passed -= PACKED_PASSED[7 - rank] as number;\n          if (((blackPassers >> (3 * file)) & 7) === 0) blackPassers |= rank << (3 * file);\n        }\n")
t = sub(t, "  passedPart = passed;\n  return doubled + isolated + passed;\n",
           "  passedPart = passed;\n  whitePassersPart = whitePassers;\n  blackPassersPart = blackPassers;\n  return doubled + isolated + passed;\n")

# ---- the memo stores the two passer words ----
t = sub(t, "const pawnCachePassed = new Int32Array(PAWN_CACHE_SLOTS);\n",
           "const pawnCachePassed = new Int32Array(PAWN_CACHE_SLOTS);\nconst pawnCacheWhitePassers = new Int32Array(PAWN_CACHE_SLOTS);\nconst pawnCacheBlackPassers = new Int32Array(PAWN_CACHE_SLOTS);\n")
t = sub(t, "  if (pawnCacheWhite[slot] === whiteMask && pawnCacheBlack[slot] === blackMask) {\n    return (",
           "  if (pawnCacheWhite[slot] === whiteMask && pawnCacheBlack[slot] === blackMask) {\n    whitePassersPart = pawnCacheWhitePassers[slot] as number;\n    blackPassersPart = pawnCacheBlackPassers[slot] as number;\n    return (")
t = sub(t, "  pawnCachePassed[slot] = passedPart;\n  return structure;\n",
           "  pawnCachePassed[slot] = passedPart;\n  pawnCacheWhitePassers[slot] = whitePassersPart;\n  pawnCacheBlackPassers[slot] = blackPassersPart;\n  return structure;\n")
t = sub(t, "    pawnCachePassed.byteLength\n  );\n",
           "    pawnCachePassed.byteLength +\n    pawnCacheWhitePassers.byteLength +\n    pawnCacheBlackPassers.byteLength\n  );\n")

# ---- the E4a computation, after the walk, outside the memo ----
t = sub(t, "/**\n * Score of a position from WHITE's point of view:",
"""/** Chebyshev distance between two 0x88 squares. */
const distance = (a: number, b: number): number => {
  const df = (a & 7) - (b & 7);
  const dr = (a >> 4) - (b >> 4);
  const f = df < 0 ? -df : df;
  const r = dr < 0 ? -dr : dr;
  return f > r ? f : r;
};

/**
 * E4a's endgame-half sum, white minus black: king distance (each king to the queening square, capped
 * at 5), free path (every square ahead empty), and in a pawn ending (phase 0) the unstoppable passer
 * (free path, the defending king outside the square, side to move counted), once per side.
 */
function passerKingPath(
  board: Uint8Array,
  whitePassers: number,
  blackPassers: number,
  whiteKing: number,
  blackKing: number,
  pawnEnding: boolean,
  blackToMove: boolean,
): number {
  let eg = 0;
  let whiteUnstoppable = false;
  let blackUnstoppable = false;
  for (let file = 0; file < 8; file++) {
    const wr = (whitePassers >> (3 * file)) & 7;
    if (wr !== 0) {
      const queen = 112 + file;
      eg +=
        (KING_ENEMY_EG[wr] as number) * Math.min(distance(blackKing, queen), 5) -
        (KING_OWN_EG[wr] as number) * Math.min(distance(whiteKing, queen), 5);
      let free = true;
      for (let at = wr * 16 + file + 16; at < 128; at += 16) {
        if (board[at] !== EMPTY) {
          free = false;
          break;
        }
      }
      if (free) {
        eg += FREE_EG[wr] as number;
        if (pawnEnding && !whiteUnstoppable) {
          const moves = wr === 1 ? 5 : 7 - wr;
          if (moves < distance(blackKing, queen) - (blackToMove ? 1 : 0)) whiteUnstoppable = true;
        }
      }
    }
    const br = (blackPassers >> (3 * file)) & 7;
    if (br !== 0) {
      const own = 7 - br;
      const queen = file;
      eg -=
        (KING_ENEMY_EG[own] as number) * Math.min(distance(whiteKing, queen), 5) -
        (KING_OWN_EG[own] as number) * Math.min(distance(blackKing, queen), 5);
      let free = true;
      for (let at = br * 16 + file - 16; at >= 0; at -= 16) {
        if (board[at] !== EMPTY) {
          free = false;
          break;
        }
      }
      if (free) {
        eg -= FREE_EG[own] as number;
        if (pawnEnding && !blackUnstoppable) {
          const moves = own === 1 ? 5 : 7 - own;
          if (moves < distance(whiteKing, queen) - (blackToMove ? 0 : 1)) blackUnstoppable = true;
        }
      }
    }
  }
  if (whiteUnstoppable) eg += UNSTOPPABLE_EG;
  if (blackUnstoppable) eg -= UNSTOPPABLE_EG;
  return eg;
}

/**
 * Score of a position from WHITE's point of view:""")

t = sub(t, "  let w = (phase > 24 ? 24 : phase) - PHASE_EG;\n  if (w < 0) w = 0;\n  else if (w > PHASE_SPAN) w = PHASE_SPAN;\n",
           "  let w = (phase > 24 ? 24 : phase) - PHASE_EG;\n  if (w < 0) w = 0;\n  else if (w > PHASE_SPAN) w = PHASE_SPAN;\n"
           "  // E4a (probe): endgame halves only, so skipped at w = D (value-identical while every E4a mg is 0).\n"
           "  if (w < PHASE_SPAN && (whitePassersPart | blackPassersPart) !== 0 && whiteKing !== -1 && blackKing !== -1) {\n"
           "    egDelta += passerKingPath(board, whitePassersPart, blackPassersPart, whiteKing, blackKing, phase === 0, position.blackToMove);\n"
           "  }\n")
ev.write_text(t)
print("patched", ev, pp)
