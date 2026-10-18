---
id: ABC-171
title: "The UCI session offers `OwnBook` (default on) and `Skill Level` 1–5 (default 3), over the existing book probe and `LEVELS`"
status: backlog
column: Backlog
size: S
priority: P1
epic: EPIC-007
feature: —
---

# ABC-171 — two UCI options, both requested by the owner, wired to code that already exists

> **Cut 2026-10-18 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-engine-revise`) as a **proposal**. It stays in
> `Backlog` until the owner accepts the revised `ADR-0044` and `EPIC-007`. Design: `ADR-0044` D3 (`setoption`), D10
> (book) and D11 (levels). Owner word: Q4 *"On in v1"* and Q5 *"strength control also implemented"* (`…a41c7e02`).
> **This hop ran nothing.**

## Problem

*User:* the owner's UI, which wants a beginner level and varied openings, and any GUI that shows engine options.

*Pain:* after `ABC-167` the session always plays at level 3, from search alone, so every game out of the start position
begins the same way.

*Value:* the GUI can pick a strength (`Skill Level` 1–5) and the engine opens from its book, the same as the terminal
game does. No new engine code is written. `createBookProbe` (`src/book.ts`) and `LEVELS` / `createLevel`
(`src/levels.ts`) are used unchanged.

## Scope

1. **`createUciSession({ write, now, random, book })`**: `ABC-167`'s shape plus `random` (values in [0, 1)) and `book`
   (a `BookProbe`, imported as a type only). This is `ADR-0044` D2's full shape.
2. **`uci`** also writes `option name OwnBook type check default true` and
   `option name Skill Level type spin default 3 min 1 max 5`, after the `id` lines and before `uciok`.
3. **`setoption`** per D3: the name is matched case-insensitively. `OwnBook` takes `true` or `false`. `Skill Level`
   takes an integer 1–5, looked up by own key (`Object.hasOwn(LEVELS, n)`). An invalid value keeps the old value and
   writes one `info string`. Any other name is ignored.
4. **The book (D10):** probe the position after the `moves`, book before search, `info string book` on a hit. It is read
   once per process, at the first `isready` with `OwnBook` on (warmed with `openingName`), or else at the first `go`.
   With `OwnBook` off, the probe is never called.
5. **The levels (D11):** budget `min(G, LEVELS[skill].budgetMs)`. A rate-0 level calls `chooseMove` with the D12
   limits. A level with a blunder rate calls `createLevel` per `go`, seeded `Math.floor(random() * 2 ** 32)`, and drops
   `depth` / `nodes` / `mate` with one `info string`. `ucinewgame` does not reseed.

## Out of scope

- Any edit to `src/book.ts`, `src/book-file.ts`, `src/book-engine.ts`, `src/levels.ts` or `src/level-seam.ts`.
- Reading the book file. `readBookFile` is bound in `src/uci.ts` (`ABC-168`). Here the tests inject a probe over
  in-memory bytes.
- `UCI_Elo`, `UCI_LimitStrength`, `Hash`, `Threads`, `MultiPV`, `Ponder` and a seed option (`ADR-0044` D6, Alternatives
  12 and 15).
- Forwarding `depth` / `nodes` / `mate` at levels 1 and 2 (D6).

## Acceptance (Given/When/Then)

Every row drives `handleLine` on a ticking virtual clock, with `random = seededRandom(k)` and a probe built by
`createBookProbe` over in-memory bytes. A spy counts the probe's `read` calls.

- **`A1` (the option lines).** `uci` writes exactly 5 lines, in order: `id name skytalix`, `id author Olger Oeselg`,
  `option name OwnBook type check default true`, `option name Skill Level type spin default 3 min 1 max 5`, `uciok`.
- **`A2` (`setoption`).**
  - `setoption name skill level value 1` (lower case) sets level 1, as `A6` observes. It writes nothing.
  - `setoption name OwnBook value false` writes nothing, and `A4` holds afterwards.
  - `Skill Level` values `0`, `6`, `2.5`, `x` and `constructor`, and `OwnBook` value `maybe`, each keep the old value and
    write exactly one `info string`.
  - `setoption name Hash value 64` writes nothing and changes nothing.
- **`A3` (a book hit, `EPIC-007` M6).** **Given** a book whose start position holds the single reply `e2e4`, **when**
  `position startpos` then `go movetime 1000` arrive, **then** exactly 2 lines are written: `info string book`, then
  `bestmove e2e4`. No `info depth` line is written. **And** `position fen <the start position's FEN>` hits the same
  entry, because the book is keyed by position, not by move list.
- **`A4` (`OwnBook` off).** **Given** `setoption name OwnBook value false` before any `isready` or `go`, **when**
  `A3`'s two lines arrive, **then** an `info depth …` line and a `bestmove` are written, no `info string book` is
  written, and `read` was called **0** times over the whole session.
- **`A5` (read once, and at the right time).** With `OwnBook` on: after `uci`, `read` was called **0** times. After the
  first `isready`, **1**. After further `isready`, `go` and `ucinewgame` lines, still **1**. In a session that never
  gets `isready`, the first `go` makes it **1**.
- **`A6` (a level change is observable, `EPIC-007` M7).** On the same position and clock, the same
  `go wtime 60000 btime 60000 winc 1000 binc 1000` (G = 3 500) is searched under **100 ms** at level 1, **3 000 ms** at
  level 3 and **3 500 ms** at level 5, read from the `info` line's `time` within the bound the test names.
- **`A7` (the blunder path).** At level 1, two sessions built with the same `seededRandom(k)` write the same `bestmove`
  sequence over the same 3 `go`s. A different `k` is allowed to differ. The `info` line on this path has no `score`
  token (`info depth D nodes N time T pv M`). `go depth 3` at level 1 writes one `info string` naming the dropped limit,
  then a `bestmove`. At level 3, `go depth 3` reports `depth 3`, as in `ABC-167` `A7`.
- **`A8` (no reseed).** `ucinewgame` calls `random` **0** times. Each `go` at a blunder level calls it to draw one seed,
  plus whatever `createLevel`'s own generator uses.
- **`A9` (a bad book).** **Given** a probe whose `read` throws, or returns bytes that are not the schema, **when** three
  `go`s arrive, **then** each writes exactly one legal `bestmove`, `handleLine` never throws, and the probe's `warn` was
  called exactly **once**.
- **`A10` (`infinite` with a book hit).** `go infinite` on a book hit writes `info string book` and holds the
  `bestmove` until `stop`.
- **`A11` (capability-free, and M4).** `ABC-167` `A11` still holds. `book.ts` is imported with `import type` only. Every
  written line starts with an M4 keyword.
- **`A12` (fences).** `git diff --name-only <base> <tip> -- src` lists exactly `src/uci-session.ts` and
  `src/uci-session.test.ts`. Every `ABC-167` row is still green. A row changes only where `A1` adds the two option lines.

## Dependencies

- **`ABC-167`** (the session). **Blocks `ABC-168`**, which binds `readBookFile` and `Math.random` into this shape.
- **Gate:** the owner accepts the revised `ADR-0044` and `EPIC-007`.

## Security / NFR triggers

- **Security: not triggered.** (a) no manifest. (b1) no limb token. (b2) `book.ts` is a type-only import. `levels.ts`'s
  only clock token is `options.now ?? Date.now` (`:115`), which is not a limb. The session never imports `book-file.ts`.
  (c) no spawn. (d) only the two named files.
- **`NFR-004`:** unchanged. Level 5 is 4 500 ms, under the ceiling, and the clamp still applies.
- **`NFR-006`:** unchanged. The tests use in-memory bytes, and the real file is not read here.
- **`NFR-008`:** rows added to an existing file, on the virtual clock, 0 spawns.

## Test notes

1. **The probe is the real `createBookProbe`**, not a stub, built over small in-memory JSON in the `ABC-094` schema. So
   `A9`'s "warn once, never throw" is the real contract.
2. **`A7` asserts reproducibility, not a particular move.** No strength or Elo is asserted at any level.
3. **`A6`'s bound is the one `ABC-167` `A5` names for the same clock step**, so the two tickets read time the same way.

## Size and priority

**`S`:** two options, one parser and two existing APIs, with about twelve criteria. **Not `XS`:** it has three state
rules (read once, no reseed, keep the old value) and two search paths. **Not `M`:** no engine, book or level code is
written.

**`P1`, inherited from `EPIC-007`.** The owner asked for both options in v1.

## Definition of Ready

BA/PM, 2026-10-18, at `main` `a10e09c2`. **Result: 9 of 10. Stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** fixed level and no book under UCI |
| 2 | scope and out-of-scope clear | **✅** two options; book file, levels code and Elo fenced off |
| 3 | INVEST-shaped | **✅** one slice of value (the owner's Q4 + Q5); testable without a process |
| 4 | acceptance testable and measurable | **✅** exact lines; `read` counts 0 / 1; 100 / 3 000 / 3 500 ms; warn exactly once |
| 5 | dependencies known | **✅** `ABC-167`; blocks `ABC-168` |
| 6 | security/NFR triggers with a measurable target | **✅** none fire; ≤ 4 500 ms; 0 spawns |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `S` |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker | **❌** the owner has not accepted the revised `ADR-0044` |

**Recommended: stay in `Backlog` until the owner accepts. Then → `Ready` after `ABC-167`.** Column moves are the
Orchestrator's.
