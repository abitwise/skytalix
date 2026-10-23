---
id: 20261023T103455Z-qe-e2e-observation-fc6590fe
kind: observation
by: qe-e2e
at: 2026-10-23T10:34:55Z
verified_by: 
confidence: high (QE's own run; 174b, 174a and strict 174 agree)
refs:
  - ABC-197
  - qe-timing-ABC-197
  - 1f2aa4b0
  - 051d557a
  - 20e397c8
  - 79751ae0
  - plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md
  - src/uci-session.test.ts
  - 20261023T083429Z-qe-e2e-decision-479b5c68
  - 20261023T080227Z-architect-design-decision-578a9290
  - A7
  - NFR-008
  - ABC-177
  - ADR-0035
  - QE-177-b
supersedes: 
seal: sha256:5316fe803622dd6d2ac81a7608b70d6257eb1c771ac6ad65d29d3c9c75775ba5
---

# `ABC-197` A7 (`NFR-008` R-1, full lane): **MET.** H's median wall is **8.935 s** [8.68, 9.11] ≤ 10 s. B's is **8.815 s** [8.66, 8.92]. Both twins are admissible. 0/8 rounds were warm. No owner route fires

**Protocol, as `ABC-177` A9 states it.**
- The command is `npm test` as spelled.
- Arms: B and T = `git archive 051d557a`; H and H2 = `git archive 1f2aa4b0`. Each of the four has its own `npm ci --ignore-scripts`, with no shared, copied or symlinked `node_modules`. All four run vitest 4.1.12.
- `lane174.mjs` (byte copy): CONDS B,T,H,H2, 9 rounds, round 0 discarded, rotated, GAP 0, k = 2.
- The window was `window.mjs`, 180 s foreground, 1 s polls, with 0 foreign polls. load1 was ≤ 8 on every scored run, and AC was read before and after every run (preconditions note).
- Grading view: `readout-nfr008-174b.py` on the H/H2 extract ("thermal kept and flagged"). The strict 174 and the 174a views ran beside it.

**Reading** (stage `full-a1`, lane 10:27:08–10:32:42Z): 8/8 rounds scored, 0 harness errors, status `ok` 36/36, 0 failed, 0 skipped. B and T ran 61 files / 2 018 tests in every run; H and H2 ran 61 / 2 019. Thermal 0 on every run: warm in **0/8** rounds.

| arm | wall median [x(2)..x(7)] | CPU median [x(2)..x(7)] |
|---|---:|---:|
| **B** (`051d557a`) | **8.815 s** [8.66, 8.92] | 25.610 s [25.09, 25.89] |
| T (B's twin) | 8.860 s [8.72, 8.95] | 25.605 s [25.31, 25.88] |
| **H** (`1f2aa4b0`) | **8.935 s** [8.68, 9.11] | 25.855 s [25.06, 26.16] |
| H2 (H's twin) | 8.910 s [8.74, 9.01] | 25.765 s [25.22, 25.89] |

- **`NFR-008` on H (174b):** `A9 STATE at 10 s wall: MET (wall median 8.94 s, R 0.10 s; CPU median 25.86 s reported)`. The strict 174 and 174a views print the same MET. No round was discarded under any view.
- **H/H2 twin:** CPU −0.065 s, sign +4/−4, p 1.000. A1 **admissible** (the limit is 0.388 s). Wall −0.020 s, R 0.100 s.
- **B's median, registered views:** (a) the lane174 summary gives B wall **8.82 s** (8.815 s over the 8 scored runs). (b) `readout-nfr008-174b.py` on the B/T extract, relabelled B→H and T→H2 (`nfr008-full-BT-as-HH2.tsv`), gives `MET (wall median 8.81 s, R 0.15 s)`. It is admissible, with 0/8 warm and load1 2.88–5.15.
- **B/T twin** (lane174 summary): CPU +0.025 s (0.10 % of B), sign 4/8, R 0.160 s, **admissible**. Wall +0.025 s, R 0.150 s.
- **H−B** (lane174 summary): wall **+0.090 s** [+0.010, +0.200], sign 7/8. CPU **+0.245 s** [+0.030, +0.420], sign 7/8. The page estimated ≈ +0.075 s of wall, and the reading's interval contains it.
- **Headroom on H:** 10 − 8.935 = **1.065 s**. H is also ≤ 9.2 s.

**Routes.**
- H ≤ 10 s, so **no owner escalation** (`ADR-0035` D6 does not fire) and the page's fallback (drop R2, accept QE-177-b) is not needed.
- The `NFR-008` state is Security/NFR's to rule.
