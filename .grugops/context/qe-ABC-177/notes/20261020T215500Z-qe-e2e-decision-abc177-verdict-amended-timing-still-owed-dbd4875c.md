---
id: 20261020T215500Z-qe-e2e-decision-abc177-verdict-amended-timing-still-owed-dbd4875c
kind: decision
by: qe-e2e
task: qe-ABC-177-timing
at: 2026-10-20T21:55:00Z
verified_by:
confidence: high (A1–A7 and A12 carried from `…ec9517a5`); A8–A11 OWED (not read)
sealed: false
refs:
  - ABC-177
  - ADR-0046
  - NFR-008
  - N8-LANE
  - R-174-1
  - OQ-177-1
  - QE-177-g
  - plans/tickets/ABC-177-npm-test-back-under-nfr-008s-10-s-adr-0046.md
  - 20261020T194700Z-qe-e2e-decision-abc177-verdict-pass-with-gaps-timing-owed-ec9517a5
  - 20261020T215500Z-qe-e2e-observation-abc177-timing-a8-a11-owed-no-quiet-window-on-ac-46beddf7
  - 20261020T215500Z-qe-e2e-artifact-ref-abc177-timing-window-logs-51e0ae25
supersedes:
amends: 20261020T194700Z-qe-e2e-decision-abc177-verdict-pass-with-gaps-timing-owed-ec9517a5
---

# QE on `ABC-177` at `f81bf03c`, amended by the timing hop: **still PASS_WITH_GAPS on A1–A7 and A12; A8–A11 still OWED.** The cause is now a foreign session, not power

Hand-authored and unsealed. This is a `decision`, not a `finding`: no stamp exists and the sanctioned writer is absent.

## What this amends in `…ec9517a5`
- **A8–A11 stay OWED.** The cause changes from "no AC" to "AC on 12/12 checks, but 0 of 12 quiet windows". Another
  session's `oeselg-labs/platform` work was running throughout (`…46beddf7`).
- **`QE-177-g` stays open, MEDIUM, with a new route** (below).
- Everything else stands unchanged: A1–A7 and A12 MET; the gaps `QE-177-a`..`-f`; the UAT waiver.

## Grades
| crit | grade |
|---|---|
| A1–A7, A12 | **MET** (carried; not re-run in this hop) |
| A8 | **OWED.** No quiet window on AC |
| A9 | **OWED.** All four own-`npm ci` arms were built, but no window opened, so nothing ran |
| A10 | **OWED.** `NFR-008` not read |
| A11 | **OWED.** No reading, so no escalation route fires (neither > 9.2 s → O3 nor > 10 s → owner) |

## `NFR-008` and `R-174-1`
- **`NFR-008` on the tip: NOT READ.** The last admissible state is still `QE-174-b`'s NOT MET, 10.010 s.
- **`R-174-1`: NOT discharged.**

## `QE-177-g` (MEDIUM), new route
- **Orchestrator / owner:** re-dispatch the timing half only when the host is on AC **and** the
  `oeselg-labs/platform` session is idle or paused (owner's call).
- The instruments are ready: `probe/` plus `probe/timing/run.sh`. Pass its stage `n8` and then `full`.
- A dispatch on AC alone is likely to repeat this result.

## Next column
- **Stay in `In Review`.** The Orchestrator decides.
