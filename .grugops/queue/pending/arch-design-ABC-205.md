---
subtask: arch-design-ABC-205
role: architect-design
ticket: plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
ref: .grugops/context/arch-design-ABC-205/
width: 2 (beside arch-design-ABC-212; disjoint files)
---

# Design ruling for ABC-205 (king safety with queens on, tapered king table) + the ADR-0031 addendum

## Do
- Answer the page's design questions; rule the evaluation shape (queen-on scaling of king exposure, tapered king table, no castled bonus without shelter), the A5 eval-cost bar (≤ 1 100 ns) plan, the relation-test set, and how the build proves S1 (D reading via ABC-204 once it is accepted).
- Write the ADR-0031 addendum as **PROPOSED** (the owner accepted the proposal `…7feb0553`; the addendum TEXT goes to him for acceptance). Keep it tight: what changes in the evaluation contract and why.
- Light probes on a scratch copy only (no `src/` edits); no long engine runs. A dated `## Design ruling` on the page; recommend the next move.

## Fences
- Worktree `../wt-arch-design-ABC-205` on `grugops/arch-design-ABC-205` from `main`. Only the ABC-205 page, ADR-0031 (addendum, proposed), your notes. No `src/`, tests, catalog, board/trace. ABC-212's page/ADR-0045 belong to the parallel hop. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/design205/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `arch-design-ABC-205`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
