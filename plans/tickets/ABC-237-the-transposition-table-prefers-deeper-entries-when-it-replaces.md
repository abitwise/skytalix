---
id: ABC-237
title: "The transposition table prefers deeper entries when it replaces, still cleared per search and still 4 MiB"
status: backlog
column: Backlog
size: S
priority: P3
epic: EPIC-010
---

# ABC-237: depth-preferred TT replacement

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 9, the
> replacement half (SA `…306a4012` rows 9a, 9b). **Not `ABC-209`:** the table is still cleared per search
> (`ADR-0025` d4 as in force). **Waits in Backlog on** an `ADR-0025` amendment and the owner's Q4. Milestone 2.

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only): the owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`). This ticket's reading is now the smoke pair before merge (`EPIC-010` § The
> merge rule), with a batched validation later. Q4 no longer holds it. **Next real wait:** an `ADR-0025` amendment. Milestone 2. DoR 8/10 → 9/10.

## Problem

- **User:** the owner at level 5.
- **Pain:** the table always replaces (`src/transposition.ts:22-26`, `:135-147`), so a shallow entry evicts a deep one
  that cost far more to compute.
- **Value:** deep entries survive, so more hash moves and cutoffs from expensive work.

## Scope

1. Replacement by a stated rule (for example: replace if the new depth ≥ the stored depth, or the stored entry is from
   an older iteration), named in the ADR. Size unchanged: 2^18 × 16 B = 4 MiB.
2. An `ADR-0026` d10 off-door: under LMR a different hash move changes values (SA 6c's mechanism).

## Out of scope

- Table size (2^19 fits `NFR-009`; 2^20 is a re-level, the owner's). Buckets. Keeping the table across moves
  (`ABC-209`). Deeper-entry cutoffs (`ABC-238`).

## Acceptance criteria

- **A1 (the door).** Node-equal, cross-build, on the `ABC-078` `A3` corpus (`G4`).
- **A2 (the rule).** **Given** a unit row that stores depth 6 then depth 2 at one slot, **then** the depth-6 entry
  remains; and the converse case replaces.
- **A3 (it pays).** **Given** `kiwipete` and `position-6` at 3 000 ms, 5 interleaved runs per build, **then** head's
  median completed depth ≥ base's on both (`G6`), and at fixed depth 8 nodes ≤ **0.97 ×** the door's on at least one.
- **A4 (memory).** `G7`: ≤ 16 MiB, growth ≤ 1 MiB between 1 s and 3 s.
- **A5 (gates).** `G1`, `G5`, `G8`, `G9`, `G10`.
- **A6 (the reading).** The smoke pair of `EPIC-010` § The merge rule (owner Q4 = (e), extended, 2026-10-29), on the candidate head rebased on `main`, before the merge: S-1 0 faults, S-2 0 losses on time, S-3 D ≥ 3.0 of 10 (else ≥ 7.0 of 20), S-4 R ≥ 3.0 of 10 (else ≥ 7.0 of 20). Reported: each smoke's W/L/D and score, the ledger's pooled R score since the last batch, `G11`.

## NFR triggers

- **`NFR-009`:** A4. **`NFR-005`:** A3. **Security:** none.

## Test notes

1. UAT is owed. The QE verdict signs it.

## Size and priority

- **Size: S.** One function and a door. **Priority: P3.**

## Dependencies

- **Architect/Design:** an `ADR-0025` amendment (its falsifier `T2` is the measurement that would change
  always-replace). Reported to the owner. **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`). Before `ABC-238` (shared file).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 9b |
| 2 | scope and out-of-scope | ✅ size and retention out |
| 3 | INVEST | ✅ S |
| 4 | testable, measurable acceptance | ✅ every row measurable; A6 is the smoke pair (`EPIC-010` § The merge rule, S-1–S-4) |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ ≤ 16 MiB; nodes ≤ 0.97 × |
| 7 | test notes | ✅ 1 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ ADR |

**DoR 9/10 (re-scored 2026-10-29). Backlog.**
