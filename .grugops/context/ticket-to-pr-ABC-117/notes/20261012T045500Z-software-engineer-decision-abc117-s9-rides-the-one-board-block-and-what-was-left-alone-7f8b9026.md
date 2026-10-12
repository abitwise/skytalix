---
id: 20261012T045500Z-software-engineer-decision-abc117-s9-rides-the-one-board-block-and-what-was-left-alone-7f8b9026
kind: decision
by: software-engineer
task: ticket-to-pr-ABC-117
at: 2026-10-12T04:55:00Z
verified_by:
confidence: medium
refs:
  - ABC-117
  - A4
  - A5
  - plans/board.md
  - src/cli.test.ts
supersedes:
---

# Three placement calls this hop made, and what it left alone on purpose

**1. S9 is corrected inside the S6 block, not in a second board block.** The 2026-10-10 re-score adds
S9 (the `ABC-115` entry in `## Done`, *"on that path the delivered build still exits `1` =
`USAGE_EXIT_CODE`"*) under `A4`. The subtask's fence allows **one** append-only S6 correction on
`plans/board.md` and nothing else. Both bind, so the one block (two added lines: a blank and the
paragraph, directly after the S6 header) names and corrects **both** clauses, S6 by position and S9
by its entry. S9 does not get a block next to its own line. **If the Orchestrator wants a block
adjacent to S9, that is a second board edit and needs the fence widened.**

**2. S7 was not deferred.** The page offered deferring S7 until `ABC-115` closed. It closed (`Done`,
owner-signed), so that condition is gone and S7 landed as an append-only block, zero deletions.

**3. Left alone, flagged:**
- `src/cli.test.ts:3251` (`ABC-115` `A2`): *"it exited `1`, `USAGE_EXIT_CODE`, on both"*. It is about
  the **`EPIPE`** path on the build **before** `ABC-115`, and it reads as a statement of the shared
  value (what the shell could not tell apart), not of an assignment. Not in the inventory and not
  CLAIM-B as written, so it is untouched. *Unverified, for the record:* whether the pre-`ABC-115`
  `EPIPE` `1` was also an unhandled exception was not measured here.
- Board `:871` on `main` (`:873` on the branch) also says *"the accepted non-`EPIPE` `1`/`USAGE_EXIT_CODE` residual is NOT pinned"*.
  That names the residual by its observable collision, which is accurate, so it is not treated as a
  CLAIM-B site. The same line already carries an earlier appended admission that its S9 clause is false.
- `src/cli.test.ts:3376` on the branch (`:3372` on `main`; comment, same `A10` block) still cites the re-throw at `src/cli.ts:159`; it is
  `:160` today. That is a line-number drift, not this ticket's false clause, and it is not edited.
- Every CLAIM-A site (`ABC-115` page `:62`, `:117`; `ADR-0016:112`; the two
  `cut-epipe-regression-2026-08-20` notes): not touched.
