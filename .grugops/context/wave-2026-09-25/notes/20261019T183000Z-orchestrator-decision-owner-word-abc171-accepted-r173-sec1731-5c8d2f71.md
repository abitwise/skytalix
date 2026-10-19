---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-19T18:30:00Z
sealed: false
refs: [ABC-171, ABC-173, R-173-1, R-173-2, SEC-173-1, ABC-176]
---

# Owner word, 2026-10-19: ABC-171 UAT accepted; R-173-1/R-173-2 accepted; SEC-173-1 → follow-up

The owner answered three menu questions:

- **ABC-171 UAT:** "Accept". The pack is `uat-ABC-171`, commit `cc49bf0e`: 11/11 scenarios with 4061/4061 checks, plus the ABC-167 regression at 13/13 with 2876/2876.
- **R-173-1 / R-173-2:** "Yes, merge owed (Recommended)".
  - ABC-173 may merge with two readings still OWED: A9 (the `npm test` wall-time twin) and the N8-LANE narrow-set charge.
  - Both arms are fixed: base/twin at `68bbf33f`, head at `9c97dd23`.
  - The Orchestrator takes both readings in the first quiet window.
- **SEC-173-1:** "Cut a small follow-up (Recommended)".
  - BA/PM cuts ABC-176, together with QE-173-d.
  - The goal is that the skip-count capture and the result file fail loudly when the guard refuses a run.

**Merge order.** ABC-171 merges first, then ABC-173. QE-173-g still binds: before ABC-173 is moved to Done, every `AGENTS.md` lane is re-run on the combined tree. The re-run records pass counts and OOM only, with no timing.
