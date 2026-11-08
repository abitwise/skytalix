# arch-ABC-298 observation: `…5a155b2c`'s V3 form is node-identical only at remaining depth 1 and 2. Today the sort runs before the hash move's subtree; under V3 it runs after, and from depth 3 that subtree writes the history and countermove cells the sort reads

Architect/Design, task `arch-ABC-298`, records only. Read from `src/search.ts` and `src/engine.ts` at `main` `36baff11` (`src/` tree `bba42fb7`). Nothing was run.

## What the code does
- **The sort runs before the hash move's subtree.** In both full-width recursions, `orderMoves` runs before the loop. The loop's index 0, the hash move, is searched after the sort.
- **The order's keys read two mutable tables:**
  - each quiet move's `HISTORY` cell, keyed by mover's colour × from × to (`historyIndex`);
  - the countermove, `COUNTERMOVE` keyed by the previous move's coloured piece × to (`countermoveIndex`, read by `countermoveAt` before the sort).
- **Who writes those cells.** `recordHistoryCutoff` writes them at a full-width node (remaining depth ≥ 1) on a quiet beta cutoff. At a node with side T to move, it writes T's history cells and the countermove cell of the opponent's previous move. Quiescence and SEE write neither, and the killers at a ply are written only at that ply.

## What follows
- **For a node with side S to move at remaining depth d,** only nodes with S to move again write the cells its sort reads.
  - In the hash move's subtree those sit at d − 2 or less (d − 5 through a null move).
  - **So the subtree holds such a writer only when d ≥ 3.**
- **`…5a155b2c`'s form** says: search the hash move before the list, then "build and order exactly as today". That moves the sort after the subtree. At d ≥ 3 it reads keys the subtree changed. A later quiet move's place can then move, and the late-move reduction index, the move-count tail and futility's index move with it. The search is then not node-identical.
- **At d = 1 and 2 it is exact.** At d = 1 the subtree is quiescence. At d = 2 its full-width nodes have the opponent to move, and their writes go to the opponent's history cells and to the hash move's own countermove cell.

## What I did with it
- **`ADR-0077` d1 gates V3 at remaining depth 1 and 2, and keeps today's path at 3 and above.** It reads `countermoveAt` before the hash move's subtree, as today.
- **The gate may leave few hash moves.** One iteration back, a node at remaining 1 was a leaf, which stores nothing. So `ADR-0077` d9 puts a count probe first, untimed, with its stop rule fixed: STOP if C ÷ G < 0.048 on two of three boards.
- **Rejected:** a 16 KiB history snapshot per node, and a write journal. Each costs more than the generation it would save (`ADR-0077` § Alternatives).

## Confidence
High on the code reading: the tables' keys, the writers and the order of the sort against the loop, in both recursions. The depth bound is arithmetic on that reading. How many nodes the gate keeps is `UNKNOWN - verify`; the probe counts it.
