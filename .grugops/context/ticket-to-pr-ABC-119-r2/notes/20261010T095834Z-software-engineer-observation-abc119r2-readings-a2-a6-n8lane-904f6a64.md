---
id: 20261010T095834Z-software-engineer-observation-abc119r2-readings-a2-a6-n8lane-904f6a64
kind: observation
by: software-engineer
at: 2026-10-10T09:58:34Z
verified_by:
confidence: medium
refs:
  - ABC-119
  - A1
  - A2
  - A3
  - A4
  - A6
  - N8-LANE
  - N8-SPAWN
  - NFR-004
  - NFR-008
  - ADR-0019
  - src/cli.real-engine.test.ts
supersedes:
---

# `ABC-119` r2 readings: the lane is green on the tip and RED on a mutant the default lane cannot see. `A2`'s paired bound is noise-dominated under load, so it is not cleanly met

Hand-authored, no seal. Machine: Apple M3, macOS 25.5, node 26.11.0, vitest 3.2.7. Security/NFR was running `ABC-127` timing runs in
parallel, so load1 is beside every reading. The raw files are beside this note (`raw-*`).

## The lane's own reading (`A1`, `A3`, `A4`)

`CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`: exit 0, **7 passed** (1 default + 6 deep).

| run | load1 | `played` wall | `rejected` wall | lane |
|---|---|---|---|---|
| worktree, `d45ca68` | ~3.5 | 3105 ms, exit 0 | 3099 ms, exit 0 | 6.37 s |
| scratch copy of `d45ca68` | 11.6 | 3098 ms, exit 0 | 3108 ms, exit 0 | 6.2 s |

- **`A1`.** ≥ 1000 ms and exit 0 on both children. The command is logged verbatim on every run (`[CLI_DEEP] <node> <repo>/src/cli.ts --colour black --ascii <<< …`).
- **`A3`.**
  - (ii): 3098–3105 ms against the 5000 ms bound, ~1.9 s of headroom.
  - (i), (iii) and (iv): green.
- **`A4`.** Green.
- **Unset:** 1 test, 1 ms, no `[CLI_DEEP]` line.

## `A2` — default lane, skip count, spawn count, inventory, paired cost

- **Green.** `npm test` gave 51 files / 1541 tests, exit 0. The base is 50 / 1540.
- **Skip count `0`.** `test-skip-integrity.js … --skip-count 0` printed `No findings.`
- **Spawned children: 0.**
  - By construction: the one `spawnSync` is reached only from a `beforeAll` inside `if (RUN_DEEP)`.
  - Observed: across all 21 head-tree default-lane runs below (42 runs in total), the `[CLI_DEEP]` line count was 0.
- **`lane-inventory.js`: exit 1, with the new file tracked and collected.** The premise moved and the mismatch is pre-existing. See
  `…b7edc319`.
- **Paired runs.**
  - Setup: `node node_modules/vitest/vitest.mjs run --dir src`, `/usr/bin/time -p`, CPU = user + sys. Both trees were
    `git archive` copies in the session scratchpad, outside the repository, with `node_modules` symlinked.
  - Order: interleaved and alternating per round, with the warm-up round discarded.

| set | rounds | load1 | wall median | wall sign + | CPU median | CPU sign + |
|---|---|---|---|---|---|---|
| 1 | 5 | 6.3–19.5 | **+0.03 s** | 3/5 | **+0.13 s** | 3/5 |
| 2 | 5 | 18.6–25.6 | +0.17 s | 3/5 | **+0.79 s** | 4/5 |
| 3 | 8 | 13.0–16.6 | −0.08 s | 4/8 | −0.17 s | 3/8 |
| pooled | 18 | 6.3–25.6 | **+0.02 s** | 10/18 | **+0.115 s** | 10/18 |

**Read against `A2`.**
- Set 1 and set 3 have both medians ≤ 0.30 s.
- **Set 2's CPU median (+0.79 s) breaches** the bound. Its per-round CPU deltas run from −0.05 to +1.81 s, under load1 up to 25.6.
- **The sign rule (≥ 4 of 5 agreeing) is met by no wall reading in any set.**
- The effect is smaller than this machine's paired noise under this load.
- The page's discipline applies: **this hop's numbers are recorded, and the disagreement is written down.** Read at the cut for this
  shape: +0.09 s wall / +0.06 s CPU.
- **I do not claim `A2`'s paired clause MET.** It needs a quieter re-run (QE hop or Security/NFR).
- **Supporting, not a substitute.** The file alone collects in 69–70 ms and transforms in 61–66 ms. That is consistent with
  `vitest.config.ts`'s recorded slope of ~139 ms CPU per file.

## `N8-LANE`, in `ADR-0019` decision 5's form

- **Pooled +115 ms CPU (n = 18). The set medians are +130 / +790 / −170 ms.**
- Against the 650 ms per-ticket bound:
  - set 1 and set 3 are inside it;
  - **set 2 exceeds it**;
  - the pooled median is inside it.
- **Not cleanly read. The task's `N8-LANE > 650 ms — STOP` fires on set 2 alone.** It is recorded here for the Orchestrator and Security/NFR,
  not ruled by me.
- `NFR-008` clause state from the last conforming reading: CPU **MET by 60 ms, not robust** (`2c96dbd`). `ADR-0019`
  Consequences expects a new test file to re-breach. This hop's whole-lane CPU readings (24.0–28.4 s, base and head alike, under
  load) were taken with a different instrument (`/usr/bin/time`, `--dir src`, under load). **They are not a conforming `NFR-008` reading,
  and I grade nothing.**
- **`N8-SPAWN`: `T1` and `T2` not fired.** The default lane spawns 0 new children, and `src/cli.test.ts` is byte-identical (`A5`).

## `A6` — watched RED and GREEN on the same mutant

- **Setup.** Scratch copies of `d45ca68` outside the repository, with `node_modules` symlinked. Diffs:
  `raw-a6-mutants.diff.txt`. Line 175 is byte-identical in both, so `:2512`'s regex matches.
- **Unmutated copy:** deep 7/7 green, children 3098 / 3108 ms.

| mutant | what changes in `src/cli.ts` | new lane (`CLI_DEEP=1`) | default lane (`--dir src`) |
|---|---|---|---|
| **M2** — `budgetMs: DEFAULT_BUDGET_MS` no longer the merged budget | import line: `DEFAULT_BUDGET_MS` rebound to `undefined` | **RED**: `A1` fails, children 120 / 128 ms. 1 failed / 6 passed | **GREEN**: 51 files / 1541 tests |
| **M1** — the composition reverted to a double | import line: `createEngine` rebound to a first-legal double | **RED**: `A1` fails, children 114 / 117 ms | **RED**: 6 rows in `src/cli.test.ts` (`ABC-043` `A2`/`A5`/`A7`, `ABC-044` `A6`/`A3`, `ABC-045` `A4`). Their hooks substitute `engine.ts`, and this double bypasses that module |

**M2 is the watched pair the page asks for:** the new lane goes RED and the default lane stays GREEN on the same mutant.

**M1 is reported as it read:** the default lane already catches a double wired this way. It is not evidence for the second half.

**Only the `A1` floor reds either mutant.** `A3`(i)–(iv) and `A4` stay green, because the double or depth-1 reply is still legal
and still advances. That is the page's own risk analysis: the floor is the defence.

The mutant copies were never in the repository. `git status --porcelain -- src/` in the worktree is empty apart from
the committed file.
