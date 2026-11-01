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

## Result

**2026-11-01, QE/E2E. READ (not graded). Branch `grugops/qe-tc-depth-probe` (worktree `.claude/worktrees/qe-tc-depth-probe`,
from `main` `8efbb827`): PREREG `97b9205f` (sealed before any timed run), records `cb213a9c`. Records only: `src/`,
`tools/`, `data/` and the board are untouched. Not merged, nothing pushed.**

- **Build:** `main`'s tip `8efbb827`; the brief named `38c787be`, and the one commit between them is docs-only
  (`git diff --stat 38c787be 8efbb827 -- src data tools` empty). `dist/uci.js`, Node v26.12.1, level 5, OwnBook off for
  the probe searches.
- **Depth / nps / overshoot, one fresh process per search, 25 positions (5 named + 20 from the milestone-1 batch):**

  | movetime | depth median [min–max] | nodes median | nps median | overshoot median / p95 / max |
  |---|---|---|---|---|
  | 100 ms | 6 [3–10] | 47 131 | 466 644 | 1.49 / 3.19 / 3.50 ms |
  | 250 ms | 7 [5–11] | 152 096 | 605 960 | 1.34 / 2.30 / 2.31 ms |
  | 500 ms | 8 [5–12] | 317 555 | 633 842 | 1.48 / 2.45 / 2.68 ms |
  | 1 000 ms | 9 [7–13] | 685 600 | 685 600 | 1.41 / 2.37 / 3.23 ms |
  | 4 000 ms | 10 [8–14] | 2 806 820 | 701 530 | 1.64 / 2.61 / 2.77 ms |
- **Warm-up at 100 ms:** warm/cold nodes 1.47× (median), nps 380 k → 586 k, depth 5 → 6; 9 of 25 positions gain one
  ply warm. Noise: one ply and up to ±25 % nodes between identical fresh 100 ms searches.
- **Sanity blocks (self-play, `rating.ts` engine shape):** 100 ms: 20 games, 0 time losses, overshoot max 4 ms,
  259.2 games/h, draws 0.45, 137.6 plies. 500 ms: 16 of 20 games (pre-registered 22 min cap), 0 time losses, overshoot
  max 3 ms, 44.2 games/h, draws 0.56, 163.7 plies. 0 of 5 355 searched moves over budget + 10 ms.
- **Stockfish 19, time to pick depth (`go depth D`, 40 positions per E):** p95 3.9 ms (E 1 910, D 4) … 19.1 ms
  (E 2 600, D 8), max 29.2 ms; 320/320 reached D. Move time for ≥ 95 %: 10 ms (E 1 910–2 300), 20 ms (2 400–2 600).
- **SPRT (estimate; draws 0.50, α = β = 0.05):** [0,10] ≈ 3 200 games (0 or +10), 5 200 worst → 12–20 h at 100 ms,
  72–118 h at 500 ms; [0,30] ≈ 350 / 580 → 1.4–2.2 h / 8–13 h; [0,50] ≈ 125 / 205 → 0.5–0.8 h / 2.8–4.6 h. Fixed
  100 games ≈ ±48 Elo, 400 games ≈ ±24 Elo (95 %).
- **Admissibility:** block 1 CLEAN-majority (4 s cell, warm and repeat rows SHARED); blocks 2–4 SHARED (a foreign
  `vitest` returned in each; wait-clear waited 120 / 1 606 / 1 807 (gave up) / 1 716 s). Tctl probe-wide median
  80.2 °C, max 90.5 °C; no thermal stop. Play 31.7 min.
- **Notes:** PREREG `…70a22605`; depth `…1889e3b0`; games + SPRT `…07357280`; Stockfish `…9fd1fdce`; observations
  `…f440e5f5` (QE-TCP-a MEDIUM host; b MEDIUM 500 ms capped; c INFO driver path fix after PREREG; d…i INFO/LOW);
  artifacts `…fa73649d`; readout `…b505d675`.
- STOP: none. No process of this hop is left running.

### Trace row (10 cells, header order)

| qe-tc-depth-probe | Probe: depth, nps and overshoot at movetime 100…4 000 ms; warm-up; 100/500 ms self-play sanity; Stockfish pick-depth time; SPRT arithmetic | EPIC-011 | — | ADR-0056 C2/C3 input; heat: width 1, Tctl median 80.2 °C / max 90.5 °C, no thermal stop; ADR-0049 d4 (0 host paths) | main @ 8efbb827 (docs-only from 38c787be): dist/uci.js unchanged by QE | probe driver 125 + 50 + 15 searches; Stockfish 320 searches; cutechess-cli 1.5.1 self-play 20 + 16 games (100 ms depth 6, 0 time losses, overshoot ≤ 4 ms, 259 / 44 games/h); QE records grugops/qe-tc-depth-probe @ cb213a9c | READ, not graded (readout …b505d675) | — | QE READ |
