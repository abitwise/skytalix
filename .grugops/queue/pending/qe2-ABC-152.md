---
task: wave-2026-09-25
subtask: qe2-ABC-152
role: qe-e2e
ticket: plans/tickets/ABC-152-upgrade-vitest-to-4-1-and-run-src-without-the-module-runner-with-every-mock-and-spy-guard-still-armed.md
ref: .grugops/context/qe2-ABC-152/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-152-vitest-4-1-runner-off (tip 49997a87; repair over 88009d0b)
base: 91024242
---

# Subtask: QE re-check of the ABC-152 repair delta (88009d0b..49997a87), graded against ADR-0042 addendum 2 (rulings 8–11).

On your own plants/copies: V4 group 4 (weakened exit 1, gate row the ONLY red at exactly 15/58, A3 green; plant (a);
plant (b) "no leak reader"); the SE's census (`.grugops/context/fix-ABC-152/` on main) — re-derive it; V2 six rows +
M9b + ABC-143 A5 (no deprecation line); comment-only check of 49997a87 (and rule whether src/cli.test.ts line 6 is
stale — if so, route to the Architect, do not fix); gates. Your call whether V7's 20-run screen is owed again.
Your worktree needs its OWN `npm ci`; do not use ../wt-ABC-152. No timing reads. Commit notes on the ticket branch
via your own worktree (not by update-ref from a detached HEAD while another worktree holds the branch — if the branch
is checked out elsewhere, commit to a side branch qe2-ABC-152-notes from the tip and report it). Never merge.
