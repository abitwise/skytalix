---
subtask: bapm-close-EPIC-008
role: ba-pm
epic: plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
ref: .grugops/context/bapm-close-EPIC-008/
branch: new grugops/bapm-close-EPIC-008 from main, worktree ../wt-bapm-close-EPIC-008
width: 1 of 1 — records only (no npm, vitest, build, games or timing)
---

# EPIC-008 close, step 4: grade M1–M4 and write the epic close

## Do
- Read Orchestrator `orch-2026-10-28a/…5dbd717b`, `orch-2026-10-28d/…0c5e9315` (all-games is graded), and `orch-2026-10-29a`. Then read QE `qe-epic008-close`: PREREG `…8fb860a9`, readings `…e8d5c13a` and `…f361ab33`, M3 `…ffb593fe`, decision `…bdbccbbf`. Also read the EPIC-008 page as merged (step 3′, step 4, Q1, Q3).
- **Grade M1 by the page's option-B rule** from QE's figures: R(3497aad2) 2 098.5 ± 54.8, R(close 38536a34) 2 015.6 ± 49.5, M1 = −82.9 ± 73.8. Both clauses: ≥ +100, and interval above 0. **State the interval plainly** (it lies wholly below 0) and what that means. Don't soften it, and don't explain it away.
- **Confounds, recorded as facts and not as excuses:** the order was fixed (baseline first, close second); the readings ran back to back; CPU temperature had a median of 82–83 °C (max 87 °C); throttling is UNKNOWN - verify. Reading 1 was at 74.75 % (0.25 inside the band). The close searched ~1 ply deeper (10.09 against 9.13). The D readings in the epic were GAIN for ABC-208 and S1-met for ABC-206. Say whether these leave the M1 grade as it stands (one run, final, `…4c3f7639`) — they do, unless the page says otherwise.
- **Grade M2, M3, M4** from the page and the merged records (M3 from QE's M3 note: G1 54/58, G5, G6 ≥ base on both boards, G8, G9 all MET).
- **Write the epic close:** a dated close block. Set the front-matter per the closed-epic convention. Give the outcome per measure, the tickets shipped and not shipped, and the open owner questions (Q3 did not come up; list any others still open).
- **Follow-up, as a question for the owner and not a decision:** if you judge M1's negative reading worth an investigation (for example an interleaved re-read, a thermal check, or a D of close vs 3497aad2 on this host), write it as one owner question with its cost in hours. A re-run is the owner's word.
- Put the board card lines and the traceability row(s) in your Result. Don't edit the board or `plans/traceability.md`.

## Fences
- Work only in your worktree. No `src/` or `tools/` edits, and no npm/vitest/timing.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `bapm-close-EPIC-008`) with `at` from `date -u`, including a `kind: decision`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
