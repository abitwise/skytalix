# arch-post-268: scratch probe patch on `git archive <main e72487e1 tree> src package.json` (futility in force).
# It is arch-ADR-0060-reopen's patch_reopen.py, re-anchored on today's call sites (each now sits after the
# futility skip), plus a sampling hook for ADR-0061's cut audit (information only). Defaults = main, node for node.
import sys
root = sys.argv[1]
def sub(path, old, new, count=1):
    s = open(path).read()
    n = s.count(old)
    if n != count:
        raise SystemExit(f"{path}: expected {count} of {old[:60]!r}, found {n}")
    open(path, "w").write(s.replace(old, new))

sp = root + "/src/search.ts"
ep = root + "/src/engine.ts"

sub(sp, 'import { zobristKey, zobristKeyAfterMove, zobristKeyAfterNullMove } from "./zobrist.ts";',
'''import { zobristKey, zobristKeyAfterMove, zobristKeyAfterNullMove } from "./zobrist.ts";
import { toFen } from "./fen.ts";''')

# --- search.ts: probe config + configurable predicate (patch_reopen.py's, unchanged) + audit hook
sub(sp, "/** The least remaining depth, and the least 0-based index in the ordered list, a reduced move has. */",
"""/** SCRATCH PROBE ONLY (arch-post-268, main e72487e1 base). Defaults = main. */
export const PROBE = {
  lmr: "flat" as "flat" | "log",
  base: 0.75, div: 2.25, minDepth: 3, minIndex: 3, pvLess: 1, killerLess: 1, clampMin: 1, maxR: 99, pvMaxR: 99, floorOne: false,
  fut: 0, futDepth: 2, nmpDiv: 0,
  count: false, tries: 0, reduced: 0, sumR: 0, hist: [0, 0, 0, 0, 0, 0, 0, 0] as number[], futPruned: 0,
  audit: 0, auditMaxDepth: 99, fired: 0, auditLog: [] as { kind: string; fen: string; depth: number; alpha: number; beta: number }[],
};
/** Audit: a null-window node where the head's reduction differs from main's flat rule on a searched move. */
export function probeAuditMark(position: Position, move: Move, depth: number, index: number, alpha: number, beta: number, reduction: number): boolean {
  if (PROBE.audit <= 0 || alpha + 1 !== beta) return false;
  let flat = 0;
  if (depth >= REDUCTION_MIN_DEPTH && index >= REDUCTION_MIN_INDEX && move.captured === EMPTY && move.promotion === EMPTY
      && !isInCheck(position) && !givesCheck(position, move)) flat = 1;
  if (reduction === flat) return false;
  PROBE.fired++;
  if (depth <= PROBE.auditMaxDepth && PROBE.fired % PROBE.audit === 0) {
    PROBE.auditLog.push({ kind: reduction > flat ? "more" : "less", fen: toFen(position), depth, alpha, beta });
  }
  return true;
}
/** Fresh node search (audit): search()'s switches, a cleared table, at ply 1 (not the root). */
export function probeNode(position: Position, depth: number, alpha: number, beta: number): number {
  clearTable();
  const keys = new BigUint64Array(KEY_ARRAY_CAPACITY + 1);
  keys[1] = zobristKey(position);
  const counter: NodeCounter = { nodes: 0 };
  return negamax(position, depth, alpha, beta, 1, {
    prune: true, quiescence: true, ordering: "full", table: true, pvs: true, reductions: true,
    nullMove: true, quiescenceEvasions: true, quietPromotions: true, futility: true,
  }, counter, new KillerTable(), keys, false);
}
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
  if (pvNode) r = Math.min(r, PROBE.pvMaxR);
  return r > 0 ? r : 0;
}
""")

# search.ts negamax call site (after the futility skip)
sub(sp, """  const futile = switches.futility && futilityNode(position, depth, ply, alphaIn, beta);
  let best""", """  const futile = switches.futility && futilityNode(position, depth, ply, alphaIn, beta);
  let probeMarked = false;
  let best""")
sub(sp, """    const reduction = switches.reductions
      ? lateMoveReduction(position, move, depth, index, false)
      : 0;""", """    const reduction = switches.reductions
      ? lateMoveReduction(position, move, depth, index, false, alphaIn + 1 !== beta, killers.at(ply))
      : 0;
    if (!probeMarked && probeAuditMark(position, move, depth, index, alphaIn, beta, reduction)) probeMarked = true;""")

# --- engine.ts call site (after the futility skip)
sub(ep, """    const reduction = budget.reductions
      ? lateMoveReduction(position, move, remaining, index, false)
      : 0;""", """    const reduction = budget.reductions
      ? lateMoveReduction(position, move, remaining, index, false, alphaIn + 1 !== beta, budget.killers.at(ply))
      : 0;""")
print("patched")
