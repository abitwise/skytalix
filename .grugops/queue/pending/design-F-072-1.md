---
task: wave-2026-09-25
subtask: design-F-072-1
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md (Architect design hop; ADR per role page)
ref: .grugops/context/design-F-072-1/
source_refs:
  - .grugops/context/secnfr-ABC-072/notes/20261010T150119Z-security-nfr-decision-abc072-pass-with-risks-limb-list-widened-readings-upheld-f-072-1-29849eeb.md
  - .grugops/context/secnfr-ABC-072/probe/ (limb-ruling.patch, sec-mutants.sh, RUN.txt)
  - .grugops/context/design-ABC-072/probe/clause-b.mjs
  - memory-bank/50-decisions/ADR-0036-abc041-clause-b-is-a-delta-test-on-the-production-capability-surface.md
enqueued_by: orchestrator
enqueued_at: 2026-10-10T15:04:55Z
branch: grugops/design-F-072-1
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: F-072-1 — land Security/NFR's widened limb list in ADR-0036 and the clause (b) instrument

Security/NFR (MEDIUM, P2) ruled clause (b)'s limb list wider at ABC-072's gate. Land it:
1. A dated block under ADR-0036 § Canonical clause (b) stating the widened limbs (per the decision note),
   plus O-072-a: point the Alternatives table row at the existing dated correction.
2. Update `clause-b.mjs` to match (a new versioned copy under your context dir is fine if the old path
   must stay as the ABC-072 record — say which is canonical). Unresolved imports report "disputed" and the
   verdict must not say "does not fire" when anything is disputed.
3. Prove it: baseline 0/3/0 unchanged on the current tip; the 21 fixture rows and the Architect's nine
   mutants unchanged; Security/NFR's S1–S12 fire; computed eval forms stay listed word hits.

ADR-0036's DELTA ruling and the owner's open veto are not in scope.

## Fences
Docs + the probe only. Zero `src/`. No `plans/board.md`, `AGENTS.md`, ticket columns. Never merge; never
push. Own worktree. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`. Queue pending → claimed → done (by
hand, main checkout, uncommitted). Report: ADR block summary, instrument path, proof readings, gates (lint +
test), branch + sha + numstat.
