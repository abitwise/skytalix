---
subtask: arch-rule-ABC-205-stop
role: architect-design
ticket: plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
ref: .grugops/context/arch-rule-ABC-205-stop/
branch: grugops/ABC-205 (4f650a45)
width: 3 of 3 (records + light probes)
---

# Rule the SE's STOP on ABC-205 (S1–S3)

## Do
- **S1** (transposition A4 mate-reuse, SEARCH_DEEP): fixture property lost at 160 ticks (depth 9 vs pinned 10; 180 ticks reaches 10). Rule: re-budget to 180 ticks (probe that the table reuse still happens), re-find the fixture, or other. A value-only re-pin under ADR-0028 is yours.
- **S2/S3** (pvs-lmr A1 drift, depth 5, 79 cp vs ADR-0026's 75 cp level): rule whether moving that level is within ADR-0028's headroom rules (yours) or needs the owner (a level that has used its headroom, or an ADR change → owner, PROPOSED). Consider the taper's role.
- Light probes on a scratch copy of the branch only. Write a dated addendum to the ABC-205 Design ruling; list the exact edits the SE may make.

## Fences
- Worktree from `grugops/ABC-205` on `grugops/arch-rule-ABC-205-stop`. Only the ABC-205 page, ADR text if an owner-route is needed (PROPOSED), your notes. No `src/` or test edits. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/rule205/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `arch-rule-ABC-205-stop`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
