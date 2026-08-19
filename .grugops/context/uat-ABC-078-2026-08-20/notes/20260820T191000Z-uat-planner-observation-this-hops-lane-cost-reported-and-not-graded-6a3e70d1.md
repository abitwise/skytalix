---
id: 20260820T191000Z-uat-planner-observation-this-hops-lane-cost-reported-and-not-graded-6a3e70d1
kind: observation
by: uat-planner
at: 2026-08-20T19:10:00Z
verified_by: 
confidence: high
refs:
  - ABC-078
  - NFR-008
  - N8-LANE
  - ABC-110
  - ADR-0014
supersedes: 
---

# This hop's lane cost — reported, and deliberately NOT graded

**Not a stamp; a hand-authored `observation`.**

| quantity | this hop |
|---|---|
| test files added | **0** |
| tests added | **0** |
| child processes spawned by the default lane | **0** |
| lines added under `src/` | **0** |
| default-lane CPU added (`N8-LANE`) | **0 ms** |
| `N8-SPAWN` | **0 ms** |

**It is not graded, and that is on instruction and on the record, not an omission.** `ADR-0014` ruled
`NFR-008`'s CPU clause **BREACHED at 14.480 s against 13 s**, `ABC-110` is the live `P0` remedy, and
`ADR-0014` makes `N8-LANE` a rate limit rather than a grant — so "0 ms, therefore within budget"
would be exactly the false inference that ruling forbids. **0 ms measured; the clause state is
BREACHED; this hop neither improves nor worsens it.**

**The default lane was not run by this hop.** A UAT is not a gate (`AGENTS.md`); `ABC-078` was gated
on its branch tip and on `main` before merge and the board carries those figures. Re-running the
gate here would have added lane cost for no acceptance value.

**What this hop did cost, out of tree:** roughly 75 seconds of engine wall time across five scripted
sessions of the real CLI (21 replies at ~3 s, plus two short mate runs), all in a throwaway
`git worktree` in the session scratchpad. It touched no repository file to take a reading.
