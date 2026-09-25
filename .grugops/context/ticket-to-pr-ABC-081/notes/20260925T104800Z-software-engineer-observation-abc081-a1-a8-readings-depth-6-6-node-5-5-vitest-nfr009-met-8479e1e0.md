---
id: 20260925T104800Z-software-engineer-observation-abc081-a1-a8-readings-depth-6-6-node-5-5-vitest-nfr009-met-8479e1e0
kind: observation
by: software-engineer
at: 2026-09-25T10:48:00Z
verified_by:
confidence: high
refs:
  - ABC-081
  - ABC-078
  - ABC-080
  - ADR-0025
  - ADR-0006
  - NFR-005
  - NFR-009
  - src/transposition.test.ts
  - .grugops/context/ticket-to-pr-ABC-081/probe/measure.mjs
  - .grugops/context/ticket-to-pr-ABC-081/probe/depth.mjs
  - .grugops/context/ticket-to-pr-ABC-081/probe/depth-vitest.test.mjs
  - .grugops/context/ticket-to-pr-ABC-081/probe/depth-node.jsonl
  - .grugops/context/ticket-to-pr-ABC-081/probe/depth-vitest.jsonl
  - .grugops/context/ticket-to-pr-ABC-081/probe/ties.mjs
supersedes:
---

# ABC-081 as measured at `0076e6a`: A1–A8 each MET; depth in 3 s is 6 / 6 under plain node and 5 / 5 under vitest

Hand-authored, no `seal` (degraded posture per `AGENTS.md`). Node counts are deterministic.
Milliseconds and depths come from Apple M3 and node v24.12.0, under background load (load
average given with each reading).

| # | reading | verdict |
|---|---|---|
| `A1` | Table on = table off, fixed depth 4. Six perft roots: startpos 0, kiwipete 50, position-3 90, position-4 −375, position-5 515, position-6 30. **`G6` (`ADR-0006`'s pair): `knight-g1` `w K` 830 = 830 and `w -` 820 = 820, with the keys different.** Moves were identical too, though not required. Default lane: position-3 (1 123 vs 1 299 nodes) and the pair; the rest run under `SEARCH_DEEP` | **MET** |
| `A2` | Fixed depth 5: **kiwipete 988 / 6 196 = 15.95%, position-6 1 075 / 6 988 = 15.38%**; bar ≥ 15%, **met narrowly**. Iterative deepening to 5: 39.58% / 45.08% | **MET** |
| `A3` | Iterative deepening to 5, ordering on in both, table + hash move vs table off: **kiwipete 123 920 / 193 821 = 63.94%, position-6 91 420 / 183 215 = 49.90%**; bar ≤ 70%. The ruling's prototype read 63.2% / 49.7%. Scores are identical (50 / 35) | **MET** |
| `A4` | Table level: a mate-in-2 stored at ply 1 reads `MATE−4` at ply 1 and `MATE−6` at ply 3; a mated-in-2 reads correctly at plies 2 and 4. Search level (`SEARCH_DEEP`): `chooseMove(k7/8/8/K7/8/8/8/1R6 b, 160 ticks)` reaches depth 10 and reports −29 992, which is `searchWithoutTable`'s own depth-10 answer (1 583 085 nodes). A table without the ±ply adjustment reports −29 994. See the claim note for the mate-in-1 caveat | **MET** |
| `A5` | `7k/5Q2/6pp/qr6/8/8/6PP/7K w`: depth 4 scores **exactly 0** with Qf8+ (depth 3: −470). `chooseMove` at 6 ticks: depth 4, 0, Qf8+. The ply-5 fixture and its colour-flipped twin score 0 at depths 5 and 6, table on AND off (`SEARCH_DEEP`). A search blind to repetition reads −390 / −475 | **MET** |
| `A6` | Grep of `search.ts`, `engine.ts`, `transposition.ts` and `quiescence.ts` finds no `./history(.ts)` import. A `BigUint64Array` constructor spy counts **1** per `search()` at depth 1 and at depth 4, and **1** per `chooseMove` across ≥ 3 iterations | **MET** |
| `A7` | `tableByteLength()` is 4 194 304 before and after searches of every size. `NFR-009`, child `node --expose-gc`, kiwipete 1 s (depth 5) → 3 s (depth 6): **`heapUsed` 7.91 → 7.92 MiB, `arrayBuffers` 4.01 → 4.01 MiB.** The same row went **RED** against a `Map`-backed table: `heapUsed` +5.23 MiB, while `arrayBuffers` stayed at 0.01 and was blind to it | **MET** (`NFR-009`: 4 MiB table + 1 032 B key array, well under 16 MiB) |
| `A8` | `git diff --name-only 6033d05 0076e6a -- src/history.ts src/legal.ts src/turn-loop.ts` is empty. Suite green, skip 0 | **MET** |

## Depth completed in 3 s (`chooseMove`, `DEFAULT_BUDGET_MS`): this build vs the base, same process, 3 rounds

| runner | position | base `6033d05` | this build | rounds | load1 |
|---|---|---|---|---|---|
| plain node | kiwipete | 6, 6, 6 | **6, 6, 6** | 3/3 | 4.65–5.12 |
| plain node | position-6 | 5, 5, 5 | **6, 6, 6** | 3/3 | 4.65–5.12 |
| vitest | kiwipete | 4, 4, 4 | **5, 5, 5** | 3/3 | 3.59–4.24 |
| vitest | position-6 | 4, 4, 4 | **5, 5, 5** | 3/3 | 3.59–4.24 |

- **`NFR-005`'s floor is 6, and neither this reading nor this build is its verdict.** Under plain
  node this build reaches 6 on both positions. Under vitest it reaches 5 on both. Which runner
  binds is the owner's open question. The runners differ by about 7x in nodes per second here:
  plain node reaches about 925 000 nodes in 3 s, vitest about 127 000.
- `ENGINE_DEEP`'s own `NFR-005` case at `318c11a` read vitest kiwipete 5 (126 730 nodes,
  3 007 ms) and position-6 5 (142 622, 3 027 ms), load 4.7–5.2. `A1`'s worst case was 3 024 ms at
  depth 6, with 29/30 over 3 s by the abort granularity and 0/30 over 5 s.
- Oddity, explained: this build's plain-node position-6 count was 866 590 in all three rounds.
  A budget sweep (`probe/p6.mjs`) shows the count moving normally with the budget. Counts step
  in 1 024-node clock buckets, so three rounds landed in one bucket. The same mechanism explains
  the identical A/B counts within a vitest round, where the base and the build share an
  identical, unabortable depth-1 iteration.

## The `ABC-078` `A3` identity sweep, as amended

`probe/ties.mjs` reproduces the sweep over 368 (position, budget) pairs: the endgames plus their
children at 3 and 5 ticks, and the perft roots plus their children at 5. **0 score divergences.
6 equal-score different root moves, all accepted by the amendment** (4 in the endgames, 2 in the
perft children). The ruling's prototype saw 1 in 48.

## Lanes run

- **Default:** 45 files, **1 444 passed, 0 skipped** (base 44 / 1 418). Skip-integrity:
  `No findings.` `biome check .` 81 files clean; `tsc --noEmit` (typecheck = build) exit 0.
- **`SEARCH_DEEP=1`**:
  - At `318c11a`, on `search.test.ts`, `search.ordering.test.ts`, `quiescence.test.ts`,
    `search.qe.test.ts` and `transposition.test.ts`: **177/177, 109.8 s**.
  - At `0076e6a`, `transposition.test.ts` alone: **40/40, 47.9 s**.
  - `ABC-080`'s A3 now reads kiwipete 2.25% and position-6 1.73% at depth 4.
  - `ABC-080`'s A4 ladder, depth 5: kiwipete MVV-LVA 166 490 → + killers 157 042 → + hash move
    126 441; position-6 177 146 → 140 781 → 114 443.
  - The unordered position-6 depth-4 count moved 1 663 808 → 1 663 124. Every door now detects
    repetition at the ply-4 leaves.
- **`ENGINE_DEEP=1`:** `engine.test.ts` **33/33, 119.4 s** (`318c11a`); `transposition.test.ts`
  **26/26, 4.8 s** (`0076e6a`).
