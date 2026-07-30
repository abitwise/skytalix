---
id: 20260730T143500Z-architect-design-decision-d7a42f7a
kind: decision
by: architect-design
at: 2026-07-30T14:35:00Z
verified_by: 
confidence: high
refs:
  - epic-to-tickets-EPIC-002
  - EPIC-002
  - EPIC-003
  - EPIC-004
  - EPIC-005
  - EPIC-006
  - ADR-0002
  - ADR-0001
  - ABC-009
  - ABC-011
  - NFR-002
  - NFR-003
  - NFR-004
  - src/history.ts
  - src/apply.ts
  - src/fen.ts
  - src/gameend.ts
  - src/zobrist.ts
  - memory-bank/30-architecture.md
  - 20260730T143000Z-architect-design-observation-57f6f356
  - 20260730T140500Z-orchestrator-observation-c41a7e92
supersedes: 
---

# SEAM 1 CLOSED — the history module's exact API

Subtask `architect-epic002-seams`. This is the first of the three seams `ADR-0002`'s Decision section
deferred to this decomposition. **`ADR-0002`'s four clauses are ratified and none is reopened here** —
this note is the API that follows from clause 2, not a re-argument of it. Numbers are cited from
`…-architect-design-observation-57f6f356`; nothing is re-measured in this note.

## The module

**File: `src/history.ts`** (clause 2 names it, and says the name is not the load-bearing part — so it
is kept, unchanged, rather than improved on). **Type: `GameHistory`.** Free functions over a plain
interface, no class, because that is what the whole codebase does — `Position` is an interface and
`makeMove(position, move)` is a free function (AGENTS.md rule 11, match existing style).

`GameHistory` is deliberately **not** named `Game`: `ADR-0002` rejected a `Game` type *inside the
rules core*, and a reader meeting `Game` here would have to work out which one they are looking at.

## State — three fields, one of them authoritative

```ts
export interface GameHistory {
  /** The anchor. Immutable by construction; the initial position is never held as an object. */
  readonly initialFen: string;
  /** THE authoritative state (ADR-0002 clause 2). Everything else is a function of this. */
  readonly moves: readonly Move[];
  /** Live, forward-applied, BORROWED — never a snapshot. Read it; never mutate it. */
  readonly position: Position;
}
```

**Why the initial position is a FEN string and not a `Position`.** Nothing in `src/` clones a
`Position` and no clone function exists — `ADR-0001` and `memory-bank/30-architecture.md` say the
board is mutated in place and never copied. A held `Position` would therefore be aliased by the first
replay and destroyed by it. A FEN string is immutable in the language, `parseFen` / `toFen` are
merged, `Done` and round-trip tested under `ABC-001`, and re-parsing costs a **measured 1.62 µs** —
3% of one 46-50 µs full derive. The alternative was to hand-roll a snapshot (copy the `Uint8Array`
plus the five scalars), which invents a second serialization format without `fen.ts`'s test suite and
adds the "copy a Position" capability the ratified representation deliberately does not have.

**`position` is maintained by forward application, not re-derived.** `playMove` calls `makeMove` on
it — a measured ~10 ns. This is not a violation of clause 2's "derived, not maintained": clause 2
names exactly three derived things (the undo stack, the key list, the repetition counts) and the
current position is none of them. Re-deriving it on every read would cost 2.4 µs to answer a question
the renderer asks several times per frame, for nothing. The one risk this buys — that the
forward-apply path and the replay path could disagree — is closed by a single test, named below, and
was checked in the harness at 120 plies.

**`position` is a borrow, and TypeScript cannot enforce it.** `readonly` on the field stops
reassignment; it does not stop `h.position.board[0] = 0`, and there is no deep-readonly for a
`Uint8Array`. So the contract is documented and tested, not typed. This is the same contract
`legalMoves` already lives under, and `30-architecture.md` already warns callers that a `Position` is
a live object. A caller wanting a snapshot calls `toFen(h.position)`. **Accepted, un-mechanizable
weakness — recorded rather than hidden.**

## The API — six functions, and the reason each exists

```ts
export function newGame(initialFen: string): GameHistory;
export function playMove(history: GameHistory, move: Move): void;
export function takeBack(history: GameHistory, plies: number): void;
export function keyHistory(history: GameHistory): bigint[];
export function repetitionCounts(history: GameHistory): ReadonlyMap<bigint, number>;
export function gameStatusOf(history: GameHistory): GameStatus;
```

- **`newGame(initialFen)` — the FEN is required, with no default.** A `STARTPOS` default would put a
  fourth copy of the start FEN into the codebase (it is already literal in `src/perft-bench.ts:26`
  and in three test files) or force a new shared constant into `position.ts` / `fen.ts`. Neither is
  this seam's business. `EPIC-006` owns startup and passes the FEN. *Flagged, not fixed
  (AGENTS.md rules 9 and 12): the start FEN is currently duplicated across four files.*
- **`playMove(history, move)`** appends to `moves` and applies to `position`. **It does not validate
  legality.** Its documented precondition is that `move` came from `legalMoves(history.position)`,
  which is exactly where `EPIC-003`'s parser gets it. The alternative — a defensive
  `legalMoves` check, ~2-5 µs, 0.01% of the 50 ms keystroke budget — is affordable and was considered
  seriously, because this module is a single point of failure for four epics. It is left out to match
  the core's own style (`makeMove` trusts its input) and AGENTS.md rule 5, and the alternative is
  recorded here with its price so a ticket can take it deliberately rather than rediscover it.
- **`takeBack(history, plies)`** truncates the move list and rebuilds `position` by replay from
  `initialFen`. **This is `ADR-0002`'s whole contract made mechanical: undo is one operation on one
  list.** `EPIC-006`'s `undo` is `takeBack(h, 2)`. Measured **2.40 µs at 120 plies**. It clamps at
  zero rather than trusting the caller — `slice(0, negative)` would silently produce a *different
  game* rather than an error, and that is a silent-corruption path, not the impossible scenario
  AGENTS.md rule 8 excludes. A full take-back to `moves.length === 0` is a legal state: the initial
  position.
- **`keyHistory(history)`** returns `keys[i] = zobristKey(position after i plies)`, length
  `moves.length + 1`. This is the **clause-3 seam**: `EPIC-004` seeds its preallocated per-ply array
  from this, **once per search, not per node**, and `EPIC-005` probes the book against the same list.
  `ADR-0002` names this the one place the session's representation and the search's array meet and
  says plainly that is where a bug will live — so it is one named function, not an ad hoc walk.
  Measured 39-41 µs at 120 plies.
- **`repetitionCounts(history)`** folds `keyHistory` into a `Map`. **It includes the current
  position**, because `gameStatus` tests `counts.get(zobristKey(position)) >= 3`; counting only the
  past would report threefold one repetition late, silently. Measured 46-50 µs at 120 plies.
  Counting from ply 0 rather than from the last irreversible move is correct — a capture or pawn move
  changes the key permanently, so positions either side of one can never collide.
- **`gameStatusOf(history)`** is `gameStatus(history.position, repetitionCounts(history))`.
  One line, and it exists to make **clause 4** ("`positionCounts` gets exactly one supplier") a
  call-site default rather than a convention someone must remember. It is not a single-use
  abstraction (AGENTS.md rule 6): `EPIC-002`'s loop and `EPIC-006`'s end screen are two callers
  today. **Honest limit: it does not *prevent* anyone calling `gameStatus(pos)` with no counts and
  getting a silently wrong answer** — `ADR-0002` refused to make that parameter required because
  `gameend.ts` is merged, `Done` and 100% covered, and this note does not reopen that.

### Deliberately NOT in this module

Named so wave 2 does not put them here: **`redo`** (in no epic's scope), **material balance** (a
board scan; `EPIC-002`'s status panel owns it), **`toPgn`** (`EPIC-006`'s negotiable slice — not
blocked, since it needs only `initialFen` + `moves` + SAN, all reachable), **SAN of any kind**
(seam 3 — `history.ts` does not import `san.ts`), and **anything the search needs per node**
(clause 3 says the search does not share this structure).

## Dependency edges — the DAG holds

`history.ts` imports `fen.ts` (`parseFen`), `apply.ts` (`makeMove`), `zobrist.ts` (`zobristKey`),
`gameend.ts` (`gameStatus`, `GameStatus`), and the `Move` / `Position` types. Every edge is downward.
**Nothing in the core imports it**, so the layered chain in `memory-bank/30-architecture.md` gains one
level above `gameend` and stays acyclic with no upward edge, exactly as `ADR-0002`'s Consequences
require. **No new runtime dependency** — every import is intra-repo.

`history.ts` does **not** import `legal.ts` directly (no validation, no SAN) and does not import
`san.ts` (seam 3). It reaches `legal.ts` transitively through `gameend.ts`, which is downward and
fine.

## Cost, per turn, against the budgets

From the measurement note, at 120 plies on M3 / Node v24.12.0 / darwin/arm64,
`UNKNOWN - verify` elsewhere:

| Operation | Cost | Share of the budget it lands in |
|---|---:|---|
| `playMove` | ~10 ns | nothing |
| `takeBack(2)` | 2.40 µs | 0.005% of `NFR-003`'s 50 ms |
| `keyHistory` | 39-41 µs | 0.08% of `NFR-003`'s 50 ms |
| `repetitionCounts` / `gameStatusOf` | 46-50 µs | 0.3% of `NFR-002`'s 16 ms |
| Reading `position` for a frame | 0 | it is already there |

**The history module contributes nothing measurable to a frame.** Everything expensive in
`EPIC-002`'s frame is SAN, which is seam 3.

## Test strategy — this module's tests are its only safety net

`ADR-0002` states it plainly: no existing test would catch getting this wrong, because the perft and
FEN suites assert the *core's* behaviour and never touch game history. Six tests, in the order they
matter:

1. **Undo rewinds the repetition history too** — `EPIC-006`'s named test. Play a threefold line,
   assert `gameStatusOf` reports `threefold-repetition`, `takeBack(2)`, assert it no longer does and
   that `repetitionCounts` equals a fresh replay of the truncated list. This is the corruption
   `EPIC-006`'s Risks section predicts, and clause 2 exists to make it unrepresentable.
2. **Forward-apply equals replay** — after any sequence of `playMove`, `toFen(h.position)` equals
   `toFen` of a position rebuilt from `initialFen` and the same list. The one property the module's
   two code paths must share. (Held in the harness at 120 plies.)
3. **Truncate-then-replay is exact** — `takeBack(n)` followed by replaying the same n moves gives an
   identical FEN and an identical `keyHistory`.
4. **Prefix property** — `keyHistory` of a game truncated to k plies equals the first k+1 entries of
   the full `keyHistory`. This is what makes `EPIC-004`'s seeding sound.
5. **The current position is counted** — the off-by-one that would make threefold fire one
   repetition late.
6. **Seeding invariants** — `keyHistory(h).length === h.moves.length + 1` and
   `keyHistory(h)[n] === zobristKey(h.position)`.

**Known inherited inaccuracy, not this module's to fix:** `ABC-011` (`src/zobrist.ts:71` hashes en
passant when no capture is available) means every key this module derives can under-detect threefold.
`ADR-0002` says the same thing and recommends the ticket; it is already cut and in `Backlog`. Test 1
must not be written in a way that depends on the defective path — `src/gameend.test.ts:27-58` uses a
knight cycle that never sets an ep square, and `ABC-011`'s trace row already records that this makes
it blind to the defect.

## Confidence

**High.** The shape is a direct consequence of a ratified clause, the costs are measured and
reproduce published figures, and the only judgment calls — the FEN anchor, no validation in
`playMove`, and the `gameStatusOf` one-liner — are each recorded above with the alternative and its
price. One machine, one Node version; every number `UNKNOWN - verify` elsewhere.

**No ADR was written for this seam, deliberately.** It is an API that follows from `ADR-0002`
clause 2 rather than a new structural choice, and a fourth ADR restating a ratified clause would be
ceremony over a table. The seam that *did* earn one is seam 3.
