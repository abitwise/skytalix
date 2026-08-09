---
task: ticket-to-pr-ABC-022
subtask: security-nfr-abc022-gate
role: security-nfr
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-022/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T22:56:30Z
branch: grugops/ticket-to-pr-ABC-022
---

# Subtask: the Security/NFR gate on `ABC-022` — the last gate before `Ready for UAT`

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Forty-nine notes across six hops. The Orchestrator's latest `decision` note carries the QE verdict,
what was verified mechanically, and the open gaps being carried into this gate.

`ABC-022` is in `In Security/NFR` (1/2). **The exit is yours** — `Ready for UAT` on a pass, back down
the board on a fail. Config: `security.asvs_level` **L1**, `security.block_on` **high**,
`compliance_regime` **[]** so no Compliance Officer hand-off is owed.

## What you are gating

Two guard conditions and a local const in `addPawnMoves` (`src/moves.ts`, md5
`6335b452fc21ffe2d0f902ecab930840`), plus comment-only edits to three files and two new test files.
Branch tip: **559/559 on 18 files, skip count 0**, lint/typecheck/build exit 0.

## `NFR-001` is the named trigger, and its METHOD was amended — read that before you measure

The fix sits in `addPawnMoves`' capture loop, which runs for every pawn on every node. **Do not
reach for the clock first.** `plans/nfr-catalog.md` was corrected on 2026-08-09 with its tenth
instrument-limit finding: the perft harness's **per-cell floor is ±2.0%**, so a per-cell ratio bar of
≥ 0.98 sits at roughly **half the instrument's resolution and cannot carry a verdict**. The ticket
adopted the catalog's own resolution — move the question off the clock and onto a **count**:

- **Primary — a count.** How many times the added preconditions are evaluated, and how many times
  they reject. **331 evaluations over the standing 518,474-node walk, 0 rejections** — already derived
  **three times independently** (BA/PM, engineer, QE), including the 216,269 figure for the rejected
  ordering. A fourth derivation is cheap; inheriting it is not the same thing.
- **Floor — clock.** `npm run perft` **≥ 1,000,000 nodes/sec**, roughly 6x clear.
- **Ratio — aggregate only, secondary.** **No per-cell ratio claim is admissible**, and one cell below
  0.98 is not by itself a regression. QE reports the byte-identical null control deviating **more than
  the signal** — if your instrument says the same, say so plainly rather than reporting a number the
  instrument cannot support.

If you measure at all, the catalog's standing method binds: a **`cmp`-verified byte-identical twin**
as a null control, rotated cell and tree order, each timing run in **its own process**, and a
structurally-zero cell read **before** the cell you care about.

## `NFR-005` is excluded structurally — confirm the premise, do not re-run the benchmark

`src/zobrist.ts` is untouched and `src/legal.ts` gained **comment text only**. That is not an
assertion to take on trust: with comments and blank lines stripped, `src/legal.ts` and
`src/legal.test.ts` are **byte-identical to `main`** by `cmp`. Verify that premise yourself if you
wish, then state the exclusion structurally. **Do not re-run the key benchmark to "confirm" a
structural zero** — the catalog's standing caution says why.

## The security classification is the ticket's, and it is yours to CHECK rather than inherit

The ticket claims **no security trigger**: no user-supplied string reaches this module, no sink, no
I/O, no trust boundary in `src/moves.ts`; the consequence is a wrong chess answer and a corrupted
in-memory board — reliability, not security — and it says *"do not inflate it."* The 2026-07-29
architecture audit gave `ABC-009` the same classification. **Test that reasoning against ASVS L1
rather than repeating it**, and note that there is still no CLI entry point, so no user surface
exists at all until `EPIC-006`.

One thing worth your eye: the defect class is reachable **only** through a semantically invalid FEN,
and `ABC-010` (FEN semantic validation) is unbuilt. Whether that is a risk to accept, and who owns
it, is a fair question for this gate.

## Open items to carry, each already owned — do not re-route them

- **The enemy-occupant-on-target axis stays a sample of two piece types.** QE deliberately left it;
  routed to `ABC-023`'s promotion hop. The delivered code is correct on it.
- **`src/moves.castling.test.ts` present-tense sites** — `ABC-009`'s, routed to `ABC-023`.
- **`ADR-0005` 133-138** unowned; **`ABC-023`'s `A4` hash pin** stale by design; **non-piece bytes**
  beyond every in-repo instrument.
- **The test-integrity checker exits 2** with no registry file — **an error, not a pass**. Pre-existing,
  `quality.test_integrity` is `warn`, and the AGENTS.md skip-count command reads 0.

## Boundaries

- **Do not touch `src/`.** If the module must change, that is a FAIL and a move back down the board,
  not an edit by you. Every ticket on this board records that `src/moves.ts` was byte-identical to the
  engineer's first commit through every gate.
- **Do not edit `## Acceptance`** (BA/PM's) and **do not edit `plans/nfr-catalog.md`** — if the catalog
  needs a correction, name it and route it.
- Accepted risks each need a **named owner**. `block_on` is `high`: a HIGH finding blocks.
- You own the `In Security/NFR` exit and its board move. **Do not enqueue anyone** and **do not rule on
  UAT** — the Orchestrator takes the UAT ruling and the merge.

Publish typed notes per Workflow 16 in the exact shape of `agent-factory/contracts/context-note.md`.
**`finding` is NOT admissible** — no §14 gate exists here and `context.human_admission` is `off`.
Nothing self-stamped, no `index.*` faked.

Claim by hand: `scripts/claim.js` does not exist in this install — re-check at the source. Take your
own `at` from `date -u`; **this machine is UTC+3**. Update your own row in `plans/traceability.md`.
Commit on the branch above; **never commit directly on `main`**. Never merge, never deploy.
