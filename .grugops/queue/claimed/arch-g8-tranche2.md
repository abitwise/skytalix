---
subtask: arch-g8-tranche2
role: architect-design
ticket: ADR-0046 tranche 2 (NFR-008 lane wall)
ref: .grugops/context/arch-g8-tranche2/
branch: new grugops/arch-g8-tranche2 from main (worktree .claude/worktrees/arch-g8-tranche2)
width: records only; no vitest, no timing. Leave no process running.
---
# Architect (records): tranche 2 opens (G8 head 9.82 s > 9.6 s)
## Read
- ADR-0046 § Addendum 2026-10-30 (the tranche-2 trigger; the Alternatives table T2a–T2c) and § Ruling 2026-10-31; ADR-0035 D6.
- qe-ABC-245's gates/G8 note (…af467c7b) and findings (…cf53b0ed: QE-245-b noise; head run 3 at 10.19 s slow across all files; base 9.44 s).
- G8 history on main: qe-ABC-243 9.28, qe-ABC-242 9.41, qe-ABC-221 9.84 (inadmissible), qe-ABC-245 9.82.
- ABC-246's page (it adds 2 rows to src/uci-session.test.ts).
## Do
- Record tranche 2 as opened, with the reading. Re-open the candidates as the addendum says: T2a is now stale, because ABC-221 has landed; re-cost it. Also cover T2b, T2c and any new candidate a census of the current lane finds.
- Give each candidate its estimated saving, risk and coverage loss.
- Say whether the noise (QE-245-b) changes what the trigger means. The trigger itself is not yours to waive without a dated amendment, and if you would move it, that change is PROPOSED.
- Recommend one for BA/PM's ruling. Name the ticket BA/PM should cut; do not cut it.
- If the lane is still over 9.7 s after tranche 2, NFR-008 goes to the owner. Say how that would be read.
## Fences
ADR-0046* only (and ADR-0035 only if a dated cross-reference is needed). No src/, tools/, data/, ticket or board edits. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `arch-g8-tranche2`, contextRoot = worktree), commit, `## Result` here, brief + claim to done/.
