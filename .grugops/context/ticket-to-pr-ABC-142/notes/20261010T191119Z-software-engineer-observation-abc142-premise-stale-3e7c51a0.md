---
id: 20261010T191119Z-software-engineer-observation-abc142-premise-stale-3e7c51a0
kind: observation
by: software-engineer
at: 2026-10-10T19:11:19Z
verified_by:
confidence: high
refs:
  - ABC-142
  - ABC-042
  - QE-141-a
  - QE-093-e
  - package.json
  - src/cli.test.ts
  - tools/grugops/run-bounded.js
  - .grugops/queue/claimed/ticket-to-pr-ABC-142/claim.md
supersedes:
---

# SE `ABC-142`: STOPPED before code. The A5 path fence cannot be met; the premise is stale.

This note is hand-authored and unsealed.

## What blocks

`src/cli.test.ts:1665-1686` (`ABC-042` A10, "package.json gains exactly one scripts key and nothing
else") pins `scripts.test` byte-exact with `toBe`:

    test: "node tools/grugops/run-bounded.js 60000 vitest run",

So ANY edit to `package.json`'s `test` script — the ticket's named candidate and the first path A5
allows — turns the blocking `npm test` gate red, and A5 forbids the one-line `src/` edit that would
move the pin. The ticket and the queue file both missed this pin.

## Measured, base `51c1b6ed`, scratch copy outside the repo (`git archive` + linked `node_modules`)

Script changed to `... vitest run --reporter=default --reporter=json
--outputFile.json=.test-results/last-run.json`, then `npx vitest run src/cli.test.ts`: exit 1,
1 failed | 66 passed (67). Failing test:
`src/cli.test.ts > ABC-042 — the shape of what was delivered > A10 — package.json gains exactly one
scripts key and nothing else` — `scripts.test` Expected the pinned line, Received it with the
reporter flags appended. No file in the repository or any worktree was modified.

## Routes, none taken (the choice is the Orchestrator's / BA-PM's)

1. **`package.json` script + one-line update of the `SCRIPTS_AT_HEAD` pin in `src/cli.test.ts`.**
   Smallest honest diff; the pin's job (catch unreviewed script drift) is kept, it just moves. Needs
   A5's "zero `src/`" relaxed to "one pinned test line, zero production lines" — the UAT waiver
   measure (`grep -v '\.test\.ts$'`) still reads empty.
2. **`vitest.config.ts` `reporters` + `outputFile`.** Leaves the script and the pin alone. The ticket
   fences only `exclude`/`isolate`/pool there, but the queue's path fence excludes the file. Note:
   it also applies to every direct `npx vitest run` (the `*_DEEP` lanes), not only `npm test`.
3. **`run-bounded.js` appends reporter args when the command is `vitest`.** Inside the letter of the
   fence, but it makes a generic wrapper silently rewrite its argv and routes around the A10 pin's
   intent. Not recommended; rejected by the SE.

## State

Queue: claimed, not done (`claim.md` carries `status: stopped`). No worktree, branch or commit was
created. Scratch copy deleted.
