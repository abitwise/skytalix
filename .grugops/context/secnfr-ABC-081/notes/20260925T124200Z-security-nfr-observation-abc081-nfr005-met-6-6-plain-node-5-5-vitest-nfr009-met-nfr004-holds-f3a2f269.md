---
id: 20260925T124200Z-security-nfr-observation-abc081-nfr005-met-6-6-plain-node-5-5-vitest-nfr009-met-nfr004-holds-f3a2f269
kind: observation
by: security-nfr
at: 2026-09-25T12:42:00Z
verified_by:
confidence: high
refs:
  - ABC-081
  - NFR-004
  - NFR-005
  - NFR-009
  - AR-NFR004-A
  - AR-NFR005-079
  - ADR-0025
  - src/transposition.ts
  - src/search.ts
  - src/engine.ts
  - .grugops/context/secnfr-ABC-081/notes/raw-harness-build-arms.mjs.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-harness-a7-core.mjs.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-harness-a7-node.mjs.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-harness-a7-vitest.test.mjs.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-harness-margin.mjs.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-harness-nfr009.mjs.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-harness-t2.mjs.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-harness-nfr004.mjs.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-harness-ceiling.mjs.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-harness-clearcost.mjs.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-harness-clearcost-dirty.mjs.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-out-a7-node.json.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-out-a7-vitest.json.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-out-margin.jsonl.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-out-nfr009.jsonl.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-out-t2.jsonl.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-out-nfr004.json.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-out-ceiling.jsonl.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-out-clearcost.jsonl.txt
  - .grugops/context/wave-2026-09-24/notes/20260925T180000Z-orchestrator-decision-0288b6ed.md
supersedes:
---

# ABC-081: `NFR-005` MET on the binding runner (plain node 6 / 6), vitest 5 / 5 reported. `NFR-009` MET, no measured need for more. `NFR-004` holds

Hand-authored per `agent-factory/contracts/context-note.md`, with no `seal`. That is the degraded
posture `AGENTS.md` records; it is not re-derived here. Machine: Apple M3, Darwin 25.5.0 arm64,
node v24.12.0. The system clock read 12:10Z at the claim and 12:42Z here, which is earlier than
the queue file's 18:00Z enqueue stamp. The build and QE hops saw the same skew. The stamps here
are the clock as read.

**Arms** (`raw-harness-build-arms`, `secnfr-ABC-080`'s builder re-pointed) were built by
`git archive` outside the repository:
- **A** = `504f046`, the build QE reviewed. Its `src/` is byte-identical to `c9d65a0` and
  `ff28ae5` (`git diff 504f046 ff28ae5 -- src` is empty).
- **N** = a byte-identical copy of A (`diff -rq` clean).
- **B** = `6033d05`, the base.

A and B differ under `src/` in exactly the seven ticket files. `package.json` and
`vitest.config.ts` are identical.

## 1. `NFR-005`: completed depth at 3 s, this build vs `6033d05`, same process, 5 rounds

`raw-harness-a7-core` is `secnfr-ABC-080`'s core, with only its comment lines changed. One piece
of code is driven by two runners. Both builds are imported into one process, the build order
alternates per round, and the 1-minute load is read before every call. It calls `chooseMove` at
`DEFAULT_BUDGET_MS` on the real clock.

| runner | position | base `6033d05` | **this build** | base nodes | this build nodes | load1 |
|---|---|---|---|---|---|---|
| **plain node (binds)** | kiwipete | 6,6,6,6,6 | **6,6,6,6,6** | 904 970 – 933 642 | 923 402 – 934 666 | 3.58 – 4.62 |
| **plain node (binds)** | position-6 | 5,5,5,5,5 | **6,6,6,6,6** | 887 070 – 920 862 | 855 326 – 865 566 | 3.58 – 4.62 |
| vitest (reported) | kiwipete | 4,4,4,4,4 | **5,5,5,5,5** | 154 378 – 155 402 | 131 850 – 132 874 | 3.19 – 3.67 |
| vitest (reported) | position-6 | 4,4,4,4,4 | **5,5,5,5,5** | 146 718 – 148 766 | 145 694 – 147 742 | 3.19 – 3.67 |

- **The binding reading is plain node, on the owner's word** (*"2. use recommendation"*,
  2026-09-25, note `…0288b6ed`). **It reads depth 6 on both positions in 5 of 5 rounds. The floor
  is 6, so the floor is MET.**
- **Depth 7 was not reached, so the WARN level is not met.** That level is PROVISIONAL per the row.
- This reproduces the build's figures (6 / 6 plain node, 5 / 5 vitest, over 3 rounds) and QE's
  independent plain-node figure (6 / 6).
- The build is ≥ base in 20 of 20 pairs. It is strictly deeper in 15 of 20: every position-6
  pair and every vitest pair. Kiwipete in plain node was already at 6 on the base.
- **The runner costs about 7x in node rate.** Plain node runs about 310k nodes/s on kiwipete.
  Vitest runs about 44k.

**Headroom** (`raw-harness-margin`, head arm, plain node, 2 rounds):

| budget | kiwipete | position-6 |
|---|---|---|
| 1.0 s | 5, 5 | 5, 5 |
| 1.5 s | 5, **6** | 5, 5 |
| 2.0 s | **6, 6** | **6, 6** |
| 2.5 s | 6, 6 | 6, 6 |
| 5.0 s | 6, 6 (about 1.27M nodes) | 6, 6 (about 1.22M nodes) |

- **Depth 6 completes by 2.0 s on both positions.** That is about 1.0 s, or 33%, of headroom at
  load 3.5–3.7.
- A machine or load about 1.5x slower than this one would put position-6 back at 5.
- **Depth 7 is not reached even at the 5 s ceiling**, so the WARN level is not close.

## 2. `NFR-009` (16 MiB total; growth ≤ 1 MiB in `heapUsed` and in `arrayBuffers`, 1 s vs 3 s, after `gc()`): **MET**

`raw-harness-nfr009` follows the catalogue row's own method: child `node --expose-gc`, and every
read is taken after `gc()`.

| read | this build (A) | base (B, no table) |
|---|---|---|
| (a) `tableByteLength()` | **4 194 304 B**. It is 0 before the first search and unchanged after 32 searches | — |
| (a) key array, per search | 129 × 8 = **1 032 B** | — |
| (a) killer table | tens of references (`secnfr-ABC-080`: worst 15 slots × 2) | same |
| `arrayBuffers` before the first call → after 1 s → after 3 s | 0.010 → **4.010 → 4.010 MiB** (**+0.000**) | 0.010 → 0.010 → 0.010 |
| `heapUsed` after 1 s → after 3 s | 7.915 → 7.787 MiB (**−0.128**) | 7.804 → 7.686 (−0.118) |
| 30 consecutive calls (500 ms, kiwipete / position-6 alternating): `arrayBuffers` | 4.010 flat, max 4.010 | 0.010 flat |
| same 30 calls: `heapUsed` first → last | 7.919 → 8.059 (+0.140) | 7.802 → 7.932 (+0.130) |

- **The total is about 4.00 MiB against 16 MiB**, which leaves 4x headroom.
- **Growth within a call** (1 s → 3 s) is +0.000 MiB in `arrayBuffers` and −0.128 MiB in
  `heapUsed`.
- **Growth across calls:** `arrayBuffers` does not move. `heapUsed` drifts +0.14 MiB over 30
  calls, and the base, which has no table, drifts +0.13. **That drift belongs to the process, not
  to `ABC-081`.**
- The 4.00 MiB step on the first call is the one allocation per process that `ADR-0025` Decision
  2 designed. It is not growth.

**Measured need for more than 16 MiB: none** (`raw-harness-t2`, `ADR-0025` falsifier `T2`'s
shape). Scratch copies of arm A were made outside the repository, with `TABLE_BITS` as the only
changed line. They ran at 2^16 (1 MiB), 2^18 (4 MiB, shipped) and 2^20 (16 MiB), in one process
at 3 s, over 3 rotated rounds. **Every arm read depth 6 on both positions in every round.** Node
counts moved by at most ±3%, and the scores were identical (35 / 25). **A bigger table buys no
ply. Nothing is handed up and no re-level is proposed.**

## 3. `NFR-004` (≤ 3 s at the default budget, 5 s hard ceiling): **HOLDS**, clear-per-search included

**Plain node wall** (`raw-harness-nfr004`, `secnfr-ABC-080`'s probe with only its comment
changed): the six perft roots, the capture-dense middlegame and the worst first-iteration board,
5 rounds.
- **n = 40: p50 3 001.4 ms, p95 3 004.3 ms, max 3 005.8 ms.**
- 30 of 40 calls ran over 3 000 ms, all by ≤ 5.8 ms (the abort granularity).
- Load was 4.08–5.47.
- Depths: startpos 7, kiwipete 6, position-3 10, position-4 7, position-5 6, position-6 6,
  mid-16caps 6, worst-first-iter 6.

**The ceiling** (`raw-harness-ceiling`, unchanged probe):
- kiwipete at `Infinity`: **5 000.3 ms**;
- position-4 at `1e9`: **4 999.8 ms**;
- queens rig at `Infinity`: **5 008.8 ms**.
- The runaway probes at 5 000 ms (security observation) read 4 999.4 – 5 003.0 ms on 16 more
  boards.

**The table's own per-search cost** (`raw-harness-clearcost`, `-dirty`). `clearTable()` runs
inside the budget: after `start = now()` in `chooseMove`.
- The first call, which is the one 4 MiB allocation per process, costs **0.050 – 0.055 ms**.
- Each later clear is a 1 MiB `fill(0)`: **p50 0.0076 ms, max 0.062 ms** over 2 000 calls.
- A clear on a table dirtied by a real 300 ms search costs **≤ 0.021 ms** (8 of 8).
- The key array allocation costs **0.26 – 0.68 µs**.
- **The table's fixed costs are at least three orders of magnitude below the 31 ms tail**. They are
  not a factor in `NFR-004`.

**Under vitest** (the section 1 runner): this build's worst wall was **3 037.3 ms** (kiwipete) and
the base's was **3 027.7 ms** in the same process.

**Two readings for `AR-NFR004-A`'s owner. Neither is re-denominated here, and neither is
attributable to this ticket on the paired reading:**
- **(i) Vitest 3 037.3 ms, which is 37.3 ms over 3 s.** That is outside the ≤ 31 ms
  denomination. The base read 3 027.7 in the same session. QE's `ABC-080` reading of 3 040 ms was
  the same shape. Every tail reading at this build is ≤ 40 ms.
- **(ii) The queens rig at the ceiling, 5 008.8 ms.** `secnfr-ABC-080` read 5 002.6 ms for the
  same board. It is inside 31 ms.
- The plain-node runner, which binds `NFR-005` and is the product's runtime, read ≤ 5.8 ms over
  3 s.
