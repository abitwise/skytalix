---
subtask: se-ABC-205-owner-words
role: software-engineer
ticket: plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
ref: .grugops/context/se-ABC-205-owner-words/
branch: grugops/ABC-205 (4f650a45), worktree ../wt-ABC-205
width: 1 of 3 (not timing; deterministic lanes only)
---

# ABC-205: apply the ruled test edits now that the owner said yes

## Do
- In ../wt-ABC-205, apply the ruling's edits 1 and 2 exactly as written, and the OD-205-1 cell per ADR-0031 A6 (floor of 1.5 x the build's own reading; state the reading and the new value).
- **Do NOT merge main into this branch.** main carries 7c9cd9b9, a restore that takes ABC-205's src back off main; merging it would delete this build. The Orchestrator handles it at merge time.
- Re-run SEARCH_DEEP transposition, pvs-lmr and the quiescence cell lane; report the drift lines, the mate-floor line and the cell reading. Then lint, typecheck, build, npm test (record .test-results/last-run.json counts) and the skip capture per AGENTS.md. Heap flags on deep lanes (NODE_OPTIONS=--max-old-space-size=400).

## Fences
- Only ../wt-ABC-205 and /private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se205/. Test files named in the ruling only; no other src. Never push, force, amend or rebase; never merge into main; don't touch the remote or plans/board.md.

## Publish
- Commit on grugops/ABC-205. Seal notes (task se-ABC-205-owner-words), at from date -u. ## Result + trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**DONE. The ruled edits are applied and every lane and gate is green.** (Software Engineer, 2026-10-24.) Branch
`grugops/ABC-205`: the edits are in `18a0570e` and the notes in `f3e14a00`, on top of `4f650a45`. Worktree `../wt-ABC-205`.

- **Edits:**
  - Ruling edit 1: transposition `A4` deep row, re-pinned to `maxDepth: 10` on a frozen clock. `ticks` is deleted, the shipped depth is `toBe(10)`, and the row is renamed with its comment rewritten.
  - Ruling edit 2: pvs-lmr `reportAndBar` goes from 75 to 118 cp. Both titles follow, and one comment cites OD-205-2.
  - OD-205-1: quiescence `A5` position-6 d1 goes from 10x to **16x**, which is ⌊1.5 × 515/47 = 10.96x⌋.
  - Only those three test files changed. No other src was touched.
- **Readings:**
  - Drift: `search() d5` reads 96.79 % within 25 cp of 187, max 79 cp (position-6/e2d2 56 → 135). `chooseMove to d5` reads 97.33 %, max 79 cp, on the same position. Both have 0 mate flips.
  - Mate floor: d4 → d5, 0 of 180 violated.
  - Quiescence cell: reads 10.96x. The old level was 10x (red), and the new level is 16x (green).
- **Gates:**
  - SEARCH_DEEP lanes: transposition 40/40, pvs-lmr 29/29, quiescence 37/37. The default quiescence lane is 29/29.
  - lint, typecheck and build exit 0.
  - `npm test`: 62 files, 2 054/2 054. `last-run.json` reads success true, with 0 pending and 0 todo.
  - Skip capture is 0. The integrity check reports "No findings.", exit 0.
- **Notes:**
  - `.grugops/context/se-ABC-205-owner-words/notes/20261024T080705Z-software-engineer-decision-d6487b34`
  - `…-observation-12af0d93`
  - Both are on the branch, sealed by grugops 2.1.0 `admitAndAppend`, and both seals read back `ok`.
- **Not done here (the Orchestrator's):**
  - The merge. main carries the restore `7c9cd9b9`, so a plain merge will not bring the build back (`…c3d204a5`). main was NOT merged into the branch.
  - G6: this host was on battery.
  - The QE hop.
  - The board.
  - Nothing was pushed.

### Trace row (10 cells, header order)

| ABC-205 (se-ABC-205-owner-words) | King safety bites while queens are on, and the king table is tapered: the owner-word test edits | EPIC-008 | — | ADR-0031 A6 (OD-205-1); ADR-0026 d9 amendment (OD-205-2); ADR-0028 | `grugops/ABC-205` @ `18a0570e` (src/transposition.test.ts, src/search.pvs-lmr.test.ts, src/quiescence.test.ts) + notes `f3e14a00` | SEARCH_DEEP transposition 40/40, pvs-lmr 29/29 (drift max 79/79 cp ≤ 118; mate floor 0/180), quiescence 37/37; default quiescence 29/29 (cell 10.96x ≤ 16x); npm test 2 054/2 054; skip 0 | — | — | In Development: owner words applied; waiting on G6, QE and the merge (with the 7c9cd9b9 restore reverted) |
