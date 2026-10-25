---
subtask: arch-rule-ABC-205-g6
role: architect-design
ticket: plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
ref: .grugops/context/arch-rule-ABC-205-g6/
branch: new grugops/arch-rule-ABC-205-g6 from grugops/qe-ABC-205 (ffa0a5e8), worktree ../wt-arch-rule-ABC-205-g6
width: 1 of 3 (records only — no timing, no G6, no harness games)
---

# Rule ABC-205's G6 STOP (QE-205-a)

## Do
- Read QE `qe-ABC-205/…234d9814` (verdict), `…35de132c` (G6 readings and frozen-clock variant counts), `…a44d9079`, and Orchestrator `qe-ABC-205/…4561be39`; the page § A5 / G6 reading rule; ADR-0031 (decision 4 and the addendum).
- Rule the STOP: lay out the options with cost, evidence and who decides — at least (1) ship a changed build (e.g. scale-only, or a cheaper taper), what it needs (new G6 + D on that build), and the frozen-clock node cost of each variant; (2) close ABC-205 unmerged (what EPIC-008 loses); (3) any reading of NFR-005's "≥ base" (owner bound — name it as such, do not move it). Recommend one.
- Frozen-clock node counts and static reasoning only. No real-clock timing, no G6 re-read, no games.

## Fences
- Only your worktree and `<scratchpad>/arch205g6/`. No `src/` edits. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task arch-rule-ABC-205-g6). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
