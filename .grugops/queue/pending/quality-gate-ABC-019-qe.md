---
task: abc019-review2-2026-08-11
subtask: quality-gate-ABC-019-qe
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ref: .grugops/context/quality-gate-ABC-019-qe/
parent_ref: .grugops/context/abc019-a9b-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-11T16:30:00Z
branch: grugops/ABC-019-turn-loop-skeleton
worktree: ../cli-chess-ABC-019
---

# Subtask: break `ABC-019` — the turn loop, 23 criteria stable

**You were held back through two BA/PM hops.** `ABC-019` arrived with three routed defects, BA/PM
found six more, and one of them (`A9b`) changed the code. **All 23 criteria are now met and stable,
which is what released this hop.**

Read `parent_ref:` first, then `plans/tickets/ABC-019-turn-loop-skeleton.md`, then — in this order,
because each hop found what the previous missed —
`.grugops/context/ticket-to-pr-ABC-019-dev/notes/`,
`.grugops/context/refinement-ABC-019-seam/notes/`,
`.grugops/context/ticket-to-pr-ABC-019-a9b/notes/`.

## Your scope is bounded, and the boundary is named rather than assumed

**Test the 23 criteria as they stand.** `ADR-0010` (accepted, on `main`) owes this ticket **one more
criterion — after a narrowing, the screen equals the frame — and it is NOT YET IN THE TICKET and
cannot be built**, because it depends on `ABC-027`, which is not yet cut. A second, narrow QE pass
follows after `ABC-027` merges and the `ADR-0009` cl. 9f real-panel re-gate. **Do not test what is
not there, and do not treat its absence as a gap you found.**

**`ADR-0010` carries a PROHIBITION that applies directly to you: do NOT propose a constant-frame-width
criterion.** `W` varies **by design** (`W = max(board 18, status, history)`, `src/frame.ts:179`), so
such a criterion would fail the *correct* build. Proposing one is exactly what a width-aware reviewer
would otherwise do — read `ADR-0010` before you go near width.

## What previous hops already established, so you do not re-derive it

- The render seam's fourth `messages` argument is **forced, not chosen** — the 3-arg form cannot
  satisfy `A5`. Clause 9's ruling was re-established by measurement and is untouched by it.
- **`A3b` was wrong about BOTH counts.** `repetitionCounts` reads **0** because `gameStatusOf` calls
  it inside `src/history.ts:152`, and the only build making it read once per ply is one `A3` forbids.
- The engineer wrote **five wrong builds for `A9b`**, all typecheck-clean, all red — including
  repair-then-throw-a-**new**-error, which only its identity assertion catches. It also wrote **11**
  wrong builds on the first hop. **Assume the obvious mutants are already dead; go looking for the
  ones nobody has thought of.**
- **`A18`'s two stub shapes are load-bearing**: a height literal tuned to shape A is green on all of
  `A19` under shape A alone and dies only when shape B runs.

## Three honest non-claims the engineer made — these are your best leads

It stated these rather than papering over them, so they are gaps *it already knows about*:

1. **`A3`'s "render follows evaluate" half is not asserted inside `A3`'s own test** — it is pinned by
   `A4`'s `statuses[8]`. The engineer called this reasoning from structure, **explicitly not
   measured**, because a render-before-evaluate mutant is a structural rewrite it did not build.
   **You can build it.**
2. **Row 14 carries no frame-count assertion.** `A9b` names none and neither does the row's Expected
   cell.
3. **`A17`'s out-of-tree timing half was not re-run this hop.** The binding clause (spied counts at
   40/120/300) was.

## Scope

- Break it: happy, sad, edge. Mutants against the delivered loop and merged `src/`.
- **Report CRITERIA gaps separately from CODE defects.** This project's record is that QE hops here
  find mostly the former — 5 on `ABC-013`, 6 on `ABC-018`, 14 passing builds on `ABC-023`. A criterion
  gap routes to BA/PM, not to the Engineer.
- `quality.ui_e2e` is `ui-or-critical-path` and there is no runnable UI surface yet, so E2E is not
  expected — say so rather than inventing one.
- Do NOT weaken or delete any existing test to make something pass.

## Working rules

- Work in `../cli-chess-ABC-019` on branch `grugops/ABC-019-turn-loop-skeleton`, rebased onto current
  `main` and re-gated by the Orchestrator. Baseline **717/717 on 24 files**, lint/typecheck/build 0,
  skip 0 — verify before you start so any red is attributable to you.
- Do NOT write `plans/board.md` — the Orchestrator's. Request your move in your notes.
- Do NOT touch `src/status-panel.*` or `src/frame.test.ts`. A QE hop is live on `ABC-016` and a BA/PM
  hop on `ABC-027`/`ABC-017`, both in other worktrees. You never communicate with them.
- `git commit` takes the INDEX, not the paths you just `git add`-ed (recorded defect `2cd84cd`).
- Never `git checkout main`, never merge, never deploy, never push.

## Recording

Typed notes into `ref:` per Workflow 16. `scripts/context-io.ts` does not exist here and
`mcp__grugops__propose_note` is unavailable — hand-author and say so. **No `finding`**: no
verification stamp is issuable to you, and `05-pr-quality-gate.md`'s §14 gate machinery does not
exist in this repo — do not self-attest one. Claim per Workflow 17 (atomic `mkdir` of
`.grugops/queue/claimed/quality-gate-ABC-019-qe/`, by hand).

Report: PASS / PASS_WITH_RISKS / FAIL, mutants run and killed, every survivor with its class
(criterion gap vs code defect), and your requested board move.
