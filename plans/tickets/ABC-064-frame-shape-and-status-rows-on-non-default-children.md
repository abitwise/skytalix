---
id: ABC-064
title: The frame's shape is pinned on one child of four, and no test asserts the status panel for any child but the default — UAT-5's and UAT-6's status clauses rest on the UAT run
status: in-development
column: In Development
size: S
priority: P2
epic: —
feature: —
---

# ABC-064 — three spawned children, nine rows compared, fourteen unasserted

> **Cut 2026-08-15 by BA/PM** (task `uat-ABC-042-followups-2026-08-15`, subtask `uat-ABC-042-cut`,
> Workflow 03) out of QE/E2E's `R7` (`.grugops/context/uat-ABC-042-qe/notes/`). **`ABC-042` is
> merged, `Done`, and both gates passed against it: its page is NOT edited and no criterion of its is
> re-opened.**

> **Line anchors corrected 2026-08-17, measured against `1a806ee`** (the delivery's base; `1a806ee`
> is a board commit and changes no `src/` file, so the anchors it carries are `6aedb7e`'s). Every
> `:NNN` on this page was stale — the page was cut 2026-08-15 and `ABC-061`, `ABC-066`, `ABC-068`,
> `ABC-062` and `ABC-063` have all appended to `src/cli.test.ts` since. `:162`→**`:244`**,
> `:226`→**`:308`**, `:274`→**`:356`**, `:780`→**`:933`**, and test note 4's `:186`→**the rank loop at
> `:266`-`:270`**. **All five were re-read line by line before being written here**, not copied from
> the table that supplied them. Substance is untouched: no criterion is re-worded, struck or added.
> Anchors are a `G-5`-class defect and will go stale again the next time this file grows.

## Problem

*User*: the human who runs `npm run chess -- --colour black` — a first-class row of `ABC-042`'s scope
table, not an edge case — and the signer who is asked to confirm UAT-5 and UAT-6.

*Pain*: **the frame's shape is asserted for one of the four accepted board-printing command lines,
and the status panel for none of the other three.**

- `src/cli.test.ts:244` pins the frame as a **byte-exact tail** — 23 rows, the eight ranks named
  individually, no frame row allowed to precede it — and `:308` pins **zero `ESC [`** and **exactly
  one trailing newline**. **Both run on `npmRun` alone.**
- For the `white`, `black` and `random` children, `:356` compares the **9 board rows only** (the file
  letter row included). **Their row count, their trailing newline and the absence of cursor control
  are asserted by nothing** — the other **14 rows** of each frame are unread.
- **No test asserts the status panel for any non-default child.** UAT-5's verdict includes *"It is
  still White's move"*; UAT-6's includes *"the word `random` never appears on the board **or in the
  status line**"*. The board halves follow from the byte-exact region; **both status halves rest on
  the agent's UAT run alone.**

*Value*: choosing a colour is the one option a human is most likely to use, and the append strategy —
no cursor control, one frame, one trailing newline — is what makes the output safe to pipe, tee and
paste. **After this ticket those properties are asserted on every child that prints a frame, not just
the one with no arguments.**

## Scope

- **New `it` blocks in `src/cli.test.ts`** asserting, for each of the three non-default board
  children (`white`, `black`, `random`): the frame's **row count**, **exactly one trailing newline**,
  and **zero `[`**.
- **The status rows asserted for the `black` and `random` children**, against the same reference the
  default child's tail is built from.
- **`random`'s status line checked for the word it must never contain.**

## Out of scope

- **Any new child process.** All three children are already spawned at module scope; the count is
  pinned at **10** (`:933`) and an eleventh is a defect.
- **`:244`, `:308` and `:356` — byte-identical.** `ABC-042`'s `A1`, `A7`, `A8` keep their exact
  instruments; the new assertions are separately named blocks over the same captured children.
- **Writing a row-count literal.** The expectation is derived from the reference frame the file
  already composes per (glyph mode, orientation) pair. `ABC-042`'s `A8` forbids a row-count literal
  in the entry point for a reason, and a test literal would go stale the day the pane's height
  changes.
- **The twelve blank move-list rows as a UAT concern.** That is the pack's gap `B7` and belongs to
  the parallel UAT Planner amendment hop (`uat-ABC-042-amend`). This ticket asserts that the rows
  are THERE; it says nothing about how they are explained to a signer.
- **A pty.** Piped children only. The terminal half is an open question for the Orchestrator,
  recorded in `.grugops/context/uat-ABC-042-cut/notes/`.
- **Any production line.** Zero.

## Acceptance (Given/When/Then)

- **`A1` (the frame's shape, on all three).** **Given** each of the `white`, `black` and `random`
  children, **then** its stdout has the **same row count as the reference frame for that child's
  (mode, orientation)** — **23 today, derived, not written** — and ends with **exactly one** trailing
  newline. **3 of 3.** *(Today: **0 of 3**.)*
- **`A2` (no cursor control, on all three).** **Given** each of the same three children, **then**
  stdout contains **zero** occurrences of `[`. **3 of 3.** *(Today: **0 of 3** — asserted on
  `npmRun` only.)*
- **`A3` (the status panel does not depend on the human's colour).** **Given** the `black` and
  `random` children, **then** their status rows are **byte-identical to the default child's status
  rows** — the human's colour changes orientation only, not whose move it is nor the material count.
  **2 of 2.** *(Today: **0 of 2**. If the delivered rows differ, that is a result to report to the
  Orchestrator, not a criterion to soften — see test note 2.)*
- **`A4` (`random` is resolved before anything can see it).** **Given** the `random` child's entire
  stdout, **then** the token `random` occurs **zero** times. *(This is UAT-6's status-line half; the
  board half already follows from `:356`.)*
- **`A5` (nothing else moved).** `git diff --name-only <the delivered commit>~1 <the delivered
  commit>` shows **exactly** `src/cli.test.ts` — **one path**, **zero production lines**, **zero new
  child processes** (`spawned` still `10`). Suite green, skip **0**.

## Dependencies

- **None open.** `ABC-042` is merged at `dbaf972`; the three children exist in the merged file.
- **Same-file neighbours, not blockers:** `ABC-058`, `ABC-059`, `ABC-061`, `ABC-062`, `ABC-063`. No
  shared assertion; any order works.
- **`ABC-061` is the natural predecessor and is NOT a blocker** — it pins what `--colour black`
  resolves TO; this pins what the child then prints. Either order works and neither assertion
  depends on the other's code.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**. **0 new test files, 0 new files under `src/`,
  0 new child processes.** The added work is string splitting and comparison over stdout already
  captured and already resident. **`N8-LANE` is `MET` at 0.23× (152.5 ms of 650 ms); this ticket must
  not move it.**
- **`NFR-002` not triggered.** The frame is **read** as text, never composed on a measured path; no
  production module is opened.
- **Security: not triggered.** `ABC-041`'s four clauses: no manifest touch, no non-`.test.ts` file
  under `src/`, no network, no write, **no new spawn**, blast radius one path.

## Test notes

1. **Reuse the reference frame, do not rebuild it.** The file already composes a frame per (glyph
   mode, orientation); `A1` and `A3` should both read from it, so that a change to the pane's height
   or the status text moves one place.
2. **Measure `A3` before asserting it.** The claim "colour changes orientation only" is derived from
   the merged status panel's contract, not from a reading of the `black` child. **If the delivered
   rows differ, stop and report** — a criterion bent to fit an unexpected measurement is the defect
   this whole follow-up set exists to prevent.
3. **`A4` must not be a substring test over the board region.** The word `random` could only appear
   in the status or message rows, which is precisely the region `:356` does not read; assert over the
   whole of stdout.
4. **One block per property, not one block per child.** Three children × three properties in nine
   blocks is noise; a per-property loop over the three children keeps the failure message specific
   (name the child in the assertion message, as the rank loop at `:266`-`:270` already does).

## Lane cost — how many test FILES this ticket implies

**Zero.** Blocks added to an existing file; no child process.

## Size and priority rationale

**Size `S` (2).** Three properties over three children plus two status assertions, all over captured
strings — no new fixtures, no new children, one reference already in the file. Bigger than `XS`
because `A3` needs a measurement before it can be written.

**Priority `P2`.** No mutant and no live defect: every scenario passed and the frames are correct
today. The exposure is real but narrower than `ABC-061`/`ABC-062` — a regression in the append
strategy on a non-default child would be caught by the first human who pipes the output, and the
board region is byte-exact already. **Promote to `P1` when anything touches `src/frame.ts`,
`src/render-seam.ts` or the status panel** — that is when 14 unread rows per child stop being
theoretical.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-15**. **Result: 10 of 10 — MET.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** one child of four carries the shape assertions, **14 rows** per non-default child unread, and both UAT status clauses named with the scenario they come from |
| 2 | scope and out-of-scope clear | **✅** blocks over existing children; six fences, including "no literal row count", "no pty" and "`B7` belongs to the amendment hop" |
| 3 | INVEST-shaped | **✅** independent, one hop, testable against children the file already spawns |
| 4 | acceptance testable and measurable | **✅** **3 of 3** children for shape (today **0 of 3**), **2 of 2** status rows (today **0 of 2**), **zero** `[`, **zero** occurrences of `random`, **1** path, `spawned` **10** |
| 5 | dependencies known | **✅** none open; five same-file neighbours and `ABC-061`'s ordering named as non-blocking |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms with **0** new files and **0** spawns against 152.5 ms; `NFR-002` untriggered; four security clauses answered |
| 7 | test notes present | **✅** four, including "measure `A3` before asserting it — if it differs, report, do not bend" |
| 8 | size assigned | **✅** `S` (2) |
| 9 | priority assigned | **✅** `P2`, with a named promotion trigger |
| 10 | no major unresolved blocker | **✅** none. `A3`'s measurement is a first step, not an unknown — the assertion has a defined outcome either way |
