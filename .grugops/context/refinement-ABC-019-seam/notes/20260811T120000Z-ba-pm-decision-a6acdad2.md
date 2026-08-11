---
id: 20260811T120000Z-ba-pm-decision-a6acdad2
kind: decision
by: ba-pm
at: 2026-08-11T12:00:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ADR-0009
  - plans/tickets/ABC-019-turn-loop-skeleton.md
supersedes:
---

# The three rulings the review routed here, and the one that sends `ABC-019` back to `In Development`

> **Hand-authored, and saying so is part of the note.** `scripts/context-io.ts` — the sanctioned
> writer Workflow 16 names — does not exist in this repo or in the kit, and
> `mcp__grugops__propose_note` is not among this session's tools. The recorded precedent for the same
> gap is `.grugops/queue/done/refinement-ABC-019/claim.md`. **Nothing in this hop is a `finding`**: no
> verification stamp is issuable to this role, so no note here claims one. The gate results quoted
> below were re-run by me and are recorded as an `observation`, not as a verified result.

## Ruling 1 — the render seam takes a FOURTH `messages` argument. `[D28]`

**The three-argument form `(GameHistory, GameStatus, thinking) => readonly string[]` was
UNSATISFIABLE against `A5`, and the fourth argument is FORCED by this ticket's own sentences rather
than chosen.** `A5` requires the ambiguity candidate list to reach the frame's message region;
`## Scope` states there is no second output channel. Both read at source.

Every other way out is closed by a sentence already in the ticket:

- the loop **composes no frame** (`## Out of scope`), so it cannot place the items itself;
- the render seam **derives nothing** (`## Scope`), so it cannot invent them;
- there is **no second channel** (`## Scope`), so they cannot go around the frame.

What is left is a fourth argument. **The engineer built it before this hop ruled; the build is right
and the TEXT was wrong.** Amended: the `## Scope` render-seam bullet, the panel-inputs bullet (the
fourth input goes to `assembleFrame`'s message region, **not** to `ABC-016`'s or `ABC-017`'s panel, so
neither panel's contract gains an input), and `[D27]`'s closing sentence *"its arguments do not
change"*, which is now false and is corrected in place.

**Exact replacement wording, `## Scope`:**

> The seam's signature is
> **`(GameHistory, GameStatus, thinking, messages: readonly string[]) => readonly string[]`**: the
> three **panel** inputs of the bullet above, **the message-region items**, and **a frame's rows
> back**.

**Does not change the code.** The delivered `RenderSeam` already has this shape.

### The routing was checked, not inherited — and `ADR-0009` clause 9 is untouched, MEASURED

The Orchestrator routed the signature here rather than re-opening the ADR. I checked the reasoning
rather than accepting it, and it holds: **cl. 9b quotes the signature off this ticket instead of
deciding it** — *"this is not a new seam: it is the seam that ticket already specifies, and clause 9
is the ruling that the count must not cross it"* (`ADR-0009:394-399`, read at source). The signature's
home is `plans/tickets/`; the ruling's home is the ADR.

**Clause 9's actual ruling — the ROW COUNT must not cross the seam — is untouched by a `messages`
argument, and that was measured at this hop rather than asserted.** `layoutMessageRegion` returns
exactly `MESSAGE_ROWS` rows in **every** branch (`src/frame.ts:160-165`; `packRegion` fills a fixed
`MESSAGE_ROWS` array or returns `null`), and `frameHeight` adds `MESSAGE_ROWS + PROMPT_ROWS` as
constants. Re-measured across **0 items, 1 item, `A5`'s own 4 promotion candidates, 200 items and one
100 000-character item**, at geometries **2/5, 4/9, 3/8 and 3/10**:

| geometry | `frameHeight` | distinct assembled heights over all five message cases |
|---|---|---|
| 2 / 5 | 19 | `[19]` |
| 4 / 9 | 25 | `[25]` |
| 3 / 8 | 23 | `[23]` |
| 3 / 10 | 25 | `[25]` |

A single distinct value in every cell, equal to `frameHeight` in every cell. **A `messages` argument
cannot carry a row count, so no clause of clause 9 moves.**

### `ADR-0009` IS owed an Architect/Design follow-up. Stated explicitly, as asked, and it is a TRANSCRIPTION correction — not a re-opening

I was asked to decide this either way rather than leave it unowned. **Yes, it is owed.**

The ADR does not merely mention the signature in passing: at evidence **(vii)** it records an
experiment it **ran** — *"one render seam of the exact signature `ABC-019`'s `## Scope` already
states — `(GameHistory, GameStatus, thinking) => readonly string[]`"* — and cl. **9b** quotes the same
form. Once this ticket says four arguments, a later reader comparing the two documents can reach only
two conclusions: *"the ticket drifted from the ADR"* or *"the ADR's experiment is invalid."* **Both are
wrong**, and distinguishing them requires re-running the invariance measurement above. One sentence in
the ADR prevents that permanently.

**Scope of the follow-up: record that the ticket's seam now takes a fourth `messages` argument, that
the frame's row count is invariant under it (measured), and that no clause 9 ruling moves. Nothing
else. No clause is re-opened.** `memory-bank/50-decisions/` was **not edited by this hop** — routing is
the Orchestrator's.

**One attribution corrected while here.** The sentence *"the seam is not new and its arguments do not
change"* was reported during the build as the ADR's. **It is not** — it is this ticket's own `[D27]`
closing sentence. `grep` for *"argument"* in `ADR-0009` returns two hits and neither is that sentence.
Chasing it in the ADR would have wasted a hop.

## Ruling 2 — `A3b` was wrong about BOTH counts it names, not one. `[D32]`

**Verified before accepting, exactly as the brief required** — an off-by-one in a spy count is also how
a real double-derive hides.

**(a) `gameStatus` is `plies + 1`, and the `+ 1` is load-bearing.** Re-derived at source rather than
taken from the note: `src/turn-loop.ts` has **exactly two** `gameStatusOf` call sites — one before the
loop (transition 1 → 2) and one at the tail of an advancing iteration — so the count is `1 + N` by
construction, and the non-advancing `continue` path skips the tail. A two-derives build reads
`2(N + 1)`, which the corrected clause still catches. **The `+ 1` is not bookkeeping:** a build that
skips it never evaluates the STARTING position, so a game begun from an already-dead position plays a
ply that does not exist — which is precisely the `## Test notes` row 3 trap below.

**(b) `repetitionCounts` reads 0, and demanding *"once per ply"* of it contradicted `A3`.** This is the
half the review did not name. `gameStatusOf` calls `repetitionCounts` **inside** `src/history.ts:152`,
where a module-boundary spy cannot see it. **The only build that would make that spy read once per ply
is one that hand-rolls `gameStatus(position, repetitionCounts(history))` at the call site — which is
exactly what `A3` forbids.** As written, `A3` and `A3b` could not both be satisfied by any build.
**0 is the stronger assertion, not a weakened one:** it is the proof that every derive went through the
`ADR-0002` clause-4 single supplier.

**Exact replacement wording:**

> **`A3b` — Given** any complete run of `N` plies, **when** `gameStatus` and `repetitionCounts` are
> **spied at the module boundary**, **then** both of these hold: **(a)** `gameStatus` is called
> **exactly `N + 1`** times — **one** evaluation before the first frame (transition 1 → 2, which the
> machine mandates *"always, terminal or not"*) and **exactly one after each applied ply** — and
> **exactly zero** additional times on any non-advancing prompt outcome, so a run with `k`
> non-advancing outcomes still reads `N + 1`; and **(b)** `repetitionCounts` is called **exactly 0**
> times.

**Does not change the code.** Both delivered suites already assert `plies + 1` and `repetitionCounts`
at 0. `A3`'s order clause is clarified alongside it, because *"derive counts"* named a middle step no
spy can see on a correct build — the same observability gap.

## Ruling 3 — NEITHER `## Scope` nor `A14` is wrong: one sentence was carrying two promises. `[D31]`

**This is the ruling that changes the code.**

The engineer's framing was *"a symmetric handler would need a tenth `A14` value that does not exist."*
That is true of symmetric **TERMINATION** and false of symmetric **REPAIR** — and the `## Scope`
sentence only ever promised repair (*"the position is rebuilt by replay"*). `A9`, which adds the named
reason, names the engine seam and nothing else. So the answer is neither *"narrow the sentence"* nor
*"add a tenth value"*: it is to stop one sentence promising two different things.

**The input-side corruption is real, and I verified the mechanism at source rather than reasoning by
symmetry:** the input seam calls `legalMoves(history.position)` (the delivered coordinate stub does it
at `src/turn-loop.test.ts:136`, and `EPIC-003`'s parser must do the same to reject an illegal move),
and `legalMoves` runs `makeMove` / `unmakeMove` **on the live borrowed object**
(`src/legal.ts:47-51`; `GameHistory.position` is *"BORROWED, never a snapshot"*,
`src/history.ts:39-44`). **The ticket already states this in writing in a second place** —
`## Security / NFR triggers`: *"the loop suspends at exactly two places … and both bracket a
mutation."* Narrowing the Scope sentence would leave that true statement standing over an unhandled
path.

**Why RETHROW rather than a tenth reason** — the cheaper option is also the more honest one:

- `[D13]` fought to make `A14` an exact enumeration, and a tenth value would additionally decide a
  question no epic has answered — *does a parser bug end the game?* That is `EPIC-003`'s and
  `EPIC-006`'s, not a skeleton's.
- **Terminating QUIETLY is the one option that is definitely wrong:** with no result and no reason the
  outcome is byte-identical to `A8`'s end-of-input, presenting a crashed parser as a clean exit — the
  exact failure `A10`'s *"a result screen can never present an engine bug as a chess outcome"* forbids.

**Exact replacement wording — `## Scope`, added under the `takeBack(history, 0)` bullet:**

> **REPAIR is symmetric across both seams. TERMINATING WITH A NAMED REASON is the ENGINE seam's
> alone.** After the repair the two seams part company, and this is the whole of the split:
> - **engine seam** — repair, then **stop** with `engine-threw` (`A9`), a value `A14` enumerates;
> - **input seam** — repair, then **RETHROW**. The loop invents no reason, reports no result and does
>   **not** exit 0 down the end-of-input path. The exception is `EPIC-003`'s to own and `EPIC-006`'s to
>   catch; what this loop owes is that **nobody downstream is ever handed a mid-mutation board**
>   (`A9b`).

**New criterion, in full:**

> **`A9b` — Given** the **input** seam throws **from inside a `makeMove`/`unmakeMove` bracket** — the
> shape `legalMoves` produces, and the shape a real parser produces when it filters candidates — so
> that the live object is left one ply ahead, **when** the loop recovers, **then** all three hold:
> **(i)** `toFen(position)` equals `toFen` of the position replayed from `{ initialFen, moves }` and
> `moves.length` is unchanged, exactly as `A9` requires of the engine side; **(ii)** the exception
> **propagates out of the loop** — the caller sees it thrown; and **(iii)** the loop returns **no**
> `LoopOutcome` at all, so it can never be mistaken for `A8`'s end-of-input (which returns
> `{ result: null, reason: null, exitCode: 0 }`) and **no new terminal-reason value is introduced** —
> `A14`'s enumeration is unchanged and is asserted unchanged.

**`A14` IS NOT AMENDED.** Its ten values stand exactly as `[D13]` enumerated them. Test-note **row 14**
added for the same fixture shape `A9`'s mid-bracket throwing stub already provides.

**CODE CHANGE OWED, for the Engineer:** the delivered loop wraps the engine `await` and not the input
`await` (`src/turn-loop.ts`, the `if (humanToMove)` branch). One `try`/`catch` that calls
`takeBack(history, 0)` and re-`throw`s, plus one test row. **No new module, no new import, no new
reason value, no signature change.** `src/` was **not** touched by this hop — code is the Engineer's.

## Board move REQUESTED, not taken

**`ABC-019`: `In Review` → `In Development`**, for `A9b` and row 14 only. `plans/board.md` was not
opened. **A ticket returning to `In Development` on a ruling is a working board, not a failed one** —
this board did it on `ABC-009` and was right to. The other eight rulings are text-only and the
delivered build already satisfies them.

**Also still owed on that row, carried from two previous hops and restated rather than left to decay:**
`blocked-until: ABC-012, ABC-014, ABC-018` and `merge-order: after ABC-020` are stale on all four.

## Size and priority — RE-DERIVED, BOTH UNMOVED

**Size `L` (5). Not `XL`. No `SPLIT_REQUIRED`.** Eight of the nine rulings are text-only and cost
nothing. `A9b` costs: one `try`/`catch` around an existing `await`, reusing the `takeBack(history, 0)`
call the engine path already makes; one row in the existing table-driven test file. **No new test
FILE, so `N8-LANE`'s binding risk — the file count — does not move** (the delivered lane's chargeable
figure is 420 ms against a 650 ms allowance, 0.65x, with two files added; this hop adds none).
**Risk goes DOWN:** `A9b` closes a corruption path the ticket promised in prose and never asserted.
**`XL` is still exactly one thing away and nothing was folded in** — `ABC-021`'s claim outcome,
`ABC-018`'s frame output, `ABC-012`'s history module all still out.

**Priority `P0`, unmoved.** No ruling changed the value of the component; only the text's fidelity to
it. It is still the only component touching the renderer, the rules core, the history, the input seam
and the engine seam at once.
