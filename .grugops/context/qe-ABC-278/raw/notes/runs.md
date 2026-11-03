# QE runs for ABC-278: commands, fixtures and outputs as run 2026-11-03 under the host lock

Every command ran from the worktree of `grugops/ABC-278`. Each was wrapped as `flock <scratch>/host-test.lock <cmd>`. Scratch repos lived under `<scratch>/qe-ABC-278/` and were deleted after.

- **Gates:** `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`. Each exit 0; the test run gave 66 files, 2566/2566.
- **Proof:** `node --test tools/grugops/records-path-check.proof.js` gave 41/41. It was also run with `--experimental-test-coverage --test-coverage-include=tools/grugops/records-path-check.js`: 98.93 % lines, 87.60 % branches, 100 % functions.
- **QE harness:** `node .grugops/context/qe-ABC-278/raw/scripts/harness.mjs <check.js> <workdir>` → `raw/out/harness-run.txt`. 81 rows: 57 with an expectation, all OK; 24 recorded as-is (probes and no-claim rows); 0 leaked values.
  - Fixtures are built at run time from `os.homedir()`, `os.userInfo()` and the uid. A PID-shaped number is derived from the process id. No literal host value is in the script.
  - The same harness run on `main`'s check (`git show main:tools/grugops/records-path-check.js`, copied to scratch) → `raw/out/harness-run-main-check.txt`: 42 MISMATCH rows. These are the red baseline that proves QE's rows can fail.
- **Regression:** `node .grugops/context/qe-ABC-277/raw/scripts/harness.mjs <check.js> <workdir>` → `raw/out/qe277-harness-rerun.txt`. Compared with `qe-ABC-277/raw/out/harness-run.txt` on code, hits, classes and leaks: 39/50 unchanged, 11 changed (listed in the verdict).
- **A4 recount:** `node .grugops/context/qe-ABC-278/raw/scripts/fa-recount.mjs <rev> <main-check.js> tools/grugops/records-path-check.js`, run at `361a5af3` and at `fdc8d0dc`.
  - Output: `raw/out/fa-recount-<rev>.txt`, with counts and redacted path:line only.
  - It read 16 421 / 16 422 blobs (16 223 / 16 224 text, 1 with a NUL, 197 `.gz`/`.xz` skipped).
  - The SE's `fa-measure.mjs` at `fdc8d0dc` gave the same 77 / 80 / 3 / 0.
- **A9:** `node tools/grugops/records-path-check.js` was run with `--base main`, with `--base main --head main`, and with `--base 541ddf45^1 --head 541ddf45`. It was also run from main's checkout with `--base main --head grugops/ABC-278`, using the branch's check and `main`'s check. All exit 0.
- **Value grep:** the added lines of each branch commit were tested against the real home, its slug, the user name, `/tmp/claude-`, the session id and the hostname, as counts only: 0 for every commit.
- **Flaky risk:** low. The harness and the proof are deterministic: each builds a fresh repo with no clock and no network. The only timing number (speed) is far under its bar.
