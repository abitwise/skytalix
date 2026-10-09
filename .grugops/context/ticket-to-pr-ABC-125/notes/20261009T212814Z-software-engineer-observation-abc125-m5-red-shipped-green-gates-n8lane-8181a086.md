---
id: 20261009T212814Z-software-engineer-observation-abc125-m5-red-shipped-green-gates-n8lane-8181a086
kind: observation
by: software-engineer
at: 2026-10-09T21:28:14Z
verified_by: 
confidence: high
refs:
  - ABC-125
  - ABC-086
  - G-QE-1
  - M5
  - N8-LANE
  - NFR-008
  - src/engine.test.ts
  - src/virtual-clock.ts
  - .grugops/context/qe-ABC-086/notes/20261009T202646Z-qe-e2e-observation-abc086-own-mutants-0df7078c.md
  - .grugops/queue/claimed/ticket-to-pr-ABC-125/ticket-to-pr-ABC-125.md
supersedes: 
---

# `ABC-125`: the row is red under `M5` and green on the shipped module; gates green; `N8-LANE` −350 ms net

Hand-authored, no seal (degraded posture, `AGENTS.md`). Subtask `ticket-to-pr-ABC-125`, branch
`grugops/ABC-125-two-clocks` from `928c83b`, code commit `6a25164`. Machine: Apple M3, Node
v26.11.0. Host heavily loaded throughout (load1 24–45; `ABC-084` builds in parallel). Raw files are
beside this note (`raw-*`).

## The row (`src/engine.test.ts`, +8/−0)

It is in `describe("ABC-086 A6 — each virtual clock keeps its own state")`, after the per-instance
row, in the default lane. `a = virtualClock(1)`, `b = virtualClock(0.5)`, and
`[a(), b(), a(), b(), a(), b()]` `toEqual` `[0, 0, 1, 0.5, 2, 1]`.

## `A2`: the mutant run (test-first)

The row was written first. Then QE's `M5` was planted **on the shipped `src/virtual-clock.ts`**
(QE's `m5-remedy/pristine.ts` lacks the shipped `: Clock` return type and import, so their file
was not copied over). The patch is `raw-m5-planted.diff.txt`: `let sharedStep = 1;` at module
level, `sharedStep = stepMs;` in the factory, `reading += sharedStep;` in the closure.

| run | command | exit | result |
|---|---|---|---|
| `M5` planted | `npx vitest run src/engine.test.ts` | **1** | 1 failed, 32 passed. Failing row: `ABC-086 A6 — each virtual clock keeps its own state > keeps each clock's own step — two live clocks at steps 1 and 0.5, read interleaved (ABC-125)`. Received `[0, 0, 0.5, 0.5, 1, 1]` (`raw-out-m5-red.txt`) |
| `M5` removed (`git checkout -- src/virtual-clock.ts`) | same | **0** | 33 passed; the row passes in 0 ms (`raw-out-shipped-green.txt`) |

After the revert, `git status --porcelain -- src` read only ` M src/engine.test.ts`, and
`git diff --quiet 928c83b -- src/virtual-clock.ts` exited 0.

## `A3`: the gate at `6a25164`'s tree (Workflow 05 order)

| step | result |
|---|---|
| host protection | exit 2, `UNKNOWN - verify` (no remote; `gh` returned no readable status). Never a pass |
| `npm run lint` | exit 0, 95 files, no fixes |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 |
| `npm test` | exit 0, **49 files, 1531 passed**, 7.5 s. The wave tip's last recorded figure is 49 / 1530 (`ABC-086` re-hop); +1 is this row |
| skip count | `0` (`npx vitest run --reporter=json` → `numPendingTests + numTodoTests`) |
| skip integrity | `No findings.`, exit 0 |
| e2e / UAT spec integrity | not applicable (no UI, no `*.uat.spec.ts`) |

`git diff --numstat 928c83b...6a25164 -- src`: `8	0	src/engine.test.ts`, nothing else.

## `N8-LANE`: the standing instrument

Three trees from `git archive 928c83b`: `base`, `null` (`diff -rq` identical to `base`) and `tip`
(`base` plus this branch's `src/engine.test.ts`, `cmp`-identical). `npx vitest run` in each (runner
invoked directly, `PERFT_DEEP` unset), one fresh process per run, CPU = user + sys from
`/usr/bin/time -p`, 9 rounds interleaved, order rotated each round, round 0 discarded. Harness
`raw-harness-lane125.sh.txt`, readings `raw-out-lane125.tsv`. 21:21:56Z–21:27:54Z.

| figure | value |
|---|---|
| base CPU median | 36.16 s |
| tip − base, median of 8 paired deltas | **−0.35 s (−0.97 %)**, sign 4/8 |
| null − base, median of 8 paired deltas | −0.15 s (−0.40 %), sign 4/8, **admissible** (≤ 1.5 %, sign at chance) |
| harness errors | 0 / 27 runs non-zero |
| new test files | 0, so no floor to subtract; 0 spawns |

**`N8-LANE`: MET, −350 ms net against ≤ 650 ms.** The effect cannot be told from zero; the
per-round spread (±1.7 s) is load. That agrees with the row's in-vitest time of 0 ms. The magnitude
is low-confidence under this load; the verdict against a 650 ms bar is not.
