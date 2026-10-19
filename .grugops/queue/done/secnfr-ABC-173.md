---
subtask: secnfr-ABC-173
role: security-nfr
ticket: ABC-173
page: plans/tickets/ABC-173-cap-vitest-at-two-cores-and-a-two-gb-heap-ceiling-that-every-lane-applies.md
branch: grugops/ABC-173 @ 9c97dd23 (from 68bbf33f; read-only, not committed to)
ref: .grugops/context/secnfr-ABC-173/
done_at: 2026-10-19T15:23:00Z
result: PASS_WITH_RISKS. No required fix. A9 and N8-LANE OWED (two foreground 180 s windows foreign 362/362 polls, platform pids 40997/50110); merge may carry them as R-173-1 / R-173-2 (LOW) on Olger Oeselg's word only. RISK-ABC173-TEARDOWN / -STATE / -PUZZLE acceptable, LOW, owners named. New SEC-173-1 (LOW, test integrity), plus SEC-173-2 and -3 (INFO). NFR-010 row and NFR-008 heap clause text written, not applied. Nothing pushed, merged or committed.
---

# Security/NFR ABC-173 (lean)

Config: `asvs_level` L1, `block_on` high, `compliance_regime` []. The notes are hand-authored and unsealed, under
`.grugops/context/secnfr-ABC-173/notes/`, because `scripts/context-io.ts` is absent. The decision is `…53a6434a`.
Probes are in `.grugops/context/secnfr-ABC-173/probe/`: `window.mjs`, `window1.out`, `window2.out`, `token-fuzz.mjs`,
`token-fuzz.out`, `node-flags.out` and `skipzero.out`.

## Rulings

1. **Triggers: capability. No new limb** (`…b5ebba6c` §1).
   - `heap-guard.js` imports `node:v8` and `node:worker_threads` and nothing else. Its only effects are `throw` and
     `project.provide("heapRowMiB", row)`. It does no fs, no env write, no re-exec and no network.
   - The test additions use fs reads of `AGENTS.md`, `package.json` and the test sources, a `typescript` load via
     `createRequire`, and two `process.execPath` children with fixed `-e` literals, array argv, no shell and a
     timeout. All of these were already present in base `src/cli.test.ts` / `src/cli.real-engine.test.ts`.
   - The `child_process` lines in the diff are parsed fixture strings. They are never executed.
   - Repo JS already ran in vitest's main process before this change: `result-file-reporter.js`.
2. **Triggers: `NODE_OPTIONS` injection. Not possible; `V1.2.5` and `V2.2.1` (L1) are met** (`…b5ebba6c` §2).
   - `heapToken()` returns exactly `--max-old-space-size=[0-9]+`. With no match it throws.
   - Shown two ways:
     - by reading the regex, `/(?:^|\s)(--max-old-space-size=\d+)(?=\s|$)/g` then `.at(-1).trim()`;
     - by fuzz: 200,016 strings, 567 tokens, **0 unsafe**. `;--import=`, `$(…)`, `12a`, Unicode digits and quoted
       forms all give no token.
   - The token crosses as one argv element before the entry point, with no shell and `env: {}`. `NODE_OPTIONS`
     itself never reaches the child, so a sibling `--import=` is dropped.
3. **Catalog.** The text is below. It is not applied, and `plans/nfr-catalog.md` is untouched. The next free id is
   `NFR-010` (0 hits). Flagged, not drafted: the `NFR-008` declaration still reads Node v26.11.0 / vitest 3.2.7, while
   the live stack is v26.11.1 / 4.1.11 (`…bec09225` §C).
4. **A9 and N8-LANE: OWED. Nothing was timed or estimated** (`…f6b9071f`).
   - **Window 1:** 15:07:37Z, 180 s, 181/181 polls foreign.
   - **Window 2:** 15:13:08Z, 180 s, 181/181 polls foreign.
   - Both times the foreign processes were the two `oeselg-labs/platform/…/dist/main-worker.js` processes (pids 40997
     and 50110), which I did not touch. load1 ran 1.70–2.85.
   - With QE's two windows, that makes 724 foreign polls out of 724 on this ticket.
5. **Can merge carry them? Yes, as R-173-1 (`A9`) and R-173-2 (`N8-LANE`), LOW, on Olger Oeselg's word only.**
   - **Why it must be his word:** the addendum he accepted orders both readings before merge.
   - **Why it is safe:**
     - the arms are fixed trees (`git archive 68bbf33f` for base/twin, `9c97dd23` for head), so a later window
       reads the same charge;
     - under his Q4 the cap does not give way on a breach, so the reading cannot reverse the merge;
     - the cost is local only.
   - **Stated plainly:** unlike R-167-2 and R-171-1, this delta is lane-wide. Every isolate drops from 4192 MiB to
     224 MiB, there is +1 child, and there are TypeScript-parser scans of every test file. So both quantities are
     `UNKNOWN - verify`.
   - **Discharge:** QE's staged harness, with the head arm re-archived at `9c97dd23` (it was `840ebbf7`). Same 5-file
     narrow set.
   - Do not read it on a combined `ABC-171` + `ABC-173` tree.
6. **QE-173-g is required and cannot be carried by word.** Whichever of `ABC-171` / `ABC-173` merges second re-runs
   every `AGENTS.md` lane, as spelled, on the combined tree before it merges. That is counts and OOM, no timing.

## NFR-010 row (verbatim; for the router to apply at merge)

```
| NFR-010 | Resource / memory | **Test-lane V8 heap ceiling: every vitest run keeps Σ `heap_size_limit` ≤ 2048 MiB over the Node isolates it has live at once, at its shape's peak concurrency.** Placed by Security/NFR (task `wave-2026-09-25`, subtask `secnfr-ABC-173`) from `ADR-0008` § ADDENDUM 2026-10-19 (Architect/Design; ACCEPTED by the owner 2026-10-19, `…9f3b6e20`), on the owner's word, verbatim: *"vitest needs to be capped to max 2 cpu cores and 2GB of memory"* (Olger Oeselg, 2026-10-19, `…c4a8e1f6`; Q1–Q4 `…e7d2a915`). **Two shapes, chosen by the run's resolved test-file count. SUITE (2 or more files):** flag `--max-old-space-size=128` → **224 MiB** per isolate × **9** live: the `run-bounded.js` wrapper (`npm test` only), the vitest main process, 2 workers running a file, **2 workers still terminating (an observed reserve; vitest 4.1.11 sets no bound)** and 3 Node children = **2016 MiB**. **ONE-FILE (exactly 1 file):** flag `--max-old-space-size=400` → **496 MiB** × **4** live (main, 1 worker, 2 Node children) = **1984 MiB**. **0 files: refused**, because the guard cannot look. **The value gated is `heap_size_limit` as read, not the flag** (on Node v26.11.1 the limit is the flag + 96 MiB). **Not counted (the owner's Q1):** the lane's own `npm`/`npx` client; non-Node children (`git`, `sh`, `head`); and **RSS, which is reported, not gated** (macOS has no cgroups). **Any isolate over its row, or Σ over 2048 MiB at a shape's peak = FAIL.** A lane that runs out of memory under its row goes to the owner. No row is raised without his word (Q4). **CPU is not this row's:** `maxWorkers: 2` (`ABC-144` `A7`; the addendum's Ruling 4). **Owners:** the level (2048 MiB) is Olger Oeselg's; the table (rows and counts) is Architect/Design's; this row is Security/NFR's. | Every vitest run in this repository: `npm test`, `npm run test:watch`, and every vitest command line in `AGENTS.md` (each `*_DEEP` lane, the single-file line, both coverage lines, the skip-count capture). The limit is set on the command as `NODE_OPTIONS=--max-old-space-size=<flag>`. `CLI_DEEP`'s empty-environment children get the lane's last `--max-old-space-size=<digits>` token in argv, before the entry point. **Not** `lint`, `typecheck`, `build`, `npm run chess` or `perft`, which keep Node's default. | **(a) Main process:** `tools/grugops/heap-guard.js`, the vitest `globalSetup`, reads `v8.getHeapStatistics().heap_size_limit` in the main process. Above the shape's row it throws, so the run exits 1 and no test runs. It hands the admitted row to the workers as `inject("heapRowMiB")`. **(b) Worker:** `src/cli.test.ts` `ABC-173` `A4` (`isMainThread` is false; limit ≤ row). **(c) Children:** `A6` `heapProbe` through `childOf`, the `A6 (static)` row, and the `CLI_DEEP` `A6` probe in `src/cli.real-engine.test.ts`. **(d) Commands and values:** `A3` checks that every `AGENTS.md` vitest line carries its shape's flag, equal to `FLAGS_MIB`. `ABC-042` `A10` pins `scripts.test` and `test:watch` byte for byte. The `A5` rows pin `ROWS_MIB`, `FLAGS_MIB`, both sums, the shape choice and the comparison (`9c97dd23`). **Each verifier was watched red:** QE `…3d7a91c4` (54 mutants) and the fix at `9c97dd23` (18/18 killed). **The live-isolate counts are an observation:** at most 4 live workers in 3 of 3 censuses (Architect 2, SE 1), which is the 2-worker reserve exactly (`RISK-ABC173-TEARDOWN`). The shape read rests on `vitest.state.getPaths()`, a public getter not documented as stable (`RISK-ABC173-STATE`; re-read at any vitest version change). **Status: MET at `ABC-173`'s tip `9c97dd23` on the counts and limits read, M3 reference, Node v26.11.1, vitest 4.1.11. `UNKNOWN - verify` on any other Node version (the flag-to-limit offset was read only on v26.11.1) and off macOS.** The row binds from `ABC-173`'s merge. |
```

## NFR-008 heap clause (verbatim)

Insert it in the `NFR-008` Target cell, right after the sentence ending `… / Node v26.11.0 / vitest 3.2.7. v24.12.0 is
no longer installed on this machine; figures taken on it are history.**`:

```
**Heap clause, from `ABC-173`'s merge (`ADR-0008` § ADDENDUM 2026-10-19 Ruling 5; `NFR-010`): the declared stack also fixes the V8 heap per isolate at 224 MiB (SUITE) / 496 MiB (ONE-FILE), set as `NODE_OPTIONS=--max-old-space-size=128` / `=400` on the lane command and refused at run start without it. `npm test` is the SUITE shape. Every `NFR-008` and `N8-LANE` arm runs its set's `AGENTS.md` form, prefix included. A reading taken before that merge is pre-cap: it is labelled pre-cap and not re-read (forward-only, the `ADR-0035` D4 shape). The full-lane `F` (1.72 s CPU / 3.25 s wall) stays, labelled pre-cap, until the first capped full-lane twin R replaces it outright. Each per-set `F` stays until that set's first capped reading replaces it.**
```

## A9 / N8-LANE

| reading | state | window evidence | carry |
|---|---|---|---|
| `A9`: `npm test` wall ≤ 10 s at load1 ≤ 8, CPU reported, with a twin | **OWED** | `probe/window1.out`, `probe/window2.out`: 181/181 foreign each | R-173-1, LOW, owner Olger Oeselg (his word owed) |
| `N8-LANE`: 5-file narrow set; base `68bbf33f` on the old command, head `9c97dd23` on the new; bound 650 ms CPU | **OWED** | same | R-173-2, LOW, owner Olger Oeselg (his word owed) |

## Accepted risks (each needs its owner to take it; this hop takes none)

| id | severity | ruling | owner | trigger / discharge |
|---|---|---|---|---|
| R-173-1 | LOW | `A9` owed; carriable | Olger Oeselg | first admissible quiet-window `A9` with a twin, on `9c97dd23` |
| R-173-2 | LOW | `N8-LANE` owed; carriable | Olger Oeselg | first admissible quiet-window reading, arms `68bbf33f` / `9c97dd23` |
| RISK-ABC173-TEARDOWN | LOW | **acceptable.** At most 4 live workers in 3/3 censuses, exactly the reserve. The row bounds limits, not use (SUITE peak `heapUsed` 109 MiB of 224) | Architect/Design | a census over 4, or a vitest bump, goes to the owner |
| RISK-ABC173-STATE | LOW | **acceptable.** Fails closed on a missing API, a non-array result or 0 files. Residual: an under-counting `getPaths` would admit a SUITE run at flag 400 (4464 MiB), but only on a mistyped command, since `A3`/`A10` keep spelled SUITE lines at 128 | Security/NFR | at any vitest version change, re-read `getPaths().length` (1 / 5 / 59) before the bump merges |
| RISK-ABC173-PUZZLE | LOW | **acceptable.** Red at 224, green at 256+, row 496, sampled worker peak 198 MiB. Correction to the addendum's wording: a SUITE-shape `PUZZLE_DEEP=1 npm test` is admitted at 224 and should go red loudly (not refused; `UNKNOWN - verify`, not re-run) | Security/NFR (row); a re-level is Olger Oeselg's | a red at 496, or any OOM, goes to the owner |
| SEC-173-1 (propose `RISK-ABC173-SKIPZERO`) | LOW (test integrity, not ASVS) | **new.** The skip-count capture typed without its prefix prints `0`, exit 0, on a refused run (`numTotalTests` 0, `success` false). 24 `.grugops/` files quote that old form. Same class as `QE-173-d` and the line's own "0 with no tests" | Olger Oeselg to accept, or a follow-up ticket | until then, read `numTotalTests > 0` alongside a skip count |
| SEC-173-2 | INFO | a mixed-spelling `NODE_OPTIONS` gives main 196 MiB and a `CLI_DEEP` child 4096 MiB, and the `CLI_DEEP` `A6` probe reds | none | none |
| SEC-173-3 | INFO | `npm test` replaces a caller's `NODE_OPTIONS`, which narrows what a run carries; the script form is POSIX-only (Windows out of scope) | none | none |

QE gaps `QE-173-c`, `-d`, `-e` and `-f`: I concur with QE's routes. `QE-173-g` is required at the second merge (ruling 6).

## Trace row (for the Orchestrator to apply)

`| ABC-173 (Security/NFR) | Security/NFR gate on the vitest heap ceiling: PASS_WITH_RISKS; no required fix; no new capability limb; CLI_DEEP heap token provably --max-old-space-size=<digits> only (V1.2.5/V2.2.1 L1 met; fuzz 200,016 strings, 0 unsafe); RISK-ABC173-TEARDOWN/-STATE/-PUZZLE acceptable LOW; SEC-173-1 LOW (unprefixed skip-count capture prints silent 0); NFR-010 row + NFR-008 heap clause text written for routing; Security/NFR secnfr-ABC-173 | — | — | NFR-010 (proposed, text in …bec09225), NFR-008 (heap clause; A9 OWED → R-173-1), N8-LANE (OWED → R-173-2) | grugops/ABC-173 @ 9c97dd23 (from 68bbf33f), read-only; 0 production lines | two foreground 180 s windows 15:07:37Z / 15:13:08Z foreign 181/181 each (platform pids 40997, 50110); nothing timed or estimated; QE-173-g required at the second of ABC-171/ABC-173 to merge | waived (0 production lines) | — | In Security/NFR → Ready for UAT once the owner's word carries R-173-1/R-173-2 (or the readings land); notes .grugops/context/secnfr-ABC-173/ (decision …53a6434a) |`

## Not done / left to the Orchestrator
- `plans/board.md`, `plans/traceability.md` and `plans/nfr-catalog.md` are untouched.
- The pending brief stays in `pending/`, and the claim dir is untouched.
- Nothing committed, pushed or merged. Scratch worktree `../wt-secnfr-ABC-173` removed at the end of the hop.
