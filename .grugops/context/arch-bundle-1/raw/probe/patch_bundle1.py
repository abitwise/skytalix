# arch-bundle-1: scratch probe patch on `git archive <main> src package.json`. Adds P4 (move-count pruning) and
# O2c (countermove, continuation history) as PROBE knobs in BOTH recursions, behind a `b1` field that only search()
# and chooseMove set, so every older door is untouched by construction. All knobs off = main, node for node.
# usage: python3 patch_bundle1.py <root>
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

# --- the probe block, after the history helpers -----------------------------------------------------------------
sub(S, '''/** A capture is losing for ordering below this static exchange (`ADR-0065` decision 2): -50 cp. */''',
'''// ===== arch-bundle-1 scratch probe =====
export const PROBE = {
  lmp: [0, 0, 0, 0] as number[], // P4: the quiet-count limit by remaining depth; 0 = off
  lmpZero: false, // P4: skip only a quiet whose ordering key is 0
  lmpBig3: false, // P4: only with >= 3 non-pawn pieces (the null move's guard)
  cm: false, // O2c: the countermove tier
  ch1: false, // O2c: continuation history on the previous move
  ch2: false, // O2c: continuation history on the move before it
  count: false,
  nodesFull: 0, lmpEligible: 0, lmpFiredNodes: 0, lmpSkipped: 0,
  ordNodes: 0, ordChanged: 0, cmHit: 0,
  cutAll: 0, cutFirst: 0, cutQ: 0, cutQIdx: 0, cutQKiller: 0, cutQCounter: 0,
  audit: 0, fired: 0, auditLog: [] as any[],
};
const COUNTER_KEY = 400_000;
const CONT_STRIDE = 384;
const COUNTER = new Int32Array(768);
const CONT1 = new Int16Array(768 * CONT_STRIDE);
const CONT2 = new Int16Array(768 * CONT_STRIDE);
/** STACK[ply] = the (piece, to) key of the move that led to ply; -1 for a null move and at the root. */
const STACK = new Int32Array(KEY_ARRAY_CAPACITY + 3).fill(-1);
let CTX_P1 = -1;
let CTX_P2 = -1;
let CTX_CM = 0;
function to64(square: number): number { return (square & 7) | ((square >> 4) << 3); }
function prevKey(move: Move): number { return ((isBlack(move.piece) ? 6 : 0) + pieceType(move.piece) - 1) * 64 + to64(move.to); }
function curKey(move: Move): number { return (pieceType(move.piece) - 1) * 64 + to64(move.to); }
function packed(move: Move): number { return move.from * 128 + move.to + 1; }
export function probeByteLength(): number {
  return (PROBE.cm ? COUNTER.byteLength : 0) + (PROBE.ch1 ? CONT1.byteLength : 0) + (PROBE.ch2 ? CONT2.byteLength : 0);
}
export function probePush(ply: number, move: Move | null): void { STACK[ply] = move === null ? -1 : prevKey(move); }
export function probeCtx(ply: number, on: boolean): void {
  CTX_P1 = -1; CTX_P2 = -1; CTX_CM = 0;
  if (!on || ply < 1) return;
  const p1 = STACK[ply] as number;
  if (PROBE.ch1) CTX_P1 = p1;
  if (PROBE.ch2 && ply >= 2) CTX_P2 = STACK[ply - 1] as number;
  if (PROBE.cm && p1 >= 0) CTX_CM = COUNTER[p1] as number;
}
function bump(table: Int16Array, index: number, bonus: number): void {
  const value = table[index] as number;
  table[index] = value + bonus - Math.trunc((value * Math.abs(bonus)) / HISTORY_BOUND);
}
function addCont(move: Move, bonus: number, ply: number): void {
  const cur = curKey(move);
  const p1 = STACK[ply] as number;
  if (PROBE.ch1 && ply >= 1 && p1 >= 0) bump(CONT1, p1 * CONT_STRIDE + cur, bonus);
  if (PROBE.ch2 && ply >= 2) {
    const p2 = STACK[ply - 1] as number;
    if (p2 >= 0) bump(CONT2, p2 * CONT_STRIDE + cur, bonus);
  }
}
export function probeLmpLimit(position: Position, depth: number, ply: number, alphaIn: number, beta: number): number {
  const limit = PROBE.lmp[depth] ?? 0;
  if (limit <= 0 || ply === 0 || alphaIn + 1 !== beta) return 0;
  if (alphaIn >= MATE_FLOOR || alphaIn <= 0 - MATE_FLOOR) return 0;
  if (beta >= MATE_FLOOR || beta <= 0 - MATE_FLOOR) return 0;
  if (isInCheck(position)) return 0;
  if (PROBE.lmpBig3) {
    const board = position.board;
    let pieces = 0;
    for (let square = 0; square < 128 && pieces < 3; square++) {
      if (!isOnBoard(square)) continue;
      const piece = board[square] as number;
      if (piece === EMPTY || isBlack(piece) !== position.blackToMove) continue;
      const type = pieceType(piece);
      if (type !== PAWN && type !== KING) pieces++;
    }
    if (pieces < 3) return 0;
  }
  PROBE.lmpEligible++;
  return limit;
}
/** The first index whose ordering key is 0, read straight after `orderMoves`; 0 when the zero-key clause is off. */
export function probeZeroFrom(count: number): number {
  if (!PROBE.lmpZero) return 0;
  for (let i = 0; i < count; i++) if ((ORDER_KEYS[i] as number) <= 0) return i;
  return count;
}
export function probeCut(position: Position, list: readonly Move[], cutIndex: number, killers: readonly Move[], ply: number): void {
  if (!PROBE.count) return;
  PROBE.cutAll++;
  if (cutIndex === 0) PROBE.cutFirst++;
  const move = list[cutIndex] as Move;
  if (move.captured !== EMPTY || move.promotion !== EMPTY) return;
  PROBE.cutQ++;
  PROBE.cutQIdx += cutIndex;
  if (killers.some((k) => sameMove(k, move))) PROBE.cutQKiller++;
  else {
    const p1 = ply >= 1 ? (STACK[ply] as number) : -1;
    if (p1 >= 0 && COUNTER[p1] === packed(move)) PROBE.cutQCounter++;
  }
}
/** Counting runs only: did O2c change this node's order? */
export function probeOrderCheck(list: readonly Move[], moves: readonly Move[], killers: readonly Move[], hashMove: Move | null, seePosition: Position | null, history: boolean): void {
  if (!PROBE.count) return;
  const p1 = CTX_P1, p2 = CTX_P2, cm = CTX_CM;
  CTX_P1 = -1; CTX_P2 = -1; CTX_CM = 0;
  const plain = orderMoves(moves, killers, hashMove, seePosition, history);
  CTX_P1 = p1; CTX_P2 = p2; CTX_CM = cm;
  PROBE.ordNodes++;
  for (let i = 0; i < list.length; i++) {
    if (!sameMove(list[i] as Move, plain[i] as Move)) { PROBE.ordChanged++; break; }
  }
  if (cm !== 0 && list.some((m) => packed(m) === cm && m.captured === EMPTY && m.promotion === EMPTY)) PROBE.cmHit++;
}
function sparse(table: Int16Array | Int32Array): Int32Array {
  let n = 0;
  for (let i = 0; i < table.length; i++) if (table[i] !== 0) n++;
  const out = new Int32Array(2 * n);
  let j = 0;
  for (let i = 0; i < table.length; i++) {
    const v = table[i] as number;
    if (v !== 0) { out[j++] = i; out[j++] = v; }
  }
  return out;
}
function unsparse(table: Int16Array | Int32Array, cells: Int32Array): void {
  table.fill(0);
  for (let j = 0; j < cells.length; j += 2) table[cells[j] as number] = cells[j + 1] as number;
}
/** The audit's mark (`ADR-0061` § Context): every N-th node where the rule skipped a move, with its tables. */
export function probeFire(fen: () => string, depth: number, alpha: number, beta: number, ply: number): void {
  PROBE.lmpFiredNodes++;
  if (PROBE.audit <= 0) return;
  if (++PROBE.fired % PROBE.audit !== 0) return;
  PROBE.auditLog.push({
    fen: fen(), depth, alpha, beta,
    p1: ply >= 1 ? STACK[ply] : -1, p2: ply >= 2 ? STACK[ply - 1] : -1,
    h: sparse(HISTORY), cm: sparse(COUNTER), c1: PROBE.ch1 ? sparse(CONT1) : new Int32Array(0), c2: PROBE.ch2 ? sparse(CONT2) : new Int32Array(0),
  });
}
export function probeLoad(row: any): void {
  unsparse(HISTORY, row.h); unsparse(COUNTER, row.cm); unsparse(CONT1, row.c1); unsparse(CONT2, row.c2);
}
// ===== end of the probe block =====

/** A capture is losing for ordering below this static exchange (`ADR-0065` decision 2): -50 cp. */''')

# --- clear ------------------------------------------------------------------------------------------------------
sub(S, '''export function clearHistory(): void {
  HISTORY.fill(0);
}''', '''export function clearHistory(): void {
  HISTORY.fill(0);
  if (PROBE.cm) COUNTER.fill(0);
  if (PROBE.ch1) CONT1.fill(0);
  if (PROBE.ch2) CONT2.fill(0);
}''')

# --- the update -------------------------------------------------------------------------------------------------
sub(S, '''  cutIndex: number,
  depth: number,
  futile: boolean,
): void {
  const cutter = list[cutIndex] as Move;
  if (cutter.captured !== EMPTY || cutter.promotion !== EMPTY) return;
  const bonus = depth * depth;
  addHistory(cutter, bonus);
  for (let index = 0; index < cutIndex; index++) {
    const move = list[index] as Move;
    if (move.captured !== EMPTY || move.promotion !== EMPTY) continue;
    if (futile && futileMove(position, move, index)) continue;
    addHistory(move, 0 - bonus);
  }
}''', '''  cutIndex: number,
  depth: number,
  futile: boolean,
  ply = 0,
  on = false,
  firstSkip = -1,
): void {
  const cutter = list[cutIndex] as Move;
  if (cutter.captured !== EMPTY || cutter.promotion !== EMPTY) return;
  const bonus = depth * depth;
  addHistory(cutter, bonus);
  if (on) {
    addCont(cutter, bonus, ply);
    const p1 = STACK[ply] as number;
    if (PROBE.cm && ply >= 1 && p1 >= 0) COUNTER[p1] = packed(cutter);
  }
  for (let index = 0; index < cutIndex; index++) {
    const move = list[index] as Move;
    if (move.captured !== EMPTY || move.promotion !== EMPTY) continue;
    if (futile && futileMove(position, move, index)) continue;
    if (firstSkip >= 0 && index >= firstSkip && futileMove(position, move, index)) continue;
    addHistory(move, 0 - bonus);
    if (on) addCont(move, 0 - bonus, ply);
  }
}''')

# --- the key ----------------------------------------------------------------------------------------------------
sub(S, '''  if (killer !== -1) return KILLER_KEY + killers.length - killer;
  return history ? Math.max(0, HISTORY[historyIndex(move)] as number) : 0;''',
'''  if (killer !== -1) return KILLER_KEY + killers.length - killer;
  if (CTX_CM !== 0 && CTX_CM === packed(move)) return COUNTER_KEY;
  if (!history) return 0;
  let value = HISTORY[historyIndex(move)] as number;
  if (CTX_P1 >= 0) value += CONT1[CTX_P1 * CONT_STRIDE + curKey(move)] as number;
  if (CTX_P2 >= 0) value += CONT2[CTX_P2 * CONT_STRIDE + curKey(move)] as number;
  return Math.max(0, value);''')

# --- search.ts: ordered() ---------------------------------------------------------------------------------------
sub(S, '''  if (switches.ordering === "mvv-lva") return orderMoves(moves, NO_KILLERS, null);
  return orderMoves(
    moves,
    killers.at(ply),
    hashMove,
    switches.seeOrdering ? position : null,
    switches.history,
  );
}''', '''  if (switches.ordering === "mvv-lva") return orderMoves(moves, NO_KILLERS, null);
  const on = (switches as any).b1 === true;
  probeCtx(ply, on);
  const list = orderMoves(
    moves,
    killers.at(ply),
    hashMove,
    switches.seeOrdering ? position : null,
    switches.history,
  );
  PROBE_ZERO_FROM = on ? probeZeroFrom(list.length) : 0;
  if (on) probeOrderCheck(list, moves, killers.at(ply), hashMove, switches.seeOrdering ? position : null, switches.history);
  probeCtx(0, false);
  return list;
}
let PROBE_ZERO_FROM = 0;''')

# --- search.ts: the null child and the move loop ----------------------------------------------------------------
sub(S, '''      keys[ply + 1] = zobristKeyAfterNullMove(key, nullUndo);
      const nullScore =''', '''      keys[ply + 1] = zobristKeyAfterNullMove(key, nullUndo);
      probePush(ply + 1, null);
      const nullScore =''')
sub(S, '''  let index = 0;
  const list = ordered(position, moves, ply, switches, killers, hashMove);
  for (const move of list) {
    if (futile && futileMove(position, move, index)) {
      index++;
      continue;
    }
    const reduction = switches.reductions
      ? lateMoveReduction(position, move, depth, index, false)
      : 0;
    const undo = makeMove(position, move);
    keys[ply + 1] = zobristKeyAfterMove(key, position, move, undo);
    const score = searchMove(''', '''  let index = 0;
  const on = (switches as any).b1 === true;
  const list = ordered(position, moves, ply, switches, killers, hashMove);
  const zeroFrom = PROBE_ZERO_FROM;
  const lmpLimit = on ? probeLmpLimit(position, depth, ply, alphaIn, beta) : 0;
  let quiets = 0;
  let firstSkip = -1;
  for (const move of list) {
    if (futile && futileMove(position, move, index)) {
      index++;
      continue;
    }
    if (lmpLimit > 0 && quiets >= lmpLimit && index >= zeroFrom && futileMove(position, move, index)) {
      if (firstSkip < 0) firstSkip = index;
      PROBE.lmpSkipped++;
      index++;
      continue;
    }
    if (lmpLimit > 0 && move.captured === EMPTY && move.promotion === EMPTY) quiets++;
    const reduction = switches.reductions
      ? lateMoveReduction(position, move, depth, index, false)
      : 0;
    const undo = makeMove(position, move);
    keys[ply + 1] = zobristKeyAfterMove(key, position, move, undo);
    probePush(ply + 1, move);
    const score = searchMove(''')
sub(S, '''      if (switches.history) recordHistoryCutoff(position, list, index - 1, depth, futile);
      killers.record(ply, move);
      break; // the opponent would never allow this node; the rest cannot matter
    }
  }

  if (switches.table) storeEntry(key, depth, boundOf(best, alphaIn, beta), best, ply, bestMove);
  return best;
}''', '''      if (on) probeCut(position, list, index - 1, killers.at(ply), ply);
      if (switches.history) recordHistoryCutoff(position, list, index - 1, depth, futile, ply, on, firstSkip);
      killers.record(ply, move);
      break; // the opponent would never allow this node; the rest cannot matter
    }
  }

  if (firstSkip >= 0) probeFire(() => PROBE_FEN(position), depth, alphaIn, beta, ply);
  if (switches.table) storeEntry(key, depth, boundOf(best, alphaIn, beta), best, ply, bestMove);
  return best;
}''')
sub(S, '''    keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);
    const score = searchMove(''', '''    keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);
    probePush(1, move);
    const score = searchMove(''')

# --- search(): the only on switch here, and the audit's fresh node ---------------------------------------------
sub(S, '''export function search(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, {
    prune: true,
    quiescence: true,
    ordering: "full",
    table: true,
    pvs: true,
    reductions: true,
    nullMove: true,
    quiescenceEvasions: true,
    quietPromotions: true,
    futility: true,
    taper: true,
    seePruning: true,
    history: true,
    seeOrdering: true,
  });
}''', '''const SHIPPED: Switches = {
  prune: true,
  quiescence: true,
  ordering: "full",
  table: true,
  pvs: true,
  reductions: true,
  nullMove: true,
  quiescenceEvasions: true,
  quietPromotions: true,
  futility: true,
  taper: true,
  seePruning: true,
  history: true,
  seeOrdering: true,
  b1: true,
} as any;
export function search(position: Position, depth: number): SearchResult {
  return searchRoot(position, depth, SHIPPED);
}
let PROBE_FEN: (position: Position) => string = () => "";
export function probeSetFen(fn: (position: Position) => string): void { PROBE_FEN = fn; }
/** The audit's fresh node: search()'s switches, a cleared table, at ply 2 with the node's two previous moves. */
export function probeNode(position: Position, depth: number, alpha: number, beta: number, row: any): number {
  clearTable();
  probeLoad(row);
  const keys = new BigUint64Array(KEY_ARRAY_CAPACITY + 1);
  keys[2] = zobristKey(position);
  STACK[1] = row.p2;
  STACK[2] = row.p1;
  const counter: NodeCounter = { nodes: 0 };
  return negamax(position, depth, alpha, beta, 2, SHIPPED, counter, new KillerTable(), keys, false, phaseOf(position));
}''')

# --- engine.ts --------------------------------------------------------------------------------------------------
# Added after Step B's first attempt crashed on the head's first P4 node in chooseMove (`EMPTY` not imported here).
sub(E, 'import type { Position } from "./position.ts";', 'import { EMPTY, type Position } from "./position.ts";')
sub(E, '''  orderMoves,
  recordHistoryCutoff,
  repeatsInPath,
} from "./search.ts";''', '''  orderMoves,
  PROBE,
  probeCtx,
  probeCut,
  probeFire,
  probeLmpLimit,
  probeOrderCheck,
  probePush,
  probeZeroFrom,
  recordHistoryCutoff,
  repeatsInPath,
} from "./search.ts";''')
sub(E, '''        keys[ply + 1] = zobristKeyAfterNullMove(key, nullUndo);
        nullScore =''', '''        keys[ply + 1] = zobristKeyAfterNullMove(key, nullUndo);
        probePush(ply + 1, null);
        nullScore =''')
sub(E, '''  let index = 0;
  const list = orderMoves(
    moves,
    budget.killers.at(ply),
    hashMove,
    budget.seeOrdering ? position : null,
    budget.history,
  );
  for (const move of list) {
    if (futile && futileMove(position, move, index)) {
      index++;
      continue;
    }
    const reduction = budget.reductions
      ? lateMoveReduction(position, move, remaining, index, false)
      : 0;
    const undo = makeMove(position, move);
    let score: number;
    try {
      keys[ply + 1] = zobristKeyAfterMove(key, position, move, undo);
      score = searchMove(''', '''  let index = 0;
  const on = (budget as any).b1 === true;
  probeCtx(ply, on);
  const list = orderMoves(
    moves,
    budget.killers.at(ply),
    hashMove,
    budget.seeOrdering ? position : null,
    budget.history,
  );
  const zeroFrom = on ? probeZeroFrom(list.length) : 0;
  if (on) probeOrderCheck(list, moves, budget.killers.at(ply), hashMove, budget.seeOrdering ? position : null, budget.history);
  probeCtx(0, false);
  const lmpLimit = on ? probeLmpLimit(position, remaining, ply, alphaIn, beta) : 0;
  let quiets = 0;
  let firstSkip = -1;
  for (const move of list) {
    if (futile && futileMove(position, move, index)) {
      index++;
      continue;
    }
    if (lmpLimit > 0 && quiets >= lmpLimit && index >= zeroFrom && futileMove(position, move, index)) {
      if (firstSkip < 0) firstSkip = index;
      PROBE.lmpSkipped++;
      index++;
      continue;
    }
    if (lmpLimit > 0 && move.captured === EMPTY && move.promotion === EMPTY) quiets++;
    const reduction = budget.reductions
      ? lateMoveReduction(position, move, remaining, index, false)
      : 0;
    const undo = makeMove(position, move);
    let score: number;
    try {
      keys[ply + 1] = zobristKeyAfterMove(key, position, move, undo);
      probePush(ply + 1, move);
      score = searchMove(''')
sub(E, '''      if (budget.history) recordHistoryCutoff(position, list, index - 1, remaining, futile);
      budget.killers.record(ply, move);
      break;
    }
  }
''', '''      if (on) probeCut(position, list, index - 1, budget.killers.at(ply), ply);
      if (budget.history) recordHistoryCutoff(position, list, index - 1, remaining, futile, ply, on, firstSkip);
      budget.killers.record(ply, move);
      break;
    }
  }

  if (firstSkip >= 0) probeFire(() => "", remaining, alphaIn, beta, ply);
''')
sub(E, '''      budget.keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);
      score = searchMove(''', '''      budget.keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);
      probePush(1, move);
      score = searchMove(''')
sub(E, '''export function chooseMove(position: Position, options: EngineOptions): EngineChoice | null {
  return deepen(position, options, {
    pvs: true,
    reductions: true,
    nullMove: true,
    priorKeys: true,
    quiescenceEvasions: true,
    quietPromotions: true,
    futility: true,
    taper: true,
    seePruning: true,
    history: true,
    seeOrdering: true,
    aspiration: true,
  });
}''', '''export function chooseMove(position: Position, options: EngineOptions): EngineChoice | null {
  return deepen(position, options, {
    pvs: true,
    reductions: true,
    nullMove: true,
    priorKeys: true,
    quiescenceEvasions: true,
    quietPromotions: true,
    futility: true,
    taper: true,
    seePruning: true,
    history: true,
    seeOrdering: true,
    aspiration: true,
    b1: true,
  } as any);
}''')
print("patched")
