---
id: 20260816T031500Z-qe-e2e-observation-independent-gate-for-abc065-both-halves-4f2a91c7
kind: observation
by: qe-e2e
at: 2026-08-16T03:15:00Z
verified_by: 
confidence: high
refs:
  - ABC-065
  - plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
  - AGENTS.md
  - src/cli.test.ts
  - .grugops/context/ticket-to-pr-ABC-065-guard/notes/20260816T023100Z-software-engineer-observation-the-gate-and-the-four-mutants-with-vacuity-shown-red-first-9f3e88d1.md
supersedes: 
---

# `ABC-065` — the gate re-run independently on the branch that carries BOTH halves

Hand-authored per `AGENTS.md` § Role / workflow files. **No `kind: finding` and no `§14-gate#<id>`
stamp** — `scripts/context-io.ts` and `mcp__grugops__propose_note` are absent from this repository and
from the kit and `context.human_admission` is `off`, so no verdict is emittable on this install and
none is invented. Workflow 05 step 5's `emitVerdict` call **cannot be made here**; the terminal result
below is recorded as an ordinary `observation` (my own `Q5` from `ABC-066` records the same fact).

Machine: **Apple M3, Darwin 25.5.0, Node v24.12.0, npm 11.7.0.** Branch
`grugops/quality-gate-ABC-065-qe`, cut off `grugops/ticket-to-pr-ABC-065-scribe` @ **`901c670`** — the
`base:` field was **accurate on arrival**, the fourth consecutive accurate writing, so the Scribe's
`G7` / my `G5` staleness did NOT recur. Work ran in a **linked `git worktree`**; the shared checkout
holds `main` @ `cb04b40` and **was not moved**.

**`node_modules` was SYMLINKED to the shared tree's, not reinstalled** — `npm install` was never run
in this worktree, so no manifest and no lockfile could be touched by this hop. `ls -L node_modules |
wc -l` = **94**, the same 94 the shared tree has. (`ABC-066`'s QE hop reinstalled; the guard hop
symlinked. Symlinking is the better practice and it is now two hops running.)

## Terminal gate result: **GREEN — `READY_FOR_HUMAN_REVIEW`**. `self_fix_attempts` used: **0 of 2**

| step | command | my result | the guard hop's | agrees? |
|---|---|---|---|---|
| lint | `npm run lint` (`biome check .`) | exit **0** — **54** files, **76 ms**, **no fixes applied** | exit 0, 54 files, 52 ms, no fixes | **yes** |
| typecheck | `npm run typecheck` (`tsc --noEmit`) | exit **0**, no diagnostics | exit 0 | **yes** |
| unit | `npm test` (`vitest run`) | exit **0** — **859 passed (859)** on **30 files (30 passed)**, 1.91 s | 859/859 on 30 | **yes** |
| build | `npm run build` (`tsc --noEmit`) | exit **0** | exit 0 | **yes** |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** | 0 | **yes** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`**, exit **0** | same | **yes** |
| auto-UAT oracles | `node scripts/check-uat-oracles.js` | **`UNKNOWN - verify`** — `ls`: No such file | same | **yes** |
| e2e | `AGENTS.md` § E2E slot | **`UNKNOWN - verify`** as the slot itself records; `quality.ui_e2e` is `ui-or-critical-path` and there is still no UI surface | same | **yes** |

**Every mandatory gate passed and every number the guard hop published reproduces.** The lint timing
differs (76 ms vs 52 ms) and nothing else does. The two `UNKNOWN - verify` rows are **non-blocking by
Workflow 05's own words**, neither is in `quality.mandatory_gates`, and **neither is recorded as a
pass.** `self_fix_attempts` **0 of 2** — the guard hop spent 1 on biome formatting; the tree it
handed me needed nothing.

**859 is the right number**, not a coincidence: `ABC-066`'s QE hop measured **857** on
`grugops/ticket-to-pr-ABC-066` @ `8fb6ff1`, and `ABC-065`'s guard added exactly **two** `it` rows.
857 + 2 = 859, and `src/cli.test.ts` reports **32 tests** where it reported 30.

## `A6`'s protected substance, re-measured from the delivered commits myself

```
$ git diff --numstat 9490740 c5a5493 -- src/cli.test.ts   ->  85  0
$ git status --porcelain                                  ->  (empty)
$ git diff HEAD | wc -l                                   ->  0
```

| `A6` clause | my measurement | verdict |
|---|---|---|
| exactly `AGENTS.md` + `src/cli.test.ts` across the ticket's two hops | Scribe `39122ec` → `AGENTS.md`; guard `c5a5493` → `src/cli.test.ts`. **Two paths**, `.grugops/` substrate excluded as the Orchestrator ruled | **MET as ruled** — see `G6`/`G12`, still unrepaired in the ticket's prose |
| zero production lines | 0 paths under `src/` other than `src/cli.test.ts` | **MET** |
| zero new files | `--diff-filter=A` over `src/` → **0** | **MET** |
| `spawned` still **10** | `expect(spawned).toBe(10)` at `:836` passed; I counted `CHILDREN`'s keys myself — `npmRun, white, black, random, conflict, difficulty, shortFlag, badColour, bareWord, escape` = **10** | **MET** |
| suite green, skip **0** | **859/859 on 30 files**, skip **0** | **MET** |

**This hop added no child either.** Every one of my eighteen mutants ran through the existing capture;
`spawned` is **10 → 10 → 10** across three consecutive hops.

## The documented command, RUN rather than trusted — for the third time, by a third hand

`AGENTS.md` § Commands forbids recording a command nobody ran. The Scribe ran it at `4e9ed1d`, the
guard hop re-ran it at the merge tip, and I re-ran it at `901c670`:

```
$ npm run chess -- --colour black
> node src/cli.ts --colour black          <- the flag REACHED the program
1 .R:N.B:K.Q:B.N:R                        <- rank 1 on top: black-bottom, as documented
exit 0, 26 stdout lines
```

And the defect the slot now warns about still reproduces exactly as the Scribe measured it:

```
$ npm run chess --ascii            # stderr:
npm warn Unknown cli config "--ascii". This will stop working in the next major version of npm.
```

**Evidence, not a guard.** No test row of mine asserts either; the end-to-end run is the UAT pack's.
