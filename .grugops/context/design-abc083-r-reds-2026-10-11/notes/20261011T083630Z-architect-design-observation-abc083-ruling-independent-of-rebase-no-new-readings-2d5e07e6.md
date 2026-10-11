---
id: 20261011T083630Z-architect-design-observation-abc083-ruling-independent-of-rebase-no-new-readings-2d5e07e6
kind: observation
by: architect-design
at: 2026-10-11T08:36:30Z
verified_by: 
confidence: high
refs:
  - ABC-083
  - ABC-094
  - ADR-0039
  - src/search.ts
  - src/quiescence.ts
  - src/evaluate.ts
supersedes: 
seal: sha256:7bc7490ef59f871c160aae57d3fc54599ce54451fa689e3140370bdd6b13375e
---

# The ruling does not depend on a rebase. No reading was taken at this hop

Recorded through `context-io.js` `appendNote` (sealed and admitted, no stamp).

- **`git diff --name-only 489c549e fae240b2 -- src/`** prints `src/cli.test.ts`, `src/history-pane.ts`,
  `src/move-input.ts` and `src/move-input.test.ts`.
- **Rows 14/15 call `src/search.ts`'s doors.** Its imports are apply, evaluate, gameend, legal, moves, position,
  quiescence, transposition and zobrist. None of those files changed, so the node counts are the same on the wave
  tip. (`package.json`'s `test` script gained a JSON reporter, `ABC-142`, which reads no counts.)
- **A rebase is still owed before merge.** `ADR-0039`'s re-level lands on the rebased branch, with the rows re-read
  there. The `ADR-0034` scope command is re-run on the rebased range.
- **If `ABC-094` merges first,** it adds `src/book.ts` and `src/book.test.ts`. Whether that changes `N8-LANE`'s
  narrow set is `UNKNOWN - verify`, and Security/NFR's.
- **No reading was taken at this hop.** No timing, CPU or node count was taken; two other agents were loading the
  machine. Every number is cited from `fa81b948`'s committed probes.
