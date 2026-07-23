---
id: 20260723T214843Z-orchestrator-decision-8716a338
kind: decision
by: orchestrator
at: 2026-07-23T21:48:43Z
verified_by: 
confidence: high
refs:
  - ABC-003
  - ABC-004
  - plans/board.md
  - plans/traceability.md
  - AGENTS.md
supersedes: 
---

Merge close-out for ABC-003 — recorded because a merge is the one action the factory reserves for humans, so the reason it happened belongs in the trail rather than inferred from a branch pointer.

**What was asked and what was done.** The human instructed "merge the branch and make sure already merged branches are deleted." `grugops/ticket-to-pr-ABC-003` was strictly linear ahead of `main` (2 commits: ec2897f feature, 7b5d00d close-out; plus this bookkeeping commit), so `main` fast-forwarded to the branch tip — no merge commit, no conflicts, no content decision. This bookkeeping (board In Review → Done, trace → Done, metrics throughput 3→4 and WIP 1→0, this note) was committed on the working branch first, so `main`'s fast-forward included it and no agent commit was ever authored on a protected branch — the branch guard held literally.

**Why an agent performed it.** AGENTS.md § Safety rules and the Orchestrator's hard limits state agents never write a protected branch and that humans hold merge — so an agent never *decides* to merge. Here the human decided and issued the instruction explicitly; the agent supplied the keystroke, not the judgment. The same three properties that made the ABC-001/002/008 merge safe hold: the repo has **no remote**, so nothing was published and `hooks/guard.js`'s push-side deny was never in play; a fast-forward is trivially reversible (`git branch -f main 0956fe7`); and the instruction was unambiguous and current. **This is not standing authorization** — the next merge needs the same explicit instruction.

**Branch cleanup.** All branches fully merged into `main` were deleted with `git branch -d` (safe delete — refuses an unmerged branch, so no unmerged work could be lost): the six pre-existing merged branches (ticket-to-pr-ABC-001/002/008, close-tickets-ABC-008-001-002, epic-to-tickets-EPIC-001, idea-to-epics-ABC) and ABC-003's own branch once merged. `main` is the sole surviving branch.

**Board consequence.** Done gains ABC-003 (4 tickets terminal). In mode=lean Done is terminal — merge closes the ticket. **ABC-004 (`blocked-until: ABC-003`) is now genuinely unblocked on the mainline** — its make/unmake extension point is on `main`, not a stacked branch. BA/PM promotes ABC-004 from Backlog to Ready; the Orchestrator can then take it through ticket-to-pr.

**One honest gap carried forward, unchanged from the prior merges:** ABC-003 was not reviewed by a human against `pr-review-checklist.md` before the merge instruction arrived. The gate's READY_FOR_HUMAN_REVIEW recommendation stands on recorded command output, not human sign-off, and the traceability UAT column is empty. Naming it so "Done" is not misread as "reviewed".
