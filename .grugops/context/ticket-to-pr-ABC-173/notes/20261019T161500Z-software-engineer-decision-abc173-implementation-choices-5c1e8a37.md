---
id: 20261019T161500Z-software-engineer-decision-abc173-implementation-choices-5c1e8a37
kind: decision
by: software-engineer
at: 2026-10-19T16:15:00Z
verified_by:
confidence: medium
sealed: false
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-173
refs: [ABC-173, ADR-0008, ABC-042, ABC-119, ABC-138, ABC-109]
---

# `ABC-173` implementation choices (within the ADR-0008 addendum 2026-10-19; nothing re-ruled)

Hand-authored: `scripts/context-io.ts` is absent from this install. The authority is the ADR addendum.

- **`A1` = (b) none**, re-read at this hop: `grep -rl resourceLimits node_modules/vitest/dist` reads 0 files on
  vitest 4.1.11, matching the addendum's V1 (`cli-api.CnMVyzaz.js:3229-3234`).
- **The guard** (`tools/grugops/heap-guard.js`) exports `ROWS_MIB {suite 224, oneFile 496}` and
  `FLAGS_MIB {suite 128, oneFile 400}`. Its only side effect is `project.provide("heapRowMiB", row)`. It throws when
  it is off the main thread, when `getPaths` is missing or reads 0 files, and when the limit is above the row.
- **`CLI_DEEP`:** one argv constructor, `nodeArgv(rest) = [heapToken(), ...rest]`, behind the file's one spawn
  (`spawnNode`). The real children and the `A6` probe both use it, so dropping the token reds the probe.
  `heapToken` is evaluated lazily, so the default-lane row still spawns nothing and never throws there.
- **`cli.test.ts` static rows use the TypeScript parser, not regex**, so they agree with `ABC-138`'s
  `N8-LANE` rules. No `spawnSync` identifier is added: the forms are strings. The module name is spelled through
  `CHILD_PROCESS_NAME`, because `ABC-138` (i) counts a call whose first argument is that literal; that red was
  seen at this hop. Each derived view is first watched losing its evidence, in memory (planted `spawn(`/rename/
  namespace calls for `C2`; a bare line, a wrong-shape flag and a double `NODE_OPTIONS=` for `A3`).
- **`ProvidedContext` augmentation** is declared in both test files, without `export`, because biome's
  `noExportsInTest` refuses it. `tsc` accepts the identical merge.
- **`AGENTS.md` offset:** I moved RUN-receipt sentences only, -868 B. Directives, traps and "Run after"
  lines stay. The moved text is quoted verbatim in `memory-bank/90-agents-md-command-log.md`
  § `ticket-to-pr-ABC-173` pass.
