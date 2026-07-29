---
id: 20260729T145433Z-architect-design-observation-43d9a3cc
kind: observation
by: architect-design
at: 2026-07-29T14:54:33Z
verified_by: 
confidence: medium
refs:
  - ADR-0001
  - EPIC-001
  - EPIC-002
  - EPIC-003
  - EPIC-004
  - EPIC-005
  - EPIC-006
  - NFR-001
  - NFR-005
  - NFR-007
  - RISK-002
  - src/position.ts
  - src/apply.ts
  - src/legal.ts
  - src/moves.ts
  - src/zobrist.ts
  - src/gameend.ts
  - src/fen.ts
  - src/perft.ts
  - memory-bank/30-architecture.md
  - memory-bank/50-decisions/ADR-0001-board-representation-0x88.md
  - package.json
  - tsconfig.json
supersedes: 
---

Architecture audit of the merged EPIC-001 rules core, run in AUDIT MODE per Workflow 01 step 3
(subtask `arch-audit-structure` of task `architecture-audit-2026-07-29`). Read-only: no code, no
ADR file, no board move, no ticket, no commit.

## Provenance and admissibility (read this first)

**This repo has no `scripts/context-io.ts`.** The sanctioned writer named by
`agent-factory/contracts/context-note.md` is absent, so this note was **composed and written
directly against the schema by hand**. It was not validated by the validator, no admission check
ran, and `index.md` / `index.jsonl` were not regenerated. I claim no enforcement I do not have.

`verified_by:` is deliberately **empty** and `kind:` is `observation`. There is no live §14-gate
verdict for this audit run, so a `finding` would be inadmissible under SCTX-01; every judgment
below is recorded as a `claim` with an honest confidence, and the ADRs I would recommend appear as
**proposals inside this body — proposed, not accepted.** I did not write them. The human decides
what gets written.

Two other agents (a module/dependency mapper, a Security/NFR performance-envelope check) ran
concurrently and their output was not available to me. Nothing below restates or depends on theirs.

## Scope

Two readings of "audit current architecture", both in scope:
(A) conformance/drift of merged code against what was decided; (B) fitness of the current structure
for EPIC-002..006, which are all still undecomposed in Backlog.

Read: `AGENTS.md`, `.grugops/factory.config.json`, `plans/board.md`, `plans/nfr-catalog.md`,
`plans/traceability.md`, ADR-0001, `plans/epics/EPIC-001..006`, all of `src/*.ts`, `package.json`,
`tsconfig.json`, and the ABC-003 / ABC-007 / ABC-008 decision notes in the shared context.

## Headline

**The structure is good and most of it should be left alone.** ~1,000 lines of production code in
seven single-concern modules, a strictly layered acyclic dependency graph, no framework, no
speculative abstraction, 100% library coverage, and perft-proven at 32/32 exact deep counts. It is
boring in the way this role is supposed to want. The audit found **no drift in the decision that was
recorded**, **one false claim in that decision's Rollback prose**, **seven undocumented load-bearing
decisions**, and **two genuinely missing seams** — neither of which is a performance problem and
neither of which requires touching merged code today.

I also went looking for the obvious "you must optimize this before EPIC-004" story and **measured it
to be false**. That is recorded below as a corrected claim, because a plausible-sounding
recommendation that survives to the ADR stage is the expensive kind of wrong.

---

# (A) Conformance

## claim — ADR-0001 (0x88) is HONORED. No drift. (confidence: high)

Every clause of the Decision is implemented literally in `src/position.ts` and used consistently in
the hot paths:

- 128-entry `Uint8Array` (`emptyPosition`), `squareAt = rank * 16 + file`, a1=0 / h1=7 / a8=112 /
  h8=119 — as decided.
- Off-board detection is the single mask: `isOnBoard = (square & 0x88) === 0`. Every ray loop
  (`addRayMoves`, `raySliderAttacks`) and every leaper table (`KNIGHT_LEAPS`, `ALL_DIRECTIONS`)
  terminates on that mask alone. No file-wrap check exists anywhere, which is exactly the property
  the ADR bought.
- Piece encoding: type in the low 3 bits (`PAWN`=1..`KING`=6), `BLACK`=8 at bit 3, `EMPTY`=0 —
  as decided, and `pieceType`/`isBlack` are the only readers of the bit layout outside `fen.ts`.
- The specific failure the ADR warned about — a module hand-rolling `rank * 8 + file` — **does not
  occur**. Grepped `src/*.ts` for `* 8`, `<< 3`, `/ 8`, `% 8` in square arithmetic: zero hits.

Verdict: **CONFORMANT.** The implementation did not drift from the decision.

## claim — ADR-0001's *Rollback* section makes a containment claim that is factually false today. (confidence: high)

ADR-0001 Rollback states: *"The representation is confined behind `src/position.ts` and the helpers
it exports."* It is not. The 16-per-rank stride and literal 0x88 square indices are baked into four
other modules:

- `src/apply.ts:52-59` `CASTLE_LOSS` keyed on raw squares `4, 116, 0, 7, 112, 119`;
  `src/apply.ts:70-75` `CASTLE_ROOK_MOVE` keyed `6/2/118/114 → [7,5]/[0,3]/[119,117]/[112,115]`;
  `src/apply.ts:62` `DOUBLE_PUSH = 32`; `src/apply.ts:78` `move.to ± 16`.
- `src/moves.ts:58-62` all direction/leap tables (`±16, ±1, ±15, ±17, ±14, ±18, ±31, ±33`);
  `src/moves.ts:152` `forward = ±16`; `src/moves.ts:236` `pawnRank = square ± 16`;
  `src/moves.ts:279-292` `WHITE_CASTLES`/`BLACK_CASTLES` as raw square literals.
- `src/zobrist.ts:44-45` `piece << 7 | square` over a `15 * 128` table; `src/zobrist.ts:59` loop to 128.
- `src/gameend.ts:60` and `src/fen.ts:104` loop to 128.

This is **not a defect in the code** — a 0x88 move generator that routed its offset tables through
helper calls would be slower and less readable, and the constants carry explanatory comments
(`src/moves.ts:278` spells out the mapping). It is a defect in the **ADR's prose**: the stated
rollback cost ("rewrite `position.ts`, `fen.ts`, and move generation") understates the blast radius,
because `apply.ts`, `legal.ts`, `zobrist.ts`, and `gameend.ts` all encode the layout too. A future
maintainer reading Rollback would plan the wrong-sized change.

The mitigation the ADR relies on is nonetheless real and intact: the FEN round-trip suite and the
ABC-006 perft suite assert behavior, not layout, and would carry over unchanged. Rollback is still
*safe*; it is just wider than advertised.

Minor doc nit while here: ADR-0001's Context binds on `NFR-001`, but its Rollback trigger names
`NFR-005`. Both are defensible; they should agree or say why they differ.

**Recommended (not written): amend or supersede ADR-0001's Rollback paragraph only.** Text change,
zero code change.

## claim — Seven undocumented load-bearing decisions are live in the code with no ADR. (confidence: high)

`memory-bank/50-decisions/` contains exactly one ADR (plus the template). Each item below is
load-bearing (something downstream breaks if it changes), and none is recorded as an ADR. Several
*are* recorded in shared-context decision notes and file headers — I name where, because "written
down somewhere" and "written down where a future maintainer looks" are different things, and the
ADR set is what a maintainer reads.

1. **Make/unmake in place, never copy-on-move.** `makeMove` mutates the 128-byte board and returns a
   fixed four-field `UndoRecord`; nothing anywhere copies a `Position`. This is the single property
   the entire search rests on and is the second-most consequential structural choice in the repo
   after 0x88. Recorded in the ABC-003 decision note (`20260723T210512Z-software-engineer-decision-9dfc351d`,
   which states explicitly *"No new ADR"*) and in the `src/apply.ts` header. **Not an ADR.**

2. **`Position` is mutable, and `readonly board` guards only the reference — the contents are freely
   mutated.** `src/position.ts:32` reads `readonly board: Uint8Array`, which stops reassignment and
   stops nothing else; `apply.ts` and `fen.ts` write `board[i]` throughout. The consequence is a
   real trap for EPIC-002/003: **no consumer may hold a `Position` and expect a stable snapshot.**
   A renderer that caches "the position I drew last frame" caches a live, mutating object.
   **Written down nowhere.**

3. **Undo state is caller-owned; the rules core has no undo stack and no history.** `makeMove`
   hands the `UndoRecord` to the caller and forgets it. Correct and minimal for a search; it means
   "the game so far" has no owner (see the fitness section). **Written down nowhere as a decision.**

4. **Legality by make/test/unmake, not pin-aware generation.** `legalMoves` plays every pseudo-legal
   move, asks `isSquareAttackedBy` about the mover's king, and takes it back; the king square is
   found by a linear `position.board.indexOf(...)` scan (`src/legal.ts:28`) on every candidate move.
   Uniformly correct — absolute pins, check evasion, and the en-passant discovered-check case all
   fall out with no special case. Recorded in the `src/legal.ts` header and the ABC-005 note.
   **Not an ADR.**

5. **`Move` is an immutable heap object literal, and a fresh `Move[]` is allocated per generation.**
   `src/moves.ts:84,96,188,310`. This is the widest-reach type in the codebase — `moves.ts`,
   `apply.ts`, `legal.ts`, `perft.ts` consume it today, and EPIC-003 (SAN), EPIC-004 (move ordering,
   killers, hash move) and EPIC-005 (book) will all consume it next. It was never *decided*; it is
   emergent. **Written down nowhere.**

6. **Zobrist: `bigint` keys, fixed-seed splitmix64, recomputed from scratch on every call, never
   updated incrementally in `makeMove`.** Recorded in the ABC-007 note and the `src/zobrist.ts`
   header. **Not an ADR.** The load-bearing part is not the algorithm, it is that **`bigint` has
   already leaked into two public signatures** — `zobristKey(position): bigint` and
   `gameStatus(position, positionCounts?: ReadonlyMap<bigint, number>)` (`src/gameend.ts:89`). Every
   later consumer of "the position key" inherits that type.

7. **No public entry surface.** There is no `src/index.ts`; consumers import deep module paths with
   `.ts` extensions (`allowImportingTsExtensions: true` + `noEmit: true` in `tsconfig.json`);
   `package.json` is `private: true` with no `bin`, no `main`, no `exports`, no `files`, and `build`
   is honestly labelled as `tsc --noEmit`. Emergent, never decided.

## observation — `memory-bank/30-architecture.md` is still the shipped empty template. (confidence: high)

`_Updated: <date>_` and four empty headings, with EPIC-001 complete and merged. The module map has
nowhere to land. I did not fill it in (read-only run); a concurrent mapper agent is producing the
factual map this run, and that file is the natural destination for it.

---

# (B) Fitness for EPIC-002..006

## claim — CORRECTED: full-recompute Zobrist is NOT a bottleneck for EPIC-004's transposition table. My prior hypothesis was wrong and I measured it. (confidence: high, measured)

I expected to report "`zobristKey` rescans all 128 squares and allocates ~32 `bigint`s per call, so a
TT probe at every node will not carry EPIC-004 — make it incremental before you start." That is the
kind of recommendation that sounds right and would have cost a needless change to `Position`,
`UndoRecord`, and `makeMove`. So I measured it instead, in scratchpad, against the real merged code:

- `zobristKey(kiwipete)` = **306 ns/op**; `legalMoves(kiwipete)` (48 moves) = **5,298 ns/op**.
  One full key costs **~5.8%** of the generate-and-filter work a search node already does.
- Direct A/B on a real traversal: `perft(kiwipete, 4)` = 4,085,603 leaves in **0.688 s**; the
  identical traversal with **one `zobristKey` per interior node** (TT-probe-shaped, XORed into a
  sink so V8 cannot eliminate it) = **0.709 s**. **Overhead: 3.1%.**

Incremental Zobrist would therefore buy single-digit percent. Under AGENTS.md rules 5/7/10 that is
not a change to make. **Recommendation withdrawn.** The measurement scripts were scratchpad-only and
are not repo artifacts; the numbers are one machine, one position, and are a *claim*, not a
gate-verified finding.

The same measurement moots the adjacent worry about `bigint` key ergonomics: at 306 ns/key, a
`bigint → Number` conversion at each TT probe is noise. `bigint` is fine.

## claim — The `Position` / make-unmake model supports EPIC-004's search AS IS. Leave it alone. (confidence: high)

Make/unmake at depth is not merely supported, it is already **demonstrated and proven in-repo**:
`src/perft.ts:22-32` is a recursive make/unmake search over the real position with no copying, and
ABC-006's deep suite matches published perft counts 32/32 exactly at depth — which is a byte-exact
proof that `unmakeMove` restores every field, at every depth, across every special move. That is
precisely the property a search needs and it is already evidenced.

Nothing forces copying. `NFR-001` measured ~6.2M nps generation; `NFR-005`'s search-shaped proxy
measured 2.64M nps against a 500k target. The known constraint from ABC-008/RISK-002 —
**time-based iterative deepening, not fixed depth** — is a *search-design* constraint that the
rules core neither helps nor hinders. There is no structural change owed to EPIC-004 on this axis.

## claim — Two seams are genuinely missing. Neither is a performance problem. (confidence: medium-high)

### Seam 1 — nobody owns "the game": the move list, the undo stack, and the repetition counts.

The rules core owns *a position*. It does not own *a game*. Today:

- `makeMove` returns an `UndoRecord` to the caller and keeps no stack (`src/apply.ts:122`).
- `gameStatus` takes an **optional, caller-owned** `positionCounts?: ReadonlyMap<bigint, number>`
  and reports no repetition when it is omitted (`src/gameend.ts:87-90,106`).
- There is no move list anywhere.

Four separate epics need that same history, for four different reasons:

| Epic | Needs | Why it must agree with the others |
|------|-------|-----------------------------------|
| EPIC-002 | last move played, two-column SAN move history, material balance | status panel + history display |
| EPIC-004 | repetition detection *inside* the search tree | a search blind to repetition will happily "win" by repeating |
| EPIC-005 | the played line, to name the opening and probe the book | book exit must be seamless |
| EPIC-006 | `undo` = two plies back, **with the repetition counts rewound** | its own Risks section flags exactly this: *"a shallow undo that forgets repetition history would corrupt draw detection"* |

EPIC-002 is next in line (P0, undecomposed) and is the epic that will invent this first — inside its
game loop, ad hoc, because it only needs "last move" and "history to display". EPIC-004 will then
build a second, incompatible notion of the path for search repetition. EPIC-006 then has to
reconcile them, mid-flight, against a failure mode that is **silent** (a wrong draw verdict does not
throw; it just quietly ends or fails to end a game). That reconciliation is the expensive event.

The decision is cheap *now* and costs nothing in code today: name the owner, decide whether the
search's in-tree path shares that representation or explicitly does not, and record it before
EPIC-002 is decomposed.

This is not an unrequested abstraction (rule 5/6/7): four epics' written scope asks for it. It
currently has no assignee, which is the architect's gap to close, not the engineer's.

### Seam 2 — SAN has no home, and it is the one place the rules core would leak into rendering/input.

Standard Algebraic Notation is needed by **three** non-rules epics:

- EPIC-002 — "Move history display in two-column SAN".
- EPIC-003 — SAN parse *and* format, plus `moves` listing every legal move in SAN.
- EPIC-005 — naming the opening / reading book lines.
- EPIC-006 — the game-end screen shows the full move list.

And SAN *generation* is a rules-core-dependent operation: disambiguation (`Nbd2` vs `N1d2`) requires
the legal move list, and the `+` / `#` suffixes require `isInCheck` / `gameStatus`.

The gravitational pull is to put SAN inside EPIC-003 ("the parser epic owns notation"). If that
happens, **EPIC-002's renderer must import from the input module to draw its move history**, and so
must EPIC-005's book compiler. That is a rendering→input dependency with no reason to exist, and it
is the missing boundary the audit was asked to find.

The correct seam is a **notation module sitting directly on the rules core**, consumed by input,
rendering, and the book alike. Supporting evidence that this seam is already being improvised:
`src/perft.ts:47` contains a **private** `moveLabel()` producing long-algebraic coordinate notation
(`e2e4`, `e7e8q`) — the seed of that module already exists, in the perft harness, unexported.

Note the good news alongside it: EPIC-003's hardest acceptance criterion — *reject with a reason
that teaches* — **is already served by the existing exports**. `generateMoves` (pseudo-legal) and
`legalMoves` (legal) are both public, so "that piece cannot move there" versus "your own king would
be in check" is a diff of two lists the core already provides, plus `isInCheck`. No new core surface
is owed to EPIC-003. That boundary was drawn correctly at ABC-002/ABC-005 and should not be touched.

## claim — EPIC-006 packaging needs real work, but NOT a restructure. Do not preempt it. (confidence: medium-high)

The gap is real and entirely in the build/publish layer, not the module layer:

- `package.json` — `private: true`, no `bin`, no `main`/`exports`, no `files`. `npx <package>`
  (EPIC-006's first acceptance criterion) needs all of those.
- `build` is `tsc --noEmit` — honestly labelled in AGENTS.md as "a typecheck wearing the build
  slot's name". Nothing is emitted.
- Source imports use `./x.ts` specifiers under `allowImportingTsExtensions` + `noEmit`, which is a
  dev-ergonomics choice coupled to never emitting.
- `engines.node` is `>=22`, but Node runs `.ts` by default only from **23.6**; on 22.x it needs a
  flag. If the answer is "ship TypeScript and let Node strip types", that floor is wrong today.

**This does not require restructuring the modules.** The module boundaries are exactly what a
published package wants. And the `.ts`-specifier problem has a ready escape hatch **already present
in the pinned toolchain**: TypeScript is `^5.7.0`, and `rewriteRelativeImportExtensions` (added in
5.7) rewrites `./x.ts` → `./x.js` on emit. So the choice at EPIC-006 is a genuine two-option
decision — (a) emit JS with `rewriteRelativeImportExtensions`, or (b) ship sources and raise the
Node floor — and both are mechanical.

Ranked accordingly: **decide at EPIC-006, do not act now.** Acting now would be building for a
requirement that has not been decomposed yet.

## observation — smaller items, worth noting, act on none of them today.

- **King lookup is a linear scan.** `src/legal.ts:28` uses `board.indexOf(KING | colour)` on every
  candidate move. Perft-proven fast enough (~6.2M nps generation). A cached king square on
  `Position` is a cheap, local change *if* EPIC-004's own spike says so. Rule 10: don't refactor
  working code on a hunch.
- **`Move` allocation.** Fresh object literals, fresh array per node. Widest-blast-radius type in
  the repo, and the pull to pack it into an int will be strong during EPIC-004. **No measurement
  justifies it.** The useful action is to record the *trigger* (a measured search-throughput miss
  in EPIC-004's own spike), not to preempt the change.
- **Zobrist hashes the ep file whenever `epSquare` is set** (`src/zobrist.ts:71`), not only when an
  en-passant capture is actually available. Strict FIDE "same position" requires the ep possibility
  to be real, so threefold repetition will *under*-detect in the rare case. Known chess-engine
  subtlety, low severity, matches the convention published perft counts use. Flagging, not fixing.
- **Dependency graph is a clean layered DAG, no cycles:** `position` ← {`fen`, `moves`, `zobrist`};
  `moves` ← `apply`; {`apply`, `moves`} ← `legal`; {`legal`, `zobrist`} ← `gameend`;
  {`legal`, `apply`} ← `perft`; {`fen`, `perft`} ← `perft-bench`. This is healthy and is the thing
  that makes every "leave it alone" verdict above defensible.

---

# Ranking

## Must be decided before EPIC-004 is coded (and before EPIC-002 is decomposed, which is sooner)

1. **Who owns game history** — move list, undo stack, repetition counts; and whether the search's
   in-tree repetition path shares that representation. Decision only; zero code today.
2. **Where notation (SAN/coordinate) lives** — on the rules core, consumed by input + rendering +
   book; not inside the input epic. Decision only; zero code today.

## Worth noting; do not act now

3. Amend ADR-0001's Rollback prose (containment claim is false; blast radius understated).
4. Fill `memory-bank/30-architecture.md` — still the empty shipped template.
5. Write down the `Position` mutability contract (no consumer may hold a snapshot).
6. Record the *trigger* for revisiting the `Move` representation, rather than changing it.
7. EPIC-006 packaging decision (emit vs ship-sources; Node floor). Owned by EPIC-006.
8. King-square caching, ep-file hashing nuance. Note only.

## Withdrawn after measurement

- Incremental Zobrist / key-type change. Measured at 3.1% traversal overhead. Not justified.

## The single most expensive-to-reverse decision, if left unmade

**Ownership of game history (item 1).** Not because it is hard, but because of *when* and *how* it
fails. It is invented by accident in EPIC-002, duplicated in EPIC-004, and only *discovered* in
EPIC-006 — and its failure mode is a silent wrong draw verdict, not a crash. By the time it surfaces,
three epics sit on the improvised version and the fix touches the search, the session, and the book
at once. Every other item on this list is either a text change, a local change, or a change with a
loud failure mode. This one is none of those.

---

# Proposed ADRs (PROPOSED, NOT ACCEPTED — no ADR file was written)

These are decision-shaped proposals recorded inside an `observation` note, per this run's hard
limits. I did not author them into `memory-bank/50-decisions/`. Numbering below is indicative; the
human assigns real numbers.

## Proposal A — Game history has a single owner, shared by session and search

- **Context.** The rules core owns a position, not a game. `makeMove` returns an `UndoRecord` to a
  caller that keeps no stack; `gameStatus` takes an optional caller-owned repetition map. EPIC-002,
  004, 005 and 006 each need the same history for different reasons; EPIC-006's own Risks section
  already predicts the corruption.
- **Decision to make.** Name one owner of {position, move list, undo stack, repetition counts},
  decide whether it lives in the rules core or the session layer, and decide explicitly whether the
  search's in-tree repetition path is the same structure or a deliberately separate one.
- **Alternatives.** (i) Leave it caller-owned and let EPIC-002 improvise — the current default, and
  the one this note argues against. (ii) A `Game` type in the rules core wrapping position+history.
  (iii) Session owns history, search owns a separate path array, with the contract that undo rewinds
  both — written down.
- **Consequences.** Fixes the ownership before three epics depend on an accident. Costs one
  decision and zero lines today.
- **Rollback.** Cheap while EPIC-002 is undecomposed; dear once EPIC-004 is mid-flight.

## Proposal B — Notation is a module on the rules core, not part of the input epic

- **Context.** SAN generation needs the legal move list and check/mate state. Three epics outside
  EPIC-003 need SAN. `src/perft.ts:47` already carries a private coordinate-notation helper.
- **Decision to make.** Notation (SAN parse/format + coordinate) is its own module sitting directly
  on the rules core, consumed by input, rendering, and the book. Rendering must never import from
  input to draw its move history.
- **Alternatives.** SAN inside EPIC-003's parser (creates a rendering→input dependency); SAN
  duplicated per consumer (guarantees disambiguation bugs diverge).
- **Consequences.** Keeps EPIC-002 and EPIC-003 independent. EPIC-003's round-trip property test
  (`parse(toSAN(move)) === move`) becomes that module's own acceptance test.
- **Rollback.** Cheap now, dear once two epics import notation from each other.

## Proposal C — Amend ADR-0001's Rollback section

- Rollback claims the representation is *"confined behind `src/position.ts`"*. It is not: `apply.ts`,
  `moves.ts`, `zobrist.ts`, `gameend.ts` and `fen.ts` all encode the 16-stride / 128-length layout,
  with file/line evidence listed above. **Amend the prose only. The code is correct and must not be
  changed to satisfy the ADR.** Also reconcile the NFR-001 (Context) vs NFR-005 (Rollback) trigger.

## Proposal D — Record the `Position` mutability contract

- `readonly board` guards the reference, not the bytes. `makeMove` mutates in place. **No consumer
  may hold a `Position` expecting a stable snapshot** — directly relevant to EPIC-002's renderer.
  This can reasonably be folded into Proposal A rather than standing alone.

---

## Risks

- **The two measurements above are `claim`, not `finding`.** One machine (Apple silicon, Node
  v24.12.0), one position (kiwipete), scratchpad harness. They are strong enough to withdraw a
  recommendation and not strong enough to quote as the engine's performance. `UNKNOWN - verify` on
  any other hardware.
- **This note was hand-written against the schema** because `scripts/context-io.ts` does not exist
  in this repo. It passed no validator. Derived `index.md` / `index.jsonl` were not regenerated.
- **Concurrency.** A mapper and a Security/NFR agent ran at the same time with no data exchange.
  Where their notes contradict this one on a matter of fact, prefer theirs on the factual module map
  and the performance envelope respectively; this note is the judgment layer.
- **The largest risk in this audit is over-reach, not under-reach.** Most of what an architect could
  propose here — packed moves, incremental hashing, cached king squares, a barrel entry point, a
  session framework — is speculative against a 1,000-line core that is measurably fast and provably
  correct. Two seams are named; everything else is explicitly left alone.
