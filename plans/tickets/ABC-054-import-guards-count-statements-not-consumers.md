---
id: ABC-054
title: Two merged guards count import STATEMENTS, not consumers — one inline-type-specifier blind spot, a false GREEN on `ABC-041` `A8` and a false RED on the licence guard
status: backlog
column: Backlog
size: S
priority: P1
epic: —
feature: —
---

# ABC-054 — the same regex shape is wrong in two places, and it is wrong in opposite directions

> **Cut 2026-08-13 by BA/PM** (task `gate-abc041-2026-08-13`, subtask `refinement-ABC-041-a4`,
> Workflow 07), out of the QE gate's gap 8 on `ABC-041`. **One ruling, two symptoms** — QE's own
> words, and the reason this is one ticket rather than two.

## Problem

*User*: this board. `EPIC-006` was raised **`P2` → `P1`** on a measurement, and the measurement's
instrument cannot tell the difference between a module being **imported** and a module being **used**.

*Pain*: two merged guards share a regex shape that excludes `import type { X } from "…"` but
**matches** `import { type X, type Y } from "…"` — every specifier type-only, zero runtime use.
Measured at the `ABC-041` gate against all three forms, not reasoned:

- **`ABC-041` `A8` — a FALSE GREEN.** `A8` counts import statements and reports
  `src/render.ts` as having a production importer. QE's mutant `X3b` copies `renderBoard`'s algorithm
  into its own module, leaves `src/render.ts` holding only type-erased specifiers, and calls
  `renderBoard` **nowhere** — **824/824 green, `tsc` exit 0, `A8` green.** `ABC-041`'s own `## Problem`
  draws exactly the distinction the instrument cannot: *"2 importers, BOTH `import type` →
  renderBoard has 0 runtime consumers"*. **The pathology the epic exists to end can be reported as
  cured.**
- **The merged licence guard (`src/history-pane.nfr.test.ts:317`) — a FALSE RED.** `ADR-0011`
  clause 3 licenses which production modules may hold a **runtime** import of `history.ts`. Same
  blind spot, opposite consequence: it over-counts, so it fails **safe**.

*Value*: **`A8` is the epic's headline and the raise's evidence.** On the delivered `ABC-041` build
`A8` is genuinely true — `renderBoard` IS called, and `ABC-041`'s new `A11` call count is what holds
it there. What this ticket buys is that the headline stays true for a reason the instrument can see,
on every later ticket, without a call-count row being hand-written per module.

## Scope

**One ruling on what these two guards measure, and the instrument change it implies.**

- **Rule whether the property is "imports the module" or "consumes the module at runtime."** They are
  different properties and the two guards want different ones.
- **Fix the shared blind spot in both sites**, or state in each docblock which direction it errs in
  and why that is acceptable there. A false red that fails safe may be left standing **by decision**;
  it may not be left standing by accident.
- **`ABC-041` `A8`'s wording follows the ruling.** If the ruling makes "production runtime consumer"
  mechanically measurable, `A8`'s text is BA/PM's one-line follow-up and is named here, not folded in.

## Out of scope

- **Forbidding a second board implementation across the repository.** That is the property `ABC-041`
  `A4` was wrongly said to hold, and a consumer-count guard is **necessary but not obviously
  sufficient** for it — a module can be consumed *and* duplicated. If the ruling wants that property
  it must say so in its own words; this ticket does not assume it.
- **Changing `src/render-seam.ts` or `src/render.ts`.** Both are correct.
- **The probe's load-time-vs-per-frame reach** — that is `ABC-053`. Different question, cut apart on
  purpose even though the two share a file.
- **Re-opening `ABC-041`.** A gap found after delivery becomes a new ticket; this is that ticket.

## Acceptance (Given/When/Then)

- **`A1` (all three import forms are decided, in a table).** **Given** `import type { X } from "./m.ts"`,
  `import { type X, type Y } from "./m.ts"` and `import { f } from "./m.ts"`, **then** the ruling
  states for each whether it counts, for each of the two guards. **Three forms × two guards = six
  cells, none blank.**
- **`A2` (`X3b` is the arming control, and it goes RED).** **Given** the mutant that copies
  `renderBoard` into its own module and leaves `src/render.ts` with only type-erased specifiers,
  **when** the ruled instrument runs, **then** it reports `src/render.ts` at **0** production runtime
  consumers. *(It reports ≥ 1 today — measured, 824/824 green. That is the defect.)*
- **`A3` (the licence guard's direction is stated where it is read).** The guard's docblock says which
  way it errs and whether that is by decision. **Given** a reader who opens the file cold, **then**
  they can tell a false red from a real one without running a mutant.
- **`A4` (no regression on the delivered tree).** **Given** the ruled instrument on `main` after
  `ABC-041` merges, **then** `src/render.ts`, `src/status-panel.ts` and `src/history-pane.ts` each
  report **≥ 1** production runtime consumer — the true state, which the current instrument also
  reports but for the wrong reason.
- **`A5` (no production change).** `git diff --numstat` touches no non-`.test.ts` file under `src/`.
  *(Both guards live in test files. If the ruling needs production code, it is a different ticket.)*

## Dependencies

- **`ADR-0011` clause 3** is the licence guard's rule and Architect/Design owns it.
- **`ABC-041` must merge first**, or `A4` measures a tree in which the three modules have no runtime
  consumer at all. **Ordering only** — no design decision waits on it.
- **`ABC-053` shares a file and shares no question.** Whoever runs both should sequence them, because
  `A10`-style single-line budgets do not apply here and two hops editing one probe file conflict.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**, scope = every file the branch adds under
  `src/`. **0 new test files planned**: both guards are in existing files.
- **`NFR-002` not triggered.** Neither guard is on the frame path; both are assertions about source
  text.
- **Security: not triggered.** `ABC-041`'s repaired four clauses apply verbatim: **(a)** dependency /
  manifest touch, **(b)** any non-`.test.ts` file under `src/` gaining a Node builtin, a `process.`
  read, or `spawn`/`exec`/`fetch`/`eval`/`new Function`, **(c)** a test file adding network, a write
  outside a temp dir, or a **new** spawn — read-only `node:fs` over the repo's own source is explicit
  precedent and does not fire, **(d)** blast radius beyond the two guard files. **On a disputed
  reading it fires and the gate resolves it.**

## Test notes

1. **`X3b` already exists as a written recipe** in `.grugops/context/quality-gate-ABC-041/notes/`.
   Rebuild it against an md5-pinned tree, run, revert, re-verify the md5 — the method that gate used.
2. **All three import forms must be exercised**, not two. The blind spot is specifically the *inline*
   type specifier, which reads like a value import to a regex and vanishes at runtime.
3. **A consumer count is not an import count.** If the ruling adopts "runtime consumer", the honest
   instrument is one that observes the specifier list, not one that greps the statement.
4. **The licence guard's over-count fails safe and must stay at least as strict.** A repair that
   turns a false red into a false green is worse than the defect.

## Lane cost — how many test FILES this ticket implies

**Zero.** `src/render-seam.test.ts` holds `A8`'s instrument and `src/history-pane.nfr.test.ts` holds
the licence guard; both are existing files. A new file is a re-size to `M` and is not assumed.

## Size and priority rationale

**Size `S` (2).** One regex shape, two sites, one ruling, one mutant that is already written down.

**Priority `P1`.** It measures the number `EPIC-006`'s `P2` → `P1` raise rests on, and every later
`EPIC-006` ticket re-uses that measurement. Not `P0` — on the delivered build the headline is true,
and `ABC-041` `A11` holds it there for this module.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-13**. **Result: 8 of 10 — NOT MET.** ⚠️×2.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** one regex shape, two guards, a measured false green and a measured false red |
| 2 | scope and out-of-scope clear | **✅** one ruling and its instrument; four fences, including the second-implementation property explicitly NOT assumed |
| 3 | INVEST-shaped | **✅** valuable, estimable, small, testable by a mutant that already exists |
| 4 | acceptance testable and measurable | **✅** five criteria; `A1` is a six-cell table, `A2` is a named mutant with a required red |
| 5 | dependencies known | **✅** `ADR-0011` clause 3; `ABC-041` ordering; the `ABC-053` file conflict named |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms with 0 files planned; security's four clauses |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `S` (2) |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker | **⚠️ NOT MET ×2** — (i) **ordering: `ABC-041` must merge first** or `A4` measures the wrong tree; (ii) **the ruling is Architect/Design's**, and "imports" vs "consumes" is not BA/PM's to choose |
