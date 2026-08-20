---
id: 20260821T022500Z-qe-e2e-observation-gates-flake-and-the-lane-cost-i-measured-and-do-not-grade-9a17d4b3
kind: observation
by: qe-e2e
at: 2026-08-21T02:25:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - A1
  - A2
  - A3
  - A4
  - A6
  - A7
  - A8
  - A9
  - NFR-008
  - ABC-108
supersedes:
---

# WHAT I RAN, WHAT IT SAID, AND WHERE IT IS TIMING-DEPENDENT — the boring half, which is where a flaky guard hides

Branch `grugops/qe-abc115`, worktree off `grugops/abc115-spawn-clause` @ `6acc3fb`. Node v24.12.0,
vitest 3.2.7, darwin-arm64.

## The four mandatory gates — all green on the branch tip

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | **exit 0** — `Checked 73 files in 88ms. No fixes applied.` |
| typecheck | `npm run typecheck` | **exit 0**, no output |
| build | `npm run build` (a typecheck wearing the build slot's name) | **exit 0**, no output |
| unit | `npx vitest run --dir src` | **exit 0 — 40 files / 1212 tests / 0 failed** |

**Test integrity.** Skip count from the host runner:
`npx vitest run --dir src --reporter=json | jq '.numPendingTests + .numTodoTests'` → **0**.
`node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` → `No findings.`,
**exit 0**. No test is skipped, and that is measured rather than assumed.

**`A7` reconciles exactly.** Base `main` @ `414ef75`, re-run by me: **40 files / 1207 tests**.
Delivered: **40 files / 1212**. `1207 + 5` = the five rows `A1`, `A2`, `A3`, `A4`, `A9`. 0 new test
files, as the ticket's falsifiable zeroes require.

**`A6` re-checked from git, not from the delivery note:**
`git diff --name-only main...HEAD -- src/` → exactly `src/cli.test.ts`, `src/cli.ts`.
`git diff --numstat main...HEAD -- 'src/' ':!src/cli.ts' ':!src/*.test.ts'` → **empty**.
`git diff --numstat main...HEAD -- src/cli.ts` → **13 / 0**, inside the `<= 15` fence (4 of the 13
are code, 9 are the comment block).

**`A8`, first branch, checked rather than accepted:** `AGENTS.md` `## Development`'s exit-code
sentence and `src/cli.ts`'s exit-code docblock are unedited by this ticket, and the delivered
build's `A4` children measure `70` / `1` / `0` for the three cases those sentences describe. Both
documents are true verbatim. **`AGENTS.md` was correctly left unopened** (`ABC-109`'s byte cap).

## Flake — the brief's fourth danger, and I looked for it where it lives

- **`src/cli.test.ts` alone, 20 consecutive runs: 20/20 green.** Duration 2.48-2.49 s. The brief's
  own bar ("a row that passes 5/5 and fails at 20/20") is met at 20.
- **The full lane, 12 runs across this hop: 12/12 green, 1212 passed every time.** The full lane
  matters separately: it runs 8 workers, so `A9`'s 0.6 s settle races under real contention there
  and not in a single-file run.
- **The margins are wide, which is why it does not flake.** `A9`'s child returns in 0.64-0.68 s
  against a 4 s bound (~6x), the bound is 4 s against `T_open` 10 s, and the settle is 0.6 s against
  a 0 s setting measured flaky at the amendment. Nothing sits near a boundary.
- **One residue, named:** every `A9` run leaves a detached `sleep 10` orphan. Twenty repetitions
  leave twenty. They are bounded and harmless, and the file says so; at 20x it is visible in `ps`.

## Paths not covered by any criterion, probed anyway — all clean

Neither of these is on the page; the closed-reader scenarios all end **before** an engine search.

| scenario | result |
|---|---|
| `--ascii --colour black` (engine opens, up to `DEFAULT_BUDGET_MS`), stdin closed, reader closes at 2 lines | **exit 0, stderr empty, ends at 3.07 / 3.06 s**, 2/2 |
| `--ascii`, stdin held open, `e4` played so the engine replies, reader closes at 2 lines | **exit 0, stderr empty, ends at 3.62 / 3.62 s**, 2/2 |

**Worth saying out loud:** the session ends **after** the in-flight search finishes, not during it —
`process.stdin.destroy()` does not interrupt the engine. So the real-world upper bound on "ends
quietly" is one search budget (~3 s), not the ~0.6 s the criteria sample. That is correct behaviour
under `ADR-0016` and it is not asserted anywhere.

## Lane cost — REPORTED, NOT GRADED

`NFR-008` is breached and `ABC-108` / `ABC-110` are open, so no `N8-LANE` claim is made here and no
grade is offered. My readings of `npx vitest run --dir src`, 5 runs each:

- base `main` @ `414ef75`: **real 3.06-3.31 s, user 13.94-14.39 s, sys 1.31-1.39 s**
- delivered branch tip: **real 4.20-4.37 s, user 14.93-15.40 s, sys 1.63-1.70 s**

The delta and its arithmetic against the clause in force are in the `G-QE115-2` note, because that
is where the figure is needed. **`user` alone exceeds `NFR-008`'s 13 s CPU clause on BOTH sides of
the pair**; that is `ABC-108`'s to rule and I do not rule it.

## `G-QE115-3` — two of the three `N8-SPAWN` clauses are asserted by nobody

`grep -rn "N8-SPAWN"` across the repository returns `src/cli.test.ts` **only**, and every hit is a
comment; `grep` for `0.30`, `per added child` and `per-child` across `src/*.test.ts` returns
**nothing**. The **count** clause has a mechanical pin (`const N8_SPAWN = 17 + 6`); the **wall**
(`<= 2.0 s`) and **CPU** (`<= 0.30 s per added child`) clauses have none. They live only in a hop's
hand-measurement, so drift on either is invisible to the gate. The brief asked whether the
re-derived clause has teeth: **its arithmetic does — 0.30 is 1.97x the measured floor, and I
reproduced the floor — but nothing in the tree bites.** Recorded as a gap, not as a demand: a lane
timing assertion is exactly the kind of row `plans/nfr-catalog.md` keeps out of the default lane,
so making it mechanical is a design question and not a bench fix.
