---
subtask: arch-design-ABC-210
role: architect-design
ticket: plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
ref: .grugops/context/arch-design-ABC-210/
branch: new grugops/arch-design-ABC-210 from main, worktree ../wt-arch-design-ABC-210
width: 1 of 3 — no real-clock timing (probes on scratch clones only; frozen-clock counts allowed)
---

# ABC-210 design: checks at the horizon (new ADR PROPOSED → owner)

## Do
- Read Orchestrator `orch-2026-10-27d` (this hop's routing note) and BA/PM `bapm-ready-ABC-210/…133465f3`, `…3bbfaa07`. Use the ABC-208 design hop (`arch-design-ABC-208/…012b1053`, ADR-0050) as the model.
- **Pick the form:** (a) a check extension or (b) checks in quiescence, and give the reasons.
  - Form (b) reverses accepted ADR-0024 decision 4 (`src/quiescence.ts:21-24`).
  - Form (a) is a new value-changing heuristic (ADR-0026 d10).
  - Either way, write a **new ADR as PROPOSED**, and state the reading (b) gate: the build may proceed; the ALONE reading and the merge wait on the owner's acceptance. No agent marks it accepted.
- **ADR-0026 door pair:** add an off door per ADR-0026 d10. Rule on which existing rows re-point to it.
- **Rule on:**
  - the extension limits (per-line cap, ply budget) or the quiescence check-generation limits;
  - the interplay with null move (ABC-208, in force): no null move when in check is already the rule; confirm it;
  - the bounded oracle for drift;
  - mate-floor safety.
- **Probes**, on scratch clones of main only:
  - Moved pins: name each one. Any value pin, level or NFR bound that moves → STOP to me.
  - Frozen-clock d7/d8 counts on kiwipete and position-6, base vs each candidate form.
  - Nodes at depth 6 against the page's ≤ 1.5 × base.
  - **Predict G6 against "≥ base" (rule A).** If the chosen form is predicted to meet "≥ base", say that the page's "≥ base − 1" clause can be struck. If no form can meet it, say so plainly with the numbers: that clause then goes to the owner with the ADR.
- **Size check:** as cut, or a split.
- Write the `## Design ruling` into the ticket page. Page amendments that BA/PM must make go in your Result as lines.

## Fences
- Work only in your worktree and `<scratchpad>/arch210/`. No `src/` commits.
- No real-clock search, no G2/G5/G6, and no D.
- Never push, force, amend or rebase. Never merge into main. No board edits.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `arch-design-ABC-210`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
