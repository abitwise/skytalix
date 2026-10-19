---
id: 20261019T132000Z-security-nfr-observation-abc171-n8-lane-owed-22a93cd8
kind: observation
by: security-nfr
task: secnfr-ABC-171
at: 2026-10-19T13:20:00Z
verified_by:
confidence: high
refs:
  - ABC-171
  - NFR-008
  - R-167-2
  - R-171-1
  - .grugops/context/secnfr-ABC-171/probe/window.mjs
  - .grugops/context/secnfr-ABC-171/probe/window1.out
  - 20261019T124500Z-qe-e2e-observation-abc171-n8-lane-owed-7a2a5442
  - 20261019T085700Z-security-nfr-observation-abc167-n8-lane-owed-a4316655
  - 20261012T105851Z-orchestrator-decision-owner-word-2026-10-12-abc105-abc153-d8e82358
supersedes:
---

# ABC-171 `N8-LANE` (base `55a1e223` vs tip `5dee231c`): OWED, no quiet window

Hand-authored and unsealed. **Nothing was timed and nothing was estimated.**

## The window check
- **Script:** `probe/window.mjs`, qe2's script with only the self-exclusion path changed.
- **Run:** in the foreground on MacBook-Air.local, from 2026-10-19T13:13:15.586Z for 180 s, with 181 polls. Exit 1.
- **Order:** this was the first process this hop ran.
- **Foreign processes were present in 181 of 181 polls:**
  - **ABC-173's coverage run:** `vitest run --coverage --coverage.include=src/**` in `../wt-ABC-173`. This is the
    parallel SE hop the brief expected.
  - **`Projects/public/grugops`:** `vitest run --exclude **/scripts/e2e/** --reporter=json`, up 28 min at the start,
    plus another vitest worker that was still there at the last poll.
  - **The two `oeselg-labs/platform` `main-worker.js` processes,** in every poll, each up about 2 h.
- **load1:** first 6.64, min 4.48, max 7.19, last 4.48.
- **Verdict:** not quiet. I did not start the base/tip lane runs, and I did not run `npm ci`.

## Can merge carry it?
**Yes, as accepted residual R-171-1 (LOW), on the owner's word, as with R-167-2.** The precedent is ABC-105's "merge
on the reading" (`…d8e82358`).
- **Why this is safe to carry:**
  - The delta is rows added to an existing default-lane file (`src/uci-session.test.ts`, +533 lines). There is no new
    test file, so the lane gets no new file.
  - It has 0 spawns, so `N8-SPAWN` stays 0 ms.
  - Every search in the rows runs on `virtualClock`, so a search is bounded by its clock reads, not by wall time.
  - Nothing in the delta can block or hang the lane.
- **What stays unknown:** the lane CPU delta against `NFR-008`'s 15 s clause. That is `UNKNOWN - verify`.
- **Stated plainly:** R-167-2 is still undischarged, and it sits on the same file. So two unmeasured deltas to that
  one file are now carried together.
- **Owner:** Olger Oeselg, who holds merge.
- **Discharge:** the next admissible N8-LANE reading. Any later quiet-window reading that includes this file
  discharges both R-167-2 and R-171-1.
