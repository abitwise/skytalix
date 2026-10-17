---
id: 20261017T181851Z-qe-e2e-observation-abc158-plants-c6b1b211
kind: observation
by: qe-e2e
at: 2026-10-17T18:18:51Z
verified_by:
confidence: high
refs:
  - ABC-158
  - AR-1
  - ADR-0036
  - ABC-041
  - 20261017T180500Z-release-manager-decision-ar1-restated-901f43b6
  - 20261017T103636Z-qe-e2e-observation-abc056-plants-a1a81cb9
  - QE-158-a
  - QE-158-b
  - QE-158-c
  - QE-158-d
supersedes:
---

# QE `ABC-158`: plants. 12 of 12 required plants move the check the record names. 8 more forms load `nanoid` and move no check

Hand-authored and unsealed. I planted my own texts, copied from `…a1a81cb9`, before reading any RM harness (none is
committed; the RM's done record names none). Method: for each plant, `git archive cdf4255b | tar -x` into a fresh
directory under the session scratchpad, outside the repository, with `node_modules` symlinked to the main checkout's.
Code plants go after `src/cli.ts:81`. I checked that line 81 reads `import { runTurnLoop } from "./turn-loop.ts";` in
every copy, inserted with `head -n 81` / `cat <text>` / `tail -n +82`, then confirmed the planted diff with
`/usr/bin/diff -r` against an unplanted copy. Manifest plants are `jq` edits of the copy's `package.json`. There was
**one plant per copy**. Checks 1–7 ran on the copy, and the output was diffed against the unplanted copy's output,
which equals the tip's (`…readings-169609b1`).

**Runtime instrument.** `module.registerHooks({ resolve })`. It appends every resolved URL containing
`/node_modules/`, under `NODE_OPTIONS="--import=<hook>" npm run -s chess -- --colour white --ascii </dev/null`. npm's
own loads (`/opt/homebrew/lib/node_modules/npm/…`) are filtered out. With no plant it reads 0 URLs.

## `A2` and `A3`: required plants (QE's texts)

| plant | check that moved (QE) | new line(s) | record says | checks 1–4 | runtime load |
|---|---|---|---|---|---|
| G1 subdir | **5a** | `import "nanoid"` (F 40→41, not a check) | 5a | as recorded | `nanoid` |
| G2 `./../node_modules` | **5d** | `import "./../node_modules/nanoid/index.js"` | 5d | as recorded | `nanoid` |
| G3 `import (x)` | **5b** | `src/cli.ts:82:const qeName = "nanoid"; await import (qeName);` | 5b | as recorded | `nanoid` |
| G4 `getBuiltinModule` | **5b** | `src/cli.ts:82:process.getBuiltinModule("node:child_process")…` | 5b | as recorded | `nanoid` (`bin/nanoid.cjs`, child) |
| G5 `--import` | **6** | `node --import nanoid src/cli.ts` | 6 | as recorded | `nanoid` |
| G6b `optionalDependencies` | **7** | key count `1`; lockfile count `0` | 7 | as recorded | not measured (0 by design) |
| P1 | **5a** | `from "nanoid"` | 5a | as recorded | not measured |
| P2 | **5a** | `import "nanoid"` | 5a | as recorded | `nanoid` |
| P3 (2 lines) | **5b** | `src/cli.ts:82`, `src/cli.ts:83` | 5b | as recorded | `nanoid` (`index.cjs`) |
| P3b (2 lines) | **5b, 5c** | `src/cli.ts:82:import { createRequire as qeCR }…`; `node:fs node:module` | 5b, 5c | as recorded | `nanoid` (`index.cjs`) |
| P4 | **5c** | `node:child_process node:fs` | 5c | as recorded | not measured (built-in) |
| P4b | **5a** | `from "child_process"` | 5a | as recorded | not measured (built-in) |

**`A2` 6 of 6, `A3` 6 of 6, and the moved check equals the record's in all 12.** tsc (check 4) exited 0 in all 12.

## Forms beyond the brief: the runtime path changes and no check moves

For the four `src/` forms that pass, plus N1 and N2, I also ran the repository's ADR-0036 clause (b) instrument
(`.grugops/context/design-F-072-1/probe/clause-b.mjs <base> <plant> 1|2|3`). It ran in a scratch git repo holding
the `cdf4255b` tree as the base commit, with one branch per plant.

| form | planted | checks 1–7 | runtime load | other route |
|---|---|---|---|---|
| **N1** test-like name | `import "./qe.test.util.ts";` + `src/qe.test.util.ts` = `import "nanoid";` | **all as recorded** (`! -name '*.test.*'` drops the file; ADR-0036 drops only `\.test\.[mc]?[jt]s$`) | `nanoid` | ADR-0036 limb 1 FIRES |
| **N2** symlink | `import "./qe-link.ts";` + symlink `src/qe-link.ts` → `../data/qe-target.ts` = `import "nanoid";` | **all as recorded** (`find -type f` skips the link; the target is outside `src/`) | `nanoid` | **ADR-0036: limbs 1, 2 and 3 do not fire.** `ABC-041` (a) is untouched. **No instrumented route found** |
| **N3** multi-line import | `import` / `  "nanoid";` (two lines) | **all as recorded** (5a/5c/5d are line-based) | `nanoid` | ADR-0036 limb 1 FIRES |
| N8 computed member, untyped | `process["getBuilt" + "inModule"]("node:module")["create" + "Require"]…` | **check 4 moved**: tsc exit 2 (`TS7053` at `src/cli.ts(82,13)`) | (not run) | caught |
| **N8b** computed member, typed | `const qeP = process as unknown as Record<…>;` / `qeP["getBuilt" + "inModule"]!("node:module")["create" + "Require"]!(import.meta.url)("nanoid");` | **all as recorded**; tsc 0 | `nanoid` (`index.cjs`) | ADR-0036 limb 2 FIRES |
| **N9** runtime `.d.ts` | `import "./qe.d.ts";` + `src/qe.d.ts` = `import "nanoid";` | **all as recorded** (declaration files are outside `F`; Node strips and runs the file) | `nanoid` | ADR-0036 FIRES (disputed, fail-safe), 3 limbs |
| **N10** `*`-led line | `const qeName = "nanoid";` / `const qeN = 1` / `  * Number(!!(await import (qeName)));` | **all as recorded** (5b's comment filter drops lines whose first non-blank is `*`) | `nanoid` | ADR-0036 FIRES (disputed, fail-safe), 3 limbs |
| **N5** `pre` script | `scripts.prechess` = `node --input-type=module -e "await import('nanoid')"` | **all as recorded** (check 6 reads `scripts.chess` only) | `nanoid`, in the pre-script process that `npm run chess` starts | `ABC-041` (a) (`package.json` touched) |
| **N6** `.npmrc` (RM's named residual) | `.npmrc` = `node-options=--import nanoid` | **all as recorded** | `nanoid`, in the `cli.ts` process (instrumented copy: `node-options=--import=<hook> --import nanoid`, because `.npmrc` replaces the env `NODE_OPTIONS`) | **none instrumented** (`ABC-041` (a) reads only the two manifests) |
| **N7** `node` bin shadow | `devDependencies.node = "^22.0.0"` (manifest only, no install) | **all as recorded**: check 7 counts only non-dev entries, and an installed `node` is `dev: true` | simulated install: a `node_modules/.bin/node` shim in the copy runs instead of the system `node` (it printed `QE-N7: interpreter is node_modules/.bin/node`); with `--import nanoid` it loads `nanoid` | `ABC-041` (a) |

`NODE_OPTIONS` in the user's environment (the RM's other named residual) is the instrument's own mechanism above. It
puts code into the `cli.ts` process and is read by no repository check.

**Reading.** Every criterion is met, and each of the RM's widenings does the job it claims. The check set is still
lexical and line-based over `find -type f`, and 8 forms put an npm-tree package on the runtime path while checks 1–7
read as recorded. Six of them are caught by another route the project runs. Two are not: N2, a `src/` symlink (it
also gets past ADR-0036's own instrument), and N6, `.npmrc`, which the RM already named. Afterwards I deleted every
scratch tree. `git status --porcelain` in the worktree and the main checkout shows no plant.
