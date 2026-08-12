---
id: 20260812T190000Z-architect-design-claim-forward-fit-epic003-004-006-2d94ca58
kind: claim
by: architect-design
at: 2026-08-12T19:00:00Z
verified_by:
confidence: medium
refs:
  - arch-audit-2026-08-12
  - EPIC-003
  - EPIC-004
  - EPIC-006
  - ADR-0002
  - ADR-0003
  - ADR-0004
  - ADR-0005
supersedes:
---

# Forward-fit: what seam each undecomposed epic needs, and which of them do not exist

> **Hand-authored, not a `finding`.** `confidence: medium` — the seams that EXIST are measured from
> source; the judgements about what each epic will NEED are design opinion and are marked where they
> are. **No ticket is cut here and no ID is allocated** — `ABC-031`+ is BA/PM's this hop. Anything
> below that implies work is described in prose for someone else to cut.

## `EPIC-003` — dual-format parser, in-game commands, tab-completion (P0)

**Seam needed: `parseSan`. It already exists as a reserved contract and its home is already ruled.**

`ADR-0004` clause 2 fixes the signature and the three outcomes
(`move` / `ambiguous` / `candidates` / `rejected`), and `src/san.ts`'s own header says
*"`parseSan` is `EPIC-003`'s and is added to THIS file, over these same tables — one grammar, both
directions. Nothing here forecloses it."* Today `san.ts` exports **only `toSan`**. **So the seam is
half-built by design, not missing.**

**What does NOT exist and is the epic's real structural question: nothing reads stdin.**
`turn-loop.ts` declares `InputSeam = (history) => Promise<PromptOutcome>` and its header states the
stubs live in the test file *deliberately* — *"a `src/` stub module would be production code that is
dead the day the real parser lands"* (`ADR-0009` clause 9c). **`EPIC-003` supplies the first real
implementation of that seam, and the loop needs no change to accept it.** `PromptOutcome` already
carries `rejected`, `ambiguous`, `command` and `game-over`, so the four non-advancing outcomes the
epic needs are already in the type.

**Tab-completion is the one item with no seam at all.** It needs a line-editor / readline layer that
nothing in `src/` has and that `turn-loop.ts` deliberately does not own (it *"never reads stdin
itself"*). **That is a new module, and it belongs beside the input seam implementation, below the
loop.** *(Design opinion, not measured.)*

**Cost note for whoever cuts it:** `legalMoves` is **2.1–5.4 µs** per call, ~19,000x under
`NFR-003`'s 100 ms budget for the `moves` command (`ADR-0003`), so the `moves` command and completion
can call the generator freely. **No performance seam is owed.**

## `EPIC-004` — search engine and AI opponent (P0, size L)

**It fits the current `position`/`apply`/`undo` shape. That question is already answered on the
record and I did not re-run the argument.**

- `ADR-0003` ratified **keep make/test/unmake** and re-derived the target as **depth-in-budget**
  (depth 6 FAIL floor, depth 7 WARN, provisional on non-M3 hardware). `legal.ts:47-51` is unchanged
  and is the search's inner loop.
- `ADR-0003` clause 3 pre-orders the escape hatches **if** the floor is missed on target hardware:
  **(c1) pseudo-legal search — zero change to `legal.ts`, measured 2.6–5.1x**, then (c2) lazy
  legality behind the unchanged signature, then (b) pin-aware last. **The ADR authorizes none of
  them**, which is exactly right: the choice is pre-made but not pre-spent.
- `ADR-0002` clause 3 already rules that the search keeps **its own preallocated per-ply key array**,
  seeded once per search, and does **not** share the session's structure. `gameStatus`'s
  `positionCounts` parameter stays optional precisely so a bare `gameStatus(position)` at a search
  leaf is legitimate.
- `ABC-008`'s conclusion, read rather than re-argued: **GO WITH CONSTRAINT — the per-move budget must
  be time-based iterative deepening, never a fixed depth.** Its 500k nodes/sec target was
  **RETIRED** on 2026-07-30 because the spike ran no legality filtering and never measured this code.
  `npm run spike:perft` still exists and is `spike/`, not production.

**The one seam that genuinely does not exist: an incrementally-updated Zobrist key.** Measured:
`zobristKey` is a **full 128-square scan** allocating `bigint`s, ~**295–304 ns**, and on positions
with an ep square it calls into `legal.ts` → `apply.ts` and **plays a move**. A transposition table
wants a key at **every node**, and `ADR-0005` names this consequence itself — *"`EPIC-004`'s
transposition table computing a key **per node** … changes both the module graph and the search's
per-node cost."* **This is a known, recorded, priced consequence and not a defect**, but it is the
seam `EPIC-004` will have to build (XOR-update on make/unmake) and **it is the one place the current
shape does not simply extend.** *(Design opinion on the remedy; the cost figures are ADR-0005's.)*

**A second, sharper constraint is already on record and should be read before any parallel-search
design:** because `zobristKey` transiently mutates, you **cannot hash a `Position` from two threads
at once**. `ADR-0005` records this as foreclosing one shape of parallel search and marks
`EPIC-004`'s threading decision **`UNKNOWN - verify`** (its `F6` falsifier). **Whoever decomposes
`EPIC-004` should make the threading decision explicitly rather than discover it.**

## `EPIC-006` — game session, CLI entry point, packaging (P2)

**Where the entry point attaches: NOT `turn-loop.ts`, and not a change to it.**

`turn-loop.ts` is already a library function — `runTurnLoop(options)` — that takes `history`,
`humanColour` (a **resolved** colour; its header says *"`EPIC-006`'s startup offers white / black /
random and resolves `random` before the loop sees it"*), `render`, `input`, `engine` and `sink` as
injected options. **It is the composition TARGET, not the composition ROOT.** Making it the entry
point would make a printing module out of the one module that currently owns no I/O.

**The entry point is a NEW module whose only job is composition**, and everything it must wire
already exists as a seam:

| it supplies | to | exists? |
|---|---|---|
| `process.stdout` as `FrameSink` | `runTurnLoop` | seam exists (`frame.ts`) |
| a `RenderSeam` composing `render` + `status-panel` + `history-pane` via `assembleFrame` | `runTurnLoop` | all four exist; **nothing imports a renderer today**, so this is the first composition |
| `EPIC-003`'s parser as `InputSeam` | `runTurnLoop` | type exists, impl is `EPIC-003`'s |
| `EPIC-004`'s search as `EngineSeam` | `runTurnLoop` | type exists, impl is `EPIC-004`'s |
| the anchor `GameHistory` | `runTurnLoop` | `history.ts` exists |
| the resolved colour, difficulty, flags | `runTurnLoop` | **new — nothing parses argv today** |

**It should land FLAT in `src/`, not in `src/cli/`** — see the stdout note: a subdirectory trips
`ADR-0011` clause 1's known enumeration/specifier gap, and flat costs nothing. *(Recommendation.)*

**`undo` is the epic's real risk and the architecture already answers it.** `EPIC-006`'s own risk
says a shallow undo *"that forgets repetition history would corrupt draw detection"*. `ADR-0002`'s
binding contract is the answer: **undo is one operation on one list** — dropping two entries from the
move list rewinds the position, the keys and the repetition counts together, because all three are
derived by replay. `turn-loop.ts` already imports `takeBack`. **There is no second thing to remember
to rewind, so the predicted bug is structurally absent.** The `undo`-two-plies-as-one-step behaviour
is a loop/command concern, not a state concern.

**Two things `EPIC-006` still owes that no ADR covers:** the terminal-reason count (its scope note
says the six in the acceptance criterion is really **eight** after `ABC-020`, *"settle the count at
decomposition"*), and how the CLI is distributed — npm, binary or clone — which `ADR-0007`
explicitly leaves **UNDECIDED** and assigns here.
