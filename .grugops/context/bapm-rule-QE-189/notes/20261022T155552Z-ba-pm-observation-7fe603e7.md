---
id: 20261022T155552Z-ba-pm-observation-7fe603e7
kind: observation
by: ba-pm
at: 2026-10-22T15:55:52Z
verified_by: 
confidence: high (own runs on scratch exports of main 4952425a; node v26.11.1, npm 11.20.0)
refs:
  - ABC-189
  - QE-189-a
  - QE-189-b
  - QE-189-c
  - AR-168-BINPIN
  - ABC-168 A7
  - ADR-0044 D8
  - NFR-008
  - tsconfig.build.json
  - tsconfig.json
  - package-lock.json
  - 4952425a
  - 20261022T154204Z-qe-e2e-decision-b2012318
  - 20261022T153720Z-qe-e2e-observation-f3106f00
  - 20261022T154204Z-qe-e2e-observation-340a360e
supersedes: 
seal: sha256:79d7b9d60d4a914fb5f544a103d2e84e0fd9d5f70573c0e151de3597569b2932
---

# bapm-rule-QE-189 readings: four build-config plants all leave bin dangling with every gate green; a static tsconfig pin sees three of them; a dangling bin installs silently and fails at launch (rc 127); a drifted lock root bin is not shipped and npm rewrites it

Method: `git archive 4952425a` into the session scratchpad (`…/scratchpad/bapm189/`), with `node_modules` symlinked from main's checkout. Each plant is a fresh copy. No vitest ran, and nothing ran in main's checkout. The static check is a 7-line throwaway script (`derive.mjs`) that computes `outDir` + (`files[i]` relative to `rootDir`), with `.ts` → `.js`, and compares that to `bin.skytalix`.

## Reads (no run)
- No test row reads `dist/`. `grep -rn dist src/*.test.ts tools vitest.config.ts` finds only `src/cli.test.ts:1823` (the ABC-189 pin, a string). ABC-168 `A7` is a by-hand reading at ABC-168's build hop and at UAT (its test note 1), not a standing row. The `build` gate reads only rc.
- `AR-168-BINPIN` is closed (board 16:00Z, merge `a54f91c4`). No packaging or backend-dependency ticket exists on the board. So the fold target the brief names does not exist.

## Plants (build rc / typecheck rc / is the bin target present / static check)
| plant | build | typecheck | `dist/uci.js` | emitted instead | static check |
|---|---|---|---|---|---|
| P0 real | 0 | 0 | present | — | MATCH |
| P1 `tsconfig.build.json` `outDir` → `build` (QE's plant) | 0 | 0 | MISSING | `build/uci.js` | MISMATCH |
| P2 `rootDir` → `.` | 0 | 0 | MISSING | `dist/src/uci.js` | MISMATCH |
| P3 `files` → `["src/cli.ts"]` (QE's reasoned case) | 0 | 0 | MISSING | `dist/cli.js` | MISMATCH |
| P4 base `tsconfig.json` gains `declaration` + `emitDeclarationOnly` | 0 | 0 | MISSING | `dist/uci.d.ts` only | **MATCH (blind)** |

- `npm run build` takes 0.60 s wall (1.09 s user) on this host. That is one reading, under load from parallel hops.

## Installed case (P0 and P1, `npm pack` then `npm install --offline` of the tarball into an empty scratch consumer)
- P0: install rc 0. `node_modules/.bin/skytalix` → `../skytalix/dist/uci.js`. `printf 'uci\nquit\n'` gives `id name skytalix` … rc 0.
- P1: install rc 0 with **0 warnings**, and **no** `.bin/skytalix` link is created. Launch: `No such file or directory`, rc **127**.
- So QE's "fails loudly at install or launch" is half right. The install is silent, and the first launch fails loudly.

## QE-189-c (lock root `bin`)
- `npm pack --dry-run`: `package-lock.json` is not in the tarball, so a consumer never reads the root entry.
- Plant `packages[""].bin.skytalix` → `src/uci.ts`, then `npm install --package-lock-only --offline --ignore-scripts`: rc 0, `up to date`, and the root `bin` reads `{ skytalix: 'dist/uci.js' }` again. The next lock write heals the drift from `package.json`.
- This hop read the user's npm cache for that offline run (`npm_config_cache=$HOME/.npm`). The pack/install runs used a scratch cache.

## Aside, for any future packaging ticket (not a gap here)
- There is no `files` field. `npm pack --dry-run` lists 8 578 entries, `.grugops/` and `src/` included. `dist/uci.js` is in it.
