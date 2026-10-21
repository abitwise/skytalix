---
subtask: qe-ABC-194
role: qe-e2e
ticket: plans/tickets/ABC-194-a-try-catch-or-an-off-switch-around-setups-guard-call-lets-an-uncapped-run-through.md
ref: .grugops/context/qe-ABC-194/
branch: grugops/ABC-194 (tip fcf47534; code 5e0839fd; base 99d07d32); worktree ../wt-ABC-194 (read only)
width: 2 (beside arch-build-ABC-195)
---

# QE gate for ABC-194 (the guard call must be a direct statement of `setup`'s body, and `setup` holds no `return`; plant table 5 → 9). A1–A5

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase); run everything at that merge; report the merge sha.
- Verify every criterion A1–A5 against the page with your own runs, before opening the SE's notes on the branch.
- **Re-plant independently** in scratch copies outside the repository (private `TMPDIR`; copy `node_modules` in full with `cp -R` — a symlinked layout gives two vitest instances and false snapshot failures): the page's builds, M4/M4b, plus your own — e.g. the call inside a block `{ … }`, `void guard(…)`, `guard(…) || 0`, a `throw` before the call, `process.exitCode`/`process.exit` before the call, a `finally`, an `await` of a never-resolving promise before the call, `HEAP_GUARD_OFF` checked inside `guard` itself, a second `setup` body path via `arguments`. Say which survive and whether a survivor matters against QE-192-a's intent (the run is no longer stopped). Re-check that base's `if (!isMainThread) throw …` still passes.
- A4: no new spawned child (`N8_SPAWN` 28), no timing.
- **Gates** on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1994); skip-count capture as spelled in `AGENTS.md` → `test-skip-integrity.js`. One-file runs heap 400, whole-suite 128. No timing.
- UAT waiver in the owner's form: `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` prints nothing. AR-193-HUNKHDR stand-in: `git -c core.quotePath=false diff -U0 --no-renames --text --no-textconv --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/ <base> <tip> -- src | awk '/^diff --git /{h=0} /^@@/{h=1} /^(\+\+\+|---) / && (h || /\t$/)'` prints nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-194` on a branch from the tip. Scratch copies only outside the repository. Never set git config; never touch `node_modules/` in main's checkout.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-194 page there.
- No edits to `tools/`, `src/`, `AGENTS.md`, `memory-bank/`, `package*.json`, `plans/board.md`, `plans/traceability.md` or other ticket pages. Do not touch `../wt-ABC-195`.
- Never push, `--force` (including `git worktree remove --force`), `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-194`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u` (UTC). Append-only; `artifact-ref` needs a §14 gate run, so record artifacts as `observation`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line (not in backticks). Put it in your done record (`.grugops/queue/done/qe-ABC-194.md` + `.claim.md`, main's tree, uncommitted).

## Result

**PASS_WITH_GAPS.**
- Gaps: `QE-194-a` (LOW proposed); `QE-194-b`, `-c`, `-d` (INFO).
- 0 are blocking and none is against a criterion.
- Branch `grugops/qe-ABC-194` @ **`2c8abacf`** (worktree `../wt-qe-ABC-194`, branched at the tip `fcf47534`).

**Merge of `main`:** `5427f807` merged at **`0fd86eb4`** (no conflict), and everything was run there. During the run `main` moved to `f6855262` (the `arch-build-ABC-195` close). That commit is records only (queue, board, trace, the ABC-195 page; no `src/`, `tools/` or package file). I did not merge it again. `git merge-tree --write-tree f6855262 2c8abacf` is clean.

**Commit `2c8abacf`:** 4 sealed notes and a `## QE` section on the ABC-194 page. There are no other edits.

**Notes.** Sealed by `admitAndAppend` (grugops 2.1.0 plugin cache, task `qe-ABC-194`). The context root was `../wt-qe-ABC-194/.grugops/context`, passed explicitly. `at` came from `date -u`, and the writer returned `findings` `[]` for all 4. There is no `finding`, because there was no §14 gate run.
- `20261021T201352Z-qe-e2e-observation-45dc7c69`: A1–A5;
- `20261021T201352Z-qe-e2e-observation-2412ce70`: the mutants, own plants and weakenings;
- `20261021T201352Z-qe-e2e-observation-10453f4d`: gates, waiver, stand-in, artifacts;
- `20261021T201352Z-qe-e2e-decision-ac075665`: the verdict and gap register.

**Criteria.** All are my own runs, taken before I opened the SE's `…aac5545f`/`…4566f46a`/`…cfa3d51f`. Those notes agree on every shared number.
- **A1 MET.** `-t "ABC-192"` at 400: exit 0, 2 passed. Base's `if (!isMainThread) throw …` passes: 0 returns, and the call is a direct statement.
- **A2 MET.** Builds 1–4, M4 and M4b each exit 1 under `-t`, with only `ABC-192 > A1` red, and each fault names its condition. `npm test`: builds 1–3, M4 and M4b give 1993/1994 with only A1 red; build 4 gives 1991/1994 (A1 + `ABC-173` A4/A6).
- **A3 MET.** The row asserts the 9-entry array. Dropping the direct check, the no-return check or the `parent !== body` half each reds the plant assertion.
- **A4 MET.** `N8_SPAWN` = 28. `N8-LANE` and `ABC-173` `C2` pass. The diff adds no child call and no timing.
- **A5 MET.** `main...tip` lists `src/cli.test.ts` + 3 SE notes. `AGENTS.md` is 15,821 B and unchanged. `tools/`, `package*.json`, `vitest.config.ts` and `memory-bank/` are unchanged.

**Own plants** (scratch copy outside the repository: `git archive` + full `cp -R` `node_modules`, private `TMPDIR`, `HEAP_GUARD_OFF` unset; every file restored and `cmp` clean). There were 25, each also run through a plain-node `probe` with the variable unset and set. The probe ran at 496 MiB against a SUITE-shaped stub and is not a suite row. No vitest run was made uncapped.
- **Red A1** (fail-closed, QE-192-c):
  - a block, `void`, `|| 0`, a comma or a label around the call;
  - `try … finally {}` around it;
  - a `return;` after it;
  - `do { guard } while (false)` and `.then(() => guard)`.
- **Green on the check, but killed or harmless:**
  - a `throw` before the call (lint 1; every run stops);
  - `if (env) throw` (refuses);
  - `process.exitCode = 0` (a prefix-less run still exits 1);
  - `if (env) process.exit(0)`;
  - an async `if (env) await never` (killed by `ABC-173` A5);
  - `function* setup` (lint 1; vitest TypeError);
  - a hoisted local `function guard() {}` (killed by `ABC-173` A4/A6; QE-192-b class);
  - a nested-function `return` (correctly ignored);
  - `guard(arguments[0], …)` (equivalent).
- **Green on the check, and `npm test` exits 0 with no test run:** `process.exit(0)` before the call, and `await new Promise(() => {})` before it. Only `last-run.json` (`success` false, `runState` `exited`) shows it → `QE-194-c`.
- **Survive every gate, and admit an uncapped heap when `HEAP_GUARD_OFF=1`** (probe `ADMITTED`, `provide 224`, or `guard` returns without a throw) → `QE-194-a`:
  - `guard(project, env ? { heap_size_limit: 0 } : v8.getHeapStatistics(), process.stdout)`;
  - `if (env) v8.getHeapStatistics = …` in `setup`, or at module top;
  - `if (env) return;` inside `guard`;
  - a default parameter of `setup` (lint-red as spelled).

  These matter against QE-192-a's intent: the run is no longer stopped.
- **Weakenings.** Two narrower test-side weakenings survive the plant table: the return walk without descent (build 3 comes back), and the `ExpressionStatement` half dropped (`do { break; } while (guard(…))` comes back) → `QE-194-b`.

**Gates at `0fd86eb4`:**
- lint 0 (116 files), typecheck 0, build 0.
- `npm test` 0: 59 files, 1994/1994. `last-run.json` reads `success` true, `exitCode` 0, 0 failed, 0 pending, 0 todo.
- Skip count (as spelled, 128) is 0 → `No findings.`, rc 0. No timing.

**UAT waiver:** the owner's form printed nothing over `99d07d32 fcf47534`, for each commit, and for the merge against `main`. WAIVED (0 production lines); not a signature.
**AR-193-HUNKHDR stand-in:** it printed nothing (exit 0/0).

**Gap register:**
- **QE-194-a (LOW proposed).** Input off-switches (heap-statistics argument, a `v8` patch, an early return in `guard`, a default parameter) pass the tightened check and every gate. Closure shape:
  - pin `setup`'s whole shape (one parameter, two statements);
  - pin arguments 1 and 2;
  - require no `process.env` in `heap-guard.js`.

  The residual is parser-unreachable, like QE-192-b. Owner: Security/NFR rates, BA/PM rules.
- **QE-194-b (INFO).** The plant table pins neither the return walk's descent nor the `ExpressionStatement` half. Closure: 2 more plants. Owner: BA/PM.
- **QE-194-c (INFO).** An `npm test` exit 0 can mean no run at all (`process.exit(0)` or a never-settling `await` in `setup`). `last-run.json` + counts are the load-bearing reading. Owner: Orchestrator, for awareness.
- **QE-194-d (INFO).** The fail-closed side grows as test note 2 expects (QE-192-c accepted).

**Fence breach:** none.
- Scratch work: only in the session scratchpad `…/scratchpad/qe194/`, two copies.
- In each copy, the copied `node_modules/node_modules` self-link was re-pointed inside that copy. Main's `node_modules` was only read (`cp -R`).
- The worktree `node_modules` is the house symlink. No git config was set.
- `../wt-ABC-195` and `../wt-ABC-194` were not touched.
- No push, force, amend or rebase, and no merge into `main`.

| ABC-194 (QE) | QE gate: A1–A5 met by own runs at merge 0fd86eb4; A2 builds 1–4 + M4/M4b red only ABC-192 A1 (-t one-file; npm test 1993, build 4 1991 with ABC-173 A4/A6); A3 9-entry array, 3 weakenings red, 2 narrower survive; 25 own plants with a no-vitest probe: 5 input off-switches survive every gate and admit when HEAP_GUARD_OFF=1; exit(0)/never-await give npm test 0 with no run | — | — | QE-192-a (closed as cut), QE-192-b, QE-192-c, ADR-0008, ABC-173, NFR-008, AR-193-HUNKHDR, QE-194-a (LOW), QE-194-b/c/d (INFO) | grugops/qe-ABC-194 @ 2c8abacf (merge 0fd86eb4 = tip fcf47534 + main 5427f807)<br>plans/tickets/ABC-194-a-try-catch-or-an-off-switch-around-setups-guard-call-lets-an-uncapped-run-through.md, .grugops/context/qe-ABC-194/notes/ (4) | lint/typecheck/build 0; npm test 59/1994 success; skip-count 0 → No findings | UAT waived (0 production lines; waiver form and HUNKHDR stand-in print nothing); not a signature | — | PASS_WITH_GAPS (QE done; In Review exit is the Orchestrator's) |
