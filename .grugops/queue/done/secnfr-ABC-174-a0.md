---
subtask: secnfr-ABC-174-a0
role: security-nfr
tickets: [ABC-175, ABC-174]
branch: grugops/ABC-174 @ f6b63c1c (QE-passed src at be6a5599; f6b63c1c adds AGENTS.md only); worktree ../wt-ABC-174
ref: .grugops/context/secnfr-ABC-174-a0/
width: 1 (nothing else in flight; Orchestrator holds width 1 until this ends)
---

# A0 re-take on the ABC-175 run tree (width 1)

Owner word 2026-10-20: "start A0 re-run".

## Read first
- `plans/tickets/ABC-175-*.md` (A1, § Order with ABC-173, Dependencies).
- The A0 reading in force: `.grugops/queue/done/secnfr-ABC-146-a0.md` and its decision `…f1558f02` (§ Staleness inputs; workload `…70684a78`; pre-registration `…107ff1bf`).
- ADR-0038 (route V / N), ADR-0045 D6.5, ADR-0008 addendum (ABC-173 cap, now on the tree).

## Do
0. **Pre-step (owed before merge, not timing):** one default-lane `npm test` run on `f6b63c1c`, exactly as `AGENTS.md` spells it, to check the AGENTS.md guard rows (ABC-065/109/059) after the Scribe edit. Report count and `last-run.json` success. Red → stop and report; do not fix.
1. **Re-take A0 on the run tree** at `f6b63c1c`, the same way as `…f1558f02`: pre-register before the first graded run; same workload and pairing (5 interleaved pairs, vitest arm = the tree's `vitest.config.ts` unedited, now carrying ABC-173's heap cap); node counts equal across arms; ratios, median F, F_hi; route V (F_hi ≤ 1.30) or N.
2. Record the new staleness inputs at `f6b63c1c`: `vitest.config.ts` and `src/ladder.test.ts` md5, `node --version`, `npx vitest --version`, and the commit that A1's stale-list diff will compare against.
3. Run A1's own stale-list command against your new A0 commit and show it prints nothing.

## Window
Graded pairs only in a foreground-verified quiet window: 180 s with no foreign vitest, no `oeselg-labs/platform` process, nothing else of ours. Record load1, `ps -u $(id -u) | wc -l`, power source (AC/battery), thermal state. If no window opens in a reasonable time, stop with A0 **OWED**; never estimate.

## Fences
- Work in `../wt-ABC-174`, or a scratch detached worktree `../wt-a0-ABC-174` at `f6b63c1c` (remove at the end). Commit the A0 records (notes/probe/raw only) on a scratch branch or leave them under `ref:` on main uncommitted — **no `src/`, no `tools/`, no AGENTS.md lines**, and do not move `grugops/ABC-174`'s tip unless records-only and you say so.
- Do not start the ABC-175 verdict run (the Orchestrator's, overnight, owner's slot).
- Do not touch `plans/board.md`, `plans/traceability.md`, `plans/nfr-catalog.md`, or any process you did not start. Keep forks low. Never push or merge.

## Publish
Notes under `ref:` (pre-registration + `kind: decision` by `security-nfr`); sanctioned writer if available, else hand-authored and say so.
`.grugops/queue/done/secnfr-ABC-174-a0.md` (brief + `## Result`) and `.claim.md`, uncommitted: pre-step result, route, F/F_hi, node counts, window data, new staleness inputs, the A0 commit for A1, trace row.

## Result

**done_at 2026-10-19T22:37Z. A0 READ, ROUTE V. `F_hi` 1.047 ≤ 1.30. Pre-step GREEN.** The records are on the scratch
branch **`grugops/secnfr-ABC-174-a0`**, three commits on `f6b63c1c`, all of them records only:

- `44bf7066` is the pre-registration;
- `1393ddda` is re-registration r2, made before any graded set;
- `ed88329c` is the reading.

The branch is not pushed and not merged. The notes are hand-authored and unsealed, because there is no sanctioned
writer on this install. `grugops/ABC-174` was not moved. The scratch worktree `../wt-a0-ABC-174` was removed, and the
branch is kept.

### Pre-step (`npm test` on `f6b63c1c`, `../wt-ABC-174`, as `AGENTS.md` spells it)

- **Exit 0.** **59 files, 1987/1987 passed.** vitest `Duration` 9.64 s, and `time` real 10.16 s. The wall figure is
  supplementary, ungraded and twinless, so it is no `NFR-008` reading.
- `.test-results/last-run.json`: `success: true`, `numTotalTests` 1987, 0 failed, 0 pending, 59 `testResults`,
  start 22:18:37Z.
- **The `AGENTS.md` guard rows after the Scribe edit are green.** All are in `src/cli.test.ts`: `ABC-065` 4/4,
  `ABC-109` 1/1 and `ABC-059` 1/1 passed.

### A0 re-take

- **Workload and pairing as in `…f1558f02`.** The call is `chooseMove(start, 4000 ms, virtualClock(120))`, one per
  fresh process, with no warm-up. The graded wall is the in-process call. There are 5 interleaved pairs, with odd
  pairs running node first.
  - The vitest arm uses the tree's `vitest.config.ts`, unedited, with the probe directory as `--root`.
- **Two changes were forced by `ABC-173`, both pre-registered.**
  - **C1:** the vitest arm carries `NODE_OPTIONS=--max-old-space-size=400` (ONE-FILE). Without it, the guard refuses
    the run.
  - **C2:** `probe/tools/grugops/heap-guard.js` is a symlink to the tree's guard, because vitest resolves
    `globalSetup` against `--root`.
- **Two changes came from the brief.** **C3** makes "foreign" include anything naming this repo or its worktrees.
  **C4** sets a 540 s window deadline, after which the driver logs `owed` and never estimates.
- **The node arm is unchanged.** Its heap stays at 4192 MiB, against vitest's 496 MiB.
- **10/10 node counts are equal: 29 717.** All read depth 5, score 55 and digest `398995d95a12e6e6`, the same as
  `…f1558f02`.
- **Ratios (vitest ÷ node): 1.047, 0.957, 0.978, 0.988, 0.975.** **Median `F` 0.978. `F_hi` 1.047 ≤ 1.30, so the
  route is V**, unchanged from `ADR-0038` addendum 2.

### Window

- **Invocation 1** ran from 22:21:28Z to 22:30:29Z. It is **OWED, and no set started**: iTerm's
  `pidinfo --git-state …/cli-chess-example` helper kept matching C3. It is logged.
- **Re-registration r2 (`1393ddda`)** was made before any graded set. It excludes only that terminal helper.
- **Invocation 2, attempt 1, was graded.** The quiet gate held from 22:31:39.9Z. The set ran from **22:34:42.2Z to
  22:34:49.9Z**. There were 0 voided sets and 0 foreign sightings before, during, after or at set end.
- **Foreground checks were clean** at 22:31:32Z and 22:35:13Z: no vitest, no `oeselg-labs/platform` process and
  nothing else of ours.
- **load1:** 1.80 (pairs 1–3) and 1.74 (pairs 4–5).
- **`ps -u $(id -u) | wc -l`:** 444 at set start and 448 at set end. The fg checks read 456 and 445. The limit is
  2666.
- **Power:** **AC Power on every run.** `ABC-146`'s `A0` was on battery. The host had switched to AC by 22:21Z.
- **Thermal pressure:** level **0** before and after every run.
- **Host:** Apple M3, Mac15,13.

### New staleness inputs at `f6b63c1c` (A0 in force; supersedes `…f1558f02`)

| input | value |
|---|---|
| `vitest.config.ts` md5 | **`326bc5ca578a29c48102e0192b4bfe5a`** (`ABC-173` `globalSetup` heap-guard, `affee860`) |
| `src/ladder.test.ts` md5 | **`bba67b75565b4f4a2e8d231e8bcd6b2e`** (unchanged, 17 verdict rows) |
| `package.json` md5 | `9e31cec4a1681ff1361333546e8158ed` |
| `package-lock.json` md5 | `ed7a5b0c455a3cc59fd76a686192c7b8` |
| `node --version` | **v26.11.1** |
| `npx vitest --version` | **`vitest/4.1.11 darwin-arm64 node-v26.11.1`** |

- **The A0 commit for `ABC-175` `A1` is `ed88329c`** (`ed88329c490f47a46bfba60c07b1c3813734b7e3`, on
  `grugops/secnfr-ABC-174-a0`). Its tree differs from `f6b63c1c` only under `.grugops/context/secnfr-ABC-174-a0/`.
  So **`f6b63c1c` is equivalent for `A1`**. Use it if the scratch branch is not kept.
- **`A1`'s stale-list, run in `../wt-ABC-174` (HEAD `f6b63c1c`) against `ed88329c`, printed nothing** (exit 0).
  In the same tree, the md5s and versions match the table, and `git status --porcelain -- src` is empty.
- **Fence check.** `git diff --name-only f6b63c1c ed88329c -- src/ tools/ AGENTS.md vitest.config.ts package.json package-lock.json`
  prints nothing.

### Observation for the Orchestrator (blocks the night as written; not mine to fix)

- **`ABC-175`'s verdict command and its `A1` `-t "3v4"` probe have no `NODE_OPTIONS=--max-old-space-size=400`.**
  - The same command appears in `ABC-175` § Scope 2 and `A1`, `ADR-0045` D6.3, and `ADR-0038` addendum 2.
  - On this tree, `ABC-173`'s heap guard refuses an unprefixed one-file run. It exits 1 and runs no test. This hop
    read that on the `A0` smoke.
  - Probable form:
    `caffeinate -i env LADDER_DEEP=verdict NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts --reporter=verbose`.
  - **Whether 180 verdict games fit in 496 MiB is `UNKNOWN - verify`.** An out-of-memory error goes to the owner
    (`ABC-173` Q4).
  - The owners of the fix are BA/PM (the ticket) and Architect/Design (the ADR text).
  - Note `…e4b8d062`.

### Notes (on `grugops/secnfr-ABC-174-a0`, under `.grugops/context/secnfr-ABC-174-a0/`)

- `notes/20261019T222100Z-…-preregistration-workload-n5-route-rule-5d2e7a41.md` (decision, `44bf7066`)
- `notes/20261019T223300Z-…-preregistration-r2-iterm-helper-not-foreign-9b41c6e3.md` (decision, supersedes
  `…5d2e7a41`, `1393ddda`)
- `notes/20261019T223600Z-…-retake-reading-fhi-1047-route-v-c7a3e915.md` (decision, supersedes `…f1558f02`,
  `ed88329c`)
- `notes/20261019T223700Z-…-observation-abc175-verdict-command-lacks-heap-prefix-refused-by-guard-e4b8d062.md`
  (observation, `ed88329c`)
- `probe/` (the driver, the workload, both arms and the guard symlink), and `probe/raw/a0.jsonl.txt` and
  `a0.summary.json`

### Not done, by the brief

- The `ABC-175` verdict run was not started.
- Nothing was pushed or merged.
- `src/`, `tools/`, `AGENTS.md` and `plans/` were not edited, and neither were `plans/board.md`,
  `plans/traceability.md` and `plans/nfr-catalog.md`.
- No process I did not start was touched.

### Trace row (for the Orchestrator to append to `plans/traceability.md`)

| ABC-175 / ABC-174 | A0 re-take (ABC-146 rule) | secnfr-ABC-174-a0 | probe on `f6b63c1c` (records `ed88329c`, branch `grugops/secnfr-ABC-174-a0`) | 10/10 nodes 29 717; F 0.978, F_hi 1.047 ≤ 1.30 → **route V**; vitest arm under ABC-173 cap (496 MiB) | pre-step `npm test` 1987/1987, `last-run.json` success; A1 stale-list vs `ed88329c` empty | A0 in force (supersedes `…f1558f02`); verdict NOT started; heap-prefix observation `…e4b8d062` open |
