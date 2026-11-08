---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-08T20:12:34Z
subtask: arch-ABC-298-probe
role: architect-design
ref: .grugops/context/arch-ABC-298-probe/
branch: new grugops/arch-ABC-298-probe from main (after bapm-ABC-298-accept merges) — worktree .claude/worktrees/arch-ABC-298-probe
width: ADR-0077 d9 step 3, the count probe. Untimed. Scratch instrument only; no src/ commit, no build, no timing, no games.
---
# ABC-298: the count probe
ADR-0077 is ACCEPTED (…44810861, arch-ABC-298-accept …e16aec37); step 2's records are merged. Run d9 step 3 exactly as ADR-0077 writes it: G (full-width nodes that reach legalMoves) and C (gated depth-1–2 nodes where the hash move cuts off), s = C ÷ G per board; STOP if s < 0.048 on at least two of the three boards, else GO.
1. Seal the plan as a decision note, committed before any measured run: main's tip and src/ tree, the instrument's sha256s, the boards and depths/budgets as ADR-0077 names them, the rule word for word.
2. Instrument: a scratch `git archive` copy of src/ outside the repository, counters only, value-identical (node counts equal to main's on every board, checked and reported). No timing figure is taken or reported.
3. One results note: G, C, s per board, GO or STOP by the sealed rule. No re-run after a reading; an instrument defect gets one fix under a sealed addendum.
Lock: every run as `flock <scratch>/<home>/<repo>/host-test.lock <cmd>`, one core, one at a time. No held host is needed or to be taken. Fences: your task records, scratch, and one dated line in ADR-0077 d9 with the outcome. No src/, ticket, EPIC or board. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.

## Result

**2026-11-08, Architect/Design. `ADR-0077` d9 step 3, on `grugops/arch-ABC-298-probe` from `main` `090e17d1` (`src/` tree `bba42fb7`). Plan `…56ac06ee`, sealed and committed at `da4f1c53` before any measured run. Result `…d097e25f` (decision), sealed, committed at `81410d0b`. Read once, no re-run. No timing figure taken. No `src/`, ticket, EPIC or board edit. Nothing pushed or merged.**

1. **GO by the sealed rule.** s = C ÷ G is below 0.048 on one board of three:

   | board | G | C | s |
   |---|---|---|---|
   | kiwipete | 74 356 | 5 606 | 0.0754 |
   | position-6 | 25 180 | 1 457 | 0.0579 |
   | start | 14 458 | 462 | 0.0320 (below) |

   H at the gate is 9 831, 2 619 and 1 306. By d9, GO means only "it can pay". No figure enters SG3.
2. **Identity held, checked before any count was printed.** A scratch `git archive` of `090e17d1` (`src/` and `package.json`, blob for blob `main`'s) was run twice. The unpatched copy was run against the counted copy (counters only in `src/engine.ts` `negamax`), with `chooseMove` at `maxDepth` 9 and `now: () => 0`. Nodes, depth, score and move are equal on every board: kiwipete 1 320 857, position-6 234 984, start 64 849. The instrument check X is 0, 0. **No defect, so no addendum or fix.**
3. **`ADR-0077` d9: one dated line** with the outcome. Nothing else in the ADR moved.
4. **INFO, no part in the rule.** The gate keeps 46 %, 45 % and 34 % of the hash cuts at index 0. Remaining depth 1 rarely has a hash move. By d9's 0.6 bound (judgement), start's ceiling is 1.020, so SG3's two 1.03 boards would have to be kiwipete and position-6. The bar is unchanged.

- **Lock:** under 15 s in all. Every run was under the lock, alone, on one core. No held host was taken. The scratch copies are deleted.
- **Next:** d9 step 4, `qe-ABC-298-freeze`, on `main`'s tip, under the lock. Then the Orchestrator's check (step 5) before any build dispatch.
