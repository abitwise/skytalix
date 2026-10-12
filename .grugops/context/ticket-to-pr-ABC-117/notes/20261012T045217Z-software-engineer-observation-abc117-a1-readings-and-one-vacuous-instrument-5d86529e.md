---
id: 20261012T045217Z-software-engineer-observation-abc117-a1-readings-and-one-vacuous-instrument-5d86529e
kind: observation
by: software-engineer
task: ticket-to-pr-ABC-117
at: 2026-10-12T04:52:17Z
verified_by:
confidence: high
refs:
  - ABC-117
  - A1
  - ABC-115
  - G-QE115-5
  - src/cli.ts
supersedes:
---

# `ABC-117` `A1`: both runs, made at this hop, and one of the page's two zeroes measures nothing

Host: Node v26.11.0, branch `grugops/ABC-117-exit-one-correction` from `main` @ `3537fe48`. The
`src/cli.ts` this branch ships is byte-identical to `main`'s (the diff under `src/` is comment lines in
`src/cli.test.ts` only), so these readings are of the delivered build.

## Run 1 — the delivered build, read-only fd as stdout

`node src/cli.ts 1</dev/null </dev/null`, stderr captured to a file:

| quantity | reading |
|---|---|
| exit status | **1** |
| `grep -c '^usage: '` on stderr | **0** |
| `grep -c 'internal error'` on stderr | **0** |
| `CAUGHT:` printed | **no** (0 lines; the product has no such line, recorded for parity with run 2) |
| stderr shape | Node's uncaught-exception banner, caret on `throw error` at **`src/cli.ts:160`**, `Error: EBADF: bad file descriptor, write`, ending `Node.js v26.11.0`; 1148 bytes; names the absolute checkout path |

## Run 2 — the out-of-product reproduction (QE's, `residual-G-QE115-5-2026-08-21` `…d2c79dc9`)

The six lines of JS quoted in that note (the page calls them eleven; the count is the note's, the
code is what was run), saved to a scratch file outside the repository and run there with
`node repro.mjs 1</dev/null`:

| quantity | reading |
|---|---|
| exit status | **1** (not the `70` the `catch` would have set) |
| `Usage`/`usage` lines | 0 (the script prints none on any path) |
| `internal error` lines | 0 (likewise) |
| `CAUGHT:` printed | **no** — 0 lines; Node's banner printed instead, caret on `throw e` |
| control, stdout writable | exit 0, 0 bytes of stderr |

## The disagreement with the page, written down as `A1` requires

**The page's `grep -c "Usage"` reads 0 on EVERY path, so it decides nothing.** The usage line is
lower case: `const USAGE = "usage: npm run chess -- …"` (`src/cli.ts:88`), and it was lower case at
the cut's own commit `fcf12c1` (`:87`) and at the re-score's `39d87491` (`:88`). Control at this hop:
`node src/cli.ts --nonsense` exits `1` and prints the usage line, and `grep -c 'Usage'` on that stderr
is **0** too. **The discriminating instrument is `grep -c '^usage: '`: 1 on the refusal control, 0 on
the `EBADF` path.** With that instrument the page's conclusion holds — `USAGE_EXIT_CODE` is assigned
only at `src/cli.ts:141`, after the usage line is written at `:136-138`, so a 0 means it was not
assigned. The corrected sentences on the board (S6/S9), the `ABC-115` page (S7) and the superseding
note (S1/S2) cite the `usage:` count, not the `Usage` one.

The `internal error` count does discriminate: `INTERNAL_ERROR` is `"internal error: a bug ended this
session, …"` (`src/cli.ts:108`), written by `main`'s `catch` at `:196`. **That control is by
inspection of the constant, not by a run** — no command line drives the product into its `catch`
without a planted fault, and none was planted.

## Line drift recorded, content unchanged

The page cites `:90` / `:135` / `:140` / `:159` / `:166-196` at `fcf12c1`. At `3537fe48`: `USAGE_EXIT_CODE`
`:91`, the usage write `:136-138`, the assignment `:141`, the re-throw `:160`, `try` `:169`, `catch`
`:193`, internal-error write `:196`. The arm is unchanged.
