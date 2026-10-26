---
subtask: arch-accept-adr0025-d4
role: architect-design
ref: .grugops/context/arch-accept-adr0025-d4/
branch: new records branch grugops/arch-accept-adr0025-d4 from main, worktree ../wt-arch-accept-adr0025-d4
width: 1 of 3 — records only (no npm, vitest, build or timing)
---

# Owner word: the ADR-0025 decision 4 amendment is accepted

## Do
- Read Orchestrator `owner-word-2026-10-26b/…2ae5fc12`.
- **ADR-0025 § Proposed amendment 2026-10-26: PROPOSED → ACCEPTED**, citing the owner's verbatim word.
  - Add that it is **in force on main at ABC-209's merge**. Until then, decision 4's clear-per-search stands on main.
  - Keep the PROPOSED text as "Previously" (the ADR-0048/0050 form).
  - Update any pointer line at the top of the ADR to match.
  - Apply any drift rows the amendment assigns to Architect/Design. Rows owned by other roles are listed, not written.
- Run `node tools/grugops/reference-check.js` on ADR-0025.
- Records only: `git diff --stat main...HEAD -- src tools package.json` must print nothing. Paste it.

## Fences
- Work only in your worktree. Don't touch the board or ticket pages.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `arch-accept-adr0025-d4`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
