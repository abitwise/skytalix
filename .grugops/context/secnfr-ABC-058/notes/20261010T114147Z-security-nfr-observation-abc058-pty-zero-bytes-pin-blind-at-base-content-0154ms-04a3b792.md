---
id: 20261010T114147Z-security-nfr-observation-abc058-pty-zero-bytes-pin-blind-at-base-content-0154ms-04a3b792
kind: observation
by: security-nfr
at: 2026-10-10T11:41:47Z
verified_by:
confidence: high
refs:
  - ABC-058
  - ABC-041
  - ABC-042
  - V1.2.5
  - V1.3.3
  - N8-LANE
  - N8-SPAWN
  - ADR-0035
  - src/cli.test.ts
  - src/cli.ts
  - .grugops/context/secnfr-ABC-058/probe/tty.sh
  - .grugops/context/secnfr-ABC-058/probe/tty-extract.out.txt
  - .grugops/context/secnfr-ABC-058/probe/pin-gaps.out.txt
  - .grugops/context/secnfr-ABC-058/probe/scan-literals.out.txt
  - .grugops/context/secnfr-ABC-058/probe/content-cost.out.txt
  - 20261010T113116Z-qe-e2e-observation-abc058-clause-c-question-for-security-nfr-ebb74095
  - 20261010T113116Z-qe-e2e-observation-abc058-gap-register-904bdd2d
  - 20261010T113116Z-qe-e2e-observation-abc058-twenty-four-probes-head-vs-base-4b252e30
supersedes:
---

# `ABC-058` Security/NFR readings: a RED bar 3 on a real pty puts 0 of the token's bytes on the terminal, even with the filter deleted; the pin was already blind to a namespace-import `execSync` child at base; 0 of 51 test files hold a `//` or `/*` literal outside the strip helper; the added strip costs 0.154 ms per run

Hand-authored and unsealed: no `finding` is admissible on this install (`AGENTS.md`). The rulings
that use these readings are in the decision note `…ae61a3cb`.

**Setup.**
- Two out-of-tree `git archive` trees in the scratchpad, with `node_modules` symlinked:
  - head `be12015a`, the review tip. It differs from QE's `fb914ded` in 0 `src/` paths;
  - base `b21ec7cf`.
- Machine: Apple M3, 8 cores, Darwin 25.5.0, Node v26.11.0.
- Other hops were on the machine: the catalog Security/NFR hop and the `ABC-087` engineer. load1 is
  logged beside every run.
- Mutants use QE's `mutate.cjs`, copied unchanged from `qe-ABC-058/probe/` (every anchor must occur
  exactly once). After each probe the tree is restored from a pristine copy and checked with
  `diff -r`.

## R1. QE's TTY `UNKNOWN - verify` is CLOSED: 0 bytes on a pty

`probe/tty.sh` runs `npx vitest run src/cli.test.ts` under `script -q`, so vitest's stdout is a real
pseudo-terminal. A smoke check under the same wrapper read `isTTY true`. The byte counts are taken on
the raw transcript, which is exactly what the terminal would have received.

The summaries are in `tty-extract.out.txt`. It re-reads the same transcripts with ESC sequences
removed. The summary column in `tty.out.txt` is empty because vitest puts colour codes inside the
`Tests` line on a TTY. The byte counts in `tty.out.txt` are valid.

| probe (filter in `src/cli.ts:125`) | tree | load1 | tests | BEL | DEL | `ESC[2J` | `purple` | failure text |
|---|---|---|---|---|---|---|---|---|
| control | head | 5.52 | 66/66 | 0 | 0 | 0 | 0 | — |
| `M3h` (DEL passes) | head | 5.52 | 1 failed | 0 | 0 | 0 | 0 | `expected [ 127 ] to deeply equal []` |
| `Q1` (BEL passes) | head | 5.40 | 1 failed | 0 | 0 | 0 | 0 | `expected [ 7 ] …` |
| `Q2` (ESC passes) | head | 6.33 | 1 failed | 0 | 0 | 0 | 0 | `expected [ 27 ] …` |
| **`NOFILT`**: filter deleted (`if (false) continue;`) | head | 6.06 | 2 failed | **0** | **0** | **0** | **0** | `A8` number row, and `expected [ 7, 27, 127 ] …` |
| `NOFILT` | base | 5.90 | 2 failed | 0 | 0 | 0 | 0 | `A8` number row, and `expected [ 27 ] …` |

- **The worst case is the filter gone entirely, and even then nothing reaches the pty.** The failing
  assertion reports code points as integers, and the code frame vitest prints shows test source.
  That source spells the token as `\u` escapes, not raw bytes.
- The raw `.bin` transcripts (~15 KB each) stay in the scratchpad and are not committed. `tty.sh`
  regenerates them.

## R2. The spawn pin's blind spots at BASE: QE-058-a is a new hole in a guard that already had wider ones

`probe/pin-gaps.sh` and `pin-gaps.out.txt`. The test file only, inserted after
`const startGame = …`.

| probe | base `b21ec7cf` | head `be12015a` | load1 |
|---|---|---|---|
| control (a comment line) | GREEN 66/66 | GREEN 66/66 | 5.15 / 5.36 |
| **`P1`**: `import * as cp from "node:child_process"` + `cp.execSync("true")`, a **shell** child that no counter sees | **GREEN 66/66** | **GREEN 66/66** | 4.97 / 5.41 |
| `P2`: a real `spawnSync` after a URL string on the same line (`"https://example.org/x", strayU = spawnSync(…)`), QE `Q11` in its realistic form | RED, pin | **GREEN** | 5.22 / 5.30 |

- **`P1` is pre-existing and is not this ticket's.**
  - The pin's import match reads only the `import { … }` form, and the call count reads only
    `spawnSync(`.
  - The file header's bar 1b sentence ("no `exec(` or `execSync(` call site and no `shell:`") has no
    row that would catch `P1`.
  - `S1` was cut on 2026-10-10 because `MS4` (`shell: true` on the one call site) goes red 18/66.
    `P1` is a different shape, and that cut does not cover it.
- **`P2` reproduces QE-058-a in the shape most likely to arrive by accident:** a URL in a string.

## R3. How common the accidental shape is: one helper regex, nothing else

`probe/scan-literals.mjs` and `scan-literals.out.txt` parse every `src/*.test.ts` with the
repository's own TypeScript 5.9.3 parser. The parser is string-, comment-, regex- and
template-aware.
- **51 files. Only 4 literals carry `//` or `/*`, and all 4 are the same expression:** the comment-strip
  helper's own regex `/\/\*[\s\S]*?\*\//g`, copied into `cli.test.ts:64`, `line-input.test.ts:956`,
  `render-seam.test.ts:112` and `san.parse.test.ts:308`.
- **There is no other `//` or `/*` string, template or regex literal in any test file.**
- **The parser sees one `spawnSync(` call** in `cli.test.ts`, at line 341 in `childOf`. This agrees
  with QE's three views.
  - The script also listed `.exec(` at line 505. That is `RegExp.prototype.exec` on
    `/^NODE_EXIT=…/m`, matched by my callee filter, and is not a child process.

## R4. The content cost of the change, timed directly

`probe/content-cost.mjs` and `content-cost.out.txt`.
- **What the change adds to a run.** `S5` adds one `executableCodeOf("cli.test.ts")`: two regex
  replaces over 184 062 chars, in place of `sourceOf`. `S4` adds two bytes to an argv that already
  exists, which is no separate work.
- **The reading:**
  - in-process CPU, `process.cpuUsage`, 50 calls per round, 9 rounds with round 0 discarded;
  - **median 0.154 ms per call, max 0.187 ms**, at load1 5.05;
  - one call per run;
  - **N8-LANE bound 650 ms.**
- The file count is 0 → 0 added and the child count is 27 → 27, so the floor account and the spawn
  account are both charged 0.
- Lane timing was not re-run. The Engineer's two sets stand as reported, and QE re-scored them to
  the same figures.

## R5. `ABC-041`'s other three clauses, checked

- **(a)** `git diff --numstat b21ec7cf be12015a -- package.json package-lock.json`: 0 lines.
- **(b)** Under the DELTA reading: non-test paths under `src/` in `b21ec7cf..be12015a` = 0. The STATE
  reading is unchanged by this diff (`ABC-072`).
- **(d)** One `src/` path.
- **The added `src/` lines contain no `writeFile`, `fetch(`, `http`, `net.`, `mkdtemp`,
  `appendFile` or `rmSync`.** No network and no filesystem write enters through (c) either.

## Not done by this hop

- No lane timing (R4).
- No full gate re-run: QE ran the full gate at `fb914ded`, and the tip differs from it in 0 `src/`
  paths. The single-file control is 66/66 on head, twice (R1 and R2).
- No `src/` byte, board, catalog, ADR or `AGENTS.md` change.
