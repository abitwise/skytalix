---
id: 20261022T172439Z-release-manager-observation-eb1d1cdf
kind: observation
by: release-manager
at: 2026-10-22T17:24:39Z
verified_by: 
confidence: high
refs:
  - AR-1
  - ABC-056
  - ABC-168
  - AR-168-BINPIN
  - 825b21d1
  - 513c0211
  - 26b5f191
  - e0e5f987
  - 20261017T180500Z-release-manager-decision-ar1-restated-901f43b6
  - 20261021T161340Z-orchestrator-decision-193e08fb
  - 20261021T143943Z-security-nfr-decision-75a45be0
  - 20261022T161122Z-security-nfr-decision-0f626230
  - 20261022T172421Z-release-manager-observation-d1d9ec04
supersedes: 
seal: sha256:7c4644a387404e0e7cab65a80f34625eb55680d5334f23527a79dedbdfc859d7
---

# AR-1 trigger clause (2), premise drift, has FIRED on `main` since the ABC-168 merge (`513c0211`, 2026-10-22). Checks 3, 4 and 5c no longer read as `…901f43b6` recorded them. The substantive leg still holds on both runtime paths

This is an observation, not a `finding`: there is no gate stamp for it. It sits outside this hop's brief, which named only the advisory set. I record it because a re-statement that carried `…901f43b6`'s premise table forward unread would be a false record.

## What I ran
- The commands are `…901f43b6`'s `A1` table, word for word, on the same scratch clone at `e0e5f987` as `…d1d9ec04`. `grep` is BSD grep 2.6.0-FreeBSD, via `command grep`.
- For check 4, the `git status --porcelain --ignored` output from before `npm run -s build` was diffed against the output from after it.

| # | recorded in `…901f43b6` | at `e0e5f987` | drifted |
|---|---|---|---|
| 1 | `found 0 vulnerabilities` | `found 0 vulnerabilities`, exit 0 | no |
| 2 | `false` | `false` | no |
| 3 | `[true,false,false,false,false]` | **`[true,true,false,false,false]`**, with `bin` = `{"skytalix":"dist/uci.js"}` | **yes** |
| 4 | build emits nothing (`tsc --noEmit`) | **`build` = `tsc -p tsconfig.build.json`, exit 0. It writes `dist/` (22 `.js` files; `dist/uci.js` starts `#!/usr/bin/env node`). The ignored-status diff adds `!! dist/`** | **yes** |
| 5a | empty | empty (42 files in the production set; 40 before) | no |
| 5b | empty | empty | no |
| 5c | `{node:fs}` | **`{node:fs, node:readline}`**. `node:readline` comes from `src/uci.ts`, which arrived in `825b21d1` (ABC-168) | **yes** |
| 5d | empty | empty | no |
| 6 | `node src/cli.ts` | `node src/cli.ts` | no |
| 7 | `0` and `0` | `0` and `0` | no |

Also measured:
- There is no `.npmrc`.
- A second runtime script now exists: `scripts.uci` = `node src/uci.ts`. It has no loader flag. Check 6 reads only `scripts.chess`, so it does not see this script.

## Where it came from
- All three drifts arrived with ABC-168: commit `825b21d1`, merged to `main` at `513c0211` on 2026-10-22.
- The owner approved `…193e08fb` on `26b5f191`, where check 3 still read `[true,false,false,false,false]`. `26b5f191` is not an ancestor of `825b21d1`.
- So the owner's approval came before the drift. I found no note that reads AR-1's clause (2) after that merge:
  - Security/NFR on ABC-168 (`…75a45be0`) handled the `bin` as `AR-168-BINPIN`, not against AR-1.
  - `…0f626230` and `…140008ff` read only checks 1 and 2.

## The substantive leg, measured
"No package from the npm tree is loaded on the runtime path" still holds on both paths I could read.

**Source path** (`npm run chess` and `npm run uci`):
- 5a, 5b and 5d are empty over the 42-file production set.
- The only built-ins imported are `node:fs` and `node:readline`.

**Built path** (`bin` → `dist/uci.js`):
- I ran the same 5a–5d greps over the 22 built `dist/*.js` files.
- 5a, 5b and 5d are empty. 5c reads `{node:fs, node:readline}`.

## Why this needs more than a re-statement
`…901f43b6` § `A4` says this in its own words: "Check 2 turning `true`, a `bin`, or anything published also hits `ABC-056`'s `P1` promotion trigger. Under those conditions `AR-1`'s premise no longer holds, and re-stating it is not enough."

ABC-056's page says the same: "Promote to `P1` the moment this project acquires a runtime dependency, a `bin`, or anything to deploy — each of those removes one leg of the override's premise."

A `bin` now exists. The package is still `"private": true` and has no `files`, `main` or `exports`, so nothing is published. No runtime dependency exists (checks 2 and 7).
