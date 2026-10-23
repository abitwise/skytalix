---
id: 20261022T190056Z-software-engineer-decision-71bb85ca
kind: decision
by: software-engineer
at: 2026-10-22T19:00:56Z
verified_by: 
confidence: high
refs:
  - ABC-199
  - QE-198-a
  - ABC-170
  - ABC-167
  - ADR-0046
  - 08d42d01
  - 3d6856db
  - 20261022T172640Z-ba-pm-decision-479ce351
  - 20261022T172634Z-ba-pm-observation-1563f813
  - 20261022T171339Z-qe-e2e-observation-0751bfeb
  - 20261019T153000Z-orchestrator-decision-owner-word-abc173-lighten-rows-keep-cap-6e1d9b47
  - 20261022T190056Z-software-engineer-observation-c662ec3c
  - 20261022T190056Z-software-engineer-observation-925c7566
supersedes: 
seal: sha256:ebcf24dcf71ce28a1e88724a7d49ac681b2bc3efbb927698a40fa30509dd0972
---

# ABC-199 built: `ABC-170 A2` MAX_NODES 20 000 → 6 000 (d 3 → 2), `ABC-167 A7` row 1 unlimited `go` step 50 → 100 (floor stays 5). No timeout, no fallback taken. K1 is green at base and red at tip

Software Engineer, task `ticket-to-pr-ABC-199`, 2026-10-22. Branch `grugops/ABC-199`, worktree `../wt-ABC-199`, from `main` `08d42d01`. Code commit `3d6856db`; this note's commit is the tip. Not pushed, not merged. Readings: the two observation notes of this task.

## Decisions
1. **N = 6 000.** A1's ≤ 60 % census forces d = 2: any N that lets depth 3 complete reads ≥ 26 543 > 21 455. Inside d = 2, K1 reds row 2 only when the abort lands at 4 698–8 794. 6 000 aborts at 6 746, the middle check point, two 1 024-node intervals from each edge. N stays above depth 1 (602) and depth 2 (2 538), so row 1's form and row 2's `limited.nodes > completedOnly.nodes` hold (6 746 > 2 538). Census 11 221 = 31.4 %.
2. **Step 100 for the unlimited `go` only.** The page fixes it; the census reads free depth 5, so the floor stays **≥ 5** and the title is unchanged. `go depth 3` keeps step 50 (page: capped half unchanged). Census 26 276 = 46.9 %.
3. **A4's fallback is not taken for either row.** Both meet ≤ 60 % with every kill red at base still red at tip, and both preconditions held (d = 2 ≥ 2; floor 5 > 3).
4. **K1 is green at base, reported and not counted (A3).** The plant as built (aborted iteration's best-so-far move and score, depth unchanged) passes base row 2 because depth 4's partial at 20 058 nodes equals depth 3's result (e2a6 / 70). The tip reds it (70 ≠ 109). If QE plants K1 differently, its own base reading decides; this note does not claim the base row discriminated K1.
5. **One comment per changed describe**, naming `ABC-199`, `QE-198-a` and `…6e1d9b47`, in `ABC-170 A3`'s `ABC-173` shape. Counts only; no timing claim.
6. **Merge order (not mine to execute).** `main` has not gained `ABC-178` (still `08d42d01` at 2026-10-22T18:59Z). Before the gate, after `ABC-178` lands, the branch must merge `main` (a merge, not a rebase) and A5/A6 re-read on that base. Nothing here merges into `main`.

## Owed
- QE: A7 (re-plant K1–K4 at base and tip; re-read both censuses; confirm no fallback).
- Security/NFR: A8 (`N8-LANE` owed or not). No `NFR-008` reading was taken.
- UAT: waiver applies (zero production lines; form empty); a waiver is not a signature.
