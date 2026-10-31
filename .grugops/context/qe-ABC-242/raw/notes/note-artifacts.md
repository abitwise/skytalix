# `qe-ABC-242` artifacts (committed on `grugops/qe-ABC-242` under `.grugops/context/qe-ABC-242/raw/`)

- `PREREG.txt`: the pre-registration, committed at `5da281c9` before any head run.
- `qe-scripts/`:
  - `oracle.mjs` and `shim.mjs`: A1–A3 and A6 against the real base, SE-242-e, and the differential sweep;
  - `plant.mjs`: Q1–Q18, with the post-PREREG hard-link tree and the `QE_STEP` / `QE_FILTER` options marked as such;
  - `qe-extra.test.ts`: X1–X4, synthetic lists, scratch only;
  - `g9.mjs`, `se242a.mjs`;
  - `g8.mjs`, `host.mjs`, `clear.mjs`, `waitpid.mjs`, `names.mjs` and `seal.mjs`, from qe-ABC-243 with header or regex
    edits only.
- `oracle/oracle.txt`: 362 checks, 0 FAIL. `oracle/posthoc-oracle-cap{6,50}.txt` is the post-hoc sweep against the cap
  plants.
- `plants/`: `plant-<id>.red.txt` per plant, `plant.stdout.txt`, `h-integrity.txt`, and `json-sha256.txt` (the json reports
  were not committed for size). `plants-step1/` holds the same at step 1 on the `ABC-242` rows, plus
  `parity-vs-step10.txt`, which reads 20/20 identical.
- `a4/a4-rerun.txt`: the two A4 rows re-run green.
- `gates/`: `lint.txt`, `typecheck.txt`, `build.txt`, `skip-integrity.txt`, `g9.txt`.
- `deep/`: `engine-deep-levels.txt` (53/53, 577.45 s), `ladder-short.txt` (18/18, 25.5 s), `wait.log`.
- `g8/`:
  - `g8.log.txt` (the 6 runs and their medians), `g8-wait.log.txt`, `stdout.txt`;
  - `g8-N-<tree>.tail.txt` (the last 25 lines of each run; the full output and the `last-run.json` files were not committed
    for size);
  - `g8-perfile.txt`, `a6-names.txt`.
- `probe/se242a.txt`: QE-230's probe on 5 merges.
- The scratch trees (B, H, and the plant tree P) lived in the session scratchpad (`qe-242/`), outside the repository. They
  were removed at the end of the hop.
