---
id: ABC-256
title: "B0: a baseline reading of main on the routine milestone control, after EPIC-010 closes, so the 2 200 … 3 000 milestones have a starting point (reading only)"
status: backlog
column: Backlog
size: S
priority: P2
epic: EPIC-011
owner: QE/E2E
---

# ABC-256: the baseline reading (B0)

> **Dated line 2026-11-01 by BA/PM** (task `bapm-100-400-rule`, records only; nothing run). The owner's rule
> (`…2896c6eb`) puts a 400-game read at 100 ms at `EPIC-010`'s close, and its head half plays this ticket's build
> (`main` after milestone 1b) against Stockfish. **If the `ADR-0056` fold names 100 ms the milestone control, that
> head half is B0, and this ticket closes as merged into it, with no second run** (`EPIC-011` C13). If the fold names
> another control, this page stands, and B0 is asked of the owner first if it is estimated over 1 h (at R's pins it
> is ≈ 11–12 h). Scope 1's "through `ABC-255`'s control flag" now reads `ABC-255`'s 100 ms shapes (re-scoped).
> *Later the same day: the fold merged (`94f1504c`). It makes B0 a 200-game read of `main` at the C3′ control
> (`skytalix` 100 ms, Stockfish `st=0.1`), ≈ 0.5–0.8 h, and the base half of the first C3′ comparison. **C13's
> condition is met**: B0 is the head half of `EPIC-010`'s close read, and this ticket closes as merged when that read
> lands (the Orchestrator's card move). If the Orchestrator does not put the 400-game read at `EPIC-010`'s close, B0
> runs alone at the C3′ control (under 1 h, not asked).*

> **Cut 2026-11-01 by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`; nothing run). Source:
> `ADR-0056` D5 (milestones 2 200 … 3 000 are readings on a named scale and control) and the owner's word of
> 2026-11-01 (`…022fb66f`): the claim is read at 40/15, routine readings at shorter controls down to 0.5 s a move.
> `EPIC-011` Phase 0, pull 2.

## Problem

- **User:** the owner, who reads the milestones.
- **Pain:** the only outside number, ≈ 2 074 (head `51902be5`, 72.00 % ± 6.11 at 4 000 ms against E = 1 910 at
  `st=0.5`, `…1a53a7f9`), was read before milestone 1b. 1b is value-identical but faster, so at a fixed time that
  figure is stale. And the milestone readings may use another control (the Architect's fold).
- **Value:** one reading on the control the milestones will use, on the base every `EPIC-011` change is written on.

## Scope

1. One R reading (`skytalix` against Stockfish 19 `UCI_LimitStrength` at `UCI_Elo` E) of `main` after `EPIC-010`
   closes, on the routine milestone control the Architect's fold of `ADR-0056` names, through `ABC-255`'s control flag
   (or `rpair`/`r` as they are, if the control is R's pins).
2. 200 games (100 openings × both colours), width per the owner's Q-3K-3 (default 1). E chosen by `ABC-204`'s band
   rule so the score sits in 25–75 % (start at E = 2 100 *[BA/PM's starting guess, from ≈ 2 074 plus 1b's speed]*;
   one step allowed, E′ = E ± X, clamped 1 320–3 190).
3. Records: `## Reading` on this page, a dated line on `EPIC-011`, raw files under QE's task context.

## Out of scope

- A 40/15 reading (the claim control; `EPIC-011` keeps it for the claim and any milestone the Architect names).
- Any `src/`, `tools/` or `data/` change (the control flag is `ABC-255`'s).
- Grading anything: B0 is a starting point, not a gate.

## Acceptance criteria

- **A1 (validity).** 200 / 200 games complete; `skytalix` 0 faults, 0 losses on time; Stockfish's pick depth at E is
  reached on the control (the `ABC-204` guard, or the Architect's equivalent for the new control), else UNRESOLVED and
  re-read.
- **A2 (the figure).** Reported: W/L/D, score % ± its 95 % interval, `cutechess-cli`'s Elo difference ± error, and
  E + difference as the figure on "Stockfish 19's `UCI_Elo` scale at the routine control on this host" (named so,
  never compared with a list).
- **A3 (in band).** The score lies in 25–75 %; if not after one E step, the reading is reported with the note "out of
  band" and the Architect proposes the next E.
- **A4 (host).** Load and Tctl log per `ABC-225`; any contamination logged, never killed (QE-M1B2-c's rule).

## NFR triggers

- None in the engine. Host: ALONE.

## Test notes

1. QE's scratch clone; cost `UNKNOWN - verify` (it depends on the control; at R's pins it is ≈ 11–12 h ALONE for 200
   games, half of the 400-game batch's 21.7–24.1 h; an estimate).
2. No UAT (a reading).

## Size and priority

- **Size: S.** One reading. **Priority: P2.**

## Dependencies

- `EPIC-010` closed (its milestone 1b on `main`); `ABC-255` merged if the control is not R's pins; the Architect's fold
  (the control and Stockfish's side). **Owner:** Q-3K-3 (width) only.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ S |
| 4 | testable, measurable acceptance | ✅ 200 games, 0 faults, 0 time losses, in band 25–75 % |
| 5 | dependencies known | ⚠️ the control is the Architect's fold (in flight) |
| 6 | NFR triggers with targets | ✅ none |
| 7 | test notes | ✅ |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ waits `EPIC-010` closing |

**DoR 8/10. Backlog.**
