---
id: 20261103T223637Z-architect-design-observation-85165960
kind: observation
by: architect-design
at: 2026-11-03T22:36:37Z
verified_by: 
confidence: high (each figure read from the run outputs in raw/)
refs:
  - arch-ABC-239-rulings
  - grugops/arch-ABC-239-rulings
  - ABC-239
  - ABC-270
  - ABC-274
  - ABC-269
  - ABC-083
  - ABC-215
  - EPIC-011
  - ADR-0067
  - ADR-0068
  - ADR-0064
  - ADR-0031
  - ADR-0050
  - ADR-0028
  - B-T1
  - B-T2
  - B-T3
  - B-T4
  - B-T5
  - B-T7
  - B-T8
  - F3
  - F4
  - F6
  - Q1
  - se-ABC-239/20261103T220702Z-software-engineer-failed-attempt-f39f6eb5
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
  - arch-ABC-239-rulings/20261103T222530Z-architect-design-decision-90b469ca
  - da3f8599
  - 03fcaaa0
  - 9eeb0314
  - 77034175
  - 80f128f8
supersedes: 
seal: sha256:74b91d1f7ff4ace13565bc118e024b53b5641e195c390a30960642d3509ae42c
---

# arch-ABC-239-rulings results: R1–R3 as pre-registered (`…90b469ca`). A2 (b) reads +8 on four parameters; B1 (d) is green; zugzwang.001's e1e5 loses (Stockfish 19 d26 −633, e1f1 mate in 10)

Architect/Design, task `arch-ABC-239-rulings`. Instrument as in the PREREG. A detached scratch worktree of `grugops/ABC-239` at `da3f8599`, outside the repository. Four scratch `src/` copies: the candidate, the base table (`03fcaaa0`'s `src/evaluate-params.ts`), and each with `NULL_MOVE_MIN_PIECES` = 1. Every run went under the host lock, one at a time. Scripts and outputs are in `.grugops/context/arch-ABC-239-rulings/raw/`. Nothing went into `src/` or `tools/`, and the branch `grugops/ABC-239` was not touched.

**R1, `ABC-083` A2 (b), G6 − SHELTERED, both at phase 0, Δm = +1 (the king gains g2):**

| term | Δcount | candidate (mg / eg) | base (mg / eg) | contribution at w 0, candidate / base |
|---|---|---|---|---|
| PST pawn g6 (idx 22, tied b6) | +1 | 29 / 18 | 8 / 8 | +18 / +8 |
| PST pawn g2 (idx 54, tied b2) | −1 | −31 / 19 | 0 / 0 | −19 / 0 |
| `KING_SHELTER_MISSING` | −1 | 10 / 0 | 15 / 15 | 0 / −15 |
| mobility W × Δm | +1 | 4 / 9 | 4 / 4 | +9 / +4 |
| **model = `evaluate`** | | | | **+8 / −3** |

- Reported beside it. A2 (a), g2 removed, reads −146 against −141 (green). A3 (b), e5 against f5, reads −42 against −14 (green). On the candidate the eg halves of shelter and half-open are 0.

**R2, `ABC-269` B1 (d), tapered centre − corner, candidate (base):** D1 204 (75), D2 191 (34), D3 227 (85), D4 198 (44), D5 113 (55), D6 106 (35). The relation (≥ 20) holds on all six. The door now reads −104, −165, −83, −150, −74, −111 against the pins −55, −96, −45, −86, −35, −55: that is the pin, re-pinned under B-T4.

**R3, `zugzwang.001`** (`8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1`):
- (a) Stockfish 19, depth 26, Threads 1, Hash 64:
  - root free: e1f1, cp +258 (1.6 s), as `ADR-0050` d9 records;
  - `searchmoves e1f1`: **mate 10**;
  - `searchmoves e1e5`: **cp −633**, PV e1e5 g1g2 f2f1 g2g4 e5f5 g4b4 a2a3 b4b2 f5c5 b5b4 … h2h1n.
- (b) Candidate shipped `chooseMove`, frozen clock:
  - d9 e1e5 −417 (51 502 nodes);
  - d10 e1e5 −437;
  - d11 e1e5 −467;
  - d12 **e1f1** −408 (834 546).
  Base table: e1f1 at d9 (84 325 nodes, equal to `arch-Q1-see-pruning`'s door count), d10, d11 and d12.
- (c) Floor-guard variant (`NULL_MOVE_MIN_PIECES` = 1), d9: e1e5 on the candidate table, e1e6 on the base table.
- **By rule 2, e1e5 is a SAFETY FAILURE.** Rule 4 does not arise.

**Stops:** none fired. The whole read took under 1 min of host time.

**Process note (honest):** the first Stockfish driver held stdin open with a long `sleep`. Cleaning it up with `pkill -f` matched my own shell, which the `AGENTS.md` warning covers. The leftover processes (the old driver, its `sleep` and `stockfish`) were then stopped by PID with SIGTERM. The results above come from the clean re-run. Nothing of mine is running.
