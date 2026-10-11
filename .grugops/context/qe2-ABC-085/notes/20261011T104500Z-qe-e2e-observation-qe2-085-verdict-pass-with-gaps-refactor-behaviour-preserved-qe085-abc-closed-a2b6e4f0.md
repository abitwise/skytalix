---
id: 20261011T104500Z-qe-e2e-observation-qe2-085-verdict-pass-with-gaps-refactor-behaviour-preserved-qe085-abc-closed-a2b6e4f0
kind: observation
by: qe-e2e
at: 2026-10-11T10:45:00Z
verified_by:
confidence: high
refs:
  - ABC-085
  - ADR-0038
  - N8-LANE
  - NFR-008
  - QE-085-a
  - QE-085-b
  - QE-085-c
  - src/ladder.test.ts
  - sha dacbf42a (fix f28d91ad)
  - branch grugops/ABC-085-self-play-ladder
supersedes:
---

# QE2 `ABC-085`: PASS_WITH_GAPS. The refactor preserved behaviour (5/5 digests and 32/32 lines equal to all three earlier runs); QE-085-a/b/c closed; LOW and INFO gaps remain

Hand-authored and unsealed: no context-io writer or §14 stamp is used on this install, so this is not a `finding`. Every reading is QE's
own, from QE's own worktree at `dacbf42a`. **Loaded host, no timing grades.** Every deep-lane number is **short mode, step 120**. It is
never `A1` or `A2`.

- **The refactor did not change behaviour.** One `LADDER_DEEP=1` run gave exit 0, 18/18, and every PAIR line carries `commit` =
  `dacbf42a…`, clean. All 32 report lines are equal to **each** of the three earlier runs (SE run 1, SE run 2 `d5b0f0e2`, QE run
  `773b48cc`), with wall, load1 and commit excluded. The pair digests:

  | pair | digest |
  |---|---|
  | 3v4 | `72f01570a3987247` |
  | 4v5 | `302d8b4676cd7299` |
  | 2v3 | `f89bbd75f4a066e9` |
  | 1v2 | `89b8059f53c970df` |
  | 1v5 | `d30b4a153b7c1a9a` |

  The A5 in-process digest is `89b8059f53c970df`. That makes four equal runs across sessions.
- **`A3` MET (short mode).** 26/26 games ended, 0 at the cap, and the longest was 135 plies against 600. The endings were 18 checkmate,
  7 `threefold-repetition (claimed)` and 1 insufficient-material. **`A4` MET:** 26/26 replays were clean, asserted per pair. **`A5` MET:**
  as above, with M3, M8 and M15 still killed and M5 now killed. **`A6` MET (harness):** all lines are labelled "short mode, step 120".
  The claimed counts per pair are 2, 3, 0, 2 and 0, equal to the earlier runs. The counts and plan are now pinned (M7, M7b).
- **The pure functions are the ones the deep lane uses.** `playPair` maps `colourSchedule`, the plan is `ladderPlan(verdict)`, and the
  PAIR line prints `summarizePair`. The four default rows pin those functions on synthetic records. The hand-offs into them are not
  pinned: `QE2-085-a`, LOW.
- **Mutants:** all 16 were re-planted by QE (`…5e81c0a4`). 14 are killed, and M7b is killed too. All 8 of the SE's named survivors are
  killed. M9 and M10 survive as INFO, as before. There are 3 new call-site plants (X6, X13, X14), and they survive.
- **Default lane: 0 ladder games, by count.** `npm test` with `LADDER_DEEP` unset gives exit 0, 54 files / 1693 tests passed, 0 failed,
  0 pending and 0 todo. `.test-results/last-run.json` reads `success: true`. The ladder file has 13 rows, all passed, and the last is
  "the default lane played 0 ladder games". M4 still turns it red.
- **Gates:** lint, typecheck and build exit 0. Skip integrity reads `No findings.`, and the lane inventory is 54 = 54.
  `git diff --name-only aee4b8cb dacbf42a -- src` gives `src/ladder.test.ts` only, so there are 0 production lines.
- **The `PLY_CAP` call-site gap is ruled LOW, not blocking.** See the gaps note `…7c3d19e2`.
- **`A1` / `A2`:** out of scope. They wait for `LADDER_DEEP=verdict`, which was not run.
- **Coverage vs threshold:** lean mode, so the threshold is not enforced. Tests added by QE: 0. **Regression risk:** low. **Flaky
  risk:** the default rows are pure, and the deep rows are deterministic (the fourth equal run).
- **Gaps:** `QE2-085-a` LOW (SE, optional), `QE-085-d` INFO and `QE-085-e` INFO (the Scribe). None fails `A3`–`A6`.
