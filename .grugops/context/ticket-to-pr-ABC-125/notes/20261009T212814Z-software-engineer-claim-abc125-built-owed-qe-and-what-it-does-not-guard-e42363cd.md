---
id: 20261009T212814Z-software-engineer-claim-abc125-built-owed-qe-and-what-it-does-not-guard-e42363cd
kind: claim
by: software-engineer
at: 2026-10-09T21:28:14Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ABC-125
  - ABC-085
  - ABC-087
  - G-QE-1
  - G-QE-2
  - M5
supersedes: 
---

# `ABC-125`: built, with QE owed; what the row does and does not guard

Hand-authored, no seal (degraded posture, `AGENTS.md`). This is unverified until QE's hop.

- **Built, not reviewed.** `A1`, `A2` and `A3` read as met on the branch (observation `…8181a086`).
  Owed: the QE hop (`AGENTS.md` § QE validation authority), the `In Review` board move (the
  Orchestrator's, since `plans/board.md` is fenced from this subtask), and the merge. Nothing was
  merged or pushed.
- **UAT:** the delivered diff carries zero production lines. If the merge commit keeps it so,
  the 2026-08-17 waiver applies, measured at merge, not asserted here.
- **What the row guards:** a step shared across instances by any module-level variable, where the
  last factory call wins (`M5`). It would also catch a step that leaks the other way (first call
  wins), because the first `b()` read after `a()` must advance by 0.5 and the next `a()` by 1.
  That second case was **not** run as a mutant: `UNKNOWN - verify`.
- **What it does not guard:** small positive steps (`G-QE-2`, which is `ABC-084` `A4`'s guard),
  and engine state across two engines (the `ENGINE_DEEP` interleaved row).
- **Downstream:** `ABC-085`'s hard prerequisite is met once this merges. `ABC-087`'s soft one is
  met too. The sequencing is the Orchestrator's.
