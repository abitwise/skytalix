---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T03:22:57Z
subtask: se-ABC-281
role: software-engineer
ref: .grugops/context/se-ABC-281/
branch: new grugops/ABC-281 from main — worktree .claude/worktrees/se-ABC-281
width: wrap EVERY run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Hop ≤ 1 h. Host paths only as placeholders.
---
# Build ABC-281 (test-only): three rows go form S per ADR-0046 § Dated 2026-11-04 (arch-ABC-281 …d7b2b02b)
Read plans/tickets/ABC-281*.md (A1–A9; BA/PM is writing the all-S lines in parallel — the ADR-0046 dated section and …d7b2b02b are authoritative for the forms and the five build conditions), arch-ABC-281 raw/kill-matrix.tsv.
- R1: full QE-208-a pos-6 row to SEARCH_DEEP; default-lane remnant = sweep on chooseMoveWithoutTaper at readings 8 and 10; one unchanged copy of sweep (nested if (RUN_DEEP) describe); A4 `-t` still prints "1 passed".
- R2: full ABC-230 A4 row to ENGINE_DEEP; remnant = [] vs absent on kr-corner, startpos, position-6.
- R3: full levels A9 row to ENGINE_DEEP; remnant = QE-087-d draw check, seed 1, first 10 of the thirty.
- Row bodies byte-identical where moved; deep suffixes on titles; default lane total = base (2 650) and each deep lane base + 1 as the ADR says; AGENTS.md null-move count updated (stays ≤ 18 432 B) with a command-log entry.
- Show each mutant from ADR-0046's recommended A6 list killed by the default-lane remnant (scratch copy only). Gates: lint, typecheck, npm test, the affected deep lanes. Report the default-lane wall median (≥ 5 runs, ALONE) as an early reading; QE grades A8.
## Fences
the three test files, AGENTS.md (count line), memory-bank/90-agents-md-command-log.md, your records. No src. Do not edit plans/board.md or ticket pages. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task se-ABC-281, contextRoot = worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.
