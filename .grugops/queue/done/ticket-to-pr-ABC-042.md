---
task: pull-abc042-2026-08-14
subtask: ticket-to-pr-ABC-042
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-042/
ticket: plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
enqueued_by: orchestrator
enqueued_at: 2026-08-14T19:14:00Z
branch: grugops/ticket-to-pr-ABC-042
base: main @ 5b85d31
---

# Subtask: build `ABC-042` — the entry point, and nothing else

**Read the ticket and `ref:` FIRST.** This ticket was refined by four role hops on 2026-08-14 and
carries **twelve** criteria, two of which replaced criteria that were **deleted as unbuildable**.
Nothing about its content is repeated here — the ticket and the notes are the channel, and a summary
in this file would be a second copy that can go stale.

## The three things this hop must not rediscover the hard way

Named here as POINTERS. **Go read them; do not build from these three lines.**

1. **`A12` licenses exactly one edit to one merged file** — read `A12` on the ticket, and
   `.grugops/context/design-ABC-042-stderr/notes/` (`…-decision-clause4-census-and-licence-…`),
   which holds **the citation text to paste**. Do not invent a citation.
2. **The red that edit answers is EXPECTED** — see `A12`'s parenthetical and test note 6. It was
   measured out of tree by Architect/Design before you started. **It is not a defect to diagnose
   under time pressure, and it is not a signal that your build is wrong.**
3. **`A3`'s flat placement is LOAD-BEARING** — read `A3`. The wrong placement makes the guard go
   green by making your module invisible to it. **Chasing that green is the failure mode this
   criterion exists to catch.**

## The claim, by hand

`scripts/claim.js` is absent on this install (`AGENTS.md` § Role / workflow files). Take the queue
claim by hand: `mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/ticket-to-pr-ABC-042` — that bare `mkdir` is the atomic act. `EEXIST` means
the claim is lost: stop, do not proceed. Then move this file into the claim directory, and to
`done/` when the work is recorded.

## Hard limits on this hop

- Commit on `grugops/ticket-to-pr-ABC-042`, branched from `main` at `5b85d31`. **Never commit on
  `main`.** If `main` has moved, branch from the new tip and **state the commit you took** — check
  first that what moved touches zero bytes under `src/`, as the `ABC-041` hop did.
- **`A12` is a budget, not advice.** Your `git diff --name-only` is the entry point, the resolver,
  their test file(s), `package.json`, `AGENTS.md`, and `src/history-pane.nfr.test.ts` — **nothing
  else**, and all 18 merged production modules byte-identical.
- **`A11` is a recorded reading with its machine, never a suite assertion.** Unrecorded beats faked.
- Record results as `claim` / `observation` / `decision` / `artifact-ref` under `ref:`. **No
  `finding` is admissible on this install** — no `§14-gate#<id>` stamp can be emitted here. Do not
  invent one.
- Run the mandatory gates (`lint`, `typecheck`, `unit`, `build`) plus the test-integrity step on your
  branch tip and record the numbers. `self_fix_attempts` is **2**. `.grugops/test-skips.md` is
  **human-owned** — read it and run against it, never write a row into it.
- **`N8-LANE` ≤ 650 ms CPU**, and the ticket says this is the file most likely in either epic to
  test that bar. **Keep the spawn count in single digits and STATE it.**
- **Do not merge.** Hand back; the Orchestrator sequences the gate and the merge. Never deploy.

## Stop conditions

- A criterion is unsatisfiable as literally worded → **stop and report it**. Do not repair the
  ticket page yourself and do not silently build past it: that exact class was found **three times**
  on this ticket and twice on `ABC-041`, and both times the criterion was **deleted, not
  re-worded**, by the role that owns it.
- `A4`'s 1000 resolutions or any of `A6`(i)/(ii) cannot be made to run with **zero spawns** →
  **stop**. Test note 3 is explicit: the shape is wrong for this ticket, not the criterion.
- The licence guard reds and the fix is **not** the one array element `A12` licenses → **stop**. A
  wider repair to a merged file is not this hop's.
- Anything makes `AGENTS.md`'s `Dev / run` line ambiguous → **stop**. `A1` requires the exact
  command, **having been run**.

## Recording

Typed notes into `ref:` per Workflow 16, **hand-authored**. Claim per Workflow 17. Commit on your
branch.

Report: the terminal result (`READY_FOR_HUMAN_REVIEW`, `BLOCKED_NEEDS_FIX` or `SPLIT_REQUIRED`); the
gate numbers on your branch tip; your spawn count; the `A11` median with its machine; every
criterion MET / NOT MET with its evidence; and every gap with severity and owner.
