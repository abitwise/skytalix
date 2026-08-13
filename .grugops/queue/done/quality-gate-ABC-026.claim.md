---
task: quality-gate-ABC-026
by: qe-e2e
at: 2026-08-13T11:43:00Z
---

Queue claim (Workflow 17): atomic `mkdirSync(".grugops/queue/claimed/quality-gate-ABC-026")`,
`recursive: false`, returned without `EEXIST` on the first attempt — so this claim is uncontested.
The parent `.grugops/queue/claimed/` did not exist and was created first as queue-root scaffolding;
git does not track empty directories, and the previous hop left `claimed/` empty. The scaffolding
`mkdir` is NOT the claim — the non-recursive `mkdir` of the task directory is.

This is the queue CLAIM (hard work-ownership), NOT a `kind: claim` context note.
One other agent is live on this machine gating `ABC-021` on its own branch; it holds a different
task id, so no claim contention was possible.
