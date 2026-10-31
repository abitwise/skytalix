---
subtask: arch-qe242a-ruling
role: architect-design
ticket: ABC-242 (closed) / ADR-0046
ref: .grugops/context/arch-qe242a-ruling/
branch: new grugops/arch-qe242a-ruling from main (worktree .claude/worktrees/arch-qe242a-ruling)
width: records only; run nothing heavier than reading. No vitest, no timing.
---
# Architect (records): QE-242-a ruling + two owed ADR text items
## Read
qe-ABC-242's notes (findings …b9f3cd67, census …51079df4) and se-ABC-242's census note, all on main under .grugops/context/;
ADR-0046 § Addendum 2026-10-30 R1–R4 and ABC-244's condition 2; ADR-0052 near line 320 (D7, "If the owner rejects it");
ABC-244's ticket page (BA/PM's word).
## Do
1. **QE-242-a (MEDIUM).** Rule whether ABC-244 condition 2 reads a blunder per level call (which admits step 10 as built) or per child search (only step 1 qualifies, ≈ +2.5 s of lane wall, so it breaches G8).
   - Facts: kill sets are equal at every step; at step 10 four of five children run the unabortable depth 1.
   - Write the ruling as a dated addendum line to ADR-0046. If the ruling requires changing any merged row, name a ticket for BA/PM to cut; do not cut it.
   - If the ruling changes an owner-accepted decision, mark it PROPOSED for the owner.
2. **ADR-0052 D7:** the "If the owner rejects it" wording is stale, because the owner accepted ADR-0052 on 2026-10-30. Fix it to read as accepted, by a dated line.
3. **ADR-0046 status line:** note that BA/PM's word was given on ABC-244's page.
## Fences
Records only: memory-bank/50-decisions/ADR-0046*, ADR-0052*. No src/, tools/, data/, board or ticket edits. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `arch-qe242a-ruling`, contextRoot = worktree), commit, `## Result` here, brief + claim to done/.
