---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T12:43:29Z
subtask: se-ABC-303-rows
role: software-engineer
ref: .grugops/context/se-ABC-303-rows/
branch: existing grugops/ABC-303 — worktree .claude/worktrees/se-ABC-303
width: src/engine.test.ts and src/uci-session.test.ts only, plus your records. No game, no graded timing.
---
# Apply the Architect's row list
Read Architect decision …0f8a4f82 (§ 5) and arch-ABC-303-w1-rows's ## Result, and the Orchestrator's latest decision note.
1. Merge main into grugops/ABC-303 with `git merge`. No rewrite.
2. Apply E1, E2, E3, E4, U1, U2 exactly, one dated ABC-303 comment per edit. Leave alone what the list says to leave. Add the A3 (a) line for the PR, 90.91 %, 96 cp, 0 changes, per test note 4.
3. If this file's A10 title reads "three searches", correct it to four, per ABC-221's page. Title only.
4. Run npm test, ENGINE_DEEP and SEARCH_DEEP engine, ENGINE_DEEP uci-session, typecheck, lint, each under the lock, one at a time. Report the list's `UNKNOWN - verify` items as read: E1 at budget 5, the door on virtualClock(1), softMs: 1 on the tip, D5's full output.
STOP, nothing adjusted, on the list's STOP conditions: a door figure red; E1 not reading head 3 / base 3 with base nodes above head's; any listed figure reading otherwise. No other budget or position may be picked. Check every output file is non-empty before reading it.
Every test, build or engine run goes under the host lock named in your dispatch prompt.
Fences: those two test files and your records. No ticket, ADR, EPIC or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-303-rows, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
