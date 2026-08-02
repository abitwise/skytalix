---
id: 20260803T001000Z-software-engineer-observation-4842932e
kind: observation
by: software-engineer
at: 2026-08-03T00:10:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-009
  - NFR-005
  - EPIC-004
  - ADR-0002
  - src/legal.ts
  - src/zobrist.ts
  - src/perft.test.ts
  - plans/nfr-catalog.md
supersedes: 
---

# What was measured at the dev hop, against the shipped code, and how

Neutral record so the acceptance verdict beside it can be checked rather than believed.
Everything below was run against the **shipped** `src/` on branch `grugops/ticket-to-pr-ABC-011`
— not against a prototype — with the pre-change tree kept as a copy **outside** the repository
so both variants could be timed in one process. Machine: **Apple M3, Node v24.12.0,
darwin/arm64**; `UNKNOWN - verify` on any other hardware. The machine-independent quantity is the
ratio to the merged tree measured in the same process, not the absolute nanoseconds.

The design hop published a cost table and a divergence table. **Both were re-derived here rather
than quoted**, on an independent run with independently written scripts.

## 1. Gates

```
npm test         184 passed / 8 files / 0 failed      (baseline on this branch: 174)
skip count       0            npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'
npm run lint     exit 0       (2 pre-existing biome config-schema infos, present before this ticket)
npm run typecheck exit 0
npm run build    exit 0
coverage         src/legal.ts and src/zobrist.ts both 100% stmt/branch/func/line
```

TDD was red first and it was measured: run against the unmodified tree, the two touched test
files gave **9 failed / 19 passed**. The four assertions that had to move did; the two
regression guards were green before and after.

## 2. NFR-005 — the bar, and where each figure lands

Bar (from the ticket): `zobristKey` stays within **1.5x** of the audit's **288–306 ns** at
kiwipete / **~300 ns** at startpos, on the same machine class — and the **no-ep-square path is
not made slower at all**.

300,000 iterations per cell, interleaved forward and backward so drift hits both variants
equally, **two independent samples**:

| shape | merged | ABC-011 | ratio | bar |
|---|---|---|---|---|
| **startpos — no ep square** | 304.2–314.5 ns | **302.9–306.5 ns** | 0.963–1.008 | ≤ ~450 ns — **MET** |
| **kiwipete — no ep square** | 310.0–314.6 ns | **309.1–315.6 ns** | 0.984–1.015 | ≤ 432–459 ns — **MET** |
| ep set, no capture at all | 320.1–322.0 ns | 320.3–351.0 ns | 1.000–1.091 | — |
| ep set, capture available | 311.7–317.4 ns | 427.1–433.3 ns | **1.357–1.383** | worst case, under 1.5x |
| the divergence FEN (sparse board) | 150.5–155.4 ns | 269.1–281.0 ns | 1.771–1.858 | not a bar position |

Amortized over a **120,000-node pool** drawn from the perft table at its natural en-passant
frequency (the pool is a depth-3 walk of all six roots, 277,955 nodes, uniformly downsampled by
stride — **6.77%** carry an ep square, **0.91%** have a pseudo-legal ep capture, **0.85%** a
legal one):

```
merged   322.2-328.9 ns/node    1.0000
ABC-011  327.2-329.3 ns/node    0.9948-1.0218x
keys that changed vs merged: 7,106 of 120,000
```

`ADR-0002` clause 3 has `EPIC-004`'s transposition table computing a key per node, so the
amortized row is the row that binds there: **the change is inside noise of merged on this pool.**

Two honest qualifiers on my own numbers, because they flatter the result:

- The **divergence FEN row is the worst ratio in the table (1.77–1.86x) and it is real**, but it
  is an artefact of a nearly empty board: only 5 pieces, so the base key is 150 ns instead of
  310 and the predicate's fixed cost is a larger fraction of a smaller number. It is not one of
  the bar's positions and the absolute cost (269–281 ns) is *below* the bar's own anchor value.
- My pool's ep-capture frequency (0.85% legal) is **lower** than the design hop's (1.87%),
  because my pool is a depth-3 walk and theirs went deeper. A pool with more ep captures would
  push the amortized ratio up. Scaling my measured per-call deltas to their frequency puts it
  at roughly 1.02x, which is where they landed — so the two runs agree rather than conflict.

## 3. The no-ep sub-bar, spied rather than inferred

`zobrist.ts` copied outside the repo with only its two import specifiers changed (body verified
byte-identical to the shipped file), importing a shim that counts calls and delegates to the
real predicate:

```
per zobristKey call:
  0  startpos — no ep square
  0  kiwipete — no ep square
  0  position-3 — no ep square
  1  ep set, no capture at all
  1  ep set, capture available
  1  ep set, pseudo-legal only

over a depth-3 walk of all six perft positions:
  nodes hashed                277,955
  nodes carrying an ep square  17,663
  hasLegalEnPassant calls      17,663
  calls on no-ep nodes              0   <- the guard short-circuits
```

The sub-bar therefore holds **structurally** — the majority path executes what it executed
before — and not merely inside timing noise.

## 4. The defect's scale and the two readings, re-derived independently

Exhaustive walk of the perft table at `src/perft.test.ts`'s own `fast` depths (startpos d4,
kiwipete d3, position-3 d4, position-4 d3, position-5 d3, position-6 d3). Ground truth
`legalMoves(p).some(m => m.flags === FLAG_EN_PASSANT)`:

```
TOTAL nodes visited        : 518,474
nodes with epSquare set    :  81,397  (15.70%)

property violations against the FIDE ground truth
  merged (pre-ABC-011)     : 77,872   (95.7% of ep-set nodes — the defect's real size)
  board-only (rejected)    :    862
  strict — SHIPPED         :      0

board-only misses per position: { position-3: 861, position-4: 1 }
```

**Every one of the design hop's published figures reproduced to the number** — 518,474 /
81,397 / 862 / 861+1 / 0 — on an independently written script. One denominator differs and it is
a counting choice, not a disagreement: the design hop reported 19,667 "ep-setting moves" where
this run counts one per ep-set node reached (81,397). The ratios and the miss counts are
identical.

The design hop's caveat is confirmed and worth repeating: **861 of the 862 come from
`position-3`**, a perft position built around exactly the rank-5 geometry that makes an ep
capture illegal. It is a biased population, not a game frequency.

## 5. Purity, including `ABC-009`'s own trigger shape

`toFen` compared before and after a single `zobristKey` call:

| position | result |
|---|---|
| `4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1` | unchanged |
| `4k3/8/8/3pP3/8/8/8/K7 w KQ d6 0 1` — castling rights, no rook (`ABC-009`'s trigger) | **unchanged** |
| `7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1` | unchanged |
| `rnbqkbnr/ppp1pppp/8/8/3pP3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1` | unchanged |

The second row is the position the design hop recorded a `legalMoves`-based hash corrupting (a
phantom white king on e1). The shipped predicate leaves it byte-identical, so **`ABC-009` is not
inherited** — and the same four FENs are asserted in `src/legal.test.ts`, so it stays that way.

## 6. The module graph, rebuilt rather than read off the ruling

Parsed out of `src/*.ts` on the shipped tree and analysed for cycles and longest path:

```
acyclic, max depth 6
  level 1: position
  level 2: fen, moves
  level 3: apply
  level 4: legal
  level 5: perft, zobrist
  level 6: gameend, perft-bench

zobrist -> legal, position          (the new edge)
```

Matches the design hop's ruled row exactly: no cycle, depth unchanged at 6, `zobrist` 2 → 5 and
`gameend` 5 → 6. `memory-bank/30-architecture.md`'s layering line has been corrected to
`position ← {fen, moves} ← apply ← legal ← {zobrist, perft} ← {gameend, perft-bench}`.

## 7. Harness

Five throwaway scripts in the session scratchpad, importing the repo's `src/` by absolute path
plus a pre-change copy of it: `bench.ts` / `percall.ts` (per-call cost), `amortized.ts` (the
pooled per-node cost), `spy.ts` (call counts through a byte-identical `zobrist.ts` and a
counting shim), `sweep.ts` (the divergence walk). **They are not committed** — the same posture
every prior measurement on this project has taken. Every number they produced is transcribed
above with its machine, so nothing depends on the scripts surviving.

One measurement error worth recording because the first result was wrong and I would rather
that be visible than quietly corrected: the initial amortized pool was collected depth-first and
truncated at the target size, which over-sampled one subtree and reported **31.31%** of nodes
carrying an ep square against the table's real ~6%. That pool would have overstated the cost.
The rebuilt pool walks all six roots to a fixed depth and downsamples by a uniform stride, which
is where the 6.77% above comes from.
