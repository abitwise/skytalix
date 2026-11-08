---
kind: adr
id: ADR-0077
---
# ADR-0077: V3 (`ABC-298`). At full-width nodes of remaining depth 1 and 2, the hash move is checked for legality without the move list and searched first. If it does not cut off, the list is built and ordered exactly as today, and the hash move is skipped. The search is node-identical: no switch, no door, no games. A count probe can stop it before the build; then S2 at ≥ 1.03× on two of three boards

## Status

**PROPOSED 2026-11-08.** Recorded by Architect/Design (task `arch-ABC-298`, records only, on `grugops/arch-ABC-298` from `main` `36baff11`, `src/` tree `bba42fb7`).
**Nothing was run:** no test, build, engine, probe, profile or game. Every figure below is quoted from a named record or is arithmetic on `src/` at that tree. Anything that needs a reading is marked `UNKNOWN - verify`.

- **Acceptance is the owner's.** This is a new ADR, as `ABC-298`'s front matter allows (reading (b)). His questions are § The owner's questions. It is not in force until `ABC-298` merges.
- **The form is `arch-search-rank` `…5a155b2c`'s, narrowed by one gate.**
  - The Orchestrator dispatched on that form (`orch-2026-10-30a` `…a28aa29f`). This ADR writes it down in full and does not widen it.
  - **It narrows it to remaining depth 1 and 2.** `…5a155b2c` said "build and order exactly as today" after the hash move. That holds only where the hash move's subtree cannot write the history and countermove cells the node's sort reads, which is remaining depth 1 and 2. Today the sort runs before that subtree; under V3 it runs after. § Context, "What `…5a155b2c` missed", has the argument.
  - At remaining depth 3 and above, every node runs today's code.
  - **This narrowing lowers the odds,** so a count probe, untimed and needing no held host, comes first. Its stop rule is fixed here.
- **What it sets, in short.**
  - Below the root, at remaining depth 1 or 2, the hash move is checked and searched before any list exists.
  - The check gives the same answer, with the same `Move` fields, as today's `entryMove(slot, legalMoves(position))`.
  - If the hash move cuts off, nothing is generated. If not, today's list and order follow, and the loop starts after the hash move.
  - Captures before quiets is out. No switch and no door.
  - SG0, SG1 and SG2 are exact. SG3 is S2 under `ADR-0055` D3-V2, unchanged, at ≥ 1.03× on two of kiwipete, position-6 and start, and ≥ 1.00× on the third.
  - The order is: the count probe, then QE's freeze, which the dispatch can check, then the build. No games.
  - `NFR-008` ≤ +0.10 s stands. No deep pin moves. d6's `kingExposure` cut stays out.
- **What it amends: nothing.**
  - `ADR-0003` (1-A) and (1-R) hold: make/test/unmake stays the legality test, and the hash move takes it in full before it is searched.
  - `ADR-0025`'s live read of word 2 holds, at the same point in the node.
  - `ADR-0055` D3-V2 is used as written.
  - `EPIC-011` § The per-change rule already says value-identical tickets keep S2 and play no games.
  - **No bar, NFR level, rule or scope moves.**
- **Inputs read:**
  - `ABC-298`'s page;
  - `…5a155b2c`, `…569849c4` § 3, `…a28aa29f`, `…0b4bc6ba`;
  - `ADR-0055` D3, its two addenda of 2026-11-01 (D3-V2), § Where a node's time goes, and its dated status lines;
  - `ABC-254`'s page (A3, A4, the miss rules);
  - `ADR-0076` d4, d6, d7 and d10, with their dated lines;
  - `ADR-0003` (1-A), (1-R) and (3-A);
  - `ADR-0025` § the live read of word 2;
  - `ADR-0063` § Context;
  - `EPIC-011` § The per-change rule;
  - on `main`: `src/search.ts` (`negamax`, `searchRoot`, `orderMoves`, `orderKey`, `historyIndex`, `countermoveIndex`, `moveCountFrom`, `recordHistoryCutoff`, `futileMove`), `src/engine.ts` (`negamax`, `runIteration`, `countNode`), `src/transposition.ts` (`probeTable`, `entryMove`, `storeEntry`), `src/legal.ts`, `src/moves.ts`, `src/quiescence.ts`, `src/see.ts`, and the test files that mock `./legal.ts` or `./transposition.ts`.

## Decision log

| date (UTC) | by | what | record |
|---|---|---|---|
| 2026-11-08 | Architect/Design | PROPOSED: the form with the depth-1–2 gate, the legality seam, the identity duty, captures-first out, SG0–SG3 with SG3's bar and spread rule, the count probe and its stop rule, no games, the order with the freeze first, `kingExposure` out, `NFR-008` line, the stop. Nothing run | `arch-ABC-298` |

## Context

### What `main` does today (tree `bba42fb7`)

Both full-width recursions, `src/search.ts` `negamax` and `src/engine.ts` `negamax`, run one sequence at a node below the root:
1. count the node;
2. the repetition check;
3. the leaf;
4. `probeTable`, then `tableCutoff`;
5. the null move;
6. then **`legalMoves(position)`**, which builds and filters every move;
7. if the list is empty, mate or stalemate;
8. `entryMove(slot, moves)`: a live read of the slot's word 2, matched against the list;
9. `futilityNode`, and `bestMove = moves[0]`;
10. `countermoveAt(previous)`;
11. **`orderMoves`**, which reads the history table and the countermove for every key, puts the hash move first under `HASH_MOVE_KEY`, and fills `ORDER_KEYS`;
12. `moveCountNode`, and `moveCountFrom`, read from `ORDER_KEYS` straight after the sort;
13. the loop, whose index 0 is the hash move.

**The sort is done before the hash move's subtree is searched.** The roots (`searchRoot`, and `runIteration` in `src/engine.ts`) build the list too, and a root never cuts off. Quiescence reads none of these tables and writes none of them.

### What `…5a155b2c` missed: the order's keys are not fixed
- **Two of the order's keys are read from tables the search writes as it goes:**
  - the history cell of each quiet move, `HISTORY[colour × from × to]`, keyed by the **mover's colour** (`historyIndex`);
  - the countermove, `COUNTERMOVE[coloured piece × to]` of the node's previous move (`countermoveIndex`).
- **Who writes those cells.** `recordHistoryCutoff` writes them at a full-width node, remaining depth ≥ 1, on a quiet beta cutoff.
  - At a node where side T is to move, it writes T's history cells, and the countermove cell of the opponent's previous move.
  - So the cells a node with side S to move reads are written only by **nodes where S is to move again**.
- **Below a node of remaining depth d,** the hash move's child, with the opponent to move, sits at d − 1. Its children, with S to move, sit at d − 2 or less. (A null move at the child reaches S at d − 5.)
  - **So the hash move's subtree holds a writer of this node's cells only when d ≥ 3.**
  - At d = 1 the subtree is quiescence.
  - At d = 2 it holds opponent nodes at remaining 1, whose writes go to the opponent's history cells and to the countermove cell of the hash move, which is S's piece. They never touch the cell this node reads.
- **The killers** at this ply are written only at this ply, never by a deeper node. **SEE** is pure, with scratch only. **The table** is not read by the sort.
- **So under V3, sorting after the hash move's subtree reads exactly today's keys at remaining depth 1 and 2, and not above.** At d ≥ 3 a later quiet move's order would follow the subtree's history writes. Then the late-move reduction index, the move-count tail and futility's index would follow too. Node identity would be lost, and with it the whole case for V3 (`…5a155b2c` § The pick).

### Why it can pay
- **82.3 % / 81.9 % of cutoffs fall on the first move** (`ADR-0063` § Context). At a node with a hash move, the first move is the hash move. Each such cutoff built, filtered and sorted a list it did not use.
- **How much time that is, is `UNKNOWN - verify`.**
  - The only profile on record puts generation and legality at 47.4 / 44.9 / 50.5 % of time, and ordering at 5.5 / 6.6 / 6.5 % (`ADR-0055` § Where a node's time goes). Quiescence's capture generation is inside those figures.
  - That profile came before `ABC-235`, `ABC-240` and `ABC-254`.
  - The share of full-width nodes at remaining depth 1–2 that have a legal hash move is not on record. Such nodes get one only from:
    - a transposition;
    - a PVS or late-move re-search of the same child;
    - an earlier iteration that reached them by another path.
    One iteration back, a node at remaining 1 was a leaf, and a leaf stores nothing. So the gate may cut away much of the hash moves the estimate counted on.
- **The estimate is judgement.** `…5a155b2c` gave 1.03–1.10× nodes per second and +3 to +15 Elo by `ADR-0055`'s 50–100 Elo a doubling, **before the gate.** With the gate I put it lower: the speed bar is now below even odds. The page's +10–30 (`ADR-0056` D2) was for the full staged form.

### Where it costs
At a node where the hash move exists and does not cut off, V3 pays for the check and then for the full list anyway. If such nodes outweigh the cutoffs, V3 is slower. SG3's third-board floor of ≥ 1.00× is there for that case.

### What `ABC-254` taught about the reading
- Two A4 reads of lazy legality came back UNRESOLVED under D3's 5 % spread rule, because foreign load arrived within a minute.
- D3-V2 (blind admission, a fixed count and a cap) then graded it 1.112 / 1.120 / 1.106 (`qe-ABC-254-a4v2` `…7aaf058c`).
- Since 2026-11-05, timing reads also need the owner's word that the whole host is quiet. The slot gate alone failed twice.

## Decision

1. **The form: `…5a155b2c`'s, gated at remaining depth 1 and 2.**
   - **Where it acts:** a full-width node below the root, in both recursions, when all of these hold:
     - the probe hit (`slot !== -1`);
     - the table is on, and the ordering is `"full"`;
     - **the remaining depth is 1 or 2.**
     The first conditions are exactly where today's list puts the hash move first. The last is § Context's bound. One named constant holds the 2, with that reason in its comment.
   - **Everywhere else, the code path is today's.** That includes:
     - every node of remaining depth 3 or more;
     - the roots and quiescence;
     - every door with the table off, and the two ordering doors.
   - **The sequence at such a node:**
     1. The same steps as today up to and including the null move.
     2. **Read the slot's move bits, live, once:** word 2 at this point, as `entryMove` reads it today. Read `countermoveAt(previous)` here too, as today's code reads it before any child: one array read.
     3. **Check the move for legality without the list** (d2). If it is not a legal move here, there is no hash move, and the node runs exactly as today from `legalMoves` on.
     4. **Search the hash move first**, as index 0, by today's loop body. That means:
        - futility never skips index 0;
        - the move-count rule counts it if it is quiet;
        - `lateMoveReduction` gives 0 at index 0;
        - `searchMove` gives it the node's own window.
     5. **If it cuts off,** make the writes today's cutoff at index 0 makes (d3 item 10), store, and return. Nothing is generated.
     6. **If not,** run `legalMoves` and `orderMoves` as today, with the same hash move and the countermove read in step 2. The list's first entry is the hash move's twin. The loop runs from list position 1, with `index` 1, and carries `best`, `bestMove`, `alpha` and `searchedQuiets` from step 4.
   - **Nothing else changes:**
     - the order's keys and tiers;
     - the killers, history and countermove tables;
     - the table's layout and replacement;
     - `generateMoves` and `legalMoves`;
     - quiescence;
     - the roots;
     - the evaluation.

2. **The legality check without the list: the seam.**
   - **Its contract is an oracle.** For any position and any move bits, it returns exactly what `entryMove(slot, legalMoves(position))` returns today:
     - `null` when no legal move packs to those bits;
     - otherwise a `Move` whose six fields (`from`, `to`, `piece`, `captured`, `flags`, `promotion`) equal the listed move's.
     The position is byte-identical on return.
   - **Pseudo-legality from the generator's own code.** `src/moves.ts` gains one export: the moves `generateMoves` emits for the piece on one square, with castling for a king on its home square.
     - It is exactly `generateMoves(position).filter((m) => m.from === from)`.
     - It calls the same per-piece helpers (`addPawnMoves`, `addStepMoves`, `addRayMoves`, `addCastlingMoves`), so every field comes from the code that builds today's list.
     - **`generateMoves` itself is not edited,** so perft and `NFR-001`'s perft half are not touched.
     - This is `ABC-235` cut 3's form (`generateCaptures` walks as `generateMoves` walks), held together by an oracle row in `src/moves.test.ts`.
   - **Legality by make/test/unmake.** `src/legal.ts` gains one export: find the matching move in that list, then test it with `staysSafe`. The king square is `move.to` for a king move, else the king's square. The board-only form ((c3), which (1-A) allows) applies to an unflagged move; a flagged move takes the full `makeMove`.
     - **It always tests.** It skips none of (1-A)'s four classes. (1-A) says a check may include too much and never too little, so this gives the full filter's answer by construction.
     - It uses no pin scratch, so it cannot disturb a filter's shared scratch, which (1-A)'s last rule guards.
   - **The read of the move bits stays in `src/transposition.ts`,** which owns `packMove`. It is a live read of word 2, as `entryMove` is (`ADR-0025`). It never reads the verified copy (`hitData`).
   - **Names and signatures are the Engineer's,** with no import cycle. `entryMove` stays for the roots and the gated-out nodes.
   - **`ADR-0003` fit.**
     - Make/test/unmake stays the legality test (clause 1, (1-A)).
     - Nothing is cached on `Position` (`ADR-0020`).
     - No move is searched untested, so this is not pseudo-legal search, which (c1) still forbids.
     - The full filters stay the oracle.
     - No amendment is needed. If the owner reads it otherwise, it becomes a dated line there, not a change here.

3. **The identity duty, in full.** Each item states what keeps it and what checks it. SG1 checks all of them together.

   | # | duty | what keeps it | checked by |
   |---|---|---|---|
   | 1 | **both recursions** | the same change in `src/search.ts` `negamax` and `src/engine.ts` `negamax`. In `src/engine.ts`, the hash move's make and unmake sit in the same `try`/`finally` as today's loop, so an abort unmakes and stores nothing. The roots (`searchRoot`, `runIteration`) and `src/quiescence.ts` are unchanged | SG1 (a) `search()` and `chooseMove`; SG1 (b) every door |
   | 2 | **the order's keys: the gate** | at remaining depth 1 and 2, no node in the hash move's subtree writes a history or countermove cell this node's sort reads (§ Context). The killers at this ply are written only at this ply. Above depth 2, today's path runs. **The gate is part of identity, not a tuning knob:** raising it breaks identity | SG1: every row reaches depth 3 and above, where the old path must hold, and the boundary between them |
   | 3 | **the countermove key** | read before the hash move's subtree, as today: one array read, in step 2. That holds even where the gate already makes a later read equal | SG1 |
   | 4 | **when the move bits are read** | live word 2, after the null move, once. It is never re-read after the hash move's subtree, which can store into the same slot (`ADR-0025`) | SG1 |
   | 5 | **the same `Move`** | the six fields come from the generator's own helpers (d2). Nothing in either recursion compares moves with `===`: killers, history, the countermove and the table all compare or pack by fields | SG2 (a), (b) |
   | 6 | **the order after no cutoff** | `orderMoves` gets the same hash move, so the twin takes `HASH_MOVE_KEY`, the unique top key, and sorts first. The loop starts at list position 1. Every later move has today's list position and index | SG1 |
   | 7 | **`moveCountFrom`** | still read straight after `orderMoves`, before any recursion reuses `ORDER_KEYS`. The hash move's subtree now runs before the sort, not between the sort and the read. `zeroFrom` indexes the full list, position 0 included | SG1. `moveCountNode` fires at remaining 1–3 inside every row |
   | 8 | **`searchedQuiets`** | the hash move counts as one if it is quiet and the node's move-count limit is above 0, as today's loop counts it at index 0 | SG1 |
   | 9 | **futility's index** | the hash move is index 0, and `futileMove` never skips index 0. `futile` is computed with `alphaIn`, the entry alpha, never the alpha after the hash move | SG1 |
   | 10 | **a cutoff by the hash move, before any list** | the same writes as today's cutoff at index 0: `recordHistoryCutoff`'s bonus to a quiet cutter and its countermove cell, with no malus (no move came before it); `killers.record(ply, hashMove)`; then `storeEntry(key, depth, boundOf(best, alphaIn, beta), best, ply, hashMove)`. `recordHistoryCutoff` takes a list today, so the Engineer feeds it the cutter without allocating a list per cutoff | SG1 (`chooseMove` keeps history and killers across iterations) |
   | 11 | **`moves[0]`** | today's default `bestMove` is never stored: the first move in the list is always searched (futility and the move-count rule never skip index 0), and any finite score beats −∞. In V3 the hash move is that first move, so `bestMove` starts as the hash move, and `storeEntry` stores the same move | SG1. The stored move feeds the next iteration's hash move, so a wrong one changes `chooseMove`'s counts |
   | 12 | **mate and stalemate when no list exists** | a legal hash move proves the side to move has a legal move. So the node is neither mate nor stalemate, and today's empty-list branch was already unreachable there. On the path without a hash move, and after a hash move that did not cut, the branch stays where it is. No other end of game is checked at an interior node today (`leafScore` checks at the leaf), and none is added | SG1 (b): the 190 and the `ABC-078` A3 corpus hold mates; the same-depth mate floor rows on the 287 |
   | 13 | **pure helpers after the hash move** | `futilityNode` and `moveCountNode` read only the position, which make/unmake restores byte for byte, and the evaluation's memo, whose values are pure. They may be computed after the hash move's subtree, to save them on a cutoff. If the Engineer is unsure of one, it stays where it is today | SG1 |
   | 14 | **tests that narrow `legalMoves`** | `src/search.capacity.test.ts` and `src/engine.capacity.test.ts` mock `legalMoves` to its first move, and give every key a fresh value, so no probe can hit and the new path never runs. V3 adds a second route to a move that such a mock does not narrow | the Engineer reads both. QE's freeze lists every file that mocks `./legal.ts` or `./transposition.ts`, and each stays green unchanged |
   | 15 | **the node count and the clock** | generation counts no node. The clock is read every `NODES_PER_CLOCK_CHECK` nodes (`countNode`), so the same nodes give the same clock reads, and an abort lands on the same node | SG1 (b) clock reads; the UCI deep pins (§ The pins this ticket moves) |

4. **Captures before quiets: out.** It could be made exact, but not by construction. So it stays out.
   - Today's first tier after the hash move is **captures and every promotion**, underpromotions included, tied by generation order. `generateCaptures` yields captures only. A stage would need a new generator for that set, in that order.
   - With `seeOrdering` on, a losing capture sorts **after the killers and the countermove**. So the stage would also need the killers and the countermove checked for legality without the list: two more routes like d2.
   - `moveCountFrom` and every index are read off the full sorted list. A staged list would have to rebuild both.
   - § Context's bound applies to it too. A capture searched before the quiet moves are sorted lets that capture's subtree write history first, so it too is exact only at remaining 1–2.
   - **Then identity would rest on two generators agreeing on order.** SG1 samples that at a few roots and depths; it does not prove it. SG0's perft walks no staged search.
   - **Its gain over the hash stage is unmeasured.**
   - **It comes back only** after V3 merges, with a fresh profile showing generation still worth cutting, under its own ADR and the owner's word (§ The owner's questions, 2).

5. **No switch and no door.** `ADR-0026`'s door pair is for a change to the value. This change is node-identical, so a door would read itself. The precedents are `ABC-235`, `ABC-240` and `ABC-254`. Identity is held against QE's frozen figures on `main` (d9), and every existing door row is part of SG1.

6. **The bars of `ABC-298`, pre-registered.** None is new in kind, and none is loosened after Ready. Each can be met by a correct build.

   | row | what | lane | the bar |
   |---|---|---|---|
   | **SG0** | perft | default and `PERFT_DEEP=1` | `src/perft.test.ts` passes 32 / 32 at the head. The file is byte-identical to the freeze's blob |
   | **SG1 (a)** | the shipped path, frozen | `SEARCH_DEEP=1` (existing file) | `search()` at depth 8 on kiwipete and position-6. `chooseMove` with `maxDepth` and `now: () => 0` at kiwipete depths 8 and 9, and position-6 depths 8, 9 and 10. Nodes, root move and score equal the freeze exactly. Where a row on `main` already pins one (the `ABC-303` depth-8 rows), it is that row, figure unchanged |
   | **SG1 (b)** | every door, out of tree | QE's, against the build's merge-base | `ABC-254` A3's `G4` form, by reference: the `ABC-078` A3 corpus and `ABC-121`'s 190 at fixed depth 5, every door, `chooseMove` at budgets 3 and 5 on `tickingClock(1)`. Move, score, depth, nodes and clock reads byte-equal to base |
   | **SG1 (c)** | every existing row | all lanes | every door, count and deep row on `main` stays green, with no expected figure changed. `git diff <freeze>..<head> -- 'src/*.test.ts'` adds rows and changes none |
   | **SG2 (a)** | the check, by hand | default (existing files: `src/legal.test.ts`, `src/moves.test.ts`) | returns the oracle's answer, with field-equal moves, and leaves the position byte-identical (FEN and Zobrist key). Cases: a legal castle; a castle whose right is set but which passes an attacked square, or whose rook is absent; a legal en passant; an en passant that exposes the king along the rank; a pinned piece leaving its line; a king stepping into attack; an under-promotion; a promotion field on a non-promotion move, and none on a last-rank push; an empty or enemy from-square; a slider through a blocker; a non-evasion in check; a non-king move in double check. Plus the per-square generator's oracle row |
   | **SG2 (b)** | the check, by walk | `ENGINE_DEEP=1` | on `ABC-254` A1's two walks, at every position: each legal move's bits return a field-equal twin, and the bits of every legal move of the parent position (a natural stale set) return the oracle's answer. 0 mismatches, 0 mutations |
   | **SG2 (c)** | never played | default | a search whose table holds an illegal or stale move at a node of remaining depth 1 or 2 that it reaches never makes that move (a `makeMove` spy), and returns a legal move with the position restored |
   | **SG3** | speed | held host | d7 |
   | gates | as `ABC-254` A5 | — | `npm run lint`, `typecheck`, `test` and `build` green at every commit; `G1` 54 / 58 with rows equal (`PUZZLE_DEEP=1`, a virtual clock, so node-identical means equal); `G4` = SG1; `G6` "≥ base" (d7); `G7` growth 0; `NFR-008` (d11) |

7. **SG3: the bar and the spread rule, fixed here, before any reading.**
   - **The instrument: S2, by `ADR-0055` D3 as amended by D3-V2** (§ Addendum — 2026-11-01), unchanged. It is the instrument `qe-ABC-254-a4v2` graded with, and that the second addendum's item 2 names for search reads:
     - `chooseMove` at 4 000 ms on the wall clock, one fresh process per run, base and head on the same Node binary;
     - **boards:** kiwipete, position-6 and the start position;
     - **statistic:** per board, head's median nodes per second ÷ base's median;
     - 5 admitted pairs per board, interleaved, base first when the admitted count is even and head first when it is odd;
     - **admission, blind to build and outcome:** no foreign vitest or `cutechess-cli`; both runs at ≤ 0.8 foreign cores; after-run Tctl below 85 °C. A pair that is not admitted is discarded and logged;
     - at most 15 attempts per board per schedule; fewer than 5 admitted is VOID-LOAD.
   - **The spread rule: D3's 5 %.** It is (max − min) / median per build and board. Above it, the board takes one re-run, then VOID. **No term here loosens it.**
   - **The agreement guard** (D3-V2 item 4) reads this bar's two numbers, 1.03 and 1.00. If the median paired ratio and the graded ratio fall on different sides of either, the board takes its one re-run, then VOID.
   - **The bar: MET when head ÷ base is ≥ 1.03 on at least two boards and ≥ 1.00 on the third.** This is `ABC-254` A4's shape, at this ticket's number.
   - **Why 1.03.**
     - It sits at the low end of `…5a155b2c`'s estimate (1.03–1.10×, judgement, made before the gate). Below it the gain is under about 2–4 Elo, by `ADR-0055`'s 50–100 per doubling (log₂ 1.03 ≈ 0.043).
     - That is less than a second legality route in both recursions is worth keeping. The route carries a permanent identity duty (d3).
     - It is about five times the one null pair on record (within 0.6 % of 1.00 on three boards, second addendum item 3).
     - D3-V2's false-pass estimate, about 6 × 10⁻⁴ a board, does not depend on the bar's level. Two of three boards must pass.
     - The precedents bracket it without setting it: O1-c (S) 1.03 and O1-a (M) 1.02. I take 1.03 for the reasons above, not because it is old.
   - **Why the third board is ≥ 1.00:** V3 can lose at nodes whose hash move does not cut off (§ Where it costs). The floor rules out a board where it is slower.
   - **Why no in-check board.** `ABC-254` read `position-4` because its in-check path changed. V3 has no in-check path of its own: in check, the hash move takes the same make/test/unmake as any move, and the floor above covers a loss.
   - **Why 4 000 ms and not 100 ms.** Node rate is a property of the build. A 100 ms process is dominated by start-up and JIT warm-up, and D3-V2 was calibrated on 4 s searches. More nodes per second gives more depth at every time control, 100 ms included.
   - **`G6` "≥ base"** (`NFR-005`) is read in the same held window, after SG3.
   - **The host.**
     - A held host: the owner's word that the host is quiet, covering his other projects, with a `ps` check first.
     - The host lock is held for the whole session, and one process runs at a time.
     - QE's pre-registration is sealed before the first timed run.
     - The brief records the window's start and end UTC, and that nothing else ran.
     - **About 15–30 min** (estimate): D3-V2's worst case is about 2.1 min a board a schedule, so three boards take about 6–8 min with a re-run, plus `G6` and set-up.
   - **Outcomes:**
     - **MET:** SG3 passes.
     - **NOT MET:** SG0–SG2 are green and the bar is missed. **Not merged.** QE records a `failed-attempt` note; BA/PM closes the ticket as dropped.
     - **VOID or VOID-LOAD:** not a result and not a miss. It may be re-read under a fresh pre-registration, on its own runs alone, never pooled.
     - **No sealed term is waived on a close figure.**

8. **No games, and why none are owed.**
   - **The rule says so.** `EPIC-011` § The per-change rule: *"Value-identical tickets keep the S2 nps reading and play no games."* The 100-game read is "per strength-changing ticket". A node-identical search changes no value at any depth.
   - **Games add no safety.** At a fixed depth, the move, the score and every node are `main`'s, and SG1 checks that exactly. The mate floors, zugzwang 7 / 7 and `G1` catch a change in what the search sees. Here there is none to catch. Under a clock, the only difference is the depth reached, and S2 measures the rate behind it directly.
   - **Games could not see the gain.** C2′ resolves about ± 48 Elo at 95 %. The gain here is a few Elo by estimate.
   - **Where it is counted:** the epic's 400-game close read (`ABC-299`, R3) carries every merged change, this one included.

9. **The order: the count probe, then QE's freeze, then the build. The dispatch can check it.** This is `ADR-0076` d10's form. No step moves a bar, and each names its proof.

   | # | step | who | what proves it |
   |---|---|---|---|
   | 1 | he answers § The owner's questions | owner | his word, in an Orchestrator note |
   | 2 | status and dated lines; `ABC-298`'s page: title and scope narrowed to d1, SG rows as d6, test note 1 pointing here, the `NFR-008` line; DoR 10 / 10 | Architect, BA/PM | merged records |
   | 3 | **the count probe, `arch-ABC-298-probe`**, as written below, under the host lock. It is untimed, so no held host is needed. Its plan cites this line and is sealed before it runs | Architect | a sealed `decision` note: GO or STOP |
   | 4 | **the freeze, `qe-ABC-298-freeze`**, only on GO, on `main`'s tip, under the host lock. It is not a timing read. It holds: SG1 (a)'s table (nodes, root move, score); base's SG1 (b) outputs, as a digest; the blob hash of `src/perft.test.ts`, with the deep perft read 32 / 32; the list of every door and deep row on `main`, by file and title, with its figures; the list of files that mock `./legal.ts` or `./transposition.ts`; and the `src/` tree id it read. No V3 code exists to see | QE | a sealed `decision` note, merged to `main` |
   | 5 | **the check:** before any build dispatch, the Orchestrator confirms `git merge-base --is-ancestor <freeze commit> main`, that `main`'s `src/` tree is the freeze's, and that the brief cites the freeze note's id | Orchestrator | a line in the dispatch note. **No id, no dispatch.** If `src/` moved, step 4 runs again first |
   | 6 | the build (M), on `main` after step 5 | Engineer | its first commit descends from the freeze commit. If any identity row reddens, a STOP: back to the Architect, never a re-pin |
   | 7 | QE: stage 0 re-reads step 6's ancestry and the freeze hashes; then SG0, SG1, SG2, the gates and `NFR-008`; then SG3 and `G6` in one held window, on a sealed pre-registration | QE | the verdict |
   | 8 | UAT: production lines, so it is owed unless the standing waiver applies. A trusted QE verdict signs it (the owner's delegation of 2026-10-22) | QE, Orchestrator | the verdict as a decision |

   - **Why a probe now.** The gate (d1) may leave few nodes with a hash move, and that share can be **counted**, deterministically, with no timing. A count gives a hard upper bound on the gain, and the bound can stop the work before an M build, a freeze, a QE hop and a held window. Without the gate I would have said the build's SG3 is the probe. With it, a cheap stop is worth having.
   - **The probe, written here, not run.**
     - **Instrument:** a scratch copy of `main` at the accepted tip (`git archive`, never `src/`), with counters in `src/engine.ts` `negamax`, the shipped `chooseMove` path SG3 times. `chooseMove` with `maxDepth` 9 and `now: () => 0` on kiwipete, position-6 and the start position. One run each, under the host lock, on one core.
     - **Counts per board:**
       - G: full-width nodes below the root that reach `legalMoves` today;
       - H: of those, the nodes inside d1's gate whose `entryMove` is not null;
       - C: of H, the nodes whose hash move cut off at index 0.
       - **INFO:** H and C at every depth, and the total node count. That shows what the gate costs.
     - **The share: s = C ÷ G.**
     - **The rule, fixed now.** **STOP if s < 0.048 on at least two of the three boards.** Then V3 cannot reach 1.03 on two boards, and it closes as "none", with no freeze and no build. Otherwise GO, to step 4.
     - **The basis.** The speed-up is at most 1 / (1 − 0.6 × s). The 0.6 is above the largest share the only profile gives generation, legality and ordering together (about 57 %, with quiescence inside it). The check's own cost is taken as 0. Then 1 / (1 − 0.6 × 0.048) ≈ 1.0297, just under 1.03. The one assumption is that a skipped generation saves an average one. It is stated, and it is the probe's only judgement.
     - **What GO means:** only "it can pay". It says nothing about the bar, and no figure of it enters SG3.
     - **What it cannot change:** the probe creates no V3 code and reads no SG1 or SG3 figure. The freeze stays blind.
     - **About 5–15 min of lock,** an estimate.
   - **If the order is missed** (a build commit with no freeze commit behind it), SG1 is not met to the letter, as `ADR-0076` F7 says of its own order, and QE says so. Whether the ticket may still merge is the owner's call.

10. **d6's `kingExposure` cut: it stays out.** It does not share V3's held window, now or as a separate arm.
    - **It is not ready.**
      - It has no ticket, no page, no freeze and no build.
      - It needs `ADR-0076` d4's file word in the pawn memo, which never reached `main`. That also needs the `doubled`/`isolated` fold, or +4 bytes a slot with an `NFR-009` line.
      - Its value identity was read only on the probe's tree (28 400 positions, `…569849c4` § 3), not on a patch of `main`.
      - Waiting for it would hold V3.
    - **Its instrument is different.** It is read by `G2`, a per-call ratio of the evaluation in `ADR-0067` d8's A5 shape: two sessions in reverse, a `main`-copy control, and a void window. SG3 reads node rate under D3-V2. One window would hold the host for two protocols, with two pre-registrations.
    - **It must never sit on V3's head.** On one head, S2 would read both gains together, and V3's 1.03 would be confounded.
    - **What stays open, for the Orchestrator:** `…569849c4`'s answer stands. It is real and small, and not worth a held window on its own. If it is ever cut as its own value-identical ticket, its own design and bar come with it. If its build is ready when V3's SG3 runs, it may run in the same held session as a **separate arm** against its own base, under its own pre-registration. It is not bundled into V3's identity, and V3's reading never waits for it.

11. **NFRs.**
    - **`NFR-008`: ≤ +0.10 s stands.** No figure above it is proposed: that would move a bar. BA/PM writes the line on the page.
      - The expected cost is small, and an estimate (`UNKNOWN - verify`).
      - SG2 (a) and (c) add about 15–20 units, in existing default-lane files, at about +0.005 s.
      - About 2–4 KiB more production code in four imported files adds about +0.01 to +0.04 s, by `ADR-0076` d7's scale.
      - **No new default-lane file:** `R-N8H-3` prices a new file at about 0.058 s.
      - SG1 and SG2 (b) are deep-lane rows only. Headroom is 0.915 s at `bce24018`.
      - If it reads over, `NFR-008` is UNRESOLVED by `…a49d69d7` § 5's form, not a defect, and the ticket does not merge while over. The route comes to the Architect. The owner's "games first" answer has nothing to act on here, since there are no games.
    - **`NFR-009`: no new table.**
      - The check allocates no fixed structure. If the Engineer uses a fixed scratch for the per-square list, its bytes join `NFR-009` (a)'s sum, with a line on the page.
      - `G7`: growth 0.
    - **`NFR-005` (`G6`):** "≥ base" binds, read in SG3's window. A faster, node-identical build should raise it.
    - **`NFR-001`:** `generateMoves` is not edited, so the perft half does not move. Perft rates stay INFO.
    - **No new NFR file.** `plans/nfr-catalog.md` is untouched.

12. **Intent and the stop.**
    - **Intent: SPEED, value-identical.** It is fixed here and never re-classed after a figure is seen.
    - **The stop:**
      - **If identity cannot be kept, V3 stops.** It does not become a move-changing ticket, with a door and C2′. It closes, and comes back as "none" (`…5a155b2c`).
      - "Cannot be kept" means an SG1 or SG2 row that reads red after a defect check, where no fix inside d1 and d2 makes it green.
      - A fix that changes the order, the keys, the gate or which moves are searched is outside d1. So it is a stop, not a fix.
      - The probe's STOP closes V3 the same way.

## The pins this ticket moves

**None expected.** `ADR-0071` D8's form. Every row below must read its `main` figure. A change in any of them is a failure of identity (F2), a defect, and never a re-pin.

| rows | lane | where | why it holds |
|---|---|---|---|
| `ABC-282` A0-3 (`D8`, `D7`, `D6`): `info depth … nodes … time … nps … pv` | `ENGINE_DEEP` | `src/uci-session.test.ts` | the clock is virtual or stepping, and is read every 1 024 nodes, so the same nodes give the same clock reads and lines |
| `ABC-282` A0-1, A0-2 | `ENGINE_DEEP` | `src/engine.test.ts` | the same |
| `ABC-283` P0 and the bundle's counts; `ABC-303`'s counts at depth 8 | `SEARCH_DEEP` | `src/search.bundle.test.ts` | SG1 (a) and (c) |
| the same-depth mate floor on the 287, both recursions | `SEARCH_DEEP` | same | SG1 (c) |
| `G1` 54 / 58 rows | `PUZZLE_DEEP` | `src/puzzle-suite.test.ts` | a virtual clock |

A deep row outside this table that reddens in the build is a STOP to the Architect, as on `ABC-291`.

## The plain case

**My recommendation: accept it, and let the count probe decide whether to build.** This is judgment, not a reading.

**For:**
- **Its safety is exact, not a guess.** It is the only held search ticket where the checks that stopped earlier changes cannot fire: the same nodes, checked count for count (`…5a155b2c`).
- **The gain is at 100 ms.** More nodes per second is more depth at every time control.
- **No games, no door, no new table.**
- **Cheap stops.** The probe costs minutes of lock and can stop it before the build. A miss on SG3 is not merged and changes nothing on `main`.

**Against:**
- **It is small, and smaller than `…5a155b2c` thought.** The depth gate keeps only the nodes where identity holds, and those may hold few hash moves. My estimate is now a few Elo at best, with the speed bar below even odds. It does not move the engine toward 3 000 in any way the owner will see in games.
- **It adds a second route to a legal move,** in both recursions, with a depth gate that every later change to the node order must respect (d3).
- **Past the probe, it costs an M build, a freeze, a QE hop and a held window** for a figure that may read 1.02.

**When not to build:** if he does not want a few Elo for this cost, **"none" is a fair answer now**, and it saves even the probe. `…5a155b2c` found every other held search ticket a worse use of the host.

## The owner's questions

**1. Do you accept ADR-0077?**
- The engine keeps a memory of the best move it found in each position. Today, at every position, it first lists all its moves, then tries that remembered move first. Often that one move settles the position, and the list was built for nothing.
- With this change, near the end of each line it looks at, it checks the remembered move is legal and tries it **before** listing anything. If that settles the position, the list is never built. If not, it builds and sorts the list exactly as now, and skips the move it already tried.
- It does this only in the last two steps of each line. Deeper in the tree, trying the move first would change the order of the other moves a little, because the engine learns as it searches. Then it would no longer search exactly the same positions.
- So it looks at exactly the same positions as today, in the same order, and plays the same move at the same depth. It only gets there faster. That is checked by exact counts, not by games.
- **Two checks decide it:**
  - First, a short count with no stopwatch, a few minutes of the computer, shows whether enough positions could use the shortcut at all. If not, it stops there, before anything is built.
  - If it goes on, it is kept only if it is **at least 3 % faster on two of the three test positions, and not slower on the third.** That is measured once, with the computer quiet for about half an hour.
- **My recommendation: yes,** knowing the gain is small and may not come. "No" is a fair answer too, if you would rather spend nothing on a few Elo.

**2. If it misses, is that the end of V3?**
- A yes means no second, wider try after a stop at the count or a miss on the 3 %. A wider try would be sorting captures before the rest of the moves, or using the shortcut deeper in the tree. Both are harder to keep exact, and if the narrow form does not pay, the wider ones are unlikely to.
- A reading spoiled by other programs running is not a miss, and can be taken again.
- **My recommendation: yes.** With no answer, a miss closes V3, and a wider form would need its own ADR and your word anyway.

**A host ask, not a ruling:** if the count says go and the build is ready, QE needs a quiet window of about 30 minutes, with your other projects paused. The Orchestrator asks for it at the time.

## Alternatives

- **No depth gate, as `…5a155b2c` wrote it.** Not taken: § Context. At remaining depth 3 and above, the sort after the hash move's subtree reads history and countermove cells that subtree wrote, so the search is not node-identical.
- **Every depth, with a snapshot of the side's history half (16 KiB) per node.** Not taken. A node costs about 1.5 µs (`…024bbd63` K5), and a 16 KiB copy costs a large share of that, more than the generation it would save. A stack of them per ply is 2 MiB, an `NFR-009` line.
- **Every depth, with a journal of history writes rolled back for the sort and forward after.** Not taken. Every write would be undone and redone once for each ancestor still waiting to sort, and the journal must keep everything since the shallowest such ancestor, which grows with the search. That is a new, unbounded structure to save a generation.
- **Captures before quiets in the same ticket (the page's stage 2).** Not taken: d4.
- **The full staged generator, value-changing, behind a door with C2′.** Not taken. "If identity cannot be kept, V3 stops" rules out turning into this. It would bring the safety rows and 100 games for a gain that games cannot see.
- **Check the hash move by building the list and searching it first.** That is today's code. It saves nothing.
- **A legality check by case analysis** (geometry, pins and checks worked out, no make/test/unmake). Not taken: `ADR-0003` clause 1 forbids it without a new ADR, and it would be a new legality route with its own proof.
- **Search the hash move untested, and test only if it is played** (pseudo-legal search). Not taken: (c1) stays unauthorized under (3-A), and SG2 forbids searching an illegal move.
- **Read the move from the verified copy (`hitData`).** Not taken: `ADR-0025` keeps the live read on purpose. The null-move subtree can overwrite the slot, and today's read sees that.
- **The per-square generator by refactoring `generateMoves`' loop onto it.** Not taken: it would touch perft, `NFR-001`'s perft half and the S2 base. `ABC-235` cut 3's form, with an oracle row, keeps `generateMoves` byte-identical.
- **Hash first at the root too.** Not taken: a root never cuts off and must search every move, so it saves nothing.
- **A switch and a door for V3.** Not taken: d5.
- **No probe; the build's SG3 as the probe.** Not taken: d9. Without the gate it was my answer.
- **A probe with a fresh profile, to tighten the bound.** Not taken: it needs a held window about as long as SG3. The last conversion of this kind was low by a factor of four (`ADR-0076` d6, on `ABC-291`). The count with a generous 0.6 needs neither.
- **SG3 at 1.02.** Not taken: it would accept a gain of about 1.5–3 Elo for a permanent second route. 1.02 is O1-a's number, and nothing here borrows it.
- **SG3 at 1.10 (`ABC-254`'s).** Not taken: it is above the estimate, and it would fail a build that pays.
- **SG3 on the paired-ratio median, or a 10 % spread.** Not taken: D3-V2 rejected both. The first is a new number, and the second loosens the instrument.
- **An in-check board (`position-4` ≥ 0.97).** Not taken: d7.
- **100 games anyway.** Not taken: d8.
- **`kingExposure`'s cut in the same window or on the same head.** Not taken: d10.

## What would falsify this

| # | clause | what would falsify it | if it fires |
|---|---|---|---|
| F1 | SG0 | perft red at the head, or `src/perft.test.ts` changed | a defect: generation is wrong. Back to the Engineer |
| F2 | d1–d3, SG1 | any SG1 row, door row or deep pin differs from the freeze | a defect check first. If a fix inside d1 and d2 makes it green, it is fixed and read again. If none can: **the stop** (d12). Never a re-pin. The defect check reads the gate and § Context's bound first |
| F3 | d2, SG2 | the check differs from the oracle, mutates the position, or an illegal move is made | a defect. Back to the Engineer; the Architect reviews the fix against `ADR-0003` (1-A) |
| F4 | d7, SG3 | the bar is missed with SG0–SG2 green | NOT MET, not merged, a `failed-attempt` note, BA/PM closes it as dropped. With question 2 yes: V3 closes |
| F5 | d9, the probe | s < 0.048 on at least two boards | STOP: V3 closes as "none". No freeze, no build |
| F6 | d9, the order | a build commit with no freeze commit behind it | SG1 is not met to the letter, and QE says so. No reading makes it met. Whether it may still merge is the owner's |
| F7 | d11 | `NFR-008` over +0.10 s | UNRESOLVED, not a defect; it does not merge while over. To the Architect |
| F8 | d10 | V3's head carries any evaluation change | SG3 is not graded. Back to the Engineer |

## Consequences

- **Play:** the same move at every fixed depth. Under a clock, deeper by whatever SG3 reads. Nothing else is expected to change.
- **Records owed by BA/PM, after his answer:**
  - `ABC-298`'s title and scope narrowed to d1, with the gate at remaining depth 1–2, and stages 2 and 3 out, per d4;
  - SG0–SG3 as d6 and d7 write them;
  - test note 1 pointing at d9;
  - the `NFR-008` line at ≤ +0.10 s;
  - DoR row 10;
  - `EPIC-011`'s V3 row.
  - Size stays M.
- **Owed by the Architect:** status and dated lines after his answer; the probe under its own task (d9 step 3).
- **Owed by QE:** the freeze on GO (d9 step 4), then the verdict.
- **Owed by the Orchestrator:** d9's check before the build dispatch, and the held window.
- **Host:**
  - the probe: about 5–15 min of lock, untimed;
  - the freeze: untimed, under the lock, a few minutes, `UNKNOWN - verify`;
  - SG3 and `G6`: one held window of about 15–30 min.
  - No game.
- **File collisions:** `src/search.ts`, `src/engine.ts`, `src/legal.ts`, `src/moves.ts` and `src/transposition.ts`, one at a time with any ticket that edits the node order or legality.
  - `ABC-283` and `ABC-288` are done. `ABC-284`, `ABC-257`, `ABC-285`, `ABC-296` and `ABC-297` are parked or held. Whichever builds after V3 carries d3's duty.
  - **A later change that makes the sort read a table a deeper node writes,** or that adds an extension near the leaves, must re-read § Context's bound against the gate.
- **Determinism (`ADR-0027`):** unchanged; the same nodes give the same clock reads. **Licence:** nothing taken from elsewhere. **Security:** none.
- **Threads:** `ADR-0062` is parked and `Threads` stays 1. The live read of word 2 is the same read `ADR-0025` already reasons about under sharing.

### `UNKNOWN - verify`
- Every reading: the probe's s, SG3's ratios, `G6`, the `NFR-008` cost, the freeze's and the probe's run times.
- Today's share of a node's time in `legalMoves` and `orderMoves`.
- The share of full-width nodes at remaining depth 1–2 with a legal hash move, the share where it cuts off, and the share where it exists and does not.
- Whether the check's cost at nodes that do not cut off outweighs the saving on any board.
- The Elo figures: every one is `ADR-0055`'s conversion of an estimated speed-up.

## Rollback

- **Before the merge:** this ADR reads "proposed, not accepted", or "accepted, not in force". Nothing on `main` changes.
- **After the merge:** revert the one merge. There is no table, door, rule or pin to undo. Every later S2 base is then `main` without V3. No game read is staled, since V3 changes no value.
