---
id: 20261101T191116Z-software-engineer-observation-8912d2dc
kind: observation
by: software-engineer
at: 2026-11-01T19:11:16Z
verified_by: 
confidence: high on the gates as run; G8 head-only, not interleaved
refs:
  - se-ABC-261
  - ABC-261
  - ABC-254
  - EPIC-010
  - ADR-0003
  - NFR-008
  - NFR-001
  - QE-254-b
  - QE-254-c
  - grugops/ABC-261
  - dd8b17ea
  - ceb28780
  - src/legal.test.ts
  - src/gameend.nfr.test.ts
  - qe-ABC-254/20261101T172756Z-qe-e2e-observation-dede949b
supersedes: 
seal: sha256:36beceafd600e7dbb8bac3d2dde05ed15ba00412f6f441f510813e02440629d2
---

# ABC-261 gates (A1, A7, A8, A9): npm test 2 374 = base 2 372 + 2, 0 skips; rows' median sum 0.42 ms; G8 head median 8.77 s; lint, typecheck and build exit 0; skip-integrity and lane inventory clean

All runs were in worktree `.claude/worktrees/se-ABC-261` at `dd8b17ea`, under the host flock. Raw output is in `raw/gates/`.

- **A1:** both new rows pass at the tip, in all three head runs.
- **A9, count:** base `ceb28780` (git archive, same node_modules) gives **63 files, 2 372 passed**. Head gives **63 files, 2 374 passed, 0 failed, 0 skipped, 0 todo** (from the vitest JSON). That is base + 2.
- **A9, G8 (NFR-008 <= 10 s):** three head runs of `npm test` as spelled took wall **8.78 / 8.77 / 8.76 s**, so the median is **8.77 s**. Vitest reported Duration 8.46 / 8.44 / 8.40 s. load1 was 2.28 to 3.12 and no foreign vitest was running. This is a head-only read; it is not interleaved with base.
- **A8 (<= 30 ms):** the two rows' summed duration from the three JSON reports is 0.40 / 0.42 / 0.43 ms, so the **median is 0.42 ms**.
- **A9, other gates:**
  - `npm run lint`, `npm run typecheck` and `npm run build` all exit 0.
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.
  - `node tools/grugops/lane-inventory.js`: 63 = 63, `No findings.`
- **A7:**
  - `git diff ceb28780 dd8b17ea --name-only -- src` lists only `src/gameend.nfr.test.ts` and `src/legal.test.ts`.
  - The only removed lines are two import lines, each widened. No existing title and no existing `expect(` line changed.
  - The added comments cite only ABC-261, ABC-254, ABC-217, ABC-206, QE-254-b and QE-254-c.
  - Neither file carries a header test count of its own, so there was none to raise. The "45 tests" in gameend.nfr.test.ts's header counts gameend.test.ts.
  - **Deviation, disclosed:** commit `dd8b17ea` also carries the brief's claim move: `.grugops/queue/pending→claimed/se-ABC-261.md` and `claimed/se-ABC-261.claim.md`. It was staged before the code and swept in. That is queue bookkeeping, not ticket diff. The brief fences amend and rebase, so the commit was left as is. Read with `-- src`, A7 holds. The full `--name-only` also prints those two `.grugops/queue/` paths.
- **UAT waiver (ticket test note 3):** `git diff --name-only dd8b17ea~1 dd8b17ea | grep -v '\.test\.ts$' | grep '^src/'` prints nothing. There is no production line.
