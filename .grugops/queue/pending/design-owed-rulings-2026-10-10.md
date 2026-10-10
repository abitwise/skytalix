---
task: wave-2026-09-25
subtask: design-owed-rulings-2026-10-10
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md (Architect rulings; ADR per role page)
ref: .grugops/context/design-owed-rulings-2026-10-10/
source_refs:
  - .grugops/context/wave-2026-09-25/notes/20261010T132239Z-orchestrator-observation-handoff-2-7d3e1b84.md (§ Owed routings → Architect)
  - .grugops/context/qe-ABC-057/notes/20261010T133223Z-qe-e2e-observation-abc057-gap-register-a331f012.md (QE-057-a, QE-057-c)
  - .grugops/context/ticket-to-pr-ABC-057/notes/ (SE flag on turn-loop.ts part (i))
enqueued_by: orchestrator
enqueued_at: 2026-10-10T13:35:50Z
branch: grugops/design-owed-rulings-2026-10-10
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: Architect batch — six owed rulings/pointers, one hop

Each item: read its source (pointers above, the ADRs named, the ticket pages), decide, and record the
outcome as an ADR amendment/pointer line or a decision note. Rule only what is yours; anything that is the
owner's goes back as a question with your recommendation. Do not re-open accepted ADRs' decisions — add
pointers/amendments only.

1. **ADR-0011 R4 pointer + ADR-0029 pointer** — the borrowed ADR-0030 definition fails open for equality.
2. **ABC-057 item 3 / QE-057-c** — the literal reading of ADR-0011 part (i) against `src/turn-loop.ts`
   (receives history injected at `:154`; already takes two seams injected).
3. **QE-057-a** — two gate-clean one-line edits outside the pinned lines drop the unlicensed-importer kill
   (pre-existing on base). Rule: accepted risk, or a ticket for BA/PM to cut (say what it must pin).
4. **ADR-0034 trigger glob** — `src/search*.ts` also matches test files; give the reading.
5. **ADR-0035 (proposed) per-file floor** for child-heavy files. ADR-0035 stays PROPOSED — the owner has
   not ruled; amend the proposal text only.
6. **ABC-072/ABC-073 STATE vs DELTA ruling** — the backlog pair waits on it.

## Fences
Docs only: `memory-bank/50-decisions/`, your notes, ticket pages' design sections for 072/073. No `src/`,
no `plans/board.md`, no `AGENTS.md`, no ticket status/column changes. Never merge; never push. Own
worktree. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, one trace row at the END of `plans/traceability.md`. Queue pending → claimed → done
(by hand, main checkout, uncommitted). Report per item: ruling, where recorded, follow-ups (with owning
role), owner questions; branch + sha.
