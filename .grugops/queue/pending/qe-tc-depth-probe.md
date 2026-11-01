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
