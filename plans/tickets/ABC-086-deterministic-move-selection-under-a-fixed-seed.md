---
id: ABC-086
title: Deterministic mode — the shipped engine on a virtual clock
status: ready
column: Ready
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
  - The default lane carries a 30 × 2 slice (see `N8-LANE`).
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
- **Blocks `ABC-085`** (`A5` there runs on the virtual clock) **and `ABC-087`** (`A7`, `A9` and
  `A10` there run on it). **Strengthens `ABC-084`** (`A4` there).

## Security / NFR triggers

- **`NFR-004` — `A5` guards it.** The 3 s / 5 s promise is `ABC-078`'s and must survive this ticket
  unchanged.
- **`NFR-005` — not triggered.** Nothing on the search path changes (`ADR-0027` Consequences). A
  depth reached under a virtual budget is not an `NFR-005` reading.
- **`N8-LANE` — ≤ 650 ms net CPU, the standing bar.** The rows go in `src/engine.test.ts`, so there
  is no new test file and no 160 ms floor.
  - The full `A1` and `A2` go in the `ENGINE_DEEP=1` lane.
  - The default lane carries `A1`'s 30 × 2 slice, measured at 246–256 ms gross
    (`rescore-abc086`). It also carries `A6` and `A7`.
  - The Engineer reports the net figure with the standing instrument. If the default lane comes in
    over the bar, `A6` moves to the deep lane with a default-lane slice. Measure it; do not assume.
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
