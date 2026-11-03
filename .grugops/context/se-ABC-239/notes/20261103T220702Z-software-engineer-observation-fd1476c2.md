---
id: 20261103T220702Z-software-engineer-observation-fd1476c2
kind: observation
by: software-engineer
at: 2026-11-03T22:07:02Z
verified_by: 
confidence: high (every figure read from extract.json / fit.json / time -v of the two recorded runs)
refs:
  - se-ABC-239
  - grugops/ABC-239
  - ABC-239
  - EPIC-011
  - E2
  - ADR-0067
  - ADR-0048
  - ADR-0064
  - ADR-0069
  - B-T0
  - B-T1
  - B-T2
  - B-T3
  - B-T4
  - B-T5
  - F3
  - F4
  - NFR-008
  - 441c547e
  - 9eeb0314
  - 03fcaaa0
  - da3f8599
  - tools/tune/tune.ts
  - tools/tune/tracer.ts
  - tools/tune/pgn.ts
  - tools/tune/tune.test.ts
  - src/evaluate-params.ts
  - src/evaluate.test.ts
  - src/evaluate.taper.test.ts
supersedes: 
seal: sha256:9a5c7a55425c5699c8239bc909804c52bd0df4f5df8b665293394b80f025ccf4
---

# se-ABC-239 observation: data stage and offline bars B-T0–B-T3 on the pinned data. No data-stage stop fired; B-T1, B-T2 and B-T3 MET

Software Engineer, task `se-ABC-239`. The tool ran at `9eeb0314` under the host lock, one process at a time, each stage under `timeout 1800` and `--max-old-space-size=3000`. Raw: `.grugops/context/se-ABC-239/raw/out/` (`extract.json`, `fit.json`, `manifest.txt`, `stage-times.txt`, `bt3.log`).

**B-T0 (source and licence):** own self-play (Apache-2.0, `ADR-0048`; openings CC0, `ADR-0023`) plus `https://database.lichess.org/standard/lichess_db_standard_rated_2017-03.pgn.zst`, 2 169 142 067 bytes, sha256 `b319297e9270285635d615cbcd19a9b0d44747be3ff91d5b3eac41175b794320`, "Lichess database export, CC0 (database.lichess.org)", training only. **Data manifest sha256 `40b62825bdbbc599ee8aa8a6f7c6c566103e7df895a384a92130e4ac79204c6d`** (18 own PGNs repository-relative plus the Lichess entry by URL, bytes and sha256). The download first stopped at 2 158 477 258 bytes (TLS EOF); it was resumed, and `sha256sum -c` passed before any read. A byte-changed copy is refused, which the test lane checks.

**Own games:** 5 748 read, 1 609 other player, 608 duplicates, **3 531 kept**: the prototype's 3 431 plus `ABC-269`'s 100 B8 games. 402 824 positions seen: 6 695 book, 15 756 mate, 29 463 check, 86 884 noisy, 264 026 kept. 100 openings, 19 of them validation; 1 462 validation keys seen in training removed. Rows: **own training 159 044** (inner validation 46 464), **own outer validation 41 742**.

**Lichess game filters (addendum order):** 11 346 745 read. g1 event/variant/FEN 0, g2 time control 3 175 054, g3 Elo 7 769 697, g4 termination 112 849, g5 result 0, g6 BOT 0. 289 145 reached replay; **g7 reader drops 0 (0.000 %; stop 2 not fired)**; g8 duplicates 278. **288 867 games kept.**
**Position rules:** 21 084 733 seen. r1 ply < 16: 4 613 170. r2 not sampled: 14 420 734. r3 check / no move: 148 675. r4 noisy: 581 702. r6: 1 320 452 occurrences into 1 274 381 keys. r7 leakage: 19. r8 cap: 274 362 dropped. **Lichess rows 1 000 000 (stop 1, < 250 000, not fired).** That is above the addendum's 0.5–1.5 M estimate band's middle, so the cap binds.

**Stops 3 and 4:** one `extract | fit | emit` run took about 4 min 51 s: extract 3:25 / 3:28, fit 1:26 / 1:25, emit 0.1 s, against the 30 min stop. Peak RSS was extract 1.47 / 1.50 GB and fit 0.45 GB, inside the 3 000 MB heap flag. Neither stop fired.

**B-T1 (identity gate, d5): MET.** 0 misses over 1 476 629 traced keys (every own and Lichess row, before the cap), worst |model − evaluate| 0.9583 cp; equal wherever w = 24.

**K:** K_own 0.593951816371731, K_lichess 0.825960786139895.

**Inner rule (own inner validation, rounded sets):** C-S 0.590673; C-F λ 1e-8 0.590017, 1e-7 0.590865, 1e-6 0.591854; base 0.592791. **C-F, λ = 1e-8** wins (it beats C-S by 0.111 %, more than the 0.1 % margin), by the rule and not by choice. Full fit 11 Newton steps.

**B-T2 (the emitted integer set, own outer validation 41 742 rows, K_own): MET.** Cross-entropy base 0.591514 → fit 0.585921, **0.9905 ×** (< 1.000 ×). Squared error 0.077691 → 0.075722. Training (own) 0.589834 → 0.584595 (0.9911 ×), so the overfit gap is none. Reported beside it, grading nothing: on the Lichess rows (K_lichess) 0.591612 → 0.585519; the own-only fit (same rules, C-S chosen) reads 0.586859 on the same outer rows (0.9921 ×).

**B-T3 (reproducibility): MET.** Two full `extract | fit | emit` runs from the base table gave byte-identical `rows.jsonl`, `fit.json` and `src/evaluate-params.ts`, **sha256 `71610196b0816825a6d22bbeb1fecb94dbb4d548063bf8ab2fe62f034fc058e2`**.

**Emitted set, in brief:** material and the mobility cap are frozen. Passed mg 0 0 0 16 49 98 and eg 30 52 70 93 156 219 (ranks 1–3 mg at their 0 bound). Doubled 4 / 7, isolated 17 / 18, shelter 10 / 0, half-open 22 / 0, open 40 / 15, mobility 4 / 9. The pawn table absorbs a pawn-value offset (rank 2 mg −24 … −40), because material is frozen. The king eg table spans −123 … +59. **A9's int16 range row is green.**
