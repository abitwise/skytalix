---
subtask: qe-ABC-192
role: qe-e2e
ticket: plans/tickets/ABC-192-nothing-pins-the-stream-setup-hands-the-guard-and-a-vitest-bump-re-runs-no-capture-arm.md
ref: .grugops/context/qe-ABC-192/
branch: grugops/ABC-192 (tip b5b8b0f9; code 5d1fbaa7; base 47a3c9a1); worktree ../wt-ABC-192 (read only)
width: 2 (beside arch-build-ABC-193)
---

# QE gate for ABC-192 (parser-read pin that `setup` hands the guard `process.stdout`; vitest version pin with the re-run list as its message). A1–A4

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase); run everything at that merge; report the merge sha.
- Verify every criterion A1–A4 against the page with your own runs, before opening the SE's notes on the branch.
- **Re-plant independently** in scratch copies outside the repository (private `TMPDIR`; copy `node_modules` in full — the SE found a symlinked layout gives two vitest instances and 23 false snapshot failures): M4 `process.stderr`, M4b `{ write() {} }`, a vitest version bump; plus your own — e.g. `guard` called through an alias or spread, `process["stdout"]`, a second `setup` export, a stdout wrapper, the call moved out of `setup`, the version read from the lockfile instead. Say which survive and whether a survivor matters against QE-176-a/-b's intent.
- A3: no new spawned child (`N8_SPAWN` 28), no timing.
- **Gates** on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1994); skip-count capture as spelled in `AGENTS.md` → `test-skip-integrity.js`. One-file runs heap 400, whole-suite 128. No timing.
- UAT waiver in the owner's form: `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` must print nothing. AR-191-GITENV stand-in, in your shell and worktree: `git config --get-regexp '^(color\.(ui|diff)|diff\.(external|srcprefix|dstprefix)|diff\..+\.command)$' | grep -v -E '^color\.(ui|diff) (auto|true|false|never)$'; printenv GIT_EXTERNAL_DIFF` must print nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-192` on a branch from the tip. Scratch copies only outside the repository. Never set git config.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-192 page there.
- No edits to `src/` (other than nothing), `tools/`, `AGENTS.md`, `memory-bank/`, `package*.json`, `plans/board.md`, `plans/traceability.md` or other ticket pages. Do not touch `../wt-ABC-193`.
- Never push, `--force` (including `git worktree remove --force`), `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-192`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u` (UTC). Append-only; `artifact-ref` needs a §14 gate run, so record artifacts as `observation`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line (not in backticks). Put it in your done record (`.grugops/queue/done/qe-ABC-192.md` + `.claim.md`, main's tree, uncommitted).

## Result

**PASS_WITH_GAPS** (`QE-192-a` LOW, `QE-192-b`/`-c`/`-d` INFO; 0 blocking; none against a criterion).
Branch `grugops/qe-ABC-192` @ **`a530222a`** (worktree `../wt-qe-ABC-192`, branched at the tip `b5b8b0f9`).

- **Merge of `main`:** `ec5c42d7` merged (`--no-ff`, no conflict) at **`bfccd564`**; every run was at that merge. Main brought records, `AGENTS.md` 15,797 → 15,821 B (Scribe `4f81850c`) and memory-bank text; no `src/`, `tools/`, `package*`. During the run `main` moved to `a4561a26` (close of arch-build-ABC-193: `.grugops/queue/`, `plans/` only). Not re-merged; `git merge-tree --write-tree a4561a26 a530222a` is clean.
- **Commit `a530222a`:** 4 sealed notes and a `## QE` section on the ABC-192 page. No edits to `src/`, `tools/`, `AGENTS.md`, `memory-bank/`, `package*.json`, the board, the trace or other pages.
- **Notes** (sealed with `admitAndAppend`, grugops 2.1.0 plugin cache; task `qe-ABC-192`; context root `../wt-qe-ABC-192/.grugops/context` passed explicitly; `at` from `date -u`; findings `[]` on all 4; no `finding`, because there was no §14-gate run):
  - `20261021T175649Z-qe-e2e-observation-dfdea161` (A1–A4);
  - `20261021T175649Z-qe-e2e-observation-5eac2736` (mutants);
  - `20261021T175649Z-qe-e2e-observation-25aa4be6` (gates and artifacts, recorded as an observation);
  - `20261021T175649Z-qe-e2e-decision-21079de0` (verdict and gap register).

**Criteria** (my own runs, taken before I opened the SE's `…8fd17c58`/`…b5cf0eb3`/`…d7675de0`; those notes agree on every number):
- **A1 MET.** `-t "ABC-192"` at 400: 2 passed. M4 and M4b each red only A1, both one-file (exit 1) and under `npm test` (exit 1, 1993/1994, `success` false). The fault message names the arguments. Three test-side weakenings each red the in-memory plant table `[false,true,true,true,true]`.
- **A2 MET.** Installed 4.1.11 is green. Scratch manifest 4.1.12 reds only A2, one-file and `npm test` (1993/1994). The message carries items (1)–(4) in order, compared by content. 4.2.0, 5.0.0, 4.1.11-beta.1 and 4.1.10 red too. A missing or empty version reds on the `toMatch` guard, without the list.
- **A3 MET.** All of `src/cli.test.ts` at 400: 95/95, `N8-LANE` (28) and `ABC-173` `C2` green. The diff removes 0 lines and adds no spawn, exec, Worker or timing call.
- **A4 MET.** `main...b5b8b0f9` = `src/cli.test.ts` + 3 SE notes. Waiver empty. Gates below. `AGENTS.md` is byte-identical base→tip (15,797 B).

**Mutants** (scratch copy outside the repository: `git archive bfccd564` + a full real `node_modules`, private `TMPDIR`; each restored and checked with `cmp`; the final `diff -rq` of `src/` and `tools/` against the worktree is clean):
- **M4 and M4b:** killed (above).
- **24 own call-site mutants:** the A1 row kills 15: an alias with stderr, an alias with stdout, `guard.call`, a spread, `...rest`, `process["stderr"]`, `process["stdout"]`, a stderr variable, a stderr wrapper, a stdout wrapper, the call moved to a helper (2 forms), a 4th argument, `export default setup;` declared apart, and a named-only `setup`.
- **9 survive the row:**
  - `if (false)` and an early `return`: killed by lint and by ABC-173 A4/A6.
  - an uncalled arrow: killed by ABC-173 A4/A6.
  - a top-level `setup =` reassignment: killed by ABC-173 A5.
  - the `guard` body writing to stderr: killed by ABC-176 A1/A2, A3.
  - a named `setup` export beside the default: harmless, because vitest uses `m.default`.
  - **`try { guard(…stdout) } catch {}`: survives every gate.** The capture still prints no integer, but all 1994 tests ran at 4192 MiB → `QE-192-a`.
  - **a shadowed `process` in `setup`: survives every gate, and the capture prints `0`, exit 0 (SEC-173-1)** → `QE-192-b`.
  - `process.stdout.write` redirected: harmless, because jq gets 0 bytes and prints nothing.
- **Version mutants:**
  - `@vitest/coverage-v8` alone at 4.1.12: green (not on the capture path).
  - lockfile + manifest bump with no reinstall: green until install.
  - the row rewritten to read the lockfile: green even with 4.1.12 installed. The SE's `node_modules` read is the stronger choice.
- **Against QE-176-a/-b's intent:**
  - only the shadowed `process` matters formally (deliberate, INFO);
  - the try/catch survivor breaks ABC-173's cap, not the stream (LOW).

**Gates at `bfccd564`:**
- lint 0 (116 files), typecheck 0, build 0.
- `npm test` 0: 59 files, 1994/1994. `last-run.json` reads `success` true, `exitCode` 0, 0 failed, 0 pending, 0 todo.
- Skip count (as spelled, 128) is `0`, pipe 0/0. `test-skip-integrity.js --skip-count 0` reads `No findings.`, exit 0.
- Heap: one-file runs 400, whole-suite 128. No timing.

**UAT waiver:** `git -c core.quotePath=false diff --name-only 47a3c9a1 b5b8b0f9 | grep -v '\.test\.ts$' | grep '^src/'` printed nothing. The same is true over `5d1fbaa7~1 5d1fbaa7` and over `ec5c42d7 bfccd564`. `--numstat … -- src` gives `98 0 src/cli.test.ts`, with no binary row. WAIVED; not a signature.
**AR-191-GITENV stand-in:** the `git config --get-regexp …` filter and `printenv GIT_EXTERNAL_DIFF` printed nothing in my shell, in the worktree and in the main checkout. No git config was set.

**Gap register:**
- **QE-192-a (LOW):** `setup`'s guard call wrapped in a swallowing `try/catch` survives the row, lint and the suite. A prefix-less run is then not stopped (1994 tests at 4192 MiB, exit 1). That is against ABC-173's "never runs uncapped", outside QE-176-a. Possible closure: A1 requires the call to be a direct statement of `setup`'s body. That also kills the dead-call shapes. Owner: BA/PM.
- **QE-192-b (INFO):** a `process` binding shadowed inside `setup` survives every gate, and SEC-173-1 is back (capture `0`). It needs a deliberate edit. Recommend accept.
- **QE-192-c (INFO):** the row fails closed on behaviour-equivalent call-site refactors. A future refactor must update the row.
- **QE-192-d (INFO):** A2 reads the `vitest` manifest only. A `@vitest/coverage-v8`-only bump, or a lockfile bump before reinstall, stays green. vitest's banner reads the bundle, not the manifest.

**Fence breach:** none. Scratch work was confined to the new directory `…/scratchpad/qe192/` (it did not exist before; no other hop's file was written). Worktree `node_modules` is the house symlink to the main checkout, gitignored. `../wt-ABC-193` was not touched. No push, no force, no amend, no rebase, no merge into `main`.

| ABC-192 (QE) | QE gate: A1–A4 met by own runs; M4/M4b red only A1 and a vitest 4.1.12 bump reds only A2 with the four-item re-run list, one-file and npm test; 24 own call-site mutants (row kills 15; 4 survive all gates) + 9 version/test-side readings | — | — | QE-176-a, QE-176-b, SEC-173-1, ABC-173, N8_SPAWN, NFR-008, AR-191-GITENV, AR-191-QUOTEPATH, QE-192-a (LOW), QE-192-b/c/d (INFO) | grugops/qe-ABC-192 @ a530222a (merge bfccd564 = tip b5b8b0f9 + main ec5c42d7)<br>plans/tickets/ABC-192-nothing-pins-the-stream-setup-hands-the-guard-and-a-vitest-bump-re-runs-no-capture-arm.md, .grugops/context/qe-ABC-192/notes/ (4) | lint/typecheck/build 0; npm test 59/1994 success; skip-count 0 → No findings | UAT waived (0 production lines; quotePath waiver form prints nothing; GITENV stand-in prints nothing); not a signature | — | PASS_WITH_GAPS (QE done; In Review exit is the Orchestrator's) |
