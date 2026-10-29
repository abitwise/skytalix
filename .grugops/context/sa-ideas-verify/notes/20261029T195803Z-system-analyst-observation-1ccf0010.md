---
id: 20261029T195803Z-system-analyst-observation-1ccf0010
kind: observation
by: system-analyst
at: 2026-10-29T19:58:03Z
verified_by: 
confidence: high on the code reading and the five probes; UNKNOWN - verify on cutechess movestogo and the 50 ms forfeit margin (named in section 7)
refs:
  - sa-ideas-verify
  - ideas-2026-10-29/input/owner-ideas.md
  - bapm-epic009-tournament
  - EPIC-009
  - NFR-004
  - ADR-0044
  - ADR-0045
  - AR-NFR004-A
  - ABC-212
  - ABC-101
  - src/levels.ts
  - src/engine.ts
  - src/uci-session.ts
  - src/cli-options.ts
  - src/cli.ts
  - src/level-seam.ts
  - tools/rating/rating.ts
  - orch-2026-10-29g/20261029T203000Z-orchestrator-decision-ccb72dbe
  - main 51c85f49 (src/data/tools = 3ad6bc10)
supersedes: 
seal: sha256:97cc1f2f28b0603328278f53626620a0bfa2adfcbd66d784a42700a366cb4e0f
---

# Time behaviour today, CLI and UCI: every budget, the `go` rule, the 32 s ceiling, and what blocks a 22.5 s or clock-based level

Read at `main` `51c85f49`. Its `src/`, `data/` and `tools/` are byte-identical to `3ad6bc10`, the commit the owner's
list reviewed (`git diff 3ad6bc10 51c85f49 -- src data tools` is empty). This note maps behaviour only. It ranks
nothing and proposes nothing. It is written for `bapm-epic009-tournament` (option (a) fixed 22.5 s, option (b) UCI
clock, option (c) both) and for item 4 of `ideas-2026-10-29/input/owner-ideas.md`.

## 1. The level table (`src/levels.ts:49-57`)

| Level | `budgetMs` | Blunder rate | `NFR-004` ceiling | Search path |
|---|---|---|---|---|
| 1 | 100 | 0.4 | 5 s | `createLevel` (blunder draw, then `chooseMove` or the blunder scan) |
| 2 | 180 | 0.2 | 5 s | same |
| 3 | 330 | 0.1 | 5 s | same |
| 4 | 1 000 | 0.05 | 5 s | same |
| 5 (default) | 3 000 | 0 | 5 s | `chooseMove` |
| 6 | 5 000 | 0 | 7 s | `chooseMove` |
| 7 (hardest) | 30 000 | 0 | 32 s | `chooseMove` |

- `DEFAULT_LEVEL` = 5 and `HARDEST_LEVEL` = 7 (`src/levels.ts:60-61`).
- Each ceiling is the level's budget plus at least 2 s (`ADR-0045` § AMENDMENT A3; `NFR-004` row, `plans/nfr-catalog.md:58`).
- A blunder move scores every root move against one shared deadline. That SUM is clamped to `HARD_CEILING_MS` (`src/levels.ts:132`, `:140-191`).

## 2. How the CLI picks the per-move time

- The per-move time is the chosen level's `budgetMs`, the same on every move of the game. There is no game clock.
- Path: `--difficulty 1..7` or the start-up question (`src/cli-options.ts:194-203`, `src/startup-questions.ts:118-133`).
  Then `createLevelSeam(difficulty, …)` (`src/cli.ts:224`), then `createLevel` (`src/level-seam.ts:13-20`), then
  `chooseMove(position, { budgetMs })` (`src/levels.ts:127`).
- No clock model, no clock display, no time flag and no PGN `TimeControl` tag exist in `src/` (grep for `clock` in
  `src/turn-loop.ts`, `src/status-panel.ts`, `src/pgn.ts`, `src/cli.ts` finds only the session start stamp and the
  50-move counter).
- The book answers before the engine. A book move spends no search time.

## 3. How UCI picks the per-move time (`ADR-0044` D4, `src/uci-session.ts`)

1. `G`, the `go` budget (`src/uci-session.ts:215-225`):
   - `movetime x`: `G = x`. It wins over a clock when both are sent (`:219-220`).
   - Else, the side to move has a clock `t`: `G = max(1, min(t / (movestogo ?? 20) + inc / 2, t − 50))` (`:221-225`).
     The 20 is `DEFAULT_MOVES_TO_GO` (`:69`). The 50 ms is `MOVE_OVERHEAD_MS` (`:67`).
   - Else (bare `go`, `infinite`, `ponder`, or only `depth`/`nodes`/`mate`): `G = HARD_CEILING_MS` (`:217`).
2. The level caps it: `budgetMs = min(G, LEVELS[skill].budgetMs)` (`:286-287`). Default `Skill Level` is 5.
3. The engine clamps again at `HARD_CEILING_MS` (`src/engine.ts:539`).

| `go` token | Honoured? | Exactly how |
|---|---|---|
| `wtime` / `btime` | yes, below the level cap | the side to move's value is `t` above (`:218`) |
| `winc` / `binc` | yes, below the level cap | half of it is added (`:222-223`) |
| `movestogo` | yes, below the level cap | divides `t`; 20 when absent (`:223`) |
| `movetime` | yes, below the level cap | `G = x` (`:219-220`) |
| `infinite` | partly | the search still stops at the level's budget; only the `bestmove` line is HELD until `stop`, `ponderhit`, `go`, `position`, `ucinewgame` or `quit` (`:174-175`, `:329`, `:270-279`) |
| `ponder` | partly | the same as `infinite`; no search runs on the opponent's time |
| `depth` / `nodes` / `mate` | levels 5-7 only | passed as `maxDepth` / `maxNodes` (`:313-318`); levels 1-4 ignore them with an `info string` (`:297-299`) |
| `searchmoves` | no | an `info string`, then all moves are searched (`:176-178`) |

- A malformed value is reported by `info string` and ignored (`:200-210`).
- The UCI clock tokens are therefore NOT ignored. They are honoured, and then capped by the level. At the default
  level 5 the cap is 3 000 ms, so a long clock is mostly unused.

## 4. How the search spends a budget (`src/engine.ts`)

- Deadline = start + `min(budgetMs, 32 000)` (`:539`).
- Iteration 1 is unabortable (`:555-557`). The clock is read every 1 024 nodes (`:151`, `:241-247`).
- An aborted iteration is discarded whole (`:569-576`). A new iteration starts whenever `now() < deadline` (`:561-566`).
- No soft limit, no early stop, no extension and no saving exist. A forced move or a single legal move also spends
  the whole budget. Probe P5: one legal move, 1 000 ms budget, 1 000 ms spent, depth 21.
- The transposition table and killers are cleared at every move (`:545`, `:550`; `src/transposition.ts:17-20`).
- One thread. `isready` and `stop` sent during a search are answered at most one budget late (`src/uci-session.ts:14-19`).
  `ADR-0044` D5 and `ADR-0045` A4 accept this, with no worker. The worker is pre-designed, not built.

## 5. The hard ceiling and where it is enforced

- `HARD_CEILING_MS` = 32 000 (`src/engine.ts:141`). It is enforced in one place for every `chooseMove` call
  (`src/engine.ts:539`), and once more on the blunder path's sum (`src/levels.ts:132`).
- `NFR-004` (owner's text, 2026-10-24): per-level ceilings 5 s at levels 1-5, 7 s at 6, 32 s at 7. "A level above 5
  gets its budget + 2 s". Measured max on the real clock: 3 005, 5 005 and 30 004 ms (QE `qe-ABC-212` `A4`).
- Residual `AR-NFR004-A`: the clamp bounds the deadline, not the abort granularity, so a move returns a few ms late
  (`src/engine.ts:51-55`).

## 6. Probes (single position, no games; 2026-10-29 19:54Z; about 40 s of CPU)

Driver and raw output: `.grugops/context/sa-ideas-verify/raw/` (`probe.mjs`, `probes.txt`). `OwnBook false`, real
clock, `node src/uci.ts`, position `startpos moves e2e4 e7e5` unless named.

| # | Setting | Sent | Expected `G` → budget | Engine `time` | Wall |
|---|---|---|---|---|---|
| P1 | level 7 | `go wtime 900000 btime 900000 movestogo 40` | 22 500 → 22 500 | 22 500 (depth 11) | 22 501 |
| P2 | level 5 | the same | 22 500 → 3 000 | 3 000 (depth 10) | 3 002 |
| P3 | level 7 | `go wtime 200000 btime 200000` | 10 000 (t/20) → 10 000 | 10 000 | 10 001 |
| P4 | level 7 | `go wtime 2000 btime 2000 movestogo 1` | 1 950 (t − 50) → 1 950 | 1 951 | 1 953 |
| P5 | level 5 | `fen k7/8/8/8/8/8/1r6/K7 w - - 0 1`, `go movetime 1000` (one legal move) | 1 000 → 1 000 | 1 000 (depth 21) | 1 001 |

## 7. What today already does under a 40/15 UCI clock (derived from §3, §4 and P1)

- At level 7, when the GUI sends `movestogo`, `G = t / m` starts at 900 000 / 40 = 22 500 ms. The 30 000 cap does not bind.
- Every move spends its whole budget, so `t / m` stays constant through the period: `(t − t/m) / (m − 1) = t/m`.
  So level 7 already plays about 22.5 s a move under 40/15, less the GUI's own latency per move.
- With no `movestogo` (sudden death), `G = t / 20`, capped at 30 000 (P3).
- At level 5 (the default) the 3 000 ms cap binds (P2): about 120 s of each 900 s period is used.
- **UNKNOWN - verify:** that cutechess sends `movestogo` for `tc=40/900`. The UCI protocol defines the token; the cutechess source was not read here.
- **UNKNOWN - verify:** the forfeit margin. On the last move before the control the budget is `t − 50` (P4: 1 950 of
  2 000; wall 1 953). Whether 50 ms covers pipe and GUI latency needs a long-clock match. This task may not run one.
- No harness reading has exercised the clock path. `tools/rating/rating.ts:383` drives every R and D reading with `st=`
  (a fixed time per move), with `timemargin = 5 000 − ms` (`:62`, `:384`).

## 8. What blocks a level with a fixed 22.5 s budget (option (a))

- **The level key is an ordinal.** `LEVELS` is keyed `1 | 2 | … | 7` (`src/levels.ts:49`). `Difficulty` is the same
  union (`src/cli-options.ts:71`). The CLI accepts only the literal ordinals, by exact-equality lookup
  (`src/cli-options.ts:49-64`, `:196-198`). UCI `Skill Level` is an integer `spin`, `min 1 max 7`, read through
  `Object.hasOwn(LEVELS, value)` (`src/uci-session.ts:342`, `:358-360`).
- **A name is not an ordinal.** "tournament" or "40-15" fits none of the three surfaces above as they stand.
- **The order is "weakest to strongest"** (`src/levels.ts:34-35`; `src/cli-options.ts:46-47`, `ABC-101` ruling 1). 22.5 s
  sits between level 6 (5 s) and level 7 (30 s). An ordinal 8 breaks the order. Inserting it renumbers today's 7.
- **`NFR-004` names levels 1-7 explicitly.** A new level needs its own ceiling. The row's rule gives 24.5 s for a
  22.5 s budget. That is under the 32 000 clamp, so the clamp itself need not move. Moving or adding an NFR bound is
  the owner's (EPIC-008 header).
- **Records that pin the table:** `ADR-0045` (the table and A3/A4); `ADR-0044` D4, D5 and D11 (the UCI rule, the latency,
  the `spin`); `ABC-085`'s ladder covers 1-5 only. Tests read the count or the `max`: `src/levels.test.ts`,
  `src/cli.test.ts`, `src/uci-session.test.ts`, `src/startup-questions.test.ts`, `src/render.test.ts`.
- **UCI latency:** at 22.5 s, `isready` and `stop` can be up to about 22.5 s late. That is inside level 7's accepted
  32 s. `ADR-0045` A4 records cutechess killing an engine `IdleTimeout` (15 000 ms) after a mid-search `stop`, which it
  sends at a game end or when pondering. Level 7 carries the same exposure today.

## 9. What blocks clock-based allocation (option (b))

- **The level cap.** `min(G, LEVELS[skill].budgetMs)` (`src/uci-session.ts:287`). Any level caps the clock's share at its budget.
- **The 32 s clamp.** `src/engine.ts:539`, `NFR-004` clause B. Any single move above 32 s needs `NFR-004`,
  `ADR-0045` A3 and `ADR-0044` D4.4 moved, on the owner's word.
- **No time manager.** The rule is one formula. It has no soft or hard split, no early stop and no extension on an
  unstable root (`src/engine.ts:561-579`). The constants 20 and 50 ms are `ADR-0044` D4.1's. D4.1 says "the tuning
  belongs to the ticket and is measured", and no measurement exists.
- **The CLI has no clock at all** (§2). In the CLI, a "tournament" level can only be a fixed per-move budget unless a clock is built.
- **One thread.** A longer budget lengthens the `isready`/`stop` stall (`ADR-0044` D5; worker pre-designed, `ADR-0045` A4).
- **No measuring path.** The harness drives `st=` only (§7). A clock-based mode has no reading method today.
