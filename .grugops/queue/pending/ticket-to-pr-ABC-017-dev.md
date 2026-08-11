---
task: abc017-pull-2026-08-11
subtask: ticket-to-pr-ABC-017-dev
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-017-dev/
parent_ref: .grugops/context/abc017-pull-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-12T00:15:00Z
branch: grugops/ABC-017-history-pane
worktree: ../cli-chess-ABC-017
---

# Subtask: implement `ABC-017` — the bounded move-history pane

**You are building the last unbuilt ticket in the merge chain.** Order is
`ABC-016` → `ABC-027` → `ABC-017` → `ABC-019`; three tickets are waiting behind this one.

Read `parent_ref:` first, then `plans/tickets/ABC-017-bounded-move-history-pane.md`, then
`memory-bank/50-decisions/ADR-0009-frame-row-constant-ownership.md` and
`memory-bank/50-decisions/ADR-0010-frame-width-stability-ownership.md` — **both accepted, neither to
be re-opened.**

## Two ADRs land directly on this ticket

- **`ADR-0009` cl. 5 assigns YOU the composition fit-check in `src/frame.test.ts`** — read from
  *delivered* geometry (`renderBoard(...).length` plus the real exported constants) with a `<= 24`
  requirement, replacing a merged assertion that is a tautology over three local literals. This is
  `A13`. **No other ticket may write it.**
- **`ADR-0010` amended this ticket in THREE places** (`D21`): the constant-width assertion in `A2` is
  **kept character for character**, but the claim that this pane "is expected to be the widest panel
  and therefore to SET `W`" is **struck as measured false** — the pane is 21–24 columns against the
  status panel's 45/50/67. **Do not reintroduce that reasoning anywhere.**
- **`ADR-0010` cl. 5 REFUSES a constant-frame-width criterion.** `W` varies by design. `A2`'s
  constant-**pane**-width assertion is a different quantity and stands.

## Your file boundary — measured, and it is why you can run concurrently

- **YOURS**: the history-pane module and its tests, plus `A13` in `src/frame.test.ts` at `:38-45`,
  `:288`, `:633`.
- **`ABC-027` also edits `src/frame.test.ts`** and is in `In Security/NFR`. BA/PM measured that **no
  line is claimed by both** — it touches the screen model, `:374`, `:376`, `:419`, `:735-771`.
  `ABC-027` merges **before** you, so you will rebase onto it. **Stay off those lines.**
- **NOT YOURS**: `src/status-panel.*` (`ABC-016`), `src/turn-loop.*` (`ABC-019`), `src/frame.ts`
  itself (`ABC-027` owns the writer).

## What this project will expect of you, on the record

Every dev hop in this round has done these, and the ones that did found real defects:

- **Build wrong builds and run them.** Recent hops wrote 5, 11 and 11 mutants; one killed eight of
  QE's own survivors. A criterion you never saw fail is one you cannot report on.
- **Do not inherit a witness table** — re-measure anything you report.
- **Flag criteria defects; do not amend them.** BA/PM owns the ticket text. Three engineers this
  round found defects in criteria and every one flagged rather than fixed.
- **State plainly which criteria are met and which are not.** "Met in part" is an acceptable and
  respected answer here.

## Working rules

- Work in `../cli-chess-ABC-017` on branch `grugops/ABC-017-history-pane`, created from current
  `main`. Absolute paths. `node_modules` symlinked.
- Do NOT write `plans/board.md` — the Orchestrator's. Request your move in your notes.
- Two agents are live in other worktrees (BA/PM on `ABC-016`, Security/NFR on `ABC-027`). You never
  communicate with them; the on-disk shared context is the only channel.
- Gates blocking: lint/typecheck/build 0, skip 0. Baseline on `main` is **676/676 on 22 files** —
  verify before you start so any red is attributable to you.
- `quality.tdd` is `encouraged`; `self_fix_attempts` is 2 — after two rounds, stop and report.
- `N8-LANE` binds: this ticket's own file count was corrected 1 → 2 (floor ~320 ms). Do not add more.
- `git commit` takes the INDEX, not the paths you just `git add`-ed (recorded defect `2cd84cd`).
- Never `git checkout main`, never merge, never deploy, never push.

## Recording

Typed notes into `ref:` per Workflow 16. `scripts/context-io.ts` does not exist here and
`mcp__grugops__propose_note` is unavailable — hand-author and say so. **No `finding`.** Claim per
Workflow 17 (atomic `mkdir`; create the `claimed/` parent if missing — it has been absent twice).

STOP CONDITIONS: a defect in the acceptance criteria (flag, do not amend); a gate red after 2
self-fix attempts; the work turning out larger than `S` (2 points).
