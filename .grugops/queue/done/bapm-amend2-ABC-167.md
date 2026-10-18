---
done_at: 2026-10-18T20:43:20Z
branch: grugops/bapm-amend2-ABC-167 (worktree ../wt-bapm-amend2-ABC-167, from main 4a181e91)
commit: f2328d99
result: AMENDED (records only); DoR 10/10; size S
---

BA/PM ruled the clock step for each amended A5/A6/A7 row of ABC-167. **Records only.** The commit touches the
ticket page and `.grugops/context/bapm-amend2-ABC-167/` (one decision note `…5c7a1e30`, and a probe:
`probe/steps.ts`, `probe/steps.out`). Nothing under `src/`, `plans/board.md` or `plans/traceability.md` was
touched, and neither `../wt-ABC-167` nor `../wt-ABC-146` was. The branch merges clean into main (merge-tree). Nothing
was pushed or merged. No vitest, lane or wall-clock run was made.

## Ruling
Each amended row takes the **coarsest step s in {1, 10, 100}** for which every wrong build it names falls outside
**G ≤ time ≤ G + 2·s**, which holds when |W − G| > 2·s. The bound is kept, and **the timeout is not raised**. Where
the SE proposed step 10 for A5-b1, the rule gives 100, which still keeps out both wrong builds. Where the brief said
"keep step 1 for A5-c1", step 10 still keeps out both wrong builds (100 and 5), so A5-c1 moves to 10. No amended row
stays on step 1.

| row | step | window (ms) | wrong builds rejected (their G, ms) | at 20a9fc5d: time; nodes; nodes on step 1 |
|---|---|---|---|---|
| A5-b1 | 100 | 600–800 | 100 (M03, M06); 1 100 (M04) | 700; 2 069; 606 229 |
| A5-b2 | 100 | 100–300 | 600 (M06) | 200; 31; 96 287 |
| A5-b3 | 10 | 200–220 | 50 (M05) | 210; 15 381; 197 653 |
| A5-b4 | 100 | 300–500 | 50 (M11, min) | 400; 655; 300 053 |
| A5-b5 | 100 | 300–500 | 3 000 (clock wins, max) | 400; 655; 300 053 |
| A5-c1 | 10 | 50–70 | 100 (M02); 5 (no inc) | 60; 2 050; 45 077 |
| A6-d1 | 100 (as written) | 3 000–3 200 | none by time (cap); M12 by line counts | 3 100; 25 621; 3 062 805 |
| A6-e1–e5 | 100 (as written) | no time asserted | M15 and the release builds, by line counts | — |
| A7-f1 | 100 | 100–300 | 3 000 (movetime taken as depth's value) | 200; 21; 96 277 |
| A7-f2 | 100 (as written) | 3 000–3 200 | any G below 2 800 (no wrong value named) | 3 100; 25 621; 3 062 805 |
| A7-f3 `movetime 1e2` | 100 | 3 000–3 200 | 100 (1e2 read as a number) | 3 100; 25 621; 3 062 805 |
| A7-f3 `movestogo 0` | 100 | 50–250 | 950 (movestogo 0 accepted) | 200; 21; 45 077 |
| A7-h1 | 100 | 100–300 | 3 000 (M23) | 200; 21; 96 277 |

Each wrong build was stood in for by `go movetime W` (or a bare `go`) on the same step, and each fell outside its
window. At these steps no amended row searches more than 25 621 nodes (it was about 3.06M on step 1).

## For the SE fix hop
Change the step per row in `src/uci-session.test.ts` (the `pinned` A5 table currently hard-codes step 1 and
`budget + 2`; A7-f1/f3/h1 pass 1 and literal highs). Then the lane, CLI_DEEP, PERFT_DEEP and N8-LANE are still owed.

## Trace row (proposed; plans/traceability.md not touched)
| ABC-167 | grugops/bapm-amend2-ABC-167 @ f2328d99 | plans/tickets/ABC-167-….md (records only) | clock step ruled per amended A5/A6/A7 row (coarsest in {1,10,100}; G ≤ time ≤ G + 2·step kept; timeout not raised) | unblocks ticket-to-pr-ABC-167-fix (tests only) |
