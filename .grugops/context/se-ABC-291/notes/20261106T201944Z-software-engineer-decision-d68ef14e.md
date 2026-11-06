---
id: 20261106T201944Z-software-engineer-decision-d68ef14e
kind: decision
by: software-engineer
at: 2026-11-06T20:19:44Z
verified_by: 
confidence: high on the form, which reproduces the patch's counts to the node
refs:
  - ABC-291
  - ADR-0075
  - EPIC-011
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
  - G1
  - G2
  - orch-2026-10-30a/20261105T141318Z-orchestrator-decision-69ee96e7
  - orch-2026-10-30a/20261106T192323Z-orchestrator-decision-40ef8351
  - arch-ABC-291-probe/20261105T141205Z-architect-design-decision-2926c26b
supersedes: 
seal: sha256:9893b98afafa940456c6020178d6520f66799e09c2021b44ad7bb2e54740e69c
---

# se-ABC-291 decision: the term built as `ADR-0075` d1 to d5 on `main` `8e115110`, with d5's cut; the choices the ADR leaves to the engineer

Hand values as d2 fixes them. Nothing tuned, no game, no graded timing, no K4 or K5 read.

1. **The probe's patch, re-anchored.** `patch_e4b.py` applied to this base with two counts moved: door records 18 → 21 in `src/search.ts`, 13 → 16 in `src/engine.ts`, for bundle 1's doors. No other anchor moved. The form is the prototype's, so K2's group 6 signature `futilityNode(…, taper, pawnShape, phase)` holds.
2. **d5's cut.** One word, `pawnCacheDoubledIsolated`, holds the packed sum of doubled and isolated. The memo is five 4-byte words beside the masks: 2^14 × 36 = 589 824 bytes, 576 KiB, +0. The head reads the same with and without the cut on K0 (c)'s seven rows.
3. **K1's rows sit in `src/evaluate.pawns.test.ts`,** so no new default-lane file. K1 (f) is `ABC-274` A9. K1 (b) is the re-pointed `ABC-271` and `ABC-270` K1 (b) rows and `ABC-269` B1 (c).
4. **No QE freeze of K1's fixtures is on record.** Test note 1 says QE freezes them before the build, and no such note exists. `PAWN_SHAPE_POSITIONS` is the probe's offered 16. `SEAM_ROWS`, 36 rows, is mine, worked by hand from d1 and d2. QE owes the freeze or its corrections.
5. **The tool's quiet filter needed `pawnShape: true`.** `isQuiet` compares the stand pat with the shipped `evaluate`. With no field, the stand pat reads the off evaluation, so every position the part touches reads as not quiet, and two `TUNE_DEEP` rows went red. d11 (a) does not name this line; K7 cannot read green without it. `QUIET_RULES`, `QUIET_RULES_NAME` and their source row change. It still has no `seePruning`.
6. **`A2 (b)` re-found, not re-pinned,** by the row's own scan on this tree: `r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/3RK2R b Kkq - 1 1`, b4c3 230 on the head, budget 5, depth 2, 3 332 nodes on head and base. The old fixture's `a3b4` head stops at 1 153 against 3 197 here.
7. **Commit order.** The tool line is `e57a4a0a`. One test-only commit, `e76d22f3`, follows it, because a line I added to `A0-2` was wrong and amend and rebase are fenced. It holds no production line, so d11 (a)'s reason stands.
