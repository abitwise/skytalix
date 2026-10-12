---
id: 20261012T205400Z-software-engineer-observation-criteria-a5i-prime-a7-a9-clause-b-c243b4f0
kind: observation
by: software-engineer
task: resume2-ABC-101
at: 2026-10-12T20:54:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-086
  - ABC-042
  - ABC-065
  - ADR-0036
  - RISK-002
  - 20261012T205300Z-software-engineer-artifact-ref-merge-code-commit-gates-4822a352
  - 20261012T203800Z-software-engineer-observation-criteria-guards-agents-line-3bfd8b9d
supersedes:
---

# Criteria on the delivered pair `e88a7832..ac8deab1`: (i′), A7, A9 and clause (b)

This note is hand-authored and unsealed. The probe-tree readings of `A1`-`A3`, `A5`, `A8′`, `A10` and the
probe mutants are in `…3bfd8b9d` and are not restated; the delivered tree reproduces the probe's `src/` plus
the rows below, and its suite results are in `…4822a352`.

**`ABC-086` `A5`(i′), the re-pinned row.** One `it`, titled "(i′) the shipped construction passes no clock,
and its default level is the shipped engine", asserting the page's four in order: (1) `src/cli.ts` contains
`createLevelSeam(difficulty, { seed: Math.floor(Math.random() * 2 ** 32) })` verbatim; (2) the module that
`src/cli.ts` imports `createLevelSeam` from, resolved from `cli.ts`'s own import line rather than spelled,
has 0 `/\bnow\b/` matches; (3) `LEVELS[DEFAULT_LEVEL]` `toEqual` `{ budgetMs: DEFAULT_BUDGET_MS, blunderRate:
0 }`, `DEFAULT_BUDGET_MS` imported from `./engine.ts`; (4) `resolveOptions([])` `toMatchObject` `{ ok: true,
options: { difficulty: DEFAULT_LEVEL } }`. Green. Mutants, each applied then restored (`cmp` 0): a `now:
Date.now` at the root (1) → red; a `now: Date.now` injected in `level-seam.ts` (2) → red; `DEFAULT_DIFFICULTY
= 2` (4) → red. Mutant (3) needs `src/levels.ts` edited, which is fenced; not run.

**`A9`, `git diff -U0 e88a7832 ac8deab1 -- src/engine.test.ts`: three hunks.** `@@ -38,0 +39 @@` (import
`resolveOptions` from `./cli-options.ts`), `@@ -55,0 +57 @@` (import `DEFAULT_LEVEL, LEVELS` from
`./levels.ts`), `@@ -861,2 +863,20 @@` (the `(i)` `it`'s title and its one `expect`, replaced). Every hunk is
in the import block or inside that one `it`; `(ii)` and every other row are byte-identical. Code set: the
five allowed files + `src/engine.test.ts`; 1 new flat module (`level-seam.ts`); 0 new test files.
`AGENTS.md` untouched (the Scribe's). Engine modules (`turn-loop.ts`, `engine.ts`, `levels.ts`, `search*`,
`evaluate*`, `quiescence.ts`, `transposition.ts`, `virtual-clock.ts`), `src/book*.ts`, `data/`: 0 lines.

**`A7`, two halves.** Code: the test row over `executableCodeOf("cli-options.ts")` is green (0). Added lines:
`git diff -U0 e88a7832 ac8deab1 -- src/cli-options.ts`, `+` lines, `grep -niE
'depth|ply|millisecond|\bms\b|nodes?/sec|budget'`: **0 matches** (exit 1). Raw whole file: the two
tolerated `ABC-042` hits only, `:8` "0.112 ms" and `:149` "simply" (the page's `:129` at base).

**`ABC-042` `A8`.** Both lists stay `toEqual`: `cli.ts` `["0","0x20","0x7f","1","2","32","70"]`,
`cli-options.ts` `["0","0.5","1","2","3","4","5"]`; the comment names `32` (seed exponent, `ADR-0037` D3),
the reused base `2`, and `1`-`5` as the `Difficulty` ordinals with `3` also the default.

**`ADR-0036` clause (b)**, canonical `design-F-072-1/probe/clause-b.mjs e88a7832 ac8deab1 1|2|3`: 3
production files changed; on every limb (b1) 0 capability lines, (b2) 2 new runtime edges (`cli.ts →
level-seam.ts`, `level-seam.ts → levels.ts`) reaching a holder: 0, word hits on added lines 0. **Does not fire
on any limb.** Baseline at head: 40 production files; limb 1 holder `book-file.ts`; limb 2 holders `cli.ts`,
`glyph-mode.ts`, `perft-bench.ts`; limb 3 none. Same reading as the probe pair.

**Criteria, delivered:** `A1` PASS, `A2` PASS, `A3` (+ extended) PASS, `A4` struck, `A5` PASS (usage rows
green; the three advertised forms were run at the probe hop, `…3bfd8b9d`, not re-run here), **`A6` FAIL until
the Scribe's line lands** (the one expected red), `A7` PASS (both halves), `A8′` PASS, `A9` PASS (as widened),
`A10` PASS (`CLI_DEEP` 10/10). `ABC-086` `A5`(i′) PASS, (ii) PASS.
