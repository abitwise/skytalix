---
id: 20261018T204242Z-ba-pm-decision-abc167-clock-step-ruling-5c7a1e30
kind: decision
by: ba-pm
task: bapm-amend2-ABC-167
at: 2026-10-18T20:42:42Z
verified_by:
confidence: high
refs:
  - ABC-167
  - plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md
  - NFR-008
  - .grugops/queue/done/ticket-to-pr-ABC-167-fix.md
  - 20261018T202300Z-ba-pm-decision-abc167-amendment-rulings-for-qe-167-a-to-h-7d2e41b9
  - .grugops/context/bapm-amend2-ABC-167/probe/steps.out
supersedes:
---

# ABC-167: the clock step for each amended A5/A6/A7 row

This note is hand-authored and unsealed: this install has no `context-io.ts`. The ticket page's dated
`bapm-amend2-ABC-167` lines are authoritative, and this note indexes them.

**Ruling.** Each amended row runs on the coarsest step s in {1, 10, 100} for which every wrong build it names falls
outside G ≤ time ≤ G + 2·s, which holds when |W − G| > 2·s. The bound is kept. The timeout is not raised.

- Step 100: `A5-b1`, `b2`, `b4`, `b5`; `A7-f1`, both halves of `A7-f3`; `A7-h1`.
- Step 10: `A5-b3` (wrong 50 against G 200) and `A5-c1` (wrong 100 and 5 against G 50).
- Step 100, as already written: `A6-d1`, `A6-e1`–`e5`, `A7-f2`.
- Step 1: no amended row. Only the unamended `A5` rows keep it.

**Evidence.** Read on `20a9fc5d`'s `src/`, copied to the scratchpad, on `virtualClock` only. The step-1 cost
(606 229 nodes for `A5-b1`, 3 062 805 for `A7-f3`'s bare `go`) falls to at most 25 621 nodes per amended row.
Each wrong build was stood in for by `go movetime W` on the same step, and each fell outside its window. See
`probe/steps.ts` and `probe/steps.out`.

**Not run:** vitest, the lane, any wall-clock reading. N8-LANE is still owed at the gate. DoR is still 10/10 and the
size is still `S`.
