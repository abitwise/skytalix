---
id: 20261022T173538Z-security-nfr-observation-a8796ea3
kind: observation
by: security-nfr
at: 2026-10-22T17:35:38Z
verified_by: 
confidence: high
refs:
  - AR-1
  - ABC-056
  - ABC-168
  - AR-168-BINPIN
  - 6ccbcc3e
  - 513c0211
  - GHSA-2v37-7h3g-55p8
  - GHSA-fxqj-rqcc-2cmp
  - GHSA-68fv-2mgg-jv7q
  - 20261017T180500Z-release-manager-decision-ar1-restated-901f43b6
  - 20261022T172439Z-release-manager-observation-eb1d1cdf
  - 20261022T172518Z-release-manager-decision-130fb9a3
  - 20261022T174000Z-orchestrator-decision-1b62e80b
supersedes: 
seal: sha256:e8ec6631c6c32cb876760ad13448fc498ddaa1a2819c238a0d48dd560db84214
---

# AR-1 premise re-read: readings at `main` `6ccbcc3e`, with `bin` and `dist/` in scope. No npm package is loaded or shipped on any runtime path, and a consumer of the packed artifact does not install any of the three flagged packages

This is an observation and carries no gate stamp; `human_admission` is `off` on this install, so no `finding` is admissible. The ruling is in this task's `decision` note.

## Where and how
- I made a fresh `git clone` of this repository and checked it out at `6ccbcc3e`, in this hop's scratch folder `scratchpad/sec-ar1/clone`. `main` is at `1f9afa91`, which differs from `6ccbcc3e` in records only: `git diff --stat` touches `.grugops/` and `plans/` and nothing else. Nothing ran in main's checkout.
- Manifest md5s are `package.json` `e33daa26e800038534bda284b3ff4133` and `package-lock.json` `f6c3d961173fca9cde4f2acecd7dce50`. These match the values `…d1d9ec04` recorded at `e0e5f987`.
- `npm ci --ignore-scripts --cache <scratch>` exited 0, and `git status --porcelain` was empty afterwards. The toolchain was node v26.11.1, npm 11.20.0, and BSD grep 2.6.0-FreeBSD (via `command grep`). I took the readings on 2026-10-22, from about 17:29Z to 17:34Z.
- I did not run `npm audit fix`. I did no timing runs: the `perft` and `spike:perft` scripts were read statically and not executed.

## 1. `…901f43b6`'s checks 1–7, verbatim
| # | recorded | read at `6ccbcc3e` | drifted |
|---|---|---|---|
| 1 | `found 0 vulnerabilities` | `found 0 vulnerabilities`, exit 0 | no |
| 2 | `false` | `false` | no |
| 3 | `[true,false,false,false,false]` | `[true,true,false,false,false]` | **yes** (`bin`) |
| 4 | emits nothing | `tsc -p tsconfig.build.json` exits 0. The ignored-status diff adds exactly `!! dist/`, and the build writes 22 files, all `.js`. `dist/uci.js` starts `#!/usr/bin/env node` | **yes** |
| 5a | empty | empty (42 production files) | no |
| 5b | empty | empty | no |
| 5c | `{node:fs}` | `{node:fs, node:readline}` | **yes** |
| 5d | empty | empty | no |
| 6 | `node src/cli.ts` | `node src/cli.ts` | no |
| 7 | `0` / `0` | `0` / `0` | no |

My readings match `…eb1d1cdf`'s; I ran them myself and did not copy them.

## 2. Where checks 1–7 are blind, read
- **`dist/`.** I ran 5a–5d over all 22 `dist` files, which hold 65 specifiers. 5a, 5b and 5d are empty, and 5c is `{node:fs, node:readline}`. Every relative specifier ends in `.js`, as `rewriteRelativeImportExtensions` produces.
- **Every `scripts.*` entry (11).**
  - Four run repository code under `node`: `chess` = `node src/cli.ts`, `uci` = `node src/uci.ts`, `perft` = `node src/perft-bench.ts`, and `spike:perft` = `node spike/perft-bench.ts`.
  - Seven are toolchain: `typecheck`, `test`, `test:watch`, `lint`, `lint:fix`, `format` and `build`.
  - No script carries a loader flag (`--import`, `--require`, `-r`, `--loader`, `--experimental-loader`). The only `NODE_OPTIONS` value is `--max-old-space-size=128`, on `test` and `test:watch`, which are toolchain scripts.
  - There is no lifecycle script: no `pre*`/`post*`, `install`, `prepare`, `prepack` or `publish`.
  - There is no `.npmrc` and no `.npmignore`.
- **`spike/`, outside the production set.** It holds 1 file, `spike/perft-bench.ts`, whose only specifier is `node:os`. 5a, 5b and 5d are empty over it.
- **`files`/`bin`.** `private` is `true`. `bin` = `{"skytalix":"dist/uci.js"}`. There is no `main`, `exports` or `files` key.
- **`npm pack --dry-run --json --ignore-scripts`.** I ran it built and unbuilt:
  - **Built:** `skytalix@0.0.0`, 8 607 entries, `bundled` 0, 0 paths under `node_modules/`, and 22 `dist/` files.
  - **Unbuilt:** 8 585 entries and 0 `dist/` files, so the `bin` target is absent from the tarball.
  - `package-lock.json` is not in the pack. `package.json` and `data/opening-book/{book.json,ATTRIBUTION.md}` are.
  - With no `files` key, the pack also carries `.grugops/` (8 154 entries), `plans/` (243) and `memory-bank/` (57). npm warns `gitignore-fallback`.
  - I measured that `dist/` ships despite `.gitignore` listing it. I did not read the mechanism.

## 3. Runtime load readings (resolve hook)
- **The hook.** `scratchpad/sec-ar1/bin/loadlog.mjs` uses `module.registerHooks({ resolve })` and appends every resolved URL, ESM or `require`, to `$LOADLOG`. It is loaded with `node --import <hook>`. Each entry was given a short session on stdin:
  - `src/cli.ts`: `quit`;
  - the UCI entries: `uci`, `isready`, `position startpos moves e2e4`, `go depth 1`, `quit`.
- **Results.** Each run exited 0.

| entry | resolved URLs | `node_modules` URLs |
|---|---|---|
| `node src/cli.ts` (`npm run chess`) | 34 `src`, `node:fs` | **0** |
| `node src/uci.ts` (`npm run uci`) | 18 `src`, `node:fs`, `node:readline` | **0** |
| `node dist/uci.js` (the `bin` target) | 18 `dist`, `node:fs`, `node:readline` | **0** |
| control: `import "nanoid"; import "postcss"; import "source-map-js"` | — | **47** (nanoid 3, postcss 30, source-map-js 13, picocolors 1) |

- **The shipped artifact, installed.**
  - I ran `npm pack --ignore-scripts` on the built tree into scratch, then `npm install --ignore-scripts <tgz>` into an empty scratch prefix. Result: `added 1 package`, and `node_modules` holds only `skytalix`.
  - **nanoid, postcss and source-map-js are absent** from the consumer's install.
  - I ran `node_modules/.bin/skytalix` under the hook with the UCI session above. It exited 0 and printed `bestmove c7c5`.
  - It resolved 20 URLs: 18 under `node_modules/skytalix/dist/`, plus `node:fs` and `node:readline`. It resolved **0** other `node_modules` URLs.

## 4. The advisory set (clause (1), pairs not counts)
- `npm audit --json` exited 1 with a total of 3 (moderate 1, high 2) and no via-only rows. The sorted pair list `diff`s **empty** against `…130fb9a3` § 1: nanoid GHSA-2v37-7h3g-55p8, postcss GHSA-fxqj-rqcc-2cmp, source-map-js GHSA-68fv-2mgg-jv7q. **Clause (1) is quiet.**
- The registry's range text for source-map-js now reads `>=1.0.0 <1.2.2`, where `…130fb9a3` recorded `1.0.0 - 1.2.1`. This is the same pair, and 1.2.1 is in both ranges. INFO only.
- Paths (`npm ls --all`): `vite@7.3.7` → `postcss@8.5.22` → {`nanoid@3.3.16`, `source-map-js@1.2.1`}. A second path is `@vitest/coverage-v8@4.1.12` → `magicast@0.5.5` → `source-map-js@1.2.1`.
- Advisory titles:
  - nanoid: "custom generators can loop indefinitely when size is zero";
  - postcss: "attacker-controlled sourceMappingURL reads arbitrary .map files when `from` is unset";
  - source-map-js: "event-loop denial of service through indexed source-map section offsets".
- **Toolchain input.** 0 tracked files have a `.css`, `.scss`, `.sass`, `.less`, `.pcss`, `.postcss` or `.map` extension. The 5 tracked files holding `sourceMappingURL` are records under `.grugops/` and `plans/`, and none is CSS. `dist/` holds no source map, because `sourceMap` is unset.

## 5. Plant controls for the widened checks
Each plant was made in memory (`jq` on a piped `package.json`) or in the scratch clone's ignored `dist/`, and was then reverted. `dist/` was rebuilt afterwards (22 files), and `git status --porcelain` was empty.
- `scripts.uci` = `node --import nanoid src/uci.ts`: 6b prints that line.
- `scripts.perft` = `node -r nanoid src/perft-bench.ts`: 6b prints that line.
- `scripts.prepare` added: 6c reads `["prepare"]`.
- `import "nanoid";` appended to `dist/uci.js`: 5e (5a over `dist`) prints `import "nanoid"`.
- A `dist/zz-plant.js` file using `createRequire(...)("nanoid")`: 5e (5b over `dist`) prints its line.
