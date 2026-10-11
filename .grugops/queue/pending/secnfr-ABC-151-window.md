---
task: wave-2026-09-25
subtask: secnfr-ABC-151-window
role: security-nfr
ticket: plans/tickets/ABC-151-heat-the-owner-picks-two-test-workers-lower-the-cap-3-to-2-re-pin-it-and-read-wall-and-heat.md
ref: .grugops/context/secnfr-ABC-151-window/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-151-two-test-workers (tip 612b7b6d; code 0035001c; base f439c8fd)
base: f439c8fd
---

# Subtask: ABC-151 window. You are the ONLY hop running (width 1).

Run the window in ADR-0040 addendum 2's FIXED step order (note `…5c4c4ef2`): warm paired runs (base k = 3 vs head
k = 2 + identity twin) → A5 heat sequence k = 2 (27 back-to-back, head only) → A5 heat sequence k = 3 ON THE BASE TREE
(never head with VITEST_MAX_THREADS=3) → cooled state only if A3 > 9.0 s → opt-in lanes' exits (QE-151-d). Log before
each sequence: idle seconds, thermal-gate pass time, battery state, load1; per run: load1 and
`com.apple.system.thermalpressurelevel` before/after (never CPU_Speed_Limit). Grade A3 (warm wall + twin R ≤ 10 s),
A4 (CPU interval wholly below 0), report A5 (first moderate read, count of reads at ≥ 1, k = 2 vs k = 3; "not
separable" if neither reaches 1). Say plainly whether k = 2 reaches moderate heat later/less than k = 3.
Worktrees; commit notes and raw TSVs on the ticket branch; never merge; do not touch src/, vitest.config.ts,
plans/board.md. Use /usr/bin/diff.
