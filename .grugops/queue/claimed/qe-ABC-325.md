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
