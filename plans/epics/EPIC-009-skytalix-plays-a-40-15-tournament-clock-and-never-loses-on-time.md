---
id: EPIC-009
title: "`skytalix` plays a 40/15 tournament clock: a named level that uses the clock and never loses on time"
status: proposed
column: Backlog
priority: P2
size: M
owner: BA/PM
---

# EPIC-009: `skytalix` plays a 40/15 tournament clock, uses it, and never loses on time

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic009-tournament`, records only, at `main` `51c85f49`; `main`'s `src/`,
> `data/` and `tools/` are byte-identical to `3ad6bc10` and to `64fb1544`). The rulings are in
> `.grugops/context/bapm-epic009-tournament/notes/`. This hop ran no test, no game and no timing.
>
> **Owner word** (`ideas-2026-10-29/input/owner-ideas.md` § A, transcribed by the Orchestrator, a transcription and
> not a stamp): *"add new difficulty to allow 40/15 move rule of tournaments:
> https://computerchess.org.uk/4040/index.html , basic solution would be to use 22.5 seconds per move, currently
> difficulty level 7 allows 30s per move. New difficulty could be named "tournament" or 40-15"*. § B item 4 of the
> same file (real clock management) is **UNKNOWN - verify**: it comes from an external chat model, and the owner asked
> that it be checked, not taken as valid. It is used here only as the source of option (b), never as a fact.
>
> **Routing:** Orchestrator `orch-2026-10-29g` `…ccb72dbe`. **What is the owner's here:** which option (Q2), the
> name (Q3), who plays it (Q1), any `NFR-004` ceiling (Q4, Q5) and the measures (Q8). Nothing on this page picks them. Until he answers,
> only `ABC-218` (a reading of today's engine, no code) is `Ready`.

## How today's engine handles time (System Analyst `sa-ideas-verify` `…1ccf0010`, confirmed against BA/PM's reading)

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

**What follows from T3–T4 under a 40/15 clock** (arithmetic, not a measurement; `UNKNOWN - verify` until `ABC-218`
reads it), at the first move of a period (900 000 ms left, `movestogo` 40, so `G` = 22 500 ms):

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

## What 40/15 means on this page

- **40/15 = 40 moves in 15 minutes, repeating**: after each 40th move the side's clock gains another 15 minutes. No
  increment. In `cutechess-cli` this is `tc=40/900` (spelling `UNKNOWN - verify` against the pinned 1.5.1 at
  `ABC-218` `A1`).
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

- **Users.** Who plays it is the owner's answer (Q1). The candidates:
  - **(i) the owner in the CLI**, wanting a slower, stronger opponent at a tournament pace;
  - **(ii) a UCI GUI or `cutechess-cli` match** at a CCRL-style 40/15 clock, engine against engine. The owner's link
    points here;
  - **(iii) both.**
- **Pain.**
  - In a GUI at the default `Skill Level` 5, a 40/15 clock is 87 % unused: the engine plays 3 s moves (T4).
  - A user who knows to pick `Skill Level` 7 gets ~22.5 s a move, but nothing names it as the 40/15 setting, and its
    margin at a period's last move is 50 ms (T3). Whether that ever loses on time is unread.
  - In the CLI there is no clock at all (T2). "40/15" can only mean a pace, about 22.5 s a move.
- **Value.** One named setting that a player picks for 40/15 play. It spends most of the clock, and it never loses on
  time. The human-facing levels 1–7 stay as they are.

## The cheapest slice that proves the value

`ABC-218` reads today's `Skill Level` 7 under a real 40/15 clock first: how much of the clock it uses, and how close it
comes to its flag. It changes no code. It may show that today's level 7 already does most of the job, and that the
build is only a name and a wider margin. Every build ticket after it is measured by the same reading (`ABC-222`).

## Options for the owner (Q2; BA/PM frames them and does not pick)

| | what is built | forfeit risk | use of the clock | testability | human-facing levels |
|---|---|---|---|---|---|
| **(o) nothing new** | Nothing. The page tells a GUI user to set `Skill Level` 7. `ABC-218` reads it | Today's 50 ms at a period's last move (T3). `ABC-218` reads it | ≤ 100 % at level 7; 13 % at the default 5 | One reading, no code | Unchanged |
| **(a) a fixed-budget level** | A named level that thinks a fixed T a move (T = 22.5 s, or less; Q4), rate 0, at the CLI and at UCI (`ABC-219`, `ABC-220`) | In the CLI none: there is no clock. Under UCI, T3's arithmetic still caps it: at T = 22.5 s the same ~50 ms at a period's last move as (o); at T = 22.0 s, ~20 s (Q4) | 40 × T. At 22.5 s that is 100 % less book moves, and nothing saved for a hard move | The simplest. Virtual-clock pins, like `ABC-212` | Unchanged: a new name beside 1–7 |
| **(b) clock-based allocation over UCI** | A named UCI mode that spends the real clock: remaining ÷ `movestogo`, a safety margin on every move, a hard stop before the flag, not capped at a level's 30 s (`ABC-221`) | Lowest by design: the margin is a requirement, and `ABC-222` reads it | Close to 100 % less the margin, and banks book-move time | The arithmetic pins on the virtual clock; the forfeit claim needs real-clock games | Unchanged. The CLI gets nothing: it has no clock |
| **(c) both** | (a) in the CLI only (`ABC-219`) and (b) over UCI (`ABC-221`) | As (a) in the CLI, as (b) over UCI | As (a) in the CLI, as (b) over UCI | Both sets | Unchanged |

- **Cost, in tickets** (after `ABC-218`, which every option shares): (o) none; (a) `ABC-219` M + `ABC-220` S +
  `ABC-222` S; (b) `ABC-221` M + `ABC-222` S; (c) `ABC-219` M + `ABC-221` M + `ABC-222` S.
- **What (b) does not include in this epic:** spending *more* time on a hard move (for example when the best move
  changes between iterations). That changes how the engine searches. It needs an ADR and a strength reading, and it
  is out of scope.
- **BA/PM's reading, offered and not picked:** run `ABC-218` first, whatever he chooses. Then, if he plays the 40/15
  pace in the CLI himself, (c); if 40/15 is for GUI or `cutechess-cli` matches only, (b). (a) alone adds little over
  UCI that `Skill Level` 7 does not already do (T4), but it is the only option that gives the CLI a tournament pace.
- **Default without an answer:** (o). Only `ABC-218` runs; `ABC-219`–`ABC-222` stay in `Backlog`.

## The name (Q3)

- **"tournament"**: a plain word, not tied to one clock. If a later clock is added (for example 40/40), it could cover
  it. It does not say which clock it was tuned for.
- **"40-15"**: says exactly which clock. In the CLI there is no clock (T2), so "40-15" there names a pace, not a rule.
- **Where the name shows** (each is a design point for Architect/Design, not a choice here):
  - the CLI flag and its usage line (`--difficulty <name>`, beside `1|2|…|7`);
  - the start-up question's answers (`ABC-200`);
  - the PGN `Difficulty` tag;
  - UCI: `Skill Level` is a `spin` 1–7, which cannot carry a word. The level needs an ordinal or its own option.
    Architect/Design rules this under `ADR-0044` and `ADR-0045`.
- **The order constraint** (SA `…1ccf0010` § 8): levels are "weakest to strongest" (`ABC-101` ruling 1), and 22.5 s
  sits between level 6 (5 s) and level 7 (30 s). An ordinal 8 breaks that order, and inserting it renumbers today's 7.
  So a name beside the ordinals, or a separate option, is the likelier shape. That is Architect/Design's ruling.

## Scope

- `ABC-218`: one QE reading of today's engine under a 40/15 clock. No code.
- On the owner's answers only:
  - `ABC-219` (options a, c): the named level in the CLI;
  - `ABC-220` (option a only): the same level over UCI;
  - `ABC-221` (options b, c): the named clock mode over UCI;
  - `ABC-222` (a, b, c): the acceptance reading of what was built.
- An `ADR-0045` amendment (a named level) and/or an `ADR-0044` D4 amendment (clock mode), written by Architect/Design
  and reported to the owner when they land.

## Out of scope

- **Changing levels 1–7, the default (5) or their budgets.** Gate: `LEVELS[1..7]` and `DEFAULT_LEVEL` byte-identical,
  and the `Skill Level` default stays 5.
- **Spending more time on hard moves** (variable allocation inside the search). A search change; a later epic with a
  strength reading.
- **Pondering, threads, a worker for `isready`/`stop`** (`ADR-0044` D5 stands).
- **A clock in the CLI** (a human clock, flag falls, time-loss results). The CLI pace is per move only.
- **A strength claim at 40/15.** No level, option or screen claims an Elo (`EPIC-008` § Out of scope, unchanged). A
  strength reading at 40/15 is Q6, with its cost.
- **Entering CCRL or any rating list.** That is distribution: `ADR-0049` (the engine deploys nowhere and publishes no
  package) and the owner's call (`EPIC-008` § Out of scope).
- **The other ten ideas of § B.** They wait for `sa-ideas-verify` and are cut later from `ABC-225` (Orchestrator
  `…ccb72dbe`).
- **Showing think time in the CLI.** Q7, default no. Under UCI the engine already prints `info … time` each move, and
  `cutechess-cli`'s PGN records each move's time.

## Success measures

| # | measure | target | how it is read |
|---|---|---|---|
| M1 | **Never loses on time** | In `ABC-222`'s reading, `skytalix` in the built level or mode loses **0** games on time, and its closest call (the least clock left after any of its moves) is **≥ 500 ms** | `cutechess-cli` 1.5.1, `timemargin=0`, the games and counts pinned in `ABC-222` |
| M2 | **Uses the clock** | Over each completed 40-move period of `ABC-222`'s full-length games, `skytalix` uses **≥ 75 %** of the 900 s it was given, book moves included | per-move times from the PGN, summed per period |
| M3 | **The human-facing levels are unchanged** | `LEVELS[1..7]` and `DEFAULT_LEVEL` byte-identical to base; `Skill Level` default 5; at `Skill Level` 1–7, `G` over one whole simulated 40/15 period is identical to base on the virtual clock | `git diff`; each build ticket's identity row |
| M4 | **The owner's decisions stayed his** | 0 NFR bounds moved without his word; each new ADR text reported to him when it lands; Q1–Q3 answered before any build ticket leaves `Backlog` | the ADR pages and owner-word notes |

- **Under option (o), M1 and M2 are read on today's `Skill Level` 7 by `ABC-218`, and graded only if the owner says the
  reading closes the epic.** `ABC-218` alone grades nothing; it reports.
- **Strength is not a measure** (§ Out of scope, Q6). Respecting `RISK-EPIC008-03` and the Architect's ranking
  (`arch-epic008-rd` `…0c5d62f4`): self-play does not stand in for an outside opponent, and a 3 s or 1.5 s reading does
  not stand in for ~22.5 s. Nothing on this page infers strength at 40/15 from them.

## Tickets (order is the pull order; the pages are under `plans/tickets/`)

| order | id | title | size | priority | column | DoR | depends on | waits on |
|---|---|---|---|---|---|---|---|---|
| 1 | `ABC-218` | Reading: today's `Skill Level` 7 under a 40/15 clock over UCI, its clock use and its closest call to the flag | S | P2 | Ready | 10/10 | `ABC-204`'s pinned tools; an idle board (ALONE) | nothing |
| 2 | `ABC-219` | A named tournament level in the CLI: the engine thinks a fixed T a move, rate 0, and levels 1–7 are unchanged | M | P2 | Backlog | 8/10 | Architect/Design (`ADR-0045` amendment) | Q1, Q2 (a or c), Q3, Q4 |
| 3 | `ABC-220` | The same named level over UCI, at a fixed T a move under any clock | S | P2 | Backlog | 8/10 | `ABC-219`; Architect/Design (`ADR-0044` D4/D11) | Q2 = (a), Q3, Q4 |
| 4 | `ABC-221` | Under a UCI clock, a named mode spends the real clock with a safety margin and a hard stop, and never loses on time | M | P2 | Backlog | 9/10 | Architect/Design (`ADR-0044` D4 amendment) | Q1, Q2 (b or c), Q3, Q5 |
| 5 | `ABC-222` | Acceptance reading: the built level or mode plays 40/15 over UCI with 0 losses on time and ≥ 75 % clock use | S | P2 | Backlog | 9/10 | `ABC-220` or `ABC-221` merged; an idle board | Q2 |

- **Per option, what is pulled after `ABC-218`:** (o) nothing; (a) 219 → 220 → 222; (b) 221 → 222; (c) 219 and 221
  (independent, either first) → 222. Under (c), `ABC-219`'s UCI rows do not exist, and `ABC-220` is closed unbuilt.
- **`ABC-223` and `ABC-224` are not used.** They go back to the Orchestrator's pool.

## Owner questions

- **Q1. Who plays the 40/15 setting?** (i) you, in the CLI; (ii) GUI or `cutechess-cli` matches, engine against
  engine; (iii) both. **No default:** it decides between (b) and (c).
- **Q2. Which option?** (o) nothing new; (a) a fixed-budget level; (b) clock-based allocation over UCI; (c) both
  (§ Options). **Default without an answer: (o)**, and only `ABC-218` runs.
- **Q3. The name: "tournament" or "40-15"?** (§ The name). **No default.** Spelling at each surface is Architect's.
- **Q4 (only under a or c). The fixed budget T, and its `NFR-004` ceiling.**
  - (i) **22.5 s**, as you said. In the CLI there is no clock, so nothing can lose on time. **Over UCI it misses M1 by
    arithmetic:** if every move of a period spends 22.5 s, the 40th move starts with 22.5 s left, T3 gives it
    remaining − 50 ms, and it ends ~50 ms from the flag (less the overshoot). Only banked book-move time helps.
  - (ii) **22.0 s**: 40 × 22.0 = 880 s, so the 40th move ends with ~20 s left. M1 holds by arithmetic, and M2's
    ≥ 75 % holds (98 % less book moves).
  - **Ceiling:** the `ABC-212` rule (budget + 2 s) gives **24.5 s** or **24.0 s**. Either sits under today's 32 s
    clamp, so the clamp does not move. The `NFR-004` text for the new level is yours.
  - **Default: under (c), where the level is CLI-only, (i) 22.5 s with a 24.5 s ceiling; under (a), where it also runs
    over UCI, (ii) 22.0 s with a 24.0 s ceiling.** One T for every surface: a level that differs by surface is a
    defect (`ABC-212` § Size). Proposed, and not placed until you accept it.
- **Q5 (only under b or c). The per-move ceiling of the clock mode.**
  - (i) **Keep 32 s** (today's `HARD_CEILING_MS`). Under 40/15 the share is ~22.5 s, so it rarely binds. No bound
    moves.
  - (ii) **Lift it** for longer clocks. That moves `NFR-004` and lengthens the `isready` delay (T6).
  - **Default: (i).**
- **Q6. A strength reading at 40/15?** None is in this epic.
  - (a) **None** (default). Nothing claims strength.
  - (b) A short look, for information only: about 10 games against Stockfish at 40/15, ~10–15 h ALONE. Its error is
    about ±200 Elo, so it says little.
  - (c) A full R at 40/15: 200 games, ~150–250 h ALONE, on a host that runs 80–95 °C over hours
    (`orch-2026-10-29g` `…ef6ab697`).
  - Any of (b)/(c) waits on how the R/D question is settled (`arch-epic008-rd` `…0c5d62f4`, now with you).
  - Hours are estimates (`UNKNOWN - verify`).
- **Q7. Show the engine's think time in the CLI?** (a) no, default; (b) one line after each engine move ("thought
  22.5 s"), a small ticket later.
- **Q8. Accept this epic and its measures M1–M4** (EPIC goals and M-criteria are yours, `…5aaf7cec` item 3): M1's 0
  losses on time with a closest call ≥ 500 ms, and M2's ≥ 75 % of each period. Options: (a) as written; (b) other
  numbers. **Default: (a)**, read as proposed until you say otherwise; no build ticket leaves `Backlog` before Q1–Q3
  anyway.
- **Not a question for you:** how the safety margin in (b) is built. M1's ≥ 500 ms is the requirement, and
  Architect/Design designs the mechanism. That is delivery, under your delegation (`…5aaf7cec` item 1). So are the
  readings' game counts and the thermal rule.

## Dependencies

- `ABC-204`'s pinned host tools (`cutechess-cli` 1.5.1, Stockfish 19), re-pinned on this host (`EPIC-008`
  § Dependencies, 2026-10-28). Their paths come from the environment and stay out of the records (`ADR-0049` d4).
- `tools/rating/rating.ts` plays a fixed time per move (`st=`). It has no `tc=40/900` mode, so `ABC-218` and `ABC-222`
  run `cutechess-cli` directly in QE's scratch clone. No `tools/` edit is needed for either.
- `ABC-219`–`ABC-221` touch the files `ABC-212` touched (`src/levels.ts`, `src/cli-options.ts`, `src/uci-session.ts`,
  the start-up question, `src/pgn.ts`). No open ticket holds them today.
- `sa-ideas-verify` `…1ccf0010` is the source of § "How today's engine handles time". Its verdicts on the other § B
  items are not used here.

## Risks

- **`RISK-EPIC009-01`: a loss on time at a period's last move.** Today's margin there is 50 ms (T3), the in-process
  overshoot ≤ ~31 ms (T5), and the I/O latency is unknown. `ABC-218` reads it on today's engine; `ABC-221`'s margin
  and `ABC-222` close it.
- **`RISK-EPIC009-02`: a GUI gives up on `isready` or `stop` mid-search.** At ~22.5–30 s a move, an answer can be that
  late (T6). `cutechess-cli` sent 0 pings during a search in `ABC-202`'s 8 games. But `ADR-0045` A4 records
  `cutechess-cli` killing an engine at its 15 000 ms `IdleTimeout` after a mid-search `stop`, which it sends at a game
  end or when pondering (SA `…1ccf0010` § 8). Level 7 carries the same exposure today. `ABC-218` classes such a kill
  by when it happens. Other GUIs: `UNKNOWN - verify`.
- **`RISK-EPIC009-03`: a GUI that does not send `movestogo`** for a repeating control. The session then assumes 20
  (T3). `ABC-218` `A3` logs what `cutechess-cli` sends.
- **`RISK-EPIC009-04`: wall time and heat.** A 40/15 game takes about 45–75 min. At width 1 over hours, this host ran a
  Tctl median of 73–80 °C, max 95.5 °C, with no frequency fall (`orch-2026-10-29g` `…ef6ab697`). Each reading runs
  ALONE, on AC, with a thermal and frequency log. A frequency fall over 5 % makes it UNRESOLVED.
- **`RISK-EPIC009-05`: a strength story slips in.** A slower level "must be stronger" is a forecast, not a reading
  (`RISK-EPIC008-03`; `arch-epic008-rd` explanation 3). Mitigated by no strength measure (Q6).
- **`RISK-EPIC009-06`: the human waits on forced moves.** A fixed 22.5 s level spends it on one legal move too (T8).
  Accepted under (a), as `ABC-212` OQ-212-2 accepted it at 30 s.

## NFR triggers

- **`NFR-004` (owner's).** A new level or mode needs its own ceiling: Q4 (24.5 s proposed) and Q5 (32 s kept). Nothing
  moves without his word. `AR-NFR004-A` (≤ ~31 ms) is re-read by Security/NFR at the gate.
- **`NFR-009`: search-held memory ≤ 16 MiB, growth ≤ 1 MiB.** It was read MET at 30 s (`ABC-212`). A budget ≤ 30 s is
  inside that reading; a mode above 30 s (Q5 (ii)) re-reads it.
- **`NFR-008`: `npm test` wall ≤ 10 s at load1 ≤ 8.** New rows run on the virtual clock only; 0 real-clock rows in the
  default lane.
- **`NFR-005`, `NFR-011`, `NFR-012`: untouched.** Their referent is `Skill Level` 5, which does not change.
- **`ADR-0044` D5 latency:** at most one budget late, ≤ 24.5 s under Q4's default and ≤ 32 s under Q5's. It stays
  accepted unless Architect/Design rules otherwise.
- **Security (ASVS L1):** the new name is one word in closed sets (the flag, the start-up answer, the UCI option). No
  new input class. Security/NFR confirms at each gate.

## Test notes

- Readings never run in `npm test` (`NFR-008`). They run in QE's scratch clone, ALONE, like `ABC-202` and `ABC-204`.
- The clock arithmetic is pinned on the virtual clock (`src/virtual-clock.ts`, `ADR-0027`): one whole simulated 40/15
  period per row, with the injected `now`.
- Each build ticket changes production lines, so UAT is owed. The QE verdict signs it under the owner delegation
  (`…5aaf7cec` item 2). The owner may play a game; nothing waits on it.
