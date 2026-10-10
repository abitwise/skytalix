---
id: 20261010T154029Z-qe-e2e-observation-abc132-readings-exit-gates-b8a8159b
kind: observation
by: qe-e2e
at: 2026-10-10T15:40:29Z
verified_by:
confidence: high
refs:
  - ABC-132
  - QE-129-b
  - src/render-seam.ts
  - src/result-screen.ts
  - src/cli.ts
  - .grugops/context/qe-ABC-132/probe/
supersedes:
---

# QE `ABC-132`: acceptance readings, exit measurements and gates

This note is hand-authored and unsealed. The base is `3159ab68`. The tip is `7387c65a` (SE code `1416a069`
plus the QE comment fix).

## Acceptance

| # | verdict | QE reading |
|---|---|---|
| `A1` | MET | `git grep -n FRAME_PRODUCERS -- src`: base 2 (`render-seam.ts:35`, `result-screen.ts:14`) → tip **0** |
| `A2` | MET | `git grep -niE 'frame producers?' -- src`: base 3 (`cli.ts:8`, `render-seam.ts:34`, `result-screen.ts:13`) → tip **0**. `declared, not derived`: tip prints only `src/history-pane.nfr.test.ts:168` |
| `A3` | MET | `probe/a3.mjs` strips ` * ` and collapses whitespace in the header docblock. `render-seam.ts` has `COMPOSITION_ROOT` and `ADR-0029` (both absent at base). `result-screen.ts` has `ADR-0029` and "NOT on the frame path". Both kept sentences are present at base and tip and **string-identical** (183 and 121 characters). `git diff --word-diff`: only the three stale sentences move, plus re-wrap carries of ` * ` |
| `A4` | MET | `git diff --name-only 3159ab68..7387c65a -- src` lists exactly `src/cli.ts`, `src/render-seam.ts` and `src/result-screen.ts`. The ticket's pipeline, run verbatim, prints nothing (grep exit 1). The gates are below |

## Exit: owner Q4 measurements, per production file (`probe/exit132.mjs`, QE's own implementation)

- (i) is checked two ways: the ticket's regex, and the TypeScript **scanner**'s comment trivia. The
  scanner approach is a different implementation from `qe-ABC-129`'s AST walk.
- (ii) is checked under the repo's `tsconfig` options and under ESNext defaults, by full sha256.
- (iii) is extra: the non-trivia token stream must be identical.

| file | (i) changed / regex / scanner | (ii) emit, base = tip | (iii) tokens | Q4 |
|---|---|---|---|---|
| `src/cli.ts` | 7 / 7 / 7 | `eb8a971137c3a81c` (2286 B) IDENTICAL, both option sets | IDENTICAL | **HOLDS** |
| `src/render-seam.ts` | 12 / 12 / 12 | `564e88c7c137120d` (515 B) IDENTICAL, both | IDENTICAL | **HOLDS** |
| `src/result-screen.ts` | 8 / 8 / 8 | `3dce8d0657339010` (2211 B) IDENTICAL, both | IDENTICAL | **HOLDS** |

**Cross-check.** `qe-ABC-129/probe/exit-probe.mjs` over the same range reads the same counts and
hashes, with (iii) IDENTICAL. Its `controls.mjs` at `7387c65a` reproduces N1–N4 as recorded.

**Controls per file**, each an in-memory mutation of the tip. All are in `probe/exit-7387c65a.txt`:

| control | (i) | (ii) | Q4 |
|---|---|---|---|
| NEG-exec: `export const __qeNeg = 1;` | FAILS | DIFFERENT | **red** on all 3 |
| NEG-type-only: `export type __QeNeg = 1;` | FAILS | **IDENTICAL**, blind | **red** on all 3, by (i) alone |
| NEG-template: a line that starts with `//` inside a template literal | the scanner FAILS it | DIFFERENT | **red** |
| NEG-code-behind-comment: `/* x */ export const …` | FAILS | DIFFERENT | **red** |
| POS: one comment line inserted | HOLDS | IDENTICAL | **holds** on all 3 |

The type-only row is the `QE-129-b` blind spot, reproduced. It is why the conjunction is required.

## Frame-path membership (`probe/closure.mjs`, Node v26.11.0)

- **Closure.** The closure of `render-seam.ts` is 11 modules: `apply`, `fen`, `frame`, `history-pane`,
  `legal`, `moves`, `position`, `render-seam`, `render`, `san`, `status-panel`. It contains no
  `result-screen.ts` and no `cli.ts`.
- **Per-frame loads.** Frames were drawn for `ascii`/`unicode` × `white-bottom`/`black-bottom`, on an
  empty game and on a game of 40 plies. Five `setImmediate` turns were settled. The frames loaded 0
  modules.
- **Positive control.** A direct import of `result-screen.ts?control` is recorded.

## Gates (worktree at `7387c65a`)

- `npm run lint`: exit 0 (100 files, no fixes).
- `npm run typecheck`: exit 0.
- `npm run build`: exit 0.
- `npm test`: exit 0, **52 files / 1608 passed**, 0 skipped. This includes the raw-text bars over these
  files: `cli.test.ts` bar 1 and `render-seam.test.ts` `A6`/`A7`.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`
- `node tools/grugops/lane-inventory.js`: 52 collected / 52 tracked, `No findings.`
- Opt-in lane (AGENTS.md, `src/cli.ts` in the diff): `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`
  ran 7 tests, all passed, in 6.55 s.

## Coverage

There is no executable delta, so line coverage does not move. The lean-mode threshold of 0.8 is not
re-measured: a comment-only diff cannot move it.
