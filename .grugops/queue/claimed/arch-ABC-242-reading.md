---
subtask: arch-ABC-242-reading
role: architect-design
ticket: ABC-242
ref: .grugops/context/arch-ABC-242-reading/
branch: new grugops/arch-ABC-242-reading from main e7b22c11 (worktree .claude/worktrees/arch-ABC-242-reading)
width: records only, NO builds/tests/node scripts (a QE may run ALONE timing on this host)
---
# Architect: ABC-242 — how the blunder path sees a third occurrence at its root
## Read
ABC-242 ticket (Scope, § Dependencies, ADRs it names), ADR-0054 (d3 ply ≥ 1 scan, two-match rule), ADR-0032 d2 (strict
second-best), ADR-0020 § AMENDMENT 2026-10-30 (repetition keys, now merged with ABC-241 at 1f6abec4), src/levels.ts
`blunder` on main (read only), qe-ABC-230 finding QE-230-a `…ba5a249a`.
## Do
Rule the design: where the root-move third-occurrence check lives (blunder in levels.ts vs a chooseMove root check vs
a shared helper), using repetition keys; confirm the engine path is untouched. Write it as a dated ADR-0054 (and
ADR-0032 if touched) amendment, PROPOSED if it changes an owner-accepted decision (then name the owner question), or
an in-scope design note if it does not. Give the SE a file list and the A-rows' exact expected values where derivable
by reasoning. Say whether the ticket stays S and the Orchestrator's S2/no-smoke ruling still fits.
## Fences
Records only (ADRs, the ABC-242 ticket, your notes). No src/, tools/, data/. Run no builds, tests, node scripts or
benchmarks. If sealing notes needs node, draft them and a seal script; the Orchestrator seals after the host frees.
No board edits. Never push/force/amend/rebase/merge into main. No host paths.
## Publish
Notes (task `arch-ABC-242-reading`), commit, `## Result` + trace row here, brief + claim to done/.
