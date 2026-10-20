---
id: 20261020T194700Z-qe-e2e-observation-abc177-timing-a8-a11-owed-no-ac-power-a4611b8d
kind: observation
by: qe-e2e
task: qe-ABC-177
at: 2026-10-20T19:47:00Z
verified_by:
confidence: high (the power and process log is a reading of the host, not of the lane); every timing figure is OWED, none estimated
sealed: false
refs:
  - ABC-177
  - ADR-0046
  - NFR-008
  - N8-LANE
  - R-174-1
  - OQ-177-1
  - SEC-174-2
  - QE-177-g
  - 20261020T150000Z-orchestrator-decision-bfdc97e5
  - 20261019T202000Z-qe-e2e-observation-abc174-n8-lane-met-nfr008-total-not-met-5d9a0f63
  - .grugops/context/qe-ABC-177/probe/preregistration.txt
  - .grugops/context/qe-ABC-177/probe/powerlog.tsv
---

# `ABC-177` A8–A11 timing: **OWED**. The host was on battery for the whole hop, so no reading is admissible under the owner's AC-only rule. `NFR-008` was **not read**, and `R-174-1` is **not discharged**

Hand-authored and unsealed. **Nothing in this note is a lane timing, and nothing is estimated.**

## Why OWED
- **Owner rule (`…bfdc97e5`, OQ-177-1 = YES):** every `NFR-008` reading, both `N8-LANE` and the full lane, must be on
  AC power. A battery reading taken from 2026-10-20 on is not admissible.
- **Pre-registered gate P1 (`probe/preregistration.txt`, written before any window):** no arm runs unless
  `pmset -g batt` reads 'AC Power'.
- **The host never read AC.**
  - `pmset -g batt` at 19:00:59Z: 'Battery Power', 98 %, discharging.
  - `probe/powerlog.tsv`: one sample every 30 s from 19:21:22Z to 19:46:22Z. **51 of 51 read 'Battery Power'.** The
    watch was set to stop early on the first AC sample, and it never did.
  - At 19:46Z the battery read 86 %, discharging.
- **The window would also have failed on foreign processes.**
  - All 51 samples had a foreign process. It was another session's `oeselg-labs/platform` scaffolder vitest suite and
    its `src/cli.ts` children; the 19:00Z check also saw it.
  - load1 ranged 2.01–8.59 (above 8 at 19:21:52Z and 19:22:22Z). User processes peaked at 422, against `ulimit -u`
    2666.
- **Consequences.**
  - No `window.mjs` window was attempted, because a quiet window cannot make a battery run admissible.
  - No twin tree and no `npm ci` was built, and no arm was run.

| criterion | state |
|---|---|
| **A8** `N8-LANE`, ONE-FILE set, ≤ 650 ms CPU | **OWED** |
| **A9** full-lane twin: B/T and H/H2, four own `npm ci`s | **OWED** |
| **A10** (i) H's median wall and the `NFR-008` state; (ii) H−B wall and CPU; (iii) the twin Rs | **OWED** |
| **A11** H ≤ 9.2 s target, and the escalation | **OWED.** With no reading, neither route fires: not > 9.2 s → O3, not > 10 s → owner |

## The `NFR-008` result and `R-174-1`
- **`NFR-008` on `ABC-177`'s tip: NOT READ (OWED).**
- The last admissible reading is still `QE-174-b`'s: 10.010 s median wall at `be6a5599`, **NOT MET** (`…5d9a0f63`), on
  battery, before the AC rule.
- The node census (−492 968 nodes on the 15 rows) and ADR-0046's 8.6–9.3 s are **not readings**. They are not reported
  as an `NFR-008` state.
- **`R-174-1` is not discharged.** The discharge needs an admissible reading of ≤ 10 s on AC.

## What the next hop needs (`QE-177-g`)
The instruments and the pre-registration are ready in `probe/`:
- `lane174.mjs` (byte copy), `sampler174.mjs`, `readout174.py`, `readout-nfr008-174.py`;
- `window.mjs`, renamed for this hop;
- `powercheck.py`, for P2: every scored run must read 'AC Power' in `power` and `power_after`.

The Orchestrator re-dispatches the timing half when the host is on AC and the `oeselg-labs/platform` suite is not
running. Its steps are:
1. Check the P1 power gate.
2. Run a 180 s foreground window with 0 foreign polls.
3. Run `N8-LANE`: B / T (`cp -R B`, `diff -r` clean) / H; 9 rounds.
4. Run the full lane: B, T, H, H2, each with its own `npm ci` and no shared `node_modules`; 9 rounds.
5. Read it out with the readouts plus `powercheck.py`.
