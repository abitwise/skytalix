---
id: 20261009T160220Z-architect-design-decision-what-ba-pm-folds-and-the-owner-word-owed-f3caccd1
kind: decision
by: architect-design
at: 2026-10-09T16:02:20Z
verified_by:
confidence: high
refs:
  - ABC-086
  - ABC-087
  - ABC-085
  - ABC-084
  - ABC-082
  - ADR-0027
  - NFR-005
  - N8-LANE
  - plans/tickets/ABC-086-deterministic-move-selection-under-a-fixed-seed.md
  - plans/tickets/ABC-087-difficulty-levels-as-budget-plus-blunder-rate.md
  - plans/tickets/ABC-085-self-play-ladder.md
supersedes:
---

# What BA/PM folds into the pages after Q1 (b) / Q2 (virtual clock), and the owner's word owed

Hand-authored, no `seal`. This role does not edit ticket criteria. BA/PM folds what is below, and
the wording is BA/PM's.

## `ABC-086` page

1. **DoR item 10 ⚠️.** The ruling is given (`ADR-0027`, proposed). The `Ready` move waits on the
   owner accepting `ADR-0027` (below). The Orchestrator sequences that.
2. **Tension / resolution text.**
   - Drop "an injected **seed**" from the engine. Deterministic mode becomes: the shipped
     engine plus a virtual clock (`ADR-0027` decision 3).
   - "under the shipped wall-clock default, the seed still makes tie breaking … reproducible"
     becomes: tie breaking is deterministic without a seed; the blunder draw's seed is
     `ABC-087`'s.
3. **Scope.**
   - Bullet 1 (an injected seed) **moves to `ABC-087`**.
   - Bullet 3 (deterministic mode) is now **ruled**:
     - a virtual-clock module outside `src/engine.ts`, reachable by the harnesses;
     - the `Clock` contract comment re-worded;
     - no new engine export (`ADR-0027` decisions 4–5).
   - Bullet 4 (tie breaking explicit and seeded) is **struck**: tie breaking stays as merged.
4. **Criteria.**
   - **`A1`.** "the same seed" drops out. The deterministic budget is the shipped virtual-clock
     module, not a test-local clock. The lane split and the depth ≥ 4 floor are unchanged.
   - **`A2`.** "and seed" drops out. Otherwise unchanged.
   - **`A3` moves to `ABC-087`,** re-aimed at the blunder draw. Test note 5 (the tie-fixture
     certification) and the `ABC-082` merge-order overlap leave this page with it. A blunder-draw
     `A3` needs no tie fixture.
   - **`A4`.** Unchanged. The virtual-clock module falls under its grep too.
   - **`A5`.**
     - Add: `src/cli.ts` does not import the virtual-clock module.
     - `ABC-078` `A4`'s export pin needs **no** amendment now.
     - The "amend openly, never loosen" sentence can stay as a guard.
   - **`A6`.**
     - Narrow it to clock isolation: two engines with their own virtual clocks, called
       interleaved in one process, each choose what they choose alone.
     - The clock's state is per instance (a closure), never module state.
     - The seed half moves to `ABC-087`.
   - **A step guard** (BA/PM decides whether it is a new criterion or a clause of `A1`): the
     virtual clock throws on a step that is not finite or not greater than 0.
5. **Triggers.**
   - `NFR-005` is **not triggered** (nothing on the search path changes).
   - `NFR-004` is unchanged (`A5`).
   - `N8-LANE`: the virtual-clock rows go in `src/engine.test.ts`.
6. **Size `XS` (1)**, the page's own pre-stated outcome for (b). Test notes 2 and 4 move to
   `ABC-087`.
7. **Title (BA/PM's call).** "under a fixed seed" now describes `ABC-087`'s half. The epic's
   fifth criterion is met jointly: `ABC-086` (deterministic mode) plus `ABC-087` (the seeded draw).

## `ABC-087` page

- It gains the seed:
  - the old `ABC-086` Scope bullet 1;
  - `A3` (different seeds actually differ, on blunder decisions);
  - the seed half of `A6`;
  - test notes 2 and 4.
- The generator's limits are `ADR-0027` decision 2: per-instance state, passed in, no
  dependency.
- "seeded per `ABC-086`" becomes seeded here. `A7` "consumed from `ABC-086`" becomes:
  deterministic mode is `ABC-086`'s virtual clock, and the seed is this ticket's own.
- Carry the PVS fact: a root move after the first has only a bound
  (`src/engine.ts:320-331`). A blunder draw that ranks moves by score needs a design answer, and
  `ADR-0027`'s Consequences name it without deciding it.
- BA/PM re-estimates the size.

## `ABC-085` page

- `A5` and Dependencies: it consumes `ABC-086`'s virtual clock and `ABC-087`'s seed. It still
  waits on both.

## The owner's word owed

- **Accept `ADR-0027`, or overrule it to Q1(a).**
  - Overruling to (a) means a value-changing heuristic under `ADR-0026` decision 10: switch,
    doors, bounded oracle, and an `A4` pin amendment.
  - (a) also costs +3–5% nodes, for variety nobody asked for.
- No other owner decision is needed. BA/PM and this role agree on (b).
