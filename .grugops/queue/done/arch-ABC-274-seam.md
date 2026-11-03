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

## Result
by: architect-design (claude-opus-5-5), at: 2026-11-03T13:05:23Z. Records only; nothing run but the note seal (under the host lock).
- **Ruling: ACCEPT WITH CONDITIONS.** `withParametersForTest` is an allowed test-only seam: not a door (`ADR-0064` d7, `ADR-0026` d2–d3), not `ADR-0026` d2's rejected module-level hook (it re-runs the load-time loader into the same arrays in one synchronous scope and restores in `finally`), the same kind as `clearPawnCacheForTest` / `VALUE_TABLES_FOR_TEST`. `ADR-0002` does not govern it. Its shipped-path price (≈ 9 typed-array reads per call for the scalars) is inside A5's bar, `UNKNOWN - verify`.
- **Conditions, one test-only Engineer repair before QE's verdict:** S1 A3's mobility count must not read `evaluate − evaluateWithoutMobility` (true only while mobility's halves are equal; `ABC-239`'s emitted set would redden A3 with no defect, and `ABC-239` may edit no test); S2 move `loadParameters(parameters)` inside the `try`, plus a restore-on-throw row (throwing `run`, throwing loader); S3 a source-pin row (no non-test `src/` file but `evaluate.ts` and no `tools/` file names the seam; `loadParameters(` called at load and in the seam only). A1/A2/A5/A6 on `c131ecd0` carry over iff the repair's `src/` diff touches only the seam's body and `src/*.test.ts`.
- **`ABC-239` does not reuse the seam** (d5's gate runs at the shipped values; after `emit` the file is the values).
- **QE does not freeze A3 rows before the verdict:** the coded rule suffices. QE checks Q1–Q4 (selection outside the seam; per-family counts and phases; the mate-corpus addition was for a row count; one `Math.trunc` over `egDelta`, since C = 24 is a multiple of D) and records the missed freeze as a LOW process gap.
- **ADR edit:** `ADR-0067` decision 8 dated line, F8 pointer, decision-log row. No bar moved.
- **Notes:** `arch-ABC-274-seam` `20261103T130452Z-architect-design-decision-3169a174`, `20261103T130452Z-architect-design-observation-73129e69`.
