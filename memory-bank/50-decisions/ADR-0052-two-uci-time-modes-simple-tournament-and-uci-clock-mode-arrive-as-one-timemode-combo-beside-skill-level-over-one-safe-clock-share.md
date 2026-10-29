---
kind: adr
id: ADR-0052
---
# ADR-0052: Two UCI time modes, `simple-tournament` and `uci-clock-mode`, arrive as one `TimeMode` combo beside `Skill Level`, over one safe clock share. Levels 1–7 do not change

## Status

**proposed** 2026-10-29 by Architect/Design (task `arch-epic009-settings`), at `main` `b5df6cde`. **The owner accepts
or declines it.** Nothing is built on it, and no `EPIC-009` build ticket leaves `Backlog` on it, until he accepts it.

- **The ask** is the owner's word of 2026-10-29 (Orchestrator note
  `.grugops/context/orch-2026-10-29g/notes/20261029T221000Z-orchestrator-decision-a67f71ac.md`, a transcription and
  not a stamp): *"Initially let's add 22.5 second separate difficulty setting and use that, later UCI clock mode"*;
  *"2 new difficulty settings then, 22.5s one could be simple-tournament and other one uci-clock-mode (maybe separate
  inputs)"*; *"22.5 ceiling"*; *"increase to 60s"*; *"cutechess matches"*; the measures accepted (0 losses on time,
  closest call ≥ 500 ms, ≥ 75 % clock use per period). *"Let the difficulty setting stay."*
- **What it amends on acceptance, each named.** The folds are dated lines added by BA/PM, the precedent `ADR-0045`
  set. Each takes effect at the merge of the ticket that builds it, not at acceptance.
  - `ADR-0044` D3: the `uci` row gains the `TimeMode` option line; the `setoption` row gains `TimeMode`.
  - `ADR-0044` D4: a new D4.5 (the two modes' budgets, D2–D4 below). D4.1–D4.4 are unchanged for `TimeMode level`.
  - `ADR-0044` D5: the accepted latency bound becomes one budget late in the active mode: ≤ 22.5 s in
    `simple-tournament` and ≤ 60 s in `uci-clock-mode` (D7 below).
  - `ADR-0044` D11: `Skill Level` governs only while `TimeMode` is `level` (D1 below).
  - `ADR-0045` § AMENDMENT A3: `HARD_CEILING_MS` 32 000 → **60 000**, at the `uci-clock-mode` build only, with the
    same per-setting rule (D6 below).
  - `NFR-004`'s accepted text (§ Consequences). The bound is the owner's (Q4, Q5); Security/NFR places the text.
- **What it does not amend.** `LEVELS[1..7]`, `DEFAULT_LEVEL`, `EASIEST_LEVEL`, `HARDEST_LEVEL`, `Difficulty`, the
  CLI, `createLevel` and the blunder path, D4.1's `G` and its constants (`MOVE_OVERHEAD_MS` 50,
  `DEFAULT_MOVES_TO_GO` 20) for `TimeMode level`, `ADR-0027`, `ADR-0038`, `ADR-0044` D8 (no new file is loaded) and
  D12, `ADR-0002`.
- **Evidence** is in the shared context, not restated here: the System Analyst's time map
  `sa-ideas-verify` `…1ccf0010` (code lines, probes P1–P5); this task's notes in
  `.grugops/context/arch-epic009-settings/notes/`; the allocation arithmetic, `raw/alloc.mjs` and `raw/alloc.txt` in
  the same task context (a simulated clock, no engine, no game). No probe of the engine was run at this hop.

## Context

**What today does** (SA `…1ccf0010` §§ 1–9; `EPIC-009` T1–T8):

- `go` gives `G = max(1, min(t / (movestogo ?? 20) + inc / 2, t − 50))` (`src/uci-session.ts:217-225`), and the
  level caps it: `min(G, LEVELS[skill].budgetMs)` (`:286-287`). The engine clamps at `HARD_CEILING_MS` = 32 000
  (`src/engine.ts:141`, `:539`) and reads the clock every 1 024 nodes. Every move spends its whole budget.
- **At a period's last move, `G = t − 50`.** Because every earlier move spent its whole share, `Skill Level` 7 under
  40/15 reaches move 40 with about one share left and ends it about 50 ms from the flag, less the overshoot. The
  arithmetic in `raw/alloc.txt` gives 19 ms left at an overshoot of 31 ms.
- The overshoot past a deadline is ≤ ~31 ms (`AR-NFR004-A`; 30 004 ms at 30 s, QE `qe-ABC-212` `A4`). The SA's
  probes through a Node pipe show the wall minus the engine's own time at 1–3 ms (P1 22 501 for 22 500, P4 1 953 for
  1 951, P5 1 001 for 1 000).
- `Skill Level` is a `spin` 1–7, ordered weakest to strongest (`ABC-101` ruling 1). `Difficulty` and `LEVELS` are the
  same ordinal union (`src/cli-options.ts:71`, `src/levels.ts:49`).

**What `cutechess-cli` does**, read at this hop in its source at tag `v1.5.1` (the pinned version), not run:

- `projects/lib/src/uciengine.cpp` `startThinking`: it sends `wtime`/`btime` always, `winc`/`binc` when above 0, and
  **`movestogo` whenever `movesLeft() > 0`**, so `tc=40/900` sends `movestogo` 40…1. This closes SA `…1ccf0010` § 7's
  first `UNKNOWN - verify` for this version. `ABC-222` still logs it.
- `sendOption` writes `setoption name <name> value <value>`.
- `projects/lib/src/timecontrol.cpp` `update()`: the elapsed time is measured from `startTimer()` to the move, in ms.
  A move **expires when `elapsed > timeLeft + expiryMargin`**. At a period's end the base time is **added** to what is
  left. So with `timemargin=0` the closest call is exactly the clock left after the move.
- Other GUIs: `UNKNOWN - verify`.

**The tension the owner's words hold** (Orchestrator `…a67f71ac`): a 22.5 s ceiling and a ≥ 500 ms closest call
cannot both hold at a fixed 22.5 s a move. 40 × 22 500 = 900 000 ms, the whole period. A fixed budget must sit under
22.5 s.

**The constraints.** Levels 1–7 unchanged and ordered (`EPIC-009` M3). UCI is the required surface (Q1: cutechess
matches). `Skill Level` is a `spin` and cannot carry a word. `ADR-0045` A3 rejected a per-call ceiling field. The
default test lane runs on the virtual clock only (`NFR-008`). KISS.

## Decision

### D1. The input form: one UCI `combo` option, `TimeMode`, beside `Skill Level`

- **The option line, at the `simple-tournament` build:**
  `option name TimeMode type combo default level var level var simple-tournament`
- **At the `uci-clock-mode` build** it gains one value, and only then. A value that does not work yet is not offered:
  `option name TimeMode type combo default level var level var simple-tournament var uci-clock-mode`
- It is written after the `Skill Level` line and before `uciok`. The `Skill Level` line stays byte-identical:
  `default 5 min 1 max 7`.
- **The values:**
  - `level` (the default): today's behaviour, unchanged. `Skill Level` sets the budget cap and the blunder rate, and
    `G` is D4.1's.
  - `simple-tournament`: D3 below.
  - `uci-clock-mode`: D4 below.
- **`setoption name TimeMode value <v>`.** The name matches case-insensitively (D3's rule). The value matches
  **exactly** one of the offered `var` strings, a closed set held as a frozen tuple. Any other value keeps the old
  one and writes one line, `info string TimeMode takes level, simple-tournament or uci-clock-mode, got <v>; kept
  <old>` (D3's invalid-value rule, text through `printableOf`). `ucinewgame` does not reset it (D3's rule for options).
- **While `TimeMode` is not `level`, `Skill Level` is not read at all.** The search is the rate-0 path:
  `chooseMove(position, { budgetMs, now, maxDepth, maxNodes })` with D12's limits, and one `info … score …` line. A
  `Skill Level` set meanwhile is kept and takes effect when `TimeMode` returns to `level`. The blunder path is never
  reached from a mode, so `createLevel`, `blunder` and the seed draw are untouched. The injected `random` is not
  consumed in a mode.
- **The exact `cutechess-cli` lines** (per engine, or under `-each`):
  - simple-tournament: `option.TimeMode=simple-tournament`
  - uci-clock-mode: `option.TimeMode=uci-clock-mode`
  - today's behaviour, for a baseline: `option.TimeMode=level "option.Skill Level=7"` (or no `TimeMode` at all).
  - The name has no space, so it needs no shell quoting, unlike `"option.Skill Level=7"`. It follows `OwnBook`'s
    spelling. Whether cutechess refuses a value outside the `var` list before sending it is `UNKNOWN - verify`; the
    engine refuses it either way. `ABC-222`'s first game log must show the `setoption name TimeMode value …` line.
- **The CLI gets nothing from this ADR.** `Difficulty`, `--difficulty`, the start-up question and the PGN tag are
  unchanged. The CLI has no clock, and the owner's user is cutechess (Q1). If CLI parity is ever wanted, its form is
  a separate flag (`--time-mode simple-tournament`), never a `Difficulty` value, so `Difficulty` stays the ordinal
  union. Whether to keep CLI parity in scope is BA/PM's (`bapm-amend-epic009`).

### D2. One safe clock share, `C`, shared by both modes

For the side to move, with clock `t`, increment `i` (default 0) and `movestogo m` (default 20, D4.1's
`DEFAULT_MOVES_TO_GO`):

```
C = max(1, min( (t − RESERVE − m × OVERHEAD) / m + i ,  t − RESERVE − OVERHEAD ))
RESERVE  = 1 000 ms   (kept back at the time control)
OVERHEAD =   100 ms   (charged per move still to play before the control)
```

- **The first term spreads the clock.** It sets aside `RESERVE` for the control and `OVERHEAD` for each move still to
  play, divides the rest evenly, and adds the increment, which comes back after the move.
- **The second term is the hard stop on the real remaining clock.** No move's budget leaves less than
  `RESERVE + OVERHEAD` on the clock as reported in this `go`. The engine's existing deadline enforces it: the search
  is aborted at `start + budget`, checked every 1 024 nodes. No new timer is added.
- **The floor of 1** keeps D4.1's degenerate case. Below `RESERVE + OVERHEAD` the engine plays its unabortable depth 1
  at once.
- **It is closed-loop.** It is recomputed from the clock the GUI reports at every `go`, so an overrun on one move
  shrinks the next shares. The error does not accumulate.
- **What it guarantees, by arithmetic.** If each move costs its budget plus `δ` (overshoot plus I/O) and `δ ≤
  OVERHEAD`, the clock left after the last move of a period is `RESERVE + OVERHEAD − δ ≥ RESERVE`. On the virtual
  clock, with `δ` = 31 ms, that is **1 069 ms** (`raw/alloc.txt`). On the real clock, M1's ≥ 500 ms holds while `δ` on
  the last move is ≤ 600 ms at 40/15, and ≤ 456 ms per move at the scaled `tc=40/60`.
- `C` is a private function of `src/uci-session.ts`, beside `parseGo`. Its two constants are named there. D4.1's
  `MOVE_OVERHEAD_MS` (50) stays for `TimeMode level` only.

### D3. `simple-tournament`: a fixed T = 22 000 ms under a 22 500 ms ceiling, never more than the clock safely allows

- **T = 22 000 ms**, rate 0. It is the ceiling less a named margin: `SIMPLE_TOURNAMENT_CEILING_MS` = 22 500, and
  `SIMPLE_TOURNAMENT_BUDGET_MS` = 22 500 − 500.
- **The budget at `go`:**
  - `movetime x`: `min(x, T)`. An explicit move time wins over a clock, as in D4.1.
  - a clock for the side to move: **`min(T, C)`**.
  - no time token (bare `go`, `infinite`, `ponder`, only `depth`/`nodes`/`mate`): `T`.
- **The ruling on `wtime`: it is not ignored. The GUI's clock caps T, through `C`, not through D4.1's `G`.**
  - At 40/15 with `movestogo`, `C` starts at 22 375 ms and only grows through the period, because each move spends
    22 000 + `δ` < `C`. **So T binds on every move, and the setting is the fixed 22 s the owner asked for.**
  - Under a shorter clock, or without `movestogo`, `C` binds first and keeps the reserve. A fixed setting that ignored
    `wtime` would lose on time under any clock shorter than 40/15. `G`'s `t − 50` at a period's last move is the very
    margin that misses M1 (§ Context).
- **Why 22 000, and not 22 500 or 20 500.**
  - 22 500 has 0 ms under its own ceiling. The overshoot (≤ ~31 ms) would break the ceiling, and `C` (22 375) would
    bind from move 1, so it would not be a fixed setting at 40/15.
  - 20 500 follows `NFR-004`'s "budget + 2 s" rule, which derives a level's ceiling from its budget. Here the owner
    set the ceiling directly. 500 ms is 16 × the measured overshoot bound.
  - At 22 000: 40 × (22 000 + 31) = 881 240 ms, so **18 760 ms** are left after move 40 and **97.9 %** of the period is
    used. With the book's maximum of 6 engine moves (`maxPly` 12) the period still uses **83.2 %**. Three periods, and
    `tc=40/60`, keep the closest call at ≥ 1 069 ms on the virtual clock (`raw/alloc.txt`). M1 and M2 hold by
    arithmetic.
  - The owner is told the number. He may move T anywhere under 22 500. The rules above do not change with it.

### D4. `uci-clock-mode` (a later milestone; designed now): the clock, the safe share, a 59.5 s cap under a 60 s ceiling

- **The budget at `go`:**
  - `movetime x`: `min(x, CLOCK_MODE_MAX_BUDGET_MS)`.
  - a clock for the side to move: `min(CLOCK_MODE_MAX_BUDGET_MS, C)`.
  - no time token: `T` (22 000). A mode with no clock to read plays the tournament pace.
- `CLOCK_MODE_CEILING_MS` = 60 000 (the owner's Q5) and `CLOCK_MODE_MAX_BUDGET_MS` = 60 000 − 500 = 59 500: the same
  500 ms margin as D3. It is **not** capped at any level's budget. `Skill Level` is not read (D1).
- **The allocation rule is D2's `C`, with nothing more.** Remaining ÷ `movestogo`, the increment, the fallback of 20
  without `movestogo`, the reserve and the hard stop. Spending more on a hard move stays out (`EPIC-009` § Out of
  scope).
- **By arithmetic** (`raw/alloc.txt`; `ABC-221`'s rows): one 40/15 period leaves ≥ 1 069 ms after every move and uses
  99.9 %. With 6 book moves the banked time is spent on later moves, and the closest call is the same. Three periods,
  the same. With no `movestogo`, 80 moves leave ≥ 117 s. `go wtime 3000 movestogo 1` gets 1 900 ms and leaves ≥
  1 069. `go wtime 800` gets 1 ms, and depth 1 still answers. `wtime 3600000 movestogo 40` gets 59 500.

### D5. The overhead model, term by term

| term | value | source | where it is paid |
|---|---|---|---|
| overshoot past the deadline | ≤ ~31 ms | `AR-NFR004-A`; QE `qe-ABC-212` `A4` (30 004 at 30 s) | inside `OVERHEAD` (100) |
| session work before the search, and the pipe both ways | 1–3 ms through a Node driver | SA P1, P4, P5 (wall − engine time) | inside `OVERHEAD` |
| cutechess's own read and timer | `UNKNOWN - verify` | its timer runs from `startTimer()` to the move | inside `OVERHEAD`; then the slack below |
| D4.1's 50 ms (`MOVE_OVERHEAD_MS`) | 50 ms, at a period's last move only | `ADR-0044` D4.1 | **levels only.** The modes do not use it |
| the reserve at the control | 1 000 ms | D2 | `RESERVE` |
| the margin under a ceiling | 500 ms | D3, D4 | between T (or 59 500) and its `NFR-004` ceiling |

The slack is wide. M1's ≥ 500 ms survives `δ` up to 600 ms on a period's last move at 40/15. In `simple-tournament` at
40/15 the cushion is 20 000 − 40 × `δ` ms after move 40, about 487 ms of `δ` per move on average. `ABC-222` reads the
real `δ` from cutechess's per-move times.

### D6. The engine clamp: one clamp, its value moved at the `uci-clock-mode` build only

- **At the `simple-tournament` build, `src/engine.ts` does not change.** 22 000 is under the 32 000 clamp.
- **At the `uci-clock-mode` build, `HARD_CEILING_MS` goes from 32 000 to 60 000**, the largest ceiling in force. It is
  `ADR-0045` A3's shape (`RF-1`): one absolute clamp at the largest ceiling. Each setting's own ceiling is held by its
  data, at the setting:
  - levels 1–7 by `LEVELS[L].budgetMs`, unchanged (5, 7, 32 s);
  - `simple-tournament` by T (22 000 under 22 500);
  - `uci-clock-mode` by `CLOCK_MODE_MAX_BUDGET_MS` (59 500 under 60 000).
- **Levels 1–7 are value-identical after the move.** Every level budget is ≤ 30 000, so `min(budget, 60 000)` =
  `min(budget, 32 000)`. A bare `go` at a level is still the level's budget (D4.1's `G = HARD_CEILING_MS`, then D4.2's
  cap). `movetime 60000` at level 7 still searches 30 000. The blunder path's `min(level.budgetMs, HARD_CEILING_MS)` is
  unchanged in value.
- **What does move:** `NFR-004` clause B's bound on a raw `chooseMove` call goes from 32 s to 60 s. That is the
  owner's Q5 word. Every surface still derives its budget from a level or a mode.
- **Rejected again: a per-call ceiling** (an `EngineOptions` field or a third `Level` field). `ADR-0045` A3's reasons
  stand: it reopens `ADR-0027` decision 3 or `ADR-0038` decision 1, and it buys nothing the data rule does not hold.

### D7. One thread at budgets up to 60 s: the stop and `isready` latency

- **The risk.** `ADR-0044` D5 stands: `isready` and `stop` sent during a search are answered when the search ends, at
  most one budget late. That is ≤ 22.5 s in `simple-tournament` (inside level 7's accepted 32 s) and **≤ 60 s in
  `uci-clock-mode`**. `RISK-EPIC009-02` names it.
- **What cutechess does** (`ADR-0045` A4's source read): it pings only between moves, and it sends a mid-search
  `stop` only at a game end or when pondering. After that `stop` it kills the engine at `IdleTimeout` (15 000 ms). In
  timed play without pondering a 60 s search is not interrupted. At a game end the result is already recorded. With
  `restart=on` the next game gets a fresh engine. Other GUIs are `UNKNOWN - verify`.
- **Ruled: the latency is accepted in both modes, and the worker is not owed first.** The worker stays pre-designed
  (`ADR-0044` D5). Its triggers do not change: pondering wanted, or a GUI the owner uses shown to stall or forfeit.
  It would also add a file `dist/uci.js` loads, which reopens D8's fence.
- **What it owes.** It owes no new `NFR` bound. Adding a bound is the owner's, and the risk is already accepted
  under `ADR-0044` D5.
  - **An accepted-risk entry**, placed by Security/NFR beside `NFR-011` (which is idle-only and does not move):
    *"busy `isready`/`stop`: answered ≤ one budget + `AR-NFR004-A` late; ≤ 22.5 s in `simple-tournament`, ≤ 60 s in
    `uci-clock-mode`; one `readyok` per `isready`, in order"*.
  - **Two test rows.** In the default lane (virtual clock), `isready` sent after a `go` is answered with exactly one
    `readyok`, written after the `bestmove`. In the opt-in real-child lane (the `ABC-119` precedent; unset means NOT
    DEFINED), `node src/uci.ts` with `TimeMode` set, `go movetime 2000`, then `isready` 100 ms later: `readyok` arrives
    ≤ 100 ms after `bestmove`, and no line is lost. The bound scales with the budget, so 2 s stands for 60 s. No 60 s
    real-clock row runs in any lane but `ENGINE_DEEP`.

### D8. Where the code goes

- **`simple-tournament` build:** `src/uci-session.ts` only. The `TimeMode` value and its frozen tuple, D2's `C`, D3's
  rule, and the constants `SIMPLE_TOURNAMENT_CEILING_MS`, `SIMPLE_TOURNAMENT_BUDGET_MS`, `CLOCK_RESERVE_MS` and
  `CLOCK_OVERHEAD_MS`. Tests in `src/uci-session.test.ts` and its `ENGINE_DEEP` lane. **No new file**, so D8's closure,
  `ADR-0011`'s census and `NFR-008`'s per-file floor do not move.
- **`uci-clock-mode` build:** `src/uci-session.ts` (the third value, D4's rule, `CLOCK_MODE_CEILING_MS`,
  `CLOCK_MODE_MAX_BUDGET_MS`) and **one value** in `src/engine.ts` (`HARD_CEILING_MS`, and its header comment's
  numbers).
- `src/levels.ts`, `src/cli-options.ts`, `src/cli.ts`, `src/startup-questions.ts`, `src/pgn.ts` and `src/search.ts`
  do not change.

### D9. Tests (shape only; the tickets write them)

- **Default lane, virtual clock, `src/uci-session.test.ts`** (`ADR-0027`; each simulated search takes its budget + 31
  ms, a book move 0 ms):
  - the `uci` reply, with the `TimeMode` line and the `Skill Level` line byte-identical;
  - `setoption` for each value; one invalid value; a case-variant name; persistence across `ucinewgame`;
  - **identity (M3):** with `TimeMode level`, a whole 40/15 period at `Skill Level` 1–7 gives budgets equal to base,
    row for row;
  - in each mode at `Skill Level` 1, no blunder draw (the injected `random` is not called), and D12's `depth` limit is
    honoured;
  - `simple-tournament`: no clock gives 22 000; a 40/15 period gives 22 000 on all 40 moves, ≥ 1 000 ms left after
    each, and ≥ 75 % used; `tc=40/60` keeps ≥ 1 000 ms; `movetime 5000` gives 5 000;
  - `uci-clock-mode`: `ABC-221`'s A2–A7 as written. They hold by D4's arithmetic;
  - D7's in-order `readyok` row.
- **`ENGINE_DEEP` lane, real clock, ALONE:** one search at 22 000 returns ≤ 22 500 (`simple-tournament`). At the
  clock-mode build, one at 59 500 returns ≤ 60 000, with the max completed depth logged against `KEY_ARRAY_CAPACITY`'s
  tripwire (≥ 100 → Architect; the runaway guard at `src/search.ts:121` already bounds it).
- **Opt-in real-child lane:** D7's latency row.
- **Acceptance outside vitest:** the smoke reading per mode (5–10 cutechess games at `tc=40/900`, `timemargin=0`, the
  lines in D1), graded on M1 and M2. Major validation (≥ 100 games) is later and out of this MVP (owner Q1).

## Alternatives

| # | option | why not |
|---|---|---|
| A1 | `Skill Level` 8 (and 9) for the modes | Breaks "weakest to strongest": 22 s sits between 6 (5 s) and 7 (30 s), and a clock mode has no fixed budget to order at all. Moving `max` and `HARDEST_LEVEL` breaks M3's identity pins |
| A2 | `Skill Level` turned into a `combo` that carries the words | Changes the option's type under every GUI that already saved `Skill Level 7`, and `ADR-0044` D11's `spin`. A word in a `spin` is not legal UCI |
| A3 | Two `check` options (`SimpleTournament`, `UciClockMode`) | A four-state input for a three-state choice. Both on is an illegal state that needs a precedence rule and a test. A `combo` makes the modes exclusive by construction |
| A4 | A named `Difficulty` value in the CLI (`--difficulty simple-tournament`) | The CLI has no clock, and the user is cutechess (Q1). It widens `Difficulty` and `LEVELS`' key, the start-up question, the PGN tag and the refusal text: `ABC-219`'s M size for a surface nobody plays. If ever wanted, it is a separate flag (D1) |
| A5 | `simple-tournament` ignores `wtime` (always T) | Loses on time under any clock shorter than 40/15, for example `ABC-222`'s scaled `tc=40/60` |
| A6 | `simple-tournament` capped by D4.1's `G` (`min(G, T)`, `ABC-220`'s first text) | At 40/15, T binds and it is safe. Under a shorter clock `G`'s `t − 50` at the last move leaves 19 ms on the virtual clock (`raw/alloc.txt`): M1 fails exactly where the scaled reading looks. `C` costs one small function, and the clock mode needs it anyway |
| A7 | T = 22 500 or 20 500 | D3 |
| A8 | A per-call ceiling instead of moving the clamp | D6; `ADR-0045` A3 |
| A9 | A different `movestogo` default (30, 40) for the modes | With cutechess sending `movestogo` (§ Context) the default is a fallback. 20 is D4.1's constant, and 80 moves of sudden death still leave ≥ 117 s. Tuning it is `ABC-222`'s to measure, not to argue |
| A10 | A soft/hard split, early stop on a stable root, more time on a hard move | A search change with a strength reading. `EPIC-009` § Out of scope |

## Consequences

- **`NFR-004`, proposed text for the owner** (Security/NFR places it at each gate):
  - **At the `simple-tournament` build:** *"Engine returns a move in ≤ 3 s at default difficulty (level 5); hard
    ceiling per level: 5 s at levels 1–5, 7 s at level 6, 32 s at level 7 (a level above 5 gets its budget + 2 s);
    22.5 s in UCI `TimeMode` `simple-tournament` (budget 22 s)."* The clamp stays 32 000.
  - **At the `uci-clock-mode` build**, appended: *"; 60 s in UCI `TimeMode` `uci-clock-mode` (budget ≤ 59.5 s). The
    engine's one clamp sits at the largest ceiling in force, 60 s."* `HARD_CEILING_MS` = 60 000.
  - `AR-NFR004-A` (≤ ~31 ms) is re-read by Security/NFR at 22 s, and at 59.5 s at the clock-mode gate.
- **`NFR-009`:** 22 s is inside `ABC-212`'s 30 s reading (≤ 16 MiB, flat), so no re-read is owed at the
  `simple-tournament` build. **A re-read at 59.5 s is owed at the `uci-clock-mode` gate.** The table is allocated once
  (`ADR-0025`), so a flat reading is expected. That is `UNKNOWN - verify`.
- **`NFR-008`:** virtual-clock rows only. At the clock-mode build, any default-lane row that hands the engine an
  unclamped budget (the `RF-1` rows) reads the clock up to 60 000 instead of 32 000. Its virtual step scales with the
  clamp, as at `ABC-212` (`ADR-0046`), so the reading count does not grow. The SE checks this at the build.
- **`NFR-011`, `NFR-012`, `NFR-005`:** unchanged. Their referent is `TimeMode level`, the default.
- **Security (ASVS L1):** one option whose value is matched exactly against a fixed tuple, and the `go` numbers already
  parsed and refused today (`milliseconds`, `positiveInteger`). A negative or huge `wtime` lands on `C`'s floor of 1
  or on the cap. There is no new input class, and no trigger beyond Security/NFR's usual closed-set check.
- **The tickets** (BA/PM's to fold; `bapm-amend-epic009` runs in parallel):
  - the `simple-tournament` ticket's UCI rule reads **`min(T, C)`**, not `min(G, T)`, and T is 22 000;
  - `ABC-221`'s A2–A7 hold by D4's arithmetic as written, and its 32 s reads 60 s / 59.5 s;
  - `ABC-219` (CLI) is not needed by this design. Whether it stays is BA/PM's;
  - the smoke readings use the D1 lines.
- **`EPIC-010`'s `G9`** ("`HARD_CEILING_MS` byte-identical") binds `EPIC-010`'s own tickets' diffs. The clamp moves
  only in `uci-clock-mode`'s ticket. If both are in flight, whichever merges second rebases, and the Orchestrator
  orders them.
- **Docs owed at build time:** the `TimeMode` line in `AGENTS.md`'s UCI notes (the Scribe), and `src/uci-session.ts`'s
  header (the D5 latency sentence).

## Rollback

- **`simple-tournament`:** remove the `TimeMode` option, `C` and the four constants from `src/uci-session.ts`, and
  their rows. Nothing else moved.
- **`uci-clock-mode`:** remove the third value and D4's rule, and set `HARD_CEILING_MS` back to 32 000. Levels 1–7
  never moved, so no verdict goes STALE.
- The `NFR-004` text and the `ADR-0044` / `ADR-0045` fold lines go back with each.

## Owner questions

- **OQ-0052-1. Accept this ADR?** The points, for one answer:
  1. the form: a `TimeMode` combo (`level` default, `simple-tournament`, later `uci-clock-mode`); `Skill Level` and
     levels 1–7 unchanged; nothing in the CLI;
  2. **T = 22.0 s** under your 22.5 s ceiling (D3: 22.5 s itself leaves 0 ms and ~50 ms at move 40);
  3. both modes keep ≥ 1 s at every time control and never spend past the clock (D2);
  4. the clock mode's 60 s ceiling, with the engine's one clamp moved from 32 s to 60 s at that ticket (D6);
  5. answers to `isready`/`stop` up to one move late, ≤ 60 s in the clock mode, accepted with no worker (D7).
  - Options: (a) accept as written; (b) accept with a different T (anything under 22.5 s); (c) decline.
  - **No default.** An ADR is accepted only on your word. Until then nothing is built on it.
