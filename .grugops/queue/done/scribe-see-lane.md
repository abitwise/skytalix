---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T02:44:26Z
subtask: scribe-see-lane
role: agents-md-scribe
ref: .grugops/context/scribe-see-lane/
branch: new grugops/scribe-see-lane from main — worktree .claude/worktrees/scribe-see-lane
width: one verification run of the new lane line, under `flock <scratch>/host-test.lock <cmd>`. Host paths only as placeholders.
---
# AGENTS.md: lane line for the src/see.test.ts deep rows (QE-279-g) and the tools/tune lane
Add to AGENTS.md's lanes: `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/see.test.ts` (ABC-279 A3/A4 rows, ~55 s), and the tools/tune lane `TUNE_DEEP=1 … vitest run tools/tune` (ABC-280 A4) if AGENTS.md lacks it — spell each exactly as the repo's existing lane lines do (check the heap-guard rows for a one-file run). Verify each line runs green once under the lock. Respect AGENTS.md's size budget (it was 18 404 / 18 432 B — if a line won't fit, compress elsewhere without losing a rule, and say what).
## Fences
AGENTS.md and your records. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task scribe-see-lane, contextRoot = worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.

## Result
Done. `AGENTS.md` § Test gained two deep-lane lines after the Taper line: SEE (`SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/see.test.ts`, ABC-279, ~55 s) and tune (`TUNE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/tune/tune.test.ts`, ABC-280). The tune line uses the one-file path, not the brief's `tools/tune`: `src/cli.test.ts` ABC-173 A3 reads a directory arg as a suite and reds the 400 flag (seen; the same run is one file, 17 tests).
Size 18 404 -> 18 429 B (budget 18 432); 238 B added, 213 B cut from prose (Dev/run pointer, Test intro, skip-count history clause, ADR-0045 history, two small phrases); no rule lost; `-->` closers 10 = 10.
Verified under `flock`: see.test.ts 52/52, exit 0, 54.2 s; tune.test.ts 17/17, exit 0, 9.0 s; cli/history/status-panel/render tests 185/185, exit 0. Note `…84555fb2` (scribe-see-lane).
