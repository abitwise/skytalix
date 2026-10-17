---
id: 20261017T103636Z-qe-e2e-observation-abc056-readings-ed286904
kind: observation
by: qe-e2e
at: 2026-10-17T10:36:36Z
verified_by:
confidence: high
refs:
  - ABC-056
  - AR-1
  - 20261017T102600Z-release-manager-decision-ar1-restated-718112dd
  - 20261017T102307Z-ba-pm-decision-abc056-a3-check5-ruled-3f3e4def
  - package.json
  - package-lock.json
supersedes:
---

# QE `ABC-056`: QE's own readings for `A1`–`A5`, compared with the Release Manager's after the runs

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). I ran every command myself in
worktree `wt-ABC-056` at tip `e567787c` (base `e7d9d657`) on 2026-10-17 between 10:28Z and 10:36Z. I read the RM's
values (`…718112dd`) only after my runs. `node_modules` is a symlink to the main checkout's tree. Nothing was installed
or fixed, and `npm audit fix` was not run. Manifest md5s were the same before and after every step: `package.json`
`076a03d7955198d9219e997a9d929291`, `package-lock.json` `ed7a5b0c455a3cc59fd76a686192c7b8`. Host: node v26.11.1,
npm 11.20.0, grep is ugrep 7.8.4.

| item | QE reading (2026-10-17) | RM reading (10:25Z–10:26Z) | agree |
|---|---|---|---|
| `npm audit` (10:29:01Z) | exit 1, `3 vulnerabilities (1 moderate, 2 high)`; metadata prod 1, dev 122, optional 60 | the same | yes |
| set (package, version, severity, id, range) | `nanoid` 3.3.16 high GHSA-2v37-7h3g-55p8 `<3.3.18`; `postcss` 8.5.22 moderate GHSA-fxqj-rqcc-2cmp `<=8.5.22`; `source-map-js` 1.2.1 high GHSA-68fv-2mgg-jv7q `1.0.0 - 1.2.1` | the same | yes |
| paths (`npm ls`, main checkout, same md5s) | `vite@7.3.6` → `postcss` → `nanoid`; `vite` → `postcss`; `@vitest/coverage-v8@4.1.11` → `magicast@0.5.5` → `source-map-js`, and `postcss` → `source-map-js` (deduped) | the same | yes |
| lockfile `dev` flag | all three `dev: true`; **0 of 122** lockfile packages lack `dev: true` | the three `dev: true` | yes (QE adds the 0/122 count) |
| check 1 `npm audit --omit=dev` | `found 0 vulnerabilities`, exit 0 | the same | yes |
| check 2 `jq 'has("dependencies")' package.json` | `false`. Keys: `description devDependencies engines name private scripts type version` | `false` | yes |
| check 3 `jq '.private'` | `true`; `bin`, `main`, `exports`, `files` all `null` | the same | yes |
| check 4 `npm run -s build` | exit 0. `git status --porcelain --ignored` `cmp` 0 before/after; no file outside `node_modules`/`.git` newer than a marker; no `dist/`; `tsconfig.json:14` `"noEmit": true` | the same | yes |
| files / specifiers | 40 / 148 (old regex: 148 too) | 40 / 148 | yes |
| 5a | empty (exit 1) | empty | yes |
| 5b | empty (exit 1) | empty | yes |
| 5c | `node:fs` (one specifier, `src/book-file.ts:13`) | `node:fs` | yes |
| old 2026-10-12 command | `from "node:fs"` | the same (the reason for the amendment) | yes |
| `A5` | `git diff --numstat e7d9d657...e567787c -- package.json package-lock.json` empty; `-- src/` empty; `main...HEAD` form empty (merge base `e7d9d657`) | empty / empty | yes |

**Independent runtime reading (not grep).** A scratch `module.registerHooks` resolve hook (outside the repo) logged
every URL that `node src/cli.ts` resolves. That covers a refused command line (exit 1) and a full start with stdin at
EOF (`npm run -s chess -- --colour white --ascii </dev/null`, exit 0, `> input ended`). It resolved **35 URLs: 34
`src/*.ts` files plus `node:fs`, and 0 under `node_modules`.** The six production files that are not on the path are
`evaluate.mirror-corpus.ts`, `perft-bench.ts`, `perft.ts`, `puzzle-corpus.ts`, `search.mate-corpus.ts` and
`virtual-clock.ts`. This confirms check 5 by a method that does not rely on grep.

**Per criterion.**
- **`A1` MET.** The reason ("no package from the npm tree is loaded on the runtime path") covers all three on the
  `dev: true` flag plus check 5. It uses no per-package argument. The runtime hook shows 0 package loads.
- **`A2` MET.** For each advisory the record names package, severity, id and the run date (2026-10-17T10:25Z). My
  (package, id) pairs diff empty against the record's table.
- **`A3` MET.** All checks 1–5c re-run with the same readings. The record carries the 5c set `{node:fs}`.
- **`A4` MET.** The record names its trigger, and the trigger can be falsified. Both clauses read differently on
  plants (`…a1a81cb9`). Clause (1) does not depend on the lockfile. BA/PM's minimum clause, 5c ≠ `{node:fs}`, is there.
- **`A5` MET.** Both diffs are empty and the md5s are unchanged.
