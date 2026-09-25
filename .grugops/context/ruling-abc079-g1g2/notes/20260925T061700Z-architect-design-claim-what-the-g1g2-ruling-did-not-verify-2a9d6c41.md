---
id: 20260925T061700Z-architect-design-claim-what-the-g1g2-ruling-did-not-verify-2a9d6c41
kind: claim
by: architect-design
at: 2026-09-25T06:17:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-079
  - NFR-008
  - src/search.test.ts
  - src/quiescence.test.ts
supersedes:
---

# What the G1/G2 ruling did NOT establish

1. **The edited lanes were not run, because there are no edited lanes yet.** The G2 shares come
   from an out-of-tree copy of the real `src/search.test.ts` with probe cases added. That copy's
   control reproduced the real file: `A4` deep read 62.4 s, against QE's 60.2–66.9 s. The
   per-slice cases the Engineer writes are **estimated at ≤ 38% cold, not measured**. The
   Engineer's run is the record.
2. **Every wall time is a load-2.8–5.6 wall time from one run.** Node counts, scores and moves
   are exact. The seconds are not the catalog's quiet-machine protocol.
3. **The oracle check covers one depth on six boards.** It shows that the shipped depth-3 answer
   equals the full-window unpruned answer on those boards today. It is not a proof that the
   window flow is right in general, and it does not check `quiesce`'s own inner alpha-beta (it
   never has).
4. **The pins were shown to catch `R2a`/`R2b`/`R2c` by their probe values, not by a red row.**
   No row with the pin exists yet. The Engineer's hop must show the red with the mutants
   re-applied (licence, "What the hop must re-run", item 3).
5. **The broad corpus is assumed to be deterministic in order and content.** The per-root slices
   summed to 184 positions in the probe. The ruling tells the hop to assert that the slices equal
   the whole, rather than trusting this probe's count.
6. **`search.test.ts:352` was added to the licence by this ruling.** QE did not flag it. It is
   the same fact as D3/D4 and in the same ticket's diff, so it is licensed here to avoid a fifth
   finding on re-QE. Whether QE would have counted it is `UNKNOWN - verify`.
7. **The queue file is not on this branch's base.** `pending/ruling-abc079-g1g2.md` exists on
   `grugops/wave-2026-09-24` (`cfa31cf`), not on `grugops/int-ABC-079` (`9b4dd68`). The claim
   was taken on this branch (bare `mkdir`), and the file was carried into `claimed/` and then
   `done/`. **When this branch merges into the wave branch, the wave's
   `pending/ruling-abc079-g1g2.md` has to be deleted there by the Orchestrator.** This branch
   cannot delete a file its base never had.
