---
task: wave-2026-09-25
subtask: bapm-fold-ABC-154
role: ba-pm
ref: .grugops/context/bapm-fold-ABC-154/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/bapm-fold-ABC-154
base: main @ 7fdb5ba8
---

# Subtask: BA/PM folds `QE-154-a` (LOW) from ABC-154 (Done, merged `4537fb11`)

Source: `.grugops/context/qe-ABC-154/notes/…d9ae510a` (verdict) and `…00a2e2c3` (plants). `QE-154-a`: ABC-154's positive check names only two ids (`ABC-031` qe-e2e via `quality-gate-*`, `ABC-072` substitute via `secnfr-*`), so a thinning of the real notes that spares those two folders passes: dropping every real `qe*-` folder on the unfiltered read moves the sweep to 14 covered / 61 findings and the head test stays green; dropping every `quality-gate-*` except ABC-031's gives 69 / 23, also green. The failure is always a false finding, never a false pass; `--ticket` is unaffected.
- Dispose of it: cut a ticket (next free id: check `plans/tickets/` for the highest; the board says `ABC-156`), accept it as a named risk with a trigger, or close it no-action — with the reason. If you cut: name the options QE listed (more ids across folder forms, a note-count floor, a covered-count floor) and pick testable acceptance; any edit to `tools/grugops/qe-hop-integrity.test.ts` changes the N8-LANE set and owes a width-1 lane re-read at its QE hop (and may fire the set's re-read trigger the Architect is re-homing in parallel, `design-ABC-154-close` — cross-reference, do not restate).
- Append-only section on the ABC-154 page recording the disposition and QE-154-b/-c/-d as pointers to the Architect hop.
Edit only `plans/tickets/` (a new ticket if cut, and an append-only section on ABC-154), your notes and the trace row. Recommend column moves; do not edit the board.

## Fences (two hops run in parallel, width 2)
Never merge or push. Do not touch `plans/board.md`, `src/`, `tools/`, `AGENTS.md`. Work in your OWN worktree (`git worktree add ../wt-bapm-fold-ABC-154 -b grugops/bapm-fold-ABC-154 main`); if you need `node_modules` for gates, symlink it into the WORKTREE root only — never `ln -s` in the main checkout. No `update-ref` on another branch, no `--force`, `-D`, `--amend`, `reset --hard`. Take NO timing readings. `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. If you change any committed file other than notes, run the gates before your last commit: `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, `.test-results/last-run.json` success:true. Notes per Workflow 16 under `ref:`, one trace row at the END of `plans/traceability.md`. End commits with a `Co-Authored-By:` trailer naming the model you are. Queue: `mkdir .grugops/queue/claimed/bapm-fold-ABC-154`, then at the end FLAT files `.grugops/queue/done/bapm-fold-ABC-154.md` and `.grugops/queue/done/bapm-fold-ABC-154.claim.md`, uncommitted; `rmdir` the claim dir. Report: branch tip, what you changed (with readings), anything owed by another role or the owner.
