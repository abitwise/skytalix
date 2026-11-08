---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-08T08:53:42Z
subtask: arch-ABC-292-probe
role: architect-design
ref: .grugops/context/arch-ABC-292-probe/
branch: new grugops/arch-ABC-292-probe from main (1faefe3f) — worktree .claude/worktrees/arch-ABC-292-probe
width: ADR-0076 d10 step 4, d13's premise probe, in two stages. Scratch instruments only; no src/ commit, no build, no games.
---
# ABC-292: the premise probe (d13)
d10 step 3 is met: QE's freeze …277b648a, freeze commit e88e91f9, merged at 1faefe3f (`git merge-base --is-ancestor e88e91f9 main` passes). fixtures.json sha256 6dc902c6…ffbfe4, pre-ticket.json ed6a6fda…146ff36. Your PREREG commit must descend from e88e91f9; PR3 reads fixtures.json.
**Stage A, now:** seal the PREREG decision note exactly as d13's Sealed form says, committed before any measured run. Name a batch order with PR8 and PR10's lane read last. The load-only smoke may come first. Then run PR1–PR7, P0, PR9, PR10's untimed parts and PR11, under the host lock, one core, one run at a time. Then STOP and report. Apply rules 1, 2 and 4 as sealed: a NOT MET there ends the probe and nothing timed runs.
**Stage B, only on a later brief line from me citing the owner's held-host word:** PR8 (rule 3) and PR10's lane read. Do not run any timed row in stage A, and do not take a held window on your own reading of host load.
Also owed in this hop, records only: a dated pointer in ADR-0024 (§ Status fifth block and d4: "in force at ABC-289's merge" will not come; d4 stands as written, …89b7220c).
Lock: every run as `flock <scratch>/<home>/<repo>/host-test.lock <cmd>`. Scratch copies via `git archive`, outside the repository. Scripts and outputs go to raw/ with placeholders. No bar moves after a reading; a miss is not re-played. Fences: ADRs, your task records, scratch. No src/, ticket, EPIC or board edit. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); commit after each stage; at stage A's stop, a ## Stage A block in this brief (keep it in claimed/). Before each commit, run `node tools/grugops/records-path-check.js --base main`.
