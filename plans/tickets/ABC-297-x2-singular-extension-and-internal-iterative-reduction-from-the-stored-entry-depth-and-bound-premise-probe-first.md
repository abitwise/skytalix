---
id: ABC-297
title: "X2: singular extension and internal iterative reduction (IIR). A hash move that a reduced-depth exclusion search shows is the only good move is searched one ply deeper; a node with no hash move at sufficient depth is searched one ply shallower; behind a test-only off-door pair, after a premise probe on the stored entries"
status: dropped
column: Done
size: M
priority: P3
epic: EPIC-011
feature: —
adr: "owed (the Architect's): a premise probe first (how often main's per-move table holds a usable entry, its depth and bound, at the depths where the rule acts, at 47 000 nodes), then a new ADR (ADR-0026 d10): the singular test (margin, reduced depth, the depth floor), IIR's rule, whether the two land together or IIR first, the door names, the firing figure at 100 ms and the intent. A new ADR is the owner's to accept (reading (b))"
---

# ABC-297: singular extension and IIR (X2)

> **CLOSED WON'T-DO, 2026-11-09, by BA/PM** (task `bapm-close-1109`, records only, at `main` `e069b49a`; nothing run): project closed by the owner 2026-11-09 (`orch-2026-10-30a` `…a9c03e07`). Status `dropped`, column Done: closed, not delivered. The page below stands as the record; the board move is the Orchestrator's.

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog** (task `bapm-epic011-areas`, records only, at `main` `b274711c`;
> nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` Phase 5,
> stub row X2.
> - **"After T1" names a premise that no longer exists:** `ABC-238` (T1) closed unmerged on F4 (`EPIC-011` § Phases,
>   2026-11-03). X2's real input is a stored entry's depth and bound. `main`'s table stores both (`src/transposition.ts`
>   header: depth, bound exact / lower / upper, score, move), always-replace, cleared every search, 2^18 slots. Whether
>   enough entries qualify at 100 ms is **`UNKNOWN - verify`**; the premise probe reads it.
> - **Hold:** the premise probe and the ADR.
> - **Split rule:** if the ADR lands IIR first or in another form, BA/PM splits IIR out as its own ticket before Ready.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** games at longer controls, where the search reaches the depths at which singular extension acts: the 40/15
  claim (`ADR-0056` C1).
- **Pain:** a move that is far better than every alternative gets no more depth than any other, so a forced line can be
  cut short. A node with no hash move spends a full-depth search ordering blind.
- **Depth gate:** `RISK-EPIC011-05` names singular extension among the changes that act only at depth 7 or more and
  mostly do not fire in a 100-game read at 100 ms (median depth 6). The ADR's firing figure decides the intent.
- **Value:** `ADR-0056` D2 row X2 estimates **+20–50 Elo** (an estimate, [B] 8.0 / 8.5.5; risk high). Not a reading.

## Scope

The ADR governs each line.

1. **Singular extension:** at a node of remaining depth at or above a floor, with a hash move whose stored entry is a
   lower or exact bound at sufficient depth, a reduced-depth search excluding the hash move against a margin below the
   stored score; if every alternative fails low, the hash move is searched one ply deeper.
2. **IIR:** at a node of sufficient depth with no hash move, the remaining depth is reduced by one ply.
3. One switch per part and a test-only off-door pair (`ADR-0026` d10). Older doors turn them off.

## Out of scope

- A deeper-cut rule in the table (T1, dropped), replacement or table size (`ABC-237`, `ABC-258`, parked), a table kept
  across moves (`ABC-257`, paused). Multi-cut and negative extensions, unless the ADR shows scope 1 needs them.

## Acceptance criteria

The probe and the ADR fix exact counts before Ready. None is loosened after Ready.

- **SE0 (identity):** switches off, node counts equal `main`'s exactly; every pre-ticket door reproduces its counts
  (`G4`).
- **SE1 (the rules):** units: the singular test extends when every alternative fails low and does not when one does;
  IIR reduces only with no hash move at the floor.
- **SE2 (safety, `ADR-0064` d7's list):** mate floor 0 violations; zugzwang 7 / 7 at recorded depths, none re-pinned;
  `G1` ≥ 54 / 58 with no NEWLY-missed line.
- **SE3 (pay, owed):** a pre-registered measured bar that sees the depths where it acts (a fixed-depth node ratio at the
  ADR's depths, or completed depth at a longer budget, held out). It never stands alone.
- **SE4 (the read; `EPIC-011` § The per-change rule, by reference).** Intent named by the ADR before Ready by its firing
  figure: GAIN, or "NEUTRAL (invisible at 100 ms)" with SE3 as its bar. C2′ ≥ 50.0 or ≥ 43.0 of 100, S′ at E 1 810, the
  Levels deep lane.
- **SE5:** `G6` "≥ base" (a search ticket).

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | the probe shows too few usable entries (the ADR's line) | closed as dropped (premise not met); nothing built |
| F2 | SE0 red | a defect |
| F3 | SE2 red | a defect check first; if real, NOT MET |
| F4 | SE3 missed or SE4 NOT MET | not merged |

## NFR triggers

- **`NFR-005`** (`G6`): "≥ base" binds; every run ≥ 6.
- **`NFR-004`:** unchanged. **`NFR-008`** (≤ 10 s): units only; probe rows in `SEARCH_DEEP`. **`NFR-009`:** no new
  table; the existing 4 MiB table is read, not grown.

## Test notes

1. QE freezes the probe's set and SE3's held-out set before the build.
2. UAT is owed (production lines); the QE verdict signs it.

## Size and priority

- **Size: M** (`ADR-0056` D2). **Priority: P3** (risk high; depth-gated).

## Dependencies

- **The premise probe and the ADR** (the Architect's). DoR row 10.
- **One at a time on `src/search.ts` / `src/engine.ts`** with the other search tickets. If `ABC-257` (T1 + T3) resumes
  and merges first, the probe is re-read on that table.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ no extension for a singular move, no IIR; the dead T1 premise replaced by the stored entry; the value is an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–3, with a split rule |
| 3 | INVEST | ✅ M |
| 4 | testable, measurable acceptance | ✅ SE0 exact; SE2 0 / 7 of 7 / ≥ 54; SE4 ≥ 50.0 or ≥ 43.0; SE5 ≥ base. SE3's number owed with the ADR |
| 5 | dependencies known | ✅ the probe; the shared files; `ABC-257` if it resumes |
| 6 | NFR triggers with targets | ✅ `NFR-005` ≥ base; `NFR-008` ≤ 10 s; `NFR-009` none |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ **the premise probe and the ADR are owed** |

**DoR 9/10. Backlog.**
