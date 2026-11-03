---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T09:36:34Z
subtask: se-ABC-269
role: software-engineer
ref: .grugops/context/se-ABC-269/
branch: grugops/ABC-269 (on top of QE's freeze c9c27910, with main d172cf8c merged in) — worktree .claude/worktrees/se-ABC-269
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core, one game at a time. Single vitest file needs NODE_OPTIONS=--max-old-space-size=400. Other hops share the lock.
---
# Build ABC-269 (E1: tapered evaluation)
Build per ADR-0064 (ACCEPTED; read its § Decision log — QE-269-a ruled (a), decision …8ccb561f in .grugops/context/arch-ABC-269-rule) and plans/tickets/ABC-269*.md. The page fold (14 lines, observation …1c2ca5ff) is still owed to BA/PM; where the page and ADR-0064's dated lines differ, the ADR wins. Key points:
- One linear phase; every term an mg/eg pair in src/evaluate-params.ts; at E1 only the king square table's eg half and the passer eg half (2×) change; equal at phase 24; test-only off-door pair.
- d2: build ONLY the delta form (QE-269-b — the full form can return −0).
- QE's frozen fixtures (src/evaluate.taper-corpus.ts, sha256 05ed9e81…6e96339, PREREG …1b856350) are frozen: do NOT edit them. Write the tests that need E1 code against them.
- S1–S3 (castled corner) are a reported reading only: print their three values in your Result.
- Report B0 node counts (0.96–1.03× main expected), zugzwang 7/7, mate floor, G1, and the whole npm test count. No 100-game read — that is QE's (B8).
- AGENTS.md: if a new test lane line is needed, list it as owed to the Scribe (3 B headroom); do not edit AGENTS.md.
Fences: the ticket's files + tests. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-269, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.
