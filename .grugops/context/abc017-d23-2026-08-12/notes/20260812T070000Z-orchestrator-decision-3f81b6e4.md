---
id: 20260812T070000Z-orchestrator-decision-3f81b6e4
kind: decision
by: orchestrator
at: 2026-08-12T07:00:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-027
supersedes:
---

# `ABC-017` back to `In Development`: the criteria hunt found a survivor with ZERO catchers

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Nothing here is a `finding`.**
> Written BEFORE the subtask that references it.

## The first rebase conflict of the round, and how I resolved it

`ABC-017`'s rebase onto `main` conflicted on `plans/traceability.md` — **three times**, once per
context-note commit, because each carried a traceability edit and `ABC-016`'s merged row now occupies
the same region.

**Resolved by ROW OWNERSHIP, not by line arithmetic**: `main`'s `ABC-016` row (the merged record,
15,871 chars) and the branch's `ABC-017` row (its own work, latest at each step). Verified after:
**37 table lines, exactly one `ABC-016` row, exactly one `ABC-017` row, zero conflict markers, pipe
count 11 on every resolved row.**

Gates after: **732/732 on 26 files**, lint/typecheck/build 0, skip 0 — **which is exactly the figure
BA/PM predicted from its out-of-tree simulation.** Two independent routes to the same number.

## The survivor — this is why the hunt was worth asking for

I asked BA/PM to hunt `A1`–`A12` for the shape that has appeared four times this round: a check that
**cannot fail**. It found one, and it is not a wording problem.

**`D23` / `A9`: its fixtures are module-scope singletons already rendered by `A1`, `A2` and `A6`, so
the snapshot is taken AFTER any first-render corruption.** That is **the `ABC-016` defect `A9` exists
to prevent, reproduced at file scope** — the criterion is structurally blind to the thing it guards.

Measured: mutant **`WPOS`** corrupts the caller's `history.position` once per object, changes **no
rendered byte**, and **passes 697/697 with ZERO catchers.** With fresh fixtures it fails. Rebuild
cost measured at **8.2 ms**, so `N8-LANE` is untouched and no bar was re-derived.

## The `A3` ruling, and why it struck rather than reworded

BA/PM **rejected the Engineer's suggested rewording and measured why.** Against mutant `W15`:

| clause form | verdict | ever the discriminator? |
|---|---|---|
| the eight-row table (asserted first) | **FAIL** | **yes** |
| `neither "e4 e5" nor "Nf3 Nc6"` (as worded) | PASS | no — unfalsifiable |
| whole-row `not.toContain` (as delivered) | **FAIL** | no — table fails first |
| `no row is numbered 1 or 2` (as suggested) | **FAIL** | no — table fails first |

**The suggestion swaps an absolutely-vacuous clause for a precedence-vacuous one.** Once a criterion
pins all eight rows, every statement about what the pane does *not* contain is a consequence of the
table. There is no position inside `A3` where such a clause carries information — so the clause was
**struck** and the property left to `A5`, which asserts it independently and non-vacuously.

Four smaller same-shape items went into `## Test notes` rather than becoming criteria, including
`A1` asserting its `= 8` tripwire before its row-count requirement **in one `it`** — the exact shape
the Engineer split `A13` for.

## `A13`'s trigger has fired

`ABC-016` **merged**, so the `TS2307` that justified the shadow constant is gone. BA/PM applied both
owed edits out of tree: typecheck clean, **732/732 on 26 files**. **Edit 2 is measured load-bearing**
— on mutant M1, both edits give 4 failures led by `expect(HEIGHT).toBe(23)`; **edit 1 alone gives 15,
led by an assertion naming the wrong subsystem.** The obligation lived only in a test docblock and
two notes; it is now on the ticket, which is what a rebase hop actually reads.

## A correction to my own brief, again

My brief gave the baseline as "697/697 on 24 files". **`ABC-016` had merged and I had not rebased
`ABC-017` — deliberately, because it had a live agent — so the number was stale.** BA/PM caught it
and measured the real one. The refusal to rebase under a live agent was right; **shipping its stale
consequence inside a brief was not.** This is the third consecutive hop where a number in my brief
was wrong, and the standing correction I adopted last hop is now applied: the new brief marks its
figures as attributed or unverified.

## One structural gap with no owner

**`HISTORY_COLS` is held at 21 for a cross-ticket reason that NO criterion on this ticket guards.** A
self-consistent 24-column build passes every width assertion in `A1`–`A12`, caught only by two
hardcoded slice offsets.

BA/PM **did not** propose widening it and **did not** add a criterion, with a principled reason I am
adopting: *a restraint taken for `ABC-027`'s benefit cannot be guarded by a criterion on this
ticket.* **That makes it a cross-ticket invariant with no home — which is Architect/Design's
question, not BA/PM's.** Queued, not dispatched: `ABC-027` is mid-`RF-1` and its answer may change
the shape of the question.

## Board

`ABC-017`: `In Review` → `In Development`. In Review 2/3 → **1/3** (`ABC-019`), In Development 1/3 →
**2/3** (`ABC-027`, `ABC-017`). Engineer work: `D23`'s fixture change plus `A13`'s two edits.
`S`/`P2` both hold — **a test hole does not re-rank a product.**
