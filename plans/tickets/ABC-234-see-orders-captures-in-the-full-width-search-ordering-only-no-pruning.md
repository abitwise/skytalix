---
id: ABC-234
title: "SEE orders captures in the full-width search: losing captures go after the quiet moves; ordering only, no pruning"
status: backlog
column: Backlog
size: M
priority: P3
epic: EPIC-011
adr: "ADR-0065 (PROPOSED 2026-11-03, arch-ABC-234 …a4ed96aa; PREREG …9ac61a7a committed 9ca30923 before any run): PREMISE NOT MET on main (F4, S1m chooseMove d8 0.9864 / 0.9548 > 0.95); the build does not start; accept is not put to the owner. Ticket PARKED by the Orchestrator (board, 2026-11-03)"
---

# ABC-234: SEE for capture ordering

> **PARKED 2026-11-03 BY THE ORCHESTRATOR; `ADR-0065` PROPOSED, PREMISE NOT MET ON `main`; A0 RULED; DoR 9/10, by
> BA/PM** (task `bapm-ABC-234-park`, records only, at `main` `32b807c7`; nothing run). Sources: the Architect's
> `arch-ABC-234` decision `…a4ed96aa` (§ 5, the page lines, worked item by item below), its results note `…ffe76d35`
> and PREREG `…9ac61a7a`; `ADR-0065` § Status and decisions 1, 2, 8, 10, 11; the Orchestrator's ruling *"ABC-234
> PARKED"* (board, 2026-11-03, `main` `32b807c7`).
> - **The design is written: `ADR-0065`, PROPOSED.** S1m: a capture is losing at `see < −50`; losing captures sort
>   after the killers, ordering only, quiescence unchanged, in a pure `src/see.ts`, behind switch `seeOrdering` and the
>   doors `searchWithoutSeeOrdering` / `chooseMoveWithoutSeeOrdering`.
> - **Its premise is not met on `main`** (src tree `58fa3eb4`, futility in force). Three forms were probed. Every one
>   passes the safety gate (drift, mate floor 0, zugzwang 7 / 7, `G1` 54 / 58), and **every one misses the pay gate**
>   (≤ 0.95× at d8 on all four readings). The design of record reads `search()` 0.9011 / 0.9428 and `chooseMove`
>   **0.9864 / 0.9548** (kiwipete / position-6). That is F4: no build, no C2′ read owed, and "accept ADR-0065" is not
>   put to the owner.
>   - **Why it pays little:** in the shipped path (`chooseMove`), iterative deepening already gives most cut nodes a
>     hash move (`ADR-0065` § Status).
> - **A0 answered by `ADR-0065` decision 1.** Read: `G1` 54 / 58, the four misses are mate-in-3 headroom rows, and all
>   24 `do-not-hang` (defended-square capture) rows are solved, so `ADR-0024` d4's re-open condition is **not met as
>   worded**. Ruled: d4 fences SEE **pruning** in quiescence (Q1), not ordering in the full-width search. So A0 does
>   not close this ticket unbuilt; the measured premise decides it, and it is not met.
> - **The Orchestrator's ruling: `ABC-234` is PARKED.** It stays in Backlog. It is not refined further, and it is not
>   Ready. Front matter keeps `status: backlog` (this repository's form for a parked ticket, as `ABC-233`).
> - **Intent on any re-open: GAIN** (`ADR-0065` decision 11). The rule gives NEUTRAL (+0.068 ply < +0.10), but C2′ does
>   not admit NEUTRAL for O3s, which fires at 100 ms. A5's "intent declared at design" is so declared.
> - **What re-opens it** (`ADR-0065` § Status 1–3), each a new named premise with a new pre-registered probe:
>   1. **Q1 built first** (SEE pruning of losing captures in quiescence, out of check), carrying `see` and its `A1`
>      fixture, with O3s re-measured over Q1 as its door. Named, not expected: the one diagnostic reading of S1m over
>      Q1 still misses in `chooseMove` (0.961 / 1.095).
>   2. **Staged move generation (V3).**
>   3. **A time-per-move instrument,** by the owner's ruling that node counts under-read an ordering change. None
>      exists today.
> - **The RE-HOMED block's "Q1 … needs this ticket" no longer holds:** Q1 carries `see` itself (`ADR-0065` decision 2;
>   `EPIC-011` § Phases, row Q1). Q1 stays out of this ticket's scope.
> - **Row deltas made below, each dated:** A0 (answered); A3 (re-pinned, on re-open only); A1 (fixture start, on
>   re-open only); A5 (intent GAIN); § Dependencies; DoR rows 2 and 10; the DoR line.
> - **Effort if re-opened** (the Architect's estimate): M, about 1–1.5 Engineer days; QE's read about 1 h.

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
  *2026-11-03 (`bapm-ABC-234-park`): **answered by `ADR-0065` decision 1.** Not met as worded (`G1` 54 / 58; all 24
  `do-not-hang` rows solved), and d4 governs Q1 (SEE pruning in quiescence), not this ticket's ordering. So "closed
  unbuilt" does not follow from A0; the measured premise (A3) decides, and it is not met (parked).*
- **A1 (SEE).** **Given** ≥ 20 hand-checked exchange positions (x-rays included), **then** `see` equals the
  hand value on every one. *2026-11-03 (`bapm-ABC-234-park`), on re-open only: the fixture starts from `ADR-0065`
  decision 8's rows (the probe's six hand rows, row 4 = 0, and the 24 `HANGING_CORPUS` losing moves).*
- **A2 (the door).** Node-equal, cross-build, on the `ABC-078` `A3` corpus (`G4`).
- **A3 (it pays in nodes).** **Given** `kiwipete` and `position-6` at fixed depth 7, **then** nodes ≤ **0.95 ×** the
  door's on both. *2026-11-03 (`bapm-ABC-234-park`), on re-open only: re-pinned by `ADR-0065` decision 10 (a) to
  depth 8, both recursions, ≤ 0.95× on each of four readings (`search()` and `chooseMove`, kiwipete and position-6).
  Measured on `main`: missed on two of four (`chooseMove` 0.9864 / 0.9548), F4. The literal d7 pair (`search()`
  0.8463 / 0.7671) would pass; the d8 four-reading gate stands.*
- **A4 (gates).** `G1`, `G5`, `G6` "≥ base" (floor 6), `G8`, `G9`, `G10`.
- **A5 (the reading).** *(2026-11-01, the owner's rule, `bapm-100-400-rule`; replaces the smoke pair of `EPIC-010` § The merge rule.)* One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a time, through `ABC-255`. 100 of 100 games complete, the candidate makes 0 faults and loses 0 games on time at the 50 ms margin, and the score meets `ADR-0056` C2′ (merged `94f1504c`): ≥ 50.0 of 100 for a GAIN, ≥ 43.0 for a NEUTRAL, the intent declared at design *(2026-11-03, `bapm-ABC-234-park`: **GAIN** on any re-open, `ADR-0065` decision 11; NEUTRAL is closed to O3s, which fires at 100 ms)*. A miss is NOT MET and is not re-played. Reported: W/L/D, score, `cutechess-cli`'s Elo ± error, `G11`. *(2026-11-01, `bapm-owner-answers`, the owner's answer 3.)* **And the Stockfish smoke beside it:** 10 games, the candidate at 0.5 s a move against Stockfish 19 `UCI_LimitStrength`, one game at a time, through `ABC-255` (`EPIC-011` § The per-change rule): 10 of 10 complete, 0 faults, 0 losses on time, and S-4 at ~~E 1 650~~ *E 1 810 (2026-11-02, `bapm-records-1102c`; `ADR-0056` S′ amendment)*: ≥ 3.0 of 10, below that 10 more games and ≥ 7.0 of 20 (`ADR-0056` S′; `skytalix` `timemargin` 50 ms; ~~`r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`~~ `r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`) *(was the fold's bar, `UNKNOWN - verify`; merged `a0f9297e`, `bapm-reconcile-adr0056`)*. *(2026-11-01, `bapm-reconcile-adr0056`, `ADR-0056` R-TC part 2: the owner's "works on different difficulty settings".)* **And the Levels deep lane on the candidate head:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose`, QE, host alone, beside the 100-game read (≈ 9 min): exit 0 with every test passed (41 at `ADR-0056`'s count; QE counts its own run). A failure is a defect, back to the Software Engineer.

## NFR triggers

- **`NFR-005`:** A3, `G6`. **Security:** none.

## Test notes

1. A1's positions are committed as a fixture. UAT is owed. The QE verdict signs it.

## Size and priority

- **Size: M.** A new pure module plus an order change and a door. **Priority: P3.**

## Dependencies

- `ADR-0024` d4's re-open evidence (A0); an ADR; **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`). After `ABC-233` (shared `orderMoves`).
- *2026-11-03 (`bapm-ABC-234-park`):* ~~`ADR-0024` d4's re-open evidence (A0); an ADR~~ A0 ruled and the ADR written
  (`ADR-0065`, PROPOSED, premise not met on `main`). **Parked.** A re-open waits on one of `ADR-0065` § Status's three
  premises (Q1 built first; staged move generation, V3; a time-per-move instrument by the owner's ruling) and a new
  PREREG. `ABC-233` (also parked) shares `orderKey`: one at a time if both are ever built.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 6c |
| 2 | scope and out-of-scope | ~~⚠ ordering only, but whether it is built at all rests on A0's fence reading~~ ✅ *2026-11-03 (`bapm-ABC-234-park`): A0 ruled by `ADR-0065` decision 1 (d4 governs Q1, not this ordering); ordering only* |
| 3 | INVEST | ✅ M |
| 4 | testable, measurable acceptance | ✅ every row measurable; A5 is the 100-game read at 100 ms (`EPIC-011` § The per-change rule; its pass line is `ADR-0056` C2′) *(2026-11-01)* *2026-11-01 (`bapm-owner-answers`): plus the 10-game Stockfish smoke at 0.5 s; its no-collapse bar is the owner-answers fold's, scored as the C2′ line was while pending (the ticket leaves Backlog only after that fold merges).* *2026-11-01 (`bapm-reconcile-adr0056`): the fold merged (`a0f9297e`); the bar is S′'s S-4 at ~~E 1 650~~ E 1 810 (2026-11-02, `bapm-records-1102c`), and the row adds the Levels deep lane (exit 0, every test passed). Score unchanged.* |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ nodes ≤ 0.95 × |
| 7 | test notes | ✅ 1 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ ~~the fence's evidence is unread; ADR~~ *2026-11-03 (`bapm-ABC-234-park`):* `ADR-0065`: premise not met on `main` (F4); the build does not start. **Parked** (the Orchestrator's ruling) |

**DoR 8/10 (re-scored 2026-10-29). Backlog.** *2026-11-03 (`bapm-ABC-234-park`): DoR 9/10 (row 2 ✅); row 10 reads `ADR-0065`'s F4. **Backlog, parked.***
