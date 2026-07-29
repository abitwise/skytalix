---
id: 20260729T151154Z-architect-design-decision-7805ef24
kind: decision
by: architect-design
at: 2026-07-29T15:11:54Z
verified_by: 
confidence: high
refs:
  - architecture-audit-2026-07-29
  - NFR-001
  - NFR-003
  - NFR-005
  - RISK-002
  - ADR-0001
  - ABC-008
  - EPIC-001
  - EPIC-004
  - plans/nfr-catalog.md
  - memory-bank/30-architecture.md
  - memory-bank/50-decisions/ADR-0001-board-representation-0x88.md
  - src/legal.ts
  - src/apply.ts
  - src/moves.ts
  - src/zobrist.ts
  - src/gameend.ts
  - src/fen.ts
supersedes: 
---

# Record corrections — three files brought into line with what the audit measured

Subtask `arch-audit-correct-records` of task `architecture-audit-2026-07-29`. This is a
**correction-only** pass over three records that misstated reality, not a decision-making pass.
`kind: decision` because the corrected records constrain later work (EPIC-004 decomposition in
particular), and because a withdrawal — of the "~5x headroom" clause — is itself a choice that
must be attributable.

## Provenance and admissibility (read this first)

**This repo has no `scripts/context-io.ts`** — there is no `scripts/` directory at all. The
sanctioned SCTX-01 writer is absent, so this note was **hand-written directly against the
schema** and against the shape of the four existing notes in this folder. **No validator ran, no
admission check ran, no atomic claim was taken, and `index.md` / `index.jsonl` were not
regenerated.** I claim no enforcement I do not have.

`verified_by:` is deliberately **empty** and **no `finding` is recorded**. There is no live
§14-gate verdict for this task to stamp against, so a `finding` would be inadmissible under
SCTX-01 — including for the numbers I re-measured myself. Those numbers are recorded here as
measurements inside a `decision` note, not as gate-verified results.

I read all four prior notes in this folder before acting
(`…-brownfield-mapper-observation-ac540523`, `…-architect-design-observation-43d9a3cc`,
`…-security-nfr-observation-abedec95`, `…-orchestrator-observation-7b2f91c4`). Nothing was
relayed to me; the shared context is where the figures came from.

## Re-verification I ran before editing (not taken on trust)

| Check | Command / probe | Result |
|---|---|---|
| NFR-001 | `npm run perft` | 11,377,922 nodes in 1.883 s = **6,041,738/sec** — *below* the 6.09M–6.21M four-run range security-nfr recorded, so the honest catalog range is now **6.04M–6.21M over five runs** |
| NFR-005 metric B | scratchpad walk, every node calls `legalMoves()` | startpos d4 **346,449/sec**; kiwipete d3 **163,042/sec**; kiwipete d4 **186,843/sec** — within ~1.5% of security-nfr's independent 351,379 / 162,561 / 187,912 |
| free-leaf fraction | classic-perft leaf/generating split, kiwipete d4 | leaves 4,085,603 vs generating 99,950 = **97.6%** free on that tree; consistent with the **97.3%** security-nfr measured across the whole six-position harness |
| ADR-0001 blast radius | `grep -n` for the 16-stride, 128-scan and raw square literals | **confirmed in five modules**, file:line list below |

Probes ran **read-only outside the repo** against merged `src/` and are not repo artifacts.
One machine (Apple M3, Node v24.12.0, darwin/arm64), so `UNKNOWN - verify` on other hardware.

---

## (1) `plans/nfr-catalog.md` — NFR-005 corrected, NFR-001 fenced, NFR-003 made honest

### NFR-005 — the corrected wording

Row `Verified by` cell now reads:

> **MISSED as measured 2026-07-29 — 163k–351k nodes/sec, with no evaluation running at all**
> (ABC-008 metric B re-run against the merged generator, M3). Historical proxy: the ABC-008
> spike's **2,639,455 nodes/sec**, a throwaway benchmark **without legality filtering**,
> 7.5x–16x above the real generator. **GO WITH CONSTRAINT stands; the "~5x headroom" is
> WITHDRAWN** (see below).

The 2,639,455 figure is **kept visible as history and relabelled**, not deleted: it was real,
and it measured a benchmark with no legality filtering — a proxy for the engine, not a
measurement of it.

The prose section that carried the headroom claim was replaced with an explicit
**survives / withdrawn / why** split:

- **Survives:** RISK-002 = GO WITH CONSTRAINT, and EPIC-004's per-move budget must be
  **time-based iterative deepening, not depth-based**. The measurement *strengthens* it — the
  worst-case-slow-machine scenario the constraint hedged against has arrived on the fast
  machine.
- **Withdrawn:** the "~5x headroom" clause and the arithmetic under it (~3x for legality
  filtering, ~3x for hardware, landing near ~300k). The first factor measures 7.5x–16x, not 3x;
  the second is still unvalidated on any non-M3 machine.
- **Why pruning does not close it:** ABC-008 netted "no alpha-beta, no TT, no move ordering"
  against its other biases as if it bought back a large multiple. For a **rate** it does not.
  Pruning, a TT and move ordering reduce the **number of nodes needed** to reach a depth; they
  do not make a node cheaper. Real relief for **NFR-004** (wall clock per move); close to none
  for **NFR-005** (nodes/sec). ~71% of per-node cost is the make/test/unmake filter in
  `src/legal.ts`, so the gap closes by changing how legality is decided, not by tuning.

A closing subsection now states the **definition behind each number** (classic perft with free
leaves for NFR-001; metric B where every node including leaves calls `legalMoves()` for
NFR-005), with the commands, the machine, and the one-machine caveat — so the two rates cannot
be silently swapped again.

### NFR-001 — fenced, NOT weakened

NFR-001 stays **MET, ~6x over target**. Two additions only: the range corrected to
6.04M–6.21M over five runs (the old `~6.2M` was the top of the range, not its centre), and a
**denominator fence** — 97.3% of the nodes it counts are free leaves, so it measures
generation-with-free-leaves and is **never** evidence for NFR-005. Strip the free leaves and
the same CPU-seconds yield ~167k generating nodes/sec.

### NFR-003 — partly verifiable, explicitly NOT passed

Recorded as **"Partly verifiable — NOT passed."** Compute half measured (`legalMoves()` at
2.1–5.3 µs, ~19,000–47,000x under the 100 ms budget, so compute is not the risk); keystroke
echo and terminal I/O stay `UNKNOWN - verify` because no prompt exists.

`_Updated:` line updated; the 2026-07-24 seeding provenance is preserved alongside it.

## (2) `ADR-0001` — Rollback prose amended, decision untouched

**Status stays `accepted`. The decision is unchanged and correct** — the audit found 0x88
conformant in every clause, including zero hits for the hand-rolled `rank * 8 + file` the ADR
warned about. Only the Rollback section's containment claim was wrong.

The claim *"confined behind `src/position.ts` and the helpers it exports"* is replaced with the
measured blast radius, re-verified by grep this session:

- `apply.ts:52` `CASTLE_LOSS` (raw squares 4, 116, 0, 7, 112, 119); `apply.ts:70`
  `CASTLE_ROOK_MOVE` (6/2/118/114); `apply.ts:62` `DOUBLE_PUSH = 32`; `apply.ts:78` `± 16`
- `moves.ts:58-61` direction/leap tables; `moves.ts:152,236` `± 16`; `moves.ts:279,283`
  `WHITE_CASTLES` / `BLACK_CASTLES`; `moves.ts:326` scan to 128
- `zobrist.ts:45,62` `15 * 128` table addressed `piece << 7 | square`; `zobrist.ts:59` scan to 128
- `gameend.ts:60`, `fen.ts:104` scan to 128

**Five other modules — six of nine including `position.ts`.** Only `legal.ts`, `perft.ts` and
`perft-bench.ts` are layout-free (verified: `legal.ts`'s single `0x88` mention is a doc
comment). The amendment states plainly that this is **not a code defect and must not be
"fixed"** — routing offset tables through helper calls would be slower and less readable — and
that the mitigation the ADR relies on (behaviour-asserting FEN and perft suites) is intact.
Rollback is still *safe*, just wider than advertised.

**NFR mismatch reconciled in a line**, as allowed: Context binds on NFR-001 while Rollback named
NFR-005. Reconciled **to NFR-001**, with the reason stated in the file — NFR-005 is in fact
missed today for reasons attributed to legality filtering, not to the board representation, so
reading that miss as a rollback trigger for 0x88 would replace the right change with the wrong
one. No restructuring; Status, Context, Decision, Alternatives and Consequences are untouched.

**Flagged, not changed (out of my scope, human's call):** ADR-0001's Context still cites "the
ABC-008 spike measured 2.64M nodes/sec search-shaped" as the evidence the decision leans on, and
Consequences still says "the ABC-008 throughput measurement stays valid". Both are literally
true — that benchmark did use a 0x88 board — but a reader could carry the withdrawn headroom
reading back in through them. I left both alone because my brief was Rollback prose only.

## (3) `memory-bank/30-architecture.md` — filled with the as-built shape

Was an unmodified kit template with the literal `_Updated: <date>_`. Its four existing sections
are now filled from the mapper's verified map, and the file's own "keep it short" instruction
was obeyed — ~50 lines, no rationale. Contents: the single-process/no-network/nothing-published
context and which epics do not exist yet; a nine-row module table with the layer each occupies;
four system patterns (layered acyclic DAG with the verified edge direction, depth 6, zero
cycles; mutable `Position` with make/unmake and a caller-owned `UndoRecord`, nothing ever
copied, so a `Position` is a live object and never a snapshot; transient mutation behind
pure-looking queries; the core owns a position, not a game); and the Tech context from
`AGENTS.md`. **The WHY is deliberately absent** — it belongs in an ADR, not here. The one place
an open question appears, it is named as open: "Who owns game history is an open decision, not a
recorded one."

---

## Deliberately left open — not mine to close

- **The two due ADRs were NOT authored.** Game-history ownership, and legality strategy
  (pin-aware generation vs make/test/unmake). These are open decisions the human holds. I
  declined to make them unilaterally in the audit and that stance stands. `memory-bank/50-decisions/`
  still contains exactly one ADR plus the template.
- The catalog now says the legality decision is **"open and unmade"** and that `src/legal.ts`
  defers it to "the EPIC-004 spike", which is now due. That records the state of the decision;
  it does not take it.
- No ticket was cut for the NFR-005 gap, the `legalMoves` purity violation, or the dev-only
  `npm audit` findings.
- The five remaining honest `UNKNOWN - verify` rows (NFR-002/004/006/007, and NFR-003's I/O
  half) were left unknown. Nothing was marked passed that was not measured.

## What I did NOT touch

No `src/**` — zero code changes. No `plans/board.md`, no `plans/tickets/**`, no
`plans/traceability.md` (a BA/PM agent is working those concurrently on this branch; I stayed
out to avoid a collision and did not wait for it). No `git add`, **no `git commit`** — edits are
left in the working tree for the orchestrator's single commit. No branch change, no merge, no
deploy. `agent-factory/**` read-only. `git status` confirms exactly three modified state files:
`plans/nfr-catalog.md`, `memory-bank/30-architecture.md`,
`memory-bank/50-decisions/ADR-0001-board-representation-0x88.md`.

## Risks

- **The measurements are one machine, one Node version.** Strong enough to withdraw a headroom
  claim; not strong enough to publish as the engine's performance envelope. Any other hardware
  is `UNKNOWN - verify`.
- **The `plans/traceability.md` row this role normally appends is missing.** The trace-update
  duty was suppressed because a concurrent agent owns that file this run. Naming the omission
  rather than silently skipping it: the NFR-005 correction has no trace row yet.
- **Reconciling ADR-0001's rollback trigger from NFR-005 to NFR-001 is the single most
  judgment-laden line I wrote.** It is defended in the file itself; if a human disagrees, that
  one sentence is the thing to revert.
- This note passed no validator (see provenance above).
