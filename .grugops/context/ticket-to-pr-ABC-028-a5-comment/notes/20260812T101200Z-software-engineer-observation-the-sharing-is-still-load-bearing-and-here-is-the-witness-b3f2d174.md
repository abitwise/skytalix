---
id: 20260812T101200Z-software-engineer-observation-the-sharing-is-still-load-bearing-and-here-is-the-witness-b3f2d174
kind: observation
by: software-engineer
at: 2026-08-12T10:12:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A2
  - ABC-028-A5
  - RISK-ABC017-01
  - RISK-ABC028-02
  - RISK-ABC028-03
  - src/history-pane.nfr.test.ts
  - src/history-pane.test.ts
supersedes:
---

# The sharing here is STILL load-bearing — measured, with a live witness one step past `A5`'s deepest row

Every number written into the repaired comment was **run on this tip**, out of tree, and then **re-run
against the edited file** so the comment describes the tree as it actually stands. Nothing was
transcribed, including the figure the Orchestrator's brief offered me.

## The instrument

One generator parameterised on the axis itself: **`TAIL` = how many trailing move IDENTITIES join
`moves.length` in the cache key.** `WCACHE-LEN`, `WCACHE-LAST`, `WCACHE-LAST2` and `WCACHE-LAST3` are
therefore the **same code at 0, 1, 2 and 3** and cannot differ by a transcription slip. It pins this
tip's pane `c4653c4c…` and the nfr file's digest and **throws rather than measuring the wrong tree** —
which is the failure mode the inherited `make-cachelast.mjs` demonstrated when it hard-threw on this
tip. The replica is a full copy of `src/` with this worktree's own `node_modules` symlinked; **no other
worktree was reached into.**

## The kill matrix — every cell run

```
build          full suite (26 files)          (a) history-pane.test.ts ALONE   (b) nfr fixtures per test
WCACHE-LEN     5 failed / 752  (A11x2+A1+A5x2) 3 failed / 26  (A1 + A5 x2)     3 failed / 752
WCACHE-LAST    4 failed / 752  (A11x2 + A5x2)  2 failed / 26  (A5 rows 1, 2)   2 failed / 752
WCACHE-LAST2   3 failed / 752  (A11x2 + A5r2)  1 failed / 26  (A5 row 2)       1 failed / 752
WCACHE-LAST3   2 failed / 752  (A11 x2 ONLY)   26 PASSED — nothing            752 PASSED — nothing
```

**A monotone ladder, and the bottom rung is the point.** `WCACHE-LAST3` — one step past `A5`'s deepest
row — is caught by **exactly two assertions in the whole project**, and both are the `A11` `toSan`
call-count assertions in `src/history-pane.nfr.test.ts`:

- *"calls `toSan` exactly once per RENDERED ply, and never more than 2 x `HISTORY_ROWS`"*
- *"hands `toSan` no legal move list — the optional parameter is a contract, not a tuning dial"*

**Rebuild those fixtures per test and the whole suite goes `752/752` GREEN on that build.** The only
guard the project has for it is gone. That is `RISK-ABC017-01`'s original hazard, alive, narrowed by
exactly the three keys `A1` and `A5` now own.

## Calibration and controls, so this reports rather than merely agrees

- **The ladder itself is the calibration.** On the same harness, in the same lane, `TAIL` 0/1/2 die in
  `src/history-pane.test.ts` (3, 2 and 1 kills) and `TAIL` 3 does not. An instrument that could not see
  a cache at all would show 26 passed at every rung; an instrument that saw everything would show a
  kill at every rung. It shows neither.
- **Null control 1:** the delivered pane **with** the fixtures rebuilt per test — `752/752`. The
  transformation itself breaks nothing, so a green in configuration (b) is the build's, not the
  transform's.
- **Null control 2:** the untouched replica — `752/752`, byte-matching the worktree's own run.
- **Re-run after the edit.** All three `TAIL=3` cells and the `TAIL=2` calibration were re-measured
  against the **edited** `src/history-pane.nfr.test.ts` (`1d33bea6…`). Identical. The comment's numbers
  are true of the file the comment lives in.

## What this does and does not close

**It does not close the class and does not claim to.** `A5`'s own text says the axis is infinite, and
this measurement is the first live confirmation that the *next* rung is real rather than theoretical.
`RISK-ABC028-03` predicted `WCACHE-LAST2` would survive `A5` and the `A5` hop measured that a **row**
closed it; this hop measures that the rung **after** that one is still open and is still held up only
by an accident in another file. **The restated bound in `RISK-ABC028-02` is exactly right and is now
demonstrated at a fourth build rather than argued: bounded for every class with an owned guard in
`src/history-pane.test.ts`, unbounded for every class without one.**

**No row was added to `A5`'s table to close `WCACHE-LAST3`.** That would be a test-half change, and
this subtask is comment text only — the fence says so and I did not cross it. It is one row of data
whenever a hop is licensed to write it, which is the design property `A5` was built for.
