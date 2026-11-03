---
id: ABC-273
title: "R1: the first EPIC-011 milestone reading, on main after E1 merges and before the next evaluation change: 200 games at 100 ms a move against Stockfish 19 UCI_LimitStrength at the band-rule E, reported as X ± Y on that scale with the highest milestone met named (QE reading, records only; no code)"
status: backlog
column: Backlog
size: S
priority: P3
epic: EPIC-011
feature: —
adr: "ADR-0056 D5 / D6 item 7 (R milestone readings) and C4's 100 ms outside-reading shape. The control is owed: EPIC-011 records that the owner-answers fold names no R1–R3 control (UNKNOWN - verify); the Orchestrator or the Architect rules it before Ready"
---

# ABC-273: R1, the first milestone reading of the climb

> **`ABC-269` MERGED, 2026-11-03, by BA/PM** (task `bapm-269-done`, records only, at `main` `128e3c6c`; nothing run).
> `ABC-269` (E1) merged to local `main` at `54dee3f2` (QE PASS_WITH_GAPS `qe-ABC-269` `…eff2fe64`), so this page's wait
> on that merge is **met**. DoR stays 9/10: row 10 is the control ruling alone, which the Architect is writing
> (`arch-post-269` item 4: R1–R3's survival, the exact command with `CUTECHESS_CLI` and `STOCKFISH` set, `QE-269-j`, and
> whether its host time needs the owner's ask). **R1's window is open:** it reads `main` after `ABC-269` and before
> `ABC-239` merges. `ABC-274` changes no value, so it does not close the window (`EPIC-011` § Dependencies).

> **Cut 2026-11-03 by BA/PM: DoR 9/10, Backlog** (task `bapm-epic011-cut`, records only, at `main` `17725732`; nothing
> run). Source: `EPIC-011` § Phases (R1, *"read after E1"*, the Orchestrator's ruling of 2026-11-02: "R1 reading
> deferred to after E1 (saves host time)") and this task's gap analysis. **A reading, not a strength change:** it is
> ranked apart from the gain items.
> - It is the only planned outside reading with resolution before E2. Every routine read since `EPIC-010`'s close is
>   self-play except the 10-game S′ smoke, which sees only a collapse (`RISK-EPIC011-04`).
> - It gates nothing (`EPIC-011` § Phases: milestone readings "gate nothing").

## Problem

- **User:** the owner, who wants to see where the climb stands (`EPIC-011` G2, "the climb is visible").
- **Pain:** the last outside figure with resolution is ≈ 2 074 at 4 s a move against E 1 910 (`qe-EPIC-010-m1-batch-2`),
  read before `EPIC-010`'s milestone 1b, P3 and E1. Self-play gains may not transfer outside (`RISK-EPIC011-04`), and
  E2 (a tuner, which can overfit) is next in line.
- **Value:** one number on the claim's scale after E1, so that E2's and E3a's gains can be read against an outside
  baseline. No Elo by itself.

## Scope

1. **One reading, QE, host ALONE, outside `npm test`,** on `main` after `ABC-269` merges and **before** the next
   strength merge (`ABC-270`, `ABC-271`, `ABC-272` or `ABC-239`). If one merges first, R1 reads that `main` and names it.
2. **The shape** (C4's 100 ms outside reading, `ADR-0056` D5's dated blocks): 200 games, openings 1–100 with both
   colours, one game at a time, `skytalix` at 100 ms a move (level 5, `timemargin` 50 ms), against Stockfish 19
   `UCI_LimitStrength` at E by `ABC-204`'s band rule (E ≤ 2 600, Stockfish `st=0.1`), `Threads 1`. **The exact command
   is `UNKNOWN - verify`:** `ABC-255` gave `r` a `--budget-ms` control, and whether `r` (or `rpair`) sets Stockfish's
   `st` to 0.1 is the ruling owed (DoR row 10).
3. **The report:** W / D / L, score, Elo ± error against E, the point estimate X = E + Δ, the opening-cluster interval
   (as `qe-EPIC-010-close` reported it), `G11`, and the highest milestone of 2 200 … 3 000 (*[proposed]*) met by
   `ADR-0056` D5's claim rule (a 200-game reading at E = M scoring ≥ 50 %), or "none".

## Out of scope

- Any code. Any change to the harness (a harness gap found here is a new ticket).
- The 40/15 claim (G1), C4's anchors A0 / A1 (40/15, asked of the owner first), R2, R3.
- Pooling into S′ (different control).

## Acceptance criteria

- **R1-A1 (validity).** **Given** the reading, **then** 200 / 200 games complete, `skytalix` makes 0 faults
  (`EPIC-010` S-1's states) and loses 0 games on time at the 50 ms margin. A base fault or a Stockfish fault makes the
  reading UNRESOLVED (re-run once).
- **R1-A2 (the report).** **Then** QE's note carries every figure of scope 3 and the command line as run, with the
  `main` sha and the E used.
- **R1-A3 (cost).** The reading is ≈ 0.5–0.8 h (`ADR-0056` C4's estimate, not a reading). **If QE's estimate is over
  1 h, it is asked of the owner before it starts** (`EPIC-011` § The per-change rule, "any other validation run").
- **R1-A4 (the records).** `EPIC-011` § Phases' R1 row and G2 cite the figure (BA/PM, a records hop).

## NFR triggers

- None on the product. The reading runs outside `npm test` (`NFR-008` untouched); host ALONE; one core.

## Test notes

1. Reuse `ABC-204`'s pinned tools (`cutechess-cli` 1.5.1, Stockfish 19) and `ABC-255`'s harness; paths out of the
   records (`ADR-0049` d4).
2. No UAT (a reading, no production change).

## Size and priority

- **Size: S** (one QE reading, one records hop).
- **Priority: P3.** Its window is between E1's merge and the next evaluation merge; the Orchestrator places it.

## Dependencies

- **`ABC-269` merged.** Hard. *Met 2026-11-03: merged to local `main` at `54dee3f2` (`bapm-269-done`).*
- **The control ruling** (the Orchestrator or the Architect): that R1 survives the owner-answers fold in C4's 100 ms
  shape, and the exact `r` / `rpair` command (Stockfish `st=0.1` or the 0.5 s S′ control).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ G2; the last outside figure predates P3 and E1; `RISK-EPIC011-04` |
| 2 | scope and out-of-scope | ✅ one reading; no code |
| 3 | INVEST | ✅ S |
| 4 | testable, measurable acceptance | ✅ 200 / 200, 0 faults, 0 time losses; every scope-3 figure reported; ≤ 1 h or asked |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ none on the product |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ the control ruling (R1–R3's survival and the exact command) |

**DoR 9/10. Backlog.**
