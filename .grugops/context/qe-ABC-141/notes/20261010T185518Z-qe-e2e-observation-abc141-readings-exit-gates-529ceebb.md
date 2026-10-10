---
id: 20261010T185518Z-qe-e2e-observation-abc141-readings-exit-gates-529ceebb
kind: observation
by: qe-e2e
at: 2026-10-10T18:55:18Z
verified_by:
confidence: high
refs:
  - ABC-141
  - QE-129-b
  - QE-139-c
  - ADR-0011
  - src/move-input.ts
  - src/move-input.test.ts
  - src/history-pane.ts
supersedes:
---

# QE `ABC-141`: readings for `A1`–`A4`, the owner-Q4 exit, the pins, and the flake runs

This note is hand-authored and unsealed. The probes and raw outputs are in `../probe/` (`…aef1ebbe`).

## `A1`: the derive count

- **Counter.** QE wrote its own, `qe141-count.mjs`, and runs it on `git archive` copies outside the repo. It
  differs from the SE's entry splice: it RENAMES the exported `legalMoves` to an inner function and appends a
  counting wrapper export. It also snapshots each call's position through `toFen`.
- **Results** for `SIX_QUEENS_FEN` `Qxd4` (FEN read from each tree's own test file):

| tree | derives | on the start position | on other positions | candidates |
|---|---|---|---|---|
| `957a85c3` (base) | **7** | 1 | 6 distinct | 6, all `#` |
| `f92868f6` (code) | **7** | 1 | 6 distinct | 6, all `#` |
| `75dcc0f5` (control) | 6 | 1 | 5 | 6, five `#`, `Q8xd4` plain |

- **Control.** `TWO_KNIGHTS_FEN` `Nd2` gives 1 on every tree.
- **Greps.** `cost six of those` and `measured six` read 1 / 1 at `957a85c3` and **0 / 0** at both `f92868f6`
  and `4bfc7b3e`. `seven: 1 + 6` reads 1 at each site at the tip, so the two sites agree.

## `A2`: the fullmove pointer

- `` `ABC-010` is the ticket that would `` reads 1 at the base and **0** at `f92868f6` and at `4bfc7b3e`.
- On the tip's archive, `parseFen("4k3/8/8/8/8/8/8/4K3 w - - 0 10000").fullmoveNumber` is **10000**. Fullmove
  `1e20` is also accepted.
- The paragraph states that the limit is accepted and names no ticket as delivering a bound.

## `A3`: owner Q4, by QE's own harness `qe141-q4.mjs`

- **Paths.** `--name-only 957a85c3..f92868f6 -- src` gives exactly the 3 files.
  `f92868f6..4bfc7b3e -- src` is empty.
- **Measure (i), AST comment ranges.** QE takes `getLeading`/`getTrailingCommentRanges` over every AST node.
  Removed lines are judged at the base and added lines at the tip. Every non-blank character must lie in a
  comment.
- **Measure (ii), the emit.** `transpileModule` with `removeComments` must be byte-identical at base and tip,
  under the repo tsconfig and under ESNext.

| file | (i) removed / added | (ii) emit sha256 (first 12) | Q4 |
|---|---|---|---|
| `src/move-input.ts` | 1/1, 2/2 HOLDS | `1206a1e6f551` = (both options) | HOLDS |
| `src/move-input.test.ts` | 1/1, 2/2 HOLDS | `c43a444a41f3` = (both options) | HOLDS |
| `src/history-pane.ts` | 2/2, 3/3 HOLDS | `6e1a37155324` = (both options) | HOLDS |

- **Controls, per file.**
  - Five negative controls FAIL the conjunction in all 3 files: exec, type-only, `//` inside a template,
    code behind a comment, and a code line commented out (that one is caught by judging removed lines at the
    base). NEG-type-only passes (ii) alone, which is why one measure is never enough.
  - A POS control (one comment line added inside the edited docblock) HOLDS in all 3 files, including
    `move-input.test.ts`, where the SE's harness had a placement artefact.
  - The emit hashes match the SE's prefixes.

## Pins

- **`R5`–`R5d`.** These pin text in `src/history-pane.nfr.test.ts` (`:486–:537`). That file is not in the diff.
- **`history-pane.ts`.** Its only text pin is `history-pane.nfr.test.ts:386`, the
  `import type { GameHistory }` line, and that line is unchanged. The licence scan at `:375` matches only
  `^import|export` lines, and the new lines start with ` * `.
- **`ADR-0011` P8.** The class trigger fires only on executable edits inside the two guards' `it` bodies, so
  it does not fire.
- **`it` bodies (AST, `qe141-enclosing.mjs`).** No changed line is inside an `it` or `test` call.
  `move-input.test.ts:493–494` sit in a `describe` callback, in the `RENDERED` docblock.

## `A4`: gates at `4bfc7b3e`

| gate | exit | load1 |
|---|---|---|
| `npm run lint` | 0 (100 files) | 5.57 |
| `npm run typecheck` | 0 | 5.57 |
| `npm run build` | 0 | 5.57 |
| `test-skip-integrity.js --skip-count 0` | 0, `No findings.` | 21.15 |
| `lane-inventory.js` | 0, 52/52, `No findings.` | 21.15 |
| `host-protection.js` | **2**, `UNKNOWN - verify` (gh returned no readable HTTP status) | 21.15 |

- The UAT spec-integrity step does not apply: there is no `*.uat.spec.ts`.
- E2E is `UNKNOWN - verify` per the `AGENTS.md` slot (no UI surface).

## Flake: `npm test -- --reporter=json`, 8 runs in a row at `4bfc7b3e`

| run | UTC | exit | files / tests | passed | failed | pending+todo | load1 before → after |
|---|---|---|---|---|---|---|---|
| 1 | 18:52:50 | 0 | 52 / 1663 | 1663 | 0 | 0 | 7.36 → 11.34 |
| 2 | 18:53:00 | 0 | 52 / 1663 | 1663 | 0 | 0 | 11.34 → 15.81 |
| 3 | 18:53:11 | 0 | 52 / 1663 | 1663 | 0 | 0 | 15.81 → 17.75 |
| 4 | 18:53:23 | 0 | 52 / 1663 | 1663 | 0 | 0 | 17.75 → 18.06 |
| 5 | 18:53:32 | 0 | 52 / 1663 | 1663 | 0 | 0 | 18.06 → 18.36 |
| 6 | 18:53:40 | 0 | 52 / 1663 | 1663 | 0 | 0 | 18.36 → 20.65 |
| 7 | 18:53:50 | 0 | 52 / 1663 | 1663 | 0 | 0 | 20.65 → 23.26 |
| 8 | 18:54:00 | 0 | 52 / 1663 | 1663 | 0 | 0 | 23.26 → 24.35 |

- **0 failures in 8 runs**, at load1 7.4–24.4 on 8 cores. The `ABC-083` build and the `ABC-093` QE were running
  in parallel.
- The count matches the base (1663), and skips are 0.
- **The SE's single failure stays unnamed and unreproduced.** See `QE-141-a` in `…baafc88b`.
- The per-run, per-file status and the log hashes are in `../probe/npm-test-x8.txt`.
