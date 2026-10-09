---
kind: adr
id: ADR-0027
---
# ADR-0027: Deterministic mode is the shipped engine on a virtual clock; the seed does not reach move selection

## Status

**accepted** 2026-10-09 by the owner (Olger Oeselg), verbatim: *"accept ADR-0027 and ADR-0028, accept ABC-102"*. Proposed the same day by Architect/Design.

- Written at task `wave-2026-09-25`, subtask `ruling-abc086-seed` (Workflow 07). It is the design
  ruling owed to `ABC-086`'s DoR item 10. BA/PM's re-score is `rescore-abc086`
  (`20261009T155058Z-ba-pm-decision-edddff77`).
- It builds on `ADR-0024` decision 7 (no option on a shipped entry point) and on `ADR-0026`
  decisions 2 and 10 (test-only doors; a value-changing heuristic needs a switch, doors and a
  bounded oracle). It amends neither.
- No code changes because of this ADR. `ABC-086` builds against it once BA/PM re-cuts the page.
- The probe and its raw output are in `.grugops/context/ruling-abc086-seed/probe/`. The readings
  are in that task's `notes/`. They are cited here, not restated in full.

## Context

`ABC-086` carries the epic's fifth criterion: the same position and difficulty, searched twice,
gives a reproducible move under a fixed seed. Its page names two parts, a seed and a deterministic
budget, and leaves two questions to this role.

**What the merged engine already does** (BA/PM, `…edddff77`, at `f952983`; unchanged at `092f647`):

- The clock is injected: `EngineOptions.now` (`src/engine.ts:148-149`), defaulting to `Date.now`
  (`:452`). The shipped construction, `src/cli.ts:175`, passes none.
- Wall-clock time is the only non-determinism left. The engine holds no seed and makes no random
  choice. A root tie goes to the first move in `orderMoves` order, by strict `>`.
- Under a virtual clock the engine is already 300/300 identical, in one process and across two.

**Measured at this hop.** The probe's engine is a copy of `src/engine.ts` and matches
`chooseMove` / `chooseMoveWithoutReductions` on move, score, depth and nodes in 240 of 240 cells.

- **Q1(a), a seeded root tie break, is value-changing whenever LMR is on, and work-changing
  always.**
  - To find the equal-best set under PVS, each root move after the first is searched against
    `best - 1` rather than `best`. That makes a tie fail high and get an exact score.
  - That window change alone, with no seed and the shipped first-of-set choice, moves the root
    score with LMR on, at equal depth:
    - 2 of 190 positions at depth 4 (max 5 cp), 2 of 190 at depth 5 (max 10 cp);
    - for example `startpos/g1h3` at depth 5 reads 35 shipped and 40 under (a).
  - Seeded, the score diverges on 10 of 950 runs at depth 4 (max 5 cp) and 10 of 950 at depth 5
    (max 20 cp).
  - With LMR off the same construction diverges on 0 positions at depths 3, 4 and 5. This is
    `ADR-0026`'s finding again: LMR's value depends on move order, and the root's choice
    becomes the next iteration's hash move.
  - Nodes rise by 3.3–5.2% at every depth, LMR on or off. Under the same virtual budget, the
    window alone completes one ply less on 1 of 30 positions (8 ticks) and 3 of 30 (32 ticks).
  - What (a) buys: different seeds pick different moves on 22 of 190 positions at depth 4
    (47 have a tie at the final iteration), and on 28 of 190 at depth 5.
- **The virtual clock is already a node budget.** Inside the recursion the clock is read every
  `NODES_PER_CLOCK_CHECK` (1 024) nodes (`src/engine.ts:202-208`). It is also read once at
  entry, once per iteration boundary and once at return. So with a fixed step the abort point is
  a pure function of the node count. Measured on kiwipete: 1 013–1 022 nodes per reading.
- **`HARD_CEILING_MS` does not bind a virtual budget in practice.** At one virtual millisecond
  per reading the ceiling allows 5 002 readings, which is 5 112 572 nodes (depth 8, kiwipete).
  Three real seconds buy about 0.62 M nodes here (depth 7, under load). That is load-dependent
  and not a pin.

## Decision

1. **The seed does not reach move selection (Q1(b)).**
   - Root tie breaking stays as merged: strict `>`, first in `orderMoves` order.
   - The order is the hash move first, then the ordering keys, then generation order.
   - It is explicit and deterministic, and it is not seeded.
   - `src/engine.ts` and `src/search.ts` hold no PRNG and no seed.
2. **The seed's first consumer is `ABC-087`'s blunder draw, and the generator lands with it.**
   - It is a small seeded generator, with no new dependency.
   - Its state is per instance and passed in, never module-level.
   - `ABC-085`'s seeded opening choice consumes the same generator.
   - The generator's shape is `ABC-087`'s to build within these limits.
3. **The deterministic budget is the existing `Clock`, driven by virtual time (Q2).** Deterministic
   mode is the shipped engine constructed with a virtual clock:
   `createEngine({ budgetMs, now: <virtual clock> })`, or `chooseMove` with the same options.
   - It adds no `EngineOptions` field, no `src/engine.ts` export and no node budget.
   - `ABC-078` `A4`'s export pin (`src/engine.test.ts:465-484`) is untouched.
   - `ADR-0024` decision 7 is untouched: `now` has been an option since `ABC-078`, and nothing
     new reaches a shipped entry point.
4. **The virtual clock ships as one small production module outside `src/engine.ts`.**
   - Its name and spelling are the Engineer's. The suggestion is `src/virtual-clock.ts` with
     one export.
   - The export is a factory that returns a `Clock`. Each reading advances by a fixed step.
   - The first reading is 0, the same as `src/engine.test.ts`'s `tickingClock` (`:121-128`).
   - It rejects a step that is not finite or not greater than 0, because a frozen clock never
     terminates (the contract at `src/engine.ts:109-112`). A fractional step is allowed.
   - Harnesses (`ABC-084`, `ABC-085`, `ABC-087`) import it outside any test file.
   - No production module imports it, and `src/cli.ts` never does (`ABC-086` `A5`).
   - Its rows go in `src/engine.test.ts`, not a new test file (the `N8-LANE` per-file floor).
5. **The `Clock` contract comment is re-worded, comment only.**
   - Today `src/engine.ts:107-112` reads "a test supplies virtual time instead" and "CONTRACT: real-time and NON-DECREASING".
   - It becomes: advancing and non-decreasing; `Date.now` in the shipped construction, a
     virtual clock in deterministic mode.
   - The termination sentence stays.
   - This is a comment edit in `src/engine.ts`. It changes no export, no signature and no
     behaviour.
6. **`HARD_CEILING_MS` applies to virtual milliseconds unchanged.** A virtual budget is clamped
   like a real one, with no exemption and no second constant. The step is the dial: a harness
   that needs more nodes per virtual millisecond uses a smaller step.

## Alternatives

- **Q1(a): a seeded tie break at the root.** Rejected by measurement (Context).
  - It is value-changing with LMR on, so `ADR-0026` decision 10 applies. It would need:
    - its own switch and a pair of doors;
    - "off in every older door";
    - a bounded oracle;
    - two more names in `ABC-078` `A4`'s export pin;
    - re-pointing `ABC-078` `A3`'s identity sweep.
  - It is work-changing (+3–5% nodes), which puts `NFR-005` in play.
  - All of that buys variety among equal moves. Nobody asked for it, and reproducibility, the
    criterion actually asked for, already holds without it.
- **(a) applied only to the final move, after deepening, without storing it as the hash move.**
  Rejected.
  - Whether an iteration is the final one is known only after the next one aborts. So every
    iteration needs the widened root window.
  - That window alone is the value change measured above.
- **A node budget as a new `EngineOptions` field.** Rejected.
  - It is a new option on a shipped entry point (`ADR-0024` decision 7, coding rule 7).
  - It is a second abort path to test.
  - It buys a granularity nothing needs. The virtual clock already aborts on a node count, to
    within one 1 024-node interval.
- **A node budget as a test-only door** (for example `chooseMoveWithNodeBudget`). Rejected.
  - The harnesses would become its callers outside tests, which `ADR-0026` decision 2's doors
    must not have.
  - It widens `ABC-078` `A4`'s pin with a budget that is not time, which `RISK-002`'s reading
    of that pin is there to stop.
- **Export the virtual clock from `src/engine.ts`.** Rejected. It would amend `A4`'s export pin
  for no gain. The engine owns the abort mechanism, not the clocks that drive it.
- **Leave the virtual clock in test files.** Rejected. `ABC-084`/`ABC-085` must reach it outside
  a test file (`ABC-086` Scope).

## Consequences

- **`ABC-086` falls to `XS`.** Its deliverable becomes:
  - the virtual-clock module and the contract comment;
  - `A1`, which is now a regression guard on the shipped engine under a virtual clock;
  - `A2`, `A4` and `A5`;
  - a narrowed `A6`: two engines with their own virtual clocks, interleaved in one process,
    choose what each chooses alone.
- **`ABC-087` gains the seed.** `ABC-086` `A3` (seeds actually differ) and the seed half of
  `A6` move there, applied to the blunder draw. BA/PM re-estimates its size.
- **`NFR-005` is not triggered by `ABC-086`, and `NFR-004` is unchanged.** Nothing on the search
  path changes.
- **A virtual millisecond is not a real one.** The depth reached under a virtual budget says
  nothing about the depth reached in three real seconds. `NFR-005` stays measured on the real
  clock.
- **A future request for variety among equal moves reopens this ADR.** It would arrive as a
  value-changing heuristic under `ADR-0026` decision 10, with the measurements above as its
  starting cost.
- **Carried to `ABC-087`, not decided here.** Under PVS every root move after the first has
  only a bound. A blunder draw that ranks or excludes moves by score cannot read those scores
  from the root as it stands, so `ABC-087`'s design meets the same fact this ruling did.

## Rollback

- Delete the virtual-clock module and restore the comment at `src/engine.ts:107-112`.
- Nothing else depends on this ADR. No stored data, format or dependency rests on it.
- Seeding move selection later is a new ADR under `ADR-0026` decision 10, not a revert of this
  one.
