---
subtask: qe-ABC-189
role: qe-e2e
ticket: plans/tickets/ABC-189-nothing-pins-the-value-of-package-json-bin-so-bin-pointing-at-src-uci-ts-passes-every-test.md
ref: .grugops/context/qe-ABC-189/
branch: grugops/ABC-189 (tip 91883f94; code deb555d2; base 823a9885); worktree ../wt-ABC-189 (read only)
width: 3 (beside qe-ABC-190 and bapm-rule-QE-178)
---

# QE gate for ABC-189: one assertion pins `package.json` `bin` to `{ skytalix: "dist/uci.js" }` in `ABC-042` A10. Your red read of A2 closes AR-168-BINPIN

## Do
- Create your own worktree `../wt-qe-ABC-189` on `grugops/qe-ABC-189` from the tip. **Merge the current `main` into it first** (a merge, not a rebase) and report the merge sha.
- Verify A1–A4 with your own runs **before** opening the SE's notes (`…96c58135`, `…5098b7a3`, `…36feef6a` on the branch).
- **A2 red read, independently:** on scratch exports (full `node_modules`; never edit the real `package.json`), every wrong `bin` the page names goes red at the tip on A10 alone and passes at base. Build plants of your own beyond the page: `bin` as a bare string, an extra second key, a missing key, `./dist/uci.js`, a wrong command name. Say for each whether the assertion catches it and whether it should.
- ABC-187 A5's closer count stays 9; the `AGENTS.md` byte guard is untouched.
- Gates at your merge: lint, typecheck, build; `npm test` + `last-run.json` success; skip-count capture as spelled → `test-skip-integrity.js`. Heap 128 multi-file, 400 one-file. No timing.
- UAT waiver form must print nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register (`QE-189-x`). Say whether AR-168-BINPIN's close condition is met.

## Fences
- Work only in `../wt-qe-ABC-189` and scratch exports. Commit typed notes inside your worktree (context root: `../wt-qe-ABC-189/.grugops/context`) and a `## QE` section on the ABC-189 page there.
- No edits to `src/` on the tip, `package*.json`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`, other pages. Do not touch other worktrees. Never set git config. Never push, `--force`, `--amend` or rebase; never merge into `main`. Keep temp files in your scratch area, not `/tmp`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-189`). Pass your worktree's `.grugops/context` explicitly. Every `at` from `date -u`. Include a `kind: decision`. Append-only.
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/qe-ABC-189.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.
