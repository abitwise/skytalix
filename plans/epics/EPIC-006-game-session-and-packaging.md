---
id: EPIC-006
title: Game session and packaging
status: backlog
column: Backlog
priority: P1
size: L
owner: BA/PM
---

# EPIC-006 — Game session and packaging

> **PRIORITY RAISED `P2` → `P1` on 2026-08-12 by BA/PM** (task `post-abc030-2026-08-12`, subtask
> `refinement-post-abc030`, Workflow 07). **NOT DECOMPOSED at that hop, deliberately — see
> `## Why this epic was not decomposed on 2026-08-12` below.** The board row is the Orchestrator's to
> place; this file is the authority for the epic's own priority.
>
> ## Why `P2` is the wrong tier, measured rather than argued
>
> **`P2` on this board is the drop-first tier.** That is not an inference — it is written into
> `ABC-017`'s row and stated outright in `ABC-021`'s priority rationale (*"`P2` on this board is the
> drop-first tier (`ABC-017`)"*). **This epic is the one epic that cannot be dropped without the
> product ceasing to exist**, so by this board's own working definition of the tier it cannot be `P2`.
>
> Four facts, each measured on `main` at `43d5a9d` on 2026-08-12 by reading the import graph, not by
> reasoning about it:
>
> ```
> src/status-panel.ts   production importers: 0   (only *.test.ts import it)
> src/history-pane.ts   production importers: 0   (only *.test.ts import it)
> src/render.ts         production importers: 2, BOTH `import type { GlyphMode }`
>                       (src/frame.ts:42, src/glyph-mode.ts:42) -> renderBoard has 0 runtime consumers
> src/turn-loop.ts      production importers: 0   (only *.test.ts import it)
> ```
>
> **Four of this project's seventeen production modules are reachable only from test files, and they
> are the entire user-visible surface of a `P0` `XL` epic that is otherwise nine-ninths delivered.**
> The wiring that would reach them is the **render-seam closure**, and `ADR-0009` clause 9b together
> with `ABC-019` `[D30]` puts that closure **here**: *"`EPIC-006` binds the mode into the seam closure
> exactly as it binds it into `renderBoard` and `assembleFrame`"*. `AGENTS.md` records the consequence
> in one line — `Dev / run: UNKNOWN - verify`, *"no CLI entry point until EPIC-006"*.
>
> **So a `P2` epic currently gates the visible outcome of two `P0` epics.** That is a priority
> inversion, it is measurable, and `P1` is the honest tier. It is **not** `P0`: nothing is broken, no
> user is affected today because there is no user surface at all, and `EPIC-003`'s `P0` work is a
> genuine precondition for the session commands this epic types into.
>
> **What this does NOT mean, said plainly so it is not over-read.** `EPIC-002` is honestly complete
> after `ABC-021`, and no gap in it is being claimed: that epic's own `## Test notes` require the frame
> to be *"producible and assertable as a value, with no TTY attached"*, which is exactly what was
> delivered and what `src/frame.test.ts` proves. The composition into a live session was always this
> epic's. Nothing above re-opens a `Done` ticket, and nothing above is a defect.
>
> ## Why this epic was not decomposed on 2026-08-12
>
> One epic was decomposed at that hop and it was `EPIC-003`, for three reasons stated on that epic's
> page. The reason **against** decomposing this one is specific and it is not "we ran out of time":
>
> - **Its packaging tickets depend on a decision this epic itself is reserved to make.** `AGENTS.md`
>   § Deployment posture and `ADR-0007` both say it outright: *"How the CLI will eventually be
>   distributed — npm, a binary, a `git clone` — is undecided, and `EPIC-006` decides it. **Do not fill
>   that in.**"* Cutting `npx`-shaped tickets before that decision produces tickets that fail the
>   Definition of Ready on *dependencies known* and *no major unresolved blocker* — smoothing, which
>   this board refuses.
> - **Its difficulty and `undo`-of-the-engine-reply criteria need `EPIC-004`**, which is undecomposed
>   and whose own first ticket must be `RISK-002`'s timeboxed spike (`NFR-005`'s depth-7 level is
>   `PROVISIONAL` pending measurement on non-M3 hardware).
>
> **What IS cuttable here today, named in prose so the next hop does not re-derive it** (no IDs are
> allocated — the next free ID after 2026-08-12 is `ABC-039`):
>
> 1. **The render-seam closure** — compose `renderBoard` + `ABC-016`'s status panel + `ABC-017`'s
>    history pane into `assembleFrame` and hand `runTurnLoop` a `RenderSeam` that returns the frame's
>    rows. Every input is merged; `ADR-0009` clause 9b already specifies the shape and clause 9
>    forbids the loop declaring a height. **This is the single highest-value ticket on the board that
>    nobody has cut**, and it is buildable today.
> 2. **The entry point and argv** — colour (white/black/**random resolved before the loop sees it**,
>    `ABC-019` `[D24]`), `--ascii` / `--unicode` bound into the seam closure, and the top-level handler
>    that catches a rethrown parser bug. **`EPIC-006`'s half of `ABC-019` `[D31]`'s open question —
>    *does a parser bug end the game?* — belongs to that ticket**: `EPIC-003`'s half is ruled on
>    `ABC-037` (the prompt catches nothing), and what the top-level handler prints and exits with is
>    still owed here. **Recorded so it is not lost a second time.**
> 3. **The result screen**, whose reason count this epic's 2026-07-31 amendment says to *"settle at
>    decomposition, against `ABC-020`'s shipped reason set"* — `ABC-020` is merged, so that is now a
>    read rather than a decision.
>
> **What is NOT cuttable until `EPIC-004` exists:** difficulty levels, and `undo`'s "takes back the
> human move *and* the engine reply" as a single step at a chosen difficulty. **What is not cuttable
> until a human decides:** packaging and distribution.

## DECOMPOSED 2026-08-13 — the runnable half, `ABC-041`…`ABC-046`

> Cut by BA/PM at task `epic006-2026-08-13`, subtask `epic-to-tickets-EPIC-006`, Workflow 03. **Six
> tickets, 13 points. The three named in prose above are cut; two more were found while cutting them;
> `undo`, difficulty and all packaging are NOT cut and the reasons are below.**

| ticket | title | size | pri | Definition of Ready |
|---|---|---|---|---|
| `ABC-041` | The render-seam closure | `S` | `P0` | **10/10 MET** — nothing it needs is open |
| `ABC-042` | **The entry point, argv and the first frame — THE THIN SLICE** | `M` | `P0` | 8/10 ⚠️×2 — waits on `ABC-041` only |
| `ABC-043` | The live session, and `[D31]`'s top-level handler | `M` | `P0` | 7/10 ⚠️×3 — `ABC-037` open, **no `EngineSeam` exists** |
| `ABC-044` | The result screen — the count settled at **eight** | `S` | `P1` | 8/10 ⚠️×2 — waits on `ABC-043` |
| `ABC-045` | `resign` | `XS` | `P1` | 8/10 ⚠️×2 — ordering only |
| `ABC-046` | `quit` + `new` — no arm in the merged loop | `S` | `P2` | 7/10 ⚠️×3 — **blocked by a RULING**, not an ordering |

**Size corrected `M` → `L`.** The indicative `M` (3 points) is wrong by ~4x: six tickets at 13 points
(`S`+`M`+`M`+`S`+`XS`+`S`), and that is only the runnable half — packaging, difficulty and `undo` are
still uncut. It will likely reach `XL` once distribution is decided; unwritten tickets are not sized
here. **The no-`XL`-into-dev rule binds TICKETS: the largest here is `M`, so there is no
`SPLIT_REQUIRED`.**

**The thin slice is `ABC-042`, and what it delivers is a BOARD, not a GAME.** It is the single ticket
after which `npm run <name>` puts a chess position on a human's screen and exits 0 — which fills
`AGENTS.md`'s `Dev / run: UNKNOWN - verify`, gives 25 tickets' deferred UAT a destination and gives
`Escaped defects` a detector. **It cannot make a move playable**, because the production `InputSeam` is
`ABC-037` (`EPIC-003`, open) and no `EngineSeam` implementation exists anywhere. `ABC-043` is the
playable ticket and it is blocked on both.

### `ABC-019` `[D31]`'s second half — DISCHARGED, on `ABC-043`

*Does a parser bug end the game?* `EPIC-003`'s half was ruled on `ABC-037` (the prompt catches
nothing; the merged repair-then-rethrow runs). **`EPIC-006`'s half is ruled on `ABC-043`: it ends the
game, loudly, as an internal error that names no chess result, and the process exits NON-ZERO.** The
product-wide exit-code rule that follows from it — *0 means the process did what it was asked;
non-zero means it could not* — is on that ticket. **This question is owed by nobody after this hop.**

### The reason count — SETTLED at EIGHT, as this epic's 2026-07-31 amendment instructed

Read off merged `ABC-020` and `ABC-019` rather than decided: **five automatic `EndReason` values**
(checkmate, stalemate, insufficient material, fivefold repetition 9.6.1, seventy-five-move 9.6.2),
**two claimed draws** (threefold 9.2, fifty-move 9.3), and **resignation** = **eight**. Plus **two
values that are not chess outcomes at all** and must never be shown as one — `engine-failure` and
`engine-threw` — and **one path that gets no screen**: end of input. The full table is on `ABC-044`.
**No ninth reason exists**: a draw-offer command is in no epic's scope and none is cut.

### What was NOT cut, and why — each with its owner

1. **Packaging and distribution — RESERVED, and this hop did not touch it.** `ADR-0007` and
   `AGENTS.md` § Deployment posture: *"How the CLI will eventually be distributed — npm, a binary, a
   `git clone` — is undecided, and `EPIC-006` decides it. Do not fill that in."* **A human decides.**
   `ABC-042` `A10` is the mechanical fence: `package.json` gains exactly one `scripts` key and **no**
   `bin`, `main`, `files`, `publishConfig` or `dependencies` key, and `private` stays `true`, asserted
   key by key. **Epic acceptance criterion #1 (`npx <package>`) is therefore NOT met by this
   decomposition and cannot be met by any ticket until that decision lands.**
2. **`undo` — needs `EPIC-004`.** Its criterion is *"takes back the human move **and** the engine
   reply"*: there is no engine reply to take back. The architecture audit already answers the epic's
   `## Risks` — undo is one operation on one list, so the predicted repetition-history corruption is
   **structurally absent** — and `ABC-046` `A4` proves that on `new`, the one reset command that is
   reachable today. **Owner: `EPIC-004`'s decomposition.**
3. **Difficulty levels — need `EPIC-004`**, whose own first ticket must be `RISK-002`'s timeboxed
   spike (`NFR-005`'s depth-7 level is `PROVISIONAL`). **Epic acceptance criterion #4
   (`--colour black --difficulty 3`) is NOT met**: `--difficulty` is an unrecognised argument today
   and `ABC-042` `A6` rejects it with a usage message rather than pretending.
4. **Save / resume and PGN export — the epic's own negotiable slice**, and nothing has play-tested
   anything. Not cut, correctly.
5. **Any change to `src/turn-loop.ts`.** Every seam this epic needs is already published on it. If
   `ABC-046`'s ruling goes the way that requires a new arm, **that is its own ticket** and it is
   Architect/Design's.

### The lane budget these six tickets spend — stated, not assumed

**3 to 4 new test files** across all six (`ABC-041` 1, `ABC-042` 1, `ABC-043` 0, `ABC-044` 1,
`ABC-045` 0, `ABC-046` 0–1); three of the six deliberately add **none**, by extending the file whose
module they change. **`EPIC-003`'s eight tickets imply 7–8.** Against `ABC-026`'s published
post-`pool: "threads"` figures — **3.455 s of CPU headroom, ~10 files at the all-in mix, ~25 at the
floor-only ceiling** — the two epics together are **10–12 files**: they fit at the best case with
~45 ms of margin and are **~0.6 s over the 13 s CPU clause at the worst case**. Restated by arithmetic
from `plans/nfr-catalog.md`; **nothing was re-measured.** The full working, the levers and the
file-weight caveat are in `.grugops/context/epic-to-tickets-EPIC-006/notes/`.

## User value

The difference between a demo and a game people actually play: you can start one in
seconds, take back the move you fat-fingered, resign a lost position, and see a real
result screen at the end.

## Scope

- Startup: choose colour (white/black/random) and difficulty, via prompt or CLI flags.
- Session commands: `undo` (takes back the human move *and* the engine reply, as one step),
  `resign`, `new`, `quit` with confirmation.
- Game-end screen: result, reason (checkmate / stalemate / repetition / fifty-move /
  insufficient material / resignation), and the full move list.

  **[AMENDED 2026-07-31 by BA/PM — the reason set is wider than six, and the exact count is settled
  at this epic's decomposition.]** `ABC-020` splits two of the six above and adds two more, because
  FIDE distinguishes a draw the player *claims* from one that arrives automatically:
  *repetition* becomes **threefold, claimed** (9.2) and **fivefold, automatic** (9.6.1);
  *fifty-move* becomes **fifty-move, claimed** (9.3) and **75-move, automatic** (9.6.2).
  With checkmate, stalemate, insufficient material and resignation that is **eight** distinct
  reasons, not six. The result screen must name which one, and a screen that says "draw by
  repetition" without saying whether anyone claimed it is under-reporting what happened in the game.

  The acceptance criterion below is left reading "any of the six terminal conditions" **deliberately
  unamended**: what it actually tests — that the reason is named explicitly and the process exits 0 —
  is unchanged and still testable, and replacing "six" with a number this epic has not yet decomposed
  would be trading a stale count for a guessed one. QE recorded the count as unsettled for a second
  reason as well (`20260731T153200Z-qe-e2e-claim-aab64fc7` §4): a draw-offer command would add a
  ninth, and this product has none today. **Settle the count at decomposition, against `ABC-020`'s
  shipped reason set.**

  **[SETTLED 2026-08-13 by BA/PM at this epic's decomposition. It is EIGHT.]** The acceptance
  criterion below is amended from *"six"* to *"eight"* — see `## Acceptance (epic level)` and the
  enumerated table on `ABC-044`. QE's ninth-reason condition is checked and does **not** hold: no draw
  offer is in any epic's scope and none is cut, so eight stands until one is.
- Packaging: runs from a `git clone` via `npm install` + `npm run chess`, with no published package,
  no built artifact and no global dependency beyond `git` and Node `>=22`. **[REPAIRED 2026-09-19 by
  Architect/Design at `ABC-100` on the owner's word — was *"runs via `npx` with no install step"*;
  the channel is ruled in `ADR-0018`, "for now".]**

## Out of scope

- Network or multiplayer play — permanent non-goal.
- Accounts, cloud sync, ratings, or a stored game history database.
- A GUI or web front end — permanent non-goal.

## Negotiable slice

Save/resume to a local file and PGN export are **negotiable**, not MVP. They are worth
building only if play-testing shows people abandon games mid-way. Cut them first if this
epic runs long.

## Acceptance (epic level)

- **Given** `git clone` of this repository on a machine with `git` and Node `>=22` installed and
  nothing else, **when** `npm install` and then `npm run chess` are run in the clone, **then** a
  playable game starts with no further install step. **[REPAIRED 2026-09-19 by Architect/Design at
  `ABC-100` on the owner's word — was *"Given `npx <package>` … no additional install step"*; the
  channel is ruled in `ADR-0018`. The script is `chess`, not `start`: `package.json` has no `start`
  script and `ABC-100` `A6` forbade adding one.]**
- **Given** a completed engine reply, **when** the player runs `undo`, **then** the position
  returns to before the player's own last move — two plies back, one command.
- **Given** any of the **eight** terminal conditions, **when** the game ends, **then** the result
  screen names the reason explicitly — **including whether a draw was claimed or automatic** — and
  the process exits cleanly with code 0.

  **[AMENDED 2026-08-13 by BA/PM at this epic's decomposition, which is exactly where the 2026-07-31
  amendment said to settle it — `"six"` → `"eight"`, against `ABC-020`'s shipped set.]** The eight are
  enumerated on `ABC-044`, read off merged `src/gameend.ts` and `src/turn-loop.ts`. **Two further
  values, `engine-failure` and `engine-threw`, are NOT terminal conditions and this criterion does not
  cover them**: `ABC-019` `A10` forbids a result screen presenting a bug as a chess outcome, and
  `ABC-044` `A3` is where that is tested. **End of input produces no screen at all** and exits 0
  (`ABC-019` `A8`).
- **Given** `--colour black --difficulty 3`, **when** the game starts, **then** no prompts
  appear and the engine opens as white.

## Dependencies

- `EPIC-001` (terminal states, undo of position state), `EPIC-002` (the loop it wraps),
  `EPIC-003` (the command prompt it extends).

## Risks

- Undo interacts with the engine's transposition table and the book's position history;
  a shallow undo that forgets repetition history would corrupt draw detection.

## NFR triggers

- `NFR-007` Cold-start time — `npm run chess` on a completed clone (after `npm install`) to first
  rendered board in **< 2 s**. Architect seeds the row in `plans/nfr-catalog.md`. **[REPAIRED
  2026-09-19 by Architect/Design at `ABC-100` — was *"`npx` invocation … with a warm npm cache"*;
  the bar is unchanged, the denominator follows `ADR-0018` Decision 4.]**

## Test notes

End-to-end test that drives a scripted game from `npm run chess` invocation on a completed clone to a
checkmate result screen through the real stdin/stdout interface. **[REPAIRED 2026-09-19 by
Architect/Design at `ABC-100` — was *"from `npx` invocation"*; `ADR-0018`.]** Undo test must assert the repetition
history is rewound too, not just the board.
