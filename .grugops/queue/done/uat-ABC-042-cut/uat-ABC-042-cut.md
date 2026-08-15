---
task: uat-ABC-042-followups-2026-08-15
subtask: uat-ABC-042-cut
role: ba-pm
workflow: agent-factory/workflows/03-epic-to-tickets.md
ref: .grugops/context/uat-ABC-042-cut/
parent_ref: .grugops/context/uat-ABC-042-followups-2026-08-15/
enqueued_by: orchestrator
enqueued_at: 2026-08-15T13:00:00Z
branch: grugops/uat-ABC-042-cut
base: grugops/uat-ABC-042-followups @ TIP — branch by NAME, not by sha
phase: 1
---

# Subtask: cut the `ABC-042` UAT follow-ups — ONE deduped set, from BOTH note sets

**Read the parent ref first.** It records why this is BA/PM's and why the pack amendments are NOT.

## The two input sets — read both from disk, dedupe, then cut

- `.grugops/context/uat-ABC-042-bapm/notes/` — nine recommendations (your own previous hop's).
- `.grugops/context/uat-ABC-042-qe/notes/` — ten repairs, `R1`–`R10`.

**Neither role could see the other's list; both ran in parallel and nothing was relayed.** At least
two pairs are the same work under different names. **Deduplicate before cutting.** This repository
already carries `ABC-040` — duplicate trace rows — and a duplicate ticket set would be that defect,
committed deliberately.

## Scope fences

- **Cut tickets. Do not perform the work.** No test written, no product change, no `AGENTS.md` edit.
- **`ABC-042` does not move and its page is NOT edited.** It is merged and `Done`; both gates passed
  against it. These are new tickets, not a re-opening.
- **New tickets land in `Backlog`** (unlimited). Do not fill `Ready` — its WIP limit is 8.
- **The six pack amendments are NOT yours** and are running in parallel as `uat-ABC-042-amend`. Do
  not write anything under `.grugops/context/uat-ABC-042-pack/` or `.../uat-ABC-042-amend/`.
- Board and trace rows **for the tickets you cut** are yours, per this project's recorded practice.
  Nothing else on either file.
