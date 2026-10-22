---
id: 20261022T153729Z-security-nfr-observation-56bf0b02
kind: observation
by: security-nfr
at: 2026-10-22T15:37:29Z
verified_by: 
confidence: high (each command run by Security/NFR on 2026-10-22 in scratch clones; outputs read)
refs:
  - ABC-190
  - EPIC-007
  - QE-172-a
  - ABC-168
  - ABC-172
  - AR-1
  - ABC-056
  - grugops/ABC-190
  - grugops/qe-ABC-190
  - 823a9885
  - 15766056
  - d79f4684
  - a0b42688
  - 180ed863
  - 20261021T140532Z-security-nfr-decision-216ceb43
  - 20261021T143943Z-security-nfr-decision-75a45be0
  - 20261021T161340Z-orchestrator-decision-193e08fb
  - 20261022T153220Z-qe-e2e-decision-d21b9a3a
  - 20261022T153005Z-qe-e2e-observation-6e8cf84f
  - 20261022T152415Z-software-engineer-observation-a451fa4c
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
  - V15.1.1
  - V15.2.1
  - GHSA-9jrq-w75r-8gcw
  - GHSA-rq7h-c2jc-7f22
  - GHSA-qxg6-89mg-rqv8
  - GHSA-xp26-3454-mjgp
  - AR-168-BINPIN
supersedes: 
seal: sha256:7f87571db9511a546fc06eeb87a238097c387e4211a8f4ac6ce4b5623a5419e1
---

# ABC-190 Security/NFR readings: the lock diff is 4 root-metadata lines and nothing else; the root `bin` has no install effect; audit is 7 = 7, but that set is NOT the one the owner approved for AR-1 on 2026-10-21

All readings were taken by Security/NFR on 2026-10-22, about 15:30-15:37Z, in fresh scratch clones in the session scratchpad (base `823a9885`, lock commit `15766056`, QE tip `a0b42688`). Node v26.11.1, npm 11.20.0. Nothing in the repository, a worktree or `node_modules` of any checkout was touched. No timing was taken.

## Clause (a): the diff
- `git diff 823a9885 15766056 -- package-lock.json` is one hunk, +4 -0, under `packages[""]` after `"version": "0.0.0"`: `"license": "UNLICENSED",` and the 3-line `"bin": { "skytalix": "dist/uci.js" },`.
- `git diff --stat 823a9885 15766056` lists `package-lock.json` only. `git diff --stat 823a9885 a0b42688` outside `.grugops/` and `plans/` lists `package-lock.json` only. No `.npmrc` is tracked at the tip.
- Structural JSON read, base lock against tip lock: the top-level keys (`name`, `version`, `lockfileVersion`, `requires`) are equal. There are 123 `packages` entries at both ends, with the same keys, and every non-root entry is deep-equal. The tip root minus `license` and `bin` deep-equals the base root.
- So no dependency, version, `resolved`, `integrity`, `engines` or `devDependencies` value moves.
- `package.json` is unchanged. It has carried `license` and `bin` since `ABC-169` and `ABC-168`, and its `bin` was reviewed at `ABC-168` (`…75a45be0` § 3, § 5 `AR-168-BINPIN`).
- Regeneration reproduced: `npm install --package-lock-only --ignore-scripts` on the base clone gives numstat `4 0`, and the result is `cmp`-equal to the tip lock (sha256 prefix `6ffeccdf3e5fc599`, the same as QE's).

## Does the root `bin` in the lock change what `npm install` / `npm ci` does? No
- **On this repository's own checkout:** npm takes the root project's `bin` from `package.json`, and it does not link the root project's own `bin` into its `node_modules/.bin`. Measured on the tip clone: `npm ci` with scripts ON exits 0, `git status --porcelain` is empty, and `node_modules/.bin` has 0 entries named `skytalix`. `npm ci --ignore-scripts` exits 0 with a clean status at base, at `15766056` and at the tip.
- **On a consumer's machine:** npm reads `package-lock.json` only at the root project it belongs to. It is never published, and when this package is installed as a dependency, npm reads the `bin` from this package's `package.json`. That `bin` has been there since `ABC-168`, so it is not new here. The package is `"private": true`, it has never been published, and `package.json` has no lifecycle scripts.
- **So there is no new install-time surface.** The only effect is that the next `npm install` stops writing these 4 lines into an unrelated diff.

## `npm audit`: 7 = 7 at base, lock commit and tip
- `npm audit --json` after `npm ci --ignore-scripts` exits 1 at all three. Metadata is {info 0, low 0, moderate 4, high 3, critical 0, total 7} and dependencies {prod 1, dev 122, optional 60, total 122}. `jq -S .vulnerabilities` is byte-equal across base, lock commit and tip. This agrees with QE `…6e8cf84f` and SE `…a451fa4c`.
- AR-1 premise checks at the tip: `npm audit --omit=dev` finds 0 vulnerabilities, and `package.json` has no `dependencies` key.
- `main` `180ed863` has the same `package.json` and lock as base `823a9885`. `grugops/ABC-178`, `grugops/ABC-189` and `grugops/qe-ABC-189` change neither file against their merge base.

## The 7 is NOT the set the owner approved for AR-1 (`…193e08fb`, 2026-10-21T16:13Z): trigger clause (1) has fired again
Approved set: 4 packages, 6 (package, advisory) pairs: nanoid GHSA-2v37-7h3g-55p8; postcss GHSA-fxqj-rqcc-2cmp; source-map-js GHSA-68fv-2mgg-jv7q; vite GHSA-698v-4r3x-3vcv, GHSA-r825-w8mm-5pxw and GHSA-587h-7wmj-h5pm.

Today's set (identical at base and tip):

| package | npm severity | advisory ids | in the approved set? |
|---|---|---|---|
| nanoid (transitive) | high | GHSA-2v37-7h3g-55p8 | yes |
| source-map-js (transitive) | high | GHSA-68fv-2mgg-jv7q | yes |
| postcss (transitive) | moderate | GHSA-fxqj-rqcc-2cmp | yes |
| vite 7.3.6 (direct, dev) | high | GHSA-587h-7wmj-h5pm (high), GHSA-698v-4r3x-3vcv (now moderate), GHSA-r825-w8mm-5pxw (now moderate) | yes |
| vite 7.3.6 | (same row) | **GHSA-9jrq-w75r-8gcw** (low: cross-origin script execution through Vite custom middleware) | **NEW** |
| vite 7.3.6 | (same row) | **GHSA-rq7h-c2jc-7f22** (moderate: files outside `server.fs.allow` served when project paths match system paths) | **NEW** |
| @vitest/mocker (transitive) | moderate | **GHSA-qxg6-89mg-rqv8** (code injection via unauthenticated manual-mock registration), **GHSA-xp26-3454-mjgp** (Windows backslash traversal of the redirect allowlist) | **NEW** |
| vitest (direct, dev) | moderate | none of its own; via @vitest/mocker and @vitest/coverage-v8 | **NEW row** |
| @vitest/coverage-v8 (direct, dev) | moderate | none of its own; via vitest | **NEW row** |

- **4 new (package, advisory) pairs**, 3 moderate and 1 low. **No new high pair.** Two of the approved vite pairs were re-graded high to moderate by the registry.
- Before this note, `grep` found none of the 4 new advisory ids under `.grugops/`, `plans/`, `memory-bank/` or `AGENTS.md`. QE and SE recorded the 7 packages but did not compare them against the approved set.
- **Cause: registry drift.** The lock has not moved since `ABC-168`, and the set is the same at base and tip. ABC-190 did not cause it, and it is live on `main` today.
- **Reachability here.** I read the two GitHub advisory pages for the @vitest/mocker ids. Both need a running Vite dev server with `mockerPlugin()` or `interceptorPlugin()` registered ("Node runs do not register these handlers"), and GHSA-xp26 is Windows-only. The two new vite ids are dev-server issues too. This repository runs vitest in plain Node: `git grep` over the tip's `*.ts`/`*.js`/`*.mjs`/`*.json` finds no `mockerPlugin`, `interceptorPlugin`, `browser:`, `ui:`, `api:`, `createServer` or `server.fs`, and `vitest.config.ts` is the only vite/vitest config. **`UNKNOWN - verify` (still open from `…216ceb43`):** it is not proved that vitest opens no dev-server socket in a plain run.
- `npm audit` reports `fixAvailable: true` for all 7. `@vitest/mocker` 4.1.12 patches both new vitest ids, and `vitest`'s `~4.1.11` range already admits 4.1.12. That is an observation for AR-1's owner. It is not done here, and ABC-190's page fences it out.
