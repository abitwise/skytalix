---
id: ABC-236
title: "Aspiration windows at the root from depth 5, with a stated widening re-search on a fail, behind an off-door"
status: backlog
column: Backlog
size: M
priority: P3
epic: EPIC-010
---

# ABC-236: aspiration windows at the root

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 9, the
> aspiration half (SA `…306a4012` row 9e). Never tried. `EPIC-008` § Out of scope listed aspiration windows; this is a
> new epic on the owner's ideas. **Waits in Backlog on** a new ADR and the owner's Q4. Milestone 2.

## Problem

- **User:** the owner at level 5.
- **Pain:** each iteration searches the root with a full window (`src/engine.ts:436-458`; header `:79-80`, "aspiration
  windows … none requested"), so every iteration pays for bounds it rarely needs.
- **Value:** fewer nodes per iteration, so a deeper finished iteration in the same 3 s.

## Scope

1. From iteration depth 5, the root window is the previous score ± δ (δ named in the ADR); on a fail low or high, a
   re-search with the window widened by a stated rule, ending in the full window.
2. Mate scores and the first iterations keep the full window.
3. An `ADR-0026` d10 off-door pair (the root's value and move can change on a re-search).

## Out of scope

- Aspiration below the root. PVS changes (`ADR-0026` holds). Time management (`EPIC-009`).

## Acceptance criteria

- **A1 (the door).** Node-equal, cross-build, on the `ABC-078` `A3` corpus (`G4`).
- **A2 (re-search is correct).** **Given** 6 positions whose score jumps by ≥ 200 cp between depths 5 and 6, **then**
  the head's depth-6 score equals the door's depth-6 score exactly (a widening re-search finds the true value).
- **A3 (it pays in nodes).** **Given** `kiwipete` and `position-6` at fixed depth 8, **then** total nodes over
  iterations 1–8 ≤ **0.95 ×** the door's on both.
- **A4 (gates).** `G1`, `G5`, `G6` "≥ base" (floor 6), `G8`, `G9`, `G10`.
- **A5 (the reading).** The Q4 rule. Reported: X ± Y, the re-search rate per move in the reading, `G11`.

## NFR triggers

- **`NFR-005`:** A3, `G6`. **`NFR-004`:** a re-search near the deadline obeys the existing clock check; `G5` reads it.
- **Security:** none.

## Test notes

1. A2's positions committed as a fixture. UAT is owed. The QE verdict signs it.

## Size and priority

- **Size: M.** **Priority: P3.**

## Dependencies

- **Architect/Design:** a new ADR (δ, the widening rule, the door). Reported to the owner. **Owner:** Q4.
- Shares `src/engine.ts` with `ABC-230`: one at a time.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 9e |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ M |
| 4 | testable, measurable acceptance | ⚠ A5 is Q4's |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ nodes ≤ 0.95 ×; `G5` |
| 7 | test notes | ✅ 1 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ ADR; Q4 |

**DoR 8/10. Backlog.**
