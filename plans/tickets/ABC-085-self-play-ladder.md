---
id: ABC-085
title: Self-play ladder — hardest scores ≥ 90% against easiest over 100 games
status: backlog
column: Backlog
size: M
priority: P1
epic: EPIC-004
feature: —
---

# ABC-085 — the epic's first acceptance criterion, and it is the expensive one

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-004`, Workflow 03). The other half of
> `RISK-003`'s mitigation (`ABC-084` is the first). **This ticket exists because `EPIC-004`'s first
> acceptance criterion is a 100-game match and nothing else in this epic can satisfy it.**

## Problem

*User*: the player choosing a difficulty level and expecting it to mean something.

*Pain*: `ABC-087` will define levels as a budget plus a blunder rate. **Nothing checks that the
levels are actually ordered.** A difficulty ladder whose "hard" is not reliably better than its
"easy" is a menu of noise, and `RISK-003` says relative strength cannot be verified without an
opponent — a weaker copy of yourself is the cheapest available one.

*Value*: it is the direct implementation of the epic's first acceptance criterion — *"Given the
hardest difficulty, when the engine plays 100 games against the easiest difficulty, then it scores
at least 90%."*

## Scope

- A harness that plays **N games** between two configured engine instances, alternating colours.
- Game termination via the merged `src/gameend.ts` — checkmate, stalemate, fifty-move, threefold,
  insufficient material. **Nothing here re-implements a rule.**
- A score report: wins / draws / losses, score percentage, and per-game terminal reason.
- Runs at a **configurable reduced budget**, with the 100-game / default-budget run as an explicit
  opt-in mode.

## Out of scope

- **Absolute Elo.** `UNKNOWN - verify`, per the epic, until measured against a rated reference.
  **This harness produces a relative score and nothing else.**
- **Playing an external engine** (Stockfish, UCI). The epic's **permanent non-goal**.
- **Opening variety via an opening book.** **The book is `EPIC-005`'s and is not cut here.**
  Openings are diversified by a seeded random choice among the first few plies — see `A5` — which is
  a test-harness concern, not a book. *(2026-10-09: that choice reuses `ABC-087`'s seeded generator,
  per `ADR-0027` decision 2. It is not a second PRNG.)* **If `EPIC-005`'s book later changes what the engine plays
  from the start position, this harness's baselines are invalidated and must be re-measured. Named
  as a cross-epic dependency and not resolved.**
- **Tuning the levels to make the number pass.** If `A1` fails, that is `ABC-087`'s finding.

## Acceptance (Given/When/Then)

- **`A1` (the epic's criterion, verbatim).** **Given** the hardest difficulty and the easiest,
  **when** 100 games are played, **then** the hardest scores **≥ 90%** (win = 1, draw = 0.5).
  Colours alternate so each side plays 50 as white.
- **`A2` (the ladder is monotone, not just its endpoints).** **Given** each **adjacent** pair of
  difficulty levels, **when** ≥ 20 games are played, **then** the stronger scores **> 50%**. *(A
  ladder that satisfies `A1` while having its middle levels out of order is still broken, and `A1`
  alone cannot see it.)*
- **`A3` (every game terminates).** **Given** any run, **then** **100/100** games reach a terminal
  state from `gameStatus` with no timeout, no crash, and no game exceeding a stated ply cap. **A
  game hitting the ply cap is reported as an error, not as a draw.**
- **`A4` (every move played was legal).** **Then** each game's move list replays cleanly from the
  start position through merged `apply`/`legal` — **100/100**. *(The harness is also the only
  long-running integration test this engine will ever have; it should be used as one.)*
- **`A5` (reproducible under a fixed seed — the epic's fifth criterion).** **Given** the same seed
  and the same build, **when** the ladder runs twice, **then** the game move lists are **identical**
  and the score is **identical**. *(This is also the harness's own opening-diversity mechanism: the
  seed selects among early moves, so games differ from each other and not from run to run.)*
  *(Re-pointed 2026-10-09 on the accepted `ADR-0027`.)* Both engines run in deterministic mode, each
  on its **own** instance of `ABC-086`'s virtual clock. The seed, and the generator that both the
  blunder draws and the opening choice consume, are `ABC-087`'s. This harness consumes both and
  re-implements neither.
- **`A6` (cost is reported and the run mode is honest).** **Then** the wall clock for the full
  100-game run at the default budget is reported. **A short mode — fewer games, reduced budget —
  is the one that runs routinely, and the report states which mode produced any quoted number.**

## Dependencies

- **`ABC-087` must land first — OPEN.** There are no difficulty levels to ladder without it.
  *(2026-10-09.)* It also owns the seed and the seeded generator that `A5` consumes.
- **`ABC-086` must land first — OPEN.** `A5`'s ~~seeded reproducibility~~ deterministic mode, the
  virtual clock, is that ticket's contract *(re-pointed 2026-10-09; the seed moved to `ABC-087`)*.
  This one **consumes** it and does not re-implement it.
- **`ABC-078`, `ABC-077`, `ABC-076` — OPEN** (transitively).
- **`src/gameend.ts`, `src/history.ts`, `src/apply.ts`, `src/legal.ts` — MERGED** and used as-is.
- **`EPIC-005`'s opening book — cross-epic, named and NOT resolved** (see `## Out of scope`).

## Security / NFR triggers

- **`RISK-003` — the relative-strength half of the mitigation.**
- **`N8-LANE` / `NFR-008` — ⚠️ THIS IS THE MOST EXPENSIVE THING IN THE EPIC AND IT CANNOT BE IN THE
  DEFAULT LANE.** Arithmetic, stated rather than hidden: 100 games × ~60 plies × 3 s ≈ **5 hours**.
  Against `NFR-008`'s **3 s wall / 13 s CPU** whole-suite clause this is four orders of magnitude
  out. **Ruling: OPT-IN ONLY, `PERFT_DEEP`'s established shape, never in `npm test`.** A short mode
  (e.g. 10 games at a millisecond budget) may run in the default lane **only if it is measured to
  fit the 650 ms per-ticket bar** — measure, do not assume.
- **`NFR-004` — not triggered.** The harness sets its own budget.
- **Security — not triggered.** No input surface.

## Test notes

1. **`A4` costs almost nothing and buys the most.** Replaying every generated game through the
   merged legality path is a very large integration test for a few lines of harness.
2. **`A3`'s ply cap must report an error.** Silently scoring a stuck game as a draw is how a
   90% number gets manufactured.
3. **Do not let `A1` be the only measurement.** `A2` is the one that catches a broken middle.
4. **Report the mode with every number** (`A6`). A 90% from a 10-game short run is not the epic's
   criterion and must never be quoted as if it were.

## Size and priority rationale

**Size `M` (3).** A game loop over two engine instances, a scorer, a seeded opening selector and a
replay validator. **Not `L`:** every rule it needs is merged and it writes no production code.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P1`, not `P0`, and this is a deliberate call against the epic's own criterion.** It
implements the epic's **first** acceptance criterion, which argues for `P0`. But it can only run
after seven other tickets, it verifies rather than delivers behaviour, and a 5-hour run is not
something the board can pull like other work. **Recorded as a judgement, and it is BA/PM's to be
overruled on:** if the owner wants the epic's first criterion treated as `P0`, this is the row to
change.

## Definition of Ready

**Fold note, 2026-10-09** (task `wave-2026-09-25`, subtask `fold-abc086-adr0027`, accepted
`ADR-0027`, list `…f3caccd1`). **Not re-scored, and the score did not move: still 7 of 10, the same
three ⚠️.**

- `A5` and Dependencies are re-pointed: the virtual clock is `ABC-086`'s, and the seed and
  generator are `ABC-087`'s.
- `A5`'s criterion is unchanged.
- The ticket still waits on both `ABC-086` and `ABC-087`, so item 3 stays ⚠️.

Assessed by BA/PM, **2026-08-16**. **Result: 7 of 10 clean, 3 ⚠️ — NOT met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** an unordered ladder is the pain; the epic's own criterion is the value |
| 2 | scope and out-of-scope clear | **✅** five fences, two of them permanent epic non-goals, one a live cross-epic boundary |
| 3 | INVEST-shaped | **⚠️** **least independent ticket in the epic** — five open dependencies, two of them direct |
| 4 | acceptance testable and measurable | **✅** six: **≥ 90%** over 100 alternating-colour games, **> 50%** on every adjacent pair, **100/100** termination with cap-as-error, **100/100** legal replay, byte-identical seeded reruns, mode-tagged cost |
| 5 | dependencies known | **⚠️** the `EPIC-005` book dependency is **named and deliberately unresolved** — it can invalidate this harness's baselines and no owner is assigned to that interaction |
| 6 | security/NFR triggers with a measurable target | **✅** — and the **~5 hour vs 3 s lane conflict is calculated and ruled** rather than discovered later |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `M` (3) |
| 9 | priority assigned | **✅** `P1`, **with the argument against it stated and handed to the owner** |
| 10 | no major unresolved blocker | **⚠️** **a 5-hour opt-in run has no home in this delivery process.** No board column, cadence or gate accommodates it, and nothing says who runs it or how often. Owner: the Orchestrator with the project owner |
