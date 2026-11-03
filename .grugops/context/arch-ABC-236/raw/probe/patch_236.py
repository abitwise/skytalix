# arch-ABC-236 scratch patch: root aspiration windows in src/engine.ts (chooseMove's deepening only).
# Usage: python3 patch_236.py <scratch root>. With ASP.on = 0 the result is main, node for node.
import sys, pathlib

p = pathlib.Path(sys.argv[1]) / "src" / "engine.ts"
s = p.read_text()

def sub(old, new, count=1):
    global s
    assert s.count(old) == count, (old, s.count(old))
    s = s.replace(old, new)

sub("""import {
  BOUND_EXACT,
  boundOf,""", """import {
  BOUND_EXACT,
  BOUND_LOWER,
  MATE_FLOOR,
  boundOf,""")

# Knobs and counters (exported, scratch only).
sub("""/** The quiescence rules this recursion hands `quiesce`""", """// SCRATCH (arch-ABC-236): aspiration knobs and counters. on 0 = main.
export const ASP = {
  on: 0,
  from: 5,
  delta: 50,
  grow: 2,
  cap: 400,
  oneStep: 0,
  log: null as null | { depth: number; score: number; move: Move; fails: number; nodes: number }[],
  c: {
    iters: 0, windowed: 0, mateGuard: 0, passes: 0, failLow: 0, failHigh: 0, flip: 0, itersFailed: 0,
    nodesAll: 0, nodesGated: 0, nodesWindowed: 0, nodesFailed: 0, abortedInWindow: 0, maxPasses: 0,
  },
};
export function aspReset(): void {
  for (const k of Object.keys(ASP.c) as (keyof typeof ASP.c)[]) ASP.c[k] = 0;
}

/** The quiescence rules this recursion hands `quiesce`""")

# runIteration takes a window and reports a fail.
sub("""interface Iteration {
  readonly move: Move;
  readonly score: number;
}""", """interface Iteration {
  readonly move: Move;
  readonly score: number;
  readonly fail?: number;
}""")

sub("""function runIteration(
  position: Position,
  moves: readonly Move[],
  remaining: number,
  budget: Budget,
): Iteration {""", """function runIteration(
  position: Position,
  moves: readonly Move[],
  remaining: number,
  budget: Budget,
  alpha0: number = Number.NEGATIVE_INFINITY,
  beta0: number = Number.POSITIVE_INFINITY,
): Iteration {""")

sub("""  let alpha = Number.NEGATIVE_INFINITY;
  let best = Number.NEGATIVE_INFINITY;
  let bestMove = rootMoves[0] as Move;

  let index = 0;
  for (const move of rootMoves) {""", """  let alpha = alpha0;
  let best = Number.NEGATIVE_INFINITY;
  let bestMove = rootMoves[0] as Move;

  let index = 0;
  for (const move of rootMoves) {""")

sub("""      score = searchMove(
        position,
        remaining,
        alpha,
        Number.POSITIVE_INFINITY,
        0,
        index,
        reduction,
        budget,
      );""", """      score = searchMove(position, remaining, alpha, beta0, 0, index, reduction, budget);""")

sub("""    if (best > alpha) alpha = best;
  }

  storeEntry(rootKey, remaining, BOUND_EXACT, best, 0, bestMove);
  return { move: bestMove, score: best };
}""", """    if (best > alpha) alpha = best;
    if (best >= beta0) break;
  }

  if (best >= beta0) {
    storeEntry(rootKey, remaining, BOUND_LOWER, best, 0, bestMove);
    return { move: bestMove, score: best, fail: 1 };
  }
  if (best <= alpha0) return { move: bestMove, score: best, fail: -1 };
  storeEntry(rootKey, remaining, BOUND_EXACT, best, 0, bestMove);
  return { move: bestMove, score: best };
}

/** SCRATCH (arch-ABC-236): one iteration under an aspiration window around `prev`, widened on a fail. */
function aspirate(
  position: Position,
  moves: readonly Move[],
  depth: number,
  budget: Budget,
  prev: number,
): Iteration {
  const c = ASP.c;
  if (Math.abs(prev) >= MATE_FLOOR) {
    c.mateGuard++;
    return runIteration(position, moves, depth, budget);
  }
  c.windowed++;
  const NEG = Number.NEGATIVE_INFINITY;
  const POS = Number.POSITIVE_INFINITY;
  let delta = ASP.delta;
  let alpha = prev - delta;
  let beta = prev + delta;
  let lastFail = 0;
  let passes = 0;
  let failed = false;
  for (;;) {
    const before = budget.nodes;
    let r: Iteration;
    passes++;
    c.passes++;
    try {
      r = runIteration(position, moves, depth, budget, alpha, beta);
    } catch (error) {
      c.nodesWindowed += budget.nodes - before;
      c.abortedInWindow++;
      throw error;
    }
    c.nodesWindowed += budget.nodes - before;
    if (!r.fail) {
      if (passes > c.maxPasses) c.maxPasses = passes;
      if (failed) c.itersFailed++;
      return r;
    }
    failed = true;
    c.nodesFailed += budget.nodes - before;
    if (r.fail < 0) c.failLow++;
    else c.failHigh++;
    if (lastFail !== 0 && r.fail !== lastFail) c.flip++;
    lastFail = r.fail;
    if (ASP.oneStep) {
      if (r.fail < 0) alpha = NEG;
      else beta = POS;
      continue;
    }
    delta *= ASP.grow;
    if (r.fail < 0) {
      const a = r.score - delta;
      alpha = delta > ASP.cap || a <= -MATE_FLOOR ? NEG : a;
    } else {
      const b = r.score + delta;
      beta = delta > ASP.cap || b >= MATE_FLOOR ? POS : b;
    }
  }
}""")

# deepen: windows from ASP.from, counters, per-iteration log.
sub("""  let best = runIteration(position, rootMoves, 1, budget);
  let reached = 1;""", """  let best = runIteration(position, rootMoves, 1, budget);
  let reached = 1;
  ASP.c.iters++;
  ASP.log?.push({ depth: 1, score: best.score, move: best.move, fails: 0, nodes: budget.nodes });""")

sub("""    let deeper: Iteration;
    try {
      deeper = runIteration(position, rootMoves, iteration, budget);
    } catch (error) {
      // The register is written only here, from a value a COMPLETED iteration returned. An
      // aborted iteration leaves `best` and `reached` untouched, which is `A3`.
      if (error === ABORTED) break;
      throw error;
    }
    best = deeper;
    reached = iteration;
  }""", """    let deeper: Iteration;
    const before = budget.nodes;
    const fails0 = ASP.c.failLow + ASP.c.failHigh;
    try {
      deeper =
        ASP.on && iteration >= ASP.from
          ? aspirate(position, rootMoves, iteration, budget, best.score)
          : runIteration(position, rootMoves, iteration, budget);
    } catch (error) {
      if (iteration >= ASP.from) ASP.c.nodesGated += budget.nodes - before;
      // The register is written only here, from a value a COMPLETED iteration returned. An
      // aborted iteration leaves `best` and `reached` untouched, which is `A3`.
      if (error === ABORTED) break;
      throw error;
    }
    if (iteration >= ASP.from) ASP.c.nodesGated += budget.nodes - before;
    ASP.c.iters++;
    ASP.log?.push({
      depth: iteration,
      score: deeper.score,
      move: deeper.move,
      fails: ASP.c.failLow + ASP.c.failHigh - fails0,
      nodes: budget.nodes - before,
    });
    best = deeper;
    reached = iteration;
  }
  ASP.c.nodesAll += budget.nodes;""")

p.write_text(s)
print("patched", p)
