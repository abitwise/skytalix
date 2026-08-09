---
task: ticket-to-pr-ABC-022
subtask: engineer-abc022-site7
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-022/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T21:22:43Z
branch: grugops/ticket-to-pr-ABC-022
---

# Subtask: site 7 — the boundary is LIFTED, apply it and close `A11`

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Thirty notes, eight of them your own from the hop that raised this.

## The escalation is answered: the boundary was wrong, not `A11`

You applied four of `A11`'s five sites and stopped, because the `dev2` brief fenced
`src/moves.enpassant.test.ts` while `A11`'s enumeration required it. **That contradiction was the
Orchestrator's error in writing the brief — it fenced a file it had also told you to fix.** You were
right to escalate rather than absorb it, widen the diff, or amend `A11`.

**The ruling: fix site 7. `A11` is NOT reduced and BA/PM is not asked to overrule anything.** The
"drop site 7" exit is rejected — the header sits in a file **this ticket created**, so shipping it
would leave a brand-new file making a false present-tense claim about current behaviour, which is the
exact defect class `ABC-022` exists to remove. Dropping it would also cost a BA/PM hop to amend `A11`
for the worse of the two outcomes.

## What site 7 needs, and the trap in it

`src/moves.enpassant.test.ts` **4-9** and **27-28** describe the defect in the **present tense** —
*"the generator offers a capture onto the mover's own piece"*, *"a board the generator provably
corrupts"*. Both are false as of your own fix.

**Do not delete the description.** It is the file's rationale and it is why the tables below it are
shaped the way they are. **Make the tense honest** — that is what the generator *did*, which is what
these tests exist to pin — and keep the reader able to tell that the behaviour is now guarded. Hold
it to the same standard you held site 3: delete nothing true, and do not swing into the opposite
error by implying the tests are now redundant.

## Boundaries

- **`src/moves.enpassant.test.ts` comment text ONLY.** Nothing else under `src/`, and not one
  executable line — the 58 tests, every FEN and every count stay exactly as they are.
- **`src/moves.ts` must still hash `6335b452fc21ffe2d0f902ecab930840`.** `src/legal.ts` and
  `src/legal.test.ts` are settled from `dev2` — do not revisit them.
- **Do not edit `## Acceptance`.** `A11` stands as written.
- Verify `A9` on the **line-level comment filter** you established in `dev2` — changed lines all
  comment markers, comment-stripped content `cmp`-identical to the pre-hop file, suite green.

## Do not re-pin `A11`'s line numbers

Your `dev2` note records that every `A11` citation below your edits shifted, and this hop will shift
them again. **Re-pinning is deliberately not ordered** — it would be stale the moment it landed, and
`A11`'s quoted sentences are the stable key. The Orchestrator will tell QE to match on the quoted
sentences and not on the numbers. Extend your existing citation map with this hop's shifts and leave
it at that.

## Gate

Full suite green with **skip count 0**, lint / typecheck / build exit 0. Baseline: **439/439 on 17
files, skip 0**. `PERFT_DEEP` is **not** required of a comment-only hop — say so structurally and
report no number you did not take.

Say plainly in your hand-back whether **`A11` is now fully discharged** across all five sites, since
that is the question this hop exists to answer.

Publish typed notes per Workflow 16 in the exact shape of `agent-factory/contracts/context-note.md`.
**`finding` is NOT admissible.** Nothing self-stamped, no `index.*` faked. Claim by hand. Take your
own `at` from `date -u`; **this machine is UTC+3**. Commit on the branch above; **never commit
directly on `main`**. No board move, do not enqueue QE, never merge, never deploy.
