---
id: 20261012T203500Z-software-engineer-observation-wiring-reds-abc086-a5i-57bfba6d
kind: observation
by: software-engineer
task: ticket-to-pr-ABC-101
at: 2026-10-12T20:35:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-086
  - ABC-065
  - src/engine.test.ts
  - src/cli.ts
supersedes:
---

# The level wiring reds a merged criterion of another ticket: `ABC-086` `A5`(i)

This note is hand-authored and unsealed.

`npm test` on the probe tree `c7fbafff` (the full ABC-101 build, a dangling commit over `f0bd27f7`; no ref
points at it): exit 1, 58 files, 1789 tests, **1787 passed, 2 failed**, 0 pending, 0 todo.

**Red 1, the stop. `src/engine.test.ts` › "ABC-086 A5 — the virtual clock stays off the shipped path" › "(i) the
shipped construction passes a budget and no clock".** The row is
`expect(cliSource).toContain("createEngine({ budgetMs: DEFAULT_BUDGET_MS })")` over `src/cli.ts`'s raw source.
- **Criterion, as written** (`plans/tickets/ABC-086-deterministic-move-selection-under-a-fixed-seed.md` § Acceptance,
  `A5`(i)): "The shipped construction is unchanged: `src/cli.ts:175`, `createEngine({ budgetMs: DEFAULT_BUDGET_MS })`,
  passes no `now`. `ABC-078`'s `A1` and `A4` stay green."
- **Why it reds.** `ABC-101` § Scope (added 2026-10-12) and the brief require the root's `engine:` to be built from
  `LEVELS[level]` through `createLevel`, inside the book. The probe tree's line is
  `engine: withBook(book, createLevelSeam(difficulty, { seed: Math.floor(Math.random() * 2 ** 32) }))`. The literal
  `createEngine(...)` is gone from `cli.ts`, so the construction the criterion calls "unchanged" has changed.
- **What still holds.** The construction passes no `now`, so it stays on the wall clock. `A5`(ii) is green: the
  import walk from `cli.ts` reaches `engine.ts` and not `virtual-clock.ts`. `A5`(iii) is green: `src/engine.ts` is
  byte-identical. `ABC-078` `A1`/`A4` are green. The default level is `LEVELS[3]` = `{ budgetMs: DEFAULT_BUDGET_MS,
  blunderRate: 0 }`, which is the old construction by value (`ABC-101` `A8′`). So the INTENT of `A5`(i) holds and its
  TEXT does not.
- **Not named in advance.** The `ABC-101` page's guard table and the brief's list of `ABC-095` guards do not
  name it. The row sits in `src/engine.test.ts`, which is outside `ABC-101` `A9`'s allowed set.

**Red 2, expected, not a stop. `src/cli.test.ts` › "ABC-065 …" › "A3 — the documented option list EQUALS the accepted
set".** `documented options ["--colour","--ascii","--unicode"]: expected 3 to be greater than or equal to 4`. This is
`ABC-065`'s own predicted failure, and the page's `A6` says a code-only change reds it. The Software Engineer may not
edit `AGENTS.md`, so the line goes to the Scribe (`probe/agents-md-dev-run-slot.txt`). With that line applied in a
scratch copy of the probe tree, `src/cli.test.ts` is 78/78.
