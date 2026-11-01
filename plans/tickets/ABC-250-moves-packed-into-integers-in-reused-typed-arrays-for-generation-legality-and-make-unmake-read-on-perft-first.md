---
id: ABC-250
title: "Moves packed into integers in reused typed arrays for generation, legality and make/unmake, read on perft first; the search is not touched yet (ADR-0055 O1-b part 1, value-identical)"
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-010
---

# ABC-250: packed moves in the rules core, read on perft before the search is touched

> **DATED LINE 2026-11-01** (BA/PM, `bapm-epic011-dedupe`): `ABC-254` moved to `EPIC-011` (it waits on Q-SP-3 and
> would hold `EPIC-010`'s close). § Dependencies' "`ABC-254` goes first" case stands only as the exception written on
> `ABC-254`'s page (the owner's yes and its ADR before this ticket enters development); otherwise `ABC-254` follows
> the O1-b chain. Nothing else on this page changes.

> **Cut 2026-11-01 by BA/PM** (task `bapm-goal3000-o1-cut`, records only, at `main` `bae25131`; nothing run, built or
> timed, because `qe-ABC-223` holds the host STRICTLY ALONE). Source: `ADR-0055` option **O1-b** (§ D1, the O1 table;
> § D6, "O1-b (L, split into generation, legality and make/unmake; search, quiescence, ordering and TT; the shell
> adapter)"). The owner chose option O1 on 2026-11-01 (Orchestrator `orch-2026-10-30a` `…74216a44`, verbatim: *"my
> call is let's go with 1, least effort and risk"*). The AssemblyScript prototype (`ADR-0055` D3, Q-SP-1) is **not
> run**, so this ticket is where O1-b's data-layout gain is first read, on the same workload D3's arm A1 / A0 would
> have read (W1, perft). `EPIC-010` milestone 1b, order 1. Value-identical, so S2 and **no smoke**
> (`EPIC-010` § The merge rule).

## Problem

- **User:** the owner at level 5 (4 000 ms a move since `e42b637b`), and through him the new product goal of
  3 000 Elo (`EPIC-010` § Product goal, 2026-11-01).
- **Pain:** every generated move is a heap object `{ from, to, piece, captured, flags, promotion }` in a fresh
  `Move[]` (`src/moves.ts:46`, `generateMoves` `:356`, `generateCaptures` `:402`), and every `makeMove` returns an
  `UndoRecord` object (`src/apply.ts:36`, `:122`). The only profile on record (`se-ABC-227` `…7175ebdf`, before
  `ABC-235` and `ABC-240`) puts move generation at 76–78 % of the 2 737–4 019 bytes allocated per node, and
  generation plus legality at 45–51 % of self time (`ADR-0055` § Where a node's time goes).
- **Value:** more nodes in the same 4 s with identical answers. `ADR-0055` estimates O1-b at **1.05–1.25×** search
  nps, at **low-medium** confidence: the profiler under-charges allocation (`ABC-240` read 4–15× its self-time bound,
  `qe-ABC-240` `…19068f9d`), while `ADR-0003` (c4) measured generation at only 19.1 % of `legalMoves` and bounded a
  zero-allocation generator below 1.24× per call. **Those two records disagree, which is why this ticket reads the
  gain on perft before any search code is spent.** At ≈ 50–100 Elo per doubling (informal, `ADR-0055` § Elo per
  speed doubling) 1.25× is ≈ 16–32 Elo, inside the batch's ± 78 noise, so the grade is node rate, not games.

## Scope

1. **Packed moves for the rules core.** A move is one integer (from, to, piece, captured, flags and promotion fit
   in 28 bits, `ADR-0055` O1-b), written into preallocated per-ply `Int32Array`s instead of a fresh `Move[]`; the
   undo state of a make/unmake lives in per-ply typed arrays instead of an `UndoRecord` object. This covers pseudo-legal
   generation (all moves and captures), the legality filter (make/test/unmake, unchanged as a strategy) and
   make/unmake.
2. **Perft runs on the packed path** (`src/perft.ts`, `src/perft-bench.ts`), so the gain is read on W1.
3. **The search, quiescence, ordering, killers, the TT and every shell module are not touched.** They keep calling
   today's object functions (`legalMoves`, `generateMoves`, `makeMove`, …), which keep their signatures and outputs.
   For this ticket's life the rules core therefore holds **two move paths, object and packed**. That is deliberate:
   it lets the gain be read and the chain stopped before the search is rewritten. `ABC-251` moves the search onto
   the packed path, and `ABC-252` removes the duplicate. Until `ABC-252`, A2's list-equality oracle guards the two
   paths against drift.
4. Architect/Design confirms the form at design, as `arch-ABC-235` did for `ABC-235` (value-identity, no ADR). The
   staging in item 3 is BA/PM's slicing for an early measured stop; the Architect may change the form if A1–A6 hold.
   **Clause check for the Architect:** `ADR-0003` clause 1 ("`src/legal.ts` is not changed", read since `ABC-206` and
   `ABC-235` as "make/test/unmake stays the legality strategy") is kept: this ticket changes how a move is stored,
   not how legality is decided. If the Architect reads clause 1 literally, this ticket waits on that reading.

## Out of scope

- Any change to the order of generated moves, to what is legal, to evaluation, ordering, the TT or a pruning
  decision (all value-changing).
- The search side (`ABC-251`), the single-generator clean-up (`ABC-252`), BigInt keys (`ABC-253`), lazy legality
  (`ABC-254`, waits on `ADR-0003`'s amendment), incremental material and PST (`ADR-0055` O1-e, not proposed now).
- Bitboards (`ADR-0001`'s rejected option; `ADR-0055` § Alternatives). A language port (O2, O3: not pursued).

## Acceptance criteria

- **A1 (perft and key identity).** **Given** the six standard positions at `src/perft-bench.ts`'s depths and every
  row of `src/perft.test.ts` (with `PERFT_DEEP=1`), **when** perft runs on the packed path, **then** every count equals
  the expected count, and the XOR of every leaf's Zobrist key equals the object path's XOR on every position
  (`ADR-0055` D3 validity rows 1 and 2).
- **A2 (list equality, the oracle).** **Given** every node of the depth-3 walk from the perft roots (285 074
  positions, the `ABC-206` / `ABC-240` walk, under `ENGINE_DEEP=1`) and the six perft roots at depth 1 in the default
  lane, **when** the packed generator, legality filter and make/unmake run beside the object ones, **then** the
  decoded packed legal list equals today's `legalMoves` list **in order** at every node (0 mismatches), the packed
  captures list equals `legalCaptures` in order, and the position (by `toFen` and by Zobrist key) is identical after
  each make/unmake pair (0 mutations).
- **A3 (the search is unchanged).** **Given** the `ABC-078` `A3` corpus and `ABC-121`'s 190, at fixed depth 5 on base
  and head, out of tree, in plain `node`, with `search`, every `ADR-0026` test-only door and `chooseMove` at budgets 3
  and 5 on `tickingClock(1)`, **then** move, score, completed depth, nodes and clock reads are byte-equal on every
  position (`G4`). No golden file is committed.
- **A4 (the reading: O1-b's go / hold / no-go, `ADR-0055` D3's A1 / A0 bar).** **Given** perft (W1) on `kiwipete`,
  `position-6` and the start position at `src/perft-bench.ts`'s depths, 5 interleaved fresh-process runs per board per
  build, ALONE (`pgrep -x cutechess-cli` 0, no `[v]itest`, load1 and Tctl recorded per run, pause at ≥ 85 °C), **then**
  head-packed over base-object median perft nodes per second, on **at least two of the three boards**, reads:
  - **GO, ≥ 1.25×:** merge (with A1–A3, A5, A6 green). `ABC-251` proceeds in its full form.
  - **HOLD, 1.10–1.25×,** or **NO-GO, < 1.10×:** **not merged.** QE records a `failed-attempt` note with the medians,
    the ratios, load1 and Tctl. The ticket comes back to BA/PM, which closes it as **dropped**; `ABC-251` narrows to
    O1-c alone and `ABC-252` is dropped (both pages say how).
  - **Validity** (void is not a result): within one build and board, the 5 runs' spread (max / min − 1) is ≤ 5 %; above
    it, one re-run; above it again, the reading is VOID and goes back to QE. The other three perft positions are read
    and reported as INFO.
  - The bars are `ADR-0055` D3's as proposed. **The owner may reset them before the run** (`ADR-0055` Q-SP-2); without
    his word they apply as written. QE's interleaved reading on a pre-registration sealed before the first timed run
    decides, as `qe-ABC-235` and `qe-ABC-240` did. The Engineer's figures are indicative.
- **A5 (search speed guard).** **Given** `kiwipete`, `position-6` and the start position, 5 interleaved runs per board
  per build at 4 000 ms, **then** head's median search nps is **≥ 0.98×** base's on every board (the search is not
  touched, so this only guards against a slower object path).
- **A6 (gates).** `npm run lint`, `typecheck`, `test` and `build` green at every commit. `G1` 54/58 with every row's
  move, depth and nodes equal to base (`PUZZLE_DEEP=1`). `G4` (A3). `G5`. `G6` "≥ base" (floor 6). `G7`: the per-ply
  arrays are fixed-size, counted in (a), growth 0. `G8` ≤ 10 s, with new default-lane rows adding ≤ 0.1 s (`N8-LANE`
  reported). `G9` (`git diff` of `src/levels.ts` empty). `G2`/`G3` are not owed: `evaluate` is untouched.
- **A7 (the grade).** **S2** (`EPIC-008`): A1–A6, and **no smoke** (`EPIC-010` § The merge rule).

## What happens on a miss

- **A1, A2 or A3 red:** a defect. Back to the Software Engineer; A4 is read again after the fix.
- **A4 HOLD or NO-GO:** not merged, dropped, as A4 says. That is a result: it closes O1-b's object-to-integer
  rewrite on this engine with a reading, and the `failed-attempt` note stops a blind retry. It is re-opened only on a
  fresh profile that ranks generation's allocation higher, or on a different form named by the Architect.
- **A5 missed on any board:** a defect (the object path got slower). Back to the Software Engineer.

## NFR triggers

- **`NFR-001` (perft ≥ 1 000 000 nodes/s):** re-read as INFO on this host (`UNKNOWN - verify` here; 6.04–6.21 M on
  the M3, `ADR-0055` § Speed readings). No bar moves.
- **`NFR-005`:** `G6` "≥ base", floor 6. **`NFR-004`:** `G5`; clock reads equal (A3).
- **`NFR-009` (≤ 16 MiB, ≤ 1 MiB growth):** per-ply arrays are bounded (128 plies × a few KiB, `ADR-0055` O1 reach),
  counted in `G7` (a), growth 0. Bytes per node are reported as INFO.
- **`NFR-008`:** the 285 074-node walk runs under `ENGINE_DEEP=1`; lane rows at depth ≤ 1; ≤ 0.1 s added (A6).
- **Security:** none. No input path.

## Test notes

1. A1 and A2 are the `ABC-206` / `ABC-240` oracle shape: the object path is the reference while it still exists.
2. A3 is the `ABC-206` / `ABC-235` identity sweep, run out of tree for the cross-build half.
3. A4 is QE's reading, ALONE, on a sealed pre-registration. About 1 h of host time with `G6` (estimate).
4. Tests that build `Move` objects for core calls are unchanged here (the object path stays); their count is
   `UNKNOWN - verify` (`ADR-0055`, bounded by 56 files) and matters for `ABC-252`.
5. UAT is owed (production lines). The QE verdict signs it.
6. *(2026-11-01, `bapm-qe-gaps-1101b`, QE-261-c LOW, `qe-ABC-261` `…c385f9a2`.)* **`ABC-261`'s early-exit row is
   bound to generation order.** Its precondition `expect(pseudo[0]?.piece).toBe(KING)` (`src/gameend.nfr.test.ts`)
   reads `generateMoves`' a1-upward scan; `ABC-262`'s pawns-first board, if built, is bound the same way. Out of scope
   here forbids a reorder, but if this ticket's packed path changes what `generateMoves` returns first, the row turns
   red loudly (QE's reversed generator QR read `expected 1 to be 6`). The fix is to re-pick the board or assert an
   order-free precondition. **Never drop the bar** (≤ 2 attack tests, against 6 for the full lazy list).

## Size and priority

- **Size: M.** Three core files and perft under one oracle and one perft reading; the search is untouched.
- **Priority: P2.** The owner's chosen speed path; its reading decides whether the L-sized `ABC-251` is spent.

## Dependencies

- **No ADR** expected (value-identical, as `ABC-235`/`ABC-240`); Architect/Design confirms at design (scope item 4).
- **Files:** `src/moves.ts`, `src/apply.ts`, `src/legal.ts`, `src/perft.ts`, `src/perft-bench.ts`. **`ABC-254`
  (O1-d) edits `src/legal.ts` too.** If the owner's yes on `ADR-0003`'s amendment and its ADR arrive before this
  ticket enters development, `ABC-254` goes first (`ADR-0055` D4) and this ticket packs its lazy filter; otherwise
  `ABC-254` follows `ABC-252`. **`src/zobrist.ts`:** `zobristKeyAfterMove(keyBefore, position, move, undo)`
  (`:117`) takes a `Move` and an `UndoRecord`, so A1's leaf-key XOR needs a packed form of it (the object form stays
  for the search); **`ABC-253` (O1-a)** rewrites the same function to key halves and is pulled after the O1-b chain,
  so it rebases on this one. The Orchestrator orders them.
- **Host:** A4 and A5 run ALONE; `qe-ABC-223` holds the host now.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ `ADR-0055` O1-b; the allocation share; the two disagreeing records |
| 2 | scope and out-of-scope | ✅ core + perft only; the search, shell and other O1 cuts out |
| 3 | INVEST | ✅ M; mergeable alone (search untouched); its reading is the stop point for the chain |
| 4 | testable, measurable acceptance | ✅ A1–A7; GO / HOLD / NO-GO and validity stated |
| 5 | dependencies known | ✅ `ABC-254` on `src/legal.ts`; `ABC-253`; host |
| 6 | NFR triggers with targets | ✅ perft ≥ 1.25× (GO); search ≥ 0.98×; `G7` growth 0; ≤ 0.1 s lane |
| 7 | test notes | ✅ 5 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ none (Q-SP-2 bars apply as written unless the owner resets them) |

**DoR 10/10. `Backlog → Ready` recommended** (the column move is the Orchestrator's). First pull of milestone 1b.
