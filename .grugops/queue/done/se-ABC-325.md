---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-15T20:01:00Z
subtask: se-ABC-325
role: software-engineer
ref: .grugops/context/se-ABC-325/
branch: new grugops/ABC-325 from main
width: README wording gaps, one doc comment, and the v1.1.1 PATCH bump. No behaviour change. Do NOT tag.
---
# ABC-325: close G-QE-324-1/2/3 and prepare v1.1.1
Read the cut note `.grugops/context/orch-2026-10-30a/notes/20261115T200030Z-orchestrator-decision-a12ff347.md`, QE's verdict `.grugops/context/qe-ABC-324/raw/notes/note-verdict.md` (the three Low gaps), and ABC-319's briefs (`.grugops/queue/done/se-ABC-319.md`, `qe-ABC-319.md`) as the model for a release bump. Follow VERSIONING.md.
1. **G-QE-324-1:** README § Strength opens "One measured figure, on one scale: X = 1902.5 ± 49.1." It now also cites level 5's 2413 ± 51. Reword the opening so it is true (e.g. it is the one measured figure at 100 ms a move), keeping every number.
2. **G-QE-324-2:** restore a caveat covering every measured level: Stockfish had each level's own time per move, and how that moves its strength at a given `UCI_Elo` was not measured. Keep the level-5-vs-4 paragraph (the projection paragraph's "see below" must still point at it). Say it once; no duplicate sentences.
3. **G-QE-324-3:** in the L6/L7 projection paragraph, state level 4's blunder cost (about 50 to 70, i.e. 10 to 14 Elo per percentage point at 5 %, as the v1.1.0 README said) where it is added back, and do not call the +73 to +79 per doubling under 1 s "measured" (it is derived from measured 1902.5 and level 4 with that assumed cost). Change no figure.
4. `src/version-file.ts` doc comment example `skytalix 1.0.0`: make it version-neutral or current, per what ABC-319 did elsewhere (comment only).
5. **v1.1.1 (PATCH):** package.json and package-lock.json version 1.1.1; CHANGELOG `[Unreleased]` becomes `## [1.1.1] - <today, UTC>` with a fresh empty `[Unreleased]` above and the compare links at the bottom updated like 1.1.0's; add a short line for the README wording fixes if VERSIONING/CHANGELOG style calls for it; update any test or snapshot that pins the version string (as ABC-319 did).
Gates under `flock <scratch>/host-test.lock`: `npx biome check .`, `npx tsc --noEmit`, `NODE_OPTIONS=--max-old-space-size=128 npx vitest run`, the build if ABC-319 ran it, and `--version` printing `skytalix 1.1.1` on both entry points. records-path-check `--base main` before each commit. Result block here; brief and claim to done. Do NOT create a tag. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".

## Result
Done, 2026-11-15T20:10Z. Work commit `e3db946e` on `grugops/ABC-325` (base `79fa5cb1`); no tag. Files: package.json, package-lock.json (root and `packages[""]` version only), CHANGELOG.md, README.md, src/version-file.ts (line 2 comment, `skytalix 1.0.0` to version-neutral `skytalix X.Y.Z`). G-QE-324-1/2/3 closed as wording only, no figure changed; README `--version` example to 1.1.1; no test or snapshot pins the version. CHANGELOG: empty Unreleased above `## [1.1.1] - 2026-11-15`, one README-wording bullet added, links updated. Gates, each alone under the host lock: lint 0 (150 files), typecheck 0, unit 72 files 2740/2740, 0 skipped, build 0, both `--version` print `skytalix 1.1.1`. Art cmp (ABC-319's command) exits 1 on this branch and on main alike: the README no longer opens with the art block since the logo commits, so it is pre-existing and this diff does not touch the README head. records-path-check clean. Note `20261115T201006Z-software-engineer-observation-f0ccbb42`.
