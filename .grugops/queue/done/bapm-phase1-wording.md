---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T23:12:17Z
subtask: bapm-phase1-wording
role: ba-pm
ref: .grugops/context/bapm-phase1-wording/
branch: new grugops/bapm-phase1-wording from main (worktree .claude/worktrees/bapm-phase1-wording)
width: records only, beside se-ABC-238 (src only).
---
# BA/PM: Phase 1 page wording after ADR-0058 / ADR-0025 T2, plus owed LOW cleanups
## Inputs
arch-epic011-phase1 observation …1dcdd8c7 (wording changes for BA/PM), decisions …2c2c1df6 (T1), …3209a6d0 (T2).
## Do
1. ABC-238: DoR row 10 met (reading (b): build may start; read/merge wait for owner acceptance); priority P2 consistent; drop stale "ABC-253 changes the TT keys first" lines; acceptance aligned to ADR-0058 (doors, drift check, falsifiers, reads). ABC-237: ADR half met, hold "ABC-238 merged or closed" stays; acceptance aligned to the T2 amendment (A2/A3, T6/T7; the 100-game read is a breakage guard at 100 ms — state the limit). ABC-257: carry the three re-checks. ABC-236: note the instability coupling. ABC-081: dated line (A1 revised by ADR-0058, binds older doors).
2. LOW cleanups: stale lane figures in EPIC-010 (l.~79–83) and EPIC-011 (l.~292–296) → Levels 57 / 577 s, ladder 18 / 23 s, UCI 241 / 291 s; ABC-253 front matter → dropped/Done.
## Fences
plans/tickets/ (named), plans/epics/EPIC-010*/EPIC-011* (named lines/rows), plans/traceability.md (append), your notes. Not board, memory-bank/, src/, tools/, data/. Run nothing. No push, force, amend, rebase, merge into main. Queue moves inside your worktree.
## Publish
Sealed notes (task bapm-phase1-wording, contextRoot = worktree's .grugops/context, never the plugin cache; cite only existing commits), commit, ## Result + trace row, brief + claim to done/.

## Result
- **By:** BA/PM (claude-opus-5-5), branch `grugops/bapm-phase1-wording` from `main` `b19af469`. Records only. Nothing
  was run, built or timed (source line cites were read, not run).
- **`ABC-238`: DoR 10/10, Ready** (page `status: ready`, `column: Ready`; the board move past Ready is the
  Orchestrator's). Row 10 met under reading (b): build may start; the read (A6) and the merge wait on the owner's
  acceptance of `ADR-0058`. Priority P2 throughout (row 9, Size and priority). Stale "`ABC-253` changes the TT keys
  first" struck. Acceptance aligned to `ADR-0058`: A1 doors (both recursions, older doors off, export lists +2); A2
  bound rows switch on/off, root never cuts; A3 both recursions, largest drift reported, 287 mate-corpus sign floor; A4
  miss = F4; A6 intent GAIN with the < 1 in 100 firing-share limit; F1–F6 dispositions; test note 3 (re-point and
  re-pin list, test-side firing count). Problem cite `:149-162` → `:156-170` (predicate `:163`).
- **`ABC-237`: DoR 9/10, stays Backlog.** The ADR half of row 10 is met (amendment PROPOSED, reading (b)); the
  `EPIC-011` sequence hold "`ABC-238` merged or closed" remains. A1/A2 to the amendment's rows plus the d5 drift row;
  A3 inference wording; A6 intent GAIN, the 100 ms limit stated (≤ 8.5 % of stores collide; a breakage guard);
  T6/T7 dispositions; stale "Before `ABC-238`" and `ABC-253` lines struck; cite `:135-147` → `:136-148`. P3 kept.
- **`ABC-257`:** the three re-checks carried into Dependencies and row 10 (pre-root argument within one search only;
  the 2026-10-26 d4 line false after T1; no-age depth-preferred across a game). "`EPIC-011` not started" struck. 8/10.
- **`ABC-236`:** the instability coupling (fail-high then fail-low under T1) in Dependencies. 9/10.
- **`ABC-081`:** dated line under A1 carrying `ADR-0058` d8 (in force only on acceptance plus merge).
- **LOW cleanups:** lane figures in `EPIC-010` (R-TC block, l.150–154, plus a dated note on l.74) and `EPIC-011`
  (l.292–297): Levels 57 / 577 s, ladder 18 / 23 s, UCI 241 / 291 s, ≈ 15 min together; old figures struck, kept
  (source `qe-EPIC-010-close` `…388b3044`). Same Levels "41" → 57 in the A5/A6 rows of `ABC-236`/`237`/`238`/`257`.
  `ABC-253` front matter → dropped / Done with a `closed:` line.
- **Beyond the named lines (flagged):** `EPIC-011` § Tickets rows 3 (`ABC-238` Ready, 10/10, waits-on updated) and 4
  (`ABC-237` waits-on) synced to the pages; the Levels fix in `ABC-236`/`257`.
- **Commits:** claim `2c32ca15`; records `dd8f0270`; notes `2503f088`. This Result, the trace row and the move to done/
  are in the closing commit.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, `at` from `date -u`; each
  reads back `sealVerdict` ok):
  - decision `20261101T231816Z-ba-pm-decision-3994e348` (`ABC-238` Ready);
  - decision `20261101T231816Z-ba-pm-decision-0e50918a` (`ABC-237` 9/10);
  - observation `20261101T231816Z-ba-pm-observation-57233c64` (couplings, cleanups);
  - observation `20261101T231827Z-ba-pm-observation-c976e602` (records commit). An `artifact-ref` was refused by
    admission (it needs `sha`/`gate_run`/`content_hash`; no gate ran on this hop) and was not faked.
- **For the Orchestrator:** board card for `ABC-238` (Ready → its pull) and `ABC-237`/`ABC-253` are yours. The owner's
  two acceptances and the NEUTRAL-bar question stand as `arch-epic011-phase1` left them.
