---
kind: adr
---
# ADR-0009: The frame's row constants — the producer owns its count, and the composition is asserted once

## Status

**accepted** — 2026-08-11 by Architect/Design at task `design-frame-contract` (subtask
`design-frame-contract`, Workflow 07), on the ruling the Orchestrator's `frame-merge-order-2026-08-11`
decision note explicitly routed here rather than settling by fiat.

**No target moves and no level is set, so no owner ratification is owed** — the distinction from
`ADR-0008`, which needed `Olger Oeselg` because it fixed a budget *level* a human has to value. Every
claim below is gate-adjudicable: it either fails on the constructed mutants in `## Context` or it does
not, and it was run. **Zero production lines are added by this decision.**

## Context

`ABC-016` (status panel, `Ready`, `M`/`P1`) and `ABC-017` (bounded history pane, `Ready`, `S`/`P2`)
each export a row-count constant that does not yet exist in merged `src/`, and each asserts the same
frame identity from the opposite side:

- `ABC-016` `A11`: exactly `STATUS_ROWS` = 3 rows, **and** `frameHeight({ board: 9, status:
  STATUS_ROWS, history: 8 })` is 23.
- `ABC-017` `A1`: exactly `HISTORY_ROWS` = 8 rows at ten lengths, **and** `frameHeight({ board: 9,
  status: STATUS_ROWS, history: HISTORY_ROWS })` is 23.

`A1` names `STATUS_ROWS`, which only `ABC-016` produces. `ABC-017`'s own `## Dependencies` says of
`ABC-016`: *"Not a code dependency — no import edge either way."* Both cannot be right, and `ABC-017`
says in its own words that *"when both land, neither ticket owns the 8 alone."* That contradiction on
a `Ready` ticket is a Definition-of-Ready item-5 failure and is what this ADR was asked to settle.

**The coupling is exactly one clause in each ticket.** Measured by enumeration, not impression:
`STATUS_ROWS` occurs twice in `ABC-017` — once as prose (line 84) and once as a symbol to evaluate
(`A1`, line 151); `history: 8` occurs twice in `ABC-016` — once in the `N`-sweep prose (line 77) and
once in `A11` (line 348). Strike the two criterion clauses and the cross-ticket coupling is zero.

### What merged code already does, read at source

- `frameHeight(panelRows)` takes **three plain numbers** and adds `MESSAGE_ROWS + PROMPT_ROWS`
  (`src/frame.ts:84-90`). It is the only thing in the tree that needs all three terms at once. No
  panel needs another panel's count for anything.
- `src/frame.ts` owns `MESSAGE_ROWS` (`:40`) and `PROMPT_ROWS` (`:48`) because it **produces** those
  rows — it lays out the message region (`:160-184`) and reserves the prompt row (`:183`). It renders
  no panel and imports nothing from one.
- `src/render.ts` exports **no** row-count constant. The board's 9 rows are the length of
  `renderBoard`'s return value (8 rank rows + 1 file-label row, `:122-149`). Measured: 9 rows of 18
  characters.
- **The composition identity is ALREADY ASSERTED IN MERGED CODE.** `src/frame.test.ts:632-638`, test
  name *"derives H from the panels' constant heights — no 23 anywhere in the module"*, asserts
  `frameHeight({ board: BOARD_ROWS, status: STATUS_ROWS, history: HISTORY_ROWS })` is 23 — where all
  three of those names are **local shadow constants declared in the test file** at `:38-43`
  (`STATUS_ROWS = 3`, `HISTORY_ROWS = 8`, `BOARD_ROWS = 9`), each labelled as the absent ticket's
  *"stated constant"*. So `A11` and `A1` each propose to add a third and fourth copy of an assertion
  that is already green.

### The arithmetic, re-measured against merged `frame.ts` rather than taken from either ticket

Both tickets' numbers are correct. `frameHeight({9,3,8})` = **23**. Status sweep at `board: 9,
history: 8` → 21/22/23/24/25/27 for `N` = 1/2/3/4/5/7. History sweep at `board: 9, status: 3` →
22/23/24/25 for 7/8/9/10. And "fits" was checked through the merged code that decides it rather than
by arithmetic: `beginFrameSession` on a 24-row TTY takes the **in-place** path at `H` = 23 and 24 and
the **append** path at `H` = 25, so epic acceptance `4b` becomes unreachable at `H` ≥ 25 exactly as
`ABC-016`'s `D8` correction says.

### The measurement that decides the ruling — six row-count mutants against the four assertion forms

Each form as its ticket words it, run against merged `frameHeight`; `4b-reachable` is
`beginFrameSession`'s own strategy choice on a 24-row TTY:

| mutant | `A11` | `A1` | merged shadow | fit-check `=23` | fit-check `<=24` | H | `4b` |
|---|---|---|---|---|---|---|---|
| delivered as budgeted (9/3/8) | PASS | PASS | PASS | PASS | PASS | 23 | yes |
| M1 status ships 4 rows | **FAIL** | **FAIL** | PASS | **FAIL** | PASS | 24 | yes |
| M2 history ships 9 rows | PASS | **FAIL** | PASS | **FAIL** | PASS | 24 | yes |
| M3 history ships 10 rows | PASS | **FAIL** | PASS | **FAIL** | **FAIL** | 25 | **no** |
| M4 `renderBoard` ships 10 rows | PASS | PASS | PASS | **FAIL** | PASS | 24 | yes |
| M5 board 10 **and** history 9 | PASS | **FAIL** | PASS | **FAIL** | **FAIL** | 25 | **no** |

Three facts fall out, and they are the whole basis of the decision:

1. **The merged shadow assertion passes all six.** It is a tautology over three local literals: it
   proves `frameHeight`'s arithmetic and says nothing about any panel. Useful, correct, and not the
   protection anyone thinks it is.
2. **`A11` passes M3 and M5 — the only two mutants that actually make `4b` unreachable.** `A11` was
   added by `ABC-016`'s `D8` precisely to protect `4b`, and as written it cannot fail on the two cases
   that break it, because it hardcodes the term (`history`) that moves in both. That is the same
   "a bar that cannot fail on the regression it exists to catch" defect class `ABC-016`'s own hop and
   this project's catalog have now recorded five times.
3. **`A1` is blind to M4** — it hardcodes `board: 9` — so even paying the import edge does not buy a
   complete check. The edge costs something and protects two of three terms.

### What the import edge would cost, mechanically

`tsconfig.json` includes `src/**/*.ts` and `npm run typecheck` is project-wide `tsc --noEmit`
(`AGENTS.md` records that there is no single-file mode). `typecheck` is in
`quality.mandatory_gates` with `gate_enforcement: blocking`. So a real `STATUS_ROWS` import in
`ABC-017`'s test file is not merely a red test in one file — it makes the **whole project's blocking
typecheck gate** depend on `ABC-016` having landed first.

## Decision

1. **The producer owns its count.** `STATUS_ROWS` is exported by `ABC-016`'s status-panel module;
   `HISTORY_ROWS` and `HISTORY_COLS` by `ABC-017`'s history-pane module; `MESSAGE_ROWS` and
   `PROMPT_ROWS` stay in `src/frame.ts`. This is not a new rule — it is the rule merged code already
   follows, stated so it stops being re-litigated per ticket.

2. **No panel imports another panel's constant, in production or in test.** There is no import edge
   between the two panels in either direction, and `ABC-017`'s `## Dependencies` sentence is the half
   of the contradiction that is right.

3. **`ABC-017`'s `A1` does NOT import `STATUS_ROWS`.** The `frameHeight(...) is 23` clause is
   **struck** from `A1`. `A1` keeps its own half: exactly `HISTORY_ROWS` = 8 rows at every one of its
   ten lengths, and `HISTORY_ROWS` exported.

4. **`ABC-016`'s `A11` loses the same clause, for the same reason.** Symmetry, not courtesy — as
   written it is blind to four of the six mutants above, including both that break `4b`. `A11` keeps:
   exactly `STATUS_ROWS` = 3 rows in every case, and `STATUS_ROWS` exported. Each panel asserts the
   number it owns and claims no frame-level consequence it cannot see.

5. **The composition lands ONCE, in `src/frame.test.ts`, with all three terms read from delivered
   code** — replacing the three shadow constants at `:38-43` with real imports as each panel lands.
   Two clauses, and both are wanted:
   - `frameHeight({ board: renderBoard(...).length, status: STATUS_ROWS, history: HISTORY_ROWS })`
     **is 23** — the **tripwire**. It fails on any panel row-count change, which is what forces the
     change to be deliberate rather than silent.
   - the same value **≤ 24** — the **requirement**. This is what epic `4b` actually needs and what
     `beginFrameSession` switches on.

   **Owed by whichever of `ABC-016` / `ABC-017` merges SECOND.** It is an edit to `ABC-018`'s merged
   test file and it is a few lines; no production file changes.

6. **The board term is derived, never declared.** No `BOARD_ROWS` export is added to `src/render.ts`
   and that merged module is not touched. The fit-check reads `renderBoard(...).length`, which is
   **stronger** than a constant would be: it measures the delivered geometry instead of restating it,
   and it is the only form that fails M4.

7. **Therefore `ABC-016` and `ABC-017` land as two tickets in sequence, on two branches** — not as one
   contract on one branch.

8. **The merge order `ABC-016` → `ABC-017` survives, and its reason is downgraded on the record.** It
   is **no longer forced by a build edge**: after clause 3 there is no edge, and both tickets go green
   alone. It is now a **scheduling choice** — it matches `P1` before `P2`, and it gives clause 5's
   fit-check one definite home instead of a "whoever is second" rule nobody can read off a ticket.
   The Orchestrator's note recorded this order as *"Forced by build edges, not by value … Not a
   preference."* After this ADR the honest statement is the opposite: it **is** a preference, and it is
   a good one. `ABC-019` is untouched — still last, still its own branch.

## Alternatives

**A. Leave `A1` as written: it imports `STATUS_ROWS`, and the two tickets share one branch (3 + 2 = 5,
`L`).** Rejected. It pays a real cost — coupling the project-wide blocking `typecheck` gate to merge
order — for an assertion that (i) is already merged in shadow form, (ii) duplicates `A11`, and (iii)
is *still incomplete*, since `A1` hardcodes `board: 9` and passes M4. A combined branch additionally
manufactures a 5-point unit, and blends the per-ticket `src/` byte-identity check this project uses to
prove no gate repaired the thing it was measuring. **Paying a cost for a partial version of a check
that a cheaper form does completely is the whole case against it.**

**B. Keep the clause but write the foreign term as a literal or a local shadow (`const STATUS_ROWS =
3`).** Rejected, and it is rejected by measurement rather than taste: that is exactly what merged
`src/frame.test.ts:38-43` does, and the shadow form **passes all six mutants**. It also reproduces
`ABC-017`'s own `D13` — *"Two tickets carrying the same magic number with nothing tying them is how the
two come to disagree"* — from the other side.

**C. Move `STATUS_ROWS` and `HISTORY_ROWS` into `src/frame.ts`, so the frame owns all five row
constants.** Rejected, and this is the closest call — it deserves its argument rather than a
dismissal. **For:** both values were *derived from frame-fit arithmetic*, not from panel content. 3 is
not a property of a status panel; it is what is left after `N` ≥ 5 pushes `H` to 25 and kills `4b`.
8 is what the viewport leaves for history. On that reading the frame owns the budget and the panels are
its consumers. **Against, and it wins:** it edits a merged module for no behavioural gain (coding rules
9 and 10); it inverts the direction `src/frame.ts`'s header deliberately establishes (*"this module
renders none of them"*); it makes a panel unable to state its own height without importing the frame,
so the panel cannot be unit-tested without it; and it breaks the producer-owns-count rule that merged
code already follows for `MESSAGE_ROWS` / `PROMPT_ROWS`. **What rejecting it costs, stated plainly:**
the derivation of *why 3* and *why 8* stays in two ticket bodies rather than in one module's header.
Clause 5 is what pays that cost back — the fit-check lives in the frame's own test, next to the
arithmetic, and it is the thing that fails if either number moves.

**D. A new layout module owning all five constants.** Rejected — a single-use abstraction over two
integers (coding rule 6), and a third home for numbers that already have two.

## Consequences

- **`ABC-016` stays `M` (3) and `ABC-017` stays `S` (2).** No size moves, and the 5-point combined
  unit does not get created.
- **Both tickets can go green alone.** The asymmetry the Orchestrator measured (*"`ABC-017`'s own `A1`
  cannot be evaluated before `ABC-016` lands"*) was real, was correctly measured, and is **dissolved
  rather than accommodated** — the clause that created it is struck.
- **One new obligation, on the second panel ticket to land:** clause 5's fit-check in
  `src/frame.test.ts`. It replaces three shadow constants with imports and adds a `≤ 24` clause. No
  production change; a handful of test lines.
- **Two ticket-text edits are owed and are NOT taken here** — `A1` and `A11`. `plans/tickets/` at the
  `ABC-016` / `ABC-017` promotion boundary is a BA/PM hop's; this ADR is the input to it.
- **A hole in a merged suite is now named:** `src/frame.test.ts:632-638` passes on all six mutants.
  Clause 5 closes it. It is a suite hole, not a production defect — `src/frame.ts` is correct and is
  not touched.
- **`NFR-002` gains a structural link, not a target change.** That row's write half carries *"a 23-row
  frame at `W = 18`, 418 characters serialized"* as its measured denominator. If a panel ever ships a
  different row count, that denominator silently stops describing the delivered frame. Clause 5's
  fit-check is what makes such a change fail loudly. Recorded in the catalog's `NFR-002` section; **no
  target and no measured figure moves.**
- **What this ADR does not decide.** `HISTORY_COLS`'s value stays the engineer's (epic `4a`'s split),
  subject to `ABC-017`'s stated requirement. Which panel sets the frame's `W` is a width question and
  is untouched here. And nothing about `ABC-019`'s render seam changes.

## Rollback

Cheap and complete, because nothing in production depends on it: delete the fit-check from
`src/frame.test.ts` (restoring the three shadow constants) and put the `frameHeight(...)` clause back
into `A1` with a real import. That returns the project to Alternative A and re-acquires its coupling
between merge order and the blocking `typecheck` gate. Since this ADR adds **zero production lines**,
rollback cannot break any delivered behaviour — the only thing at risk either way is which assertion
can fail on a row-count change.
