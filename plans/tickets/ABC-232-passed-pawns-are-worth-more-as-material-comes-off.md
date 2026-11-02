---
id: ABC-232
title: "Passed pawns are worth more as material comes off, on ABC-231's phase"
status: done
column: Done
closed: "2026-11-02, merged into ABC-269 (E1; its phase scaling) and E4 (any passer term beyond it); not delivered on its own. ADR-0064 (PROPOSED, arch-E1 …d8150777) d3: the passed pawn's endgame half is 2 × today's bonus by rank. A1 → ABC-269 B1 (e) (≥ 1.5 × at phase ≤ 6; exact at phase 24; ≤ 1.25 × at phase ≥ 18; the within-5-cp clause is false by construction for an advanced passer); A2 → B1 (a); A3 → B6 (≤ 1.05 ×, the 1.03 × folds in); A4 → B4's gate line plus G7; A5 → B8 unchanged. King distance, free path, unstoppable, connected and backward pawns → E4 (stub). Front matter by bapm-E1-cut; the board move is the Orchestrator's. Was: backlog, DoR 9/10"
size: S
priority: P3
epic: EPIC-011
---

# ABC-232: passed pawns by phase

> **CLOSED 2026-11-02 AS MERGED INTO `ABC-269` (E1) AND E4 by BA/PM** (task `bapm-E1-cut`, records only, at `main`
> `2bef4d31`; nothing run). This is the RE-HOMED block's verdict carried out. Sources: `ADR-0064` (PROPOSED, `arch-E1`
> `…d8150777` § 4 item 1) and the Orchestrator's ruling *"next pull E1 (full taper, ABC-231/232 folded)"* (board,
> 2026-11-02).
> - **Into E1 (`ABC-269`): the phase scaling.** The passed pawn's endgame half is 2 × today's bonus by rank (0, 10, 20,
>   40, 70, 120, 200), `ADR-0064` d3, blended on E1's phase. The pawn memo stores the passed endgame part (d5).
> - **Row changes** (`ABC-269` § Acceptance criteria, "What changes from the folded pages"):
>   - A1's "≥ 1.5 × at phase ≤ 0.25" → B1 (e), ≥ 1.5 × at phase ≤ 6 of 24.
>   - A1's "within 5 cp of base at phase ≥ 0.75" → B1 (e), exact at phase 24 and ≤ 1.25 × at phase ≥ 18. The old clause
>     cannot hold for an advanced passer: a passer one step from promotion (100 cp) reads 125 at phase 18.
>   - A2 → B1 (a). A3's 1.03 × → B6, one `G2` row at ≤ 1.05 ×. A4 → B4 plus `G7`. A5 → B8.
> - **Into E4 (stub, `EPIC-011` Phase 4): every other passer term** (king distance, free path, unstoppable, connected,
>   backward). E4 gets its id at its refinement. Rook activity stays out (not cut).
> - Its wait on `ABC-231` is void: both are folded into one ticket.
> - Front matter: `status: done`, `column: Done`, `closed:` merged into `ABC-269` and E4. Nothing below this block is
>   edited.

> **RE-HOMED 2026-11-01 to `EPIC-011` by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`). The
> owner asked for a new epic for the 3 000 path, started after the open epics close, and for no work done twice
> (`orch-2026-10-30a` `…022fb66f`). `ADR-0056` D4 maps this ticket to its gap list, so it leaves `EPIC-010` rather
> than holding that epic's close. **Id unchanged; nothing below this block is edited.** `ADR-0056` rows E1 (phase
> scaling) and E4 (passer terms). **Verdict: merge into E1** (its phase scaling) **and E4** (any passer term beyond
> it) at `EPIC-011` Phase 4's refinement; closes as merged then. Its wait on `ABC-231` becomes a wait on E1.

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 5, the
> passed-pawn half (SA `…306a4012` row 5b). Rook activity by phase is not cut (scope). **Waits in Backlog on**
> `ABC-231` and the owner's Q4. Milestone 2.

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only): the owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`). This ticket's reading is now the smoke pair before merge (`EPIC-010` § The
> merge rule), with a batched validation later. Q4 no longer holds it. **Next real wait:** `ABC-231` merged (and its ADR ruling). Milestone 2. DoR 8/10 → 9/10.

## Problem

- **User:** the owner, in endgames.
- **Pain:** `PASSED_PAWN_BONUS` is by rank only (`src/evaluate.ts:187`); a passed pawn on the 6th is worth the same
  with all pieces on as in a pawn ending.
- **Value:** the engine pushes, and stops, passed pawns when it matters.

## Scope

1. The passed-pawn bonus = phase-blend of today's values (middlegame) and larger endgame values by a stated rule,
   using `ABC-231`'s phase.
2. The same off switch.

## Out of scope

- Rook activity, king-pawn distance terms, tuning.

## Acceptance criteria

- **A1 (the blend).** **Given** 6 positions with a passed pawn at ranks 4–7 and phase ≤ 0.25, **then** each bonus is
  ≥ 1.5 × base's; **given** the start position and 6 middlegames with phase ≥ 0.75, **then** within 5 cp of base.
- **A2 (relations).** `G3` mirror and purity.
- **A3 (cost).** `G2` ≤ base × 1.03.
- **A4 (gates).** `G1`, `G5`, `G6` (floor 6), `G8`, `G9`, `G10`.
- **A5 (the reading).** *(2026-11-01, the owner's rule, `bapm-100-400-rule`; replaces the smoke pair of `EPIC-010` § The merge rule.)* One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a time, through `ABC-255`. 100 of 100 games complete, the candidate makes 0 faults and loses 0 games on time at the 50 ms margin, and the score meets `ADR-0056` C2′ (merged `94f1504c`): ≥ 50.0 of 100 for a GAIN, ≥ 43.0 for a NEUTRAL, the intent declared at design. A miss is NOT MET and is not re-played. Reported: W/L/D, score, `cutechess-cli`'s Elo ± error, `G11`. *(2026-11-01, `bapm-owner-answers`, the owner's answer 3.)* **And the Stockfish smoke beside it:** 10 games, the candidate at 0.5 s a move against Stockfish 19 `UCI_LimitStrength`, one game at a time, through `ABC-255` (`EPIC-011` § The per-change rule): 10 of 10 complete, 0 faults, 0 losses on time, and S-4 at ~~E 1 650~~ *E 1 810 (2026-11-02, `bapm-records-1102c`; `ADR-0056` S′ amendment)*: ≥ 3.0 of 10, below that 10 more games and ≥ 7.0 of 20 (`ADR-0056` S′; `skytalix` `timemargin` 50 ms; ~~`r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`~~ `r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`) *(was the fold's bar, `UNKNOWN - verify`; merged `a0f9297e`, `bapm-reconcile-adr0056`)*. *(2026-11-01, `bapm-reconcile-adr0056`, `ADR-0056` R-TC part 2: the owner's "works on different difficulty settings".)* **And the Levels deep lane on the candidate head:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose`, QE, host alone, beside the 100-game read (≈ 9 min): exit 0 with every test passed (41 at `ADR-0056`'s count; QE counts its own run). A failure is a defect, back to the Software Engineer.

## NFR triggers

- **`NFR-005`:** `G6`. **`G2`:** A3. **Security:** none.

## Test notes

1. UAT is owed. The QE verdict signs it.

## Size and priority

- **Size: S.** **Priority: P3.**

## Dependencies

- `ABC-231` merged (its phase). Same ADR ruling as `ABC-231`. **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 5b |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ S; own reading |
| 4 | testable, measurable acceptance | ✅ every row measurable; A5 is the 100-game read at 100 ms (`EPIC-011` § The per-change rule; its pass line is `ADR-0056` C2′) *(2026-11-01)* *2026-11-01 (`bapm-owner-answers`): plus the 10-game Stockfish smoke at 0.5 s; its no-collapse bar is the owner-answers fold's, scored as the C2′ line was while pending (the ticket leaves Backlog only after that fold merges).* *2026-11-01 (`bapm-reconcile-adr0056`): the fold merged (`a0f9297e`); the bar is S′'s S-4 at ~~E 1 650~~ E 1 810 (2026-11-02, `bapm-records-1102c`), and the row adds the Levels deep lane (exit 0, every test passed). Score unchanged.* |
| 5 | dependencies known | ✅ `ABC-231` |
| 6 | NFR triggers with targets | ✅ `G2` ≤ 1.03 × |
| 7 | test notes | ✅ 1 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ `ABC-231` |

**DoR 9/10 (re-scored 2026-10-29). Backlog.**
