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

> **Accepted 2026-10-18 by the owner** (BA/PM, subtask `bapm-epic007-accept`). Owner word, verbatim
> (`.grugops/context/wave-2026-09-25/notes/20261018T113000Z-orchestrator-decision-owner-word-engine-private-adr0044-epic007-accepted-c3e81a57.md`,
> a transcription, not a stamp): *"accept the revised ADR-0044 and EPIC-007"*. The DoR item "owner acceptance" (item
> 10) is met, and the score is now 10 of 10. Readings below are unchanged from the cut.

> **Amended 2026-10-19 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-adr0045-cut`) on the owner's word
> (`.grugops/context/wave-2026-09-25/notes/20261019T130500Z-orchestrator-decision-owner-word-adr0045-accepted-q1-q3-abc171-rows-1a9c7f42.md`,
> a transcription, not a stamp): *"Verdict before UAT; add rows (Recommended)"*. QE's verdict at `9ae31679` was
> PASS_WITH_GAPS with no wrong behaviour (`.grugops/context/qe-ABC-171/notes/…9d61b7e3`, mutants `…c48a1f60`).
> **`A8` is reworded for `QE-171-b`. `A13` adds the four rows that close `QE-171-a`..`d`.** `A3` gains one
> qualifier, and `QE-171-f` is ruled in § QE-171-f below. **No behaviour changes.** Each new row is green on the tip
> as QE probed it (P2–P5) and red on a named surviving mutant. `A12`'s two-file fence holds: the rows go in
> `src/uci-session.test.ts`. **DoR 10/10, unchanged.** The `Skill Level` table these rows read moves with
> `ABC-174` (`ADR-0045`, accepted), after this ticket merges. The rows read a level's rate from `LEVELS`, not
> from its number, so they hold across that move.

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
  `position startpos` then `go movetime 1000` arrive (a `go` with no bad token; *2026-10-19, `QE-171-f` f3*),
  **then** exactly 2 lines are written: `info string book`, then
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
- **`A8` (no reseed, and one draw per blunder-level search).** *(Reworded 2026-10-19 for `QE-171-b`; was: "Each `go`
  at a blunder level calls it to draw one seed, plus whatever `createLevel`'s own generator uses.")*
  - `ucinewgame` calls `random` **0** times.
  - **Each `go` that plays through a blunder level calls `random` exactly once**, to draw that `go`'s seed. A blunder
    level is one whose `LEVELS[n].blunderRate` is above 0. `createLevel`'s own generator is seeded from that draw and
    never calls `random`.
  - **A `go` answered from the book draws 0 seeds at any level, a blunder level included** (D10: the book comes first,
    whatever the `go` limits or the level are). No level instance is made.
  - A `go` at a rate-0 level draws 0 seeds.
- **`A9` (a bad book).** **Given** a probe whose `read` throws, or returns bytes that are not the schema, **when** three
  `go`s arrive, **then** each writes exactly one legal `bestmove`, `handleLine` never throws, and the probe's `warn` was
  called exactly **once**.
- **`A10` (`infinite` with a book hit).** `go infinite` on a book hit writes `info string book` and holds the
  `bestmove` until `stop`.
- **`A11` (capability-free, and M4).** `ABC-167` `A11` still holds. `book.ts` is imported with `import type` only. Every
  written line starts with an M4 keyword.
- **`A12` (fences).** `git diff --name-only <base> <tip> -- src` lists exactly `src/uci-session.ts` and
  `src/uci-session.test.ts`. Every `ABC-167` row is still green. A row changes only where `A1` adds the two option lines.
- **`A13` (the four QE rows, added 2026-10-19).** Each row uses the § Acceptance rig: `handleLine` on a ticking virtual clock,
  `random = seededRandom(k)` behind a call counter, and the real `createBookProbe` over in-memory bytes. **Each is green
  on `9ae31679`'s behaviour (QE probes P2–P5) and must red its named mutant, watched once and reverted.**
  - **`A13a` (`QE-171-a`, the seed oracle `floor(random() · 2^32)`).** **Given** `Skill Level` 1 and
    `random = seededRandom(k)` for each k in `1..8`, **when** `position startpos` then `go movetime 1000` arrive (budget
    `min(1000, 100)` = 100 ms), **then** the session's `bestmove` equals
    `createLevel({ budgetMs: 100, blunderRate: LEVELS[1].blunderRate }, { seed: Math.floor(seededRandom(k)() * 2 ** 32), now })(<start>)`'s
    move, on a fresh virtual clock of the same step: **8 of 8**.
    - Non-vacuity, asserted in the same row: over `k = 1..8`, the oracle's moves are not all equal (this reds S32, a
      constant seed), and on at least one k the move under `Math.floor(seededRandom(k)() * 2 ** 16)` differs from the
      oracle's (this reds S33).
    - If `1..8` on the start position is vacuous for either clause, the SE widens k or adds one position and says so.
      The bar stays "every k equal to the oracle".
  - **`A13b` (`QE-171-b`, a book hit at a blunder level draws 0 seeds).** **Given** `START_BOOK`, `OwnBook` on and
    `seededRandom(1)`, **for each** level whose `LEVELS[n].blunderRate` is above 0 (levels 1 and 2 at this tip), **when**
    `setoption name Skill Level value <n>`, `position startpos`, `go movetime 1000` arrive, **then**:
    - exactly 2 lines are written, `info string book` then `bestmove e2e4`;
    - no `info depth` line is written;
    - the `random` counter reads **0**.
    This reds S25 (the book only at rate-0 levels) and S31 (a seed drawn on the hit).
  - **`A13c` (`QE-171-c`, the dropped-limit line covers `nodes` and `mate`, as one line).** At `Skill Level` 1 on the start
    position:
    - `go nodes 100` writes exactly 3 lines: one `info string` containing `nodes`, then a level `info` line with no
      `score` token, then the matching `bestmove`;
    - `go depth 3 nodes 100 mate 2` writes exactly 3 lines: **exactly one** `info string`, which contains each of
      `depth`, `nodes` and `mate`, then a level `info` line with no `score` token, then the matching `bestmove`.
    The wording beyond those three tokens stays the SE's (choice 5). This reds S38 (only `depth` named) and S39 (one
    line per limit).
  - **`A13d` (`QE-171-d`, an invalid `OwnBook` keeps `true`).** **Given** a fresh session (`OwnBook` at its default
    `true`) with `START_BOOK`, **when** `setoption name OwnBook value maybe` arrives, **then** it writes exactly one
    `info string`. **And then** `position startpos`, `go movetime 1000` writes exactly `info string book`,
    `bestmove e2e4`. This reds S12 (any invalid value sets `false`). `A2`'s existing row keeps `false`, so the two rows
    pin both directions.

## QE-171-f — open readings, ruled 2026-10-19 (BA/PM, `bapm-adr0045-cut`)

Each one is ruled in one line, and none adds a row. The tip's behaviour is coherent (`…9d61b7e3`).

- **f1, `OwnBook` values are case-sensitive (`TRUE` is invalid; SE choice 2): ACCEPT.** D3 says `true` or `false`, and
  the UCI text makes option *names* case-insensitive, not values.
- **f2, the value is every token after `value`, joined, and no `value` is invalid (choice 3): ACCEPT.** Every
  multi-token value is invalid for both options at the tip, and the two readings agree on every single-token value.
- **f3, on a book hit, `parseGo`'s bad-token `info string`s come before `info string book` (choice 4): ACCEPT.** D12
  gives each bad token one line. `A3`'s "exactly 2 lines" is now worded for a `go` with no bad token.
- **f4, `Skill Level` `01` / `1.0` / `0x1` are refused (own keys only, S07): ACCEPT.** Scope 3's
  `Object.hasOwn(LEVELS, n)` is the rule. `A2`'s `constructor` row pins the case that matters.
- *`QE-171-e` (INFO) is not ruled here.* It is routed to `ABC-168`'s page, as QE recommended.

## Dependencies

- **`ABC-167`** (the session). **Blocks `ABC-168`**, which binds `readBookFile` and `Math.random` into this shape.
- **Gate: met.** The owner accepted the revised `ADR-0044` and `EPIC-007` on 2026-10-18 (`…c3e81a57`).

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

BA/PM, 2026-10-18, at `main` `a10e09c2`. **Result: 10 of 10.** Re-scored 2026-10-18 at `main` `50e081fc` (subtask
`bapm-epic007-accept`). It was 9 of 10 at the cut, with item 10 open until the owner accepted.

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
| 10 | no major unresolved blocker (owner acceptance) | **✅** the owner accepted the revised `ADR-0044` and `EPIC-007` on 2026-10-18 (`…c3e81a57`) |

**Re-scored 2026-10-19 at `main` `6fc32150` (subtask `bapm-adr0045-cut`): 10 of 10, unchanged.** Item 4 now also
holds `A13a`–`d`: an 8-of-8 oracle match; 2 lines and a counter of 0; 3 lines with one `info string` naming three
tokens; 1 line, then a book hit. Item 7: each new row names the mutant it must red. Item 8 stays `S`, because the
change is four rows in an existing file.

**Recommended: → `Ready` after `ABC-167`, as far as Ready's WIP limit (8) allows.** Column moves are the
Orchestrator's.
