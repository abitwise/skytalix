---
id: ABC-220
title: "`simple-tournament` over UCI (`TimeMode`): a fixed T = 22.0 s a move, capped by a safe clock share, under a 22.5 s hard ceiling, levels 1–7 unchanged"
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-009
---

# ABC-220: `simple-tournament` over UCI, a fixed T a move under a 22.5 s hard ceiling

> **RECONCILED 2026-10-29 to `ADR-0052` (PROPOSED) by BA/PM** (task `bapm-owner-words-b`, records only, at `main`
> `4dcb353e`). The Architect ruled the form, the `go` interaction and T (`arch-epic009-settings` `…fa9e821e`,
> `…04fdc439`; `ADR-0052` D1–D3, D7–D9). Every row below now pins that ruling instead of "the ruled form":
>
> - **Form:** one UCI `combo`, `TimeMode`, beside `Skill Level`: `option name TimeMode type combo default level var
>   level var simple-tournament`. cutechess selects it with `option.TimeMode=simple-tournament`.
> - **Budget at `go`:** `movetime x` → `min(x, T)`; a clock for the side to move → **`min(T, C)`**; no time token → T.
>   T = 22 000 ms under the 22 500 ms ceiling. The cut's `min(G, T)` is replaced (`ADR-0052` alternative A6).
> - **C, the safe clock share:** `C = max(1, min((t − 1 000 − m × 100) / m + inc, t − 1 100))`, with m = `movestogo`,
>   or 20 without it.
> - **`src/engine.ts` does not change at this build.** The clamp stays 32 000 ms. Only `src/uci-session.ts` changes,
>   with no new file.
> - **Rows added:** the safe share (A7), the option's refusals (A10), and the two latency rows the ADR owes (A13, A14).
> - **Wait:** the owner accepts `ADR-0052` (OQ-0052-1). If he answers (b) with another T, the rules stay as written,
>   and BA/PM re-derives the numbers in A2–A7 for his T in one short hop before Ready. DoR stays 9/10.
>
> **RE-SCOPED 2026-10-29 by BA/PM** (task `bapm-amend-epic009`, records only, at `main` `a5d70e35`), on the owner's
> answers of 2026-10-29 (`orch-2026-10-29g` `…a67f71ac`).
>
> - **Was:** "the same named level over UCI", option (a) only, S, after `ABC-219`.
> - **Now:** the `simple-tournament` setting itself, over UCI. It takes in the retired `ABC-219`'s core: the setting,
>   a fixed T, and rate 0. The CLI is out (`EPIC-009` § CLI parity). The size grows S → M.
> - **The owner's words that rule it:**
>   - Q1: cutechess, so UCI is the surface;
>   - Q2: "22.5 second separate difficulty setting" first;
>   - Q3: the name `simple-tournament`, "maybe separate inputs";
>   - Q4: a "22.5 ceiling";
>   - Q8: 0 losses on time, closest call ≥ 500 ms, ≥ 75 % per period.
> - **T = 22 000 ms is proposed** under the ceiling (`EPIC-009` § The budget T). The owner is told the number.
> - **Waits in Backlog only on the Architect's ruling** (`arch-epic009-settings`): the input form, the `go`
>   interaction, and T if he refines it. It also waits on the owner accepting that ADR.
>
> **Cut 2026-10-29 by BA/PM** (task `bapm-epic009-tournament`, at `main` `51c85f49`) as option (a)'s UCI half. The
> cut's text is in git at `f45aea95`.

## Problem

- **User:** a `cutechess-cli` match at a 40/15 clock, engine against engine (Q1).
- **Pain:** no setting is named for 40/15. `Skill Level` 7 gets ~22.5 s a move only when the GUI sends a clock, with
  ~50 ms left at a period's 40th move (`EPIC-009` T3–T4; ~19 ms at δ = 31 ms on the virtual clock, `ADR-0052`
  § Context). That can lose on time.
- **Value:** one named setting that a match selects. It thinks a fixed 22.0 s a move, never more than 22.5 s, never
  spends past the clock it is given, and keeps a margin at every period's end by arithmetic.

## Scope

All of it is `ADR-0052` (PROPOSED), D1–D3 and D7–D9.

1. **The setting `simple-tournament`:**
   - per-move budget T = **22 000 ms** (`SIMPLE_TOURNAMENT_BUDGET_MS` = 22 500 − 500);
   - blunder rate 0;
   - a **hard ceiling of 22 500 ms** (`SIMPLE_TOURNAMENT_CEILING_MS`): no `go` (clock, `movetime`, `infinite`, bare)
     makes it think longer.
2. **Selected over UCI by `TimeMode`** (D1):
   - `uci` writes `option name TimeMode type combo default level var level var simple-tournament` after the
     `Skill Level` line and before `uciok`. The `Skill Level` line stays byte-identical (`default 5 min 1 max 7`).
   - `setoption name TimeMode value <v>`: the name matches case-insensitively; the value matches **exactly** one of
     the offered values, held as a frozen tuple. Any other value keeps the old one and writes one `info string` line
     (text through `printableOf`). `ucinewgame` does not reset it.
   - The `cutechess-cli` lines: `option.TimeMode=simple-tournament`. For a baseline: `option.TimeMode=level
     "option.Skill Level=7"`, or no `TimeMode` at all.
   - `uci-clock-mode` is **not** offered at this build. A value that does not work yet is not offered (`ABC-221`).
3. **The budget at `go`** (D2, D3):
   - `movetime x`: `min(x, T)`;
   - a clock for the side to move: **`min(T, C)`**, where `C = max(1, min((t − RESERVE − m × OVERHEAD) / m + inc,
     t − RESERVE − OVERHEAD))`, `RESERVE` = 1 000 ms (`CLOCK_RESERVE_MS`), `OVERHEAD` = 100 ms (`CLOCK_OVERHEAD_MS`),
     m = `movestogo` or 20. C is a private function beside `parseGo`;
   - no time token (bare `go`, `infinite`, `ponder`, or only `depth`/`nodes`/`mate`): T.
4. **While `TimeMode` is not `level`, `Skill Level` is not read.** The search is the rate-0 `chooseMove` path with
   D12's limits. The blunder path, `createLevel` and the seed draw are not reached, and the injected `random` is not
   consumed. A `Skill Level` set meanwhile is kept, and it takes effect when `TimeMode` returns to `level`.
5. **Off by default.** `TimeMode level` is today's behaviour: D4.1's `G` with `MOVE_OVERHEAD_MS` 50 and
   `DEFAULT_MOVES_TO_GO` 20, capped by the level.
6. **Where the code goes** (D8): `src/uci-session.ts` only (the value and its tuple, C, D3's rule, and the four
   constants). Tests in `src/uci-session.test.ts` and its `ENGINE_DEEP` lane. **No new file.** `src/engine.ts`,
   `src/levels.ts`, `src/cli-options.ts`, `src/cli.ts`, `src/startup-questions.ts`, `src/pgn.ts` and `src/search.ts`
   do not change.

## Out of scope

- The CLI (flag, start-up question, PGN tag): `EPIC-009` § CLI parity; `ADR-0052` D1 adds nothing to it.
- Levels 1–7, the default (5), the `Skill Level` default (5), and `HARD_CEILING_MS` (32 000; it moves only at
  `ABC-221`, `ADR-0052` D6).
- The value `uci-clock-mode` and its rule (`ABC-221`). An early stop on a forced move (`RISK-EPIC009-06`). More time
  on a hard move (`ADR-0052` A10). Think-time display (Q7). A worker for `isready`/`stop` (`ADR-0044` D5 stands).
- The real-clock games (`ABC-222`).

## Acceptance criteria

Rows A2–A10, A12 and A13 run on the virtual clock (`ADR-0027`). Each simulated search takes its budget + 31 ms
(`AR-NFR004-A`'s bound), and a book move takes 0 ms. "The setting" means `setoption name TimeMode value
simple-tournament`. The numbers are `ADR-0052`'s arithmetic (`arch-epic009-settings` `raw/alloc.txt`).

- **A1 (offered, off by default).** **Given** `uci`, **then** the reply holds `option name TimeMode type combo default
  level var level var simple-tournament`, byte-exact, after the `Skill Level` line and before `uciok`. The
  `Skill Level` line is byte-identical to base. With `TimeMode` never set, no `go` differs from base (A8).
- **A2 (no clock).** **Given** the setting, **when** a bare `go`, `go infinite` and `go depth 4` are each sent, **then**
  the search gets `budgetMs` = 22 000.
- **A3 (one 40/15 period).** **Given** the setting, **when** one whole period is played (`go` carries the clock left
  and `movestogo` 40…1, from 900 000 ms, no book moves), **then** every move's `budgetMs` = 22 000 (C starts at
  22 375 and only grows), the clock left after the 40th move is **≥ 18 000 ms** (18 760), every move leaves
  ≥ 1 000 ms, and the period uses **≥ 75 %** of 900 s (97.9 %).
- **A4 (book moves).** **Given** A3's period with its first 6 moves from the book, **then** the period uses ≥ 75 % of
  900 s (83.2 %), and every move leaves ≥ 18 000 ms.
- **A5 (no `movestogo`).** **Given** the setting and `go wtime 900000 btime 900000` with no `movestogo`, **when** 40
  moves are played with no added time, **then** every move leaves **≥ 1 000 ms**, and the 40 moves use ≥ 75 % of
  900 s. The row records the clock left after move 40. By BA/PM's arithmetic it is about 166 s: T binds while
  C ≥ 22 000, about the first 20 moves, then C spreads what is left over 20.
- **A6 (the hard ceiling).** **Given** the setting, **when** `go movetime 30000`, `go infinite`, a bare `go`, and
  `go wtime 3600000 btime 3600000 movestogo 40` (C = 89 875) are each sent, **then** each budget is 22 000, and each
  deadline is ≤ start + 22 500 ms. **Given** `go movetime 5000`, **then** the budget is 5 000. The rows read the
  deadline the engine is handed.
- **A7 (the safe share).** **Given** the setting:
  - `go wtime 3000 btime 3000 movestogo 1` → budget **1 900 ms**, and the move leaves ≥ 1 000 ms (1 069);
  - `go wtime 800 btime 800` → budget **1 ms**, and a move is still returned (the engine's unabortable depth 1);
  - a scaled `tc=40/60` played over 3 periods (60 000 ms, `movestogo` 40…1, +60 000 ms after moves 40 and 80) →
    every move leaves **≥ 1 000 ms** (1 069). C binds on every move here.
- **A8 (levels unchanged, `EPIC-009` M3).**
  - `git diff` base..head: `LEVELS[1..7]`, `DEFAULT_LEVEL`, the `Skill Level` default and `src/engine.ts` unchanged;
    `HARD_CEILING_MS` = 32 000.
  - **Given** `TimeMode` unset, and again `TimeMode level`, at `Skill Level` 1–7, **when** A3's period is replayed,
    **then** every `go`'s budget equals base's, row for row.
- **A9 (rate 0; `Skill Level` not read).** **Given** the setting and `Skill Level` 1, **when** 10 non-book moves are
  played with an injected `random`, **then** `random` is called 0 times and every budget is A3's. **Given** `go depth
  3`, **then** the completed depth is ≤ 3 (D12). **Given** `Skill Level` 6 set while in the setting, **when** `TimeMode`
  returns to `level`, **then** the next `go` is level 6's.
- **A10 (the option's refusals).** `setoption name timemode value simple-tournament` is accepted (case-insensitive
  name). `value Simple-Tournament`, `value uci-clock-mode` and `value 7` are each refused: the old value is kept, and
  exactly one `info string` line names the offered values and the value got. The setting survives `ucinewgame`.
  (`ADR-0052` D1's text lists `uci-clock-mode`, which this build does not offer. BA/PM reads it as "the values
  offered at this build". The Architect confirms the exact text at design.)
- **A11 (wall, deep lane).** **Given** 5 fixed positions, **when** each is searched once at T = 22 000 on the real
  clock in plain `node`, **then** each returns in **≤ 22 500 ms** of wall, and the max is recorded. It runs in the
  `ENGINE_DEEP` lane, never in the default lane, and ALONE (~2 min).
- **A12 (`NFR-008`).** The default lane gains 0 real-clock rows. `npm test` wall stays ≤ 10 s at load1 ≤ 8.
- **A13 (busy `isready`, default lane; `ADR-0052` D7).** **Given** the setting and a `go`, **when** `isready` is sent
  before the search ends, **then** exactly one `readyok` is written, after the `bestmove`, and in order.
- **A14 (busy `isready`, opt-in real-child lane; `ADR-0052` D7; the `ABC-119` precedent, unset = NOT DEFINED).**
  **Given** `node src/uci.ts` with the setting, **when** `go movetime 2000` and then `isready` 100 ms later are sent,
  **then** `readyok` arrives ≤ 100 ms after `bestmove`, and no line is lost.

## NFR triggers

- **`NFR-004` (owner's, Q4): a 22.5 s ceiling for the setting.** Proposed text (`ADR-0052` § Consequences), placed by
  Security/NFR at this ticket's gate: *"…; 22.5 s in UCI `TimeMode` `simple-tournament` (budget 22 s)."* The clamp
  stays 32 000. A6 and A11 read it; `ABC-222` reads it in games. `AR-NFR004-A` (≤ ~31 ms) is re-read at 22 s.
- **`ADR-0044` D5 latency:** `isready`/`stop` mid-search are answered ≤ one budget late, ≤ 22.5 s here. Accepted with
  no worker (`ADR-0052` D7). **Owed:** the accepted-risk entry beside `NFR-011`, placed by Security/NFR: *"busy
  `isready`/`stop`: answered ≤ one budget + `AR-NFR004-A` late; ≤ 22.5 s in `simple-tournament`, ≤ 60 s in
  `uci-clock-mode`; one `readyok` per `isready`, in order"*, plus A13 and A14.
- **`NFR-009`:** 22 s is inside `ABC-212`'s 30 s reading (≤ 16 MiB, flat). No re-read is owed.
- **`NFR-008`:** A12. **`NFR-005`, `NFR-011`, `NFR-012`:** unchanged (their referent is `TimeMode level`).
- **Security (ASVS L1):** one option, matched exactly against a fixed tuple. The `go` numbers are already parsed and
  refused today. A negative or huge `wtime` lands on C's floor of 1 or on the cap. No new input class.

## Test notes

1. Default lane: A1–A10, A12 and A13, on the virtual clock, in `src/uci-session.test.ts`'s pattern (`ADR-0027`). A3,
   A4, A5 and A7's `tc=40/60` row are each one simulated sequence.
2. `ENGINE_DEEP` lane: A11, ~2 min, ALONE, never during a reading. Opt-in real-child lane: A14.
3. UAT is owed (production lines change). The QE verdict signs it (`…5aaf7cec` item 2). `ABC-222` is the real-clock
   smoke.
4. **Owed at merge** (`ADR-0052` § Consequences): BA/PM folds the dated lines into `ADR-0044` D3, D4 (a new D4.5), D5
   and D11. The Scribe adds the `TimeMode` line to `AGENTS.md`'s UCI notes. The SE adds D5's latency sentence to
   `src/uci-session.ts`'s header.

## Size and priority

- **Size: M.** One option, one small function (C), D3's rule, four constants and 14 rows, in one file. `ABC-212` was
  M for a similar spread.
- **Priority: P2.** It is the owner's own idea and his milestone 1. Nothing is broken without it.

## Dependencies

- **The owner accepts `ADR-0052` (OQ-0052-1).** It is PROPOSED, and nothing is built on it until he answers. Options
  (a) accept, (b) accept with another T under 22.5 s, (c) decline. On (c) this ticket goes back to BA/PM and the
  Architect. This is the only open blocker.
- Shares `src/uci-session.ts` with `ABC-221` (milestone 2) and with `EPIC-010`'s `ABC-230`. Whichever merges second
  rebases; the Orchestrator orders them.
- Owner answers: all in (Q1–Q4, Q8; 2026-10-29).

## Definition of Ready (re-scored 2026-10-29, `bapm-owner-words-b`)

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ owner word (Q1–Q4); user, pain and value stated |
| 2 | scope and out-of-scope | ✅ 6 scope items, each from `ADR-0052`; CLI, levels, clock mode, clamp and games out |
| 3 | INVEST | ✅ independent of `ABC-221`; M; testable |
| 4 | testable, measurable acceptance | ✅ A1–A14: byte-exact lines, ms, %, a row-for-row identity, wall ≤ 22 500 ms, in-order `readyok` |
| 5 | dependencies known | ✅ `ADR-0052` (PROPOSED), named; owner answers in |
| 6 | NFR triggers with targets | ✅ `NFR-004` 22.5 s (owner's word; text proposed); D5 ≤ 22.5 s accepted-risk entry; `NFR-009` inside the 30 s reading; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 4 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ **the owner's acceptance of `ADR-0052` (OQ-0052-1)** |

**DoR 9/10. Backlog. It waits only on the owner accepting `ADR-0052` (OQ-0052-1).** On (a) it goes to Ready with no
further BA/PM hop: every row already pins the ruling. On (b), BA/PM first re-derives A2–A7's numbers for his T (a T
above 22 375 ms would let C bind at 40/15, so the rows change shape, not only value).
