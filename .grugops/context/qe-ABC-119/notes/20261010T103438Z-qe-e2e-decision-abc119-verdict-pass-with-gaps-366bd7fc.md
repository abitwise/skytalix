---
id: 20261010T103438Z-qe-e2e-decision-abc119-verdict-pass-with-gaps-366bd7fc
kind: decision
by: qe-e2e
at: 2026-10-10T10:34:38Z
verified_by:
confidence: high
refs:
  - ABC-119
  - G-06
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - N8-LANE
  - N8-SPAWN
  - NFR-004
  - QE-119-a
  - QE-119-b
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-119-no-test-anywhere-runs-the-delivered-clis-real-engine.md
  - .grugops/context/rule-abc119-a2/notes/20261010T100852Z-ba-pm-decision-9f278676.md
  - .grugops/context/ticket-to-pr-ABC-119-r2/notes/20261010T095834Z-software-engineer-observation-abc119r2-readings-a2-a6-n8lane-904f6a64.md
  - 20261010T103438Z-qe-e2e-observation-abc119-a2-closers-admissible-twice-cpu-straddles-e28c062a
  - 20261010T103438Z-qe-e2e-observation-abc119-mutants-every-a3-a4-row-red-0e132e4a
  - 20261010T103438Z-qe-e2e-observation-abc119-gap-register-b300968a
  - 20261010T103438Z-qe-e2e-artifact-ref-abc119-gates-commands-probe-bc7d8341
supersedes:
---

# `ABC-119` QE verdict: **PASS_WITH_GAPS** at `a6453bc`. The lane plays the real engine, and it reds on mutants the default lane cannot see. `A2`(ii)'s CPU half is met on the closing set but is NOT ROBUST

Hand-authored, no seal. This is a `decision`, not a `finding`, because no `§14-gate` verdict exists on
this install. Task `wave-2026-09-25`, subtask `qe-ABC-119`. Diff under review:
`grugops/wave-2026-09-25...a6453bc` (merge-base `242b624`). Page read AS RULED at `a6453bc`.
QE re-ran every criterion itself. Gates and the deep lane ran in the Engineer's worktree. Every
timing tree and every mutant was built outside the repository (`git archive`, `node_modules` symlinked).
Machine: Apple M3, 8 cores, macOS 26.5.2, node 26.11.0, vitest 3.2.7. Security/NFR was timing
`ABC-127` in parallel, so load1 was 7.7–38.9 and is logged beside every number.

| | reading | result |
|---|---|---|
| `A1` | `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`, three runs: exit 0, 7/7 each. Six children, **3116–3147 ms**, exit 0, signal null. The command and wall are logged verbatim on every run. **P1 probe:** a parent `NODE_OPTIONS=--import=<marker>` reached npx, vitest and its workers (10 hits) and **never the child** (0 hits). Armed control: the same marker on a bare `node src/cli.ts` hits once | **MET** |
| `A2` | Unset: `npm test` 51 files / 1541 tests, exit 0. Skip count `0` (json reporter). `[CLI_DEEP]` lines **0** in `npm test` and in all 66 harness runs. **(i)** inventory delta: base 50/53 → HEAD 51/54, **0** HEAD findings not on base, and the new file is in no finding. **(ii)** three trees, n = 10 per set. **Set A (pre-registered closing): ADMISSIBLE** (twin −0.32 %, sign 5/5): CPU **−0.715 s**, sign 3+/7−; wall **+0.035 s**. **Set B (pre-registered replication): ADMISSIBLE** (twin −0.20 %, sign 5/5): CPU **+0.725 s**, sign 7+/2−; wall **+0.035 s** | **MET as ruled, on the closing set. The CPU half is NOT ROBUST: an equally admissible replication reads over 0.30 s (QE-119-a)** |
| `A3` | (i) green ×3, and **red alone on `M4b`** (an illegal move actually played: `replies` length 0 at `:203`). (ii) 3131–3147 ms ≤ 5000, and **red alone on `M3c`** (5154/5198 ms) **while the default lane stays green**. (iii) green, and red on `M4`. (iv) green, and red on `M5a` (stack on stderr, exit 0) and `M5b` (exit 70). No assertion names a move, score, depth or node count: read in the file | **MET** |
| `A4` | Green ×3. **Red alone on `M6a`** (a rejected line ends the session) and **on `M6b`** (rejected silently, no message) | **MET** |
| `A5` | `-- 'src/' ':!src/*.test.ts'`: empty. `-- src/cli.test.ts AGENTS.md plans/nfr-catalog.md vitest.config.ts`: empty. `-- src/`: `244 0 src/cli.real-engine.test.ts` only. `tools/`, the ADRs and `plans/board.md`: empty | **MET** |
| `A6` | **`M2` re-planted by QE's own runner:** the new lane is RED on `A1` alone (children 141/141 ms). The default lane is **GREEN, 51 files / 1541 tests**, on the same mutant. Line 175 is byte-identical. Control `M0`: deep 7/7 and default 1541/1541 | **MET** |

**Why `_WITH_GAPS`, and why not FAIL:**
- **QE-119-a (MEDIUM).** The CPU half of `A2`(ii) cannot be resolved on this machine under this load.
  - The two admissible sets read −0.715 s and +0.725 s.
  - The identity twin's own bootstrap 95 % CI of the median spans −0.99..+1.57 s and −0.59..+0.92 s. That is wider than the 0.30 s bound in both sets.
  - The admissibility rule tests the twin's median, not its spread, so it admitted both sets.
  - This is a protocol limit, not a defect of the build. Every other estimate puts the file well under the bound: the per-file slope is ~139–160 ms, the Engineer's pooled reading is +115 ms, and the cut read +60 ms.
  - The drift the bound exists to catch (+3.1 s wall) is excluded by both sets by ~90x.
- **`N8-LANE`, in `ADR-0019` decision 5's form:** **−875 ms (set A) / +565 ms (set B) net** of the 160 ms floor. **Both are ≤ 650 ms.**
  - Nothing is subtracted for spawns: 0 children spawn with the variable unset.
  - `NFR-008`'s CPU clause stands as of the last conforming reading: **MET by 60 ms, not robust** (`2c96dbd`). It is not graded here, and these whole-lane figures (/usr/bin/time, `--dir src`, under load) are not a conforming `NFR-008` reading.
- **`N8-SPAWN`:** `T1`/`T2` were not fired. `src/cli.test.ts` is byte-identical (`A5`).
- The rest of the register is LOW/INFO (`…b300968a`). **None is a criterion miss.**

**UAT:** `git diff --name-only <wave>...HEAD | grep -v '\.test\.ts$' | grep '^src/'` printed nothing (rc 1). The
diff carries **0 production lines**, so the 2026-08-17 waiver applies **as measured**. It must be re-measured at the merge.

**The ticket may leave `In Review`.** The board move is the Orchestrator's. QE changed nothing under `src/`, `tools/`,
`plans/board.md`, the ADRs or `AGENTS.md`. Not merged, not pushed. **Merge note (INFO):** a trial `git merge-tree` against the
wave tip `b62d1b6` shows an add/add conflict in the front matter of `ABC-130`'s page (`status`/`column`). The wave's side is the
later one.
