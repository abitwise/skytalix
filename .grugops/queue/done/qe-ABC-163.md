---
subtask: qe-ABC-163
role: qe-e2e
ticket: plans/tickets/ABC-163-the-clause-b-instrument-fires-nothing-when-a-limb-1-holder-changes-what-it-reads.md
ref: .grugops/context/qe-ABC-163/
branch: grugops/ABC-163 (tip dc4d4f15; instrument 87d3897d; ADR d8c073e2; base ccccc6bb); SE worktree ../wt-ABC-163 (read only)
width: 3 (beside ticket-to-pr-ABC-180 and qe-ABC-179)
---

# QE gate for ABC-163: Ruling 2 folded into `clause-b.mjs`

## Do
- **A1–A5.** Verify each against the page.
  - Re-plant P2b, P2c and the comment-only edit yourself, on a scratch `git archive` repo outside the working tree.
  - Run OLD (`341da4c1`) and NEW (`87d3897d`) on each plant.
  - Read A3 (no-holder pair) and A4 (both recorded pairs vs the record) yourself.
  - Don't copy the SE's readings (`.grugops/context/ticket-to-pr-ABC-163/` on the branch) until yours are taken.
- **Regression.** Limbs 2 and 3 must stay byte-identical, OLD vs NEW, on the real pairs. Pick your own pairs, including at least the 9 the SE used, if you can identify them.
- **Edge cases.**
  - A holder present only at head.
  - A holder present only at base. The SE planted this one; re-plant it yourself.
  - A rename. The instrument uses `--no-renames`; check what Ruling 2 says on a rename.
- **Consumers.** The SE notes that older probe scripts grepping `(b1)` will now also match the new Ruling 2 line. Find every consumer of `clause-b.mjs` output in the repo. Grade whether any current gate or recorded reading changes meaning.
- **Lint.** Biome ignores `.grugops/`, so nothing lints the instrument. Record that as a gap if it matters.
- **Gates** on the tip:
  - lint, typecheck, build;
  - `npm test` + `last-run.json` success;
  - skip-integrity `--skip-count 0`;
  - `CLI_DEEP` and `PERFT_DEEP`.
  - Heap rule: 400 for one-file runs, 128 for multi-file runs. Run one at a time. No timing.
- **UAT waiver.** Measure it in AGENTS.md's form, with no `.snap` filter.
- **Verdict.** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-163`, branched from the tip. Commit there: your notes (written inside the worktree) and a `## QE` section on the ABC-163 page.
- Do not touch `clause-b.mjs`, the ADR, `src/`, `plans/board.md` or `AGENTS.md`.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal notes with the plugin writer (task `qe-ABC-163`).
- Write `.grugops/queue/done/qe-ABC-163.md` (brief + `## Result` + trace row) and `.claim.md`, uncommitted on main.

## Result (qe-e2e, 2026-10-21 09:27Z): **PASS_WITH_GAPS**. Commit `2270c8fa` on `grugops/qe-ABC-163` (from tip `dc4d4f15`; worktree `../wt-qe-ABC-163`)

- One commit: 5 sealed notes plus a `## QE` section on the ABC-163 page.
- Not touched: `clause-b.mjs`, the ADR, `src/`, `plans/board.md`, `AGENTS.md`. No push, merge, force, amend or rebase. No timing read.

### Grades (QE's own readings; the SE's `…b896aae8` was opened only afterwards, and it agrees)
| criterion | grade | reading |
|---|---|---|
| `A1` | MET | P2b, P2c re-planted on `git archive` of `dc4d4f15` and of `1671f24f` (scratch): NEW limb 1 FIRES, `(b1) Ruling 2` names `src/book-file.ts`, 2 of 2; OLD `341da4c1` does not fire |
| `A2` | MET | comment-only edit: NEW FIRES, OLD does not |
| `A3` | MET | QE pair `f00038ef^1..f00038ef` (+ 6 more no-holder pairs, incl. the SE's `dbaf972f`): `adds nothing`, verdict = OLD; git shim: identical call lists (79 = 79), no pathspec diff |
| `A4` | MET | `0974102f..2307fc11` and `3ea3e352..98ea0a84` equal the record (verdicts, items, holders 4, Ruling 2 additions) |
| `A5` | MET | `ADR-0036` § S1 dated line names `87d3897d`; `git diff --numstat ccccc6bb dc4d4f15 -- src/` empty |

### Regression and edges
- Limbs 2 and 3 are byte-identical OLD vs NEW on 26 real pairs (52/52), which include the SE's 9, and on 17 plants (34/34). The limb-1 verdict is equal on 26/26 pairs.
- A holder only at `<head>` fires (already by (b1)). A holder only at `<base>` fires by Ruling 2 alone (re-planted).
- A rename, under `--no-renames`, is a delete plus an add. The new path fires when it holds at `<head>`, and a rename that drops the import fires nothing (the safe direction).

### Consumers
- No live gate parses the output: 0 references in `src/`, `tools/`, `scripts`, `package.json` or `.claude/`. The by-hand recipe greps `baseline`, which is unchanged.
- The probe harnesses `mutants.sh`, `f-mutants.sh` and `sec-mutants.sh` were run with OLD and NEW. All 32 limb-1 rows split across two lines. F5, F6 and S10 gain `L1` by design (Ruling 2). Clause (b) verdicts are unchanged.
- `fixtures.sh` gains a limb-1 field. Recorded readings keep their meaning, and they reproduce at `341da4c1`.

### Gates (tip, QE worktree, one at a time; 400 heap one-file, 128 multi-file)
| gate | result |
|---|---|
| lint / typecheck / build | rc 0 / 0 / 0 |
| `npm test` | rc 0, 59 files / 1987 tests |
| `last-run.json` | `success: true`, 0 failed, 0 pending, 0 todo |
| skip count; skip-integrity `--skip-count 0` | 0; `No findings.` |
| `CLI_DEEP` / `PERFT_DEEP` | 11/11 / 32/32 |

### UAT waiver (AGENTS.md form, no `.snap` filter; measured)
`git diff --name-only <d>~1 <d> | grep -v '\.test\.ts$' | grep '^src/'` is empty (grep rc 1) for `87d3897d`, `d8c073e2` and `dc4d4f15`, and over `ccccc6bb..dc4d4f15` (6 files: the instrument, the ADR and 4 SE notes; 0 `.snap`). **Waiver holds.**

### Gap register (none blocking; `block_on: high`)
- **G-1 (proposed LOW, latent).** Deletion-only edits to a limb-1 holder fire nothing.
  - The plants: a guard line dropped, which widens the read; the import line dropped; a rename that drops the import.
  - The by-hand check that § S1 now retires fired on all three. The instrument follows Ruling 2's words ("a `+` line").
  - MEDIUM at the first holder with a guard or a multi-line read. Route: Security/NFR, then Architect/Design.
- **G-2 (LOW, pre-existing, every limb).** Deleting only the `/*` and `*/` lines around an import makes a new holder with no `+` line, and nothing fires. Route: Security/NFR, with G-1.
- **G-3 (LOW).** The harnesses' `grep '(b1)'` row split, and the three `L1` limb-set changes. Route: Architect/Design. The records are not edited.
- **G-4 (LOW).** `biome.json` excludes `.grugops/`, so the instrument is neither linted nor tested. The Ruling 2 code adds 0 diagnostics (measured in scratch; 2 pre-existing), and no runnable Ruling 2 fixture is committed. Route: Architect/Design.

### Notes (task `qe-ABC-163`, sealed by `context-io.js` `admitAndAppend`, all 5 read back by `readContext`)
- `20261021T093000Z-qe-e2e-observation-5e2bf05e`: A1–A5 readings.
- `20261021T093010Z-qe-e2e-observation-7f56f339`: edge plants and the by-hand comparison.
- `20261021T093020Z-qe-e2e-observation-47186969`: regression and consumers.
- `20261021T093030Z-qe-e2e-observation-7a3267d0`: gates, waiver and lint.
- `20261021T093040Z-qe-e2e-decision-8a60d7c8`: verdict and gap register.

### Process remarks
- **The note timestamps are ahead of the real time.** The `at` values `09:30:00Z`–`09:30:40Z` were written by hand and run ahead of the wall clock. The notes were actually sealed at about `09:26Z`. They are not re-issued.
- Every plant repository, shared clone and instrument copy is under the session scratchpad `qe163/`. Nothing was written to the main checkout's tree or to the SE worktree.
- `node_modules` is symlinked into the QE worktree.

### Board
- `ABC-163` leaves `In Review` QE-green, toward `In Security/NFR`. Reasons: the page's Security trigger, and G-1/G-2 need a ruling.
- `arch-ABC-163-adr` is already queued. UAT is waived.
- `AR-095-L1UNIT`'s close condition is met, and the Orchestrator records the close. The Orchestrator makes the move.

### Trace row (for the Orchestrator to append to `plans/traceability.md`)
| ABC-163 (QE) | Ruling 2 folded into clause-b.mjs; P2b/P2c/comment re-planted FIRE (OLD does not); A3 adds nothing, no pathspec diff; limbs 2/3 byte-identical on 26 pairs + 17 plants; qe-ABC-163 …8a60d7c8 | AR-095-L1UNIT / F-095-1 / ADR-0036 § S1 | grugops/ABC-163 @ dc4d4f15 (instrument 87d3897d, ADR d8c073e2, base ccccc6bb); QE grugops/qe-ABC-163 @ 2270c8fa | .grugops/context/design-F-072-1/probe/clause-b.mjs (0 src lines; 0 tests) | lint/typecheck/build rc 0; npm test 59/1987, 0 skips; skip-integrity 0; CLI_DEEP 11/11; PERFT_DEEP 32/32; UAT waiver: non-test src list empty | QE PASS_WITH_GAPS: A1–A5 MET; G-1 deletion-only holder edits silent vs by-hand (Security/NFR), G-2 uncomment-by-deletion pre-existing, G-3 harness (b1) grep, G-4 instrument unlinted/no fixture (Architect) |
