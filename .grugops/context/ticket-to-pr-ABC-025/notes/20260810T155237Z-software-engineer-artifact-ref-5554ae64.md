---
id: 20260810T155237Z-software-engineer-artifact-ref-5554ae64
kind: artifact-ref
by: software-engineer
at: 2026-08-10T15:52:37Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - EPIC-002
  - RISK-ABC013-04
  - src/san.qualifier.hardening.test.ts
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-025-san-qualifier-minimality-net.md
  - plans/tickets/history/ABC-025-board-history.md
supersedes: 
---

# Artifacts of `ticket-to-pr-ABC-025-dev` — branch, files, tests, commands

## Branch and diff

Branch `grugops/ticket-to-pr-ABC-025`. Nothing pushed (this repository has no git remote), nothing
merged, nothing deployed.

```
src/san.qualifier.hardening.test.ts     NEW    +655 / −0    20 tests    the whole `src/` delta
plans/board.md                          EDIT   ABC-025 In Development → In Review, header replaced
plans/tickets/history/ABC-025-board-history.md  EDIT  hop 2 header archived VERBATIM before replacement
plans/tickets/ABC-025-…-net.md          EDIT   front matter status/column → in-review / In Review
plans/traceability.md                   EDIT   ABC-025 row, cells `Code (PR/files)` / `Tests` / `Status`
.grugops/queue/claimed/ticket-to-pr-ABC-025-dev/   claim record + subtask file
.grugops/context/ticket-to-pr-ABC-025/notes/       these notes
```

No file under `src/` other than the new `*.test.ts` is touched, and no pre-existing test file is
touched at all.

## The test file, by criterion

`src/san.qualifier.hardening.test.ts` — 5 `describe`s, 20 `it`s:

- **`A1`** (1 test) the minimality property as a ladder search over `["", file, rank, square]`, both
  call forms, 207 positions / 5,524 qualifiable moves, qualifier read back out of the emitted string.
- **`A2`** (4 tests) the census: 44 of 44 reachable cells filled; the four `ROOK … square` cells
  exactly zero; the derived corpus alone ≤ 9 of 44; each of the 16 ladder positions load-bearing.
- **`A3`** (12 tests) the 63 hand-typed strings, grouped by piece type × colour and by black-side
  corner; every move taken from `legalMoves` by `(from, to, promotion)` and asserted to name exactly
  one legal move before any string is read.
- **`A4`** (1 test) injectivity over all 207 corpus positions with one shared legal list.
- **`A5`** (2 tests) purity + `legal`-argument equivalence over every legal move of the 23 positions
  in both call forms; and the setup assertion that there are 23 positions and each round-trips
  through `toFen` byte-identically.

## Commands run, and their results

```
npm test                                        672 passed / 672 on 21 files
npx vitest run --reporter=json | jq …           skip count 0
npm run lint                                    exit 0  (after `npx biome check --write` on the new file only)
npm run typecheck                               exit 0
npm run build                                   exit 0
PERFT_DEEP=1 npx vitest run src/perft.test.ts   32 passed / 32 in 37.93 s
md5 -q src/san.ts                               cbcc3be37c21414d16e8e6b4d0c68959
git diff -U0 main -- src/                       (empty)
```

## Out-of-tree instruments — none of them in the repository

- The 13-mutant harness: a copy of `src/` outside the repository with `node_modules` symlinked, one
  fresh OS process per tree state, `tsc --noEmit` per mutant, anchors asserted unique and bytes
  asserted changed, pristine restore and re-hash after each. Its results are in the `observation`
  note beside this one.
- `chess.js@1.4.0`, `npm install`ed in a scratchpad outside the repository. `package.json` and
  `package-lock.json` md5-checked before and after and byte-identical to `main`; no dependency added.

## What is still owed on this ticket

The `In Review` exit is **QE/E2E's** and was not taken. The Security/NFR hop has a live trigger:
`N5` is breached and its numbers are in the `observation` note. `RISK-ABC013-04` is not closed by
this hop — it closes when this ticket is gated and merged.
