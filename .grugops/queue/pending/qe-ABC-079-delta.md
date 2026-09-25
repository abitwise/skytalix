---
task: wave-2026-09-24
subtask: qe-ABC-079-delta
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md (delta re-QE after a repair hop)
ticket: plans/tickets/ABC-079-quiescence-search-on-captures.md
ref: .grugops/context/qe-ABC-079/
build_ref: .grugops/context/ticket-to-pr-ABC-079/   (re-hop 3 notes, 20260925T0630–0634Z)
ruling_ref: .grugops/context/ruling-abc079-g1g2/
enqueued_by: orchestrator
enqueued_at: 2026-09-25T07:00:00Z
branch: grugops/qe-ABC-079-delta
base: grugops/int-ABC-079 @ c6b528d
worktree: .claude/worktrees/qe-ABC-079-delta
---

# Subtask: delta re-QE of `ABC-079` after re-hop 3

Your prior verdict (`ref:`, the 20260924T215000Z `decision`) FAILED the ticket on D1–D4.
Architect/Design ruled G1/G2 closed in-ticket (`ruling_ref:`); re-hop 3 (`9a7e549..9d2306c`)
claims to have done it inside the licence. Verify the delta, not the whole ticket again.

## Check
1. D1–D4 (and `search.test.ts:352`): each sentence now TRUE by measurement; no NEW false
   sentence in any changed comment (`ABC-114` standard). `src/search.ts` diff comment-only.
2. G1: the `A5` depth-3 pins red under R2a, R2b, R2c (re-apply yourself; revert, assert
   `git status --porcelain -- src` empty). Any remaining survivor in the class is a gap.
3. G2: the broad-slice coverage check actually guards the split (mutate `broadSlice` to drop
   a root or a position — does a row red?). Deep lanes exit 0; name any case over 50%;
   `A7` slices alone, cold.
4. Licence: every changed line inside the ruling's file:line licence; frozen files byte-identical.
5. Gates: lint, typecheck, build, default lane, skip-integrity. `ENGINE_DEEP=1` once.

## Fences
Zero lines under `src/` in your diff. No `AGENTS.md`, `plans/board.md`, NFR bars. Never merge;
never push. Commit messages via a scratchpad file and `git commit -F`; probes as node scripts.

## Publish
`decision` (verdict) + `observation` (raw readings) notes under `ref:`, trace row, ticket
§ QE (delta). Queue pending → claimed → done per Workflow 17. Report: PASS/FAIL in one line,
each check's reading, any gap, sha, numstat.
