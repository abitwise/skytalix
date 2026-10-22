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

## Result (ba-pm, 2026-10-22T15:26:41Z): **QE-178-b FOLDED into ABC-178** (R1 re-reads session 1 after session 2; 1 added line, 0 nodes; XS/P2; DoR 10/10). **QE-178-a ACCEPTED**, no ticket, with reopen triggers. **QE-178-e corrected** on the page. No ticket cut; next free id stays ABC-198. B7/B8 (QE-178-c/-d) not ruled (the Orchestrator's).

Records only, uncommitted on `main` (`823a9885` at start and finish). Notes are in `.grugops/context/bapm-rule-QE-178/notes/`. They were sealed with grugops 2.1.0 `context-io.js` `admitAndAppend`, with this checkout's `.grugops/context` passed explicitly, and both read back through `readContext`:
- `20261022T152530Z-ba-pm-decision-1f4936b2`: the ruling per gap, the fold's limits, the reopen triggers;
- `20261022T152530Z-ba-pm-observation-34bf730b`: the readings (QE's variant replays and probe outputs, R1 at `efaa0a76`, the one production session at `src/uci.ts:76`, `main` unchanged in `src/` and lane inputs since `5d3832ef`, and the cost estimates).

| gap | ruling |
|---|---|
| QE-178-b (LOW) | **FOLD into ABC-178.** It is R1's own claim ("not released by a fresh session"). B1 never said when to read session 1, which is BA/PM's wording defect. One added assertion (`held.out` re-read after session 2) kills QP1c and keeps QP1/QP1a red (QE scratch, file mode). It costs 0 nodes, so `NFR-008` has no weight here. ABC-178 is waiting In Review for its owed timing hop anyway, so the fold adds no timing. A cut would cost a full ticket cycle for one line. `ABC-197` would tie it to an unrelated ≤ 9.2 s gate, and it would die with R2. Amended: B1 (re-read limb), B3 (the re-check line plus `QE-178-b` comments allowed), B5 (census sum unchanged, 608 965), B6 (QP1c red at file and ≥ 1 red in the lane; QP1a/QP1b reported, not graded). B4, B7, B8 and B9 are unchanged. The QE re-read runs before the B7/B8 hop, never inside its window. |
| QE-178-a (LOW) | **ACCEPT, no ticket.** Not a regression (it survives before `ABC-177`, at base and at the tip). There is one UCI session per process in production. The wrong build is contrived, and its family has no end (hold count 2, 3, ponder against infinite, …). A two-hold row costs ≈ 1 310 nodes ≈ +0.004 s wall (estimate) and needs its own timing hop, against `NFR-008` headroom that is `UNKNOWN - verify` today. Not folded into `ABC-197`: that would add search to the budget it waits on. **Reopen if:** production runs more than one UCI session per module instance; `uci-session.ts` gains state that counts holds or carries a hold across a `go`; or a QP1b-shaped leak is seen live. |
| QE-178-e (INFO) | **Corrected** in the page's new block: lane 1 995 → 1 996. `main` has changed no `src/`, config or lane file since `5d3832ef`. The older blocks are kept as the record. |

Files:
- `plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md`: one dated block at the top (the ruling table, the amended criteria, the DoR re-score). A three-way `git merge-file` against `../wt-qe-ABC-178`'s copy, which appends `## QE`, merges with no conflict.
- `plans/board.md`: one `_Updated:` line at the top, and a dated tail on ABC-178's card. No column moved.
- `.grugops/context/bapm-rule-QE-178/notes/` (2 notes, new).
- This done record and `bapm-rule-QE-178.claim.md`.

Not touched:
- `ABC-197`'s page and card, other cards, and `plans/traceability.md` (the row is below, for the Orchestrator);
- `src/`, `AGENTS.md`, `memory-bank/`, branches, worktrees (QE's worktree was only read), git config;
- the pending file and the claim directory;
- the other hops' uncommitted edits on main's tree (`board.md` column lines, `traceability.md`, the `ABC-190` files).

No vitest, no timing, no probe run. No stop.

### Trace row (10 cells, header order)

| ABC-178 (BA/PM QE-178 ruling) | ruled QE-178-b FOLD into ABC-178 (R1 re-reads session 1 after session 2; 1 added line, 0 nodes; B1/B3/B5/B6 amended; DoR 10/10; re-build + QE re-read before the owed B7/B8 hop); QE-178-a ACCEPT (no ticket; not a regression, one session per process, endless variant family, NFR-008 headroom unmeasured; reopen triggers on the page); QE-178-e corrected (lane 1 995 → 1 996) | EPIC-007 | — | NFR-008 (headroom UNKNOWN - verify; fold adds 0 nodes), N8-LANE; QE-178-a, QE-178-b, QE-178-e; notes …1ad5f522, …f910b911, …5aaf7cec, …1f4936b2, …34bf730b | main @ 823a9885 (uncommitted, records only)<br>plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md, plans/board.md | — (records only; QE's gp-qe178 and r1recheck outputs read: QP1c red on R1 with the re-check, file mode) | — (fold is test-only; waiver form expected empty) | — | ABC-178 stays In Review; recommended In Review → In Development for the re-build (Orchestrator's move); ABC-197 unchanged; no cut; next free ABC-198 |
