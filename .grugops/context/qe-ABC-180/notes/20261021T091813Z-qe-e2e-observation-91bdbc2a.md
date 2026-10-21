---
id: 20261021T091813Z-qe-e2e-observation-91bdbc2a
kind: observation
by: qe-e2e
at: 2026-10-21T09:18:13Z
verified_by: 
confidence: high
refs:
  - ABC-180
  - AR-162-FALLBACK
  - AR-095-CWD
  - grugops/ABC-180
  - acb52edf
  - d9c3cca3
  - ccccc6bb
  - e68962d6
  - grugops/qe-ABC-180
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-180-a-decoy-book-in-a7s-neutral-cwd-reds-a-cwd-first-read-with-a-module-fallback.md
  - src/book-file.ts
  - src/book.ts
  - 20261021T082210Z-qe-e2e-observation-567002e7
  - ADR-0036
supersedes: 
seal: sha256:04083fb2fc2878e65a7eef2ef398f6d6efb92fe85dd0ec81e17da1da3533485a
---

# `ABC-180` plant matrix: P6f green → red at the labelled stderr check (the `AR-162-FALLBACK` close condition holds); P6b/c/e reds hold; PD reds at the parse check; three new survivors

**Method.**
- **Scratch copies outside the repo** (session scratchpad `…/qe180/`): `git archive acb52edf` of `src data tools package.json vitest.config.ts tsconfig.json biome.json`, plus a `node_modules` symlink.
- **Test files:** the base test is `ccccc6bb`'s (sha `3a2b2cb3…`) and the head test is `acb52edf`'s (`5e590b23…`).
- **Only `src/book-file.ts` is replaced,** except in the test plants PD, TMO and VD.
- **One cell at a time,** each in a fresh copy with its own new `TMPDIR`. The command is `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts --reporter=verbose`.

| plant | `readBookFile` body (sha256) | base test | head test |
|---|---|---|---|
| none | delivered (`890784c9…`) | 11/11 green | 11/11 green |
| **P6f** | try `readFileSync("data/opening-book/book.json")`, catch → module URL (`0b016daf…`) | **11/11 green** | **10/11, red A7 `:534`** |
| P6b | `readFileSync("data/opening-book/book.json")` (`c9272c0c…`) | 10/11, red A7 `:510` | 10/11, red A7 `:534` |
| P6c | `resolve(process.cwd(), …)` (`91e6e85a…`) | 10/11, red A7 `:510` | 10/11, red A7 `:534` |
| P6e | walk up from cwd to the first `data/opening-book/book.json`, else throw (`977a70fe…`) | 10/11, red A7 `:510` | 10/11, red A7 `:534` |
| **P6g (new)** | try the cwd read, **use it only if it parses as UTF-8 JSON**, else module URL silently (`c9a6f506…`) | 11/11 green | **11/11 green: SURVIVES** |
| P6i (new) | try `readFileSync("opening-book.json")` (another cwd path), catch → module URL (`74de5e1a…`) | — | **11/11 green: SURVIVES** |

- **Every head red** is A7 at `:534`, with `AR-095-CWD / AR-162-FALLBACK detector: … expected 'opening book is not valid UTF-8 JSON;…' to be ''`.
- **Every base red** is at `:510`, with `opening book could not be read; playi…`.
- **PD** (head test; the decoy bytes are `readFileSync(join(REPOSITORY, BOOK_PATH))`; delivered build): **10/11, red A7 at `:497`**, which is the does-not-parse assertion, not a silent pass.
- **The decoy is not a valid book:** `ABC-180 decoy: not an opening book\n` is valid UTF-8 and not JSON. `parseBook` refuses it, and the head reds above carry exactly that refusal.
- **TMO (test mutation, with P6f):** the `mkdirSync` and `writeFileSync` of the decoy are moved after the `booked` spawn, test sha `49dd6aa6…`. Result: **11/11 green, SURVIVES**. A7's presence check runs after the child has exited, so nothing pins that the decoy existed while the child ran.
- **VD (scratch probe, not a proposed diff).** The decoy is a valid format-1 book whose only entry, for the position after 1. e4 (key `3c9a1e3dcc88de6c`), is `b7b5`; the parse assertion is removed. Test sha `2b4d4aa2…`.
  - Results: clean **11/11**; P6f, P6g and P6b each **10/11, red A7 at `:523`** (the membership check), `expected [ 'a7a5', … ] to include 'b7b5'`.
  - The delivered book holds **19 of the 20** legal replies to 1. e4; `b7b5` is the only one missing.
  - So membership does not tell a *search* reply from a book reply (G-2 of `ABC-162`), but it does catch a reply that came from a *decoy book*. The page's "a different book … the kill would rest on book membership, which does not discriminate" holds only for decoys whose reply is one of those 19.
- **A3:** 0 lane-made entries left after every one of the 19 cells.
