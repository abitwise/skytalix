---
id: 20261107T200924Z-architect-design-observation-ad069f2f
kind: observation
by: architect-design
at: 2026-11-07T20:09:24Z
verified_by: 
confidence: high: each figure read from QE's raw files, the notes or git on the refs; nothing was run; the lane near 9.13 s is one arm of one read beside ABC-303's 9.14 s, not a graded read of main
refs:
  - arch-ABC-291-closed
  - ABC-291
  - ABC-289
  - ABC-290
  - ABC-292
  - ABC-293
  - ABC-306
  - ABC-282
  - ABC-303
  - EPIC-011
  - ADR-0075
  - ADR-0056
  - ADR-0067
  - ADR-0071
  - NFR-008
  - NFR-009
  - OQ-0074-2
  - C2-prime
  - S-prime
  - FL
  - K1
  - K2
  - F4
  - 70d931ab
  - 780d9021
  - 78f13b30
  - qe-ABC-291/20261107T195735Z-qe-e2e-decision-211fb87a
  - qe-ABC-291/20261107T195735Z-qe-e2e-failed-attempt-6bea8618
  - qe-ABC-291/20261107T195735Z-qe-e2e-observation-f1d180b8
  - qe-ABC-291/20261107T195759Z-qe-e2e-observation-5fd10b53
  - qe-ABC-291/20261107T193342Z-qe-e2e-decision-a207a827
  - qe-ABC-291/20261106T222838Z-qe-e2e-observation-024bbd63
  - qe-ABC-291/20261106T225544Z-qe-e2e-observation-2f762abf
  - orch-2026-10-30a/20261107T195913Z-orchestrator-decision-ef659beb
  - orch-2026-10-30a/20261107T193003Z-orchestrator-decision-70f8b0c2
  - orch-2026-10-30a/20261106T225634Z-orchestrator-decision-6e0445ef
  - orch-2026-10-30a/20261106T223014Z-orchestrator-decision-a9e7118e
  - orch-2026-10-30a/20261105T113540Z-orchestrator-decision-c1623ae7
  - orch-2026-10-30a/20261106T192323Z-orchestrator-decision-40ef8351
  - arch-ABC-303-load/20261106T141500Z-architect-design-decision-a5dc0532
  - arch-ABC-291-n8/20261106T224309Z-architect-design-decision-61a939d3
  - arch-ABC-301-miss/20261105T004221Z-architect-design-decision-e5a5ac0c
  - arch-owner-answers-1105/20261105T075329Z-architect-design-decision-ba8265e9
supersedes: 
seal: sha256:5514d8782f16db691b2fc42373592a890587817f081e33ae280ac79ef7133074
---

# arch-ABC-291-closed readings: nothing of `ABC-291` is on `main`, load began about game 21, and `main`'s lane sits near 9.13 s, not the 9.30 s `…61a939d3`'s table starts from

Architect/Design, task `arch-ABC-291-closed`, on `main` `78f13b30`. No test, build, engine or game ran. Read: `qe-ABC-291`'s notes and `raw/out/c2/` at `66ca8de0`, read only; `git grep` and `git diff` on the refs. QE's figures are quoted, and the ones marked checked I read from the raw files or the refs.

## The verdict's arithmetic, checked
- 36 + 20 / 2 = 46.0. The opening pairs 11, 6, 20, 6, 7 sum to 50 pairs and 46.0. `c2-analysis.txt`, `c2-check.txt` and `summary.txt` agree.
- `…f1d180b8` says `raw/out/games/c2/`. The files are at `raw/out/c2/`, by QE's own correction `…5fd10b53`.

## What reached `main`, checked
- `git grep` for `pawnShape`, `PawnShape` and `PAWN_CONNECTED` on `main` under `src` and `tools`: no hit.
- `git diff --name-only 780d9021 main` over `src`, `tools`, `package.json`, `package-lock.json`, `vitest.config.ts`, `tsconfig.json`: 0 paths. So `main` is the read's base in every file that could matter.
- `src/uci-session.test.ts` on `main`: `D8` cp 45, `D7` cp 43, `D6` cp 87 nodes 10513. At `70d931ab`: cp 74, cp 88, cp 99 nodes 10614. These are the old and new columns of `ADR-0071` D8's table.
- `src/search.bundle.test.ts` on `main`: "`ABC-303` — the bundle's own counts at depth 8" stands at line 703.
- The memo on `main`: seven arrays, two `Float64Array` and five `Int32Array`, 36 bytes a slot, 589 824 bytes. `doubled` and `isolated` have words of their own, so d5's cut is not on `main`.
- `grugops/ABC-291` is at `9e496e4a`. `70d931ab`, the candidate, is its ancestor, and the commits between are records only. The kept branch holds the tree QE read.

## Foreign load, checked against `raw/out/c2/`
- Hold 19:33:49Z to 19:55:24Z. `start` 19:33:55Z. `after-game-1` 19:34:10Z.
- `foreign.tsv`: every sample reads none until **19:38:48Z**, the first foreign row. `host.log`'s `after-game-21` reads 19:38:45Z. So load began about five minutes and 21 games in. `host.log`'s own first non-zero sample is 19:41:55Z, since it samples more thinly.
- Foreign rows by minute, 341 in all: 19:38 3, 19:39 3, 19:41 6, 19:42 19, 19:43 7, 19:44 13, 19:46 4, 19:47 15, 19:48 3, 19:49 42, 19:50 60, 19:51 60, 19:52 60, 19:53 46. Thin, then heavy for the last quarter of the read. One class, one project. Rows are not samples: QE's 126 of 428 is the sample count.
- 3 s samples can miss a spike (`…a5dc0532`), so "none before 19:38:48Z" means none sampled.
- The held stage on 2026-11-06, QE `…024bbd63`: 0 foreign vitest in K4's 9, K5's 127 and `NFR-008`'s 83 samples, 0 of 219. One stage, on another day. It is what a held window looked like, and it is no control.
- I ran no split of the games by load. None is sealed, none could change a line, and `…f1d180b8` says the same.

## The lane
- `…024bbd63`: B 9.13 s [8.98, 9.19], H 9.30 s. `qe-ABC-303`'s graded H read 9.14 s (`…ebefbfa2`). `plans/nfr-catalog.md`'s last line reads 9.085 s at `bce24018`, before `ABC-303`.
- So `main`, with no `ABC-291`, sits near 9.13 s. `…61a939d3`'s term table is "arithmetic from 9.30 s", a tree that did not merge.
- `…f30bd604` 1 names `ABC-282`, `ABC-301` and bundle 1. `…a9e7118e` calls the budget "a line of mine". `ABC-291`'s page has no +0.10 s line of its own: its figure reached it through the PREREG's § 5. `ABC-290`, `ABC-292` and `ABC-293` have none, as `…61a939d3` says.

## Lines that assume `ADR-0075` comes into force
- `ABC-290`, `ABC-292` and `ABC-293` say "`ADR-0075`, accepted, in force at `ABC-291`'s merge" where they supersede the emitter line. `ABC-292` says it of d11 (c), `ABC-306` of d11 (b). `bapm-ABC-291-closed`'s fence holds none of these four pages.
- `ADR-0075` § Rollback, written while PROPOSED: "Strike the dated lines of `arch-ABC-291` in `ADR-0056` and `ADR-0067`."
- `…c1623ae7`, his acceptance: those lines "stand".
