---
id: 20261017T102600Z-release-manager-decision-ar1-restated-718112dd
kind: decision
by: release-manager
at: 2026-10-17T10:26:00Z
verified_by:
confidence: high
refs:
  - AR-1
  - ABC-056
supersedes:
---

# Release Manager: `AR-1` re-stated (2026-10-17), with its advisory set, checks 1–5c and trigger

I wrote this note by hand and it is unsealed, because the sanctioned writer is absent on this install (`AGENTS.md`).
It is the `AR-1` re-statement that `ABC-056` asks for. **`supersedes` is empty on purpose.** `AR-1`'s 2026-07-29 note
(`.grugops/context/architecture-audit-2026-07-29/notes/20260729T145735Z-security-nfr-observation-abedec95.md`) also
carries `AR-2` onward. Superseding it would fold those out on replay. A reader who wants `AR-1` now reads this note,
and the 2026-07-29 text is history. Context: my stop note `…0d45639e`, BA/PM's ruling `…3f3e4def`, and the ticket
page § "Amendment — 2026-10-17".

Measured in worktree `wt-ABC-056`, branch `grugops/ABC-056-restate-ar-1` at `6d24c5d1`, on 2026-10-17 between
10:25Z and 10:26Z. `node_modules` is a symlink to the main checkout's tree. I ran every command myself and copied
nothing from earlier notes. Nothing was installed or fixed, and `npm audit fix` was **not** run. Manifest md5s were the
same before and after: `package.json` `076a03d7955198d9219e997a9d929291`, `package-lock.json`
`ed7a5b0c455a3cc59fd76a686192c7b8`. The last commit to touch the lockfile is `9313dda7` (2026-10-11).

## The re-stated override

**`AR-1` (low, contextual; severity overridden from `high`).** Every advisory `npm audit` reports in this repository's
tree is accepted on one reason that does not depend on the package:

> **No package from the npm tree is loaded on the runtime path.** `npm audit --omit=dev` finds 0 and `package.json`
> has no `dependencies` key, so every audited package is a dev dependency. The runtime path is `npm run chess` =
> `node src/cli.ts` with no loader flag. Its non-test `src/*.ts` files import only relative modules and the Node
> built-ins in the recorded set (check 5). The package is `"private": true`, declares no `bin`/`main`/`exports`/`files`,
> and `build` emits nothing. Dev packages run only when a developer invokes the toolchain (`vitest`, `vite`,
> coverage, `biome`, `tsc`) on files that the repository itself owns.

The reason does **not** say "ships nothing". Under `ADR-0018`, `npm install` puts the dev tree on a user's disk. What
holds is that nothing on the runtime path loads it.

**`A1`, applied to the set below:** `nanoid`, `postcss` and `source-map-js` are all `dev: true` in the lockfile. All
three are reached only through `vite` / `@vitest/coverage-v8`, which the runtime path never loads. The reason covers
all three, and each check needs only the `dev` flag plus check 5. No package-specific argument is used (no
"glob patterns", no "`sourceMappingURL`").

**Outside `AR-1`:** an advisory against Node itself, including any built-in in the 5c set. That is a Node-version
question. `AR-1` also does not cover any runtime `dependencies` entry, which would void the premise (see the trigger).

Not decided here: the plain `npm audit fix` that npm offers for all three advisories. The owner chose to re-state the
risk (2026-10-12). Applying the fix would need its own gated ticket, and `A5` forbids it in this one.

## `A2`: the recorded set (`npm audit`, 2026-10-17T10:25Z, exit 1)

`3 vulnerabilities (1 moderate, 2 high)`. Audit metadata: prod 1 (the root), dev 122, optional 60.

| package | installed | severity | advisory id | vulnerable range | lockfile | reaches the tree via |
|---|---|---|---|---|---|---|
| `nanoid` | 3.3.16 | high | GHSA-2v37-7h3g-55p8 | `<3.3.18` | `dev: true` | `vite` → `postcss` |
| `postcss` | 8.5.22 | moderate | GHSA-fxqj-rqcc-2cmp | `<=8.5.22` | `dev: true` | `vite` |
| `source-map-js` | 1.2.1 | high | GHSA-68fv-2mgg-jv7q | `1.0.0 - 1.2.1` | `dev: true` | `postcss`; `@vitest/coverage-v8` → `magicast` |

Command: `npm audit` (the human report). The id and range columns come from
`npm audit --json | jq -r '.vulnerabilities[] | [.name, .severity, (.via[]|select(type=="object")|.url), .range] | @tsv'`.
The `via` paths come from my 2026-10-17 stop note (`npm ls`). **To compare:** a later reader re-runs that `jq` line and
diffs the (package, advisory id) pairs against this table.

## `A3`: the structural checks, as re-run on 2026-10-17

The check 5 commands are the ones in BA/PM's 2026-10-17 amendment. They run over
`$(ls src/*.ts | grep -v '\.test\.ts$')`: 40 files and 148 specifiers. `grep` is ugrep 7.8.4.

| # | command | output today | required |
|---|---|---|---|
| 1 | `npm audit --omit=dev` | `found 0 vulnerabilities`, exit 0 | 0 |
| 2 | `jq 'has("dependencies")' package.json` | `false` | `false` |
| 3 | `jq '.private' package.json` | `true`; `bin`, `main`, `exports`, `files` all absent | `true` |
| 4 | `npm run -s build` (`tsc --noEmit`) | exit 0. `git status --porcelain --ignored` is byte-identical before and after. No file outside `node_modules`/`.git` is newer than a pre-build marker. No `dist/`. `tsconfig.json:14` `"noEmit": true` | emits nothing |
| 5a | ``grep -hoE "(from\|import *\(?) *['\"][^'\"]+['\"]" $(ls src/*.ts \| grep -v '\.test\.ts$') \| grep -vE "['\"](\./\|node:)"`` | empty (exit 1) | empty |
| 5b | ``grep -nE "\brequire *\(\|createRequire\|import\( *[^'\" ]" $(ls src/*.ts \| grep -v '\.test\.ts$')`` | empty (exit 1) | empty |
| 5c | ``grep -hoE "(from\|import *\(?) *['\"]node:[^'\"]+['\"]" $(ls src/*.ts \| grep -v '\.test\.ts$') \| grep -oE "node:[^'\"]+" \| sort -u`` | **`node:fs`** (one specifier, `src/book-file.ts:13`) | the recorded set |

(Inside the table, `\|` stands for `|`.) For reference, the 2026-10-12 command run as written prints `from "node:fs"`,
which is the reason for the amendment.

**Recorded built-in set: `{node:fs}`.**

## `A4`: the trigger

**`AR-1` must be re-read, and this record re-stated, when any of the following is true. Whoever observes it records
the observation:**

1. **Advisory drift.** Some `npm audit` run returns a (package, advisory id) set different from the `A2` table. That
   covers an added pair, a removed pair, and an empty set. The run might be at a Security/NFR hop, a Release Manager
   hop, or any other hop. A Security/NFR hop runs it routinely. This clause fires **with the lockfile unchanged**,
   because `npm audit` reads advisories from the registry when it runs. That is how the set drifted twice between
   2026-07-22 and 2026-10-11 with no lockfile commit.
2. **Premise drift.** Any check 1–5c reads differently from the `A3` table. Examples: check 1 non-zero, check 2 `true`,
   check 3 not `true` or a `bin`/`main`/`exports`/`files` key present, check 4 writing a file, 5a or 5b non-empty, or
   a 5c set other than `{node:fs}`.

Check 2 turning `true`, a `bin`, or anything published also hits the ticket's `P1` promotion trigger. Under those
conditions `AR-1`'s premise no longer holds, and re-stating it is not enough. A reader can tell whether the trigger
has fired by re-running the commands above and diffing the output against the two tables.

## `A5`

`git diff --numstat main...HEAD -- package.json package-lock.json` and `git diff --numstat main...HEAD -- src/` are
both empty at the commit that adds this note. Their outputs are recorded in the page's Delivery section.
