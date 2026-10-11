---
id: 20261011T084951Z-qe-e2e-observation-abc065-dor-row5-gap-f89ccb09
kind: observation
by: qe-e2e
at: 2026-10-11T08:49:51Z
verified_by:
confidence: high
refs:
  - ABC-065
  - ABC-070
  - G-QE-070-1
  - plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md:200
supersedes:
---

# QE ruling: `ABC-065` DoR row 5 is a GAP (LOW). Owner BA/PM. Not fixed here; not a defect of `ABC-070`'s delivery

**Ruling: it is a gap.** After `c0fedf7c`, I searched the whole page. Exactly **1** statement still calls the claim live: DoR row 5 (`:200`), *"the live `agents-md-owner-grants` claim … all four named"*. That reading disagrees with § Dependencies bullet 1 (`:130–137`), with the DoR header (`:191–192`, "The claim that held item 10 back has drained") and with row 10 (`:205`). `ABC-070`'s Problem is "a merged page contradicts itself" and its Value is "trust in the record". Measured page-wide, that problem is reduced from 2 sites to 1. It is not closed.

**Why it does not fail `ABC-070`.** A1 and A3 measure § Dependencies, and § Dependencies against row 10, only. Both are MET. A4 and test note 2 explicitly forbid touching `## Definition of Ready`. The Engineer was right to leave the row. Editing it would have failed A4.

**Why it is LOW, not higher.** The DoR header dates rows 1–9 to the cut, 2026-08-15, when the claim was live. Read with its header, row 5 is a true dated score. Its verdict (✅ dependencies known) is still correct. Only the adjective "live" is stale. Unlike row 10, the row carries no date of its own, so a reader who reads the row alone sees a live claim. Nothing gates on it: `ABC-065` is `Done`.

**For BA/PM to decide, not taken here:** (a) accept it as a dated cut-time score and close the residual; or (b) add an annotation, not a re-score, in the shape of the `A2` re-wording annotation, such as "live at the cut 2026-08-15; drained 2026-08-16, see row 10 and § Dependencies". The verdict cell stays as it is. Note for BA/PM: `ABC-070` test note 2 ("do not re-score the DoR") argues against re-scoring, not against annotating.
