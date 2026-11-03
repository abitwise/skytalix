# arch-ABC-234: scratch probe patch for O3s (SEE orders captures, ordering only) on `git archive <main> src package.json`
# (src tree 58fa3eb4 = e72487e1's, futility in force). Run AFTER patch_post268.py (arch-post-268's, unchanged; it adds
# PROBE, probeNode and the toFen import). Defaults (see 0) = main, node for node.
# Knobs (PROBE): see (0 off | 1 losing captures after the killers | 2 losing captures after every quiet move),
# seeMargin (a capture is LOSING iff see(move) < -seeMargin), count (premise counters), seeAudit (every Nth marked node).
# SEE itself and the quiescence counters live in quiescence.ts (no import cycle); search.ts imports them.
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

# ---------------------------------------------------------------- quiescence.ts: SEE + quiescence counters (report only)
sub(qp, 'import { type Position, pieceType } from "./position.ts";',
'''import { type Position, pieceType, BLACK, EMPTY as EMPTY_SQ, isOnBoard, KING as KING_T, PAWN as PAWN_T, KNIGHT as KNIGHT_T, BISHOP as BISHOP_T, ROOK as ROOK_T, QUEEN as QUEEN_T } from "./position.ts";

/** SCRATCH PROBE ONLY (arch-ABC-234). SEE values: ORDER_VALUE's, the king large so it captures last. */
const SEE_VALUE: readonly number[] = [0, 100, 320, 330, 500, 900, 20000];
const SEE_REMOVED = new Uint8Array(128);
const SEE_GAIN = new Int32Array(40);
const SEE_DIAG = [17, 15, -15, -17];
const SEE_ORTH = [16, 1, -1, -16];
const SEE_KNIGHT = [33, 31, 18, 14, -14, -18, -31, -33];
/** First piece on the ray from `sq` along `d`, skipping removed squares; its square or -1. */
function seeRay(board: Uint8Array, sq: number, d: number): number {
  let s = sq + d;
  while (isOnBoard(s)) {
    if (board[s] !== EMPTY_SQ && SEE_REMOVED[s] === 0) return s;
    s += d;
  }
  return -1;
}
/** The least valuable piece of colour `black` attacking `sq` (x-rays through removed squares); its square or -1. */
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
/** Static exchange evaluation of a capture, in cp for the mover (swap list, x-rays, pins ignored). Pure. */
export function see(position: Position, move: Move): number {
  const board = position.board;
  const to = move.to;
  const used: number[] = [move.from];
  SEE_REMOVED[move.from] = 1;
  let onSq = SEE_VALUE[pieceType(move.piece)] as number;
  SEE_GAIN[0] = SEE_VALUE[pieceType(move.captured)] as number;
  let black = (move.piece & BLACK) === 0; // the opponent moves next
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
/** A capture that is LOSING by SEE (< -margin). Promotions, king captures and victim >= attacker never are. */
export function isLosingCapture(position: Position, move: Move, margin: number): boolean {
  if (move.captured === EMPTY_SQ || move.promotion !== EMPTY_SQ) return false;
  const a = pieceType(move.piece);
  if (a === KING_T) return false;
  if ((SEE_VALUE[pieceType(move.captured)] as number) >= (SEE_VALUE[a] as number)) return false;
  return see(position, move) < 0 - margin;
}
/** Quiescence counters (report only, Q1's premise): set QCOUNT.on to count. */
export const QCOUNT = { on: false, margin: 0, moves: 0, losing: 0, losingRefuted: 0, losingNodes: 0, nodes: 0 };''')

sub(qp, "  if (qply > 0) visit(qply);\n", "  if (qply > 0) visit(qply);\n  if (QCOUNT.on) QCOUNT.nodes++;\n")
sub(qp, """  for (const move of moves) {
    const undo = makeMove(position, move);
    let score: number;
    try {
      score = 0 - quiesce(position, 0 - beta, 0 - alpha, qply + 1, ply, rules, visit);
    } finally {
      unmakeMove(position, move, undo);
    }
""", """  for (const move of moves) {
    const qLosing = QCOUNT.on && isLosingCapture(position, move, QCOUNT.margin);
    const qBefore = QCOUNT.nodes;
    const qAlpha = alpha;
    const undo = makeMove(position, move);
    let score: number;
    try {
      score = 0 - quiesce(position, 0 - beta, 0 - alpha, qply + 1, ply, rules, visit);
    } finally {
      unmakeMove(position, move, undo);
    }
    if (QCOUNT.on) {
      QCOUNT.moves++;
      if (qLosing) { QCOUNT.losing++; QCOUNT.losingNodes += QCOUNT.nodes - qBefore; if (score <= qAlpha) QCOUNT.losingRefuted++; }
    }
""")

# ---------------------------------------------------------------- search.ts
sub(sp, 'import { MATE_SCORE, mvvLvaKey, type QuiescenceRules, quiesce } from "./quiescence.ts";',
        'import { MATE_SCORE, mvvLvaKey, type QuiescenceRules, quiesce, isLosingCapture } from "./quiescence.ts";')
sub(sp, "  fut: 0, futDepth: 2, nmpDiv: 0,\n",
"""  fut: 0, futDepth: 2, nmpDiv: 0,
  see: 0, seeMargin: 0, seeAudit: 0, seeFired: 0, seeLog: [] as { fen: string; depth: number; alpha: number; beta: number }[],
  nodesOrd: 0, nodesLC: 0, nodesLCAhead: 0, lcSearched: 0, lcRefuted: 0, lcRaised: 0, lcCut: 0, lcNodes: 0, lcNodesRefuted: 0,
  cutAll: 0, cutFirst: 0, cutLC: 0, cutIdxLCAhead: 0, cutsLCAhead: 0, ordChanged: 0,
""")

# orderKey / orderMoves take the node's position (null: no SEE, today's order)
sub(sp, """function orderKey(move: Move, killers: readonly Move[], hashMove: Move | null): number {
  if (hashMove !== null && sameMove(move, hashMove)) return HASH_MOVE_KEY;
  if (move.captured !== EMPTY || move.promotion !== EMPTY) return TACTICAL_KEY + mvvLvaKey(move);""",
"""function orderKey(move: Move, killers: readonly Move[], hashMove: Move | null, position: Position | null): number {
  if (hashMove !== null && sameMove(move, hashMove)) return HASH_MOVE_KEY;
  if (move.captured !== EMPTY || move.promotion !== EMPTY) {
    if (position !== null && PROBE.see !== 0 && isLosingCapture(position, move, PROBE.seeMargin)) {
      // losing capture: after the killers (keys 1-2) and before other quiets (0), or after every quiet move
      return PROBE.see === 1 ? 0.5 + mvvLvaKey(move) / 10_000 : -1 + mvvLvaKey(move) / 10_000;
    }
    return TACTICAL_KEY + mvvLvaKey(move);
  }""")
sub(sp, """  hashMove: Move | null,
): Move[] {
  const count = moves.length;""", """  hashMove: Move | null,
  position: Position | null = null,
): Move[] {
  const count = moves.length;""")
sub(sp, "    const key = orderKey(move, killers, hashMove);", "    const key = orderKey(move, killers, hashMove, position);")
sub(sp, """  hashMove: Move | null,
): readonly Move[] {
  if (switches.ordering === "none") return moves;
  if (switches.ordering === "mvv-lva") return orderMoves(moves, NO_KILLERS, null);
  return orderMoves(moves, killers.at(ply), hashMove);
}""", """  hashMove: Move | null,
  position: Position | null = null,
): readonly Move[] {
  if (switches.ordering === "none") return moves;
  if (switches.ordering === "mvv-lva") return orderMoves(moves, NO_KILLERS, null);
  return orderMoves(moves, killers.at(ply), hashMove, position);
}

/** SCRATCH PROBE ONLY (arch-ABC-234): per-node premise counters and the SEE audit mark. */
function probeSeeNode(position: Position, moves: readonly Move[], got: readonly Move[], killers: readonly Move[], hashMove: Move | null, depth: number, alpha: number, beta: number): Uint8Array | null {
  const audit = PROBE.seeAudit > 0 && PROBE.see !== 0;
  if (!PROBE.count && !audit) return null;
  if (audit && alpha + 1 === beta) {
    const plain = orderMoves(moves, killers, hashMove, null);
    let changed = false;
    for (let i = 0; i < plain.length; i++) if (!sameMove(plain[i] as Move, got[i] as Move)) { changed = true; break; }
    if (changed) {
      PROBE.seeFired++;
      if (PROBE.seeFired % PROBE.seeAudit === 0) PROBE.seeLog.push({ fen: toFen(position), depth, alpha, beta });
    }
  }
  if (!PROBE.count) return null;
  PROBE.nodesOrd++;
  const lc = new Uint8Array(got.length);
  let any = false, ahead = false, seenLC = false;
  for (let i = 0; i < got.length; i++) {
    const m = got[i] as Move;
    if (hashMove !== null && sameMove(m, hashMove)) continue;
    if (isLosingCapture(position, m, PROBE.seeMargin)) { lc[i] = 1; any = true; seenLC = true; }
    else if (seenLC && m.captured === EMPTY && m.promotion === EMPTY) ahead = true;
  }
  if (any) PROBE.nodesLC++;
  if (ahead) { PROBE.nodesLCAhead++; lc[got.length - 1] |= 2; }
  return any ? lc : null;
}
""")

# negamax: order with the position; counters around each searched move
sub(sp, """  let index = 0;
  for (const move of ordered(moves, ply, switches, killers, hashMove)) {
    if (futile && futileMove(position, move, index)) {""", """  let index = 0;
  const orderedList = ordered(moves, ply, switches, killers, hashMove, position);
  const lcMarks = probeSeeNode(position, moves, orderedList, killers.at(ply), hashMove, depth, alphaIn, beta);
  const lcAhead = lcMarks !== null && ((lcMarks[lcMarks.length - 1] as number) & 2) !== 0;
  for (const move of orderedList) {
    if (futile && futileMove(position, move, index)) {""")
sub(sp, """    const undo = makeMove(position, move);
    keys[ply + 1] = zobristKeyAfterMove(key, position, move, undo);
    const score = searchMove(
      position,
      depth,
      alpha,
      beta,
      ply,
      index,
      reduction,
      switches,
      counter,
      killers,
      keys,
    );
    unmakeMove(position, move, undo);
    index++;

    if (score > best) {
      best = score;
      bestMove = move;
    }
    if (!prune) continue;
    if (best > alpha) alpha = best;
    if (alpha >= beta) {
      killers.record(ply, move);""", """    const isLC = lcMarks !== null && ((lcMarks[index] as number) & 1) !== 0;
    const nodesBefore = counter.nodes;
    const alphaBefore = alpha;
    const undo = makeMove(position, move);
    keys[ply + 1] = zobristKeyAfterMove(key, position, move, undo);
    const score = searchMove(
      position,
      depth,
      alpha,
      beta,
      ply,
      index,
      reduction,
      switches,
      counter,
      killers,
      keys,
    );
    unmakeMove(position, move, undo);
    index++;
    if (isLC) {
      PROBE.lcSearched++;
      PROBE.lcNodes += counter.nodes - nodesBefore;
      if (score <= alphaBefore) { PROBE.lcRefuted++; PROBE.lcNodesRefuted += counter.nodes - nodesBefore; }
      else if (score < beta) PROBE.lcRaised++;
      else PROBE.lcCut++;
    }

    if (score > best) {
      best = score;
      bestMove = move;
    }
    if (!prune) continue;
    if (best > alpha) alpha = best;
    if (alpha >= beta) {
      if (PROBE.count) {
        PROBE.cutAll++;
        if (index === 1) PROBE.cutFirst++;
        if (isLC) PROBE.cutLC++;
        if (lcAhead) { PROBE.cutsLCAhead++; PROBE.cutIdxLCAhead += index - 1; }
      }
      killers.record(ply, move);""")
sub(sp, "  const rootMoves = ordered(moves, 0, switches, killers, hashMove);",
        "  const rootMoves = ordered(moves, 0, switches, killers, hashMove, position);")

# ---------------------------------------------------------------- engine.ts: both orderMoves call sites get the position
sub(ep, "  for (const move of orderMoves(moves, budget.killers.at(ply), hashMove)) {",
        "  for (const move of orderMoves(moves, budget.killers.at(ply), hashMove, position)) {")
sub(ep, """  const rootMoves = orderMoves(
    moves,
    budget.killers.at(0),
    slot === -1 ? null : entryMove(slot, moves),
  );""", """  const rootMoves = orderMoves(
    moves,
    budget.killers.at(0),
    slot === -1 ? null : entryMove(slot, moves),
    position,
  );""")
print("patched 234")
