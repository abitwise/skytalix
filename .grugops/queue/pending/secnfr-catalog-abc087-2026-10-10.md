---
task: wave-2026-09-25
subtask: secnfr-catalog-abc087-2026-10-10
role: security-nfr
workflow: agent-factory/workflows/15-security-audit.md (catalog maintenance)
ref: .grugops/context/secnfr-catalog-abc087-2026-10-10/
source_refs:
  - .grugops/context/secnfr-ABC-087/notes/20261010T130030Z-security-nfr-decision-abc087-pass-with-risks-nfr004-ruled-per-move-played-ar-nfr004-a-reaccepted-clamp-pin-owed-3f1974f5.md
  - .grugops/context/wave-2026-09-25/notes/ (owner word …owner-word-uat-q4-5c8e2a17: ABC-087 accepted, merged b696d8e8)
  - .grugops/context/bapm-followups-2026-10-10/notes/ (…f9ef24db item 5: ABC-087 A2 holds on the injected clock only)
  - .grugops/context/secnfr-catalog-2026-10-10/notes/ (your previous catalog hop, …8f6351d1)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T14:22:24Z
branch: grugops/secnfr-catalog-abc087-2026-10-10
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: Security/NFR catalog — land ABC-087's level layer in `plans/nfr-catalog.md`

`ABC-087` (difficulty levels) is accepted and merged (`b696d8e8`). Your ABC-087 ruling owed catalog work
once it merged: the `NFR-004` level-layer wording (ruled per move played) and the `AR-NFR004-A`
re-acceptance. Land both, citing committed notes only. Record the injected-clock vs real-clock point from
BA/PM's note where it belongs (catalog wording, not a new bar). Confirm the clamp pin your ruling owed is
the one ABC-087 delivered (QE R1 clamp pin) or say what is still owed.

Do NOT: move any level/bar/measured figure without a committed measurement; apply ADR-0035 (still
PROPOSED); touch `NFR-005`'s PROVISIONAL marker (owner question open) or `NFR-008`.

## Fences
`plans/nfr-catalog.md`, your notes, one trace row only. No `src/`, `plans/board.md`, ADRs, ticket pages,
`AGENTS.md`. Never merge; never push. Own worktree. Commit-message file in a PRIVATE scratchpad
subdirectory. Real UTC stamps. Trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`. Queue pending → claimed → done (by
hand, main checkout, uncommitted). Report: before → after for each catalog line, row hashes changed,
owner questions, branch + sha + numstat.
