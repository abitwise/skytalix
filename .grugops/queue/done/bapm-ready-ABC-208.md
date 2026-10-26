---
subtask: bapm-ready-ABC-208
role: ba-pm
ticket: plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
ref: .grugops/context/bapm-ready-ABC-208/
branch: new grugops/bapm-ready-ABC-208 from main, worktree ../wt-bapm-ready-ABC-208
width: 1 of 2 (beside arch-source-ABC-211; records only — no npm, vitest or timing)
---

# ABC-208: Ready re-score (trigger met since ABC-206 Done)

## Do
- Per BA/PM `bapm-s1-ABC-207/…f249ca34` and Orchestrator `orch-2026-10-26b`: re-score ABC-208's Definition of Ready at main's tip. Its Ready trigger (ABC-206 Done, `0a9390e5`) has been met since 2026-10-24.
- Re-read its cites against the current `src/`. Line drift is known: `engine.ts:69-71` → `:73-74`. Fold in what EPIC-008 has learned since the cut: the G6 reading rule, the frozen-clock pre-check, the D base after ABC-215, the S1 outcomes of ABC-205/207, and QE-207-g.
- If 10/10 → Ready, with In Design first (a new ADR + an ADR-0026 door, reported to the owner when written). Else, name the missing input.
- Give the board card line in your Result; don't edit the board.

## Fences
- Only your worktree and `<scratchpad>/bapm208/`. No `src/`. Do NOT run npm/vitest/timing. Never push, force, amend or rebase; never merge into main. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task bapm-ready-ABC-208). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result (ba-pm, 2026-10-26T01:07Z): **ABC-208 DoR 10 of 10 → Ready. In Design comes first (a new ADR and an `ADR-0026` door pair; the Orchestrator reports the ADR text to the owner when it lands). No missing input.**

Records only. Branch `grugops/bapm-ready-ABC-208` in `../wt-bapm-ready-ABC-208`, cut from `main` `1df54ba6`. One commit,
**`a915ed21`**, not merged and not pushed. No npm, vitest or timing. No `src/` edit. Scratch: `<scratchpad>/bapm208/`
(the note bodies and the seal scripts).

Notes are in `.grugops/context/bapm-ready-ABC-208/notes/`. They were sealed with grugops 2.1.0 `context-io.js`
`admitAndAppend` (context root: the worktree's `.grugops/context`), and `readContext` read back 3 of 3:
- `20261026T010656Z-ba-pm-decision-75bf6402`: the call;
- `20261026T010656Z-ba-pm-observation-9f3e175e`: the re-reads at `1df54ba6`. It is superseded by
- `20261026T010715Z-ba-pm-observation-a77866c6`: the same re-reads, with `src/search.ts`'s door count corrected from 9
  to 8. The count is not cited on the page.

| # | DoR item | verdict at `1df54ba6` |
|---|---|---|
| 1 | problem clear | ✅ unchanged |
| 2 | scope and out-of-scope clear | ✅ "one new door" reads as one per recursion (`ADR-0026` d10's pair) |
| 3 | INVEST-shaped | ✅ re-scored: independent now that `ABC-206` is merged (`0a9390e5`) |
| 4 | acceptance testable and measurable | ✅ re-scored: criteria unchanged, plus dated reading lines (`G1` class B under `ADR-0034` d2; EPIC-008 `G6` rule; A5 one reading, final) |
| 5 | dependencies known | ✅ re-scored: `ABC-206` and `ABC-204` Done; D base = own merge-base on `main`, which carries `ABC-215` `5c91e2e4` |
| 6 | security/NFR triggers with a measurable target | ✅ unchanged |
| 7 | test notes present | ✅ re-scored: five (4: frozen-clock pre-check; 5: ALONE, `QE-207-g` open) |
| 8 | size assigned | ✅ `M` |
| 9 | priority assigned | ✅ `P2` |
| 10 | no major unresolved blocker | ✅ re-scored: sequence hold gone; `QE-205-c` (owner) and `QE-207-g` (kit) are open and do not block |

- **In Design carries** (the ADR's calls; not blockers): R and any verification search; the door pair's names; how
  `ADR-0026` d9's drift rows re-point so its 118 cp bar still measures LMR alone (moving 118 cp is the owner's);
  which A2 positions keep non-pawn material.
- **For the Orchestrator: the ADR's status at merge has two readings.** (a) The go-ahead (`…7feb0553` item 2) plus the
  report is enough. (b) A new ADR is the owner's (`…5aaf7cec` item 3), so the merge waits on his acceptance, as the
  `ADR-0031` addendum did for `ABC-205`. Not ruled here.

Files on the branch:
- `plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md` (+48/−2);
- 3 notes (+92, +65, +67).

Not touched: `src/`, `memory-bank/`, EPIC-008, `plans/board.md`, `plans/traceability.md`, the config. In main's
checkout, only this queue record and its claim moved, uncommitted, for the Orchestrator.

### Board card line (for the Orchestrator; ABC-208 Backlog → Ready; no other column moves)

- **ABC-208, Backlog → Ready**, appended to its card: `**2026-10-26: DoR 10/10 → Ready (bapm-ready-ABC-208, …75bf6402): trigger met (ABC-206 merged 0a9390e5; ABC-204 Done); D base = own merge-base on main (carries ABC-215); G6 by the EPIC-008 rule; G1 reds class B (ADR-0034 d2); one reading, final (…4c3f7639); frozen-clock d7/d8 pre-check; reading ALONE (QE-207-g open). In Design first: new ADR + ADR-0026 door pair (R, verification, d9 re-point so 118 cp stays LMR's, A2 set) → owner when written; ADR status at merge = Orchestrator's routing.**`

### Trace row (10 cells, header order)

| ABC-208 (bapm-ready-ABC-208) | DoR re-scored 10/10 → Ready: trigger met (ABC-206 merged 0a9390e5; ABC-204 Done); criteria unchanged, dated reading lines (G1 class B under ADR-0034 d2; EPIC-008 G6 rule; A5 one reading, final under …4c3f7639); In Design first (new ADR + ADR-0026 door pair) | EPIC-008 | null-move pruning in both recursions, zugzwang guard, ADR-0026 door pair, bounded oracle (not built) | NFR-005 via G6 (expected to improve); NFR-004 abort granularity unchanged; NFR-008 N8-LANE reported; no bound moved; ADR-0026 d9 118 cp untouched; notes …75bf6402, …a77866c6 (supersedes …9f3e175e) | grugops/bapm-ready-ABC-208 @ a915ed21 (records only) | — (records only) | — (UAT owed at delivery; QE signs) | Architect/Design: arch-design-ABC-208 (new ADR + door pair → owner when written); Orchestrator: board, trace, ADR-status routing | Backlog → Ready, 2026-10-26 |
