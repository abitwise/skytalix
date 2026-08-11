---
task: security-nfr-ABC-017
by: security-nfr
at: 2026-08-12T12:15:00Z
---

# Now-running registry record

Claimed per `agent-factory/workflows/17-task-claim.md` step 2.

`scripts/claim.js` does NOT exist in this repo (there is no `scripts/` directory at all) and
does not ship in the kit at `/Users/olgeroeselg/.grugops/agent-factory/`. The claim was therefore
taken by shell: a single non-recursive `mkdir .grugops/queue/claimed/security-nfr-ABC-017`, which
is the same atomic `mkdirSync` primitive `claimTask` relies on — first claimant wins, a second
gets `EEXIST`. Stated here so the deviation is on the record rather than implied.

Deviation from the subtask brief, recorded honestly: the brief asserts "the `claimed/` parent
exists and is empty". It did NOT exist. `mkdir .grugops/queue/claimed` was run first to create it.
Under `claim.js` a missing parent is a genuine failure that is rethrown, not a lost claim; here it
was a real absence, so it is reported rather than swallowed. This is the sixth consecutive brief
figure from the Orchestrator found to be wrong, and it was found by checking rather than trusting.
