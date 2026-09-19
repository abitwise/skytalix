---
id: ABC-034
title: Rejections that teach — a closed reason set, computed from the generator, never a bare "invalid"
status: backlog
column: Backlog
size: M
priority: P0
epic: EPIC-003
feature: —
---

# ABC-034 — the rejection names WHY, and "why" is computed rather than guessed

> **Cut 2026-08-12 by BA/PM** (task `post-abc030-2026-08-12`, subtask `refinement-post-abc030`,
> Workflow 03) at `EPIC-003`'s decomposition.

## Problem

*User*: the beginner, who is the reason this epic exists. `EPIC-003`'s user value opens with
*"controls should be easy to use"* and its third acceptance criterion is *"given an illegal move, the
message names the specific reason and the position is unchanged"*.

*Pain*: `ABC-032` ships the **floor** `ADR-0004` (2a) requires — *not SAN I can read* vs *well-formed
SAN naming no legal move here* — and that floor is exactly the bare rejection this epic forbids. A
player who types `Nf3` when the knight is pinned learns only that it was not accepted; they cannot
tell a typo from a rule they did not know.

*Value*: this is the single ticket where the epic's headline standard becomes a property of the code
rather than a sentence in a document. It is also the only place a player can learn the rules of chess
from this product, which is what makes it worth more than its size.

## Scope

**A classifier and its message set**, over the existing `rejected` arm.

- **A closed reason set**, extending `ABC-032`'s `SanRejectReason` vocabulary. `ADR-0004` (2a)
  explicitly permits this without an ADR change: *"widening the outcome set from three is an ADR
  change; widening the reason set is not."* The classes:

  | code | means | how it is COMPUTED, not guessed |
  |---|---|---|
  | `unreadable` | neither grammar can read the text | both resolvers rejected on grammar |
  | `empty-square` | no piece on the named origin square | `position.board[from] === EMPTY` |
  | `not-your-piece` | the piece there is the other side's | colour of `position.board[from]` vs side to move |
  | `piece-cannot-reach` | that piece cannot move there at all | the move is **not** in `generateMoves(position)` |
  | `own-king-exposed` | the move is legal-looking but leaves your own king in check | the move **is** in `generateMoves(position)` and **is not** in `legalMoves(position)` |
  | `must-address-check` | the same, while already in check | `own-king-exposed` **and** `isInCheck(position)` |
  | `no-legal-move-named` | well-formed SAN naming no move in this position at all | no `from` square is derivable |

- **The IMPOSSIBLE PROMOTION `e8=K` is this ticket's to place, and it arrives pre-measured.** Ruled
  2026-08-18 by BA/PM (task `refinement-abc032-tolerances-2026-08-18`): `ABC-032` codes it
  `no-such-move` and that is **accepted there and not re-opened** — the promotion letter class is
  derived from the one shared table (`ADR-0004` clause 2), which contains `K`. **By the floor's own
  words it belongs on the `unreadable` side**, and this ticket is the hop that writes the wording, so
  it is the hop that decides. It shares its root cause with the castle price the `ABC-032` engineer
  disclosed (`parseSan(position, "O-O", legal)` is `unreadable` when no castle is legal): **see them
  together, place them together.** See `A8`.
- **One message per code, and no catch-all.** Every code renders one sentence that names a concrete
  referent — a square, a piece, or the king. There is no default arm and no fallback string.
- **Messages are DATA, placed by the loop.** They travel as `PromptOutcome.rejected.messages`
  (`src/turn-loop.ts:127`) into the frame's message region; nothing here prints. Seam invariant 5 and
  `ADR-0004` (2a)'s "never display copy" both hold: the *codes* live with the grammar, the *wording*
  lives here.

## Out of scope

- **The `rejected` arm's existence and its floor** — `ABC-032`. This ticket widens the vocabulary; it
  does not create the arm.
- **Ambiguity messages** — `ABC-033` owns the candidate list. An ambiguity is not a rejection.
- **The "no claim is available" rejection** — `ABC-035`, which owns the `claim` verb's grammar and the
  teaching rejection for a command. Same standard, different vocabulary, and `ABC-021` supplies the
  numbers it quotes.
- **Any change to `src/legal.ts`, `src/moves.ts` or `src/gameend.ts`.** This ticket **reads**
  `generateMoves` and `legalMoves`; it changes neither. Zero production lines outside its own module.
- **Retrograde reasoning** ("you cannot castle because the rook moved on move 14"). The seven classes
  are computable from the current position; anything needing move history is out, deliberately, and
  `EPIC-006`'s result screen is where history-shaped explanation belongs.
- **Localisation.** English only; no message catalogue, no substitution framework. Coding rule 7.

## Acceptance (Given/When/Then)

- **`A1` (the pin — the class this ticket exists for).** **Given**
  `rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP1BP/RNBQK1NR w KQkq - 1 4` or any position with an absolutely
  pinned piece, **when** a move of that pinned piece is submitted, **then** the reason is
  `own-king-exposed` and the message names the player's **own king**. *(Today the same input is
  indistinguishable from a typo.)*
- **`A2` (the classification is a SET DIFFERENCE, and that is asserted rather than described).**
  **Given** each of the six positions in `src/perft.test.ts`, **when** the classifier is run over
  **every** move in `generateMoves(position)` that is **not** in `legalMoves(position)`, **then** the
  reason is `own-king-exposed` or `must-address-check` for **every one of them, with zero
  exceptions**; and **when** it is run over every move in `legalMoves(position)`, **then** it classifies
  **none** of them as a rejection at all. **The discriminating requirement:** a classifier that answers
  `own-king-exposed` by heuristic — "the king is on the same line" — must fail at least one row of the
  first half, and a classifier that over-rejects must fail the second.
- **`A3` (each of the seven classes is reached by a named fixture).** **Given** one exact FEN and one
  exact input string per code, **when** each is submitted, **then** the reason is exactly that code —
  **seven rows, one per class, none of them reached by two rows**. *(A closed set whose membership is
  never exercised is a set with dead arms; this is the criterion that keeps the table honest.)*
- **`A4` (no bare rejection survives — asserted over the set, not per witness).** **Given** the
  delivered message set, **when** every code is rendered, **then** the seven messages are **seven
  distinct strings**, each contains at least one concrete referent (a square name from the input, a
  piece name, or the word for the king), **none** is a substring of another, and **no catch-all arm
  exists** — the classifier is total over its input domain by exhaustive mapping, not by a default
  branch. *(This is the quantifier form `ABC-024`'s `A3` and `ABC-030`'s `A2` both use: describe the
  hole once, not per witness. `ABC-028` re-found the same hole four times by doing the opposite.)*
- **`A5` (the message fits the frame and the frame hides nothing).** **Given** each of the seven
  messages, **when** it is passed to `assembleFrame` at the width the delivered panels set, **then**
  the message region's **hidden count is exactly 0** (`MESSAGE_ROWS` = 2, `src/frame.ts:45`; the
  region drops items and appends `+N`, `src/frame.ts:182-188`). **A message that does not fit is a
  message the player never reads.**
- **`A6` (the position is unchanged and the ply is not advanced).** **Given** any rejection, **when** it
  is produced, **then** `toFen(position)` is byte-identical before and after and `gameStatus` is **not**
  re-evaluated. *(`ABC-019`'s `rejected` path, unchanged; the same assertions `ABC-021` makes.)*
- **`A7` (no production change outside this ticket's module).** `git diff --numstat` shows this
  ticket's module and test file(s) and nothing else under `src/`; `src/legal.ts` and `src/moves.ts`
  hash unchanged; suite green, skip **0**, `PERFT_DEEP=1` **32/32**.
- **`A8` (the two ill-formed-SAN cases are placed, asserted, and cost no eighth code).** **Given**
  `8/4P3/8/8/8/4k3/8/4K3 w - - 0 1` and the input `e8=K`, and **given** `4k3/8/8/8/8/8/8/K6R w - - 0 1`
  and the input `O-O`, **when** each is submitted, **then** each produces exactly one of the **seven**
  codes above — **the set stays at seven; no code is added for either** — and the message names a
  concrete referent, and **`e8=P` still resolves to a different code than `e8=Q` in a position where
  `e8=Q` is legal**, so nothing collapses. **Constraint on the fix:** no second promotion-letter or
  castle-string table is introduced in `src/san.ts` (`ADR-0004` clause 2, and `ABC-032`'s `A7` guards
  it); whatever this ticket needs is computed in **its own module** from `generateMoves` /
  `legalMoves` or derived from the one table. *(Measured at the `ABC-032` gate by QE and by BA/PM:
  `e8=K` → `no-such-move`, `e8=P` → `unreadable`, `O-O` with no castle legal → `unreadable`.)*

## Dependencies

- **`ABC-032` — MERGED to `main`, and this dependency is DISCHARGED.** Measured 2026-08-18 at HEAD
  `7ea9e1b`, not asserted: `SanRejectReason` is exported at `src/san.ts:183` with exactly the two arms
  this page assumed (`unreadable`, `no-such-move`), and `SanParseResult` at `:190`. `ABC-032` merged
  2026-08-18 and sits in the board's `Done` column. It was an **ordering** dependency over one type,
  in one direction, and the ordering has occurred.
- **`ABC-033` is not a dependency in either direction.** The classifier is a pure function of position
  and input; the dispatcher calls it. Either may land first once `ABC-032` has.
- **`ABC-031` is not a dependency.** A coordinate rejection classifies through the same seven codes;
  no coordinate-specific class exists and none is needed.
- **Merged instruments:** `generateMoves` / `isSquareAttackedBy` (`src/moves.ts`), `legalMoves` /
  `isInCheck` (`src/legal.ts:42`, `:32`), `assembleFrame` (`src/frame.ts:194`), the perft table.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU** (5% of `NFR-008`'s 13 s clause), CPU instrument,
  median of paired per-round deltas, n ≥ 7 interleaved, identity null control ≤ 1.5%, net of 160 ms per
  test file added, scope = every file the branch adds under `src/`. **`A2` runs over the perft corpus
  and is the expensive criterion on this page — it is the one to watch against this bar.**
- **`NFR-001` (move-generation throughput) — not at risk, and the reason is structural.** This ticket
  calls `generateMoves` from a rejection path that runs at most once per typed line; it adds nothing to
  the search's inner loop and changes no line of `src/moves.ts` (`A7` pins the hash).
- **`NFR-003` (input responsiveness) — routed to `ABC-036`.** This ticket's own cost claim: a rejection
  costs **one** `generateMoves` and **one** `legalMoves` for the position already in hand, both
  measured elsewhere on this board at single-digit microseconds.
- **`NFR-002` — not triggered.** No renderer imports this module.
- **Security: the rejection message is the ONE place user text can reach the terminal, and it is
  already sunk.** Any echo of the typed line travels through the frame's message region, which
  **sanitizes** (`src/frame.ts:202`) — `ABC-018` owns terminal escape-sequence injection for the whole
  frame, and this ticket introduces **no second path** to that sink. **Firing threshold, falsifiable:**
  the security half fires if this ticket writes to any stream directly, touches any file under `src/`
  other than its own module and test file(s), or adds a runtime dependency.

## Test notes

1. **`A2` is the criterion, `A3` is the coverage.** A build can pass all seven `A3` rows with a
   heuristic and fail `A2` on one perft position. Run `A2` first when debugging.
2. **Do not compute "would leave the king in check" a second time.** `legalMoves` already filters it;
   the class is the difference between the two lists and nothing else. A second implementation of the
   rule is a second thing to keep correct, and it is how the two will disagree.
3. **Assert the message set as a SET** (`A4`) rather than message by message. Seven per-message
   assertions all pass on a build with an eighth, generic, catch-all arm.
4. **Round-trip every fixture FEN through `toFen` before believing it.** Standing instruction on this
   board; it has caught two lying labels.
5. **`must-address-check` and `own-king-exposed` are not the same message.** They are the same set
   difference under two conditions, and the player needs the difference: one says *that move leaves
   your king attacked*, the other says *you are in check and must answer it*.
6. **No test may assert an exact sentence in two places.** The message set is data; duplicating a
   string in a fixture makes the copy the test and the code the comment.

## Lane cost — how many test FILES this ticket implies

**One.** No `vi.mock` is needed — every assertion is over returned values and over `assembleFrame`'s
computed hidden count — so **no `*.nfr.test.ts` file is added**. ≈ 160 ms CPU, **≈ 1.2% of the 13 s
clause** (arithmetic over the published floor in `plans/nfr-catalog.md`, not a new measurement).

## Size and priority rationale

**Size `M` (3).** Seven classes, each computed from merged code, plus a message set, plus `A2`'s
property run over the perft corpus, plus the frame-fit criterion. It is above `S` because `A2` is a
genuine property test and because the classifier reads two move lists rather than one; it is below `L`
because there is no new subsystem, no design decision and no chess rule implemented here — every
answer is a set operation over lists the rules core already returns. Calibrated against `ABC-010`
(six validation rules in one existing module with exact fixtures, `M`) and `ABC-013` (`M`).

**Not `XL`. The split line if it ever moves:** **(a) the classifier and `A1`/`A2`/`A3`** — the
computed half; and **(b) the message set, `A4` and `A5`** — the copy half. Part (b) is `S` and ships
alone once (a) exists.

**Priority `P0`.** It is `EPIC-003`'s third acceptance criterion and its stated headline standard, and
`ABC-035`'s "no claim is available" rejection is written against the same standard. **Not `P1`:** the
epic's user value is a beginner playing without knowing notation, and a rejection that does not teach
puts that player back where they started.

## Definition of Ready

Cut-hop assessment by BA/PM **2026-08-12**: **9 of 10, ⚠️x2** — items 3 and 10, both the same open
ordering dependency on `ABC-032`. *(The cut-hop prose said "1 recorded ⚠️" while its own table carried
two, and the board row said `⚠️x2`; the table and the board were right.)*

**RE-SCORED against the tree at `main` HEAD `7ea9e1b` by BA/PM, 2026-08-18** (task
`refinement-p0-chain-2026-08-18`). **Result: 10 of 10, 0 ⚠️ — the Definition of Ready is MET.** Both
⚠️ were the SAME fact stated twice, and that fact is **discharged by measurement**: `ABC-032` merged
to `main` 2026-08-18 and `SanRejectReason` is exported at HEAD with the two arms this page widens
(see `## Dependencies`). Nothing else on this page changed. Column moves are the Orchestrator's.

**`A8` is UNCHANGED and was re-read at this hop, because `ABC-106` cites it.** The `e8=K` behaviour
`A8` is written against is the behaviour on `main`: `src/san.parse.test.ts:421` asserts
`parseSan(position, "e8=K", legal)` → `rejected` / `no-such-move`, and `e8=P` → `unreadable`. **`A8`
PLACES those two inputs inside THIS ticket's seven-code vocabulary; it does not re-classify
`ABC-032`'s `no-such-move`, which this page's `## Scope` accepts as delivered and does not re-open.**
See the note under `.grugops/context/refinement-p0-chain-2026-08-18/notes/` for the wording gap this
opens on `ABC-106`'s page — it is `ABC-106`'s to fix, not this page's.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the beginner; `ABC-032`'s floor is the bare rejection this epic forbids; the only place a player learns a rule |
| 2 | scope and out-of-scope clear | **✅** seven codes with the computation for each; six fences, including retrograde reasoning and localisation |
| 3 | INVEST-shaped | **✅** *(was ⚠️)* valuable, negotiable, estimable, small, testable — and now **independent**: the `SanRejectReason` arm it widens is merged and exported at HEAD `7ea9e1b`. Discharged by measurement 2026-08-18, not by re-argument |
| 4 | acceptance testable and measurable | **✅** eight criteria (`A8` added 2026-08-18): a set-difference property over six positions with **zero** exceptions, **seven** distinct messages with no substring relation and no catch-all, a **hidden count of 0**, byte-identical `toFen`, `32/32`, skip **0** |
| 5 | dependencies known | **✅** the one ordering dependency is now **merged**, stated in the direction it ran; three merged instruments re-checked at HEAD and still exact (`src/legal.ts:42`/`:32`, `src/frame.ts:194`), and the `PromptOutcome.rejected` cite corrected from `src/turn-loop.ts:120` to `:127` where it had drifted |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ **650 ms CPU** with `A2` named as the criterion to watch; `NFR-001` structurally not at risk with a hash pin; the sanitization sink named with its line; firing threshold falsifiable |
| 7 | test notes present | **✅** six |
| 8 | size assigned | **✅** `M` (3), calibrated, with the split line named |
| 9 | priority assigned | **✅** `P0` |
| 10 | no major unresolved blocker | **✅** *(was ⚠️)* the one ordering dependency is **CLOSED** — `ABC-032` is in `Done`. `A8`'s two cases arrive pre-measured against the merged tree rather than pending. Nothing else is unresolved |

## Delivery — 2026-09-19 (Software Engineer, task `wave-2026-09-19`, subtask `ticket-to-pr-ABC-034`, Workflow 04)

**Branch `grugops/ABC-034-rejections-that-teach` @ `6ee7cde`, base `grugops/wave-2026-09-19` @
`4f0ef01`. NOT merged, NOT deployed, NOT self-signed; QE's hop and Security/NFR's are still owed.**
Notes, measurements and the harness: `.grugops/context/ticket-to-pr-ABC-034/notes/`. Column moves
are the Orchestrator's; `In Development → In Review` is recommended.

**What was built.** `src/rejection.ts` (+181): the seven codes as `REJECTION_REASONS` (`as const`),
`Rejection` (discriminant + referents), `classifyRejection(position, texts, legal?)`,
`rejectionMessage`. The king classes are the set difference `generateMoves \ legalMoves`, and
whether a text names a move in it is asked of `parseCoordinateMove` / `parseSan` WITH that list as
the candidates — no grammar, no piece/castle/promotion table here (`A8`'s constraint); the rule
"would leave the king attacked" is computed only in `src/legal.ts` (test note 2). The origin
classes read the board after the coordinate reader's own verdict. `src/move-input.ts` (+10/−11): the
rejected arm hands the classifier the texts it tried (line + the four case variants, de-duplicated,
in order) and places the returned sentence; the two-code precedence it made unused is removed; the
header sentence that said wording was not here is corrected. `src/rejection.test.ts` (+345, 53 tests)
and six rows of `src/move-input.test.ts` (+24/−11, still 50 tests).

**The sentences** (`A4`, `A5`): `type e2e4 or Nf3` · `no piece on <sq>` · `<sq> is not yours` ·
`<from> cannot reach <to>` · `exposes your king` · `your king is in check` · `no move <san> here`.
Longest fixed 21 columns = `W` with the history pane; the echo is bounded by the SAN grammar at 7.

| criterion | disposition |
|---|---|
| `A1` | **MET on a real absolute pin** (`4r1k1/8/8/8/8/8/4N3/4K3 w`, rook e8 → knight e2 → king e1): `Nc3` / `e2c3` / `Ng3` / `e2g1` → `own-king-exposed`, sentence names the king. **The NAMED FEN is a CHECK position** (Qh4–e1 with f2 empty; `isInCheck` asserted true), so by this page's own table it is `must-address-check`; asserted as such, sentence names the king. Reading recorded as a `decision` note |
| `A2` | **MET** — every `generateMoves \ legalMoves` move on all six perft positions classifies as exactly the class `isInCheck` selects, zero exceptions (non-empty asserted); every `legalMoves` move resolves as `move` through `resolveMoveInput` |
| `A3` | **MET** — seven rows, seven codes, none twice, none unreached; each also asserted through the dispatcher |
| `A4` | **MET as a set** — 7 distinct, each matches `/[a-h][1-8]\|king/`, no pairwise substring, `REJECTION_REASONS.length` = 7; the renderer is one `switch` with no `default`, exhaustive by `tsc` |
| `A5` | **MET** — nine sentences (seven + `A8`'s two) through `assembleFrame` with the real `renderBoard` / `renderStatusPanel` / `renderHistory` on each fixture's own position: no `(+N more)`, sentence present whole |
| `A6` | **MET** — `toFen` byte-identical across `classifyRejection` and across `resolveMoveInput`, `history.moves` empty. "Not re-evaluated" is the loop's property (`src/turn-loop.ts` untouched, `ABC-019` rows unchanged) |
| `A7` | **MET as read with `## Scope`, and the reading is named:** `git diff --numstat 4f0ef01 -- src/` = `move-input.test.ts` 24/11, `move-input.ts` 10/11, `rejection.test.ts` 345/0, `rejection.ts` 181/0 — nothing else; `src/legal.ts` / `src/moves.ts` absent from the diff. The one call site in `src/move-input.ts` is what makes the messages travel as `PromptOutcome.rejected.messages`. **The security firing threshold fires on its letter** — Security/NFR should look: same sanitized sink, no direct stream write, no dependency. Suite green, skip **0**, `PERFT_DEEP=1` **32/32** |
| `A8` | **MET at seven codes** — `e8=K` → `no-legal-move-named` (`no move e8=K here`); `O-O` with no castle legal → `unreadable`; `e8=P` → `unreadable`, `e8=Q` → `move`. Placed by the readers' own verdicts — the two land on DIFFERENT codes, which is a reading of *"place them together"* this page delegated to this hop; one `if` from the other placement if BA/PM prefers it. No table introduced |
| `N8-LANE` | **+215 ms gross, +55 ms net — MET** (n = 8 interleaved, three conditions, null −0.09% at 4/8) |
| `NFR-008` | **CPU OVER at BOTH base (16.920 s) and tip (17.300 s)** at 1-min load 6.7–18.7 — `ADR-0019` trigger (a) on the reading; **handed up, nothing trimmed or moved**; `OPT-1` is the sized remedy and it is the owner's call. Wall 4.26 / 4.32 s: data, not a verdict (`ABC-111`) |
| Security | No stream written directly; no second path to the sink; no runtime dependency; `src/move-input.ts` touched (the threshold's letter — see `A7`) |

**Gates at `6ee7cde`:** `npx tsc --noEmit` clean (typecheck and build); `npx biome check .` clean;
`npx vitest run --dir src` **41 files / 1266 tests / 0 skipped** (baseline 40 / 1213 / 0);
test-integrity `No findings.`; `PERFT_DEEP=1` 32/32. `npm run` wrappers were refused by the session's
hook; the recorded underlying commands were run.

**Observed, not fixed (`ABC-033`'s):** a padded lowercase line (`"  qh5  "`) is never case-folded,
because the variants transform the whole line and index 0 is a space; noted in an `observation`.


## QE — 2026-09-19 (QE/E2E, task `wave-2026-09-19`, subtask `qe-ABC-034`)

**Verdict at `aa9e49f` (branch `grugops/qe-ABC-034`, base `grugops/wave-2026-09-19` carrying the
build): PASS.** Not a stamp, not a merge, not an acceptance — QE's recorded verdict for the
`In Review` exit (`AGENTS.md § QE validation authority`). Security/NFR's hop is owed and the
ticket's own threshold fired on its letter. Notes and raw output:
`.grugops/context/qe-ABC-034/notes/`. Column moves are the Orchestrator's;
`In Review → In Security/NFR` is recommended.

**Gates, run here:** `biome check .` 76 files clean · `tsc --noEmit` clean (typecheck and build) ·
`npx vitest run --dir src` **42 files / 1291 tests / 0 skipped** · test-skip-integrity `No
findings.` · `PERFT_DEEP=1` **32/32**. Hash pins against `4f0ef01`: `src/legal.ts`, `src/moves.ts`,
`src/san.ts`, `src/coordinate-move.ts`, `src/frame.ts`, `src/turn-loop.ts`, `src/search.ts`,
`src/engine.ts` all unchanged. **This hop changed zero lines under `src/`.**

**Mutants (18, full lane each, every one reverted and the tree checked clean):**

| mutant | rows RED |
|---|---|
| (a) king SENTENCES swapped (Ma1) · origin SENTENCES swapped (Ma2) | **NONE / NONE** → G1 |
| (a) king CODES swapped (Ma4) · origin CODES swapped (Ma3) | 8 (`A1` ×5, `A2`, `A3` ×2) / 2 (`A3` ×2) |
| (b) set difference on the wrong side (Mb) | 9 (`A1` ×5, `A2`, `A3` ×2, texts-handoff) |
| (c) fold variants not handed over (Mc) · handed over in reverse order (Mc2) | 2 (texts-handoff ×2) / **NONE** → G2 |
| (d) `unreadable` for everything (Md) | 19 |
| (e) call site places the old placeholder code (Me) · call site drops `legal` (Me2) | 21 / **NONE** → G3 |
| origin/destination swapped (Mg) · colour inverted (Mh) · `no-legal-move-named` dropped (Ml) · readers asked against `legal` not the difference (Mo) · `unreadable` sentence bare (Mp) · a sentence at 23 columns (Mq) | 7 / 4 / 5 / 3 / 2 / 1 |
| `sameMove` ignores promotion (Mb2) · echo untrimmed (Mn) | NONE (equivalent mutant) / **NONE** → G4 |

Every criterion `A1`–`A8` has at least one killing mutant; `A2` is the discriminating criterion the
page said it was (Mo dies on it and on two `A1` rows only).

**The three readings, ruled:**

| criterion | ruling |
|---|---|
| `A1` | The named FEN has **no pinned piece** — the queen on h4 checks e1 with g3 and f2 empty; measured `isInCheck` true, `legalMoves` = [e1f1]. The first disjunct is unsatisfiable as written; the build passes on the second (*any position with an absolutely pinned piece*) with `own-king-exposed` on a real pin, and asserts the named FEN as `must-address-check` per this page's own table. **PASS under the reading; the Engineer's reading was the only one consistent with the table. BA/PM: replace the FEN label** (`4r1k1/8/8/8/8/8/4N3/4K3 w - - 0 1` is a candidate) |
| `A7` | **Letter NOT met**: `src/move-input.ts` 10/11 is in the numstat. **`## Scope` on this page requires that call site** (messages *travel as `PromptOutcome.rejected.messages`*; *the dispatcher calls it*). The unwired alternative satisfies the letter and delivers nothing. **PASS as read with `## Scope`**, deviation bounded to the one file, eight core files hash-pinned unchanged, 32/32, skip 0. **The security firing threshold fires on its letter** — Security/NFR's hop is not pre-empted |
| `A8` | **PASS as written**: `e8=K` → `no-legal-move-named` (*no move e8=K here*), `O-O` → `unreadable` (*type e2e4 or Nf3*), seven codes, `e8=P` ≠ `e8=Q`, no table anywhere. The `## Scope` lean ("place them together") needs a promotion-letter table or a re-coding in `src/san.ts` — the first `A8` forbids, the second `## Scope` says is not re-opened. The Engineer's placement is the only one buildable under the constraint. Teaching cost measured for BA/PM: unavailable castling by `O-O` / `e1g1` / `Kg1` → *type e2e4 or Nf3* / *e1 cannot reach g1* / *no move Kg1 here* |

**(f) `"  qh5  "`:** `qh5`, `QH5`, `"  Qh5  "`, `"  e2e5  "` all classify correctly; `"  qh5  "` and
`"  nc3  "` → *type e2e4 or Nf3*. The classifier is right for the texts it is handed; the cause is
`ABC-033`'s whole-line `CASE_VARIANTS`. No `ABC-034` criterion names a padded input — **`ABC-033`'s,
BA/PM to rule whether the fold trims first.**

**`A5` beyond the suite:** the nine sentences plus `Qa1xh8#` (20 columns, the grammar's longest
echo) and a padded line, through the real `assembleFrame` in unicode/ascii × white-/black-bottom:
**44/44 whole, hidden 0**, 23 rows. `ABC-107`'s overflow pin (25 rows) passes beside it.

**False-sentence check (`ABC-114`):** every checkable claim in the four touched files' comments
verified against the tree — castles never in the difference (`src/moves.ts:330` filters at
generation; probed through- and into-check), SAN echo bound 7 (`PIECE_MOVE` / `PAWN_MOVE` + one
`CHECK_SUFFIX`), `CHECK_FEN` only `Kf1`, `PERFT_FENS` byte-equal to `src/perft.test.ts`. No false
sentence in this ticket's lines.

**Gaps — test gaps, none falsifies a criterion, none fixed here (fence):** **G1** no row binds a
code to ITS sentence (Ma1/Ma2 green; test note 5 unasserted — assertable by semantic anchor without
typing a sentence twice); **G2** dispatcher order pinned only through the classifier with
coordinate codes; **G3** the `NFR-003` one-derive claim is unasserted — the `ABC-033 A5` spy cannot
see the classifier's own `legalMoves` import; **G4** no padded well-formed SAN row guards the
`.trim()` on the echo. Owner's call whether G1 rides this ticket before merge or a sibling.

**Not done:** no merge, no deploy, no self-sign; `NFR-008` not ruled; Security/NFR's review not
done; `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md` not opened.


## Security/NFR — 2026-09-19 (Security/NFR, task `wave-2026-09-19`, subtask `security-ABC-034`, Workflow 15 per-ticket review)

**Verdict at the wave tip `1b431dc` (build `6ee7cde`, QE `aa9e49f`), branch
`grugops/security-ABC-034`: PASS — zero required fixes, zero accepted risks (no `AR-` row added;
`plans/nfr-catalog.md` not opened).** Not a stamp, not a merge, not an acceptance; the
`In Security/NFR → Ready for UAT` move is the Orchestrator's. Notes, probe scripts and raw output:
`.grugops/context/security-ABC-034/notes/`. `security.asvs_level` L1, `block_on` high,
`compliance_regime` `[]`.

**The threshold fired on its letter and every prong was answered by probe.** No direct stream
write (grep 0 over both files; the only sink is `assembleFrame`'s `sanitize`, `src/frame.ts:202`).
The second `src/` file is the one call site `## Scope` requires. No dependency: `package.json`,
`package-lock.json`, `vitest.config.ts` blob-hash-identical to `main`.

| probed | result |
|---|---|
| the sink (`ABC-018` bar) | 288 directed (ESC sequences, C0, DEL, NBSP, ZWSP, BOM, U+2028, fullwidth, 1,024-char lines) + 120,000 fuzzed prompts through the PRODUCTION prompt path (`resolvePromptLine`): **0** sentences with a C0/DEL/non-ASCII code point, **0** off the seven shapes; `toFen` identical on every prompt; 192 frames whole, hidden 0 |
| the echo bound | verified from `PIECE_MOVE` / `PAWN_MOVE` / `CHECK_SUFFIX`, then **enumerated over all 165,888 strings the grammar accepts**: echo ≤ 7, longest sentence **20** columns; the castle path never echoes (`unreadable` at zero matches) |
| `NFR-003` one-derive (QE G3) | production path, wrapper counters on an out-of-tree copy, positive control first: **`legalMoves` per rejected prompt 1 before → 1 after**; `generateMoves` 1 → 2 (the set difference); `isInCheck` +1 on the two king classes only. **No charge** — the ticket's cost claim is exactly the measurement. G3 stays a TEST gap on a true claim; recommended for the G1 follow-up, not required |
| `NFR-002` per-frame path | `classifyRejection` **0 of 1,600 frames** through `makeRenderSeam` (positive control 1); no renderer imports the module. The 14–19 `legalMoves`/frame the probe counted at 40–272 plies are IDENTICAL before the build — pre-existing (`ADR-0004` history-pane `toSan`), handed to Architect/Design as data |
| ASVS L1 | V1.2.1, V1.3.2, V2.1.1, V2.2.1, V5.2.1 PASS with evidence; the remaining 65 not applicable (no HTTP, browser, file, account, session, token, crypto, transport, component change); no failed requirement, no severity tagged |
| `NFR-008` | **NOT ruled** (fence). The Engineer's `N8-LANE` +215 ms gross / +55 ms net WAS measured to the row's protocol (n = 8 interleaved, three conditions rotated, round 0 dropped, null −0.09% at 4/8, counts asserted, blob-hash pins); the absolute over-15 s readings under load are handed up unchanged |

**Not done:** no merge, no deploy, no self-sign; suite not re-run (this hop changed zero lines
under `src/`; QE's 42 / 1291 / 0 stands); `src/search.ts` / `src/turn-loop.ts` not touched. UAT is
NOT waivable (production lines under `src/`); the owner's word is the signature.
