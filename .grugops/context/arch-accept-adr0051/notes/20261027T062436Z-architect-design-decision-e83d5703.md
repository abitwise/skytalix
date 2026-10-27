---
id: 20261027T062436Z-architect-design-decision-e83d5703
kind: decision
by: architect-design
at: 2026-10-27T06:24:36Z
verified_by: 
confidence: high: records only; transcribes the owner verbatim word (…047d411f); main state checked read-only at 5dfd818c (git, grep)
refs:
  - ADR-0051
  - ADR-0050
  - ABC-210
  - EPIC-008
  - ADR-0026
  - ADR-0025
  - owner-word-2026-10-27/20261027T062043Z-orchestrator-decision-047d411f
  - memory-bank/50-decisions/ADR-0051-a-check-extension-arrives-at-the-horizon-once-per-line-behind-a-test-only-off-door-pair.md
  - memory-bank/50-decisions/ADR-0050-null-move-pruning-arrives-at-null-window-nodes-with-r-3-behind-a-test-only-off-door-pair-guarded-below-three-non-pawn-pieces.md
  - grugops/arch-accept-adr0051@d62a744d
supersedes: 
seal: sha256:a2e264ea038e3237a974240811b30e1fd965886a0a73a747bc0d06b830c3cb6a
---

# ADR-0051 ACCEPTED (in force on main at ABC-210's merge); ADR-0050 d9 zugzwang.005 depth 12 → 13 (P2)

Owner's verbatim word, transcribed by the Orchestrator (…047d411f): *"yes, accept ADR-0051"*, given to the bundled yes/no "accept ADR-0051, including the zugzwang test change?".

1. **ADR-0051 § Status: PROPOSED → ACCEPTED**, dated 2026-10-27, citing …047d411f. It is in force on main at ABC-210's merge. At main 5dfd818c, src/search.ts and src/engine.ts hold 0 check-extension matches, and grugops/ABC-210 has no commit beyond main. The PROPOSED block is kept as "Previously". If ABC-210 does not merge (S1 NOT MET), a dated "accepted, not in force on main" line follows (ADR-0026 d9 / ADR-0025 D4 form), and the ADR-0050 d9 depth change does not land.
2. **ADR-0051 assigns no § Records or drift rows** (it has no such section), so no row was applied and no other role's row is owed.
3. **ADR-0050 d9:** one dated amendment bullet under the table: zugzwang.005 depth 12 → 13 under ABC-210 (P2), accepted by the owner with ADR-0051 (item 2), effective at ABC-210's merge, not landing if ABC-210 does not merge. The original table row (depth 12) is kept. No other line changed (+5/−0).
4. P1 (ABC-081 A5 re-pin) is the Orchestrator's routing (…75af453c), noted in ADR-0051's status, not ruled here.
5. Checks: reference-check printed "No findings." on both ADRs. `git diff --stat main...HEAD -- src tools package.json` is empty. Class scan over added lines: 0 hits. No npm, vitest or build was run (ticket-to-pr-ABC-210 builds beside this).
