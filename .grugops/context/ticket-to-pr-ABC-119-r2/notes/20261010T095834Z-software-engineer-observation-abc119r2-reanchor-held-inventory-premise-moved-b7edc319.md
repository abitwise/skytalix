---
id: 20261010T095834Z-software-engineer-observation-abc119r2-reanchor-held-inventory-premise-moved-b7edc319
kind: observation
by: software-engineer
at: 2026-10-10T09:58:34Z
verified_by:
confidence: high
refs:
  - ABC-119
  - G-06
  - A2
  - ABC-118
  - plans/tickets/ABC-119-no-test-anywhere-runs-the-delivered-clis-real-engine.md
  - tools/grugops/lane-inventory.js
  - .grugops/context/recut-abc119/notes/20261010T094401Z-ba-pm-decision-c9eab692.md
supersedes:
---

# `ABC-119` r2: every re-anchor the page cites HOLDS at `242b624`. One `A2` premise does not: `lane-inventory.js` exits 1 on the base, for reasons that predate this ticket

Hand-authored, no seal (degraded posture, `AGENTS.md`). This covers task `wave-2026-09-25`, subtask
`ticket-to-pr-ABC-119-r2`, on branch `grugops/ABC-119-r2` from `242b624`.

## Re-anchors, checked before any code (all held)

- Since the re-cut's `2287959`, `git diff --stat 2287959 242b624 -- src/` names one file only: `src/turn-loop.test.ts` (+6/−1, `ABC-128`).
  Nothing the page cites moved.
- `src/cli.test.ts`: four `export const DEFAULT_BUDGET_MS = 0` at `:595`, `:617`, `:732`, `:750`. The wiring regex is at `:2512`, and
  `const N8_SPAWN = 17 + 7 + 1 + 2` is at `:1832`.
- `src/cli.ts:175`: `engine: createEngine({ budgetMs: DEFAULT_BUDGET_MS })`.
- `src/engine.ts`: `DEFAULT_BUDGET_MS = 3_000` (`:122`), `HARD_CEILING_MS = 5_000` (`:129`), and the deadline
  `Math.min(options.budgetMs, HARD_CEILING_MS)` (`:464`).
- `src/engine.test.ts:68-73` explains the guard and `:73` is the `RUN_DEEP` form. 13 `src/` files read a `*_DEEP` variable.
- A hand probe gave real 3.10 s, user 3.27 s, exit 0, at load1 3.3. The command was `printf 'zz9\n' | node src/cli.ts --colour black --ascii`.

## The premise that moved: `A2`'s "`lane-inventory.js` exits 0"

- **On the base** (main checkout at `242b624`), it exits **1**: 50 collected / 53 tracked. These three files are tracked but not
  collected:
  - `.grugops/context/cut-harder-puzzles/probe/vitest-price.test.ts` (`c632048`, 2026-10-10);
  - `.grugops/context/fold-abc084-gate-b/probe/a3-const-eval.probe.test.ts` (`0ebe63f`, 2026-10-10);
  - `.grugops/context/ruling-abc079-oracle/probe/vt/oracle.test.ts` (`b324cb6`, 2026-09-24). `ABC-122`'s QE hop already
    named this one as pre-existing.
- **On the branch** (`d45ca68`), it exits **1**: 51 / 54, with the same three paths and no others. The new file is in both
  sets. That is the property `ABC-118`'s control exists to check.
- **No build of this ticket can make it exit 0** inside its fence. The fix is either a `vitest.config.ts` edit
  (fenced by `A5`) or deleting other tasks' tracked probe files. Neither is this ticket's to make.
- **Two readings, and I do not pick one.** (a) The clause means "the new file is tracked and collected": that is MET. (b) The clause means
  "exit 0" literally: that is NOT MET by construction. This is a criterion decision. **BA/PM rules it.**
