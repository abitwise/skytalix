---
id: 20260816T001500Z-qe-e2e-observation-independent-gate-for-abc066-637cb2b0
kind: observation
by: qe-e2e
at: 2026-08-16T00:15:00Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md
  - src/cli.ts
  - src/cli.test.ts
  - .grugops/context/ticket-to-pr-ABC-066/notes/20260815T223010Z-software-engineer-observation-terminal-gate-two-mutants-and-the-six-advertised-invocations-634ac004.md
supersedes: 
---

# `ABC-066` — the gate, re-run independently: every number, including the ones that AGREE

Hand-authored per `AGENTS.md` § Role / workflow files. **No `kind: finding` and no `§14-gate#<id>`
stamp** — `scripts/context-io.ts` and `mcp__grugops__propose_note` are absent from this repository
and from the kit and `context.human_admission` is `off`, so no verdict is emittable on this install
and none is invented. Workflow 05 step 5's `emitVerdict` call **cannot be made here**; the terminal
result below is recorded as an ordinary `observation`.

Machine: **Apple M3, Darwin 25.5.0, Node v24.12.0, npm 11.7.0**. Branch
`grugops/quality-gate-ABC-066-qe`, off `grugops/ticket-to-pr-ABC-066` @ **`8fb6ff1`**, in a **linked
`git worktree`** — the shared checkout holds `main` @ `a0ded3b` and was not moved. `npm install` was
run in the worktree (a fresh checkout has no `node_modules`); it changed no manifest.

## Terminal gate result: **GREEN — `READY_FOR_HUMAN_REVIEW`**. `self_fix_attempts` used: **0 of 2**

| step | command | my result | engineer's | agrees? |
|---|---|---|---|---|
| lint | `npm run lint` (`biome check .`) | exit **0** — **54** files, 73 ms, **no fixes applied** | exit 0, 54 files, 81 ms | **yes** |
| typecheck | `npm run typecheck` (`tsc --noEmit`) | exit **0**, no diagnostics | exit 0 | **yes** |
| unit | `npm test` (`vitest run`) | exit **0** — **857 passed (857)** on **30 files (30 passed)** | 857/857 on 30 | **yes** |
| build | `npm run build` (`tsc --noEmit`) | exit **0** | exit 0 | **yes** |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** | 0 | **yes** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`**, exit **0** | same | **yes** |
| auto-UAT oracles | `node scripts/check-uat-oracles.js` | **`UNKNOWN - verify` — the script does not exist in this repository** (`ls`: No such file) | not reported | **new** |
| e2e | `AGENTS.md` § E2E slot | **`UNKNOWN - verify`** as the slot itself records; `quality.ui_e2e` is `ui-or-critical-path` and there is no UI surface | — | — |

The two `UNKNOWN - verify` rows are **non-blocking by Workflow 05's own words** (step 3: a host that
does not ship the oracle aggregator records an honest UNKNOWN, never a faked pass) and neither is in
`quality.mandatory_gates`. All four mandatory gates passed. **Recorded as UNKNOWN, not as green.**

## `NFR-008` — the lane total, five fresh runs on the branch tip

| run | wall | CPU (user+sys) |
|---|---|---|
| 1 | 2.16 s | 11.07 s |
| 2 | 2.38 s | 10.43 s |
| 3 | 2.55 s | 10.50 s |
| 4 | 2.35 s | 10.60 s |
| 5 | 2.39 s | 10.61 s |

**Median wall 2.38 s (bar ≤ 3 s); median CPU 10.60 s (bar ≤ 13 s). `NFR-008` HOLDS.** Consistent
with the engineer's clean readings (10.68 s before, 10.77 s after).

**`N8-LANE` was NOT re-measured and I do not restate it.** The engineer's paired-rotation instrument
(8 rounds, `cmp`-verified identity null control) is the catalog's instrument and re-running it was
not this hop's brief; his figure — **+70 ms median, under a +100 ms identity null floor, `MET` at
0.11× the 650 ms bar, `confidence: medium`** — stands unchallenged, and the five absolute runs above
are a **sanity bound only**, not a second measurement of the delta. Stating the limit rather than
implying I checked it.

## `A6`, re-measured from the delivered commit myself

```
$ git diff --name-only ab0864e~1 ab0864e     ->  src/cli.test.ts, src/cli.ts        (2 paths)
$ git diff --numstat  ab0864e~1 ab0864e      ->  92 0 src/cli.test.ts / 7 2 src/cli.ts
$ git diff --diff-filter=A --name-only …     ->  0                                  (0 new files)
```

| `A6` clause | my measurement | verdict |
|---|---|---|
| exactly `src/cli.ts` + `src/cli.test.ts` | **2 paths** | **MET** |
| exactly 1 production line changed | `7 2` raw; the 2 removed are **1 doc-comment line + 1 code line**, the 7 added are **6 comment lines + 1 code line** → **`1 1` comments aside** | **MET** |
| 0 new files | **0** | **MET** |
| `spawned` still 10 | **`expect(spawned).toBe(10)` at `:836`; `CHILDREN` has exactly 10 entries** (`npmRun, white, black, random, conflict, difficulty, shortFlag, badColour, bareWord, escape`) | **MET** |
| suite green, skip 0 | **857/857 on 30 files, skip 0** | **MET** |

**`spawned` is 10 and this hop added no child** — my whole campaign ran through mutation of the
existing capture and through a standalone probe outside the repository. **10 → 10.**

## `ABC-042` did not move — measured, not assumed

`git diff ab0864e~1 ab0864e -- src/cli.test.ts` has **0 deleted content lines** (`numstat` reads
`92 0`; the single `^-` hit is the `--- a/…` file header). **No merged `ABC-042` row was edited,
re-worded or removed** — the change is purely additive. **No stop condition fired: no merged
`ABC-042` row had to move, so nothing was routed back to the Orchestrator on that ground.**

## `A2`'s real-world half, re-run end to end through `npm`

Not a guard and not claimed as one — the ticket puts this in the UAT pack. Re-run because
`AGENTS.md` § Commands forbids recording a command nobody ran:

| invocation | exit | stdout lines | stderr bytes |
|---|---|---|---|
| `npm run chess -- ` | **0** | **27** | **0** |
| `npm run chess -- --colour white` | **0** | **27** | **0** |
| `npm run chess -- --colour black` | **0** | **27** | **0** |
| `npm run chess -- --colour random` | **0** | **27** | **0** |
| `npm run chess -- --ascii` | **0** | **27** | **0** |
| `npm run chess -- --unicode` | **0** | **27** | **0** |

**6 of 6, exit `0`, 27 stdout lines, empty stderr** — reproducing both the ticket's cut figures and
the engineer's independently.

## The defect is repaired at the user's terminal — I reproduced the ticket's own transcript

```
$ npm run chess --colour black                                   # the natural spelling
npm warn "black" is being parsed as a normal command line argument.
npm warn Unknown cli config "--colour". This will stop working in the next major version of npm.
unrecognised argument: black
usage: npm run chess -- [--colour white|black|random] [--ascii | --unicode]      # exit 1
```

**Line 5 now instructs him to type something that works**, and typing it (`npm run chess -- --colour
black`) exits `0` with the 27-line frame. The ticket's *Pain* — "line 4 instructs him to type line
1" — is discharged **on the user-visible path**, not merely in a unit test. This is the closing half
of the loop and I ran it rather than inferring it.
