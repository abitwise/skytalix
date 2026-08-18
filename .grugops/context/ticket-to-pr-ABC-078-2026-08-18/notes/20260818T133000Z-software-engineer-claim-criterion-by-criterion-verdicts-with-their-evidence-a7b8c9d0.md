---
id: 20260818T133000Z-software-engineer-claim-criterion-by-criterion-verdicts-with-their-evidence-a7b8c9d0
kind: claim
by: software-engineer
at: 2026-08-18T13:30:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - src/engine.ts
  - src/engine.test.ts
  - src/turn-loop.ts
supersedes:
---

# `A1`–`A7`, each with the evidence that decides it. Six MET; `A1` is MET on its ceiling and MET-with-a-named-overshoot on its 3 s clause

| # | verdict | evidence |
|---|---|---|
| **`A1`** | **MET on the 5 s ceiling (30/30). The ≤ 3 s clause holds to the budget's granularity, NOT literally: 29/30 returned above 3 000 ms, worst case 3 027 ms (+27 ms, 0.9%).** | `ENGINE_DEEP=1` lane, 30 positions spanning opening / middlegame / endgame, Apple M3 and no other machine. Its own note in this folder, with the three remedies and why I chose none of them. |
| **`A2`** | **MET** | Default lane, injected clock: a 50 ms budget on `kiwipete` returns a legal move, elapsed ≤ 2x the budget on the clock it was given, and — the assertion that actually decides it — **≤ 10 × `NODES_PER_CLOCK_CHECK` nodes**, measured 3 120. A between-iterations build enters depths 3, 4 and 5 on this fixture and lands two orders of magnitude above the bound. Real-clock repetition in the deep lane: **77 ms against a 50 ms budget.** |
| **`A3`** | **MET** | `position-6`, whose best move CHANGES between depth 2 (`g5f6`) and depth 3 (`c3d5`), so the fixture can tell a kept partial iteration from a discarded one. The run completes depth 2, enters depth 3 (asserted: nodes strictly above depths 1+2 combined) and returns `g5f6` — `search(position-6, 2).move`, and NOT `c3d5`. |
| **`A4`** | **MET** | The delivered `src/` diff is ONE production file. `grep -niE 'depth\s*[:=]' src/engine.ts` returns exactly two lines: `readonly depth: number;` (a REPORTED output field) and `depth: reached,` (the completed-iteration number being reported). No depth argument, no depth default, no depth constant. Asserted in the suite over the delivered exports (`Object.keys` is exactly the four names, `chooseMove.length === 2`, `createEngine.length === 1`) and over the source text (no defaulted depth, no `MAX_DEPTH` / `DEFAULT_DEPTH` / `FIXED_DEPTH`, and the deepening loop's only bound is `now() < budget.deadline`). |
| **`A5`** | **MET** | Same position, budgets 100 / 1 000 / 3 000 ms on an injected clock: completed depths **1 / 2 / 3** — non-decreasing AND strictly greater across the range, so an engine pinned at depth 1 fails it. Fine-grained repetition in the deep lane (100 ms step): **1 / 3 / 4**. No absolute depth is asserted anywhere — ticket test note 4. |
| **`A6`** | **MET** | `src/turn-loop.ts` byte-identical, verified by empty `git diff --stat` against the base AND by equal `git hash-object` / `git rev-parse` blob hashes (`9334daf1…`). `createEngine(...)` is declared `const seamUnderTest: EngineSeam = …`, so assignability is a typecheck failure if it drifts, and `runTurnLoop` drives it through a scripted 6-ply game to end-of-input: 3 engine moves, all accepted by the loop's own `wasGenerated` membership test, outcome `{ result: null, reason: null, exitCode: 0 }` with the `input ended` notice — not `engine-failure`. |
| **`A7`** | **MET** | **209 positions** (the six roots, every position one legal move from each, and a capped, strided slice of `position-3` two plies deep; terminal positions excluded because they have no move to return) at a budget that is ALREADY SPENT when the first iteration ends. Never `null`, never a throw, every returned move present in `legalMoves`, and every position byte-identical afterwards. Real-clock repetition at a 1 ms budget in the deep lane. |

## The two things a reviewer should press on

1. **`A1`'s overshoot is the honest result of the construction, and I did not paper over it.**
   Aiming at `deadline − margin` would have made the sentence true and `budgetMs` a lie. The
   remedies are named in the `A1` note; all three belong to someone else.
2. **`NFR-005` came back BELOW its FAIL floor** — depth 4 on `kiwipete`, depth 3 on `position-6`
   at 3 s, against a floor of depth 6. Reported as a measurement, as the brief directs. The
   search it is measuring has no move ordering, no quiescence and no transposition table
   (`ABC-080`, `ABC-079`, `ABC-081` — all unbuilt), and this is the first hop at which the row is
   measurable at all.

## Scope discipline

Nothing outside the ticket was touched. No dependency changed. No existing test was edited — in
particular `src/cli.test.ts`'s computed `productionModules()` guard went green with the new
module present (1 016 tests, 0 failures), so the `ABC-103` fix held and no count needed touching.
No `finding` is claimed anywhere: `context.human_admission` is `off` on this install and these
notes are hand-authored `claim` / `decision` / `observation` / `artifact-ref` per
`agent-factory/contracts/context-note.md`.
