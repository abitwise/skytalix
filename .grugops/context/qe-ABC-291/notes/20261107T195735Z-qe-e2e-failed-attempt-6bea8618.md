---
id: 20261107T195735Z-qe-e2e-failed-attempt-6bea8618
kind: failed-attempt
by: qe-e2e
at: 2026-11-07T19:57:35Z
verified_by: 
confidence: high: the score and the line are read as sealed; no re-play follows
refs:
  - qe-ABC-291
  - qe-ABC-291-games
  - grugops/ABC-291
  - grugops/qe-ABC-291
  - ABC-291
  - EPIC-011
  - ADR-0075
  - ADR-0056
  - 70d931ab
  - 780d9021
  - PREREG
  - C2-prime
  - FL
  - qe-ABC-291/20261106T210624Z-qe-e2e-decision-a49d69d7
  - qe-ABC-291/20261107T193342Z-qe-e2e-decision-a207a827
  - orch-2026-10-30a/20261107T193003Z-orchestrator-decision-70f8b0c2
  - F4
  - qe-ABC-291/20261107T195735Z-qe-e2e-observation-f1d180b8
supersedes: 
seal: sha256:efc1200dce9e3254f1e346a32c83c5ff9d5e9e83893b6ebfe9099435d47da31f
---

# `ABC-291`'s term (E4b) missed C2′: 46.0 of 100 against ≥ 50.0, clean, on an exact build. **Do not re-play it, and do not bring a second set of values to it**

QE/E2E, task `qe-ABC-291`, the `failed-attempt` d8's table owes. Read: `…f1d180b8`.

- **What was tried:** `ADR-0075`'s form (b), connected, phalanx and backward pawns at d2's hand values, with d3's memo and d5's cut. Candidate `70d931ab` against `780d9021`, 100 games at 100 ms, intent GAIN.
- **What happened:** W/L/D 36 / 44 / 20, 46.0 of 100, 100 of 100 complete, 0 faults, 0 losses on time. Elo −27.9 ± 61.6.
- **The line that fired:** CF5, and F4 on the page: NOT MET, final, not merged, not re-played, back to BA/PM, through CF1–CF10 and d8's table.
- **d11 (d) applies:** no second set of values after this miss. No definition (d1), value (d2), memo form (d3), switch or door (d4) moves to rescue it.
- **Not a defect finding.** K0 to K3 and K7 stand on this tree (`…710af068`). Nothing here says the code is wrong, only that this read did not reach the bar.
- **Not proof the term is worse.** The interval spans 0. The bar is what was missed.
- **Not void.** The read was graded as played under FL. Foreign load was present in 126 of 428 samples, and by FL that changes no line.
