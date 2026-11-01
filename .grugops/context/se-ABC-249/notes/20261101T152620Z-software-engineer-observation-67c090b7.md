---
id: 20261101T152620Z-software-engineer-observation-67c090b7
kind: observation
by: software-engineer
at: 2026-11-01T15:26:20Z
verified_by: 
confidence: high: commands run under the host lock as recorded; outputs kept in scratch se-249/
refs:
  - se-ABC-249
  - ABC-249
  - ADR-0054
  - QE-248-c
  - QPLY4
  - EPIC-010
  - grugops/ABC-249
  - 09d1f675
  - NFR-008
  - G8
supersedes: 
seal: sha256:3ef1a2d1eff33bf2e475d56b5b8a823f99edfc3951be9379f3b59dc3a7e81cac
---

# ABC-249 runs (all under flock host-test.lock, after host-clear)

- **A3:** QPLY4 (frozen-mutants.json id QPLY4: `if (ply >= 4) return false;` before `let matches = 0;`) applied alone to an out-of-tree scratch copy (`se-249/mut/`, diff = that one line), with the head `engine.test.ts`. `vitest run src/engine.test.ts -t ABC-249`: **1 failed**. Expected {f1e1, 404}, received {f1g1, 497}. At production: **1 passed**. Never committed.
- **A5:** row duration in the vitest JSON report of three head `npm test` runs: 6.05, 3.80, 3.93 ms, **median 3.93 ms** (budget 100 ms). Nodes: 1 642 with the keys + 767 withheld = 2 409 per row (probe readings at depth 4). Fixed depth on `virtualClock(1)`, so no real clock is read.
- **A6:** lint exit 0 (131 files), typecheck exit 0, build exit 0. Base (`09d1f675`, row stashed): `npm test` 2 362 / 2 362 green, 9.05 s, load1 2.18. Head: 2 363 / 2 363 green, 0 skipped, in each of three runs: 9.27 s (load1 2.63), 9.70 s (2.77), 9.47 s (2.89). Informal median **9.47 s**. **Not an ALONE G8 reading:** a foreign vitest run (another project, `/home/olger/projects/public/grugops`, started 15:02) was running throughout. QE reads G8.
- `test-skip-integrity .grugops/test-skips.md --skip-count 0`: No findings. `lane-inventory`: 63 files collected, 63 tracked, No findings.
- First base attempt: 1 failure (`cli.test.ts` ABC-192 A2 reads `<repo>/node_modules/vitest/package.json`) because the fresh worktree had no node_modules. It went green once node_modules was symlinked into the worktree. This was an environment fault, not a code fault.
- Deep lanes against QPLY4: not run (out of scope).
