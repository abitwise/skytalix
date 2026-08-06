# Architecture
_Updated: 2026-08-06 by Architect/Design (task `refinement-deploy-posture-2026-08-06`) — added
**"Deployment posture"** below, on the owner's instruction that this project deploys nowhere and runs
locally; the posture was measured against the repo, not inherited from the config, and the why is in
`50-decisions/ADR-0007`. Nothing else in this file changed. Previously 2026-07-29 by Architect/Design
(as-built after EPIC-001, from the 2026-07-29 audit)._

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

Eleven production modules, flat in `src/`, one job each.

| Layer | Module | Owns |
|---|---|---|
| Representation | `position.ts` | the 0x88 board (ADR-0001), piece encoding, square geometry and naming |
| Serialization | `fen.ts` | FEN parse/serialize; typed `FenError` on malformed grammar |
| Hashing | `zobrist.ts` | 64-bit `bigint` position key, fixed seed, recomputed per call; asks `legal.ts` whether an en-passant capture is real (ABC-011), so this row is not a leaf |
| Generation | `moves.ts` | pseudo-legal move generation, plus the `isSquareAttackedBy` primitive |
| Mutation | `apply.ts` | `makeMove` / `unmakeMove` — the only writer of a `Position` |
| Legality | `legal.ts` | `legalMoves`, `isInCheck` |
| Terminal state | `gameend.ts` | checkmate, stalemate, 50-move, repetition, insufficient material |
| Game history | `history.ts` | `GameHistory` — the move list is the authority (ADR-0002 clause 2); undo, the key list and the repetition counts are derived by replay (ABC-012). Nothing in the core imports it |
| Presentation | `render.ts` | `renderBoard` — the board frame as a VALUE, 9 rows x 18 characters, shaded by character, in either glyph mode and either orientation (ABC-014). It writes nothing and reads no terminal; `ABC-018` owns writing. Nothing imports it yet |
| Verification | `perft.ts` | node counting and per-first-move divide |
| Harness (only I/O) | `perft-bench.ts` | `npm run perft`; the only module that prints, and it runs on import |

One `*.test.ts` beside each module (`position.ts` covered transitively, `perft-bench.ts` not
covered), plus a deep perft lane behind `PERFT_DEEP=1`.

## System patterns

- **Layered acyclic dependencies.** `position` ← {`fen`, `moves`} ← `apply` ← `legal` ←
  {`zobrist`, `perft`} ← {`gameend`, `perft-bench`} ← `history`. Re-verified 2026-08-04 by
  rebuilding the graph from `src/*.ts`: zero cycles, depth 7, no upward edge. `position.ts` is
  the only leaf and the hub — 8 of the 9 other modules import it. **Corrected by ABC-011:**
  `zobrist.ts` was a level-2 leaf beside `moves.ts` until it began asking `legal.ts` whether an
  en-passant capture is real (ADR-0005), which moves it 2 → 5 and carries `gameend.ts` 5 → 6;
  homing that predicate in `moves.ts` instead would have made this project's first cycle
  (`apply → moves → apply`), which is why it is in `legal.ts`. **Extended by ABC-012:**
  `history.ts` sits alone at level 7 above `gameend.ts`, so the depth is 6 → 7. Every one of its
  six edges points down (`fen`, `apply`, `zobrist`, `gameend`, plus the `Move` / `Position`
  types) and **nothing imports it** — measured, not assumed: it is the one module with zero
  importers, which is what keeps the core ignorant of the session. **Extended by ABC-014
  (2026-08-06), and it moves nothing:** `render.ts` imports `position.ts` and nothing else, so it
  sits at **level 2** beside `fen.ts` and `moves.ts`, not on top of the stack — a renderer that
  needed `legal.ts` or `gameend.ts` would be drawing something this ticket does not draw. Graph
  rebuilt from `src/*.ts` at the same commit: **11 modules, zero cycles, depth still 7**,
  `position.ts` imported by **9 of the other 10** (all but `perft-bench.ts`), and `render.ts` joins
  `history.ts` and `perft-bench.ts` as a module with **zero importers** — `ABC-018` will be its
  first.
- **Mutable `Position`, make/unmake, never copy.** `makeMove` mutates the 128-byte board in
  place and returns a four-field `UndoRecord` that the **caller** owns; `unmakeMove` reverses
  it. Nothing clones a `Position` and no clone function exists. Consequence for consumers: a
  `Position` is a live object, never a snapshot — hold one across a move and it changes under
  you.
- **Transient mutation behind pure-looking queries.** `legalMoves`, `gameStatus`, `perft` and —
  since ABC-011 — `zobristKey` play moves and take them back internally, returning the position
  as they found it. `zobristKey` is the one worth naming: it looks like a read and mostly is
  one, but on the ~1% of nodes carrying an available en-passant capture it plays that capture
  to test its legality. Consequence: you cannot hash a `Position` you are not permitted to
  write to, nor hash one from two threads at once.
- **The core owns a position, not a game.** No move list, no undo stack, no history;
  `gameStatus` still takes repetition counts as an optional caller-supplied map. **Answered by
  ABC-012 (2026-08-04), and the answer keeps the core exactly as it was:** game history is owned
  by `history.ts`, one level ABOVE the core, which no core module imports. `gameStatusOf` is
  ADR-0002 clause 4's single supplier of that optional map; the parameter stays optional because
  clause 3 has EPIC-004's search keep its own per-ply key array and decide repetition itself, so
  a bare `gameStatus(position)` at a search leaf is a legitimate second caller shape.

## Tech context

TypeScript on Node >= 22, ESM. Node type-strips `.ts` directly, so there is no bundler and no
transpile step; intra-repo imports carry explicit `.ts` extensions
(`allowImportingTsExtensions`, `verbatimModuleSyntax`). Vitest for tests, Biome for lint and
format. `npm run build` is `tsc --noEmit` — a typecheck, not an emit, because nothing is
published until EPIC-006. Commands live in `AGENTS.md`.

## Deployment posture — deploys nowhere, runs locally

**Present posture, explicitly revisitable. Revisit trigger: `EPIC-006` (packaging).** Owner's
instruction, 2026-08-06: *"this project currently does not deploy anywhere, mark that as well, it
will be used locally for now."*

Nothing is deployed, published or released, and there is no deploy target of any kind. **Measured
across the whole repo on 2026-08-06, not assumed from the config:**

- **No deploy artifact.** No Dockerfile, no compose file, no chart, no manifest, no IaC — the
  repository contains **no YAML file at all**.
- **No CI, so no CI deploy step.** `.github/` holds one file (`copilot-instructions.md`); there is
  no `.github/workflows/`.
- **Nothing publishable and nothing to run.** `package.json` is `private` with no `main`, `exports`
  or `bin` and no `start` script; the build emits nothing (`tsc --noEmit`, no `dist/`); `src/` has
  no entry module. `AGENTS.md` records `Dev / run: UNKNOWN - verify` for that reason.
- **Nowhere to push.** The repo has no git remote.
- **Nothing released.** `plans/releases/` holds only `.gitkeep`.

The config now says this instead of implying a cluster: `default_stack.deploy` is `none-local-only`
and `environments` is `["local"]` (previously `kubernetes-ready` and `["dev","staging","prod"]`,
neither of which anything here implemented).

**What this does NOT mean.** `production_requires_human_confirmation` stays `true`; the release and
incident machinery stays; the never-deploy limit in every role stays. *"We have no production"* is a
fact about today, and those are rails for the day it changes — a rail costs nothing while unused.
**How the CLI will eventually be distributed — npm, a binary, a clone — is UNDECIDED and belongs to
`EPIC-006`.**

Why, the alternatives weighed (including why `environments` is `["local"]` and not `[]`), and what
would falsify it: **`50-decisions/ADR-0007`**. What is true operationally — that there is nothing to
operate, deploy or roll back — is in `70-runbook.md`.
