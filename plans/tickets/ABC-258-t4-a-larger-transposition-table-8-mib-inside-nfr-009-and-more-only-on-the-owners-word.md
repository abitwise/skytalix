---
id: ABC-258
title: "T4: a larger transposition table, 2^19 entries (8 MiB) inside NFR-009's 16 MiB, and more only on the owner's word (Q-3K-6)"
status: backlog
column: Backlog
size: S
priority: P3
epic: EPIC-011
---

# ABC-258: a larger TT (T4)

> **Cut 2026-11-01 by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`; nothing run). Source:
> `ADR-0056` D2 row T4 ("larger TT (16–64 MiB) … +5–15 at 4 s … `NFR-009` (16 MiB now; owner pre-offered 128 MiB,
> 2026-09-25) … none — new ticket") and D7 Q-3K-6. `EPIC-011` Phase 1, last.

## Problem

- **User:** the owner in `uci-clock-mode` at 40/15, and the claim reading.
- **Pain:** the table has 2^18 = 262 144 entries, 4 MiB (`src/transposition.ts` `TABLE_BITS = 18`). At 40/15 a move
  searches ≈ 14–20 M nodes at today's 0.63–0.90 M nodes/s (`ADR-0056` D1; arithmetic, not a reading), so most entries
  are overwritten many times within one move. At 4 s the gain is small (+5–15, estimate); at 22 s it is larger
  (`UNKNOWN - verify`).
- **Value:** more of the search's own work survives, most at the claim control.

## Scope

1. `TABLE_BITS` 18 → 19: 2^19 entries × 16 B = **8 MiB**. `NFR-009` already names 2^19 as fitting ("2^19 entries fits;
   2^20 is a re-level, the owner's", `EPIC-010` § NFR triggers).
2. **Only on the owner's yes to Q-3K-6:** a larger size up to the level he sets (2^20 = 16 MiB alone fills today's
   bound; 2^22 = 64 MiB is `ADR-0056`'s upper figure), with Security/NFR re-levelling `NFR-009` on his word first.

## Out of scope

- A UCI `Hash` option (today `setoption name Hash` writes nothing, `ABC-243`). Buckets. Replacement (`ABC-237`),
  retention (`ABC-257`), cutoffs (`ABC-238`).

## Acceptance criteria

- **A1 (size).** `tableByteLength()` reads 8 MiB (or the owner's level); search-held memory in total ≤ 16 MiB (or the
  re-levelled bound) by `NFR-009`'s instrument; growth ≤ 1 MiB between a 1 s search and one at `DEFAULT_BUDGET_MS`.
- **A2 (start-up).** Allocation stays outside the clock: `G5` per-move ceilings hold and the first `go` after
  `ucinewgame` is ≤ base + 5 ms in a lane row on the virtual clock (zero-fill cost is named at design).
- **A3 (gates).** `G1`, `G4` (a size door reproduces base node for node on the `ABC-078` `A3` corpus), `G6`, `G7`,
  `G8`, `G9`.
- **A4 (the reading).** *(2026-11-01, the owner's rule, `bapm-100-400-rule`; replaces the SPRT and the design-named control this row named.)* One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a time, through `ABC-255`. 100 of 100 games complete, the candidate makes 0 faults and loses 0 games on time at the 50 ms margin, and the score meets `ADR-0056` C2′ (merged `94f1504c`): ≥ 50.0 of 100 for a GAIN, ≥ 43.0 for a NEUTRAL, the intent declared at design. A miss is NOT MET and is not re-played. Reported: W/L/D, score, `cutechess-cli`'s Elo ± error. **Note for QE:** this read guards against breakage and cannot show a size gain: at 100 ms a search visits ≈ 47 k nodes (467 k nodes/s median × 0.1 s, `qe-tc-depth-probe` `…1889e3b0`; arithmetic), fewer than today's 262 144 entries. A read at a longer control is an other run, asked of the owner first if it is estimated over 1 h. *(2026-11-01, `bapm-owner-answers`, the owner's answer 3.)* **And the Stockfish smoke beside it:** 10 games, the candidate at 0.5 s a move against Stockfish 19 `UCI_LimitStrength`, one game at a time, through `ABC-255` (`EPIC-011` § The per-change rule): 10 of 10 complete, 0 faults, 0 losses on time, and the no-collapse bar the `ADR-0056` owner-answers fold names for 0.5 s (`UNKNOWN - verify` until it merges).

## NFR triggers

- **`NFR-009`:** A1, the point of the ticket. **`NFR-004`:** A2. **`NFR-005`:** `G6`. **Security:** none.

## Test notes

1. A1 and A2 are lane rows; the memory row runs under `--expose-gc` as `ABC-209`'s did.
2. UAT is owed (production lines). The QE verdict signs it.

## Size and priority

- **Size: S** (`ADR-0056`: XS; S here for the door and the memory rows). **Priority: P3.**

## Dependencies

- `ABC-257` merged or closed (same file; retention changes what a bigger table holds).
- **Owner:** Q-3K-6 only for scope item 2. Item 1 needs nothing from him.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ S |
| 4 | testable, measurable acceptance | ✅ 8 MiB; ≤ 16 MiB; growth ≤ 1 MiB; ≤ base + 5 ms |
| 5 | dependencies known | ✅ *(2026-11-01)* A4's control is the owner's 100 ms; a longer read is asked first |
| 6 | NFR triggers with targets | ✅ |
| 7 | test notes | ✅ |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ `ABC-257`; `EPIC-011` not started |

**DoR 9/10 (re-scored 2026-11-01: row 5). Backlog.**
