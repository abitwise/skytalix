---
id: 20260818T160500Z-ba-pm-decision-four-dor-re-scores-and-what-a-merge-can-and-cannot-discharge-8b41d0c7
kind: decision
by: ba-pm
at: 2026-08-18T16:05:00Z
verified_by: 
confidence: high
refs:
  - ABC-033
  - ABC-034
  - ABC-078
  - ABC-079
  - plans/tickets/ABC-033-one-prompt-both-formats-and-the-ambiguity-outcome.md
  - plans/tickets/ABC-034-rejections-that-teach.md
  - plans/tickets/ABC-078-iterative-deepening-and-the-engine-seam.md
  - plans/tickets/ABC-079-quiescence-search-on-captures.md
  - plans/board.md
  - agent-factory/checklists/definition-of-ready.md
supersedes: 
---

Four Definition-of-Ready re-scores, taken against the tree at `main` HEAD `7ea9e1b` rather than
against the pages. BA/PM re-scores because the Orchestrator does not re-score another role's DoR —
this board records that rule on the `ABC-036` row. **No ticket was moved out of `Backlog`; column
moves are the Orchestrator's.**

| ticket | old | new | ⚠️ that died, and how | ⚠️ that stand |
|---|---|---|---|---|
| `ABC-033` | 9/10 ⚠️x2 | **10/10** | (3) and (10) — the SAME ordering fact twice — **discharged by measurement**: `ABC-031` merged 2026-08-17, `ABC-032` merged 2026-08-18 | none |
| `ABC-034` | 9/10 ⚠️x2 | **10/10** | (3) and (10) — the same ordering fact twice — **discharged by measurement**: `ABC-032` merged 2026-08-18 | none |
| `ABC-078` | 7/10 ⚠️x3 | **9/10 ⚠️x1** | (3) **discharged by measurement**: `ABC-076` + `ABC-077` merged. (10) **re-scored ✅ by argument, NOT by a merge** — see below | **(5) the `EPIC-005` composition point** |
| `ABC-079` | 8/10 ⚠️x2 | **10/10** | (3) **discharged by measurement**: `ABC-076` + `ABC-077` merged. (10) **discharged by RULING** — the corpus now has one owner | none |

**The distinction I was asked not to collapse, applied.**

- **Blocks BUILDING** — the work cannot start or cannot be finished. **None of the seven ⚠️ on these
  four pages was ever this**, once the merges landed.
- **Blocks VERIFYING** — the work can be built, but a criterion's result cannot be established here.
  **`ABC-078` item 10 is exactly and only this**, and this project already ships `UNKNOWN - verify`
  for a measurement it cannot take on its hardware. A bounded, named, honestly-recorded measurement
  limit is not a *blocker* on readiness; a fabricated one would be a defect, and nothing here
  licenses that. So item 10 flips to ✅ **and the residual is written on the page rather than
  smoothed off it**: `A1`'s number will be true of the machine that ran it and of nothing else, and
  `NFR-005`'s depth-7 level stays PROVISIONAL until `ABC-074` reports. `ABC-074` is visible in
  `Blocked` with its reason, which is where that obligation belongs.
- **Blocks NEITHER** — a forward risk, or an ownership vacuum. `ABC-078` item 5 is the first
  (kept as ⚠️ so it stays routable); `ABC-079` item 10 was the second (ruled, see the separate
  decision note).

**Why "not independent" (INVEST, item 3) dies on a merge and is not merely re-argued.** The INVEST
independence property asks whether the ticket can be built standing alone. It could not while its
inputs were unwritten; it can now, because the inputs are exported in the tree at HEAD and were read
there, not assumed. That is a change in the world, not a change of mind. The same fact was recorded
twice on every one of these pages — once under item 3 and once under item 10 — so a single merge
retires two ⚠️ marks, which is why `ABC-033`, `ABC-034` and `ABC-079` each move by two points.

**Two page-level inconsistencies fixed in passing, neither of which changes a verdict.** `ABC-033`
and `ABC-034` both said in prose *"9 of 10 clean, 1 recorded ⚠️"* while their own tables carried two
⚠️ and their board rows said `⚠️x2`. The table and the board were right and the prose was wrong; the
prose is rewritten. Separately, stale `src/turn-loop.ts` line cites on both pages are corrected —
see the measurement note.

**Nothing under `src/` was touched at this hop, and `.grugops/test-skips.md` was neither read into
nor written.**
