---
task: wave-2026-09-24
subtask: place-nfr009
role: security-nfr
workflow: agent-factory/workflows/15-security-audit.md (NFR catalogue placement on the owner's word)
ref: .grugops/context/place-nfr009/
draft_ref: .grugops/context/ruling-abc080-081/   (R4 decision note: the NFR-009 draft)
owner_word_ref: .grugops/context/wave-2026-09-24/notes/20260925T160000Z-orchestrator-decision-c457f8bc.md
ticket: plans/tickets/ABC-081-transposition-table-and-in-tree-repetition.md
enqueued_by: orchestrator
enqueued_at: 2026-09-25T16:05:00Z
branch: grugops/place-nfr009
base: grugops/wave-2026-09-24 (tip after this enqueue)
---

# Subtask: place `NFR-009` (search-held memory) in the NFR catalogue

The owner APPROVED the Architect's `NFR-009` draft (`draft_ref:` R4) on his verbatim word
(`owner_word_ref:`): **16 MiB, with licence to extend up to 128 MiB if a measured need arises.**

## Do
1. Add the `NFR-009` row to `plans/nfr-catalog.md` in the catalogue's existing row shape: the
   16 MiB level, the ≤ 1 MiB growth clause between a 1 s and a 3 s search read after gc, the
   verifier (`heapUsed` + `arrayBuffers`; the verifier must be seen failing first), and the
   owner's 128 MiB ceiling recorded as the ceiling of any re-level, not as the level. Cite the
   owner's word verbatim.
2. Check the draft against `ADR-0025` (4 MiB table at 2^18 entries, now accepted) and the
   measured baseline (79.8 → 93.1 MiB RSS). Say whether 16 MiB is consistent; do not raise it
   without a measured reason.
3. Add a `## DoR item 10` line to `ABC-081`'s page stating the row now exists (BA/PM re-scores).

## Fences
No files under `src/`. Do not touch `plans/board.md`, `AGENTS.md`, or ADRs. Never merge; never
push. Own `git worktree`; commit messages via a scratchpad file and `git commit -F`.

## Publish
A `decision` note under `ref:`, a trace row. Queue pending → claimed → done per Workflow 17.
Report: the row as placed, any inconsistency found, sha, numstat.
