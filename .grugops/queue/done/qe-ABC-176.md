---
subtask: qe-ABC-176
role: qe-e2e
ticket: plans/tickets/ABC-176-a-refused-run-never-reads-as-a-clean-skip-count-or-a-quiet-result-file.md
ref: .grugops/context/qe-ABC-176/
branch: grugops/ABC-176 (tip 37b8debc; SE code ffd53f41, SE notes bfe1ff4a, Scribe AGENTS.md 522bffd1; base 01836fff); worktree ../wt-ABC-176 (read only)
width: 2 (beside qe-ABC-191)
---

# QE gate for ABC-176 (a heap-guard refusal is named on stdout and in `last-run.json`; two `AGENTS.md` comments). A1–A5

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase); run everything at that merge; report the merge sha.
- Verify every criterion A1–A5 against the page with your own runs, before opening the SE's and Scribe's notes on the branch.
- **Arms:** the refusal arm (prefix removed) and green arm (as spelled), for the SUITE and ONE-FILE shapes, and the exact old string (A2). Feed each stdout to the gate step as the page says.
- **A3/A4:** re-run all six `ABC-149` reporter rows plus the seventh `refused` row yourself, in a scratch copy **outside the repository** with a private `TMPDIR`; compare by content. Show the message is the thrown one, not a fixed string; show the "cannot look" throw is named.
- **The page's QE mutants** plus your own: a capture that exits 1 but prints `0`; a reporter writing a fixed refusal string; a reporter dropping the `run` arm; a guard writing its refusal only to stderr; a guard without the `catchError` hand-off. Also probe the SE's flagged ordering risk: is the guard's stdout line guaranteed to precede vitest's JSON report on the same stream (e.g. under the `run-bounded.js` wrapper and both shapes)? Say what you measured.
- **A5:** `AGENTS.md` ≤ 18,432 B (Scribe: 15,797); ABC-173 A3 still finds 17 commands; A4's refusal regex still matches; the skip-count command byte-identical to base; the `memory-bank/90-…` log row consistent.
- **Gates** on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1992); skip-integrity `--skip-count 0`. One-file runs heap 400, whole-suite 128. No timing. UAT waiver in AGENTS.md's form; `git diff --numstat <base> <tip> -- src | awk '$1=="-"'` prints nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-176` on a branch from the tip. Scratch copies only outside the repository.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-176 page there.
- No edits to `tools/`, `src/`, `AGENTS.md`, `memory-bank/`, `package.json`, `.grugops/test-skips.md`, `plans/board.md`, `plans/traceability.md` or other ticket pages. Do not touch `../wt-ABC-191`, `../wt-qe-ABC-191`.
- Never push, `--force` (including `git worktree remove --force`), `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-176`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u` (UTC). `artifact-ref` needs a §14 gate run, so record artifacts as `observation`. Notes are append-only: never delete one; a wrong note gets a superseding note.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells. Put it in your done record (`.grugops/queue/done/qe-ABC-176.md` + `.claim.md`, main's tree, uncommitted); the Orchestrator appends it.

## Result

**PASS_WITH_GAPS** (`QE-176-a` LOW, `QE-176-b` LOW, `QE-176-c` INFO, `QE-176-d` INFO; 0 blocking; none against a criterion).
Branch `grugops/qe-ABC-176` @ **`168b2907`** (worktree `../wt-qe-ABC-176`, branched at the tip `37b8debc`).

- **Merge of `main`:** `331c7d18` merged (`--no-ff`, no conflict) at **`57bb2180`**; every run was at that merge. main brought only `.grugops/`, `plans/` and docs. During the run, `main` moved to `837e8b22` (ABC-191's merge and records; no `src/`, `tools/`, `package*`, `AGENTS.md` or config change). QE did not re-merge. `git merge-tree` of `168b2907` and of `37b8debc` into `837e8b22`: both clean.
- **Commit `168b2907`:** 5 sealed notes and a `## QE` section on the ABC-176 page. No edits to `tools/`, `src/`, `AGENTS.md`, `memory-bank/`, `package.json`, `.grugops/test-skips.md`, the board, the trace or other pages.
- **Notes** (sealed with `admitAndAppend`, grugops 2.1.0 plugin cache; task `qe-ABC-176`; context root `../wt-qe-ABC-176/.grugops/context` passed explicitly; `at` from `date -u`; `validate` `[]` and `sealVerdict` ok on all 5; no finding, because there was no §14-gate run):
  - observations: `20261021T164420Z-qe-e2e-observation-be90087e` (A1–A5), `20261021T164420Z-qe-e2e-observation-fbdf5a60` (mutants), `20261021T164420Z-qe-e2e-observation-c9b3023e` (ordering risk), `20261021T164420Z-qe-e2e-observation-c83116a5` (gates and artifacts, recorded as an observation);
  - decision: `20261021T164420Z-qe-e2e-decision-75bc28e0` (verdict and gap register).

**Criteria** (my own runs at `57bb2180`, taken before I opened the SE's `…ccdc3b9f`/`…d7694ffa`/`…af9fc531`/`…74594565`/`…fe51adb4` and the Scribe's `…7d0159c3`/`…cf2e5486`; those notes agree on every number):
- **A1 MET.** Refusal arm (prefix removed): SUITE and ONE-FILE (`src/glyph-mode.test.ts`) both give empty stdout (0 integer lines), pipe exit 5, vitest exit 1. The gate fed `""` prints `Skip count was not provided (UNKNOWN - verify)…`, exit 1. A SUITE run at flag 400 is refused the same way. Green arm (as spelled): SUITE `0`, exit 0, `No findings.` exit 0; ONE-FILE (400) the same.
- **A2 MET.** The exact old string gives 0 bytes of stdout, pipe exit 5, and the gate exits 1. Feasible on vitest 4.1.11, so option (b) stands.
- **A3 MET.** The `test` command without its prefix gives exit 1; `success` false, `exitCode` 1, `numTotalTests` 0. `unhandledErrors[0].message` is the thrown message verbatim (it begins `heap-guard: refused.`), and READ IT prints `error  <message>` and `run    exited exitCode=1`. Three different refusals give three different messages (SUITE 4192, ONE-FILE 4192 vs 496, SUITE at flag 300 = 396 MiB), so it is not a fixed string. The "cannot look" throw is named at integration level (`getPaths` made unreadable in the scratch copy: the file and the query carry `heap-guard: project.vitest.state.getPaths() is gone; …`) and at unit level (the SE's row). Non-vacuity: a green file has `unhandledErrors` [], and the query prints 0 lines.
- **A4 MET.** All 7 rows were re-run in a scratch copy OUTSIDE the repository (git archive of `57bb2180` plus a copied `node_modules`, private `TMPDIR`), and a script compared them to the header by content: green, unhandled, hang (exit 124, `startTime` later than the stamp), suite, assertion, exit-code-only, refused. Exit, fields and query lines all `ok`.
- **A5 MET.** `AGENTS.md` is 15,797 B, within 18,432. The `Test (all)` quote now carries its prefix, and the history pointer is present. `ABC-173` `A3` counts **17** (3 SUITE) on tip and on base. `A4`'s regex matches the live refusals (128 and 400). The skip-count command is byte-identical to base (sha256 `d1215c9c…`). The `90-…` row's +38/+153/15,797/17/18,432 re-measure true.

**Mutants** (in the scratch copy, each restored by `cmp`): 8 run, and the arms or rows kill all 8. The suite misses 3:
- M2a, the reporter writing a fixed string, survives the suite.
- M3, the query without its `run` arm, survives the suite. With it, the hang and exit-code-only rows print 0 lines.
- M4, `setup` passing `process.stderr`, survives the full suite (59 files / 1992 passed) while the capture prints `0`, exit 0, `No findings.`. The SE's stderr mutant was the in-`guard` form, which is killed.
- M0 (base), M1 (line written on exit, after the JSON: prints `0` with exit 5), M2b and M5 are killed by the suite too.

**Ordering risk measured:** the guard line came before the JSON in 46 of 46 refusal runs:
- direct and under `run-bounded.js`, SUITE and ONE-FILE, 10 each;
- 6 runs with a slow pipe consumer.

Mechanism: in vitest 4.1.11 `runFiles`, `initializeGlobalSetup` is awaited before the `finally` → `_testRun.end` → JSON `logger.log`. The Logger's `Console` wraps the same `process.stdout` Writable, which is FIFO. Counterfactual: with the order reversed, jq prints `0` (exit 5). No row pins the order (`QE-176-b`).

**Gates at `57bb2180`:**
- lint 0 (116 files), typecheck 0, build 0.
- `npm test` 0: 59 files, 1992/1992; `last-run.json` `success` true, `exitCode` 0, 0 pending, 0 todo.
- Skip count `0` → `No findings.`, exit 0.
- Heap: one-file runs 400, whole-suite 128. No timing.

**UAT waiver:** `git diff --name-only 01836fff 37b8debc | grep -v '\.test\.ts$' | grep '^src/'` printed nothing; the same over `331c7d18..57bb2180` printed nothing. WAIVED; not a signature. `git diff --numstat 01836fff 37b8debc -- src | awk '$1=="-"'` printed nothing (`src/cli.test.ts` 142/1).

**Gap register:**
- **QE-176-a (LOW):** the stdout stream `setup` passes is pinned by no row (M4). Possible closure: a static row asserting that `setup` passes `process.stdout`, or a spawned refusal row (0 tests run).
- **QE-176-b (LOW):** the line-before-JSON ordering is vitest-internal, and on a vitest bump no re-run trigger re-reads the A1/A2 capture arm. Possible closure: name it in the header's vitest-bump re-run list.
- **QE-176-c (INFO, pre-existing `ABC-149` design):** M2a and M3 are killed only by the hop-run rows.
- **QE-176-d (INFO):** page drift. A5 cites 24,576 (now 18,432), and A2's `UNKNOWN - verify` is now settled. The `bapm-cut-ABC-176` notes are `sealed: false`, so `readContext` returns none.

**Fence breach:** none in the repository. Disclosure: the session-shared scratchpad held other hops' files, and I wrote some generic names into it (`copy/`, `rows/`, `arms/`, `mut/`, `orig/`, `order/`, `bin/{row.sh,mut.sh,check.js,read.mjs,render.mjs,readit.jq}`, `*.orig`, `AGENTS.tip.md`, `count.txt`, `gate-npmtest.log`), so a same-named file of an earlier hop may have been overwritten. My scratch copy was verified equal to `57bb2180` (`src/`, `tools/` by `cmp`). A `render()` call failed with ENOENT before writing anything; the read was redone with `readContext`.

| ABC-176 (QE) | QE gate: A1–A5 met by own runs (refusal/green arms × SUITE/ONE-FILE, A2 old string); 7 reporter rows by content in a scratch copy outside the repo; 8 mutants (suite misses 3); ordering 46/46 | — | — | SEC-173-1, QE-173-d, QE-173-f, RISK-ABC173-STATE, QE-176-a (LOW), QE-176-b (LOW), QE-176-c/d (INFO) | grugops/qe-ABC-176 @ 168b2907 (merge 57bb2180 = tip 37b8debc + main 331c7d18)<br>plans/tickets/ABC-176-a-refused-run-never-reads-as-a-clean-skip-count-or-a-quiet-result-file.md, .grugops/context/qe-ABC-176/notes/ (5) | lint/typecheck/build 0; npm test 59/1992 success; skip-count 0 → No findings | UAT waived (0 production lines; waiver and --numstat print nothing); not a signature | — | PASS_WITH_GAPS (QE done; In Review exit is the Orchestrator's) |
