---
id: 20261022T154809Z-ba-pm-observation-63b88f5d
kind: observation
by: ba-pm
at: 2026-10-22T15:48:09Z
verified_by: 
confidence: high (each command run by BA/PM on 2026-10-22 in scratch clones; outputs read; no vitest, no timing)
refs:
  - ABC-198
  - AR-1
  - ABC-056
  - ABC-192
  - ABC-143
  - RISK-ABC143-01
  - RISK-ABC173-STATE
  - ABC-190
  - ABC-178
  - GHSA-qxg6-89mg-rqv8
  - GHSA-xp26-3454-mjgp
  - GHSA-9jrq-w75r-8gcw
  - GHSA-rq7h-c2jc-7f22
  - GHSA-587h-7wmj-h5pm
  - GHSA-698v-4r3x-3vcv
  - GHSA-r825-w8mm-5pxw
  - GHSA-2v37-7h3g-55p8
  - GHSA-fxqj-rqcc-2cmp
  - GHSA-68fv-2mgg-jv7q
  - 5aaf09ac
  - a54f91c4
  - 20261022T153947Z-orchestrator-decision-e4ef897b
  - 20261022T153804Z-security-nfr-decision-140008ff
  - 20261022T153729Z-security-nfr-observation-56bf0b02
  - 20261021T140532Z-security-nfr-decision-216ceb43
  - 20261021T161340Z-orchestrator-decision-193e08fb
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
  - plans/tickets/ABC-198-four-new-dev-only-advisories-on-vitest-4-1-11-and-vite-7-3-6-and-an-in-range-lock-bump-clears-them.md
supersedes: 
seal: sha256:663dd369363415295d499a46757e55732ca59fda534491ff279ce775ac4f38ab
---

# bapm-cut-AR-1-drift readings: an in-range, lock-only bump exists for all 4 new pairs. `vitest` pins `@vitest/mocker` exactly, so the whole `vitest` family moves. `vite` 7.3.7 clears all 5 vite pairs. `ABC-192`'s `A2` row reds on the bump by design

All readings were taken by BA/PM on 2026-10-22, about 15:40–15:45Z, in fresh scratch clones of `main` `5aaf09ac` in the session scratchpad. Node v26.11.1, npm 11.20.0. Nothing in main's checkout, a worktree or its `node_modules` was touched. No vitest was run and no timing was taken. `a54f91c4` (ABC-189's merge, after the clone) touches neither `package.json` nor `package-lock.json`. It adds 1 line to `src/cli.test.ts`, so the literal sits at `:4270` there.

## The lock today (base)
- `vitest` 4.1.11 `dependencies` pins `@vitest/mocker` at exactly `"4.1.11"`, and every other `@vitest/*` exactly too. `@vitest/coverage-v8` 4.1.11 peers `vitest` `"4.1.11"` exactly. `vite` 7.3.6.
- Registry (`npm view`): `vitest`, `@vitest/mocker` and `@vitest/coverage-v8` each have 4.1.12 (published 2026-10-15). `vite` has 7.3.7 (2026-10-06), inside `~7.3.6`. `vitest@4.1.12` depends on `@vitest/mocker` `"4.1.12"`.
- So `@vitest/mocker` 4.1.12 is reachable only through `vitest` 4.1.12. That is a family bump, and all of it sits inside `~4.1.11`.

## Audit ranges (base `npm audit --json`)
- `@vitest/mocker` GHSA-qxg6-89mg-rqv8 `>=2.1.0-beta.7 <4.1.12`; GHSA-xp26-3454-mjgp `>=4.1.11 <4.1.12`.
- All 5 `vite` advisories (GHSA-698v, -r825, -587h, -9jrq, -rq7h) are `>=7.0.0 <=7.3.6`.
- nanoid `<3.3.18`; source-map-js `>=1.0.0 <1.2.2`; postcss `<=8.5.22`.

## Commands tried (each on its own fresh clone of base)
| variant | command | lock diff | moves |
|---|---|---|---|
| V1 | `npm update --package-lock-only --ignore-scripts vitest @vitest/coverage-v8` | **none** | nothing (the exact peer pair blocks a named update) |
| V3-upd | same, naming all 9 `@vitest/*` + `vitest` | **none** | nothing |
| V2 | `npm update … vitest @vitest/coverage-v8 vite` | `3 3` | `vite` only |
| V4 | `npm update --package-lock-only --ignore-scripts` (all) | `423 315` | 80 version moves (biome 2.6.2, rollup 4.65.0, esbuild 0.28.2, `@types/node` 22.20.5, nanoid 3.3.20, postcss 8.5.31, source-map-js 1.2.2, the vitest family, vite) plus 3 new optional entries. **Rejected as too wide.** |
| V3 | `npm install --package-lock-only --ignore-scripts 'vitest@~4.1.11' '@vitest/coverage-v8@~4.1.11'` | `50 50` | the 9 vitest-family packages → 4.1.12 |
| **V5** | V3 + `'vite@~7.3.6'` | **`53 53`** | the 9 → 4.1.12, plus `vite` → 7.3.7 |

- V3 and V5: `package.json` unchanged (`git diff --quiet` true). There are 123 `packages` entries at both ends, and only the moved entries differ. V5 has 20 changed `"version"` lines.
- In V5, the changed lines other than `version`/`resolved`/`integrity` are all `4.1.11` → `4.1.12` pins in the moved entries' `dependencies`/`peerDependencies`. The one exception is `vitest`'s peer `@vitest/browser-webdriverio` `4.1.11` → `^4.1.11` (as published). `vite`'s entry changes `version`, `resolved` and `integrity` only.
- The V5 lock's sha256 prefix is `5d48a90473834f4c`. Re-running the V5 command is a no-op, and `npm install --package-lock-only --ignore-scripts` after it is a no-op.

## `npm ci` + audit on the committed variants (fresh clones)
- V3 and V5: `npm ci --ignore-scripts` exits 0, and `git status --porcelain` is empty. `npm audit --omit=dev` totals 0. `npm ls` shows a single copy of each package: `vitest`, `@vitest/mocker` and `@vitest/coverage-v8` at 4.1.12, with `vite` at 7.3.6 (V3) or 7.3.7 (V5).
- Pair lists (sorted `package advisory`, via rows as `package via:x`):
  - **base** (metadata moderate 4, high 3, total 7): `@vitest/coverage-v8 via:vitest`; `@vitest/mocker` GHSA-qxg6-89mg-rqv8, GHSA-xp26-3454-mjgp; nanoid GHSA-2v37-7h3g-55p8; postcss GHSA-fxqj-rqcc-2cmp; source-map-js GHSA-68fv-2mgg-jv7q; vite GHSA-587h-7wmj-h5pm, GHSA-698v-4r3x-3vcv, GHSA-9jrq-w75r-8gcw, GHSA-r825-w8mm-5pxw, GHSA-rq7h-c2jc-7f22; `vitest via:@vitest/coverage-v8`; `vitest via:@vitest/mocker`.
  - **V3** (moderate 1, high 3, total 4): nanoid, postcss, source-map-js (as above), plus the 5 vite pairs. The 2 mocker pairs and 3 via rows are gone.
  - **V5** (moderate 1, high 2, total 3): nanoid GHSA-2v37-7h3g-55p8; postcss GHSA-fxqj-rqcc-2cmp; source-map-js GHSA-68fv-2mgg-jv7q. **That is 7 pairs and 3 via rows gone, with nothing added.**

## What reds on the bump (read, not run)
- `src/cli.test.ts` (`ABC-192` `A2`): `CAPTURE_ARM_READ_ON_VITEST = "4.1.11"` is compared to the installed `node_modules/vitest/package.json` version, with `BUMP_RERUN_LIST` as the message. At 4.1.12 it reds by design until the re-run list is done and the literal is re-pinned.
- Other `4.1.11` mentions outside the lock: `package.json` ranges (unchanged); comments at `src/cli.test.ts:377`, `tools/grugops/heap-guard.js:9`, and `vitest.config.ts:93,109`.
- `vitest.config.ts` sets `pool: "threads"`. `npm test` runs `node tools/grugops/run-bounded.js 60000 vitest run …`, so the probe's process tree is `run-bounded.js` → `vitest` → threads.
