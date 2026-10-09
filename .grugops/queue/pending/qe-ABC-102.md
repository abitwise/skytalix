---
task: wave-2026-09-25
subtask: qe-ABC-102
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-102-undo.md
ref: .grugops/context/qe-ABC-102/
build_ref: .grugops/context/ticket-to-pr-ABC-102/   (on the build branch)
enqueued_by: orchestrator
enqueued_at: 2026-10-09T16:50:00Z
branch: grugops/qe-ABC-102
base: grugops/ABC-102-undo @ 7caead3
diff_under_review: 4c5eddc...53fd3d2 (src/); 7caead3 docs
---

# Subtask: QE gate for `ABC-102` (`undo`)

Build: four gates green, 48 files / 1485 passed / 0 skips, four mutants red. Reproduce, do not
re-read: `A1`–`A9` independently.

Focus:
1. `undo` through the real loop, not only `runLines`: after an engine reply, after a claimable
   draw is offered, after `new`, after `quit` → cancel, at 0/1/2/3 plies, and `undo` repeated to
   the floor. The FEN, move list, repetition counts and the next frame's status each time.
2. Classification edges: `UNDO`, ` undo `, `undo\t`, `undo2`, `un do`, and a SAN/coordinate move
   that could collide. Is the command table order still what `A6` claims?
3. `help` on the real frame at the start position and mid-game: hidden count 0 (`ABC-035` `A7`).
4. Re-apply at least two of the build's mutants yourself, and add at least two of your own.
5. The two superseded rows (`:459`, `:1121`) and the foreign-list row: confirm each is replaced by an
   equivalent guard, not just deleted.

`N8-LANE`: report readings only. No Security/NFR trigger on this change.

## Fences
Zero lines under `src/` (probes under `ref:` only), `tools/`, `package.json`. No `plans/board.md`,
`AGENTS.md`, `plans/nfr-catalog.md`, ADRs. Never merge; never push. Own `git worktree` under
`.claude/worktrees/` (symlink `node_modules`); commit messages via a scratchpad file and
`git commit -F`. Another engineer (`ABC-082`) runs tests on this machine — note load on timings.

## Publish
`decision` (PASS / PASS WITH FINDINGS / FAIL) + `observation` notes under `ref:`, a trace row, a
ticket § QE section. Queue pending → claimed → done per Workflow 17. Report: verdict, each
criterion with its reading, the edge cases and results, mutants, gaps, sha, numstat.
