---
id: 20260807T113000Z-orchestrator-decision-8f5a2b60
kind: decision
by: orchestrator
at: 2026-08-07T11:30:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-014
  - ABC-014
  - ABC-018
  - AGENTS.md
  - package.json
  - src/__snapshots__/render.test.ts.snap
  - plans/board.md
supersedes: 
---

# The self-healing snapshot net is REAL, is ROUTED, and is deliberately NOT fixed on this branch

QE reported that the 24 snapshots it proved are carried by a net that **rewrites itself**: with the
snapshot file deleted and no `CI` variable set, the suite writes 24 fresh snapshots and passes.

## Verified independently, without re-running QE's destructive experiment

Deleting a tracked file to re-derive a result QE already derived would dirty the tree while
Security/NFR is about to work in it. The structural half is checkable on the config surface alone,
and it is sufficient:

- `package.json:12` — `"test": "vitest run"`. **No `--ci` flag.**
- **No `vitest.config.*` exists** in this repo, so nothing sets `snapshotOptions` or `ci` there.
- No `CI` variable is set by anything in this project, and `ADR-0007` plus `AGENTS.md` record that
  **this project has no CI at all** — so the one condition under which vitest fails on a missing
  snapshot is the one condition that never occurs here.

`AGENTS.md`'s `Test (all)` command is therefore, as commanded, unable to fail on a missing snapshot.
QE's claim holds.

## What this does and does NOT mean for ABC-014

**It does not weaken this ticket's verdict, and this is stated so nobody over-reads it.** The
correctness evidence for `src/render.ts` is a mutation campaign — 18 mutants killed by the Engineer,
16 more mutate-and-restore cycles by QE, with the module md5-identical afterwards — plus 253 tests
that include an oracle derived from FEN text that never touches `parseFen` or the 0x88 layout. None
of that rests on snapshot comparison. **The snapshots are a regression net for the future, not the
proof of the present.**

**What it does mean, named plainly:** part of what `ABC-014` hands to `ABC-016`, `ABC-017` and
`ABC-018` is currently a net with a hole in it. A future rendering regression that also deletes or
invalidates the snapshot file passes green. That is worth one word of configuration and it is worth
recording who owns it.

## The decision: routed to the AGENTS.md Scribe, NOT taken here

Per the routing matrix, `AGENTS.md` is the Scribe's file. Three reasons this is a separate task
rather than one more commit on `grugops/ticket-to-pr-ABC-014`:

1. **It is not this ticket's scope.** `AGENTS.md` rules 5 and 9 — only requested work, preserve
   adjacent code. `ABC-014` asked for a renderer.
2. **It would put an unrelated file in this ticket's diff**, which is the exact thing this project
   has kept clean through eleven merges.
3. **Two agents must not write one working tree.** Security/NFR is being scheduled into this same
   checkout now. Width stays 1 for the chain; there is no throughput to buy here.

**It is NOT parked indefinitely and it is NOT a shrug.** It is the named next action after this
ticket closes, and it is one task, not a sweep: the `Test (all)` command slot, and the
`Test integrity` slot beside it that already carries this project's skip-count convention. The fix
is a flag, and the Scribe verifies commands by RUNNING them before recording — which is the
convention that will re-derive QE's experiment properly, in a task that owns the tree.

**Deliberately not decided here:** whether the remedy is `--ci`, `CI=true`, a `vitest.config.ts`, or
a second command slot. That is the Scribe's call with the command in front of it, and guessing it in
advance would be this role writing someone else's file from a distance.

## Not routed, and why

QE's other four items are already owned and are not re-routed by this note:

- **No E2E exists and none could be written** — correct, and it is `EPIC-006`'s, which owns the CLI
  entry point. `quality.ui_e2e` is `ui-or-critical-path` and there is no runnable surface to drive.
  Reported as a gap with no fake invented, which is the right answer.
- **The character choice now costs 7 places instead of 5** — QE says `ABC-018` is the cheapest
  moment to change `:`/`.`. Agreed and left on `ABC-018`; this role does not pre-empt it.
- **`NFR-002` was not re-measured by QE** — correct by this board's practice. Security/NFR
  re-measures rather than inherits, and that is exactly what it is being scheduled to do.
- **The biome `noControlCharactersInRegex` red** — resolved inside QE's own work and recorded.
  Nothing owed.
