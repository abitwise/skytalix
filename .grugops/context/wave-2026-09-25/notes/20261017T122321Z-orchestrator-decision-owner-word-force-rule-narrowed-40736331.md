---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-17T12:23:21Z
sealed: false
refs: []
---

# Owner word, 2026-10-17 — the "don't force anything" rule narrowed

After the Orchestrator reported using `git worktree remove --force` on `wt-bapm-ABC-096` (its branch `ec857b81` was committed and merged
first; nothing lost), the owner said verbatim: **"fix the rule, only leave git push -f as forbidden"**.

- **Forbidden:** `git push -f` / `git push --force` (and `--force-with-lease`, the same act).
- **Now allowed when the situation calls for it:** other force-type local git operations (`git worktree remove --force`, `git branch -D`,
  `reset --hard`, `--amend`, `rebase`). Look at the target before any destructive one.
- **Unchanged and separate:** never push at all (humans hold deploy); never merge without gates; never self-sign UAT; never touch other
  sessions' processes. Briefs may stay stricter than this rule.
