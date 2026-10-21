---
subtask: qe-ABC-182
role: qe-e2e
ticket: plans/tickets/ABC-182-a-committed-ruling-2-plant-harness-r2-mutants-sh-beside-clause-b-mjs.md
ref: .grugops/context/qe-ABC-182/
branch: grugops/ABC-182 (tip a7adaf21; code 053595af; base 19abbdb1); SE worktree ../wt-ABC-182 (read only)
width: 3 (beside qe-ABC-181 and qe-ABC-183)
---

# QE gate for ABC-182 (the committed Ruling 2 plant harness; 0 `src/` lines)

## Do
- Verify A1–A6 against the page, running the harness yourself. Order:
  - **A3 first:** the `341da4c1` copy of `clause-b.mjs`, placed where `typescript` resolves. Exit nonzero, with exactly `P2b`, `P2c`, `CMT`, `X1` named on limb 1.
  - **A2:** the folded instrument at the code tip. 7 rows as the page's table states, limbs 2 and 3 identical to `341da4c1` on 7 of 7, exit 0, and the repo's `git status --porcelain`, `HEAD` and refs unchanged afterwards.
  - **A4:** your own `ALT` (one byte of limb 2's output changed, scratch only). It must exit nonzero and name limb 2. Delete it afterwards.
  - **A5:** re-run A2 at the same tip; diff against the committed `r2-mutants.out.txt` byte for byte.
- **Grade the plants, not just the exit code.** Read each plant body in the script against the page's table and against your own `ABC-163` plants (`…7f56f339`). In particular:
  - limb 1 is read from the `(b1) capability` and `(b1) Ruling 2` lines, never a bare `(b1)` grep (Architect decision 2, G-3);
  - `NOH` sits at `f00038ef^1` (`619abc14`);
  - the `G1-*` rows are labelled as the `AR-163-DELONLY` gap.
- **A1:** the SE says A1 holds exactly at the code commit `053595af`; at the tip the diff also lists the SE's 3 notes. Rule on whether that meets A1 as the page intends.
- **Independence.** Do your own runs and readings before opening the SE's (`.grugops/context/ticket-to-pr-ABC-182/` on the branch).
- **Gates** on the code tip:
  - lint, typecheck, build;
  - `npm test` + `last-run.json` success (1987);
  - skip-integrity `--skip-count 0`;
  - `CLI_DEEP` and `PERFT_DEEP`.
- **Heap rule:** 400 for one-file runs, 128 for whole-suite or multi-file runs, one at a time. Take no timing.
- **UAT waiver:** measure it in AGENTS.md's form. Do not filter out `.snap`.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-182` on a branch from the tip. Plants only in clones under a private scratch dir.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-182 page there.
- No edits to `clause-b.mjs`, `r2-mutants.*`, `src/`, `biome.json`, `plans/board.md`, `AGENTS.md`, or other ticket pages.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-182`).
- Write `.grugops/queue/done/qe-ABC-182.md` (brief + `## Result` + trace row as one `| ABC-182 | … |` line) and `.claim.md`, uncommitted on main.

## Result (qe-e2e, 2026-10-21 10:17Z): **PASS_WITH_GAPS**. Commit `63d23da7` on `grugops/qe-ABC-182` (from tip `a7adaf21`; worktree `../wt-qe-ABC-182`)

- One commit: 6 sealed notes plus a `## QE` section on the ABC-182 page.
- No edit to `clause-b.mjs`, `r2-mutants.*`, `src/`, `biome.json`, `plans/board.md`, `AGENTS.md` or another ticket page.
- No push, merge, amend or rebase. No timing was taken.

### Grades (QE's own runs and plant reads; the SE notes were opened afterwards and agree)
| criterion | grade | reading |
|---|---|---|
| `A3` (run first) | MET | `341da4c1` copy in scratch with `node_modules` symlinked: exit 1, `limb 1 MISMATCH: P2b P2c CMT X1`, exactly 4 |
| `A2` | MET | folded instrument (sha `ad47a564…` = `87d3897d`): exit 0 at `19abbdb1` and at `053595af`; 7 of 7 rows as the Scope table; limbs 2/3 identical 14 of 14. Afterwards `status --porcelain` is empty, and `HEAD` and the 24 refs are unchanged. No plant commit is in the repository |
| `A4` | MET | 1-byte `ALT` (`NAME[2]`): exit 1, `limb2` on 7 of 7, never limb 3. QE's `ALT3` twin names only `limb3`. Both deleted |
| `A5` | MET | `cmp` of the `19abbdb1` re-run against `r2-mutants.out.txt`: rc 0 |
| `A1` | MET (on intent) | `053595af` lists exactly the 2 probe files; `clause-b.mjs` is unchanged. The tip adds only the SE's 3 Workflow 16 notes. A1 guards the delivered change, so it holds as the page intends (wording: `QE-182-d`) |
| `A6` | MET | 59 / 1987 at the tip = 59 / 1987 at `19abbdb1` (QE's own base run); skips 0; `biome.json` unchanged |

### Plant grading
- All 7 bodies match the page's table and the ABC-163 plants (`…7f56f339`). P2c's `colour` is from `resolution.options`.
- NOH sits at `619abc14` = `f00038ef^1`, where no file holds limb 1. The G1 rows are labelled `AR-163-DELONLY gap`.
- Limb 1 is read from the `limb 1:` line and the `(b1) Ruling 2` file list, never from a bare `(b1)`.

### Gates (tip `a7adaf21`; its code tree equals `053595af`; one at a time)
| gate | result |
|---|---|
| lint / typecheck / build | exit 0 / 0 / 0 |
| `npm test` (128) | exit 0, 59 files / 1987 tests |
| `last-run.json` | `success` true, 1987 total, 0 failed, 0 pending, 0 todo |
| base counts (QE-measured at `19abbdb1`, temporary detached worktree, since removed) | 59 / 1987: equal |
| skip count / skip-integrity `--skip-count 0` | 0 / `No findings.`, exit 0 |
| `CLI_DEEP` (400) | 11/11 |
| `PERFT_DEEP` (400) | 32/32 |

### UAT waiver (measured, AGENTS.md form, `.snap` not filtered)
- `git diff --name-only <d>~1 <d> | grep -v '\.test\.ts$' | grep '^src/'` is **empty** for `053595af` and for
  `a7adaf21`, and so is the range from `19abbdb1`.
- 0 `.snap` files changed. The waiver condition holds; applying it is the Orchestrator's job.

### Gap register (none blocks; none is against a criterion)
- **`QE-182-a` (LOW, route Architect/Design; fold into the next ticket that edits `r2-mutants.sh`).**
  - A two-edit plant that applies only in part passes under its full label, because `mk` refuses only a plant
    that changed nothing.
  - Shown on a scratch drift commit `14989ee2`: P2c's `cli.ts` edit misses, and the harness still exits 0 with
    `P2c … ok`.
  - Not live at `19abbdb1` or `053595af`.
- **`QE-182-b` (INFO, Architect/Design).** Exit 1 also means the instrument could not run. A relative instrument
  path gives rc 1, names no plant and prints an empty sha. Read an exit 1 as a verdict only if the run ends with a
  `MISMATCH` or `DIFFER` line.
- **`QE-182-c` (INFO, records; by design).** NOH's `adds nothing` is checked only when a Ruling 2 line is printed.
  The `(b1) capability` count and the "no pathspec diff" property are not asserted.
- **`QE-182-d` (INFO, BA/PM, wording).** A1's literal file list does not hold at the tip (SE notes). Scope item 2
  says the output is from "the first run at `A3`"; it is A2's, as A5 says.

### Notes (task `qe-ABC-182`, sealed by `context-io.js` `admitAndAppend`, read back 6 of 6 by `readContext`)
- `20261021T101642Z-qe-e2e-observation-26593e58`: A1–A6 readings and the SE cross-check.
- `20261021T101643Z-qe-e2e-observation-1636f225`: plant grading and the four harness-breaking probes.
- `20261021T101644Z-qe-e2e-observation-57a936e1`: gates, base counts and the waiver measurement.
- `20261021T101645Z-qe-e2e-observation-87ce96c8`: gap register.
- `20261021T101646Z-qe-e2e-decision-8168f877`: verdict.
- `20261021T101647Z-qe-e2e-observation-12505e95`: artifacts and the trace row. It is an observation, because an
  `artifact-ref` needs a `gate_run` and no §14-gate run exists.

### Process remarks
- The claim directory was empty on arrival. The brief was moved pending → claimed → done by `claim.js` `transition`
  at 10:17:22Z, and the empty claim directory was removed.
- **Fence note:** the temporary base worktree held an untracked `.test-results/`. QE removed it with
  `git worktree remove --force`, a local cleanup of QE's own scratch worktree. It was not a history or remote
  operation, but the brief's fence lists `--force`, so it is recorded here.
- The main checkout held other hops' staged and modified files when this file was written (qe-ABC-183 and
  ticket-to-pr-ABC-183 notes, `src/cli.real-engine.test.ts`, the ABC-183 and ABC-095 pages, and
  security-nfr-ABC-183 queue files). QE touched none of them.

### Board
`ABC-182` may leave `In Review`. The page names no Security trigger, and `NFR-008` is 0/0/0 (59/1987 at base and
tip). UAT is next, and the measured waiver covers it. The Orchestrator makes the move.

### Trace row (for the Orchestrator to append to `plans/traceability.md`)
| ABC-182 (QE) | committed Ruling 2 plant harness `r2-mutants.sh` + its A2 output beside `clause-b.mjs`; qe-ABC-182 …decision-8168f877 | ABC-163 G-4; ADR-0036 § S1 Ruling 2; AR-163-DELONLY (G1 rows); QE-182-a..d | grugops/ABC-182 @ a7adaf21 (code 053595af, probe files only, 0 src lines) | no test added (hand-run harness): A3 red exactly P2b P2c CMT X1, A2 green 7/7 + limbs 2/3 14/14, A4 ALT names limb2, A5 cmp 0; npm test 59/1987 = base, skips 0; CLI_DEEP 11, PERFT_DEEP 32 | QE PASS_WITH_GAPS (QE-182-a LOW; -b/-c/-d INFO); UAT waiver holds (0 production lines) | grugops/qe-ABC-182 @ 63d23da7 |
