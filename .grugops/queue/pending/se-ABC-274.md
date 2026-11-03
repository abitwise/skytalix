---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T12:26:38Z
subtask: se-ABC-274
role: software-engineer
ref: .grugops/context/se-ABC-274/
branch: new grugops/ABC-274 from main 54dee3f2+ — worktree .claude/worktrees/se-ABC-274
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core. Single vitest file needs NODE_OPTIONS=--max-old-space-size=400. NO timing reading (G2 is QE's).
---
# Build ABC-274 (E2-pre: every term blended, value-identical)
Read plans/tickets/ABC-274*.md (A1–A9), ADR-0067 d8 + F8 (and its dated block from arch-fold-1103b …e16881f5), ADR-0064 incl. the F3 block and cut C1 (se-ABC-269-cut …8e00e712).
- Every term's mg/eg halves enter the blend; at E1's table values every score, node count and move is identical to main 54dee3f2 (Object.is). Recommended form: packed score (mg/eg in one integer per table entry); if packed, A9's 16-bit bound test is required; mobility outside the packed sum unless you show it fits.
- C1 must stay intact: phase stays an argument; no phase add back in the walk; C1's P5 guard green.
- A3: prove every term's eg half is actually read (a row that goes red if an eg half is ignored).
- No test expectation may move (any re-pin is a defect → stop to Architect).
- Report B0-style node identity (the 11 counts), cross-build 0 mismatches, npm test count, deep lanes.
Merge waits owner acceptance of ADR-0067; the build does not.
Fences: src/evaluate*.ts (+ the files the page names) + tests. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-274, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit (Result text included); ## Result + trace row; brief + claim to done/.
