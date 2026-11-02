# SCRATCH ONLY (se-ABC-268): a cut-audit sampling hook on a copy of the ABC-268 build. Never in the repo.
import sys
root = sys.argv[1]
def sub(path, old, new, count=1):
    s = open(path).read()
    n = s.count(old)
    if n != count:
        raise SystemExit(f"{path}: expected {count} of {old[:70]!r}, found {n}")
    open(path, "w").write(s.replace(old, new))
sp = root + "/src/search.ts"
sub(sp, 'import { zobristKey, zobristKeyAfterMove, zobristKeyAfterNullMove } from "./zobrist.ts";',
'''import { zobristKey, zobristKeyAfterMove, zobristKeyAfterNullMove } from "./zobrist.ts";
import { toFen } from "./fen.ts";
/** SCRATCH AUDIT HOOK (se-ABC-268). */
export const AUDIT = { fired: 0, pruned: 0, every: 0, log: [] as { fen: string; depth: number; alpha: number; beta: number }[] };
function auditFire(position: Position, depth: number, alpha: number, beta: number): void {
  AUDIT.fired++;
  if (AUDIT.every > 0 && AUDIT.fired % AUDIT.every === 0) AUDIT.log.push({ fen: toFen(position), depth, alpha, beta });
}
export function auditNode(position: Position, depth: number, alpha: number, beta: number, futility: boolean): number {
  clearTable();
  const keys = new BigUint64Array(KEY_ARRAY_CAPACITY + 1);
  keys[1] = zobristKey(position);
  return negamax(position, depth, alpha, beta, 1, {
    prune: true, quiescence: true, ordering: "full", table: true, pvs: true, reductions: true,
    nullMove: true, quiescenceEvasions: true, quietPromotions: true, futility,
  }, { nodes: 0 }, new KillerTable(), keys, false);
}''')
sub(sp, """  const futile = switches.futility && futilityNode(position, depth, ply, alphaIn, beta);
""", """  const futile = switches.futility && futilityNode(position, depth, ply, alphaIn, beta);
  let skipped = 0;
""")
sub(sp, """    if (futile && futileMove(position, move, index)) {
      index++;
      continue;
    }
    const reduction = switches.reductions""", """    if (futile && futileMove(position, move, index)) {
      skipped++;
      AUDIT.pruned++;
      index++;
      continue;
    }
    const reduction = switches.reductions""")
sub(sp, """  if (switches.table) storeEntry(key, depth, boundOf(best, alphaIn, beta), best, ply, bestMove);
  return best;
}""", """  if (skipped > 0) auditFire(position, depth, alphaIn, beta);
  if (switches.table) storeEntry(key, depth, boundOf(best, alphaIn, beta), best, ply, bestMove);
  return best;
}""")
print("patched")
