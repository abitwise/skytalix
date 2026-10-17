---
id: 20261017T103636Z-qe-e2e-decision-abc056-verdict-5541ffaa
kind: decision
by: qe-e2e
at: 2026-10-17T10:36:36Z
verified_by:
confidence: high
refs:
  - ABC-056
  - AR-1
  - ADR-0036
  - QE-056-a
  - QE-056-b
  - QE-056-c
  - QE-056-d
  - 20261017T102600Z-release-manager-decision-ar1-restated-718112dd
  - 20261017T102307Z-ba-pm-decision-abc056-a3-check5-ruled-3f3e4def
  - 20261017T103636Z-qe-e2e-observation-abc056-readings-ed286904
  - 20261017T103636Z-qe-e2e-observation-abc056-plants-a1a81cb9
  - 20261017T103636Z-qe-e2e-observation-abc056-gap-register-8f36c18b
  - 20261017T103636Z-qe-e2e-artifact-ref-abc056-commands-e2f0ead7
supersedes:
---

# QE `ABC-056`: PASS_WITH_GAPS. `A1`–`A5` MET on QE's own readings; two LOW and two INFO gaps, none blocking

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install).

| item | value |
|---|---|
| subtask | `qe-ABC-056` |
| reviewed | `grugops/ABC-056-restate-ar-1`, tip `e567787c`, base `e7d9d657` (worktree `wt-ABC-056`) |
| agreement | every RM reading in `…718112dd` matches QE's own. I compared them only after my runs (`…ed286904`) |

## Per criterion

- **`A1` MET.** One reason covers all three advisories, `nanoid`, `postcss` and `source-map-js`: each is
  `dev: true`, and the runtime path loads no package. The lockfile has 0 of 122 packages without `dev: true`. A
  resolve hook on `node src/cli.ts` saw 34 `src/*.ts` files, `node:fs`, and 0 `node_modules` URLs.
- **`A2` MET.** Package, severity, id and date are recorded. QE's `npm audit` (10:29Z) pairs diff empty against the
  record.
- **`A3` MET.** Check 1 is `found 0`. Check 2 is `false`. Check 3 is `true` with no `bin`/`main`/`exports`/`files`.
  Check 4 writes nothing. 5a and 5b are empty, and 5c is `node:fs`, over 40 files and 148 specifiers.
- **`A4` MET.** Both clauses can be falsified (`…a1a81cb9`):
  - A package import and a side-effect import trip 5a.
  - `createRequire` trips 5b.
  - A new built-in trips 5c alone.
  - A lockfile plant trips clause (1).
  - BA/PM's minimum clause is present.
- **`A5` MET.** The manifest and `src/` diffs are empty, and the md5s are unchanged.
- **Gates (tip `e567787c`):**
  - lint exit 0 (113 files); typecheck exit 0; build exit 0.
  - `npm test` exit 0, 58 files, 1792/1792 passed.
  - `last-run.json` is fresh: `success: true`, `exitCode` 0, 0 pending, 0 todo.
  - `test-skip-integrity --skip-count 0`: `No findings.`

## Why PASS_WITH_GAPS

The trigger can be falsified, but it is not complete. Six probe forms put code on the runtime path while every
recorded check still matches the record: a subdirectory file, a `./../node_modules` path, a spaced `import (x)`,
`process.getBuiltinModule`, a `--import` loader flag in `scripts.chess`, and a non-dev `optionalDependencies` entry
(`QE-056-a`, `QE-056-b`, both LOW). Each one is caught by a route the project already runs, ADR-0036 (b) or
`ABC-041` clause (a), but that route reaches Security/NFR without re-reading `AR-1`. No criterion asks for more.
`QE-056-c` and `QE-056-d` are INFO.

## UAT waiver (measured)

`git diff --name-only e7d9d657...e567787c | grep -v '\.test\.ts$' | grep '^src/'` is **empty** (grep exit 1). The
`AGENTS.md` form `<c>~1 <c>` is empty for each of the three commits. The range touches 5 paths, none under `src/`.
**The zero-production-lines waiver applies by its rule.** Applying it is the Orchestrator's job, and a waiver is not a
signature.

## Exit

- **Recommended:** move `In Review` onward with UAT waived by measurement. The board move and the merge are the
  Orchestrator's.
- **Optional follow-up:** `QE-056-a` and `QE-056-b` go to the Release Manager or BA/PM, to widen check 5 and pin the
  two legs, or to accept them with the existing routes named.
- QE touched no `src/`, manifest or `plans/board.md`. Every plant was in scratch outside the repository. Nothing was
  installed, fixed, merged or pushed.
