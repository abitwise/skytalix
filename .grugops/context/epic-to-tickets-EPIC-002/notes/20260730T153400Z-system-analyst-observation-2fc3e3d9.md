---
id: 20260730T153400Z-system-analyst-observation-2fc3e3d9
kind: observation
by: system-analyst
at: 2026-07-30T15:34:00Z
verified_by: 
confidence: high
refs:
  - epic-to-tickets-EPIC-002
  - EPIC-002
  - EPIC-003
  - EPIC-004
  - EPIC-005
  - EPIC-006
  - ADR-0002
  - NFR-003
  - NFR-004
  - RISK-002
  - 20260730T151200Z-system-analyst-observation-59aca936
  - 20260730T152600Z-system-analyst-decision-cca3c342
  - plans/epics/EPIC-003-move-input-and-controls.md
  - plans/epics/EPIC-004-engine-and-ai-opponent.md
  - plans/epics/EPIC-005-opening-book.md
  - plans/epics/EPIC-006-game-session-and-packaging.md
  - plans/nfr-catalog.md
  - src/moves.ts
  - src/apply.ts
  - src/legal.ts
  - src/position.ts
supersedes: 
---

# The two seams — what the loop skeleton does where EPIC-003 and EPIC-004 do not exist yet

The orchestrator's routing note names this as the reason a System Analyst is on this
decomposition at all: *"the turn loop is specified in one line against two epics that do not
exist."* This note states each seam as a **behavioral contract** — the closed set of outcomes
the loop must handle and the invariants that bind both sides — and what the skeleton can be
built and tested against before either epic ships. It does not name modules, signatures or files;
those are Architect/Design's.

---

## Seam A — EPIC-003, move input (no parser exists)

### Contract

**In:** the current position (equivalently, its legal move list) and one raw line from the human.

**Out:** exactly one of five outcomes. The set is closed — the loop must handle all five, and a
sixth would be a contract change, not an implementation detail.

| Outcome | Payload | Loop does | Ply advances? |
|---|---|---|---|
| `move` | one `Move` | `S5` apply | **yes** |
| `ambiguous` | N ≥ 2 candidate moves | show candidates, re-prompt | no |
| `rejected` | a reason naming *why* | show reason, re-prompt | no |
| `command` | which command, and **whether it mutates the position** | `moves`/`help`/`board` → re-prompt; `undo`/`new` → back to evaluate; `quit`/`resign` → game over | only for the mutating ones |
| `input-unavailable` | — | terminate cleanly | no |

### Invariants that bind both sides

1. **The parse step never mutates the position.** The loop applies the move; the parser reports
   one. *(EPIC-003 acceptance already promises this for the rejection path — "the position is
   unchanged" — this generalises it to all five outcomes.)*
2. **A returned `Move` is one the generator produced for this position** — settled rule R4. A
   parser that reconstructs a `Move` from text can get `captured`, `flags` or `promotion` wrong,
   which applies plausibly and corrupts the board only on the way back through `unmakeMove`
   (`src/apply.ts:158`), i.e. during EPIC-006's `undo`, silently. This is the single most
   load-bearing clause on this seam.
3. **A non-advancing outcome does not re-enter the terminal check** — the position did not change,
   so `gameStatus` cannot have changed either. Re-running it per rejected keystroke would be pure
   waste against `NFR-003`.
4. **Command classification belongs to the seam, not to the loop's guesswork.** The loop needs one
   bit — *did the position change* — to decide whether to re-render and re-evaluate. `undo` moves
   two plies; `board` moves none.
5. **Message text is data the loop places, not output the parser prints.** Settled rule R10: a
   rejection printed outside the frame corrupts an in-place redraw. This makes EPIC-003 a supplier
   of strings, not a second writer to stdout.

### What the skeleton can stand on today, honestly

A coordinate-only reader built from **merged code only**: match `squareName(move.from) +
squareName(move.to)` (`src/position.ts:60`, already exported) across `legalMoves(position)`. It
returns a generator-owned `Move`, so it satisfies invariant 2 by construction, and it needs no
chess logic that does not already exist. It is a **test seam, not a design for EPIC-003** — EPIC-003
owns SAN, decoration tolerance, teaching rejections, tab-completion and the command set.

Two things that trivial reader already exercises, which matters for what EPIC-002 can claim:

- **`ambiguous` is reachable without SAN.** `addPromotions` pushes **four** moves with identical
  `from`/`to` and differing `promotion` (`src/moves.ts:88-98`), so any promotion is ambiguous under
  a from/to match. The loop's ambiguity path can be built and tested before EPIC-003 exists.
- **`rejected` is reachable** for any input matching no legal move.

`moves` / `help` / `board` / `quit` are EPIC-003's, and `board` is a render trigger (R5) that
EPIC-002 can honour before the command exists, since it is just "re-emit the current frame".

---

## Seam B — EPIC-004, the engine (no engine exists)

### Contract

**In:** the current position, plus a difficulty / time budget supplied by EPIC-006.

**Out:** one `Move`, drawn from the legal moves of that position (invariant 2 again).

**Bound:** `NFR-004` — ≤ **3 s** at default difficulty, hard ceiling **5 s** at any difficulty,
*"every time"* per EPIC-004's own acceptance. `RISK-002`'s answer is non-negotiable and already
ratified into `plans/nfr-catalog.md`: **the budget is time-based iterative deepening, never a
fixed depth.** The loop can therefore treat "the engine always returns inside the budget" as a
promise it is entitled to rely on — and must still handle the breach (T13) rather than hang.

### Invariants that bind both sides

1. **The seam is asynchronous by contract.** Not because the engine is I/O-bound — it is pure CPU
   — but because the loop must not be written to assume a synchronous return. `NFR-004` permits a
   3-second occupancy; a loop shaped around a synchronous call cannot later accept a yielding or
   worker-based engine without being rewritten.
2. **The position is returned exactly as it was handed over.** The search descends with
   `makeMove`/`unmakeMove` on the live object (`memory-bank/30-architecture.md` `## System
   patterns`), so during `S4` the board *is* mutating. The loop must not read it while the engine
   holds it (settled rule R5), and must rebuild by replay on any exception (R6).
3. **The loop does not know about the opening book.** `EPIC-005` is a short-circuit *behind* this
   seam — its own scope requires *"no discontinuity visible to the player"* when the book runs out.
   If the loop can tell a book move from a searched move, that requirement has already been broken.
   The one visible affordance EPIC-005 asks for — *"display which named opening is being played"* —
   is a status-panel string the seam supplies, not a branch in the loop.
4. **The thinking indicator is a loop state, not an engine callback** (see below).

### The thinking indicator, with no engine — what is settled and what is not

**Settled** (rule R10 + the status-panel note): `engine-thinking` is a state in the loop's own
state map, entered before the engine call and left after it; its row exists in every frame, blank
when not thinking; the state renders correctly against a stub that merely takes time. All of that
is buildable and testable inside EPIC-002 today.

**Not settled, and it is a real constraint on EPIC-004, not a cosmetic choice:** whether the
indicator *updates* during the search. Node is single-threaded. A synchronous search occupies the
event loop for its whole budget, so nothing can animate, no keystroke can be processed, and no
frame can be emitted until it returns. An updating indicator therefore **requires** either (a) the
search to yield to the event loop at least once per deepening iteration — which iterative deepening
makes a natural boundary, and `RISK-002` already forces iterative deepening — or (b) a worker
thread. Both are requirements on EPIC-004's internals that would have to be stated before EPIC-004
is designed, not after. This is on the stop list.

### What the skeleton can stand on today, honestly

A stub returning a move from `legalMoves(position)` — deterministic, or seeded-random, which is the
shape EPIC-004's own acceptance already requires (*"the chosen move is reproducible under a fixed
seed"*). Adding an artificial delay exercises `S4`, the indicator, and rule R5. It is a test seam,
not a design for EPIC-004.

---

## Two adjacent seams the epic's `## Dependencies` does not list

`EPIC-002`'s dependency section names only `EPIC-001`. Mapping the loop turns up two more that are
real, both pointing at **EPIC-006**:

- **Orientation.** The loop cannot render *"oriented to the human's colour"* (acceptance #1)
  without knowing that colour, and colour selection — including `random` — is EPIC-006's startup
  scope. Orientation is an **input** to EPIC-002, not something it can discover. No default is
  needed inside EPIC-002: EPIC-006 always supplies one, by prompt or by flag.
- **The `--ascii` flag surface.** `--ascii` is named in EPIC-002's scope, while argv parsing is
  EPIC-006's (*"via prompt or CLI flags"*). Glyph mode is likewise an input value with EPIC-002
  owning the detection and the precedence (rule R8), and EPIC-006 owning the wiring.

And one type-level seam, already noted: the loop's terminal reason must be a **superset** of
`EndReason` (`src/gameend.ts:28-34`, five values), because EPIC-006 promises six conditions —
the five plus `resignation`.
