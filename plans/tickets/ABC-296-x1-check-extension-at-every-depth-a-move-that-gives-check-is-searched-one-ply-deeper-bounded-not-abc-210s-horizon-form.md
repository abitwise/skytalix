---
id: ABC-296
title: "X1: a check extension at every depth. A move that gives check is searched one ply deeper wherever it occurs in the full-width search, under a stated bound on growth, behind a test-only off-door pair (not ABC-210's horizon form, which stays closed)"
status: backlog
column: Backlog
size: S
priority: P3
epic: EPIC-011
feature: —
adr: "owed (the Architect's): a new ADR (ADR-0026 d10), or a revival of part of ADR-0051 (accepted, not in force), the Architect's call: the extension rule, its bound (per line or total), the exclusions, the door names, the firing figure at 100 ms and the intent. A new ADR is the owner's to accept (reading (b))"
---

# ABC-296: check extension at every depth (X1)

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog** (task `bapm-epic011-areas`, records only, at `main` `b274711c`;
> nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` Phase 5,
> stub row X1. Re-opened in scope by `Q-3K-5` (`EPIC-011` § Scope: "`ABC-210` (X1, another form)").
> - **Hold:** the ADR only. No evidence or ruling holds it.
> - **Nearest prior evidence:** `ABC-210`'s form (a) at the horizon read NEUTRAL, −4.8 ± 16.2 over 800 games, and was
>   closed unmerged under S1 (`EPIC-008`); `ADR-0051` stays not in force unless this ticket's ADR revives part of it.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** every game; forcing lines.
- **Pain:** a checking move deep in the tree is searched to the same remaining depth as any other move, so a forcing
  sequence can run past the horizon. `ABC-228` covers check evasions inside quiescence, not checks in the full-width
  search.
- **Value:** `ADR-0056` D2 row X1 estimates **+10–30 Elo** (an estimate, [J]; [R] `ABC-210` −4.8 ± 16.2, another form).
  Not a reading.

## Scope

The ADR governs each line.

1. A move that gives check is searched with one more ply of remaining depth, at every depth of the full-width search.
2. A stated bound keeps the tree finite and the growth measured (per line, per ply or total; the ADR's).
3. One switch and a test-only off-door pair (`ADR-0026` d10). Older doors turn it off.

## Out of scope

- `ABC-210`'s horizon form and checks in quiescence (`ADR-0024` d4 still fences them). Singular extension (`ABC-297`).

## Acceptance criteria

The ADR fixes exact counts before Ready. None is loosened after Ready.

- **CE0 (identity):** switch off, node counts equal `main`'s exactly; every pre-ticket door reproduces its counts
  (`G4`).
- **CE1 (the rule):** units: a checking move gets the extra ply; a non-checking move does not; the bound stops it at
  its limit.
- **CE2 (growth, owed):** a fixed-depth node ratio on kiwipete and position-6 in both recursions at or below the ADR's
  bound (`ABC-210`'s title carried a growth bound too; its form is the nearest precedent).
- **CE3 (safety, `ADR-0064` d7's list):** mate floor 0 violations; zugzwang 7 / 7 at recorded depths, none re-pinned;
  `G1` ≥ 54 / 58 with no NEWLY-missed line.
- **CE4 (the read; `EPIC-011` § The per-change rule, by reference).** Intent named by the ADR before Ready. C2′ ≥ 50.0
  (GAIN) or ≥ 43.0 (NEUTRAL) of 100, S′ at E 1 810, the Levels deep lane.
- **CE5:** `G6` "≥ base" (a search ticket); an extension spends depth, so this is the row most at risk.

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | CE0 red | a defect |
| F2 | CE2 over the bound | STOP to Architect/Design; the bound is not raised to pass |
| F3 | CE3 red | a defect check first; if real, NOT MET |
| F4 | CE4 NOT MET, or CE5 below base | not merged |

## NFR triggers

- **`NFR-005`** (`G6`): "≥ base" binds; every run ≥ 6.
- **`NFR-004`:** unchanged; the search is time-bounded. **`NFR-008`** (≤ 10 s): units only; growth rows in
  `SEARCH_DEEP`. **`NFR-009`:** no new table.

## Test notes

1. QE freezes CE2's positions and depths before the build.
2. UAT is owed (production lines); the QE verdict signs it.

## Size and priority

- **Size: S** (`ADR-0056` D2). **Priority: P3.**

## Dependencies

- **The ADR** (the Architect's). DoR row 10.
- **One at a time on `src/search.ts` / `src/engine.ts`** with `ABC-282`, `ABC-283`, `ABC-284`–`ABC-287`, `ABC-297`.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ checks deep in the tree not extended; prior evidence stated; the value is an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–3 |
| 3 | INVEST | ✅ S; one rule |
| 4 | testable, measurable acceptance | ✅ CE0 exact; CE3 0 / 7 of 7 / ≥ 54; CE4 ≥ 50.0 or ≥ 43.0; CE5 ≥ base. CE2's bound owed with the ADR |
| 5 | dependencies known | ✅ the ADR; the shared files |
| 6 | NFR triggers with targets | ✅ `NFR-005` ≥ base; `NFR-008` ≤ 10 s; `NFR-009` none |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ **the ADR is owed** |

**DoR 9/10. Backlog.**
