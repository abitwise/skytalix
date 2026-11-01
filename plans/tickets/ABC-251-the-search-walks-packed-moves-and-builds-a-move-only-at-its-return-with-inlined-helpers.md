---
id: ABC-251
title: "The search, quiescence, ordering and killers walk the packed moves and build a Move only at chooseMove's return, with hand-inlined helpers and constant record shapes (ADR-0055 O1-b part 2 with O1-c, value-identical)"
status: backlog
column: Backlog
size: L
priority: P2
epic: EPIC-010
---

# ABC-251: the search walks packed moves, with inlinable helpers

> **Cut 2026-11-01 by BA/PM** (task `bapm-goal3000-o1-cut`, records only, at `main` `bae25131`; nothing run, built or
> timed). Source: `ADR-0055` options **O1-b** (its second part, § D6: "search, quiescence, ordering and TT") and
> **O1-c**, which `ADR-0055` folds into O1-b ("S, folded into O1-b"), so they are **one ticket**. The owner chose O1 on
> 2026-11-01 (`orch-2026-10-30a` `…74216a44`). `EPIC-010` milestone 1b, order 2. Value-identical: S2, **no smoke**.
> **Waits in Backlog on `ABC-250`'s A4 reading**, which picks this ticket's form (§ Scope).

## Problem

- **User:** the owner at level 5 (4 000 ms a move).
- **Pain:** once `ABC-250` packs the rules core, the search still pays for `Move` objects: `orderMoves`
  (`src/search.ts:222`), `KillerTable` (`:168`), `entryMove` (`src/transposition.ts:119`), quiescence's capture list
  and `orderCaptures` (`src/quiescence.ts:110`), and both recursions (`src/search.ts`, `src/engine.ts`, held equal by
  the `ABC-078` sweep) take and return `Move`s. Small helpers (`isBlack`, `pieceType`) were not inlined, ~2 % of self
  time, and engine bookkeeping (a spread into `Budget`) 1.3–2.0 % (`ADR-0055` O1-c, from `se-ABC-227`).
- **Value:** the allocation `ABC-250` removed from the core is removed from the search too, so the gain reaches the
  4 s search. `ADR-0055` estimates O1-b at 1.05–1.25× and O1-c at 1.00–1.04× (low to low-medium confidence; the
  shares predate `ABC-235` and `ABC-240`).

## Scope

**Full form (if `ABC-250` reads GO and merges):**

1. **O1-b, search side.** Full-width search, quiescence, `orderMoves`, quiescence's capture ordering, killers and the
   TT's hash-move lookup work on the packed moves in the per-ply typed arrays. The shell's `Move` is built **once, at
   `chooseMove`'s return** (`ADR-0055` O1-b); `chooseMove`'s signature and `EngineChoice` keep their shape (`ADR-0055`
   O1 reach). `search`'s public result keeps its shape too. The `ADR-0026` test-only doors stay, node-for-node.
2. **O1-c.** `isBlack` and `pieceType` inlined by hand on the hot path (or made provably inlinable), and constant
   record shapes in the engine's bookkeeping (no spread into `Budget`), as `ADR-0055` O1-c names. If O1-c touches
   `src/evaluate.ts`, `G2`/`G3` are owed (A5).
3. The `arch-ABC-235` conditions carried by `ABC-240` stay in force on the new form: **C1** ties keep generation order;
   **C2** ordering keys stay float64 (or an integer form the Architect proves order-equal on the walk); **C3** the
   input list is never mutated where a later read needs its generation order (`moves[0]`, `entryMove`); **C4** no
   output shared between plies.
4. One commit per item where it can stand alone (O1-c may land first in the branch). A3 judges the tip.

**Narrowed form (if `ABC-250` reads HOLD or NO-GO and is dropped):** items 1 and 3 are **struck**; the ticket is
**O1-c alone** (item 2), on today's `Move` objects. Size becomes **S** and its bar becomes `ABC-240`'s (A3, narrowed).
BA/PM re-scores the page on that reading; nothing else is re-cut.

## Out of scope

- Any change to move order, to a key's value, to what the TT stores or replaces, or to a pruning or reduction
  decision (value-changing: `ABC-233`, `ABC-234`, `ABC-236`–`ABC-238` own those, each behind its ADR).
- The single-generator clean-up and the shell adapter (`ABC-252`). BigInt keys (`ABC-253`). Lazy legality (`ABC-254`).
- Merging the two recursions into one (an `ABC-078` design question, not a speed cut).

## Acceptance criteria

- **A1 (identity).** **Given** the `ABC-078` `A3` corpus and `ABC-121`'s 190, **when** searched at fixed depth 5 on
  base and head, out of tree, in plain `node`, with `search`, every `ADR-0026` test-only door (`searchWithoutOrdering`
  and `searchWithoutKillers` included) and `chooseMove` at budgets 3 and 5 on `tickingClock(1)`, **then** move, score,
  completed depth, nodes and clock reads are byte-equal on every position (`G4`). Base is the merge base on `main`
  (with `ABC-250` in the full form). No golden file is committed.
- **A2 (ordering oracle).** **Given** every node's legal list on the 285 074-position walk (`ENGINE_DEEP=1`) and the
  six perft FENs at depth 1 (lane), with killers and hash moves drawn from the list plus absent ones, **then** the
  packed `orderMoves` order, decoded, equals today's `orderMoves` order element by element, and quiescence's capture
  order equals today's `orderCaptures` order. One targeted row each for C1–C4 (the `ABC-240` A2 rows, carried over).
  *(Narrowed form: A2 is the `ABC-240` oracle unchanged, run to show O1-c moved no order.)*
- **A3 (speed).** **Given** `kiwipete`, `position-6` and the start position, 5 interleaved fresh-process runs per board
  per build at 4 000 ms, ALONE (`pgrep -x cutechess-cli` 0, no `[v]itest`, load1 and Tctl recorded), with the
  `ADR-0055` D3 validity rule (spread ≤ 5 %, one re-run, then VOID), **then** head's median nodes per second over
  base's is:
  - **full form: ≥ 1.10× on at least two boards and ≥ 1.00× on the third** (`ABC-235`'s bar; `ADR-0055` D3's HOLD
    floor);
  - **narrowed form (O1-c alone): ≥ 1.03× on at least two boards and ≥ 1.00× on the third** (`ABC-240`'s bar).
  - QE's interleaved reading on a sealed pre-registration decides. Bytes per node are reported as INFO.
- **A4 (`chooseMove`'s edge).** **Given** every position of A1's corpus, **then** `chooseMove`'s returned `move` is
  deep-equal to base's `Move` object (all six fields), and a fresh object per call (not shared with a later call).
- **A5 (gates).** `npm run lint`, `typecheck`, `test` and `build` green at every commit. `G1` 54/58 with every row's
  move, depth and nodes equal to base (`PUZZLE_DEEP=1`). `G4` (A1). `G5`. `G6` "≥ base" (floor 6). `G7`: per-ply
  arrays fixed-size, counted in (a), growth 0. `G8` ≤ 10 s, new lane rows ≤ 0.1 s (`N8-LANE` reported). `G9`. **`G2`
  and `G3` owed only if `src/evaluate.ts` changes** (O1-c's helpers): `evaluate` byte-equal on the corpus, mean per
  call ≤ base's in the same session.
- **A6 (the grade).** **S2**: A1–A5, **no smoke**.

## What happens on a miss

- **A1, A2 or A4 red:** a defect. Back to the Software Engineer; A3 is read again after the fix.
- **A3 missed, full form:** NOT MET, **not merged.** QE records a `failed-attempt` note (medians, ratios, load1, Tctl).
  BA/PM then decides between (i) re-cutting O1-c alone in the narrowed form, and (ii) reverting `ABC-250`'s packed path
  (one revert; perft and `G4` prove it clean, `ADR-0055` § Rollback), because a packed core that the search does not
  use is a second move path with no reader. `ABC-252` waits on that decision.
- **A3 missed, narrowed form:** NOT MET, not merged, **dropped** (`ABC-240`'s rule: a value-identical change has
  nothing to re-tune). Nothing waits on it.

## NFR triggers

- **`NFR-005`:** `G6` "≥ base", floor 6; expected to hold or rise. **`NFR-004`:** `G5`; clock reads equal (A1).
- **`NFR-009`:** per-ply arrays fixed-size; `G7` growth 0.
- **`NFR-008`:** the walk under `ENGINE_DEEP=1`; lane rows at depth ≤ 1; ≤ 0.1 s added.
- **Security:** none. No input path. UCI and CLI output unchanged (A4, `G1`).

## Test notes

1. A1 is the `ABC-206` / `ABC-235` / `ABC-240` identity sweep, out of tree for the cross-build half.
2. The reference copies of today's `orderMoves` and `orderCaptures` live in the test files, not in `src/`.
3. Tests that pass `Move` objects into `orderMoves`, `KillerTable`, `entryMove`, `mvvLvaKey` or `orderCaptures`
   go through a test-side adapter or are rewritten; the count is reported (`UNKNOWN - verify` now).
4. About 1 h of ALONE host time for A3 and `G6` (estimate).
5. UAT is owed (production lines). The QE verdict signs it.
6. *(2026-11-01, `bapm-qe-gaps-1101`, QE-259-c LOW, `qe-ABC-259` `…1aca1753`.)* **Review habit, not a row.**
   `ABC-259`'s text scan cannot see a budget read through a computed key (`options["budget" + "Ms"]`) or a
   threshold on `deadline - start` (`deadline - start <= 100` is the forbidden 100 ms branch in other words); only
   an AST would. This ticket rewrites the scanned search, so its review reads the diff for both and the build note
   says so. `ABC-260` (recommended before this ticket) closes the scan's `process` and string holes, not this class.
7. *(2026-11-01, `bapm-qe-gaps-1101b`, QE-260-a LOW, `qe-ABC-260` `…be1935aa`.)* **Review habit, not a row.**
   After `ABC-260`, a regex literal can still hide code from the source scan: a quote inside it flips the string
   pairing, so a later string's `//` reads as a comment (QE's Q8), and `\/\/` inside it reads as `//` (Q9). A template
   literal whose `${}` holds a backtick does the same (QE-260-b, Q11b). The six scanned files hold no regex literal
   today. This ticket rewrites the scanned search, so its review reads the diff for any new regex literal or `${}`
   template in those files and the build note says so. If one is added, the review sends it to BA/PM (QE's remedy: a
   guard row, or a tokenizer that knows regex literals); this ticket does not grow a scan row.

## Size and priority

- **Size: L** (full form): both recursions, quiescence, ordering, killers and the TT's move lookup under one identity
  oracle. **Why not split further:** the recursions call ordering, killers and quiescence on the same list, and the
  `ABC-078` sweep holds the two recursions equal, so a half-packed search would convert every list back to objects
  and read slower than either end. **S** in the narrowed form.
- **Priority: P2.** It is where O1-b's gain reaches the 4 s search.

## Dependencies

- **`ABC-250`** (its A4 reading picks the form; in the full form its merge is the base).
- **Files:** `src/search.ts`, `src/engine.ts`, `src/quiescence.ts`, `src/transposition.ts` (move lookup only), and
  possibly `src/evaluate.ts` (O1-c). **Milestone 2 collides here:** `ABC-233`/`ABC-234` edit `orderMoves`,
  `ABC-236`–`ABC-238` the search and the TT, `ABC-231`/`ABC-232` `src/evaluate.ts`. Milestone 1b goes first
  (`ADR-0055` D2: cheap value-identical speed, then milestone 2), so those tickets are written on the packed form.
  **`ABC-253`** edits the same search, engine and TT files; it is pulled after this ticket.
- **`ABC-249`** (test-only, `src/engine.test.ts`) is recommended before this ticket.
- No ADR (value-identical). Architect/Design confirms value-identity at design, as `arch-ABC-235` did.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ `ADR-0055` O1-b (search side) and O1-c |
| 2 | scope and out-of-scope | ⚠ two forms; which one is picked by `ABC-250`'s A4 reading |
| 3 | INVEST | ✅ L, and why it is not split; S when narrowed |
| 4 | testable, measurable acceptance | ✅ A1–A6, both bars and the miss rules stated |
| 5 | dependencies known | ✅ `ABC-250`; milestone 2's files; `ABC-253`; `ABC-249` |
| 6 | NFR triggers with targets | ✅ ≥ 1.10× / ≥ 1.03×; `G7` growth 0; ≤ 0.1 s lane |
| 7 | test notes | ✅ 5 |
| 8 | size | ✅ L (S narrowed) |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ none beyond `ABC-250`'s reading (row 2) |

**DoR 9/10. Backlog** until `ABC-250`'s A4 reads; then BA/PM fixes the form and re-scores it 10/10.
