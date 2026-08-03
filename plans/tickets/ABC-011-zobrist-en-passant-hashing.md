---
id: ABC-011
title: Zobrist key hashes en passant when no capture is available
status: in-review
column: In Review
size: M
priority: P1
epic: EPIC-001
feature: —
---

# ABC-011 — Zobrist key hashes en passant when no capture is available

> **ESCALATED `P2` → `P1` and promoted `Backlog` → `Ready` on 2026-07-30 by BA/PM.**
> **The escalation trigger written into this ticket has fired — verbatim, not by interpretation.**
> The trigger reads: *"ABC-011 rises to `P1` the moment any consumer of the key list is planned or
> built — specifically when **(a)** the history module of `ADR-0002` clause 2 is decomposed or
> implemented under `EPIC-002`, or **(b)** a supplier is wired for `gameStatus`'s `positionCounts`."*
>
> `EPIC-002` was decomposed on 2026-07-30 (task `epic-to-tickets-EPIC-002`). **`ABC-012` is that
> history module**, it is **(a)** and **(b)** at once — it supplies `positionCounts` through
> `gameStatusOf` — and it has been promoted to `Ready` in the same step. The trigger's own
> instruction is that this ticket *"must be `Ready` **before** whichever of those lands first,
> otherwise that consumer's own tests are written against a key that under-detects and the defect
> stops being a bug and becomes an encoded assumption."* Both are now in `Ready` together, which
> satisfies that instruction and leaves the pull order to the Orchestrator.
>
> **Nothing else about this ticket changed.** Size stays `S`. The reproduction, the acceptance
> criteria, the open design question and the `NFR-005` bar are untouched. Severity and reachability
> did not move — the failure is still a missed draw and the error direction is still the safe one.
> What moved is **sequencing**, which is exactly what the trigger was written to encode.
>
> **Not raised to `P0`:** nothing in flight is broken and no user-facing consumer exists yet.

## Problem

*User*: every consumer of "the position key". `ADR-0002` was ratified on 2026-07-30 with clause 2
**accepted as proposed**, which makes a derived Zobrist key list the authoritative substrate for
**every repetition verdict in the product** — so `EPIC-002` (the game loop that holds the history),
`EPIC-004` (in-tree repetition and the transposition table), `EPIC-005` (book probes against the
same key list) and `EPIC-006` (undo, which rewinds that list) all inherit whatever the key gets
wrong.

*Pain*: `src/zobrist.ts:71` XORs the en-passant file whenever `epSquare` is set:

```ts
if (position.epSquare !== NO_SQUARE) key ^= EP_FILE[fileOf(position.epSquare)] as bigint;
```

FIDE's "same position" test requires the en-passant right to be **real** — a capture the side to
move can actually make. Two positions FIDE considers identical therefore hash differently whenever
the ep square is set but no ep capture exists, which is the common case after any double push.
**Threefold repetition under-detects.**

*Value*: the key is the *definition* of "same position" for this product. `gameStatus` reports
`threefold-repetition` off nothing but a count of these keys (`src/gameend.ts:106`). A key that
splits one FIDE position into two counts cannot reach three, so the draw is never offered. The
module's doc comment states the intent this defect violates, at `src/zobrist.ts:4-7`: *"Two
positions repeat (for the threefold rule) when they share piece placement, side to move, castling
rights, and en-passant availability"* — **availability**, not "an ep square is written down".

**The error direction is the safe one and that is why this is `P2`, not `P1`.** A legitimate draw
is missed; a false draw is never declared. Hashing en passant whenever it is set is also a common
engine convention, and it is the convention the published perft counts use — so this is a
correctness gap against FIDE, not a broken engine.

## Source

`memory-bank/50-decisions/ADR-0002-game-history-ownership.md`, section
`### Out of scope, and deliberately not absorbed: the en-passant hashing defect` — which reproduces
the defect, states its disposition, and **recommends this ticket without cutting it**
(*"I did not cut it; ticketing is BA/PM's"*).

Task `architecture-audit-2026-07-29`:

- `20260729T145433Z-architect-design-observation-43d9a3cc` — first flag, §"smaller items":
  *"Zobrist hashes the ep file whenever `epSquare` is set … threefold repetition will *under*-detect
  in the rare case. Flagging, not fixing."*
- `20260729T200039Z-architect-design-decision-bd553d62` — §"The ep-hashing nuance — flagged,
  reproduced, NOT absorbed": the reproduction below, and the recommendation (`EPIC-001`, `S`,
  priority no higher than `P2`).
- `20260730T120521Z-architect-design-decision-ef4765f8` and
  `20260730T121731Z-orchestrator-observation-6d1e04b7` — both record it as still un-ticketed after
  `ADR-0002` became `accepted`, and both name ratification as the one thing that changed its weight.

## Reproduction (re-run 2026-07-30 on this branch, not transcribed)

**I ran this myself** from the session scratchpad, read-only, importing merged `src/` by absolute
path; nothing in the repo was touched. The two FENs and the two keys are `ADR-0002`'s; both keys
reproduced byte-exact, and every FEN below round-trips byte-identically through `toFen`.

```
after 1.e4 — no black pawn on d4/f4, so no ep capture exists
  rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1  ->   4366836039462477420
  rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq -  0 1  ->  18311490354223382796
  legal ep captures available: 0   keys differ: YES   FIDE-identical: YES
```

Three facts this run adds, because they change what the fix has to satisfy:

1. **Pseudo-legal ep captures are also 0** in that position, not just legal ones — so the cheap
   board-only availability test and the strict legality test agree on this case. They do not always
   agree; see the open design question below.
2. **The control the ADR describes in prose, given here as an exact FEN** (mine, constructed and
   run this session — `ADR-0002` states the case but names no FEN). With a black pawn on d4 the
   capture is real, the two positions are genuinely different, and the keys **must** stay different:

   ```
   rnbqkbnr/ppp1pppp/8/8/3pP3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1  ->   8587513887981778220
   rnbqkbnr/ppp1pppp/8/8/3pP3/8/PPPP1PPP/RNBQKBNR b KQkq -  0 1  ->  13090168791698106956
   legal ep captures available: 1  (d4e3)   keys differ: YES — correct
   ```

3. **The existing repo test does not have to change.** `src/zobrist.test.ts:33-37`
   (*"depends on en-passant availability"*) uses `4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1` versus the same
   FEN with `-`, and that fixture has **1 legal ep capture (e5d6)** — it is the real-capture case,
   so it still asserts a true inequality after the fix (keys 14512009346798793826 vs
   14344393565561618306). A fix that forces `src/zobrist.test.ts` to be edited is the wrong fix.

## Scope

`zobristKey` gives two positions the same key exactly when FIDE calls them the same position:

- The en-passant component is included **only when an en-passant capture is actually available to
  the side to move**, and omitted otherwise.
- Placement, side to move and castling rights keep deciding equality exactly as they do today; the
  move counters stay excluded (`src/zobrist.ts:52-54`).
- Determinism is unchanged: fixed seed, same key for the same position within a run and across
  runs.
- `zobristKey`'s signature does not change, and no state is added to `Position` (`ADR-0002`
  clause 1: no new state on `Position`).

The mechanism is the engineer's call. The observable contract above is the requirement.

## Out of scope

- **Who owns the key list, the undo stack or the repetition counts** — decided by `ADR-0002`
  (ratified 2026-07-30, all four clauses). This ticket changes what a key *means*; it builds no
  history module and no supplier for `gameStatus`'s `positionCounts`.
- **Incremental / XOR-updated hashing in `makeMove`.** Measured and explicitly withdrawn by the
  audit at 3.1% of traversal cost. Do not smuggle it in with this fix.
- **`ABC-009`** (`legalMoves` mutating its argument) and **`ABC-010`** (FEN semantic validation) —
  different modules, different defects, independent (see Dependencies).
- Any change to `src/gameend.ts`, `src/legal.ts`, `src/moves.ts` or `src/apply.ts` — unless the
  design question below is answered in a way that requires one, in which case it is answered at the
  design hop and not in dev.
- Chess960 castling-rights notation and any variant rule — permanent non-goal (`EPIC-001`).

## Acceptance (Given/When/Then)

Each criterion is a currently-failing test that must go green, except where marked as a regression
guard. Every parenthetical is the measured behaviour on this branch today.

- **Given** `rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1` and the same FEN with the
  en-passant field `-`, **when** both are parsed and hashed, **then** the two keys are **equal**.
  *(Today: 4366836039462477420 and 18311490354223382796 — different.)*
- **Given** `rnbqkbnr/ppp1pppp/8/8/3pP3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1` (black pawn on d4, so
  `d4e3` is a real ep capture) and the same FEN with `-`, **when** both are hashed, **then** the two
  keys are **different**. *(Today: 8587513887981778220 and 13090168791698106956 — different. This is
  the regression guard: the fix must not collapse positions that genuinely differ.)*
- **Given** `4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1` and the same FEN with `-` — the fixture the existing
  test at `src/zobrist.test.ts:33-37` already uses — **when** both are hashed, **then** the keys stay
  different **and that existing test is not modified.** *(Today: passes.)*
- **Given** every position in the perft suite table (`src/perft.test.ts`), **when** each legal double
  push is made and the resulting position is hashed both with its `epSquare` and with `epSquare`
  cleared, **then** the two keys are equal exactly when no en-passant capture is available in that
  position, and different when one is. *(Today: they are always different. This is the property test
  that would have caught the defect.)*
- **Given** the same position hashed twice, and a position hashed before a move and after
  make-then-unmake, **when** compared, **then** the keys are identical — determinism and the
  make/unmake round trip are unchanged. *(Today: passes; `src/zobrist.test.ts:11-13,39-52`.)*
- **Given** the full test suite, **when** it runs after the fix, **then** it is green with a skip
  count of **0** and **no existing test is modified** to accommodate the change. *(Today: 143/143
  green, skip count 0.)*
- **Given** the `zobristKey` cost bar in *Security / NFR triggers* below, **when** it is measured on
  the machine class the baseline was taken on, **then** it holds.

## Dependencies

- No blocking dependency. `src/zobrist.ts` is merged on `main` (`ABC-007`), and `ADR-0002` — the
  decision that makes the key load-bearing — is `accepted`.
- **Independent of `ABC-009` and `ABC-010`.** Different module, different failure, and any of the
  three may ship first. One asymmetry is worth stating because it is the opposite of theirs:
  `ABC-009` and `ABC-010` both need a semantically invalid FEN to fire, and `ABC-010` removes
  `ABC-009`'s only reachable trigger. **Nothing removes this one.** It fires on a perfectly legal
  position one ply out of the start position, so no other ticket makes it unreachable — which is
  also why its escalation trigger below is about consumers appearing, not about another ticket
  slipping.

### Open design question — hand to Architect/Design at the design hop, do not decide in dev

"An en-passant capture is available" has two defensible readings, and they disagree on real
positions:

- **Board-only (pseudo-legal):** is there a pawn of the side to move on a square from which the ep
  capture could be played? Cheap, local to `src/zobrist.ts`, no new dependency edge.
- **Strict FIDE (legal):** is that capture *playable* — i.e. not illegal by discovered check?

They diverge. Verified this session: `7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1` has **1 pseudo-legal ep
capture (c5d6) and 0 legal ones** — `cxd6` clears both c5 and d5 and exposes the a5 king to the h5
rook along rank 5. Keys today: 973849139394194878 with the ep square, 285777158189409886 without.

Why this is a design call and not an implementation detail: the strict reading needs attack
detection or the legality filter, so `src/zobrist.ts` — today a level-1 leaf importing only
`src/position.ts` — gains an edge to `src/moves.ts` or `src/legal.ts` and moves down a layering the
audit recorded as a clean acyclic DAG. It also puts that work inside a function `EPIC-004`'s
transposition table calls **per node** (`ADR-0002` clause 3), where `legalMoves` costs ~5,300 ns
against `zobristKey`'s ~300 ns (audit figures, M3). The board-only reading resolves the
reproduction above identically, so **this question does not block the headline acceptance
criterion** — it decides one rare extra case and the ticket's dependency shape. Flagged here, not
answered here; if the strict reading is chosen, re-size at the design hop (see *Size and priority
rationale*).

### ANSWERED 2026-08-02 at the design hop by Architect/Design — build exactly this

Task `ticket-to-pr-ABC-011`; the reasoning, the rejected options, every measurement and the
constraint check are in
`.grugops/context/ticket-to-pr-ABC-011/notes/20260802T214500Z-architect-design-decision-501d774b.md`
and `…-observation-5f316a31.md`, and the layering ruling is recorded in
`memory-bank/50-decisions/ADR-0005-en-passant-availability-and-the-hash-layer.md` (**`proposed`** —
see below; it does **not** block this ticket). **The reading is no longer the engineer's call. TDD
and the implementation still are.** Every acceptance criterion, both reproduction FENs, the `NFR-005`
bar and `## Out of scope` are unchanged.

**"An en-passant capture is available to the side to move" means a LEGAL one exists — the
strict-FIDE reading.**

The Laws, quoted from the text BA/PM retrieved and retained in this repo's shared context during task
`refinement-fide-9-6-1`:

> **9.2.3** Positions are considered the same if and only if the same player has the move, pieces of
> the same kind and colour occupy the same squares and **the possible moves of all the pieces of both
> players are the same**. Thus positions are not the same if: **9.2.3.1** at the start of the sequence
> a pawn **could have been captured** en passant.

A capture that leaves your own king in check is not a *possible move*, so a pawn takeable only that
way **could not have been captured**. The board-only reading answers a question the Laws do not ask.

**Where the predicate lives, and it is not optional:**

```ts
// src/legal.ts — NEW export. This module already owns "is this legal"; the hash module asks it.
/**
 * Is an en-passant capture LEGAL for the side to move? True exactly when
 * `legalMoves(position).some(m => m.flags === FLAG_EN_PASSANT)` is true — that expression is the
 * DEFINITION and the test oracle, and it is deliberately NOT the implementation (see below).
 * Leaves the position exactly as it found it.
 */
export function hasLegalEnPassant(position: Position): boolean;
```

```ts
// src/zobrist.ts — the single changed condition. Line 71 becomes:
if (position.epSquare !== NO_SQUARE && hasLegalEnPassant(position)) {
  key ^= EP_FILE[fileOf(position.epSquare)] as bigint;
}
```

Six rules that go with it, each of which a test or a measurement can fail:

1. **The `epSquare !== NO_SQUARE` guard comes FIRST and short-circuits.** The no-ep path is the
   overwhelming majority of nodes and must execute exactly what it executes today — that is this
   ticket's own `NFR-005` sub-bar ("not made slower at all"), and it holds by construction rather
   than by luck.
2. **Do NOT implement it as `legalMoves(position).some(...)`.** Measured: **1.979x per node
   amortized** (against a 1.5x bar) and it **inherits `ABC-009`** — on
   `4k3/8/8/3pP3/8/8/8/K7 w KQ d6 0 1` hashing then corrupts the position it is hashing, leaving a
   phantom white king on e1. A hash that alters what it hashes is not a hash. Use the two candidate
   from-squares only.
3. **Do NOT home it in `src/moves.ts`.** `isSquareAttackedBy` lives there and looks like the natural
   home, but the predicate needs `makeMove`/`unmakeMove` and `src/apply.ts` already imports
   `src/moves.ts` — that home creates **this project's first dependency cycle**
   (`apply -> moves -> apply`), verified by rebuilding the graph.
4. **Do NOT re-implement legality inside `src/zobrist.ts`.** It is one layer shallower and it is the
   same mistake this ticket exists to fix: the hashing module holding its own private notion of a
   rules concept. One home for "legal"; the hash asks it.
5. **The predicate must leave the position byte-identical on return** — assert it with a `toFen`
   comparison across the call, not by inspection.
6. **`zobristKey`'s signature does not change, no state is added to `Position`, and
   `src/gameend.ts` / `src/apply.ts` are not touched.** The only files that change are
   `src/zobrist.ts`, `src/legal.ts` and their tests, plus the two doc updates named below. The
   `## Out of scope` line that permits a `src/legal.ts` change "if the design question is answered in
   a way that requires one, in which case it is answered at the design hop" is **exercised here, and
   only for `src/legal.ts`.**

**Measured, so nobody has to re-derive it** (Apple M3 / Node v24.12.0 / darwin-arm64,
`UNKNOWN - verify` on other hardware; driven read-only against merged `src/` from a scratchpad outside
the repo, interleaved forward and backward):

| | merged | board-only (rejected) | **ruled: strict** | strict via `legalMoves` (rejected) |
|---|---|---|---|---|
| **amortized per node**, 120,000-node pool at natural ep frequency | 317.2–317.3 ns | 0.996–1.004x | **1.014–1.022x** | 1.979x |
| `kiwipete` / startpos — **the `NFR-005` bar's own positions**, no ep square | 302–317 ns | 1.00–1.03x | **1.00–1.07x** | 1.00–1.01x |
| ep square set, no capture at all | 319.8–325.7 ns | 1.02–1.08x | **1.04–1.10x** | 9.34x |
| ep square set, capture available (1.87% of pooled nodes) | 315.3–317.2 ns | 1.02x | **1.45–1.48x** | 13.9x |
| allocation, ep-capture-available nodes only | 0.4 B/call | 0.4 | **2.7 (+2.3)** | — |

`ADR-0002` clause 3 has `EPIC-004`'s transposition table computing a key **per node**, so the
amortized row is the one that binds: **the ruling costs 1.4–2.2% per node.** The `NFR-005` bar in
`## Security / NFR triggers` below is anchored at `kiwipete` / startpos, **both of which carry no ep
square**, and it is met at 1.00–1.07x. The **1.45–1.48x** worst-case shape is recorded here in advance
so the Security/NFR gate does not have to discover it.

**The case this ruling decides — the one the board-only reading would have left wrong.** This is the
consequence of the reading, not a new acceptance criterion; whether it becomes a numbered criterion is
BA/PM's:

```
7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1   ->  973849139394194878   (1 pseudo-legal ep capture, 0 legal)
7k/8/8/K1Pp3r/8/8/8/8 w - -  0 1   ->  285777158189409886
after the fix these two keys must be EQUAL.  Today they differ.
```

**The fourth acceptance criterion's oracle is now fixed, and this is the guard that matters.** That
criterion's phrase "no en-passant capture is available" resolves to the strict reading, and the
property test over `src/perft.test.ts`'s table must take its ground truth from
`legalMoves(position).some(m => m.flags === FLAG_EN_PASSANT)` rather than from a hand-written
expectation. Reason: the predicate re-derives pawn geometry that `src/moves.ts` also owns, and that
duplication is unguarded without this oracle. Measured at this hop over the whole table — **19,667
ep-setting moves, 81,397 ep-set nodes** — the ruled predicate disagreed with `legalMoves` **0 times**
and the board-only predicate missed the FIDE ground truth **862 times**.

**The three existing assertions are safe and none needs editing.** Re-run at this hop: the repro pair
becomes EQUAL, the real-capture control stays different, and `src/zobrist.test.ts:33-37` stays
different (its fixture has a genuinely *legal* ep capture). Determinism and the make/unmake round trip
are unaffected — the key is still a pure function of the position.

**Two documentation edits are owed when this lands, and they are part of the ticket:**

- `memory-bank/30-architecture.md` — the line
  `position ← {fen, moves, zobrist} ← apply ← legal ← {gameend, perft} ← perft-bench` becomes
  **false**. Verified by rebuilding the graph: it stays **acyclic** and stays **exactly as deep**
  (max depth 6), but `zobrist` moves from level 2 to level 5 and `gameend` from 5 to 6. The
  "transient mutation behind pure-looking queries" bullet must also gain `zobristKey`, which now
  plays a move and takes it back on ~2% of nodes.
- `src/zobrist.ts:4-7` — the header already says *availability*, which becomes true for the first
  time. It should now also say that availability is decided by `src/legal.ts` and that the function
  transiently mutates.

**`ADR-0002` is EXTENDED AROUND, not amended — no human ruling is owed and none was taken.** Checked
clause by clause against the ratified text: clause 1 (no new state on `Position`, make/unmake
history-free, `UndoRecord` caller-owned), clause 2 (the move list is the authority, everything derived
by replay), clause 3 (the search keeps its own per-ply key array, seeded once per search — its
`9–23 ns/node` is the repetition scan *on top of* the key and does not move) and clause 4
(`positionCounts` has exactly one supplier, signature unchanged) are all untouched. The ~300 ns key
cost is a **Context-table figure**, not a clause proposition. The falsifier, so a later reader can
check rather than trust: if clause 3's "Zero allocation per node" bound `zobristKey` rather than the
per-ply array, the +2.3 B/call would brush it — but the clause's subject is the array, and merged
`zobristKey` already allocates ~5 B/call in `bigint` intermediates, so no such reading was ever true.

**`ADR-0005` was written anyway, and it is `proposed`.** Not on the amendment ground — on the ground
that a recorded module-graph invariant becomes false and a ticket is not where a maintainer looks for
the module graph. **No agent may mark it `accepted`, and none did**; `ADR-0004`'s delegated
ratification is explicitly not precedent and was not leaned on. **This ticket is NOT blocked on it:**
the authority for the ruling is this ticket's own delegation of the question to Architect/Design by
name. If a human rejects the ADR, the reversal is one condition, one import and one predicate.

### ANSWERED 2026-08-03 at the SECOND design hop by Architect/Design — the MEDIUM defect's definition question, ruled

The first `### ANSWERED` block above stands **unamended and unrevoked**; this one is additional and
narrower. Task `ticket-to-pr-ABC-011`, subtask `architect-abc011-defect-definition-and-ratify`. The
reasoning, every re-derivation and the five things this hop could not settle are in
`.grugops/context/ticket-to-pr-ABC-011/notes/` — the `architect-design` notes of **2026-08-03**.
The ticket entered `In Design` a second time on the project owner's instruction to fix the MEDIUM
defect before merge. **No acceptance criterion, no reproduction FEN, no `NFR-005` bar and no line of
`## Out of scope` is re-opened or edited here.**

**The question, exactly as QE left it.** QE reproduced the shipped `hasLegalEnPassant` and its own
ruled oracle disagreeing on `4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1` and declined to call it — *"needs
an Architect ruling not a dev fix"*. Security/NFR sized the defect **MEDIUM**, non-blocking, and
routed the same question here. Both were right to refuse it: guarding the predicate makes it answer
`false` where the ruled oracle answers `true`, which changes a definition rather than an
implementation.

#### THE RULING — purity is unconditional; the answer is domain-restricted

**1. `hasLegalEnPassant` must establish its probe move's precondition before playing it.** The
predicate synthesises a `Move` and hands it to `makeMove`. `unmakeMove` is an exact inverse only for
a move that is well-formed **for this board**, and `undoSpecial` (`src/apply.ts:108-110`) writes
`move.captured` back onto the capture square unconditionally — so when the board never held that
piece, the write is a *creation*, not a restore, and it is permanent. Two conditions make the probe
well-formed, and both must be checked **before** `makeMove` is called:

```ts
// src/legal.ts, inside hasLegalEnPassant, after the NO_SQUARE early return:
if (position.board[target] !== EMPTY) return false;               // (a) the ep target is empty
...
const captured = PAWN | (black ? 0 : BLACK);
const rank = black ? target + 16 : target - 16;                   // already computed today
if (position.board[rank] !== captured) return false;              // (b) the pawn to take is there
```

`rank` is already the capture square — `enPassantCaptureSquare` in `src/apply.ts:78` computes
`to ± 16`, the same value — so (b) costs one read of a square the function already addresses. Both
conditions are loop-invariant and both belong **above** the `EP_CAPTURE_SIDES` loop, not inside it.

**2. The two guards are NOT the same guard, and each is load-bearing for a different property.**
This is the part that could not be delegated, and it is why Security/NFR's one-line sketch
("guarding on `board[target] === EMPTY`") is not sufficient:

- **(b), the captured-pawn guard, is the PURITY guard.** It is the one that stops `undoSpecial`
  writing a pawn onto a square that never held one. It closes all three of QE's reproductions and a
  fourth, `4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1` (an ep square on the wrong rank for the side to move,
  which drops a phantom **black** pawn on a2) that no prior role named and that **(a) alone does not
  catch** — a3 is empty, so (a) passes.
- **(a), the empty-target guard, is the ANSWER guard, and purity does not need it.** On
  `4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1` and its mirror `4k3/8/3n4/3pP3/8/8/8/4K3 w - d6 0 1` the
  captured pawn *is* correctly present, so make/unmake round-trips **byte-exactly** — and the shipped
  predicate still answers `true` where the ruled oracle answers `false`, because `generateMoves`
  handles an occupied ep target as an ordinary capture and never offers the ep move. Constructed and
  run at this hop; **a pure divergence, which no prior hop had.**

**3. `legalMoves(position).some(m => m.flags === FLAG_EN_PASSANT)` remains the DEFINITION and the
test oracle — on positions whose en-passant square the board does not contradict.** That domain is
stated once and is not a dodge: it contains every position `makeMove` can produce, therefore every
position reachable by play, therefore the whole population `## Scope`'s *"exactly when FIDE calls
them the same position"* is a meaningful claim about. **The oracle is not the authority outside it,
because the generator is itself unsound there** — measured at this hop, not asserted: on
`4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1` and `4k3/8/8/3PP3/8/8/8/4K3 w - d6 0 1` the oracle **corrupts
identically** to the shipped predicate (QE established this; re-derived here), and on
`4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` `generateMoves` offers a pawn **capturing onto a square
occupied by the mover's own knight**. Tracking the oracle on that class would mean importing a
generator defect into the hash. **So the predicate is SPECIFIED there rather than derived: it
returns `false` and touches nothing.**

**4. `false` is the right answer off-domain, and it is not arbitrary.** When the board contradicts
the FEN's ep square there is no en-passant capture available *on that board* — the pawn to take is
absent, or the destination is occupied. `false` says exactly that. The consequence for `zobristKey`
is that the ep component is omitted, so such a position hashes equal to itself with `-`; that class
has no FIDE meaning and no reachable trigger, and `ABC-010` remains the owner of whether it should
be rejected at `parseFen` at all.

**5. Rule 5 of the first `### ANSWERED` block is now UNCONDITIONAL and is this fix's whole contract.**
It reads *"the predicate must leave the position byte-identical on return"*. It carries no domain
qualifier and it must not gain one: a query that damages its argument is broken whatever the
argument means. `## Out of scope`'s invalid-FEN line governs what the predicate must **answer**, not
whether it may corrupt what it was handed. After this fix the property holds **by construction** — a
precondition check — rather than by luck of the input distribution.

**6. What does NOT change, checked rather than assumed.** `zobristKey`'s signature; the strict-FIDE
reading; the predicate's home in `src/legal.ts`; the `epSquare !== NO_SQUARE` short-circuit and its
ordering; `src/moves.ts`, `src/apply.ts`, `src/gameend.ts`, `src/position.ts`, `src/fen.ts`. **The
only production file this fix touches is `src/legal.ts`**, plus the two doc corrections in item 9.
`ABC-009` and `ABC-010` stay carried and are not fixed here.

#### Re-derived at this hop, so the contract rests on measurement rather than on the notes above

Apple M3 / Node v24.12.0 / darwin-arm64 — `UNKNOWN - verify` on other hardware. Driven read-only
against copies of the shipped tree from a scratchpad outside the repository; **no file under `src/`
was changed by this hop.**

- **All three QE reproductions reproduce exactly**, plus the fourth above and the two pure-divergence
  FENs. The shipped `zobristKey` is impure on four of them; the guarded shape is pure on all six and
  every FEN round-trips byte-identically through `toFen`.
- **The guards change NOTHING on the reachable population.** Exhaustive walk of the
  `src/perft.test.ts` table at its own `fast` depths, on a fourth independently written script:
  **518,474 nodes / 81,397 with an ep square** — reproducing the design, dev and QE hops' figures to
  the number. Guard (a) would fire on **0** of them, guard (b) on **0**, the predicate's answer
  changes on **0**, `zobristKey`'s key changes on **0**, and both the shipped and the guarded
  predicate disagree with the ruled oracle **0** times.
- **The suite is unaffected.** The guarded shape run against the repository's own tests in a
  sandbox: **193/193 pass, 0 skipped**, `tsc --noEmit` exit 0. **No existing test needs editing** —
  the ticket's standing constraint holds through this fix too, including
  `src/zobrist.nfr.test.ts`'s call-count and byte-identity assertions and QE's `L8` edge probes.

#### Cost — asked because this sits in a function `EPIC-004` calls per node

| where | effect of the two guards |
|---|---|
| the no-ep path (`NFR-005`'s sub-bar, 84.3% of nodes) | **zero** — the caller's `epSquare !== NO_SQUARE` short-circuit never enters the callee |
| startpos / kiwipete (the `NFR-005` bar's own anchors, both no-ep) | **zero**, structurally, for the same reason |
| ep-set nodes doing real work (15.70%) | **+0.9 to +3.0 ns per call**, measured on the predicate in isolation at 2,000,000 iterations/cell |
| the same, amortized per node | **≤ +0.5 ns**, under **0.15%** of a ~317 ns key — below the resolution of a whole-key benchmark |
| whole-key ratio, guarded ÷ shipped, two runs | **0.98–1.05** — the guard is inside my measurement noise and the runs bracket 1.0 from both sides; reported as measured, not smoothed |
| the invalid class this fixes | **20–27x cheaper** (5 ns vs 111–134 ns) — the guard returns before the make/unmake |

**No `NFR-005` bar moves and no catalog target moves.** Security/NFR re-gates after the fix and owns
the verdict; these figures exist so that column starts ahead rather than discovers them.

#### The tests this fix owes, each PROVEN to fail rather than assumed to

Written in a sandbox at this hop and run against the shipped tree and against each single-guard
mutant, so the engineer inherits assertions that are known to bite. **They are not committed by this
hop — writing them is the engineer's, under TDD.**

| probe FEN | asserts | kills |
|---|---|---|
| `4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1` | `false` + every board byte and scalar unchanged | guard (b) removed |
| `4k3/8/8/3PP3/8/8/8/4K3 w - d6 0 1` | same | guard (b) removed |
| `4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1` | same | guard (b) removed |
| `4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1` | same | guard (b) removed |
| `4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1` | `false` (purity already holds) | **guard (a) removed — and only these two do** |
| `4k3/8/3n4/3pP3/8/8/8/4K3 w - d6 0 1` | same | **guard (a) removed** |

Measured: against the shipped code **10 of 14** assertions fail; against guard-(a)-removed exactly
**2** fail; against guard-(b)-removed exactly **6** fail. Each assertion is paired at the
`zobristKey` level as well as at the predicate level, on the `src/zobrist.nfr.test.ts` precedent
that a promise in a doc comment is worth an assertion. **One boundary probe kills nothing and is
named so rather than shipped as a guard:** `4k3/8/8/8/8/8/1P6/4K3 w - a1 0 1` (an ep square on no ep
rank) is already answered `false` and pure by the shipped code; keep it as documentation of the
boundary or drop it, but do not count it as coverage.

#### Two documentation corrections are part of this fix

- `src/legal.ts` — `hasLegalEnPassant`'s doc comment says the oracle expression *"is the DEFINITION
  and the test oracle"* and that the predicate *"leaves the position exactly as it found it"*. The
  first sentence must gain the domain from item 3; the second is a promise the code must now keep
  unconditionally, and the comment should say **why** it keeps it (the precondition), not merely that
  it does.
- `src/zobrist.ts:9-14` — the header says `zobristKey` *"transiently mutates the position it is
  given"*. True on the reachable class and, before this fix, false off it. It should state that the
  mutation is bounded by the predicate's precondition.

#### Size, scope and routing — stated rather than absorbed quietly

**Size stays `M`. This ruling does NOT grow the ticket** and no re-size is owed: two conditions in
the one function `ABC-011` already changed, plus six test cases and two doc-comment corrections, is
smaller than the delta that took this ticket `S` → `M` in the first place. Nothing here is a split
candidate.

**No new ticket is cut by this role, and one item is ROUTED TO BA/PM rather than absorbed:**
`generateMoves` offers an en-passant capture onto a square occupied by the **mover's own** piece —
`4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` and `4k3/8/3N4/3pP3/8/8/8/4K3 w - d6 0 1`, both verified at
this hop. That is a generator defect on the invalid-FEN class, a sibling of `ABC-009`, and it is
**not** `ABC-011`'s to fix: this fix makes the *hash* immune to it, it does not clean the generator.
Owner: **BA/PM**, to cut it or fold it into `ABC-010`.

#### `ADR-0005` is ratified at this hop, and `ADR-0006` is written

Under the owner's standing directive of 2026-08-03 (`memory-bank/60-progress.md`, *"Standing
directive — who decides"*), which retired *"no agent may mark an ADR `accepted`"*.

- **`ADR-0005` → `accepted`, WITH an amendment, not as a rubber stamp.** One of its statements was
  false as written — its Consequences describe a predicate that "plays a move and takes it back",
  which the shipped code does not do on the class above. It gains **Decision clause 6** (the
  precondition), a corrected Consequences paragraph, an explicit scope bound to en passant, and a
  per-clause falsifier list. Clauses 1–5 are accepted on the evidence three gates already
  established and this hop re-derived.
- **`ADR-0006` — castling rights stay rights — is NEW and `accepted`.** It answers the owner's
  follow-on. It is a *separate* ADR rather than a sixth clause of `ADR-0005`, and the reasoning for
  splitting is in its own Status section.

## Security / NFR triggers

- `NFR-005` — **search depth in budget** (ratified 2026-07-30: depth-in-budget on `kiwipete` and
  `position-6`, node rate demoted to a diagnostic). This is the trigger that matters, because
  `ADR-0002` clause 3 has `EPIC-004` computing a Zobrist key per node for the transposition table,
  and a cheaper node buys depth. Measurable bar: `zobristKey` stays within **1.5x** of the audit's
  measured **288–306 ns** per call at `kiwipete` / **~300 ns** at startpos, on the same machine
  class the baseline was taken on (Apple M3, Node v24.12.0, darwin/arm64 — `UNKNOWN - verify` on
  other hardware), and the **no-ep-square path**, which is the overwhelming majority of nodes, is
  not made slower at all.
- `NFR-001` — move generation throughput is **not** at risk and `npm run perft` is **not** the
  oracle for this change: `src/perft.ts` imports `apply`, `legal`, `moves` and `position` and never
  calls `zobristKey`; the hashing module's only production consumer is `src/gameend.ts`. Stated
  rather than assumed, so nobody spends 38 s on the deep lane believing it proves something here.
- **No security trigger.** No injection sink, no trust boundary, no privilege, no data exposure.
  The consequence is a missed draw. Do not inflate it.

## Test notes

The reproduction above is the test. Two shapes are needed and they are not interchangeable:

1. **The exact repro pair plus both controls** — the defect pair asserted **equal**, and the
   real-capture control pair plus the existing `src/zobrist.test.ts:33-37` fixture asserted
   **different**. The equality assertion fails today; the two inequality assertions pass today and
   are what stops the fix from over-collapsing. All three go in `src/zobrist.test.ts` beside the
   existing cases, in the same `describe("zobristKey")` block.
2. **The double-push property test over the existing perft position table** — for every legal double
   push from every position in that table, the key with `epSquare` set equals the key with it cleared
   exactly when no ep capture is available. The table already exists in `src/perft.test.ts`, so this
   is cheap, and it is the guard that generalizes past the two hand-picked FENs.

Three things a naive pass would miss:

- **`src/gameend.test.ts:27-58`, the existing threefold-repetition test, cannot catch this and must
  not be treated as though it does.** It repeats the start position with a knight cycle
  (`g1f3 g8f6 f3g1 f6g8`, twice), so `epSquare` is never set on any position it hashes. The defect
  is invisible to it, which is exactly how it shipped under 100% coverage. If a `gameStatus`-level
  test is added, it must include a double push in the repeated line.
- **Assert key *equality*, not just "the keys changed".** The defect is a spurious difference; a test
  that only checks that some component affects the key will keep passing.
- **`zobristKey` returns `bigint`.** Compare with `toBe` on `bigint` values, and note the keys quoted
  in this ticket are decimal `bigint` values, not numbers.

## Size and priority rationale

> **RE-SIZED `S` → `M` on 2026-08-02 at the design hop by Architect/Design. The condition named at
> the foot of this section FIRED, verbatim and not by interpretation:** the strict-FIDE reading of
> "available" was chosen, so this ticket gains a dependency edge (`src/zobrist.ts` → `src/legal.ts`)
> and a new exported predicate in a second module. Taken exactly as instructed — **`M`, and NOT
> split**, because it is still one condition in one function. What pushes it past `S`: the new
> predicate and its own tests, the new edge, doc-comment corrections in two files, an edit to
> `memory-bank/30-architecture.md`'s layering line, and one more test shape than the two named in
> `## Test notes`. Calibrated **below `ABC-005`** (legality filtering, `M`) and **above `ABC-009`**
> (one guarded condition plus two test shapes, `S`).
>
> **Priority `P1` is unchanged, the acceptance criteria are unchanged, and no promise moved.** The
> per-call cost question this section anticipated was measured rather than argued: 1.014–1.022x per
> node amortized, and 1.00–1.07x at the two positions the `NFR-005` bar is anchored on. See the
> `### ANSWERED` block above.

**Size `S` (2)** — I agree with `ADR-0002`'s recommendation and reached it independently. One
guarded condition in a 74-line module with a single production consumer, plus the two test shapes
above, against an exact reproduction. No new module, no new dependency edge under the board-only
reading, and the module is already at 100% coverage so the oracle exists. Calibrated against
`ABC-009` (one guarded condition plus two test shapes, `S`) and `ABC-006` (perft harness, `S`), and
below `ABC-005` (legality filtering, `M`) and `ABC-007` (five terminal conditions plus a new
module, `M`).

Not `XL`, so no split. **One re-sizing condition, named now rather than improvised later:** if the
design hop takes the strict-FIDE reading of "available", this ticket gains a dependency edge and a
per-call cost question on a function the search calls per node, and it should be re-sized at that
hop — at most `M`, and never split, because it is still one condition in one function.

**Priority `P2`, not defaulted, and deliberately not higher.** `ADR-0002` recommends *"no higher
than `P2`"* on two grounds. I checked both and they hold:

- **Latent, and further from live than either ticket already in Backlog.** Nothing in the product
  computes a repetition verdict today: `gameStatus`'s `positionCounts` is optional and has **no
  supplier anywhere in `src/`** (`src/gameend.ts:87-90`), and `ADR-0002` clause 4 assigns that
  supplier to a history module that does not exist. Being observable needs `EPIC-002` (the loop that
  holds a history) **and** `EPIC-006` (undo/session) — two unbuilt epics, versus the one unbuilt
  epic `ABC-010` waits on. The suite is 143/143 green.
- **The error direction is the safe one.** A legitimate draw is missed; a false draw is never
  declared. The same asymmetry holds for `EPIC-004`'s transposition table, where a key that
  over-distinguishes costs a wasted probe rather than a wrong entry — stated as reasoning about an
  unbuilt search, not as a measurement.

**What ratification changed about its weight, addressed plainly because the subtask asks.**
`ADR-0002` clause 2 is now `accepted`, so the derived key list is the substrate for **every**
repetition verdict in the product and four epics inherit the inaccuracy. That is a real escalation
in *blast radius* — but blast radius is not the same as severity or reachability, and neither of
those moved: the failure is still a missed draw, still needs two unbuilt epics to be observable, and
every inheritor is still unbuilt, which means the window to fix it is wide open rather than closing.
**So it does not argue for `P1` today. It argues for a sequencing constraint**, which is what the
escalation trigger below encodes: the cost of this defect is not "a wrong answer in production", it
is "a wrong definition of *same position* baked into the tests of four consumers written on top of
it".

- **Not `P0`/`P1`:** nothing in flight is broken, nothing user-facing exists, and no consumer of the
  key list is built.
- **Not `P3`:** `P3` is "someday", and this has a hard deadline that is not far off — the first
  consumer of the key list. It is also a documented-intent violation (`src/zobrist.ts:4-7` says
  *availability*) in the module whose output *defines* position identity for the whole product, and
  it fails silently.

### 2026-07-31 — re-read against the owner's legality-first directive: `P1` STANDS, and here is the new coupling

`ABC-020` (FIDE 9.2/9.3 claimable, 9.6 automatic) gives this key a **second consumer, and an
automatic one**: fivefold repetition (FIDE 9.6.1) ends the game with no claim, counted off the same
key list. Until today every consumer of this key drove a *claimable* or *display* verdict; now one
drives a game end.

**That does not raise this to `P0`, and the reason is measurable rather than a judgment.** A pure
repetition loop can contain neither a capture nor a pawn move — that is what makes it a repetition —
so the halfmove clock climbs monotonically through it, and `ABC-020`'s **75-move backstop (9.6.2) is
clock-based and inherits nothing from this defect.** Every game therefore still terminates within 150
plies no matter how badly the key under-detects. The cost of `ABC-011` remains what it always was: a
legitimate draw arrives late or not at all, never a false draw and never a hung game.

**`P1` and `Ready` are unchanged, size stays `S`, and the acceptance criteria are untouched.** What
is recorded here is the new blast radius, so that a later reader does not have to re-derive whether
9.6.1 changed the severity. It did not.

**Escalation trigger (do not leave this to judgment later):** ABC-011 rises to **`P1`** the moment
any consumer of the key list is planned or built — specifically when **(a)** the history module of
`ADR-0002` clause 2 is decomposed or implemented under `EPIC-002`, **(b)** a supplier is wired for
`gameStatus`'s `positionCounts` (`ADR-0002` clause 4), or **(c)** `EPIC-004` builds its per-ply key
array (clause 3) or its transposition table. It must be `Ready` **before** whichever of those lands
first, otherwise that consumer's own tests are written against a key that under-detects and the
defect stops being a bug and becomes an encoded assumption. It does **not** escalate on anything
that happens to `ABC-009` or `ABC-010` — it is independent of both.

## Definition of Ready

Problem ✅ · scope + out-of-scope ✅ · INVEST ✅ · acceptance measurable ✅ (exact FENs, exact
`bigint` keys, equality and inequality both asserted) · dependencies ✅ (none blocking; one open
design question ~~flagged and assigned~~ **ANSWERED 2026-08-02 at the design hop**) · NFR triggers ✅
(NFR-005, numeric per-call bar, **measured at the design hop**; NFR-001 explicitly not at risk) ·
test notes ✅ · size ~~`S`~~ **`M`** ✅ · priority `P1` ✅ · no blocker ✅

~~Sits in `Backlog`. ... Promotion to `Ready` is a separate BA/PM step and has **not** been taken.~~

**Promoted to `Ready` 2026-07-30 by BA/PM** — the separate step named above, taken now because the
escalation trigger fired (see the block at the head of this file). The open design question
(board-only vs strict-FIDE reading of "available") remains a **design-hop input, not a blocker**:
it decides one rare extra case and the ticket's dependency shape, and the headline acceptance
criterion resolves identically either way. If the strict reading is chosen, re-size at that hop —
at most `M`, and never split.

**Moved `Ready` → `In Design` → `Ready for Dev` on 2026-08-02 by Architect/Design** (task
`ticket-to-pr-ABC-011`). The design hop is closed: the strict-FIDE reading is ratified in the
`### ANSWERED` block above, and the re-size condition quoted in the paragraph above fired and was
taken as written — **`M`, not split**. `ADR-0002` is extended around and not amended, so no human
ruling is owed for this ticket to proceed; `ADR-0005` records the layering change as `proposed` and
does **not** block it. **`Ready for Dev` → `In Development` is the Orchestrator's pull and has
deliberately NOT been taken here.**

**Moved `In Development` → `In Review` on 2026-08-03 by the Software Engineer** (task
`ticket-to-pr-ABC-011`, branch `grugops/ticket-to-pr-ABC-011`). The `### ANSWERED` block was built
exactly as ratified and none of its six rules was traded away: `hasLegalEnPassant` is a new export in
`src/legal.ts`, `src/zobrist.ts` imports it, the `epSquare !== NO_SQUARE` guard comes first, the
predicate derives the two candidate from-squares rather than calling `legalMoves`, and
`src/gameend.ts` / `src/apply.ts` / `src/moves.ts` are untouched. **Every acceptance criterion is
green**, including the two that were the point: the repro pair now hashes EQUAL, and the
real-capture control plus `src/zobrist.test.ts`'s existing en-passant fixture still hash DIFFERENT
with **no existing test modified** (only three import lines widened across the two test files; every
other original line is byte-identical). Suite **184 passed / 0 skipped** (was 174), lint, typecheck
and build all exit 0. `NFR-005` measured rather than argued on Apple M3 / Node v24.12.0 /
darwin-arm64 (`UNKNOWN - verify` elsewhere): **302.9–306.5 ns at startpos and 309.1–315.6 ns at
kiwipete against a 1.5x bar of ~450 ns / 432–459 ns**, the no-ep path spied at **0** predicate calls
over 260,292 no-ep nodes, worst-case per-call shape **1.36–1.38x**, amortized over a 120,000-node
pool at natural ep frequency **0.995–1.022x**. **No PR exists — this repo has no git remote**, so
there is nowhere to push and no link to record; the commits sit on the local branch. Humans hold
merge and deploy.

**Moved `In Review` → `In Security/NFR` on 2026-08-03 by QE/E2E on a PASS verdict** (task
`ticket-to-pr-ABC-011`, same branch). **QE fixed no production code** — `src/legal.ts` and
`src/zobrist.ts` are byte-identical to `98b07e7`; five tests were added plus one assertion line, all
green, suite **184 → 189**, skip count **0**. The verdict was reached by re-deriving the ticket
independently and by **breaking the delivered suite with 22 mutations**, not by re-running it: 17
killed, **5 survived**, two of them real. **`L8`** (`if (legal) return true;` → `return legal;`,
giving up after the first candidate capturer) survived a 184-test suite and is **not** an equivalent
mutant — on `2r4k/8/8/2PpP3/8/8/8/2K5 w - d6 0 1` the lower-file capturer is pinned and the
higher-file one is legal, so it **over-collapses** two positions FIDE calls different, which is the
opposite of this ticket's safe error direction; the shape is unreachable by the property test
(exactly **two** nodes in a 518,474-node walk have two pseudo-legal ep capturers, neither with that
split), so the FEN was built. **`Z5`** (the ep **file** is load-bearing in no test) also survived,
and is **pre-existing** — it survives the pre-ABC-011 baseline too. Both closed, plus a black mirror
and a byte-purity walk over the reachable node population. **The three remaining survivors are one
gap and belong to Security/NFR** — `Z1`/`Z4`/`L11` are behaviour-**equivalent** (189/189 green, no
key changes on any input), so only cost moves and only on the majority path, which is `NFR-005`'s
sub-bar verbatim; the instrument is a spied call count, not a key assertion. Handed forward with one
new fact: **`Z1` and `L11` together are still green and make `zobristKey` write a stray piece onto
off-board square 15.** **Every load-bearing claim held**: no existing test modified (line-level —
only three import lines per file, `src/zobrist.test.ts:33-37` byte-identical); the fourth
criterion's property test non-vacuous in **both** halves (557 double pushes, 52 answered, 505 not, 0
violations — one added line now pins the collapse half, which `checked > 0` did not); purity over
the full position state at **277,949** reachable nodes, **0 impure**, agreeing with the dev hop's spy
to the six root positions; the module graph rebuilt a third time — acyclic, depth 6, `zobrist` 2 → 5;
and the divergence table reproduced to the number (518,474 / 81,397 / 77,872 / 862 / **0**) with
**zero** predicate-vs-oracle disagreements over all 81,397 ep-set nodes. **One new defect is named
rather than fixed:** since `ABC-011`, `zobristKey` **permanently** corrupts a position whose ep
square is semantically inconsistent (e.g. `4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1` gains a phantom black
pawn on d5) — trigger class is semantically-invalid FEN only, the class `ABC-009`/`ABC-010` occupy
and `## Out of scope` already carries; the ruled oracle corrupts identically on two of the three
reproductions, and "does not inherit `ABC-009`" was independently confirmed true. It does **not**
block this ticket. `NFR-005`'s cost bars were deliberately **not** re-measured — the next column
owns them. Nothing was merged and nothing was deployed.

**Moved `In Security/NFR` → `Ready for UAT` on 2026-08-03 by Security/NFR on a PASS verdict** (task
`ticket-to-pr-ABC-011`, same branch). Gate run against `security.asvs_level: L1` and
`security.block_on: high`. **Result PASS with three accepted risks, each carrying a named owner.**
**No production code was changed at this gate** — `src/legal.ts` and `src/zobrist.ts` are
byte-identical to `98b07e7`.

**Acceptance criterion 7 — the `NFR-005` bar — is MET on both halves, re-measured INDEPENDENTLY with
this gate's own scripts and its own `git archive` baseline of `4c6ed7d`; nothing was accepted from
the Engineer's or QE's figures.** Both trees imported in ONE process, 300,000 iterations per cell
after a 50,000 warm-up, every cell interleaved forward AND backward so drift hits both variants
equally, two samples. **Apple M3 (Mac15,13) / Node v24.12.0 / darwin-arm64 — `UNKNOWN - verify` on
any other hardware**; the machine-independent quantity is the ratio to the baseline tree measured in
the same process, never the absolute nanoseconds.

| position | merged (`4c6ed7d`) | ABC-011 | ratio | bar |
|---|---|---|---|---|
| **startpos — no ep square** | 296.8–340.7 ns | **297.2–298.4 ns** | 0.872–1.006 | ≤ ~450 ns — **MET** |
| **kiwipete — no ep square** | 318.4–334.0 ns | **323.5–330.9 ns** | 0.969–1.039 | ≤ 432–459 ns — **MET** |
| position-3 — no ep square | 165.8 ns | 166.2–166.8 ns | 1.003–1.007 | not a bar position |
| ep set, no capture at all | 309.1–310.1 ns | 307.4–378.2 ns | 0.991–1.224 | not a bar position |
| ep set, capture available | 300.6–301.6 ns | 417.6–420.8 ns | **1.385–1.400** | worst case, **under 1.5x** |
| the divergence FEN (sparse board) | 147.8–148.2 ns | 260.6–261.0 ns | 1.759–1.766 | not a bar position |

**How these cross-check the two prior hops, stated rather than glossed.** The worst-case per-call
shape measures **1.385–1.400x** here, which lands **between** the dev hop's 1.357–1.383x and the
design hop's 1.45–1.48x — so the spread this column was asked to adjudicate is resolved rather than
inherited: three independently written runs agree the shape is real, is the worst on the table, and
is comfortably inside the 1.5x bar. The divergence-FEN ratio (1.759–1.766x) sits just under the dev
hop's 1.771–1.858x and confirms their reading of it — an artefact of a five-piece board where the
base key costs half the normal amount, not a bar position, and its absolute cost (261 ns) is *below*
the bar's own anchor value. One cell of this gate's own is noisy and is reported as measured rather
than smoothed: "ep set, no capture at all" sampled 307.4 ns and 378.2 ns on the two runs; it is not a
bar position and both samples sit far under any ceiling.

**The sub-bar — "the no-ep-square path is not made slower at all" — HOLDS, and wall clock is the
wrong instrument for it.** This gate's own timings put the shipped tree at 1.003–1.007x of baseline
at position-3: inside noise, but "not slower **at all**" is a claim no timing run can settle at that
resolution, and pretending otherwise would be the kind of number this file has learned three times
not to trust. The claim is **structural** and that is how it was verified: on a no-ep node
`position.epSquare !== NO_SQUARE` is false, `&&` short-circuits, and the executed work is
byte-for-byte what the pre-ABC-011 tree executed. Re-spied independently with this gate's own
counting shim through a copy of `zobrist.ts` whose body was `cmp`-verified identical to the shipped
file apart from its two import specifiers, over a depth-3 walk of all six perft roots:

```
nodes hashed                 277,955
nodes carrying an ep square   17,663
hasLegalEnPassant calls       17,663
  ... on the 260,292 NO-EP nodes:  0      <- the sub-bar
max predicate calls per zobristKey call: 1
```

**Identical to the Engineer's figures to the node.** Three roles have now produced these counts on
scripts none of them copied.

**The gap both prior roles handed forward is PINNED, not waived — `src/zobrist.nfr.test.ts`.** It is
a new file, not an edit to any existing test, and it lives in its own file for the reason
`src/gameend.nfr.test.ts` does (ABC-020): a `vi.mock` factory is hoisted to file scope, so putting
it in `src/zobrist.test.ts` would re-route the module graph for all 13 tests there to buy four
assertions. **Each assertion was proven to fail rather than assumed to**, by applying each mutant to
`src/` in turn and running it:

- zero `hasLegalEnPassant` calls across four no-ep positions — kills **`Z1`** (reorder) and
  **`Z4`** (drop the guard), both of which previously survived a 189-test suite.
- exactly one call on each of three ep-set positions — stops the guard over-suppressing, and pins
  that the answer is not recomputed.
- the predicate returns `false` **and** leaves all 128 board bytes untouched, on two no-ep probe
  FENs — kills **`L11`**.

**The second probe FEN is this gate's own contribution and it is why the byte assertion is not
redundant.** On `4K3/8/8/8/8/k7/p7/R7 b - - 0 1` the a2 pawn's departure discovers the a1 rook on the
a3 king, so under `L11` the predicate still returns the **correct** `false` — and still leaves a
stray pawn on off-board square 15. There the board-identity assertion is the only one that bites;
verified by running it, not by reasoning about it.

**The off-board write is ruled a CORRECTNESS defect, NOT a memory-safety one, and the distinction was
measured rather than asserted.** `Position.board` is a `Uint8Array(128)` and the stray write lands on
**index 15, which is inside the allocation** — "off-board" here is the 0x88 encoding's *logical*
predicate (`(sq & 0x88) !== 0`), not a memory bound. And this runtime discards out-of-allocation
typed-array writes outright: probed directly, `probe[-1] = 9` and `probe[999] = 9` both read back
`undefined` with `length` and `byteLength` unchanged. There is no pointer arithmetic, no adjacent
memory and no overflow reachable here, so ASVS **V1.4.1 is not-applicable** — and it is an L2 row in
any case, outside this project's L1 tier. **What it is instead:** it breaks an invariant a *live*
consumer leans on. `kingSquareOf` locates the king with `position.board.indexOf(KING | colour)`
across all 128 bytes, and its own doc comment cites "off-board squares are EMPTY" as the reason that
scan is sound. The mutant writes a PAWN byte, so it does not fool that scan — but it is the invariant
the scan depends on, and the tidy-up that produces it left 189/189 green. That earned a guard, and it
now has one.

**QE's newly found defect is ruled MEDIUM and does NOT block.** Reproduced by this gate on all three
of QE's FENs against the shipped tree, and against the `4c6ed7d` baseline for contrast — unchanged on
all three there, so the property is genuinely **new** since `ABC-011`. QE's fairness to the Engineer
was checked and holds: on the first two FENs the ruled oracle `legalMoves(p).some(...)` corrupts
identically, so that pair is pre-existing in `generateMoves` + `apply` and merely reproduced
faithfully; on the third, `4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1`, `generateMoves` does **not** offer the
ep move, the oracle returns `false` and leaves the position clean, while `hasLegalEnPassant` returns
`true` and corrupts — a genuine predicate-vs-oracle divergence, confirmed here. **Reachability was
verified independently rather than accepted:** the only two writes to `epSquare` in `src/` are
`fen.ts:175` (`parseFen`, which validates that the field is a square *name* and nothing about the
board) and `apply.ts:139`, which sets it to `(move.from + move.to) / 2` only on a pawn double push —
geometry that guarantees both the capturable pawn and the empty target. **No position reachable by
play can trigger it.** MEDIUM rather than LOW because a function whose header promises the position
comes back "as they found it" now silently and *permanently* mutates a caller's data on that class,
and a maintainer will read that header as a guarantee; **not HIGH** because it is unreachable by
play, has no untrusted-input path in a library with no entry point until `EPIC-006`, and carries no
security consequence. **Owners: BA/PM** to cut it or fold it into `ABC-010`; **Architect/Design** to
rule the predicate-vs-oracle divergence, which is a definition question and not an implementation
one.

**Security: NO finding at any severity, and nothing at or near `security.block_on: high`.** This
ticket's own "No security trigger" line is upheld on inspection rather than quoted. `src/` has no
`eval`, `new Function`, `vm`, `child_process` or `require`, no `fs`, no `http`/`https`, no `fetch`,
no `process.env` and no `os` — grepped, all absent. Zero runtime dependencies, with `package.json`
and the lockfile **byte-untouched** by this ticket, so no new supply-chain surface. No secret-shaped
string anywhere in the `4c6ed7d..HEAD` diff. No auth, no session, no privilege, no personal data and
no logging (none is required at L1). `compliance_regime` is empty, so no Compliance Officer hop is
owed. **The ASVS L1 tier is 70 requirements and most are not-applicable by absence of the surface
they name** — all 13 of V6 Authentication, all 6 of V7 Session Management, all 4 of V8
Authorization, all 4 of V9 Tokens, all 5 of V10 OAuth/OIDC, all 8 of V3 Web Frontend, all 4 of V5
File Handling, all 3 of V12 TLS and both V14 rows. **Four rows are named rather than dismissed:**

- **V11.4.1** (approved hash functions) — **not-applicable**, and named precisely because it is the
  row a scanner or a hurried reviewer *would* flag: this change sits in a module called "hashing"
  that seeds its table from `splitmix64` with a hardcoded constant. Zobrist keys are a
  position-identity key for game logic, not a "general cryptographic use case" — no signature, no
  HMAC, no KDF, no random bit generation, and no security decision rests on collision resistance.
  The fixed seed is a deliberate *requirement* (reproducible keys across runs) and the module
  documents why `Math.random` is avoided. Flagging it would be gold-plating; passing over it
  silently would leave the next reviewer to re-derive it.
- **V2.1.1 / V2.2.1** (documented input-validation rules; input validated to business expectations)
  — **partially met**, and the row that genuinely touches the defect above. FEN is this library's one
  externally-authored input format; `parseFen` validates *structure* (it throws `FenError`) but not
  *semantic consistency*. Pre-existing, already ticketed as **`ABC-010`**, and explicitly carried by
  this ticket's `## Out of scope`. `ABC-011` does not create the gap — it adds one new consequence to
  it. Owner: `ABC-010`.
- **V15.1.1 / V15.2.1** (documented remediation timeframes for third-party components) — **not met**
  at the project level; no such policy document exists. **Severity overridden from the L1 default of
  `high` to `low`, with the reason stated as this role's hard limits require:** the project has zero
  runtime dependencies, this change adds none, and a documentation-policy gap that the change neither
  touches nor degrades is not a defect of this change. Recorded so it stays visible rather than
  dropped. Owner: Architect/Design, at `EPIC-006` packaging.
- **V13.4.1** (deployed without source-control metadata) — **deferred, not passed.** Nothing is
  deployed and nothing is packaged until `EPIC-006`.

**Where this change touches data it did not touch before** — the one genuinely new exposure, and the
thing this gate looked hardest at: `zobristKey` used to **read** the board and nothing else; it now
**writes** it transiently through `makeMove`/`unmakeMove` on the ~1–2% of nodes carrying a legal ep
capture. Both defects on this desk are instances of exactly that. Purity on the reachable population
is intact and pinned by QE's 277,949-node walk; this gate re-verified byte purity across all six of
its own benchmark positions (board bytes and `toFen` both identical) and confirmed the two
out-of-play classes above.

**Gates re-run at this gate with the new guard in place:** `npm test` **193 passed / 9 files, skip
count 0** (was 189), `npm run lint` exit 0 (the same 2 pre-existing biome config-schema infos),
`npm run typecheck` exit 0, `npm run build` exit 0. **`ABC-009` and `ABC-010` still carried, not
fixed. `ADR-0005` remains `proposed`; no agent may mark it `accepted` and this gate did not** — and
the code it describes is merged on this branch, which is carried for a human rather than treated as
self-resolving. **No PR exists and none was invented — this repo has no git remote.** Nothing was
merged and nothing was deployed; **a human holds both.**

**Moved `Ready for UAT` → `In Design` on 2026-08-03 by the Orchestrator**, on the project owner's
explicit instruction — *"fix the medium defect before merging"* — recorded verbatim in
`.grugops/context/ticket-to-pr-ABC-011/notes/20260803T113000Z-orchestrator-decision-913e6028.md`.
A backward move from a gates-passed ticket: **the gates were not wrong to pass it**, they recorded
it in the open as an accepted risk with a named owner, and the owner is the one who accepts an
accepted risk. This one they declined. That is `autonomy=pr` working.

**Moved `In Design` → `Ready for Dev` on 2026-08-03 by Architect/Design at the SECOND design hop**
(task `ticket-to-pr-ABC-011`, subtask `architect-abc011-defect-definition-and-ratify`, same branch)
— the first ticket in this project's history to enter `In Design` twice. **No production code was
changed at this hop and no acceptance criterion, reproduction FEN, `NFR-005` bar or `## Out of
scope` line was re-opened.** The three things owed here are settled in the
`### ANSWERED 2026-08-03` block above and in two ADRs:

1. **The definition question is ruled.** Purity is **unconditional** — rule 5 of the first
   `### ANSWERED` block gains no domain qualifier — and it is bought with a **precondition check**
   before the probe move is played, not with a change to what the predicate means. The answer stays
   domain-restricted: `legalMoves(...).some(...)` is the definition and the oracle **on positions
   whose ep square the board does not contradict**, and off that domain the predicate is
   *specified* to answer `false` and touch nothing, because the oracle is demonstrably unsound
   there. **Two guards, not one** — the captured-pawn guard buys purity, the empty-target guard buys
   agreement, and each is killed by its own probe and by nothing else. Re-derived, not inherited:
   518,474 nodes / 81,397 ep-set, **0** answers changed, **0** keys changed, **0** guard firings on
   the reachable population, 193/193 green in a sandbox with no existing test edited.
2. **The owner's technical ruling is recorded, and its follow-on is answered from retrieved text.**
   *"Any legal move, even the special ones still need to be checked"* endorses the strict-FIDE
   reading. **Castling is NOT the same case** — `zobristKey` keeps hashing castling **rights** and
   must not be changed to hash availability. Answered from the FIDE Laws retained under task
   `refinement-fide-9-6-1`, whose sha256 was re-verified today and whose currency was re-checked
   against FIDE's own handbook index, **not** from memory. Ruled in **`ADR-0006`**.
3. **`ADR-0005` is ratified** under the owner's standing directive of 2026-08-03 — `accepted`
   **with an amendment**, because one of its statements was false as written. Both ADRs record what
   would falsify them, clause by clause.

**Size stays `M`** — this ruling does not grow the ticket, and the one item that is genuinely not
`ABC-011`'s (`generateMoves` offering a capture onto the mover's own piece) is **routed to BA/PM**
rather than cut here. **`Ready for Dev` → `In Development` is the Orchestrator's pull and has
deliberately NOT been taken.** Nothing was merged and nothing was deployed.

**Moved `Ready for Dev` → `In Development` → `In Review` on 2026-08-03 by the Software Engineer at
the SECOND dev pass** (task `ticket-to-pr-ABC-011`, subtask `engineer-abc011-fix-purity`, same
branch). The `### ANSWERED 2026-08-03` block was built exactly as ruled and the 2026-08-02 block was
honoured unchanged. **The MEDIUM purity defect the owner declined to merge is closed, and with it all
six known reproductions** — each one reproduced independently against the shipped tree *before* any
code was written rather than taken from the notes.

**The fix is the two guards, in the order and the place ruled**, both loop-invariant and both above
the `EP_CAPTURE_SIDES` loop:

```ts
if (position.board[target] !== EMPTY) return false;    // (a) the ANSWER guard
if (position.board[rank] !== captured) return false;   // (b) the PURITY guard
```

**Each was proven load-bearing by DELETING it and running the suite, not by argument.** Measured
against the final tree:

| mutant | tests failing | which |
|---|---|---|
| guard (a) deleted | **exactly 4** | both pure-divergence FENs, at the predicate **and** the key level — and nothing else |
| guard (b) deleted | **exactly 7** | the three empty-target corruptions at both levels, plus the every-input purity sweep |
| **both** deleted (the declined code) | **13** | and 193 pass — exactly the pre-fix baseline |

**The two failure sets are DISJOINT.** Neither guard subsumes the other and neither can be removed
with the suite green, so the "looks equivalent" one-line simplification is now held by a named test
rather than by a comment. **One honesty note the table owes:** `4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1`
(QE's third reproduction) is closed by **either** guard alone and therefore kills neither
single-guard mutant — named rather than counted as evidence for one of them.

**Rule 5 is now met unconditionally, and it is asserted the way this pass was asked to assert it:**
over the **full position state** — all 128 board bytes including the 64 off-board ones, plus all five
scalars — never through `toFen`, which sees neither an off-board write nor the counters. One test
sweeps **every** ep-square value (all 128 0x88 indices plus five values outside the array) across
five boards, so purity is established for every input rather than for a hand-picked list; that sweep
subsumes the boundary probe the design hop named as killing nothing.

**Diff, deliberately small:** `src/legal.ts` **+32/−6** — of which only **four lines are executable**
(a hoisted `const captured`, the two guards, and the hoisted reference in the probe `Move`); the rest
is the doc-comment correction item 9 owes. `src/zobrist.ts` **+5/−1, doc comment only** — its
condition and `zobristKey`'s signature are byte-unchanged. `src/apply.ts`, `src/moves.ts`,
`src/gameend.ts`, `src/position.ts` and `src/fen.ts` are **byte-untouched**; no dependency added.
The `Hashing` row of `memory-bank/30-architecture.md` — flagged by QE, Security/NFR and
Architect/Design in turn and taken by none of them — is corrected here, one cell, no reshuffle.

**Gates, exactly as they ran:** `npm test` **206 passed / 9 files / 0 failed**, skip count **0** (was
193); `npm run lint` **exit 0** (the same 2 pre-existing biome config-schema infos); `npm run
typecheck` **exit 0**; `npm run build` **exit 0**. **No existing test was modified — zero changed
pre-existing lines in either test file**, verified by line-level diff; not even an import was widened
this pass. TDD was red first and **measured red**: all 13 new tests failed against the shipped tree
before the guards existed, with all 33 pre-existing tests in those two files green throughout.

**`NFR-005` re-derived by this role rather than inherited** (Apple M3 Mac15,13 / Node v24.12.0 /
darwin-arm64 — `UNKNOWN - verify` elsewhere; pre-fix and guarded trees in one process, 9 alternating
rounds, medians): startpos **291.3 ns** against a ~450 ns bar and kiwipete **313.6 ns** against a
432–459 ns bar — **MET**. Isolated on the predicate: **−0.3 to +2.6 ns per call** on the 15.70% of
nodes carrying an ep square, i.e. **≤ +0.41 ns amortized per node**, **0.13%** of a ~313 ns key —
inside the design hop's published **+0.9…+3.0 ns** band without exceeding its ceiling. **20–25x
cheaper** on the invalid class (127.0 → 6.3 ns, 151.0 → 6.0 ns), reproducing its 20–27x. The no-ep
sub-bar is **zero structurally** — the guards sit inside the predicate, after its own `NO_SQUARE`
early return, so the caller's short-circuit never reaches them and `src/zobrist.nfr.test.ts`'s
zero-call assertions pass untouched. **The two no-ep anchors are kept as a NULL CONTROL** whose delta
is structurally zero: they land at **+0.06 ns and +0.20 ns**, which *is* this instrument's resolution
and is why the ep-set whole-key cells (+0.66 and −0.42 ns) are reported as measured rather than
claimed.

**The reachable population did not move**, re-derived on this role's own script — a fifth independent
time — and reproducing the design, dev and QE hops **to the number**: **518,474 nodes / 81,397 ep-set
(15.70%) / 0 answers changed / 0 keys changed / 0 firings of either guard / 0 impure nodes on either
tree.** The guards are a precondition, not a behaviour change, which is `ADR-0005`'s falsifier **F5**.

**Carried, not fixed:** `ABC-009`, `ABC-010`, and the `generateMoves` en-passant-onto-own-piece defect
the design hop routed to **BA/PM** — re-verified this pass on its own FEN and still reproducing; this
fix makes the *hash* immune to it and does not clean the generator. **No PR exists — this repo has no
git remote**, so there is nowhere to push and no link to record; none was invented. Nothing was merged
and nothing was deployed — a human holds both.
