---
id: ABC-061
title: The resolver's accepting path is asserted by `.ok` alone — `--ascii` reaches the renderer through no assertion, and a one-word mutation ships 856/856 green
status: backlog
column: Backlog
size: S
priority: P1
epic: —
feature: —
---

# ABC-061 — six accepted command lines, one boolean between them, and a live mutant

> **Cut 2026-08-15 by BA/PM** (task `uat-ABC-042-followups-2026-08-15`, subtask `uat-ABC-042-cut`,
> Workflow 03) out of QE/E2E's `R1` + `R2` (`.grugops/context/uat-ABC-042-qe/notes/`), which QE
> recommended and deliberately did not perform. **`ABC-042` is merged, `Done`, and both gates passed
> against it: its page is NOT edited by this ticket and no criterion of its is re-opened.** This is a
> hole in what watches the build, not a defect in what shipped.

## Problem

*User*: every engineer who edits `src/cli-options.ts` after today, and through them the human who
types `npm run chess -- --ascii` on a terminal that cannot draw chess figures.

*Pain*: **`--ascii`'s wiring is pinned by nothing, and QE proved it by mutation.** One word in
`src/cli-options.ts:153` — `flags: { ascii, unicode }` → `flags: { ascii: false, unicode }` — leaves
the suite at **856/856 green on 30 files** while `--ascii` under a real pty draws **32 code points in
`U+2654`–`U+265F`**: chess figures where the human asked for letters. UAT-8 fails for a person and
nothing goes red.

Two facts make it invisible, and both are structural rather than careless:

- **Every automated child runs on a pipe**, where `selectGlyphMode` row 1 (`--ascii` beats every
  signal) and row 3 (an unseen sink gets the portable form) **agree**. `--ascii` and no-flag are
  indistinguishable there, which is why `--ascii` is not among the ten spawned children.
- **The one row that touches it, `src/cli.test.ts:359`, asserts `resolveOptions(argv).ok === true`
  and nothing else** — for all six accepted command lines (`[]`, `--ascii`, `--unicode`, and
  `--colour` with each of its three values). `.ok` is still `true` after the mutation.

*Value*: the accepting half of the resolver is the whole product surface `ABC-042` delivered — what
comes back from it decides the board a human sees. **After this ticket the six accepted command
lines are pinned by what they RESOLVE TO, not by the fact that they resolved**, and the mutant above
is red.

## Scope

- **New, separately named `it` blocks in `src/cli.test.ts`**, asserting the resolved
  `ResolvedOptions` — `colour`, `orientation`, `flags` — for each of the six accepted argvs.
- **The `--colour random` case pins the PAIRING**: `colour` is one of two values and `orientation`
  is the one derived from it, so a build that returns `black` with `white-bottom` reds.
- **A comment at the site naming the mutant this guards against**, so the next hop does not
  "simplify" the object comparison back to `.ok`.

## Out of scope

- **`ABC-042`'s `A6(i)` row at `:359` — it stays BYTE-IDENTICAL.** QE's `R2` said "widen `:359`";
  cutting it that way would edit a merged criterion's instrument, which is the discipline `ABC-059`
  set for `:193`. The new assertions live beside it under their own name, so a reader can tell which
  ticket each serves.
- **Anything under `src/` that is not a `.test.ts` file.** Zero production lines. The product is
  correct on every point examined and this ticket changes none of it.
- **A pty-attached check.** The terminal half of the glyph default costs a child and the file's spawn
  count is pinned at ten (`src/cli.test.ts:780`). It is an open question for the Orchestrator, not
  this ticket's work — see `.grugops/context/uat-ABC-042-cut/notes/`.
- **`--ascii` end-to-end as a spawned child.** Same reason, and it would buy nothing on a pipe.

## Acceptance (Given/When/Then)

- **`A1` (the mutant is red).** **Given** `flags: { ascii: false, unicode }` substituted at
  `src/cli-options.ts:153`, **then** the suite is **RED**. *(Today: **856/856 green** — measured by
  QE on a copy of the tree outside the repository. This is the falsifying witness and it is the
  point of the ticket.)*
- **`A2` (the value is asserted, for all six).** **Given** each of the six accepted argvs — `[]`,
  `["--ascii"]`, `["--unicode"]`, `["--colour","white"]`, `["--colour","black"]`,
  `["--colour","random"]` — **then** the assertion compares the **whole resolved options object**
  against an expectation written per argv. **Zero of the six is asserted by `.ok` alone in the new
  blocks.** *(Today: **6 of 6** are `.ok` only.)*
- **`A3` (`random`'s coin does not weaken the row).** **Given** `["--colour","random"]`, **then**
  `flags` is asserted exactly, `colour` ∈ `{"white","black"}`, **and** `orientation` equals
  `"white-bottom"` for `white` and `"black-bottom"` for `black` — **the pair is asserted together**,
  so a build returning a mismatched pair reds.
- **`A4` (the second mutant is red too).** **Given** `flags: { ascii, unicode: false }` substituted
  at the same line, **then** the suite is **RED**. `--unicode`'s wiring is pinned today only by the
  byte-exact `white` child at `:274`, which also carries `--colour white`; this pins it at the
  resolver, alone.
- **`A5` (the accepted set is not enlarged).** **Given** the diff, **then** `ACCEPTED_ARGUMENTS` is
  unchanged, `:353`'s element-for-element equality is untouched, and `:359` is **byte-identical**.
- **`A6` (nothing else moved).** `git diff --name-only <the delivered commit>~1 <the delivered
  commit>` shows **exactly** `src/cli.test.ts` — **one path**, **zero production lines**, **zero new
  child processes** (`spawned` still `10` at `:780`). Suite green, skip **0**.

## Dependencies

- **None open.** `ABC-042` is merged at `dbaf972`; `src/cli.test.ts`, `src/cli-options.ts` and
  `ACCEPTED_ARGUMENTS` all exist on `main` (verified at the cut). The ordering hold that `ABC-057`–
  `ABC-060` carry is **discharged for this ticket**.
- **Same-file neighbours, not blockers:** `ABC-058` (three sites), `ABC-059` (a block near `:193`),
  and `ABC-062`–`ABC-064` from this hop all add or edit blocks in `src/cli.test.ts`. **No two share
  an assertion** and every one of them states "no merged row edited", so any order works; the
  Orchestrator sequences them against each other only to avoid a textual conflict.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**. **0 new test files, 0 new files under `src/`,
  0 new child processes.** The added work is six pure `resolveOptions` calls and their object
  comparisons; the merged file already makes 1000 of them at `:247`. **`N8-LANE` was re-graded `MET`
  at 0.23× (152.5 ms of 650 ms) on `ABC-042`'s merging tree — this ticket must not move it.**
- **`NFR-002` not triggered.** No frame path, no production module opened; the resolver composes no
  frame row.
- **Security: not triggered.** `ABC-041`'s four clauses: **(a)** no manifest touch, **(b)** no
  non-`.test.ts` file under `src/` touched, **(c)** no network, no write, **no new spawn** — the
  added calls are pure, **(d)** blast radius is one path.

## Test notes

1. **Write `A1` first and watch it RED before writing the guard**, on a copy of the tree outside the
   repository, exactly as QE did. A guard that passes only because the mutant was never run has not
   been tested.
2. **Compare the whole object, not field by field.** A field-by-field assertion is how `.ok` got
   here: the next field added to `ResolvedOptions` would be unasserted from birth.
3. **`--colour random` needs no seeding and no 1000 iterations.** `:247` already runs the
   distribution property with zero spawns; this row only needs the pairing to hold on whichever side
   the coin lands, which is one call.
4. **Do not assert `selectGlyphMode`'s behaviour here.** `src/glyph-mode.test.ts` owns the rule; this
   ticket owns the wiring between the resolver's return value and its caller's input.

## Lane cost — how many test FILES this ticket implies

**Zero.** Blocks added to an existing file; no child process, no `vi.mock`, so no `*.nfr.test.ts`.

## Size and priority rationale

**Size `S` (2).** Two new blocks over six argvs plus the two mutants written down as `A1` and `A4`.
Larger than `ABC-059`'s single block because the expectation table is six rows and one of them is
non-deterministic; nowhere near `M` — no production line, no new file, no spawn.

**Priority `P1`.** It is one of exactly two items in this whole follow-up set with a **proven**
witness: a one-word change that ships green while breaking a scenario for a human. The behaviour it
protects — `npm run chess -- --ascii` on a terminal that cannot draw figures — is the only measured
path where the product is correct today and guarded by nobody. **Not `P0`: nothing is broken, and
`P0` on this board means the product does not work.**

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-15**. **Result: 10 of 10 — MET.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** one file, one line, one mutant, and the structural reason the suite cannot see it (pipe makes rows 1 and 3 agree) |
| 2 | scope and out-of-scope clear | **✅** new blocks beside `:359`, which stays byte-identical; four fences including "no pty" and "no production line" |
| 3 | INVEST-shaped | **✅** independent of every sibling, testable by a mutation already performed and recorded, deliverable in one hop |
| 4 | acceptance testable and measurable | **✅** **6** argvs asserted by value (today **0**), two named one-word mutants RED, `:359` byte-identical, **1** path in the diff, `spawned` **10** |
| 5 | dependencies known | **✅** none open — `ABC-042` merged, the file exists on `main`; five same-file neighbours named as ordering, not blockers |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms with **0** new files and **0** spawns, against a current 152.5 ms; `NFR-002` untriggered; four security clauses answered |
| 7 | test notes present | **✅** four, including "write the failing witness first" and "compare the whole object" |
| 8 | size assigned | **✅** `S` (2) |
| 9 | priority assigned | **✅** `P1`, with the reason it is not `P0` stated |
| 10 | no major unresolved blocker | **✅** none. The pty question is fenced OUT of this ticket and recorded as an open question, so it cannot silently become this ticket's blocker |
