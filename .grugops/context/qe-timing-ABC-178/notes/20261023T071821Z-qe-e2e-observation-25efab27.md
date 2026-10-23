---
id: 20261023T071821Z-qe-e2e-observation-25efab27
kind: observation
by: qe-e2e
at: 2026-10-23T07:18:21Z
verified_by: 
confidence: high (instrument output; all four arms; 0/8 warm)
refs:
  - ABC-178
  - qe-timing-ABC-178
  - 00f77f26
  - a93c1e72
  - 2aeeabda
  - 0036e5c6
  - plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md
  - B8
  - NFR-008
  - QE-178-d
  - ABC-197
  - ABC-198
  - 20261021T071942Z-architect-design-decision-ee7527cc
supersedes: 
seal: sha256:40d6579925a8a13ba4564354e96e9b21e50db82f303728d23859d26a33cd1355
---

# `ABC-178` B8 (`NFR-008` R-1, full lane) on vitest 4.1.12: **MET.** H's median wall is **9.010 s** ≤ 10 s, and also ≤ 9.2 s. B's median on 4.1.12 is **8.985 s**, the first admissible full-lane reading on the new runner. All four arms ran

**Protocol, as `ABC-177` A9 states it.**
- The command is `npm test` as spelled.
- Arms: B and T = `git archive a93c1e72`; H and H2 = `git archive 00f77f26`. Each arm has its own `npm ci --ignore-scripts`, with no shared or symlinked `node_modules`, and vitest 4.1.12 in all four.
- `lane174.mjs` (byte copy): CONDS B,T,H,H2, 9 rounds, round 0 discarded, rotated, GAP 0, k = 2.
- The window was `window.mjs`, 180 s foreground, with 0 foreign polls. load1 was ≤ 8 and power was AC on every scored run (see the preconditions note).
- Grading view: `readout-nfr008-174b.py` on the H/H2 extract ("thermal kept and flagged"). The strict 174 and 174a views ran beside it.

**Reading** (stage `full-a1`, lane 07:09:43–07:15:22Z): scored 8/8, rounds 1–8, 0 harness errors, status ok 36/36. B and T ran 60 files / 1 995 tests in every run; H and H2 ran 60 / 1 996. Warm host: thermal ≥ 1 in **0/8** rounds.

| arm | wall median [x(2)..x(7)] | CPU median [x(2)..x(7)] |
|---|---:|---:|
| B (`main` a93c1e72) | **8.985 s** [8.76, 9.01] | 25.570 s [25.22, 25.91] |
| T (B's twin) | 9.030 s [8.93, 9.09] | 25.915 s [25.40, 26.08] |
| **H (merge 00f77f26)** | **9.010 s** [8.86, 9.03] | 25.655 s [25.46, 25.89] |
| H2 (H's twin) | 8.935 s [8.81, 9.04] | 25.645 s [25.26, 25.89] |

- **`NFR-008` on H (174b):** `A9 STATE at 10 s wall: MET (wall median 9.01 s, R 0.10 s)`. The strict 174 and 174a views print the same MET; no round was discarded under any of them.
- **H/H2 twin:** CPU +0.070 s, p 0.727 (A1 **admissible**; the limit is 0.385 s). Wall −0.060 s, R 0.100 s.
- **B/T twin** (lane174 summary): CPU +0.235 s (0.92 % of B, ≤ 1.5 %), sign 7/8 (two-sided p 0.070 > 0.05), so **admissible**, though near the sign edge. Wall +0.060 s, R 0.190 s.
- **H−B** (lane174 summary): wall **+0.035 s** [−0.100, +0.230]; CPU **+0.020 s** [−0.240, +0.210]. R1's cost is not resolvable at this set's resolution. The page's estimate was about +0.002 s.
- **B's median on vitest 4.1.12** (registered views): (a) lane174's B median wall is **8.98 s** (8.985 s over the 8 scored runs, x(2)..x(7) 8.76–9.01); (b) `readout-nfr008-174b.py` on the B/T extract (relabelled B→H, T→H2) gives `MET (wall median 8.98 s, R 0.19 s)`, admissible, 0/8 warm, with load1 3.90–7.90.

**Routes on the page.**
- H ≤ 9.2 s, so this is the input `ABC-197`'s DoR item 10 waits on.
- B ≤ 9.2 s, so `ABC-197`'s pull trigger (≤ 9.2 s) reads true on `main`.
- H is not > 10 s, so nothing goes to the owner (`ADR-0035` D6 does not fire).
- Security/NFR rules on the `NFR-008` state. This reading is not warm-flagged (0/8), unlike `ABC-177` t3-r1 (9.395 s, warm 5/8).

**For the Architect's clean re-read (`…ee7527cc`).** All four arms ran, and both twins are admissible. The host was owner-quiet (0 foreign at every check), on AC, at thermal 0.
