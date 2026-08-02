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
