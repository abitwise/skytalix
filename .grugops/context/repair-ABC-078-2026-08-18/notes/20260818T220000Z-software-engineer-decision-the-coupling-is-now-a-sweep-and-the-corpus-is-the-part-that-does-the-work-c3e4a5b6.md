---
id: 20260818T220000Z-software-engineer-decision-the-coupling-is-now-a-sweep-and-the-corpus-is-the-part-that-does-the-work-c3e4a5b6
kind: decision
by: software-engineer
at: 2026-08-18T22:00:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - ABC-077
  - ABC-079
  - ABC-080
  - ABC-081
  - src/engine.ts
  - src/engine.test.ts
  - src/search.ts
supersedes:
---

# The coupling is a **sweep** now, not an assertion — and the CORPUS is the part that does the work

QE's `G4`: `A3` is one position, one depth, move-only, and `stalemate-as-loss` — the exact bug
`ABC-077`'s `A5` exists to catch — survives the entire suite, because that criterion guards only
the copy a game does not use. The duplication itself is settled and was not revisited: `ABC-077`'s
merged `A6` is a contract, QE verified it forces the duplication, and **`src/search.ts` and
`src/search.test.ts` are byte-identical across this hop** (`git diff bda909d HEAD` on both is
empty).

## The shape

```ts
identityDivergences(corpus, budgets)   // chooseMove's completed iteration vs search(position, depth)
```

For every position and every budget: run `chooseMove` on an injected clock, read back the depth it
reports having COMPLETED, and compare against `search(position, thatDepth)` on **`move` AND
`score`**. Depth is read back rather than fixed because `chooseMove` has no depth parameter (`A4`)
— the depth it completed is the only honest reference — and because on an injected clock that
depth is a function of node counts alone, so the whole sweep is machine-independent.

## The corpus is the fix. The score assertion alone would have caught nothing

QE proved that adding a score assertion to `A3`'s existing fixture changes nothing: `position-6` is
a quiet middlegame with no mate or stalemate inside a depth-2 horizon, so the delivered build and
both drift mutants agree there completely, in move and in score. **I re-confirmed it** — `A3`'s
fixture with its new score assertion is green under `M4` and `M4c`.

So six endgames were added, and they were chosen by measurement, not by taste. The three "corner"
positions each have a **stalemate available in one move** and a forced mate a few plies further;
the three pawn/rook endgames have neither and are there for breadth and for depth.

**What kills what, measured at the repair tip (default lane, 4 endgames, budgets 3 and 5):**

| mutant in `src/engine.ts` only | before the repair | after |
|---|---|---|
| `M4` stalemate scored as a loss | **1 016 passed — SURVIVED** | **1 failed** (3 divergences: move AND score, `29999` vs `29997`) |
| `M4c` mate distance lost | **1 016 passed — SURVIVED** | **1 failed** (3 score divergences, `30000` vs `29997`) |

**Two budgets, and both are load-bearing — neither alone reds both mutants.** At `budgetMs: 3` the
corner positions complete depth 3, which puts the MATE exactly at the horizon leaf, where
`leafScore(position, ply)` is what computes the distance — that is `M4c`'s only visible surface. At
`budgetMs: 5` they complete depth 4 and the stalemate sits inside the horizon, which is `M4`'s.
Running only budget 5 leaves `M4c` alive; running only budget 3 leaves `M4` alive. I measured both
ways round before fixing the pair.

## The lane split, with the numbers that decided it

- **Default lane:** four endgames × two budgets. **~200 ms.** `position-6` is NOT repeated here —
  `A3` above now compares it on both fields at the budget it was already running, so nothing in
  this lane is measured twice.
- **`ENGINE_DEEP=1`:** all six endgames plus every non-terminal position one legal move from each
  (**92 positions**) at both budgets — **1.5 s**; and the six benchmark roots plus their children
  (**209 positions**) at budget 5 — **19.5 s**.

The benchmark corpus is in the deep lane for the opposite reason to the endgames: it **cannot** see
a mate/stalemate drift (no such leaf is inside depths 1-3 from any of those roots, which is why the
standing corpus missed `M4` entirely), and it is there to hold the other half — that the two
recursions do not diverge in ordinary middlegame play either. Both halves, on their own corpora,
each labelled with what it can and cannot see.

**All of it is green on the delivered algorithm.** This pins a property that holds — QE's
604/604 over 260 positions, reproduced here at 92 + 209 positions — rather than chasing a defect.

## What this still does not cover

`ABC-079` (quiescence), `ABC-080` (move ordering) and `ABC-081` (transposition table) will each
land in one copy before the other, and this sweep is exactly what should red when they do. **It
will red on a legitimate improvement too** — the moment `src/search.ts` gains quiescence and
`src/engine.ts` has not, these two are supposed to disagree. That is the intended signal, not a
false positive, and whoever lands the first of those three should expect this test to be the thing
that tells them the other copy is owed. It is worth saying out loud because a red test with an
obvious "just delete it" remedy is how a coupling guard dies.
