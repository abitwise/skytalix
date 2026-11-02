---
id: ABC-238
title: "A deeper stored entry may cut off a shallower search, revising ABC-081 A1, behind an off-door"
status: dropped
column: Done
closed: "2026-11-02, closed unmerged on ADR-0058 F4 (A4 nodes 0.9939x / 0.9958x at depth 8 vs <= 0.95x; se-ABC-238 db17e44b; ruling arch-phase1-replan 64e95bfa); code kept as reference on grugops/ABC-238 3abaefdd; front matter by bapm-phase1-pause, the board move is the Orchestrator's"
size: M
priority: P2
epic: EPIC-011
---

# ABC-238: deeper-entry TT cutoffs

> **CLOSED UNMERGED ON F4, 2026-11-02, by BA/PM** (task `bapm-phase1-pause`, records only, at `main` `e8495fc5`;
> nothing run). **Not delivered.** The build was complete and every other row was met, but **A4 missed**: at fixed
> depth 8, `search()` read **0.9939×** (kiwipete, 1 109 987 / 1 116 785) and **0.9958×** (position-6, 1 595 656 /
> 1 602 457) of the door, against ≤ 0.95× on both (`se-ABC-238` failed-attempt `…db17e44b`). `chooseMove` frozen to
> depth 8 read 0.9587× / 0.9986×, also a miss. Deeper entries settle only **0.212 %** (`search()`) and **0.176 %**
> (`chooseMove`) of probes at depth 6 on the 190. That is `ADR-0058` **F4**: not merged; the ADR reads "accepted, not in
> force" once the owner accepts it (his call; the Architect recommends it, `arch-phase1-replan` `…64e95bfa`).
> - **F4 is not loosened** (the ruling, item 1). The 100-game read, the smoke and the Levels lane were never run.
> - **Why** (`…64bcf436`, measured): each source searches the shallow copy first, so a deeper entry for the same key is
>   rarely in the table; eviction is not the cause. Adding T2 does not change it (`…c0e9f5a0`).
> - **The code stays as the reference:** `grugops/ABC-238` `3abaefdd`, branch kept, not merged. A combined T1 + T3
>   attempt carries this ticket's rule and doors under `ABC-257` (re-scoped and paused on its page).
> - **`ABC-081` `A1`** gains a dated "not in force" line (its page). `ABC-237`'s and `ABC-236`'s waits on this ticket
>   are lifted on their pages.
> - Front matter: `status: dropped`, `column: Done`, as this repository closes a ticket not delivered (`ABC-209`,
>   `ABC-250`, `ABC-256`). The board card's move is the Orchestrator's. **Nothing below this block is edited.**

> **REFINED 2026-11-01 by BA/PM: DoR 10/10, READY** (task `bapm-phase1-wording`, records only, at `main` `b19af469`;
> nothing run). The design is written: `ADR-0058`, PROPOSED (`arch-epic011-phase1` `…2c2c1df6`, `…1dcdd8c7`).
> **Reading (b)** (the `ABC-208` / `ABC-209` precedent): the build and its gates may start now; **the read (A6) and
> the merge wait on the owner's acceptance of `ADR-0058`.** With no answer, `tableCutoff` stays exact-depth and this
> ticket does not merge. Priority is P2 throughout. The acceptance below is aligned to `ADR-0058` (doors d3/d4, rows
> d5, oracle d6, read d9, falsifiers F1–F6), with dated marks. The board move past `Ready` is the Orchestrator's.

> **RE-HOMED 2026-11-01 to `EPIC-011` by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`). The
> owner asked for a new epic for the 3 000 path, started after the open epics close, and for no work done twice
> (`orch-2026-10-30a` `…022fb66f`). `ADR-0056` D4 maps this ticket to its gap list, so it leaves `EPIC-010` rather
> than holding that epic's close. **Id unchanged; nothing below this block is edited.** `ADR-0056` row T1, "the
> cheapest real gap in the search". `EPIC-011` Phase 1, **first. Priority P3 → P2.** **The wait "`ABC-237` merged or
> closed first" is removed:** `ADR-0056` D6 orders T1 → T2, and `ABC-237` now follows this ticket on the shared file.
> ~~The ADR revising `ABC-081` `A1` is still owed.~~ *(written: `ADR-0058`, PROPOSED, 2026-11-01)* Its reading is `EPIC-011` § The per-change rule. Line cites are
> re-read at refinement ~~(`ABC-253` changes the TT keys first)~~ *(stale: `ABC-253` was dropped, "nothing to cut", `…27ddb1fb`; the keys stay `bigint`)*.

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 9 (SA
> `…306a4012` row 9c). **This revises a rule:** `ABC-081` `A1`, "the table changes the work, never the value". Using a
> deeper entry changes values. **Waits in Backlog on** the rule's revision (an ADR), the owner's Q4, and `ABC-237`.
> Milestone 2.

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only): the owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`). This ticket's reading is now the smoke pair before merge (`EPIC-010` § The
> merge rule), with a batched validation later. Q4 no longer holds it. **Next real wait:** the ADR revising `ABC-081` `A1`, then `ABC-237` merged. Milestone 2. DoR 8/10 → 9/10.

## Problem

- **User:** the owner at level 5.
- **Pain:** `tableCutoff` uses an entry only at exactly the stored depth (~~`src/transposition.ts:149-162`~~ *`:156-170`, the predicate at `:163`, re-read 2026-11-01 at `b19af469`*,
  `entryDepth(slot) !== depth`), so a depth-8 result cannot answer a depth-5 question.
- **Value:** more cutoffs from work already done.

## Scope

1. `tableCutoff` accepts a stored depth ≥ the requested depth, with the bound rules unchanged.
2. An `ADR-0026` d10 off-door pair, and the `ABC-081` `A1` revision recorded in the ADR *(2026-11-01: `ADR-0058` d3, d8)*.

## Out of scope

- Replacement (`ABC-237`). Retention (`ABC-209`). Size.

## Acceptance criteria

- **A1 (the door).** Node-equal, cross-build, on the `ABC-078` `A3` corpus (`G4`). *(2026-11-01, `ADR-0058` d2–d4.)*
  Two test-only doors, `searchWithoutDeeperCutoffs(position, depth)` and `chooseMoveWithoutDeeperCutoffs(position,
  options)` (names the Engineer's), each node for node the pre-ticket `search()` / `chooseMove`; one switch in both
  recursions, passed to `tableCutoff` as an argument. Every older door turns it off, so `ABC-081` `A1`, `ABC-077` `A1`
  and `ABC-078` `A3` read as today; the `ABC-077` `A6` and `ABC-078` `A4` export lists grow by exactly two names.
- **A2 (the rule).** **Given** a stored exact entry at depth 8, **when** a depth-5 probe hits it, **then** it cuts off
  with the stored score; the door does not. *(2026-11-01, `ADR-0058` d1, d6.)* Plus one row per bound against each
  side of the window, switch on and off: a deeper lower bound cuts only when its score ≥ beta, a deeper upper bound
  only when ≤ alpha, and a shallower entry of any bound never cuts. The root never cuts (it returns a legal move).
- **A3 (drift).** **Given** `ABC-121`'s 190 at depth 5, **then** ≥ 95 % of non-mate scores are within 25 cp of the
  door's, and 0 mate scores change sign. *(2026-11-01, `ADR-0058` d6.)* **In both recursions:** `search()` against
  `searchWithoutDeeperCutoffs` at fixed depth 5, and `chooseMove` against `chooseMoveWithoutDeeperCutoffs` iterated to
  depth 5 on a clock that does not expire. The largest drift is reported, not barred. **And a sign floor on the 287
  mate corpus** (`src/search.mate-corpus.ts`) at depth 5, `SEARCH_DEEP=1`: every position the door scores as a mate
  the head scores as a mate of the same sign (distance reported, not barred).
- **A4 (it pays).** At fixed depth 8 on `kiwipete` and `position-6`, nodes ≤ **0.95 ×** the door's on both; `G6`
  "≥ base" by its rule (floor 6). *(2026-11-01: a miss is `ADR-0058` F4: not merged, the ADR "accepted, not in force".)*
- **A5 (gates).** `G1`, `G5`, `G7`, `G8`, `G9`, `G10`.
- **A6 (the reading).** *(2026-11-01, the owner's rule, `bapm-100-400-rule`; replaces the smoke pair of `EPIC-010` § The merge rule.)* One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a time, through `ABC-255`. 100 of 100 games complete, the candidate makes 0 faults and loses 0 games on time at the 50 ms margin, and the score meets `ADR-0056` C2′ (merged `94f1504c`): ≥ 50.0 of 100 for a GAIN, ≥ 43.0 for a NEUTRAL, the intent declared at design. A miss is NOT MET and is not re-played. Reported: W/L/D, score, `cutechess-cli`'s Elo ± error, `G11`. *(2026-11-01, `bapm-owner-answers`, the owner's answer 3.)* **And the Stockfish smoke beside it:** 10 games, the candidate at 0.5 s a move against Stockfish 19 `UCI_LimitStrength`, one game at a time, through `ABC-255` (`EPIC-011` § The per-change rule): 10 of 10 complete, 0 faults, 0 losses on time, and S-4 at E 1 650: ≥ 3.0 of 10, below that 10 more games and ≥ 7.0 of 20 (`ADR-0056` S′; `skytalix` `timemargin` 50 ms; `r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`) *(was the fold's bar, `UNKNOWN - verify`; merged `a0f9297e`, `bapm-reconcile-adr0056`)*. *(2026-11-01, `bapm-reconcile-adr0056`, `ADR-0056` R-TC part 2: the owner's "works on different difficulty settings".)* **And the Levels deep lane on the candidate head:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose`, QE, host alone, beside the 100-game read (≈ 9 min): exit 0 with every test passed (~~41 at `ADR-0056`'s count~~ *57 at `EPIC-010`'s close read, 577 s, `qe-EPIC-010-close` `…388b3044`*; QE counts its own run). A failure is a defect, back to the Software Engineer. *(2026-11-01, `ADR-0058` d9.)* **Intent: GAIN** (bar ≥ 50.0 of 100). The read and the merge wait on the owner's acceptance of `ADR-0058`. T1 is not depth-gated, so the read is not depth-limited by rule; the build reports the share of probes at depth 6 on `ABC-121`'s 190 that a deeper entry settles, and **if that share is under 1 in 100, QE reports the read with that limit stated** (a report, not a bar).
- **Falsifier dispositions** *(2026-11-01, `ADR-0058` § What would falsify this)*: A1 red (F6), A2 or A3 red (F1, F2), or a
  repetition row red on the shipped path that no recorded re-pin explains, or the probe moved above a repetition
  check (F3) — a defect, back to the Software Engineer. A4 missed (F4) or A6 NOT MET or an S′ collapse (F5) — not
  merged; `ADR-0058` reads "accepted, not in force".

## NFR triggers

- **`NFR-005`:** A4. **Security:** none.

## Test notes

1. UAT is owed. The QE verdict signs it.
2. *(2026-11-01, `bapm-qe-gaps-1101`, QE-249-a LOW, `qe-ABC-249` `…66371344`.)* **If this ticket re-pins
   `ABC-249`'s row** in `src/engine.test.ts` ("Qe5+ at ply 4 stood twice before the root …"), the with-keys move
   stays different from the withheld move, or the row gains the relational assert
   `expect(label(withKeys.move)).not.toBe(label(base.move))`. Equal figures mean the fixture is dead: re-run QE's
   `QPLY4` plant and rebuild the fixture before merge; never re-pin both to one value. *QE-249-b (INFO):* no
   default-lane row holds a pre-root draw scored exactly 0 below ply 1; if this ticket changes how such a draw is
   scored or stored, it adds one.
3. *(2026-11-01, `ADR-0058` d5, d9.)* Rows whose shipped side is `search()` / `chooseMove` and whose other side is an
   older door re-point to the new door of the same recursion; shipped-path rows that move are re-pinned with old and
   new figures. **The PR lists every re-pointed and re-pinned row.** The A6 firing share is a test-side count through
   the call-through `vi.mock` of `src/transposition.ts` that `hitRate` uses, not a production counter.

## Size and priority

- **Size: M.** One predicate, but it revises an oracle rule (`ABC-081` `A1`) that many tests rest on. **Priority: ~~P3~~ P2** *(2026-11-01, `EPIC-011` Phase 1 first)*.

## Dependencies

- **Architect/Design:** an ADR that revises `ABC-081` `A1` ~~and amends `ADR-0025`~~. Reported to the owner. *(2026-11-01: `ADR-0058` alone, PROPOSED; it amends no ADR. `ADR-0025`'s T2 amendment is `ABC-237`'s.)*
- **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`). ~~`ABC-237` merged or closed first.~~ *(removed 2026-11-01 by the re-home: `ABC-237` follows this ticket.)* *(2026-11-01:)* acceptance of `ADR-0058` before the read and the merge (reading (b)); not before the build.
- *(2026-11-01, couplings named in `…1dcdd8c7`, not decided here:)* `ABC-237` follows on `src/transposition.ts`; `ABC-257` and `ABC-236` carry re-checks this rule creates (their pages).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 9c |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ M |
| 4 | testable, measurable acceptance | ✅ every row measurable; A6 is the 100-game read at 100 ms (`EPIC-011` § The per-change rule; its pass line is `ADR-0056` C2′) *(2026-11-01)* *2026-11-01 (`bapm-owner-answers`): plus the 10-game Stockfish smoke at 0.5 s; its no-collapse bar is the owner-answers fold's, scored as the C2′ line was while pending (the ticket leaves Backlog only after that fold merges).* *2026-11-01 (`bapm-reconcile-adr0056`): the fold merged (`a0f9297e`); the bar is S′'s S-4 at E 1 650, and the row adds the Levels deep lane (exit 0, every test passed). Score unchanged.* |
| 5 | dependencies known | ✅ *2026-11-01: `ADR-0058` (PROPOSED); owner acceptance gates the read and merge only* |
| 6 | NFR triggers with targets | ✅ nodes ≤ 0.95 ×; drift 95 % / 25 cp |
| 7 | test notes | ✅ 1–3 |
| 8 | size | ✅ M |
| 9 | priority | ✅ ~~P3~~ P2 |
| 10 | no major unresolved blocker | ~~❌ ADR; `ABC-237`~~ ✅ *2026-11-01: `ADR-0058` written, PROPOSED; reading (b): build may start, read and merge wait on the owner's acceptance; the `ABC-237` wait was lifted by the re-home* |

~~**DoR 9/10 (re-scored 2026-10-29). Backlog.**~~ **DoR 10/10 (re-scored 2026-11-01, `bapm-phase1-wording`). Ready.**
