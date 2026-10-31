---
id: EPIC-009
title: "`skytalix` plays a 40/15 tournament clock: two settings, `simple-tournament` and `uci-clock-mode`, that use the clock and never lose on time"
status: backlog
column: Backlog
priority: P2
size: M
owner: BA/PM
---

# EPIC-009: `skytalix` plays a 40/15 tournament clock, uses it, and never loses on time

> **MILESTONE 1 DONE 2026-10-31, graded by BA/PM** (task `bapm-ABC-222-epic009-m1`, records only, at `main`
> `4bd9ac6a`). **`ABC-222` is Done.** It merged at `ae7211c3` on QE's PASS (`qe-ABC-222` `…cc542c76`, which signs UAT).
> With `ABC-220` (Done, `ec1e835b`), milestone 1 is complete: `simple-tournament` is built and has been read in real
> games.
>
> **The grade: milestone 1 MEETS M1–M4.** M1 and M2 are graded for `simple-tournament`. `uci-clock-mode`'s half of M1 and
> M2 is milestone 2's, at `ABC-223`.
>
> | # | measure | target | read | grade | source |
> |---|---|---|---|---|---|
> | M1 | never loses on time | 0 losses on time; closest call ≥ 500 ms | 0 losses in 5 games, 10 side-periods; closest call **19 991 ms** (`ADR-0052` D3's 20 000, less 9) | **MET** | `ABC-222` A3; `qe-ABC-222` `…00cc4db1` |
> | M2 | uses the clock | ≥ 75 % per completed period, per side, book moves included | least **88.00 %** over 10 side-periods (the most is 97.78 %) | **MET** | `ABC-222` A4 |
> | M3 | levels unchanged | `LEVELS[1..7]` and `DEFAULT_LEVEL` byte-identical to base; `Skill Level` default 5; `G` row for row equal to base | 0 differences in 4 200 rows against base, at `ABC-220`'s build. `ABC-222` changed no code | **MET** (at the build) | `ABC-220` A8; `qe-ABC-220` `…7a09c5e1` |
> | M4 | owner's decisions stayed his | 0 NFR bounds moved without his word; ADR text reported; T told | 22 s and 22 s are his (OQ-0052-1, `…3dd61448`). The whole-second reading is his (`…f4673b9f`). `ADR-0052` was accepted by him. Security/NFR's gates record no bound moved beyond his word (`secnfr-ABC-220`, `secnfr-catalog-rebase`). `ABC-222` moved nothing | **MET** | the owner-word notes; `plans/nfr-catalog.md` header lines of 2026-10-30 |
> | ceiling | the longest move | ≤ 22 s to the whole second (< 22 500 ms) | **22 002 ms** (+2 ms); no PGN time above `22s` | **MET** | `ABC-222` A5 |
>
> - **What the grade does not say.** Five games show it works. They do not bound a forfeit rate; that is the later
>   major validation (§ Out of scope). M2 was summed from the `go` clock deltas, which are exact ms. The PGN prints
>   ≥ 10 s to whole seconds, and the two agree on all 561 searched moves (QE-222-f).
> - **M3 and `ABC-228`.** Level 5 and `DEFAULT_BUDGET_MS` moved 3 000 → 4 000 ms at `ABC-228`. That was `EPIC-010`,
>   on the owner's word (OQ-228-1 (ii), `ADR-0053` d10), and not a milestone 1 build (§ How today's engine handles
>   time, dated line). M3 is read per build ticket against its own base, and `ABC-220`'s A8 read it there.
> - **Risks, as read:**
>   - **`RISK-EPIC009-01`:** read in play. The closest call is 19 991 ms, and the per-move overhead max is +2 ms against
>     the ~487 ms average slack. It stays open for `uci-clock-mode` (`ABC-223`), whose margin is about 1 s.
>   - **`RISK-EPIC009-02`: not exercised** (QE-222-d). cutechess 1.5.1 sent 0 `isready` during a search; it pings
>     before each `go`. `AR-UCI-BUSY` still covers a GUI that pings mid-search.
>   - **`RISK-EPIC009-03`: not exercised** (QE-222-e). 574 of 574 `go` lines carried `movestogo`. The no-`movestogo`
>     branch of C stays covered by `ABC-220`'s virtual-clock rows only.
>   - **`RISK-EPIC009-04`:** 3.44 h for 5 games, inside the ≤ ~5 h estimate. The Tctl median was 73.9 °C, the max
>     76.1 °C, and the frequency fell by ≤ 0.01 %.
> - **For Security/NFR (no catalog edit on this hop):** `AR-NFR004-A` at 22 s, through the real pipe and cutechess's
>   timer, reads max **+2 ms** over 561 searches, with a median of 0 ms (QE-222-b). The risk stands with its number.
>   That is the "next reading at 22 s" its gate named. Placing it in `plans/nfr-catalog.md` is Security/NFR's.
> - **Milestone 2 (`ABC-221` then `ABC-223`):**
>   - **`ABC-221`: Ready, DoR 10/10, P3.** Both of its pull-order lines are met: after `ABC-222` (Done, `ae7211c3`)
>     and after `ABC-244` (Done, `24b22339`). It is pullable now.
>     - It shares `src/uci-session.test.ts` with `ABC-243` (In Development, `se-ABC-243`) and with `ABC-242` (Ready).
>       That is rebase order only, not a design wait.
>     - The board's order stands: `ABC-243` → `ABC-242` → `ABC-221`. The order is the Orchestrator's.
>   - **`ABC-223`: Backlog, DoR 9/10**, waiting on `ABC-221`'s merge.
>     - Its "play all 10 games" trigger (`ABC-222`'s overhead max over 300 ms) **does not fire**: the max was +2 ms. So it
>       plays 5 games, plus the coverage extension.
>     - Its A5 and A6 read ms from the `go` clock deltas, as `ABC-222`'s PREREG did (dated line on its page).
>     - It runs ALONE: ≤ ~5 h by its own bound, and `ABC-222`'s 5 games took 3.44 h.
>   - **The epic stays open** until `ABC-223` reads. The board's column is the Orchestrator's.
> - The notes are in `.grugops/context/bapm-ABC-222-epic009-m1/notes/`.

> **CONFIRMED 2026-10-30 by the owner, folded by BA/PM** (task `bapm-ABC-242-225-owner`, records only). His words on
> this item, verbatim (`orch-2026-10-30a` `…f4673b9f`): *"Whole-second reading of "≤ 22 s" - confirm"*. The first
> half of that message, the catalog's reference machine, is Security/NFR's.
>
> - **The whole-second reading is confirmed:** in `simple-tournament`, "≤ 22 s" means < 22 500 ms on the wall. The
>   last open owner item on this epic is **closed** (§ Owner questions; the MILESTONE 1 and FOLDED blocks below).
> - **Nothing moves:**
>   - T = the ceiling = 22 000 ms.
>   - `ABC-220`'s A11 stands as read.
>   - `ABC-222`'s PREREG reads A5 against < 22 500 ms.
>   - `ABC-221`'s "≤ 60 s" is read exactly (59 500 + ~31 + 100 < 60 000), so it does not use this reading and its
>     page is unchanged.
> - **The catalog's reference machine** is re-based to the Linux host named by the owner. That is Security/NFR's
>   hop (`secnfr-catalog-rebase`), not this page's.

> **MILESTONE 1, HALF DONE, 2026-10-30, folded by BA/PM** (task `bapm-ABC-220-merge-fold`, records only, at `main`
> `4ac4f3bb`). **`ABC-220` is Done:** merged at `ec1e835b` on QE's PASS_WITH_GAPS (`qe-ABC-220` `…7a09c5e1`, which
> signs UAT) and Security/NFR's PASS_WITH_RISKS (`secnfr-ABC-220`). `simple-tournament` is on `main`.
>
> - **What `ABC-220` read** (virtual clock unless named):
>   - 22 000 on every capped branch; 18 760 ms left after a period's move 40, 97.9 % used (83.2 % with 6 book moves);
>   - ≥ 1 069 ms left at `tc=40/60`;
>   - levels 1–7 identical to base in 4 200 rows (M3 MET at the build);
>   - on the real clock, one search at T took ≤ 22 001.0 ms of wall (+1.0 ms), and a busy `readyok` came 0.38 ms
>     after `bestmove`.
>
>   M1 and M2 are not read yet: that is `ABC-222`.
> - **`NFR-004`** carries "; 22 s in UCI `TimeMode` `simple-tournament` (budget 22 s)". `AR-NFR004-A` stands at 22 s.
>   `AR-UCI-BUSY` (busy `isready`/`stop`, ≤ 22 s read to the whole second, ≤ 60 s in `uci-clock-mode`) is placed beside
>   `NFR-011`.
> - **`ADR-0044` folds:** D3, D4 (new D4.5), D5 and D11 carry dated lines for `simple-tournament`. The
>   `uci-clock-mode` halves wait for `ABC-221`'s merge.
> - **`ABC-222` is now pullable: DoR 10/10, Ready.** It closes milestone 1. It runs ALONE on an idle host (≤ ~5 h).
> - **`ABC-221`: DoR 10/10, Ready**, pulled after `ABC-222` (owner: "later"). It gains A12 (QE-220-a: the side to move's
>   own increment, four rows), test note 5 (`SEC-220-b`: a comment) and A11 re-worded to A14a + A14b.
> - **`ABC-223`: unchanged**, 9/10, waits on `ABC-221`.
> - **Still open with the owner, blocks nothing:** the whole-second reading of the 22 s ceiling (§ Owner questions).
>   *(**Confirmed by the owner 2026-10-30**, `…f4673b9f`; see the CONFIRMED block above.)*
> - The notes are in `.grugops/context/bapm-ABC-220-merge-fold/notes/`.

> **FOLDED 2026-10-30 by BA/PM** (task `bapm-owner-adr-fold`, records only, at `main` `a046e839`). The owner
> **accepted `ADR-0052` with one amendment** (`orch-2026-10-29g` `…3dd61448`, verbatim): *"accept, but change 22.5s to
> 22s for simplicity and compatibility, ceiling also at 22s, no need to implement fraction of a second ceiling or time
> per move if it is not supported by current solution"*. OQ-0052-1 is closed. The ADR text is the Architect's hop
> (`arch-adr-accept-0052-0053-0054`); where it differs from this page, the ADR rules.
>
> - **`simple-tournament`: T = 22 s, and its hard ceiling is 22 s too** (was T 22.0 s under 22.5 s). Whole seconds;
>   nothing sub-second. `uci-clock-mode` (59.5 s under 60 s, the clamp to 60 s at `ABC-221`) is accepted as written.
> - **The margin and clock-use arithmetic holds unchanged**, because T did not move: 40 × 22 s = 880 s of 900 s
>   (97.8 %; 97.9 % at δ = 31 ms), 18 760 ms left after move 40, and M1's ≥ 500 ms survives δ ≤ 487 ms a move.
>   83.1 % with 6 book moves.
> - **How a 22 s ceiling equal to T is read** (BA/PM's reading on his "whole seconds"; the Orchestrator confirms it with
>   him, it changes no code; *confirmed by the owner 2026-10-30, `…f4673b9f`*): no `go` hands the search more than 22 000 ms, read exactly on the virtual clock (`ABC-220`
>   A6). A real move's wall carries the stop overshoot (`AR-NFR004-A`, ≤ ~31 ms) and the pipe on top, so it is read to
>   the whole second: ≤ 22 s means a wall < 22 500 ms (`ABC-220` A11, `ABC-222` A5).
> - **`ABC-220`: DoR 10/10, Ready.** `ABC-222`: 9/10, waits on `ABC-220`. `ABC-221` and `ABC-223`: their pages are
>   unchanged on this hop.
> - The notes are in `.grugops/context/bapm-owner-adr-fold/notes/`.

> **RECONCILED 2026-10-29 to `ADR-0052` (PROPOSED) by BA/PM** (task `bapm-owner-words-b`, records only, at `main`
> `4dcb353e`). The Architect's ruling landed (`arch-epic009-settings` `…fa9e821e`, `…04fdc439`, `…3b11f12e`). This page
> and `ABC-220`..`ABC-223` now follow it, as proposed:
>
> - **Form:** one UCI `combo`, `TimeMode` (`level` default, `simple-tournament`, and `uci-clock-mode` from `ABC-221`'s
>   build on), beside `Skill Level`, which is unchanged. cutechess lines: `option.TimeMode=simple-tournament` and
>   `option.TimeMode=uci-clock-mode`. Nothing in the CLI.
> - **`simple-tournament`:** T = 22 000 ms under the 22 500 ms ceiling. With a clock its budget is **`min(T, C)`**, not
>   `min(G, T)`. C is one safe clock share: `max(1, min((t − 1 000 − m × 100) / m + inc, t − 1 100))`, with m =
>   `movestogo` or 20. At 40/15, T binds on all 40 moves.
> - **`uci-clock-mode`:** `min(59 500, C)` with a clock, `min(x, 59 500)` on `movetime`, and T with no time token.
>   **Budget 59.5 s under a 60 s ceiling.** `HARD_CEILING_MS` moves 32 000 → 60 000 at that ticket only, and levels
>   1–7 stay value-identical.
> - **Latency:** `isready`/`stop` mid-search are answered ≤ one budget late (≤ 22.5 s, ≤ 60 s). This is accepted
>   with no worker. Two test rows and an accepted-risk entry beside `NFR-011` are owed (`ABC-220` A13, A14).
> - **Smoke size:** 5 games kept for `ABC-222` and `ABC-223`, extended up to the owner's 10 only to reach 4 completed
>   side-periods (`ABC-222`'s header gives the reason).
> - **Every build ticket's wait is now "the owner accepts `ADR-0052` (OQ-0052-1)".** `ABC-221` also needs `ABC-220`'s
>   code. Columns and DoR scores are unchanged (all Backlog, 9/10).
>
> **AMENDED 2026-10-29 by BA/PM** (task `bapm-amend-epic009`, records only, at `main` `a5d70e35`; `src/`, `data/`
> and `tools/` are byte-identical to `51c85f49`). The owner answered Q1–Q8 and closed `ABC-218` on 2026-10-29
> (`orch-2026-10-29g` `…a67f71ac`, his words verbatim; they govern). This page now follows those answers.
>
> - **Accepted.** The owner accepted the epic and its measures (Q8: "ok"). Status `proposed` → `backlog`.
> - **Two new settings, not levels:** `simple-tournament` (a fixed T a move under a 22.5 s hard ceiling, milestone 1)
>   and `uci-clock-mode` (the real clock, a margin, a hard stop and a 60 s ceiling, milestone 2, later). The owner
>   picked option (a) first and option (b) later (Q2).
> - **Levels 1–7 are unchanged.** So are the default (5) and the `Skill Level` default (5). Owner: "Let the difficulty
>   setting stay."
> - **UCI is the surface** (Q1: cutechess matches). CLI parity is out of scope (§ CLI parity).
> - **Proposed T for `simple-tournament` is 22.0 s**, under the 22.5 s ceiling (§ The budget T). The owner is told
>   the number; the ceiling is his and does not move.
> - **Readings:** each setting gets a 5-game smoke reading at 40/15. Major validation (≥ 100 games, 24–48 h) and any
>   strength reading come later and are out of this MVP.
> - **The input form for both settings is the Architect's** (`arch-epic009-settings`, running in parallel; no note had
>   landed when this page was amended). Every row below reads "form per the Architect's ruling" where it needs one.
> - **Tickets:** `ABC-218` closed by the owner, not run. `ABC-219` retired. `ABC-220` re-scoped to
>   `simple-tournament`. `ABC-221` re-scoped to `uci-clock-mode`. `ABC-222` re-scoped to `simple-tournament`'s smoke
>   reading. `ABC-223` is new: `uci-clock-mode`'s smoke reading. `ABC-224` is unused.
> - The notes are in `.grugops/context/bapm-amend-epic009/notes/`.
>
> **Cut 2026-10-29 by BA/PM** (task `bapm-epic009-tournament`, records only, at `main` `51c85f49`). The cut's notes
> are in `.grugops/context/bapm-epic009-tournament/notes/`.
>
> **Owner word that started it** (`ideas-2026-10-29/input/owner-ideas.md` § A, transcribed by the Orchestrator): *"add
> new difficulty to allow 40/15 move rule of tournaments: https://computerchess.org.uk/4040/index.html , basic
> solution would be to use 22.5 seconds per move, currently difficulty level 7 allows 30s per move. New difficulty
> could be named "tournament" or 40-15"*. § B item 4 of the same file (real clock management) came from an external
> chat model and is **UNKNOWN - verify** as a claim. The owner now asks for a clock mode himself (Q2, Q3), so it is
> built from his word and the System Analyst's map, not from § B.
>
> **Owner's answers, 2026-10-29, verbatim** (`…a67f71ac`): *"Close ABC-218 - no need to measure it, it is not
> deterministic and we can't anyway use it for tournament. Let the difficulty setting stay. My answers: 1. cutechess
> matches. For simpler tests use much less matches, 5 or 10, just to make sure things work, major validation with 100
> or more games comes later since it can run over 24 or 48 hours. 2. Initially let's add 22.5 second separate
> difficulty setting and use that, later UCI clock mode ; 3. it might make sense to use 2 new difficulty settings
> then, 22.5s one could be simple-tournament and other one uci-clock-mode (maybe separate inputs) ; 4. 22.5 ceiling ;
> 5. increase to 60s ; 6. not yet, let's do that after other improvements are done ; 7. no ; 8. ok"*

## How today's engine handles time (System Analyst `sa-ideas-verify` `…1ccf0010`, confirmed against BA/PM's reading)

> **Dated line 2026-10-30 by BA/PM** (task `bapm-ABC-228-merge-fold`, records only, at `main` `e42b637b`). `ABC-228`
> merged under OQ-228-1 (ii) (`ADR-0053` d10): level 5 and `DEFAULT_BUDGET_MS` play **4 000 ms**. This section was read
> at 3 000 ms and stays as read. From this merge, T1's and T4's default reads 4 000 ms, P2's `go` would spend 4 000 ms,
> and the 40/15 share row for `Skill Level` 5 reads 160 s, 18 % (82 % of the clock unused). This is arithmetic, not a
> measurement. **No reading of this epic plays level 5 at its fixed budget.** `ABC-220` and `ABC-221` `A8` compare head
> with base at the same `LEVELS`. `ABC-222` and `ABC-223` play the named modes. So no acceptance row moves.

The source is the System Analyst's time-behaviour note, `sa-ideas-verify` `…1ccf0010` (2026-10-29 19:58Z, read at
`main` `51c85f49`; committed on `grugops/sa-ideas-verify` @ `c28054cc`, not yet merged when this page was cut). BA/PM
read the same code independently before it landed, and the two readings agree on every row below. Where they differ in detail, the SA's note wins. The SA's probes P1–P5 are
single searches, not games: at `Skill Level` 7, `go wtime 900000 btime 900000 movestogo 40` spent **22 500 ms**
(P1); at level 5 the same `go` spent 3 000 ms (P2); `movestogo 1` with 2 000 ms left spent 1 951 ms (P4).

| # | fact | where |
|---|---|---|
| T1 | A level is a per-move budget plus a blunder rate. Level 7 is 30 000 ms, rate 0. The default is 5 (3 000 ms) | `src/levels.ts:49-60` |
| T2 | The CLI (`npm run chess -- --difficulty 1..7`) has **no game clock** for either side. The engine thinks its level's budget each move; the human has unlimited time. The PGN's `Difficulty` tag carries the ordinal | `src/cli.ts:113`, `:214`, `src/pgn.ts:86` |
| T3 | The UCI session already reads `wtime`/`btime`/`winc`/`binc`/`movestogo`. Its budget is `G = max(1, min(time / (movestogo ?? 20) + inc / 2, time − 50 ms))` | `src/uci-session.ts:67-69`, `:217-225` |
| T4 | **`G` is then capped at the `Skill Level`'s budget**: `min(G, LEVELS[skill].budgetMs)`. The default `Skill Level` is 5, so 3 000 ms | `src/uci-session.ts:285-287`, `:359` |
| T5 | The engine clamps every search at `HARD_CEILING_MS` = 32 000 ms and checks the clock every 1 024 nodes. The overshoot past the deadline was measured at ≤ ~31 ms (`AR-NFR004-A`; 30 004 ms at level 7, QE `qe-ABC-212` `A4`) | `src/engine.ts:44-55`, `:141`, `:151`; `plans/nfr-catalog.md` `NFR-004` |
| T6 | One thread: `isready` and `stop` during a search are answered up to one budget late (`ADR-0044` D5, accepted with no worker) | `src/uci-session.ts:14-19` |
| T7 | A book move answers at once, with no search, so it costs ~0 s of clock | `src/uci-session.ts:289-294` |
| T8 | The engine spends its whole budget even with one legal move (`ABC-212` OQ-212-2, ruled "spends 30 s"; SA probe P5: one legal move, 1 000 ms spent) | `ABC-212` § "Up to 30 s"; SA § 4 |

**What follows from T3–T4 under a 40/15 clock** (arithmetic, not a measurement; `UNKNOWN - verify`; `ABC-218`, which
was to read it, was closed by the owner, not run), at the first move of a period (900 000 ms left, `movestogo` 40,
so `G` = 22 500 ms):

| `Skill Level` | per-move budget | engine time over 40 moves (upper bound) | share of the 15 min |
|---|---|---|---|
| 1–4 | 100–1 000 ms | 4–40 s | ≤ 4 % |
| 5 (default) | 3 000 ms | 120 s | 13 % |
| 6 | 5 000 ms | 200 s | 22 % |
| 7 | 22 500 ms (the clock's share; the 30 s cap does not bind) | ≤ 900 s | ≤ 100 % |

- **So a GUI that sends a 40/15 clock with `movestogo` already gets about 22.5 s a move at `Skill Level` 7 today**,
  the owner's "basic solution", without a new level. At the default `Skill Level` 5 it gets 3 s and leaves 87 % of the
  clock unused. That is the pain a GUI user sees.
- **The margin is thin at a period's last move.** With `movestogo` 1, `G` = remaining − 50 ms. The in-process
  overshoot is ≤ ~31 ms (T5), and the pipe and GUI latency is `UNKNOWN - verify`. A loss on time is possible there.
- **Book moves bank time** (T7), so later moves in a period get a little more than 22.5 s, up to level 7's 30 s.
- If the GUI does **not** send `movestogo`, the session spreads the clock over 20 moves (T3). It cannot run the clock
  below 50 ms by arithmetic, but it spends unevenly. Which GUIs send it for a repeating control is `UNKNOWN - verify`.
  *(2026-10-31: `cutechess-cli` 1.5.1 sends it on every `go`, 574 of 574 in `qe-ABC-222`. Other GUIs remain
  `UNKNOWN - verify`.)*

## What 40/15 means on this page

- **40/15 = 40 moves in 15 minutes, repeating**: after each 40th move the side's clock gains another 15 minutes. No
  increment. In `cutechess-cli` this is `tc=40/900` (spelling `UNKNOWN - verify` against the pinned 1.5.1 at
  `ABC-222` `A1`). *(Confirmed 2026-10-31, `qe-ABC-222`: `tc=40/900` played 40/15. The first `go` reads `go wtime
  900000 btime 900000 movestogo 40`, and `-maxmoves` counts full moves.)*
- **A fixed 22.5 s a move is exactly 900 s over 40 moves**, so it has **zero margin** on a real clock. On a clock, any
  fixed budget needs to be below 22.5 s, or it relies on T3's arithmetic to stop it.
- **CCRL's own rules are not confirmed here** (no web access at this hop). Each item below is **UNKNOWN - verify**, and
  nothing on this page depends on it:
  - whether the CCRL 40/15 time is adjusted to a reference machine, and by how much;
  - whether pondering is on or off;
  - the thread count, hash size, opening book, tablebases and adjudication rules;
  - the GUI it uses, whether that GUI sends `movestogo`, and its time margin before a loss on time;
  - whether the linked page (`/4040/`) describes the 40/15 list or an older 40/40 list.
- **Entering CCRL itself is out of scope** (§ Out of scope). This epic makes `skytalix` able to *play* a 40/15 clock.

## Problem

- **User:** a `cutechess-cli` (or other UCI GUI) match at a CCRL-style 40/15 clock, engine against engine (Q1).
- **Pain.**
  - At the default `Skill Level` 5, a 40/15 clock is 87 % unused: the engine plays 3 s moves (T4).
  - `Skill Level` 7 gets about 22.5 s a move, but nothing names it as the 40/15 setting. Its margin at a period's last
    move is 50 ms (T3), so it can lose on time. Its time per move depends on the clock the GUI sends.
- **Value:** two named settings that a match picks for 40/15. Each uses most of the clock and never loses on time.
  The human-facing levels 1–7 stay as they are.

## The two settings (Q2, Q3)

| | `simple-tournament` (milestone 1) | `uci-clock-mode` (milestone 2, later) |
|---|---|---|
| what it does | Thinks a fixed T each move, blunder rate 0 | Spends the real clock: remaining ÷ `movestogo` (a fallback without it), a safety margin on every move, a hard stop before the flag |
| per-move ceiling (owner's) | **22 s**, hard, equal to T (Q4, amended 2026-10-30; was 22.5 s); read to the whole second on the wall | **60 s** (Q5). The engine's one clamp moves 32 s → 60 s at this build; levels stay value-identical (`ADR-0052` D6) |
| budget | **T = 22 s** (`ADR-0052` D3, accepted 2026-10-30 as amended); with a clock, `min(T, C)` | `min(59.5 s, C)` with a clock; `min(x, 59.5 s)` on `movetime`; T with no time token (`ADR-0052` D4) |
| surface | UCI `TimeMode` combo: `option.TimeMode=simple-tournament` | UCI `TimeMode` combo: `option.TimeMode=uci-clock-mode` |
| build ticket | `ABC-220` | `ABC-221` |
| smoke reading | `ABC-222` | `ABC-223` |

- **Form (`ADR-0052` D1, proposed).** One UCI `combo`, `TimeMode`, beside `Skill Level`. `uci-clock-mode` is offered
  only from its own build on. `Skill Level` stays a `spin` 1–7, byte-identical, so levels 1–7 stay unchanged and
  ordered weakest to strongest (SA `…1ccf0010` § 8). While `TimeMode` is not `level`, `Skill Level` is not read.
- **How `simple-tournament` meets a `go` clock (`ADR-0052` D2, D3):** it does not ignore `wtime`. The clock caps T
  through C, a safe share that keeps 1 s plus 100 ms for each move to go. It does not cap T through D4.1's `G`, whose
  `t − 50` at a period's last move misses M1. At 40/15, C starts at 22 375 ms and grows, so T binds on every move.

## The budget T for `simple-tournament` (Q4 with Q8)

*2026-10-30: the owner moved the ceiling to 22 s, equal to T (§ the FOLDED block at the top). The derivation below is
kept as history: it chose T under the old 22.5 s ceiling. Its margin and clock-use figures still hold, because T is
still 22 000 ms. Its ceiling lines ("Q4 holds when T + 31 ≤ 22 500", the 500 ms headroom, "why not closer to the
ceiling") are superseded. Under a 22 s ceiling, T + 31 ms is over 22 000 ms on the wall, and the owner's whole-second
ceiling reads that as 22 s.*

The owner set a 22.5 s ceiling (Q4) and accepted a closest call ≥ 500 ms (Q8). A fixed 22.5 s a move is exactly
900 s over 40 moves. So 22.5 s cannot meet both, and T must sit below the ceiling. **The ceiling does not move.**

- **Model.** Each move costs the clock `s = T + o`. Here `o` is the per-move overhead:
  - the in-process overshoot past the deadline, ≤ ~31 ms (`AR-NFR004-A`; measured 4 ms at 30 s, `qe-ABC-212` `A4`;
    1 ms at 22.5 s, SA probe P1);
  - the pipe and GUI latency: **`UNKNOWN - verify`**, read by `ABC-222`. *(Read 2026-10-31, `qe-ABC-222`: the
    per-move overhead, overshoot included, has a median of 0 ms and a max of +2 ms over 561 searches.)*
- **The clock left after a period's 40th move** (no book moves): `c = 900 000 − 40 × (T + o)` ms.
- **Q8 holds** when `c ≥ 500`, so `T + o ≤ 22 487.5 ms`.
- **Q4 holds** when `T + 31 ≤ 22 500` (the overshoot bound), so `T ≤ 22 469 ms`.
- **At T = 22 500 ms**, `c` would be −40 × `o`. Today's `go` rule (`G = remaining − 50` on the last move) saves the
  flag, but the closest call is ~50 ms less `o`. That misses Q8. It is the 50 ms the cut found.
- **At T = 22 000 ms (proposed):**
  - `c = 20 000 − 40 × o`. That is 18 760 ms at `o` = 31 ms. Q8 still holds while `o` ≤ 487 ms a move. The unknown
    latency has about 16 × the room of the known overshoot.
  - The headroom under the 22.5 s ceiling is 500 ms a move. That is ≥ 16 × the 31 ms overshoot bound.
  - **M2 holds.** A period with no book moves uses 40 × 22 000 / 900 000 = **97.8 %**. The book stops at ply 12
    (`data/opening-book/book.json` `maxPly`), so at most 6 of a side's first-period moves are free. Then 34 × 22 000 /
    900 000 = **83.1 %**. M2's 75 % fails only if 10 or more moves in a period cost ~0 s. The book cannot cause that.
  - **The cost** against 22.5 s is 0.5 s a move, 2.2 % of the clock.
- **Today's `go` rule never binds at 40/15 with `movestogo`.** With `s < 22 500`, the share `remaining / movestogo`
  stays ≥ 22 500 ms on every move. So a GUI cap gives T on every move. *(2026-10-29: the cap ruled is `ADR-0052`'s C,
  not `G`. C starts at 22 375 ms and grows, with the same result.)*
- **If `cutechess-cli` sends no `movestogo`** (`RISK-EPIC009-03`, `UNKNOWN - verify`), there are two cases.
  - A GUI cap, if ruled, spreads the clock over 20 moves (T3). T binds for the first 21 moves, then `remaining / 20`
    applies. That leaves ~165 s after the 40th move and uses ~81.6 % (no book).
  - With no cap, the result is as above: 18.8 s left and 97.8 % used.
  - So M1 and M2 hold either way.
- **Why not closer to the ceiling.** T = 22 450 ms would leave `c` = 760 ms at `o` = 31 ms. Only 260 ms would remain
  for the unread latency. A smoke reading of 5 games cannot vouch for that.
- **The number the owner is told:** `simple-tournament` thinks **22.0 s a move**, never more than 22.5 s. At 40/15 it
  ends a period with about 18–19 s left, and uses about 98 % of the clock (83 % in the first period when the book plays
  6 moves). The Architect may refine T in the same ADR. If his T differs, the page follows his ruling and the
  owner is told the new number. The numbers above hold for any T ≤ 22 000 ms. *(2026-10-29: `ADR-0052` D3 keeps
  T = 22 000 ms, PROPOSED. Its own arithmetic gives 18 760 ms left and 97.9 %, or 83.2 % with 6 book moves.)*

## CLI parity: out of scope

The call (the Orchestrator's brief asked whether it is worth keeping): **not kept.** CLI parity is neither cheap nor
clean.

- **No user.** Q1 names `cutechess-cli` matches. No one plays the 40/15 setting in the CLI. Q7 ("no" think time in
  the CLI) points the same way.
- **Nothing to honour.** The CLI has no clock (T2). A "tournament" setting there is only a 22 s pace with no flag to
  lose. Level 7 (30 s) already gives a slow CLI opponent.
- **Not cheap.** It is the whole of the retired `ABC-219`, size M:
  - the `Difficulty` union and the ordinal-only, exact-equality lookup in `src/cli-options.ts`;
  - the usage line and the refusal text;
  - the start-up question (`ABC-200`);
  - the PGN `Difficulty` tag and the player name;
  - the test suites `src/cli.test.ts`, `src/startup-questions.test.ts` and `src/render.test.ts`.
- **Not clean.** If the Architect rules a separate UCI option (the owner's "maybe separate inputs"), the CLI would need
  a second input of its own for a mode with no clock to spend. That is two shapes for one setting.
- **If the owner later wants it,** it is a new small ticket on his word. Nothing here blocks it.

## Scope

- `ABC-220`: `simple-tournament` over UCI, at T = 22 s, its hard ceiling also 22 s (owner, 2026-10-30). Milestone 1.
- `ABC-222`: the 5-game smoke reading of `simple-tournament` at 40/15 (up to 10 games, for coverage only). Milestone 1.
- `ABC-221`: `uci-clock-mode` over UCI, with the real clock, a margin, a hard stop and a 60 s ceiling for this mode
  only. Milestone 2, later (Q2).
- `ABC-223`: the 5-game smoke reading of `uci-clock-mode` at 40/15 (up to 10 games, for coverage only). Milestone 2.
- The Architect writes the ADR text: amendments to `ADR-0044` and `ADR-0045`, or a new ADR, status PROPOSED. It covers
  the input form, T, the `go` interaction, the two ceilings and the `NFR-004` lines. The owner accepts or declines it.
  BA/PM does not pre-empt it. *(2026-10-29: written as `ADR-0052`, PROPOSED. Its fold lines into `ADR-0044` D3, D4,
  D5, D11 and `ADR-0045` A3 are BA/PM's, at each build's merge.)* *(2026-10-30: `ADR-0044`'s `simple-tournament`
  lines folded at `ABC-220`'s merge `ec1e835b`. The `uci-clock-mode` lines and `ADR-0045` A3 come at `ABC-221`'s.)*

## Out of scope

- **Changing levels 1–7, the default (5), their budgets or their 32 s clamp.** Gate: `LEVELS[1..7]` and `DEFAULT_LEVEL`
  are byte-identical, and the `Skill Level` default stays 5. *(2026-10-29, `ADR-0052` D6: the one clamp,
  `HARD_CEILING_MS`, moves to 60 000 at `ABC-221` only. Every level budget is ≤ 30 000, so the levels stay
  value-identical, and `ABC-221` A8 reads it row for row.)*
- **CLI parity** (§ CLI parity), and a clock in the CLI.
- **Major validation:** ≥ 100 games at 40/15, 24–48 h (Q1). It comes later, as its own ticket on the owner's word.
- **A strength reading or claim at 40/15** (Q6: "not yet, let's do that after other improvements are done"). No setting
  claims an Elo.
- **Showing think time in the CLI** (Q7: no).
- **Spending more time on a hard move** (a search change). Pondering, threads, and a worker for `isready`/`stop`
  (`ADR-0044` D5 stands).
- **Entering CCRL or any rating list.** That is distribution: `ADR-0049` and the owner's call.
- **`EPIC-010`'s improvements** (`ABC-225..239`).

## Success measures (accepted by the owner, Q8, 2026-10-29)

| # | measure | target | how it is read |
|---|---|---|---|
| M1 | **Never loses on time** | In each setting's smoke reading, `skytalix` loses **0** games on time, and its closest call (the least clock left after any of its moves) is **≥ 500 ms** | `cutechess-cli` 1.5.1, `timemargin=0`, 5 games at `tc=40/900`, up to 10 for coverage (`ABC-222`, `ABC-223`) |
| M2 | **Uses the clock** | Over each completed 40-move period, `skytalix` uses **≥ 75 %** of the 900 s it was given, book moves included, per side | per-move times from the PGN, summed per period |
| M3 | **The human-facing levels are unchanged** | `LEVELS[1..7]` and `DEFAULT_LEVEL` are byte-identical to base. `Skill Level` default is 5. At `Skill Level` 1–7 with neither setting selected, `G` over one simulated 40/15 period equals base, row for row | `git diff`; each build ticket's identity row |
| M4 | **The owner's decisions stayed his** | 0 NFR bounds moved without his word: 22 s (amended from 22.5 s, 2026-10-30) and 60 s are his. Each new ADR text is reported to him when it lands. T is told to him | the ADR pages and the owner-word notes |

- **Each setting's per-move ceiling is read too.** The longest move is ≤ 22 s read to the whole second, that is
  < 22 500 ms (`simple-tournament`, 2026-10-30), or ≤ 60 000 ms plus `AR-NFR004-A`'s ≤ ~31 ms (`uci-clock-mode`).
- **A smoke reading shows that it works, nothing more** (Q1). Five games cannot bound a forfeit rate. That needs the
  later major validation.
- **Strength is not a measure** (Q6). Self-play does not stand in for an outside opponent (`RISK-EPIC008-03`,
  `arch-epic008-rd` `…0c5d62f4`).

## Tickets (order is the pull order; the pages are under `plans/tickets/`)

| order | id | title | size | priority | column | DoR | depends on | waits on |
|---|---|---|---|---|---|---|---|---|
| — | `ABC-218` | Reading: today's `Skill Level` 7 under a 40/15 clock | S | P2 | Done (dropped) | — | — | **closed by the owner 2026-10-29, not run** |
| — | `ABC-219` | A named tournament level in the CLI | M | P2 | Done (dropped) | — | — | **retired 2026-10-29**: CLI parity out of scope; its core moved into `ABC-220` |
| 1 | `ABC-220` | `simple-tournament` over UCI (`TimeMode`): T = 22 s, `min(T, C)` with a clock, never handed more than its 22 s hard ceiling | M | P2 | **Done** (merged `ec1e835b`, 2026-10-30) | 10/10 | `ADR-0052` (ACCEPTED 2026-10-30, amended) | — |
| 2 | `ABC-222` | Smoke reading: `simple-tournament` plays 5 games at 40/15 (≤ 10 for coverage) with 0 losses on time | S | P2 | **Done** (merged `ae7211c3`, 2026-10-31; QE PASS `…cc542c76`) | 10/10 | `ABC-220` merged (met, `ec1e835b`); an idle board | — |
| 3 | `ABC-221` | `uci-clock-mode` over UCI (`TimeMode`): `min(59.5 s, C)`, a 60 s ceiling, the clamp to 60 s | M | P3 | **Ready** (2026-10-30) | **10/10** | `ADR-0052` (ACCEPTED 2026-10-30; D4/D6 as written); `ABC-220`'s C and `TimeMode` (met, `ec1e835b`); milestone 1 (owner: "later") | pull order only: after `ABC-222` (met 2026-10-31, `ae7211c3`) and `ABC-244` (met, `24b22339`); rebase order with `ABC-243`/`ABC-242` |
| 4 | `ABC-223` | Smoke reading: `uci-clock-mode` plays 5 games at 40/15 (≤ 10 for coverage) with 0 losses on time | S | P3 | Backlog | 9/10 | `ABC-221` merged; an idle board | `ABC-221` |

- **Milestone 1** is `ABC-220` then `ABC-222`. **Milestone 2** is `ABC-221` then `ABC-223`, after milestone 1 and on
  the owner's "later". *(2026-10-31: milestone 1 is Done and meets M1–M4; see the MILESTONE 1 DONE block at the top.)*
- `ABC-221` is P3 because the owner sequenced it after milestone 1. It needs no other code from `ABC-220`. They share
  `src/uci-session.ts`, so whichever merges second rebases.
- **`ABC-224` is unused.** It goes back to the Orchestrator's pool.

## Owner questions (all answered 2026-10-29, `…a67f71ac`; OQ-0052-1 answered 2026-10-30, `…3dd61448`; the whole-second reading confirmed 2026-10-30, `…f4673b9f`)

| Q | asked | answer (2026-10-29) | what it changed |
|---|---|---|---|
| Q1 | Who plays the 40/15 setting? | "cutechess matches". Smoke readings of 5 or 10 games. Major validation (≥ 100 games, 24–48 h) later | UCI is the surface. CLI parity is out. Smoke readings are 5 games. Major validation is out of the MVP |
| Q2 | Which option? | "Initially … 22.5 second separate difficulty setting …, later UCI clock mode" | (a) first (`ABC-220`), then (b) later (`ABC-221`). Option (o) and `ABC-218` are gone |
| Q3 | The name? | "2 new difficulty settings … simple-tournament and … uci-clock-mode (maybe separate inputs)" | The names are fixed. The form is the Architect's |
| Q4 | T and its ceiling | "22.5 ceiling" | The hard ceiling is 22.5 s. T = 22.0 s is proposed under it (§ The budget T); the owner is told. **2026-10-30 (OQ-0052-1): "change 22.5s to 22s …, ceiling also at 22s"**, so T = 22 s and the ceiling = 22 s |
| Q5 | The clock mode's per-move ceiling | "increase to 60s" | 60 s for `uci-clock-mode` only. The 32 s clamp stays for levels 1–7 |
| Q6 | A strength reading at 40/15? | "not yet, … after other improvements are done" | None in this epic |
| Q7 | Think time in the CLI? | "no" | Out of scope |
| Q8 | Accept the epic and M1–M4? | "ok" | Accepted: 0 losses on time, closest call ≥ 500 ms, ≥ 75 % per period |

- **OQ-0052-1, accept `ADR-0052`? Answered 2026-10-30:** accepted, with T and the ceiling both 22 s, whole seconds
  (`orch-2026-10-29g` `…3dd61448`). *(Was open 2026-10-29: (a) as written; (b) another T under 22.5 s; (c) decline.)*
- **The whole-second reading. Answered 2026-10-30: confirmed** (`orch-2026-10-30a` `…f4673b9f`, verbatim: "Whole-second reading of "≤ 22 s" - confirm").
  A 22 s ceiling equal to T is read to the whole second on the wall (< 22 500 ms), because each move carries ~31 ms of
  stop overshoot past the 22 000 ms it is handed. T stays at 22 s. *(Was open, not a blocker: "If he means a strict
  22 000 ms wall instead, T has to sit below 22 s, and that is his number to give.")*
- **Not a question for the owner:** how the clock mode's margin is built, the readings' exact command lines, and the
  thermal rule. That is delivery under his delegation (`…5aaf7cec` item 1).

## Options as cut (history, superseded 2026-10-29 by Q2)

The cut framed (o) nothing new, (a) a fixed-budget level, (b) clock-based allocation over UCI, and (c) both. The owner
picked **(a) first, then (b) later**, as two separate settings. That is close to (c) without the CLI half. The
original table is in git at `f45aea95`.

## Dependencies

- **`ADR-0052` (`arch-epic009-settings`, merged `a060c449`; ACCEPTED by the owner 2026-10-30, with the 22 s
  amendment).** It rules the input form of both settings, the `go` interaction for `simple-tournament`, the clock
  mode's rule, its margin and stop, the ceilings, the clamp and the latency. It also gives the `NFR-004` text. No
  ticket waits on its acceptance any more.
- `ABC-204`'s pinned host tools (`cutechess-cli` 1.5.1), re-pinned on this host on 2026-10-28. Their paths come from
  the environment and stay out of the records (`ADR-0049` d4).
- `tools/rating/rating.ts` plays a fixed time per move (`st=`). It has no `tc=40/900` mode, so `ABC-222` and `ABC-223`
  run `cutechess-cli` directly in QE's scratch clone. No `tools/` edit is needed.
- `ABC-220` touches `src/uci-session.ts` only. `ABC-221` touches `src/uci-session.ts` and one value in
  `src/engine.ts` (`ADR-0052` D8). `EPIC-010`'s `ABC-230` also touches `src/uci-session.ts`, and `EPIC-010`'s `G9`
  holds `HARD_CEILING_MS` byte-identical in that epic's diffs. Whichever merges second rebases; the Orchestrator
  orders them.
- `sa-ideas-verify` `…1ccf0010` is the source of § "How today's engine handles time".

## Risks

- **`RISK-EPIC009-01`: a loss on time at a period's last move.** With `simple-tournament` at T = 22.0 s, the margin
  there is ~18.8 s by arithmetic. With `uci-clock-mode`, the margin is a requirement. The pipe and GUI latency is
  unread. `ABC-222` and `ABC-223` read it in 5 games each. Only the later major validation bounds it. *(2026-10-29:
  `ADR-0052` D2 closes it by design. C keeps ≥ 1 s, 1 069 ms on the virtual clock, and M1 survives δ ≤ 600 ms on a
  period's last move. The smokes read the real δ.)* *(2026-10-31, `ABC-222`: in `simple-tournament` the real δ is ≤ 2 ms,
  and the closest call is 19 991 ms. Open for `uci-clock-mode` until `ABC-223`.)*
- **`RISK-EPIC009-02`: a GUI gives up on `isready` or `stop` mid-search.** An answer can be one budget late
  (`ADR-0044` D5): up to 22 s for `simple-tournament` (2026-10-30) and up to 60 s for `uci-clock-mode`, against level 7's 32 s
  today. `ADR-0045` A4 records `cutechess-cli` killing an engine at its 15 000 ms `IdleTimeout` after a mid-search
  `stop`. It sends one at a game end or when pondering. The Architect rules on this residual. The smoke readings
  count such kills. *(2026-10-29: `ADR-0052` D7 accepts it up to 60 s, with no worker. cutechess pings only between
  moves. Owed: an accepted-risk entry beside `NFR-011` and `ABC-220` A13/A14. Other GUIs are `UNKNOWN - verify`.)*
  *(2026-10-31: **not exercised** by `ABC-222`, QE-222-d. 0 `isready` arrived during a search, and 0 kills came after a
  result. `AR-UCI-BUSY` still covers a GUI that pings mid-search.)*
- **`RISK-EPIC009-03`: a GUI that does not send `movestogo`.** § The budget T shows that M1 and M2 hold for
  `simple-tournament` either way. `uci-clock-mode` needs a fallback rule (the Architect's). The smoke readings log what
  `cutechess-cli` sends. *(2026-10-29: cutechess 1.5.1 sends `movestogo` whenever moves are left in the period; the
  Architect read its source, `…04fdc439`. Without it, C spreads over 20 and stays safe.)* *(2026-10-31: **not
  exercised** by `ABC-222`, QE-222-e. 574 of 574 `go` lines carried `movestogo`. The no-`movestogo` branch is read by
  `ABC-220`'s virtual-clock rows only.)*
- **`RISK-EPIC009-04`: wall time and heat.** A 5-game 40/15 smoke reading is ≤ ~5 h at width 1 (games capped at 80
  moves; § `ABC-222`), and ≤ ~10 h if its coverage extension runs to 10 games. This host ran a Tctl median of 73–80 °C at width 1 over hours (`…ef6ab697`). Each reading runs
  ALONE, on AC, with a thermal and frequency log. A frequency fall over 5 % makes it UNRESOLVED. *(2026-10-31,
  `ABC-222`: 3.44 h for 5 games; Tctl median 73.9 °C, max 76.1 °C; the frequency fell by ≤ 0.01 %.)*
- **`RISK-EPIC009-05`: a strength story slips in.** "A slower setting must be stronger" is a forecast, not a reading.
  Q6 keeps strength out.
- **`RISK-EPIC009-06`: a forced move costs a full 22.0 s.** `simple-tournament` spends T on one legal move too (T8).
  This is accepted. A clock with banked time can absorb it; `simple-tournament` banks nothing.
- **`RISK-EPIC009-07` (new): 60 s searches and memory.** `NFR-009` (≤ 16 MiB held, growth ≤ 1 MiB) was read MET at
  30 s (`ABC-212`). A 60 s ceiling is outside that reading, so `ABC-221` owes a re-read.

## NFR triggers

- **`NFR-004` (owner's).**
  - `simple-tournament`: a ceiling of **22 s**, equal to its budget (Q4, amended 2026-10-30; was 22.5 s). This departs
    from `ABC-212`'s "budget + 2 s" rule, by the owner's word.
  - `uci-clock-mode`: **60 s** (Q5), above today's 32 s clamp, for this mode only. Levels 1–7 keep their rows and the
    32 s clamp.
  - The Architect names the change, and Security/NFR places the text. `AR-NFR004-A` (≤ ~31 ms) is re-read at each gate.
    *(2026-10-31: at 22 s through the real pipe, max +2 ms over 561 searches (QE-222-b). Security/NFR's to place.)*
  - *(2026-10-29, `ADR-0052` § Consequences, proposed text.)* At `ABC-220`: *"; 22.5 s in UCI `TimeMode`
    `simple-tournament` (budget 22 s)"*, and the clamp stays 32 000. *(2026-10-30: 22 s, per the amended ADR text.)* At `ABC-221`: *"; 60 s in UCI `TimeMode`
    `uci-clock-mode` (budget ≤ 59.5 s). The engine's one clamp sits at the largest ceiling in force, 60 s."*
- **`NFR-009`:** 22 s is inside `ABC-212`'s 30 s reading, so `ABC-220` owes no re-read. 60 s is outside it, so
  `ABC-221` owes one (≤ 16 MiB, growth ≤ 1 MiB).
- **`NFR-008`: `npm test` wall ≤ 10 s at load1 ≤ 8.** New rows run on the virtual clock only. There are 0 real-clock
  rows in the default lane.
- **`NFR-005`, `NFR-011`, `NFR-012`: untouched.** Their referent is `Skill Level` 5 under `TimeMode level`, which
  does not change.
- **`ADR-0044` D5 latency:** ≤ 22 s and ≤ 60 s (`RISK-EPIC009-02`; 22 s from 2026-10-30). Ruled 2026-10-29 (`ADR-0052` D7): accepted, no
  worker, no new `NFR` bound. An accepted-risk entry goes beside `NFR-011`, placed by Security/NFR. `NFR-011` itself is
  idle-only and does not move.
- **Security (ASVS L1):** each setting is one value of the `TimeMode` closed set, matched exactly. `go`'s numeric
  tokens are already parsed and refused today. Security/NFR confirms at each gate.

## Test notes

- Readings never run in `npm test` (`NFR-008`). They run in QE's scratch clone, ALONE, like `ABC-202` and `ABC-204`.
- The clock arithmetic is pinned on the virtual clock (`src/virtual-clock.ts`, `ADR-0027`), one whole simulated 40/15
  period per row, with the injected `now`.
- Each build ticket changes production lines, so UAT is owed. The QE verdict signs it under the owner delegation
  (`…5aaf7cec` item 2). The owner may play a match; nothing waits on it.
