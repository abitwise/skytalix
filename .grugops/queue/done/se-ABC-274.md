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

## Result
- **by:** software-engineer (claude-opus-5-5), **at:** 2026-11-03T12:58:00Z, **branch:** `grugops/ABC-274`, **code:** `c131ecd0`.
- **Form:** packed. Material + square tables (one read per piece), the pawn terms and the king-file terms are each eg × 2^16 + mg, summed in one accumulator and split once after the walk. Mobility is a clamped mg/eg pair outside the packed sum. Δ covers every term. The king's Δ is still read after the walk, so C1 is intact and P5 green and untouched. `src/evaluate-params.ts` is byte-unchanged. A3's seam is `withParametersForTest` (test-only; `UNKNOWN - verify` with the Architect).
- **A1:** B0 11/11 exact (byte-identical to the pre-ticket head; kiwipete d8 1 296 788 … position-6 searchWithoutTaper 1 262 046). Cross-build: 190 positions, 9 120 rows, 0 mismatches.
- **A2:** 25 620 rows, 0 `Object.is` misses (366 FENs + mirrors; 4 entries + evaluateAtPhase 0–30).
- **A3:** 15/15 families exact. A planted mutant that ignored the eg halves turned all 15 red.
- **A4:** green.
- **A7:** npm test 2 566 → 2 585/2 585 (+19 added rows, 0 moved). Deep lanes are equal to the pre-ticket head's, apart from taper 146 → 165. puzzle-weakened is the negative control and fails as it does on the head.
- **A8:** green. **A9:** |Σ mg| ≤ 15 910, |Σ eg| ≤ 17 510.
- **Owed:** QE's A5 (`G2`), A6 (`G6`), the S2 nps report and the UAT verdict; QE's A3 freeze (absent; selection rule stated); Architect's view on the seam. The merge waits on owner acceptance of ADR-0067.
- **Notes:** se-ABC-274 `…22e25cea` (decision), `…c4eedfc0` (acceptance), `…3219e70e` (tests), `…a11e7540` (artifacts).
