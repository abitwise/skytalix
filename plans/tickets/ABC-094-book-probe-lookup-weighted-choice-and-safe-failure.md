---
id: ABC-094
title: The book probe — look a position up, pick a weighted book move under a fixed seed, and degrade to "no book move" on a missing or corrupt file without ever throwing
status: in-development
column: In Development
size: M
priority: P1
epic: EPIC-005
feature: —
---

# ABC-094 — the read side, built and proved with no engine in the room

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-005`, Workflow 03) from
> `plans/epics/EPIC-005-opening-book.md` § Scope bullets 3–4 and § Acceptance bullets 2 and 4.
> **This ticket is deliberately split from the wiring (`ABC-095`) so that everything about the book
> that does NOT need `EPIC-004` can be built and proved while `EPIC-004` is still being cut.**
> The reasoning for that split is in `.grugops/context/epic-to-tickets-EPIC-005/notes/`.

## Problem

*User*: the player, twice over — once when the book gives them a real opening instantly, and once
when a book file they never asked about is truncated on disk and the game **must not** die.

*Pain*: `EPIC-005`'s two hardest acceptance clauses are both about the read side and neither is
about the engine. *"Ten fresh games where the human plays `e4` … at least three distinct book
replies appear"* is a property of the **picker**. *"The book file is missing or corrupt … it plays
on using search alone and warns once — it never crashes"* is a property of the **loader**. A book
that is only exercised through a finished engine gets both of these tested last, on the day they
are most expensive to get wrong.

*Value*: a pure module — position in, book move or nothing out — that can be exhaustively tested
today against `ABC-093`'s artifact, with **no engine, no search, no time budget and no `EPIC-004`
seam**. When `EPIC-004` lands, `ABC-095` is a wiring hop rather than a design hop.

## Scope

- **A book-probe module** exposing, at minimum: *is this position in the book*, and *give me a book
  move for this position* — returning **nothing** (not an exception, not a sentinel move) when the
  position is out of book. *(Folded 2026-10-10, `ADR-0037` D1: the lookup key is 16 hex digits of
  `zobristKey(position)`, or the last element of `keyHistory(history)`. "In book" means the entry's
  `m` is non-empty.)*
- **Weighted random selection** among the book's moves for that position, driven by an **injected**
  randomness source so a fixed seed makes the choice reproducible (`EPIC-005` § Test notes:
  *"assert book lookup is deterministic under a fixed seed"*). *(Folded 2026-10-10, `ADR-0037` D2:
  the factory takes `random: () => number`, values in [0, 1), and the module imports no generator.
  Tests build it from `seededRandom(seed)` (`src/levels.ts:61`). No book generator of its own, in
  production or in tests.)*
- **Loading the artifact**, including the decision of *when* it is loaded (see § Security / NFR —
  `N-LOAD`).
- **Safe degradation**: file missing, unreadable, truncated, empty, or structurally wrong → the
  probe reports *no book* and **warns exactly once per process**, and every subsequent call is
  silent and still returns nothing.
- **Optional** *(folded 2026-10-10)*: a read-only name accessor for `ABC-096`, reading the entry's
  `n` (`ADR-0037` D1(d)).

## Out of scope

- **Anything to do with the search, the engine, evaluation, ordering or the time budget.** That is
  `EPIC-004`'s and this ticket must not touch it. **If the probe appears to need a change to the
  engine's seam, STOP** — that is `ABC-095`'s dependency, not this ticket's work.
- **Wiring the probe into a turn.** `ABC-095`'s, blocked on `EPIC-004`.
- **Building or changing the artifact or its format.** `ABC-093`'s.
- **Displaying the opening name.** `ABC-096`'s — though this module may expose the name it reads.
- **Any network call, ever.**

## Acceptance (Given/When/Then)

- **`A1` (in book → a legal book move; out of book → nothing).** **Given** the delivered artifact,
  **when** the probe is called on the start position, **then** it returns a move that is in
  `legalMoves(startpos)` and is one of the artifact's entries for that position; **when** it is
  called on a position not in the book, **then** it returns **nothing** and **throws 0 exceptions**.
  *(Folded 2026-10-10 at the re-score, on the merged artifact: "not in the book" has **two** shapes,
  and the test covers both. One is a key that is absent. The other is a key that is present with an
  empty `m`. The delivered `book.json` has **1,764** entries of the second shape, kept for their `n`.)*
- **`A2` (deterministic under a fixed seed).** **Given** the same position, the same artifact and
  the same seed, **when** the probe is called **100** times in two separate processes, **then** the
  two sequences of 100 chosen moves are **identical, element for element**.
- **`A3` (variety — the behavioural half of the epic's ten-games criterion).** **Given** the
  position after `1. e4` and **ten** distinct seeds, **when** the probe is called once per seed,
  **then** the number of **distinct** replies across the ten calls is **≥ 3**. *(The data half is
  `ABC-093` `A4`; this criterion fails honestly if the picker collapses onto one move even with a
  rich entry.)* *(Folded 2026-10-10 at the re-score: **the ten seeds are the integers 1 to 10**,
  named here so that nobody can shop for seeds. On the merged artifact the line-count weights give
  `e7e5` 50.9% of the 19 replies. A correct picker then reads fewer than 3 distinct replies on about
  **4.7%** of ten-seed blocks (BA/PM probe, 10,000 disjoint blocks). A cumulative picker that walks
  `m` in file order reads **4** distinct replies on seeds 1 to 10. If a correct picker reads fewer
  than 3 on these seeds, record it and route it to BA/PM. Do not swap the seeds.)*
- **`A4` (the weights are actually used).** **Given** a fixture entry with weights in ratio
  **8 : 1 : 1**, **when** 1,000 draws are taken from a named fixed seed, **then** each move's share
  is within **±5 percentage points** of its weight. *(Deterministic given the seed, so this is an
  exact repeatable check and not a flaky statistical one. Re-record the expected counts if the seed
  or the RNG changes — do not widen the tolerance.)*
- **`A5` (missing file: no crash, one warning).** **Given** the artifact absent from disk, **when**
  the probe is constructed and then called **50** times, **then** it throws **0** exceptions,
  returns nothing **50** times, and emits **exactly 1** warning — on **stderr**, never stdout.
  *(stdout is the board; `ABC-042`'s stream discipline applies.)*
- **`A6` (corrupt file: same outcome, across a named matrix).** **Given** each of at least these
  five inputs — empty file, truncated mid-record, valid container with a garbage payload, valid
  structure with a move that is **illegal** in its keyed position, and a file **larger** than
  `NFR-006`'s 1 MB bar — **when** the probe is constructed and called, **then** for **each** input
  it throws **0** exceptions, returns nothing or only legal moves, and emits **exactly 1** warning.
  **The illegal-move case must never be handed onward as a move.** *(Folded 2026-10-10, shapes under
  `ADR-0037`'s JSON format. "Truncated mid-record" is JSON text cut mid-entry, so `JSON.parse` fails.
  "Valid container, garbage payload" is valid JSON that fails the schema, for example a key that is
  not 16 hex digits, or an `m` that is not a list of `[uci, positive integer]` pairs. "Illegal move"
  is a schema-valid UCI that is not in `legalMoves`.)*
- **`A7` (nothing is executed and nothing is fetched).** **Given** the delivered module, **then**
  it contains **0** occurrences of `eval`, `new Function`, and dynamic `import()`/`require()` of the
  artifact path, and makes **0** network calls. Asserted structurally, not by inspection.

## Dependencies

- **`ABC-093` — HARD BLOCKER for `A1`–`A4`.** There is no artifact to read until it lands. **`A5`
  and `A6` are the exception**: they are about the *absence* of a good artifact and can be written
  first — see test note 2.
  - **2026-10-10 re-score: SATISFIED.** `ABC-093` merged at `ac83c3fd` (QE `PASS_WITH_GAPS`; none of
    its gaps touches this ticket). At `a7e25407` the artifact is `data/opening-book/book.json`,
    356,526 B, sha256 `3802f52f…41d`. The compiler writes only that path
    (`tools/opening-book/compile.ts:145`). Every premise above matches the file:
    - `format` 1, `maxPly` 12, and `attribution` `"ATTRIBUTION.md"`;
    - 5,390 keys, all 16 lowercase hex digits;
    - entries carry only `m` and `n`;
    - 5,825 `[uci, weight]` pairs, all positive safe integers;
    - 3,626 entries in book and 2,853 named;
    - the start position has 20 entries, all in `legalMoves`;
    - after `1. e4` there are 19 replies, and the entry's `n` is "King's Pawn Game".
  - **UCI text.** The only `toUci` is in `tools/opening-book/compile.ts`. That file imports `node:fs`
    and is not production. **The probe must not import it.** Format UCI from `src/position.ts`'s
    `squareName` instead, or match against `legalMoves`.
- **`EPIC-001` — satisfied** (`legalMoves`, `zobristKey`, `parseFen` on `main`, read at this hop).
- **`EPIC-004` — NOT a dependency.** This ticket is pullable, buildable and closable with no engine
  in existence. **That is the point of the split and it should not be undone by folding this into
  `ABC-095`.**
- **The seeded-randomness seam is this project's FIRST production randomness source.** `src/` today
  has none; the only seeded generator on record is the LCG inside `src/history.test.ts:81-89`, a
  test fixture. **Whether the seam is a parameter, a module-level injected function, or something
  `EPIC-004` will also want for its blunder-rate difficulty levels is Architect/Design's call, and
  it is flagged rather than taken here** — `EPIC-004` § Scope has *"difficulty levels that map to a
  search budget plus a blunder rate"* and *"reproducible under a fixed seed"*, so **two epics want
  one seam**. Recorded, not resolved. See § gaps in my notes.
  - **2026-10-10 re-score: the premise is STALE.** `ABC-087` merged (`b696d8e8`) the project's first
    production generator. It is `seededRandom(seed): () => number` (mulberry32) at
    `src/levels.ts:61`, with per-instance state and no module-level state (`ADR-0027` decision 2).
    `ADR-0012` clause 3(b) makes the decorator's RNG a factory parameter bound at the composition
    root. Security/NFR rules the generator not a CSPRNG and of no security relevance for move choice
    (`secnfr-ABC-087` `…3f1974f5` row 5). **So the "two RNGs" risk is now avoidable rather than
    open.**
  - **`G4` RULED 2026-10-10 (`ADR-0037` D2, `accepted`).** The probe takes an injected
    `random: () => number`. `seededRandom` stays in `src/levels.ts`. No second generator is written
    for the book. `G4` is closed.

## Security / NFR triggers

- **`N-LOAD` (new, this ticket's own bar, and it is an `NFR-007` interaction).** `NFR-007` is
  *"`npx` invocation to first rendered board in < 2 s"*. **If the book is loaded eagerly at process
  start, its read and parse land inside that window**; if it is loaded lazily on the first engine
  turn, they do not. **Bar: the probe's construction performs 0 filesystem operations, OR the
  measured load time of the delivered artifact is ≤ 100 ms (5% of `NFR-007`'s 2 s) on the reference
  machine Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64, `UNKNOWN - verify`
  elsewhere.** Either satisfies it; the engineer picks and **measures**, and `ABC-015`'s
  zero-filesystem bar is the precedent for the first form. *(2026-10-10: `NFR-007`'s denominator is
  now "`npm run chess` on a completed clone" (`ADR-0018`), not `npx`. The 2 s bar and this 100 ms
  derivation are unchanged.)* *(2026-10-10, informative: `JSON.parse` of the Architect's candidate
  artifact took about 3.5 ms, one reading on a loaded host (`ADR-0037`). The bar is still this
  ticket's to measure.)*
- **Probe cost against `NFR-004`.** The engine's budget is ≤ 3 s (5 s ceiling). **Bar: a book hit
  returns in ≤ 30 ms — 1% of the 3 s default budget — on the reference machine.** *(Derived from
  the ratified `NFR-004` target, not invented. The epic's "well under the search time budget" is
  given a number here so it can fail.)*
- **Hostile-input handling is the security content of this ticket, and it is real.** The artifact is
  the first file this program parses that no human typed. `A7` forbids every evaluation path;
  `A6`'s matrix is the input fuzz. **A book move must be re-validated against `legalMoves` before it
  is returned** — `ABC-093` `A2` proves the *shipped* book is clean, which is not the same as the
  *file on this disk right now* being clean.
  - *2026-10-10.* At `aaa88263`, **no production module under `src/` imports `node:fs`**. This
    probe's read is the first, and it fires `ADR-0036` clause (b1), so expect an `In Security/NFR`
    hop. `ADR-0012` clause 3(a) adds a second line of defence: the turn loop's `wasGenerated` refuses
    an illegal engine move.
  - *2026-10-10 fold.* At `4768b3b0` there are still 0 production `node:fs` importers. A probe that
    imports `node:fs` fires (b1) **and** becomes the fourth limb holder (after `cli.ts`,
    `glyph-mode.ts` and `perft-bench.ts`), which hits `ADR-0036` § Decision 3's trigger. **Engineer's
    choice, recorded unruled in `ADR-0037` § Consequences:** the probe may take an injected reader and
    warn sink instead. Then `src/cli.ts` binds the read, the holder set stays at three, (b) fires on
    `ABC-095` instead, and `A5`/`A6` run in memory. Either way the chain passes `In Security/NFR`
    once. D2 adds no limb.
  - *2026-10-10 re-score, at `a7e25407`.* There are still **0** production `node:fs` importers, and
    the limb holders in code are still `cli.ts`, `glyph-mode.ts` and `perft-bench.ts`. **`node:fs`
    is not the only limb that matters here.** `ADR-0036` (b1) fires on *any* Node builtin import
    and on any `process.` token. So these also make the probe a holder:
    - `process.stderr.write` for `A5`'s warning;
    - `node:url` or `node:path` to resolve the artifact's path.
    `console.error` and `new URL(…, import.meta.url)` hold no limb token. **The injected-reader
    branch keeps the probe limb-free only if the warn sink is injected too.**
- **`NFR-008` (lane ≤ 3 s wall / ≤ 13 s CPU; per-ticket ≤ 650 ms CPU).** `A2` asks for **two
  processes**, which is the expensive shape — `plans/nfr-catalog.md` measures a test file at
  159–179 ms CPU and this project already spawns 10 children. **Target: ≤ 2 new test files, ≤ 2 new
  spawned processes, ≤ 650 ms CPU added.** `A2` may instead be satisfied in-process by two fresh
  module instances if the seam allows — **cheaper and equally strong; prefer it.** *(2026-10-10:
  the CPU level is 15 s (`ADR-0019`). Under `ADR-0035` (accepted 2026-10-10, owner option R-1), the
  cost is read on the narrow set.
  The counts (≤ 2 files, ≤ 2 spawns) are the pins that hold either way.)*
- **`NFR-002`, `NFR-003` — not triggered.** No frame, no prompt.

## Test notes

1. **Test the picker against fixtures, not against the shipped book.** `A4`'s 8:1:1 ratio and
   `A6`'s corrupt matrix must be hand-built in memory or in a temp directory. **Do not mutate the
   checked-in artifact on disk** — the shared working tree and single git index have bitten four
   hops already; a test that leaves the repo dirty on failure is worse than the defect it hunts.
2. **`A5` and `A6` can and should be written BEFORE `ABC-093` delivers.** They describe behaviour
   when there is no good book, which is exactly today's state. **Write them first and watch them
   pass for the wrong reason** — a probe that always returns nothing passes both — then let `A1`–`A4`
   pin the other side.
3. **"Warns once" is a count, not a feeling.** Assert **exactly 1** over ≥ 50 calls, and assert the
   stream. A warn-per-call implementation passes any test that only checks "a warning appeared".
4. **Do not assert wall-clock inside the suite.** This project's standing rule
   (`plans/nfr-catalog.md`, repeatedly). The `N-LOAD` and 30 ms figures are measured **outside** the
   suite, on the reference machine, and recorded in the ticket's notes with their machine.
5. **`A3` is not a randomness test.** Ten fixed seeds, ten deterministic answers, one distinct-count
   assertion. If it ever flakes, the seam is leaking real entropy and that is the defect.
6. **(2026-10-10 re-score) Do not pin literal picks from the shipped book.** The owner's
   `WEIGHT_POLICY` veto (`ADR-0037` D1(c)) is open. If he flips it, the book is regenerated and every
   weight changes. Rules that keep the probe's lane green through that flip:
   - `A2` compares two runs with each other, not with a recorded list;
   - `A3` asserts the distinct count only;
   - `A4` runs on its own fixture.
   Under uniform weights `A3` only gets easier: 7 distinct replies on seeds 1 to 10, and 0% of
   blocks fail.
7. **(2026-10-10 re-score) Avoid the puzzle-suite trigger list.** Name the module outside
   `src/search*.ts` and `src/evaluate*.ts` (for example `src/book.ts`) and touch no engine file. Then
   `AGENTS.md`'s `PUZZLE_DEEP` trigger does not fire at QE.

## Lane cost — how many test FILES this ticket implies

**One or two.** Prefer one probe test file; add a second only if the corrupt-input matrix needs its
own temp-directory setup. Per `NFR-008`, the file count is the lever.

## Size and priority rationale

**Size `M`.** One new production module, a seeded-selection contract, a five-case hostile-input
matrix, and a load-timing decision that touches `NFR-007`. **Not `S`**: this introduces the
project's first production randomness seam and its first parse of non-human-authored data — two
firsts in one ticket. **Not `L`**: no existing module is modified, the surface is two or three
functions, and every dependency but `ABC-093` already exists on `main`.

**Priority `P1`.** Inherits the epic and is the largest piece of `EPIC-005` that can be delivered
while `EPIC-004` is unbuilt — **the highest-value thing this epic can do with the board as it
stands**. **Not `P0`**: no user sees it until `ABC-095`.

## Definition of Ready

**RE-SCORED 2026-10-10 by BA/PM after `ABC-093`'s merge** (task `wave-2026-09-25`, subtask
`bapm-rescore-abc094-2026-10-10`, at `a7e25407`). **Result: 10 of 10. Recommended column: `Ready`.**
The board move is the Orchestrator's. Readings are in
`.grugops/context/bapm-rescore-abc094-2026-10-10/notes/`.

- **Item 10 ⚠️ → ✅.** `ABC-093` is merged (`ac83c3fd`). Every premise was re-read against the
  delivered file, and all of them hold (§ Dependencies): the key format, the weights, `maxPly` 12,
  `n`, and 356,526 B.
- **Items 1–9 stay ✅.** Three clarifications were folded, and none of them changes the scope:
  - `A1` names its two out-of-book shapes;
  - `A3` names its seeds as 1 to 10;
  - test notes 6 and 7 were added.
- **Size `M` and `P1` hold.** The parse of non-human-authored data and the five-case hostile matrix
  are unchanged.
- **No `In Design` hop is owed.** D1 and D2 are ruled. Where the read sits (an injected reader, or
  the probe's own read) is the Engineer's call (`ADR-0037` § Consequences).
- **Gates.**
  - **UAT:** the owner's word, because the ticket adds a new `src/` module.
  - **`In Security/NFR`:** fires here under (b1) if the probe holds any limb (§ Security / NFR,
    re-score bullet). With an injected reader **and** an injected warn sink it fires on `ABC-095`
    instead.
  - **`PUZZLE_DEEP`:** not triggered if test note 7 holds.
- **The owner's `WEIGHT_POLICY` veto stays open, and this ticket does NOT depend on the answer.**
  This holds as long as test note 6 is kept.
- **Overlap with `ABC-083` (In Development):** none by file. `ABC-083` touches `src/evaluate*` and
  search/transposition test files. This ticket adds one new module and one or two new test files.
  The only files both touch are the appended `plans/traceability.md` and the board.
- *Informative, not the bar:* reading and parsing the real artifact took 4.2 ms. 1,000 lookups and
  picks took 14.5 ms. Node v26.11.0, M3, load1 about 9.

**History. RE-SCORED 2026-10-10 by BA/PM at the fold** (task `wave-2026-09-25`, subtask
`bapm-fold-book-chain-2026-10-10`, at `4768b3b0`; `ADR-0037` folded per `…d06f5ba8`). **Result: 9 of
10, ⚠️x1 (item 10). It stays in `Backlog`.** Readings:
`.grugops/context/bapm-fold-book-chain-2026-10-10/notes/`.

- **Item 5 ⚠️ → ✅.** `G4` is ruled (`ADR-0037` D2), and the format gives `A6`'s matrix its shapes.
- **Item 10 ⚠️ STANDS, ordering only.** `ABC-093` is unbuilt, so `A1`–`A4` have nothing to read.
  **Re-score trigger: `ABC-093`'s merge.** Nothing else is open.
- **Items 1–4 and 6–9 stay ✅.** Size `M` and `P1` hold.
- **Production and UAT.** A new `src/` module, so **the owner's UAT word**. `In Security/NFR` fires
  here through (b1) if the probe reads the file itself, or on `ABC-095` if it takes an injected reader.

**History. Re-scored 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `rescore-p1-backlog-2026-10-10`,
at `aaa88263`). **Result: 8 of 10, ⚠️x2. The score is unchanged and both ⚠️ narrowed. It stays in
`Backlog`.** Readings: `.grugops/context/rescore-p1-backlog-2026-10-10/notes/`.

- **Item 5 ⚠️ STANDS, narrowed.** The generator exists (`src/levels.ts:61`). What is left is `G4`'s
  one placement question (§ Dependencies). It goes to Architect/Design in the same `In Design` hop
  as `ABC-093`'s format. `A6`'s corrupt matrix ("truncated mid-record", "valid container") also
  takes its shape from that format.
- **Item 10 ⚠️ STANDS.** `ABC-093` is unbuilt, so `A1`–`A4` have nothing to read. `A5` can still be
  written first (test note 2). `A6` waits for the format, not for the artifact.
- **Items 1–4 and 6–9 stay ✅.** Size **`M` holds**, even though one of its "two firsts" (the
  randomness seam) has gone. The first production file parse and the first production `node:fs`
  read remain, along with the five-case hostile matrix. **`P1` holds.**
- **Production and UAT.** It adds a new non-test module under `src/`, so it **needs the owner's UAT
  word**. Expect an `In Security/NFR` hop (`ADR-0036` (b1)).
- **Overlaps.** None by file with `ABC-083`, `ABC-010`, `ABC-131`, `ABC-141`, `ABC-138` or
  `ABC-140`.

**History. Assessed 2026-08-16** against `agent-factory/checklists/definition-of-ready.md` by BA/PM
at the cutting hop. **Result: 8 of 10 — items 5 and 10 carry a ⚠️; the other eight are MET.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** user, pain and value stated; the two epic acceptance clauses this ticket owns are quoted |
| 2 | scope and out-of-scope clear | **✅** four in, five out; the engine boundary is stated as a STOP, not a preference |
| 3 | INVEST-shaped | **✅** independent of `EPIC-004` entirely; testable; `A5`/`A6` are testable before its own blocker lands |
| 4 | acceptance testable and measurable | **✅** seven criteria on counts: 100 identical picks, ≥ 3 distinct of 10, ±5 pp over 1,000 draws, exactly 1 warning over 50 calls, 5 corrupt inputs, 0 exceptions, 0 eval sites |
| 5 | dependencies known | **⚠️** all named — but **the randomness seam is wanted by `EPIC-004` too** (blunder-rate difficulty, reproducible-under-seed) and **who owns it is not decided here.** Not a blocker; it must be ruled at `In Design` or the two epics will ship two RNGs. |
| 6 | security/NFR triggers with a measurable target | **✅** `N-LOAD` 0 fs ops or ≤ 100 ms; probe ≤ 30 ms (1% of `NFR-004`'s 3 s); `NFR-008` ≤ 650 ms CPU / ≤ 2 files / ≤ 2 spawns; the re-validate-before-returning rule |
| 7 | test notes present | **✅** five, including "write `A5`/`A6` first and watch them pass for the wrong reason" |
| 8 | size assigned | **✅** `M`, with both re-size boundaries named |
| 9 | priority assigned | **✅** `P1`, with the reason it is not `P0` |
| 10 | no major unresolved blocker | **⚠️ ONE, ordering.** `ABC-093` must deliver the artifact before `A1`–`A4` can be closed. `A5`/`A6` are not blocked. **Not an `EPIC-004` blocker — this ticket has none, and that is its headline property.** |

## Delivery

**2026-10-10, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-094`).
- Branch `grugops/ABC-094-book-probe`, from `97223dfe`. Code commit `8cf395fc`: `src/book.ts` (production,
  +153) and `src/book.test.ts` (+359, 26 tests). Not merged, not pushed.
- Readings and calls live in `.grugops/context/ticket-to-pr-ABC-094/` (`…d14f72cb` decision, `…77180424`
  readings, `…93e5f38e` artifact-ref, `probe/`) and are not restated here.

**`A1`–`A7` are met on the delivered tree, with one part handed on. No stop condition fired.**
- **The seam.** `createBookProbe({ read, warn, random })`. The reader and the warn sink are injected, as
  `random` is. So the probe holds no `ADR-0036` limb, and clause (b) **does not fire** here (instrument:
  0 / 0 / 0). It fires on `ABC-095`, where `src/cli.ts` binds the read and the sink.
- **`A5`'s stream half moves with the sink.** The probe writes to neither stream (0 calls, both spied). The
  stderr binding and its check are `ABC-095`'s.
- **`N-LOAD`** is MET in its first form: 0 reads at construction. A book hit is ≤ 0.88 ms against the 30 ms bar.
- **Cost (`ADR-0035`).** 1 file and 0 spawns. Both narrow-set readings were inadmissible on a loaded host, so
  a re-read is owed.
- **Gates.** UAT needs the owner's word. QE is owed.

## QE

**2026-10-10, QE/E2E** (subtask `qe-ABC-094`).
- Range: base `97223dfe`, code `8cf395fc`, reviewed tip `59358836`. QE commit `58726139` (test only).
- Every reading is QE's own. The detail is in `.grugops/context/qe-ABC-094/notes/` and is not restated here:
  `…a9a9fe1b` (verdict), `…62a73713` (readings), `…3058eacd` (gaps), `…19fb5b97` (probe).

**PASS_WITH_GAPS.**
- **`A1`:** a sweep of every reachable book key (all 5,390). Every in-book entry gives a legal move from its
  own `m`. Every empty-`m` entry and every absent key gives nothing. 0 throws.
- **`A2`:** QE ran it in two real processes, with 200 picks each, identical.
- **`A3`:** 4 distinct replies on seeds 1–10.
- **`A4`:** 796 / 106 / 98 on seed 42. An evenly spaced sweep lands exactly 800 / 100 / 100.
- **`A6`:** 89 corrupt inputs, each called 50 times. Each gives 0 throws, nothing or only legal moves, and
  exactly 1 warning.
- **`A7`:** 0 AST hits and 0 network calls.
- **`A5`** is met in the module. It gives 0 reads at construction, 0 throws, 50 × nothing, exactly 1 warning
  and 0 stdout writes. **Its "on stderr" half is `ABC-095`'s binding, and `ABC-095`'s page does not carry it
  yet** (`QE-094-a`, MEDIUM, BA/PM to fold into `ABC-095` `A5`).
- **Mutants.** The delivered suite left 8 of 34 non-equivalent mutants green. The most material is the
  dropped leading zero in the key, which affects 330 reachable keys. Also, the "no byte of the file" warning
  test was vacuous. QE added 9 tests to `src/book.test.ts`, and the final suite kills 32 of 34. The 2 left
  are equivalent (`QE-094-b`, CLOSED).
- **`ADR-0036` (b):** 0 / 0 / 0 on QE's run, so it does not fire here.
- **Overlap:** no file is shared with `ABC-083`.
- **Cost (`ADR-0035`):** reading 1 is admissible (twin 1.42 %, load1 median 4.93). It is MET at +0.345 s
  against 650 ms. Reading 2 is inadmissible (load1 median 9.43). 1 file, 0 spawns.
- **Gates at `58726139`:** lint, typecheck and build exit 0. `npm test` gives 54 files and 1,715 tests,
  green, with skip 0. Integrity and lane-inventory print "No findings."
- **Gaps:** `QE-094-c`–`g` are INFO.
- **UAT:** the owner's word is owed (production lines). On QE's reading, no Security/NFR hop fires here.
- Not merged, not pushed.
