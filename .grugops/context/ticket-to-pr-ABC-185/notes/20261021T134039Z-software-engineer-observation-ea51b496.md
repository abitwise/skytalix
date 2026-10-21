---
id: 20261021T134039Z-software-engineer-observation-ea51b496
kind: observation
by: software-engineer
at: 2026-10-21T13:40:39Z
verified_by: 
confidence: high (scripted at code commit and at merge; gates run)
refs:
  - ABC-185
  - ABC-165
  - ABC-186
  - plans/traceability.md
  - grugops/ABC-185
  - bf6fc623
  - 745c6225
  - 528c9ef0
  - 80de5949
  - 20261021T115747Z-ba-pm-decision-d2b9bf09
  - 20261021T115748Z-ba-pm-decision-e9a6c68a
  - 20261021T115746Z-ba-pm-observation-50929881
  - 20261021T124943Z-ba-pm-decision-1636e62c
supersedes: 
seal: sha256:45e35383b94fb84ad512c4c2399ff3fd29119cb314eeef42eae3074d243bb688
---

# ABC-185 criteria and gates: A1–A6 MET at code `745c6225` and merge `528c9ef0` (main `80de5949`); 59/1987; waiver empty

- **A1** `A1-cells`: 86 names at base `bf6fc623` and at main `80de5949`; `[]` at `745c6225` and `528c9ef0`. Scope 1 extras beyond the 85: 1 (`ABC-184`, known); after-rule extras: 0.
- **A2** paired by Ticket cell and order: 86 of 86 equal after the strip; every head row splits into 10.
- **A3** `|` lines 705 = 705 (base → code); 706 = 706 (main → merge). Line count unchanged; every non-repaired line identical in place.
- **A4** (a) 86 Ticket cells byte-equal; (b) 3 branch cells outside Code, all explained (decision note); (c) map in the artifact-ref note and the done record; (d) is QE's. SE side reading: `marked` 15.0.12 GFM at code gives 2 tables, 703 `<tr` = 705 − 2, each with 10 cells.
- **A5** `main...HEAD` names only `plans/traceability.md`; `-U0` removed lines = the 86 source rows (multiset), added = their 86 repairs.
- **A6** `A1-fragments` `2 0` at base, code and merge.
- **Merge** of main `80de5949` → `528c9ef0`: no conflict; main's `ABC-164 (Scribe amend-90)` row kept verbatim at the tail.
- **Gates** (code tip and merge): lint, typecheck and build exit 0; `npm test` 59 files / 1987 passed, `last-run.json` success true, 0 failed, 0 pending, 0 todo; skip-integrity `--skip-count 0` "No findings."; no timing taken. UAT waiver in AGENTS.md's form on `745c6225` and on `main...HEAD`: empty (grep exit 1).
