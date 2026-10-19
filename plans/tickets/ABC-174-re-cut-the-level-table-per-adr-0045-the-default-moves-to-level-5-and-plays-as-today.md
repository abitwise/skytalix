---
id: ABC-174
title: "Re-cut the level table per ADR-0045 (data only); the default moves to level 5 and plays as today"
status: backlog
column: Backlog
size: S
priority: P1
epic: EPIC-004
feature: —
---

# ABC-174 — five `LEVELS` entries and one default constant change. The mechanism, the engine and the ladder harness do not

> **Cut 2026-10-19 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-adr0045-cut`). It answers two owner words, and
> both are transcriptions, not stamps:
> - `.grugops/context/wave-2026-09-25/notes/20261019T111500Z-orchestrator-decision-owner-word-abc087-recut-levels-b2e6d4a9.md`:
>   *"Re-cut the levels (Recommended)"*;
> - `.grugops/context/wave-2026-09-25/notes/20261019T130500Z-orchestrator-decision-owner-word-adr0045-accepted-q1-q3-abc171-rows-1a9c7f42.md`:
>   Q1 *"Default = level 5 (Recommended)"*, Q2 *"Yes, 0.1 / 0.05 (Recommended)"*, and Q3 *"Verdict before UAT; add rows
>   (Recommended)"*.
>
> **Design:** [`ADR-0045`](../../memory-bank/50-decisions/ADR-0045-the-levels-are-re-cut-to-one-ply-and-a-halved-blunder-rate-per-step-and-the-default-moves-to-level-5-where-it-plays-as-today.md),
> accepted 2026-10-19. The shape is the Architect's (`.grugops/queue/done/arch-levels-recut.md` § "The ticket shape for
> BA/PM"). It was written there as "to become `ABC-173`", but that id was already the vitest cap ticket. **This hop ran
> nothing and timed nothing.** The line numbers below were read at `main` `6fc32150` (and at `9ae31679` for
> `src/uci-session*.ts`).

## Problem

*User:* the owner, and any player who names a level: `--difficulty N` in the terminal, or `Skill Level N` from a UCI
GUI.

*Pain:* `ABC-146`'s verdict at step 4 (`.grugops/context/abc146-verdict/notes/…4c1d8e27`) measured **3v4 at 6.5/20 and
4v5 at 10/20, both RED**. Levels 3, 4 and 5 are 3 000 / 4 000 / 4 500 ms at rate 0, which is inside one ply (2.67x). So
4v5 plays the same game from both chairs (`ADR-0045` § Context). Today a player who picks 4 or 5 gets no stronger
opponent.

*Value:* each step down from the top is about one ply weaker, with the blunder rate doubled (`ADR-0045` D1, D5). The
default player sees **no change in play**: `LEVELS[5]` is `{ 3000, 0 }`, which is today's default exactly (D2).

## Scope

1. **`src/levels.ts`:** set the `LEVELS` values to D1 (100/0.4, 180/0.2, 330/0.1, 1 000/0.05, 3 000/0), set
   `DEFAULT_LEVEL = 5`, and update the header and table comments. `EASIEST_LEVEL` 1 and `HARDEST_LEVEL` 5 do not change.
2. **`src/cli-options.ts:70-71`:** set `DEFAULT_DIFFICULTY = 5` and replace its comment ("the middle of the set, never the
   top (ruling 2)"). Ruling 2 is overturned (`ABC-101`, folded).
3. **`src/uci-session.ts`** (as merged by `ABC-171`): the `Skill Level` option line's `default` is read from
   `DEFAULT_LEVEL`, not the literal `3` (`:349` at `9ae31679`). Fix the header comment to match.
4. **`src/cli.ts:27`:** the header line "With no `--difficulty` it is level 3" (comment only).
5. **The pins that move.** Each is named in § Pins that move and re-pinned in the same diff, at equal strength.

## Out of scope

- **The mechanism:** `createLevel`, `blunder`, `seededRandom`, `src/level-seam.ts`, `src/engine.ts`, `src/search*.ts`
  and `src/virtual-clock.ts` (`ADR-0045` D3).
- **`src/ladder.test.ts`** and the harness constants (D6.2).
- **The verdict run.** That is **`ABC-175`**. This ticket's QE runs short mode only (`A6`).
- **`plans/nfr-catalog.md`** (Security/NFR, at this ticket's gate) and **`AGENTS.md` line 59** (the Scribe, within
  the 24 576 B budget, before this ticket merges).
- **Tuning the table from any game result** (`ABC-087` test note 4; `ADR-0045` D6.7).

## Acceptance (Given/When/Then)

- **`A1` (the table is D1's).** **Given** the merged `src/levels.ts`, **then** `LEVELS` deep-equals
  `{ 1: { budgetMs: 100, blunderRate: 0.4 }, 2: { 180, 0.2 }, 3: { 330, 0.1 }, 4: { 1000, 0.05 }, 5: { 3000, 0 } }`.
  - The table and each entry are frozen (`Object.isFrozen`).
  - The merged ordering row (`src/levels.test.ts` `A1`) stays green **and unedited**: budgets never fall, rates never
    rise, and each step improves at least one of the two.
- **`A2` (the default is the top).**
  - `[EASIEST_LEVEL, DEFAULT_LEVEL, HARDEST_LEVEL]` equals `[1, 5, 5]`.
  - `LEVELS[DEFAULT_LEVEL]` deep-equals `{ budgetMs: DEFAULT_BUDGET_MS, blunderRate: 0 }`.
  - `DEFAULT_DIFFICULTY === DEFAULT_LEVEL`.
  - `ABC-101` `A2` as folded: `optionsOf([]).difficulty` equals `DEFAULT_DIFFICULTY`, which equals the **maximum** of the
    level words. A build that defaults below the maximum reds this row.
- **`A3` (the default plays as today).** **Given** ≥ **30** positions (the Engineer names the set; `ADR-0045`'s
  50-position probe set is available) and two fresh virtual clocks of the same step for each, **when**
  `createLevel(LEVELS[DEFAULT_LEVEL], { seed, now })` and `chooseMove(position, { budgetMs: 3000, now })` each choose,
  **then** move, depth and nodes are equal on **30 of 30**, for at least two seeds. `chooseMove` at 3 000 ms is the old
  level 3.
  - **And** a no-flag CLI resolves `difficulty: 5`, and the root builds level 5. `ABC-101` `A8′`'s row stays green with
    `DEFAULT_LEVEL`.
- **`A4` (the mechanism is unchanged).**
  - `git diff --numstat <base> <tip> -- src/engine.ts src/search.ts src/virtual-clock.ts src/level-seam.ts` prints
    **nothing**.
  - For each level, `Object.keys(LEVELS[n]).sort()` is `["blunderRate", "budgetMs"]`.
  - The bodies of `createLevel`, `blunder` and `seededRandom` are byte-equal to `<base>`. In
    `git diff -U0 <base> <tip> -- src/levels.ts`, hunks touch only the five table entries, `DEFAULT_LEVEL` and comment
    lines.
- **`A5` (UCI reads the same table, `ADR-0045` D4).**
  - `uci` writes `option name Skill Level type spin default 5 min 1 max 5`. A row builds the expected line from
    `DEFAULT_LEVEL`, and a second row checks the literal.
  - **At the default** (no `setoption`), a bare `go` takes the `chooseMove` path. Its `info` line carries `score`, and
    its `time` is within `ABC-167` `A5`'s bound of **3 000 ms**. `go depth 3` reports `depth 3` (D12).
  - **At skills 3 and 4,** `go depth 3` writes exactly one `info string` naming the dropped limit, then a level `info`
    line with no `score` token, then the matching `bestmove` (the `createLevel` path, D11).
  - `ABC-171` `A6`'s table reads level 1 → **100**, level 3 → **330** and level 5 → **3 000** ms under
    `GO_G3500` (`min(3500, 3000)`), within the same bound.
- **`A6` (the deep lanes, at QE).**
  - `ENGINE_DEEP=1 npx vitest run src/levels.test.ts` is green. That covers `ABC-087` `A2`–`A5`, and `A3` (easiest
    solves strictly fewer puzzles than the default).
  - `LADDER_DEEP=1 npx vitest run src/ladder.test.ts` is green for `ABC-085` `A3`/`A4`/`A5` only. Short mode claims no
    `A2` (D6.8).
- **`A7` (the time budget, as `ADR-0045` § Consequences writes it).** This criterion is checked **from the data, on the
  default lane**. This page quotes no wall-clock figure and predicts none.
  - **`NFR-004` clause A (≤ 3 s at the default):** `LEVELS[DEFAULT_LEVEL].budgetMs === DEFAULT_BUDGET_MS === 3000`. So
    `AR-NFR004-A` stands as accepted.
  - **Clause B (the 5 s ceiling at any level):** `max(LEVELS[n].budgetMs)` over `n` in `1..5` is **3 000**, which is
    below `HARD_CEILING_MS` (5 000). No level reaches the ceiling. The engine's clamp and the level layer's clamp row
    (`R1`, `src/levels.test.ts`) stay green and unedited.
  - **`ABC-087` `A5`** (the hardest level, ≤ 5 s on 30/30, real clock) is not edited. It now runs at level 5 =
    3 000 / 0, inside `A6`'s `ENGINE_DEEP` run. Its figures are QE's reading, not a figure on this page.
  - **`ADR-0038` decision 3's admission rule** still holds for `ABC-175`: step **4** ≤ `LEVELS[1].budgetMs ÷ 10` = **10**.
- **`A8` (fences and pins).**
  - `git diff --name-only <base> <tip> -- src` lists only these files: `src/levels.ts`, `src/cli-options.ts`,
    `src/uci-session.ts`, `src/cli.ts`, `src/levels.test.ts`, `src/cli.test.ts` and `src/uci-session.test.ts`.
  - In `src/cli.ts`, the `-U0` hunks touch comment lines only.
  - Every pin in § Pins that move is re-pinned in the diff at equal strength. The commit body names each one, old →
    new. None is deleted, skipped or loosened.
  - Any further pin the build reds is named the same way, with its reason.

## Pins that move (read at `main` `6fc32150`; `uci-session*` at `9ae31679`)

| pin | where | old → new |
|---|---|---|
| `ABC-087` `A1` | `src/levels.test.ts:191-193` | title "default 3"; `[1, 3, 5]` → `[1, 5, 5]` |
| `ABC-087` `A6` | `src/levels.test.ts:228-234` | **unchanged** (`LEVELS[DEFAULT_LEVEL]` is still `{ 3000, 0 }`) |
| `ABC-101` `A2` | `src/cli.test.ts:3602-3610` | "the middle of the level set" → the maximum; `toBe(levels[(n-1)/2])` → `toBe(Math.max(...levels))`; `toBeLessThan(Math.max(...))` → equality with `HARDEST_LEVEL`; the ruling-2 comment |
| `ABC-061` `A2`/`A3` whole-object rows | `src/cli.test.ts:1319, 1328, 1337, 1346, 1355, 1380, 1386` | `difficulty: 3` → `difficulty: 5` where the argv sets no `--difficulty` (the default) |
| `ABC-101` `A8′` | `src/cli.test.ts:3678-3708`, `:3710-3712` | assertions **unchanged** (they read `DEFAULT_LEVEL`). The comment "level 3 does not" → the default level |
| `src/engine.test.ts:901-903` | engine | **unchanged** (reads `DEFAULT_LEVEL`) |
| `ABC-171` `A1` | `src/uci-session.test.ts:121`, `:665` | `default 3` → `default 5` |
| `ABC-171` `A6` | `src/uci-session.test.ts:802` (table), `:647` (`levelTime`) | `[3, 3_000]` → `[3, 330]`; `[5, 3_500]` → `[5, 3_000]`; `level <= 2 ? parseLevelInfo` → `LEVELS[level].blunderRate > 0 ? parseLevelInfo` |
| `ABC-171` `A2` read-back | `src/uci-session.test.ts:719` | `levelTime(level.send, 3)`, 3 000, "still the default level 3" → the default level 5, 3 000 |
| `ABC-171` `A7` | `src/uci-session.test.ts:866-873` | "go depth 3 at level 3 reports depth 3" → at level 5 (level 3 now drops the limit) |
| `ABC-171` `A8` | `src/uci-session.test.ts:877-893` | "level 3 draws none" → level 5 (a rate-0 level) |
| `ABC-167` `A5` default-budget rows | `src/uci-session.test.ts:211-212, 284-285, 412, 448, 453` | values **unchanged** at 3 000 (the default is still 3 000 ms). Only the "level 3" label text moves |
| test-file comment | `src/uci-session.test.ts:44` | "level 3 never calls" → the default level |
| `ABC-171` `A13a`–`d` | `src/uci-session.test.ts` (rows to be added by `ABC-171`) | **unchanged**: they read a level's rate from `LEVELS`. `A13b` then also covers levels 3 and 4 |

## Dependencies

- **`ADR-0045` accepted:** met 2026-10-19 (`…1a9c7f42`).
- **`ABC-171` merged first.** The two share `src/uci-session.ts` and its test file (D4; Architect).
- **`ABC-173` (vitest cap): recommended to merge before this ticket branches** (§ Order with `ABC-173` on `ABC-175`'s
  page). It shares no `src/` production file with this ticket.
- **`ABC-175` follows this ticket's QE pass.** The owner's UAT word on this ticket waits on `ABC-175`'s reading (owner
  Q3). Then both merge.
- **The Scribe:** `AGENTS.md` line 59 ("default level 3 (≤3 s/move)") → "level 5". It is owed before merge, inside
  the byte budget.
- **Security/NFR, at this ticket's gate:** the `plans/nfr-catalog.md` `NFR-004` lines that name the old table
  (`AR-NFR004-A` "level 3 = `DEFAULT_BUDGET_MS`", and `:1364`).

## Security / NFR triggers

- **`NFR-004`:** `A7`. Clause A holds at the default (3 000 ms), and no level reaches clause B's 5 000 ms.
- **`NFR-005`:** the referent is unchanged (`LEVELS[DEFAULT_LEVEL]` = `{ 3000, 0 }`, `A2`).
- **`NFR-008` / `N8-LANE`:** no file and no lane are added. The changes are data and re-pinned rows. **Bar:** `npm test`
  wall ≤ 10 s at load1 ≤ 8, with CPU reported (R-1, `ADR-0035`), read by QE. A row that plays the default level by
  number now plays 3 000 ms at level 5, the same budget as before. The Engineer lists any row whose cost moves.
- **Security: not triggered.** No input path changes: the flag parser and the own-key lookup are unchanged, and
  `Object.hasOwn(LEVELS, …)` is untouched. No dependency, no spawn, no file read.
- **UAT applies.** `src/levels.ts` is production. The owner's word comes **with `ABC-175`'s score in hand** (Q3).

## Test notes

1. **Nothing here reads a game.** The table is D1's, and no value is adjusted toward a ladder result (`ABC-087` test
   note 4).
2. **`A3` is equal by construction** (rate 0 draws once, and the draw does not reach the move). It is still asserted,
   because it is the "plays as today" promise made mechanical.
3. **`A7` is data assertions only.** The real-clock `A5` row of `ABC-087` runs in `ENGINE_DEEP` at QE, unedited.
4. **UCI rows read a level's rate from `LEVELS`, not from its number** (the `ABC-171` `A13` style). A future table change
   then moves no path selector.
5. **Armed reds (watched once, then reverted):** `DEFAULT_LEVEL` back to 3 → `A2` red; level 4's rate back to 0 →
   `A5`'s skill-4 row red; `Skill Level` literal `default 3` kept → `A5` red.

## Size and priority

**`S`:** data in two files, one option line, and about fourteen re-pin sites across three test files. **Not `XS`:** the
pin list spans three tickets' rows (`ABC-061`, `ABC-101`, `ABC-171`). **Not `M`:** no mechanism code is written.

**`P1`, inherited from `EPIC-004`.** It carries `ABC-085` `A2`, the epic's ordering criterion. **Not `P0`:** the
default player's game does not change.

## Definition of Ready

BA/PM, 2026-10-19, at `main` `6fc32150`. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** 3v4 and 4v5 measured RED; the cause is read from run 2's game lines |
| 2 | scope and out-of-scope clear | **✅** data in `levels.ts` / `cli-options.ts`, one UCI line, and named pins; mechanism, harness, catalog and `AGENTS.md` fenced off |
| 3 | INVEST-shaped | **✅** one slice (the table). The verdict is split to `ABC-175`, so a long run does not hold a built ticket |
| 4 | acceptance testable and measurable | **✅** a deep-equal table; `[1, 5, 5]`; 30/30 equal move, depth and nodes; 0 numstat lines; an exact option line; 100 / 330 / 3 000 ms; max budget 3 000 < 5 000; step 4 ≤ 10 |
| 5 | dependencies known | **✅** `ABC-171` first; `ABC-173` order recommended; `ABC-175` before UAT; Scribe and Security/NFR named |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-004` 3 000 / 5 000 ms; `NFR-008` ≤ 10 s at load1 ≤ 8; security not triggered |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `S` |
| 9 | priority assigned | **✅** `P1`, both directions argued |
| 10 | no major unresolved blocker | **✅** the owner accepted `ADR-0045`. `ABC-171`'s merge is sequencing, not a blocker |

**Recommended: `Backlog → Ready` once `ABC-171` merges, as far as Ready's WIP limit (8) allows.** Column moves are the
Orchestrator's.
