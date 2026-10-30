---
subtask: secnfr-ABC-220
role: security-nfr
ticket: ABC-220
ref: .grugops/context/secnfr-ABC-220/
branch: new grugops/secnfr-ABC-220 from main 01c37946 (worktree .claude/worktrees/secnfr-ABC-220); candidate grugops/qe-ABC-220 @ cc32a470 (code fbab54ff)
width: records only, NO builds/tests/node (an SE runs beside you)
---
# Security/NFR gate: ABC-220 (simple-tournament TimeMode over UCI)
## Read
ABC-220 ticket § NFR triggers; ADR-0052 (D1–D9, § Status 2026-10-30); arch-ABC-220-a14 notes (`…5ecf3a59`, `…ca075632` — the
NFR-011 entry text, D5 whole-second reading); qe-ABC-220 notes on branch grugops/qe-ABC-220 (`…58af5b6a` timing,
`…c6bdd364` gaps + your handoff, verdict `…7a09c5e1`); code via `git show fbab54ff:src/uci-session.ts`; plans/nfr-catalog.md.
## Do
- Gate verdict PASS / PASS_WITH_RISKS / FAIL (block_on: high; ASVS L1): one option matched exactly against a frozen tuple,
  hostile values refused, echo via printableOf, no new input class.
- Place, dated, in plans/nfr-catalog.md: NFR-004's 22 s text for simple-tournament (budget 22 s, clamp 32 000), AR-NFR004-A
  re-read at 22 s (A11 overshoot 1.0 ms), the busy isready/stop accepted-risk entry beside NFR-011 (Architect's text;
  measured worst ≈ 22 001.4 ms), NFR-008 headroom (A12 9.69 s, G8 +0.09 s) as a watch line.
- Rule whether anything needs the owner (the whole-second reading is already an open owner confirmation; it blocks nothing).
## Fences
plans/nfr-catalog.md, your notes. No src/, tools/, data/. Run no builds, tests or node; if sealing needs node, draft a seal
script that calls only context-io admitAndAppend and give me the command. No board edits. Never push/force/amend/rebase/merge into main. No host paths.
Waiting on a background job: poll its output file or a pid with `kill -0 <pid>`; never `while pgrep -f <pattern>` (the loop matches its own command line and never exits). Stop every wait loop you start before you report.
## Publish
Notes (task `secnfr-ABC-220`), commit, `## Result` + trace row here, brief + claim to done/.
