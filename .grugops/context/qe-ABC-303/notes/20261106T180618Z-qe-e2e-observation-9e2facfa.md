---
id: 20261106T180618Z-qe-e2e-observation-9e2facfa
kind: observation
by: qe-e2e
at: 2026-11-06T18:06:18Z
verified_by: 
confidence: high: count rows byte-identical to the earlier read; P6 and P7 carried by tree identity on the Orchestrator ruling, not re-read
refs:
  - qe-ABC-303
  - grugops/ABC-303
  - grugops/qe-ABC-303
  - ABC-303
  - ABC-286
  - ABC-288
  - EPIC-011
  - ADR-0056
  - ADR-0072
  - ADR-0073
  - ADR-0046
  - R-BUNDLE-1
  - PREREG
  - C2-prime
  - S-prime
  - G1
  - G2
  - G6
  - NFR-005
  - NFR-008
  - NFR-009
  - R-CEN-1
  - bb0cc134
  - 63667fc8
  - 38914841
  - arch-owner-answers-1104b/20261104T220311Z-architect-design-decision-d776c0f0
  - arch-bundle-1/20261104T201203Z-architect-design-decision-aa5c4dc1
  - orch-2026-10-30a/20261104T215525Z-orchestrator-decision-3e73f9f9
  - orch-2026-10-30a/20261105T215707Z-orchestrator-decision-43e6d8fd
  - se-ABC-303-main/20261105T122839Z-software-engineer-observation-bd60978c
  - se-ABC-303-main2/20261106T134724Z-software-engineer-observation-e6cff498
  - secnfr-census-1105/20261105T115526Z-security-nfr-decision-b9038a14
  - qe-ABC-303/20261106T135702Z-qe-e2e-decision-53858301
  - qe-ABC-282/20261104T230342Z-qe-e2e-observation-b4427cbd
  - qe-ABC-303/20261106T140659Z-qe-e2e-decision-b59650bc
  - orch-2026-10-30a/20261106T164759Z-orchestrator-decision-318c9e3b
  - arch-ABC-303-load/20261106T141500Z-architect-design-decision-a5dc0532
  - FL
  - 55996783
  - qe-ABC-303/20261106T165315Z-qe-e2e-decision-79bd6622
  - qe-ABC-303/20261106T170749Z-qe-e2e-observation-397a7ec5
  - qe-ABC-303/20261106T171254Z-qe-e2e-observation-f0be43f8
  - qe-ABC-303/20261106T171431Z-qe-e2e-observation-2f8fccef
  - qe-ABC-303-b4
  - B4
  - eb7b7e17
  - 04d6e75c
  - qe-ABC-303/20261106T140659Z-qe-e2e-observation-7141269d
  - qe-ABC-303/20261106T175340Z-qe-e2e-decision-ebefbfa2
supersedes: 
seal: sha256:bc6927cad85d57386cc4ad6f6a32ecaa653887f59c64c6b9542cd1f57b2dd334
---

# qe-ABC-303 B4 on the merged tree: the stale rule's diff is empty, every count row reads as `…7141269d` read it, and the branch is ready to merge. The merge is the owner's

QE/E2E, task `qe-ABC-303`, brief `qe-ABC-303-b4`, under PREREG `…53858301` § 7. No game and no timed read. Verdict `…ebefbfa2` stands. Every output file was non-empty before it was read. Raw: `raw/out/b4/`.

**The merge.** `main` `04d6e75c` into `grugops/qe-ABC-303` at `eb7b7e17`, with `git merge`, no rewrite. One conflict, `plans/traceability.md`: the rows of both sides kept, five in the hunk. `main` brought records only.

**The stale rule.** `git diff bb0cc134 <tip>` over `src`, `tools`, `data`, `package.json`, `package-lock.json`, `vitest.config.ts`, `tsconfig.json`, `AGENTS.md`, `biome.json`: **empty**. The whole diff is under `.grugops/`, `memory-bank/` and `plans/`. `main`'s `src/` is still `5bd2f414`, `38914841`'s, so the base has not moved and no game runs again.

**The arms.** H = `git archive eb7b7e17`, B = `git archive 04d6e75c`, each `diff -r` empty against the arm `…7141269d` read. `drv.ts` 33dd73f4 and `forms2.ts` 50bf416a unchanged; `lines.tsv` 0b2d57c2 unchanged. `b4-rows.sh` d36e9db5 is `rows.sh`'s `r()` with the modes cut to these rows. `b4-gates.sh` 97365dda is `gates.sh` with the heap prefix on the default bundle line, the fault `…7141269d` records, and its `lines.tsv` path as an argument. Gates ran in the worktree at `eb7d8a9e`, the merge plus the claim and those two scripts. Each mode had its own lock hold, on one core, 17:57:14Z to 18:04:41Z.

**Table 1, beside `…7141269d`.**
| row | bar | at the tip | `…7141269d` | same |
|---|---|---|---|---|
| S1 | exact | 12 of 12; d8 523 847 / 234 214, 707 548 / 101 425 | the same | yes |
| S2 | exact | 58 of 58: 17 `search` and 12 `chooseMove` doors, 0 lost; 6 new doors | the same | yes |
| S3 | 0 on each | B1 0 / 191; B2 0 / 189; B3 0 / 190, 189, 190, 189, 163; 0 / 188 | the same | yes |
| S4 | 7 / 7 | 7 / 7 at recorded depths | the same | yes |
| S5 | ≥ 54 / 58, none new | 54 / 58, none newly missed | the same | yes |
| S6 | 0 | 0 sign changes and 0 mate flips, all three doors, both recursions | the same | yes |
| S7 | ≥ 95 %, none beyond 25 cp | 100 %, 9 cp / 100 %, 4 cp | the same | yes |

**Table 2, count rows, beside `…7141269d`.**
| row | bar | at the tip | `…7141269d` | same |
|---|---|---|---|---|
| P1 | present and green | 39 / 39 default, 49 / 49 `SEARCH_DEEP`; the test names equal the earlier logs', so the same 24 are `ABC-303`'s | 39 / 39, 49 / 49, 24 | yes |
| P2 | M3 and C1 as written | `src/` tree equal, so the same source; `moveCountNode` read again against `ADR-0072` d1, d2, d4. Direct calls: T 4 / 7 / 12, 0 at d0, d4, the root, a wide window, a mate window, two non-pawn pieces; 0 in check, 7 out of it | the same | yes |
| P3 | ≤ 0.89 × on each | 0.6039 / 0.8170 / 0.7509 / 0.8363 | the same | yes |
| P4 | ≥ door + 0.10 | +0.1158 (6.900 → 7.0158; 33 deeper, 13 shallower) | the same | yes |
| P5 | 3 072 bytes | 3 072 | the same | yes |
| P8 | as the gates state | typecheck, lint, build 0; `npm test` 71 files, 2 734 / 2 734; skip count 0; `No findings.` twice; 23 of 23 `-t` lines by count, `ABC-167` A5 4, every other 1 | the same | yes |

**Stronger than the figures.** All 11 row files (`s1`, `s2`, `nodes`, `reach`, `drift`, `bytes`, `forms`, `forms2`, `floor`, `zug`, `g1`) are byte-identical to `…7141269d`'s (`raw/out/b4/cmp.txt`). **No difference, so no STOP.** The default bundle line passed first time, with its prefix.

**P6 and P7, carried by tree identity (brief step 4, the Orchestrator's ruling, made before any B4 figure existed). No timed run.** They stand as `…f0be43f8` and `…ebefbfa2` read them: P7 H 9.14 s, H − B −0.010 s; P6 kiwipete 10 ≥ 9, position-6 12 ≥ 12.
- **The tree:** `src` `bba42fb7`, `tools` `c361f429`, `data` `018e1ecb`, `package.json` `383f4719`, `package-lock.json` `59b35eba`, `vitest.config.ts` `6b8699e9`, `tsconfig.json` `5981ee75`, `AGENTS.md` `b7fad6a5`, `biome.json` `b3b0672d`. sha256 of `git ls-tree` over those nine paths: `cd79822a74c80cb1`, at `bb0cc134` and at the tip.
- **What the identity does not cover:** the root tree differs, by records. `qe-hop-integrity.test.ts`'s whole-tree reads run under `ENGINE_DEEP` only, so record growth is not in P7's lane that way; its default rows read the board and named folders. No figure of P7 was taken here to test that, and both arms would carry it.

**Not read, and why.** Table 3, `krk`, `fire`, `audit`: outside step 3. R1, R3 and R6's figures sit inside the identical `drift` and `nodes` files. Those two modes were run for S6, S7 and P3. C2′, S′, Levels, R5: no game, no timed read.

**Foreign load, class and count.** load1 0.53 to 1.31 around the row holds, 2.02 after the gates. Busy node-class processes: 0 in all 22 samples around the row holds, and 0 after the gates; the gate holds were not sampled. No count can move with it. `/tmp` quota: 10 774 340 kB of 12 360 249 kB. I cleared nothing.

**Records.** The merge put `pending/qe-ABC-303.md` and `pending/qe-ABC-303-read.md` back on this branch, from `main`. `done/` holds both with only `## Result` added, so I removed the two stale copies as the end of those moves.

**Ready.** The branch is ready to merge: stale rule empty, tables 1 and 2 whole, verdict `…ebefbfa2` standing. Still owed by others: B5's line, and `R-N8H-1` LOW at 9.14 s. Merge and deploy stay with the owner.
