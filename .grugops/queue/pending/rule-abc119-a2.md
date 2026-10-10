---
task: wave-2026-09-25
subtask: rule-abc119-a2
role: ba-pm
workflow: agent-factory/workflows (BA/PM criterion ruling + cut)
ticket: plans/tickets/ABC-119-no-test-anywhere-runs-the-delivered-clis-real-engine.md
ref: .grugops/context/rule-abc119-a2/
source_refs: .grugops/context/ticket-to-pr-ABC-119-r2/ (premise …b7edc319, readings …904f6a64)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T10:02:07Z
branch: grugops/ABC-119-r2 (commit on top of ba20d25 in worktree .claude/worktrees/ABC-119-r2 — the page's § Delivery lives there)
base: grugops/wave-2026-09-25
---

# Subtask: rule `ABC-119` `A2`, and cut the pre-existing `lane-inventory.js` red

The build is done (`ba20d25`). Two `A2` clauses could not be met as written:
1. **"`node tools/grugops/lane-inventory.js` exits 0"** — it already exits 1 on the base (50 collected /
   53 tracked): three tracked probe files under `.grugops/context/` match `*.test.ts`. The new lane
   file is tracked AND collected (the property `ABC-118` exists to check). Rule the reading. Then cut
   the pre-existing red as its own ticket (next free id after ABC-129): decide its fix shape (rename
   probes / tool excludes `.grugops/` / a config change) and owner; name it as a predecessor of any
   ticket that cites "`lane-inventory.js` exits 0".
2. **The paired-cost clause / `N8-LANE`** — three noisy sets (one over 650 ms CPU under load). Rule
   what reading closes it: e.g. QE re-runs it on a quiet machine with a null control, per the
   catalog's admissibility rule. Do not lower the bar.
Amend only `A2`'s wording on the page (and its test note); re-score DoR. Fences: no `src/`, no
`tools/`, no `vitest.config.ts`, no `plans/board.md`, ADRs, nfr-catalog. Decision note per Workflow
16; trace rows at the END of `plans/traceability.md`.
