---
kind: adr
---
# ADR-0010: The frame's WIDTH — the consumer clears, because width composes by MAX and rows compose by SUM

## Status

**accepted** — 2026-08-11 by Architect/Design at task `design-frame-width-clearing` (Workflow 04), on
the question `ADR-0009`'s own `## Consequences` reserved in one sentence: *"Which panel sets the
frame's `W` is a width question and is untouched here."* It is answered here.

Routed here rather than to BA/PM because BA/PM **declined to write a criterion** and said why: the two
candidate fixes are a design decision, not a wording one. That judgement is upheld — the ruling below
changes which criterion is even correct, so writing one first would have picked the answer.

**No target moves and no level is set, so no owner ratification is owed** — the same distinction from
`ADR-0008` that `ADR-0009` draws. Every claim below is gate-adjudicable: it either fails on the
constructed mutants in `## Context` or it does not, and every one was run.

**This ADR DOES require production lines** — exactly one changed expression in merged `src/frame.ts` —
and that is the first time an ADR in this project has. `ADR-0009` added zero. The line is named in
`## Consequences`, and it is not written here.

**`ADR-0009` is not reopened.** Clause 1 (*the producer owns its count*) and clause 9 (*a consumer
never names a row count*) both stand, verbatim and unamended. This ADR **distinguishes** width from
rows and explains why the same rule must not be extended to it. If anything, the measurements below
strengthen clause 9 by showing exactly which property of row counts it rests on.

## Context

### What was flagged, and what re-measurement changed about it

BA/PM flagged at `refinement-ABC-016-a13` that the delivered status panel's widest row swings **17**
(quiet) to **67** (both draw claims named), that `src/frame.ts:179` makes the widest panel row the
frame's `W`, and that `\x1b[0J` cannot erase to the right of a row — so a narrowing frame leaves stale
columns. **Both numbers are correct and both were reproduced here.** Three things about the framing
were not, and they are recorded because each one moves the decision:

**(a) The FRAME's width never swings 50, because `W` is a max that includes the board.** `W =
max(board, status, history)` and `renderBoard` is **18** characters wide. With the board alone the
swing is 18 → 67 = **49**. With a conformant `ABC-017` pane at `HISTORY_COLS` = 24 it is 24 → 67 =
**43**. The worst swing measured in an actual played game is **50 → 24 = 26**.

**(b) The claim cell is the RARE case, not the representative one.** Measured over `ABC-017`'s own
20-ply line, driven by merged `gameStatusOf`, with **no draw ever claimable**:

| line | `HISTORY_COLS` | distinct `W` | `W` changes | **narrowings** | worst |
|---|---|---|---|---|---|
| quiet 20-ply | 0 | 18, 21, 22, 23, 24 | 14 | **6** | −2 |
| quiet 20-ply | 21 | 21, 22, 23, 24 | 13 | **6** | −2 |
| quiet 20-ply | 24 | 24 | 0 | **0** | — |
| knight shuffle to threefold | 24 | 24, 50 | 2 | **1** | −26 |

The common defect is **small and frequent** — six narrowings in twenty plies, from `last: <SAN>`
(`e4` → `exd4` → `O-O`) and the move number gaining digits. The claim cell is **large and rare**. A
fix aimed only at the claim cell fixes the case that almost never happens.

**(c) The panel has FIVE variable cells, not two.** Measured widths: `17, 22, 26, 45, 50, 67`. The
move number (`1.` → `9999...`), the `CHECK` cell, the SAN in `last:`, the material balance and the
claim cell all move. `A7` reserves the *thinking* cell and is the only width clause on the ticket.

### The defect is real, is not cosmetic, and does NOT self-repair

Merged `assembleFrame` + `beginFrameSession` were run into a terminal model implementing the escape
grammar this module emits. **Stale columns on 5/20 redraws** of the shuffle line and **8/20** of the
quiet line at `HISTORY_COLS` = 21. What reaches the screen is not leftover decoration:

| what the frame says | what the player sees |
|---|---|
| `last: c3  material: 0` | `last: c3  material: 00` |
| `last: cxd4  material: 0` | `last: cxd4  material: 01` |
| *(empty row — no claim)* | `claim: threefold repetition` |

**The first two are a wrong number in the material readout. The third offers a draw claim that has
expired.** This is a misreported game state, not a smudge.

**And it persists.** Longest unbroken run of frames carrying the residue after one narrowing:
**17**. `\x1b[0J` erases downward from the end of the new frame and **never** erases rightward, so
nothing clears the residue until some later frame happens to be wide enough to overwrite it.
`EPIC-002`'s accepted-cosmetic-defect posture for SIGWINCH rests on *"`4b`'s erase-to-end-of-screen
repairs the display on the next frame — one ply later."* **That reasoning is sound for rows and
unsound for columns**, and this is the measurement that separates them.

### Nothing is broken today, and the deadline is real

Nothing composes a frame in a loop until `ABC-019`, so no stale column can reach a terminal before it.
Merge order is `ABC-016` → `ABC-017` → `ABC-019`. **`ABC-017` is unbuilt in `Ready for Dev` and is the
ticket carrying the existing constant-width criterion**, so a ruling that changes it is cheap now.

### THE MEASUREMENT THAT DECIDES IT — rows compose by SUM, width composes by MAX

This is the whole ADR. Everything else follows.

- `frameHeight` is `board + status + history + MESSAGE_ROWS + PROMPT_ROWS` (`src/frame.ts:89`) — a
  **sum**.
- `W` is `panels.reduce((widest, row) => Math.max(widest, row.length), 0)` (`src/frame.ts:179`) — a
  **max**.

In a sum, every producer's contribution is visible in the total, so a per-producer guarantee is both
**necessary and sufficient** and a violation by any producer changes the result. In a max, **only the
largest contributor is visible.** Three measured consequences, and each is fatal to producer-side
ownership of width:

**(i) A producer-side width guarantee is green by MASKING.** With a conformant `ABC-017` pane at
`HISTORY_COLS` = 24, the quiet 20-ply line shows **0/20 stale frames** — while the status panel
underneath is still swinging 17 → 24 on every ply. Set `HISTORY_COLS` = 21 and **the same game, the
same panels, the same writer** shows **8/20**. The status panel's defect is invisible when a
neighbour is wider and appears when the neighbour is narrowed — **by a change in a different
ticket.** This is `ADR-0009` clause 9(v)'s landmine (*"green at its own gate, armed for the rebase"*)
arriving through the width door.

**(ii) `H` is invariant; `W` is not.** Re-running `ADR-0009` clause 9(i)'s sweep for width — 510
shapes, status × history 0–16 × five message-region shapes × both glyph modes:

| quantity | result |
|---|---|
| `H` vs `frameHeight(...)` | **0 mismatches** in 510 shapes |
| `H` under the message region | **invariant** — 0, 1, 200 and a 100,000-character item all give the same `H` |
| `W` over the same sweep | **4 distinct values: 22, 24, 45, 67** |

**This is why clause 9a works and its width analogue cannot.** Clause 9a has the loop take its session
height as `firstFrame.length` — sound precisely *because* `H` is invariant. Freezing `W` at frame 1 was
measured: it truncates `White may claim: threefold repetition, fifty-move rule` to `White may c`, and
**loses 8 panel rows outright** over a 20-ply game.

**(iii) The widest producer dictates the frame for everyone.** Because `W` is a max, "every producer
reserves its width" does not mean each panel gets its own width — it means the frame is permanently
as wide as the **widest** panel's worst case, in every frame of the game, forever.

### The four candidate owners, scored by running them

Each candidate was run through merged `assembleFrame` + `beginFrameSession` into the terminal model,
over two real games, against six width mutants. Score = redraws whose **screen** differs from the
**frame**.

| mutant (knight shuffle / quiet line) | **N** nothing | **P** producer reserves | **C** consumer clears | **S** session-frozen `W` |
|---|---|---|---|---|
| W0 delivered | 5/20 · 0/20 | 0 · 0 | 0 · 0 | 0 · 0 |
| W1 status gains a longer cell | 10/20 · 16/20 | 0 · 0 | 0 · 0 | 0 · 0 |
| W2 history ships VARIABLE width | 5/20 · 8/20 | 0 · 0 | 0 · 0 | 0 · 0 |
| W3 board ships a wider row | 5/20 · 0/20 | 0 · 0 | 0 · 0 | 0 · 0 |
| W4 loaded FEN, huge fullmove | 5/20 · 8/20 | 0 · 0 | 0 · 0 | 0 · 0 |
| W5 message item longer than `W` | 5/20 · 0/20 | 0 · 0 | 0 · 0 | 0 · 0 |

**Three candidates score zero, so the stale-column count alone does not decide it.** The dimensions it
cannot see are what decide it, and the first attempt to measure them was wrong (see the correction
below):

| candidate | panel rows LOST | `W` over the game | blank columns on a quiet frame | bytes per frame |
|---|---|---|---|---|
| **N** nothing | 0 | {24, 50} | 6 | 621 |
| **P** producer reserves | 0 | **{67} always** | **49** | 1567 **(+152%)** |
| **C** consumer clears | 0 | {24, 50} | 6 | 690 (+11%) |
| **S** session-frozen `W` | **8 LOST** | {24} | 6 | 621 |

> **[CORRECTED at this hop — the first run of this table scored `S` as "claim text intact: YES" and
> `N`, `P` and `C` as "NO". Every cell of that column was wrong, and it is recorded here rather than
> silently fixed because the error is the more useful artifact.]** The check looked for the
> **two-claim** string, but the driving game only ever reaches **threefold** — so the string never
> appeared and all three sound candidates were scored as truncating. `S` scored "intact" for the
> opposite reason: it truncated the cell so hard that the substring the check keyed on (`may claim`)
> was **gone**, so the test never fired. **A check that reports success because the thing it looks for
> was destroyed is worse than no check.** The honest form, used above, asserts that every non-blank row
> the panel PRODUCED survives, trimmed, somewhere in the assembled frame — it needs no knowledge of
> what the cell says. Under it, `S` loses 8 rows and the other three lose none. The verdict did not
> change; the reason it is trustworthy did.

**`P` costs a 67-column frame with 49 permanently blank columns, in every frame, for a cell that is
populated in a small minority of them.** Rendered at the start position, the board occupies columns
1–18 of a 67-column frame on an 80-column terminal. **`S` silently destroys information.** `C` costs
**+66 characters, exactly and always** (`(H − 1) × 3`), and nothing else.

### Which assertion form catches it — and the form depends on WHO owns it

Scored on a real narrowing pair (a threefold claim expiring on a pawn move) and on a steady pair, at
three modelled screen widths:

| form | narrowing @ `W`(frame 1) | narrowing @ 80 cols | steady @ 80 cols |
|---|---|---|---|
| **F1** epic `4b` *"zero ROWS from frame N"* / merged `:381` | CATCHES | **BLIND** | PASS |
| **F2** merged `:379` screen equals frame | CATCHES | CATCHES | **FALSE POSITIVE** |
| **F3** screen equals frame, **trimmed** | CATCHES | CATCHES | PASS |
| **F4** every frame's `W` equals the session `W` | CATCHES | CATCHES | PASS |

Four facts fall out:

1. **Epic `4b` as worded does not cover this at a real terminal width.** F1 only fires at the
   artificial screen width `W`(frame 1), where a padded row of frame N happens to be string-equal to a
   grid row. At 80 or 120 columns it is **blind**. BA/PM's reading — *"a narrowed frame leaves no whole
   row of frame N, only its right-hand columns"* — is **right**, and the merged test's apparent
   coverage is a fixture artifact.
2. **The merged test's `:379` form cannot simply be reused.** It compares untrimmed grid rows against
   frame rows and therefore **false-positives on any screen wider than the frame** — which is every
   real terminal. It works today only because `W` is pinned.
3. **`F4` is correct under `P` or `S` and WRONG under `C`.** Under the ruling below, `W` varies by
   design ({24, 50}), so a constant-width criterion would forbid the very thing the fix permits.
   **The criterion is downstream of the ownership decision**, which is precisely why BA/PM was right
   not to write one first.
4. **`F3` is the only form that is sound at any width under any candidate.**

### The merged suite structurally cannot see this

Over **301 plies × thinking × 4 message shapes**, merged `src/frame.test.ts`'s own fixtures produce
`W` ∈ **{18}** — a single value. `statusStub` maxes at 13 characters and `historyStub` at 14, so the
**real board pins `W` at 18 in every fixture the file has.** No test in the merged suite can narrow a
frame. This is a suite hole, not a production defect in `assembleFrame`: the assembler is correct, and
`## Consequences` names what closes it.

### What merged code already assumes, in its own words

`src/frame.ts`'s header states the invariant this breaks, and states it as a fact rather than a
requirement:

> *"The frame has ONE width `W`: the widest row the assembled regions emit. Every row except the
> reserved prompt row is padded to exactly `W`, **which is what makes an in-place redraw leave no
> character of the previous frame behind without emitting a per-row erase.**"*

That sentence is true only while consecutive frames have **equal** `W`. It is an unstated precondition
in merged code, it was never asserted anywhere, and no panel was ever told it had to hold it up.

## Decision

1. **The CONSUMER owns frame-width stability. `src/frame.ts`'s in-place writer clears each row as it
   writes it.** The emitted redraw becomes cursor-home, the rows joined by an erase-in-line, then the
   single erase-to-end-of-screen. Measured minimal and sufficient: **one** `\x1b[0J`, **one** `write()`
   per frame, **+66 characters** (`(H − 1) × 3`), **0/24 stale frames** at both 80 and 120 columns.
   A trailing `\x1b[K` on the last row was measured **redundant** — `\x1b[0J` already clears the rest
   of the cursor's row — and is not added.

2. **No panel reserves, pads or declares a frame width. `W` stays a per-frame max over delivered
   rows** (`src/frame.ts:179`, unchanged), and it is allowed to vary between frames. The delivered
   `ABC-016` panel needs **zero production lines**.

3. **THE GENERAL RULE, and the reason this is not a re-litigation of `ADR-0009`:**

   > **A frame quantity that composes by SUM is owned by its PRODUCER. A frame quantity that composes
   > by MAX is owned by its CONSUMER.**

   A sum makes every producer's contribution visible in the result, so a per-producer guarantee is
   necessary, sufficient and independently checkable — which is `ADR-0009` clause 1, and it stands. A
   max makes every contribution **but the largest invisible**, so a per-producer guarantee is
   unverifiable from outside the panel, is green by masking as its normal state (measured, (i) above),
   and, if honoured by all, hands the frame to the widest producer's worst case (measured, (iii)).
   **Row counts and widths are owned by opposite sides, and the composition operator is the reason.**

4. **`ADR-0009` clause 9's `firstFrame.length` derivation is NOT extended to width, and the reason is
   measured, not stylistic.** Clause 9a is sound because `H` is invariant — 0 mismatches over 510
   shapes. `W` is not invariant over the same sweep (4 distinct values), so the analogous
   `firstFrame[0].length` would have to truncate, and truncation was measured to destroy 8 panel rows
   including a live draw-claim offer. **Clause 9 is untouched and its scope is now explicit: it governs
   row counts, and it governs them because they are invariant.**

5. **No constant-width criterion is added to `ABC-016`.** Its `A7` (the reserved thinking cell)
   **stands** — it is delivered, green, and costs nothing. Its *stated rationale* is superseded: `A7`
   is now a legibility clause (the row-3 content does not jump horizontally), **not** a defence against
   stale columns, which is the writer's job after clause 1.

6. **`ABC-017`'s `A2` KEEPS its constant-width assertion and LOSES its frame-level justification.**
   The assertion is worth having on its own terms — a ragged pane is ugly and `A3` asserts sixteen
   cells in fixed columns. The justification is now false as written: `A2`'s parenthetical says *"This
   pane is expected to be the widest panel and therefore to SET `W`"*, and measured against the
   **delivered** status panel that is wrong in every state where a draw is claimable —
   `HISTORY_COLS` ≈ 21–24 against the panel's 45, 50 and 67. **This is the same move `ADR-0009`
   clauses 3 and 4 made**: strike the cross-ticket clause, keep the panel-local half.

7. **`ABC-019` is owed exactly ONE criterion, and it is the `F3` form** — over a played game
   containing a narrowing (a draw claim appearing and then expiring), the screen after **every** redraw
   equals the frame it was given. It is the width counterpart of clause 9e and, like 9e, it is the only
   place the property is checked at all. **`ABC-019` must NOT be given a constant-frame-width
   criterion** — under clause 1 `W` varies by design, and `F4` would fail the correct build.

8. **Epic `4b` is NOT breached and is NOT amended by this ADR.** Its *"in one operation"* clause
   governs the **end-of-frame-to-end-of-screen** erase, and its own parenthetical names the target:
   *"not cursor-up-by-counted-lines."* Clause 1 keeps exactly one `\x1b[0J`, emits no count and no
   cursor movement, and still writes each frame in exactly one `write()`. `4c` is untouched — measured
   **0 escape bytes** on both the non-TTY and short-TTY paths, because only the in-place branch
   changes. **The honest residue: `4b`'s *"zero rows from frame N"* is worded over ROWS and is blind to
   this defect at any real width (F1 above). Clause 7 covers it at the ticket level rather than
   reopening an epic. If the owner reads *"in one operation"* as forbidding any additional
   erase — a reading this role does not take, and states so it can be checked — then `4b` needs a
   wording hop and that is BA/PM's, not this ADR's.**

## Alternatives

**A. The panel reserves its width — the producer pads (BA/PM's candidate (i)).** Rejected, and it is
the closest call, so it gets its argument. **For:** it is the exact shape of `ADR-0009` clause 1, it
needs no change to merged code, and each panel stays independently checkable. **Against, and it
wins:** (1) it makes the frame **67 columns wide in every frame of the game with 49 columns
permanently blank** — the board occupies columns 1–18 of it — for a cell populated in a small minority
of frames, and that is a visible product regression, not an implementation detail; (2) it costs
**+152% bytes per frame** (621 → 1567); (3) it requires **every** producer to hold the line
independently while a max makes any one of them **unable to observe** whether the others do —
measured in (i), where the same panel is green or red depending on a constant in a different ticket;
(4) it is the *"unrequested flexibility / reserved space nobody asked for"* shape coding rules 5 and 7
warn about, and the engineer already declined it for these cells with a stated reason. **What
rejecting it costs, plainly:** the frame's width is no longer a stated constant anywhere, and a reader
who wants to know how wide the frame is must run it. Clause 7's criterion is what pays that back — it
asserts the property that actually matters (nothing stale reaches the screen) instead of a proxy for
it.

**B. Freeze `W` at the first frame — the width analogue of `ADR-0009` clause 9a.** Rejected **by
measurement**, and it is the alternative most likely to look right to a reader who knows clause 9.
Clause 9a is sound *because* `H` is invariant (0 mismatches, 510 shapes). `W` is not invariant over the
identical sweep (4 distinct values), so freezing it forces truncation:
`White may claim: threefold repetition, fifty-move rule` becomes `White may c`, and **8 panel rows are
lost across one 20-ply game**. A fix that scores 0 stale frames by deleting the content that would
have been stale is not a fix. **This is the alternative the first version of this ADR's cost table
scored as the WINNER before that table was corrected** — see the correction block in `## Context`.

**C. Do nothing; accept it as cosmetic, as `EPIC-002` accepted the SIGWINCH class.** Rejected on two
measurements. The epic's acceptance rests on *"`4b`'s erase-to-end-of-screen repairs the display on the
next frame"* — measured **false for columns**: the residue survived **17 consecutive frames**, because
`\x1b[0J` never erases rightward. And the residue is not cosmetic: it renders `material: 0` as
`material: 01` and leaves an **expired draw claim** on screen. A wrong material count and a
non-existent claim are game-state errors.

**D. Clear per row only when the frame narrows.** Rejected — it makes the writer stateful (it must
remember the previous `W`) to save 66 characters, adds a branch whose *correct* path is the one that
almost never runs, and is the conditional-complexity coding rule 8 warns about. `\x1b[K` on a row that
needs no clearing is a no-op at the terminal.

**E. Cap `W` at a constant and truncate anything longer, in `assembleFrame`.** Rejected — it is
Alternative B's information loss without B's session-derived honesty, and it puts a product decision
(what gets cut) in the assembler, which renders no panel and cannot know what is safe to cut.

**F. Widen the responsibility: `assembleFrame` takes `W` as a parameter so the loop owns it.**
Rejected — it re-acquires every problem of B (the loop's `W` is not the frame's `W`), adds a parameter
to a merged signature, and puts the loop back in the business of naming frame geometry, which is
exactly what `ADR-0009` clause 9 got it out of.

## Consequences

- **One production change, in `src/frame.ts`'s in-place branch of `beginFrameSession`** — the single
  expression at `:216`. It is `ABC-018`'s merged module and `ABC-018` is closed, so **a home for the
  change is owed and this ADR does not pick one**: either a small new ticket landing before or with
  `ABC-019`, or attached to `ABC-019` (where the defect first becomes reachable). **The Orchestrator
  routes it.** The module header's sentence at `:27-29` — *"…without emitting a per-row erase"* —
  becomes false with the change and is edited with it.

- ~~**Three test changes ride with that production line, and one of them is not optional.**~~ Merged
  `src/frame.test.ts`'s screen model **throws on any escape it does not implement** (`:187-188`,
  `:232-236`) — a deliberately good design — so it **must** learn `\x1b[K` or the suite goes red.
  `:376`'s `occurrences(redraw, "\x1b") === 2` becomes `2 + (H − 1)` = 24. And the file ~~needs its
  **first narrowing fixture**~~: measured, its entire fixture space yields `W` ∈ {18}.

  > **[CORRECTED 2026-08-11 at task `design-adr-transcription-fixes`. Three errors in the bullet
  > above, each found by a different role, and the corrections are written here rather than in place
  > of the original because the errors are more instructive than the fixes. NO CLAUSE IS RE-OPENED —
  > clause 1's ruling stands exactly as written, and correction (3) is a defence of it, not a
  > retraction.]**
  >
  > **(1) *"the file needs its FIRST narrowing fixture"* is FALSE.** `src/frame.test.ts:735-771`
  > already built one — `expect(widthOf(wide)).toBe(24)` and `expect(widthOf(narrow)).toBe(18)`, both
  > asserted — and it **asserted the DEFECT WAS PRESENT**, being titled *"CHARACTERIZES: `W` is
  > recomputed per frame, so a narrowing frame leaves the wider one's tail."* Found by BA/PM at
  > `refinement-ABC-027-cut` and re-verified at source here: the line range is exact on `main` today.
  > The `W` ∈ {18} sweep is **right and not retracted** — 301 plies × thinking × 4 message shapes — it
  > simply never covered the one test that passes a bespoke `status:` override into `partsFor`. So the
  > consequence is sharper than recorded: **the merged suite holds an assertion that no correct build
  > can satisfy after clause 1.** `ABC-027`'s `A6` has since discharged it and requires it **replaced,
  > never deleted** — both width assertions surviving byte for byte, the `stale` expectation flipped
  > to `[]`. It is the sharpest instance yet of this project's most-recorded defect class, and it is a
  > **tripwire doing its job**: its own comment routes the decision to *"BA/PM +
  > `ABC-016`/`ABC-017`"*, and this ADR is the day it fires.
  >
  > **(2) *"Three test changes"* undercounts, and the miscount hides a MASKING.** Measured at this
  > hop by applying clause 1 to an out-of-tree copy of merged `src/` and running the suite: **four
  > assertion sites, carried by three tests, plus the screen model** — five sites in all. `:374`
  > (`toContain(second.join("\n"))`) and `:376` share the test at `:357`; `:419`
  > (`toBe(frame.join("\n"))`) is in the test at `:406`; `:768` (the characterization) is in the test
  > at `:735`. **`:374` and `:419` are not named by the bullet above at all, and `:374` FAILS FIRST
  > AND MASKS the `:376` the bullet does name.** The screen-model change is the one called
  > not-optional and the measurement confirms it: with it absent **five tests throw**; with it taught
  > `\x1b[K` exactly the three assertion-bearing tests fail. **The count *four tests* recorded in the
  > `refinement-ABC-027-cut` decision note is itself one too many** — its own observation note
  > tabulates four sites, and three tests is what running it yields. Recorded rather than transcribed,
  > because transcribing a count is what produced this bullet.
  >
  > **(3) `:376`'s *"= 24"* is the number for an emission form that has since been REJECTED, and
  > clause 1 is NOT the thing that was wrong.** The Security/NFR gate returned this project's first
  > FAIL on `ABC-027` (`abc027-fail-2026-08-12`). Clause 1 prescribes a **per-row erase**; the
  > delivered form fired it **at the right margin**, and on a real terminal — measured on **GNU screen
  > 5.0.2**, with `xenl` declared by xterm, screen, vt100 and xterm-256color — that **erases the last
  > cell of every row at a window exactly `W` wide**. At `W` = 18 the delivered writer lost the entire
  > h-file and its label from all nine board rows, while merged stayed clean beside it on the same
  > instrument. The fix moves the erase to **column 0**, where the margin state cannot exist.
  >
  > **Clause 1 is not wrong and is not re-opened: it never said WHERE IN THE ROW the erase fires.**
  > It rules that the consumer clears each row as it writes it, and that ruling is untouched — the
  > gate confirmed the ticket's own value on the same emulator, with the narrowing residue gone under
  > the delivered writer. What moves is arithmetic downstream of a placement the clause left open, and
  > it moves by three characters. Re-measured here on both forms at `H` = 23:
  >
  > | emission | `\x1b` count | `\x1b[K` | `\x1b[0J` | cost vs merged |
  > |---|---|---|---|---|
  > | right margin — `CURSOR_HOME + rows.join(EL + "\n") + ED` | 24 = `2 + (H − 1)` | 22 = `H − 1` | 1 | **+66** = `(H − 1) × 3` |
  > | **column 0 — `CURSOR_HOME + EL + rows.join("\n" + EL) + ED`** | **25 = `2 + H`** | **23 = `H`** | 1 | **+69** = `H × 3` |
  >
  > So **`:376` becomes `2 + H` = 25, not 24**, and clause 1's own *"+66 characters (`(H − 1) × 3`)"*
  > — repeated in the `NFR-002` bullet below — is the right-margin figure; the delivered cost is
  > **+69 = `H × 3`**. **Clause 1's text is deliberately NOT edited here**: the byte shape is pinned on
  > a ticket, not in this ADR, and `ABC-027`'s `A1` currently pins the unsafe form byte for byte, so
  > **BA/PM must re-derive `A1` from `H` — never by relaxing it**, since QE measured `A1` as where 9
  > of 14 mutants die. **`NFR-002` does not move**: the gate measured +66 at +0.13/+0.15 µs, 0.0009%
  > of the 16 ms budget, and three more characters do not reach it. The set of broken assertion sites
  > is **identical under both forms** — measured, not assumed; only `:376`'s value differs.

- **`ABC-016` is owed NOTHING that changes a criterion, and needs zero production lines.** The width
  question is answered against it and it is clear. One rationale sentence is stale — `A7`'s stated
  reason, and the panel's own comment at `src/status-panel.ts:95-101`, both justify the reserved
  thinking cell by *"the panel's widest row is the frame's `W` … a cell that shrinks makes the whole
  frame breathe."* True today, no longer the reason after clause 1. **Non-blocking, and named rather
  than edited** — `plans/tickets/` at this boundary is BA/PM's.

- **`ABC-017` is owed ONE ticket-text edit and it is cheap exactly now.** `A2`'s assertion is kept;
  `A2`'s parenthetical claim that the pane *"is expected to be the widest panel and therefore to SET
  `W`"* is struck as **measured false**, and the frame-level justification (*"a pane whose width moves
  makes the whole frame breathe"*) is replaced by the panel-local one. The ticket is **unbuilt, in
  `Ready for Dev`** — this is the moment the edit is free. **Owner BA/PM.**

- **`ABC-019` is owed ONE new acceptance criterion — clause 7's `F3` form — and one explicit
  prohibition (no constant-frame-width criterion).** BA/PM flagged that `ABC-019` *may* be owed
  something if the ruling went the consumer way. **It did, and it is.** A BA/PM agent is live on
  `ABC-019`'s text in another worktree; nothing was written to that ticket here and no channel was
  opened. **Owner BA/PM; the Orchestrator sequences it against that agent's hop.**

- **`ADR-0009` gains a stated scope and loses nothing.** Clause 9 governs **row counts**, and clause 4
  above records the measured property it rests on (`H` is invariant; `W` is not). No clause is struck,
  reworded or reinterpreted, and clause 1 is confirmed for counts by the same measurement that denies
  it for widths.

- **A defect class this project has now recorded six times gets a sixth entry, in a new shape:** *a
  bar that cannot fail on the regression it exists to catch.* Here it is **epic `4b` itself** — worded
  over ROWS, blind to columns at any real terminal width (F1) — and merged `src/frame.test.ts`, whose
  fixtures pin `W` at 18. Neither is a production defect; both are checks that cannot fail.

- **`NFR-002` gains a re-measured denominator note and NO target change.** The `< 16 ms` target does
  not move and no bar is created, moved or loosened. Clause 1 adds **+66 characters per frame,
  exactly and always** — irrelevant against a 16 ms budget, and recorded so the row's serialized-length
  figures are not later read as stale for an unknown reason. Recorded in the catalog's `NFR-002`
  section; **no table row byte is touched.** *(**+66 is the right-margin figure**; the column-0 form
  the Security/NFR gate requires costs **+69** = `H × 3` — see correction (3) above. The target still
  does not move: the gate measured +66 at 0.0009% of the 16 ms budget.)*

- **What this ADR does NOT decide.** `HISTORY_COLS`'s value stays the engineer's, subject to
  `ABC-017`'s stated requirement — clause 6 keeps `A2`, it does not choose a number. Nothing about
  `ABC-019`'s render seam, the message region's packing, or either panel's content changes. And the
  panel's exponential-notation rendering of a loaded `fullmoveNumber` ≥ 1e21 (`White to move  1e+21.`,
  found while bounding the panel's width) is **not this ADR's** — it is the same class `ABC-017` already
  carries as an accepted limitation pointing at `ABC-010`, and it is recorded as an observation only.

## Rollback

Cheap and complete. Revert the one expression in `src/frame.ts`, the screen model's `\x1b[K` case, the
escape-count assertion and the narrowing fixture; the project returns to Alternative C (do nothing) and
re-acquires exactly what `## Context` measures — stale columns on 5–16 of every 20 redraws depending
on the mutant, a wrong material readout, and an expired draw claim persisting for up to 17 frames.

**No panel changes under this ADR, so a rollback cannot break any panel**, and no ticket's delivered
behaviour depends on the clearing: `assembleFrame` is byte-for-byte unaffected and every frame VALUE is
identical with or without clause 1. The only thing that changes either way is what survives on the
terminal between two frames.
