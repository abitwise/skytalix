---
subtask: qe-ABC-223
role: qe-e2e
ticket: ABC-223
ref: .grugops/context/qe-ABC-223/
branch: new grugops/qe-ABC-223 from main (worktree .claude/worktrees/qe-ABC-223)
width: STRICTLY ALONE (~5 h of games). Only a records-only Architect hop (no vitest, no engine) may be beside you. Record load1 and foreign processes throughout. Leave no process running.
---
# QE ABC-223 (S, P3): smoke reading — uci-clock-mode plays 5 games at 40/15 with 0 losses on time
## Read
- The ticket page (A1–A7, Test notes, PREREG rules). ABC-222's page and qe-ABC-222's notes/raw (the method this reading copies: A1, A2, A3, A4, A7).
- ADR-0052 D2/D4 (uci-clock-mode: budget min(59 500, C); ceiling 60 000); NFR-004 (60 s); AR-NFR004-A.
- EPIC-010 page's QE-M1B2-b rule: if your PREREG pauses by signal (thermal), launch the harness and its watcher detached (`setsid -f`), record its parent pid before game 1 (not an agent task runner), and test SIGSTOP/SIGCONT on a detached process first.
## Do
- Build: ABC-221's merge sha af32f82c, or main's tip if `git diff af32f82c <tip> -- src data` touches tests only (say which, with the diff listing).
- Commit a PREREG before game 1. Play 5 games at 40/15 in uci-clock-mode per the page; grade A1–A5, report A6, A7 host log (thermal, frequency, 5 % rule).
- Foreign processes: another repository's vitest has appeared on this host. Log every one, never kill it, and judge admissibility per PREREG.
- Verdict PASS / PASS_WITH_GAPS / FAIL / UNRESOLVED (a fault → one re-run as A2 says).
## Fences
- No edits under src/, tools/, data/; no board edits. No push, force, amend, rebase, or merge into main. Never bare npx or npm exec. Waiting: `kill -0 <pid>` or poll a file; never `while pgrep -f`; never vitest on the same command line as a wait. Thermal stop: Tctl median > 85 °C. Scratch `qe-223/`.
## Publish
Sealed notes (task `qe-ABC-223`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
