---
id: 20261022T174045Z-release-manager-observation-fb563109
kind: observation
by: release-manager
at: 2026-10-22T17:40:45Z
verified_by: 
confidence: high
refs:
  - AR-1
  - ABC-056
  - ABC-168
  - ADR-0036
  - 8ddd3f42
  - 6ccbcc3e
  - 513c0211
  - GHSA-2v37-7h3g-55p8
  - GHSA-fxqj-rqcc-2cmp
  - GHSA-68fv-2mgg-jv7q
  - 20261022T173546Z-security-nfr-decision-7d7b76ec
  - 20261022T173538Z-security-nfr-observation-a8796ea3
  - 20261022T172518Z-release-manager-decision-130fb9a3
  - 20261017T180500Z-release-manager-decision-ar1-restated-901f43b6
  - 20261022T172421Z-release-manager-observation-d1d9ec04
supersedes: 
seal: sha256:85471f35d6ff91bb8973a3781c63ab9877e134b39299763552cc60ad5d7343c9
---

# AR-1 premise checks 1–8 (revised table `…7d7b76ec` § 3) read at `main` `8ddd3f42`: every check reads as expected. Advisory pair list `diff`s empty. No STOP

This is an observation and carries no gate stamp. `human_admission` is `off` on this install, so no `finding` is admissible, and none is owed, because nothing drifted. The ruling and the re-stated record are in this task's `decision` note.

## Where and how
- I made a fresh `git clone` of this repository at `main` `8ddd3f42`, in the scratch folder `scratchpad/rm-ar1p/clone`. Nothing ran in main's checkout.
- `git diff --stat 6ccbcc3e 8ddd3f42 -- . ':!.grugops' ':!plans'` is empty, so the tip differs from Security/NFR's reading point in records only.
- Manifest md5s: `package.json` `e33daa26e800038534bda284b3ff4133`, `package-lock.json` `f6c3d961173fca9cde4f2acecd7dce50`. These are the values `…a8796ea3` and `…d1d9ec04` recorded.
- `npm ci --ignore-scripts --cache <scratch>` exited 0. `git status --porcelain` was empty after it, and again after all the checks.
- Toolchain: node v26.11.1, npm 11.20.0, BSD grep via `command grep`. Readings were taken on 2026-10-22 between about 17:38Z and 17:40Z.
- The commands come from `scratchpad/sec-ar1/bin/checks-v2.sh`, which I ran read-only. Before running it, I compared it line by line with `…7d7b76ec` § 3. It implements the table's commands and file sets `F`, `K` and `D`, and it removes `dist/` before check 4. There was no `dist/` in the fresh clone anyway.
- I did not run `npm audit fix`. I did no timing runs, and I did not run the optional resolve-hook reading (§ "Not run").

## Readings
| # | expected (`…7d7b76ec` § 3) | read at `8ddd3f42` | as expected |
|---|---|---|---|
| 1 | `found 0 vulnerabilities`, exit 0 | `found 0 vulnerabilities`, exit 0 | yes |
| 2 | `false` | `false` | yes |
| 3 | `[true,{"skytalix":"dist/uci.js"},false,false,false]` | `[true,{"skytalix":"dist/uci.js"},false,false,false]` | yes |
| 4 | `0`, then exactly `> !! dist/` | `0`, then exactly `> !! dist/`. There are 22 `dist` files, all `.js` | yes |
| 5a | empty (over `F`) | empty | yes |
| 5b | empty | empty | yes |
| 5c | `node:fs node:readline` | `node:fs node:readline` | yes |
| 5d | empty | empty | yes |
| 5e | empty, empty, empty; then `node:fs node:readline` (over `D`) | empty, empty, empty; then `node:fs node:readline` | yes |
| 5f | empty, empty, empty; then `node:os` (over `K`) | empty, empty, empty; then `node:os` | yes |
| 6a | the 11-line listing | 11 lines. A literal `diff` against `git show 6ccbcc3e:package.json` through the same `jq` is empty (rc 0) | yes |
| 6b | empty | empty | yes |
| 6c | `[]` | `[]` | yes |
| 6d | `0` | `0` | yes |
| 7 | `0` and `0` | `0` and `0` | yes |
| 8 | `[0,0]` | `[0,0]` (taken on the built tree) | yes |

**Context counts (not checks):** `F` = 42, `K` = 1, `D` = 22.

**The 6a listing as read**, and pinned in the decision note:
```
typecheck=tsc --noEmit
test=NODE_OPTIONS=--max-old-space-size=128 node tools/grugops/run-bounded.js 60000 vitest run --reporter=default --reporter=./tools/grugops/result-file-reporter.js --outputFile.json=.test-results/last-run.json
test:watch=NODE_OPTIONS=--max-old-space-size=128 vitest
lint=biome check .
lint:fix=biome check --write .
format=biome format --write
build=tsc -p tsconfig.build.json
chess=node src/cli.ts
uci=node src/uci.ts
perft=node src/perft-bench.ts
spike:perft=node spike/perft-bench.ts
```

## Advisory set: clauses (1) and (3), pairs not counts
- `npm audit --json` exited 1 with a total of 3: moderate 1, high 2, critical 0.
- The pair list comes from `jq -r '.vulnerabilities[] | .name as $n | .via[] | select(type=="object") | "\($n) \(.url|split("/")|last)"' | sort`. It `diff`s **empty** (rc 0) against `…130fb9a3` § 1:
  - nanoid GHSA-2v37-7h3g-55p8;
  - postcss GHSA-fxqj-rqcc-2cmp;
  - source-map-js GHSA-68fv-2mgg-jv7q.
- There are no via-only rows.
- Ranges as read: nanoid `<3.3.18`, postcss `<=8.5.22`, source-map-js `>=1.0.0 <1.2.2`. The last is the new registry text that `…7d7b76ec` § 6 noted. The pair is the same.
- **Clause (1) is quiet.**

## Not run
- **The plant controls.** I did not re-run them. Those for the kept checks are in `…901f43b6` § A2/A3, and those for 5e, 6b and 6c are in `…a8796ea3` § 5. I cite them.
- **The optional resolve-hook reading** (`…7d7b76ec` § 3, "optional, at a premise re-read only"). Security/NFR read it at `6ccbcc3e`, and the source and manifests here are byte-identical to that commit. I cite it and did not re-run it.
