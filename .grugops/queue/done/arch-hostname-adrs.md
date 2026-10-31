---
subtask: arch-hostname-adrs
role: architect-design
ref: .grugops/context/arch-hostname-adrs/
branch: new grugops/arch-hostname-adrs from main (worktree .claude/worktrees/arch-hostname-adrs)
width: records only; no vitest, no engine, no timing (a 400-game batch holds the host ALONE). Leave no process running.
---
# Architect (records): reference machine spelled oeselg-dev in ADR-0035 and ADR-0046
## Read
Owner note .grugops/context/orch-2026-10-30a/notes/20261031T073000Z-orchestrator-decision-c2752305.md ("hostname spelling: oeselg-dev"); secnfr-hostname's observation …8b4e0311 (ADR-0035 L104, L754, L779; ADR-0046 L220).
## Do
Correct those 4 places to `oeselg-dev`, with a dated line citing …c2752305. Keep any verbatim owner quote as written, as secnfr-hostname did.
## Fences
ADR-0035* and ADR-0046* only. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `arch-hostname-adrs`, contextRoot = worktree), commit, `## Result` here, brief + claim to done/.

## Result
**DONE (records).** ADR commit `e4386e96` (base `main` `164a70c1`). Nothing run or timed.
- **Corrected `oeselg-devl` → `oeselg-dev` (pre-edit line numbers):** `ADR-0035` L104 (Status, addendum paragraph), L754 and L779 (`§ Addendum 2026-10-30 (SEC-REBASE-b)`); `ADR-0046` L220 (addendum § Context, "How the lane grew back"). Post-edit they are `ADR-0035` L104, L759, L784 and `ADR-0046` L225.
- **Dated lines:** one "Spelling 2026-10-31 (`arch-hostname-adrs`, records only)" line in each ADR's Status, citing `…c2752305` (`ADR-0035` L106–109, `ADR-0046` L23–26).
- **Kept on purpose:** no verbatim owner quote in either ADR carried the old spelling. The only `oeselg-devl` left are inside the two new dated lines (`ADR-0035` L109, `ADR-0046` L25), naming what was corrected.
- **Did not move:** no decision, ruling, figure, band or rule.
- **Notes sealed** (context-io `admitAndAppend`, read back 2): decision `20261031T062211Z-architect-design-decision-3328614b`, observation `20261031T062211Z-architect-design-observation-4129e138`.
- **Ran:** git, file reads, sed, the seal script. No vitest, timing, engine or build. No process left running. Nothing pushed or merged.
