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

## Result

**2026-10-29, BA/PM. Done. Branch `grugops/bapm-ABC-235-split` @ `a9a3fa44` (local, not pushed, not merged).**
Records only, from `main` `a37f1d87`. There is no `src`, `tools`, ADR, board or traceability edit.

- **ABC-240 (new):** "Move ordering without per-move allocation, value-identical: the same order, the same nodes,
  more nodes a second".
  - **Size S, P3, DoR 10/10, Ready.** It is milestone 1's order 8.
  - **Bar:** the Architect's C1–C4 (stable ties, float64 keys, input untouched, no output shared between plies).
    A1 is cross-build identity at depth 5, with every door and `chooseMove`. A2 is the P1/P2 oracle plus one row
    per condition. A3: ≥ 1.03 × median nps on two boards and ≥ 1.00 × on the third. A4: `G1`, `G4`–`G9`. A5: S2,
    no smoke.
  - **If A3 misses:** NOT MET, the branch is not merged, QE files a `failed-attempt` note, and BA/PM closes the
    ticket as dropped with no re-tune. Nothing waits on it.
  - **Pull order:** after `ABC-235` merges, before `ABC-233`/`ABC-234`. Item 2 shares `src/quiescence.ts` with
    `ABC-228`/`ABC-229`.
- **ABC-235:** one dated header entry, after the existing two. It records scope = cuts 1, 3, 5; cut 6 moved to
  ABC-240; the "piece list" and "non-capture legality" candidates struck; cuts 2 and 4 out by reference
  (`…7fc1b90c`); DoR 10/10. No row was rewritten, and the end of the file is untouched.
- **EPIC-010:** a dated amendment block; the ideas row 7; the merge rule's value-identical list; milestone 1's
  order and cost; the scope count (13 engine changes, two value-identical); the tickets table (ABC-235 row updated,
  ABC-240 row 8, rows 9–16 renumbered); the new § Observations (castling attack tests, 2.8 % under `hasLegalMove`
  on kiwipete, no ticket); and § Dependencies.
- **Notes** (task `bapm-ABC-235-split`, sealed with the plugin's `admitAndAppend`, because `propose_note` was not
  available in this session): `20261029T205933Z-ba-pm-decision-4ec24799` (the cut, the edits, the board lines) and
  `20261029T205933Z-ba-pm-observation-884a5e81` (castling).
- **Board lines asked** (the board is the Orchestrator's):
  - **Ready, add:** `- [ABC-240] Move ordering without per-move allocation, value-identical (cut 6, split from
    ABC-235) (size: S, priority: P3, DoR 10/10; S2, no smoke; A3 ≥ 1.03× nps on 2 boards, miss = not merged,
    dropped; pull after ABC-235 merges, before ABC-233/234; item 2 shares src/quiescence.ts with ABC-228/229)`
  - **ABC-235 card, append:** `; DoR 10/10; scope line on page (bapm-ABC-235-split): piece-list + non-capture-legality
    candidates struck`
  - **ABC-233 card and ABC-234 card, each append:** `; after ABC-240 (shared orderMoves)`
- **UNKNOWN - verify:** ABC-240's real nps gain. The bound is 5.6–6.7 %, and `orderKey`'s own work stays.
- **STOP:** none.

### Trace row (10 cells, header order)

| ABC-240 | Move ordering without per-move allocation, value-identical (cut 6 split from ABC-235 per arch …7fc1b90c/…eebca902): C1–C4, A1 identity, A3 ≥ 1.03× nps on 2 boards, miss = dropped; ABC-235 scoped to cuts 1, 3, 5 (header line); castling attack-test observation, no ticket | EPIC-010 | — | NFR-005 (G6 ≥ base), NFR-009 (fixed scratch, growth 0), NFR-004 (clock reads equal), NFR-008 (depth-1 lane rows); no ADR (ADR-0024 mvvLvaKey, ABC-080 contract kept); notes …4ec24799, …884a5e81 | grugops/bapm-ABC-235-split @ a9a3fa44 (records only)<br>plans/tickets/ABC-240-…md (new); plans/tickets/ABC-235-…md (header line); plans/epics/EPIC-010-…md; .grugops/context/bapm-ABC-235-split/notes/ (2) | — (records only) | n/a (records) | not released | ABC-240 Backlog → Ready (DoR 10/10); ABC-235 DoR 10/10; card moves the Orchestrator's |
