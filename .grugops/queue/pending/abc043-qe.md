---
task: quality-gate-ABC-043-qe-2026-08-19
subtask: abc043-qe
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-043-the-live-session.md
ref: .grugops/context/quality-gate-ABC-043-qe-2026-08-19/
parent_ref: .grugops/context/ticket-to-pr-ABC-043-2026-08-19/
enqueued_by: orchestrator
enqueued_at: 2026-08-19T21:05:00Z
branch: grugops/quality-gate-ABC-043-qe-2026-08-19
base: grugops/abc043-the-live-session @ 46457b8
---

# Subtask: QE on `ABC-043` — the first ticket in this repo whose product a human can actually play

`src/cli.ts` (+91/−17) and `src/cli.test.ts` (+704/−54) on `grugops/abc043-the-live-session` @
`46457b8`. **Branch off the DELIVERY BRANCH, not `main`.** Read `parent_ref:` first — the engineer
published a **ten-mutant ledger with diffs**, and my own note recording that **I ran the game by
hand**: `e2e4` → engine replied `Nc6` → `1. e4 Nc6` in the history pane → EOF → exit 0.

## 1. THE RULING QUESTION — this is why you are here, and it is not a defect hunt

**`A3`'s child substitutes `./command-input.ts` — the PARSER — not the engine seam.**

BA/PM licensed the `registerHooks` rig for the **`EngineSeam`**, on the reasoning that a constructed
fault at a seam is a test double by definition. `A3` needs an **`InputSeam` that throws**, and the
delivered reader is **total** — so the engineer reached one layer below it, to the parser, which by
`ABC-037`'s own ruling **catches nothing**.

**The engineer flagged this itself as an EXTENSION of BA/PM's ruling rather than an application of
it, and asked for it to go in front of QE/Architect. It did not smooth it.** That is the correct
call and it is now your first job.

**Rule on the extension, or say plainly it is Architect/Design's.** The arguments you must weigh:
- **For:** it substitutes no module BA/PM's ruling names, adds no production line, no export, no
  flag, no env var; and it exercises exactly the path `ABC-019` `[D31]` ruled — a parser bug reaching
  the top-level handler.
- **Against:** a rig licensed for one seam has been applied to a different one, one layer deeper,
  and *"a fault at a seam is a double"* reads differently when the substituted module is a merged
  production parser rather than an injected dependency.
- **`ADR-0011` clause 4 is untouched and `src/cli.ts` still exports 0** — I verified both.

**If you conclude it needs Architect/Design, say so and stop on that point.** Do not approve a
contract extension to keep a ticket moving.

## 2. The two blind guards it found — verify both repairs, then look for the third

- **`ABC-042`'s row-count transcription guard shipped GREEN with a planted `23` in it.** Its
  template-literal blanking could not match an interpolated literal, so with two of them it **erased
  every line in between**. Measured, repaired, and the same `23` reds now. **This is a merged guard
  that was blind — check whether the repair is complete or whether other assertions in
  `src/cli.test.ts` share the blanking helper.**
- **A hung child had no bound** — and `G6`'s failure mode is precisely a hang. Measured at **501
  bytes written and no exit, ever**. `spawnSync` now carries `timeout: 30_000`, **watched going red
  at a temporary 1 ms.** Confirm the timeout is on every spawn site, not just the one that hung.

## 3. Attack these

- **`A3` is the criterion that decides the ticket**: a build that catches the throw and exits 0 — or
  calls it a draw or an abort — passes everything else and fails only this. Exit **70**, an internal
  error line, **no** `TerminalReason` value and none of `win`/`draw`/`resign`/`checkmate`/
  `stalemate`, and **no result screen**.
- **`G6` — the single-caller precondition.** `M4b` is the true violation (an *unawaited* second
  call). Confirm it reds, and try to find a *third* shape that orphans the read.
- **`A6`** — `beginFrameSession` exactly once, no numeric row-count literal in the diff. Note the
  entry point no longer calls it at all; the loop owns the session.
- **Exit codes**: `outcome.exitCode` **verbatim**, `1` for a refused command line, `70` for an
  exception that never became a `LoopOutcome`. Try to make a wrong code pass.
- **`A7`** both colour directions — either alone is satisfied by a loop that always opens with the
  engine.

## 4. A consequence the engineer had to absorb, worth your eye

`--colour black` now reaches a real engine ply, so `ABC-042`'s `black` and `random` children would
cost **3.09 s of wall each** on the real search (measured). Test note 8 forbids a default-lane row
running the real engine, so both now carry the instant opponent. **That consequence was not in
`N8-SPAWN`'s account.** Say whether the substitution is sound or whether it hollowed out what those
two rows were testing.

## Fences

- You do not fix. You report. Do not weaken a guard.
- **Do not re-open** `ABC-033`, `ABC-035`, `ABC-037`, `ABC-078` — all merged and gated.
- **Do not rule NFR bars.** `ADR-0014` rules `NFR-008` BREACHED at 14.480 s vs 13 s; this ticket
  adds a measured **+0.86 s** and **`N8-LANE` is a rate limit, not a grant**. Report; do not grade.
- Do not merge, do not deploy, do not move a board column.

## Gate

Re-run the full blocking gate yourself. Engineer's figures: **1189 tests / 39 files**, skip 0,
`PERFT_DEEP=1` 32/32, integrity `No findings.`, lint/typecheck/build clean. **Use a contained lane**
— an isolated agent worktree has no `.claude/worktrees/`, so the recorded commands work inside one;
the repo root does not, and that trap has cost me three bad measurements.

**Run the game yourself.** `printf 'e2e4\n' | npm run chess --silent -- --colour white` — a product
nobody has played is a product nobody has tested.

## Publish

Typed notes per Workflow 16 into `ref:`. No `finding` is admissible on this install. Claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of `.grugops/queue/claimed/abc043-qe`.
**Commit incrementally.**

Commit on `grugops/quality-gate-ABC-043-qe-2026-08-19`, never on `main`.
