---
id: ABC-084
title: Tactical puzzle suite as a strength regression gate
status: backlog
column: Backlog
size: M
priority: P0
epic: EPIC-004
feature: —
---

# ABC-084 — the epic's own test note, built: a commit that drops the solve count fails

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-004`, Workflow 03). This ticket is
> `EPIC-004`'s `## Test notes` section made real — *"Tactical puzzle suite (mate-in-N and
> win-material positions) as a strength regression gate; a commit that drops puzzle-solve count
> fails the gate"* — and it is half of `RISK-003`'s mitigation.

## Problem

*User*: everyone downstream of a strength regression, which is invisible without an instrument.

*Pain*: `RISK-003` states it — **strength is hard to verify without a reference opponent**, and
`plans/nfr-catalog.md` records it as *"untouched and remains open"*. Every ticket in this epic that
claims a strength improvement (`ABC-079`, `ABC-080`, `ABC-082`, `ABC-083`) currently has **no
instrument to claim it against**. Worse, a refactor that quietly makes the engine weaker passes
every test this project has.

*Value*: it is the only cheap, deterministic, fast strength signal available, and it directly
implements **two of the epic's five acceptance criteria** (mate-in-2 found; hanging piece not
played).

## Scope

- A curated suite of **≥ 40** positions in two classes, each with its known correct move(s):
  - **mate-in-N** (N ≤ 3) — the epic's third acceptance criterion.
  - **win-material / do-not-hang** — the epic's fourth acceptance criterion.
- A runner that reports **solved / total** and the per-puzzle result.
- A **recorded baseline count**, checked in, that a later run is compared against.
- **The gate rule**: a run whose solved count is **below the recorded baseline** fails.

## Out of scope

- **The self-play ladder** — `ABC-085`. Different instrument, different question (relative strength
  vs regression detection), radically different cost.
- **Absolute Elo.** `UNKNOWN - verify` until measured against a rated reference, per the epic. This
  suite does **not** produce an Elo number and must not be quoted as one.
- **Adding puzzles to raise the number.** The baseline moves only with a stated reason.
- **Wiring this into `quality.mandatory_gates`.** That key is `["lint","typecheck","unit","build"]`
  and changing it is a config decision with an owner. **Flagged, not done** — see `## Dependencies`.

## Acceptance (Given/When/Then)

- **`A1` (mate-in-2 is found — the epic's criterion, verbatim).** **Given** a position with a forced
  mate in 2, **when** the engine searches at default strength, **then** it finds the mate. Asserted
  over **≥ 10** mate-in-2 positions: **10/10**.
- **`A2` (the hanging piece is not played — the epic's criterion, verbatim).** **Given** a position
  where a piece hangs to a simple one-move tactic, **when** the engine searches at default strength,
  **then** it does not play the losing move. Asserted over **≥ 20** positions: **≥ 19/20**.
- **`A3` (the gate actually fails).** **Given** a deliberately weakened engine — evaluation returning
  a constant — **when** the suite runs, **then** it reports a **lower** solved count than the
  baseline and **exits non-zero**. *(A gate nobody has seen go red is not a gate. This criterion is
  the whole point of the ticket.)*
- **`A4` (it is deterministic).** **Given** the same build and the same seed, **when** the suite runs
  **three** times, **then** the solved count is **identical** all three times, and the per-puzzle
  results are identical. *(A flaky strength gate gets disabled within a week.)*
- **`A5` (it is fast enough to be run).** **Then** the suite completes in **≤ 60 s wall** at the
  budget it uses. **The suite uses a reduced per-move budget, not the 3 s default** — 40 puzzles at
  3 s is 2 minutes and nobody will run it.
- **`A6` (every puzzle carries its provenance).** **Then** each position records FEN, the accepted
  move(s), its class, and where it came from. **A puzzle whose "correct" answer is the engine's own
  current output is not a puzzle** — the answers are independently sourced, and the ticket says how.
- **`A7` (the baseline is data, not a magic number).** **Then** the recorded baseline is a checked-in
  file stating the count, the commit it was measured at, the budget used and the machine.

## Dependencies

- **`ABC-078` must land first — OPEN.** The suite needs a per-move budget to run under.
- **`ABC-077`, `ABC-076` — OPEN** (transitively).
- **`ABC-079` should land first — OPEN.** `A2` at ≥ 19/20 is unlikely to pass without quiescence.
  **If this ticket lands first, `A2`'s baseline is simply lower and `ABC-079` raises it — which is
  the correct relationship between a gate and the work it measures.**
- **Shared corpus with `ABC-079`:** `ABC-079` `A1` needs ≥ 20 do-not-hang positions and so does
  `A2`. **Whichever ticket lands first builds the corpus; the second extends it and does not fork
  it.** *(Named on both tickets, because two tickets each assuming the other built a shared thing is
  this board's recorded failure mode.)*
- **Adding this to `quality.mandatory_gates` — NOT done here.** Owner: the Orchestrator with the
  project owner. `.grugops/factory.config.json` is not BA/PM's to edit and a strength gate is a
  policy change, not a ticket's side effect.

## Security / NFR triggers

- **`RISK-003` — this ticket is half its mitigation** (the other half is `ABC-085`).
- **`N8-LANE` — ≤ 650 ms CPU. ⚠️ THIS SUITE CANNOT LIVE IN THE DEFAULT LANE.** `A5` allows **60 s**;
  the lane bar is 650 ms per ticket and `NFR-008`'s whole-suite clause is **3 s wall / 13 s CPU**.
  **Ruling: the puzzle suite is OPT-IN, following `PERFT_DEEP`'s established shape
  (`PERFT_DEEP=1 npx vitest run src/perft.test.ts`), and is NOT in the default `npm test` lane.**
  This project already has exactly this pattern for exactly this reason; it is reused, not
  reinvented.
- **`NFR-004` — not triggered.** The suite runs at a reduced budget by design (`A5`).
- **Security — not triggered.** Static data and a runner.

## Test notes

1. **`A3` is the criterion that proves the ticket.** Build the weakened-engine harness first; a gate
   that has never gone red is decoration.
2. **`A6` is not bureaucracy.** A puzzle answered by asking the current engine locks in today's
   behaviour and can never detect anything.
3. **`A4`'s three runs must be in separate processes.** Same-process determinism is weaker.
4. **Do not raise the baseline in the same commit that changes the engine** — the baseline is
   evidence, and moving it and the code together destroys the comparison.

## Size and priority rationale

**Size `M` (3).** The runner is small; **curating ≥ 40 provenanced positions is the real work**, and
so is the weakened-engine harness for `A3`. **Not `L`:** no production module, no design decision,
no dependency edge into `src/`.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P0`.** It implements two of the epic's five acceptance criteria directly, and without it
four other tickets in this epic cannot substantiate their strength claims.

## Definition of Ready

Assessed by BA/PM, **2026-08-16**. **Result: 8 of 10 clean, 2 ⚠️ — NOT met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** `RISK-003` quoted as open; the invisible-regression pain stated concretely |
| 2 | scope and out-of-scope clear | **✅** four fences, including the config change explicitly refused and handed to an owner |
| 3 | INVEST-shaped | **⚠️** **not independent** — three open dependencies plus a shared corpus |
| 4 | acceptance testable and measurable | **✅** seven: **10/10** mates, **≥ 19/20** tactics, a **red-gate demonstration**, three-run determinism, **≤ 60 s**, per-puzzle provenance, a dated baseline file |
| 5 | dependencies known | **✅** three open tickets, a shared-corpus ownership rule, and a config change refused with a named owner |
| 6 | security/NFR triggers with a measurable target | **✅** — and the **`N8-LANE` conflict is named and RULED** (opt-in, `PERFT_DEEP` shape) rather than left to the developer |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `M` (3) |
| 9 | priority assigned | **✅** `P0` |
| 10 | no major unresolved blocker | **⚠️** **an opt-in gate is a gate nobody runs.** The mechanism is decided; **who runs it, and at which board transition, is not** — and it is not BA/PM's to add to `quality.mandatory_gates`. Owner: the Orchestrator with the project owner. **Without that decision this ticket ships an instrument with no trigger** |
