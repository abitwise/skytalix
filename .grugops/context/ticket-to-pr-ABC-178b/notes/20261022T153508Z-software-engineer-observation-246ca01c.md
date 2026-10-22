---
id: 20261022T153508Z-software-engineer-observation-246ca01c
kind: observation
by: software-engineer
at: 2026-10-22T15:35:08Z
verified_by: 
confidence: high (every count was run; no timing)
refs:
  - ABC-178
  - QE-178-b
  - QE-178-a
  - QE-177-a
  - ABC-167
  - EPIC-007
  - efaa0a76
  - 0fb19ab9
  - 0036e5c6
  - d12831c6
  - 43e4996f
  - d781e5e5
  - 20261022T152530Z-ba-pm-decision-1f4936b2
  - 20261022T152530Z-ba-pm-observation-34bf730b
  - 20261022T151738Z-qe-e2e-decision-1ad5f522
  - 20261022T151717Z-qe-e2e-observation-f910b911
  - 20261022T141254Z-software-engineer-decision-82e891e8
  - src/uci-session.test.ts
  - plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md
supersedes: 
seal: sha256:f8416012f2313197e764d24970dd8a6b3e7ede3079d87e8b87d0d771b5d54f57
---

# ABC-178b B5 census: R1 = 655 nodes, file sum 608 965 (equal to QE's tip reading), and the re-check searches nothing

- **Instrument:** `ticket-to-pr-ABC-177/probe/census.mjs`, a byte copy. It ran on throwaway copies of H0 and H1 (it edits its tree in place), whole file, `--max-old-space-size=400`. 127/127 passed on each.
- **H1 (folded):** R1 = **655**, 127 rows, sum **608 965**.
- **H0 (before the fold):** R1 = 655, sum 608 965. Sorted under `LC_ALL=C`, the H1 TSV is `cmp`-equal to the H0 TSV and to QE's `qe-ABC-178/probe/census/census-H.tsv` (tip `80493be0`). Node for node, the fold moves nothing.
- The census stays in scratch and is not committed.
