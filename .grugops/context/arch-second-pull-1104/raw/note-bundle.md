# arch-second-pull-1104 decision: the bundle read is drafted as a PROPOSED dated section of ADR-0056 (an amendment of C2′, the per-change rule), with the Orchestrator's five guards. Owner question Q-3K-11. Recommended bundles: ABC-286 + ABC-288 over history, ABC-290 + ABC-293 over one attack map, and the pull after the second over E3b–E6

Architect/Design, task `arch-second-pull-1104`, records only, at `main` `fad72f17`. Nothing was run. Inputs: the owner's direction `orch-2026-10-30a` `…dda43b71` item 3, the `ABC-283` records (`…4c4cb03d`, `…6c6fb0be`, `…2409cec9`), `EPIC-011` § The per-change rule, `ADR-0056` C2′, and the backlog pages `ABC-284`–`ABC-298`.

## The rule, in brief (`ADR-0056` § "Dated 2026-11-04 (`arch-second-pull-1104`), PROPOSED: the bundle read")
- **B1, when a bundle is allowed.** Each part is value-changing and has its own ADR or design page. The parts must be related in at least one way:
  - (a) they share a file;
  - (b) they share a mechanism (one consumes another's output, or they share one computation and its cost);
  - (c) a part is parked or marginal and is coupled by (a) or (b).
  - **Not allowed:** value-identical parts; unrelated parts bundled to save host time; a part whose deep-depth bar is not graded in the bundle.
- **B2, what each part still shows alone:**
  - its own test-only off-door pair (`ADR-0026` d10) and its rule rows;
  - the all-off door node-identical to `main` (P0), with every older door turning all parts off;
  - its ADR's form, fixed before the build and never re-tuned;
  - its own measured bar where its ADR has one. Its own pay gate is graded unless the owner's word or its own named re-open trigger lifts it, and then it is reported. This is the guard on parts that only re-open a not-met premise.
  - **Cost rows** (`G2`, `G6`, `NFR-008`) are read with all parts on.
- **B3, safety rows:** the mate floor, zugzwang 7 / 7 and `G1` are read with all parts on. When one goes red, it is re-read with each part's own door, and the cause is named before any fix. A joint cause is a STOP. A fix is structural (`ABC-283`'s K3), never a re-pin, a deeper depth or a tune.
- **B4, the read:** one C2′ read, all parts on against the merge-base.
  - The PREREG is sealed first and names the parts, the SHAs, the intent and the bar.
  - The intent is GAIN unless every part is NEUTRAL (invisible at 100 ms).
  - The read is never re-played, no part is dropped and no subset is read.
  - Before the merge, `main` is merged in and the deterministic rows are re-read (`QE-283-i`'s form). Games are re-run only under C2′'s stale rule.
- **B5, credit:** credit goes to the bundle, not per part. It counts as one merge in `EPIC-011` G3 and as one suspect under C3″. No per-part Elo is stated. Each ADR is accepted as part of the bundle. Removing a part later is a value change with its own read.
- **B6, on a miss:**
  - NOT MET means nothing merges, and every part returns to its prior status. QE records a `failed-attempt`.
  - There is no re-play and no subset read. The same parts in the same forms count as the same bundle.
  - A part comes back only as a new attempt, alone or in a changed bundle under a new PREREG. A part that only re-opens a not-met premise needs the owner's word or its own trigger.
  - A red row before the read is a defect or a STOP, not a miss.
- **B7, who names a bundle:** the owner, while PROPOSED (reading (b)). After acceptance, the Architect's design note names it and shows B1's relation, BA/PM cuts one ticket in `ABC-283`'s form, and the Orchestrator orders it.

## Owner question `Q-3K-11` (the Orchestrator asks him)
"Accept `ADR-0056`'s PROPOSED section 'the bundle read' (dated 2026-11-04) as part of the per-change rule?"
- (a) Accept as written.
- (b) Accept with changes he names.
- (c) Decline. Bundles are then only by his word, case by case, as for `ABC-283`.
- **Default without an answer:** reading (b). It is used only for bundles he names.
- **A second, optional ask:** does he name bundle 1 (`ABC-286` + `ABC-288`) now, to run once `ABC-283` has merged?

## Recommended bundles, each with its reason
1. **`ABC-286` (P4) + `ABC-288` (O2c), over history, after `ABC-283` merges.**
   - Why: both act on the history-ordered quiet list, and O2c moves the order P4 prunes by.
   - They share `orderMoves` / `src/search.ts`, and P4 is the parked part. Its named trigger is the joint probe of `ADR-0063` decision 11.
   - The row to watch is the mate floor (`R-283-LMR`).
2. **`ABC-290` (E3b king attack) + `ABC-293` (E6 threats and tempo).**
   - Why: one attack-map pass pays for both, so its cost is read once.
   - Both land as structure at 0, and the pull after the second fits them.
3. **The pull after the second, over every structure-at-0 term on `main` at its fit (`ABC-290`–`ABC-293`).**
   - Why: the tuner fits them jointly anyway, in `ADR-0070` d7's form.
   - The rule adds the credit line and the per-part safety read: one part's weights at 0 inside `withParametersForTest`.
4. **Later, conditional: `ABC-272` (E7a) + `ABC-294` (E7b).**
   - Why: they share the scale seam, if `ABC-272`'s probe says E7a builds it.

**Kept apart, one line each:**
- `ABC-284` (P1): it moves LMR, the mate floor's lever (`R-283-LMR`).
- `ABC-285` (P5): its bar is deep-depth, and its value at 100 ms is about 0.
- `ABC-287` (P6): its re-measure comes first, and it failed safety rows alone.
- `ABC-289` (Q2): alone on `src/quiescence.ts`.
- `ABC-296` / `ABC-297` (X1 / X2): X2's probe comes first.
- `ABC-298` (V3): value-identical.
- `ABC-282` (W1): it has its own clock read.
- `ABC-301` (the second pull): its scope is owner-confirmed as it stands.

## Owed lines
- **BA/PM, `EPIC-011`:**
  - § The per-change rule: one pointer line, "2026-11-04: a bundle read is PROPOSED in `ADR-0056` (`Q-3K-11`, the owner's). While PROPOSED it applies only to bundles he names".
  - § Owner questions: add `Q-3K-11`.
- **BA/PM, ticket pages:** no change until a bundle is named. When it is, the bundle gets one ticket in `ABC-283`'s form, and the part pages get dated pointers.
- **Orchestrator:** ask `Q-3K-11` and the optional bundle-1 ask, and update the board.
