---
id: 20260819T005500Z-qe-e2e-artifact-ref-the-branch-the-commands-and-everything-this-hop-touched-b7c04e51
kind: artifact-ref
by: qe-e2e
at: 2026-08-19T00:55:00Z
verified_by:
confidence: high
refs:
  - ABC-035
  - src/command-input.ts
  - src/command-input.test.ts
  - plans/traceability.md
supersedes:
---

# The branch, the commands, and every file this hop touched

## Branch

- **`grugops/quality-gate-ABC-035-qe-2026-08-18`**, cut from **`grugops/abc035-in-game-commands` @
  `e01033f`** — the **delivery branch**, as the subtask required, **not `main`**.
- `main` is at `387c9b2` and was **not touched**. Nothing merged, nothing deployed, no remote (this
  repo has none).
- Worked in the isolated agent worktree
  `/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/agent-acfd942891e41f028`.

## Files this hop wrote

| file | what |
|---|---|
| `.grugops/context/quality-gate-ABC-035-qe-2026-08-18/notes/` | five typed notes (this one included) |
| `plans/traceability.md` | **`ABC-035`'s Status cell only**, append-only, plus one `_Updated:` header line |
| `.grugops/queue/claimed/abc035-qe/CLAIM.md` | the claim marker |
| `.grugops/queue/done/abc035-qe.md` | the subtask file, swept — **see the reconciliation note below** |

## ONE THING THE ORCHESTRATOR MUST FINISH, named rather than left to be discovered

**The sweep could not be a `git mv`, and the leftover is real.** The subtask file was enqueued on
`main` @ **`387c9b2`** ("grug move ABC-035 to In Review and grug enqueue its QE"), which is a
**descendant of my base `e01033f`** — so `.grugops/queue/pending/abc035-qe.md` **does not exist on
this branch** and there was nothing to move.

What I did instead, and it is faithful rather than reconstructed: `git show
387c9b2:.grugops/queue/pending/abc035-qe.md > .grugops/queue/done/abc035-qe.md` — **the same bytes**,
placed in `done/`.

**Therefore `.grugops/queue/pending/abc035-qe.md` still exists on `main` and this branch cannot
delete it.** When this branch is merged, the file will be present in **both** `pending/` and `done/`.
**Deleting the `pending/` copy at merge is owed and it is the Orchestrator's** — I am not merging and
I will not reach onto `main` to do it. Recorded here so a later sweep does not read the duplicate as
an abandoned claim.

The claim directory `.grugops/queue/claimed/abc035-qe/` was created by the bare-`mkdir` atomic act at
the start of this hop and is removed in the same commit as the sweep, which is the normal lifecycle.

**No file under `src/` was written by this hop.** `git diff e01033f..HEAD -- src/` is **empty** —
QE tests behaviour and does not change it.

## Files created, run and DELETED (in no commit)

- `src/zz-qe-scratch.test.ts` — the `A7` headroom ladder probe.
- `src/zz-qe-probe.test.ts` — the channel-mechanism probe (`console.log` vs `process.stdout.write`
  vs a load-time binding, against the same spy the delivered guard installs).

Both were removed and `git status --porcelain` asserted empty afterwards. Neither appears in any
commit.

## Out-of-repo scratch, NOT committed

- `mutants.py` — the 17-mutant harness. Applies a literal text substitution to
  `src/command-input.ts`, runs `npx vitest run src/command-input.test.ts --reporter=json
  --outputFile=…`, restores from a pristine copy, and **aborts non-zero** if
  `git status --porcelain -- src/command-input.ts` is not empty afterwards.
- `pristine.ts` — the byte copy of the delivered `src/command-input.ts` taken before the first
  mutation.

Both live under this session's scratchpad, outside the repository. Every mutant is recorded as a
**diff** in the mutation note, so the battery is rebuildable byte-for-byte without the harness — the
standing lesson from `quality-gate-ABC-033-qe-2026-08-18`.

## Every command run at this hop

```
ls -a .claude/                                                   # containment: no worktrees/
npm test                                                         # 37 files / 1128 tests / 0 failed
npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'   # 0
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0   # No findings., 0
npm run lint                                                     # Checked 66 files, exit 0
npm run typecheck                                                # exit 0
npm run build                                                    # exit 0
PERFT_DEEP=1 npx vitest run src/perft.test.ts                    # 32/32, exit 0
SEARCH_DEEP=1 npx vitest run src/search.test.ts                  # 41/41, exit 0
npx vitest run src/command-input.test.ts                         # 79/79, 14 ms
git diff --numstat main..grugops/abc035-in-game-commands -- src/  # 539/0 + 142/0
```

**`npm test` and `npm run lint` were run AS RECORDED in `AGENTS.md`** — not replaced with hand-tuned
`--exclude` variants — because an isolated agent worktree has no `.claude/worktrees/` for
`vitest.config.ts`'s missing `exclude` (`ABC-050`) to sweep. The confirming signature is `biome
check .` reporting **66 files**, this repository alone.

## Commits on this branch

```
2d4b440  chore(queue): grug claim the ABC-035 QE subtask
887ddef  docs(ABC-035): grug re-run the whole gate and grug run the SEARCH_DEEP lane that was owed here
72763f2  docs(ABC-035): grug run seventeen mutants and grug find four grug survive past M13
a221080  docs(ABC-035): grug attack the A2 and A6 controls at the mechanism and grug find both hold
c4751ae  docs(ABC-035): grug re-measure A7 headroom and grug find the wall grug sit at the eighth item
20cf2b8  docs(ABC-035): grug write the QE verdict, grug pass it, grug name six gaps
0df0c2e  docs(trace): grug record the ABC-035 QE result in the one row, grug touch the status cell only
```

## What this hop deliberately did NOT do

- **Did not fix.** Four surviving mutants are reported, not closed. No guard was weakened; the
  delivered tree is byte-identical under `src/`.
- **Did not re-open `ABC-033`** — merged, gated four times. It is cited only as the source of the
  `G3` failure shape that `A2` and `A6` were attacked against.
- **Did not rule any NFR bar.** `N8-LANE` is recorded and routed; `ABC-078` is in Security/NFR and
  owns it.
- **Did not move a board column.** `plans/board.md` was not opened. The `In Review` exit is QE's to
  recommend and the Orchestrator's to write.
- **Did not merge and did not deploy.**
