---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T00:10:50Z
subtask: qe-ABC-270
role: qe-e2e
ref: .grugops/context/qe-ABC-270/
branch: grugops/ABC-270 (frozen code 795a6b61, src tree 0f393c18; tip f930e1ee) — worktree .claude/worktrees/se-ABC-270
width: wrap EVERY test/build/engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. **K3 (G2) and K4 (G6) timing ALONE**: each timing session in one flock; record uptime/load and top CPU users at start and end; QE's own G6 harness with its 60 °C cool-down unchanged (if the host never cools, stop and report — do not relax it). qe-ABC-279 is running games; wait for the lock. Never touch foreign processes (e.g. abtop). No games. Host paths only as placeholders.
---
# QE ABC-270 (E3a structure only, ADR-0068 ACCEPTED) — value- and node-identical
Read plans/tickets/ABC-270*.md (K0–K4), ADR-0068, your own frozen rows (qe-ABC-270-freeze …fa82b3f3, pairs.json sha256 68769ea9…), se-ABC-270 notes (…007dc90a, …15cac083, …bd09c051, …77fd2bd9).
- Seal a PREREG before any timing (K3 G2 ≤ 1.05×, two sessions, ABC-274's form; K4 G6 ≥ base by the median, every run depth ≥ 6).
- Re-grade K0 (out-of-tree cross-build node identity), K1 (a)–(e) incl. K1 (c) per king via kingExposureForTest (QP2), K2 (zero re-pins; the A2 (b)/A3 (b) phase-24 replacements per ADR-0068 d5 — check no number moved and the FENs are literal strings, per the ABC-270 page), mutants. S2 nps reported only (Orchestrator ruling).
- Note for the Architect (gap, not a bar): whether kingExposureForTest is the wanted export form.
- The SE edited plans/board.md on the branch; the Orchestrator owns the board — record it as a process gap (LOW); don't revert.
- Verdict PASS / PASS_WITH_GAPS / FAIL; your verdict signs UAT.
## Fences
tests and your records on that branch; no production src edits. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task qe-ABC-270, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.
