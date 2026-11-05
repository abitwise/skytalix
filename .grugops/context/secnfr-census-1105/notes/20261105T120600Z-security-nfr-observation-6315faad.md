---
id: 20261105T120600Z-security-nfr-observation-6315faad
kind: observation
by: security-nfr
at: 2026-11-05T12:06:00Z
verified_by: 
confidence: high on the flags (ps, sampler and /proc/stat in every scored run); the figures are ungraded by the PREREG's rule
refs:
  - secnfr-census-1105
  - NFR-008
  - R-N8H-1
  - ADR-0035
  - QE-282-d
  - QE-282-k
  - secnfr-census-1105/20261105T115526Z-security-nfr-decision-b9038a14
  - qe-ABC-282/20261104T230342Z-qe-e2e-observation-dfa196bf
  - 572edf13
  - 7117ce75
supersedes: 
seal: sha256:c32ba8e5fead7c8ec96239bbef9428ae1f755fa719ea4405b907d5e74bbc5190
---

# secnfr-census-1105 session 1 is **not ALONE, so it is reported ungraded.** All 8 scored rounds are flagged: another project's vitest ran through the hold. The PREREG's one re-read applies. It waits for the host to clear, and it is final

Security/NFR, task `secnfr-census-1105`, under the PREREG `…b9038a14`. Records: `raw/out/n8-s1/`.

## What happened
- One hold, 12:00:37Z to 12:05:04Z, 287 s with the 20 s wait-clear. 9 rounds, n = 8 complete scored rounds, every run exit 0 with its expected counts. No output file was empty.
- **Foreign load.** A vitest whose working directory is another project (`grugops`) was named before and after every scored run and in the sampler across the rounds, by many short-lived processes. `foreign_cpu_s` read 3.7–4.0 s in round 0's first two runs and a median of 15.21 s over the scored runs, about 1.5 cores beyond the lane's own. load1 rose 1.99 → 5.24. The host gate (load1 ≤ 8) held, so every run stayed scored.
- **Nothing was touched.** The processes were only read.

## The figures, ungraded, for the record only
H 9.76 s [9.68, 9.96], max 9.97. H2 9.85 s [9.77, 9.92], max 10.03. B 9.79 s [9.69, 9.86], max 10.04. H − B −0.020 s wall [−0.120, +0.100]. The twin was admissible (CPU +0.080 s = 0.24 %, sign 4 / 8).

**The PREREG rule decides this, not the figures:** more than 2 of 8 flagged rounds means the read is not ALONE, so it grades nothing. The 9.76 s fires no line, neither 9.6 s nor 9.5 s, and it may not be cited as a graded median. B's tree graded 9.50 s at QE's read, and here it read 9.79 s, so the load probably cost about 0.3 s. That is an inference from one comparison.

## The re-read, fixed before it runs
- Same arms, same harness, same grader, a fresh output directory.
- It starts only when the host is clear. Under the lock, five samples 3 s apart must name no foreign vitest; if any does, the lock is released and it tries again after 60 s. Nothing else changes. Waiting for a clear host is the "ALONE" the brief asks for, and it looks at no timing.
- It is final, whatever it reads. If it is also not ALONE, or its twin is inadmissible, there is no grade from this hop. The PREREG's G-HOLD then applies, and the last graded read stays QE's 9.48 s at `04ebeb7e` (`qe-ABC-282` `…dfa196bf`).
- The census is taken from the re-read's runs, not from these. The lock used so far is 5 min 7 s, including a 20 s wait-clear.
