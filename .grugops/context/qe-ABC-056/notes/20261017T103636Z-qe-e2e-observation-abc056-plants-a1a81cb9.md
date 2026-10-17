---
id: 20261017T103636Z-qe-e2e-observation-abc056-plants-a1a81cb9
kind: observation
by: qe-e2e
at: 2026-10-17T10:36:36Z
verified_by:
confidence: high
refs:
  - ABC-056
  - AR-1
  - ADR-0036
  - 20261017T102600Z-release-manager-decision-ar1-restated-718112dd
  - QE-056-a
  - QE-056-b
supersedes:
---

# QE `ABC-056`: `A4` trigger plants. Every required plant changes a reading. Six blind-spot probes do not

Hand-authored and unsealed. Every plant ran in a scratch copy outside the repository: `git archive e567787c` with
`node_modules` symlinked. Code plants are inserted after `src/cli.ts:81`, the last import, with the anchor checked
first. For each copy I read checks 2, 3, 5a, 5b and 5c, plus check 1 for manifest plants. I also logged **what actually
loads**: the same resolve hook as `…ed286904`, under `npm run -s chess -- --colour white --ascii </dev/null`, counting
URLs under `node_modules` from the `cli.ts` process only. The last column is the repo's own ADR-0036 clause (b)
instrument, `.grugops/context/design-F-072-1/probe/clause-b.mjs base <plant> 1|2|3`. I ran it in a scratch git repo
holding the same tree (base commit, then one commit per plant). Every exit was 0 unless marked.

## Required plants (the brief's four, with variants)

| plant | planted line(s) | 5a | 5b | 5c | package loaded at runtime | ADR-0036 (b) |
|---|---|---|---|---|---|---|
| baseline | none | empty | empty | `node:fs` | 0 | (n/a) |
| P1 package import | `import { nanoid } from "nanoid";` | **prints `from "nanoid"`** | empty | `node:fs` | `nanoid` | limb 1 FIRES |
| P2 side-effect import | `import "nanoid";` | **prints `import "nanoid"`** | empty | `node:fs` | `nanoid` | limb 1 FIRES |
| P3 `createRequire` (no new import) | `const { createRequire } = process.getBuiltinModule("node:module"); createRequire(import.meta.url)("nanoid");` | empty | **prints `src/cli.ts:82`, `:83`** | `node:fs` | `nanoid` | limb 2 FIRES |
| P3b `createRequire` (imported) | `import { createRequire as qeCR } from "node:module"; qeCR(import.meta.url)("nanoid");` | empty | **prints `src/cli.ts:82`** | **`node:fs node:module`** | `nanoid` | limb 1 FIRES |
| P4 new built-in | `import { spawnSync } from "node:child_process";` | empty | empty | **`node:child_process node:fs`** | 0 | limb 1 FIRES |
| P4b built-in, no prefix | `import { spawnSync } from "child_process";` | **prints `from "child_process"`** (fails closed) | empty | `node:fs` | 0 | limb 1 FIRES |

**Clause (2) can be falsified, and each required form trips a different check.** A package import trips 5a. A
side-effect import trips 5a. `createRequire` trips 5b. A new built-in trips 5c alone.

**Clause (1) (advisory drift).** Today's `npm audit --json` (package, id) pairs diff **empty** against the record's
table, so the clause is quiet. Plant C1: a scratch copy of the lockfile with only `packages["node_modules/nanoid"].version`
set to `3.3.18`, then `npm audit --json`. The pair diff **drops `nanoid GHSA-2v37-7h3g-55p8`** (exit 1), so the clause
fires. A plant cannot show a newly published advisory, which is a registry event. The lockfile history supports the
record's "fires with the lockfile unchanged" claim: `git log -- package-lock.json` has no commit between `226c2e3c`
(2026-07-22) and `9313dda7` (2026-10-11).

## Blind-spot probes (beyond the brief; gaps `QE-056-a`, `QE-056-b`)

| probe | planted | checks 1–5c | package loaded at runtime | ADR-0036 (b) |
|---|---|---|---|---|
| G1 subdirectory | `import "./qe-sub/x.ts";` and `src/qe-sub/x.ts` = `import "nanoid";` | **all unchanged** | **`nanoid`** | limb 1 FIRES |
| G2 relative path into the tree | `import "./../node_modules/nanoid/index.js";` | **all unchanged** (5a drops every `./` specifier) | **`nanoid`** | FIRES (disputed, fail-safe), all 3 limbs |
| G3 spaced dynamic import | `const qeName = "nanoid"; await import (qeName);` | **all unchanged** (5b reads `import\(` with no space) | **`nanoid`** | FIRES (disputed, fail-safe), all 3 limbs |
| G4 `getBuiltinModule` | `process.getBuiltinModule("node:child_process").spawnSync(process.execPath, ["node_modules/nanoid/bin/nanoid.cjs"])` | **all unchanged** (5c sees only specifiers) | in a child: the child printed a nanoid id (`FIJoYixZzNGnVdvnlKPsC`) | limb 2 FIRES |
| G5 loader flag | `scripts.chess` = `node --import nanoid src/cli.ts` | **all unchanged**, check 1 `found 0` | **`nanoid`** | (n/a: not `src/`; `ABC-041` clause (a) fires on any `package.json` touch) |
| G6b non-dev dependency | `optionalDependencies: {"picocolors": "^1.1.1"}` | **all unchanged**: check 1 `found 0`, check 2 `false` | 0 | (n/a; clause (a) fires) |
| G6 (control) | `optionalDependencies: {"nanoid": "3.3.16"}` | check 1 **prints 1 high** | 0 | (n/a; clause (a) fires) |

**Reading.** `A4` asks that a reader can tell whether the trigger has fired, and the required plants show that.
`A4` does not ask that the trigger catch every form. G1–G3 and G5 put a vulnerable dev package on the runtime path,
which voids `AR-1`'s premise, while every recorded check reads the same as the record. They are gaps, and no
criterion fails on them. Each one is caught by another route the project already runs: ADR-0036 (b) for G1–G4, and
`ABC-041` clause (a) for G5/G6b. Both routes send the diff to Security/NFR, which does not mean `AR-1` is re-read.
Afterwards I deleted every scratch tree under the session scratchpad. The repository and the worktree hold no plant.
