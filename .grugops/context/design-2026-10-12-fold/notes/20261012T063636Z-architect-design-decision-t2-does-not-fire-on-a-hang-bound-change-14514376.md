---
id: 20261012T063636Z-architect-design-decision-t2-does-not-fire-on-a-hang-bound-change-14514376
kind: decision
by: architect-design
task: design-2026-10-12-fold
at: 2026-10-12T06:36:36Z
verified_by:
confidence: high
refs:
  - ABC-116
  - ADR-0017
  - AR-N8SPAWN-DRIFT
  - G-QE115-3
  - QE2-116-b
  - src/cli.test.ts
  - plans/nfr-catalog.md
  - 20261012T062100Z-software-engineer-decision-abc116-settle-and-surface-wording-16a8ee37
  - 20261012T062637Z-qe-e2e-decision-abc116-recheck-verdict-6a1c2b14
supersedes:
---

# A change to a child's hang bound alone does NOT fire `T2`. The four triggers stay four

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`). Item 1 of
subtask `design-2026-10-12-fold`. It is recorded as `ADR-0017` § Addendum 2026-10-12 A1.

## The question

`ADR-0017` decision 2 says `T2` fires on four things: argv, stdin script, substitution hook and settle. It does
not mention the hang bound (`timeout`, which `childOf` passes to `spawnSync`). The Engineer (`…16a8ee37`) and QE
(`…6a1c2b14`) both routed the question to this role.

## The ruling

**It does not fire `T2`.** No fifth trigger is added.

## Why, read from the code at `d8794608`, not from the notes

- `childOf` passes `timeout: options.timeout ?? 30_000` to `spawnSync`.
- `childOf` throws on any `child.error`. A reached bound returns `ETIMEDOUT`, which QE measured at
  `qe2-ABC-116`. So no child can pass by reaching its bound.
- A child that finishes inside its bound runs the same work under any bound, because the timer never fires.
- **So a bound change either costs nothing or turns a row red.** `AR-N8SPAWN-DRIFT` is cost that grows while
  the lane stays green, and `T2` controls only that. A bound change cannot be that kind of drift.
- **The bound was never a cost control.** The comment on the `timeout` line says "not a performance
  assertion". The `ADR-0017` mutant grew one child by about 3 s and stayed green under the 30 s default.
- **The ruling does not rely on "two orders of magnitude".** That premise is false for `A9` (`QE2-116-b`).

## The two cases, named

- **`A9`.** `A9_BOUND_MS` is `A9`'s criterion: the child has exited inside the bound. Changing it is a criterion
  change. It belongs to BA/PM, and the in-file check that the bound stays under `T_open` pins it. It is not a
  `T2` event.
- **A bound raised because a child reached it.** The growth is the event, not the bound.
  - If the growth came from the child's argv, stdin script, hook or settle, `T2` already fired on that edit.
  - If it came from production code, the ticket's narrow-set reading covers it (`ADR-0035` d2).

## Owed elsewhere

- **No `src/` edit is owed and no SE hop is owed.** The `ChildOptions` carrier already says "`timeout` is the
  hang bound, not the settle", and it names only the four triggers. That agrees with this ruling.
- **BA/PM.** `ABC-116`'s `C2` still reads "`timeout` (the settle)", as QE named. That correction is BA/PM's, and
  this ruling does not make it. The BA/PM fold hop running in parallel may already carry it.
