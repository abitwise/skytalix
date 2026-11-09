---
id: ABC-310
title: "Re-test the dropped work in groups: one branch per group, one graded read per group, then one closing read vs Stockfish"
status: backlog
column: Backlog
size: XL
priority: P2
epic: "— (the owner's ask, orch-2026-10-30a …092956f8; EPIC-011 and every earlier epic are closed, and the repo cuts an owner ask outside an open epic without one, as ABC-309; the per-group children name ABC-310 as their parent)"
feature: —
adr: "none of its own. The instruments are ADR-0056 (C2′, CF1–CF10, R-BUNDLE-1) and ADR-0055 D3-V2 (S2). Owed by the Architect before the groups that need them: see § What the Architect owes"
---

# ABC-310: re-test the dropped work in groups, then one closing read against Stockfish

> **Cut 2026-11-09 by BA/PM: XL, P2, DoR 8/10, Backlog, HELD** (task `bapm-group-retest`, records only, at `main` `782c6cda`;
> nothing run, built, timed or played). Sources: the owner's words and the groups, Orchestrator `orch-2026-10-30a` `…092956f8`
> (2026-11-09T21:37:44Z); QE's strategy, `qe-group-strategy` `…720e934d` (2026-11-09T21:49:43Z), read whole.
> - **Held: "No test, build or game runs until the owner's later word"** (`…092956f8`). Row 10 fails until the owner answers the five
>   questions in § Owner questions. Row 3 fails by design: this is a programme. Each group gets its own child ticket, cut when that
>   group is picked (§ Child tickets).
> - **Epic-less**, as the repo cuts an owner ask that sits outside an open epic (`ABC-309`; 73 pages carry `epic: —`). No epic is open.
>   An EPIC-012 page would only repeat this page. The children name `ABC-310` as their parent.
> - Group member lists checked against the 42 dropped pages. **No member changed.** Two notes are added, see § Member lists, checked.
> - The board move is the Orchestrator's.

## Problem

- **User:** the owner. He closed the project on 2026-11-09 (`…a9c03e07`) with 42 tickets dropped, closed NOT MET or parked, several of
  them on code that is still kept on branches.
- **Pain:** each dropped change was read alone, or never read at all. The kept branches are 43 to 2 449 commits behind `main` (QE's count
  at `21aa34ad`; the Orchestrator's note read 42 to 2 378 one commit earlier, without the remote branch). They no longer merge as they
  stand. One read per change at the owner's rules would cost far more host hours than he wants to spend.
- **Value:** the owner's words: *"merge them together into one branch and test on that branch, find suitable testing strategy that
  doesn't take too many hours"* (`…092956f8`). Each group is one branch and one graded read. One closing read then says whether `main`
  plays any worse than R2. Every figure the programme costs is stated in advance, so he can approve it once.
- **Assumption:** the owner's standing rules bind every read: one core under the host lock, no SPRT, 100 games per change and 400 per
  epic, a run over 1 h asked first, and a held host for timing and games (`…092956f8`; memory § Validation rules).

## Scope

Eight groups, A to H, then one closing read. **The strategy is QE's note `…720e934d`. The tables below carry it, and its reasoning
stays in the note.** Every hour, game count and speed figure is QE's estimate (`UNKNOWN - verify` until run) unless it says "measured".

### The rules every group follows (QE § The rules for every group, items 1–7, by reference)

1. **Branch:** `grugops/grp-<letter>`, cut from `main` when the group starts. A kept branch ≤ 300 commits behind gets one `git merge`
   attempt. A `src/` conflict aborts it, and that member is re-ported. A branch more than 300 behind is never merged: its member is
   re-ported from its page, and the old branch is read as a reference only. A member with no code is built new from its page. Each member
   keeps its own off door, and the all-off door is node-identical to `main` (R-BUNDLE-1).
2. **Untimed gates first**, under the host lock on one core, with one vitest worker. All gates are green before any game or timing runs.
3. **QE's freeze and PREREG are sealed before the build is dispatched.**
4. **Held-host windows:** W is asked of the owner for each window and `ps` is checked first. Each window is under 1 h, and windows are
   never pooled across groups.
5. **No SPRT. 100 games per group,** never extended. A stale read is read again on the new base, which is not a re-play.
6. **On a miss:** NOT MET, never re-played, with a `failed-attempt` note. One untimed diagnostic per group may name one member to drop. A
   pre-registered re-read without that member is allowed only where the table says yes. That re-read is a new 100-game read at the same
   bar, at most one per group, and its own miss is final.
7. **Base:** a read is taken against its merge-base on `main`, which is R2's `main` plus the groups that passed. A group that misses never
   enters a later base.

### Group A: speed with the same moves (value-identical)

| | |
|---|---|
| Members | `ABC-250`; `ABC-251` in its full form; `ABC-252`; `ABC-253` only if its profile-first step finds something to cut (its page: a fresh profile ranks the key path at ≥ 5 % of self time on two boards; out otherwise, which is not a miss). `ABC-298` out (the owner). |
| Branch | `grugops/ABC-250` `35139b31`, 1 574 behind: re-port. `251`, `252`, `253`: new builds from their pages. `grugops/ABC-298` not used. |
| Untimed gates | perft deep (exact counts, leaf-key XOR); `ABC-250` A2 list walk (285 074 positions, 46 s measured); `G4` node for node on the whole tree; all deep lanes; `G1` rows equal. |
| Graded read and bar | S2 under `ADR-0055` D3-V2, **0 games**. **Bar: ≥ 1.03 × on two boards and ≥ 1.00 × on the third** (QE's recommendation, adopted: the bar of `ABC-240`, narrowed `ABC-251` and `ADR-0077` SG3); `G6` ≥ base. A miss is likely (QE). |
| Wall (est.) | untimed 0.4 h; held 0.5 h → **0.9 h** |
| On a miss | NOT MET, final. No diagnostic and no re-read. VOID-LOAD is not a miss. |

### Group B: the hash table

| | |
|---|---|
| Members | `ABC-257` (T1 + T3; `ABC-209` folds into it, and so does `ABC-238`'s deeper cutoff); `ABC-237`; `ABC-258`. |
| Branch | `grugops/ABC-209` `bb6cf451` (2 286 behind) and `grugops/ABC-238` `772153a7` (1 459 behind): re-port per `ABC-257`'s page. `237`, `258`: new builds. |
| Untimed gates | all-off door node-identical; `ABC-238` A3 drift and mate-sign rows; repetition rows; `G7`/`NFR-009` ≤ 16 MiB, growth ≤ 1 MiB over a 40-move game; transposition deep lanes; `G1`. Own untimed bar `ABC-257` A8′: ≤ 0.93 × nodes pooled over searches 2–9 on the held-out lines, no game above 1.00 ×. |
| Graded read and bar | C2′, **NEUTRAL (invisible at 100 ms) ≥ 43.0 and A8′, both required.** 100 games plus S′ 10. |
| Wall (est.) | untimed 0.6 h; held 1.1 h → **1.7 h** |
| On a miss | Diagnostic: yes. One pre-registered re-read: yes. Its bar is the remaining members' page bars (`ABC-237` A3, ≤ 0.97 × at depth 8) with NEUTRAL. |

### Group C: pruning

| | |
|---|---|
| Members | `ABC-264` (P2); `ABC-284` (P1); `ABC-285` (P5); `ABC-289` (Q2). `ABC-287` (P6) only if E passes before C starts (§ Order). |
| Branch | `grugops/ABC-264-fix` `4d1c0616` (1 438 behind): re-port. `grugops/ABC-289` `b42706b3` (265 behind): one merge attempt. `284`, `285`: new builds, after the Architect's items (§ What the Architect owes). |
| Untimed gates | all-off identity; zugzwang 7 / 7; mate floor 0; `G1` ≥ 54 / 58 with none newly missed; `ADR-0074` DP2 drift ≤ 30 cp; the futility audit; null-move, futility and quiescence deep lanes; the depth-8 node ratio on kiwipete and position-6, reported. |
| Graded read and bar | C2′, **GAIN ≥ 50.0.** 100 games plus S′ 10. |
| Wall (est.) | untimed 0.8 h; held 1.1 h → **1.9 h** |
| On a miss | Diagnostic: yes. One pre-registered re-read: yes. If the all-on `G1` or DP2 is red again and the diagnostic names `289`, it is dropped before any game. That drop is not a re-read. |

### Group D: extensions

| | |
|---|---|
| Members | **One** check-extension form: `ABC-296` (X1) **or** `ABC-210` (horizon). The Architect names it before the branch forms, and QE recommends X1. Plus `ABC-297` (X2 + IIR), only if its premise probe passes. |
| Branch | `grugops/ABC-210` `a96f36b0`, 2 248 behind: reference only, re-port the chosen form. `297`: new, after its probe and its ADR. |
| Untimed gates | X2 premise probe on `main` after B (counts only, est. 0.25 h); all-off identity; the ADR's growth bound; `engine.capacity` deep; the check-extension rows; zugzwang; mate floor; `G1`. |
| Graded read and bar | C2′, **GAIN ≥ 50.0.** If only X2 is left: **NEUTRAL (invisible at 100 ms) ≥ 43.0 plus its SE3 bar**, named on D's child ticket before the read. 100 games plus S′ 10. |
| Wall (est.) | untimed 1.0 h; held 1.1 h → **2.1 h** |
| On a miss | Diagnostic: yes. One pre-registered re-read: yes. |

### Group E: evaluation terms with one joint fit (runs only on the owner's four yeses, Q2)

| | |
|---|---|
| Members | `ABC-290` (E3b, re-try of `ABC-205`); `ABC-306` (E5d, re-try of `ABC-207`); `ABC-291` (E4b); `ABC-292` (E5); `ABC-308` (E5c); `ABC-293` (E6). **Values come from one joint fit** by `ADR-0067`'s tuner (`ABC-239`/`ABC-301`'s method), never hand values. |
| Branch | `grugops/ABC-291` `9e496e4a`, 213 behind: one merge attempt. `origin/grugops/arch-rule-ABC-205-g6` and `grugops/ABC-207`: reference only. `grugops/ABC-239`, `ABC-239b`, `ABC-301`: **not merged** (void here). `292`, `293`, `308`: new, structure at 0 plus tracer features. |
| Untimed gates | every term at 0 node-identical to `main`; `G3` mirror; `G2` cost bar per the ADR; `TUNE_DEEP`. The fit: extract, fit and emit twice (B-T3), on `ADR-0067`'s pinned data; B-T1/B-T2; B-T4; **B-T5**: zugzwang 7 / 7 with `zugzwang.001` e1f1 at depth 9, mate floor 0, `G1` ≥ 54 / 58, the futility audit; B-T6 `G6`. |
| Graded read and bar | C2′, **GAIN ≥ 50.0** (B-T7). 100 games plus S′ 10. B-T8 is not in the group (Q2). |
| Wall (est.) | untimed 1.2 h (fit 0.4 h included); held 1.1 h → **2.3 h** |
| On a miss | **Final for the whole group:** no member is dropped and there is no re-read (`ADR-0075` d11 (d), `ADR-0076` d14 (c)). It is the third miss on the tuning row, which closes tuning. The diagnostic is recorded only. |

### Group F: endgame

| | |
|---|---|
| Members | `ABC-272` (E7a); `ABC-294` (E7b, after `272`'s probe). |
| Branch | No code anywhere. New builds on `main` at F's start, after the probes. |
| Untimed gates | `ABC-272`'s pre-registered probe (12 won starts at 47 000 nodes, 10 drawish static reads; est. ≤ 15 min), then `294`'s in the same shape. A half whose premise fails is struck, which is not a miss. **If every half is struck, F closes with nothing built and no games.** Then all-off identity; `src/gameend.ts` byte-identical; `G3`; zugzwang; mate floor; `G1`; the taper and passer deep lanes. |
| Graded read and bar | C2′. **GAIN ≥ 50.0 by default.** NEUTRAL (invisible at 100 ms) ≥ 43.0 is allowed only with the ADR's firing figure and the probe sets re-read on the head as its own bar, with numbers fixed on F's child ticket before Ready. 100 games plus S′ 10. |
| Wall (est.) | untimed 0.9 h (probes 0.5 h); held 1.1 h → **2.0 h** |
| On a miss | Diagnostic: yes. One pre-registered re-read: yes. |

### Group G: threads (runs only on the owner's answers to Q3)

| | |
|---|---|
| Members | `ABC-266` (Lazy SMP, UCI `Threads`, default 1). `ABC-267`'s rows ride inside it (its closed line). `ADR-0062` is PROPOSED. |
| Branch | No code. A new L build on `ABC-265`'s shared table, which is on `main`. A tools-only harness change is owed for `--threads` (`ABC-255` scope 5). |
| Untimed gates | `Threads 1` node for node with `main` on every `G4` corpus; A1 constructor counts and refusals; A4 `readyok` before `bestmove`; A5/`G7` 16 MiB / 1 MiB; A8 0 corrupt hits; UCI deep lanes; the default lane spawns no worker. |
| Timed pre-gate | D12 again on a held host, est. 10 min: median played depth at 100 ms on the 20 corpus positions, `Threads N` strictly above `Threads 1`. It read MISS on 2026-11-02. **A second MISS stops G before any game.** |
| Graded read and bar | 100 games, one build, `Threads N` against `Threads 1` at 100 ms, `--concurrency 1`, **GAIN ≥ 50.0**, labelled "hardware gain, N CPU against 1 CPU, this host". Reported in wall time and core-seconds, never pooled with a `Threads 1` read and never added to the closing read. S′ and the Levels lane at `Threads 1`. |
| Wall (est.) | untimed 0.6 h; held 1.3 h → **1.9 h** |
| On a miss | NOT MET, final. No diagnostic and no re-read. |

### Group H: program features (ordinary tests, no games; each member only on the owner's word to re-open, Q4)

| | |
|---|---|
| Members | `ABC-038` (tab completion); `ABC-219` (CLI tournament level); `ABC-211` (deeper English book lines). |
| Branch | No code. New builds from their pages. |
| Tests | lint, typecheck, build; the default lane with one worker; `CLI_DEEP`; `INPUT_DEEP` (`038`); the book rows and `NFR-006` size (`211`); `G5`, `G9`; `G4` identity. A `G8` read only if default-lane rows are added (held host, est. 10 min). |
| Graded read and bar | **None. 0 games.** `211`'s A5 game row is struck by "no games". If `211` is in, it merges before any group's game read (step 0). |
| Wall (est.) | untimed 0.4 h; held 0.2 h → **0.6 h** |
| On a miss | A red test is a defect: fixed and run again. There is no graded read to re-play. |

### Order (QE § Order across groups)

| step | group | read against |
|---|---|---|
| 0 | H | `main` (tests only) |
| 1 | A | `main` |
| 2 | B | `main` + passed |
| 3 | C | `main` + passed |
| 4 | D | `main` + passed |
| 5 | E (only on the owner's word, Q2) | `main` + passed |
| 6 | F | `main` + passed |
| 7 | G | same build, `Threads N` against `Threads 1` |
| 8 | closing read | R2, X = 1 902.5 ± 49.1 |

`ABC-287` joins C only if E passes before C starts. That reorder is the Orchestrator's choice, if the owner answers Q2 first.

### The closing read (QE § The closing read)

- On `main` after the last group, in R2's shape: `r <main-sha> <out> --elo 1810 --budget-ms 100 --rounds 100 --concurrency 1`, with
  the pins and the depth guard. 200 games at `Threads 1`.
- **Reported:** X ± Y against R2's **1 902.5 ± 49.1**. The combined difference is about ± 68, so the read sees only large moves.
- **Pre-registered:** "not seen worse" if X ≥ 1 902.5 (the point estimate). The interval is reported and not graded. A miss starts
  C3″'s rule: BA/PM lists the suspects and the Orchestrator rules. No revert is automatic.
- **Cost:** 0.60 h (measured, R2). A band step (score outside 25–75 %) is a second 200 games, +0.6 h, asked unless pre-approved.
- **If no group merged,** `main` is still R2's build, and no closing read is owed.

### Totals (all estimates; QE § Totals)

| | A | B | C | D | E | F | G | H | close | **total** |
|---|---|---|---|---|---|---|---|---|---|---|
| untimed, lock only (h) | 0.4 | 0.6 | 0.8 | 1.0 | 1.2 | 0.9 | 0.6 | 0.4 | — | **5.9** |
| held host (h) | 0.5 | 1.1 | 1.1 | 1.1 | 1.1 | 1.1 | 1.3 | 0.2 | 0.7 | **8.2** |
| graded games | 0 | 100 | 100 | 100 | 100 | 100 | 100 | 0 | 200 | **800** (+60 S′) |

- **About 14.1 h of host time**, in about 30 windows, each under 1 h. The longest is est. 45 min.
- **Up to about 19 h:** the four allowed re-reads (B, C, D, F) add about 4.4 h and 400 games, and a closing band step adds 0.6 h.
- **Not counted:** SE build and re-port time, and the Architect's ADRs and probe design (`UNKNOWN - verify`).
- **Cheaper if the gates stop early:** F with every premise struck, G with a D12 MISS, and E without the owner's word each save their
  held hours.

## Member lists, checked against the dropped pages

BA/PM read the front matter and the dated lines of every page with `status: dropped` at `782c6cda`. There are 42. Each sits in exactly
one of A to J, or is `ABC-298`, which the owner left out. **No dropped page is missing from the lists, and no list names a page that is
not dropped. No member changed.**

| group | Orchestrator (`…092956f8`) | QE (`…720e934d`) | pages say | confirmed |
|---|---|---|---|---|
| A | 250, 251, 252, 253; 298 left out | same | `250` closed not merged by routing; `251` narrowed to O1-c, then closed "nothing to cut", and its full form needs `250`; `252` dropped because `250` did not merge; `253` "nothing to cut", re-opened only on a fresh profile at ≥ 5 % on two boards; `298` NOT MET, SG3 F4 | yes |
| B | 209/257, 237, 238, 258 | 257 (209 and 238 fold in), 237, 258 | `209` superseded by `257`; `257`'s title carries `238`'s cutoffs; `238` closed unmerged on `ADR-0058` F4; `237`, `258` parked by the owner (B), then closed won't-do | yes |
| C | 264, 284, 285, 287, 289 | same, 287 conditional | `287`'s title: "re-measured only when a tuned table is on main" | yes |
| D | 210, 296, 297 | one of 210 / 296, plus 297 | `210` and `296` extend the same moves | yes |
| E | 205/290, 207/306, 291, 292, 308, 293, with 239/301 | 290, 306, 291, 292, 308, 293; 239/301 the method only | `205` and `207` stay dropped, re-tried as `290` and `306`; `239` and `301` closed NOT MET (first and second pull); `292` NOT MET at its probe | yes |
| F | 272, 294 | same | both closed won't-do | yes |
| G | 266 | 266 | `266` parked ("park threads"), then closed won't-do | yes, with note 1 |
| H | 038, 219, 211 | same | `038` "R4: drop it"; `219` retired, its core moved into `ABC-220`; `211` closed on pick O0 with no source reaching 3...b6 | yes |
| I | readings | 074, 218, 256, 299 | `074` a spike on non-M3 hardware; `218` closed by the owner, "no need to measure it"; `256` superseded by `ADR-0056` C3″; `299` R3 | **excluded** |
| J | process | 052, 060, 108, 111 | records and lane-process items: the traceability `Status` column, `EPIC-006` criteria wording, and two `NFR-008` measurement items | **excluded** |

**Note 1, `ABC-267`.** Its status is `done`, not `dropped`: it was *"folded into ABC-266 (merged into it; not delivered on its own)"*.
Its rows ride inside `ABC-266`'s A3, A5 and A8, so it is not a member of its own. `ABC-231` and `ABC-232` are folded into `ABC-269`,
which is on `main`. They are not dropped work and belong to no group.

**Note 2, why I and J are excluded.** A reading changes no code, so it has nothing to merge or test. The programme's one reading is the
closing read, which takes R3's place. The 40/15 readings are runs over 1 h and have not been asked for. J's items have no product
behaviour, and no game or lane read can judge them. (QE § Groups I and J.)

## Out of scope

- Any run, build, test, game or timing before the owner's word (`…092956f8`).
- `ABC-298` (the owner). Groups I and J. Any member not in the lists above.
- B-T8 (2 × 200 games against Stockfish, about 5 h), unless the owner says otherwise (Q2).
- SPRT, extending any read past 100 games, pooling windows, and re-playing a miss.
- The per-group child tickets themselves, which are cut later (§ Child tickets). Any ADR, which is the Architect's.
- A 40/15 reading.

## Acceptance criteria

The programme's criteria. Each group's own bar is in its table above and is carried word for word onto its child ticket.

- **A1 (nothing before the word).** Given this ticket is held, when any group's child ticket is cut, then the owner has answered Q1–Q5
  in a recorded note. 0 test, build or game runs exist for this programme dated before that note.
- **A2 (one graded read per group).** Given a group's untimed gates are all green, when its graded read runs, then the read is one C2′
  of 100 games (S2 with 0 games for A; tests only for H). It is graded against the bar in that group's table, and the verdict is MET or
  NOT MET in a sealed QE note.
- **A3 (gates before games).** Given a group, when its first game or timing row runs, then every untimed gate in its table is green at
  that commit. 0 games run on a red gate.
- **A4 (freeze first).** Given a group's build is dispatched, when `git merge-base --is-ancestor <freeze-commit> <dispatch-commit>` is
  run, then it exits 0.
- **A5 (windows).** Given a held-host window, then W was asked of the owner for it, `ps` was checked first, it lasted under 1 h, and it
  served one group only.
- **A6 (miss rule).** Given a NOT MET, then a `failed-attempt` note exists and the same read is never re-played. At most one re-read
  follows, only where the group's table says yes and only if it was pre-registered before the first graded game. A and G have none. E's
  miss is final for the whole group.
- **A7 (base).** Given a group misses, then no later group's merge-base contains its branch.
- **A8 (closing read).** Given at least one group merged, when the last group closes, then one closing read of 200 games at `Threads 1`
  in R2's shape is reported as X ± Y against 1 902.5 ± 49.1, with "not seen worse" if X ≥ 1 902.5. Given no group merged, then no
  closing read runs.
- **A9 (cost).** Given the programme closes, then its held-host hours and graded games are reported against the estimates of 8.2 h and
  800 games (+60 S′), with each overrun named.

## NFR triggers

- `NFR-008` / `G8`: default lane wall ≤ 10 s, read on a held host for each group that adds default-lane rows (QE: last MET 9.085 s).
- `NFR-009` / `G7`: ≤ 16 MiB, growth ≤ 1 MiB over a 40-move game (B, G).
- `NFR-005` / `G6`: ≥ base (A; the T2 window of B to F).
- Programme time: each window < 1 h. The whole programme is asked once (Q5).

## Test notes

1. The instruments are by reference: C2′ and CF1–CF10 (`ADR-0056`), S′, the Levels lane, S2 under `ADR-0055` D3-V2, the R shape
   (`ABC-273`, `ABC-295`), `NFR-008`, and the `*_DEEP` lanes (`AGENTS.md` § Commands). QE § Instruments gives each one's cost.
2. The default lane runs with **one vitest worker**, spelled out in each PREREG. Plain `npm test` runs two.
3. Each child ticket carries its group's table, its PREREG, and the pre-registered diagnostic and re-read (rule 6).

## Size and priority

- **XL** (a programme): about 14.1 h host, up to about 19 h, plus SE and Architect time not estimated (`UNKNOWN - verify`). Each child
  ticket is sized when it is cut.
- **P2:** the owner asked for it. Nothing else waits on it.

## Dependencies

- The owner's answers to Q1–Q5 and his word to start (`…092956f8`).
- The Architect's items in § What the Architect owes, each before its group.
- The SE re-ports and new builds, per group.
- QE's freeze and PREREG for each group, before its build.

## Child tickets

**The per-group child tickets are cut later, when a group is picked, and none is cut now.** Each child carries its group's table from
this page, names `ABC-310` as its parent, and is scored on the Definition of Ready on its own. This page never goes to development.

## Owner questions (the Orchestrator takes them to the owner; QE recommends, he decides)

1. **The 400-game rule.** QE reads it as 100 games per group (each group one change), plus the closing 200 inside the 400 per-epic
   allowance. **QE's default:** that reading. If he meant 400 games in all, only the closing 200 and two group reads fit, and QE would
   pick **C and D** (both GAIN, both visible at 100 ms, and neither needs a new owner rule).
2. **Does E run?** It needs four yeses: (a) a third tuning pull (his 2026-11-05 WAIT; a third miss closes tuning); (b) `ABC-291` back in a
   bundle (2026-11-08: never in a bundle at the same numbers; d11 (d)); (c) lifting the hand-valued stop of 2026-11-08 for `290`, `293`
   and `308`, as structure with fitted values; (d) the closing read in place of B-T8's ~5 h. **QE's default:** without all four, E is out.
3. **G.** (a) Several cores inside one game: he allowed it for threads on 2026-11-02 ("2 a"), but his one-core rule came later, so he
   confirms. (b) N: 12, as the page pre-registers, or the four fast cores, as the Architect's re-proposal named. (c) `ADR-0062`'s
   acceptance. **QE's default:** G does not run until he answers. On N, QE states no preference; N is fixed before the PREREG.
4. **H.** Re-opening `ABC-038` (he dropped it), `ABC-219` (retired) and `ABC-211` (needs a new book source; his pick O0 stands). **QE's
   default:** each one only on his word to re-open, so with no word H is empty.
5. **The programme's hours:** about 14.1 h (about 19 h worst case) over about 30 windows, asked once as a programme before step 0. W is
   still asked for each window. **QE's default:** nothing runs until this is approved.

## What the Architect owes (not the owner)

- **D's one form:** `ABC-296` (X1) or `ABC-210`, named before D's branch forms (QE recommends X1).
- **The owed ADRs**, each before its group's child ticket reaches Ready: `ABC-284` (a new named premise and its probe, `ADR-0060`);
  `ABC-285` (the `ADR-0050` amendment); `ABC-296`; `ABC-297`; `ABC-272`/`ABC-294`; and E's structure.

## Definition of Ready

**BA/PM, 2026-11-09, at `main` `782c6cda`. Result: 8 of 10. Backlog, held.**

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ the owner's words; 42 dropped pages, branches 43 to 2 449 behind |
| 2 | scope and out-of-scope | ✅ A–H by table, I and J and `298` out, the closing read |
| 3 | INVEST | ❌ **not small:** XL, a programme by design. The split is named (one child per group, cut when picked). Estimable only in host time, since SE time is `UNKNOWN - verify` |
| 4 | testable, measurable acceptance | ✅ A1–A9; one numbered bar per group. D's X2-only bar and F's NEUTRAL figures are fixed on their children before Ready |
| 5 | dependencies known | ✅ owner Q1–Q5; the Architect's items; SE; QE freezes |
| 6 | NFR triggers with targets | ✅ `G8` ≤ 10 s; `G7` 16 MiB / 1 MiB; `G6` ≥ base; windows < 1 h |
| 7 | test notes | ✅ 1–3 |
| 8 | size | ✅ XL |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ **held:** "No test, build or game runs until the owner's word" (`…092956f8`); Q1–Q5 unanswered |
