---
task: wave-2026-09-25
subtask: qe-ABC-056
role: qe-e2e
ticket: plans/tickets/ABC-056-ar-1-accepted-risk-has-drifted.md
ref: .grugops/context/qe-ABC-056/
enqueued_by: orchestrator
enqueued_at: 2026-10-17T00:00:00Z
branch: grugops/ABC-056-restate-ar-1 (tip e567787c; base e7d9d657) — existing worktree wt-ABC-056
---

# Subtask: QE gate for ABC-056. Width 3; BA/PM on ABC-039 runs beside you.

Verify A1–A5 (as amended 2026-10-12 and 2026-10-17) against the Release Manager's AR-1 note
(`…/ticket-to-pr-ABC-056/notes/…ar1-restated-718112dd.md`). Re-run every command yourself; do not copy readings. Test that the A4 trigger is
falsifiable: plant, in scratch copies OUTSIDE the repo, a package import, a side-effect import, a `createRequire`, and a new built-in, and
show which check reads differently each time. Run the gates on the tip (lint, typecheck, build, `npm test`, `last-run.json` success,
skip-integrity `--skip-count 0`) and the UAT-waiver reading `git diff --name-only e7d9d657...e567787c | grep -v '\.test\.ts$' | grep '^src/'`.
Return PASS / PASS_WITH_GAPS / FAIL with a gap register. Commit notes and a QE section on the ABC-056 page on the branch. No manifest or `src/`
change; never `npm audit fix`. Never merge, push, --force, --amend or rebase.
Finish with `.grugops/queue/done/qe-ABC-056.md` and its `.claim.md`, uncommitted on main.
