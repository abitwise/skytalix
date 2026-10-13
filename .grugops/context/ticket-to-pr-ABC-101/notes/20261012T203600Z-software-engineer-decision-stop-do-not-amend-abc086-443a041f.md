---
id: 20261012T203600Z-software-engineer-decision-stop-do-not-amend-abc086-443a041f
kind: decision
by: software-engineer
task: ticket-to-pr-ABC-101
at: 2026-10-12T20:36:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-086
  - 20261012T203500Z-software-engineer-observation-wiring-reds-abc086-a5i-57bfba6d
supersedes:
---

# Stop at the ABC-086 red. Do not amend another ticket's criterion. Deliver no `src/` commit.

This note is hand-authored and unsealed.

**Decision.** The hop stops. `ABC-086` `A5`(i) is not amended, and `src/engine.test.ts` is not edited. The brief and
the activating agent both say: if another ticket's criterion would have to change, STOP and report. Committing the
build with a red gate would break the brief's "gates before your last commit". So no `src/` change is committed. The
full build is kept as evidence, `probe/abc101-full-not-committed.diff` (27,605 B, sha256 `7ee587c7…aecc74`). It
applies cleanly to `f0bd27f7` and reproduces the probe tree `c7fbafff` exactly (`git diff --quiet c7fbafff -- src`).
This is `ticket-to-pr-ABC-095`'s precedent (`…1e971b4d`): keep the wiring as a probe diff and stop.

**Alternatives, for the Orchestrator. None is taken here.**
1. **Amend `ABC-086` `A5`(i)** (its owner, through the Orchestrator) so it reads: "The shipped construction passes no
   `now`. Since `ABC-101`, `src/cli.ts`'s `engine:` is `createLevelSeam(difficulty, { seed })`, and its default level
   is `LEVELS[DEFAULT_LEVEL]` = `{ budgetMs: DEFAULT_BUDGET_MS, blunderRate: 0 }`. `ABC-078`'s `A1` and `A4` stay green."
   Re-pin the row in the same spirit: `createLevelSeam(` present, no `now:` in the `engine:` expression. Then widen
   `ABC-101` `A9` by one file, `src/engine.test.ts` (one row), and resume by applying the patch. **Recommended.** It
   keeps the intent of `A5`(i) and the shape the brief names.
2. **A default-only branch at the root**, keeping the literal `createEngine({ budgetMs: DEFAULT_BUDGET_MS })` for
   level 3 and `createLevelSeam` for the others. **Not recommended.** It is two code paths kept so that a text pin stays
   green. It is not the shape the brief names (`withBook(book, <level seam>)`). And A8′'s "the root builds level 3
   through `createLevel`" becomes true by value only.
3. **Keep the literal in a comment**, which the raw-source pin would read. **Refused.** It fakes the green.
