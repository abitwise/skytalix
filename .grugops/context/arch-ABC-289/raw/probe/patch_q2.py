# arch-ABC-289: scratch probe patch for Q2 (delta pruning in quiescence) on `git archive <main> src package.json`
# (main 0cc9afd1: Q1 seePruning, ABC-283 bundle, ABC-271 structure). Defaults (DP.d 0) = main, node for node.
# Knobs (DP in quiescence.ts):
#   d: 0 off | 1 on. Acts only where `skipLosing` is true, i.e. the stand-pat branch of a record with seePruning on, so
#      every door older than Q1 and every caller-built record is untouched.
#   dMargin: the margin in cp. dBound: a skip raises `best` to standPat + victim + margin (fail-soft bound) in place of
#      leaving it. dCheck: a capture that gives check is never skipped. dPhase: off at a node of phase <= dPhase.
#   count: premise counters. qAudit: every Nth node with a delta skip is logged (information only).
# The rule tests a capture (`captured` set, no promotion), before `isLosingCapture`:
#   standPat + ORDER_VALUE[victim] + dMargin <= alpha, alpha being the loop's current alpha.
import sys
root = sys.argv[1]
def sub(path, old, new, count=1):
    s = open(path).read()
    n = s.count(old)
    if n != count:
        raise SystemExit(f"{path}: expected {count} of {old[:70]!r}, found {n}")
    open(path, "w").write(s.replace(old, new))

qp = root + "/src/quiescence.ts"
pp = root + "/src/see.ts"

# see.ts: a call counter (a deterministic stand-in for the per-node cost; no timing is read)
sub(pp, "export function see(position: Position, move: Move): number {\n  const board = position.board;",
        "export const SEE_CALLS = { n: 0 };\nexport function see(position: Position, move: Move): number {\n  SEE_CALLS.n++;\n  const board = position.board;")

sub(qp, 'import { isInCheck, legalCaptures, legalCapturesAndQueenPromotions, legalMoves } from "./legal.ts";',
        'import { givesCheck, isInCheck, legalCaptures, legalCapturesAndQueenPromotions, legalMoves } from "./legal.ts";\nimport { toFen } from "./fen.ts";')
sub(qp, 'const ORDER_VALUE: readonly number[] = [0, 100, 320, 330, 500, 900, 0];', '''const ORDER_VALUE: readonly number[] = [0, 100, 320, 330, 500, 900, 0];

/** SCRATCH PROBE knobs and counters (arch-ABC-289). Defaults = main. */
export const DP = {
  d: 0, dMargin: 200, dBound: false, dCheck: false, dPhase: -1,
  count: false, qNodes: 0, capReached: 0, seeSkipped: 0, capSearched: 0,
  candOverlap: 0, candOnly: 0, candOnlyRefuted: 0, candOnlyRaised: 0, candOnlyRaisedMate: 0, candOnlyNodes: 0,
  candOnlyCheck: 0, candOnlyRaisedCheck: 0, candOnlyMateBand: 0, maxRaise: 0,
  skipped: 0, skippedSeeLosing: 0, skipByQply: [0, 0, 0, 0, 0, 0, 0, 0, 0], rowFired: 0,
  qAudit: 0, qFired: 0, qLog: [] as { fen: string; alpha: number; beta: number; qply: number; ply: number }[],
};''')
sub(qp, "  if (qply > 0) visit(qply);\n", "  if (qply > 0) visit(qply);\n  if (DP.count) DP.qNodes++;\n  const dpAlpha0 = alpha;\n")
sub(qp, "  let skipLosing = false;\n", "  let skipLosing = false;\n  let dpStand = 0;\n")
sub(qp, "    skipLosing = rules.seePruning === true;\n", "    skipLosing = rules.seePruning === true;\n    dpStand = standPat;\n")
sub(qp, """  for (const move of moves) {
    // Only on the stand-pat branch (`ADR-0069` decision 1): in check every evasion is searched.
    if (skipLosing && isLosingCapture(position, move)) continue;
    const undo = makeMove(position, move);""", """  let dpMarked = false;
  for (const move of moves) {
    let dpCand = false;
    if (skipLosing && move.captured !== 0 && move.promotion === 0) {
      if (DP.count) DP.capReached++;
      const bound = dpStand + (ORDER_VALUE[pieceType(move.captured)] as number) + DP.dMargin;
      if (bound <= alpha && phase > DP.dPhase) {
        dpCand = true;
        if (DP.d === 1 && !(DP.dCheck && givesCheck(position, move))) {
          if (DP.dBound && bound > best) best = bound;
          if (DP.count) {
            DP.skipped++;
            DP.skipByQply[qply] = (DP.skipByQply[qply] as number) + 1;
            if (isLosingCapture(position, move)) DP.skippedSeeLosing++;
          }
          if (!dpMarked && DP.qAudit > 0) {
            dpMarked = true;
            DP.qFired++;
            if (DP.qFired % DP.qAudit === 0) DP.qLog.push({ fen: toFen(position), alpha: dpAlpha0, beta, qply, ply });
          }
          continue;
        }
      }
    }
    // Only on the stand-pat branch (`ADR-0069` decision 1): in check every evasion is searched.
    const dpLosing = skipLosing && isLosingCapture(position, move);
    if (DP.count && dpCand && dpLosing) DP.candOverlap++;
    if (dpLosing) {
      if (DP.count) DP.seeSkipped++;
      continue;
    }
    const dpOnly = DP.count && dpCand;
    const dpBefore = DP.qNodes;
    const dpAlpha = alpha;
    const dpCheck = dpOnly && givesCheck(position, move);
    const undo = makeMove(position, move);""")
sub(qp, """    } finally {
      unmakeMove(position, move, undo);
    }

    if (score > best) best = score;""", """    } finally {
      unmakeMove(position, move, undo);
    }
    if (DP.count && skipLosing && move.captured !== 0 && move.promotion === 0) DP.capSearched++;
    if (dpOnly) {
      DP.candOnly++;
      DP.candOnlyNodes += DP.qNodes - dpBefore;
      if (dpCheck) DP.candOnlyCheck++;
      if (dpAlpha >= 20000) DP.candOnlyMateBand++;
      if (score <= dpAlpha) DP.candOnlyRefuted++;
      else {
        DP.candOnlyRaised++;
        if (dpCheck) DP.candOnlyRaisedCheck++;
        if (Math.abs(score) >= 20000) DP.candOnlyRaisedMate++;
        else if (score - dpAlpha > DP.maxRaise) DP.maxRaise = score - dpAlpha;
      }
    }

    if (score > best) best = score;""")
print("patched q2")
