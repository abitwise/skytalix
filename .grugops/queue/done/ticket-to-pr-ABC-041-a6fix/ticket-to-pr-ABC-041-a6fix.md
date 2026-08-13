---
task: gate-abc041-2026-08-13
subtask: ticket-to-pr-ABC-041-a6fix
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-041-a6fix/
parent_ref: .grugops/context/quality-gate-ABC-041-regate/
ticket: plans/tickets/ABC-041-render-seam-closure.md
enqueued_by: orchestrator
enqueued_at: 2026-08-13T23:05:00Z
branch: grugops/ticket-to-pr-ABC-041-a6fix
worktree: ../cli-chess-dev041c
base: grugops/quality-gate-ABC-041-regate @ c3384ea
---

# Subtask: `A6`'s wording moved and its instrument did not. Three lines. Watch `X8` go red.

**Your `A4` block is DISCHARGED** — the gate reproduced your A/B/C matrix digit for digit and confirmed
the circularity is closed on measurement. **A new block was raised on `A6`,** and it is small, real,
and yours.

Read `parent_ref:` (QE's re-gate, 5 notes) first. **`X8`'s exact text is in those notes** — do not
reinvent it.

## The defect, confirmed by the Orchestrator independently

`A6`'s repaired wording (`plans/tickets/…ABC-041…:136-138`) demands the module's source contain zero
occurrences of **four** spellings: `process.`, the bare word `process`, `globalThis`, and
`import.meta`. The suite asserts **one** — `src/render-seam.test.ts:287`,
`expect(source).not.toContain("process.")`. I grepped the file myself: nothing anywhere else asserts
the other three over this module.

**Why this is worse than a plain gap.** The ticket page states those spellings were added *because* an
ambient read via `globalThis["process"]` was measured green against the narrow check. So the page
tells the next reader that a guard exists — and no guard exists. That is the inheritance harm the
first block was raised over.

## The fix

Three `expect(source).not.toContain(...)` lines in the **existing** `A6 / A7` row. **No new test, no
new file, no new module.** The lane allotment of 1 file is spent and `src/` must stay at 49 files.

**Watch it fail first.** Build QE's `X8` from the text in `parent_ref:`, confirm your three lines red
on it, then revert and confirm `src/render-seam.ts` is byte-restored. `X8` is typecheck-clean and
lint-clean and ships green today — that is the whole point of it.

## Explicitly NOT yours on this hop

- **Do not touch the ticket page.** QE ruled the wording is right and must not be shrunk to fit the
  instrument. The fix goes in the instrument.
- **Do not restore QE's deleted `A4 (width)` row.** QE disposed of it with mutants and a recorded
  reason — `X2b` reds `A4` while that row stayed green, so it was strictly weaker than the clause it
  duplicated. That disposal is the gate's.
- **`X5b`, `A8`'s import-statement blind spot** — homed to `ABC-053` / `ABC-054`, non-blocking. Leave
  them.

## Hard limits

- You are in `../cli-chess-dev041c` on `grugops/ticket-to-pr-ABC-041-a6fix`, off QE's tip `c3384ea`.
  `node_modules` is symlinked; **remove it before you finish.** Commit on that branch only — **never
  `main`, never another agent's branch.**
- **`src/render-seam.ts` must remain git blob `51e50a38…`** — the same object it has been at
  `ac17fe2`, `8dbe2b4`, `78a3db8` and `c3384ea`. Verify and say so.
- Baseline on your base: **827/827 on 29 files**, skip 0, all gates green. Run every mandatory gate
  plus test-integrity and record the numbers.
- Record under `ref:` as `claim` / `observation` / `decision` / `artifact-ref`. **No `finding` is
  admissible on this install**; never invent a `§14-gate#<id>` stamp.
- **Do not merge, do not deploy.**

## Stop condition

If closing `A6` honestly needs anything more than assertions over the module's source — a change to
the module, a new file, or a change to the criterion — **STOP and say so.** Four hops have now gone
into this ticket and each one found something real; a fifth that quietly grows scope would be the
first one that did not.
