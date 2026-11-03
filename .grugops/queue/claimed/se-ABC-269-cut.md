---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T11:02:09Z
subtask: se-ABC-269-cut
role: software-engineer
ref: .grugops/context/se-ABC-269-cut/
branch: grugops/ABC-269 (on 110292d4, with main merged in) — worktree .claude/worktrees/se-ABC-269
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core. Single vitest file needs NODE_OPTIONS=--max-old-space-size=400. NO timing reading (G2 is QE's, under PREREG …e36ee7ca).
---
# ABC-269: build cut C1 (F3's one value-identical cost cut)
Build exactly what the Architect ordered in decision …a0468a78 (.grugops/context/arch-ABC-269-F3; ADR-0064 dated block "F3 on G2"):
- C1: the phase leaves the board walk. Seed once by phaseOf(position) at the root; children get phase − PHASE_WEIGHT[captured & 7] + PHASE_WEIGHT[promotion]; null move keeps it; carried as a number argument through the recursion (or a per-ply Int32Array beside keys). NEVER on Position, UndoRecord or module state. The tapered evaluate takes the phase as an argument; king Δ read after the walk from the two king squares.
- Files: src/evaluate.ts, src/quiescence.ts (quiesce trailing phase), src/search.ts, src/engine.ts (futilityNode 7th arg); tests calling quiesce/futilityNode directly gain the argument; ABC-268's .length pin 6 → 7.
- Untouched (show in diff stat): position.ts, apply.ts, legal.ts, moves.ts, zobrist.ts, evaluate-params.ts, QE's fixture (sha256 05ed9e81…6e96339).
- Proof rows P1–P7 exactly as the decision lists (B0 exact 11 counts; phase oracle walk; Object.is equal to uncut src b8b44ff3; cross-build 190 + 8 360 rows 0 mismatches; guard + 4 planted defects red; ZERO re-pins — any re-pin is a defect → stop to Architect; typecheck/lint/build clean). Full npm test count and deep lanes.
Fences: the listed files + tests. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-269-cut, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit (Result text included); ## Result + trace row; brief + claim to done/.
