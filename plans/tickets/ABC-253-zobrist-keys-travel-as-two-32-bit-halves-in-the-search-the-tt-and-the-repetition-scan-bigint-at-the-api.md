---
id: ABC-253
title: "Zobrist keys travel as two 32-bit halves in the search, the TT and the repetition scan, and stay bigint at the API (ADR-0055 O1-a, value-identical)"
status: backlog
column: Backlog
size: M
priority: P3
epic: EPIC-010
---

# ABC-253: BigInt off the hot path

> **Cut 2026-11-01 by BA/PM** (task `bapm-goal3000-o1-cut`, records only, at `main` `bae25131`; nothing run, built or
> timed). Source: `ADR-0055` option **O1-a** (§ D1, the O1 table: "keys as two `u32` halves in the search, the TT and
> the repetition scan; `bigint` kept at the API (history, game end, `priorKeys` converted once per search)"). The owner
> chose O1 on 2026-11-01 (`orch-2026-10-30a` `…74216a44`). `EPIC-010` milestone 1b, order 4 (`ADR-0055` D4: after
> O1-b). Value-identical: S2, **no smoke**. **Independent of `ABC-250`'s reading**: it proceeds whether O1-b goes or not.

## Problem

- **User:** the owner at level 5 (4 000 ms a move).
- **Pain:** the search carries 64-bit Zobrist keys as `bigint`: the per-ply key array is a `BigUint64Array`
  (`src/search.ts:666`, `src/engine.ts:717`), each incremental update XORs `bigint`s (`zobristKeyAfterMove`,
  `src/zobrist.ts:117`), the TT keys are a `BigUint64Array` indexed through a `bigint` mask
  (`src/transposition.ts:47`, `:81`, `probeTable` `:95`, `storeEntry` `:136`), and the repetition scan compares
  `bigint`s (`repeatsInPath`, `src/search.ts:146`; the prior keys, `src/engine.ts:208`, `:351`). A `bigint` result
  is a heap value.
- **Value, and its size, honestly:** `ADR-0055` estimates **1.01–1.05×** (zobrist 0.7–1.4 % + TT 1.1–2.0 % of self
  time, plus part of GC; ceiling ≈ 1 / (1 − 0.04); medium-high confidence **on the ceiling**). `ADR-0055` also records
  that "BigInt is not where the time goes". This is the smallest of the O1 cuts; it is cut because the owner chose O1
  as a whole and it is low-risk under `G4`.

## Scope

1. In the search's hot path, a key is two unsigned 32-bit halves: the per-ply key arrays, the incremental update,
   the TT's stored keys and its index, and the in-search repetition scan (path and prior keys).
2. **`bigint` stays at every API edge** (`ADR-0055` O1-a): `zobristKey(position)` returns the same `bigint`
   (the book keys on it, `src/book.ts:141`), `history.ts`, `gameend.ts`, `levels.ts`, `uci-session.ts` and
   `EngineOptions.priorKeys` keep `bigint` types, and `priorKeys` is converted to halves **once per search**
   (`ADR-0054`'s hand-over is unchanged at the boundary).
3. The TT keeps its size and its slot rule: 2^18 slots, 4 MiB in total (`ADR-0025`); the halves take the bytes the
   `BigUint64Array` took. The slot a key maps to and the replacement decision are unchanged.

## Out of scope

- Any change to a key's value, the Zobrist random tables, the TT's size, slot rule or replacement, or the repetition
  rule (value-changing). `ADR-0020` § AMENDMENT's ep normalisation is unchanged.
- The book's keys and `book.json` (`ADR-0049`). The blunder path's `standsTwiceBefore` (`src/levels.ts:169`, off the
  search's hot path). Packed moves (`ABC-250`–`ABC-252`).

## Acceptance criteria

- **A1 (key identity).** **Given** every node of the 285 074-position walk (`ENGINE_DEEP=1`) and the six perft roots
  at depth 1 (lane), **then** the two halves recombined, `(hi << 32) | lo` as `bigint`, equal `zobristKey(position)`
  at every node, and the incremental update in halves equals the `bigint` update on every move of the walk
  (0 mismatches). `zobristKey`'s output is byte-equal to base's at every node.
- **A2 (search identity).** **Given** the `ABC-078` `A3` corpus and `ABC-121`'s 190, at fixed depth 5 on base and
  head, out of tree, in plain `node`, with `search`, every `ADR-0026` door and `chooseMove` at budgets 3 and 5 on
  `tickingClock(1)`, **then** move, score, completed depth, nodes and clock reads are byte-equal (`G4`). The existing
  repetition rows (`ABC-230`, `ABC-241`, `ABC-242`, `ABC-245`, `ABC-249` if merged) and TT rows (`ABC-081`,
  `ADR-0025`'s falsifiers) pass unedited.
- **A3 (TT shape).** `tableByteLength()` reads the same value as base (4 MiB in total), and for every key of A1's
  walk the TT slot equals base's slot.
- **A4 (API unchanged).** The exported signatures of `src/zobrist.ts`'s `zobristKey`, `src/history.ts`,
  `src/gameend.ts`, `src/levels.ts`, `src/uci-session.ts` and `EngineOptions` / `chooseMove` in `src/engine.ts` are
  unchanged (a `git diff` of their exported types reads empty, checked by QE). `priorKeys` is converted once per
  `chooseMove` / `search` call (a test-side counter or a code reading, named at design).
- **A5 (speed).** **Given** `kiwipete`, `position-6` and the start position, 5 interleaved fresh-process runs per board
  per build at 4 000 ms, ALONE, with `ADR-0055` D3's validity rule (spread ≤ 5 %, one re-run, then VOID), **then**
  head's median nodes per second is **≥ 1.02× base's on at least two boards and ≥ 1.00× on the third.** QE's reading
  on a sealed pre-registration decides.
  - **Why 1.02, not `ABC-240`'s 1.03:** the measured ceiling is ≈ 1.04×, so a 3 % bar would demand three quarters of
    the ceiling. Whether the 5-run median resolves 2 % on this host is `UNKNOWN - verify`; QE's pre-registration
    reports each board's run spread, and a reading whose spread exceeds 5 % is re-run, then VOID, never graded.
- **A6 (gates).** `npm run lint`, `typecheck`, `test`, `build` green at every commit. `G1` 54/58 with rows equal
  (`PUZZLE_DEEP=1`). `G4` (A2). `G5`. `G6` "≥ base" (floor 6). `G7`: TT and key arrays the same bytes, growth 0.
  `G8` ≤ 10 s, new lane rows ≤ 0.1 s (`N8-LANE` reported). `G9`. `G2`/`G3` not owed (`evaluate` untouched).
- **A7 (the grade).** **S2**: A1–A6, **no smoke**.

## What happens on a miss

- **A1–A4 red:** a defect. Back to the Software Engineer; A5 is read again after the fix.
- **A5 missed (A1–A4 green):** NOT MET, **not merged.** QE records a `failed-attempt` note (medians, ratios, spread,
  load1, Tctl). BA/PM closes it as **dropped**; there is nothing to re-tune. Nothing waits on it. It is re-opened only
  if a fresh profile ranks the key path at ≥ 5 % of self time on two boards.

## NFR triggers

- **`NFR-009`:** the TT stays 4 MiB; key arrays the same bytes; `G7` growth 0. **`NFR-005`:** `G6` "≥ base".
- **`NFR-004`:** `G5`; clock reads equal (A2). **`NFR-008`:** the walk under `ENGINE_DEEP=1`; ≤ 0.1 s lane.
- **Security:** none. The UCI and CLI move lists still reach the search through `priorKeys` as `bigint`, bounded as
  before (`RISK-EPIC010-06`, `KEY_ARRAY_CAPACITY`).

## Test notes

1. A1's oracle is `zobristKey` itself (the `bigint` path stays, so it is the reference forever, not only for this
   ticket).
2. A2 is the identity sweep, out of tree for the cross-build half.
3. About 1 h of ALONE host time for A5 and `G6` (estimate).
4. UAT is owed (production lines). The QE verdict signs it.

## Size and priority

- **Size: M** (`ADR-0055`: "M, 1 ticket"): the key path through both recursions, the TT and the repetition scan.
- **Priority: P3.** The smallest estimate of the O1 cuts (≤ 1.05×). Cheap risk, small prize.

## Dependencies

- **Pull order:** after the O1-b chain (`ABC-250` → `ABC-251` → `ABC-252`, or wherever it stops), per `ADR-0055` D4.
  **Files shared:** `src/search.ts`, `src/engine.ts`, `src/transposition.ts` (with `ABC-251`) and `src/zobrist.ts`'s
  `zobristKeyAfterMove` (with `ABC-250`/`ABC-252`), so it rebases on them. If the O1-b chain stalls, the Orchestrator
  may pull it earlier; nothing in its acceptance depends on O1-b.
- **Milestone 2:** `ABC-237`/`ABC-238` edit `src/transposition.ts`; they come after milestone 1b.
- No ADR (value-identical; `ADR-0025` and `ADR-0054` are kept as written). Architect/Design confirms at design.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ `ADR-0055` O1-a; its share and ceiling |
| 2 | scope and out-of-scope | ✅ hot path in halves, `bigint` at the API |
| 3 | INVEST | ✅ M; independent of `ABC-250`'s reading |
| 4 | testable, measurable acceptance | ✅ A1–A7, the 1.02 bar and why |
| 5 | dependencies known | ✅ pull order; shared files |
| 6 | NFR triggers with targets | ✅ ≥ 1.02×; TT 4 MiB; `G7` growth 0 |
| 7 | test notes | ✅ 4 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ✅ none |

**DoR 10/10. `Backlog → Ready` recommended**, pulled after the O1-b chain (the column move is the Orchestrator's).
