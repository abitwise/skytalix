---
subtask: bapm-rule-QE-178
role: ba-pm
tickets: [ABC-178]
branch: main (records only; commit nothing, the Orchestrator commits)
ref: .grugops/context/bapm-rule-QE-178/
width: 3 (beside ticket-to-pr-ABC-189 and ticket-to-pr-ABC-190)
---

# BA/PM (records only): rule QE-178-a and QE-178-b (LOW) from ABC-178's QE gate. B7/B8 (QE-178-c/-d) are the Orchestrator's, not yours

## Read first
- QE verdict and gap register `../wt-qe-ABC-178/.grugops/context/qe-ABC-178/notes/` (verdict `…1ad5f522`, B6 `…f910b911`) and its `probe/`; the `## QE` section on ABC-178's page in that worktree.
- ABC-178's page (main's tree) and its 2026-10-22 block; ABC-197's page; your own `bapm-rerule-ABC-178` notes; the owner delegation `…5aaf7cec` (you rule LOW gaps yourself; nothing goes to the owner).

## Do
- **QE-178-a:** QP1b (a hold leaking only after a session's second `go infinite`) survives the whole lane at base and tip. It is not a regression (the pre-ABC-177 file missed it too).
- **QE-178-b:** QP1c (a fresh session's `stop` releases another session's hold into the holder's own output) survives. One extra assertion re-checking session 1 after session 2 kills it (QE scratch-measured).
- Rule each: cut / fold / accept. Folding into ABC-178 itself is allowed only if it stays XS, additive and one file, and it would need a re-build and a QE re-read. Folding into ABC-197 (same file) is an option. Weigh row cost against NFR-008's unmeasured headroom. Next free id ABC-198.
- QE-178-e (INFO; the lane counts on the page predate ABC-168's merge): correct the page's count line, or agree no action.
- One `_Updated:` line at the top of `plans/board.md` and the card(s) you touch; a dated block on each page you touch.

## Fences
- Only `plans/` and your notes (context root: this repository's `.grugops/context`). No `src/`, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config. Commit nothing. Run no vitest and take no timing. Touch no board card other than ABC-178's and ABC-197's (and a new card, if you cut one).

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-rule-QE-178`). Pass this repository root's `.grugops/context` explicitly. Every `at` from `date -u`. Include a `kind: decision`.
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/bapm-rule-QE-178.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.
