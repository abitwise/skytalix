---
subtask: qe-ABC-178b
role: qe-e2e
ticket: plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md
ref: .grugops/context/qe-ABC-178b/
branch: grugops/ABC-178 (tip 0036e5c6; merge 0fb19ab9; prior QE'd tip efaa0a76); worktree ../wt-ABC-178 (read only)
width: 3 (beside qe-ABC-189 and security-nfr-ABC-190)
---

# QE re-read for ABC-178 after the QE-178-b fold (+2 lines in R1). Non-timing only: B7/B8 stay owed to a later quiet-host hop

## Do
- Continue your own branch `grugops/qe-ABC-178` in `../wt-qe-ABC-178`: merge `grugops/ABC-178` (tip `0036e5c6`) and then the current `main` into it (merges, not rebases). Report both shas.
- Re-verify the amended B1, B3, B4, B5, B6 and B9 (the newest BA/PM block on the page, `…1f4936b2`) with your own runs **before** opening the SE's notes (`.grugops/context/ticket-to-pr-ABC-178b/notes/` in main's tree).
- **B6:** your `gp-qe178.mjs` @ `d781e5e5`, byte-copied, on scratch copies (full `node_modules`): QP0 green; QP1, QP1a, QP1c red on R1 in the file run and ≥ 1 red in the lane; QP1b reported, not graded. Try one QP1c variant of your own (e.g. the release lands in session 1's output via a different keyword) and say whether the re-check kills it.
- B5: census sum 608,965 and R1 = 655; the sorted census equals your `census-H.tsv`.
- Gates at your merge: lint, typecheck, build; `npm test` + `last-run.json` success (60 / 1996); skip-count capture as spelled → `test-skip-integrity.js`; `UCI_DEEP`. No timing.
- UAT waiver form must print nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register. Carry QE-178-c/-d (B7/B8 OWED) forward unchanged. Say whether QE-178-b closes.

## Fences
- Work only in `../wt-qe-ABC-178` and scratch copies. Commit typed notes inside your worktree (context root `../wt-qe-ABC-178/.grugops/context`, task `qe-ABC-178b`) and update the `## QE` section on the page there.
- No edits to `src/` on the tip, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`, other pages. Do not touch other worktrees. Never set git config. Never push, `--force`, `--amend` or rebase; never merge into `main`. Temp files in your scratch area, not `/tmp`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-178b`). Every `at` from `date -u`. Include a `kind: decision`. Append-only.
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/qe-ABC-178b.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.
