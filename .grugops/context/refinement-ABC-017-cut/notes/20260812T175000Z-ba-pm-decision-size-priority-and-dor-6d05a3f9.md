---
id: 20260812T175000Z-ba-pm-decision-size-priority-and-dor-6d05a3f9
kind: decision
by: ba-pm
at: 2026-08-12T17:50:00Z
verified_by:
confidence: high
refs:
  - refinement-ABC-017-cut
  - ABC-028
  - ABC-029
  - ABC-017
  - ABC-010
  - ABC-024
  - ABC-026
  - ABC-019
  - EPIC-006
  - NFR-008
  - ADR-0008
  - agent-factory/checklists/definition-of-ready.md
  - 20260812T145000Z-ba-pm-decision-size-priority-lane-and-board-9b5c31a7
  - 20260812T154000Z-software-engineer-observation-lane-cost-measured-a20f5c73
supersedes:
---

# Sizes, priorities and DoR item by item: both `S`, `P1` and `P2`, and BOTH fail the Definition of Ready — with the ❌s named rather than softened

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, no
> self-attested stamp.

## Sizes — both `S` (2), and `SPLIT_REQUIRED` checked explicitly rather than by precedent

Band `XS=1 S=2 M=3 L=5 XL=8`. **No `XL`, so no `SPLIT_REQUIRED` is emitted.** The rule bites at 8 and
both are 2 — four sizes clear, so the arithmetic is not close, and the useful check is the one a
number cannot answer.

| ticket | what is owed | size |
|---|---|---|
| **`ABC-028`** | three fixtures, one interval instrument, one measurement — **two existing files, ZERO production lines, no new module, no new test file, no new dependency** | **`S` (2)** |
| **`ABC-029`** | one channel change on an instrument that already exists, one root-set unification, one comment in each of two files — **one existing test file plus ONE production comment line** | **`S` (2)** |

**Calibration, against this project's own band rather than a feeling.** `ABC-017` carried `S` through
**seven** re-derivations for *"layout and numbering over a slice of an existing list"* — **including
its 145-line production module** — and its fixture hop (`A6`'s fourth anchor, two `A9` clauses, `A14`
**and** a child-process module-graph load probe built from nothing) was absorbed inside that same `S`.
**A test-only successor to part of that work is not larger than the whole of it**, and changing a
channel on an existing instrument is smaller than writing the instrument. `ABC-024` (`S`: five
criteria, named discriminating mutants, one existing file, zero production lines) is the closer
calibration and both sit beside it.

**`SPLIT_REQUIRED`'s real test — a split must produce two independently valuable tickets.** Within
`ABC-028`, `A1` and `A2` are one property with its demonstration and `A3`/`A4` land in the same file in
the same hop; within `ABC-029`, `A2` is a **prerequisite** for one form of `A3`, which is the opposite
of independence. **Splitting either would manufacture a ticket that can only be worked after the
other, in the same file, by the same engineer.**

**The one condition that would move a size, named in advance rather than discovered mid-build:** if
the design hop chooses **form (a)** of `ABC-029`'s `A3` — the benchmark harness IS a production module
— then rooting a module that runs `main()` at import may require a production change in
`src/perft-bench.ts`. **`ABC-029`'s size is then re-derived, not inherited.** It is written into the
ticket.

## Priorities — `P1` and `P2`, both from the latent/live test

**`ABC-028` — `P1`, and the reason is a DATE rather than a severity.**

- **Not `P0`**: nothing is broken. The delivered pane is correct on all four builds, two gates found
  zero code defects, and no consumer observes any of it today.
- **Not `P2`**: `ABC-024` and `ABC-026` are the `P2` calibration and both are **passive** gaps waiting
  for somebody to walk into them. **This one is not passive.** The merged tree carries a signed,
  measured-sounding instruction to delete the only remaining catcher for `WCACHE-LEN`, and the next
  hop into that file is **`ABC-019`, unblocked for the first time and last in the merge order**.

> **The objection, recorded rather than buried, because `ABC-017` refused this exact move three
> times.** That ticket ruled — at `ADR-0009`, at `D23`, and again at the gaps hop — that **letting a
> guard gap re-rank a product is the same error as letting a checklist or a suite defect do it.**
> **That ruling is not breached and the distinction is load-bearing:** those refusals protected the
> **product** rank of a droppable feature. **`ABC-028` is not a feature and has no product rank to
> distort** — it is a guard ticket, and a guard ticket's priority is set by its trigger date. If the
> Orchestrator judges the warning already in `ABC-019`'s brief sufficient, `P2` is defensible; **I do
> not take that view, because a brief expires at the end of a hop and the comment does not.**

**`ABC-029` — `P2`.** Nothing is broken and nothing is imminent: production runtime importers are
**zero, measured**; `WPERFT-DYN` breaches `A11` **as literally worded** while the property `NFR-002`
depends on is intact; and the stdout route's trigger is **`EPIC-006`** — `P2`, undecomposed, not next.
**Not `P3`**, because `P3` is "someday" and this has a named trigger and a measured breach.
**Promote to `P1`** when `EPIC-006` is decomposed, or when any production module gains a module-scope
write to stdout.

## `N8-LANE` — NOT re-derived, and the contention is the finding

**Not re-derived and not moved.** The lane's running total is the Engineer's measurement and QE's
carry: **~575 ms of the 650 ms content allowance (~88%)**, of which **~102 ms is the `RF-1` child
process**. Both tickets add test content to the two already-declared files, so the **file count stays
TWO** and the ~320 ms floor allowance does not move.

> **What is mine: ~75 ms of margin and TWO tickets competing for it.** `ABC-029` touches the ~102 ms
> item and, under form (a) of its `A3`, may **add** to it. **So whichever ticket lands second must
> re-measure the TOTAL and not its own delta** — written into both tickets as an obligation, not a
> warning. `ABC-026` owns the lane total and is the escalation route if it breaks.

Each ticket's target is stated with its **method**, so it is checkable: CPU (user + sys), median of
paired per-round deltas, **n ≥ 7 interleaved rounds**, **null control by identity** — `N8-LANE`'s own
method — with `ADR-0008`'s ratified clauses still holding (`npm test`, `PERFT_DEEP` unset,
**≤ 3 s wall and ≤ 13 s CPU**).

**And one prediction I am deliberately NOT making.** The last hop's BA/PM predicted *"tens of
milliseconds"* and the Engineer measured **+164–182 ms — low by about 5x**. **I am not offering a cost
table for these two tickets.** The honest reason: the dominant term last time was a process spawn
nobody predicted, `ABC-028`'s `A4` instrument does not exist yet, and a figure I cannot derive would
be inherited by the hop that should be measuring. **Both tickets say "measure it" and neither carries
a number to trust.**

## Definition of Ready — assessed against `agent-factory/checklists/definition-of-ready.md`, honestly, item by item

**Both tickets FAIL the Definition of Ready and both stay in `Backlog`.** That is `ABC-024`'s and
`ABC-026`'s standard, and the brief was explicit: **do not smooth a ticket into readiness to make the
list look finished.**

| # | check | `ABC-028` | `ABC-029` |
|---|---|---|---|
| 1 | problem clear | ✅ | ✅ |
| 2 | scope and out-of-scope clear | ✅ | ✅ |
| 3 | INVEST-shaped | ⚠️ | ⚠️ |
| 4 | acceptance testable and measurable | **❌** | **❌** |
| 5 | dependencies known | ✅ | ✅ |
| 6 | security/NFR triggers, each measurable | ✅ | ✅ |
| 7 | test notes present | ✅ | ✅ |
| 8 | size assigned | ✅ | ✅ |
| 9 | priority assigned | ✅ | ✅ |
| 10 | no major unresolved blocker | ✅ | **❌** |
| | **result** | **8 of 10, 1 ⚠️ 1 ❌** | **7 of 10, 1 ⚠️ 2 ❌** |

**Item 3 (⚠️ on both) — not fully independent.** Both edit `src/history-pane.nfr.test.ts`, so they
must not run concurrently in two worktrees; `ABC-029` is additionally **estimable only under one of
the two rulings**. Recorded rather than claimed clean.

**Item 4 (❌ on both), and the two ❌s have DIFFERENT causes — which matters, because the routes out
differ.**

- **`ABC-028`: the criterion is written but its instrument is undemonstrated, and the obvious
  candidate is measurably unavailable.** `A1`, `A2` and `A3` each carry an exact fixture, an expected
  value **witnessed at this hop**, a named discriminating build and its lane — and `A3` additionally
  carries the measurement showing **which of its clauses is the discriminator**, so it cannot be
  written vacuously. **`A4` cannot yet name an instrument that works**: `Object.freeze` throws on a
  non-empty `Uint8Array`, so `position.board` is uncoverable the way `moves` was. **`D27` set the bar
  on this exact family — a criterion that cannot discriminate its own guard is not testable — and I am
  applying it to my own output.** **❌ and not ⚠️, because on this ticket's parent a ⚠️ was twice the
  shape a defect hid in.**
- **`ABC-029`: the criterion cannot be written at all, because its content is undecided.** `A3`'s two
  forms assert **opposite verdicts on the same build**. **The contrast with `ABC-010` is the point:**
  that ticket carries an open design question and still scores item 4 ✅, because its question changes
  *where a check lives*; this one changes *what a criterion says*.

**Item 10 — ✅ on `ABC-028`, ❌ on `ABC-029`, and the asymmetry is deliberate rather than sloppy.**
`ABC-028`'s instrument question is **inside** the ticket and is counted **once**, at item 4, rather
than twice. `ABC-029`'s design question is **outside this role** — a dev hop answering it in passing
would be deciding architecture in development, which `ABC-010`'s own flag exists to prevent.

**Routes to `Ready`, one item each:**

- **`ABC-028`** — demonstrate an instrument that discriminates all five builds in `A4`, **or** split
  `A4` off and take `A1`–`A3` alone. **A BA/PM call at the next refinement hop, deliberately not
  pre-made here**, because the honest answer depends on a measurement nobody has taken.
- **`ABC-029`** — one **Architect/Design** hop on the open design question, after which `A3` is
  written in one form, the size is re-derived if form (a) is chosen, and items 4 and 10 are
  re-assessed. **No owner input and no new measurement are needed beyond that** — which is
  `ABC-026`'s exact shape, and `ABC-026` reached 9/10 that way.

## Board move requested: NONE — and `plans/board.md` was NOT written

**Both new tickets land in `Backlog`, which is `unlimited`.** `Ready` is **0/8** and no WIP limit binds
this hop. **No existing ticket moves**, and in particular **`ABC-017` stays in `Done`** — it is not
re-opened, not moved, and its `status: done` / `column: Done` frontmatter is untouched.

| column | before | after | limit |
|---|---|---|---|
| `Backlog` | 8 rows | **10 rows** | unlimited |
| `Ready` | 0/8 | 0/8 — unchanged | 8 |
| `In Review` | 1/3 (`ABC-019`) | 1/3 — unchanged | 3 |
| `Done` | `ABC-017` among them | unchanged | unlimited |

**`plans/board.md` is the Orchestrator's and was not written.** The two Backlog rows are preserved
**verbatim** in the `artifact-ref` note beside this one.
