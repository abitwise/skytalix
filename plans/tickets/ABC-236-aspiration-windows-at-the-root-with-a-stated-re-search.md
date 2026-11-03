---
id: ABC-236
title: "Aspiration windows at the root from depth 5, with a stated widening re-search on a fail, behind an off-door"
status: backlog
column: Backlog
size: M
priority: P3
epic: EPIC-011
adr: "ADR-0066 (PROPOSED 2026-11-03, arch-ABC-236 …0886976b; PREREG …69cfcb4a committed d5d360e1 before any run): PREMISE NOT MET on main (F4, A100 chooseMove d8 0.9836 / 0.9913 > 0.95); the build does not start; accept is not put to the owner. Ticket PARKED by the Orchestrator 2026-11-03 (…38f865c3)"
---

# ABC-236: aspiration windows at the root

> **PARKED 2026-11-03 BY THE ORCHESTRATOR; `ADR-0066` PROPOSED, PREMISE NOT MET ON `main`; DoR 9/10, by BA/PM** (task
> `bapm-ABC-236-park`, records only, at `main` `06d4d0ee`; nothing run). Sources: the Architect's `arch-ABC-236`
> decision `…0886976b` (§ 7, the page lines, worked item by item below), its results note `…22d9d55f` and PREREG
> `…69cfcb4a`; `ADR-0066` § Status and decision 9; the Orchestrator's ruling `…38f865c3` (`orch-2026-10-30a`).
> - **The design is written: `ADR-0066`, PROPOSED.** Design of record A100: δ 100 cp from iteration 5, only the failed
>   side widens, doubling, full window past 400 cp, mate scores keep the full window, behind a test-only off-door.
> - **Its premise is not met on `main`** (src tree `58fa3eb4`, futility in force). Four forms were probed. Every one
>   passes the safety gate (zugzwang 7 / 7, `G1` 54 / 58, mate floor 0, drift within bars, `A2` exact on 1 / 1), and
>   **every one misses the pay gate** (`A3`, ≤ 0.95× `chooseMove` nodes at d8). A100 reads **0.9836 / 0.9913**
>   (kiwipete / position-6). That is F4: no build, no C2′ read owed, and "accept ADR-0066" is not put to the owner.
>   *(The merge message of `781c11a2` and the board line paired A100's kiwipete with A25's position-6, "0.9836/0.9619";
>   the design-of-record pair is 0.9836 / 0.9913, `…38f865c3`. Verdict unchanged.)*
>   - **Why it pays little:** the root already runs PVS, so a window narrows only the first move's subtree and the
>     root's re-searches; the ceiling is about 2 % (A100 0.9779 at d7 over the 190), from the structure, not from δ.
> - **The Orchestrator's ruling: `ABC-236` is PARKED.** It stays in Backlog. It is not refined further, and it is not
>   Ready. Front matter keeps `status: backlog` (this repository's form for a parked ticket, as `ABC-233`, `ABC-234`).
> - **Intent on any re-open: GAIN** (C2′ ≥ 50.0 of 100). S1 **fires at 100 ms**: 70.4 % of all nodes at 47 000 are
>   inside aspiration passes, on 186 of 190 rows (51.3 % at 20 000). NEUTRAL "invisible at 100 ms" is closed to this
>   ticket. `ADR-0056` C2′ is corrected to match (`arch-adr0056-fold-1103` `…df88abcf`). This answers `A5`.
> - **What re-opens it** (`ADR-0066` § Status 1–2), each a new named premise with a new pre-registered probe; named,
>   not expected:
>   1. **T1 lands** (bound-aware table cutoffs; the combined attempt `ABC-257`): the one mechanism that could raise the
>      ceiling, since narrower root windows would then turn into cutoffs from stored bounds. The instability coupling
>      (§ Dependencies, third bullet) returns with it.
>   2. **A deeper shipped search.** d9 is mixed (A100 0.9546 / 0.9962; A50 0.9448 / 0.9798). A control that completes
>      depth 10 or more could be re-read; none is planned, and a read over 1 h is the owner's to approve.
>   - **E1 is not a re-open condition** (it can move δ, not the ceiling). A re-open after E1 re-reads the swing
>     quantiles (p90 63–67 cp at iterations 5–6 on `main`) and re-derives δ.
> - **Row deltas made below, each dated:** § Problem (stale `src/engine.ts` line refs); `A2` (the fixture's source, a
>   re-open note; bar unchanged); `A3` (unchanged; `ADR-0066` keeps it); `A5` (firing rate answered, intent GAIN);
>   § Dependencies (the ADR is `ADR-0066`); DoR row 10; the DoR line.
> - **Effort if re-opened** (the Architect's estimate): S-M, about 0.5–1 Engineer day (`src/engine.ts` only), plus
>   about 1 h QE read, the C2′ read (~25 min), S′ and the Levels deep lane; sourcing `A2`'s positions is extra.

> **T1 DEPENDENCY LIFTED 2026-11-02 by BA/PM** (task `bapm-phase1-pause`, records only, at `main` `e8495fc5`; nothing
> run). `ABC-238` (T1) closed unmerged on `ADR-0058` F4 and the Phase 1 TT strand is paused (`arch-phase1-replan`
> `…64e95bfa`). **While T1 is not in force, this ticket no longer waits on it.** The fail-soft instability coupling
> (Dependencies, third bullet) returns with T1: if T1 lands later (the combined attempt, `ABC-257`), this ticket's ADR
> or a re-check names the fail-high-then-fail-low tolerance then. Row 10 keeps one hold: the new ADR. DoR stays 9/10.

> **RE-HOMED 2026-11-01 to `EPIC-011` by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`). The
> owner asked for a new epic for the 3 000 path, started after the open epics close, and for no work done twice
> (`orch-2026-10-30a` `…022fb66f`). `ADR-0056` D4 maps this ticket to its gap list, so it leaves `EPIC-010` rather
> than holding that epic's close. **Id unchanged; nothing below this block is edited.** `ADR-0056` row S1. `EPIC-011`
> Phase 3, last; ~~**it now also waits on `ABC-238`** (`ADR-0056` D2: S1 depends on T1).~~ *(2026-11-02: lifted, T1 not in force.)* Its reading is `EPIC-011` § The
> per-change rule.

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 9, the
> aspiration half (SA `…306a4012` row 9e). Never tried. `EPIC-008` § Out of scope listed aspiration windows; this is a
> new epic on the owner's ideas. **Waits in Backlog on** a new ADR and the owner's Q4. Milestone 2.

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only): the owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`). This ticket's reading is now the smoke pair before merge (`EPIC-010` § The
> merge rule), with a batched validation later. Q4 no longer holds it. **Next real wait:** a new ADR. Milestone 2. DoR 8/10 → 9/10.

## Problem

- **User:** the owner at level 5.
- **Pain:** each iteration searches the root with a full window (~~`src/engine.ts:436-458`; header `:79-80`~~
  `src/engine.ts` `runIteration`; header line `:105` *(re-pointed 2026-11-03, `bapm-ABC-236-park`, at `main`
  `06d4d0ee`)*, "aspiration windows … none requested"), so every iteration pays for bounds it rarely needs.
- **Value:** fewer nodes per iteration, so a deeper finished iteration in the same 3 s.

## Scope

1. From iteration depth 5, the root window is the previous score ± δ (δ named in the ADR); on a fail low or high, a
   re-search with the window widened by a stated rule, ending in the full window.
2. Mate scores and the first iterations keep the full window.
3. An `ADR-0026` d10 off-door pair (the root's value and move can change on a re-search).

## Out of scope

- Aspiration below the root. PVS changes (`ADR-0026` holds). Time management (`EPIC-009`).

## Acceptance criteria

- **A1 (the door).** Node-equal, cross-build, on the `ABC-078` `A3` corpus (`G4`).
- **A2 (re-search is correct).** **Given** 6 positions whose score jumps by ≥ 200 cp between depths 5 and 6, **then**
  the head's depth-6 score equals the door's depth-6 score exactly (a widening re-search finds the true value).
  *(2026-11-03, `bapm-ABC-236-park`, a re-open note; the bar is unchanged.)* The six positions **cannot be drawn from
  the committed corpora**: only 1 of 535 (the 190, `G1`'s 58, the mate corpus's 287) moves ≥ 200 cp from depth 5 to
  6 with no mate (`G1` "win material, seed 1811", 835 → 567; exact in every form, `ADR-0066` decision 9). On a
  re-open, BA/PM names the source before the build: self-play positions (`tools/rating`) at ≥ 200 cp, **or** the
  jump relaxed to > 100 cp (7 rows at d6 over the 190). Until a re-open chooses, the ≥ 200 cp bar stands.
- **A3 (it pays in nodes).** **Given** `kiwipete` and `position-6` at fixed depth 8, **then** total nodes over
  iterations 1–8 ≤ **0.95 ×** the door's on both. *(2026-11-03, `bapm-ABC-236-park`: unchanged; `ADR-0066` keeps it.
  It is the gate every probed form missed: A100 0.9836 / 0.9913.)*
- **A4 (gates).** `G1`, `G5`, `G6` "≥ base" (floor 6), `G8`, `G9`, `G10`.
- **A5 (the reading).** *(2026-11-01, the owner's rule, `bapm-100-400-rule`; replaces the smoke pair of `EPIC-010` § The merge rule.)* One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a time, through `ABC-255`. 100 of 100 games complete, the candidate makes 0 faults and loses 0 games on time at the 50 ms margin, and the score meets `ADR-0056` C2′ (merged `94f1504c`): ≥ 50.0 of 100 for a GAIN, ≥ 43.0 for a NEUTRAL, the intent declared at design. A miss is NOT MET and is not re-played. Reported: W/L/D, score, `cutechess-cli`'s Elo ± error, the re-search rate per move in the read, `G11`. ~~Aspiration starts at depth 5, so it is depth-gated (`ADR-0056` C2′): the design names its firing rate at 100 ms, and a read at a longer control is asked of the owner first.~~ *(2026-11-03, `bapm-ABC-236-park`: answered by `arch-ABC-236` `…0886976b` § 3. It **fires at 100 ms**: 70.4 % of all nodes at 47 000 inside aspiration passes, 186 of 190 rows; 51.3 % at 20 000. It is not depth-gated, so any re-open's intent is **GAIN** (≥ 50.0 of 100); NEUTRAL is closed. A read at a longer control belongs only to re-open condition 2, and is the owner's when over 1 h.)* *(2026-11-01, `bapm-owner-answers`, the owner's answer 3.)* **And the Stockfish smoke beside it:** 10 games, the candidate at 0.5 s a move against Stockfish 19 `UCI_LimitStrength`, one game at a time, through `ABC-255` (`EPIC-011` § The per-change rule): 10 of 10 complete, 0 faults, 0 losses on time, and S-4 at ~~E 1 650~~ *E 1 810 (2026-11-02, `bapm-records-1102c`; `ADR-0056` S′ amendment)*: ≥ 3.0 of 10, below that 10 more games and ≥ 7.0 of 20 (`ADR-0056` S′; `skytalix` `timemargin` 50 ms; ~~`r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`~~ `r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`) *(was the fold's bar, `UNKNOWN - verify`; merged `a0f9297e`, `bapm-reconcile-adr0056`)*. *(2026-11-01, `bapm-reconcile-adr0056`, `ADR-0056` R-TC part 2: the owner's "works on different difficulty settings".)* **And the Levels deep lane on the candidate head:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose`, QE, host alone, beside the 100-game read (≈ 9 min): exit 0 with every test passed (~~41 at `ADR-0056`'s count~~ *57 at `EPIC-010`'s close read, 577 s, `qe-EPIC-010-close` `…388b3044`*; QE counts its own run). A failure is a defect, back to the Software Engineer.

## NFR triggers

- **`NFR-005`:** A3, `G6`. **`NFR-004`:** a re-search near the deadline obeys the existing clock check; `G5` reads it.
- **Security:** none.

## Test notes

1. A2's positions committed as a fixture. UAT is owed. The QE verdict signs it.
2. *(2026-11-01, `bapm-qe-gaps-1101`, QE-249-a LOW, `qe-ABC-249` `…66371344`.)* **If this ticket re-pins
   `ABC-249`'s row** in `src/engine.test.ts` ("Qe5+ at ply 4 stood twice before the root …"), the with-keys move
   stays different from the withheld move, or the row gains the relational assert
   `expect(label(withKeys.move)).not.toBe(label(base.move))`. Equal figures mean the fixture is dead: re-run QE's
   `QPLY4` plant and rebuild the fixture before merge; never re-pin both to one value. *QE-249-b (INFO):* no
   default-lane row holds a pre-root draw scored exactly 0 below ply 1; if this ticket changes how such a draw is
   scored or stored, it adds one.

## Size and priority

- **Size: M.** **Priority: P3.**

## Dependencies

- **Architect/Design:** ~~a new ADR (δ, the widening rule, the door)~~ *`ADR-0066` (2026-11-03, `bapm-ABC-236-park`):
  PROPOSED, premise not met on `main`; parked; re-opens on T1 (`ABC-257`) or a deeper shipped search*. Reported to the owner. **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`).
- Shares `src/engine.ts` with `ABC-230`: one at a time.
- *(2026-11-01, `bapm-phase1-wording`, carried from `arch-epic011-phase1` `…1dcdd8c7`; named, not decided.)* **The
  instability coupling with `ABC-238`:** deeper cutoffs under fail-soft raise PVS search instability, so this ticket's
  ADR names how the widening re-search tolerates a fail high followed by a fail low on the same iteration.
  *(2026-11-02, `bapm-phase1-pause`: dormant while T1 is not in force; it returns with T1.)*

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 9e |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ M |
| 4 | testable, measurable acceptance | ✅ every row measurable; A5 is the 100-game read at 100 ms (`EPIC-011` § The per-change rule; its pass line is `ADR-0056` C2′) *(2026-11-01)* *2026-11-01 (`bapm-owner-answers`): plus the 10-game Stockfish smoke at 0.5 s; its no-collapse bar is the owner-answers fold's, scored as the C2′ line was while pending (the ticket leaves Backlog only after that fold merges).* *2026-11-01 (`bapm-reconcile-adr0056`): the fold merged (`a0f9297e`); the bar is S′'s S-4 at ~~E 1 650~~ E 1 810 (2026-11-02, `bapm-records-1102c`), and the row adds the Levels deep lane (exit 0, every test passed). Score unchanged.* |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ nodes ≤ 0.95 ×; `G5` |
| 7 | test notes | ✅ 1 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ~~❌ ADR~~ ❌ `ADR-0066`: premise not met on `main` *(2026-11-03, `bapm-ABC-236-park`)* |

**DoR 9/10 (re-scored 2026-10-29). Backlog.** *2026-11-03 (`bapm-ABC-236-park`): **PARKED** by the Orchestrator
(`…38f865c3`); DoR 9/10, row 10 `ADR-0066` F4. Backlog.*
