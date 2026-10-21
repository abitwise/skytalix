---
id: 20261021T140436Z-security-nfr-observation-5dbc8cae
kind: observation
by: security-nfr
at: 2026-10-21T14:04:36Z
verified_by: 
confidence: high (each command run by Security/NFR on 2026-10-21; outputs read)
refs:
  - ABC-172
  - EPIC-007
  - grugops/ABC-172
  - grugops/qe-ABC-172
  - 8af64abc
  - a0dc4135
  - 0bddbb43
  - 3e617b26
  - ABC-041
  - QE-172-a
  - AR-1
  - ABC-056
  - ABC-168
  - 20261021T135939Z-qe-e2e-observation-c9c6ba15
  - 20261017T180500Z-release-manager-decision-ar1-restated-901f43b6
  - GHSA-698v-4r3x-3vcv
  - GHSA-r825-w8mm-5pxw
  - GHSA-587h-7wmj-h5pm
  - ADR-0044
supersedes: 
seal: sha256:e0848b46d3722e59dbb02bb464be5bb6b2eaa23759de1feae4f834cd11750c5c
---

# ABC-172 Security/NFR readings: the diff is two `name` lines, `npm ci` exits 0 on the delivered lock, and AR-1's trigger clause (1) has fired because `vite` was added to the advisory set (with the lock unchanged)

All readings were taken on 2026-10-21 by Security/NFR in the session scratchpad. Nothing in the repository or any worktree was edited. Node v26.11.1, npm 11.20.0. No timing was taken.

## Clause (a): the diff
- `git diff --stat 3e617b26 0bddbb43` lists `package.json` (1+/1−) and `package-lock.json` (2+/2−), and nothing else.
- Every changed line is a `name` value, `cli-chess` → `skytalix`: `package.json:2`, lock `:2` (`.name`) and lock `:8` (`.packages[""].name`).
- No dependency, version, `resolved` URL, `integrity` hash, script, `bin`, `engines` or `private` value moves.
- `diff` of the base lock (`3e617b26`) against the merge lock (`a0dc4135`), with the two name lines removed from each, is empty. Apart from the names, the two locks are byte-identical.
- `git diff 0bddbb43 a0dc4135 -- package.json package-lock.json .npmrc` is empty: the merge of main brought no manifest change. No `.npmrc` is tracked at `a0dc4135`.

## `npm ci` on the delivered lock
- `git show a0dc4135:package.json` and `git show a0dc4135:package-lock.json` were written into an empty scratch directory. `npm ci --ignore-scripts` exits 0.
- `cmp` shows the lock byte-identical after `npm ci`. md5 of `package.json` is `2b25bc28…`; md5 of `package-lock.json` is `95395293…`.

## AR-1 premise checks the manifest could move (at `a0dc4135`)
| check | reading | recorded |
|---|---|---|
| 1 | `npm audit --omit=dev`: found 0 vulnerabilities | same |
| 2 | `has("dependencies")`: false | same |
| 3 | `[true,false,false,false,false]` | same |
| 6 | `scripts.chess` = `node src/cli.ts` | same |
| 7 | 0 and 0 | same |

Checks 4 and 5 read `src/` and the build. This diff touches neither, so they were not re-run.

## AR-1 trigger clause (1) fired: the advisory set drifted, with the lock unchanged
Command: `npm audit --json`, 2026-10-21 about 14:02Z, exit 1. Result: 4 vulnerabilities (1 moderate, 3 high). Metadata: prod 1, dev 122, optional 60.

| package | severity | advisory | in AR-1's table (`…901f43b6`)? |
|---|---|---|---|
| `nanoid` | high | GHSA-2v37-7h3g-55p8 | yes |
| `postcss` | moderate | GHSA-fxqj-rqcc-2cmp | yes |
| `source-map-js` | high | GHSA-68fv-2mgg-jv7q | yes |
| `vite` 7.3.6 (direct, `dev: true`) | high | GHSA-698v-4r3x-3vcv (launch-editor `%` escaping, Windows) | **NEW** |
| `vite` 7.3.6 | high | GHSA-r825-w8mm-5pxw (launch-editor editor CLI flag → command execution) | **NEW** |
| `vite` 7.3.6 | high | GHSA-587h-7wmj-h5pm (launch-editor `existsSync` bypass, Windows) | **NEW** |

- `launch-editor` has no entry of its own in the lock. It is bundled inside `vite`'s dist (`node_modules/vite/dist/node/chunks/config.js`, `launch-editor@2.14.1` regions), so npm reports these advisories against `vite`.
- The base lock has the same dependency tree, so ABC-172 did not cause this drift. It happened in the registry.
- `npm audit` offers a non-`--force` fix (`fixAvailable: true`).
- Before this note, `grep` found no record of these three advisories under `.grugops/context`, `plans`, `memory-bank` or `AGENTS.md`.

## Name on the public registry (dependency-confusion angle)
- `npm view skytalix` returns 404: the name is unclaimed.
- `npm view cli-chess` returns `cli-chess@1.0.4`: the old name belongs to an unrelated third party.
- The package is `"private": true`, so it cannot be published by accident.
- `ADR-0044` D8 keeps `npm publish` and install from a git URL out of v1. The backend builds from a clone.
