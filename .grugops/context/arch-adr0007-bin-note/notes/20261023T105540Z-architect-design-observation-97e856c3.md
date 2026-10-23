---
id: 20261023T105540Z-architect-design-observation-97e856c3
kind: observation
by: architect-design
at: 2026-10-23T10:55:40Z
verified_by: 
confidence: high (read-only readings on main 2d962400)
refs:
  - arch-adr0007-bin-note
  - ADR-0007
  - memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md
  - ABC-168
  - 2d962400
  - 825b21d1
  - 513c0211
  - ADR-0044
  - ADR-0018
  - AR-1
  - AR-168-BINPIN
  - 20261023T105100Z-orchestrator-decision-d3681daa
  - 20261022T172439Z-release-manager-observation-eb1d1cdf
  - 20261022T173538Z-security-nfr-observation-a8796ea3
  - 20261022T173546Z-security-nfr-decision-7d7b76ec
  - 20261022T174056Z-release-manager-decision-edd18e94
supersedes: 
seal: sha256:131250a074997e7c2bc44585e2440745524c7096917046514fdf4a0dacbdb6db
---

# ADR-0007 bin note: the facts, read on `main` `2d962400`. `D2`'s "exposes an executable" leg fired at `513c0211`; `D1`, `D3`, `D4` and `D7` hold

These are read-only readings. They come from `git show main:<path>`, `git log main` and a filesystem scan of the worktree, which was checked out at `main` `2d962400`. Nothing was built, installed or run.

## `package.json` and the `bin`
- `jq -c '[.private, .bin, has("main"), has("exports"), has("files")]'` prints `[true,{"skytalix":"dist/uci.js"},false,false,false]`.
- `scripts.build` is `tsc -p tsconfig.build.json`. `scripts.uci` is `node src/uci.ts`. There is no `start` script and no lifecycle script.
- `git log main -S'"skytalix": "dist/uci.js"' -- package.json` names one commit: `825b21d1` (2026-10-21, "feat(uci): grug ABC-168 skytalix entry point, dist build, UCI_DEEP lane, A10 pin").
- With `--first-parent`, the merge is `513c0211` (2026-10-22, "merge(ABC-168) …").
- `git log main -G'"bin"' -- package.json` and `-G'dist/uci.js'` name only `825b21d1`. So the value has not changed since. `-G'skytalix'` also names `0bddbb43` (ABC-172, the package rename), which does not touch the `bin`.

## The build target
- `tsconfig.build.json` has `files: ["src/uci.ts"]`, `include: []`, `outDir: "dist"` and `rootDir: "src"`.
- `.gitignore` line 2 is `dist/`. `git ls-tree -r main dist` lists 0 files.
- `src/uci.ts` line 1 is `#!/usr/bin/env node`.

## The ADR-0007 falsifiers
- `D1`: the Context row 1 `find` (excluding `node_modules`, `.git` and `coverage`) finds 0 files. Tracked YAML files: 0. `.github/` holds only `copilot-instructions.md`.
- `D2`: the "exposes an executable" leg FIRED (`bin`). The "publishable" leg did not: `private` is `true`, and there is no `main`, `exports` or `files` key.
- `D3`: `git remote -v` prints 0 lines.
- `D4`: `plans/releases/` holds only `.gitkeep`.
- Config at `main`: `default_stack.deploy` is `none-local-only`, `environments` is `["local"]`, and `production_requires_human_confirmation` is `true` (so `D7` does not fire).

## Prior records that agree
- Release Manager `…eb1d1cdf` measured the same `bin` drift at `e0e5f987`. Security/NFR `…a8796ea3` and `…7d7b76ec` measured it at `6ccbcc3e`. AR-1 now reads it as check 3 (`…edd18e94`).
- `ADR-0044` D8 (accepted by the owner on 2026-10-18, `…c3e81a57`) designed the `bin`. It says: "This stays inside `ADR-0007` and `ADR-0018`. It is local and built from a clone, and nothing is published."
- `ADR-0018`'s falsifier table carries the same `D2` row under the same id. Its Context row 2 and its Decision 1 still say "no `bin`". `70-runbook.md` § Deploy says "Nothing is published, built or deployed". These files were not edited. They are out of this hop's fence.
