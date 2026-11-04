---
id: ABC-298
title: "V3: staged move generation. At a full-width node the hash move is tried before any move is generated, and captures are generated and searched before quiet moves are generated, so a cutoff saves the generation it no longer needs"
status: backlog
column: Backlog
size: M
priority: P3
epic: EPIC-011
feature: —
adr: "owed (the Architect's): a new ADR (or an ADR-0003 / ADR-0055 amendment, the Architect's call): the stages and their order against today's orderMoves, how the hash move is checked for legality before generation, whether the change is value-identical (node-identical, S2 nps, no games) or value-changing (ADR-0026 door, C2′), the speed bar and the intent if value-changing. The owner accepts a new ADR or an amendment (reading (b))"
---

# ABC-298: staged move generation (V3)

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog** (task `bapm-epic011-areas`, records only, at `main` `b274711c`;
> nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` Phase 5,
> stub row V3.
> - **Its wait is met:** "after V2" (`ABC-254`, lazy legality) — `ABC-254` merged at `3bfe180e` on 2026-11-01
>   (`EPIC-010`).
> - **Hold:** the ADR only. It also waits its turn on `orderMoves` after `ABC-283` (which edits the order).
> - **Named elsewhere as a re-open premise:** `ADR-0065` § Status re-open 2 (O3s: "ordering also saves generation work
>   that a node count cannot see") and `ADR-0063` § Status re-open 2 (O1h). Both are inside `ABC-283` now.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** every game; nodes per second.
- **Pain:** a full-width node generates every legal move before it searches the first, even when the hash move cuts off
  at once (82 % of cutoffs fall on the first move, `ADR-0063` § Context). The generation done for the other moves is
  wasted.
- **Value:** `ADR-0056` D2 row V3 estimates **+10–30 Elo** (an estimate, [J]). `ADR-0055`'s 50–100 Elo per speed
  doubling is the conversion basis ([D]). Not a reading.

## Scope

The ADR governs each line.

1. Stage 1: the hash move, checked for legality, searched before any generation.
2. Stage 2: captures (and promotions, by the ADR's rule), generated and ordered as today.
3. Stage 3: the killers and the quiet moves, generated only if no earlier stage cut off.
4. The move order the search sees is `main`'s, or the ADR says where it differs. If it is the same, the change is
   value-identical; if not, an `ADR-0026` door pair and the per-change rule apply.

## Out of scope

- Bitboards (V4, `Q-3K-8`, the owner's). Any change to the evaluation or the order's keys. Lazy legality (`ABC-254`,
  merged).

## Acceptance criteria

The ADR fixes exact counts before Ready. None is loosened after Ready.

- **SG0 (perft):** the perft suite reads its pinned counts, default and deep (`PERFT_DEEP=1
  NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/perft.test.ts`), on the head.
- **SG1 (identity, if value-identical):** `search()` and `chooseMove` node counts on kiwipete and position-6 at the
  ADR's depths equal `main`'s exactly, with the same best move and score; every door reproduces its counts (`G4`).
- **SG2 (a hash move that is not legal):** units: an illegal or stale hash move is never played or searched.
- **SG3 (speed, owed):** the S2 nps reading against base, with the bar the ADR sets (`EPIC-011` § The per-change rule:
  value-identical tickets keep S2 and play no games).
- **If value-changing instead:** `ADR-0064` d7's safety rows (mate floor 0 violations, zugzwang 7 / 7, `G1` no
  NEWLY-missed line), C2′ ≥ 50.0 (GAIN) or ≥ 43.0 (NEUTRAL) of 100 by the ADR's intent, S′ at E 1 810, the Levels deep
  lane, `G6` "≥ base".

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | SG0 red | a defect: generation is wrong |
| F2 | SG1 red on a value-identical design | a defect |
| F3 | SG2 red | a defect |
| F4 | SG3 missed | NOT MET; not merged |

## NFR triggers

- **`NFR-005`** (`G6`): "≥ base" binds; a speed change should raise it.
- **`NFR-008`** (≤ 10 s): units only; perft deep stays opt-in. **`NFR-009`:** no new table (per-ply move buffers stated
  in bytes if they change).

## Test notes

1. QE freezes SG1's counts on `main` before the build.
2. UAT: production lines, so owed unless the standing waiver applies; the QE verdict signs it.

## Size and priority

- **Size: M** (`ADR-0056` D2). **Priority: P3.**

## Dependencies

- **The ADR** (the Architect's). DoR row 10.
- **After `ABC-283` on `orderMoves` / `src/search.ts` / `src/engine.ts`**, and one at a time with `ABC-288`. Shares
  `src/legal.ts` and `src/moves.ts` with any later legality ticket.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ full generation before the first move; the value is an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–4 |
| 3 | INVEST | ✅ M |
| 4 | testable, measurable acceptance | ✅ SG0 pinned perft; SG1 exact; SG2 never played; SG3's number owed with the ADR |
| 5 | dependencies known | ✅ V2 met; `ABC-283` first; the shared files |
| 6 | NFR triggers with targets | ✅ `NFR-005`; `NFR-008` ≤ 10 s; `NFR-009` |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ **the ADR is owed** (value-identical or not, and the speed bar) |

**DoR 9/10. Backlog.**
