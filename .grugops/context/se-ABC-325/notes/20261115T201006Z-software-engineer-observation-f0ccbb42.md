---
id: 20261115T201006Z-software-engineer-observation-f0ccbb42
kind: observation
by: software-engineer
at: 2026-11-15T20:10:06Z
verified_by: 
confidence: high: every gate run after the last edit, alone under the host lock; the diff is the commit's own
refs:
  - se-ABC-325
  - ABC-325
  - grugops/ABC-325
  - e3db946e
  - 20261115T200030Z-orchestrator-decision-a12ff347
  - G-QE-324-1
  - G-QE-324-2
  - G-QE-324-3
  - VERSIONING.md
  - CHANGELOG.md
  - README.md
  - package.json
  - package-lock.json
  - src/version-file.ts
supersedes: 
seal: sha256:cf633dfe1c75842ccfcea1d676155fe8d8b0bdfe6477553919a65c6a6b026a63
---

Software Engineer, task `se-ABC-325`, branch `grugops/ABC-325`, work commit `e3db946e` on base `79fa5cb1`. v1.1.1 (PATCH) per the cut note `…a12ff347`, modelled on ABC-319. No tag created. No behaviour change.

Diff (5 files): package.json and package-lock.json (root `version` and `packages[""].version` only, 1.1.0 to 1.1.1; the dependency at lock line 1070 that also reads 1.1.0 is untouched), CHANGELOG.md, README.md, src/version-file.ts (line 2 doc comment only).

- **G-QE-324-1.** Strength opening now reads "One measured figure at 100 ms a move, on one scale: X = 1902.5 ± 49.1." Paragraph re-wrapped; every number kept.
- **G-QE-324-2.** The Levels measured paragraph now ends "Both sides had the level's own time per move, and the level's blunder rate was on. How each level's time per move moves Stockfish's strength at a given `UCI_Elo` was not measured." The level-5-vs-4 paragraph is kept but its now-duplicate "was not measured" sentence is folded: "Stockfish had 4 s a move against level 5 and 1 s against level 4, so part of the step from level 4 may be Stockfish's." "see below" still points at it.
- **G-QE-324-3.** Projection paragraph: "...about +125 to +135 a doubling once level 4's blunder cost is added back. That cost is assumed, not measured: about 10 to 14 Elo for each percentage point of blunder rate, so 50 to 70 at level 4's 5 %. The bottom is below the about +73 to +79 a doubling under 1 s, in case part of the step from level 4 to level 5 was Stockfish's (see below). That rate is derived, not measured: from the Strength section's measured 1902.5 at 0.1 s and level 4 at 1 s, with the same cost added back." No figure changed; re-derived: (2094+50..70 − 1902.5)/log2(10) = 72.7..78.7; (2413 − 2144..2164)/2 = 124.5..134.5.
- **Doc comment.** `src/version-file.ts` line 2 `skytalix 1.0.0` became `skytalix X.Y.Z` (version-neutral, so it does not go stale again).
- **Version pins.** README `--version` example 1.1.0 to 1.1.1. No test or snapshot pins the version string (git grep for 1.1.0 outside history found only README line 61 and the package files).
- **CHANGELOG.** Empty `[Unreleased]` above `## [1.1.1] - 2026-11-15` (the former Unreleased content, plus one Changed bullet for the README wording). Links: `[Unreleased]` compare/v1.1.1...HEAD; `[1.1.1]` releases/tag/v1.1.1.

Gates, each alone under the host lock (`<scratch>/host-test.lock`), after the last edit:

| gate | result |
|---|---|
| `npx biome check .` | exit 0, 150 files, no fixes |
| `npx tsc --noEmit` | exit 0 |
| `NODE_OPTIONS=--max-old-space-size=128 VITEST_MAX_WORKERS=1 npx vitest run` | exit 0, 72 files, 2740 / 2740 passed, 0 skipped |
| `npx tsc -p tsconfig.build.json` (build) | exit 0 |
| `node src/cli.ts --version` | `skytalix 1.1.1`, exit 0 |
| `bin/skytalix-uci --version` (after build) | `skytalix 1.1.1`, exit 0 |
| art cmp (ABC-319's command) | exit 1 on this branch AND on main: README no longer opens with the art block since the owner's logo commits; pre-existing, not this diff, which does not touch the README head |
| records-path-check --base main | clean, before each commit |

Not checked: deep lanes (no behaviour change). The art cmp is obsolete as written; QE should not count its exit 1 against this diff. The tag is the orchestrator's after QE.
