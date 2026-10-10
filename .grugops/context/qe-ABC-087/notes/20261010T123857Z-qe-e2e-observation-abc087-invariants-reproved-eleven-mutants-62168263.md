---
id: 20261010T123857Z-qe-e2e-observation-abc087-invariants-reproved-eleven-mutants-62168263
kind: observation
by: qe-e2e
at: 2026-10-10T12:38:57Z
verified_by:
confidence: high
refs:
  - ABC-087
  - ADR-0032
  - ADR-0027
  - NFR-004
  - src/levels.ts
  - src/levels.test.ts
  - .grugops/context/qe-ABC-087/probe/levels.qe.test.ts.txt
  - .grugops/context/qe-ABC-087/probe/mutate.cjs
  - .grugops/context/qe-ABC-087/probe/mutants.sh
  - .grugops/context/qe-ABC-087/probe/out-harness-head.txt
  - .grugops/context/qe-ABC-087/probe/out-harness-head-rerun.txt
  - .grugops/context/qe-ABC-087/probe/mutants/
supersedes:
---

# `ABC-087` at `b2fe6f21`: QE's own harness re-proves the six `ADR-0032`/`ADR-0027` invariants. 11 mutants: 6 red in the default lane, 1 more only in deep, 1 only at typecheck, and 4 survive every shipped lane (QE's harness kills all 11)

Hand-authored, unsealed. No `finding` is admissible on this install.
- Everything ran in `git archive` copies of `b2fe6f21`, in QE's scratchpad. No worktree byte was planted.
- Machine: Apple M3, Node v26.11.0, vitest 3.2.7. Security/NFR hops ran in parallel, so load1 is
  logged beside every timing in the probe outputs.

## The harness (`probe/levels.qe.test.ts.txt`, copied in as `src/levels.qe.test.ts`)

It `vi.mock`s `./engine.ts`, wrapping the REAL `chooseMove`. It records every call the level module
makes: the child FEN at call time, the options object, the clock reading just before the call, and
the result. **So it checks the returned list against the engine. It does not trust the list.**

| | invariant | how | head |
|---|---|---|---|
| `I1` | The seed never reaches `chooseMove` (`ADR-0027` d1) | Every call's options are exactly `{ budgetMs, now }`, and `now` is the caller's clock. Engine path: 1 call, `budgetMs` = the level's, and the result plus clock-read count are identical over 20 seeds. Blunder path: each child budget = `start + B·(i+1)/N − reading` (to 1e-9), and the list is identical over 10 seeds | **holds** |
| `I2` | One draw per move (`ADR-0032` d1–2) | Move k is non-engine **iff** the k-th `seededRandom(seed)` value < rate. 82 positions with a mated and a stalemated position inside (each `null` consumes its one draw); 5 seeds, including 4 000 000 000 | **holds** |
| `I3` | Strict second-best of an HONEST list | One child per legal move, in `legalMoves` order, each searched on the right child FEN. Score = −(the recorded child score), or `MATE_SCORE − 1` / 0 for a mated / stalemated child. The pick is re-derived (highest strictly inside (min, max), first on ties). No-candidate ⇔ < 3 distinct scores, first best played. Coarse clock: **115 positions** (112 blunder, 3 no-candidate, **29 with a tied best**). Fine clock (1 000 ms / 300): 12 positions, deepest child per move 2–8 | **holds** |
| `I4` | Never a worst-class move | Over the same lists: when min < max, played > min | **holds** |
| `I5` | The level total clamps to `HARD_CEILING_MS` | Synthetic levels at 20 000 ms and `Infinity`, rate ≈ 1, step 50: the last child's deadline = start + 5 000 exactly, and elapsed 5 150 (3 readings past, `AR-NFR004-A`'s shape). **Real clock (`QE_REAL=1`), 20 000 ms level: 5 015 ms and 5 005 ms wall**, inside `AR-NFR004-A`'s ≤ 31 ms (Security/NFR note `…df34cf5a`) | **holds** |
| `I6` | Level 3 ≡ shipped `chooseMove` at 3 s | 17 positions (perft/puzzles) × 3 seeds, step 120: one call, `budgetMs` 3 000, the same move, depth, nodes, `elapsedMs` **and number of clock readings** as `chooseMove({ budgetMs: DEFAULT_BUDGET_MS })` | **holds** |

Head: 8/8 green, 82.3 s (`out-harness-head-rerun.txt`, load1 2.78 → 3.33). The first run's one red
was QE's harness itself: `I1`'s engine-path row had no timeout (5 s default) and took 6.3 s. It was
fixed and re-run green. The same file carries `I5`-real and the frequency reading (`out-harness-head.txt`).

## Mutants (`probe/mutate.cjs`: exact single-anchor edits to `src/levels.ts`; `probe/mutants/*.out`)

"deep" = `ENGINE_DEEP=1` with `-t "A4|A2|A3"` (A5 is rate 0 on the real clock; `M3a` ran the full 25).

| mutant | default lane (19) | deep | QE harness | page placement → met? |
|---|---|---|---|---|
| `M1` non-strict second-best (rank 2, ties with best count) | **RED** — `A9` (test note 7 guard) | RED `A4` ×2 | RED `I3` ×2, `I5` ×2 | default ✔ |
| `M2` uniform over non-worst (seeded) | **RED** — `A9` guard | RED `A4` ×2 | RED 6 | default ✔ |
| `M3a` seed into `chooseMove` (engine budget × (0.9 + 0.2·draw)) | **green 19/19** | **green 25/25** | RED `I1`, `I2`, `I6` | A6's identity row is the page's instrument → **✘ gap `QE-087-a`** |
| `M3b` seed passed as a `chooseMove` option | green | green | RED `I1`, `I6` | **`npm run typecheck` RED, TS2353, exit 2** (`out-m3b-typecheck.txt`) ✔ by gate |
| `M4` clamp removed (`B = level budget`) | green | green | RED `I5` ×2 | no page instrument; equivalent on today's table (max budget 4 500) → **gap `QE-087-c`** |
| `M5a` decision drawn per ROOT move (`every(draw ≥ rate)`) | **RED** — `A10` (A ≠ B: both blunder nearly always) | RED `A2`, `A4` ×2 | RED `I1`, `I2` | default ✔ |
| `M5b` an extra draw per root move, decision intact | green | green | RED `I2` | no instrument → **gap `QE-087-d`** |
| `M6` worst not excluded (QE's) | **RED** — `A9` guard | RED `A4` ENDGAMES | RED `I3` | default ✔ |
| `M7` ties go to the LAST (QE's) | **RED** — `A9` guard | RED `A4` ×2 | RED 4 | default ✔ |
| `M8` child score sign flipped: plays the second-WORST (QE's) | **green** | **green** (A3 and both `A4` too) | RED `I1`, `I3` ×2, `I5` ×2 | **✘ gap `QE-087-b`** |
| `M9` deadline not shared, each child gets B (QE's) | green | RED `A2` blunder path | RED 5 | deep, where the page puts `A2` ✔ |

- **Why `M3a` survives A6.** A6's identity row runs one seed (7) at step = budget/3 = 1 000 virtual ms.
  Seed 7's second draw makes the budget 3 000 × 0.912 = 2 737 ms. At a 1 000 ms step, 2 700 and 3 000
  read identically (depth 3, the same nodes, elapsed 4 000), and only a budget above 3 000 differs. At a
  120 ms step, every ±10 % reads differently (`out-m3a-why.txt`).
- **Why `M8` survives everything.** `A4`'s clauses (deep) and the note-7 guard (default) read the
  module's OWN returned list, as `ADR-0032` decision 3 rules: *"the test reads the construction's scores
  and does not re-derive them"*. A list with every child score sign-flipped is internally consistent.
  So "strict second-best" and "never the worst" hold on it, while the move played is the
  second-worst by the engine's real scores. The mate / stalemate rows pin only the `null`-child branch.
- **Runner bug, recorded:** `M3b.out`'s `typecheck … exit 0` line read `PIPESTATUS` outside its subshell.
  The direct run (`out-m3b-typecheck.txt`) is the reading: exit 2.
