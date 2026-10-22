---
subtask: qe-ABC-196
role: qe-e2e
ticket: plans/tickets/ABC-196-a-drifted-anchor-or-a-dropped-capability-line-turns-a-twin-row-of-r2-mutants-into-a-silent-control.md
ref: .grugops/context/qe-ABC-196/
branch: grugops/ABC-196 (tip 0492a007; harness 6d15460b; base a7857e0b); worktree ../wt-ABC-196 (read only)
width: 1
---

# QE gate for ABC-196: each twin-referenced row of `r2-mutants.sh` (PP-TPL, PP-REDIR, RA-PLUS, PP-EDIT, SP-N5) asserts its expected limb 2/3 verdict, and a drift goes red naming `row:limb`. Harness only, 0 `src/` lines

## Do
- Create your own worktree `../wt-qe-ABC-196` on `grugops/qe-ABC-196` from the tip. **Merge the current `main` into it first** (a merge, not a rebase), run everything at that merge, and report the merge sha.
- Verify every criterion (A1–A7) against the page with your own runs **before** opening the Architect's notes (`…7cd5d10a`, `…d955ee60` on the branch).
- **Re-plant independently:** reproduce the base hole (D2, an `src/cli.ts`-only refactor, a dropped `leak()` each read 25 of 25 at rc 0 on today's harness), then the fixed harness reds each, naming only the silent rows. Build drifts of your own beyond those. In particular, probe the limit the builder declared: the guard checks the verdict word, not WHICH line fires, so a drift that leaves a limb firing on another line stays green. Measure whether such a drift is constructible against these five plants, and rate it.
- Head output byte-equal to today's harness at base (177 lines); `r2-mutants.out.txt` unchanged and still equal to a run at its tip; pre-ABC-195 instrument `2c0c1985e6607110` still gives `MISMATCH: RA-PLUS SP-N5` with the same 9-limb DIFFER line.
- Plants only in scratch clones (own `.git`, private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR`, `GIT_CONFIG_NOSYSTEM=1`). **Never** set git config or attributes in this repository, any worktree, or your real `HOME`; never touch `node_modules/` in main's checkout. Use `/usr/bin/diff`.
- **Gates** at your merge: lint, typecheck, build; `npm test` + `last-run.json` success (base count at your merge); skip-count capture as spelled → `test-skip-integrity.js`. No timing.
- UAT waiver in the owner's form: `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` prints nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register (ids `QE-196-x`, each with severity and a proposed route).

## Fences
- Work only in `../wt-qe-ABC-196`. Commit typed notes written inside your worktree (context root: `../wt-qe-ABC-196/.grugops/context`), and a `## QE` section on the ABC-196 page there.
- No edits to the harness, the instrument, ADRs, `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` or other ticket pages. Do not touch `../wt-ABC-196`, `../wt-ABC-168` or `../wt-qe-ABC-168`.
- Never push, `--force` (including `git worktree remove --force`), `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-196`). **Pass your worktree's `.grugops/context` as the context root explicitly.** Take every `at` from `date -u` (UTC). Include a `kind: decision`. Append-only; record artifacts as `observation` (no §14 gate run, no `finding`).
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |`, exactly 10 cells, as a plain table line. Write your done record as `.grugops/queue/done/qe-ABC-196.md` (this brief plus a `## Result` section) and `.claim.md`, in main's tree, uncommitted. Leave this pending file and the claim directory alone.
