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

**AMENDED 2026-08-11 at task `design-stub-seam-and-nfr002` — clause 9 added, clauses 1–8 unchanged.**
The amendment is the last section of this file and it rules the **consumer** side that the original was
not scoped to: the stub panels the owner's parallel-build directive creates for `ABC-019`. Still
`accepted`, still no target and no level, still zero production lines.

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

| mutant | `A11` | `A1` | merged test (`:632-638`) | fit-check `=23` | fit-check `<=24` | H | `4b` |
|---|---|---|---|---|---|---|---|
| delivered as budgeted (9/3/8) | PASS | PASS | PASS | PASS | PASS | 23 | yes |
| M1 status ships 4 rows | **FAIL** | **FAIL** | PASS | **FAIL** | PASS | 24 | yes |
| M2 history ships 9 rows | PASS | **FAIL** | PASS | **FAIL** | PASS | 24 | yes |
| M3 history ships 10 rows | PASS | **FAIL** | PASS | **FAIL** | **FAIL** | 25 | **no** |
| M4 `renderBoard` ships 10 rows | PASS | PASS | ~~PASS~~ **FAIL** | **FAIL** | PASS | 24 | yes |
| M5 board 10 **and** history 9 | PASS | **FAIL** | ~~PASS~~ **FAIL** | **FAIL** | **FAIL** | 25 | **no** |

> **[CORRECTED 2026-08-11 at task `design-stub-seam-and-nfr002` — two cells of this table and fact 1
> below were WRONG, and the correction is written here rather than in place of the original because the
> error is more instructive than the fix.]** The column was headed *"merged shadow"* and scored PASS on
> all six. **Found by BA/PM at `repair-panel-tickets`, confirmed by the Orchestrator against itself at
> `20260810T221848Z-orchestrator-observation-8fa03331`, and re-measured here rather than transcribed.**
>
> `src/frame.test.ts`'s test at `:632-638` has **THREE** assertions, not one. `:633` is
> `frameHeight(shadows)` = 23 and `:634` is `frameHeight({9,4,8})` = 24 — both tautologies, and the
> original characterisation is right about them. **`:635-637` is not a tautology:** it is
> `assembleFrame(partsFor(playTo(4), { status: [4 rows] }), "unicode")` with length 24, and `partsFor`
> (`:119-127`) sets `board: renderBoard(game.position, …)` — **the REAL board.**
>
> **Measured, per mutant, on the `:635` assertion:** 24 / 24 / 24 / 24 / **25** / **25** against an
> asserted 24. So the merged test **FAILS M4 and M5** and is blind to M1, M2 and M3. Term by term:
> the **board** term is real and live; the **status** term is a 4-row literal override (blind to M1);
> the **history** term is `historyStub` padded to the shadow `HISTORY_ROWS` (blind to M2 and M3).
>
> **What this does NOT change: the ruling, or any clause.** The reason clause 5 is needed is **narrower
> than recorded and still sufficient** — the hole is M1/M2/M3, the two *panel* terms, and **M3 alone
> makes `4b` unreachable**, which is precisely what clause 5's `≤ 24` requirement catches. Alternatives
> A–D are unaffected; none of them turned on this cell pair.
>
> **What it adds, and it strengthens clause 6 rather than weakening it:** the merged test's one LIVE
> term is the one already read from delivered geometry as `renderBoard(...)`, and its two BLIND terms are
> the ones restated as a literal and a shadow. **Clause 6 is therefore not a new form — it is what the
> merged test already does for the board — and clause 5's whole job is to extend the same treatment to
> the two panel terms.** The same measurement is the clearest evidence for clause 9 (see the amendment):
> a term read as `.length` from delivered code can fail; a term restated cannot.
>
> The column header is corrected from *"merged shadow"* to *"merged test (`:632-638`)"*, because calling
> it the *shadow* assertion is what made a three-assertion test look like one literal sum. The
> Orchestrator's own account of how it verified this and still got it wrong is in that note and is worth
> reading beside this one.

Three facts fall out, and they are the whole basis of the decision:

1. ~~**The merged shadow assertion passes all six.** It is a tautology over three local literals: it
   proves `frameHeight`'s arithmetic and says nothing about any panel.~~ **CORRECTED 2026-08-11 — see
   the block above. The merged test passes FOUR of six: it FAILS M4 and M5 on its third assertion,
   which reads the real `renderBoard`. It is blind to M1, M2 and M3 — the two PANEL terms — and M3
   alone kills `4b`.** The original sentence is right about `:633`/`:634` and wrong about the test.
   Useful, correct, and not the protection anyone thinks it is — **that conclusion survives, on a
   narrower hole.**
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
`src/frame.test.ts:38-43` does, and **a restated term cannot fail on the panel it restates** —
~~the shadow form passes all six mutants~~ **CORRECTED 2026-08-11: the shadow/literal TERMS are blind to
M1, M2 and M3, which is the whole point of this rejection; the merged test as a whole fails M4 and M5
only because its board term is NOT restated. See the correction block in `## Context`. The rejection is
unaffected and is now measured term by term rather than test-wide.** It also reproduces
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
- **A hole in a merged suite is now named:** ~~`src/frame.test.ts:632-638` passes on all six mutants.~~
  **CORRECTED 2026-08-11 — it passes FOUR of six: it FAILS M4 and M5 on its third assertion, which reads
  the real `renderBoard`, and is blind to M1, M2 and M3 — the two PANEL terms. M3 alone kills `4b`. The
  hole is narrower than recorded and clause 5 still closes it; see the correction block in `## Context`.**
  It is a suite hole, not a production defect — `src/frame.ts` is correct and is not touched.
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

---

## AMENDMENT 2026-08-11 — clause 9, the CONSUMER side. Clauses 1–8 stand unchanged and not one word of them is edited.

Written by Architect/Design at task `design-stub-seam-and-nfr002` (Workflow 07), on the item the
Orchestrator's consolidated `frame-merge-order-2026-08-11` decision recorded as *"still owed"*: the
owner's directive to **build `ABC-019` in parallel against stub panels and merge it last** creates a
**third site** for `STATUS_ROWS` and `HISTORY_ROWS`, in a third file, and this ADR was scoped to two
tickets. The Orchestrator's own assessment was that clause 1 plus clause 5 *"plausibly covers a stub
seam, but plausibly is not ruled."* It is ruled here.

**This is an amendment, not a successor.** All eight clauses survive verbatim; nothing above is
struck, reworded or reinterpreted. A successor would have folded out a ruling that measurement
re-confirms, which costs a reader the reasoning. The amendment convention is this project's own —
`ADR-0003` and `ADR-0004` both carry their ratification records as dated sections under the original
text rather than in place of it. **Status stays `accepted`. No target and no level moves, so no owner
ratification is owed — the same distinction from `ADR-0008` the Status section already draws. Zero
production lines.**

### The question, in its hardest form

*Where do these constants live such that the real panels, the stub panels and `frameHeight` all
reference ONE definition — and does a stub panel satisfy "producer owns its count" or subvert it?*

### The answer, and it dissolves the question rather than answering it as asked

**There is no third constant site, because a consumer of panel rows must not name a count at all.**
The row counts' ONE definition is **the delivered rows themselves**; `readonly string[].length` is
the only form in which a consumer may read one. `frameHeight` is then not a third reader — it is
arithmetic a consumer never needs.

**A stub panel that RETURNS ROWS satisfies clause 1 exactly as `renderBoard` does** — it produces
rows, and its count *is* their length. It declares nothing, so nothing can drift from it. **A stub
panel that DECLARES A CONSTANT subverts clause 1**, and the subversion is precise: clause 1 says the
*producer* owns its count, and a test double that exports `STATUS_ROWS = 3` makes two modules
declare one number with nothing tying them — which is `ABC-017`'s own `D13` (*"two tickets carrying
the same magic number with nothing tying them is how the two come to disagree"*) reproduced at a
third site. So the honest answer is **"it depends on the stub's shape, and only one shape is
admissible"**, which is why a clause is needed rather than a reading of clause 1.

### The measurement that decides it, against merged `src/` and not against ticket text

**(i) `.length` is a total substitute for any declared count.** `assembleFrame(parts, mode).length`
equals `frameHeight({ board: parts.board.length, status: parts.status.length, history:
parts.history.length })` over **560 shapes with 0 mismatches** — status 0–10 × history 0–16 × five
message-region shapes (none / one / three / a 400-character item / 40 items) × both glyph modes. The
frame's row count is also **invariant under the message region**: 0, 1, 200 and one 100,000-character
item all give `H` = 23, so deriving from the *first* frame is safe whatever that frame happens to
carry.

**(ii) Three forms a loop can use to obtain the height it hands `beginFrameSession`, against the
row-count mutants that arrive when a stub is swapped for a real panel.** `4b` is
`beginFrameSession`'s own strategy choice on a 24-row TTY, and *overflow* means it chose in-place for
a frame taller than the viewport:

| mutant | `H` | **A** declares (loop states 9/3/8) | **B** imports (loop imports both constants) | **C** derives (`frame.length`) | `4b` needs |
|---|---|---|---|---|---|
| delivered as budgeted 9/3/8 | 23 | 23 PASS | 23 PASS | 23 PASS | in-place |
| M1 status ships 4 | 24 | 23 **FAIL** | 24 PASS | 24 PASS | in-place |
| M2 history ships 9 | 24 | 23 **FAIL** | 24 PASS | 24 PASS | in-place |
| M3 history ships 10 | 25 | 23 **FAIL — OVERFLOW** | 25 PASS | 25 PASS | append |
| M4 board ships 10 | 24 | 23 **FAIL** | 24 PASS | 24 PASS | in-place |
| M5 board 10 + history 9 | 25 | 23 **FAIL — OVERFLOW** | 25 PASS | 25 PASS | append |

**Form A fails all five mutants, and on M3/M5 it is a real defect rather than a stale number:**
`beginFrameSession` is told 23, chooses in-place, and emits **25 rows into a 24-row viewport — one
row beyond it**, so the frame origin scrolls off the top and epic acceptance `4b` is unreachable.
That is the same `4b` failure clause 4 struck `A11` for being unable to see, arriving through a
different door.

**(iii) Form B is mechanically impossible under the owner's parallel-build directive, and this was
run rather than argued.** A loop that imports `STATUS_ROWS` / `HISTORY_ROWS` from unbuilt modules,
compiled under **this project's own `tsconfig.json`** (strict, `moduleResolution: bundler`,
`allowImportingTsExtensions`), fails `tsc --noEmit` with **`TS2307` × 2, exit 2** — and an unrelated
file in the same program is red with it, because the typecheck is project-wide and `typecheck` is in
`quality.mandatory_gates` under `gate_enforcement: blocking`. **So form B against stubs requires the
stub module to EXPORT the constants, which is precisely the third declaration site.** This is the
same cost this ADR's `## Context` measured for the panel-to-panel edge, now measured for the
loop-to-panel edge.

**Form C is therefore the only form that is BOTH buildable against stubs AND correct at the swap.
That is forced by measurement, not preferred.**

**(iv) Clause 5's fit-check does NOT cover this, and that was checked rather than assumed.** Run
across all six mutants, clause 5's `= 23` and `≤ 24` verdicts are a pure function of the panels and
are **identical whatever the loop does**; on the budgeted world a form-A loop's literal 23 and the
panels' 23 agree *by coincidence* and both are green. **Clause 5 proves the real panels compose to a
frame that fits. It says nothing about whether the loop's session height equals the frame the loop
assembles.** Two different propositions; neither substitutes for the other. This is the concrete
reason "plausibly covers it" was not good enough.

**(v) The stub's chosen row count decides WHERE the failure lands.** With stubs at 3/8 a form-A loop
is **GREEN at `ABC-019`'s own gate** and breaks only after the rebase, at the one moment nothing in
the tree re-checks it. With stubs at 2/5, 1/1, 4/9 or 5/8 the same loop is **RED at its own gate**:

| stub status/history | `H` | form A caught at `ABC-019`'s own gate? | strategy the geometry requires |
|---|---|---|---|
| 3/8 (copied from the tickets) | 23 | **NO — green, landmine armed for the rebase** | in-place |
| 2/5 | 19 | YES — red here | in-place |
| 1/1 | 14 | YES — red here | in-place |
| 4/9 | 25 | YES — red here | **append** |
| 5/8 | 25 | YES — red here | **append** |

A 3/8 stub also **never exercises the append path at all**, so the loop's whole strategy branch goes
untested until a panel changes in production.

**(vi) `assembleFrame` does not normalise height** — two shapes one row apart return 19 and 20 — so
*"every frame's `length` equals the session height"* is a **real assertion that can fail**, not a
tautology. Form C gets that invariant for free; forms A and B do not, because their declared height
is not the frame's.

**(vii) The recommended shape was run end to end, not sketched.** One render seam of the exact
signature `ABC-019`'s `## Scope` already states — `(GameHistory, GameStatus, thinking) => readonly
string[]` — a stub seam at 2/5, the height taken from frame 1, one `beginFrameSession`, 13 frames for
1 initial + 12 plies, 13 writes, one strategy chosen once, `distinctHeights: [19]`. **The identical
loop code, unchanged, then ran against three real-geometry seams** and chose correctly every time:
9/3/8 → 23 in-place; status 4 → 24 in-place; history 10 → **25 append**, no viewport overflow in any
case.

> **[TRANSCRIPTION CORRECTED 2026-08-11 at task `design-adr-transcription-fixes`. The experiment
> STANDS, it was NOT re-run at this hop, and no clause is re-opened.]** The seam this experiment
> drove carried the **three** arguments `ABC-019`'s `## Scope` then stated; that ticket now specifies
> a **fourth** (`messages: readonly string[]` — see the block under 9b). **Neither conclusion a later
> reader is likely to draw from the mismatch is right: the ticket did not drift, and the experiment
> is not invalid.**
>
> Every figure above is a **height** — `distinctHeights: [19]`, and 23/24/25 with the strategy each
> requires — and heights are **invariant under the message region** by (i) of this same list (0, 1,
> 200 and a 100,000-character item all give `H` = 23). That invariance was re-measured at
> `abc019-a9b-2026-08-11` **at (vii)'s own 2/5 and 4/9 stub geometries**, so a fourth argument
> feeding the message region cannot move a single number here. **Corroborating, and read off the
> record rather than re-run by this hop:** the delivered `ABC-019` build carries the four-argument
> seam and reproduces exactly these two stub geometries — 2/5 → `H` 19 in-place, 4/9 → `H` 25 append.

### Clause 9 — the consumer rule

**9. A consumer of panel rows never names a row count. It reads `.length` from the rows it was
given, and that is the ONE definition all three sites reference.** Concretely, and this is the
whole clause:

- **(9a) `ABC-019`'s loop declares no row count and imports no panel.** It obtains its session
  height as `firstFrame.length` from the **first frame its render seam returns**, and holds that one
  value for the session — `beginFrameSession` is called exactly once, which is the property
  `src/frame.ts`'s own header rests on. The loop does not import `frameHeight`; it does not need
  the arithmetic when it has the rows. It may import `beginFrameSession`, which is merged.
- **(9b) The panels sit behind the ONE render seam `ABC-019`'s `## Scope` already declares** —
  `(GameHistory, GameStatus, thinking) => readonly string[]`, *"the loop supplies the render seam
  everything it draws, and the render seam derives nothing."* Frame composition, and therefore both
  panel constants, live entirely behind that seam where clauses 1–6 already govern them. **This is
  not a new seam: it is the seam that ticket already specifies, and clause 9 is the ruling that the
  count must not cross it.**

  > **[TRANSCRIPTION CORRECTED 2026-08-11 at task `design-adr-transcription-fixes`. NO CLAUSE IS
  > RE-OPENED: this fixes what the sentence QUOTES, not what it rules.]** The three-argument
  > signature above is `ABC-019`'s `## Scope` **as that ticket read when this amendment was
  > written**. It has since gained a fourth argument — `(GameHistory, GameStatus, thinking, messages:
  > readonly string[]) => readonly string[]` — and it was **forced, not chosen**: `A5` requires the
  > ambiguity candidate list to reach the frame's MESSAGE REGION and the seam has no second output
  > channel, so the three-argument form cannot satisfy the ticket's own criterion.
  >
  > **9b is unaffected by its own words.** It defers the signature to the ticket and rules only that
  > the row COUNT must not cross the seam — and that ruling was re-established **by measurement** at
  > `abc019-a9b-2026-08-11` rather than by assertion: `layoutMessageRegion` returns exactly
  > `MESSAGE_ROWS` rows in every branch, so assembled height is a **single** distinct value across
  > 0/1/4/200 items and a 100,000-character item at geometries 2/5, 4/9, 3/8 and 3/10. **A `messages`
  > argument cannot carry a row count.** So the ticket did not drift from this clause; the clause
  > pointed at the ticket, and the ticket moved where the clause said it may.
  >
  > **One attribution, because two nearby sentences are easy to merge and they are NOT the same
  > sentence.** *"The seam is not new and its arguments do not change"* is the **TICKET's** `[D27]`
  > (`plans/tickets/ABC-019-turn-loop-skeleton.md:242` as `main` reads today) — **not this ADR's** —
  > and it is the half the fourth argument falsifies, so repairing it is BA/PM's on the ticket. This
  > ADR's own sentence is the one immediately above this block: *"this is not a new seam: it is the
  > seam that ticket already specifies."* The fourth argument **confirms** that sentence rather than
  > contradicting it.
- **(9c) A test double for that seam lives in a TEST file, never in `src/` as a production module.**
  Merged `src/frame.test.ts` is the precedent — `statusStub` / `historyStub` are local functions in
  the test file, and the two unbuilt panels *"enter as fixed-height stubs"* there. A `src/` stub
  module would be production code that is dead the moment the real panels land, and under coding
  rule 12 it would then be flagged rather than removed, so it would linger.
- **(9d) A stub's row counts MUST DIFFER from the reference layout's 3 and 8.** Measured in (v):
  identical counts make a hardcoded height green at `ABC-019`'s own gate and defer the failure to
  the rebase. Two shapes are wanted and both are cheap — one that keeps `H ≤ 24` (e.g. 2/5 → 19,
  in-place) and one that pushes `H ≥ 25` (e.g. 4/9 → 25, append) — so the strategy branch is
  exercised before a panel change in production is the thing that exercises it. **This is the
  clause that converts a merge-time landmine into a build-time failure**, and it costs two literals.
- **(9e) The loop owes one assertion of its own: every frame's `length` equals the session
  height.** Real and falsifiable per (vi). It is the loop's half of `4a`'s session-constant
  geometry, and it is the only place that property is checked at all.
- **(9f) At the rebase, the re-gate must run the loop's tests against the REAL panels, not merely
  rebase and re-run against stubs.** The Orchestrator's *"green on stubs is not evidence about the
  assembled frame"* is strengthened, not restated: under clause 9 the loop's own code is
  swap-invariant (measured in (vii)), so the thing the re-gate is actually testing is the **seam
  wiring**, and only a real-panel run tests it.

### Alternatives considered for clause 9, and why each loses

**E. Move `STATUS_ROWS` / `HISTORY_ROWS` into `src/frame.ts` so all five row constants sit in one
module — reopened here because a third site is exactly the argument that would have carried it.**
Rejected again, and the new evidence *weakens* it rather than strengthening it: under clause 9 the
third site does not exist, so the premise is gone. Everything in Alternative C above still holds —
it edits a merged module for no behavioural gain (rules 9 and 10), inverts the direction
`src/frame.ts`'s header establishes, and makes a panel untestable without the frame — and it would
now **additionally** put the loop's session height on a constant rather than on the delivered rows,
re-acquiring every form-A failure in table (ii). **A single home for the numbers is worth less than
no home for them.**

**F. Let the loop import the two constants (form B) and simply not build in parallel** — i.e. treat
the owner's directive as the thing to give up. Rejected: the directive is the owner's, the cost of
form B is a project-wide blocking typecheck gate coupled to merge order (measured in (iii)), and
form C is strictly better than form B on every mutant anyway. **Nothing is being traded away here;
form C dominates.**

**G. A shared `src/panel-stubs.ts` imported by both the loop's tests and `src/frame.test.ts`.**
Rejected — a single-use abstraction over two arrays (rule 6) that is dead on arrival when the real
panels land, and it would be the third declaration site in person.

**H. Have the loop assert `frameHeight({...}) === 23` somewhere as a belt-and-braces check.**
Rejected: it is clause 5's assertion in a second place; written over restated terms it is the
tautology `src/frame.test.ts:633` already is (**measured blind to M1, M2 and M3 — the two panel
terms — per the correction block in `## Context`**); and a second copy of a check is how the two
copies come to disagree.

### One tension surfaced and deliberately NOT acted on

Clause 5's fit-check reads **one term derived and two declared** — `renderBoard(...).length`,
`STATUS_ROWS`, `HISTORY_ROWS` — which a strict reading of clause 9 would make all three `.length`.
**Clause 5 is not reopened.** The two forms catch different things and the difference is real: the
`.length` form fails when the *delivered* geometry breaks the frame, while the constant form fails
when the *declared* geometry does and therefore checks the panel's declaration and its `A11`/`A1`
assertion jointly. **Both forms fail on all five row-count mutants of the `## Context` table** (the
budgeted world passes, as it must), because a real panel change moves the rows and the constant
together. Reopening an accepted clause for a near-tie is the refactor coding rule 10 forbids. **It is
recorded here so a later hop reads the mixed form as deliberate rather than as an oversight.**

### Consequences of clause 9 (added to the list above; nothing in it is retracted)

- **`ABC-019` gains no import edge to `ABC-016` or `ABC-017`** — in production or in test — so the
  project-wide blocking typecheck gate stays free of the merge order for the third ticket too. The
  build-order/merge-order split the owner's directive depends on is now structurally supported
  rather than merely intended.
- **Two acceptance criteria are OWED on `ABC-019` and are NOT written here** (`plans/tickets/` at
  this boundary is a BA/PM hop's): 9d's stub row counts, and 9e's session-height invariant. **Owner
  BA/PM.**
- **The stubs' 3 and 8, if a build already has them, are a defect to fix and not a style
  preference** — measured in (v).
- **`NFR-002` gains nothing and loses nothing from clause 9.** The frame's row count is unchanged,
  the write half's *"23-row frame at `W = 18`, 418 characters"* denominator is untouched, and the
  `< 16 ms` target does not move. What clause 9 adds is a second place a row-count change becomes
  discoverable — the loop's own gate, alongside clause 5's.
- **Rollback for clause 9 alone:** have the loop declare its height again. Cheap, and it costs
  exactly what table (ii) measures — five mutants, two of them a live `4b` breach. Zero production
  lines were added, so nothing delivered can break either way.
