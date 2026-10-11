---
kind: adr
id: ADR-0039
---
# ADR-0039: `ABC-083`'s two class-R reds are not defects. The owner re-levels them on his word, or cuts mobility on his word. An R red never fires `ADR-0031`'s cut

## Status

**accepted** 2026-10-11 by Olger Oeselg (owner), verbatim "accepting ADR-0039" (note `.grugops/context/wave-2026-09-25/notes/20261011T102124Z-orchestrator-decision-owner-word-accept-adr0039-53cde860.md`). Decision 3's conditions still bind.

Previously **proposed** 2026-10-11 by Architect/Design (task `wave-2026-09-25`, subtask `design-abc083-r-reds-2026-10-11`).
~~**Owner acceptance owed.**~~ Owner accepted (above). No agent moves an ADR to `accepted`; this line records the owner's word.

- It applies `ADR-0028` decision 4 as written. It amends no accepted ADR.
- Under `ADR-0028` decision 5, **accepting this ADR is the owner's word for the two re-levels in decision 3.**
  That is the same vehicle `ADR-0028` used for `ABC-081` `A2`.
- **No production code changes because of this ADR.** Two test literals change, and only under decision 3's
  conditions.
- **No new reading was taken at this hop.** Two other agents were loading the machine. Every number below is
  cited from the build's committed probes on `grugops/ABC-083-king-safety-mobility` @ `fa81b948`
  (`.grugops/context/ticket-to-pr-ABC-083/probe/`). Node counts are deterministic.

## Context

`ABC-083` (build `79248602`, base `489c549e`) failed `A10` on two class-R levels (stop note `…e3f81b07`):

| row | level | recorded at merge | base | king safety alone | build |
|---|---|---:|---:|---:|---:|
| 15: `ABC-080` `A3` default-lane guard, position-6 d2, ordered / unordered nodes | ≤ 40.5% | 25.2% (27.0% kiwipete) | 26.07% | 27.66% | **43.56%** |
| 14: `ABC-079` `A5` (`ADR-0024` d3), position-6 d2, quiescence-on / bare-leaf nodes | ≤ 26x | 17.44x | 17.86x | 18.29x | **28.46x** |

Both levels already carry their one 1.5x headroom: row 15 from `ADR-0024` decision 3's rule, as written in
the test; row 14 from `ADR-0024` decision 3 itself. So `ADR-0028` decision 4 applies: either Architect/Design
rules a defect, or the owner re-levels by his word.

**The two reds are one number.** Both numerators are position-6's d2 search with ordering and quiescence on
(`searchWithoutPvsOrReductions`): **2 429 → 3 871 nodes** (`r14.out.jsonl`, `r15.out.jsonl`).
- Row 14's denominator, the bare-leaf d2 tree, is **136 nodes** on base, on king safety alone and at every
  mobility weight. The full-width d2 tree does not change. All of the growth is quiescence below it.
- Row 15's denominator, the unordered d2 tree, falls 9 319 → 8 887.

**`ADR-0028` decision 1, read on the recorded evidence:**

1. **Identity and oracle rows are green on the build.**
   - `ABC-080` `A1`: equal scores ordered and unordered, every r15 cell.
   - The quiescence depth-3 oracle equals `search()` on both boards, re-run on the build (ledger row 7).
   - `ABC-078` `A3` engine identity (`ENGINE_DEEP` 46/46), `ABC-081` `A1` and `ABC-121`'s drift and mate
     floor (`SEARCH_DEEP` pvs-lmr 29/29).
2. **The red is explained by the term's mechanism.** It does change with the weight: row 15 reads 30.44 /
   39.89 / 41.23 / 43.56% at 1–4 cp per square, and row 14 reads 21.18 / 27.41 / 26.99 / 28.46x. So the
   decision rests on mechanism:
   - `ADR-0034`'s scope command prints `src/evaluate.ts` only. No search, ordering or quiescence code changed.
   - Quiescence's size depends on the evaluator by design: a node stands pat when the static score reaches
     beta. Mobility is a term that every capture changes, by removing reach and opening lines.
   - The bare-leaf d2 tree is unchanged (136 nodes), so the growth sits below the full-width tree, at the
     stand-pat seam.
   - The per-node stand-pat cutoff counts were not read. That finer step is `UNKNOWN - verify`, and the
     ruling does not need it.
3. **The criterion each row stands for is green at its own depth.**
   - `ABC-080` `A3`'s own reading (d4, `SEARCH_DEEP`) is 1.82% on kiwipete and 2.48% on position-6, against
     ≤ 4%.
   - Row 14's other five cells are green. The thinnest is position-6 d1, at 9.19x against 10x.
   - Kiwipete moves the other way at d3 (12 238 → 9 258 nodes). This is tree shape, not a systematic loss of
     ordering.

**Why d2 reds and d4 does not.** At d2 the bare-leaf tree is 136 of 3 871 nodes, so quiescence is roughly 96%
of the ordered count.
So the d2 proxy mostly measures quiescence's response to the leaf evaluator. At d4 the full-width tree
dominates, and that is where ordering's effect shows.

## Decision

1. **Both rows are levels, not fixtures.** No row label depends on an evaluator margin. `ADR-0028` decision 2
   (re-find) does not apply.

2. **Neither red is a defect.** Proofs 1 and 2 of `ADR-0028` decision 1 hold on the record (Context). Proof 3
   (the bar's own mutant is still red after the move) is a condition on the move itself (decision 3). The red
   is a legitimate move of a quiescence-dominated shallow proxy, made by the term.

3. **Recommended to the owner (his word): re-level the two red cells, and only them.** Each new level is 1.5x
   the build's reading, rounded down. The rule is `ADR-0024` decision 3's, applied once more on his word to the
   evaluator that ships:
   - **Row 15:** position-6 d2 ≤ 40.5% → **≤ 65%** (43.56 × 1.5 = 65.3).
   - **Row 14:** position-6 d2 ≤ 26x → **≤ 42x** (28.46 × 1.5 = 42.7).

   Every other level stays byte-identical, including `A3`'s 4% at d4 and row 14's other five cells. The
   re-level lands only if all of these hold:
   - **The build ships mobility.** If the cut in decision 4 happens for any reason, nothing is re-levelled. King
     safety alone reads 27.66% / 18.29x, green on the current levels.
   - **It is its own commit.** The commit touches only the two literals and their comments, cites the owner's
     acceptance, and lands on the rebased branch.
   - **The two rows are re-read there**, and the readings are recorded in the commit body.
   - **Proof 3 is recorded red in the same commit.**
     - Row 15's mutant is a comparator that stopped ordering. It reads 100% by construction, so it stays red at
       65%. The exact `A4` pins on the same d2 searches (8 887 / 4 419 / 3 871, class P) keep catching a
       partial loss of ordering.
     - Row 14's mutant is quiescence with its MVV-LVA sort removed. It read 377.2x at `ADR-0024`'s build. On
       this build it is **`UNKNOWN - verify`**. The Engineer runs it on a scratch copy at that commit, and it
       must read above 42x.
     - If it does not, the re-level does not land, and the row comes back to Architect/Design.

4. **An R red is not a cut trigger. `ADR-0031`'s cut does not fire on the record.**
   - **What fires the cut:** an `A5` miss by every mobility form, or an `A9` stop while depth 7 stays a level
     (`ADR-0031` decision 5, R2 answered "keep depth 7").
   - **`A5` is met** (775.8 ns verdict over two sessions; 636 ns at `79248602`).
   - **Kiwipete held depth 7** in every branch run.
   - **Position-6 lost depth 7 once**, inside a load spike, at a 1.04–1.07x margin. Whether that is an `A9`
     stop is Security/NFR's reading. If they read a stop, the cut fires through `ADR-0031` decision 5, and
     decision 3 here is void.
   - A puzzle red is not a trigger either (`ADR-0034` decision 6).

5. **If the owner declines decision 3, the only route left is his scope word: king safety ships alone.**
   - No agent may drop mobility (page § cost risk), and no agent may re-weight.
   - The cut then has `ADR-0031` decision 1's shape: king safety alone ships, and BA/PM re-cuts mobility to
     `Backlog`.
   - The cut happens on his word, not because `ADR-0031` fired.

## Alternatives

- **Re-weight mobility to 1 cp per square. Rejected.** It reads 30.44% / 21.18x, green on both current levels.
  But the 4 cp weight was chosen before any measurement and was not tuned afterwards (`…c7a1e4d2`). Picking the
  weight that passes a bar is tuning the code to a test. `ADR-0028` Alternatives, `ABC-083` `A9` and `ADR-0034`
  decision 6 all rule it out. It is recorded so that the owner sees it exists.
- **Cut mobility now under `ADR-0031` (handoff #5's split). Rejected as an agent move.** `ADR-0031` names its
  triggers, and an R red is not one of them. Splitting also clears nothing else:
  - king safety alone also misses puzzle seed 5061 (53/58);
  - its `N8-LANE` charge is unmeasured.

  The split stays available on the owner's word (decision 5), or through `A9` (decision 4).
- **2.25x the recorded-at-merge figure (row 15 ≤ 60.75%, row 14 ≤ 39x). Not recommended.** That is two
  automatic headrooms stacked, which `ADR-0028` decision 4 forbids as an automatic step. As an owner choice it
  is defensible, but it is measured against an evaluator that will no longer ship.
- **Move row 15's guard to kiwipete d2 (16.62%, under the current 40.5%). Rejected.** This would choose the
  position by which one passes. Kiwipete d2 also grew by 52%.
- **Retire row 15's d2 guard. Rejected.** It is the default lane's only catch for "ordering stopped" (100%).
  The d4 criterion runs only on `SEARCH_DEEP`.
- **Rule both rows defects and send them to the Engineer. Rejected.** No search code changed, and the identity
  and oracle rows are green. There is nothing in the build to fix.

## Consequences

- **`ABC-083` stays `Blocked`** until each of these is resolved:
  - **The owner:** accept or decline this ADR. A decline is decision 5's scope word.
  - **QE:** class seed 5061 under `ADR-0034`. It reads L on the build's ladder.
  - **Security/NFR:** rule on `N8-LANE`'s +1.08 s CPU and on position-6's depth-7 margin. Their reading can
    fire the cut (decision 4).
- **Order.** Security/NFR's `A9` reading can make decision 3 void, so it is best read first. The owner may
  still accept now: decision 3 is conditional on mobility shipping.
- **Re-level checks.** A future evaluation change meets row 15 at 65% and row 14 at 42x. Both are then 1.5x
  above the reading of the evaluator that ships. Row 14's position-6 d1 cell (9.19x against 10x) is the next
  thin cell. It is named here, not changed.
- **`ABC-083` page.** `A10`'s "R never re-levelled" stays true for agents. The owner's acceptance is the
  `ADR-0028` decision 4 exception, and BA/PM folds it into the page.
- **`NFR-005` and every `plans/nfr-catalog.md` level:** unchanged.

## Rollback

- **Before acceptance:** edit or delete this file. Nothing is built on it.
- **After the re-level commit:** revert that commit. Rows 14 and 15 are then red again on a mobility build, and
  decision 5 is the only route.
