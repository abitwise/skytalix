---
id: ABC-282
title: "W1: time use under a clock. No iteration is started that the clock says cannot finish, a partial iteration's root move is kept when it beat the incumbent, and each move has a soft and a hard limit inside the ceilings in force; read under a clock, before the first 40/15 reading"
status: ready
column: Ready
size: L
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0071 ACCEPTED 2026-11-04 (owner, OQ-0071-1, form (a), as written; orch-2026-10-30a …7de79e90). Not in force until this ticket merges on A6."
---

# ABC-282: time use under a clock (W1)

> **`ADR-0071` ACCEPTED (THE OWNER, OQ-0071-1, FORM (a), AS WRITTEN); A6'S HARNESS `ABC-300` MERGED; STILL HELD UNTIL
> `ABC-283` MERGES OR MISSES, 2026-11-04, by BA/PM** (task `bapm-owner-answers-1104`, records only, at `main`
> `7dd241cf`; nothing run). Sources: the owner's word as the Orchestrator recorded it (`orch-2026-10-30a`
> `…7de79e90`) and the Architect's owed lines (`arch-owner-answers-1104` `…d6345b29` § 4).
> - **`adr:`** `ADR-0071` ACCEPTED 2026-11-04. Not in force until this ticket merges on A6. F7 reads "accepted, not in
>   force" (`ADR-0071` § Status); an A6 miss is still not merged.
> - **The merge sentence** in the block below now reads: it merges only on its read (A6). The owner's acceptance no
>   longer holds it.
> - **Dependencies:** A6 runs on `ABC-300`'s `d --tc 40/8` (merged `4ea39135`; QE-300-a, `ABC-300`'s A6, is carried
>   here). The page still holds until `ABC-283` merges or misses (the Orchestrator, `…7de79e90`; `ADR-0071` D12).
> - **Option (b) was not taken,** so no follow-up ticket is owed. No bar, row or size moves. **DoR 10/10, Ready,**
>   unchanged. The board move is the Orchestrator's.

> **`ADR-0071` PROPOSED, FOLDED IN; DoR 9/10 → 10/10, READY; SIZE M → L; THE HARNESS TICKET CUT AS `ABC-300`,
> 2026-11-04, by BA/PM** (task `bapm-ABC-282-adr`, records only, at `main` `19581ca1`; nothing run). Sources:
> `ADR-0071` (merged `9471eb32`), the Architect's owed lines (`arch-ABC-282` decision `…0187186b` § Owed lines 1–12)
> and readings (observation `…1938110b`). Each owed line is applied below.
> - **`adr:`** `ADR-0071` PROPOSED. The owner's acceptance is pending as **OQ-0071-1**. Reading (b): the build may start
>   on PROPOSED. It merges only on its read (A6). The owner accepted `ADR-0071` 2026-11-04.
> - **Scope 4:** reading (a), narrowed by `ADR-0071` D1 to `uci-clock-mode` under a clock; `simple-tournament` is out.
>   **Scope 5:** D5's reporting, in place of `UNKNOWN - verify`.
> - **A0:** D8's rows A0-1, A0-2 and A0-3 with their counts. **A1 (c):** D9's corpus, clock, head, base, share and bar.
>   **A2 (c):** D4's mate sentence as the stated row. **A3 (b):** `ADR-0052` D2's 1 ms floor excepted. **A4:**
>   unchanged. **A6:** D10's control (`tc=40/8`), shape, intent GAIN and wall.
> - **Dependencies:** after `ABC-283` (D12), and A6 after `ABC-300` (the harness ticket). **Size M → L.**
> - **Test note 3:** the old and new A3 rows named. **`NFR-008`:** the lane placement.
> - The as-cut text of every passage replaced here is kept unedited under § As cut.
> - **Not on this page:** the board (the Orchestrator's); putting OQ-0071-1 to the owner (the Orchestrator's); the
>   `AGENTS.md` UCI time-mode line (the Scribe's, at the build); `ADR-0066` d5's dated line (owed by whichever of this
>   ticket and `ABC-283` lands second).

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog** (task `bapm-W1-bundle-cut`, records only, at `main` `09694a4e`;
> nothing run, built or timed). Source: the owner's *"yes, cut W1"* (`orch-2026-10-30a` `…4c4cb03d` ruling 1: W1 is
> cut by BA/PM, and the Architect owes its ADR after the cut). `EPIC-011` Phase 5, stub row W1.
> - **Placement:** it **lands before the first 40/15 reading**, wherever that falls (§ Phases W1). It is not needed
>   for the claim to be legal, because both clock modes have never lost on time (`EPIC-009` M1). It is needed for
>   strength (`ADR-0056` C1).
> - **Row 10 is open:** the ADR is owed. This page names what it must fix, and it fixes no value itself.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** anyone playing `skytalix` on a real clock through UCI: the 40/15 claim reading (`ADR-0056` C1) and a
  chess UI on `uci-clock-mode` or `simple-tournament`.
- **Pain, read on `main`** (`ADR-0056` § Inventory, "Time use"; `src/engine.ts`):
  - The budget is one deadline a move. The deepening loop starts iteration d + 1 whenever the clock is under the
    deadline, with no test of whether it can finish.
  - An aborted iteration is **discarded whole** (`ABC-078` A3). So the time spent in it buys nothing, even when its
    first root moves already showed a better move.
  - There is **no soft or hard limit**: one figure, `min(cap, C)` (`ADR-0052` D2–D4), is both the target and the stop.
- **Value:** at a branching factor of about 2.5–3, the discarded iteration is often half or more of a move's time
  (`ADR-0056` C1, an estimate citing `[J]`, not a reading). `ADR-0056` D2 row W1 estimates **+10–40 Elo**. **That is
  an estimate, not a reading.** Under a clock, time not spent on a doomed iteration stays on the clock for later moves.

## Scope

The ADR governs each line. Every value comes from a rule it states.

1. **No doomed iteration:** before iteration d + 1 starts, a stated rule predicts whether it can finish before the
   move's limit, from the time the search has spent so far. If it cannot, the search stops and plays its move. The rule
   is a continuous function of the time left, and it acts the same at every control (`ADR-0056` R-TC part 1 item 2).
2. **The partial iteration:** when iteration d + 1 is stopped part-way, its root move is played **only if it beat the
   incumbent** (iteration d's best) by the ADR's stated test. Otherwise the incumbent is played, as today. This
   amends `ABC-078` A3. The ADR states the amendment and the header text of `src/engine.ts` that it replaces.
3. **Soft and hard limits:** each move gets a soft limit (no new iteration after it) and a hard limit (the abort).
   Both are inside the ceilings in force (`NFR-004`) and inside the clock less `ADR-0052` D2's reserve.
4. **Which modes (`ADR-0071` D1): reading (a), narrowed to `uci-clock-mode` under a clock.** W1 acts only when the
   session's `TimeMode` is `uci-clock-mode` and the `go` line carries the side to move's clock (`wtime` for White,
   `btime` for Black) and no `movetime`. That is the one row whose budget is `min(59 500, C)`.
   - **Every other row is node-identical to `main`** (A0): `level` with any tokens, `simple-tournament` with any
     tokens, and `uci-clock-mode` with `movetime` or with no time token. W1 is off on all of them, the partial-iteration
     rule (scope 2) included.
   - **`simple-tournament` is out**, though the as-cut reading (a) named it. At 40/15, T = 22 000 binds every move, so
     the time W1 saves is never spent. Under W1, 40 × (f × 22 000 + 31) ms is **62.7 %** of the period at P3's median
     use (f = 0.64) and **42.6 %** in the worst case (f = 1 / 2.3). The mode stays "22 s a move", node-identical to
     `main` with every token.
   - **Reading (b) is not taken:** at a fixed budget the head completes one ply less on 22 of 125 rows (P3). Scope 2 in
     every mode is OQ-0071-1's option (b), a follow-up ticket of its own if the owner takes it. *2026-11-04
     (`bapm-owner-answers-1104`): not taken (the owner chose (a)); no follow-up ticket is owed.*
5. **What is reported (`ADR-0071` D5):**
   - **`EngineChoice.depth`** keeps its meaning: the deepest COMPLETED iteration, d. `NFR-005`, `G6` and every depth
     reading are untouched.
   - **`EngineChoice.move` and `.score`** are the played move and its score: M with its d + 1 score when scope 2 keeps
     it, otherwise iteration d's.
   - **One new optional field, `EngineChoice.partial?: true`.** It is present only when scope 2 kept a move, absent on
     every other search, and never written `false`.
   - **UCI:** when `choice.partial` is set, the session writes `info string partial depth <d + 1>` immediately before
     its `info depth d score … pv <move>` line. The `info` line's shape is unchanged.

## Out of scope

- **Pondering**, and **threads** (`ABC-266` is parked). If threads re-open, these limits are re-read against the
  worker pool (§ Phases W1).
- **Changing a mode's budget formula** (`ADR-0052` D2–D4's `C`, the 22 s and 59.5 s caps), a level's budget, or any
  `NFR-004` ceiling. Moving a ceiling is the owner's.
- **A move-stability or score-drop rule** that extends the soft limit (an "emergency" time rule). It is a follow-up,
  unless the ADR shows it is needed for scope 1 or 2.
- Any change to search, evaluation or ordering.

## Acceptance criteria

The ADR fixes the exact counts, limits and the read's control before Ready. None of these bars is loosened after
Ready.

- **A0 (identity where W1 does not act; `ADR-0071` D8).** The rows bind; the numbers are `main` `5853d17f`'s (`src/`
  tree `4fb3da04`). **If `ABC-283` merges first, every value is re-read on the new merge-base by the same rows, before
  the change** (D12).
  - **A0-1 (a frozen clock, `maxDepth` reached first;** `now: () => 0`, `budgetMs: 60000`**).** Each row reads the same
    with `softMs` absent and with `softMs: 1`:

    | position | d | move | score | nodes |
    |---|---|---|---|---|
    | kiwipete | 6 | e2a6 | −59 | 144 120 |
    | kiwipete | 7 | d5e6 | −82 | 346 458 |
    | kiwipete | 8 | d5e6 | −89 | 766 275 |
    | position-6 | 6 | c3d5 | 87 | 15 209 |
    | position-6 | 7 | c3d5 | 79 | 35 436 |
    | position-6 | 8 | c3d5 | 71 | 87 475 |

  - **A0-2 (a stepping virtual clock, W1 off;** `virtualClock(1)`, `softMs` absent**).** The row a frozen clock cannot
    replace, because a frozen clock never fires the rule:

    | position | budgetMs | depth | move | score | nodes |
    |---|---|---|---|---|---|
    | kiwipete | 50 | 4 | e2a6 | 8 | 48 408 |
    | kiwipete | 200 | 6 | e2a6 | −59 | 199 960 |
    | position-6 | 50 | 7 | c3d5 | 79 | 44 105 |
    | position-6 | 200 | 8 | c3d5 | 71 | 196 681 |

  - **A0-3 (the session hands no `softMs` outside scope 4's row).** On position-6 with an injected `virtualClock(1)`
    and `OwnBook false`, each of these reads `main`'s lines exactly (`info depth … nodes …` and `bestmove`), read on
    the base before the change:
    - `level`: `go movetime 200`; `go wtime 4000 btime 4000`;
    - `simple-tournament`: `go movetime 200`; `go wtime 8000 btime 8000 movestogo 40`;
    - `uci-clock-mode`: `go movetime 200`; `go depth 6` (no time token).

    Plus one row in scope 4's mode (`go wtime 8000 btime 8000 movestogo 40`) that shows `softMs` IS handed in.
- **A1 (no doomed iteration; default-lane units on a virtual clock, no real time):**
  - (a) **Given** a virtual clock on which the rule predicts that iteration d + 1 cannot finish before the soft limit,
    **then** the search returns after iteration d, and **0 nodes** of iteration d + 1 are visited.
  - (b) **Given** a virtual clock on which the rule predicts that it can finish, **then** iteration d + 1 is started.
  - *2026-11-04 (`bapm-ABC-282-adr`; how (a) and (b) are read, `ADR-0071` D2 and D9; no bar moved):* the call is
    `chooseMove(p, { budgetMs: H, now: virtualClock(1), softMs: H / 2.3 })`. The rule predicts that d + 1 cannot finish
    when the time spent after iteration d is ≥ H / 2.3 (2.3 × spent ≥ H, the hard limit). (a) reads exactly as
    `choice.nodes === chooseMove(p, { budgetMs: 60000, now: () => 0, maxDepth: choice.depth }).nodes`, on a row where
    the base aborts inside d + 1. (b) is a row where the time spent after d is under H / 2.3, and `choice.depth` > d.
    The Engineer picks both rows on the base by a scan; P2's position-6 at H = 50 is a candidate.
  - (c) **On a frozen corpus under the virtual clock (`ADR-0071` D9; `ENGINE_DEEP`; QE freezes it before the build,
    test note 2):**
    - **Corpus K25:** `qe-tc-depth-probe` R1's 25 positions: `raw/named.json` (5; sha256 `e41a4914…0479`) and
      `raw/positions.json`'s `skytalix` list (20; sha256 `63d88b2a…0570`).
    - **Clock:** `virtualClock(1)`, H ∈ {25, 50, 100, 200, 400} virtual ms: **125 rows**.
    - **Head:** `softMs = H / 2.3`. **Base:** the same call with `softMs` absent, which is `main` node for node by
      A0-2. QE may play the merge-base build instead; the counts are equal.
    - **The share per row:** (nodes − N(depth)) / nodes, where N(d) is the frozen-clock count at `maxDepth` d.
    - **The bar:** the head's median over the 125 rows is **strictly below** the base's. Both medians are reported.
      Forecast (P3, a prototype, not a reading): base 0.3766, head 0.0000.
    - If `ABC-283` lands first, b is re-read by P1's method and frozen before this row runs (D12 item 3); that is not
      tuning (F3).
- **A2 (the partial iteration; units on a virtual clock):**
  - (a) **Given** iteration d + 1 is stopped after a root move that beat the incumbent by the ADR's test, **then** that
    move is played.
  - (b) **Given** it is stopped before any root move beat the incumbent, **then** the incumbent is played: the same move
    `main` plays.
  - (c) **A mate score (`ADR-0071` D4, a stated row): no special case; the same strict `>` decides.**
    - **Given** a root move whose completed d + 1 search scores a mate for the side to move, above the incumbent's
      completed d + 1 score, **then** it is played with its own d + 1 score (exact, so `scoreOf` prints the right
      `mate N`).
    - **Given** the incumbent's d + 1 score is a mated score and no later move completed above it, **then** the
      incumbent is played with iteration d's score, as on `main`.
    - The fixture is picked on the base by a scan; the mate corpus (`src/search.mate-corpus.ts`) is the place to look.
      P3's kept rows are candidates for (a) (`candidate/b06#3` at H = 50 and 200, `base/b08#7` at H = 200), and any
      aborted head row without a kept move for (b). The Engineer re-scans on the base the build lands on.
- **A3 (the limits hold; `NFR-004`):**
  - (a) **Given** any clock and any mode, **then** no move's search runs past its hard limit by more than `ABC-078`
    A2's node bound after the limit.
  - (b) The hard limit is never above the ceiling in force (22 s in `simple-tournament`, 60 s in `uci-clock-mode`,
    `HARD_CEILING_MS` = 60 000), and never above the clock less `ADR-0052` D2's reserve and overhead, **except
    `ADR-0052` D2's floor of 1 ms, where depth 1 answers at once** (below 1 101 ms on the clock, C = 1; `main`'s
    behaviour, unchanged, `ADR-0071` D3).
- **A4 (`EPIC-009`'s clock bars stay MET, by reference):** in `uci-clock-mode` at the 40/15 clock that `ABC-223`
  read, M1 holds (**0 losses on time; closest call ≥ 500 ms**) and M2 holds (**≥ 75 % of each completed period used,
  per side, book included**). Fewer games than `ABC-223`'s 5 is not a reading. The ADR may make the run shorter, but
  only by an argument it writes down.
  - *2026-11-04 (`bapm-ABC-282-adr`; `ADR-0071` D11): **unchanged, 5 games** at `tc=40/900` from `ABC-223`'s scratch
    protocol; no shortening is argued. M1 holds by construction. **M2 is the watched row** (`R-0071-1`): the worst
    case, every move at its soft limit, reads 72.5 % / 69.0 %; measured use gives ≥ 85 %. F5 routes a miss.*
- **A5 (safety, unchanged rows):** the mate rows, `ADR-0050` d9's zugzwang rows **7 / 7** at their recorded depths,
  and `G1` with **no NEWLY-MISSED line** stay as on `main` (`ADR-0064` d7's list). No zugzwang depth is re-pinned.
- **A6 (the read; `ADR-0071` D10; `EPIC-011` § The per-change rule, by reference). Intent GAIN:** W1 acts at this
  control on every move, so "NEUTRAL (invisible at 100 ms)" does not apply. **It runs only after `ABC-300` merges**
  (the harness plays a clock).
  - **The control:** `tc=40/8` on both sides, `timemargin=0`, `option.TimeMode=uci-clock-mode` on both. It is the
    claim's shape (repeating 40-move periods with `movestogo`) scaled down. Per move, C runs from about 75 ms at a
    period's first move to about 370 ms at its last (an estimate).
  - **The shape (C2′'s):** 100 games, head against its merge-base, self-play, one game at a time, width 1, QE with the
    host ALONE; openings 1–50 of `tools/rating/openings.epd`, both colours; `OwnBook` on, `restart=on`,
    `-maxmoves 200`. `Threads 1` against `Threads 1` holds by construction (no threads option on `main`).
  - **MET** on 100 of 100 complete, **0 losses on time** (C-2), **0 faults** (C-1), and **≥ 50.0 of 100**. A miss is
    NOT MET and is not re-played (F7).
  - **Wall:** about 40 min (an estimate; game length at this control is `UNKNOWN - verify`, bounded by 200 moves a
    side). Under 1 h, so it is not asked of the owner. If QE's PREREG estimate passes 1 h, it is asked first.
  - **S′ is a fault smoke only:** it plays `st=0.5`, which is `movetime`, where W1 is off (A0), so it cannot see W1.
    **The Levels deep lane is not owed** (scope 4). `NFR-005` is untouched.
  - R-TC part 1 item 2 is read at review: no branch is chosen by a particular budget or control.
- **Reports, not bars:** the mean completed depth at the read's control; the share of moves taken from a partial
  iteration; the time left on the clock at each period end.

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | A0 not reproduced | a defect: W1 acts where it should not |
| F2 | A1 (a) / (b) or A2 (a) / (b) red | a defect in the rule's wiring |
| F3 | A1 (c) not lower | the rule does not save time. STOP to Architect/Design; no constant is tuned to pass |
| F4 | A3 red, or a loss on time anywhere | a defect. `NFR-004` is a ceiling, not a target |
| F5 | A4 M1 or M2 NOT MET | STOP to Architect/Design: the soft limit spends too little or too much |
| F6 | A5 red | a defect check first; if real, NOT MET |
| F7 | A6 NOT MET | not merged; `ABC-078` A3 stays in force |

## NFR triggers

- **`NFR-004`** (the per-move ceilings): A3. The limits sit inside 5 s / 7 s / 32 s for the levels, 22 s for
  `simple-tournament` and 60 s for `uci-clock-mode`. No ceiling moves.
- **`NFR-008`** (`npm test` ≤ 10 s; 9.42 s on `main`, 0.58 s of headroom; `ADR-0071` § Consequences):
  - **A0-1, A0-2 and A1 (c) go in `ENGINE_DEEP`** (about 2.8 s, about 1 s, and about 2–3 min, at P1's rate).
  - An optional default-lane identity slice, if `N8-LANE` allows it: position-6 at `virtualClock(1)`, 50 ms,
    **44 105 nodes** (about 0.09 s).
  - A1 (a) / (b) and A2 are small virtual-clock rows in the default lane.
  - The default lane is read before and after (`N8-LANE`).
- **`NFR-005`** (the depth-6 floor at `LEVELS[5]`): under reading (b) only, by its rule (5 runs a board, every run ≥ 6,
  depth 7 a WARN, the median graded "≥ base").
- **`NFR-009`:** no new table is expected. Any growth is stated by the ADR (≤ 16 MiB in all, ≤ 1 MiB growth).
- **Security:** none. No new input is parsed. The `go` tokens are `ADR-0052`'s.

## Test notes

1. **Virtual clock first.** A1 and A2 run on the engine's injected clock and never sleep. Real-clock rows (A3 at the
   ceilings, A4) are deep or QE rows.
2. **QE freezes A1 (c)'s corpus and clock before the build**, and never changes them to fit.
3. **`ABC-078` A3's rows are re-pointed, not deleted (`ADR-0071` D7).** The old row is `src/engine.test.ts` "A3 — an
   aborted iteration's move is discarded, not returned" (the `A3_FEN` fixture at budget 3 on a 1 ms tick, no
   `softMs`), and its deep twin "A3 — the depth-3 move the default lane carries as a literal [deep]". Both stay
   unchanged, as A3 (i). The new rows are A2 (a)–(c), as A3 (ii). Two more lines move with it by the ADR: `ABC-078`
   A4's textual pin of the loop header (re-pointed to the new one-read header) and the `EngineChoice` doc lines on
   `move` and `score`.
4. **UAT is owed.** The QE verdict signs it (the 2026-10-22 delegation).

## Size and priority

- **Size: L** *(M → L 2026-11-04, `bapm-ABC-282-adr`, by this page's own rule: the harness needs a clock mode first,
  `…1938110b`, so `ABC-300` is cut as a tools ticket of its own)*. One rule in the deepening loop, one amended
  criterion, limits in one mode, the read under a clock after a harness ticket, and `ADR-0071` D12's rebase work if
  this ticket lands after `ABC-283`.
- **Priority: P2.** It is the claim's precondition (§ Phases W1), and `ADR-0056` D2 estimates +10–40 Elo.

## Dependencies

- **The ADR: `ADR-0071` ACCEPTED 2026-11-04** (the owner, OQ-0071-1, form (a), as written; `…7de79e90`; written
  by `arch-ABC-282`, merged `9471eb32`). DoR row 10 is met. Not in force until this ticket merges on A6. The merge
  waits on A6 only. *(Was: PROPOSED, the acceptance pending; the merge waited on A6 and on the acceptance.)*
- **After `ABC-283` (`ADR-0071` D12), one at a time on `src/engine.ts`.** This ticket builds after `ABC-283` merges or
  misses. *2026-11-04: the page still holds until `ABC-283` merges or misses (the Orchestrator, `…7de79e90`).* If `ABC-283` merges first, this ticket rebases and carries: D4's test generalised per aspiration pass (the
  incumbent exact inside the pass's window, M exact or failing high above it); b re-read by P1's method and frozen
  before A1 (c); A0's counts re-read on the new merge-base; `ADR-0066` d5's dated line; the text conflicts in `deepen`
  and `runIteration`.
- **`ABC-300` before A6:** the harness ticket (`tools/rating` `d --tc 40/8`, tools only, S, P2). A6 runs only after it
  merges. The build, A0–A5 and the gates do not wait on it. *2026-11-04: **merged `4ea39135`** (QE PASS_WITH_GAPS,
  `qe-ABC-300` `…fbda2ad6`). A6 runs on its `d --tc 40/8`. QE-300-a (`ABC-300`'s A6, `UNKNOWN - verify` there) is
  carried here and is read at this ticket's A6.*
- **Threads** (`ABC-266`, parked): not a wait. If threads re-open, these limits are re-read against the pool.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ one deadline, no "will it finish" test, a discarded partial iteration; the value is an estimate, labelled |
| 2 | scope and out-of-scope | ✅ scope 1–5; the modes are reading (a) narrowed to `uci-clock-mode` under a clock (`ADR-0071` D1); pondering, threads, budget formulae and emergency time out |
| 3 | INVEST | ✅ L; one rule in one loop, one mode; independent of evaluation and ordering; the harness split out as `ABC-300` |
| 4 | testable, measurable acceptance | ✅ A0 exact counts (D8); A1 0 nodes / started / head median strictly below base on 125 rows; A2 the move named, the mate row stated; A3 node bound, ≤ ceiling, 1 ms floor; A4 0 time losses, ≥ 500 ms, ≥ 75 %; A5 7 / 7, no NEWLY; A6 at `tc=40/8`, ≥ 50.0 of 100, 0 time losses, 0 faults |
| 5 | dependencies known | ✅ `ADR-0071` ~~PROPOSED (OQ-0071-1 pending, reading (b))~~ ACCEPTED 2026-11-04 (OQ-0071-1, (a)); after `ABC-283` (D12); `ABC-300` (the harness ticket, merged `4ea39135`) before A6 |
| 6 | NFR triggers with targets | ✅ `NFR-004` ceilings, 1 ms floor; `NFR-008` ≤ 10 s, A0-1 / A0-2 / A1 (c) in `ENGINE_DEEP`; `NFR-005` untouched (scope 4); `NFR-009` ≤ 16 MiB, no table |
| 7 | test notes | ✅ 1–4; note 3 names the old and new A3 rows |
| 8 | size | ✅ L (was M) |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ 2026-11-04, Architect/Design (`arch-ABC-282`; `ADR-0071` PROPOSED): the rule (soft = budget ÷ 2.3, b measured), the limits per mode, the partial-iteration test, the modes (reading (a) narrowed to `uci-clock-mode` under a clock), the `ABC-078` A3 amendment, A0's counts, A1 (c)'s corpus and clock, the read's control (`tc=40/8`) and intent (GAIN) are fixed |

**DoR 10/10. Ready** (2026-11-04, `bapm-ABC-282-adr`; was 9/10, Backlog). The column moves are the Orchestrator's.
Ready for Dev waits on `ABC-283`'s merge or miss (D12); A6 waits on `ABC-300`. *2026-11-04
(`bapm-owner-answers-1104`): `ABC-300` merged `4ea39135`, so A6 no longer waits on it; `ABC-283`'s merge or miss
still holds the page.*

## As cut (superseded 2026-11-04 by `ADR-0071` PROPOSED; kept unedited for the record)

### Scope 4 and 5

4. **Which modes:** the ADR names them. There are two readings, and this page takes neither:
   - **(a) the clock modes only** (`uci-clock-mode`, and `simple-tournament` under a clock). `level` and `movetime` are
     then node-identical to `main` (A0).
   - **(b) every mode.** The C2′ reads at 100 ms then read W1 too, and `NFR-005` is re-read at `LEVELS[5]`.
   - Scope 1 saves time only where saved time can be spent later, which is under a clock. Under a fixed move time,
     stopping early just leaves time unused. Scope 2 can pay in any mode.
5. **What is reported:** `EngineChoice.depth` and the UCI `info` lines for a move taken from a partial iteration
   follow the ADR's rule (`UNKNOWN - verify` until it is written).

### Acceptance (A0, A1 (c), A2 (c), A3 (b), A6)

- **A0 (identity where W1 does not act):** under reading (a), `level` and `movetime` searches read `main`'s node
  counts exactly (frozen-clock `chooseMove` on kiwipete and position-6, at the ADR's depths). Under either reading, a
  search that is never stopped by a limit (a `depth` or `nodes` limit reached first) reads `main`'s move, score and
  nodes exactly.
- **A1 (c):** **On a frozen corpus under the virtual clock** (the ADR names the corpus and the clock), the share of
  nodes spent in iterations that are thrown away is **strictly lower** at the head than at the base, by the median.
  Both figures are reported.
- **A2 (c):** A mate score from a partial iteration follows the ADR's rule (a stated row, not a judgement).
- **A3 (b):** The hard limit is never above the ceiling in force (22 s in `simple-tournament`, 60 s in `uci-clock-mode`,
  `HARD_CEILING_MS` = 60 000), and never above the clock less `ADR-0052` D2's reserve and overhead.
- **A6 (the read; `EPIC-011` § The per-change rule, by reference). Intent GAIN unless the ADR names NEUTRAL before
  Ready.**
  - C2′'s shape: 100 games, head against its merge-base, self-play, one game at a time, `Threads 1` against `Threads 1`,
    QE with the host ALONE. It is played **under a clock the ADR names, not at a fixed `st=` move time**, because a
    fixed move time cannot show a time-use change.
  - **MET** on 100 of 100 complete, **0 losses on time**, and **≥ 50.0 of 100**. A miss is NOT MET and is not
    re-played.
  - S′ and the Levels deep lane follow the per-change rule. The Levels lane is owed under reading (b) only.
  - R-TC part 1 item 2 is read at review: no branch is chosen by a particular budget or control.

### NFR-008 and test note 3

- **`NFR-008`** (`npm test` ≤ 10 s; 9.42 s on `main`, 0.58 s of headroom): A1 and A2 are virtual-clock units, with no
  real time and no deep search. Anything heavier goes in a deep lane. The default lane is read before and after
  (`N8-LANE`).

3. **`ABC-078` A3's rows are re-pointed, not deleted.** The ADR names the old row and the new one.

### Size and dependencies

- **Size: M.** One rule in the deepening loop, one amended criterion, limits per mode, and a read under a clock. It
  becomes **L** if the harness needs a clock mode first. That would be a tools ticket of its own.
- **The ADR** (the Architect's, owed after this cut, `…4c4cb03d` ruling 1). It is the DoR row 10 blocker.
- **The harness can play a clock read:** whether `ABC-255`'s `rpair` / `d` accept a `tc=` control is `UNKNOWN -
  verify`. If they cannot, a tools ticket is cut before A6, as `ABC-275` was for R1.
- **One at a time with `ABC-283` on `src/engine.ts`.** `ABC-283`'s S1 changes `chooseMove`'s root, the loop this
  ticket edits. This ticket builds after `ABC-283` merges or misses. Whichever lands second re-reads its node
  counts.

### Definition of Ready (as cut)

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ one deadline, no "will it finish" test, a discarded partial iteration; the value is an estimate, labelled |
| 2 | scope and out-of-scope | ✅ scope 1–5 (modes left to the ADR, two readings named); pondering, threads, budget formulae and emergency time out |
| 3 | INVEST | ✅ M; one rule in one loop; independent of evaluation and ordering |
| 4 | testable, measurable acceptance | ✅ A0 exact; A1 0 nodes / started / strictly lower; A2 the move named; A3 node bound, ≤ ceiling; A4 0 time losses, ≥ 500 ms, ≥ 75 %; A5 7 / 7, no NEWLY; A6 ≥ 50.0 of 100, 0 time losses |
| 5 | dependencies known | ✅ the ADR; harness support `UNKNOWN - verify`, with its route named; `ABC-283` on `src/engine.ts` |
| 6 | NFR triggers with targets | ✅ `NFR-004` ceilings; `NFR-008` ≤ 10 s; `NFR-005` under (b); `NFR-009` ≤ 16 MiB |
| 7 | test notes | ✅ 1–4 |
| 8 | size | ✅ M (L with a harness ticket) |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ **the ADR is owed** (the Architect's): the rule, the limits per mode, the partial-iteration test, the modes (a) / (b), the `ABC-078` A3 amendment, A0's counts, A1 (c)'s corpus and clock, the read's control and intent. Accepting a new ADR is the owner's (reading (b): the build may start on PROPOSED) |

**DoR 9/10. Backlog.**
