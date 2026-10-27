---
id: 20261027T032409Z-architect-design-decision-aa96534c
kind: decision
by: architect-design
at: 2026-10-27T03:24:09Z
verified_by: 
confidence: high: records only; transcribes QE …e32e0ee4 and Orchestrator …00f47145; main state checked read-only at a5306773 (git, grep)
refs:
  - ADR-0025
  - ABC-209
  - EPIC-008
  - ADR-0026
  - T1
  - S1
  - A6
  - orch-2026-10-27a/20261027T032148Z-orchestrator-decision-00f47145
  - qe-ABC-209/20261027T032028Z-qe-e2e-decision-e32e0ee4
  - qe-ABC-209/20261027T032028Z-qe-e2e-failed-attempt-0932c037
  - arch-accept-adr0025-d4/20261026T133013Z-architect-design-decision-e12dd4c5
  - memory-bank/50-decisions/ADR-0025-the-transposition-table-is-its-own-fixed-structure-cleared-per-search.md
  - grugops/arch-adr0025-not-in-force@c386ea89
supersedes: 
seal: sha256:13e89156483965c8b1aba931c0200937a8738738b9b32cf69eaa23c80b1c2a46
---

# ADR-0025 decision 4 amendment: accepted, not in force on main (ABC-209 not merged)

ABC-209's single reading (A6, D under S1, final) was NOT MET: pooled over 800 games NEUTRAL +8.69 ± 18.25 (QE …e32e0ee4, failed attempt …0932c037, at merge b5f46e86). The Orchestrator accepted the FAIL and did not merge (…00f47145).

1. **ADR-0025 § Proposed amendment 2026-10-26, Status: a dated line "2026-10-27: accepted, not in force on main"** in the ADR-0026 d9 form. It cites the reading, the not-merged ticket (grugops/ABC-209 bb6cf451 kept unmerged) and main's state. Decision 4's clear-per-search stands on main. T1 holds by this reading. The line moves no code.
2. **The top Status pointer** now reads accepted, not in force on main (2026-10-27). The 2026-10-26 "in force at ABC-209's merge" pointer is kept as "Previously".
3. **Synced:** the amendment heading (ACCEPTED, not in force on main), the "Decision 4, as amended" heading, the T1 re-read row (read NEUTRAL; T1 holds) and the Rollback's "After it ships" bullet (not reached). Decisions 1–7 and every other section are unchanged.
4. **Main checked read-only at a5306773:** src/engine.ts:550 still calls clearTable() at chooseMove entry; src/ has no game option, prepareTable or game tracker; grugops/ABC-209 is not an ancestor of main.
5. Checks: reference-check on ADR-0025 printed "No findings." `git diff --stat main...HEAD -- src tools package.json` is empty. Class scan of the added lines: 0 hits. No npm, vitest, build or timing was run.
