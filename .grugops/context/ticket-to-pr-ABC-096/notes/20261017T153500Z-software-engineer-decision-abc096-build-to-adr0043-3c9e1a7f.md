---
id: 20261017T153500Z-software-engineer-decision-abc096-build-to-adr0043-3c9e1a7f
kind: decision
by: software-engineer
task: ticket-to-pr-ABC-096
at: 2026-10-17T15:35:00Z
verified_by:
confidence: high
refs:
  - ABC-096
  - ADR-0043
  - src/book.ts
  - src/render-seam.ts
  - src/cli.ts
supersedes:
---

# ABC-096 built to ADR-0043 D1-D7, inside the code fence

This note is hand-authored and unsealed.

- **The probe (`src/book.ts`).** `parseBook` now returns `{ lines, names }`. `names` holds `n` for every entry
  whose `n` is a non-empty string, **including entries whose `m` is empty**. Any other `n` is skipped silently:
  no warning, no refusal. `lines` is unchanged: only entries with a non-empty `m`, so `inBook`/`bookMove` do not
  move. One `loaded()` closure is the single lazy load, shared by all three methods. `openingName` is
  `loaded()?.names.get(keyOf(position))`: no `legalMoves`, no `random`. A switched-off book returns `undefined`.
- **The seam (`src/render-seam.ts`).** `makeRenderSeam(mode, orientation, book: Pick<BookProbe, "openingName">)`,
  required, `import type { BookProbe }`. When `messages` is non-empty it passes through unchanged and nothing is
  looked up (D4). When it is empty, `nameItems(book.openingName(position))` gives `[]` or one item.
- **The cut is the page's, not the ADR's literal wording.** The ADR's D3 says the cut "counts code points". The
  page (`A1`, amended 2026-10-17) counts **UTF-16 code units, without splitting a code point**: a family of at most
  `HISTORY_COLS` code units is whole; a longer one keeps whole code points filling at most
  `HISTORY_COLS - ELLIPSIS.length` code units, then `...`. I built the page's rule, because the page is the
  contract and it is the only rule that keeps the item inside `packRegion`'s `.length` check. A code-point cut
  is the planted mutant `M1`, and it reds `A4`'s astral row.
- **Digit-free.** `ELLIPSIS = "..."`, `FAMILY_END = ": "`, `const [family = ""] = …split(FAMILY_END)`. The
  precedence test is written `messages.length ? messages : …`, with a comment saying why: `> 0` put a digit in
  the code and turned the `ABC-041` `A3` pin red.
- **No second sanitizer.** The item goes through `assembleFrame`'s `sanitize`. The cut runs **before** it, so a
  name made of dropped characters can show fewer than its cut length. That is safe, and it is what "neutralised
  only by `sanitize`" means.
- **No state** is held in the seam (D5).
- **`src/cli.ts`.** The `render:` line is `makeRenderSeam(mode, orientation, book)`, with the same `book` binding
  `withBook` gets. The stale comment ("Nothing is read until the engine's first ply asks") is replaced. The new
  text holds none of bar 1's banned substrings and no numeric literal.
- **cli.test.ts reference frames.** The spawned children read the shipped book, so the reference frames
  (`frameOf`, `expectedFrames`, `A2`'s mated frame) are built over `SHIPPED_BOOK`: a real `createBookProbe` over
  `data/opening-book/book.json` read in the test, with `warn` and `random` throwing. All 78 rows stayed green.
- **book-engine.test.ts `A4`.** Uses `{ openingName: () => undefined }`, so that row stays the decorator's alone.
