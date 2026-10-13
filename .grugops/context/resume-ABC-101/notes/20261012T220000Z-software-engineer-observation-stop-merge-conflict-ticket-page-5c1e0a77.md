---
id: 20261012T220000Z-software-engineer-observation-stop-merge-conflict-ticket-page-5c1e0a77
kind: observation
by: software-engineer
task: resume-ABC-101
at: 2026-10-12T22:00:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - plans/tickets/ABC-101-difficulty-selection.md
  - plans/traceability.md
  - 20261012T204500Z-ba-pm-decision-six-rulings-a5i-repinned-a9-widened-dor-10-of-10-f4a8b6ee
supersedes:
---

# Resume stopped at step 1: `git merge --no-ff main` conflicts in the ABC-101 ticket page, not only in the trace

This note is hand-authored and unsealed.

- **What ran.** In `../wt-ticket-to-pr-ABC-101`, on `grugops/ABC-101-difficulty-selection` at `27dddf86`
  (merge-base with `main` = `f0bd27f7`), `git merge --no-ff main` with `main` at `cc7128cc`. Two files conflicted:
  - `plans/traceability.md`: expected by the brief. Both sides appended one ABC-101 row at the end (the SE's
    "build, STOPPED" row and BA/PM's "amendment" row).
  - **`plans/tickets/ABC-101-difficulty-selection.md`: not allowed by the brief.** Both sides appended a section
    at the end of the page, after the re-score DoR table. The branch side is `## Delivery` (the SE's stop record
    from `27dddf86`). The `main` side is `## Amendment — 2026-10-12` (BA/PM, `a01bf6fb`). Same hunk, both pure
    additions. It looks like keep-both would resolve it, but step 1 says "stop and report on any other conflict".
- **What was done.** Stopped. `git merge --abort`. The branch tip is still `27dddf86` and the worktree is clean.
  Nothing was applied, edited, gated or committed in `src/`.
- **Read-only checks, for the next hop.**
  - `git diff --stat f0bd27f7 main -- src data AGENTS.md` is empty. `main` moved no code since the branch base.
  - `git apply --check .grugops/context/ticket-to-pr-ABC-101/probe/abc101-full-not-committed.diff` on `27dddf86`
    passes. Steps 2 to 6 look unblocked once step 1 has a ruling.
  - `abc095-book-absent-*` in `os.tmpdir()`: 0 (only read before the stop).
- **Owed to the Orchestrator.** A ruling on the ticket-page conflict: either allow keep-both for this one hunk
  (order: `## Delivery` then `## Amendment`, or the reverse), or have the next hop's brief name it.
