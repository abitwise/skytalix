---
id: 20261023T083411Z-qe-e2e-observation-246cfd1c
kind: observation
by: qe-e2e
at: 2026-10-23T08:34:11Z
verified_by: 
confidence: high
refs:
  - ABC-197
  - QE-177-b
  - ABC-177
  - ABC-178
  - ABC-167
  - EPIC-007
  - A1
  - A2
  - A3
  - A4
  - A5
  - A8
  - src/uci-session.test.ts
  - plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md
  - 051d557a
  - 20e397c8
  - 82a3f153
  - 8804937e
  - 20261023T082318Z-ba-pm-decision-4df5ef95
  - QE-197-a
  - QE-197-b
  - QE-197-c
  - QE-197-d
  - QE-197-e
  - A6
  - A7
  - N8-LANE
  - NFR-008
supersedes: 
seal: sha256:a1e6d72f5de52deb70d969714d63ee5a7f67657e5c39983cac777d3089745114
---

# `ABC-197` QE gap register: QE-197-a to -e, all INFO, none blocking. A6 and A7 are owed to the quiet-host timing hop

This is an observation, not a finding: no stamp exists on this install.

| id | sev | gap | owner / disposition |
|---|---|---|---|
| `QE-197-a` | INFO | **Accepted residual.** On the dropped-token path, a capped G in (2 800, 3 000) still passes R2: G 2 801, 2 850 and 2 900 read 3 000, and G 2 999 reads 3 100 (QE scan). It is the 200 ms band U7 had at step 100 before `ABC-177`. | BA/PM accepted it (`…4df5ef95`). No action. |
| `QE-197-b` | INFO | **R2's wording.** The comment's "not U7's 1 000 band" reads 2 000 under the page's erratum. "Pins the dropped-token G to [3 000, 3 200]" names the time window: the G it accepts is (2 800, 3 100], or (2 800, 3 000] after the cap. The title's "searches G = 3 000" is the correct build's reading, not the window the row pins. The asserts are right. | Comment and title only. BA/PM ruled no re-build. Fix it when the file is next touched for a reason of its own. |
| `QE-197-c` | INFO | **A2's literal text.** The hunk adds one blank separator line, which is neither R2 nor a citing comment. QE reads it as R2's layout. It matches the file's style, and `ABC-178`'s R1 carried the same line. | No action. |
| `QE-197-d` | INFO | **The kill rests on one row.** Under QP6 and QP6-2800, the whole lane reds 1 / 2 019, R2 alone. A later change to R2's step (above 100) or to its lower bound reopens QE-177-b, and no other row notices. | Regression risk, recorded for any later lane-trim ticket that touches `src/uci-session.test.ts`. |
| `QE-197-e` | INFO | **Keyword coverage.** R2 runs `go depth 0` only. A wrong G confined to the `nodes` or `mate` drop, off the shared warn path, is caught only by U7 at step 1 000, which catches G ≤ 1 000. | Out of scope by the page ("one row per dropped keyword" was rejected). No action. |

**Owed, not gaps:**
- **A6** (`N8-LANE`, one-file set, ≤ 650 ms CPU, F = 0.070 s per `…578a9290`).
- **A7** (`NFR-008` ≤ 10 s on AC, under `ABC-177` A9's protocol).

Both go to the later quiet-host QE timing hop. This hop took no timing. The seconds that `gp.mjs` and vitest print were not read as readings.
