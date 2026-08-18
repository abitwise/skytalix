---
kind: adr
---
# ADR-0012: The opening book composes with the search as a DECORATOR of `EngineSeam`, built by `EPIC-005` and wired at `EPIC-006`'s composition root

## Status

**accepted** — 2026-08-18 by Architect/Design at task `design-p0-chain-rulings-2026-08-18`, on the
Orchestrator's routing of `ABC-078`'s open DoR item 5 and `ABC-095`'s hard blocker.

**Proposed 2026-08-18** by Architect/Design at task `design-engine-seam-composition-2026-08-18`, on
the question BA/PM raised at `refinement-p0-chain-2026-08-18`. It is `G3` on the
`epic-to-tickets-EPIC-005` gaps note, whose owner cell reads **Architect/Design, at `ABC-095`'s
`In Design`**.

**Nothing below the Status section is edited by this ratification.** `## Context`, `## Decision`
(clauses 1–9), `## Alternatives`, `## Consequences` and `## Rollback` stand **exactly as proposed**.
What this hop adds is the signature, the falsifiers the ratifying role owes, clause 9's **discharge**,
and two re-measurements.

### Why it is ratified here, when the proposing hop declined

That hop left it `proposed` on two named grounds. The first is a misreading and is corrected; the
second is real weight that names the wrong owner.

- **Ground (1) — *"this project has a standing rule, recorded on `ABC-092`, that an agent researches
  and a human ratifies"*. MISREAD.** That sentence is `ABC-092`'s board row and it is about **the
  opening book's SOURCE and its LICENCE** (`RISK-004`) — a legal and product choice, which is the
  owner's. It is not a general rule about ADRs, and it was never written as one. The general rule is
  `memory-bank/60-progress.md` § "Standing directive — who decides" (**owner, 2026-08-03**), which
  says in its own heading that it **supersedes "no agent may ratify an ADR"**: *"If it is
  architecture question then to architect to make the decision."* Architecture decisions —
  **including ratifying an ADR** — are Architect/Design's, and `ADR-0004` stopped being the
  exception that day. The rest of the ground — `context.human_admission` is `off` — is true and
  **irrelevant here**: that flag governs `finding` notes and `§14-gate` stamps, never an ADR's
  `Status` line. `ADR-0005`, `ADR-0006`, `ADR-0009`, `ADR-0010` and `ADR-0011` are all `accepted` by
  Architect/Design with that flag off.
- **Ground (2) — *"it binds the ticket shape of three epics"*. REAL, AND STILL NOT THE OWNER'S.**
  The owner's own hedge ("in most cases") reserves to him decisions that **change what the product
  promises a user**, **spend money**, or **trade away a stated commitment**. This decision does none
  of the three: `EPIC-005` already promises the book and `EPIC-004` already promises the search, and
  this rules only **where the composition sits**. It adds **zero production lines**, moves no NFR
  target, sets no level and measures nothing — which is `ADR-0009`'s own accepted test, met.
  Binding three tickets' shape is not a product promise; it is structure, which is the thing the
  owner delegated because he cannot verify it.

**One thing this ratification deliberately does NOT do: it does not require `ABC-078` to change.**
Clause 5 is the load-bearing sentence and it was re-checked at `main` `3054ee0` before signing —
`A6`'s byte-identical pin on `src/turn-loop.ts` stands, and this ADR requires zero bytes of that
file. Had it required one, the ruling would have stopped and escalated to the owner rather than
signed.

### What would falsify this ADR — owed by the role that ratifies it

| clause | falsified by |
|---|---|
| 2 | an `EPIC-005` decorator that cannot be delivered without editing `src/turn-loop.ts` or an `EPIC-004` module — measured, not argued, by `ABC-095` `A6`'s **0 changed lines** assertion going red |
| 3(a) | a book move reaching `playMove` on any path that does not pass `wasGenerated` — measured by `ABC-094` `A6`'s illegal-entry case driven through `runTurnLoop` |
| 3(b) | the decorator needing an RNG it did not receive as a parameter — measured by `ABC-086` `A4`'s no-`Math.random` diff scan |
| 6(c) | `ABC-095` `A1`/`A3` proving unwritable with a counting stub passed as the **inner** seam |
| 5 | any `ABC-078` criterion having to change. **That is an escalation to the owner, never an amendment made here.** |

### AMENDED at ratification — clause 9 is DISCHARGED, and two anchors re-measured

- **Clause 9 is spent, not pending.** It said `src/cli.test.ts:738` asserts `productionModules()` has
  length **23** and recommended `ABC-103` before `ABC-078`. **`ABC-103` merged and closed
  2026-08-18.** At `main` `3054ee0` the count is **computed**: `productionModules()` at
  `src/cli.test.ts:51` reads `src/` with `readdirSync`, filters `.ts` that are not `.test.ts`, and no
  literal length assertion remains. **The collision clause 9 predicted cannot occur**, and neither
  `ABC-078`'s nor `ABC-095`'s module reds that guard on arrival.
- **Clause 8 is unaffected and its premise re-measured.** The guard still reads `src/`
  **non-recursively**, so a module in `src/engine/` or `src/book/` would still fall outside it —
  which is the whole of clause 8's argument. Production modules at `3054ee0`:
  `ls src/*.ts | grep -v '\.test\.ts$' | wc -l` → **23**, unchanged from the proposing hop.
- **`EngineSeam` re-measured at `3054ee0`**: `src/turn-loop.ts:138`
  `export type EngineSeam = (history: GameHistory) => Promise<Move>;`, exact; `TurnLoopOptions.engine`
  at `:150`.

## Context

### The question, in BA/PM's words

> When `EPIC-005`'s opening book and `EPIC-004`'s search both want to answer *"what move do I play in
> this position"*, which of them owns `EngineSeam`, and does the composition happen BEHIND the seam
> or IN FRONT of it?

Three shapes were surfaced and none picked: (1) book wraps engine behind the merged seam; (2) book
precedes engine in front of the seam, which would touch `src/turn-loop.ts`; (3) the seam grows a
skip-the-book flag or a composition parameter.

### What is already merged, read at source at this hop

- **`EngineSeam` is a FUNCTION TYPE**, `src/turn-loop.ts:138`:
  `export type EngineSeam = (history: GameHistory) => Promise<Move>`. It is not a class, not an
  interface with one implementation, and not an object with methods. **This single fact dissolves
  most of the question** — see clause 1.
- **`src/turn-loop.ts` has 0 production importers.** `runTurnLoop` is reached only from
  `src/turn-loop.test.ts`, `src/turn-loop.nfr.test.ts` and `src/render-seam.test.ts`. `src/cli.ts`
  says so in its own header: *"no `EngineSeam` implementation exists, so `runTurnLoop` is
  `ABC-043`'s."*
- **The engine branch of the loop already validates whatever the seam returns.**
  `wasGenerated(history, move)` runs on every engine move before `playMove`, and a false returns
  `{ result: null, reason: "engine-failure" }` rather than corrupting the board
  (`src/turn-loop.ts`, transition 13). A throw is caught, `takeBack(history, 0)` replays the
  position from `initialFen`, and the loop returns `engine-threw` (transition 12).
- **`src/search.ts` is `search(position: Position, depth: number): SearchResult`.** It takes a
  `Position` and a depth; `EngineSeam` takes a `GameHistory` and no depth. **`ABC-077` therefore
  does not satisfy `EngineSeam` and was never meant to** — `ABC-078` supplies the adapter, and its
  `A6` says the adapter *"is assignable to `EngineSeam` as declared"* with `src/turn-loop.ts`
  **byte-identical**.
- **`src/render-seam.ts` is the merged precedent for exactly this shape.** It is a module whose only
  job is to BE `ABC-019`'s published `RenderSeam` — *"the returned function's type is IMPORTED from
  `src/turn-loop.ts` rather than re-spelled here, so `EPIC-006`'s `runTurnLoop({ render })` needs no
  adapter and no cast"* — built by a factory (`makeRenderSeam(mode, orientation)`) that binds its
  configuration once, at construction, as values. Neither `turn-loop.ts` nor any panel knows it
  exists. **The engine side is the same problem and gets the same answer.**
- **`src/cli.test.ts:738` asserts `productionModules()` has length 23**, over every non-`.test.ts`
  file directly in `src/`. There are 23 today. `ABC-103` is the cut ticket for that hard-coded count.

### What the tickets already commit to

- `ABC-078` `A6`: assignable to `EngineSeam` as declared, driven end to end by `runTurnLoop`, and
  **`src/turn-loop.ts` byte-identical**.
- `ABC-095` `A1`/`A3`: `EPIC-004`'s search entry point called **exactly 0** times on a book hit and
  **exactly 1** on a miss — a **spied call count**, never a clock. `A6`: **0 changed lines** in
  `EPIC-004`'s search / evaluation / ordering modules, *"and this criterion is the subject boundary,
  written as a test."* Its `## Dependencies` names three sub-unknowns: the `EPIC-004` ticket id,
  whether the seam is **wrappable from outside**, and whether it is **spy-able**.
- `ABC-094` `A6`: a book file carrying *"a move that is **illegal** in its keyed position"* **must
  never be handed onward as a move**.
- `ABC-086` `A4`: no `Math.random` / `Date.now` / `performance.now` in the delivered `src/` diff
  outside the injected time source. `A6`: the seed is **threaded, not global**.
- `ABC-043` (`EPIC-006`): `runTurnLoop` is called **exactly once**, with `ABC-041`'s `RenderSeam`,
  `ABC-037`'s `InputSeam`, **an `EngineSeam`**, and `process.stdout`. This is the composition root
  and it is already cut.

## Decision

### Clause 1 — "behind the seam" and "in front of the seam" is a FALSE DICHOTOMY, and that is why the question felt unanswerable

`EngineSeam` is a function type. A function `withBook(probe, inner: EngineSeam): EngineSeam` is
**simultaneously behind the seam and in front of the search**: `runTurnLoop` sees one `EngineSeam`
and cannot tell the difference, while the book runs strictly before `search` is entered and, on a
hit, `search` is never entered at all. BA/PM's shapes 1 and 2 both describe composition and differ
only in **which existing function does the composing**. The answer is: **neither** — a third
function, owned by neither epic's core module.

### Clause 2 — the ruling

**The book is a DECORATOR of `EngineSeam`: `EngineSeam → EngineSeam`.**

1. **`EPIC-004` (`ABC-078`) delivers a factory that returns an `EngineSeam`** and knows nothing about
   any book. Its type is IMPORTED from `src/turn-loop.ts`, never re-spelled — `src/render-seam.ts`'s
   rule, applied to the other seam.
2. **`EPIC-005` (`ABC-095`) delivers a separate module exporting a decorator** that takes the book
   probe and an **inner `EngineSeam`** and returns an `EngineSeam`. On a hit it returns the book
   move and **never calls the inner seam**. On a miss, on no book, or on any probe failure it
   **returns `await inner(history)` and nothing else happens**.
3. **`EPIC-006` (`ABC-043`) composes them**, at the one place that already builds every other seam:
   `engine: withBook(probe, makeEngineSeam(...))` where today it will write
   `engine: makeEngineSeam(...)`.
4. **`src/turn-loop.ts` is not modified. `EngineSeam` is not modified. `EPIC-004`'s search,
   evaluation and ordering modules are not modified.**

### Clause 3 — the two structural properties this buys, which are the real reasons and not restatements of clause 2

**(a) The book move is validated by machinery that already exists, for free.** A decorated seam's
return value goes through `wasGenerated` in transition 13 exactly like a search move. A book entry
that is illegal in its keyed position — `ABC-094` `A6`'s named hostile case — reaches `playMove`
through **no** path: the loop returns `engine-failure` and the board is untouched. `ABC-094`'s own
re-validation is the first line and this is the second, and the second costs zero new code. **Any
shape that puts the book beside the engine rather than behind it has to duplicate that guard or go
without it.**

**(b) The seeded randomness is threaded, not ambient, by construction.** The decorator's RNG is a
parameter of its factory, bound once at the composition root, alongside whatever seed `ABC-086`
threads into the engine. That is `ABC-086` `A6`'s "threaded, not global" shape without anyone having
to arrange it. **Determinism therefore ARGUES FOR this placement and against the alternatives** —
see clause 4(b).

### Clause 4 — the two rejected shapes, and why each fails

**(a) Shape 2 — book precedes engine, in front of the seam, inside `runTurnLoop`. REJECTED, three
independent failures.**

1. It requires editing `src/turn-loop.ts`, which **collides head-on with `ABC-078` `A6`'s
   byte-identical pin** on a ticket that is about to be pulled.
2. **Worse, and the reason that stands even if `A6` were re-cut:** it re-opens a merged, mutation-
   tested eight-state machine. The book path would need its own copy of transition 13's
   `wasGenerated` guard and transition 12's `takeBack` repair, or it would go without them — and
   going without them is exactly the corruption `ABC-094` `A6` forbids. Two guards where there is
   one is two things to get wrong.
3. It makes `EPIC-002`'s turn loop know about `EPIC-005`. The module's own header is built on the
   loop deriving nothing and deciding nothing beyond the claim adjudication; `ADR-0009` clause 9b
   already refused this exact coupling on the frame path — *"frame composition ENTIRELY behind one
   render seam"* — and there is no reason the engine path deserves the opposite answer.

**(b) Shape 3 — grow the seam: a skip-the-book flag or a composition parameter. REJECTED, three
independent failures.**

1. **It is a contract change on a merged type**, and the expensive one BA/PM correctly named. It
   breaks `ABC-078` `A6` and touches three merged test files that spell `EngineSeam`.
2. **It inverts the dependency.** A `skipBook` parameter means `runTurnLoop` — or `TurnLoopOptions` —
   holds book policy, and the loop holds no policy about anything. A seed parameter for the book's
   weighted choice would land in `TurnLoopOptions` for the same reason, which is `ABC-086` `A6`'s
   "global" failure wearing a struct.
3. **Nobody has asked for the flag.** Coding rules 5 and 7. No cut ticket needs to skip the book:
   `ABC-095` `A5` covers "no book at all" by the artifact being absent, `ABC-094` `A1` covers "out of
   book" by the probe returning nothing, and `ABC-096` needs to READ what the book did, not to
   suppress it — see clause 7. A parameter with no caller is unrequested flexibility on a merged
   contract.

### Clause 5 — `ABC-078`'s `A6` is UNCHANGED. Pull the ticket.

**This ruling requires zero bytes of `src/turn-loop.ts` and no change to any `ABC-078` criterion.**
`A6` stands exactly as written and is **strengthened in role**: it is now the criterion that protects
the composition point, not merely a tidiness clause. `A1`–`A5` and `A7` are untouched. `ABC-078`
costs `EPIC-005` nothing and `EPIC-005` costs `ABC-078` nothing, which was the outcome its
`## Dependencies` bullet hoped for and could not assert.

**One piece of `ABC-078` prose is now stale and it is NOT a criterion.** Its `## Dependencies` bullet
ends *"Owner: whoever decides the `EPIC-005`/`EPIC-004` composition point. Flagged, not designed."*
That owner is named and the decision is taken. **The refresh is BA/PM's pen and is recommended, not
made here.** DoR item 5's ⚠️ on that ticket was raised for this unresolved question; whether it
clears is BA/PM's call.

### Clause 6 — three answers `ABC-095` was cut without, and the third blocker it did not know it had

`ABC-095`'s `## Dependencies` names three unknowns about `EPIC-004`'s entry point. All three are now
answerable from the tree plus this ruling:

- **(a) its ticket id — `ABC-078`.** Read from `plans/tickets/`, not guessed.
- **(b) wrappable from outside — YES**, by construction: `EngineSeam` is a function type and
  `ABC-078` `A6` requires the implementation to be assignable to it.
- **(c) spy-able — YES**, and more strongly than the ticket hoped. The decorator takes the inner
  seam **as an argument**, so `A1`/`A3` pass a counting stub as the inner seam and need no module
  mocking at all. `ABC-095` test note 1's failure case — *"if the search is called through a closure
  the caller cannot see, `A1` is unwritable"* — **cannot occur** under this shape.

Consequently `ABC-095`'s `S` size holds (it was conditional on *"the assumption that the seam is a
wrappable function"*), and `A6`'s **0 changed lines in `EPIC-004`'s modules** is satisfiable rather
than a stop condition.

**The blocker it did not know it had.** `ABC-095`'s scope says *"two or three call sites"*. Under
this ruling one of those call sites is **`ABC-043`'s composition root**, which does not exist:
`src/turn-loop.ts` has 0 production importers today. `A1`, `A3` and `A6` are satisfiable **without**
it, by wiring the decorator in a test; `A4` and `A5` are satisfiable by driving `runTurnLoop`
directly, as `src/turn-loop.test.ts` already does. **So `ABC-043` does not block `ABC-095`'s
criteria — it blocks `EPIC-005`'s user value**, because until it lands no human's game consults the
book. **Whether `ABC-095` owns that one wiring line or `ABC-043`/`EPIC-006` does is BA/PM's boundary
to draw**, and it is flagged here rather than drawn.

### Clause 7 — what this ruling deliberately does NOT solve, stated so it is not discovered as a surprise

**`ABC-096` (show the named opening) cannot learn the opening name through the seam.** `EngineSeam`
returns a `Move` and carries no book metadata, and clause 4(b) forbids widening it to carry any.
`ABC-096` must consult the probe directly — it is a pure position-keyed lookup, so a second read is
cheap and side-effect-free — or `EPIC-006` must hold the probe as a value the status path can also
read. **This is a consequence of the ruling and must not be solved by growing `EngineSeam`.** It is
`ABC-096`'s design, at `ABC-096`'s `In Design`, and it is `P3`.

### Clause 8 — the new modules land FLAT in `src/`, and this clause exists because two instruments depend on it

`ABC-078`'s engine-seam module and `ABC-095`'s decorator module go **directly in `src/`**, not in a
`src/engine/` or `src/book/` subdirectory, matching all 23 existing production modules.

**This is not taste.** `ADR-0011` clause 1's amendment records that the clause says *"under `src/`"*
while both of its instruments read `src/` **non-recursively** — *"a module in `src/engine/` that
imports `history.ts` is a runtime importer and must be inside clause 3's reach"*, and today it would
not be. A subdirectory would put the two newest production modules **outside the reach of `NFR-002`'s
frame-path guard and `ADR-0002` clause 4's single-supplier regex** while every existing assertion
stayed green. The boring placement keeps the instruments honest; the tidy one silently disarms them.

### Clause 9 — `ABC-103` lands before either module, or both hops open red

`src/cli.test.ts:738` asserts `productionModules()` has length **23**. This ruling adds **at least
two** production modules — one from `EPIC-004`, one from `EPIC-005` — and clause 8 puts both inside
that guard's flat read. **Each one reds `src/cli.test.ts` on arrival**, on an assertion that has
nothing to do with either ticket. `ABC-103` is already cut for exactly this defect. **Recommended
sequencing: `ABC-103` before `ABC-078`.** This clause records the collision; the sequencing call is
the Orchestrator's.

## Alternatives

The two rejected shapes are ruled in clause 4 with their failure modes; they are not restated here.
One further alternative was considered and dropped:

**The wrap placed INSIDE `EPIC-004`'s engine-seam module** — i.e. `makeEngineSeam({ book })`. This is
the literal reading of BA/PM's shape 1 (*"book wraps engine"*) and it satisfies "behind the seam" and
"`turn-loop.ts` unchanged" perfectly, which is what makes it the dangerous one. **It fails `ABC-095`
`A6` by definition**: the book cannot be consumed without changing `EPIC-004`'s delivered module, so
the criterion the ticket calls *"the subject boundary, written as a test"* fires and the ticket stops.
It also makes `ABC-078` — a `P0` on the critical path, blocking `ABC-074` — depend on an unbuilt
`P1` epic. **Shape 1 is the right answer only when the wrapper is a THIRD module owned by neither
epic's core.** That distinction is the whole content of clause 2 and it is why this ADR does not
simply say "shape 1".

## Consequences

- **Zero production lines are added by this decision**, and no NFR target, bar, level or verification
  instrument moves. `plans/nfr-catalog.md` is **not edited**: `NFR-004`'s row is `EPIC-004`'s and
  `ABC-095` already carries the consumed-not-owned bars (≤ 30 ms hit, ≤ 5 ms miss). Adding a row for
  a decision that measures nothing would be the gold-plating this catalog's own rules refuse.
- `ABC-078` is unblocked in respect of this question and its criteria are untouched (clause 5).
- `ABC-095`'s `G3` is closed and three of its unknowns are answered (clause 6); its DoR is **BA/PM's
  to re-score and is not touched here**.
- `ABC-043` gains one line when `EPIC-005` lands, and gains it in the file it already owns.
- The lane cost is one new production module per epic and the test files their own tickets already
  budget. **`NFR-008` is not moved by this ADR; it is moved by `ABC-103` not landing first**
  (clause 9).
- **`G4` — two epics, one seeded-randomness seam — is NOT closed by this ADR.** It is a different
  question: `G3` asks *where composition sits*, `G4` asks *who owns the RNG*. Clause 3(b) makes `G4`
  **cheaper** to answer either way, because both seeds are now injected at one place and neither
  epic's core module holds one. It remains Architect/Design's, owed **before either `ABC-094` or
  `EPIC-004`'s search ticket enters `In Development`**, and it needs its own hop.

## Rollback

Cheap, and that is a property of the shape rather than a promise. The decorator is one module with
one exported function and one call site at the composition root.

- **To un-rule it before anything is built:** delete this file. No code exists that depends on it.
- **To back it out after `ABC-095` ships:** delete the decorator module and revert the one line at
  the composition root to `engine: makeEngineSeam(...)`. The game plays search-only, which is
  `ABC-095` `A5`'s already-tested behaviour, and `EPIC-004` is untouched because it never knew.
- **The one thing that is NOT cheap to reverse is clause 4(b)'s refusal.** Once `EngineSeam` grows a
  parameter it is a merged contract with production importers and every consumer moves with it.
  Refusing it costs nothing today and adding it later remains possible; the reverse is not true.
