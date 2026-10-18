---
done_at: 2026-10-18T20:15:00Z
branch: grugops/ABC-167 (worktree ../wt-ABC-167, untouched; base e286526d; code 3dd0db1b; reviewed tip 4dbbfbd8)
tip: 4dbbfbd8 (unchanged; QE committed nothing to the branch)
result: PASS_WITH_GAPS
---

QE ran from a scratch worktree, `../wt-qe-ABC-167`, detached at `4dbbfbd8`. That worktree has been removed. Mutants and probes
ran on scratch copies in the session scratchpad. Nothing under `src/`, `plans/board.md` or `plans/traceability.md` was touched,
and no defect was fixed.

The notes and probes are in `.grugops/context/qe-ABC-167/` in main's working tree. They are hand-authored, unsealed and uncommitted:
- the criteria and gates, `…0631b3b6`;
- the mutants, `…8bb44ca0`;
- the break attempts and N8-LANE, `…44fa966c`;
- **the decision, `…e100c23c`, PASS_WITH_GAPS**.

## Criteria
- **A1–A12 are all MET.** These carry test gaps:
  - A4: its printable pin is vacuous (QE-167-a);
  - A5: the D4 terms are unpinned (QE-167-b, -c);
  - A6: `ponder` and release-on-`go` are unpinned (QE-167-d, -e);
  - A11: the guard is textual (QE-167-g).
- **A12:** `git diff --name-only e286526d 4dbbfbd8 -- src` is exactly the two new files.
- **The ticket's security (b2) review check is confirmed.**
  - The runtime import closure holds no limb token.
  - `turn-loop.ts` and `history.ts` are reached only through `engine.ts:97`'s erased `import type`.

## The five SE choices (`…297da9e5`)
| # | choice | grade |
|---|---|---|
| 1 | start position | decided by ADR D3 (implicitly); unpinned (QE-167-h INFO) |
| 2 | time-token rules | **not decided**, QE-167-f LOW |
| 3 | held `bestmove` first | decided by D5/D3; edges not decided, QE-167-e LOW |
| 4 | `searchmoves` extent | **not decided**, behaviour-neutral, QE-167-h INFO |
| 5 | `nps` | **not decided**, QE-167-h INFO |

**QE-170-g** is pinned by rows that fail on a wrong build: `depth 0`, `mate 0`, `depth 2.5`, `nodes 1` and `mate` → 2N−1.
The mutants M17, M19, M20, M21 and M24 are killed.

## Mutants: 51 in total, 28 killed and 23 survived
- **Killed:** M01, M07, M08, M13, M14, M16–M22, M24–M28, M30–M37, M39 (lane only), M45 and M46.
- **Survived:**
  - M02–M06, M09, M10, M11 (A5). M09/M10 are equivalent at step 1;
  - M12, M15 (A6);
  - M23 (A7, choice 4);
  - M29 (A4);
  - M38 and M41 (A11; lint catches both);
  - M40, M42 and M47–M51 (A11; no gate catches them);
  - M43 (choice 5) and M44 (choice 1).

## Gates
lint 0 · typecheck 0 · build 0 · `npm test` exit 0, first run (11.69 s, under the 60 s bound, no re-run). `last-run.json`:
`success: true`, 59 files, 1888/1888, 0 failed, 0 pending · `test-skip-integrity --skip-count 0` "No findings." · merge-tree vs
main `881a14d0` clean.

## N8-LANE (NFR-008): **OWED**
No quiet window, so nothing was timed or estimated.
- **The window check:** on MacBook-Air.local, from 2026-10-18T20:01:13Z for 180 s, 167 of 181 one-second polls showed a foreign
  vitest run, `/Users/olgeroeselg/Projects/public/grugops` `vitest run install/… scripts/…`.
- **Load:** load1 was 7.62–11.82.
- **The trees:** the `T`, `P` and `Z` trees (`cmp`-verified) were built and then deleted unused.
- **The count:** +1 default-lane file and 0 spawns. The floor account takes 160 ms by count.

## Gaps
- **QE-167-a MEDIUM:** A4's printable pin is vacuous. The tested FEN message never echoes its input, so M29 survives, and ESC
  passes on the `moves` and `go`-value paths. The tip itself filters correctly.
- **QE-167-b MEDIUM:** D4's increment, `movestogo` and `movetime`-precedence are unpinned (M03–M06, M11). The page's only
  increment row is capped. A BA/PM A5 amendment is needed, for example `wtime 2000 winc 1000` → 600.
- **QE-167-c LOW:** the A5 1 ms row's 2-step bound admits G = 2, so the 50 ms overhead is pinned nowhere (M02).
- **QE-167-d LOW:** `go ponder` holding is ruled by D4.3 but unpinned (M12).
- **QE-167-e LOW:** release-on-`go` is unpinned (M15). A held answer survives `position` and `ucinewgame`, so a stale move is
  written on `stop`. `quit` drops the held line.
- **QE-167-f LOW:** the time-token value rules are undecided. A keyword with no value swallows the next keyword, so
  `go depth movetime 100` searches 3 000 ms.
- **QE-167-g LOW:** the A11 guard is textual.
  - These evade every gate: side-effect imports of `turn-loop`, `book-file`, `line-input`, `book-engine` and `level-seam`, and
    bracket access to `process` and `Math.random`.
  - Two imports, `'node:fs'` in single quotes and a bare `fs`, evade the test only; lint catches them.
  - Security/NFR may raise its severity.
- **QE-167-h INFO:** choices 1, 4 and 5 are unpinned (M44, M23, M43). A8's ceil row is a tautology over constants.

## Next column
- **Recommended:** `In Security/NFR`, for the N8-LANE reading in a quiet window and a review of QE-167-g.
- **QE-167-a and -b:** fix or accept them before the gate.
- **Then UAT:** the waiver does not apply, because `src/uci-session.ts` is production.
- The Orchestrator decides.

## Trace row (for the Orchestrator to append; QE did not edit `plans/traceability.md`)
| ABC-167 | EPIC-007 / ADR-0044 D2–D4, D12 | `grugops/ABC-167` @ `4dbbfbd8` (code `3dd0db1b`) | `src/uci-session.ts`, `src/uci-session.test.ts` | QE `qe-ABC-167`: 36-dialogue probe; 51 mutants 28 killed / 23 survived; 1888/1888, success true; skips 0 No findings; N8-LANE OWED (no quiet window) | PASS_WITH_GAPS: A1–A12 MET; QE-167-a MEDIUM (A4 printable pin vacuous), -b MEDIUM (D4 inc/movestogo unpinned, A5 amendment → BA/PM); -c/-d/-e/-f/-g LOW, -h INFO; SE choices 1, 3 ADR-decided, 2, 4, 5 gaps; production → owner's UAT applies |
