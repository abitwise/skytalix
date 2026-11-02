# arch-phase2-p3: scratch probe patch on `git archive main src package.json`.
# Adds switchable P3 (futility), P4 (move-count pruning), P5 (null-move R by depth / eval),
# P6 (razoring) and, for calibration only, ADR-0059's reverse futility (rf) to BOTH recursions,
# plus a cut audit (sampled fire nodes, re-searched fresh with the rule on and off).
# All knobs zero = main, node for node.
import sys
root = sys.argv[1]
def sub(path, old, new, count=1):
    s = open(path).read()
    n = s.count(old)
    if n != count:
        raise SystemExit(f"{path}: expected {count} of {old[:70]!r}, found {n}")
    open(path, "w").write(s.replace(old, new))

sp = root + "/src/search.ts"
ep = root + "/src/engine.ts"

sub(sp, 'import { zobristKey, zobristKeyAfterMove, zobristKeyAfterNullMove } from "./zobrist.ts";',
'''import { zobristKey, zobristKeyAfterMove, zobristKeyAfterNullMove } from "./zobrist.ts";
import { toFen } from "./fen.ts";
import { MATE_FLOOR } from "./transposition.ts";

/** SCRATCH PROBE ONLY (arch-phase2-p3, main base). Every knob 0 = main. */
export const PROBE = {
  rf: 0, rfDepth: 3,                         // ADR-0059 reverse futility (calibration)
  fut: [0, 0, 0, 0] as number[],             // P3: margin by remaining depth (0 = off)
  futBig3: false,                            // P3 variant: only with >= 3 non-pawn pieces
  lmp: 0, lmpBase: 3, lmpMul: 1, lmpDiv: 1,  // P4: max depth; limit = floor((base + mul*d*d)/div)
  nmpDiv: 0, nmpEval: 0, nmpEvalCap: 0,      // P5: R = 3 + floor(d/div) + min(cap, floor((eval-beta)/nmpEval))
  raz: [0, 0, 0, 0] as number[],             // P6: margin by remaining depth (0 = off)
  fired: 0, pruned: 0, cut: 0,
  audit: 0, auditMaxDepth: 99, auditKinds: "" as string, auditLog: [] as { kind: string; fen: string; depth: number; alpha: number; beta: number }[],
};
function probeBand(x: number): boolean { return x >= MATE_FLOOR || x <= 0 - MATE_FLOOR; }
function probeBig3(position: Position): boolean {
  const board = position.board;
  let pieces = 0;
  for (let square = 0; square < 128; square++) {
    if (!isOnBoard(square)) continue;
    const piece = board[square] as number;
    if (piece === EMPTY || isBlack(piece) !== position.blackToMove) continue;
    const type = pieceType(piece);
    if (type !== PAWN && type !== KING && ++pieces === 3) return true;
  }
  return false;
}
function probeFire(kind: string, position: Position, depth: number, alpha: number, beta: number): void {
  PROBE.fired++;
  if (PROBE.audit > 0 && depth <= PROBE.auditMaxDepth && PROBE.fired % PROBE.audit === 0 && (PROBE.auditKinds === "" || PROBE.auditKinds.includes(kind))) {
    PROBE.auditLog.push({ kind, fen: toFen(position), depth, alpha, beta });
  }
}
/** Node-entry rules (rf, P6), after the table probe and before the null move. null = go on. */
export function probePre(position: Position, depth: number, ply: number, alpha: number, beta: number, leaf: () => number): number | null {
  if (ply === 0 || alpha + 1 !== beta) return null;
  if (PROBE.rf > 0 && depth <= PROBE.rfDepth && !probeBand(beta) && !isInCheck(position) && probeBig3(position)
      && evaluate(position) - PROBE.rf * depth >= beta) {
    probeFire("rf", position, depth, alpha, beta); PROBE.cut++;
    return beta;
  }
  const rm = PROBE.raz[depth] ?? 0;
  if (rm > 0 && !probeBand(alpha) && !probeBand(beta) && !isInCheck(position) && evaluate(position) + rm <= alpha) {
    const q = leaf();
    if (depth === 1 || q <= alpha) { probeFire("raz", position, depth, alpha, beta); PROBE.cut++; return q; }
  }
  return null;
}
/** Move-loop pruning context (P3, P4), computed once per node. */
export interface ProbeLoop { futile: boolean; limit: number; quiets: number; pruned: number }
export function probeLoop(position: Position, depth: number, ply: number, alpha: number, beta: number): ProbeLoop | null {
  if (ply === 0 || alpha + 1 !== beta) return null;
  const fm = PROBE.fut[depth] ?? 0;
  const lmpOn = PROBE.lmp > 0 && depth <= PROBE.lmp;
  if (fm <= 0 && !lmpOn) return null;
  if (probeBand(alpha) || probeBand(beta) || isInCheck(position)) return null;
  const futile = fm > 0 && (!PROBE.futBig3 || probeBig3(position)) && evaluate(position) + fm <= alpha;
  const limit = lmpOn ? Math.floor((PROBE.lmpBase + PROBE.lmpMul * depth * depth) / PROBE.lmpDiv) : Number.POSITIVE_INFINITY;
  return { futile, limit, quiets: 0, pruned: 0 };
}
export function probeSkip(ctx: ProbeLoop | null, position: Position, move: Move, index: number): boolean {
  if (ctx === null) return false;
  const quiet = move.captured === EMPTY && move.promotion === EMPTY;
  if (!quiet) return false;
  if (index > 0 && (ctx.futile || ctx.quiets >= ctx.limit) && !givesCheck(position, move)) { ctx.pruned++; PROBE.pruned++; return true; }
  ctx.quiets++;
  return false;
}
export function probeLoopDone(ctx: ProbeLoop | null, position: Position, depth: number, alpha: number, beta: number): void {
  if (ctx !== null && ctx.pruned > 0) probeFire(ctx.futile ? "fut" : "lmp", position, depth, alpha, beta);
}
/** Fresh node search (audit): search()'s switches, a cleared table, at ply 1 (not the root). */
export function probeNode(position: Position, depth: number, alpha: number, beta: number): number {
  clearTable();
  const keys = new BigUint64Array(KEY_ARRAY_CAPACITY + 1);
  keys[1] = zobristKey(position);
  const counter: NodeCounter = { nodes: 0 };
  return negamax(position, depth, alpha, beta, 1, {
    prune: true, quiescence: true, ordering: "full", table: true, pvs: true, reductions: true,
    nullMove: true, quiescenceEvasions: true, quietPromotions: true,
  }, counter, new KillerTable(), keys, false);
}''')

# P5: null move R
sub(sp, """  ply: number,
  afterNull: boolean,
): number {
  if (ply === 0 || afterNull || depth < NULL_MOVE_MIN_DEPTH) return 0;""", """  ply: number,
  afterNull: boolean,
  beta = 0,
): number {
  if (ply === 0 || afterNull || depth < NULL_MOVE_MIN_DEPTH) return 0;""")
sub(sp, """    if (type !== PAWN && type !== KING && ++pieces === NULL_MOVE_MIN_PIECES) {
      return NULL_MOVE_REDUCTION;
    }""", """    if (type !== PAWN && type !== KING && ++pieces === NULL_MOVE_MIN_PIECES) {
      let extra = PROBE.nmpDiv > 0 ? Math.floor(depth / PROBE.nmpDiv) : 0;
      if (PROBE.nmpEval > 0 && !probeBand(beta)) {
        const e = evaluate(position) - beta;
        if (e > 0) extra += Math.min(PROBE.nmpEvalCap, Math.floor(e / PROBE.nmpEval));
      }
      return NULL_MOVE_REDUCTION + extra;
    }""")

# search.ts negamax: pre rules + null move beta + loop
sub(sp, """  if (switches.nullMove && alpha + 1 === beta) {
    const nullReduction = nullMoveReduction(position, depth, ply, afterNull);
    if (nullReduction > 0) {""", """  const pre = probePre(position, depth, ply, alpha, beta, () => leafScore(position, ply, alpha, beta, switches, counter));
  if (pre !== null) return pre;

  if (switches.nullMove && alpha + 1 === beta) {
    const nullReduction = nullMoveReduction(position, depth, ply, afterNull, beta);
    if (nullReduction > NULL_MOVE_REDUCTION) probeFire("nmp", position, depth, alpha, beta);
    if (nullReduction > 0) {""")
sub(sp, """  let index = 0;
  for (const move of ordered(moves, ply, switches, killers, hashMove)) {
    const reduction = switches.reductions""", """  let index = 0;
  const pctx = probeLoop(position, depth, ply, alpha, beta);
  for (const move of ordered(moves, ply, switches, killers, hashMove)) {
    if (probeSkip(pctx, position, move, index)) { index++; continue; }
    const reduction = switches.reductions""")
sub(sp, """  if (switches.table) storeEntry(key, depth, boundOf(best, alphaIn, beta), best, ply, bestMove);
  return best;
}""", """  probeLoopDone(pctx, position, depth, alphaIn, beta);
  if (switches.table) storeEntry(key, depth, boundOf(best, alphaIn, beta), best, ply, bestMove);
  return best;
}""")

# engine.ts
sub(ep, "  nullMoveReduction,\n", "  nullMoveReduction,\n  probePre,\n  probeLoop,\n  probeSkip,\n  probeLoopDone,\n")
sub(ep, """  if (budget.nullMove && alpha + 1 === beta) {
    const nullReduction = nullMoveReduction(position, remaining, ply, afterNull);""", """  const pre = probePre(position, remaining, ply, alpha, beta, () => leafScore(position, ply, alpha, beta, budget));
  if (pre !== null) return pre;

  if (budget.nullMove && alpha + 1 === beta) {
    const nullReduction = nullMoveReduction(position, remaining, ply, afterNull, beta);""")
sub(ep, """  let index = 0;
  for (const move of orderMoves(moves, budget.killers.at(ply), hashMove)) {
    const reduction = budget.reductions
      ? lateMoveReduction(position, move, remaining, index, false)""", """  let index = 0;
  const pctx = probeLoop(position, remaining, ply, alpha, beta);
  for (const move of orderMoves(moves, budget.killers.at(ply), hashMove)) {
    if (probeSkip(pctx, position, move, index)) { index++; continue; }
    const reduction = budget.reductions
      ? lateMoveReduction(position, move, remaining, index, false)""")
sub(ep, """  storeEntry(key, remaining, boundOf(best, alphaIn, beta), best, ply, bestMove);
  return best;
}""", """  probeLoopDone(pctx, position, remaining, alphaIn, beta);
  storeEntry(key, remaining, boundOf(best, alphaIn, beta), best, ply, bestMove);
  return best;
}""")
print("patched")
