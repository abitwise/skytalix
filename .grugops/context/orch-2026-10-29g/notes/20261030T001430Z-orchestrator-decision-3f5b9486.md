---
id: 20261030T001430Z-orchestrator-decision-3f5b9486
kind: decision
by: orchestrator
at: 2026-10-30T00:14:30Z
verified_by: 
confidence: high
refs:
  - ABC-235
  - ABC-225
  - ABC-240
  - plans/board.md
  - qe-ABC-235/20261030T001117Z-qe-e2e-decision-c575d703
supersedes: 
seal: sha256:08d470d11903d58334a9c1c4d5fd579d799150ffb75e2c9acbd83f6ecd4d2ac7
---

ABC-235 merged to local main as baf99a7c, under S2 with no smoke, on qe-ABC-235's PASS (…c575d703): A1–A5 met. nps tip/base is 1.262 / 1.284 / 1.200, and every cut is ≥ 1.06.

Review:
- Scope is records only on the QE branch; there are no src, tools or data edits.
- The QE's intermediate commit c9958194 carried a host path in raw/scripts/propose.mjs, removed on the tip by d3587ae9. Before merging, I rebuilt the QE history locally on grugops/qe-ABC-235-clean (b30861fb, 53a1e8ac, e456f1c1). Its tree equals 1cf9ee98, and a leak scan over 6327a3b4..HEAD finds 0 matches. Nothing was pushed, so the path never left the host.
- The SE history main..grugops/ABC-235 is clean.

Board fix: the ABC-235 and ABC-225 rows had been inserted inside the board's HTML template comment, under the example heading "In Review (WIP 2/3)". They are now under their real columns: ABC-235 → Done, ABC-225 → In Review 1/3, and ABC-240 Ready → In Development 1/3.

Next:
- qe-ABC-225 is released and spawns ALONE: base 02fa9556, candidate baf99a7c, 40 games. The Elo figure is INFO only.
- se-ABC-240 spawns only after those games end, because ALONE allows no builds or tests alongside.

OD-235-1 stays INFO to the owner, with the veto open.
