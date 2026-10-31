---
subtask: bapm-tranche2-ruling
role: ba-pm
ticket: ADR-0046 tranche 2; ABC-246; ABC-229; EPIC-010
ref: .grugops/context/bapm-tranche2-ruling/
branch: new grugops/bapm-tranche2-ruling from main (worktree .claude/worktrees/bapm-tranche2-ruling)
width: records only; no vitest, no engine, no timing (QE holds the host ALONE). Leave no process running.
---
# BA/PM (records): rule on tranche 2 and W1; cut the tranche-2 ticket; owed folds
## Read
ADR-0046 § Addendum 2026-10-31 (arch-g8-tranche2: candidates, recommendation, W1) and its notes (…28d7bc3b, …f1e25b52); qe-ABC-245's G8 note; ABC-246's page; ABC-229's page and qe-ABC-229's notes; EPIC-010's tickets table; ADR-0035 B3 (T-QEHOP-GROWTH).
## Do
1. **Rule on the Architect's PROPOSED tranche-2 design** (T2c + T2a narrow + T2d, one S test-only ticket, no coverage lost by construction). Accept, amend or reject, with reasons, in a dated line. If accepted, cut the ticket (next free id, S, P1, EPIC-010), ordered after ABC-246 (same file).
2. **Rule on W1** (a reading over 9.7 s is confirmed by a second window of 3 head runs; the median of all 6 decides). It moves no level. Dated line.
3. **ABC-246's page:** update the line that expects its own G8 to fire the 9.6 s trigger (that trigger is spent).
4. **ABC-229:** close the page (merged 5953c631, QE PASS_WITH_GAPS) and update EPIC-010's tickets row 5.
5. **T-QEHOP-GROWTH** (fired: notes on main > 4 000): record a disposition, a ticket or a QE re-read hop, per ADR-0035 B3, or say why none is owed.
## Fences
Records only: plans/tickets/, plans/epics/, and dated ruling lines in ADR-0046 if your ruling must sit there. No board, src/, tools/ or data/ edits. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `bapm-tranche2-ruling`, contextRoot = worktree), commit, `## Result` + trace row(s) here, brief + claim to done/.

## Result
- **T2-R: ACCEPTED with five amendments, cut as `ABC-248`** (S, **P1**, `EPIC-010`, test-only, DoR **10/10**, Backlog
  recommended Ready; pull order **after `ABC-246`**, same file). The dated ruling is `ADR-0046` § BA/PM ruling
  2026-10-31, with a § Status line. Page: `plans/tickets/ABC-248-…-tranche-2-test-only.md`.
  - **Why:** it is the only set sized to the noise reading (about −0.3 s against a lane centred near 9.5 s) with no
    default-lane coverage lost by construction. Each lever reverts alone. One ticket, because three ALONE gates for one
    −0.3 s remedy would each be below what n = 3 resolves.
  - **No owner word:** D1 bound `ABC-177`. The owner-accepted text names tranche 2 as O3 "for a BA/PM ruling" (D4,
    § Alternatives), and T2a narrow is a parity-gated subset of O3 into an existing lane.
  - **T2b not chosen:** two `ADR-0050` guards for about 0.1 s more; that trade is the owner's (framing (b)).
  - **Amendments:** (1) the six A5 rows named, titles byte-identical under an "[deep, ENGINE_DEEP=1]" describe;
    (2) `WRONGSIDE` in the frozen mutant list; (3) retitle word for `QE-208-a`/`-b`; (4) T2d census capped at two
    beyond A4-a2; (5) saving graded on nodes, `N8-LANE` ≤ 650 ms, `G8` ≤ 10 s, 9.4 s a target, W1 at this gate.
- **W1: word given with four clarifications** (same tree; median of six = mean of 3rd and 4th, > 9.7 s routes;
  second window held to the PREREG, re-run once, then the first reading routes; not a merge gate). It moves no level.
  **Why:** `ABC-245` head 9.82 s against six pooled 9.51 s; 9.7 s is inside one window's noise; the 10 s line is
  unfiltered.
- **`ABC-246`:** the spent 9.6 s line struck with a dated mark (NFR triggers, DoR row 6); graded on 10 s alone; W1
  starts at `ABC-248`. Dependencies line names `ABC-248` after it. Scope and DoR unchanged.
- **`ABC-229`:** closed Done (`5953c631`; QE PASS_WITH_GAPS `…2afef8bf` signs UAT). QE-229-a → `ABC-244`/`ABC-248`;
  QE-229-b recorded, no ticket; QE-229-c closed; QE-229-d recorded, no ticket. `EPIC-010` row 5 folded, row 23 added.
  Rows 19–21 are still stale in that table (named in the fold line, not folded).
- **`T-QEHOP-GROWTH`:** a QE re-read hop is owed (ADR-0035 B3's own action), **no ticket**. ALONE, LOW, blocks
  nothing, not inside `ABC-248`'s gate. Dispatch is the Orchestrator's. 4 209 notes at `209f4c5f`.
- **Commits:** records `60f08f49`; notes and this Result in the next commit.
- **Notes (sealed):** decision `20261031T071545Z-ba-pm-decision-917f5fd3`, observation
  `20261031T071545Z-ba-pm-observation-837721de`.
- **Trace rows:** ABC-248 ← T2-R ← `ADR-0046` § Addendum 2026-10-31 ← QE-245-b ← NFR-008 ← EPIC-010; W1 → ADR-0046;
  ABC-229 → Done ← `qe-ABC-229` `…2afef8bf`; ABC-246 ← ADR-0046 (spent line); T-QEHOP-GROWTH ← ADR-0035 B3. Refs on
  both notes.
- No board, `src/`, `tools/`, `data/`, `AGENTS.md` or ADR-0035 edit. Nothing run, timed, pushed or merged; no process
  started.
