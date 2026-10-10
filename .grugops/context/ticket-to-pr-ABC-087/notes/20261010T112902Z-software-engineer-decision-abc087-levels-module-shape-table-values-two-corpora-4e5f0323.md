---
id: 20261010T112902Z-software-engineer-decision-abc087-levels-module-shape-table-values-two-corpora-4e5f0323
kind: decision
by: software-engineer
at: 2026-10-10T11:29:02Z
verified_by:
confidence: high
refs:
  - ABC-087
  - ABC-085
  - ABC-101
  - EPIC-004
  - EPIC-006
  - ADR-0032
  - ADR-0027
  - ADR-0034
  - NFR-004
  - NFR-005
  - N8-LANE
  - src/levels.ts
  - src/levels.test.ts
  - .grugops/context/ruling-abc083-abc087/notes/20261010T084149Z-architect-design-decision-abc087-ruled-adr0032-children-scored-by-shipped-engine-strict-second-best-a6b28419.md
supersedes:
---

# `ABC-087` build decisions: one new module `src/levels.ts`; levels 1-5 = 100 ms/0.40, 500 ms/0.20, 3 s/0, 4 s/0, 4.5 s/0; mulberry32 per instance; default-lane criteria on a light endgame corpus

Hand-authored and unsealed (no `finding` is admissible on this install). The ticket page and
`ADR-0032` are the authority; this records only the choices they left to the Engineer.

## Shape (the Engineer's, per `ADR-0032` decision 3 and `ADR-0027` decision 2)

- **File name `src/levels.ts`.** It matches no trigger-list glob (`src/search*.ts`,
  `src/evaluate*.ts`, `src/quiescence.ts`, `src/transposition.ts`, `src/engine.ts`, move ordering), so
  option B does not fire and `A3` is the only puzzle reading (ticket § Dependencies, `ADR-0034`).
- **Exports:** `LEVELS` (frozen, keyed `1`-`5`), `EASIEST_LEVEL` / `DEFAULT_LEVEL` / `HARDEST_LEVEL`
  (`1` / `3` / `5`), `seededRandom(seed)`, `createLevel(level, { seed, now? })`, and the types
  `Level`, `LevelChoice`, `LevelOptions`, `ScoredMove`.
- **`createLevel` takes a SEED, not a generator.** The instance builds its own `seededRandom(seed)`,
  so two instances can never share draw state by accident (`A10`). `ABC-085`'s opening choice builds
  its own `seededRandom` from the same export. Alternative rejected: accepting a `() => number` —
  flexibility nobody asked for, and the one way to couple two instances.
- **`LevelChoice.kind` is `engine` | `blunder` | `no-candidate`;** `scored` is the list the blunder
  used, in `legalMoves` order, `null` on `engine` (`ADR-0032` decision 3: the test reads it, never
  re-derives it). `depth`/`nodes`/`elapsedMs` are carried (on a blunder: the deepest child, the summed
  nodes, `now()` at return minus `now()` at entry).
- **The non-blunder path reads the clock exactly as `chooseMove` does and nothing more,** so a rate-0
  level returns `chooseMove`'s move, depth, nodes and elapsed reading-for-reading (asserted, `A6`).
- **Generator: mulberry32**, 9 lines, no dependency (test note 6). A seed that is not an integer
  throws `RangeError` (a `NaN` would otherwise collapse silently onto seed 0 and pass `A7` while
  failing the intent of `A9`). The seed is taken modulo 2^32, documented.
- **A child with no legal move** is `chooseMove(...) === null`; it is then scored from `gameStatus`:
  `checkmate` → `MATE_SCORE − 1`, anything else 0 (decision 1, literal). The draw happens first, so
  a terminal position consumes one draw and returns `null`.

## The table (data; the ladder is `ABC-085`'s, not tuned to it — test note 4)

| level | budget | blunder rate | why |
|---|---:|---:|---|
| 1 (easiest) | 100 ms | 0.40 | shallow search and two in five moves the strict second-best |
| 2 | 500 ms | 0.20 | between |
| **3 (default)** | **3 000 ms** | **0** | `NFR-004`'s 3 s; rate 0 makes it the shipped engine, so `NFR-005`'s reading on `chooseMove` at 3 s IS this level's (`A6`, `ADR-0032` d5) and `npm run chess`'s play does not change when `EPIC-006` wires level 3 as the default |
| 4 | 4 000 ms | 0 | above default only budget can grow |
| 5 (hardest) | 4 500 ms | 0 | 500 ms under `HARD_CEILING_MS` for `A5`'s real-clock 30/30 |

- **Risk named for `ABC-085` `A2`, not mitigated here:** levels 3 → 4 → 5 differ only by budget
  (3 → 4 → 4.5 s), well under a ply. "Adjacent stronger scores > 50 % over ≥ 20 games" may not hold
  for 3/4 and 4/5. If it does not, that is `ABC-087`'s finding to route (re-cut the table or reopen
  `n` as a level datum, `ADR-0032` Alternatives), not a number to tune.
- **Two interpretations surfaced:** (i) default = club-strength shipped engine, weaker levels below
  it (the epic's "club level … with weaker difficulty levels selectable below it") — chosen; (ii)
  default with a small blunder rate so 4 and 5 have room above it — rejected because it silently
  weakens today's default play and makes the default level's move not `NFR-005`'s reading.

## Lanes (the measurement that forced a second corpus)

- **A depth-1 `chooseMove` costs ~3 ms on a middlegame position** (~600 nodes; the profile is
  `kingSquareOf` / `isSquareAttackedBy` legality work, not allocation). A blunder there scores 20-48
  children → 100-300 ms per blunder. `A4` over the 246 perft + puzzle positions at rate 0.40 is ~30 s
  of CPU — 50x `N8-LANE`'s 650 ms. The ticket's "A1, A4, A7, A8 are fast" was an assumption that the
  construction makes false on that corpus.
- **So the default lane walks `ENDGAMES`** (14 light endgame roots plus every child with a legal
  move, 204 positions, ~0.3-1 ms per blunder warm in plain node) with a COARSE virtual step (one
  reading per level budget, so every search is depth 1). `A6`/`A7`/`A9`/`A10` walk `THIRTY`, the first
  30 of those with ≤ 8 legal moves. The criteria fix counts (≥ 200 moves, ≥ 30 positions, ≥ 5 seeds,
  ≥ 10 positions), not position types.
- **Roots were chosen with no-candidate rate q ≈ 0** (measured per root, `probe/prof5.ts`): two
  first-draft roots (blocked pawns, a lone knight) had q = 1.00 on every child and biased `A4`'s
  frequency low (36.2 %); swapped, it reads 39.4 % with 1 no-candidate move. See the observation note
  on the bias itself — it is a property of the folded criterion, not of this corpus.
- **`ENGINE_DEEP=1` re-runs `A4` on the perft + puzzle corpus** (the reading on positions a game
  reaches) and holds `A2` (fine virtual step, budget/500 — test note 3), `A5` (real clock) and `A3`.
  `ENGINE_DEEP` is the existing lane name for wall-clock engine cases (`src/engine.test.ts`,
  `src/transposition.test.ts`); no new variable.
- **`A3` runs `ABC-084`'s runner RULE in `src/levels.test.ts`, not its file.** Adding a row to
  `src/puzzle-suite.test.ts` would share a file with `ABC-131` (ticket § Dependencies: "shares no
  file"). Same rule (fresh `virtualClock` per move; accepted move / not the losing one), ONE step for
  both levels so they differ by budget and rate only: **120 virtual ms**, which puts the default level
  on 25 readings — `ABC-084`'s own gating configuration (budget 25, step 1) — so its count is
  cross-checkable against the baseline. Step 10 was tried first: 35/62 vs 61/62, but 321.7 s, over the
  300 s guard (recorded as a failed attempt in the observation note). The baseline JSON is not read or
  touched.
- **The perft and puzzle corpora are imported only under `ENGINE_DEEP=1`** (top-level `await
  import`), so the default lane does not pay for them. Measured saving: none resolvable (within R).
