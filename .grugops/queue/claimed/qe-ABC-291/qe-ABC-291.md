---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-06T20:54:25Z
subtask: qe-ABC-291
role: qe-e2e
ref: .grugops/context/qe-ABC-291/
branch: new grugops/qe-ABC-291 from grugops/ABC-291 at 9e496e4a — worktree .claude/worktrees/qe-ABC-291
width: stage 0 only: seal the PREREG and read the count rows. No timing run, no game. Reads only: no src or test change lands.
---
# ABC-291's PREREG and count rows
Read ABC-291's page, ADR-0075 with its dated lines, …2d2c2bad, …77dd9228, …860a0dbd, …28283e48, …a223d29a, and qe-ABC-303's PREREG …53858301 for shape.
1. **PREREG, sealed before any run.** It carries:
   - …28283e48 § 3 (a)–(f): FL word for word, in the order Reach, CF1–CF10, ADR-0075 d8's table, FL; fsample.sh by name, sha 705353d632274a01; W not inherited, left open for the Orchestrator's line before the first game, with both branches written (without W the CF3 STOP branch stands); the Levels line; "the harness's state: label is not the verdict"; FL stops at games.
   - K4 in ADR-0067 d8's A5 shape with a main-copy control, PR8's two levels, stated as F2's one re-read: above 1.03 × is not merged and a miss under d11 (d). K5 with its void rule, every run at depth ≥ 6; a clean run below is F2's second miss (…43e6d8fd 3). NFR-008 timing with its void line …b9038a14. Timing before games.
   - C2′ GAIN ≥ 50.0 of 100 at 100 ms against the merge-base, then S′ at E 1 810, then Levels, each by bar. A miss is never re-played; a void is not a miss.
   - Any G1 row missed is class B: QE FAIL, defect check, on an exact build NOT MET, F3, no owner route (…860a0dbd). Row 1632's watch.
   - The run-rule's 23rd line, F1's deep line in ADR-0046, "1 passed". About 1.4 GB of /tmp quota per C2′, not shown by df.
   - Each stage's wall estimate, and the total owner-held window.
2. **Count rows, no quiet host needed:** K0 to K3 and K7 at the tip, and the five production files against 63af973e. Read K3 yourself; the page's "unread" is yours to close.
3. **K1 follow-ups:** read the engineer's fileFlip helper (…96abeaf8); say whether its flipped side-to-move and per-row memo omissions leave a gap.
4. **D8's leak, …77dd9228:** plant a W1 leak on a copy, off the worktree; say whether D8 still reads red. Then delete the copy.
STOP after these. Do not start timing or games: those come in a later brief carrying the owner's word. Report the PREREG note id, the window estimate and any red.
Every test or engine run goes under the host lock the dispatch prompt gives, one at a time. Deep spelling: ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run <file>; "no tests" is a failure. Read counts. Log foreign load by class and count only; no foreign command line in any record. Leave nothing running; check with ps, not pgrep -f.
Fences: your records only. No src, test, ticket, ADR, EPIC or board edits. No push, force, amend or rebase, and no merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.
