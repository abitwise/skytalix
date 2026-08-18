---
task: quality-gate-ABC-078-qe-2026-08-18
subtask: abc078-qe
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-078-iterative-deepening-and-the-engine-seam.md
ref: .grugops/context/quality-gate-ABC-078-qe-2026-08-18/
parent_ref: .grugops/context/ticket-to-pr-ABC-078-2026-08-18/
enqueued_by: orchestrator
enqueued_at: 2026-08-18T14:30:00Z
branch: grugops/quality-gate-ABC-078-qe-2026-08-18
base: grugops/abc078-iterative-deepening-engine-seam @ 4d4f818
---

# Subtask: QE on `ABC-078` — break the clock

`src/engine.ts` (278) and `src/engine.test.ts` (558) are on
`grugops/abc078-iterative-deepening-engine-seam` @ `4d4f818`. **Branch off the DELIVERY BRANCH, not
`main`.** Read all five notes in `parent_ref:` first.

## Start with the criterion the engineer says it did NOT meet

**`A1` is NOT literally met, and the engineer said so rather than smoothing it.** Worst case
**3027 ms**; **29/30 calls over the 3 s clause by ≤ 27 ms** (0.9%); **0/30 over the 5 s ceiling**.
It attributes the overshoot to the 1024-node abort granularity, not to a whole iteration, and it
**refused to add a safety margin to make the sentence true**. That refusal was correct — a margin
chosen to satisfy a sentence is exactly the fabrication this project's gates exist to catch.

**Your job is to check the ATTRIBUTION, not to re-run the number.** Specifically:

- Is the overshoot really the check granularity? Vary `NODES_PER_CLOCK_CHECK` and see whether the
  overshoot scales with it. If it does not, the diagnosis is wrong and the real cause is open.
- Is the overshoot **bounded**? An overshoot of ≤ 27 ms on this hardware says nothing about a
  slower machine, where 1024 nodes take longer. **Is there a position or budget where it exceeds
  5 s?** That is the ceiling clause and it is the one that must never break. Hunt for it.
- Does iteration 1 being **unabortable** (`nextCheck` starts at `Infinity`) create an unbounded
  worst case in a position where depth 1 is expensive? That is the design's deliberate trade and
  the place a 5 s breach would come from.

## The rest of the criteria — mutate, do not read

- **`A2`** — the node-count bound (3120 against ≤ 10×1024) is the guard that a between-iterations
  build lands two orders of magnitude above. Confirm it reds for such a build.
- **`A3`** — the fixture is `position-6`, whose best move changes between depth 2 and 3. Confirm a
  build that keeps the aborted iteration's best move reds.
- **`A4`** — the no-depth guard. Try to slip a depth default past it.
- **`A6`** — `src/turn-loop.ts` byte-identical. Re-verify by blob hash yourself, not by eye.
- **`A7`** — 209 positions at a spent budget. Try to find a null, a throw, or an illegal move.

## The duplication you must have an opinion on

`src/engine.ts` carries **its own alpha-beta negamax (~55 lines duplicating `src/search.ts`)**. The
engineer's reason: `ABC-077`'s merged `A6` (`src/search.test.ts:433-465`) pins `src/search.ts` to
three exports, `search.length === 2`, and **no** `Date.now|performance.now|hrtime|setTimeout`, so
every way of making `search()` abortable breaks a merged guard. The two copies are held together
only by `A3` asserting the completed iteration returns exactly `search(position, depth).move`.

**Say whether that is sufficient.** Two implementations of the same algorithm that can drift
silently is a real maintenance defect; a merged guard that forces the duplication is a real
constraint. If the coupling test is too thin, say what would make it bite.

## Fences

- **You do not fix.** You report. **Do not weaken `ABC-077`'s merged `A6` guards** to make the
  duplication go away — that is a merged contract.
- **Do not rule `NFR-004`, `NFR-005` or `N8-LANE`.** Those bars are Security/NFR's and this ticket
  goes there after you. Measure and report; do not adjudicate.
- Do not merge, do not deploy, do not move a board column.

## Gate

Re-run the full blocking gate on the delivery branch tip yourself. Engineer's figures: 1016 tests /
36 files, skip 0, `No findings.`, typecheck/build/lint exit 0, `ENGINE_DEEP=1` 23 passed,
`PERFT_DEEP=1` 32/32, `SEARCH_DEEP=1` 41/41.

**Known repo defect — do not chase it, but DO report your lane.** `npm test` and `npm run lint` at
the repo root are contaminated by sibling worktrees under `.claude/worktrees/` (`ABC-050`, already
routed). The engineer substituted
`npx vitest run --exclude '**/node_modules/**' --exclude '.claude/**'` and
`npx biome check src tools spike vitest.config.ts`. Use a contained lane and say which.

## Publish

Typed notes per Workflow 16 into `ref:`. **No `finding` is admissible on this install** — a QE
verdict is a hand-authored `decision` / `observation`. Claim by hand: `mkdir -p
.grugops/queue/claimed`, then a **bare** `mkdir` of `.grugops/queue/claimed/abc078-qe`.

Commit on `grugops/quality-gate-ABC-078-qe-2026-08-18`, never on `main`.
