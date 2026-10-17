---
id: 20261017T180500Z-release-manager-decision-ar1-restated-901f43b6
kind: decision
by: release-manager
at: 2026-10-17T18:05:00Z
verified_by:
confidence: high
refs:
  - AR-1
  - ABC-158
  - ABC-056
  - ADR-0036
  - QE-056-a
  - QE-056-b
  - 20261017T103636Z-qe-e2e-observation-abc056-plants-a1a81cb9
supersedes: 20261017T102600Z-release-manager-decision-ar1-restated-718112dd
---

# Release Manager: `AR-1` re-stated (2026-10-17, `ABC-158`). Check 5 widened, checks 6 and 7 added, trigger clause (2) names checks 1–7

I wrote this note by hand and it is unsealed, because the sanctioned writer is absent on this install (`AGENTS.md`).
It supersedes `…ar1-restated-718112dd` (the `ABC-056` re-statement) and only that note. The 2026-07-29 note that
also carries `AR-2` onward stays unsuperseded, for the reason `…718112dd` gives. A reader who wants `AR-1` now reads
this note. It closes `QE-056-a` (check 5 blind to G1–G4) and `QE-056-b` (G5 and G6b pinned by no check), both from
QE's plant note `…a1a81cb9`.

Measured in worktree `wt-ABC-158`, branch `grugops/ABC-158-ar1-checks-widened`, at `aa37f9cb`, on 2026-10-17 between
18:00Z and 18:05Z. `node_modules` is a symlink to the main checkout's tree. I ran every command myself. Nothing was
installed or fixed, and `npm audit fix` was **not** run. Manifest md5s: `package.json`
`076a03d7955198d9219e997a9d929291`, `package-lock.json` `ed7a5b0c455a3cc59fd76a686192c7b8`, the same values
`…718112dd` recorded. `grep` is BSD grep 2.6.0-FreeBSD (`command grep`, not this shell's ugrep wrapper).

## The re-stated override (carried over unchanged)

**`AR-1` (low, contextual; severity overridden from `high`).** Every advisory `npm audit` reports in this repository's
tree is accepted on one reason that does not depend on the package:

> **No package from the npm tree is loaded on the runtime path.** `npm audit --omit=dev` finds 0 and `package.json`
> has no `dependencies` key, so every audited package is a dev dependency. The runtime path is `npm run chess` =
> `node src/cli.ts` with no loader flag. Its non-test `src/*.ts` files import only relative modules and the Node
> built-ins in the recorded set (check 5). The package is `"private": true`, declares no `bin`/`main`/`exports`/`files`,
> and `build` emits nothing. Dev packages run only when a developer invokes the toolchain (`vitest`, `vite`,
> coverage, `biome`, `tsc`) on files that the repository itself owns.

What changed is which legs of that reason a check pins. "No loader flag" is now check 6. "Every audited package is a
dev dependency" is now check 7, as well as checks 1 and 2. "Non-test `src/*.ts` files" is read as `ADR-0036`'s
production set (check 5's file set below). The prose is kept word for word so that a diff against `…718112dd` shows
no change in the reason.

The scope paragraphs of `…718112dd` (not "ships nothing"; an advisory against Node itself is outside `AR-1`; a runtime
`dependencies` entry voids the premise; `npm audit fix` is not decided here) carry over unchanged.

## The recorded advisory set (carried over; re-read, unchanged)

`npm audit`, 2026-10-17T18:04Z, exit 1: `3 vulnerabilities (1 moderate, 2 high)`. Metadata: prod 1, dev 122,
optional 60.

| package | installed | severity | advisory id | vulnerable range | lockfile | reaches the tree via |
|---|---|---|---|---|---|---|
| `nanoid` | 3.3.16 | high | GHSA-2v37-7h3g-55p8 | `<3.3.18` | `dev: true` | `vite` → `postcss` |
| `postcss` | 8.5.22 | moderate | GHSA-fxqj-rqcc-2cmp | `<=8.5.22` | `dev: true` | `vite` |
| `source-map-js` | 1.2.1 | high | GHSA-68fv-2mgg-jv7q | `1.0.0 - 1.2.1` | `dev: true` | `postcss`; `@vitest/coverage-v8` → `magicast` |

The (package, advisory id) pairs from
`npm audit --json | jq -r '.vulnerabilities[] | [.name, .severity, (.via[]|select(type=="object")|.url), .range] | @tsv'`
diff empty against this table. The `via` column is carried from `…718112dd` and was not re-run.

## `A1`: checks 1–7 at the tip

Check 5's file set is `ADR-0036`'s production set: every `.ts .mts .cts .js .mjs .cjs` file under `src/`,
recursively, excluding tests (`.test.<ext>`) and declaration files (`.d.ts .d.mts .d.cts`). Set it once:

```sh
F=$(find src -type f \( -name '*.ts' -o -name '*.mts' -o -name '*.cts' -o -name '*.js' -o -name '*.mjs' -o -name '*.cjs' \) ! -name '*.test.*' ! -name '*.d.ts' ! -name '*.d.mts' ! -name '*.d.cts' | sort)
```

Today it holds 40 files, the same 40 as the old `ls src/*.ts | grep -v '\.test\.ts$'`. The count is context and is
not a check, because a new production file is normal and `ADR-0036` already routes it.

| # | command | output at `aa37f9cb` | required |
|---|---|---|---|
| 1 | `npm audit --omit=dev` | `found 0 vulnerabilities`, exit 0 | 0 |
| 2 | `jq 'has("dependencies")' package.json` | `false` | `false` |
| 3 | `jq -c '[.private, has("bin"), has("main"), has("exports"), has("files")]' package.json` | `[true,false,false,false,false]` | that |
| 4 | `npm run -s build` (`tsc --noEmit`) | exit 0. `git status --porcelain --ignored` is byte-identical before and after. No file outside `node_modules`/`.git` is newer than a pre-build marker. No `dist/` | emits nothing |
| 5a | ``grep -hoE "(from\|import[[:space:]]*\(?)[[:space:]]*['\"][^'\"]+['\"]" $F \| grep -vE "['\"](\./\|node:)"`` | empty | empty |
| 5b | ``grep -nE "\brequire[[:space:]]*\(\|createRequire\|getBuiltinModule\|process\.(binding\|dlopen)\|\bimport[[:space:]]*\([[:space:]]*([^'\"[:space:]]\|$)" $F \| grep -vE "^[^:]+:[0-9]+:[[:space:]]*(\*\|//)"`` | empty | empty |
| 5c | ``grep -hoE "(from\|import[[:space:]]*\(?)[[:space:]]*['\"]node:[^'\"]+['\"]" $F \| grep -oE "node:[^'\"]+" \| sort -u`` | **`node:fs`** | the recorded set |
| 5d | ``grep -hoE "(from\|import[[:space:]]*\(?)[[:space:]]*['\"][^'\"]+['\"]" $F \| grep -E "['\"/]\.\.(/\|['\"])\|node_modules"`` | empty | empty |
| 6 | `jq -r '.scripts.chess' package.json` | **`node src/cli.ts`** | that, with no loader flag |
| 7 | `jq '[keys[] \| select(IN("dependencies","optionalDependencies","peerDependencies","bundleDependencies","bundledDependencies"))] \| length' package.json` and `jq '[.packages \| to_entries[] \| select(.key != "" and .value.dev != true)] \| length' package-lock.json` | **`0`** and **`0`** | `0` and `0` |

(Inside the table, `\|` stands for `|`.) **Recorded built-in set: `{node:fs}`.**

What each widening is for:
- **5a, 5c, 5d read the recursive set.** That closes G1, a subdirectory file.
- **`[[:space:]]*`** replaces ` *` in 5a, 5b and 5c, so a tab or a space before `(` cannot hide an import.
- **5b** adds `getBuiltinModule` and `process.binding`/`process.dlopen` (G4) and reads `import (` with a space (G3).
  It drops lines whose first non-blank characters are `*` or `//`. Without that filter it prints
  `src/book-file.ts:8`, a doc comment holding "at import (`N-LOAD`)". A planted code line does not start with `*`
  or `//`.
- **5d is new.** It prints any specifier holding a `..` segment or `node_modules`. 5a drops every `./` specifier, so
  G2's `./../node_modules/…` passes 5a and is caught here. The one `../` in the set today,
  `new URL("../data/opening-book/book.json", import.meta.url)` at `src/book-file.ts:16`, is not a specifier, so 5d
  does not print it.

## `A2` and `A3`: plants, one at a time, outside the repository

Method: for each plant, `git archive aa37f9cb | tar -x` into a fresh directory under the session scratchpad (outside
the repository), with `node_modules` symlinked. Each copy got exactly one plant. Code plants go after `src/cli.ts:81`,
the last import (`import { runTurnLoop } from "./turn-loop.ts";`); I checked that anchor in every copy before planting.
Manifest plants were made with `jq` on the copy's `package.json`. Checks 1–7 ran on the copy and the output was diffed
against the `A1` output. The copy was then deleted. QE's texts are from `…a1a81cb9`. P3 and P3b are two lines each, as
QE's `:82`/`:83` readings imply.

| plant | text | check(s) that moved | new reading |
|---|---|---|---|
| G1 | `import "./qe-sub/x.ts";`, plus `src/qe-sub/x.ts` = `import "nanoid";` | **5a** | `import "nanoid"` |
| G2 | `import "./../node_modules/nanoid/index.js";` | **5d** | `import "./../node_modules/nanoid/index.js"` |
| G3 | `const qeName = "nanoid"; await import (qeName);` | **5b** | `src/cli.ts:82:…await import (qeName);` |
| G4 | `process.getBuiltinModule("node:child_process").spawnSync(process.execPath, ["node_modules/nanoid/bin/nanoid.cjs"])` | **5b** | `src/cli.ts:82:process.getBuiltinModule(…` |
| G5 | `scripts.chess` = `node --import nanoid src/cli.ts` | **6** | `node --import nanoid src/cli.ts` |
| G6b | `optionalDependencies: {"picocolors": "^1.1.1"}` | **7** | `1` (key count); lockfile count still `0` |
| P1 | `import { nanoid } from "nanoid";` | **5a** | `from "nanoid"` |
| P2 | `import "nanoid";` | **5a** | `import "nanoid"` |
| P3 | `const { createRequire } = process.getBuiltinModule("node:module");` / `createRequire(import.meta.url)("nanoid");` | **5b** | `src/cli.ts:82`, `src/cli.ts:83` |
| P3b | `import { createRequire as qeCR } from "node:module";` / `qeCR(import.meta.url)("nanoid");` | **5b, 5c** | `src/cli.ts:82`; `node:fs node:module` |
| P4 | `import { spawnSync } from "node:child_process";` | **5c** | `node:child_process node:fs` |
| P4b | `import { spawnSync } from "child_process";` | **5a** | `from "child_process"` |

**`A2`: 6 of 6** (G1–G4, G5, G6b). **`A3`: 6 of 6** (P1, P2, P3, P3b, P4, P4b). In every copy, checks 1, 2, 3 and 4
read as recorded; tsc exited 0 in all twelve. The first run of P3 and P3b failed to plant: my `awk -v` insertion
rejected the embedded newline, so the copy was unplanted and its readings were void, not a pass. I fixed the
insertion and re-ran both. The rows above come from the re-run, with the planted diff checked in each.

I did not re-measure that the G plants load `nanoid` at runtime. That is QE's reading in `…a1a81cb9`, cited, not
re-run. The scratchpad `plants/` directory is empty afterwards, and the worktree held no plant.

**Residual, not covered (stated, not fixed).** A loader flag can also reach `npm run chess` from outside
`package.json`, through `.npmrc` `node-options` or a user's `NODE_OPTIONS`. Check 6 reads only `scripts.chess`. The
repository holds no `.npmrc` today, and a user's environment is outside any repository check. This is the same class
as G5 and is left for the next re-statement to weigh.

## `A4`: the trigger

**`AR-1` must be re-read, and this record re-stated, when any of the following is true. Whoever observes it records
the observation:**

1. **Advisory drift (unchanged from `…718112dd`).** Some `npm audit` run returns a (package, advisory id) set
   different from the advisory table above. That covers an added pair, a removed pair, and an empty set. The run might
   be at a Security/NFR hop, a Release Manager hop, or any other hop. A Security/NFR hop runs it routinely. This clause
   fires **with the lockfile unchanged**, because `npm audit` reads advisories from the registry when it runs.
2. **Premise drift.** **Any of checks 1–7** reads differently from the `A1` table. Examples: check 1 non-zero, check
   2 `true`, check 3 other than `[true,false,false,false,false]`, check 4 writing a file, 5a, 5b or 5d non-empty, a 5c
   set other than `{node:fs}`, check 6 other than `node src/cli.ts`, or either check 7 count other than `0`.

Check 2 turning `true`, a `bin`, or anything published also hits `ABC-056`'s `P1` promotion trigger. Under those
conditions `AR-1`'s premise no longer holds, and re-stating it is not enough. A reader can tell whether the trigger
has fired by re-running the commands above and diffing the output against the two tables.

## `A5`

This ticket's diff touches only `.grugops/context/` and `plans/`. `git diff --numstat <base> -- src/ package.json
package-lock.json` is empty. The readings are on the ticket page's Delivery section and in the hop's done record.
