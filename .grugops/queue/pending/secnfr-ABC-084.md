---
task: wave-2026-09-25
subtask: secnfr-ABC-084
role: security-nfr
workflow: agent-factory/workflows/05-pr-quality-gate.md (Security/NFR step — N8-LANE ruling)
ticket: plans/tickets/ABC-084-tactical-puzzle-suite-strength-regression-gate.md
ref: .grugops/context/secnfr-ABC-084/
build_ref: .grugops/context/ticket-to-pr-ABC-084/   (observation …26f28829: three N8-LANE runs)
enqueued_by: orchestrator
enqueued_at: 2026-10-09T21:40:19Z
branch: grugops/secnfr-ABC-084
base: grugops/ABC-084-puzzle-suite @ e426e91
---

# Subtask: rule `N8-LANE` for `ABC-084` (and confirm no security surface)

The build's three admissible runs disagree: +790 ms (load1 54, OVER 650), +400 (31), +120 (24);
direct vitest per-row cost 174–240 ms, ~157 ms of it the `A6` mate-oracle row. Rule it on your own
readings under the instrument's protocol, as quiet as this machine gets (QE runs in parallel —
alternate rounds, record load). If over: the named remedy is moving the `A6` oracle row into
`PUZZLE_DEEP` — say whether that is required, and what `A6` loses in the default lane.
Also: `A5` wall (≤ 60 s) under load; security surface (static data + a test runner — confirm none).

## Fences
Zero lines under `src/`, `tools/`, `package.json`, `plans/nfr-catalog.md`. No `plans/board.md`,
`AGENTS.md`, ADRs. Never merge; never push. Own worktree; link `node_modules` into YOUR worktree
only. **Commit-message files in a PRIVATE scratchpad subdirectory.** Real UTC stamps.

## Publish
`decision` (PASS / PASS_WITH_RISKS / FAIL) + `observation` notes under `ref:`, trace row, ticket
§ Security/NFR. Queue pending → claimed → done per Workflow 17. Report: verdict, readings with
load, required fixes, accepted risks + owner, sha.
