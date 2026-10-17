---
id: 20261017T123600Z-software-engineer-observation-abc096-criteria-gates-mutants-8f2d4b60
kind: observation
by: software-engineer
task: ticket-to-pr-ABC-096
at: 2026-10-17T12:36:00Z
verified_by:
confidence: high
refs:
  - ABC-096
  - ADR-0043
  - NFR-002
  - 20261017T123500Z-software-engineer-decision-abc096-build-to-adr0043-3c9e1a7f
supersedes:
---

# ABC-096: criterion readings, gates, mutants and the frame timing

This note is hand-authored and unsealed. Node v26.11.1, darwin-arm64. Code commit `a48da51c`, base `6edadcf0`.

**Criteria.** The row names are in `src/render-seam.test.ts`, describe "ABC-096 — the opening name in the message
region", unless another file is named.
- `A1`: PASS. Six names on a frame: `Ruy Lopez: …` → `Ruy Lopez`; 21 units whole (`King's Knight Opening`);
  `King's Gambit Accepted: …` → `King's Gambit Acce...`; `: …` → blank, and the frame equals the no-name frame.
  Shipped book: after `1. e4 e5 2. Nf3 Nc6 3. Bb5` the key is `75a8cd2e62c99edd` and row 1 is `Ruy Lopez`. On
  the way it shows `King's Pawn Game` and `King's Knight Opening`. The start position shows nothing.
- `A2`: PASS. Known name, no name, out of book (`1. e4 e5 2. Ke2`): 23 rows each, in both modes, equal to
  `frameHeight(...)`.
- `A3`: PASS. A name with ESC, BEL, DEL, `é` and a newline: 0 ESC, 0 C0, 0 DEL in both modes, 0 above U+007F in
  ascii, the same row count. Non-vacuity: row 1 is `[2JEvilName` (ascii) and `[2JEviléName` (unicode).
- `A4`: PASS in the suite for every bound except time. 100,000 `x`: row 1 is `xxxxxxxxxxxxxxxxxx...` (21), `W` and
  rows unchanged, in each mode. Astral (U+1D11E): 100,000, 21 and 11 of them show 9 + `...` (21 units); 10 of them
  show whole (20 units). There is no `more)` and no lone surrogate on any row.
  - **`< 16 ms` is read outside the suite.** `src/frame.test.ts:618` states that this repository has no in-suite
    wall-clock bars, so I did not add one. Script: `scratchpad/abc096-se/frame-time.mjs`. One fresh process, load
    average about 4.0, no foreign vitest at reading time. Readings for the Ruy Lopez position, as first call /
    median of 200 / max:
    - shipped book, ascii: **6.438 ms** first (this includes the book's one parse), 0.056 ms median, 0.319 ms max;
    - 100k `x`, ascii: 0.062 / 0.033 / 0.110 ms; 100k astral, ascii: 0.106 / 0.034 / 0.095 ms;
    - unicode: every case has a first call ≤ 0.062 ms and a median ≤ 0.035 ms. One max reads 3.907 ms (shipped
      book), a single outlier on a loaded host;
    - no name: 0.063 / 0.028 ms (ascii).
    - **All of them are under 16 ms.** `UNKNOWN - verify` on any other machine.
- `A5`: PASS. A seven-ply line over an in-memory book: blank, `King's Pawn Game`, blank, blank,
  `King's Knight Opening`, `Ruy Lopez` (the `m`-empty line end; `inBook` false, `bookMove` undefined), blank (not
  in book). Unnamed plies equal the no-name frame byte for byte. Take-back 5 → blank; replay → `Ruy Lopez`; new
  game → blank.
- `A6`: PASS. `git diff --quiet 6edadcf0 a48da51c -- data tools src/book.test.ts src/__snapshots__ src/frame.ts
  src/turn-loop.ts src/book-file.ts src/book-engine.ts` exits 0. `src/book.test.ts` is unmodified, 35/35 green.
  On an entry with an empty `m`: `openingName` returns the name, `inBook` is false, `bookMove` is undefined.
  Over 100 frames: 0 draws from `random`, 0 calls to `legalMoves`. Warnings: 0 lint diagnostics at base and at
  tip (113 files), and 0 book warnings in the rows.
- `A7`: PASS. With `n` = `7`, `{…}` or `""`, the frame equals the no-name frame, `openingName` is undefined,
  `bookMove` is defined, and warn is called 0 times.
- `A8`: PASS.
  - The type is pinned by a source row over `render-seam.ts`. The import is `import type`, and
    `bindsAValueFrom(…, "book.ts")` is false. A `@ts-expect-error` on a two-argument call makes `tsc` the
    instrument for "required".
  - `src/cli.test.ts` `ABC-043` `A1`: `render:\s*makeRenderSeam\(mode,\s*orientation,\s*book\)`, 1
    `createBookProbe(`, 1 `book` binder, and the no-`=>` row over the call is unchanged.
  - "Warning exactly once, launch to `quit`": the existing `CLI_DEEP` row `ABC-095` `A5` (stream half) in
    `src/cli.real-engine.test.ts` passes. It asserts stderr is exactly the warning plus a newline, on the
    book-absent copy, ended by `quit`.
- `A9`: PASS. Four message sets in each mode give a frame byte-identical to the no-name book's, with 0 lookups.
  `[]` makes 1 lookup, row 1 is `Ruy Lopez`, and there is no `more)`.
- `A10`: PASS (`src/history-pane.nfr.test.ts`). The child imports `book.ts` and `zobrist.ts` before
  `loaded = []`, and builds a real `createBookProbe` over in-memory bytes naming the start key `Probe Opening`
  (`m` empty). Positive controls: `named` = `[true, false]` (the empty game, the 40-ply game), `reads` = 1 inside
  the window. The probe's `warn`/`random` throw. No file read, no new spawn. The guard is green.

**Gates on tip.**
- `npm run -s lint`, `typecheck` and `build`: exit 0.
- `npm test`: exit 0, **58 files / 1822 tests**. The base is 58 / 1810, so this is +12, all in
  `render-seam.test.ts` (14 → 26).
- `last-run.json`: `success` true, 1822 passed, 0 failed, 0 pending, 0 todo.
- `test-skip-integrity --skip-count 0`: `No findings.`
- `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`: exit 0, 10 passed, 9.96 s. No red to read.

**Mutants**, planted in `scratchpad/abc096-se/tree` (a copy outside the repository). Each ran `render-seam.test.ts`
and `history-pane.nfr.test.ts`; all were killed:
- `M1`, a code-point cut → `A4` astral;
- `M2`, the name appended after the messages → `A9`;
- `M3`, always look up → `A9` (lookups);
- `M4`, the whole name instead of the family → `A1`, `A5`;
- `M5`, no cut → `A1`, `A4` ×2;
- `M6`, names only where `m` is non-empty → `A5`, `A6`, `A10`;
- `M7`, any non-empty `n` → `A7`;
- `M8`, a "last known" memo → `A5` ×2.
