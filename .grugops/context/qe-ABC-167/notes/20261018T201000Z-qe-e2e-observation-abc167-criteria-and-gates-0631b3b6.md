---
id: 20261018T201000Z-qe-e2e-observation-abc167-criteria-and-gates-0631b3b6
kind: observation
by: qe-e2e
task: qe-ABC-167
at: 2026-10-18T20:10:00Z
verified_by:
confidence: high
refs:
  - ABC-167
  - plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md
  - ADR-0044
  - EPIC-007
  - NFR-008
  - 20261018T193742Z-software-engineer-artifact-ref-delivery-469c4efb
supersedes:
---

# ABC-167 criteria and gates at tip `4dbbfbd8` (code `3dd0db1b`, base `e286526d`)

Hand-authored and unsealed. Run from the scratch worktree `../wt-qe-ABC-167`, detached at `4dbbfbd8`, with `node_modules`
symlinked from main. That worktree has since been removed. Nothing was committed to `grugops/ABC-167`.

## Gates (all at the tip, Node v26.11.1, host MacBook-Air.local)
- `npm run lint` exit 0 (115 files). `npm run typecheck` exit 0. `npm run build` exit 0.
- `npm test` exit 0 on the **first run**. The 60 s bound was not hit (11.69 s), so there was no re-run.
  `.test-results/last-run.json`: `success: true`, 59 files, 1888/1888, 0 failed, 0 pending. This matches the SE's count.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.
- `git merge-tree --write-tree main 4dbbfbd8` (main `881a14d0`): clean.

## Criteria (graded against the page, not the implementation)
| item | ruling | evidence |
|---|---|---|
| A1 | MET | exact 3 lines. Order swap M36 killed |
| A2 | MET | exact `readyok` |
| A3 | MET | 2 lines, equal `M`, legal. Extra pv token M45 killed. The `nps` value is unpinned (choice 5) |
| A4 | MET, test gap | Behaviour holds: bad FEN, illegal move and stalemate each give `bestmove 0000`. M26/M27/M28/M30 killed. **The printable pin is vacuous**: M29 (C0 filter removed) survives, because neither tested message echoes the input (QE-167-a). The tip itself filters correctly, as the probe shows |
| A5 | MET, test gap | All six figures are inside `G ≤ time ≤ G + 2·step`. Level cap (M07), side swap (M08) and `/20` (M01) are killed. **D4's increment, `movestogo`, overhead and movetime-precedence terms are unpinned** (M02–M06, M11) (QE-167-b, QE-167-c) |
| A6 | MET, test gap | Hold, single release and `ponderhit` are pinned (M13/M14/M16 killed). `go ponder` holding (M12) and release-on-new-`go` (M15) are unpinned (QE-167-d, QE-167-e) |
| A7 | MET | Every page row is pinned, and so is each QE-170-g edge (see the mutants note). `searchmoves` consuming to end of line (M23) survives. That is choice 4, and behaviour-neutral on the page's row |
| A8 | MET | `mate -1`, `mate 2`. ceil→floor (M31), sign (M32) and floor-threshold (M33) are killed. The test's "M = ceil" row computes over constants, not the module (QE-167-h) |
| A9 | MET | Writes nothing (M35 killed). `ucinewgame` reset (M34 killed) |
| A10 | MET | M37 killed |
| A11 | MET as written, guard gap | No listed token in `src/uci-session.ts`. The direct imports are `apply`, `coordinate-move`, `engine`, `fen`, `levels`, `position`, `search` and `transposition`, all on the D2 allowed list. The M4 sweep holds. The guards are textual, and several evasions pass every gate (QE-167-g) |
| A12 | MET | `git diff --name-only e286526d 4dbbfbd8 -- src` = exactly `src/uci-session.test.ts`, `src/uci-session.ts`. No other `src/` file moved, so the D2 "no edit" list is unchanged |

**Security trigger (b2), the QE review check: confirmed.** I took the runtime import closure of `uci-session.ts`:
apply, coordinate-move, engine, evaluate, fen, gameend, legal, levels, moves, position, quiescence, search, transposition and zobrist.
It holds no limb token. The grep has three hits, and none is a limb:
- `coordinate-move.ts:91` is `RegExp.prototype.exec`;
- `levels.ts:115` is the defaulted `options.now ?? Date.now`, which the page already lists;
- `engine.ts:474` is the same defaulted pattern. The page does not list it. It is unreachable here, because the session always injects `now`.

`turn-loop.ts` and `history.ts` are reached only through `engine.ts:97`'s pre-existing `import type`, which is erased at
runtime.

**UAT waiver: does not apply.** Production `src/uci-session.ts` is in the diff.
