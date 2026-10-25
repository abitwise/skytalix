---
id: 20261025T043100Z-orchestrator-decision-154f2ced
kind: decision
by: orchestrator
at: 2026-10-25T04:31:00Z
verified_by: 
confidence: high
refs:
  - ABC-205
  - ABC-207
  - ABC-215
  - EPIC-008
  - S1
  - G6
  - NFR-005
  - ADR-0031
  - arch-rule-ABC-205-g6/…912bcb0d
  - qe-ABC-205/…234d9814
  - owner-word-2026-10-24/…4c3f7639
  - owner-delegation-2026-10-22/…5aaf7cec
supersedes: 
seal: sha256:d1e6c7c51881ea64906bf0dc30f4a81a3674e9df42610dda70f5dd754062a8a9
---

# ABC-205 closed unmerged under S1 (Architect option 2); D not owed; forward question to the owner

- **Ruling accepted** (`…912bcb0d`): QE-205-a stands; the growth comes from the shelter gate, not the blend; none of 11 counted variants is predicted to clear "≥ base" on position-6, where base sits within ±0.5 % of its depth-8 edge.
- **Delivery call (`…5aaf7cec`), owner informed, veto open: CLOSE ABC-205 unmerged under its ship rule.** The one G6 reading is final and graded as written (`…4c3f7639`). `grugops/ABC-205-final` stays as a branch (a re-open is cheap). No revert of `7c9cd9b9` is owed. **D is not owed** — not run, not spent, and no owner exception is asked for.
- Not chosen: option 1 (spend an owner exception on a predicted FAIL; tunes to one board) and option 3 applied to ABC-205 (a post-hoc goal move).
- **Records carried to main without code:** the QE, SE-integration, owner-words and Architect notes plus the page's `## Reading`, by path from `0daeed42` (the branch itself carries the 7-file `src/` diff and is never merged).
- **Routes:** `bapm-close-ABC-205` (close the ticket and EPIC-008's lines; check ABC-207 and ABC-215 against their "ABC-205 closed under S1" Ready triggers and DoR; add the frozen-clock pre-check step the Architect named to the next EPIC-008 tickets as a process line, no bound) and `arch-adr0031-status` (dated status line on the ADR-0031 addendum: accepted, not shipped — G6 STOP). Records only, in parallel.
- **Owner's forward question (QE-205-c; NFR-005 / EPIC-008 G6 is his bound):** with base on the position-6 depth-8 edge, any eval change costing more than ~0.5 % nodes/s fails "≥ base" unless it shrinks that tree. Keep "≥ base" graded for ABC-207/ABC-215 (default), or make it reported with D as the judge?
