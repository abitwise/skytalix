---
id: 20260926T205400Z-software-engineer-observation-35a5af66
kind: observation
by: software-engineer
at: 2026-09-26T20:54:00Z
verified_by:
confidence: high
refs:
  - ABC-123
  - ABC-122
  - NFR-008
  - N8-LANE
  - N8-SPAWN
  - ticket-to-pr-ABC-123
  - tools/grugops/run-bounded.js
  - tools/grugops/run-bounded.proof.js
  - .grugops/context/ticket-to-pr-ABC-123/notes/raw-out-proof-red-unfixed.txt
  - .grugops/context/ticket-to-pr-ABC-123/notes/raw-out-proof-green-fixed.txt
  - .grugops/context/ticket-to-pr-ABC-123/notes/raw-harness-spawn-spy.cjs.txt
  - .grugops/context/ticket-to-pr-ABC-123/notes/raw-out-spawn-spy-unfixed.txt
  - .grugops/context/ticket-to-pr-ABC-123/notes/raw-out-spawn-spy-fixed.txt
  - .grugops/context/ticket-to-pr-ABC-123/notes/raw-out-gates.txt
supersedes:
---

# ABC-123 readings: A1 red on the unfixed wrapper (3 rows, exit 124) and green after the fix; A2/A3 unchanged on both; gates green at 48/1467; N8-LANE 0, N8-SPAWN 0 ms

Hand-authored and unsealed. macOS Darwin 25.5.0, Node v24.12.0, 2026-09-26 around 20:49–20:52 UTC.
Machine load average about 10 (1-minute).

## A1: red first, then green (`node tools/grugops/run-bounded.proof.js`)

- **RED.** The run used the extended proof with `run-bounded.js` byte-identical to HEAD `e57da89`
  (sha256 prefix `bc62fa26aee41f71`, checked with `git diff --quiet`). **Exit 1, 3 rows FAILED,
  exactly the three A1 rows.** At `2147483648`, `99999999999` and `9007199254740993` each reading
  was the same:
  - exit 124;
  - stderr carried `TimeoutOverflowWarning ... Timeout duration was set to 1.` and then
    `run-bounded: timed out after <N> ms, killed the process tree of: ...`;
  - stdout was empty, because the healthy target was killed.

  This matches the ABC-122 gate's own measurement.
- **GREEN.** Same proof, fixed wrapper (sha256 prefix `f0f61c79d663a3e9`). **Exit 0, "all rows
  held".** The three A1 rows gave exit 2, stderr exactly the usage line, and an empty stdout.
- **Spawn-count probe** (a preload counting `child_process.spawn` calls, not committed; harness
  `raw-harness-spawn-spy.cjs.txt`):
  - the unfixed wrapper made **1** spawn per A1 value, then killed the target (124);
  - the fixed wrapper made **0**, which is "before spawning" demonstrated;
  - the boundary `2147483647` made 1 spawn and exited 0 in both.

## A2: the boundary

`N=2147483647` passed on the UNFIXED and on the FIXED wrapper: exit 0, the marker on stdout, and
an empty stderr (no overflow warning). The accepted range did not narrow.

## A3: every existing case, unchanged

The same rows passed on both the unfixed and the fixed wrapper:
- **Rejected** (exit 2, usage line, no target output): `""`, `0`, `-5`, `abc`, `1.5`, `NaN`,
  `Infinity`, and no arguments at all.
- **Accepted** (exit 0, target output, empty stderr): `1e3`, `0x3e8`, `" 1000 "`, `1000.0`,
  `0b1111101000`.

The old ABC-122 rows (A2 pass-through at exit 0 and 3; the hang killed in 526.8 ms before the fix
and 527.4 ms after; no survivors) also held on both runs.

## Gates (A7), run at the fixed working tree

| gate | reading |
|---|---|
| `npm test` (through the wrapper, `60000`) | exit 0, **48 files / 1467 tests passed, 0 skipped**, 5.11 s. This equals the current wave baseline (48/1467, not the ticket's stale 47/1446). The proof adds no vitest rows |
| `npm run lint` | exit 0, 85 files. **Biome's `files.includes` does not cover `tools/`**, so lint did not read either changed file. That is honest scope, not a pass on them |
| `npm run typecheck` | exit 0 (`tsc --noEmit`) |
| `npm run build` | exit 0 (`tsc --noEmit`, the same command under the build slot's name) |

`node_modules` was a temporary symlink to the main checkout's (the lockfile was byte-identical).
It was removed after the runs and was never staged.

## Lane charge and spawn count

- **`N8-LANE`: not engaged, 0 ms against 650 ms.** The proof is a `.js` under `tools/`. Vitest's
  default include only collects `*.test.*` / `*.spec.*`, and the lane collected 48 files, the same
  as the baseline. There are 0 new `src/` files.
- **Proof cost outside the lane**, informational only: the whole extended proof took 1.53 s real,
  1.09 s user and 0.16 s sys (`/usr/bin/time -p`, one run).
- **Children the new rows force, per proof run: 23.**
  - A1: 3 wrappers and 0 targets.
  - A2: 1 wrapper and 1 target.
  - A3: 13 wrappers (7 rejected, 1 no-argument, 5 lenient) and 5 targets.

  On the unfixed wrapper there are 26, because the 3 A1 targets are spawned and then killed.
- **`N8-SPAWN` charge: 0 ms.** The account attributes criterion-forced children inside the lane's
  `NFR-008` CPU. None of these children runs in the lane. The ruling is Security/NFR's to confirm.
- **ASVS firing threshold** (spawn interpolating an external string, or `shell: true`): **not
  fired.** Both files spawn argv arrays only. `grep shell` matches only the wrapper's SECURITY
  comment.
