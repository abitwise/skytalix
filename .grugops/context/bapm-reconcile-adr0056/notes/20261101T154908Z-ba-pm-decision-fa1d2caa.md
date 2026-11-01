---
id: 20261101T154908Z-ba-pm-decision-fa1d2caa
kind: decision
by: ba-pm
at: 2026-11-01T15:49:08Z
verified_by: 
confidence: high: ABC-255 follows ADR-0056 § 'ABC-255 re-pointed again' line by line; ABC-256 closed on the Orchestrator's ruling in the brief and the fold's 'recommend drop'
refs:
  - bapm-reconcile-adr0056
  - ADR-0056
  - a0f9297e
  - fe50a11f
  - dda0185f
  - arch-adr0056-owner-answers/20261101T153456Z-architect-design-decision-d3c756d1
  - arch-adr0056-owner-answers/20261101T153456Z-architect-design-observation-c8c38f1e
  - orch-2026-10-30a/20261101T152518Z-orchestrator-decision-43098cef
  - EPIC-011
  - ABC-255
  - ABC-256
  - S'
  - C3''
  - C2'
  - R-TC
  - C13
  - bapm-owner-answers/20261101T153533Z-ba-pm-decision-cc9d51ed
supersedes: 20261101T153533Z-ba-pm-decision-cc9d51ed
seal: sha256:5b7d6eabea9448ca5136a05d84432db2d53512a4ee84d1890826697b7f8a25e6
---

# Decision: ABC-255 aligned to the merged fold (DoR 10/10, Ready recommended); ABC-256 closed as superseded by C3''

- **ABC-255:** item 1 stays (`d --budget-ms 100`, timemargin 50; C2' at --rounds 50, C3'' at --rounds 200). Item 2 is now `r --budget-ms 500` only: skytalix st=0.5 / timemargin=50, Stockfish pins unchanged, --elo default 1 650; **rpair gains no control** and stays byte-equal. A1 = the C2' and C3'' dry-run rows; A2 rewritten as the S' dry-run row (option.UCI_Elo=1650; a --budget-ms other than 500 refused, as d refuses a budget outside D_BUDGETS_MS); A5 = one real S' on main at E 1 650 reporting the largest overshoot over 500 ms in ms; A6 adds "0 lines under src/" (R-TC item 4). Size S. DoR row 5 met -> **10/10, Ready recommended**; the column move is the Orchestrator's.
- **ABC-256 (B0):** front matter status: dropped, column: Done (the ABC-209 convention for a ticket closed undelivered), a dated CLOSED AS SUPERSEDED block, DoR line struck. No routine Stockfish reading remains for it (ADR status block). The board card move is the Orchestrator's. EPIC-011 ticket row 2 and C13 updated.
