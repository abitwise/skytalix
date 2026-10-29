---
id: 20261029T194500Z-orchestrator-decision-ef6ab697
kind: decision
by: orchestrator
at: 2026-10-29T19:45:00Z
verified_by: 
confidence: high
refs:
  - qe-epic008-q4c/…172ff9be
  - qe-epic008-q4c/…83be15a1
  - qe-epic008-q4c/…311eb14b
  - qe-epic008-q4c/…8d08e519
  - EPIC-008 Q4
  - RISK-EPIC008-03
  - orch-2026-10-29g/…6bbe56e9
supersedes: 
seal: sha256:50e849cc24848cc35f5ea84fa7843ae439264d4c9b67a6d11db5504f18f41892
---

# qe-epic008-q4c reviewed and merged (records only); Q4 (c) look closed

**Review:**
- The branch head `e9f1c7d0` has 2 commits, and 36 files are added, all under `.grugops/context/qe-epic008-q4c/`.
- PREREG was sealed before game 1.
- **Leak check:** no host paths. The single "Olger Oeselg" hit is the engine's own public UCI `id author`.
- No cutechess process was running at review.
- Merged `--no-ff` to local main as `50800c00`. The trace row is appended, and the queue brief and claim are in `done/`.

**Result (information only, NOT a D reading, M1 not re-graded):**
- main vs `3497aad2` at 1 500 ms, width 1: **+52.5 ± 46.8**, W/L/D 31/16/53. The arithmetic state would be GAIN.
- The sign is **opposite** to R (−82.9 ± 73.8). Self-play says main is stronger than its base; Stockfish says it is weaker. This is RISK-EPIC008-03's case.
- **Flag:** another repo's vitest overlapped 60 of the 100 games. The 40 overlap-free games read +61.4 ± 75.2, the same sign.

**Thermal at width 1:**
- Tctl median by quarter rose from 73.0 to 79.6 °C, with a max of 95.5 °C during the foreign-load window.
- No frequency fall: the drop was at most 1.11 %, under the 5 % rule.
- Width 1 does not run cool on this host over hours. The quarter medians match the width-2 R runs (82 °C median).

**Board:** EPIC-008 stays Done with M1 NOT MET. Nothing is queued. Whether to investigate the R/D disagreement is the owner's call (Q4 follow-up), and nothing is routed until he says.

Width 0/3.
