---
id: 20261019T140200Z-qe-e2e-observation-abc171-s10-abc167-regression-f59a723d
kind: observation
by: qe-e2e
task: uat-ABC-171
at: 2026-10-19T14:02:00Z
verified_by:
confidence: high
refs:
  - ABC-171
  - ABC-167
  - ADR-0044
  - NFR-004
  - grugops/ABC-171
  - 20261019T140000Z-qe-e2e-artifact-ref-abc171-uat-pack-f340102a
  - 20261019T095400Z-qe-e2e-observation-abc167-uat-run-thirteen-scenarios-4da0ace4
  - .grugops/context/uat-ABC-167/probe/harness-RUN-1.txt
  - .grugops/context/uat-ABC-171/probe/abc167-regression-harness.ts
  - .grugops/context/uat-ABC-171/probe/abc167-regression-RUN-1.txt
  - .grugops/context/uat-ABC-171/probe/abc167-regression-vs-uat167-RUN-1.diff
supersedes:
---

# S10: ABC-167's 13 UAT scenarios on `ABC-171`'s tip. 13/13 PASS, 2876/2876, and the same output apart from `uci`

This note is hand-authored and unsealed. The command was
`node .grugops/context/uat-ABC-171/probe/abc167-regression-harness.ts <worktree>`, run at `5dee231c` on virtual
clocks only. **No wall-clock reading was taken.** Two runs were byte-identical: sha256
`a747c0c1f79bd6a8f6df76e781e83be617d3640112b163dc74305f3bed38dd88`, both.

## What was re-run

The harness is `.grugops/context/uat-ABC-167/probe/uat-harness.ts` with **three edits**, each marked `ABC-171 S10`
in the file:
1. `createUciSession` gets `ABC-171`'s two capabilities. `random` is `seededRandom(1)`. `book` is the real
   `createBookProbe` over an **empty, valid** book, which never hits and never warns (its `warn` throws, as a
   tripwire). This is the lane's own `emptyBook()` helper (`src/uci-session.test.ts:47`).
2. `uci` expects `ABC-171` `A1`'s 5 lines. `A12` says *"a row changes only where `A1` adds the two option lines"*.
3. S1's OBS line now reports the option lines instead of their absence.

Fixtures, clocks, steps, oracles and every other expectation are ABC-167's, unedited. The default level is 3, so the
3 000 ms cap of ABC-167 still applies. ABC-167's scenarios use no `setoption` that changes play, except S8's
`setoption name OwnBook value false`, which writes nothing either way.

## Result

| scenario | at `660a0d50` (ABC-167's run) | at `5dee231c` (this run) |
|---|---|---|
| S1 handshake … S13 every line | 13/13 PASS, 2876/2876 | **13/13 PASS, 2876/2876** |
| engine work | 242 searched answers, 5 726 989 nodes, 277 `go` | 242 searched answers, 5 726 989 nodes, 277 `go` |

**The two outputs differ in 9 lines each way, and in nothing else** (`/usr/bin/diff`, kept as
`probe/abc167-regression-vs-uat167-RUN-1.diff`). Both files are 2 928 lines.
- 7 lines are `uci: writes exactly [...]` (S1 once; S2's two games and S12's replay, twice each). Each now reads
  the 5-line answer.
- One line is S1's OBS line.
- One line is S13's count, `all 648 lines` → `all 666 lines`. That is 9 `uci` answers × 2 option lines = 18.

So every move, score, depth, node count and virtual `time` that ABC-167's owner-accepted UAT recorded is reproduced
exactly by `ABC-171`'s tip at the default options. That covers 100 game moves, 17 time controls, depth / nodes /
mate, infinite / ponder, held releases, 57 bad-input lines, mate, stalemate and `quit`. Between `660a0d50` and
`5dee231c`, `src/` differs only in `src/uci-session.ts` and its test file.

This complements, and does not replace, the lane's evidence. Every ABC-167 row in `src/uci-session.test.ts` is
green at the tip (1962/1962, `…be4d3860`).
