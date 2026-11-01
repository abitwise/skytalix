---
id: 20261101T070329Z-software-engineer-observation-0d04bf8a
kind: observation
by: software-engineer
at: 2026-11-01T07:03:29Z
verified_by: 
confidence: high on what was run; SE-246-a's cause is UNKNOWN - verify
refs:
  - se-ABC-246
  - ABC-246
  - EPIC-009
  - ADR-0052
  - NFR-008
  - QE-221-a
  - SE-221-g
  - SE-246-a
  - ABC-221
  - ABC-170
  - qe-ABC-221/20261031T060935Z-qe-e2e-observation-8ad25906
  - qe-ABC-221/20261031T060935Z-qe-e2e-observation-c6f37a35
  - se-ABC-221/20261031T053932Z-software-engineer-observation-7896971d
  - grugops/ABC-246
  - 3c5e05fd
  - 832ff246
  - src/uci-session.test.ts
  - src/engine.test.ts
supersedes: 
seal: sha256:9bfaa282a2a9c80ce0c198189bc1acefe0081b6794e5b50153f2acd6573c97cb
---

# `ABC-246` artifacts and handoff: branch `grugops/ABC-246` @ `3c5e05fd`, two test files; one INFO for the records (SE-246-a); none blocks

- **Branch:** `grugops/ABC-246` from `main` `832ff246`, worktree `.claude/worktrees/se-ABC-246`. Not merged and not
  pushed.
- **Code commit `3c5e05fd`:**
  - `src/uci-session.test.ts`: +18, the `ABC-246` nested block with rows A1 and A2.
  - `src/engine.test.ts`: +4 −1, the comment only.
- **Tests added:** `ABC-221 — … › ABC-246 (QE-221-a) — … › A1: …` and `› A2: …`.
- **Commands:** `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`,
  `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`,
  `node tools/grugops/lane-inventory.js`. Out of tree: `raw/plant.mjs` and `raw/abc170-a2-readings.mjs`.
- **For QE:**
  - Re-read A3 on the whole lane: HSCM must red A1 and CLOCKWINSCM must red A2.
  - Read `G8` on a clear host. The head median feeds `ABC-248`'s base.
  - Check A4 with `git diff main -- src/engine.test.ts`.
- **SE-246-a (INFO, not edited, out of scope):** the same `ABC-170` A2 block's next comment says "On 6 000 the abort
  lands at 6 746 nodes, inside depth 3 (d = 2 …)".
  - The block's exact call reported **6 893 nodes** at depth 2 on this head (`raw/abc170-a2-readings.txt`). The
    depth agrees, and the row's bounds (`≥ 6 000`, `≤ 6 000 + NODES_PER_CLOCK_CHECK`) hold.
  - The node figure has likely drifted with later search changes. Whether the comment's 6 746 counted the same thing
    is `UNKNOWN - verify`.
  - It is a comment in a row this ticket does not own, and the ticket fences that block to the one comment, so I
    left it. It belongs to the next ticket that edits that block.
- **STOP:** none.
