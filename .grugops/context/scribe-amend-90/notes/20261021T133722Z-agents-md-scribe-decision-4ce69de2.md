---
id: 20261021T133722Z-agents-md-scribe-decision-4ce69de2
kind: decision
by: agents-md-scribe
at: 2026-10-21T13:37:22Z
verified_by: 
confidence: high on the wording; the Reader clause beyond the brief's four is a judgement QE may overrule
refs:
  - ABC-164
  - QE-164-a
  - QE-164-b
  - memory-bank/90-agents-md-command-log.md
  - grugops/scribe-amend-90
  - d7752d53
  - 20261021T132911Z-qe-e2e-decision-47cae669
  - 20261021T132911Z-qe-e2e-observation-89fca9e3
  - 20261021T132911Z-qe-e2e-observation-71f134f6
  - 20261021T133500Z-orchestrator-decision-cba9c8eb
supersedes: 
seal: sha256:b44e48d50beb3bb3c618875ddace345c5371276d593d388182af3a5a9cba9708
---

# scribe-amend-90: rulings

1. The Reader's "beyond the one-line summary AGENTS.md carries inline" clause was changed along with the "one-line-per-command index" sentence. The brief fences the change to the four sentences; this clause sits in the same Reader sentence group and the same split made it false, so leaving it would leave a known-false claim. Revert that one clause if QE reads the fence strictly.
2. The QE-164-b correction was edited in place in the ABC-164 entry (with a dated "Corrected" marker) rather than only added to the new history row, since the brief says correct it there.
3. QE-164-d (8 stale AGENTS.md section citations elsewhere in memory-bank) and QE-164-c (page row wording) are untouched: outside the fence.
