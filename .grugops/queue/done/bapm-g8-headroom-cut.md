---
subtask: bapm-g8-headroom-cut
role: ba-pm
ref: .grugops/context/bapm-g8-headroom-cut/
branch: new grugops/bapm-g8-headroom-cut from main b0b1778e
width: records only, NO node/tests (a QE plays 40 games ALONE on this host)
---
# BA/PM: cut the default-lane headroom ticket; amend ABC-242 and ABC-221 (arch-g8-headroom)
## Read
Branch grugops/arch-g8-headroom @ 5fd3eee7 (read with `git show`): ADR-0046 § Addendum 2026-10-30 (R1–R4, PROPOSED as an extension of
the accepted step rule — your word at the cut makes it so, as at ABC-177), ADR-0035 addendum, its Result in
.grugops/queue/done/arch-g8-headroom.md and raw/note-decision.md. qe-ABC-229 `…0b7fd4f6` (G8 9.90 s, QE-229-a).
## Do
1. Cut a new ticket (S, P1, test-only, EPIC-010 or the NFR-008 owner's epic): time-blind virtual-clock rows in src/cli.test.ts and
   src/uci-session.test.ts take the coarsest step that keeps QE's caught-mutant set (R1–R4; CLI/UCI paired rows move together; row
   count, bounds and titles unchanged). Acceptance: G8 head median ≤ 9.4 s (design target; NFR-008 stays 10 s); QE per-row node
   count + caught-mutant comparison; N8-LANE on the two files. Triggers (> 9.4 s → second batch; > 9.7 s after it → owner) in Notes.
   Pull order: before ABC-242, ABC-221 and ABC-243 (shared files). Score DoR.
2. Amend ABC-242: its rows follow R1–R4; the lane form is level 1's 100 ms at the coarsest safe step, not QE's 2 000 ms probe set-up.
3. Amend ABC-221 A9: each real-engine row records its clock reads per search; period rows stay stubbed.
4. ABC-243: note the ≈ +0.03 s estimate, ordering after the new ticket.
## Fences
Records only. No src/, tools/, data/, board, ADRs. Never push/force/amend/rebase/merge into main. No host paths. Run no node or tests;
draft a seal script (context-io admitAndAppend only) and give me the command. Never `while pgrep -f`.
## Publish
Notes (task `bapm-g8-headroom-cut`), commit, `## Result` + trace row here, brief + claim to done/.
