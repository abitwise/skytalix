---
id: ABC-078
title: Iterative deepening against a wall clock — the per-move budget, and `EngineSeam` satisfied
status: backlog
column: Backlog
size: M
priority: P0
epic: EPIC-004
feature: —
---

# ABC-078 — `RISK-002`'s constraint, built. This is the only place a per-move budget exists.

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-004`, Workflow 03).
>
> **This ticket is where the non-negotiable inherited constraint is discharged.**
> `plans/nfr-catalog.md` (the `RISK-002` survival paragraph): *"**Survives: RISK-002 = GO WITH
> CONSTRAINT**, and `EPIC-004`'s per-move budget **must be time-based (iterative deepening against a
> wall clock), not depth-based** — a fixed depth would blow `NFR-004`'s 3-second ceiling on exactly
> the machines least able to absorb it. Inherited by `EPIC-004` as non-negotiable."* Verified at
> source. **`ADR-0003` also leans on it structurally** — its reason for choosing depth over rate is
> that iterative deepening *"returns the best move found so far when the clock runs out — so the 3 s
> budget **cannot** be blown by a slow node rate."* **If this ticket is wrong, `NFR-005`'s entire
> derivation collapses with it.**

## Problem

*User*: the player waiting for a move.

*Pain*: `ABC-077` returns a move for a depth. Nobody knows what depth fits in 3 s on an unknown
machine, and `ADR-0003` says the slow-hardware factor has **never been validated**. A fixed depth is
a promise about hardware you have not measured.

*Value*: it is the only construction that lets `NFR-004` be a promise rather than a hope, and it
satisfies `EngineSeam`, which `turn-loop.ts` has been waiting on since `ABC-019`.

## Scope

- **Iterative deepening**: search depth 1, then 2, then 3 …, keeping the best move from the last
  **completed** iteration, until the wall-clock budget is spent.
- **Abort mid-iteration** and return the last completed iteration's move. An incomplete iteration's
  result is **discarded**, not used.
- **Satisfy `EngineSeam`** — `src/turn-loop.ts:138`: `(history: GameHistory) => Promise<Move>`.
  **The type already exists; this ticket supplies the implementation the table in the architecture
  audit lists as *"impl is `EPIC-004`'s"*.**
- The default budget: **3 s**, hard ceiling **5 s** (`NFR-004`).

## Out of scope

- **Difficulty selection — a flag, a prompt, or how a chosen level persists across a session — is
  `EPIC-006`'s, not this epic's.** This ticket takes a budget as a parameter. **It owns the
  mechanism; `EPIC-006` owns the choosing.** *(Boundary ruled by the Orchestrator at this
  decomposition; recorded here so it is not rediscovered.)*
- **The difficulty *mechanism*** (budget + blunder rate as levels) — `ABC-087`.
- **Aspiration windows, null-move pruning, late-move reductions.** Not requested; coding rule 5.
- **Parallel search.** Threading is `UNKNOWN - verify` and Architect/Design's.

## Acceptance (Given/When/Then)

- **`A1` (`NFR-004`, the promise).** **Given** **≥ 30** positions spanning opening, middlegame and
  endgame, **when** a move is requested at default difficulty, **then** every call returns in
  **≤ 3 s** and **no call ever exceeds 5 s** — **30/30**, worst case reported with machine.
- **`A2` (the budget is honoured under an adversarial clock).** **Given** a budget of **50 ms** —
  far below one iteration's cost in a complex position — **then** a **legal move is still
  returned**, within **≤ 2x** the budget, because depth 1 always completes. *(This is the criterion
  that proves the clock is checked inside the recursion and not only between iterations.)*
- **`A3` (a partial iteration is discarded, not used).** **Given** an instrumented run aborted
  mid-iteration at depth `n`, **then** the returned move equals the best move of the completed
  depth `n-1` iteration. *(Using a partial iteration's best move is worse than not searching it —
  it is a systematically biased sample of the move list.)*
- **`A4` (no fixed depth anywhere — `RISK-002` as a criterion, not a comment).** **Then** the
  delivered engine entry point takes a **time budget** and **no depth argument or depth default**,
  and grep of the delivered `src/` diff finds **no depth constant** driving a per-move decision.
  Asserted in a test over the delivered exports.
- **`A5` (deeper when given longer).** **Given** the same position at budgets of 100 ms, 1 s and
  3 s, **then** the completed depth is **monotonically non-decreasing** across the three. *(A clock
  that is checked but never lets the search go deeper passes `A1`–`A3`.)*
- **`A6` (it satisfies the merged seam, unchanged).** **Then** the implementation is assignable to
  `EngineSeam` as declared, `runTurnLoop` drives it end to end in a scripted game, and
  **`src/turn-loop.ts` is byte-identical**.
- **`A7` (always legal, never null).** **Given** any position with at least one legal move, at any
  budget down to **1 ms**, **then** a legal move is returned — never `null`, never a throw. **≥ 200
  positions.**

## Dependencies

- **`ABC-077` must land first — OPEN.** It is the iteration body.
- **`ABC-076` must land first — OPEN** (transitively).
- **`src/turn-loop.ts` — MERGED**, and supplies `EngineSeam`. **Not modified** (`A6`).
- **Enables `ABC-074`** — the spike measures depth-in-budget and cannot run before this exists.
- **`EPIC-005`'s opening book CONSUMES this move interface.** *(Boundary: the book is `EPIC-005`'s
  and is **not cut here**.)* **Named as a dependency and stopped on, per instruction:** if the book
  wraps or precedes the engine, it consumes `EngineSeam` — the type is **merged and unchanged by
  this ticket**, so nothing here breaks it. **If `EPIC-005`'s decomposition needs a different
  shape — a "book first, else search" composition point, or a way to ask the engine to skip the
  book — that is a contract change on a merged type and is NOT resolved here.** Owner: whoever
  decides the `EPIC-005`/`EPIC-004` composition point. Flagged, not designed.

## Security / NFR triggers

- **`NFR-004` — ≤ 3 s at default difficulty, hard ceiling 5 s at any difficulty.** `A1` is its
  direct test. **⚠️ `A1` is wall-clock and therefore machine-dependent** — per
  `plans/nfr-catalog.md`'s standing rule, **no wall-clock assertion belongs in the default suite**.
  `A1` runs as a reported measurement plus an opt-in check; `A2`, `A3`, `A5` and `A7` are the
  machine-independent guards that live in the suite.
- **`NFR-005` — depth-in-budget on `kiwipete` and `position-6`.** First point at which the FAIL
  floor (depth 6) and WARN level (depth 7) are measurable at all. **Report; do not rule** — the
  depth-7 level stays **PROVISIONAL** until `ABC-074`.
- **`N8-LANE` — ≤ 650 ms CPU.** ⚠️ A 3 s budget cannot run in a 650 ms lane. Suite tests use
  **millisecond budgets** (`A2`, `A5`, `A7`); the 3 s runs are opt-in.
- **Security — not triggered.** No input surface; the budget is a number from a caller.

## Test notes

1. **`A2` is the one that catches the common bug.** Checking the clock only between iterations gives
   a well-behaved engine that blows the budget on exactly the position where it matters.
2. **Inject the clock.** A test that waits 3 s to assert 3 s is a slow test and a flaky one; an
   injected time source makes `A3` and `A5` deterministic and fast. This is the one seam worth
   having here, and it is requested.
3. **`A7` at 1 ms is not a silly case** — it is the shape of every real timeout.
4. **Do not assert absolute depths in the suite.** Assert monotonicity (`A5`). Depth is hardware.

## Size and priority rationale

**Size `M` (3).** A loop, an abort check, a best-so-far register and an injected clock. **Not `L`:**
the recursion is `ABC-077`'s and the budget-to-level mapping is `ABC-087`'s.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P0`.** It discharges the epic's non-negotiable constraint, it satisfies the merged
`EngineSeam`, it is `NFR-004`'s only implementation, and `ABC-074` is blocked behind it.

## Definition of Ready

Assessed by BA/PM, **2026-08-16**. **Result: 7 of 10 clean, 3 ⚠️ — NOT met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the unvalidated hardware factor is quoted from `ADR-0003`, not asserted |
| 2 | scope and out-of-scope clear | **✅** four fences, including the `EPIC-006` difficulty boundary written down |
| 3 | INVEST-shaped | **⚠️** **not independent** — two open tickets in front of it |
| 4 | acceptance testable and measurable | **✅** seven: 30/30 under 3 s, a 50 ms adversarial budget at ≤ 2x, a discarded-partial-iteration check, a no-depth-argument guard, monotonic depth over three budgets, byte-identical `turn-loop.ts`, 200 positions at 1 ms |
| 5 | dependencies known | **⚠️** the `EPIC-005` composition point is **named and deliberately unresolved** — a cross-epic contract question with no owner assigned to it yet |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-004` 3 s / 5 s; `NFR-005` reported not ruled; `N8-LANE` 650 ms with the conflict named and a decided remedy |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `M` (3) |
| 9 | priority assigned | **✅** `P0` |
| 10 | no major unresolved blocker | **⚠️** **`NFR-004`'s verification is machine-dependent and this project has one machine.** `A1` can be *run* but its result is `UNKNOWN - verify` off that machine until `ABC-074` reports |
