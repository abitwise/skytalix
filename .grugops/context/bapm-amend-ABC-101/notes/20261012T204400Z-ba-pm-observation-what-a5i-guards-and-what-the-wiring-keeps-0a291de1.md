---
id: 20261012T204400Z-ba-pm-observation-what-a5i-guards-and-what-the-wiring-keeps-0a291de1
kind: observation
by: ba-pm
task: bapm-amend-ABC-101
at: 2026-10-12T20:44:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-086
  - ABC-087
  - ABC-042
  - ABC-061
  - ABC-065
  - ADR-0027
  - ADR-0032
  - ADR-0037
  - src/engine.test.ts
  - src/cli.ts
  - src/levels.ts
  - 20261012T203500Z-software-engineer-observation-wiring-reds-abc086-a5i-57bfba6d
  - 20261012T203600Z-software-engineer-decision-stop-do-not-amend-abc086-443a041f
  - 20261012T203800Z-software-engineer-observation-criteria-guards-agents-line-3bfd8b9d
supersedes:
---

# What `ABC-086` `A5`(i) guards, what the level wiring keeps, and the readings behind the rulings

This note is hand-authored and unsealed. Each reading below is at `main` `4e5c38d4` unless it names the SE's
probe tree `c7fbafff`, which was read with `git show` from the SE's worktree. Read only. No test was run for
these readings, and no timing was taken.

**What the old row pins.** `src/engine.test.ts:861-863`:
`expect(cliSource).toContain("createEngine({ budgetMs: DEFAULT_BUDGET_MS })")`. That one literal carries
two properties. (a) No `now` is passed, so the clock is the wall clock. (b) The budget is `DEFAULT_BUDGET_MS`.
A5's last line forbids buying determinism with the budget.

**What the probe's wiring keeps, link by link.**
- **Root:** `createLevelSeam(difficulty, { seed: Math.floor(Math.random() * 2 ** 32) })`. The options object is
  `{ seed }`, with no `now`.
- **Adapter:** `src/level-seam.ts` (probe) passes `options` to `createLevel` unchanged. `/\bnow\b/` has 0 matches
  in it (`git show c7fbafff:src/level-seam.ts | grep -nw now`, exit 1).
- **Levels:** `src/levels.ts` `createLevel` uses `options.now ?? Date.now`, so the clock is the wall clock.
- **Default level:** `LEVELS[3]` is `{ budgetMs: 3_000, blunderRate: 0 }`. `src/levels.test.ts:228-237+`
  (`ABC-087` `A6`) asserts `budgetMs === DEFAULT_BUDGET_MS` and `blunderRate === 0`. It also asserts
  that rate 0 returns `chooseMove`'s move, depth, nodes and elapsed time on the same clock.
- **Default resolution:** the probe's `resolveOptions([])` returns `difficulty: 3` = `DEFAULT_LEVEL`
  (SE `…3bfd8b9d`, `A2`).
- **Synchronous call:** the adapter calls `choose(...)` synchronously inside the async seam. `ABC-086` `A6`'s
  transposition-table safety argument (`src/engine.ts:515`) still holds.

**ADRs, read for a design conflict.** None was found.
- `ADR-0027` decision 3: deterministic mode is the shipped engine plus a virtual clock. Decision 4: no
  production module imports the clock, and `src/cli.ts` never does.
- `ADR-0032`: a level with rate 0 IS the shipped engine.
- `ADR-0037` D3: the seed is `Math.floor(Math.random() * 2 ** 32)` when `ABC-101` wires a level.
- No ADR names `createEngine` as the shipped construction. `ADR-0027` § Context
  "`src/cli.ts:175` … passes none" and `ADR-0037:64` are dated observations, not decisions.

**`A7` grep at base.** Running `grep -niE 'depth|ply|millisecond|\bms\b|nodes?/sec|budget' src/cli-options.ts`
returns 2 hits. `:8` is "0.112 ms" and `:129` is "simply stops". The probe has the same two hits, at `:8` and
`:149`. Both are `ABC-042` comments, and neither cites `RISK-002`.

**`ABC-042` `A8` numbers.** `STATUS_ROWS = 3` (`src/status-panel.ts:71`) and `HISTORY_ROWS = 8`
(`src/history-pane.ts:71`). The probe adds `3` to `cli-options.ts` as a `Difficulty` ordinal and the default. It
equals `STATUS_ROWS` by value only.

**`ABC-065` `A3`, a LOW observation for QE. No criterion conflict.** The value half is
`expect(slot).toContain(value)` (`src/cli.test.ts:2213-2215`). For the one-character values `1`–`5`, any digit
anywhere in the slot satisfies it, for example `ABC-065` or `70`. The option-set equality is what actually
pins `--difficulty`. Not amended here, because it is outside this fence.

**AGENTS.md:** 24,569 B at base. The SE's slot line is +4 B, which makes 24,573 B against the 24,576 B guard
(`src/cli.test.ts:2371`).
