---
id: 20260729T145019Z-brownfield-mapper-observation-ac540523
kind: observation
by: brownfield-mapper
at: 2026-07-29T14:50:19Z
verified_by: 
confidence: high
refs:
  - src/position.ts
  - src/fen.ts
  - src/moves.ts
  - src/apply.ts
  - src/legal.ts
  - src/zobrist.ts
  - src/gameend.ts
  - src/perft.ts
  - src/perft-bench.ts
  - src/fen.test.ts
  - src/moves.test.ts
  - src/apply.test.ts
  - src/legal.test.ts
  - src/zobrist.test.ts
  - src/gameend.test.ts
  - src/perft.test.ts
  - package.json
  - tsconfig.json
  - biome.json
  - AGENTS.md
  - memory-bank/00-index.md
  - memory-bank/10-project-brief.md
  - memory-bank/20-product.md
  - memory-bank/30-architecture.md
  - memory-bank/40-contributing.md
  - memory-bank/60-progress.md
  - memory-bank/70-runbook.md
  - memory-bank/80-glossary.md
  - memory-bank/50-decisions/ADR-0001-board-representation-0x88.md
  - plans/traceability.md
  - .grugops/factory.config.json
  - EPIC-001
supersedes: 
---

# Brownfield map — AUDIT MODE, `main` at EPIC-001 complete

Read-only evidence layer for subtask `arch-audit-map` of task `architecture-audit-2026-07-29`.
Workflow 01 step 1 only, run as an audit on a repo the factory itself built. **Facts and
measurements only** — every number below was produced by running the command named beside it in
this session. Judgment about whether the structure is *good* is deliberately out of scope and
belongs to the concurrent design-review agent. Nothing was written to `src/**`, `plans/**`, or
`memory-bank/**`; no board move, no ticket edit, no commit.

## 0. Provenance caveat — no sanctioned writer in this repo

`scripts/context-io.ts` (the SCTX-01 sanctioned writer) and `scripts/claim.js` (the atomic-claim
primitive) are **both absent** — there is no `scripts/` directory at all in this repo
(`ls scripts` → `No such file or directory`). This note was therefore composed and written
**directly to the filesystem**, hand-matched to the `agent-factory/contracts/context-note.md`
schema and to the frontmatter shape of the existing notes under
`.grugops/context/ticket-to-pr-ABC-007/notes/`. It passed **no validator**, and no atomic claim
was taken on this subtask. That is an honest statement of what did and did not happen — no
enforcement is claimed that does not exist here.

Consistent with that: this audit produces **zero `finding` notes**. There is no live §14-gate
verdict to stamp against, so `verified_by:` stays empty and a `finding` would be inadmissible.
Everything below is either a measured fact (`observation`) or, where marked, a soft `claim` with
its confidence stated inline.

---

## 1. Module inventory

Nine production modules, seven test modules, all flat in `src/`. No subdirectories.
LOC from `wc -l src/*.ts` — **2632 total including tests; 1113 production, 1519 test**.

| Module | LOC | Owns | Exported surface |
|---|---:|---|---|
| `src/position.ts` | 83 | The 0x88 board representation — the single shared data shape | `EMPTY` `PAWN` `KNIGHT` `BISHOP` `ROOK` `QUEEN` `KING` `BLACK` `CASTLE_WK/WQ/BK/BQ` `NO_SQUARE`, `interface Position`, `isOnBoard` `fileOf` `rankOf` `squareAt` `pieceType` `isBlack` `squareName` `parseSquareName` `emptyPosition` — **21 exports** |
| `src/fen.ts` | 225 | FEN parse/serialize, with named rejection errors | `class FenError`, `parseFen`, `toFen` — 3 exports |
| `src/moves.ts` | 350 | Pseudo-legal move generation **plus** the attack-detection primitive | `FLAG_NONE` `FLAG_EN_PASSANT` `FLAG_CASTLE` `FLAG_PROMOTION`, `interface Move`, `isSquareAttackedBy`, `generateMoves` — 7 exports |
| `src/apply.ts` | 165 | In-place make/unmake with a 4-field undo record; special-move legs | `interface UndoRecord`, `makeMove`, `unmakeMove` — 3 exports |
| `src/legal.ts` | 55 | Legality filtering via make/test/unmake | `isInCheck`, `legalMoves` — 2 exports |
| `src/zobrist.ts` | 74 | Deterministic 64-bit position hashing (splitmix64, fixed seed `0x1234567890abcdef`) | `zobristKey` — 1 export |
| `src/gameend.ts` | 111 | Terminal-state detection across the five end conditions | `type GameResult`, `type EndReason`, `interface GameStatus`, `gameStatus` — 4 exports |
| `src/perft.ts` | 71 | Classic perft node counting + per-first-move divide | `perft`, `interface DivideEntry`, `perftDivide` — 3 exports |
| `src/perft-bench.ts` | 114 | Runnable CLI harness (`npm run perft`); prints counts, divide, nodes/sec, NFR-001 verdict | **0 exports** — calls `main()` at module top level (line 114) |

Largest production module: `src/moves.ts` (350 LOC). Largest file overall: `src/apply.test.ts`
(438 LOC).

## 2. Dependency graph — derived from actual `import` statements

Extracted mechanically by matching `from "./<name>.ts"` across all 16 files, then walked with a
DFS cycle detector.

Production edges (test files excluded):

```
position.ts   -> (nothing)
fen.ts        -> position.ts
moves.ts      -> position.ts
zobrist.ts    -> position.ts
apply.ts      -> moves.ts, position.ts
legal.ts      -> apply.ts, moves.ts, position.ts
gameend.ts    -> legal.ts, position.ts, zobrist.ts
perft.ts      -> apply.ts, legal.ts, moves.ts, position.ts
perft-bench.ts-> fen.ts, perft.ts
```

- **Cycles: NONE.** DFS over the full 16-file graph (production + tests) found zero back edges.
  The production graph is a strict DAG.
- **Depth: 6 levels (5 edges on the longest path).** Longest chain:
  `perft-bench.ts -> perft.ts -> legal.ts -> apply.ts -> moves.ts -> position.ts`.
  Level assignment (L0 = leaf): L0 `position`; L1 `fen`, `moves`, `zobrist`; L2 `apply`;
  L3 `legal`; L4 `gameend`, `perft`; L5 `perft-bench`.
- **Two DAG roots** (zero inbound production edges): `gameend.ts` and `perft-bench.ts`.
- `import type` is used where the import is type-only (`perft.ts` line 18
  `import type { Move }`; `type Position` / `type Move` inline specifiers elsewhere), consistent
  with `verbatimModuleSyntax: true` in `tsconfig.json`.
- Every intra-repo import carries an explicit `.ts` extension
  (`allowImportingTsExtensions: true`), because Node 22+ type-strips `.ts` directly and there is
  no bundler.

## 3. Layering as-built

The five layers named in the subtask brief all exist as distinct modules, and **the import
direction respects them without exception** — every edge points strictly downward or sideways
within a level; there is no upward edge anywhere.

| Layer | Module(s) | Depends on |
|---|---|---|
| Representation | `position.ts` | nothing |
| Serialization (boundary) | `fen.ts` | representation only |
| Hashing | `zobrist.ts` | representation only |
| Generation | `moves.ts` | representation only |
| Mutation | `apply.ts` | generation + representation |
| Rules / legality | `legal.ts` | mutation + generation + representation |
| Rules / terminal | `gameend.ts` | legality + hashing + representation |
| Verification | `perft.ts` | legality + mutation + generation + representation |
| Harness (I/O) | `perft-bench.ts` | verification + serialization |

Two direction facts worth recording precisely, because both look like inversions and neither is:

1. **`legal.ts` (rules) imports `apply.ts` (mutation).** This is not a layering violation but the
   chosen algorithm: `legalMoves` is make/test/unmake (`src/legal.ts` lines 46–52 — play the
   pseudo-legal move, ask `isSquareAttackedBy` about the mover's king, take it back). The
   module header documents this explicitly and names the EPIC-004 spike as the point where a
   pin-aware generator would be reconsidered.
2. **`moves.ts` (generation) exports `isSquareAttackedBy`, which `legal.ts` (rules) consumes for
   check detection.** The `moves.ts` header states why: castling's through-check rule is a
   castling rule, so ABC-004 put the attack primitive in generation, and ABC-005 then reused it.

## 4. Public vs internal surface

- **There is no barrel and no entry module.** `ls src/ | grep -i "index\|main\|entry"` returns
  nothing. Every consumer must deep-import a loose file by path with an explicit extension, e.g.
  `import { legalMoves } from "./legal.ts"`.
- **`package.json` declares no entry points at all.** `main`, `exports`, `bin`, `types`, and
  `files` are **all `null`** (verified via `jq`). The package is `"private": true`,
  `"type": "module"`, `"version": "0.0.0"`.
- **Consequence, factual:** a future CLI (EPIC-002/003/006) can currently import *any* of the 44
  exported symbols across the nine modules — the full internal surface is reachable, and there is
  no declared public subset. There is no mechanism (barrel, `exports` map, `files` allowlist)
  distinguishing intended-public from internal.
- `build` is `tsc --noEmit` — nothing is emitted or published. `AGENTS.md` names this honestly:
  "a typecheck wearing the build slot's name, not a real bundle."
- The 21 exports from `position.ts` are the largest single surface, and 7 of the 9 production
  modules import from it.

## 5. Test topology

Seven test files, one per production module, with **two production modules having no dedicated
test file**: `position.ts` (exercised transitively — `fen.test.ts` covers `squareName`/
`parseSquareName` directly under its `"square naming"` describe) and `perft-bench.ts` (no test
file, and absent entirely from the coverage report — it is never imported by a test).

### `npm test` — actual output, run this session

```
 ✓ src/moves.test.ts   (33 tests)     7ms
 ✓ src/fen.test.ts     (27 tests)     6ms
 ✓ src/apply.test.ts   (24 tests)    10ms
 ✓ src/zobrist.test.ts  (6 tests)     4ms
 ✓ src/legal.test.ts   (12 tests)     9ms
 ✓ src/gameend.test.ts (17 tests)     5ms
 ✓ src/perft.test.ts   (24 tests)   573ms

 Test Files  7 passed (7)
      Tests  143 passed (143)
   Duration  978ms
```

**143 passed / 143 total, 0 failed, 7 files, 978 ms.**

### Skip-count (test-integrity, per the `AGENTS.md` command)

`npx vitest run --reporter=json | jq ...` →
`numTotalTests 143, numPassedTests 143, numPendingTests 0, numTodoTests 0, numFailedTests 0`.
**Skip count = 0** (a real integer, not an assumed zero).

### `PERFT_DEEP=1 npx vitest run src/perft.test.ts` — actual output

```
 ✓ src/perft.test.ts (32 tests) 38129ms
   ✓ startpos perft(5)   = 4865609   [deep]   3934ms
   ✓ kiwipete perft(4)   = 4085603   [deep]   3449ms
   ✓ position-3 perft(5) = 674624    [deep]    697ms
   ✓ position-3 perft(6) = 11030083  [deep]  11922ms
   ✓ position-4 perft(4) = 422333    [deep]    415ms
   ✓ position-4 perft(5) = 15833292  [deep]  12606ms
   ✓ position-5 perft(4) = 2103487   [deep]   1731ms
   ✓ position-6 perft(4) = 3894594   [deep]   2845ms

 Test Files  1 passed (1)
      Tests  32 passed (32)
   Duration  38.40s
```

**32 passed / 32 (24 fast + 8 deep), 38.40 s.** The deep lane is gated by
`RUN_DEEP = process.env.PERFT_DEEP === "1"` (`src/perft.test.ts` line 66) and uses `continue` to
**not define** the deep cases when unset (line 77) — so they are absent from the default run,
never marked skipped, which is why the skip count stays a true 0. Deep cases get a 120 s timeout;
fast cases keep vitest's default 5 s.

The suite table (`src/perft.test.ts` lines 14–56) encodes the six standard positions with their
published counts; `fast` per position is the deepest depth in the default lane
(startpos 4, kiwipete 3, position-3 4, position-4 3, position-5 3, position-6 3).

### `npm run perft` — actual output, run this session

```
node       v24.12.0
platform   darwin/arm64

  startpos     perft(4) =      197,281   0.044 s   4,461,020/sec
  kiwipete     perft(4) =    4,085,603   0.691 s   5,916,719/sec
  position-3   perft(5) =      674,624   0.117 s   5,745,908/sec
  position-4   perft(4) =      422,333   0.074 s   5,705,500/sec
  position-5   perft(4) =    2,103,487   0.347 s   6,058,672/sec
  position-6   perft(4) =    3,894,594   0.580 s   6,715,855/sec

perftDivide — kiwipete depth 3:  48 moves, sum 97,862
Throughput   11,377,922 nodes in 1.855 s  =>  6,132,787/sec
NFR-001      >= 1,000,000 nodes/sec  AT OR ABOVE target
```

Exit 0. The harness prints its own caveat verbatim: this is **classic** perft, a leaf at depth 0
returns 1 without generating, so most counted nodes did no work and **the rate is INFLATED**
relative to real engine throughput; the ABC-008 spike's search-shaped metric is what NFR-005 is
read against. Recording that caveat here rather than the bare 6.1M figure.

### Coverage — committed artifact, NOT regenerated by this audit

`coverage/` is **git-tracked (22 files) and not in `.gitignore`**, and **no npm script produces
it** (`test` is plain `vitest run`; there is no `test:coverage`, and there is no
`vitest.config.ts`). Regenerating it would have rewritten tracked files, so this audit read the
committed `coverage/coverage-final.json` instead and reports it with that provenance.

From that artifact: **all eight library modules at 100% statements / 100% branches / 100%
functions** — `apply` 71/71, `fen` 154/154, `gameend` 44/44, `legal` 21/21, `moves` 217/217,
`perft` 31/31, `position` 41/41, `zobrist` 33/33. `src/perft-bench.ts` **does not appear in the
report at all**. Two `tools/grugops/*.js` files appear at 0% (279 uncovered statements), which is
what drags the artifact's file-weighted total to 68.69% statements — the src library number is
the 100% figure.

## 6. Gate commands — real results, run this session

| Command | Exit | Result |
|---|---:|---|
| `npm test` | 0 | 143/143 pass, 7 files, 978 ms |
| `npm run typecheck` (`tsc --noEmit`) | 0 | clean, no output |
| `npm run lint` (`biome check .`) | **0** | "Checked 20 files in 83ms. No fixes applied. **Found 2 infos.**" — both infos are about `biome.json` itself, not `src/`: (a) schema version `2.3.0` vs CLI `2.5.5`; (b) `linter.rules.recommended` is DEPRECATED, "use `preset` instead". Zero errors, zero warnings, zero `src/` diagnostics. |
| `npm run build` (`tsc --noEmit`) | not separately run | identical command to `typecheck` per `package.json` |
| `npm run perft` | 0 | 11,377,922 nodes, 6,132,787/sec, NFR-001 AT OR ABOVE target |
| `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | 0 | 32/32 pass, 38.40 s |
| skip-count | 0 | `0` |
| dev / run, acceptance/BDD, E2E, docs build, clean/reset, single-file typecheck | — | **`UNKNOWN - verify`** — recorded as such in `AGENTS.md`; not fabricated here either |

All four `quality.mandatory_gates` from `.grugops/factory.config.json`
(`lint`, `typecheck`, `unit`, `build`) are green on `main` today.

## 7. Coupling hotspots — measured inbound edges

Inbound edge counts, production-only and including test files:

| Module | inbound (prod) | inbound (incl. tests) |
|---|---:|---:|
| `position.ts` | **7** | **13** |
| `moves.ts` | 3 | 7 |
| `apply.ts` | 2 | 6 |
| `legal.ts` | 2 | 4 |
| `fen.ts` | 1 | 8 |
| `zobrist.ts` | 1 | 3 |
| `perft.ts` | 1 | 2 |
| `gameend.ts` | 0 | 1 |
| `perft-bench.ts` | 0 | 0 |

- **`position.ts` is the single hub**: 7 of the 8 other production modules import it (all but
  `perft-bench.ts`), and 13 of 15 other files do. It is also the only L0 leaf.
- **`fen.ts` is production-isolated**: exactly one production consumer (`perft-bench.ts`), versus
  seven test consumers. No core module (`moves`/`apply`/`legal`/`gameend`/`zobrist`/`perft`)
  imports it. Factually, FEN today is a test-and-harness fixture path, not a core dependency.

### Modules carrying more than one job (factual enumeration, no verdict)

- **`position.ts`, 83 LOC, six distinct concerns**: (1) piece/colour constants, (2) castling-flag
  constants, (3) the `Position` interface, (4) 0x88 square geometry (`isOnBoard` `fileOf`
  `rankOf` `squareAt`), (5) piece-byte decoding (`pieceType` `isBlack`), (6) algebraic
  **notation** (`squareName` `parseSquareName`) and (7) the `emptyPosition` factory. Notation is
  a presentation concern living inside the representation module; `squareName` is consumed by
  `perft.ts`'s `moveLabel` (line 48) and `fen.ts`.
- **`moves.ts`, 350 LOC, two exported jobs**: `generateMoves` (pseudo-legal generation) and
  `isSquareAttackedBy` (attack detection). The second is consumed by `legal.ts` for
  `isInCheck` — a different job from generation. The header documents this as deliberate
  (castling's through-check rule).
- **`perft-bench.ts`, 114 LOC**: the only module with an I/O side (14 `console.log` calls), the
  only one that executes on import (`main()` at line 114, no `import.meta` guard), and the only
  one embedding a policy threshold (`NFR_001_TARGET = 1_000_000`, line 50) and printing a
  pass/fail verdict string. It sits in `src/` beside the pure library modules and is included in
  both `tsconfig.json` `include` and `biome.json` `files.includes`.

## 8. State / mutation model — `Position` is MUTABLE; mutation is centralized in `apply.ts`

Verified against source, and the brief's hypothesis is confirmed with one qualification.

- `interface Position` (`src/position.ts` lines 30–42) has exactly **one `readonly` field**:
  `board: Uint8Array`. The reference is `readonly`; **the array contents are not** — a
  `Uint8Array` is mutable through a `readonly` reference. The other five fields (`blackToMove`,
  `castling`, `epSquare`, `halfmoveClock`, `fullmoveNumber`) are plainly mutable.
- **`src/apply.ts` is the only module that mutates a `Position`.** `makeMove` (lines 122–149)
  writes `position.board[...]`, `halfmoveClock`, `epSquare`, `castling`, `fullmoveNumber`,
  `blackToMove`; `unmakeMove` (152–165) reverses each; the private `applySpecial` (85–98) and
  `undoSpecial` (106–115) write only `position.board[...]`. No other production module contains a
  write to any `position.*` field — verified by reading every production module.
- The mutation is **in-place by explicit design**, recorded in the `apply.ts` header: the search
  calls make/unmake once per node across millions of nodes, so it returns a fixed four-field
  `UndoRecord` (`captured`, `castling`, `epSquare`, `halfmoveClock` — all `readonly`) **rather
  than copying the 128-byte board**, and "full-position copying is explicitly rejected by ABC-003
  for exactly this reason."
- **Three modules mutate transitively by calling make/unmake and restore before returning**:
  `legal.ts` `legalMoves` (make → test → unmake per move, position unchanged on return, stated in
  the doc comment at lines 37–41), `perft.ts` `perft`/`perftDivide`, and `gameend.ts` indirectly
  via `legalMoves`. So `legalMoves(position)`, `gameStatus(position)`, and `perft(position, d)`
  are all *observably* pure but *transiently* destructive — correctness depends on
  `unmakeMove` being an exact inverse.
- `emptyPosition()` (`position.ts` 74–83) and `parseFen()` are the only constructors; there is no
  clone/copy function anywhere in `src/`.

## 9. Drift check — memory-bank state, CONFIRMED by reading every file

Read all eight top-level `memory-bank/*.md` files plus `50-decisions/`. Result:

**Eight of nine memory-bank documents are unmodified kit templates carrying zero project
content.** Each is a heading skeleton plus a `FORMAT — read before you fill this in` HTML
comment that says "Ships EMPTY — fill per-project during bootstrap," with every content section
left blank. All eight are dated `_Updated: <date>_` — the literal placeholder, never substituted.
All eight have mtime `Jul 22 00:22` (kit install time), untouched across the entire EPIC-001
delivery.

| File | State | Evidence |
|---|---|---|
| `memory-bank/00-index.md` | **template** | `_Updated: <date>_`; generic bank map + working-memory contract only; no project content |
| `memory-bank/10-project-brief.md` | **empty template** | `## What it is` / `## Why it exists` / `## Who it is for` / `## Success looks like` — all four headings blank |
| `memory-bank/20-product.md` | **empty template** | `## Users` / `## Value` / `## In scope` / `## Out of scope` — all blank |
| `memory-bank/30-architecture.md` | **empty template** | `## System context` / `## Key components` / `## System patterns` / `## Tech context` — all blank |
| `memory-bank/40-contributing.md` | **empty template** | `## Getting set up` / `## Conventions` / `## Branch and review flow` / `## Definition of done` — all blank |
| `memory-bank/60-progress.md` | **empty template** | `## What works` / `## What's left` / `## Known issues` — all blank, despite being the designated running plan-of-record |
| `memory-bank/70-runbook.md` | **empty template** | `## Operate` / `## Deploy` / `## Roll back` / `## On-call and escalation` — all blank |
| `memory-bank/80-glossary.md` | **empty template** | bare `\| Term \| Meaning \|` header row, zero data rows |
| `memory-bank/50-decisions/ADR-0001-board-representation-0x88.md` | **REAL project content** | 3407 bytes, mtime `Jul 22 12:16`; the 0x88 board-representation decision, cited by name from `src/position.ts` line 7 and `src/moves.ts` line 14 |
| `memory-bank/50-decisions/ADR-template.md` | kit template (correctly so) | 713 bytes, the copy-me template |

**So: exactly one memory-bank file carries project content — `ADR-0001`.** Everything else in the
bank is unfilled.

By contrast, the *delivery* state files are fully populated and current: `plans/board.md`
(10078 B, updated 2026-07-24, EPIC-001 marked COMPLETE), `plans/traceability.md` (5187 B, eight
live ticket rows ABC-001..008 all `Done`, each with code and test links), `plans/nfr-catalog.md`
(4599 B), `plans/metrics.md`, six epic files, eight ticket files, and 39 context notes across ten
task folders. `AGENTS.md` (8501 B) is filled and current, with its command table verified during
ABC-008 and honest `UNKNOWN - verify` slots left in place.

**Not fixed. Not touched.** Recorded as a factual observation for the concurrent design-review
agent and the Orchestrator to dispose of.

## 10. Soft claims (explicitly NOT findings)

Each of these is a `claim`-grade judgment, stated with its own confidence, recorded inside this
`observation` note rather than as separate notes because none is gate-verified and none should be
mistaken for one.

- *Claim, confidence medium:* the memory-bank emptiness is a **documentation-substrate gap, not a
  code gap** — the same information exists and is current in `AGENTS.md`, `plans/*`, `ADR-0001`,
  and the 39 context notes, and the architecture rationale that would populate
  `30-architecture.md` currently lives in module header comments (`position.ts` 1–8,
  `moves.ts` 1–15, `apply.ts` 1–14, `legal.ts` 1–16, `zobrist.ts` 1–15, `perft.ts` 1–14). What is
  missing is the *one-read orientation surface* the working-memory contract in `00-index.md`
  promises, not the knowledge itself.
- *Claim, confidence medium:* the absent entry/barrel module is **not yet load-bearing** — with
  `main`/`exports`/`bin` all null, nothing is consumed externally today, and the first real
  consumer arrives with EPIC-002/003/006. Whether to add one is a design call for the concurrent
  agent, not a fact I can verify.
- *Claim, confidence low:* whether `position.ts`'s notation helpers or `moves.ts`'s
  `isSquareAttackedBy` should be separated is **not determinable from the map alone**. Both
  placements carry an in-source rationale, both are at 100% coverage, and neither creates a cycle
  or an upward edge. I record the multi-job fact; I do not rule on it.

## 11. What I did NOT do

No writes to `src/**`, `plans/**`, or `memory-bank/**`. No `memory-bank/brownfield-map.md` (this
is an audit, not a bootstrap — the Workflow 01 step-1 output was redirected here by the subtask
brief). No board move (the Brownfield Mapper causes no column transition by role definition). No
append to `plans/traceability.md` — the role's normal trace-update duty was suppressed by the
read-only audit scope, and I am naming the omission rather than silently skipping it. No commit,
no branch, no merge. `agent-factory/**` read only. `coverage/` deliberately not regenerated
because it is git-tracked.
