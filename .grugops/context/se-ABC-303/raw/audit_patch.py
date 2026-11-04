# se-ABC-303: the audit and firing hooks, on a SCRATCH copy of the built tree only (`git archive <tip> src package.json`).
# In the shape of arch-bundle-1 raw/probe/patch_bundle1.py's audit mode. Nothing here is committed to src/ or tools/.
# The rule itself is not touched: every line added only counts, logs or re-enters negamax. usage: python3 audit_patch.py <root>
import sys
root = sys.argv[1]
def sub(path, old, new, count=1):
    p = f"{root}/{path}"
    s = open(p).read()
    n = s.count(old)
    if n != count:
        raise SystemExit(f"{path}: expected {count} of {old[:70]!r}, found {n}")
    open(p, "w").write(s.replace(old, new))
S = "src/search.ts"
E = "src/engine.ts"
sub(S, '''/** `previous`'s cell: its coloured piece, then its to-square on 0-63. */''', '''export const AUD = { every: 0, fired: 0, log: [] as any[], count: false, eligible: 0, firedNodes: 0, skipped: 0, ordNodes: 0, ordChanged: 0, cmHit: 0, toFen: (_: Position): string => "" };
function sparse(table: Int32Array): Int32Array {
  let n = 0;
  for (let i = 0; i < table.length; i++) if (table[i] !== 0) n++;
  const out = new Int32Array(2 * n);
  let j = 0;
  for (let i = 0; i < table.length; i++) { const v = table[i] as number; if (v !== 0) { out[j++] = i; out[j++] = v; } }
  return out;
}
function unsparse(table: Int32Array, cells: Int32Array): void {
  table.fill(0);
  for (let j = 0; j < cells.length; j += 2) table[cells[j] as number] = cells[j + 1] as number;
}
export function audFire(position: Position, depth: number, alpha: number, beta: number, previous: Move | null): void {
  AUD.firedNodes++;
  if (AUD.every <= 0) return;
  if (++AUD.fired % AUD.every !== 0) return;
  AUD.log.push({ fen: AUD.toFen(position), depth, alpha, beta, previous, h: sparse(HISTORY), cm: sparse(COUNTERMOVE) });
}
export function audOrder(list: readonly Move[], moves: readonly Move[], killers: readonly Move[], hashMove: Move | null, seePosition: Position | null, history: boolean, cm: number): void {
  if (!AUD.count) return;
  const plain = orderMoves(moves, killers, hashMove, seePosition, history);
  AUD.ordNodes++;
  for (let i = 0; i < list.length; i++) if (!sameMove(list[i] as Move, plain[i] as Move)) { AUD.ordChanged++; break; }
  if (cm !== 0 && list.some((m) => m.from * 128 + m.to + 1 === cm && m.captured === EMPTY && m.promotion === EMPTY)) AUD.cmHit++;
}

/** `previous`'s cell: its coloured piece, then its to-square on 0-63. */''')
sub(S, '''  const zeroFrom = moveLimit > 0 ? moveCountFrom(list.length) : 0;
  let searchedQuiets = 0;''', '''  const zeroFrom = moveLimit > 0 ? moveCountFrom(list.length) : 0;
  if (moveLimit > 0) AUD.eligible++;
  let searchedQuiets = 0;''')
sub(S, '''        if (firstSkipped === -1) firstSkipped = index;
        index++;''', '''        if (firstSkipped === -1) firstSkipped = index;
        AUD.skipped++;
        index++;''')
sub(S, '''  if (switches.table) storeEntry(key, depth, boundOf(best, alphaIn, beta), best, ply, bestMove);
  return best;
}''', '''  if (firstSkipped !== -1) audFire(position, depth, alphaIn, beta, previous);
  if (switches.table) storeEntry(key, depth, boundOf(best, alphaIn, beta), best, ply, bestMove);
  return best;
}''')
sub(S, '''export function search(position: Position, depth: number): SearchResult {''', '''const AUD_SHIPPED: Switches = { prune: true, quiescence: true, ordering: "full", table: true, pvs: true, reductions: true, nullMove: true, quiescenceEvasions: true, quietPromotions: true, futility: true, taper: true, seePruning: true, history: true, seeOrdering: true, moveCount: true, countermove: true };
/** The audit's fresh node at ply 2: the tables as they stood at the mark, a cleared transposition table, fresh killers. */
export function audNode(position: Position, depth: number, alpha: number, beta: number, row: any, door: boolean): number {
  clearTable();
  unsparse(HISTORY, row.h);
  unsparse(COUNTERMOVE, row.cm);
  const keys = new BigUint64Array(KEY_ARRAY_CAPACITY + 1);
  keys[2] = zobristKey(position);
  const switches = door ? { ...AUD_SHIPPED, moveCount: false } : AUD_SHIPPED;
  return negamax(position, depth, alpha, beta, 2, switches, { nodes: 0 }, new KillerTable(), keys, false, phaseOf(position), row.previous);
}
export function search(position: Position, depth: number): SearchResult {''')
sub(E, '''  clearHistory,
  countermoveAt,''', '''  AUD,
  audFire,
  audOrder,
  clearHistory,
  countermoveAt,''')
sub(E, '''  const zeroFrom = moveLimit > 0 ? moveCountFrom(list.length) : 0;
  let searchedQuiets = 0;''', '''  const zeroFrom = moveLimit > 0 ? moveCountFrom(list.length) : 0;
  if (moveLimit > 0) AUD.eligible++;
  audOrder(list, moves, budget.killers.at(ply), hashMove, budget.seeOrdering ? position : null, budget.history, previousCut === null ? 0 : countermoveAt(previousCut));
  let searchedQuiets = 0;''')
sub(E, '''        if (firstSkipped === -1) firstSkipped = index;
        index++;''', '''        if (firstSkipped === -1) firstSkipped = index;
        AUD.skipped++;
        index++;''')
sub(E, '''  storeEntry(key, remaining, boundOf(best, alphaIn, beta), best, ply, bestMove);
  return best;
}''', '''  if (firstSkipped !== -1) audFire(position, remaining, alphaIn, beta, previous);
  storeEntry(key, remaining, boundOf(best, alphaIn, beta), best, ply, bestMove);
  return best;
}''')
print("patched")
