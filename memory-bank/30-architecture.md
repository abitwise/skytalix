# Architecture
_Updated: 2026-07-29 by Architect/Design (as-built after EPIC-001, from the 2026-07-29 audit)_

<!--
  FORMAT — read before you fill this in. (clear voice; this is a technical file, not a role prompt.)

  Architecture, system patterns, and tech context: the shape of the system and the decisions
  that hold it together. Ships EMPTY — fill per-project during bootstrap. Record the why of a
  structural choice as an ADR in 50-decisions/, not here. Keep it short.
-->

## System context

A single-player terminal chess game running in one local process. No network, no database, no
service boundary, zero runtime dependencies. `package.json` is `private` with no `main`,
`exports` or `bin`, so nothing is published and nothing imports this from outside.

Only the **rules core** is built (EPIC-001, merged): position, rules, and a perft verification
harness. Renderer (EPIC-002), input parser (EPIC-003), engine search (EPIC-004), opening book
(EPIC-005) and packaging (EPIC-006) do not exist yet. There is no barrel and no entry module —
consumers deep-import a file by path.

## Key components

Nine production modules, flat in `src/`, one job each.

| Layer | Module | Owns |
|---|---|---|
| Representation | `position.ts` | the 0x88 board (ADR-0001), piece encoding, square geometry and naming |
| Serialization | `fen.ts` | FEN parse/serialize; typed `FenError` on malformed grammar |
| Hashing | `zobrist.ts` | 64-bit `bigint` position key, fixed seed, recomputed per call |
| Generation | `moves.ts` | pseudo-legal move generation, plus the `isSquareAttackedBy` primitive |
| Mutation | `apply.ts` | `makeMove` / `unmakeMove` — the only writer of a `Position` |
| Legality | `legal.ts` | `legalMoves`, `isInCheck` |
| Terminal state | `gameend.ts` | checkmate, stalemate, 50-move, repetition, insufficient material |
| Verification | `perft.ts` | node counting and per-first-move divide |
| Harness (only I/O) | `perft-bench.ts` | `npm run perft`; the only module that prints, and it runs on import |

One `*.test.ts` beside each module (`position.ts` covered transitively, `perft-bench.ts` not
covered), plus a deep perft lane behind `PERFT_DEEP=1`.

## System patterns

- **Layered acyclic dependencies.** `position` ← {`fen`, `moves`, `zobrist`} ← `apply` ←
  `legal` ← {`gameend`, `perft`} ← `perft-bench`. Verified 2026-07-29: zero cycles, depth 6, no
  upward edge. `position.ts` is the only leaf and the hub — 7 of the 8 other modules import it.
- **Mutable `Position`, make/unmake, never copy.** `makeMove` mutates the 128-byte board in
  place and returns a four-field `UndoRecord` that the **caller** owns; `unmakeMove` reverses
  it. Nothing clones a `Position` and no clone function exists. Consequence for consumers: a
  `Position` is a live object, never a snapshot — hold one across a move and it changes under
  you.
- **Transient mutation behind pure-looking queries.** `legalMoves`, `gameStatus` and `perft`
  play moves and take them back internally, returning the position as they found it.
- **The core owns a position, not a game.** No move list, no undo stack, no history;
  `gameStatus` takes repetition counts as an optional caller-supplied map. Who owns game
  history is an open decision, not a recorded one.

## Tech context

TypeScript on Node >= 22, ESM. Node type-strips `.ts` directly, so there is no bundler and no
transpile step; intra-repo imports carry explicit `.ts` extensions
(`allowImportingTsExtensions`, `verbatimModuleSyntax`). Vitest for tests, Biome for lint and
format. `npm run build` is `tsc --noEmit` — a typecheck, not an emit, because nothing is
published until EPIC-006. Commands live in `AGENTS.md`.
