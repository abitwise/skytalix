---
task: wave-2026-09-25
subtask: qe-ABC-069
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md (review exit / quality gate)
ticket: plans/tickets/ABC-069-dev-run-slot-conventions-are-unwritten.md
ref: .grugops/context/qe-ABC-069/
source_refs: .grugops/context/scribe-ABC-069/ (observation …3c1a7e52)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T09:19:31Z
branch: grugops/ABC-069-agents-md-conventions (review tip 6ce9655; QE commits go on top)
base: grugops/wave-2026-09-25
---

# Subtask: QE review of `ABC-069` — the `Dev / run` slot's writing rules in `AGENTS.md`

Small (XS, docs). Verify the page's criteria against the diff independently. Prove the written
rules are true by planting the two violations they describe in a scratch copy of `AGENTS.md`
(text after the backtick; an option the program does not accept) and confirming the `ABC-065`
guard in `src/cli.test.ts` reds on each, then honest edits that follow the rules stay green.
Confirm the guard is byte-identical, `AGENTS.md` ≤ its cap, gates green. Verdict PASS /
PASS_WITH_GAPS / FAIL. Fences: no `plans/board.md`, ADRs, `src/`; revert every plant. Notes per
Workflow 16; trace row at the END of `plans/traceability.md`.
