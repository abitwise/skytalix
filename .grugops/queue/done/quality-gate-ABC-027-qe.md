---
task: abc027-review-2026-08-11
subtask: quality-gate-ABC-027-qe
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ref: .grugops/context/quality-gate-ABC-027-qe/
parent_ref: .grugops/context/abc027-review-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-11T20:15:00Z
branch: grugops/ABC-027-frame-clearing
worktree: ../cli-chess-ABC-027
---

# Subtask: break `ABC-027` — the frame writer's per-row erase

**You are NOT being held.** QE was held twice this round because criteria were about to move; that
condition is absent here and the reason is named rather than the precedent applied reflexively.
`ABC-027`'s six criteria were written by BA/PM **by building the change first**, and the Engineer
re-derived every one against three mutants **without amending any**.

Read `parent_ref:` first, then `plans/tickets/ABC-027-frame-writer-clears-each-row.md`, then
`memory-bank/50-decisions/ADR-0010-frame-width-stability-ownership.md` (accepted; **do not
re-open**), then `.grugops/context/ticket-to-pr-ABC-027-dev/notes/` and
`.grugops/context/refinement-ABC-027-cut/notes/`.

## This ticket modifies MERGED PRODUCTION CODE, which is unusual here

`src/frame.ts` belongs to `ABC-018`, closed 2026-08-09. The change is one join separator, one
constant, one header sentence. **`assembleFrame` is untouched.** Weigh the blast radius accordingly:
every frame in the product goes through this writer.

## What is already established — do not re-derive

- Three mutants are already dead: the merged writer, a partial fix clearing only the first 5 rows,
  and a **degenerate fixture** where `W` no longer moves (that one fails `A2` **and** `A3` rather
  than passing vacuously). **Assume the obvious mutants are dead. Find the ones nobody thought of.**
- Measured on delivered code: one `write()`, one `\x1b[0J`, 22 `\x1b[K` = `H − 1`, 24 `\x1b` = `H + 1`,
  425 → 491 chars = `(H − 1) × 3`; fixture `W` = 37, 18, 39, 18.
- **Three forms are known-bad and named in the test file's own header comment: `F1`, `F2`, `F4`.**
  `F1` false-positives on the **correct** build. Do not reach for any of them.

## Two things to judge, not just test

1. **The screen model now implements exactly three escapes and throws on everything else.** The
   Engineer says that is a feature — any future writer change is gated by a model edit — and asks it
   not be read as a defect when the suite goes red. **Judge whether that is a good property or a
   brittleness you would report.**
2. **The `:735-771` characterization was DISCHARGED, replaced and not deleted** — both width
   assertions survive byte-for-byte, the expectation flipped to `[]`. Its form is
   `F2`-at-the-artificial-width, which the Engineer recorded as **sound there but NOT reusable** as a
   general narrowing criterion. Check that the replacement still fails on a broken writer, and that
   nothing was lost in the flip.

## Hard boundaries

- **Do NOT propose a constant-frame-width criterion or assertion.** `ADR-0010` cl. 5 refuses it: `W`
  varies **by design**, so such a check fails the **correct** build.
- Do NOT touch `src/status-panel.*` or `src/turn-loop.*`. An Engineer is live on `ABC-016` and a
  BA/PM on `ABC-019`, both in other worktrees. You never communicate with them.
- Do NOT write `plans/board.md` — the Orchestrator's. Request your move in your notes.
- Do NOT weaken or delete any existing test to make something pass.
- `quality.ui_e2e` is `ui-or-critical-path` and there is no runnable UI surface until `EPIC-006` —
  say so rather than inventing an E2E.
- Gates blocking: lint/typecheck/build 0, skip 0. Baseline **681/681 on 22 files** — verify before
  you start so any red is attributable to you.
- `git commit` takes the INDEX, not the paths you just `git add`-ed (recorded defect `2cd84cd`).
- Never `git checkout main`, never merge, never deploy, never push.

## Recording

Typed notes into `ref:` per Workflow 16. `scripts/context-io.ts` does not exist here and
`mcp__grugops__propose_note` is unavailable — hand-author and say so. **No `finding`**: no stamp is
issuable to you, and `05-pr-quality-gate.md`'s §14 gate machinery does not exist in this repo — do
not self-attest one. Claim per Workflow 17 (atomic `mkdir` of
`.grugops/queue/claimed/quality-gate-ABC-027-qe/`, by hand — create the `claimed/` parent if missing).

Report: PASS / PASS_WITH_RISKS / FAIL, mutants run and killed, every survivor with its class
(criterion gap vs code defect), your judgment on the two questions above, and your board move.
