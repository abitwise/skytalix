---
id: 20261021T071942Z-architect-design-decision-ee7527cc
kind: decision
by: architect-design
at: 2026-10-21T07:19:42Z
verified_by: 
confidence: high on the classification as not shown real; the cause of the slow stage is UNKNOWN - verify
refs:
  - ABC-177
  - NFR-008
  - R-174-1
  - ADR-0046
  - A10
  - A11
  - O3
  - 20261021T071304Z-qe-e2e-observation-bc49c2fe
  - 20261021T071305Z-qe-e2e-observation-84059cad
  - 20261021T071306Z-qe-e2e-decision-e808274d
  - 20261021T065500Z-orchestrator-decision-31ab7d2d
  - .grugops/queue/pending/arch-O3-ABC-177.md
  - 20261021T071940Z-architect-design-observation-e8b4d26d
  - UCI_DEEP
  - QE-174-b
  - ba-pm
supersedes: 
seal: sha256:0173c41c760198e18a3e0a25b42349f8101b01a2bed23c3667f564378489e0f4
---

# O3 decision 1 for `ABC-177`: the 9.395 s against 9.2 s gap is **not shown to be real headroom loss**. No new lever now. O3 stays the named next lever, unopened, until one clean re-read

Records only. No lane was run and nothing was timed. The evidence is observation `20261021T071940Z-architect-design-observation-e8b4d26d`.

## Decision
- **Classification: a slow measuring stage, not a short remedy.**
  - The unchanged base code read 10.93 s here, against `QE-174-b`'s 10.010 s on the same code: +0.92 s.
  - The remedy's own saving, H−B wall −1.620 s [−1.710, −1.540], beats `ADR-0046` D3's predicted −0.75 to −1.4 s.
  - The miss, 0.195 s, is under one twin wall R (0.250 s H/H2, 0.280 s B/T).
  - Rebased on `QE-174-b`'s conditions, H estimates at about 8.4–8.6 s. That is an estimate, not a reading.
- **The per-round thermal flag is not the cause by itself.** The thermal-0 rounds 1–3 also read H above 9.2 s
  (median of six, 9.32 s). The whole stage was slow. So the honest label is "stage conditions", not "warm-round noise".
- **No lever is needed now.** `ADR-0046` gets no addendum, because no lever changes. D4's 9.2 s target stands as written.
- **O3 (`UCI_DEEP`) stays the next lever, unopened.** It is MEDIUM risk: the class P/C time-rule rows leave the default
  lane, and it needs an `AGENTS.md` line, a heap-flag pin and an "unset: NOT DEFINED" guard. Its saving is −0.5 to
  −0.7 s of wall (estimate). Spending that on a gap under one R, from a stage whose base read 9 % slow, is gold plate.

## Recommendation to BA/PM (A11's O3 ruling)
**Do not cut tranche 2 on this reading.** Re-decide on one clean re-read of the full lane:
- the A9 protocol, all four arms (B/T, H/H2), so the base is read beside the head;
- owner-quiet: the owner stops the other sessions, as he offered in `…31ab7d2d`;
- AC on every run, load1 ≤ 8, QE's own pre-registration;
- the thermal rule as the owner rules for it (see decision 2's open question).

The re-read routes as follows:
- **H ≤ 9.2 s:** the gap was conditions. O3 closes unopened.
- **9.2 s < H ≤ 10 s:** the loss is real. O3 opens as tranche 2 under a new ticket, costed as in `ADR-0046`, for BA/PM.
- **H > 10 s:** the owner (`ADR-0035` D6).

## Risk named, not decided
If the slow stage is this host's normal state now, every gate reads about 9.4 s. The headroom to `NFR-008` is then about
0.6 s, not 0.8 s. At `ABC-174`'s +0.03 s per ticket, that is about 20 tickets. The clean re-read is what tells the two
cases apart.
