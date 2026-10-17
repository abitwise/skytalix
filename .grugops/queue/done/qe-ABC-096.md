---
result: PASS_WITH_GAPS
branch: grugops/ABC-096-opening-name
tip: 00fb0f75
reviewed_tip: 2acebaa8
code_commit: a48da51c
base: 6edadcf0
---

QE ABC-096: PASS_WITH_GAPS. A1-A10 are met by the code. No timing was read: A4's < 16 ms and NFR-007's first call
<= 30 ms are owed to Security/NFR (QE-096-d). QE commit 00fb0f75 adds 3 notes in `.grugops/context/qe-ABC-096/notes/`
(verdict decision `…e5a80c37`), the page's QE section (+30/-0) and one trace row (`ABC-096 (QE)`). It changes
nothing under `src/`.

Fence: the code commit changes 7 files, all in the page's table. The must-not-change list is byte-identical
(`git diff --quiet` exit 0). There are 0 new files and 0 dependency changes. Tests: 58/1810 at base (archive copy)
and 58/1822 at tip, +12, all new rows in render-seam.test.ts.

Gates at 2acebaa8: lint 0 (113), typecheck 0, build 0, npm test 0 (58/1822, success true), skip 0, integrity
`No findings.`. CLI_DEEP=1 exit 0, 10 passed. At 00fb0f75: lint 0, npm test 0 (58/1822), qe-hop-integrity
--ticket ABC-096 covered. merge-tree against main 5a43bbca is clean.

UAT waiver: the production-src grep prints book.ts, cli.ts and render-seam.ts. The waiver does not apply; UAT is
owed, signed by the owner's word.

Mutants: 22, planted before reading the SE's, each on the full lane plus tsc. 19 were killed and Q16 is
equivalent. Two survived:
- Q2, a code-unit `slice` cut. The A1 "whole code points" clause is unpinned (QE-096-a LOW). The production cut is
  correct. One odd-offset astral row closes it. Recommended: an SE repair before merge.
- Q9, the separator ":". It is equivalent on the shipped book (QE-096-b INFO).
The SE's 8 mutants ran on 2 files. Where they overlap mine they agree (all killed). The SE did not plant Q2, Q6, Q7,
Q9, Q11, Q14, Q15, Q18 or Q20.

Independent reads:
- Base and tip inBook/bookMove are equal on 5,679 book positions.
- openingName returns all 2,853 names, 1,764 of them on empty-m entries, with 0 draws.
- All 2,456 shipped names match an A1 oracle in both modes: 23 rows, W 21, no marker.
- A bounded real child ran as White. It showed `King's Pawn Game`, and the rejection line replaced it.

Other gaps, all INFO:
- QE-096-c: the stale parenthesis at cli.real-engine.test.ts:405 is outside the fence and was not edited.
- QE-096-e: A8's warning-once is evidenced only on CLI_DEEP.
- QE-096-f: 12 families share 5 shown texts. Shown to the owner at UAT.
- QE-096-g: the cut is made before sanitize. No shipped family is affected.
- QE-096-h: the cli.test.ts reference frames are a consistency check, not a name oracle. AGENTS.md's CLI_DEEP
  "7 passed" is stale; that predates this branch.

Next: QE recommends In Security/NFR (QE-096-d), then Ready for UAT. The Orchestrator decides on the QE-096-a
repair. Nothing was merged or pushed.
