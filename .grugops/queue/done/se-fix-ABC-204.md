---
subtask: se-fix-ABC-204
role: software-engineer
ticket: plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
ref: .grugops/context/se-fix-ABC-204/
branch: new grugops/se-fix-ABC-204 from grugops/qe-ABC-204 (16c51d1c), worktree ../wt-se-fix-ABC-204
width: 1 of 3 (beside ticket-to-pr-ABC-216, ticket-to-pr-ABC-217; no readings)
---

# ABC-204 fix: QE-204-b (MEDIUM, required) + QE-204-a (LOW)

## Do
- Read QE `qe-ABC-204/…b5f4d5a1` (findings) and Orchestrator `qe-ABC-204/…f9d109ea` (on main).
- **QE-204-b:** `artifacts.txt` must identify the whole engine under test: a per-file sha256 manifest of `dist/` (sorted, relative paths) plus one hash over it, for each side. Show that `8ccba739` and `3497aad2` builds now print different hashes, and identical builds print equal ones.
- **QE-204-a:** the out-dir guard refuses an out dir that is (or resolves through) a symlink into the checkout. Probe it red at base, green at head.
- Edits only under `tools/rating/` (and its own non-lane tests if the page has any); no `src/`. Do NOT play games or run any reading; a smoke of the harness's file-writing path without cutechess games is fine if the tool supports it.
- Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips. Note the `npm test` Duration.

## Fences
- Only your worktree and `<scratchpad>/se204fix/`. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task se-fix-ABC-204). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

- **Done, on `grugops/se-fix-ABC-204`** (from `grugops/qe-ABC-204` `16c51d1c`): fix `2c8a84f2`, notes `64f29cdd`, tip `64f29cdd`. Not pushed, not merged.
- **QE-204-b fixed.** `artifacts.txt` now records each side's whole `dist/`: a header line `<name> <sha> dist/ (<n> files) tree sha256 <tree>`, then the sorted per-file manifest (`<sha256>  ./<path>`), then the `uci` lines. The tree hash is the sha256 of the manifest lines, in QE's by-hand format. The code is in a new `tools/rating/dist-manifest.ts`, imported by `rating.ts`.
  - **The hash tells the builds apart:** `8ccba739` gives `3798b8d1…`. Two separate `3497aad2` builds both give `726e5225…`, 22 files each. Both values equal QE's by-hand manifests and the shell pipeline. The old `dist/uci.js` hash was `877e9595…` for all three builds.
- **QE-204-a fixed.** After `mkdirSync`, the guard runs `realpathSync(out)` before any write.
  - **Probe:** red at base (a symlinked out dir into the checkout let `host.log` be written inside it; killed); green at head (refused, nothing written).
  - No over-refusal: an outside directory and a symlink to one both reach "not empty".
- **Gates:** lint, typecheck and build 0; `npm test` 62 files, 2073/2073, `last-run.json` success, 0 pending, 0 todo, **Duration 9.55 s**; skips 0, `No findings.` No `src/` change, no test file added, no games, no readings.
- **Owed:** QE short re-check (no readings). Orchestrator: merge into the ABC-204 line. The page's harness sha256 (`d4b16e20…`) is the readings' `rating.ts`; it is now `d6b2a988…`, and `dist-manifest.ts` is `78b1528e…`.
- **Notes:** decision `se-fix-ABC-204/…86f9bb11`, observation `se-fix-ABC-204/…39d453b2`.

**Trace row** (for the Orchestrator):

| ABC-204 (se-fix-ABC-204) | QE-204-b and QE-204-a fixed: artifacts.txt records the whole dist/ (sorted per-file sha256 manifest + tree hash); the out-dir guard resolves the leaf after mkdirSync | EPIC-008 (ahead of ABC-205's D reading) | tools/rating/rating.ts (artifact record and guard), new tools/rating/dist-manifest.ts | NFR-008 untouched (62 files = base); no play change | grugops/se-fix-ABC-204 @ 64f29cdd (fix 2c8a84f2)<br>.grugops/context/se-fix-ABC-204/notes/ (2) | lint/typecheck/build 0; npm test 62/2073 success, 9.55 s; skips 0 No findings.; hash proof 8ccba739 3798b8d1… v 3497aad2 726e5225… (×2 equal); symlink probe red → green | waiver still applies (0 production lines) | QE short re-check (no readings); Orchestrator merge; page harness sha256 line | In Review (fix loop) → QE re-check |
