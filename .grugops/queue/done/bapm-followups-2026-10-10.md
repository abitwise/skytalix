---
task: wave-2026-09-25
subtask: bapm-followups-2026-10-10
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/bapm-followups-2026-10-10/
source_refs:
  - .grugops/context/design-owed-rulings-2026-10-10/notes/ (…95c73721 decision: items 3, 4, 6 follow-ups; R5b spec)
  - memory-bank/50-decisions/ADR-0036-abc041-clause-b-is-a-delta-test-on-the-production-capability-surface.md
  - .grugops/context/qe-ABC-059/notes/ (gap register: QE-059-a/b/c/d/e)
  - branch grugops/ABC-087-difficulty-levels: .grugops/context/secnfr-ABC-087/notes/ (…3f1974f5: RR-LEVEL1-REALCLOCK)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T14:02:20Z
branch: grugops/bapm-followups-2026-10-10
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: BA/PM follow-ups — R5b cut, ADR-0036 re-scores, QE-059 gaps, two pointers

Re-verify every premise at the current wave tip first. For each item: page repair, ticket cut (DoR
scored), or no-ticket disposition with a reason.

1. **ADR-0011 R5b (from QE-057-a):** cut the XS ticket to the Architect's specification in the decision
   note (what it pins, the kill ledger). It shares `src/history-pane.nfr.test.ts` with Ready `ABC-134`
   (comment-only): say on both pages whether to fold or sequence, and in which order.
2. **ABC-072 item 10 re-score** under accepted ADR-0036 (DELTA). **ABC-073:** re-measure its live set (the
   Architect reads it as only ABC-055 and ABC-059 — ABC-059 is now Done, merged `4c33b72b`) and say whether
   it folds into ABC-072's hop or is discharged.
3. **ABC-083 pointer:** the one-line pointer to ADR-0034's scope-test reading on ABC-083's "one reading for
   Architect/Design" bullet.
4. **QE-059-a/b/c** (LOW, wording of ABC-059's A1; ABC-059 is Done): cut, fold, or dispose. **QE-059-e**:
   an empty `probe/x` was committed under `.grugops/context/ticket-to-pr-ABC-059/` — note only.
5. **RR-LEVEL1-REALCLOCK:** whether ABC-087's A2 should say "on the injected clock". ABC-087 is in
   Ready for UAT (owner word owed) — do NOT edit its page on the wave; record your recommendation in your
   note and say whether it changes what the owner is asked to accept.

## Fences
Docs only: ticket pages (no column changes on existing tickets), new ticket pages, your notes. No `src/`,
`plans/board.md`, ADRs, `AGENTS.md`. Never merge; never push. Own worktree. Commit-message file in a
PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace rows at the END of `plans/traceability.md`. Queue pending → claimed → done (by
hand, main checkout, uncommitted). Report per item: disposition, files, new tickets (DoR/size/priority),
owner questions; branch + sha + numstat.
