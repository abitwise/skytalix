---
kind: adr
id: ADR-0052
---
# ADR-0052: Two UCI time modes, `simple-tournament` and `uci-clock-mode`, arrive as one `TimeMode` combo beside `Skill Level`, over one safe clock share. Levels 1–7 do not change

## Status

**ACCEPTED** 2026-10-30 by the owner, Olger Oeselg, **with one amendment**. His words, verbatim (Orchestrator note
`.grugops/context/orch-2026-10-29g/notes/20261030T041740Z-orchestrator-decision-3dd61448.md`, a transcription and not a
stamp): *"ADR-0052: accept, but change 22.5s to 22s for simplicity and compatibility, ceiling also at 22s, no need to
implement fraction of a second ceiling or time per move if it is not supported by current solution"*. Recorded by
Architect/Design (task `arch-adr-accept-0052-0053-0054`).

- **The amendment.** `simple-tournament`'s ceiling goes from 22 500 to **22 000 ms**. T stays 22 000 ms, so T now
  equals its ceiling. Budgets and ceilings stay whole seconds, and nothing sub-second is introduced. The figures were
  changed in place in this § Status (the amends list), D3, D5, D6, D7, D9, § Consequences and § Owner questions.
  § Context and the owner's quoted ask keep 22.5 s as history.
- **Unchanged by the amendment:** D1, D2 (`C`, `RESERVE`, `OVERHEAD`, the ≥ 1 s floor), `min(T, C)`, D4
  (`uci-clock-mode`: 59.5 s under 60 s), D6's clamp rule (32 000 → 60 000 at the `uci-clock-mode` build only), D8's
  files and constant names, and levels 1–7.
- **The arithmetic.** T was already 22 000, so every period figure stands. At 40/15, `C` starts at 22 375 and T binds
  on every move. 18 760 ms are left after move 40, and 97.9 % of the period is used (83.2 % with 6 book moves). The
  closest call is ≥ 1 069 ms at `tc=40/60`. Only three things move:
  - the margin under the ceiling, from 500 ms to **0 ms**;
  - the busy-latency bound, from 22.5 s to **22 s** (D7);
  - the `NFR-004` text, from 22.5 s to **22 s** (§ Consequences).
- **The overshoot past the ceiling is stated, not hidden.** With no margin, a search at 22 000 returns up to the
  abort granularity (≤ ~31 ms) past 22 s. Level 5 has the same shape: its 3 000 ms budget meets `NFR-004`'s ≤ 3 s
  clause, and the overshoot is the accepted risk `AR-NFR004-A`. `src/engine.test.ts` states the rule as *"stated
  rather than papered over with a safety margin"*. Security/NFR re-reads `AR-NFR004-A` at 22 s at the build's gate,
  which was already owed (§ Consequences). By the owner's word, no sub-second margin is added.
- **In force:** `simple-tournament` at `ABC-220`'s merge, and `uci-clock-mode` (D4, D6's clamp) at `ABC-221`'s merge.
  Nothing is on `main` before then.
  *(2026-10-31, `arch-ABC-221-records`: both are in force. `ABC-221` merged at `af32f82c` (QE) and `9395d8dc`
  (Security/NFR). Dated lines for `SE-221-a`, `SE-221-b`/`SEC-221-b` and `QE-221-b` are in D4 and D8.)*
- **Pointer lines.** This hop added dated pointers to the § Status of `ADR-0044` and `ADR-0045`. The in-place fold
  lines in those ADRs and the `NFR-004` text stay with BA/PM and Security/NFR at each build's merge, as listed below.
- `OQ-0052-1` is closed (§ Owner questions).
- **Amended 2026-10-30 by Architect/Design** (task `arch-ABC-220-a14`, records only, at `main` `f22e31b3`), on the
  SE's `ABC-220` finding F1 (`se-ABC-220` `…a76bc514`). D7's real-child row could not be measured as written. It is
  now read by two instruments: (a) an order-and-count row in the real-child lane, and (b) a QE hand reading of the
  ≤ 100 ms bound, taken by an asynchronous probe outside vitest. This is the `ABC-168` `A6` precedent. D8 now names
  the file that row lives in. D1's refusal text is read for the values offered at each build. D7 states how its
  latency bound is read. The dated lines are in D1, D7, D8 and D9. **No requirement moved,** so nothing goes to the
  owner: the bound (≤ 100 ms), the order, the count and "no line lost" are D7's, unchanged.

Previously **proposed** 2026-10-29 by Architect/Design (task `arch-epic009-settings`), at `main` `b5df6cde`.
~~**The owner accepts or declines it.** Nothing is built on it, and no `EPIC-009` build ticket leaves `Backlog` on it,
until he accepts it.~~ *(Met 2026-10-30: accepted above, with the 22 s amendment.)*

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
  - `ADR-0044` D5: the accepted latency bound becomes one budget late in the active mode: ≤ 22 s in
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
  - *(Read 2026-10-30, `arch-ABC-220-a14`.)* The list in that line is the values **offered at the build**, spelled
    from the same frozen tuple as the `combo` line, so the two cannot drift. At the `simple-tournament` build the
    line is `info string TimeMode takes level or simple-tournament, got <v>; kept <old>`. At the `uci-clock-mode`
    build the same code produces the text above, with no edit. An empty value reads `got nothing`, as the other
    options do. `ABC-220` `A10` pins this. A refusal never names a value that cannot be selected.
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

### D3. `simple-tournament`: a fixed T = 22 000 ms, which is also its ceiling, never more than the clock safely allows

- **T = 22 000 ms**, rate 0, and **the ceiling is 22 000 ms too** (the owner's amendment, 2026-10-30, § Status).
  `SIMPLE_TOURNAMENT_CEILING_MS` = 22 000, and `SIMPLE_TOURNAMENT_BUDGET_MS` = `SIMPLE_TOURNAMENT_CEILING_MS`, with no
  margin between them. Both are whole seconds. Both names are kept because `ABC-220` cites them: the ceiling is the
  `NFR-004` bound, and the budget is what is spent. *(Before the amendment: ceiling 22 500, budget 22 500 − 500.)*
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
- **Why 22 000, with no margin under the ceiling.**
  - It is the owner's figure, both for T and for the ceiling (§ Status).
  - With 0 ms under the ceiling, the abort overshoot (≤ ~31 ms) passes 22 000 ms by that much. Level 5's 3 000 ms
    budget passes its ≤ 3 s clause the same way. That is `AR-NFR004-A`, stated and not hidden behind a sub-second
    margin. Security/NFR re-reads it at 22 s (§ Consequences).
  - 22 500 is now above the ceiling. It would also stop being a fixed setting at 40/15, because `C` (22 375) would
    bind from move 1.
  - 20 500 follows `NFR-004`'s "budget + 2 s" rule, which derives a level's ceiling from its budget. Here the owner
    set the ceiling directly.
  - At 22 000: 40 × (22 000 + 31) = 881 240 ms, so **18 760 ms** are left after move 40 and **97.9 %** of the period is
    used. With the book's maximum of 6 engine moves (`maxPly` 12) the period still uses **83.2 %**. Three periods, and
    `tc=40/60`, keep the closest call at ≥ 1 069 ms on the virtual clock (`raw/alloc.txt`). M1 and M2 hold by
    arithmetic. The amendment moved none of these figures.
  - The owner set T and the ceiling on 2026-10-30. Any later change is his to make, and the rules above do not
    change with it.

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
  - *(2026-10-31, `arch-ABC-221-records`, records only; `SE-221-a`, confirmed by QE in `qe-ABC-221` `…f9b43b6d`.)*
    **"80 moves leave ≥ 117 s" is corrected.** The sentence names 80 moves with no `movestogo` and no time added,
    which is `raw/alloc.txt` § "sudden death 15 min, 80 moves". On that shape the clock after move 80 reads
    **17 205 ms** (QE's `se221a.mjs`: 17 204.53), and that is the closest call. 117 735 ms belongs to a different
    shape, § "40/15, no movestogo sent, 80 moves". There the period's 900 000 ms is added after move 40, and the
    closest call is just after move 40.
    - **The bound does not move.** On both shapes every move leaves ≥ 1 000 ms, and `ABC-221` pins each shape with
      its own row.
    - § Alternatives A9's "≥ 117 s" is the same figure, and it also reads 17 205 ms.
    - The rule and the bound stay the same. Only the arithmetic figure is corrected, so this is not PROPOSED and
      nothing goes to the owner.

### D5. The overhead model, term by term

| term | value | source | where it is paid |
|---|---|---|---|
| overshoot past the deadline | ≤ ~31 ms | `AR-NFR004-A`; QE `qe-ABC-212` `A4` (30 004 at 30 s) | inside `OVERHEAD` (100) |
| session work before the search, and the pipe both ways | 1–3 ms through a Node driver | SA P1, P4, P5 (wall − engine time) | inside `OVERHEAD` |
| cutechess's own read and timer | `UNKNOWN - verify` | its timer runs from `startTimer()` to the move | inside `OVERHEAD`; then the slack below |
| D4.1's 50 ms (`MOVE_OVERHEAD_MS`) | 50 ms, at a period's last move only | `ADR-0044` D4.1 | **levels only.** The modes do not use it |
| the reserve at the control | 1 000 ms | D2 | `RESERVE` |
| the margin under a ceiling | 0 ms in `simple-tournament` (the owner's 22 s amendment); 500 ms in `uci-clock-mode` | D3, D4 | between the budget and its `NFR-004` ceiling. At 0 ms the abort overshoot passes the ceiling by ≤ ~31 ms: `AR-NFR004-A` |

The slack is wide. M1's ≥ 500 ms survives `δ` up to 600 ms on a period's last move at 40/15. In `simple-tournament` at
40/15 the cushion is 20 000 − 40 × `δ` ms after move 40, about 487 ms of `δ` per move on average. `ABC-222` reads the
real `δ` from cutechess's per-move times.

### D6. The engine clamp: one clamp, its value moved at the `uci-clock-mode` build only

- **At the `simple-tournament` build, `src/engine.ts` does not change.** 22 000 is under the 32 000 clamp.
- **At the `uci-clock-mode` build, `HARD_CEILING_MS` goes from 32 000 to 60 000**, the largest ceiling in force. It is
  `ADR-0045` A3's shape (`RF-1`): one absolute clamp at the largest ceiling. Each setting's own ceiling is held by its
  data, at the setting:
  - levels 1–7 by `LEVELS[L].budgetMs`, unchanged (5, 7, 32 s);
  - `simple-tournament` by T (22 000, equal to its ceiling; the overshoot is `AR-NFR004-A`);
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
  most one budget late. That is ≤ 22 s in `simple-tournament` (inside level 7's accepted 32 s) and **≤ 60 s in
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
    *"busy `isready`/`stop`: answered ≤ one budget + `AR-NFR004-A` late; ≤ 22 s in `simple-tournament`, ≤ 60 s in
    `uci-clock-mode`; one `readyok` per `isready`, in order"*.
  - **Two test rows.** In the default lane (virtual clock), `isready` sent after a `go` is answered with exactly one
    `readyok`, written after the `bestmove`. In the opt-in real-child lane (the `ABC-119` precedent; unset means NOT
    DEFINED), `node src/uci.ts` with `TimeMode` set, `go movetime 2000`, then `isready` 100 ms later: `readyok` arrives
    ≤ 100 ms after `bestmove`, and no line is lost. The bound scales with the budget, so 2 s stands for 60 s. No 60 s
    real-clock row runs in any lane but `ENGINE_DEEP`.
- **Amended 2026-10-30 (`arch-ABC-220-a14`): the real-child row is read by two instruments.** The row above cannot be
  read as written. The real-child lane's child is synchronous (`spawnSync`, because `ABC-173` `C2` bars every
  asynchronous `child_process` form in `src/**/*.test.ts`). Its whole stdin script is written at spawn, and its whole
  stdout comes back at exit. So the lane cannot send anything "100 ms later", and it has no time for any single line.
  The row's intent does not change. Each `isready` gets one `readyok`, in order, after the `bestmove`. No line is
  lost. Once the search ends, the waiting `isready` is answered within 100 ms.
  - **(a) The lane row** (`UCI_DEEP`, `src/uci.real-engine.test.ts`, D8). `node src/uci.ts` runs with `TimeMode`
    set and the book off. In the script, `isready` comes straight after `go movetime 2000`, so it is waiting in the
    child's input while the search runs. This is the case `ADR-0044` D5 describes. The row reads:
    - exactly one `readyok` per `isready`, and the busy one is the line straight after the only `bestmove`;
    - nothing is lost or refused, and the `bestmove` is legal;
    - spawn to exit takes ≥ 2 000 ms, so the search ran;
    - M4 holds, the exit code is 0, and stderr is empty.

    The row reads no time between lines, and it says so.
  - **(b) The QE hand reading** of the ≤ 100 ms bound. One asynchronous probe lives outside `src/` and runs with
    plain `node`, never through vitest. This is the `ABC-168` `A6` / `NFR-011` precedent. `C2` covers
    `src/**/*.test.ts` only, and the `ADR-0008` heap ceiling covers vitest runs only, so neither is edited or waived.
    The probe writes `isready` 100 ms after `go movetime 2000`, so the line arrives while the child is inside the
    search, as a GUI would send it. It reads the gap from the arrival of `bestmove` to the arrival of `readyok`.
    `ABC-220` `A14` states the protocol.
  - **Rejected:** opening `C2` to allow one asynchronous child in the lane. That is route (1) at `ABC-168`, which
    reopens an addendum the owner accepted for a single row. Also rejected: dropping the 100 ms bound and keeping only
    the order. That would move D7's requirement, and the owner would have to be asked.
- **How "≤ 22 s" is read in the accepted-risk entry** (2026-10-30, `arch-ABC-220-a14`; for Security/NFR's entry beside
  `NFR-011`). The latency has three terms:
  - **one budget:** the budget the `go` handed. That is ≤ 22 000 ms in `simple-tournament`, and `ABC-220` `A6` reads
    it exactly on the virtual clock;
  - **`+ AR-NFR004-A`:** the abort overshoot, ≤ ~31 ms;
  - **the drain:** ≤ 100 ms, the bound (b) reads.

  The worst case is an `isready` or `stop` that arrives together with the `go`: ≤ 22 000 + ~31 + 100 ≈ 22 131 ms.
  **"≤ 22 s" is read to the whole second, as a delay < 22 500 ms.** This is the same reading as `ABC-220` `A11`'s
  wall, and it follows the owner's "no need to implement fraction of a second ceiling". It is **not** read as
  ≤ 22 000 ms exactly. With the budget equal to the ceiling, no real search could meet that, because the overshoot
  alone passes it, and the owner ruled out a sub-second margin. In `uci-clock-mode`, 59 500 + ~31 + 100 < 60 000, so
  "≤ 60 s" holds exactly. `ABC-221` re-reads that at its gate. The entry text, with the reading added:
  *"busy `isready`/`stop`: answered ≤ one budget + `AR-NFR004-A` late; ≤ 22 s in `simple-tournament` (read to the
  whole second: < 22 500 ms), ≤ 60 s in `uci-clock-mode`; one `readyok` per `isready`, in order"*. The whole-second
  reading changes no code. ~~If the owner rejects it, only the text of this entry and `A11`'s bound move.~~
  - *(2026-10-31, `arch-qe242a-ruling`, records only.)* **The whole-second reading is accepted.** The owner accepted
    this ADR on 2026-10-30 (§ Status). The reading above was added after that, so he confirmed it on its own the same
    day: *"Whole-second reading of "≤ 22 s" - confirm"* (Orchestrator note
    `.grugops/context/orch-2026-10-30a/notes/20261030T181200Z-orchestrator-decision-f4673b9f.md`, a transcription
    and not a stamp). "≤ 22 s" in `simple-tournament` means < 22 500 ms. Nothing moves: not this entry's text, not
    `A11`'s bound, and no code.

### D8. Where the code goes

- **`simple-tournament` build:** `src/uci-session.ts` only. The `TimeMode` value and its frozen tuple, D2's `C`, D3's
  rule, and the constants `SIMPLE_TOURNAMENT_CEILING_MS`, `SIMPLE_TOURNAMENT_BUDGET_MS`, `CLOCK_RESERVE_MS` and
  `CLOCK_OVERHEAD_MS`. Tests in `src/uci-session.test.ts` and its `ENGINE_DEEP` lane. **No new file**, so D8's closure,
  `ADR-0011`'s census and `NFR-008`'s per-file floor do not move.
  - *(Amended 2026-10-30, `arch-ABC-220-a14`.)* There is one exception: D7's real-child row (a). It lives in
    `src/uci.real-engine.test.ts`, in its existing `UCI_DEEP` lane. That file is the "opt-in real-child lane" D7 and D9
    name (`ADR-0044` D9, `ABC-168`). `src/uci-session.test.ts` drives the session in process and has no spawn site.
    Spawning the delivered entry point from it would add a second spawn site. Moving the row to the existing file
    adds no file, no delivery file and no spawn site: `runDialogue` takes a script and stays the file's only
    `spawnSync` call. So what D8 guards still holds. The probe for (b) is a record under `.grugops/context/`, not a
    delivery file.
  - *(2026-10-31, `arch-ABC-221-records`, records only; `SE-221-b`, `SEC-221-b`.)* **Ruled: `ABC-221` `A10`'s
    `spawnSync` stays where it is.** "Has no spawn site" above was true only until `ABC-221`'s merge (`af32f82c`, code
    `c48a6f83`). Since that merge, `src/uci-session.test.ts` has one spawn site: `A10`'s child,
    `node --expose-gc --input-type=module -e <script>`. It is the `ABC-081` `A7` / `NFR-009` instrument that
    `src/transposition.test.ts` already runs in the same `ENGINE_DEEP` lane.
    - **What D8 guards still holds.** There is no new file and no delivery file. The delivered entry point is still
      spawned from one place only, `runDialogue` in `src/uci.real-engine.test.ts`. `A10`'s child imports
      `uci-session.ts`, `book.ts`, `levels.ts` and `engine.ts`, and never `src/uci.ts` or `dist/`. The row is defined
      only under `ENGINE_DEEP=1`, so the default lane spawns 0 (QE: lane inventory 63 = 63).
    - **Why keep the row rather than move it to a QE hand reading in plain node (the `ABC-212` form).** The row re-reads
      `NFR-009` at 59.5 s on every `ENGINE_DEEP` run, while a hand reading is taken once. Security/NFR found no risk
      and prefers the row (`secnfr-ABC-221` `…ef060512`). Moving it would add none of the guards D8 exists for.
    - **The rule from here, for this file.** A spawn in `src/uci-session.test.ts` is admitted only if all three hold:
      (1) it is not the delivered entry point (`src/uci.ts`, `dist/uci.js`); (2) it is defined only under an opt-in
      deep lane, so the default lane spawns 0; (3) it is synchronous, with an argument array and no shell (`ABC-173`
      `C2`). A spawn of the delivered entry point still belongs in `src/uci.real-engine.test.ts`.
    - D8's 2026-10-30 text was an Architect amendment that moved no requirement. This line moves none either, so it is
      not PROPOSED and nothing goes to the owner.
- **`uci-clock-mode` build:** `src/uci-session.ts` (the third value, D4's rule, `CLOCK_MODE_CEILING_MS`,
  `CLOCK_MODE_MAX_BUDGET_MS`) and **one value** in `src/engine.ts` (`HARD_CEILING_MS`, and its header comment's
  numbers).
- `src/levels.ts`, `src/cli-options.ts`, `src/cli.ts`, `src/startup-questions.ts`, `src/pgn.ts` and `src/search.ts`
  do not change.
  - *(2026-10-31, `arch-ABC-221-records`, records only; `QE-221-b`.)* **A stale comment in `src/levels.ts`, left in
    place by this fence.** Since `ABC-221`'s merge, the header's "`HARD_CEILING_MS` is the largest of them" (the level
    ceilings, `:50`) is false. The clamp is 60 000 and the largest level ceiling is 32 000, because D6 retired
    `ADR-0045` A3's equality.
    - **Read at `main` `9c008db4`:** two more words in the same header have been stale since `ABC-228`'s merge
      (`e42b637b`). At `:42`, "`NFR-004`'s 3 s" now reads 4 s, because `LEVELS[5]` is 4 000. At `:49–50`, "at least 2 s
      under it" is 1 s at level 5 (4 000 under 5 s).
    - **This line carries all three.** The next ticket whose diff touches `src/levels.ts` corrects them in the same
      diff, as comment-only lines, in D6's words: the clamp sits at the largest ceiling in force (60 s,
      `uci-clock-mode`), at or above every level ceiling. BA/PM names this line on that ticket's page when the ticket
      is cut.
    - **No ticket of its own.** A comment-only `src/` edit changes no behaviour and would not pay for a pass through
      the gates on its own. `ABC-245` touches `src/levels.test.ts` only, so it cannot carry it. Neither can a
      `QE-221-a` test ticket in `src/uci-session.test.ts`.

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
- **`ENGINE_DEEP` lane, real clock, ALONE:** one search at 22 000 returns at the 22 000 ceiling plus no more than the
  abort overshoot `AR-NFR004-A` accepts, as at level 5 (`simple-tournament`). The row reports the overshoot and
  adds no sub-second margin. Its tolerance is the one Security/NFR re-reads at 22 s. At the
  clock-mode build, one at 59 500 returns ≤ 60 000, with the max completed depth logged against `KEY_ARRAY_CAPACITY`'s
  tripwire (≥ 100 → Architect; the runaway guard at `src/search.ts:121` already bounds it).
- **Opt-in real-child lane:** D7's latency row. *(Amended 2026-10-30, `arch-ABC-220-a14`: this lane holds row (a), the
  order and the count, in `src/uci.real-engine.test.ts`. The ≤ 100 ms bound is (b), a QE hand reading outside vitest.)*
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
| A9 | A different `movestogo` default (30, 40) for the modes | With cutechess sending `movestogo` (§ Context) the default is a fallback. 20 is D4.1's constant, and 80 moves of sudden death still leave ≥ 117 s *(2026-10-31: 17 205 ms; see D4's dated line)*. Tuning it is `ABC-222`'s to measure, not to argue |
| A10 | A soft/hard split, early stop on a stable root, more time on a hard move | A search change with a strength reading. `EPIC-009` § Out of scope |

## Consequences

- **`NFR-004`, proposed text for the owner** (Security/NFR places it at each gate):
  - **At the `simple-tournament` build:** *"Engine returns a move in ≤ 3 s at default difficulty (level 5); hard
    ceiling per level: 5 s at levels 1–5, 7 s at level 6, 32 s at level 7 (a level above 5 gets its budget + 2 s);
    22 s in UCI `TimeMode` `simple-tournament` (budget 22 s)."* The clamp stays 32 000. *(22.5 s before the owner's
    2026-10-30 amendment.)*
    *(Pointer 2026-10-30, BA/PM, task `bapm-ABC-220-merge-fold`, on Security/NFR's `SEC-220-a`: clause A of this
    quoted sentence reads **≤ 4 s** since `ABC-228`'s merge (`e42b637b`; `ADR-0053` d10; `ADR-0045` FOLDED in place,
    § Status, 2026-10-30). Security/NFR placed only the new clause at `ABC-220`'s gate (`secnfr-ABC-220`), so the
    catalog's `NFR-004` row is right, and "≤ 3 s" here is history. The level-5 comparisons in § Status and D3 ("its
    3 000 ms budget … ≤ 3 s clause") and in the `AR-NFR004-A` bullet below ("level 5's ≤ 3 s") read 4 000 ms and
    ≤ 4 s the same way. No decision changes.)*
  - **At the `uci-clock-mode` build**, appended: *"; 60 s in UCI `TimeMode` `uci-clock-mode` (budget ≤ 59.5 s). The
    engine's one clamp sits at the largest ceiling in force, 60 s."* `HARD_CEILING_MS` = 60 000.
  - `AR-NFR004-A` (≤ ~31 ms) is re-read by Security/NFR at 22 s, and at 59.5 s at the clock-mode gate. At 22 s it now
    covers the overshoot past the ceiling itself, as it does for level 5's ≤ 3 s, because the budget equals the
    ceiling (D3).
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
  - **Closed 2026-10-30.** He accepted with an amendment that none of the three options offered. T stays 22 s, the
    ceiling moves to 22 s, and nothing is sub-second. Points 1 and 3–5 stand as written. In point 2, the ceiling now
    reads 22 s. His words and the record are in § Status and in the Orchestrator note
    `.grugops/context/orch-2026-10-29g/notes/20261030T041740Z-orchestrator-decision-3dd61448.md`.
