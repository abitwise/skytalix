---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T22:54:41Z
subtask: arch-adr0057-fix
role: architect-design
ref: .grugops/context/arch-adr0057-fix/
branch: new grugops/arch-adr0057-fix from main (worktree .claude/worktrees/arch-adr0057-fix)
width: records only, beside bapm-epic010-close (plans/ only).
---
# Architect: correct ADR-0057 before the owner rules, and refresh ADR-0056's lane figures
## Inputs
qe-ABC-263 gaps (.grugops/context/qe-ABC-263/ …5e4c6533): G1 MEDIUM — ADR-0057 calls ABC-253 "in flight"; it was dropped (…27ddb1fb; prototype patch in .grugops/context/se-ABC-253/raw/patch.py, 48/48 identity). D2.3 and the D6 threads row rely on its 32-bit key halves. G3–G8 LOW (round-trip µs for rows d/e or "n/a" with reason; fair-comparison "—" cell; ADR-0044 D5 reversal named under OQ-1; define V4 inline; "exceed" not "pass" 128 MiB; rename prototype ids to avoid ADR-0056's P1–P6; say what settles each UNKNOWN). Scribe list of stale lane figures in ADR-0056 (l.~812–834: Levels 57 tests / 577 s; ladder 18 / 23 s; UCI 241 / 291 s).
## Do
Dated corrections in ADR-0057 (keep PROPOSED): G1 — threads need their own key split (reuse se-ABC-253's prototype approach); re-estimate the threads effort honestly. G3–G8 fixes. ADR-0056: dated figure refresh only.
## Fences
memory-bank/50-decisions/ADR-0057*, ADR-0056* (figures only), your notes. Run nothing. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task arch-adr0057-fix, contextRoot = worktree's .grugops/context, never the plugin cache), commit, ## Result + trace row, brief + claim to done/.
