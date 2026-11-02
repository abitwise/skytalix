---
id: ABC-234
title: "SEE orders captures in the full-width search: losing captures go after the quiet moves; ordering only, no pruning"
status: backlog
column: Backlog
size: M
priority: P3
epic: EPIC-011
---

# ABC-234: SEE for capture ordering

> **RE-HOMED 2026-11-01 to `EPIC-011` by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`). The
> owner asked for a new epic for the 3 000 path, started after the open epics close, and for no work done twice
> (`orch-2026-10-30a` `…022fb66f`). `ADR-0056` D4 maps this ticket to its gap list, so it leaves `EPIC-010` rather
> than holding that epic's close. **Id unchanged; nothing below this block is edited.** `ADR-0056` row O3s. `EPIC-011`
> Phase 3, after `ABC-233`. Its `ADR-0024` d4 re-open evidence wait stands. SEE **pruning** (Q1) is a separate
> `EPIC-011` stub that needs this ticket; it stays out of this ticket's scope. Line cites are re-read at refinement
> (milestone 1b moves the capture path).

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 6, the
> SEE half (SA `…306a4012` row 6c). **SEE is fenced** by `ADR-0024` decision 4. Its own re-open condition: the
> SEE-lite column is the evidence that re-opens the fence **if** `ABC-084`'s puzzle count shows the engine losing
> material to a defended-square capture. **Waits in Backlog on** that evidence (or the Architect's reading of it), an
> ADR, and the owner's Q4. Milestone 2.

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only): the owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`). This ticket's reading is now the smoke pair before merge (`EPIC-010` § The
> merge rule), with a batched validation later. Q4 no longer holds it. **Next real wait:** `ADR-0024` d4's re-open evidence (A0), then an ADR. Milestone 2. DoR 7/10 → 8/10.

## Problem

- **User:** the owner at level 5.
- **Pain:** captures are ordered by MVV-LVA only (`src/search.ts:172-197`), so QxP into a defended pawn is tried before
  every quiet move, and under LMR the quiet moves behind it are reduced.
- **Value:** losing captures move back; good quiet moves move forward.

## Scope

1. A static exchange evaluator (`see(move) → cp`), pure, in its own module.
2. Full-width ordering only: captures with SEE < 0 go after the killers (or as the ADR rules). Quiescence ordering is
   unchanged.
3. An `ADR-0026` d10 off-door pair.

## Out of scope

- SEE pruning anywhere (§ B item 6: "a separate, riskier change"). SEE in quiescence. Delta pruning.

## Acceptance criteria

- **A0 (the fence).** Before design: Architect/Design reads `ABC-084`'s puzzle suite for losses to defended-square
  captures and rules whether `ADR-0024` d4's re-open condition is met. If not met, the ticket is closed unbuilt.
- **A1 (SEE).** **Given** ≥ 20 hand-checked exchange positions (x-rays included), **then** `see` equals the
  hand value on every one.
- **A2 (the door).** Node-equal, cross-build, on the `ABC-078` `A3` corpus (`G4`).
- **A3 (it pays in nodes).** **Given** `kiwipete` and `position-6` at fixed depth 7, **then** nodes ≤ **0.95 ×** the
  door's on both.
- **A4 (gates).** `G1`, `G5`, `G6` "≥ base" (floor 6), `G8`, `G9`, `G10`.
- **A5 (the reading).** *(2026-11-01, the owner's rule, `bapm-100-400-rule`; replaces the smoke pair of `EPIC-010` § The merge rule.)* One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a time, through `ABC-255`. 100 of 100 games complete, the candidate makes 0 faults and loses 0 games on time at the 50 ms margin, and the score meets `ADR-0056` C2′ (merged `94f1504c`): ≥ 50.0 of 100 for a GAIN, ≥ 43.0 for a NEUTRAL, the intent declared at design. A miss is NOT MET and is not re-played. Reported: W/L/D, score, `cutechess-cli`'s Elo ± error, `G11`. *(2026-11-01, `bapm-owner-answers`, the owner's answer 3.)* **And the Stockfish smoke beside it:** 10 games, the candidate at 0.5 s a move against Stockfish 19 `UCI_LimitStrength`, one game at a time, through `ABC-255` (`EPIC-011` § The per-change rule): 10 of 10 complete, 0 faults, 0 losses on time, and S-4 at ~~E 1 650~~ *E 1 810 (2026-11-02, `bapm-records-1102c`; `ADR-0056` S′ amendment)*: ≥ 3.0 of 10, below that 10 more games and ≥ 7.0 of 20 (`ADR-0056` S′; `skytalix` `timemargin` 50 ms; ~~`r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`~~ `r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`) *(was the fold's bar, `UNKNOWN - verify`; merged `a0f9297e`, `bapm-reconcile-adr0056`)*. *(2026-11-01, `bapm-reconcile-adr0056`, `ADR-0056` R-TC part 2: the owner's "works on different difficulty settings".)* **And the Levels deep lane on the candidate head:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose`, QE, host alone, beside the 100-game read (≈ 9 min): exit 0 with every test passed (41 at `ADR-0056`'s count; QE counts its own run). A failure is a defect, back to the Software Engineer.

## NFR triggers

- **`NFR-005`:** A3, `G6`. **Security:** none.

## Test notes

1. A1's positions are committed as a fixture. UAT is owed. The QE verdict signs it.

## Size and priority

- **Size: M.** A new pure module plus an order change and a door. **Priority: P3.**

## Dependencies

- `ADR-0024` d4's re-open evidence (A0); an ADR; **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`). After `ABC-233` (shared `orderMoves`).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 6c |
| 2 | scope and out-of-scope | ⚠ ordering only, but whether it is built at all rests on A0's fence reading |
| 3 | INVEST | ✅ M |
| 4 | testable, measurable acceptance | ✅ every row measurable; A5 is the 100-game read at 100 ms (`EPIC-011` § The per-change rule; its pass line is `ADR-0056` C2′) *(2026-11-01)* *2026-11-01 (`bapm-owner-answers`): plus the 10-game Stockfish smoke at 0.5 s; its no-collapse bar is the owner-answers fold's, scored as the C2′ line was while pending (the ticket leaves Backlog only after that fold merges).* *2026-11-01 (`bapm-reconcile-adr0056`): the fold merged (`a0f9297e`); the bar is S′'s S-4 at ~~E 1 650~~ E 1 810 (2026-11-02, `bapm-records-1102c`), and the row adds the Levels deep lane (exit 0, every test passed). Score unchanged.* |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ nodes ≤ 0.95 × |
| 7 | test notes | ✅ 1 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ the fence's evidence is unread; ADR |

**DoR 8/10 (re-scored 2026-10-29). Backlog.**
