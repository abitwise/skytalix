---
subtask: bapm-cut-AR-1-drift
role: ba-pm
tickets: []
branch: main (records only; commit nothing, the Orchestrator commits)
ref: .grugops/context/bapm-cut-AR-1-drift/
width: 3 (beside qe-ABC-189 and qe-ABC-178b)
---

# BA/PM: cut the fix ticket for AR-1's registry drift (4 new dev-only advisory pairs, no HIGH)

## Read first
- Orchestrator `.grugops/context/orch-ar1-delta-2026-10-22/notes/20261022T153947Z-orchestrator-decision-e4ef897b.md` (the decision and routing).
- Security/NFR `.grugops/context/security-nfr-ABC-190/notes/` (`…140008ff` result, `…56bf0b02` readings: the four pairs, the `@vitest/mocker` 4.1.12 fix inside `vitest`'s `~4.1.11` range); `security-nfr-ABC-172` `…216ceb43` (Rulings 2–3, the unproven dev-server-socket point); AR-1's approval `…193e08fb`; `memory-bank/45-standing-rulings.md`; `AGENTS.md` (`RISK-ABC143-01`: a vitest/`@vitest/*` bump carries the result-file reporter risk).
- The owner delegation `…5aaf7cec`: you rule scope yourself; escalate only a requirement change.

## Do
- Cut one ticket (next free id **ABC-198**): a **lock-only** bump that clears the two `@vitest/mocker` advisories (`npm` resolves 4.1.12 inside the existing ranges; `package.json` unchanged unless a range must move, in which case say so and why). Rule whether the two vite pairs go in the same ticket (only if a lock-only in-range bump exists; measure with `npm view` / a scratch clone, never main's checkout) or are accepted with a reopen trigger.
- Criteria must include: the audit (package, advisory) set before and after, compared pair by pair (not just the count); `npm ci` clean on a fresh clone; gates green with unchanged test counts; `RISK-ABC143-01` (the reporter loads); a QE probe that a plain `npm test` opens no listening socket (the `…216ceb43` point); Security/NFR clause (a) on the lock diff. State who re-states AR-1 after it merges.
- Size it (expect XS), set priority (expect P2/P3), and score DoR. Put it in Ready if 10/10, else Backlog with the missing input named.
- One `_Updated:` line at the top of `plans/board.md` and the new card.

## Fences
- Only `plans/` and your notes (context root: this repository's `.grugops/context`). No `src/`, `package*.json`, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config. Commit nothing. npm only in scratch clones in your scratch area; no vitest, no timing.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-cut-AR-1-drift`). Every `at` from `date -u`. Include a `kind: decision`.
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/bapm-cut-AR-1-drift.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.
