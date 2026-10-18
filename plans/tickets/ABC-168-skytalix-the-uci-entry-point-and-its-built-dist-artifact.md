---
id: ABC-168
title: "`skytalix`: the entry point `src/uci.ts`, the built `dist/uci.js` with its `bin`, one opt-in real-child lane, and the cutechess and GUI play-tests at UAT"
status: backlog
column: Backlog
size: S
priority: P1
epic: EPIC-007
feature: —
---

# ABC-168 — the program a backend or GUI launches: stdin and stdout, the book file, a build, and the proof that standard tools can play it

> **Cut 2026-10-18 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-engine-revise`) as a **proposal**. The id was
> reserved by `bapm-engine-plan`. It stays in `Backlog` until the owner accepts the revised `ADR-0044` and `EPIC-007`.
> Design: `ADR-0044` D2 (entry point), D8 (artifact) and D9 (tests). Owner word: Q7 *"web UI can have it's own backend
> … that uses the engine from CLI … it should be possible to build for engine usage"*, Q9 and Q10 (`…a41c7e02`).
> **This hop ran nothing.**

## Problem

*User:* the owner's web backend (which spawns the engine), a desktop GUI (En Croissant) and `cutechess-cli`.

*Pain:* after `ABC-171` the protocol exists only as a module. Nothing reads stdin, writes stdout or reads the book file.
And Node will not strip types under `node_modules`, so `src/*.ts` cannot be the program a backend depends on
(`ADR-0044` D8).

*Value:* `npm run build` gives `dist/uci.js`, and the `bin` `skytalix`. A backend, a GUI or a tester points at it and
plays. This ticket is also where `EPIC-007`'s value proof is read (M1, M2, M8(a), M9).

## Scope

1. **`src/uci.ts`** (D2). It starts with `#!/usr/bin/env node` and exports nothing (`ADR-0011` clause 4). It reads lines
   with `node:readline` and passes each to the session. It installs the stdout `EPIPE` arm before anything is written
   (`ADR-0016`). It composes `Date.now`, `Math.random` and one
   `createBookProbe({ read: readBookFile, warn, random: Math.random })`, where `warn` writes `info string <message>`.
   Exit codes: `0` on `quit` or end of input, `1` if any command-line argument is given, and `70` on an exception.
2. **The artifact (D8).** `tsconfig.build.json` as D8 specifies. `package.json`: `"build": "tsc -p tsconfig.build.json"`,
   `"uci": "node src/uci.ts"` and `"bin": { "skytalix": "dist/uci.js" }`. `"private": true` stays.
3. **One opt-in real-child lane** (`ADR-0044` D9, the `ABC-119` precedent). One scripted dialogue against the real child,
   under an env flag. Unset means NOT DEFINED. The flag's name is the engineer's, recorded in `AGENTS.md`.
4. **UAT readings:** `EPIC-007` M1, M2, M8(a) and M9, on the owner's Mac.
5. **`AGENTS.md`** (the Scribe, at build time): an `npm run uci` line, the new meaning of `npm run build`, and the lane
   flag. `AGENTS.md` is at its 24 576-byte budget (`wc -c` at `a10e09c2`), so the edit is net ≤ 0 B or rides with
   `ABC-164`.

## Out of scope

- Any edit to `src/uci-session.ts` beyond what composition needs (none is expected), or to any core file.
- `npm publish`, a `prepare` script, install from a git URL, a native binary, a bundler, a Web Worker build
  (`ADR-0044` D8).
- The web backend and its router (the web project's).
- The rename of the package (`ABC-172`) and the licence (`ABC-169`).

## Acceptance (Given/When/Then)

- **`A1` (arguments).** `node src/uci.ts x` exits **1** and writes nothing to stdout.
- **`A2` (normal end).** `printf 'uci\nquit\n' | node src/uci.ts` writes `ABC-171` `A1`'s 5 lines and exits **0**.
  `printf 'uci\n' | node src/uci.ts` (end of input, no `quit`) exits **0**.
- **`A3` (a closed stdout).** `printf 'uci\nisready\nquit\n' | node src/uci.ts | head -1` makes the child exit **0**,
  with no stack trace on stderr.
- **`A4` (the exception path, a review check).** An exception escaping `handleLine` sets exit code **70**, in
  `src/cli.ts`'s shape and without `process.exit`. QE reviews it against `cli.ts` if no test seam reaches it, and says
  which.
- **`A5` (the book through the real file, `EPIC-007` M6).** In the real-child lane: `uci`, `isready`, `position startpos`,
  `go movetime 1000` → the output includes `info string book` and then a `bestmove`. With
  `setoption name OwnBook value false` sent before `isready`, the same dialogue writes an `info depth …` line and no
  `info string book`.
- **`A6` (idle responsiveness, `EPIC-007` M3, proposed).** In the real-child lane, read once with host and load1:
  spawn → `uciok` ≤ **2 s**; the first `isready` → `readyok`, book load included, ≤ **1 000 ms**; a later idle `isready`
  → `readyok` ≤ **100 ms**. Security/NFR places these as candidate row (i) and may change the numbers. A miss is
  reported, not trimmed.
- **`A7` (the artifact, `EPIC-007` M9).** In a fresh clone at the tip:
  - `npm ci && npm run build` exits **0** and creates `dist/uci.js`, whose first line is `#!/usr/bin/env node`;
  - `dist/` holds no `*.test.js`, and no `cli.js`, `turn-loop.js` or `line-input.js`;
  - `printf 'uci\nquit\n' | node dist/uci.js` writes `id name skytalix` … `uciok` and exits **0**;
  - after `npm link`, `printf 'uci\nquit\n' | skytalix` writes the same;
  - `git check-ignore dist/uci.js` prints `dist/uci.js`, and `npm run typecheck` still checks the whole tree and exits
    **0**;
  - **away from the clone:** after `cp -R dist <scratch>/d`,
    `printf 'uci\nisready\nposition startpos\ngo movetime 100\nquit\n' | node <scratch>/d/uci.js` writes exactly one
    `info string` warning about the book, then a legal `bestmove`, and exits **0**.
- **`A8` (UAT, `EPIC-007` M1).** `cutechess-cli`, 6 games against the artifact from the six perft FENs, `proto=uci`,
  `tc=60+1`, default options: **0 illegal moves, 0 time forfeits, 0 disconnects or stalls**. The result lines and the
  `-pgnout` file are kept raw under this ticket's context. The flag spellings and termination strings are pinned on the
  first run.
- **`A9` (UAT, `EPIC-007` M8(a)).** `cutechess-cli`, 2 games from startpos, colours swapped, `depth=4` against the
  artifact: both games end by a chess result or adjudication, 0 illegal moves, 0 stalls, and every searched move's
  final `info` in the `-debug` log reports `depth` ≤ 4.
- **`A10` (UAT, `EPIC-007` M2).** The owner plays one complete game against the artifact in En Croissant. It ends by
  mate, resignation or a draw, with no GUI error dialog and no engine time loss. The GUI lists `OwnBook` and
  `Skill Level`, or, if it shows no options, the `-debug` log of `A8` shows both `option` lines. The owner's word is
  recorded as a transcription, never a stamp.
- **`A11` (the terminal game, `EPIC-007` M5).** The `ADR-0044` D2 "no edit" list is unchanged from `<base>`. The
  `src/cli*.test.ts` suites pass unedited. `npm run chess` still starts the terminal game.
- **`A12` (fences).** `git diff --name-only <base> <tip>` lists only `src/uci.ts`, the real-child test file,
  `tsconfig.build.json`, `package.json` and `AGENTS.md`. `package-lock.json` is unchanged (no dependency is added).

## Dependencies

- **`ABC-171`** (the session's full shape, with `random` and `book`).
- **The owner has installed `cutechess-cli` and En Croissant** before `A8`–`A10` (Q10: he will). Until then those three
  are `UNKNOWN - verify`, and the UAT waits (`EPIC-007` `RISK-EPIC007-02`).
- **`package.json` is shared with `ABC-169` and `ABC-172`.** Each adds different keys. Whichever merges later rebases.
- **Gate:** the owner accepts the revised `ADR-0044` and `EPIC-007`.

## Security / NFR triggers

- **Security: TRIGGERED → `In Security/NFR`.** `ADR-0036` (b1) fires on `process.`, on the `node:readline` import, and
  on the new import of the capability holder `book-file.ts` (limb 1). `ABC-041` clause (a) fires on `package.json`.
  Clause (c): the real-child lane spawns `node`, which `src/cli.test.ts` and `src/cli.real-engine.test.ts` already do,
  so it is expected not to fire. Security/NFR rules on it. ASVS L1 applies to the one input path, stdin, which the
  session already filters to printable text.
- **`ADR-0044` candidate rows for Security/NFR to place in `plans/nfr-catalog.md`:** (i) idle responsiveness (`A6`),
  (ii) time safety (`A8`, `A9`), (iii) stdout hygiene (every line an M4 keyword, checked in the lane).
- **`NFR-004`:** unchanged. **`NFR-006`:** the same book file, ≤ 1 MB. **`NFR-008`:** the lane is opt-in, so the default
  lane adds 0 spawns and the `N8-SPAWN` balance stays 0 ms.
- **The `build` gate changes meaning:** from a second typecheck to "the engine artifact builds" (`ADR-0044` D8). The
  `typecheck` gate still covers the whole tree.

## Test notes

1. **The lane is one dialogue.** It runs `A5`, `A6` and the M4 check in one spawn, against `node src/uci.ts`. `A7` runs
   the same against `dist/uci.js`, by hand, at the build hop and again at UAT.
2. **`A8`–`A10` are UAT readings, not vitest rows.** They are host tools on the owner's Mac.
3. **No strength is claimed** from `A8` or `A9`. They are protocol and time safety.
4. **QE re-runs `A7` in its own fresh clone**, because a build that only works in the engineer's tree is the failure it
   exists to catch.

## Size and priority

**`S`:** one small composition file, one config file, three `package.json` keys, one lane and four UAT readings.
**Not `XS`:** the build and the UAT readings are real work. **Not `M`:** no protocol or engine logic is written here.

**`P1`, inherited from `EPIC-007`.** It carries the epic's value proof.

## Definition of Ready

BA/PM, 2026-10-18, at `main` `a10e09c2`. **Result: 9 of 10. Stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** no process, no build, and `.ts` cannot be run from `node_modules` |
| 2 | scope and out-of-scope clear | **✅** named files; publish, binary, bundler and backend fenced off |
| 3 | INVEST-shaped | **✅** the only ticket with a capability; its value is the play-test |
| 4 | acceptance testable and measurable | **✅** exit codes 0 / 1 / 70; 2 s, 1 000 ms, 100 ms; 0 / 0 / 0 over 6 games; depth ≤ 4 |
| 5 | dependencies known | **✅** `ABC-171`; host tools; `package.json` shared |
| 6 | security/NFR triggers with a measurable target | **✅** (b1) and (a) fire; three candidate rows with numbers |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `S` |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker | **❌** the owner has not accepted the revised `ADR-0044` |

**Recommended: stay in `Backlog` until the owner accepts. Then → `Ready` after `ABC-171`.** Column moves are the
Orchestrator's.
