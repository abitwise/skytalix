---
id: 20261009T172203Z-security-nfr-observation-abc082-nfr005-floor-met-depth7-warn-kiwipete-margin-1-05x-ff8ad962
kind: observation
by: security-nfr
at: 2026-10-09T17:22:03Z
verified_by:
confidence: high
refs:
  - ABC-082
  - NFR-005
  - NFR-004
  - ADR-0003
  - AR-NFR004-A
  - ABC-074
  - ABC-083
  - plans/nfr-catalog.md
  - plans/tickets/ABC-082-evaluation-pawn-structure.md
  - .grugops/context/ticket-to-pr-ABC-082/notes/20261009T163130Z-software-engineer-observation-abc082-a6-cost-nfr005-depth-warn-n8lane-a00b6aaa.md
  - .grugops/context/secnfr-ABC-082/notes/raw-harness-one.mjs.txt
  - .grugops/context/secnfr-ABC-082/notes/raw-harness-depth.mjs.txt
  - .grugops/context/secnfr-ABC-082/notes/raw-harness-nodes7.mjs.txt
  - .grugops/context/secnfr-ABC-082/notes/raw-out-depth-s1.jsonl.txt
  - .grugops/context/secnfr-ABC-082/notes/raw-out-depth-s2.jsonl.txt
  - .grugops/context/secnfr-ABC-082/notes/raw-out-nodes7.jsonl.txt
supersedes:
---

# `NFR-005` at `ABC-082`: FAIL floor (depth 6) MET, 64 of 64 runs. Depth 7 WARN on kiwipete: reached in 15 of 16 runs, but on a margin of only **1.05–1.12x** (base 1.16–1.27x). The cause is +14.6% tree size, not node rate

Hand-authored and unsealed. This note is an observation, not a stamp. Apple M3 (4P + 4E), Darwin 25.5.0, Node
v26.11.0. **Quiet was not attainable:** QE ran deep lanes on this machine for the whole window, so
load is recorded on every run. Branch = `src/` at `873911d` (this worktree). Base = `git archive
5ebe1d8` (the wave tip the build branched from; `src/` is identical to `a034409`).

## Protocol, and one deviation from the build's reading

This follows the catalog row, under "Runner: plain `node`": `chooseMove` at `DEFAULT_BUDGET_MS` on the
real clock, in a plain `node` process, on kiwipete and position-6. `A6` asks for 3 rounds, with base
and branch alternating and load recorded. This gate ran **two sessions of 8 rounds**. The order
flipped every round, and load1 was read before every run.

**Deviation:** each run is a **fresh OS process** (`one.mjs`). The build ran both trees in one
process (`probe/depth.ts`). A fresh process is the product's own shape (`npm run chess` runs one
engine per process), and it keeps one tree's JIT and GC state out of the other tree's reading.

## Readings: depth completed (nodes visited in 3 s)

Session 1, **2026-10-09 17:01:37–17:03:17Z**, load1 2.7–17.5. QE's lanes started during round 1.

| round | order | kiwipete branch | kiwipete base | pos-6 branch | pos-6 base | load1 |
|---|---|---|---|---|---|---|
| 1 | branch first | 7 (640 594) | **6** (513 788) | 7 (484 782) | 7 (700 841) | 2.7–11.1 |
| 2 | base first | **6** (419 410) | 7 (613 116) | 7 (682 414) | 7 (694 697) | 10.5–17.5 |
| 3 | branch first | 7 (682 578) | 7 (665 340) | 7 (681 390) | 7 (711 081) | 14.2–16.4 |
| 4 | base first | 7 (682 578) | 7 (664 316) | 7 (678 318) | 7 (713 129) | 12.3–14.2 |
| 5 | branch first | 7 (685 650) | 7 (672 508) | 7 (679 342) | 7 (714 153) | 9.8–11.4 |
| 6 | base first | 7 (684 626) | 7 (668 412) | 7 (676 270) | 7 (709 033) | 8.8–9.8 |
| 7 | branch first | 7 (682 578) | 7 (673 532) | 7 (682 414) | 7 (710 057) | 7.9–8.3 |
| 8 | base first | 7 (684 626) | 7 (669 436) | 7 (677 294) | 7 (713 129) | 7.1–7.9 |

Session 2, **2026-10-09 17:16:33–17:18:12Z**, load1 3.8–4.6.

| round | order | kiwipete branch | kiwipete base | pos-6 branch | pos-6 base | load1 |
|---|---|---|---|---|---|---|
| 1 | branch first | 7 (671 314) | 7 (654 076) | 7 (661 934) | 7 (695 721) | 3.8–3.9 |
| 2 | base first | 7 (643 666) | 7 (645 884) | 7 (659 886) | 7 (690 601) | 3.9–4.1 |
| 3 | branch first | 7 (648 786) | 7 (635 644) | 7 (650 670) | 7 (680 361) | 4.5–4.6 |
| 4 | base first | 7 (647 762) | 7 (636 668) | 7 (649 646) | 7 (678 313) | 4.1–4.3 |
| 5 | branch first | 7 (642 642) | 7 (635 644) | 7 (654 766) | 7 (674 217) | 4.2–4.2 |
| 6 | base first | 7 (642 642) | 7 (615 164) | 7 (645 550) | 7 (676 265) | 4.1–4.2 |
| 7 | branch first | 7 (640 594) | 7 (626 428) | 7 (644 526) | 7 (673 193) | 4.2–4.2 |
| 8 | base first | 7 (642 642) | 7 (627 452) | 7 (659 886) | 7 (680 361) | 4.2–4.4 |

- **Depth 6 floor:** 64 of 64 runs reached depth ≥ 6. **MET.**
- **Depth 7, kiwipete:** branch **15 / 16**, base **15 / 16**. Position-6: 16 / 16 on both builds.
- **Both misses** (one per build) came at a load1 jump (2.7 → 11.1, then 10.5 → 17.5), when
  another process started on the cores. The capacity in those runs fell to 419k–514k nodes.
  Steady high load did not cause misses: session 1's rounds 3–8 at load 7–16 read about 680k.
  **load1 is a poor predictor here, and transient contention is the cause.** This is labelled a
  candidate explanation, not a proven one.
- **`NFR-004`:** `elapsedMs` was 3 000–3 006 over 64 runs. That is inside `AR-NFR004-A` (≤ 31 ms).
  Nothing new.

## The clock-free companion: work needed to complete depth D, which load cannot move

Instrument (`nodes7.mjs`): inject a virtual clock that ticks once per consultation, i.e. once per
`NODES_PER_CLOCK_CHECK` = 1 024 nodes. Binary-search the smallest budget at which `chooseMove`
completes depth D. The node count at that budget is the cumulative work through depth D, because
the deepening loop stops on `now() < deadline` before it starts D+1. One tick less reads depth
D−1 in every row.

| position | depth | branch nodes | base nodes | Δ |
|---|---|---:|---:|---:|
| kiwipete | 7 | **610 179** | 532 363 | **+14.6%** |
| kiwipete | 6 | 256 581 | 208 499 | +23.1% |
| position-6 | 7 | 462 871 | 467 461 | −1.0% |
| position-6 | 6 | 170 202 | 165 716 | +2.7% |

**This reproduces the build's figures exactly** (610 179 / 532 363 / 462 871 / 467 461, which the build
took by a different route: the `ABC-121` `A2` deep row). Two independent instruments agree to the
node.

## The margin, which is what the 15 / 16 does not show

Margin = 3 s capacity in that run ÷ nodes needed to complete depth 7.

| | branch | base |
|---|---|---|
| kiwipete, session 2 (load ~4) | 640 594–671 314 → **1.050–1.100x** | 615 164–654 076 → 1.156–1.229x |
| kiwipete, session 1 steady rounds 3–8 | 682 578–685 650 → 1.119–1.124x | 664 316–673 532 → 1.248–1.265x |
| position-6, session 2 | 644 526–661 934 → 1.39–1.43x | 673 193–695 721 → 1.44–1.49x |
| kiwipete, depth 6 floor, worst run seen (419 410) | 1.63x | — |

- `ABC-082` cut kiwipete's depth-7 margin from about 1.2x to about **1.05–1.12x**. A 5–12% dip in
  capacity now costs depth 7 on kiwipete. Base needed a 16–27% dip.
- **Node rate (a diagnostic, not the target).** Session 2, kiwipete: branch 213–224k/s, base
  205–218k/s, so kiwipete is not slower. Position-6: branch 215–220k/s, base 224–232k/s, about
  **4–5% slower**. That fits the evaluator's +230 ns per call (see `A6`).
  - **A small correction to the build note `…a00b6aaa`:** "node rate unchanged" holds on kiwipete.
    It does not quite hold on position-6, where the tree shrank 1.0% and covers the rate loss.
  - On kiwipete the cause is the tree (+14.6%), as the build said.

## Against the clause as written (`plans/nfr-catalog.md`, `NFR-005` row)

> "completes **≥ depth 6** within the 3 s budget … (**below depth 6 = FAIL**), and reaches **depth
> 7** within that same 3 s budget (**below depth 7 = WARN**; the depth-7 level is **PROVISIONAL**…)"

- **FAIL floor: MET.** 64 / 64 runs. The thinnest floor margin seen is 1.63x, in a contended run.
- **Depth 7 level, kiwipete: WARN.** The clause has no per-round tolerance, so every run below 7 is a
  WARN reading. This gate recorded 1 / 16 and the build 2 / 3. Base recorded 1 / 16 here and 0 / 3 at
  the build, so base is not immune either. **What `ABC-082` changed is the margin, not whether depth 7 can
  be reached.** At about 1.05x, the machine's ordinary contention decides depth 7 on kiwipete.
- **Depth 7 level, position-6: reached**, 16 / 16, margin 1.39–1.43x.
- The depth-7 level stays **PROVISIONAL** (`ABC-074`, non-M3), and this gate does not lift it. On
  slower hardware a 1.05x margin on M3 is very likely a miss.
- No level was touched. The level is the owner's (`ADR-0003` clause 2 as amended by Olger Oeselg).
