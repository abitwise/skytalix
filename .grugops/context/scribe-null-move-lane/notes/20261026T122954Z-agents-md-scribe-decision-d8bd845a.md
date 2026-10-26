---
id: 20261026T122954Z-agents-md-scribe-decision-d8bd845a
kind: decision
by: agents-md-scribe
at: 2026-10-26T12:29:54Z
verified_by: 
confidence: high: line read back against its neighbours; lane not re-run, QE measured it
refs:
  - ABC-208
  - ADR-0050
  - qe-ABC-208/20261026T122350Z-qe-e2e-decision-0477ac64
  - orch-2026-10-26q/20261026T122626Z-orchestrator-decision-836cb92d
  - grugops/scribe-null-move-lane
supersedes: 
seal: sha256:b233f2e0ab8584aea5c5ec510b748992c2b7898176a48117647fb7a1c9306c7f
---

# AGENTS.md gains the null-move deep lane line (ABC-208)

AGENTS.md Scribe, task scribe-null-move-lane, branch grugops/scribe-null-move-lane from main 3357c882. Not pushed, not merged. Nothing run: the lane was not re-run (QE's run is the evidence: 44/44).

## Change
- Added one line under Commands, after the PVS/LMR deep lane line: Null-move deep lane (opt-in, ABC-208, door / zugzwang guard / oracle rows, 44 rows), command SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.null-move.test.ts.
- AGENTS.md 17,101 -> about 17,300 B (budget 18,432). The 12 coding rules are untouched.

## Checks
- src/search.null-move.test.ts exists on main (blob present at b5c67ab7).
- Flags match the neighbouring SEARCH_DEEP lines exactly: SEARCH_DEEP=1, NODE_OPTIONS=--max-old-space-size=400, npx vitest run <file>. No difference to report.
- Evidence read, not re-run: qe-ABC-208/20261026T122350Z-qe-e2e-decision-0477ac64 (N8-LANE, 44/44 rows, 46.0 s) and orch-2026-10-26q/20261026T122626Z-orchestrator-decision-836cb92d.
