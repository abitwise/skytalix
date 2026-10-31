---
id: 20261031T070529Z-architect-design-observation-f1e25b52
kind: observation
by: architect-design
at: 2026-10-31T07:05:29Z
verified_by: 
confidence: medium: shape and ranking from one unscreened lane report; row facts read from src at 4cd261c1; note counts by find and git ls-tree
refs:
  - arch-g8-tranche2
  - ADR-0046
  - ADR-0035
  - ADR-0050
  - ADR-0040
  - NFR-008
  - EPIC-010
  - ABC-244
  - ABC-245
  - ABC-246
  - ABC-221
  - ABC-242
  - ABC-243
  - ABC-167
  - ABC-171
  - ABC-174
  - ABC-197
  - ABC-212
  - ABC-220
  - ABC-241
  - ABC-208
  - QE-245-b
  - QE-221-c
  - QE-208-a
  - QE-208-b
  - T2a
  - T2b
  - T2c
  - T2d
  - T2-R
  - W1
  - R1
  - R2
  - T-QEHOP-GROWTH
  - qe-ABC-245/20261031T064950Z-qe-e2e-observation-af467c7b
  - qe-ABC-245/20261031T064950Z-qe-e2e-observation-cf53b0ed
  - qe-ABC-244/20261030T230742Z-qe-e2e-observation-3c2ac5a2
  - qe-ABC-243/20261031T040755Z-qe-e2e-observation-99b6b89f
  - qe-ABC-242/20261031T051332Z-qe-e2e-observation-24035110
  - qe-ABC-221/20261031T060935Z-qe-e2e-observation-b348899a
  - se-ABC-244/20261030T224640Z-software-engineer-observation-ee17f704
  - se-ABC-244/20261030T224640Z-software-engineer-observation-1b63ff56
  - 38d02496
  - 4cd261c1
  - c48a6f83
  - 9c008db4
supersedes: 
seal: sha256:45ffb768258f70fd8e9b894165f40b22c15d270bb7163ba503ad8afc9200c25e
---

# Census of today's default lane (shape only) and the re-costed candidates: uci-session 1.71 s, null-move 1.55 s, cli children ≈ 3.37 s; A5 duplicates two other rows' reads; ABC-221 put D4 arithmetic on the stub seam (why T2a is stale); A4-a2 is one time-blind row tranche 1 missed; T-QEHOP-GROWTH has fired

**Source.** `se-ABC-221`'s `npm test` JSON at `c48a6f83` (2026-10-31T05:38Z).
- It equals `qe-ABC-245`'s base `9c008db4` on `src/`, `tools/`, `data/`, `package*` and `vitest.config.ts`.
- Snapshot: `raw/probe/last-run-se-ABC-221-c48a6f83.json`, sha256 `8e4e281c22c7b10eae0baff184e36426da3686854cb4b3327a6e25008528f8dd`.
- Readouts in the same directory: `rank.out`, `rows.out`, `uci-rows.out` and `timeline.out`.
- Its load, power and window are `UNKNOWN - verify`. It is **not admissible**, and it is used for shape and ranking
  only.

**The lane.**
- The in-vitest span is 8.61 s over 63 files, still throughput-bound on 2 slots.
  - Slot B: null-move, 0.26–1.81 s.
  - Slot B: `cli.test.ts` collect, 1.81–5.18 s. Its 28 children take ≈ 3.37 s.
  - Slot B: `cli.test.ts` rows, 5.18–5.80 s.
  - Slot A: uci-session, 0.22–1.93 s, then engine, qe-hop and the mid-sized files.
- The two slots share the tail. One slot-second saved is ≈ 0.5 s of wall.

**Where the time goes, in-thread:**
- **`uci-session`, 1.71 s.** The class P/C rows take ≈ 0.95 s:
  - A5, 0.33 s;
  - A7's R2, f2, f3, depth 3 and `searchmoves`, 0.32 s;
  - A6-d1, 0.06 s;
  - `ABC-174` A5, `ABC-171` A6, `ABC-212` A9 and the Hash row, 0.23 s.
- **Null-move, 1.55 s:**
  - `QE-208-a`, 0.40 s;
  - `QE-208-b` ×2, 0.37 s;
  - the A2 instrument, 0.31 s;
  - the doors, 0.25 s;
  - the zugzwang rows, 0.15 s.
- **`cli` rows, 0.62 s.** Of that, `ABC-241` U2 takes 0.25 s; it kept step 100 on parity at tranche 1.
- **Engine, 0.60 s.** `ABC-230` A4 takes 0.25 s. It runs 5 ms at step 1, 5 intervals, so condition 2 holds it.
- **qe-hop-integrity, 0.28 s.**

**Findings that bear on the candidates:**
- **A5's "a bare go → 4 000" duplicates the read** made by `ABC-174` A5, A7-f2, A7-f3 and `ABC-197` R2.
- **A5's "G = 3 500" sends the same go line and bound** as `ABC-171` A6's level-5 row.
- **The D4 arithmetic is pinned exactly on the stub seam** by `ABC-220` A8 (7 levels × 2 setups × 40 goes), by
  `ABC-212` A12, and by `ABC-221` A8/A12. That is why T2a is stale. One gap: `ABC-220` A8 replays one side to move
  with equal clocks, so A5's white and black rows may be the only killers of a level-mode wrong-side build
  (`UNKNOWN - verify`).
- **`ABC-167` A4-a2 is time-blind and runs a bare go at step 100** (40 reads, 77 ms). Tranche 1's scope did not reach
  it.
- **`ABC-167` A3's two rows cannot move:** 100 ms at step 100 is 1 interval, which condition 2 forbids.
- **`QE-208-a`'s cost is Σ readings × 1 024 nodes, whatever the root.** So only sparser sampling cuts it. `QE-208-b`'s
  cost is the depth-6 search on position-6, so a cheaper root cuts it.
- **The hold rows (A6-e1/e4/e5/j1, A7-i5/i6) read about 2 ms each.** `ABC-221`'s ceiling raise did not make them
  costly, so there is no step-set extension candidate.

**Candidates, re-costed.** Wall is taken as in-thread ÷ 2, and every figure is an estimate:
- **T2a narrow:** −0.06..−0.16 s, LOW-MEDIUM risk, no coverage lost under default-lane parity.
- **T2a wide:** ≈ −0.47 s, MEDIUM risk. It loses the D12 depth and `searchmoves` reads on a clock, the dropped-token
  time reads, the ponder hold at the ceiling, and the level rows.
- **T2b:** ≈ −0.39 s, MEDIUM risk. It loses two `ADR-0050` guards. `AGENTS.md`'s "44 rows" becomes "48 rows", the
  same byte count.
- **T2c widened:** −0.05..−0.25 s, LOW-MEDIUM risk, no coverage lost if parity holds.
- **T2d:** ≈ −0.035 s, LOW risk, no coverage lost.
- **U2 to deep lanes:** ≈ −0.17 s, MEDIUM risk. It loses the ep-repetition guard.
- **O4:** ≈ −0.06 s per child, MEDIUM-HIGH risk.
- **O5:** HIGH risk.
- **`maxWorkers`, the heap flag or W:** the owner's.
- **Rejected:**
  - a coarser step on a P row, which changes the bound;
  - a "jump" clock, which loses kills for W < G − s.

**`G8` history** (head / base, s):
- `ABC-244` 9.25 / 9.69;
- `ABC-243` 9.28 / 9.23;
- `ABC-242` 9.41 / 9.21;
- `ABC-221` 9.84 / 9.82, inadmissible as a trigger;
- `ABC-245` 9.82 / 9.44.

In quiet windows the spread within an arm is 0.13–0.15 s. In `ABC-245`'s window it is 0.75 s for the head, and 1.11
s over all six runs.

**`T-QEHOP-GROWTH` (`ADR-0035` B3) has fired.**
- `main` holds 4 206 notes at `4cd261c1`, by the trigger's own `find`.
- The count crossed 4 000 on 2026-10-30, between `33669cd8` (3 992) and `e7b22c11` (4 036), by `git ls-tree`.
- No re-read is on record. It is routed to the Orchestrator: QE reads, and Architect/Design records the result.
- Severity LOW.
