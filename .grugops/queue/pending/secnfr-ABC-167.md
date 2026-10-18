---
subtask: secnfr-ABC-167
role: security-nfr
ticket: ABC-167
page: plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md
branch: grugops/ABC-167 @ 6922f772
ref: .grugops/context/secnfr-ABC-167/
---

# Security/NFR gate on ABC-167 (lean)

Read these first:
- The ticket page, § Security / NFR triggers and A11 / A11-g1.
- ADR-0044 § Consequences.
- `.grugops/context/qe-ABC-167/notes/`
- `.grugops/context/qe2-ABC-167/notes/` — verdict PASS_WITH_GAPS (`…c02ebd96`).

## What to rule
1. **QE-167-g (M40 / M42).** The A11 guard checks text only, so bracket access to globals passes every gate. Examples: `globalThis["process"]`, `globalThis["Math"]["random"]`. Rule one of:
   - **ACCEPTED RISK**, with a reason and a residual, or
   - **REQUIRED FIX**, with the exact check.
   Think about what the session is: it is capability-free per D2, and ABC-168's entry point is the only place that gets I/O. The other triggers, (a) through (d), are "not triggered" on the page. Confirm them against the tip.
2. **NFR-004.** Confirm that no budget above 3 000 ms leaves the session. Use the A5 rows; do not take a timing reading.
3. **NFR-008 N8-LANE delta.** This is a timing reading. Take it **only** in a foreground-verified quiet window: 180 s with no foreign `vitest` and no `oeselg-labs/platform` process, recording host and load1, measured at base `e286526d` against tip `6922f772`. Otherwise record it as **OWED**, and say whether merge can carry it as an accepted residual. **Never estimate it.**
4. **QE-167-i (LOW).** Give a one-line view: does it carry any security or NFR weight? (QE-167-i is untested keyword-boundary rows; one example is `go depth infinite` not holding under a wrong build.)

## Fences
- Work in a scratch detached worktree: `git worktree add --detach ../wt-secnfr-ABC-167 6922f772`. Remove it at the end.
- Do **not** touch:
  - `src/`
  - `plans/board.md`
  - `plans/traceability.md`
  - `../wt-ABC-167`
  - `../wt-ABC-146`
  - any process you did not start
- Do not fix anything. Never push or merge.

## Publish
- Hand-authored, unsealed notes under `ref:` in main's working tree, including a `decision` note with PASS / PASS_WITH_RISKS / FAIL.
- `.grugops/queue/done/secnfr-ABC-167.md` and `.claim.md`, uncommitted, containing:
  - the result
  - each ruling
  - required fixes, if any
  - accepted risks
  - N8-LANE
  - a trace row
