---
id: ABC-229
title: "Quiescence searches quiet promotions to a queen, bounded, behind an off-door"
status: backlog
column: Backlog
size: S
priority: P2
epic: EPIC-010
---

# ABC-229: quiet promotions in quiescence

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 1,
> verified by the SA (`…306a4012` row 1d). **Waits in Backlog on:** the ADR shared with `ABC-228`, the owner's Q4, and
> `ABC-228`'s merge (same file).

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only): the owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`). This ticket's reading is now the smoke pair before merge (`EPIC-010` § The
> merge rule), with a batched validation later. Q4 no longer holds it. **Next real wait:** the ADR shared with `ABC-228`, then `ABC-228`'s merge (same file). DoR 8/10 → 9/10.

## Problem

- **User:** the owner at level 5, mostly in endgames.
- **Pain:** `legalCaptures` keeps captures only (`src/legal.ts:90-103`); a capturing promotion is kept, a quiet one is
  not. SA probe Q3 (`8/P6k/8/8/8/8/8/K7 w - - 0 1`): `quiesce` = static = 212, while `chooseMove` sees the promotion
  (1 033). At the horizon, a pawn one step from queening is scored as a pawn.
- **Value:** quiescence sees a free queen at the horizon.

## Scope

1. Quiet promotions **to a queen only** join quiescence's move list, ordered after captures (or as the ADR rules).
2. An `ADR-0026` d10 off-door pair.
3. Bounded by `QUIESCENCE_MAX_PLY` (8).

## Out of scope

- Under-promotions in quiescence. Pawn pushes to the 7th. Anything `ABC-228` carries.

## Acceptance criteria

- **A1 (the door).** As `ABC-228` `A1`: node-equal, cross-build, on the `ABC-078` `A3` corpus (`G4`).
- **A2 (it sees the queen).** **Given** `Q-SET`'s ≥ 6 quiet-promotion rows (probe Q3 among them), **when** `quiesce`
  runs at qply 0 with a full window, **then** every row scores ≥ static + 600 cp where the promotion is safe, and the
  door scores the static eval.
- **A3 (growth).** **Given** `kiwipete` and `position-6` at fixed depth 6, **then** nodes ≤ **1.2 ×** the door's
  (promotions are rare in middlegames; the bar is BA/PM's, tighter than `ABC-228`'s 1.5). Frozen-clock pre-check, then
  `G6`.
- **A4 (gates).** `G1`, `G5`, `G6` "≥ base" (floor 6), `G8`, `G9`, `G10`.
- **A5 (the reading).** The smoke pair of `EPIC-010` § The merge rule (owner Q4 = (e), extended, 2026-10-29), on the candidate head rebased on `main`, before the merge: S-1 0 faults, S-2 0 losses on time, S-3 D ≥ 3.0 of 10 (else ≥ 7.0 of 20), S-4 R ≥ 3.0 of 10 (else ≥ 7.0 of 20). Reported: each smoke's W/L/D and score, the ledger's pooled R score since the last batch, `G11`.

## NFR triggers

- **`NFR-005`:** `G6`; floor 6 does not move. **`NFR-008`:** fixed-depth rows only. **Security:** none.

## Test notes

1. `Q-SET`'s promotion rows are frozen with `ABC-228`'s.
2. UAT is owed. The QE verdict signs it.

## Size and priority

- **Size: S.** One generator branch and a door, under an ADR already written for `ABC-228`.
- **Priority: P2.** Code-proven gap, cheap.

## Dependencies

- **Architect/Design:** the `ABC-228` ADR names quiet promotions (`ADR-0024` d4 lists them as out of scope).
- **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`). `ABC-228` merged or closed first (shared `src/quiescence.ts`); its D base is its own merge-base.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ probe Q3 |
| 2 | scope and out-of-scope | ✅ queen only |
| 3 | INVEST | ✅ own mechanism, own reading; S |
| 4 | testable, measurable acceptance | ✅ every row measurable; A5 is the smoke pair (`EPIC-010` § The merge rule, S-1–S-4) |
| 5 | dependencies known | ✅ ADR; `ABC-228` |
| 6 | NFR triggers with targets | ✅ nodes ≤ 1.2 ×; floor 6 |
| 7 | test notes | ✅ 2 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ ADR |

**DoR 9/10 (re-scored 2026-10-29). Backlog.**
