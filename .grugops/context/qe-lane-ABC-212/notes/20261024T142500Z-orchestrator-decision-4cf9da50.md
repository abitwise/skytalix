---
id: 20261024T142500Z-orchestrator-decision-4cf9da50
kind: decision
by: orchestrator
at: 2026-10-24T14:25:00Z
verified_by: 
confidence: high
refs:
  - ABC-212
  - AR-212-LANE
  - QE-212L-a
  - QE-212L-b
  - QE-212L-c
  - NFR-008
  - qe-lane-ABC-212/…db746b16
  - se-lane-ABC-212/…a6f0ce67
  - security-nfr-ABC-212/…550e067d
supersedes: 
seal: sha256:22245b6c408237f9a56b7e8ddbd2eba502019c7f999876fbb0fc28f6455fee52
---

# ABC-212 lane fix accepted; merge with the NFR-008 sentinel

- **QE PASS_WITH_GAPS accepted** (`…db746b16`): the six budget-read rows carry A9's acceptance; A9/A12/A13 MET; plants reproduce; the call-through mock does not leak with its guard. UAT stays signed by `…e58d4635` (no production line changed by the fix).
- **AR-212-LANE: CLOSED by the fix** (A9 rows 1 050–1 143 → 155–160 ms, SE `…a6f0ce67`), subject to the sentinel at the merge.
- **QE-212L-a LOW accepted (owner: Orchestrator):** the budget-read stub does not assert `options.now`. The same gap already exists in ABC-167's `movetime` rows; one call site always passes `now`. Test-only one-liner → Backlog note, rides the next uci-session test ticket. Not a merge blocker.
- **QE-212L-b / -c INFO:** closed (harness hunks are not pins; A13 met).
- **Merge:** `grugops/qe-lane-ABC-212` (`ffb71bb1`, contains the Security/fold/runbook line `2079e0df` + fix `814b92a0`) into main; gates + `npm test` Duration sentinel on a clean host (no foreign vitest). Over 10 s on clean readings → withdraw again.
