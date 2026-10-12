---
id: ABC-086
title: Deterministic mode — the shipped engine on a virtual clock
status: done
column: Done
size: XS
priority: P0
epic: EPIC-004
feature: —
---

# ABC-086 — deterministic mode, and the thing that makes every other test possible

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-004`, Workflow 03). Cut early and `P0`
> despite looking like a nicety, because **`ABC-084` `A4` and `ABC-085` `A5` both depend on it** and
> a non-reproducible engine cannot be regression-tested at all.
>
> **Re-scored 2026-10-09 by BA/PM** (subtask `rescore-abc086`): 9/10, ⚠️(10) narrowed to two
> questions for Architect/Design. Measurements in `.grugops/context/rescore-abc086/`.
>
> **Re-cut 2026-10-09 by BA/PM** (task `wave-2026-09-25`, subtask `fold-abc086-adr0027`, Workflow
> 07) on `ADR-0027`, which the owner accepted the same day (note `…5d2a9c74`). This folds
> Architect/Design's list `…f3caccd1`:
> - **The seed leaves this ticket for `ABC-087`.**
> - **Deterministic mode is `createEngine({ budgetMs, now: <virtual clock> })`**, with the clock in
>   its own production module.
>
> The title changed. It was "Deterministic move selection under a fixed seed", and the seed half is
> now `ABC-087`'s. **Size `S` → `XS`. DoR 10/10 — Ready.** The fold record is in
> `.grugops/context/fold-abc086-adr0027/`.
>
> **Lane re-cut 2026-10-09 by BA/PM** (task `wave-2026-09-25`, subtask `recut-abc086-lane`,
> Workflow 07). The build stopped on `N8-LANE` at +1 070 ms net against 650 (claim `…3bb7069b`).
> `N8-LANE` now holds by a re-cut, so no owner breach is needed:
> - `A1`'s default slice shrinks from 30 × 2 to **15 × 2** at the same budget (2), with a
>   **depth ≥ 2 floor asserted on all 15**.
> - `A6`'s 10/10 row moves to `ENGINE_DEEP`.
> - `A1`'s 300/300 and `A6`'s 10/10 are unchanged.
>
> The estimated default charge is **≈ 160–240 ms** CPU, measured in vitest. **Size `XS` and DoR
> 10/10 are unchanged.** The record is in `.grugops/context/recut-abc086-lane/`.

## Problem

*User*: everyone — the player who wants to replay a game, and every test in this epic.

*Pain*: **the per-move budget is a wall clock** (`ABC-078`, `RISK-002`'s non-negotiable
constraint). The same position searched twice reaches different depths depending on machine load,
so **the same position can produce different moves**. The merged engine already accepts virtual
time (`EngineOptions.now`). But its only virtual clock lives in a test file
(`src/engine.test.ts:121-128`), out of reach of the `ABC-084`, `ABC-085` and `ABC-087` harnesses.
And the `Clock` contract still says "real-time" (`src/engine.ts:107-112`).

*Value*: the epic's fifth acceptance criterion — *"Given the same position and the same difficulty
twice, when the engine searches, then the chosen move is reproducible under a fixed seed."* **It is
met jointly.** This ticket delivers deterministic mode. `ABC-087` delivers the seeded blunder draw,
which will be the engine's only random choice.

## The tension, and its resolution (`ADR-0027`)

**A wall-clock budget and reproducibility are in direct conflict, and the constraint that creates the
conflict is non-negotiable.** `RISK-002`'s ruling stands: the budget stays time-based. So
reproducibility cannot be bought by fixing the depth. **That would violate a survived spike
constraint**, and this ticket must not be read as a licence to do it.

**Reproducibility is a property of a stated mode, not of the shipped default.**

- **Deterministic mode is the shipped engine constructed with a virtual clock:**
  `createEngine({ budgetMs, now: <virtual clock> })`, or `chooseMove` with the same options
  (`ADR-0027` decision 3).
- **No seed reaches the engine.** Tie breaking is already deterministic without one: strict `>`,
  first in `orderMoves` order (`src/engine.ts:397-401`). The blunder draw's seed belongs to
  `ABC-087` (decisions 1–2).
- **Under the shipped wall-clock default, the depth reached, and therefore the move, is not
  guaranteed.** `A1` and `A2` keep the two claims separate so that neither is over-sold.
- **A virtual millisecond is not a real one.** The depth reached under a virtual budget says
  nothing about the depth reached in 3 real seconds. `NFR-005` stays measured on the real clock.

**What the merged engine already does** (wave tip `fa7aeb2`; `src/engine.ts` last changed in
`9823c27`):

- **The time source is injected.** `EngineOptions.now` (`src/engine.ts:148-149`) defaults to
  `Date.now` (`:452`). The shipped construction, `src/cli.ts:175`, passes no `now`.
- **Wall-clock time is the only non-determinism left.** The engine holds no seed and makes no
  random choice. Under virtual time it returned 300/300 identical results, both in one process and
  in two (`rescore-abc086` probe).
- **A virtual clock is already a node budget.** The clock is read every `NODES_PER_CLOCK_CHECK`
  (1 024) nodes (`:202-208`), measured at 1 013–1 022 nodes per reading. `HARD_CEILING_MS` clamps
  virtual milliseconds unchanged (`:459`, `ADR-0027` decision 6). The step is the dial.

## Scope

- **A virtual-clock module.** One small production module outside `src/engine.ts`, with one export
  (`ADR-0027` decision 4). The name and spelling are the Engineer's; the suggestion is
  `src/virtual-clock.ts`.
  - The export is a factory that returns a `Clock`.
  - The first reading is 0, and each reading advances by a fixed step. This is
    `src/engine.test.ts`'s `tickingClock`, shipped.
  - It rejects a step that is not finite or not greater than 0. A fractional step is allowed.
  - Its state is per instance (a closure), never module state.
- **The `Clock` contract comment is re-worded, comment only** (`src/engine.ts:107-112`, decision
  5).
  - "real-time and NON-DECREASING" becomes advancing and non-decreasing: `Date.now` in the shipped
    construction, a virtual clock in deterministic mode.
  - "a test supplies virtual time" becomes "a test or a deterministic-mode harness".
  - The termination sentence stays.
  - The `now` field's comment at `:148` says the same thing. Re-wording it to match is allowed.
    It is also comment only.
- **Rows in `src/engine.test.ts`** for `A1`, `A2`, `A6` and `A7`. They import the shipped module,
  not a test-local clock.
- **The injected time source is already merged** by `ABC-078` (`src/engine.ts:148-149`, `:452`),
  so this ticket does not add it again.

## Out of scope

- **Fixing the search depth**, or making the shipped default budget anything other than wall-clock
  time. **`RISK-002`, non-negotiable.**
- **The seed, its generator and the blunder draw** — `ABC-087` (`ADR-0027` decision 2).
  `ABC-085`'s seeded opening choice reuses that generator.
- **Seeded tie breaking, or variety among equal moves.** It was ruled out by measurement (decision
  1): it is value-changing under LMR and work-changing. A future request for it reopens `ADR-0027`
  under `ADR-0026` decision 10. It does not reopen this ticket.
- **A node budget, a new `EngineOptions` field, or a new `src/engine.ts` export** (decision 3 and
  Alternatives).
- **Changing `HARD_CEILING_MS`, or exempting virtual time from it** (decision 6).

## Acceptance (Given/When/Then)

- **`A1` (exact reproducibility in deterministic mode).** **Given** the same position, the same
  budget and a **fresh virtual clock from the shipped module** at the same step, **when** the
  engine searches **10** times, **then** the chosen move is **identical all 10 times**, over **≥ 30**
  positions: **30 × 10 = 300/300.**
  - The rows import the clock from the shipped module, never from a test-local helper.
  - The full 300 runs belong in the **`ENGINE_DEEP=1` lane**, at a budget where at least half the
    positions complete root depth ≥ 4, so that LMR acts.
  - **The default lane carries a 15 × 2 slice** *(re-cut 2026-10-09, `recut-abc086-lane`; see
    `N8-LANE`)*.
    - **Given** the `startpos`, `position-3` and `position-5` families of the same 30 (each root
      plus its first four children: opening, endgame, tactical middlegame),
    - with a fresh shipped clock per run, at a budget of **2** virtual ms and a step of 1,
    - **when** each position is searched twice, **then two things hold:**
      - the chosen move is identical **30/30** (2/2 on each of the 15);
      - every one of the 15 completes root depth **≥ 2: 15/15, asserted**.
    - The depth floor is what makes this guard more than depth 1. The rejected budget-1 slice
      stopped at depth 1 everywhere.
    - The 30 × 2 slice it replaces is **not carried** into either lane, because the deep 300/300
      runs the same 30. The dropped families cost ~80 % of that slice (`kiwipete`, `position-4`,
      `position-6`), and 7 of their 15 positions reached only depth 1 at budget 2.
  - The merged engine already passes this with a test-local clock. So `A1` is a regression guard
    on the shipped engine. It also proves that the module is reachable from outside a test file.
- **`A2` (the honest claim under a real clock).** **Given** the same position and budget under the
  **shipped wall-clock** budget, **when** the engine searches 10 times, **then** every returned move
  is legal and **the completed depth is reported for each run**.
  - **This criterion does NOT assert an identical move**, and that is deliberate. Asserting it
    would give a test that passes on an idle machine and fails on a loaded one, which is exactly
    the class of test `plans/nfr-catalog.md` forbids.
  - It is opt-in (`ENGINE_DEEP=1`).
- **`A3` — moved to `ABC-087` as its `A9`**, re-aimed at the blunder draw (`ADR-0027`
  Consequences). The id is kept here so that older trace rows still resolve.
- **`A4` (no ambient randomness).** **Then** grep of the delivered `src/` diff finds **no
  `Math.random`, no `Date.now` and no `performance.now`** outside the injected time source's single
  implementation, `src/engine.ts:452`.
  - The virtual-clock module falls under this grep: it reads no real clock.
  - Two older hits sit outside the engine path and outside this diff, and they do not violate this
    criterion: `src/cli-options.ts:103` (`--colour random`) and `src/perft-bench.ts:70-72`
    (`hrtime`).
  - *(One stray real clock in the module makes every other criterion here false, and a behavioural
    test that happens to pass cannot see it.)*
- **`A5` (the shipped default is still wall-clock, and the virtual clock stays off the shipped
  path).** **Then** all three hold:
  - **(i)** The shipped construction is unchanged: `src/cli.ts:175`,
    `createEngine({ budgetMs: DEFAULT_BUDGET_MS })`, passes no `now`. `ABC-078`'s `A1` and `A4`
    stay green.
    - *(Amended 2026-10-12 by BA/PM, subtask `bapm-amend-ABC-101`, openly as (iii) asks. In force from
      `ABC-101`'s merge. The text above stays as the record.)* **(i′) The property is unchanged. Only
      the line it is read from moves.** `ABC-101` builds the root's engine from the level the human
      chose, so the literal above leaves `src/cli.ts`. The shipped construction still passes no `now`.
      With no `--difficulty` it still runs at `DEFAULT_BUDGET_MS` and never blunders. A rate-0 level
      IS the shipped engine (`ADR-0032`; `ABC-087` `A6`). **The re-pinned row in `src/engine.test.ts`
      asserts all four:**
      1. `src/cli.ts` contains `createLevelSeam(difficulty, { seed: Math.floor(Math.random() * 2 ** 32) })`
         verbatim. The options object is `{ seed }` and nothing else, so no clock is passed. This is the
         same raw-source instrument as the original row. `ABC-043` `A1`'s pin binds it to `engine:`.
      2. The module `src/cli.ts` imports `createLevelSeam` from (`src/level-seam.ts` in the probe) has
         **0** matches of `/\bnow\b/`. It adds no clock of its own, so `createLevel` falls back to
         `Date.now` (`src/levels.ts`, `options.now ?? Date.now`).
      3. `LEVELS[DEFAULT_LEVEL]` equals `{ budgetMs: DEFAULT_BUDGET_MS, blunderRate: 0 }` by `toEqual`,
         with `DEFAULT_BUDGET_MS` imported from `src/engine.ts`, never written as `3_000`.
      4. `resolveOptions([])` resolves `difficulty` to `DEFAULT_LEVEL`.
      - Each assertion kills a named mutant: a `now:` at the root (1); a clock injected in the adapter
        (2); a default level with another budget or any blunder rate (3); a default that resolves to
        another level (4).
      - **(ii), (iii) and the last line are unchanged.** `ABC-078` `A1`/`A4` stay green. Non-default
        levels run other budgets. That is `ABC-101`'s product, chosen by the human, not a change to the
        shipped default.
  - **(ii)** `src/cli.ts` does not import the virtual-clock module, either directly or through any
    module it imports.
  - **(iii)** `src/engine.ts`'s diff touches comment lines only. `ABC-078` `A4`'s pin of the export
    list and of `chooseMove.length === 2` (`src/engine.test.ts:465-484`) therefore needs no
    amendment. If a later need forces one, it is amended openly and never loosened.
  - **Determinism must not be bought by changing the shipped budget.**
- **`A6` (clock isolation).** **Given** two engines, each constructed with its **own** virtual
  clock, at different budgets or steps, **when** they are called interleaved in one process (A, B,
  A, B, …) over **≥ 10** positions, **then** each engine's chosen moves are identical to the same
  engine's moves run alone: **10/10 for each.**
  - The clock's state is per instance (a closure), never module state. This ticket adds no
    module-level state.
  - This is asserted because `ABC-085`'s ladder runs exactly that configuration.
  - **Lane** *(re-cut 2026-10-09)*: the 10/10 interleaved row runs in **`ENGINE_DEEP=1`**,
    unchanged. It cost 0.3–0.4 s in the default lane. The per-instance clock-state row (a second
    clock reads 0 first, about 0 ms) **stays in the default lane**.
  - The transposition table is module-level (`src/transposition.ts:70-72`). It is still safe,
    because each call clears it (`src/engine.ts:469`) and the seam runs `chooseMove` synchronously
    (`:515`).
- **`A7` (the step guard and the reading shape).** **Given** the virtual-clock factory:
  - **when** it is called with a step of `0`, `-1`, `NaN`, `Infinity` or `-Infinity`, **then** it
    throws: **5/5**;
  - **when** it is called with a step of `0.5`, **then** the clock's first three readings are
    exactly `0`, `0.5` and `1`;
  - **when** it is called with a step of `1`, **then** they are `0`, `1` and `2`.
  - *(A frozen clock never terminates; see the contract at `src/engine.ts:109-112`. The guard
    exists so that a harness typo fails loudly instead of hanging.)*

## Dependencies

*(Re-cut 2026-10-09.)*

- **`ABC-078`, `ABC-076`, `ABC-077`, `ABC-079`…`ABC-081`, `ABC-121`, `ABC-122` — `Done`.** The time
  source sits in `ABC-078`'s loop (`src/engine.ts:452`).
- **`ADR-0027` — accepted 2026-10-09** by the owner, verbatim *"accept ADR-0027 and ADR-0028, accept
  ABC-102"* (note `…5d2a9c74`). That discharges the only blocker.
- **`ABC-082` (evaluation, `Ready for UAT`) — no merge-order overlap is left.**
  - The tie fixture that a change to the evaluation could break left with `A3`.
  - `A1` and `A6` assert run-to-run identity, not a pinned move.
  - `A1`'s depth-floor budget is chosen against whichever tree the Engineer builds on.
- **The build branch predates `ABC-082`'s merge** *(re-cut 2026-10-09)*.
  - `grugops/ABC-086-virtual-clock` is based on `1d74693`. `ABC-082` (evaluation) merged into the
    wave after that, at `3858e3c` (wave tip `1c86e9d`).
  - **The re-hop merges the wave tip and re-reads `A1` there:**
    - the 300/300;
    - the deep depth-4 floor (≥ 15/30);
    - the default slice's 15/15 at depth ≥ 2;
    - the `N8-LANE` net.
  - A probe pre-read the wave tip `1c86e9d` with an identical inline clock. This is **not the
    merged tree and not a pass**:
    - the 15 × 2 slice reached depth 2 on 15/15 and cost 193–199 ms;
    - the deep budget of 24 reached depth ≥ 4 on **24/30** (the build tree read 27/30), and 60/60
      runs were identical;
    - the old 30 × 2 slice fell to 20/30 at depth ≥ 2 there, against 23/30 at the build tree.
- **Blocks `ABC-085`** (`A5` there runs on the virtual clock) **and `ABC-087`** (`A7`, `A9` and
  `A10` there run on it). **Strengthens `ABC-084`** (`A4` there).

## Security / NFR triggers

- **`NFR-004` — `A5` guards it.** The 3 s / 5 s promise is `ABC-078`'s and must survive this ticket
  unchanged.
- **`NFR-005` — not triggered.** Nothing on the search path changes (`ADR-0027` Consequences). A
  depth reached under a virtual budget is not an `NFR-005` reading.
- **`N8-LANE` — ≤ 650 ms net CPU, the standing bar.** The rows go in `src/engine.test.ts`, so there
  is no new test file and no 160 ms floor.
  - *Re-cut 2026-10-09 (`recut-abc086-lane`).* The build read **+1 070 ms net** (sign 8/8, null
    −0.04 %, load1 about 11). In vitest, the `A1` 30 × 2 slice cost 0.7–0.9 s and `A6` cost
    0.3–0.4 s. The earlier "246–256 ms" for that slice was a plain-`node` figure and read the lane
    3–4× low. The earlier fallback (move only `A6` to the deep lane) does not reach the bar.
  - **`ENGINE_DEEP=1`:** the full `A1` (300/300 and its depth-4 floor), `A2`, and `A6`'s 10/10
    interleaved row.
  - **Default lane:** `A1`'s 15 × 2 slice with its depth ≥ 2 floor, `A6`'s clock-state row, `A7`,
    `A5` (i) and (ii), and `A4`'s module row.
  - **Estimated default charge: ≈ 160–240 ms net CPU.** The target is ≤ ~450 ms, which leaves
    room for load under the 650 ms bar. All readings were taken **in vitest**: an M3, Node
    v26.11.0, `--pool threads`, load1 4–6, raw files in `.grugops/context/recut-abc086-lane/notes/`.
    - **Per position** (one process, 2 runs each): the families kept cost `startpos` 56.1 +
      `position-3` 25.2 + `position-5` 63.3 = **144.6 ms**. The families dropped cost `kiwipete`
      333.5 + `position-4` 130.4 + `position-6` 198.4 = 662.3 ms. The whole 30 × 2 is 806.9 ms
      (the build read 713–903).
    - **Whole slice, a fresh process per reading, 5 rotated rounds:** 15 × 2 read 180 / 185 / 195
      / 211 / 229 ms, median 195. The 30 × 2 read 848–1 030 ms, median 895. The ratio is 0.218.
    - **Scaled to the build's in-lane attribution:** 0.218 × 713–903 = **155–197 ms**.
    - **Plus the rows that stay** (`A4`, `A5` ×2, `A6` state, `A7` ×3), each ≤ 3 ms in the build:
      ≤ ~10 ms.
    - **So:** about 160 ms (155 + ~5) at the low end, and 240 ms (the worst fresh reading, 229, +
      10) at the high end. A fresh process is cold, so this errs high: in the lane, the
      `ABC-078` rows run first and warm the engine.
  - **The Engineer reports the net figure** with the standing instrument, on the merged tree.
    - **≤ 450 ms:** done.
    - **450–650 ms:** within the bar. The Engineer may take the pre-measured fallback: drop the
      `position-5` family, giving 10 × 2. That read 92–104 ms, with 10/10 at depth 2. The floor
      becomes 10/10. Report which slice shipped.
    - **> 650 ms:** stop and hand up, as before. Do not trim further without a cut.
  - **Size every default-lane row from an in-vitest reading, never from a plain-`node` one.**
- **Security — not triggered.** There is no input surface, and `A4` forbids ambient entropy, which
  is the only thing here that could resemble one.

## Test notes

1. **`A4` is a grep, and it is the strongest criterion on this page.** Behavioural determinism tests
   pass by luck; a source-level prohibition does not.
2. **`A2` must be written so it can never be "strengthened" into asserting an identical move.**
   Leave the reason in the test file, not only here. That is exactly the well-meaning change that
   makes this suite flaky on a loaded machine.
3. **`A1` must import the shipped module.** A test-local clock that passes `A1` proves nothing about
   what the harnesses can reach. Whether `ABC-078`'s rows keep their own `tickingClock` is the
   Engineer's call (coding rule 9).
4. **`A6` needs two engines whose results would differ if state leaked.** Give them different
   budgets or steps, so that equal output is not the trivial case.
5. **`A7`'s rows assert the throw at the factory.** Never hand the engine a zero step to "see what
   happens": a frozen clock hangs the lane instead of failing it.
6. **`A1`'s default slice asserts its own depth floor (15/15 at depth ≥ 2)** *(re-cut
   2026-10-09)*.
   - Without the floor, an engine or evaluation change that leaves the slice at depth 1 keeps it
     green while it guards almost nothing.
   - Build the slice by filtering the shared `thirtyPositions()` to the three families. A second
     hand-listed corpus can drift from the deep lane's.

*Moved to `ABC-087` with the seed: the old note 2 (seed before identity) and note 4 (no PRNG
dependency). The old note 5 (certifying the tie fixture) left with `A3`, and is not carried over,
because a blunder-draw criterion needs no tie fixture.*

## Size and priority rationale

**Size `XS` (1)** — the page's own outcome stated in advance for ruling (b). The work is one small
module of about a dozen lines, one comment edit, and rows in an existing test file. There is no
algorithm, no search change and no new export. The thinking is in `ADR-0027`.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P0`.** `ABC-084` `A4`, `ABC-085` `A5`, and `ABC-087` `A7`, `A9` and `A10` all run on
deterministic mode.

## Definition of Ready

**Re-scored by BA/PM, 2026-10-09, after the lane re-cut** (task `wave-2026-09-25`, subtask
`recut-abc086-lane`, Workflow 07). This was done against the build `339f940` and a read of the wave
tip `1c86e9d`. It supersedes the scores below, which are kept as history. **Result: 10 of 10
clean, no ⚠️ — MET.** The ticket stays where the board has it; the board is the Orchestrator's.
Only items 4, 6 and 10 were re-read; the rest stand as scored after the fold.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** unchanged |
| 2 | scope and out-of-scope clear | **✅** unchanged. No row is added: `A6`'s row moves lanes and `A1`'s slice shrinks |
| 3 | INVEST-shaped | **✅** unchanged. The re-hop's merge of the wave tip is a build step, not a dependency |
| 4 | acceptance testable and measurable | **✅ re-read.** `A1`'s default slice is 15 × 2 at budget 2: identical 30/30, with depth ≥ 2 on 15/15 asserted. `A1`'s 300/300 and `A6`'s 10/10 are unchanged and now run in `ENGINE_DEEP` |
| 5 | dependencies known | **✅** The build predates `ABC-082`'s merge. The re-hop merges the wave tip and re-reads `A1`, and a probe of the wave tip read 15/15 and 24/30 |
| 6 | security/NFR triggers with a measurable target | **✅ re-read.** `N8-LANE` is ≤ 650 ms net. The estimate is ≈ 160–240 ms from in-vitest readings, with the arithmetic stated. There is a pre-measured 10 × 2 fallback (92–104 ms), and a stop above 650 |
| 7 | test notes present | **✅** six (adds the slice's depth floor) |
| 8 | size assigned | **✅** `XS` (1). The re-cut changes one row and moves one row |
| 9 | priority assigned | **✅** `P0`, unchanged |
| 10 | no major unresolved blocker | **✅ re-read.** The `N8-LANE` stop is resolved by the re-cut, so no owner breach is needed. The estimate is `UNKNOWN - verify` until the standing instrument reads it on the merged tree. That reading is the re-hop's normal work, not a blocker |

<details>
<summary>Re-score 2026-10-09, after the fold (subtask <code>fold-abc086-adr0027</code>) — superseded above</summary>

**Re-scored by BA/PM, 2026-10-09, after the fold** (task `wave-2026-09-25`, subtask
`fold-abc086-adr0027`, Workflow 07). This was done against `ADR-0027` (accepted) and the wave tip
`fa7aeb2`. It supersedes both scores below, which are kept as history. **Result: 10 of 10 clean,
no ⚠️ — MET. `Ready`.** Moving the board is the Orchestrator's job (`plans/board.md` is outside
this subtask's fence).

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** The wall clock is still the only non-determinism (`src/engine.ts:452`). The only virtual clock sits in a test file, out of the harnesses' reach. The epic's fifth criterion is named as met jointly with `ABC-087` |
| 2 | scope and out-of-scope clear | **✅** In scope: one module, one comment, test rows. Five fences: depth, the seed (→ `ABC-087`), seeded tie breaking (ruled out), node budget/new option/new export, the ceiling |
| 3 | INVEST-shaped | **✅** Independent: every engine ticket is `Done` and `ADR-0027` is accepted. Small: `XS`. Valuable on its own: `ABC-084` needs deterministic mode and no seed |
| 4 | acceptance testable and measurable | **✅** Six live criteria. `A1` is 300/300 through the shipped module. `A2` is legal + depth reported, and deliberately non-asserting. `A4` is a grep. `A5` has three checks: no `now` at `cli.ts:175`, the module absent from `cli.ts`'s import graph, and an `engine.ts` diff of comment lines only. `A6` is 10/10 per engine, interleaved. `A7` is 5/5 throws plus exact readings. `A3` is kept as a pointer to `ABC-087` `A9` |
| 5 | dependencies known | **✅** All are `Done`. The ruling is accepted. The `ABC-082` overlap left with `A3`. The three consumers are named |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-004` is guarded by `A5`. `NFR-005` is not triggered (no search-path change). `N8-LANE` is ≤ 650 ms net, with a measured 30 × 2 slice and a stated fallback for `A6` |
| 7 | test notes present | **✅** Five: three new and two kept. Those that moved are named |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P0`, unchanged |
| 10 | no major unresolved blocker | **✅ (was ⚠️) — discharged.** `ADR-0027` was accepted by the owner 2026-10-09 (`…5d2a9c74`) and is folded here as `…f3caccd1` lists |

</details>

<details>
<summary>Re-score 2026-10-09, before the ruling (subtask <code>rescore-abc086</code>) — superseded above</summary>

**Result: 9 of 10 clean, 1 ⚠️ — NOT met.** ⚠️(10) asked Architect/Design Q1 (does the seed reach
move selection?) and Q2 (virtual clock or node budget?). Both are answered by `ADR-0027`. The question text the last row
points at was dropped by the re-cut; it is on this page at `fa7aeb2`.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** unchanged. The merged engine's wall clock is still the one source of non-determinism (`src/engine.ts:452`), and `ABC-087`'s randomness is still unbuilt |
| 2 | scope and out-of-scope clear | **✅** fences unchanged. The time-source bullet is marked as already merged, and the two open bullets are named as open under ⚠️(10) rather than left vague |
| 3 | INVEST-shaped | **✅ (was ⚠️) — discharged by fact.** `ABC-078` and everything it depended on are `Done`. Nothing this ticket needs is still in flight |
| 4 | acceptance testable and measurable | **✅** six criteria, each re-checked against the code as built. `A1` gains a lane and a depth floor, and it is named as a guard that the merged tree already meets. `A3`'s "equal-scoring" is defined as exact per-move scores (8/30 positions qualify) and is conditional on ⚠️(10). `A4`, `A5` and `A6` cite the lines they bind |
| 5 | dependencies known | **✅** every engine ticket is `Done`. The ruling is named as the only blocker. `ABC-082`'s merge-order overlap is named. `ABC-087` is added as a consumer |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-004` is guarded by `A5`. `NFR-005` is now conditional on the ruling, at its catalog bar either way. `N8-LANE` is corrected by measurement: the full 300 runs go to the deep lane, and a 30 × 2 default slice measures ≈ 250 ms |
| 7 | test notes present | **✅** five (adds `A3`'s fixture certification) |
| 8 | size assigned | **✅** `S` (2), as an upper bound. It falls to `XS` if the seed leaves this ticket |
| 9 | priority assigned | **✅** `P0`, unchanged. `ABC-085`, `ABC-087` and `ABC-084` `A4` all wait on it |
| 10 | no major unresolved blocker | **⚠️ still open, narrowed.** Owner: **Architect/Design.** The question is below |

</details>

<details>
<summary>Original score, 2026-08-16, at cut time (task <code>epic-to-tickets-EPIC-004</code>) — superseded above</summary>

Assessed by BA/PM, **2026-08-16**. **Result: 8 of 10 clean, 2 ⚠️ — NOT met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** both sources of non-determinism named, one of them a ratified constraint |
| 2 | scope and out-of-scope clear | **✅** three fences, the first restating a non-negotiable constraint as a prohibition |
| 3 | INVEST-shaped | **⚠️** **not independent** — `ABC-078` must land first |
| 4 | acceptance testable and measurable | **✅** six: **300/300** in deterministic mode, an explicitly non-asserting wall-clock criterion with its reason, a seeds-actually-differ check, a source-level entropy prohibition, the shipped default guarded, and per-instance seed isolation |
| 5 | dependencies known | **✅** three open tickets, two consumers named, one design owner named |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-004` guarded by `A5`; lane cost designed out via a node budget rather than argued away |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `S` (2) |
| 9 | priority assigned | **✅** `P0` |
| 10 | no major unresolved blocker | **⚠️** **the deterministic-mode construction is BA/PM's reading of the epic's criterion, and the search architecture is Architect/Design's.** The criteria are written to survive a different construction, but **the construction itself is not ratified** |

</details>

## Delivery

**2026-10-09, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-086`).
Branch `grugops/ABC-086-virtual-clock` from `1d74693`. Code is in `1ae5284`, plus `f9d58ee`, which
renames the `A4` row title only. Not merged, not pushed. The decisions, the readings and the raw
files are in `.grugops/context/ticket-to-pr-ABC-086/notes/` and are not restated here.

**Criteria: 6 of 6 live criteria met. `N8-LANE` is NOT met, and it is handed up.**

| # | verdict | reading |
|---|---|---|
| `A1` | MET | 300/300 in `ENGINE_DEEP`, at a virtual budget of 24 and step 1. Depth ≥ 4 on ≥ 15/30 is asserted; the probe read 27/30. The default slice is 60/60. Every row imports `src/virtual-clock.ts` |
| `A2` | MET | kiwipete × 10 at `DEFAULT_BUDGET_MS` on the wall clock. Every move is legal and every depth is reported. Identity is deliberately not asserted, and the reason is in the file |
| `A4` | MET | The delivered `src/` diff grep gives 0 lines. The single `Date.now` is now `src/engine.ts:457` (it was `:452`) |
| `A5` | MET | (i) The `cli.ts` construction is pinned. (ii) The import walk reaches `engine.ts` and not the module. (iii) The `engine.ts` diff is comment lines only, and the `ABC-078` `A4` pin is green, unamended |
| `A6` | MET | 10/10 per engine, interleaved against alone. Engines at budget 1 and budget 3 differ on 3/10 positions. Per-instance clock state is checked |
| `A7` | MET | 5/5 throws; exact readings `[0, 0.5, 1]` and `[0, 1, 2]` |

**`N8-LANE`: +1 070 ms CPU net, against a bar of 650 ms.** This is a stop condition in the brief,
so nothing was trimmed. The `A1` default slice costs 0.7–0.9 s in vitest. That is 3–4× the
plain-`node` figure this page cites, so the stated `A6` fallback does not reach the bar on its own.
The options are in claim `…3bb7069b`.

**Owed:**
- the `AGENTS.md` `ENGINE_DEEP` line, now 45 (33 default) and 269 s, to the Scribe;
- a QE hop;
- the `N8-LANE` ruling.

**Lane re-cut 2026-10-09, BA/PM** (subtask `recut-abc086-lane`). `N8-LANE` is resolved by a
re-cut, not a breach; see `A1`, `A6` and § Security / NFR triggers. **Owed by the Engineer's
re-hop:**
- merge the wave tip, which carries `ABC-082`;
- replace the 30 × 2 default row with the 15 × 2 slice and its depth ≥ 2 floor;
- move `A6`'s 10/10 row under `ENGINE_DEEP`;
- re-read `A1` (the 300/300 and the depth-4 floor) on the merged tree;
- report the `N8-LANE` net with the standing instrument.

The `AGENTS.md` line and the QE hop are still owed, as above.

**Re-hop 2026-10-09, Software Engineer** (subtask `ticket-to-pr-ABC-086-rehop`). The wave tip
`b0a3ba9` (with `ABC-082`) is merged at `54540e5`; the re-cut rows are at `a4d8633`, in
`src/engine.test.ts` only. Not merged into the wave, not pushed. Readings in observation
`…457ba6b8`, owed items in claim `…ae1c2c15`.

- **Slice shipped: 15 × 2** (no fallback). `A1`'s default row is the three families filtered from
  `thirtyPositions()`, identical 30/30, depth ≥ 2 on 15/15 asserted. `A6`'s 10/10 interleaved row
  is in `ENGINE_DEEP`, unchanged; the clock-state row stays default.
- **Gates on the merged tree:** lint (after one safe format autofix), typecheck and build exit 0;
  `npm test` 49 files / 1530 passed (wave tip 1522), 0 skipped, skip-integrity `No findings.`
- **`ENGINE_DEEP` on the merged tree:** exit 0, 45 passed (32 default), 314.8 s. `A1` 300/300
  green; depth-4 floor green (24/30, floor 15); `A6` 10/10 green; `A2` 10/10 legal, reported.
- **`N8-LANE`: +35 ms net** (median of 8 paired rounds, sign 4/8; null 0.00 %, 4/8; load1 median
  22.9), under 450. A second run was inadmissible (null −2.22 %) and is not used. In vitest, the new
  `A1` row costs 106–109 ms and every other row ≤ 1 ms.
- `src/engine.ts` and `src/search.ts` are untouched by the re-hop.

**Still owed:** the `AGENTS.md` `ENGINE_DEEP` and `npm test` lines (Scribe), the QE hop and the
board move (Orchestrator).

## § QE — 2026-10-09 (QE/E2E, task `wave-2026-09-25`, subtask `qe-ABC-086`, Workflow 05)

**PASS WITH FINDINGS** at `82cccba`. QE's own probes re-measured every figure. The reasoning and
raw output are in `.grugops/context/qe-ABC-086/` (`notes/` and `probe/`) and are not restated here.

- **`A1`, `A2`, `A4`–`A7` MET as written.**
  - Gate: lint, typecheck and build exit 0. `npm test` 49 / 1530 / 0 skipped. Integrity
    `No findings.`
  - `ENGINE_DEEP`: exit 0, 45 passed, 291.9 s. `A1` 300/300, depth ≥ 4 on 24/30, `A6` 10/10,
    `A2` `e2a6@d5` ×10, all legal.
  - `A5` (ii) was checked independently with the compiler's own module graph: `cli.ts` reaches
    29 modules, none of them `virtual-clock.ts`.
- **Determinism across separate processes holds.** 450 rows agree on move, score, depth and nodes.
  The rows cover 5 budget/step configurations, 30 positions, and 3 processes (forward, reverse
  order, and after warm-up searches).
- **The default slice's floor is also its ceiling.** At budget 2 / step 1 the depth is 1 or 2 by
  construction, and iteration 2 has a margin of 635–985 nodes. It is a real guard: a clock that
  jumps the budget in one read reds the floor and nothing else. The slice never reaches LMR
  depths; only the deep 300/300 does.
- **12 QE mutants:** 9 killed, 2 equivalent, and 1 survives every row (a module-level step).
- **Gaps:**
  - **G-QE-1 (LOW–MEDIUM, test gap; the code is correct).** No row runs two live clocks at
    different steps, so a module-level step survives both lanes. The `A6` interleaved row is
    blind to clock state by construction. Remedy, verified (green on the shipped module, red on
    the mutant): one ≈ 0 ms default row, `virtualClock(1)` and `virtualClock(0.5)` read
    interleaved = `[0, 0, 1, 0.5, 2, 1]`.
  - **G-QE-2 (LOW, design limit).** The guard stops the five named steps, not a small positive
    one. `virtualClock(0.001)` takes 13.8 s per search at budget 2. A step below about
    1e-16 × budget freezes. A reused clock with a non-dyadic step shifts node counts by one
    interval. This is a harness note for `ABC-084`, `ABC-085` and `ABC-087`.
  - **G-QE-3 (LOW).** `A4` is a spelling grep. It misses destructuring, bracket access,
    `new Date()`, an aliased `perf_hooks` import, `process.uptime`, `crypto` and `Temporal.Now`.
    Mitigated by the 37-line module being read by eye.
- **Security/NFR not triggered** (no shipped-path change). `N8-LANE` is the Engineer's reading.

**`ABC-086` may leave `In Review`. G-QE-1 is not a blocker. The board move is the Orchestrator's.**

## Amendment — 2026-10-12 (BA/PM, task `wave-2026-09-25`, subtask `bapm-amend-ABC-101`)

`A5`(i) is re-pinned as (i′) for `ABC-101`'s level wiring. See `A5`. The reason, the alternatives and
the readings are in `.grugops/context/bapm-amend-ABC-101/notes/`.
- **Not a loosening.** The row still discriminates on the wall clock and on the default budget, and it
  now asserts both directly. The old row read them off one literal.
- **A criteria question, not a design one.** `ADR-0027` decisions 3–4, `ADR-0032` and `ADR-0037` D3
  already rule the construction. No ADR names `createEngine` as the shipped construction. `ADR-0027`
  § Context's "`src/cli.ts:175` passes none" is a dated observation, and it stays true of `now`.
- **Status unchanged: `Done`.** The row edit lands in `ABC-101`'s diff (`ABC-101` `A9`).
