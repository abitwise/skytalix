# arch-ABC-233: scratch probe patch for O1h (history heuristic) on `git archive <main> src package.json`
# (src tree 58fa3eb4 = e72487e1's, futility in force). Run AFTER patch_post268.py (arch-post-268's, unchanged), so the
# P1 information row (ADR-0060 decision 1 over the history door) shares one tree. Defaults (hh 0) = main, node for node.
# Knobs: hh (0/1), hhIndex ("cft" side x from x to | "ft" from x to | "pt" piece x to), hhMalus (0/1),
# hhMax (gravity bound), hhRoot (order the root by history: 0/1). Counters only when PROBE.count; audit when auditKind "hh".
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

# --- search.ts: knobs and counters in PROBE
sub(sp, "  fut: 0, futDepth: 2, nmpDiv: 0,\n",
"""  fut: 0, futDepth: 2, nmpDiv: 0,
  hh: 0, hhIndex: "cft" as "cft" | "ft" | "pt", hhMalus: 1, hhMax: 16384, hhRoot: 1, auditKind: "lmr" as "lmr" | "hh",
  cutAll: 0, cutFirst: 0, cutQ: 0, cutQIdx: 0, cutQKiller: 0, ordNodes: 0, ordChanged: 0,
""")
# the LMR audit mark stands down when the history audit runs
sub(sp, "  if (PROBE.audit <= 0 || alpha + 1 !== beta) return false;",
        "  if (PROBE.audit <= 0 || PROBE.auditKind !== \"lmr\" || alpha + 1 !== beta) return false;")

# --- search.ts: the history table, its update, its read, the probe's counters and audit mark
sub(sp, "/** Sort tiers: the hash move above every capture, every capture above every killer. */",
"""/** SCRATCH PROBE ONLY (arch-ABC-233): the history table, cleared at every search entry. */
const HH = new Int32Array(2 * 64 * 64);
const sq64 = (s: number): number => (s & 7) | ((s >> 4) << 3);
function hhIdx(move: Move): number {
  if (PROBE.hhIndex === "ft") return sq64(move.from) * 64 + sq64(move.to);
  if (PROBE.hhIndex === "pt") return (move.piece & 15) * 64 + sq64(move.to);
  return (isBlack(move.piece) ? 4096 : 0) + sq64(move.from) * 64 + sq64(move.to);
}
export function hhClear(): void { HH.fill(0); }
export function hhSnap(): Int32Array { return HH.slice(); }
export function hhLoad(snap: Int32Array): void { HH.set(snap); }
export function hhNonZero(): number { let n = 0; for (const v of HH) if (v !== 0) n++; return n; }
export function isQuietMove(m: Move): boolean { return m.captured === EMPTY && m.promotion === EMPTY; }
function hhAdd(move: Move, bonus: number): void {
  const i = hhIdx(move);
  const v = HH[i] as number;
  HH[i] = v + bonus - Math.trunc((v * Math.abs(bonus)) / PROBE.hhMax);
}
/** A quiet move's beta cutoff at remaining depth d: + d*d to it, - d*d to each quiet searched before it here. */
export function hhCut(move: Move, depth: number, tried: readonly Move[]): void {
  if (PROBE.hh === 0 || !isQuietMove(move)) return;
  const bonus = depth * depth;
  hhAdd(move, bonus);
  if (PROBE.hhMalus === 1) for (const q of tried) hhAdd(q, 0 - bonus);
}
export function probeCut(index: number, move: Move, killers: readonly Move[]): void {
  if (!PROBE.count) return;
  PROBE.cutAll++;
  if (index === 0) PROBE.cutFirst++;
  if (isQuietMove(move)) {
    PROBE.cutQ++;
    PROBE.cutQIdx += index;
    if (killers.some((k) => sameMove(k, move))) PROBE.cutQKiller++;
  }
}
/** Counts nodes whose order history changed; the hh audit samples such null-window nodes with a table snapshot. */
export function probeOrderMark(position: Position, moves: readonly Move[], got: readonly Move[], killers: readonly Move[], hashMove: Move | null, depth: number, alpha: number, beta: number): void {
  if (PROBE.hh === 0) return;
  const audit = PROBE.audit > 0 && PROBE.auditKind === "hh";
  if (!PROBE.count && !audit) return;
  const plain = orderMoves(moves, killers, hashMove, false);
  let changed = false;
  for (let i = 0; i < plain.length; i++) if (!sameMove(plain[i] as Move, got[i] as Move)) { changed = true; break; }
  if (PROBE.count) { PROBE.ordNodes++; if (changed) PROBE.ordChanged++; }
  if (!audit || !changed || alpha + 1 !== beta) return;
  PROBE.fired++;
  if (depth <= PROBE.auditMaxDepth && PROBE.fired % PROBE.audit === 0) {
    PROBE.auditLog.push({ kind: "hh", fen: toFen(position), depth, alpha, beta, snap: hhSnap() } as never);
  }
}
const KILLER_KEY = 500_000;

/** Sort tiers: the hash move above every capture, every capture above every killer. */""")

sub(sp, """function orderKey(move: Move, killers: readonly Move[], hashMove: Move | null): number {
  if (hashMove !== null && sameMove(move, hashMove)) return HASH_MOVE_KEY;
  if (move.captured !== EMPTY || move.promotion !== EMPTY) return TACTICAL_KEY + mvvLvaKey(move);
  const killer = killers.findIndex((candidate) => sameMove(candidate, move));
  return killer === -1 ? 0 : killers.length - killer;
}""", """function orderKey(move: Move, killers: readonly Move[], hashMove: Move | null, hist: boolean): number {
  if (hashMove !== null && sameMove(move, hashMove)) return HASH_MOVE_KEY;
  if (move.captured !== EMPTY || move.promotion !== EMPTY) return TACTICAL_KEY + mvvLvaKey(move);
  const killer = killers.findIndex((candidate) => sameMove(candidate, move));
  if (killer !== -1) return KILLER_KEY + killers.length - killer;
  return hist && PROBE.hh === 1 ? (HH[hhIdx(move)] as number) : 0;
}""")
sub(sp, """  hashMove: Move | null,
): Move[] {
  const count = moves.length;""", """  hashMove: Move | null,
  hist = true,
): Move[] {
  const count = moves.length;""")
sub(sp, "    const key = orderKey(move, killers, hashMove);", "    const key = orderKey(move, killers, hashMove, hist);")
sub(sp, """  hashMove: Move | null,
): readonly Move[] {
  if (switches.ordering === "none") return moves;
  if (switches.ordering === "mvv-lva") return orderMoves(moves, NO_KILLERS, null);
  return orderMoves(moves, killers.at(ply), hashMove);
}""", """  hashMove: Move | null,
  hist = true,
): readonly Move[] {
  if (switches.ordering === "none") return moves;
  if (switches.ordering === "mvv-lva") return orderMoves(moves, NO_KILLERS, null);
  return orderMoves(moves, killers.at(ply), hashMove, hist);
}""")

# search.ts negamax: the tried-quiets list, the order mark, the cutoff update
sub(sp, """  let index = 0;
  for (const move of ordered(moves, ply, switches, killers, hashMove)) {""", """  let index = 0;
  const hhTried: Move[] = [];
  const orderedList = ordered(moves, ply, switches, killers, hashMove);
  probeOrderMark(position, moves, orderedList, killers.at(ply), hashMove, depth, alphaIn, beta);
  for (const move of orderedList) {""")
sub(sp, """    if (alpha >= beta) {
      killers.record(ply, move);
      break; // the opponent would never allow this node; the rest cannot matter
    }
""", """    if (alpha >= beta) {
      probeCut(index - 1, move, killers.at(ply));
      hhCut(move, depth, hhTried);
      killers.record(ply, move);
      break; // the opponent would never allow this node; the rest cannot matter
    }
    if (PROBE.hh === 1 && isQuietMove(move)) hhTried.push(move);
""")
# search.ts root: cleared per search; root order by history only when hhRoot
sub(sp, "  if (switches.table) clearTable();\n", "  if (switches.table) clearTable();\n  hhClear();\n")
sub(sp, "  const rootMoves = ordered(moves, 0, switches, killers, hashMove);",
        "  const rootMoves = ordered(moves, 0, switches, killers, hashMove, PROBE.hhRoot === 1);")

# --- engine.ts
sub(ep, """  orderMoves,
  repeatsInPath,
} from "./search.ts";""", """  orderMoves,
  repeatsInPath,
  hhClear,
  hhCut,
  isQuietMove,
  PROBE,
} from "./search.ts";""")
sub(ep, "  budget.keys[0] = zobristKey(position);\n  clearTable();\n",
        "  budget.keys[0] = zobristKey(position);\n  clearTable();\n  hhClear();\n")
sub(ep, """  const rootMoves = orderMoves(
    moves,
    budget.killers.at(0),
    slot === -1 ? null : entryMove(slot, moves),
  );""", """  const rootMoves = orderMoves(
    moves,
    budget.killers.at(0),
    slot === -1 ? null : entryMove(slot, moves),
    PROBE.hhRoot === 1,
  );""")
sub(ep, """  let index = 0;
  for (const move of orderMoves(moves, budget.killers.at(ply), hashMove)) {""", """  let index = 0;
  const hhTried: Move[] = [];
  for (const move of orderMoves(moves, budget.killers.at(ply), hashMove)) {""")
sub(ep, """    if (alpha >= beta) {
      budget.killers.record(ply, move);
      break;
    }
  }""", """    if (alpha >= beta) {
      hhCut(move, remaining, hhTried);
      budget.killers.record(ply, move);
      break;
    }
    if (PROBE.hh === 1 && isQuietMove(move)) hhTried.push(move);
  }""")
print("patched 233")
