---
id: 20261011T104500Z-qe-e2e-observation-qe2-085-gaps-ply-cap-call-site-ruled-low-call-site-plumbing-unpinned-7c3d19e2
kind: observation
by: qe-e2e
at: 2026-10-11T10:45:00Z
verified_by:
confidence: high
refs:
  - ABC-085
  - QE-085-a
  - QE-085-b
  - QE-085-c
  - QE-085-d
  - QE-085-e
  - QE2-085-a
  - QE2-085-b
  - src/ladder.test.ts
  - .grugops/context/qe2-ABC-085/probe/mutants.out.txt
  - .grugops/context/fix-ABC-085/notes/20261011T120000Z-software-engineer-decision-fix085-pure-schedule-plan-summary-injected-level-factory-b2f28d91.md
supersedes:
---

# QE2 `ABC-085` gaps: QE-085-a/b/c closed. The `PLY_CAP` call-site gap is ruled LOW, not blocking. The deep row's hand-off into the pinned functions is LOW

Hand-authored and unsealed. Mutant ids are from `…qe2-085-mutants-…5e81c0a4`.

**Closed by `f28d91ad`, on QE's own plants:**
- `QE-085-a` (MEDIUM): M6, M11, M12 and M14 are killed.
- `QE-085-b` (LOW): M5, M7 and M7b are killed.
- `QE-085-c` (LOW): M13, the constant, is killed.

**Ruling: the `PLY_CAP` argument at the `runGame` call in `playLadderGame` (X13).** It does not matter for any score, and it is
**LOW, not blocking**. It is folded into `QE2-085-a` below. The reasons:
1. **Smaller than 600** (a typo, or a stale 4 from the cap row): a game that would have ended past the smaller cap becomes an `error`.
   The deep row's `A3` assertion (`errors == []`) turns red. That is loud.
2. **Larger, or Infinity:** test note 2's risk, a stuck game scored as a draw, cannot be produced. M2 pins the cap-as-error rule. An
   uncapped game ends only at a real `gameStatusOf` ending, and the claims are taken at the first offer. A score from such a game is a
   true result, not a manufactured one.
3. **What a larger cap does hide** is `A3`'s literal reading, "no game exceeding a stated ply cap". A game of more than 600 plies would
   be scored and not reported as an error. That needs a game longer than 600 plies. On all four short runs, the longest of 26 games is
   135 plies. On every run where all games end before ply 600, X13 is equivalent.
4. **A hang** needs X13 *and* an adjudication bug at once. A hang is loud, not a wrong number. The fivefold and seventy-five-move
   endings bound a legal game whatever the cap.
5. **The SE's reason for not pinning it is partly right.** A row that exercises the call-site cap in process needs a game of 600 plies.
   But a cheap close exists, with 0 extra games: one line in the deep row,
   `expect(Math.max(...played.map((g) => g.moves.length))).toBeLessThanOrEqual(PLY_CAP)`. That catches X13 exactly when it matters,
   which is a game past 600. On the correct code it can never fail, because `runGame` stops at `PLY_CAP` plies. **Optional; the SE's
   call.**

**Open gaps:**
- **`QE2-085-a`: LOW. Owner: Software Engineer, optional, before the verdict run. Routing: the Orchestrator.** The refactor pinned the
  pure functions. The deep lane's three hand-offs into them are not pinned in any lane:
  - X6: `playPair` could ignore the schedule's colours.
  - X13: the call-site `PLY_CAP` (ruled above).
  - X14: the deep row could call `summarizePair` for `weaker`.
  - Each is a one-token edit at a named call site, not subtle arithmetic. That is why this is LOW, where `QE-085-a` was MEDIUM. Each is
    also visible in the report: the GAME lines print `white`/`black`, and the PAIR line prints `"stronger"` next to its score.
  - Cheap closes, with 0 games in the default lane:
    - Inject the game player into `playPair`, the way `make` is injected into `makeSide`. Then assert with a spy that the calls follow
      `colourSchedule`.
    - Build the PAIR line from a pure `pairReport(planEntry, played)`, and pin it on synthetic records.
    - For X13, the one-line `<= PLY_CAP` assertion above.
- **`QE-085-d` (INFO) is carried as is.**
  - M9 is equivalent: the recorder and the replay share `adjudicate`.
  - M10 is killed by the deep A5 row by construction. It was not run as a mutant. This run's A5 digest `89b8059f53c970df` equals the
    three earlier runs, but that reads the unmutated code only: `UNKNOWN - verify` for M10 itself.
- **`QE-085-e` (INFO) is carried as is. Owner: the Agents-md Scribe.** "Unset is the only off" for `LADDER_DEEP`. Not re-checked this
  hop. The fix leaves `stepForMode` unchanged, and its default row still refuses `""`, `0`, `true`, `4`, `120` and `VERDICT`.

None of these fails `A3`–`A6`.
