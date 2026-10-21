---
id: 20261021T105252Z-software-engineer-observation-d1eb80ac
kind: observation
by: software-engineer
at: 2026-10-21T10:52:52Z
verified_by: 
confidence: high (each cell measured in scratch, whole default lane)
refs:
  - ABC-161
  - QE-101-a
  - QE-101-b
  - SEC-101-a
  - grugops/ABC-161
  - 35788fd4
  - ee1818bb
  - src/cli.test.ts
  - plans/tickets/ABC-161-three-cli-test-rows-a-wrong-difficulty-build-passes.md
  - 20261021T104240Z-ba-pm-decision-b0020834
  - 20261021T103740Z-ba-pm-observation-8425f6db
supersedes: 
seal: sha256:e501ef12209c444643d83061f583e4b275152631b6e046569839e230f145ddb7
---

# ABC-161 plant readings: base 35788fd4 vs head ee1818bb, whole default lane, 11 plants; A1, A2, A3 met

**Method.** Per run: `git archive <rev>` into a fresh copy in the session scratchpad (outside the repository), `node_modules` symlinked, private `TMPDIR`, one exact-string plant asserted to occur once (`AGENTS.md` plants included), then `NODE_OPTIONS=--max-old-space-size=128 node tools/grugops/run-bounded.js 180000 ./node_modules/.bin/vitest run --reporter=json`. One run at a time, copy deleted after each. No timing taken. Plant strings are the page's `## Acceptance` table verbatim. Afterwards `git status --porcelain` is empty in the main checkout and the worktree, and no scratch copy remains.

| plant | base `35788fd4` (59 files) | head `ee1818bb` (59 files) |
|---|---|---|
| none | 1987/1987, 0 skipped | 1987/1987, 0 skipped |
| P11 | 1 failed: `A8′` equivalence, "level 4, call 1" | 1 failed: `A8′` equivalence, "level 1, call 2" |
| P11-L1 | 1987/1987 green | 1 failed: `A8′` equivalence, "level 1, call 2" |
| P11-L2 | 1987/1987 green | 1 failed: `A8′` equivalence, "level 2, call 2" |
| P11-L3 | 1987/1987 green | 1 failed: `A8′` equivalence, "level 3, call 2" |
| P11-L4 | 1 failed: `A8′` equivalence, "level 4, call 1" | 1 failed: `A8′` equivalence, "level 4, call 1" |
| S2c | 1987/1987 green | 1 failed: `ABC-101` `A3`, `--difficulty "3\n"` resolved `ok: true` |
| P9a | 1987/1987 green | 1 failed: `ABC-065` `A3`, "documented values of --difficulty" `[1,2,3,4]` vs `[1..5]` |
| P9b | 1987/1987 green | 1 failed: `ABC-065` `A3`, `[1,2,3,4,9]` |
| P9c | 1987/1987 green | 1 failed: `ABC-065` `A3`, `[1,3,4,5]` |
| P9d | 1987/1987 green | 1 failed: `ABC-065` `A3`, `[1,2,3,5]` |
| P9e | 1987/1987 green | 1 failed: `ABC-065` `A3`, "documented values of --colour" `[random, white]` |

- **A1 MET.** P11-L1..L3 green → red, 3 of 3, each at `A8′`'s equivalence row, message naming the plant's level. P11 and P11-L4 red on both, same row (P11 on head reds first at level 1, since the row walks levels in order). Delivered seam green on head; non-vacuity block kept and green.
- **A2 MET.** S2c green → red. On the delivered build the `A3` row's `"3\n"` case asserts `{ ok: false, offending: ["3\n"] }` and is green.
- **A3 MET.** P9a-P9e green → red, 5 of 5, each at `ABC-065` `A3`. Real `AGENTS.md` green on head.
- Base column equals BA/PM's `…observation-8425f6db` on every plant.
