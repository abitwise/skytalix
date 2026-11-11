---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-11T08:13:02Z
subtask: se-ABC-319
role: software-engineer
ref: .grugops/context/se-ABC-319/
branch: grugops/ABC-319 (already created from main; commit there)
width: package.json, package-lock.json, CHANGELOG.md, README.md (version line and L6 cell), src/levels.test.ts text only, plus your notes. No other src/, ADR, catalog or board.
---
# ABC-319: release v1.1.0
Read `VERSIONING.md` and the cut note `.grugops/context/orch-2026-10-30a/notes/20261111T081302Z-orchestrator-decision-54f06923.md`. D1–D4 are yours.
1. **D1:** bump the version to 1.1.0 in package.json and package-lock.json. Do not create a tag. Change README's `--version` example to 1.1.0. Check that no test or source hard-codes 1.0.0 except as history.
2. **D2:** turn CHANGELOG's Unreleased into `## [1.1.0] - 2026-11-11`, with an empty Unreleased above it. Write the entry exactly as D2 says: measured figures only, no projections. Then the link definitions.
3. **D3:** set the README L6 cell to `~2310–2420, projected`. In `src/levels.test.ts`, change the stale "3 s" text at lines 395 and 404 to the current fact, as text only.
4. **D4 gates,** each alone under the host lock:
   - lint;
   - typecheck;
   - `VITEST_MAX_WORKERS=1 npm test`;
   - build;
   - the art cmp;
   - `npm run chess -- --version` and `bin/skytalix-uci --version` after the build: paste both outputs.
Every run goes as `flock <scratch>/host-test.lock <cmd>` (the real path is in your dispatch prompt only). Publish one sealed observation note (`at` from `date -u`). Add a `## Result` block to this brief. Run `node tools/grugops/records-path-check.js --base main` before committing. No push, tag, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".

## Result
Done, 2026-11-11T08:15Z. Commit `f42537b2` on `grugops/ABC-319` (base `a3129d31`); no tag. Files: package.json, package-lock.json, CHANGELOG.md, README.md, src/levels.test.ts. D1–D3 as briefed. D4, each alone under the host lock: lint 0 (150 files), typecheck 0, unit 72 files 2740/2740, 0 skipped, build 0, art cmp 0, both `--version` print `skytalix 1.1.0`. records-path-check clean. Note `20261111T081519Z-software-engineer-observation-dcf277c7`. Flag: `src/version-file.ts` line 2 doc comment still shows `skytalix 1.0.0` as an example (out of width, left).
