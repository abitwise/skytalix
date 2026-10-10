---
id: 20261010T150119Z-security-nfr-observation-abc072-fixtures-plants-limb-demo-gates-6dd88c01
kind: observation
by: security-nfr
at: 2026-10-10T15:01:19Z
verified_by:
confidence: high
refs:
  - ABC-072
  - ABC-073
  - ABC-055
  - ABC-042
  - ABC-082
  - ABC-059
  - ABC-065
  - ADR-0036
  - V1.2.5
  - V1.3.2
  - N8-LANE
  - .grugops/context/design-ABC-072/probe/clause-b.mjs
  - .grugops/context/design-ABC-072/probe/mutants.sh
  - .grugops/context/secnfr-ABC-072/probe/RUN.txt
  - .grugops/context/secnfr-ABC-072/probe/sec-mutants.sh
  - .grugops/context/secnfr-ABC-072/probe/limb-ruling.patch
  - 20261010T144155Z-architect-design-observation-clause-b-instrument-readings-fixtures-mutants-self-run-23cfa14f
supersedes:
---

# `ABC-072` Security/NFR readings: the delivered instrument reproduces every recorded answer. The limb list as written misses 8 of 13 plants silently. The widened list catches 12 of 13 and moves no baseline or fixture answer

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
Every reading here was taken by this hop in its own worktree (`.claude/worktrees/secnfr-ABC-072`,
`5f48753f`). Node v26.11.0, TypeScript 5.9.3. The commands are in `probe/RUN.txt`, and the full
output is beside it.

## O1. The delivered instrument reproduces the Architect's readings

From `fixtures.delivered.out.txt`, each limb takes 0.54–0.96 s wall, at load1 13.50 at the end:

| pair | L1 | L2 | L3 | (b) | recorded |
|---|---|---|---|---|---|
| `dbaf972f^..dbaf972f` (`ABC-042`) | 0 | (b1) 4: `cli.ts:73,76,81,90`; (b2) `cli.ts -> glyph-mode.ts` (holds it) | 0 | FIRES | FIRES ✅ |
| `34c9c026^..34c9c026` (`ABC-082`) | 0 | 0; 4 new edges, none to a holder | 0 | no | no ✅ |
| `4c33b72b^1..4c33b72b` (`ABC-059`) | 0 files | 0 | 0 | no | no ✅ |
| `460b9f58^1..460b9f58` (`ABC-065`) | 0 files | 0 | 0 | no | no ✅ (`A5`) |
| `088e48db~1..088e48db` (delivered) | 0 files | 0 | 0 | no | no ✅ |
| `6bfc7b29..5f48753f` (whole branch) | 0 files | 0 | 0 | no | — |

- **Baseline:** **0 / 3 / 0** at `6bfc7b29` (36 production files) and at `f76e041` (35). The limb-2
  holders are `cli.ts`, `glyph-mode.ts` and `perft-bench.ts`. There are 9 limb-2 and 6 limb-3 raw
  word hits.

## O2. Security/NFR's 13 plants against the delivered instrument (`sec-mutants.out.txt`)

**Fires only on S12. Eight plants are SILENT: no count, no word hit, nothing unresolved.**

| plant | delivered | how it shows |
|---|---|---|
| S1 `import { readFileSync } from "fs"` | no | silent |
| S2 `const { argv } = process` | no | silent |
| S3 `process["env"]` | no | silent |
| S4 `globalThis.process.env.HOME` | no | 1 word hit |
| S5 `Function("return 1")` (no `new`) | no | silent |
| S6 `new WebSocket("ws://…")` | no | silent |
| S7 new `src/zz.mjs` with `execSync` | no | silent; 0 production files |
| S8 `.ts` edge into that `.mjs` | no | 1 unresolved, but the verdict line says "does not fire" |
| S9 `import ts from "typescript"` | no | silent |
| S10 an existing multi-line `spawn(` with only its argument line edited | no | silent |
| S11 `import(s)`, non-literal | no | 1 unresolved, but the verdict line says "does not fire" |
| S12 `Worker` via `node:worker_threads` | **FIRES** L1 | counted |
| S13 `(0, eval)("1")` | no | 1 word hit |

**Facts behind the plants, each checked on this host:**
- **Lint.** Biome's `useNodejsImportProtocol` reports S1 as **info, exit 0**. Biome and `tsc`
  include only `src/**/*.ts`, so S7 is neither linted nor typechecked.
- **Globals.** `typeof WebSocket` is `function` and `typeof Worker` is `undefined`. In ESM,
  `require` is `undefined`.
- **Runtime.** A `.ts` file evaluates an imported `.mjs`. Destructuring `process` and calling
  `Function()` both run.
- **Dependencies.** `package.json` has 0 runtime dependencies (devDependencies only).
- **Today's tree.** Production code at `5f48753f` contains no bare-package import, no unprefixed
  builtin, no bare `process` and no non-`.ts` source.

## O3. The ruled limb list, demonstrated (`limb-ruling.patch` on a temporary copy, deleted after the runs)

- **Fixtures (`fixtures.widened.out.txt`).** All 21 rows (7 pairs × 3 limbs) give the same verdict
  and the same counts as the delivered instrument. The baseline is still **0 / 3 / 0** at
  `6bfc7b29` and at `f76e041`, with the same three holders. Only the limb-2 raw word count grows
  (9 → 11), because its word regex is now `\bprocess\b`.
- **Plants (`sec-mutants.widened.out.txt`).** S1–S12 FIRE; S11 fires as "disputed". S13 stays a
  listed word hit, by ruling.
- **The Architect's nine.** Re-run against the same copy, they are **byte-identical** to
  `design-ABC-072/probe/mutants.out.txt`: 9 of 9 as designed.
- **Patch check.** The patch applies with `patch -p0` and reproduces the demo copy byte-for-byte.
  It is 118 lines of diff and changes no logic outside the limb predicates, the production-file
  test, the call span and the verdict line.

## O4. The two readings, checked independently

- **Who reaches a holder at runtime (`5f48753f`).** The only runtime edge into a holder is
  `src/cli.ts:71 import { beginGlyphModeSession } from "./glyph-mode.ts"`, and `cli.ts` is itself a
  holder. The AST (O1) and a line grep agree.
- **`src/cli-options.ts`.** Its only imports are `import type` (`:38` `glyph-mode.ts`, `:39`
  `render.ts`). "spawn" appears only in its docblock (`:7`, `:8`). It has 0 limb occurrences in
  code.
- **Type imports at runtime (Node v26.11.0).** `import { type A } from "./x.ts"` **evaluates**
  `x.ts`; `import type { A }` does not. Checked in a scratch directory.

## O5. ABC-072 / ABC-073 acceptance, re-read

- **`A6` (072).** `git diff --name-only 088e48db~1 088e48db` lists 3 paths (the ADR, `ABC-055`,
  `ABC-072`), 0 under `src/`.
  - The blobs of `ABC-041`/`042`/`065`/`066` are `2fa4aec2`/`43954c4f`/`7432212c`/`6089e6c8`. They
    are equal at `088e48db~1`, at `088e48db`, at `5f48753f` and on `main`.
  - The record commit `5f48753f` touches only context, `traceability.md` and the 072/073 pages.
- **`A4` (072).** "hop that ends it" occurs 0 times in § Canonical clause (b). It survives only in
  § Context (`:34`), which quotes the defect.
- **`A2` (072).** "Production capability — a DELTA test" occurs once in the tree.
- **073 `A1`.** Over whitespace-normalized text, the non-`Done` pages that return either grep are
  `ABC-072` (now ruled) and `ABC-073` (itself). `ABC-055` (`ready`) returns neither.
  `history/ABC-064-board-history.md` returns grep 1 but is an archive file with no status.
- **073 `A2`–`A5`.** `ABC-055` carries the fail-safe 1×, normalized, and cites `ADR-0036` 1×.
  - Its one hunk sits inside § Security / NFR triggers (`:127`–`:139`).
  - `## Acceptance` is byte-identical (24 lines), and so is everything outside that section.
  - `ABC-053` is `status: done`.
- **UAT-waiver measure.** 0 production lines in the delivered commit.

## O6. Gates at `5f48753f` (this worktree)

- `npm run lint`: exit 0, 100 files.
- `npm test`: exit 0, 52 files, **1608 passed**. It took **12.22 s at load1 21.55–26.40** (QE's
  deep lanes); the Architect's 6.95 s was at lower load, and no `src/` changed.
- Skip capture: **0**. `test-skip-integrity.js … --skip-count 0`: `No findings.`
