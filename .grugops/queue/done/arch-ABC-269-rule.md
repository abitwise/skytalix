---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T09:25:07Z
subtask: arch-ABC-269-rule
role: architect-design
ref: .grugops/context/arch-ABC-269-rule/
branch: grugops/arch-ABC-269-rule — worktree .claude/worktrees/arch-ABC-269-rule (records only; do NOT merge grugops/ABC-269 into it)
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core. Single vitest file needs NODE_OPTIONS=--max-old-space-size=400.
---
# Rule QE-269-a; fold the owner's two answers into ADR-0064 and ADR-0056
Owner resumed 2026-11-03: "continue with ABC-269". Inputs: ADR-0064, ADR-0056, plans/tickets/ABC-269*.md, and QE's freeze records on branch grugops/ABC-269 (read with `git show grugops/ABC-269:<path>`): .grugops/context/qe-ABC-269-freeze/notes (gaps 34cbabaf, forecasts aea4ceba, PREREG 1b856350) and src/evaluate.taper-corpus.ts.
1. **QE-269-a (MEDIUM):** in the castled-corner stress endings E1's own arithmetic forecasts +13/+13/+23 cp, under the 20 cp mark, because king safety stays untapered at E1. Rule: (a) narrow ADR-0064's claim (state exactly which positions the 20 cp bar covers and why) or (b) re-open the design. Do NOT loosen a pre-registered bar after the fact; a narrowing must be written before any E1 code runs, which is still true now. Say whether QE's frozen sets/PREREG need an addendum, and if so who writes it.
2. **Fold the owner answers** (2026-11-02): ADR-0064 ACCEPTED ("64 yes"); Q-3K-4 = (b): evaluation tickets are judged on play with NFR-005's depth-6 floor; G6 "≥ base" is reported, not graded. Put both into ADR-0064 (status, decision log) and ADR-0056 (D2 lines; also the owed "P1 parked after P3" line).
3. Hand BA/PM the exact page lines owed (ABC-269 page, EPIC-011) as a note; do not edit plans/.
Fences: memory-bank/50-decisions + your records only. No src. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-269-rule, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result; brief + claim to done/.

## Result

**2026-11-03T09:35:43Z, Architect/Design (claude-opus-5-5), on `grugops/arch-ABC-269-rule` from `main` `17725732`.** Records only. No `src/` or `plans/` was touched. The one run (sealing the notes) went under `flock host-test.lock`. Nothing was pushed or merged, and nothing is left running.

- **`QE-269-a`: ruling (a), the claim narrowed, no bar moved.**
  - B1 (d)'s ≥ 20 cp covers king-and-pawn endings at phase 0 where the corner king is NOT behind its own pawns on both shelter files (`cornerShelter` none / partial, QE's D1–D6, unchanged).
  - The castled corner (S1–S3, forecast +13 / +13 / +23) is a report, and E3 owns it. The reason: only the king's square table tapers at E1, and `kingExposure` (up to 105 cp) keeps equal halves.
  - Written before any E1 code: `grugops/ABC-269` `c9c27910` differs from `main` in `src/` only by the fixture, and its worktree is clean.
  - **No PREREG or fixture addendum is needed, and nobody writes one.** The ruling selects the branch QE pre-wrote ("if out, a reported reading"), and the fixture bytes are unchanged. The Engineer prints S1–S3 in the PR, and QE reads them against the forecast, ungraded.
- **`QE-269-b` / `-c`:** dated wording lines at d2 (build only the delta form, because of −0) and B1 (e) (≥ 1.6 × under trunc). The bars are unchanged.
- **The owner's answers folded:**
  - `ADR-0064` reads ACCEPTED 2026-11-02, not in force until `ABC-269` merges. It has a new § Decision log, and dated lines at B7 (graded on `NFR-005`'s floor, "≥ base" reported), F3 and § Alternatives.
  - `ADR-0056` has a status fold and dated lines at D2 (rows E1 and E3), D6 (the order as worked, P1 parked after P3) and D7 (Q-3K-4 answered (b); scope as recorded: evaluation tickets).
- **Notes (sealed):**
  - decision `20261103T093305Z-architect-design-decision-8ccb561f`;
  - observation `20261103T093305Z-architect-design-observation-1c2ca5ff` (the page lines owed to BA/PM: 14 on `ABC-269`, 9 on `EPIC-011`).
- **Open (Orchestrator, not blocking):**
  - Whether Q-3K-4 (b) also covers value-changing non-evaluation tickets. The record says evaluation tickets, and "≥ base" binds elsewhere until a wider reading is recorded.
  - Next: a BA/PM page fold, then `se-ABC-269`.
