---
kind: adr
id: ADR-0051
---
# ADR-0051: A check extension arrives at the horizon. A full-width node in check at remaining depth 0 is searched one ply deeper, once per line, behind a test-only off-door pair, and is judged by a bounded oracle at depth 5

## Status

*2026-10-27:* **accepted, not in force on `main`.** `ABC-210`'s single reading (`A5`, D under S1, final under
`…4c3f7639`) was S1 NOT MET: d1 NEUTRAL −1.7 ± 22.8, the one extension d2 NEUTRAL −7.8 ± 23.0, pooled over 800 games
NEUTRAL −4.78 ± 16.21 (QE `…b953e670`, failed attempt `…86b45c13`, at merge `d71fc369`). The ticket was not merged
(Orchestrator `…85e9c9b2`); `grugops/ABC-210` `a96f36b0` is kept unmerged. Recorded by Architect/Design (task
`arch-adr0051-not-in-force`, records only, at `main` `06c1ecc8`), on Orchestrator `…85e9c9b2` and QE `…b953e670`, in the
`ADR-0026` decision 9 / `ADR-0025` decision 4 form.

- **No check extension on `main`.** At `06c1ecc8`, `src/search.ts` and `src/engine.ts` hold no check extension, and
  `grugops/ABC-210` is not an ancestor of `main`. The leaf still hands a position in check to `quiesce`, as Context
  describes. `ADR-0024` decision 4 was never amended and stands.
- **P2 did not land:** `zugzwang.005` stays at depth 12 on `main` (`ADR-0050` decision 9, whose dated line says so).
  P1 did not land either: the `ABC-081` `A5` row still reads −485 at depth 3.
- This line moves no code. Decisions 1–8 stay as the accepted text; they describe a build that is not on `main`.

Previously (2026-10-27): **ACCEPTED** by Olger Oeselg (owner), verbatim *"yes, accept ADR-0051"* (note
`.grugops/context/owner-word-2026-10-27/notes/20261027T062043Z-orchestrator-decision-047d411f.md`). He was answering
the one bundled yes/no "accept ADR-0051, including the zugzwang test change?", so the yes covers this ADR, its oracle
bars (decision 7) and P2's route. Recorded by Architect/Design (task `arch-accept-adr0051`, records only, at `main`
`5dfd818c`).

- **ACCEPTED; in force on `main` at `ABC-210`'s merge.** Until then the check extension is not on `main`. At
  `5dfd818c`, `src/search.ts` and `src/engine.ts` hold no check extension, and `grugops/ABC-210` has no commit beyond
  `main`. The QE verdict and S1 still decide that merge.
- **If `ABC-210` does not merge (S1 NOT MET),** a dated line here records "accepted, not in force on `main`", as
  `ADR-0026` decision 9 and `ADR-0025` decision 4 do. P2's depth change in `ADR-0050` decision 9 then does not land.
- **P2** (`zugzwang.005`, depth 12 → 13) is recorded as a dated amendment line in `ADR-0050` decision 9; the original
  table row stays. **P1** (the `ABC-081` `A5` re-pin to depth 2) was routed by the Orchestrator (`…75af453c`), not by
  this ADR.
- This ADR assigns no § Records or drift rows, so none are applied. Nothing else in this ADR moves.

Previously **PROPOSED** 2026-10-27 by Architect/Design (task `arch-design-ABC-210`, records plus probes, at `main` `f0c50046`).
**Acceptance is the owner's** (`…5aaf7cec` item 3: a new ADR is his). The Orchestrator reports this text to him
(`…7feb0553` item 2). The design and the build may proceed; the ALONE reading and the merge wait on his acceptance
(reading b: `…d25ab770`, `…828d5794`). No agent marks it accepted.

- It follows `ADR-0026` decision 10 (a switch, a pair of doors, off in every older door, a bounded oracle) with
  `ADR-0050` as the precedent, and cites both rather than re-deriving them.
- **It amends no accepted ADR text.** `ADR-0024` decision 4 ("checks in quiescence" out of scope) stands, and so does
  `src/quiescence.ts:21-24`. `src/quiescence.ts` is not touched. **No `ADR-0026` level and no NFR bound moves.**
- **STOP (to the Orchestrator):** two shipped-path pins move under this design, and under every other form probed
  (Consequences, P1 and P2). This ADR names them and proposes routes; it does not rule them. P2's route changes
  `ADR-0050` decision 9's table, an accepted ADR, so that part is the owner's and is bundled with this ADR's yes/no.
- Built by `ABC-210`. The probes ran on scratch clones of `main` (code = `b5c67ab7`), never on `src/`. No real-clock
  search was run and no timing is quoted. Readings: `.grugops/context/arch-design-ABC-210/notes/` (the observation
  note). The ticket page's `## Design ruling` has the row-by-row routes.

## Context

- The leaf hands every in-progress position to `quiesce`, which stands pat first, **also when the side to move is in
  check**. So a check given on the last full-width ply is scored as if the checked side could pass. A depth-1 search
  misses a knight fork, a bishop skewer and a rook skewer that each win material one ply after the check (five rows,
  `A2`).
- The page offers two forms: (a) +1 ply at a node in check with a per-line cap, or (b) quiet checks in the first
  quiescence ply. Form (b) reverses `ADR-0024` decision 4. Form (a) is a new value-changing heuristic.
- **What the probe found** (all counts deterministic; base is `main`'s `src/`):
  - **Where the extension fires decides its cost.** At a node in check anywhere in the tree (the classic form, any
    cap), `search()` at fixed depth 6 costs **1.69×** base on position-6 (185 584 against 109 912 nodes); that misses
    `A3`'s 1.5×. Restricted to the **horizon** (remaining depth ≤ 0), the same board reads **1.007×**, and kiwipete
    1.054×. Of 1 583 extensions on position-6 the 319 interior ones cost almost all the growth.
  - **The cap hardly matters at the horizon.** Caps 1, 2, 3 and none give counts within 0.1 % of each other. Two
    extensions in one line need a counter-check answering a check at the horizon. Cap 1 is the simplest bound.
  - **Form (b)** reads `G1` 53/58 (four rows newly missed, three newly solved), loses `zugzwang.005` through depth 13,
    and adds a full move generation at 61 452 leaves to reach kiwipete depth 8. A frozen clock does not price that.
  - **The horizon form** keeps `G1` at 54/58 with base's four misses, and its door is node-equal to base (300/300).

## Decision

1. **Form (a), at the horizon only. One switch, `checkExtension`, in BOTH recursions** (`src/search.ts`,
   `src/engine.ts`), as `ADR-0026` decision 1. It is on in `search()` and `chooseMove`. Form (b) is not built.
2. **The rule is ONE exported pure predicate in `src/search.ts`: `checkExtensionPlies(position, depth, extensions)`
   → 1 or 0.**
   - It returns 1 when all three hold: remaining `depth` ≤ 0; `extensions` (plies this line has already been
     extended) is below `CHECK_EXTENSION_MAX_PER_LINE`, which is **1**; and the side to move is in check.
   - It derives check from the position. The caller passes only depth and the line's count (`ADR-0026` decision 6's
     contract).
   - **Both recursions call it at node entry,** after the repetition scan and before the leaf test and the table
     probe. They add exactly what it returns to the remaining depth and to the line's count. The root is never
     extended: its depth is at least 1.
   - **`extensions` is an argument, as `afterNull` is,** so nothing is held between nodes. It goes **before**
     `afterNull` in `negamax`'s parameter list, so the null flag stays the last argument (`ABC-208`'s source row reads
     it there). The null child and every real child pass the parent's count on.
3. **Limits.** At most 1 extra ply per line, so a full-width line is at most root depth + 1 plies, well inside
   `KEY_ARRAY_CAPACITY` (128, `ADR-0025` decision 7), which stays a runaway guard. `QUIESCENCE_MAX_PLY` (8) and
   `src/quiescence.ts` are unchanged. No separate ply budget: horizon-only plus a cap of 1 bounds the line.
4. **Interplay, confirmed and not changed:**
   - **Null move:** no null move in check (`nullMoveReduction` returns 0, `src/search.ts:305`, `ADR-0050` decision 6).
     An extended node also has remaining depth 1, below `NULL_MOVE_MIN_DEPTH` (2). A null child is never in check
     (the passing side cannot be giving check in a legal position), so it is never extended.
   - **LMR:** no reduction in check or for a checking move (`ADR-0026` decision 6); an extended node's depth 1 is below
     `REDUCTION_MIN_DEPTH` (3).
   - **Table:** an extended node probes and stores at its extended depth, 1. That is the depth it really searched.
   - Neither predicate changes.
5. **Two TEST-ONLY doors, one per recursion: `searchWithoutCheckExtension(position, depth)` and
   `chooseMoveWithoutCheckExtension(position, options)`.** Each is the shipped path with the extension off and
   everything else on, null move included: the pre-`ABC-210` `search()` and `chooseMove`, node for node (`A1`). The
   engine door takes no depth. The export lists of `ABC-077` `A6` and `ABC-078` `A4` grow by these names and by the
   predicate. **Every door that exists before `ABC-210` turns the extension off** (the ladder rule): it is the top rung,
   above null move.
6. **Rows.**
   - **`ADR-0050`'s rows that compare the shipped path with a null-move door re-point their shipped side to the new
     door of the same recursion:** the d5 drift pair, the same-depth mate floor, and the two "makes null moves … and
     changes the work" rows. They then read their pre-ticket figures exactly, so **37 cp keeps measuring null move
     alone.** `ADR-0026` decision 9's rows already read the null-move doors, which turn the extension off, so **118 cp
     keeps measuring LMR alone.** No bound moves.
   - **`QE-208-c`'s door maps grow by the two new doors, whose `nullMove` literal is `true`.** A sibling row pins
     `checkExtension: true` on `search()` / `chooseMove` only and `false` on every other door.
   - Value and behaviour rows on the shipped path stay there (`ADR-0026` decision 7). Two move: P1 and P2
     (Consequences).
7. **The bounded oracle (`A3`).**
   - **Centipawn drift at depth 5, in BOTH recursions, on `ABC-121`'s 190:** `search()` against
     `searchWithoutCheckExtension` at fixed depth 5, and `chooseMove` against `chooseMoveWithoutCheckExtension`, each
     iterated to 5. **At least 90 % of non-mate positions within 25 cp, none beyond 174 cp.** Measured: 93.58 % and
     94.12 %, maximum 116 cp in both (position-4/f1f2, 708 → 824).
     - **Why 90 % and not the 95 % of `ADR-0026` d9 and `ADR-0050` d8:** this heuristic exists to change horizon
       values, and the correct build misses 95 %. 90 % is the measured miss share (6.42 %) with 1.5× headroom; 174 is
       ⌊1.5 × 116⌋ (`ADR-0024` decision 3 and `ADR-0039` pattern).
   - **A same-depth mate floor on the 287:** for every position `searchWithoutCheckExtension` scores as a mate at depth
     5, `search()` at depth 5 scores a mate of the same sign, no longer. Measured: 0 of 189. An extended node with no
     legal move scores `−(MATE_SCORE − ply)`, the same ply `leafEndReason` would have given it, so mate distances do
     not shift.
   - Mate-status flips on the 190 are a report, not a bar (measured 0).
   - **Scope, said plainly: a regression net, not a proof.** It reds an extension at every node in check
     (87.17 % / 88.24 %) and at every horizon node (56.68 % / 49.73 %). It passes a 2-ply extension (91.98 %), no cap,
     and a dead switch. The `A2` rows catch those. Do not tighten the bars to chase them.
8. **`A2` and `A3`'s node bound.**
   - **Five horizon rows**, each searched with `search(position, 1)` and `chooseMove` to depth 1 (frozen clock). Each
     must play the check; each door plays something else:

     | row | FEN | move | door plays |
     |---|---|---|---|
     | knight fork K+R | `r3k3/7p/8/1N6/8/8/7P/4K3 w - - 0 1` | Nc7+ | Nd6 |
     | knight fork K+Q | `6k1/p2q4/8/8/4N3/8/P7/6K1 w - - 0 1` | Nf6+ | Kh1 |
     | bishop skewer K+Q | `4q3/7p/2k5/8/P7/8/7P/5BK1 w - - 0 1` | Bb5+ | Bd3 |
     | rook skewer K+R | `7r/p7/8/7k/8/K7/P7/1R6 w - - 0 1` | Rh1+ | Rb7 |
     | knight fork K+R, Black | `4k3/7p/8/8/1n6/8/7P/R3K3 b - - 0 1` | Nc2+ | Nc6 |

   - **The instrument** (no production counter): call-through module spies on `src/apply.ts` (make and unmake, null
     included) and `src/quiescence.ts` (`quiesce`). The line length at each qply-0 `quiesce` call is replayed from the
     spies' global invocation order. On the five rows, depth 1 reaches leaves at ply 2 in both recursions, and the
     doors stop at ply 1. On kiwipete, position-4, position-5 and position-6, `search()` at 5 and `chooseMove` to 5
     reach ply 6 and never 7.
   - **The cap row:** `3rkr2/3p1p1p/Q7/8/8/8/6PP/r2n2K1 w - - 0 1`. After Qe2+ the only evasion is Ne3, a discovered
     check. `search()` at 1 and `chooseMove` to 1 reach ply 2 and never 3, and `search()` at 2 reaches 3.
   - **`A3`'s "nodes at fixed depth 6 ≤ 1.5 × base" reads `search(position, 6).nodes` against
     `searchWithoutCheckExtension(position, 6).nodes`** (the door IS base, so no cross-build). Measured: kiwipete 1.054×
     (249 811 / 237 007), position-6 1.007× (110 654 / 109 912). `chooseMove` to 6 reads 1.050× and 1.001×.

## Alternatives

- **The extension at every node in check, at any cap.** Rejected by measurement. Position-6 at fixed depth 6 reads
  1.69× (cap 1) to 1.75× (no cap), above `A3`'s 1.5×. `G1` reads 53/58 (seed 1163 newly missed). `zugzwang.005` moves
  to depth 13. The d5 drift reads 87.17 % within 25 cp.
- **Only at PV nodes.** It fires 22 times in a position-6 depth-6 search, so it is close to a no-op at the horizon.
  `search()` at 6 still reads 1.28× on position-6, and P1 moves anyway.
- **Form (b), quiet checks in the first quiescence ply, with every evasion searched after one.** Rejected. It reverses
  accepted `ADR-0024` decision 4. `G1` reads 53/58. `zugzwang.005` is lost through depth 13. P1 moves (−485 → −511).
  It needs a mate score and a ply inside `quiesce`, the shared leaf. It also adds a full move generation and a
  `givesCheck` per quiet move at every quiescence leaf that does not stand pat: 61 452 generations to reach kiwipete
  depth 8. No frozen-clock count prices them.
- **Both forms.** More nodes than either, and no evidence of a gain.
- **A cap of 2 or more, or no cap, at the horizon.** Counts within 0.1 % of cap 1. Cap 1 is the simplest bound, and the
  cap row reds "no cap".
- **The 95 % drift clause.** The correct build fails it (93.58 %).

## Consequences

- **Rows the build adds, and what each one reds** (planted on scratch clones):
  - the predicate's table (1 at depth 0 and −1 in check; 0 at depth ≥ 1, at count ≥ 1, and out of check). It reds a 2-ply
    extension, no cap, interior extension and an extension out of check;
  - a source row that both recursions call the predicate before the leaf test and add its value to depth and count;
  - the five `A2` rows and the instrument: they red a dead switch (ply 1) and a 2-ply extension (ply 3 / 7);
  - the cap row: it reds "no cap" (ply 3 at depth 1);
  - `A3`'s node bound: it reds the every-node form (1.69×) and the every-horizon-node form (4.44×);
  - the d5 drift: it reds the every-node and every-horizon-node forms.
- **Moved pins: the STOP.** Each moves under every form probed:
  - **P1. `src/transposition.test.ts` `ABC-081` `A5`, "the fixture bites: at depth 3 the repetition is past the
    horizon, and the rook down shows"** (`:513-517`). `search(REPEATS_AT_PLY_4, 3).score` reads 0, not −485. The
    perpetual's horizon node is in check, so it is extended onto the repetition. The row's premise, "at depth 3 the
    repetition is past the horizon", is false for any check extension. Every-node and PV-only also read 0; form (b) reads
    −511.
    - **Proposed route** (`ADR-0026` d7, a re-pin on the shipped path): the premise moves to depth 2, where base and
      head both read −502 and the rook down still shows. The depth-4 row (0, f7f8) and the `chooseMove` 6-tick row stay
      green.
  - **P2. `src/search.null-move.test.ts` `ABC-208` `A2` `zugzwang.005`** (`:572`, deep). `chooseMove` to depth 12
    plays Ne2 (score 0), not Nxd5; it plays Nxd5 from depth 13 (score 59; 8 250 117 nodes against base's 3 258 266 at
    12). Base solves it at depth 12 only (Ne2 at 9–11). Stockfish 19 scores Nxd5 0.00 and its own choice −45
    (`ADR-0050` d9), so the label is not a proven unique win. Every-node and form (b) lose it at 12 too; PV-only keeps
    it but moves P1.
    - **Proposed route:** the row's depth 12 → 13. That edits `ADR-0050` decision 9's table, which is accepted, so it
      is the owner's: bundled with this ADR's yes/no. The alternative, re-pointing the seven zugzwang rows to
      `chooseMoveWithoutCheckExtension`, also edits decision 9 ("searched with `chooseMove`"), and it takes the shipped
      engine out of the row.
- **No level, no relation, no NFR bound and no `ADR-0026` level moves.**
- **`G1` 54/58, base's four misses, no NEWLY line.** The `G1` miss class stays B (`ADR-0034` d2).
- **`G6` is predicted MET against "≥ base"** (`UNKNOWN - verify`; the page's test note 3 numbers are in the ticket's
  ruling). The added work is one `isInCheck` at each horizon node not yet extended (14.6 % of kiwipete's nodes to depth
  8, 18.6 % of position-6's to 9), plus 0.83 % / 0.97 % of nodes extended into a full move generation.
- Files: `src/search.ts` and `src/engine.ts` only. No dependency, data or format changes. `NFR-004`: an extended node
  counts and checks the clock like any other.

## Rollback

- Delete the switch, the predicate, the `extensions` argument and the two doors. Point the re-pointed rows back at
  `search()` and `chooseMove`; they read the same values, because the doors were the pre-ticket search. Revert P1's and
  P2's re-pins to −485 at depth 3 and depth 12.
- No stored data, format or dependency depends on this ADR.
- *2026-10-27: not reached.* `ABC-210` was not merged, so nothing on `main` needs rolling back (§ Status).
