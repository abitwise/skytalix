---
subtask: qe-tc-depth-probe
role: qe-e2e
ref: .grugops/context/qe-tc-depth-probe/
width: STRICTLY ALONE (~30–45 min). Starts after qe-ABC-223 hands back.
---
# QE probe: what skytalix reaches at short move times (sets the routine control on readings)
Owner question 2026-11-01 (…f7a50e95): "would 100ms be enough to validate algorithmic improvements?"
- At main's tip, one process per search, fixed positions (start, kiwipete, position-6, an endgame, an in-check position) plus ~20 positions sampled from the milestone-1 batch PGNs: `go movetime` 100 / 250 / 500 / 1 000 / 4 000. Record completed depth, nodes, nps, and the real elapsed time vs the budget (overshoot) per search.
- JIT warm-up: first search in a fresh process vs a warmed process at 100 ms (restart=on starts every game cold).
- One short cutechess sanity block per control (100 ms and 500 ms, 20 games skytalix vs itself): time losses, overshoot max, games/hour.
- Stockfish side: at E 1910…2600, the move time at which its pick depth is reached in ≥ 95 % of moves.
- No grading; a reading for ADR-0056 C2. Pre-register before the first run. Record load1, Tctl, foreign processes.
## Added at claim (Orchestrator)
- Branch: new grugops/qe-tc-depth-probe from main (worktree .claude/worktrees/qe-tc-depth-probe). Scratch `qe-tcprobe/`.
- **Owner rule (…aab3b5f4): any run estimated > 1 h is asked first.** Budget this probe ≤ 45 min of play; if your pre-registered plan estimates more, STOP and hand back before running.
- Host: another repository's vitest (and a /app platform-tooling vitest) has been running on this host in bursts. Wait-clear before each timed block (no foreign vitest for 2 min, up to 30 min); if never clear, proceed, log it and mark each reading's admissibility.
- Also report games/hour at 100 ms and 500 ms from the sanity blocks (feeds the SPRT time estimates), and the SPRT expected-game arithmetic for [0,10], [0,30], [0,50] at those rates.
- Fences: no edits under src/, tools/, data/; no board. No push, force, amend, rebase, or merge into main. Never bare npx or npm exec. `kill -0` / poll a file to wait; never `while pgrep -f`; never vitest on the same command line as a wait. Thermal stop: Tctl median > 85 °C. Leave no process running.
- Publish: sealed notes (task `qe-tc-depth-probe`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.
