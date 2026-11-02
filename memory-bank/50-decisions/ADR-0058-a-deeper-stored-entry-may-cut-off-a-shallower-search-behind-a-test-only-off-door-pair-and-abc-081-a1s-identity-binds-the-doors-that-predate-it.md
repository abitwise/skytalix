---
kind: adr
id: ADR-0058
---
# ADR-0058: A deeper stored entry may cut off a shallower search, behind a test-only off-door pair. `ABC-081` `A1`'s identity binds the doors that predate it

## Status

**ACCEPTED, NOT IN FORCE on `main`** 2026-11-02 by the owner. Recorded by Architect/Design (task
`arch-owner-answers-1102`, records only, on `grugops/arch-owner-answers-1102` from `main` `7daf8086`). Nothing was
run.

- **His word, verbatim** (`orch-2026-10-30a` `…81ae2db4`): *"A accept"*. The Orchestrator's reading: "accepted, not in
  force — switched on only if `ABC-257` (T1 + T3) meets A8′ ≤ 0.93×".
- **On `main` today:** `tableCutoff` stays exact-depth (`src/transposition.ts:163`), as before. `ABC-238` stays
  closed unmerged; its code `3abaefdd` is kept.
- **The one switch-on path:** `ABC-257` (T1 with the table kept across the moves of a game). It carries decisions 1–7
  and the doors. This ADR comes into force at `ABC-257`'s merge, and only if:
  - A8′ is met: ≤ 0.93× pooled over searches 2–9 on the held-out lines, no game above 1.00× (`ABC-257` page,
    pre-registered in `arch-phase1-replan` `…64e95bfa` item 3); and
  - its game read passes (C2′ and S′, and the Levels deep lane, as the page states).
  A miss on A8′ closes `ABC-257` and ends the strand. This ADR then stays accepted, not in force, with no further
  line owed.
- **Decision 9's read is `ABC-238`'s and lapses with it.** `ABC-257`'s page holds its own read. Decision 8 (the
  revision of `ABC-081` `A1`) applies only when this ADR comes into force.
- **When `ABC-257` may run:** it stays paused under the owner's *"P yes"* (the Phase 1 TT strand paused, pruning
  first). Its old trigger, the C2′ NEUTRAL-bar question, is now answered (*"C yes"*, `ADR-0056` D5 C2′ dated line).
  So the pause is the only thing holding it. Lifting it is the Orchestrator's call within *"P"*.
- **If the shared table of `ADR-0057` lands first,** decisions 1–7 port to the new layout unchanged. The rule is the
  hit test (a stored depth at least the remaining depth, in place of exactly equal), not the layout. `ABC-257`'s design re-reads the doors on
  that base.

*2026-11-02:* **F4 fired; still PROPOSED, pending the owner.** Written by Architect/Design (task `arch-phase1-replan`,
records only, on `grugops/arch-phase1-replan` from `grugops/ABC-238` `772153a7`). The measurements were taken on
scratch patches outside the repository, and nothing was committed to `src/`.
- **What fired:** `ABC-238` built the rule correctly (`se-ABC-238` `…3beb1ada`). At fixed depth 8, `search()` read
  0.9939× on kiwipete and 0.9958× on position-6, against a bar of ≤ 0.95× (`…db17e44b`). `ABC-238` does not merge.
  F4 is not loosened.
- **Why (measured, `arch-phase1-replan` notes):** a deeper entry for the probed key exists on only 0.29 % of probes
  (depth 6, the 190). Eviction loses almost none of them, so the Context section's three sources do not produce
  deeper entries at a useful rate. Every source searches shallow first.
  - At depth 6, 65–80 % of deeper cuts come from LMR transpositions and 20–35 % from transpositions across plies.
  - Null move adds deeper cuts only at depth 8.
- **On the owner's word:** if he accepts, this ADR reads **"accepted, not in force on `main`"**, as § Status already
  provides. If he declines, it is withdrawn.
  - **The Architect recommends accepting.** Decision 7's derivation and the built doors are the base of the paused
    combined attempt (T1 with the table kept across moves).
  - That attempt's bar is pre-registered in decision `…64e95bfa` of `arch-phase1-replan`, and its premise was measured at
    about 0.90× there. The Phase 1 TT strand is paused.

**PROPOSED** 2026-11-01 by Architect/Design. Task `arch-epic011-phase1`, records only, at `main` `13627d0f`. Nothing
was run, built or timed.

- **Acceptance is the owner's.** Under the 2026-10-22 delegation, a new ADR is still his call
  (`memory-bank/45-standing-rulings.md`). `ADR-0056` (accepted in direction) lists this ADR as T1's dependency
  ("revises `ABC-081` `A1`", D2 row T1). That acceptance covers the direction, not this text.
- **The answer that settles it:** *"accept ADR-0058"* or *"decline it"*.
- **Reading (b)**, the `ABC-208` / `ABC-209` precedent (`…d25ab770`, `…e496fc70`):
  - the build of `ABC-238` and its gates may proceed while this ADR is PROPOSED;
  - the read `ABC-238` owes (decision 9) and the merge wait on his acceptance. That way no host hour is spent on a
    read that a decline would discard.
- **Default without an answer:** `tableCutoff` stays exact-depth, and `ABC-238` does not merge.
- **If `ABC-238` does not merge** (the read is NOT MET, or a falsifier fires), a dated line here records "accepted, not
  in force on `main`", as `ADR-0026` decision 9 does.
- **What this ADR revises:** `ABC-081` `A1`, a ticket criterion (decision 8). It amends no ADR. `ADR-0025` is untouched
  here. The replacement policy, T2, is `ADR-0025`'s own amendment of the same date. This ADR follows `ADR-0026`
  decision 10 and `ADR-0050`'s form, and cites them rather than restating them.

## Context

- **Today's rule.** `src/transposition.ts:163`, `if (entryDepth(slot) !== depth) return null;`. An entry settles a
  node only at the remaining depth it was searched to. The doc comment at `:150-155` gives the reason: "`ABC-081` `A1`
  requires the table to change the work and never the value".
- **Why it was left that way.** `ABC-081`'s delivery note says "`stored ≥ needed` measured identical in the middlegame
  and is left unpulled". That was measured before PVS/LMR (`ABC-121`) and null move (`ABC-208`).
  - In that fixed-depth, unreduced search, one position met at two remaining depths needed a transposition across
    plies. That is rare, so the measurement read identical.
  - It says nothing about today's search.
- **What changed: today one key meets many remaining depths in a single search.**
  - A null-move child is searched at `depth − 4` (R = 3, from remaining depth 2; `ADR-0050`).
  - A late quiet move is searched one ply shallower first, then re-searched at full depth on a fail-high (`ADR-0026`
    decision 6).
  - Iterative deepening (`src/engine.ts` `deepen`) keeps every entry of iterations `1 … d−1` while it runs iteration
    `d`. An entry stored at ply `p` in iteration `d−1` is deeper than a probe of the same key at ply `p' ≥ p + 2` in
    iteration `d`.
  - Each of these produces "a deeper entry exists, but it cannot be used". `search()` is a single fixed-depth call, so
    it has the first two sources only. `chooseMove` has all three.
- **`A1` is already a property of the doors, not of the shipped path.** `ADR-0026` decisions 4 and 7 (amended
  2026-09-26, `ruling-abc121-g6`) re-pointed `A1`'s rows to `searchWithoutPvsOrReductions` against `searchWithoutTable`.
  On the shipped path the table already changes values through the hash move under LMR: `knight-g1 w -` reads 820 →
  830 at depth 4 (`src/transposition.test.ts:341-358`). So the rule this ADR revises already holds only below the
  `ABC-121` rung.
- **The expected value.** `ADR-0056` D2 row T1 estimates +15–40 Elo (judgement, not a reading), at size M and medium
  risk. That row calls it "the cheapest real gap in the search".
- **The inputs read:** `EPIC-011` (Phase 1, § The per-change rule, § Risks); `ADR-0056` D2, D5 (C2′, S′, R-TC), D6;
  `ADR-0025`; `ADR-0026` decisions 2–10; `ADR-0050` decisions 1–8; `ADR-0054` decision 3; `ABC-081` `A1`/`A4`/`A5` and
  its delivery note; `ABC-238`, `ABC-237`, `ABC-257`, `ABC-258`; SA `sa-ideas-verify` `…306a4012` row 9c;
  `qe-tc-depth-probe` `…1889e3b0`; and on `main` `13627d0f`: `src/transposition.ts`, `src/search.ts`
  (`negamax` `:430-552`, `searchMove` `:570-648`, `searchRoot` `:655-724`), `src/engine.ts` (`repeatsBeforeRoot`
  `:342-358`, `negamax` `:369-468`, `deepen` `:698-760`).

## Decision

1. **The rule.** With the switch of decision 2 on, a table entry settles a node when **its stored depth is at least the
   requested remaining depth**. The bound rules are unchanged:
   - an exact entry returns its score;
   - a lower bound returns its score when the score is at least beta;
   - an upper bound returns its score when the score is at most alpha;
   - the returned score is the stored one, restored to the probing ply (fail-soft, as today).

   A shallower entry still never settles a node. **Nothing else moves:**
   - **The root still never cuts.** It probes for the hash move only, so a root with a legal move always returns one.
   - **The order of authority at node entry stays as it is,** in both recursions: the in-path repetition, then (in
     `src/engine.ts`) the pre-root repetition, then the leaf and capacity guard, then the probe.
   - Quiescence neither probes nor stores (`ADR-0025` decision 5).
   - `storeEntry` is not touched here. Replacement is T2, under `ADR-0025`'s amendment.
2. **One switch, `deeperCutoffs`, in BOTH recursions.**
   - It goes in `src/search.ts`'s `Switches` and in `src/engine.ts`'s `Heuristics`, and it is on in `search()` and
     `chooseMove`.
   - It reaches `tableCutoff` as an argument. That means no module-level state, no `EngineOptions` field and no
     options parameter on `search()` (`ADR-0026` decision 2's rejections).
   - The name is the Engineer's. The behaviour is not.
3. **Two TEST-ONLY doors: `searchWithoutDeeperCutoffs(position, depth)` and
   `chooseMoveWithoutDeeperCutoffs(position, options)`.**
   - Each is the shipped path with `deeperCutoffs` off and everything else on. So each is the pre-`ABC-238` `search()`
     or `chooseMove`, node for node (`ABC-238` `A1`).
   - The engine door takes no depth (`ABC-078` `A4`).
   - The export lists of `ABC-077` `A6` and `ABC-078` `A4` grow by these two names.
4. **Every door that exists before `ABC-238` turns `deeperCutoffs` off.** This is `ADR-0026` decision 3's ladder rule.
   So each of these reads exactly as it does today:
   - `ABC-081` `A1`'s rows (`searchWithoutPvsOrReductions` against `searchWithoutTable`);
   - `ABC-077` `A1` and `ABC-078` `A3` (the `…WithoutReductions` pair);
   - `searchWithoutNullMove` / `chooseMoveWithoutNullMove`;
   - the `ABC-228` / `ABC-229` doors;
   - every older door.
5. **Rows. `ADR-0050` decision 4's form, by reference:**
   - **Re-point.** Every row whose shipped side is `search()` or `chooseMove` and whose other side is an older door
     re-points its shipped side to the new door of the same recursion. Examples:
     - `ADR-0050` decision 8's d5 drift and its same-depth mate floor;
     - the `ABC-228` / `ABC-229` drift rows;
     - any `ABC-230` row that compares `chooseMove` with a door.

     Because the new door is the pre-ticket shipped search, these rows read their pre-ticket figures. No bound moves.
     Without the re-point, they would measure their own heuristic plus T1.
   - **Value and behaviour rows on the shipped path stay there.** A row that moves is re-pinned, with the old and new
     figure recorded in the PR (`ADR-0026` decision 7 as amended).
   - **The `ABC-249` row** (`src/engine.test.ts:1707`, Ke1 404 / Kg1 497 at fixed depth 4) follows `ABC-238` test
     note 2, word for word.
   - **The PR lists every re-pointed row and every re-pinned row.** The review checks the list against a grep for
     `search(` and `chooseMove(` beside a door name.
6. **The bounded oracle (`ABC-238` `A3`), in BOTH recursions.**
   - **Drift at depth 5 on `ABC-121`'s 190:**
     - `search()` against `searchWithoutDeeperCutoffs` at fixed depth 5;
     - `chooseMove` against `chooseMoveWithoutDeeperCutoffs`, each iterated to depth 5 (`maxDepth: 5` on a clock that
       does not expire).
     - The bar: **at least 95 % of non-mate positions within 25 cp, and 0 mate scores change sign.**
     - **The largest drift is a report, not a bar.** A deeper entry legitimately reports what a deeper search saw, so a
       cap would red a correct build. Its size is `UNKNOWN - verify` until the build measures it.
   - **A sign floor on the 287 mate corpus (`src/search.mate-corpus.ts`) at depth 5.** For every position the door
     scores as a mate, the shipped search scores a mate of the same sign. The mate distance is reported, not barred:
     LMR already breaks depth monotonicity (`ADR-0026` decision 9). Deep lane (`SEARCH_DEEP=1`).
   - **Scope, said plainly: this oracle is a regression net, not a proof.** The rule's correctness rests on:
     - the predicate rows at the table: `ABC-238` `A2`, plus each bound against each side of the window with the
       switch on and off;
     - decision 7's argument.

     Do not tighten 25 cp to chase rule bugs.
7. **Value safety: why a deeper entry is a sound answer to a shallower question.** This is a derivation, not a
   measurement.
   - **Bounds.** A deeper search's exact score, lower bound or upper bound is at least as well-informed an estimate as
     the shallower search would produce. Alpha-beta needs only that a returned score respects the bound it claims
     against the window it is used in, and the bound rules of decision 1 are exactly today's.
     - Fail-soft is kept. A lower bound at or above beta, or an upper bound at or below alpha, is returned as stored.
       It is not clamped to the window, so the parent sees the same kind of value as today.
     - **Search instability is the accepted cost.** With fail-soft, a null-window search can fail high and the
       full-window re-search can then return at most alpha. `searchMove` (`src/search.ts:604-646`, and the engine's
       copy) keeps the re-search's score, so the node stays well-defined.
   - **Mate scores.** A mate is stored as its distance from the node and restored at the probing ply (`ADR-0025`
     decision 3, `ABC-081` `A4`). So a mate found by a deeper search reads, at any ply, as the right distance from that
     search's root.
     - It may report a mate longer than the current iteration's depth. That is correct: a mate the deeper search
       proved is a mate.
     - **Bounded.** The restored distance is at most the probing ply (≤ `KEY_ARRAY_CAPACITY` 128) plus the stored
       depth (≤ 128) plus `QUIESCENCE_MAX_PLY` (8): 264 plies. That is far inside the 10 000-point gap between
       `MATE_SCORE` (30 000) and `MATE_FLOOR` (20 000). So a restored mate is always still classified as a mate
       (`src/transposition.ts:56-64`).
     - The null move returns beta and stores nothing (`ADR-0050` decision 7). That is unchanged, so no "mate after a
       pass" enters the table.
   - **In-tree repetition and the 75-move leaf (graph history).** The key excludes the path and the halfmove clock. So
     an entry whose subtree met an in-path repetition, or a 75-move leaf, carries a value that depends on how that
     subtree was reached.
     - `ADR-0025` § Consequences accepted this as "the standard accepted inaccuracy". T1 reuses entries more often, so
       this inaccuracy can now reach a node through a shallower probe as well. It is the same class of error, not a
       new one.
     - A node that is itself a repetition is still scored 0 before the probe (decision 1's order). The table never
       overrides a draw at the node where it stands.
   - **The pre-root repetition scan (`ADR-0054` decision 3; `src/engine.ts:342-358`).** It adds no new path dependence
     on a path without a null move.
     - A position can equal a key before the root only if every move from the root to it was reversible, so its
       halfmove clock is the root's clock plus its ply. The scan's lower edge, `max(ply − halfmoveClock,
       −min(prior.length, 100))`, is then the same for every such path.
     - Its start index depends only on the ply's parity for ply ≥ 2, and the side to move, which the key holds, fixes
       that parity.
     - Within one search, with the table cleared per search (`ADR-0025` decision 4) and the prior keys fixed for that
       search, "stood twice before the root" is a function of the key alone. An entry whose subtree scored such a
       draw is valid at every node with that key.
     - Across a null move the scan reads nothing, because the pass resets the halfmove clock (`ADR-0050` decision 7).
       That split is path-dependent. It falls in the graph-history class above.
     - This argument holds **within one search only**. `ABC-257` (the table kept across moves) must re-derive it,
       because there the prior keys grow between searches (Consequences).
   - **The abort.** An aborted subtree throws past its store (`src/engine.ts:464-466`), so no partial result is ever
     stored, and no partial result can be reused deeper or shallower.
   - **The depth field.** 13 bits (≤ 8 191), unchanged. Remaining depth is bounded by `KEY_ARRAY_CAPACITY`.
8. **`ABC-081` `A1`, as revised.** *"`A1` (the table changes work, not value) holds for the exact-depth table. With
   deeper cutoffs off, a table-on search scores identically to the table-off search: the perft corpus at depth 4, on
   the doors that predate `ABC-121`, as today. With deeper cutoffs on (`ABC-238`, `ADR-0058`), a deeper stored entry
   may change a value. That change is judged by `ADR-0058` decision 6's bounded oracle and by `ADR-0056` C2′, never
   by identity."*
   - The rows under `A1` do not change (decision 4).
   - Writing the dated line on the `ABC-081` page is BA/PM's job. This ADR is the authority for it.
9. **The read `ABC-238` owes (`ADR-0056` D5, as folded).**
   - **Intent: GAIN.** T1 is meant to make the engine stronger. C2′ reserves NEUTRAL for correctness fixes and
     simplifications.
   - **C2′:** 100 games at 100 ms, the candidate head rebased on `main` against its merge-base, openings 1–50 with both
     colours, one game at a time, through `ABC-255`.
     - It passes on 100 of 100 games complete, 0 faults, 0 losses on time at the 50 ms margin, and **≥ 50.0 of 100**.
     - A miss is NOT MET and is not re-played.
   - **S′:** 10 games at 0.5 s against Stockfish 19 at E 1 650.
     - The command: `r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`.
     - It passes on 10 of 10 games complete, 0 faults, 0 losses on time, and ≥ 3.0 of 10. Below that, 10 more games
       are played and the bar is ≥ 7.0 of 20. The upward re-pin rule of `EPIC-011`'s 2026-11-01 block applies.
   - **The Levels deep lane** on the candidate head, with the host alone. It passes on exit 0 with every test passed,
     and QE counts its own run.
     - `ADR-0056`'s "41" is stale: `EPIC-010`'s close read it as 57/57. `arch-adr0057-fix` is refreshing that figure.
   - **R-TC part 1, item 2, read at review.** The diff adds no read of the budget, the deadline, `movetime` or the
     environment. T1 is keyed on search state only (depth and the table), which R-TC allows.
   - **What 100 ms can see: T1 fires there. It is not depth-gated.**
     - It acts at any remaining depth ≥ 1 where a deeper entry exists.
     - At the 100 ms median of depth 6 (5 cold; kiwipete 3–4), all three sources of the Context section are live:
       null move from remaining depth 2, LMR from 3, and cross-ply and cross-iteration transpositions from depth 2.
     - `ADR-0056` C2′ already lists T1 among the rows that fire at 100 ms.
     - **The firing rate is `UNKNOWN - verify`.** The build reports it as a test-side count, not a production counter:
       the share of probes at depth 6 on `ABC-121`'s 190 that a deeper entry settles. The instrument is the
       call-through `vi.mock` of `src/transposition.ts` that `hitRate` already uses.
     - **The Architect's line:** if that share is under 1 in 100, QE reports the 100-game read with that limit stated,
       as C2′'s depth-gated rule asks. It is a report, not a bar.

## What would falsify this

| # | clause | what would falsify it | how to check | if it fires |
|---|---|---|---|---|
| **F1** | 1, 7 — bounds | the drift bar (≥ 95 % within 25 cp) red in either recursion | decision 6, `ABC-238` `A3` | a defect, back to the Engineer; a rule that is still red after the fix is NOT MET, and the first fallback is decision 1 restricted to null-window nodes, as a new attempt (§ Alternatives) |
| **F2** | 7 — mate scores | any mate score changing sign on the 190, or a door-mate becoming a non-mate or an opposite mate on the 287, at depth 5 | decision 6 | a defect (the ply adjustment or the bound applied to a mate) |
| **F3** | 1, 7 — order of authority | an in-path or pre-root repetition row red on the shipped path that no re-pin under decision 5 explains; or the probe moved above either repetition check | `ABC-081` `A5`, `ABC-230`, `ABC-249` rows; the review reads the order in both `negamax` | a defect |
| **F4** | the premise — it pays | at fixed depth 8, nodes above **0.95 ×** the door's on kiwipete or on position-6; or `G6` below base | `ABC-238` `A4` | `ABC-238` not merged; this ADR "accepted, not in force" |
| **F5** | the premise — strength | C2′ NOT MET (< 50.0 of 100), or an S′ collapse | decision 9 | the same as F4 |
| **F6** | 3 — the door | either door not node-for-node equal to the pre-ticket shipped search on the `ABC-078` `A3` corpus | `ABC-238` `A1` (`G4`) | a defect in the door or the switch wiring |

## Alternatives

- **Keep the exact-depth rule.** Rejected. It is the cheapest real gap in the search (`ADR-0056` D2), and the
  measurement that left it unpulled predates the three sources of deeper entries.
- **Deeper cutoffs on exact entries only, never on bounds.** Rejected. Most table cutoffs fall on null-window nodes,
  where entries are bounds. The restriction would add a rule that no evidence asks for.
- **Deeper cutoffs at null-window nodes only (no cutoff at PV nodes),** a common engine choice that keeps the PV whole
  and narrows graph-history exposure. **Not taken now; kept as the first fallback.**
  - Today's exact-depth table already cuts at PV nodes. Changing that is a second rule.
  - Nothing here reports a PV beyond the root move.
  - If F1 fires on a correct predicate, this is the next attempt.
- **Amend `ADR-0025` instead of writing a new ADR.** Rejected. `ADR-0025`'s decisions do not hold the exact-depth rule.
  `ABC-081` `A1` and the code comment hold it. The change is a value rule over a ticket criterion, with an off-door
  pair under `ADR-0026` decision 10, which is why null move got its own id (`ADR-0050`).
- **One door, in `src/search.ts` only.** Rejected. The engine's iterative deepening is the source that `search()` lacks
  (cross-iteration entries), so the engine recursion needs its own door and its own drift row.
- **A production counter of deeper cutoffs.** Rejected. That would be product code for a measurement. The test-side
  `vi.mock` instrument already exists.

## Consequences

- **NFRs.**
  - `NFR-005`: `A4` and `G6`, which this change is expected to help.
  - `NFR-009`: unchanged. No array is added, and `tableByteLength()` stays 4 194 304.
  - `NFR-004`: untouched. No time code moves.
  - `NFR-008`: the new default-lane rows are table-level units. The oracle rows go in `SEARCH_DEEP` / `ENGINE_DEEP`.
  - No new NFR file. `plans/nfr-catalog.md` is untouched.
- **Source comments to rewrite in the build:**
  - `src/transposition.ts:150-155` (the "never a deeper one" sentence);
  - the `describe` title "cutoffs only at the stored depth" in `src/transposition.test.ts:239`. That row stays, as the
    door's behaviour.
  - `src/search.ts`'s header names the switches; it gains this one.
- **`ADR-0057` coupling (named, not decided).**
  - Under a shared table, a deeper entry written by another worker is what Lazy SMP lives on. So T1 is a precondition
    for threads to pay, which agrees with `ADR-0057`'s "after phase 1".
  - T1 is layout-neutral. It reads the 13-bit depth that `ADR-0057` D2.3's word 2 keeps as today's packing.
  - The key layout does not matter to T1. `ABC-253` was dropped (`qe-ABC-263` G1), so `ABC-238`'s line "`ABC-253`
    changes the TT keys first" is stale. T1 is written against today's `BigUint64Array` key column.
- **`ABC-257` coupling (named, not decided).** Decision 7's pre-root argument holds within one search only.
  - With the table kept across moves, the prior keys grow between searches. A key that stood once before the root
    when its ancestors were stored can stand twice at the next move.
  - Under T1 a deeper entry from an earlier move can now cut, where under exact depth it mostly could not. The
    2026-10-26 `ADR-0025` decision 4 amendment says "an entry cuts only at its exact stored depth … a stale entry is
    therefore never wrong, only possibly useless". That sentence is false once T1 lands.
  - `ABC-257`'s design owes both re-reads.
- **`ABC-236` (aspiration windows) coupling.** Deeper cutoffs under fail-soft make the instability of decision 7 more
  frequent. Aspiration's fail-high / fail-low re-search must tolerate a fail-high followed by a fail-low.
- **`ABC-249` test note 2 / QE-249-b.** T1 changes neither how a pre-root draw is scored (0, before the probe) nor how
  it is stored (it is not; the node returns before the store). So QE-249-b's "adds one" condition is not triggered by
  T1. The row's figures may still move under the reuse; test note 2 governs that.
- **Migration:** none. No data, format or option changes.

## Rollback

- **Before acceptance:** mark this ADR `withdrawn`. Nothing else was edited.
- **After it ships:** set `deeperCutoffs` to false in `search()` and `chooseMove`, two booleans. The shipped path is
  then node for node the door. Deleting the switch, the two doors and the re-points afterwards is a mechanical revert
  of one ticket. No data or format is involved.
