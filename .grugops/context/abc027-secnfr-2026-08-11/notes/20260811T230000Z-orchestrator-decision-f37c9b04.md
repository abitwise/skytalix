---
id: 20260811T230000Z-orchestrator-decision-f37c9b04
kind: decision
by: orchestrator
at: 2026-08-11T23:00:00Z
verified_by:
confidence: high
refs:
  - ABC-027
  - ADR-0010
  - NFR-002
supersedes:
---

# `ABC-027` → `In Security/NFR`, and the margin question goes to that gate rather than to BA/PM

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Nothing here is a `finding`.**
> Written BEFORE the subtask that references it.

## Verified, not accepted

QE's commit is **notes only**; `src/` untouched; **681/681 on 22 files** re-run by me after rebasing
onto current `main`.

## A column correction, stated plainly

QE requested `In Review` → **"Ready for Merge"**. **That column does not exist on this board.** The
13 columns are fixed in `plans/board.md` § Columns, and after `In Review` the flow is
`In Security/NFR` (when triggered) → `Ready for UAT` → `In UAT` → `Ready to Release` → `Done`.

I am not treating this as a mistake worth much — QE's *intent* was unambiguous (it is done, and it
should not be held) — but the board is the single source of WIP truth and inventing a column would
break the one file every role reads for state.

## Why Security/NFR is triggered here, and it is not a formality

- **It changes merged production code that every frame in the product passes through**, and it adds
  **+66 characters per frame** (`(H − 1) × 3`). `NFR-002`'s `< 16 ms` write bar is directly in scope.
- **QE's one open item is a risk, not a criterion gap, whatever it was labelled.** It is marked
  `UNKNOWN - verify` and it needs a named owner, a trigger and an accepted-risk record — which is
  Security/NFR's output format, not BA/PM's.

Every ticket in this project's history has taken this gate and returned `PASS_WITH_RISKS`. I am
routing on the trigger, not on the habit — but the habit and the trigger agree.

## The margin question, which is the real content of QE's hop

`ABC-027` makes `\x1b[K` fire at the **right margin** on every row. Before it, the only escape was
`\x1b[0J`, emitted once at column 0 — **never at the margin**. So the screen model's margin
representation became load-bearing for the first time **and has never been measured.**

Two readings, and they disagree by 9 rows per frame:
- The model lets `column` run to `columnCount`, making the erase a **no-op**.
- A VT/xterm keeps the cursor at `columnCount − 1` with wrap-pending, and `EL(0)` erases from the
  cursor — **that last cell**.

Under the second reading, at a terminal exactly `W` wide the delivered writer **loses the entire
h-file of the board plus its label**. **If that reading is right, this ticket introduces a regression
that hits EVERY frame, not just narrowing ones** — and the suite's `:379`, `:408`, `:426` and `A6` all
construct screens at exactly `W`, so its strongest assertions stand on the one behaviour nothing has
measured.

**QE marked it `UNKNOWN - verify` and refused to fabricate a terminal.** That is the correct call and
the reason this goes to a gate rather than to a wording hop.

## Not holding the ticket, and why

QE asked that the margin gap ride as a follow-up rather than a hold, on the grounds that it is
unmeasurable before `EPIC-006`, needs no production change, and holding costs `ABC-019` real work.
**I partly disagree and am splitting it:** the ticket moves forward, but it moves into the gate whose
job is exactly this, rather than past it. If Security/NFR can bound the risk, it records it and the
ticket proceeds. If it cannot, that is a legitimate stop and better found now than after merge.

## The other two items, routed but not dispatched

- **QE's flag-3 wording correction is sharp and I am carrying it verbatim**: `\x1b[0K` and `\x1b[K`
  are the **same sequence** (ECMA-48, omitted parameter = 0), and swapping them turns **8 tests red,
  five by throwing**. So the honest property is not *"any future writer change is gated by a model
  edit"* — it is **"any change to the BYTES is gated, including a semantically identical one. The
  model gates spelling, not meaning."** As worded, flag 3 invites the next engineer to read a red
  suite as fussiness. **BA/PM's, non-blocking.**
- **`A1` kills 9 of 14 mutants; `A2` — "the criterion the ticket exists for" — kills 2** and stayed
  green on 7, because it is trimmed (`F3`) and only one row per redraw has a non-blank tail. **A
  writer that clears only row 11 passes `A2` at both 80 and 120 columns.** Not a defect — `A1` is
  byte-exact and `A6` keys on a different row index — but **`A1` looks like a restatement of the
  production line and is not: it is where the mutants die.** Recorded so a future hop does not
  "simplify" it and gut the suite's mutation resistance without `A2` noticing.

## What QE did that I want on the record

It caught **two of its own mutants as equivalent** by reading the emission rather than trusting the
green, rewrote one into a genuine `ADR-0010` alternative D (which then died on `A1`), and **excluded
the other from the count rather than calling it a kill** — naming that as the same "check that cannot
fail" inflation it was flagging elsewhere. It also **measured** the Engineer's "sound there, not
reusable" claim instead of taking it, and found `A6`'s form false-positives on the **correct** build
at 80 and 120 columns.
