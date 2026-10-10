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
>
> **Re-cut 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `owner-adrs-followups`) to
> [`ADR-0030`](../../memory-bank/50-decisions/ADR-0030-imports-means-evaluates-for-the-licence-and-consumes-means-binds-a-value-for-a8.md),
> **accepted by the owner 2026-10-10**. **Half the premise was measured false:** under this repo's
> `verbatimModuleSyntax: true` (`tsconfig.json:16`), `import { type X, type Y }` **evaluates** the module,
> so the licence guard's red on it is a **TRUE** red, not a false one. The two guards hold different
> properties: the licence counts **evaluation** (unchanged, docblock prose only); `ABC-041` `A8` counts
> **value bindings** (one instrument). Scope and `A1`–`A5` are re-cut; the § Problem below is kept as
> cut, with the false-RED bullet corrected in place. **DoR 10/10 → `Ready`.** Reasoning:
> `.grugops/context/owner-adrs-followups/notes/`.

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
- ~~**The merged licence guard (`src/history-pane.nfr.test.ts:317`) — a FALSE RED.**~~ **Measured
  false 2026-10-10 (`ADR-0030` § Context): a TRUE red** — the inline all-type form evaluates
  `history.ts` under `verbatimModuleSyntax`. The regex is at `:324`. *As cut:* `ADR-0011`
  clause 3 licenses which production modules may hold a **runtime** import of `history.ts`. Same
  blind spot, opposite consequence: it over-counts, so it fails **safe**.

*Value*: **`A8` is the epic's headline and the raise's evidence.** On the delivered `ABC-041` build
`A8` is genuinely true — `renderBoard` IS called, and `ABC-041`'s new `A11` call count is what holds
it there. What this ticket buys is that the headline stays true for a reason the instrument can see,
on every later ticket, without a call-count row being hand-written per module.

## Scope

*(Re-cut 2026-10-10 to `ADR-0030`. The ruling half of the original scope is discharged by it.)*

- **The licence half — docblock prose only** (`ADR-0030` decision 1). In
  `src/history-pane.nfr.test.ts`, the licence docblock (`:196-218` today) states that the property is
  **evaluation**; that the inline all-type form counts because, under `verbatimModuleSyntax` and Node
  type stripping, it evaluates `history.ts`; that the repair for a module that trips on it is
  `import type`, **never the licence**; and which way the guard errs: **under-counts only (false
  greens)**, both already owned — `ADR-0011` `R4` (the dynamic forms) and `R3` (subdirectory /
  depth-fixed specifier). **The regex at `:324` and its witness copy at `:393` are NOT changed.**
- **The `A8` half — one instrument** (`ADR-0030` decision 2). `runtimeImportersOf` in
  `src/render-seam.test.ts` (`:93-107` today) is replaced by a **runtime consumer** instrument: a
  production module consumes a target if it holds an `import` from the target that binds **at least
  one value** — a default binding, a namespace binding, or a brace specifier not prefixed `type`. **Not
  consumers:** `import type { … }`; a brace list whose specifiers are all inline-`type`; a bare
  `import "…"`; `export … from`. Textual, reading the **specifier list**; no new dependency, no compiler
  API, no new file. `ABC-041` `A8`'s test title follows it (`:302`, "runtime importer" → "runtime
  consumer").
- **`ABC-041` `A8`'s page wording** ("runtime importer" → "runtime consumer") is BA/PM's **one-line
  dated annotation at this ticket's merge** — not before, because until the instrument lands the old
  word is the true description of what runs. The gated criterion text is not rewritten.

## Out of scope

- **Changing the licence regex** in either direction. Excluding the inline all-type form would turn a
  true red into a **false green** (`ADR-0030` alternative 2; this page's test note 4).
- **Forbidding a second board implementation across the repository** (`ADR-0030` decision 3: not
  adopted). A consumer count is necessary, not sufficient.
- **Changing `src/render-seam.ts` or `src/render.ts`.** Both are correct.
- **The probe's load-time-vs-per-frame reach** — `ABC-053`, which goes first on the same files.
- **Re-opening `ABC-041`.** A gap found after delivery becomes a new ticket; this is that ticket.
- **`ADR-0030`'s residuals `C1`** (a value binding imported but never called counts) **and `C2`**
  (re-export chains under-count, fails red by decision). Both Architect/Design's, each with its trigger.
- **`ADR-0011`'s pointer sentence** beside `R4` (the inline form is a spelling of the bare form). Owed
  by Architect/Design at acceptance.
- **Lint strictness** (`useImportType` / `noUnusedImports` as errors). `quality.lint.strict` is the
  owner's dial.

## Acceptance (Given/When/Then)

*(Re-cut 2026-10-10 to `ADR-0030`. Ids are kept.)*

- **`A1` (the ruled table, exercised in the consumption column).** `ADR-0030`'s six cells are the
  ruling. **Given** the new instrument fed each of these eight import spellings of a target, **then**
  it reports a consumer for **exactly four**: `import { f }`, `import { type X, f }` (mixed),
  `import D from`, `import * as ns from`; and **not** for `import type { X }`,
  `import { type X, type Y }`, `import "…"` (bare) and `export { f } from`. **4 of 8, each asserted.**
  The licence column is **not** re-tested: the regex is unchanged and its witnesses stay as they are.
- **`A2` (`X3b` is the arming control, and it goes RED).** **Given** `X3b` (a second board
  implementation; `src/render.ts` keeps only type-erased specifiers in the seam's import), **when** the
  new instrument runs, **then** it reports `render.ts` at **0** consumers (`[]`) and `A8` is **RED**.
  *(Today `A8` is green on `X3b`; that is the defect. `A11` reds it too, for the seam's three modules
  only.)*
- **`A3` (the licence guard's direction is stated where it is read).** **Given** the licence docblock
  opened cold, **then** it names the property (**evaluation**), contains the inline-form sentence with
  the words `verbatimModuleSyntax` and `import type`, and states the guard errs only by **under-count**,
  naming `R3` and `R4`. **And** the regex lines `:324` and `:393` are **byte-identical** to the base.
- **`A4` (no regression on the delivered tree).** **Given** the new instrument on the delivered tree,
  **then** `render.ts`, `status-panel.ts` and `history-pane.ts` each report **exactly**
  `["render-seam.ts"]` (`ADR-0030` measured this on `46b6a0f`; the files are unchanged since).
- **`A5` (the files).** `git diff --name-only <base>..<delivered>` lists under `src/` **exactly**
  `src/history-pane.nfr.test.ts` and `src/render-seam.test.ts`. **0 production lines, 0 new files, 0
  spawns.** In `src/history-pane.nfr.test.ts` every changed line is inside a comment.

## Dependencies

- **`ADR-0030` — accepted 2026-10-10.** `ADR-0011` clause 3 is **confirmed, not amended**.
- ~~**`ABC-041` must merge first.**~~ **`ABC-041` — `Done`** (merged; `ADR-0030` § Context). The ordering
  half of the August ⚠️ is met.
- **Sequence `ABC-053` → `ABC-054` → `ABC-057`** *(Orchestrator, 2026-10-10)*. **Pull after `ABC-053`
  merges**: `ABC-053` edits both files this ticket edits (`src/render-seam.test.ts` `A9`, and the probe
  in `src/history-pane.nfr.test.ts`). **`ABC-057` goes after this ticket:** its docblock fix and this
  ticket's licence prose are **one paragraph** (`ADR-0030` § Consequences), so never in parallel. Line
  anchors here are as of `246ddfc`; re-read them after `ABC-053` lands.

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

1. **`X3b` already exists as a written recipe** in `.grugops/context/quality-gate-ABC-041/notes/`,
   re-measured by `ADR-0030` (`X3b` gives `tsc` exit 0 and `A8` green today). Rebuild it out of tree,
   run, revert.
2. **All the spellings in `A1` are asserted, not two.** The boundary cases are the **inline all-type
   brace** (not a consumer, though it evaluates) and the **mixed brace** (a consumer).
3. **A consumer count is not an import count.** The instrument reads the specifier list. **12
   production files have import statements that span lines** (measured 2026-10-10), so it must read a
   statement across lines, as the old regex's `[^;]*` does.
4. **The licence guard must stay at least as strict.** Nothing in this ticket changes its expression;
   `A3` pins that.

## Lane cost — how many test FILES this ticket implies

**Zero.** `src/render-seam.test.ts` holds `A8`'s instrument and `src/history-pane.nfr.test.ts` holds
the licence guard; both are existing files. A new file is a re-size to `M` and is not assumed.

## Size and priority rationale

**Size `S` (2), unchanged — re-checked 2026-10-10.** The ruling work left the ticket; one instrument,
an eight-spelling table, one mutant run and one docblock paragraph stayed. Not `XS`: the instrument
must parse multi-line import clauses and lands right after `ABC-053` rewrote `A9` in the same file.

**Priority `P1`, kept with a new reason.** On the delivered build the headline is true, and `ABC-041`
`A11` holds it for the seam's three modules, so on its own this is `P2`. It is `P1` because it sits
between `ABC-053` and `ABC-057` in the ruled order on one file: once `ABC-053` is pulled, `ABC-057`'s
`R5` trigger makes it `P1`, and a `P2` here would hold a `P1` behind it. *(The August reason — every
later `EPIC-006` ticket re-uses the measurement — is not re-verified: no open page cites
`runtimeImportersOf`.)*

## Definition of Ready

**Re-scored 2026-10-10 by BA/PM** (`owner-adrs-followups`, wave tip `246ddfc`). **Result: 10 of 10 —
MET → `Ready`.** Pull after `ABC-053` merges.
- **Item 10, ⚠️×2 → ✅.** (i) `ABC-041` is `Done`. (ii) The ruling is made and accepted (`ADR-0030`).
- **Item 1 stays ✅, corrected.** The false-RED half of the problem is struck in place: it is a true red.
- **Item 2 stays ✅, re-cut.** Licence half = docblock prose only; `A8` half = one instrument. Eight
  fences.
- **Item 4 stays ✅, re-cut.** `A1` is 4 of 8 spellings; `A2` a named mutant RED; `A3` byte-identical
  regex lines plus named words; `A4` exact lists; `A5` two paths.
- **Item 5 stays ✅.** `053` → `054` → `057` named, with the shared-paragraph reason.
- **Items 3, 6–9 stay ✅.** `S`, `P1` (reason restated).
- **Owed elsewhere, not blocking:** `ADR-0011`'s pointer sentence (Architect/Design); `ABC-041` `A8`'s
  page annotation (BA/PM, at this ticket's merge).

**Cut-time assessment, 2026-08-13:**

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
| 10 | no major unresolved blocker | ~~**⚠️ NOT MET ×2**~~ **✅ 2026-10-10 — see the re-score above.** Was: — (i) **ordering: `ABC-041` must merge first** or `A4` measures the wrong tree; (ii) **the ruling is Architect/Design's**, and "imports" vs "consumes" is not BA/PM's to choose. **→ (ii) RULED 2026-10-10 by Architect/Design in [`ADR-0030`](../../memory-bank/50-decisions/ADR-0030-imports-means-evaluates-for-the-licence-and-consumes-means-binds-a-value-for-a8.md) (`proposed`, owner acceptance owed).** The licence guard counts evaluation and is unchanged; its "false RED" premise does not hold under `verbatimModuleSyntax`. `A8` counts value bindings. (i) is not this ruling's. Not re-scored: the verdict is BA/PM's |
