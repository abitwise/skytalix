---
id: ABC-282
title: "W1: time use under a clock. No iteration is started that the clock says cannot finish, a partial iteration's root move is kept when it beat the incumbent, and each move has a soft and a hard limit inside the ceilings in force; read under a clock, before the first 40/15 reading"
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-011
feature: —
adr: "owed (the Architect's): a new ADR for W1 on main's engine (the 'will the next iteration finish' rule, the soft and hard limit per time mode, the partial-iteration rule and what EngineChoice reports for it, the modes it applies to, the amendment of ABC-078 A3, the read's control and the harness it needs, the intent). A new ADR is the owner's to accept; reading (b) lets the build start on PROPOSED"
---

# ABC-282: time use under a clock (W1)

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
4. **Which modes:** the ADR names them. There are two readings, and this page takes neither:
   - **(a) the clock modes only** (`uci-clock-mode`, and `simple-tournament` under a clock). `level` and `movetime` are
     then node-identical to `main` (A0).
   - **(b) every mode.** The C2′ reads at 100 ms then read W1 too, and `NFR-005` is re-read at `LEVELS[5]`.
   - Scope 1 saves time only where saved time can be spent later, which is under a clock. Under a fixed move time,
     stopping early just leaves time unused. Scope 2 can pay in any mode.
5. **What is reported:** `EngineChoice.depth` and the UCI `info` lines for a move taken from a partial iteration
   follow the ADR's rule (`UNKNOWN - verify` until it is written).

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

- **A0 (identity where W1 does not act):** under reading (a), `level` and `movetime` searches read `main`'s node
  counts exactly (frozen-clock `chooseMove` on kiwipete and position-6, at the ADR's depths). Under either reading, a
  search that is never stopped by a limit (a `depth` or `nodes` limit reached first) reads `main`'s move, score and
  nodes exactly.
- **A1 (no doomed iteration; default-lane units on a virtual clock, no real time):**
  - (a) **Given** a virtual clock on which the rule predicts that iteration d + 1 cannot finish before the soft limit,
    **then** the search returns after iteration d, and **0 nodes** of iteration d + 1 are visited.
  - (b) **Given** a virtual clock on which the rule predicts that it can finish, **then** iteration d + 1 is started.
  - (c) **On a frozen corpus under the virtual clock** (the ADR names the corpus and the clock), the share of nodes
    spent in iterations that are thrown away is **strictly lower** at the head than at the base, by the median. Both
    figures are reported.
- **A2 (the partial iteration; units on a virtual clock):**
  - (a) **Given** iteration d + 1 is stopped after a root move that beat the incumbent by the ADR's test, **then** that
    move is played.
  - (b) **Given** it is stopped before any root move beat the incumbent, **then** the incumbent is played: the same move
    `main` plays.
  - (c) A mate score from a partial iteration follows the ADR's rule (a stated row, not a judgement).
- **A3 (the limits hold; `NFR-004`):**
  - (a) **Given** any clock and any mode, **then** no move's search runs past its hard limit by more than `ABC-078`
    A2's node bound after the limit.
  - (b) The hard limit is never above the ceiling in force (22 s in `simple-tournament`, 60 s in `uci-clock-mode`,
    `HARD_CEILING_MS` = 60 000), and never above the clock less `ADR-0052` D2's reserve and overhead.
- **A4 (`EPIC-009`'s clock bars stay MET, by reference):** in `uci-clock-mode` at the 40/15 clock that `ABC-223`
  read, M1 holds (**0 losses on time; closest call ≥ 500 ms**) and M2 holds (**≥ 75 % of each completed period used,
  per side, book included**). Fewer games than `ABC-223`'s 5 is not a reading. The ADR may make the run shorter, but
  only by an argument it writes down.
- **A5 (safety, unchanged rows):** the mate rows, `ADR-0050` d9's zugzwang rows **7 / 7** at their recorded depths,
  and `G1` with **no NEWLY-MISSED line** stay as on `main` (`ADR-0064` d7's list). No zugzwang depth is re-pinned.
- **A6 (the read; `EPIC-011` § The per-change rule, by reference). Intent GAIN unless the ADR names NEUTRAL before
  Ready.**
  - C2′'s shape: 100 games, head against its merge-base, self-play, one game at a time, `Threads 1` against `Threads 1`,
    QE with the host ALONE. It is played **under a clock the ADR names, not at a fixed `st=` move time**, because a
    fixed move time cannot show a time-use change.
  - **MET** on 100 of 100 complete, **0 losses on time**, and **≥ 50.0 of 100**. A miss is NOT MET and is not
    re-played.
  - S′ and the Levels deep lane follow the per-change rule. The Levels lane is owed under reading (b) only.
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
- **`NFR-008`** (`npm test` ≤ 10 s; 9.42 s on `main`, 0.58 s of headroom): A1 and A2 are virtual-clock units, with no
  real time and no deep search. Anything heavier goes in a deep lane. The default lane is read before and after
  (`N8-LANE`).
- **`NFR-005`** (the depth-6 floor at `LEVELS[5]`): under reading (b) only, by its rule (5 runs a board, every run ≥ 6,
  depth 7 a WARN, the median graded "≥ base").
- **`NFR-009`:** no new table is expected. Any growth is stated by the ADR (≤ 16 MiB in all, ≤ 1 MiB growth).
- **Security:** none. No new input is parsed. The `go` tokens are `ADR-0052`'s.

## Test notes

1. **Virtual clock first.** A1 and A2 run on the engine's injected clock and never sleep. Real-clock rows (A3 at the
   ceilings, A4) are deep or QE rows.
2. **QE freezes A1 (c)'s corpus and clock before the build**, and never changes them to fit.
3. **`ABC-078` A3's rows are re-pointed, not deleted.** The ADR names the old row and the new one.
4. **UAT is owed.** The QE verdict signs it (the 2026-10-22 delegation).

## Size and priority

- **Size: M.** One rule in the deepening loop, one amended criterion, limits per mode, and a read under a clock. It
  becomes **L** if the harness needs a clock mode first. That would be a tools ticket of its own.
- **Priority: P2.** It is the claim's precondition (§ Phases W1), and `ADR-0056` D2 estimates +10–40 Elo.

## Dependencies

- **The ADR** (the Architect's, owed after this cut, `…4c4cb03d` ruling 1). It is the DoR row 10 blocker.
- **The harness can play a clock read:** whether `ABC-255`'s `rpair` / `d` accept a `tc=` control is `UNKNOWN -
  verify`. If they cannot, a tools ticket is cut before A6, as `ABC-275` was for R1.
- **One at a time with `ABC-283` on `src/engine.ts`.** `ABC-283`'s S1 changes `chooseMove`'s root, the loop this
  ticket edits. This ticket builds after `ABC-283` merges or misses. Whichever lands second re-reads its node
  counts.
- **Threads** (`ABC-266`, parked): not a wait. If threads re-open, these limits are re-read against the pool.

## Definition of Ready

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
