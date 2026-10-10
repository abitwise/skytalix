---
task: wave-2026-09-25
subtask: qe-ABC-087
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md (review exit / quality gate)
ticket: plans/tickets/ABC-087-difficulty-levels-as-budget-plus-blunder-rate.md
ref: .grugops/context/qe-ABC-087/
source_refs: .grugops/context/ticket-to-pr-ABC-087/ (decision …4e5f0323, claim …53ebd6d1, observations …25962b19 and …69fa98d1, probe/)  .grugops/context/rule-abc087-cost/ (…52f042aa)  memory-bank/50-decisions/ADR-0032-* ADR-0027-*
enqueued_by: orchestrator
enqueued_at: 2026-10-10T12:08:29Z
branch: grugops/ABC-087-difficulty-levels (review tip b2fe6f21; QE commits go on top)
base: grugops/wave-2026-09-25
---

# Subtask: QE review of `ABC-087` — difficulty levels (ADR-0032 blunder construction)

Verify A1–A10 against the page as ruled. Run `ENGINE_DEEP=1 npx vitest run src/levels.test.ts` yourself
(~200 s). Re-prove ADR-0032 invariants independently with your own harness: the seed never reaches
`chooseMove` (ADR-0027); one draw per move; every blunder is the STRICT second-best on its own returned
list; never a worst-class move; the level total clamps to `HARD_CEILING_MS`; level 3 ≡ shipped
`chooseMove` at 3 s. Plant mutants (non-strict second-best; uniform non-worst; seed into chooseMove; clamp
removed; draw per root move instead of per move) — each must red, in the default lane where the page says
so. Confirm `src/engine.ts`/`src/search.ts` untouched. Known: the moved A4 test still logs "default lane,
ENDGAMES" — gap-register it. Cost: accept the Engineer's ADR-0035 reading or re-measure. Verdict PASS /
PASS_WITH_GAPS / FAIL. Fences: no production changes, `plans/board.md`, ADRs, `AGENTS.md`, catalog.
Notes per Workflow 16; trace row at the END of `plans/traceability.md`.
