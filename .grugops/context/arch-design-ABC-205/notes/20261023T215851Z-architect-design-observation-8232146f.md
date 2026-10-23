---
id: 20261023T215851Z-architect-design-observation-8232146f
kind: observation
by: architect-design
at: 2026-10-23T21:58:51Z
verified_by: 
confidence: medium
refs:
  - ABC-205
  - EPIC-008
  - ADR-0031
  - ADR-0028
  - ADR-0024
  - ADR-0039
  - ADR-0044
  - ABC-204
  - ABC-083
  - ABC-079
  - NFR-005
  - NFR-008
  - memory-bank/analysis/2026-10-23-game-1.md
supersedes: 
seal: sha256:d58925639f875392a731ed44ae6ff2d694b94c7cc685f57de501766e1fc1dff8
---

# Architect/Design: ABC-205 design probes, on a scratch copy of `src/` (never `src/`). Deterministic figures, plus timing that is not a reading (loaded host)

**Host and paths.** Apple M3, Node v26.11.1, on AC, load1 7.8–9.4, with other hops running. Base = `main` `c487d89c`. Probe scripts and outputs are in the session scratchpad `design205/probe/` and are not committed:
- `relations.mjs`, `gate-row.mjs`, `cost.mjs`, `depth-one.mjs`, `nodes.mjs`, `qmult.mjs`, `g11.mjs`;
- `mutants.out.txt`.

## Results
- **Relations.**
  - `A1`: 8 of 8 strict on the candidate; base equal on 8 of 8.
  - `A2`: ending 65 > −2 (base −85 < −7). Kingside-pawn variant 33 > 19. Middlegame 38 > −33.
  - `A3`: −111 (base −31) and −187 (base −87), both queens on.
  - `A3b`: 40 against 21; the b1 twin 26 against 13.
  - Mirror: 0 mismatches over 228 positions (184 + 44).
- **Default lane** (`vitest` with the 128 MiB heap). Base copy: 10 environment reds (scratch copy without `AGENTS.md` or git). The candidate adds 11 reds in 5 files:
  - transposition `A1` 894→919 ×2, 1 325→1 357; `A5` 7 832→7 356, −488→−496;
  - ordering `A4` 8 887→8 095; `G1` 354→349;
  - pvs-lmr `A4` shipped −7 against reference 19 ×2;
  - engine `ABC-170` `A1` e2e3 against e1d2;
  - quiescence `A5` position-6 d1 10.96x against level 10.
- **Quiescence multipliers, base → candidate:**
  - kiwipete: 12.31→16.06, 15.11→22.04, 4.09→3.97;
  - position-6: 9.19→10.96, 28.46→29.36, 4.86→5.16.
  - Scale only: position-6 d1 11.02. Taper only: 9.26.
  - Deep pin: position-6 d3 bare leaf 2 355→2 315.
- **Cost** (`ABC-076` method, best of 5 × 1e6, six roots; not a reading):
  - base 677.6 / 740.9 ns; candidate 780.9 / 797.6 ns;
  - worst cell 907.7 ns.
  - The probe computes the shelter test twice.
- **Nodes to fixed depth** (deterministic):
  - Depth 6: kiwipete 175 456→171 098; position-6 188 184→187 931.
  - Depth 7: kiwipete 474 000→470 602; position-6 804 621→875 057.
  - Position-6 depth 7, scale only: 900 233. Taper only: 870 334.
- **3 s runs** (loaded host): 16 of 16 completed depth ≥ 6. The candidate matched or beat base in each interleaved pair, with one candidate depth 7 on kiwipete.
- **`G11` direction** (frozen clock, fixed depth; before 4/8/10/13/17):
  - Depth 6: base d4 e5 Ne4 d4 Kc1; candidate d3 Be2 Be2 Ng4 Kc1.
  - Depth 7: base d4 Be2 Ne4 d4 Kc1; candidate d3 Be2 Be2 Ng4 Kc1.

## Not run
- `PUZZLE_DEEP` (`G1`), `SEARCH_DEEP`, `ENGINE_DEEP` and any oracle re-run.
- `NFR-004` and `N8-LANE` readings.
- Any match. D is QE's, after `ABC-204` is Done.
