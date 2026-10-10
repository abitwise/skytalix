---
task: wave-2026-09-25
subtask: secnfr-catalog-2026-10-10
role: security-nfr
workflow: agent-factory/workflows/07-backlog-refinement.md (NFR catalog upkeep) + 15-security-audit.md (record only)
ref: .grugops/context/secnfr-catalog-2026-10-10/
source_refs: .grugops/context/wave-2026-09-25/notes/20261010T173005Z-orchestrator-decision-owner-word-eight-answers-6a1f3d92.md (owner word: answers 2, 4, 5), memory-bank/50-decisions/ADR-0035* (accepted, R-1), plans/tickets/ABC-131-*.md (§ Delivery: 0.8x readings), .grugops/context/secnfr-ABC-138/ (AR-133), memory-bank/50-decisions/ADR-0037*, ADR-0038* (new; read for lanes only)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T18:27:50Z
branch: grugops/secnfr-catalog-2026-10-10
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: Security/NFR — apply the owner's word to `plans/nfr-catalog.md`

One catalog hop, owner word of 2026-10-10:
1. **ADR-0035 accepted with option R-1 for NFR-008:** wall ≤ 10 s is the gate; CPU is reported, not gated.
   Apply the per-set floor wording the ADR proposes for the row's owner.
2. **NFR-005:** retire the depth-7 PROVISIONAL marker (owner: "retire"). Say what the level now is.
3. **Reference runtime:** Node v24.12.0 → **v26.11.0**. List (do not edit) every ADR / `AGENTS.md` line that
   still names v24 as the reference, with file:line, so the Orchestrator can route them.
4. **RISK-003** 0.8x figure from ABC-131: step 1.25 → 54/58, 19 readings, one to spare; step 1.35 loses the
   mate-in-3 seeds 1/69/1163. Re-read from ABC-131's page/notes, not from this line.
5. Record AR-133-WRAP discharged / AR-133-LOADER narrowed (ABC-138) and `loader-scan.mjs` retired from the
   per-diff routine (except branches cut before `497d3b2f`), if not already recorded.
6. ADR-0037/0038: note in one line each whether they need a catalog row (e.g. book size ≤ 1 MiB; `LADDER_DEEP`
   machine-hours) — recommend, do not add rows for a proposed ADR.

## Fences
`plans/nfr-catalog.md`, your notes and a trace row only. No `src/`, `plans/board.md`, ADRs, `AGENTS.md`, ticket
pages. No level moves beyond the owner's word above. Never merge; never push. Own worktree. Commit-message
file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Quoted heredocs only (`<<'EOF'`).

## Publish
Note per Workflow 16, trace row at the END of `plans/traceability.md`. Queue pending → claimed → done (by hand,
main checkout, uncommitted). Report: each item applied (row ids), the v24 list, ADR-0037/0038 row
recommendations, branch + sha.
