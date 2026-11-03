# qe-ABC-269 SCRATCH ONLY: qe-ABC-268's cut-audit sampling hook (qe-audit-patch.py), adapted to the ABC-269 cut build
# (561fc028): futilityNode takes (…, switches.taper, phase), negamax takes a trailing phase, Switches has taper.
# qeNode searches fresh with search()'s switches (taper on) and futility on/off, phase = phaseOf(position).
import sys
root = sys.argv[1]
def sub(path, old, new):
    s = open(path).read()
    n = s.count(old)
    if n != 1:
        raise SystemExit(f"{path}: expected 1 of {old[:60]!r}, found {n}")
    open(path, "w").write(s.replace(old, new))
sp = root + "/src/search.ts"
sub(sp, 'import { zobristKey, zobristKeyAfterMove, zobristKeyAfterNullMove } from "./zobrist.ts";\n',
'''import { zobristKey, zobristKeyAfterMove, zobristKeyAfterNullMove } from "./zobrist.ts";
import { toFen as qeToFen } from "./fen.ts";
/** qe-ABC-269 SCRATCH HOOK. */
export const QE = { firing: 0, skipped: 0, every: 0, sample: [] as Array<{ fen: string; depth: number; alpha: number; beta: number }> };
export function qeReset(every: number): void { QE.firing = 0; QE.skipped = 0; QE.every = every; QE.sample = []; }
export function qeNode(position: Position, depth: number, alpha: number, beta: number, futility: boolean): number {
  clearTable();
  const keys = new BigUint64Array(KEY_ARRAY_CAPACITY + 1);
  keys[1] = zobristKey(position);
  const sw: Switches = { prune: true, quiescence: true, ordering: "full", table: true, pvs: true, reductions: true,
    nullMove: true, quiescenceEvasions: true, quietPromotions: true, futility, taper: true };
  return negamax(position, depth, alpha, beta, 1, sw, { nodes: 0 }, new KillerTable(), keys, false, phaseOf(position));
}
''')
sub(sp, "    switches.futility && futilityNode(position, depth, ply, alphaIn, beta, switches.taper, phase);\n",
        "    switches.futility && futilityNode(position, depth, ply, alphaIn, beta, switches.taper, phase);\n  let qeSkips = 0;\n")
sub(sp, "    if (futile && futileMove(position, move, index)) {\n      index++;\n      continue;\n    }\n",
        "    if (futile && futileMove(position, move, index)) {\n      qeSkips++;\n      index++;\n      continue;\n    }\n")
sub(sp, "  if (switches.table) storeEntry(key, depth, boundOf(best, alphaIn, beta), best, ply, bestMove);\n  return best;\n}\n",
'''  if (qeSkips > 0) {
    QE.firing++;
    QE.skipped += qeSkips;
    if (QE.every > 0 && QE.firing % QE.every === 0) QE.sample.push({ fen: qeToFen(position), depth, alpha: alphaIn, beta });
  }
  if (switches.table) storeEntry(key, depth, boundOf(best, alphaIn, beta), best, ply, bestMove);
  return best;
}
''')
print("qe hook patched")
