---
subtask: qe-ABC-173
role: qe-e2e
ticket: ABC-173
branch: grugops/ABC-173 @ 840ebbf7 (from 68bbf33f)
ref: .grugops/context/qe-ABC-173/
---

# QE pass on ABC-173: vitest heap ceiling, 2 executors (lean)

## What you are checking
The delivery at `840ebbf7`. Your job is to break it and report the gaps.

## Read first
- The ticket page.
- ADR-0008 § ADDENDUM 2026-10-19, which is ACCEPTED (`…9f3b6e20`).
- The owner's word `…6e1d9b47`: lighten the rows, keep the cap.
- The SE's done file `ticket-to-pr-ABC-173.md` and the notes on the branch.

## Check
1. **Guard and pins.** Each criterion C1, C2 and A1–A8 must hold, and each must fail on a wrong build. Use mutants on scratch copies of:
   - `tools/grugops/heap-guard.js`: its row choice, its file counting, and its above-row comparison (`>` versus `>=`);
   - the `CLI_DEEP` argv heap token;
   - the A3 static row: what happens if one `AGENTS.md` line is dropped or carries the wrong flag;
   - the C2 parser;
   - the A6 static row.
2. **The lightened rows.** ABC-170 A3 moved to step 5, and ABC-167 A5 `movetime 100` moved to step 10. Re-run the SE's discrimination claims. M15 must still kill all six A3 rows, and the A5 row must keep the same kill set as it had at step 1.
3. **Lanes.** Run every `AGENTS.md` lane once, exactly as spelled. Check that `last-run.json` shows `success: true` with the full count, and that the skip-integrity check passes with a skip count of 0.
4. **Gap the SE named.** When the guard refuses `npm test`, the result file names no error. Grade that gap.
5. **Waiver.** The production-lines grep is empty, so the UAT waiver is expected. Confirm it.

## Timing (A9 and N8-LANE)
The addendum asks for two timing readings before merge:
- the N8-LANE narrow-set charge, with the base arm on the old command and the head arm on the new one;
- A9's `npm test` wall reading, with a twin.

Take them **only** in a foreground-verified quiet window: 180 s with no foreign vitest, no `oeselg-labs/platform` process, and none of our own hops running. A `uat-ABC-171` hop may be running. If no window opens, mark both **OWED**. Never estimate them. Record host and load1.

## Fences
- Work in a scratch detached worktree, `../wt-qe-ABC-173`. Remove it at the end.
- Do not touch:
  - `src/`
  - `plans/board.md`
  - `plans/traceability.md`
  - `../wt-ABC-173`
  - `../wt-ABC-171`
  - `../wt-uat-ABC-171`
  - any process you did not start
- Do not fix anything. Never push, merge or self-sign.

## Publish
- Hand-authored, unsealed notes under `ref:` in main's working tree. Include a `kind: decision` note authored by `qe-e2e`.
- `.grugops/queue/done/qe-ABC-173.md` and `.claim.md`, uncommitted. They hold:
  - the verdict;
  - the grade for each criterion;
  - the mutants;
  - the lanes;
  - A9 and N8-LANE, each as a reading or OWED;
  - the gaps, named `QE-173-*`;
  - the waiver;
  - a trace row.

---

## Result (qe-e2e, 2026-10-19): **PASS_WITH_GAPS**; `A9` and `N8-LANE` **OWED**

- **Where:** the scratch worktree `../wt-qe-ABC-173`, detached at `840ebbf7`, clean after every mutant batch and now
  removed. Timing arms and reporter plants lived outside the repository, in the hop's scratchpad.
- **Not touched:** `src/`, `plans/board.md`, `plans/traceability.md`, `../wt-ABC-173`, `../wt-ABC-171`,
  `../wt-uat-ABC-171`, or any process I did not start. Nothing fixed, pushed or merged; nothing self-signed.
- **Notes** (`.grugops/context/qe-ABC-173/notes/`, hand-authored, unsealed, uncommitted):
  - mutants `…3d7a91c4`;
  - criteria, lanes, gates, reporter row, waiver `…6b0e2f58`;
  - `A9` / `N8-LANE` OWED `…c9e4a7d1`;
  - **the decision `…e81b5c27`, PASS_WITH_GAPS**, by `qe-e2e`.
  - Scripts, specs, logs and both window outputs are in `probe/`.

### Per criterion
| criterion | grade |
|---|---|
| C1 | PASS: `ABC-144 A7` and `ABC-152 V3` byte-identical to `6cfc1be9`, green; `maxWorkers: 3` and `viteModuleRunner: true` red them |
| C2 | PASS (`QE-173-c` INFO): named `spawn(`, namespace `cp.exec(` and renamed `fork` plants each red it |
| A1 | PASS: (b) none; 0 files name `resourceLimits`; `new Worker` at `cli-api.CnMVyzaz.js:3229` |
| A2 | PASS: 9 x 224 = 2016, 4 x 496 = 1984 |
| A3 | PASS: 17 commands; 14/14 static mutants killed; the default-lane, `CLI_DEEP` and `INPUT_DEEP` armed reds reproduced (refused, exit 1) |
| A4 | PASS: no `globalSetup` -> red; guard off + unprefixed -> red; flag in `execArgv` -> `ERR_WORKER_INVALID_EXEC_ARGV` |
| A5 | **PASS_WITH_GAP `QE-173-a`** |
| A6 | PASS (`QE-173-b` LOW, `QE-173-e` INFO) |
| A7 | PASS: every lane green at the cap, no OOM |
| A8 | PASS: pins named and re-pinned; 13 receipts verbatim (868 B); `AGENTS.md` 24,343 B |
| A9 | **OWED** |

### Mutants: 54 run, 44 killed, 10 survived
- **Guard (11):** 10 killed. **G03 (always ONE-FILE), G06 (<= 2 files ONE-FILE), G11 (SUITE row 512)** are killed only
  by the armed command "two files at flag 400". **G09 (compares the flag), G10 (ONE-FILE row 592)** are killed only by
  "one file at flag 450". All five pass the default lane and every lane as spelled. **G08** (wrong provided row)
  survives. G04 (`>=`) reds every correct run; G07 (never throws) reds only wrong commands.
- **Config / `A4` (5):** 5 killed.
- **`CLI_DEEP` token (5):** 3 killed (dropped; after the entry point; literal 400 only in a SUITE-shape run). T02
  equivalent; T05 survives.
- **`A3` static (14):** 14 killed, including a dropped line, a wrong flag, a split `INPUT_DEEP`, a commented-out command
  and `FLAGS_MIB` moved alone.
- **`C2` (11):** parser 4 of 7 (P04/P06/P07 equivalent on today's tree); plants 3 of 4 (the dynamic `import()` is the
  stated bound).
- **`A6` static (6):** 4 killed (a quoted `"env"` by lint); A04 (spread `env`) and A05 (`--max_old_space_size=`) survive.
- **Lightened rows:** **M15 reds all 6 `ABC-170 A3` rows at step 5** (and at step 1); M16 green at both steps, as
  recorded. **`ABC-167 A5` "movetime 100": kill set {MT1, MT2, MT3} at step 1 = at step 10** over M01–M11 + three
  `movetime` wrong builds.

### Lanes (each typed exactly as `AGENTS.md` spells it, one at a time)
| lane | exit | passed |
|---|---:|---|
| lint / typecheck / build | 0/0/0 | — |
| `npm test` | 0 | 59 files, 1920; `last-run.json` `success: true`, 1920 total, 0 failed/pending |
| skip count / integrity | 0 / 0 | **0** / `No findings.` |
| `PERFT_DEEP` | 0 | 32 |
| `SEARCH_DEEP` search / transposition / quiescence / pvs-lmr | 0 | 57 / 40 / 37 / 29 |
| `ENGINE_DEEP` engine / levels / transposition | 0 | 60 / 28 / 26 |
| `INPUT_DEEP` / `ZOBRIST_DEEP` / `PUZZLE_DEEP` | 0 | 34 / 33 / 18 |
| `CLI_DEEP` | 0 | 11 |
| `LADDER_DEEP` (short) | 0 | 18 |
| single file (`src/fen.test.ts`) | 0 | 82 |
| Coverage / Coverage `src/` | 0 / 0 | 1920 / 1920, both green on the first run |

No OOM, no `Worker exited unexpectedly`, no guard refusal in any lane. `git merge-tree` against main and against
`grugops/ABC-171`: clean.

### `A9` and `N8-LANE`: **OWED** (never estimated)
- Host MacBook-Air.local (Mac15,13, 8 cores, node v26.11.1).
- Two foreground 180 s windows, at 14:41:49Z and 14:45:40Z. Each had foreign processes in **181 of 181 polls**: the
  two `oeselg-labs/platform` `main-worker.js` processes and the `uat-ABC-171` hop. load1 was 2.41–3.50.
- The arms (B/T at `68bbf33f`, H/H2 at `840ebbf7`), the harness (`lane173.mjs`, a per-arm-command copy of
  `lane144b.mjs`) and both readouts are recorded for the next attempt.

### Gaps
- **`QE-173-a` MEDIUM.** No automated row pins `heap-guard.js`'s `ROWS_MIB` or its shape choice. Five guard mutants
  pass every lane as spelled. Three of them admit a SUITE run at 9 x 496 = 4464 MiB. The page's "raise one row ->
  `A4` red" does not hold for a raised `ROWS_MIB`.
  - Recommended: a test-only row, before merge. The SE writes it, or the owner accepts the gap.
- **`QE-173-b` LOW.** `A6 (static)` misses an underscore heap flag in argv and an `env` key passed through a spread.
- **`QE-173-c` INFO.** `C2`'s self-test does not plant `exec`.
- **`QE-173-d` LOW** (the SE's named gap, reproduced). A guard refusal leaves `last-run.json` not-success with
  `numTotalTests` 0 and no error. The query prints only `run    exited exitCode=1`, and the console names the guard.
  - Not a merge blocker. Accept it, or open a later reporter ticket.
- **`QE-173-e` INFO.** The literal-token (T03) and call-site env (T05) mutants of `CLI_DEEP`.
- **`QE-173-f` INFO.** A stale `Test (all)` comment in `AGENTS.md`.
- **`QE-173-g` INFO (risk).** `ABC-171`'s +533 test lines have never run under the cap. Re-run every lane after the
  second of the two merges.

### Waiver
`git diff --name-only 68bbf33f...840ebbf7 | grep -v '\.test\.ts$' | grep '^src/'` prints nothing. The per-commit form
also prints nothing for `affee860`, `48842a1f` and `840ebbf7`. **0 production files: the UAT waiver is confirmed.**
A waiver is not a signature.

### Next column
- `QE-173-a` goes to the SE as a test-only row, or the owner accepts it.
- Then `In Security/NFR`, for `A9` + `N8-LANE` before merge and the proposed `NFR-010` row.
- The Orchestrator decides.

### Trace row (for the Orchestrator to append; QE did not edit `plans/traceability.md`)
`| ABC-173 (C1, C2, A1–A9) | ADR-0008 addendum 2026-10-19; owner word …6e1d9b47 | grugops/ABC-173 @ 840ebbf7 (from 68bbf33f) | tools/grugops/heap-guard.js, vitest.config.ts, package.json, AGENTS.md, src/cli.test.ts, src/cli.real-engine.test.ts, src/engine.test.ts, src/uci-session.test.ts, src/line-input.test.ts | QE qe-ABC-173: every AGENTS.md lane green as spelled at the cap (1920/1920 success true; skips 0 No findings; coverage x2 green first run; CLI_DEEP 11; PERFT 32; LADDER short 18); no OOM; mutants 54 run / 44 killed / 10 survived; M15 reds 6/6 ABC-170 A3 at step 5; ABC-167 A5 movetime-100 kill set unchanged at step 10; 0 production lines (UAT waived); merge-tree clean vs main and ABC-171; A9 + N8-LANE OWED (no quiet window: platform workers + uat-ABC-171 hop 181/181 polls x2) | PASS_WITH_GAPS: QE-173-a MEDIUM (guard rows/shape unpinned) → SE test-only row or owner; -b/-d LOW; -c/-e/-f/-g INFO; → In Security/NFR for A9 + N8-LANE before merge | notes …3d7a91c4, …6b0e2f58, …c9e4a7d1, …e81b5c27 |`
