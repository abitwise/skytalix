---
id: 20261020T215500Z-qe-e2e-observation-abc177-timing-a8-a11-owed-no-quiet-window-on-ac-46beddf7
kind: observation
by: qe-e2e
task: qe-ABC-177-timing
at: 2026-10-20T21:55:00Z
verified_by:
confidence: high (the window logs are readings of the host, not of the lane); every timing figure is OWED, none estimated
sealed: false
refs:
  - ABC-177
  - ADR-0046
  - NFR-008
  - N8-LANE
  - R-174-1
  - OQ-177-1
  - QE-177-g
  - 20261020T150000Z-orchestrator-decision-bfdc97e5
  - 20261020T194700Z-qe-e2e-observation-abc177-timing-a8-a11-owed-no-ac-power-a4611b8d
  - .grugops/context/qe-ABC-177/probe/preregistration.txt
  - .grugops/context/qe-ABC-177/probe/timing/windows.tsv
---

# `ABC-177` A8–A11 timing, second attempt: **OWED again**. The host was on AC throughout, but none of 12 consecutive 180 s windows was quiet. Another session's `oeselg-labs/platform` work was running. `NFR-008` was **not read**, and `R-174-1` is **not discharged**

Hand-authored and unsealed. There is no sanctioned writer: `scripts/context-io.js` is absent and no `propose_note` tool
was available. **Nothing in this note is a lane timing, and nothing is estimated.**

## What changed since `…a4611b8d`
- **Power, P1: passed.** `pmset -g batt` read 'AC Power' at 21:12:50Z (76 %, charging), and again before each of the
  12 windows (12/12).
- **load1 was never the blocker.** It read 2.00–6.23 across all windows, under the ≤ 8 bar.
- **The quiet window, P3: failed 12 of 12.** The arms were built first, so a pass could have started a run at once.
  `window.mjs` (as registered, 180 s, 1 s polls) ran 12 times back to back, 21:15:04Z → 21:51:40Z, about 36 min.
  - Foreign polls per window, out of 181: 30, 171, 162, 69, 150, 162 | 162, 107, **4**, 161, 173, 153.
  - Every foreign line was another Claude session's `oeselg-labs/platform/repos/homelab` work. It was
    `bats tests`, `docker run … squid`, `kubectl`/`flux` reconciles, `scripts/probe.sh` and `curl` egress probes.
    It moved from branch `phase8/08-05-egress-proxy` to `phase8/08-06-tenant-egress` while the windows ran. The one
    `vitest`-kind hit (b2w4) is that session's.
  - **0 foreign lines came from this hop or this repo** (`windows.tsv`, column `this_repo_lines`).
  - The closest window was b2w3: 4 foreign polls. The rule is 0, so it fails.
- **So the stage driver never started.** No sampler ran, no `lane174.mjs` run was taken, and no readout or
  `powercheck.py` had input.

## Bound on the wait
The brief says OWED "if none opens in a reasonable time". The stop rule was two batches of 6 windows: 12 tries, about
36 min. The previous hop's power watch ran 25 min. The other session had just opened a new phase branch when the
attempts stopped, and nothing pointed to it ending soon. Holding width 1 longer blocks the queue on another session's
schedule, so this is OWED rather than a longer wait.

| criterion | state |
|---|---|
| **A8** `N8-LANE`, ONE-FILE `src/uci-session.test.ts`, 400 heap flag, ≤ 650 ms CPU | **OWED.** No quiet window |
| **A9** full-lane twin: B/T at `ff1e375f`, H/H2 at `f81bf03c`, four own `npm ci`s | **OWED.** All 4 arms were built with their own installs (no symlinks), but no window opened, so nothing ran |
| **A10** (i) H median wall and the `NFR-008` state; (ii) H−B; (iii) twin Rs | **OWED** |
| **A11** H ≤ 9.2 s, and the escalation | **OWED.** With no reading, neither route fires |

## The `NFR-008` result and `R-174-1`
- **`NFR-008` on the tip: NOT READ (OWED).** The last admissible state is still `QE-174-b`'s NOT MET, 10.010 s, at
  `be6a5599`.
- **`R-174-1`: NOT discharged.**
- **The blocker has moved.** It was power (`…a4611b8d`); it is now a concurrent foreign session on the same host. The
  next attempt needs both AC **and** that session idle (or the owner pausing it). Re-dispatching on AC alone would
  likely repeat this result.
