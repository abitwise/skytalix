---
subtask: bapm-ready-ABC-209
role: ba-pm
ticket: plans/tickets/ABC-209-the-transposition-table-is-kept-across-the-moves-of-one-game.md
ref: .grugops/context/bapm-ready-ABC-209/
branch: new grugops/bapm-ready-ABC-209 from main, worktree ../wt-bapm-ready-ABC-209
width: 1 of 3 — records only (no npm, vitest, build or timing)
---

# ABC-209: Ready trigger met (ABC-208 Done) — DoR re-score

## Do
- Read Orchestrator `orch-2026-10-26q/…836cb92d` (ABC-208 merged as `b5c67ab7`, S1 MET) and the BA/PM `bapm-ready-ABC-208` hop as the model (`…75bf6402`).
- Re-score the ABC-209 page's DoR against the kit's `checklists/definition-of-ready.md` at main's current tip. Re-check every `file:line` cite against the tree: null move moved `search.ts`/`engine.ts`.
- State on the page what this ticket carries forward from the epic:
  - D base = its own merge-base on main, which now carries ABC-208.
  - G6 by the EPIC-008 rule.
  - One reading, final (`…4c3f7639`).
  - A frozen-clock d7/d8 pre-check.
  - The reading runs ALONE.
  - NFR-009 growth ≤ 1 MiB over 40 moves (over = STOP).
- The page names an `ADR-0025` D4 amendment that goes to the owner. Say whether it is needed as written, or whether the change fits inside an accepted ADR. Don't decide it; flag it for Architect/Design's design hop.
- Put the board card lines in your Result: Backlog → Ready if DoR is 10/10, otherwise what is missing. Don't edit the board.

## Fences
- Work only in your worktree. No `src/`, and no npm/vitest/timing.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `bapm-ready-ABC-209`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result (ba-pm, 2026-10-26T12:36Z): **ABC-209 DoR 10 of 10 → Ready. In Design comes first: the `ADR-0025` decision 4 amendment is needed as written. Its form and its status are flagged for Architect/Design and not decided here. No input is missing.**

Records only. Branch `grugops/bapm-ready-ABC-209` in `../wt-bapm-ready-ABC-209`, cut from `main` `53b67d53`. One
commit, **`79e926ce`**, not merged and not pushed. No npm, vitest, build or timing was run, and `src/` was not edited.
Scratch: `<scratchpad>/bapm209/` (the note bodies and the seal script).

Notes are in `.grugops/context/bapm-ready-ABC-209/notes/`. They were sealed with grugops 2.1.0 `context-io.js`
`admitAndAppend` (context root: the worktree's `.grugops/context`, `at` from `date -u`). `readContext` read back
2 of 2:
- `20261026T123609Z-ba-pm-decision-955d0031`: the call;
- `20261026T123609Z-ba-pm-observation-0d64cbc5`: the re-reads at `53b67d53`.

| # | DoR item | verdict at `53b67d53` |
|---|---|---|
| 1 | problem clear | ✅ unchanged. The cite `src/transposition.ts:17-20` holds; the file is unchanged since the cut |
| 2 | scope and out-of-scope clear | ✅ unchanged. Dated line: the entry paths are `src/cli.ts:200` and `src/uci-session.ts:370`/`:374` |
| 3 | INVEST-shaped | ✅ re-scored: independent now that `ABC-208` is merged (`b5c67ab7`) |
| 4 | acceptance testable and measurable | ✅ re-scored. Criteria unchanged, plus dated lines: `G1` class B (`ADR-0034` d2); the `EPIC-008` `G6` rule; A6 one reading, final; QE fixes the A4 40-move game |
| 5 | dependencies known | ✅ re-scored: `ABC-208` and `ABC-204` Done. D base = own merge-base on `main`, which carries `ABC-208` |
| 6 | security/NFR triggers with a measurable target | ✅ unchanged: `NFR-009` ≤ 1 MiB over 40 moves; over = STOP |
| 7 | test notes present | ✅ re-scored: five (4: frozen-clock d7/d8 pre-check; 5: ALONE, `QE-207-g` open) |
| 8 | size assigned | ✅ `S` |
| 9 | priority assigned | ✅ `P3` |
| 10 | no major unresolved blocker | ✅ re-scored: the sequence hold is gone. The amendment is In Design's work. `QE-205-c` (owner) and `QE-207-g` (kit) are open and do not block |

- **Cites after null move:**
  - the page's only `file:line` cite holds;
  - the clear sites moved to `src/engine.ts:550` (was `:492`) and `src/search.ts:605` (was `:498`), with the text
    unchanged.
- **`ADR-0025` D4: the amendment is needed as written.**
  - **Why:** D4 reads "It does not persist across moves". § Alternatives rejects persistence "now, not forever" and
    names `T1`'s measurement as the condition for re-opening. `ADR-0026` covers only the door shape. No accepted ADR
    holds a per-game lifetime.
  - **Whose call:** changing an accepted ADR is the owner's (`…5aaf7cec` item 3). The go-ahead is `…7feb0553`
    item 2, and the text is reported to him when it lands.
  - **Flagged for `arch-design-ABC-209`:** whether it is an amendment or a superseding ADR, and its status at the
    reading and at merge. `ABC-208`'s precedent is reading (b) (`…d25ab770`), and the Orchestrator routes it.
  - **The amendment's calls:**
    - the non-continuing `position` rule;
    - aging and replacement;
    - the clear door (`clearTable` is already exported);
    - whether `search()` keeps its clear;
    - § Alternatives' three objections;
    - `T1`;
    - `ADR-0026` d7's 2026-09-26 sentence and `ADR-0006`'s two 2026-09-26 errata;
    - the `ADR-0032` blunder path;
    - the source comments.
- **Note on G6 and the pre-check.** Each run is a fresh process, so by A1 head is node-equal to base. The pre-check's
  8 counts must therefore be equal (a difference is an A1 red, and QE stops). G6 reads timing noise, not this change,
  and a miss is reported against A1. Nothing in the G6 rule moves.

Files on the branch:
- `plans/tickets/ABC-209-the-transposition-table-is-kept-across-the-moves-of-one-game.md` (+73/−2);
- 2 notes (+104, +89).

Not touched: `src/`, `memory-bank/`, EPIC-008, `plans/board.md`, `plans/traceability.md`, the config. In main's
checkout, only this queue record and its claim moved, uncommitted, for the Orchestrator.

### Board card line (for the Orchestrator; ABC-209 Backlog → Ready; no other column moves; Ready 0/8 → 1/8)

- **ABC-209, Backlog → Ready**, appended to its card: `**2026-10-26: DoR 10/10 → Ready (bapm-ready-ABC-209, …955d0031): trigger met (ABC-208 merged b5c67ab7, S1 MET; ABC-204 Done); D base = own merge-base on main (carries ABC-208); G1 class B (ADR-0034 d2); G6 by the EPIC-008 rule (fresh run node-equal by A1); one reading, final (…4c3f7639); frozen-clock d7/d8 pre-check (counts equal by A1); reading ALONE (QE-207-g open); NFR-009 ≤ 1 MiB over 40 moves, over = STOP. In Design first: ADR-0025 D4 amendment needed as written (D4 "does not persist across moves") → owner when written; form and status at reading/merge = Architect/Design + Orchestrator routing (precedent …d25ab770).**`

### Trace row (10 cells, header order)

| ABC-209 (bapm-ready-ABC-209) | DoR re-scored 10/10 → Ready: trigger met (ABC-208 merged b5c67ab7, S1 MET; ABC-204 Done); criteria unchanged, dated reading lines (G1 class B under ADR-0034 d2; EPIC-008 G6 rule; A6 one reading, final under …4c3f7639; A4 40-move game fixed by QE); In Design first (ADR-0025 D4 amendment, needed as written) | EPIC-008 | TT kept across the moves of one game, cleared at a new game, test-only clear door, size unchanged (not built) | NFR-009 ≤ 1 MiB over 40 moves (over = STOP), 4 MiB table, ≤ 16 MiB total; NFR-004/005/008 re-read; no bound moved; notes …955d0031, …0d64cbc5 | grugops/bapm-ready-ABC-209 @ 79e926ce (records only) | — (records only) | — (UAT owed at delivery; QE signs) | Architect/Design: arch-design-ABC-209 (ADR-0025 D4 amendment → owner when written; form + status flagged); Orchestrator: board, trace, status routing | Backlog → Ready, 2026-10-26 |
