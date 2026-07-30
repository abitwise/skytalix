---
id: 20260730T103350Z-architect-design-decision-f9ef2d01
kind: decision
by: architect-design
at: 2026-07-30T10:33:50Z
verified_by: 
confidence: medium-high
refs:
  - architecture-audit-2026-07-29
  - ADR-0003
  - ADR-0002
  - ADR-0001
  - ABC-008
  - ABC-009
  - EPIC-004
  - NFR-001
  - NFR-003
  - NFR-004
  - NFR-005
  - RISK-002
  - memory-bank/50-decisions/ADR-0003-legality-strategy.md
  - memory-bank/50-decisions/ADR-0002-game-history-ownership.md
  - plans/nfr-catalog.md
  - src/legal.ts
  - src/moves.ts
  - src/apply.ts
  - src/zobrist.ts
  - 20260729T145433Z-architect-design-observation-43d9a3cc
  - 20260729T145735Z-security-nfr-observation-abedec95
  - 20260729T151154Z-architect-design-decision-7805ef24
  - 20260729T200039Z-architect-design-decision-bd553d62
supersedes: 
---

# ADR-0003 authored as a PROPOSAL — legality strategy (make/test/unmake)

Subtask `adr-0003-legality-strategy` of task `architecture-audit-2026-07-29`. One artifact written:
`memory-bank/50-decisions/ADR-0003-legality-strategy.md`, `status: proposed`, with an unsigned
ratification line. **Nothing was accepted and no decision was taken** — the ADR presents a
recommendation with its evidence for a named human to ratify, amend, or reject.

## Provenance and admissibility (read this first)

**This repo has no `scripts/context-io.ts`** — there is no `scripts/` directory at all. The
sanctioned SCTX-01 writer is absent, so this note was **hand-written directly against the schema**
in `agent-factory/contracts/context-note.md` and against the shape of the seven existing notes in
this folder. **No validator ran, no admission check ran, no atomic claim was taken**, and
`index.md` / `index.jsonl` were not regenerated. I claim no enforcement I do not have.

`verified_by:` is deliberately **empty** and **no `finding` is recorded** — not even for the numbers
I measured myself. There is no live §14-gate verdict for this task, so a `finding` would be
inadmissible under SCTX-01. I did not self-stamp. This is the posture all seven prior notes took.

I read all seven prior notes in this folder before acting, plus `ADR-0002` from disk (it is a repo
file, not a message). Nothing was relayed to me. A prior attempt at this subtask died mid-analysis
and published nothing; I re-derived every number rather than building on anything unpublished.

## The recommendation, in one paragraph

**Keep make/test/unmake. Change the target, not the code.** `src/legal.ts` is not touched.
`NFR-005`'s `>= 500,000 nodes/sec` was derived from the ABC-008 spike — a benchmark with no legality
filtering — and is not testable as written, because the same merged code measures **207k to 6.1M
nodes/sec depending only on what you call a node**. The requirement underneath is `NFR-004`
(≤ 3 s, hard ceiling 5 s), and iterative deepening — already non-negotiable under `RISK-002` — makes
that budget unbreakable at any node rate: the rate buys **depth**, not latency. Measured, today's
design reaches **depth 7 in 0.39-0.68 s and depth 8 inside the 5 s ceiling**. So `NFR-005` should be
re-derived as a depth-in-budget target (depth ≥ 6 within 3 s), with the nodes/sec figure demoted to
a diagnostic that always carries its node definition, position and machine. The ADR also records a
**named trigger and an ordered menu** for `EPIC-004` if the depth floor is ever missed — cheapest
and safest first — and authorizes none of it.

**Confidence: medium-high.** High on the code measurements; medium on the re-derived target, whose
inputs (effective branching factor 6, quiescence factor 2.5, "depth 6-7 is enough for 1400-1700
Elo") are literature assumptions marked as such in the ADR.

## Measured baseline — where the time inside `legalMoves` actually goes

Scratchpad harness run **outside the repo**, read-only against merged `src/`. Apple M3, Node
v24.12.0, darwin/arm64. `legalMoves` was built up in four stages so each stage's cost is a
difference, not an estimate.

| Stage | kiwipete | share | startpos | share |
|---|---:|---:|---:|---:|
| `generateMoves` only | 924 ns | 19.1% | 390 ns | 21.3% |
| + `makeMove`/`unmakeMove` per move | +471 ns | 9.7% | +106 ns | 5.8% |
| + `kingSquareOf` `indexOf` scan | +600 ns | 12.4% | +248 ns | 13.5% |
| + `isSquareAttackedBy` = real `legalMoves` | **+2,841 ns** | **58.7%** | **+1,089 ns** | **59.4%** |
| total | **4,837 ns** | | **1,833 ns** | |

**The hotspot is the attack test — ~59% — not the bookkeeping around it.** Generation is 19%.
Across four runs `legalMoves` measured 4,837-5,358 ns (kiwipete) and 1,833-2,224 ns (startpos),
agreeing with the audit's 5,263 / 5,298 / 2,144 ns. Standalone: `isSquareAttackedBy` 63.5 ns,
`isInCheck` 74.8 ns, `kingSquareOf` 12.7 ns white / 43.1 ns black.

Tree statistics, full legal tree of all six standard positions to depth 3 (277,955 nodes):
**40.9 pseudo-legal moves per node, 39.7 legal** (so only 1.2 illegal moves per node cost 40.9
attack tests), **1.6% of nodes in check**, and **only 8.1% of moves can possibly be illegal at all**.
`makeMove` calls per node: **40.9 today, 3.3 under lazy legality.**

**I did not retry the recorded failed attempt.** The baseline explains why it could not have paid:
the king scan is 12.4% of `legalMoves`, so the measured 0.99x/1.08x is what hoisting it should give.

## The three options, with measured speedups

| Option | Measured | Verified how |
|---|---|---|
| **(a) keep make/test/unmake, re-derive `NFR-005`** | **1.0x** by construction | nothing changes; perft 32/32 exact stands as-is |
| **(b) full pin-aware generation** | ceiling **~5.4x-7.6x** over today, but only **~1.5x over (c2)** — bounded by measurement, not guessed: `generateMoves` with *no* legality work is 989 ns vs (c2)'s 1,486-1,583 ns | perft 32/32 **necessary but not sufficient**; needs a node-by-node differential plus named tests for double check, pinned-piece-captures-pinner, ep discovered check, castling evasions |
| **(c1) pseudo-legal search** (`EPIC-004` search design, zero core change) | **2.6x** at EBF 6, **3.9x** at EBF 3, **5.1x** at EBF 2 | filter untouched so perft stays valid; equivalence already evidenced — all 9 model configs visited **identical node counts** under both walks, root position byte-identical after each |
| **(c2) lazy legality behind the unchanged `legalMoves` signature** | **2.95x-4.38x** per call in open positions; **1.21x in check** (0.97x without the board-only test); **2.7x** in the search model | **518,474 nodes differentially compared against `legalMoves`: 0 move-list mismatches, 0 position mutations, 6/6 perft counts exact** |
| **(c3) board-only legality test** (no full `apply`) | **1.23x-1.41x** alone; folds into (c2) (kiwipete 3.19x → 3.39x) | as (c2) |
| **(c4) reduce per-move allocation** | **cannot exceed 1.24x** — all of generation is 19.1% of `legalMoves`, 19.3 ns per move including allocation | not prototyped; bounded arithmetically |

The gain from (c1) **grows as pruning improves**, which is why it is first on the menu: today a
searched move is made twice (once by the filter, once to descend), and alpha-beta tests all ~41 moves
at a node while searching a handful.

## Why the target, not the code — the numbers that decided it

Same merged code, this session: **207k/sec** (ABC-008 metric B, kiwipete) · **546k/sec** (metric B,
startpos — already above target) · **297k-1.83M/sec** (alpha-beta-shaped model, EBF 2-6) ·
**3.37M-3.88M/sec** (perft-shaped, eval at leaves) · **~6.1M/sec** (classic perft). A **30x spread on
unchanged code**, driven entirely by the definition of a node. A target a *position* can pass or fail
with no code change is not testable.

Iterative-deepening cumulative wall clock, today's design, EBF 6, leaves evaluated not generated:

| Position | leaf eval | d6 | d7 | d8 | d9 |
|---|---|---:|---:|---:|---:|
| kiwipete | 134 ns | 90 ms | 390 ms | 2.46 s | 12.3 s |
| kiwipete | 543 ns | 94 ms | 484 ms | 3.17 s | 17.0 s |
| kiwipete | 1,097 ns | 127 ms | 677 ms | 4.41 s | 22.8 s |
| position-6 | 1,097 ns | 116 ms | 644 ms | 4.01 s | 23.8 s |
| startpos | 134 ns | 42 ms | 226 ms | 1.60 s | 8.6 s |

Required rate derived the other way (EBF 6, ID overhead 1.2x, quiescence 2.5x, 3 s): depth 6 needs
**~47k/sec**, depth 7 **~280k/sec**, depth 8 **~1.68M/sec**. And the exchange rate is brutal — at
EBF 6 a **3x speedup buys 0.61 ply**, 5x buys 0.90 ply.

**Disagreement with the audit's `RF-2`, recorded plainly:** `RF-2` named pin-aware generation as
"the named fix" at confidence medium. Measured, its ceiling over the much safer (c2) is ~1.5x — about
0.2 ply — for the largest correctness risk in the repo. The ADR says so.

## ADR-0002's stated dependency — answered with measurement

`ADR-0002` asked for exactly one number to be re-measured. Reproducing its shape (one `zobristKey`
after every `makeMove` inside the filter):

- **Today: 4.48x at kiwipete (+16.9 µs/node), 4.60x at startpos (+6.9 µs/node)** — independently
  reproduces `ADR-0002`'s 4.13x-4.21x / +16.1 µs. `zobristKey` alone is 295-304 ns, which is where
  the +16.9 µs comes from (40.9 make calls/node × a full key recompute).
- **`ADR-0002`'s premise does not hold and its conclusion holds anyway, more strongly.** It predicted
  `makeMove` would fall to ~1 call/node under pin-aware generation and the penalty to ~6%. Measured,
  calls/node fall from **40.9 to 3.3** (12x, not to 1) and the penalty measures **1.93x at kiwipete /
  0.99x at startpos**, not ~1.06x. Under (c1) the *relative* penalty gets **worse**, because the node
  becomes ~12x cheaper while still making one `makeMove` per move searched.
- **Because this ADR keeps make/test/unmake, `ADR-0002` needs no edit at all.** Its 4.2x stands as
  written; the re-measurement becomes owed only if a human ratifies (c1) or (c2). Its clauses 2, 3
  and 4 are untouched. **I found no contradiction between the two ADRs.**

## `ABC-009` interaction — stated per option, ticket untouched

Not edited, not re-cut, not re-scoped. (a) **neutral** — nothing moves. (c1) **slightly harder, and
an argument for shipping `ABC-009` first**: the search would reach `generateMoves` directly, so a
phantom castle becomes reachable without passing through `legalMoves`. (c2) **easier in test
infrastructure only** — its differential harness *is* the purity property test the ticket asks for
(I ran it at 518,474 nodes, zero mutations); it does not fix the defect, since a castle is a king
move and still takes the full path. (b) **harder** — it rewrites the code the ticket's acceptance
criteria assert against, and removes the path that currently contains the corruption rather than
fixing it. My prototypes ran only on well-formed positions; **I have no new information about
`ABC-009`.**

## Scope

Read all seven prior notes in this folder, `agent-factory/roles/architect-design.md`,
`agent-factory/workflows/16-context-read-write.md`, `agent-factory/contracts/context-note.md`,
`AGENTS.md`, `ADR-template.md`, `ADR-0001`, `ADR-0002`, `plans/nfr-catalog.md`,
`plans/epics/EPIC-004-engine-and-ai-opponent.md`,
`plans/tickets/ABC-009-legalmoves-position-mutation.md`, `src/legal.ts`, `src/moves.ts`,
`src/apply.ts`, `src/position.ts`, `src/perft.test.ts`. Wrote exactly one repo file (the ADR) plus
this note.

## What I did NOT touch

**No `src/**` — zero code changes** (`git diff --stat -- src/` is empty). No `plans/**` — including
`plans/nfr-catalog.md`, whose `NFR-005` row the ADR *recommends* correcting and deliberately does not
correct: that edit belongs to whoever ratifies, and must not happen while the ADR is `proposed`. No
`memory-bank/30-architecture.md`. **No ADR other than `ADR-0003`** — `ADR-0002` was read, never
edited. No `ABC-009` edit. **No `git add`, no `git commit`** — the new file is left in the working
tree for the Orchestrator's single commit. No branch change, no merge, no deploy.
`agent-factory/**` read-only.

The `plans/traceability.md` row this role normally appends is **missing**, and I am naming the
omission rather than silently skipping it: `plans/**` was out of scope for this subtask, so
`ADR-0003` has no trace row yet. It needs one.

## Risks

- **The ADR is `proposed` and must not be read as settled.** Its ratification line is unsigned. If
  it is committed and then treated as accepted because it sits in `50-decisions/`, that is the exact
  failure this status guards against.
- **The re-derived target rests on three literature assumptions, not measurements** — EBF 6, the
  2.5x quiescence factor, and "depth 6-7 is enough for 1400-1700 Elo". They are marked as such in
  the ADR. `EPIC-004`'s puzzle suite and self-play ladder are the only real verdict on strength, and
  the ADR says they outrank every number in it.
- **One machine, one Node version** (Apple M3, Node v24.12.0, darwin/arm64). The spike's 2-3x
  slower-hardware factor is still unvalidated on any non-M3 machine — the largest single unknown
  here. `UNKNOWN - verify` elsewhere.
- **The search model is a model.** Alpha-beta is approximated by a fixed width, leaves evaluate with
  a material-only function (134 ns, swept to 1,097 ns), and there is no transposition table, move
  ordering cost, or quiescence search. Those are named in the ADR, not hidden; they make the
  absolute times a lower bound, which is why the sensitivity sweep is there.
- **(c2)'s screen was verified by differential, not by proof.** 518,474 nodes with zero mismatches is
  strong evidence that the "cannot possibly be illegal" classification is complete; it is not a
  proof, and if (c2) is ever ratified the differential must run over a much larger tree.
- **My prototypes are scratchpad-only and are not repo artifacts.** They are not committed, not
  tested, and must not be mistaken for an implementation.
- This note passed no validator (see provenance above).
