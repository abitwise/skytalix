---
id: 20261019T223700Z-security-nfr-observation-abc175-verdict-command-lacks-heap-prefix-refused-by-guard-e4b8d062
kind: observation
by: security-nfr
at: 2026-10-19T22:37:00Z
verified_by:
confidence: high
refs:
  - ABC-175
  - ABC-173
  - ADR-0045
  - ADR-0038
  - ADR-0008
  - NFR-008
  - tools/grugops/heap-guard.js
supersedes:
---

# `ABC-175`'s verdict command and its `A1` `-t "3v4"` probe, as written, carry no `NODE_OPTIONS` heap prefix. On the run tree, `ABC-173`'s heap guard refuses both: exit 1, no test run

This note is hand-authored and unsealed. It is an **observation, not a ruling**. Severity: **operational, blocking
for the night**. It is not a security finding. **Owner of the fix: the Orchestrator**, through BA/PM (the ticket
text) and Architect/Design (`ADR-0045` D6.3 and `ADR-0038` addendum 2 quote the same command). This hop changes
nothing.

## What is written

- `ABC-175` § Scope 2, and `ADR-0045` D6.3, give the verdict command as
  `caffeinate -i env LADDER_DEEP=verdict npx vitest run src/ladder.test.ts --reporter=verbose`.
- `ABC-175` `A1` gives the pre-flight as `LADDER_DEEP=1 npx vitest run src/ladder.test.ts --reporter=verbose -t "3v4" > <scratch>.txt 2>&1`,
  which must exit **0**.
- Neither has `NODE_OPTIONS=--max-old-space-size=400`.

## What the run tree does (`f6b63c1c`, which carries `ABC-173`)

- `vitest.config.ts` has `globalSetup: ["./tools/grugops/heap-guard.js"]`. The guard throws when the main process's
  `heap_size_limit` is above the row. For one file, the row is ONE-FILE, 496 MiB. Unprefixed node reads 4192 MiB.
- **Read in this hop (`A0` smoke, one file, unprefixed).** vitest exited **1** with
  `heap-guard: refused. This run's V8 heap_size_limit is 4192 MiB, above the ONE-FILE row of 496 MiB (1 test file …). Prefix the command with NODE_OPTIONS=--max-old-space-size=400, as AGENTS.md spells it.`
  No test ran. `src/ladder.test.ts` is one file, so it has the same shape.
- `AGENTS.md`'s ladder lane line already carries the prefix:
  `LADDER_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts`. QE ran short mode that way
  at `ABC-174`: exit 0, 18/18.

## Consequence

- As written, `A1`'s probe fails, which stops the night (correctly, and before the start).
- If the probe were skipped, the verdict would exit 1 at start. `A4` then gives no score, and the Orchestrator may not
  restart.
- The probable form is
  `caffeinate -i env LADDER_DEEP=verdict NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts --reporter=verbose`.
  `A0`'s vitest arm ran under that flag (496 MiB) and read route V. **Whether 180 verdict games fit in 496 MiB is
  `UNKNOWN - verify`.** An out-of-memory error goes to the owner (`ABC-173` Q4). No row is raised.
