# arch-Q1-see-pruning: scratch probe patch for Q1 (SEE pruning of losing captures) on `git archive <main> src package.json`
# (main dc7dc15d, src tree 4cb84035: E1 taper + ABC-274 packed blend, futility in force). Defaults (Q1.q 0, Q1.m 0) = main,
# node for node. SEE is arch-ABC-234's patch_234.py `see()` / `isLosingCapture()`, unchanged. Knobs (Q1 in quiescence.ts):
#   q: 0 off | 1 quiescence, out of check, skips a LOSING capture (see < -qMargin); qCheck: a capture that gives check is never skipped
#   m: 0 off | 1 main search: at a null-window non-root node of remaining depth 1..mMaxDepth, mate band excluded, not in check,
#      a move at index >= 1 that is a LOSING capture with see < -mMul*depth and gives no check is skipped (it keeps its index)
#   count: premise counters; qAudit / mAudit: every Nth pruning node logged (information only)
import sys
root = sys.argv[1]
def sub(path, old, new, count=1):
    s = open(path).read()
    n = s.count(old)
    if n != count:
        raise SystemExit(f"{path}: expected {count} of {old[:70]!r}, found {n}")
    open(path, "w").write(s.replace(old, new))

qp = root + "/src/quiescence.ts"
sp = root + "/src/search.ts"
ep = root + "/src/engine.ts"

sub(qp, 'import { isInCheck, legalCaptures, legalCapturesAndQueenPromotions, legalMoves } from "./legal.ts";',
        'import { givesCheck, isInCheck, legalCaptures, legalCapturesAndQueenPromotions, legalMoves } from "./legal.ts";\nimport { toFen } from "./fen.ts";')
sub(qp, 'import { type Position, pieceType } from "./position.ts";',
'''import { type Position, pieceType, BLACK, EMPTY as EMPTY_SQ, isOnBoard, KING as KING_T, PAWN as PAWN_T, KNIGHT as KNIGHT_T, BISHOP as BISHOP_T, ROOK as ROOK_T, QUEEN as QUEEN_T } from "./position.ts";

/** SCRATCH PROBE ONLY (arch-Q1-see-pruning; SEE is arch-ABC-234's, unchanged). SEE values: ORDER_VALUE's, the king large. */
const SEE_VALUE: readonly number[] = [0, 100, 320, 330, 500, 900, 20000];
const SEE_REMOVED = new Uint8Array(128);
const SEE_GAIN = new Int32Array(40);
const SEE_DIAG = [17, 15, -15, -17];
const SEE_ORTH = [16, 1, -1, -16];
const SEE_KNIGHT = [33, 31, 18, 14, -14, -18, -31, -33];
function seeRay(board: Uint8Array, sq: number, d: number): number {
  let s = sq + d;
  while (isOnBoard(s)) {
    if (board[s] !== EMPTY_SQ && SEE_REMOVED[s] === 0) return s;
    s += d;
  }
  return -1;
}
function seeLeast(board: Uint8Array, sq: number, black: boolean): number {
  const c = black ? BLACK : 0;
  const pr = black ? sq + 16 : sq - 16;
  for (const side of [-1, 1]) {
    const f = pr + side;
    if (isOnBoard(f) && SEE_REMOVED[f] === 0 && board[f] === (PAWN_T | c)) return f;
  }
  for (const o of SEE_KNIGHT) {
    const f = sq + o;
    if (isOnBoard(f) && SEE_REMOVED[f] === 0 && board[f] === (KNIGHT_T | c)) return f;
  }
  let rook = -1, queen = -1;
  for (const d of SEE_DIAG) {
    const f = seeRay(board, sq, d);
    if (f === -1) continue;
    if (board[f] === (BISHOP_T | c)) return f;
    if (board[f] === (QUEEN_T | c)) queen = f;
  }
  for (const d of SEE_ORTH) {
    const f = seeRay(board, sq, d);
    if (f === -1) continue;
    if (board[f] === (ROOK_T | c) && rook === -1) rook = f;
    if (board[f] === (QUEEN_T | c) && queen === -1) queen = f;
  }
  if (rook !== -1) return rook;
  if (queen !== -1) return queen;
  for (const o of [...SEE_DIAG, ...SEE_ORTH]) {
    const f = sq + o;
    if (isOnBoard(f) && SEE_REMOVED[f] === 0 && board[f] === (KING_T | c)) return f;
  }
  return -1;
}
export function see(position: Position, move: Move): number {
  const board = position.board;
  const to = move.to;
  const used: number[] = [move.from];
  SEE_REMOVED[move.from] = 1;
  let onSq = SEE_VALUE[pieceType(move.piece)] as number;
  SEE_GAIN[0] = SEE_VALUE[pieceType(move.captured)] as number;
  let black = (move.piece & BLACK) === 0;
  let d = 0;
  for (;;) {
    const f = seeLeast(board, to, black);
    if (f === -1) break;
    d++;
    SEE_GAIN[d] = onSq - (SEE_GAIN[d - 1] as number);
    onSq = SEE_VALUE[pieceType(board[f] as number)] as number;
    SEE_REMOVED[f] = 1;
    used.push(f);
    black = !black;
  }
  for (const u of used) SEE_REMOVED[u] = 0;
  while (d > 0) {
    const g = SEE_GAIN[d - 1] as number;
    SEE_GAIN[d - 1] = 0 - Math.max(0 - g, SEE_GAIN[d] as number);
    d--;
  }
  return SEE_GAIN[0] as number;
}
export function isLosingCapture(position: Position, move: Move, margin: number): boolean {
  if (move.captured === EMPTY_SQ || move.promotion !== EMPTY_SQ) return false;
  const a = pieceType(move.piece);
  if (a === KING_T) return false;
  if ((SEE_VALUE[pieceType(move.captured)] as number) >= (SEE_VALUE[a] as number)) return false;
  return see(position, move) < 0 - margin;
}
/** SCRATCH PROBE knobs and counters (arch-Q1-see-pruning). Defaults = main. */
export const Q1 = {
  q: 0, qMargin: 0, qCheck: false, m: 0, mMul: 100, mMaxDepth: 3,
  count: false, qNodes: 0, qMoves: 0, qLosing: 0, qLosingRefuted: 0, qLosingNodes: 0, qPruned: 0, mPruned: 0, mNodes: 0,
  qAudit: 0, qFired: 0, qLog: [] as { fen: string; alpha: number; beta: number; qply: number; ply: number }[],
  mAudit: 0, mFired: 0, mLog: [] as { fen: string; depth: number; alpha: number; beta: number }[],
};
/** The main-search node test: futilityNode's guards without its evaluation clause (MATE_FLOOR 20 000). */
export function q1Node(position: Position, depth: number, ply: number, alphaIn: number, beta: number): boolean {
  if (Q1.m === 0 || ply === 0 || alphaIn + 1 !== beta) return false;
  if (depth < 1 || depth > Q1.mMaxDepth) return false;
  if (alphaIn >= 20000 || alphaIn <= -20000 || beta >= 20000 || beta <= -20000) return false;
  return !isInCheck(position);
}
/** The main-search move test: index >= 1, a losing capture beyond mMul * depth, no check given. */
export function q1Move(position: Position, move: Move, index: number, depth: number): boolean {
  if (index < 1) return false;
  if (!isLosingCapture(position, move, Q1.mMul * depth)) return false;
  return !givesCheck(position, move);
}''')

# quiescence loop: the prune, the counters, the audit mark
sub(qp, "  if (qply > 0) visit(qply);\n", "  if (qply > 0) visit(qply);\n  if (Q1.count) Q1.qNodes++;\n")
sub(qp, """  orderCaptures(moves);

  for (const move of moves) {
    const undo = makeMove(position, move);""", """  orderCaptures(moves);

  const outOfCheck = best !== Number.NEGATIVE_INFINITY;
  let q1Marked = false;
  for (const move of moves) {
    if (Q1.q !== 0 && outOfCheck && isLosingCapture(position, move, Q1.qMargin) && !(Q1.qCheck && givesCheck(position, move))) {
      if (Q1.count) Q1.qPruned++;
      if (!q1Marked && Q1.qAudit > 0) {
        q1Marked = true;
        Q1.qFired++;
        if (Q1.qFired % Q1.qAudit === 0) Q1.qLog.push({ fen: toFen(position), alpha, beta, qply, ply });
      }
      continue;
    }
    const qLosing = Q1.count && outOfCheck && isLosingCapture(position, move, Q1.qMargin);
    const qBefore = Q1.qNodes;
    const qAlpha = alpha;
    const undo = makeMove(position, move);""")
sub(qp, """    } finally {
      unmakeMove(position, move, undo);
    }

    if (score > best) best = score;""", """    } finally {
      unmakeMove(position, move, undo);
    }
    if (Q1.count) {
      Q1.qMoves++;
      if (qLosing) { Q1.qLosing++; Q1.qLosingNodes += Q1.qNodes - qBefore; if (score <= qAlpha) Q1.qLosingRefuted++; }
    }

    if (score > best) best = score;""")

# search.ts: the main-search rule after the futility skip; probeNode for the audit
sub(sp, 'import { MATE_SCORE, mvvLvaKey, type QuiescenceRules, quiesce } from "./quiescence.ts";',
        'import { MATE_SCORE, mvvLvaKey, type QuiescenceRules, quiesce, Q1, q1Node, q1Move } from "./quiescence.ts";\nimport { toFen } from "./fen.ts";')
sub(sp, """    switches.futility && futilityNode(position, depth, ply, alphaIn, beta, switches.taper, phase);
  let best""", """    switches.futility && futilityNode(position, depth, ply, alphaIn, beta, switches.taper, phase);
  const seeNode = q1Node(position, depth, ply, alphaIn, beta);
  let q1Marked = false;
  if (Q1.count) Q1.mNodes++;
  let best""")
sub(sp, """    if (futile && futileMove(position, move, index)) {
      index++;
      continue;
    }
    const reduction = switches.reductions""", """    if (futile && futileMove(position, move, index)) {
      index++;
      continue;
    }
    if (seeNode && q1Move(position, move, index, depth)) {
      if (Q1.count) Q1.mPruned++;
      if (!q1Marked && Q1.mAudit > 0) {
        q1Marked = true;
        Q1.mFired++;
        if (Q1.mFired % Q1.mAudit === 0) Q1.mLog.push({ fen: toFen(position), depth, alpha: alphaIn, beta });
      }
      index++;
      continue;
    }
    const reduction = switches.reductions""")
sub(sp, "/**\n * Search the root: score every legal move", """/** SCRATCH PROBE ONLY: a fresh node search at ply 1 (cleared table), search()'s switches, for the audit. */
export function probeNode(position: Position, depth: number, alpha: number, beta: number): number {
  clearTable();
  const keys = new BigUint64Array(KEY_ARRAY_CAPACITY + 1);
  keys[1] = zobristKey(position);
  const counter: NodeCounter = { nodes: 0 };
  return negamax(position, depth, alpha, beta, 1, {
    prune: true, quiescence: true, ordering: "full", table: true, pvs: true, reductions: true,
    nullMove: true, quiescenceEvasions: true, quietPromotions: true, futility: true, taper: true,
  }, counter, new KillerTable(), keys, false, phaseOf(position));
}

/**
 * Search the root: score every legal move""")

# engine.ts: the same rule
sub(ep, 'import { type QuiescenceRules, type QuiescenceVisitor, quiesce } from "./quiescence.ts";',
        'import { type QuiescenceRules, type QuiescenceVisitor, quiesce, Q1, q1Node, q1Move } from "./quiescence.ts";')
sub(ep, """    budget.futility && futilityNode(position, remaining, ply, alphaIn, beta, budget.taper, phase);
  let best""", """    budget.futility && futilityNode(position, remaining, ply, alphaIn, beta, budget.taper, phase);
  const seeNode = q1Node(position, remaining, ply, alphaIn, beta);
  let best""")
sub(ep, """    if (futile && futileMove(position, move, index)) {
      index++;
      continue;
    }
    const reduction = budget.reductions""", """    if (futile && futileMove(position, move, index)) {
      index++;
      continue;
    }
    if (seeNode && q1Move(position, move, index, remaining)) {
      index++;
      continue;
    }
    const reduction = budget.reductions""")
print("patched q1")
