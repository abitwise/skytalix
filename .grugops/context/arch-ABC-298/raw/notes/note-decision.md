# arch-ABC-298 decision: `ADR-0077` PROPOSED. V3 searches the hash move before the move list, at remaining depth 1 and 2 only, node-identical. A count probe can stop it first; then S2 at ≥ 1.03× on two of three boards, under D3-V2 unchanged. No games. `kingExposure` stays out

Architect/Design, task `arch-ABC-298`, records only, on `grugops/arch-ABC-298` from `main` `36baff11` (`src/` tree `bba42fb7`). Nothing was run. The ADR is `memory-bank/50-decisions/ADR-0077-…`. This note gives the calls; the ADR holds the reasons.

## 1. The form (d1, d2)
- **`…5a155b2c`'s form, narrowed by one gate.** At a full-width node below the root, with a probe hit, the table on and the ordering full, **at remaining depth 1 or 2**:
  - the hash move is checked for legality without the list, and searched first, as index 0;
  - if it cuts off, nothing is generated;
  - if not, `legalMoves` and `orderMoves` run as today, the twin sorts first, and the loop starts at position 1.
- **Everywhere else, today's code runs.** That includes depth 3 and above, the roots, quiescence, and every door with the table off.
- **Why the gate:** this task's observation note. Above depth 2 the hash move's subtree writes history and countermove cells the sort reads, so identity fails.
- **The check:**
  - a new per-square export in `src/moves.ts` (`generateMoves` filtered to one square, by the same helpers; `generateMoves` untouched);
  - then a single-move make/test/unmake in `src/legal.ts`;
  - then a live read of word 2 in `src/transposition.ts`.
  Its oracle is `entryMove(slot, legalMoves(position))`, field for field. It stays within `ADR-0003` (1-A) and (1-R), and needs no amendment.
- **Captures before quiets: out (d4).** It is not exact by construction: a captures-plus-promotions generator in generation order, the killers and countermove checked without the list, and the same depth bound. Its gain is unmeasured.

## 2. The identity duty (d3, 15 items)
- **Both recursions,** with `src/engine.ts`'s `try`/`finally` on abort; roots and quiescence unchanged.
- **The gate itself,** and `countermoveAt` read before the hash move's subtree.
- **Word 2** read live, once, after the null move, never re-read.
- **Field-equal `Move`s:** nothing compares moves with `===`.
- **After no cutoff:** the twin sorts first, and the loop starts at position 1 with `index` 1.
- **`moveCountFrom`** read straight after the sort; `searchedQuiets` counts a quiet hash move.
- **Futility's index:** 0 is never skipped, and `futile` uses `alphaIn`.
- **`moves[0]`:** a dead default, so `bestMove` starts as the hash move.
- **A hash cutoff before any list** makes today's index-0 writes: history bonus, countermove cell, killer, store.
- **Mate and stalemate:** a legal hash move proves a legal move exists, so the empty-list branch was unreachable there.
- **The two capacity tests that mock `legalMoves`** never hit the table.
- **Node counter and clock** are unchanged.

## 3. SG3, fixed before any reading (d7)
- **Instrument:** `ADR-0055` D3 as amended by D3-V2, unchanged. `chooseMove` at 4 000 ms, fresh process per run, kiwipete, position-6 and start, 5 admitted pairs each, blind admission (≤ 0.8 foreign cores, Tctl < 85 °C), cap 15, VOID-LOAD.
- **Spread rule:** D3's 5 %, (max − min) / median per build and board, one re-run, then VOID. The agreement guard reads 1.03 and 1.00.
- **Bar: head ÷ base ≥ 1.03 on at least two boards and ≥ 1.00 on the third.**
- **Host:** a held host on the owner's word, the lock held for the session, PREREG sealed first, about 15–30 min, with `G6` "≥ base" read in the same window.
- **Outcomes:** a miss is NOT MET and not merged. A void is no miss and may be re-read. Nothing is waived on a close figure.
- **The other rows:**
  - **SG0:** perft 32 / 32, with the file byte-equal to the freeze.
  - **SG1:** (a) `search()` at depth 8 and `chooseMove` at kiwipete 8 and 9 and position-6 8, 9 and 10, frozen; (b) `ABC-254` A3's `G4` form, out of tree; (c) no existing figure changed.
  - **SG2:** (a) hand cases; (b) `ABC-254` A1's walks, with the parent's moves as the stale set; (c) a seeded illegal move never made.
- **No games (d8).** `EPIC-011` § The per-change rule: value-identical tickets keep S2 and play no games. Games add no safety to an exact search, and cannot see a few Elo. R3's 400 games carry it.

## 4. The order (d9)
1. owner;
2. records, DoR 10 / 10;
3. **the count probe**, Architect, untimed, under the lock, no held host;
4. **QE's freeze** on GO;
5. **the Orchestrator's check:** `git merge-base --is-ancestor <freeze commit> main`, the same `src/` tree, the freeze note's id in the brief. No id, no dispatch;
6. the build;
7. QE: SG0–SG2, then SG3 and `G6` in one held window;
8. UAT by the QE verdict.

- **Why a probe now:** the gate may leave few hash moves, and a count bounds the gain without a stopwatch.
- **The probe, fixed now:** a scratch copy of `main`, `chooseMove` `maxDepth` 9 with `now: () => 0` on the three boards. It counts G (full-width nodes reaching `legalMoves`), H (inside the gate, with a legal hash move) and C (of H, cut off at index 0).
- **The rule: STOP if C ÷ G < 0.048 on two of three boards,** since 1 / (1 − 0.6 × 0.048) ≈ 1.0297 < 1.03. The 0.6 is above the old profile's largest generation + legality + ordering share (about 57 %), and the check's cost is taken as 0.
- **GO means only "it can pay".**

## 5. `kingExposure` (d10): stays out, not a separate arm now
- It has no ticket, freeze or build, and needs d4's memo word.
- Its instrument is `G2` (`ADR-0067` d8's A5 shape), not D3-V2.
- It must never sit on V3's head, where it would confound 1.03.
- It may share a later held session as a separate arm under its own ticket and PREREG, if it is ever cut and is ready. V3 never waits for it.

## 6. NFRs, pins, intent, the stop (d11, d12)
- **`NFR-008`:** ≤ +0.10 s stands. About +0.015 to +0.045 s by estimate. No new default-lane file. If it reads over, UNRESOLVED, not merged while over.
- **`NFR-009`:** no new table; `G7` growth 0. **`NFR-001`:** perft untouched. No NFR file and no catalog line.
- **Deep pins moved: none expected.** Any change is F2, a defect, never a re-pin.
- **Intent:** SPEED, value-identical.
- **The stop:** if identity cannot be kept inside d1–d2, V3 stops and comes back as "none". It never becomes a move-changing ticket. A probe STOP closes it the same way.

## 7. For the owner (the ADR's § The owner's questions)
1. **Accept `ADR-0077`?** The engine tries its remembered best move before listing all its moves, in the last two steps of each line only, so it searches exactly the same positions, faster. A short count can stop it before anything is built. It is kept only at ≥ 3 % faster on two of three positions and not slower on the third. **Recommendation: yes,** knowing it is small and may not pay; "no" is fair too.
2. **Is a stop or a miss the end of V3,** with no wider form (captures first, or deeper in the tree)? **Recommendation: yes.**
- **Host ask, not a ruling:** about 30 min of quiet host, if the count says go and the build is ready.

## For the Orchestrator
- **No bar, NFR level, rule or scope moves,** so nothing is stopped on that ground.
- **The gate is a narrowing of the form you dispatched on, not a widening.** I took it as the Architect's call under the brief's identity duty, and I name it to you and to him.
- **My odds are now lower than `…5a155b2c`'s:** the speed bar is below even.
- **Records owed:** BA/PM's page lines after his answer; your d9 step 5 check before any build dispatch.

## Confidence
- **High:** the `src/` reading, the identity duty, the depth bound and the reuse of D3-V2.
- **Judgement:** the 1.03 bar's placement, the probe's 0.6 bound, and every speed and Elo figure. `UNKNOWN - verify` until read.
