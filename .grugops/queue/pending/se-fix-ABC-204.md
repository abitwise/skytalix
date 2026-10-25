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
