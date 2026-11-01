---
id: 20261101T075832Z-software-engineer-observation-b9dc61b6
kind: observation
by: software-engineer
at: 2026-11-01T07:58:32Z
verified_by: 
confidence: high: reads per search are arithmetic from the code; nodes are scratch probe reads on base production; census exclusions are read from the rows
refs:
  - se-ABC-248
  - ABC-248
  - ADR-0046
  - ADR-0050
  - NFR-008
  - EPIC-010
  - ABC-244
  - ABC-177
  - ABC-167
  - ABC-208
  - QE-208-a
  - QE-208-b
  - QE-244-a
  - QE-245-b
  - WRONGSIDE
  - SE-248-a
  - SE-248-b
  - SE-248-c
  - SE-248-d
  - grugops/ABC-248
  - 7e9ab524
  - 71700836
  - 46365ed0
  - src/search.null-move.test.ts
  - src/uci-session.test.ts
supersedes: 
seal: sha256:c0c82372853656c0ed7e80e86d6b81074ae0bc1a67c777691008c46069fad505
---

# `ABC-248` A1, the R1 census: one line per § Scope row and per census candidate, at base `46365ed0` and the tip

Reads per search are ⌈budget ÷ step⌉, as the ticket defines them. `QE-208-a` is graded on Σ S (its cost is Σ readings ×
1 024 nodes). `DEFAULT_LEVEL` is 5 and `LEVELS[5].budgetMs` is 4 000, so a bare UCI `go` is 4 000 ms. Line numbers are
base lines at `46365ed0`. The page read them at `209f4c5f`; between the two only `ABC-246`'s 18 lines landed, at
`:2513`, so `:477`, `:507`, `:514`, A4-a2 `:194`, A5 `:215` and `RUN_ENGINE_DEEP` `:2169` are unchanged.
Nodes are the info-line or `SearchResult` count on base production (scratch probes, not committed into `src/`).

## § Scope rows
| lever | row (file > title at base) | base | tip | reads / Σ S base → tip | nodes base → tip | class |
|---|---|---|---|---|---|---|
| T2c-a | `null-move` > QE-208-a > "position-6, readings 3 to 25: …" → "position-6, the even readings 4 to 24: …" | readings 3..25 (23), `chooseMove` budget 1 000 on the turning clock | readings 4, 6, …, 24 (11) | Σ S 322 → **154** | 265 237 → 126 881 (Σ over S) | time-blind (mutated roots, `insideNull`) |
| T2c-b | `null-move` > QE-208-b > "search() on position-6 at depth 6" → "search() on startpos at depth 6" | position-6, depth 6, no clock | startpos, depth 6 | — (depth-bound) | 154 466 → 26 703 | time-blind (`stale`, `underNull`) |
| T2c-b | `null-move` > QE-208-b > "chooseMove on position-6 deepened to 6" → "chooseMove on startpos deepened to 6" | position-6, `maxDepth` 6, frozen clock `() => 0` | startpos, same | — (depth-bound) | 73 867 → 23 798 | time-blind |
| T2a | `uci` > A5 > "movetime 100: …" | 100 ms / step 10 | same, **moved** to ENGINE_DEEP | 10 → 10 (leaves the default lane) | 5 140 leave | reads time (`G ≤ time ≤ G + 2s`) |
| T2a | `uci` > A5 > "white reads wtime: …" | 50 / 1 | same, **stays** | 50 → 50 | 45 076 stay | reads time |
| T2a | `uci` > A5 > "black reads btime: …" | 450 / 10 | same, **stays** | 45 → 45 | 39 966 stay | reads time |
| T2a | `uci` > A5 > "G = 3 500, under the default level 5's 4 000: …" | 3 500 / 100 | same, **moved** | 35 → 35 (leaves) | 29 716 leave | reads time |
| T2a | `uci` > A5 > "a bare go: …" | 4 000 / 100 | same, **moved** | 40 → 40 (leaves) | 34 836 leave | reads time |
| T2a | `uci` > A5 > "A5-b3: …" | 200 / 10 | same, **moved** | 20 → 20 (leaves) | 15 380 leave | reads time |
| T2d | `uci` > A4 > "A4-a2: an echoed control character in a go value is dropped from the info string" | bare go (the token is dropped), 4 000 / 100 | 4 000 / **1 000** | **40 → 4** | 34 836 (depth 6) → 1 044 (depth 3) | time-blind (3 lines, printable info string with `[31m`, bestmove = the info move, legal) |

Default-lane node delta of the changed rows (base production): T2c-a −138 356, T2c-b −127 763 and −50 069, T2d −33 792,
T2a −85 072 (four rows leave). Sum **−435 052 nodes**. These are SE reads; A7's table is QE's.

## T2d census (ruling 2: at most two more rows; none joins if more qualify)
A row joins only if it searches on a stepped virtual clock, is time-blind, has a single step literal at one call site
(no shared-helper default moves), is finer than 1 000, keeps ≥ 2 clock-check intervals at the coarser step, and reads
strictly fewer nodes there. Rows `ABC-177` changed and rows `ABC-244`'s census listed are not re-listed.
| row (file > block > title, base line) | step, budget | why it does not join |
|---|---|---|
| `uci` A3 "writes one info line then one bestmove…" (`:147`), A3-h1 (`:156`) | 10, 100 ms (10 reads) | step 100 gives 1 interval (condition 2); A3-h1 also reads `time` through `nps` |
| `uci` A4 refused-position rows ×2 (`:166`), "a control character in a refused FEN" (`:179`), A4-a1 (`:185`), "a held stalemate" (`:206`) | 10 | no search (`bestmove 0000`) |
| `uci` A7 "go nodes 20000 …" (`:401`) | 10, the node limit binds (~20 reads) | no node saving at base; at 1 000 the ceiling ends a no-limit build after ~4 reads, so 167-M21 would survive |
| `uci` A7 "go nodes 1", "go mate 2", "go depth 3 mate 5", the `go depth 1` reads | 10 | node- or depth-bound; no saving |
| `uci` A7-i1 "go movetime depth 3" (`:510`), A7-i4 (`:536`) | 100, 4 000 | depth 3 ends inside the first interval: no saving; reads depth |
| `uci` A8 "being mated next move reports score mate -1" (`:562`) | 100, 500 ms (5 reads) | step 1 000 gives 1 interval |
| `uci` A9 "ucinewgame sets the position back to the start" (`:581`), A9-h1 (`:588`) | 10, 100 ms | step 100 gives 1 interval |
| `uci` ABC-171 A7 "go depth 3 at level 1" (`:916`) | 10, level 1 100 ms | step 100 gives 1 interval |
| `uci` ABC-171 A7 "go depth 3 at level 5" (`:928`) | 50, depth 3 | depth-bound; reads depth |
| `uci` ABC-171 A8 two rows (`:944`, `:961`) | `rig` default 100, levels 1–4 (100–1 000 ms) | the step is `rig`'s shared default (fenced); and level 4's 10 reads would become 1 at 1 000 |
| `uci` ABC-171 A13a oracle `levelOneOracle` (`:1183`) | 100, 100 ms | already 1 interval |
| `uci` ABC-242 A4 (`STEP_MS` 10, `:1554`) | 10, level 1 100 ms | step 100 gives 1 interval; one constant read by three calls |
| `uci` ABC-221 A5 real engine (`:2357`) | 10, 1 ms | reads time (`time` = 20) |
| `uci` ABC-220/221/246 stubbed rows (`session220()`) | 1 000 default | no search |
| `null-move` file | — | no stepped virtual clock: QE-208-a's turning clock is T2c-a's; every other row uses `now: () => 0` |

**Census rows joined: 0.** Only A4-a2 changes step.
