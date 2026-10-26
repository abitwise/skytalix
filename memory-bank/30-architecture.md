# Architecture
_Updated: 2026-09-19 by the Software Engineer (task `wave-2026-09-19`, subtask `ticket-to-pr-ABC-075`, Workflow 04) — **the two edits ADR-0020 said fall due when `ABC-075` lands, and nothing else:** the module-table row for `zobrist.ts` (it no longer imports `legal.ts`; `zobristKeyAfterMove` added; its depth is now `UNKNOWN - verify` — the table was NOT re-measured at this hop) and the transient-mutation paragraph (`zobristKey` is a pure read again; the two-threads foreclosure is discharged per ADR-0020). Every other line is byte-identical._
_Updated: 2026-08-12 by Architect/Design (task `arch-audit-2026-08-12`, subtask `audit-architecture`,
Workflow 07) — **REWRITTEN TO AS-BUILT.** The previous revision described the tree *after `EPIC-001`*
and was written before the whole `EPIC-002` render/loop stack landed; it said **eleven** production
modules and **depth 7** against a measured **seventeen** and **depth 8**, and its
"`render.ts` has zero importers" / "one `*.test.ts` beside each module" sentences were false. Every
graph figure below was rebuilt from `src/*.ts` imports at this hop, not carried over. **No ADR was
re-opened and no decision was taken here** — this file records structure, and `50-decisions/` still
owns every why. Previously 2026-08-06 (deployment posture) and 2026-07-29 (as-built after EPIC-001)._

<!--
  FORMAT — read before you fill this in. (clear voice; this is a technical file, not a role prompt.)

  Architecture, system patterns, and tech context: the shape of the system and the decisions
  that hold it together. Ships EMPTY — fill per-project during bootstrap. Record the why of a
  structural choice as an ADR in 50-decisions/, not here. Keep it short.
-->

## System context

A single-player terminal chess game running in one local process. No network, no database, no
service boundary, **zero runtime dependencies** (`package.json` has no `dependencies` key at all —
verified, not assumed). It is `private` with no `main`, `exports` or `bin`, so nothing is published
and nothing imports this from outside.

**Two epics are built and merged: `EPIC-001` (rules core) and `EPIC-002` (terminal board and game
loop).** The renderer, the panels, the frame assembler/writer and the turn loop all exist.
`EPIC-003` (input parser and commands), `EPIC-004` (engine search), `EPIC-005` (opening book) and
`EPIC-006` (session and packaging) do not.

**There is still no barrel and no entry module** — consumers deep-import a file by path, and
`AGENTS.md` records `Dev / run` as `UNKNOWN - verify` because nothing starts a game. `EPIC-006`
owns the first entry point; `ADR-0011` clause 4 already classifies what one is.

## Key components

**Seventeen production modules, flat in `src/`, one job each.** `src/` has no subdirectory holding
a `.ts` file (its only subdirectory, `__snapshots__`, holds none). Level = longest import path,
measured below.

| L | Module | Owns |
|---|---|---|
| 1 | `position.ts` | the 0x88 board (ADR-0001), piece encoding, square geometry and naming. The only leaf and the hub |
| 2 | `moves.ts` | pseudo-legal move generation, plus the `isSquareAttackedBy` primitive |
| 2 | `render.ts` | `renderBoard` — the board frame as a VALUE, 9 rows, shaded by character, either glyph mode, either orientation. Reads no terminal and writes nothing |
| 3 | `apply.ts` | `makeMove` / `unmakeMove` — the only writer of a `Position` |
| 3 | `fen.ts` | FEN parse/serialize, grammar and semantics; typed `FenError` naming the fault. `parseFen` is the boundary; `parseFenGrammarOnly` is grammar only, for rules-core tests, and no production module names it. Level 3 since `ABC-010`: it imports `moves.ts` `isSquareAttackedBy` (ADR-0033) |
| 3 | `frame.ts` | `assembleFrame` (the frame as a constant-height VALUE) and `beginFrameSession` (the writer, strategy chosen once). Imports only a TYPE — it composes by injection, so its runtime closure is itself alone (ADR-0011) |
| 3 | `glyph-mode.ts` | the five-row glyph precedence RULE plus the SESSION that reads `isTTY`/`env` exactly once. The only module that reads ambient terminal signals |
| 4 | `legal.ts` | `legalMoves`, `isInCheck`, and `hasLegalEnPassant` — make/test/unmake (ADR-0003), and the en-passant oracle the hash asks (ADR-0005) |
| 5 | `perft.ts` | node counting and per-first-move divide |
| 5 | `san.ts` | `toSan`. `parseSan` is `EPIC-003`'s and lands in THIS file over the same tables — one grammar, both directions (ADR-0004 clause 2) |
| 5 | `zobrist.ts` | 64-bit `bigint` key, fixed seed. `zobristKey` is the full scan (seed and oracle); `zobristKeyAfterMove` derives the next key from the previous one in a bounded number of XORs (`ABC-075`, ADR-0020). Since ADR-0020 the ep component keys on `epSquare` being SET, so the module no longer imports `legal.ts` — it sits directly above `apply.ts` (a type-only `UndoRecord` import) and is a pure read of the board. Level 5 in this table is the pre-`ABC-075` depth; the post-change depth is `UNKNOWN - verify` until the table is re-measured |
| 6 | `gameend.ts` | checkmate, stalemate, 50/75-move, repetition, insufficient material |
| 6 | `perft-bench.ts` | `npm run perft`. **The only module that prints and the only one with zero exports** — it calls `main()` at module scope (`:114`). That is exactly `ADR-0011` clause 4's *entry point* |
| 7 | `history.ts` | `GameHistory` — the move list is the authority (ADR-0002 clause 2); undo, keys and repetition counts derived by replay. Nothing in the rules core imports it |
| 8 | `history-pane.ts` | the bounded two-column SAN pane, constant height and width. Returns rows, writes nothing |
| 8 | `status-panel.ts` | the status panel rows. Derives nothing about game state — `status` is a parameter |
| 8 | `turn-loop.ts` | ply dispatch, both seams stubbed, clean termination. Drives the writer; composes no frame and reads no stdin |

**Test files: 28, not one per module.** The mapping is deliberate and uneven — `moves` has 5,
`san` 4, seven modules carry a `*.nfr.test.ts` sibling, `position.ts` is covered transitively and
`perft-bench.ts` is not covered. A deep perft lane sits behind `PERFT_DEEP=1`.

## System patterns

- **Layered acyclic dependencies — measured, not asserted.** Rebuilt from `src/*.ts` at this hop:
  **17 modules, 49 import edges, ZERO cycles, depth 8.** `position.ts` is the only leaf and the hub
  (**fan-in 11** of the other 16); the next-most-depended-on are `moves.ts` (8), then `apply.ts` and
  `legal.ts` (6 each). **Five modules have zero importers** — `turn-loop.ts`, `status-panel.ts`,
  `history-pane.ts`, `glyph-mode.ts` and `perft-bench.ts` — and that is the shape of a system whose
  top layer is not yet driven by anything. **`EPIC-006`'s entry point is what will finally import
  four of those five.**
- **Twelve of the 49 edges are type-only and are ERASED at runtime, and the distinction is
  load-bearing rather than pedantic.** Under `verbatimModuleSyntax` an `import type` compiles to
  nothing, so the *runtime* graph is 37 edges and a different shape: `frame.ts` and `glyph-mode.ts`
  import `render.ts` for the `GlyphMode` type ONLY, so **`render.ts` has two importers on paper and
  zero at runtime**; `status-panel.ts` and `history-pane.ts` name `history.ts` only as a type, so
  **`turn-loop.ts` is the single runtime importer of `history.ts`** — which is `ADR-0002` clause 4's
  single-supplier rule and precisely what `ADR-0011` clause 3's licence asserts. **A guard that read
  the text instead of the loads would get this wrong**, which is why `NFR-002`'s probe measures
  module *evaluation* in a child process rather than pattern-matching source.
- **A frame is composed by INJECTION, not by import**, so frame membership is not derivable from
  the module graph at all — no closure of any single module yields the frame path (`ADR-0011`
  clause 2, which is why the path is DECLARED). Nothing in `src/` imports a renderer.
- **Mutable `Position`, make/unmake, never copy.** `makeMove` mutates the 128-byte board in place
  and returns a four-field `UndoRecord` the **caller** owns; `unmakeMove` reverses it. Nothing
  clones a `Position` and **no clone function exists** (verified). A `Position` is a live object,
  never a snapshot — hold one across a move and it changes under you.
- **Transient mutation behind pure-looking queries.** `legalMoves`, `gameStatus`, `perft` and
  **`toSan`** all play moves and take them back internally, returning the position as they found
  it. `zobristKey` was the one worth naming here until `ABC-075` (ADR-0020, 2026-09-19): under
  ADR-0005 it played the en-passant capture on ~2% of nodes to test its legality, so you could not
  hash a `Position` you might not write to, nor hash one from two threads at once. **That is gone:
  the ep component now keys on `epSquare` being set, `zobristKey` is a pure read of the board, and
  `zobristKeyAfterMove` writes nothing either.** The two-threads clause was the foreclosure on one
  shape of parallel search that ADR-0005 `F6` guarded; ADR-0020 records it as discharged, not
  tripped. Whether `EPIC-004` ever wants a parallel shape is still `UNKNOWN - verify`.
- **The renderers replay; they never rewind the caller.** `history-pane.ts` and `status-panel.ts`
  call `parseFen` + `makeMove` on **their own fresh position** built from the anchor, never on the
  caller's. That is why they can be pure-looking without owning an undo.
- **The core owns a position, not a game.** No move list, no undo stack, no history in the core;
  `gameStatus` takes repetition counts as an optional caller-supplied map, and `history.ts` — one
  level above the core, imported by no core module — is `ADR-0002` clause 4's single supplier via
  `gameStatusOf`. The parameter stays optional because clause 3 has `EPIC-004`'s search keep its own
  per-ply key array.
- **The loop owns no I/O.** `turn-loop.ts` takes its `FrameSink`, render seam, input seam and engine
  seam as injected options; it never reaches for `process.stdout` and never reads stdin. It names no
  row count either — the session height is the FIRST frame's `.length` (`ADR-0009` clause 9).

## Tech context

TypeScript on Node >= 22, ESM. *2026-10-26 (`QE-216-h`): the floor now reads Node >= 22.18, matching
`package.json` `engines.node` since `ABC-216` (`39b93505`); 22.18.0 is where Node 22 type-strips by default
(`50-decisions/ADR-0044`).* Node type-strips `.ts` directly, so there is no bundler and no
transpile step; intra-repo imports carry explicit `.ts` extensions (`allowImportingTsExtensions`,
`verbatimModuleSyntax`). Vitest for tests, Biome for lint and format. **There is no
`vitest.config.ts`** — the runner runs on defaults, which is why `pool: "threads"` is a two-line
change and why `ADR-0008` prices it as one. `npm run build` is `tsc --noEmit` — a typecheck, not an
emit, because nothing is published until `EPIC-006`. `spike/perft-bench.ts` (`npm run spike:perft`)
is `ABC-008`'s throwaway harness and is not production. Commands live in `AGENTS.md`.

**The default test lane has a ratified budget — `NFR-008` / `ADR-0008`, 3 s wall AND 13 s CPU** —
and the lane costs ~160 ms CPU per test FILE against ~0.4 ms per test, so **file count is the
architectural cost driver and it is charged to the floor account, owner Architect/Design.**

## Deployment posture — deploys nowhere, runs locally

**Present posture, explicitly revisitable. Revisit trigger: `EPIC-006` (packaging).** Owner's
instruction, 2026-08-06: *"this project currently does not deploy anywhere, mark that as well, it
will be used locally for now."*

Nothing is deployed, published or released, and there is no deploy target of any kind. **Every
bullet below was RE-VERIFIED at this hop, 2026-08-12, and all five still hold:**

- **No deploy artifact.** No Dockerfile, no compose file, no chart, no manifest, no IaC — the
  repository contains **no YAML file at all**.
- **No CI, so no CI deploy step.** `.github/` holds one file (`copilot-instructions.md`); there is
  no `.github/workflows/`.
- **Nothing publishable and nothing to run.** `package.json` is `private` with no `main`, `exports`
  or `bin` and no `start` script; the build emits nothing (`tsc --noEmit`, no `dist/`); `src/` has
  no entry module. `AGENTS.md` records `Dev / run: UNKNOWN - verify` for that reason.
- **Nowhere to push.** The repo has no git remote. *2026-10-24 (`ADR-0049` row 33): no longer true. The
  owner added a remote on 2026-10-23 and the source is public on GitHub. Pushing is the owner's. Nothing is
  deployed, published or released (`50-decisions/ADR-0049`).*
- **Nothing released.** `plans/releases/` holds only `.gitkeep`.

The config says this rather than implying a cluster: `default_stack.deploy` is `none-local-only`
and `environments` is `["local"]`.

**What this does NOT mean.** `production_requires_human_confirmation` stays `true`; the release and
incident machinery stays; the never-deploy limit in every role stays. *"We have no production"* is a
fact about today, and those are rails for the day it changes — a rail costs nothing while unused.
**How the CLI will eventually be distributed — npm, a binary, a clone — is UNDECIDED and belongs to
`EPIC-006`.** **[DECIDED 2026-09-19 on the owner's word: `git clone` + `npm install` + `npm run chess`,
"for now" — `50-decisions/ADR-0018`, superseding `ADR-0007` clause 5 only. Nothing else in this
section moved.]**

Why, the alternatives weighed (including why `environments` is `["local"]` and not `[]`), and what
would falsify it: **`50-decisions/ADR-0007`**. What is true operationally — that there is nothing to
operate, deploy or roll back — is in `70-runbook.md`.
