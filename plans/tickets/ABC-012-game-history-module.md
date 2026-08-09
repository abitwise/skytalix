---
id: ABC-012
title: Game history module — the move list is the authoritative state
status: done
column: Done
size: M
priority: P0
epic: EPIC-002
feature: —
---

# ABC-012 — Game history module: the move list is the authoritative state

## Problem

*User*: every player who takes a move back, and every player entitled to a draw. Indirectly,
every player at all — nothing in the product can evaluate a repetition draw today.

*Pain*: `gameStatus`'s `positionCounts` parameter is optional and **has no supplier anywhere in
`src/`** (`src/gameend.ts:87-90`). Omit it and threefold repetition is never reported — silently,
with no error and no failing test. There is also nothing that holds a game: the loop this epic
builds is the first component in the product that survives a move, and `Position` is a live
mutable object that nothing clones.

*Value*: one small module makes "what game are we playing" a single answer that four epics share.
`ADR-0002` (ratified 2026-07-30, all four clauses) settles the rule: the move list is the
authority, and the undo stack, the key list and the repetition counts are **derived by replay,
never maintained**. That makes the class of bug `EPIC-006`'s Risks section predicts — "a shallow
undo that forgets repetition history would corrupt draw detection" — unrepresentable rather than
merely tested for.

## Source

- `memory-bank/50-decisions/ADR-0002-game-history-ownership.md` — ratified, all four clauses.
- Task `epic-to-tickets-EPIC-002`, note `20260730T143500Z-architect-design-decision-d7a42f7a`
  ("SEAM 1 CLOSED — the history module's exact API") and
  `20260730T143800Z-architect-design-decision-38b772b6` ("SEAM 2 CLOSED — the derived counts are
  NOT memoized"). Both close seams `ADR-0002` deliberately deferred to this decomposition.
  **This ticket implements those decisions; it does not re-open them.**

## Scope

**A new module `src/history.ts`.** Free functions over a plain interface, no class — matching
what the rest of `src/` already does (`Position` is an interface; `makeMove(position, move)` is a
free function).

State — three fields, one of them authoritative:

- `initialFen: string` — the anchor. A FEN string, **not** a `Position`, because nothing in `src/`
  clones a `Position` and a held one would be aliased and destroyed by the first replay.
- `moves: readonly Move[]` — **the authoritative state**. Everything else is a function of it.
- `position: Position` — live, forward-applied, **borrowed**. Read it; never mutate it.

Six functions, and no seventh:

- `newGame(initialFen)` — the FEN is **required, with no default**. `EPIC-006` owns startup and
  supplies it.
- `playMove(history, move)` — appends to `moves`, applies to `position`. **It does not validate
  legality**; its documented precondition is that `move` came from `legalMoves(history.position)`.
- `takeBack(history, plies)` — truncates the list and rebuilds `position` by replay from
  `initialFen`. **Clamps at zero** rather than trusting the caller: `slice(0, negative)` would
  silently produce a *different game*, which is a silent-corruption path, not an impossible one.
  `moves.length === 0` is a legal state — the initial position.
- `keyHistory(history)` — `keys[i] = zobristKey(position after i plies)`, length `moves.length + 1`.
- `repetitionCounts(history)` — folds `keyHistory` into a `Map`, **including the current position**.
- `gameStatusOf(history)` — `gameStatus(history.position, repetitionCounts(history))`, so
  `ADR-0002` clause 4's "exactly one supplier" is a call-site default rather than a convention
  someone must remember.

**No memoization.** `keyHistory` and `repetitionCounts` recompute by replay on every call — no
cache, no version counter, no invalidation. Seam 2 decided this against measured cost: the loop
makes 2–4 derives per turn at 46–50 µs each (120 plies), and it would take ~320 derives in one
turn to spend a 16 ms frame budget. The margin is 80x–300x.

Dependency edges, all downward: `fen.ts`, `apply.ts`, `zobrist.ts`, `gameend.ts`, plus the `Move` /
`Position` types. **Nothing in the rules core imports this module.** It does not import `legal.ts`
directly and does not import `san.ts`.

## Out of scope

- **`redo`** — in no epic's scope.
- **Material balance** — a board scan, and `ABC-016` (the status panel) owns it.
- **`toPgn`** — `EPIC-006`'s negotiable slice. Not blocked: it needs only `initialFen` + `moves` +
  SAN, all reachable from here without this module growing a job.
- **SAN of any kind.** `history.ts` does not import `san.ts` (`ADR-0004` clause 3 — **ratified
  2026-07-31, accepted as proposed**; corrected here, this line read "proposed"). *Read `ADR-0004`'s
  Status section before citing it: it was ratified by the Orchestrator under a named, quoted
  delegation from Olger Oeselg, not by a human directly, and it is explicitly not precedent.*
- **Making `gameStatus`'s `positionCounts` required.** It stays optional, and the reason to carry
  forward is **not** the one `ADR-0002`'s Consequences section records (*"a breaking change to
  merged, `Done`, 100%-covered code"* — QE measured that break at **9 test call sites and 0
  production call sites**, which is not a reason). The decision is right for a stronger reason:
  `ADR-0002` **clause 3** has `EPIC-004`'s search keep its own per-ply key array and decide
  repetition itself, so a search leaf calling `gameStatus(position)` **bare is a legitimate second
  caller shape**, and a required parameter would force the hot path to construct something it
  deliberately does not want. Recorded on this ticket because this ticket is where a reader who
  refuted the weak reason would act on it. `gameStatusOf` remains the single supplier of clause 4.
- **Anything the search needs per node.** `ADR-0002` clause 3 says the search keeps its own
  preallocated per-ply array and does not share this structure.
- **Memoization** — decided against; see Scope. The trigger and the required shape (a monotonic
  `version` counter, never a `moves.length` key) are recorded in the seam-2 note if it is ever
  needed. **Do not add a cache in this ticket.**
- **A shared `STARTPOS` constant.** The start FEN is currently duplicated across four files
  (`src/perft-bench.ts:26` and three test files). *Flagged, not fixed* — it is not this ticket's
  business (AGENTS.md rules 9 and 12).
- Fixing `src/zobrist.ts`'s en-passant hashing — that is `ABC-011`. See Dependencies.

## Acceptance (Given/When/Then)

- **Given** a `GameHistory` from `newGame(STARTPOS_FEN)` and any sequence of N legal moves applied
  with `playMove`, **when** `toFen(history.position)` is compared with `toFen` of a position
  rebuilt from `initialFen` by replaying the same N moves, **then** the two strings are
  **byte-identical**. *(The forward-apply path and the replay path are the module's two code paths
  and this is the one property they must share. Held in wave 1's harness at 120 plies.)*
- **Given** a game in which the start position has been reached three times, **when**
  `gameStatusOf(history)` is called, **then** it returns `result: "draw"`, `reason:
  "threefold-repetition"`; **and when** `takeBack(history, 2)` is called, **then** it returns
  `result: "in-progress"`, `reason: null`, **and** `repetitionCounts(history)` is deep-equal to
  the counts of a freshly replayed history built from the truncated move list.
  *(This is `EPIC-006`'s named test — "undo must assert the repetition history is rewound too,
  not just the board". It must use a repeated line that never sets an en-passant square; see
  Test notes.)*
- **Given** any history of N plies, **when** `keyHistory(history)` is called, **then** the returned
  array has length **exactly N + 1**, and `keys[N] === zobristKey(history.position)`.
- **Given** a history of N plies and the same history truncated to k plies by `takeBack`, **when**
  both key lists are compared, **then** the truncated list is **exactly the first k + 1 entries**
  of the full list. *(The prefix property is what makes `EPIC-004`'s per-search seeding sound.)*
- **Given** `takeBack(history, k)` followed by replaying the same k moves with `playMove`, **when**
  the FEN and the key list are compared with the originals, **then** both are identical.
- **Given** a history whose current position has occurred twice before, **when**
  `repetitionCounts(history)` is called, **then** `counts.get(zobristKey(history.position))` is
  **exactly 3**, not 2. *(The off-by-one that would make threefold fire one repetition late.
  `src/gameend.ts:106` tests `>= 3` and its doc comment states the count includes the current
  occurrence.)*
- **Given** `takeBack(history, n)` where `n` exceeds `moves.length`, **when** it returns, **then**
  `moves.length === 0`, `toFen(history.position)` equals `initialFen`, and **no exception is
  thrown**.
- **Given** a `GameHistory` at 120 plies, **when** each function is called, **then** the measured
  costs meet the bars in *Security / NFR triggers* below.
- **Given** the full test suite, **when** it runs after this ticket, **then** it is green with a
  skip count of **0** and **no existing test is modified**.

## Dependencies

- `ABC-001` / `ABC-003` / `ABC-007` — `parseFen` / `toFen`, `makeMove`, `gameStatus` and
  `zobristKey` are all merged on `main`. Nothing here is blocked on unbuilt code.
- **`ABC-011` — sequencing, not blocking, and its own escalation trigger has now fired.**
  `ABC-011` states that it rises to `P1` "the moment ... the history module of `ADR-0002` clause 2
  is decomposed or implemented under `EPIC-002`". That is this ticket. `ABC-011` has been raised
  to `P1` and promoted to `Ready` accordingly. This ticket **can** be built against today's
  `zobristKey`, because its threefold test uses a line that never sets an en-passant square — but
  **every repetition verdict this module derives inherits `ABC-011`'s under-detection** (a
  legitimate draw is missed; a false draw is never declared). The two must not be built in the
  order that bakes the defect into this module's tests.
- **No blocking dependency on `ADR-0004`.** This module does not touch SAN.

## Security / NFR triggers

- `NFR-003` (keystroke budget, 50 ms) and `NFR-002` (frame budget, 16 ms) — the derives sit in the
  turn, not the frame. Bars, set at ~1.5x wave 1's measured figures on the same machine class
  (**Apple M3, Node v24.12.0, darwin/arm64 — `UNKNOWN - verify` on any other hardware**), at
  **120 plies**:
  - `takeBack(history, 2)` ≤ **5 µs** *(measured 2.40 µs)*
  - `keyHistory(history)` ≤ **60 µs** *(measured 39–41 µs)*
  - `repetitionCounts(history)` / `gameStatusOf(history)` ≤ **75 µs** *(measured 46–50 µs)*
  - `playMove(history, move)` ≤ **100 ns** *(measured ~10 ns)*
  - Growth check: `repetitionCounts` at **300 plies** ≤ **150 µs** *(measured 97–102 µs)*, and
    `ADR-0002`'s own stated threshold for re-opening clause 2 is replay above ~1 ms — **10x above
    the 300-ply figure.**
  - Every number recorded with its machine and its ply count, per the standing convention in
    `plans/nfr-catalog.md`.
- **No security trigger.** No injection sink, no trust boundary, no privilege, no data exposure,
  no user-supplied string reaches this module.

## Test notes

`ADR-0002` says it plainly and it is the reason this ticket's tests are not optional: **no existing
test would catch getting this wrong.** The perft and FEN suites assert the *core's* behaviour and
never touch game history. This module's own tests are its only safety net.

Six tests, in the order they matter — they map 1:1 onto the acceptance criteria above:

1. Undo rewinds the repetition history too (`EPIC-006`'s named test).
2. Forward-apply equals replay.
3. Truncate-then-replay is exact.
4. The `keyHistory` prefix property.
5. The current position is counted.
6. Seeding invariants (`length === moves.length + 1`, last key equals the live position's key).

Three things a naive pass would miss:

- **Test 1 must use a repeated line that never sets an en-passant square.** `ABC-011`
  (`src/zobrist.ts:71` hashes the ep file whenever `epSquare` is set) means a repeated line
  containing a double push hashes two FIDE-identical positions differently and the test would fail
  for a reason that is not this module's. `src/gameend.test.ts:27-58` already uses a knight cycle
  (`g1f3 g8f6 f3g1 f6g8`, twice) for exactly this reason. **Reuse that shape.** Note honestly that
  this makes the test blind to `ABC-011` — `ABC-011`'s trace row already records the same fact.
- **`position` is a borrow and TypeScript cannot enforce it.** `readonly` stops reassignment; it
  does not stop `h.position.board[0] = 0`, and there is no deep-readonly for a `Uint8Array`. The
  contract is documented and tested, not typed. A test that mutates `h.position` and asserts the
  module notices would be testing something the language does not offer.
- **`zobristKey` returns `bigint`.** Compare `bigint` values, and remember `Map<bigint, number>`
  keys compare by value for `bigint`, unlike objects.

## Size and priority rationale

**Size `M` (3).** A new module with six small functions, one of which (`takeBack`) contains the
only real logic — truncate and replay. Calibrated against `ABC-007` (game-end detection: a new
module, five terminal conditions, `M`) and above `ABC-006` (perft harness, `S`). The cost is in the
six tests, not the code. No new dependency, no new runtime package.

**Priority `P0`.** Four epics rest on it (`ADR-0002` binds `EPIC-002`, `EPIC-004`, `EPIC-005`,
`EPIC-006`), the turn loop cannot evaluate a terminal state without the counts it supplies, and it
is the one ticket in this epic with **no unbuilt dependency at all**. It is one of the two tickets
this decomposition puts straight into `Ready`.

## Definition of Ready

Problem ✅ · scope + out-of-scope ✅ · INVEST ✅ (independent — merged `src/` only) · acceptance
measurable ✅ (byte-identical FENs, exact array lengths, exact count of 3, numeric µs bars) ·
dependencies ✅ (none blocking; `ABC-011` sequencing named) · NFR triggers ✅ (five numeric bars,
each with its machine and ply count) · test notes ✅ · size `M` ✅ · priority `P0` ✅ · no
blocker ✅

**Promoted to `Ready` 2026-07-30 by BA/PM.**

**Moved `In Development` → `In Review` on 2026-08-04 by the Software Engineer** (task
`ticket-to-pr-ABC-012`, subtask `engineer-abc012-implement`, Workflow 04). In Development 1/3 → 0/3,
In Review 0/3 → 1/3; no limit approached, no override taken. **No acceptance criterion, `## Out of
scope` line, NFR bar or test note was edited** — the one criterion this implementation could not
satisfy as literally worded is recorded below and handed to BA/PM, not quietly rewritten.

### Implementation record — 2026-08-04, Software Engineer

**What was built.** One new module `src/history.ts` (154 lines, **51 of them executable** — the rest
is the doc comment that carries the two seams' reasoning) and its test file `src/history.test.ts`
(213 lines, 7 tests). **No existing file under `src/` was touched** — every tracked file
under `src/` is **md5-identical** to merged `main` `39e260d`, and `git diff --numstat 39e260d --
src/` is **empty**, which is a byte-level result and stronger than the line-level check the last
acceptance criterion asks for. `plans/` and `memory-bank/30-architecture.md` are the only other
edits.

**The seams were implemented, not re-opened.** All six functions have the exact signatures SEAM 1
published, the three fields are the three it names, and there is **no cache, no version counter and
no invalidation** (SEAM 2). The one thing the language could not express is recorded in the code:
`GameHistory.moves` is `readonly Move[]` to callers, and the module's own two mutators reach through
it via a single named helper, because TypeScript has no "writable inside this module" modifier.

**The dependency claim was measured, not asserted.** The graph rebuilt from `src/*.ts`:
**10 modules, zero cycles, max depth 6 → 7**, `history.ts` alone at level 7, its six edges all
downward (`fen`, `apply`, `zobrist`, `gameend`, plus the `Move` / `Position` types), **no import of
`legal.ts` and none of `san.ts`**, and it is the **one module with zero importers** — which is what
keeps the rules core ignorant of the session.

**Every acceptance criterion has its own test, and every test was proven able to fail.** Seven tests
(the six the ticket names, plus one for the clamp criterion, which the six do not cover). Seven
mutants of the shipped module, each killed:

| Mutant | Killed by |
|---|---:|
| `repetitionCounts` drops the CURRENT position | 2 tests |
| `keyHistory` drops the initial key | 5 tests |
| `takeBack` truncates the list but does NOT replay the board | 2 tests |
| `takeBack`'s zero clamp removed | 1 test |
| `playMove` does not append to the list | 6 tests |
| `playMove` appends but does not apply to the position | 6 tests |
| `keyHistory` records the key BEFORE the move (off-by-one) | 1 test |

**The deep-equal instrument was controlled rather than trusted:** `toEqual` on a `Map<bigint,
number>` was proved to reject a differing count, a missing entry and an empty map while accepting a
reordered equal map — otherwise the repetition-counts comparison could have passed on anything.

**Gates.** `npm test` **221 passed / 10 files / 0 failed** (was 214 / 9); skip count **0**, captured
with the `AGENTS.md` command and not eyeballed; `npm run lint`, `npm run typecheck` and `npm run
build` all **exit 0** (the same 2 pre-existing biome config-schema infos). `src/history.ts` is at
**100%** statements / branches / functions / lines.

**The five NFR bars are MEASURED AND ALL MET**, on **Apple M3 (Mac15,13) / Node v24.12.0 /
Darwin 25.5.0 arm64** and **`UNKNOWN - verify` on any other hardware**. Out of tree, in its own
process, 11 rounds plus a discarded warm-up, cell order rotated every round, medians of per-round
means, two independent samples — no wall-clock assertion was added to the suite, which is this
project's standing rule. Population: one deterministic LCG game from the start position, the same
game `src/history.test.ts` plays, so the ply counts mean the same thing in both places.

| Bar (120 plies unless noted) | Measured (two samples) | Bar | Ratio |
|---|---:|---:|---:|
| `takeBack(history, 2)` — **upper bound**, see below | 2.45 / 2.45 µs | ≤ 5 µs | 0.49x |
| `keyHistory(history)` | 40.66 / 40.51 µs | ≤ 60 µs | 0.68x |
| `repetitionCounts(history)` | 45.72 / 45.78 µs | ≤ 75 µs | 0.61x |
| `gameStatusOf(history)` | 49.33 / 48.99 µs | ≤ 75 µs | 0.66x |
| `playMove(history, move)` | 12.4 / 12.7 ns | ≤ 100 ns | 0.13x |
| `repetitionCounts` @ **300 plies** | 99.62 / 99.07 µs | ≤ 150 µs | 0.66x |

Growth shape, no bar: **18.06 / 17.99 µs @ 40 plies** — linear with a constant offset, and at 300
plies still **10x under** `ADR-0002`'s own ~1 ms threshold for re-opening clause 2. The `takeBack`
figure is honestly an **upper bound**: the two restoring `playMove` calls sit inside its timed
region, contributing about 0.025 µs of the 2.45 µs. Every figure reproduces SEAM 1's wave-1
measurements (2.40 µs / 39–41 µs / 46–50 µs / ~10 ns / 97–102 µs) — which is a check, not a
coincidence, since this is the first time the code being measured actually exists.

**`plans/nfr-catalog.md` was deliberately NOT edited.** That file's own format comment gives its
rows to Architect/Design and Security/NFR, and this ticket's bars are Security/NFR's to gate — the
same division the `ABC-011` Engineer kept.

### The one acceptance criterion that cannot be satisfied as worded — handed to BA/PM, not rewritten

**Criterion 2's first half asks `gameStatusOf` to return `result: "draw"`, `reason:
"threefold-repetition"`. `src/gameend.ts` cannot return that, and its TYPE cannot express it.**
`threefold-repetition` is a `ClaimableDraw`, not an `EndReason`, so `{ result: "draw", reason:
"threefold-repetition" }` is not an inhabitant of `GameStatus`. That is not an oversight: `ABC-020`
ruled on FIDE 9.2.1 that the third occurrence is a draw **the side to move may claim and may just as
well decline**, and `src/gameend.test.ts:68-92` pins the actual shape —
`{ result: "in-progress", reason: null, claimable: { by: "white", draws: ["threefold-repetition"] } }`.

**This ticket's `## Out of scope` forbids the only change that would satisfy the literal wording**
(altering merged, `Done`, 100%-covered `gameend.ts`), and SEAM 1 fixes `gameStatusOf` as the one-line
delegate `gameStatus(history.position, repetitionCounts(history))`. The criterion's **intent** —
threefold is reported before the take-back and gone after it, and the counts rewind with the list —
is tested in full and green. **The wording is BA/PM's to correct; it was not edited here, and it was
not silently ignored either.** The criterion's second half (`in-progress` / `reason: null` /
counts deep-equal a fresh replay after `takeBack(history, 2)`) is satisfied exactly as written.

### Handed to QE rather than absorbed

- **Criterion 2's own test does not pin the BOARD half of `takeBack`.** The "truncate but never
  replay" mutant survives it, because after the take-back `gameStatusOf`'s verdict is decided by the
  derived counts and the stale board still reads `in-progress`. It is killed by the criterion-5 and
  criterion-7 tests, so the module is covered — but if that test is ever read as the whole guard on
  undo, it is not.
- **The off-by-one `keyHistory` mutant is killed by exactly one assertion.** One-assertion coverage
  of a real defect class is thin by construction.
- **The double-push repetition test is still not written.** The Orchestrator's pull note named it for
  the QE gate and deliberately did not order it; it is in no acceptance criterion, so it was not
  added here (`AGENTS.md` rules 5 and 9). `src/zobrist.ts:85` now hashes the ep file only when a
  legal capture exists, so such a line would hash equal today — which is exactly why the test would
  now mean something it could not have meant before `ABC-011`.
- **`playMove` validates nothing.** SEAM 1 priced the defensive `legalMoves` check at ~2–5 µs and
  left it out; nothing in the repository fails if a caller passes a move from another position.
- **The `position` borrow is untypeable and untested.** `readonly` does not stop
  `history.position.board[0] = 0`, and there is no deep-readonly for a `Uint8Array`. Documented, as
  SEAM 1 accepted. One consequence worth naming: `takeBack` rebuilds the borrowed object **in
  place**, so a caller holding `h.position` across a take-back keeps a valid reference — but a
  caller holding `toFen(h.position)`'s subject is holding nothing.

**Carried, not fixed:** `ABC-009`, `ABC-010` and `ABC-022`. The start FEN is now literal in **five**
files rather than four — `## Out of scope` forbids the shared constant, and every test file in this
suite already declares its own. **No PR exists — this repo has no git remote**, so there is nowhere
to push and none was invented. Nothing was merged and nothing was deployed; a human holds both.

**Moved `In Review` → `In Security/NFR` on 2026-08-04 by QE/E2E** (task `ticket-to-pr-ABC-012`,
subtask `qe-abc012-review`, Workflow 04) on a **PASS** verdict. In Review 1/3 → 0/3, In
Security/NFR 0/2 → 1/2; no limit approached, no override taken. **No acceptance criterion, `## Out
of scope` line, NFR bar or test note was edited** — including criterion 2, whose wording is upheld
as unsatisfiable and routed to BA/PM rather than rewritten here.

### QE review record — 2026-08-04, VERDICT PASS

**The verdict was earned by breaking the module, not by re-running the Engineer's numbers.** Those
were re-run only as a control and they reproduce: **221/221 on 10 files**, skip count **0**, lint /
typecheck / build all **exit 0**, `git diff --numstat 39e260d -- src/` **empty**.

**21 mutants of the shipped `src/history.ts`** — the Engineer's seven re-run as a control on its own
table, **all seven dying exactly as reported**, plus **fourteen of this gate's own**. The harness ran
from the session scratchpad, restored the file after every run and **md5-verified the restore**;
`src/history.ts` is `12f8c562d46286e68383f8e2cab407fa` before and after all 21 cycles. It carries its
own positive control (the seven known kills) and a **null control by construction** — one
behaviour-equivalent mutant that *must* survive, and does.

**THREE OF THE FOURTEEN SURVIVED ALL 221 DELIVERED TESTS**, and all three are the same shape:
`resetTo`, the helper `takeBack` rebuilds the borrowed `Position` with, silently failing to copy one
of its six fields.

| Mutant of the shipped module | Result on the delivered suite | Why the suite could not see it |
|---|---|---|
| `resetTo` never copies `castling` | **SURVIVED** | `makeMove` only ever CLEARS rights, so a replay from an already-diminished position converges on the same answer — and **no acceptance test ever takes back the move that lost a right** |
| `resetTo` never copies `blackToMove` | **SURVIVED** | `makeMove` TOGGLES the side to move, and **all three take-back tests run from EVEN ply counts (40, 40, 8)**, where two wrongs cancel exactly |
| `resetTo` never copies `epSquare` | **SURVIVED** | `makeMove` sets the ep square on every move, so any replay of ≥ 1 move hides a stale one; the only test truncating to ZERO plies anchors at startpos, where it is empty either way |

**One root cause, and it is the honest summary of the delivered suite: every acceptance test anchors
at the START position and takes back only at EVEN ply counts.** `src/history.ts` is **correct on all
three** — these were holes in the **suite**, not defects in the module.

**Closed by five tests this gate added**, each aimed at a mutant that actually survived rather than
at an imagined one: a castling right restored by take-back; a take-back landing on an **odd** ply
count; a clamp to a **mid-game anchor carrying an en-passant square** (the first test in the file to
anchor anywhere but startpos — which is what `newGame`'s required, defaultless FEN exists for — using
the **tightest** over-run `plies = length + 1`, where the removed clamp keeps a *different game*
rather than an obviously empty one); every `keyHistory` entry checked against a `parseFen` +
`makeMove` oracle (**13 assertions instead of 1**); and the **automatic fivefold draw**, the module's
only reachable end-of-game path and never previously tested. **Plus one assertion added to criterion
2's own test.** Suite **221 → 226**, skip count **0**, `src/history.ts` still **100%** on all four
coverage axes, and **no production code was changed**.

### The three items the Engineer handed forward, adjudicated from the evidence

1. **Criterion 2 cannot be satisfied as worded — UPHELD, and verified with the COMPILER rather than
   by reading.** `const bad: GameStatus = { result: "draw", reason: "threefold-repetition" }` is
   **TS2820**; the null control `reason: "stalemate"` compiles clean, so the probe is not vacuous.
   **The criterion's INTENT is met and GREEN.** The wording is **BA/PM's** — neither this ticket nor
   merged `gameend.ts` was edited. **One thing for BA/PM that was on nobody's list: `gameStatusOf`
   CAN return `result: "draw"` for repetition — at FIVEFOLD (FIDE 9.6.1, automatic).** So the
   criterion is re-wordable in either direction: to the claimable shape the module actually produces
   at three occurrences, or to fivefold. The fivefold test now exists either way.
2. **Criterion 2's test does not pin the BOARD half of `takeBack` — CONFIRMED by measurement, now
   CLOSED.** One `toFen` assertion against a core-primitive oracle. The truncate-but-never-replay
   mutant now dies **to that test** and to **6 tests in all** rather than 2.
3. **Two mutants die to exactly one assertion — CONFIRMED, and both now have two INDEPENDENT
   killers.** The `keyHistory` off-by-one and the zero clamp. The `position` borrow remains
   untypeable, and see the naming below for what its doc comment gets wrong.

### Two corrections of record, neither blocking

- **The `grep -vxF -f` instrument is NOT unsound — the shell's `grep` is not `grep`.** The Engineer's
  identity null control reproduces exactly (13 on `src/fen.test.ts`, 73 on `gameend`, 81 on `apply`),
  and **those counts ARE the files' blank-line counts, 1:1 across four files**: `grep` in the agent
  shell is a function shimming to **ugrep 7.5.0**, which does not match an empty `-F -x` pattern
  against an empty line. **`/usr/bin/grep` returns 0 on the identity control for all four.** Claiming
  no number from it was the right call; the *diagnosis* was wrong, and leaving it would teach the
  next role to distrust a sound idiom instead of a shimmed binary.
- **`npx vitest run --coverage` does not delete 22 tracked files.** `coverage/` is tracked (22 files)
  and unignored, so the premise holds and the hazard is real — but measured under a controlled
  restore, the **plain** command deletes **0** and modifies **15**, while the **filtered** command the
  artifact-ref records deletes **12** and modifies **3**. Both reproduced, both restored
  byte-identically. **Mitigation verified: `--coverage.reportsDirectory` pointed outside the
  repository leaves `coverage/` untouched.**

### Named, not fixed — QE does not change production code

- **`takeBack(history, NaN)` silently discards the entire game.** No throw, no clamp,
  `moves.length === 0`; `undefined` behaves the same, because `Math.max(0, NaN)` is `NaN` and
  `splice(NaN)` starts at 0. A fractional `plies` takes back **more** than asked (1.5 → 2). Negative
  and `Infinity` are both safe, exactly as the implementation record says. `NaN` is a `number` to
  TypeScript and **`ABC-019`'s turn loop will parse a ply count from user input**, so this is the
  same silent-corruption class the clamp exists for, in the one input shape it does not cover.
  **Not fixed, and deliberately not pinned by a test** — a test asserting today's output would
  enshrine it. Owner: BA/PM to rule, `ABC-019` to consume.
- **`src/history.ts:42` says the borrow contract "is documented and tested". It is not tested** — no
  test touches `history.position.board`, as the Engineer's own claim note states. The same comment
  tells callers **not** to hold `position` across a `takeBack`, while the decision note and the
  implementation record above say holding it is **safe** because `takeBack` rebuilds in place. Two
  documents give `ABC-019` opposite guidance.
- **The double-push repetition test is DECLINED with a reason rather than left open.** It would
  assert a property of `src/zobrist.ts` — `ABC-011`'s, merged, gated twice and covered — not of
  `src/history.ts`, which cannot distinguish the two hashes. It belongs on `ABC-011`'s trace row.
- **`playMove` still validates nothing.** SEAM 1's priced decision, not re-opened here.

### What this gate did NOT do

**The five NFR bars were deliberately NOT re-measured — Security/NFR owns them and gates next** — and
**nothing cost-shaped was added**: the five new tests carry **no wall-clock assertion**, this
project's standing rule. `plans/nfr-catalog.md` and the trace row's `NFRs` cell were left alone.
**Acceptance criterion 9 was verified at LINE level, which is what it asks, with a working null
control: all nine test files present at `39e260d` are +0/−0**, while the same instrument reads 107
added lines on the one file this gate changed; `src/history.test.ts` did not exist at `39e260d`, so
it is not a pre-existing test and the criterion still holds. **`ABC-009`, `ABC-010` and `ABC-022` are
carried, not fixed.** **No PR — this repo has no git remote.** Nothing was merged and nothing was
deployed; a human holds both.

**Moved `In Security/NFR` → `Ready for UAT` on 2026-08-04 by Security/NFR** (task
`ticket-to-pr-ABC-012`, subtask `security-nfr-abc012-gate`, Workflow 04) on a **PASS_WITH_RISKS**
verdict. In Security/NFR 1/2 → 0/2, Ready for UAT 0/4 → 1/4; no limit approached, no override taken.
**No acceptance criterion, `## Out of scope` line, NFR bar or test note was edited** — including
criterion 2, whose wording remains BA/PM's and is now upheld as unsatisfiable by two gates.

### Security/NFR gate record — 2026-08-04, VERDICT PASS_WITH_RISKS

**Result PASS. NO required fix outstanding. FIVE accepted risks, each with a named owner and a
place.** Gated against `security.asvs_level: L1` and `security.block_on: high` — nothing sits at
`high`, so nothing blocks. `compliance_regime` is `[]`, so no Compliance Officer hand-off is owed.

**It was not earned by reading the Engineer's numbers or QE's verdict.** Those were re-run only as a
control on this gate's own instruments and they reproduce: **226 passed / 10 files / 0 failed**, skip
count **0** by the `AGENTS.md` command, `npm run lint` / `npm run typecheck` / `npm run build` all
**exit 0**, and `src/history.ts` md5 `12f8c562d46286e68383f8e2cab407fa` — **identical to the
Engineer's `feat` commit `47cad31`**, which is the independent confirmation that QE changed no
production code.

#### The five bars, RE-MEASURED — all six MET with room

Own harness **outside the repository**, its own process doing nothing else, a **discarded warm-up
round**, **11 rounds with the cell order rotated every round**, medians of per-round means, **two
fully independent samples**, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and
**`UNKNOWN - verify` on any other hardware**. Population stated: the **same deterministic LCG game
`src/history.test.ts:81-89` plays**, so a ply count means the same thing in the harness and in the
suite. **No wall-clock assertion was added to the suite** — this project's standing rule.

| Bar (120 plies unless noted) | This gate (two samples) | Bar | Ratio | Verdict |
|---|---:|---:|---:|:--|
| `takeBack(history, 2)` — upper bound | 2.46 / 2.45 µs | ≤ 5 µs | 0.49x | **MET** |
| `keyHistory(history)` | 40.16 / 40.20 µs | ≤ 60 µs | 0.67x | **MET** |
| `repetitionCounts(history)` | 44.35 / 44.45 µs | ≤ 75 µs | 0.59x | **MET** |
| `gameStatusOf(history)` | 47.75 / 47.59 µs | ≤ 75 µs | 0.64x | **MET** |
| `playMove(history, move)` | 8.6 / 8.2 ns | ≤ 100 ns | 0.09x | **MET** |
| `repetitionCounts` @ **300 plies** | 91.93 / 92.15 µs | ≤ 150 µs | 0.61x | **MET** |

Shape row, no bar: **17.57 / 17.48 µs @ 40 plies** — linear with a constant offset (17.5 / 44.4 /
92.0 µs at 40 / 120 / 300), so at 300 plies the derive is still **~10x under** `ADR-0002`'s own
~1 ms threshold for re-opening clause 2, and **SEAM 2's no-memoization decision is under no pressure
from anything measured here.**

**Where this gate's figures differ from the Engineer's, it is stated rather than smoothed:** the four
derives read 1–8% lower here, `takeBack` agrees to 0.4%, and `playMove` is **1.5x apart** (8.2–8.6 ns
against 12.4–12.7 ns) — a difference this gate **cannot attribute**, because the Engineer's harness
shape is not recorded in enough detail to reproduce. It does not move the verdict; both figures are
more than 7x under the bar. **Every bar is MET on two independently written harnesses**, which is the
check the `UNKNOWN - verify` convention exists to make possible.

#### Both fences QE handed forward — TESTED, and one produced a result nobody predicted

**Fence 1 — `gameStatusOf`'s margin is position-dependent.** Discharged with the fence's own
measurement rather than passed on a third time. The margin over `repetitionCounts` is **3.40 / 3.14
µs** on the startpos-anchored line and **4.55 / 4.49 µs** on a kiwipete-anchored line, against bare
`legalMoves` of **2.74 µs** and **3.89–3.96 µs** at those positions. **So the margin IS the one
`legalMoves` call inside `gameStatus` plus ~0.6 µs of its other work, and it swings 1.4x on position
alone.** The fence is real.

**And the result nobody predicted: the expensive-`legalMoves` anchor is CHEAPER overall** — kiwipete
**41.89 / 42.25 µs** against startpos **47.75 / 47.59 µs** — because on this module the O(plies)
derive dominates and that line's replay is cheaper by more than its generator call is dearer. **The
bar survives the worst `legalMoves` position this repository benchmarks.** The arithmetic worst case
over the observed extremes (44.45 + 3.96 + ~0.6) is **~49.0 µs = 0.65x of the bar** — labelled as
arithmetic, not as a measurement.

**Fence 2 — the `takeBack` figure is an upper bound.** Tested by moving the two restoring `playMove`
calls **outside** the timed region. **It reads HIGHER, not lower: 2.92–2.93 µs against 2.45–2.46
µs**, because the clean variant builds a fresh 120-ply history per iteration and pays cold-object
cost. The restore's arithmetic contribution is two `playMove` calls at ~8.4 ns ≈ **0.017 µs, below
what this instrument can resolve.** So the bound is confirmed as a bound, is tight to within less
than the instrument can see, and **the bar is MET on either framing (0.49x and 0.59x)**. No claim is
made that either framing resolves the other.

#### One instrument was built, measured, and DISCARDED before it produced a false MISS

The first `takeBack` cell called `legalMoves` **twice inside the timed region** and read **10.38 µs
against the 5 µs bar — 2.08x, a MISS.** Two generator calls at 2.7 µs each account for ~5.4 µs of it.
The restoring moves are fixed across iterations (the state cycles), so they are now computed once
outside the clock and the cell reads 2.46 µs. **No number is claimed from the discarded instrument
and it is recorded rather than buried** — a gate that reports a MISS it manufactured itself is worse
than one that reports nothing. Seventh instrument-limit correction this project has recorded.

#### The "no security trigger" assertion — TESTED, not inherited, and it HOLDS

**Structurally:** the transitive import closure of `src/history.ts` was rebuilt — **8 modules**
(`history`, `apply`, `fen`, `gameend`, `legal`, `moves`, `position`, `zobrist`), **every import
relative and inside `src/`, not one non-relative import**, and across the whole closure **zero**
`node:` builtins, `child_process`, `require(`, `eval(`, `new Function`, `process.env`, `globalThis`
or `__proto__`. No filesystem, no network, no environment, no serialization sink, no logger, no
secret, no privilege check. **Zero runtime dependencies** (`package.json` has no `dependencies` key
at all); `package.json` and `package-lock.json` are **byte-identical to merged `main` 39e260d**.

**Adversarially:** 12 hostile payloads fed to `newGame(initialFen)`, the module's only external
string input — prototype-pollution keys, `__proto__` and `constructor/prototype` placements, a
10,000-character string, control bytes, `; rm -rf /`, `../../../../etc/passwd`, `' OR 1=1 --`,
`<script>`. **Every one rejected with a typed `FenError`. Zero prototype pollution**
(`Object.prototype` unmodified), zero hang, zero crash. **One payload got through and it is
`src/fen.ts`'s, not this module's** — see accepted risk 3.

**ASVS L1 judged, not padded: 12 of the 70 L1 requirements are reachable and each was judged from
evidence; 58 are structurally N/A with the reason stated per block** (45 across V3/V4/V6/V7/V8/V9/
V10/V12 — no HTTP, browser, user, account, session, token or socket; V5 — no file handling; V14 —
**there is no sensitive data in this system at all**, the entire data content is a chess position and
a move list; V11.3.x — no encryption; the V1 output-encoding half — no HTML, XML, URL, JSON or
template). V1.2.4 / V1.2.5 / V1.3.2 **PASS by absence of sink**, verified structurally. **V11.4.1 is
N/A with its reason stated rather than silently skipped:** `zobristKey` is a **non-cryptographic
position-identity hash** that signs nothing, authenticates nothing and derives no key — a collision
is a wrong draw verdict, a **correctness** risk and not a security one. A judged subset with its
delta stated beats a re-run of 70 rows, which is the `ABC-011` gate's precedent.

#### The `takeBack(NaN)` ruling — reasoned, not asserted

**Reproduced on the shipped module and EXTENDED past QE's table:** `NaN`, `undefined`, **the raw
string `"abc"`** and **`{}`** each silently discard the **entire** game; `null`, `[]`, `-1` and
`-Infinity` are safe no-ops; `"2"` and `[3]` are correct by coercion; `1.5` takes back 2 and `0.5`
takes back 1; `Infinity` and `1e21` clamp to 0 correctly. **The string case is new here and it is the
one that matters** — `ABC-019` parses a ply count from user input, and **both** plausible
implementations reach the defect (`Number.parseInt("abc")` is `NaN`; handing the raw token through is
worse still, because there is no `NaN` anywhere for a reviewer to notice).

**Severity MEDIUM. It does NOT block against `security.block_on: high`**, and the reasoning is
written out because the convenient answer here would have been the easy one. It is a **correctness
and data-integrity defect, not a security finding.** Under ASVS **V2.2.1** an unvalidated input used
for a business decision is an L1 requirement, and this role's own rule makes an **L1 fail HIGH by
default — which would block.** **It is not an L1 failure today, and the reason is a fact this gate
measured rather than an opinion: the input surface does not exist.** `src/history.ts` has **zero
production importers**, and there is **no call to `takeBack` or `playMove` anywhere outside
`src/history.test.ts`**. Nothing untrusted reaches it; there is no trust boundary for a validation
control to sit on. **The requirement is not FAILED — it is NOT YET ENGAGED.**

**And the counterfactual is stated plainly rather than banking the convenient half: the moment
`ABC-019` wires a parsed ply count to this function, V2.2.1 IS engaged, the default severity is HIGH,
and it BLOCKS.** That is not a deferred security control — it is a named trigger with a named owner.
**Owner: BA/PM to rule the guard; place: `ABC-019`.** Not fixed, and deliberately not pinned by a
test, on QE's reason which this gate shares: a test asserting today's output would enshrine the
behaviour and make the eventual fix look like a regression.

#### `playMove`'s unguarded precondition — the consequence is worse than "a corrupt board"

Feeding a start-position move to a history anchored at `8/8/8/8/8/8/8/K6k w - - 0 1` is accepted
without error, materialises a knight, and `gameStatusOf` then returns
`{"result":"draw","reason":"insufficient-material"}` — **a well-typed, confident, WRONG terminal
verdict.** Neither prior note has that; both say "a corrupt board". ASVS **V2.3.1 PARTIAL**, not
engaged today for the same zero-caller reason. SEAM 1 priced the guard at ~2–5 µs and declined it;
**not re-opened here**, but now on the record with its real consequence.

#### The three other items QE handed this column by name

- **The coverage hazard was read BEFORE coverage was run.** `coverage/` is tracked (22 files,
  confirmed) and **is not in `.gitignore`** (confirmed). **QE's mitigation was used and then verified
  rather than trusted:** `--coverage.reportsDirectory` pointed outside the repository gave
  `src/history.ts` **100 / 100 / 100 / 100** against a 0.8 threshold, with
  `git status --porcelain -uall coverage` **empty** and `git diff --numstat 3a44b3f -- coverage`
  **empty**. **`coverage/` is byte-identical after this gate's run.** The hazard was deliberately
  **not** reproduced — QE reproduced it twice already under a controlled restore, and damaging
  tracked files a third time would add nothing.
- **The test-integrity checker was re-run and recorded as an ERROR, never as a pass.**
  `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` → *"Error: cannot
  read the registry file"*, **exit 2**; the registry does not exist (confirmed with `ls`). Exit 2 is
  "the checker could not run" — not the exit-1 short-circuit and **not a pass**. Three roles have now
  run it independently on this ticket and all three recorded the same. Skip count is **0**, so there
  is nothing for the registry to justify, and **no file was created** — an agent may not self-author
  a justification to clear its own gate.
- **The `src/history.ts:42` contradiction is CONFIRMED on this gate's own instruments, both halves.**
  *"documented and tested"* is **false** — no test in `src/history.test.ts` touches `position.board`
  (searched; seven other test files do, none about `history.position`). And the comment tells callers
  not to hold the reference across a `takeBack`, which the shipped `resetTo` makes **safe**:
  measured, a held reference is `=== h.position` afterwards, is not stale, and reads the **correctly
  rewound** position. The comment errs in the safe direction, so it is not a defect and not a blocker
  — but `ABC-019` is the first caller and will read one of two documents that disagree. **Named, not
  fixed.**

#### Five accepted risks, each with a named owner and a place

1. **`takeBack(NaN)` / `"abc"` / `{}` / `undefined` destroys the game** — **MEDIUM** — owner
   **BA/PM**, place **`ABC-019`**.
2. **`playMove` validates nothing; a foreign move yields a confident WRONG verdict** — **MEDIUM** —
   owner **Architect/Design** (SEAM 1 priced and made the call), place **`ABC-019` / `EPIC-003`**.
3. **`src/fen.ts` accepts out-of-range move counters** — `999999999999999999999` is **accepted**,
   becomes `1e+21`, **breaks FEN round-trip byte-identity**, and makes `gameStatusOf` report a
   `seventy-five-move` draw before the game starts. Negative, non-numeric, exponential and hex
   counters are all correctly rejected, so this is a **range gap in a control that exists**, not a
   missing control. `ABC-001`'s merged `Done` code, out of scope here (`AGENTS.md` rules 9 and 12) —
   recorded because **this ticket makes it reachable through a new door**, `newGame(initialFen)`.
   **LOW** — owner **BA/PM** to cut it or fold it into the `ABC-009` / `ABC-010` invalid-FEN family,
   place **`EPIC-001`**.
4. **`coverage/` tracked, unignored and stale** — **LOW** — owner **a human** (repository hygiene, not
   an agent's cleanup). **Three roles have now flagged it and no ticket exists for it**; three flags
   with no ticket is how a flagged item evaporates, so the missing artefact is named rather than a
   fourth flag added. **BA/PM** to cut it.
5. **Every NFR figure is one machine and one Node version** — **LOW** — owner **Security/NFR**, place
   **`EPIC-004`'s already-scheduled non-M3 spike** (`RISK-002`'s mitigation), the same instrument that
   lifts `NFR-005`'s PROVISIONAL marker. Two samples agree to ~1% and the margins are 1.5x–11x, so a
   3x slower machine still clears every bar — **but that is arithmetic, not a measurement.**

#### What this gate could NOT settle

Why this gate's `playMove` figure is 1.5x the Engineer's (both >7x under the bar; the Engineer's
harness shape is not reproducible from what is recorded, and *"we do not know why these differ"* is
the honest sentence); whether the two `takeBack` framings resolve each other (**they do not** — the
delta is below instrument resolution); the true worst case for `gameStatusOf` across all positions
(two anchors measured, the rest is arithmetic); and **whether `EPIC-006` will ever let a user type a
FEN**, which is the scope question accepted risk 3's LOW severity rests on.

#### What this gate deliberately did NOT do

**No production code was changed and no test was added** — `src/history.ts` and `src/history.test.ts`
are byte-identical to what QE handed over. This gate names required fixes rather than making them,
and both defects it found need **guards**, which are production logic this column does not write.
**NO NFR TARGET MOVED — not one.** `plans/nfr-catalog.md` gains `ABC-012`'s real-code measurements on
the two rows that already name this module's derives (`NFR-002`'s boundary condition, `NFR-003`'s
turn budget); `NFR-001`, `NFR-004`, `NFR-005`, `NFR-006` and `NFR-007` are byte-identical. **The
double-push repetition test stays DECLINED** on QE's routing reason — this gate has no evidence that
changes it. **`ABC-009`, `ABC-010` and `ABC-022` are carried, not fixed.** **UAT is DEFERRED to
`EPIC-006` and recorded as deferred, never as passed** — this module has zero importers, renders
nothing and prompts for nothing, so there is no surface a human can exercise. **No PR — this repo has
no git remote and none was invented.** Nothing was merged and nothing was deployed; a human holds
both.

## Board history

Every `plans/board.md` entry ever written about this ticket — column entries and exits, the WIP
counts at each move, and what each gate recorded — is in
[`history/ABC-012-board-history.md`](history/ABC-012-board-history.md) (7,537 bytes), moved there **verbatim** on 2026-08-10 when the board
was tidied. It is not duplicated on the board and nothing was summarised or dropped.
