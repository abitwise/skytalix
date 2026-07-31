---
id: 20260731T103332Z-architect-design-decision-d4ad8f5a
kind: decision
by: architect-design
at: 2026-07-31T10:33:32Z
verified_by: 
confidence: high
refs:
  - epic-to-tickets-EPIC-002
  - ADR-0004
  - ABC-013
  - ABC-016
  - ABC-017
  - EPIC-002
  - EPIC-003
  - EPIC-006
  - NFR-002
  - NFR-003
  - memory-bank/50-decisions/ADR-0004-san-ownership.md
  - plans/traceability.md
  - plans/tickets/ABC-013-san-rendering.md
  - plans/board.md
  - src/apply.ts
  - src/moves.ts
  - src/legal.ts
  - src/fen.ts
  - 20260730T144200Z-architect-design-decision-63309fd4
  - 20260730T153400Z-system-analyst-observation-2fc3e3d9
  - 20260730T220000Z-orchestrator-observation-8e3f1a06
supersedes: 
---

# ADR-0004 RATIFIED — clauses 1 and 3 as proposed, clause 2 as amended; ABC-013 Blocked → Ready

Subtask `architect-adr0004-ratify` of task `epic-to-tickets-EPIC-002`. **A ruling was applied, not
made.** The Orchestrator ruled on `ADR-0004` under a named, quoted delegation from the project owner
**Olger Oeselg** dated 2026-07-31; this role wrote that ruling into the artifacts. Nothing was
re-decided and **nothing was re-measured** — every figure in the ADR is exactly as written on
2026-07-30.

## The attribution, written the way it actually happened

The standing convention here is *no agent may move an ADR to `accepted`*, and `ADR-0002` /
`ADR-0003` were both ratified in session by a named human. **This one was not.** The owner delegated
the ruling rather than making it:

> *"I will give ADR-0004 ownership to you, you can decide if changes are needed or it can be
> scrapped."*

So the ADR reads **"Ratified by: the Orchestrator, under delegation from Olger Oeselg — 2026-07-31"**
and explicitly **not** `Ratified by: Olger Oeselg`, which would be false. Every artifact touched
(ADR, trace row, ticket, board) carries the same two sentences: this is the **first** ADR in this
project not ratified by a human directly, and it is **not precedent** — the delegation was specific
to `ADR-0004` by name. A false attribution in an audit trail is worse than the irregularity it hides,
and a reader scanning the trace's Status column must not mistake this row for the two above it.

The board's Blocked comment and the trace's trailing comment both said, on 2026-07-30, that this
would be *"the same ruling on the same kind of artifact"* as `ADR-0002` / `ADR-0003`. Both are now
**corrected in place** rather than left to read as fulfilled: same kind of artifact, different kind
of ruling.

## The ruling as applied

- **Clause 1 — as proposed.** `src/san.ts` above `src/legal.ts`. Structural fact, not judgment.
- **Clause 3 — as proposed.** Derived per frame, never stored; `ADR-0002` clause 2 stays whole.
- **Clause 2 — as amended**, two amendments, both landing on `parseSan` (`EPIC-003`'s), not on
  `toSan` (`ABC-013`'s).

### 2a — the shape I chose, and why this one

```ts
export function parseSan(position: Position, text: string, legal?: readonly Move[]): SanParseResult;

export type SanParseResult =
  | { readonly outcome: "move"; readonly move: Move }
  | { readonly outcome: "ambiguous"; readonly candidates: readonly Move[] }   // N ≥ 2
  | { readonly outcome: "rejected"; readonly reason: SanRejectReason };
```

Four choices inside the freedom the ruling left, each with its reason:

1. **The three outcome names are the seam contract's own** (`…-system-analyst-observation-2fc3e3d9`,
   Seam A). The seam publishes five closed outcomes; `parseSan` supplies exactly three of them and
   the input layer owns `command` and `input-unavailable`. Teaching `src/san.ts` the command set
   would drag `EPIC-003`'s vocabulary into the module whose whole justification is that it owns one
   grammar. Stated normatively in the ADR so nobody "completes" the union later.
2. **`rejected` carries a machine-readable reason code, never display copy** — seam invariant 5 is
   that message text is data the loop places, not output the parser prints. The ADR fixes the
   **outcome set** at three and deliberately does **not** fix the reason vocabulary: `EPIC-003` owns
   its membership and may extend it without an ADR change. The floor it must meet is one distinction
   — *not readable as SAN* vs *well-formed SAN naming no legal move here*.
3. **`ambiguous` carries N ≥ 2 candidates; a single match is `move`.** Contract, not comment.
4. **Total, never throwing** — recorded as a deliberate divergence from `src/fen.ts`, which throws
   `FenError` on everything. FEN arrives once at a boundary; SAN arrives on every typed line, on the
   loop's most-travelled re-prompt edge. Two parsers with opposite error conventions in one codebase
   needs its reason written down or the third one is a coin flip.

**The one thing I added that the ruling did not ask for, flagged rather than smuggled: the optional
`legal` parameter on `parseSan`.** It is not symmetry for its own sake — it is what makes 2b
falsifiable (below). Cost: one optional parameter, no new type, no new import.

### 2b — the invariant, and a correction to the evidence cited for it

Written into the Decision as a normative clause: *every `Move` in a `SanParseResult` — the one in
`move` and every one in `ambiguous.candidates` — is an element of the legal move list generated for
that position, never one reconstructed from the parsed text.* Two failure levels, both legality
failures: the loud one is that a text-built `Move` can simply be **illegal** (pinned piece, king into
check), which membership rules out by construction; the quiet one is board corruption on the way
back.

**Correction, recorded rather than quietly absorbed.** The ruling (following the System Analyst's
note) cited `src/apply.ts:158` — `position.board[move.to] = undo.captured` — as the corruption site.
Read against merged code, **that line is the one that is immune**: `undo.captured` is read from the
live board at `src/apply.ts:124`, not from `move.captured`. The genuine unmake-time reads of the
`Move`'s own fields are:

| Site | Reads | Effect of a fabricated field |
|---|---|---|
| `src/apply.ts:157` | `move.piece`, `move.from` | writes a **wrong piece back onto `from`** during take-back |
| `src/apply.ts:160` | `move.flags` | selects the wrong restore branch in `undoSpecial` |
| `src/apply.ts:109` | `move.captured` (en-passant arm) | **materialises a wrong piece** beside `to` |

Nothing throws on any of these; the corruption surfaces during `EPIC-006`'s `undo`, a full move after
the mistake. **The invariant is unchanged by the correction and is if anything broader than the line
cited** — it binds `piece`, `flags` and `captured`, not `captured` alone. The correction is recorded
in the ADR's Status section and on `ABC-013`, because this ADR's own Context section holds itself to
"read off the merged code, not assumed" and a normative clause must meet the same bar.

### The consequence that changes a published test

`generateMoves` allocates a fresh `Move` object per call, and `legalMoves` pushes those same objects
into a fresh array (`src/legal.ts:42-55`). So two `legalMoves(position)` calls yield field-equal,
**reference-distinct** moves, and the round-trip test that `EPIC-003`'s Test notes, `ABC-013` and
`ADR-0004`'s own Rollback all name — `parse(toSan(move)) === move` — **cannot pass as written**.
Worse, relaxing it to deep equality makes it unable to falsify 2b at all: a perfectly reconstructed
`Move` compares equal. The fix is one shared list:

```ts
const legal = legalMoves(position);
const parsed = parseSan(position, toSan(position, move, legal), legal);
// outcome === "move" && parsed.move === move  — identity, not field equality
```

At 0.10-0.11 µs per call it is cheap over every legal move of every perft position. This is why
`parseSan` took the optional `legal` parameter, and it is amended into the ADR's Rollback section and
`ABC-013`'s Test notes (whose `(fen, move, expected)` rows must now source their `move` from
`legalMoves(position)`, never from a hand-built literal, so `EPIC-003` extends the table instead of
rebuilding it).

## Coherence check — what I verified before implementing, and what I would have refused

The ruling invited push-back if 2a or 2b broke the DAG, contradicted a ratified ADR, or forced a new
dependency into `src/san.ts`. Checked, all three clear:

- **DAG unchanged.** `SanParseResult` is declared in `san.ts` over `Move` (`moves.ts`) and `Position`
  (`position.ts`), both already imported by clause 1. The optional `legal` parameter changes no
  import. `src/san.ts` still imports `position.ts`, `moves.ts`, `apply.ts`, `legal.ts` and nothing
  else — clause 1's graph is byte-for-byte the ratified one.
- **No ratified ADR contradicted.** `ADR-0002` (history ownership) and `ADR-0003` (legality strategy)
  are untouched; neither was re-opened. `ADR-0001`'s mutable-`Position` inheritance is unaffected.
- **No published artifact contradicted.** The wave-1 seam note
  (`…-architect-design-decision-63309fd4`) writes `parseSan(position, text)` with **no return type**,
  so the amendment does not contradict it and it is **not superseded**. `ABC-013` ships `toSan` only,
  so its scope, size, priority, acceptance criteria and NFR bars are untouched by the amendment.
- **2b is strictly cheaper than the alternative it forbids.** Fact 3 of the ADR already has
  `parseSan` resolving text against the legal move list, so the list is in hand either way; selecting
  from it is less work than constructing a `Move`.

I found nothing to refuse. The one place I did not simply comply is the `apply.ts:158` citation
above — corrected, not softened, and the substance it was offered in support of stands.

## Board and trace

- **`ABC-013`: `Blocked` → `Ready`.** Its only blocker was the ratification. Remaining dependencies
  are `ABC-003` and `ABC-005`, both merged on `main`, so it has no unbuilt predecessor — the one
  thing that keeps `ABC-015..ABC-019` in `Backlog`. `Ready` 3/8 → **4/8** against a limit of 8; no
  override needed or taken. Blocked is now empty after **one** day against
  `blocked_escalation_days: 2` — first entry to and first exit from that column in this project.
- **`ABC-016` / `ABC-017` unchanged in `Backlog`.** Their blocker is a ticket, not the decision, and
  both consume `toSan`, which the amendment does not touch.
- **The owed `plans/traceability.md` row was appended** in the `ADR-0002` / `ADR-0003` shape: forward
  to the epics it constrains (`EPIC-002`, `EPIC-003`, `EPIC-006`), `no src/** change`, the named
  verification owed rather than invented, and the ratification irregularity in the Status cell rather
  than a bare "Accepted". `ABC-013`'s row was re-read with it.

## Stale references I did NOT edit — flagged, not fixed

Four files still describe `ADR-0004` as `proposed` or `ABC-013` as blocked. None is in this subtask's
scope and three belong to other roles, so they are flagged here the same way BA/PM flagged the
`NFR-002` row rather than editing it:

| File | What is stale |
|---|---|
| `plans/nfr-catalog.md:27` and `:130` | *"blocked on ADR-0004's ratification"* (twice) and *"ADR-0004 (**proposed** …)"*. Architect/Design's own file — a one-line correction, not re-measurement; no target or figure moves |
| `plans/metrics.md:21` | Blocked-time row still open, *"escalates on 2026-08-01 if unratified"*. It closes at one day with no escalation — Orchestrator's file, next sweep |
| `plans/tickets/ABC-016-*.md:103`, `ABC-017-*.md:96,146`, `ABC-012-*.md:85` | *"`ABC-013` is `Blocked` on `ADR-0004`'s ratification"*, *"the `ADR-0004` wait inherited"*, *"clause 3, proposed"* — BA/PM's files |
| `plans/epics/EPIC-002-*.md:91,223` | *"`ADR-0004` (`proposed`, NOT ratified)"* — BA/PM's file |

## Provenance of this note

Written directly into `notes/` in the schema's exact shape. **This install has no
`scripts/context-io.ts` and no `mcp__grugops__propose_note` tool**, so the sanctioned writer named by
Workflow 16 does not exist here; every note in this folder was recorded the same way. This is a
`decision` — a soft kind with an empty `verified_by` — so no admission stamp was required and none
was bypassed. Recorded because the gap belongs in the trail, not in a footnote.

## Confidence

**High** on everything applied: clauses 1 and 3 are unchanged text; 2a's shape is read off a
published seam contract; 2b and the `apply.ts` line corrections are read off merged code, line by
line. **High** on the board move — `ABC-013`'s dependency list is short and both entries are on
`main`. No measurement was taken and none is claimed; the ADR's numbers are the 2026-07-30 ones, on
the machine named with them, `UNKNOWN - verify` on any other.
