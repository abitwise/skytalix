---
id: 20261111T081519Z-software-engineer-observation-dcf277c7
kind: observation
by: software-engineer
at: 2026-11-11T08:15:19Z
verified_by: 
confidence: high: every gate run after the last edit, alone under the host lock; the diff is the commit's own
refs:
  - se-ABC-319
  - ABC-319
  - grugops/ABC-319
  - f42537b2
  - 20261111T081302Z-orchestrator-decision-54f06923
  - VERSIONING.md
  - CHANGELOG.md
  - README.md
  - package.json
  - package-lock.json
  - src/levels.test.ts
supersedes: 
seal: sha256:edd70b973c2bc4edae0a2a3808a452c72ef597e06becb8c2db868365d8e6ee2d
---

Software Engineer, task `se-ABC-319`, branch `grugops/ABC-319`, commit `f42537b2` on base `a3129d31`. Release v1.1.0 per the cut note `…54f06923`. No tag created.

Diff (5 files): package.json and package-lock.json (root `version` and `packages[""].version`, via `npm version 1.1.0 --no-git-tag-version`), CHANGELOG.md, README.md (two lines), src/levels.test.ts (two text lines, no assertion change).

- **D1.** Version is 1.1.0. README example reads `skytalix 1.1.0`. No test or source hard-codes the version: the only `1.0.0` left in src/ is the `src/version-file.ts` line 2 doc comment, an ABC-315 example (history, out of width; not changed). CHANGELOG 1.0.0 entry keeps its own `skytalix 1.0.0` as history.
- **D2.** `## [Unreleased]` (empty) above `## [1.1.0] - 2026-11-11`. Entry: the measured L1-L4 figures (1499 ± 53 at UCI_Elo 1320, 1678 ± 49 at 1720, 1909 ± 48 at 1890, 2094 ± 48 at 2040; Stockfish 19, UCI_LimitStrength, 200 games each, both sides at the level's time), the scale caveat, and the two existing Changed bullets kept as written. No projected figure. Links: `[Unreleased]` compare/v1.1.0...HEAD; `[1.1.0]` releases/tag/v1.1.0.
- **D3.** README L6 cell `~2310–2420, projected`. levels.test.ts line 395 comment and line 404 test name: "3 s" -> "4 s".

D4 gates, each alone under the host lock, after the last edit (load 0.32 at start):

| gate | result |
|---|---|
| lint | exit 0, 150 files, no fixes |
| typecheck | exit 0 |
| `VITEST_MAX_WORKERS=1 npm test` | exit 0, 72 files, 2740 / 2740 passed, 0 skipped, 17.05 s |
| build | exit 0 |
| art cmp | exit 0 |
| `npm run chess -- --version` | `skytalix 1.1.0`, exit 0 |
| `bin/skytalix-uci --version` (after build) | `skytalix 1.1.0`, exit 0 |
| records-path-check --base main | clean, exit 0 |

Not checked: deep lanes (no behaviour change; text-only test edit). The tag is the orchestrator's after QE.
