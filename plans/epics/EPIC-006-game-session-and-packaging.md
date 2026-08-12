---
id: EPIC-006
title: Game session and packaging
status: backlog
column: Backlog
priority: P1
size: M
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
- Packaging: runs via `npx` with no install step and no global dependency.

## Out of scope

- Network or multiplayer play — permanent non-goal.
- Accounts, cloud sync, ratings, or a stored game history database.
- A GUI or web front end — permanent non-goal.

## Negotiable slice

Save/resume to a local file and PGN export are **negotiable**, not MVP. They are worth
building only if play-testing shows people abandon games mid-way. Cut them first if this
epic runs long.

## Acceptance (epic level)

- **Given** `npx <package>` on a machine with Node installed and nothing else, **when** it
  is run, **then** a playable game starts with no additional install step.
- **Given** a completed engine reply, **when** the player runs `undo`, **then** the position
  returns to before the player's own last move — two plies back, one command.
- **Given** any of the six terminal conditions, **when** the game ends, **then** the result
  screen names the reason explicitly and the process exits cleanly with code 0.
- **Given** `--colour black --difficulty 3`, **when** the game starts, **then** no prompts
  appear and the engine opens as white.

## Dependencies

- `EPIC-001` (terminal states, undo of position state), `EPIC-002` (the loop it wraps),
  `EPIC-003` (the command prompt it extends).

## Risks

- Undo interacts with the engine's transposition table and the book's position history;
  a shallow undo that forgets repetition history would corrupt draw detection.

## NFR triggers

- `NFR-007` Cold-start time — `npx` invocation to first rendered board in **< 2 s** with a
  warm npm cache. Architect seeds the row in `plans/nfr-catalog.md`.

## Test notes

End-to-end test that drives a scripted game from `npx` invocation to a checkmate result
screen through the real stdin/stdout interface. Undo test must assert the repetition
history is rewound too, not just the board.
