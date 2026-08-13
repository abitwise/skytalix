---
id: 20260813T230500Z-qe-e2e-observation-a6-was-widened-in-words-and-the-instrument-did-not-move-fb895859
kind: observation
by: qe-e2e
at: 2026-08-13T23:05:00Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - plans/tickets/ABC-041-render-seam-closure.md
  - src/render-seam.test.ts
  - src/render-seam.ts
  - 20260813T221658Z-ba-pm-observation-what-a3-and-a6-actually-decide-and-the-fence-they-rest-on-f4a286ef
supersedes: 
---

# `A3` and the diff-vs-file scope ARE addressed. `A6` is not: its wording grew three spellings and the instrument grew none — measured, not inferred.

This is the item the subtask asked me to confirm or deny plainly, and I am the only role that has seen
both the mutant and the new wording. Two of the three earlier criterion-instrument weaknesses are
genuinely closed; the third is now worse than it was, because the page asserts a guard that does not
exist.

## Closed — `A3`, and the diff-vs-file scope

- **`A3`** (`X7`, the digit-free row-count) now says the module's executable text *"contains no digit
  character at all"*, which is exactly what `expect(deliveredCode()).not.toMatch(/\d/)` enforces, and
  its parenthetical states the blind spot in words: *"a height spelled without digits — a string's
  `.length`, say — is not caught here"*. The criterion and the instrument now say the same thing, and
  the reader inherits the limit with the criterion. **Addressed.**
- **The diff-vs-file scope** (`X9`, the literal and the env read moved one module away): `A3` and `A6`
  now both say *"Scope is **this module's source**, which is what the instrument reads"*, and both
  name `A10` as the fence that stops a sibling module being added at all. `A10` is checked by reading
  the diff — which I did at this gate: `git diff --name-status main -- src/` is exactly two additions
  and one modification, and the five modules `A10` names are byte-identical to `main`. **Addressed.**

## NOT closed — `A6`

The repaired criterion reads:

> The delivered module's source — `src/render-seam.ts`, comments included — contains **zero**
> occurrences of `process.`, of the bare word `process`, of `globalThis` and of `import.meta`, and
> **zero** imports from `glyph-mode.ts`; **asserted textually, not by inspection**.

The delivered instrument, `src/render-seam.test.ts:283-293`, is three assertions:

```ts
expect(source).not.toContain("process.");
expect(source).not.toContain('from "./glyph-mode.ts"');
expect(source).not.toContain('from "./history.ts"');      // A7's half
```

**`globalThis`, `import.meta` and the bare word `process` are asserted by nothing** — not here, and
not anywhere else in the suite. I grepped every `.ts` under `src/` for an assertion carrying those
spellings against this module and found exactly the one line above; the other hits are production
comments and `glyph-mode.test.ts`'s own fixtures, none of which reads `render-seam.ts`.

## `X8`, rebuilt in a typecheck-clean form so the claim is honest

```ts
function ambientMode(): GlyphMode | undefined {
  const ambient = (globalThis as unknown as Record<string, { env?: Record<string, string> }>)[
    "process"
  ]?.env?.["CHESS_GLYPHS"];
  return ambient === "ascii" ? "ascii" : undefined;
}
// ... and in the seam:
board: renderBoard(history.position, ambientMode() ?? mode, orientation),
```

| check | result |
|---|---|
| `npm test` | **828 passed / 828, 29 files** (run at `78a3db8`; **827/827** on the final artifact) |
| `npx tsc --noEmit` | **exit 0** |
| `npx biome check src/render-seam.ts` | **exit 0**, the same 2 pre-existing infos |
| `A6 / A7` row | **GREEN** — the source contains no `process.` substring |

**It is not a decorative mutant.** With `CHESS_GLYPHS=ascii` in the environment the seam silently
overrides its bound mode and three criteria go red (`A1`, `A4`, `A5`). The capability `A6` exists to
forbid — a frame whose content depends on ambient state — is fully present, and the one guard that
was supposed to catch it textually is one keystroke wide, exactly as I measured before the repair.
The behavioural reds only appear if the variable happens to be set **during a test run**, which is
never, so the text check is the guard in practice.

No digit appears in `X8`, so `A3` cannot claim the kill either.

## Why this is the same defect as `A4`'s, not a wording nit

`A6`'s parenthetical tells the next reader *"The three added spellings are not decoration: a substring
check for `process.` alone is one keystroke wide and an ambient read via `globalThis["process"]` was
measured green against it."* A reader who trusts the page will believe that measurement led to a
guard. It did not. **That is the inheritance harm the `A4` block was raised over**, in a different
criterion — and I would be applying a weaker standard on the hop where clearing is convenient if I
let it through because the fix is small.

**The property itself is TRUE of the delivered build.** Counted at my hand over the whole source,
comments included: `process.` **0**, bare `process` **0**, `globalThis` **0**, `import.meta` **0**,
`from "./glyph-mode.ts"` **0**. The three missing assertions will be green the moment they are
written; the fix is three lines in a row that already exists, no new test and no new file.
