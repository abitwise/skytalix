---
id: 20260818T190000Z-security-nfr-observation-what-this-gate-measured-itself-rather-than-inherited-a1b2c3d4
kind: observation
by: security-nfr
at: 2026-08-18T19:00:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - NFR-004
  - NFR-005
  - NFR-008
  - N8-LANE
  - src/engine.ts
supersedes:
---

# What this gate measured ITSELF rather than inherited — the 5 s breach, the two non-terminating
inputs, a third `A1` reading, and a clean three-condition lane re-measurement

**This is not a stamp.** `context.human_admission` is `off` and no `finding` is admissible on this
install, so this is a hand-authored `observation` per `agent-factory/contracts/context-note.md`.

**Machine: Apple M3 (Mac15,13) / Darwin 25.5.0 arm64 / Node v24.12.0 / vitest 3.2.7.
`UNKNOWN - verify` on any other hardware.** Every number below is mine, taken on branch
`grugops/security-nfr-ABC-078` off `grugops/quality-gate-ABC-078-qe-2026-08-18` @ `d36668b`.

**No repository file was modified to take any of these readings.** The two probes are throwaway
scripts in the session scratchpad that IMPORT `src/engine.ts` and `src/fen.ts`; the lane harness
runs on three OUT-OF-TREE copies. Nothing under `src/` was touched, moved or reverted at any point
— which is a stronger fence than "reverted afterwards" and is why it was done this way.

## 1. The 5 s ceiling — REPRODUCED INDEPENDENTLY, real clock, `kiwipete`

| `budgetMs` in | wall out | `elapsedMs` | depth | over the 5 s ceiling? |
|---|---|---|---|---|
| 3 000 (`DEFAULT_BUDGET_MS`) | 3 006 ms | 3 006 | 4 | no |
| 4 999 | 5 000 ms | 5 000 | 4 | at it |
| 5 000 | **5 002 ms** | 5 002 | 4 | **YES** |
| 6 000 | **6 004 ms** | 6 004 | 4 | **YES** |

QE read 5 003 ms at `budgetMs = 4999`; I read 5 000 ms there and 5 002 ms at 5 000. **The exact
tipping budget moves by a millisecond or two between runs and the structure does not:** there is no
relationship of any kind between `budgetMs` and 5 000 in the delivered code, so elapsed tracks the
budget upward without limit. `budgetMs = 6000` returns at 6 004 ms and `budgetMs = 600000` would
return at ten minutes. **The ceiling holds today only because every caller in existence passes
3 000.**

## 2. The degenerate budgets — all SAFE, exactly as QE reported

`kiwipete`, real clock: `0` → depth 1, 48 nodes, 4 ms; `-1` → depth 1, 48 nodes, 1 ms; `-1e9` →
depth 1, 48 nodes, 1 ms; `NaN` → depth 1, 48 nodes, 1 ms. **A legal move every time, never `null`,
never a throw.** Reproduced to the node count.

## 3. The two NON-TERMINATING inputs — reproduced, in child processes with a hard timeout

| input | result |
|---|---|
| `chooseMove(kiwipete, { budgetMs: Infinity })` | **still running at 20 s**, killed by `timeout` (exit 124) |
| `chooseMove(kiwipete, { budgetMs: 1, now: () => 0 })` (a clock that never advances) | **still running at 12 s**, killed by `timeout` (exit 124) |

The failure mode is a **CPU spin on the calling thread**: the deepening loop's only exit is the
clock, and neither input ever lets `now() >= deadline` become true. It is not a leak and not a
crash — the process stays healthy and never returns. Adjudicated in the security note; recorded
here as a measurement.

## 4. `A1` and `NFR-005`, a THIRD independent reading of the deep lane

`ENGINE_DEEP=1 vitest run src/engine.test.ts`, out-of-tree copy of the delivered tree, 99.1 s,
23/23 passed:

```
A1 worst case: kiwipete 3031 ms at completed depth 4; over 3 s: 27/30
NFR-005 kiwipete: completed depth 4, 88112 nodes, 3030 ms
NFR-005 position-6: completed depth 3, 91182 nodes, 3005 ms
A2 real clock: 74 ms at completed depth 2
```

**Three hops, three DIFFERENT worst-case positions, three worst-case numbers inside 4 ms:**

| hop | worst case | position | over 3 s |
|---|---|---|---|
| engineer | 3 027 ms | `position-4/f3d4` | 29/30 |
| QE | 3 030 ms | `position-5/b1c3` | 29/30 |
| **this gate** | **3 031 ms** | **`kiwipete`** | **27/30** |

**The position is noise and the number is not.** That is a machine-wide granularity floor, and it
is now confirmed by three independent routes: the constant sweep (QE), the instrumented check site
(QE), and three worst-case readings that move position but not magnitude. **The overshoot is
≤ 31 ms = 1.03% of the budget in the worst reading anyone has taken.**

`NFR-005` reproduces at depth 4 / depth 3, below the row's depth-6 FAIL floor. Ruled in its own
note.

## 5. `N8-LANE` — RE-MEASURED CLEANLY, three conditions, to the bar's own protocol

The engineer could not take this under the bar's protocol (six sibling worktrees inside the shared
checkout). **This gate could**, and here is why the conditions are different rather than merely
newer: the measurement ran on **three out-of-tree copies** of the delivered tree, so no sibling
worktree is inside any measured tree, and `.claude/worktrees/` does not exist in any of them. The
machine's 1-min load average was **2.92 at the start** (8 cores) against the engineer's six live
sibling builds.

- **A** = the delivered tree, 36 test files / 1 016 tests
- **B** = the same tree with `src/engine.test.ts` removed, 35 files / 999 tests — **the lane as it
  stood BEFORE this ticket**
- **C** = a `diff -r`-verified byte-identical twin of A — **the identity null control the bar
  requires**

Protocol as written in `N8-LANE`: CPU (user + sys), one fresh OS process per run, condition order
rotated every round, **9 rounds with round 0 discarded (n = 8)**, every run asserting its own test
FILE count and test count (27 of 27 usable runs matched their label; 0 harness errors).

```
paired per-round CPU deltas, seconds        A-B (this ticket's file)     C-A (identity null)
round 1                                            +0.88                     -0.09
round 2                                            +0.87                     -0.10
round 3                                            +0.89                     +0.15
round 4                                            +1.94                     -0.22
round 5                                            +1.11                     -0.04
round 6                                            +0.86                     +0.23
round 7                                            +1.39                     -0.12
round 8                                            +1.40                     -0.68
MEDIAN                                          +1.00 s                   -0.095 s = -0.66%
SIGN                                               8/8                        2/8 positive
```

**The null control reads −0.66% CPU with its sign at chance — inside the bar's ≤ 1.5% admissibility
clause. The reading is ADMISSIBLE.**

```
condition medians, n = 8                     CPU (user+sys)        WALL
A  delivered tree,      36 files               14.635 s          2.935 s
B  without engine.test.ts, 35 files            13.400 s          2.805 s
C  identity twin of A,  36 files               14.540 s          2.960 s
```

**Both halves of the reading, and they are separate facts:**

1. **`src/engine.test.ts` costs +1 000 ms CPU gross** (median of paired deltas, n = 8, sign 8/8,
   spread 860–1 940 ms). **Net of the 160 ms per-file floor for the one file it adds: ~840 ms**
   against `N8-LANE`'s 650 ms. **Nothing is chargeable to `N8-SPAWN`** — `src/engine.test.ts`
   spawns no child process and no criterion of `ABC-078` forces one.
2. **Condition B — the lane WITHOUT this ticket — already medians 13.400 s CPU against
   `NFR-008`'s 13 s clause.** The wall clause is met on both conditions (2.805 s / 2.935 s against
   3 s) and has almost no room left either.

**What this reading does NOT establish, stated because the absolutes matter less than they look.**
The all-in cost per file here is 13.400/35 = **383 ms**, against the **341 ms** the ratified
2026-08-13 reading measured post-`threads` at 28 files. Some of that 12% is content and some is
this machine's state; **a fraction of my absolute totals is load inflation and I cannot separate
the two.** The **paired deltas are the robust part** — that is what the bar is written on, and it
is why the bar is written on paired deltas. `node_modules` was symlinked from the repository root
into each copy, the same disclosed deviation every prior lane reading on this project carries.
`AGENTS.md` was copied into each condition because `src/cli.test.ts` reads it (without it, 5 tests
in that one file fail on `ENOENT` — an artifact of copying, not a defect).
