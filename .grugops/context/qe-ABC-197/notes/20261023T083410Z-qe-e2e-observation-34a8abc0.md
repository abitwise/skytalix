---
id: 20261023T083410Z-qe-e2e-observation-34a8abc0
kind: observation
by: qe-e2e
at: 2026-10-23T08:34:10Z
verified_by: 
confidence: high (own runs; counts only, no timing)
refs:
  - ABC-197
  - QE-177-b
  - ABC-177
  - ABC-178
  - ABC-167
  - EPIC-007
  - A1
  - A2
  - A3
  - A4
  - A5
  - A8
  - src/uci-session.test.ts
  - plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md
  - 051d557a
  - 20e397c8
  - 82a3f153
  - 8804937e
  - 20261023T082318Z-ba-pm-decision-4df5ef95
  - .grugops/context/qe-ABC-177/probe/gap/gp.mjs
  - src/uci-session.ts
  - src/engine.ts
  - src/virtual-clock.ts
  - src/levels.ts
  - 20261023T082311Z-ba-pm-observation-9712ad09
supersedes: 
seal: sha256:0cda7dcde7db5da3b56a0ad1d4c101cdd91c0dd0c354da9ca00e9bada161e522
---

# `ABC-197` A5 as re-ruled: QP0 green, QP6 and QP6-2800 red, at the tip on the file and on the lane; base blind to both. The clock rule holds from `src/` and in a 34-row scan. Counts only, no timing

This is an observation, not a finding: no stamp exists on this install. A5 is the re-ruled three-probe table (BA/PM `…4df5ef95`).

## The probe script
- `qe-ABC-177/probe/gap/gp.mjs`, byte-copied to scratch (`cmp` equal, sha256 `69b2e0ba…`).
- **One variant was added to a scratch copy, `gp197.mjs` (sha256 `687f9890…`), before any tip run.** `diff gp.mjs gp197.mjs` is one inserted entry after QP6: QP6's two edits verbatim, with `2_800` in place of `2_500`, `id: "QP6-2800"`. Nothing else differs.
- Run as `node gp197.mjs <tree> <B|H> <file|lane> QP0,QP6,QP6-2800`. After the runs, `src/uci-session.ts` in B and H was `cmp`-equal to `git archive` of its commit.

## Readings (rows red / total; the named red row)

| probe | B file | B lane | H file | H lane |
|---|---|---|---|---|
| QP0 (none) | 0 / 127 | 0 / 2 018 | 0 / 128 | **0 / 2 019** |
| QP6 (G 2 500) | 0 / 127 | 0 / 2 018 | **1 / 128, R2** | **1 / 2 019, R2** |
| QP6-2800 | 0 / 127 | 0 / 2 018 | **1 / 128, R2** | **1 / 2 019, R2** |

- Every cell of A5's table is met: QP0 green with 0 red on the lane; QP6 and QP6-2800 red on R2 and ≥ 1 red on the lane.
- The base survives both wrong builds on the file and on the whole lane. So both kills are ones R2 adds: QE-177-b's kill comes back.
- In each red run the only red row is R2. The kill rests on one row (`QE-197-d`).

## The clock rule `time = (⌈G/step⌉ + 1) · step`: holds
**From `src/` at the tip:**
- `virtualClock(s)` returns its reading and then adds `s`.
- `deepen` reads `start = now()` and sets `deadline = start + min(G, HARD_CEILING_MS)`. Depth 1 reads no clock (`nextCheck` is `Infinity`). After it, the clock is read in `countNode` every 1 024 nodes and at the loop head, and the search stops at the first reading ≥ deadline. `elapsedMs` is one more read, minus `start`.
- So the stopping read is `start + ⌈G/s⌉·s`, and `elapsedMs = (⌈G/s⌉ + 1)·s`. This holds when the deadline, not a depth, node or iteration limit, ends the search. That is true on R2's path, where the token is dropped and no limit is set.
- `go` caps G with `Math.min(request.budgetMs, level.budgetMs)`. Level 5 (the default and the highest) is 3 000 and the parse default is 5 000, so G on this path is at most 3 000.

**In scratch (`scan.mjs`):** a third archive of the tip, QP6's two edits with G as a parameter, the R2 dialogue run directly, source restored and `cmp`-checked.
- 34 rows, steps 100 and 1 000, G ∈ {none, 999, 1 000, 1 001, 2 000, 2 001, 2 500, 2 700, 2 799, 2 800, 2 801, 2 850, 2 900, 2 999, 3 000, 3 001, 3 300}. The model matches `time` on **34 / 34**.
- Step 100 (R2): G ≤ 2 800 reads ≤ 2 900 (red). G 2 801 to 2 900 reads 3 000 (green). G 2 999 to 3 300 reads 3 100 (green; G > 3 000 is clipped, 25 621 nodes, `bestmove g1f3`, the correct build's output).
- Step 1 000 (U7): G ≤ 1 000 reads 2 000 (red). G 1 001 to 2 000 reads 3 000 (green). G ≥ 2 001 reads 4 000 (green).
- So a `time ≥ 3 000` row is blind on (3 000 − 2s, 3 000): 200 ms at step 100, 2 000 ms at step 1 000. This agrees with the page's 2026-10-23 erratum.
- R2's window `[3 000, 3 200]` is green exactly for a capped G in (2 800, 3 100]. On this path that is (2 800, 3 000], the accepted residual (`QE-197-a`).
