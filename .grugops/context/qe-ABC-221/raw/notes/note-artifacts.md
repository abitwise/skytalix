# `qe-ABC-221` artifacts (committed on `grugops/qe-ABC-221` under `.grugops/context/qe-ABC-221/`)

- **`raw/PREREG.txt`:** the pre-registration, committed at `6d7f2c24` before any head run.
- **`raw/qe-scripts/`:**
  - `a8diff.mjs`: the A8/D8 fence.
  - `oracle.mjs`: the differential against the real base, plus the independent clock-mode oracle, with its counting
    shim.
  - `census.mjs`: the R1 census, replayed.
  - `se221a.mjs`: SE-221-a.
  - `plant.mjs`: 21 plants.
  - Marked post-PREREG and informative: `periods.mjs` (A2–A7 and A12 figures by arithmetic) and `posthoc-oracle.sh`
    (the oracle against the two survivors).
  - Copied from qe-ABC-242 with header or regex edits only: `g8.mjs`, `host.mjs`, `clear.mjs`, `waitpid.mjs`,
    `names.mjs`, `seal.mjs`.
  - Post-PREREG deviation, QE-221-c: `host80.mjs` and `g8-host80.mjs`, each one line changed (the Tctl clear 60 → 80 °C).
- **`probe/a14b-probe.mjs`:** qe-ABC-220's probe with the one `setoption` value changed. `raw/probe/a14b-run1.json` is the
  one counted run.
- **`raw/fence/a8diff.txt`; `raw/oracle/oracle.txt`, `posthoc-survivors.txt`; `raw/census/census.txt`, `rf1-B.json`,
  `rf1-H.json`; `raw/se221a/se221a.txt`, `periods.txt`.**
- **`raw/plants/`:** `plant-<id>.red.txt` per plant, `plant.stdout.txt`, `plants-summary-all.txt`, `h-integrity.txt` and
  `json-sha256.txt`. The json reports were not committed, for size.
- **`raw/gates/`:** `lint.txt`, `typecheck.txt`, `build.txt`, `skip-integrity.txt`, `lane-inventory.txt`.
- **`raw/deep/`:** `engine-deep-a10.txt`, `uci-deep.txt`, `wait.log`.
- **`raw/g8/`:**
  - `g8.log.txt`, `g8-wait.log.txt`, `stdout.txt`;
  - `g8-N-<tree>.tail.txt`, the last 25 lines of each run;
  - `g8-perfile.txt` and `names.txt`.
  - The full outputs and `last-run.json` files were not committed, for size.
- **The scratch trees** (B, H, P and the oracle shims) lived in the session scratchpad (`qe-221/`), outside the
  repository. They were removed at the end of the hop.
