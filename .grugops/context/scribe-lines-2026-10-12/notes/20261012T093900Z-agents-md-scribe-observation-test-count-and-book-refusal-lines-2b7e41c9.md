---
id: 20261012T093900Z-agents-md-scribe-observation-test-count-and-book-refusal-lines-2b7e41c9
kind: observation
by: agents-md-scribe
at: 2026-10-12T09:39:00Z
verified_by:
confidence: high
refs:
  - ABC-145
  - ABC-148
  - ABC-117
  - ABC-116
  - AGENTS.md
  - memory-bank/90-agents-md-command-log.md
  - .grugops/context/qe-ABC-145/
supersedes:
---

# `AGENTS.md`: the `Test (all)` count and the book-compiler row after today's four merges

Hand-authored and unsealed. `AGENTS.md` records that no sanctioned writer exists on this install and
`context.human_admission` is `off`; this note is not a `finding`.

## What changed in `AGENTS.md`

- `Test (all)` receipt: "56 files, 1741 tests, 6.2 s" -> "56 files, 1743 tests". The count is from one
  `npm test` run in this worktree off `main` `d8794608` (exit 0, 56 files, 1743 tests). Counts only: no wall
  time was recorded, three hops shared the host. The 6.2 s figure was dropped rather than kept beside a count it
  was not taken at; the last quiet time is in the command log's `ABC-152` pass.
- Book-compiler row (`node tools/opening-book/compile.ts <dir>`): added "Wrong sha256: refused, exit 1,
  nothing written (ABC-145)." The source is QE's `A4` RUN (`qe-ABC-145` note `…0d24876c`), cited, not re-run
  (it needs five files fetched over the network). The no-argument run was re-run here: usage line, exit 1.
- Size: 24,494 B -> **24,545 B** (budget 24,576 B, `ABC-109`; headroom 82 -> 31 B).

## Checked, not changed

- `ABC-117` corrected a record: the `EBADF` exit 1 is Node's unhandled-exception status, not
  `USAGE_EXIT_CODE`. `AGENTS.md` does not carry the `EBADF` wording, and its "1 refused command line" exit-code
  line stays true. Nothing made false.
- `ABC-116` and `ABC-148` are comments in `src/cli.test.ts` (and `ABC-116`'s test-lane re-measure): no command
  changed. No `AGENTS.md` line, no receipt beyond the count above.

## Guards run

`npx vitest run src/cli.test.ts` 69 passed (holds the `ABC-109` byte cap and the `Dev / run` slot rules);
`npm run lint` exit 0.

## Owed

Headroom is 31 B, under one more lane line. The next Scribe edit of `AGENTS.md` must tighten wording or move
receipts to the command log first.
