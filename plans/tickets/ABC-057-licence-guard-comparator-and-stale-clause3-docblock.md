---
id: ABC-057
title: The merged licence guard's comparator is unwitnessed, and its docblock still states the sentence `ADR-0011` clause 3 struck — two sites, one file, zero production lines
status: backlog
column: Backlog
size: XS
priority: P2
epic: —
feature: —
---

# ABC-057 — the guard that catches a stale licence has a stale licence rule above it, and an operator nothing watches

> **Cut 2026-08-16 by BA/PM** (task `abc042-followups-2026-08-16`, subtask
> `refinement-ABC-042-followups`, Workflow 07), out of **Architect/Design's explicit routing** at
> `design-ABC-042-adr0011-clause3` — registered in `ADR-0011` as `R5` and as the third amendment's
> "two sites, one file, and NEITHER IS TAKEN HERE". **`ABC-042`'s `A12` bars that file, so this is a
> new ticket and not a repair to a gated one.** `ABC-042`'s page is not touched by this ticket.

## Problem

*User*: every hop that adds a runtime importer of `src/history.ts` — the next is `ABC-043`'s turn
loop wiring — plus the reviewer who has to decide whether an added licence entry is legitimate.

*Pain*: **two independent defects in the same guard, in the same file.**

1. **The comparator is unwitnessed** (`Q3` = QE's finding, `R5` in `ADR-0011`).
   `src/history-pane.nfr.test.ts:335` is
   `expect(runtimeImporters).toEqual(production.filter((file) => LICENSED_DRIVERS.includes(file)))`.
   Nothing asserts it stays an **equality**. QE's mutant `M15` weakens it to a containment and
   **survives the whole suite**. Either direction loses a real kill: superset-of-licence loses the
   **unlicensed importer** (`WLAUNDER` / `WPERFT-STATIC`, the guard's primary kill), subset loses
   **`WSTALELICENCE`**. The comparator has been unwitnessed since `ABC-029`; `ABC-042` changed the
   **array**, not the operator.
2. **The docblock above it states a rule that no longer exists** (`D1` / `Q14`). The licence
   docblock at `:196-200` restates, **verbatim**, the sentence `ADR-0011` clause 3 **struck** on
   2026-08-15: *"A production module may hold a runtime import of the history module only if it is
   the game-owning driver that rule requires."* Architect struck it because it is **false of the
   correct build** — it borrows `ADR-0002`'s phrase from the wrong side of the import edge, so read
   strictly the licence set is empty and `turn-loop.ts` was never licensed either.

*Value*: **the docblock is the first thing a hop adding a third licence entry reads**, and it is the
only place the admission test is written where the entry is written. A struck rule left standing at
the declaration site is the version that gets applied. The comparator tripwire is the only in-suite
instrument available for an operator — an assertion's operator cannot be observed behaviourally
without a mutation harness this repository does not have.

## Scope

- **The comparator tripwire.** One `expect(instrument).toContain(<the comparator's literal text>)`
  in the `it("runs the guard's OWN expression — a drift tripwire, not a copy that can go stale")`
  block at `:435-443`, **which already reads the file into `instrument`**. Same shape as the sibling
  tripwire that pins the regex literal, sitting beside it.
- **The docblock, corrected to the amendment.** Replace the struck sentence with `ADR-0011` clause
  3's replacement — **(i) NECESSITY** (the runtime import is unavoidable given what the module must
  do: it constructs or advances the game; a module that can take `GameHistory` as a **type** or
  receive it **injected** is not licensable) and **(ii) THE SINGLE SUPPLIER IS INTACT** (it never
  constructs a `positionCounts` map; status comes from `gameStatusOf(history)`).
- **Both existing entries' citations discharge both parts.** `turn-loop.ts` and `cli.ts` each owe an
  argument for (i) and for (ii) at the declaration site — the ADR's amendment states both and they
  can be transcribed, not invented.

## Out of scope

- **The guard's own expression, the scanned set, the equality itself, and clauses 1 / 2 / 4.**
  `ABC-029` forbids changing the guard's expression and the amendment changed no instrument.
- **`ABC-042`, its page and its criteria.** Not re-opened. The struck sentence never blocked
  `ABC-042` and the replacement does not unblock it — the property was satisfied throughout.
- **Extracting the comparison into a shared helper.** Rejected by Architect: it changes the guard's
  own site, which `ABC-029` bars and coding rule 10 forbids.
- **A mutation framework.** Out of all proportion to a four-line gap.
- **`plans/nfr-catalog.md`, `ADR-0008`, `ADR-0002`.** Not opened; `NFR-002` is clause 2's and clause
  2 is untouched.

## Acceptance (Given/When/Then)

- **`A1` (the operator is pinned).** **Given** the tripwire block that already reads the file,
  **then** it asserts the comparator's **literal text** at `:335` is present — and **when** `M15` is
  rebuilt (`toEqual` → `toContain`/`toMatchObject` at that site, nothing else changed), the suite is
  **RED**, attributed to this assertion. *(Today: `M15` survives.)*
- **`A2` (no kill is traded).** **Given** the unchanged guard, **then** `WLAUNDER`,
  `WPERFT-STATIC` and `WSTALELICENCE` still red exactly as they do today, and the sibling tripwire at
  `:441-442` is **byte-identical**.
- **`A3` (the docblock states the live rule).** **Given** the docblock at `:196-200`, **then** it
  contains **zero** occurrences of the struck phrase `game-owning driver`, and it states both
  **(i) necessity** and **(ii) single supplier intact** in the words `ADR-0011`'s amendment uses.
- **`A4` (each entry discharges both parts).** **Given** each element of `LICENSED_DRIVERS`, **then**
  its citation paragraph names why a **type** import and an **injected** `GameHistory` are both
  unavailable to it, **and** that it never constructs a `positionCounts` map. **Two entries, two
  citations, 2/2.**
- **`A5` (nothing else moved).** `git diff --name-only <the delivered commit>~1 <the delivered
  commit>` shows **exactly** `src/history-pane.nfr.test.ts` — **one path.** **Zero production lines,
  zero executable lines in the docblock half, zero new spawns.** Suite green, skip **0**.

## Dependencies

- **`ABC-042`'s line must merge first — OPEN and HELD.** The `ADR-0011` third amendment and the
  second licence entry (`cli.ts`) both live on that line; until it lands, the docblock matches the
  live ADR and half of `A3`/`A4` has nothing to correct. **`ABC-042` is held at the merge on `G1`,
  which is with the project owner and is not this ticket's to move.**
- **`ABC-054` is orthogonal, checked.** It may repair the shared **regex**, which the sibling
  tripwire pins by design. A comparator tripwire pins a **different line**: `ABC-054` does not red
  it and it does not constrain `ABC-054`.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**, scope = every file the branch adds under
  `src/`. **0 new test files, 0 new files under `src/`, 0 new spawns, no new `readFileSync`.** The
  added cost is a `String.includes` over an already-resident string. **This is not a lane reading and
  must not be quoted as one.**
- **`NFR-002` not triggered.** Nothing on the frame path; the guard asserts over source text.
- **Security: not triggered.** `ABC-041`'s repaired four clauses: **(a)** no manifest touch,
  **(b)** no non-`.test.ts` file under `src/` touched at all, **(c)** the one test file touched adds
  no network, no write, and **no spawn**, **(d)** blast radius is one path. **On a disputed reading
  it fires and the gate resolves it.**

## Test notes

1. **A witness that is a copy is worse than no witness** — the file's own words. The tripwire must
   pin the **literal text at the guard's site** and sit beside it, or it becomes a second thing to
   keep in sync.
2. **It is not tamper-proof and must not be sold as such.** A hop can change the comparator and the
   tripwire together. Its value is that the weakening becomes **deliberate and visible in the diff**
   instead of silent — exactly what this file already claims for its sibling.
3. **Line numbers are the merged tree's**, verified by QE at `quality-gate-ABC-042-regate` and
   re-measured here: docblock `:196-200` (Architect cited the block as `:196-199`; the struck
   sentence's last line is `:200`), `LICENSED_DRIVERS` `:219`, comparator `:335`, tripwire block
   `:435-443`. **On `main` today they are `:196-200`, `:213`, `:329`, `:429-437`** — the licence edit
   shifts them by six. Re-read before editing; do not trust either set blind.
4. **The temptation the docblock must refuse, by name.** *"A module that does not itself construct a
   `positionCounts` map"* is true of every production module but `history.ts`; it licenses
   `WLAUNDER` in one sentence. **Part (i) is the entire gate and it is the part a hop in a hurry
   drops.**

## Lane cost — how many test FILES this ticket implies

**Zero.** Both sites are in one existing file. No child process is spawned by either.

## Size and priority rationale

**Size `XS` (1).** Architect priced it at the routing hop with the mechanism and the site named:
~4 lines for the tripwire in a block that already reads the file, plus a prose paragraph transcribed
from an amendment that is already written. **It has a paragraph of history behind it and four lines
of work in front of it; the history is not the size.**

**Priority `P2`.** No live defect: the delivered comparator is intact (verified twice at the
`ABC-042` gate) and the docblock's error is a rule statement, not a build. **`ADR-0011` `R5` names
the promotion trigger and it is not mine to soften: the next hop that opens
`src/history-pane.nfr.test.ts` for any reason** — `ABC-054` is the likeliest, and `ABC-043` adding a
third licence entry is the one that makes the docblock actively dangerous. **Promote to `P1` the
moment either is pulled.**

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-16**. **Result: 9 of 10 — NOT MET.** ⚠️×1, and the ⚠️ is an ordering, not an unknown.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** an operator nothing watches (`M15` survives, measured) and a struck rule still stated at the declaration site |
| 2 | scope and out-of-scope clear | **✅** two sites in one file; five fences, first of which is "do not touch the guard's expression" |
| 3 | INVEST-shaped | **✅** small, testable by one rebuilt mutant and one `grep`; the two halves share a file, a block and a review |
| 4 | acceptance testable and measurable | **✅** `M15` RED and attributed, three named builds still red, **0** occurrences of `game-owning driver`, **2/2** citations discharging both parts, **1** path in the diff |
| 5 | dependencies known | **✅** `ABC-042`'s line first — named, with the reason and the current holder of the hold; `ABC-054` checked as orthogonal |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms with **0** new files and **0** spawns, `NFR-002` untriggered with the structural reason, four security clauses each answered |
| 7 | test notes present | **✅** four, including both sets of line numbers and the widening the docblock must refuse by name |
| 8 | size assigned | **✅** `XS` (1), priced by Architect/Design at the routing hop |
| 9 | priority assigned | **✅** `P2` with `ADR-0011` `R5`'s own promotion trigger |
| 10 | no major unresolved blocker | **⚠️** `ABC-042` must merge first and is **held on `G1`, with the project owner**. Not a defect in this ticket and not this ticket's to resolve — but it is a real ordering blocker and is scored as one |
