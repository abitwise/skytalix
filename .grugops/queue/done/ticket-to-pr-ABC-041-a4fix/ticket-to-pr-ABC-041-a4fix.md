---
task: gate-abc041-2026-08-13
subtask: ticket-to-pr-ABC-041-a4fix
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-041-a4fix/
parent_ref: .grugops/context/refinement-ABC-041-a4/
also_read: .grugops/context/quality-gate-ABC-041/, .grugops/context/ticket-to-pr-ABC-041/
ticket: plans/tickets/ABC-041-render-seam-closure.md
enqueued_by: orchestrator
enqueued_at: 2026-08-13T22:30:00Z
branch: grugops/ticket-to-pr-ABC-041-a4fix
worktree: ../cli-chess-dev041b
base: grugops/refinement-ABC-041-a4 @ 8dbe2b4
---

# Subtask: `A4` has been repaired. Make its INSTRUMENT match it — and correct your own record.

**Your module is correct and stays byte-identical.** This is a test-file-and-notes hop. `A4` was
rejected by the gate and rewritten by BA/PM; the criterion now names a mechanism your delivered
assertion does not use.

Read `parent_ref:` (BA/PM, 6 notes — the ruling) and `also_read:` (QE's 5, and your own 5) before you
touch anything. **The ticket is the authority, not this file** — read the repaired `A4` and the new
`A11` off the page.

## Two things, and only two

**1. The circular width.** `src/render-seam.test.ts:226` reads `const width = (frame[0] as
string).length`. `frame[0]` **is** a board row, so the seam and the assertion take the number from the
same place — QE's padding mutant walks through it once the adjacent whole-frame check is removed. The
repaired `A4` names what the width must be derived from instead. Derive it that way. **Prove the fix
by building QE's padding mutant yourself and watching the new assertion red on it — then revert the
mutant and verify the module byte-restored.** A fix you did not see fail is not a fix.

**2. Supersede your own claim.** Your note characterising the substitute as *"strictly stronger"* is
refuted, and BA/PM has ruled: **the set relation is backwards — `A4` as written rejected every build,
so nothing could be stronger than it.** Your *premise* survives and is load-bearing; only the
*characterisation* falls. Notes are append-only: **write a new note whose `supersedes:` names that
note's id. Do not edit or delete it.** The superseded note stays as the audit trail — the record must
show the correction, not hide that it was needed.

## Also check — `A11` is new and may have no instrument yet

BA/PM added `A11` (the merged four are each **called exactly once** — a call count, not a comparison).
Check whether the delivered suite already asserts it. If it does not, add it as a row in the
**existing** file. The lane allotment of **1** new test file is spent; **do not add a second file.**

## Hard limits

- You are in `../cli-chess-dev041b` on `grugops/ticket-to-pr-ABC-041-a4fix`, off BA/PM's tip
  `8dbe2b4`. `node_modules` is symlinked; **remove the symlink before you finish.** Commit on that
  branch only — **never `main`, never any other agent's branch.**
- **`src/render-seam.ts` must come out byte-identical.** Verify with `git diff --numstat` against
  your base and say so in a note. If you believe the module must change, **STOP** — that is a scope
  change on gated work and it is mine to sequence.
- **Do not touch the ticket page.** BA/PM owns it and it is at its 300-line budget.
- Run every mandatory gate plus test-integrity and record the numbers. Baseline on your base is
  **828/828 on 29 files**, skip 0, and `npx vitest run src/render-seam.test.ts` is **12 passed**.
- Record under `ref:` as `claim` / `observation` / `decision` / `artifact-ref`. **No `finding` is
  admissible on this install**; never invent a `§14-gate#<id>` stamp.
- **Do not merge, do not deploy.** QE re-gates after you, narrowly, and clears its own block.
