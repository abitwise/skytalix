---
kind: adr
id: ADR-0030
---
# ADR-0030: "Imports" and "consumes" are different properties. The licence guard counts EVALUATION and is already right. `ABC-041` `A8` must count VALUE BINDINGS

## Status

**proposed** 2026-10-10 by Architect/Design (task `wave-2026-09-25`, subtask `ruling-abc053-abc054`), ruling
`ABC-054`. **Owner acceptance owed.** It is left `proposed` because it changes the instrument under
`EPIC-006`'s headline criterion (`ABC-041` `A8`). It also overturns half of `ABC-054`'s premise, and the owner
should see that before a build hop relies on it.

**`ADR-0011` clause 3 is CONFIRMED, not amended.** Its regex is not changed. **Zero production lines.**

## Context

`ABC-054` (cut 2026-08-13) says two merged guards share one regex shape and that this shape **matches**
`import { type X, type Y } from "…"`, *"every specifier type-only, zero runtime use"*. It reports the
consequence as a **false GREEN** on `ABC-041` `A8` and a **false RED** on `ADR-0011` clause 3's licence guard.

**The premise was measured on this repository's own toolchain, and it is half wrong.**
`tsconfig.json` sets **`verbatimModuleSyntax: true`**, and has since 2026-07-22 (`5165f97`), before the ticket was
cut. Under that setting an import whose specifiers are **all** inline-`type` keeps the statement and drops the
specifiers: it becomes `import {} from "…"`, a side-effect import that **evaluates the module body**. Only
`import type { … }` is erased whole. Measured out of tree with a module whose body records that it ran:

| form | Node v26.11.0 type stripping (`npm run chess`) | vitest (`npm test`) | `tsc --noEmit` | `biome check` |
|---|---|---|---|---|
| `import type { X } from "./m.ts"` | body **not** evaluated | not evaluated | exit 0 | clean |
| `import { type X, type Y } from "./m.ts"` | body **EVALUATED** | **EVALUATED** | exit 0 | `useImportType` **warning**, exit 0. Biome's own message: *"avoids loading unnecessary modules"* |
| `import { f } from "./m.ts"` | evaluated | evaluated | exit 0 | clean |

The probe confirms it in-suite. With the pane's `import type { GameHistory }` changed to `import { type
GameHistory }` (`INLINE-TYPE`), the **load probe goes RED with `history.ts` evaluated on the frame path.** The
regex reds too.

So the inline all-type form has **zero bindings and non-zero evaluation.** The two guards ask about those
two different things:

- **`ADR-0011` clause 3 (the licence)** asks whether a module is a *runtime importer* of `history.ts`.
  `D27`'s five forms include the bare `import "./history.ts";`, which binds nothing. **The property is
  evaluation.** Under this toolchain the inline all-type form *is* the bare form, so the regex's red on it
  is **a TRUE red. `ABC-054`'s "false RED" premise does not hold, and has not held at any point in this
  repository's history.**
- **`ABC-041` `A8` (the epic's headline)** exists because *"2 importers, BOTH `import type` → renderBoard has 0
  runtime consumers"*. **The property is consumption.** `A8`'s instrument (`runtimeImportersOf` in
  `src/render-seam.test.ts`) is the licence regex, parameterised by target. It borrowed an evaluation
  instrument for a consumption claim. **That is the only defect, and it is in one site, not two.**
  Re-measured: `X3b` (a second board implementation in `board-two.ts`; the seam keeps only `{ type
  GlyphMode, type Orientation }` from `render.ts`) gives `tsc` exit 0 and **`A8` green**. Note that `A8`'s
  *wording*, "gain a runtime importer", is literally true on `X3b`, because `render.ts` is evaluated. The
  criterion measures the wrong property, not the right one badly. On today's tree `X3b` is killed by
  `ABC-041` `A11` (`renderBoard` called 0 times), which holds the seam's three modules **only**.

**`ABC-054`'s other premises, re-checked on `46b6a0f`:** `ABC-041` is `Done` and merged, so the ordering half
of DoR item 10 is met (BA/PM's to re-score, not this ADR's). The licence regex is at
`src/history-pane.nfr.test.ts:324`, not `:317`. `A8`'s instrument is `src/render-seam.test.ts:99-107`.

## Decision

### 1. The LICENCE guard's property is EVALUATION. Unchanged. Its docblock says so

A production module is a runtime importer of `src/history.ts` if loading it **evaluates `history.ts`'s
module body.** `D27`'s forms define this, and the inline all-type form is one more spelling of the bare form.
**The regex at `:324` is correct for all three forms in `A1`'s table and is NOT changed.** The obvious "fix",
excluding the inline all-type form, would turn a true red into a **false green**. `ABC-054`'s own test note
4 forbids exactly that.

**Direction of error (`ABC-054` `A3`).** The guard does not err on the inline form. Its known errors are
both **under-counts, so false greens**, and both are already owned: `ADR-0011` `R4` (the two dynamic forms)
and `R3` (subdirectory and depth-fixed specifier). The docblock must say, where a reader opens the file
cold: *the inline all-type form counts because, under `verbatimModuleSyntax` and Node type stripping, it
evaluates `history.ts`; the repair for a module that trips on it is `import type`, never the licence.*
This is the Engineer's prose.

### 2. `A8`'s property is CONSUMPTION, defined as holding a VALUE BINDING

> A production module is a **runtime consumer** of a target if it holds an `import` statement from the target
> that binds **at least one value**: a default binding, a namespace binding (`* as ns`), or a brace specifier
> **not** prefixed `type`.

**Not consumers:** `import type { … }`; a brace list whose specifiers are **all** inline-`type`; a bare
side-effect `import "…"`; and **`export … from` re-exports**. A re-export is excluded **by decision**: it
makes `A8` *under*-count along a re-export chain, and an under-count reds a claim that something is
consumed. That fails safe.

**The instrument is textual and reads the specifier list, not the statement.** It is one parse of the
import clause per statement: no new dependency, no compiler API, no new file. `ABC-054` test note 3 asks
for exactly this. A reference implementation was run out of tree:

| target | BASE (`46b6a0f`): consumers | `X3b`: consumers |
|---|---|---|
| `render.ts` | `["render-seam.ts"]` | **`[]`**: `A2`'s required RED |
| `status-panel.ts` | `["render-seam.ts"]` | `["render-seam.ts"]` |
| `history-pane.ts` | `["render-seam.ts"]` | `["render-seam.ts"]` |

`A4` (≥ 1 each on the delivered tree) holds, and it now holds for the right reason.

### `A1`: three forms × two guards, six cells, none blank

| form | licence guard (`ADR-0011` cl. 3: evaluates `history.ts`?) | `A8` (consumes the target?) |
|---|---|---|
| `import type { X } from "./m.ts"` | **does not count**: erased whole, measured not evaluated | **does not count** |
| `import { type X, type Y } from "./m.ts"` | **COUNTS**: evaluated under every runtime this repo has (measured). Today's regex already counts it, and that is **correct** | **does NOT count**: binds no value. Today's instrument counts it, and **that is the defect** |
| `import { f } from "./m.ts"` | **counts** | **counts** |

### 3. The "second board implementation" property is NOT adopted

A consumer count is necessary, not sufficient: a module can be consumed and duplicated. `ABC-054` fences
this out, and this ADR does not adopt it.

## Alternatives

| # | alternative | verdict |
|---|---|---|
| 1 | **One rule for both guards** (`ABC-054`'s framing: "fix the shared blind spot in both sites") | **Rejected.** They hold different properties. Applying the consumer rule to the licence turns `INLINE-TYPE`, a measured evaluation of `history.ts` on the frame path, into a licence green |
| 2 | **Exclude the inline all-type form from the licence regex** (treat it as erased) | **Rejected: a false green.** It rests on the "type-erased" premise, which is measured false under `verbatimModuleSyntax` |
| 3 | **Behavioural consumer count** (spy on every exported function along the shipped path) | **Rejected on cost.** It needs the entry point driven end to end. `ABC-041` `A11` already holds the call count where it is cheap (inside the seam) |
| 4 | **TypeScript compiler API** to resolve bindings exactly | **Rejected.** It is a new dependency route for one criterion. The specifier list is closed grammar and textual parsing is enough |
| 5 | **Turn on lint strictness** so `useImportType` / `noUnusedImports` fail the gate | **Out of this ADR's reach and not needed.** `quality.lint.strict` is a config dial and the owner's. Recorded only because both lint rules see the relevant forms and both are warnings (exit 0, measured) |

## Consequences

- **`ABC-054`'s scope shrinks, and BA/PM writes that.** Both its sites still change, but for different
  reasons. The licence half is **docblock prose only** (`src/history-pane.nfr.test.ts`, the paragraph at
  `:196-217`). The `A8` half is **one instrument** (`src/render-seam.test.ts:93-107`). Its `A2` still
  requires `X3b` RED, and the ruled instrument delivers that (measured above).
- **`ABC-041` `A8`'s wording follows the ruling** ("runtime importer" → "runtime consumer"). That is BA/PM's
  one-line follow-up on `ABC-041`'s page, named and not written here.
- **`ADR-0029`'s composer tripwire uses decision 2's definition** ("value-binding import of
  `assembleFrame`"). The two ADRs are consistent and can be accepted in either order.
- **`ABC-057` edits the same licence docblock** (it removes `ADR-0011`'s struck sentence). The licence-half
  prose of `ABC-054` and `ABC-057` is **one paragraph**. BA/PM should cut them to land together or in
  sequence, never in parallel.

### Residuals, with owners and triggers

| # | residual | owner | trigger |
|---|---|---|---|
| **C1** | A value binding that is **imported but never called** counts as a consumer. Biome's `noUnusedImports` sees an unused one, but only as a **warning** (lint exit 0, measured). A binding used for anything other than a call (for example `void renderBoard;`) would pass both (reasoned, not measured: `UNKNOWN - verify`) | Architect/Design | the first time `A8`'s rule is applied to a target outside the seam's three, where `A11`'s call count does not reach |
| **C2** | Re-export chains under-count (fails RED, by decision) | Architect/Design | the first production `export … from` of a renderer |

### What this changes elsewhere

- **`plans/nfr-catalog.md`: not opened.** Neither guard is on an NFR row's bar (`ABC-054`: *"`NFR-002` not
  triggered"*). No target or level moves.
- **`ADR-0011`: not edited.** Clause 3 is confirmed. At acceptance, one sentence is owed beside `R4`'s
  "3 of 5 forms": *the inline all-type form is a spelling of the bare form under `verbatimModuleSyntax`, and is
  caught.*

## Rollback

`A8`'s instrument is one helper in one test file, so one revert restores the statement-counting version, and
`X3b` goes back to `A8`-green (still `A11`-red). The licence half is prose. Nothing in `src/` production depends
on either.
