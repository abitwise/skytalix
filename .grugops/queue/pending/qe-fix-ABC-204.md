---
subtask: qe-fix-ABC-204
role: qe-e2e
ticket: plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
ref: .grugops/context/qe-fix-ABC-204/
branch: new grugops/qe-fix-ABC-204 from grugops/se-fix-ABC-204 (64f29cdd), worktree ../wt-qe-fix-ABC-204
width: 3 of 3 (beside ticket-to-pr-ABC-216/217; no readings, no engine games)
---

# QE short re-check: ABC-204 fix (QE-204-b, QE-204-a)

## Do
- Read SE `se-fix-ABC-204/…86f9bb11`, `…39d453b2` and Orchestrator `qe-ABC-204/…f9d109ea`.
- Independently: the per-file `dist/` manifest separates two different builds and matches for identical ones (re-use the SE's scratch builds or your own); the symlinked out dir is refused and real outside dirs are not; game play code paths unchanged vs `16c51d1c` (diff read).
- Add a dated line to the page's `## Reading` / QE addendum: the readings ran with `rating.ts` `d4b16e20…`; the merged harness is `rating.ts` `d6b2a988…` + `dist-manifest.ts` `78b1528e…`; the readings stand (recording-only change).
- Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips. Verdict PASS / PASS_WITH_GAPS / FAIL.

## Fences
- Only your worktree and `<scratchpad>/qe204fix/`. No `src/`/`tools/` edits. No engine games or readings. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task qe-fix-ABC-204). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
