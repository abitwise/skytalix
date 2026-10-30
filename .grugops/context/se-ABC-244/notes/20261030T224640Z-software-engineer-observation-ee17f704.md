---
id: 20261030T224640Z-software-engineer-observation-ee17f704
kind: observation
by: software-engineer
at: 2026-10-30T22:46:40Z
verified_by: 
confidence: high: reads per search are arithmetic from the code; node equality for :1804/:1910 is a plain-node probe on base src
refs:
  - se-ABC-244
  - ABC-244
  - ADR-0046
  - NFR-008
  - EPIC-010
  - ABC-230
  - ABC-241
  - ABC-177
  - R1
  - R2
  - R3
  - QE-229-a
  - arch-g8-headroom/20261030T223415Z-architect-design-decision-e15a97a2
  - arch-g8-headroom/20261030T223415Z-architect-design-observation-77b392a3
  - grugops/ABC-244
  - 25282ad4
  - d59e3194
  - src/cli.test.ts
  - src/uci-session.test.ts
supersedes: 
seal: sha256:2847123b75db42d277f4a3c0c0aa9332b1642e1093ccb17ef1e2d1150cca8fc6
---

# `ABC-244` A1, the R1 census: one line per U1/U2 row and per census candidate, at base `d59e3194` and tip `25282ad4`

Reads per search are arithmetic, ⌈budget ÷ step⌉, as the ticket defines them (the engine also reads once per iteration
and once at return). `DEFAULT_LEVEL` is 5, and `LEVELS[5].budgetMs` is 4 000. A bare UCI `go` at the default level is
`HARD_CEILING_MS` capped to the level's 4 000. Line numbers are base lines, and they equal `161e940d`'s.

## U1 (step 100 → 1 000; reads 40 → 4)
| row (file > block > title) | searches in the row | budget | step base / tip | reads base / tip | class |
|---|---|---|---|---|---|
| `cli` > ABC-230 A1, A3 > A1: with keyHistory injected the default level plays the third occurrence, at 0 | ×4 fixtures: seam with keys, `chooseMove` direct, `chooseMove` base, seam bare | 4 000 each | 100 / 1 000 | 40 / 4 | time-blind (move, score 0 / not 0, FEN unchanged) |
| `cli` > ABC-230 A1, A3 > the injected keyHistory is read once per engine move, on the game the loop hands in | 1 seam | 4 000 | 100 / 1 000 | 40 / 4 | time-blind (call count, argument identity) |
| `cli` > ABC-230 A1, A3 > A3: a game started from a FEN has no earlier positions: the move is base's | 2 seam | 4 000 | 100 / 1 000 | 40 / 4 | time-blind (empty list, move equality, move ≠ repeat) |
| `uci` > ABC-230 A2, A3, A5 > A2: bestmove is byte-equal to the CLI level seam's move on the same game and clock | ×4 fixtures: seam + UCI bare `go` | 4 000 each | 100 / 1 000 | 40 / 4 | time-blind (bestmove text, `cp 0`; `parseInfo` read for score only) |

## U2 (step 100, kept; reads 40 / 40; tried at 1 000 = 4 reads, failed parity)
| row | searches | budget | step base / tip | reads base / tip | class |
|---|---|---|---|---|---|
| `cli` > ABC-241 A4, A7 > A4: with repetitionKeyHistory injected the default level plays d8e8 at exactly 0; base does not | seam + 2 `scoreWith` | 4 000 each | 100 / 100 | 40 / 40 | time-blind (move, score 0 / not 0) |
| `cli` > ABC-241 A4, A7 > A4: with a legal ep capture available the same line is not a draw | 1 `scoreWith` | 4 000 | 100 / 100 | 40 / 40 | time-blind (key list equality, score not 0) |
| `cli` > ABC-241 A4, A7 > A7: the move the search scores 0 is the move after which gameStatusOf reports the claim | 1 seam | 4 000 | 100 / 100 | 40 / 40 | time-blind (`gameStatusOf`, key counts) |
| `uci` > ABC-241 A4, A5 > A5: the CLI level seam's injected list equals UCI's, key for key, and both play d8e8 | seam + UCI bare `go` | 4 000 each | 100 / 100 | 40 / 40 | time-blind (keys handed, move, `cp 0`) |

The other ten rows of the four blocks search at fixed depth (`go depth 1`/`4` on `dialogue`'s default step 10, or
`budgetMs: 1e9, maxDepth: 4`), or do not search (the `cli.ts` import pin). They are byte-identical.

## Census candidates (`src/uci-session.test.ts`, rows added after `4debc07d`)
| line | row | budget | step base / tip | reads base / tip | class | joins? |
|---|---|---|---|---|---|---|
| `:298` | ABC-178 R1: a hold left in one session is not released by a fresh session (`go infinite`) | 4 000 (capped ceiling) | 1 000 / 1 000 | 4 / 4 | time-blind | no: not finer than 1 000 |
| `:392` | ABC-167 A7: go depth 3 reports depth 3 on a clock where an unlimited go reaches depth >= 5 | 4 000 (`go`); 4 000 with depth 3 (`go depth 3`) | 100 and 50 / same | 40 and 80 (cap; depth 3 ends it) / same | **reads depth** (`free.depth ≥ 5`, `depth 3`): class C | no |
| `:452` | ABC-197 R2: go depth 0 on step 100 searches G = 4 000, time in [4 000, 4 200] | 4 000 | 100 / 100 | 40 / 40 | **reads time** (`time ≤ 4 200`): class P | no |
| `:1033` | ABC-212 A9 `searchAt` (rows at `:1083` bare `go` at 7, and `:1112` `go depth 3` at 7) | 30 000 | ⌊G ÷ 30⌋ = 1 000 / same | 30 / 30 | `:1083` **reads time** (A5 bound) | no: computed in a shared helper, not one literal; not finer than 1 000 |
| `:1051` | ABC-212 A9 `budgetAt` (budget-read arm, `chooseMove` stubbed) | — | 1 000 / 1 000 | 0 (no search) | no search | no |
| `:1543` | `session220`'s default `stepMs = 1_000` | — | 1 000 / 1 000 | the stubbed rows do not search | helper default | no: out of scope (§ Out of scope) |
| `:1748` | ABC-220 A6: the real engine on a step-1 000 clock: a bare go reports time in [22 000, 22 000 + 2 x 1 000] | 22 000 (T) | 1 000 / 1 000 | 22 / 22 | **reads time** (`expectWithin`): class P | no |
| `:1804` | ABC-220 A7: go wtime 800 btime 800 on the real engine still returns a legal move (its unabortable depth 1) | 1 | 10 / 10 | 1 / 1 | **reads depth** (`depth ≥ 1`); probe: 30 nodes at step 10 and at 1 000 | no: no node saving (A7 would fail), and it reads depth |
| `:1910` | ABC-220 A9: Skill Level 1, go depth 3 on the real engine: the rate-0 line (a score), depth <= 3, … | 22 000 (T), max depth 3 | 100 / 100 | 220 / 220 (cap; depth 3 ends it after about 1) | time-blind (`depth ≤ 3` is the limit, not a depth reached on a budget) | no: probe 370 nodes at 100 and at 1 000, so no saving and A7 would fail |
| `:1989` | ABC-220 A13: isready that arrives mid-search is answered once, after the bestmove, in order | 22 000 (T) | 500 / 500 | 44 / 44 | **reads time** (`expectWithin(info.time, T_MS, 500)`), and the 3rd clock reading is a precondition: class P/C | no |

- `src/cli.test.ts` has one more virtual-clock site, `:4485` (A8′, `virtualClock(level budget)`, so 1 read per
  search). It dates from `4debc07d` itself, not after it. Its step equals each level's budget (100–30 000 ms), so it is
  already at 1 read per search, and there is nothing to save.
- **Census units joined: 0** (the cap is 4).
- The probe was `probe/cand.ts` (plain node, base `src/` only), and its output is `probe/cand.out`.
