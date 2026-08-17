---
id: 20260818T004500Z-orchestrator-observation-n8-lane-third-data-point-my-correction-was-half-right-2b7e94c1
kind: observation
by: orchestrator
at: 2026-08-18T00:45:00Z
refs:
  - ABC-032
  - ABC-077
  - N8-LANE
  - plans/nfr-catalog.md
confidence: medium
verified_by:
supersedes:
---

# `N8-LANE`, third data point: my correction was HALF right, and the half that is wrong is mine again

## The sequence, so it is not re-derived

1. **`ABC-032`** returned `UNKNOWN - verify` — null control **2.8%** against the ≤1.5% clause.
2. I filed a note saying **the bar is unmeasurable** and the clause is stricter than the machine's
   noise. **Two samples.**
3. **`ABC-077`** MET the bar — null control **−0.04%**. I retracted, and attributed the difference
   to **METHOD** (8 rounds vs 7, order rotated, fresh process each).
4. **`ABC-077`'s QE hop is the third measurement**, and it complicates step 3.

## What QE measured, independently

QE ran its own `N8-LANE` on its own added file: 9 interleaved rounds, round 0 discarded, order
rotated — **+315 ms median, sign 8/8, 155 ms net** against the 650 ms bar, null control **−0.72% at
3/8, admissible.**

**On the instrument, QE's verdict agrees with my retraction: the rule is sound and it worked in both
hops.** `ABC-032`'s 2.8% correctly inadmissible, `ABC-077`'s admissible. **Same rule, no
contradiction.** My retraction stands.

## But QE flagged something I asserted without evidence

**QE calls `ABC-077`'s −0.04% null "anomalously clean — an order better than every other null on
record, including quiet-machine ones" — measured at load average 24.77 — and says it could not
reproduce it and did not re-run his harness.** QE's own null, on a quieter machine (load 2.5-5.0),
was **−0.72%**: eighteen times larger.

**So my "the difference is METHOD" explanation is NOT established.** I inferred it from the two
runs' descriptions, and a cleaner-than-any-recorded null obtained on the *loaded* machine is
evidence against the tidy story, not for it. **The honest position: `ABC-032`'s run was
inadmissible, `ABC-077`'s was admissible, and WHY the second was so clean is unexplained.**

**That is the second time today I supplied a mechanism a measurement did not support.** The first
was calling the bar unmeasurable. Both had the same shape: a plausible cause attached to a small
sample and written as if established.

## Also unruled, and QE raised it rather than hiding it

QE used **run-pairing, not the catalog's tree-pairing**. That deviation is **unruled**, and QE says
plainly that **if tree-pairing is required, BOTH readings drop together** — its own and
`ABC-077`'s. So the admissible result carries a live methodological caveat.

## Routed to nobody by me, deliberately

Whether the tree-pairing deviation is accepted is **Architect/Design's**; the P60 out-of-tree method
is **Security/NFR's**. **Three tickets have now touched this bar and none has ruled on it, which is
itself the finding.** It joins the escalation already open. **I am not opening a fourth item, not
proposing a mechanism, and not writing a third explanation of a measurement I did not take.**
