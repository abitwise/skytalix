---
id: 20261031T053932Z-software-engineer-observation-563fc63b
kind: observation
by: software-engineer
at: 2026-10-31T05:39:32Z
verified_by: 
confidence: high: reads per search are arithmetic from budget and step; RF-1 reads probed at base and head
refs:
  - se-ABC-221
  - ABC-221
  - EPIC-009
  - ADR-0052
  - ADR-0045
  - ADR-0044
  - ADR-0046
  - ADR-0027
  - NFR-004
  - NFR-008
  - NFR-009
  - AR-NFR004-A
  - AR-UCI-BUSY
  - SEC-220-b
  - QE-220-a
  - QE-244-a
  - ABC-220
  - ABC-244
  - grugops/ABC-221
  - c48a6f83
  - d58f2d77
  - src/uci-session.ts
  - src/engine.ts
  - src/uci-session.test.ts
  - src/uci.real-engine.test.ts
  - src/engine.test.ts
  - src/levels.test.ts
supersedes: 
seal: sha256:6b5f91ba0637a8d7f3f21f34650bf0ea6742c50b6d9c5f36a4c1360b92423927
---

# `ABC-221` R1 census (`ADR-0046` § Addendum 2026-10-30; ticket A9): 3 real-engine rows added, all class P; 0 time-blind; RF-1 rows read the same

Reads per search are ⌈budget ÷ step⌉, the ticket's definition. The engine also reads once at start, once per
iteration and once at return, so a 1 ms budget still makes a few readings.

## Default-lane rows this build adds that reach the real `chooseMove` (virtual clock)
| row (file > block > title) | budget | step | reads per search ⌈b ÷ s⌉ | class | R2 |
|---|---|---|---|---|---|
| `uci-session` > ABC-221 > A5 > go wtime 800 btime 800 on the real engine (step 10): a legal move at depth 1, and the clock used is 2 readings, 20 ms | 1 | 10 | 1 | P: reads `time` (= 20) and depth (= 1, the unabortable first iteration) | keeps its step |
| `uci-session` > ABC-221 > A7 > the real engine on a step-5 000 clock: go movetime 90000 reports time in [59 500, 59 500 + 2 x 5 000], past the old 32 000 clamp | 59 500 | 5 000 | 12 | P: `expectWithin(time, 59 500, 5 000)` | keeps its step |
| `uci-session` > ABC-221 > A11 > isready that arrives mid-search is answered once, after the bestmove, in order | 30 000 | 5 000 | 6 | P: `expectWithin(time, 30 000, 5 000)`; the 3rd reading is a precondition | keeps its step |

- **Time-blind real-engine rows added or edited: 0.** No R2 step is owed.
- The in-thread time of all 33 `ABC-221`-titled rows was **39 ms** in one head `npm test` (vitest JSON). The largest
  was the A7 real row at 13.5 ms, then A4 (120 stubbed plies) at 5.2 ms and A11 at 4.8 ms.

## Rows the ticket lists that do NOT reach the real engine (0 reads)
- **The period rows A2, A3, A4 and A6** (and A5's two stubbed rows, A7's five shapes, A1, A8 and A12) run through
  `session220`'s stubbed `chooseMove`. That is the `ABC-212` budget-read arm, reset after each row.
- **A8's parity rows:** `ABC-220` A8's 14 rows ("…A3's period gives base's budget on every go, row for row") and this
  build's two A8 rows are stubbed too.
- The re-pinned rows (`ABC-167` A1, `ABC-171` A1, `ABC-220` A1/A8/A10, engine RF-1 "names the ceiling", levels clause
  B) do not search.

## Rows whose budget follows the clamp (`RF-1`, ticket A9: "the same number of clock reads")
Probe `raw/rf1-census.mjs`, plain node, run against the base tree (`git archive d58f2d77`) and the head `src/`:

| row | base (clamp 32 000) | head (clamp 60 000) |
|---|---|---|
| `engine` RF-1, `run(2 × H)` on step H ÷ 2 | 4 reads, 108 nodes, depth 2 | 4 reads, 108 nodes, depth 2 |
| `engine` RF-1, `run(H)` | 4 / 108 / 2 | 4 / 108 / 2 |
| `engine` RF-1, `run(Infinity)` | 4 / 108 / 2 | 4 / 108 / 2 |
| `levels` Security/NFR R1 (QE-087-c), step H ÷ 20, budget 2 × H | 24 reads, blunder, elapsed 23 steps | 24 reads, blunder, elapsed 23 steps |

- The other rows that hand the engine `HARD_CEILING_MS` are `engine.test.ts` `ABC-170` A2 (`LONG_MS`, ended by
  `maxNodes` 6 000) and `fixedDepth` (ended by `maxDepth`). On a 1 ms clock they end on nodes or depth long before
  32 000 readings, so the clamp move changes no reading. Their exact-figure rows pass unedited.
- `ABC-212` A9's `searchAt` steps on ⌊level budget ÷ 30⌋, not on the clamp, so it is unchanged.
