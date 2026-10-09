---
id: 20261009T192302Z-ba-pm-decision-ffa6f9d9
kind: decision
by: ba-pm
at: 2026-10-09T19:23:02Z
verified_by: 
confidence: high
refs:
  - ABC-086
  - ABC-087
  - ABC-085
  - ABC-084
  - ADR-0027
  - ADR-0026
  - NFR-004
  - NFR-005
  - N8-LANE
  - plans/tickets/ABC-086-deterministic-move-selection-under-a-fixed-seed.md
  - plans/tickets/ABC-087-difficulty-levels-as-budget-plus-blunder-rate.md
  - plans/tickets/ABC-085-self-play-ladder.md
  - .grugops/context/ruling-abc086-seed/notes/20261009T160220Z-architect-design-decision-what-ba-pm-folds-and-the-owner-word-owed-f3caccd1.md
  - .grugops/context/wave-2026-09-25/notes/20261009T191551Z-orchestrator-decision-5d2a9c74.md
supersedes: 
---

# `ABC-086` fold of `ADR-0027` + DoR: 10/10, no ⚠️ — Ready (`XS`, `P0`)

Hand-authored, no seal. This install is in the degraded posture `AGENTS.md` describes, so no
`finding` is admissible. The fold applies Architect/Design's list `…f3caccd1` to the accepted
`ADR-0027` (owner verbatim, `…5d2a9c74`). Every line cited on the pages was re-read at the wave tip
`fa7aeb2`.

## `ABC-086` — re-cut

- **The title changed** to "Deterministic mode — the shipped engine on a virtual clock". The
  filename is kept so that existing links still resolve. The board's title cell is the
  Orchestrator's.
- **Scope** is now three items: the virtual-clock module (`ADR-0027` d4), the `Clock` comment
  re-word (d5), and rows in `src/engine.test.ts`. `ABC-078` already merged the time source. The
  seed and seeded tie breaking were moved out, to Out of scope.
- **The criteria**, one line each:
  - `A1`: 300/300 identical through the shipped module, never a test-local clock. The full set
    runs in `ENGINE_DEEP`; the default lane has a 30 × 2 slice.
  - `A2`: under the wall clock, every move is legal and depth is reported. It is deliberately
    non-asserting.
  - `A3`: moved to `ABC-087` `A9`. The id is kept as a pointer.
  - `A4`: the grep, unchanged. The module falls under it.
  - `A5`: three checks. (i) No `now` at `cli.ts:175`. (ii) The module is not in `cli.ts`'s
    import graph. (iii) `src/engine.ts`'s diff is comment lines only, so `ABC-078` `A4`'s pin is
    untouched.
  - `A6`: narrowed to clock isolation. Two engines on their own clocks, interleaved over ≥ 10
    positions, each give 10/10 identical to running alone.
  - `A7`: the step guard is **a new criterion**, not a clause of `A1` (BA/PM's call, offered by
    `…f3caccd1`). Steps `0`, `-1`, `NaN` and `±Infinity` each throw (5/5). Step `0.5` reads
    exactly 0, 0.5, 1.
- **Why `A7` is a criterion of its own:** its failure mode is a hang, not a wrong move. It tests
  at the factory, without an engine. Folding it into `A1` would hide it under the lane split.
- **`A5`(iii) allows the matching comment at `src/engine.ts:148`.** It carries the same "a test
  injects virtual time" wording. `ADR-0027` d5 names only `:107-112`, so `:148` is permitted, not
  required.
- **Triggers.** `NFR-005` is not triggered and `NFR-004` is unchanged. `N8-LANE` is ≤ 650 ms net.
  If the default lane is over the bar, `A6` falls back to the deep lane.
- **Test notes** are 1 (the `A4` grep) and 2 (`A2` never strengthened), both kept, plus three new
  ones: `A1` imports the shipped module; `A6` uses engines that would differ if state leaked; `A7`
  asserts at the factory.
  - The old notes 2 and 4 moved to `ABC-087`.
  - The old note 5 (the tie fixture) left with `A3` and was not carried over.
- **Size `S` → `XS` (1). Priority `P0`, unchanged.**

## `ABC-086` DoR: 10/10, no ⚠️ — MET

- **Item 10, ⚠️ → ✅:** `ADR-0027` is accepted.
- **Items 1–9 are ✅.** Each is re-checked on the page.
- **The page frontmatter is set to `status: ready` / `column: Ready`.** The `plans/board.md` move
  is the Orchestrator's, because the board is outside this subtask's fence. `Ready` WIP was 0/8
  at `fa7aeb2`.

## `ABC-087` — what moved in (DoR not re-scored, did not move: 7/10, 3 ⚠️)

- **Scope** gains the seed bullet, with the generator's limits from `ADR-0027` d2:
  - no dependency;
  - per-instance state, passed in;
  - no PRNG in `engine.ts` or `search.ts`.
  `ABC-085`'s opening choice reuses this generator.
- **Out of scope** gains two items: choosing the PRNG (moved from `ABC-086`) and seeding the
  engine's tie breaking (ruled out).
- **New `A9`** (formerly `ABC-086` `A3`), re-aimed: ≥ 5 seeds over ≥ 30 positions at the easiest
  level, and at least 2 seeds give distinct blunder-decision sequences.
- **New `A10`** (the seed half of `ABC-086` `A6`): two instances with different seeds,
  interleaved over ≥ 10 positions, each 10/10 identical to running alone.
- **`A7` is re-pointed.** Deterministic mode is `ABC-086`'s virtual clock, and the seed is this
  ticket's own.
- **Test notes 5–6** moved in.
- **The PVS-bound fact** is carried into § The design question, and Architect/Design owns it.
  Root moves after the first have only a bound (`src/engine.ts:320-331`). Widening the root to get
  exact scores is the value-changing and work-changing change `ADR-0027` measured, which would put
  it under `ADR-0026` d10. Scoring candidates separately avoids that, but spends budget.
- **Size: `M` (3) holds, and it is now conditional.** It stays `M` if the blunder construction
  leaves the root search alone. If it changes the root search, the size is re-estimated then,
  likely `L`. The original "Not `L`" sentence was corrected, because the seed is no longer
  `ABC-086`'s.
- **DoR items touched:** 4 (it gains criteria and stays ✅), 8 (conditional), and 10 (widened).
  The score is unchanged.

## `ABC-085` — re-pointed (DoR not re-scored, did not move: 7/10, 3 ⚠️)

- **`A5`** now runs both engines on their own `ABC-086` virtual clocks and consumes `ABC-087`'s
  seed and generator. The criterion is unchanged.
- **Dependencies** are re-pointed the same way.
- **Out of scope:** the opening choice reuses `ABC-087`'s generator.

## Left for others (not edited; outside this subtask's pages or fence)

- **`plans/board.md` is stale.** Its `ABC-086` line still reads "Deterministic move selection under
  a fixed seed (S, P0, DoR 8/10, needs ABC-078)". The `Backlog → Ready` move and the title, size
  and DoR cells are the Orchestrator's.
- **`ABC-084` `A4` still reads "the same build and the same seed".** After `ADR-0027`, the puzzle
  suite needs deterministic mode (the virtual clock), not a seed. That page needs the same
  re-point, and it is a BA/PM follow-up that the Orchestrator should enqueue.
- **`ABC-087`'s Dependencies still list `ABC-078` and `ABC-084` as OPEN.** `ABC-078` is `Done`.
  This was not refreshed, because the brief allowed no re-score of `ABC-087`.
