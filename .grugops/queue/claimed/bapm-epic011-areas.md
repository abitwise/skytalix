---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T13:31:10Z
subtask: bapm-epic011-areas
role: ba-pm
ref: .grugops/context/bapm-epic011-areas/
branch: new grugops/bapm-epic011-areas from main — worktree .claude/worktrees/bapm-epic011-areas
width: records only; nothing run.
---
# Cut the uncut EPIC-011 areas as tickets ABC-284 onward
Owner 2026-11-04 (…4c4cb03d ruling 3): "after cutting W1, start cutting EPIC-011 areas".
1. Go through every EPIC-011 § Phases row that is still a title-only stub. Cut each as a full ticket page (problem, scope, out of scope, AC, falsifiers, NFR triggers, DoR, the ADR owed, dependencies), numbered ABC-284 upward in the epic's phase order. Each page goes into Backlog.
   - Evaluation rows: E3 rest (king attack), E4b (connected, phalanx, backward), E5 (piece terms), E6 (threats, tempo), E7 rest. Under the tuner: state which weights come from the second pull.
   - Search rows: P1 (log LMR), P4, P5, P6, O2c, Q2 (delta pruning), X1, X2 (singular / IIR), V3 (staged movegen).
   - Readings R2 and R3.
   - A row whose ADR or ruling holds it (parked, premise-gated, or waiting on another ticket) still gets a page; state the hold and its re-open trigger on the page. Do not invent bars an ADR has not set: name them as owed to the Architect. Intent class (GAIN or NEUTRAL) only where the epic or ADR-0056 already states it.
   - Add a value estimate only where ADR-0056 D2 gives one; label it an estimate.
2. Fold in the owed EPIC-011 lines for ABC-271 from the Architect's note arch-ADR-0070-accept …212d6a4c:
   - row E4: E4a → ADR-0070 ACCEPTED, structure only at 0;
   - row E2: the second pull fits KD and FP eg ≥ 0, mg 0, and holds U at 0;
   - the Phase 4 order: ABC-271 → second pull, one read judging both;
   - the owner items still open: the d6 amendment and the B-T8 re-confirm.
3. Add one pointer line in memory-bank/40-contributing.md § Conventions to the R-281-a rule (ADR-0046, last dated section). This is the only memory-bank edit allowed.
4. EPIC-011: § Phases rows (point each stub at its new id), § Tickets rows, the ids line, and § Dependencies. In § Owner questions, list any area where cutting needs an owner choice.
5. Give a recommended pull order of the new tickets after ABC-271 → second pull and ABC-282, with a one-line why each.
Fences: plans/tickets (new pages; do NOT edit ABC-271's page — bapm-ABC-271-ready holds it), plans/epics/EPIC-011, the one 40-contributing line, your records. No board, ADR or src edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task bapm-epic011-areas, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
