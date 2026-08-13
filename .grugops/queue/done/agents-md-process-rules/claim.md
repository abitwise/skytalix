---
task: agents-md-rules-2026-08-13
subtask: agents-md-process-rules
by: agents-md-scribe
at: 2026-08-13T00:30:00Z
---

Claimed BY HAND, on the same degradation this project has recorded since 2026-08-06. This install has
no `scripts/claim.js`, so Workflow 17 step 2's atomic `claimTask` could not be executed; the claim
directory was created with a plain `mkdir` (still the atomic primitive, just not via the sanctioned
script) and this registry record was written by hand. The subtask file was moved `pending/` →
`claimed/agents-md-process-rules/` with `mv` rather than `claim.js` `transition`.

One extra step this hop, recorded rather than glossed: `.grugops/queue/claimed/` did not exist at all
(git does not track an empty directory, and the previous hops' claims all drained to `done/`). The
PARENT was created with `mkdir -p`; the claim directory ITSELF was created with a plain non-`-p`
`mkdir`, so the exactly-once property of the claim is preserved — a second claimant would still take
`EEXIST` on the task directory. A parent-missing error is a genuine failure under Workflow 17 step 2
and not a "claim lost"; it was diagnosed as structural absence, not contention, before proceeding.

This subtask writes `AGENTS.md` and its own notes, and nothing else. No ID is allocated: two BA/PM
lanes hold `ABC-041`–`ABC-049` and `ABC-050`+ concurrently.
