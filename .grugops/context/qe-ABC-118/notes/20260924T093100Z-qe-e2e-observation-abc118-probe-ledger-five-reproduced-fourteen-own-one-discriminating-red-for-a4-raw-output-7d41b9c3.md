---
id: 20260924T093100Z-qe-e2e-observation-abc118-probe-ledger-five-reproduced-fourteen-own-one-discriminating-red-for-a4-raw-output-7d41b9c3
kind: observation
by: qe-e2e
at: 2026-09-24T09:31:00Z
verified_by:
confidence: high
refs:
  - ABC-118
  - tools/grugops/lane-inventory.js
  - vitest.config.ts
supersedes:
---

# `ABC-118` QE: the probe ledger (every round in a copy outside the repository)

**Hand-authored `observation`, no stamp.** Beside this note:

- Raw transcripts: `raw-probe-output.txt` and `raw-a4-a5-a2-output.txt`.
- Harnesses: `raw-probe-harness.mjs.txt` and `raw-a4-a5-a2-harness.mjs.txt`. Both refuse any
  destination outside `/scratchpad/qe118-copy`.
- Load: 5.10 at the start, 11.58 at the end.

**Discipline.** The QE worktree (`162b2bd` plus the claim commit; code identical to the tip) was
`rsync`ed to the scratchpad without `.git`, `node_modules` or `.claude`. The copy was then
`git init`ed and committed once: 42 tracked `*.test.ts`, porcelain EMPTY. `node_modules` was
symlinked in and listed in `.git/info/exclude`. After every round:

- `git reset --hard <base>`, then `git clean -fd`, then `.claude/` removed.
- Asserted: HEAD equals base, porcelain EMPTY, config byte-equal to the original, instrument
  exit 0 at 42/42.

All 17 harness reverts read that way, so did the separate `A4-X` revert, and so did the final check. **`vitest.config.ts` in this repository
was never edited.**

"root" is `vitest list --filesOnly` at the copy's root, which is the `npm test` form the instrument
reads. "src" is the same command with `--dir src`, which is the unit gate's form.

## The Engineer's five, reproduced

| round | change (copy only) | root | src | instrument | L/T/B |
|---|---|---|---|---|---|
| base | none | 42 | 42 | exit 0 `42 … git tracks 42. No findings.` | — |
| `E-M1` | `exclude += "**/glyph-mode.nfr.test.ts"` | 41 | 41 | **RED** exit 1, `Tracked by git but NOT collected by the lane: src/glyph-mode.nfr.test.ts — …` | 0/0/0 |
| `E-M2` pre | checkout at `.claude/worktrees/probe/` (a copy of `src/`, gitignored: porcelain EMPTY) | 42 | — | exit 0 | — |
| `E-M2` | `".claude/**"` → `".cluade/**"` | **84** | **42** | **RED** exit 1, `84 … git tracks 42.` + 42 × `Collected by the lane but NOT tracked by git: .claude/worktrees/probe/src/<f>.test.ts` (43 lines) | 0/0/0 |
| `E-M2` post | typo kept, checkout removed | 42 | — | exit 0 | — |
| `E-M3` | untracked `src/zz-abc118-throwaway.test.ts` | 43 | — | **RED** exit 1, `43 … 42`, named | — |
| `E-M3` + add | `git add` it | 43 | — | exit 0 `43 … 43` | — |
| `E-M4` | `exclude += "**/tools/**", "**/lane-inventory*"` | 42 | — | exit 0, 42/42 (**not discriminating**; see `A4-X`) | — |
| `E-M5` | stock `"**/node_modules/**"` removed | 42 | — | exit 0 (a control; the symlink is not descended) | — |

Every number and message matches the Engineer's table. `E-M2` also shows that **the unit gate's
form stays at 42 under the typo**. Inflation is a `npm test` hazard only.

## QE's own rounds

| round | change (copy only) | root | src | instrument | L/T/B | QE reading |
|---|---|---|---|---|---|---|
| **`A4-X`** | `exclude += "**/tools/**", "**/lane-inventory*", "**/glyph-mode.nfr.test.ts"` | 41 | — | **RED** exit 1, `41 … git tracks 42.`, `src/glyph-mode.nfr.test.ts` named | — | the discriminating red: guard-aimed globs do not disarm it |
| `Q1` one file, repo-relative | `exclude += "src/perft.test.ts"` | 41 | **42** | **RED** exit 1, `src/perft.test.ts` named | 0/0/0 | caught |
| **`Q1b`** one file, bare name | `exclude += "perft.test.ts"` | **42** | **41** | **exit 0, 42/42, No findings.** | — | **NONE: the unit gate's lane lost a file, the instrument is green (G2)** |
| `Q2` setup | tracked `memory-bank/zz-illustrative.test.ts` committed; config untouched | 42 | — | RED exit 1, `42 … git tracks 43.`, "a `test.exclude` glob … is dropping it" | — | false diagnosis: the glob is correct (G5) |
| **`Q2`** glob ADDS a file outside `src/` | `"memory-bank/**"` removed | **43** | 42 | **exit 0, 43/43, No findings.** | 0/0/0 | **NONE: the lane gained a docs file, the instrument is green (G5)** |
| `Q2b` glob adds an untracked file outside `src/` | untracked `plans/zz-note.test.ts`, then `"plans/**"` removed | 42 → 43 | — | exit 0 → **RED** exit 1, `plans/zz-note.test.ts` named | — | caught |
| `Q2c` | tracked `tools/grugops/zz.test.mjs` committed | 43 | — | **RED** exit 1, "Collected by the lane but NOT tracked by git: tools/grugops/zz.test.mjs" | — | caught, **message false**: it is tracked (G4) |
| `Q3a` renamed | `git mv src/fen.test.ts src/fen-renamed.test.ts`, committed | 42 | — | exit 0, 42/42 | — | correct |
| `Q3b` renamed, no git | plain `mv`, not committed | 42 | — | **RED** exit 1, 42/42, two lines: `src/fen.test.ts` "a `test.exclude` glob … is dropping it" + `src/fen-renamed.test.ts` untracked | — | caught; first diagnosis false (G6) |
| `Q3c` renamed to `.spec.ts` | `git mv … src/fen.spec.ts`, committed | 42 | 42 | **RED** exit 1, `42 … git tracks 41.`, "`src/fen.spec.ts` NOT tracked by git" | — | caught; message false (G4) |
| **`Q3d`** renamed out of the lane | `git mv … src/fen.tests.ts`, committed | **41** | **41** | **exit 0, 41/41, No findings.** | 0/0/0 | **NONE: the lane lost a file; the commit moved the expectation (G3)** |
| `Q4a` untracked | `spike/zz-untracked.test.ts` | 43 | 42 | **RED** exit 1, named | — | caught (root form only) |
| `Q4b` untracked `.spec.ts` | `src/zz-untracked.spec.ts` | 43 | — | **RED** exit 1, named | — | caught |
| **`Q5`** `.skip`-only | committed `src/zz-skip-only.test.ts`, `describe.skip` around one `it` | 43 | — | **exit 0, 43/43, No findings.** | — | **NONE, by design**: the file is collected. Unit lane 43 files / 1362 / pending 1 → skip count 1, `test-skip-integrity --skip-count 1` **exit 1** `Unjustified skips: the runner reported 1 skipped tests but only 0 are justified.` The skip is caught by the step the gate runner does call |
| `Q6` cannot look | the copy without `.git` | — | — | **exit 2** `` Error: `git rev-parse --show-toplevel` failed with exit 128. `` | — | "could not look" stays distinct from a clean fail |

## What the rounds say

- **Every edit in the ticket's defect class that changes the `npm test` set reads RED.** That
  covers both directions and the guard-aimed globs. Tally: `E-M1`, `E-M2`, `A4-X`, `Q1`, `Q2b`.
- **Four rounds read NONE (no red):**
  - `Q1b`: the unit gate's form was changed, not the root form.
  - `Q2`: the new file is already in the expectation, because it is tracked.
  - `Q3d`: a commit moved the expectation.
  - `Q5`: this one is out of the defect class by design, and `test-skip-integrity` catches it.
- **Four REDs print a false diagnosis** (`Q2` setup, `Q3b`, `Q3c`, `Q2c`: G4 to G6). Every one of
  them fails in the safe direction.
