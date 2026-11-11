---
id: 20261111T074937Z-software-engineer-observation-7917f458
kind: observation
by: software-engineer
at: 2026-11-11T07:49:37Z
verified_by: 
confidence: high: the diff is the commit's own; recorded as an observation because an artifact-ref needs a §14-gate run id this hop does not have
refs:
  - se-ABC-318
  - ABC-318
  - C3
  - C4
  - ADR-0045
  - NFR-004
  - grugops/ABC-318
  - db41eb4c
  - src/levels.ts
  - src/levels.test.ts
  - src/uci-session.test.ts
  - src/engine.ts
  - src/uci-session.ts
  - tools/rating/rating.ts
  - README.md
  - CHANGELOG.md
  - AGENTS.md
  - orch-2026-10-30a/20261111T073837Z-orchestrator-decision-f1dce7dd
  - qe-ABC-317/20261111T045008Z-qe-e2e-decision-6298d7f0
supersedes: 
seal: sha256:60c5a60381b375dfc1e4032c40cddf0b9ce846611ca70c6ccaa2172059e90f0c
---

# se-ABC-318: level 6 at 10 s, its pins, README and CHANGELOG — commit db41eb4c on grugops/ABC-318 (from main 902680b7)

C3 and C4 of the cut note …f1dce7dd. One commit, nine files:

- `src/levels.ts`: L6 `budgetMs` 5_000 -> 10_000; the doc comment says 10 s (5 s until ABC-318) and the L6 `NFR-004` ceiling 12 s. Other levels unchanged.
- `src/levels.test.ts`: `CEILING_MS[6]` 7_000 -> 12_000 and its doc line; ABC-174 A1 table row 6 and ABC-212 A1 `LEVELS[6]` row re-pinned to 10_000 (exact equality kept, nothing weakened). The ABC-212 A4 real-clock L6 row's vitest guard 300_000 -> 420_000 (30 moves x 10 s is 300 s of budget; the run took 300 017 ms, so the old guard would time out). Its assertions are unchanged: every move >= budget and <= `CEILING_MS[6]`. Clause B's 2 000 ms margin still holds at L6 (12 000 - 10 000), and the max ceiling stays 32 000.
- `src/uci-session.test.ts`: ABC-212 A9 "a bare go at 6 hands the engine 10 000 ms"; ABC-220 A8 levels table row 6; the TimeMode-returns-to-level row expects `[T_MS, 10_000]`.
- `src/engine.ts`, `src/uci-session.ts`: comments only, the L6 ceiling 7 s -> 12 s (stated current facts).
- `tools/rating/rating.ts`: ABC-247 header text only — L6 is 10 000 ms from ABC-318, still above `go movetime 4000`'s cap, so `rpair` searches 4 000 ms and its argv is unchanged.
- `README.md` § Levels: L6 time 10 s, L6 `~2310–2410, projected`, L7 `~2380–2540, projected`; the blunder cost (about 10 to 14 Elo per percentage point, 50 to 70 at L4's 5 %) behind 2144 to 2164; the comparison reads +73 to +79 per doubling between the Strength section's 1902.5 at 0.1 s and level 4 at 1 s. The UCI section states no L6 time, so it is unchanged.
- `CHANGELOG.md` Unreleased / Changed: "Level 6 thinks 10 s a move (was 5 s)." and the README line updated.
- `AGENTS.md` Dev / run comment: "levels 6 and 7 think 10 s and 30 s a move" (18 424 B, budget 18 432).

No snapshot pins L6 (`src/__snapshots__/*.snap` unchanged). No ADR, catalog or board edit.
