---
id: 20261013T112345Z-frontend-ui-observation-abc101-glyph-options-and-readings-81cf192b
kind: observation
by: frontend-ui
at: 2026-10-13T11:23:45Z
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
  - RISK-005
  - src/render.ts
  - src/render.test.ts
  - src/__snapshots__/render.test.ts.snap
  - .grugops/context/design-ABC-101-glyphs/probe/
supersedes:
---

# ABC-101 piece colour on a dark terminal: the cause, five options, and what each one breaks

Read at `main` `d5b55db3`. `src/render.ts`, `src/render.test.ts`, the snapshot file and `src/frame.ts`
are byte-identical on `grugops/ABC-101-difficulty-selection` (`98ea0a84`). I checked this with `git diff --stat`, which was empty.
Hand-authored per AGENTS.md (no sanctioned writer on this install), so no seal.

## Cause, from the code

`src/render.ts:73-83` maps White to U+2654–U+2659 (outline, `♔♕♖♗♘♙`) and Black to U+265A–U+265F
(filled, `♚♛♜♝♞♟`). The frame sends no colour (`[A4]`), so the terminal fills the glyph with its own
foreground colour. On a dark theme the foreground is light. That makes Black's filled pieces look
light and White's outline pieces look dark, which is what the owner reported. On a light theme the
standard mapping reads correctly. ASCII mode uses case, not ink, so it reads correctly on both.
**What a terminal actually draws can't be observed from inside the process** (EPIC-002 `2c`, ABC-015 "Font detection … does not exist").
That also covers the background colour.

## Contracts read (the fences any option must respect)

- **EPIC-002 `[A4]`** (BA/PM scope call): shading is by character. **"ANSI colour is cut from the MVP"**
  and `NO_COLOR` goes with it. That is deferred, not deleted. `RISK-005`'s colour half is "disposed of by [A4]".
- **ABC-014 § Scope** pairs the sets as "`♔♕♖♗♘♙` / `♚♛♜♝♞♟`" next to "`KQRBNP` upper = white". **ABC-014's
  acceptance** only requires piece cells in U+2654–U+265F and different code points for White and Black of the same type.
  It does not say which side gets which set. ABC-014 Out of scope: ANSI colour.
- **ABC-015 / EPIC-002 `2b`:** a five-row table. The answer is `unicode`/`ascii`, decided once. ABC-015 Out of scope:
  "Colour mode … no second capability decision", "Do not invent a probe".
- **Frame geometry:** 9 rows × 18 characters (`render.ts` header, `4a`). `src/frame.ts:36-39` counts width
  in UTF-16 units (`String.length`). `ADR-0010`: `W` is a max over rows, every row is padded to `W`, and a per-row erase runs at column 0.
- **`ADR-0029`:** the frame-path load closure. It is unaffected by any option that adds no module.
- **ABC-101 `A9`:** the allowed file set is `cli-options.ts`, `cli.ts`, their tests, `engine.test.ts` (one row) and `AGENTS.md`.
  **`AGENTS.md` on the ABC-101 branch is 24,576 B, exactly the `ABC-109` `A5` budget, so there is 0 B headroom.**

## Probe readings (`../probe/`, out of tree, no timing)

- Main: every row is 18 code points and 18 UTF-16 units, in both modes and both orientations.
- Option (a) (pairs swapped): every row is still 18/18. ASCII rows are byte-identical to main. Each piece cell is still in
  U+2654–U+265F, and White ≠ Black per type.
- Option (a), full suite on the swapped copy: **8 reds, all in `src/render.test.ts`**.
  - the literal `it` "draws the start position with white at the bottom" (`:316-323`)
  - the six snapshot `it`s (startpos, kiwipete, position-3…6), on their Unicode entries only
  - the QE oracle "matches a frame derived independently from the FEN text, on all 24 matrix cells", through
    `UNICODE_BY_FEN_LETTER` (`:411-422`)
  - Nothing else reds. `cli.test.ts` is 69/69 with `AGENTS.md` present, and `render-seam`, `frame*`,
    `glyph-mode*`, `status-panel` and `result-screen` are all green.
- Option (b): wrapping each glyph of one rank in `ESC[97m…ESC[39m` takes that row's `String.length` from **18
  to 98**. The display width stays 18.

## Options

| | What the player sees, dark terminal | What the player sees, light terminal | Reds | Contradicts a merged contract? |
|---|---|---|---|---|
| **(a)** swap the Unicode pairs (White filled) | correct | inverted, which is today's bug mirrored. The remedy is `--ascii` | 8 `it`s in `render.test.ts` (above) | **No ADR and no acceptance criterion.** ABC-014 § Scope's pairing line needs a dated BA/PM annotation. ABC-101 `A9` must be widened by 3 files |
| **(b)** foreground SGR on piece glyphs only | correct if the colours are chosen well | correct if the colours are chosen well | `frame.ts` width: 18→98 per rank, so `W` and the padding inflate past 80 columns and the screen row count breaks (`4a`/`4b`); `cli.test` A8 `not.toContain("\u001b[")` reds unless gated on TTY; render snapshots and oracle | **Yes.** EPIC-002 `[A4]` (ANSI colour cut from MVP, `NO_COLOR` unanswered), ABC-014 and ABC-015 out of scope ("no second capability decision"), and the `ADR-0010` width measure. Owner/BA-PM reversal plus an Architect ruling are needed |
| **(c)** flag/env choosing a dark or light glyph set, default dark | correct | correct with the flag | (a)'s 8, plus `cli.test` closed-set guards (`TABLE` equality, every argument spawned, `devRunSlot`) | No ADR, but it **cannot land in ABC-101 today**. `ABC-065` `A3` forces `AGENTS.md` to document the flag, and `AGENTS.md` has 0 B headroom (`ABC-109` `A5`). It also needs either a `GlyphMode` member (reopens ABC-015's five-row table, `2b`) or a `renderBoard` parameter (signature change on ABC-014, consumed by `render-seam.ts`) |
| **(d)** filled glyph for both sides, told apart another way | no way to tell them apart without colour | the same | ABC-014 "different code points" `it` (`:169-194`) | **Yes.** Without colour the only spare character is the shading character. ABC-014 says every square carries one, and a 3-character cell breaks 9×18. With colour this becomes (b) |
| **(e1)** detect the background (`COLORFGBG` env, or an OSC 11 query) | correct where detection works | correct where detection works | ABC-015 table tests | **Yes.** OSC 11 is a terminal round-trip probe (ABC-015 "Do not invent a probe"; the frame must stay a value). `COLORFGBG` adds a sixth signal to `2b`'s table, and how reliably terminals set it is `UNKNOWN - verify` |
| **(e2)** do what other CLI chess tools do | — | — | — | Precedent only. python-chess `Board.unicode(invert_color=…)` exists for dark terminals, which is (a)/(c). Stockfish's `d` and GNU Chess print ASCII letters. **`UNKNOWN - verify`**: this is from recall, I did not run either tool in this hop |

Five-state note (CLI reading): only the occupied-cell "success" rendering changes. Empty squares
(shading only), the thinking state, the error path (an unknown board byte throws) and partial data (n/a; the frame
is total) are not touched by any of (a)–(e).
