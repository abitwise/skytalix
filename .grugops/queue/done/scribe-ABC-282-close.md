---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T11:49:20Z
subtask: scribe-ABC-282-close
role: agents-md-scribe
ref: .grugops/context/scribe-ABC-282-close/
branch: new grugops/scribe-ABC-282-close from main — worktree .claude/worktrees/scribe-ABC-282-close
width: AGENTS.md and your records; nothing run. No test, build or engine.
---
# AGENTS.md after ABC-282
Read ABC-221's page, ADR-0071, QE's verdict …5191f871, and the Orchestrator's decision …681c6363 item 3.
1. The UCI line: W1's behaviour in uci-clock-mode, soft limit = budget ÷ 2.3.
2. The UCI session deep lane's ABC-221 A10 line: its searches and timing as they now are.
3. The passer lane line: the K0 rows as ABC-304 left them, if the line needs it.
4. The merge re-read rule: a merge re-read runs the deep lane of any test file arriving from the other side.
Short lines, verified against the code and pages. Do not restate ADRs.
Fences: AGENTS.md and your records only. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task scribe-ABC-282-close, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result

**2026-11-05, AGENTS.md Scribe. Items 1–4 done. `AGENTS.md` and records only, on `grugops/scribe-ABC-282-close` from `main` `3e648e72`. No test, build, engine, lint or typecheck run. Nothing pushed or merged, nothing left running.**

- **1, the UCI time-mode line:** W1 added to it. `uci-clock-mode` only, on a `go` with the mover's clock and no `movetime`: no iteration starts past budget ÷ 2.3, the budget stays the hard abort, an aborted iteration's root move is kept when it beat the incumbent (`info string partial depth <d + 1>`), every other mode and token as before, and a test that needs the full 59.5 s sends `go movetime`.
- **2, the UCI session deep lane line:** "3 x 59.5 s" now reads three searches at `go movetime 90000` (W1 off) plus a fourth on the clock line that stops past 59.5 s ÷ 2.3 (`ABC-282` A3, ~27.5 s as SE read it), ~3.5 min. `-t "ABC-221 A10"` still selects the row.
- **3, the passer lane:** no line existed, so one is new, after the taper lane: `SEARCH_DEEP`, `src/evaluate.passer.test.ts`, 28 tests, ~8 s, K0's seven counts exact on the `…WithoutBundle` doors (`ABC-304`). No retirement is said: `ABC-301` closed NOT MET.
- **4, the merge re-read rule:** one line in § Test: a merge re-read runs the deep lane of any test file arriving from the other side, besides the default lane.
- **Notes:** `…3e1f993c` (decision, the lines as first written), `…e264396c` (readings); `…d13282a7` (the landed form and the cuts).
- **Size, the stop I hit:** `src/cli.test.ts` A5 holds `AGENTS.md` to 18 432 B, and it sat at 18 429. The four lines first came to 19 647 B. I cut each to the least that carries it, then took out prose that restated another line or a pointer: the UCI entry comment's exit codes (the command log § "UCI entry point" holds them), the Orchestrator-classifies line, the shared-context sentence in § Role / workflow files (Workflow 16 holds it), the § Memory bank & plans pointer to the standing rulings and the command log (§ Standing rulings and § Commands carry both), the plans list's glosses, and "the grant did not flip it" in § Safety rules (§ Standing rulings has it). No rule or command was cut. **Result: 18 393 B, 39 B under the cap.** The test was not run (fence), so the byte count is `wc -c`, not a green A5.
- **Owed, not done (fence):** the command log (`memory-bank/90-agents-md-command-log.md`) has no passer-lane receipt. The A10 test's title still says "three searches" (QE-282-f).
- **Path check:** `node tools/grugops/records-path-check.js --base main` exited 0 before the last commit.
