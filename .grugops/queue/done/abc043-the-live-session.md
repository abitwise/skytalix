---
task: ticket-to-pr-ABC-043-2026-08-19
subtask: abc043-the-live-session
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-043-the-live-session.md
ref: .grugops/context/ticket-to-pr-ABC-043-2026-08-19/
parent_ref: .grugops/context/refine-ABC-043-2026-08-19/
enqueued_by: orchestrator
enqueued_at: 2026-08-19T18:05:00Z
branch: grugops/abc043-the-live-session
base: main @ fe09bad
---

# Subtask: `ABC-043` — the entry point stops printing a board and starts running a game

**This is the last ticket in the chain.** `ABC-042` gave a board with nothing to type into;
`ABC-037` gave a prompt nothing calls; `ABC-078` gave an engine nothing drives. **You wire them.**

Read the ONE note in `ref:` (my pull waiver) and **all eight notes in `parent_ref:`** before you
open a file. BA/PM's refinement hop resolved the question that was blocking this pull, and it
**measured** its answer rather than asserting it — do not re-derive it.

## The `A5`/`A2` rig — RULED, MEASURED, and not yours to redesign

The flag on this ticket was a misreading, now dissolved: **"through the real entry point rather than
through a stub harness" constrains the DRIVER, not the SEAM.** `A5` asks for *an `EngineSeam` that
throws* — a constructed fault, i.e. a double by definition. What the clause forbids is proving it by
calling a handler in-process, so the exit code and the frame stream belong to a harness instead of
the process.

**The rig BA/PM measured** (Node v24.12.0, verified in a throwaway replica outside the repo):
`node --import <hook>` plus `node:module`'s `registerHooks` substitutes `./engine.ts` in the child.
The fault reaches the entry point's own handler and the child exits with the code the build chose;
**the same child without the hook is byte-unaffected.** The hook rides a `data:text/javascript,…`
URL, so **the rig is a string inside `src/cli.test.ts` and needs zero new files**. A substituted
module's relative imports resolve, so a deterministic double may call the real `legalMoves`.

**`A2`'s deterministic opponent MUST be that double, not the real engine.** `createEngine` deepens
against a wall clock (`src/engine.ts:83,305`), so its move is hardware- and load-dependent —
asserting a scripted mating line against it is **flaky by construction** and costs ~3 s of wall per
ply.

**Two roads are CLOSED and you may not reopen them:**
- **Env/argv-gated fault injection — REFUSED.** It puts a fault path in `src/cli.ts` that a human
  can reach; by `ADR-0013` clause 3's own discriminator that is an **undelivered feature needing the
  owner**, not a test double.
- **Re-scoping `A5` — REFUSED**, by the page's own text.

**`src/cli.ts` still exports 0 and must continue to.** `ADR-0011` clause 4, pinned by `ABC-042`'s
`A2`. The rig exists precisely so that stays true.

## The inherited constraint that will bite silently if you miss it

**`G6`, from `ABC-037`'s QE, now recorded in `## Scope`: `createLineInputSeam` has a SINGLE-CALLER
precondition.** Two overlapping `seam()` calls **orphan the first read forever** — and the failure
mode is **a hang with no output and no exit code**, the worst shape a CLI defect can take.
**Build the input seam once, pass it to `runTurnLoop`, call it nowhere else.** No new criterion:
`A1`'s exactly-once pin and `A8`'s diff read already reach it.

## The criteria that decide this ticket

- **`A3`** — a build that catches the throw and exits 0, or reports it as a draw or an abort,
  **passes every other criterion and fails this one**. It is `ABC-019` `A10` enforced at the top
  level: *a result screen can never present an engine bug as a chess outcome.*
- **`A5`** — the merged `engine-threw` / `engine-failure` arms run for real, exit **0**, and the
  written output contains **no** `EndReason` word.
- **`A4`** — end-of-input is **not** the error path: `INPUT_ENDED_NOTICE` once, no result screen,
  exit **0**, distinguishable from `A3` by message *and* exit code.
- **`A7`** — both colour directions, because either alone is satisfied by a loop that always opens
  with the engine.
- **`A6`** — `beginFrameSession` exactly once, and **no numeric row-count literal** in the diff.

## Fences

- **No new module.** Six wired options, one handler, one exit-code rule. `A8` confines the diff to
  the entry point.
- **`src/turn-loop.ts` byte-identical** — an explicit no-edit on the page.
- **Do not modify** `src/line-input.ts`, `src/engine.ts`, `src/move-input.ts`, `src/command-input.ts`
  — all merged and gated.
- **Do not add a default or placeholder opponent** — `ADR-0013`, and it is moot anyway: a real
  engine exists.
- Do not merge, do not deploy, do not move a board column. Do not edit the DoR table.

## Lane cost — READ THIS, it is the ticket's one open ⚠️

**`N8-LANE`'s 650 ms is NOT grantable** and you must not claim it met. `ABC-108`'s `OQ-1` is open:
the lane medians **13.400 s CPU against `NFR-008`'s 13 s clause**, and Architect/Design is ruling it
in parallel with your hop. BA/PM derived your cost criterion-by-criterion: **7 child processes at a
measured 62.5 ms median wall each ≈ 0.44 s**, file pin **10 → 17**.

**Report your measured cost. Do not quote a percentage of a budget under open question.** Also
noted by BA/PM and worth knowing: `childOf` spawns with **no stdin** today.

## Gate

Full blocking gate in a **contained lane**. An isolated agent worktree has no `.claude/worktrees/`,
so the recorded `npm test` / `npm run lint` work correctly inside one — **and the repo root is
contaminated, which has now cost the Orchestrator three bad measurements.** Baseline on `main`:
**1181 tests / 39 files, skip 0**. Report `PERFT_DEEP=1` 32/32.

**Mutate every guard before you believe it; record the mutant DIFF.** Across the last six tickets
that practice caught a false comment, three dead guards, two immortal mutants, a bypassable
`RISK-002` guard, an off-by-one visible only on a Windows pipe, and a stream channel no spy could
see.

## Publish

Typed notes per Workflow 16 into `ref:`. No `finding` is admissible on this install. Claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/abc043-the-live-session`. **Commit incrementally.**

Commit on `grugops/abc043-the-live-session`, never on `main`.
