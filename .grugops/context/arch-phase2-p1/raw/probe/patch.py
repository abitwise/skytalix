import sys, re
root = sys.argv[1]
def sub(path, old, new, count=1):
    s = open(path).read()
    n = s.count(old)
    if n != count:
        raise SystemExit(f"{path}: expected {count} of {old[:60]!r}, found {n}")
    s = s.replace(old, new)
    open(path, "w").write(s)

sp = root + "/src/search.ts"
ep = root + "/src/engine.ts"

# --- search.ts: probe config + configurable predicate
sub(sp, "/** The least remaining depth, and the least 0-based index in the ordered list, a reduced move has. */",
"""/** SCRATCH PROBE ONLY (arch-phase2-p1). */
export const PROBE = {
  lmr: "flat" as "flat" | "log",
  base: 0.75, div: 2.25, minDepth: 3, minIndex: 3, pvLess: 1, killerLess: 1, clampMin: 1, maxR: 99, floorOne: false,
  fut: 0, futDepth: 2, nmpDiv: 0,
  count: false, tries: 0, reduced: 0, sumR: 0, hist: [0, 0, 0, 0, 0, 0, 0, 0] as number[], futPruned: 0,
};
/** The least remaining depth, and the least 0-based index in the ordered list, a reduced move has. */""")

sub(sp, """  atRoot: boolean,
): number {
  if (atRoot || depth < REDUCTION_MIN_DEPTH || index < REDUCTION_MIN_INDEX) return 0;
  if (move.captured !== EMPTY || move.promotion !== EMPTY) return 0;
  if (isInCheck(position)) return 0;
  return givesCheck(position, move) ? 0 : 1;
}""", """  atRoot: boolean,
  pvNode = false,
  killers: readonly Move[] = NO_KILLERS,
): number {
  const r = lmrProbe(position, move, depth, index, atRoot, pvNode, killers);
  if (PROBE.count && !atRoot && index > 0) {
    PROBE.tries++;
    if (r > 0) { PROBE.reduced++; PROBE.sumR += r; }
    PROBE.hist[Math.min(r, 7)]++;
  }
  return r;
}
function lmrProbe(position: Position, move: Move, depth: number, index: number, atRoot: boolean, pvNode: boolean, killers: readonly Move[]): number {
  if (PROBE.lmr === "flat") {
    if (atRoot || depth < REDUCTION_MIN_DEPTH || index < REDUCTION_MIN_INDEX) return 0;
    if (move.captured !== EMPTY || move.promotion !== EMPTY) return 0;
    if (isInCheck(position)) return 0;
    return givesCheck(position, move) ? 0 : 1;
  }
  if (atRoot || depth < PROBE.minDepth || index < PROBE.minIndex) return 0;
  if (move.captured !== EMPTY || move.promotion !== EMPTY) return 0;
  if (isInCheck(position)) return 0;
  if (givesCheck(position, move)) return 0;
  let r = Math.floor(PROBE.base + (Math.log(depth) * Math.log(index + 1)) / PROBE.div);
  if (pvNode) r -= PROBE.pvLess;
  if (PROBE.killerLess > 0 && killers.some((k) => sameMove(k, move))) r -= PROBE.killerLess;
  if (PROBE.floorOne && r < 1) r = 1;
  r = Math.min(r, PROBE.maxR, depth - 1 - PROBE.clampMin);
  return r > 0 ? r : 0;
}
/** SCRATCH: P3 futility test for a node. */
export function futileNode(position: Position, depth: number, ply: number, alpha: number, beta: number): boolean {
  if (PROBE.fut <= 0 || ply === 0 || alpha + 1 !== beta || depth > PROBE.futDepth) return false;
  if (alpha >= MATE_FLOOR || alpha <= 0 - MATE_FLOOR) return false;
  if (isInCheck(position)) return false;
  return evaluate(position) + PROBE.fut * depth <= alpha;
}
export function futileMove(position: Position, move: Move): boolean {
  if (move.captured !== EMPTY || move.promotion !== EMPTY) return false;
  if (givesCheck(position, move)) return false;
  PROBE.futPruned++;
  return true;
}""")

sub(sp, "  return passesZugzwangGuard(position) ? NULL_MOVE_REDUCTION : 0;\n}",
"  if (!passesZugzwangGuard(position)) return 0;\n  return PROBE.nmpDiv > 0 ? NULL_MOVE_REDUCTION + Math.floor(depth / PROBE.nmpDiv) : NULL_MOVE_REDUCTION;\n}")

# search.ts negamax call site + futility
sub(sp, """  let index = 0;
  for (const move of ordered(moves, ply, switches, killers, hashMove)) {
    const reduction = switches.reductions
      ? lateMoveReduction(position, move, depth, index, false)
      : 0;""", """  let index = 0;
  const futile = switches.reverseFutility && futileNode(position, depth, ply, alphaIn, beta);
  for (const move of ordered(moves, ply, switches, killers, hashMove)) {
    if (futile && index > 0 && futileMove(position, move)) { index++; continue; }
    const reduction = switches.reductions
      ? lateMoveReduction(position, move, depth, index, false, alphaIn + 1 !== beta, killers.at(ply))
      : 0;""")

# --- engine.ts
sub(ep, "  reverseFutilityCut,\n", "  reverseFutilityCut,\n  futileNode,\n  futileMove,\n")
sub(ep, """  let index = 0;
  for (const move of orderMoves(moves, budget.killers.at(ply), hashMove)) {
    const reduction = budget.reductions
      ? lateMoveReduction(position, move, remaining, index, false)
      : 0;""", """  let index = 0;
  const futile = budget.reverseFutility && futileNode(position, remaining, ply, alphaIn, beta);
  for (const move of orderMoves(moves, budget.killers.at(ply), hashMove)) {
    if (futile && index > 0 && futileMove(position, move)) { index++; continue; }
    const reduction = budget.reductions
      ? lateMoveReduction(position, move, remaining, index, false, alphaIn + 1 !== beta, budget.killers.at(ply))
      : 0;""")
print("patched")
