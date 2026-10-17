---
id: 20261017T101842Z-release-manager-observation-abc056-a3-blocked-0d45639e
kind: observation
by: release-manager
at: 2026-10-17T10:18:42Z
verified_by:
confidence: high
refs:
  - ABC-056
  - AR-1
  - ABC-095
  - plans/tickets/ABC-056-ar-1-accepted-risk-has-drifted.md
  - src/book-file.ts
  - package.json
  - package-lock.json
supersedes:
---

# Release Manager `ABC-056`: measured 2026-10-17. STOPPED at `A3` check 5

Hand-authored and unsealed. **This is not the `AR-1` re-statement.** The `decision` note with
`refs: [AR-1, ABC-056]` was **not written**. The brief says: if a criterion cannot be met as written, STOP.

Worktree `wt-ABC-056`, branch `grugops/ABC-056-restate-ar-1` from `main` `e7d9d657`. `node_modules` is a
symlink to the main checkout's tree (git ignores it). Nothing was installed, fixed or written. The manifest
md5s were the same before and after: `package.json` `076a03d7955198d9219e997a9d929291`, `package-lock.json`
`ed7a5b0c455a3cc59fd76a686192c7b8`. The last commit to touch `package-lock.json` is `9313dda7` (2026-10-11).

## The blocker: `A3` check 5 is not empty

The command was run as the page writes it (2026-10-17):

```
grep -hoE "(from|import\() *['\"][^'\"]+['\"]" $(ls src/*.ts | grep -v '\.test\.ts$') | grep -vE "['\"]\./"
from "node:fs"
```

- That line comes from `src/book-file.ts:13`, `import { readFileSync } from "node:fs";`. It was added by
  `09740ea4` (`ABC-095`, 2026-10-12). The 2026-10-12 re-score measured on `main` `1eb2edbc`, where this line
  did not exist yet (`git show 1eb2edbc:src/book-file.ts` has no `node:fs`). Today there are 40 non-test
  `src/*.ts` files with 148 specifiers. The re-score counted 37 files and 140 specifiers.
- **The page's own words still hold. The command no longer shows it.** `node:fs` is a Node builtin, and no
  npm package is loaded. If builtins are excluded as well (`grep -vE "['\"](\./|node:)"`), the output is
  **empty**. No `require`, `createRequire` or non-literal `import(` appears in non-test `src/`.
- Making the command exclude `node:` changes the criterion. That is BA/PM's call, not the Release Manager's.

**Question for the owner or BA/PM:** should `A3` check 5 read `grep -vE "['\"](\./|node:)"` (no npm package
at runtime; builtins allowed, as since `ABC-095`)? Or is a builtin import on the runtime path itself a reason
to re-state `AR-1` differently?

## Everything else, measured 2026-10-17 (not copied)

`npm audit` (10:17:33Z, exit 1): **3 vulnerabilities (1 moderate, 2 high)**. All are transitive and
`dev: true` in the lockfile. Every one has a fix through a plain `npm audit fix`, which was **not run**.

| package | version | severity | advisory | path (`npm ls`, main checkout at `e7d9d657`) |
|---|---|---|---|---|
| `nanoid` | 3.3.16 | high | GHSA-2v37-7h3g-55p8 | `vite@7.3.6` → `postcss` |
| `postcss` | 8.5.22 | moderate | GHSA-fxqj-rqcc-2cmp | `vite@7.3.6` |
| `source-map-js` | 1.2.1 | high | GHSA-68fv-2mgg-jv7q | `@vitest/coverage-v8@4.1.11` → `magicast@0.5.5`; `postcss` |

This is the same (package, advisory id) set as the 2026-10-12 re-score. Audit metadata: prod 1, dev 122.

| `A3` check | command | output |
|---|---|---|
| 1 | `npm audit --omit=dev` | `found 0 vulnerabilities`, exit 0 |
| 2 | `jq 'has("dependencies")' package.json` | `false` |
| 3 | `jq '.private' package.json` | `true` (also `bin`/`main`/`exports`/`files` are all absent) |
| 4 | `npm run -s build` (`tsc --noEmit`) | exit 0. No file is newer than a marker, `git status --porcelain --ignored` is the same before and after, there is no `dist/`, and `tsconfig.json:14` has `"noEmit": true` |
| 5 | the import grep above | **`from "node:fs"` (expected empty). NOT MET as written** |

- **`A5`:** `git diff --numstat e7d9d657 -- package.json package-lock.json src/` is empty. The branch adds this
  note only.
- **`A4` trigger, if the record goes ahead.** `AR-1` must be re-read when any `npm audit` run at a
  Security/NFR hop (or at any later hop that runs one) returns a (package, advisory id) set different from the
  one in the record. It must also be re-read if any of the structural checks 1–5 changes its reading. The
  first part fires on a new advisory even when the lockfile has not changed. `npm audit` reads advisories
  from the registry at run time, which is how the set drifted twice while the lockfile stayed the same. This
  is a draft. It is not recorded.
