---
id: 20261027T193628Z-architect-design-decision-c32c79d0
kind: decision
by: architect-design
at: 2026-10-27T19:36:28Z
verified_by: 
confidence: high: records only; transcribes the QE verdict (…b953e670) and the Orchestrator's routing (…85e9c9b2); main checked read-only at 06c1ecc8 (git show, grep, merge-base)
refs:
  - ADR-0051
  - ADR-0050
  - ABC-210
  - EPIC-008
  - ADR-0026
  - ADR-0025
  - S1
  - P1
  - P2
  - orch-2026-10-27k/20261027T193248Z-orchestrator-decision-85e9c9b2
  - qe-ABC-210/20261027T193059Z-qe-e2e-decision-b953e670
  - qe-ABC-210/20261027T193059Z-qe-e2e-failed-attempt-86b45c13
  - arch-accept-adr0051/20261027T062436Z-architect-design-decision-e83d5703
  - memory-bank/50-decisions/ADR-0051-a-check-extension-arrives-at-the-horizon-once-per-line-behind-a-test-only-off-door-pair.md
  - memory-bank/50-decisions/ADR-0050-null-move-pruning-arrives-at-null-window-nodes-with-r-3-behind-a-test-only-off-door-pair-guarded-below-three-non-pawn-pieces.md
  - grugops/arch-adr0051-not-in-force@b6c06557
supersedes: 
seal: sha256:dc973488f9aaebbfed93ce82160b1f3d766686e72608c9f9bd7b417e4eb36b97
---

# ADR-0051 accepted, not in force on main (ABC-210 not merged); ADR-0050 d9 P2 did not land

ABC-210's single reading (A5, D under S1) was S1 NOT MET: d1 NEUTRAL −1.7 ± 22.8, d2 NEUTRAL −7.8 ± 23.0, pooled over 800 games NEUTRAL −4.78 ± 16.21 (QE …b953e670, failed attempt …86b45c13, at merge d71fc369). Not merged (Orchestrator …85e9c9b2); grugops/ABC-210 a96f36b0 kept unmerged.

1. **ADR-0051 § Status:** a dated top line "2026-10-27: accepted, not in force on main", in the ADR-0026 d9 / ADR-0025 D4 form. The ACCEPTED block (owner word …047d411f) is kept as "Previously (2026-10-27)". Bullets: no check extension on main; ADR-0024 d4 stands; P2 did not land, and P1 did not land either. Decisions 1–8 stay as the accepted text. Rollback gets one line: "not reached".
2. **ADR-0050 d9:** the dated P2 line gets "2026-10-27: P2 did not land". zugzwang.005 stays at depth 12 on main. The table row is unchanged (+4/−0).
3. **main checked read-only at 06c1ecc8:** src/search.ts and src/engine.ts have 0 check-extension matches. grugops/ABC-210 is not an ancestor of main. src/search.null-move.test.ts zugzwang.005 reads depth: 12. The ABC-081 A5 row in src/transposition.test.ts reads −485 at depth 3.
4. Checks: reference-check printed "No findings." on both ADRs. `git diff --stat main...HEAD -- src tools package.json` is empty. Class scan over the added lines: 0 hits. No npm, vitest, build or timing was run.
