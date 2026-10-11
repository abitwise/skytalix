---
id: 20261011T111823Z-security-nfr-observation-abc147-review-risks-and-gaps-with-owners-44c6cd6d
kind: observation
by: security-nfr
at: 2026-10-11T11:18:23Z
verified_by:
confidence: high
refs:
  - ABC-147
  - RISK-ABC147-01
  - RISK-ABC147-02
  - NFR-008
  - .grugops/context/ticket-to-pr-ABC-147/notes/20261011T111107Z-software-engineer-observation-abc147-caveats-load-heat-profiler-hangs-144c6b5d.md
  - .grugops/context/ticket-to-pr-ABC-147/probe/raw/a1-lane.tsv.txt
  - .grugops/context/ticket-to-pr-ABC-147/probe/raw/a1-out-12-P-hung.txt
  - .grugops/context/secnfr-ABC-147-review/notes/20261011T111823Z-security-nfr-observation-abc147-review-six-checks-recomputed-baccc2a7.md
supersedes:
---

# `ABC-147` review: two risks and four gaps, each with a named owner. None blocks; none moves the arm

This note is hand-authored and unsealed. The readings behind it are in `…baccc2a7`. Severities are
this role's, with reasons. No ASVS requirement applies: the ticket adds no code, input surface,
network path or secret (L1, `security.block_on: high`; the ticket's "Security: not triggered" holds).

## Risks

### `RISK-ABC147-01`: `--cpu-prof` hangs this lane. **Medium. Owner: QE/E2E**

- **What:** 5 of 18 profiled lane runs hit `run-bounded.js`'s 60 s bound and were killed (exit 124):
  rounds 0, 3, 7, 10 and 12. **0 of 18 unprofiled runs did.** Round 12 started at load1 5.79, so load
  alone does not explain it. The cause is `UNKNOWN - verify`.
- **Why it matters:**
  - A hung run writes no worker profiles. About 1 profiled run in 4 is lost, and a re-read must budget
    for that.
  - The voids may not be random. If the hang falls more often on one workload mix, the surviving runs
    are a selected sample. This review cannot rule that out. The 13 completed P runs, graded or not,
    read (i) in a narrow 37.7–48.2 %, which is reassuring but not proof.
  - A SIGKILL may also lose console output, so the hang's location is unknown.
- **Owner: QE/E2E.** QE is the next role to put `NODE_OPTIONS=--cpu-prof` on this lane (the ticket's
  Test note 4 re-read, or the lever ticket's re-measure). It should log the hang rate it meets and
  should not raise the 60 s bound silently. Whether the cause becomes a ticket is BA/PM's call, and
  the cause does not block `ABC-147`.

### `RISK-ABC147-02`: the ratio is read on 2 files and applied to all of (i-w). **Medium. Owner: BA/PM, when it cuts the `P1` lever ticket**

- **What:** `A2` read the factor on `engine.test.ts` and `search.test.ts`. They hold 14.52 % of
  sampled CPU (median), about a third of (i-w)'s 42.62 %. `A3` applies their ratio to the whole share,
  as the ticket's formula says. If the factor held only where it was measured, R would be 11.65 %
  (lower edge 10.63 %), which is the **middle** arm.
- That is **not** a reading the page allows. The arm stands. But R is a ceiling on an estimate, and
  the cause of the factor is still `UNKNOWN - verify`. Two things are unshown: whether it is the module
  transform at all, and whether it is something a setting can remove, for example worker-thread
  execution itself.
- **Owner: BA/PM, in the lever ticket it cuts.** Its acceptance should be a **measured lane-CPU cut**
  against base, paired and interleaved, not R. It should also carry a cause A/B before any setting is
  chosen. Architect/Design rules the setting inside that ticket.

## Gaps (low; none changes a graded figure)

- **G1. The unused-run count is wrong in three places. Owner: Software Engineer (`ticket-to-pr-ABC-147`).**
  The caveats/A1 notes, the ticket's § Delivery `A5` and the probe trace row say "24 runs" and "15 at
  load1 > 8 plus the 5 hangs". `a1-lane.tsv.txt` says **21 runs**: 20 at load1 > 8, of which 4 also
  hung, plus 12P, which hung at load1 5.79. Correct it with a superseding note and a dated line on the
  page; do not edit the old trace row.
- **G2. The cross-run aggregator is not committed. Owner: Software Engineer.** Its output
  (`a1-summary.txt`, `a3-estimate.txt`) is Python-repr text, and no script that produced it is under
  `probe/`. This review's independent `raw-recompute147.mjs.txt` reproduces every figure, which
  mitigates the gap. It does not close it.
- **G3. The raw `.cpuprofile` files were deleted. Owner: QE/E2E, on its re-read.** The bucket map can be
  audited as code only, not against the real frame urls (for example, a transform-suffixed url
  landing in (i) or (v)). Keep at least one run's profiles, or a url census of every distinct
  `callFrame.url` with its bucket.
- **G4. `A1`–`A3` are not independently re-measured. Owner: BA/PM (the lever ticket) / QE/E2E.** This
  hop took QE's slot under the owner's docs-only rule and re-ran nothing, by instruction. Test note 4's
  "QE re-reads from its own runs" is therefore **not** satisfied by this review. The lever ticket
  re-measures, and that is where it lands.
