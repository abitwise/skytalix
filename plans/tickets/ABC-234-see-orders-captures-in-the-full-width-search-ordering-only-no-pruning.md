---
id: ABC-234
title: "SEE orders captures in the full-width search: losing captures go after the quiet moves; ordering only, no pruning"
status: backlog
column: Backlog
size: M
priority: P3
epic: EPIC-010
---

# ABC-234: SEE for capture ordering

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 6, the
> SEE half (SA `…306a4012` row 6c). **SEE is fenced** by `ADR-0024` decision 4. Its own re-open condition: the
> SEE-lite column is the evidence that re-opens the fence **if** `ABC-084`'s puzzle count shows the engine losing
> material to a defended-square capture. **Waits in Backlog on** that evidence (or the Architect's reading of it), an
> ADR, and the owner's Q4. Milestone 2.

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only): the owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`). This ticket's reading is now the smoke pair before merge (`EPIC-010` § The
> merge rule), with a batched validation later. Q4 no longer holds it. **Next real wait:** `ADR-0024` d4's re-open evidence (A0), then an ADR. Milestone 2. DoR 7/10 → 8/10.

## Problem

- **User:** the owner at level 5.
- **Pain:** captures are ordered by MVV-LVA only (`src/search.ts:172-197`), so QxP into a defended pawn is tried before
  every quiet move, and under LMR the quiet moves behind it are reduced.
- **Value:** losing captures move back; good quiet moves move forward.

## Scope

1. A static exchange evaluator (`see(move) → cp`), pure, in its own module.
2. Full-width ordering only: captures with SEE < 0 go after the killers (or as the ADR rules). Quiescence ordering is
   unchanged.
3. An `ADR-0026` d10 off-door pair.

## Out of scope

- SEE pruning anywhere (§ B item 6: "a separate, riskier change"). SEE in quiescence. Delta pruning.

## Acceptance criteria

- **A0 (the fence).** Before design: Architect/Design reads `ABC-084`'s puzzle suite for losses to defended-square
  captures and rules whether `ADR-0024` d4's re-open condition is met. If not met, the ticket is closed unbuilt.
- **A1 (SEE).** **Given** ≥ 20 hand-checked exchange positions (x-rays included), **then** `see` equals the
  hand value on every one.
- **A2 (the door).** Node-equal, cross-build, on the `ABC-078` `A3` corpus (`G4`).
- **A3 (it pays in nodes).** **Given** `kiwipete` and `position-6` at fixed depth 7, **then** nodes ≤ **0.95 ×** the
  door's on both.
- **A4 (gates).** `G1`, `G5`, `G6` "≥ base" (floor 6), `G8`, `G9`, `G10`.
- **A5 (the reading).** The smoke pair of `EPIC-010` § The merge rule (owner Q4 = (e), extended, 2026-10-29), on the candidate head rebased on `main`, before the merge: S-1 0 faults, S-2 0 losses on time, S-3 D ≥ 3.0 of 10 (else ≥ 7.0 of 20), S-4 R ≥ 3.0 of 10 (else ≥ 7.0 of 20). Reported: each smoke's W/L/D and score, the ledger's pooled R score since the last batch, `G11`.

## NFR triggers

- **`NFR-005`:** A3, `G6`. **Security:** none.

## Test notes

1. A1's positions are committed as a fixture. UAT is owed. The QE verdict signs it.

## Size and priority

- **Size: M.** A new pure module plus an order change and a door. **Priority: P3.**

## Dependencies

- `ADR-0024` d4's re-open evidence (A0); an ADR; **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`). After `ABC-233` (shared `orderMoves`).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 6c |
| 2 | scope and out-of-scope | ⚠ ordering only, but whether it is built at all rests on A0's fence reading |
| 3 | INVEST | ✅ M |
| 4 | testable, measurable acceptance | ✅ every row measurable; A5 is the smoke pair (`EPIC-010` § The merge rule, S-1–S-4) |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ nodes ≤ 0.95 × |
| 7 | test notes | ✅ 1 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ the fence's evidence is unread; ADR |

**DoR 8/10 (re-scored 2026-10-29). Backlog.**
