---
task: ticket-to-pr-ABC-023
subtask: ticket-to-pr-ABC-023-dev
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-023/
enqueued_by: orchestrator
enqueued_at: 2026-08-10T06:45:04Z
branch: grugops/ticket-to-pr-ABC-023
---

# Subtask: implement `ABC-023` — write the castling precondition net into `src/moves.castling.hardening.test.ts`

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Three notes matter and they are not interchangeable: the opening decision (the `main` baseline, and an
explicit list of what it did NOT check), BA/PM's observation note (34 mutants re-measured — the
verdicts you will rely on), and the pull decision (who runs `A5`'s mutants, and why three columns were
skipped). The ticket itself is
`plans/tickets/ABC-023-castling-precondition-net-hardening.md`, **as corrected 2026-08-10** — six
defects were fixed in it this morning, two of which made criteria unsatisfiable by construction. Read
the corrected text; do not work from memory of the cut version.

`ABC-023` is in `In Development` (1/3). You own the `In Development → In Review` exit.

## This is a TEST-ONLY ticket and that inverts your normal loop

**The expected production diff is ZERO lines.** `A4` pins `src/moves.ts` at
`6335b452fc21ffe2d0f902ecab930840` and requires the diff to
`src/moves.castling.hardening.test.ts` to be **ADDITIONS ONLY**, with no other test file touched at
all. The delivered code is **correct** on all three classes — every one was measured against today's
tree before the ticket was promoted. You are not fixing anything.

So "red before green" cannot mean "the test is red until I write the code". For this ticket it means:

> **a row is red on its mutant and green on the delivered tree.**

A row you never saw red proves nothing, and on this board that is not a theoretical worry — `ABC-009`
retired a criterion (`A7`) as false precisely because the engineer's own record showed its rows green
on the **unfixed** tree. **Run the discriminating mutant for every row you write.** That is your
red-before-green evidence and the pull decision assigns it to you by name. QE will re-run them
independently; your job is not to pre-empt QE, it is to not hand over rows you have never seen fail.

## If a row proves the delivered code WRONG, stop

`## Scope` is explicit: that is a defect, it gets its own ticket, and it is **not** folded in here.
**Say so out loud rather than quietly editing `src/moves.ts` under a hardening ticket.** If that
happens, `A4` fails by design — that is the criterion working, not the criterion being inconvenient.
Do not touch `src/moves.ts` to make a row pass.

## The two traps specific to this ticket

1. **An inert row proves nothing.** A row whose castle is refused by the emptiness test or the
   through-check test, rather than by the guard under test, is decoration. `A1` and `A3` require
   non-inertness to be asserted. `A2` **inverts this deliberately** — its rows require the
   through-check test to be the mechanism, on the **landing** square specifically. Read `## Test
   notes` items 1–3 before writing a single row; they are lessons this board paid for, and
   `expectImpostorSetup` already exists and has already caught two lying labels.
2. **`A5`'s second half constrains what you may write.** Fifteen behaviour-equivalent controls must
   **still survive**, killed count zero, after your rows land. A row that kills one of them pins
   implementation shape instead of behaviour, and it is a defect in your rows even though everything
   is green. All fifteen are enumerated in `A5` — the enumeration was wrong (thirteen listed, fifteen
   required) until this morning, so use the corrected list.

## Boundaries

- **`src/moves.ts` must hash `6335b452fc21ffe2d0f902ecab930840` when you finish.** Check it, do not
  assume it.
- **One file gains rows: `src/moves.castling.hardening.test.ts`.** Additions only. No other file under
  `src/` is touched — not `src/moves.castling.test.ts`, not the en-passant files.
- **Do not reopen `ABC-009`.** Its `A11`/`A13` tables are extended by `A3`; their existing rows,
  counts and verdicts are not edited. `## Out of scope` fences seven regions — read them.
- **Do not enumerate the 169-combination joint pair space.** That is the named trap that turns this
  ticket into an `L`. `A1` is bounded to four rows and is satisfiable at four — BA/PM re-derived that
  this morning at zero extra rows.
- The measured estimate is **~17 rows and ~19 tests**. If you find yourself well past that, **stop and
  say so** rather than shipping a size the board never agreed to.

## Gate

Run the gate per `agent-factory/workflows/05-pr-quality-gate.md` with the commands from the root
`AGENTS.md` — never invented. `mandatory_gates` are lint, typecheck, unit, build; `gate_enforcement`
is `blocking`; `self_fix_attempts` is 2, then stop and hand back. `A4` additionally requires **skip
count 0** and the `PERFT_DEEP=1` deep lane **32/32 exact** — both are numbers, run them.

The pre-ticket baseline, re-measured on `main` at the opening hop, is in the context notes. Do not
re-derive it; do report your own post-rows numbers against it.

## Traps this board has already paid for

- **Print the input, not the verdict.** Every measurement prints the FEN it used and re-parses it.
- **One OS process per tree state** in any mutation run. Node's module cache served a pristine
  `moves.ts` to four tree states in one process on `ABC-009` and produced a false negative.
- **Verify the instrument before believing a red.** Typecheck every mutant — a non-compiling control
  on `ABC-009` produced 147 failures nearly read as "the rows over-fit". A mutant that does not build
  is `BROKEN-BUILD`, never a survivor and never a kill.
- **Design the trap out rather than remembering it** (`## Test notes` item 6). The 11-vs-13 probe trap
  caught two roles on `ABC-009` before it was made structurally impossible.

Publish typed notes per Workflow 16 in the exact shape of `agent-factory/contracts/context-note.md`.
**`finding` is NOT admissible on this task** — there is no §14 gate here to issue a `§14-gate#<id>`
stamp and `context.human_admission` is `off`, so no `human:<name>` stamp exists either. Record results
as `observation` / `decision` / `claim` / `failed-attempt`. Nothing self-stamped; no `index.md` /
`index.jsonl` hand-faked.

Claim by hand: **`scripts/claim.js` does not exist in this install** — there is no `scripts/` directory
in the repository and none in the kit root. Re-check that at the source rather than trusting this file.
The claim is the atomic `mkdir` of `.grugops/queue/claimed/<subtask>/` with a `claim.md` inside it,
then `mv` the subtask file in, and `mv` the whole directory to `done/` when finished.

Take your own `at` from `date -u`; **this machine is UTC+3**, so a local timestamp labelled `Z` is a
three-hour lie. Update your own row in `plans/traceability.md`. Move `ABC-023` `In Development →
In Review` on `plans/board.md` when the gate is green, keeping the ticket frontmatter in sync in the
same commit. Commit on the branch named in the frontmatter above; **never commit directly on `main`**.
Never merge, never deploy.
