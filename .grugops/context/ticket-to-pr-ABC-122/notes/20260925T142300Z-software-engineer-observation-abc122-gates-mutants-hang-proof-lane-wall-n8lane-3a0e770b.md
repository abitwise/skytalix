---
id: 20260925T142300Z-software-engineer-observation-abc122-gates-mutants-hang-proof-lane-wall-n8lane-3a0e770b
kind: observation
by: software-engineer
at: 2026-09-25T14:23:00Z
verified_by:
confidence: medium
refs:
  - ABC-122
  - ABC-081
  - NFR-008
  - N8-LANE
  - N8-SPAWN
  - ticket-to-pr-ABC-122
  - src/search.capacity.test.ts
  - src/engine.capacity.test.ts
  - tools/grugops/run-bounded.js
  - tools/grugops/run-bounded.proof.js
  - .grugops/context/ticket-to-pr-ABC-122/notes/raw-harness-lane.mjs.txt
  - .grugops/context/ticket-to-pr-ABC-122/notes/raw-out-lane-summary.txt
  - .grugops/context/ticket-to-pr-ABC-122/notes/raw-out-lane.tsv.txt
  - .grugops/context/ticket-to-pr-ABC-122/notes/raw-out-lane-load.txt
  - .grugops/context/ticket-to-pr-ABC-122/notes/raw-harness-mutants.mjs.txt
  - .grugops/context/ticket-to-pr-ABC-122/notes/raw-out-mutants-full-lane.txt
  - .grugops/context/ticket-to-pr-ABC-122/notes/raw-out-mutants-first-failure.txt
  - .grugops/context/ticket-to-pr-ABC-122/notes/raw-harness-lane-wall.mjs.txt
  - .grugops/context/ticket-to-pr-ABC-122/notes/raw-out-lane-wall.txt
  - .grugops/context/ticket-to-pr-ABC-122/notes/raw-out-proof.txt
  - .grugops/context/ticket-to-pr-ABC-122/notes/raw-out-npm-test-k4-mutant.txt
supersedes:
---

# ABC-122 readings: gates green through the wrapper, 6/6 guard mutants red, the hang killed as a tree at 527–536 ms, N8-LANE +475 ms gross / ≈ +155 ms net

Hand-authored and unsealed. Machine: macOS 26.5.2 (25F84), Node v24.12.0. Tree: `43565e7`.
Other agent hops were loading the machine: 1-minute load average 4.5–24.7 across these runs.

## Gates, each run THROUGH the wrapper (`node tools/grugops/run-bounded.js 60000 <gate>`)

| gate | reading |
|---|---|
| `npm run lint` | exit 0, 83 files, no fixes |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 |
| lane `npx vitest run --reporter=json` | exit 0, **47 files, 1446 passed, 0 failed**, wall 6.17 s |
| skip count | **0** (`numPendingTests + numTodoTests`) |
| `test-skip-integrity.js … --skip-count 0` | `No findings.`, exit 0 |
| `lane-inventory.js` | **exit 1, PRE-EXISTING**: `.grugops/context/ruling-abc079-oracle/probe/vt/oracle.test.ts` is tracked, and the unchanged `.grugops/**` exclude drops it. It has been tracked since `b324cb6`, before this branch. Inferred red at base, NOT re-run there. The two new files are collected and tracked. |

Base `66a45d1`: 45 files, 1444 tests. The delivered tree adds **exactly 2 files and 2 tests**
(one row each) under `src/`. Every one of the 1444 earlier tests is still green (`A10`).

## Mutants (`A7`, `A9`), each full lane, restored byte-for-byte after

| mutant | red rows | first failure |
|---|---|---|
| S1 `search.ts` guard removed | `search.capacity` A6 only | `TypeError: Cannot mix BigInt…` (`keys[129]` read past the array) |
| S2 `search.ts` `>=`→`>` | `search.capacity` A6 only | `expected 129 to be 128` (key writes) |
| S3 `search.ts` `>= CAP-1` | `search.capacity` A6 only | `expected -1605 to be -1595` (score) |
| E1 `engine.ts` guard removed | `engine.capacity` A8 only | `TypeError: Cannot mix BigInt…` |
| E2 `engine.ts` `>=`→`>` | `engine.capacity` A8 only | `expected 129 to be 128` |
| E3 `engine.ts` `>= CAP-1` | `engine.capacity` A8 only | `expected -1605 to be -1595` |

In every run the other 1445 tests stayed green, so before this ticket nothing in the lane
killed any of these mutants. That is K3's measured gap, now closed.

## The wrapper (`A1`–`A3`, `A5`): `node tools/grugops/run-bounded.proof.js`, exit 0, three runs

- `A2`, direct vs wrapped: stdout, stderr and exit code are byte-identical, for exit 0 AND for
  exit 3. A red command passes through red.
- `A1`/`A3`, synthetic hang at a 500 ms bound:
  - exit **124**;
  - **526.8 / 529.3 / 536.4 ms** from spawn to exit, including the wrapper's own start-up, which
    is ≤ 750;
  - one stderr line naming `500 ms` and the fixture path.
- **Orphan check, armed.** Before the kill, the fixture (the wrapper's child), its grandchild and
  their process group were all seen alive. 250 ms after the exit, all three returned ESRCH.
- **The proof itself is armed**, run against two wrapper mutants in a scratch copy:
  - a kill of the direct child only (`child.kill`): the orphan row FAILED with `ALIVE: group,
    grandchild`, and the cleanup killed the survivor;
  - no kill at all: the exit-code row FAILED (`exit null`) and the bound row FAILED (5004 ms). The
    proof's own 5 s outer bound ended that run.
  - No stray process from any run (checked with `ps` afterwards).
- **The real hang class, end to end** (`A4` mechanics). The root depth guard was reverted to
  `if (false)`, `package.json` and `src/cli.test.ts:1661` were temporarily wired (both reverted,
  never committed), and `npm test` was run. It printed `run-bounded: timed out after 60000 ms,
  killed the process tree of: vitest run`, **exit 124, 60.23 s wall**, and no vitest process from
  the worktree survived. Wired the same way, the green lane gave 47 / 1446 with exit 0.
  `npm test -- src/search.capacity.test.ts` forwarded the argument, 1 file, exit 0.
- `A5`: `node:child_process`, `node:os`, `node:timers` only. No `timeout(1)`, no `pkill`, no
  shell.

## `A4` lane wall (the constant's input)

7 fresh `npx vitest run` runs: 7.16 7.22 7.38 **7.45** 7.51 7.77 7.88 s, 47 / 1446, load
13.6–23.5. 60000 ms chosen (decision `621c1465`).

## `N8-LANE` (CPU, `NFR-008`'s protocol: `secnfr-ABC-081`'s harness, labels repointed)

Contained lane `npx vitest run --dir src`, runner invoked directly. Arms:
- A = `43565e7`;
- N = a byte-identical copy of A (`/usr/bin/diff -rq`: identical);
- B = `66a45d1`, which differs from A under `src/` by the two new files only.

9 rounds, round 0 discarded, order rotated, counts asserted, 0 harness errors in 27 runs.
- **Null control N−A: median +165 ms = +0.66 % of A, sign 5/8.** It is ≤ 1.5 %, with the sign
  at chance, so it is admissible.
- **Charge A−B: median +475 ms gross CPU (1.91 % of A), sign 5/8.**
  - Per round: 1.25 0.43 −0.17 0.74 0.52 −0.54 0 0.84.
  - Net of the 2-file floor (320 ms): **≈ +155 ms against the 650 ms bar, so within it at this
    reading.**
  - Per `OQ-1`, that is a rate-limit reading, not "the lane is within budget". Medians: A 24.88 s,
    B 24.50 s CPU.
- Load average 4.55–24.74 (median 17.41), so **confidence is medium**. Sign 5/8 on the charge
  means the effect is not cleanly resolved at n = 8.
- In-process, the engine row cost 224 ms of vitest test time (one isolated run): 130 deepening
  iterations of a 128-ply line. The search row cost 14 ms.
- **`N8-SPAWN`: 0 ms charged.** The two lane files spawn nothing. `A3`'s criterion text forces 2
  children (proof → wrapper → fixture), and the fixture adds a grandchild to prove the TREE kill.
  All of them run outside the lane (decision `621c1465` D4), so no lane CPU exists to charge.
  The account balance is unchanged.
