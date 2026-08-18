---
task: quality-gate-ABC-035-qe-2026-08-18
subtask: abc035-qe
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-035-in-game-commands.md
ref: .grugops/context/quality-gate-ABC-035-qe-2026-08-18/
parent_ref: .grugops/context/ticket-to-pr-ABC-035-2026-08-18/
enqueued_by: orchestrator
enqueued_at: 2026-08-18T20:00:00Z
branch: grugops/quality-gate-ABC-035-qe-2026-08-18
base: grugops/abc035-in-game-commands @ e01033f
---

# Subtask: QE on `ABC-035` — the engineer already broke it once. Break it again

`src/command-input.ts` (+142) and `src/command-input.test.ts` (+539, 79 tests) on
`grugops/abc035-in-game-commands` @ `e01033f`. **Branch off the DELIVERY BRANCH, not `main`.** Read
`parent_ref:` first — the engineer published **13 mutant diffs**, not descriptions.

## Start where the engineer already found blood

**`M13` survived its first suite**: a build where `board` writes straight to `process.stdout`
bypassed BOTH `A3`'s render-seam count and the empty-messages assertion, because both watch
channels that go *through* the loop. It repaired that with a stream spy asserting 0 writes with a
live control. **I verified the repair myself** with an independently-constructed stdout write — it
reds.

**So the class is proven live in this module. Find the next one.** Other channels that are not the
outcome: `process.stderr`, `console.*`, a thrown value used as a signal, mutation of the passed
`history`, mutation of the `deps` object, a write during a *later* call than the one being spied.
The engineer closed one door; check the rest of the corridor.

## Thin kills the engineer named honestly — decide if they are thin enough to matter

- **`M8` reds exactly 1.** One witness for the "line handed on byte-unmodified" property. One
  witness is a guard with no redundancy.
- **`M1` reds 3, and the engineer says `boards` and `b4` do NOT red under a prefix matcher** — so
  that row guards a different wrong build than the one M1 constructs. Confirm or refute.

## The claim I most want attacked

**`A2`: a command line never reaches a resolver — both resolvers 0 and `legalMoves` 0, with a
control reading 1/1/1.** That control is what makes the zero meaningful. Verify the control is real
and that the zero is not an artifact of the spy being installed on the wrong object — this is
exactly the failure `ABC-033`'s `G3` was (a spy blind to a direct import), one layer out.

## Also check

- **`A6` uses a hoisted `vi.mock` of `./history.ts`** with a control proving the mock sees direct
  calls. Confirm the control; a mock that does not intercept is a zero that means nothing.
- **`A7` headroom is ONE SHORT TOKEN.** The engineer measured `W = 21` at the start position and
  says a seventh item or a longer token overflows. **This is `ABC-107`'s failure mode arriving in a
  second place.** Confirm the measurement and say plainly whether `ABC-036` is walking into it.
- **`SEARCH_DEEP` was not run** — the engineer checked the rule and said it is owed at YOUR hop.
  It is. Run it.
- `N8-LANE` was not measured to its paired-delta method. Say whether it needs to be.

## Fences

- You do not fix. You report. Do not weaken a guard.
- **Do not re-open `ABC-033`** — merged, gated four times.
- Do not merge, do not deploy, do not move a board column.
- **Do not rule NFR bars** — `ABC-078` is in Security/NFR right now and that role owns them.

## Gate

Re-run the full blocking gate yourself. Engineer's figures: **37 files / 1128 tests, 0 failed**,
skip 0, `No findings.`, lint 66 files exit 0, typecheck/build exit 0, `PERFT_DEEP=1` 32/32.
**An isolated agent worktree has no `.claude/worktrees/`, so the RECORDED commands (`npm test`,
`npm run lint`) work correctly inside one** — the engineer used them and so should you; say so.

## Publish

Typed notes per Workflow 16 into `ref:`. No `finding` is admissible on this install — a QE verdict
is a hand-authored `decision` / `observation`. Claim by hand: `mkdir -p .grugops/queue/claimed`,
then a **bare** `mkdir` of `.grugops/queue/claimed/abc035-qe`. **Commit incrementally.**

Commit on `grugops/quality-gate-ABC-035-qe-2026-08-18`, never on `main`.
