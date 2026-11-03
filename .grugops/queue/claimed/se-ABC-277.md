---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T14:59:13Z
subtask: se-ABC-277
role: software-engineer
ref: .grugops/context/se-ABC-277/
branch: new grugops/ABC-277 from main — worktree .claude/worktrees/se-ABC-277
width: wrap EVERY test/build run (every vitest too) in flock on the host lock (<scratch>/host-test.lock; the real path is in your dispatch message). One core. No games. Write <home>/<repo>/<scratch> placeholders in committed files.
---
# Build ABC-277
Build per plans/tickets/ABC-277*.md and sec-host-paths decision …72b4070b. A1–A7 per the page (A7 SEC-HP-2 redaction ONLY if the owner says yes — he has not yet; skip it). Also QE-274-d: make .gitignore ignore a node_modules symlink (`node_modules` without the trailing slash). The check must pass on main as it is today (A2).
Fences: new tools/grugops/ script + its test, memory-bank/45-standing-rulings.md, memory-bank/70-runbook.md, 40-contributing.md, .gitignore. No src/ changes. Another Engineer builds ABC-276 in parallel (no file overlap). No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-277, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit (Result text included); ## Result + trace row; brief + claim to done/.
