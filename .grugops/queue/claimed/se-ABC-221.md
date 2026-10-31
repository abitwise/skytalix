---
subtask: se-ABC-221
role: software-engineer
ticket: ABC-221
ref: .grugops/context/se-ABC-221/
branch: new grugops/ABC-221 from main (worktree .claude/worktrees/se-ABC-221)
width: shared with two records-only hops (Architect, BA/PM); take timing reads only with no vitest from other hops running
---
# SE ABC-221 (M, P3, milestone 2): uci-clock-mode over UCI TimeMode
## Read
The ticket page (every dated block; A1–A12; NFR triggers; Test notes 1–5), ADR-0052 (ACCEPTED; D3–D7), ADR-0045 § AMENDMENT A3,
ADR-0044 D3/D4/D5, ADR-0046 § Addendum R1–R4, ABC-220's build and QE notes (.grugops/context/se-ABC-220*/, qe-ABC-220/), QE-244-a carry
(do not make the ABC-230/241 rows shallower).
## Do
- Build A1–A12 as the ticket and ADR-0052 word them. HARD_CEILING_MS moves to 60 000 at this build, per the owner's Q5. That is the one clamp move; no other bound moves.
- Fix the SEC-220-b comment only (Test note 5).
- Period rows A2–A4 stay on the stubbed chooseMove. One R1 census line per real-engine row; time-blind real-engine rows take their R2 step, read per search.
- Gates via `npm run …`; report the test count. Take an informal G8 wall with the host clear: G8 now reads 9.41 s, so +0.2 s crosses 9.6 s and fires tranche 2. Report it; don't fix it. Above 10 s, STOP and hand back.
- Run ENGINE_DEEP A10 and UCI_DEEP A11 row 2 once each, with no other vitest running.
## Fences
- Only src/ files the ticket names, plus their tests. No records edits; the ADR folds are BA/PM's at merge.
- No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. No host paths.
- Waiting: poll an output file or `kill -0 <pid>`; never `while pgrep -f …`. Never put vitest on the same command line as a wait.
- Scratch `se-221/`.
- STOP if the ADR cannot be met as worded.
## Publish
Sealed notes (task `se-ABC-221`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
