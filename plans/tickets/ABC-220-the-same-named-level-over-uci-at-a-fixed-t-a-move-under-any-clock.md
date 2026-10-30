---
id: ABC-220
title: "`simple-tournament` over UCI (`TimeMode`): a fixed T = 22 s a move, capped by a safe clock share, never handed more than its 22 s hard ceiling, levels 1–7 unchanged"
status: done
column: Done
closed: "2026-10-30, merged to main at ec1e835b; QE PASS_WITH_GAPS (qe-ABC-220, 7a09c5e1), which signs UAT; Security/NFR PASS_WITH_RISKS (secnfr-ABC-220)"
size: M
priority: P2
epic: EPIC-009
---

# ABC-220: `simple-tournament` over UCI, a fixed T = 22 s a move, its hard ceiling also 22 s

> **CONFIRMED 2026-10-30 by the owner, folded by BA/PM** (task `bapm-ABC-242-225-owner`, records only; `src/`, `data/`
> and `tools/` untouched). His words on this item, verbatim (`orch-2026-10-30a` `…f4673b9f`):
> *"Whole-second reading of "≤ 22 s" - confirm"*. The first half of that message, the catalog's reference machine,
> is Security/NFR's.
>
> - **The whole-second reading is confirmed.** In `simple-tournament`, "≤ 22 s" is read to the whole second, which
>   means **< 22 500 ms**. The open owner confirmation in the FOLDED note below is **closed**, and so are the lines
>   that cite it: the MERGED block's "still open", § NFR triggers' `AR-UCI-BUSY` bullet, and DoR row 10.
> - **Nothing moves.** A11's bound (< 22 500 ms, read at max 22 001.0 ms) and A6's deadline (≤ start + 22 000 ms)
>   stand as read. No code changes. `ABC-222` A5 reads the same bound in games.
> - The catalog side (`NFR-004`, `AR-UCI-BUSY`'s re-open condition "the owner declines the whole-second reading")
>   and the reference-machine re-base belong to Security/NFR, under `secnfr-catalog-rebase`.

> **MERGED 2026-10-30 at `ec1e835b`, folded by BA/PM** (task `bapm-ABC-220-merge-fold`, records only; `src/`, `data/`
> and `tools/` untouched). **Done.** QE's verdict is **PASS_WITH_GAPS** with no blocking gap (`qe-ABC-220`
> `…7a09c5e1`), and it signs UAT (Test note 3). Security/NFR's gate is **PASS_WITH_RISKS**, no required fix
> (`secnfr-ABC-220`, `.grugops/queue/done/secnfr-ABC-220.md` § Result). Candidate `fbab54ff` (code `68ba364c`); the
> Security/NFR catalog commit `9c676157` came in with `18485bae`.
>
> - **A1–A14 MET** (A14 = A14a + A14b). A3: 18 760 ms left, 97.9 %. A4: 83.2 %. A5: 166 517 ms left after move 40.
>   A6: 22 000 on every capped branch, and none over 22 000 in 3 000 random `go` lines. A8: 0 differences in
>   4 200 rows against base. **A11: 5 / 5 walls < 22 500 ms, max 22 001.0 ms (+1.0 ms).** A12: 9.69 s at load1 0.41.
>   A14a: `UCI_DEEP` 9 / 9. **A14b: R1 0.38 ms**, R2 and R3 met. `npm test` 2 297 / 2 297, 0 skipped; `G8` +0.09 s.
> - **`NFR-004`:** the catalog row gains "; 22 s in UCI `TimeMode` `simple-tournament` (budget 22 s)". It is MET
>   exactly on the budget (A6) and to the whole second on the wall (A11). Read strictly as ≤ 22 000 ms it misses by
>   ≤ 1.0 ms, and `AR-NFR004-A` covers that; it was re-read at 22 s and stands. **`AR-UCI-BUSY`** (busy
>   `isready`/`stop`, the Architect's text) is placed beside `NFR-011`, owner Architect/Design.
> - **Test note 4, owed at merge:**
>   - BA/PM: `ADR-0044` D3, D4 (new D4.5), D5 and D11 carry dated fold lines (this hop).
>   - SE: the D5 latency sentence is in `src/uci-session.ts`'s header (it came with the merge).
>   - Scribe: the `TimeMode` line in `AGENTS.md`'s UCI notes is `scribe-agents-md-timemode`'s, claimed beside this hop.
>     SE F3 (no command for the A11 lane in `AGENTS.md`) goes with it.
> - **Each gap's disposition:**
>   - **QE-220-a (LOW):** folded into `ABC-221` as **A12**, QE-A3a's four asymmetric-increment rows in the A7 block.
>   - **`SEC-220-b` (INFO):** folded into `ABC-221` as test note 5 (the `milliseconds` comment).
>   - **`SEC-220-a` (INFO):** `ADR-0052` § Consequences carries a dated pointer: the quoted clause A reads ≤ 4 s.
>   - **QE-220-c (INFO):** the `NFR-008` headroom of 0.27–0.31 s is the Orchestrator's watch line (the catalog's
>     `NFR-008` row). `ABC-221` names it.
>   - **QE-220-f (INFO):** `ABC-222` A1 already reads the `setoption name TimeMode value …` line from game 1's log.
>   - **QE-220-b, QE-220-d, QE-220-e and `SEC-220-c` (INFO):** no ticket. `SEC-220-c` is QE's at the next `NFR-011`
>     re-read.
> - **Still open, blocks nothing:** the owner's confirmation of the whole-second reading (≤ 22 s means < 22 500 ms;
>   the FOLDED note below). `ABC-222` A5 reads the same bound in games. *(**Confirmed by the owner 2026-10-30**,
>   `orch-2026-10-30a` `…f4673b9f`: "Whole-second reading of "≤ 22 s" - confirm".)*
> - **`ABC-222` is now pullable** (DoR 10/10, Ready). `ABC-221`'s ADR and code waits are met (DoR 10/10, Ready; pull
>   after `ABC-222`, by the owner's "later").

> **AMENDED 2026-10-30 by Architect/Design** (task `arch-ABC-220-a14`, records only, at `main` `f22e31b3`). This
> answers the SE's F1 (`se-ABC-220` `…a76bc514`, build `68ba364c`). The ruling is in `ADR-0052` § Status and in its
> dated lines in D1, D7, D8 and D9.
>
> - **A14 is re-worded into A14a and A14b.** A14a is the lane row: one `readyok` per `isready`, in order, the busy
>   one straight after the `bestmove`, no line lost. A14b is a QE hand reading of the ≤ 100 ms bound, taken by an
>   asynchronous probe outside vitest (new test note 5; the `ABC-168` `A6` precedent). The bound, the order and
>   "no line lost" are unchanged, so no requirement moved and nothing goes to the owner.
> - **A10's text is confirmed:** `info string TimeMode takes level or simple-tournament, got <v>; kept <old>`.
> - **A14a's file is confirmed:** `src/uci.real-engine.test.ts` (Scope 6 dated line).
> - **The D5 bound's reading for Security/NFR:** "≤ 22 s" means a delay < 22 500 ms (§ NFR triggers).
> - Code `68ba364c` already matches A10 and A14a. QE writes and runs A14b's probe. No SE hop is owed. Size,
>   priority, column and DoR 10/10 are unchanged.

> **FOLDED 2026-10-30 by BA/PM** (task `bapm-owner-adr-fold`, records only, at `main` `a046e839`). The owner
> **accepted `ADR-0052` with one amendment** (`orch-2026-10-29g` `…3dd61448`, verbatim there): *"change 22.5s to 22s
> for simplicity and compatibility, ceiling also at 22s, no need to implement fraction of a second ceiling or time per
> move if it is not supported by current solution"*. The ADR's own text is the Architect's hop
> (`arch-adr-accept-0052-0053-0054`); where its amended D3 words differ from this page, the ADR rules.
>
> - **T stays 22 000 ms. The ceiling moves 22 500 → 22 000 ms**, equal to T. Whole seconds; nothing sub-second.
> - **So A2–A5 and A7 are unchanged in value** (they depend on T, not the ceiling): 40 × 22 s = 880 s of 900 s,
>   18 760 ms left after move 40 at δ = 31 ms, 97.9 % (83.2 % with 6 book moves). M1's ≥ 500 ms holds while δ ≤ 487 ms.
> - **Changed:** the title, scope 1, A6's deadline (≤ start + 22 000 ms), A11's wall reading, the NFR lines, § Dependencies
>   and the DoR.
> - **The wall reading (BA/PM's, on his "whole seconds"; confirm with the owner, it blocks nothing).**
>   *(**Confirmed by the owner 2026-10-30**, `orch-2026-10-30a` `…f4673b9f`: "Whole-second reading of "≤ 22 s" -
>   confirm".)* No `go` hands the
>   search more than 22 000 ms, read exactly on the virtual clock (A6). A real move also carries the stop overshoot
>   (`AR-NFR004-A`, ≤ ~31 ms) and the pipe, so its wall is a little over 22 000 ms. That is read **to the whole second**:
>   ≤ 22 s means a wall < 22 500 ms. `ADR-0052` D3 rejected T = ceiling at 22.5 s for this overshoot; the owner's
>   whole-second ceiling is what makes T = ceiling readable. The code is the same under any reading; only A11's and
>   `ABC-222` A5's bound would move.
> - **DoR 9/10 → 10/10. Backlog → Ready.** No further BA/PM hop.

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
- **Value:** one named setting that a match selects. It thinks a fixed 22 s a move, is never handed more than 22 s,
  never spends past the clock it is given, and keeps a margin at every period's end by arithmetic.

## Scope

All of it is `ADR-0052` (ACCEPTED 2026-10-30, as amended by the owner), D1–D3 and D7–D9.

1. **The setting `simple-tournament`:**
   - per-move budget T = **22 000 ms**;
   - blunder rate 0;
   - a **hard ceiling of 22 000 ms**, equal to T (owner, 2026-10-30): no `go` (clock, `movetime`, `infinite`, bare)
     hands the search a longer budget. Every branch of scope 3 is `≤ T`, so T holds it. The constants' names and
     number are amended `ADR-0052` D3's (was `SIMPLE_TOURNAMENT_BUDGET_MS` = 22 500 − 500 under a 22 500 ceiling).
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
6. **Where the code goes** (D8): `src/uci-session.ts` only (the value and its tuple, C, D3's rule, and its
   constants). Tests in `src/uci-session.test.ts` and its `ENGINE_DEEP` lane. **No new file.** *(Amended 2026-10-30,
   `arch-ABC-220-a14`, `ADR-0052` D8's dated line: A14a lives in the existing real-child lane,
   `src/uci.real-engine.test.ts` `UCI_DEEP`, with `runDialogue` still its only spawn site. A14b's probe is a record
   under `.grugops/context/`, not a delivery file.)* `src/engine.ts`,
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
  deadline is ≤ start + 22 000 ms (the ceiling, 2026-10-30). **Given** `go movetime 5000`, **then** the budget is 5 000. The rows read the
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
  offered at this build". The Architect confirms the exact text at design.) *(Confirmed 2026-10-30 by Architect/Design,
  `arch-ABC-220-a14`; `ADR-0052` D1's dated line. At this build the line is exactly `info string TimeMode takes level
  or simple-tournament, got <v>; kept <old>`, spelled from the same frozen tuple as the `combo` line. An empty value
  reads `got nothing`. The `uci-clock-mode` build gets D1's three-value text from the same code, with no edit.)*
- **A11 (wall, deep lane).** **Given** 5 fixed positions, **when** each is searched once at T = 22 000 on the real
  clock in plain `node`, **then** each returns in **≤ 22 s read to the whole second, that is < 22 500 ms** of wall
  (the 2026-10-30 reading above). The max and its excess over 22 000 ms are recorded; the excess is the overshoot,
  set against `AR-NFR004-A` (≤ ~31 ms) and reported. It runs in the `ENGINE_DEEP` lane, never in the default lane,
  and ALONE (~2 min).
- **A12 (`NFR-008`).** The default lane gains 0 real-clock rows. `npm test` wall stays ≤ 10 s at load1 ≤ 8.
- **A13 (busy `isready`, default lane; `ADR-0052` D7).** **Given** the setting and a `go`, **when** `isready` is sent
  before the search ends, **then** exactly one `readyok` is written, after the `bestmove`, and in order.
- **A14 (busy `isready` against the real child; `ADR-0052` D7, amended 2026-10-30).** *(Re-worded 2026-10-30 by
  Architect/Design, task `arch-ABC-220-a14`. It was: ~~"**Given** `node src/uci.ts` with the setting, **when** `go
  movetime 2000` and then `isready` 100 ms later are sent, **then** `readyok` arrives ≤ 100 ms after `bestmove`, and
  no line is lost"~~. That could not be read in the lane: the child is synchronous (`ABC-173` `C2`), so its script
  goes in at spawn and its output comes back whole at exit. The bound, the order and the count are unchanged. They
  are now split across two instruments.)* A14 is MET only when **A14a and A14b** are both met.
  - **A14a (lane row; `UCI_DEEP`, `src/uci.real-engine.test.ts`; the `ABC-119` form, unset = NOT DEFINED).**
    **Given** `node src/uci.ts` with one fixed script:
    `uci`, `setoption name TimeMode value simple-tournament`, `setoption name OwnBook value false`, `isready`,
    `position startpos moves e2e4`, `go movetime 2000`, `isready`, `quit`.
    The second `isready` is waiting in the child's input while the search runs. **Then:**
    - exactly 2 `readyok` and 1 `bestmove` are written. The first `readyok` comes before the `bestmove`. The busy
      one is the line straight after the `bestmove`, and it is the last line;
    - no line is lost: the `TimeMode` option line, `uciok` and an `info depth` line are present, and there is no
      `info string` line;
    - the `bestmove` is legal;
    - spawn to exit takes ≥ 2 000 ms;
    - every line passes M4, the exit code is 0 with no signal, and stderr is empty.

    The row reads no time between lines. It prints the spawn-to-exit wall and labels it as what it is.
  - **A14b (QE hand reading, the ≤ 100 ms bound; outside vitest).** At the QE hop, on the tip under review, QE runs
    the probe in test note 5 **once** against `node src/uci.ts`. The probe:
    - sends `uci`; after `uciok`, sends `setoption name TimeMode value simple-tournament`, `setoption name OwnBook
      value false` and `isready`;
    - after that `readyok`, sends `position startpos moves e2e4` and `go movetime 2000`;
    - **100 ms after writing `go`**, writes `isready`.

    **Then:**
    - **(R1)** the busy `readyok` arrives **≤ 100 ms after `bestmove` arrives**;
    - **(R2)** the `isready` was written before `bestmove` arrived, so it was busy. Otherwise R2 is missed, recorded
      as "not busy";
    - **(R3)** exactly one `readyok` per `isready` (2 in all) and one `bestmove`, and the busy `readyok` is the first
      line after the `bestmove`.

    Then `quit`, and the exit code is recorded. A reply that has not arrived 10 000 ms after its command is a miss,
    recorded as "no reply". The record holds the host CPU and OS, the Node version, load1 (read just before the
    spawn), the tip sha, R1's value in ms, and R1–R3 each marked **met** or **missed**. It also records two values
    that are not graded: `go` → `bestmove` and `go` → `isready`. One run counts, and there is no re-run to pick a
    better one. A miss is reported, not trimmed. Any miss makes A14 NOT MET in the QE verdict, and the raw output is
    attached.

## NFR triggers

- **`NFR-004` (owner's, Q4, amended 2026-10-30): a 22 s ceiling for the setting**, equal to its budget. The text is
  amended `ADR-0052` § Consequences' (was *"…; 22.5 s in UCI `TimeMode` `simple-tournament` (budget 22 s)."*), placed
  by Security/NFR at this ticket's gate. The clamp stays 32 000. A6 reads it exactly, A11 to the whole second;
  `ABC-222` reads it in games. `AR-NFR004-A` (≤ ~31 ms) is re-read at 22 s.
- **`ADR-0044` D5 latency:** `isready`/`stop` mid-search are answered ≤ one budget late, ≤ 22 s here. Accepted with
  no worker (`ADR-0052` D7). **Owed:** the accepted-risk entry beside `NFR-011`, placed by Security/NFR: *"busy
  `isready`/`stop`: answered ≤ one budget + `AR-NFR004-A` late; ≤ 22 s in `simple-tournament`, ≤ 60 s in
  `uci-clock-mode`; one `readyok` per `isready`, in order"*, plus A13 and A14.
  - *(The bound's reading, 2026-10-30, `arch-ABC-220-a14`; `ADR-0052` D7's dated line, for Security/NFR.)* The
    latency is one budget (≤ 22 000 ms, which A6 reads exactly), plus `AR-NFR004-A` (≤ ~31 ms), plus the drain
    (≤ 100 ms, A14b R1). The worst case is ≈ 22 131 ms. "≤ 22 s" is read to the whole second, as A11 is: a delay
    **< 22 500 ms**. It is not read as ≤ 22 000 ms exactly, which no search could meet with the budget equal to the
    ceiling. The entry adds that reading: *"… ≤ 22 s in `simple-tournament` (read to the whole second: < 22 500 ms)
    …"*. It is the same whole-second reading the FOLDED note asks the owner to confirm. It changes no code.
    *(**Confirmed by the owner 2026-10-30**, `orch-2026-10-30a` `…f4673b9f`: "Whole-second reading of "≤ 22 s" - confirm".)*
- **`NFR-009`:** 22 s is inside `ABC-212`'s 30 s reading (≤ 16 MiB, flat). No re-read is owed.
- **`NFR-008`:** A12. **`NFR-005`, `NFR-011`, `NFR-012`:** unchanged (their referent is `TimeMode level`).
- **Security (ASVS L1):** one option, matched exactly against a fixed tuple. The `go` numbers are already parsed and
  refused today. A negative or huge `wtime` lands on C's floor of 1 or on the cap. No new input class.

## Test notes

1. Default lane: A1–A10, A12 and A13, on the virtual clock, in `src/uci-session.test.ts`'s pattern (`ADR-0027`). A3,
   A4, A5 and A7's `tc=40/60` row are each one simulated sequence.
2. `ENGINE_DEEP` lane: A11, ~2 min, ALONE, never during a reading. Opt-in real-child lane (`UCI_DEEP`,
   `src/uci.real-engine.test.ts`): A14a. A14b is test note 5. *(Amended 2026-10-30, `arch-ABC-220-a14`.)*
3. UAT is owed (production lines change). The QE verdict signs it (`…5aaf7cec` item 2). `ABC-222` is the real-clock
   smoke.
4. **Owed at merge** (`ADR-0052` § Consequences): BA/PM folds the dated lines into `ADR-0044` D3, D4 (a new D4.5), D5
   and D11. The Scribe adds the `TimeMode` line to `AGENTS.md`'s UCI notes. The SE adds D5's latency sentence to
   `src/uci-session.ts`'s header.
5. **A14b's probe** (added 2026-10-30, `arch-ABC-220-a14`; the `ABC-168` test note 6 precedent).
   - **Where it lives.** QE writes one script under `.grugops/context/qe-ABC-220/probe/`. It may start from
     `qe-ABC-168`'s `probe/a6-probe.mjs`. It runs with plain `node`, never through vitest. QE's note records the
     script's path, its command and its raw output.
   - **Why it may spawn asynchronously.** `ABC-173` `C2` covers `src/**/*.test.ts` only, and the `ADR-0008` heap
     ceiling covers vitest runs only. Neither is edited or waived. The probe is not a delivery file, and it adds no
     spawn to the default lane (`NFR-008` unchanged).
   - **How it reads.**
     - The child is `process.execPath` with `src/uci.ts`, spawned asynchronously with no shell, from the repository.
     - Time is `performance.now()`, taken when each stdout line arrives and right after each write.
     - load1 is `os.loadavg()[0]`, which works on any host. The `sysctl` read in `a6-probe.mjs` is macOS only.
   - **When it runs.** In QE's ALONE window, before or after A11 and A12's wall reading, never alongside them. It
     takes about 3 s.

## Size and priority

- **Size: M.** One option, one small function (C), D3's rule, its constants and 14 rows, in one file. `ABC-212` was
  M for a similar spread.
- **Priority: P2.** It is the owner's own idea and his milestone 1. Nothing is broken without it.

## Dependencies

- **`ADR-0052` ACCEPTED by the owner, 2026-10-30, with his amendment** (OQ-0052-1 closed; `orch-2026-10-29g`
  `…3dd61448`): T and the ceiling both 22 s. Nothing blocks the build.
- Shares `src/uci-session.ts` with `ABC-221` (milestone 2) and with `EPIC-010`'s `ABC-230`. Whichever merges second
  rebases; the Orchestrator orders them.
- Owner answers: all in (Q1–Q4, Q8; 2026-10-29).

## Definition of Ready (re-scored 2026-10-30, `bapm-owner-adr-fold`)

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ owner word (Q1–Q4); user, pain and value stated |
| 2 | scope and out-of-scope | ✅ 6 scope items, each from `ADR-0052`; CLI, levels, clock mode, clamp and games out |
| 3 | INVEST | ✅ independent of `ABC-221`; M; testable |
| 4 | testable, measurable acceptance | ✅ A1–A14: byte-exact lines, ms, %, a row-for-row identity, deadline ≤ start + 22 000 ms, wall < 22 500 ms (22 s to the whole second), in-order `readyok` |
| 5 | dependencies known | ✅ `ADR-0052` (ACCEPTED 2026-10-30, amended); owner answers in |
| 6 | NFR triggers with targets | ✅ `NFR-004` 22 s (owner's word, 2026-10-30); D5 ≤ 22 s accepted-risk entry; `NFR-009` inside the 30 s reading; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 4 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ none: `ADR-0052` accepted 2026-10-30. The whole-second wall reading is to be confirmed with the owner; it changes no code. *(Confirmed by the owner 2026-10-30, `…f4673b9f`.)* |

**DoR 10/10 (2026-10-30). Ready.** The owner accepted `ADR-0052`, so ABC-220 is ready to pull. His amendment
moved only the ceiling, so A2–A7 keep their numbers. *(Was 9/10, waiting on OQ-0052-1.)* It shares
`src/uci-session.ts` with `ABC-230`; the Orchestrator orders them.

**Closed 2026-10-30 (`bapm-ABC-220-merge-fold`): Done**, merged at `ec1e835b` on QE's PASS_WITH_GAPS (`…7a09c5e1`,
which signs UAT) and Security/NFR's PASS_WITH_RISKS (`secnfr-ABC-220`). The MERGED block at the top has each gap's
disposition.
