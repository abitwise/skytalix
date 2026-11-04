---
id: 20261104T164437Z-qe-e2e-observation-2a7a5be0
kind: observation
by: qe-e2e
at: 2026-11-04T16:44:37Z
verified_by: 
confidence: high: C2-prime and S-prime each played once exactly per the sealed PREREG, each whole match under one host lock with 0 foreign vitest; pins verified by the harness; candidate dist differs from base only by engine.js, search.js, see.js
refs:
  - qe-ABC-283
  - grugops/ABC-283
  - grugops/qe-ABC-283
  - ABC-283
  - EPIC-011
  - O1h
  - O3s
  - S1
  - K3
  - ADR-0063
  - ADR-0065
  - ADR-0066
  - ADR-0064
  - ADR-0056
  - ADR-0050
  - ADR-0035
  - B1
  - B2
  - B3
  - B4
  - B5
  - P0
  - C2-prime
  - S-prime
  - G1
  - G6
  - NFR-005
  - NFR-008
  - R-N8H-1
  - Q-N8H-1
  - R-281-a
  - R-283-LMR
  - ab0a37b6
  - 21ae5819
  - 09694a4e
  - 0f0adfe3
  - d051784f
  - 4fb3da04
  - src/search.ts
  - src/engine.ts
  - src/see.ts
  - src/search.bundle.test.ts
  - src/levels.test.ts
  - orch-2026-10-30a/20261104T130054Z-orchestrator-decision-4c4cb03d
  - orch-2026-10-30a/20261104T133110Z-orchestrator-decision-3851bf43
  - orch-2026-10-30a/20261104T135723Z-orchestrator-decision-19583086
  - orch-2026-10-30a/20261104T142541Z-orchestrator-decision-6c6fb0be
  - orch-2026-10-30a/20261104T151305Z-orchestrator-decision-c7609f51
  - arch-ABC-283-mate/20261104T142415Z-architect-design-decision-05ef9fc9
  - se-ABC-283/20261104T135528Z-software-engineer-decision-d64042c4
  - se-ABC-283/20261104T135528Z-software-engineer-observation-0d3e1e5b
  - se-ABC-283-k3/20261104T151148Z-software-engineer-decision-0ea55b6c
  - se-ABC-283-k3/20261104T151148Z-software-engineer-observation-d1c74042
  - UAT
  - NFR-009
  - 840a343d
  - 5601c33c
  - 8f03fe47
  - ADR-0060
  - ABC-300
  - ABC-271
  - ABC-282
  - ABC-288
  - src/search.futility.test.ts
  - src/see.test.ts
  - src/evaluate.taper.test.ts
  - src/puzzle-suite.test.ts
  - qe-ABC-283/20261104T152150Z-qe-e2e-decision-f774e6d9
supersedes: 
seal: sha256:d7b9782349b5e547ab716ba2490c2083af72f00cf813bbcbbe45cb679b9faa54
---

# qe-ABC-283 B4, the one read: C2′ is **59 / 27 / 14 = 66.0 / 100 ≥ 50.0, MET** (GAIN; Elo +115.2 ± 67.0, 100 / 100 games, 0 faults, 0 time losses). S′ against E 1 810 (information) is 6 / 4 / 0 = 6.0 / 10. The Levels deep lane (a bar) is exit 0, 58 / 58, MET. Each was read once, exactly as PREREG `…f774e6d9` wrote it

QE/E2E, task `qe-ABC-283`. The PREREG was sealed and committed at `840a343d` before any game or QE run. Records: `raw/out/c2/`, `raw/out/s1/`, `raw/out/levels/`. Analysis: `raw/scripts/analyze.py`, run on the cutechess debug logs before they were deleted.

## C2′: the bar (ticket B4)
- **Command, as sealed:** `node tools/rating/rating.ts d ab0a37b6 09694a4e <out> --budget-ms 100 --rounds 50 --concurrency 1`. The whole match ran in ONE `flock <scratch>/host-test.lock` hold, from 2026-11-04T15:24:09Z to 15:43:41Z (19 min 32 s).
- **Host:** load1 was 1.27 at start, 1.98 at end and 2.10 at most (the harness's `host.log`). There were 0 foreign vitest processes at every sample.
- **Pins:** cutechess-cli 1.5.1 and Stockfish 19 equal their pins, and the openings sha256 is `0d7f7a72…`. Both sides played `st=0.1` with `timemargin=50`.
- **Artifacts:** the candidate `dist/` differs from the base `dist/` in exactly `engine.js`, `search.js` and `see.js` (24 files each). The `SHA256SUMS` lines verify the committed bytes; `d.out` (7.6 MB) is listed there and not committed, as in the `qe-ABC-279` precedent.
- **Result:** 100 of 100 complete. **W/L/D 59 / 27 / 14, score 66.0 / 100 (0.660). MET at ≥ 50.0.**
  - Elo difference +115.2 ± 67.0, LOS 100.0 %, draw ratio 14.0 %. The harness labels it `state: GAIN`, which is not the verdict. The interval does not span 0.
  - Faults 0, time forfeits 0, move-cap draws 0. Both stderr files are 0 bytes.
  - go → bestmove latency: the candidate's median is 101 ms (max 105), the base's 101 ms (max 105). No move took over 150 ms.
  - By colour: 33.0 / 50 as White and 33.0 / 50 as Black. Opening-pair scores (0, 0.5, 1, 1.5, 2) are 3, 3, 18, 11, 15.
  - Terminations: 86 by mate, 12 by threefold repetition, 2 by the fifty-move rule.

## S′: information only (`…3851bf43` 1)
- **Command, as sealed:** `node tools/rating/rating.ts r ab0a37b6 <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`, in ONE `flock` hold, from 15:43:47Z to 15:51:33Z (7 min 46 s). load1 was 1.98 at start, 2.78 at end and 3.13 at most. There were 0 foreign vitest processes.
- **Result:** 10 of 10 complete. W/L/D 6 / 4 / 0, **6.0 / 10**. Faults 0, time forfeits 0, all 10 games ended in mate.
  - Rating: 1 810 + 70.4 ± 268.9 = **1 880.4 ± 268.9**.
  - Stockfish's depth guard: 0 of 478 moves below depth 4. Latency: the candidate's median is 501 ms (max 504).
- No second ten was played, because this is information and the PREREG fixed that.

## Levels deep lane: a bar (`…3851bf43` 1)
- `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose` ran on the out-of-tree head arm (the `src/` tree of `ab0a37b6`), ALONE in one hold, from 15:51:37Z to 16:01:14Z.
- **Exit 0. Test Files 1 passed; Tests 58 passed (58). MET.**

## Game time
- 27 min 18 s in all, against the PREREG's 32 min forecast. That is within the brief's 1 h.
