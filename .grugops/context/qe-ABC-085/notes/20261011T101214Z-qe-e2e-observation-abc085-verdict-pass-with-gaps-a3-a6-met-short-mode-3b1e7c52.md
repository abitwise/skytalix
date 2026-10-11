---
id: 20261011T101214Z-qe-e2e-observation-abc085-verdict-pass-with-gaps-a3-a6-met-short-mode-3b1e7c52
kind: observation
by: qe-e2e
at: 2026-10-11T10:12:14Z
verified_by:
confidence: high
refs:
  - ABC-085
  - ADR-0038
  - N8-LANE
  - NFR-008
  - src/ladder.test.ts
  - sha 773b48cc (reviewed tip; harness d5b0f0e2, src identical)
  - branch grugops/ABC-085-self-play-ladder
supersedes:
---

# QE `ABC-085`: PASS_WITH_GAPS. A3–A6 MET on QE's own readings (short mode, step 120, and default rows); A1/A2 out of scope

Hand-authored and unsealed (no context-io writer or §14 stamp on this install, so no `finding`). I read the contract from the ticket page
before the SE notes. Every reading below is from QE's own run on QE's own worktree. Raw files are in `../probe/`. **Loaded host, no timing
grades.** Every number from the deep lane is **short mode, step 120**, and is never `A1` or `A2`.

- **A3 — MET (short mode, step 120; default rows).** 26 of 26 ladder games reached a `gameStatusOf` ending. 0 hit the cap (`PLY_CAP` 600 is
  stated; the max was 135 plies). 0 crashes and 0 timeouts: the row timeout is 0, and the run exited 0 with 14/14. The endings were 18 checkmate,
  7 `threefold-repetition (claimed)` and 1 insufficient-material. There were 0 `fivefold-repetition` and 0 `seventy-five-move`. In the
  default rows, a scripted threefold ends at ply 8 as `(claimed)`, where unclaimed it is fivefold at 16. A fifty-move claim is taken on the
  first ply from halfmove 99. A capped game is `error` / `ply-cap` and `scoreFor` throws on it. All three are killed by mutants M1, M2 and M16.
- **A4 — MET (short mode).** In the same run, 26 of 26 move lists replay through `legalMoves` / `playMove` with 0 faults (asserted per pair).
  The replay oracle is shown to refuse an illegal move and a move played past an ending (default row; M1 turns it red too).
- **A5 — MET (short mode; default rows).**
  - In process, the A5 row plays 1v2 twice with equal move lists and score. Its digest is `89b8059f53c970df`.
  - **Across sessions:** QE's run at `773b48cc` equals the SE's run 2 at `d5b0f0e2` on all 32 report lines (wall, load1 and commit
    excluded). All 5 pair digests are equal: `72f01570a3987247`, `302d8b4676cd7299`, `f89bbd75f4a066e9`, `89b8059f53c970df`,
    `d30b4a153b7c1a9a`. With the SE's two runs, that is three equal runs on a loaded host at different loads.
  - The step rows: the constants are literally 120 / 4 (M15 is killed). A per-side step is refused (M3 killed), and so is an un-named or
    derived step (30, 10, 119.99999, 4.000001). Each side gets its own clock instance (M8, a shared clock, is killed).
  - **Not pinned:** budgets verbatim (M5 survives every lane). See the gaps note.
- **A6 — MET (harness; the verdict wall waits with the verdict run).**
  - All 32 report lines carry `"mode":"short mode, step 120"`. Every PAIR line names the step, game count, seeds, commit (`773b48cc`, clean),
    W-D-L, the claimed-draw count and `"verdict":"not graded (short mode)"`, with the criterion as "never A1/A2".
  - Each claimed-draw count equals the count of `(claimed)` reasons in that pair's GAME lines (2, 3, 0, 2, 0).
  - The short-mode counts are constants (10 / 4) and are stated on every line.
  - **Not pinned:** the count arithmetic (M12) and the game-count constants (M7, M7b). See the gaps note.
- **Default lane: 0 ladder games, by count.** In `npm test`, 54 files and 1689 passed, 0 skipped, 0 todo. The ladder file has 9 rows,
  all passing, including the pin "the default lane played 0 ladder games". Re-planted M4 (one real game in a default row) turns the pin red.
  Unset, the deep rows are not defined: 9, not 15, and skip 0.
- **Colour alternation (A1's "50 as white"), read from the log only:** every seed is played stronger-white, then stronger-black, on all
  26 games. Correct today, but unpinned (M6). See the gaps note.
- **A1 / A2:** out of scope, not taken. Short-mode signals (3v4 2.5/4, 4v5 2.5/4, 1v5 10/10) are early signals only and never A1 or A2.
- **Coverage vs threshold:** lean mode, and the threshold is not enforced. Tests added by QE: 0. QE did not edit the harness: the gaps are
  routed to the SE as harness changes. **Regression risk:** low. 0 production `src/` lines (`git diff --name-only aee4b8cb 773b48cc -- src`
  gives `src/ladder.test.ts` only). **Flaky risk:** the deep rows have no wall timeout and assert only A3/A4, which are deterministic. The
  default rows are pure.
- **Gaps:** QE-085-a MEDIUM, QE-085-b LOW, QE-085-c LOW, QE-085-d INFO, QE-085-e INFO. They are in `…gaps-…`. None fails A3–A6.
