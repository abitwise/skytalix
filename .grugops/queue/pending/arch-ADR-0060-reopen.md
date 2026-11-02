---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T15:20:12Z
subtask: arch-ADR-0060-reopen
role: architect-design
ref: .grugops/context/arch-ADR-0060-reopen/
branch: new grugops/arch-ADR-0060-reopen from main (at dispatch) — worktree .claude/worktrees/arch-ADR-0060-reopen
width: records; probes ≤ 5 min each, wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`, node counts only, no timing.
---
# Re-open ADR-0060 (P1 LMR) on main under its UNCHANGED bars
## Read
ADR-0060 (PROPOSED, RE-OPENED: on main A4(a) chooseMove pos-6 0.8699 > 0.85; A3 search() max drift 63 cp > 27 cp at position-6/g5h6), arch-phase2-rebase notes (…d5870a7a, …f9f440c9, …e4680ed2) and raw/probe, arch-phase2-p1 raw/probe.
## Do
- Search forms on main that meet EVERY pre-registered bar (A4 a/b/c, A3 drift ≤ 27 cp + ≥ 95 %, mate floor, zugzwang 7/7, G1 ≥ 54): e.g. no reduction at PV nodes, cap 1 at PV / 2 elsewhere, divisor/offset changes, depth threshold, index threshold. Pre-register the candidate set and selection rule BEFORE reading results; pick by the rule.
- If a form meets all bars: write it into ADR-0060 (status PROPOSED, ready for owner acceptance) with main's door and head counts.
- If none does: say so plainly and state the owner question — whether the A3 27 cp cap (1.5× one base's max) may be re-derived on main — with your recommendation and what number it would become. Do not move the bar yourself.
## Fences
memory-bank/50-decisions and your records only; no src/tests/plans/board; don't touch ADR-0025. No push, force, amend, rebase, merge into main. Leave nothing running; delete scratch copies.
## Publish
Sealed notes (task arch-ADR-0060-reopen, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.
