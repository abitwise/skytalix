---
id: 20261011T084936Z-software-engineer-decision-abc114-a4-strike-and-the-control-7d1f3a90
kind: decision
by: software-engineer
task: ticket-to-pr-ABC-114
at: 2026-10-11T08:49:36Z
verified_by:
confidence: high
refs:
  - ABC-114
  - ABC-113
  - ABC-043
supersedes:
---

# SE `ABC-114`: `A4` takes STRIKE, and the control is `cc037b3e^`, not `main`

1. **`A4` STRIKE, chosen on measurement.** RE-MEASURE requires writing BOTH reachable outcomes. In
   6 of 6 runs the `G03` build played the move, and I never observed the move-eaten outcome. Writing
   it as reachable would mean copying it from the `ABC-043` hop's notes, which `A1`–`A4` forbid. The
   struck clause is replaced by what the re-run showed and why the harness cannot carry a symptom
   claim; the source row is named as the proof. **Pre-registered consequence: the ticket is `XS`.**
   The re-size is BA/PM's to record; I did not edit the size line.
2. **Control.** The ticket's `git show main:…` control has gone degenerate, because `main` now carries
   `ABC-113`. I kept the literal `main` run and added the pre-`ABC-113` file as the row-level control.
   A validator should decide for itself whether that substitution is acceptable.
3. **`ABC-113` page:** the original words are kept, struck with `~~`, and each strike is followed by
   an italic correction naming `ABC-114` and the criterion. For line 106, the struck span also covers
   "not new coverage, and it must not be sold as more", which `M15` falsifies along with
   "unconstructible".
