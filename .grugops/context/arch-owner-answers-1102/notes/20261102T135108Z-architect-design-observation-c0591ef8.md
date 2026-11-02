---
id: 20261102T135108Z-architect-design-observation-c0591ef8
kind: observation
by: architect-design
at: 2026-11-02T13:51:08Z
verified_by: 
confidence: high
refs:
  - arch-owner-answers-1102
  - grugops/arch-owner-answers-1102
  - 7daf8086
  - orch-2026-10-30a/20261102T134058Z-orchestrator-decision-81ae2db4
  - EPIC-011
  - ADR-0059
  - ADR-0058
  - ADR-0057
  - ADR-0056
  - ADR-0044
  - ADR-0025
  - ABC-264
  - ABC-257
  - QE-264-b
  - QE-264-e
supersedes: 
seal: sha256:8986991fc51da4c1ea583c77b02c60814fd22b675c98a2392ae9ef8f2e002a89
---

# arch-owner-answers-1102 artifacts: six ADR files edited (records only); open questions for the Orchestrator

Commit on `grugops/arch-owner-answers-1102` (sha in the brief's Result). Files, all under `memory-bank/50-decisions/`:
- `ADR-0059` - Status ACCEPTED (in force at ABC-264's merge); d2 dated bullet with the derived bound (QE-264-b).
- `ADR-0058` - Status ACCEPTED, NOT IN FORCE; the one switch-on path (ABC-257, A8').
- `ADR-0025` - top dated line and T2 amendment status PARKED with ABC-258; its NEUTRAL question marked answered.
- `ADR-0056` - fourth-fold status block; dated lines in C2' (C), C1 (OQ-3 c), D6 (P, threads place), D7 (Q-3K-3, C, P).
- `ADR-0057` - Status ACCEPTED with OQ answers; D6 dated line; § Inputs for the thread tickets; D7 answered marker.
- `ADR-0044` - Status pointer: D5 amendment coming with the worker-pool ticket; D5 stands until then.

No `src/`, `tools/`, tests, plans or board edits. No NFR file added; `plans/nfr-catalog.md` untouched.

**Open questions (none blocks ABC-264 part 2):**
1. The `ADR-0025` shared-table amendment (TH-1) changes an accepted ADR that OQ-1 did not name: ask the owner when it is written (recommended), or read OQ-1 as covering it. The Orchestrator's call.
2. The threads strand's place (after Phase 2 + R1, TH-1 pullable earlier) is a recommendation; the Orchestrator and BA/PM set it.
3. ABC-257's trigger (C) is met; it is paused by P alone. Lifting it is the Orchestrator's.
4. LOW: the `src/transposition.ts:58-60` comment ("under 10 000 (a full board of queens)") is false; route to the Engineer with the next edit. The FEN reader's unbounded piece count is a named `ADR-0033` residual; no action recommended.
5. LOW: QE-264-e (stalemate at a cut node, same class as null move) is not in this brief; ADR-0059 § Consequences still does not name it.
