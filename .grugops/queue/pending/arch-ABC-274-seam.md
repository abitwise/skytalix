---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T12:58:58Z
subtask: arch-ABC-274-seam
role: architect-design
ref: .grugops/context/arch-ABC-274-seam/
branch: grugops/arch-ABC-274-seam — worktree .claude/worktrees/arch-ABC-274-seam (from main; read the build via `git show grugops/ABC-274:<path>`)
width: records only; no engine runs.
---
# Rule on ABC-274's test-only seam
se-ABC-274 (grugops/ABC-274 0730e294, code c131ecd0; notes …22e25cea, …c4eedfc0 in that branch's .grugops/context/se-ABC-274) built E2-pre packed, value-identical (A1 9 120 rows 0 mismatches; A2 25 620 Object.is; npm test 2 585). A3 uses a new test-only export `withParametersForTest(params, run)` in src/evaluate.ts that swaps the packed arrays for an offset table, clears the pawn memo and restores in finally; scalar terms moved into typed arrays so the seam can refill them (marked UNKNOWN - verify).
Rule: is this seam acceptable under the repo's door/seam rules (ADR-0064's test-only off-door pair pattern, ADR-0002, any "no test-only code in shipped paths" rule)? Will ABC-239's tuner reuse it (ADR-0067)? Any condition (e.g. a source-pin row that the shipped path never calls it; restore-on-throw row)? Also: A3's positions were chosen by the Engineer by a stated rule because QE's freeze (test note 1) was never made — say whether QE must freeze rows before the verdict or the rule suffices.
Write the ruling as a dated line in ADR-0067 (d8 / F8 area). Fences: memory-bank/50-decisions + your records. No src. No push, force, amend, rebase, merge into main.
Publish: sealed notes (task arch-ABC-274-seam, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit (Result text included); ## Result; brief + claim to done/.
