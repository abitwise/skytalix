# qe-EPIC-010-m1-batch-2 artifacts (an observation, not an artifact-ref: no §14-gate run to bind)

All committed on `grugops/qe-EPIC-010-m1-batch-2` under `.grugops/context/qe-EPIC-010-m1-batch-2/raw/`, with host paths
redacted.

- `gates/pair-check.txt` (25/25) and `gates/dry-rpair.txt` (the exact command's dry run, `<scratch>`): before the PREREG.
- `scripts/`:
  - `clocks.mjs`: the PGN clock reader and block-01 guard;
  - `elo.mjs`: QE's cutechess formula, self-tested on 4 recorded lines;
  - `watch.mjs`: the watcher, with the QE-M1B2-a fix;
  - `waitclear.mjs`, `launch.sh` (the re-run's launcher), `analyse.mjs`, and `seal.mjs` (the note sealer, `admitAndAppend`).
- `void1/`: run 1's watcher log, harness stdout, schedule, machine, and the partial base b01 PGN with its clock read (VOID; no
  score).
- `batch/`: the re-run.
  - The tool's `summary.txt`, `machine.txt`, `schedule.{txt,log}`, `nps.log`, `thermal.log`, `host.log`, `cmd.txt`, `SHA256SUMS`
    and `{base,candidate}-artifacts.txt`.
  - `{base,candidate}/bNN/{summary.txt,r.pgn}` for all 20 block-runs.
  - QE's `elo.txt`, `analyse.txt`, `clocks-per-block.txt`, `watch.log`, `waitclear.log` and `session.txt`.
  - The 20 `r.out` logs (about 7 MB each) are not committed. Their sha256 values are in `SHA256SUMS`, which verified (`sha256sum -c`
    OK, 132 files) before scratch was removed.
- Commits: PREREG `5d9c6b3a`; VOID record `fbbdcabc`; the result in the commit that adds this note.
