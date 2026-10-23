---
id: 20261023T185614Z-architect-design-observation-a6addc0d
kind: observation
by: architect-design
at: 2026-10-23T18:56:14Z
verified_by: 
confidence: high (read-only readings on main 7fa33c0c)
refs:
  - arch-adr0018-bin-note
  - ADR-0018
  - memory-bank/50-decisions/ADR-0018-distribution-channel-git-clone-npm-run-chess.md
  - memory-bank/70-runbook.md
  - ABC-168
  - 7fa33c0c
  - 825b21d1
  - 513c0211
  - e1403550
  - ADR-0044
  - ADR-0007
  - AR-1
  - 20261023T185236Z-orchestrator-decision-366ebd9e
  - 20261023T105540Z-architect-design-decision-0f003634
  - 20261023T105540Z-architect-design-observation-97e856c3
  - 20261022T174056Z-release-manager-decision-edd18e94
supersedes: 
seal: sha256:5ab4af1024eeb3fe89a10ae47dd7cc64101026e8efc8fc61f36d5ca0d7b14022
---

# ADR-0018 bin note: the facts, read on `main` `7fa33c0c`. `D2`'s "exposes an executable" leg fired at `513c0211`; the channel and `D1`, `D3`, `D4`, `D7` hold

These are read-only readings. They come from `git show main:<path>`, `git log main` and a filesystem scan of the worktree `../wt-arch-adr0018-bin-note`, checked out at `main` `7fa33c0c`. Nothing was built, installed or run. They re-verify the facts of `ADR-0007`'s note (`…97e856c3`, read at `2d962400`); none has moved.

## `package.json` and the `bin`
- `jq -c '[.private, .bin, has("main"), has("exports"), has("files")]'` prints `[true,{"skytalix":"dist/uci.js"},false,false,false]`. `version` is `0.0.0`, `engines.node` is `>=22`, and there is no `dependencies` key.
- `git log main -S'"skytalix": "dist/uci.js"' -- package.json` names one commit: `825b21d1` (2026-10-21, ABC-168). `git merge-base --is-ancestor 825b21d1 513c0211` holds, and `513c0211` (2026-10-22, "merge(ABC-168) …") is the first-parent merge.
- `git log main -G'"bin"'` and `-G'dist/uci.js'` on `package.json` name only `825b21d1`. The value has not changed since.

## The channel (ADR-0018 Decision 1)
- `scripts.chess` is `node src/cli.ts`. `git log main -G'"chess"' -- package.json` names only `e1403550` (ABC-042). The terminal game needs no build step.
- `scripts.build` is `tsc -p tsconfig.build.json` (`files: ["src/uci.ts"]`, `include: []`, `outDir: "dist"`, `rootDir: "src"`). `scripts.uci` is `node src/uci.ts`. There is no `start` script.
- `.gitignore` line 2 is `dist/`. `git ls-tree -r main` lists 0 files under `dist/`. `src/uci.ts` line 1 is `#!/usr/bin/env node`.

## The ADR-0018 falsifiers
- `D1`: the Context row 1 `find` (excluding `node_modules`, `.git`, `coverage`) finds 0 files, and `git ls-files '*.yml' '*.yaml'` lists 0. `.github/` holds only `copilot-instructions.md`.
- `D2`: the "exposes an executable" leg FIRED (`bin`). The "publishable" leg did not: `private` is `true`, and there is no `main`, `exports` or `files` key.
- `D3`: `git remote -v` prints 0 lines.
- `D4`: `plans/releases/` holds only `.gitkeep`.
- `D7`: `production_requires_human_confirmation` is `true` (config line 77). `default_stack.deploy` is `none-local-only` and `environments` is `["local"]`.
- `D6` was not re-read. A `bin` does not touch it.

## Wording in ADR-0018 that this fact makes out of date (left as dated history)
- Context row 2 ("no `bin`, `main`, `exports` or `files`"), row 5 ("emits nothing; no `dist/`"), row 7 ("no emit step"), Decision 1 ("no `dist/` is emitted, no `bin` is added") and the chosen row of the Alternatives table.

## Prior records that agree
- `ADR-0044` D8 (owner-accepted 2026-10-18, `…c3e81a57`) designed the `bin` and says: "This stays inside `ADR-0007` and `ADR-0018`. It is local and built from a clone, and nothing is published." It puts `npm publish` and install from a git URL out of v1.
- `ADR-0007` § Note 2026-10-23 (`…0f003634`) recorded the same `D2` firing and named this file and `70-runbook.md` § Deploy as follow-ups.
