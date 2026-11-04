#!/usr/bin/env python3
"""arch-ABC-283-mate probe patch, applied to a SCRATCH copy of grugops/ABC-283 src/ (tree 8171d713).

Adds, all scratch-only:
  - PROBE: candidate switches K1L, K1F, K2, K3 (all gated on `history` on), the H-pre bottom-tier
    reversal (history off only), and a trace hook with the move path;
  - searchWith(position, depth, overrides) and chooseMoveWith(position, options, overrides): the
    shipped switches with overrides, for door-by-door runs on the head.
With every PROBE flag false and no override, the copy is the branch, node for node.
usage: python3 patch_probe.py <copy>/src
"""
import sys
from pathlib import Path

src = Path(sys.argv[1])


def sub(text, old, new, count=1):
    n = text.count(old)
    assert n == count, (old[:80], n)
    return text.replace(old, new)


s = (src / "search.ts").read_text()

s = sub(s, 'import { zobristKey, zobristKeyAfterMove, zobristKeyAfterNullMove } from "./zobrist.ts";\n',
        'import { zobristKey, zobristKeyAfterMove, zobristKeyAfterNullMove } from "./zobrist.ts";\n'
        'import { squareName } from "./position.ts";\n'
        '// biome-ignore lint: scratch probe\n'
        'export const PROBE: { k1L: boolean; k1F: boolean; k2: boolean; k3: boolean; reverseQuiet: boolean; trace: null | ((e: any) => void); path: string[] } = { k1L: false, k1F: false, k2: false, k3: false, reverseQuiet: false, trace: null, path: [] };\n'
        'export const mvName = (m: Move): string => squareName(m.from) + squareName(m.to);\n'
        '/** Scratch: each list entry\'s index in the history-off order (hash, captures, killers, losing captures, quiets in generation order). */\n'
        'export function preHistoryIndices(list: readonly Move[], moves: readonly Move[], killers: readonly Move[], hashMove: Move | null, seePosition: Position | null): number[] {\n'
        '  const off = orderMoves(moves, killers, hashMove, seePosition, false);\n'
        '  return list.map((m) => off.indexOf(m));\n'
        '}\n')

# K3: promote, never demote.
s = sub(s, '  return history ? (HISTORY[historyIndex(move)] as number) : 0;\n}',
        '  if (!history) return 0;\n  const h = HISTORY[historyIndex(move)] as number;\n  return PROBE.k3 ? Math.max(0, h) : h;\n}')

# H-pre: reverse the bottom tier when history is off.
s = sub(s, '    const key = orderKey(move, killers, hashMove, seePosition, history);\n',
        '    let key = orderKey(move, killers, hashMove, seePosition, history);\n'
        '    if (PROBE.reverseQuiet && !history && key === 0) key = i + 1;\n')

# recordHistoryCutoff: K1F reads the pre-history index for the skip test.
s = sub(s, '  depth: number,\n  futile: boolean,\n): void {\n',
        '  depth: number,\n  futile: boolean,\n  pre: number[] | null = null,\n): void {\n')
s = sub(s, '    if (futile && futileMove(position, move, index)) continue;\n    addHistory(move, 0 - bonus);',
        '    if (futile && futileMove(position, move, PROBE.k1F && pre ? (pre[index] as number) : index)) continue;\n    addHistory(move, 0 - bonus);')

# search.ts negamax
s = sub(s, '''  const list = ordered(position, moves, ply, switches, killers, hashMove);
  for (const move of list) {
    if (futile && futileMove(position, move, index)) {
      index++;
      continue;
    }
    const reduction = switches.reductions
      ? lateMoveReduction(position, move, depth, index, false)
      : 0;
''', '''  const list = ordered(position, moves, ply, switches, killers, hashMove);
  const pre =
    switches.history && (PROBE.k1L || PROBE.k1F || PROBE.trace !== null) && switches.ordering === "full"
      ? preHistoryIndices(list, moves, killers.at(ply), hashMove, switches.seeOrdering ? position : null)
      : null;
  for (const move of list) {
    const fIndex = PROBE.k1F && pre ? (pre[index] as number) : index;
    const lIndex = PROBE.k1L && pre ? (pre[index] as number) : index;
    if (futile && futileMove(position, move, fIndex)) {
      if (PROBE.trace) PROBE.trace({ rec: "s", ply, depth, alphaIn, beta, index, pre: pre ? pre[index] : -1, move: mvName(move), skipped: true, path: PROBE.path.join(" ") });
      index++;
      continue;
    }
    const reduction = switches.reductions
      ? lateMoveReduction(position, move, depth, lIndex, false)
      : 0;
    PROBE.path.push(mvName(move));
''')
s = sub(s, '''      phaseAfterMove(phase, move),
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
      if (switches.history) recordHistoryCutoff(position, list, index - 1, depth, futile);''',
'''      phaseAfterMove(phase, move),
    );
    unmakeMove(position, move, undo);
    PROBE.path.pop();
    if (PROBE.trace) PROBE.trace({ rec: "s", ply, depth, alphaIn, alpha, beta, index, pre: pre ? pre[index] : -1, move: mvName(move), reduction, score, h: switches.history ? (HISTORY[historyIndex(move)] as number) : 0, futile, path: PROBE.path.join(" ") });
    index++;

    if (score > best) {
      best = score;
      bestMove = move;
    }
    if (!prune) continue;
    if (best > alpha) alpha = best;
    if (alpha >= beta) {
      if (switches.history && !(PROBE.k2 && Math.abs(best) >= MATE_FLOOR)) recordHistoryCutoff(position, list, index - 1, depth, futile, pre);''')

# table cutoff trace (search.ts)
s = sub(s, '''    const settled = tableCutoff(slot, depth, alpha, beta, ply);
    if (settled !== null) return settled;
  }

  if (switches.nullMove && alpha + 1 === beta) {''', '''    const settled = tableCutoff(slot, depth, alpha, beta, ply);
    if (settled !== null) {
      if (PROBE.trace) PROBE.trace({ rec: "s", ply, depth, alpha, beta, tt: settled, path: PROBE.path.join(" ") });
      return settled;
    }
  }

  if (switches.nullMove && alpha + 1 === beta) {''')

# root path tracking (search.ts)
s = sub(s, '''    const undo = makeMove(position, move);
    keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);
''', '''    PROBE.path.push(mvName(move));
    const undo = makeMove(position, move);
    keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);
''')
s = sub(s, '''      phaseAfterMove(rootPhase, move),
    );
    unmakeMove(position, move, undo);
    index++;
''', '''      phaseAfterMove(rootPhase, move),
    );
    unmakeMove(position, move, undo);
    PROBE.path.pop();
    if (PROBE.trace) PROBE.trace({ rec: "s", ply: 0, depth, index, move: mvName(move), score, path: "" });
    index++;
''')

s += '''
/** SCRATCH: `search()`'s switches with `overrides`. */
export function searchWith(position: Position, depth: number, overrides: Partial<Switches>): SearchResult {
  return searchRoot(position, depth, {
    prune: true, quiescence: true, ordering: "full", table: true, pvs: true, reductions: true,
    nullMove: true, quiescenceEvasions: true, quietPromotions: true, futility: true, taper: true,
    seePruning: true, history: true, seeOrdering: true, ...overrides,
  });
}
'''
(src / "search.ts").write_text(s)

e = (src / "engine.ts").read_text()
e = sub(e, '} from "./search.ts";\n', '  PROBE,\n  preHistoryIndices,\n  mvName,\n} from "./search.ts";\nimport { MATE_FLOOR as MATE_FLOOR_P } from "./transposition.ts";\n')
e = sub(e, '''    budget.history,
  );
  for (const move of list) {
    if (futile && futileMove(position, move, index)) {
      index++;
      continue;
    }
    const reduction = budget.reductions
      ? lateMoveReduction(position, move, remaining, index, false)
      : 0;
''', '''    budget.history,
  );
  const pre =
    budget.history && (PROBE.k1L || PROBE.k1F || PROBE.trace !== null)
      ? preHistoryIndices(list, moves, budget.killers.at(ply), hashMove, budget.seeOrdering ? position : null)
      : null;
  for (const move of list) {
    const fIndex = PROBE.k1F && pre ? (pre[index] as number) : index;
    const lIndex = PROBE.k1L && pre ? (pre[index] as number) : index;
    if (futile && futileMove(position, move, fIndex)) {
      if (PROBE.trace) PROBE.trace({ rec: "e", ply, depth: remaining, alphaIn, beta, index, pre: pre ? pre[index] : -1, move: mvName(move), skipped: true, path: PROBE.path.join(" ") });
      index++;
      continue;
    }
    const reduction = budget.reductions
      ? lateMoveReduction(position, move, remaining, lIndex, false)
      : 0;
    PROBE.path.push(mvName(move));
''')
e = sub(e, '''    } finally {
      unmakeMove(position, move, undo);
    }
    index++;

    if (score > best) {
      best = score;
      bestMove = move;
    }
    if (best > alpha) alpha = best;
    if (alpha >= beta) {
      if (budget.history) recordHistoryCutoff(position, list, index - 1, remaining, futile);''', '''    } finally {
      unmakeMove(position, move, undo);
      PROBE.path.pop();
    }
    if (PROBE.trace) PROBE.trace({ rec: "e", ply, depth: remaining, alphaIn, alpha, beta, index, pre: pre ? pre[index] : -1, move: mvName(move), reduction, score, futile, path: PROBE.path.join(" ") });
    index++;

    if (score > best) {
      best = score;
      bestMove = move;
    }
    if (best > alpha) alpha = best;
    if (alpha >= beta) {
      if (budget.history && !(PROBE.k2 && Math.abs(best) >= MATE_FLOOR_P)) recordHistoryCutoff(position, list, index - 1, remaining, futile, pre);''')
e = sub(e, '''    const settled = tableCutoff(slot, remaining, alpha, beta, ply);
    if (settled !== null) return settled;''', '''    const settled = tableCutoff(slot, remaining, alpha, beta, ply);
    if (settled !== null) {
      if (PROBE.trace) PROBE.trace({ rec: "e", ply, depth: remaining, alpha, beta, tt: settled, path: PROBE.path.join(" ") });
      return settled;
    }''')
e = sub(e, '''    const undo = makeMove(position, move);
    let score: number;
    try {
      budget.keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);''', '''    PROBE.path.push(mvName(move));
    const undo = makeMove(position, move);
    let score: number;
    try {
      budget.keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);''')
e = sub(e, '''        phaseAfterMove(rootPhase, move),
      );
    } finally {
      unmakeMove(position, move, undo);
    }
    index++;
''', '''        phaseAfterMove(rootPhase, move),
      );
    } finally {
      unmakeMove(position, move, undo);
      PROBE.path.pop();
    }
    if (PROBE.trace) PROBE.trace({ rec: "e", ply: 0, depth: remaining, alpha: alphaIn, beta: betaIn, index, move: mvName(move), score, path: "" });
    index++;
''')
e += '''
/** SCRATCH: `chooseMove`'s heuristics with `overrides`. */
export function chooseMoveWith(position: Position, options: EngineOptions, overrides: Partial<Heuristics>): EngineChoice | null {
  return deepen(position, options, {
    pvs: true, reductions: true, nullMove: true, priorKeys: true, quiescenceEvasions: true,
    quietPromotions: true, futility: true, taper: true, seePruning: true, history: true,
    seeOrdering: true, aspiration: true, ...overrides,
  });
}
'''
(src / "engine.ts").write_text(e)
print("patched", src)
