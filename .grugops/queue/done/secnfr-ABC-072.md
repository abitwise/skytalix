---
task: wave-2026-09-25
subtask: secnfr-ABC-072
role: security-nfr
workflow: agent-factory/workflows/05-pr-quality-gate.md (Security/NFR gate; also the review exit for this docs-only ticket)
ticket: plans/tickets/ABC-072-abc041-clause-b-is-a-state-predicate-with-a-one-limb-instrument.md
also: plans/tickets/ABC-073-clause-b-misreading-has-propagated-to-eight-ticket-pages.md (folded)
ref: .grugops/context/secnfr-ABC-072/
source_refs: .grugops/context/design-ABC-072/ (notes …66a8bfa8, …23cfa14f; probe/clause-b.mjs, RUN.txt) — on the ticket branch; memory-bank/50-decisions/ADR-0036-…md
enqueued_by: orchestrator
enqueued_at: 2026-10-10T14:45:09Z
branch: grugops/ABC-072-clause-b-delta (tip 5f48753f; delivered commit 088e48db)
---

# Subtask: Security/NFR gate on `ABC-072` (+`ABC-073`) — canonical clause (b) under ADR-0036 (DELTA)

1. **Re-verify A1–A6 of ABC-072 and A1–A6 of ABC-073 independently** (this hop replaces a separate QE hop
   for a docs-only ticket). Run `probe/clause-b.mjs` yourself on the three named commits and on your own
   mutants; confirm the tree baseline (0/3/0 on 36 files).
2. **Confirm the capability limb list** the page asks Security/NFR to confirm, including whether a bare
   `process`, non-`node:` builtins and `Worker` should count (today: listed, not counted).
3. **Rule on the Architect's two readings:** (b2) counts transitively-reaching imports (widening only);
   ADR-0036 Alternative 3 example corrected (`cli-options.ts` → `glyph-mode.ts`).

ADR-0036 is Architect-accepted; the owner's veto question is open — rule on the instrument and limb list,
not on DELTA vs STATE.

Verdict: PASS / PASS_WITH_RISKS / FAIL with required fixes (route fixes; do not edit ADRs yourself).

## Fences
No `src/`. `plans/nfr-catalog.md` only if a catalog line must change (cite committed notes). Never merge;
never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree. Commit-message file in a PRIVATE
scratchpad subdirectory. Real UTC stamps. Trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, § Security/NFR on the ABC-072
page. Queue pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, per-criterion
evidence, limb-list ruling, rulings on the two readings, follow-ups with owners, gates, branch + sha.
