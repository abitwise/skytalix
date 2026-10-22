---
subtask: ticket-to-pr-ABC-178b
role: software-engineer
tickets: [ABC-178]
branch: grugops/ABC-178 (tip efaa0a76), in the existing worktree ../wt-ABC-178
ref: .grugops/context/ticket-to-pr-ABC-178b/
width: 3 (beside qe-ABC-189 and qe-ABC-190)
---

# SE: ABC-178 re-build. Fold QE-178-b into R1: one added line that re-reads session 1's output after session 2 has run. Test-only, additive, one file

## Read first
- ABC-178's page (main's tree). **The newest dated block (BA/PM `bapm-rule-QE-178`, 2026-10-22) governs**: B1 gains the re-read limb; B3 allows the re-check line and comments citing `QE-178-b`; B5's census sum must equal QE's tip reading of 608,965; B6 adds QP1c. B4, B7, B8 and B9 are unchanged.
- BA/PM `.grugops/context/bapm-rule-QE-178/notes/` (`…1f4936b2`, `…34bf730b`); QE `../wt-qe-ABC-178/.grugops/context/qe-ABC-178/` (verdict `…1ad5f522`, B6 `…f910b911`, and `probe/` incl. `gp-qe178.mjs` @ `d781e5e5`); your own `ticket-to-pr-ABC-178` notes (`.grugops/context/ticket-to-pr-ABC-178/notes/` in main's tree).

## Do
- In `../wt-ABC-178`: `git merge main` first (a merge, no rebase); report the sha.
- **Red first:** on scratch copies (full `node_modules`), QP1c passes the lane at the current tip and goes red at the new tip on R1; QP1 and QP1a stay red; QP0 stays green. Report QP1b, but don't grade it (accepted).
- Implement exactly the fold. Every line of base's file stays byte-identical; the change over base stays additive (B3). The test count is unchanged from `efaa0a76` (the re-read is an assertion, not a new row). B5's census sum is 608,965.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (60 / 1996); skip-count capture as spelled → `test-skip-integrity.js`; `UCI_DEEP`. Heap 128 multi-file, 400 one-file. **No timing claims**; B7/B8 come later, on a quiet host.
- UAT waiver form must print nothing.

## Fences
- Only `src/uci-session.test.ts`, plus your notes in `../wt-ABC-178/.grugops/context/ticket-to-pr-ABC-178b/` (the context root to pass; committing them on the branch is fine, since B3 reads `src/`). No other file, `plans/`, `AGENTS.md`, `memory-bank/`, git config, other worktrees. Commit on `grugops/ABC-178` only. Never push, merge into `main` or `--force`. Keep temp files in your scratch area, not `/tmp`.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-178b`). Every `at` from `date -u`. Include a `kind: decision`. Append-only.
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/ticket-to-pr-ABC-178b.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.
