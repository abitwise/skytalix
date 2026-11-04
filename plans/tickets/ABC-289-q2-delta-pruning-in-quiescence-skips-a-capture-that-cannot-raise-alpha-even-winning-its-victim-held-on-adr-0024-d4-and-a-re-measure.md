---
id: ABC-289
title: "Q2: delta pruning in quiescence. Out of check, a capture is skipped when the stand-pat score plus its victim's value and a margin cannot raise alpha, behind a test-only off-door pair. Held on the Architect's re-measure over Q1 and its ADR"
status: backlog
column: Backlog
size: S
priority: P3
epic: EPIC-011
feature: —
adr: "owed: (1) the Architect's re-measure on main (quiescence's share of nodes, the trim over Q1's SEE pruning, drift, the mate floor); (2) a new ADR that amends ADR-0024 d4 (the Architect's call, ADR-0024 § Status, 2026-11-04): the margin, the exclusions, the door names, the firing figure at 100 ms and the intent; it must show the nine items listed there. The owner accepts it (reading (b))"
---

# ABC-289: delta pruning in quiescence (Q2)

> **THE OWNER'S HOLD LIFTED (`Q-3K-10` ANSWERED YES); STILL HELD ON THE ARCHITECT'S RE-MEASURE OVER Q1 AND ITS ADR,
> 2026-11-04, by BA/PM** (task `bapm-owner-answers-1104`, records only, at `main` `7dd241cf`; nothing run). Sources:
> the owner's word as the Orchestrator recorded it (`orch-2026-10-30a` `…7de79e90`) and the Architect's owed lines
> (`arch-owner-answers-1104` `…d6345b29` § 4).
> - **Hold 1, the owner's, is lifted:** `Q-3K-10` answered yes 2026-11-04 (`…7de79e90`). `ADR-0024` d4 is open for
>   Q2's **design**, as `Q-3K-9` opened it for Q1. A build ships on its own read (DP4).
> - **What still holds it:**
>   - (a) **the Architect's re-measure on `main` with Q1 in it** (hold 2): the premise reading of `ADR-0024`
>     § Status, the fourth block, item 2, under a sealed PREREG;
>   - (b) **a new ADR, by `ADR-0069`'s pattern, that amends d4,** and the owner's acceptance of it (reading (b) lets
>     the build start on PROPOSED). It must show the nine items listed in `ADR-0024` § Status, the fourth block.
> - **Lines changed:** the title; `adr:` (the owner's item dropped; the ADR is a new one amending d4); § Dependencies;
>   DoR rows 5 and 10; F1 moot, struck through and kept. No bar, size or priority moves. **DoR 9/10, Backlog, held.**
>   The file name keeps its as-cut slug. The board move is the Orchestrator's.

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog, HELD** (task `bapm-epic011-areas`, records only, at `main` `b274711c`;
> nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` Phase 3,
> stub row Q2 (and § Phases' 2026-11-03 line, "Q2 is not cut yet").
> - **Hold 1, the owner's: `ADR-0024` d4 keeps delta pruning fenced.** The owner's `Q-3K-9` yes opened d4 for Q1's
>   design only, and `ADR-0069` amended d4 for SEE pruning only; both say "delta pruning stays fenced". `EPIC-011`
>   § Scope lists Q2 among the items `Q-3K-5` re-opened for this epic, but Q1 still needed d4 opened by name. This
>   page asks the same for Q2: **`Q-3K-10`** (`EPIC-011` § Owner questions).
> - **Hold 2, the Architect's: a re-measure on `main` first.** Q2's only figure (`ADR-0024`: a 1.5× trim on top of
>   ordering) was read on a 2026-08 base, before futility, ordered quiescence and Q1's SEE pruning (`ABC-279`).
> - **Re-open trigger:** `Q-3K-10` answered yes, then the re-measure shows a trim over `main`'s quiescence with every
>   safety row clean. A "no" closes this page as fenced; a re-measure with no trim closes it as dropped.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** every game; quiescence runs at every leaf.
- **Pain:** quiescence searches every capture that `ABC-279` does not skip as SEE-losing, including captures that
  cannot raise alpha even if they win the victim outright.
- **Value:** `ADR-0056` D2 row Q2 estimates **+5–20 Elo** (an estimate; basis `ADR-0024`'s 1.5× trim). After Q1 the
  remaining trim is `UNKNOWN - verify`: SEE pruning may already skip most of what delta would.

## Scope

The ADR governs each line.

1. Out of check, a capture is skipped in quiescence when stand-pat + the victim's value + a margin ≤ alpha. The margin
   and the exclusions (promotions, and any phase or material condition) are the ADR's.
2. In check every evasion is still searched (`ADR-0053`, `ADR-0069`).
3. One switch and a test-only off-door pair (`ADR-0026` d10), reaching `quiesce` through its rules record as Q1's does
   (`ADR-0069` d6).

## Out of scope

- Checks in quiescence (still fenced by d4). SEE pruning in the main search (`ADR-0069`'s QSM, a named follow-up).
- The cap of 8 (`ADR-0024` d5) and the MVV-LVA order (d2).

## Acceptance criteria

The re-measure and the ADR fix exact counts before Ready. None is loosened after Ready.

- **DP0 (identity):** switch off, node counts equal `main`'s exactly (`G4`); `ABC-279`'s door pair reads its pre-ticket
  counts.
- **DP1 (the rule):** units on the margin and on each exclusion; an in-check row shows every evasion searched.
- **DP2 (safety, `ADR-0064` d7's list):** mate floor 0 violations; zugzwang 7 / 7 at recorded depths, none re-pinned;
  `G1` ≥ 54 / 58 with no NEWLY-missed line; a drift bar the ADR sets.
- **DP3 (pay, owed):** a quiescence node ratio and a reach gain at 47 000 nodes over `main` (with Q1), numbers the ADR's.
- **DP4 (the read; `EPIC-011` § The per-change rule, by reference).** Intent named by the ADR before Ready. C2′ ≥ 50.0
  (GAIN) or ≥ 43.0 (NEUTRAL) of 100, S′ at E 1 810, the Levels deep lane.
- **DP5:** `G6` "≥ base" (a search ticket).

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | ~~`Q-3K-10` no~~ | ~~closed: fenced by `ADR-0024` d4~~ *(moot 2026-11-04: `Q-3K-10` answered yes)* |
| F2 | the re-measure shows no trim over `main` | closed as dropped (premise not met) |
| F3 | DP0 red | a defect |
| F4 | DP2 red | a defect check first; if real, NOT MET |
| F5 | DP4 NOT MET | not merged |

## NFR triggers

- **`NFR-005`** (`G6`): "≥ base" binds.
- **`NFR-008`** (≤ 10 s): units only; the quiescence deep lane holds the heavier rows
  (`SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/quiescence.test.ts`).
- **`NFR-009`:** no new table.

## Test notes

1. QE freezes the re-measure's set before it runs.
2. UAT is owed (production lines); the QE verdict signs it.

## Size and priority

- **Size: S** (`ADR-0056` D2). **Priority: P3.**

## Dependencies

- ~~**`Q-3K-10`** (the owner).~~ *(Answered yes 2026-11-04, `…7de79e90`.)* **The re-measure over Q1 and the new ADR
  that amends `ADR-0024` d4** (the Architect's; the owner accepts the ADR, reading (b)). DoR row 10.
- **One at a time on `src/quiescence.ts`** with any ticket that edits it (Q1 merged; none open today).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ captures that cannot raise alpha are searched; the value is an estimate; its post-Q1 size `UNKNOWN - verify` |
| 2 | scope and out-of-scope | ✅ scope 1–3; checks in quiescence, QSM, the cap out |
| 3 | INVEST | ✅ S; one rule |
| 4 | testable, measurable acceptance | ✅ DP0 exact; DP2 0 / 7 of 7 / ≥ 54; DP4 ≥ 50.0 or ≥ 43.0. DP3's and the drift numbers owed with the ADR |
| 5 | dependencies known | ✅ `Q-3K-10` answered yes; the re-measure; `src/quiescence.ts` |
| 6 | NFR triggers with targets | ✅ `NFR-005`, `NFR-008` ≤ 10 s, `NFR-009` none |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ ~~**`ADR-0024` d4 fences it** (`Q-3K-10`, the owner's);~~ the re-measure and the ADR are owed. *2026-11-04 (`bapm-owner-answers-1104`): d4 is open for Q2's design (`Q-3K-10` yes). Row 10 now waits only on the Architect's re-measure on `main` over Q1 (`ADR-0024` § Status, the fourth block, item 2) and the new ADR that amends d4* |

**DoR 9/10. Backlog, held** (2026-11-04: on the Architect's re-measure over Q1 and its ADR only).
