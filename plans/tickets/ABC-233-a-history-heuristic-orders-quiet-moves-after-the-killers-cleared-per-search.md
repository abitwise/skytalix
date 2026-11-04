---
id: ABC-233
title: "A history heuristic orders quiet moves after the killers, cleared per search, behind an off-door"
status: backlog
column: Backlog
size: M
priority: P3
epic: EPIC-011
adr: "ADR-0063 (PROPOSED 2026-11-02, arch-ABC-233 …f3a4dac0; PREREG …4d5a0fe3 committed ec2ed472 before any run): PREMISE NOT MET on main (F4, the pay gate A4 (a) missed); the build does not start; accept is not put to the owner. Ticket PARKED by the Orchestrator (board, 2026-11-02)"
---

# ABC-233: history heuristic for quiet moves

> **2026-11-04, by BA/PM (task `bapm-W1-bundle-cut`, records only): RE-OPENED BY THE OWNER'S WORD AS PART OF
> `ABC-283`.** The owner said *"merge ABC-233, ABC-234 and ABC-236 into one branch and do one test run"*
> (`orch-2026-10-30a` `…4c4cb03d` ruling 2). O1h is built exactly as `ADR-0063` states, on `grugops/ABC-283`, behind
> its own door plus one all-off door. Its F4 (the ≤ 0.95 × pay gate) no longer holds the build. **This page stays the
> design page.** The bars, the one read (100 games at 100 ms, GAIN ≥ 50.0, never re-played) and the disposition are on
> `ABC-283`. On a pass, `ADR-0063` is accepted with the other two as a bundle. On a miss, this ticket stays parked.
> Front matter is unchanged; DoR stays as below, because `ABC-283` carries the Ready state.

> **PARKED 2026-11-02 BY THE ORCHESTRATOR; `ADR-0063` PROPOSED, PREMISE NOT MET ON `main`; DoR 9/10, by BA/PM** (task
> `bapm-records-1102c`, records only, at `main` `a6039c5b`; nothing run). Sources: the Architect's `arch-ABC-233`
> decision `…f3a4dac0` (§ 3, the BA/PM list, worked item by item below), its results note `…9f0b5da7` and PREREG
> `…4d5a0fe3`; `ADR-0063` § Status; the Orchestrator's ruling *"ABC-233 parked"* (board, 2026-11-02, merge `a6039c5b`).
> - **The design is written: `ADR-0063`, PROPOSED.** A side × from × to `Int32Array(2 × 64 × 64)` (32 768 bytes),
>   +d² to the quiet cutter and −d² to each earlier quiet move, gravity bound 16 384, cleared per search, ordered after
>   the killers, in both recursions behind `searchWithoutHistory` / `chooseMoveWithoutHistory`.
> - **Its premise is not met on `main`** (`e72487e1`'s `src/`, futility in force). Five forms were probed. Every one
>   passes the safety gate (drift, mate floor, zugzwang 7 / 7, `G1`), and **every one misses the pay gate** (≤ 0.95× at
>   d8 on all four readings). The design of record reads **1.0011 / 0.7970 / 0.9751 / 0.9832**, reach +0.089 ply.
>   So `ADR-0063` F4 fired: no build, no read owed, and "accept ADR-0063" is not put to the owner. The audit (0.20 %
>   flips, max 40 cp, 0 of 100 cp or more) is information.
>   - **Why it pays little:** the killers hold 90 % of quiet cutoffs, and 82 % of cutoffs fall on the first move.
> - **Intent: NEUTRAL** by the rule (+0.089 < +0.10), so GAIN is closed to it. NEUTRAL's own measured bar is A4 (a),
>   the bar it misses.
> - **The Orchestrator's ruling: `ABC-233` is PARKED.** It stays in Backlog. It is not refined further, and it is
>   not Ready. Front matter keeps `status: backlog` (this repository's form for a parked ticket, as `ABC-237`).
> - **Row deltas made below, each dated:**
>   - **A3** (d7 ≤ 0.95×) is superseded by `ADR-0063` decision 9: d8, ≤ 0.95× on all four readings, both recursions.
>     For the record, the literal d7 `search()` reads 0.9497 / 0.8367 (met by 0.0003), and `chooseMove` 0.9769 /
>     0.9373 (missed).
>   - **A6's S′:** E 1 810, `--elo 1810` (`ADR-0056` S′ amendment of 2026-11-02).
>   - **`NFR-009`:** 32 KiB (32 768 bytes), not 16 KiB.
>   - **DoR row 10:** ❌ `ADR-0063` PROPOSED, premise not met on `main` (F4); the build does not start.
> - **What re-opens it** (`ADR-0063` § Status 1–3): the Orchestrator names a new premise, and a new pre-registered
>   probe meets the pay gate, or a joint P1 / P4 bar that probe's ADR writes. The premises on record: a P1 or P4
>   design that takes history as its input, measured jointly (`ADR-0063` decision 11; the Orchestrator's
>   `arch-next-pull` is ranking that probe); an ordering change that leaves more quiet cutoffs to history (O2c, V3);
>   or an instrument that reads depth-gated pay.
> - **On a re-open, this page takes the Architect's deltas** (`…f3a4dac0` § 3 item 3), none made now: A1 export counts
>   +3 / +1 with the door names; A2 = `ADR-0063` decision 7's four rows; A3 = 42 cp in both recursions, the same-depth
>   mate floor (d5 → d5, 0 / 189) and zugzwang 7 / 7; A4 (a) d8 ≤ 0.95× on four readings, (c) `G6`; A5 `G1` ≥ 54 / 58;
>   A6 intent NEUTRAL (≥ 43.0), S′ at E 1 810, the Levels deep lane; scope 1 reads "side × from × to".
> - **Phase order:** O1h is no longer a standalone first pull in `EPIC-011` Phase 3 (§ Phases). O2c, built on it, waits
>   with it.

> **RE-HOMED 2026-11-01 to `EPIC-011` by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`). The
> owner asked for a new epic for the 3 000 path, started after the open epics close, and for no work done twice
> (`orch-2026-10-30a` `…022fb66f`). `ADR-0056` D4 maps this ticket to its gap list, so it leaves `EPIC-010` rather
> than holding that epic's close. **Id unchanged; nothing below this block is edited.** `ADR-0056` row O1h. `EPIC-011`
> Phase 3, first. Countermove and continuation history (O2c) build on it and are a separate stub, out of this ticket's
> scope. Its reading is `EPIC-011` § The per-change rule (today `EPIC-010` § The merge rule, by reference; plus
> `ABC-255`'s SPRT if the owner says yes to Q-3K-2). Line cites in `src/` are re-read at refinement: milestone 1b
> (`ABC-251`) rewrites `orderMoves` first.

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 6,
> verified (SA `…306a4012` rows 6a, 6b, and the LMR constraint under 6c). Never tried. **Waits in Backlog on** an ADR
> and the owner's Q4. Milestone 2.

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only): the owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`). This ticket's reading is now the smoke pair before merge (`EPIC-010` § The
> merge rule), with a batched validation later. Q4 no longer holds it. **Next real wait:** the ADR. Milestone 2. DoR 8/10 → 9/10.

## Problem

- **User:** the owner at level 5.
- **Pain:** after the hash move, captures and two killers, quiet moves come in generation order
  (`src/search.ts:172-197`). Late-move reduction reduces by the move's index (`src/search.ts:276`), so a good quiet
  move late in generation order is searched shallower.
- **Value:** good quiet moves come earlier, so fewer are reduced and more cutoffs come sooner.

## Scope

1. A from-to (or piece-to) history table, raised on a quiet move's beta cutoff by a depth-scaled amount, read by
   `orderKey` after the killers.
2. **Cleared at the start of every search** (`ABC-080` `A6`: nothing learned in one search is offered in the next).
3. An `ADR-0026` d10 off-door pair: an order change changes values under LMR (SA 6c).

## Out of scope

- Counter-move and continuation history. History-based pruning. SEE (`ABC-234`).

## Acceptance criteria

- **A1 (the door).** Node-equal, cross-build, on the `ABC-078` `A3` corpus (`G4`).
- **A2 (it orders).** **Given** a test search on 6 fixed positions, **then** after the search the table is non-zero
  for ≥ 1 quiet move, and on a second search of the same position the table starts at zero.
- **A3 (it pays in nodes).** **Given** `kiwipete` and `position-6` at fixed depth 7, **then** nodes ≤ **0.95 ×** the
  door's on both (an ordering change that does not cut nodes is not worth its reading). *2026-11-02
  (`bapm-records-1102c`): **superseded by `ADR-0063` decision 9**: depth 8, ≤ 0.95× on each of four readings (`search()`
  and `chooseMove`, kiwipete and position-6). Missed on `main` (1.0011 / 0.7970 / 0.9751 / 0.9832); F4; parked.*
- **A4 (drift).** **Given** `ABC-121`'s 190 at depth 5, **then** ≥ 95 % of non-mate scores are within 25 cp of the
  door's (`ADR-0026` d9's figure; the ADR may set its own, reported to the owner).
- **A5 (gates).** `G1`, `G5`, `G6` "≥ base" (floor 6), `G7` (the table's bytes reported), `G8`, `G9`, `G10`.
- **A6 (the reading).** *(2026-11-01, the owner's rule, `bapm-100-400-rule`; replaces the smoke pair of `EPIC-010` § The merge rule.)* One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a time, through `ABC-255`. 100 of 100 games complete, the candidate makes 0 faults and loses 0 games on time at the 50 ms margin, and the score meets `ADR-0056` C2′ (merged `94f1504c`): ≥ 50.0 of 100 for a GAIN, ≥ 43.0 for a NEUTRAL, the intent declared at design. A miss is NOT MET and is not re-played. Reported: W/L/D, score, `cutechess-cli`'s Elo ± error, `G11`. *(2026-11-01, `bapm-owner-answers`, the owner's answer 3.)* **And the Stockfish smoke beside it:** 10 games, the candidate at 0.5 s a move against Stockfish 19 `UCI_LimitStrength`, one game at a time, through `ABC-255` (`EPIC-011` § The per-change rule): 10 of 10 complete, 0 faults, 0 losses on time, and S-4 at ~~E 1 650~~ *E 1 810 (2026-11-02, `bapm-records-1102c`; `ADR-0056` S′ amendment)*: ≥ 3.0 of 10, below that 10 more games and ≥ 7.0 of 20 (`ADR-0056` S′; `skytalix` `timemargin` 50 ms; ~~`r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`~~ `r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`) *(was the fold's bar, `UNKNOWN - verify`; merged `a0f9297e`, `bapm-reconcile-adr0056`)*. *(2026-11-01, `bapm-reconcile-adr0056`, `ADR-0056` R-TC part 2: the owner's "works on different difficulty settings".)* **And the Levels deep lane on the candidate head:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose`, QE, host alone, beside the 100-game read (≈ 9 min): exit 0 with every test passed (41 at `ADR-0056`'s count; QE counts its own run). A failure is a defect, back to the Software Engineer.

## NFR triggers

- **`NFR-009`:** ~~a 64 × 64 table of 32-bit counters is 16 KiB~~ *2026-11-02 (`bapm-records-1102c`, `ADR-0063` decision 1): a 2 × 64 × 64 table of 32-bit counters is **32 KiB** (32 768 bytes), fixed, summed by `historyByteLength()`*; `G7` reads it. **`NFR-005`:** A3, `G6`.
- **Security:** none.

## Test notes

1. UAT is owed. The QE verdict signs it.
2. *(2026-11-01, `bapm-qe-gaps-1101`, QE-249-a LOW, `qe-ABC-249` `…66371344`.)* **If this ticket re-pins
   `ABC-249`'s row** in `src/engine.test.ts` ("Qe5+ at ply 4 stood twice before the root …"), the with-keys move
   stays different from the withheld move, or the row gains the relational assert
   `expect(label(withKeys.move)).not.toBe(label(base.move))`. Equal figures mean the fixture is dead: re-run QE's
   `QPLY4` plant and rebuild the fixture before merge; never re-pin both to one value. *QE-249-b (INFO):* no
   default-lane row holds a pre-root draw scored exactly 0 below ply 1; if this ticket changes how such a draw is
   scored or stored, it adds one.

## Size and priority

- **Size: M.** A table, a hook at the cutoff, an order key, a door pair, an ADR. **Priority: P3.**

## Dependencies

- **Architect/Design:** an ADR naming the table, its update, its clearing, and the door (`ADR-0026` d10). Reported to
  the owner. **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`). Shares `orderMoves` with `ABC-234`: one at a time.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 6b, 6c |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ M; own reading |
| 4 | testable, measurable acceptance | ✅ every row measurable; A6 is the 100-game read at 100 ms (`EPIC-011` § The per-change rule; its pass line is `ADR-0056` C2′) *(2026-11-01)* *2026-11-01 (`bapm-owner-answers`): plus the 10-game Stockfish smoke at 0.5 s; its no-collapse bar is the owner-answers fold's, scored as the C2′ line was while pending (the ticket leaves Backlog only after that fold merges).* *2026-11-01 (`bapm-reconcile-adr0056`): the fold merged (`a0f9297e`); the bar is S′'s S-4 at ~~E 1 650~~ E 1 810 (2026-11-02, `bapm-records-1102c`), and the row adds the Levels deep lane (exit 0, every test passed). Score unchanged.* |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ ~~16 KiB~~ 32 KiB *(2026-11-02)*; nodes ≤ 0.95 × ~~at d7~~ at d8 on four readings *(`ADR-0063` d9)* |
| 7 | test notes | ✅ 1 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ ~~ADR~~ *2026-11-02 (`bapm-records-1102c`):* `ADR-0063` PROPOSED, premise not met on `main` (F4); the build does not start. **Parked** (the Orchestrator's ruling) |

**DoR 9/10 (re-scored 2026-10-29). Backlog.** *2026-11-02 (`bapm-records-1102c`): DoR 9/10 stands; row 10 now reads `ADR-0063`'s F4. **Backlog, parked.***
