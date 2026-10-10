---
id: ABC-093
title: Compile the selected opening lines into one static, checked-in, data-only book artifact — reproducibly, under 1 MB, with every move proved legal in its keyed position
status: in-design
column: In Design
size: M
priority: P1
epic: EPIC-005
feature: —
---

# ABC-093 — the artifact, and the compiler that can be re-run to reproduce it

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-005`, Workflow 03) from
> `plans/epics/EPIC-005-opening-book.md` § Scope bullet 2 and § Test notes.
> **The file format, the key and the compression are Architect/Design's — this page scores
> observables, never techniques**, and deliberately does not specify a format. Notes in
> `.grugops/context/epic-to-tickets-EPIC-005/notes/`.

## Problem

*User*: the engineer holding `ABC-094`, who needs something to read; and every later maintainer who
will be asked to regenerate the book when the source updates.

*Pain*: `EPIC-005` is *"research real opening theory now, compile it into a static file, ship it"*.
Today there is no file, no compiler, and **no way to tell a good book from a corrupt one** —
`EPIC-005` § Test notes names the failure mode precisely: *"a corrupt book entry would otherwise
surface as a crash mid-game"*. A book shipped without a legality proof is a runtime crash with a
long fuse.

*Value*: one checked-in artifact plus a re-runnable compiler is the whole supply chain of this
epic. It is buildable **today** — `parseFen` / `toFen` (`src/fen.ts`), `legalMoves` (`src/legal.ts`),
`apply` (`src/apply.ts`), SAN (`src/san.ts`) and `zobristKey` (`src/zobrist.ts`) are all on `main`
— and needs **nothing from `EPIC-004`**.

## Scope

- **A compiler**, run on demand (not in the test lane and not at runtime), that reads the source
  data chosen in `ABC-092` and emits **one** static book artifact checked into the repository.
- **The artifact**: keyed by position, carrying for each position its book moves and their
  selection weights, plus — where the source supplies it — the **name of the opening** the line
  belongs to (consumed by `ABC-096`; carried, not displayed, here).
- **The legality proof**: a check that every move in the artifact is legal in the position it is
  keyed to, over **100%** of entries.
- **A documented regeneration command**, added to `AGENTS.md`'s command table **only after it has
  been RUN** (that file's standing rule).
- **The attribution file `ABC-092`'s ADR names**, kept at the path that ADR names.

## Out of scope

- **Any runtime network call, and any network call at compile time other than a one-off manual
  fetch of the source the ADR names.** `EPIC-005` § Out of scope declines online explorers
  permanently.
- **An executable book.** The artifact must be **data**, loaded by parsing — never a `.ts`/`.js`
  module that is `import`ed or `require`d, and never anything evaluated. See § Security.
- **Reading the book at runtime.** `ABC-094`'s.
- **Wiring anything to the engine.** `ABC-095`'s, and blocked on `EPIC-004`.
- **Displaying the opening name.** `ABC-096`'s. This ticket only *carries* the name.
- **Book learning, deep coverage beyond the epic's 8–10 plies, tablebases.** Permanent non-goals.

## Acceptance (Given/When/Then)

- **`A1` (the artifact exists and is reproducible).** **Given** the compiler is run twice from the
  same source and the same options, **then** the two artifacts are **byte-identical** (`cmp` exit
  0). *(No timestamp, no map-iteration order, no absolute path in the output.)*
- **`A2` (every book move is legal — 100%, zero exceptions).** **Given** the delivered artifact,
  **when** every entry is checked against the position it is keyed to, **then** the count of moves
  **not** in `legalMoves(position)` is **0**, and the check reports the number of entries and moves
  it actually examined — **a check that examines 0 entries must fail, not pass**. See test note 1:
  a hashed key cannot be inverted, so the check replays from the start position.
- **`A3` (the depth the epic asked for, measured).** **Given** the delivered artifact, **then** the
  longest line reachable from the start position is **≥ 8 plies** and the artifact's recorded
  maximum depth is **≤ 12 plies**. *(`EPIC-005` § Out of scope: "roughly 8-10 plies … not a theory
  database" — the upper bound is a scope guard, and a book deeper than 12 plies fails this ticket.)*
- **`A4` (the variety the epic's own acceptance depends on is present in the DATA).** **Given** the
  delivered artifact, **then** the entry for the position after `1. e4` carries **≥ 3** distinct
  replies with non-zero weight. *(This is the data half of `EPIC-005`'s ten-games criterion; the
  behavioural half is `ABC-094` `A3`. Split deliberately — a book with one reply makes that
  criterion unsatisfiable no matter how good the picker is.)*
- **`A5` (`NFR-006`, on an instrument that exists today).** **Given** the delivered artifact,
  **then** its size on disk is **≤ 1,048,576 bytes**, asserted by a test that reads the real file
  and prints the measured figure. *(`plans/nfr-catalog.md` records `NFR-006`'s stated instrument —
  "artifact size check at build" — as non-existent: `npm run build` is `tsc --noEmit` and there is
  no `dist/`. This criterion supplies one that runs today and does not wait for `EPIC-006`.)*
- **`A6` (the licence obligation ships with the data).** **Given** the delivered diff, **then** the
  attribution file `ABC-092`'s ADR names is present at the path that ADR names, and the artifact or
  its directory carries a pointer to it. **If `ABC-092`'s ADR is not `accepted`, this ticket cannot
  be delivered.** *(2026-10-10: it is accepted. The ADR is `ADR-0023`, the path is
  `data/opening-book/ATTRIBUTION.md`, and its five required contents are `ADR-0023` decision 3's list.
  The pinned upstream SHA is chosen and written by this ticket.)*
- **`A7` (nothing was smuggled in).** **Given** the delivered diff, **then** `package.json`'s
  `dependencies` is still `{}` — the compiler uses Node built-ins and this repository's own modules
  — and the artifact is not a `.ts` or `.js` file. *(2026-10-10: at `aaa88263`, `package.json` has
  **no `dependencies` key**. Read the bar as "the diff adds no `dependencies` key and does not change
  `devDependencies`".)*

## Dependencies

- ~~**`ABC-092` — HARD BLOCKER.**~~ **DISCHARGED 2026-09-19.** `ABC-092` is `Done` and `ADR-0023`
  is `accepted` on the owner's word. *(Was: no byte of source data may be copied before its ADR is
  `accepted`, `RISK-004`.)* The source is `lichess-org/chess-openings` under CC0. It is five TSVs
  (`eco`, `name`, `pgn`), 388,052 bytes raw and 3,704 rows. **It carries no weights, so the compiler
  assigns them** (`ADR-0023` decision 5: uniform is enough for `A4`). Lines run past 12 plies, so the
  compiler truncates. **The SAN reader is merged**: `parseSan` at `src/san.ts:223`.
- **`EPIC-001` — satisfied, and verified by reading the tree at this hop, not assumed.**
  `src/fen.ts` (`parseFen`, `toFen`), `src/legal.ts` (`legalMoves`), `src/apply.ts`, `src/san.ts`
  and `src/zobrist.ts` (`zobristKey(position): bigint`) are all present on `main`. `EPIC-005`'s
  stated dependency *"`EPIC-001` — book keys are positions; needs FEN/position hashing"* is
  **discharged**.
- **`EPIC-004` — NOT a dependency of this ticket.** Nothing here calls, imports or shapes a search.
- **Architect/Design owns the format decision** — key (Zobrist `bigint` vs FEN vs a truncated hash),
  weight encoding, and whether the name field lives in the entry or in a side table that `ABC-096`
  reads. **Named and not decided here**; each choice changes `A5`'s headroom, and one of them
  changes `A2`'s method (test note 1).

## Security / NFR triggers

- **`NFR-006` — ≤ 1,048,576 bytes**, asserted by `A5` on the real file. This is the epic's own NFR
  and this ticket is its only owner.
- **Untrusted-input surface, and it is NEW for this project.** The artifact is the first file this
  program will ever parse that a human did not type. Two bars, both structural: **(a)** the format
  is **data-only** — `A7` forbids a `.ts`/`.js` artifact, so no book can ever execute; **(b)** the
  compiler validates the source **before** emitting, so a malformed source fails the compile rather
  than shipping. *Runtime hostile-input handling is `ABC-094`'s.*
- **ASVS `V15.1.1` / `V15.2.1`** — this is where the third-party content actually lands. The
  `high` → `low` override on record rests on *"zero runtime dependencies"*; `A7` keeps
  `dependencies` at `{}`, which preserves the letter of that justification while the *content*
  dependency is new. **Recorded, not resolved — Architect/Design at `EPIC-006`.**
- **`NFR-008` (default lane ≤ 3 s wall / ≤ 13 s CPU; per-ticket bar ≤ 5% of the total = ≤ 650 ms
  CPU).** **This is the ticket's real NFR risk, not `NFR-006`.** `A2` walks the whole book and `A5`
  reads a file that may approach 1 MB. **Target: ≤ 2 new test files and ≤ 650 ms CPU added to the
  default lane**, measured by the median-of-≥7-interleaved-runs protocol `NFR-008` mandates.
  **If the full-book legality walk cannot fit, it moves behind an opt-in env flag like
  `PERFT_DEEP`** — precedent: `PERFT_DEEP=1 npx vitest run src/perft.test.ts` — and the default
  lane keeps a sampled walk with a **stated sample size**. *A silently sampled check that reports
  itself as complete fails `A2`.*
  - *2026-10-10 re-score.* The CPU level is **15 s** (`ADR-0019`), not 13 s. Under `ADR-0035`
    (**proposed**), a full-lane per-ticket bound below 1.72 s CPU is refused at the cut. The cost is
    then read on the **narrow set** (the files this ticket adds, against a placeholder). **The pin
    that holds under either reading is the count: ≤ 2 new test files.** The 650 ms is read per
    whichever protocol is in force at the build hop.
- **`NFR-001` — not triggered.** The compiler calls `legalMoves` heavily, but at build time and off
  the search hot path. No production module changes.
- **`NFR-002`, `NFR-003`, `NFR-004`, `NFR-007` — not triggered.** No frame, no prompt, no search.
  **But see `ABC-094`'s `N-LOAD` trigger**: whoever chooses the format here decides how expensive
  the load is, and the load lands inside `NFR-007`'s `npx`-to-first-board window if it is eager.

## Test notes

1. **A Zobrist key cannot be inverted, so `A2` cannot be checked by "look up the key, get the
   position".** Replay instead: walk lines from the start position with `apply`, and at each node
   assert the move is in `legalMoves(position)` **and** that the key derived from that position
   equals the key in the artifact. **This is a real constraint on the format**, and it is why `A2`
   is worded as an outcome ("0 illegal moves") rather than as a method — if Architect picks a
   format that carries a FEN, the direct check becomes available.
2. **`A1`'s reproducibility is the criterion most likely to be lost by accident.** `Map` iteration
   order, `Date.now()` in a header, and an absolute path in a provenance comment each break it.
   Write the byte-identical assertion before the compiler is finished, not after.
3. **Do not assert the artifact's exact bytes or its exact entry count in a snapshot.** The book
   will be regenerated when the source updates; a snapshot turns that into a red suite for no
   defect. Assert **properties** — legality, depth bounds, size, the `1. e4` reply count.
4. **`A5` must read the file from disk, not a constant.** A size bar asserted against a hardcoded
   number is a spelling guard (`ABC-059`'s defect class).
5. **Measure the lane cost with `NFR-008`'s protocol before claiming it** — median of ≥ 7
   interleaved runs, CPU as well as wall, one fresh process per run. This file is on the reference
   machine Apple M3 / Node v24.12.0; `UNKNOWN - verify` elsewhere.

## Lane cost — how many test FILES this ticket implies

**One or two.** `plans/nfr-catalog.md` § `NFR-008` measures a test **file** at 159–179 ms CPU
against 0.35–0.43 ms per `it` — so the file count is the lever, not the assertion count. Prefer
**one** book test file holding `A1`–`A5`.

## Size and priority rationale

**Size `M`.** A compiler over an external data format, a static artifact, a full-book legality
proof, and a reproducibility guarantee — four distinct pieces of work in two hands (Architect for
the format, Engineer for the compiler). **Not `S`**: the legality proof alone is a real test design
(test note 1). **Not `L`**: no production runtime code ships in this ticket at all, the algorithms
it needs already exist on `main`, and the epic caps the data at 8–10 plies.

**Priority `P1`.** Inherits the epic; it is the only thing standing between `ABC-092` and every
remaining ticket. **Not `P0`**: `EPIC-004` is the product's critical path and this is not.

## Definition of Ready

**RE-SCORED 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `rescore-p1-backlog-2026-10-10`,
at `aaa88263`). **Result: 9 of 10, ⚠️x1. Recommended column: `In Design`, then `Ready for Dev`.**
Readings: `.grugops/context/rescore-p1-backlog-2026-10-10/notes/`.

- **Item 10 ⚠️ → ✅.** `ABC-092` is `Done` and `ADR-0023` is `accepted` by the owner (2026-09-19).
  Nothing else blocks the build.
- **Item 5 ⚠️ STANDS, and it is now the only open item.** There is still no format ADR. Architect/Design
  owns these calls at `In Design`, before code:
  - the key (Zobrist `bigint`, FEN, or a truncated hash), which decides `A2`'s method;
  - the weight encoding (`ADR-0023` already allows uniform weights);
  - where the name field lives, which `ABC-096` reads;
  - where the artifact and the compiler live (`data/opening-book/` beside `ATTRIBUTION.md`, `tools/`,
    or `src/`).

  The compiler's placement also decides two gates. A compiler in `src/` as a non-test `.ts` file is
  production by `AGENTS.md`'s measured rule, so it needs the owner's UAT word. If it imports a Node
  builtin, it also fires `ADR-0036` clause (b1). A compiler outside `src/` fires neither, and the UAT
  is waived by measurement while third-party data ships to every clone (owner question 4 in the
  note).
- **Items 1–4 and 6–9 stay ✅.** `A6` and `A7` carry dated readings (above). `AGENTS.md` is
  23,633 B against its 24,576 B target, which leaves **943 B** for the regeneration command line.
- **Size `M` and priority `P1` hold.** `EPIC-004`'s engine is `Done`, so this chain (`ABC-093` →
  `ABC-094` → `ABC-095`) is now the only thing between the board and `EPIC-005`'s value.
- **Overlaps.** None by file with `ABC-083`, `ABC-010`, `ABC-131` or `ABC-141`. `ABC-010` (unmerged,
  `f9d1ff4b`) tightens `parseFen`. If the format keys on FEN, the compiler meets that stricter parser,
  so build after `ABC-010` merges or read its tip.

**History. Assessed 2026-08-16** against `agent-factory/checklists/definition-of-ready.md` by BA/PM
at the cutting hop. **Result: 8 of 10 — items 5 and 10 carry a ⚠️; the other eight are MET.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** user, pain and value stated; the epic's own "corrupt entry = crash mid-game" quoted |
| 2 | scope and out-of-scope clear | **✅** five in, six out; the data-only rule is stated as a boundary, not a preference |
| 3 | INVEST-shaped | **✅** independent of `EPIC-004`; testable; deliverable in one hop once `ABC-092` lands |
| 4 | acceptance testable and measurable | **✅** seven criteria on bytes, counts and states: `cmp` exit 0, 0 illegal moves, ≥ 8 / ≤ 12 plies, ≥ 3 replies, ≤ 1,048,576 bytes, `dependencies` `{}` |
| 5 | dependencies known | **⚠️** all four named — but **one is an unmade design decision** (the format, Architect/Design's) that changes `A2`'s method. Not a blocker to pulling; it must be taken **at the `In Design` step, before code**. |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-006` 1,048,576 bytes; `NFR-008` ≤ 650 ms CPU / ≤ 2 files with a named fallback; the ASVS override challenged by name |
| 7 | test notes present | **✅** five, including the non-invertible-key constraint that shapes `A2` |
| 8 | size assigned | **✅** `M`, with both re-size boundaries named |
| 9 | priority assigned | **✅** `P1`, with the reason it is not `P0` |
| 10 | no major unresolved blocker | **⚠️ ONE, HARD.** `ABC-092`'s ADR must be `accepted` first — a licence question with a human on the critical path. **This ticket is not pullable until that lands, and no part of it may be started "just the compiler, without data" if that means fetching the data to test against.** |
