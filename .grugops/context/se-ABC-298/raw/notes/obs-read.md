# se-ABC-298 readings at the head: every SG row against QE's frozen figures. Every value row equal; three source-shape rows red (the STOP); G4 not run

Software Engineer, task `se-ABC-298`, on `grugops/ABC-298`: build `43fe357e`, rows `05b2ea2f`. Every run was under the host lock, on one core, one at a time, and vitest ran with one worker. No timing figure was taken: the walls below are INFO, and `NFR-008` is QE's read. Lock holds are in `raw/out/holds.txt`.

| row | frozen (qe-ABC-298-freeze …44a6717d) | head | |
|---|---|---|---|
| SG0 perft | blob `8fe75ef0`; default 24 / 24; `PERFT_DEEP=1` 32 / 32 | blob `8fe75ef0` (unchanged); default 24 / 24 (inside the lane); `PERFT_DEEP=1` 32 / 32 | equal |
| SG1 (a), 7 rows | `sg1a.jsonl` (311 546 / 163 523 / 573 518 / 1 320 857 / 94 911 / 234 984 / 523 610; e2a6, c3d5; −81, 71, −114, −128, 45, 34, 64; reads 568, 1 299, 102, 240, 523) | QE's `sg1a.mjs` on the working tree of the build: `cmp`-equal to `sg1a.jsonl`, 7 / 7 `pure:true`. The new `SEARCH_DEEP` rows read 7 / 7 | equal |
| SG1 (b), `G4` | `g4.jsonl` `b65f747a…`, `g4-sample.jsonl` `2e1534f0…` | **not run** (about 36 min of lock); stopped first | UNKNOWN - verify |
| SG1 (c), default lane | 2 734 / 2 734 | 2 779 / 2 782. The 2 734 old rows hold 2 731 green and 3 red (the STOP's three source rows). The 48 new rows are all green | 3 red |
| SG1 (c), `ENGINE_DEEP` `engine` | 105 / 105 | 105 / 105 | equal |
| SG1 (c), `ENGINE_DEEP` `uci-session` | 270 / 270 | 270 / 270 | equal |
| SG1 (c), `SEARCH_DEEP` `search.bundle` | 49 / 49; mate floor `search()` 0 of 191, `chooseMove` 0 of 189 | 55 / 56. The red one is the STOP's row 1, which runs in the lane too. The 7 new rows are green. Mate floor: 0 of 191 and 0 of 189 (`ABC-303`), 0 of 190 and 0 of 188 (`ABC-283`) | 1 red (source) |
| SG1 (c), `PUZZLE_DEEP` `puzzle-suite` | 18 / 18, `G1` 54 / 58 | 18 / 18, `G1` 54 / 58 | equal |
| SG1 (c), test diff | — | `git diff b9b8eee9..HEAD -- 'src/*.test.ts'`: 0 removed lines; four files gain rows. The 12 mocking files are byte-unchanged | adds only |
| SG2 (a), 38 cases | QE's hand answers, equal to `main`'s oracle | 38 / 38 through `legalMoveFrom`, through `entryMoveLegal` and against the oracle; position unchanged | equal |
| SG2 (a), per-square row | the specification (QE-298-i) | default: SG2 (a)'s 18 boards and the six perft roots, every 0x88 square. `ENGINE_DEEP`: the 301 of `G4`, count asserted 301. `ENGINE_DEEP` `moves` 40 / 40 | equal by construction (`generateMoves(p).filter(from)`) |
| SG2 (b), two walks | 0 mismatches, 0 mutations | `ABC-206`'s walk: 285 074 nodes, 11 137 359 twins and 12 500 288 stale bits (the parent's legal moves; none legal at the child, so every stale answer is null), 0 mismatches, 0 mutations. ADR-0003's walk: 518 474 nodes, 16 564 718 twins, 17 581 408 stale bits, 0 and 0. `ENGINE_DEEP` `legal` 91 / 91 | met |
| SG2 (c), 2 seeds × 4 searches | `main` reached at remaining 1 / 2 (S1 1, S2 2, S3 1, S4 1 and 2), seed made 0 times, legal move, root restored | 8 / 8 under QE-298-g's precondition (slot hit, no table cutoff at remaining 1 / 2) | equal |

**Gates:**
- `npm run typecheck` (`tsc --noEmit`): exit 0.
- `npm run lint` (`biome check .`): clean, 148 files.
- The default lane: as above, 3 red.
- The four pin lanes: as above.
- `npm run build` (`tsc -p tsconfig.build.json`, emitted to scratch and deleted): exit 0.

**Default lane wall (INFO only, not a timing read):** 25.97 s for the whole lane with one worker on one core, under the lock (`vitest` run 25.71 s). The 48 new default rows took 48.7 ms in-thread, by the run's own durations: SG2 (a) 12.9 ms (`src/legal.test.ts`), the per-square row 8.0 ms (`src/moves.test.ts`) and SG2 (c) 27.7 ms (`src/search.futility.test.ts`). `NFR-008` is QE's read.

Not checked: `G4` (SG1 (b)); the deep lanes outside the ADR's four pins and SG2's two (`ENGINE_DEEP` `legal`, `moves`); `NFR-008`'s paired read; SG3, which is QE's on a held host.
