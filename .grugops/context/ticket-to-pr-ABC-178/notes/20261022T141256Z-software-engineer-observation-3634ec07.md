---
id: 20261022T141256Z-software-engineer-observation-3634ec07
kind: observation
by: software-engineer
at: 2026-10-22T14:12:56Z
verified_by: 
confidence: high (every figure was run; counts only, no timing)
refs:
  - ABC-178
  - QE-177-a
  - ABC-167
  - EPIC-007
  - ABC-177
  - ABC-197
  - 43e4996f
  - efaa0a76
  - 20261022T134641Z-ba-pm-decision-8165d1ba
  - 20261022T134635Z-ba-pm-observation-d5e744dd
  - 20261020T220000Z-ba-pm-decision-qe177-a-b-cut-abc178-c-accepted-7c41e9a2
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
  - src/uci-session.test.ts
supersedes: 
seal: sha256:2411ee7fb846afbcff64b0c7723477972573d8c06b84d45a274cd817e6a53f8e
---

# ABC-178 B5 node census: R1 = 655 nodes (≤ 1 000); the other 126 rows are identical node for node

- **Instrument:** `ticket-to-pr-ABC-177/probe/census.mjs`, byte copy. It instruments `deepen`'s return plus per-test hooks. It ran on throwaway copies of B and H (it edits its tree in place), whole file, `--max-old-space-size=400`.
- **Tip:** 127/127 passed. R1 = **655** nodes. Session 1's `go infinite` searches once (U1's 655); session 2 searches nothing. The U1 rows are 655 each and "a stop with nothing held" is 0, as before. File sum 608 965.
- **Base:** 126/126 passed. Comparing the sorted base TSV with the tip TSV minus R1 gives byte-identical files (`cmp`). R1 perturbs no other row's node count.
- The census stays in scratch and is not committed.
