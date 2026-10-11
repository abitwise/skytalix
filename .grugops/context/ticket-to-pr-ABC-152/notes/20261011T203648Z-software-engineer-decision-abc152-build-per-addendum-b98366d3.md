---
id: 20261011T203648Z-software-engineer-decision-abc152-build-per-addendum-b98366d3
kind: decision
by: software-engineer
at: 2026-10-11T20:36:48Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0042
  - ADR-0040
  - RISK-ABC143-01
  - QE-144-a
  - QE-149-a
  - QE-151-a
  - QE-151-b
  - .grugops/context/design-ABC-152-owner-route/notes/20261011T195931Z-architect-design-observation-abc152-owner-route-handoff-recut-build-plan-80a214d3.md
  - .grugops/context/design-ABC-152-owner-route/notes/20261011T195931Z-architect-design-decision-abc152-owner-route-adr0042-addendum-f9b73048.md
supersedes:
---

# SE `ABC-152`: built as the addendum's build plan says, one commit per step. Five small choices, stated

This note is hand-authored and unsealed. There is no `context-io` writer on this install. Branch
`grugops/ABC-152-vitest-4-1-runner-off` from `main` `91024242`. Ten commits, `9313dda7..23c5521a`.

## What was built, in the plan's order

1. **The bump** (`9313dda7`). `vitest` and `@vitest/coverage-v8` `~4.1.11`; `vite` `~7.3.6` as a direct
   devDependency. `npm install`, no `--force`.
2. **The runner key** (`be4e3552`). `experimental: { viteModuleRunner: false }` and one header paragraph.
3. **The pin** (`fb039214`). `A7` edited in place per `probe/pin-prototype.diff`, with the `biome-ignore`, plus
   the `V3` `it`.
4. **The reporter** (`2d523837`). Ruling 5 items 1–3 in one commit.
5. **The test rework**, one commit per form: R1 `66aaa39e`; R2 `7883d87b`; R3 + R5 `1155b038`; R4 + R5
   `808a7e82`; ruling 2 `ccb8f1bd`; ruling 3 `23c5521a`.

## The choices this hop made (none widens an admitted form)

- **R2 uses the file's existing `zobristKey` import.** The architect's `F1` script added
  `import * as zobrist` for `vi.mocked(zobrist.zobristKey)`. Under `{ spy: true }`, the named binding the file
  already imports *is* the spy, so `vi.mocked(zobristKey)` needs no new import. The diff is smaller. The form is
  the same.
- **R1 and R4 blocks are placed where biome accepts them.**
  - `F1` put `cli.test.ts`'s `vi.mock` between two imports. Biome's `organizeImports` rejects that, so the
    `vi.mock` sits after the last import.
  - In four R4 files (`gameend.nfr`, `glyph-mode.nfr`, `history-pane.nfr`, `status-panel.nfr`), biome's
    **safe** fix sorted the new static-import block **in place**. The block still stands where the dynamic
    imports stood, after the `vi.mock` blocks, as the ruling requires.
- **`A7`'s comment** says vitest 4.1's precedence instead of 3.2.7's: `projects` outranks root, `poolOptions` is
  ignored but still forbidden, and `VITEST_MAX_WORKERS` outranks them all. Leaving 3.2.7's precedence in the
  comment beside a 4.1 pin would mislead. This is part of "`A7` edited in place".
- **The `vitest.config.ts` pin sentence** names `VITEST_MAX_WORKERS` in place of the 3.x pair, as ruling 4 says.
  The new paragraph also names `projects` and `poolOptions`. The isolation warning is byte-identical: the diff
  removes exactly the two lines of that one sentence.
- **Not changed, flagged instead:**
  - (a) Three comments are now stale, and each sits outside an admitted form, so `V5` keeps them out:
    - the `render-seam.test.ts` header ("NO `vi.mock`");
    - the `cli.test.ts` header line 5 ("It holds no `vi.mock`");
    - the `tools/opening-book/book.test.ts` D1(f) comment ("doMock + a fresh module registry").
  - (b) On 4.1, `import { JsonReporter } from "vitest/reporters"` prints `Importing from "vitest/reporters" is
    deprecated since Vitest 4.1. Please use "vitest/node" instead.` on every `npm test`. Ruling 5 does not name
    the specifier, so the import is not changed.

  Both are routed in the hand-off note `…4567b6b5`.

## Ruling 7: 0 cases

**No guard stayed green under every admitted form.** No test needed a delete, skip, move, merge or weaker
assertion. One plant was green, and the note `…99dca079` records it with its reading: the R5 `PRODUCTION_DEPS`
**add** plant in `command-input`. The only guard on that path is "A2 control", which asserts `>= 1`. The same
add-plant is green on base 3.2.7, so it is not a blinding by this ticket. The **removal** plant on the same path
turns that guard red.
