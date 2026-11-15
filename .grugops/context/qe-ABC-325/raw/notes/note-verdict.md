# qe-ABC-325 verdict: **PASS_WITH_GAPS. The v1.1.1 candidate on `grugops/ABC-325` (2aac1bfe) is releasable.** G-QE-324-1/2/3 are closed with no figure changed. The version is 1.1.1 in package.json and the lock root only, and both `--version` print `skytalix 1.1.1`. The CHANGELOG `[1.1.1] - 2026-11-15` is in Keep a Changelog form with correct links, and PATCH is right. All gates are green. One Low gap (a stale doc example in VERSIONING.md), no product finding, nothing blocking

QE/E2E, task `qe-ABC-325`, branch `grugops/qe-ABC-325` from `grugops/ABC-325` `2aac1bfe`, 2026-11-15. The evidence is the observation sealed just before this note (`raw/notes/note-observation.md`). No game and no engine match. No tag, no `src/` edit, and QE fixed nothing. Merge, tag and release stay with the Orchestrator and the owner.

## Checks (the brief's four lines)
1. **Gaps closed: MET.**
   - G-QE-324-1: Strength opens "One measured figure at 100 ms a move".
   - G-QE-324-2: one caveat in Levels covers every measured level.
   - G-QE-324-3: the assumed 10–14 a point, 50–70 at 5 %, is stated where it is added back, and +73–79 is called "derived, not measured".
   - No figure changed: no number token of `main`'s sections is lost, every added token restates an existing figure, and the table rows are identical.
   - Every figure re-derives: 72.7–78.7 → +73–79, 124.5–134.5 → +125–135, and L6/L7 outward ~2470–2580 / ~2540–2740.
   - "see below" (once) sits in the paragraph directly before the level-5 Stockfish paragraph.
   - The caveat appears once.
   - markdown-it-py finds no list, code or blockquote token. The wrapped `+125` and `5 %.` line starts are not list markers.
2. **Version: MET.**
   - package.json and the lock's root and `packages[""]` read 1.1.1, with nothing else in the lock changed. The remaining 1.1.0 strings are `@standard-schema/spec`.
   - The README example reads 1.1.1.
   - The `src/version-file.ts` change is comment-only: identical TypeScript code tokens, 66 against 66.
   - No other live 1.1.0 pin remains.
   - `node src/cli.ts --version` and, after the build, `bin/skytalix-uci --version` both print `skytalix 1.1.1`.
3. **CHANGELOG: MET.**
   - An empty `[Unreleased]` sits above `[1.1.1] - 2026-11-15`.
   - The links are `compare/v1.1.1...HEAD` and `releases/tag/v1.1.1`. `[1.1.0]` and older are byte-identical to `main`.
   - The body is `main`'s `[Unreleased]` (merged ABC-324) verbatim, plus the one wording-fix bullet, in `[1.1.0]`'s shape.
   - PATCH is right per VERSIONING.md: docs only, and the `src/` diff is a comment.
4. **Art: matches (info).** `sed -n '8,13p' README.md` equals `assets/readme-art.txt`, `cmp` exit 0, on the branch and on `main`. ABC-319's fixed-line recipe is stale since the logo block. That is not this ticket's gap.

- **Gates (each alone under the host lock):**
  - biome: exit 0, 150 files.
  - tsc: exit 0.
  - vitest (`NODE_OPTIONS=--max-old-space-size=128`, `VITEST_MAX_WORKERS=1`): 72 files, 2740 passed, 0 failed, 0 skipped.
  - build: exit 0.
  - records-path-check: clean.

## Gaps, by severity
- **Blocking: none. Medium: none.**
- **Low, G-QE-325-1 (a stale version example in VERSIONING.md).**
  - VERSIONING.md line 18 reads "`npm run chess -- --version` and `bin/skytalix-uci --version` print it, for example `skytalix 1.0.0`."
  - This is the same class of stale example that this ticket fixed in `src/version-file.ts` (made `X.Y.Z`). It is now two releases behind.
  - It is written as an example, so it is not a pin, and it misleads no one about behaviour. A docs hop could make it version-neutral or drop it. The Orchestrator may waive it.
- **Info:**
  - "The bottom is below the about +73 to +79 a doubling under 1 s" reads awkwardly ("the about"). v1.1.0's README had the same "the about +73 to +79", so it is precedent.
  - "How each level's time per move moves Stockfish's strength" repeats "move". The wording is inherited.
  - Strength's opening "at 100 ms a move" and its later "Each side had 100 ms a move." now say the time twice. This is harmless.
  - The CHANGELOG `[1.1.1]` lead paragraph keeps its own L5-vs-L4 "was not measured" clause. That is release-note text, consistent with the README, and the README itself says it once.
  - **Waiver:** AGENTS.md's reference command lists `src/version-file.ts`. It is not empty, so by its letter the zero-production-lines waiver does not apply, comment or not. UAT is then signed on this verdict per the 2026-10-22 ruling (PASS_WITH_GAPS with no blocking gap). That is the Orchestrator's to record.
  - **Records hygiene, pre-existing on `main`:** `.grugops/queue/pending/qe-ABC-324.md` is still in `pending/` although `done/qe-ABC-324.md` exists. `pending/qe-ABC-325.md` will likewise stay on `main` beside this branch's `done/` copy. Both are the Orchestrator's to tidy.
  - The L1 `1499 ± 53` tie-rounding question from qe-ABC-324 is still **UNKNOWN - verify**. It is outside this diff.

## Result
- **QE: PASS_WITH_GAPS.** No product finding, and no test fails. No test was added: this is a docs and version ticket, `--version` is already covered by the suite and was run on both entry points, and no test pins README or CHANGELOG text.
- G-QE-325-1 is advisory. It needs no re-run and does not hold the v1.1.1 tag.
- Board move: In Review to Ready for UAT, signed per 2026-10-22 on this verdict. The column, the merge and the tag are the Orchestrator's.

## Fences held
- No game and no engine match. No `src/`, README, CHANGELOG, package or VERSIONING edit.
- No tag. No push, force, amend, rebase or merge.
- No host path in the committed files. Scratch paths are written `<scratch>`.
