---
task: quality-gate-ABC-033-qe-2026-08-18
subtask: abc033-qe
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-033-one-prompt-both-formats-and-the-ambiguity-outcome.md
ref: .grugops/context/quality-gate-ABC-033-qe-2026-08-18/
parent_ref: .grugops/context/ticket-to-pr-ABC-033-2026-08-18/
enqueued_by: orchestrator
enqueued_at: 2026-08-18T13:10:00Z
branch: grugops/quality-gate-ABC-033-qe-2026-08-18
base: grugops/abc033-one-prompt-both-formats @ 64b596c
---

# Subtask: QE on `ABC-033` — break `resolveMoveInput`

Under the owner's 2026-08-17 standing directive, **every ticket passes through QE**. This one has
not. `src/move-input.ts` (+182) and `src/move-input.test.ts` (+374, 40 tests) are on
`grugops/abc033-one-prompt-both-formats` @ `64b596c`.

**Branch off the DELIVERY BRANCH, not `main`.** Read all five notes in `parent_ref:` first — the
engineer published its own limits there, and two of them are where I want you to start.

## Two self-reported limits. Confirm or break each — do not take them on trust

1. **`A4`'s evidence is BOUNDED and the engineer said so.** It exercised six ambiguity shapes
   through `assembleFrame` (two knights, folded `BXC4`, `e7e8` and `e7d8` promotions, plus
   adversarial five-knight and six-queen lists) and found hidden count 0 in every one. **That is a
   worst case searched for and not found — it is NOT a proof over all legal positions.** Try to
   produce a reachable `ambiguous` outcome whose candidate list does NOT fit the 2-row message
   region. If you find one, that is a **finding for `EPIC-002`'s frame owner and a new ticket** —
   NOT a truncation and NOT a frame widening, which would break `EPIC-003` acceptance `4a`.
2. **SAN `e8=q` (lowercase promotion letter) is not reached by any fold variant.** The engineer
   ruled that uppercasing it requires knowing `=` introduces a promotion — token knowledge the
   fences forbid — and noted the coordinate form `e7e8q` covers the case. **Decide whether that is
   a defect or a correct fence.** No criterion on the page names the SAN spelling; say plainly
   whether a player would hit it.

## Where the ticket's own defects would hide — mutate, do not read

The engineer ran three mutants (fold-first → 6 red; lowercase-the-exact-attempt → 5 red;
try-all-variants-take-first → 2 red). **Re-run those independently and add your own.** Aim at:

- **`A5`'s count.** Make `legalMoves` be called twice and confirm the suite reds. A count guard
  that does not red is not a guard.
- **The union.** The build unions named moves into a `Set` before deciding one-vs-many. Break the
  union into a first-match and see how many criteria notice. "Never guess" is supposed to be
  **structural** here — test that claim.
- **The reason-code precedence** (`no-such-move` outranks `unreadable`). Is it asserted, or
  incidental?
- **`A2`'s two halves.** They are in separate `it` blocks by design. Confirm that a build which
  lists candidates and then applies one reds the second block.
- **Reference identity in `A1`** (`toBe` against the one `legal` array element). Swap it for a
  structural clone and confirm it reds.

## Fences

- **You do not fix.** You report. Defects go back to the engineer or become new tickets.
- **Do not weaken a guard to make it pass.** If a guard is wrong, say it is wrong.
- **Do not merge, do not deploy.** I hold both.
- **Do not move a board column.**

## Gate

Re-run the full blocking gate on the delivery branch tip yourself; do not quote the engineer's
numbers. Its reported lane: 36 files / 1039 tests, skip 0, `No findings.`, lint/typecheck/build
exit 0, `PERFT_DEEP=1` 32/32.

**Known repo defect, do not chase it:** from the repo root `npm test` reports ~246 files and `npm
run lint` exits non-zero, because `vitest.config.ts` has no `exclude` and sibling worktrees are
swept in. That is `ABC-050`, already routed. Run in a contained lane and say which lane you used.

## Publish

Typed notes per Workflow 16 into `ref:`. **No `finding` is admissible on this install** — a QE
verdict is recorded as hand-authored `decision` / `observation` per the owner's directive limit 3.
Claim by hand: `mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/abc033-qe`. Then move this file into it.

Commit on `grugops/quality-gate-ABC-033-qe-2026-08-18`, never on `main`.
