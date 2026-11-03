#!/usr/bin/env python3
# SCRATCH PROBE PATCH (arch-ABC-270). Applied to a `git archive` copy of main's src/ outside the repository.
# Adds K3 forms to src/evaluate.ts, selected at run time by setK3Form(egZero, queen):
#   egZero: the three king-file terms' endgame halves are 0 (scope 1, rule "0").
#   queen:  while the ENEMY has a queen, each king's exposure adds a queen-on pair equal to 2 x the base pair in force,
#           so the exposure is exactly 3 x in each half (scope 2, the ADR-0031 addendum A1 on E1's table).
# setK3Form(false, false) is main, node for node (the walk's `type === KING` test becomes `type >= QUEEN`, then
# KING / QUEEN inside; no value moves). Every path, the doors included, reads the form (as arch-E1's probe did).
import re, sys
p = sys.argv[1] + "/src/evaluate.ts"
s = open(p).read()
n0 = len(s)

def sub(old, new, count=1):
    global s
    assert s.count(old) == count, (old, s.count(old))
    s = s.replace(old, new)

sub("  pieceType,\n  ROOK,\n", "  pieceType,\n  QUEEN,\n  ROOK,\n")
# queen-on packed extras, and the form setter
sub("/** Mobility, outside the packed sum: weight mg, weight eg, cap mg, cap eg. */",
"""/** K3 PROBE: the queen-on extras, packed (shelter, half-open, open); 0 when the form is off. */
const PACKED_QTERMS = new Int32Array(3);
export const K3CFG = { egZero: false, queen: false };
/** K3 PROBE: select the form and rebuild the packed arrays. */
export function setK3Form(egZero: boolean, queen: boolean): void {
  K3CFG.egZero = egZero;
  K3CFG.queen = queen;
  const eg0 = (t: { readonly mg: number; readonly eg: number }) => (egZero ? { mg: t.mg, eg: 0 } : t);
  const params = {
    ...PARAMETERS,
    KING_SHELTER_MISSING: eg0(PARAMETERS.KING_SHELTER_MISSING),
    KING_FILE_HALF_OPEN: eg0(PARAMETERS.KING_FILE_HALF_OPEN),
    KING_FILE_OPEN: eg0(PARAMETERS.KING_FILE_OPEN),
  } as EvaluationParameters;
  loadParameters(params);
  const q = (t: { readonly mg: number; readonly eg: number }) => (queen ? pack(2 * t.mg, 2 * t.eg) : 0);
  PACKED_QTERMS[0] = q(params.KING_SHELTER_MISSING);
  PACKED_QTERMS[1] = q(params.KING_FILE_HALF_OPEN);
  PACKED_QTERMS[2] = q(params.KING_FILE_OPEN);
  clearPawnCacheForTest();
}
/** K3 PROBE: each king's exposure penalty, packed, as whiteMinusBlack computes it: [white king's, black king's]. */
export function exposurePackedForProbe(position: Position): [number, number] {
  const board = position.board;
  let wk = -1, bk = -1, wq = false, bq = false;
  for (let sq = 0; sq < 128; sq++) {
    if (sq & 0x88) continue;
    const pc = board[sq] as number;
    if (pc === 0) continue;
    const t = pieceType(pc);
    if (t === KING) { if (isBlack(pc)) bk = sq; else wk = sq; }
    if (t === QUEEN) { if (isBlack(pc)) bq = true; else wq = true; }
  }
  return [kingExposure(board, wk, PAWN, BLACK_PAWN, 1, bq), kingExposure(board, bk, BLACK_PAWN, PAWN, -1, wq)];
}
/** Mobility, outside the packed sum: weight mg, weight eg, cap mg, cap eg. */""")
# kingExposure: the enemy-queen flag
sub("""  enemyPawn: number,
  step: number,
): number {
  const kingFile = fileOf(king);""", """  enemyPawn: number,
  step: number,
  enemyQueen: boolean,
): number {
  const kingFile = fileOf(king);""")
sub("""  const shelterMissing = PACKED_TERMS[SHELTER_AT] as number;
  const fileHalfOpen = PACKED_TERMS[HALF_OPEN_AT] as number;
  const fileOpen = PACKED_TERMS[OPEN_AT] as number;""", """  const shelterMissing =
    (PACKED_TERMS[SHELTER_AT] as number) + (enemyQueen ? (PACKED_QTERMS[0] as number) : 0);
  const fileHalfOpen =
    (PACKED_TERMS[HALF_OPEN_AT] as number) + (enemyQueen ? (PACKED_QTERMS[1] as number) : 0);
  const fileOpen = (PACKED_TERMS[OPEN_AT] as number) + (enemyQueen ? (PACKED_QTERMS[2] as number) : 0);""")
# the walk gathers the queen flags inside the existing king test (one compare per non-pawn piece, as before)
sub("""  let blackKing = -1;
  let whitePawns = 0;""", """  let blackKing = -1;
  let whiteQueen = false;
  let blackQueen = false;
  let whitePawns = 0;""")
sub("""      if (type === KING) {
        if (black) blackKing = square;
        else whiteKing = square;
      }""", """      if (type >= QUEEN) {
        if (type === KING) {
          if (black) blackKing = square;
          else whiteKing = square;
        } else if (black) blackQueen = true;
        else whiteQueen = true;
      }""")
sub("""    kingExposure(board, blackKing, BLACK_PAWN, PAWN, -1) -
    kingExposure(board, whiteKing, PAWN, BLACK_PAWN, 1);""", """    kingExposure(board, blackKing, BLACK_PAWN, PAWN, -1, whiteQueen) -
    kingExposure(board, whiteKing, PAWN, BLACK_PAWN, 1, blackQueen);""")
# phase-24 identity helper for the probe: the mg sum is evaluateWithoutTaper's, untouched
open(p, "w").write(s)
print("patched", p, n0, "->", len(s))
