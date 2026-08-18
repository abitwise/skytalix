---
id: 20260818T160000Z-ba-pm-observation-what-i-measured-at-main-head-before-re-scoring-3f1c8a02
kind: observation
by: ba-pm
at: 2026-08-18T16:00:00Z
verified_by: 
confidence: high
refs:
  - ABC-033
  - ABC-034
  - ABC-078
  - ABC-079
  - src/coordinate-move.ts
  - src/san.ts
  - src/search.ts
  - src/turn-loop.ts
  - src/frame.ts
  - src/legal.ts
  - plans/board.md
supersedes: 
---

What I READ in the tree at `main` HEAD `7ea9e1b` before re-scoring anything. Every line below is a
read of a file or of `git log`. **I ran no test suite and no gate at this hop and I claim no gate
result.** The gate figures quoted in my task brief (lint 62 · typecheck 0 · build 0 · 999/999 on 35
files · skip 0 · `No findings.`) are the Orchestrator's; I did not re-run them and I do not restate
them as mine.

**The four dependency merges, in `git log main` and in the board's `Done` column:**

- `ABC-031` merged 2026-08-17 — board line 226.
- `ABC-076` merged 2026-08-17 — board line 227.
- `ABC-032` merged 2026-08-18 — board line 223, merge commit `707e258`.
- `ABC-077` merged 2026-08-18 — board line 224, merge commit `1bc159a`.

**The exports the four backlog tickets consume, present at HEAD:**

- `parseCoordinateMove` `src/coordinate-move.ts:77`; `CoordinateParseResult` `:51`;
  `CoordinateRejectReason` `:44`.
- `parseSan` `src/san.ts:223`; `SanParseResult` `:190`; `SanRejectReason` `:183` with exactly two
  arms, `unreadable` and `no-such-move`; `toSan` `:146`.
- `search(position, depth)` `src/search.ts:167`; `searchWithoutPruning` `:178`; `SearchResult` `:42`;
  `MATE_SCORE` `:40`.
- `EngineSeam` `src/turn-loop.ts:138` — unchanged, as `ABC-078` `A6` requires.

**Citation drift found and corrected on the two `EPIC-003` pages.** `PromptOutcome` is at
`src/turn-loop.ts:125-132` at HEAD, not `:118-124`; its `rejected` arm is at `:127`, not `:120`.
`ABC-033` cited `:118` / `:118-124` and `ABC-034` cited `:120`; both are corrected on the pages.
This is a stale cite, not a shape change — the arm set is unchanged.

**Citations re-checked and still exact, so left alone:** `MESSAGE_ROWS` `src/frame.ts:45`; the
message-region packer `src/frame.ts:182-188`; the `sanitize` sink `src/frame.ts:202`;
`assembleFrame` `src/frame.ts:194`; `legalMoves` `src/legal.ts:42`; `isInCheck` `src/legal.ts:32`.

**`ABC-074` is in the board's `Blocked` column** (line 292) with its reason stated: no non-M3
machine. That is the fact `ABC-078`'s item-10 re-score rests on.

**`e8=K` at HEAD, read directly** because `ABC-034` `A8` and `ABC-106` both depend on it:
`src/san.parse.test.ts:421` is titled *"codes an IMPOSSIBLE promotion `e8=K` as `no-such-move`, not
`unreadable`"* and asserts `reason: "no-such-move"`; `e8=P` asserts `unreadable`. That matches the
parenthetical measurement `ABC-034` `A8` already carries.

**Queue note.** The task file `.grugops/queue/pending/refinement-p0-chain-2026-08-18.md` **did not
exist** — `pending/` held only `.gitkeep`. Nothing was moved out of `pending/`. The claim directory
was taken by hand per Workflow 17 (bare `mkdir`, no `EEXIST`) and the `.claim.md` record was written
into it.
