---
id: 20260812T183000Z-architect-design-observation-adr-conformance-0001-0011-e5a72c40
kind: observation
by: architect-design
at: 2026-08-12T18:30:00Z
verified_by:
confidence: high
refs:
  - arch-audit-2026-08-12
  - ADR-0001
  - ADR-0002
  - ADR-0003
  - ADR-0004
  - ADR-0005
  - ADR-0006
  - ADR-0007
  - ADR-0008
  - ADR-0009
  - ADR-0010
  - ADR-0011
supersedes:
---

# ADR conformance, all eleven: the code contradicts NONE of them

> **Hand-authored, not a `finding`.** **Nothing here re-opens any ADR.** `ADR-0008`, `ADR-0009` and
> `ADR-0010` are explicitly not re-openable and `ADR-0008` was ratified by the owner in person;
> every line below **reports** and none overturns.

| ADR | ruling | code today | verdict |
|---|---|---|---|
| 0001 | board is 0x88 | `position.ts:44` `(square & 0x88) === 0`, 128-entry board | **CONFORMS** |
| 0002 | core keeps a position not a game; move list is the authority; search keeps its own key array; `positionCounts` has ONE supplier | `history.ts` owns `{anchor, Move[]}` and derives by replay; `turn-loop` calls `gameStatusOf(history)` and never bare `gameStatus`; **`turn-loop.ts` is the sole RUNTIME importer of `history.ts`** | **CONFORMS.** Clause 3 is unbuilt (`EPIC-004`) — not a contradiction |
| 0003 | keep make/test/unmake; change the target not the code | `legal.ts:47-51` is exactly make → test → unmake | **CONFORMS in substance.** Two descriptors have drifted — see below |
| 0004 | SAN in one module, **both directions**, over one grammar | `san.ts` exports **only `toSan`**; imports `position`/`moves`/`apply`/`legal` and **not** `gameend`, **not** `history` — exactly as clause 1 requires | **CONFORMS; clause 2 HALF-BUILT.** `parseSan` is `EPIC-003`'s and `san.ts`'s own header reserves it |
| 0005 | "available" = a LEGAL ep capture; predicate lives in `legal.ts`; `zobrist` imports it; no-ep guard short-circuits first | `zobrist.ts:28` imports `hasLegalEnPassant`; `:85` tests `epSquare !== NO_SQUARE` **first** | **CONFORMS**, clause for clause |
| 0006 | the key hashes castling RIGHTS and keeps doing so | `zobrist.ts:79-81` XORs over `CASTLE_FLAGS` against `position.castling` | **CONFORMS** |
| 0007 | deploys nowhere, runs locally | all five posture bullets re-verified true | **CONFORMS** |
| 0008 | lane total 3 s wall / 13 s CPU; per-ticket bar on CPU; isolation retained; `pool: "threads"` a candidate NOT adopted | **no `vitest.config.ts` exists**, so isolation is retained and threads is not adopted | **CONFORMS structurally.** One census inside it is stale — below |
| 0009 | producer owns its row count; **clause 9**: the consumer names no row count | `turn-loop.ts:224` `writer ??= beginFrameSession(sink, frame.length)` — session height is the FIRST frame's own length, `beginFrameSession` called once, and the loop **does not import `frameHeight`** | **CONFORMS** |
| 0010 | the CONSUMER clears; in-place writer erases per row; `W` is a per-frame MAX | `frame.ts:236-241` emits cursor-home + erase-in-line joined + ONE erase-to-end-of-screen in ONE `write()`; `:201` `W` = `reduce(Math.max)` | **CONFORMS**, including the "one write per frame" clause |
| 0011 | production module = every non-`.test` `.ts` under `src/`; probe roots at the declared frame path; regex licence is an EQUALITY; entry point = zero exports | licence is `["turn-loop.ts"]` and the measured runtime-importer set is exactly `{turn-loop.ts}`; `perft-bench.ts` is still the only zero-export module; frame closure = 11 | **CONFORMS** |

## No ADR is contradicted by the code. Two DESCRIPTORS inside ADRs have drifted from their own text

Both are stale prose about the tree, not stale rulings. **Neither is worth an amendment on its own**
and neither is edited here.

1. **`ADR-0003` clause 1 says *"`src/legal.ts` is not changed"* and *"it is 55 lines"*.** `legal.ts`
   is **143 lines** and it *was* changed — `hasLegalEnPassant` was added to it. **This is not a
   contradiction, it is a supersession that is already on the record**: `ADR-0005` clause 2
   deliberately homed that predicate in `legal.ts` (homing it in `moves.ts` would have created this
   project's first cycle, `apply → moves → apply`). Clause 1's actual subject — the legality
   *strategy* — is untouched. **A reader of `ADR-0003` alone would be misled; a reader of both is
   not.**
2. **`ADR-0004` clause 1 says `src/` *"gains its tenth production module"*.** It is the 17-module
   tree now. The ruling is unaffected.

## The one item with a live consequence: `ADR-0008`'s screen census

`ADR-0008` Decision 8 requires the `pool: "threads"` screen to include **"all four `*.nfr.test.ts`
files"**. **There are now seven.** Dated precisely: at authoring (2026-08-10) the four were
`gameend` (08-01), `zobrist` (08-03), `glyph-mode` (08-08), `san` (08-10) — **the count was correct
when written** — and `history-pane`, `status-panel` and `turn-loop` all landed **2026-08-11**, the
day it was ratified. **The ruling is right; its census went stale in under 24 hours.** Recorded as an
audit note in `plans/nfr-catalog.md` under `NFR-008` with no target, bar or level moved (the eight
rows were hash-verified byte-identical before and after, `sha256 325c5c03…f6d4`). **`ADR-0008` itself
was not edited.**

## Nothing has been quietly superseded

The one candidate — `ADR-0009` clause 9 vs `ADR-0010` — is **explicitly** handled: `ADR-0010`
clause 4 states that clause 9's `firstFrame.length` derivation is **not** extended to width and
scopes clause 9 to row counts, with the measurement (`H` invariant over 510 shapes, `W` not). That is
a bounded coexistence written down at the time, not a silent overwrite.
