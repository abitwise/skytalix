---
task: wave-2026-09-25
subtask: qe-ABC-122
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-122-gate-hardening-bounded-timeout-and-capacity-guard-test.md
ref: .grugops/context/qe-ABC-122/
build_ref: .grugops/context/ticket-to-pr-ABC-122/
amend_ref: .grugops/context/amend-abc122-a4-pin/
enqueued_by: orchestrator
enqueued_at: 2026-09-25T22:40:00Z
branch: grugops/qe-ABC-122
base: grugops/ABC-122-gate-hardening (tip after this enqueue)
diff_under_review: 0bc31e1...0be1fd2 (merge-base with the wave; see the build's A11 note on the base)
---

# Subtask: QE gate for `ABC-122` (bounded test gate + capacity-guard tests)

Build 12/12 MET (after the `A4` amendment). Reproduce, do not re-read: `A1`–`A12` independently.

Focus:
1. The wrapper under hostile cases: a hang in a grandchild; a child that ignores SIGTERM; a child
   that exits non-zero fast; stdout/stderr with large output and no trailing newline; args with
   spaces/quotes forwarded; SIGINT to the wrapper itself (Ctrl-C) — does it leave orphans?
   Every probe under your own outer hard bound.
2. The capacity-guard rows: re-apply at least two of the six mutants per file yourself.
3. The `A11` base question the build raised (`66a45d1` vs merge-base `0bc31e1`) — rule which base
   reads the fence.
4. `lane-inventory.js` exits 1 on a pre-existing tracked `.grugops/context/ruling-abc079-oracle/probe/vt/oracle.test.ts`
   — confirm it is red at base, name the owner; not this ticket's to fix.

`N8-LANE` and the process-kill security surface are Security/NFR's to rule; report readings only.

## Fences
Zero lines under `src/`, `tools/`, `package.json`. No `plans/board.md`, `AGENTS.md`,
`plans/nfr-catalog.md`, ADRs. Never merge; never push. Own `git worktree` under
`.claude/worktrees/` (symlink `node_modules`); commit messages via a scratchpad file and
`git commit -F`.

## Publish
`decision` (PASS / PASS WITH FINDINGS / FAIL) + `observation` notes under `ref:`, a trace row, a
ticket § QE section. Queue pending → claimed → done per Workflow 17. Report: verdict, each
criterion with its reading, each hostile case and its result, mutants, gaps, sha, numstat.
