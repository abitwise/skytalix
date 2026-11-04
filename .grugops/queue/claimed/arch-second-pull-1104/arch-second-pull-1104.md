---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T16:55:21Z
subtask: arch-second-pull-1104
role: architect-design
ref: .grugops/context/arch-second-pull-1104/
branch: new grugops/arch-second-pull-1104 from main — worktree .claude/worktrees/arch-second-pull-1104
width: records only; nothing run.
---
# Second-pull design lines (owner: d6 yes, B-T8 yes) and the bundling rule draft
Read the owner ruling …dda43b71 (and …264e420e for the QE-271 carries), ADR-0067 (d5, d6, F3, B-T8, the f3f4 dated block, the ADR-0070 lines), ADR-0070, ADR-0056 D2/D6, and EPIC-011 § The per-change rule. The ABC-283 records are the precedent for bundling: …4c4cb03d, …6c6fb0be, …2409cec9.
1. ADR-0067: write a dated line adopting the d6 amendment: the margin-aware form, every relation bounded at once from the first fit, no refit step. State exactly how F3 now reads, and what the second pull's step list changes. Write B-T8 as re-confirmed by the owner for the second pull (about 5 h, the 200 + 200 pair).
2. Restate QE-271-f: a dated line on ADR-0070 d3 restating the endgame cost (1.12× per call measured against "about 1.085×"), and the second pull's PREREG grading an endgame cost row or stating why not.
3. List the second pull's preconditions: QE-271-h's hot-path E4a row at live values, QE-271-g's guard row, QE-271-i (the tools/tune emitter writes the four new exports), and that endgame cost row. Give the second-pull ticket's scope and bars as owed lines for BA/PM; the next id is ABC-301.
4. The bundling rule: draft it as a dated, PROPOSED section in ADR-0056 (the per-change rule), with the guards in …dda43b71 item 3. Say when bundling is allowed (related parts, shared files or a shared mechanism, a parked or marginal part), what each part must still show alone, how credit and attribution are stated, and what happens on a miss. Name it as an owner question for acceptance. Recommend which backlog tickets are natural bundles (e.g. ABC-286 + ABC-288 over history), with a one-line why each.
Fences: memory-bank/50-decisions and your records only. No ticket, EPIC, board or src edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task arch-second-pull-1104, contextRoot = the worktree's .grugops/context, `at` from `date -u`), including a decision note with the owed BA/PM lines; queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
