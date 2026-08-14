---
task: abc042-fix-2026-08-15
subtask: ticket-to-pr-ABC-042-q1q2fix
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-042-q1q2fix/
parent_ref: .grugops/context/quality-gate-ABC-042/
ticket: plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
enqueued_by: orchestrator
enqueued_at: 2026-08-15T12:10:00Z
branch: grugops/ticket-to-pr-ABC-042-q1q2fix
base: grugops/quality-gate-ABC-042 @ 257d023
---

# Subtask: close `Q1` and `Q2` — two instruments that do not hold the criteria they are named against

**Branch from `grugops/quality-gate-ABC-042` @ `257d023`, NOT from `main`.** That tip carries your own
build, QE's nine notes, and **QE's arming of three rows already written and verified**. `main` is not
an ancestor of it and must not be merged into it.

**Read `parent_ref:` FIRST — nine notes**, especially QE's mutant census and its decision note on what
it armed and what it deliberately did not touch. Then your own `.grugops/context/ticket-to-pr-ABC-042/`
(nine notes, including the Orchestrator's `G1` hold and its correction). Nothing from either is
restated here.

## The block, and what it is NOT

Every gate is green and **all twelve criteria are MET on the delivered build**. Your code is not
wrong. **The block is that two instruments would not notice if it became wrong** — QE built twenty
mutants, five lived, and each survivor ships the whole suite green.

- **`Q1` — HIGH, blocking.** `A6`(i)'s near-miss coverage does not reach `--colour`. QE's diagnosis is
  precise and testable: the criterion says *"rejected in its legal argv position"*, `--colour`'s legal
  position is **two tokens**, and it is tested as one — so it rejects for the wrong reason (missing
  value) and a `startsWith` or case-insensitive weakening survives. **`M18` is the control that proves
  the diagnosis**: the same weakening on `--ascii`, whose legal position genuinely is one token, IS
  killed. **This is the ASVS `V2.2.1` surface that was the original HIGH on this ticket.**
- **`Q2` — HIGH, blocking.** `A9`(2)'s count is a regex over `process.argv`, and `process["argv"]`
  beats it — a second argv read ships green. ASVS **`V2.2.2`**, the exclusive-validator clause.

**Recognise the shape:** this is `ABC-041`'s `A6` defect exactly — a criterion naming a property and an
instrument asserting one spelling of it. That one was closed by asserting all four spellings. **Note
that Security/NFR's own mutant for this surface was KILLED and it recorded that as its prediction
being refuted; QE's bracket-notation mutant reaches past it. Two roles, two mutants, one hole — do not
assume either census was exhaustive.**

## What to do

1. **Take QE's arming, but verify it — do not inherit it.** It is on your base already (`160e300`,
   three rows armed, zero production bytes, 29 → 29 tests, no new spawns). **Rebuild at least
   `M1`/`M2` (the `--colour` survivors) and the `process["argv"]` mutant yourself, watch them RED
   against the armed rows, and revert them.** A fix believed rather than watched is how this ticket got
   here.
2. **Consider whether the arming is complete for `Q2`.** `process["argv"]` is one spelling.
   `ABC-041` needed four. **Say explicitly which spellings you assert and which you do not**, rather
   than leaving the next hop to find the gap.
3. **`Q7` (`A2` letter-vs-purpose) is already armed by QE** — confirm it, and say so.
4. **`Q6` (the spawn pin is self-referential) — your call**, with the reason recorded either way.

## Hard limits on this hop

- **ZERO production bytes.** `src/cli.ts` and `src/cli-options.ts` come out **byte-identical** — verify
  by md5 or blob SHA, not by reading the diff. These are instrument repairs; the build is correct.
- **`A12`'s budget still binds.** Do not touch `src/history-pane.nfr.test.ts` — **`Q3` (the licence
  comparator is weakenable to a subset) is MEDIUM and routed to Architect/Design precisely because
  `A12` bounds that file. It is NOT yours, however tempting.**
- **Do not touch the ticket page** — BA/PM's, and four wording items are queued for it.
- **Do not write `plans/board.md` or `plans/traceability.md`** — mine. Short rows go in your notes.
  *(I am aware this is the third time this ticket that I have forbidden a role its own workflow-assigned
  board move. It is deliberate while the ticket line and `main` are diverged, and the resulting move is
  mine to take, not a gap you must report.)*
- **`N8-LANE` is already breached at 2.00× and escalated to the project owner.** Your lane cost must be
  **≤ 0 by construction** — QE's arming measured inside noise with zero new spawns. **Any repair that
  adds a spawn is the wrong repair**; say so and stop rather than making a live escalation worse.
- Run the mandatory gates plus the test-integrity step on your branch tip and record the numbers.
  `self_fix_attempts` **2**. **Rule on `PERFT_DEEP`** — QE ruled it in scope and ran it green (32/32);
  say whether your diff can reach the rules core and act accordingly.
- **Do not merge, do not push, do not deploy.** The ticket is HELD pending the owner's `G1` answer
  independently of your work.

## Stop conditions

- Closing `Q1` or `Q2` requires a **production** change → **stop and report it.** That would mean the
  build, not the instrument, is defective, and it changes what the gate concluded.
- Closing either requires **editing a criterion** → **stop.** Criteria are BA/PM's, and this ticket has
  already deleted two rather than let an implementer re-word one.
- An armed row cannot be made to red its mutant without adding a spawn → **stop and say so** (see the
  `N8-LANE` limit above).

## Recording

Typed notes into `ref:` per Workflow 16, **hand-authored**. **No `kind: finding`** — no
`§14-gate#<id>` stamp is emittable on this install; do not invent one. Claim per Workflow 17 by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of the task directory.

Report: the terminal result; every mutant you rebuilt, whether it redded, and against which row; the
production byte-identity evidence; which `process` spellings you assert and which you do not; your
lane delta; the `PERFT_DEEP` ruling; and every remaining gap with severity and owner.
