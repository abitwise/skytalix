---
id: 20261021T071300Z-qe-e2e-observation-d5e170ec
kind: observation
by: qe-e2e
at: 2026-10-21T07:13:00Z
verified_by: 
confidence: high
refs:
  - ABC-177
  - NFR-008
  - R-174-1
  - QE-177-g
  - ADR-0046
  - A9
  - A10
  - A11
  - 20261021T065000Z-orchestrator-decision-f8cd47ba
  - 20261021T055500Z-orchestrator-decision-b87c35b6
  - .grugops/queue/pending/qe-ABC-177-timing-3.md
  - .grugops/context/qe-ABC-177/probe/timing3/
  - .grugops/context/qe-ABC-177/probe/timing3/SHA256SUMS
supersedes: 
seal: sha256:dfeb8b50e28cf9c2bc8a9af05667f154d3330b3732800befe11c948c812d9905
---

# `ABC-177` timing-3: artifacts and commands (`probe/timing3/`)

Recorded as an `observation`. Last hop's writer refused this shape as an `artifact-ref`: no §14 `gate_run` certifies a timing
probe.

**Files** (`SHA256SUMS` covers all 34, verified OK):
- `preregistration-timing3.txt` (`978a3c11d8c5`), written before the first gate poll;
- `gate3.sh` (`34822376dc21`), the start-gate and cool-down watcher, derived from `timing2/wait177.sh`;
- `gate-t3-r1.tsv`, `gate-t3-r2.tsv` (one row per 5 s poll) and `gate-t3-r*-cmds.txt` (each full-suite line that blocked);
- `arms-build/npmci-{B,T,H,H2}.log`;
- `t3-r1/`, `t3-r2/`, each holding:
  - `stage.log`, `window.out`, `window-power.tsv` and `sampler.tsv`;
  - `nfr008-full.tsv`, `nfr008-full-HH2.tsv`, `nfr008-full.summary.txt` and `lane.log`;
  - the strict and amended readouts, `powercheck.out` and `perrun.out`.

**Commands:**
- **Verification (06:36Z).**
  - `timing2/SHA256SUMS`: 44/44 OK. `timing/SHA256SUMS`: OK.
  - The registered and timing2 instruments match `preregistration-timing2.txt`'s prefixes: lane174 `e2074cdbeedd`,
    sampler174 `83409bc0e70b`, readout-nfr008-174 `c95343f82f7c`, window `83af1a013dd0`, powercheck `a64369300b3e`,
    run-amended `6f44786ba6c9`, readout-nfr008-174a `b0236f4623db`, perrun `9e3bbe8c1888`, go177 `850dc337f350`.
- **Arms (06:36:58–06:37:02Z).** `git archive` × 4 with an own `npm ci` each (`--no-audit --no-fund`; node v26.11.1, npm
  11.20.0), one at a time:
  - B and T at `ff1e375f`;
  - H and H2 at `f81bf03c`.

  No `node_modules` is a symlink; vitest is 4.1.11 everywhere. `src/uci-session.test.ts` reads `e5108838` in B/T and
  `a12f818e` in H/H2.
- **Stages.** `gate3.sh <deadline 08:37:00Z> t3-r1` → `go177.sh amd full t3-r1` → `timing2/run-amended.sh full t3-r1`, then
  the same chain for t3-r2. All of it ran from byte-identical scratchpad copies, so no ancestor command line matched the
  instruments' foreign regex.
- **Readouts** (run by `run-amended.sh` itself): `readout-nfr008-174.py` (strict), `readout-nfr008-174a.py` (amended),
  `powercheck.py` and `perrun.py`, on each stage.

**Scratch.** `scratchpad/t177` (all 4 arms, about 4 × 66 packages), the launcher and watcher copies, and the note bodies were
removed. No process from this hop is left running.

**Not touched:**
- `src/`;
- `../wt-ABC-177` (clean at `f81bf03c`);
- `plans/`;
- any process this hop did not start.

`scratchpad/abc177/` and the other earlier-hop files in the scratchpad were left as found.
