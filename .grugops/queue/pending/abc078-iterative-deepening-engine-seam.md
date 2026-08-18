---
task: ticket-to-pr-ABC-078-2026-08-18
subtask: abc078-iterative-deepening-engine-seam
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-078-iterative-deepening-and-the-engine-seam.md
ref: .grugops/context/ticket-to-pr-ABC-078-2026-08-18/
parent_ref: .grugops/context/wave-p0-chain-2026-08-18/
enqueued_by: orchestrator
enqueued_at: 2026-08-18T12:05:00Z
branch: grugops/abc078-iterative-deepening-engine-seam
base: main @ 16e9269
---

# Subtask: `ABC-078` — iterative deepening against a wall clock, and `EngineSeam` satisfied

Read `ticket:` for the work. Read **both** notes in `parent_ref:` before you open a file — they are
my `Ready for Dev` exit review and they carry **first-hand measurements at HEAD `16e9269`**. Take
them as given; do not re-derive them.

## What the parent notes already settled

1. **Every anchor this ticket cites is EXACT at HEAD.** `EngineSeam` `src/turn-loop.ts:138`,
   `search()` `src/search.ts:167`, `SearchResult` `:42`, `searchWithoutPruning` `:178`,
   `MATE_SCORE` `:40`. Do not spend a hop re-checking them.
2. **The one open ⚠️ on the DoR is routed, not yours.** The `EPIC-004`/`EPIC-005` composition point
   went to Architect/Design in this same wave (`design-p0-chain-rulings-2026-08-18`). **Do not
   design for it, do not leave a hook for it, and do not widen the seam in anticipation.** Build
   against `EngineSeam` exactly as merged. `A6` is the guard on that and it is not negotiable.
3. **`src/cli.test.ts` no longer hard-codes a production-module count** (`ABC-103`, closed today).
   Your new module should not red it. If it does, that is a finding — report it, do not edit a count.

## The criterion that decides this ticket

**`A2`.** A clock checked only *between* iterations produces an engine that passes `A1`, `A3`, `A5`
and `A7` and blows the budget on exactly the position where the budget matters. Check the clock
**inside the recursion**. The ticket's own test note 1 says this; I am repeating it because it is
the single defect this ticket exists to avoid.

**`A3` second.** The best move of an *aborted* iteration is a systematically biased sample of the
move list — it is worse than not having searched that depth at all. Discard it. Keep a best-so-far
register that is only written on a **completed** iteration.

## Fences

- **`src/turn-loop.ts` is byte-identical.** `A6`. This is a hard fence, not a preference.
- **No depth argument, no depth default, no depth constant driving a per-move decision.** `A4`, and
  it is `RISK-002` — the inherited non-negotiable. `plans/nfr-catalog.md` carries the paragraph.
- **Inject the clock.** Ticket test note 2, and it is requested rather than optional: it is what
  makes `A3` and `A5` deterministic and fast instead of slow and flaky.
- **No aspiration windows, no null-move pruning, no late-move reductions, no threading.** Coding
  rule 5. Not requested.
- **Difficulty selection is not yours** — the budget arrives as a parameter. `EPIC-006` owns the
  choosing; `ABC-087` owns the level mechanism.
- **No wall-clock assertion in the default suite.** `plans/nfr-catalog.md`'s standing rule, and
  `N8-LANE` is ≤ 650 ms CPU — a 3 s budget cannot live in a 650 ms lane. Suite guards use
  **millisecond** budgets (`A2`, `A5`, `A7`); `A1`'s 30-position 3 s run is **opt-in**, and you
  report its worst case **with the machine it ran on**.

## The honesty bar on `A1`

`A1`'s number is true of the machine that ran it and of nothing else. Say so in the note. The
off-machine generalisation is `ABC-074`'s, it is `Blocked` for want of a non-M3 machine, and
`NFR-005`'s depth-7 level stays **PROVISIONAL**. Report `NFR-005`'s depth-in-budget on `kiwipete`
and `position-6` as a **measurement**; do not rule the level.

## Gate

`quality.gate_enforcement` is `blocking`. On the branch tip: `npm test`, `npm run lint`,
`npm run typecheck`, `npm run build`, and
`node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count <N>` with `<N>` from
the reporter. Record the real numbers. Run `PERFT_DEEP=1` and report `32/32`.
**Do not merge** — the Orchestrator holds the merge and re-runs the gate on `main` after.

## Publish

Typed notes per Workflow 16 into `ref:`. **No `finding` is admissible on this install** — see
`AGENTS.md` § "Role / workflow files". Use `claim` / `observation` / `decision` / `artifact-ref`,
hand-authored per `agent-factory/contracts/context-note.md`. Take the claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/abc078-iterative-deepening-engine-seam` — that bare `mkdir` is the atomic
act. Then move this file into it.

Commit on `grugops/abc078-iterative-deepening-engine-seam`, never on `main`.
