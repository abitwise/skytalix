---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T00:15:20Z
subtask: arch-ABC-264
role: architect-design
ref: .grugops/context/arch-ABC-264/
branch: new grugops/arch-ABC-264 from main (worktree .claude/worktrees/arch-ABC-264)
width: records only (optional measurements ≤ 5 min under `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock`; scratch outside the repo, deleted after).
---
# Architect: ADR for ABC-264 (P2 reverse futility), and fix ADR-0056 D2's T3 rationale
## Read
plans/tickets/ABC-264*.md (A1–A6; BA/PM's proposed A4 0.90× is unconfirmed); ADR-0056 D2 (P2 stub, +30–60), D5 (reads), R-TC; ADR-0026 (doors), ADR-0050 d9 (zugzwang positions); src/search.ts, src/quiescence.ts, src/evaluate.ts as on main; arch-phase1-replan notes (T3 kept entries supply 17–23 % of exact cuts; only 3–5 % of nodes store).
## Do
1. Write the ADR (PROPOSED): margin formula and depth range, guards (root, in check, mate band, zugzwang/pawn-only material, PV/null-window choice), doors, value-safety analysis, falsifiers. Confirm or replace A4's 0.90× with a measured premise (a ≤ 5 min scratch probe is allowed and recommended — learn from ABC-238: measure the premise before the bar).
2. ADR-0056: dated correction of D2's T3 line ("a kept entry almost never cuts" → measured 17–23 %), and note Phase 1 paused / Phase 2 next pending the owner.
3. Say which ABC-264 DoR rows are met.
## Fences
memory-bank/50-decisions/ (new ADR; ADR-0056 dated lines only), your notes. No src/, plans/, board. No push, force, amend, rebase, merge into main. Queue moves inside your worktree. Leave nothing running.
## Publish
Sealed notes (task arch-ABC-264, contextRoot = worktree's .grugops/context, never the plugin cache), commit, ## Result + trace row, brief + claim to done/.
