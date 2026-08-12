---
task: ticket-to-pr-ABC-028-a5
by: software-engineer
at: 2026-08-12T13:35:00Z
---

# Claim record — `ticket-to-pr-ABC-028-a5`

Now-running registry record per `agent-factory/workflows/17-task-claim.md` step 2.

Claimed by atomic `mkdir` of `.grugops/queue/claimed/ticket-to-pr-ABC-028-a5/` — the directory's
existence IS the claim. `mkdir` returned 0, so the claim was won.

**Hand-authored, and this is disclosed, not hidden.** `scripts/claim.js` does NOT exist in this
repo, so `claimTask` / `transition` could not be called. The atomic-`mkdir` property the workflow
depends on is preserved (a single `mkdir` of the task dir, no `-p` on that final component, so a
second claimant would have taken `EEXIST`). The parent `claimed/` directory did not exist and was
created first with `mkdir -p` — that parent create is NOT the claim and is not atomic; only the
task-directory create is.

This is the queue CLAIM (hard work-ownership), NOT the `kind: claim` note of Workflow 16. The two
share no code path, per WF17 § "The claim/note seam".
