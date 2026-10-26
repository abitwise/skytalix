---
subtask: arch-records-arch-page
role: architect-design
ref: .grugops/context/arch-records-arch-page/
branch: new grugops/arch-records-arch-page from main, worktree ../wt-arch-records-arch-page
width: 1 of 3 (records only — no npm, vitest or timing; no src/)
---

# memory-bank/30-architecture.md: four stale lines (your …0aad233a)

## Do
- Add dated correction lines, in the page's own form, for the four lines your observation `arch-records-housekeeping/…0aad233a` found contradicted by files on `main`:
  - "There is no `vitest.config.ts`".
  - "`npm run build` is `tsc --noEmit`".
  - The § Deployment posture bullet saying there is no `bin`, nothing to run and no entry module.
  - Line 32, "no entry module".
- Check each against `main` first, by reading files only. Nothing else moves. Orchestrator `orch-2026-10-26k`.

## Fences
- Only that page, your worktree and `<scratchpad>/arch-page/`. No `src/`. No npm/vitest/timing. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task arch-records-arch-page). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
