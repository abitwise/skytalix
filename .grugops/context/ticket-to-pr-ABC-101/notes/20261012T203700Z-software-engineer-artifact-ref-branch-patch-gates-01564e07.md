---
id: 20261012T203700Z-software-engineer-artifact-ref-branch-patch-gates-01564e07
kind: artifact-ref
by: software-engineer
task: ticket-to-pr-ABC-101
at: 2026-10-12T20:37:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - src/cli-options.ts
  - src/cli.ts
  - src/cli.test.ts
  - src/cli.real-engine.test.ts
  - src/level-seam.ts
  - 20261012T203600Z-software-engineer-decision-stop-do-not-amend-abc086-443a041f
supersedes:
---

# Branch, patch, files and gates

This note is hand-authored and unsealed.

- **Branch:** `grugops/ABC-101-difficulty-selection`, worktree `../wt-ticket-to-pr-ABC-101`, from `main` `f0bd27f7`.
  The brief names base `4aa99deb`, and `f0bd27f7` is that commit plus one board commit. Not merged, not pushed. The
  branch holds ONE records commit (these notes, `probe/`, the trace row, `## Delivery`) and NO `src/` change.
- **The build:** `probe/abc101-full-not-committed.diff`. Apply it with `git apply` on `f0bd27f7`. The probe tree is
  the dangling commit `c7fbafff` (tree `0c6cedc4`), made with `commit-tree`; no ref was created or moved.
  `git diff --numstat f0bd27f7 c7fbafff`:
  - `src/cli-options.ts` +31 −1: `--difficulty` and `1`..`5` join `ACCEPTED_ARGUMENTS`; `Difficulty = 1|2|3|4|5`;
    `DEFAULT_DIFFICULTY = 3`; `ResolvedOptions.difficulty`; an exact-equality arm like `--colour`'s.
  - `src/cli.ts` +13 −7: the docblock sentence that would have gone false; `USAGE` gains
    `[--difficulty 1|2|3|4|5]`; `engine: withBook(book, createLevelSeam(difficulty, { seed: Math.floor(Math.random()
    * 2 ** 32) }))`.
  - `src/level-seam.ts` +21, new flat production module (A9's "at most one"): `createLevelSeam(level, options):
    EngineSeam`, the size of `createEngine`, with an `Object.hasOwn(LEVELS, level)` refusal.
  - `src/cli.test.ts` +216 −14, and `src/cli.real-engine.test.ts` +45 (one `CLI_DEEP` row, `A10`).
  - **New test files: 0. New default-lane spawns: 0** (`N8_SPAWN` unchanged at 27; the `--difficulty 3` refusal child
    became `--level 3`).
  - **Untouched:** `src/turn-loop.ts`, `src/engine.ts`, `src/levels.ts`, `src/search*.ts`, `src/evaluate*.ts`,
    `src/quiescence.ts`, `src/transposition.ts`, `src/virtual-clock.ts`, `src/book*.ts`, `data/`, `AGENTS.md`,
    `plans/board.md`. The engine trigger list is not touched, so `ABC-146` is not made stale.
- **Gates, on the probe tree:**
  - `npm run -s lint`: Biome, 113 files, no fixes, exit 0.
  - `npm run -s typecheck`: exit 0. `npm run -s build`: exit 0.
  - `npm test`: **exit 1**. 58 files (56 passed, 2 failed); 1789 tests, 1787 passed, **2 failed**, 0 pending, 0 todo.
    `.test-results/last-run.json` `success: false`. The two reds are in `…57bfba6d`. This build adds 9 default-lane rows, all in `src/cli.test.ts`; the base suite was not re-run at this hop.
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.
  - `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`: exit 0, **10 passed** (base 9 rows + `A10`).
    `abc095-book-absent-*` in `os.tmpdir()`: **0 before, 0 after**.
- **Mutants, each applied and then restored byte-identically (`cmp`):** M-a, the seam ignores the level → A8′ red.
  M-b, `in` instead of `Object.hasOwn` → the own-key row red. M-c, a `Number()` range parse → A3 red. M-d, the root
  passes `3` instead of `difficulty` → `ABC-043` `A1` pin and A8′ root row red.
- **`ADR-0036` clause (b)**, canonical instrument `.grugops/context/design-F-072-1/probe/clause-b.mjs f0bd27f7
  c7fbafff 1|2|3`. 3 production files changed. Limbs 1, 2 and 3: **(b1) 0 capability lines; (b2) 2 new runtime
  edges (`cli.ts → level-seam.ts`, `level-seam.ts → levels.ts`), reaching a holder: 0; word hits 0. Does not fire,
  on any limb.** Baseline at head: 40 production files; limb 1 holder `book-file.ts`; limb 2 holders `cli.ts`,
  `glyph-mode.ts`, `perft-bench.ts`; limb 3 none. Read on the probe pair, because nothing was delivered.
- **No timing reading was taken for this hop.**
