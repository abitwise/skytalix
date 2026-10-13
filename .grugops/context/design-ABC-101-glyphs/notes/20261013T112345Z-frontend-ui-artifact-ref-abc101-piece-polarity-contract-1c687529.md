---
id: 20261013T112345Z-frontend-ui-artifact-ref-abc101-piece-polarity-contract-1c687529
kind: artifact-ref
by: frontend-ui
at: 2026-10-13T11:23:45Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-014
  - EPIC-002
  - RISK-005
  - WCAG-2.2-AA
  - src/render.ts
  - src/render.test.ts
  - src/__snapshots__/render.test.ts.snap
  - .grugops/context/design-ABC-101-glyphs/notes/20261013T112345Z-frontend-ui-observation-abc101-glyph-options-and-readings-81cf192b.md
supersedes:
---

# Design contract: ABC-101 piece polarity. Recommendation: option (a), White drawn with the filled glyphs

The options and readings behind this contract are in the sibling observation `…81cf192b`. The owner's word is in `wave-2026-09-25` `…owner-word-abc101-uat-glyph-fix-in-scope-7b3805a0`.
The authoritative Scope/Risks are ABC-101's page and EPIC-002 `[A4]`/`2c`. I cite them here and do not override them.

## Recommendation

**Swap the six Unicode pairs in `GLYPHS.unicode` (`src/render.ts:73-83`).** White gets U+265A–U+265F (filled),
Black gets U+2654–U+2659 (outline). This changes no ADR, no frame geometry, no flag, no selection rule
and no ASCII byte. It is the only option that fits ABC-101's `M` and `AGENTS.md`'s 0 B headroom. It
fixes the owner's terminal, which is dark. Its cost is the mirror image of the bug: on a light theme Unicode pieces read
inverted. The remedy is the same one EPIC-002 `2c` already set for every Unicode failure: the documented
`--ascii`. Why not the others:
- (b) and (d) contradict `[A4]`.
- (e1) contradicts ABC-015.
- (c) is sound but cannot land in ABC-101 without a Scribe trim of `AGENTS.md`. It is the named follow-up if the owner wants it (question below).

## Design tokens (glyph table, the only token that moves)

| piece | White (new) | Black (new) | UTF-8 |
|---|---|---|---|
| K | ♚ U+265A | ♔ U+2654 | `E2 99 9A` / `E2 99 94` |
| Q | ♛ U+265B | ♕ U+2655 | `E2 99 9B` / `E2 99 95` |
| R | ♜ U+265C | ♖ U+2656 | `E2 99 9C` / `E2 99 96` |
| B | ♝ U+265D | ♗ U+2657 | `E2 99 9D` / `E2 99 97` |
| N | ♞ U+265E | ♘ U+2658 | `E2 99 9E` / `E2 99 98` |
| P | ♟ U+265F | ♙ U+2659 | `E2 99 9F` / `E2 99 99` |

The following are unchanged: the shading `:` (dark) and `.` (light), the ASCII table (case = colour), 2-character cell pitch, 9 rows × 18.

## Acceptance (Given/When/Then) for BA/PM to paste into ABC-101 as `A11`

- **`A11a` (polarity, per type).** **Given** glyph mode `unicode` and the start position, **when** `renderBoard` runs in
  each orientation, **then** every White piece cell's glyph is in U+265A–U+265F and every Black piece cell's glyph is in
  U+2654–U+2659, matching the table above type for type (K→U+265A/U+2654 … P→U+265F/U+2659).
- **`A11b` (exact frames).** **Given** the start position in `unicode` mode, **then** `renderBoard(…, "white-bottom")`
  equals, row for row:
  `8 .♖:♘.♗:♕.♔:♗.♘:♖` · `7 :♙.♙:♙.♙:♙.♙:♙.♙` · `6 ..::..::..::..::` · `5 ::..::..::..::..` ·
  `4 ..::..::..::..::` · `3 ::..::..::..::..` · `2 .♟:♟.♟:♟.♟:♟.♟:♟` · `1 :♜.♞:♝.♛:♚.♝:♞.♜` · `   a b c d e f g h`
  **and** `renderBoard(…, "black-bottom")` has first two rows `1 .♜:♞.♝:♚.♛:♝.♞:♜` · `2 :♟.♟:♟.♟:♟.♟:♟.♟`, rows
  7–8 `7 .♙:♙.♙:♙.♙:♙.♙:♙` · `8 :♖.♘:♗.♔:♕.♗:♘.♖`, and label row `   h g f e d c b a`.
  *(These are the probe's readings, `../probe/readings-swapped-option-a.txt`.)*
- **`A11c` (geometry and no colour).** **Given** every position in `render.test.ts`'s matrix, both modes, both
  orientations, **then** the frame is 9 rows. Each row is 18 code points **and** 18 UTF-16 units (`String.length`, the unit
  `src/frame.ts` pads by), and the frame contains **0** `U+001B` (no SGR, `[A4]`).
- **`A11d` (ASCII untouched).** **Then** every `ascii` entry in `src/__snapshots__/render.test.ts.snap` is byte-identical to
  `main`. `git diff <base> <delivered> -- src/__snapshots__/render.test.ts.snap` touches `unicode` entries only, and the
  ASCII literal rows in `render.test.ts` are unchanged.
- **`A11e` (ABC-014's own criteria still hold, unedited).** **Then** the existing `it`s "draws Unicode piece cells inside
  U+2654-U+265F, white and black on different code points", the shading/`a1`/`h8` rows, `2a`'s zero-above-U+007F rows,
  and `render-seam`, `frame*` and `cli.test` (`A7` `--unicode` on a pipe) are green **without edits**.
- **`A11f` (the re-pins are deliberate, named, and the only ones).** The reds the swap causes are exactly 8 `it`s in
  `src/render.test.ts`: the white-bottom literal (`:316-323`), the six snapshot `it`s (Unicode entries), and the
  QE oracle through `UNICODE_BY_FEN_LETTER` (`:411-422`). Each is re-pinned to the table above. None is deleted,
  skipped or loosened (skip count 0). The snapshot is regenerated **only after** `A11a`/`A11b` are written and red.
- **`A11g` (the owner's eye, UAT, not automatable per `2c`).** **Given** a dark-background UTF-8 TTY, **when** the
  owner runs `npm run chess -- --colour black`, **then** the pieces at the bottom (theirs, Black) read as the dark side and
  the engine's (White) read as light. **And** with `--colour white` the bottom pieces read light. On a light-background
  terminal the same command reads inverted, and `--ascii` reads correctly on both.

## Contracts and tests this moves (each needs its owner's hand, none is overridden here)

- **ABC-101 `A9`** (BA/PM): widen the allowed set by `src/render.ts`, `src/render.test.ts`, and
  `src/__snapshots__/render.test.ts.snap`. "New test files: 0" holds.
- **ABC-014 § Scope pairing line** (BA/PM, Done page): add a dated pointer saying the Unicode pairing is White = `♚♛♜♝♞♟`,
  Black = `♔♕♖♗♘♙` per ABC-101 `A11`. ABC-014's acceptance criteria are unchanged.
- **EPIC-002 `2c`** (BA/PM): one line saying the reduced promise now also covers a light-background terminal. The remedy stays `--ascii`.
- **`src/render.ts` header comment** (`:74-75`, "U+2654-U+265F, white then black"; the `[white, black]` entry order at `:70` stays) is updated by the SE with the table.
- **Not moved:** `[A4]`, `2a`, `2b`, ABC-015, `ADR-0009`, `ADR-0010`, `ADR-0029`, `src/frame.ts`, `src/glyph-mode.ts`,
  `src/render-seam.ts`, `cli-options.ts`'s accepted set, `AGENTS.md`.

## Accessibility bar: WCAG 2.2 AA (`agent-factory/checklists/accessibility-checklist.md`)

- **1.4.1 Use of Color:** met by construction. Side is carried by glyph shape (filled vs outline) and in ASCII by
  case, never by colour alone. The frame emits no colour.
- **1.4.3 / 1.4.11 contrast:** the glyph is drawn in the terminal theme's own foreground on its own background. The
  product emits neither, so it can neither fail nor claim contrast: **`UNKNOWN - verify`**, outside the process's control.
- Keyboard, labels and focus are not touched. axe-core does not apply (no DOM).

## Visual baseline and verification owner

The baseline is `src/__snapshots__/render.test.ts.snap`, which the vitest snapshot tool already uses. QE/E2E verifies
`A11a`–`A11f` at the gate. The owner verifies `A11g` at UAT, because rendered pixels are not assertable in-process (`2c`).
Responsive and performance budget: no change. The same 18 × 9 frame and the same `NFR-002` per-frame work (a table lookup).

## Size

**ABC-101 stays `M`.** The swap is XS: 12 string literals, 2 test tables and a snapshot regeneration. Split line inside
ABC-101: `A11` is its own commit on the ABC-101 branch, and it is reviewable and revertable alone. **A light/dark flag (option c)
is NOT in ABC-101.** If the owner wants it, it is a separate ticket of about `S`, after a Scribe trim of `AGENTS.md`, with an
Architect call on new `GlyphMode` member vs `renderBoard` parameter.

## The one owner question (ratifies a reduced promise; it does not block the build)

"After the fix, Unicode pieces read correctly on a dark terminal and inverted on a light one. Which do you want?
**(A)** accept `--ascii` as the light-terminal remedy (recommended; no new flag),
**(B)** A now, plus a follow-up ticket for a `--light`-style flag,
**(C)** the flag inside ABC-101 (ABC-101 grows past `M` and needs `AGENTS.md` bytes freed first)."
