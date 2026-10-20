---
subtask: qe-ABC-177
role: qe-e2e
ticket: ABC-177
branch: grugops/ABC-177 @ f81bf03c (from ff1e375f); worktree ../wt-ABC-177 (read-only for you)
ref: .grugops/context/qe-ABC-177/
---

# QE pass on ABC-177 (lean): default lane under 10 s per ADR-0046

## Read first
- The ticket page (A1–A12).
- ADR-0046.
- BA/PM's step ruling `…e7b3c210`.
- The SE's done file `.grugops/queue/done/ticket-to-pr-ABC-177.md`, with its notes and `probe/` (frozen mutant list, kill sets, census).
- The owner's AC-power rule `…bfdc97e5`.

## Check
1. **A1–A5, A7, A12:** re-confirm independently. Attack them, for example:
   - an A6 fold mutant that writes on `go infinite`, and a second release that writes;
   - a step-only diff;
   - the 126 test names at base and tip.
2. **A6 parity:** re-run the kill sets at base and tip for every changed row. Use the SE's frozen union list; it is frozen before head, so do not add to it after the fact. Grade the SE's choice of the union list where "M01–M11" was ambiguous.
3. **Open points, grade only (do not fix):**
   - **U8 at step 100.** The ticket allows {10, 100} for U8. The ban on cutting a search from ≥ 2 clock checks to 1 is BA/PM's condition on **step 1000** only, so 100 is in-ticket. Grade whether the U8 row still pins what ABC-171 needs.
   - **U1–U7 at step 1000.** Searches now stop at 655 nodes, on clock reads at iteration starts only, and never reach a mid-search clock check. Is any time-limit behaviour now left unpinned on the default lane? Name it as a gap if so.
4. **A8–A11, timing (yours):**
   - N8-LANE on the one-file set, ≤ 650 ms CPU.
   - Full-lane base-vs-head twin: four arms, each with its own `npm ci`.
   - NFR-008 ≤ 10 s; the target ≤ 9.2 s.
   - **AC power is required** for every reading (owner rule). Also required: a foreground-verified quiet window of 180 s with no foreign vitest, no `oeselg-labs/platform` process, and no other hop; load1 ≤ 8.
   - Record power, load1 and process count per run.
   - If no admissible window opens, mark it OWED. Never estimate.
   - Apply the page's escalation: over 9.2 s → O3 note for Architect/BA/PM; over 10 s → owner.
5. **Waiver:** production lines are expected empty, so UAT is waived. Confirm it.

## Fences
- Work in a scratch detached worktree `../wt-qe-ABC-177`, plus twin trees. Remove them all at the end.
- Do not touch `src/` on any branch, `../wt-ABC-177`, `plans/board.md`, `plans/traceability.md`, or any process you did not start.
- Keep forks low. Do not fix anything. Never push, merge or self-sign.

## Publish
- Notes under `ref:`, including a `kind: decision` by `qe-e2e`. Use the sanctioned writer if available.
- `.grugops/queue/done/qe-ABC-177.md` (this brief + `## Result`) and `.claim.md`, uncommitted. Include:
  - the verdict and per-criterion grades;
  - parity, the readings or OWED, and the NFR-008 result;
  - whether R-174-1 is discharged (≤ 10 s, admissible);
  - the gaps `QE-177-*`, the waiver, and a trace row.
