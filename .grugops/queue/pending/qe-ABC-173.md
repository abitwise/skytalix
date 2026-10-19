---
subtask: qe-ABC-173
role: qe-e2e
ticket: ABC-173
branch: grugops/ABC-173 @ 840ebbf7 (from 68bbf33f)
ref: .grugops/context/qe-ABC-173/
---

# QE pass on ABC-173: vitest heap ceiling, 2 executors (lean)

## What you are checking
The delivery at `840ebbf7`. Your job is to break it and report the gaps.

## Read first
- The ticket page.
- ADR-0008 § ADDENDUM 2026-10-19, which is ACCEPTED (`…9f3b6e20`).
- The owner's word `…6e1d9b47`: lighten the rows, keep the cap.
- The SE's done file `ticket-to-pr-ABC-173.md` and the notes on the branch.

## Check
1. **Guard and pins.** Each criterion C1, C2 and A1–A8 must hold, and each must fail on a wrong build. Use mutants on scratch copies of:
   - `tools/grugops/heap-guard.js`: its row choice, its file counting, and its above-row comparison (`>` versus `>=`);
   - the `CLI_DEEP` argv heap token;
   - the A3 static row: what happens if one `AGENTS.md` line is dropped or carries the wrong flag;
   - the C2 parser;
   - the A6 static row.
2. **The lightened rows.** ABC-170 A3 moved to step 5, and ABC-167 A5 `movetime 100` moved to step 10. Re-run the SE's discrimination claims. M15 must still kill all six A3 rows, and the A5 row must keep the same kill set as it had at step 1.
3. **Lanes.** Run every `AGENTS.md` lane once, exactly as spelled. Check that `last-run.json` shows `success: true` with the full count, and that the skip-integrity check passes with a skip count of 0.
4. **Gap the SE named.** When the guard refuses `npm test`, the result file names no error. Grade that gap.
5. **Waiver.** The production-lines grep is empty, so the UAT waiver is expected. Confirm it.

## Timing (A9 and N8-LANE)
The addendum asks for two timing readings before merge:
- the N8-LANE narrow-set charge, with the base arm on the old command and the head arm on the new one;
- A9's `npm test` wall reading, with a twin.

Take them **only** in a foreground-verified quiet window: 180 s with no foreign vitest, no `oeselg-labs/platform` process, and none of our own hops running. A `uat-ABC-171` hop may be running. If no window opens, mark both **OWED**. Never estimate them. Record host and load1.

## Fences
- Work in a scratch detached worktree, `../wt-qe-ABC-173`. Remove it at the end.
- Do not touch:
  - `src/`
  - `plans/board.md`
  - `plans/traceability.md`
  - `../wt-ABC-173`
  - `../wt-ABC-171`
  - `../wt-uat-ABC-171`
  - any process you did not start
- Do not fix anything. Never push, merge or self-sign.

## Publish
- Hand-authored, unsealed notes under `ref:` in main's working tree. Include a `kind: decision` note authored by `qe-e2e`.
- `.grugops/queue/done/qe-ABC-173.md` and `.claim.md`, uncommitted. They hold:
  - the verdict;
  - the grade for each criterion;
  - the mutants;
  - the lanes;
  - A9 and N8-LANE, each as a reading or OWED;
  - the gaps, named `QE-173-*`;
  - the waiver;
  - a trace row.
