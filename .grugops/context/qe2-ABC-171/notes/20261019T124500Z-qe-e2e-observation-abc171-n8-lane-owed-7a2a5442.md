---
id: 20261019T124500Z-qe-e2e-observation-abc171-n8-lane-owed-7a2a5442
kind: observation
by: qe-e2e
task: qe2-ABC-171
at: 2026-10-19T12:45:00Z
verified_by:
confidence: high
refs:
  - ABC-171
  - NFR-008
  - R-167-2
  - 20261019T113200Z-qe-e2e-observation-abc171-n8-lane-owed-71c3e0a4
  - .grugops/context/qe2-ABC-171/probe/window.mjs
  - .grugops/context/qe2-ABC-171/probe/window1.out
supersedes:
---

# ABC-171 N8-LANE at `5dee231c`: still OWED (no quiet window)

Hand-authored and unsealed. Nothing was timed, and nothing was estimated.

## The window check
- **Script:** `probe/window.mjs`, the `qe-ABC-171` script. Only its self-exclusion path changed.
- **Run:** in the foreground on **MacBook-Air.local**, from 2026-10-19T12:41:50Z for 180 s, with 181 polls.
  - The first pass recorded the host as `Mac.lan`. The name changed and the machine did not.
- **Order:** this was the first thing this hop ran, before any QE gate or mutant process.

## What was running
- **Foreign processes were present in 181 of 181 polls.**
  - Two `oeselg-labs/platform` `product-template` `main-worker.js` processes were in every poll. They had been up about
    1.5 h.
  - During the window, a `vitest run --exclude **/scripts/e2e/**` started in `Projects/public/grugops`, together with
    that repo's `check-diff-disposition.js`. It was still running at 13:08Z.
- **load1:** first 5.58, min 3.67, max 6.41, last 3.67. This is under NFR-008's 8, but the foreign processes alone
  make the window not quiet.
- **ABC-173:** at 12:41Z no `../wt-ABC-173` worktree existed. By 13:08Z `grugops/ABC-173` was checked out there, so
  an ABC-173 SE hop had started in parallel. Its work would also have broken any later window.

## Verdict
**Not quiet, so N8-LANE is OWED.** It is carried to the gate, as in `…71c3e0a4`. The rows hop adds 17 tests to an
existing file and no new test file.
