---
subtask: bapm-ABC-235-split
role: ba-pm
ref: .grugops/context/bapm-ABC-235-split/
branch: new grugops/bapm-ABC-235-split from main, worktree ../wt-bapm-ABC-235-split
ids: ABC-240 for the split ticket
---

# Split cut 6 out of ABC-235 into ABC-240; record the Architect's strikes (records only)

## Read
- Architect `arch-ABC-235/…7fc1b90c` and `…eebca902`; ABC-235's page; EPIC-010 (§ milestones, the merge rule, S2).

## Do
- Write ABC-240: "move ordering without per-move allocation" (cut 6). It is value-identical under the Architect's four
  conditions (stable ties, exact keys, input untouched, no shared output between plies), with its oracle and S2 (no smoke).
  Its bound is 5.6–6.7 % and it may miss the 3 % bar alone, so say what happens then. It lands before ABC-233/234,
  which edit the same code. Give its size, priority and DoR.
- Add it to EPIC-010's ticket table and milestone order.
- ABC-235's page: SE `se-ABC-235` builds it in parallel and adds its own dated result line at the end. **Your edit is a
  single dated line in its header block only** (not at the end of the file). It records: scope = cuts 1, 3, 5 per the
  Architect; cut 6 moved to ABC-240; the "piece list" and "cheaper legality for non-captures" candidates struck; cuts
  2 and 4 out, with the reasons by reference. Don't rewrite its rows.
- The castling attack-test observation (2.8 % under `hasLegalMove` on kiwipete): record it in EPIC-010 as an observation
  only.
- List the board lines you want.

## Fences
- Records only: `plans/epics/EPIC-010…`, `plans/tickets/ABC-235…` (the header line only), the new ABC-240, your context.
  No `src/`, `tools/`, ADR or board edits. Never push, force, amend or rebase. Never merge into main.

## Publish
- Seal notes (task `bapm-ABC-235-split`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a
  10-cell trace row into this brief, then move it and its claim.md to done/.
