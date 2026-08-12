---
task: abc028-owed-2026-08-12
subtask: quality-gate-ABC-028-regate
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ref: .grugops/context/quality-gate-ABC-028-regate/
parent_ref: .grugops/context/ticket-to-pr-ABC-028-t493/
enqueued_by: orchestrator
enqueued_at: 2026-08-12T19:15:00Z
branch: grugops/abc028-owed-2026-08-12
worktree: (main tree; make your OWN scratch worktree for any mutant build — see below)
---

# Subtask: the FINAL re-gate of `ABC-028` — owed, named at the merge, not absorbed

`ABC-028` is **`Done` and MERGED to `main`** (fast-forward `95086ae` → `a92d0fa`, then `0ee148e`).
It **merged carrying owed work that the Orchestrator named rather than absorbed**, and this is the
first of the two owed items.

**What is owed, exactly.** Your last verdict on this ticket — `READY_FOR_HUMAN_REVIEW` — was taken at
**755 tests on 26 files**. The tip is **807 on 28**. The delta since your verdict is **ONE comment
block in a test file (`+8/−4`, commit `1ae7b8f`) plus ticket text**, and the four blocking gates are
green on `main`. **The role gate did not re-run, and the Orchestrator explicitly did not call it
re-run.** Discharge that.

## Read first (Workflow 16 — read before you act)

- `parent_ref:` in full — the Engineer's five notes from `abc028-t493`, the hop that landed the last item.
- Your own two prior gates: `.grugops/context/quality-gate-ABC-028-final/` and
  `.grugops/context/quality-gate-ABC-028-narrow/` — **your four gaps `F1`–`F5` and the narrow re-gate
  that followed them.** Do not re-derive what those notes already hold; do not retry a recorded failed
  attempt.
- `plans/tickets/ABC-028-history-pane-unreached-input-classes.md` — all five criteria `A1`–`A5`, the
  three `RISK-ABC028-*` subsections, `## Out of scope`, `## Test notes` (item 15 is the `:493` repair
  you are gating).

## Scope — the whole ticket on the merged tip, not a narrow diff

This is the FINAL gate: the ticket is merged and this verdict is the record of what actually shipped.
Gate `A1`–`A5` **as delivered on `main`'s tip**, plus the four blocking gates
(`lint`, `typecheck`, `unit`, `build`) and the skip count. Real commands are in `AGENTS.md`.

**The specific thing the Engineer claims and nobody has independently gated:** the false census at
`src/history-pane.test.ts:493` (*"zero catchers anywhere in the project"*) was **replaced by a
MECHANISM, not by a fresher census** — the new sentence is asserted to be a **DEDUCTION**, so
*"nothing anyone commits can falsify it."* The stale `732/732` was **deleted, not refreshed**. You are
the role that found the original falsehood with a mutant. **Test the replacement the same way you
broke the original.** If the deduction claim is false, say so — the ticket is merged, so a defect here
becomes a new ticket, never a silent edit.

## Constraints — this tree is SHARED with a concurrent hop, and one of them is you

A Security/NFR hop is running **in parallel in this same working tree**. Therefore:

- **Do NOT mutate `src/` in this tree.** For any mutant/wrong-build work, make your own scratch
  worktree (`git worktree add ../cli-chess-abc028-regate <sha>`), do the builds there, and
  `git worktree remove` it when done. The project has done exactly this on prior hops.
- **Do NOT `git commit`, and do NOT run `git checkout`/`git stash` in this tree.** The Orchestrator
  commits both hops. Write your files and stop.
- **Write ONLY under `.grugops/context/quality-gate-ABC-028-regate/`** and your queue transitions.
  Do **not** edit `plans/board.md`, `plans/traceability.md`, or the ticket file — the Orchestrator
  owns those this hop, and duplicated rows from concurrent edits are already an open defect on this
  board.

## Claim + publish (Workflows 17 and 16)

Claim this subtask per Workflow 17 (`.grugops/queue/pending/` → `claimed/<task>/` → `done/`; this
project has no `scripts/claim.js`, so do the directory create + moves by hand and write the
`claim.md` registry record yourself). Publish typed notes into `ref:` following the exact on-disk
convention of the neighbouring folders (`<UTC>-qe-e2e-<kind>-<slug>-<hash>.md`).

**Note kinds honestly.** A `finding` needs a real `§14-gate#<id>` stamp from a live green gate verdict
you actually ran; anything else is a `claim` / `observation` carrying `confidence: UNKNOWN - verify`.
This ticket's record has caught **five** false statements inside published prose. Do not add a sixth.

## Done condition

A verdict on the merged tip with every number re-measured on that tip (never inherited from your 755
run), the `:493` mechanism attacked rather than read, gaps named with owners, and the subtask moved to
`done/`. **A gap found now does not re-open a merged ticket** — name it and let the Orchestrator route
it.
