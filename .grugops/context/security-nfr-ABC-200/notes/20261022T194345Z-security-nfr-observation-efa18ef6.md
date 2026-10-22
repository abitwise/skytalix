---
id: 20261022T194345Z-security-nfr-observation-efa18ef6
kind: observation
by: security-nfr
at: 2026-10-22T19:43:45Z
verified_by: 
confidence: high (instrument, probes and pty runs read at the tip in a scratch clone; outputs hashed)
refs:
  - ABC-200
  - EPIC-006
  - G6
  - ABC-037
  - ABC-041
  - ABC-173
  - ABC-178
  - ABC-199
  - ADR-0016
  - ADR-0035
  - ADR-0036
  - ADR-0044
  - AR-1
  - AR-096-C1CP
  - R-173-2
  - NFR-003
  - NFR-007
  - NFR-008
  - N8-LANE
  - V2.1.1
  - V2.2.1
  - V2.3.1
  - V1.3.2
  - bd745ac9
  - 1efd2cee
  - 0a07df04
  - be70482f
  - 20261022T191404Z-architect-design-decision-f612277c
  - 20261022T191359Z-architect-design-observation-0d7cbff3
  - 20261022T193034Z-software-engineer-decision-11628f2f
  - 20261022T193009Z-software-engineer-observation-f274160a
  - 20261022T193009Z-software-engineer-observation-3ccb839a
  - 20261022T173546Z-security-nfr-decision-7d7b76ec
  - 20261022T174056Z-release-manager-decision-edd18e94
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
  - plans/tickets/ABC-200-on-a-terminal-npm-run-chess-asks-for-colour-and-difficulty-when-the-flags-are-absent.md
supersedes: 
seal: sha256:8a02cbe6d553c07a55cf914d32df2f3c5e9e52375c5501691c6981427b688ffd
---

# ABC-200 Security/NFR readings: clause (b) on the canonical instrument, the input surface probed, a pty Ctrl-D reading, AR-1 checks 4 and 5a–5e. Records only, no vitest, no timing

Security/NFR, task `security-nfr-ABC-200`, 2026-10-22. Worktree `../wt-security-nfr-ABC-200`, branch `grugops/security-nfr-ABC-200` from `main` `be70482f`. Scratch clone of `grugops/ABC-200` at tip `0a07df04` (code `1efd2cee`, base `bd745ac9`, an ancestor of `main`). Its own `npm ci --ignore-scripts` used a scratch cache (rc 0). Host: Apple M3 Mac15,13, Node v26.11.1. No vitest was run, and nothing was timed. QE (`qe-ABC-200`) is claimed and has published nothing yet, so nothing here leans on it.

## 1. Diff scope (read with git)
- `bd745ac9..1efd2cee`: 7 files. New: `src/line-reader.ts`, `src/startup-questions.ts` and `src/startup-questions.test.ts`. Edited: `src/cli.ts`, `src/cli-options.ts`, `src/line-input.ts` and `src/line-input.test.ts`. `1efd2cee..0a07df04` adds only the three SE notes.
- 0 changes to `package.json`, `package-lock.json`, `tsconfig.build.json` or `.npmrc`, so `ABC-041` clause (a) is quiet.
- **The reader move is behaviour-identical.** I diffed the 76 code lines removed from `line-input.ts` against `line-reader.ts`. Every one is present, except the statements of the old `readLine` arrow, which reappear re-indented inside `read()`, and `interface SubmittedLine`, which gained `export`. `lineReaderOf` has exactly 2 callers: `line-input.ts:106` and `startup-questions.ts:98`. In Node v26.11.1, `process.stdin === process.stdin` is `true`, so the `WeakMap` key the two `cli.ts` spellings hand over is one object.
- `line-input.test.ts`: guards only. The no-`try`/`catch` bar and the banned-token bar now loop over `DELIVERED_FILES = ["./line-input.ts", "./line-reader.ts"]`, and the import-set row gains `./line-reader.ts`. No assertion is weakened.

## 2. ADR-0036 clause (b), canonical instrument
Instrument: `.grugops/context/design-F-072-1/probe/clause-b.mjs` (sha256 `24b963b14fa4…`, last commit `0dfd17b3`). Pair `bd745ac9 1efd2cee`, limbs 1–3. 5 production files changed.
- **Limb 1: does not fire.** (b1) 0. Ruling 2: holders 2 at `<base>` and 2 at `<head>` (`src/book-file.ts`, `src/uci.ts`), 0 holder files changed. (b2): 4 new edges, 0 reach a holder. Word hit: `line-reader.ts:66`, a comment.
- **Limb 2: FIRES.** (b1) lists 3 lines:
  - `src/cli.ts:150 const parsed = resolveOptions(process.argv.slice(2));` The receiving binding was renamed `resolution` → `parsed`.
  - `src/cli.ts:167 const stdin = process.stdin;` A new alias.
  - ``src/cli.ts:200 warn: (line) => process.stderr.write(`${line}\n`),`` Moved inside the `try`, with byte-identical text.
  - (b2): 0 edges reach a holder. Head holders: `cli.ts`, `glyph-mode.ts`, `perft-bench.ts` and `uci.ts`.
- **Limb 3: does not fire.** 0 holders at `<head>`.
- **`const sink = process.stdout;` is NOT a (b1) line.** `git diff -U0` leaves it unchanged; only its line number moves (154 → 164), because the comment block above it grew and the lines around it moved. The Architect's ruling (`…f612277c` R4 and ADR standing) and the ticket page's corrected Security bullet name it "moved". The instrument does not.
- **The `process.*` multiset in `cli.ts` code is identical at base and head:** `argv` 1, `exitCode` 3, `stderr` 3, `stdin` 2, `stdout` 1 (10 tokens). The removed `process.stdin.destroy()` became `stdin.destroy()` on the same object.

## 3. Input-surface probes
Plain `node` probes in scratch (`probe.mjs` sha256 `c37865f50200…`, output `5e2ee0f28132…`), over `PassThrough` sources with a test-set `isTTY`. 12 of 12 rows read as expected.
- **P1 (C0, ESC, DEL):** I sent `\x1b[2J\x1b]0;pwned\x07\x00\x08\x7fx`. The echo is `"[2J]0;pwnedx"`, with 0 C0 or DEL bytes in all output, and the next answer is accepted.
- **P2 (C1):** `U+009B`, `U+009D` and `U+009C` ARE echoed (3 C1 code points written). This is the same filter as `cli.ts` `printableOf` and the ticket's scope 4 (C0 plus `U+007F`).
- **P3 (bidi and zero-width):** `U+202E` + `white` + `U+200B` is rejected and echoed as typed.
- **P4 (look-alikes):** all 9 are rejected: full-width `ｗｈｉｔｅ`, Cyrillic `і`, `white\0`, `5.0`, `05`, `+5`, `5e0`, Arabic-Indic `٥` and `0x5`.
- **P5 (the cap):**
  - a 1 024-char wrong answer is echoed whole, as one 1 051-byte rejection line;
  - a 1 025-char line gets an empty echo;
  - 1 MiB with no newline gets an empty echo, because `pending` is freed past 1 025 units;
  - the next answer (`2`) is accepted.
- **P6 (amplification):** 200 wrong answers of 1 024 chars: 205 002 bytes in, 215 828 bytes out, a ratio of 1.053.
- **P7 (hand-off):** `black\n1\nhelp\n` plus end of input arrive in one chunk. The questions take `black` and `1`, the real seam's first read is `help` (a command), and its second is `eof`. After the questions: 0 `data` listeners and 1 `end` listener.
- **P8 (single `waiting` slot, the residual):** two overlapping `read()` calls on one reader. The second gets `one`, the first never settles, and 1 `data` listener stays attached. No caller in `src/` overlaps reads: `cli.ts` awaits the questions before `runTurnLoop`, and the loop awaits each read.
- **P9 (not a TTY):** in each of (false, true), (true, false) and (undefined, undefined): 0 writes, 0 `end` listeners, and the parsed options are returned.
- **P10:** `isTTY` set to `1` or `"yes"` asks nothing (strict `=== true`).

## 4. Pty reading (Architect residual 3)
`script -q /dev/null` on macOS, `node src/cli.ts` at the tip, under a 15 s `alarm`. Not a timing run.
- **Ctrl-D at the colour question:** the output is the question and the tty's `^D`. Then exit 0, with 0 stderr bytes and no frame.
- **`black`, then Ctrl-D at the difficulty question:** both questions, then exit 0, with 0 stderr bytes and no frame.
- **`purple`, then `\x1b[2J`:** the tty's own echo shows `^[[2J` (ECHOCTL). The app's rejection echoes `"[2J"`, with no ESC.
- No run hung. This is one host's reading. It is not QE's `A8`, which stays QE's.

## 5. AR-1 premise checks (Release Manager table `…edd18e94`, adopted from `…7d7b76ec` § 3), at tip `0a07df04`
- **`F`:** 44 files (42 at `bd745ac9`, plus `line-reader.ts` and `startup-questions.ts`).
  - **5a:** empty.
  - **5b:** empty.
  - **5c:** `node:fs node:readline`.
  - **5d:** empty.
  - `line-reader.ts` imports nothing. `startup-questions.ts` imports `./cli-options.ts` and `./line-reader.ts`.
- **Check 4:** `npm run -s build` exits 0, and the status diff is exactly `> !! dist/`.
  - **Instrument note:** on this host `diff` is a shell function that prints git-style output. Through it, the table's `grep '^[<>]'` prints nothing, which reads as drift (a false alarm, the safe direction). The reading above used `/usr/bin/diff`.
- **5e over `D`** (22 files, unchanged count): empty, empty, empty, then `node:fs node:readline`. Neither new module is in `dist/` (`ADR-0044`).
- Clause (2) is quiet on checks 4 and 5a–5e.
