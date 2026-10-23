---
id: 20261023T231000Z-orchestrator-failed-attempt-c3d204a5
kind: failed-attempt
by: orchestrator
at: 2026-10-23T23:10:00Z
verified_by: 
confidence: high
refs:
  - ABC-205
  - a20ae77f
  - 06ff83d7
supersedes: 
seal: sha256:734d1ed7af2e639d03af5ed82d7fa525ceb8244e448dd0217bf6620d926cefc4
---

**ABC-205's code landed on `main` via a records merge — second Orchestrator error of this kind (first: `…4707909a`).** The `arch-rule-ABC-205-stop` brief told the Architect to cut its worktree from `grugops/ABC-205`, so its branch carried the build (`src/evaluate.ts` + 6 test files, +325/−51). The pre-merge `git diff --stat main <branch> -- src` was run and printed the src files, but the merge went ahead in the same command chain (a20ae77f). Not pushed.

**Fixed:** orch-2026-10-24z restores `src/` to `06ff83d7` (pre-merge main); `git diff 06ff83d7 HEAD -- src` is empty. The records from that merge (ABC-205 page § Addendum, PROPOSED ADR-0031 A7 and ADR-0026 amendment, notes) stay.

**Consequence for ABC-205's real merge:** `main`'s history now contains the ABC-205 build commits plus a restore commit. A later plain merge of `grugops/ABC-205` will NOT bring the code back. At that merge, revert this restore commit (or `git checkout grugops/ABC-205 -- <its files>`) and verify the src diff equals the branch's.

**Rule, now hard:** the src-diff check is a separate command whose output is read BEFORE any merge command; a records branch whose src diff is non-empty is never merged as records. Briefs for rulings on a build cut the worktree from `main` and read the build branch via `git show`/its worktree.
