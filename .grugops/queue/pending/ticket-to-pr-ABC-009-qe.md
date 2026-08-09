---
task: ticket-to-pr-ABC-009
subtask: qe-abc009-review
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-009/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T11:46:49Z
branch: grugops/ticket-to-pr-ABC-009
---

# Subtask: break `ABC-009` and own the `In Review` exit

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Fourteen notes are there. Note that `20260809T114649Z-orchestrator-decision-700d4a44` **supersedes**
`20260809T141500Z-orchestrator-decision-865b06ae` — read both, and read the superseding note's §1
before you trust any `at` field on this task: **one note carries local time labelled `Z`** and the
replay order is affected. Get your own `at` from `date -u`, never from a test runner's `Start at`
line, which prints local (this machine is UTC+3).

`In Review` is 1/3. The implementation is at `8f540cf` on `grugops/ticket-to-pr-ABC-009`: two guard
conditions in `addCastlingMoves` (`src/moves.ts`, `+30 −8`) plus a new `src/moves.castling.test.ts`
(33 tests). Suite 337/337 on 15 files, skip count 0, deep lane 32/32.

**Your job is to break it, and this ticket has an unusually specific reason to expect you can.**

The one thing the engineer could not close, and handed you openly:

- **A fifth mutant SURVIVES all twelve criteria at 337/337** — colour-blind `pieceType` guards instead
  of full-identity guards. The engineer argued behaviour-equivalence over 9,604 boards with zero
  divergence, because the existing through-check test masks the colour dimension, and proposed **no
  criterion** for it. Decide whether that equivalence argument holds. If it does, say so and say why
  no criterion is owed; if it does not, it is a defect in the criteria and it is yours to name.
- **Five self-written mutants is the weakest certification in this workflow** and the engineer said so
  itself. The calibration is on this board: `ABC-018`'s QE ran **56** and found **six** survivors past
  all twelve corrected criteria that the engineer's own mutants had missed. Five is not a target to
  match, it is a floor to beat.
- **Seven acceptance defects are not proven complete.** BA/PM named two soft spots. One (the
  `option.kingPath` interaction) is now partly measured. **The other — a criterion set written over
  signals that agree — nobody has examined at all.** That is the highest-value unexamined surface on
  this ticket.

Verified before this was enqueued, so you need not re-derive it unless you want to (and re-deriving is
never wrong here): all fifteen `A1`–`A6` counts hold against the delivered diff on a **fourth**
independent derivation, with the five scalars asserted alongside the 128 board bytes; both
over-rejection controls hold (kiwipete 48 moves / 2 castles, `r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1`
26 / 2); no pre-existing test file was modified, checked by diffing every `*.test.ts` on `main`
individually rather than by inspection.

Do **not** re-measure `NFR-001` — Security/NFR owns that and follows you. Read the engineer's
measurement note anyway: its per-cell floor caveat (~±1%, larger than any signal) is the part that
matters, and kiwipete's 0.9930 is **not** a regression.

`ABC-022` half (b) is still live **by design** — this ticket fences it and closes nothing there. Do
not report it as a miss, and do not test it here.

Publish typed notes per Workflow 16. **`finding` is not admissible on this task** — no §14 gate to
issue a `§14-gate#<id>` stamp and `context.human_admission` is `off`. Nothing self-stamped. Do not
hand-fake `index.md` / `index.jsonl`. The claim is by hand: `scripts/claim.js` does not exist in this
install or the kit.

Own the `In Review` exit on `plans/board.md` — that is your board move. Update your own row in
`plans/traceability.md`. Do not enqueue Security/NFR; the Orchestrator does that. Never merge to
`main`, never deploy.
