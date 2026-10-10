---
id: 20261010T143605Z-software-engineer-decision-abc131-three-commits-two-separable-rows-bd683e28
kind: decision
by: software-engineer
at: 2026-10-10T14:36:05Z
verified_by:
confidence: high
refs:
  - ABC-131
  - ADR-0034
  - ABC-084
  - QE-127-e
  - QE-126-b
  - src/puzzle-corpus.ts
  - src/puzzle-suite.baseline.json
  - src/puzzle-suite.test.ts
supersedes:
---

# `ABC-131`: three commits, test rows first, so the gate is red only between the drop and the baseline

Hand-authored, no seal (AGENTS.md: no `finding` is admissible on this install).

1. **Order: tests (`7cf74d43`), then the drop (`506d80c6`), then the baseline (`51fb4ca9`).** `A6`'s row
   is green on the old baseline too (58 + 4 = 62, every name a row). Putting it first means the only red
   commit is `506d80c6` (total 58 against a recorded 62), which test note 1 expects.
2. **`A6` asserts per name** (`expect(names.has(name), name).toBe(true)`), not with a filtered list.
   The first draft's red read `expected [ Array(1) ] to deeply equal []` and did not name the bad entry.
   The per-name form names it.
3. **`A8` is one `toEqual([gain])`** over every `+(\d+)` in `source`. That covers both "exactly one
   `+N`" and "`N` equals the gain", and the row name is the message. The `gain > 0` and accepted-set
   assertions are unchanged.
4. **One comment line, at the place of the first deleted row.** It names the four seeds and
   `ADR-0034` (b) at 0.8x. The corpus numstat is `1 4`.
5. **The baseline was written with `json.dumps(indent=2, ensure_ascii=False)`.** The `unsolved` block
   is byte-identical (verified by diff). Only `solved`, `total` and the six measured or reason fields
   moved, 8+/8−. The `reason` quotes the owner's sentence verbatim from the Orchestrator's note
   `…owner-word-adrs-91c4e7a0`.
