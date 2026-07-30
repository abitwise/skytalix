---
id: 20260729T200039Z-architect-design-decision-bd553d62
kind: decision
by: architect-design
at: 2026-07-29T20:00:39Z
verified_by: 
confidence: medium-high
refs:
  - architecture-audit-2026-07-29
  - ADR-0002
  - ADR-0001
  - ADR-0003
  - EPIC-002
  - EPIC-004
  - EPIC-005
  - EPIC-006
  - NFR-002
  - NFR-003
  - NFR-005
  - RISK-002
  - memory-bank/50-decisions/ADR-0002-game-history-ownership.md
  - memory-bank/50-decisions/ADR-0001-board-representation-0x88.md
  - memory-bank/30-architecture.md
  - src/apply.ts
  - src/gameend.ts
  - src/zobrist.ts
  - src/legal.ts
  - 20260729T145433Z-architect-design-observation-43d9a3cc
  - 20260729T145735Z-security-nfr-observation-abedec95
  - 20260729T151154Z-architect-design-decision-7805ef24
supersedes: 
---

# ADR-0002 authored as a PROPOSAL — game-history ownership

Subtask `adr-0002-history-ownership` of task `architecture-audit-2026-07-29`. One artifact
written: `memory-bank/50-decisions/ADR-0002-game-history-ownership.md`, `status: proposed`.
**Nothing was accepted and no decision was taken** — the ADR presents a recommendation with its
evidence for a named human to ratify, and carries an explicit unsigned ratification line.

## Provenance and admissibility (read this first)

**This repo has no `scripts/context-io.ts`** — there is no `scripts/` directory at all. The
sanctioned SCTX-01 writer is absent, so this note was **hand-written directly against the schema**
in `agent-factory/contracts/context-note.md` and against the shape of the six existing notes in
this folder. **No validator ran, no admission check ran, no atomic claim was taken**, and
`index.md` / `index.jsonl` were not regenerated. I claim no enforcement I do not have.

`verified_by:` is deliberately **empty** and **no `finding` is recorded**. There is no live
§14-gate verdict for this task, so a `finding` would be inadmissible under SCTX-01 — **including
for the numbers I measured myself**, which are recorded below as measurements inside a `decision`
note, not as gate-verified results. I did not self-stamp. This is the posture all six prior notes
in this folder took.

I read all six prior notes in this folder before acting. Nothing was relayed to me; the audit's
reasoning, module map and performance envelope came from those notes. A second Architect/Design
agent is authoring `ADR-0003` (legality strategy) concurrently on this branch; I did not see its
output and did not wait for it — the dependency is stated in the ADR rather than assumed away.

## The recommendation, in one paragraph

The rules core keeps owning a position, not a game. A small history module above the core owns
`{ initial position, Move[] }` as the **authoritative** state, and derives the undo stack, key
list and repetition counts **by replay rather than maintaining them**. The search does not share
that structure: `EPIC-004` keeps a preallocated per-ply key array, seeded once per search. And
`gameStatus`'s optional `positionCounts` gets exactly one supplier. Undo becomes a two-element
truncation of one list, which makes `EPIC-006`'s predicted "undo forgot to rewind repetition"
corruption unrepresentable rather than merely tested for.

**Confidence: medium-high.** High on the constraints, which are measured; medium-high on the
derive-don't-maintain judgment, which is about future consumers.

## Measurements I ran (scratchpad, OUTSIDE the repo, read-only against merged `src/`)

Node v24.12.0, darwin/arm64, one machine. Every traversal variant was asserted against the
published perft counts (kiwipete d4 = 4,085,603; startpos d5 = 4,865,609), the shared-map variant
was asserted to empty itself at the end, positions were asserted to round-trip byte-identically
via `toFen`, and every sink was printed so V8 could not eliminate the work.

| Measured | Result |
|---|---|
| `zobristKey`, `legalMoves(kiwipete)`, `legalMoves(startpos)` | 295-302 ns, 5,010 ns, 2,124 ns |
| In-tree repetition via **per-ply key array** + bounded backward scan | **+9-23 ns/node** over the key = **0.2-0.4%** of a search node |
| In-tree repetition via **shared `Map<bigint,number>`** inc/dec | **+86-101 ns/node** over the key = **1.6-1.9%** |
| Worst-case backward scan, ply 4 / 12 / 20 / 40, clock never resetting | 7 / 19 / 29 / 62 ns — bounded by search depth, not game length |
| History maintained inside the core's `makeMove`/`unmakeMove` | **4.13x - 4.21x** on `legalMoves` (+16.1 µs/node at kiwipete) |
| Deriving the **whole** history by replaying the move list, 120 plies | **41 µs**; undo (drop 2, replay 118) = **44.5 µs** |

The first row **reproduces the audit independently** — architect-design recorded 306 ns / 5,298 ns
and security-nfr recorded 288 ns / 5,263 ns / 2,144 ns. Third independent agreement.

Two of these decided the ADR:

- **The 4.2x** kills the strongest form of "a `Game` type in the core". It is that large because
  `legalMoves` plays and takes back **every** pseudo-legal move (48 at kiwipete), so anything hung
  on the make/unmake pair is paid ~48 times per node, not once. The core's make/unmake is the
  legality filter's inner loop, not the game's move API.
- **The 41 µs** removed the need for any maintained session history. At 0.089% of the `NFR-003`
  keystroke budget, incremental maintenance of an undo stack and key list would buy nothing and
  would introduce exactly the bug `EPIC-006` already predicts. This is why the recommendation is
  much closer to "write the contract down" than to "build a session layer".

Caveats: one machine, one Node version — `UNKNOWN - verify` on other hardware. These are
measurements in a `decision` note, not gate-verified findings. Scripts were scratchpad-only and
are not repo artifacts.

## The four options presented, and why three were rejected

All four are genuine and all four cost zero lines today.

1. **Leave it caller-owned; write only the contract down.** Rejected *narrowly*. Its real cost is
   ownership, not code — a contract with no owner is a comment. The ADR says plainly how little
   separates this from the recommendation: the recommendation *is* this option plus a name and a
   home, adding no data structure the epics were not already going to build.
2. **A `Game` type in the rules core.** Rejected on the measured 4.2x in its strongest form, and
   because a `Game` with a separate apply path leaves the core carrying two move-application paths
   with the fast one unadvertised. It also makes the core stateful, and the core's statelessness is
   what makes perft a proof.
3. **One shared repetition structure for session and search.** **Explicitly NOT rejected on cost** —
   1.6-1.9% is affordable and I verified it is correct under strict inc/dec discipline. Rejected on
   shape: repetition is a property of the root-to-node path, and a map re-derives that through
   bookkeeping that one missed decrement silently breaks. The array *is* the path.
4. **Derive everything, own nothing.** Mostly right, and it is why the recommendation derives
   rather than maintains. Rejected only as an *ownership* answer: something must still hold the
   move list and be the single supplier of `positionCounts`.

## Stated dependency on ADR-0003 — named, not assumed

`ADR-0003` decides whether legality stays make/test/unmake or becomes pin-aware generation. I have
not seen it. The interaction is real and is recorded inside ADR-0002 as its own subsection:

- **The 4.2x figure is contingent on make/test/unmake.** If `ADR-0003` chooses pin-aware
  generation, `makeMove` drops from ~48 calls/node to ~1 and the penalty falls to roughly the cost
  of one key (~6%). **That number must then be re-measured.**
- **The recommendation does not flip either way.** Clause 1 survives on the weaker but sufficient
  ground that make/unmake stays the search's descend primitive, with quiescence and move ordering
  keeping it hot. Clauses 2-4 are not a function of how legality is computed.

If a human reads both ADRs together and finds a contradiction I could not see, that subsection is
the named seam to cut along.

## The ep-hashing nuance — flagged, reproduced, NOT absorbed

`src/zobrist.ts:71` XORs the en-passant file whenever `epSquare` is set, not only when an ep
capture is actually available, so FIDE-identical positions can hash differently and **threefold
repetition under-detects**. I reproduced it concretely rather than restating the audit:

```
after 1.e4 — no black pawn on d4/f4, so no ep capture exists
  ...RNBQKBNR b KQkq e3 0 1  ->  4366836039462477420
  ...RNBQKBNR b KQkq -  0 1  ->  18311490354223382796
  legal ep captures available: 0   keys differ: YES   FIDE-identical: YES
```

Control: with a black pawn on d4 the capture is real and the keys *should* differ — they do. The
defect is confined to the no-capture-available case, and the error direction is the safe one (a
legitimate draw is missed, never a false draw declared).

**Disposition: separate defect, not in this ADR's scope, not silently absorbed.** It concerns what
a key *means* — a property of `src/zobrist.ts`, wrong or right regardless of who owns history — and
it has a concrete reproduction and a testable fix, which makes it ticket-shaped like `ABC-009` /
`ABC-010`, not decision-shaped. ADR-0002 names it in a clearly-labelled out-of-scope subsection for
one reason: the ADR makes the derived key list the substrate for every repetition verdict in the
product, so any inaccuracy in the key is inherited by all four epics. **Recommended: a defect ticket
under `EPIC-001`, size `S`, priority no higher than `P2`** (latent until a game runs long enough to
repeat, which needs `EPIC-002` and `EPIC-006`). **I did not cut it** — ticketing is BA/PM's.

## What the ADR forecloses (recorded because consequences sections usually only sell)

- The rules core can never answer "is this a draw by repetition" alone; `gameStatus`'s optional
  parameter stays a trap. The ADR **assigns** that trap one supplier rather than fixing it —
  making the parameter required would be a breaking change to merged, `Done`, 100%-covered code
  and the ADR deliberately declines it.
- Two representations of the same truth now exist (derived key list, search's per-ply array); the
  seeding step is the one place they meet and is where a bug will live.
- An immutable/persistent `Game` API — the natural shape for branching analysis or time travel —
  is foreclosed by the mutable never-copied `Position` (`ADR-0001`).
- The core stays "a chess position library", not "a chess game library".
- **No existing test would catch getting this wrong.** The perft and FEN suites assert behaviour
  that does not touch game history. The ADR says so explicitly, since that is the strongest reason
  to decide it deliberately rather than discover it.

## Scope

Read all six prior notes in this folder, `agent-factory/roles/architect-design.md`, `AGENTS.md`,
`memory-bank/50-decisions/ADR-template.md`, `ADR-0001`, `memory-bank/30-architecture.md`, the four
epics `EPIC-002` / `EPIC-004` / `EPIC-005` / `EPIC-006`, and `src/gameend.ts`, `src/zobrist.ts`,
`src/apply.ts`. Wrote exactly one repo file (the ADR) plus this note.

## What I did NOT touch

**No `src/**` — zero code changes.** No `plans/nfr-catalog.md`, `plans/board.md`,
`plans/traceability.md`, `plans/tickets/**`, `memory-bank/30-architecture.md`, and no ADR other
than the one I authored — a concurrent Architect/Design agent owns `ADR-0003` on this branch and
BA/PM owns the plans files this run. **No `git add`, no `git commit`** — the edit is left in the
working tree for the Orchestrator's single commit. No branch change, no merge, no deploy.
`agent-factory/**` read-only.

The `plans/traceability.md` row this role normally appends is **missing**, and I am naming the
omission rather than silently skipping it: the file is owned by another agent this run, so ADR-0002
has no trace row yet. It needs one.

## Risks

- **The ADR is `proposed` and must not be read as settled.** Its ratification line is unsigned. If
  it is committed and then treated as accepted because it is in `50-decisions/`, that is the exact
  failure this status guards against.
- **The measurements are one machine, one Node version.** Strong enough to reject an option and to
  size a constraint; not strong enough to publish as the engine's envelope. `UNKNOWN - verify`
  elsewhere.
- **The derive-don't-maintain call is the most judgment-laden clause** and rests on 41 µs having
  ~25x of headroom. It is defended in the ADR and has a named trigger for revisiting; if a human
  disagrees, clause 2 is the thing to amend, and clauses 1/3/4 stand without it.
- **`ADR-0003` was written blind to this one.** Both feed `EPIC-004`. The stated dependency is my
  mitigation, not a guarantee that the two agree.
- This note passed no validator (see provenance above).
