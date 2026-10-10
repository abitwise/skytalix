---
id: 20261010T125954Z-security-nfr-observation-abc087-nfr004-level3-12ms-ceiling-5006ms-floor-589ms-clamp-pin-10ms-231d41c8
kind: observation
by: security-nfr
at: 2026-10-10T12:59:54Z
verified_by:
confidence: high
refs:
  - ABC-087
  - NFR-004
  - AR-NFR004-A
  - QE-087-a
  - QE-087-b
  - QE-087-c
  - N8-LANE
  - ADR-0027
  - ADR-0032
  - ADR-0035
  - src/levels.ts
  - src/levels.test.ts
  - .grugops/context/qe-ABC-087/notes/20261010T123857Z-qe-e2e-observation-abc087-nfr004-clamp-bounds-deadline-not-return-df34cf5a.md
  - .grugops/context/qe-ABC-087/notes/20261010T123857Z-qe-e2e-observation-abc087-gap-register-62d79e31.md
  - .grugops/context/ticket-to-pr-ABC-087/notes/20261010T124744Z-software-engineer-observation-abc087-qe-fix-forward-a-b-e-closed-26fd4d9d.md
  - .grugops/context/secnfr-ABC-087/probe/
supersedes:
---

# `ABC-087` Security/NFR readings: level 3 reads **+12 ms max (0.40 %) on the real clock**, inside `AR-NFR004-A`. The level layer at a 20 s budget returns at **5 000–5 006 ms**. The blunder path's unabortable floor is **≤ 589 ms**, so it cannot carry a move past the ceiling. A **~10 ms** clamp pin exists

Hand-authored and unsealed. This is an `observation`, not a stamp. The ruling is in the decision note
`…3f1974f5`.

- **Reviewed:** `94cf5e6b..42ab1b35` on `grugops/ABC-087-difficulty-levels`. `src/` is byte-identical
  between `026a7373` and `42ab1b35`.
- **Instrument:** every probe ran on a `git archive 42ab1b35` copy in this gate's scratch directory.
  The worktree was not written by any probe.
- **Stack:** Apple M3, Node v26.11.0, vitest 3.2.7. QE (`ABC-054`) and a catalog Security/NFR hop
  were running at the same time. load1 is logged beside every timing and is not gated.
- Scripts and raw outputs are in `../probe/`. Scratch paths are replaced by `<sec-scratch>`.

## 1. `AR-NFR004-A`, clause A: level 3 on the REAL clock (`p2-real-clock.ts a`, `out-p2-a.txt`)

`createLevel(LEVELS[3], { seed })` was run on the six standing benchmark positions, 5 rounds each, for
30 calls. That is the same denominator as `ABC-078`'s 30 calls.

| reading | value |
|---|---|
| calls over 3 000 ms | **24 / 30** |
| max | **3 012 ms** (+12 ms, **0.40 %**) |
| median | 3 002 ms |
| `kind` | `engine` on 30/30 (the rate is 0) |
| depth | `kiwipete` 7 (5/5), `position-6` 7 (5/5), `startpos` 8, `position-3` 11, `position-4` 9, `position-5` 7–8 |
| load1 | 3.99–5.40 |

- **That is inside `AR-NFR004-A`'s recorded bound** (≤ 31 ms, ≤ 1.03 %, 27–29 of 30 over).
- The depths agree with the catalog's post-`ABC-121` `NFR-005` status (depth 7 reached on both
  standing positions). This is a reading, not a re-ruling of `NFR-005`.
- **Other readings of the same mechanism on this branch** (the `A5` rows, hardest level, 4 500 ms, real
  clock): six runs of 30, max **4 526 / 4 527 / 4 531 / 4 536 / 4 536 / 4 590 ms**.
  - **179 of 180 are ≤ +36 ms.**
  - **One is +90 ms:** the first call of the Engineer's re-hop run (`raw-deep-rehop-f61ad6b1.log`,
    load1 6.9 → 3.7).
  - It does not miss a clause (4 590 < 5 000). If the same tail fell on a level-3 move, it would be a
    ~3 % miss of clause A. That is outside `AR-NFR004-A`'s scope by its own text ("a later reading
    materially worse … is a NEW question"). **It has not been observed at level 3: 0 of 30 here.**

## 2. `NFR-004` ceiling through the level layer (`p2-real-clock.ts b`, `out-p2-bc.txt`)

A synthetic `{ budgetMs: 20 000, blunderRate: 0.999999 }` level was run on the real clock, two seeds
per position:

| position | children | return (ms) | load1 |
|---|---:|---|---|
| `kiwipete` | 48 | 5 001, 5 001 | 3.85–3.94 |
| a `kiwipete` child (Black to move) | 43 | 5 006, 5 000 | 5.79–6.13 |
| `position-4` | 6 | 5 002, 5 003 | 5.71–6.04 |

QE's two readings were 5 015 and 5 005 (`…df34cf5a`). **8 of 8 are within ≤ 15 ms of 5 000.** The clamp
bounds the deadline. The return carries the engine's own abort residual, which is `AR-NFR004-A`'s
class.

## 3. Why the shared deadline cannot cascade past the ceiling (`p1-static-floor.ts`, `out-p1-static-floor.txt`)

- **A non-positive child budget still runs the engine's unabortable depth 1** (`ADR-0032` d1;
  `src/engine.ts` disarms the clock check for iteration 1). So the blunder path has a floor: the sum
  of its children's depth-1 searches.
- **That floor was measured on the real clock over the deep corpus** (perft 184 + puzzles 62 = 246
  positions):

  | reading | value |
  |---|---|
  | median sum | 16 ms |
  | max sum | **535 ms**, over 43 children, on `r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N1BQ1p/PPP1BPPP/R3K2R b KQkq - 1 1` |
  | max single child | 47.8 ms |
  | the same through the module (an always-blunder level at 1 ms) | max `elapsedMs` **589** |
  | load1 | 3.30 → 3.49 |

- **The floor is ≤ 589 ms against a 5 000 ms clamp.** On this corpus (at most 48 legal moves), no
  child starts with its slot already spent: 5 000 / 48 ≈ 104 ms per slot, against a ≤ 48 ms depth 1
  plus a ≤ 31 ms abort residual. So the last child aborts at its deadline, and the over-ceiling
  residual is one abort granularity. Section 2's readings agree.
- **Unmeasured:** a position with far more legal moves and costly depth-1 children (slot < depth 1).
  That is `UNKNOWN - verify`. Even then, the bound is the floor sum, and the largest measured floor
  sum is 589 ms.

## 4. Level 1's budget on the REAL clock (`p3-level1-real.ts`, `p2-real-clock.ts c`)

This is the same floor seen from below. With level 1's 100 ms budget and the draw forced to fire, on
the 246-position deep corpus:

| reading | value |
|---|---|
| median | 101 ms |
| p90 | 164 ms |
| max | 498 ms |
| over 120 ms (`A2`'s +20 %) | **44 / 246 = 17.9 %** of blunder moves |
| load1 | 3.02 → 3.68 |

- With the table's own rate (0.40) and seeds 7/8/9 on the `kiwipete` child above, it reads 502–503 ms,
  which is **5.0x** the level's budget. On `kiwipete` itself, `position-4`, `position-6` and
  `startpos` it reads 100–105 ms.
- **`A2` is MET as its test note 3 defines it.** The ±20 % is read on the injected clock, and there it
  holds: 101.3 / 100.
- **The virtual clock does not charge depth 1.** The engine reads no clock inside iteration 1, so a
  virtual reading sees no cost there. A real-clock reading is what shows the floor.
- **No `NFR-004` clause is touched:** 589 ms is ≪ 3 s.

## 5. QE-087-c: a candidate clamp pin, out of tree (`clamp-pin*.test.ts.txt`, `out-clamp-pin.txt`)

The candidate row: a `{ budgetMs: 20 000, blunderRate: 1 }` level on `6k1/8/8/8/8/8/1R6/6K1 b` (5
legal moves), on `virtualClock(step)`, asserting `elapsedMs ≤ HARD_CEILING_MS + 4·step`:

| step | pristine `elapsedMs` | pristine cost | `M4` (clamp removed) | `M4` cost |
|---:|---:|---:|---:|---:|
| 500 | 10 500 (fails: about 4 fixed readings per child exceed the 1 000 ms slot) | 3 ms | 21 500 | 106 ms |
| **250** | **5 750 → passes** | **~10 ms** | **20 750 → RED** | 446 ms |
| 100 | 5 300 → passes | 177 ms | 20 300 → RED | 1 447 ms |

- **At step 250 the pin costs ~10 ms in the default lane and turns `M4` red.** `N8-LANE`'s remaining
  headroom is ~95 ms (650 − 555).
- The shape is the Engineer's. This row shows only that a cheap pin exists.

## 6. The seed seam and the scored list, with QE's mutants re-planted (`out-mutants-default.txt`)

QE's own `mutate.cjs` was used on fresh copies of `42ab1b35`, with `npx vitest run src/levels.test.ts`
(default lane, load1 2.94–3.02):

| tree | result | red rows |
|---|---|---|
| pristine | 21 / 21 passed | — |
| `M3a` (the seed scales the engine budget) | **1 failed** | `QE-087-a` only |
| `M8` (child score sign flipped) | **1 failed** | `QE-087-b` only |
| `M4` (clamp removed) | 21 / 21 passed | — (QE-087-c open) |
| `M5b` (an extra draw per root move) | 21 / 21 passed | — (QE-087-d open) |

This agrees with the Engineer's `…26fd4d9d`.

## 7. `N8-LANE`, re-scored, not re-run (`rescore-own.mjs`, `out-rescore-qefix1.txt`)

My own scorer was run on the Engineer's `runs-qefix1.tsv` (n = 8, k = 2, round 0 discarded):
- treatment median **+0.555 s**, interval [0.52, 0.57], sign 8/8;
- twin **−0.66 %** of head (1.52 s), sign 3/8, **R 0.030 s**;
- passed counts head 21, twin 21, base 1; load1 8.96 / 13.9 / 14.97.

**That is identical to the Engineer's figures.** It was not re-run, because two other hops were
loading the machine and `ADR-0035` d2's harness takes ~27 runs.

## 8. The table, looked up by keys a caller should not use (`out-p1-static-floor.txt`)

| lookup | result | own property |
|---|---|---|
| `LEVELS["0"]`, `LEVELS["6"]` | `undefined` | no |
| `LEVELS["constructor"]`, `["toString"]`, `["hasOwnProperty"]` | functions | no |
| `LEVELS["__proto__"]` | `{}` | no |

What `createLevel` does with a degenerate level:

| level | result | wall |
|---|---|---|
| the `constructor` object | `blunder`, depth 1 | 12.6 ms |
| `{}` | `blunder`, depth 1 | 2.3 ms |
| rate `NaN` | `blunder` on every move (`random() >= NaN` is false) | 100 ms |
| rate 1 | `blunder` on every move | 100 ms |
| rate −1 | `engine` on every move | 101 ms |

None of these throws. Nothing in this ticket reaches them: there is no input surface, and `A8`
asserts that.
