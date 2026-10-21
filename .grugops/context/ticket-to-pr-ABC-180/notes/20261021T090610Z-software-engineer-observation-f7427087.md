---
id: 20261021T090610Z-software-engineer-observation-f7427087
kind: observation
by: software-engineer
at: 2026-10-21T09:06:10Z
verified_by: 
confidence: high
refs:
  - ABC-180
  - AR-162-FALLBACK
  - AR-095-CWD
  - ABC-162
  - ABC-095
  - grugops/ABC-180
  - acb52edf
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-180-a-decoy-book-in-a7s-neutral-cwd-reds-a-cwd-first-read-with-a-module-fallback.md
  - 20261021T082210Z-qe-e2e-observation-567002e7
  - src/book-file.ts
supersedes: 
seal: sha256:cd7abafd4da5dc91ff80827aeddb0443299b666645138c80252ff6625ce3e62b
---

# ABC-180 plant matrix: P6f green on base, red A7 on head; P6b/P6c/P6e reds hold; PD reds at the does-not-parse assertion

Scratch copies outside the repository (session scratchpad `…/abc180/`): `git archive` of the tip with the base test (sha256 `3a2b2cb3…`) and with the head test (`5e590b23…`); only `src/book-file.ts` was replaced. One run per cell, `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run --reporter=verbose src/cli.real-engine.test.ts`, with a private `TMPDIR` per run, run one at a time.

| plant | book-file.ts sha256 | base test | head test |
|---|---|---|---|
| none | `890784c9…` | 11/11 green | 11/11 green |
| **P6f** (try cwd, catch → module URL) | `0b016daf…` | **11/11 green** | **10/11, red A7** |
| P6b (`readFileSync("data/opening-book/book.json")`) | `c9272c0c…` | 10/11, red A7 | 10/11, red A7 |
| P6c (`resolve(process.cwd(), …)`) | `91e6e85a…` | 10/11, red A7 | 10/11, red A7 |
| P6e (walk up from cwd) | `c04934e3…` | 10/11, red A7 | 10/11, red A7 |

- Every head red is `A7` at the labelled stderr assertion (`src/cli.real-engine.test.ts:534`): `AssertionError: AR-095-CWD / AR-162-FALLBACK detector: stderr must be empty, or the book was read from the working directory: expected 'opening book is not valid UTF-8 JSON;…' to be ''`. Received stderr: `opening book is not valid UTF-8 JSON; playing on without it`. The P6f head log contains `AR-162-FALLBACK` 3 times.
- Base reds (P6b/P6c/P6e) are at `:510` with `opening book could not be read; playi…` (no decoy at base).
- **PD** (head test with the decoy write replaced by `copyFileSync(join(REPOSITORY, BOOK_PATH), join(neutral, BOOK_PATH))`, test sha256 `6862e26d…`, delivered book-file.ts): 10/11, red `A7` at `:497`, `the decoy parses as UTF-8 JSON: expected [Function] to throw an error`.
- **A3:** lane-made entries left under the private `TMPDIR` after every run above (green, P6f at head, all others): **0**. The only entry was `node-compile-cache`, Node's own compile cache, not made by the lane.
- Head children: 6 `[CLI_DEEP] (cwd …)` lines at base and at head. `A7`'s names `$TMPDIR/abc162-neutral-cwd-…`, not the tree root.
