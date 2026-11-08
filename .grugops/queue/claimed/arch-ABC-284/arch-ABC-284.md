---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-08T16:56:53Z
subtask: arch-ABC-284
role: architect-design
ref: .grugops/context/arch-ABC-284/
branch: new grugops/arch-ABC-284 from main — worktree .claude/worktrees/arch-ABC-284
width: ABC-284's re-open, PROPOSED. Records only; nothing run. No src, test, ticket, EPIC or board.
---
# ABC-284: re-open P1 late-move reductions, once
The owner chose option 2 (…4d1e0382): one try at P1, probe first, build and 100 games at 100 ms only if it passes. He does not pause: his aim is step-by-step gains at 100 ms.
Read ABC-284's page, ADR-0060 with its dated lines (…e17a23f4, …1bc554fb), ADR-0063 d11, ADR-0076 d10 and d13 as the pattern for order and probe, your …569849c4, ADR-0056 D2 and D6.
1. Name the new premise on today's main (what changed since P1's two failed probes: E1's tree, ABC-283's history, ABC-303's bundle), the form (one form, chosen before any reading, with reasons), and the door counts. Your choice: a dated ADR-0060 re-open or a new ADR. Say which and why.
2. Name, up front, the rows P1 missed before (A4 (a) position-6 ratio, the 27 cp cap, zugzwang 7/7 incl. zugzwang.004) and say why this form should pass them now. If you cannot give a reason that is not a guess, say so plainly: "do not re-open" is a valid outcome.
3. The probe, written and not run, in d13's form: sealed PREREG before any measured run, its rows and bars and the rule fixed now, timing rows last and only on a held host. Any lane read is spelled with one vitest worker, never plain `npm test`.
4. The order: QE's freeze before the probe and the build, checkable by `git merge-base --is-ancestor`.
5. The NFR-008 line (≤ +0.10 s), G2's ratio if relevant, the deep pins it moves, and the intent.
6. The owner's questions in plain words with your recommendation (acceptance, and whether a miss here is final for P1).
Status PROPOSED: the owner accepts. If an item would move a standing bar, stop and say so. Fences: ADRs and your records. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.
