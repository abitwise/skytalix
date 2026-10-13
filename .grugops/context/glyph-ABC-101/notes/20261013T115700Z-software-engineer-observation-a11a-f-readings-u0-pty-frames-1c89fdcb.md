---
id: 20261013T115700Z-software-engineer-observation-a11a-f-readings-u0-pty-frames-1c89fdcb
kind: observation
by: software-engineer
task: glyph-ABC-101
at: 2026-10-13T11:57:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-014
  - EPIC-002
  - src/render.ts
  - src/render.test.ts
  - src/__snapshots__/render.test.ts.snap
  - 20261013T115600Z-software-engineer-artifact-ref-merge-a11-commit-files-gates-a3a7a6f2
supersedes:
---

# `A11a`–`A11f` readings, the widened `A9` `-U0` read, and the two pty frames

This note is hand-authored and unsealed. These are the SE's readings. QE re-reads them.

## Red first (test note 6)

The `A11a`–`A11c` `it`s were written against the old table first.
`npx vitest run src/render.test.ts` then showed 30 tests, 2 failed (`A11a`, `A11b`) and 28 passed (`A11c` was green, as expected:
it does not depend on polarity). After the swap and before any re-pin, it showed **8 failed and 22 passed**. The 8 reds were exactly
`A11f`'s named set: the white-bottom literal, the six `matches its snapshot … — <name>` `it`s and
`matches a frame derived independently … 24 matrix cells`. The whole suite showed 8 failed and 1784 passed, all in
`src/render.test.ts`. No other file went red.

## Criteria on `d22a709f`

| criterion | reading |
|---|---|
| `A11a` | PASS. For every start-position piece, in both orientations: White in U+265A–U+265F, Black in U+2654–U+2659, and an exact code point per type. The expected table is written as numbers, not glyph literals |
| `A11b` | PASS. The white-bottom frame is exact over 9 rows. Black-bottom rows 1–2 and 7–8 and its label row are exact, all byte-equal to the contract and the probe's `readings-swapped-option-a.txt` |
| `A11c` | PASS. 24 matrix cells (6 FENs × 2 modes × 2 orientations): 9 rows; each row is 18 code points and 18 `String.length`; 0 `U+001B` |
| `A11d` | PASS. A parse of the `.snap` at the parent and at `d22a709f` gives 24 keys and 24 keys, an identical key set. 12 bodies changed, all `unicode`. All 12 `ascii` bodies are byte-identical, and so is the text outside the entries. The ASCII literal rows in `render.test.ts` are not in the diff |
| `A11e` | PASS. The ABC-014 `it`s ("…inside U+2654-U+265F, white and black on different code points", shading/`a1`/`h8`, `2a` zero-above-U+007F), `render-seam`, `frame*` and `cli.test` (`A7`) are green, and none of their lines is in the diff |
| `A11f` | PASS. Exactly 8 re-pins, none deleted, skipped or loosened; skip count 0; the snapshot was regenerated last, with `npx vitest run src/render.test.ts -u` ("12 updated", 30/30) |
| `A11g` | not mine. It is the owner's UAT. The pre-view frames are below |

## Widened `A9`: `git diff -U0 081c3715 d22a709f -- src/render.ts src/render.test.ts src/__snapshots__/render.test.ts.snap`

- `src/render.ts`: 2 hunks, `@@ -74,2 +74,2 @@` (comment) and `@@ -77,6 +77,6 @@` (the six pairs). The
  `[white, black]` order and the `ascii` table are not touched.
- `src/render.test.ts`: 4 hunks.
  - `@@ -316,2 +316,2 @@` and `@@ -322,2 +322,2 @@` re-pin the Unicode white-bottom literal's piece rows 8, 7, 2 and 1.
  - `@@ -411,12 +411,12 @@` re-pins `UNICODE_BY_FEN_LETTER`.
  - `@@ -634,0 +635,72 @@` adds the new `A11` block.
- `.snap`: 20 hunks, every one inside a `unicode` entry body (see `A11d`).
- No other file. New test files: 0.

## Pty frames: real CLI, `node src/cli.ts --colour <c>`, under a Python `pty.fork`, first 8 s, then SIGTERM

These frames are the `A11g` pre-view for the owner. They do not substitute for it: the reading of light against dark is the owner's eye on his own theme.

`--colour white` (white at the bottom):

```
8 .♖:♘.♗:♕.♔:♗.♘:♖
7 :♙.♙:♙.♙:♙.♙:♙.♙
6 ..::..::..::..::
5 ::..::..::..::..
4 ..::..::..::..::
3 ::..::..::..::..
2 .♟:♟.♟:♟.♟:♟.♟:♟
1 :♜.♞:♝.♛:♚.♝:♞.♜
   a b c d e f g h
White to move  1.
material: 0
```

`--colour black` (black at the bottom; first frame, before the engine's reply):

```
1 .♜:♞.♝:♚.♛:♝.♞:♜
2 :♟.♟:♟.♟:♟.♟:♟.♟
3 ..::..::..::..::
4 ::..::..::..::..
5 ..::..::..::..::
6 ::..::..::..::..
7 .♙:♙.♙:♙.♙:♙.♙:♙
8 :♖.♘:♗.♔:♕.♗:♘.♖
   h g f e d c b a
White to move  1.
material: 0
thinking...
```

The engine then played `1. e4`. The next frame shows `♟` on e4 in the filled (White) glyph.

## Aside, not acted on

Three `node src/cli.ts` processes were running on the host before this hop and were left untouched:
`--difficulty 5 --colour black`, `--colour black` and `--colour black --ascii`. All three started at 14:13 local, are foreground `S+`,
and have cwd in the worktree or the main checkout. They are most likely the owner's own sessions. `UNKNOWN - verify`.
