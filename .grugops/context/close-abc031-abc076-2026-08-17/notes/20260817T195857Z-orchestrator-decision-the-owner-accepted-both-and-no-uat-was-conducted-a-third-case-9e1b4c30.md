---
id: 20260817T195857Z-orchestrator-decision-the-owner-accepted-both-and-no-uat-was-conducted-a-third-case-9e1b4c30
kind: decision
by: orchestrator
at: 2026-08-17T19:58:57Z
verified_by:
confidence: high
refs:
  - memory-bank/60-progress.md
  - AGENTS.md
  - plans/tickets/ABC-031-coordinate-move-input.md
  - plans/tickets/ABC-076-evaluation-material-and-piece-square-tables.md
supersedes:
---

# The owner accepted `ABC-031` and `ABC-076` — and NO UAT WAS CONDUCTED. That is a third case.

**Owner, 2026-08-17, in session, verbatim:**

> *"UAT approved for both, and yes to the QE detector"*

**`ABC-031` and `ABC-076` are accepted and move `Ready for UAT` → `Done`.** His word is this
project's `In UAT` exit signature under the 2026-08-16 standing directive, and he gave it for both.

## The precision this record must carry, because "UAT approved" will be misread otherwise

**NO UAT WAS CONDUCTED ON EITHER TICKET.** No UAT pack was written, no business scenario was
executed, no build was exercised by anyone. He accepted the work on the reports in front of him.
**Recorded plainly so a later reader cannot promote this into something it was not.**

**This does not fit either existing rule cleanly, and pretending it does would be the error:**

| | what it says | fits here? |
|---|---|---|
| **2026-08-16** — the owner's word IS the `In UAT` signature | **WHO SIGNS** a UAT **that is conducted** | **partly** — he signed, but nothing was conducted |
| **2026-08-17** — zero production lines ⇒ UAT waived | **WHICH TICKETS NEED NO SIGNING** | **no** — 103 and 164 production lines; the waiver is unavailable |

**So this is a THIRD case: a signature given where no UAT was conducted, on tickets that did not
qualify for the waiver.** I am recording it as exactly that and NOT as a fourth standing directive —
he ruled on two tickets, not on a class, and the discipline this file has used since 2026-08-06 is to
read a grant no wider than the question answered.

## Why the third case arose, which is the useful part

**Neither ticket is exercisable by a human.** `ABC-031` is a pure parser with no user surface;
`ABC-076` is a scoring function with no user surface. `npm run chess` still only prints a board — no
move can be typed until `ABC-043`. **There were no business scenarios to execute, so a conducted UAT
was not merely skipped: it was not available.**

**This is precisely the situation the owner described earlier in the same session** when he raised
batching UAT into alpha/beta phases: *"do a UAT after most of the game is finished as alpha and beta
test phases."* **Today's two acceptances are that proposal being applied ad hoc, one ticket at a
time, without the rule having been written.** That is not a criticism of the decision — it is the
argument FOR settling the proposal, and it is now load-bearing rather than theoretical: every
`EPIC-003` and `EPIC-004` ticket after these two will hit the same wall.

## What is NOT claimed here

- **No agent self-signed.** The acceptance is his.
- **No stamp exists.** `context.human_admission` is still `off` and no `finding` is admissible, so
  this is a hand-authored transcription in git, the same fidelity as every other acceptance on this
  install.
- **No standing rule was created.** Two tickets, his word, spent.
- **`Done` here means merged, gated, QE'd and accepted by the owner — NOT that any scenario was
  executed against a build.**

## The detector: ruled YES

The second half of his sentence answers the question asked three times today and unanswered until
now. **A ticket is cut for it** (`cut-qe-detector-2026-08-17`, routed to BA/PM) rather than
implemented directly, because the hard parts are decisions and not code: how a ticket maps to its
task folder, whether the detector is retroactive over the five tickets he declined to re-QE, and
**what it can prove at all — presence of a `qe-e2e` note is not proof a QE hop ran, and an agent
could author one to clear its own gate.** That limit is being written INTO the ticket rather than
discovered later, on the precedent `AGENTS.md` already records for `.grugops/test-skips.md`.

## Owed and still unruled after this

1. **Alpha/beta UAT phasing** — now demonstrably load-bearing, per the section above.
2. **Escalation #2** — rule 1's control re-specification. Six tickets of QE gap data now exist
   (9, 10, 6, 4, 5, 2) against a control that cannot consume them.
3. **`N8-LANE` on `ABC-031`** — `UNKNOWN - verify`, never measured, still owed.
4. **`ABC-083`** needs `ABC-082`'s anti-fork clause at its refinement.
