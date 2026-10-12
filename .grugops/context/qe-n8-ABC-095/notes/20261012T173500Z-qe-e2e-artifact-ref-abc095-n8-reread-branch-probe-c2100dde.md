---
id: 20261012T173500Z-qe-e2e-artifact-ref-abc095-n8-reread-branch-probe-c2100dde
kind: artifact-ref
by: qe-e2e
task: qe-n8-ABC-095
at: 2026-10-12T17:35:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - N8-LANE
  - QE-095-N8
  - QE-095-h
  - 20261012T173300Z-qe-e2e-decision-abc095-n8-lane-met-qe095-n8-and-h-closed-15521bc7
  - 20261012T173100Z-qe-e2e-observation-abc095-n8-lane-reread-three-sets-195fc847
supersedes:
---

# Artifacts: `qe-n8-ABC-095` (branch, probe, commands)

- **Branch:** `grugops/qe-n8-ABC-095`, off the Security/NFR tip `7b93c973`. Worktree:
  `../wt-qe-n8-ABC-095`, with `node_modules` symlinked into the worktree root only. Not merged, not pushed.
- **Commits:**
  - `8f4f75e5`: the pre-registration and instruments, committed before any run (17:16:42Z).
  - The next commit adds the windows, the notes, the ticket's § QE (an appended dated block), and one trace row
    at the end of `plans/traceability.md`.
- **The probe** is `.grugops/context/qe-n8-ABC-095/probe/`:
  - `preregistration.txt` holds the rules.
  - `master-n8r.sh`, `window-n8r.sh` and `readout-n8r.py` are the instruments. Their sha256 values are in the
    pre-registration.
  - `readout-selftest.out.txt` is the self-test on recorded TSVs.
  - `smoke-counts.out.txt` holds the count-only smoke: 9 runs, exit 0; B/T/H counts 69/69/69, 1/1/1 and 1/1/5.
  - `windows/master.log` is the budget log.
  - `windows/n8r-{cli,real,be}-w1/` each hold `window-once.txt`, `gate.tsv`, `sampler.tsv`, `<tag>.tsv`,
    `<tag>.summary.txt`, `<tag>.console.txt` and `readout.out.txt`.
- **Used in place, unchanged:**
  - `secnfr-ABC-144-window-b/probe/lane144b.mjs` (`652b7793…c80c7c`);
  - `secnfr-ABC-152-window/probe/gate.sh` (`5335905a…352b6f`);
  - `qe-ABC-105/probe/placeholder.test.ts` (`f730fdb2…5e3e`), copied into the S3 base and twin arms.
- **Arms** were built outside the repository, in the session scratchpad `qen8095/arms{,3}`: `git archive 0974102f`,
  a `cp -R` twin, and `git archive 2307fc11`, each with a `node_modules` symlink. They were removed by exact path
  after the readings.
- **Commands:**
  - `bash probe/master-n8r.sh` ran the sequence.
  - It calls `python3 -I probe/readout-n8r.py <window> <tag> <0.100|16pct> [added]` for each window.
  - The lane runs `npx vitest run <set> --reporter=default --reporter=json --outputFile.json=.test-results/last-run.json`
    under `/usr/bin/time -p`, with `CLI_DEEP`, `SEARCH_DEEP`, `ENGINE_DEEP` and `VITEST_MAX_WORKERS` unset.
- **What was not touched:** `src/`, `tools/`, tests, `plans/board.md`, `AGENTS.md`, ADRs, and other sessions'
  processes.
