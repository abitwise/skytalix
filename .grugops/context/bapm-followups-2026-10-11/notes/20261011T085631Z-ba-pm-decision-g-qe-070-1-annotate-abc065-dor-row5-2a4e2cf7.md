---
id: 20261011T085631Z-ba-pm-decision-g-qe-070-1-annotate-abc065-dor-row5-2a4e2cf7
kind: decision
by: ba-pm
at: 2026-10-11T08:56:31Z
verified_by:
confidence: high
refs:
  - G-QE-070-1
  - ABC-065
  - ABC-070
  - plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md:200
  - 20261011T084951Z-qe-e2e-observation-abc065-dor-row5-gap-f89ccb09
supersedes:
---

# Item 3: `G-QE-070-1` is closed by ANNOTATION, not by acceptance. `ABC-065` DoR row 5 is not re-scored

This note is hand-authored and unsealed.

## Choice: (b) annotate. Rejected: (a) accept as a dated score
- **Why not (a).** The DoR header dates rows 1–9 to the cut, so the row is true when read with the header. But QE measured that a reader of the row alone sees a live claim (`…f89ccb09`). `ABC-070`'s value was "trust in the record", and it left 1 of 2 sites open. Accepting would close the residual on paper and leave the reading wrong.
- **Why (b) is allowed.** `ABC-070` test note 2 forbids **re-scoring** the DoR. Its `A4` fenced **`ABC-070`'s own diff**, and that ticket is `Done`. Neither forbids a dated annotation by a later hop. The page already has a precedent of the same kind: the `A2` re-wording annotation (2026-08-16), which kept the original words verbatim.

## What was done
- **One line changed:** `:200`, hunk `@@ -200 +200 @@`.
- The original cell text is kept **byte for byte as a prefix**. This was checked by string prefix against the pre-edit copy, with a control suffix that fails.
- The `**✅**` verdict cell is unchanged, and "the live `agents-md-owner-grants` claim" still occurs once.
- **Appended in italics:** *"ANNOTATED, NOT RE-SCORED, 2026-10-11 (BA/PM, `bapm-followups-2026-10-11`, `G-QE-070-1`): "live" was true at the cut, 2026-08-15; the claim drained 2026-08-16 (row 10, § Dependencies)"*.
- **Untouched:** no other row, the header, the criteria, the `A2` annotation, § Dependencies and the front matter. `ABC-070`'s page is not edited. Its residual paragraph stays as history, and this note plus the trace row record the close.
