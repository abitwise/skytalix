---
id: 20261106T213042Z-qe-e2e-decision-7febbbfe
kind: decision
by: qe-e2e
at: 2026-11-06T21:30:42Z
verified_by: 
confidence: high: blob ids and the 16 read at both commits; the rest is what the sealed records say
refs:
  - qe-ABC-291
  - grugops/ABC-291
  - grugops/qe-ABC-291
  - ABC-291
  - EPIC-011
  - ADR-0075
  - 70d931ab
  - 9e496e4a
  - 780d9021
  - qe-ABC-291/20261106T210624Z-qe-e2e-decision-a49d69d7
  - ADR-0056
  - K1
  - PREREG
  - arch-ABC-291-k1c/20261106T211039Z-architect-design-decision-6e97a0b6
  - orch-2026-10-30a/20261106T211205Z-orchestrator-decision-32c023cc
supersedes: 
seal: sha256:02cdf3b2a7f03236d9912957ae4b5d4253d9ab256e276cd4bcdbede68ed8846e
---

# qe-ABC-291 ADDENDUM to PREREG `…a49d69d7`: the form (b) sets named, what landed after the seal, the tools' environment, and one reader corrected. Sealed before any timing run. No bar moves, and no word of CF1–CF10, FL or d8's table moves

QE/E2E, task `qe-ABC-291`. `arch-ABC-291-k1c` merged on `main` at `f5f58250` while stage 0 ran, after the PREREG's seal at `22319099`. `…6e97a0b6` § 4 and `…32c023cc` owe QE three items. This note carries two of them, and the third, the labeller read, is in the K1 note. No timing run or game has started.

## 1. Test note 1's "(b) rows": the form (b) sets, named
They are `ADR-0075` K1 (b)'s dated line's sets. **QE froze none of them, and the note's letter was not met.** No set was chosen after the build. Each stands on a commit older than `aec95beb`, the build's first. Blob ids, read at `8e115110` and `9e496e4a`, are equal:

| set | where | blob |
|---|---|---|
| `G3`, 184 | `src/evaluate.mirror-corpus.ts` | `4091c681` |
| `TAPER_MIRROR_POSITIONS`, 30 | `src/evaluate.taper-corpus.ts` | `f9ea084d` |
| the 287 | `src/search.mate-corpus.ts` | `74f97fd7` |
| the seven | `ADR-0050` d9's table, as `drv291.ts` copies it | the ADR |
| `G1`'s 58 and its baseline | `src/puzzle-corpus.ts`, `src/puzzle-suite.baseline.json` | `2423651c`, `da408de7` |
| the 16 | `PAWN_SHAPE_POSITIONS`, read equal in order to `PAWN_SET` (`e4bprobe.ts`, sha256 `8b070dda…`, sealed at `d033ea0e`): 16 of 16 | |

No freeze is made now: one now would protect nothing.

## 2. K1 (c) is reported in two halves, and never as met
By `ADR-0075` K1 (c)'s dated line of `arch-ABC-291-k1c`: the rows by count, and the order "not met to the letter". § 9's "MET" row of the PREREG reads with that. Every QE note on this ticket writes it this way. Whether `ABC-291` merges with the order not met is the owner's question (`…32c023cc`), and he has not answered. It holds no read, because K4, K5 and C2′ read the same five production files either way. The verdict states it as open until his word is on the record.

## 3. The tools' environment
§ 6's two `rating.ts` commands need `CUTECHESS_CLI` and `STOCKFISH` set: a bare `--dry-run` stopped at "CUTECHESS_CLI is not set", before any build or game. With both set to the pinned binaries, sha256 `dc776901…` and `c78c22a9…`, equal to `rating.ts`'s pins, `d` and `r` each printed their argv, wrote nothing and started nothing. The sealed commands do not change. `<out>` stays open until the launch.

## 4. One reader corrected, nothing moved
`k2read.py` (sha256 `0442014d`) matched 0 of 63 reds, because `se-ABC-291`'s list holds each row cut short and it compared whole strings. That is my script's fault, and no row was read through it. `k2match.py` (`ba752e38`) reads a red as listed when it starts with a list entry. It reads the same two files, and its only change is the comparison.

## 5. Stage 0's count for `NFR-008`
B read 71 files, 2 734 passed, as sealed, so `n8.sh` needs no change.
