---
id: EPIC-003
title: Move input and controls
status: done
column: Done
priority: P0
size: XL
owner: BA/PM
tickets: ABC-010, ABC-031, ABC-032, ABC-033, ABC-034, ABC-035, ABC-036, ABC-037, ABC-038
---

# EPIC-003 — Move input and controls

> **DECOMPOSED 2026-08-12 by BA/PM** (task `post-abc030-2026-08-12`, subtask `refinement-post-abc030`,
> Workflows 07 + 03). Eight tickets cut, `ABC-031`…`ABC-038`, all into `Backlog`. **`ABC-010` was
> already under this epic before the decomposition** (`epic: EPIC-003` in its front matter since
> 2026-07-29) and is **not re-cut** — so this epic was never "undecomposed", it was one ticket in and
> eight short.
>
> **Size corrected `M` → `XL`, and the arithmetic is shown rather than asserted.** The indicative `M`
> (3 points) set at idea-to-epics time is wrong by ~7x: the decomposition comes to **eight new tickets
> totalling 19 points** — `ABC-031` `S`, `ABC-032` `M`, `ABC-033` `S`, `ABC-034` `M`, `ABC-035` `S`,
> `ABC-036` `S`, `ABC-037` `M`, `ABC-038` `S` — **plus `ABC-010` (`M`) = 22 points over nine tickets**.
> `EPIC-002` recorded the identical correction on 2026-07-30 at 23 points over nine tickets, and this
> is the same class of number. **The Orchestrator's no-`XL`-into-dev rule applies to TICKETS, not
> epics** — the largest ticket here is `M`, so the rule is satisfied and there is **no
> `SPLIT_REQUIRED`**. Recording the correction rather than leaving a stale estimate, exactly as
> `EPIC-001` and `EPIC-002` both did.
>
> ## Where the two paragraphs `plans/board.md`'s row has been holding now live
>
> The `EPIC-003` `Backlog` row on `plans/board.md` has carried two paragraphs since `ABC-025`'s `N5`
> ruling hop, to be placed into the `parseSan` ticket **at decomposition** — put there then rather than
> left to a gate, *because a warning owned only by a gate that runs after the work arrives too late*.
> **Both are now on `ABC-032`**, in `## The two paragraphs this ticket was owed`, at the head of that
> page's NFR section:
>
> - **(a) `src/san.nfr.test.ts`'s five `N1` call-count rows will go red on a sanctioned optimisation of
>   `toSan`** — that is `N1` working as specified, and the next engineer's cheapest move is to delete
>   the row. `ABC-032` `A6` forbids the diff and its `## Test notes` 4 names the temptation. **Verified
>   at this hop: `src/san.nfr.test.ts` holds exactly 5 tests, all in one `N1` describe block.**
> - **(b) the lane bar it inherits.** The row says *"inherits `ABC-025`'s RE-DERIVED `N5` wording … and
>   NOT the original wall-clock wording"*. **That is correct in every clause and one generation stale in
>   its name**: `ABC-026` records that the instruction *"now resolves to `N8-LANE`, same clauses,
>   corrected denominator"*. `ABC-032` carries `N8-LANE` by name with the denominator change stated and
>   the wall-clock refusal kept, with its measured reason.
>
> **The `EPIC-003` row's instruction is therefore discharged** and may be retired when that row is next
> written — by the Orchestrator, who owns `plans/board.md`.
>
> ## A THIRD paragraph, found at this hop and routed
>
> `ABC-019` `[D31]` left one question open **by name** — ***does a parser bug end the game?*** — and
> handed it to *"`EPIC-003` and `EPIC-006`"*. **`EPIC-003`'s half is ruled on `ABC-037`**: the prompt
> catches nothing, `ABC-019`'s merged repair-then-rethrow runs, and the crash surfaces as a crash rather
> than as `rejected` or as a clean exit. **`EPIC-006`'s half — what the top-level handler prints and
> what it exits with — is recorded against that epic** so it is not lost a second time.
>
> ## Three rulings made at this decomposition, each because the scope lines needed one
>
> 1. **Case-insensitivity in SAN is a RETRY, not a fold, and a multi-match is `ambiguous`.** Three of
>    this epic's scope lines cannot all hold for SAN — `bxc4` and `Bxc4` are two different legal moves
>    in some positions, so a case-folding parser must guess, which the ambiguity line forbids. `ABC-032`
>    stays case-exact; `ABC-033` owns the folded retry and routes a multi-match to `ambiguous`.
> 2. **This epic owns the move PROMPT SURFACE**, not only the grammars. Tab-completion is a completer on
>    a line reader, so the reader is this epic's (`ABC-037`); `EPIC-006` *extends* that prompt with its
>    own session commands, which is what its own `## Dependencies` already says.
> 3. **`quit` and `claim` each appear in two epics' scope and they do not conflict.** This epic owns the
>    **grammar** — the token, its tolerance, its completion target and the teaching rejection; the other
>    epic owns **the effect** (`EPIC-006` for `quit`'s confirmation and exit, `ABC-021` for `claim`'s
>    terminal transition). One rule, applied twice, rather than two special cases.
>
> ## One acceptance criterion of this epic is REDUCED, and it is flagged for a named human
>
> Criterion **#4** promises that `moves` lists **every** legal move in SAN. **The merged frame cannot
> show that list**: `MESSAGE_ROWS` is 2 (`src/frame.ts:45`), the region is bounded by the panels' width
> (~21 chars in the merged snapshots), and the start position has 20 legal moves — so the region would
> show roughly 9 and append `+11`. The amended promise is **an exact count plus a partial list**, ruled
> and evidenced on `ABC-036`, with the one reversible choice (a pager) named. **It does not block
> ticket cutting or development** — the amended criterion is testable either way. Same posture
> `EPIC-002` `[A1]` took, and for the same reason.
>
> ## `feature:` stays `—` and `plans/features/` stays empty. Ruled, not overlooked.
>
> **No `FEAT-` file is created for this epic.** A feature layer earns its keep only when an epic's
> tickets need an intermediate grouping that changes a decision, and nothing here does: nine tickets,
> each independently valuable, each already tracing to this epic in `plans/traceability.md`. A `FEAT-`
> row would be a value no gate, no board move and no trace query reads — a single-use abstraction
> (coding rule 6) and unrequested flexibility (rule 7). **The `feature:` field is NOT deleted** — it
> stays, and it stays `—`, exactly as `EPIC-001`'s and `EPIC-002`'s 25 delivered tickets left it.
> Revisit only if an epic ever produces two clusters that ship and are accepted separately.

## User value

"Controls should be easy to use" — stated explicitly by the requester. A player who does
not know algebraic notation must still be able to play, and a player who does must not be
forced to type more than they need to.

## Scope

- Dual-format move parser, both always accepted, no mode switch:
  - SAN — `e4`, `Nf3`, `exd5`, `O-O`, `O-O-O`, `Qxf7#`, `e8=Q`
  - Coordinate — `e2e4`, `e7e8q`
- Case-insensitive and decoration-tolerant input (`E2E4`, `e2-e4`, `Nxf3+` without the `+`).
- Ambiguity handling: when input matches more than one legal move, list the candidates and
  re-prompt rather than guessing.
- Rejection messages that teach: name *why* the move is illegal (own king would be in
  check / no piece on that square / that piece cannot move there), never a bare "invalid".
- In-game commands: `moves` (list legal moves), `help`, `board` (redraw), `quit`, **`claim`**.
- ~~Tab-completion of legal moves at the prompt.~~ **DROPPED 2026-10-10** — see the amendment below.

**[AMENDED 2026-10-10 by BA/PM — tab-completion (`ABC-038`) is DROPPED on the owner's word.]** Owner
(Olger Oeselg), 2026-10-10: *"R4: drop it"* — option (b) of the ruling `ABC-038` asked for (note
`.grugops/context/wave-2026-09-25/notes/20261010T105406Z-orchestrator-decision-owner-word-r4-6b2f90e4.md`).
**Why:** the merged prompt (`ABC-037`) is a **line-mode** reader. The terminal holds the line until
Enter, so the program never sees a Tab press, and no completer attached to that reader can run. A
keystroke (raw-mode) reader was judged not worth its size and its terminal-restore risk; it would also
collide with three merged rulings (`ABC-037`'s raw-mode fence, its no-Node-builtin property, and the
frame's single erase-to-end). **The discovery need is covered by `ABC-036`'s `moves` command** (exact
count plus a partial list, `Done`) and by `ABC-033`'s ambiguity candidate list. **All four epic
acceptance criteria hold without it** — `ABC-038` was cut as this epic's named drop-first slice.
The mentions of tab-completion and completion targets in the 2026-08-12 decomposition notes above, and
in `ABC-038`'s sibling pages, are history; none is a live promise. **Size:** the delivered scope is
**20 points** over the eight remaining tickets (22 − `ABC-038`'s `S` 2); the epic stays `XL`.

**[AMENDED 2026-07-31 by BA/PM — `claim` added to the command set.]** `ABC-020` makes threefold
repetition (FIDE 9.2) and the fifty-move rule (FIDE 9.3) **claimable by the player having the move**
rather than applied automatically, which is what the Laws require and what the project owner's
standing legality-first priority of 2026-07-31 demands. A right the player cannot type is not a
right, so the verb belongs in this epic's command set — it is an in-game command at the prompt, the
category this epic already owns.

What this epic owns for it: the **grammar** (the token, its tolerance and case-insensitivity, whether
it takes an argument naming which claim, tab-completion), and the **rejection message that teaches**
when no claim is available — this epic's headline standard, applied to a command rather than to a
move. What it does **not** own: whether a claim is available (`ABC-020`), what happens to the loop
when one is made (`ABC-021`), the status-panel indicator that announces one (`ABC-016`), or the
result screen (`EPIC-006`). Cut this at decomposition; it is not a separate epic and it is small.

## Out of scope

- Arrow-key cursor board navigation — explicitly considered and declined; revisit only if
  play-testing shows the typed interface is a barrier.
- Voice, mouse, or config-file keybindings.

## Acceptance (epic level)

- **Given** the starting position, **when** the player types any of `e4`, `E4`, `e2e4`, or
  `e2-e4`, **then** the same pawn move is played.
- **Given** an input that matches two legal knight moves, **when** it is submitted, **then**
  both candidate moves are listed in SAN and the player is re-prompted; no move is applied.
- **Given** an illegal move, **when** it is submitted, **then** the message names the
  specific reason and the position is unchanged.
- **Given** the `moves` command, **when** it is run, **then** every legal move in the
  position is listed in SAN and the count matches EPIC-001's generator exactly.

**[AMENDED 2026-08-13 by the Orchestrator under the owner's in-session delegation — the ruling and
its limits are in `memory-bank/60-progress.md` § "Standing rulings taken under delegation,
2026-08-13", item 3. That section is the authority; this is the amendment it authorises.]** The
criterion above promises more than the merged frame can deliver, and `ABC-036` refused to smooth it:
`MESSAGE_ROWS` is **2** (`src/frame.ts:45`) against a region bounded to ~21 chars, so at the start
position **~9 of 20 legal moves show and `+11` hides**. The criterion now reads, in two halves:

- **The count clause is UNCHANGED and binds exactly** — the total stated must equal `EPIC-001`'s
  generator for the position, zero tolerance. This is the half that carries the chess correctness,
  and it is fully testable today.
- **The list clause is REDUCED** — a partial list plus that exact total and the frame's existing
  `+N` marker, rather than every move. A pager was considered and **refused as unrequested scope**
  (coding rules 5 and 7): new interaction surface bought to satisfy a sentence, before any human has
  run this program once.

**This is a reduced user-facing promise, recorded as one rather than absorbed.** It is reversible and
the reversal is named: if play-testing under `EPIC-006` shows the truncation is a real barrier, the
pager is the change to make — the same moment `ABC-038`'s escalation trigger fires. *(2026-10-10:
`ABC-038` is dropped, so that trigger has no live page. The pager trigger stands on its own:
play-testing under `EPIC-006` shows the truncation is a real barrier.)*

## Dependencies

- `EPIC-001` — the legal move list is the parser's source of truth.

## Risks

- SAN disambiguation rules (`Nbd2` vs `N1d2`) are fiddly in both directions. Mitigated by
  round-trip testing: generate SAN from a move, parse it back, assert identity.

## NFR triggers

- `NFR-003` Input responsiveness — keystroke echo at the prompt **< 50 ms**; the `moves`
  command ~~and tab-completion~~ returns **< 100 ms**. *(Tab-completion dropped 2026-10-10.
  `plans/nfr-catalog.md`'s `NFR-003` row still names it; re-wording that row is Security/NFR's.)* Architect seeds the row in
  `plans/nfr-catalog.md`.

## Test notes

Round-trip property test over perft positions: for every legal move, `parse(toSAN(move))`
must return that same move. This single test covers most of the disambiguation surface.
