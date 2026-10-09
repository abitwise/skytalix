---
id: 20261009T164755Z-architect-design-decision-ruling3-row8-keep-the-refound-search-fixture-4fdb96bc
kind: decision
by: architect-design
at: 2026-10-09T16:47:55Z
verified_by:
confidence: high
refs:
  - ABC-082
  - ABC-121
  - ADR-0026
  - src/search.pvs-lmr.test.ts
  - 20261009T163130Z-software-engineer-decision-abc082-term-shape-lift-and-a4-search-row-refixtured-7040acad
  - 20261009T164755Z-architect-design-observation-scratch-checks-a1-replaced-a2-hit-rates-a4-discard-mutant-39129557
supersedes:
---

# Ruling 3: row 8, KEEP the Engineer's reading (b). The `search()` row stays on `A4_SEARCH_FEN` `[10, "b1c1"]`; `A4_FEN` `[95, "h5e5"]` stays on the `chooseMove` row

Hand-authored, no `seal`.

## Why keep (b)

- **It is the page's F-class rule, applied as written.** `A4_FEN`'s own header says it was kept
  only where "a build without the reduced-move re-search goes WRONG and the correct rule does
  not". On this build, at fixed depth 4, that is no longer true for `noLmrResearch` (it reads the
  correct 95 / h5e5, Engineer `…7040acad`). The fixture lost its purpose on that row. The rule
  says to re-find it with the recorded probe, and the Engineer did that (`a4scan.ts`,
  `a4engine082.ts`).
- **It closes a gap that (a) leaves open, and the gap is measured, not argued** (`…39129557`):
  - The Engineer's six re-search mutants die at the re-search COUNT assertion on either fixture,
    so they do not separate (a) from (b).
  - A mutant that runs the full-depth re-search in `src/search.ts` and then discards its result
    passes the count assertion.
  - Under (b) that mutant is red: `expected -20 to be 10`. Under (a) it survives the whole
    `search.pvs-lmr.test.ts` default lane, 20 / 20.
  - The `chooseMove` row cannot see it, because it runs `engine.ts`'s recursion.
- **It keeps `ADR-0026`'s Consequences true.** "`A4` reds `noLmrResearch` and `noResearch`" still
  holds on both rows, with the value bite back on the `search()` row.
- **No ADR amendment is needed.** `ADR-0026` names `A4` and the null-window requirement, never a
  FEN or a `[95, "h5e5"]` pin (grep: no `h5e5` or `A4_FEN` in the ADR).

## What the Engineer must change

Nothing. The hunk at `bef7d43` stands as written: the `A4_SEARCH_FEN` constant with its comment,
the two `search()`-row call sites, and the `[10, "b1c1"]` pin.

**One residual, named, not fixed here.** An `engine.ts` copy of the discard mutant would be
caught by the `chooseMove` row only if `A4_FEN`'s deepened value bite holds. The Engineer measured
that it does (both variants read 50 / d6d5 against 95 / h5e5). The `engine.ts` side was not
planted here (claim `…156f09f2`).
