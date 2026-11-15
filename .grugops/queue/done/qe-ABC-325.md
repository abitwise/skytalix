---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-15T20:20:00Z
subtask: qe-ABC-325
role: qe-e2e
ref: .grugops/context/qe-ABC-325/
branch: new grugops/qe-ABC-325 from grugops/ABC-325 (tip 2aac1bfe)
width: check the v1.1.1 release candidate. No game, no engine match. Do not tag.
---
# ABC-325: QE check of v1.1.1
Model: `.grugops/queue/done/qe-ABC-319.md` (v1.1.0's check). Check `git diff main...grugops/ABC-325`:
1. **Gaps closed:** G-QE-324-1/2/3 (QE's own `.grugops/context/qe-ABC-324/raw/notes/note-verdict.md`) are closed, no figure changed, every figure re-derives, "see below" still points at the level-5 Stockfish paragraph, the caveat appears once, markdown renders clean (no accidental list item from a wrapped `+NN`).
2. **Version:** package.json and package-lock.json (root and `packages[""]` only) 1.1.1; README `--version` example; `src/version-file.ts` change is comment-only; no other live 1.1.0 pin. `--version` prints `skytalix 1.1.1` from `node src/cli.ts` and from `bin/skytalix-uci` after the build.
3. **CHANGELOG:** `[1.1.1] - 2026-11-15` with an empty `[Unreleased]` above, Keep a Changelog form as 1.1.0, links `compare/v1.1.1...HEAD` and `releases/tag/v1.1.1`; the entry matches the merged ABC-324 content plus the wording-fix line; PATCH is right per VERSIONING.md (no behaviour change: `src/` diff is comment-only).
4. **Art:** the old art cmp compared fixed README lines that moved when the owner added the logo. Compare `sed -n '8,13p' README.md` with `assets/readme-art.txt` (the orchestrator saw it match on main) and report; the stale recipe is info, not a gap of this ticket.
Gates under `flock <scratch>/host-test.lock`: biome, tsc, `NODE_OPTIONS=--max-old-space-size=128 VITEST_MAX_WORKERS=1 npx vitest run`, the build. Commit observation and verdict bodies under `raw/notes/` with `raw/spec.json`; a `## QE` block here; brief and claim to done. Fix nothing; no tag; no push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".

## QE
by: qe-e2e (claude-opus-5-5), at: 2026-11-15T20:16:26Z. Branch `grugops/qe-ABC-325` from `grugops/ABC-325` `2aac1bfe` (SE work commit `e3db946e`).

**Verdict: PASS_WITH_GAPS.** All four checks are MET. One Low gap, advisory; no product finding; nothing blocks the v1.1.1 tag.
- **Gaps closed: MET.** G-QE-324-1 (Strength opens "One measured figure at 100 ms a move"), G-QE-324-2 (one caveat in Levels covers every measured level; "was not measured" once), G-QE-324-3 (the assumed 10–14 a point / 50–70 at 5 % is stated, and +73–79 is "derived, not measured"). No figure changed: no `main` number token is lost and the table rows are identical. Re-derived: 72.7–78.7 → +73–79, 124.5–134.5 → +125–135, L6/L7 unchanged. "see below" points at the level-5 Stockfish paragraph. markdown-it-py: no list, code or blockquote token, and the wrapped `+125` and `5 %.` starts are safe.
- **Version: MET.** package.json and the lock's root and `packages[""]` read 1.1.1, and nothing else in the lock changed. The README example reads 1.1.1. `src/version-file.ts` is comment-only (TypeScript code tokens identical, 66/66). No other live 1.1.0 pin. `node src/cli.ts --version` and `bin/skytalix-uci --version` (after the build) both print `skytalix 1.1.1`.
- **CHANGELOG: MET.** An empty `[Unreleased]` sits above `[1.1.1] - 2026-11-15`. The links are `compare/v1.1.1...HEAD` and `releases/tag/v1.1.1`. The body is `main`'s merged ABC-324 `[Unreleased]` verbatim plus the one wording-fix bullet, in `[1.1.0]`'s shape. PATCH is right per VERSIONING.md.
- **Art: matches.** `sed -n '8,13p' README.md` equals `assets/readme-art.txt` (`cmp` exit 0) on the branch and on `main`. The old fixed-line recipe is stale (info).
- **Gates (each alone under the host lock):** biome exit 0 (150 files); tsc exit 0; vitest (128 MB heap, 1 worker) 72 files, 2740/2740, 0 skipped; build exit 0; records-path-check clean.
- **Gaps:** **Low G-QE-325-1:** VERSIONING.md line 18 still gives `skytalix 1.0.0` as its `--version` example, the same class this ticket fixed in `src/version-file.ts`. Info items are in the verdict, among them: the waiver reference command lists `src/version-file.ts`, so by its letter the zero-production-lines waiver does not apply and UAT is signed on this verdict per 2026-10-22; `pending/qe-ABC-324.md` (and soon `pending/qe-ABC-325.md`) linger on `main`.
- **Note bodies:**
  - `.grugops/context/qe-ABC-325/raw/notes/note-observation.md` (sha256 `402de94b15d83cb31084a424b15eee1d852076c155dc2ae1b6f781b4c64ad3b3`);
  - `.grugops/context/qe-ABC-325/raw/notes/note-verdict.md` (sha256 `61c225685a84fe8f60be222c1b0783eb5d67dc9d9007ea20da49fe4b20c4d733`);
  - `raw/spec.json`, plus the check scripts in `raw/scripts/`.
- No `src/` edit and no tag. Nothing pushed or merged. The board column, the merge and the tag are the Orchestrator's.
