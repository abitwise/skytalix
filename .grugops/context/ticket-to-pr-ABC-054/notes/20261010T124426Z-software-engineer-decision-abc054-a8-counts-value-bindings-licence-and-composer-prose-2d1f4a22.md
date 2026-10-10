---
id: 20261010T124426Z-software-engineer-decision-abc054-a8-counts-value-bindings-licence-and-composer-prose-2d1f4a22
kind: decision
by: software-engineer
at: 2026-10-10T12:44:26Z
verified_by:
confidence: high
refs:
  - ABC-054
  - ABC-041
  - ABC-043
  - ABC-057
  - ADR-0030
  - ADR-0029
  - ADR-0011
  - AR-053-COMPOSER
  - AR-053-ORDER
  - src/render-seam.test.ts
  - src/history-pane.nfr.test.ts
  - 20261010T082409Z-architect-design-decision-abc054-ruled-adr0030-licence-counts-evaluation-a8-counts-value-bindings-3ab45af1
  - 20261010T123406Z-ba-pm-decision-b974ac00
  - 20261010T124426Z-software-engineer-observation-abc054-gates-ledger-controls-cost-144df3f3
supersedes:
---

# `ABC-054` built as `ADR-0030` rules it: `A8` counts value bindings, and the licence and composer docblocks say what they count

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- Branch `grugops/ABC-054-consumers`, from wave tip `68dd87ac`. The code commit is `9989f28c`.
- Not merged, not pushed.
- The readings are in `…144df3f3`, and the raw files are in `../probe/`.

## What was built

| site | change | why this shape |
|---|---|---|
| `src/render-seam.test.ts` | `runtimeImportersOf` (the licence regex parameterised by target) is **replaced** by `runtimeConsumersOf`, built on a new helper `bindsAValueFrom(source, target)` | `ADR-0030` decision 2. The instrument is one parse of the import clause per statement. It adds no dependency and no file, and it does not use the compiler API |
| same | `bindsAValueFrom`: it matches `^import\s+([^;"]*?)\s*from\s+"./<target>";` (gm). A clause starting `type ` binds nothing. Any text outside the braces is a default or a namespace binding, so it binds a value. Otherwise a brace specifier not starting `type ` binds a value | `[^;"]` reads across lines (test note 3) and cannot run past another statement's specifier. Starting with `import` excludes `export … from` by construction. A bare `import "…"` has no `from`, so it cannot match |
| same | **The source text is a parameter**, not a file read | This is what lets `A1`'s eight spellings be asserted against the **same function** that `A8` runs, so no copy can drift. It is not a single-use abstraction: two call sites |
| same | New test `A8's instrument — ADR-0030's eight spellings`. It asserts the 8 spellings one by one and checks that the table holds four `true` rows | `A1`: all 8 are asserted, not a sample (test note 2) |
| same | The `A8` title and message say "runtime consumer" | Ticket scope (`:302`) |
| same | Header docblock: the sentence "Across the repository it is `ABC-054`'s instrument, not this file's" is **corrected** | My change made it false: the instrument now lives in this file. The new text says what `A8` now kills (`X3b`), and that a copy shipped beside a consumed `renderBoard` is still green (`ADR-0030` decision 3). **This goes past the page's literal scope. It is flagged here and is reversible in one hunk** |
| `src/history-pane.nfr.test.ts` (comments only) | Licence docblock: one added paragraph | `A3`. It states that the property is evaluation and why the bare form counts. It contains the inline-form sentence with `verbatimModuleSyntax` and `import type`, says the repair is `import type` and never the licence, and says the guard errs only by under-count, naming `R4` and `R3`. **The struck `ADR-0002` sentence (`ABC-057`'s scope) is not touched.** The new paragraph is separate, so `ABC-057` can rewrite its sentence without a conflict |
| same | Fail-closed sentence and the tripwire's in-test comment are limited to a **static** value import of `assembleFrame` | `A6` (i), `AR-053-COMPOSER` option 2 |
| same | "WHAT NEITHER PHASE COVERS" gains one entry that names `export … from` and `import("./frame.ts")` and cites `ABC-043` `A1` | `A6` (ii). **It is inserted as the 4th entry, not appended.** Appending would have changed the old last entry's closing `.` to `;`, and `A6` (ii) requires the four existing entries to be unchanged. They are byte-identical |

## Choices left open by the page, and the one I took

- **`A8` keeps `toContain("render-seam.ts")` and does not become `toEqual(["render-seam.ts"])`.**
  - `A4`'s "exactly `["render-seam.ts"]`" is a **measurement** on the delivered tree (`…144df3f3`), not
    a new assertion.
  - Making `A8` an equality would red a later, legitimate second consumer of `render.ts`. That would be
    a property `ADR-0030` did not rule.
  - `X3b` reds `toContain` anyway, because the list is `[]`.
- **The composer tripwire's own matcher is not re-pointed at `bindsAValueFrom`.** That is out of scope
  by name, and the two helpers are in two files.
  - **Noticed, not changed.** The tripwire's `bindsAssembleFrame` counts a brace specifier or a
    namespace binding, and **not a default binding**. `frame.ts` has no default export, so it cannot
    occur today.

## Not done, by fence

- `plans/board.md` (`In Development → In Review` is the SE's move per the role, but this task file
  fences the board). It is left for the Orchestrator.
- `ABC-041` `A8`'s page wording (BA/PM, at merge).
- `ADR-0011`'s `R4` pointer sentence (Architect/Design).
- `QE-053-b`/`-c`/`-d` (not folded).
