---
id: 20261020T185816Z-software-engineer-observation-abc177-coarse-step-search-shape-90221b3e
kind: observation
by: software-engineer
at: 2026-10-20T18:58:16Z
verified_by:
confidence: high (node counts read); UNKNOWN - verify (whether it matters is BA/PM's or QE's)
sealed: false
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-177
refs: [ABC-177, ADR-0046, 20261020T180000Z-ba-pm-decision-abc177-cut-step-1000-ruled-for-h-and-l-not-h-prime-e7b3c210]
supersedes:
---

# At the chosen steps, the U1–U7 searches never reach an in-search clock check, and U8's level-1 engine searches are one interval

Hand-authored and unsealed. These are counts, not a change request. The criteria are met as written.

- **U1–U7 at step 1 000:**
  - Each 3 000 ms search reads 655 nodes. That is iterations 1 to about 3, ended by the loop-top `now()`
    (`t0+1 000`, `+2 000`, then `+3 000`, which is not below the deadline).
  - It never reaches a 1 024-node in-search check.
  - So ruling condition 2 holds as defined (⌈3 000 ÷ 1 000⌉ = 3 ≥ 2). But the time-limited loop is exercised only at
    iteration boundaries, not mid-iteration.
  - The ADR's Consequences predicted "about 2–3 plies", and this matches.
- **U8 at step 100:**
  - Level 1's 100 ms engine searches are ⌈100 ÷ 100⌉ = 1 interval, against 10 at step 10. That is the
    multi-check → one-check loss the ruling's "why" names.
  - The ruling's condition 2 gates 1 000 only, and the ticket admits {10, 100} for U8 under the owner's word. So 100
    is taken as written.
  - If BA/PM reads the brief's "never cutting a search with two or more clock checks down to one" as applying to U8
    as well, the remedy is one literal (`stepMs: 100` → `10` at line 833). It gives back 40 960 nodes.
