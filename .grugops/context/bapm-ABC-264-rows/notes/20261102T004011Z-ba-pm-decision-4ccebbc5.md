---
id: 20261102T004011Z-ba-pm-decision-4ccebbc5
kind: decision
by: ba-pm
at: 2026-11-02T00:40:11Z
verified_by: 
confidence: high (every delta copied from ADR-0059 decisions 2, 4, 7, 8, 9 and F1; nothing run; acceptance of ADR-0059 is the owner's)
refs:
  - bapm-ABC-264-rows
  - grugops/bapm-ABC-264-rows
  - 0866db4e
  - ABC-264
  - EPIC-011
  - ADR-0059
  - ADR-0056
  - ADR-0050
  - ADR-0026
  - ABC-077
  - ABC-078
  - NFR-005
  - NFR-008
  - NFR-009
  - arch-ABC-264/20261102T003352Z-architect-design-decision-b48c5a3e
  - arch-ABC-264/20261102T003352Z-architect-design-observation-1e9c2549
  - bapm-phase1-pause/20261102T001344Z-ba-pm-decision-425d9834
  - 0b73f51d
supersedes: 
seal: sha256:63355d1ba3aefa80e63bcdca992594b28b7ee9be8266fffc2f4a19d727f89b0c
---

# ABC-264 refined to ADR-0059: A1-A4 deltas applied, DoR 10/10 on reading (b), front matter In Development; EPIC-011 P2 rows synced

Authoritative: plans/tickets/ABC-264-p2-reverse-futility-static-null-move-at-shallow-depth-behind-an-off-door-with-mate-check-and-zugzwang-guards.md ## Acceptance criteria and ## Definition of Ready at grugops/bapm-ABC-264-rows 0866db4e. Supersedes the A4 0.90x proposal of bapm-phase1-pause ...425d9834 (that note stays as history; the page strikes the old text).

## Scope
- A1 (ADR-0059 d4): doors searchWithoutReverseFutility(position, depth), chooseMoveWithoutReverseFutility(position, options); export lists grow by three names in all: ABC-077 A6 +2 (door, reverseFutilityCut), ABC-078 A4 +1 (door). "Exactly two names" struck.
- A2 (d2, d7): depth 1-3, null-window only, 120 cp a ply, mate band |beta| >= MATE_FLOOR, zugzwang guard < 3 non-pawn pieces; predicate-table rows per clause (ply 0, depth 4, beta at +/-MATE_FLOOR, in check, two non-pawn pieces); the static-score mate row met by argument (static eval < 10 000, asserted in src/transposition.test.ts); call-through vi.mock of ./legal.ts or ./apply.ts; source row on both negamax bodies.
- A3 (d8): drift bar gains "none beyond 160 cp" in both recursions (search() vs door at d5; chooseMove vs door deepened to 5, clock not expiring); zugzwang rows chooseMove at depths 9, 11, 12, 8, 8, 8, 8.
- A4 (d9): 0.90x replaced by <= 0.75x in both recursions at depth 8 on kiwipete and position-6 (four readings); expected head counts 658 971 / 1 021 190 / 972 596 / 299 183, a differing count explained before A4 is read (instrument check, not a bar).
- Beyond the four (same ADR, consistency only): A5 "G7 only if" resolved to not owed (ADR-0059 Consequences); falsifier dispositions gain F1's "red on an exact predicate is NOT MET, not a defect; 150 cp fallback by the owner's amendment"; Dependencies dated "written, PROPOSED".
- DoR rows 4, 5, 6, 10 re-scored: 10/10 on reading (b). Front matter status in-development / column In Development, following the Orchestrator's pull at 0b73f51d. adr field names ADR-0059.
- EPIC-011: the phase-table P2 row ("owes its ADR" struck, ADR-0059 named) and tickets row 16 (column In Development, DoR 10/10, waits-on rewritten). The brief said "P2 row"; both rows carry ABC-264's stale state, so both were edited.

## Risks
- The read (A6) and the merge wait on the owner's acceptance of ADR-0059; with no answer, no reverse futility on main.
- A missing mate-band guard passes every oracle row; only A2's predicate table catches it (ADR-0059 d8).
- Margin re-read when E1/E2 re-scale the evaluation (ADR-0056 D2; named, not decided).
