---
by: security-nfr
at: 2026-08-18T19:00:00Z
task: abc078-secnfr
---
Claimed by hand per AGENTS.md (no `scripts/claim.js` on this install): `mkdir -p
.grugops/queue/claimed` then a bare `mkdir .grugops/queue/claimed/abc078-secnfr`.

Note for the merge: the pending copy of this subtask lives at
`.grugops/queue/pending/abc078-secnfr.md` on `main` (enqueued at `30300d2`), which is AFTER this
branch's base `d36668b`. It is therefore absent from this branch and could not be `git mv`d; the
brief was reconstituted here with `git show 30300d2:...`. Whoever merges this branch must delete
`.grugops/queue/pending/abc078-secnfr.md` on `main` — a tree-level merge will not do it for them.
