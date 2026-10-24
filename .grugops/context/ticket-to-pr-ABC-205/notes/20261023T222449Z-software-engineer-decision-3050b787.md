---
id: 20261023T222449Z-software-engineer-decision-3050b787
kind: decision
by: software-engineer
at: 2026-10-23T22:24:49Z
verified_by: 
confidence: high (deterministic); G2 on a shared host
refs:
  - ABC-205
  - EPIC-008
  - ADR-0031
  - ADR-0028
  - ADR-0026
  - ADR-0024
  - ABC-079
  - ABC-083
  - ABC-170
  - ABC-212
  - NFR-005
  - NFR-008
  - 613f4548
  - 51997b7e
  - 68be197f
  - grugops/ABC-205
  - arch-design-ABC-205/20261023T215851Z-architect-design-decision-1fb6e1bc
  - arch-design-ABC-205/20261023T215851Z-architect-design-observation-8232146f
  - plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
supersedes: 
seal: sha256:f21e61be78c1ce2f107a3e7207fee4601805f1b7e6e9f359214bbd6b797af7cb
---

# Software Engineer: ABC-205 gate readings and OD-205-1 conditions on the build (host shared: load1 3.2–7.0, ABC-212 SE and ABC-206 Architect running)

## OD-205-1 cell (owner's word; left red)
- position-6 d1 reads 515 / 47 = **10.957x** against the 10x level. 1.5 × the reading is 16.44, so ⌊⌋ = 16x, as proposed.
- ADR-0028 d1 conditions:
  1. The identity rows are green in the default lane and every deep lane. The oracle rows are green after the oracle re-run.
  2. Taper-only reads 9.26x, under 10x; the taper alone does not red the cell. Scale-only reads 11.02x.
  3. The bar's mutant, quiescence with its MVV-LVA sort removed, reads 52.19x, above 16x.
- The other five cells:
  - kiwipete 16.06 / 22.04 / 3.97x;
  - position-6 29.36 (d2) / 5.16x (d3).
  - All under level and as ruled.

## G2 (ABC-076 method; base = `git archive f47b3429 src`, branch = HEAD; one fresh process each, order base → branch → branch → base)
- base 653.4 / 645.3 ns; branch 700.7 / 700.5 ns.
- +47 to +55 ns (about +8%). Worst cell 790.1 ns (startpos, branch).
- load1 3.2–3.6. Under 990 ns, so no second session is owed. MET against 1 100 ns. Readings were taken on a shared host.

## Lanes (tip 68be197f unless noted)
- lint rc 0; typecheck rc 0; build rc 0.
- `npm test`: 62 files, 2 054 tests, 2 053 passed, 1 failed (OD-205-1 only). `last-run.json` success false.
- Skip count 0; integrity `No findings.`
- PUZZLE_DEEP (G1): **55/58** against baseline 54/58. Newly solved: seed 234, mate-in-3.
- SEARCH_DEEP (run at 51997b7e; quiescence re-run at 68be197f):
  - ordering 38/38;
  - transposition 39/40 (S1);
  - search 57/57;
  - quiescence 36/37 (OD-205-1 only, after the re-pins);
  - pvs-lmr 27/29 (S2/S3).
- ENGINE_DEEP: transposition 26/26; engine 60/60; levels 35/35.
- Not run:
  - LADDER_DEEP, CLI_DEEP, UCI_DEEP, ZOBRIST/PERFT (they do not read evaluate's values);
  - G6 (it needs width 1 and ≥ 5 interleaved rounds; this host was shared);
  - D (QE, after ABC-204).
- N8-LANE: no new file. `evaluate.king-mobility.test.ts` runs 25 tests in about 46 ms.

## Overlap with ABC-212
- Shared file: `src/engine.test.ts`, in disjoint hunks (212: RF-1, about lines 597–670; 205: the ABC-170 A1 fixture, about line 1236). `git merge-tree` is clean.
- Semantic overlap:
  - ABC-212's levels/ENGINE_DEEP rows read the engine, and so read evaluate. Whichever branch merges second re-reads ENGINE_DEEP levels and engine.
  - ABC-170 `A2` uses `LONG_MS = HARD_CEILING_MS` (32 000 on 212). maxNodes still binds first there.
