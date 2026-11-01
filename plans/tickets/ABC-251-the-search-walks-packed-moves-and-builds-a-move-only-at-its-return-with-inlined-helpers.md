---
id: ABC-251
title: "O1-c alone: the hot-path helpers isBlack and pieceType are inlined (or made provably inlinable) and the engine's per-search record keeps one constant shape, on today's Move objects (ADR-0055 O1-c, value-identical; narrowed 2026-11-01 from O1-b part 2 with O1-c)"
status: backlog
column: Backlog
size: S
priority: P2
epic: EPIC-010
---

# ABC-251: O1-c alone, inlinable hot-path helpers and a constant-shape search record, on today's `Move` objects

> **RE-SCOPED 2026-11-01 by BA/PM to the narrowed form, O1-c alone** (task `bapm-abc250-close`, records only, at `main`
> `767a2e3e`; nothing run, built or timed). `ABC-250` is **closed and not merged, by routing**. Its A4 was not graded
> (UNRESOLVED, `qe-ABC-250` `…4fe9c469`). The Orchestrator applied that page's consequences as a routing choice
> (`orch-2026-10-30a` `…d2571be5`): this ticket narrows to O1-c alone, and `ABC-252` is dropped. That is this page's
> own "Narrowed form" branch, applied as written:
> - items 1 and 3 of § Scope are struck;
> - size **S**;
> - A3's bar is `ABC-240`'s (≥ 1.03× on two boards, ≥ 1.00× on the third).
>
> **Every dependency on packed generation is removed:** no packed move, no per-ply move array, no `ABC-250` base and no
> `ABC-252`. The title and this heading now name the narrowed form. The file name keeps the original slug, so links
> still resolve. Struck text stays visible as history. The review notes (test notes 6 and 7) are kept as written.
> **DoR 9/10, Backlog:** row 10 waits on `arch-abc250-close`, which rules whether O1-c needs a design input and how
> QE-250-a bears on A3's read (§ Definition of Ready).

> **Cut 2026-11-01 by BA/PM** (task `bapm-goal3000-o1-cut`, records only, at `main` `bae25131`; nothing run, built or
> timed). Source: `ADR-0055` options **O1-b** (its second part, § D6: "search, quiescence, ordering and TT") and
> **O1-c**, which `ADR-0055` folds into O1-b ("S, folded into O1-b"), so they are **one ticket**. The owner chose O1 on
> 2026-11-01 (`orch-2026-10-30a` `…74216a44`). `EPIC-010` milestone 1b, order 2. Value-identical: S2, **no smoke**.
> ~~**Waits in Backlog on `ABC-250`'s A4 reading**, which picks this ticket's form (§ Scope).~~ *(2026-11-01,
> `bapm-abc250-close`: the form is picked, narrowed; block above.)*

## Problem

- **User:** the owner at level 5 (4 000 ms a move).
- ~~**Pain:** once `ABC-250` packs the rules core, the search still pays for `Move` objects: `orderMoves`
  (`src/search.ts:222`), `KillerTable` (`:168`), `entryMove` (`src/transposition.ts:119`), quiescence's capture list
  and `orderCaptures` (`src/quiescence.ts:110`), and both recursions (`src/search.ts`, `src/engine.ts`, held equal by
  the `ABC-078` sweep) take and return `Move`s.~~ *(2026-11-01: struck with the packed path; `ABC-250` did not merge.)*
- **Pain (narrowed, 2026-11-01).** Two costs remain on today's `Move` objects (`ADR-0055` O1-c, from `se-ABC-227`):
  - **Small helpers that are not inlined, ~2 % of self time.** `pieceType` and `isBlack` are one-line arrow functions
    exported from `src/position.ts:52` and `:55`. On `main` `767a2e3e`, lines that call them: `src/moves.ts` 13,
    `src/evaluate.ts` 7, `src/apply.ts` 3, `src/search.ts` 2, `src/quiescence.ts` 2, `src/legal.ts` 1,
    `src/zobrist.ts` 1. These are grep line counts, not a profile.
  - **Engine bookkeeping, 1.3–2.0 %.** `deepen` builds its `Budget` with `...heuristics` spread in
    (`src/engine.ts:719`).
  - Both shares predate `ABC-235`, `ABC-240` and `ABC-254`, so today's figures are `UNKNOWN - verify`.
- **Value:** a small node-rate gain at the 4 s search with identical answers. `ADR-0055` estimates O1-c at
  **1.00–1.04×**, at low confidence. ~~O1-b at 1.05–1.25×~~ *(not pursued here)*. **Risk, stated plainly:** A3's bar
  (≥ 1.03× on two boards) sits near the top of that estimate. A miss is a likely outcome, and § What happens on a miss
  then drops the ticket at about the cost of one S build and one read. It stays cut because it is one of the two
  tickets (`ABC-253` is the other) that stand between `EPIC-010` and its close, and the drop is cheap.

## Scope

~~**Full form (if `ABC-250` reads GO and merges):**~~ *(2026-11-01, `bapm-abc250-close`: `ABC-250` closed not merged;
items 1, 3 and 4's ordering are struck. **Item 2 is this ticket's whole scope.**)*

1. ~~**O1-b, search side.** Full-width search, quiescence, `orderMoves`, quiescence's capture ordering, killers and the
   TT's hash-move lookup work on the packed moves in the per-ply typed arrays. The shell's `Move` is built **once, at
   `chooseMove`'s return** (`ADR-0055` O1-b); `chooseMove`'s signature and `EngineChoice` keep their shape (`ADR-0055`
   O1 reach). `search`'s public result keeps its shape too. The `ADR-0026` test-only doors stay, node-for-node.~~
2. **O1-c (the scope).** `isBlack` and `pieceType` inlined by hand on the hot path (or made provably inlinable), and constant
   record shapes in the engine's bookkeeping (no spread into `Budget`), as `ADR-0055` O1-c names. If O1-c touches
   `src/evaluate.ts`, `G2`/`G3` are owed (A5). *(2026-11-01: on today's `Move` objects. `chooseMove`, `search`,
   `EngineChoice`, every `ADR-0026` door and every exported signature keep their shape. The Architect's ruling
   (`arch-abc250-close`) picks hand-inlining versus "provably inlinable". Until that ruling, either form is in scope if
   A1–A5 hold.)*
3. ~~The `arch-ABC-235` conditions carried by `ABC-240` stay in force on the new form: **C1** ties keep generation order;
   **C2** ordering keys stay float64 (or an integer form the Architect proves order-equal on the walk); **C3** the
   input list is never mutated where a later read needs its generation order (`moves[0]`, `entryMove`); **C4** no
   output shared between plies.~~ *(2026-11-01: C2–C4 were about the packed ordering and fall away. C1, "ties keep
   generation order", is kept through § Out of scope: no move order changes.)*
4. ~~One commit per item where it can stand alone (O1-c may land first in the branch).~~ A3 judges the tip.
   *(2026-11-01: one item; the helpers and the record shape may be separate commits.)*

**Narrowed form (if `ABC-250` reads HOLD or NO-GO and is dropped):** items 1 and 3 are **struck**; the ticket is
**O1-c alone** (item 2), on today's `Move` objects. Size becomes **S** and its bar becomes `ABC-240`'s (A3, narrowed).
BA/PM re-scores the page on that reading; nothing else is re-cut. *(**Applied 2026-11-01**, `bapm-abc250-close`.
`ABC-250` was closed by routing, not on a HOLD or NO-GO reading (`…d2571be5`); this branch is applied as written.)*

## Out of scope

- Any change to move order, to a key's value, to what the TT stores or replaces, or to a pruning or reduction
  decision (value-changing: `ABC-233`, `ABC-234`, `ABC-236`–`ABC-238` own those, each behind its ADR).
- The single-generator clean-up and the shell adapter (`ABC-252`). BigInt keys (`ABC-253`). Lazy legality (`ABC-254`).
- *(2026-11-01)* **Packed moves anywhere:** integer moves, per-ply move arrays, a typed-array undo stack. That was
  O1-b (`ABC-250`, closed not merged; its branch `grugops/ABC-250` is kept). `ABC-252` is dropped.
- *(2026-11-01)* Any change to the order `generateMoves` returns. `ABC-261`'s and `ABC-262`'s rows are bound to it
  (test note 8).
- Merging the two recursions into one (an `ABC-078` design question, not a speed cut).

## Acceptance criteria

- **A1 (identity).** **Given** the `ABC-078` `A3` corpus and `ABC-121`'s 190, **when** searched at fixed depth 5 on
  base and head, out of tree, in plain `node`, with `search`, every `ADR-0026` test-only door (`searchWithoutOrdering`
  and `searchWithoutKillers` included) and `chooseMove` at budgets 3 and 5 on `tickingClock(1)`, **then** move, score,
  completed depth, nodes and clock reads are byte-equal on every position (`G4`). Base is the merge base on `main`
  ~~(with `ABC-250` in the full form)~~ *(2026-11-01: `main` as it stands, with `ABC-254`'s lazy filter
  (`3bfe180e`) and no packed path)*. No golden file is committed.
- **A2 (ordering oracle).** ~~**Given** every node's legal list on the 285 074-position walk (`ENGINE_DEEP=1`) and the
  six perft FENs at depth 1 (lane), with killers and hash moves drawn from the list plus absent ones, **then** the
  packed `orderMoves` order, decoded, equals today's `orderMoves` order element by element, and quiescence's capture
  order equals today's `orderCaptures` order. One targeted row each for C1–C4 (the `ABC-240` A2 rows, carried over).~~
  *(Narrowed form: A2 is the `ABC-240` oracle unchanged, run to show O1-c moved no order.)* *(2026-11-01, live
  text.)* **Given** the `ABC-240` A2 oracle as it stands on `main` (the 285 074-position walk under `ENGINE_DEEP=1`,
  and its default-lane rows), **when** it runs on head, **then** it is green with **0** order mismatches and no row
  edited.
- **A3 (speed).** **Given** `kiwipete`, `position-6` and the start position, 5 interleaved fresh-process runs per board
  per build at 4 000 ms, ALONE (`pgrep -x cutechess-cli` 0, no `[v]itest`, load1 and Tctl recorded), with the
  `ADR-0055` D3 validity rule (spread ≤ 5 %, one re-run, then VOID), **then** head's median nodes per second over
  base's is:
  - ~~**full form: ≥ 1.10× on at least two boards and ≥ 1.00× on the third** (`ABC-235`'s bar; `ADR-0055` D3's HOLD
    floor);~~ *(struck 2026-11-01)*
  - **narrowed form (O1-c alone): ≥ 1.03× on at least two boards and ≥ 1.00× on the third** (`ABC-240`'s bar).
    **This is the bar.**
  - QE's interleaved reading on a sealed pre-registration decides. Bytes per node are reported as INFO.
  - *(2026-11-01)* **The read method:** `ADR-0055` D3 with its D3-V2 addendum, as `ABC-254` was read (`3bfe180e`).
    It also follows any forward-only rule `arch-abc250-close` adds for QE-250-a. For INFO only: in `qe-ABC-250`, the
    same shape of read (search at 4 000 ms, three boards, under D3-V2) was valid on every board with no re-run
    (A5, `…94b58687`). The VOIDs were on the 2.5 s single-thread perft reads (`…677d4d41`). If a read voids, it is
    VOID and goes back to QE (§ What happens on a miss). It is never graded as a miss.
- **A4 (`chooseMove`'s edge).** ~~**Given** every position of A1's corpus, **then** `chooseMove`'s returned `move` is
  deep-equal to base's `Move` object (all six fields), and a fresh object per call (not shared with a later call).~~
  *(Struck 2026-11-01: no `Move` is built from a packed move any more. A1 already holds `chooseMove`'s move
  byte-equal.)*
- **A5 (gates).** `npm run lint`, `typecheck`, `test` and `build` green at every commit. `G1` 54/58 with every row's
  move, depth and nodes equal to base (`PUZZLE_DEEP=1`). `G4` (A1). `G5`. `G6` "≥ base" (floor 6). `G7`: ~~per-ply
  arrays fixed-size, counted in (a),~~ growth 0 *(2026-11-01: no new arrays)*. `G8` ≤ 10 s, new lane rows ≤ 0.1 s
  (`N8-LANE` reported). `G9`. **`G2` and `G3` owed only if `src/evaluate.ts` changes** (O1-c's helpers):
  `evaluate` byte-equal on the corpus, mean per call ≤ base's in the same session.
- **A6 (the grade).** **S2**: A1–A5, **no smoke**.

## What happens on a miss

- **A1 or A2 red** ~~**or A4**~~: a defect. Back to the Software Engineer; A3 is read again after the fix.
- ~~**A3 missed, full form:** NOT MET, **not merged.** QE records a `failed-attempt` note (medians, ratios, load1, Tctl).
  BA/PM then decides between (i) re-cutting O1-c alone in the narrowed form, and (ii) reverting `ABC-250`'s packed path
  (one revert; perft and `G4` prove it clean, `ADR-0055` § Rollback), because a packed core that the search does not
  use is a second move path with no reader. `ABC-252` waits on that decision.~~ *(struck 2026-11-01)*
- **A3 missed, narrowed form:** NOT MET, not merged, **dropped** (`ABC-240`'s rule: a value-identical change has
  nothing to re-tune). Nothing waits on it. *(2026-11-01: QE records a `failed-attempt` note with the medians, the
  ratios, load1 and Tctl, so a blind retry is stopped. Milestone 1b then closes without it.)*
- *(2026-11-01)* **A3 VOID** (a validity rule fails after the allowed re-run): not a result. It goes back to QE and
  the Orchestrator routes it, as `ABC-250`'s UNRESOLVED was routed. It is never recorded as a miss.

## NFR triggers

- **`NFR-005`:** `G6` "≥ base", floor 6; expected to hold or rise. **`NFR-004`:** `G5`; clock reads equal (A1).
- **`NFR-009`:** ~~per-ply arrays fixed-size;~~ `G7` growth 0 (no new allocation).
- **`NFR-008`:** the walk under `ENGINE_DEEP=1` (unchanged, `ABC-240`'s); any new lane row at depth ≤ 1; ≤ 0.1 s
  added; `G8` ≤ 10 s.
- *(2026-11-01)* **`NFR-001`:** perft ≥ 1 000 000 nodes/s, re-read as INFO if `src/moves.ts` or `src/apply.ts`
  changes; no bar moves.
- **Security:** none. No input path. UCI and CLI output unchanged (~~A4~~ A1, `G1`).

## Test notes

1. A1 is the `ABC-206` / `ABC-235` / `ABC-240` identity sweep, out of tree for the cross-build half.
2. The reference copies of today's `orderMoves` and `orderCaptures` live in the test files, not in `src/`.
3. ~~Tests that pass `Move` objects into `orderMoves`, `KillerTable`, `entryMove`, `mvvLvaKey` or `orderCaptures`
   go through a test-side adapter or are rewritten; the count is reported (`UNKNOWN - verify` now).~~ *(2026-11-01:
   no adapter. `pieceType` and `isBlack` stay exported from `src/position.ts` for every other caller, so no test
   should need an edit. Any test edited is listed with its reason.)*
4. About 1 h of ALONE host time for A3 and `G6` (estimate). *(2026-11-01: plus `G2`/`G3` if `src/evaluate.ts`
   changes.)*
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
8. *(2026-11-01, `bapm-abc250-close`.)* **Generation order is bound by two test rows.** `ABC-261`'s early-exit row
   (`src/gameend.nfr.test.ts`, precondition `pseudo[0]?.piece` is `KING`) reads `generateMoves`' a1-upward order.
   `ABC-262`'s pawns-first row (in development, `se-ABC-262`) reads it the same way. Inlining in `src/moves.ts` must
   keep that order (§ Out of scope). If either row turns red, the change reordered generation: a defect here. **Never
   re-board the row to make this ticket pass.** (This QE-261-c clause was left off the page on 2026-11-01, when the
   full form did not touch `generateMoves`. The narrowed form may.)

## Size and priority

- **Size: S** *(2026-11-01, narrowed)*: two mechanical value-identical edits (helper inlining across at most seven
  hot-path files, one constant-shape record in `src/engine.ts`) under the existing identity sweep and `ABC-240`'s
  oracle, with one QE nps read.
- ~~**Size: L** (full form): both recursions, quiescence, ordering, killers and the TT's move lookup under one identity
  oracle. **Why not split further:** the recursions call ordering, killers and quiescence on the same list, and the
  `ABC-078` sweep holds the two recursions equal, so a half-packed search would convert every list back to objects
  and read slower than either end. **S** in the narrowed form.~~
- **Priority: P2.** ~~It is where O1-b's gain reaches the 4 s search.~~ *(2026-11-01)* It is not P2 for its expected
  gain, which is small (Problem). It is P2 because, with `ABC-253`, it is what remains of milestone 1b, and that
  milestone holds `EPIC-010`'s close read.

## Dependencies

- ~~**`ABC-250`** (its A4 reading picks the form; in the full form its merge is the base).~~ *(2026-11-01: closed not
  merged; the form is picked. **No dependency on `ABC-250` or `ABC-252` remains.**)*
- *(2026-11-01)* **Files (narrowed):** `src/position.ts` (the helpers, if they become provably inlinable), their
  hot-path callers among `src/moves.ts`, `src/apply.ts`, `src/legal.ts`, `src/search.ts`, `src/quiescence.ts` and
  `src/zobrist.ts`, `src/engine.ts` (`Budget`), and possibly `src/evaluate.ts` (then `G2`/`G3`).
- ~~**Files:** `src/search.ts`, `src/engine.ts`, `src/quiescence.ts`, `src/transposition.ts` (move lookup only), and
  possibly `src/evaluate.ts` (O1-c).~~ **Milestone 2 collides here:** `ABC-233`/`ABC-234` edit `orderMoves`,
  `ABC-236`–`ABC-238` the search and the TT, `ABC-231`/`ABC-232` `src/evaluate.ts`. Milestone 1b goes first
  (`ADR-0055` D2: cheap value-identical speed, then milestone 2), so those tickets are written ~~on the packed form~~
  *(2026-11-01: on whatever milestone 1b leaves, which is today's `Move` objects)*.
  **`ABC-253`** edits the same search, engine and TT files; it is pulled after this ticket. *(2026-11-01: milestone
  2 has since moved to `EPIC-011`, still after milestone 1b. `ABC-253` still shares `src/search.ts`,
  `src/engine.ts` and `src/zobrist.ts`, so the two do not run in parallel. The order between them is the
  Orchestrator's; this page keeps "`ABC-251` first".)*
- **`ABC-249`** (test-only, `src/engine.test.ts`) is recommended before this ticket. *(Met: merged `98d601d6`. So are
  `ABC-259` (`2091d301`) and `ABC-260` (`59842f9f`), which were recommended before it.)*
- *(2026-11-01)* **`ABC-262`** (test-only, in development) reads generation order (test note 8). It has no file in
  common with this ticket.
- No ADR (value-identical). Architect/Design confirms value-identity at design, as `arch-ABC-235` did. *(2026-11-01:
  **a design input may be owed.** `arch-abc250-close` item 4 rules whether O1-c needs one; its item 2 rules on
  QE-250-a, which may add to A3's read. DoR row 10.)*
- **Host:** A3 and `G6` run ALONE, under the host lock.

## Definition of Ready

*Re-scored 2026-11-01 by BA/PM (`bapm-abc250-close`) on the narrowed form. The earlier table is replaced; its 9/10
waited on `ABC-250`'s reading, which is now resolved by routing.*

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ `ADR-0055` O1-c; the two named sites (`src/position.ts:52`/`:55` and their callers; `src/engine.ts:719`); the shares are old (`UNKNOWN - verify`) |
| 2 | scope and out-of-scope | ✅ one form: O1-c alone on today's `Move` objects; packed moves and order changes out |
| 3 | INVEST | ✅ S; independent of `ABC-250` and `ABC-252`; value-identical; mergeable alone |
| 4 | testable, measurable acceptance | ✅ A1 byte-equal; A2 0 mismatches; A3 ≥ 1.03× on two boards and ≥ 1.00× on the third; A5 gates; miss and VOID rules stated |
| 5 | dependencies known | ✅ no `ABC-250`/`ABC-252`; `ABC-253` (same files, after); `ABC-262` (order rows); `ABC-249`/`259`/`260` met |
| 6 | NFR triggers with targets | ✅ ≥ 1.03×; `G6` ≥ base, floor 6; `G7` growth 0; `G8` ≤ 10 s, ≤ 0.1 s added |
| 7 | test notes | ✅ 8 (6 and 7 kept as written; 8 added) |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 (the epic-close path, not the gain) |
| 10 | no major unresolved blocker | ⚠ **`arch-abc250-close` has not merged.** Its item 4 (a design input for O1-c, or none) and its item 2 (QE-250-a's bearing on A3's read) are open |

**DoR 9/10. Backlog.** Row 10 turns ✅ when `arch-abc250-close` merges:
- **If it says "no design input" and adds nothing to A3's read beyond D3-V2,** or adds only a forward-only read rule:
  DoR is 10/10 on that merge. This page's `Backlog → Ready` recommendation applies from then, with no further BA/PM
  hop; the column move is the Orchestrator's. A3 already defers to that rule.
- **If it gives a design input that changes scope or acceptance** (for example, it forbids touching `src/evaluate.ts`
  or picks one inlining form): BA/PM folds it here first.
