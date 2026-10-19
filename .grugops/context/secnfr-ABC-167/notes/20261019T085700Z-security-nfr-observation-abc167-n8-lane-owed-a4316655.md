---
id: 20261019T085700Z-security-nfr-observation-abc167-n8-lane-owed-a4316655
kind: observation
by: security-nfr
task: secnfr-ABC-167
at: 2026-10-19T08:57:00Z
verified_by:
confidence: high
refs:
  - ABC-167
  - NFR-008
  - R-167-2
  - .grugops/context/secnfr-ABC-167/probe/window.mjs
  - .grugops/context/secnfr-ABC-167/probe/window1.out
  - 20261018T211200Z-qe-e2e-observation-abc167-n8-lane-owed-3f802e17
  - 20261012T105851Z-orchestrator-decision-owner-word-2026-10-12-abc105-abc153-d8e82358
supersedes:
---

# ABC-167 `N8-LANE` (base `e286526d` vs tip `660a0d50`): OWED, no quiet window

Hand-authored and unsealed. **Nothing was timed and nothing was estimated.**

## The window check
- **Script:** `probe/window.mjs`, which is qe2's script with only the self-exclusion path changed.
- **Run:** in the foreground on MacBook-Air.local, from 2026-10-19T08:50:59.709Z, for 180 s with 181 polls.
  Exit 1.
- **Foreign processes:** in 118 of the 181 polls.
- **Foreign `vitest`:** 410 process lines across those polls. It was
  `Projects/public/grugops`, first `vitest run install/…` and then
  `vitest run --exclude **/scripts/e2e/** --reporter=json`. A `vitest` was still running at 08:54:35Z.
- **`oeselg-labs/platform`:** 35 process lines, all iTerm's `pidinfo --git-state …/oeselg-labs/platform`.
- **load1:** first 5.97, min 4.74, max 7.70, last 5.90.
- **Verdict:** the window fails the brief's test on both counts. The base/tip lane runs were therefore not
  started, and `npm ci` was not run.

## Can merge carry it?
**Yes, as accepted residual R-167-2 (LOW).** This needs the owner's word. The precedent is ABC-105's
"merge on the reading" (`…d8e82358`).
- **Why this is safe to carry:**
  - The delta is +1 default-lane file, with 0 spawns, so `N8-SPAWN` stays 0 ms.
  - Every search in the file runs on the virtual clock, at the steps the page rules. The page's step table gives
    at most 25 621 nodes per amended row.
  - Nothing in the delta can block or hang the lane.
- **What stays unknown:** the lane CPU delta against `NFR-008`'s 15 s clause. That is `UNKNOWN - verify`.
- **Owner:** Olger Oeselg, who holds merge.
- **Discharge:** the next admissible N8-LANE reading. Any later ticket's quiet-window reading includes this file.
