---
task: wave-2026-09-25
subtask: design-ABC-152-owner-route
role: architect-design
ticket: plans/tickets/ABC-152-upgrade-vitest-to-4-1-and-run-src-without-the-module-runner-with-every-mock-and-spy-guard-still-armed.md
ref: .grugops/context/design-ABC-152-owner-route/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/design-ABC-152-owner-route (create from main)
base: main
---

# Subtask: ADR-0042 addendum — the owner's D4 pick (note `…06bfc2d7`).

Owner: "upgrade and fix/upgrade tests as well, use one ticket for it, include CPU saving". Record the pick (4.1.11
runner off + test rework) and rule, per your D1–D4 and the screen (`…0ec854fb`):
- the admitted rewrite forms (R1–R5) and what "armed" means for each (plant-check rule per rewritten guard);
- `san.test.ts` A20: the replacement assertion (what property it must still pin);
- `book.test.ts` ABC-094 A2: how its "fresh module instance" premise is re-grounded without `vi.resetModules()`;
- the pin at k = 2 (main merged ABC-151: `maxWorkers: 2`): `VITEST_MAX_WORKERS` ≤ 2, no `projects`, runner stays off;
  fold QE-151-a; the reporter D2(d) incl. QE-149-a and QE-149-c (M9b);
- the CPU bar and how it's read (ABC-150's ≤ −15 % paired lane CPU vs the k = 2 base; width-1 window);
- any case that would need a test deleted/skipped → owner, not ruled.
No timing reads. Scratch trees for vitest 4.1 only; never change package.json/lockfile on a shared branch. Commit on
your branch; never merge. Use /usr/bin/diff.
