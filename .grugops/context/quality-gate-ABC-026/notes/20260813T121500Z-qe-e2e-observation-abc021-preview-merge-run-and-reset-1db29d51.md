---
id: 20260813T121500Z-qe-e2e-observation-abc021-preview-merge-run-and-reset-1db29d51
kind: observation
by: qe-e2e
at: 2026-08-13T12:15:00Z
verified_by:
confidence: high
refs:
  - ABC-026
  - ABC-021
  - quality-gate-ABC-026
  - NFR-008
  - N8-LANE
  - vitest.config.ts
  - 21f5a12
supersedes:
---

# `ABC-021` × `pool: "threads"`: **I RAN IT. 814/814 green under threads, forks, one worker and shuffle — 12 of 12.** Then I reset the branch, and the reset is verified.

An `observation`. The brief authorised a throwaway preview merge and required me to state plainly
whether I ran it. **I ran it.**

## What was merged, and what it actually contains

```
git merge --no-edit grugops/ticket-to-pr-ABC-021     -> clean, NO conflicts
tip 4601f14

src/turn-loop.test.ts    +206 / -0     the tests that had never executed under threads
src/turn-loop.ts          +89 / -10    <- production code; ABC-021 is NOT a docs hop
plans/traceability.md      +3 / -1
7 context notes + 2 queue records
```

**`ABC-021` adds NO new test FILE.** Its +206 lines land in the **existing** `src/turn-loop.test.ts`,
so the merged tree is still **28 test files** and goes from 807 to **814 tests**. That is the number
the brief carried and it is confirmed.

## The result

```
                    exit  files  tests  failed
threads-default (delivered config)   0    28    814     0    green   x3
forks (control)                      0    28    814     0    green   x3
1 worker (maxThreads=minThreads=1)   0    28    814     0    green   x3
--sequence.shuffle                   0    28    814     0    green   x3
                                                      ------
                                                      12 of 12 green
```

**`ABC-021`'s new `turn-loop` tests execute correctly under `pool: "threads"`.** The integration risk
the brief named is measured rather than assumed. Twelve runs bounds the failure rate at roughly 25% by
the rule of three — **thin, and I say so** — but it is twelve more than existed, and `turn-loop.ts`
touches no process global, so there is no mechanism here for threads to break.

## **The headroom consequence, which is the part planning needs**

Lane cost on the merged tree, `PERFT_DEEP` deleted from the child environment, n = 5, threads:

```
wall   3.500  3.230  1.770  1.680  1.620   median 1.770 s
CPU   10.140 10.000  9.910  9.870 10.030   median 10.030 s
1-min load average during: 28.16 - 29.65 on 8 cores
```

**Two individual runs BREACHED the 3 s wall clause (3.500 s, 3.230 s) while CPU moved 2.7% end to
end.** The median wall is MET and the clause binds the median, so nothing is breached — but this is
the sharpest demonstration on this board of why **the CPU clause is the instrument and the wall clock
is the noise**: at load 29, wall swung **116%** and CPU swung **2.7%** on the same tree. **That
independently re-derives `ADR-0008` Decision 3 from a third route** — the prior hop got there from a
null control, the 2026-08-12 audit got there by argument, and this got there by watching a heavily
contended machine.

**`ABC-021` does NOT spend file headroom.** It adds tests to an existing file, and `A2`'s restatement
rule fires on added **files**, not added tests. `A2` says to subtract 160 ms CPU per added file — **the
correct restatement for `ABC-021` merging is: subtract nothing, and do not re-measure.** The merged
lane at ~10.03 s CPU sits inside the same band as the unmerged one, which is the arithmetic behaving
as `A2` predicts: **expensive per FILE, nearly free per TEST.**

## The reset, verified rather than asserted

```
git reset --hard 21f5a12
HEAD                                 21f5a12   (== the branch point, as required)
branch                               grugops/quality-gate-ABC-026
git log -1                           perft(lane): the ABC-026 commit, no merge commit
src/turn-loop.test.ts                1582 lines (ABC-021's +206 gone)
git diff --numstat 06c5427 HEAD -- src/   EMPTY
npm test                             28 files, 807 tests, 0 failed
```

**My branch ships only my own work. Nothing was merged to `main`, nothing was pushed, nothing was
deployed, and `main` was never checked out from this worktree.** `ABC-021`'s files were not edited — a
preview merge that is reset is not an edit, and its gate is another agent's concurrently on its own
branch. **Humans hold merge and deploy.**
