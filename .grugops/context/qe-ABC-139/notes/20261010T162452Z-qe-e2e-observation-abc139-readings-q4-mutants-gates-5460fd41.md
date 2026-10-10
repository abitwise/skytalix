---
id: 20261010T162452Z-qe-e2e-observation-abc139-readings-q4-mutants-gates-5460fd41
kind: observation
by: qe-e2e
at: 2026-10-10T16:24:52Z
verified_by:
confidence: high
refs:
  - ABC-139
  - QE-129-b
  - src/command-input.test.ts
  - src/turn-loop.ts
  - .grugops/context/qe-ABC-139/probe/RUN.txt
  - .grugops/context/qe-ABC-139/probe/qe139-q4.mjs
  - .grugops/context/qe-ABC-139/probe/qe139-cadence-mutants.sh
  - .grugops/context/ticket-to-pr-ABC-139/probe/q4-abc139.mjs
  - .grugops/context/qe-ABC-132/probe/exit132.mjs
supersedes:
---

# `ABC-139` QE readings: Q4 on QE's harness and on two re-run harnesses, two cadence mutants, and the gate

This note is hand-authored and unsealed. Raw output is in `../probe/RUN.txt`. Node v26.11.0, arm64. QE's own worktree
was `.claude/worktrees/qe-ABC-139` at `daa5184a`.

## Commands run

- `node .grugops/context/qe-ABC-139/probe/qe139-q4.mjs <worktree> e7641dea 0d22d9d6 src/command-input.test.ts <scratch>`
- `node .grugops/context/ticket-to-pr-ABC-139/probe/q4-abc139.mjs <worktree> e7641dea 0d22d9d6 src/command-input.test.ts`
  (the SE's harness; ran, not refused)
- `node .grugops/context/qe-ABC-132/probe/exit132.mjs <worktree> e7641dea 0d22d9d6 src/command-input.test.ts`
  (ran, not refused)
- `bash .grugops/context/qe-ABC-139/probe/qe139-cadence-mutants.sh <worktree>`
- `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`
- `npx vitest run --reporter=json | jq` for the skip count
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`
- `node tools/grugops/lane-inventory.js`

## QE's Q4 harness, and how it differs from the SE's

**Measure (a) is two-sided.** A changed line passes only when both hold:
- every non-whitespace character lies in a TS comment range, collected at each AST leaf token's full start and end;
- no character lies in a leaf token's own `[getStart, end)` span.

JSDoc subtrees are excluded, so a JSDoc comment can never count as code. **Measure (b)** compares the
`createPrinter({ removeComments: true })` print. **(c)**, the leaf-token stream, is corroboration and never stands in
for (a) or (b).

| run | (a) | (b) | (c) | Q4 |
|---|---|---|---|---|
| REAL `e7641dea..0d22d9d6` (8 changed, −3/+5) | HOLDS (0 bad) | IDENTICAL | IDENTICAL | **HOLDS** |
| POS reword an in-block line | HOLDS | IDENTICAL | IDENTICAL | HOLDS |
| POS insert `/* */` line in block | HOLDS | IDENTICAL | IDENTICAL | HOLDS |
| POS insert `//` line in block | HOLDS | IDENTICAL | IDENTICAL | HOLDS |
| NEG `toBe(4)`→`toBe(5)` at `:417` | FAILS | DIFFERENT | DIFFERENT | FAILS |
| NEG `// x` inside the `it()` title (`:407`) | FAILS | DIFFERENT | DIFFERENT | FAILS |
| NEG type-only, `:318` `number \| undefined` | FAILS | DIFFERENT | DIFFERENT | FAILS |
| `/*` … `*/` lines comment out `:417` | **HOLDS** | DIFFERENT | DIFFERENT | FAILS |
| BOUNDARY trailing `// QE` on `:417` | FAILS | **IDENTICAL** | IDENTICAL | FAILS |

The SE's harness re-run gives REAL HOLDS, POS HOLDS and both NEGs FAIL. `exit132.mjs` gives REAL (i) 8/8 scanner
comments, (ii) emit `49f5f1b78b96cf9a` IDENTICAL under the repo tsconfig and ESNext, and (iii) tokens IDENTICAL. Both
are byte-identical to the SE's `RUN.txt`. `exit132.mjs`'s POS control does not fit this file, which has no
block-comment header; the SE flagged this, and QE's in-block POS controls replace it.

## Cadence mutants

These were transient edits of `src/turn-loop.ts`. Each was restored by `git checkout` and verified clean. Nothing was
committed under `src/`.

| mutant | A3 row result |
|---|---|
| M0 none | 1 passed |
| M1: EOF calls the render seam once before its notice | **`expected 5 to be 4`** |
| M2: a message-less `command` makes one extra render-seam call | **`expected 7 to be 4`** (+3 = one per `board`) |

The "187 skipped" in each mutant run is vitest's `-t` row filter. It is not a skip.

## Gate at `daa5184a`

- lint exit 0 (100 files)
- typecheck exit 0
- build exit 0
- `npm test` exit 0: 52 files, **1,608** passed, 11.6 s
- JSON skip count **0**. The JSON field `numTotalTestSuites` = 348 counts describe blocks, not files.
- `test-skip-integrity.js --skip-count 0`: `No findings.`, exit 0
- `lane-inventory.js`: "collects 52 test files; git tracks 52", `No findings.`, exit 0

**Cost.** QE added no test file, `it` or spawn, so `N8-LANE` is not affected by this hop.
