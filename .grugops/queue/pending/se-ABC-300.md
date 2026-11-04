---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T14:12:37Z
subtask: se-ABC-300
role: software-engineer
ref: .grugops/context/se-ABC-300/
branch: new grugops/ABC-300 from main — worktree .claude/worktrees/se-ABC-300
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. At most a dry run and one 2-game smoke under the clock; no 100-game reads. Host paths only as placeholders.
---
# Build ABC-300: the harness plays a clock (tools only)
Read plans/tickets/ABC-300*.md (all of it), ADR-0071 D10, ADR-0056 R-TC, ABC-276 A5 (the byte-pinned usage row, which this ticket updates per BA/PM J4), and tools/rating/.
Build exactly the page:
- `d --tc 40/8` gives both skytalix sides tc=40/8, timemargin=0 and option.TimeMode=uci-clock-mode, in place of st=/timemargin=;
- a control: line and a dry-run row;
- any other value, and --tc together with --budget-ms, are refused;
- every existing r/d/rpair argv stays byte-equal;
- 0 lines under src/.
Bars: the page's AC; typecheck and lint clean; the default npm test green and ≤ 10 s (NFR-008); every R-281-a moved-row `-t` line that your diff triggers.
Fences: tools/, its tests, your records. No src, ticket, EPIC, ADR or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-300, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
