---
id: ABC-168
title: "`skytalix`: the entry point `src/uci.ts`, the built `dist/uci.js` with its `bin`, one opt-in real-child lane, and the cutechess and GUI play-tests at UAT"
status: in-development
column: In Development
size: S
priority: P1
epic: EPIC-007
feature: —
---

# ABC-168 — the program a backend or GUI launches: stdin and stdout, the book file, a build, and the proof that standard tools can play it

> **Amended 2026-10-18 by BA/PM** (subtask `bapm-ABC-169-rescope`, at `main` `692770d6`), before any build. This
> ticket would have hit the same blocker that stopped `ABC-169` (`.grugops/queue/done/ticket-to-pr-ABC-169.md`).
> `src/cli.test.ts:1759` (`ABC-042` `A10`) pins `package.json` key by key. Scope 2's `bin`, `build` and `uci` each
> turn it red, and `A11` said the `src/cli*.test.ts` suites "pass unedited". **Ruling:** the delivery makes exactly
> the four pin edits in Scope 6 and no other test edit. `A11` and `A12` are amended to match. Test note 5 lists the
> `AGENTS.md` pins that Scope 5's edit has to keep green. The reasoning is in
> `.grugops/context/bapm-ABC-169-rescope/notes/`.

> **Accepted 2026-10-18 by the owner** (BA/PM, subtask `bapm-epic007-accept`). Owner word, verbatim
> (`.grugops/context/wave-2026-09-25/notes/20261018T113000Z-orchestrator-decision-owner-word-engine-private-adr0044-epic007-accepted-c3e81a57.md`,
> a transcription, not a stamp): *"accept the revised ADR-0044 and EPIC-007"*. The DoR item "owner acceptance" (item
> 10) is met, and the score is now 10 of 10. The UAT still waits on the owner installing `cutechess-cli` and En
> Croissant (Q10); that gates UAT, not Ready. Readings below are unchanged from the cut.

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
6. **`src/cli.test.ts`, `ABC-042` `A10`'s pin only (amended 2026-10-18).** There are exactly four edits, each written
   literally:
   1. add the element `"bin",` to `AT_HEAD` (`:1766-1775`);
   2. take `"bin"` out of the reserved list (`:1789`), which leaves `["main", "files", "publishConfig",
      "dependencies"]` (the key is now meant to be there);
   3. change `SCRIPTS_AT_HEAD.build` (`:1783`) from `"tsc --noEmit"` to `"tsc -p tsconfig.build.json"`;
   4. add `uci: "node src/uci.ts",` to `SCRIPTS_AT_HEAD` (`:1776-1786`). This pins the new script by value, and
      `added` (`:1799`) stays `["chess"]`.

   Nothing else in the test or the file changes, including the test's name, its comments, the sort-and-equal at
   `:1788` and the `private` check at `:1792`. If `ABC-169` has merged first, `AT_HEAD` already holds `"license"`.
   Keep it.

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
- **`A11` (the terminal game, `EPIC-007` M5, amended 2026-10-18).** The `ADR-0044` D2 "no edit" list is unchanged
  from `<base>`. The `src/cli*.test.ts` suites pass. The only edits to any of them are Scope 6's four, in
  `src/cli.test.ts`. `npm run chess` still starts the terminal game. **The pin is still armed:** with the
  `package.json` `bin` key taken out (the test file as at the tip), `ABC-042` `A10` is red, and it is the only red
  row. This is one reading in the hop record, not a new test.
- **`A12` (fences, amended 2026-10-18).** `git diff --name-only <base> <tip>` lists only `src/uci.ts`, the real-child
  test file, `tsconfig.build.json`, `package.json`, `AGENTS.md` and `src/cli.test.ts`.
  `git diff --numstat <base> <tip> -- src/cli.test.ts` shows 4 lines added and 2 removed, which are Scope 6's four
  edits. `package-lock.json` is unchanged (no dependency is added).

## Dependencies

- **`ABC-171`** (the session's full shape, with `random` and `book`).
- **The owner has installed `cutechess-cli` and En Croissant** before `A8`–`A10` (Q10: he will). Until then those three
  are `UNKNOWN - verify`, and the UAT waits (`EPIC-007` `RISK-EPIC007-02`).
- **`package.json` is shared with `ABC-169` and `ABC-172`.** Each adds different keys. Whichever merges later rebases.
- **`src/cli.test.ts`'s `AT_HEAD` is shared with `ABC-169`** (amended 2026-10-18). `ABC-169` adds `"license"` and
  this ticket adds `"bin"`. Whichever merges later rebases and keeps both.
- **Gate: met.** The owner accepted the revised `ADR-0044` and `EPIC-007` on 2026-10-18 (`…c3e81a57`).

## Security / NFR triggers

- **Security: TRIGGERED → `In Security/NFR`.** `ADR-0036` (b1) fires on `process.`, on the `node:readline` import, and
  on the new import of the capability holder `book-file.ts` (limb 1). `ABC-041` clause (a) fires on `package.json`.
  Clause (c): the real-child lane spawns `node`, which `src/cli.test.ts` and `src/cli.real-engine.test.ts` already do,
  so it is expected not to fire. Security/NFR rules on it. Scope 6's pin edits add string literals only. They add no
  import, no call and no capability, so they add nothing to (c). ASVS L1 applies to the one input path, stdin, which the
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
5. **The pins on `package.json` and `AGENTS.md` (amended 2026-10-18, read at `main` `692770d6`).** Only the first
   needs an edit:
   - `src/cli.test.ts:1759` (`ABC-042` `A10`): the key list, the script values, the reserved keys and the added
     scripts. It goes red on `bin`, `build` and `uci`. **Scope 6 fixes it.**
   - `src/cli.test.ts:1111` (`ABC-042` `A1`): `AGENTS.md` contains ``- Dev / run: `npm run chess` `` and
     `scripts.chess` is `node src/cli.ts`. Scope 5 keeps that line exactly as it is.
   - `src/cli.test.ts:2293` (`ABC-071`) and the `ABC-065` block (`:2173`): `AGENTS.md` has exactly one
     `- Dev / run:` slot. The `npm run uci` line goes somewhere else, never under a second `- Dev / run:` label.
   - `src/cli.test.ts:2386` (`ABC-059` `A1-A4`): exactly one script runs `src/cli.ts`, which `uci` does not. Also, no
     span from a `Dev / run` up to the next `.`, `!` or `?` followed by a space may name any `npm run` other than
     `npm run chess`. So `npm run uci` and the new `npm run build` sit outside every such span.
   - `src/cli.test.ts:2438` (`ABC-109` `A5`): `AGENTS.md` is at most 24 576 B (Scope 5 already says so).
   - `src/line-input.test.ts:674`: there is no `dependencies` key. Holds.
   - `src/cli.real-engine.test.ts:84`: the opt-in lane copies `package.json` byte for byte. Holds, because a `bin`
     that points at `dist/` is not read by `node src/cli.ts`.
   `dist/` is already in `.gitignore`, so `A7`'s `git check-ignore` needs no `.gitignore` edit.

## Size and priority

**`S`:** one small composition file, one config file, three `package.json` keys, one lane and four UAT readings.
**Not `XS`:** the build and the UAT readings are real work. **Not `M`:** no protocol or engine logic is written here.

**`P1`, inherited from `EPIC-007`.** It carries the epic's value proof.

## Definition of Ready

BA/PM, 2026-10-18, at `main` `a10e09c2`. **Result: 10 of 10.** Re-scored 2026-10-18 at `main` `50e081fc` (subtask
`bapm-epic007-accept`). It was 9 of 10 at the cut, with item 10 open until the owner accepted. Re-read 2026-10-18 at
`main` `692770d6` (subtask `bapm-ABC-169-rescope`): Scope 6, `A11`, `A12` and test note 5 were added. Items 2, 4 and 7
still hold. **Still 10 of 10.**

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
| 10 | no major unresolved blocker (owner acceptance) | **✅** the owner accepted the revised `ADR-0044` and `EPIC-007` on 2026-10-18 (`…c3e81a57`) |

**Recommended: → `Ready` after `ABC-171`, as far as Ready's WIP limit (8) allows.** Column moves are the
Orchestrator's.
