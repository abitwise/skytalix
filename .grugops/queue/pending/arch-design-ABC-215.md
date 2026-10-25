---
subtask: arch-design-ABC-215
role: architect-design
ticket: plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md
ref: .grugops/context/arch-design-ABC-215/
branch: new grugops/arch-design-ABC-215 from main, worktree ../wt-arch-design-ABC-215
width: 1 of 3 (records + frozen-clock probe only — no real-clock timing, no G6, no games)
---

# Design ABC-215: our own evaluation values by stated rules; moved-pin probe

## Do
- Design exactly as the page asks (Scope, Test note 1 "Design probe first", the frozen-clock d7/d8 pre-check note): the stated rule per table (not derived from the Michniewski numbers), candidate values, the moved-pin probe (which ruled rows and deep pins move, counted on a scratch tree), and the frozen-clock node counts to depths 7 and 8 on kiwipete and position-6 for base and candidate (a count, not a reading).
- If the moved set is too wide for one L build, say so: BA/PM splits before Ready for Dev (page § Size).
- Name any ADR or owner word needed (page says none expected; the licence carve-out end is ADR-0048's — confirm what NOTICE/evaluate.ts header lines change).
- Context: Architect `arch-rule-ABC-205-g6/…912bcb0d` (gate vs blend; base at the position-6 d8 edge), Orchestrator `…154f2ced`, ADR-0031, ADR-0048.

## Fences
- Only your worktree and `<scratchpad>/arch215/`. Scratch trees for the probe; no `src/` edits on the branch. No real-clock timing. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch (the page's `## Design ruling` + notes). Seal notes (task arch-design-ABC-215). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
