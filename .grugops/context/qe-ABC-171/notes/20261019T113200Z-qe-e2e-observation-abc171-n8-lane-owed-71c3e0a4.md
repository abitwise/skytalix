---
id: 20261019T113200Z-qe-e2e-observation-abc171-n8-lane-owed-71c3e0a4
kind: observation
by: qe-e2e
task: qe-ABC-171
at: 2026-10-19T11:32:00Z
verified_by:
confidence: high
refs:
  - ABC-171
  - NFR-008
  - R-167-2
  - .grugops/context/qe-ABC-171/probe/window.mjs
  - .grugops/context/qe-ABC-171/probe/window1.out
  - 20261019T110601Z-software-engineer-observation-readings-a171d002
supersedes:
---

# ABC-171 N8-LANE at `9ae31679`: OWED (no quiet window)

Hand-authored and unsealed. Nothing was timed and nothing was estimated.

- **The window check:** `probe/window.mjs` (the `qe2-ABC-167` script, with `grugops/scripts` added as a foreign
  kind). It ran in the foreground on **Mac.lan** from 2026-10-19T11:24:16Z for 180 s, with 181 one-second polls.
  This was before any QE mutant run started. The only QE process running before it was the gate `npm test`, which
  finished at 11:21:00Z.
- **Foreign processes:** present in **181 of 181 polls**.
  - A `vitest run --exclude **/scripts/e2e/**` in `Projects/public/grugops`. It had been running since before this
    hop.
  - `oeselg-labs/platform` `product-template` workers. Partway through the window a second `vitest run` started
    in that repo's `scaffolder`.
- **load1:** first 10.30, min 8.74, max 12.37, last 9.89. Every poll was above NFR-008's `load1 ≤ 8`. Before the
  window, at the gate run, load1 read 65.77, and at the start of the hop 96.50.
- **Verdict: not quiet. N8-LANE is OWED.** The delta stays owed at the gate, as `…a171d002` says. ABC-167 was merged
  with N8-LANE owed in the same way, under R-167-2.
- **Incidental, not a reading:** the gate's `npm test` printed 28.65 s duration. That number was taken under a
  foreign load and is not an N8 figure.
