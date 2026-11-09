---
id: 20261109T213744Z-orchestrator-decision-092956f8
kind: decision
by: orchestrator
at: 2026-11-09T21:37:44Z
verified_by: 
confidence: high
refs:
  - EPIC-011
  - ABC-298
  - ABC-295
supersedes: 
seal: sha256:214fd26a1f48fa2bed0ce76578b514e3b8f972bb94272f4bb9ef38380cfe8913
---

Owner, 2026-11-09: "create new ticket for group-based testing as you described. Basic logic for each group is to merge them together into one branch and test on that branch, find suitable testing strategy that doesn't take too many hours and write it down. Don't start any test yet, just cut the ticket."

**The groups** are those I gave him:
- A: speed, same moves (ABC-250, 251, 252, 253; 298 left out).
- B: hash table (ABC-209/257, 237, 238, 258).
- C: pruning (ABC-264, 284, 285, 287, 289).
- D: extensions (ABC-210, 296, 297).
- E: evaluation terms plus joint tuning (ABC-205/290, 207/306, 291, 292, 308, 293, with 239/301).
- F: endgame (ABC-272, 294).
- G: threads (ABC-266).
- H: program features (ABC-038, 219, 211).
- I (readings) and J (process) are not groups to test. I reduces to one closing reading.

**Route:**
1. QE writes the test strategy as a sealed note (records only, nothing run).
2. BA/PM cuts one ticket carrying it.

No test, build or game runs until the owner's later word. His standing rules bind the strategy: one core under the host lock, no SPRT, 100 games per change and 400 per epic, any run over 1 h asked first, and a held host for timing and games.

**Fact for both hops:** the kept code branches are 42 to 2 378 commits behind main. The strategy must say how a group branch is formed when the old code no longer merges.
