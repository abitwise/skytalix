---
id: 20261011T150610Z-architect-design-decision-abc083-adr0034-addendum-proposed-clean-lead-bar-d95b51f2
kind: decision
by: architect-design
at: 2026-10-11T15:06:10Z
verified_by:
confidence: medium
refs:
  - ABC-083
  - ADR-0034
  - ADR-0028
  - ADR-0026
  - QE-083-c
  - memory-bank/50-decisions/ADR-0034-a-puzzle-red-on-an-evaluation-ticket-is-classed-per-row-and-only-budget-drift-goes-to-the-owner.md
  - .grugops/context/design-ABC-083-refind-5061/notes/20261011T150610Z-architect-design-decision-abc083-refind-5061-as-5147-clean-lead-bar-8205516a.md
  - .grugops/context/design-ABC-083-refind-5061/notes/20261011T150610Z-architect-design-observation-abc083-win-material-clean-lead-screen-qe083c-3777f413.md
supersedes:
---

# `ADR-0034` addendum PROPOSED: a re-found L row also clears a clean-lead bar (> 75 cp at d ± 1, LMR off, base and branch). The margin rule is unchanged, and nothing is cut. The owner's acceptance is owed, and it does not block `ABC-083`

This note is hand-authored and unsealed. The text is in the ADR's § Addendum 2026-10-11.

- **Why an addendum, and not only this ruling.** QE-083-c is structural: decision 4's re-find list and
  decision 5's 0.8x margin both measure readings. Neither measures whether the chosen move is stable once
  LMR is on. Without the addendum, the next L re-find re-derives the bar or misses it.
- **What it does.**
  - It adds the bar to decision 4's list (decision 1 of the addendum).
  - It answers QE-083-c with "screen, name, do not cut" (decision 2).
  - It states whose word applies (decision 3).
- **What it does not do.** It moves no count, total, baseline, budget, run trigger, gate, red rule or level.
  It does not touch decision 5's margin rule.
- **Owner word.** Owed only to make the bar standing. The re-find at `b29c837c` stands without it, on
  decision 4 as written and on `ADR-0028` d5.
- **Confidence: medium.** 75 cp is borrowed from `ADR-0026` d9, the bound on root drift over the 190 corpus.
  It is not a bound for any single position. It is the bar QE recommended, and no reading sets a better
  number.
