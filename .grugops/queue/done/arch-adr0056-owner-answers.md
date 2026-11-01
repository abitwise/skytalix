---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T15:26:44Z
subtask: arch-adr0056-owner-answers
role: architect-design
ref: .grugops/context/arch-adr0056-owner-answers/
branch: new grugops/arch-adr0056-owner-answers from main (worktree .claude/worktrees/arch-adr0056-owner-answers)
width: records only, beside qe-ABC-254 (tests under the lock), se-ABC-249, and bapm-owner-answers (plans/ only).
---
# Architect: fold the owner's three answers into ADR-0056 D5
## Owner word (verbatim inside): .grugops/context/orch-2026-10-30a/notes/20261101T152518Z-orchestrator-decision-43098cef.md
"1. b ; 2. ok ; 3. quick check can be with 0.5s difficulty. Make sure engine is not changed internally and it works on different difficulty settings."
## Do
1. Per-epic read (replaces your D5 200+200 vs SF): 400 games HEAD-TO-HEAD, epic's closing build vs its starting build, 100 ms each, openings with both colours, one at a time, restart=on, 50 ms margin; pass rule and resolution (~±24 Elo) stated; wall ~1.5 h (pre-approved by owner). Outside opponent now = the smoke (item 3) + the 40/15 claim reading.
2. GAIN/NEUTRAL bars: mark owner-accepted.
3. Smoke vs Stockfish: kept, 10 games at 0.5 s per move (not 4 s); SF settings per C1 at that control; when it is owed (per strength change beside the 100-game read, and per epic). Write the owner's condition as a rule: test controls are harness/config only — no engine code path keyed on the control, budget or a test flag; and validation must show the engine still plays correctly across its difficulty settings (skill levels and time controls in use) — name the cheapest existing lane/harness check that proves it (look in src/ tests and tools/ for skill-level rows) or state what is missing so BA/PM can cut it.
## Fences
memory-bank/50-decisions/ADR-0056* and your notes only. Run nothing. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task arch-adr0056-owner-answers, contextRoot = worktree), commit, ## Result + trace row here, brief + claim to done/.

## Result

by: architect-design (claude-opus-5-5, arch-adr0056-owner-answers), 2026-11-01T15:36Z. Records only; nothing run.
Branch `grugops/arch-adr0056-owner-answers` (worktree `.claude/worktrees/arch-adr0056-owner-answers`): claim `d673c006`,
ADR `fe50a11f` (272 insertions, 0 deletions, ADR-0056 only), notes `2f8a9438`. Not pushed, not merged.

- **1 b, C3″ (supersedes C3′):** 400 games head to head per epic, closing head against the epic's starting SHA, both
  100 ms, 50 ms margin, level 5, `restart=on`, width 1. Openings 1–100 with both colours, wrapped once (d's default
  200 rounds): `d <head> <base> <out> --budget-ms 100 --rounds 200 --concurrency 1`. MET at ≥ 200.0 of 400 (point
  estimate ≥ 0); a miss holds the next epic's strength tickets for BA/PM suspects and an Orchestrator ruling. About
  ±24 Elo (draws 0.50); P(MET) is 0.95 at +20 and 0.05 at −20. Wall ≈ 1.55 h. Stated blind spot: self-play
  non-transfer is now unseen between 40/15 readings (pool the S′ scores).
- **2 ok:** the GAIN ≥ 50.0 and NEUTRAL ≥ 43.0 bars are marked owner-accepted.
- **3, S′:** 10 games against Stockfish 19 at 0.5 s (`st=0.5` both; C1's floor; `r`'s pin). E = 1 650, not 1 910
  (estimate: an unchanged build expects 67–83 %, near S-4's design point; at 1 910 S-4 would misfire). 50 ms margin.
  `r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`. Owed per strength ticket beside C2′ and per epic
  beside C3″. About 10 min.
- **R-TC:** test controls live in the harness and the shipped UCI options only. No engine path is keyed on the control,
  a budget value, a test flag or the environment. At `adab5f0d` the budget enters the core only as the deadline in
  `src/engine.ts`. Every read plays the SHA's `dist/uci.js`. Harness tickets change `tools/` only.
- **The difficulty-settings check (named):** per strength ticket, the Levels deep lane, `ENGINE_DEEP=1
  NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose` (41 tests, ≈ 555 s:
  levels 1–7 budgets, the level-1 blunder path, level 5 at 4 s and levels 6–7 on the real clock, level 1 < level 5 on
  puzzles). Per epic it adds the ladder in short mode and the UCI session deep lane. Every PR already has the default
  rows in `npm test`.
- **Gaps for BA/PM:** G-1, no mechanical guard for R-TC item 2 (one XS source-scan row, test-only). G-2, the Levels
  deep lane's recorded trigger misses `search.ts` / `evaluate.ts` / `quiescence.ts` / `transposition.ts` (a records
  line).
- **ABC-255:** item 2 re-pointed to `r --budget-ms 500` (`rpair` at 100 ms dropped); the acceptance adds the C3″ and S′
  dry runs and one ungraded S′ on `main`. Still size S. **ABC-256: recommend drop.** C4/C1 re-pointed: A0/A1 take their
  own 100 ms outside reading.
- **Notes (sealed, `.grugops/context/arch-adr0056-owner-answers/notes/`):** decision
  `20261101T153456Z-architect-design-decision-d3c756d1`; observation `…c8c38f1e` (the difficulty-settings check, the
  code facts, the gaps); observation `…c6c100d2` (the artifact pointer).
- No NFR added or moved. Open owner calls: Q-3K-4/6/7/8. STOP: none.

### Trace row (10 cells, header order)

| arch-adr0056-owner-answers | ADR-0056 third fold: C3″ 400 head-to-head per epic at 100 ms (≥ 200.0/400); GAIN/NEUTRAL bars owner-accepted; S′ smoke 10 games vs SF at 0.5 s (E 1 650); rule R-TC + Levels deep lane per strength ticket | EPIC-011 | — | none added or moved; ADR-0056 C3′ superseded, C4/C1 re-pointed | memory-bank/50-decisions/ADR-0056-… (grugops/arch-adr0056-owner-answers @ fe50a11f) | — (records only; nothing run) | — | — | ARCH DONE (decision …d3c756d1) |
