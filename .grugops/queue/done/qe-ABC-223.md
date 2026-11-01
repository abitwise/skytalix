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

## Result

**2026-11-01, QE/E2E. PASS_WITH_GAPS. Branch `grugops/qe-ABC-223` (worktree `.claude/worktrees/qe-ABC-223`, from
`28e46464`): PREREG `fe866192` (sealed before game 1), records `344861c5`. Records only: `src/`, `tools/` and `data/`
are untouched. Not merged, nothing pushed.**

- **Build:** `main`'s tip `28e46464`. `git diff --name-only af32f82c 28e46464 -- src data` lists only
  `src/engine.test.ts`, `src/levels.test.ts`, `src/search.null-move.test.ts`, `src/uci-session.test.ts`: test files
  only, so the tip is admissible and plays `ABC-221`'s merged code.
- **Run:** 5 games, `tc=40/900 timemargin=0 -maxmoves 80`, `option.TimeMode=uci-clock-mode`, `OwnBook` on, width 1,
  self-play. Harness launched detached (`setsid -f`; parent pid 1, `systemd`); the SIGSTOP/SIGCONT test on a detached
  process passed first (the PREREG stops by SIGTERM and does not pause). Play 08:54:21Z → 12:50:13Z (3.93 h), rc 0,
  no thermal stop, not VOID.
- **Results:**
  - g01: ½–½, the cap, 160 plies;
  - g02: 0–1, mate, 118 plies;
  - g03: 1–0, mate, 59 plies;
  - g04: ½–½, the cap, 160 plies;
  - g05: 0–1, mate, 132 plies.
- **A1 MET:** pins hold (cutechess `dc776901…` = the `ABC-204` re-pin; openings = `OPENINGS_SHA256`); `setoption name
  TimeMode value uci-clock-mode` reaches both engines in game 1 (5 of 5 games, 0 refusals).
- **A2 MET:** 5 of 5 games kept, 0 faults, 0 kills after a result.
- **A3 MET:** 0 losses on time. Closest call **1 099 ms** (g02 a, move 40; also four ties); every period end left
  1 099–1 101 ms (D2's 1 100 − δ).
- **A4 MET:** 12 side-periods complete; minimum use **99.88 %**.
- **A5 MET:** longest move **25 285 ms** (g02 a, period 1 move 40 of 40, budget 25 284.0); 0 budgets at the 59 500 cap.
- **A6:** period-end clocks 1 099–1 101 ms; `movestogo` on 629/629 `go` lines; 0 `isready` during a search; overhead
  (elapsed − derived budget) median +0.6 ms, max +2.5 ms over 614 searched moves.
- **A7 GAP:** on mains; Tctl median **78.1 °C**, max **93.1 °C**, running median peak 80.1 °C; worst quarter frequency
  −0.26 %. **Not ALONE:** another repository's `vitest` (`npm exec vitest` under a separate `claude` session) ran in
  687 of 1 407 samples (48.8 %), 31 bursts; logged, never killed. PREREG § 5's window rule did not fire (no move
  left < 1 000 ms, none ≥ 59 900 ms), so A3 and A5 stand graded.
- **Notes:** PREREG `…caae8984`, reading `…2c62a346`, artifacts `…247a14c4`, observations `…5c8f2995` (QE-223-a
  MEDIUM host gap; b…g INFO), verdict `…767b4959`.
- STOP: none. No process of this hop is left running.

### Trace row (10 cells, header order)

| ABC-223 | Smoke reading: uci-clock-mode plays 5 games at 40/15 over UCI with 0 losses on time, closest call ≥ 500 ms and ≥ 75 % clock use | EPIC-009 | — | NFR-004 (60 s: longest move 25 285 ms ≤ 60 000; cap 59 500 not reached; AR-NFR004-A +2.5 ms); heat: width 1 Tctl median 78.1 °C / max 93.1 °C, running median ≤ 80.1 °C under the 85 °C line; ADR-0049 d4 (0 host-path hits) | main @ 28e46464 (test-only diff from af32f82c): dist/uci.js from src/uci-session.ts (unchanged by QE) | cutechess-cli 1.5.1 self-play, 5 games tc=40/900 timemargin=0: A1–A5 MET, A6 reported, A7 GAP (foreign vitest 48.8 % of samples) (0 losses on time, closest call 1 099 ms, min use 99.88 % over 12 side-periods); QE records grugops/qe-ABC-223 @ 344861c5 | QE PASS_WITH_GAPS, no blocking gap (verdict …767b4959) | — | QE PASS_WITH_GAPS |
