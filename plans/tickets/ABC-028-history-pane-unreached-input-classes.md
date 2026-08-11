---
id: ABC-028
title: The history pane's three unreached input classes — a length-preserving mutation, an odd slid window, and the during-render clause over the whole GameHistory graph
status: backlog
column: Backlog
size: S
priority: P1
epic: EPIC-002
feature: —
---

# ABC-028 — the history pane's three unreached input classes: a length-preserving mutation, an odd slid window, and the during-render clause over the whole `GameHistory` graph

> **Cut 2026-08-12 by BA/PM** (task `abc017-cut-2026-08-12`, subtask `refinement-ABC-017-cut`,
> Workflow 07), from the four accepted risks `ABC-017` **merged carrying**. `ABC-017` is `Done` and is
> **not re-opened, not moved, and not edited** by this hop — this ticket is the home its leftovers did
> not have.
>
> **THIS IS A HARDENING TICKET, NOT A DEFECT TICKET. The delivered pane is CORRECT on every input
> below**, and three roles measured that independently: QE found zero code defects twice, Security/NFR
> found zero, and `src/history-pane.ts` is md5 `54fd4346dcc1a0060c4e66ae0149265d` — unchanged from the
> Engineer's second dev hop, through two QE passes, a Security/NFR gate and the merge. **Every item
> here is a gap in what a criterion ASKS.**
>
> **The expected production diff is ZERO lines.**
>
> | risk | what survives, and where it came from |
> |---|---|
> | `RISK-ABC017-01` ⭐ | **`WCACHE-LEN`** — a cache invalidated on `moves.length` — **passes `A14` exactly** and survives 744/744. Its only catcher in the whole project is the **incidental fixture sharing** in `src/history-pane.nfr.test.ts`, which `ABC-017`'s own merged text and a signed comment at `:106-112` both declare free to remove. **QE said in words it would not carry this one.** |
> | `RISK-ABC017-02` | **`WLEAD-ODD`** — the leading-half-row correction applied at **even** ply counts only — survives 744/744. `A6`'s fourth anchor is **20 plies, EVEN**, so the black-anchored **odd** slid window is reached by nothing. |
> | `RISK-ABC017-03` | **`WFENMID`, `WPOSMID`, `WBOARDMID`, `WMOVESWAP`** all survive 744/744. `A9`'s *"at no point DURING a render"* is closed for the **contents** of `moves` and open for `initialFen`, `position`, `position.board` and the `moves` property **binding**. |
>
> **`RISK-ABC017-01`'s text half is ruled here and it needs NO edit to merged text.** `ABC-017` says
> *"`A11` may be tidied to per-test fixtures freely and nothing is lost"* and the file comment says the
> same. That sentence is **FALSE today** — and `A2` below **makes it TRUE** rather than correcting it.
> Closing the gap that falsifies a sentence is better than editing the sentence, and it is the only
> repair that also removes the trap. **The interim exposure is real and is named in
> `## Dependencies`.**

## Problem

*User*: two of them, and neither is hypothetical.

1. **The player who takes a move back.** `EPIC-006` owns `undo`, and `ABC-017`'s own `A7` already
   requires `takeBack` by name.
2. **The next engineer to open `src/history-pane.nfr.test.ts`** — which, on the current merge order,
   is `ABC-019`'s engineer, the next hop.

*Pain*:

- **A cache keyed on `moves.length` shows the player the move they just took back.** Measured on the
  delivered pane at this hop: after `playMove b8c6` the last row is `37. Nb1 Nc6`; after
  `takeBack(1)` and a **different** move `g8f6` it is `37. Nb1 Nf6` — **same `moves.length` of 21,
  different content**. `A14` renders the same object twice across an **append**, so a length-keyed
  cache satisfies it exactly.
- **The merged tree contains a signed instruction to delete the only guard that catches it.**
  `src/history-pane.nfr.test.ts:106-112` reads *"THE SHARING HERE IS NO LONGER LOAD-BEARING, and that
  is now measured rather than argued … So these may be rebuilt per test freely."* It is written in the
  form a later reader trusts **because it says it was measured** — and the measurement it reports is
  real but narrower than the claim drawn from it.
- **A black-anchored game of odd length gets a phantom empty white cell in row 1 and silently loses a
  ply**, under a build that renders `A6`'s brand-new fourth anchor perfectly.
- **`A9` has now been repaired three times and its class is still open.** See `## Test notes` for the
  pattern and why this ticket refuses a fourth per-field patch.

*Value*: the pane's two load-bearing promises — *it shows the caller's current game* and *it is
exactly `HISTORY_ROWS` rows* — keep working after the next tidy-up, the next undo, and the next
loaded FEN. **Nothing here adds a feature. It stops three measured wrong builds from being
indistinguishable from the right one.**

## Scope

**Test-side only, in the two files that already exist.** No production line, no new module, no new
test file, no new dependency.

- `src/history-pane.test.ts` — three new fixtures and their assertions (`A1`, `A3`, `A4`).
- `src/history-pane.nfr.test.ts` — the `A2` demonstration, and whatever the `A2` result obliges the
  fixture-sharing comment at `:106-112` to say.

## Out of scope

- **Any production line.** `src/history-pane.ts` is correct on every input in this ticket and its md5
  must be `54fd4346dcc1a0060c4e66ae0149265d` at the end. If a criterion here appears to require a
  production change, **stop and report** — it means the criterion is wrong, which is this ticket's own
  subject.
- **Re-opening, editing or moving `ABC-017`.** It is `Done`. `A1`–`A14` are discharged and none of
  them moves. This ticket carries new criteria of its own; it does not amend theirs.
- **`src/history-pane.ts:30`'s unqualified comment, `A11`'s scope word, the load probe's roots and its
  stdout channel.** All four are **`ABC-029`'s**, deliberately — they are one subject (what
  `A11`'s clause covers and what its guard reaches) and this ticket is the other (what the pane's
  own output and caller contract require).
- **`G5` / `AR-4` — the `HISTORY_COLS` self-comparison.** `WCOLS24R` still survives; it is
  **deliberately unhomed** by three roles and this hop upheld that. `HISTORY_COLS` **HOLDS at 21**. No
  widening, no criterion here or anywhere, **no constant-FRAME-width criterion** (`ADR-0010` cl. 5 and
  cl. 7 refuse it and `W` varies by design). `ADR-0009` and `ADR-0010` are `accepted` and **not
  re-opened**.
- **The supplied-FEN width and compute path (`AR-1`).** Ruled at the cutting hop: the **compute** half
  is closed by `ABC-010`, the **width** half is not. Neither is this ticket's. See
  `## Dependencies`.
- **Tidying `A11`'s fixtures to per-test.** `A2` establishes that it *may* be done; it does not ask
  for it. The Engineer declined it once with three measured reasons and that decision stands.

## Acceptance (Given/When/Then)

**Every criterion names the wrong build it must kill and the lane that build must die in.** All four
builds below **survive 744/744 on 26 files with skip 0** today — QE's measurement, on builds QE
constructed from its own definitions.

**A1 — freshness across a mutation that does NOT change `moves.length`. Given** the black-to-move
anchor `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 27` carried to **20 plies** by the
knight cycle, **when** the pane renders it, then the caller plays `b8c6`, the pane renders **the same
object**, then the caller calls `takeBack(history, 1)` and plays a **different** legal move `g8f6`,
and the pane renders **the same object** a third time, **then** the second and third panes **differ**
— the last row moves from `37. Nb1 Nc6` to `37. Nb1 Nf6` — while `history.moves.length` is **21 at
both**.

*Witnessed at the cutting hop against the delivered pane, out of tree, so no number here is derived:*

```
render 1 (20 plies) last row:        "  37. Nb1            "   moves.length 20
after playMove b8c6:                 "  37. Nb1     Nc6    "   moves.length 21
after takeBack(1) + playMove g8f6:   "  37. Nb1     Nf6    "   moves.length 21
panes 2 and 3 differ: true
```

*This reproduces QE's measured consumer path exactly and is its **third** independent confirmation.*

**Kills `WCACHE-LEN`** — a pane memoising rows per `GameHistory`, invalidated when `moves.length`
changes. **It is the cache a competent engineer actually writes**, and it is more natural than the
naive `WeakMap` that never invalidates. It passes `A14` exactly and survives 744/744 today.

> **The discriminator is the SAME LENGTH, and that is the whole criterion.** An append-based freshness
> check — which is what `A14` is — cannot fail on a length-keyed cache, because the key moves. Do not
> weaken this to a second `playMove`.

**A2 — the freshness guard does not depend on another file's fixtures. Given** the fixtures at
`src/history-pane.nfr.test.ts:113` and following rebuilt **per test**, **when** the full suite runs
against `WCACHE-LEN` and against the naive `WCACHE`, **then** both still **die**, and the surviving
kills are in `src/history-pane.test.ts` — **not** in `src/history-pane.nfr.test.ts`.

**Equivalently and preferably, measured the way QE measured it:** running
`npx vitest run src/history-pane.test.ts` **alone**, with `src/history-pane.nfr.test.ts` **not loaded
at all**, `WCACHE-LEN` **fails**. Today it **survives 18/18** in that configuration while naive
`WCACHE` fails 1 of 18.

> **This is the criterion that MAKES A MERGED SENTENCE TRUE rather than correcting it.** `ABC-017`
> states *"`A11` can now be tidied to per-test fixtures freely and nothing is lost"* and
> `src/history-pane.nfr.test.ts:106-112` states the same. **Both are false today and both become true
> the moment `A1` lands.** The comment must then be re-read against this criterion and left saying
> only what is true of it — including that the property is now owned in
> `src/history-pane.test.ts`, so a reader looking for the guard finds it. **No merged ticket text is
> edited by this ticket.**

**A3 — the black-anchored slid window at ODD length. Given** the same anchor and cycle carried to
**21 plies** (ODD), **when** the pane renders, **then** **row 1's white cell is NOT empty — it holds
`Nc3`**; the pane has exactly `HISTORY_ROWS` rows of `HISTORY_COLS` characters; its eight row numbers
are the ordered list **30, 31, 32, 33, 34, 35, 36, 37**; and the last row is **FULL** —
`37. Nb1 Nc6`, both cells populated.

*Witnessed at the cutting hop, out of tree:*

```
20 plies (EVEN — A6's fixture)      21 plies (ODD — this criterion)
[  30. Nc3     Nb8    ]             [  30. Nc3     Nb8    ]
  …                                   …
[  37. Nb1            ]             [  37. Nb1     Nc6    ]
row 1 white cell "Nc3    "          row 1 white cell "Nc3    "
last row full: false                last row full: true
```

**Kills `WLEAD-ODD`** — `const leadingHalfRow = blackToMoveAtAnchor && plies % 2 === 0 ? 1 : 0`.

> **READ THIS BEFORE WRITING THE TEST — the row count and the move numbers CANNOT be the
> discriminator here, and a criterion that cannot fail on the build it exists to catch is the `D22`
> defect this ticket's parent paid for twice.** Measured at the cutting hop: the delivered pane
> renders the **same eight numbers 30–37** at 20 and at 21 plies, and `WLEAD-ODD` renders **eight rows
> with those same eight numbers and a full last row** at 21 plies. **Its only visible defect is row
> 1's white cell**, which it leaves empty while silently dropping the `Nc3` ply off the top of the
> window. **The white-cell clause is the assertion that reports; the other three are context and must
> not be mistaken for guards.**

**A4 — the during-render clause, stated ONCE over the whole `GameHistory` graph. Given** any of
`ABC-017` `A1`'s ten lengths, **when** the pane renders, **then** **no reachable slot of the supplied
`GameHistory` differs at any point during the render** — covering, and named so the criterion cannot
be satisfied by a subset:

| slot | wrong build that survives 744/744 today |
|---|---|
| `initialFen` | `WFENMID` — rewritten mid-render, restored before return |
| `position`'s scalar fields (`fullmoveNumber`, `blackToMove`) | `WPOSMID` |
| `position.board` — a `Uint8Array` | `WBOARDMID` |
| the `moves` property **binding** (not its contents) | `WMOVESWAP` — swaps the slot to a copy and back |
| the `moves` **contents** | `WSPLICE` — **already dead** on `A9`'s freeze, and must STAY dead |

**and** the instrument is **live across the interval** — not a before/after pair, which `D26` already
established cannot express the property — **and it is ARMED**: a control asserts the instrument
reports a mutation it is supposed to catch, so it cannot pass by being unable to look.

*(**Two instrument facts MEASURED at the cutting hop, because a criterion that cannot discriminate its
own guard is not testable — the `D27` bar, applied to this hop's own output.***

> ***`Object.freeze` CANNOT be the instrument for this criterion.*** *Measured:
> `Object.freeze(new Uint8Array(8))` throws `TypeError: Cannot freeze array buffer views with
> elements`, so `position.board` is not merely uncovered by `A9`'s instrument — it is **uncoverable by
> that instrument's kind**. And freezing `history.moves` leaves the **slot writable**: reassigning
> `history.moves` after the freeze **succeeds**, which is `WMOVESWAP` mechanically.*
>
> ***So the instrument this criterion needs does not exist yet and has not been demonstrated.*** *A
> `Proxy` over the graph, or a structural digest sampled from inside the render, are the two shapes
> that could work; neither was built here, because this hop wrote no code. **This is why item 4 of the
> Definition of Ready is ❌ and this ticket sits in `Backlog`.***)*

## Dependencies

- **`ABC-017` is merged.** Nothing here is blocked by it, and nothing here may edit it.
- **`ABC-029` shares one file with this ticket** — `src/history-pane.nfr.test.ts`. **They must not run
  concurrently in two worktrees.** Either order works; the second to land rebases. This is the one
  reason `INVEST`'s *independent* is recorded ⚠️ rather than ✅.
- **`ABC-019` is in flight and is the next hop into `src/history-pane.nfr.test.ts`.** That is this
  ticket's trigger and its interim exposure: **until `A1`/`A2` land, the comment at `:106-112` is a
  live invitation to delete the sole catcher for `WCACHE-LEN`.** The Orchestrator has put the hazard
  into `ABC-019`'s brief; **a brief is transient and the comment is permanent**, which is why this is
  `P1`.
- **`EPIC-006` owns `undo`** and is the consumer that makes `A1`'s path a product path rather than a
  test path.
- **Not dependent on `ABC-010`.** `AR-1`'s width and compute path is ruled separately and is neither
  this ticket's nor `ABC-029`'s.

> **The one conditional this ticket carries, stated with an owner rather than left implicit.** If this
> ticket is **not** scheduled before the next hop opens `src/history-pane.nfr.test.ts`, then
> `RISK-ABC017-01`'s text half needs the correction after all — the false sentence lives at **three
> sites** (`ABC-017`'s amendment header, `ABC-017`'s `A14` block, and
> `src/history-pane.nfr.test.ts:106-112`), and `ABC-016`'s `R1`/`D27` is the precedent for what
> happens when a repair is audited at the site it names rather than every site it points at.
> **Owner: BA/PM, who authored the sentence. Not this hop's, and not the Engineer's.**

## Security / NFR triggers

- **`NFR-008` / `N8-LANE` — and this is the one with a live margin, not a formality.** The lane's
  running total is **~575 ms of the 650 ms content allowance (~88%)** after `ABC-017`'s fixture hop,
  of which **~102 ms is the `RF-1` child process**. **Measurable target: this ticket's delta, measured
  by `N8-LANE`'s own method — CPU (user + sys), median of paired per-round deltas, n ≥ 7 interleaved
  rounds, with a null control by identity — must leave the total ≤ 650 ms**, and `ADR-0008`'s ratified
  clauses must still hold: `npm test` with `PERFT_DEEP` unset ≤ **3 s wall** and ≤ **13 s CPU**.
  **File count must stay TWO** — no new test file — so the ~320 ms floor allowance does not move.
  > **The margin is ~75 ms and TWO tickets are competing for it.** `ABC-029` touches the ~102 ms item.
  > **If both land without measuring, the bar is plausibly breached, and the ticket that lands second
  > pays.** Whichever lands second must re-measure the total, not its own delta alone. `ABC-026` owns
  > the lane total and is the escalation route if it breaks. **No bar is re-derived by this ticket.**
- **`NFR-002` — untouched, and this ticket must not touch it.** Its `O(window)` structural premise is
  about production runtime importers, measured **ZERO** by module-graph closure. This ticket adds
  **zero production lines** and imports nothing new into `src/history-pane.ts`. The 150 µs pane bar,
  the 3x ratio and the `< 16 ms` frame target are all untouched.
- **Security: NONE, and it is not pre-waived.** Test-only, zero production lines, no new dependency
  (`package.json` `dependencies` is `{}`), no input reaches the process from outside it. **Firing
  threshold, so this is falsifiable rather than a shrug: any production line at all, or any new
  file.** Either means the ticket has changed shape and Security/NFR is owed a look.
- **Skip count must be `0`** and `quality.gate_enforcement` is `blocking` — a criterion that cannot be
  satisfied is left **failing or unwritten**, never skipped. `ABC-019`'s `A20` is the precedent.

## Test notes

1. **`A9` HAS BEEN REPAIRED THREE TIMES AND THE PATTERN NEEDS NAMING — this is the note that is
   supposed to end the series.** `D10`/`D11` moved a snapshot taken too late; `D23` moved fixtures
   rendered too early; `D26` changed the *kind* of measurement from a point-pair to an interval
   instrument. The Engineer's own reading was that a fourth would not arrive because the kind had
   changed. **He was right about the kind and wrong about the coverage**, and the honest name for the
   pattern is not *"`A9` keeps being wrong"* — it is: **`A9`'s subject is an OBJECT GRAPH, and it has
   been repaired once per node of that graph.** `GameHistory` is `{ initialFen, moves, position }` and
   `position` carries a `Uint8Array`. Four repairs, four slots. **The pattern predicts the fifth
   repair exactly: whichever slot the instrument does not reach.** That is why `A4` above is written
   **once over the whole graph** instead of as three more clauses — a per-slot repair is what
   guarantees a fifth.
2. **Do not put `A1` inside `A14`.** `A14` is discharged on a `Done` ticket and does not move; more to
   the point, `A14`'s object is mutated by an **append** and `A1`'s by a **length-preserving** edit.
   One test asserting both would report one verdict for two different diagnoses, which is the rule
   `## Test notes` on `ABC-017` set and this ticket inherits.
3. **`A1`'s and `A3`'s fixtures must be SEPARATE objects**, built by two calls to the 20/21-ply
   builder. `A1` plays moves on its object; a shared one would corrupt `A3` depending on test order —
   a hazard this pane has already paid for twice.
4. **Re-measure before writing an expected value.** Every number in this ticket was witnessed against
   the delivered pane at the cutting hop and is quoted with its measurement, but the standing rule on
   this pane is that **a criterion carrying a number nobody ran is how it has been wrong before.**
   Measure, then write.
5. **The `A4` instrument is the risk in this ticket, not the fixtures.** Build it and arm it before
   writing the criterion's assertions; if no instrument discriminates all five builds, **report that
   and stop** rather than writing a criterion that covers four. A criterion that cannot discriminate
   its own guard is `D27`'s defect.
6. **`A2` is a measurement, not a refactor.** It requires demonstrating that the sharing is no longer
   load-bearing. It does **not** require rebuilding those fixtures per test — measured at the
   `ABC-017` fixture hop, that costs ~9.3 ms per rebuild (6.0 ms of it the 2,000-ply shuffle) and
   buys nothing.
7. **Expect nine survivors to stay dead.** `WLEAD-A/B/C`, `WFENSET`, `WSPLICE`, `WFREEZE`, `WCACHE`,
   `WDYNIMP`, `WBAREIMP` are all killed on the merged tree. Re-run them; do not trust this list.

## Size and priority rationale

**Size `S` (2).** Three fixtures, one instrument, one measurement, in **two files that already
exist**; **zero production lines, zero new modules, zero new test files, zero new dependencies, no
architecture change.** Calibrated against this project's own band: `ABC-017` carried `S` through seven
re-derivations for *"layout and numbering over a slice of an existing list"* **including its 145-line
production module**, and its fixture hop — `A6`'s fourth anchor, two `A9` clauses, `A14` **and** a
child-process module-graph load probe — was absorbed inside that same `S`. A test-only successor to
part of that work is not larger than the whole of it. **`ABC-024` (`S`) is the closer calibration:
five criteria, named discriminating mutants, one existing file, zero production lines.**

**Not `M`.** The one thing that would move it is a production line or a criterion forcing one, and
`## Out of scope` refuses both — the delivered pane passes every criterion here today.
**`SPLIT_REQUIRED` does not apply**: the rule bites at `XL` (8) and this is 2, four sizes clear. The
useful check is the one the number cannot answer — **a split must produce two independently valuable
tickets** — and `A1`/`A2` are one property with its demonstration, while `A3` and `A4` land in the
same file, in the same hop, guarding the same module. Splitting would manufacture tickets that can
only be worked in one place by one engineer.

**Priority `P1`, and the reason is a DATE, not a severity.** Applying this project's latent/live test:

- **Not `P0`.** Nothing is broken. The delivered pane is correct on all four builds, verified by two
  gates independently, and no consumer observes any of it today.
- **Not `P2`.** `ABC-024` and `ABC-026` are the `P2` calibration and both are passive gaps waiting for
  someone to walk into them. **This one is not passive.** The merged tree carries a signed,
  measured-sounding instruction to delete the only remaining catcher for `WCACHE-LEN`, and the next
  hop into that file is **`ABC-019`, which is unblocked and last in the merge order**. The trigger is
  dated and it is now.

> **One objection, recorded rather than buried, because this ticket's parent refused this exact move
> three times.** `ABC-017` ruled — at `ADR-0009`, at `D23` and again at the gaps hop — that **letting
> a guard gap re-rank a product is the same error as letting a checklist defect do it.** That ruling
> is not breached here and the distinction is worth stating: those refusals protected the **product**
> rank of a droppable feature. **`ABC-028` is not a feature and has no product rank to distort** — it
> is a guard ticket, and a guard ticket's priority is set by its trigger date. If the Orchestrator
> judges the warning already in `ABC-019`'s brief to be sufficient mitigation, `P2` is defensible;
> **I do not take that view, because a brief expires at the end of a hop and the comment does not.**

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-12**. **Result: 8 of 10 clean, 1 ⚠️ and 1 ❌ — the Definition of Ready is NOT met and this
ticket stays in `Backlog`.** It is recorded item by item rather than smoothed, because a ticket that
fails the DoR belongs in `Backlog` and not in "almost ready" — the standard `ABC-024` and `ABC-026`
both set here.

- **problem clear — user, pain, value stated** ✅ — two named users (the player who takes a move back;
  the next engineer into the file), the pain measured on delivered code at this hop, and the value
  stated as the two promises the pane already makes.
- **scope and out-of-scope clear** ✅ — scope is two existing files and zero production lines;
  `## Out of scope` draws seven fences, each with an owner, including the three most tempting adjacent
  jobs (`G5`, `A11`'s scope word, tidying `A11`'s fixtures).
- **INVEST-shaped** ⚠️ — **valuable**, **estimable** (four builds already constructed and measured by
  QE; three fixtures witnessed here), **small** (`S`), **testable** for three of four criteria, and
  **negotiable**. **It is NOT fully independent**: it shares `src/history-pane.nfr.test.ts` with
  `ABC-029` and with `ABC-019`'s next hop. Recorded rather than claimed clean.
- **acceptance criteria clear, testable and measurable** ❌ — **`A1`, `A2` and `A3` meet the bar**:
  each names an exact fixture, an exact expected value witnessed at this hop, a **named discriminating
  build**, and the lane it must die in — and `A3` carries the measurement showing which of its four
  clauses is the discriminator, so it cannot be written vacuously. **`A4` does not.** Its instrument
  is undemonstrated, and measurement at this hop shows the obvious candidate is **unavailable**:
  `Object.freeze` throws on a non-empty `Uint8Array`, so `position.board` cannot be covered the way
  `moves` was. **A criterion that cannot yet discriminate its own guard is not testable** — the exact
  bar `D27` set on this family — so this is ❌ and not ⚠️. On this ticket's parent a ⚠️ was twice the
  shape a defect hid in.
- **dependencies known** ✅ — one file-sharing dependency in the direction it runs, one in-flight
  consumer, and one explicit non-dependency (`ABC-010`).
- **security/NFR triggers marked, each with a measurable target** ✅ — `N8-LANE` with a numeric
  target (**≤ 650 ms content, ≤ 3 s wall, ≤ 13 s CPU**), the measurement **method** named, the
  **~75 ms margin** stated, and the cross-ticket contention with `ABC-029` written down; security
  **not pre-waived**, with a firing threshold (**any production line, or any new file**).
- **test notes present** ✅ — seven, including the `A9` pattern this hop was asked to name and the
  vacuity warning on `A3` that a naive reading would have walked into.
- **size assigned** ✅ — `S` (2), calibrated against `ABC-017` and `ABC-024`, with `SPLIT_REQUIRED`
  checked explicitly rather than by precedent.
- **priority assigned** ✅ — `P1`, derived from a dated trigger, with the counter-argument recorded.
- **no major unresolved blocker** ✅ — nothing external blocks it. The `A4` instrument question is
  **inside** the ticket, and it is counted once, above, rather than twice.

**Route to `Ready`: one item.** Demonstrate an instrument that discriminates all five builds in `A4`,
or split `A4` off and take `A1`–`A3` alone. **That is a BA/PM call at the next refinement hop and it
is deliberately not pre-made here**, because the honest answer depends on a measurement nobody has
taken.
