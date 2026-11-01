---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T17:29:48Z
subtask: bapm-qe-gaps-1101
role: ba-pm
ref: .grugops/context/bapm-qe-gaps-1101/
branch: new grugops/bapm-qe-gaps-1101 from main (worktree .claude/worktrees/bapm-qe-gaps-1101)
width: records only, beside QE hops (tests under the lock).
---
# BA/PM: route today's QE gaps
## Gaps (read each QE note on main; qe-ABC-254 notes are on branch grugops/qe-ABC-254 — read with git show)
- QE-249-a LOW (qe-ABC-249 …66371344): ABC-249's row discriminates only at depth 4–5; add a test note to ABC-233/236/237/238 ("on re-pin, keep move-with-keys ≠ move-withheld, or add that relational assert").
- QE-249-b INFO: no default-lane row for a pre-root draw scored exactly 0 at ply ≥ 4.
- QE-259-a MEDIUM (qe-ABC-259 …1aca1753): env rule misses `import { env } from "node:process"`; proposed widen to \bprocess\b (0 hits today).
- QE-259-b LOW: comment strip ignores string literals (shared with ABC-087 A8).
- QE-259-c LOW: budget aliases survive; carry as a review note on ABC-251.
- QE-254-b LOW (grugops/qe-ABC-254 …dede949b): hasLegalMove rebuilt on lazy legalMoves (losing early exit) is caught by nothing.
- QE-254-c LOW: no default-lane row for quiet queen promotions while in check.
## Do
Cut the smallest set of test-only tickets (bundle where natural, e.g. one "lane hardening" ticket for 259-a/b + 254-b/c + 249-b) into EPIC-010 milestone 1b or EPIC-011 M0 (argue), DoR honest; add the notes to the named tickets. No cuts for INFO-only items unless bundled cheaply.
## Fences
plans/tickets/ (named + new), plans/epics/EPIC-010*/EPIC-011* (rows only), plans/traceability.md (append), your notes. Not board, memory-bank/, src/, tools/, data/. Run nothing. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task bapm-qe-gaps-1101, contextRoot = worktree's .grugops/context, never the plugin cache; cite only existing commits), commit, ## Result + trace row, brief + claim to done/.
