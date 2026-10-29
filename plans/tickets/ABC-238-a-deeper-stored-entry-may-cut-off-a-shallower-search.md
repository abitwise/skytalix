---
id: ABC-238
title: "A deeper stored entry may cut off a shallower search, revising ABC-081 A1, behind an off-door"
status: backlog
column: Backlog
size: M
priority: P3
epic: EPIC-010
---

# ABC-238: deeper-entry TT cutoffs

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 9 (SA
> `…306a4012` row 9c). **This revises a rule:** `ABC-081` `A1`, "the table changes the work, never the value". Using a
> deeper entry changes values. **Waits in Backlog on** the rule's revision (an ADR), the owner's Q4, and `ABC-237`.
> Milestone 2.

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only): the owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`). This ticket's reading is now the smoke pair before merge (`EPIC-010` § The
> merge rule), with a batched validation later. Q4 no longer holds it. **Next real wait:** the ADR revising `ABC-081` `A1`, then `ABC-237` merged. Milestone 2. DoR 8/10 → 9/10.

## Problem

- **User:** the owner at level 5.
- **Pain:** `tableCutoff` uses an entry only at exactly the stored depth (`src/transposition.ts:149-162`,
  `entryDepth(slot) !== depth`), so a depth-8 result cannot answer a depth-5 question.
- **Value:** more cutoffs from work already done.

## Scope

1. `tableCutoff` accepts a stored depth ≥ the requested depth, with the bound rules unchanged.
2. An `ADR-0026` d10 off-door pair, and the `ABC-081` `A1` revision recorded in the ADR.

## Out of scope

- Replacement (`ABC-237`). Retention (`ABC-209`). Size.

## Acceptance criteria

- **A1 (the door).** Node-equal, cross-build, on the `ABC-078` `A3` corpus (`G4`).
- **A2 (the rule).** **Given** a stored exact entry at depth 8, **when** a depth-5 probe hits it, **then** it cuts off
  with the stored score; the door does not.
- **A3 (drift).** **Given** `ABC-121`'s 190 at depth 5, **then** ≥ 95 % of non-mate scores are within 25 cp of the
  door's, and 0 mate scores change sign.
- **A4 (it pays).** At fixed depth 8 on `kiwipete` and `position-6`, nodes ≤ **0.95 ×** the door's on both; `G6`
  "≥ base" by its rule (floor 6).
- **A5 (gates).** `G1`, `G5`, `G7`, `G8`, `G9`, `G10`.
- **A6 (the reading).** The smoke pair of `EPIC-010` § The merge rule (owner Q4 = (e), extended, 2026-10-29), on the candidate head rebased on `main`, before the merge: S-1 0 faults, S-2 0 losses on time, S-3 D ≥ 3.0 of 10 (else ≥ 7.0 of 20), S-4 R ≥ 3.0 of 10 (else ≥ 7.0 of 20). Reported: each smoke's W/L/D and score, the ledger's pooled R score since the last batch, `G11`.

## NFR triggers

- **`NFR-005`:** A4. **Security:** none.

## Test notes

1. UAT is owed. The QE verdict signs it.

## Size and priority

- **Size: M.** One predicate, but it revises an oracle rule (`ABC-081` `A1`) that many tests rest on. **Priority: P3.**

## Dependencies

- **Architect/Design:** an ADR that revises `ABC-081` `A1` and amends `ADR-0025`. Reported to the owner.
- **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`). `ABC-237` merged or closed first.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 9c |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ M |
| 4 | testable, measurable acceptance | ✅ every row measurable; A6 is the smoke pair (`EPIC-010` § The merge rule, S-1–S-4) |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ nodes ≤ 0.95 ×; drift 95 % / 25 cp |
| 7 | test notes | ✅ 1 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ ADR; `ABC-237` |

**DoR 9/10 (re-scored 2026-10-29). Backlog.**
