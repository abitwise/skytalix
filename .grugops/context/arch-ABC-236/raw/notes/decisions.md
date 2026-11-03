# arch-ABC-236 decisions: `ADR-0066` is written PROPOSED, **premise not met on `main`** (F4: A100 `chooseMove` d8 0.9836 / 0.9913 > 0.95; every form misses). S1 fires at 100 ms (70.4 % of nodes at 47 000), so `ADR-0056`'s "S1 is depth-gated" is wrong and a re-open is GAIN. Recommendation: **park `ABC-236`**. Lines are owed to `ADR-0056`, `EPIC-011` and the ticket page (listed below; not edited here)

Architect/Design, task `arch-ABC-236`, `grugops/arch-ABC-236` from `main` `70db0e7f`. Evidence: the results note of this task and PREREG `…69cfcb4a`.

## 1. The verdict, by the pre-registered rule
- No form passes both gates. The safety gate passes for all four (zugzwang 7 / 7, `G1` 54 / 58, mate 0 violations with every mate exact, drift within bars, `A2` exact on 1 / 1). The pay gate (`A3`, ≤ 0.95× on kiwipete and position-6 at d8 in `chooseMove`) misses for all four.
- So `ADR-0066` is PROPOSED with "premise not met on `main`" (the `ADR-0063` / `ADR-0065` pattern). No form was tuned after the read. "Accept ADR-0066" is not put to the owner.
- **Design of record: A100** (δ 100, doubling, cap 400, from iteration 5, mate guard at ±`MATE_FLOOR`). It is chosen by the pre-registered choice rule applied as a ranking: reach within 0.02 ply of the best (+0.005 vs +0.016), then the lowest larger-of-two d8 ratio (0.9913 vs A50's 0.9950).

## 2. Why it does not pay (the structural reading)
- `runIteration` already runs PVS at the root: every root move after the first gets a null window. A root window can narrow only the first move's subtree (the leftmost path and the PV nodes) and the root's full re-searches.
- The no-fail ceiling is about 2 %: A100 wastes 0.9 % of nodes on re-searches and still reads 0.9779 at d7 over the 190. Position-4 never fails and reads 0.998-0.9995. A narrower δ adds re-searches (A25: 37.6 % of windowed iterations re-searched, 1.02× at d7).
- **Effect on reach at 100 ms by nodes:** +0.005 ply (A100), +0.016 (A50 / A50F), −0.016 (A25) at 47 000; 0 to −0.058 at 20 000. Nothing visible.

## 3. The intent and the depth-gated claim (a correction to `ADR-0056`)
- `ADR-0056` C2′ lists S1 among the depth-gated mechanisms that "barely fire" at 100 ms, and its "C yes" line names S1 as an example of a NEUTRAL "invisible at 100 ms" candidate. **Measured: it fires.** At 47 000 nodes, 70.4 % of all nodes are inside aspiration passes, on 186 of 190 rows (iterations ≥ 5 hold 71.9 % of nodes; 51.3 % at 20 000). The rule's premise ("completes depth 6, 5 cold") is right, but iterations 5 and 6 are most of the work.
- So a re-open's intent is **GAIN** (C2′ ≥ 50.0), and NEUTRAL "invisible" is closed to `ABC-236`. That answers `A5`'s "the design names its firing rate at 100 ms".

## 4. Re-open conditions (named, not expected)
1. **T1 lands** (bound-aware table cutoffs; `ABC-257`). `ADR-0056` D2's "S1 depends on T1" is the one mechanism that could raise the ceiling, because narrower windows would then turn into bound cutoffs from the table. The instability clause returns with it (flips measured 0 today).
2. **A deeper shipped search** (d9 is mixed: A50 0.9448 / 0.9798, A100 0.9546 / 0.9962). A read at a longer control that runs over 1 h is the owner's to approve.
- **E1 is not a re-open condition.** E1's taper can move δ (endgame swings), but not the ceiling, which comes from PVS. A re-open after E1 re-reads the swing quantiles (p90 63-67 cp at iterations 5-6 on `main`).

## 5. Effort if re-opened
- **S-M: about 0.5-1 Engineer day** (`src/engine.ts` only: `runIteration` takes a window and reports a fail; `aspirate`; one switch; one door `chooseMoveWithoutAspiration`; the widening, mate and source rows; the re-points). Plus about 1 h QE read, the C2′ read (~25 min), S′ and the Levels deep lane. This is an estimate.
- Sourcing `A2`'s six positions is extra work (only 1 of 535 committed positions qualifies). It means self-play positions, or BA/PM relaxes the jump to more than 100 cp (7 rows).

## 6. Recommendation
- **Park `ABC-236`** (DoR 9 / 10). It is the Orchestrator's call; the owner is told, not asked.
- Next in the owner's order: `ABC-239` (E2) design.

## 7. Lines owed (not edited; fenced)
- **`ADR-0056`:**
  - (a) Row S1 (D2 table): "`ADR-0066` PROPOSED, premise not met on `main` (A100 d8 0.9836 / 0.9913); fires at 100 ms; parked".
  - (b) The status row for `ABC-236` ("new ADR") → "`ADR-0066`, premise not met".
  - (c) **C2′ § Depth-gated mechanisms:** remove "S1 aspiration windows, which `ABC-236` starts at depth 5". Add S1 to "Rows that act at shallow depth fire at 100 ms", with "measured: 70.4 % of nodes at 47 000 inside aspiration passes (`arch-ABC-236`)".
  - (d) **C2′ "C yes" line:** "S1, X2 and P5 by their depth gates" → "X2 and P5 by their depth gates" (S1 measured to fire).
  - (e) A dated line for row S1 in the `arch-ABC-233` / `arch-ABC-234` shape.
  - (f) The Phase 3 order line ("Then S1 (`ABC-236`)"): mark it parked.
- **`EPIC-011`:**
  - Phase 3 row S1 (`ABC-236`): "parked; `ADR-0066` PROPOSED, premise not met on `main`; re-opens on T1 or a deeper shipped search".
  - The ticket table row 9: the hold "new ADR" → "`ADR-0066`: premise not met"; Backlog.
  - The gap-map row: same.
- **`ABC-236` page:**
  - DoR item 10: "❌ ADR" → "❌ `ADR-0066`: premise not met on `main`".
  - `A5`'s depth-gated sentence answered: it fires at 100 ms (70.4 %), so the intent is GAIN.
  - `A2`: the six-position fixture cannot be drawn from the committed corpora (1 of 535 qualify); name its source, or the > 100 cp relaxation.
  - `A3`: unchanged (the ADR keeps it); the Dependencies "a new ADR" → `ADR-0066`.
  - The stale line refs (`src/engine.ts:436-458`, `:79-80`) → `runIteration` and the header line at `:105`.
