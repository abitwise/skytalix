---
subtask: se-ABC-229
role: software-engineer
ticket: ABC-229
ref: .grugops/context/se-ABC-229/
branch: new grugops/ABC-229 from main 01c37946 (worktree .claude/worktrees/se-ABC-229)
width: near-ALONE — only a records-only Security/NFR runs beside you; timed reads the ticket gives the SE are allowed (wait-clear first)
---
# SE ABC-229: quiescence searches quiet queen promotions (ADR-0053 d5–d9)
## Read
ABC-229 ticket (all FOLDED blocks; A1–A5; Test note 1 as corrected), ADR-0053 (ACCEPTED; d5–d10), the frozen Q-SET
(qe-ABC-229-qset notes `…fd9819a5`, `…92ef5670`; `.grugops/context/qe-ABC-229-qset/raw/qset/qset-229-frozen.json`), how se-ABC-228 built (door pair, A1 identity, forecast).
## Do
- Build to the ticket and ADR. Put QP-1..QP-9 into src/quiescence.test.ts at the frozen values (do not change a value; if one
  disagrees with your build, STOP and report). Re-point the ABC-228 rule row that expects 212 to quietPromotions:false (ADR-0053 d7).
- Any forecast the ticket gives the SE: run ALONE (wait-clear: no foreign vitest/cutechess). G6 both sides at 4 000 ms; a
  forecast miss → STOP and report (goes to the owner; no step past 4 s exists).
- Gates via `npm run …`; npm test count; report the npm test wall informally (NFR-008 headroom ~0.3 s; keep new rows fixed-depth and few).
## Fences
Only files the ticket/ADR name. Never push, force, amend, rebase, merge into main. No board edits. Never bare `npx`/`npm exec`.
No host paths in commits. Scratch `se-229/`.
Waiting on a background job: poll its output file or a pid with `kill -0 <pid>`; never `while pgrep -f <pattern>` (the loop matches its own command line and never exits). Stop every wait loop you start before you report.
## Publish
Sealed notes (task `se-ABC-229`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
