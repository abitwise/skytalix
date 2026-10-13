---
id: 20261013T114900Z-ba-pm-observation-a11-frames-cites-and-pins-checked-d17b61d6
kind: observation
by: ba-pm
task: bapm-amend2-ABC-101
at: 2026-10-13T11:49:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-014
  - ABC-015
  - EPIC-002
  - ADR-0009
  - ADR-0010
  - ADR-0029
  - src/render.ts
  - src/render.test.ts
  - src/__snapshots__/render.test.ts.snap
  - .grugops/context/design-ABC-101-glyphs/notes/20261013T112345Z-frontend-ui-artifact-ref-abc101-piece-polarity-contract-1c687529.md
supersedes:
---

# A11 checked against the code: 14 of 14 frame strings byte-exact, cites hold, no other polarity pin, the "not moved" list holds

This note is hand-authored and unsealed, as `AGENTS.md` requires on this install. It is an agent `observation`,
not a stamp. I read everything at `main` `94c1daa5`. No timing was read and nothing under `src/` was edited.

## Frames (`A11b`)

**Method.** A scratch script outside the repo imported `renderBoard` and `parseFen` from the worktree. It rendered
the start position in `unicode` mode in both orientations and swapped `♔♕♖♗♘♙` with `♚♛♜♝♞♟` one character
at a time. Then it compared the result line by line, with `grep -xF`, against the 14 backticked strings in the
contract's `A11b` bullet.

**Result.** All 14 strings matched byte-exactly:
- White-bottom: all 9 rows match, and in order.
- Black-bottom: rows 1, 2, 7 and 8 and the label row match.
- Every row is 18 code points and 18 UTF-16 units.

**The UTF-8 column** of the contract's table is correct for all 12 code points. I checked it with
`Buffer.from(c).toString("hex")`.

## Cites, re-located at the base

Between `main` `94c1daa5` and the ABC-101 tip `98ea0a84`, `git diff --stat` is empty for `src/render.ts`,
`src/render.test.ts`, the snapshot and `src/frame.ts`.

| contract said | at `94c1daa5` |
|---|---|
| `GLYPHS.unicode` `src/render.ts:73-83` | `GLYPHS` opens `:73`; comment `:74-75`; `unicode` entries `:77-82`; `[white, black]` order `:70` |
| white-bottom literal `:316-323` | the Unicode `toEqual` opens at `:315`; board rows `:316-323`; label `:324` |
| six snapshot `it`s | one loop at `:342-352` over `PERFT_FENS`; 24 keys in the `.snap`, 12 of them `unicode` |
| QE oracle `:411-422` | `UNICODE_BY_FEN_LETTER` `:410-423`, entries `:411-422`; used at `:442` by the `it` at `:467` |
| ABC-014 "different code points" `it` | `:169-194`. It checks the range and inequality only, never which side gets which set |

## Other glyph mentions in `src/` and `tools/` (a static search, not a run)

`grep` for the 12 glyphs and `265x` found:
- `src/cli.test.ts:1107`: a range filter;
- `src/render-seam.test.ts:313`: a message-region knight;
- `src/render-seam.test.ts:325`: a range filter;
- `src/frame.test.ts:604,690,695`: message text;
- `src/frame.ts:38`: a comment naming the range.

**None of them pins polarity.** This agrees with the probe's "exactly 8 reds, all in `src/render.test.ts`".
I did not re-run the swapped suite: the probe's run is cited, not repeated.

## What A11 must not move (brief item 4)

- **`[A4]`:** no colour is emitted, and `A11c` asserts 0 `U+001B`. Untouched.
- **`2a`:** the ASCII table is not in the swap, and `A11d` reads byte-identical `ascii` snapshot entries.
  Untouched.
- **`2b` and ABC-015:** `src/glyph-mode.ts` is outside `A9`'s widened set. ABC-015's page names only the range
  (`:31`). Untouched.
- **`ADR-0009`, `ADR-0010`, `ADR-0029`:** none of them mentions a glyph or a pairing (`grep` empty). All 12 code
  points are BMP and one UTF-16 unit each, so `ADR-0010`'s width measure does not move. No module is added, so
  `ADR-0029`'s closure does not move. Untouched.
- **`AGENTS.md`:** no glyph in it. It is 24,569 B on `main` and 24,576 B on the branch. `A11` needs no bytes.
- **Seen, not edited:** EPIC-002 § Scope `:58` lists "Unicode figurines (♔♕♖♗♘♙) by default". That is an example
  of the family and assigns no side. No edit is owed; it is named here so nobody reads it as a pin.

## Merge forecast for the SE hop

Since the merge-base `3ea3e352`, both `main` and the branch append at the end of two files:
- `plans/tickets/ABC-101-difficulty-selection.md`: the branch adds "Delivery — addendum" and `main` adds this
  hop's 2026-10-13 amendment;
- `plans/traceability.md`.

Expect two end-of-file conflicts. Keep both sides, in date order. `main` has changed no `src/` file since the
merge-base, so no code conflict is expected.
