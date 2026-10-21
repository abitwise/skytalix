---
id: 20261021T134733Z-qe-e2e-observation-15ca26fd
kind: observation
by: qe-e2e
at: 2026-10-21T13:47:33Z
verified_by: 
confidence: high
refs:
  - ABC-185
  - plans/traceability.md
  - grugops/ABC-185
  - grugops/qe-ABC-185
  - bf6fc623
  - 745c6225
  - 3d166e01
  - a78c353a
  - 6273bed2
  - QE-185-a
  - QE-185-b
  - QE-185-c
  - QE-185-d
supersedes: 
seal: sha256:3a5e5434d46ba1ee3e807b95eac531fbe23f5dda4d9e7d4c663a815b17deb1f7
---

# ABC-185 QE gap register: 4 INFO, 0 blocking

- **QE-185-a (INFO):** 5 branch references sit outside Code: :1239, :1244, :1250 in Status (A4 (b)'s named exceptions), and :1177, :1180 in Title (`<sha> on grugops/ABC-173`, a form A4 (b)'s regex misses). A2's word order forces all 5; ruled accepted. Moving them needs a word move, which is out of scope.
- **QE-185-b (INFO):** other word-order fragments joined under a header of another kind: :1145, :1146, :1155, :1160, :1176, :1177, :1187–:1189, :1198, :1229, :1231, and the mixed EPIC/ADR cells. Each was checked against the order-keeping alternatives; ruled accepted.
- **QE-185-c (INFO):** :1190 and :1194 render Code as `branch<br>—` because a bare source `—` was joined in. This is cosmetic; no word is lost.
- **QE-185-d (INFO):** at :1192 and :1198 the A4 (c) map is one of two equal readings (a trailing bare `—`: UAT or Status). The render is the same.
- **Process (not a gap):** the page's short freeze applies from 6273bed2. If `main` moves before the merge, merge it again and re-run A1–A6; `A1-cells` and `A1-fragments` are enough for a tail-only move.
