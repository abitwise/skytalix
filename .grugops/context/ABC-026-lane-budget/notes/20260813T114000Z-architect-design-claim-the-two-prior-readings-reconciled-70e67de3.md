---
id: 20260813T114000Z-architect-design-claim-the-two-prior-readings-reconciled-70e67de3
kind: claim
by: architect-design
at: 2026-08-13T11:40:00Z
verified_by:
confidence: medium
refs:
  - ABC-026
  - ABC-026-A1
  - H5
  - NFR-008
  - arch-audit-2026-08-12
  - audit-delivery
  - plans/nfr-catalog.md
supersedes:
---

# The two prior readings, reconciled: **they never disagreed about the LANE. They disagreed about the HEADROOM, and one of them inferred where the other measured.**

A `claim`, `confidence: medium`, because the *reconciliation* is an attribution of cause and I cannot
re-run either prior hop's session to prove it. **The numbers it rests on are measured (see the two
`observation` notes beside this one); the causal story is my reading and can be attacked.**

## What each said

| | wall | CPU | how obtained | headroom published |
|---|---|---|---|---|
| architecture audit, 2026-08-12 | ~53–59% of 3 s | **~8.6 s inferred**, band 8.24–9.01 | **arithmetic** on a 22-file / 7.640 s figure + 6 × 160 ms | **~14 planning, ~27 ceiling** |
| delivery audit, 2026-08-12 | **1.98 s measured** | **9.51 s measured** | 7 runs, **sequential not interleaved**, symlinked `node_modules` | none published; refused to discharge `H5` |
| **this hop, 2026-08-13** | **1.845 / 1.935 / 2.210 s** | **9.975 / 10.315 / 10.390 s** | 3 samples, interleaved, n = 8, counts asserted per run | **~7 planning, ~16 ceiling** |

## The resolution

**1. The delivery audit is NOT refuted. It was consistent all along.** Its 9.51 s CPU sits **4.5%
below** my quieter sample and **8.5% below** my loaded one; its 1.98 s wall sits **between** my wall
medians. Every gap is comfortably inside the ±22% session fence this catalog records for its own
absolutes. **Its stated reason for not discharging `H5` — runs sequential rather than interleaved — was
correct and is exactly what this hop supplies.** It was also right that the risk narrative is retired:
the lane is not near its budget.

**2. The architecture audit's RULING is confirmed; its NUMBER is not.** Its ruling — *the CPU clause
binds, not wall; reading headroom off the wall clock overstates it* — is **confirmed**, and by a route
it did not have: on this hop's own controls the **wall** clock's identity null (+3.88%, sign 6/8) is
**larger than its own signal for two added test files** (+1.81%, sign 5/8), while CPU's null (+0.48%,
5/8) is ~7x smaller than its two-file signal (+3.49%, 7/8). **That is the sharpest available statement
of the audit's point and it is now measured rather than argued.**

Its **number** was **14–17% low**: inferred ~8.6 s against a measured 9.975–10.390 s.

**3. Why the inference came in low — the part that is a claim rather than a measurement.** The audit
took the catalog's 22-file lane at **7.640 s CPU** and added 6 × 160 ms = 0.96 s. Two things about
that:

- **The 7.640 s was itself the "mid-session" (loaded) sample of 2026-08-10, taken on a 22-file tree in
  a different session.** The audit was explicit that its total was an inference and that absolutes are
  session properties; it flagged its own risk correctly. **The floor arithmetic it applied was sound —
  my re-derived slope of 158.2 ms/file confirms the 160 ms it used to within 1%. The input was the
  problem, not the method.**
- **Added test CONTENT does not explain the gap and I checked rather than assumed.** The lane went
  676 → 807 tests, i.e. **+131 tests**; at the catalog's own 0.35–0.43 ms per trivial test that is
  **46–56 ms**, which is ~5% of the discrepancy. **So the gap is a session/baseline gap, not a content
  gap.**

**4. The consequence, and it is the reason this matters rather than being bookkeeping.** The
architecture audit is the hop that **published the headroom the board is planning against** — *"use ~14
as the planning number and ~27 as the ceiling"*. Measured, those become **~7 and ~16.** **The board has
been planning against roughly twice the headroom it has**, at exactly the moment `EPIC-003` committed
eight tickets implying 7–8 test files.

**Neither audit did anything wrong.** One measured and said its measurement did not discharge the debt;
the other inferred and said its total was an inference. **Both labelled their work honestly, and the
error survived anyway — because a clearly-labelled inference published beside a number is still the
number a planner reads.** That is the transferable lesson from this reconciliation, and it is the
argument for `H5` having been worth closing rather than deferring a third time.
