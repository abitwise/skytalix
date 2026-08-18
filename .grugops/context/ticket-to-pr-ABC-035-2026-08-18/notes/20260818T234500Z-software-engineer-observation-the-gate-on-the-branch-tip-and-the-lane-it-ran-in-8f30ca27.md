---
id: 20260818T234500Z-software-engineer-observation-the-gate-on-the-branch-tip-and-the-lane-it-ran-in-8f30ca27
kind: observation
by: software-engineer
at: 2026-08-18T23:45:00Z
verified_by:
confidence: high
refs:
  - ABC-035
  - ABC-050
  - NFR-008
  - vitest.config.ts
supersedes:
---

# The blocking gate on `grugops/abc035-in-game-commands`, and the lane — the RECORDED commands, run as recorded

## The lane, verified rather than assumed

An isolated agent worktree,
`/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/agent-a00db242ddfbf4118`,
on `grugops/abc035-in-game-commands`. Containment checked first: `ls -a .claude/` in this worktree
returns `settings.json` and `skills/` and **no `worktrees/` directory**, so the repo's known
`vitest.config.ts` defect (no `exclude`, so a root-level run sweeps sibling checkouts — `ABC-050`,
already routed, not chased here) has nothing to sweep. `biome check .` reports **66 files**, which is
this repository alone; the contamination signature is a count in the hundreds.

**So `npm test` and `npm run lint` — the commands `AGENTS.md` actually records — were run AS
RECORDED**, not replaced with hand-tuned `--exclude` variants. QE confirmed this shape at
`quality-gate-ABC-033-qe-2026-08-18`; this hop is a second instance of it and no new lane technique
was invented.

## Every step, as it ran

| step | command | result |
|---|---|---|
| test | `npm test` (`vitest run`) | **37 files / 1128 tests, all passed**, 0 failed, 2.10 s |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`**, exit **0** |
| lint | `npm run lint` (`biome check .`) | **Checked 66 files, no fixes applied**, exit **0** |
| typecheck | `npm run typecheck` (`tsc --noEmit`) | exit **0**, no output |
| build | `npm run build` (`tsc --noEmit`) | exit **0**, no output |
| deep perft | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **32/32 passed**, 37.37 s |

**All seven green.**

## Against the baseline

`main` @ `8b055cb` is **1049 tests / 36 files, skip 0** (the figure carried in the subtask brief,
measured at `23312b3`, and unchanged by the two board/queue chore commits between them). The tip is
**1128 / 37 / skip 0**: **+79 tests, +1 file, no other movement.** The 79 are exactly
`src/command-input.test.ts`'s own, and the file count rise is the one test file the ticket's
`## Lane cost` allots. Lint file count 64 → **66** is the two new files and nothing else.

## `SEARCH_DEEP=1` was NOT run, and the reason is checked against the rule rather than assumed

`AGENTS.md` § Test names two triggers: *"Run it at the **QE hop** and after any change to
`src/search.ts`."* **Neither fires here** — this is the engineer's delivery hop, not the QE hop, and
`git diff main..HEAD -- src/` touches no file but the two `command-input` ones. `ABC-033`'s engineer
skipped this lane on a reason that did **not** cover the rule (`G7`), so it is spelled out here: the
lane is owed at the QE hop, and QE's hop is still ahead.

## Mutation and the gate, in that order

The thirteen mutants (sibling note) were applied and reverted **before** these figures were taken,
and `git status --porcelain -- src/command-input.ts` was empty afterwards — **RESTORE VERIFIED**. The
scratch harness `mutants.py` was deleted and is not in any commit; `git diff main..HEAD` carries four
files and none of them is it.
