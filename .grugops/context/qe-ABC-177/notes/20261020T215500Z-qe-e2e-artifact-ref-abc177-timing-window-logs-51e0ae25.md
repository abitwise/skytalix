---
id: 20261020T215500Z-qe-e2e-artifact-ref-abc177-timing-window-logs-51e0ae25
kind: artifact-ref
by: qe-e2e
task: qe-ABC-177-timing
at: 2026-10-20T21:55:00Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-177
  - NFR-008
  - N8-LANE
  - R-174-1
  - QE-177-g
  - .grugops/context/qe-ABC-177/probe/timing/
---

# `ABC-177` timing hop: artifacts and commands

Hand-authored and unsealed.

**Directory:** `.grugops/context/qe-ABC-177/probe/timing/`
- `run.sh`: the stage driver, in this order:
  - P1 (`pmset` AC);
  - a foreground `window.mjs 180`, up to 6 tries;
  - P1 again;
  - `sampler174.mjs` with ROOT = `$$`, beside `lane174.mjs`;
  - the readouts plus `powercheck.py`.
  The registered instruments are called unmodified. The two-arm readout `readout-nfr008-174.py` was to be fed the H/H2
  rows of the four-arm TSV, verbatim, with the header kept. That was never reached.
- `batch1/`, `batch2/`: `stage.log` (power, load1 and user-process count before each window) and `window1..6.out` (the
  `window.mjs` JSON, with every distinct foreign line).
- `windows.tsv`: one row per window. It gives polls, foreign polls, kinds, distinct, platform and this-repo line counts,
  the load1 range, and the verdict.
- `SHA256SUMS`.

**Commands run:**
- `git archive` × 6 into the session scratchpad:
  - N8 arms: B `ff1e375f`, H `f81bf03c`, and T = `cp -R B` (`/usr/bin/diff -r` clean, `node_modules` included);
  - full arms: B and T at `ff1e375f`, H and H2 at `f81bf03c`.
- `npm ci` × 6, one at a time; each arm has its own real `node_modules` and none is a symlink.
- The `src/uci-session.test.ts` sha256 prefixes match the commits: `e5108838` at base, `a12f818e` at tip.
- `window.mjs` × 12.
- `lane174.mjs`: **0 runs**. `sampler174.mjs`: 0. Readouts: 0.

**Scratch:** every arm was removed at the end of the hop (`scratchpad/t177`). Nothing is left running.

**Not touched:**
- `src/` on any branch;
- `../wt-ABC-177` (clean, `f81bf03c`);
- `plans/`;
- any process this hop did not start.
User processes stayed at 423–442, against `ulimit -u` 2666.
