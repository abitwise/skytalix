---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-07T20:18:15Z
subtask: arch-ABC-292
role: architect-design
ref: .grugops/context/arch-ABC-292/
branch: new grugops/arch-ABC-292 from main — worktree .claude/worktrees/arch-ABC-292
width: ABC-292's owed ADR, PROPOSED. No src, no test, no run, no build dispatch.
---
# ABC-292: the owed ADR
Read ABC-292's page, ADR-0075 with its dated lines and § What would falsify this, …8cc32a89, …ad069f2f, …2f762abf, …61a939d3, ADR-0056 D2, D5, D6.
1. Write the ADR the page owes, following ADR-0075 d12 where it still stands: definitions, the stated rule and hand values, the G2 ratio, whether the three land as one ticket or split, intent GAIN, the read's shape. Take ABC-291's lessons as design, not as prose:
   - G2 first: K4 met by 0.0033 with its re-read spent. Price the hot path and any memo before the read, and say what the probe must show.
   - NFR-008: ≤ +0.10 s stays. Say what the term is expected to cost and where.
   - QE's freeze of K1-style fixtures is a gate before the build, on record, with the order named so the dispatch can check it.
   - Any bar clause must be one a correct build can meet: no repeat of K1 (h).
   - Name the deep value pins the term will move, as ADR-0071 D8's did, so re-pins are known before the build.
2. Be plain about the case for the term. Two reads have now missed (ABC-289, ABC-291) and …e5a5ac0c said wait might end in stop. If you think this term should not be built, say so, with why; that is a valid outcome.
3. The owner's questions, in plain words with your recommendation: d11 (d) for this term; the pawn terms in a bundle; games first over budget; what the 87.5 % door odds mean for how a lone pass is read.
Status PROPOSED: the owner accepts. If an item would move a bar, stop and say so. Fences: ADRs and your records. No ticket, EPIC, board, src or test edits. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.
