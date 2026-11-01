# se-ABC-262 gates: base 2 374, head 2 376 (+2), 0 skips, lint/typecheck/build 0, rows 0.41 ms, G8 8.95 s

All under `flock host-test.lock`, `raw/gates.sh`; outputs in `raw/gates/`.

- **Base** (git-archive copy of `3ea272c0`, src == main `767a2e3e`): `npm test` 2 374 passed, rc 0.
- **Lint / typecheck / build:** rc 0 / 0 / 0. Worktree clean after build apart from the two edited files.
- **Head `npm test` ×3:** 2 376 passed, 0 failed, 0 pending, 0 todo each (= base + 2). Duration 8.90 / 9.37 / 8.95 s, **median 8.95 s** (wall 9.24 / 9.68 / 9.27 s, median 9.27 s); both ≤ 10 s (NFR-008). load1 0.66→1.71, 1.71→2.29, 2.29→2.80. A foreign vitest (another repo, `marketing … tests/evals`) ran during run 1 only; not touched.
- **A7:** the two ABC-262 rows' summed duration 0.39 / 0.41 / 0.43 ms, **median 0.41 ms** (bar ≤ 20 ms).
- **Skip-integrity** (`--skip-count 0`, from head-1 JSON): `No findings.` rc 0.
- **Lane inventory:** `The lane collects 63 test files; git tracks 63. No findings.` rc 0.
- **Waiver check:** `git diff --name-only 39a6237e~1 39a6237e | grep -v '\.test\.ts$' | grep '^src/'` prints nothing, so the test-only UAT waiver holds; QE's verdict is the gate.
