---
task: wave-2026-09-25
subtask: qe2-ABC-116
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-116-record-the-t2-re-measure-trigger-where-a-hop-will-meet-it.md
ref: .grugops/context/qe2-ABC-116/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-116-t2-carrier (tip ffe52710; fix be6882b8; QE notes 2aaccaf4; base 3c38a8ea)
---

# Subtask: QE re-check of the `ABC-116` repair (QE-116-a..d). Short; no timing readings owed.

The repair notes are under `.grugops/context/fix-ABC-116/notes/` on the branch.
1. Read the changed `ChildOptions` JSDoc lines (points (i) and (iii)) against the CODE yourself: `timeout` is the hang bound `childOf` passes to
   `spawnSync`; the settle is a `sleep` in a child's shell argv (`A9_SETTLE_SECONDS`); `spawnSync(` occurs only inside `childOf`; a child edit
   lands in `CHILDREN` or a constant its argv reads. Every sentence true, none overclaims, A1's four parts still present.
2. Judge the Engineer's refusal to add "or its bound (`timeout`)" as a trigger: correct to leave unruled? (The question is routed to
   Architect/BA-PM, not decided here.)
3. QE-116-c/d: the two logs are `*.log.txt`, `git ls-files '*.log'` empty, the rename note records the right commit, no committed note edited.
4. Fence from git against `3c38a8ea`: only `src/cli.test.ts` under `src/`, comment lines only, catalog/AGENTS.md/board untouched, NFR hash
   base == head, `N8_SPAWN` byte-identical. Gates at the tip. UAT-waiver reading measured yourself.

## Fences
Do not touch `src/`, `plans/board.md`, `plans/nfr-catalog.md`, `AGENTS.md`. Own worktree (sibling of the repo) on `grugops/qe2-ABC-116` off the
tip — NEVER `update-ref` the Engineer's branch. No `--force`, `-D`, `reset --hard`. Never merge or push. `diff` is a git wrapper; use `/usr/bin/diff`
or `cmp`. Notes per Workflow 16 with a PASS / PASS_WITH_GAPS / FAIL verdict, a trace row at the END of `plans/traceability.md`, a dated addendum
to § QE on the ticket. Queue: move THIS FILE to `.grugops/queue/done/qe2-ABC-116.md` and write `.grugops/queue/done/qe2-ABC-116.claim.md` (flat
files); leave them uncommitted. `Co-Authored-By:` trailer with your real model. Remove your worktree when done. Report tip, verdict, gaps.
