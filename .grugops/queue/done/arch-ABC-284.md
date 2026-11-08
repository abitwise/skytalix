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

## Result

**2026-11-08, Architect/Design. Items 1 to 6 answered. Records only, on `grugops/arch-ABC-284` from `main` `50ff9250` (`src/` tree `bba42fb7`). Notes `…2476937b` (observation), `…9ae6cff1` (decision). Dated insertions only, in `ADR-0060` (§ Status, a new section § The 2026-11-08 look, d9, § Alternatives) and `ADR-0056` D2. No test, build, engine or probe run. No ticket, EPIC, board or `src/` edit. Nothing pushed or merged. No bar moved.**

- **Outcome: do not re-open (my recommendation), with the look written in full in case he takes it anyway.** PROPOSED; the owner decides.
- **1 (premise, form, counts, place):** premise: today's tree (E1, Q1, `ABC-283`'s bundle, bundle 1), with no P1 reading on it. Form: decision 1 exactly, no history term, chosen before any reading: the only form not already read on these rows. Door counts 311 546 / 163 523 (`search()` d8) and 573 518 / 94 911 (`chooseMove`), from the pinned rows. A dated `ADR-0060` re-open, not a new ADR: the form, bars, switch and doors are its own.
- **2 (the rows):** `A4` (a) and the 27 cp cap: a reason measured over H1 (0.7749; 25 cp). `zugzwang.004` at d11 and R-283-LMR's same-depth d5 floor: none that is not a guess, and every reading on a futility tree went against them. Odds below one in ten, by judgement.
- **3 (the probe):** LR0 to LR11 in `ADR-0076` d13's form, written, not run. A PREREG is sealed in `arch-ABC-284-probe` before any measured run. The two doubtful rows run first; timing runs last on a held host; lane reads use `VITEST_MAX_WORKERS=1 npx vitest run`. The rule is fixed: no tuning, no second form, no subset.
- **4 (the order):** `ADR-0076` d10's table. QE's freeze (`qe-ABC-284-freeze`) comes before the probe (`git merge-base --is-ancestor <freeze commit> <PREREG commit>`) and before the build (the Orchestrator's `git merge-base --is-ancestor <freeze commit> main`).
- **5 (NFRs, pins, intent):** `NFR-008` ≤ +0.10 s stays (expected +0.01 to +0.12 s, `UNKNOWN - verify`). `G2` is not relevant. The deep pins are named. The intent is GAIN ≥ 50.0.
- **6 (for the owner):** 1 no; 2 yes, on a pass only; 3 yes, a miss is final for P1; 4 keep the same-depth floor (loosening it would move a standing bar, so it is not proposed).
