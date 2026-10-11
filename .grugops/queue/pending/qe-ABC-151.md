---
task: wave-2026-09-25
subtask: qe-ABC-151
role: qe-e2e
ticket: plans/tickets/ABC-151-heat-the-owner-picks-two-test-workers-lower-the-cap-3-to-2-re-pin-it-and-read-wall-and-heat.md
ref: .grugops/context/qe-ABC-151/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-151-two-test-workers (tip fc4ebb33; code 0035001c; base f439c8fd)
base: f439c8fd
---

# Subtask: QE review of ABC-151 (k = 2).

Re-plant every red yourself in your own copies (r1, r2, r3, r3b VITEST_MAX_THREADS=3, maxWorkers: 3) and keep =2/=1
green; read A1 resolved workers (head 2, base 3); A6's 20-run green screen and lane collect-equality; dry-run merge
against the wave tip (ABC-149 also in review, reporter only — check src/cli.test.ts overlap). No timing readings
(the window is Security/NFR's, width 1, later). Commit notes on the ticket branch; never merge. Use /usr/bin/diff.
