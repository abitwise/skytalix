# arch-next-pull decisions: (1) the joint O1h + P1 probe fails, so no joint ADR is written. `ADR-0060` and `ADR-0063` take dated lines, and both stay parked. (2) The next `EPIC-011` pull is **E1, the full taper, cut now with `ABC-231` and `ABC-232` folded in**. Evaluation is now the bigger lever. (3) There is no re-plan question for the owner, but `Q-3K-4` (`G6` "≥ base") is now live and should be put to him

Architect/Design, task `arch-next-pull`, records only, on `grugops/arch-next-pull` from `main` `a6039c5b`. Inputs:
- the PREREG `…4de572aa` and the results note of this task;
- `arch-ABC-233` `…4d5a0fe3`, `…9f0b5da7` and `…f3a4dac0`;
- `ADR-0060`, `ADR-0061`, `ADR-0063`, `ADR-0056` D2 / D6, and `EPIC-011` `RISK-EPIC011-08`.

## 1. The joint probe: no form meets every bar
- **The set (closed, pre-registered):** the H1 table plus decision 1 with one history term each:
  - J1: h > 0 → one ply less;
  - J2: ± 1 by the sign of h;
  - J3: J2, with the cap at 3 for h < 0;
  - J4: h > 0 → not reduced.
- **Every form loses `zugzwang.004` at d11**, which is the hard gate (F3, never a re-pin). J1 and J2 also lose `.001`, and J1 loses `.005` as well.
- **Every form drifts 69 cp in `chooseMove`** at position-6/f3h4, against the 27 cp cap.
- J1, J2 and J4 also miss `A4` (a) on `chooseMove` position-6 (0.877–1.010). J1 and J4 miss reach (+0.21 / +0.23 against +0.25).
- **J3 is the closest.** It meets `A4` (a) on all eight readings (≤ 0.817 vs H1, ≤ 0.780 vs `main`), reach (+0.321), the mate floor and `G1` (56 / 58). It misses the cap and `.004`, and it has not found h3h4 even at d13.
- **What it means:**
  - The history term does not buy back the zugzwang row. It is the one named premise for re-opening P1 (`ADR-0060` § Status) and the first for re-opening O1h (`ADR-0063` § Status item 1). That premise is now measured and not met.
  - **P1 and `ABC-233` stay parked.** P4 still waits on a quiet-move order.
  - Re-opening any of them needs a new named premise. Examples: an evaluation change that changes the tree (E1 / E2), an extension (X1), or an ordering change that leaves history more cutoffs (O2c, V3). A re-measure on an unchanged premise is not owed.
- **No bar moved, and no form was tuned after the read.** The 69 cp row moves the d5 score towards the d6 score (629 → 560, where d6 reads 578). That is a diagnostic, and the cap still counts it.

## 2. The ranking: expected Elo per cost on today's evidence
- **Today's evidence:**
  - P2 read −42 ± 58, after buying +0.70 ply;
  - P3 read +56 ± 56, GAIN, and is merged;
  - P1, P4 and P6 are lost or waiting, and the joint probe failed;
  - O1h alone is NEUTRAL and misses its own premise;
  - **the evaluation probe:** two node doublings fix about a third of the errors at the 100 ms node budget (48 → 37 → 34 errors of 50 cp or more), and 65 % persist; after 60 plies, 11 of 13 persist.
- **What that implies for search:** every open pruning or ordering item buys well under one doubling of effective depth (+0.06 to +0.4 ply). By this probe, one doubling removes about 23 % of errors (≈ 50–100 Elo by `ADR-0055`). So the remaining search items are each worth a small fraction of that.

**How to read the table:**
- The Elo column is `ADR-0056` D2's estimate, discounted by today's readings. Estimates, not readings.
- Cost units: S = 1, M = 2, L = 4, plus any gating wait.

| rank | item | est. Elo now | cost | Elo / cost | why |
|---|---|---|---|---|---|
| **1** | **E1, the full taper, folding `ABC-231` (king) and `ABC-232` (passers by phase)** | +30–90 (D2's +40–120, discounted for hand-written endgame halves before tuning) | M (2) | ≈ 15–45 | Today's evaluation tapers nothing: the king hides in every phase, and passers are rank-only. The errors that search does not fix are concentrated late in the game. E1 is also E2's prerequisite. Risk: `G6` "≥ base" (`ABC-205` died on it), so `Q-3K-4` |
| 2 | `ABC-239` (E2), offline tuning | +100–250 | L (4), after E1; method ADR; data (`Q-3K-7`: own games by default; 400-game PGNs exist); `ADR-0048` | ≈ 25–60 nominal, **not pullable before E1** | the largest block; it tunes E1's halves |
| 3 | P5, null-move R grows with depth | 0 at 100 ms (NEUTRAL); +5–15 at long controls | S (1) | ≈ 0–15 | 0.88–0.95×, +0.06 ply; clean. Its read can only show "no harm" |
| 4 | `ABC-234` (O3s), SEE capture ordering | 0–15 (D2's +10–30, discounted: 82 % of cutoffs fall on the first move, and history moved only 2.6 % of them) | M (2) | ≈ 0–8 | mostly the enabler of Q1 (SEE pruning, +20–50 est.), which is a speed item |
| 5 | `ABC-236` (S1), aspiration windows | 0–15 (at depth 6–7 the window saves little; T1 is not in force) | M (2) | ≈ 0–8 | low at 100 ms |
| — | the joint O1h + P1 | — | — | — | not eligible (§ 1) |
| — | `ABC-231` / `ABC-232` alone | +10–30 each | S (1) each | ≈ 10–30 | subsets of E1. Read alone, each sits inside the ± 56 a 100-game read resolves. Cutting E1 once avoids reading evaluation in three pieces |

- **Recommendation: E1 next, cut by BA/PM from the stub with `ABC-231` and `ABC-232` folded in.** This is the dedupe audit's own plan (C7), pulled forward from Phase 4's refinement. The Architect then writes its ADR.
  - **The ADR should pre-register three premise checks before any build:**
    1. a `G6`-shaped node-cost probe (the per-node cost of the phase blend, read as depth on kiwipete and position-6 on a frozen clock, then the `G6` rule);
    2. this task's evaluation instrument as an information reading: loss on the 145 positions at 47 000 nodes against `main`. It is never a bar, because a rule fitted to a fixed corpus measures nothing;
    3. intent GAIN (it fires at every node).
  - **Fallback**, if the Orchestrator wants the smallest slice first: `ABC-231` alone (S, DoR 9/10). Its A1 is already the `G6` replay.
- **Phase 2 and R1:** what Phase 2 can still read is P3 (in force) and P5 (NEUTRAL). Closing Phase 2 now and reading R1, or holding P5 for later, is the Orchestrator's and BA/PM's call. P5 is cheap, but at 100 ms its value cannot be seen.

## 3. Does `EPIC-011`'s plan need a re-plan question to the owner?
- **The order: no.** `ADR-0056` D6 says the phase order is a recommendation that the Orchestrator and BA/PM may reorder by width and evidence. Under the 2026-10-22 delegation this is a delivery call. Pulling Phase 4's E1 ahead of Phase 3 (O3s, S1) and the rest of Phase 2 (P5) is such a reorder. The owner is **told**: P1 and O1h stay parked; evaluation goes next on measured evidence; the Phase 3 items stay in the epic.
- **One existing owner question is now live: `Q-3K-4`.** It asks whether `G6` "≥ base" is kept, or whether value-changing tickets are judged on play (C2′) with `NFR-005`'s depth-6 floor and depth-7 WARN. Its default ("≥ base binds") hits E1–E7 first, and `ABC-205` died on it, on cost, not on play.
  - **Architect's recommendation:** judge evaluation tickets on play, with `NFR-005`'s floor, which never moves. This probe says depth is the smaller lever here. A rule that refuses a few percent of node rate blocks the larger lever. But it is a loosening, so it is his word.
  - **The answers that settle it:** "keep G6 ≥ base" (the default: E1 must then be designed node-cheap, for example the phase computed once per call and the blend folded into the existing PST pass), or "judge on play with the depth-6 floor".
  - **Timing:** ask now, so the E1 ADR is written against the rule that will judge it. E1's design and build do not wait for the answer.
- `Q-3K-7` (tuning data) becomes live only when E2 is pulled. It need not be asked now.

## Questions
- **Owner:** `Q-3K-4`, as above (recommended now; not a re-plan question). Two items to tell him: the joint probe failed, so P1 and O1h stay parked; and evaluation goes next.
- **Orchestrator:**
  1. accept the ranking and pull E1, which means a BA/PM cut of E1 folding `ABC-231` and `ABC-232`, then an Architect ADR hop; or take `ABC-231` alone as the smallest slice;
  2. Phase 2's close and R1: now, or after P5.
