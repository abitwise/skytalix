---
id: 20261011T095343Z-security-nfr-decision-abc144-window-a-adr0040-d2-applied-largest-eligible-k-is-3-b66453e7
kind: decision
by: security-nfr
at: 2026-10-11T09:53:43Z
verified_by:
confidence: high
refs:
  - ABC-144
  - ADR-0040
  - ADR-0035
  - .grugops/context/secnfr-ABC-144-window-a/notes/20261011T095343Z-security-nfr-observation-abc144-window-a-frontier-readings-a898a14a.md
  - .grugops/context/secnfr-ABC-144-window-a/notes/raw-abc144-frontier-warm.summary.txt
  - memory-bank/50-decisions/ADR-0040-the-default-lane-holds-at-most-four-test-workers-pinned-by-value-and-isolation-stays-on.md
supersedes:
---

# `ABC-144` Window A: `ADR-0040` d2's pre-registered rule, applied mechanically. **The largest eligible k is 3**

This note is hand-authored and unsealed. It applies the rule as written and nothing more. It does not
weigh lag, heat or wall preferences. Those belong to the owner.

## The rule (`ADR-0040` d2, quoted in short)

An arm `K4`, `K3` or `K2` is ELIGIBLE when all of these hold:
(a) the identity twin is admissible (`ADR-0035` d1);
(b) its paired CPU median is ≤ −15 % of base's median, and the twin's CPU R is ≤ 15 % of base CPU;
(c) its warm wall median + the twin's wall R is ≤ 10 s.
Rule the LARGEST eligible k.

## The inputs (readings in `…a898a14a`)

- Base CPU median: **27.15 s**. −15 % of that is −4.07 s.
- Twin: CPU median delta +0.72 % of base (limit 1.5 %), sign 5/8, so **admissible**. Twin CPU R is 0.640 s,
  which is 2.36 % of base (limit 15 %). Twin wall R is **0.150 s**.

| arm | (a) twin admissible | (b) paired CPU median ≤ −15 % | (b) twin CPU R ≤ 15 % | (c) wall median + twin wall R ≤ 10 s | eligible |
|---|---|---|---|---|---|
| K4 | yes | **no: −10.66 %** | yes (2.36 %) | yes: 6.57 + 0.15 = 6.72 s | **no** |
| K3 | yes | yes: −16.48 % | yes (2.36 %) | yes: 7.22 + 0.15 = 7.37 s | **yes** |
| K2 | yes | yes: −22.71 % | yes (2.36 %) | yes: 8.23 + 0.15 = 8.38 s | **yes** |

**Result: K3.** It is the largest eligible k. The rule does not need the owner on this reading.

- The CPU clause is not borderline at n = 8. K4's whole paired interval, [−3.760, −2.410] s
  (−13.85 % to −8.88 %), lies short of −15 %. K3's whole interval, [−5.180, −4.350] s (−19.08 % to −16.02 %),
  lies past it.
- K1 is not a candidate under d2. It is reported only (−29.26 % CPU, 14.68 s wall).

## What follows, by `ADR-0040`'s own text (not done at this hop)

- `ADR-0040` is `proposed`. Its d2 says the ADR records the result as an addendum and the Engineer builds that
  k. A smaller k "changes the pin's literal and nothing else". The addendum is **not** written here: this hop
  publishes only into its `ref:`. The Architect or Orchestrator writes it, and owner acceptance of
  `ADR-0040` is still owed.
- The ADR's decision 1 text ("Why 4") and the pin's `toBe(4)` / `≤ 4` env check would read 3 under this
  result. No config was committed here. That belongs to the build.
- Caveats that bear on the readings, none of which changes an eligibility cell, are in `…41ff7c05`.
