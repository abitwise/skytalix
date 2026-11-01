---
id: 20261101T192954Z-software-engineer-observation-ff7ffb6e
kind: observation
by: software-engineer
at: 2026-11-01T19:29:54Z
verified_by: 
confidence: low: informal, not ALONE, short perft runs with spreads above 5 %; QE's D3-V2 read decides A4
refs:
  - se-ABC-250
  - ABC-250
  - EPIC-010
  - ADR-0055
  - ADR-0003
  - ADR-0056
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
  - grugops/ABC-250
  - 2e04eee5
  - ceb28780
  - src/moves.ts
  - src/apply.ts
  - src/legal.ts
  - src/zobrist.ts
  - src/perft.ts
  - src/perft.test.ts
  - src/legal.test.ts
supersedes: 
seal: sha256:0bf30002c24b486e1740548199eb444b520d8fb8733d20c300bc2b00875ea139
---

# ABC-250 speed readings — INFORMAL, not the A4/A5 grade (QE grades under D3-V2, ALONE)

All runs were under the host lock with one fresh process per run, interleaved base/head (B,H then H,B). Base is main `ceb28780`/`7b893587` (src identical) and head is `grugops/ABC-250`.
- **Not ALONE:** a foreign vitest from another repo was present on every run (`/app/...`, running about 7 h, never touched). Load1 was 1.1–1.8, and once `ps`/`gh` were above 20 % CPU. Foreign cores were not measured. Tctl peaked at 79 °C.

- **Perft, perft-bench depths** (probe.mjs: warm perft(start,3), then one timed perft; 5 runs per build per board):
  - kiwipete d4: base 20.17 M, head 22.47 M nodes/s, **1.114×** (spread B 19.8 %, H 6.3 %);
  - position-6 d4: 27.39 M vs 31.32 M, **1.144×** (12.3 %, 3.8 %);
  - start d4: 10.08 M vs 11.49 M, **1.140×** (15.6 %, 46.1 %).
  - The runs are 0.02–0.24 s long, so the spreads fail D3's 5 % bar. These are indicative only.
- **Steady state** (bench.mjs: kiwipete d4 + position-6 d4 × 8 reps per process, 3 processes per build): base 25.89–26.49 M, head 27.87–28.42 M, **≈ 1.07–1.09×**.
- **Reading for the Orchestrator:** every informal figure sits **below A4's GO bar (1.25×)**, in or near the HOLD band (1.10–1.25×) on cold perft-bench-shaped runs, and lower in steady state. A4 is QE's alone reading and decides. The page's miss rule says a HOLD or NO-GO is not merged and is dropped; that is a result, not a defect.
- **Where the time goes** (cpu-prof, kiwipete + position-6 d4, informal):
  - head: makeMovePacked 17.6 %, isSquareAttackedBy 12.9 %, generateMovesPacked 11.9 %, unmakeMovePacked 10.1 %, filterLazilyPacked 8.5 %, GC 1.6 %;
  - base: GC 4.2 %, addMove 3.7 %.
  - Allocation was a smaller share than the ADR-0055 profile suggested once ABC-254 landed.
- **A5 guard** (chooseMove at 4 000 ms, 5 runs per board per build): kiwipete **1.006×**, position-6 **0.996×**, start **0.997×**, all ≥ 0.98. Depth (9 / 10 / 11) and the move were identical on every run.
- **NFR-001 (INFO):** head perft is 11–31 M nodes/s on this host, far above 1 M.
