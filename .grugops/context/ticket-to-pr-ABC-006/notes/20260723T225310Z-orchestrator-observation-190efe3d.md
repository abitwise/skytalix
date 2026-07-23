---
id: 20260723T225310Z-orchestrator-observation-190efe3d
kind: observation
by: orchestrator
at: 2026-07-23T22:53:10Z
verified_by: 
confidence: high
refs:
  - ABC-006
  - EPIC-001
  - NFR-001
  - RISK-001
  - plans/board.md
supersedes: 
---

Gate recommendation for ABC-006: **READY_FOR_HUMAN_REVIEW** (recommendation on recorded output; no merge).

**Gate evidence.** mandatory_gates green: biome 0 errors/0 warnings (safe autofix reformatted the position table), tsc typecheck + build clean, vitest 120 pass (default lane, +24 perft.test.ts). Library files (`perft.ts` and the five prior) 100% coverage. `PERFT_DEEP=1` opt-in lane run green (32 pass, ~36s) verifying the full published table. `npm run perft` harness runs, prints counts + divide + nps.

**Milestone, not just a ticket.** ABC-006 is EPIC-001's acceptance gate: the move generator (ABC-002 + ABC-004 + ABC-005) matches the chess world's published perft counts exactly across all six standard positions. **RISK-001 (a silent move-gen bug invalidating everything downstream) is retired.** NFR-001 first measured here: ~6.2M nodes/sec classic perft, above the 1M target — reported with the ABC-008 leaves-free caveat, not silently accepted; no RISK-002 escalation warranted.

**Branch.** `grugops/ticket-to-pr-ABC-006` stacked on the ABC-005 branch, one impl commit `a517ff7` (also adds `npm run perft` and the deep-suite command to AGENTS.md). autonomy=pr — no merge.

**Board / WIP.** Third entry into In Review → WIP 3/3 (at the limit). ABC-007 is the last of the batch and also depends on ABC-005; when it lands, In Review goes to 4/3 — the pre-authorized overflow (one stacked review unit awaiting a single human merge). Same honest gap as the rest of the stack: no human pr-review-checklist pass yet; UAT column empty.
