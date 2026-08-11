---
task: abc019-a9b-2026-08-11
subtask: quality-gate-ABC-016-qe
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ref: .grugops/context/quality-gate-ABC-016-qe/
parent_ref: .grugops/context/abc016-d19b-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-11T14:00:00Z
branch: grugops/ABC-016-status-panel
worktree: ../cli-chess-ABC-016
---

# Subtask: break `ABC-016` — the status panel, criteria now stable

**You were deliberately held back until now.** `ABC-016` had one unsatisfiable criterion (`A13`) and
then a second defect (`D19b`); a mutant net built against criteria that were about to move is
discarded work. Both are ruled and built. **`A1`–`A14` are all met and the criteria are stable, which
is what released this hop.**

Read `parent_ref:` first, then `plans/tickets/ABC-016-status-panel.md`, then — in this order, because
each hop found what the previous missed —
`.grugops/context/ticket-to-pr-ABC-016-dev/notes/`,
`.grugops/context/refinement-ABC-016-a13/notes/`,
`.grugops/context/ticket-to-pr-ABC-016-d19b/notes/`.

## What the previous hops already know, so you do not re-derive it

- **`A13`** was unsatisfiable as promoted (it demanded `isInCheck` exactly 1 while `toSan` calls
  `isInCheck` at `src/san.ts:104`). It is ruled: the panel must make exactly 1 call **of its own**,
  asserted directly on an empty history and by difference on a longer one.
- **`D19b`**: not one of the original 14 cases contained a **capture**, so a build reading the check
  indicator or material balance from item 4's **replay position** passed every criterion. A capture
  case (`3.Qxe5+`) now closes it — and the engineer verified the mutant passes `A1`, `A3`–`A12` **and
  all fifteen snapshots**, dying only on that one case.
- **Handed to you explicitly by the engineer: the snapshots are a regression record and are worth
  NOTHING as a mutant net.** Every discriminating byte is in the explicit `toContain` assertions.
  Do not let fifteen green snapshots read as fifteen green guards.

**This ticket's record is that each reviewing hop found defects the previous one missed — 16, then 2
more, then 1 more.** Treat "all criteria met" as the start of your hop, not the end.

## Two open flags you should judge, both currently BA/PM's

Both in `src/status-panel.nfr.test.ts`, deliberately left untouched:

1. `:134-139`'s comment still describes `A13` as unsatisfiable — written before the ruling, now
   stale. **You are the next reader of that comment, and it is exactly what a mutant-net author reads
   to learn what `A13` is for.** Say whether it misled you. It also cites `src/san.ts:101` (the
   declaration) where the call is `:104`.
2. The `1 - 0` ambiguity: `withSan - sanAlone === 1` is also satisfied if the spy never intercepts
   `san.ts`. The proposed one-line close is `expect(sanAlone).toBeGreaterThan(0)`. Judge whether the
   gap is real in practice and whether it belongs in the criterion or the test.

## Scope

- Break it: happy, sad and edge paths. Mutants against merged `src/` and the delivered panel.
- **Report gaps in the CRITERIA separately from defects in the CODE.** This project's record is that
  QE hops here find mostly the former — 5 on `ABC-013`, 6 on `ABC-018`, 14 builds on `ABC-023` that
  passed every criterion and the whole suite. A criterion gap routes to BA/PM, not to the Engineer.
- `quality.ui_e2e` is `ui-or-critical-path` and this project has no runnable UI surface yet, so E2E
  is not expected — say so rather than inventing one.
- Do not weaken or delete any existing test to make something pass.

## Working rules

- Work in `../cli-chess-ABC-016` on branch `grugops/ABC-016-status-panel`. Baseline **708/708 on 24
  files**, lint/typecheck/build 0, skip 0 — verify before you start, so any red is attributable.
- Do NOT write `plans/board.md` — the Orchestrator's. Request your move in your notes.
- Do NOT touch `src/turn-loop.*` or `src/frame.test.ts`. An Engineer is live on `ABC-019` and an
  Architect on the frame-width question, both in other worktrees; you never communicate with them.
- The frame-WIDTH question (widest row swings 17 → 67 columns) is live with Architect/Design and is
  NOT yours. If your testing touches it, flag it.
- `git commit` takes the INDEX, not the paths you just `git add`-ed (recorded defect `2cd84cd`).
- Never `git checkout main`, never merge, never deploy, never push.

## Recording

Typed notes into `ref:` per Workflow 16. `scripts/context-io.ts` does not exist here and
`mcp__grugops__propose_note` is unavailable — hand-author and say so. **No `finding`**: no
verification stamp is issuable to you, and note that `05-pr-quality-gate.md` describes the §14 gate
as the stamp issuer — that machinery does not exist in this repo, so do not self-attest one. Claim
per Workflow 17 (atomic `mkdir` of `.grugops/queue/claimed/quality-gate-ABC-016-qe/`, by hand).

Report: PASS / PASS_WITH_RISKS / FAIL, mutants run and killed, every survivor with its class
(criterion gap vs code defect), and your requested board move.
