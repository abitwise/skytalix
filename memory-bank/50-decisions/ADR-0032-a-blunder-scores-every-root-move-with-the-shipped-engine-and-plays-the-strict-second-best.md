---
kind: adr
id: ADR-0032
---
# ADR-0032: A blunder move scores every root move with the SHIPPED engine, on the child, inside the level's own budget, and plays the strict second-best. The root window is not widened

## Status

**proposed** 2026-10-10 by Architect/Design (task `wave-2026-09-25`, subtask `ruling-abc083-abc087`). It rules
question **R3** of BA/PM's re-score (`20261010T081343Z-ba-pm-decision-…-973fd389`), which gates `ABC-087`'s
`Ready`. **Owner acceptance owed.** No agent moves an ADR to `accepted`.

- It builds on `ADR-0027` (accepted) and amends nothing in it. Decision 1 there (the seed does not reach
  `chooseMove`) and decision 2 (the generator lands with `ABC-087`, its state per instance) both hold.
- `ADR-0026` decision 10 is **not triggered.** No search heuristic changes, and the engine's value is unchanged.
- **No code changes because of this ADR.** The probe and raw readings are in
  `.grugops/context/ruling-abc083-abc087/probe/`. The readings are in that task's `notes/` (`…748b4f7b`).

## Context

`ABC-087`'s blunder draw must play "a move that is not the best", and `A4` forbids the worst-scoring move. Both
need per-move scores. R3 asks for three things: (a) score candidates separately, inside the per-move budget,
or (b) widen the root window under `ADR-0026` decision 10; n-th best or uniform non-worst; and what "worst" is
on the chosen scores.

**The page's premise, corrected.**
- **The root lacks per-move scores because of alpha-beta, not only PVS.** `searchRoot` and `runIteration`
  raise the root's alpha to the best score so far (`src/search.ts:549`;
  `src/engine.ts:406`). A later move that does not beat it returns only an upper bound, with PVS on or off.
  The pre-`ABC-121` engine had the same property. So (b) means turning off the root's alpha-beta, not
  just its null window.
- **The "+3.3–5.2% nodes" on the page is `ADR-0027`'s `best - 1` window.** That window makes TIES exact, not
  every move. It is not the price of (b).

**Measured at this hop** (deterministic node counts and scores; out-of-tree copy, node-identical to the
worktree on 12/12 cells):

- **(b)'s price.** Every root move on the full window, compared with the shipped `search()`. Nodes at fixed
  depth:

  | | d3 | d4 | d5 |
  |---|---:|---:|---:|
  | `kiwipete` | 11.2x | 5.7x | **13.3x** |
  | `position-6` | 12.4x | 5.9x | 6.8x |
  | `startpos` | 5.9x | 2.5x | 7.7x |
  | `position-3` | 8.7x | 7.0x | 8.1x |
  | `position-5` | 5.6x | 3.7x | 6.9x |
  | `position-4` | 1.5x | 1.6x | 1.9x |

  The best root score is the same on all 18 cells.
- **What each blunder rule plays.** Exact per-move scores (full-window root, depth 3), on `buildCorpus()`'s
  184 positions and `ABC-084`'s 40 puzzles. A "big loss" is ≥ 300 cp, a minor piece:

  | rule | corpus184: big loss | median loss | puzzles40: big loss | median loss |
  |---|---:|---:|---:|---:|
  | uniform over moves not the worst (best included) | **58.2%** | — | 50.3% | — |
  | uniform over moves strictly between best and worst | **60.4%** | 349 cp (median of means) | 55.0% | 475 cp |
  | **strict second-best** (decision 2) | **10.9%** | **55 cp** | 42.5% | 100 cp |

  - The rank-2 move **ties the best** on 30/184 (16%) and 15/40, so a non-strict "second best" would be no
    mistake at all that often.
  - Positions with no strict-second candidate: 1/184 and 0/40.
  - The puzzles are tactical by construction (a mate in 2, a material win, or a losing capture on the
    board), so a large loss there is what missing the point costs.
- **(a) on the shipped engine.** Virtual clock, step 5 ms. That calibrates to about 606k nodes per 3,000
  ms, against the M3's 640k–686k real. Main search vs the children of construction (a):

  | position | budget | main depth | child depth min / median / max | elapsed (virtual ms), main vs (a) |
  |---|---:|---:|---|---|
  | `startpos` | 3,000 | 8 | 5 / 5 / 6 | 3,005 / 3,015 |
  | `kiwipete` | 3,000 | 6 | 1 / 3 / 3 | 3,005 / 3,015 |
  | `position-6` | 3,000 | 7 | 3 / 3 / 4 | 3,005 / 3,015 |
  | `kiwipete` | 1,000 | 5 | 1 / 1 / 2 | 1,005 / 1,015 |

  Part of the gap is the virtual clock. Each child pays fixed readings (entry, each iteration boundary,
  return), and each reading costs one step. That is about 4–6 steps per child, and the wall clock does not
  charge for them.

## Decision

1. **Construction (a) ships, in the level module. `src/engine.ts` and `src/search.ts` do not change.**
   - **The draw comes first.** One seeded draw per move decides, before any search, whether this move is a
     blunder.
   - **Not a blunder:** `chooseMove(position, { budgetMs, now })`, exactly as shipped. A non-blunder move costs
     nothing extra, and a level with rate 0 IS the shipped engine.
   - **A blunder:** score every legal root move on its child with the shipped `chooseMove`.
     - Go in `legalMoves` order, on one clock, against one shared deadline. For move `i` of `N`:
       `budgetMs = start + B·(i+1)/N − now()`, where `B = min(level budget, HARD_CEILING_MS)`.
     - An overrun by one child shortens the next. A non-positive budget still runs the engine's unabortable
       depth 1.
     - A move's score is minus its child's score.
     - A child with no legal move is scored from `gameStatus`: checkmate is `MATE_SCORE − 1` for the mover;
       anything else is 0.
     - Each child is made and unmade in a `finally`, so the borrowed position comes back byte-identical.
   - **The level layer clamps its own total.** `NFR-004`'s ceiling is enforced per `chooseMove` call
     (`src/engine.ts:464`), and that does not bound a SUM of calls. That is why `B` is clamped above.
   - **The clock is passed in,** the same way as `EngineOptions.now`. The level module is a production module,
     so it never imports `src/virtual-clock.ts` (`ADR-0027` decision 4).
2. **A blunder plays the STRICT second-best.**
   - That is the highest-scoring move whose score is strictly below the best and strictly above the worst.
   - Ties within that class go to the first move scored (strict `>`).
   - **If no move qualifies** (fewer than three distinct scores), no blunder is possible. The move played is
     the first move of the best class, and the decision records that there was no candidate. No second draw
     is made: the seed is consumed once per move.
   - **`n` is fixed at 2 and is not a level field.** A level stays a budget and a rate (`A1`).
3. **What `A4` forbids, on these scores.**
   - The **worst class** is every move whose score equals the minimum of the list the blunder used, when that
     minimum is strictly below the maximum. If every move scores the same, no move is worst.
   - `A4`'s clause is asserted on **every blunder move**, against **that move's own scored list**. The module
     returns that list with the move (in the shape the Engineer chooses), so the test reads the
     construction's scores and does not re-derive them.
   - On a non-blunder move there is no list. The move is the engine's best, and the clause does not apply.
4. **Determinism and the seed.**
   - The seed reaches the draw and nothing else. `chooseMove` is never seeded (`ADR-0027` decision 1).
   - With a virtual clock, construction (a) is deterministic, because the engine is (`ADR-0027` decision 3).
   - `A7`, `A9` and `A10` hold by construction, with one generator per level instance.
5. **Unchanged:**
   - `ABC-078` `A4`'s export pin;
   - every `ABC-121` row;
   - `ADR-0026`'s doors.

   `NFR-005` is read on `chooseMove` at `DEFAULT_BUDGET_MS` directly, as `ABC-083` `A9` does. A blunder move
   is not a depth reading.

## Alternatives

- **(b) A widened root window under `ADR-0026` decision 10. Rejected by measurement.**
  - It costs 5.7–13.3x the nodes on `kiwipete` and 5.9–12.4x on `position-6` (Context). That is more than a
    ply, against a depth-7 margin of 1.05–1.12x (`AR-NFR005-082`).
  - Every level pays it. The alternative is a per-level switch, which is a new `EngineOptions` field on the
    shipped entry point (`ADR-0024` decision 7).
  - It also adds a switch, doors and a bounded oracle, and it puts `ABC-087` into `src/engine.ts` next to
    `ABC-083`.
- **A second, multi-PV root pass that excludes the best move. Rejected.**
  - It needs a root-exclusion input on `chooseMove` (`ADR-0024` decision 7) or a new export (`ABC-078`
    `A4`'s pin).
  - `A4`'s "worst" would still need every score.
- **Uniform over non-worst moves. Rejected by measurement.** 58% of picks lose a minor piece or more on the
  general corpus. That is the "random" the epic rules out. Excluding the single worst move barely changes it.
- **Non-strict n-th best** (rank 2, ties included). **Rejected:** 16% of corpus "blunders" would cost nothing,
  so the configured rate would overstate the weakening.
- **`n` as a level datum. Rejected** (coding rule 7). Reopen it only if `ABC-085`'s ladder cannot be ordered by
  budget and rate.
- **Equal-depth scoring:** `search(child, d)` for every child, deepened layer by layer under the clock.
  **Rejected.**
  - It is a second deepening loop outside the engine.
  - Its abort granularity is a whole child search, not 1,024 nodes.
  - It drives a depth-argument search from production, against `RISK-002`'s reading of `ABC-078` `A4`.
  - It buys comparable child depths. That is not worth those costs on a level built to be weaker.

## Consequences

- **`ABC-087` stays `M`, with no re-size.** It shares no file with `ABC-083`. `A3` and `A6` still read results
  that `ABC-083` moves, as the page says.
- **A blunder's scores are shallower than the main search.** The children reach 2–3 plies less, and their
  depths differ within one decision (`kiwipete` at 3 s: 1–3). A shallow child can miss a tactic, so a
  "second-best" can be worse than its score says. That is accepted for the levels that blunder. `A4` is
  defined on the construction's own scores, so the clause stays exact.
- **Budget fidelity.** The blunder path ends 10 virtual ms (two readings) after the main path's end, well inside
  `A2`'s ±20%.
- **For BA/PM to fold (not done here; the DoR re-score is BA/PM's):**
  - `A4`'s frequency is blunders played ÷ moves, with no-candidate moves left out of the denominator and
    reported;
  - `A4`'s "never the worst" is asserted per blunder move, on its returned list (decision 3);
  - `A2` includes at least one blunder move at the easiest level, with a seed chosen so that one fires, so the
    blunder path's budget is tested;
  - if the hardest level's rate is above 0, `A5` covers the blunder path too.
- **`NFR-004`:** the level layer owns the clamp on the total (decision 1). The `NFR-004` catalog row is
  Security/NFR's to word. This ADR does not edit it.

## Rollback

Remove the blunder path from the level module. The rate-0 path is the shipped engine, so nothing else
depends on this ADR, and no stored data or dependency rests on it.
