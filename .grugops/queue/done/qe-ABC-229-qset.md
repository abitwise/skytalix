---
subtask: qe-ABC-229-qset
role: qe-e2e
ticket: ABC-229
ref: .grugops/context/qe-ABC-229-qset/
branch: new grugops/qe-ABC-229-qset from main a649fbc4 (worktree .claude/worktrees/qe-ABC-229-qset)
width: shared, NO timed reads, no games (an SE runs npm test beside you)
---
# QE ABC-229: freeze the quiet-promotion Q-SET before the build
## Read
ABC-229 ticket (Test note 1 as corrected 2026-10-30; A1–A5), ADR-0053 d5–d9 (d9's row kinds), qe-ABC-228 PREREG
`…06163ef3` and checkpoint `…bcf2fd7c` (how the in-check freeze was done), src/quiescence.test.ts.
## Do
Freeze ≥ 6 rows of ADR-0053 d9's kinds for quiet queen promotions in quiescence: FEN, expected quiescence value /
best line under the NEW rule, the base value under the old rule, and which rows separate old from new (≥ 1 must, as
QE-C4 did). Derive expected values by hand-reasoning and fixed-depth/oracle reads only (no clock). Seal as a decision
note; this freezes the Q-SET the SE builds against.
## Fences
No src/, tools/, data/ edits. Never push/force/amend/rebase/merge into main. No board edits. Never bare `npx`/`npm exec`.
No timed reads, no games. No host paths. Scratch `qe-229-qset/`.
## Publish
Sealed notes (task `qe-ABC-229-qset`, contextRoot = worktree), commit, `## Result` here, brief + claim to done/.

## Result
- **Q-SET frozen: 9 quiet-promotion rows plus 1 INFO row**, read on `main` `a649fbc4`. Its `src` is identical to `2deed1ab`. The fixture is `.grugops/context/qe-ABC-229-qset/raw/qset/qset-229-frozen.json`. Call: `quiesce(…, -Inf, +Inf, qply 0, ply 0)`; OLD = `{ evasions: true }` (the door), NEW = `{ evasions: true, quietPromotions: true }`.
  - QP-1, Q3 safe: `8/P6k/8/8/8/8/8/K7 w - - 0 1`. Static 212 / OLD 212 / NEW **977**. Separates.
  - QP-2, square controlled: `8/1P5k/8/8/8/8/1r6/7K w - - 0 1`. −370 / −370 / −370.
  - QP-3, check-block via decision 2: `K6r/4P3/8/8/7k/8/8/4R3 w - - 0 1`. 220 / 544 / 544.
  - QP-4, only an under-promotion wins (unseen): `8/4P1k1/3q4/8/8/8/5PPP/3B2K1 w - - 0 1`. −52 / −52 / −52. `search` d1–3 picks e7e8n at 1 101.
  - QP-5, capturing under-promotion: `5r2/3qP2k/8/8/8/8/5PPP/3B2K1 w - - 0 1`. −570 / 1 073 / 1 073.
  - QP-6, KPK: `8/1KPk4/8/8/8/8/8/8 w - - 0 1`. 196 / 196 / **947**. Separates.
  - QP-7, the promotion mates: `k7/2P5/1K6/8/8/8/8/8 w - - 0 1`. 186 / 186 / **29 999** (29 994 at ply 5). Separates.
  - QP-8, the promotion comes at qply 2: `1k6/r7/1P6/8/4B3/8/8/R6K w - - 0 1`. 554 / 1 152 / **1 885**. Separates.
  - QP-9, QP-1 colour-flipped: `k7/8/8/8/8/8/p6K/8 b - - 0 1`. 212 / 212 / **977**. Separates.
  - INFO `kpk-b6c6`: `search(…, 8)` reads 186 → 902, move b6c6.
- **Derivation:** hand predictions were written first, and all held. QE's plain-negamax reference and an oracle tree (base plus QE's scratch d5 patch, never in `src/`) agree on every row: 0 fails in 71 checks, and a rerun was identical. No clock, no game.
- **SE must know:** the `ABC-228` rule row *"Q3's free quiet promotion is not searched"* in `src/quiescence.test.ts` reds on the new rule (212 → 977). Route it to `quietPromotions: false`. It is the only one of the file's 47 FEN literals that moves at qply 0. QP-7 needs evasions on. QP-8 reds a build that adds promotions at qply 0 only.
- **Notes:** `qe-ABC-229-qset/20261030T144215Z-qe-e2e-decision-fd9819a5` (the freeze) and `…-observation-92ef5670` (the reads and the SE notes).
- **Fences held:** no `src/`, `tools/` or `data/` edit, no push, no timed read, no game. Board untouched.
