---
task: gate-abc041-2026-08-13
subtask: quality-gate-ABC-041
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ref: .grugops/context/quality-gate-ABC-041/
parent_ref: .grugops/context/ticket-to-pr-ABC-041/
ticket: plans/tickets/ABC-041-render-seam-closure.md
enqueued_by: orchestrator
enqueued_at: 2026-08-13T21:35:00Z
branch: grugops/quality-gate-ABC-041
worktree: ../cli-chess-qe041
base: grugops/ticket-to-pr-ABC-041 @ ac17fe2
---

# Subtask: attack `ABC-041` — and above all attack the criterion the Engineer REWROTE

Read `parent_ref:` first — **eight notes**: three from the Orchestrator's entry review, five from the
Engineer. Nothing in them is repeated here.

## Baseline — measured by the Orchestrator on the tip, 2026-08-13. Check me.

- You are on `grugops/quality-gate-ABC-041` in `../cli-chess-qe041`, branched **from the ticket
  branch** `grugops/ticket-to-pr-ABC-041` at `ac17fe2` — not from `main`. `node_modules` is already
  symlinked; **remove the symlink before you finish.**
- **True scope under `src/` against `main`: THREE files** — `src/render-seam.ts` (+62, new),
  `src/render-seam.test.ts` (+304, new), `src/history-pane.nfr.test.ts` (**+1/−0**). I verified the
  five named modules (`frame.ts`, `render.ts`, `status-panel.ts`, `history-pane.ts`, `turn-loop.ts`)
  have an **empty diff**. Verify that yourself.
- Gates re-run **by me** on the tip: lint **0** (51 files, 2 pre-existing infos), typecheck **0**,
  build **0**, `npm test` **824/824 on 29 files**, skip **0**, test-integrity `No findings.` exit **0**.
  Baseline before the branch was **816/816 on 28**.

## The one thing this gate exists for

**`A4` was NOT delivered as written.** The Engineer reports the criterion is unsatisfiable by any
build and asserted something it calls *strictly stronger* instead. I independently confirmed the
mechanism — `src/frame.ts:204` pads every row with `padEnd(width)` — so the premise is real.

**The premise being real does not make the substitute sound.** That is yours to adjudicate, and it is
the highest-value thing on this hop:

- Is the delivered assertion **actually** stronger than the literal wording, or merely different?
  Name a build that the literal `A4` kills and the substitute lets through. If none exists, say so —
  that is the finding.
- The substitute reads the frame width **off the frame**. Prove that is not circular: a build where
  the seam and the assertion draw their width from the same wrong place would pass both.
- `A4`'s stated purpose is *"byte-equality against the merged renderer is what forbids a second board
  implementation."* Does the substitute still forbid it? Build the second-implementation mutant and
  find out.

## Also yours

- **The Engineer's five mutants are its own homework, not your evidence.** Rebuild them or better
  ones on an md5-pinned tree, and build the ones it did not: a re-deriving seam that returns an
  *equal* `GameStatus` (`A2` rests on reference identity), an orientation hardcode, a second board
  implementation, a runtime `history.ts` import (`A7`), and a module added to `LICENSED_DRIVERS`
  instead of `FRAME_PRODUCERS` (gap 1 in the entry review — the Engineer claims `A9` now catches this
  mechanically; verify it, do not accept it).
- `A3`'s ten cases and `A6`'s textual assertions run over the module source. Check they cannot be
  satisfied by a build that moves the offending text out of the file.
- The claimed **8** new tests and **+1 file** against a lane allotment of **1**. The Engineer recorded
  its own lane cost at `confidence: medium` and said the instrument cannot resolve one file. You do
  not need to re-measure the instrument; you do need to confirm the **file count**.

## Hard limits

- Commit on `grugops/quality-gate-ABC-041`. **Never on `main`, never on the ticket branch.**
- Record under `ref:` as `claim` / `observation` / `decision` / `artifact-ref`. **No `finding` is
  admissible on this install** — no `§14-gate#<id>` stamp exists here. Never invent one, and never
  record a `2` or a could-not-run as a pass.
- **Do not merge, do not deploy.** Hand back a verdict with its gaps homed to named roles.
- If you must write a test to kill a surviving mutant, prefer rows in the **existing** file — the lane
  budget is ~10 new files across two epics and this ticket is allotted **1**, already spent.
