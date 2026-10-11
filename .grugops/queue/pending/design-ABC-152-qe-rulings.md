---
task: wave-2026-09-25
subtask: design-ABC-152-qe-rulings
role: architect-design
ticket: plans/tickets/ABC-152-upgrade-vitest-to-4-1-and-run-src-without-the-module-runner-with-every-mock-and-spy-guard-still-armed.md
ref: .grugops/context/design-ABC-152-qe-rulings/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-152-vitest-4-1-runner-off (tip 88009d0b) — rule in a note committed on a short branch from main
base: main
---

# Subtask: short rulings on QE's ABC-152 gaps (QE gap register `…8bfb6cb5`, verdict `…ee5be445` on the ticket branch).

1. QE-152-h: confirm R2's form extends to `src/puzzle-suite.test.ts:368-374` (weakened mode) as an admitted form, and
   name the V4 addition (the weakened gate row must read 15/58 red, not just exit 1). State whether V4's set definition
   must name opt-in-lane sites and how the SE proves no other opt-in site exists.
2. QE-152-a: may the reporter import `vitest/node` in place of `vitest/reporters` under ruling 5?
3. QE-152-d: may the SE fix the six stale comments inside V5 (comment-only lines)?
4. QE-152-b/-c: accept as residuals or require anything?
Nothing measured. Commit an addendum-note (and ADR-0042 text only if a ruling changes it) on branch
grugops/design-ABC-152-qe-rulings from main; never merge. Use /usr/bin/diff.
