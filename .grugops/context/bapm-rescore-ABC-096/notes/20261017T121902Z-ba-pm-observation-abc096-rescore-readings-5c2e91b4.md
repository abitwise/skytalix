---
id: 20261017T121902Z-ba-pm-observation-abc096-rescore-readings-5c2e91b4
kind: observation
by: ba-pm
task: bapm-rescore-ABC-096
at: 2026-10-17T12:19:02Z
verified_by:
confidence: high
refs:
  - ABC-096
  - ADR-0043
  - ADR-0009
  - NFR-002
  - NFR-007
  - 20261017T120920Z-architect-design-observation-abc096-seam-premises-and-costs-7d7f6de3
supersedes:
---

# ABC-096 re-score: what was re-read at `8ed9ba2b`

This note is hand-authored and unsealed: `context-io.ts` is absent on this install. The readings come from
scratch scripts outside the repository, run in the scratchpad. They import the worktree's `src/` read-only and
read `data/opening-book/book.json`. Node v26.11.1, darwin-arm64. No timing was read, and nothing was added to the
suite.

## Equal to `ADR-0043`

- **The book:**
  - 5,390 entries, 2,853 named;
  - 1,764 entries with an empty `m`, and all 1,764 are named;
  - 149 families: 31 longer than 21 code points, the longest 42; 5 holding a code point above `U+007F`
    (Neo-Grünfeld, Grünfeld, Kádas, Réti, Döry); 0 names holding an astral code point; 9 families holding a
    digit (data only, not the seam's source text);
  - key `75a8cd2e62c99edd` is `Ruy Lopez`. The start position has no name.
- **The frame:** `makeRenderSeam(mode, "white-bottom")` at the start position gives 23 rows with `W` = 21, in both
  ascii and unicode.
- **Call sites:** `makeRenderSeam` is called at `src/cli.test.ts:196,2727,2911`, `src/render-seam.test.ts:90,170`,
  `src/history-pane.nfr.test.ts:741` and `src/book-engine.test.ts:115`. The one production call is `src/cli.ts:187`,
  and `const book = createBookProbe(` sits above it at `:177`.
- **The `ABC-043` `A1` pin:** `src/cli.test.ts:2821` is `/render:\s*makeRenderSeam\(mode,\s*orientation\)/`. That
  does not match `makeRenderSeam(mode, orientation, book)`, so the pin must move.
- **The digit pin:** `src/render-seam.test.ts:268` applies to executable text with comments removed.
- **The source-text bans:** `src/cli.test.ts:1803,1816` ("bar 1") scan `cli.ts` with its comments included for
  `eval`, `Function(`, `child_process`, `import(`, `fetch`, `WebSocket` and `XMLHttpRequest`. A corrected comment
  must not use "evaluate".
- **The UAT lines walk:**
  - `1. e4 e5 2. Nf3 Nc6 3. Bb5`: King's Pawn Game (×2), King's Knight Opening, King's Knight Opening: Normal
    Variation, then Ruy Lopez.
  - `1. d4 Nf6 2. c4 g6 3. Nc3 d5` ends at Grünfeld Defense.

## NEW: a measured gap in `ADR-0043` D3

- **The units disagree.** D3 cuts the family to at most `HISTORY_COLS` **code points**. `src/frame.ts` `packRegion`
  compares `candidate.length`, which counts **UTF-16 code units**, against `W`.
- **Measured.** `seam(history, status, false, ["\u{1F600}".repeat(21)])`:
  - ascii: both message rows are blank, because `sanitize` drops the astral code points;
  - **unicode: row 1 is blank and row 2 is `(+1 more)`.** The 42-unit item is dropped, and the marker claims a
    hidden message. That is the effect `ADR-0043` Alternative 4 rejects.
- **Reach.** Only a hostile or hand-edited artifact reaches this. The shipped book has 0 astral names, and
  `tools/opening-book/compile.ts` refuses only control bytes in a name. Even so, `A3`/`A4` are hostile-input
  criteria, and `A4`'s 100,000-character name may be built of any code points.
- **Disposition (see the decision note).** The page counts the cut in code units, without splitting a code point.
  That meets D3's letter (≤ 21 code points), its purpose ("an item that fits is never dropped by `packRegion`") and
  its surrogate rule. For every shipped family it gives the same text as counting code points.
