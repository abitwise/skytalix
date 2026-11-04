---
id: 20261104T034410Z-software-engineer-decision-82caa3b2
kind: decision
by: software-engineer
at: 2026-11-04T03:44:10Z
verified_by: 
confidence: high: placement read from the diff; lint and the scripted body check confirm it
refs:
  - se-ABC-281
  - ABC-281
  - EPIC-011
  - ADR-0046
  - ADR-0050
  - NFR-008
  - R-N8H-1
  - R-281-a
  - Q-N8H-1
  - QE-208-a
  - QE-087-d
  - ABC-230
  - src/search.null-move.test.ts
  - src/engine.test.ts
  - src/levels.test.ts
  - AGENTS.md
  - memory-bank/90-agents-md-command-log.md
  - arch-ABC-281/20261104T032140Z-architect-design-decision-d7b2b02b
  - arch-ABC-281/20261104T032140Z-architect-design-observation-e969c2f0
  - grugops/ABC-281
  - 748d4fa3
  - e526480d
  - 9a8d7493
supersedes: 
seal: sha256:1d507ade2590303da4d23080bcca063de210b9ee198c36f48eb1b227cfe0397d
---

# se-ABC-281 decision: the three form-S builds, as placed

Software Engineer, task `se-ABC-281`, for `ABC-281` under `ADR-0046` § Dated 2026-11-04 (`arch-ABC-281`, decision `…d7b2b02b`). Test files only.

## Placement (conditions 2–4)
- **R1 `QE-208-a` (`src/search.null-move.test.ts`).** The describe, its `sweep` and `READINGS` stay where they were, one copy, byte-identical. The remnant `it` takes the row's place: `sweep` on `chooseMoveWithoutTaper` at readings 8 and 10, `mutated` empty, `insideNull ≥ 1`. Inside the describe, `if (RUN_DEEP) { describe("<describe title> [deep, SEARCH_DEEP=1]") { it("<row title> [deep, SEARCH_DEEP=1]") } }` holds the full row.
- **R2 `ABC-230` A4 (`src/engine.test.ts`).** The remnant replaces the row in the original describe, beside the untouched sibling "the three test-only doors ignore prior keys…". The full row, with its title unchanged, sits in a new top-level `if (RUN_DEEP) { describe("ABC-230 A3 and A4 — … take none [deep, ENGINE_DEEP=1]") }` right after the original describe. The file's existing deep block at `:1017` is not used, so the move reads as one hunk beside the row.
- **R3 levels A9 (`src/levels.test.ts`).** The describe moves whole into `if (RUN_DEEP) { … }` in its own place, retitled "A9 — different seeds actually differ [deep]", with its `it` title unchanged. The remnant is a new default-lane describe just before it: "QE-087-d (slice) — one draw per move: seed 1 over the first 10 of the thirty". It also asserts at least one blunder and at least one engine move, which makes the check non-vacuous.

## Two deviations from a literal reading, and why
- **Indent.** Biome formats with a 2-space indent, and nesting adds 2 (R2, R3) or 4 (R1) spaces, so the moved bodies cannot be byte-identical at column 0. They are byte-identical once that indent is removed. That check is scripted, 3 of 3 (observation note).
- **One `biome-ignore format` on R1.** At +4 spaces, R1's first body line (97 chars) would be reflowed past the 100-column width into five lines, and the formatter would add a trailing comma. One `// biome-ignore format: ABC-281 keeps the moved body byte-identical to base, indent aside` line before the deep `it(`, outside the body, keeps the six body lines identical. The alternatives were worse: a brace-less `if (RUN_DEEP) describe(…)` is reformatted to +4 anyway, and a `RUN_DEEP && describe(…)` expression is a new pattern in these files.

## Remnants as confirmed
None of the three differs from the confirmed subsets (condition 1). Added comments cite only `ABC-281` and `secnfr-nfr008-headroom`. No `it.skip`, no `skipIf`, no new environment variable, no new file and no `src/*.ts` line.
