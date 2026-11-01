---
subtask: bapm-page-closes
role: ba-pm
ref: .grugops/context/bapm-page-closes/
branch: new grugops/bapm-page-closes from main (worktree .claude/worktrees/bapm-page-closes)
width: records only (no vitest, no engine, no games). qe-ABC-246 holds the host for timing; you must not run anything.
---
# BA/PM: close the ABC-243, ABC-244 and ABC-245 pages (records only, LOW)
## Read
- Each page's front matter and body; the board's Done rows for them; their QE hand-backs in .grugops/queue/done/qe-ABC-24{3,4,5}.md and the QE notes under .grugops/context/qe-ABC-24{3,4,5}/ (and secnfr-ABC-244).
## Do
- Per page: front matter → done / Done with a `closed:` line; a CLOSED block (QE verdict note id, merge SHA from the board); disposition every QE gap (fold, carried with a named carrier, or closed). A gap that needs a new ticket: propose it in your Result, do not cut it unless it is plainly XS and test-only.
- ABC-248's page is out of scope (it is Ready and next to be pulled).
## Fences
- plans/tickets/ABC-243*, ABC-244*, ABC-245* only (plus your context notes). No board, trace, epics, ADRs, src/, tools/, data/. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `bapm-page-closes`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.
