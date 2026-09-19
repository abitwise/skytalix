---
task: cut-050-exclude-and-g06-2026-08-21
subtask: cut-050-exclude-and-g06
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/cut-050-exclude-and-g06-2026-08-21/
enqueued_by: orchestrator
enqueued_at: 2026-08-21T20:00:00Z
branch: grugops/cut-050-exclude-and-g06
base: main @ 565c623
---

# Subtask: cut EXACTLY TWO tickets — the two oldest uncut residuals in this factory

**The project owner authorised these two by name in session (2026-08-21): "cut ABC-050's exclude
residual and G-06". EXACTLY TWO. If you find a third thing, NAME IT AND LEAVE IT UNCUT.**

Both were raised by QE, both were explicitly assigned **"BA/PM to cut"**, and **neither has ever
been seen by a BA/PM hop** — including the one that cut `ABC-116`/`ABC-117` earlier today. They have
been handed forward on the board header alone since 2026-08-20. **Read the primary sources; the
board prose is running commentary, not substance.** The highest existing id is `ABC-117` — **derive
the next ids yourself by listing `plans/tickets/`.**

## Ticket 1 — `ABC-050`'s type-valid `exclude` residual (containment nothing asserts)

**PRIMARY SOURCE (measured, four probes):**
`.grugops/context/qe-ABC-050-2026-08-20/notes/20260820T165000Z-qe-e2e-observation-abc050-i-built-four-wrong-builds-and-two-type-valid-ones-are-invisible-to-all-four-gates-2658eded.md`
Supporting: the same task's `…-b8a942c1.md` verdict; the engineer's honest-limit note in
`.grugops/context/ticket-to-pr-ABC-050-2026-08-20/notes/…-9d3c04f7.md`;
`plans/tickets/ABC-050-lane-runner-config-has-no-guard.md` (its `## Out of scope`, lines 61-74).

The subject: `vitest.config.ts`'s `test.exclude` is a `string[]`, so every glob is type-valid.
`ABC-050` brought the file under `tsc` and Biome — which catch wrong TYPES and wrong KEYS — but
**nothing in this repository asserts what the lane actually COLLECTS.** The instrument QE named is a
lane-inventory assertion (the collected test-file set, or its count, asserted against a recorded
expectation).

**Re-measure at your own hand; every number in those notes is an unstamped claim.** In particular
**one recorded claim is now STALE and you must verify this yourself rather than repeat it**: QE
wrote it is "harmless only because the 37 agent worktrees were deleted". A LIVE in-repo worktree
exists at `.claude/worktrees/residual-gqe115-3` carrying its own `*.test.ts` files, and
`.claude/worktrees/` is git-ignored — invisible to `git status` and to every gate except the exclude
glob. **Measure what is there when you run, and write what you measured, not what I said.**

**A false statement of record you must NOT repeat:** both QE's verdict and the Orchestrator's note
say `ABC-050`'s `## Out of scope` fences the lane-inventory assertion **"by name"**. Read the
section: there is no such bullet. The fence exists in SUBSTANCE (a nearest bullet about control over
config drift), but "by name" is false. **Say so on the page** — this factory has cut two tickets
this week for sentences that sounded true.

**Do NOT conflate the two `ABC-050` residuals.** The second — the vitest sequencer / cached-durations
trap needing `--no-cache` for armed probes — is NOT this ticket and is NOT authorised.

## Ticket 2 — `G-06` (coverage nothing exercises)

**PRIMARY SOURCE (the gap register row that created the id):**
`.grugops/context/quality-gate-ABC-043-qe-2026-08-19/notes/20260819T222000Z-qe-e2e-decision-the-verdict-and-the-seven-gaps-a5b6c7d8.md`
Handed forward, with hand runs, by the SECOND QE hop:
`.grugops/context/qe-ABC-043-review-exit-2026-08-20/notes/20260820T170500Z-qe-e2e-decision-g06-is-confirmed-not-this-tickets-and-i-ran-the-real-engine-anyway-2e60d5b9.md`
Also: `ADR-0015` (line ~194, one line confirming it untouched), `src/cli.test.ts:663-671` (the
exclusion stated in the tree itself), `src/engine.test.ts` (the `ENGINE_DEEP` lane), `ADR-0014` and
`plans/tickets/ABC-108-…md` for the budget it is priced against.

The subject: **no automated test anywhere spawns the delivered CLI composition and lets the REAL
`src/engine.ts` search choose a move.** Children that would cause an engine ply substitute
`./engine.ts` with a double exporting `DEFAULT_BUDGET_MS = 0`; hookless children never reach an
engine turn. The wiring is asserted TEXTUALLY by regex against the source, never exercised. The only
end-to-end evidence in this repository is two hand runs transcribed in context notes — and QE said
of its own transcript: *"That is not a criterion and I am not recording it as one."*

**`ENGINE_DEEP` already exists and does NOT close this** — it drives `chooseMove`/`createEngine`
in-process as a unit; it never spawns the CLI, so it is not the delivered composition. Rule on the
page whether the fix is a new opt-in lane on the `PERFT_DEEP`/`SEARCH_DEEP`/`ENGINE_DEEP` precedent,
and **price it**: a real-engine child was measured at ~3.09 s wall EACH against `NFR-008`'s whole
3 s wall / 13 s CPU lane clause — which is ALREADY BREACHED (`ADR-0014`; `ABC-108` open). A ticket
that ignores that price is not cuttable.

**A NAMING TRAP — do not fall in it.** `G6` (no hyphen) is a DIFFERENT and CLOSED item: an `ABC-037`
gap about overlapping `seam()` calls that became an acceptance criterion on `ABC-043`. Grepping `G6`
returns mostly false positives. `G-06` also collides visually with `G-QE115-1..5`, which are
unrelated and already dispositioned.

## Both, and the ordering between them
They are procedurally twins and substantively different: `G-06` is COVERAGE (fix = a new opt-in
lane, priced against a breached budget); the `exclude` residual is CONTAINMENT (fix = a lane-inventory
assertion, priced at roughly nothing). Closing either does not close the other. **They are ordered,
one way only: whatever lane `G-06`'s fix builds is one more thing a type-valid `exclude` edit could
silently delete with all four gates green.** Say so on both pages, and let it inform the priorities
you argue — do not simply inherit a priority from me or from QE.

## Fences
- **EXACTLY TWO TICKETS. Backlog rows only.** Column moves are the Orchestrator's.
- **Zero files under `src/`. Do not open `vitest.config.ts` for writing.** You are cutting the
  tickets, not building the guard or the lane.
- **Do not delete, move or clean the `.claude/worktrees/` checkout.** Measure it, report it; it is
  the Orchestrator's to remove and removing it would destroy the evidence your own page rests on.
- **Do not move any target, bar, level, floor, account, instrument, statistic, null control or
  `UNKNOWN - verify` marker in `plans/nfr-catalog.md`.** Eight rows `NFR-001`-`NFR-008` byte-identical
  at `sha256 63f66795…ca31` — **verify by hashing.** If ticket 2 implies an edit there, name it owed.
- **Do not re-open** `ABC-050`, `ABC-043`, `ABC-042`, `ABC-108`, `ABC-115`, `ADR-0014`, `ADR-0015`,
  `ADR-0017`, or any QE verdict. Both tickets carry gaps their tickets NEVER OWNED — say that on
  each page so neither reads as a defect of a closed ticket.
- **Do not touch `AGENTS.md`** (`ABC-109` live, byte cap). `ADR-0017` already named one sentence
  owed there; if ticket 2's lane implies another, name it owed and say who owns it.
- Do not merge, do not deploy. Own `git worktree`, commit on `grugops/cut-050-exclude-and-g06`.

## Publish
Two ticket pages under `plans/tickets/`, two Backlog rows, two `plans/traceability.md` rows, and
typed notes per Workflow 16 into `ref:` — hand-authored per `agent-factory/contracts/context-note.md`;
no `finding` is admissible. **State both new ids explicitly in a `decision` note.** Each ticket gets
testable acceptance criteria, a size, a priority WITH its argument, and a DoR score with every ⚠️
named. `AGENTS.md` `## Process rules` 2 puts a 300-line MEDIAN budget on cut tickets — measurements
and rejected alternatives belong in your notes, not on the pages.
Claim by hand per Workflow 17: bare `mkdir .grugops/queue/claimed/cut-050-exclude-and-g06`, move
this file in, then out to `done/`.
