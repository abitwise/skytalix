---
id: 20261022T153507Z-software-engineer-observation-ac6b8407
kind: observation
by: software-engineer
at: 2026-10-22T15:35:07Z
verified_by: 
confidence: high (every count was run; no timing)
refs:
  - ABC-178
  - QE-178-b
  - QE-178-a
  - QE-177-a
  - ABC-167
  - EPIC-007
  - efaa0a76
  - 0fb19ab9
  - 0036e5c6
  - d12831c6
  - 43e4996f
  - d781e5e5
  - 20261022T152530Z-ba-pm-decision-1f4936b2
  - 20261022T152530Z-ba-pm-observation-34bf730b
  - 20261022T151738Z-qe-e2e-decision-1ad5f522
  - 20261022T151717Z-qe-e2e-observation-f910b911
  - 20261022T141254Z-software-engineer-decision-82e891e8
  - src/uci-session.test.ts
  - plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md
supersedes: 
seal: sha256:26f91786feeaea8f06d8b01925646b50f8e140c79f3037c9d177e72a250cd2da
---

# ABC-178b red-first (amended B6, SE pre-check): QP1c survives the whole lane at the current tip (0/1 996) and is red at the new tip on R1 alone (1/1 996). QP1 and QP1a stay red, QP0 stays green, QP1b survives (accepted)

- **Harness:** `gp-qe178.mjs`, a byte copy of `grugops/qe-ABC-178` @ `d781e5e5` (`git show`, `cmp` equal to the worktree file, sha256 `12c0b8dbad1aa255…8dfcb3`).
- **Trees (scratch, each with its own full `cp -R` of `node_modules`):** H0 = `git archive 0fb19ab9` (the current tip after the merge; its `src/` equals `efaa0a76` plus `main`). H1 = H0 plus the fold (`diff -rq` shows only `src/uci-session.test.ts`, +2 lines).
- **Results (counts only; the seconds the probe prints are not claimed):**

| tree | mode | QP0 | QP1 | QP1a | QP1b | QP1c |
|---|---|---|---|---|---|---|
| H0 | file | 0/127 | 1/127 R1 | 1/127 R1 | 0/127 | **0/127** |
| H0 | lane | 0/1 996 | 1/1 996 R1 | 1/1 996 R1 | 0/1 996 | **0/1 996** |
| H1 | file | 0/127 | 1/127 R1 | 1/127 R1 | 0/127 | **1/127 R1** |
| H1 | lane | 0/1 996 | 1/1 996 R1 | 1/1 996 R1 | 0/1 996 | **1/1 996 R1** |

- **Where it goes red (test note, added):** QP1c applied by hand to H1, then `vitest -t "ABC-178 R1"` fails at `src/uci-session.test.ts:289:68`, the re-check line. R1's first check (line 286) stays green. The mutant was reverted and `cmp` matches the git copy of `src/uci-session.ts`.
- `gp-qe178.mjs` reported no `RESTORE FAILED` and no `ANCHOR COUNT`. QP1b is reported only, not graded (QE-178-a is accepted).
- This is the SE's red-first. B6 as a gate belongs to QE.
