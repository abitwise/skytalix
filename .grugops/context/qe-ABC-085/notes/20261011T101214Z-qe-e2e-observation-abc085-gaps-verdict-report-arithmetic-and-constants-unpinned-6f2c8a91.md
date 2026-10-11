---
id: 20261011T101214Z-qe-e2e-observation-abc085-gaps-verdict-report-arithmetic-and-constants-unpinned-6f2c8a91
kind: observation
by: qe-e2e
at: 2026-10-11T10:12:14Z
verified_by:
confidence: high
refs:
  - ABC-085
  - ADR-0038
  - src/ladder.test.ts
  - .grugops/context/qe-ABC-085/probe/mutants.out.txt
  - .grugops/context/ticket-to-pr-ABC-085/notes/20261011T093952Z-software-engineer-artifact-ref-abc085-branch-d5b0f0e2-ladder-test-ts-agents-md-line-draft-8515e3e7.md
supersedes:
---

# QE `ABC-085` gaps: the verdict report's arithmetic is unpinned in every lane; three named constants are unpinned. None fails A3–A6

Hand-authored and unsealed. Mutant ids are from `…mutants-…d4a90f16`.

- **QE-085-a — MEDIUM. Owner: Software Engineer. Routing: the Orchestrator, to fold into the verdict-run work (or into the split `XS`
  ticket, if the § Dependencies split trigger fires).**
  - The deep row computes and prints the pair's score, the A1/A2 MET/RED and the claimed-draw count. It also decides the colour schedule.
    Four of those mutants survive every lane: colours not alternated (M6), the A1 bar off by one (M11), claimed draws mis-counted (M12),
    and the pair scored for the weaker level (M14).
  - Today's values read correct on QE's run: every seed is played in both chairs, and the claimed count equals the `(claimed)` reasons.
  - **But the verdict run is once per verdict and ~10–44 h, and a wrong MET on `A1` would be a manufactured number** (test note 2's
    spirit).
  - Suggested shape (the SE's call): factor the schedule and the pair summary into pure functions, and pin them in the default lane on
    synthetic `LadderGame` records, the way the scorer row does. That keeps the default lane at 0 games.
- **QE-085-b — LOW. Owner: Software Engineer.** The constants that are not the step are unpinned in every lane:
  - `LEVELS` passed verbatim (M5, a halved budget, survives). The page says "Budgets are never scaled", under A5 and `ADR-0038` d1.
  - The game counts (M7: `VERDICT_A1_GAMES` 100 → 50; M7b: `SHORT_A2_GAMES` 4 → 2). A1 says 100, A2 says ≥ 20, and A6 says the counts
    are named constants.
  - A one-line default row, like the step-constant row, pins the counts. An identity check (`createLevel` handed `LEVELS[level]`
    itself) pins the budgets.
- **QE-085-c — LOW. Owner: Software Engineer.** `PLY_CAP` (600) is unpinned: M13 (Infinity) survives. The cap row passes an explicit 4, so
  it tests `runGame`'s rule but not the stated cap. With no wall timeout on the deep rows, `PLY_CAP` is the only hang guard.
- **QE-085-d — INFO. No owner action.**
  - M9 (the replay's recorded-ending equality dropped) is equivalent on today's code, because the recorder and the replay share
    `adjudicate`.
  - M10 (an unseeded opening) is killed only by the deep A5 row, by construction. It was not run (one short-mode run per hop):
    `UNKNOWN - verify`.
  - The harness prints per-pair wall times. A6's "wall clock for the full run" is the vitest `Duration` line, or the sum of pairs. That
    is enough, but there is no single harness line for it.
- **QE-085-e — INFO. Owner: Agents-md Scribe, with the SE's drafted lane line `…8515e3e7`.**
  - `LADDER_DEEP` treats any value other than unset, `1` and `verdict` as a load error. QE checked `""`, `0`, `true`, `VERDICT` and
    `4`: each gives RangeError at collection and exit 1.
  - `PERFT_DEEP`, `CLI_DEEP`, `ZOBRIST_DEEP` and `PUZZLE_DEEP` treat any unknown value as off.
  - This is deliberate (SE decision `…098699a1` item 2), and loud is safer than silent. But `export LADDER_DEEP=` or `=0` turns
    `npm test` red. The lane line should say "unset is the only off".
