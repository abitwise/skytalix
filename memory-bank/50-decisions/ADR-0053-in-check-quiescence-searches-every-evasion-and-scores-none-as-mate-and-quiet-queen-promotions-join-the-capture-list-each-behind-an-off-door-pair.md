---
kind: adr
id: ADR-0053
---
# ADR-0053: In check, quiescence searches every legal evasion and scores no evasion as mate; quiet queen promotions join the capture list. Each change gets its own off-door pair, and together they amend `ADR-0024` decision 4

## Status

**PROPOSED** 2026-10-29 by Architect/Design (task `arch-ABC-228-adr`, records plus probes, at `main` `95f7369e`, whose
`src/` equals `38536a34`'s).

- **Acceptance is the owner's.** The standing ruling of 2026-10-22 (`…5aaf7cec` item 3,
  `memory-bank/45-standing-rulings.md`) keeps "a new ADR, or one that changes or reverses an accepted one" with him.
  `ADR-0024` was accepted by the owner on 2026-09-19. This ADR strikes two of the four items in its decision 4. The
  Orchestrator may not accept it under the delegation. `ABC-228` `A7` also asks for the report to the owner.
- **One owner question goes with it: `OQ-228-1`** (decision 10). The `G6` "≥ base" reading is graded on his word
  (`…2ae5fc12`), and this design is forecast to miss it on `position-6`.
- **The design and the build may proceed** behind the doors, as with `ADR-0051`. The smokes and the merge wait on his
  acceptance and on his answer to `OQ-228-1`. No agent marks this ADR accepted.
- **What it amends.** It amends `ADR-0024` decision 4 only. It strikes "checks in quiescence", as far as evasions from
  check go, and "quiet promotions", for promotions to a queen only. Delta pruning and SEE stay out. `ADR-0024`
  decisions 1–3 and 5–7 are untouched. `ADR-0024`'s text is not edited here. On acceptance, an Architect/Design hop adds
  a dated line to its decision 4 that points here. Until then `ADR-0024` reads as written, and `main` keeps it.
- It supersedes the recorded decision in `src/quiescence.ts:21-24` ("Not here … no terminal detection") for those two
  items and for mate in check. Stalemate stays undetected (`EPIC-010` § Out of scope).
- It follows `ADR-0026` decision 10 (a switch, a pair of doors, off in every older door, a bounded oracle). It cites
  `ADR-0050` and `ADR-0051` as precedents and amends neither. No `ADR-0026` level and no NFR bound moves.
- Built by `ABC-228` (decisions 1–4, 6–9) and then `ABC-229` (decisions 5–8). No code changes because of this ADR.
- The probes ran on scratch copies of `main`'s `src/`, never on `src/`. Every count is on a frozen clock and is
  deterministic. CPU seconds are indicative only (load1 4–10, two sibling builds live). The probe scripts, their
  output and the instrumentation diff are in `.grugops/context/arch-ABC-228-adr/raw/`.

## Context

- **The gap** (SA `sa-ideas-verify/…306a4012`, rows 1b–1d). `quiesce` stands pat first, also in check
  (`src/quiescence.ts:100-101`). It searches captures only (`src/legal.ts:90-103`).
  - Q1 (Qxf7 mates): `quiesce` reads 78, not a mate score.
  - Q2 (in check, only quiet king evasions): `quiesce` reads −548, the static score.
  - Q3 (a7–a8 is free): `quiesce` reads 212, the static score.
- **The fence.** `ADR-0024` decision 4 keeps "checks in quiescence" and "quiet promotions" out. `ABC-079`'s header
  records "no terminal detection" in quiescence.
- **The nearest prior.** `ABC-210` added one full-width ply at a horizon node in check (`ADR-0051`). It read NEUTRAL
  −4.78 ± 16.21 over 800 games and closed unmerged. `ADR-0051` is accepted, not in force. It also rejected form (b),
  quiet checks at the first quiescence ply.

### What the probe found

The probe is a reference build of the rule in decision 2 on a scratch copy (`raw/probe-instrumentation.diff`). With
every knob off it equals base: 10 of 10 node- and score-equal searches (five roots, depths 3 and 4).

**1. The rule fixes the three SA rows** (`raw/probe1.txt`).

| row | static | base | evasions | evasions + quiet queen promotions |
|---|---:|---:|---:|---:|
| Q1 capture-mate | −36 | 78 | **29 999** | 29 999 |
| Q2 in check, quiet evasion only | −548 | −548 | **−536** | −536 |
| Q3 quiet promotion | 212 | 212 | 212 | **977** |

**2. Node growth, `search(position, 6).nodes`, against base** (`raw/probe1.txt`, `raw/probe3.txt`,
`raw/probe4.txt`).

| variant | kiwipete | position-6 |
|---|---:|---:|
| base | 237 007 | 109 912 |
| evasions at every quiescence ply, cap 8 (**the design**) | 324 162 (**1.368×**) | 154 464 (**1.405×**) |
| evasions at quiescence ply 0 only (the leaf in check) | 1.054× | 1.013× |
| evasions at quiescence ply ≥ 1 only | 1.283× | 1.416× |
| evasions below quiescence ply 2, mate test beyond | 1.171× | 1.183× |
| evasions below quiescence ply 3, mate test beyond | 1.188× | 1.459× |
| mate test only (in check and no legal move: mate; otherwise stand pat) | 0.999× | 1.000× |
| quiet queen promotions only | 1.014× | 1.000× |
| quiet queen promotions only, ordered after every capture | 1.005× | 1.000× |
| quiet promotions to every piece | 1.032× | 1.000× |
| the design plus quiet queen promotions | 1.394× | 1.405× |

- **Where the cost sits.** Of the evasion nodes at depth 6, 19 186 of 23 061 (kiwipete) and 15 546 of 16 656
  (position-6) sit at quiescence ply 1 or deeper. They are in check after a capture inside the sequence.
- **The ply-0 slice is `ABC-210`'s tree in quiescence form.** Alone it reads 1.054× and 1.013×, against
  `ADR-0051`'s 1.054× and 1.007×. The largest d5 drift lands on the same position as `ADR-0051`'s (finding 5).

**3. The cap of 8 stays a guard** (`raw/probe5.txt`). With evasions, lifting `QUIESCENCE_MAX_PLY` reads:

| cap | kiwipete | position-6 |
|---|---:|---:|
| 8 | 324 162 | 154 464 |
| 16 | 431 201 | 162 323 |
| 64 | 438 961 | 162 348 |

The tree converges by cap 16, so it does not explode. The cap binds harder on kiwipete than without evasions
(1.35× against 1.12× for base at cap 64). Its binding is recorded here as `ADR-0024` decision 5 asks.

**4. The `G6` forecast** (`raw/probe2.txt`, `raw/probe3.txt`). `chooseMove` on a frozen clock to base's `G6` depth.
`G6`'s base figures come from QE `qe-epic008-close/…ffb593fe`, at `38536a34`, whose `src/` is `main`'s. That reading
had kiwipete at depth 8 ×5, with a median of 1 810 285 nodes in 3 s. It had position-6 at depth 10 ×5, with a median
of 1 878 626 nodes.

| board, depth | base nodes | design nodes | design / base's 3 s node median |
|---|---:|---:|---:|
| kiwipete, 8 | 1 259 463 (70 % of 1 810 285) | 1 543 477 (1.226×) | 85 % |
| position-6, 10 | 1 765 861 (94 % of 1 878 626) | 2 340 431 (1.325×) | **125 %** |

- CPU per node rises about 9 % on both boards (1.34× and 1.45× CPU at 1.23× and 1.33× nodes; indicative).
- **So `position-6` is forecast to complete depth 9, not 10, at 3 s: `G6` "≥ base" NOT MET.** Kiwipete is forecast
  to hold depth 8 at about 93 % of its budget (`UNKNOWN - verify`).
- **No evasion form clears it.** The capped form needs 2 107 260 nodes (112 %). Only the mate-test-only form fits
  (1 768 881, 94 %).
- **`ABC-235` can change this.** It lands first (value-identical speed-ups), so it is in `ABC-228`'s base. Head
  reaches depth 10 at 3 s only if the node rate rises about 36 % (2 340 431 × 1.09 against 1 878 626). Base would
  still stop at 10, because its depth 11 needs far more nodes.
- `ABC-235`'s three cuts bound 27–34 % of self time combined, which is up to about 1.5× in rate. Those are ceilings,
  not speed-ups (`arch-ABC-235/…7fc1b90c`). So whether the miss survives `ABC-235` is `UNKNOWN - verify`. Decision 9
  re-reads the forecast on `ABC-228`'s own base.

**5. The bounded oracle, measured on `search()` only** (`raw/probe5.txt`, `raw/probe6.txt`, `raw/probe8.txt`).

- **Evasions, d5 drift on `ABC-121`'s 190, against the door:** 89.30 % of 187 non-mate positions within 25 cp. The
  maximum is 118 cp, at position-4/f1f2 (708 → 826); `ADR-0051` read 708 → 824 there. p95 is 53 cp. There are 0
  mate-status flips, and 7 root moves differ.
- **Evasions, same-depth mate floor on the 287 at depth 5:** 189 door mates. All 189 hold, with the same sign and no
  longer. There are 0 new mates.
- **Quiet queen promotions over evasions, d5 drift on the 190:** 100 % within 25 cp, maximum 8 cp, 0 flips.

**6. Pins on the shipped path** (`raw/probe6.txt`, `raw/probe7.txt`).

- **`ABC-081` `A5`, "the fixture bites" (`src/transposition.test.ts:514-517`):** `search(REPEATS_AT_PLY_4, 3)` reads
  **−392**, not −485. Depth 2 reads −502 and depth 4 reads 0, both unchanged. The row's premise holds: at depth 3 the
  repetition is past the horizon, and the material deficit shows.
- **`ADR-0050` decision 9's seven zugzwang rows: all hold**, under evasions and under evasions plus promotions, each at
  its own depth.
- `searchWithoutPvsOrReductions(REPEATS_AT_PLY_4, 4).nodes` (7 295) is a door row, so it does not move (decision 6).
- The default lane was not run here. Every other pin is `UNKNOWN - verify` (Consequences).

## Decision

1. **The amendment.** `ADR-0024` decision 4 now reads: "Still out of scope: delta pruning, SEE, quiet checks in
   quiescence, quiet under-promotions, and stalemate detection." Evasions from check and quiet promotions to a queen
   are in, by decisions 2–5. `ABC-210`'s form (b), quiet checking moves, stays out (`ADR-0051`).

2. **The evasion rule (`ABC-228`).** At a quiescence node with `qply < QUIESCENCE_MAX_PLY` and the side to move in
   check:
   - **No stand pat.** The static evaluation is neither a bound nor a cutoff there.
   - **Every legal move is searched.** In check, every legal move is an evasion. The list is `legalMoves(position)`,
     with under-promotions and quiet moves included and no filter.
   - **Order:** the stable sort by `mvvLvaKey` that captures already use (`ADR-0024` decision 2). Capturing evasions
     come first, by victim. Quiet evasions follow, by the key's attacker term, so king moves (valued 0) lead. Equal
     keys keep generation order. The probe used this order.
   - **Fail-soft alpha-beta**, in the convention `quiesce` already has. The best score starts below every real score,
     and alpha is raised only by searched moves.
   - Each child is `quiesce` at `qply + 1`, so it is counted by `visit` like any quiescence node. A child out of check
     takes the existing path: stand pat, then captures.
   - The test is `isInCheck(position)` at node entry, made only when `qply < QUIESCENCE_MAX_PLY`.

3. **The mate score.** In check with no legal move, `quiesce` returns `−(MATE_SCORE − (ply + qply))`. Here `ply` is
   the leaf's distance from the root.
   - `quiesce` gains a `ply` argument. Both recursions pass the leaf's `ply`; a direct test call passes 0.
   - At `qply` 0 this equals `leafScore`'s own mate score, so mate distances agree across the leaf boundary. At `qply`
     0 the leaf has already ruled mate out (`leafEndReason`), so the case arises at `qply ≥ 1` or on a direct call.
   - **`MATE_SCORE` moves its definition to `src/quiescence.ts`**, the lowest module that now scores a mate.
     `src/search.ts` re-exports the same name, so no importer and no export-list row changes. Importing it from
     `src/search.ts` would close an import cycle.
   - The table's `MATE_FLOOR` (20 000) still separates mates: the deepest mate is now
     `KEY_ARRAY_CAPACITY + QUIESCENCE_MAX_PLY` = 136 plies. Its comment is corrected to say so.

4. **The bound.** `QUIESCENCE_MAX_PLY` (8) stays the only bound and stays a runaway guard. An evasion node counts toward
   it like a capture node.
   - **At the cap a node stands pat, in check or not.** That is the pre-ticket behaviour, so the guard degrades to the
     old horizon and never to something worse.
   - No separate check-evasion cap. A lower cap is a budget in disguise (`ADR-0024` § Context, finding 2). It also
     changes the value (kiwipete d8: −84 capped against −59 uncapped) and still misses the `G6` forecast
     (Alternatives).

5. **The quiet-promotion rule (`ABC-229`).** Out of check, quiescence's move list is the legal captures plus the legal
   quiet promotions **to a queen**.
   - **One generation pass.** The quiet queen promotions come from the same pseudo-legal pass as the captures, and only
     they and the captures pay the legality test. No second `generateMoves` or `legalMoves` call per node: the probe's
     second-pass shortcut cost 1.7× CPU at 1.01× nodes. The function lives in `src/legal.ts` beside `legalCaptures`.
   - **Order:** the quiet promotions are appended after the captures, then the one stable `mvvLvaKey` sort runs. A quiet
     queen promotion keys at 899.9, so it sorts with the queen captures. A tie with a pawn taking a queen keeps the
     capture first.
   - **Under-promotions:** a quiet under-promotion stays out (1.032× against 1.014×, for the rare knight-fork case). A
     capturing under-promotion stays in, as today: `legalCaptures` already keeps it, and the door must not move. In
     check, every under-promotion is searched under decision 2.
   - Stand pat still applies out of check, because the side may decline a promotion.

6. **Switches and doors (`ADR-0026` decisions 1–3 and 10).**
   - **`ABC-228`:** a switch `quiescenceEvasions` in both recursions, on in `search()` and `chooseMove`. Two TEST-ONLY
     doors: `searchWithoutQuiescenceEvasions(position, depth)` and `chooseMoveWithoutQuiescenceEvasions(position,
     options)`. Each is the shipped path with evasions off and everything else on, null move included: the
     pre-`ABC-228` `search()` and `chooseMove`, node for node.
   - **`ABC-229`:** a switch `quietPromotions`. Its doors are `searchWithoutQuietPromotions` and
     `chooseMoveWithoutQuietPromotions`, each with evasions on.
   - **Ladder:** every door older than `ABC-228` turns evasions off. Every door older than `ABC-229`, `ABC-228`'s pair
     included, turns quiet promotions off. Evasions sit above null move, and quiet promotions above evasions.
   - **How `quiesce` sees them:** one exported readonly record type, `QuiescenceRules`, passed as an argument.
     `ABC-228` gives it one field, `evasions`. `ABC-229` adds `quietPromotions`. Each recursion maps its switches onto
     a module-level constant record, so no record is built per leaf. Every caller, tests included, passes `ply` and the
     record explicitly; neither has a default.
   - The engine doors take no depth (`ABC-078` `A4`). The export lists of `ABC-077` `A6` and `ABC-078` `A4` grow by
     the doors. `src/quiescence.ts` exports grow by `QuiescenceRules` and `MATE_SCORE`.
   - Rejected again: an options parameter on `search()` or `chooseMove`, and one door that takes an options record
     (`ADR-0026` Alternatives).

7. **Rows** (`ADR-0026` decisions 4 and 7 as amended, and `ADR-0051` decision 6's pattern).
   - **`ADR-0050`'s rows that compare the shipped path with a null-move door re-point their shipped side** to the new
     door of the same recursion. These are the d5 drift pair, the same-depth mate floor, and the two "makes null moves
     … and changes the work" rows. They then read their pre-ticket figures exactly, so 37 cp keeps measuring null move
     alone. `ABC-229` re-points `ABC-228`'s own oracle rows to its doors the same way.
   - `ADR-0026` decision 9's rows already read older doors, which turn the new switch off. So 118 cp keeps measuring
     LMR alone.
   - **`QE-208-c`'s door maps grow by the new doors.** A sibling row pins `quiescenceEvasions: true` on `search()` and
     `chooseMove` only (and `quietPromotions` the same way at `ABC-229`).
   - **Direct `quiesce` calls in tests** pass the shipped record. A row that then moves is routed by its assertion. A
     work reading (a node count, a ratio, the cap's ply) passes the pre-ticket record. A value reading is re-pinned on
     the shipped path.
   - **`ABC-081` `A5` "the fixture bites" is re-pinned −485 → −392** (measured, finding 6). This is `ADR-0026`
     decision 7: a value row on the shipped path, and its premise still holds. It is the SE's, under this ADR, not
     the owner's.
   - Any other pin that moves is reported with its old and new value and its route. A pin in an accepted ADR's table,
     such as `ADR-0050` decision 9, is the owner's, as in `ADR-0051` P2. The probe moved none of the seven.

8. **The bounded oracle (`ADR-0026` decision 10).** It is a regression net for gross faults, not a proof of either rule.
   The rows in decision 9 prove the rules.
   - **`ABC-228`:** d5 drift on `ABC-121`'s 190, in both recursions: `search()` against
     `searchWithoutQuiescenceEvasions` at depth 5, and `chooseMove` against `chooseMoveWithoutQuiescenceEvasions`, each
     iterated to depth 5.
     - **At least 83 % of non-mate positions within 25 cp, and none beyond 177 cp.**
     - Measured on `search()`: 89.30 % and 118 cp. 83 % is 100 − 1.5 × 10.70 (the measured miss share), rounded down,
       and 177 is ⌊1.5 × 118⌋ (`ADR-0051` decision 7's rule). Below `ADR-0051`'s 90 %, because this rule changes more
       horizon values.
     - The `chooseMove` pair was not measured here (`UNKNOWN - verify`). If it misses these bars, the SE stops and
       reports. The SE does not tune.
   - **`ABC-228`, same-depth mate floor on the 287 at depth 5:** every door mate is a mate of the same sign, no longer.
     Measured 189 of 189.
   - **`ABC-229`:** d5 drift against its own doors, in both recursions. **At least 95 % within 25 cp, and none beyond
     12 cp** (⌊1.5 × 8⌋). Measured on `search()`: 100 % and 8 cp.
   - Mate-status flips on the 190 are a report, not a bar (measured 0 for both).

9. **The proof the SE owes** (the test rows; `Q-SET` is frozen by QE before the build, `EPIC-010` § Common gates).
   - **`ABC-228` `A1` (`G4`):** the door is node-equal, cross-build, to base's shipped path on the `ABC-078` `A3`
     corpus. Every older door is node-equal to its pre-ticket self.
   - **`ABC-228` `A2`, in-check rows (≥ 6, Q2 among them).** `quiesce` at `qply` 0 with a full window differs from the
     static score and equals a brute-force evasion search written in the test. QE's frozen rows cover at least:
     - a quiet king move as the only evasion (Q2);
     - a block by interposition;
     - a capture of the checker;
     - an evasion that loses material to a follow-up capture;
     - a double check, where only king moves evade;
     - an evasion that is itself a promotion.
   - **`ABC-228` `A3`, capture-mate rows (≥ 6, Q1 among them).** Each reads `±(MATE_SCORE − (ply + qply))` with the
     right sign and distance. QE's frozen rows cover at least:
     - a mate by capture at `qply` 1 (Q1);
     - a mate after a two-capture exchange;
     - a mate by a capturing promotion;
     - a mate by an en-passant capture;
     - a row with exactly one evasion, which must NOT read a mate score;
     - one through `search()` at depth 1, checking the root-relative distance.
   - **Rule rows (the planted faults each one reds):**
     - out of check, the node still stands pat. This reds evasions searched out of check;
     - in check, the static score is never returned below the cap. This reds a stand pat kept in check;
     - stalemate (no legal move, not in check) still stands pat. This reds a mate scored without check;
     - no node past `qply` 8 is visited, with evasions on (the existing `A3` cap assertion);
     - a mate found in quiescence survives the table's store and restore at another ply (`ADR-0025` decision 3);
     - a source row: both recursions pass `ply` and their rules record to `quiesce`.
   - **`ABC-228` `A4` (the node bar):** `search(…, 6).nodes` ≤ 1.5 × the door on kiwipete and position-6. The
     reference build reads 1.368× and 1.405×. A reading more than 3 % off the reference is reported with its cause,
     because it suggests the build differs from decision 2.
   - **The `G6` forecast (new, reported, before the graded `G6` and the smokes).** It is read on `ABC-228`'s own base,
     after `ABC-235`. Take base's completed depth and node count at 3 s from one real-clock `chooseMove` per board,
     alone, in plain `node`. Then run head's `chooseMove` on a frozen clock to that depth. Head's nodes, times 1.09
     for CPU per node, are set against base's 3 s node count.
     - At or below 100 % on both boards: `G6` is read by its rule, and `OQ-228-1` does not apply.
     - Above 100 % on either board: the SE stops and reports. `G6` is read under the owner's answer to `OQ-228-1`.
     - Reference, on today's `main`: 1.226× and 1.325× head over door; 85 % and 125 % of base's 3 s nodes.
   - **`ABC-229` `A2`, quiet-promotion rows (≥ 6, Q3 among them).** Each reads ≥ static + 600 cp where the promotion is
     safe, and the door reads the static score. QE's frozen rows cover at least:
     - a safe promotion (Q3);
     - a promotion square the opponent controls, which must not read a free queen;
     - a promotion that blocks a check, taken through decision 2's path;
     - a position where only an under-promotion wins, which stays unseen, as the rule says;
     - a capturing under-promotion, unchanged;
     - one KPK row (the probe reads 186 → 902 on `kpk-b6c6`).
   - **`ABC-229` one-pass row:** a spy shows `generateMoves` called once per quiescence node out of check.
   - **`ABC-229` `A3`:** ≤ 1.2 × its door at depth 6. The reference reads 1.019× (kiwipete) and 1.000× (position-6).
   - **Gates, both tickets:**
     - `G1` ≥ 54/58: `UNKNOWN - verify`. A newly solved row is reported. A newly missed row is classed under `ADR-0034`;
     - `G4` and `G5`;
     - `G6` per `OQ-228-1`;
     - `G8`, with fixed-depth rows only and 0 real-clock rows in the default lane;
     - `G9` and `G10`;
     - `G2` is not owed, because the evaluator is untouched;
     - the smoke pair S-1 to S-4 (`EPIC-010` § The merge rule);
     - `G11`, reported.

10. **`OQ-228-1`, the owner's question.** On today's `main`, the design is forecast to complete depth 9, not 10, on
    `position-6` at 3 s (finding 4). `ABC-235` may lift that, and decision 9's forecast re-reads it first. The answer
    is asked now, so a miss does not stall the ticket. It applies only if the forecast still misses.
    - `G6` "≥ base" is graded on the owner's word (`…2ae5fc12`), and `EPIC-010` `M4` reads `G6` at the close.
    - The added nodes are the change's purpose: depth now means depth to a quiet position (`ADR-0024` decision 6).

    Three answers fit:
    - **(a) Recommended.** Build the design. For `ABC-228` and `ABC-229`, `G6` grades the depth-6 floor, and "≥ base"
      is reported. The `A4` node bar and the smoke pair judge cost and strength. `M4` reads `G6` the same way for
      these two merges.
    - **(b)** Keep `G6` graded, and build the **mate-test-only form** instead. In check with no legal move, it scores
      mate; otherwise it stands pat as today. It reads 1.000× nodes and fits `G6`. It meets `ABC-228` `A3`, not `A2`.
      The evasion search waits for a later word, and BA/PM re-scopes the page.
    - **(c)** Keep `G6` graded and build the design anyway. The forecast says it closes unmerged on `G6`, as `ABC-205`
      did. Not recommended: it spends an SE build and a QE hop to read a known result.

    Until he answers, the SE builds decisions 2–4 and 6–9. The evasion loop is the only part (b) removes. If the
    forecast misses, the SE stops before the graded `G6` and the smokes.

## Alternatives

- **The mate-test-only form** (in check and no legal move: mate; otherwise stand pat). It reads 0.999× and 1.000×, and
  it fixes Q1's class. It leaves Q2's class wrong, which is `ABC-228`'s first problem. It is not the design, and it
  is kept as `OQ-228-1` (b).
- **A separate check-evasion cap** (evasions below quiescence ply 2 or 3, then the mate test). It reads 1.171×/1.183×
  and 1.188×/1.459× at depth 6. Rejected: it is a budget in disguise, it changes the value (kiwipete d8 −84, not
  −59), and the ply-2 form still forecasts 112 % of `position-6`'s budget.
- **Evasions at quiescence ply ≥ 1 only.** Rejected. It is no cheaper on position-6 (1.416×). It would also stand pat
  at the leaf in check but not one ply later, two rules for one fact.
- **Evasions at quiescence ply 0 only.** Rejected. It is `ABC-210`'s horizon tree again (1.054×/1.013×, with the same
  worst drift position). `ABC-210` read NEUTRAL, and `EPIC-010` § Out of scope excludes its re-runs.
- **Captures only when in check** (capturing evasions, the rest standing pat or scored mate). Rejected by
  construction: a side with only quiet evasions would read as mated.
- **Quiet promotions to every piece.** Rejected. 1.032× against 1.014× on kiwipete for the rare under-promotion fork,
  which the full-width search already sees.
- **Quiet promotions ordered after every capture.** It reads 1.005× against 1.014× on kiwipete. Rejected: it needs a
  second ordering rule, and one key serves quiescence and the full-width ordering (`ADR-0024` decision 2). The gap is
  under 1 % and inside both bars.
- **Quiet promotions found by a second `legalMoves` pass.** This is the probe's own method. Rejected: 1.7× CPU at 1.01×
  nodes.
- **`MATE_SCORE` imported from `src/search.ts`**, which closes an import cycle. Or passed in as an argument, which is a
  parameter carrying a constant. Both rejected.
- **One door pair for both tickets.** Rejected. They are two tickets with two readings, and each needs its own
  node-equal base (`G4`).
- **Stalemate detection in quiescence.** Out of scope (`EPIC-010`). It needs a legal-move count at every node out of
  check.

## Consequences

- **Files.** `ABC-228`: `src/quiescence.ts`, `src/search.ts` and `src/engine.ts`, with comments in
  `src/transposition.ts` (decision 3). `ABC-229`: `src/quiescence.ts`, `src/legal.ts`, `src/search.ts` and
  `src/engine.ts`. No dependency, data or format change.
- **Collision with `ABC-235`** (in build, `src/legal.ts` cut 3, `generateCaptures`). Whichever lands second rebases.
  Decision 5 holds over either generator: the quiet queen promotions come from the capture pass, appended after the
  captures.
- **The header of `src/quiescence.ts` is rewritten** for the evasion path, the mate score, the cap in check and the
  quiet promotions. The "Not here" paragraph keeps delta pruning, SEE, quiet checks, quiet under-promotions and
  stalemate.
- **`NFR-005`:** at risk. See finding 4 and `OQ-228-1`. The depth-6 floor does not move.
- **`NFR-004`:** evasion nodes go through `visit`, so the engine counts them and checks the clock as for any node.
  `G5` reads it.
- **`NFR-008`:** new rows run at fixed depth or on the virtual clock only.
- **`NFR-009`:** no new state. The recursion depth stays bounded by the cap. `G7` is not owed.
- **Security:** no input path changes.
- **`G1`:** `UNKNOWN - verify`. `ADR-0051`'s form (b) read 53/58, but that is a different rule.
- **Strength:** `UNKNOWN - verify` (`RISK-EPIC010-02`). The ply-0 slice repeats `ABC-210`'s tree, so the new evidence
  is the in-check nodes at quiescence ply ≥ 1.
- **Confidence:**
  - **High** on the node counts, the mate floor and the pins. They are deterministic, and the door reproduces base
    exactly.
  - **Medium** on the `G6` forecast. The node budget comes from one QE session, and CPU per node is indicative.
  - **Medium** on the drift bars, for the `search()` side only. The `chooseMove` side is `UNKNOWN - verify`.

## Rollback

- **`ABC-229`:** delete its switch, its doors, the `quietPromotions` field and the promotion half of the generation
  pass. Point its re-pointed rows back. `ABC-228`'s rows read the same values, because the doors were the pre-ticket
  search.
- **`ABC-228`:** delete its switch, its doors, the in-check branch, the `ply` argument and the `QuiescenceRules`
  record. `MATE_SCORE` may move back to `src/search.ts`. Point the re-pointed rows back, and restore the `ABC-081` `A5`
  literal to −485.
- **The text:** strike decision 1, and `ADR-0024` decision 4 reads as before.
- **Detection that it was misapplied:** the `A4` node ratio near 1.0×, which means the evasion loop is dead. Or a
  `quiesce` that returns the static score in check below the cap.
- No stored data, format or dependency depends on this ADR.
