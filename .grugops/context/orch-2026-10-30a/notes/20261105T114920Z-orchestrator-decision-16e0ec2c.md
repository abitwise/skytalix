---
id: 20261105T114920Z-orchestrator-decision-16e0ec2c
kind: decision
by: orchestrator
at: 2026-11-05T11:49:20Z
verified_by: 
confidence: high
refs:
  - ABC-282
  - ABC-303
  - ABC-305
  - ABC-291
  - ABC-292
  - ADR-0071
  - ADR-0075
  - QE-282-j
  - QE-282-l
supersedes: 
seal: sha256:fa96e7be9a9b7eb3630f32612bee82d6ee31909db37fe0e6d4a30ace4ae66d4c
---

ABC-282 merged to local main at a6ae8227 on QE's re-issued verdict …5191f871 (PASS_WITH_GAPS, no blocking gap, signs UAT). ADR-0071 is now in force. Post-merge gates on a6ae8227 under the lock: typecheck 0, lint 0, npm test 2 709 passed. Deep lanes of files arriving from either side, all rc 0: evaluate.passer 28, see 52, transposition SEARCH_DEEP 40, transposition ENGINE_DEEP 26, engine 105, uci-session 265. This closes QE-282-j's re-read at merge. Not read here: the default lane's graded time, which the census below reads.

ADR-0075's two branches merged at 8b87759d.

Rulings on BA/PM's open points:
1. Census: …42f7fd67 item 1 settles the question ABC-303's and ABC-305's pages leave open. It gates the next lane-adding merge after ABC-282. It does not gate either build.
2. ABC-292's ADR may follow ADR-0075 d12 as a pattern before ABC-291 merges, since the owner accepted it. d11 (d) still goes to him in that ADR. If ABC-291's probe stops the work, the dated lines fall per its § Rollback and a BA/PM hop corrects the pages.
3. ABC-291's size stays S-M until the probe; re-priced at the K2 list.

Next, three at a time: se-ABC-303-main (critical path), secnfr-census-1105, bapm-ABC-282-close. Then arch-ABC-282-close (ADR-0066 d5 line, QE-282-l) and the AGENTS.md hop. ABC-305's read and ABC-291's probe follow the census.
